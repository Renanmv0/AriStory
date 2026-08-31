import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { BUILD_WIDTH, type CharacterSpec } from './spec';
import { patins as patinsMesh } from '../world/props';
import {
  SLOTS_ROUPA,
  type HoldPose,
  type ItemDef,
  type Loadout,
  type MedidasCorpo,
  type SlotRoupa,
} from '../core/types';
import { fichaDoItem } from '../world/itens';
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
 * Altura da sola do patins, na escala nativa da peca em `props.ts`.
 *
 * As rodas ficam entre 0 e 0.09 e o chassi vai ate 0.13 — e desse ultimo que a
 * bota parte. E quanto a pessoa cresce ao calcar.
 */
const SOLA_PATINS = 0.13;

/**
 * As duas poses de segurar.
 *
 * ## O sinal do Z
 *
 * O braco direito nasce em `x = +halfShoulder` (0.148), e `rotation.z`
 * POSITIVO joga a mao para +X, ou seja para FORA do corpo. Negativo joga para
 * dentro — foi esse o bug que fazia o frisbee atravessar o tronco inteiro.
 *
 * `bracoX` negativo levanta o braco para a frente; `balanco` e quanto sobra do
 * balanco da caminhada NAQUELE braco (zero engessa o boneco, cheio faz o
 * sorvete voar); `itemZ` inclina o objeto dentro da mao e `itemX` o afasta
 * lateralmente.
 */
const POSES = {
  // esticado para a frente, com o objeto em pe: sorvete, suco
  upright: { bracoX: -1.38, bracoZ: 0.16, balanco: 0.15, itemZ: 0, itemX: 0 },
  /**
   * Frisbee: braco levemente para FORA e um tico para a frente.
   *
   * O disco tem raio 0.28 e o ombro esta a 0.148 do eixo do corpo. So girar o
   * braco nao basta: com z = 0.46 a mao chega a x = 0.37, e a metade de dentro
   * do disco (0.28 x cos 0.9 = 0.17) ainda raspa no tronco. Dai o `itemX`, que
   * empurra o disco mais para fora dentro da propria mao.
   *
   * `itemZ` 0.9 e nao PI/2.4: de perfil o disco vira um risco na tela, e a essa
   * distancia de camera ninguem reconhece um frisbee de canto.
   */
  relaxed: { bracoX: -0.22, bracoZ: 0.46, balanco: 0.6, itemZ: 0.9, itemX: 0.13 },
} as const;

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
  /** encaixe do objeto segurado, na ponta do braco direito */
  private readonly maoDir = new THREE.Group();
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
  /** pose do item que a mao direita esta segurando */
  private pose: HoldPose = 'none';
  /** de patins: muda a caminhada e levanta o corpo em `altoDoPatins` */
  private patinando = false;
  /** quanto a sola do patins levanta a pessoa do chao */
  private altoDoPatins = 0;
  /** comprimento da perna, guardado para o patins achar o chao */
  private alturaDaPerna = 0;
  private readonly pes: THREE.Mesh[] = [];
  private readonly patins: THREE.Group[] = [];
  private targetFacing = 0;
  private swimming = false;
  private sitting = false;

  /**
   * Peças que trocam de material entre roupa normal e traje de banho.
   *
   * O `slot` e a `parte` são do guarda-roupa: dizem qual peça do acervo pinta
   * esta malha, quando houver uma. Sem peça vestida, os dois campos não fazem
   * nada e a lista se comporta exatamente como antes.
   */
  private readonly trocaMaterial: Array<{
    mesh: THREE.Mesh;
    normal: THREE.Material;
    banho: THREE.Material;
    slot: SlotRoupa;
    parte: 'principal' | 'detalhe';
  }> = [];
  /** some no traje de banho (laço, cinto, faixa da camiseta, mochila) */
  private readonly soVestido: THREE.Object3D[] = [];
  /** aparece só no traje de banho (o calção) */
  private readonly soBanho: THREE.Object3D[] = [];

  // --- guarda-roupa
  /** traje da cena, guardado em vez de aplicado direto — ver `aplicarVisual` */
  private traje: 'normal' | 'banho' = 'normal';
  /** o loadout já resolvido pelo catálogo */
  private roupa: Partial<Record<SlotRoupa, ItemDef>> = {};
  /** a geometria extra de cada slot que tem uma (só cabeça e pés) */
  private readonly extras = new Map<SlotRoupa, THREE.Object3D[]>();
  private readonly medidas: MedidasCorpo;
  /**
   * Peças de tronco da FICHA que uma roupa do acervo cobre.
   *
   * A listra, o casco da jaqueta e o capuz — sem isto, vestir uma camisa no
   * Renan repinta o torso e o moletom continua por cima, tapando tudo. E também
   * o laço e o cinto do Ari: sobre um vestido rosa, um laço preto e uma
   * correntinha de estrela ficariam flutuando sem dono.
   *
   * A MOCHILA entra também. Eu tinha deixado ela de fora achando que mochila
   * por cima de roupa é acessório e não conflito — mas as alças dela cruzam o
   * PEITO, e por cima de um vestido elas atravessam o pano em vez de pousar.
   */
  private readonly sobreTronco: THREE.Object3D[] = [];
  /** o cabelo inteiro, para um gorro poder achatá-lo */
  private readonly cabelo: THREE.Object3D[];

  constructor(spec: CharacterSpec) {
    this.spec = spec;
    const h = spec.height;
    const w = BUILD_WIDTH[spec.build];

    const legH = h * 0.28;
    // o patins tem 0.405 de altura na escala nativa; a peca acompanha o tamanho
    // da pessoa para nao virar sapato de palhaco em quem e mais baixo
    const escalaPatins = h / 1.7;
    this.altoDoPatins = SOLA_PATINS * escalaPatins;
    this.alturaDaPerna = legH;
    const torsoH = h * 0.3;
    const headR = h * 0.17;
    const hipY = legH;
    const shoulderY = legH + torsoH * 0.86;
    const halfShoulder = h * 0.1 * w;
    const armLen = h * 0.3;

    this.headTop = legH + torsoH + headR * 2.1;
    // o que as fábricas de roupa recebem; elas não veem o rig, só números
    this.medidas = { h, w, headR, legH, torsoH };

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
      this.trocaMaterial.push({
        mesh: leg, normal: pants, banho: skin, slot: 'pernas', parte: 'principal',
      });

      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.075 * w, h * 0.045, h * 0.11),
        shoes,
      );
      foot.position.set(0, -legH + h * 0.022, h * 0.018);
      pivot.add(foot);
      this.trocaMaterial.push({
        mesh: foot, normal: shoes, banho: skin, slot: 'pes', parte: 'principal',
      });
      this.pes.push(foot);

      // O patins nasce escondido e SUBSTITUI o pe: a bota engole o tornozelo,
      // entao o tenis por dentro apareceria pela costura. A peca tem a sola das
      // rodas em y = 0, e por isso ela desce ate o chao do rig — que, de
      // patins, esta `this.altoDoPatins` abaixo do pe.
      const roda = patinsMesh(spec.shoes);
      roda.scale.setScalar(escalaPatins);
      roda.visible = false;
      pivot.add(roda);
      this.patins.push(roda);

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
    this.trocaMaterial.push({
      mesh: torso, normal: shirt, banho: skin, slot: 'tronco', parte: 'principal',
    });

    if (spec.shirtAccent !== undefined) {
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(h * 0.108 * w, h * 0.108 * w, h * 0.03, 14, 1, true),
        toon(spec.shirtAccent, { doubleSide: true }),
      );
      stripe.position.y = hipY + torsoH * 0.72;
      stripe.scale.z = 0.82;
      this.body.add(stripe);
      this.soVestido.push(stripe);
      this.sobreTronco.push(stripe);
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
      this.sobreTronco.push(casco);

      const capuz = new THREE.Mesh(
        new THREE.SphereGeometry(h * 0.088 * w, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
        toon(spec.jacket),
      );
      capuz.position.set(0, shoulderY + torsoH * 0.04, -raio * 0.75);
      capuz.rotation.x = -0.7;
      capuz.scale.set(1.15, 1, 0.8);
      this.body.add(capuz);
      this.soVestido.push(capuz);
      this.sobreTronco.push(capuz);
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
      this.trocaMaterial.push({
        mesh: sleeve, normal: manga, banho: skin, slot: 'tronco', parte: 'detalhe',
      });

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

    // O que a pessoa segura vira FILHO da mao direita. E essa a diferenca para
    // o jeito antigo (a cena recalculava a posicao do sorvete a cada quadro):
    // pendurado no braco, o item herda a caminhada e a pose de graca.
    this.maoDir.position.y = -armLen * 0.98;
    this.armR.add(this.maoDir);

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

    // O cabelo é recortado por FATIA em vez de por 20 `push` dentro do
    // `buildHair`: tudo que ele acrescenta vira filho da cabeça, então o que
    // entrou entre estas duas marcas é cabelo e nada mais. Assim `buildHair`
    // continua sem saber que existe um guarda-roupa.
    const antesDoCabelo = this.head.children.length;
    this.buildHair(headR);
    this.cabelo = this.head.children.slice(antesDoCabelo);
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
      this.sobreTronco.push(laco);
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
      this.sobreTronco.push(tira);

      const fivela = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.032, h * 0.03, h * 0.012),
        toon(0xd8d4cc),
      );
      fivela.position.set(0, cintura, raioTorso * 0.9);
      this.body.add(fivela);
      this.soVestido.push(fivela);
      this.sobreTronco.push(fivela);

      // correntinha com estrela, do jeito que aparece na referencia
      const corrente = new THREE.Mesh(
        new THREE.TorusGeometry(h * 0.028, h * 0.004, 5, 12, Math.PI),
        toon(0xd8d4cc),
      );
      corrente.position.set(raioTorso * 0.6, cintura - h * 0.012, raioTorso * 0.6);
      corrente.rotation.set(0, -0.7, Math.PI);
      this.body.add(corrente);
      this.soVestido.push(corrente);
      this.sobreTronco.push(corrente);

      const pingente = estrela(h * 0.016, h * 0.004, toon(0xd8d4cc));
      pingente.position.set(raioTorso * 0.76, cintura - h * 0.05, raioTorso * 0.66);
      pingente.rotation.y = -0.7;
      this.body.add(pingente);
      this.soVestido.push(pingente);
      this.sobreTronco.push(pingente);
    }

    if (acc.includes('mochila')) {
      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(halfShoulder * 1.7, torsoH * 0.62, this.spec.height * 0.09),
        accMat,
      );
      bag.position.set(0, hipY + torsoH * 0.6, -this.spec.height * 0.11 * w);
      this.body.add(bag);
      this.soVestido.push(bag);
      this.sobreTronco.push(bag);
      const strapY = shoulderY;
      for (const side of [-1, 1]) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(this.spec.height * 0.022, torsoH * 0.5, this.spec.height * 0.02),
          accMat,
        );
        strap.position.set(side * halfShoulder * 0.6, strapY - torsoH * 0.2, this.spec.height * 0.085 * w);
        this.body.add(strap);
        this.soVestido.push(strap);
        this.sobreTronco.push(strap);
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
   *
   * O traje agora e GUARDADO em vez de aplicado direto. Quem escreve material e
   * so o `aplicarVisual`; ver o comentario la embaixo para o porque.
   */
  setOutfit(traje: 'normal' | 'banho'): void {
    this.traje = traje;
    this.aplicarVisual();
  }

  // --- guarda-roupa ---------------------------------------------------------

  /**
   * O ÚNICO lugar que escreve material e visibilidade de roupa.
   *
   * O erro obvio deste sistema seria o guarda-roupa tambem escrever
   * `mesh.material` direto. Ele e o `setOutfit` brigariam pelo mesmo campo e
   * quem rodasse por ultimo ganharia: sair da piscina chama `setOutfit(
   * 'normal')`, que restaura a cor da FICHA, e a camisa vestida sumiria.
   *
   * Entao ninguem aplica nada: `traje`, `roupa` e `patinando` sao tres estados
   * guardados, e este metodo compoe os tres. A propriedade que isso da e que a
   * ORDEM DAS CHAMADAS deixa de importar — `setOutfit`, `setPatins` e
   * `vestirRoupa` convergem todos aqui, entao o quadro termina no mesmo estado
   * venha na ordem que vier.
   */
  private aplicarVisual(): void {
    const banho = this.traje === 'banho';

    // Nunca mutar `mat.color`: os materiais de `materials.ts` sao CACHEADOS POR
    // COR e compartilhados com o mundo inteiro — repintar um material repinta
    // todo objeto do jogo que usa aquela cor. Sempre trocar a referencia.
    for (const t of this.trocaMaterial) {
      if (banho) {
        t.mesh.material = t.banho;
        continue;
      }
      // A pele a mostra e decidida pelo LOADOUT INTEIRO, nao pela peca daquele
      // slot: quem manda deixar a perna nua e o vestido, que mora no tronco.
      // `t.banho` ja e `toon(spec.skin)` — a mesma pele do traje de banho.
      if (this.mostraPele(t.slot, t.parte)) {
        t.mesh.material = t.banho;
        continue;
      }
      const peca = this.roupa[t.slot];
      if (!peca) {
        t.mesh.material = t.normal;
        continue;
      }
      // vestivel sem cor (o chapeu de campeao, os patins) nao pinta o corpo:
      // ele so acrescenta peca. Sem esta saida, calcar patins apagaria a cor
      // da calca.
      const cor = t.parte === 'detalhe' ? (peca.corDetalhe ?? peca.cor) : peca.cor;
      t.mesh.material = cor === undefined ? t.normal : toon(cor);
    }

    for (const peca of this.soVestido) peca.visible = !banho;
    for (const peca of this.soBanho) peca.visible = banho;
    // camisa do acervo cobre a roupa de tronco da ficha
    if (!banho && this.roupa.tronco) {
      for (const peca of this.sobreTronco) peca.visible = false;
    }

    for (const [slot, objs] of this.extras) {
      const liga = this.roupa[slot] !== undefined
        // gorro sobrevive ao banho — e o mesmo precedente do chapeu de campeao,
        // que ja fica na cabeca dentro da agua. Bota, nao.
        && (slot === 'cabeca' || !banho)
        // o patins engole o tornozelo inteiro: o cano da bota apareceria pela
        // costura, igual ao tenis apareceria
        && !(slot === 'pes' && this.patinando);
      for (const o of objs) o.visible = liga;
    }

    for (const pe of this.pes) pe.visible = !this.patinando;
    for (const p of this.patins) p.visible = this.patinando;

    // gorro achata o cabelo, pelo mesmo motivo que o patins engole o pe
    const daCabeca = this.roupa.cabeca;
    const some = daCabeca?.cobreCabelo === true;
    for (const fio of this.cabelo) fio.visible = !some;
  }

  /**
   * Esta parte do corpo fica nua?
   *
   * Varre o loadout inteiro porque a marca mora numa peca e o efeito cai em
   * outra parte: o vestido e do tronco e e ele que deixa a PERNA nua.
   */
  private mostraPele(slot: SlotRoupa, parte: 'principal' | 'detalhe'): boolean {
    for (const peca of Object.values(this.roupa)) {
      if (!peca) continue;
      // "perna nua" quer dizer que o VESTIDO nao cobre a perna — nao que nada
      // possa cobrir. Uma meia vestida ganha da marca, senao o vestido
      // apagaria a meia que veio junto com ele no mesmo conjunto.
      if (peca.pernasNuas && slot === 'pernas' && !this.roupa.pernas) return true;
      // a manga e o `detalhe` do tronco; o torso continua vestido
      if (peca.bracosNus && slot === 'tronco' && parte === 'detalhe') return true;
    }
    return false;
  }

  /**
   * Veste o loadout inteiro de uma vez.
   *
   * O diff e POR SLOT: um slot que nao mudou nao derruba nem reconstroi nada.
   * Sem isso o `Game`, que chama isto todo quadro, recriaria geometria a 60 fps.
   */
  vestirRoupa(novo: Loadout): void {
    for (const slot of SLOTS_ROUPA) {
      const id = novo[slot] ?? null;
      if ((this.roupa[slot]?.id ?? null) === id) continue;
      this.tirarExtras(slot);
      const peca = id ? fichaDoItem(id) : null;
      this.roupa[slot] = peca ?? undefined;
      if (peca?.extra) this.porExtras(slot, peca);
    }
    this.aplicarVisual();
  }

  /** O que este corpo esta vestindo agora. */
  get roupaAtual(): Loadout {
    const l: Loadout = {};
    for (const slot of SLOTS_ROUPA) {
      const peca = this.roupa[slot];
      if (peca) l[slot] = peca.id;
    }
    return l;
  }

  /**
   * Pendura a geometria da peca.
   *
   * Onde ela entra nao e detalhe — cada slot pendura no ponto que ja tem dono:
   *
   * - `cabeca` na cabeca, onde o chapeu de campeao mora;
   * - `pernas` e `pes` nos pivos das pernas, onde o patins mora, uma copia em
   *   cada, para dobrarem junto com a perna;
   * - `tronco` no CORPO, onde a jaqueta e o calcao de banho moram;
   * - e o `extraBraco`, quando houver, nos dois pivos de braco.
   *
   * O corpo nao e pivo de membro: ele so gira um pouco em X e sobe e desce em
   * Y. Uma saia pendurada nele acompanha o quadril e nao encosta na matematica
   * de rotacao da perna — que continua sendo a unica coisa proibida aqui.
   *
   * Antes isto era um ternario de duas vias e TUDO que nao fosse `pes` caia na
   * cabeca: um vestido teria nascido no pescoco.
   */
  private porExtras(slot: SlotRoupa, peca: ItemDef): void {
    if (!peca.extra && !peca.extraBraco) return;
    const pais: Array<[THREE.Object3D, 'corpo' | 'braco']> = [];
    if (peca.extra) {
      const onde: THREE.Object3D[] =
        // pernas E pes vao para os pivos das pernas, uma copia em cada: a liga
        // de uma meia tem que dobrar junto com a coxa, igual ao cano da bota
        slot === 'pes' || slot === 'pernas' ? [this.legL, this.legR]
        : slot === 'cabeca' ? [this.head]
        : [this.body];
      for (const o of onde) pais.push([o, 'corpo']);
    }
    // a manga vai no PIVO do braco, para acompanhar o balanco
    if (peca.extraBraco) {
      pais.push([this.armL, 'braco'], [this.armR, 'braco']);
    }
    const postos: THREE.Object3D[] = [];
    for (const [pai, tipo] of pais) {
      // uma malha NOVA por pai: o mesmo Object3D nao pode ter dois pais, que e
      // a mesma razao de `modeloDoItem` nunca devolver a mesma instancia
      const obj = tipo === 'braco'
        ? peca.extraBraco!(this.medidas)
        : peca.extra!(this.medidas);
      // etiqueta para o teste conseguir dizer o que cada corpo esta vestindo
      obj.userData.roupa = peca.id;
      // o `traverse` que liga sombra roda no CONSTRUTOR, entao nada criado
      // depois herda isso sozinho
      obj.traverse((n: THREE.Object3D) => {
        if ((n as THREE.Mesh).isMesh) {
          n.castShadow = true;
          n.receiveShadow = false;
        }
      });
      pai.add(obj);
      postos.push(obj);
    }
    this.extras.set(slot, postos);
  }

  private tirarExtras(slot: SlotRoupa): void {
    const objs = this.extras.get(slot);
    if (!objs) return;
    for (const obj of objs) {
      obj.parent?.remove(obj);
      obj.traverse((n: THREE.Object3D) => {
        // so a geometria. O material e o objeto cacheado de `materials.ts`,
        // compartilhado com o jogo inteiro — dar dispose nele apaga a cor de
        // todo mundo que a usa
        const m = n as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
    }
    this.extras.delete(slot);
  }

  // --- fim guarda-roupa -----------------------------------------------------

  /** Sentado: pernas para a frente e corpo mais baixo. */
  setSitting(v: boolean): void {
    this.sitting = v;
    if (!v) {
      this.poeAltura(0);
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.armL.rotation.set(0, 0, 0.08);
      this.armR.rotation.set(0, 0, -0.08);
    }
  }

  /**
   * Calca (ou tira) os patins.
   *
   * Quem manda e o inventario: o `Game` le a vaga de acessorio e carimba isto
   * todo quadro. O rig so obedece — nao ha estado de patins fora do save.
   */
  setPatins(v: boolean): void {
    if (this.patinando === v) return;
    this.patinando = v;
    // a peca desce ate o chao novo: o corpo sobe `altoDoPatins`, entao no
    // referencial da perna o chao ficou essa distancia mais para baixo
    for (const p of this.patins) p.position.y = -this.alturaDaPerna - this.altoDoPatins;
    // quem liga e desliga a visibilidade do pe, do patins e da bota do acervo e
    // o `aplicarVisual`, para os tres nao brigarem pelo mesmo campo
    this.aplicarVisual();
  }

  get patinandoAgora(): boolean {
    return this.patinando;
  }

  /**
   * Poe (ou tira) o objeto que a pessoa segura na mao direita.
   *
   * Chamar com `null` esvazia a mao. Quem constroi a malha e `world/itens.ts`;
   * o rig so a pendura e cuida da pose.
   */
  segurar(obj: THREE.Object3D | null, pose: HoldPose = 'none'): void {
    for (let i = this.maoDir.children.length - 1; i >= 0; i--) {
      this.maoDir.remove(this.maoDir.children[i]);
    }
    this.pose = obj ? pose : 'none';
    if (obj) this.maoDir.add(obj);
  }

  get segurando(): boolean {
    return this.maoDir.children.length > 0;
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
      this.poeAltura(k * 0.045); // na pontinha do pe
      this.armL.rotation.set(-k * 0.55, 0, 0.08 + k * 0.16);
      this.armR.rotation.set(-k * 0.55, 0, -0.08 - k * 0.16);
      this.head.rotation.x = k * 0.18;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
      return;
    }

    if (this.sitting) {
      this.phase += dt * 0.9;
      // Pernas balancando BEM devagar: um vaivem a cada ~3 s. E o gesto de quem
      // senta no banco e deixa o pe solto, e ele so le como calma se a
      // frequencia for baixa — mais rapido que isto vira perna nervosa.
      const balanco = Math.sin(this.phase * 2.2) * 0.17;
      this.legL.rotation.x = -Math.PI / 2 + 0.06 + balanco;
      this.legR.rotation.x = -Math.PI / 2 - 0.02 - balanco;
      // Bracos apoiados, abertos para FORA. Mesma pegadinha de sinal de sempre:
      // o braco esquerdo nasce em -X e `rotation.z` positivo joga a mao para
      // +X, ou seja para dentro do corpo — sentado, isso vira um abraco em si
      // mesmo.
      this.armL.rotation.set(-0.25, 0, -0.34);
      this.armR.rotation.set(-0.2, 0, 0.34);
      // sentados de maos dadas, o braco de dentro desce e abre para o outro
      if (this.maos !== 0) {
        const dentro = this.maos < 0 ? this.armL : this.armR;
        dentro.rotation.set(0.12, 0, ABRE_MAO * 0.8 * this.maos);
      }
      this.body.rotation.x = -0.05;
      this.poeAltura(Math.sin(this.phase) * 0.012);
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
      this.poeAltura(Math.sin(this.phase) * 0.03);
      this.head.rotation.x = -0.14;
      return;
    }

    const walking = speed > 0.05;
    /**
     * A CADENCIA. De patins a passada e longa: um empurrao, e o resto do tempo
     * deslizando. A cadencia da caminhada da ~3,7 ciclos por segundo, e com o
     * teto de velocidade 30% mais alto por cima disso o boneco vira um
     * chacoalho. Patinando fica em ~0,9 ciclo por segundo na velocidade cheia,
     * que e o ritmo de quem de fato patina.
     */
    const cadencia = this.patinando ? 0.9 + speed * 0.33 : 3.2 + speed * 1.9;
    this.phase += dt * (walking ? cadencia : 1.4);

    const swing = walking
      ? this.patinando
        ? Math.min(0.34, 0.12 + speed * 0.06)
        : Math.min(0.62, 0.16 + speed * 0.14)
      : 0.04;
    const s = Math.sin(this.phase * (walking ? 2 : 1));

    if (this.patinando) {
      // PATINAR NAO E ANDAR. O pe mal sai do chao: o que se alterna e a perna
      // abrindo para o LADO (rotacao em Z, que gira o quadril e joga o pe para
      // fora) enquanto a outra empurra. A parcela em X fica em 25% da
      // caminhada, so o bastante para nao virar um par de pernas rigidas.
      const abre = walking ? Math.min(0.28, 0.1 + speed * 0.04) : 0.03;
      // Uma perna de cada vez. `rotation.z` positivo joga o pe para +X, entao
      // a perna da esquerda (que nasce em -X) abre com Z NEGATIVO e a da
      // direita com positivo. Com o mesmo sinal nas duas o corpo inteiro
      // balanca junto, que e gingado, nao patinacao.
      this.legL.rotation.z = -Math.max(0, s) * abre * 1.7;
      this.legR.rotation.z = Math.max(0, -s) * abre * 1.7;
      // pe da frente um tico erguido no empurrao, so para nao raspar
      this.legL.rotation.x = walking ? s * swing * 0.25 : 0;
      this.legR.rotation.x = walking ? -s * swing * 0.25 : 0;
      // o tronco cai para o lado da perna que esta deslizando, nao para o da
      // que empurra — e o peso indo para o pe de apoio
      this.body.rotation.z = s * abre * 0.34;
      // Bracos abertos, buscando o equilibrio — para FORA, e nao para dentro.
      // Mesma pegadinha de sinal das pernas: o braco esquerdo nasce em -X, e
      // `rotation.z` positivo joga a mao para +X, ou seja para o meio do corpo.
      // Com os dois positivos/negativos como na caminhada (que usa 0.08, um
      // valor pequeno demais para incomodar) o patinador abraca a si mesmo.
      const braco = 0.34 + Math.abs(s) * 0.14;
      this.armL.rotation.x = walking ? -s * swing * 0.9 : 0;
      this.armR.rotation.x = walking ? s * swing * 0.9 : 0;
      this.armL.rotation.z = -braco;
      this.armR.rotation.z = braco;
    } else {
      this.legL.rotation.z = 0;
      this.legR.rotation.z = 0;
      this.body.rotation.z = 0;
      this.legL.rotation.x = walking ? s * swing : 0;
      this.legR.rotation.x = walking ? -s * swing : 0;
      this.armL.rotation.x = walking ? -s * swing * 0.85 : Math.sin(this.phase) * 0.05;
      this.armR.rotation.x = walking ? s * swing * 0.85 : -Math.sin(this.phase) * 0.05;
      this.armL.rotation.z = 0.08;
      this.armR.rotation.z = -0.08;
    }

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

    this.aplicarPose();

    // pulinho de comemoracao
    if (this.bounce > 0) {
      this.bounce = Math.max(0, this.bounce - dt * 1.6);
      const b = Math.sin((1 - this.bounce) * Math.PI) * 0.28;
      this.poeAltura(b);
      this.head.rotation.z = Math.sin((1 - this.bounce) * Math.PI * 2) * 0.12;
    } else {
      const bob = walking ? Math.abs(Math.cos(this.phase * 2)) * 0.035 : Math.sin(this.phase) * 0.012;
      this.poeAltura(bob);
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
    }

    this.body.rotation.x = walking ? (this.patinando ? 0.16 : 0.06) : 0;
    this.head.rotation.x = walking ? -0.05 : Math.sin(this.phase * 0.6) * 0.03;
  }

  /**
   * Mistura a pose de segurar com a caminhada que acabou de ser calculada.
   *
   * Nao substitui o balanco: MULTIPLICA o que ja estava la. Braco travado num
   * angulo fixo enquanto as pernas andam e o que faz personagem parecer boneco
   * de vitrine.
   *
   * Se a mao direita ja esta ocupada segurando a mao do outro, a pose do item
   * nao roda — senao o braco tenta obedecer duas coisas e o objeto atravessa o
   * parceiro.
   */
  /**
   * Toda altura do corpo passa por aqui.
   *
   * De patins a pessoa fica `altoDoPatins` mais alta, e esse offset tem que
   * valer para o respiro, o pulinho, o beijo e o sentar — senao o corpo afunda
   * de volta no chao na primeira animacao que mexer no y.
   */
  private poeAltura(v: number): void {
    this.body.position.y = v + this.altoDoPatins * (this.patinando ? 1 : 0);
  }

  private aplicarPose(): void {
    if (this.pose === 'none' || this.maos > 0) {
      this.maoDir.rotation.set(0, 0, 0);
      this.maoDir.position.x = 0;
      return;
    }
    const p = POSES[this.pose];
    this.armR.rotation.x = p.bracoX + this.armR.rotation.x * p.balanco;
    this.armR.rotation.z = p.bracoZ;
    // o objeto desfaz a rotacao do braco: e assim que o sorvete continua em pe
    // com o braco esticado para a frente
    this.maoDir.rotation.set(-this.armR.rotation.x, 0, p.itemZ - this.armR.rotation.z);
    this.maoDir.position.x = p.itemX;
  }

  dispose(): void {
    this.group.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
  }
}
