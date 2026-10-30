import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { tree } from '../../world/props';
import { fundir } from '../../world/fundir';
import { luzDoMomento } from '../../world/noite';
import { LoteDeAboboras } from '../../world/halloween/abobora';
import { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import { BandoDeMorcegos } from '../../world/halloween/morcegos';
import {
  CASINHA_TORTA, CasinhaTorta, NevoaBaixa, PORTAO_LARANJA, PortaoLaranja,
  caminhoDePedrinhas, cerquinhaTorta, galho, matoDenso,
} from '../../world/halloween/casinhaDaAbobora';
import { CHAVE_DA_CACA, PARADAS_DA_CACA } from '../../world/halloween/mapinha';
import { BALAS_DA_PORTA, CHAVE_DAS_BALAS } from './caca';
import { faseDoHalloween } from './fase';
import { NOITE_DA_FESTA } from './ceu';
import { CENA_DE_DENTRO } from './dentroDaCasinha';

/*
 * A CASINHA DA ABÓBORA, por fora (`docs/HALLOWEEN.md`, §7.1, A e B — a
 * parte 6a da etapa 6).
 *
 * - O PORTÃO LARANJA no parque: na ponta norte do tapume da praça da roda
 *   (`x = −11`), virado para a praça, com a cerquinha torta dos dois lados e
 *   o MATO fechando atrás. É por ele que o Walter some quando larga a
 *   barraca (a primeira dica do final): a folha abre, ele entra no mato, e
 *   ela fecha. A fechadura de abóbora acende quando a cesta passa das 25
 *   balas. Abrir pede a pista do Noel (a última parada) e a cesta cheia.
 *
 *   ONDE, E POR QUÊ AQUI: bem atrás da roda (onde o Walter sumia antes) o aro
 *   e as gôndolas tapam tudo na câmera de sempre, e mais à esquerda os
 *   pinheiros do piquenique tapam o resto. Na ponta do tapume, virado para
 *   a câmera (a diagonal), é o lugar mais "atrás da roda" que ela enxerga
 *   inteiro — rente ao tapume e de lado, as gôndolas de baixo o cobriam.
 *
 * - A CLAREIRA (`scenes/casinhaDaAbobora.ts` monta por aqui): de noite, com o
 *   mesmo céu da festa; o mesmo portão laranja na entrada, o caminho de
 *   pedrinhas entre abóboras gigantes e lanternas, luzinhas de árvore em
 *   árvore, morceguinhos, a névoa rente ao chão — e no fundo a CASINHA: a
 *   abóbora gigante (o salão, de cara recortada e APAGADA: a surpresa está
 *   lá dentro) com a casinha torta grudada na frente (o corredor e a
 *   cozinha), a chaminé soltando fumacinha. A porta é a etapa 6b.
 */

/** onde fica o portão no parque: a frente para a praça (`+X`) */
export const PORTAO_NO_PARQUE = { x: -12.1, z: -26.4, giro: Math.PI / 4 } as const;
/** de onde se abre o portão, e onde quem volta da clareira aparece */
export const FRENTE_DO_PORTAO = { x: -11.46, z: -25.76 } as const;
/** o Walter entra no mato por aqui, e some */
export const ATRAS_DO_PORTAO = { x: -13.09, z: -27.39 } as const;

/** a dupla já passou pelo portão (daí em diante, ele abre direto) */
export const FLAG_PASSOU_DO_PORTAO = 'halloween:casinha:passou-do-portao';
/** a dupla já entrou na casinha uma vez (daí em diante a porta abre direto) */
export const FLAG_ENTROU = 'halloween:casinha:entrou';
/** o comentário de quem chega na clareira, uma vez */
const FLAG_VIU_A_CASINHA = 'halloween:viu:casinha';

export const CENA_DA_CASINHA = 'casinha-da-abobora';

/** um ponto de `(lx, lz)` no referencial de uma peça em `(x, z)` girada `giro` */
function noMundo(x: number, z: number, giro: number, lx: number, lz: number): { x: number; z: number } {
  const c = Math.cos(giro);
  const s = Math.sin(giro);
  return { x: x + lx * c + lz * s, z: z - lx * s + lz * c };
}

/** quem joga diz `@eu`, quem acompanha diz `@par` */
async function conversa(api: GameAPI, falas: ReadonlyArray<readonly ['@eu' | '@par', string]>): Promise<void> {
  for (const [quem, texto] of falas) await api.say([texto], quem === '@eu' ? api.playerName() : api.companionName());
}

/** passar pelo portão: a folha abre, um respiro, e a cena troca */
async function atravessar(api: GameAPI, portao: PortaoLaranja, para: string, entrada: string): Promise<void> {
  api.lockPlayer(true);
  portao.abrir(true);
  api.som('porta');
  await api.wait(1.1);
  api.lockPlayer(false);
  api.goTo(para, entrada);
}

/**
 * O PORTÃO, a cerquinha e o mato do parque. Devolve o portão (o Walter o
 * abre quando passa) — a cena chama só na noite da festa e depois dela.
 */
export function montarOPortaoLaranja(w: WorldBuilder): PortaoLaranja {
  const g0 = w.game;
  const { x, z, giro } = PORTAO_NO_PARQUE;
  const portao = new PortaoLaranja();
  w.add(w.place(portao.group, x, 0, z, giro));
  // as duas alas de cerquinha: da ponta do tapume até o mourão da esquerda, e
  // do mourão da direita para dentro do mato. Cada ala vai de `a` até `b`, com
  // a frente (as ripas) para o lado da praça
  const lado = (sinal: number): { x: number; z: number } =>
    ({ x: x + sinal * PORTAO_LARANJA.meiaLargura * Math.cos(giro), z: z - sinal * PORTAO_LARANJA.meiaLargura * Math.sin(giro) });
  const alas: Array<[{ x: number; z: number }, { x: number; z: number }, number]> = [
    [{ x: -11.05, z: -24.55 }, lado(-1), 1],
    [lado(1), { x: -12.9, z: -29.3 }, 2],
    // e do mourão da esquerda até o mato: sem ela, dava para contornar o portão pelo gramado
    [lado(-1), { x: -13.6, z: -27.25 }, 3],
  ];
  for (const [a, b, sem] of alas) {
    const comp = Math.hypot(b.x - a.x, b.z - a.z);
    const rumo = Math.atan2(-(b.z - a.z), b.x - a.x);
    w.add(w.place(cerquinhaTorta(comp, sem), a.x, 0, a.z, rumo));
    w.blockBox((a.x + b.x) / 2, (a.z + b.z) / 2, comp / 2, 0.12, -rumo);
  }
  // o mato atrás do portão: um metro para trás do plano da folha (mais perto, os
  // arbustos grandes cresciam por cima dela), longe da abóbora inflável
  w.add(fundir(w.place(matoDenso(3.0, 3.2, 7, 1.3, [1.6, 2.4]), -14.6, 0, -28.8)));
  w.blockBox(-14.6, -28.8, 1.5, 1.6);
  w.blockBox(x, z, PORTAO_LARANJA.meiaLargura, 0.22, -giro);

  const pista = (api: GameAPI): boolean => api.stat(CHAVE_DA_CACA) >= PARADAS_DA_CACA.length;
  const balas = (api: GameAPI): number => api.stat(CHAVE_DAS_BALAS);

  w.interact({
    id: 'halloween:portao-laranja',
    x: FRENTE_DO_PORTAO.x, z: FRENTE_DO_PORTAO.z, radius: 1.5,
    label: 'Abrir a porta laranja', icon: '🎃',
    priority: 3,
    highlight: portao.group,
    onInteract: async (api) => {
      const fase = faseDoHalloween(api);
      if (fase === 'depois' || api.flag(FLAG_PASSOU_DO_PORTAO)) {
        await atravessar(api, portao, CENA_DA_CASINHA, 'do-parque');
        return;
      }
      if (!pista(api)) {
        api.som('clique');
        await conversa(api, [
          ['@eu', 'Tá trancado… E a fechadura é uma abóbora!'],
          ['@par', 'Deve ter a ver com o mapinha. Vamos seguir as pistas.'],
        ]);
        return;
      }
      const n = balas(api);
      if (n < BALAS_DA_PORTA) {
        api.som('clique');
        await conversa(api, [
          ['@eu', `A fechadura nem se mexe. ${n} balas na cesta…`],
          ['@par', `E a porta pede ${BALAS_DA_PORTA}. Faltam ${BALAS_DA_PORTA - n}: tem abóbora escondida pelo parque ainda.`],
        ]);
        return;
      }
      await conversa(api, [
        ['@par', 'A abóbora da fechadura acendeu!'],
        ['@eu', 'A cesta tá cheia… Vamos ver o que tem do outro lado.'],
      ]);
      api.setFlag(FLAG_PASSOU_DO_PORTAO);
      await atravessar(api, portao, CENA_DA_CASINHA, 'do-parque');
    },
  });

  // a fechadura acende com a cesta cheia; e a folha anda no relógio do jogo
  w.onUpdate((dt) => {
    portao.acender(g0.stat(CHAVE_DAS_BALAS) >= BALAS_DA_PORTA);
    portao.update(dt);
  });
  return portao;
}

// ======================================================= a clareira da Casinha

/** a abóbora gigante (o salão) e para onde a cara dela olha */
const ABOBORA_DA_CASA = { x: -1.5, z: -5.5, raio: 4.2, giro: 0.3 } as const;
/** a casinha torta, no referencial da abóbora: na frente, à direita da cara */
const CASINHA_NA_ABOBORA = { x: 3.7, z: 2.4 } as const;
/** o portão de entrada, no canto de cá da clareira (a frente para dentro, `+X`) */
const PORTAO_DA_CLAREIRA = { x: -11.0, z: 2.5, giro: Math.PI / 2 } as const;

/** as entradas da clareira (a cena registra) */
/** a frente da porta da casinha torta, no mundo da clareira (quem sai de dentro aparece aqui) */
const FRENTE_DA_CASINHA = (() => {
  const c = noMundo(ABOBORA_DA_CASA.x, ABOBORA_DA_CASA.z, ABOBORA_DA_CASA.giro, CASINHA_NA_ABOBORA.x, CASINHA_NA_ABOBORA.z);
  const fp = CasinhaTorta.frenteDaPorta();
  return noMundo(c.x, c.z, ABOBORA_DA_CASA.giro, fp.x, fp.z + 0.2);
})();

export const ENTRADAS_DA_CLAREIRA = {
  'do-parque': { x: -9.9, z: 2.5, facing: Math.PI / 2 },
  // saindo da casinha: um passo na frente da porta, de costas para ela
  'da-casinha': { x: FRENTE_DA_CASINHA.x, z: FRENTE_DA_CASINHA.z, facing: ABOBORA_DA_CASA.giro },
} as const;

/**
 * A CLAREIRA DA CASINHA DA ABÓBORA: o chão, a abóbora gigante e a casinha
 * torta, o caminho de pedrinhas, as abóboras do caminho, as árvores do
 * fundo, o mato da beira, as luzinhas, os morceguinhos, a névoa e o céu.
 */
export function montarAClareira(w: WorldBuilder): void {
  const g0 = w.game;
  w.ground({ width: 70, depth: 70, color: P.chaoDaClareira });
  w.setBounds(-11.6, -11.4, 9.0, 8.2);

  // ---------------------------------------------- a abóbora gigante e a casinha
  const A = ABOBORA_DA_CASA;
  const casa = new LoteDeAboboras().por({ x: A.x, z: A.z, raio: A.raio, cara: 'sorriso', giro: A.giro });
  const aboboraDaCasa = w.add(casa.montar());
  aboboraDaCasa.name = 'abobora-da-casa';
  aboboraDaCasa.userData.peca = 'abobora-da-casa';
  w.blockCircle(A.x, A.z, A.raio - 0.1);

  const c = noMundo(A.x, A.z, A.giro, CASINHA_NA_ABOBORA.x, CASINHA_NA_ABOBORA.z);
  const casinha = new CasinhaTorta();
  w.add(w.place(casinha.group, c.x, 0, c.z, A.giro));
  w.blockBox(c.x, c.z, CASINHA_TORTA.largura / 2 + 0.1, CASINHA_TORTA.fundo / 2 + 0.1, -A.giro);
  const fp = CasinhaTorta.frenteDaPorta();
  const portaDaCasinha = noMundo(c.x, c.z, A.giro, fp.x, fp.z);

  // ---------------------------------------------- o portão de entrada, a cerquinha e o mato de trás
  const E = PORTAO_DA_CLAREIRA;
  const portao = new PortaoLaranja();
  portao.acender(true);
  w.add(w.place(portao.group, E.x, 0, E.z, E.giro));
  w.add(w.place(cerquinhaTorta(3.0, 3), E.x - 0.05, 0, E.z + 3.95, E.giro));
  w.add(w.place(cerquinhaTorta(3.0, 4), E.x - 0.05, 0, E.z - 0.95, E.giro));
  w.add(fundir(w.place(matoDenso(3.0, 12, 11, 1.2, [1.2, 1.9]), E.x - 2.8, 0, E.z)));
  w.interact({
    id: 'halloween:clareira:voltar',
    x: E.x + 0.95, z: E.z, radius: 1.3,
    label: 'Voltar pro parque', icon: '🎃',
    highlight: portao.group,
    onInteract: (api) => atravessar(api, portao, 'villa-lobos', 'do-portao-laranja'),
  });

  // ---------------------------------------------- o caminho de pedrinhas até a porta
  const pontos = [
    new THREE.Vector3(E.x + 1.0, 0, E.z),
    new THREE.Vector3(-7.5, 0, 3.2),
    new THREE.Vector3(-4.4, 0, 3.0),
    new THREE.Vector3(-1.4, 0, 2.0),
    new THREE.Vector3(1.2, 0, 0.7),
    new THREE.Vector3(portaDaCasinha.x, 0, portaDaCasinha.z),
  ];
  w.add(caminhoDePedrinhas(pontos, 0.6, 2));
  const curva = new THREE.CatmullRomCurve3(pontos);

  // ---------------------------------------------- as abóboras: as acesas do caminho e as gigantes de enfeite
  const acesas = new LoteDeAboboras();
  const caras = ['sorriso', 'piscando', 'susto', 'dentinho'] as const;
  for (let i = 0; i < 8; i++) {
    const t = 0.08 + (i / 7) * 0.78;
    const p = curva.getPointAt(t);
    const tg = curva.getTangentAt(t);
    const lado = i % 2 ? 1 : -1;
    const x = p.x - tg.z * lado * 1.15;
    const z = p.z + tg.x * lado * 1.15;
    // a cara olha para o caminho, um tico para a câmera
    const giro = Math.atan2(p.x - x, p.z - z) * 0.5 + Math.PI / 8;
    acesas.por({ x, z, tamanho: i % 3 === 0 ? 'grande' : 'media', cara: caras[i % caras.length], giro });
  }
  const loteAceso = w.add(acesas.montar({ acesas: true }));
  loteAceso.name = 'aboboras-do-caminho';

  const gigantes = new LoteDeAboboras();
  const enfeite: Array<[number, number, number]> = [
    [-7.6, -3.6, 1.1], [-5.2, -9.4, 0.9], [5.6, -9.6, 1.3], [7.0, 1.4, 0.85], [-8.6, 6.0, 0.9], [3.6, 5.6, 0.7], [7.4, -4.6, 1.0],
  ];
  enfeite.forEach(([x, z, r], i) => {
    gigantes.por({ x, z, raio: r, giro: i * 1.3, cor: i % 3 === 1 ? P.aboboraClara : P.abobora });
    // e as pequenas em volta de cada gigante
    for (let k = 0; k < 3; k++) {
      const a = i * 2.1 + k * 2.2;
      gigantes.por({ x: x + Math.cos(a) * (r + 0.4), z: z + Math.sin(a) * (r + 0.4), tamanho: k === 0 ? 'media' : 'pequena', simples: true, giro: a, tomba: k === 2 ? 0.4 : 0 });
    }
    w.blockCircle(x, z, r * 0.95);
  });
  w.add(gigantes.montar());

  // ---------------------------------------------- as árvores do fundo (só onde não tapam a clareira)
  const arvores: Array<[number, number, 'redonda' | 'pinheiro', number]> = [
    [-14.6, -10.6, 'pinheiro', 1.25], [-15.6, -4.2, 'redonda', 1.1], [-15.2, 7.4, 'pinheiro', 1.15],
    [-9.2, -14.6, 'redonda', 1.2], [-3.2, -15.8, 'pinheiro', 1.35], [3.0, -15.0, 'redonda', 1.15],
    [8.6, -14.2, 'pinheiro', 1.2], [12.4, -10.4, 'redonda', 1.05], [-15.8, 1.6, 'redonda', 0.95],
  ];
  arvores.forEach(([x, z, tipo, escala], i) => w.add(w.place(tree(tipo, escala, 0.17 + i * 0.11), x, 0, z)));

  // ---------------------------------------------- o mato baixo da beira de cá (baixo: não tapa a dupla)
  w.add(fundir(w.place(matoDenso(20, 2.0, 21, 0.75), -1.0, 0, 9.6)));
  w.add(fundir(w.place(matoDenso(2.2, 18, 22, 0.75), 10.2, 0, -1.0)));

  // ---------------------------------------------- as estacas com lanterna ao longo do caminho, e as luzinhas
  const pendurados = new EnfeitesDePendurar();
  const madeira = toon(P.galhoSeco);
  for (let i = 0; i < 4; i++) {
    const t = 0.18 + i * 0.22;
    const p = curva.getPointAt(t);
    const tg = curva.getTangentAt(t);
    const lado = i % 2 ? -1 : 1;
    const x = p.x - tg.z * lado * 1.7;
    const z = p.z + tg.x * lado * 1.7;
    const alto = 2.3 + (i % 2) * 0.2;
    // a estaca de galho torto, com o gancho virado para o caminho
    const base = new THREE.Vector3(x, -0.1, z);
    const meio = new THREE.Vector3(x + 0.06, alto * 0.55, z - 0.04);
    const topo = new THREE.Vector3(x - 0.04, alto, z + 0.03);
    const gancho = new THREE.Vector3(x + (p.x - x) * 0.18, alto + 0.08, z + (p.z - z) * 0.18);
    const estaca = new THREE.Mesh(galho([base, meio, topo, gancho], 0.05, 0.025, 14, 6), madeira);
    w.add(estaca);
    w.blockCircle(x, z, 0.15);
    pendurados.lanterna(gancho.x, gancho.y - 0.02, gancho.z, i % 2 ? P.lanternaLaranja : P.halloweenRoxo);
  }
  // as luzinhas: de árvore em árvore pelo fundo. Entre as estacas NÃO: o caminho
  // faz curva, e qualquer fio entre elas passava por cima dele, na altura da cabeça
  const fundo = [
    new THREE.Vector3(-14.0, 3.4, 6.6), new THREE.Vector3(-14.6, 3.6, -3.6), new THREE.Vector3(-13.8, 3.8, -10.0),
    new THREE.Vector3(-8.8, 3.9, -13.8), new THREE.Vector3(-3.2, 4.2, -14.8), new THREE.Vector3(2.8, 4.0, -14.2),
    new THREE.Vector3(8.2, 3.8, -13.4), new THREE.Vector3(11.6, 3.5, -9.8),
  ];
  for (let i = 0; i < fundo.length - 1; i++) {
    pendurados.luzinhas(fundo[i], fundo[i + 1], { barriga: 0.5 });
    const meio = fundo[i].clone().lerp(fundo[i + 1], 0.5);
    pendurados.morcego(meio.x, meio.y - 0.45, meio.z, i * 0.7);
  }
  // morceguinhos de papel também na beira da casinha
  const beira = noMundo(c.x, c.z, A.giro, CASINHA_TORTA.largura / 2 + 0.2, CASINHA_TORTA.fundo / 2 + 0.2);
  pendurados.morcego(beira.x, 2.25, beira.z, 0.4, 1.1);
  w.add(pendurados.montar());
  const luz = pendurados.luzDasLuzinhas(0.75, 0.02);
  if (luz) w.add(luz);
  const luzLanternas = pendurados.luzDasLanternas(0.7, 0.02);
  if (luzLanternas) w.add(luzLanternas);

  // ---------------------------------------------- os morcegos voando em volta da abóbora, e a névoa
  const bando = new BandoDeMorcegos(7, { raio: [4.5, 7], altura: [6.5, 9.5] });
  bando.group.position.set(A.x, 0, A.z);
  w.add(bando.group);
  const nevoa = new NevoaBaixa({ minX: -11, maxX: 9, minZ: -11, maxZ: 8 }, 12, 3);
  w.add(nevoa.group);

  // ---------------------------------------------- a porta da casinha: bater, e ela abre sozinha
  let abrindo = 0;
  let abrir = false;
  w.interact({
    id: 'halloween:casinha:porta',
    x: portaDaCasinha.x, z: portaDaCasinha.z, radius: 1.3,
    label: 'Entrar na casinha', icon: '🚪',
    highlight: casinha.porta,
    onInteract: async (api) => {
      api.lockPlayer(true);
      if (!api.flag(FLAG_ENTROU)) {
        api.som('martelo');
        await conversa(api, [['@eu', 'Toc, toc, toc…']]);
        await api.wait(0.8);
        await conversa(api, [['@par', 'Ninguém atende.']]);
        abrir = true;
        api.som('porta');
        await api.wait(1.0);
        await conversa(api, [['@eu', 'A porta abriu sozinha…'], ['@par', 'Vamos juntos. De mãos dadas.']]);
        api.setFlag(FLAG_ENTROU);
      } else {
        abrir = true;
        api.som('porta');
        await api.wait(0.7);
      }
      api.lockPlayer(false);
      api.goTo(CENA_DE_DENTRO, 'da-clareira');
    },
  });
  w.onUpdate((dt) => {
    if (abrir) abrindo = Math.min(1, abrindo + dt * 1.2);
    const k = abrindo * abrindo * (3 - 2 * abrindo);
    // a folha gira para dentro da casinha (o −Z dela)
    casinha.porta.rotation.y = 1.4 * k;
  });

  // ---------------------------------------------- o comentário de quem chega
  let falando = false;
  w.onUpdate(() => {
    if (falando || g0.flag(FLAG_VIU_A_CASINHA) || g0.emDialogo()) return;
    const p = g0.playerPosition();
    if (p.x < -8.2) return;
    falando = true;
    g0.setFlag(FLAG_VIU_A_CASINHA);
    void (async () => {
      await conversa(g0, [
        ['@par', 'Que casinha é essa? Ela é… uma abóbora!'],
        ['@eu', 'Uma abóbora gigante. E tá tudo apagado lá dentro.'],
        ['@par', 'Só a casinha da frente tem luz. Vamos bater?'],
      ]);
      falando = false;
    })();
  });

  // ---------------------------------------------- o céu da festa e o relógio
  let pintado = false;
  let tempo = 0;
  w.onUpdate((dt) => {
    if (!pintado) {
      // no primeiro quadro, e não no `build`: o motor põe o céu da cena depois de montá-la
      pintado = true;
      g0.luzDoCeu(luzDoMomento(NOITE_DA_FESTA));
    }
    tempo += dt;
    acesas.tremer(tempo);
    casinha.update(dt);
    portao.update(dt);
    pendurados.update(dt);
    bando.update(dt);
    nevoa.update(dt);
  });
}
