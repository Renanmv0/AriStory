import * as THREE from 'three';
import type { GameAPI, SceneAmbient } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import type { Bicho } from '../../entities/bichos/Bicho';
import { Estella } from '../../entities/bichos/Estella';
import { Mano } from '../../entities/bichos/Mano';
import { Cookie } from '../../entities/bichos/Cookie';
import { JeanLuc } from '../../entities/bichos/JeanLuc';
import { Gina } from '../../entities/bichos/Gina';
import { Capy } from '../../entities/bichos/Capy';
import { Noel } from '../../entities/bichos/Noel';
import { Josefina } from '../../entities/bichos/Josefina';
import { Walter } from '../../entities/bichos/Walter';
import { Gatito } from '../../entities/bichos/Gatito';
import { Flynn } from '../../entities/bichos/Flynn';
import { Estrella, Luna, Sol, type CoelhaDaTorcida } from '../../entities/bichos/CoelhaDaTorcida';
import { fantasiarEstellaDeAranha } from '../../world/halloween/fantasiasDosBichos';
import { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import { LoteDeAboboras, type AboboraNoLote } from '../../world/halloween/abobora';
import { portaDoSalao } from '../../world/halloween/casinhaPorDentro';
import {
  ALTO_DO_TETO, LustreDeVelas, SALAO_DA_ABOBORA, cascaDoSalao, doceDaFesta, mesaDeDoces, naParede, noSalao,
  raioDaParede, texturaDaPista, vaoDaPorta, type Doce,
} from '../../world/halloween/salaoDaAbobora';
import { Particulas } from '../../world/particulas';
import { pocaDeLuz } from '../../world/furniture';
import { assoalhoDeMadeira } from '../../world/texturasDeChao';
import { fantasiarQuemEstaAqui } from './fantasiados';
import { fixas, zoomDaConversa, type Convidado, type Fala, type Tomada } from './conversaComZoom';

/*
 * O SALÃO DA ABÓBORA (`docs/HALLOWEEN.md`, §7.1, E — a parte 6c): a porta
 * grande da cozinha da bruxa dá no salão redondo POR DENTRO da abóbora
 * gigante (as peças: `world/halloween/salaoDaAbobora.ts`).
 *
 * A SURPRESA (a primeira vez): o salão está escuro, só o céu pelos olhos e
 * pela boca recortados. "Tem alguém aí?" — a porta fecha atrás —, um
 * segundo de silêncio, a câmera vem para trás da dupla… e as luzes acendem
 * (o lustre de velas, os varais de luzinha, as lanternas e as abóboras), todo
 * mundo grita "SURPRESA!" e chove confete. A Estella vem explicar (a conversa
 * com zoom, emendada na tomada da porta) e a festa começa.
 *
 * A FESTA (livre, e de toda volta depois): a música de festa, os catorze
 * convidados fantasiados dançando cada um a sua dança (a do Mano, a
 * comemoração do Flynn e do Jean-Luc, o six seven do Gatito, a coreografia das
 * coelhinhas, o Cookie rodando o lençol, a Gina balançando o pescoço, o Noel
 * pulando…), cada um com a sua fala de festa na conversa com zoom, a mesa de
 * doces com o caldeirão de balas, e o Walter múmia garçom fazendo a ronda com
 * a bandeja: "Pegar um doce" na mesa faz ele vir servir, e o doce é comido ali.
 *
 * O relógio de tudo é o do jogo (`w.onUpdate`), e não o `g.wait` de parede:
 * as luzes, o confete e a câmera chegam juntos em qualquer celular.
 */

export const CENA_DO_SALAO = 'casinha-da-abobora-salao';
/** a surpresa já aconteceu: o salão é festa, aceso, de toda volta */
export const FLAG_DA_SURPRESA = 'halloween:salao:surpresa';

const S = SALAO_DA_ABOBORA;
/** onde a dupla chega (pela porta da cozinha) */
const CHEGADA = noSalao(S.porta, 5.9);

/** as entradas do salão (a cena registra) */
export const ENTRADAS_DO_SALAO = {
  'da-cozinha': { x: CHEGADA.x, z: CHEGADA.z, facing: Math.atan2(-CHEGADA.x, -CHEGADA.z) },
} as const;

/** a luz do salão apagado (só o céu pelas janelas) e a da festa */
const ESCURO = {
  sky: P.salaoEscuroFundo, ambientColor: P.salaoEscuroAmbiente, ambientIntensity: 0.34, sunColor: P.salaoEscuroLuz, sunIntensity: 0.2,
} as const;
export const LUZ_DA_FESTA: SceneAmbient = {
  sky: P.salaoFestaFundo,
  indoor: true,
  ambientColor: P.salaoFestaAmbiente,
  ambientIntensity: 1.0,
  sunColor: P.salaoFestaLuz,
  sunIntensity: 0.6,
  sunDir: [6, 12, 8],
};
const mistura = (a: number, b: number, k: number): number => new THREE.Color(a).lerp(new THREE.Color(b), k).getHex();

/** a mesa de doces (do lado esquerdo do fundo) e onde se pede o doce */
const MESA = noSalao(THREE.MathUtils.degToRad(150), 5.65);
const GIRO_DA_MESA = Math.atan2(-MESA.x, -MESA.z);
const NA_MESA = { x: MESA.x + Math.sin(GIRO_DA_MESA) * 1.25, z: MESA.z + Math.cos(GIRO_DA_MESA) * 1.25 };

/** para onde todo mundo dança virado: a câmera de sempre, um tico para o meio */
const PALCO = { x: 4.5, z: 4.5 };
/** as coelhinhas em fila, no meio da pista (a câmera as vê lado a lado) */
const FILA = { x: -1.0, z: -1.0, passo: 1.3 };

/** o lugar de cada um na festa */
const LUGARES: Record<string, { x: number; z: number }> = {
  estella: { x: 2.2, z: -2.2 },
  mano: { x: 1.0, z: 0.8 },
  cookie: { x: -2.4, z: -4.3 },
  'jean-luc': { x: -1.6, z: 2.4 },
  girafa: { x: -4.6, z: -0.9 },
  capy: { x: -3.4, z: -2.4 },
  noel: { x: -3.6, z: 0.6 },
  josefina: { x: -2.6, z: 3.4 },
  gatito: { x: 2.0, z: -0.4 },
  flynn: { x: -0.4, z: 1.6 },
  estrella: { x: FILA.x - FILA.passo * 0.707, z: FILA.z + FILA.passo * 0.707 },
  luna: { x: FILA.x, z: FILA.z },
  sol: { x: FILA.x + FILA.passo * 0.707, z: FILA.z - FILA.passo * 0.707 },
  'garcom-canino': { x: NA_MESA.x + 0.6, z: NA_MESA.z - 0.9 },
};

/** a ronda do Walter: da mesa de doces pela frente da pista, ida e volta */
const RONDA = [
  { x: NA_MESA.x + 0.6, z: NA_MESA.z - 0.9 }, { x: -0.9, z: 3.7 }, { x: 2.0, z: 2.6 }, { x: 3.4, z: 0.6 }, { x: 3.4, z: -1.2 },
  { x: 3.4, z: 0.6 }, { x: 2.0, z: 2.6 }, { x: -0.9, z: 3.7 },
];

/** o jeito de dançar de quem não tem dança própria: o pulinho, o balanço e o giro de cada quadro */
interface Passo { y: number; rz: number; ry: number }
type Jeito = (t: number) => Passo;
const PARADO: Jeito = () => ({ y: 0, rz: 0, ry: 0 });

interface Dancarino {
  c: Convidado;
  casa: { x: number; z: number };
  /** para onde ele dança virado */
  giro: number;
  jeito: Jeito;
  /** a dança própria (a do Mano, a comemoração do Flynn…), chamada a cada quadro */
  propria?: (dt: number) => void;
  /** o pulinho do "SURPRESA!" de quem não tem gesto próprio */
  pulo: number;
  /** o giro de agora (vai virando para o da dança) */
  giroAgora: number;
  falando: boolean;
  /** voltando para o lugar depois de uma conversa */
  voltando: boolean;
}

/** quem joga diz `@eu`, quem acompanha diz `@par` */
async function conversa(api: GameAPI, falas: ReadonlyArray<readonly ['@eu' | '@par', string]>): Promise<void> {
  for (const [quem, texto] of falas) await api.say([texto], quem === '@eu' ? api.playerName() : api.companionName());
}

export function montarOSalao(w: WorldBuilder): void {
  const g0 = w.game;
  const jaFoi = g0.flag(FLAG_DA_SURPRESA);

  // ------------------------------------------------------------ o chão e a casca
  w.ground({ width: 80, depth: 80, color: P.salaoFestaFundo });
  w.disc(0, 0, 7.3, P.assoalhoDaCasinha, 0.01, assoalhoDeMadeira(1.8, 9));
  w.disc(0, 0, 2.6, 0xffffff, 0.01, texturaDaPista(5.2));
  w.setBounds(-7.2, -7.2, 7.2, 7.2);
  const casca = cascaDoSalao();
  w.add(casca.group);
  // a parede: um anel de colisores rente ao pé da casca (o meio nunca é alcançado)
  for (let k = 0; k < 44; k++) {
    const p = noSalao((k / 44) * Math.PI * 2, 7.45);
    w.blockCircle(p.x, p.z, 0.85);
  }
  // o luar que entra pelos olhos e pela boca (aceso no escuro, fraquinho na festa)
  const luar = new THREE.Group();
  for (const l of casca.luar) {
    const poca = pocaDeLuz(l.raio, P.salaoLuar, 0.35);
    poca.position.set(l.x, 0.03, l.z);
    luar.add(poca);
  }
  w.add(luar);

  // ------------------------------------------------------------ a porta da cozinha
  const porta = portaDoSalao();
  w.add(w.place(porta, casca.porta.x, 0, casca.porta.z, casca.porta.giro));
  const dobradica = porta.getObjectByName('dobradica');
  // a cozinha lá atrás, no vão (só aparece com a folha aberta)
  const vao = vaoDaPorta();
  vao.position.z = -0.07;
  porta.add(vao);
  /** 1 aberta (empurrada para dentro do salão), 0 fechada */
  let abertura = jaFoi ? 0 : 1;
  let fechando = false;
  w.interact({
    id: 'halloween:salao:sair',
    x: noSalao(S.porta, 6.3).x, z: noSalao(S.porta, 6.3).z, radius: 1.0,
    label: 'Voltar pra cozinha', icon: '🚪',
    highlight: porta,
    onInteract: (api) => api.goTo('casinha-da-abobora-dentro', 'do-salao'),
  });

  // ------------------------------------------------------------ as luzes
  const lustre = new LustreDeVelas(3.75, ALTO_DO_TETO);
  w.add(w.place(lustre.group, 0, 3.75, 0));
  // os varais de luzinha: as barrigas pela parede do fundo, e os raios do lustre até ela
  const enfeites = new EnfeitesDePendurar();
  const fundo = [140, 158, 176, 194, 212, 230, 248, 266, 304, 322].map((g) => THREE.MathUtils.degToRad(g));
  for (let k = 0; k < fundo.length - 1; k++) {
    if (fundo[k + 1] - fundo[k] > 0.5) continue;
    enfeites.luzinhas(naParede(fundo[k], 3.55, 0.1), naParede(fundo[k + 1], 3.55, 0.1), { barriga: 0.38, passo: 0.34 });
  }
  // por cima da porta, uma barriga só, mais alta
  enfeites.luzinhas(naParede(THREE.MathUtils.degToRad(266), 3.55, 0.1), naParede(THREE.MathUtils.degToRad(304), 3.55, 0.1), { barriga: 0.25, passo: 0.34 });
  const cubo = new THREE.Vector3(0, 3.75 + 1.25, 0);
  for (const g of [150, 190, 230, 270, 310]) {
    enfeites.luzinhas(cubo, naParede(THREE.MathUtils.degToRad(g), 3.9, 0.15), { barriga: 0.55, passo: 0.36 });
  }
  // as lanternas de papel nos ganchos das barrigas, e as bandeirolas embaixo das luzinhas
  fundo.forEach((t, i) => {
    const p = naParede(t, 3.5, 0.18);
    enfeites.lanterna(p.x, p.y, p.z, i % 2 ? P.lanternaRoxa : P.lanternaLaranja, -t + Math.PI / 2);
  });
  for (const [a, b] of [[146, 186], [236, 262], [306, 336]] as const) {
    enfeites.varal(naParede(THREE.MathUtils.degToRad(a), 2.75, 0.1), naParede(THREE.MathUtils.degToRad(b), 2.75, 0.1), { barriga: 0.3 });
  }
  const pendurados = enfeites.montar();
  w.add(pendurados);
  const luzDasLuzinhas = enfeites.luzDasLuzinhas(0.28, 0.02);
  const luzDasLanternas = enfeites.luzDasLanternas(0.4, 0.02);
  for (const l of [luzDasLuzinhas, luzDasLanternas]) if (l) w.add(l);
  // as lampadinhas apagadas no escuro: a cor de cada cópia, guardada, e escurecida
  const lampadas = pendurados.getObjectByName('lampadinhas') as THREE.InstancedMesh | undefined;
  const corDasLampadas = lampadas?.instanceColor ? Float32Array.from(lampadas.instanceColor.array as Float32Array) : null;
  const acenderLampadas = (k: number): void => {
    if (!lampadas?.instanceColor || !corDasLampadas) return;
    const arr = lampadas.instanceColor.array as Float32Array;
    const n = lampadas.count;
    for (let i = 0; i < n; i++) {
      // cada uma pega no seu momento (a ordem do varal), e a apagada fica um tico visível
      const vez = THREE.MathUtils.clamp(k * 1.4 - (i / n) * 0.4, 0, 1);
      const luz = 0.14 + 0.86 * vez;
      for (let c = 0; c < 3; c++) arr[i * 3 + c] = corDasLampadas[i * 3 + c] * luz;
    }
    lampadas.instanceColor.needsUpdate = true;
  };

  // as abóboras acesas no pé da parede e na mesa (e as mesmas apagadas, no escuro)
  const aboboras: AboboraNoLote[] = [];
  const caras = ['sorriso', 'susto', 'piscando', 'dentinho'] as const;
  [175, 190, 205, 216, 234, 246, 260, 315, 330].forEach((graus, i) => {
    const t = THREE.MathUtils.degToRad(graus);
    const r = raioDaParede(t, 0.2) - (i % 2 ? 0.55 : 0.75);
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    aboboras.push({ x, z, giro: Math.atan2(-x, -z) + (i % 3 - 1) * 0.3, tamanho: i % 3 === 0 ? 'grande' : 'media', cara: caras[i % caras.length] });
  });
  const apagadas = new LoteDeAboboras();
  const acesas = new LoteDeAboboras();
  for (const a of aboboras) {
    apagadas.por(a);
    acesas.por(a);
  }
  const grupoApagadas = apagadas.montar();
  const grupoAcesas = acesas.montar({ acesas: true });
  w.add(grupoApagadas);
  w.add(grupoAcesas);
  for (const a of aboboras) w.blockCircle(a.x, a.z, 0.3);

  // ------------------------------------------------------------ a mesa de doces
  const mesa = mesaDeDoces();
  w.add(w.place(mesa.group, MESA.x, 0, MESA.z, GIRO_DA_MESA));
  w.blockBox(MESA.x, MESA.z, mesa.largura / 2 + 0.1, mesa.fundo / 2 + 0.1, -GIRO_DA_MESA);
  {
    // o caldeirão, do lado direito da mesa (o `+x` dela)
    const lx = mesa.largura / 2 + 0.55;
    w.blockCircle(MESA.x + Math.cos(GIRO_DA_MESA) * lx + Math.sin(GIRO_DA_MESA) * 0.15, MESA.z - Math.sin(GIRO_DA_MESA) * lx + Math.cos(GIRO_DA_MESA) * 0.15, 0.48);
  }

  // ------------------------------------------------------------ o confete
  const confete = new Particulas(420, 0.25, 1, 4);
  w.add(confete.malha);
  const soltarConfete = (): void => {
    const cores = [P.balaLaranja, P.balaRoxa, P.balaVerde, P.balaAmarela, P.balaRosa, P.balaBranca];
    for (let i = 0; i < 320; i++) {
      const a = i * 2.39996;
      const r = 0.4 + (i % 11) * 0.42;
      confete.emitir({
        x: Math.cos(a) * r, y: 3.6 + (i % 7) * 0.25, z: Math.sin(a) * r - 1.0,
        vx: Math.cos(a) * 0.6, vy: 1.0, vz: Math.sin(a) * 0.6,
        vida: 4.2, tamanho: 0.03 + (i % 3) * 0.01, cor: cores[i % cores.length],
        gravidade: 1.8, arrasto: 1.4, balanco: 0.8,
      });
    }
  };

  // ------------------------------------------------------------ quem está na festa
  const posto = (p: { x: number; z: number }) => ({ minX: p.x, maxX: p.x, minZ: p.z, maxZ: p.z });
  const estella = new Estella(posto(LUGARES.estella));
  const mano = new Mano(posto(LUGARES.mano));
  const cookie = new Cookie(posto(LUGARES.cookie));
  const jeanLuc = new JeanLuc(posto(LUGARES['jean-luc']));
  const gina = new Gina(posto(LUGARES.girafa));
  const capy = new Capy(posto(LUGARES.capy));
  const noel = new Noel(posto(LUGARES.noel));
  const josefina = new Josefina(posto(LUGARES.josefina));
  const walter = new Walter(posto(LUGARES['garcom-canino']));
  const gatito = new Gatito(posto(LUGARES.gatito));
  const flynn = new Flynn(posto(LUGARES.flynn));
  const luna = new Luna(posto(LUGARES.luna));
  const sol = new Sol(posto(LUGARES.sol));
  const estrella = new Estrella(posto(LUGARES.estrella));
  const coelhinhas: CoelhaDaTorcida[] = [luna, sol, estrella];
  const todos: Bicho[] = [estella, mano, cookie, jeanLuc, gina, capy, noel, josefina, walter, gatito, flynn, luna, sol, estrella];
  for (const b of todos) {
    w.add(b.group);
    b.entrarEmServico();
    // virados para a dupla que vai entrar (a surpresa), ou já para a festa
    const alvo = jaFoi ? PALCO : CHEGADA;
    b.group.rotation.y = Math.atan2(alvo.x - b.x, alvo.z - b.z);
    if (b !== walter) w.blockCircle(b.x, b.z, b === gina || b === cookie ? 0.5 : 0.34);
  }
  // todo mundo fantasiado: os de sempre pela etiqueta, e a Estella de aranha
  fantasiarQuemEstaAqui(w);
  fantasiarEstellaDeAranha(estella);

  // ------------------------------------------------------------ as conversas
  const zoom = zoomDaConversa(w);
  const nomeDe = (api: GameAPI): { eu: string; par: string } => ({ eu: api.playerName(), par: api.companionName() });
  const E = 'Estella';
  const convidados: Convidado[] = [
    {
      bicho: estella, nome: E, artigo: 'a', icone: '🕷️', som: 'balido', raio: 1.3,
      falas: fixas([
        [E, 'Gostaram? A abóbora por dentro foi ideia do Walter. A decoração foi minha, claro.'],
        [E, 'Cada luzinha daquelas eu pendurei de ponta-cabeça. Aranha tem as suas vantagens.'],
      ], [
        [[E, 'Já experimentaram os doces? O bolo de abóbora fui eu que confeitei.']],
        [[E, 'Dança comigo depois? Oito patas, nenhuma pisada no pé. Prometo.']],
      ]),
    },
    {
      bicho: mano, nome: 'Mano', artigo: 'o', icone: '🧛', som: 'pinguim', raio: 0.9,
      falas: fixas([
        ['Mano', 'Muahaha! Surpresa! … Fui eu que segurei o riso no escuro. Foi a parte mais difícil.'],
        ['Mano', 'Agora é dançar. Vampiro dança bem, sabia? A capa ajuda no giro.'],
      ], [
        [['Mano', 'Olha o giro! … Tá, a capa enroscou. Mas olha o giro!']],
        [['Mano', 'Trouxe sorvete de abóbora pra mesa de doces. Some rápido, corre!']],
      ]),
      aoFim: () => mano.dancar(1.8),
    },
    {
      bicho: cookie, nome: 'Cookie', artigo: 'o', icone: '👻', raio: 1.6,
      falas: fixas([
        ['Cookie', 'Buu… de festa.'],
        ['Cookie', 'Eu fiquei bem quietinho no escuro. Elefante quieto é difícil. Prendi até a tromba.'],
        ['Cookie', 'Agora eu tô rodando. Fantasma rodando é mais assustador. Eu acho.'],
      ], [
        [['Cookie', 'Rodei tanto que o lençol virou saia. Tudo bem, fantasma de saia também existe.']],
        [['Cookie', 'Lá da roda a gente vê as abóboras. Aqui dentro a gente É a abóbora.']],
      ]),
    },
    {
      bicho: jeanLuc, nome: 'Jean-Luc', artigo: 'o', icone: '🎭', som: 'pato', raio: 1.1,
      gesto: () => jeanLuc.comemorar(1.6),
      falas: fixas([
        ['Jean-Luc', 'Surprise! … Como se diz… SURPRESA! Eu ensaiei em português.'],
        ['Jean-Luc', 'Ce soir eu canto ópera pra festa inteira. Lá-lá-lááá…'],
        ['Jean-Luc', 'A rosa ainda é de quem cantar mais bonito. Até agora sou eu. Mas a noite é longa.'],
      ], [
        [['Jean-Luc', 'Lá-lá-lááá… Merci, merci. Sem aplausos, por favor. … Tá, pode aplaudir.']],
        [['Jean-Luc', 'Uma abóbora gigante por dentro. Très chic. Lembra a Ópera de Paris. Um pouco.']],
      ]),
    },
    {
      bicho: gina, nome: 'Gina', artigo: 'a', icone: '🦒', som: 'apito', raio: 1.6,
      falas: fixas([
        ['Gina', 'SURPRESAAA! … Ai, o véu enganchou numa luzinha. De novo.'],
        ['Gina', 'Ordem da casa: hoje ninguém sai daqui sem dançar. Eu tô de olho, hein.'],
      ], [
        [['Gina', 'Daqui de cima eu vejo a festa inteira. Tá todo mundo dançando. Muito bem.']],
        [['Gina', 'O motorista do ônibus espera a gente. Ele também ganhou um cupcake.']],
      ]),
    },
    {
      bicho: capy, nome: 'Capy', artigo: 'o', icone: '🦈', som: 'apito', raio: 1.3,
      falas: fixas([
        ['Capy', 'Surpresa! Tum-tum… tum-tum… e PÁ! As luzes!'],
        ['Capy', 'Aqui dentro não tem piscina, então hoje eu só danço. Salva-vidas de folga.'],
      ], [
        [['Capy', 'A barbatana balança quando eu danço. Olha! … Viu?']],
        [['Capy', 'Cuidado perto da mesa, alguém derrubou bala no chão. Eu apitaria, mas tô de folga.']],
      ]),
    },
    {
      bicho: noel, nome: 'Noel', artigo: 'o', icone: '🧪', som: 'gluglu', raio: 1.2,
      falas: fixas([
        ['Noel', 'SURPRESA! SURPRESA! Gritei duas vezes porque na primeira ninguém me ouviu!'],
        ['Noel', 'Fiz uma poção de festa pro caldeirão de balas. Ela não faz nada. Mas é LARANJA!'],
      ], [
        [['Noel', 'Dancei tanto que o algodão da crista caiu. A ciência exige sacrifício!']],
        [['Noel', 'Experimento novo: quantas balas cabem na bochecha? Resultado: MUITAS!']],
      ]),
    },
    {
      bicho: josefina, nome: 'Josefina', artigo: 'a', icone: '🐉', som: 'cantarolar', raio: 1.3,
      falas: fixas([
        ['Josefina', 'Surpresa… Eu falei baixinho, mas falei.'],
        ['Josefina', 'As abóboras acesas aqui dentro são das minhas. Escolhi as mais redondas, com calma.'],
      ], [
        [['Josefina', 'Danço devagar, que é o meu jeito. Mas danço.']],
        [['Josefina', 'Um dragão dentro de uma abóbora. Parece história de dormir. Das boas.']],
      ]),
    },
    {
      bicho: gatito, nome: 'Gatito', artigo: 'o', icone: '🐶', som: 'miado', raio: 1.1,
      falas: fixas([
        ['Gatito', 'Au. … Surpresa! Eu vim de Walter, e o Walter de verdade tá aqui. Somos dois.'],
        ['Gatito', 'Hoje a lição é dançar. Six… seven!'],
      ], [
        [['Gatito', 'Six seven! … É assim que se dança, eu vi na internet.']],
        [['Gatito', 'Nota dez pra festa. Com estrelinha.']],
      ]),
      aoFim: () => gatito.sixSeven(),
    },
    {
      bicho: flynn, nome: 'Flynn', artigo: 'o', icone: '🐺', raio: 1.2,
      gesto: () => flynn.comemorar(1.6),
      falas: fixas([
        ['Flynn', 'AUUUUU! SURPRESA!'],
        ['Flynn', 'Lobisomem em noite de festa! Vão, Gatitos!'],
        ['Flynn', 'E bebam água entre uma dança e outra, hein!'],
      ], [
        [['Flynn', 'AUUU! … É o meu passo de dança. O uivo faz parte.']],
        [['Flynn', 'A pista é redonda, dá pra correr em volta. Não vou. Mas dá.']],
      ]),
    },
    {
      bicho: luna, nome: 'Luna', artigo: 'a', icone: '🦉', raio: 1.1,
      gesto: () => luna.torcer(1.6),
      falas: fixas([
        ['Luna', '¡Uh-uh! ¡SORPRESA! Digo… SURPRESA!'],
        ['Luna', 'A gente treinou a coreografia em segredo. Hoje a torcida é pra vocês!'],
      ], [
        [['Luna', '¡Uh-uh! Coruja dança a noite toda. ¡Chévere!']],
        [['Luna', 'Vocês dois estão lindos! ¡Qué fino!']],
      ]),
    },
    {
      bicho: sol, nome: 'Sol', artigo: 'a', icone: '💀', raio: 1.1,
      gesto: () => sol.torcer(1.6),
      falas: fixas([
        ['Sol', '¡SURPRESA, panas! Quase gritei antes da hora!'],
        ['Sol', 'A Estella ficou fazendo "shhh" pra mim o tempo inteiro.'],
      ], [
        [['Sol', '¡Olha o meu salto! … ¡Ya va, mais um!']],
        [['Sol', 'A saia da catrina gira de verdade quando eu danço!']],
      ]),
    },
    {
      bicho: estrella, nome: 'Estrella', artigo: 'a', icone: '🧚', raio: 1.1,
      gesto: () => estrella.torcer(1.6),
      falas: fixas([
        ['Estrella', 'Oi. Surpresa. … Vocês se assustaram? Desculpa.'],
        ['Estrella', 'A gente ficou tão quietinho no escuro. Eu segurava a mão da Sol pra ela não gritar antes.'],
      ], [
        [['Estrella', 'Comeram alguma coisa? Tem bolo. Não se dança de barriga vazia.']],
        [['Estrella', 'A asa brilha mais no escuro. Mas aqui tá tão bonito… tá bom assim.']],
      ]),
    },
  ];
  /*
   * O WALTER SÓ LATE, como no Mania e no parque: quem traduz é a dupla. Ele
   * anda (a ronda), então a conversa só o segura parado onde o pegou.
   */
  const W = 'Walter';
  const convidadoWalter: Convidado = {
    bicho: walter, nome: W, artigo: 'o', icone: '🌭', som: 'latido', raio: 1.0, patrulha: true,
    falas: (api, primeira, vez) => {
      const { eu, par } = nomeDe(api);
      if (primeira) return [[W, 'Au! Au!'], [eu, 'O Walter tá dançando com a bandeja nas costas, e não cai nada!'], [par, 'Garçom profissional. Até de múmia.']];
      const curtas: ReadonlyArray<readonly Fala[]> = [
        [[W, 'Auuu…'], [par, 'Ele tá oferecendo um doce. Acho que é só pedir lá na mesa.']],
        [[W, 'Au!'], [eu, 'Ele piscou pra gente. Múmia piscando é muito fofo.']],
      ];
      return curtas[vez % curtas.length];
    },
  };
  convidados.push(convidadoWalter);

  /** a conversa de festa de cada um: a primeira vez a apresentação, depois uma curta */
  const conversar = (api: GameAPI, c: Convidado): Promise<void> => zoom.conversar(api, c, async () => {
    const peca = c.bicho.group.userData.peca as string;
    const flag = `halloween:salao-falou:${peca}`;
    const primeira = !api.flag(flag);
    const falas = c.falas(api, primeira, primeira ? 0 : api.bump(`halloween:salao-conversas:${peca}`));
    api.setFlag(flag);
    for (const [quem, texto] of falas) await api.say([texto], quem);
  });

  // ------------------------------------------------------------ a dança de cada um
  const fase = (i: number): number => i * 1.37;
  const jeitos: Record<string, Jeito> = {
    // a Estella balança de um lado para o outro, as oito patinhas junto
    estella: (t) => ({ y: Math.abs(Math.sin(t * 3.2)) * 0.04, rz: Math.sin(t * 1.6) * 0.07, ry: Math.sin(t * 0.8) * 0.3 }),
    // o Cookie roda o lençol
    cookie: (t) => ({ y: Math.abs(Math.sin(t * 2.6)) * 0.05, rz: Math.sin(t * 2.6) * 0.03, ry: t * 1.3 }),
    // a Gina balança o pescoço comprido, devagar
    girafa: (t) => ({ y: 0, rz: Math.sin(t * 1.8) * 0.05, ry: Math.sin(t * 0.9) * 0.3 }),
    // o Capy pula de barbatana
    capy: (t) => ({ y: Math.abs(Math.sin(t * 3.8)) * 0.12, rz: Math.sin(t * 3.8) * 0.06, ry: Math.sin(t * 1.9) * 0.35 }),
    // o Noel pula elétrico, virando para todo lado
    noel: (t) => ({ y: Math.abs(Math.sin(t * 6)) * 0.14, rz: 0, ry: Math.sin(t * 3) * 0.5 }),
    // a Josefina, tranquila: um balanço lento e meia volta para cada lado
    josefina: (t) => ({ y: 0, rz: Math.sin(t * 1.2) * 0.05, ry: Math.sin(t * 0.6) * 0.8 }),
  };
  /** um re-disparo de gesto: quando o gesto acaba, espera `pausa` e chama de novo */
  const deNovo = (acabou: () => boolean, fazer: () => void, pausa: number): ((dt: number) => void) => {
    let espera = 0;
    return (dt) => {
      if (!acabou()) return;
      espera -= dt;
      if (espera > 0) return;
      fazer();
      espera = pausa;
    };
  };
  const proprias: Record<string, (dt: number) => void> = {
    mano: deNovo(() => !mano.estaDancando, () => mano.dancar(3.6), 0.5),
    flynn: deNovo(() => true, () => flynn.comemorar(1.8), 2.8),
    'jean-luc': deNovo(() => !jeanLuc.estaComemorando, () => jeanLuc.comemorar(2.4), 1.2),
    gatito: deNovo(() => !gatito.fazendoSixSeven, () => gatito.sixSeven(), 1.4),
  };
  const dancarinos: Dancarino[] = convidados.filter((c) => c.bicho !== walter).map((c) => {
    const peca = c.bicho.group.userData.peca as string;
    const casa = LUGARES[peca];
    return {
      c, casa,
      giro: Math.atan2(PALCO.x - casa.x, PALCO.z - casa.z),
      jeito: jeitos[peca] ?? PARADO,
      propria: proprias[peca],
      pulo: -1,
      giroAgora: c.bicho.group.rotation.y,
      falando: false,
      voltando: false,
    };
  });
  // as coelhinhas: a coreografia inteira da torcida, de novo e de novo (as três no mesmo quadro)
  let esperaDaTorcida = 0.5;
  const dancarATorcida = (dt: number): void => {
    if (coelhinhas.some((c) => c.estaNaFesta || c.estaSaltando || c.estaFazendoEstrelinha)) return;
    if (coelhinhas.some((c) => zoom.falando?.c.bicho === c)) return;
    esperaDaTorcida -= dt;
    if (esperaDaTorcida > 0) return;
    esperaDaTorcida = 2.2;
    for (const c of coelhinhas) {
      const casa = LUGARES[c.group.userData.peca as string];
      c.group.position.set(casa.x, 0, casa.z);
      c.group.rotation.y = Math.PI / 4;
      c.dancarAFesta(undefined, c === estrella ? 1 : -1);
    }
  };

  /** a festa está rolando (depois da surpresa) */
  let festa = jaFoi;
  /** quanto as luzes estão acesas (0 a 1) e a última aplicada */
  let luz = jaFoi ? 1 : 0;
  let luzAplicada = -1;
  let tempo = 0;

  // ------------------------------------------------------------ o Walter na ronda
  let iRonda = 0;
  let pausaDaRonda = 1.5;
  /** onde ele está indo servir (o "Pegar um doce"), ou nada */
  let servirEm: { x: number; z: number } | null = null;
  let servindo = false;

  const DOCES: ReadonlyArray<readonly [Doce, Doce]> = [['cupcake', 'pirulito'], ['maca', 'maca'], ['bala', 'bala']];
  const servir: Convidado = {
    ...convidadoWalter, icone: '🍬',
    falas: () => [],
  };
  w.interact({
    id: 'halloween:salao:doce',
    x: NA_MESA.x, z: NA_MESA.z, radius: 1.1,
    label: 'Pegar um doce', icon: '🍬',
    highlight: mesa.group,
    priority: 2,
    onInteract: async (api) => {
      if (!festa || servindo || zoom.falando) return;
      servindo = true;
      api.lockPlayer(true);
      try {
        // ele vem da ronda até a dupla, entre ela e o meio do salão
        const eu = api.playerPosition();
        const meio = Math.hypot(eu.x, eu.z) || 1;
        servirEm = { x: eu.x - (eu.x / meio) * 0.95, z: eu.z - (eu.z / meio) * 0.95 };
        api.som('latido');
        api.holdCompanion(servirEm.x, servirEm.z);
        let espera = 0;
        while (Math.hypot(walter.x - servirEm.x, walter.z - servirEm.z) > 0.15 && espera < 12) {
          await esperar(0.1);
          espera += 0.1;
        }
        await zoom.conversar(api, servir, async () => {
          const { eu: nEu, par } = nomeDe(api);
          const vez = (api.bump('halloween:salao:doces') - 1) % DOCES.length;
          const [meu, dele] = DOCES[vez];
          const falas: readonly Fala[][] = [
            [[W, 'Au!'], [nEu, 'Cupcake de abóbora… com olhinho!'], [par, 'E pirulito de espiral. O Walter escolheu a dedo. Quer dizer, a pata.']],
            [[W, 'Au, au!'], [par, 'Maçã do amor! A casquinha faz crec.'], [nEu, 'A minha tá grudando no dente. Valeu a pena.']],
            [[W, 'Auuu…'], [nEu, 'Balinha de caramelo, embrulhada que nem múmia.'], [par, 'Combina com o garçom.']],
          ];
          api.segurarNaCena(api.playerId(), doceDaFesta(meu), 'upright');
          api.segurarNaCena(api.companionId(), doceDaFesta(dele), 'upright');
          api.som('pegar');
          const [primeira, ...resto] = falas[vez];
          await api.say([primeira[1]], primeira[0]);
          api.setSaboreando(true);
          api.som('nhac');
          for (const [quem, texto] of resto) await api.say([texto], quem);
          await esperar(1.6);
          api.setSaboreando(false);
          api.segurarNaCena(api.playerId(), null);
          api.segurarNaCena(api.companionId(), null);
        });
      } finally {
        servirEm = null;
        servindo = false;
        api.lockPlayer(false);
      }
    },
  });

  // cada um com o seu ponto "Falar com…", andando com ele
  for (const c of convidados) {
    const ponto = w.interact({
      id: `halloween:salao-${c.bicho.group.userData.peca}`,
      x: c.bicho.x, z: c.bicho.z, radius: c.raio ?? 1.3,
      label: `Falar com ${c.artigo} ${c.nome}`,
      icon: c.icone,
      highlight: c.bicho.group,
      priority: 3,
      onInteract: (api) => {
        if (!festa || servindo) return Promise.resolve();
        // a coelhinha para a coreografia para conversar
        if (coelhinhas.includes(c.bicho as CoelhaDaTorcida)) (c.bicho as CoelhaDaTorcida).pararAFesta();
        return conversar(api, c);
      },
    });
    w.onUpdate(() => {
      ponto.moveTo(c.bicho.x, c.bicho.z);
      ponto.enabled = festa && !servindo && !(c.bicho === walter && servirEm);
    });
  }

  // ------------------------------------------------------------ o relógio do jogo
  const espera: Array<{ falta: number; pronto: () => void }> = [];
  /** espera no relógio do jogo (não no de parede) */
  const esperar = (s: number): Promise<void> => new Promise((pronto) => { espera.push({ falta: s, pronto }); });

  /** 0 a 1 enquanto as luzes acendem, -1 fora disso */
  let acendendo = jaFoi ? -1 : -2;
  const aplicarLuzes = (k: number): void => {
    lustre.acender(THREE.MathUtils.clamp(k * 3, 0, 1));
    acenderLampadas(THREE.MathUtils.clamp((k - 0.1) / 0.8, 0, 1));
    const resto = k > 0.45;
    for (const l of [luzDasLuzinhas, luzDasLanternas]) if (l) l.visible = k > 0.7;
    grupoAcesas.visible = resto;
    grupoApagadas.visible = !resto;
    luz = THREE.MathUtils.clamp(k * 1.25, 0, 1);
  };
  aplicarLuzes(jaFoi ? 1 : 0);

  w.onUpdate((dt) => {
    tempo += dt;
    for (let i = espera.length - 1; i >= 0; i--) {
      espera[i].falta -= dt;
      if (espera[i].falta <= 0) {
        const [e] = espera.splice(i, 1);
        e.pronto();
      }
    }
    // a luz do salão (o motor só olha a cena nova depois do `build`: aqui, no quadro)
    if (luz !== luzAplicada) {
      luzAplicada = luz;
      g0.luzDoCeu({
        sky: mistura(ESCURO.sky, LUZ_DA_FESTA.sky, luz),
        ambientColor: mistura(ESCURO.ambientColor, LUZ_DA_FESTA.ambientColor ?? 0, luz),
        ambientIntensity: THREE.MathUtils.lerp(ESCURO.ambientIntensity, LUZ_DA_FESTA.ambientIntensity ?? 1, luz),
        sunColor: mistura(ESCURO.sunColor, LUZ_DA_FESTA.sunColor ?? 0, luz),
        sunIntensity: THREE.MathUtils.lerp(ESCURO.sunIntensity, LUZ_DA_FESTA.sunIntensity ?? 1, luz),
      });
      luar.visible = luz < 0.98;
    }
    if (acendendo >= 0) {
      acendendo = Math.min(1, acendendo + dt / 1.1);
      aplicarLuzes(acendendo);
      if (acendendo >= 1) acendendo = -1;
    }
    // a porta fechando atrás da dupla
    if (fechando) abertura = Math.max(0, abertura - dt * 1.6);
    if (dobradica) {
      const k = abertura * abertura * (3 - 2 * abertura);
      dobradica.rotation.y = -1.35 * k;
    }
    lustre.update(dt);
    enfeites.update(dt);
    acesas.tremer(tempo);
    confete.update(dt);
    for (const b of todos) b.update(dt);

    // o Walter: servindo, na conversa (a conversa o segura), ou na ronda
    if (zoom.falando?.c.bicho !== walter) {
      if (servirEm) walter.seguir(servirEm.x, servirEm.z, 1.4);
      else if (festa) {
        const alvo = RONDA[iRonda];
        if (pausaDaRonda > 0) pausaDaRonda -= dt;
        else if (Math.hypot(walter.x - alvo.x, walter.z - alvo.z) < 0.12) {
          pausaDaRonda = 1.0 + ((iRonda * 7) % 5) * 0.4;
          iRonda = (iRonda + 1) % RONDA.length;
        } else walter.seguir(alvo.x, alvo.z, 0.9);
      }
    }

    // a dança de cada um
    for (const d of dancarinos) {
      const b = d.c.bicho;
      const agora = zoom.falando?.c === d.c;
      if (agora) {
        d.falando = true;
        b.group.position.y = 0;
        b.group.rotation.z = 0;
        continue;
      }
      if (d.falando) {
        // acabou a conversa: volta para o serviço (a conversa o devolveu ao passeio) e para o lugar
        d.falando = false;
        b.entrarEmServico();
        d.giroAgora = b.group.rotation.y;
        d.voltando = Math.hypot(b.x - d.casa.x, b.z - d.casa.z) > 0.15;
      }
      if (d.voltando) {
        if (Math.hypot(b.x - d.casa.x, b.z - d.casa.z) > 0.1) {
          b.seguir(d.casa.x, d.casa.z);
          d.giroAgora = b.group.rotation.y;
          continue;
        }
        d.voltando = false;
      }
      if (!festa) {
        // antes da festa: parados, virados para a dupla; o pulinho do "SURPRESA!" só
        if (d.pulo >= 0) {
          d.pulo += dt;
          b.group.position.y = Math.sin(Math.min(1, d.pulo / 0.55) * Math.PI) * 0.28;
          if (d.pulo > 0.55) d.pulo = -1;
        }
        continue;
      }
      if (coelhinhas.includes(b as CoelhaDaTorcida)) continue;
      d.propria?.(dt);
      const p = d.jeito(tempo + fase(dancarinos.indexOf(d)));
      let alvo = d.giro + p.ry;
      let dif = alvo - d.giroAgora;
      // o Cookie roda sem parar: o alvo anda, e o giro de agora vai junto pelo caminho curto
      while (dif > Math.PI) dif -= Math.PI * 2;
      while (dif < -Math.PI) dif += Math.PI * 2;
      alvo = d.giroAgora + dif;
      d.giroAgora += (alvo - d.giroAgora) * Math.min(1, dt * 4);
      b.group.rotation.y = d.giroAgora;
      let y = p.y;
      if (d.pulo >= 0) {
        d.pulo += dt;
        y += Math.sin(Math.min(1, d.pulo / 0.55) * Math.PI) * 0.28;
        if (d.pulo > 0.55) d.pulo = -1;
      }
      b.group.position.y = y;
      b.group.rotation.z = p.rz;
    }
    if (festa) dancarATorcida(dt);
  });

  // ------------------------------------------------------------ a surpresa
  const daPorta = (): Tomada => {
    // atrás da dupla, perto da porta, na altura de quem olha por cima do ombro
    // (alta o bastante para o cabelo da dupla não tapar a turma, que fica toda no quadro)
    const fora = noSalao(S.porta, 6.6);
    return { de: new THREE.Vector3(fora.x, 2.85, fora.z), para: new THREE.Vector3(-1.6, 0.8, -0.2) };
  };
  const todoMundoComemora = (): void => {
    for (const d of dancarinos) d.pulo = 0;
    mano.dancar(2.6);
    flynn.comemorar(2);
    jeanLuc.comemorar(2.2);
    gatito.sixSeven();
    for (const c of coelhinhas) c.torcer(2.4);
  };
  const surpresa = async (api: GameAPI): Promise<void> => {
    api.lockPlayer(true);
    api.trocarMusica('abobora-no-escuro');
    api.holdCompanion(0, 0);
    try {
      await esperar(0.8);
      await conversa(api, [['@eu', 'Tem alguém aí?']]);
      // a porta fecha sozinha atrás
      fechando = true;
      api.som('porta');
      await esperar(0.75);
      api.som('clique');
      await conversa(api, [['@par', '…A porta fechou sozinha.']]);
      // um segundo de silêncio, e a câmera vem para trás da dupla
      zoom.cortarPara(api, daPorta());
      await esperar(1.3);
      // as luzes
      api.som('luzesAcendendo');
      acendendo = 0;
      await esperar(1.15);
      // SURPRESA!
      api.som('surpresa');
      soltarConfete();
      todoMundoComemora();
      api.trocarMusica(null);
      await api.say(['SURPRESA!'], 'Todo mundo');
      await conversa(api, [
        ['@eu', '…Pra gente?!'],
        ['@par', 'Todo mundo aqui! Fantasiados! No escuro!'],
      ]);
      // a Estella vem explicar
      const eu = api.playerPosition();
      const ate = { x: eu.x - 1.55 * Math.sin(Math.atan2(eu.x, eu.z)), z: eu.z - 1.55 * Math.cos(Math.atan2(eu.x, eu.z)) };
      void estella.irPara(ate.x, ate.z, 0.9);
      let anda = 0;
      while (Math.hypot(estella.x - ate.x, estella.z - ate.z) > 0.12 && anda < 6) {
        await esperar(0.1);
        anda += 0.1;
      }
      const explica: Convidado = {
        ...convidados[0],
        falas: (a) => {
          const { eu: nEu, par } = nomeDe(a);
          return [
            [E, 'A festa era pra vocês dois! A caça toda era pra distrair vocês enquanto a gente arrumava aqui.'],
            [E, 'Eu costurei a fantasia de todo mundo… mas as mais bonitas são as de vocês.'],
            [par, 'Estella… vocês fizeram tudo isso pra gente?'],
            [nEu, 'Eu nem desconfiei. Nem um pouquinho.'],
            [E, 'Era essa a ideia! Agora vão: dancem, comam doce, falem com todo mundo. A festa é de vocês.'],
          ];
        },
      };
      await zoom.conversar(api, explica, async (a) => {
        for (const [quem, texto] of explica.falas(a, true, 0)) await a.say([texto], quem);
      }, { daTomadaAtual: true });
    } finally {
      api.setCameraOmbro(null);
      api.lockPlayer(false);
      api.freeCompanion();
      // e a festa começa: a Estella volta para o lugar dela
      g0.setFlag(FLAG_DA_SURPRESA);
      const d = dancarinos.find((x) => x.c.bicho === estella);
      if (d) {
        estella.entrarEmServico();
        d.giroAgora = estella.group.rotation.y;
        d.voltando = true;
      }
      festa = true;
      api.unlock({
        id: 'festa-surpresa-na-abobora',
        title: 'SURPRESA!',
        place: 'Casinha da Abóbora',
        note: 'A caça de doces inteira era pra distrair a gente: dentro da abóbora gigante estava todo mundo, no escuro, esperando. As luzes acenderam, choveu confete, e a festa era pra nós dois.',
        icon: '🎃',
      });
    }
  };
  if (!jaFoi) {
    let comecou = false;
    w.onUpdate(() => {
      if (comecou) return;
      comecou = true;
      void surpresa(g0);
    });
  }

  // o gancho do teste: em que pé a festa está, e quem está onde
  casca.group.userData.salao = {
    festa: () => festa,
    luz: () => luz,
    porta: () => abertura,
    lustre: () => lustre.acesas,
    walter: () => ({ x: walter.x, z: walter.z, ronda: iRonda, servindo }),
    convidados: () => todos.map((b) => ({ peca: b.group.userData.peca as string, x: b.x, z: b.z, y: b.group.position.y, giro: b.group.rotation.y })),
  };
}
