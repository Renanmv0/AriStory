import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { WorldBuilder } from '../world/WorldBuilder';
import { Gatito } from '../entities/bichos/Gatito';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { caixote } from '../world/props';
import { poca } from '../world/estrada';
import { fundir } from '../world/fundir';
import { ARI, RENAN } from '../characters/cast';

/**
 * ===================================== O GATITO LAVANDO O ÔNIBUS
 *
 * Pedido do Renan (2026-11-18): "de vez em quando o Gatito aparece ao lado do ônibus dizendo que está limpando ele".
 * O ônibus escolar dos Gatitos mora estacionado de lado no lote da escola (`world/onibusEscolarDosGatitos.ts`); em
 * algumas visitas ao pátio (`CHANCE`), o Gatito está ali, EM CIMA DE UM CAIXOTE, de esponja na pata, esfregando a
 * lataria em roda — o balde de espuma do lado, a poça no asfalto, a espuma grudada no amarelo e as bolhas subindo.
 * Falar com ele: ele para, vira para a dupla e conta que está dando banho no ônibus (a primeira vez rende a memória);
 * depois volta a esfregar.
 *
 * Só depois de a dupla conhecer o Gatito (no saguão), e nunca com a aula chamada (aí ele está na Sala 1) — quem
 * decide isso é a cena. `?gatitoLavando` força ele lá, e `?semGatitoLavando` tira (é o que os testes usam).
 *
 * As falas são PROVISÓRIAS (minhas): quando o Renan mandar as dele, entram aqui literais.
 */
export const CHANCE_DO_GATITO_LAVANDO = 0.35;
export const MEMORIA_DA_LAVAGEM = 'gatito-lavando-o-onibus';

/** sorteia (ou força, pela URL) se nesta visita o Gatito está lavando o ônibus */
export function gatitoVaiLavar(): boolean {
  const q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
  if (q.has('semGatitoLavando')) return false;
  if (q.has('gatitoLavando')) return true;
  return Math.random() < CHANCE_DO_GATITO_LAVANDO;
}

const G = 'Gatito';

/** a primeira vez: ele conta o que está fazendo (rascunho meu) */
const PRIMEIRA_CONVERSA: ReadonlyArray<readonly [string, string]> = [
  [G, 'Ah, oi! Não reparem a bagunça: tô dando um banho no ônibus dos Gatitos.'],
  [ARI.name, 'Você mesmo que lava?'],
  [G, 'Diretor, professor e lavador de ônibus. Escola pequena é assim.'],
  [RENAN.name, 'Tá ficando brilhando, hein.'],
  [G, 'Ônibus do time tem que chegar brilhando no jogo. Senão o adversário nem respeita.'],
];

/** as outras vezes: uma fala curta, sorteada (rascunho meu) */
const FALAS_DA_LAVAGEM = [
  'Falta só o outro lado. E o teto. E as rodas...',
  'Cuidado com a poça, que sabão escorrega.',
  'Esse ônibus já levou o time pra cada jogo... merece um banho caprichado.',
  'Se quiserem ajudar, tem uma esponja sobrando no balde.',
  'Ônibus limpinho, time feliz.',
];

/** o balde azul de plástico, com a alça, a espuma transbordando e a esponja reserva boiando */
function baldeDeEspuma(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balde-de-espuma';
  const plastico = toon(P.baldeDeLavar);
  const perfil = [[0, 0.012], [0.15, 0.012], [0.16, 0.02], [0.185, 0.3], [0.2, 0.31], [0.205, 0.335], [0.19, 0.335], [0.175, 0.31], [0.142, 0.03], [0, 0.03]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 24), plastico));
  // os frisos do plástico em volta
  for (const y of [0.11, 0.2]) {
    const friso = new THREE.Mesh(new THREE.TorusGeometry(0.162 + (y - 0.02) * 0.08, 0.006, 5, 24).rotateX(Math.PI / 2), plastico);
    friso.position.y = y;
    g.add(friso);
  }
  // a alça de arame caída para o lado, com o pegador
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.007, 5, 20, Math.PI).rotateY(Math.PI / 2), toon(P.onibusCalota));
  alca.position.y = 0.3;
  alca.rotation.x = -1.1;
  g.add(alca);
  // a espuma: bolotas brancas transbordando (uma malha), e a esponja reserva
  const bolotas: THREE.BufferGeometry[] = [];
  let s = 7;
  const sorte = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 16; i++) {
    const a = sorte() * Math.PI * 2, r = Math.sqrt(sorte()) * 0.15, raio = 0.045 + sorte() * 0.04;
    const b = new THREE.SphereGeometry(raio, 10, 7);
    b.scale(1, 0.7, 1);
    b.translate(Math.cos(a) * r, 0.32 + (0.15 - r) * 0.25 + sorte() * 0.02, Math.sin(a) * r);
    bolotas.push(b);
  }
  // dois escorridos de espuma descendo pela borda
  for (const a of [0.6, 2.4]) {
    const gota = new THREE.CapsuleGeometry(0.022, 0.07, 3, 8);
    gota.translate(Math.cos(a) * 0.2, 0.28, Math.sin(a) * 0.2);
    bolotas.push(gota);
  }
  g.add(new THREE.Mesh(mergeGeometries(bolotas.map((b) => b.index ? b.toNonIndexed() : b).map((b) => { b.deleteAttribute('uv'); return b; })) as THREE.BufferGeometry, toon(P.espumaDeSabao)));
  const reserva = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.05, 0.11), toon(P.esponjaAmarela));
  reserva.position.set(0.05, 0.37, -0.03);
  reserva.rotation.set(0.25, 0.7, -0.15);
  g.add(reserva);
  return g;
}

/**
 * A ESPUMA GRUDADA NA LATARIA: manchas brancas achatadas contra o lado do ônibus, em volta de onde ele esfrega, e
 * escorridos descendo — numa malha só. `face` é o plano do lado (`z`), e a malha fica 1 cm para fora dele.
 */
function espumaNaLataria(x: number, y: number, face: number): THREE.Mesh {
  const pedacos: THREE.BufferGeometry[] = [];
  let s = 11;
  const sorte = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 22; i++) {
    const a = sorte() * Math.PI * 2, r = Math.sqrt(sorte()) * 0.42;
    const raio = 0.03 + sorte() * 0.05;
    const b = new THREE.SphereGeometry(raio, 9, 6);
    b.scale(1, 0.85, 0.3);
    b.translate(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 0.7, face + 0.008);
    pedacos.push(b);
  }
  // os escorridos: a espuma descendo pela lataria até o friso de baixo
  // (gotas gordas e curtas: fininhas e compridas, de longe liam como palitos soltos no ar)
  for (let i = 0; i < 4; i++) {
    const comp = 0.07 + sorte() * 0.06;
    const gota = new THREE.SphereGeometry(0.03, 8, 6);
    gota.scale(1, comp / 0.03, 0.3);
    gota.translate(x - 0.3 + i * 0.2 + sorte() * 0.06, y - 0.3 - comp * 0.6, face + 0.008);
    pedacos.push(gota);
  }
  return new THREE.Mesh(mergeGeometries(pedacos.map((b) => { b.deleteAttribute('uv'); return b; })) as THREE.BufferGeometry, toon(P.espumaDeSabao));
}

/** AS BOLHAS: um lote que sobe da esponja e do balde, balança e estoura (cresce e some) */
class BolhasDeSabao {
  readonly malha = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), toon(P.espumaDeSabao, { opacity: 0.5, glow: 0.25 }), 18);
  private readonly bolhas: Array<{ p: THREE.Vector3; vida: number; dura: number; tam: number; fase: number }> = [];
  private readonly m = new THREE.Matrix4();
  private sorte = 3;
  constructor() {
    this.malha.frustumCulled = false;
    this.malha.userData.semSombra = true;
    for (let i = 0; i < 18; i++) this.bolhas.push({ p: new THREE.Vector3(), vida: 99, dura: 1, tam: 0, fase: i });
  }
  private rnd(): number {
    return ((this.sorte = (this.sorte * 16807) % 2147483647) / 2147483647);
  }
  update(dt: number, fontes: THREE.Vector3[]): void {
    this.bolhas.forEach((b, i) => {
      b.vida += dt;
      if (b.vida > b.dura) {
        const f = fontes[i % fontes.length];
        b.p.set(f.x + (this.rnd() - 0.5) * 0.12, f.y + this.rnd() * 0.05, f.z + this.rnd() * 0.1);
        b.vida = 0;
        b.dura = 1.6 + this.rnd() * 2.2;
        b.tam = 0.018 + this.rnd() * 0.03;
        b.fase = this.rnd() * 6;
      }
      const k = b.vida / b.dura;
      b.p.y += dt * (0.16 + b.tam * 2);
      b.p.x += Math.sin(b.vida * 2.4 + b.fase) * dt * 0.08;
      b.p.z += dt * 0.05;
      // nasce pequenininha, cresce, e no fim incha um tico e some (o estouro)
      const tam = b.tam * Math.min(1, k * 5) * (k > 0.92 ? Math.max(0, 1 - (k - 0.92) * 12.5) * 1.3 : 1);
      this.m.makeScale(tam, tam, tam).setPosition(b.p);
      this.malha.setMatrixAt(i, this.m);
    });
    this.malha.instanceMatrix.needsUpdate = true;
  }
}

/**
 * Monta a lavagem ao lado do ônibus. `onibus` é o meio do lado da porta (o que fica de frente para a câmera), no
 * mundo, com a lataria virada para o `+Z`; `x` é onde, ao longo do ônibus, o Gatito esfrega.
 */
export function montarGatitoLavandoOOnibus(w: WorldBuilder, onibus: { x: number; face: number }): Gatito {
  const g0 = w.game;
  const { x, face } = onibus;
  /**
   * DOIS CAIXOTES EMPILHADOS, encostados na lataria, e o Gatito em cima, virado para o ônibus: num caixote só, de pé,
   * a esponja dele ficava abaixo do primeiro friso. Em dois, ela esfrega a 1,35 m, entre os frisos de cima, onde está a
   * espuma.
   */
  const CAIXOTE = { x, z: face + 0.34, alto: 0.88 };
  const BALDE = { x: x + 0.68, z: face + 0.42 };

  w.add(w.place(poca(5), x + 0.5, 0, face + 0.7)).scale.set(0.36, 1, 0.3);
  const pilha = new THREE.Group();
  pilha.add(w.place(caixote(0.56, 0.44), 0, 0, 0, 0.08));
  // o de cima, um tico menor e torto (pilha de quem improvisou)
  pilha.add(w.place(caixote(0.5, 0.44), 0.02, 0.44, -0.01, -0.12));
  w.add(fundir(w.place(pilha, CAIXOTE.x, 0, CAIXOTE.z)));
  w.add(fundir(w.place(baldeDeEspuma(), BALDE.x, 0, BALDE.z, 0.4)));
  w.blockBox(x + 0.32, face + 0.4, 0.66, 0.36);

  const gatito = new Gatito({ minX: CAIXOTE.x, maxX: CAIXOTE.x, minZ: CAIXOTE.z, maxZ: CAIXOTE.z });
  gatito.entrarEmServico();
  // (um palmo mais perto da lataria que o meio do caixote: é o alcance da pata até a esponja encostar)
  gatito.group.position.set(CAIXOTE.x, CAIXOTE.alto - 0.005, CAIXOTE.z - 0.17);
  gatito.group.rotation.y = Math.PI;
  /** para onde ele olha quando esfrega: a lataria bem na frente dele */
  const olharOOnibus = (): void => gatito.encarar(CAIXOTE.x, face - 3);
  olharOOnibus();
  gatito.esfregar(true);
  w.add(gatito.group);

  // a espuma na lataria: em volta da altura da esponja (o caixote mais o Gatito de pé)
  w.add(espumaNaLataria(x - 0.05, 1.4, face));

  const bolhas = new BolhasDeSabao();
  w.add(bolhas.malha);
  const esponja = new THREE.Vector3();
  const topoDoBalde = new THREE.Vector3(BALDE.x, 0.42, BALDE.z);

  const perto = (raio: number): boolean => {
    const p = g0.playerPosition();
    return Math.hypot(p.x - CAIXOTE.x, p.z - CAIXOTE.z) < raio;
  };
  gatito.aoSoar = () => {
    if (perto(10)) g0.som('miado');
  };
  gatito.aoFazerSixSeven = () => {
    if (perto(12)) g0.toast('Gatito: Six seven!', '🐱');
  };

  let conversando = false;
  let proximaEsfregada = 0.6;
  w.onUpdate((dt) => {
    gatito.update(dt);
    gatito.pontaDaEsponja(esponja);
    bolhas.update(dt, gatito.esfregando ? [esponja, topoDoBalde, esponja] : [topoDoBalde]);
    // o "fsh-fsh" da esponja, baixinho, só com a dupla perto
    proximaEsfregada -= dt;
    if (proximaEsfregada <= 0) {
      proximaEsfregada = 0.85 + Math.random() * 0.25;
      if (gatito.esfregando && !conversando && perto(7)) g0.som('esfrega');
    }
  });

  w.interact({
    id: 'escola-patio:gatito-lavando',
    x: CAIXOTE.x + 0.2, z: face + 1.05, radius: 1.5,
    label: 'Falar com o Gatito', icon: '🐱',
    highlight: gatito.group,
    priority: 2,
    onInteract: async (g) => {
      conversando = true;
      gatito.esfregar(false);
      const eu = g.playerPosition();
      gatito.encarar(eu.x, eu.z);
      g.som('miado');
      try {
        if (!g.temMemoria(MEMORIA_DA_LAVAGEM)) {
          for (const [quem, texto] of PRIMEIRA_CONVERSA) await g.say([texto], quem);
          gatito.sixSeven();
          g.unlock({
            id: MEMORIA_DA_LAVAGEM,
            title: 'O ônibus brilhando',
            place: 'Escola do Gatito',
            note: 'No estacionamento da escola, o Gatito estava em cima de um caixote, de esponja na pata, dando banho no ônibus dos Gatitos. Diretor, professor e lavador de ônibus.',
            icon: '🧽',
          });
        } else {
          await g.say([FALAS_DA_LAVAGEM[Math.floor(Math.random() * FALAS_DA_LAVAGEM.length)]], G);
        }
      } finally {
        conversando = false;
        olharOOnibus();
        gatito.esfregar(true);
      }
    },
  });

  w.root.userData.gatitoLavando = { gatito, face, esponja };
  return gatito;
}
