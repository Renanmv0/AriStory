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
import { chaveDaTinta, fichaTingida, type TintaDaPeca } from '../world/tintas';
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
 * O braço solto, em pé e andando: quanto ele se afasta do corpo, em radianos,
 * PARA FORA (pedido do Renan). Era 0,08 para DENTRO — o sinal do esquerdo
 * estava trocado (ver a pegadinha do CLAUDE.md) e os dois braços entravam no
 * tronco. 0,17 é só o bastante para a mão sair da cápsula do corpo: a de
 * patins (0,34) e a do provador (0,36) abrem bem mais.
 */
/** sentado no banco (as pernas para a frente) ou na beirada (penduradas) */
export type JeitoDeSentar = 'banco' | 'beirada';
/** a duração do arremesso de lado, e o instante (fração) em que a pedra sai da mão */
export const ARREMESSO = 0.62;
export const SOLTA_DO_ARREMESSO = 0.55;
const BRACO_SOLTO = 0.17;

/**
 * Altura da sola do patins, na escala nativa da peca em `props.ts`.
 *
 * As rodas ficam entre 0 e 0.09 e o chassi vai ate 0.13 — e desse ultimo que a
 * bota parte. E quanto a pessoa cresce ao calcar.
 */
const SOLA_PATINS = 0.13;

/** quantos ângulos o contorno do cabelo mede, de orelha a orelha (de 10° em 10°) */
const AMOSTRAS_DO_CABELO = 19;

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
  /**
   * REGADOR: PENDURADO na mao, pela alca de cima.
   *
   * A primeira versao levantava o braco e a lata ficava equilibrada em cima do
   * punho, como uma bandeja. O Renan viu na tela e pediu o gesto certo: a mao
   * segura a ALCA e o regador pende dela, que e como se carrega um de verdade.
   * Quem desce a peca ate a alca cair na mao e a ficha do item
   * (`world/itens.ts`), lendo a altura da alca da propria geometria.
   *
   * O BRACO NAO DESCE DE TODO, e a conta e do corpo chibi: o ombro fica em
   * 0,94 e o braco tem 0,52, entao com ele na vertical a mao para em 0,43 — e
   * uma lata de 29 cm pendurada ali RASPA no chao. Em 0,9 rad a mao sobe para
   * 0,62 e a base da lata fica em 0,33, que lê como carregada.
   *
   * `itemZ` zero: coisa pendurada fica em pe, e o `maoDir` ja desfaz a rotacao
   * do braco — e isso que mantem a lata vertical enquanto a mao balanca.
   *
   * `balanco` 0,3: um tico de vaivem. Zero engessa o boneco; cheio faz uma
   * lata de agua voar, e agua pesa.
   */
  regando: { bracoX: -0.9, bracoZ: 0.42, balanco: 0.3, itemZ: 0, itemX: 0.05 },
  /**
   * BORRIFADOR: segurado PELO GARGALO, com o braco esticado para a frente, na
   * altura do peito — como quem aponta o borrifador para a planta. A mao fecha
   * na rosca (a ficha do item desce a peca ate ela), o frasco pende embaixo do
   * punho e a cabeca de gatilho fica em cima, com o bico para a frente.
   *
   * Em -1,15 rad a mao para em ~0,73 m e ~0,47 m a frente do ombro: o bico
   * sai acima da linha dos canteiros, e o frasco nao raspa na barriga.
   * `balanco` baixo: quem esta mirando nao balanca o braco.
   */
  borrifando: { bracoX: -1.15, bracoZ: 0.22, balanco: 0.12, itemZ: 0, itemX: 0.02 },
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

/** na dança lenta: abraçando pelos ombros de quem está na frente, ou com as mãos na cintura */
export type PapelNaDanca = 'ombros' | 'cintura';

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
  /** os pivos das pernas com o lado de cada um, para remontar o patins */
  private readonly pernas: Array<[THREE.Object3D, -1 | 1]> = [];
  /** quanto o patins encolhe para caber em quem e mais baixo */
  private escalaPatins = 1;
  /** o id do patins montado agora — o premio do Mano tem outra cor */
  private patinsMontado: string | null = null;
  private targetFacing = 0;
  private swimming = false;
  private sitting = false;
  /**
   * COMO está sentado: no banco (pernas para a frente, o de sempre) ou na
   * BEIRADA (a ponta do trapiche do lago): as pernas penduradas para baixo,
   * com o pé dentro d'água, balançando mais — é o chutinho na água.
   */
  private jeitoDeSentar: JeitoDeSentar = 'banco';
  /** o arremesso de lado (a pedrinha no lago): o relógio, em segundos; 0 = parado */
  private arremesso = 0;
  private deitado = false;
  /**
   * Deitado DE LADO, de frente para quem está ao lado: 0 de barriga para
   * cima, 1 de lado. Quem rola o corpo é o `facing` (na âncora de deitar,
   * girar em Y é rolar em volta da espinha) — isto só mistura a pose dos
   * braços e das pernas. Quem anima é o `entities/BeijoDeitado.ts`.
   */
  private deLado = 0;
  /** de lado, o braço de cima passa por cima de quem está na frente */
  private abracando = false;
  /** os dois olhos, que fecham no beijo deitado */
  private readonly olhos: THREE.Mesh[] = [];
  /**
   * A DANÇA LENTA (a clareira de noite): 0 parado, 1 dançando agarradinho.
   * O papel diz para onde vão os braços — pelos OMBROS de quem está na
   * frente, ou na CINTURA —, a fase é o balanço (vem de fora, a mesma para os
   * dois) e a voltinha (0 a 1) gira quem está pelos ombros por baixo do braço
   * do outro. Quem anima é o `entities/DancaLenta.ts`.
   */
  private danca = 0;
  private papelNaDanca: PapelNaDanca = 'ombros';
  private faseDaDanca = 0;
  private voltinhaDaDanca = 0;
  /**
   * Levando o que segura a boca, de vez em quando: comer o sorvete, beber o
   * suco.
   *
   * E um ESTADO e nao uma animacao com fim, pelo mesmo motivo da danca do
   * Mano: quem liga diz "agora eles estao comendo" e segue a vida; cada quadro
   * so olha para este bool e desenha a pose. Sem isto, "alguns segundos
   * tomando sorvete" seriam dois bonecos parados com uma casquinha na mao.
   */
  private saboreando = false;
  /**
   * AS MORDIDAS de um lanche: quanto falta do gesto e quanto ele durava. É um
   * gesto que ACABA (o lanche da máquina some no fim), diferente do
   * `saboreando`, que é o vaivém sem fim de quem toma sorvete conversando.
   */
  private mordendo = 0;
  private duracaoDaMordida = 1;

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
  /**
   * O calção, guardado à parte porque ele TROCA DE COR.
   *
   * Ele não entra em `trocaMaterial`: aquela lista é de peças que viram pele no
   * traje de banho, e o calção é justamente a que faz o contrário.
   */
  private readonly calcao: THREE.Mesh;
  /** os dois tubos do shorts, um por perna — pintados junto com o calcao */
  private readonly pernasDoShort: THREE.Mesh[] = [];
  /** a cor de calção da ficha da pessoa, quando não há bermuda escolhida */
  private readonly calcaoDaFicha: THREE.Material;
  /** as duas faixas da bermuda estampada; só aparecem se a peça pedir */
  private readonly estampa: THREE.Mesh[] = [];

  // --- guarda-roupa
  /** traje da cena, guardado em vez de aplicado direto — ver `aplicarVisual` */
  private traje: 'normal' | 'banho' = 'normal';
  /** o loadout já resolvido pelo catálogo */
  private roupa: Partial<Record<SlotRoupa, ItemDef>> = {};
  /**
   * A tinta do ateliê que está em cada vaga (`chaveDaTinta`): trocar só a cor
   * de uma peça já vestida também refaz a vaga, e nada mais.
   */
  private tintaNaVaga: Partial<Record<SlotRoupa, string>> = {};
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
  /**
   * O que a ficha pendura nas COSTAS (a mochila preta e o capuz do Renan):
   * some quando a pessoa veste uma mochila do guarda-roupa
   * (`ItemDef.nasCostas`), que é acessório e não esconde o `sobreTronco`.
   * O capuz entra porque o casco da Josefina ocupa o lugar dele, e o laço do
   * casco sumia dentro do capuz.
   */
  private readonly nasCostasDaFicha: THREE.Object3D[] = [];
  /** o cabelo inteiro, para um gorro poder achatá-lo */
  private readonly cabelo: THREE.Object3D[];
  /** o contorno do cabelo no plano da tiara (ver `medirCabelo`) */
  private contornoDoCabelo: number[] = [];

  constructor(spec: CharacterSpec) {
    this.spec = spec;
    const h = spec.height;
    const w = BUILD_WIDTH[spec.build];

    const legH = h * 0.28;
    // o patins tem 0.405 de altura na escala nativa; a peca acompanha o tamanho
    // da pessoa para nao virar sapato de palhaco em quem e mais baixo
    const escalaPatins = h / 1.7;
    this.escalaPatins = escalaPatins;
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
    this.medidas = {
      h, w, headR, legH, torsoH, armLen,
      cabelo: (a) => this.cabeloNoAngulo(a, headR),
      // só para a saia comprida LER a pose (ver `MedidasCorpo.pernas`)
      pernas: [this.legL, this.legR],
      pele: spec.skin,
    };

    const skin = toon(spec.skin);
    const shirt = toon(spec.shirt);
    const pants = toon(spec.pants);
    const shoes = toon(spec.shoes);
    // sobe para ca porque as PERNAS do shorts, montadas logo abaixo, ja pintam
    // com ele — antes ele so nascia junto do calcao do quadril
    this.calcaoDaFicha = toon(spec.swim ?? spec.pants);

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

      // A PERNA DO SHORTS.
      //
      // Ela é filha do PIVÔ DA PERNA, e não do corpo: assim ela herda de graça
      // toda a matemática de rotação da caminhada, da natação e do sentar, sem
      // tocar em nenhum pivô. É a mesma razão pela qual o patins e o cano da
      // bota moram aqui.
      //
      // Cônica (mais larga embaixo) e com folga de ~40% sobre o raio da coxa:
      // dois cilindros concêntricos de raios diferentes não brigam por pixel, e
      // a boca aberta é o que dá a silhueta de bermuda em vez de calça justa.
      // Vai do quadril até ~1/3 da coxa, deixando a maior parte da perna com o
      // material de pele que o traje de banho já aplica. O centro acompanha a
      // altura (metade dela menos os `0.02·legH` de sobreposição no cós), senão
      // encurtar o tubo o descola da cintura em vez de subir a barra.
      const alturaDoShort = legH * 0.36;
      const pernaDoShort = new THREE.Mesh(
        new THREE.CylinderGeometry(h * 0.052 * w, h * 0.064 * w, alturaDoShort, 14, 1, true),
        this.calcaoDaFicha,
      );
      pernaDoShort.position.y = legH * 0.02 - alturaDoShort / 2;
      pernaDoShort.visible = false;
      pivot.add(pernaDoShort);
      this.soBanho.push(pernaDoShort);
      this.pernasDoShort.push(pernaDoShort);

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
      this.pernas.push([pivot, side]);

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
      this.nasCostasDaFicha.push(capuz);
    }

    // calção de banho: fica escondido até alguém entrar na água.
    //
    // A altura é a CINTURA da bermuda, não a bermuda inteira — quem faz o
    // comprimento são os dois tubos pendurados nas pernas. Cintura alta demais
    // sobe pro peito: `hipY + 0.012h` de centro com `0.105h` de altura deixa o
    // cós logo acima do quadril, que é onde bermuda de verdade fica.
    const raioCalcao = h * 0.118 * w;
    const alturaCalcao = h * 0.105;
    const calcao = new THREE.Mesh(
      new THREE.CylinderGeometry(raioCalcao, h * 0.112 * w, alturaCalcao, 14),
      this.calcaoDaFicha,
    );
    calcao.position.y = hipY + h * 0.012;
    calcao.scale.z = 0.85;
    calcao.visible = false;
    this.body.add(calcao);
    this.soBanho.push(calcao);
    this.calcao = calcao;

    // As duas faixas da bermuda estampada. Elas nascem FILHAS do calção, então
    // a visibilidade do traje de banho já vale para elas de graça e sobra só a
    // pergunta "esta peça é estampada?".
    //
    // O raio é 3% maior em vez de igual: duas faces cilíndricas na mesma
    // superfície brigam pelo mesmo pixel, e um vão de 3% do raio é folga de
    // sobra para a faixa ficar por cima sem descolar do pano.
    for (const yFaixa of [0.3, -0.12]) {
      const faixa = new THREE.Mesh(
        new THREE.CylinderGeometry(raioCalcao * 1.03, raioCalcao * 1.03, h * 0.019, 14, 1, true),
        this.calcaoDaFicha,
      );
      faixa.position.y = yFaixa * alturaCalcao;
      faixa.visible = false;
      calcao.add(faixa);
      this.estampa.push(faixa);
    }

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
    // o nome é o que o estúdio de retrato procura para enquadrar o rosto (a apostila)
    this.head.name = 'cabeca';

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
      this.olhos.push(eye);

      if (spec.blush !== undefined) {
        // Decalque: nesta altura do rosto a superficie da cabeca passa a
        // 0,83·headR, praticamente rente ao disco. Sem o modo decalque as duas
        // faces disputam o mesmo pixel e a bochecha pisca quando a cabeca gira.
        const blush = new THREE.Mesh(
          new THREE.CircleGeometry(headR * 0.16, 12),
          flat(spec.blush, 0.75, true),
        );
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
    this.contornoDoCabelo = this.medirCabelo(headR);
    this.buildAccessories(headR, armLen, shoulderY, halfShoulder, torsoH, hipY, w);

    this.body.add(this.head);
    this.group.add(this.body);

    // Sombra fofa desenhada, alem da sombra real do sol. E decalque: ela pousa
    // em cima do chao e das linhas pintadas, e 2 cm de folga nao bastam num
    // buffer de profundidade de celular.
    this.blob = new THREE.Mesh(
      new THREE.CircleGeometry(h * 0.16 * w, 18),
      flat(0x2b3a2b, 0.22, true),
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

  /**
   * O CONTORNO DO CABELO no plano de orelha a orelha (onde uma tiara passa):
   * para cada ângulo de -90° a +90° a partir do alto, até onde o cabelo vai.
   * É o que `MedidasCorpo.cabelo` responde.
   *
   * Cada cacho é uma esfera; o corte dela pelo plano da tiara é um círculo, e
   * o ponto desse círculo mais longe na direção `d` fica em `centro·d + raio
   * do círculo`. O contorno é o maior disso entre todos os pedaços — conta
   * exata para esfera, e o cabelo daqui é quase todo esfera (a calota entra
   * como esfera inteira, o que só sobra onde a própria cabeça já está). Peça
   * que não é esfera (a franja em caixa do 'curto') entra pela esfera que a
   * envolve.
   */
  private medirCabelo(headR: number): number[] {
    const plano = -headR * 0.05;
    const pedacos: Array<{ x: number; y: number; r: number }> = [];
    this.head.updateMatrixWorld(true);
    const daCabeca = this.head.matrixWorld.clone().invert();
    const rel = new THREE.Matrix4();
    const centro = new THREE.Vector3();
    const escala = new THREE.Vector3();
    const giro = new THREE.Quaternion();
    for (const raiz of this.cabelo) {
      raiz.traverse((n) => {
        const mesh = n as THREE.Mesh;
        if (!mesh.isMesh) return;
        rel.multiplyMatrices(daCabeca, mesh.matrixWorld);
        rel.decompose(centro, giro, escala);
        const esc = Math.max(escala.x, escala.y, escala.z);
        const geo = mesh.geometry;
        let r: number;
        if (geo instanceof THREE.SphereGeometry) {
          r = geo.parameters.radius * esc;
        } else {
          geo.computeBoundingSphere();
          const envolve = geo.boundingSphere!;
          centro.copy(envolve.center).applyMatrix4(rel);
          r = envolve.radius * esc;
        }
        const dz = centro.z - plano;
        if (Math.abs(dz) >= r) return;
        pedacos.push({ x: centro.x, y: centro.y, r: Math.sqrt(r * r - dz * dz) });
      });
    }
    const contorno: number[] = [];
    for (let i = 0; i < AMOSTRAS_DO_CABELO; i++) {
      const a = -Math.PI / 2 + (i / (AMOSTRAS_DO_CABELO - 1)) * Math.PI;
      const dx = Math.sin(a);
      const dy = Math.cos(a);
      let longe = headR;
      for (const p of pedacos) longe = Math.max(longe, p.x * dx + p.y * dy + p.r);
      contorno.push(longe);
    }
    return contorno;
  }

  /** o contorno medido, interpolado no ângulo pedido */
  private cabeloNoAngulo(a: number, headR: number): number {
    const c = this.contornoDoCabelo;
    if (c.length < 2) return headR;
    const t = THREE.MathUtils.clamp((a + Math.PI / 2) / Math.PI, 0, 1) * (c.length - 1);
    const i = Math.min(Math.floor(t), c.length - 2);
    return THREE.MathUtils.lerp(c[i], c[i + 1], t - i);
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
      // a presilha é DO CABELO: some com ele quando uma touca ou um gorro o
      // esconde (`cobreCabelo`) — antes ela ficava boiando no ar, presa em
      // nada. O contorno do cabelo já foi medido, então ela não o engorda.
      this.cabelo.push(presilha);
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
      this.nasCostasDaFicha.push(bag);
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
        this.nasCostasDaFicha.push(strap);
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

  /**
   * O ARREMESSO DE LADO, o de quicar pedrinha: o braço direito vai para trás
   * e abre, o tronco gira junto, e o braço varre baixo e de lado para a
   * frente, soltando na altura do quadril. Dura `ARREMESSO` segundos; a cena
   * solta a pedra em `SOLTA_DO_ARREMESSO` do caminho.
   */
  arremessar(): void {
    this.arremesso = ARREMESSO;
  }

  /** o arremesso em curso (0 = nenhum), em fração de 0 a 1 */
  get noArremesso(): number {
    return this.arremesso > 0 ? 1 - this.arremesso / ARREMESSO : 0;
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
    const mudou = this.traje !== traje;
    this.traje = traje;
    // a mochila mede a roupa da FICHA (o moletom some no banho): refeita
    const mochila = this.roupa.acessorio;
    if (mudou && mochila?.nasCostas && mochila.extra) {
      this.tirarExtras('acessorio');
      this.porExtras('acessorio', mochila);
    }
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
    // A BERMUDA NA RUA (pedido do Renan: usar o shorts no parque e nos outros
    // lugares, e não só no clube). A bermuda do vestiário só declara a cor do
    // CALÇÃO (`corBanho`); fora d'água ela agora veste o mesmo calção e as
    // mesmas pernas de shorts do traje de banho, e a perna fica de pele. A
    // camiseta continua — sem camiseta e de shorts é só no clube.
    const bermuda = this.roupa.pernas;
    const deShort = !banho && bermuda?.corBanho !== undefined && bermuda.cor === undefined;
    for (const t of this.trocaMaterial) {
      if (banho || (deShort && t.slot === 'pernas')) {
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
    if (deShort) {
      this.calcao.visible = true;
      for (const p of this.pernasDoShort) p.visible = true;
    }

    // A MODA PRAIA. No banho o corpo inteiro vira pele e sobra só o calção, e
    // quem manda na cor dele é a peça das PERNAS — a mesma vaga de onde sai a
    // calça, só que noutro traje. Sem bermuda escolhida vale a cor da ficha,
    // que é como era antes de o vestiário existir.
    const panoDaBermuda = bermuda?.corBanho === undefined
      ? this.calcaoDaFicha
      : toon(bermuda.corBanho);
    this.calcao.material = panoDaBermuda;
    // as pernas sao do mesmo pano: sem isto elas ficavam na cor da ficha
    // enquanto o quadril mudava de cor no vestiario
    for (const p of this.pernasDoShort) p.material = panoDaBermuda;
    for (const faixa of this.estampa) {
      faixa.visible = bermuda?.estampaBanho !== undefined;
      if (bermuda?.estampaBanho !== undefined) faixa.material = toon(bermuda.estampaBanho);
    }
    // camisa do acervo cobre a roupa de tronco da ficha
    if (!banho && this.roupa.tronco) {
      for (const peca of this.sobreTronco) peca.visible = false;
    }
    if (this.roupa.acessorio?.nasCostas) {
      for (const peca of this.nasCostasDaFicha) peca.visible = false;
    }

    for (const [slot, objs] of this.extras) {
      const liga = this.roupa[slot] !== undefined
        // gorro sobrevive ao banho — e o mesmo precedente do chapeu de campeao,
        // que ja fica na cabeca dentro da agua. Bota e luva, nao; a presilha e o
        // adesivo (acessorio) sao pequenos e vao junto para a piscina. E a peca
        // de PISCINA (`praia`: chinelo, boia, colar, a estampa da bermuda) e
        // justamente a que foi feita para ficar no corpo dentro do clube
        && (slot === 'cabeca' || slot === 'acessorio' || !banho || this.roupa[slot]?.praia === true)
        // o patins engole o tornozelo inteiro: o cano da bota apareceria pela
        // costura, igual ao tenis apareceria
        && !(slot === 'pes' && this.patinando);
      for (const o of objs) o.visible = liga;
    }

    // o tênis que SUBSTITUI o pé (`substituiPe`): fora d'água, a caixa do pé
    // some e o `extra` é o sapato inteiro — a mesma troca do patins
    const tenisNoLugar = !banho && this.roupa.pes?.substituiPe === true;
    for (const pe of this.pes) pe.visible = !this.patinando && !tenisNoLugar;
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
      //
      // A SAIA é a exceção que confirma: ela MORA na vaga das pernas e é ela
      // mesma quem deixa a perna nua (a saia da boutique: o pano é o
      // `extraQuadril`, e a perna por baixo é pele). Sem o `=== peca`, a saia
      // achava que havia "uma calça vestida" — ela própria — e pintava a perna
      // inteira da cor da saia.
      if (peca.pernasNuas && slot === 'pernas' && (!this.roupa.pernas || this.roupa.pernas === peca)) return true;
      // a manga e o `detalhe` do tronco; o torso continua vestido
      if (peca.bracosNus && slot === 'tronco' && parte === 'detalhe') return true;
      // a camiseta solta: o casco é a roupa, e o peito por dentro é pele
      if (peca.peitoNu && slot === 'tronco' && parte === 'principal') return true;
      // o chinelo: pe descalco, e a peca e so a sola e a tira por cima
      if (peca.pesNus && slot === 'pes') return true;
    }
    return false;
  }

  /**
   * Veste o loadout inteiro de uma vez.
   *
   * O diff e POR SLOT: um slot que nao mudou nao derruba nem reconstroi nada.
   * Sem isso o `Game`, que chama isto todo quadro, recriaria geometria a 60 fps.
   */
  vestirRoupa(novo: Loadout, tintas: Readonly<Record<string, TintaDaPeca>> = {}): void {
    let troncoMudou = false;
    for (const slot of SLOTS_ROUPA) {
      const id = novo[slot] ?? null;
      const atual = this.roupa[slot];
      // a tinta do ateliê (por pessoa): a peça veste a cópia com a cor trocada
      const tinta = id ? tintas[id] : undefined;
      const chave = chaveDaTinta(tinta);
      // o acessório que vai POR CIMA da roupa (o avental do Mania) é medido
      // contra a peça de tronco: trocou a de baixo, ele é refeito também
      const porCima = slot === 'acessorio' && troncoMudou && !!atual?.extra && atual.presoEm !== 'cabeca';
      if ((atual?.id ?? null) === id && (this.tintaNaVaga[slot] ?? '') === chave && !porCima) continue;
      if (slot === 'tronco') troncoMudou = true;
      this.tirarExtras(slot);
      this.tintaNaVaga[slot] = chave;
      const base = id ? fichaDoItem(id) : null;
      const peca = base ? fichaTingida(base, tinta) : null;
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
   * - `maos` nos dois pivos de braco (luva, pulseira);
   * - `acessorio` onde a ficha disser (`presoEm`): na cabeca ou no corpo;
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
    if (!peca.extra && !peca.extraBraco && !peca.extraQuadril) return;
    // Cada pai leva o LADO junto: -1 no membro de -X, 1 no de +X.
    //
    // Sem isso a mesma geometria vai nos dois membros, e uma peca que se
    // desloca para fora do corpo entra para DENTRO do lado esquerdo — foi o que
    // torceu a manga de quimono. E a mesma pegadinha de sinal do frisbee e dos
    // bracos sentados.
    const pais: Array<[THREE.Object3D, 'corpo' | 'braco' | 'quadril', -1 | 1]> = [];
    if (peca.extra) {
      // pernas E pes vao para os pivos das pernas, uma copia em cada: a liga
      // de uma meia tem que dobrar junto com a coxa, igual ao cano da bota
      if (slot === 'pes' || slot === 'pernas') {
        pais.push([this.legL, 'corpo', -1], [this.legR, 'corpo', 1]);
      } else if (slot === 'maos') {
        // luva e pulseira vao no PIVO de cada braco (y = 0 no ombro, o braco
        // pendendo em -Y), uma copia em cada lado: acompanham o balanco e a pose
        pais.push([this.armL, 'corpo', -1], [this.armR, 'corpo', 1]);
      } else if (slot === 'cabeca' || (slot === 'acessorio' && peca.presoEm === 'cabeca')) {
        pais.push([this.head, 'corpo', 1]);
      } else {
        pais.push([this.body, 'corpo', 1]);
      }
    }
    // a manga vai no PIVO do braco, para acompanhar o balanco
    if (peca.extraBraco) {
      pais.push([this.armL, 'braco', -1], [this.armR, 'braco', 1]);
    }
    // o quadril da bermuda (a estampa do calcao) vai no CORPO: o calcao do
    // rig mora la, e o pivo da perna — de onde sai o `extra` de pernas — nao
    // alcanca o quadril
    if (peca.extraQuadril) pais.push([this.body, 'quadril', 1]);
    // o acessório do CORPO vai por cima da roupa de tronco: ele ganha a
    // medida do que está por baixo (`MedidasCorpo.porBaixo`)
    const medidas = slot === 'acessorio' && peca.presoEm !== 'cabeca'
      ? { ...this.medidas, porBaixo: this.medirPorBaixo(peca.nasCostas ? this.roupaDaFichaNoTronco() : []) }
      : this.medidas;
    const postos: THREE.Object3D[] = [];
    for (const [pai, tipo, lado] of pais) {
      // uma malha NOVA por pai: o mesmo Object3D nao pode ter dois pais, que e
      // a mesma razao de `modeloDoItem` nunca devolver a mesma instancia
      const obj = tipo === 'braco'
        ? peca.extraBraco!(medidas, lado, peca)
        : tipo === 'quadril'
          ? peca.extraQuadril!(medidas, lado, peca)
          : peca.extra!(medidas, lado, peca);
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

  /**
   * O PERFIL DA ROUPA DE TRONCO que está no corpo, para a peça que vai por
   * cima dela (`MedidasCorpo.porBaixo`): os vértices da geometria do tronco,
   * no referencial do corpo, guardados numa grade de ângulo × altura com a
   * maior distância do eixo em cada casa. A consulta olha a casa e as
   * vizinhas, para o pano de cima não achar um vão entre duas casas.
   *
   * Roda só quando o acessório é montado (trocar de roupa), nunca por quadro:
   * um vestido rodado dá umas dezenas de milhares de amostras.
   */
  /**
   * A roupa de tronco da FICHA que a mochila tem de contornar (o moletom
   * aberto do Renan): só quando não há peça de tronco vestida (aí ela some) e
   * fora do banho. O que a própria mochila esconde (`nasCostasDaFicha`) não
   * conta.
   */
  private roupaDaFichaNoTronco(): THREE.Object3D[] {
    if (this.traje === 'banho' || this.roupa.tronco) return [];
    return this.sobreTronco.filter((o) => !this.nasCostasDaFicha.includes(o));
  }

  private medirPorBaixo(extras: readonly THREE.Object3D[] = []): (angulo: number, y: number) => number {
    const ANGULOS = 32;
    const PASSO = 0.02;
    const grade = new Map<number, number>();
    const casa = (ia: number, iy: number): number => iy * ANGULOS + ((ia % ANGULOS) + ANGULOS) % ANGULOS;
    const v = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const cc = new THREE.Vector3();
    const noCorpo = new THREE.Matrix4();
    const daCopia = new THREE.Matrix4();
    for (const obj of [...(this.extras.get('tronco') ?? []), ...extras]) {
      obj.traverse((n: THREE.Object3D) => {
        const malha = n as THREE.Mesh;
        if (!malha.isMesh) return;
        const pos = malha.geometry.getAttribute('position');
        if (!pos) return;
        // a matriz da malha no referencial do corpo: as locais, até o corpo
        noCorpo.identity();
        for (let o: THREE.Object3D | null = malha; o && o !== this.body; o = o.parent) {
          o.updateMatrix();
          noCorpo.premultiply(o.matrix);
        }
        // o enfeite em lote (as bolinhas e os lacinhos do vestido) conta cópia
        // por cópia: pulado, ele furava o avental em pontinhos
        const lote = (malha as THREE.InstancedMesh).isInstancedMesh ? (malha as THREE.InstancedMesh) : null;
        const copias = lote ? lote.count : 1;
        const indice = malha.geometry.getIndex();
        const triangulos = (indice ? indice.count : pos.count) / 3;
        const canto = (t: number, q: number): number => (indice ? indice.getX(t * 3 + q) : t * 3 + q);
        for (let c = 0; c < copias; c++) {
          if (lote) { lote.getMatrixAt(c, daCopia); daCopia.premultiply(noCorpo); }
          else daCopia.copy(noCorpo);
          // os TRIÂNGULOS, e não só os vértices: o cilindro da saia do vestido
          // tem vértice só em cima e embaixo, e o meio dele ficava sem medida.
          // Cada triângulo é amostrado numa grade de ~1,5 cm
          for (let t = 0; t < triangulos; t++) {
            a.fromBufferAttribute(pos, canto(t, 0)).applyMatrix4(daCopia);
            b.fromBufferAttribute(pos, canto(t, 1)).applyMatrix4(daCopia);
            cc.fromBufferAttribute(pos, canto(t, 2)).applyMatrix4(daCopia);
            const lado = Math.max(a.distanceTo(b), b.distanceTo(cc), cc.distanceTo(a));
            const n = Math.min(40, Math.max(1, Math.ceil(lado / 0.015)));
            for (let i = 0; i <= n; i++) {
              for (let jj = 0; jj <= n - i; jj++) {
                const u = i / n;
                const w = jj / n;
                v.copy(a).multiplyScalar(1 - u - w).addScaledVector(b, u).addScaledVector(cc, w);
                const d = Math.hypot(v.x, v.z);
                const ia = Math.floor(((Math.atan2(v.x, v.z) + Math.PI) / (Math.PI * 2)) * ANGULOS);
                const k = casa(ia, Math.floor(v.y / PASSO));
                if (d > (grade.get(k) ?? 0)) grade.set(k, d);
              }
            }
          }
        }
      });
    }
    return (angulo, y) => {
      if (!grade.size) return 0;
      const ia = Math.floor(((Math.atan2(Math.sin(angulo), Math.cos(angulo)) + Math.PI) / (Math.PI * 2)) * ANGULOS);
      const iy = Math.floor(y / PASSO);
      let maior = 0;
      for (let da = -1; da <= 1; da++) {
        for (let dy = -1; dy <= 1; dy++) maior = Math.max(maior, grade.get(casa(ia + da, iy + dy)) ?? 0);
      }
      return maior;
    };
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
  setSitting(v: boolean, jeito: JeitoDeSentar = 'banco'): void {
    this.sitting = v;
    this.jeitoDeSentar = jeito;
    if (!v) {
      this.poeAltura(0);
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.armL.rotation.set(0, 0, -BRACO_SOLTO);
      this.armR.rotation.set(0, 0, BRACO_SOLTO);
    }
  }

  /**
   * Deitado.
   *
   * O corpo NAO vira aqui: quem deita a pessoa e a ancora da cena, um
   * `Object3D` com `rotation.x = -PI/2` do qual o rig e filho. Assim a
   * animacao continua toda em espaco local, como em pe — foi o que dispensou
   * reescrever a pose membro por membro. Este estado so troca a ANIMACAO:
   * pernas retas, corpo parado e o balanco leve dos bracos.
   */
  setLying(v: boolean): void {
    this.deitado = v;
    if (!v) {
      this.deLado = 0;
      this.abracando = false;
      for (const olho of this.olhos) olho.scale.y = 1.25;
      this.poeAltura(0);
      this.legL.rotation.set(0, 0, 0);
      this.legR.rotation.set(0, 0, 0);
      this.armL.rotation.set(0, 0, -BRACO_SOLTO);
      this.armR.rotation.set(0, 0, BRACO_SOLTO);
      this.body.rotation.x = 0;
    }
  }

  /**
   * Calca (ou tira) os patins.
   *
   * Quem manda e o inventario: o `Game` le a vaga de acessorio e carimba isto
   * todo quadro. O rig so obedece — nao ha estado de patins fora do save.
   */
  setPatins(v: boolean, peca: ItemDef | null = null): void {
    this.trocarModeloDoPatins(peca);
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
   * Troca o MODELO do patins quando a peca calcada muda.
   *
   * O patins nao e um `extra` de roupa: ele nasce no construtor e SUBSTITUI o
   * pe, porque a bota engole o tornozelo. Isso era simples enquanto existia um
   * par so; com o premio do Mano passaram a existir dois, e quem decide a cor
   * e a peca que esta na vaga dos pes.
   *
   * Remonta so quando o id muda — `sincronizarVestiveis` carimba isto todo
   * quadro, e refazer geometria a 60 fps e o mesmo erro que o cache de roupa
   * ja evita.
   */
  private trocarModeloDoPatins(peca: ItemDef | null): void {
    const id = peca?.id ?? null;
    if (this.patinsMontado === id) return;
    this.patinsMontado = id;
    for (const [i, [pivot, lado]] of this.pernas.entries()) {
      const velho = this.patins[i];
      pivot.remove(velho);
      const novo = peca?.cor === undefined
        ? patinsMesh(this.spec.shoes)
        : patinsMesh(peca.cor, peca.corDetalhe ?? P.frisbee, peca.enfeite === 'sorvete', lado);
      novo.scale.setScalar(this.escalaPatins);
      // a peca tem a sola das rodas em y = 0, entao ela desce ate o chao novo
      novo.position.y = -this.alturaDaPerna - this.altoDoPatins;
      novo.visible = this.patinando;
      // o `traverse` que liga sombra roda no CONSTRUTOR: nada criado depois
      // herda isso sozinho — a mesma nota que ja existe em `porExtras`
      novo.traverse((n: THREE.Object3D) => {
        if ((n as THREE.Mesh).isMesh) {
          n.castShadow = true;
          n.receiveShadow = false;
        }
      });
      pivot.add(novo);
      this.patins[i] = novo;
    }
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

  /** a peca pendurada na mao direita, ou `null` */
  get objetoNaMao(): THREE.Object3D | null {
    return this.maoDir.children[0] ?? null;
  }

  /**
   * Liga (ou desliga) o gesto de levar o que esta na mao a boca.
   *
   * So faz efeito em quem esta SEGURANDO alguma coisa com pose — de mao vazia
   * nao ha o que saborear, e a pose de item e que diz onde o braco comeca.
   */
  /**
   * Leva o que está na mão à boca DUAS VEZES em `segundos` — "nhac, nhac" — e
   * para sozinho. É o comer dos lanches da escola: a lambida do sorvete é
   * lenta demais (uma a cada três segundos, presa ao relógio do corpo) para
   * caber num lanche que dura pouco mais de um segundo.
   */
  morder(segundos = 1.4): void {
    this.mordendo = segundos;
    this.duracaoDaMordida = segundos;
  }

  /** o teste pergunta isto */
  get estaMordendo(): boolean {
    return this.mordendo > 0;
  }

  setSaboreando(v: boolean): void {
    this.saboreando = v;
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
   * DEITADO DE LADO, de frente para quem está ao lado — misturado por cima
   * da pose de barriga para cima pelo `deLado`, para a virada ser contínua.
   *
   * QUAL LADO FICA EM CIMA sai do giro: com a âncora de deitar em -90° em X,
   * o `facing` positivo deita o lado +X (o braço e a perna direitos) para
   * baixo, e o negativo deita o esquerdo. O braço de baixo dobra na frente
   * do peito (pendurado ao longo do corpo, ele afundaria no colchão); o de
   * cima, de quem abraça, vai para a frente e abre um tico — que, de lado, é
   * para CIMA, por cima do ombro de quem está na frente. Quem não abraça
   * descansa o de cima no quadril. As pernas encolhem um pouco, a de cima
   * mais: é o jeito de quem deita de lado, e não de um boneco tombado.
   */
  private poseDeLado(solto: number): void {
    const s = this.deLado;
    const bj = this.beijo;
    const esquerdoEmCima = Math.sin(this.group.rotation.y) > 0;
    const [armCima, armBaixo] = esquerdoEmCima ? [this.armL, this.armR] : [this.armR, this.armL];
    const [pernaCima, pernaBaixo] = esquerdoEmCima ? [this.legL, this.legR] : [this.legR, this.legL];
    // o "para fora" de cada lado — a pegadinha de sinal: o esquerdo abre em -Z
    const fora = esquerdoEmCima ? -1 : 1;
    const mistura = (alvo: THREE.Object3D, x: number, z: number): void => {
      alvo.rotation.x += (x - alvo.rotation.x) * s;
      alvo.rotation.y *= 1 - s;
      alvo.rotation.z += (z - alvo.rotation.z) * s;
    };
    if (this.abracando) mistura(armCima, -1.3 - bj * 0.12 + solto * 0.3, fora * (0.16 + bj * 0.04));
    else mistura(armCima, -0.42 + solto * 0.3, 0);
    // o de baixo fecha um tico para DENTRO (o "para fora" dele é o contrário
    // do de cima), que de lado é para cima, longe do colchão
    mistura(armBaixo, -0.78, fora * 0.06);
    mistura(pernaCima, -0.34, 0);
    mistura(pernaBaixo, -0.12, 0);
    // no beijo, o queixo desce um tico e o tronco chega para a frente
    this.head.rotation.x += bj * 0.12 * s;
    this.body.rotation.x += bj * 0.03 * s;
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

  /**
   * A dança lenta: o quanto (0 a 1), o papel, a fase do balanço e a voltinha.
   * Só vale de pé (sentado ou deitado, a pose de lá manda). Zerar devolve os
   * olhos abertos e o corpo de frente — o resto a caminhada desfaz sozinha.
   */
  setDanca(valor: number, papel: PapelNaDanca = 'ombros', fase = 0, voltinha = 0): void {
    this.danca = Math.max(0, Math.min(1, valor));
    this.papelNaDanca = papel;
    this.faseDaDanca = fase;
    this.voltinhaDaDanca = Math.max(0, Math.min(1, voltinha));
    if (this.danca <= 0.001) {
      for (const olho of this.olhos) olho.scale.y = 1.25;
      this.body.rotation.set(0, 0, 0);
      this.head.rotation.z = 0;
    }
  }

  get dancando(): boolean {
    return this.danca > 0.001;
  }

  /**
   * A POSE DA DANÇA LENTA, por cima de quem está parado de pé (misturada pelo
   * `danca`, para entrar e sair sem tranco).
   *
   * - O BALANÇO: o peso vai de um pé para o outro a cada dois tempos — o
   *   corpo inteiro inclina para o lado do pé de apoio, e a outra perna
   *   solta, dobra um tico e abre. Quem chama dá a fase com meia volta de
   *   diferença para cada um: de frente um para o outro, o "+X" de um é o
   *   "−X" do outro, e assim os dois balançam para o MESMO lado do mundo.
   * - OS BRAÇOS: pelos ombros, os dois sobem para a frente e fecham para
   *   dentro (as mãos se encontram atrás do pescoço do outro); na cintura,
   *   descem para a frente e fecham menos. A PEGADINHA DE SEMPRE: o braço
   *   esquerdo nasce em −X, então fechar para dentro nele é `rotation.z`
   *   POSITIVO, e no direito é negativo.
   * - A CABEÇA: os dois tombam para o lado do braço esquerdo (−X), que de
   *   frente um para o outro são lados opostos do mundo — as cabeças passam
   *   uma do lado da outra, bochecha com bochecha, em vez de bater. Quem
   *   abraça pelos ombros olha um tico para cima, quem segura na cintura,
   *   para baixo. E os olhos fecham.
   * - A VOLTINHA: quem está pelos ombros gira uma volta inteira no lugar,
   *   com a mão direita lá em cima na do outro, que levanta o braço direito
   *   por cima da cabeça dela. Os olhos abrem.
   */
  private poseDeDanca(): void {
    const k = this.danca;
    const f = this.faseDaDanca;
    const lado = Math.sin(f);
    const v = this.voltinhaDaDanca;
    // a voltinha sobe e desce (0 → 1 → 0), e o giro anda com a curva suave
    const sobe = Math.sin(Math.PI * v);
    const giro = v * v * (3 - 2 * v);
    const ombros = this.papelNaDanca === 'ombros';
    const mistura = (alvo: THREE.Object3D, x: number, z: number): void => {
      alvo.rotation.x += (x - alvo.rotation.x) * k;
      alvo.rotation.y *= 1 - k;
      alvo.rotation.z += (z - alvo.rotation.z) * k;
    };

    // as pernas: a do lado do peso fica reta, a outra solta (ver acima)
    const pesoNaDireita = Math.max(0, lado);
    const pesoNaEsquerda = Math.max(0, -lado);
    mistura(this.legL, -0.14 * pesoNaDireita, -0.03 - 0.05 * pesoNaDireita);
    mistura(this.legR, -0.14 * pesoNaEsquerda, 0.03 + 0.05 * pesoNaEsquerda);
    // o corpo inteiro inclina para o pé de apoio (z negativo leva a cabeça para +X)
    this.body.rotation.z = -lado * 0.045 * k;
    this.body.rotation.x = (ombros ? 0.03 : 0.06) * k;
    this.body.rotation.y = ombros ? giro * Math.PI * 2 : 0;
    // um tico mais baixo no meio da passada, onde o peso troca de pé
    this.poeAltura(-0.008 * (1 - Math.abs(lado)) * k);

    if (ombros) {
      // pelos ombros; na voltinha, a direita sobe até a mão do outro e a esquerda abre
      mistura(this.armL, -1.78 + 1.3 * sobe, 0.52 - 1.1 * sobe);
      // (a direita sobe na diagonal, para fora: reta para cima, o cabelo engolia a mão)
      mistura(this.armR, -1.78 - 0.95 * sobe, -0.52 + 0.95 * sobe);
    } else {
      // na cintura; na voltinha, a direita sobe por cima da cabeça de quem gira
      mistura(this.armL, -1.0 + 0.8 * sobe, 0.3 - 0.45 * sobe);
      mistura(this.armR, -1.0 - 1.75 * sobe, -0.3 + 0.2 * sobe);
    }

    // a cabeça tomba para o lado esquerdo (−X), e balança junto com o corpo
    this.head.rotation.z = (0.15 * (1 - sobe) + lado * 0.03) * k;
    this.head.rotation.x = (ombros ? -0.07 : 0.11) * k * (1 - sobe);
    // os olhos: fechadinhos dançando, abertos na voltinha
    const fecha = 0.86 * k * (1 - sobe);
    for (const olho of this.olhos) olho.scale.y = 1.25 * (1 - fecha);
  }

  /**
   * Deitado, o quanto está DE LADO (0 a 1), e se o braço de cima abraça quem
   * está na frente. Só vale com `setLying(true)`; o giro do corpo é o
   * `facing`, que quem chama escreve junto (ver `entities/BeijoDeitado.ts`).
   */
  setDeLado(valor: number, abraca = false): void {
    this.deLado = Math.max(0, Math.min(1, valor));
    this.abracando = abraca;
  }

  /** onde está o centro da cabeça, no mundo (os corações do beijo deitado) */
  cabecaNoMundo(alvo: THREE.Vector3): THREE.Vector3 {
    return this.head.getWorldPosition(alvo);
  }

  /** dentro da agua: bracada em vez de caminhada, e sem sombra no chao */
  setSwimming(v: boolean): void {
    if (this.swimming === v) return;
    this.swimming = v;
    this.blob.visible = !v;
  }

  /**
   * Pose de provador: os braços abertos para o lado, depois do `update`.
   *
   * Parado, o braço cai 0.08 rad para DENTRO (em pé no mundo fica natural),
   * e no boneco do painel a mão sumia atrás do quadril — luva e pulseira não
   * apareciam. Aqui abre para FORA: o esquerdo nasce em -X, então o sinal dele
   * é negativo (a pegadinha do CLAUDE.md).
   */
  abrirBracos(angulo: number): void {
    this.armL.rotation.z = -angulo;
    this.armR.rotation.z = angulo;
  }

  /**
   * @param dt delta em segundos
   * @param speed velocidade horizontal atual em unidades/s (0 = parado)
   */
  update(dt: number, speed: number): void {
    if (this.mordendo > 0) this.mordendo = Math.max(0, this.mordendo - dt);
    // giro suave para o angulo alvo, pelo caminho mais curto
    let delta = this.targetFacing - this.group.rotation.y;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    this.group.rotation.y += delta * Math.min(1, dt * 14);

    // o beijo manda em tudo enquanto dura: inclina o tronco e a cabeca para a
    // frente e recolhe os bracos, sem passo nenhum
    if (this.beijo > 0.001 && !this.deitado) {
      const k = this.beijo;
      this.phase += dt * 1.2;
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.body.rotation.x = k * 0.3;
      this.poeAltura(k * 0.045); // na pontinha do pe
      // parte do braço solto (para fora) e fecha até o abraço de sempre (0,24
      // para dentro), que é o braço recolhido do beijo
      this.armL.rotation.set(-k * 0.55, 0, -BRACO_SOLTO + k * (0.24 + BRACO_SOLTO));
      this.armR.rotation.set(-k * 0.55, 0, BRACO_SOLTO - k * (0.24 + BRACO_SOLTO));
      this.head.rotation.x = k * 0.18;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
      return;
    }

    // a dança lenta, de pé (por cima da pose de parado, que é o ponto de partida dela)
    if (this.danca > 0.001 && !this.deitado && !this.sitting && !this.swimming) {
      this.phase += dt * 1.4;
      this.legL.rotation.set(0, 0, 0);
      this.legR.rotation.set(0, 0, 0);
      this.armL.rotation.set(0, 0, -BRACO_SOLTO);
      this.armR.rotation.set(0, 0, BRACO_SOLTO);
      this.head.rotation.x = 0;
      this.poseDeDanca();
      this.maoDir.rotation.set(0, 0, 0);
      return;
    }

    if (this.deitado) {
      // Devagar de proposito — meio ciclo a cada ~6 s. Deitado, o unico
      // movimento e o de quem esta descansando; mais rapido que isto o corpo
      // parece inquieto em vez de a vontade.
      this.phase += dt * 0.55;
      // pernas retas e um pouco abertas. MESMA PEGADINHA DE SINAL de sempre: a
      // perna esquerda nasce em -X, entao `rotation.z` NEGATIVO nela e que abre
      // para fora — com o sinal trocado as duas cruzam para dentro.
      this.legL.rotation.set(0, 0, -0.05);
      this.legR.rotation.set(0, 0, 0.05);
      // O balanco dos bracos, que e o ponto da pose: eles abrem e fecham de
      // leve ao longo do corpo, com um giro lento defasado para os dois lados
      // nao ficarem em espelho perfeito.
      const balanco = Math.sin(this.phase) * 0.07;
      const solto = Math.sin(this.phase * 0.73) * 0.05;
      this.armL.rotation.set(solto, 0, -0.14 - balanco);
      this.armR.rotation.set(-solto, 0, 0.14 + balanco);
      // o peito subindo e descendo. Nada de `poeAltura` aqui: deitado, o Y
      // local aponta para a cabeceira, entao ele empurraria a pessoa para o
      // travesseiro em vez de fazer o peito respirar.
      this.body.rotation.x = Math.sin(this.phase) * 0.02;
      this.head.rotation.x = Math.sin(this.phase * 0.6) * 0.025;
      this.head.rotation.z *= 1 - Math.min(1, dt * 8);
      if (this.deLado > 0.001) this.poseDeLado(solto);
      // os olhos fecham no beijo (achatados viram um risquinho)
      const fecha = this.deLado > 0.001 ? this.beijo : 0;
      for (const olho of this.olhos) olho.scale.y = 1.25 * (1 - 0.86 * fecha);
      return;
    }

    if (this.sitting) {
      this.phase += dt * 0.9;
      // Pernas balancando BEM devagar: um vaivem a cada ~3 s. E o gesto de quem
      // senta no banco e deixa o pe solto, e ele so le como calma se a
      // frequencia for baixa — mais rapido que isto vira perna nervosa.
      if (this.jeitoDeSentar === 'beirada') {
        // NA BEIRADA a perna cai pela borda: a coxa quase reta para baixo (um
        // tico para a frente) e o chute na água é maior e um pouco mais
        // rápido que o do banco — é o pé brincando com a água
        const chute = Math.sin(this.phase * 2.6) * 0.32;
        this.legL.rotation.x = -0.42 + chute;
        this.legR.rotation.x = -0.42 - chute;
      } else {
        const balanco = Math.sin(this.phase * 2.2) * 0.17;
        this.legL.rotation.x = -Math.PI / 2 + 0.06 + balanco;
        this.legR.rotation.x = -Math.PI / 2 - 0.02 - balanco;
      }
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
      /**
       * SENTADO A POSE DE ITEM NAO ENTRA — o braco fica apoiado, e e assim que
       * tem que ser: quem senta no banco com o sorvete descansa a mao.
       *
       * MENOS quando esta comendo. Ai o braco volta a obedecer a pose e sobe
       * ate a boca, que e o unico jeito de a mesinha da praca de gelo ter uma
       * cena de "tomando sorvete" em vez de dois bonecos sentados olhando para
       * a frente com uma casquinha pendurada no quadril.
       */
      if (this.saboreando) this.aplicarPose();
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
      this.armL.rotation.z = -BRACO_SOLTO;
      this.armR.rotation.z = BRACO_SOLTO;
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

    // o arremesso de lado (a pedrinha): por cima da pose de pé
    if (this.arremesso > 0) {
      this.arremesso = Math.max(0, this.arremesso - dt);
      const k = 1 - this.arremesso / ARREMESSO;
      // prepara até 0,45 (o braço vai para trás e abre), varre até 0,62 e volta
      const atras = k < 0.45 ? Math.sin((k / 0.45) * Math.PI / 2) : k < 0.62 ? 1 - ((k - 0.45) / 0.17) * 2 : -1 + ((k - 0.62) / 0.38);
      const abre = k < 0.62 ? Math.min(1, k / 0.3) : 1 - (k - 0.62) / 0.38;
      // `rotation.x` positivo leva o braço para TRÁS; o direito nasce em +X e
      // abre para fora com `z` positivo
      this.armR.rotation.x = atras * 1.0;
      this.armR.rotation.z = BRACO_SOLTO + abre * 0.95;
      this.body.rotation.y = atras * 0.32;
      this.armL.rotation.z = -BRACO_SOLTO - abre * 0.35;
    } else {
      this.body.rotation.y *= 1 - Math.min(1, dt * 10);
    }

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
    /**
     * De mãos dadas o braço de +X está ocupado, e a pose do item cede — MENOS
     * quando a pessoa está comendo. Sentados na mesinha da praça de gelo os
     * dois ficam de mãos dadas por cima da mesa, e sem esta exceção justamente
     * quem segura com a direita não conseguiria levar o sorvete à boca. O braço
     * de fora continua dado; o de dentro come.
     */
    const mordendo = this.mordendo > 0;
    if (this.pose === 'none' || (this.maos > 0 && !this.saboreando && !mordendo)) {
      this.maoDir.rotation.set(0, 0, 0);
      this.maoDir.position.x = 0;
      return;
    }
    const p = POSES[this.pose];
    this.armR.rotation.x = p.bracoX + this.armR.rotation.x * p.balanco;
    this.armR.rotation.z = p.bracoZ;

    /**
     * A LAMBIDA. O braco sobe da pose de segurar ate a altura da boca e volta,
     * num vaivem lento — uma mordida a cada tres segundos, que e o ritmo de
     * quem esta comendo devagar e conversando. O quadrado da senoide e o que
     * faz ele DEMORAR embaixo e passar rapido por cima: comer nao e metronomo.
     *
     * A cabeca desce um tico junto. Sem ela o braco sobe sozinho e parece que
     * a pessoa esta erguendo um brinde, e nao comendo.
     */
    if (this.saboreando || mordendo) {
      // na mordida, duas subidas em seguida: o seno ao quadrado de duas voltas
      // tem dois picos, e começa e termina com o braço embaixo
      const k = 1 - this.mordendo / this.duracaoDaMordida;
      const leva = mordendo
        ? Math.sin(k * Math.PI * 2) ** 2
        : ((Math.sin(this.phase * 1.8) + 1) / 2) ** 2;
      this.armR.rotation.x = p.bracoX - 0.85 * leva;
      // na mordida o braço também FECHA para o meio do rosto: o braço direito
      // nasce em +X, então fechar é `rotation.z` negativo. O sorvete fecha
      // pouco (0,12), porque lambida é de lado; mordida é na frente da boca
      this.armR.rotation.z = p.bracoZ - (mordendo ? 0.42 : 0.12) * leva;
      this.head.rotation.x = 0.17 * leva;
    }
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
