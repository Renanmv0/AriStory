import { PALETTE as P } from '../../palette';
import type { Recado } from '../../world/halloween/pecas';

/*
 * OS RECADOS de quem foi se arrumar para a festa (`docs/HALLOWEEN.md`, §4.1):
 * a plaquinha que fica no posto de cada um enquanto a dupla anda pelo parque
 * no pôr do sol. Pedido do Renan: "bem dentro da personalidade de cada
 * personagem" — cada um na letra dele e no jeito dele de falar.
 *
 * Os do clube e da escola moram aqui também: é o mesmo dia.
 */

const tinta = {
  azul: P.tintaDoRecado,
  rosa: 0xb0456a,
  roxa: P.lanternaRoxa,
  laranja: P.aboboraFunda,
  verde: 0x3f7a4a,
};

export const RECADOS_DO_PARQUE = {
  /** o Mano: tudo em CAIXA ALTA quando empolga, e meio atrapalhado */
  mano: {
    texto: 'FECHADO. Fui fazer minha fantasia. Ela é SURPRESA. Volto à noite com sorvete!\nP.S.: o de abóbora não derreteu. Eu acho.',
    assinatura: '— Mano 🐧',
    letra: 'kalam',
    tinta: tinta.azul,
  } satisfies Recado,
  /** o Cookie: pede desculpa, faz tudo devagarinho para não assustar */
  cookie: {
    texto: 'Bilheteria fechada. Desculpa. Fui me arrumar devagarinho, pra não fazer barulho. A roda tá girando sozinha.',
    assinatura: '— Cookie 🐘',
    letra: 'caveat',
    tinta: tinta.roxa,
  } satisfies Recado,
  /** a Estella: orgulhosa, caprichosa, e o "meus queridos" */
  estella: {
    texto: 'Estou na boutique, terminando a última bainha. Ninguém mexe no tabuleiro: a aranhinha está de guarda.',
    assinatura: '— Estella 🐑',
    letra: 'caveat',
    tinta: tinta.rosa,
  } satisfies Recado,
  /** as três coelhinhas, uma letra cada: a Luna empolgada, a Sol em espanhol, a Estrella cuidando de todo mundo */
  coelhinhas: [
    { texto: 'Fomos nos arrumar!!! É surpresa (mas é LINDA).', assinatura: '— Luna', letra: 'caveat', tinta: tinta.azul, quem: 'Luna' },
    { texto: '¡Volvemos de noche, panas!', assinatura: '— Sol', letra: 'kalam', tinta: tinta.laranja, quem: 'Sol' },
    { texto: 'Deixamos a toalha. Não fiquem no sol forte.', assinatura: '— Estrella', letra: 'caveat', tinta: tinta.verde, quem: 'Estrella' },
  ] satisfies Recado[],
  /** o quadro de inscrições da arena */
  desafios: {
    texto: 'Desafios suspensos: os desafiantes foram se fantasiar!',
    assinatura: '🏓👻',
    letra: 'kalam',
    tinta: tinta.laranja,
  } satisfies Recado,
};

export const RECADOS_DO_CLUBE = {
  /** a Gina: mandona e o "viu?" */
  gina: { texto: 'Portão aberto hoje, viu? SÓ hoje. Fui me arrumar: minha fantasia vai ser a mais alta da festa.', assinatura: '— Gina 🦒', letra: 'kalam', tinta: tinta.laranja } satisfies Recado,
  /** o Capy: água é com ele */
  capy: { texto: 'Salva-vidas de folga. Água é comigo, mas hoje não: nada de pular sem mim!', assinatura: '— Capy 🌊', letra: 'caveat', tinta: tinta.azul } satisfies Recado,
  /** o Noel: não para quieto, CORRENDO */
  noel: { texto: 'FECHADO! Fui correndo me arrumar. CORRENDO! Amanhã tem suco.', assinatura: '— Noel 🦃', letra: 'kalam', tinta: tinta.verde } satisfies Recado,
  /** o Walter só late: alguém traduziu embaixo */
  walter: { texto: 'Au! Au! 🐾\n(o garçom foi pra festa — cozinha fechada)', assinatura: '— Walter 🐶', letra: 'kalam', tinta: tinta.azul } satisfies Recado,
  /** a Josefina: tranquila, cuidando das plantinhas */
  josefina: { texto: 'Fui me arrumar com calma, que fantasia boa leva tempo. Reguei tudo antes de sair.', assinatura: '— Josefina 🐢', letra: 'caveat', tinta: tinta.verde } satisfies Recado,
};

export const RECADOS_DA_ESCOLA = {
  /** o Gatito: professor, e a turma */
  gatito: { texto: 'Turma: hoje não tem aula! Lição de casa: se divertir na festa.', assinatura: '— Prof. Gatito 🐱', letra: 'caveat', tinta: tinta.azul } satisfies Recado,
  /** o Flynn: presidente da Atlética, água e "Vão, Gatitos!" */
  flynn: { texto: 'Treino cancelado: hoje o time inteiro vai pra festa! Bebam água e caprichem na fantasia. Vão, Gatitos!', assinatura: '— Flynn 🦊', letra: 'kalam', tinta: tinta.laranja } satisfies Recado,
};
