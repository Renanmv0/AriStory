import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { BUILD_WIDTH, type CharacterSpec } from './spec';
import { PALETTE as P } from '../palette';

/**
 * Abertura do braco que segura a mao do outro, em radianos (~43°).
 *
 * Nao e gosto: a mao fica a ~0.44 abaixo do ombro, e com os dois a 0.95 um do
 * outro sobra ~0.30 de vao para cada mao cobrir. `asin(0.30 / 0.44)` da isto.
 * Mexer aqui sem mexer em LADO (entities/MaosDadas.ts) descola as maos.
 */
const ABRE_MAO = 0.75;

/**
 * Monta um personagem chibi (cabeca grande, corpo pequeno) a partir de uma
 * CharacterSpec e anima a caminhada. Nenhum arquivo de modelo envolvido:
 * tudo e primitiva, entao da para iterar o visual so mexendo na ficha.
 *
 * Convencao: o personagem olha para +Z quando rotation.y === 0.
 */
/** Estrela de 5 pontas, usada em presilha e pingente. */
function estrela(raio: number, espessura: number, material: THREE.Material): THREE.Mesh {
  const forma = new THREE.Shape();
  const pontas = 5;
  for (let i = 0; i < pontas * 2; i++) {
    const r = i % 2 === 0 ? raio : raio * 0.46;
    const a = (i / (pontas * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  forma.closePath();
  const geo = new THREE.ExtrudeGeometry(forma, { depth: espessura, bevelEnabled: false });
  geo.center();
  return new THREE.Mesh(geo, material);
}

export class CharacterRig {
  readonly group = new THREE.Group();
  readonly spec: CharacterSpec;

  /** altura do topo da cabeca, util para posicionar baloes e camera */
  readonly headTop: number;

  private readonly body = new THREE.Group();
  private readonly head = new THREE.Group();
  private readonly armL = new THREE.Group();
  private readonly armR = new THREE.Group();
  private readonly legL = new THREE.Group();
  private readonly legR = new THREE.Group();
  private readonly blob: THREE.Mesh;
  /** troféu de ping pong: montado sempre, escondido até alguém ganhar */
  private readonly chapeu = new THREE.Group();

  private phase = 0;
  private bounce = 0;
  private beijo = 0;
  /** -1 segura com o braco em -X, 1 com o de +X, 0 nao esta de maos dadas */
  private maos: -1 | 0 | 1 = 0;
  private targetFacing = 0;
  private swimming = false;
  private sitting = false;

  /** peças que trocam de material entre roupa normal e traje de banho */
  private readonly trocaMaterial: Array<{
    mesh: THREE.Mesh;
    normal: THREE.Material;
    banho: THREE.Material;
  }> = [];
  /** some no traje de banho (laço, cinto, faixa da camiseta, mochila) */
  private readonly soVestido: THREE.Object3D[] = [];
  /** aparece só no traje de banho (o calção) */
  private readonly soBanho: THREE.Object3D[] = [];

  constructor(spec: CharacterSpec) {
    this.spec = spec;
    const h = spec.height;
    const w = BUILD_WIDTH[spec.build];

    const legH = h * 0.28;
    const torsoH = h * 0.3;
    const headR = h * 0.17;
    const hipY = legH;
    const shoulderY = legH + torsoH * 0.86;
    const halfShoulder = h * 0.1 * w;
    const armLen = h * 0.3;

    this.headTop = legH + torsoH + headR * 2.1;

    const skin = toon(spec.skin);
    const shirt = toon(spec.shirt);
    const pants = toon(spec.pants);
    const shoes = toon(spec.shoes);

    // ------------------------------------------------------------- pernas
    for (const [pivot, side] of [
      [this.legL, -1],
      [this.legR, 1],
    ] as const) {
      pivot.position.set(side * h * 0.055 * w, hipY, 0);
      const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.042 * w, legH * 0.62, 4, 10),
        pants,
      );
      leg.position.y = -legH * 0.48;
      pivot.add(leg);
      this.trocaMaterial.push({ mesh: leg, normal: pants, banho: skin });

      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.075 * w, h * 0.045, h * 0.11),
        shoes,
      );
      foot.position.set(0, -legH + h * 0.022, h * 0.018);
      pivot.add(foot);
      this.trocaMaterial.push({ mesh: foot, normal: shoes, banho: skin });
      this.body.add(pivot);
    }

    // ------------------------------------------------------------- torso
    const torso = new THREE.Mesh(
      new THREE.CapsuleGeometry(h * 0.105 * w, torsoH * 0.5, 5, 12),
      shirt,
    );
    torso.position.y = hipY + torsoH * 0.52;
    torso.scale.z = 0.82;
    this.body.add(torso);
    this.trocaMaterial.push({ mesh: torso, normal: shirt, banho: skin });

    if (spec.shirtAccent !== undefined) {
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(h * 0.108 * w, h * 0.108 * w, h * 0.03, 14, 1, true),
        toon(spec.shirtAccent, { doubleSide: true }),
      );
      stripe.position.y = hipY + torsoH * 0.72;
      stripe.scale.z = 0.82;
      this.body.add(stripe);
      this.soVestido.push(stripe);
    }

    // jaqueta aberta por cima da camiseta
    if (spec.jacket !== undefined) {
      const jaquetaMat = toon(spec.jacket, { doubleSide: true });
      const raio = h * 0.105 * w;

      // cilindro vazado com uma fresta na frente: e por ela que a camiseta aparece
      const casco = new THREE.Mesh(
        new THREE.CylinderGeometry(
          raio * 1.14, raio * 1.1, torsoH * 0.66, 16, 1, true,
          Math.PI / 2 + 0.72, Math.PI * 2 - 1.44,
        ),
        jaquetaMat,
      );
      casco.position.y = hipY + torsoH * 0.56;
      casco.scale.z = 0.84;
      this.body.add(casco);
      this.soVestido.push(casco);

      const capuz = new THREE.Mesh(
        new THREE.SphereGeometry(h * 0.088 * w, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
        toon(spec.jacket),
      );
      capuz.position.set(0, shoulderY + torsoH * 0.04, -raio * 0.75);
      capuz.rotation.x = -0.7;
      capuz.scale.set(1.15, 1, 0.8);
      this.body.add(capuz);
      this.soVestido.push(capuz);
    }

    // calção de banho: fica escondido até alguém entrar na água
    const calcao = new THREE.Mesh(
      new THREE.CylinderGeometry(h * 0.118 * w, h * 0.112 * w, h * 0.15, 14),
      toon(spec.swim ?? spec.pants),
    );
    calcao.position.y = hipY + h * 0.03;
    calcao.scale.z = 0.85;
    calcao.visible = false;
    this.body.add(calcao);
    this.soBanho.push(calcao);

    // ------------------------------------------------------------- bracos
    for (const [pivot, side] of [
      [this.armL, -1],
      [this.armR, 1],
    ] as const) {
      pivot.position.set(side * halfShoulder, shoulderY, 0);
      const manga = spec.jacket !== undefined ? toon(spec.jacket) : shirt;
      const sleeve = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.038 * w, armLen * 0.34, 4, 10),
        manga,
      );
      sleeve.position.y = -armLen * 0.24;
      pivot.add(sleeve);
      this.trocaMaterial.push({ mesh: sleeve, normal: manga, banho: skin });

      const forearm = new THREE.Mesh(
        new THREE.CapsuleGeometry(h * 0.032 * w, armLen * 0.28, 4, 10),
        skin,
      );
      forearm.position.y = -armLen * 0.66;
      pivot.add(forearm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(h * 0.04 * w, 10, 8), skin);
      hand.position.y = -armLen * 0.92;
      pivot.add(hand);
      this.body.add(pivot);
    }

    // ------------------------------------------------------------- cabeca
    this.head.position.y = legH + torsoH + headR * 0.92;

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(h * 0.035, h * 0.04, h * 0.05, 10),
      skin,
    );
    neck.position.y = -headR * 0.85;
    this.head.add(neck);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(headR, 20, 16), skin);
    skull.scale.set(1, 1.04, 1.0);
    this.head.add(skull);

    // olhos e bochechas ficam na frente (+Z)
    const eyeMat = toon(spec.eyes);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.14, 10, 8), eyeMat);
      eye.position.set(side * headR * 0.35, 0, headR * 0.9);
      eye.scale.set(1, 1.25, 0.6);
      this.head.add(eye);

      if (spec.blush !== undefined) {
        const blush = new THREE.Mesh(new THREE.CircleGeometry(headR * 0.16, 12), flat(spec.blush, 0.75));
        blush.position.set(side * headR * 0.56, -headR * 0.26, headR * 0.82);
        blush.rotation.y = side * 0.35;
        this.head.add(blush);
      }
    }

    // sobrancelhas: e o que da expressao ao rosto de longe
    const sobrancelha = toon(spec.hair.color);
    for (const side of [-1, 1]) {
      const cenho = new THREE.Mesh(
        new THREE.BoxGeometry(headR * 0.3, headR * 0.075, headR * 0.06),
        sobrancelha,
      );
      cenho.position.set(side * headR * 0.35, headR * 0.3, headR * 0.87);
      cenho.rotation.z = side * -0.12;
      this.head.add(cenho);
    }

    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(headR * 0.16, headR * 0.035, 6, 14, Math.PI),
      eyeMat,
    );
    mouth.position.set(0, -headR * 0.38, headR * 0.9);
    mouth.rotation.set(0, 0, Math.PI);
    this.head.add(mouth);

    this.buildHair(headR);
    this.buildAccessories(headR, armLen, shoulderY, halfShoulder, torsoH, hipY, w);

    this.body.add(this.head);
    this.group.add(this.body);

    // sombra fofa desenhada, alem da sombra real do sol
    this.blob = new THREE.Mesh(
      new THREE.CircleGeometry(h * 0.16 * w, 18),
      flat(0x2b3a2b, 0.22),
    );
    this.blob.rotation.x = -Math.PI / 2;
    this.blob.position.y = 0.02;
    this.group.add(this.blob);

    this.group.traverse((n) => {
      if ((n as THREE.Mesh).isMesh && n !== this.blob) {
        n.castShadow = true;
        n.receiveShadow = false;
      }
    });
  }

  // ------------------------------------------------------------------ cabelo

  private buildHair(headR: number): void {
    const { style, color } = this.spec.hair;
    const mat = toon(color);

    /**
     * Calota de cabelo. `abertura` deixa uma janela na frente do rosto: sem ela
     * a calota e uma esfera inteira e cobre os olhos na visao isometrica.
     * (no SphereGeometry do three, phi = PI/2 aponta para +Z, a frente)
     */
    const cap = (scale: number, y: number, desce = 0.62, abertura = 0) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(
          headR * scale,
          18,
          14,
          Math.PI / 2 + abertura / 2,
          Math.PI * 2 - abertura,
          0,
          Math.PI * desce,
        ),
        mat,
      );
      m.position.y = y;
      this.head.add(m);
      return m;
    };

    switch (style) {
      case 'raspado': {
        cap(1.02, headR * 0.02).scale.set(1, 0.82, 0.96);
        break;
      }
      case 'curto': {
        const c = cap(1.06, headR * 0.04);
        c.scale.set(1, 0.95, 0.98);
        const fringe = new THREE.Mesh(
          new THREE.BoxGeometry(headR * 1.5, headR * 0.34, headR * 0.42),
          mat,
        );
        fringe.position.set(0, headR * 0.6, headR * 0.62);
        fringe.rotation.x = -0.18;
        this.head.add(fringe);
        break;
      }
      case 'franja': {
        cap(1.07, headR * 0.02);
        const fringe = new THREE.Mesh(
          new THREE.CylinderGeometry(headR * 1.05, headR * 1.05, headR * 0.4, 18, 1, false, Math.PI * 0.15, Math.PI * 0.7),
          mat,
        );
        fringe.position.set(0, headR * 0.5, 0);
        this.head.add(fringe);
        break;
      }
      case 'ondulado': {
        cap(1.08, headR * 0.02);
        for (const side of [-1, 1]) {
          const lobe = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.46, 12, 10), mat);
          lobe.position.set(side * headR * 0.85, headR * 0.1, -headR * 0.1);
          lobe.scale.set(0.8, 1.15, 1);
          this.head.add(lobe);
        }
        break;
      }
      case 'coque': {
        cap(1.06, headR * 0.02);
        const bun = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.42, 12, 10), mat);
        bun.position.set(0, headR * 0.72, -headR * 0.82);
        this.head.add(bun);
        break;
      }
      case 'cachos-curtos': {
        // Silhueta oposta a do 'cacheado': volume so no topo, laterais rentes.
        // Os cachos ficam colados no cranio e sao menores, o que da um recorte
        // definido em vez da juba redonda.
        const vol = this.spec.hair.volume ?? 1;
        const pontas = this.spec.hair.tips !== undefined ? toon(this.spec.hair.tips) : mat;
        // A janela da calota tem que ser larga o bastante para os olhos (que
        // ficam a ~21 graus do eixo da frente) e estreita o bastante para nao
        // sobrar couro cabeludo acima da sobrancelha. Quem fecha a testa e a
        // franja, logo abaixo.
        const base = cap(1.0, headR * 0.02, 0.64, 1.15);
        base.scale.set(1.02, 0.96, 1.02);

        // [angulo polar, quantos cachos, raio do cacho, raio da casca]
        const camadas: Array<[number, number, number, number]> = [
          [0.26, 6, 0.3, 0.98],
          [0.62, 10, 0.27, 1.02],
          [0.98, 12, 0.24, 1.02],
          [1.28, 12, 0.2, 1.0],
        ];

        let n = 0;
        for (const [theta, quantos, rCacho, rCasca] of camadas) {
          for (let i = 0; i < quantos; i++) {
            const phi = (i / quantos) * Math.PI * 2 + theta * 1.9;
            const x = Math.sin(theta) * Math.cos(phi);
            const y = Math.cos(theta);
            const z = Math.sin(theta) * Math.sin(phi);
            // a camera olha de cima: cacho adiantado projeta para BAIXO na
            // tela. So passa da metade da cabeca para a frente quem estiver
            // bem alto — mesmo limite que o 'cacheado' usa.
            if (y < 0.72 && z > 0.24) continue;
            const curl = new THREE.Mesh(
              new THREE.SphereGeometry(headR * rCacho * (1 + (vol - 1) * 0.4), 8, 7),
              n % 5 === 0 ? pontas : mat,
            );
            const casca = rCasca * (1 + (vol - 1) * 0.14);
            const frente = z > 0 ? 0.9 : 1.02;
            curl.position.set(x * headR * casca, y * headR * casca, z * headR * casca * frente);
            this.head.add(curl);
            n++;
          }
        }

        // linha do cabelo: fecha a testa logo acima das sobrancelhas
        for (let i = 0; i < 5; i++) {
          const franja = new THREE.Mesh(
            new THREE.SphereGeometry(headR * 0.2 * (1 + (vol - 1) * 0.3), 8, 7),
            i === 2 ? pontas : mat,
          );
          franja.position.set(
            (i - 2) * headR * 0.3,
            headR * (0.62 - (i % 2) * 0.07),
            headR * 0.62,
          );
          this.head.add(franja);
        }

        // topete: puxado para cima e para tras, encostando na franja
        for (let i = 0; i < 3; i++) {
          const tufo = new THREE.Mesh(
            new THREE.SphereGeometry(headR * 0.24 * (1 + (vol - 1) * 0.4), 8, 7),
            i === 1 ? pontas : mat,
          );
          tufo.position.set((i - 1) * headR * 0.3, headR * (0.84 + (i % 2) * 0.07), headR * 0.44);
          this.head.add(tufo);
        }

        // costeleta curtinha na frente da orelha, so pra fechar a silhueta
        for (const side of [-1, 1]) {
          const costeleta = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.17, 8, 7), mat);
          costeleta.position.set(side * headR * 0.9, -headR * 0.12, headR * 0.22);
          costeleta.scale.set(0.7, 1.1, 0.85);
          this.head.add(costeleta);
        }
        break;
      }

      case 'cacheado': {
        // Cachos em casca esferica, camada por camada. `volume` empurra a casca
        // para fora: 0.7 fica colado na cabeca, 1.3 vira juba.
        const vol = this.spec.hair.volume ?? 1;
        const pontas = this.spec.hair.tips !== undefined ? toon(this.spec.hair.tips) : mat;
        const base = cap(1.0 + (vol - 1) * 0.2, headR * 0.02, 0.66, 1.3);
        base.scale.set(1.04, 1, 1.04);

        // [angulo polar, quantos cachos, raio do cacho, raio da casca]
        const camadas: Array<[number, number, number, number]> = [
          [0.30, 7, 0.34, 1.02],
          [0.72, 11, 0.33, 1.10],
          [1.08, 13, 0.31, 1.15],
          [1.44, 13, 0.28, 1.10],
          [1.78, 11, 0.25, 0.98],
        ];

        let n = 0;
        for (const [theta, quantos, rCacho, rCasca] of camadas) {
          for (let i = 0; i < quantos; i++) {
            const phi = (i / quantos) * Math.PI * 2 + theta * 2.3;
            const x = Math.sin(theta) * Math.cos(phi);
            const y = Math.cos(theta);
            const z = Math.sin(theta) * Math.sin(phi);
            // o rosto fica livre: nada na frente abaixo da linha da testa.
            // A camera olha de cima, entao o corte precisa ser generoso —
            // senao o cachao tapa a cara inteira na visao isometrica.
            if (theta > 0.72 && z > 0.22) continue;
            const escala = 1 + (vol - 1) * 0.55;
            const curl = new THREE.Mesh(
              new THREE.SphereGeometry(headR * rCacho * escala, 8, 7),
              n % 4 === 0 ? pontas : mat,
            );
            const casca = rCasca * (1 + (vol - 1) * 0.28);
            // o volume cresce para tras e para os lados, nao para cima do rosto
            const frente = z > 0 ? 0.78 : 1.06;
            curl.position.set(x * headR * casca, y * headR * casca, z * headR * casca * frente);
            this.head.add(curl);
            n++;
          }
        }

        // franja na testa: fica acima da linha dos olhos, senao tapa o rosto
        for (let i = 0; i < 4; i++) {
          const franja = new THREE.Mesh(
            new THREE.SphereGeometry(headR * 0.22 * (1 + (vol - 1) * 0.4), 8, 7),
            i === 1 ? pontas : mat,
          );
          franja.position.set(
            (i - 1.5) * headR * 0.34,
            headR * (0.62 - (i % 2) * 0.08),
            headR * 0.62,
          );
          this.head.add(franja);
        }

        // mechas soltas na frente das orelhas, sem chegar no rosto
        for (const side of [-1, 1]) {
          const mecha = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.26 * vol, 8, 7), mat);
          mecha.position.set(side * headR * 1.02 * vol, -headR * 0.34, headR * 0.28);
          mecha.scale.set(0.8, 1.25, 0.9);
          this.head.add(mecha);
        }
        break;
      }
    }
  }

  // -------------------------------------------------------------- acessorios

  private buildAccessories(
    headR: number,
    armLen: number,
    shoulderY: number,
    halfShoulder: number,
    torsoH: number,
    hipY: number,
    w: number,
  ): void {
    const acc = this.spec.accessories ?? [];
    const accMat = toon(this.spec.accessoryColor ?? 0x2f3440);

    // Chapéu de campeão do ping pong. Não entra na ficha do personagem porque
    // não é jeitão dele: é prêmio, e quem liga é a flag do jogo (setCampeao).
    {
      // A altura é medida pelo CABELO, não pelo crânio: a juba do Ari sobe até
      // ~1.35 × headR, e chapéu apoiado no crânio simplesmente some dentro dela.
      const aba = new THREE.Mesh(
        new THREE.CylinderGeometry(headR * 0.7, headR * 0.7, headR * 0.11, 16),
        toon(0xfff3d0),
      );
      aba.position.y = headR * 1.42;
      this.chapeu.add(aba);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(headR * 0.58, headR * 1.05, 14),
        toon(P.gold),
      );
      cone.position.y = headR * 1.98;
      this.chapeu.add(cone);

      const pompom = estrela(headR * 0.3, headR * 0.07, toon(0xfff3d0));
      pompom.position.y = headR * 2.62;
      this.chapeu.add(pompom);

      this.chapeu.rotation.z = -0.14; // torto, que é mais engraçado que reto
      this.chapeu.visible = false;
      this.head.add(this.chapeu);
    }

    if (acc.includes('oculos')) {
      for (const side of [-1, 1]) {
        const lens = new THREE.Mesh(
          new THREE.TorusGeometry(headR * 0.24, headR * 0.045, 8, 16),
          accMat,
        );
        lens.position.set(side * headR * 0.36, headR * 0.06, headR * 0.9);
        this.head.add(lens);
      }
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(headR * 0.3, headR * 0.05, headR * 0.05),
        accMat,
      );
      bridge.position.set(0, headR * 0.06, headR * 0.92);
      this.head.add(bridge);
    }

    if (acc.includes('bone')) {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(headR * 1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
        accMat,
      );
      dome.position.y = headR * 0.1;
      this.head.add(dome);
      const visor = new THREE.Mesh(
        new THREE.CylinderGeometry(headR * 1.05, headR * 1.05, headR * 0.08, 16, 1, false, Math.PI * 0.15, Math.PI * 0.7),
        accMat,
      );
      visor.position.set(0, headR * 0.12, headR * 0.28);
      visor.rotation.x = -0.12;
      this.head.add(visor);
    }

    if (acc.includes('barba')) {
      const beard = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.72, 14, 12), toon(this.spec.hair.color));
      beard.position.set(0, -headR * 0.42, headR * 0.28);
      beard.scale.set(1, 0.72, 0.85);
      this.head.add(beard);
    }

    if (acc.includes('fone')) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(headR * 1.05, headR * 0.08, 8, 20, Math.PI), accMat);
      band.position.y = headR * 0.05;
      band.rotation.z = Math.PI / 2;
      band.rotation.y = Math.PI / 2;
      this.head.add(band);
      for (const side of [-1, 1]) {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(headR * 0.28, headR * 0.28, headR * 0.16, 12), accMat);
        cup.position.set(side * headR * 1.02, headR * 0.02, 0);
        cup.rotation.z = Math.PI / 2;
        this.head.add(cup);
      }
    }

    if (acc.includes('corrente')) {
      const chain = new THREE.Mesh(
        new THREE.TorusGeometry(headR * 0.42, headR * 0.035, 6, 20),
        toon(0xffc94d, { glow: 0.2 }),
      );
      chain.position.y = -headR * 0.95;
      chain.rotation.x = Math.PI / 2;
      this.head.add(chain);
    }

    if (acc.includes('relogio')) {
      const watch = new THREE.Mesh(
        new THREE.CylinderGeometry(this.spec.height * 0.035, this.spec.height * 0.035, this.spec.height * 0.018, 10),
        accMat,
      );
      watch.position.y = -armLen * 0.8;
      watch.rotation.z = Math.PI / 2;
      this.armL.add(watch);
    }

    if (acc.includes('presilha')) {
      // fica por cima dos cachos, senao some dentro do cabelo
      const vol = this.spec.hair.volume ?? 1;
      const presilha = estrela(headR * 0.3, headR * 0.06, toon(0xf2e6cf));
      presilha.position.set(-headR * 0.78 * vol, headR * 0.92 * vol, headR * 0.62 * vol);
      presilha.rotation.set(0.35, -0.6, 0.3);
      this.head.add(presilha);
    }

    if (acc.includes('laco')) {
      const h = this.spec.height;
      const laco = new THREE.Group();
      const raioTorso = h * 0.105 * w;

      const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.018, 8, 6), accMat);
      laco.add(no);
      for (const side of [-1, 1]) {
        const alca = new THREE.Mesh(new THREE.TorusGeometry(h * 0.026, h * 0.007, 6, 12), accMat);
        alca.position.set(side * h * 0.03, h * 0.008, 0);
        alca.rotation.set(0, side * 0.5, side * 0.35);
        alca.scale.set(1, 0.7, 1);
        laco.add(alca);

        const fita = new THREE.Mesh(
          new THREE.BoxGeometry(h * 0.012, h * 0.075, h * 0.006),
          accMat,
        );
        fita.position.set(side * h * 0.016, -h * 0.045, 0);
        fita.rotation.z = side * 0.22;
        laco.add(fita);
      }
      laco.position.set(0, shoulderY - torsoH * 0.1, raioTorso * 0.86);
      this.body.add(laco);
      this.soVestido.push(laco);
    }

    if (acc.includes('cinto')) {
      const h = this.spec.height;
      const raioTorso = h * 0.105 * w;
      const cintura = hipY + torsoH * 0.08;

      const tira = new THREE.Mesh(
        new THREE.CylinderGeometry(raioTorso * 1.04, raioTorso * 1.04, h * 0.032, 16, 1, true),
        accMat,
      );
      tira.position.y = cintura;
      tira.scale.z = 0.84;
      this.body.add(tira);
      this.soVestido.push(tira);

      const fivela = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.032, h * 0.03, h * 0.012),
        toon(0xd8d4cc),
      );
      fivela.position.set(0, cintura, raioTorso * 0.9);
      this.body.add(fivela);
      this.soVestido.push(fivela);

      // correntinha com estrela, do jeito que aparece na referencia
      const corrente = new THREE.Mesh(
        new THREE.TorusGeometry(h * 0.028, h * 0.004, 5, 12, Math.PI),
        toon(0xd8d4cc),
      );
      corrente.position.set(raioTorso * 0.6, cintura - h * 0.012, raioTorso * 0.6);
      corrente.rotation.set(0, -0.7, Math.PI);
      this.body.add(corrente);
      this.soVestido.push(corrente);

      const pingente = estrela(h * 0.016, h * 0.004, toon(0xd8d4cc));
      pingente.position.set(raioTorso * 0.76, cintura - h * 0.05, raioTorso * 0.66);
      pingente.rotation.y = -0.7;
      this.body.add(pingente);
      this.soVestido.push(pingente);
    }

    if (acc.includes('mochila')) {
      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(halfShoulder * 1.7, torsoH * 0.62, this.spec.height * 0.09),
        accMat,
      );
      bag.position.set(0, hipY + torsoH * 0.6, -this.spec.height * 0.11 * w);
      this.body.add(bag);
      this.soVestido.push(bag);
      const strapY = shoulderY;
      for (const side of [-1, 1]) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(this.spec.height * 0.022, torsoH * 0.5, this.spec.height * 0.02),
          accMat,
        );
        strap.position.set(side * halfShoulder * 0.6, strapY - torsoH * 0.2, this.spec.height * 0.085 * w);
        this.body.add(strap);
        this.soVestido.push(strap);
      }
    }
  }

  // ------------------------------------------------------------------ animar

  /** angulo alvo em radianos; o rig gira suavemente ate la */
  setFacing(angle: number): void {
    this.targetFacing = angle;
  }

  get facing(): number {
    return this.group.rotation.y;
  }

  /** faz o personagem pular de alegria uma vez */
  cheer(): void {
    this.bounce = 1;
  }

  /** Liga o chapéu de campeão do ping pong (prêmio, não parte da ficha). */
  setCampeao(v: boolean): void {
    this.chapeu.visible = v;
  }

  get campeao(): boolean {
    return this.chapeu.visible;
  }

  /**
   * Troca entre a roupa da ficha e o traje de banho (sem camisa e de calção).
   * Quase tudo e troca de material: a camiseta e a calca viram pele, o tenis
   * vira pe descalco, os acessorios de roupa somem e o calcao aparece.
   */
  setOutfit(traje: 'normal' | 'banho'): void {
    const banho = traje === 'banho';
    for (const troca of this.trocaMaterial) {
      troca.mesh.material = banho ? troca.banho : troca.normal;
    }
    for (const peca of this.soVestido) peca.visible = !banho;
    for (const peca of this.soBanho) peca.visible = banho;
  }

  /** Sentado: pernas para a frente e corpo mais baixo. */
  setSitting(v: boolean): void {
    this.sitting = v;
    if (!v) {
      this.body.position.y = 0;
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.armL.rotation.set(0, 0, 0.08);
      this.armR.rotation.set(0, 0, -0.08);
    }
  }

  /**
   * De maos dadas: qual braco esta "por dentro", segurando a mao do outro.
   *
   * `-1` = o parceiro esta a esquerda do personagem, entao quem segura e o
   * braco em `-X` (o `armL`); `1` = esta a direita e segura o `armR`; `0`
   * desliga. Quem decide o lado e a mecanica em entities/MaosDadas.ts, que sabe
   * onde os dois estao; o rig so obedece.
   */
  setHoldingHands(lado: -1 | 0 | 1): void {
    this.maos = lado;
  }

  get holdingHands(): boolean {
    return this.maos !== 0;
  }

  /**
   * Inclinacao do beijo: 0 e parado normal, 1 e inclinado para a frente na
   * pontinha do pe. Quem controla a curva e a mecanica em entities/Beijo.ts.
   */
  setKiss(valor: number): void {
    this.beijo = Math.max(0, Math.min(1, valor));
  }

  get kissing(): boolean {
    return this.beijo > 0.001;
  }

  /** dentro da agua: bracada em vez de caminhada, e sem sombra no chao */
  setSwimming(v: boolean): void {
    if (this.swimming === v) return;
    this.swimming = v;
    this.blob.visible = !v;
  }

  /**
   * @param dt delta em segundos
   * @param speed velocidade horizontal atual em unidades/s (0 = parado)
   */
  update(dt: number, speed: number): void {
    // giro suave para o angulo alvo, pelo caminho mais curto
    let delta = this.targetFacing - this.group.rotation.y;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    this.group.rotation.y += delta * Math.min(1, dt * 14);

    // o beijo manda em tudo enquanto dura: inclina o tronco e a cabeca para a
    // frente e recolhe os bracos, sem passo nenhum
    if (this.beijo > 0.001) {
      const k = this.beijo;
      this.phase += dt * 1.2;
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.body.rotation.x = k * 0.3;
      this.body.position.y = k * 0.045; // na pontinha do pe
      this.armL.rotation.set(-k * 0.55, 0, 0.08 + k * 0.16);
      this.armR.rotation.set(-k * 0.55, 0, -0.08 - k * 0.16);
      this.head.rotation.x = k * 0.18;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
      return;
    }

    if (this.sitting) {
      this.phase += dt * 0.9;
      this.legL.rotation.x = -Math.PI / 2 + 0.06;
      this.legR.rotation.x = -Math.PI / 2 - 0.02;
      this.armL.rotation.set(-0.25, 0, 0.34);
      this.armR.rotation.set(-0.2, 0, -0.34);
      this.body.rotation.x = -0.05;
      this.body.position.y = Math.sin(this.phase) * 0.012;
      this.head.rotation.x = Math.sin(this.phase * 0.7) * 0.03;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
      return;
    }

    if (this.swimming) {
      this.phase += dt * (2.6 + speed * 1.2);
      const s = Math.sin(this.phase * 2);
      // bracada alternada e pernada curtinha
      this.armL.rotation.x = -1.1 + s * 0.9;
      this.armR.rotation.x = -1.1 - s * 0.9;
      this.armL.rotation.z = 0.5;
      this.armR.rotation.z = -0.5;
      this.legL.rotation.x = s * 0.28;
      this.legR.rotation.x = -s * 0.28;
      this.body.rotation.x = 0.16;
      this.body.position.y = Math.sin(this.phase) * 0.03;
      this.head.rotation.x = -0.14;
      return;
    }

    const walking = speed > 0.05;
    this.phase += dt * (walking ? 3.2 + speed * 1.9 : 1.4);

    const swing = walking ? Math.min(0.62, 0.16 + speed * 0.14) : 0.04;
    const s = Math.sin(this.phase * (walking ? 2 : 1));

    this.legL.rotation.x = walking ? s * swing : 0;
    this.legR.rotation.x = walking ? -s * swing : 0;
    this.armL.rotation.x = walking ? -s * swing * 0.85 : Math.sin(this.phase) * 0.05;
    this.armR.rotation.x = walking ? s * swing * 0.85 : -Math.sin(this.phase) * 0.05;
    this.armL.rotation.z = 0.08;
    this.armR.rotation.z = -0.08;

    // De maos dadas o braco de dentro para de balancar e abre para o lado do
    // outro, ate as duas maos se encontrarem no meio do vao. O braco de fora
    // continua a caminhada, com metade da amplitude — e esse contraste que faz
    // ler como "estao de maos dadas" e nao como "estao engessados".
    if (this.maos !== 0) {
      const dentro = this.maos < 0 ? this.armL : this.armR;
      const fora = this.maos < 0 ? this.armR : this.armL;
      // z positivo joga a mao para +X; o braco de dentro sempre abre na
      // direcao do parceiro
      dentro.rotation.z = ABRE_MAO * this.maos;
      dentro.rotation.x = -0.1;
      fora.rotation.x *= 0.5;
    }

    // pulinho de comemoracao
    if (this.bounce > 0) {
      this.bounce = Math.max(0, this.bounce - dt * 1.6);
      const b = Math.sin((1 - this.bounce) * Math.PI) * 0.28;
      this.body.position.y = b;
      this.head.rotation.z = Math.sin((1 - this.bounce) * Math.PI * 2) * 0.12;
    } else {
      const bob = walking ? Math.abs(Math.cos(this.phase * 2)) * 0.035 : Math.sin(this.phase) * 0.012;
      this.body.position.y = bob;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
    }

    this.body.rotation.x = walking ? 0.06 : 0;
    this.head.rotation.x = walking ? -0.05 : Math.sin(this.phase * 0.6) * 0.03;
  }

  dispose(): void {
    this.group.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
  }
}
