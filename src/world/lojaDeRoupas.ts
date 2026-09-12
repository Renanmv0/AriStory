import * as THREE from 'three';
import { toon, flat } from '../core/materials';
import { letreiro } from './props';
import { PALETTE as P } from '../palette';

/**
 * ============================== A LOJINHA DE ROUPAS DO VILLA LOBOS
 *
 * O "mini shopping" do parque: um predio de dois pavimentos, com duas vitrines
 * de manequim, porta de vidro no meio, toldo listrado e letreiro. E a maior
 * peca do kit depois da roda gigante, e por isso mora em arquivo proprio —
 * `props.ts` ja passa de quatro mil linhas, e uma peca de trezentas nao cabe
 * la sem virar palheiro.
 *
 * ELA E UM PREDIO, E NAO UM QUIOSQUE, e isso muda tres coisas:
 *
 * 1. TEM SEGUNDO PAVIMENTO. Quiosque e um balcao com telhado; o que faz uma
 *    peca ler como "loja de rua" e ter andar de cima com janela, platibanda e
 *    caixa d'agua. Sem isso qualquer caixa vira barraca;
 * 2. A FACHADA E FEITA DE VAOS, e nao de paredes com desenho. As vitrines e a
 *    porta sao buracos de verdade, cercados por peitoril, verga e montantes —
 *    e o vidro mora no meio da espessura da parede. E o que faz a luz do toon
 *    desenhar a profundidade sozinha;
 * 3. TEM MIOLO. As paredes sao `FrontSide`: de dentro elas somem, e pela
 *    vitrine se veria a paisagem ATRAVES da loja. O forro, o piso e os
 *    manequins existem por isso — e sao o que da o que olhar enquanto a porta
 *    ainda nao abre.
 *
 * A CONTA DA CAMERA: 8,2 de altura escondem `8,2 / tan(34°) ≈ 12,2` de chao
 * atras dela. A cena tem que plantar isso num canto onde nao haja nada nessa
 * faixa — no Villa Lobos ela fica na ponta oeste, de costas para o rio, e a
 * faixa cega dela cai fora do mundo caminhavel.
 *
 * ELA E CONSTRUIDA OLHANDO PARA `+Z`, como toda peca do kit, e a cena gira. No
 * Villa Lobos ela leva `rotY = PI/2` para ficar paralela ao rio: quem decide se
 * uma fachada aparece e o produto escalar com a diagonal da camera, e ele da
 * 0,707 tanto para `+Z` quanto para `+X`.
 *
 * O TOLDO AVANCA POUCO (1,05) DE PROPOSITO. E a mesma armadilha do toldo do
 * quiosque: quem for ficar na calcada, na frente da vitrine — a ovelha que vai
 * cuidar da loja —, precisa estar FORA da sombra dele. Com o toldo a 3,15 e a
 * ovelha com uns 1,2, ele engole 1,5 × 1,95 ≈ 2,9 atras da propria borda; a
 * borda esta a 1,05 da parede, entao qualquer coisa a mais de 2 da fachada
 * aparece inteira.
 */
export interface LojaOpts {
  /** o nome no letreiro — provisorio ate o Renan batizar a loja */
  nome?: string;
  corToldo?: number;
}

export function lojaDeRoupas(opts: LojaOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'loja-de-roupas';

  const parede = toon(P.lojaParede);
  const paredeAlta = toon(P.lojaParedeAlta);
  const faixa = toon(P.lojaFaixa);
  const esquadria = toon(P.lojaEsquadria);
  const tijolo = toon(P.lojaTijolo);
  const toldo = toon(opts.corToldo ?? P.lojaToldo);
  /*
   * O VIDRO E `flat()`, e nao `toon()`. Vidro nao recebe sombra: com o material
   * sombreado, a vitrine inteira caia no degrade escuro do toon e virava uma
   * mancha cinza-esverdeada — os manequins existiam e ninguem via. Chapado e
   * bem transparente (0,26), ele vira reflexo em cima do que esta atras.
   */
  const vidro = flat(P.lojaVitrine, 0.26);
  const dentro = toon(P.lojaDentro);
  const madeira = toon(P.woodDark);

  // ------------------------------------------------------------- as medidas
  const LARG = 11;
  const FUNDO = 8;
  const ESP = 0.24;        // espessura de parede
  const BASE = 0.2;        // o plinto
  const H1 = 3.5;          // do plinto ao piso do segundo
  const H2 = 2.5;          // o segundo pavimento
  const CORNIJA = 0.7;     // a platibanda que fecha em cima
  const meia = LARG / 2 - ESP / 2;
  const frente = FUNDO / 2 - ESP / 2;
  // a frente e o fundo cabem ENTRE as laterais: com a largura cheia, as pontas
  // delas terminam no MESMO plano da face de fora das laterais, e duas faces
  // olhando para o mesmo lado brigam pelo mesmo pixel
  const VAO = LARG - ESP * 2;

  const caixa = (
    l: number, a: number, p: number, mat: THREE.Material,
    x: number, y: number, z: number,
  ): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(l, a, p), mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  // ---------------------------------------------------------------- o plinto
  // 20 cm mais largo que a parede dos dois lados: encostar na mesma medida poe
  // duas faces no mesmo plano e a quina serrilha quando a camera gira
  caixa(LARG + 0.4, BASE, FUNDO + 0.4, toon(P.concrete), 0, BASE / 2, 0);

  // ------------------------------------------------------------- o terreo
  caixa(VAO, H1, ESP, parede, 0, BASE + H1 / 2, -frente);          // fundo
  /*
   * AS LATERAIS NASCEM 3 CM MAIS FUNDO E TERMINAM 3 CM MAIS BAIXO que a frente
   * e o fundo. Casadas no numero, elas dividiam o plano de baixo (`y = 0,20`) e
   * o de cima com todas as outras paredes, e cada quina do predio virava um par
   * coplanar. Tres centimetros dentro do plinto e debaixo da faixa: ninguem ve,
   * e o detector para de acusar porque a briga deixou de existir.
   */
  for (const lado of [-1, 1] as const) {
    caixa(ESP, H1, FUNDO - ESP, parede, lado * meia, BASE - 0.03 + H1 / 2, 0);
  }

  /*
   * A FACHADA: duas vitrines e a porta, cercadas por peitoril, verga e
   * montantes. O vao das vitrines vai de `y = 0,75` a `2,95` (altura de
   * vitrine de verdade: comeca na cintura e passa da cabeca), e a porta vai do
   * chao a `2,6`.
   */
  const zF = frente;
  const PORTA = 1.15;      // meia largura da porta
  const VIT0 = 1.55;       // onde a vitrine comeca, a partir do centro
  const VIT1 = VAO / 2 - 0.5;
  const VY0 = BASE + 0.55;
  const VY1 = BASE + 2.75;
  const PY = BASE + 2.6;   // alto da porta

  // peitoril das vitrines (a faixa baixa embaixo do vidro), um de cada lado
  for (const lado of [-1, 1] as const) {
    const larguraDaVitrine = VIT1 - VIT0;
    caixa(larguraDaVitrine, VY0 - BASE, ESP, parede,
      lado * (VIT0 + larguraDaVitrine / 2), BASE + (VY0 - BASE) / 2, zF);
    // montante entre a porta e a vitrine
    caixa(VIT0 - PORTA, H1, ESP, parede, lado * (PORTA + (VIT0 - PORTA) / 2), BASE + H1 / 2, zF);
    // ombreira da ponta
    caixa(VAO / 2 - VIT1, H1, ESP, parede, lado * (VIT1 + (VAO / 2 - VIT1) / 2), BASE + H1 / 2, zF);
    // verga sobre a vitrine
    caixa(larguraDaVitrine, BASE + H1 - VY1, ESP, parede,
      lado * (VIT0 + larguraDaVitrine / 2), (VY1 + BASE + H1) / 2, zF);
  }
  // verga sobre a porta
  caixa(PORTA * 2, BASE + H1 - PY, ESP, parede, 0, (PY + BASE + H1) / 2, zF);

  // ------------------------------------------------------- vidro e esquadria
  for (const lado of [-1, 1] as const) {
    const larguraDaVitrine = VIT1 - VIT0;
    const cx = lado * (VIT0 + larguraDaVitrine / 2);
    const painel = new THREE.Mesh(
      new THREE.BoxGeometry(larguraDaVitrine, VY1 - VY0, 0.06),
      vidro,
    );
    painel.position.set(cx, (VY0 + VY1) / 2, zF);
    g.add(painel);

    /*
     * A MOLDURA: quatro barras um fio A FRENTE da parede.
     *
     * AS HORIZONTAIS E AS VERTICAIS FICAM EM `z` DIFERENTES (2 cm contra 3,5),
     * e as verticais cabem ENTRE as horizontais. Casadas, elas dividiam o mesmo
     * plano de frente e o mesmo plano de topo em cada uma das quatro quinas —
     * oito pares coplanares por vitrine, que serrilham com a camera colada.
     */
    const molde = (l: number, a: number, x: number, y: number, z: number): void => {
      caixa(l, a, 0.09, esquadria, x, y, zF + ESP / 2 + z);
    };
    molde(larguraDaVitrine + 0.16, 0.14, cx, VY0 - 0.02, 0.02);
    molde(larguraDaVitrine + 0.16, 0.14, cx, VY1 + 0.02, 0.02);
    const alturaDaBarra = VY1 - VY0 - 0.04;
    molde(0.14, alturaDaBarra, cx - larguraDaVitrine / 2 - 0.02, (VY0 + VY1) / 2, 0.035);
    molde(0.14, alturaDaBarra, cx + larguraDaVitrine / 2 + 0.02, (VY0 + VY1) / 2, 0.035);
    // o montante do meio, que divide a vitrine em duas folhas
    molde(0.1, alturaDaBarra, cx, (VY0 + VY1) / 2, 0.05);
  }

  // a porta: duas folhas de vidro com puxador, e o batente em volta
  for (const lado of [-1, 1] as const) {
    const folha = new THREE.Mesh(new THREE.BoxGeometry(PORTA - 0.07, PY - BASE - 0.12, 0.05), vidro);
    folha.position.set(lado * PORTA / 2, BASE + (PY - BASE) / 2, zF);
    g.add(folha);
    const puxador = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), toon(P.metalGrey));
    puxador.position.set(lado * 0.13, BASE + 1.15, zF + 0.1);
    g.add(puxador);
  }
  caixa(PORTA * 2 + 0.2, 0.14, 0.1, esquadria, 0, PY + 0.04, zF + ESP / 2 + 0.02);
  for (const lado of [-1, 1] as const) {
    // e o batente tambem afunda 2 cm: o pe dele casava com o pe do montante da
    // fachada, que passa rente a ele
    caixa(0.14, PY - BASE + 0.04, 0.1, esquadria, lado * (PORTA + 0.05),
      BASE - 0.04 + (PY - BASE + 0.04) / 2, zF + ESP / 2 + 0.035);
  }

  // ------------------------------------------------------- o rodape de tijolo
  // um anel macico 3 cm mais gordo que a parede, e nao quatro tiras coladas nas
  // faces: quatro tiras encostam face contra face nas quinas e brigam
  const rodape = new THREE.Mesh(
    new THREE.BoxGeometry(LARG + 0.06, 0.5, FUNDO + 0.06),
    tijolo,
  );
  rodape.position.y = BASE + 0.19;
  g.add(rodape);
  // o degrau da porta interrompe o rodape ali, e e por onde se entra
  // e ele afunda 2 cm no plinto: nascendo em `y = 0,20` o pe dele ficava no
  // mesmo plano do pe das paredes da fachada
  caixa(PORTA * 2 + 0.5, 0.16, 0.6, toon(P.concrete), 0, BASE + 0.06, zF + 0.36);

  // -------------------------------------------------------------- por dentro
  /*
   * O MIOLO: forro do fundo, piso e uma parede de fundo de vitrine. Sem eles a
   * loja e um vao vazado — as paredes sao `FrontSide` e somem de dentro, e a
   * vitrine mostraria o gramado do outro lado do predio.
   */
  // o forro afunda 2 cm no plinto, como as laterais: em `y = 0,20` ele dividia
  // o plano de baixo com as paredes
  caixa(VAO - 0.08, H1 - 0.2, 0.06, dentro, 0, BASE - 0.02 + (H1 - 0.2) / 2, -frente + 0.16);
  caixa(VAO - 0.12, 0.08, FUNDO - ESP * 2 - 0.12, toon(P.floorWood), 0, BASE + 0.05, 0);
  // o fundo das vitrines, logo atras do vidro: e o que faz a vitrine ter caixa
  for (const lado of [-1, 1] as const) {
    const larguraDaVitrine = VIT1 - VIT0;
    caixa(larguraDaVitrine, VY1 - VY0 + 0.2, 0.06, dentro,
      lado * (VIT0 + larguraDaVitrine / 2), (VY0 + VY1) / 2, zF - 1.3);
  }

  // ----------------------------------------------------------- os manequins
  /*
   * UM POR VITRINE, e cada um numa cor. Manequim nao tem cabeca nem braco: e
   * um torso num pedestal, e e justamente isso que faz ele ler como manequim
   * em vez de gente parada dentro da loja.
   */
  const manequim = (x: number, corDaRoupa: number, comSaia: boolean): void => {
    const pele = toon(P.lojaManequim);
    const roupa = toon(corDaRoupa);
    const y0 = BASE + 0.09;
    const zM = zF - 0.5; // colado no vidro: recuado, ele sumia no fundo escuro

    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.06, 12), toon(P.metalGrey));
    pe.position.set(x, y0 + 0.03, zM);
    g.add(pe);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), toon(P.metalGrey));
    haste.position.set(x, y0 + 0.4, zM);
    g.add(haste);

    const quadril = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), pele);
    quadril.scale.set(0.24, 0.2, 0.18);
    quadril.position.set(x, y0 + 0.82, zM);
    g.add(quadril);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.42, 4, 12), pele);
    torso.position.set(x, y0 + 1.2, zM);
    torso.scale.z = 0.78;
    g.add(torso);
    // os ombros cortados, que e a assinatura de manequim de vitrine
    for (const lado of [-1, 1] as const) {
      const ombro = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), pele);
      ombro.position.set(x + lado * 0.24, y0 + 1.5, zM);
      g.add(ombro);
    }

    if (comSaia) {
      const saia = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.66, 14, 1, true), roupa);
      saia.position.set(x, y0 + 0.78, zM);
      g.add(saia);
      const corpete = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.3, 4, 12), roupa);
      corpete.position.set(x, y0 + 1.24, zM);
      corpete.scale.z = 0.8;
      g.add(corpete);
    } else {
      const casaco = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.5, 4, 12), roupa);
      casaco.position.set(x, y0 + 1.16, zM);
      casaco.scale.z = 0.8;
      g.add(casaco);
      const calca = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.62, 10), toon(P.roupaJeans));
      calca.position.set(x, y0 + 0.62, zM);
      g.add(calca);
    }
  };
  /*
   * AS CORES DELES SAO CHEIAS, e nao os rosas lavados do guarda-roupa: atras do
   * vidro, com a luz que sobra la dentro, um `vestidoRosa` (0xf6d3d8) ficava do
   * mesmo tom do proprio manequim e a roupa sumia. Vitrine pede cor que aguente
   * duas camadas de transparencia.
   */
  manequim(-(VIT0 + (VIT1 - VIT0) / 2), P.waRosaForte, true);
  manequim(VIT0 + (VIT1 - VIT0) / 2, P.roupaLa, false);

  // e a vitrine e ILUMINADA: uma calha chapada no alto de cada uma, com o
  // estrado claro embaixo. Sem elas os manequins pousam no escuro e o vao lê
  // como buraco em vez de vitrine
  for (const lado of [-1, 1] as const) {
    const larguraDaVitrine = VIT1 - VIT0;
    const cx = lado * (VIT0 + larguraDaVitrine / 2);
    const calha = new THREE.Mesh(
      new THREE.BoxGeometry(larguraDaVitrine - 0.3, 0.1, 0.9),
      flat(P.luzDoPortao),
    );
    calha.position.set(cx, VY1 - 0.14, zF - 0.9);
    g.add(calha);
    caixa(larguraDaVitrine - 0.1, 0.1, 1.5, toon(P.lojaEsquadria), cx, VY0 + 0.03, zF - 0.85);
  }

  // ------------------------------------------------------------- os toldos
  /*
   * Um por vitrine, listrado. As ripas alternam duas cores e sao INCLINADAS —
   * toldo reto lê como prateleira. E ele avanca 1,05, que e o limite da conta
   * da camera (ver o cabecalho).
   */
  for (const lado of [-1, 1] as const) {
    const larguraDaVitrine = VIT1 - VIT0;
    const cx = lado * (VIT0 + larguraDaVitrine / 2);
    const RIPAS = 9;
    const passo = (larguraDaVitrine + 0.3) / RIPAS;
    for (let i = 0; i < RIPAS; i++) {
      const ripa = new THREE.Mesh(
        new THREE.BoxGeometry(passo * 0.94, 0.08, 1.05),
        i % 2 === 0 ? toldo : esquadria,
      );
      ripa.position.set(
        cx - (larguraDaVitrine + 0.3) / 2 + passo * (i + 0.5),
        VY1 + 0.42,
        zF + 0.62,
      );
      ripa.rotation.x = -0.34;
      g.add(ripa);
    }
    // o babado da barra, pendurado na ponta do toldo
    const babado = new THREE.Mesh(new THREE.BoxGeometry(larguraDaVitrine + 0.3, 0.2, 0.06), toldo);
    babado.position.set(cx, VY1 + 0.09, zF + 1.05);
    g.add(babado);
    // as duas hastes que seguram
    for (const s of [-1, 1] as const) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.15, 6), toon(P.metalGrey));
      haste.position.set(cx + s * (larguraDaVitrine / 2 + 0.1), VY1 + 0.45, zF + 0.6);
      haste.rotation.x = Math.PI / 2 - 0.34;
      g.add(haste);
    }
  }

  // ------------------------------------------------------ o segundo pavimento
  const y2 = BASE + H1;
  // a faixa que separa os dois pavimentos, saliente: e o que impede o predio de
  // ler como uma parede alta so
  caixa(LARG + 0.24, 0.34, FUNDO + 0.24, faixa, 0, y2 + 0.1, 0);

  caixa(VAO, H2, ESP, paredeAlta, 0, y2 + 0.34 + H2 / 2, -frente);
  for (const lado of [-1, 1] as const) {
    // mesma folga de 3 cm das laterais do terreo, e pelo mesmo motivo
    caixa(ESP, H2, FUNDO - ESP, paredeAlta, lado * meia, y2 + 0.31 + H2 / 2, 0);
  }
  caixa(VAO, H2, ESP, paredeAlta, 0, y2 + 0.34 + H2 / 2, zF);

  /*
   * QUATRO JANELAS, e elas sao DECALQUE e nao vao: o segundo andar nao tem
   * nada dentro para se ver, e abrir buraco ali so mostraria o vazio. Cada uma
   * e uma placa de vidro com moldura, peitoril e floreira — o peitoril e a
   * floreira sao o que dao a sombrinha que faz a janela parecer funda.
   */
  const yJ = y2 + 0.34 + H2 / 2 + 0.1;
  for (const i of [-1.5, -0.5, 0.5, 1.5]) {
    const x = i * 2.6;
    const painel = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.45, 0.08), vidro);
    painel.position.set(x, yJ, zF + ESP / 2 + 0.01);
    g.add(painel);
    // moldura — horizontais e verticais em `z` e em alturas que nao se casam,
    // pelo mesmo motivo da moldura da vitrine
    // as horizontais PASSAM das verticais em 3 cm de cada lado: casadas no
    // mesmo x, a ponta de uma dividia plano com a lateral da outra
    caixa(1.51, 0.12, 0.12, esquadria, x, yJ + 0.78, zF + ESP / 2 + 0.03);
    caixa(1.51, 0.12, 0.12, esquadria, x, yJ - 0.78, zF + ESP / 2 + 0.03);
    for (const s of [-1, 1] as const) {
      caixa(0.12, 1.5, 0.12, esquadria, x + s * 0.665, yJ, zF + ESP / 2 + 0.045);
    }
    // a cruzeta que divide a janela em quatro vidracas: a barra deitada e a em
    // pe se cruzam no meio, entao elas tambem precisam de `z` diferente
    caixa(1.25, 0.07, 0.09, esquadria, x, yJ, zF + ESP / 2 + 0.075);
    caixa(0.07, 1.45, 0.09, esquadria, x, yJ, zF + ESP / 2 + 0.095);
    // peitoril e floreira
    caixa(1.65, 0.1, 0.28, esquadria, x, yJ - 0.88, zF + 0.16);
    caixa(1.3, 0.26, 0.24, madeira, x, yJ - 0.7, zF + 0.24);
    for (const f of [-1, 0, 1] as const) {
      const flor = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), toon(f === 0 ? P.flowerYellow : P.flowerPink));
      flor.position.set(x + f * 0.34, yJ - 0.53, zF + 0.24);
      g.add(flor);
    }
  }

  // --------------------------------------------------------- a platibanda
  const yC = y2 + 0.34 + H2;
  caixa(LARG + 0.4, CORNIJA, FUNDO + 0.4, parede, 0, yC + CORNIJA / 2, 0);
  // o filete de cima, um pouco mais largo ainda: e a sombra dele que fecha o
  // predio em vez de deixar a parede terminar no ar
  caixa(LARG + 0.62, 0.18, FUNDO + 0.62, faixa, 0, yC + CORNIJA - 0.02, 0);

  // ------------------------------------------------------------- o letreiro
  /*
   * O LETREIRO VAI NA PLATIBANDA, e nao em cima do toldo: em cima do toldo ele
   * fica na altura do beiral e some atras dele na camera de 34°. Aqui em cima
   * ele e a primeira coisa que se ve do predio, de qualquer canto do parque.
   */
  /*
   * E ELA AVANCA ALEM DO FILETE DA PLATIBANDA. Alinhada com ele — os dois
   * terminavam em `z = 4,31` —, a placa dividia 1,69 m² de plano com o filete:
   * o maior par coplanar da peca inteira, e o unico que serrilharia de longe.
   */
  const placa = new THREE.Mesh(new THREE.BoxGeometry(LARG - 1.6, 0.86, 0.14), toon(P.lojaLetreiro));
  placa.position.set(0, yC + CORNIJA / 2 + 0.02, FUNDO / 2 + 0.4);
  g.add(placa);
  const nome = letreiro(opts.nome ?? 'MODAS', LARG - 2.4, 0.6, '#fdfaf6');
  nome.position.set(0, yC + CORNIJA / 2 + 0.02, FUNDO / 2 + 0.49);
  g.add(nome);
  // as lampadas em volta do letreiro
  for (let i = 0; i < 7; i++) {
    const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), toon(P.luzDoPortao, { glow: 0.6 }));
    bulbo.position.set(-(LARG - 2.2) / 2 + ((LARG - 2.2) / 6) * i, yC + CORNIJA + 0.12, FUNDO / 2 + 0.28);
    g.add(bulbo);
  }

  // ---------------------------------------------------------- o telhado
  const yT = yC + CORNIJA - 0.14;
  const laje = new THREE.Mesh(new THREE.BoxGeometry(LARG - 0.1, 0.12, FUNDO - 0.1), flat(P.concrete));
  laje.position.y = yT;
  g.add(laje);

  // caixa d'agua e dois condensadores: e o que diz "predio" em vez de "casinha"
  const caixaDagua = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.9, 12), toon(P.vestiarioCaixa));
  caixaDagua.position.set(-3.4, yT + 0.51, -1.6);
  g.add(caixaDagua);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.16, 10), toon(P.vestiarioCaixa));
  tampa.position.set(-3.4, yT + 1.02, -1.6);
  g.add(tampa);
  for (const x of [1.6, 3.2]) {
    caixa(0.9, 0.62, 0.9, toon(P.metalGrey), x, yT + 0.37, -1.8);
    const grelha = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 12), toon(P.churrascoInoxEscuro));
    grelha.position.set(x, yT + 0.71, -1.8);
    g.add(grelha);
  }

  // ------------------------------------------------------- a calcada e o resto
  /*
   * Os detalhes de rua: dois vasos ladeando a porta, o capacho, as duas
   * luminarias da fachada e a plaquinha de ABERTO pendurada na porta. Sao eles
   * que fazem a diferenca entre "predio" e "loja que abre amanha cedo".
   */
  for (const lado of [-1, 1] as const) {
    const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.5, 10), toon(P.plantPot));
    vaso.position.set(lado * (PORTA + 0.62), BASE + 0.25, zF + 0.5);
    g.add(vaso);
    for (let i = 0; i < 4; i++) {
      const folha = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), toon(i % 2 ? P.leafMid : P.leafLight));
      folha.scale.set(1, 0.8, 1);
      folha.position.set(
        lado * (PORTA + 0.62) + Math.cos(i * 1.9) * 0.16,
        BASE + 0.62 + i * 0.1,
        zF + 0.5 + Math.sin(i * 1.9) * 0.16,
      );
      g.add(folha);
    }

    // luminaria de fachada, entre a vitrine e a ponta
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 6), toon(P.metalGrey));
    braco.position.set(lado * (VIT1 + 0.25), VY1 + 0.62, zF + 0.14);
    braco.rotation.x = Math.PI / 2;
    g.add(braco);
    const cupula = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.24, 10), toon(P.lojaToldo));
    cupula.position.set(lado * (VIT1 + 0.25), VY1 + 0.52, zF + 0.3);
    g.add(cupula);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), toon(P.luzDoPortao, { glow: 0.7 }));
    luz.position.set(lado * (VIT1 + 0.25), VY1 + 0.4, zF + 0.3);
    g.add(luz);
  }

  const capacho = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.04, 0.7), toon(P.roupaLaBarra));
  capacho.position.set(0, BASE + 0.18, zF + 0.98);
  g.add(capacho);

  // a plaquinha de ABERTO, pendurada num cordao atras do vidro da porta
  const cordao = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6), toon(P.metalGrey));
  cordao.position.set(0.55, PY - 0.34, zF - 0.06);
  g.add(cordao);
  const plaquinha = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.3, 0.04), esquadria);
  plaquinha.position.set(0.55, PY - 0.62, zF - 0.06);
  g.add(plaquinha);
  const escrito = letreiro('ABERTO', 0.54, 0.2, '#d4788c');
  escrito.position.set(0.55, PY - 0.62, zF - 0.03);
  g.add(escrito);

  // as pilastras das laterais, para a parede de 8 metros nao ficar lisa
  for (const lado of [-1, 1] as const) {
    for (const z of [-2.4, 0, 2.4]) {
      caixa(0.16, H1 + H2 + 0.34, 0.4, faixa, lado * (LARG / 2 + 0.02), BASE + (H1 + H2 + 0.34) / 2, z);
    }
  }

  return g;
}
