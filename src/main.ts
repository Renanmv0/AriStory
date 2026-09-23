import type * as THREE from 'three';
import './ui/style.css';
import { Game } from './core/Game';
import { SCENES, CENA_INICIAL } from './scenes';
import { DUPLA } from './characters/cast';
import { CLIMAS, Musica } from './audio/musica';
import { EFEITOS } from './audio/efeitos';
import { ITENS } from './world/itens';
import { MEMORIAS } from './world/memoriasData';
import { PRAGAS } from './world/bichosDoJardim';
import { regadorDeJardim } from './world/regador';
import {
  espantalho, tabuasPregadas, cadeadoDePortao, toldoDeCanteiro, pimenteiras, aspersor, dioneia, cerquinha, picole,
} from './world/props';
import { CARTAS, CONSOLOS } from './minigames/jardim/cartas';
import { cartaNaTela } from './minigames/jardim/tela';

const root = document.getElementById('app');
if (!root) throw new Error('#app nao encontrado');

const game = new Game(root, SCENES, DUPLA, CENA_INICIAL);

// ?cena=villa-lobos&entrada=roda abre direto num ponto do cenario, util pra testar
const params = new URLSearchParams(location.search);
const pedida = params.get('cena') ?? undefined;
const entrada = params.get('entrada') ?? undefined;
// sem cena pedida o jogo continua de onde parou; sem progresso, começa na casa
const comecou = game.start(pedida, entrada);

// ?cena=estufa&treino=gotas liga o treino das gotas e das cartas do jardim: a
// rodada ainda não existe, e este é o jeito de VER as gotas caindo e a tela das
// três cartas com o sorteio de verdade. A estufa publica o treino; aqui só se
// aperta o botão, como os outros atalhos desta página.
if (params.get('treino') === 'gotas') {
  void comecou.then(() => {
    const raiz = (game as unknown as { current?: { world: { root: THREE.Object3D } } }).current;
    const treino = raiz?.world.root.userData.treinoDeGotas as (() => void) | undefined;
    treino?.();
  });
}

// ?cena=estufa&rodada=1 começa a rodada do jardim direto (sem a conversa com
// a Josefina); ?cena=estufa&jato=gota-gelada,poca monta a vitrine do jato, com
// as cartas pedidas na mão e três lagartejos parados na frente da dupla.
if (params.get('rodada') || params.get('jato') !== null) {
  void comecou.then(() => {
    const raiz = (game as unknown as { current?: { world: { root: THREE.Object3D } } }).current;
    const dados = raiz?.world.root.userData ?? {};
    const cartas = (params.get('cartas') ?? params.get('jato') ?? '').split(',').filter(Boolean);
    // &praga=preguipolvo troca os bichos da vitrine (a Água morna só aparece em bicho grande)
    const praga = params.get('praga') ?? undefined;
    if (params.get('jato') !== null) (dados.vitrineDoJato as ((c: string[], p?: string) => void) | undefined)?.(cartas, praga);
    else (dados.comecarRodada as ((c: string[]) => void) | undefined)?.(cartas);
  });
}

// ?zoom=5 aproxima a camera: serve para conferir o visual dos personagens
const zoom = Number(params.get('zoom'));
if (Number.isFinite(zoom) && zoom > 0) game.setZoom(zoom);

// ?em=-2,3 posiciona a dupla num ponto qualquer, util para retrato
const em = params.get('em')?.split(',').map(Number);
if (em && em.length === 2 && em.every(Number.isFinite)) {
  const olhar = Number(params.get('olhar'));
  game.debugPlace(em[0], em[1], Number.isFinite(olhar) ? olhar : Math.PI / 4);
}

// atalhos de depuracao no console do navegador. O `aristoryAudio` existe para
// scripts/musica.mjs renderizar a música num OfflineAudioContext: o .wav sai da
// mesma classe que toca no jogo, não de uma cópia.
(window as unknown as { jogo: Game }).jogo = game;
(window as unknown as { aristoryAudio: unknown }).aristoryAudio = { Musica, CLIMAS, EFEITOS };
// as peças que as cartas do jardim põem na estufa: o teste fotografa cada uma
(window as unknown as { aristoryPecasDoJardim: unknown }).aristoryPecasDoJardim = {
  espantalho, tabuasPregadas, cadeadoDePortao, toldoDeCanteiro, pimenteiras, aspersor, dioneia, cerquinha, picole,
};
// o catalogo por id, para o console e para os testes darem um item de verdade
// ao jogo em vez de inventarem uma ficha parecida
(window as unknown as { aristoryItens: unknown }).aristoryItens = Object.fromEntries(
  Object.values(ITENS).map((i) => [i.id, i]),
);
// o acervo do quadro de memorias, para o teste conferir quantas pecas existem
// sem ter que contar os pontinhos da tela
(window as unknown as { aristoryMemorias: unknown }).aristoryMemorias = MEMORIAS.map(
  (m) => ({ id: m.id, titulo: m.titulo }),
);
// as pragas da estufa, para o `scripts/pragas.mjs` montar e fotografar as seis
// sem precisar que elas ja estejam numa cena — elas sao do minigame, que ainda
// nao existe, e peca que ninguem consegue OLHAR nao da para ajustar
(window as unknown as { aristoryPragas: unknown }).aristoryPragas = PRAGAS;
// a RECEITA do regador, pelo mesmo motivo: ele e a unica peca do jogo que muda
// de cara com as melhorias, e a unica forma de conferir que uma carta mexeu
// mesmo no modelo e montar as duas versoes lado a lado e medir
(window as unknown as { aristoryRegador: unknown }).aristoryRegador = regadorDeJardim;
// o baralho do jardim JÁ NO FORMATO DA TELA, para o `scripts/gotas.mjs` montar
// uma mesa de cada raridade: o sorteio de verdade não garante uma lendária na
// tela, e uma moldura que ninguém vê é uma moldura que ninguém conferiu
(window as unknown as { aristoryCartas: unknown }).aristoryCartas = [...CARTAS, ...CONSOLOS].map(cartaNaTela);
