import type { GameAPI } from '../../core/types';
import { ARI, RENAN } from '../../characters/cast';
import type { CameraDeDentro } from './cameraDeDentro';
import type { CelularDeJogo } from '../../world/celularDeJogo';

/**
 * ============================================ O QUE SE FAZ DE CARONA
 *
 * A visão do passageiro na viagem (`docs/BEBITO-MOBILE-DENTRO.md`, D5): com o carro no
 * piloto automático, a câmera acompanha quem está no banco do passageiro. O menu
 * oferece as ações desse personagem (a escolha do Renan):
 *
 *  - o ARI: cantarolar "Danza Kuduro", elogiar o Renan, encostar no ombro dele;
 *  - o RENAN: jogar Brawl Stars no celular, elogiar o Ari, encostar no ombro dele.
 *
 * As palavras são MINHAS e provisórias (o Renan reescreve: a fala dele entra literal). O
 * que se vê normalmente é a câmera do passageiro; encostar no ombro mostra os dois de frente;
 * jogar no celular põe o celular na frente dos olhos, com a tela do joguinho andando. Os
 * corações saem da cabeça do passageiro (`g.soltarCoracoes`) — os da VIAGEM continuam sendo
 * só de quem dirige.
 */

export interface PalcoDoPassageiro {
  g: GameAPI;
  /** quem ocupa o banco do passageiro, independentemente de quem o jogador controla */
  quem: 'jogador' | 'parceiro';
  camera: CameraDeDentro;
  celular: CelularDeJogo;
  /** espera no relógio do jogo (o teste acelera) */
  esperar: (s: number) => Promise<void>;
  /** ao chegar, termina a interação corrente antes de abrir as falas da chegada */
  terminou: () => boolean;
}

const nomeDoPassageiro = (p: PalcoDoPassageiro): string => p.quem === 'jogador' ? p.g.playerName() : p.g.companionName();
const nomeDoMotorista = (p: PalcoDoPassageiro): string => p.quem === 'jogador' ? p.g.companionName() : p.g.playerName();

const vezes: Record<string, number> = {};
/** a próxima fala de uma lista (cada vez, uma diferente) */
const proxima = <T>(chave: string, lista: readonly T[]): T => {
  const i = vezes[chave] ?? 0;
  vezes[chave] = i + 1;
  return lista[i % lista.length];
};

const ELOGIOS_DO_ARI = [
  'Você dirige tão bem, sabia?',
  'Esse carro ficou a sua cara.',
  'Tenho tanta sorte de ir de carona com você.',
] as const;
const ELOGIOS_DO_RENAN = [
  'Quando você canta no carro, a viagem fica melhor.',
  'Sabia que você é a melhor pessoa pra viajar junto?',
  'Eu escolheria esse carro de novo só pra ir contigo.',
] as const;
const RESPOSTAS = ['Para… eu fico sem graça.', 'Ai, bebito. Assim eu me distraio.', 'Fala isso de novo que eu guardo.'] as const;
const SONECA = ['Tá com sono?', 'Cansou de olhar a janela?'] as const;

/** o menu do passageiro: devolve quando escolhem "só olhar a paisagem" */
export async function menuDoPassageiro(p: PalcoDoPassageiro): Promise<void> {
  const { g } = p;
  for (;;) {
    if (p.terminou()) return;
    const euAri = (g.playerId() === ARI.id) === (p.quem === 'jogador');
    const outro = nomeDoMotorista(p);
    const opcoes = euAri
      ? ['Cantarolar Danza Kuduro', `Elogiar ${outro}`, `Encostar no ombro de ${outro}`, 'Só olhar a paisagem']
      : ['Jogar Brawl Stars no celular', `Elogiar ${outro}`, `Encostar no ombro de ${outro}`, 'Só olhar a paisagem'];
    const i = await g.ask('O que fazer?', opcoes, nomeDoPassageiro(p));
    if (i === 3 || i < 0) return;
    if (i === 0) await (euAri ? cantarolar(p) : jogarNoCelular(p));
    else if (i === 1) await elogiar(p, euAri);
    else await encostarNoOmbro(p);
  }
}

/** o Ari mostra um trecho curto da letra no balão; o som sintetizado continua o mesmo */
async function cantarolar(p: PalcoDoPassageiro): Promise<void> {
  const { g, esperar } = p;
  g.som('cantarolarKuduro');
  g.toast('🎵 Danza Kuduro', '🎶');
  await esperar(2.8);
  g.soltarCoracoes(2, p.quem);
  await g.say(['🎵 La mano arriba, cintura sola, da media vuelta, Danza Kuduro.'], nomeDoPassageiro(p));
  await g.say(['Eu conheço essa! Não faz isso que eu quero cantar junto.'], nomeDoMotorista(p));
}

/** o Renan joga no celular: o celular vem para a frente dos olhos, a tela anda, e o Ari, que dirige, reclama */
async function jogarNoCelular(p: PalcoDoPassageiro): Promise<void> {
  const { g, camera, celular, esperar } = p;
  await g.say(['Calma, só mais uma partida de Brawl Stars…'], nomeDoPassageiro(p));
  celular.mostrar(true);
  // (no celular em pé o campo de visão na horizontal é estreito: o celular, deitado, cabe se for menor)
  const emPe = typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.8;
  celular.group.scale.setScalar(emPe ? 0.48 : 0.72);
  camera.anexar(celular.group, { direita: 0, baixo: emPe ? 0.2 : 0.17, frente: 0.4 });
  celular.placar = 0;
  // o olhar desce para o celular (o pescoço volta para o repouso)
  camera.giro = 0;
  camera.altura = -0.42;
  for (let k = 1; k <= 4; k++) {
    celular.placar = k / 4;
    await esperar(1.1);
  }
  celular.mostrar(false);
  camera.anexar(null);
  camera.altura = -0.05;
  g.soltarCoracoes(1, p.quem);
  await g.say(['Ganhei! Pronto, agora eu olho a paisagem com você.'], nomeDoPassageiro(p));
  await g.say(['Enfim. Olha a roda gigante lá no fundo.'], nomeDoMotorista(p));
}

/** elogiar quem dirige: uma fala diferente a cada vez, e a resposta dele */
async function elogiar(p: PalcoDoPassageiro, euAri: boolean): Promise<void> {
  const { g } = p;
  await g.say([euAri ? proxima('elogio-ari', ELOGIOS_DO_ARI) : proxima('elogio-renan', ELOGIOS_DO_RENAN)], nomeDoPassageiro(p));
  g.soltarCoracoes(2, p.quem);
  await g.say([proxima('resposta', RESPOSTAS)], nomeDoMotorista(p));
}

/** encostar no ombro dele: os dois vistos de frente, acompanhando o carro */
async function encostarNoOmbro(p: PalcoDoPassageiro): Promise<void> {
  const { g, camera, esperar } = p;
  camera.encostar = 1;
  camera.giro = 0;
  await esperar(1.6);
  g.soltarCoracoes(3, p.quem);
  await g.say([proxima('soneca', SONECA)], nomeDoMotorista(p));
  await g.say(['Só quero ficar assim um pouquinho.'], nomeDoPassageiro(p));
  await esperar(1.2);
  camera.encostar = 0;
  camera.giro = 0;
  await esperar(1.2);
}

/** o nome do Renan e o do Ari, para quem precisar saber quem é quem sem importar o elenco */
export const PASSAGEIROS = { ari: ARI.id, renan: RENAN.id } as const;
