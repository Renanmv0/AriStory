import './ui/style.css';
import { Game } from './core/Game';
import { SCENES, CENA_INICIAL } from './scenes';
import { ARI } from './characters/cast';

const root = document.getElementById('app');
if (!root) throw new Error('#app nao encontrado');

const game = new Game(root, SCENES, ARI);

// ?cena=villa-lobos&entrada=roda abre direto num ponto do cenario, util pra testar
const params = new URLSearchParams(location.search);
const pedida = params.get('cena') ?? undefined;
const entrada = params.get('entrada') ?? undefined;
void game.start(pedida ?? (localStorage.getItem('aristory.save.v1') ? undefined : CENA_INICIAL), entrada);
