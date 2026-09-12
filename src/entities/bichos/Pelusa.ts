import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/**
 * O Pelusa, o gato do Ari.
 *
 * O cerebro (passear, contornar movel, parar, sentar, miar, receber carinho)
 * e todo do `Bicho`. Aqui mora so o que e DELE: o corpo e a pose.
 *
 * Da foto: branco creme no peito, nas patas e no focinho, com mascara, dorso e
 * cauda em cinza-taupe, e a cauda listrada.
 */
export class Pelusa extends Bicho {
  private readonly corpo = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly rabo = new THREE.Group();
  private readonly patas: THREE.Mesh[] = [];
  private readonly orelhas: THREE.Group[] = [];
  private readonly olhos: THREE.Mesh[] = [];
  private readonly gomosDoRabo: THREE.Group[] = [];

  constructor(area: AreaDoBicho) {
    super(area, {
      velocidade: 0.62,
      // gato descansa muito: e o que faz ele nao parecer um robo circulando
      descansoMin: 1.4,
      descansoMax: 4.4,
      chanceDeSentar: 0.35,
      somCadaMin: 9,
      somCadaMax: 20,
    });
    this.montar();
    this.prontoParaAparecer('pelusa');
  }

  // ----------------------------------------------------------------- corpo

  private montar(): void {
    const branco = toon(P.pelusaBranco);
    const cinza = toon(P.pelusaCinza);
    const escuro = toon(P.pelusaCinzaEscuro);

    // O tronco e um ELIPSOIDE, e nao uma capsula girada.
    //
    // A primeira versao usava capsula com `rotation.z = PI/2`, o que poe o
    // comprimento no eixo X — mas a cabeca e o rabo moram no eixo Z, entao o
    // corpo saia atravessado em relacao a propria cabeca, e de perto o gato
    // parecia amassado de lado. Esfera com escala nao tem eixo escondido: o
    // numero que estica o comprimento e o Z, que e para onde ele olha.
    const tronco = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), branco);
    tronco.scale.set(0.105, 0.098, 0.165);
    tronco.position.y = 0.175;
    this.corpo.add(tronco);

    // A sela cinza do lombo: baixa e estreita, so a FAIXA das costas. Um
    // segundo corpo inteiro por cima lia como cobertor mal posto.
    const sela = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), cinza);
    sela.scale.set(0.098, 0.072, 0.142);
    sela.position.set(0, 0.203, -0.012);
    this.corpo.add(sela);

    // ------------------------------------------------------------- cabeca
    // Cabeca grande de proposito: e a mesma regra chibi do resto do jogo, e a
    // esta escala na tela e ela que faz o bicho ser lido como gato.
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 10), branco);
    cranio.scale.set(1, 0.94, 0.9);
    this.cabeca.add(cranio);

    // a mascara: uma calota cinza no alto, aberta para baixo, como na foto
    const mascara = new THREE.Mesh(
      new THREE.SphereGeometry(0.107, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.54),
      cinza,
    );
    mascara.scale.set(1, 0.94, 0.9);
    mascara.position.y = 0.004;
    this.cabeca.add(mascara);

    const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), branco);
    focinho.scale.set(1.05, 0.78, 0.85);
    focinho.position.set(0, -0.032, 0.072);
    this.cabeca.add(focinho);

    const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(P.pelusaFocinho));
    nariz.scale.set(1.2, 0.85, 0.8);
    nariz.position.set(0, -0.024, 0.122);
    this.cabeca.add(nariz);

    for (const lado of [-1, 1]) {
      // orelha: cone com um cone rosa menor por dentro
      const orelha = new THREE.Group();
      const fora = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.085, 6), cinza);
      orelha.add(fora);
      const dentro = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.058, 6), toon(P.pelusaOrelha));
      dentro.position.z = 0.016;
      orelha.add(dentro);
      orelha.position.set(lado * 0.062, 0.092, -0.006);
      // as duas tombam para FORA. Mesma pegadinha de sinal do resto do projeto:
      // a da esquerda nasce em -X, entao `rotation.z` NEGATIVO nela e que abre.
      orelha.rotation.z = lado * 0.17;
      this.orelhas.push(orelha);
      this.cabeca.add(orelha);

      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), toon(0x2b2721));
      olho.position.set(lado * 0.044, 0.01, 0.09);
      this.olhos.push(olho);
      this.cabeca.add(olho);
    }

    this.cabeca.position.set(0, 0.288, 0.152);
    this.corpo.add(this.cabeca);

    // -------------------------------------------------------------- patas
    // a capsula tem altura total `comprimento + 2 × raio` (0,141): com o centro
    // em 0,072 a pata encosta no chao em vez de flutuar
    for (const [lado, frente] of [[-1, 1], [1, 1], [-1, -1], [1, -1]] as const) {
      const pata = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.085, 3, 6), branco);
      pata.position.set(lado * 0.062, 0.072, frente * 0.092);
      this.patas.push(pata);
      this.corpo.add(pata);
    }

    // --------------------------------------------------------------- rabo
    // Um rabo de tres gomos, cada um filho do anterior: girando so o primeiro,
    // a curva inteira acompanha. Rabo de peca unica nao chicoteia — e o
    // chicotear e metade do que faz ele parecer vivo.
    let pai: THREE.Object3D = this.rabo;
    for (let i = 0; i < 3; i++) {
      const gomo = new THREE.Group();
      const malha = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.022 - i * 0.004, 0.075, 3, 6),
        i % 2 === 0 ? cinza : escuro,
      );
      malha.position.y = 0.048;
      gomo.add(malha);
      gomo.position.y = i === 0 ? 0 : 0.094;
      // curva em S: o primeiro gomo tomba para tras e os de cima voltam para a
      // frente. Todos no mesmo angulo dariam uma antena reta.
      gomo.rotation.x = i === 0 ? -0.75 : 0.34;
      pai.add(gomo);
      pai = gomo;
      this.gomosDoRabo.push(gomo);
    }
    this.rabo.position.set(0, 0.19, -0.168);
    this.corpo.add(this.rabo);

    this.group.add(this.corpo);
  }

  // ------------------------------------------------------------------ pose

  /**
   * Tudo por seno, como o resto do jogo.
   *
   * O rabo tem TRES velocidades diferentes por gomo (`fase * k` com `k`
   * crescendo): e a defasagem que faz a ponta chegar depois da base e a curva
   * parecer um chicote, em vez de uma barra rigida balancando.
   */
  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    if (andando) {
      const t = fase * 9;
      // patas em diagonal, como bicho de quatro patas anda de verdade
      this.patas[0].position.z = 0.092 + Math.sin(t) * 0.032;
      this.patas[3].position.z = -0.092 + Math.sin(t) * 0.032;
      this.patas[1].position.z = 0.092 - Math.sin(t) * 0.032;
      this.patas[2].position.z = -0.092 - Math.sin(t) * 0.032;
      this.corpo.position.y = Math.abs(Math.sin(t)) * 0.012;
      this.corpo.rotation.x = 0;
      this.corpo.rotation.z = Math.sin(t) * 0.03;
    } else {
      // volta as patas para o lugar sem estalo
      for (let i = 0; i < 4; i++) {
        const base = i < 2 ? 0.092 : -0.092;
        this.patas[i].position.z += (base - this.patas[i].position.z) * Math.min(1, dt * 8);
      }
      this.corpo.rotation.z *= 1 - Math.min(1, dt * 8);
      // sentado o traseiro desce e o peito sobe; parado, so a respiracao
      const alvoX = sentado ? 0.34 : 0;
      this.corpo.rotation.x += (alvoX - this.corpo.rotation.x) * Math.min(1, dt * 5);
      const respira = Math.sin(fase * 1.7) * 0.006;
      const alvoY = (sentado ? 0.028 : 0) + respira;
      this.corpo.position.y += (alvoY - this.corpo.position.y) * Math.min(1, dt * 5);
    }

    // rabo: cada gomo mais rapido e mais amplo que o anterior
    const forte = andando ? 1 : 0.55;
    for (let i = 0; i < this.gomosDoRabo.length; i++) {
      const g = this.gomosDoRabo[i];
      const amp = (0.1 + i * 0.075) * forte + carinho * 0.1;
      g.rotation.z = Math.sin(fase * (2.1 + i * 0.9)) * amp;
      if (i === 0) g.rotation.x = -0.75 + Math.sin(fase * 1.3) * 0.12 * forte;
    }

    // cabeca: olha em volta parado, e sobe encostando na mao no carinho
    this.cabeca.rotation.y = andando ? 0 : Math.sin(fase * 0.6) * 0.34;
    this.cabeca.rotation.x = -carinho * 0.22 + Math.sin(fase * 1.9) * 0.02;

    // orelhas mexendo, e no carinho elas abrem mais
    for (let i = 0; i < this.orelhas.length; i++) {
      const lado = i === 0 ? -1 : 1;
      const tique = Math.sin(fase * 2.3 + i * 1.7);
      this.orelhas[i].rotation.z = lado * (0.17 + carinho * 0.12) + tique * 0.05 * lado;
    }

    // no carinho ele fecha os olhos de contente
    const abertura = 1 - carinho * 0.85;
    for (const olho of this.olhos) olho.scale.y = Math.max(0.12, abertura);
  }
}
