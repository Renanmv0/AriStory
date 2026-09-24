import * as THREE from 'three';
import { toon } from '../core/materials';
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
  /** em reais, na carteira do casal (a régua: bilhete da roda 24, peça de boutique 35–220) */
  readonly preco: number;
  /** uma frase para o cartão da loja */
  readonly descricao: string;
  /** a pegada no chão, em metros (ver o topo do arquivo) */
  readonly raio: number;
  /** o artigo do nome, para as falas ("o anão", "a lanterninha") */
  readonly artigo: 'o' | 'a';
  readonly monta: () => THREE.Group;
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

// ------------------------------------------------------------ o catálogo

/**
 * O CATÁLOGO, na ordem em que a loja mostra (mais barato primeiro). Enfeite
 * novo: uma função acima, uma entrada aqui, e as cores no bloco da paleta.
 */
export const DECORACOES: readonly FichaDeDecoracao[] = [
  {
    id: 'vaso-de-flores', nome: 'Vaso de flores', icone: '💐', preco: 25, artigo: 'o', raio: 0.32,
    descricao: 'Um vaso de barro com flores rosa, brancas e lilás.',
    monta: vasoDeFlores,
  },
  {
    id: 'flamingo', nome: 'Flamingo de jardim', icone: '🦩', preco: 35, artigo: 'o', raio: 0.26,
    descricao: 'Rosa, de plástico, numa perna de arame. Clássico.',
    monta: flamingoDeJardim,
  },
  {
    id: 'lanterninha', nome: 'Lanterninha', icone: '🏮', preco: 40, artigo: 'a', raio: 0.2,
    descricao: 'Um poste baixinho com a luz quente sempre acesa.',
    monta: lanternaDeJardim,
  },
  {
    id: 'anao-de-jardim', nome: 'Anão de jardim', icone: '🧙', preco: 45, artigo: 'o', raio: 0.24,
    descricao: 'Gorro vermelho, barba branca e cara de quem cuida da horta.',
    monta: anaoDeJardim,
  },
  {
    id: 'banquinho', nome: 'Banquinho de jardim', icone: '🪑', preco: 60, artigo: 'o', raio: 0.55,
    descricao: 'Um banquinho de madeira, do tamanho certo para dois.',
    monta: banquinhoDeJardim,
  },
  {
    id: 'bebedouro', nome: 'Bebedouro de passarinho', icone: '🐦', preco: 70, artigo: 'o', raio: 0.34,
    descricao: 'Uma taça de pedra com água, e um passarinho que já achou.',
    monta: bebedouroDePassarinho,
  },
];

export function decoracaoPorId(id: string): FichaDeDecoracao | undefined {
  return DECORACOES.find((d) => d.id === id);
}

/** o retrato do enfeite para o cartão da loja (o próprio modelo, fotografado e guardado) */
export function retratoDaDecoracao(id: string): string {
  const ficha = decoracaoPorId(id);
  return ficha ? retratoDe(`decoracao:${id}`, ficha.monta, -0.5) : '';
}
