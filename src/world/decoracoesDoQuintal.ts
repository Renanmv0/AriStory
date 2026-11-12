import * as THREE from 'three';
import { toon } from '../core/materials';
import { Vento } from '../core/shaders';
import { PALETTE as P } from '../palette';
import type { FichaDeDecoracao } from './decoracoes';
import {
  agaves, buxinhoNoVaso, capins, cascaDePinus, costelasDeAdao, hortensias, lavandas, margaridas,
} from './plantasDeJardim';
import { plantaDeEspada } from './furniture';
import { bancoDePraca } from './bancoDePraca';
import { quina } from './lojaDeRoupas';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { tramaDeTecido, veioDeMadeira } from './texturasDeCasa';
import { sorteio } from './texturasDeChao';
import { tree } from './props';
import { amostraDeCaminho, type EstiloDeCaminho } from './caminhosDoQuintal';
import {
  amostraEntre, arandela, balancarSino, bandeirinhasEntre, casinhaDePassarinho, cordaoDeLanternasEntre, espelhoDeJardim,
  gatinhoDeCeramica, lanternaDePapel, lanterninhaSolar, sinoDeVento, trelicaComTrepadeira, trioDeVasinhos, varalDeLuzinhasEntre,
  vasinhoDeSuculentas, vasoDeMacrame, vasoDeParede,
} from './decoracoesDeParede';
import { balancar, balancoDeJardim, casinhaDoPelusa, deitarAoSol, deitarNaRede, redeComSuporte, sentarAMesinha, sentarNoBanco } from './moveisDeUsar';
import { canteiroDeCasca, canteiroDeTerra, deckDeMadeira, gramadoDeFlores, manchaDePedrisco, tapeteDeFora } from './pisosDoQuintal';

/**
 * O CATÁLOGO DO PAPITA DELIVERY — o que se compra pelo computador do quarto do
 * Ari para decorar o quintal (`docs/QUINTAL.md`). Em REAIS, da carteira do
 * casal ("usa o dinheiro nosso mesmo", o Renan), e só para o quintal: a ficha
 * diz `cenas: ['quintal']`.
 *
 * O contrato de cada peça é o dos enfeites da estufa (`world/decoracoes.ts` e
 * a skill `aristory-enfeite`): base em `y = 0`, frente para `+Z`, centrada,
 * um grupo novo a cada chamada, `raio` é a pegada no chão. O decorador é o
 * mesmo; a cena do quintal diz onde pode (`RegrasDoQuintal`).
 *
 * DUAS PRATELEIRAS no app (`categoria`): as PLANTAS saem do kit do jardim
 * (`world/plantasDeJardim.ts` — o lote de uma espécie com um pé só, e a
 * espada-de-são-jorge do quarto do Ari), cada uma num canteirinho de casca de
 * beira torta para ler como "plantada", e não largada na grama; e os MÓVEIS
 * (o banco de praça do kit e três peças novas: a mesinha bistrô, a
 * espreguiçadeira de ripas e o guarda-sol). "Vamos adicionando mais com o
 * tempo": peça nova é uma função e uma entrada em `DECORACOES_DO_QUINTAL`.
 */

export type CategoriaDoQuintal = 'plantas' | 'moveis' | 'chao' | 'alto';

export interface FichaDoQuintal extends FichaDeDecoracao {
  readonly reais: number;
  readonly categoria: CategoriaDoQuintal;
  /**
   * UM JEITO DE CAMINHO (`world/caminhosDoQuintal.ts`): não se põe pelo
   * decorador — comprado, ele fica "de vocês", e as ferramentas da garagem
   * trocam o caminho da casa por ele. Compra-se uma vez só.
   */
  readonly caminho?: EstiloDeCaminho;
  /** `false`: não está à venda (a árvore da casa, que já veio com ela) */
  readonly naLoja?: false;
  /** dá para regar (as plantas, e as peças com planta: o vaso de parede, o macramê, as suculentas…) */
  readonly regavel?: boolean;
}

/**
 * O VENTO DAS PLANTAS DO QUINTAL: a lavanda, o capim e as margaridas balançam
 * nele. Um só para todas (o material de vento é guardado por cor), e quem o
 * faz andar é a cena do quintal (`VENTO_DO_QUINTAL.tique(dt)`).
 */
export const VENTO_DO_QUINTAL = new Vento({ forca: 0.1, altura: 0.6 });

// ================================================================ as plantas

/**
 * O CANTEIRINHO de casca de pínus embaixo de cada planta: um decalque de beira
 * torta (canteiro de jardim não tem beira de régua), no chão.
 */
function canteirinho(raio: number, semente: number): THREE.Mesh {
  const rnd = sorteio(4100 + semente * 37);
  const forma = new THREE.Shape();
  const N = 28;
  const fases = [rnd() * 6.28, rnd() * 6.28];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = raio * (1 + Math.sin(a * 3 + fases[0]) * 0.06 + Math.sin(a * 5 + fases[1]) * 0.04);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  const m = new THREE.Mesh(new THREE.ShapeGeometry(forma, 2), toon(P.cascaDePinus, { mapa: cascaDePinus(), decal: true }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.012;
  m.renderOrder = 3;
  m.receiveShadow = true;
  m.userData.semSombra = true;
  return m;
}

/** uma planta do kit, no canteirinho */
function plantado(peca: string, planta: THREE.Object3D, raio: number, semente: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = `quintal-${peca}`;
  g.add(canteirinho(raio, semente), planta);
  return g;
}

const hortensia = (cor: number, semente: number) => (): THREE.Group =>
  plantado('hortensia', hortensias([{ x: 0, z: 0, cor, semente, escala: 1 }]), 0.5, semente);

function moitaDeLavanda(): THREE.Group {
  return plantado('lavanda', lavandas([
    { x: -0.17, z: 0.05, semente: 1, escala: 0.9 },
    { x: 0.16, z: 0.1, semente: 2, escala: 0.85 },
    { x: 0, z: -0.15, semente: 3, escala: 1 },
  ], VENTO_DO_QUINTAL), 0.45, 2);
}

function capimDePluma(): THREE.Group {
  return plantado('capim', capins([{ x: 0, z: 0, semente: 4, escala: 1 }], VENTO_DO_QUINTAL), 0.45, 3);
}

function agave(): THREE.Group {
  return plantado('agave', agaves([{ x: 0, z: 0, semente: 5, escala: 0.9 }]), 0.42, 4);
}

function costelaDeAdao(): THREE.Group {
  return plantado('costela-de-adao', costelasDeAdao([{ x: 0, z: 0, semente: 6, escala: 0.75 }]), 0.5, 5);
}

function moitaDeMargaridas(): THREE.Group {
  return plantado('margaridas', margaridas([
    { x: 0, z: 0, quantas: 11, raio: 0.3, semente: 7 },
  ], VENTO_DO_QUINTAL), 0.4, 6);
}

function buxinho(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-buxinho';
  g.add(buxinhoNoVaso(0.3, 3));
  return g;
}

function espadaDeSaoJorge(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-espada-de-sao-jorge';
  g.add(plantaDeEspada(0.9));
  return g;
}

// ================================================================== os móveis

function bancoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-banco';
  g.add(bancoDePraca());
  return g;
}

/** um tubo de ferro por pontos (a perna em S da mesa, o arco da cadeira) */
function ferro(pontos: THREE.Vector3[], raio: number, gomos = 18): THREE.BufferGeometry {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos, false, 'centripetal'), gomos, raio, 6, false);
}

/** a cadeirinha bistrô, de frente para `+Z` */
function cadeiraBistro(): THREE.Group {
  const g = new THREE.Group();
  const verde = toon(P.quintalFerro);
  const V = THREE.Vector3;
  // o assento: um disco de ferro com a borda enrolada
  const assento = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 24), verde);
  assento.position.y = 0.45;
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 6, 28), verde);
  borda.rotation.x = Math.PI / 2;
  borda.position.y = 0.45;
  g.add(assento, borda);
  // a almofadinha redonda, fofa, um fio acima do ferro
  const almofada = new THREE.Mesh(new THREE.SphereGeometry(0.175, 20, 8), toon(P.quintalAlmofadaBistro, { mapa: tramaDeTecido() }));
  almofada.scale.set(1, 0.16, 1);
  almofada.position.y = 0.475;
  g.add(almofada);
  // as quatro pernas, abrindo um pouco para fora, e o aro de travamento
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]] as const) {
    const perna = new THREE.Mesh(ferro([new V(x * 0.13, 0.44, z * 0.13), new V(x * 0.155, 0.22, z * 0.155), new V(x * 0.18, 0, z * 0.18)], 0.011, 8), verde);
    g.add(perna);
  }
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.163, 0.008, 5, 24), verde);
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.17;
  g.add(aro);
  // o encosto: o arco de ferro e, dentro dele, o coração de volutas
  const arco: THREE.Vector3[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (i / 12);
    arco.push(new V(Math.cos(a) * 0.17, 0.46 + 0.14 + Math.sin(a) * 0.24, -0.19 - Math.sin(a) * 0.02));
  }
  arco.unshift(new V(0.17, 0.455, -0.17));
  arco.push(new V(-0.17, 0.455, -0.17));
  g.add(new THREE.Mesh(ferro(arco, 0.012, 30), verde));
  for (const lado of [-1, 1]) {
    const voluta: THREE.Vector3[] = [];
    for (let i = 0; i <= 14; i++) {
      const k = i / 14;
      const a = k * Math.PI * 1.6;
      const r = 0.06 * (1 - k * 0.6);
      voluta.push(new V(lado * (0.055 + Math.sin(a) * r), 0.62 + Math.cos(a) * r, -0.205));
    }
    voluta.unshift(new V(0, 0.48, -0.2));
    g.add(new THREE.Mesh(ferro(voluta, 0.008, 24), verde));
  }
  return g;
}

/** A MESINHA BISTRÔ de ferro com as duas cadeirinhas, uma de frente para a outra. */
function mesinhaBistro(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-mesinha';
  const verde = toon(P.quintalFerro);
  const V = THREE.Vector3;
  // o tampo de ferro com a borda torneada (um perfil de torno: aba, bojo e lábio)
  const perfil = [
    new THREE.Vector2(0, 0.735), new THREE.Vector2(0.34, 0.735), new THREE.Vector2(0.36, 0.742),
    new THREE.Vector2(0.37, 0.756), new THREE.Vector2(0.36, 0.77), new THREE.Vector2(0.0, 0.77),
  ];
  g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 36), verde));
  // a coluna torneada, com dois anéis
  const coluna = [
    new THREE.Vector2(0.001, 0.08), new THREE.Vector2(0.05, 0.08), new THREE.Vector2(0.03, 0.14),
    new THREE.Vector2(0.022, 0.3), new THREE.Vector2(0.038, 0.33), new THREE.Vector2(0.022, 0.36),
    new THREE.Vector2(0.02, 0.62), new THREE.Vector2(0.036, 0.66), new THREE.Vector2(0.06, 0.735), new THREE.Vector2(0.001, 0.735),
  ];
  g.add(new THREE.Mesh(new THREE.LatheGeometry(coluna, 18), verde));
  // os três pés em S, saindo da base da coluna
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const pe = (r: number, y: number): THREE.Vector3 => new V(c * r, y, s * r);
    g.add(new THREE.Mesh(ferro([pe(0.02, 0.16), pe(0.1, 0.13), pe(0.18, 0.05), pe(0.26, 0.012), pe(0.3, 0.03)], 0.014, 16), verde));
  }
  // as cadeiras, uma de cada lado, olhando para a mesa
  for (const lado of [-1, 1]) {
    const c = cadeiraBistro();
    c.position.x = lado * 0.6;
    c.rotation.y = -lado * Math.PI / 2;
    g.add(c);
  }
  return g;
}

/**
 * A ESPREGUIÇADEIRA DE RIPAS, de madeira com veio: as duas longarinas, as
 * ripas do assento, o encosto inclinado com as ripas dele, as rodinhas na
 * cabeceira (para puxar para o sol) e o colchonete de lona com uma listra.
 * A cabeceira olha para `−Z`; quem deita olha para `+Z`.
 */
function espreguicadeira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-espreguicadeira';
  const madeira = toon(P.quintalMadeira, { mapa: veioDeMadeira() });
  const ripa = (l: number, a: number, p: number, x: number, y: number, z: number, rx = 0): THREE.Mesh => {
    const m = new THREE.Mesh(uvEmMetrosPorTriangulo(quina(l, a, p, 0.008)), madeira);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    return m;
  };
  const C = 1.8;
  const L = 0.62;
  // as longarinas e os quatro pés
  for (const lado of [-1, 1]) {
    g.add(ripa(0.04, 0.09, C, lado * (L / 2 - 0.02), 0.27, 0));
    g.add(ripa(0.045, 0.24, 0.05, lado * (L / 2 - 0.02), 0.12, C / 2 - 0.1));
  }
  // as rodinhas da cabeceira, por fora da longarina
  for (const lado of [-1, 1]) {
    const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.035, 16), toon(P.woodDark));
    roda.rotation.z = Math.PI / 2;
    roda.position.set(lado * (L / 2 + 0.02), 0.075, -C / 2 + 0.12);
    const eixo = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.05, 8), toon(P.metalGrey));
    eixo.rotation.z = Math.PI / 2;
    eixo.position.copy(roda.position);
    eixo.position.x += lado * 0.02;
    g.add(roda, eixo);
  }
  // as ripas do assento (da metade para os pés), com um vão entre elas
  const N = 11;
  for (let i = 0; i < N; i++) g.add(ripa(L - 0.1, 0.022, 0.07, 0, 0.325, -0.1 + i * 0.088));
  // o encosto, inclinado: um quadro com as ripas por cima
  const encosto = new THREE.Group();
  encosto.position.set(0, 0.33, -0.12);
  encosto.rotation.x = -0.62;
  for (let i = 0; i < 9; i++) encosto.add(ripa(L - 0.1, 0.022, 0.07, 0, 0.012, -0.05 - i * 0.088));
  for (const lado of [-1, 1]) encosto.add(ripa(0.035, 0.03, 0.82, lado * (L / 2 - 0.08), -0.02, -0.4));
  g.add(encosto);
  // a escora do encosto, apoiada na longarina
  g.add(ripa(L - 0.16, 0.03, 0.035, 0, 0.42, -0.62, 0.9));
  // o colchonete: o assento e o encosto, cru com uma listra azul no meio
  const lona = toon(P.quintalAlmofada, { mapa: tramaDeTecido() });
  const listra = toon(P.quintalAlmofadaListra, { mapa: tramaDeTecido() });
  const assento = new THREE.Mesh(quina(L - 0.14, 0.06, 0.96, 0.025), lona);
  assento.position.set(0, 0.367, 0.34);
  const faixa = new THREE.Mesh(quina(0.1, 0.064, 0.962, 0.025), listra);
  faixa.position.copy(assento.position);
  g.add(assento, faixa);
  const costas = new THREE.Mesh(quina(L - 0.14, 0.06, 0.78, 0.025), lona);
  costas.position.set(0, 0.06, -0.42);
  const faixa2 = new THREE.Mesh(quina(0.1, 0.064, 0.782, 0.025), listra);
  faixa2.position.copy(costas.position);
  encosto.add(costas, faixa2);
  // o travesseirinho no alto do encosto
  const travesseiro = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, L - 0.3, 4, 12), lona);
  travesseiro.rotation.z = Math.PI / 2;
  travesseiro.position.set(0, 0.13, -0.74);
  encosto.add(travesseiro);
  return g;
}

/**
 * O GUARDA-SOL de gomos alternados (cru e terracota), com o babado recortado
 * em volta, as varetas por baixo, o mastro de madeira e a base de cimento.
 * Alto (2,3 m): a regra do quintal o deixa longe dos muros do lado da câmera.
 */
function guardaSol(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-guarda-sol';
  const GOMOS = 8;
  const R = 1.05;
  const ALTO = 2.05;
  // a lona: um torno de perfil curvo (cai mais perto da borda), em gomos
  // achatados de cor alternada — a cor vai por vértice, numa malha só
  const perfil: THREE.Vector2[] = [];
  for (let i = 0; i <= 6; i++) {
    const k = i / 6;
    perfil.push(new THREE.Vector2(R * k, ALTO + 0.32 * (1 - k * k)));
  }
  perfil.reverse();
  const lona = new THREE.LatheGeometry(perfil, GOMOS * 2).toNonIndexed();
  const pos = lona.getAttribute('position');
  const cores = new Float32Array(pos.count * 3);
  const claro = new THREE.Color(P.quintalLona);
  const listra = new THREE.Color(P.quintalLonaListra);
  for (let t = 0; t < pos.count; t += 3) {
    let ax = 0;
    let az = 0;
    for (let k = 0; k < 3; k++) {
      ax += pos.getX(t + k);
      az += pos.getZ(t + k);
    }
    const gomo = Math.floor(((Math.atan2(az, ax) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * GOMOS);
    const c = gomo % 2 ? listra : claro;
    for (let k = 0; k < 3; k++) c.toArray(cores, (t + k) * 3);
  }
  lona.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  lona.computeVertexNormals();
  g.add(new THREE.Mesh(lona, toon(0xffffff, { corPorVertice: true, doubleSide: true })));
  // o babado: uma meia-lua por gomo, pendurada na borda, da cor do gomo
  for (let i = 0; i < GOMOS * 2; i++) {
    const a = ((i + 0.5) / (GOMOS * 2)) * Math.PI * 2;
    const meia = new THREE.Mesh(new THREE.CircleGeometry(0.13, 10, Math.PI, Math.PI), toon(Math.floor(i / 2) % 2 ? P.quintalLonaListra : P.quintalLona, { doubleSide: true }));
    meia.position.set(Math.cos(a) * (R - 0.005), ALTO + 0.005, Math.sin(a) * (R - 0.005));
    meia.rotation.y = -a + Math.PI / 2;
    g.add(meia);
  }
  // as varetas por baixo da lona, do mastro até a borda
  const metal = toon(P.metalGrey);
  for (let i = 0; i < GOMOS; i++) {
    const a = (i / GOMOS) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const vareta = new THREE.Mesh(ferro([
      new THREE.Vector3(c * 0.03, ALTO + 0.3, s * 0.03), new THREE.Vector3(c * R * 0.5, ALTO + 0.2, s * R * 0.5),
      new THREE.Vector3(c * (R - 0.04), ALTO - 0.02, s * (R - 0.04)),
    ], 0.008, 8), metal);
    g.add(vareta);
  }
  // o mastro de madeira com veio, a ponteira e a base de cimento torneada
  const mastro = new THREE.Mesh(uvEmMetrosPorTriangulo(new THREE.CylinderGeometry(0.03, 0.035, ALTO + 0.42, 10)), toon(P.quintalMadeira, { mapa: veioDeMadeira() }));
  mastro.position.y = (ALTO + 0.42) / 2;
  g.add(mastro);
  const ponteira = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), toon(P.quintalLonaListra));
  ponteira.position.y = ALTO + 0.44;
  g.add(ponteira);
  const base = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.001, 0), new THREE.Vector2(0.3, 0), new THREE.Vector2(0.3, 0.05),
    new THREE.Vector2(0.24, 0.09), new THREE.Vector2(0.09, 0.12), new THREE.Vector2(0.07, 0.2), new THREE.Vector2(0.001, 0.2),
  ], 24), toon(P.quintalBaseDoGuardaSol));
  g.add(base);
  return g;
}

/**
 * A ÁRVORE FLORIDA DA CASA: já veio com o quintal (a cena a planta no lugar de
 * sempre na primeira visita), e agora é peça como as outras — "se quisermos
 * podemos tirar a árvore" (o Renan): guarda-se e põe-se de volta pelas
 * ferramentas, onde quiser. A pegada é o tronco (a copa cobre o vizinho).
 */
function arvoreFlorida(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'quintal-arvore-florida';
  g.add(tree('florida', 0.9, 0.37));
  return g;
}

// ================================================================ o catálogo

/** as peças com planta, que também se regam */
const COM_PLANTA = new Set([
  'quintal-vaso-de-parede', 'quintal-macrame', 'quintal-suculentas', 'quintal-trio-de-vasinhos', 'quintal-trelica',
  'quintal-gramado-de-flores', 'quintal-canteiro-terra', 'quintal-canteiro-casca',
]);

export const DECORACOES_DO_QUINTAL: readonly FichaDoQuintal[] = ([
  // --- as plantas
  {
    id: 'quintal-hortensia-azul', nome: 'Hortênsia azul', icone: '💙', categoria: 'plantas', reais: 28, artigo: 'a', raio: 0.48,
    descricao: 'Um pé cheio de bolas de flor azul, no canteirinho de casca.',
    monta: hortensia(P.hortensiaAzul, 11),
  },
  {
    id: 'quintal-hortensia-rosa', nome: 'Hortênsia rosa', icone: '🌸', categoria: 'plantas', reais: 28, artigo: 'a', raio: 0.48,
    descricao: 'A mesma hortênsia, cor-de-rosa.',
    monta: hortensia(P.hortensiaRosa, 12),
  },
  {
    id: 'quintal-hortensia-lilas', nome: 'Hortênsia lilás', icone: '💜', categoria: 'plantas', reais: 28, artigo: 'a', raio: 0.48,
    descricao: 'E a lilás, para fazer degradê com as outras duas.',
    monta: hortensia(P.hortensiaLilas, 13),
  },
  {
    id: 'quintal-lavanda', nome: 'Moita de lavanda', icone: '🪻', categoria: 'plantas', reais: 22, artigo: 'a', raio: 0.42,
    descricao: 'Três pés de lavanda que balançam no vento.',
    monta: moitaDeLavanda,
  },
  {
    id: 'quintal-margaridas', nome: 'Margaridas', icone: '🌼', categoria: 'plantas', reais: 18, artigo: 'a', raio: 0.38,
    descricao: 'Uma moitinha de margaridas de miolo amarelo.',
    monta: moitaDeMargaridas,
  },
  {
    id: 'quintal-capim', nome: 'Capim de pluma', icone: '🌾', categoria: 'plantas', reais: 20, artigo: 'o', raio: 0.56,
    descricao: 'O capim ornamental de pluma clara, sempre mexendo.',
    monta: capimDePluma,
  },
  {
    id: 'quintal-agave', nome: 'Agave', icone: '🌵', categoria: 'plantas', reais: 24, artigo: 'o', raio: 0.38,
    descricao: 'A roseta de folhas grossas, azuladas, de borda clara.',
    monta: agave,
  },
  {
    id: 'quintal-costela-de-adao', nome: 'Costela-de-adão', icone: '🌿', categoria: 'plantas', reais: 32, artigo: 'a', raio: 0.75,
    descricao: 'As folhas grandes e recortadas, de planta de casa que cresceu.',
    monta: costelaDeAdao,
  },
  {
    id: 'quintal-buxinho', nome: 'Buxinho no vaso', icone: '🪴', categoria: 'plantas', reais: 30, artigo: 'o', raio: 0.32,
    descricao: 'Igual aos dois da porta, no vaso de cimento.',
    monta: buxinho,
  },
  {
    id: 'quintal-espada-de-sao-jorge', nome: 'Espada-de-são-jorge', icone: '🗡️', categoria: 'plantas', reais: 26, artigo: 'a', raio: 0.32,
    descricao: 'A mesma do quarto do Ari, num vaso para o lado de fora.',
    monta: espadaDeSaoJorge,
  },
  // --- os móveis
  {
    id: 'quintal-banco', nome: 'Banco de jardim', icone: '🪑', categoria: 'moveis', reais: 120, artigo: 'o', raio: 0.95,
    descricao: 'O banco de ripas e ferro, igual aos do parque. Dá para sentar os dois.',
    monta: bancoDeJardim,
    uso: { label: 'Sentar no banco', icon: '🪑', usar: sentarNoBanco },
  },
  {
    id: 'quintal-mesinha', nome: 'Mesinha bistrô', icone: '☕', categoria: 'moveis', reais: 140, artigo: 'a', raio: 0.85,
    descricao: 'Mesa de ferro verde com duas cadeirinhas de almofada, uma de frente para a outra.',
    monta: mesinhaBistro,
    uso: { label: 'Sentar à mesinha', icon: '☕', usar: sentarAMesinha },
  },
  {
    id: 'quintal-espreguicadeira', nome: 'Espreguiçadeira', icone: '🏖️', categoria: 'moveis', reais: 110, artigo: 'a', raio: 0.92,
    descricao: 'De ripas de madeira, com rodinhas e colchonete listrado.',
    monta: espreguicadeira,
    uso: { label: 'Deitar ao sol', icon: '🌞', usar: deitarAoSol },
  },
  {
    id: 'quintal-guarda-sol', nome: 'Guarda-sol', icone: '⛱️', categoria: 'moveis', reais: 90, artigo: 'o', raio: 0.36,
    descricao: 'De gomos cru e terracota, com babado. Fica bem do lado da mesinha.',
    monta: guardaSol,
  },
  {
    id: 'quintal-balanco', nome: 'Balanço de jardim', icone: '🪢', categoria: 'moveis', reais: 180, artigo: 'o', raio: 1.3,
    descricao: 'De madeira, com o banco de dois lugares pendurado. Balança de verdade.',
    monta: balancoDeJardim,
    uso: { label: 'Balançar', icon: '🪢', usar: balancar },
  },
  {
    id: 'quintal-rede', nome: 'Rede com suporte', icone: '🏝️', categoria: 'moveis', reais: 160, artigo: 'a', raio: 1.25,
    descricao: 'Listrada, no suporte de madeira em arco. Cabem os dois deitados.',
    monta: redeComSuporte,
    uso: { label: 'Deitar na rede', icon: '🏝️', usar: deitarNaRede },
  },
  {
    id: 'quintal-casinha-do-pelusa', nome: 'Casinha do Pelusa', icone: '🐈', categoria: 'moveis', reais: 70, artigo: 'a', raio: 0.45,
    descricao: 'Rosinha, com a plaquinha do nome e a almofada. Com ela no quintal, o Pelusa vem morar aqui fora também.',
    monta: casinhaDoPelusa,
  },
  // --- o chão: os pisos (põe-se onde quiser) e os caminhos (troca-se o da casa)
  {
    id: 'quintal-deck', nome: 'Deck de madeira', icone: '🟫', categoria: 'chao', reais: 95, artigo: 'o', raio: 1.05, piso: true,
    descricao: 'Tábuas com veio, rentes ao chão. Cabe a mesinha em cima.',
    monta: deckDeMadeira,
  },
  {
    id: 'quintal-canteiro-casca', nome: 'Canteiro de casca', icone: '🪵', categoria: 'chao', reais: 35, artigo: 'o', raio: 0.88, piso: true,
    descricao: 'Redondo, de casca de pínus, com a borda de seixos. Para pôr planta em cima.',
    monta: canteiroDeCasca,
  },
  {
    id: 'quintal-canteiro-terra', nome: 'Canteiro de terra', icone: '🟤', categoria: 'chao', reais: 30, artigo: 'o', raio: 0.82, piso: true,
    descricao: 'Oval, de terra fofa, com a serrilha de tijolinho.',
    monta: canteiroDeTerra,
  },
  {
    id: 'quintal-pedrisco', nome: 'Pedrisco branco', icone: '⚪', categoria: 'chao', reais: 40, artigo: 'o', raio: 0.92, piso: true,
    descricao: 'Uma mancha de pedrisco de quina redonda, com a guia de cimento.',
    monta: manchaDePedrisco,
  },
  {
    id: 'quintal-tapete', nome: 'Tapete de área externa', icone: '🧶', categoria: 'chao', reais: 55, artigo: 'o', raio: 0.98, piso: true,
    descricao: 'Listrado de azul e terracota, de franjinha. Aguenta chuva.',
    monta: tapeteDeFora,
  },
  {
    id: 'quintal-gramado-de-flores', nome: 'Gramado de florzinhas', icone: '🌼', categoria: 'chao', reais: 25, artigo: 'o', raio: 0.92, piso: true,
    descricao: 'Um redondo de florzinhas miúdas no meio da grama.',
    monta: gramadoDeFlores,
  },
  {
    id: 'quintal-caminho-pedras', nome: 'Caminho de pedras', icone: '🪨', categoria: 'chao', reais: 80, artigo: 'o', raio: 1, caminho: 'pedras',
    descricao: 'Pedras de passar, tortas e de beira macia, aos pares no caminho largo.',
    monta: () => amostraDeCaminho('pedras'),
  },
  {
    id: 'quintal-caminho-tijolinho', nome: 'Caminho de tijolinho', icone: '🧱', categoria: 'chao', reais: 90, artigo: 'o', raio: 1, caminho: 'tijolinho',
    descricao: 'Tijolinho em fiadas desencontradas, com a guia de tijolo em pé.',
    monta: () => amostraDeCaminho('tijolinho'),
  },
  {
    id: 'quintal-caminho-dormentes', nome: 'Caminho de dormentes', icone: '🛤️', categoria: 'chao', reais: 85, artigo: 'o', raio: 1, caminho: 'dormentes',
    descricao: 'Vigas de madeira de través, no pedrisco branco.',
    monta: () => amostraDeCaminho('dormentes'),
  },
  {
    id: 'quintal-caminho-portuguesa', nome: 'Caminho de pedra portuguesa', icone: '⬜', categoria: 'chao', reais: 75, artigo: 'o', raio: 1, caminho: 'portuguesa',
    descricao: 'A pedrinha branca da calçada da praça, com a guia de pedra escura.',
    monta: () => amostraDeCaminho('portuguesa'),
  },
  {
    id: 'quintal-caminho-lajes', nome: 'Caminho de lajes', icone: '⬛', categoria: 'chao', reais: 0, artigo: 'o', raio: 1, caminho: 'lajes', naLoja: false,
    descricao: 'As placas de cimento de sempre, com a grama entre elas.',
    monta: () => amostraDeCaminho('lajes'),
  },
  // --- no alto: na parede (o Ari escolhe a altura), em cima do muro, pendurado e de ponta a ponta
  {
    id: 'quintal-arandela', nome: 'Arandela', icone: '🏮', categoria: 'alto', reais: 70, artigo: 'a', raio: 0.12,
    encaixe: 'parede', alturaPadrao: 1.9,
    descricao: 'Lanterninha de ferro na parede, acesa, com o leque de luz em volta.',
    monta: arandela,
  },
  {
    id: 'quintal-vaso-de-parede', nome: 'Vaso de parede', icone: '🪴', categoria: 'alto', reais: 45, artigo: 'o', raio: 0.2,
    encaixe: 'parede', alturaPadrao: 1.6,
    descricao: 'Meio vaso de barro preso na parede, com a samambaia caindo.',
    monta: vasoDeParede,
  },
  {
    id: 'quintal-casinha-de-passarinho', nome: 'Casinha de passarinho', icone: '🐦', categoria: 'alto', reais: 40, artigo: 'a', raio: 0.13,
    encaixe: 'parede', alturaPadrao: 1.8,
    descricao: 'Azul-céu, de telhadinho de madeira, poleiro e um coraçãozinho pintado.',
    monta: casinhaDePassarinho,
  },
  {
    id: 'quintal-espelho', nome: 'Espelho de jardim', icone: '🪞', categoria: 'alto', reais: 85, artigo: 'o', raio: 0.3,
    encaixe: 'parede', alturaPadrao: 1.4,
    descricao: 'Em arco, de moldura de ferro verde e voluta. Reflete o céu.',
    monta: espelhoDeJardim,
  },
  {
    id: 'quintal-trelica', nome: 'Treliça com trepadeira', icone: '🌺', categoria: 'alto', reais: 75, artigo: 'a', raio: 0.38,
    encaixe: 'parede', alturaPadrao: 1.0,
    descricao: 'Ripas brancas em losango e a trepadeira subindo, de florzinha rosa.',
    monta: trelicaComTrepadeira,
  },
  {
    id: 'quintal-suculentas', nome: 'Vasinho de suculentas', icone: '🌵', categoria: 'alto', reais: 20, artigo: 'o', raio: 0.1,
    encaixe: 'emCima',
    descricao: 'Três rosetas num vaso de cimento baixinho. Para o alto do muro.',
    monta: vasinhoDeSuculentas,
  },
  {
    id: 'quintal-gatinho', nome: 'Gatinho de cerâmica', icone: '🐈', categoria: 'alto', reais: 35, artigo: 'o', raio: 0.1,
    encaixe: 'emCima',
    descricao: 'Sentado em cima do muro, de rabo enrolado, olhando a rua.',
    monta: gatinhoDeCeramica,
  },
  {
    id: 'quintal-lanterninha-solar', nome: 'Lanterninha solar', icone: '🔆', categoria: 'alto', reais: 30, artigo: 'a', raio: 0.08,
    encaixe: 'emCima',
    descricao: 'Com a plaquinha solar em cima, acesa. Fica bem no pilar e no muro.',
    monta: lanterninhaSolar,
  },
  {
    id: 'quintal-trio-de-vasinhos', nome: 'Trio de vasinhos', icone: '🌷', categoria: 'alto', reais: 30, artigo: 'o', raio: 0.17,
    encaixe: 'emCima',
    descricao: 'Três vasinhos de barro em fila, com florzinhas.',
    monta: trioDeVasinhos,
  },
  {
    id: 'quintal-macrame', nome: 'Vaso de macramê', icone: '🧶', categoria: 'alto', reais: 55, artigo: 'o', raio: 0.2,
    encaixe: 'pendurado',
    descricao: 'Pendurado na viga, nas cordas trançadas, com a samambaia caindo.',
    monta: vasoDeMacrame,
  },
  {
    id: 'quintal-sino-de-vento', nome: 'Sino de vento', icone: '🎐', categoria: 'alto', reais: 40, artigo: 'o', raio: 0.1,
    encaixe: 'pendurado',
    descricao: 'Tubinhos de metal pendurados, balançando com o vento.',
    monta: sinoDeVento,
    anima: balancarSino,
  },
  {
    id: 'quintal-lanterna-de-papel', nome: 'Lanterna de papel', icone: '🏮', categoria: 'alto', reais: 35, artigo: 'a', raio: 0.16,
    encaixe: 'pendurado',
    descricao: 'Um globo de papel pêssego, aceso, pendurado no beiral ou na viga.',
    monta: () => lanternaDePapel(),
  },
  {
    id: 'quintal-varal-de-luzinhas', nome: 'Varal de luzinhas', icone: '✨', categoria: 'alto', reais: 90, artigo: 'o', raio: 0.2,
    encaixe: 'pontaAPonta',
    descricao: 'De um ponto a outro: do pilar ao beiral, da viga ao muro. Lampadinhas acesas.',
    monta: amostraEntre(varalDeLuzinhasEntre), montaEntre: varalDeLuzinhasEntre,
  },
  {
    id: 'quintal-bandeirinhas', nome: 'Bandeirinhas', icone: '🎏', categoria: 'alto', reais: 50, artigo: 'a', raio: 0.2,
    encaixe: 'pontaAPonta',
    descricao: 'De um ponto a outro, bandeirinhas de papel de todas as cores.',
    monta: amostraEntre(bandeirinhasEntre), montaEntre: bandeirinhasEntre,
  },
  {
    id: 'quintal-cordao-de-lanternas', nome: 'Cordão de lanternas', icone: '🏮', categoria: 'alto', reais: 80, artigo: 'o', raio: 0.2,
    encaixe: 'pontaAPonta',
    descricao: 'Lanterninhas de papel redondas, acesas, num barbante de ponta a ponta.',
    monta: amostraEntre(cordaoDeLanternasEntre), montaEntre: cordaoDeLanternasEntre,
  },
  // --- o que já veio com a casa
  {
    id: 'quintal-arvore-florida', nome: 'Árvore florida', icone: '🌸', categoria: 'plantas', reais: 0, artigo: 'a', raio: 0.55, naLoja: false,
    descricao: 'A árvore cor-de-rosa do canto do jardim.',
    monta: arvoreFlorida,
  },
] as Array<Omit<FichaDoQuintal, 'girassois' | 'onda' | 'cenas'>>).map((f) => ({
  ...f, girassois: 0, onda: 0, cenas: ['quintal'] as const,
  regavel: f.categoria === 'plantas' || COM_PLANTA.has(f.id),
}));
