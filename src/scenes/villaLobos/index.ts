import { PALETTE as P } from '../../palette';
import type { SceneDef } from '../../core/types';
import { criarConversa } from './comum';
import { ceu, horizonte, terreno, vegetacao } from './terreno';
import { construirRodaGigante, interacaoBilheteria, ligarRodaGigante } from './rodaGigante';
import { construirLago, interacaoDoLago } from './lago';
import { construirQuadra, interacoesDaQuadra } from './quadra';
import { ligarFrisbeeJogo } from './frisbeeJogo';
import { construirMobiliario, interacaoPiquenique, sorvetes } from './mobiliario';
import { interacoesDoPonto, pontoDeOnibus, portaoEntrada, portas } from './acessos';

/**
 * Parque Villa Lobos — o cenario grande, com a roda gigante ao fundo,
 * o campinho de frisbee e o lago.
 *
 * Cada pedaco do parque mora num arquivo desta pasta:
 *
 * | arquivo         | o que mora la                                            |
 * |-----------------|----------------------------------------------------------|
 * | terreno.ts      | chao, caminhos, vegetacao, horizonte, ceu                 |
 * | rodaGigante.ts  | a roda, a praca, a bilheteria e o passeio                 |
 * | lago.ts         | o lago e os patos                                         |
 * | quadra.ts       | a quadra de frisbee e o mobiliario dela                   |
 * | frisbeeJogo.ts  | o jogo do disco (a maquina de estados do vai e volta)     |
 * | mobiliario.ts   | bancos, postes, piquenique e a sorveteria                 |
 * | acessos.ts      | portao, ponto de onibus e as portas para outras cenas     |
 * | comum.ts        | o que eles dividem: a quadra em numeros, os nomes, falas  |
 *
 * A ORDEM das chamadas em build() importa e nao deve ser trocada sem motivo:
 *
 * - o sorteio (w.rng) e deterministico e compartilhado, entao mudar a ordem
 *   reposiciona todas as arvores, predios e nuvens;
 * - cada mancha de chao (w.disc/w.patch) pega um polygonOffset na ordem em que
 *   e criada, que e o que impede o chao de piscar;
 * - os w.onUpdate rodam na ordem de registro (a roda gigante manda no zoom por
 *   ultimo), e num empate de distancia o interativo registrado primeiro vence.
 *
 * Por isso a construcao vem primeiro, na ordem geografica, e as interacoes
 * depois — do mesmo jeito que era quando tudo isto era um arquivo so.
 */
export const villaLobos: SceneDef = {
  id: 'villa-lobos',
  name: 'Parque Villa Lobos',
  subtitle: 'sábado de manhã, vento bom',
  ambient: {
    sky: P.skyDay,
    // a camera fica a 60 unidades do alvo: a nevoa so pode comecar depois disso
    fog: 0xbfe6f7,
    fogNear: 95,
    fogFar: 200,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [16, 22, 10],
  },
  spawn: { x: 0, z: 26, facing: Math.PI },
  entries: {
    portao: { x: 0, z: 26, facing: Math.PI },
    roda: { x: 0, z: -17, facing: 0 },
    clube: { x: 33, z: 13, facing: Math.PI * 1.5 },
  },

  build(w) {
    const conversa = criarConversa(w.game);

    // ------------------------------------------------------- o parque de pe
    terreno(w);
    const { wheel, bilheteria } = construirRodaGigante(w);
    construirLago(w);
    const quadra = construirQuadra(w);
    const { mesa, quiosque } = construirMobiliario(w);
    vegetacao(w);
    horizonte(w);
    ceu(w);
    const portao = portaoEntrada(w);
    const ponto = pontoDeOnibus(w);
    portas(w, portao, ponto.onibus);

    // ------------------------------------------------- o que da para fazer
    ligarFrisbeeJogo(w);
    interacoesDaQuadra(w, conversa, quadra);
    interacoesDoPonto(w, conversa, ponto);
    interacaoDoLago(w);
    sorvetes(w, conversa, quiosque);
    interacaoPiquenique(w, conversa, mesa);
    interacaoBilheteria(w, conversa, bilheteria);
    ligarRodaGigante(w, conversa, wheel);
  },
};
