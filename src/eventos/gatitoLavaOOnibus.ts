import * as THREE from 'three';
import type { WorldBuilder } from '../world/WorldBuilder';
import { Gatito } from '../entities/bichos/Gatito';
import { caixote } from '../world/props';
import { poca } from '../world/estrada';
import { fundir } from '../world/fundir';
import { ARI, RENAN } from '../characters/cast';
import { BolhasDeSabao, baldeDeEspuma, carrinhoDeMangueira, espumaNaLataria, mangueiraEnroladaNoChao, pistolaDeMangueira } from '../world/lavagemDoOnibus';
import { MEMORIA_DO_MUTIRAO, depuracaoDoMutirao, mutiraoDaLavagem } from './mutiraoDaLavagem';
import { relogioDaCena } from './bebitoMobile/presente';

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

  const pocaNoChao = w.add(w.place(poca(5), x + 0.5, 0, face + 0.7));
  pocaNoChao.scale.set(0.36, 1, 0.3);
  const pilha = new THREE.Group();
  pilha.add(w.place(caixote(0.56, 0.44), 0, 0, 0, 0.08));
  // o de cima, um tico menor e torto (pilha de quem improvisou)
  pilha.add(w.place(caixote(0.5, 0.44), 0.02, 0.44, -0.01, -0.12));
  w.add(fundir(w.place(pilha, CAIXOTE.x, 0, CAIXOTE.z)));
  w.add(fundir(w.place(baldeDeEspuma(), BALDE.x, 0, BALDE.z, 0.4)));
  w.blockBox(x + 0.32, face + 0.4, 0.66, 0.36);
  // o CARRINHO DA MANGUEIRA, do outro lado dos caixotes, e a ponta da mangueira enrolada no chão com a pistola em cima
  const carrinho = w.place(carrinhoDeMangueira(), x - 0.98, 0, face + 0.42, 0.3);
  carrinho.updateMatrixWorld(true);
  const saidaDaMangueira = new THREE.Vector3();
  carrinho.getObjectByName('saida')?.getWorldPosition(saidaDaMangueira);
  w.add(fundir(carrinho));
  w.blockBox(x - 0.98, face + 0.42, 0.34, 0.3);
  const mangueiraNoChao = new THREE.Group();
  mangueiraNoChao.add(mangueiraEnroladaNoChao());
  const pistolaDeitada = pistolaDeMangueira();
  pistolaDeitada.rotation.set(0, 0.9, Math.PI / 2);
  pistolaDeitada.position.set(0.12, 0.05, 0.05);
  mangueiraNoChao.add(pistolaDeitada);
  w.add(fundir(w.place(mangueiraNoChao, x - 0.92, 0, face + 0.98)));

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
  /** as bolhas que o mutirão empresta (a esponja de quem ajuda) */
  const fontesDoMutirao: THREE.Vector3[] = [];

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
  const relogio = relogioDaCena(w);
  let proximaEsfregada = 0.6;
  w.onUpdate((dt) => {
    gatito.update(dt);
    gatito.pontaDaEsponja(esponja);
    bolhas.update(dt, [...(gatito.esfregando ? [esponja, topoDoBalde, esponja] : [topoDoBalde]), ...fontesDoMutirao]);
    // o "fsh-fsh" da esponja, baixinho, só com a dupla perto
    proximaEsfregada -= dt;
    if (proximaEsfregada <= 0) {
      proximaEsfregada = 0.85 + Math.random() * 0.25;
      if (gatito.esfregando && !conversando && perto(7)) g0.som('esfrega');
    }
  });

  const falarComEle = w.interact({
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
        // O MUTIRÃO (pedido do Renan): dá para ajudar — um na esponja, o outro na mangueira
        await g.say([g.temMemoria(MEMORIA_DO_MUTIRAO)
          ? 'Mais uma rodada de mutirão? A mangueira tá ali, doida pra trabalhar.'
          : 'Querem ajudar? Tem uma esponja sobrando no balde e uma mangueira doida pra trabalhar.'], G);
        if ((await g.ask('Ajudar o Gatito a lavar o ônibus?', ['Bora ajudar!', 'Agora não'])) === 0) {
          falarComEle.enabled = false;
          try {
            await mutiraoDaLavagem(g, {
              gatito, x: CAIXOTE.x, face, saidaDaMangueira, mangueiraNoChao, poca: pocaNoChao,
              relogio, raiz: w.root, fontesDeBolhas: fontesDoMutirao,
              som: (nome) => g.som(nome),
            });
          } finally {
            falarComEle.enabled = true;
          }
        }
      } finally {
        conversando = false;
        olharOOnibus();
        gatito.esfregar(true);
      }
    },
  });

  w.root.userData.gatitoLavando = { gatito, face, esponja, mutirao: depuracaoDoMutirao };
  return gatito;
}
