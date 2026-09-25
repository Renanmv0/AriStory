import * as THREE from 'three';
import { brilhoDeLuz, luzNoChao, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { retratoDe } from './retrato';

/**
 * OS ENFEITES DA ESTUFA — o que a lojinha da Josefina vende na aba de
 * decorações, e que a dupla põe onde quiser dentro da estufa (pedido do
 * Renan: "várias decorações diferentes… para deixar a estufa mais
 * bonitinha").
 *
 * UM ARQUIVO SÓ, com a ficha E a geometria de cada enfeite, de propósito: o
 * catálogo vai crescer ("com o tempo a gente vai adicionando mais"), e
 * acrescentar um enfeite tem que ser escrever UMA função e UMA entrada em
 * `DECORACOES` — o painel da loja, a compra, o retrato, o modo de colocar e o
 * save leem tudo daqui.
 *
 * O CONTRATO DE UM ENFEITE é o do kit (`props.ts`): base em `y = 0`, frente
 * para `+Z`, centrado na origem, sem colisor e sem tocar no mundo. E mais:
 *
 * - **`raio` é a PEGADA no chão**, em metros: o círculo que o enfeite ocupa.
 *   É com ele que o modo de colocar decide se cabe (não encosta em canteiro,
 *   parede, móvel nem em outro enfeite). O colisor que a cena põe é menor
 *   (`0,75 · raio`), para a dupla poder chegar perto.
 * - **Baixo é melhor.** A estufa é vista de cima e de `+X/+Z`: enfeite alto
 *   no lado da porta tapa a dupla. Até ~1,2 m está bom; o que passar disso
 *   precisa de motivo.
 * - **Cor viva** (o bloco "OS ENFEITES DA ESTUFA" da paleta): enfeite tem que
 *   ler como coisa que alguém pôs ali, e não como mais uma planta.
 */

export interface FichaDeDecoracao {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  /**
   * O PREÇO, EM GIRASSÓIS 🌻 — a moeda da estufa, que só a rodada do jardim
   * paga (um a cada 15 bichos espantados; ver `minigames/jardim/premios.ts`).
   * A régua: simples 4–6, de personagem 6–11, com luz ou movimento 8–18.
   */
  readonly girassois: number;
  /**
   * A ONDA EM QUE A JOSEFINA PASSA A VENDER (pedido do Renan: "a cada onda que
   * a gente chega, a Josefina desbloqueia mais compras"). É o RECORDE da dupla
   * que tem que chegar lá; 0 = à venda desde o começo.
   */
  readonly onda: number;
  /** uma frase para o cartão da loja */
  readonly descricao: string;
  /** a pegada no chão, em metros (ver o topo do arquivo) */
  readonly raio: number;
  /** o artigo do nome, para as falas ("o anão", "a lanterninha") */
  readonly artigo: 'o' | 'a';
  readonly monta: () => THREE.Group;
  /**
   * O QUE SE MEXE (a roda da roda gigante, a hélice do cata-vento): chamado
   * todo quadro com a peça montada e o tempo em segundos. A peça marca as
   * partes que giram em `userData`, e é por lá que a função as acha.
   */
  readonly anima?: (peca: THREE.Object3D, t: number) => void;
}

// ------------------------------------------------------------ a luz

/**
 * A POÇA DE LUZ no chão, embaixo de uma lâmpada: um disco com o degradê de
 * `luzNoChao`, um fio acima do piso. `alonga` estica no `x` (o varal é
 * comprido, a poça dele também).
 */
function pocaDeLuz(raio: number, alonga = 1): THREE.Mesh {
  const poca = new THREE.Mesh(new THREE.PlaneGeometry(raio * 2 * alonga, raio * 2), luzNoChao(P.enfeiteLanternaLuz));
  poca.rotation.x = -Math.PI / 2;
  poca.position.y = 0.025;
  poca.renderOrder = 2;
  return poca;
}

/** O HALO em volta de uma lâmpada: um brilho macio sempre de frente para a câmera. */
function haloDeLuz(tamanho: number, cor: number = P.enfeiteLanternaLuz): THREE.Sprite {
  const halo = new THREE.Sprite(brilhoDeLuz(cor));
  halo.scale.set(tamanho, tamanho, 1);
  halo.renderOrder = 3;
  return halo;
}

// ------------------------------------------------------------ as peças

/** O anão de jardim: gorro vermelho de ponta, barba branca, roupa azul. */
function anaoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-anao';
  const bota = toon(P.enfeiteGnomoBota);
  for (const lado of [-1, 1]) {
    const pe = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), bota);
    pe.scale.set(1, 0.6, 1.4);
    pe.position.set(lado * 0.07, 0.045, 0.03);
    g.add(pe);
  }
  // o corpo: um barril baixo, mais largo embaixo
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.24, 14), toon(P.enfeiteGnomoRoupa));
  corpo.position.y = 0.19;
  g.add(corpo);
  const cinto = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.146, 0.035, 14), toon(P.enfeiteGnomoCinto));
  cinto.position.y = 0.2;
  g.add(cinto);
  // a cabeça, e a barba em cone por cima do peito
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), toon(P.enfeiteGnomoPele));
  cabeca.position.y = 0.38;
  g.add(cabeca);
  const barba = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 12), toon(P.enfeiteGnomoBarba));
  barba.rotation.x = Math.PI;
  barba.position.set(0, 0.31, 0.05);
  g.add(barba);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.enfeiteFlamingo));
  nariz.position.set(0, 0.37, 0.1);
  g.add(nariz);
  // o gorro de ponta, tombando um fio para trás
  const gorro = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.3, 14), toon(P.enfeiteGnomoGorro));
  gorro.position.set(0, 0.56, -0.015);
  gorro.rotation.x = -0.18;
  g.add(gorro);
  return g;
}

/** O flamingo de plástico: rosa, pescoço em S e perninhas de arame. */
function flamingoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-flamingo';
  const rosa = toon(P.enfeiteFlamingo);
  const perna = toon(P.enfeiteFlamingoPerna);
  for (const lado of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), perna);
    p.position.set(lado * 0.04, 0.25, 0);
    g.add(p);
  }
  // o corpo: um ovo deitado, a cauda um pouco mais alta que o peito
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), rosa);
  corpo.scale.set(0.85, 0.7, 1.35);
  corpo.position.set(0, 0.6, -0.04);
  corpo.rotation.x = 0.2;
  g.add(corpo);
  const asa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), toon(P.enfeiteFlamingoEscuro));
  asa.scale.set(0.95, 0.55, 1.2);
  asa.position.set(0, 0.64, -0.08);
  g.add(asa);
  // o pescoço em S: um tubo por uma curva que sobe, volta e sobe de novo
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.66, 0.14),
    new THREE.Vector3(0, 0.8, 0.2),
    new THREE.Vector3(0, 0.92, 0.1),
    new THREE.Vector3(0, 1.02, 0.12),
  ]);
  const pescoco = new THREE.Mesh(new THREE.TubeGeometry(curva, 16, 0.032, 8, false), rosa);
  g.add(pescoco);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), rosa);
  cabeca.position.set(0, 1.04, 0.13);
  g.add(cabeca);
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.1, 8), toon(P.enfeiteFlamingoBico));
  bico.rotation.x = Math.PI / 2 + 0.6;
  bico.position.set(0, 1.0, 0.2);
  g.add(bico);
  return g;
}

/** O vaso grande de barro, com um buquê de três cores. */
function vasoDeFlores(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-vaso-de-flores';
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.19, 0.42, 14), toon(P.barroDoVaso));
  vaso.position.y = 0.21;
  g.add(vaso);
  const borda = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.07, 14), toon(P.barroDaBorda));
  borda.position.y = 0.4;
  g.add(borda);
  const terra = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 14), toon(P.terraDeCanteiro));
  terra.position.y = 0.425;
  g.add(terra);
  // as folhas em volta, e as flores por cima: cada flor é um miolo com
  // cinco pétalas achatadas, espalhadas pelo ângulo áureo (sem sorteio)
  const folha = toon(P.leafDark);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), folha);
    f.scale.set(1, 0.5, 1.6);
    f.position.set(Math.cos(a) * 0.15, 0.5, Math.sin(a) * 0.15);
    f.rotation.y = -a;
    g.add(f);
  }
  const cores = [P.enfeiteFlorRosa, P.enfeiteFlorBranca, P.enfeiteFlorLilas];
  for (let i = 0; i < 7; i++) {
    const a = i * 2.39996;
    const r = 0.05 + (i % 3) * 0.06;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = 0.6 + (i % 2) * 0.08;
    const petala = toon(cores[i % cores.length]);
    for (let k = 0; k < 5; k++) {
      const b = (k / 5) * Math.PI * 2;
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 7, 5), petala);
      p.scale.set(1, 0.45, 1);
      p.position.set(x + Math.cos(b) * 0.035, y, z + Math.sin(b) * 0.035);
      g.add(p);
    }
    const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.022, 7, 5), toon(P.enfeiteFlorMiolo));
    miolo.position.set(x, y + 0.012, z);
    g.add(miolo);
  }
  return g;
}

/** O banquinho de madeira de jardim, para dois. */
function banquinhoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-banquinho';
  const madeira = toon(P.wood);
  const escura = toon(P.woodDark);
  const L = 1.0;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), escura);
      perna.position.set(sx * (L / 2 - 0.08), 0.2, sz * 0.13);
      g.add(perna);
    }
  }
  // três ripas no assento, com um vão entre elas (não encostam de lado)
  for (let i = 0; i < 3; i++) {
    const ripa = new THREE.Mesh(new THREE.BoxGeometry(L, 0.05, 0.1), madeira);
    ripa.position.set(0, 0.42, -0.12 + i * 0.12);
    g.add(ripa);
  }
  // o encosto: duas ripas em dois postes
  for (const sx of [-1, 1]) {
    const poste = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.05), escura);
    poste.position.set(sx * (L / 2 - 0.08), 0.64, -0.19);
    g.add(poste);
  }
  for (const y of [0.66, 0.8]) {
    const ripa = new THREE.Mesh(new THREE.BoxGeometry(L, 0.08, 0.035), madeira);
    ripa.position.set(0, y, -0.215);
    g.add(ripa);
  }
  return g;
}

/** A lanterninha de jardim: um poste baixo com a luz quente acesa. */
function lanternaDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-lanterna';
  const ferro = toon(P.enfeiteLanterna);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.08, 10), ferro);
  base.position.y = 0.04;
  g.add(base);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.7, 8), ferro);
  haste.position.y = 0.43;
  g.add(haste);
  // a caixa de vidro acesa, com a tampinha em pirâmide
  const luz = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.15), toon(P.enfeiteLanternaLuz, { glow: 0.85 }));
  luz.position.y = 0.88;
  g.add(luz);
  for (const [sx, sz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]] as const) {
    const quina = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.22, 0.022), ferro);
    quina.position.set(sx * 0.078, 0.88, sz * 0.078);
    g.add(quina);
  }
  const tampa = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.12, 4), ferro);
  tampa.rotation.y = Math.PI / 4;
  tampa.position.y = 1.04;
  g.add(tampa);
  const argola = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 12), ferro);
  argola.position.y = 1.12;
  g.add(argola);
  // A LUZ: o halo na caixa acesa e a poça quente no chão em volta
  const halo = haloDeLuz(0.75);
  halo.position.y = 0.88;
  g.add(halo);
  g.add(pocaDeLuz(1.1));
  return g;
}

/** O bebedouro de passarinho: taça de pedra com água, e um passarinho na borda. */
function bebedouroDePassarinho(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-bebedouro';
  const pedra = toon(P.enfeitePedra);
  const escura = toon(P.enfeitePedraEscura);
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.08, 12), escura);
  pe.position.y = 0.04;
  g.add(pe);
  const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 10), pedra);
  coluna.position.y = 0.33;
  g.add(coluna);
  const taca = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.12, 0.12, 16), pedra);
  taca.position.y = 0.64;
  g.add(taca);
  const aba = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.025, 6, 20), escura);
  aba.rotation.x = Math.PI / 2;
  aba.position.y = 0.7;
  g.add(aba);
  const agua = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.01, 16), toon(P.enfeiteAguaRasa, { glow: 0.15 }));
  agua.position.y = 0.69;
  g.add(agua);
  // o passarinho, empoleirado na borda de trás, olhando para dentro
  const ave = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), toon(P.enfeitePassarinho));
  corpo.scale.set(0.9, 0.85, 1.25);
  ave.add(corpo);
  const peito = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), toon(P.enfeitePassarinhoPeito));
  peito.position.set(0, -0.012, 0.035);
  ave.add(peito);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), toon(P.enfeitePassarinho));
  cabeca.position.set(0, 0.05, 0.05);
  ave.add(cabeca);
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.035, 6), toon(P.enfeiteFlorMiolo));
  bico.rotation.x = Math.PI / 2;
  bico.position.set(0, 0.048, 0.098);
  ave.add(bico);
  const cauda = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.07), toon(P.enfeitePassarinho));
  cauda.position.set(0, 0.01, -0.08);
  cauda.rotation.x = -0.4;
  ave.add(cauda);
  ave.position.set(0.05, 0.77, -0.3);
  ave.rotation.y = 0.3;
  g.add(ave);
  return g;
}


// ------------------------------------------- os de personagem e de lugar
// Pedido do Renan: enfeites "com referência aos outros personagens" e ao
// parque. São miniaturas de cerâmica ou de brinquedo — simples, e com a COR
// de quem elas lembram (as mesmas da paleta de cada bicho).

/** A tartaruguinha da Josefina: casco verde-oliva de escudos, e o laço rosa dela. */
function tartaruguinhaDaJosefina(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-tartaruguinha';
  const pele = toon(P.tartarugaPele);
  for (const [x, z] of [[-0.13, 0.12], [0.13, 0.12], [-0.13, -0.12], [0.13, -0.12]] as const) {
    const pe = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), pele);
    pe.scale.set(1, 0.6, 1.2);
    pe.position.set(x, 0.035, z);
    g.add(pe);
  }
  const casco = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.tartarugaCasco));
  casco.scale.set(1.05, 0.85, 1.2);
  casco.position.y = 0.06;
  g.add(casco);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.022, 6, 20), toon(P.tartarugaBarriga));
  borda.rotation.x = Math.PI / 2;
  borda.scale.set(1.05, 1.2, 1);
  borda.position.y = 0.065;
  g.add(borda);
  const escudo = toon(P.tartarugaEscudo);
  for (const [x, z, y] of [[0, 0, 0.23], [-0.1, 0.09, 0.19], [0.1, 0.09, 0.19], [-0.1, -0.09, 0.19], [0.1, -0.09, 0.19]] as const) {
    const e = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 6), escudo);
    e.position.set(x, y, z);
    e.lookAt(x * 3, 0.06 + (y - 0.06) * 3, z * 3);
    e.rotateX(Math.PI / 2);
    g.add(e);
  }
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), pele);
  cabeca.position.set(0, 0.13, 0.3);
  g.add(cabeca);
  for (const lado of [-1, 1]) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), toon(P.joaninhaPreto));
    olho.position.set(lado * 0.035, 0.155, 0.37);
    g.add(olho);
    const aba = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 8), toon(P.lacoDaJosefina));
    aba.rotation.z = lado * Math.PI / 2;
    aba.position.set(lado * 0.035, 0.22, 0.27);
    g.add(aba);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), toon(P.lacoDaJosefina));
  no.position.set(0, 0.22, 0.27);
  g.add(no);
  return g;
}

/** A capivara de jardim: o Capy salva-vidas, sentado, de óculos escuros. */
function capivaraDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-capivara';
  const pelo = toon(P.capivaraPelo);
  const escuro = toon(P.capivaraEscuro);
  for (const [x, z] of [[-0.1, 0.14], [0.1, 0.14], [-0.12, -0.14], [0.12, -0.14]] as const) {
    const pata = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.12, 8), escuro);
    pata.position.set(x, 0.06, z);
    g.add(pata);
  }
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), pelo);
  corpo.scale.set(0.95, 0.85, 1.3);
  corpo.position.y = 0.24;
  g.add(corpo);
  // a cabeça de capivara é quase um tijolo: comprida e de focinho reto
  const cabeca = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.24), pelo);
  cabeca.position.set(0, 0.36, 0.26);
  g.add(cabeca);
  const focinho = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.13, 0.08), toon(P.capivaraFocinho));
  focinho.position.set(0, 0.33, 0.4);
  g.add(focinho);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), escuro);
    orelha.position.set(lado * 0.08, 0.46, 0.18);
    g.add(orelha);
    // os óculos escuros do salva-vidas
    const lente = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 0.02), toon(P.oculosLente));
    lente.position.set(lado * 0.05, 0.39, 0.385);
    g.add(lente);
  }
  const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, 0.015), toon(P.oculosArmacao));
  ponte.position.set(0, 0.405, 0.39);
  g.add(ponte);
  // e o apito vermelho no pescoço
  const cordao = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.008, 5, 16), toon(P.estampaBranca));
  cordao.rotation.x = Math.PI / 2 - 0.5;
  cordao.position.set(0, 0.3, 0.2);
  g.add(cordao);
  const apito = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8), toon(P.camisetaSalvaVidas));
  apito.rotation.x = Math.PI / 2;
  apito.position.set(0, 0.24, 0.3);
  g.add(apito);
  return g;
}

/** A girafinha da Gina: girafa de brinquedo, de pescoção e chifrinhos. */
function girafinhaDaGina(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-girafinha';
  const pelo = toon(P.girafaPelo);
  const mancha = toon(P.girafaMancha);
  const casco = toon(P.girafaCasco);
  for (const [x, z] of [[-0.08, 0.13], [0.08, 0.13], [-0.08, -0.13], [0.08, -0.13]] as const) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.5, 8), pelo);
    perna.position.set(x, 0.27, z);
    g.add(perna);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), casco);
    pe.position.set(x, 0.02, z);
    g.add(pe);
  }
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), pelo);
  corpo.scale.set(0.9, 0.85, 1.4);
  corpo.position.y = 0.58;
  g.add(corpo);
  const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.5, 10), pelo);
  pescoco.position.set(0, 0.86, 0.16);
  pescoco.rotation.x = 0.35;
  g.add(pescoco);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), pelo);
  cabeca.scale.set(0.9, 0.85, 1.3);
  cabeca.position.set(0, 1.12, 0.27);
  g.add(cabeca);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), toon(P.girafaClaro));
  focinho.position.set(0, 1.1, 0.35);
  g.add(focinho);
  for (const lado of [-1, 1]) {
    const chifre = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.08, 6), pelo);
    chifre.position.set(lado * 0.03, 1.2, 0.24);
    g.add(chifre);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), casco);
    ponta.position.set(lado * 0.03, 1.245, 0.24);
    g.add(ponta);
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 5), pelo);
    orelha.scale.set(1.8, 0.6, 1);
    orelha.position.set(lado * 0.075, 1.15, 0.22);
    g.add(orelha);
  }
  // as manchas no corpo e no pescoço (sem sorteio: ângulo áureo)
  for (let i = 0; i < 9; i++) {
    const a = i * 2.39996;
    const naNuca = i > 5;
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 5), mancha);
    p.scale.set(1, 1, 0.35);
    if (naNuca) {
      const t = (i - 5) / 3;
      p.position.set(Math.sin(a) * 0.05, 0.72 + t * 0.3, 0.1 + t * 0.12 + Math.cos(a) * 0.03);
    } else {
      p.position.set(Math.sin(a) * 0.13, 0.6 + Math.cos(a * 1.3) * 0.06, Math.cos(a) * 0.18);
    }
    p.lookAt(p.position.x * 3, p.position.y, p.position.z * 3);
    g.add(p);
  }
  const rabo = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 5), pelo);
  rabo.position.set(0, 0.55, -0.25);
  rabo.rotation.x = 0.4;
  g.add(rabo);
  return g;
}

/** O Walter de cerâmica: sentadinho, de gravatinha borboleta, num pedestal. */
function walterDeCeramica(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-walter';
  const pelo = toon(P.cachorroPelo);
  const peito = toon(P.cachorroPeito);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16), toon(P.enfeitePedra));
  base.position.y = 0.03;
  g.add(base);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), pelo);
  corpo.scale.set(1, 1.15, 0.95);
  corpo.position.y = 0.2;
  g.add(corpo);
  const barriga = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), peito);
  barriga.scale.set(1, 1.2, 0.6);
  barriga.position.set(0, 0.21, 0.08);
  g.add(barriga);
  for (const lado of [-1, 1]) {
    const pata = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), pelo);
    pata.scale.set(1, 0.7, 1.4);
    pata.position.set(lado * 0.07, 0.085, 0.1);
    g.add(pata);
  }
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), pelo);
  cabeca.position.set(0, 0.4, 0.03);
  g.add(cabeca);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), peito);
  focinho.scale.set(1, 0.8, 1.1);
  focinho.position.set(0, 0.37, 0.11);
  g.add(focinho);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), toon(P.cachorroFocinho));
  nariz.position.set(0, 0.39, 0.165);
  g.add(nariz);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), toon(P.cachorroOrelha));
    orelha.scale.set(0.5, 1.2, 0.9);
    orelha.position.set(lado * 0.095, 0.37, 0.0);
    orelha.rotation.z = lado * 0.3;
    g.add(orelha);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 5), toon(P.joaninhaPreto));
    olho.position.set(lado * 0.035, 0.43, 0.09);
    g.add(olho);
    const aba = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 8), toon(P.gravataBorboleta));
    aba.rotation.z = lado * Math.PI / 2;
    aba.position.set(lado * 0.035, 0.3, 0.1);
    g.add(aba);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.017, 6, 5), toon(P.gravataBorboleta));
  no.position.set(0, 0.3, 0.1);
  g.add(no);
  return g;
}

/** O laguinho do Jean-Luc: água rasa, pedrinhas em volta e o pato de boina. */
function laguinhoDoJeanLuc(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-laguinho';
  const agua = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 24), toon(P.enfeiteAguaRasa, { glow: 0.12 }));
  agua.position.y = 0.02;
  g.add(agua);
  const pedra = toon(P.enfeitePedra);
  const escura = toon(P.enfeitePedraEscura);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075 + (i % 3) * 0.015, 0), i % 2 ? pedra : escura);
    p.position.set(Math.cos(a) * 0.55, 0.05, Math.sin(a) * 0.55);
    p.rotation.set(i, i * 0.7, 0);
    g.add(p);
  }
  // duas folhas de vitória-régia
  for (const [x, z, r] of [[-0.22, 0.15, 0.1], [0.2, -0.2, 0.08]] as const) {
    const folha = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.012, 12, 1, false, 0.4, Math.PI * 1.8), toon(P.leafDark));
    folha.position.set(x, 0.045, z);
    g.add(folha);
  }
  // o pato: branco dos patos do lago, e a boina azul da França
  const pato = new THREE.Group();
  const pena = toon(P.patoPena);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), pena);
  corpo.scale.set(0.85, 0.7, 1.2);
  pato.add(corpo);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), pena);
  cabeca.position.set(0, 0.1, 0.07);
  pato.add(cabeca);
  const bico = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toon(P.patoBico));
  bico.scale.set(1, 0.45, 1.4);
  bico.position.set(0, 0.09, 0.13);
  pato.add(bico);
  const boina = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 6), toon(P.azulFranca));
  boina.scale.set(1.15, 0.35, 1.15);
  boina.position.set(0.01, 0.155, 0.06);
  boina.rotation.z = -0.25;
  pato.add(boina);
  const cabinho = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.025, 5), toon(P.azulFranca));
  cabinho.position.set(0.01, 0.18, 0.06);
  pato.add(cabinho);
  const cauda = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), pena);
  cauda.rotation.x = -2.2;
  cauda.position.set(0, 0.04, -0.12);
  pato.add(cauda);
  pato.position.set(0.08, 0.08, 0.05);
  pato.rotation.y = 0.5;
  g.add(pato);
  return g;
}

/** A rodinha gigante do Villa Lobos: o aro gira devagar, e as cabines ficam em pé. */
function rodaGiganteMini(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-roda-gigante';
  const branco = toon(P.metalWhite);
  const cinza = toon(P.metalGrey);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.34), toon(P.enfeitePedra));
  base.position.y = 0.03;
  g.add(base);
  const EIXO = 0.64;
  // o cavalete em A dos dois lados da roda
  for (const z of [-0.1, 0.1]) {
    for (const lado of [-1, 1]) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.66, 6), cinza);
      perna.position.set(lado * 0.13, 0.35, z);
      perna.rotation.z = lado * 0.38;
      g.add(perna);
    }
  }
  const eixo = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.26, 8), cinza);
  eixo.rotation.x = Math.PI / 2;
  eixo.position.y = EIXO;
  g.add(eixo);
  const roda = new THREE.Group();
  roda.position.y = EIXO;
  g.add(roda);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.014, 6, 32), branco);
  roda.add(aro);
  for (let i = 0; i < 6; i++) {
    const raio = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.012, 0.012), branco);
    raio.rotation.z = (i / 6) * Math.PI;
    roda.add(raio);
  }
  // as cabines ficam FORA do grupo que gira (como na roda de verdade): a
  // animação só as leva para o lugar, e elas continuam penduradas em pé
  const cores = [P.fabricRed, P.lojaPacoteC, P.fabricBlue, P.lojaToldoVerde, P.enfeiteFlorRosa, P.enfeiteFlorLilas];
  const cabines: THREE.Object3D[] = [];
  for (let i = 0; i < 6; i++) {
    const cabine = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), toon(cores[i]));
    cabine.scale.set(1, 0.9, 0.8);
    g.add(cabine);
    cabines.push(cabine);
  }
  g.userData.roda = roda;
  g.userData.cabines = cabines;
  girarRoda(g, 0);
  return g;
}

function girarRoda(peca: THREE.Object3D, t: number): void {
  const roda = peca.userData.roda as THREE.Object3D | undefined;
  const cabines = peca.userData.cabines as THREE.Object3D[] | undefined;
  if (!roda || !cabines) return;
  const giro = t * 0.35;
  roda.rotation.z = giro;
  cabines.forEach((c, i) => {
    const a = giro + (i / cabines.length) * Math.PI * 2;
    c.position.set(Math.cos(a) * 0.4, roda.position.y + Math.sin(a) * 0.4 - 0.06, 0);
  });
}

/** A casquinha gigante do Mano: cone de waffle, bola de morango e a cereja. */
function casquinhaGigante(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-casquinha';
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.08, 14), toon(P.enfeiteFlorBranca));
  base.position.y = 0.04;
  g.add(base);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.5, 14), toon(P.casquinhaWaffle));
  cone.rotation.x = Math.PI;
  cone.position.y = 0.33;
  g.add(cone);
  // o quadriculado do waffle: anéis um degrau mais escuros
  for (let i = 0; i < 4; i++) {
    const y = 0.16 + i * 0.1;
    const r = 0.17 * ((y - 0.08) / 0.5) + 0.004;
    const anel = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 5, 16), toon(P.casquinhaGrelha));
    anel.rotation.x = Math.PI / 2;
    anel.position.y = y;
    g.add(anel);
  }
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), toon(P.aventalDoMano));
  bola.position.y = 0.66;
  g.add(bola);
  // os pingos escorrendo pela borda
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const pingo = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (i % 2) * 0.012, 8, 6), toon(P.aventalDoMano));
    pingo.scale.y = 1.5;
    pingo.position.set(Math.cos(a) * 0.17, 0.55 - (i % 2) * 0.04, Math.sin(a) * 0.17);
    g.add(pingo);
  }
  const cereja = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), toon(P.cerejaDoMano));
  cereja.position.y = 0.88;
  g.add(cereja);
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.09, 5), toon(P.leafDark));
  cabo.position.set(0.015, 0.95, 0);
  cabo.rotation.z = -0.3;
  g.add(cabo);
  return g;
}

/**
 * O varal de luzinhas: dois postes e o fio caído entre eles, com as lâmpadas
 * acesas — o corredor de luzinhas do pedido, em miniatura. Tem luz de
 * verdade na tela: halo em cada lâmpada e a poça quente comprida no chão.
 */
function varalDeLuzinhas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-varal-de-luzinhas';
  const madeira = toon(P.woodDark);
  const VAO = 0.75;
  const ALTO = 1.35;
  for (const lado of [-1, 1]) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, ALTO, 8), madeira);
    poste.position.set(lado * VAO, ALTO / 2, 0);
    g.add(poste);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.05, 10), madeira);
    pe.position.set(lado * VAO, 0.025, 0);
    g.add(pe);
  }
  const fio = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-VAO, ALTO - 0.03, 0),
    new THREE.Vector3(-VAO / 2, ALTO - 0.22, 0),
    new THREE.Vector3(0, ALTO - 0.28, 0),
    new THREE.Vector3(VAO / 2, ALTO - 0.22, 0),
    new THREE.Vector3(VAO, ALTO - 0.03, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(fio, 24, 0.006, 5, false), toon(P.joaninhaPreto)));
  const cores = [P.enfeiteLanternaLuz, P.cabineLuz, P.enfeiteFlorRosa, P.enfeiteLanternaLuz, P.luzDoPortao, P.enfeiteFlorLilas, P.enfeiteLanternaLuz];
  cores.forEach((cor, i) => {
    const p = fio.getPoint((i + 0.5) / cores.length);
    const lampada = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), toon(cor, { glow: 0.9 }));
    lampada.scale.y = 1.3;
    lampada.position.set(p.x, p.y - 0.04, p.z);
    g.add(lampada);
    const halo = haloDeLuz(0.28, cor);
    halo.position.copy(lampada.position);
    g.add(halo);
  });
  g.add(pocaDeLuz(0.75, 1.9));
  return g;
}

/** O cata-vento colorido: a hélice gira no vento que não tem. */
function cataVento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-cata-vento';
  const vareta = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.85, 6), toon(P.wood));
  vareta.position.y = 0.425;
  g.add(vareta);
  const helice = new THREE.Group();
  helice.position.set(0, 0.86, 0.03);
  g.add(helice);
  const cores = [P.lojaPacoteA, P.lojaPacoteC, P.lojaPacoteB, P.enfeiteFlorRosa];
  for (let i = 0; i < 4; i++) {
    // cada pá é um triângulo (cone achatado de 3 lados), com a ponta dobrada
    const pa = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 3), toon(cores[i], { doubleSide: true }));
    pa.scale.z = 0.12;
    pa.position.set(0, 0.1, 0);
    const braco = new THREE.Group();
    braco.rotation.z = (i / 4) * Math.PI * 2;
    braco.add(pa);
    pa.rotation.z = 0.5;
    helice.add(braco);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), toon(P.enfeiteFlorBranca));
  miolo.position.z = 0.02;
  helice.add(miolo);
  g.userData.helice = helice;
  return g;
}

/** Três cogumelos de chapéu vermelho de bolinha branca, de tamanhos diferentes. */
function cogumelosDeBolinha(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-cogumelos';
  const pe = toon(P.enfeiteGnomoBarba);
  const chapeu = toon(P.joaninhaVermelho);
  const bolinha = toon(P.joaninhaBolinha);
  for (const [x, z, e] of [[0, 0, 1], [0.15, 0.1, 0.65], [-0.14, 0.08, 0.5]] as const) {
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * e, 0.06 * e, 0.22 * e, 10), pe);
    haste.position.set(x, 0.11 * e, z);
    g.add(haste);
    const copa = new THREE.Mesh(new THREE.SphereGeometry(0.13 * e, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), chapeu);
    copa.scale.y = 0.75;
    copa.position.set(x, 0.2 * e, z);
    g.add(copa);
    for (let i = 0; i < 5; i++) {
      const a = i * 2.39996;
      const polar = 0.35 + (i % 2) * 0.45;
      const px = Math.sin(polar) * Math.cos(a) * 0.13 * e;
      const pz = Math.sin(polar) * Math.sin(a) * 0.13 * e;
      const py = Math.cos(polar) * 0.13 * e * 0.75;
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.02 * e, 6, 5), bolinha);
      b.scale.y = 0.45;
      b.position.set(x + px * 1.02, 0.2 * e + py + 0.003, z + pz * 1.02);
      g.add(b);
    }
  }
  return g;
}

/** O copão de suco do Noel: laranja, com o canudo listrado e a rodela na borda. */
function copaoDeSucoDoNoel(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-copao-de-suco';
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.05, 14), toon(P.aventalDoNoel));
  base.position.y = 0.025;
  g.add(base);
  const copo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.5, 16), toon(P.laranjaPolpa));
  copo.position.y = 0.3;
  g.add(copo);
  for (const y of [0.2, 0.38]) {
    const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.12 + (y - 0.05) * 0.08 + 0.004, 0.12 + (y - 0.05) * 0.08 + 0.004, 0.04, 16, 1, true), toon(P.estampaBranca));
    faixa.position.y = y;
    g.add(faixa);
  }
  const suco = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16), toon(P.laranjaCasca));
  suco.position.y = 0.54;
  g.add(suco);
  // o canudo, listrado de vermelho e branco, torto como todo canudo
  const canudo = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const gomo = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 6), toon(i % 2 ? P.estampaBranca : P.camisetaSalvaVidas));
    gomo.position.y = i * 0.06;
    canudo.add(gomo);
  }
  canudo.position.set(0.05, 0.5, -0.02);
  canudo.rotation.z = -0.35;
  g.add(canudo);
  // a rodela de laranja encaixada na borda
  const rodela = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 14), toon(P.laranjaCasca));
  rodela.rotation.x = Math.PI / 2;
  rodela.position.set(-0.12, 0.55, 0.08);
  rodela.rotation.y = 0.8;
  g.add(rodela);
  return g;
}

/** O regador elefantinho do Cookie: a tromba é o bico, e o quepe é o da bilheteria. */
function regadorElefantinho(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-elefantinho';
  const pele = toon(P.elefantePele);
  for (const [x, z] of [[-0.09, 0.08], [0.09, 0.08], [-0.09, -0.1], [0.09, -0.1]] as const) {
    const pata = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.1, 10), pele);
    pata.position.set(x, 0.05, z);
    g.add(pata);
  }
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), pele);
  corpo.scale.set(1, 0.85, 1.1);
  corpo.position.y = 0.22;
  g.add(corpo);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), pele);
  cabeca.position.set(0, 0.32, 0.15);
  g.add(cabeca);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), toon(P.elefanteOrelha));
    orelha.scale.set(0.35, 1, 0.9);
    orelha.position.set(lado * 0.13, 0.33, 0.1);
    orelha.rotation.y = lado * 0.4;
    g.add(orelha);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), toon(P.joaninhaPreto));
    olho.position.set(lado * 0.05, 0.36, 0.26);
    g.add(olho);
  }
  // a tromba é o bico do regador: sobe para a frente e termina no crivo
  const tromba = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.28, 0.25),
    new THREE.Vector3(0, 0.22, 0.34),
    new THREE.Vector3(0, 0.28, 0.43),
    new THREE.Vector3(0, 0.4, 0.47),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(tromba, 14, 0.028, 8, false), pele));
  const crivo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.04, 12), toon(P.metalGrey));
  crivo.position.set(0, 0.42, 0.475);
  crivo.rotation.x = -0.6;
  g.add(crivo);
  // a alça do regador, nas costas
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 6, 14, Math.PI), pele);
  alca.rotation.y = Math.PI / 2;
  alca.position.set(0, 0.34, -0.06);
  g.add(alca);
  // o quepe da bilheteria, pequenininho
  const quepe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.04, 12), toon(P.quepeCookie));
  quepe.position.set(0, 0.45, 0.13);
  g.add(quepe);
  const aba = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 0.05), toon(P.quepeCookie));
  aba.position.set(0, 0.435, 0.2);
  g.add(aba);
  return g;
}

/**
 * O Pelusa de pelúcia: o gatinho deitado dormindo, com o rabo em volta. A
 * cabeça é GRANDE de propósito (pelúcia é assim, e de longe uma cabeça
 * pequena num corpo cinza lia como pedra), com as orelhas de miolo rosa.
 */
function pelusaDePelucia(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-pelusa';
  const cinza = toon(P.pelusaCinza);
  const branco = toon(P.pelusaBranco);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), cinza);
  corpo.scale.set(0.95, 0.62, 1.25);
  corpo.position.set(0, 0.11, -0.04);
  g.add(corpo);
  for (const lado of [-1, 1]) {
    const pata = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), branco);
    pata.scale.set(0.9, 0.6, 1.4);
    pata.position.set(lado * 0.06, 0.035, 0.18);
    g.add(pata);
  }
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), cinza);
  cabeca.scale.set(1.1, 0.95, 1);
  cabeca.position.set(0, 0.2, 0.15);
  g.add(cabeca);
  const focinho = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), branco);
  focinho.scale.set(1.2, 0.8, 0.8);
  focinho.position.set(0, 0.165, 0.245);
  g.add(focinho);
  const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), toon(P.pelusaFocinho));
  nariz.position.set(0, 0.19, 0.3);
  g.add(nariz);
  for (const lado of [-1, 1]) {
    const orelha = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.1, 4), cinza);
    orelha.position.set(lado * 0.075, 0.32, 0.13);
    orelha.rotation.set(0, Math.PI / 4, -lado * 0.3);
    g.add(orelha);
    const miolo = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.065, 4), toon(P.pelusaOrelha));
    miolo.position.set(lado * 0.072, 0.315, 0.15);
    miolo.rotation.set(0, Math.PI / 4, -lado * 0.3);
    g.add(miolo);
    // olhos fechados, em arquinho: dormindo
    const olho = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 4, 8, Math.PI), toon(P.joaninhaPreto));
    olho.rotation.z = Math.PI;
    olho.position.set(lado * 0.048, 0.225, 0.27);
    g.add(olho);
    const bochecha = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), toon(P.pelusaFocinho));
    bochecha.scale.z = 0.4;
    bochecha.position.set(lado * 0.085, 0.18, 0.255);
    g.add(bochecha);
  }
  // o rabo em volta do corpo, com a ponta branca
  const rabo = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.032, 8, 18, Math.PI * 1.05), cinza);
  rabo.rotation.x = Math.PI / 2;
  rabo.rotation.z = Math.PI * 0.95;
  rabo.position.set(0, 0.045, -0.02);
  g.add(rabo);
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), branco);
  ponta.position.set(0.16, 0.045, 0.1);
  g.add(ponta);
  g.scale.setScalar(1.25);
  return g;
}

// ------------------------------------------------------------ o catálogo

/**
 * O CATÁLOGO. A loja mostra do mais barato ao mais caro (o `sort` do fim), então
 * a ordem aqui é só de leitura: os de jardim, os simples, e os de personagem.
 * Enfeite novo: uma função acima, uma entrada aqui, e as cores no bloco da
 * paleta.
 */
export const DECORACOES: readonly FichaDeDecoracao[] = ([
  {
    id: 'vaso-de-flores', nome: 'Vaso de flores', icone: '💐', girassois: 5, onda: 0, artigo: 'o', raio: 0.32,
    descricao: 'Um vaso de barro com flores rosa, brancas e lilás.',
    monta: vasoDeFlores,
  },
  {
    id: 'flamingo', nome: 'Flamingo de jardim', icone: '🦩', girassois: 6, onda: 0, artigo: 'o', raio: 0.26,
    descricao: 'Rosa, de plástico, numa perna de arame. Clássico.',
    monta: flamingoDeJardim,
  },
  {
    id: 'lanterninha', nome: 'Lanterninha', icone: '🏮', girassois: 8, onda: 4, artigo: 'a', raio: 0.2,
    descricao: 'Um poste baixinho com a luz sempre acesa. Clareia o chão em volta.',
    monta: lanternaDeJardim,
  },
  {
    id: 'anao-de-jardim', nome: 'Anão de jardim', icone: '🧙', girassois: 7, onda: 2, artigo: 'o', raio: 0.24,
    descricao: 'Gorro vermelho, barba branca e cara de quem cuida da horta.',
    monta: anaoDeJardim,
  },
  {
    id: 'banquinho', nome: 'Banquinho de jardim', icone: '🪑', girassois: 9, onda: 4, artigo: 'o', raio: 0.55,
    descricao: 'Um banquinho de madeira, do tamanho certo para dois.',
    monta: banquinhoDeJardim,
  },
  {
    id: 'bebedouro', nome: 'Bebedouro de passarinho', icone: '🐦', girassois: 12, onda: 13, artigo: 'o', raio: 0.34,
    descricao: 'Uma taça de pedra com água, e um passarinho que já achou.',
    monta: bebedouroDePassarinho,
  },
  // --- os de jardim, simples
  {
    id: 'cata-vento', nome: 'Cata-vento', icone: '🎐', girassois: 4, onda: 0, artigo: 'o', raio: 0.14,
    descricao: 'Quatro pás coloridas que giram sem parar.',
    monta: cataVento,
    anima: (peca, t) => {
      const h = peca.userData.helice as THREE.Object3D | undefined;
      if (h) h.rotation.z = -t * 2.2;
    },
  },
  {
    id: 'cogumelos', nome: 'Cogumelos de bolinha', icone: '🍄', girassois: 4, onda: 0, artigo: 'o', raio: 0.24,
    descricao: 'Três cogumelos de chapéu vermelho e bolinha branca.',
    monta: cogumelosDeBolinha,
  },
  {
    id: 'varal-de-luzinhas', nome: 'Varal de luzinhas', icone: '✨', girassois: 13, onda: 16, artigo: 'o', raio: 0.8,
    descricao: 'O corredor de luzinhas do pedido, em miniatura. Acende o chão em volta.',
    monta: varalDeLuzinhas,
  },
  // --- os de personagem e de lugar: o clube, o parque e quem mora lá
  {
    id: 'tartaruguinha', nome: 'Tartaruguinha da Josefina', icone: '🐢', girassois: 6, onda: 2, artigo: 'a', raio: 0.3,
    descricao: 'De cerâmica, com o casco de escudos e o laço rosa dela.',
    monta: tartaruguinhaDaJosefina,
  },
  {
    id: 'pelusa-de-pelucia', nome: 'Pelusa de pelúcia', icone: '🐱', girassois: 7, onda: 6, artigo: 'o', raio: 0.3,
    descricao: 'O gatinho enroladinho, dormindo com o rabo em volta.',
    monta: pelusaDePelucia,
  },
  {
    id: 'copao-de-suco', nome: 'Copão de suco do Noel', icone: '🧃', girassois: 8, onda: 6, artigo: 'o', raio: 0.2,
    descricao: 'Laranja, com canudo listrado — o do bar de sucos do clube.',
    monta: copaoDeSucoDoNoel,
  },
  {
    id: 'casquinha', nome: 'Casquinha gigante do Mano', icone: '🍦', girassois: 8, onda: 8, artigo: 'a', raio: 0.22,
    descricao: 'Bola de morango escorrendo e a cereja, do quiosque do Villa Lobos.',
    monta: casquinhaGigante,
  },
  {
    id: 'walter-de-ceramica', nome: 'Walter de cerâmica', icone: '🐕', girassois: 9, onda: 8, artigo: 'o', raio: 0.24,
    descricao: 'Sentadinho, de gravatinha, esperando o próximo pedido.',
    monta: walterDeCeramica,
  },
  {
    id: 'elefantinho', nome: 'Regador elefantinho do Cookie', icone: '🐘', girassois: 10, onda: 10, artigo: 'o', raio: 0.4,
    descricao: 'A tromba é o bico, e o quepe é o da bilheteria.',
    monta: regadorElefantinho,
  },
  {
    id: 'capivara', nome: 'Capivara de jardim', icone: '🦫', girassois: 10, onda: 10, artigo: 'a', raio: 0.3,
    descricao: 'O Capy de óculos escuros e apito, de plantão no jardim.',
    monta: capivaraDeJardim,
  },
  {
    id: 'girafinha', nome: 'Girafinha da Gina', icone: '🦒', girassois: 11, onda: 13, artigo: 'a', raio: 0.28,
    descricao: 'De pescoção e chifrinhos, vigiando a estufa como a Gina vigia a portaria.',
    monta: girafinhaDaGina,
  },
  {
    id: 'laguinho', nome: 'Laguinho do Jean-Luc', icone: '🦆', girassois: 14, onda: 20, artigo: 'o', raio: 0.62,
    descricao: 'Água rasa, pedrinhas e o pato de boina que mora no lago do parque.',
    monta: laguinhoDoJeanLuc,
  },
  {
    id: 'roda-gigante', nome: 'Rodinha gigante', icone: '🎡', girassois: 18, onda: 25, artigo: 'a', raio: 0.36,
    descricao: 'A roda do Villa Lobos em miniatura. Ela gira de verdade.',
    monta: rodaGiganteMini,
    anima: girarRoda,
  },
] as FichaDeDecoracao[]).sort((a, b) => a.onda - b.onda || a.girassois - b.girassois);

export function decoracaoPorId(id: string): FichaDeDecoracao | undefined {
  return DECORACOES.find((d) => d.id === id);
}

/** o retrato do enfeite para o cartão da loja (o próprio modelo, fotografado e guardado) */
export function retratoDaDecoracao(id: string): string {
  const ficha = decoracaoPorId(id);
  return ficha ? retratoDe(`decoracao:${id}`, ficha.monta, -0.5) : '';
}
