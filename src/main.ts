import './ui/style.css';
import { Game } from './core/Game';
import { SCENES, CENA_INICIAL } from './scenes';
import { DUPLA } from './characters/cast';

const root = document.getElementById('app');
if (!root) throw new Error('#app nao encontrado');

const game = new Game(root, SCENES, DUPLA);

// ?cena=villa-lobos&entrada=roda abre direto num ponto do cenario, util pra testar
const params = new URLSearchParams(location.search);
const pedida = params.get('cena') ?? undefined;
const entrada = params.get('entrada') ?? undefined;
void game.start(pedida ?? (localStorage.getItem('aristory.save.v1') ? undefined : CENA_INICIAL), entrada);

// ?zoom=5 aproxima a camera: serve para conferir o visual dos personagens
const zoom = Number(params.get('zoom'));
if (Number.isFinite(zoom) && zoom > 0) game.setZoom(zoom);

// ?em=-2,3 posiciona a dupla num ponto qualquer, util para retrato
const em = params.get('em')?.split(',').map(Number);
if (em && em.length === 2 && em.every(Number.isFinite)) {
  const olhar = Number(params.get('olhar'));
  game.debugPlace(em[0], em[1], Number.isFinite(olhar) ? olhar : Math.PI / 4);
}

// atalho de depuracao no console do navegador
(window as unknown as { jogo: Game }).jogo = game;
