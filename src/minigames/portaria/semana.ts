/**
 * A SEMANA NA PORTARIA — os seis dias, a lista de sócios, os figurantes e o
 * roteiro de cada dia (§8 e §13 do plano).
 *
 * Cada dia tem o ROTEIRO (os da história, na ordem) e FIGURANTES sorteados
 * pela semente entre eles; o roteiro de um dia pode mudar com o que a dupla
 * fez nos dias anteriores (os FATOS da semana, §9): o Seu Hipólito barrado na
 * segunda renova a carteirinha, a carne barrada na quinta deixa o Walter de
 * salada na sexta. O que acontece no MESMO dia (o Noel de verdade chegando
 * atrás do falso) é um CHAMADO da fila (`Visitante.chama`) para uma reserva.
 */
import type { ContextoDoDia, Ferramenta, Regra, Visitante } from './conferencia';
import {
  ESPECIES_FIGURANTES, FICHAS, NOMES_DOS_FIGURANTES, VARIACOES_DOS_FIGURANTES, type EspecieFigurante,
} from './personagens';
import {
  NOME_DO_CLUBE, data, type Carimbo, type Carteirinha, type Data, type Documento, type Fato, type ItemDaSacola,
  type LinhaDaLista, type Retrato,
} from './tipos';

// ================================================================ a semana

/** os dias: a semana que vem do jogo (segunda, 23 de novembro de 2026, ao sábado) */
export const HOJE: readonly Data[] = [
  data(23, 11, 2026), data(24, 11, 2026), data(25, 11, 2026), data(26, 11, 2026), data(27, 11, 2026), data(28, 11, 2026),
];
export const DIA_DA_SEMANA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'] as const;

const VALIDA = data(31, 12, 2027);
const VENCIDA = data(30, 6, 2026);
const amanha = (n: number): Data => { const h = HOJE[n - 1]; return data(h.d + 1, h.m, h.a); };

// =========================================================== a lista de sócios

/**
 * OS SÓCIOS DE SEMPRE na prancheta. O Seu Hipólito é o 0001 (desde o brejo), o
 * Gatito é o 0067 (six seven). Os três riscados são figurantes que já vêm
 * suspensos, com o motivo bobo.
 */
export const SOCIOS: readonly LinhaDaLista[] = [
  { nome: 'Seu Hipólito', numero: '0001' },
  { nome: 'Josefina', numero: '0003' },
  { nome: 'Noel', numero: '0007' },
  { nome: 'Dona Preguiça', numero: '0009' },
  { nome: 'Capy', numero: '0011' },
  { nome: 'Gatito', numero: '0067' },
  { nome: 'Dona Alpacina', numero: '0102' },
  { nome: 'Bento', numero: '0215' },
  { nome: 'Seu Teodoro', numero: '0333', suspenso: 'comeu o sanduíche do salva-vidas' },
  { nome: 'Bóris', numero: '0450', suspenso: 'correu na borda da piscina' },
  { nome: 'Kiko', numero: '0512', suspenso: 'dormiu na espreguiçadeira dos outros' },
];

/** o Beto vira sócio no sábado (o número logo depois do irmão) */
const BETO_SOCIO: LinhaDaLista = { nome: 'Beto', numero: '0216' };

const linhaDe = (nome: string): LinhaDaLista => {
  const l = SOCIOS.find((s) => s.nome === nome) ?? (nome === 'Beto' ? BETO_SOCIO : undefined);
  if (!l) throw new Error(`sem sócio ${nome}`);
  return l;
};

// ============================================================= os papéis

const carteirinha = (nome: string, foto: Retrato, validade: Data = VALIDA, extra: Partial<Carteirinha> = {}): Carteirinha => ({
  tipo: 'carteirinha', nome, numero: linhaDe(nome).numero, validade, foto, clube: NOME_DO_CLUBE, ...extra,
});
const fotoDe = (ficha: string, extra: Partial<Retrato> = {}): Retrato => ({ ...FICHAS[ficha].retrato, ...extra });

// ============================================================ os dias

/** o que a Gina diz em cada dia: ao abrir, ao ensinar a novidade, e no fim */
export interface FalasDaGina {
  abertura: readonly string[];
  ensina: readonly string[];
  fimBom: readonly string[];
  fimRuim: readonly string[];
}

/** o QUADRO de quem monta um dia: a semente, os fatos da semana até aqui */
export interface Quadro {
  n: number;
  hoje: Data;
  tem(f: Fato): boolean;
}

/** uma entrada do roteiro: um personagem da história (que pode não vir, `null`) ou um figurante */
export type Entrada =
  | { tipo: 'roteiro'; montar: (q: Quadro) => Visitante | null }
  | { tipo: 'figurante'; papel: PapelDoFigurante; defeito: DefeitoDoFigurante | 'sorteio' | null };

export type PapelDoFigurante = 'socio' | 'convidado' | 'entregador';
export type DefeitoDoFigurante =
  | 'vencida' | 'fotoDeOutro' | 'foraDaLista' | 'suspenso' | 'numeroChutado'
  | 'conviteDeAmanha' | 'socioSuspenso' | 'convidadoTrocado'
  | 'empresaTrocada' | 'destinoInexistente'
  | 'exameVencido' | 'itemProibido';

export interface DiaDaPortaria {
  numero: number;
  nome: string;
  /** a frase da novidade, na escala */
  novidade: string;
  regras: readonly Regra[];
  ferramentas: readonly Ferramenta[];
  /** quantos segundos de verdade dura o expediente (das 9h às 17h) */
  segundos: number;
  gina: FalasDaGina;
  roteiro: readonly Entrada[];
  /** figurantes sorteados entre os do roteiro */
  figurantesExtras: number;
  /** os defeitos que os figurantes extras podem sortear hoje */
  defeitos: readonly DefeitoDoFigurante[];
  /** quem pode ser chamado para a fila no meio do dia (o Noel de verdade) */
  reservas?: Readonly<Record<string, (q: Quadro) => Visitante>>;
  /** as cenas do dia que não são visitantes (o Walter esperando a carne) */
  cenas?: readonly CenaDoDia[];
  /** TODOS os fatos que este dia pode gravar (refazer o dia apaga os dele antes) */
  fatos: readonly Fato[];
}

export interface CenaDoDia {
  id: string;
  /** só com este fato na semana */
  quando?: Fato;
  /** depois de quantos atendimentos */
  depois: number;
  falas: readonly string[];
}

const roteiro = (montar: (q: Quadro) => Visitante | null): Entrada => ({ tipo: 'roteiro', montar });
const figurante = (papel: PapelDoFigurante, defeito: DefeitoDoFigurante | 'sorteio' | null = null): Entrada => ({ tipo: 'figurante', papel, defeito });


/**
 * O JEAN-LUC DISFARÇADO, TODO DIA (pedido do Renan, 2026-11-20: "algum dos
 * personagens deve voltar todos os dias com um disfarce diferente, só para ser
 * engraçado"). Cada disfarce cai pela ferramenta que o dia ensina: a foto (seg),
 * o escudo e a lista (ter), a data do convite (qua), o destino da entrega (qui),
 * a foto de novo, de touca e boia (sex), e o bigode de Noel (sáb). Ele lembra
 * de cada vez que foi pego — e acha que desta vez ninguém vai reconhecer.
 */
const PEGOS_DO_JEANLUC = ['jeanluc-d1-pego', 'jeanluc-barrado-paris', 'jeanluc-d3-pego', 'jeanluc-d4-pego', 'jeanluc-d5-pego'];
const vezesPego = (q: Quadro): number => PEGOS_DO_JEANLUC.filter((f) => q.tem(f)).length;
const lembranca = (q: Quadro): string => {
  const n = vezesPego(q);
  return n === 0 ? '(baixinho) Ninguém nunca vai desconfiar.'
    : n === 1 ? '(baixinho) Ontem foi azar. Hoje o disfarce é PERFEITO.'
      : `(baixinho) ${n} vezes. Mas hoje… hoje é arte.`;
};

// ------------------------------------------------------------------ dia 1
const DIA_1: DiaDaPortaria = {
  numero: 1,
  nome: 'O primeiro dia',
  segundos: 150,
  novidade: 'A carteirinha: a validade e a foto.',
  regras: ['validade', 'foto'],
  ferramentas: ['olhar', 'apontar'],
  gina: {
    abertura: ['Bom diaaa, bebitos! Primeiro dia na guarita nova!', 'Hoje é só a carteirinha: a VALIDADE e a FOTO. O calendário tá ali na parede.'],
    ensina: ['Viu essa data? É antes de hoje. Carteirinha vencida não entra.', 'E quando alguma coisa não bater, pega a lupa: aponta uma coisa, depois a outra. Eles sempre têm uma explicação. Às vezes até é verdade.'],
    fimBom: ['Primeiro dia e já com olho de porteira! Tô orgulhosa.'],
    fimRuim: ['Primeiro dia é assim mesmo. Amanhã a gente pega o jeito.'],
  },
  roteiro: [
    roteiro(() => ({
      id: 'noel', ficha: 'noel', nome: 'Noel', rosto: fotoDe('noel'), espera: 'entra',
      docs: [carteirinha('Noel', fotoDe('noel'))],
      chegada: ['(com três caixas de laranja tapando a cara) BEBITOS! ESQUECI O GELO!'],
      fatos: { barrado: ['noel-barrado'] },
    })),
    roteiro(() => ({
      id: 'josefina', ficha: 'josefina', nome: 'Josefina', rosto: fotoDe('josefina'), espera: 'entra',
      docs: [carteirinha('Josefina', fotoDe('josefina'))],
      fatos: { barrado: ['josefina-barrada'] },
    })),
    roteiro(() => ({
      id: 'hipolito', ficha: 'hipolito', nome: 'Seu Hipólito', rosto: fotoDe('hipolito'), espera: 'hojeNao',
      docs: [carteirinha('Seu Hipólito', fotoDe('hipolito'), data(31, 12, 1998))],
      pego: ['Vencida? Ela tá é MADURA, meu filho.'],
      fatos: { entrou: ['hipolito-entrou-vencido'], barrado: ['hipolito-barrado'] },
    })),
    figurante('socio'),
    roteiro(() => ({
      id: 'capy', ficha: 'capy', nome: 'Capy', rosto: fotoDe('capy'), tapado: 'capacete', espera: 'entra',
      docs: [carteirinha('Capy', fotoDe('capy'))],
      chegada: ['(de capacete, a viseira abaixada) Bom dia! Segurança não tira folga!'],
      fatos: { barrado: ['capy-barrado'] },
    })),
    figurante('socio', 'fotoDeOutro'),
    roteiro(() => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'coque' }), espera: 'entra',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina'))],
      chegada: ['Repara não, amores: coque alto! A foto é da época da franja.'],
      fatos: { barrado: ['alpacina-barrada-pelo-penteado'] },
    })),
    figurante('socio', 'vencida'),
    roteiro((q) => ({
      id: 'jeanlucD1', ficha: 'jeanluc', nome: 'Josefina', espera: 'hojeNao',
      rosto: fotoDe('jeanluc', { enfeite: 'cascoDePapelao' }),
      docs: [carteirinha('Josefina', fotoDe('josefina'))],
      bordao: 'Bom dia, meus amores! (a voz fininha demais)',
      chegada: ['(um casco de papelão amarrado nas costas, o bico de fora) Sou a Josefina. A tartaruga. Do jardim.', lembranca(q)],
      respostas: { motivo: 'Regar as… plantas. Com… água. Como toda tartaruga.' },
      desfecho: 'confessa',
      pego: ['(o casco escorrega e cai) …Sacré bleu.'],
      barrado: ['Amanhã eu volto. E ninguém vai me reconhecer.'],
      fatos: { entrou: ['jeanluc-d1-entrou'], apontado: ['jeanluc-d1-pego'] },
    })),
  ],
  figurantesExtras: 0,
  defeitos: ['vencida', 'fotoDeOutro'],
  fatos: [
    'noel-barrado', 'josefina-barrada', 'hipolito-entrou-vencido', 'hipolito-barrado', 'capy-barrado', 'alpacina-barrada-pelo-penteado',
    'jeanluc-d1-entrou', 'jeanluc-d1-pego',
  ],
};

// ------------------------------------------------------------------ dia 2
const DIA_2: DiaDaPortaria = {
  numero: 2,
  nome: 'A lista de sócios',
  segundos: 220,
  novidade: 'A prancheta: o número tem que estar na lista, e não pode estar riscado. E agora dá para perguntar.',
  regras: ['validade', 'foto', 'lista'],
  ferramentas: ['olhar', 'apontar', 'perguntar', 'lista'],
  gina: {
    abertura: ['Bom dia! Hoje chegou a prancheta: a LISTA DE SÓCIOS.', 'O número da carteirinha tem que estar aqui. Riscado é suspenso: não entra.'],
    ensina: ['E agora vocês podem PERGUNTAR. O que eles respondem fica anotado na tirinha, e dá pra apontar contra o papel.', 'Sócio de verdade sabe o próprio número de cor. Quase sempre.'],
    fimBom: ['A lista e as perguntas, de primeira! Assim eu tiro férias.'],
    fimRuim: ['A lista é comprida mesmo. Amanhã fica mais fácil.'],
  },
  roteiro: [
    figurante('socio'),
    roteiro((q) => ({
      id: 'jeanluc', ficha: 'jeanluc', nome: 'Monsieur Canard', rosto: fotoDe('jeanluc', { enfeite: 'oculosComNariz' }), espera: 'hojeNao',
      docs: [{
        tipo: 'carteirinha', nome: 'Monsieur Canard', numero: 'PP-07', validade: VALIDA, foto: fotoDe('jeanluc', { enfeite: 'oculosComNariz' }),
        clube: 'Club de Ping-Pong de Paris',
      }],
      bordao: 'Bonjour. Monsieur Canard. Turista. Sócio. De Paris.',
      chegada: ['(óculos de nariz de plástico e um bigodinho fino) Nunca vi esse tal de Jean-Luc na vida.', lembranca(q)],
      pego: ['C\'est la même chose! É um clube. Este é um clube. Voilà.'],
      barrado: ['Amanhã… amanhã eu volto. Irreconhecível.'],
      fatos: { entrou: ['jeanluc-entrou-com-paris'], barrado: ['jeanluc-barrado-paris'] },
    })),
    figurante('socio', 'suspenso'),
    roteiro(() => ({
      id: 'beto', ficha: 'beto', nome: 'Bento', rosto: fotoDe('beto'), espera: 'hojeNao',
      docs: [carteirinha('Bento', fotoDe('bento'))],
      respostas: { numero: '0127' },
      chegada: ['Relaxa, é rapidinho. Sou o Bento. O de sempre.'],
      pego: ['Hahaha, pegaram! É do Bento. Ele nem tá usando agora.'],
      fatos: { entrou: ['beto-entrou-com-a-do-bento'], apontado: ['beto-pego'] },
      chama: { seEntrar: 'bentoSemCarteirinha', depois: 2, tira: 'bento' },
    })),
    roteiro(() => ({
      id: 'preguica', ficha: 'preguica', nome: 'Dona Preguiça', rosto: fotoDe('preguica'), espera: 'entra', caro: true,
      docs: [carteirinha('Dona Preguiça', fotoDe('preguica'))],
      fatos: { barrado: ['preguica-barrada'] },
    })),
    figurante('socio', 'foraDaLista'),
    roteiro(() => ({
      id: 'bento', ficha: 'bento', nome: 'Bento', rosto: fotoDe('bento'), espera: 'entra',
      docs: [carteirinha('Bento', fotoDe('bento'))],
      chegada: ['Tudo nos conformes. Achei a minha carteirinha embaixo do travesseiro do Beto, curiosamente.'],
      fatos: { barrado: ['bento-barrado'] },
    })),
    roteiro((q) => ({
      id: 'hipolito', ficha: 'hipolito', nome: 'Seu Hipólito', rosto: fotoDe('hipolito'), espera: 'hojeNao',
      docs: [carteirinha('Seu Hipólito', fotoDe('hipolito'), data(31, 12, 1998))],
      chegada: q.tem('hipolito-entrou-vencido')
        ? ['Segunda deixaram, meu filho! Segunda é jurisprudência.']
        : ['Voltei! A carteirinha nova tá… a caminho.'],
      pego: ['Ah, essa daí é a velha. A nova tá no outro calção.'],
      fatos: { entrou: ['hipolito-entrou-vencido'] },
    })),
    roteiro((q) => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'trancas' }), espera: 'entra',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina', q.tem('alpacina-barrada-pelo-penteado') ? { cabelo: 'coque' } : {}))],
      chegada: q.tem('alpacina-barrada-pelo-penteado')
        ? ['Trouxe foto NOVA, amores. Pra ninguém mais se confundir. (ofendidíssima)']
        : ['Repara não, amores: tranças!'],
      fatos: { barrado: ['alpacina-barrada-pelo-penteado'] },
    })),
  ],
  figurantesExtras: 1,
  defeitos: ['vencida', 'fotoDeOutro', 'foraDaLista', 'suspenso', 'numeroChutado'],
  reservas: {
    bentoSemCarteirinha: () => ({
      id: 'bentoSemCarteirinha', ficha: 'bento', nome: 'Bento', rosto: fotoDe('bento'), espera: 'hojeNao',
      docs: [],
      chegada: ['Com licença… alguém viu a minha carteirinha? O Beto saiu com ela e não voltou.'],
      barrado: ['Isso não está nos conformes. Isso não está NADA nos conformes. (vai procurar o Beto)'],
      fatos: { barrado: ['bento-sem-carteirinha'] },
    }),
  },
  fatos: [
    'jeanluc-entrou-com-paris', 'jeanluc-barrado-paris', 'beto-entrou-com-a-do-bento', 'beto-pego', 'preguica-barrada',
    'bento-barrado', 'bento-sem-carteirinha', 'hipolito-entrou-vencido', 'alpacina-barrada-pelo-penteado',
  ],
};

// ------------------------------------------------------------------ dia 3
const DIA_3: DiaDaPortaria = {
  numero: 3,
  nome: 'Dia de convidado',
  segundos: 240,
  novidade: 'O convite: a data de hoje, e o sócio que convidou tem que estar na lista.',
  regras: ['validade', 'foto', 'lista', 'convite'],
  ferramentas: ['olhar', 'apontar', 'perguntar', 'lista'],
  gina: {
    abertura: ['Quarta é dia de convidado! Hoje aparece gente que não é sócia.', 'Convite vale HOJE, e quem convidou tem que estar na lista, sem risco.'],
    ensina: ['Pergunta o nome e quem convidou: tem que bater com o papel.', 'E ninguém convida a si mesmo. Já tentaram.'],
    fimBom: ['Nenhum penetra! Os convidados até elogiaram a portaria.'],
    fimRuim: ['Convidado é assim: chega sorrindo e a gente amolece. Amanhã é outra coisa.'],
  },
  roteiro: [
    roteiro(() => ({
      id: 'estella', ficha: 'estella', nome: 'Estella', rosto: fotoDe('estella'), espera: 'entra',
      docs: [{ tipo: 'convite', convidado: 'Estella', socio: 'Noel', numeroDoSocio: '0007', data: HOJE[2] }],
      fatos: { barrado: ['estella-barrada'] },
    })),
    figurante('convidado'),
    roteiro((q) => ({
      id: 'mano', ficha: 'mano', nome: 'Mano', rosto: fotoDe('mano'), espera: 'hojeNao',
      docs: [],
      chegada: q.tem('noel-barrado') ? ['Soube que até o Noel ficou de fora. Eu trouxe reforço. (a casquinha)'] : ['Calor, né? Eu tenho a solução.'],
      oferta: { item: 'casquinha', fala: ['Uma casquinha pela fresta? De morango. Ninguém precisa saber.'] },
      pego: ['Tá bom, tá bom. Sem convite. Mas COM casquinha.'],
      fatos: { entrou: ['mano-entrou-sem-convite'], aceitou: ['mano-casquinha-aceita'], recusou: ['mano-casquinha-recusada'] },
    })),
    roteiro((q) => ({
      id: 'bento', ficha: 'bento', nome: 'Bento', rosto: fotoDe('bento'), espera: 'entra',
      docs: [carteirinha('Bento', fotoDe('bento'))],
      chegada: q.tem('beto-entrou-com-a-do-bento')
        ? ['Segunda via, tirada ontem à noite. Nos conformes. O Beto devolveu a outra… lavada.']
        : ['Tudo nos conformes. Hoje eu trouxe um convidado.'],
      fatos: { barrado: ['bento-barrado'] },
    })),
    roteiro(() => ({
      id: 'beto', ficha: 'beto', nome: 'Beto', rosto: fotoDe('beto'), espera: 'entra',
      docs: [{ tipo: 'convite', convidado: 'Beto', socio: 'Bento', numeroDoSocio: '0215', data: HOJE[2] }],
      chegada: ['Relaxa, hoje é tudo legal. O Bento me convidou. De verdade.'],
      fatos: { barrado: ['beto-convidado-barrado'] },
    })),
    roteiro(() => ({
      id: 'hipolito', ficha: 'hipolito', nome: 'Seu Hipólito', rosto: fotoDe('hipolito'), espera: 'hojeNao',
      docs: [{ tipo: 'convite', convidado: 'Seu Hipólito', socio: 'Seu Hipólito', numeroDoSocio: '0001', data: HOJE[2] }],
      chegada: ['Hoje eu vim de CONVIDADO, meu filho. Muito mais chique.'],
      pego: ['Ué, e quem é mais da minha confiança do que eu?'],
      fatos: { entrou: ['hipolito-entrou-de-convidado'] },
    })),
    figurante('convidado', 'conviteDeAmanha'),
    figurante('convidado', 'socioSuspenso'),
    roteiro(() => ({
      id: 'preguica', ficha: 'preguica', nome: 'Dona Preguiça', rosto: fotoDe('preguica'), grupo: ['netinho'], espera: 'entra', caro: true,
      docs: [
        carteirinha('Dona Preguiça', fotoDe('preguica')),
        { tipo: 'convite', convidado: 'Tiquinho', socio: 'Dona Preguiça', numeroDoSocio: '0009', data: HOJE[2] },
      ],
      chegada: ['Ah, meu bem… hoje eu trouxe o meu netinho… o Tiquinho… dá oi, Tiquinho…'],
      fatos: { barrado: ['preguica-barrada'] },
    })),
    roteiro(() => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'blackPower' }), espera: 'entra',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina'))],
      chegada: ['Repara não, amores: BLACK POWER!'],
      fatos: { barrado: ['alpacina-barrada-pelo-penteado'] },
    })),
    figurante('convidado', 'convidadoTrocado'),
    roteiro((q) => ({
      id: 'jeanlucD3', ficha: 'jeanluc', nome: 'Jeanne', espera: 'hojeNao',
      rosto: fotoDe('jeanluc', { enfeite: 'perucaDeFranja' }),
      docs: [{ tipo: 'convite', convidado: 'Jeanne', socio: 'Dona Alpacina', numeroDoSocio: '0102', data: data(14, 7, 2026) }],
      bordao: 'Bonjour, amores! Repara não: penteado novo!',
      chegada: ['(uma peruca de franja ENORME, igual à da Dona Alpacina) Sou a Jeanne. A prima. Da outra prima.', lembranca(q)],
      respostas: { motivo: 'Mostrar ESTE cabelo. E jogar um pouquinho de ping pong. Por acaso.' },
      desfecho: 'confessa',
      pego: ['Quatorze de julho é feriado lá em casa! …Tá bom, tá bom. (a peruca escorrega)'],
      barrado: ['Amanhã eu volto. Com OUTRO cabelo.'],
      fatos: { entrou: ['jeanluc-d3-entrou'], apontado: ['jeanluc-d3-pego'] },
    })),
  ],
  figurantesExtras: 0,
  defeitos: ['conviteDeAmanha', 'socioSuspenso', 'convidadoTrocado', 'vencida', 'foraDaLista'],
  fatos: [
    'estella-barrada', 'mano-entrou-sem-convite', 'mano-casquinha-aceita', 'mano-casquinha-recusada', 'bento-barrado',
    'beto-convidado-barrado', 'hipolito-entrou-de-convidado', 'preguica-barrada', 'alpacina-barrada-pelo-penteado',
    'jeanluc-d3-entrou', 'jeanluc-d3-pego',
  ],
};

// ------------------------------------------------------------------ dia 4
const PAPITA = 'Papita Delivery';
const DIA_4: DiaDaPortaria = {
  numero: 4,
  nome: 'Dia de entrega',
  segundos: 220,
  novidade: 'O crachá e a ordem de entrega: a mesma empresa, e um lugar que existe no clube.',
  regras: ['validade', 'foto', 'lista', 'convite', 'entrega'],
  ferramentas: ['olhar', 'apontar', 'perguntar', 'lista'],
  gina: {
    abertura: ['Quinta é dia de entrega! A carne do Mania, o gelo do Noel, o adubo da Josefina…', 'Entregador mostra o CRACHÁ e a ORDEM: a empresa tem que ser a mesma, e o lugar tem que existir no clube.'],
    ensina: ['Os lugares do clube estão no manual. Se não estiver lá, não existe.', 'E a foto do crachá vale igual à da carteirinha.'],
    fimBom: ['Tudo entregue no lugar certo! O Walter até abanou o rabo pra guarita.'],
    fimRuim: ['Entrega é corrida, eu sei. Amanhã a gente respira.'],
  },
  roteiro: [
    roteiro(() => ({
      id: 'tata', ficha: 'tata', nome: 'Tatá', rosto: fotoDe('tata'), espera: 'entra',
      docs: [
        { tipo: 'cracha', nome: 'Tatá', empresa: PAPITA, funcao: 'Entregador', foto: fotoDe('tata') },
        { tipo: 'ordem', empresa: PAPITA, destino: 'Estufa da Josefina', itens: ['adubo'] },
      ],
      fatos: { barrado: ['adubo-barrado'] },
    })),
    figurante('entregador', null),
    roteiro(() => ({
      id: 'gelo', ficha: 'lontra', nome: 'Marina', rosto: { especie: 'lontra', cor: 'mel', marca: 'bigodeBranco' }, espera: 'entra',
      docs: [
        { tipo: 'cracha', nome: 'Marina', empresa: 'Gelo Polar', funcao: 'Entregadora', foto: { especie: 'lontra', cor: 'mel', marca: 'bigodeBranco' } },
        { tipo: 'ordem', empresa: 'Gelo Polar', destino: 'Bar do Noel', itens: ['gelo'] },
      ],
      chegada: ['Gelo pro Noel! Antes que vire água! Hahaha!'],
      fatos: { barrado: ['gelo-barrado'] },
    })),
    roteiro(() => ({
      id: 'carne', ficha: 'bode', nome: 'Seu Bartolomeu', rosto: { especie: 'bode', cor: 'branco', marca: 'chifreTorto' }, espera: 'entra', caro: true,
      docs: [
        { tipo: 'cracha', nome: 'Seu Bartolomeu', empresa: 'Açougue do Bairro', funcao: 'Entregador', foto: { especie: 'bode', cor: 'branco', marca: 'chifreTorto' } },
        { tipo: 'ordem', empresa: 'Açougue do Bairro', destino: 'Mania de Churrasco', itens: ['picanha', 'linguiça'] },
      ],
      chegada: ['A carne do Mania. E por que vocês querem saber? …Tá aí o crachá.'],
      fatos: { barrado: ['carne-barrada'] },
    })),
    figurante('entregador', 'empresaTrocada'),
    roteiro((q) => ({
      id: 'josefina', ficha: 'josefina', nome: 'Josefina', rosto: fotoDe('josefina'), espera: 'entra',
      docs: [carteirinha('Josefina', fotoDe('josefina'))],
      chegada: q.tem('josefina-barrada')
        ? ['Bom dia, meus amores. Trouxe uma mudinha pra guarita, sem rancor nenhum. Será que o meu adubo chegou?']
        : ['Bom dia, meus amores! Será que o meu adubo já chegou?'],
      fatos: { barrado: ['josefina-barrada'] },
    })),
    roteiro(() => ({
      id: 'alpacona', ficha: 'alpacona', nome: 'Dona Alpacina', rosto: fotoDe('alpacona', { cabelo: 'tranca' }), espera: 'hojeNao',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina'))],
      fatos: { entrou: ['alpacona-entrou'] },
    })),
    roteiro(() => ({
      id: 'tataBoliche', ficha: 'tata', nome: 'Tatá', rosto: fotoDe('tata'), espera: 'hojeNao',
      docs: [
        { tipo: 'cracha', nome: 'Tatá', empresa: PAPITA, funcao: 'Entregador', foto: fotoDe('tata') },
        { tipo: 'ordem', empresa: PAPITA, destino: 'Sala de Boliche', itens: ['bolas de boliche', 'sapatos de boliche'] },
      ],
      chegada: ['De novo eu! Outra entrega! Rapidinho!'],
      pego: ['Ih. Clube errado.'],
      fatos: { entrou: ['tata-perdido-no-boliche'] },
    })),
    figurante('socio', 'vencida'),
    roteiro((q) => ({
      id: 'jeanlucD4', ficha: 'jeanluc', nome: 'Jean-Pierre', espera: 'hojeNao',
      rosto: fotoDe('jeanluc', { enfeite: 'boneDeEntregador' }),
      docs: [
        { tipo: 'cracha', nome: 'Jean-Pierre', empresa: 'Croissant Express', funcao: 'Entregador', foto: fotoDe('jeanluc', { enfeite: 'boneDeEntregador' }) },
        { tipo: 'ordem', empresa: 'Croissant Express', destino: 'Mesa de Ping Pong', itens: ['croissants', 'bolinhas de ping pong'] },
      ],
      bordao: 'Entrega! Assina! Rapidinho! (com sotaque)',
      chegada: ['(de boné e uma caixa de croissants maior que ele) Croissant Express. Muito… express.', lembranca(q)],
      desfecho: 'confessa',
      pego: ['Não existe mesa de ping pong no clube?! …Ainda não. Era pra ser surpresa.'],
      barrado: ['Fiquem com um croissant. Pela tentativa. (não deixa nenhum)'],
      fatos: { entrou: ['jeanluc-d4-entrou'], apontado: ['jeanluc-d4-pego'] },
    })),
    roteiro(() => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'moicano' }), espera: 'entra',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina'))],
      chegada: ['Bom diaaa! …A minha prima passou por aqui? Ela tá com a minha carteirinha velha. E com a minha franja!'],
      fatos: { barrado: ['alpacina-barrada-pelo-penteado'] },
    })),
  ],
  figurantesExtras: 0,
  defeitos: ['empresaTrocada', 'destinoInexistente', 'vencida', 'conviteDeAmanha'],
  cenas: [{ id: 'walterEsperandoACarne', depois: 2, falas: ['(do lado de dentro do portão, o Walter espia a fila) Au? …Au?'] }],
  fatos: [
    'adubo-barrado', 'gelo-barrado', 'carne-barrada', 'josefina-barrada', 'alpacona-entrou', 'tata-perdido-no-boliche',
    'alpacina-barrada-pelo-penteado', 'jeanluc-d4-entrou', 'jeanluc-d4-pego',
  ],
};

// ------------------------------------------------------------------ dia 5
const exame = (nome: string, validade: Data = VALIDA): Documento => ({ tipo: 'exame', nome, validade });
const DIA_5: DiaDaPortaria = {
  numero: 5,
  nome: 'Dia de piscina',
  segundos: 240,
  novidade: 'O exame da piscina (vencido é 🟡 SÓ O CLUBE) e a sacola: o proibido vai para os achados.',
  regras: ['validade', 'foto', 'lista', 'convite', 'entrega', 'exame', 'sacola'],
  ferramentas: ['olhar', 'apontar', 'perguntar', 'lista'],
  gina: {
    abertura: ['Sexta é dia de piscina cheia! O Capy pediu reforço.', 'Quem vai pra piscina mostra o EXAME. Vencido: carimbo amarelo, SÓ O CLUBE. E olho na SACOLA.'],
    ensina: ['Toca no que é proibido e ele vai pra caixa de achados. Caixa de som, copo de vidro, sabão de bolha e bola de futebol.', 'O resto da pessoa pode estar certinho: tira o proibido e deixa entrar.'],
    fimBom: ['Piscina tranquila, sem vidro e sem baile! O Capy mandou um joinha.'],
    fimRuim: ['Sexta é puxada. O Capy apitou um pouquinho, mas sobreviveu.'],
  },
  roteiro: [
    roteiro(() => ({
      id: 'capy', ficha: 'capy', nome: 'Capy', rosto: fotoDe('capy'), espera: 'entra', querPiscina: true,
      docs: [carteirinha('Capy', fotoDe('capy')), exame('Capy')],
      sacola: ['oculosDeNatacao', 'toalha'],
      chegada: ['Hoje eu peço RIGOR. Portaria é a primeira linha de segurança!'],
      fatos: { barrado: ['capy-barrado'] },
    })),
    roteiro((q) => {
      const renovado = q.tem('hipolito-barrado') && !q.tem('hipolito-entrou-vencido');
      return {
        id: 'hipolito', ficha: 'hipolito', nome: 'Seu Hipólito', rosto: fotoDe('hipolito'), espera: renovado ? 'entra' : 'hojeNao', querPiscina: true,
        docs: [carteirinha('Seu Hipólito', fotoDe('hipolito'), renovado ? VALIDA : data(31, 12, 1998)), exame('Seu Hipólito')],
        sacola: ['boia', 'caixaDeSom', 'toalha'],
        chegada: renovado
          ? ['RENOVADA, meu filho! (ergue a carteirinha como troféu) E hoje é dia de boiar com música!']
          : ['Hoje é dia de boiar com música, meu filho!'],
        fatos: { entrou: renovado ? [] : ['hipolito-entrou-vencido'], passou: { caixaDeSom: ['baile-do-hipopotamo'] } },
      };
    }),
    roteiro(() => ({
      id: 'cookie', ficha: 'cookie', nome: 'Cookie', rosto: fotoDe('cookie'), espera: 'entra', querPiscina: true,
      docs: [{ tipo: 'convite', convidado: 'Cookie', socio: 'Capy', numeroDoSocio: '0011', data: HOJE[4] }, exame('Cookie')],
      sacola: ['sabaoDeBolha', 'toalha'],
      fatos: { barrado: ['cookie-barrado'], passou: { sabaoDeBolha: ['espuma-na-piscina'] } },
    })),
    roteiro(() => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'cocoAlto' }), espera: 'soClube', querPiscina: true,
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina')), exame('Dona Alpacina', VENCIDA)],
      sacola: ['protetor', 'toalha'],
      chegada: ['Repara não, amores: coque de piscina! …O exame? Fiz. Em algum ano.'],
      entra: ['SÓ O CLUBE? Tudo bem, amor: o cabelo nem molha mesmo.'],
      fatos: { entrou: [] },
    })),
    figurante('socio', 'itemProibido'),
    roteiro(() => ({
      id: 'preguica', ficha: 'preguica', nome: 'Dona Preguiça', rosto: fotoDe('preguica'), espera: 'entra', caro: true, querPiscina: true,
      docs: [carteirinha('Dona Preguiça', fotoDe('preguica')), exame('Dona Preguiça')],
      sacola: ['tricô', 'toalha'],
      chegada: ['Faço hidroginástica, meu bem… o exame tá em dia… o tricô também…'],
      fatos: { barrado: ['preguica-barrada'] },
    })),
    figurante('socio', 'exameVencido'),
    roteiro(() => ({
      id: 'tata', ficha: 'tata', nome: 'Tatá', rosto: fotoDe('tata'), espera: 'entra',
      docs: [
        { tipo: 'cracha', nome: 'Tatá', empresa: PAPITA, funcao: 'Entregador', foto: fotoDe('tata') },
        { tipo: 'ordem', empresa: PAPITA, destino: 'Piscina', itens: ['picolés'] },
      ],
      chegada: ['Picolé! Derretendo! Rápido!'],
      fatos: { barrado: ['picoles-barrados'] },
    })),
    roteiro((q) => ({
      id: 'jeanlucD5', ficha: 'jeanluc', nome: 'Seu Hipólito', espera: 'hojeNao', querPiscina: true,
      rosto: fotoDe('jeanluc', { enfeite: 'toucaEBoia' }),
      docs: [carteirinha('Seu Hipólito', fotoDe('hipolito')), exame('Seu Hipólito')],
      sacola: ['raqueteDePingPong', 'toalha'],
      bordao: 'Meu filho, eu sou sócio desde quando isso aqui era… lago? Brejo!',
      chegada: ['(touca de natação, boia de patinho e um travesseiro na barriga) Sou o Seu Hipólito. Encolhi na lavagem.', lembranca(q)],
      respostas: { motivo: 'Boiar. E sacar um pouquinho. Na piscina. Com a raquete.' },
      desfecho: 'confessa',
      pego: ['(o travesseiro escorrega da barriga) …Mon Dieu. O hipopótamo de verdade tem papada, né?'],
      barrado: ['Amanhã eu volto. Amanhã é o disfarce DEFINITIVO.'],
      fatos: { entrou: ['jeanluc-d5-entrou'], apontado: ['jeanluc-d5-pego'] },
    })),
    roteiro(() => ({
      id: 'bento', ficha: 'bento', nome: 'Bento', rosto: fotoDe('bento'), espera: 'entra', querPiscina: true,
      docs: [carteirinha('Bento', fotoDe('bento')), exame('Bento')],
      sacola: ['oculosDeNatacao', 'livro'],
      fatos: { barrado: ['bento-barrado'] },
    })),
  ],
  figurantesExtras: 1,
  defeitos: ['itemProibido', 'exameVencido', 'vencida', 'foraDaLista'],
  cenas: [{ id: 'walterComSalada', quando: 'carne-barrada', depois: 3, falas: ['(o Walter aparece do lado de dentro com um prato de salada) …au.'] }],
  fatos: [
    'capy-barrado', 'hipolito-entrou-vencido', 'baile-do-hipopotamo', 'cookie-barrado', 'espuma-na-piscina', 'preguica-barrada',
    'picoles-barrados', 'bento-barrado', 'copo-quebrado', 'som-alto-na-piscina', 'bola-na-piscina',
    'jeanluc-d5-entrou', 'jeanluc-d5-pego',
  ],
};

// ------------------------------------------------------------------ dia 6
const TURMA = ['Tia Liz', 'Luna', 'Sol', 'Estrella', 'Flynn', 'Valentina', 'Pietro'];
const coletivo = (): Documento => ({ tipo: 'conviteColetivo', socio: 'Gatito', numeroDoSocio: '0067', data: HOJE[5], nomes: TURMA });
const DIA_6: DiaDaPortaria = {
  numero: 6,
  nome: 'O sábado cheio',
  segundos: 300,
  novidade: 'Tudo junto, a fila maior e o convite coletivo do Dia da Escola.',
  regras: ['validade', 'foto', 'lista', 'convite', 'entrega', 'exame', 'sacola', 'coletivo'],
  ferramentas: ['olhar', 'apontar', 'perguntar', 'lista'],
  gina: {
    abertura: ['SÁBADO! Dia da Escola no Clube: a turma do Gatito vem com um convite só pra todo mundo.', 'Quem estiver no convite coletivo entra. Quem não estiver… vocês já sabem.'],
    ensina: ['Convite coletivo: confere os nomes. E conta quantos são. Às vezes alguém se esconde.'],
    fimBom: ['Que semana! Vocês são a melhor dupla que essa guarita já teve.'],
    fimRuim: ['Sábado é sábado: até eu me perco. Mas a semana valeu.'],
  },
  roteiro: [
    roteiro(() => ({
      id: 'gatito', ficha: 'gatito', nome: 'Gatito', rosto: fotoDe('gatito'), espera: 'entra',
      docs: [carteirinha('Gatito', fotoDe('gatito'))],
      fatos: { barrado: ['gatito-barrado'] },
    })),
    roteiro(() => ({
      id: 'tializ', ficha: 'tializ', nome: 'Tia Liz', rosto: fotoDe('tializ'), grupo: ['sol', 'estrella'], escondido: 'luna', espera: 'entra', caro: true,
      docs: [coletivo()],
      respostas: { quantos: '4' },
      oferta: { item: 'arepita', fala: ['Uma arepita pela fresta, mi niño. Presente, não é suborno: eu tô no convite!'] },
      fatos: { barrado: ['tializ-barrada'], apontado: ['luna-achada'] },
    })),
    roteiro(() => ({
      id: 'flynn', ficha: 'flynn', nome: 'Flynn', rosto: fotoDe('flynn'), espera: 'entra', querPiscina: true,
      docs: [coletivo(), exame('Flynn')],
      sacola: ['bolaDeBasquete', 'toalha'],
      fatos: { barrado: ['flynn-barrado'] },
    })),
    roteiro((q) => ({
      id: 'rocco', ficha: 'rocco', nome: 'Rocco', rosto: fotoDe('rocco'), grupo: ['dogoes'], espera: 'hojeNao',
      respostas: { quantos: '6' },
      docs: [coletivo()],
      chegada: q.tem('dogoes-entraram') ? [] : ['A gente veio pro Dia da Escola. Tá no convite. Mais ou menos.'],
      fatos: { entrou: ['dogoes-entraram'], barrado: ['rocco-barrado'] },
    })),
    roteiro(() => ({
      id: 'valentina', ficha: 'valentina', nome: 'Valentina', rosto: fotoDe('valentina'), grupo: ['pietro'], espera: 'entra',
      docs: [coletivo()],
      fatos: { barrado: ['valentina-barrada'] },
    })),
    roteiro((q) => {
      const renovado = q.tem('hipolito-barrado') && !q.tem('hipolito-entrou-vencido');
      return {
        id: 'hipolito', ficha: 'hipolito', nome: 'Seu Hipólito', rosto: fotoDe('hipolito'), espera: renovado ? 'entra' : 'hojeNao',
        docs: [carteirinha('Seu Hipólito', fotoDe('hipolito'), renovado ? VALIDA : data(31, 12, 1998))],
        chegada: renovado
          ? ['Olha ela aí, meu filho! RENOVADA! (ergue a carteirinha como troféu) Trouxe bolo pra Gina, que eu sou sócio educado.']
          : ['Segunda deixaram, meu filho. A semana toda, quase. Hoje também, né?'],
        fatos: { entrou: renovado ? ['hipolito-renovado-entrou'] : ['hipolito-entrou-vencido'] },
      };
    }),
    roteiro(() => ({
      id: 'bento', ficha: 'bento', nome: 'Bento', rosto: fotoDe('bento'), espera: 'entra',
      docs: [carteirinha('Bento', fotoDe('bento'))],
      chegada: ['Tudo nos conformes. E hoje tenho uma notícia: o Beto virou sócio.'],
      fatos: { barrado: ['bento-barrado'] },
    })),
    roteiro(() => ({
      id: 'beto', ficha: 'beto', nome: 'Beto', rosto: fotoDe('beto'), espera: 'entra',
      docs: [carteirinha('Beto', fotoDe('beto'))],
      chegada: ['Relaxa, agora é MINHA. Sócio, olha aí. 0216. Sei de cor!'],
      fatos: { barrado: ['beto-socio-barrado'] },
    })),
    roteiro(() => ({
      id: 'alpacina', ficha: 'alpacina', nome: 'Dona Alpacina', rosto: fotoDe('alpacina', { cabelo: 'trofeu' }), espera: 'entra',
      docs: [carteirinha('Dona Alpacina', fotoDe('alpacina'))],
      chegada: ['Repara não, amores: penteado de TROFÉU! Pra fechar a semana.'],
      fatos: { barrado: ['alpacina-barrada-pelo-penteado'] },
    })),
    figurante('socio', 'sorteio'),
    roteiro(() => ({
      id: 'tata', ficha: 'tata', nome: 'Tatá', rosto: fotoDe('tata'), espera: 'entra',
      docs: [
        { tipo: 'cracha', nome: 'Tatá', empresa: PAPITA, funcao: 'Entregador', foto: fotoDe('tata') },
        { tipo: 'ordem', empresa: PAPITA, destino: 'Mania de Churrasco', itens: ['bolo do Dia da Escola'] },
      ],
      chegada: ['Bolo! Grande! Pesado! Assina!'],
      fatos: { barrado: ['bolo-barrado'] },
    })),
    roteiro(() => ({
      id: 'preguica', ficha: 'preguica', nome: 'Dona Preguiça', rosto: fotoDe('preguica'), espera: 'entra', caro: true,
      docs: [carteirinha('Dona Preguiça', fotoDe('preguica'))],
      chegada: ['Ah, meu bem… tricotei um cachecol pra Gina… a semana inteira… deu pra metade do pescoço…'],
      fatos: { barrado: ['preguica-barrada'] },
    })),
    roteiro((q) => q.tem('mano-casquinha-aceita') ? ({
      id: 'mano', ficha: 'mano', nome: 'Mano', rosto: fotoDe('mano'), espera: 'entra',
      docs: [{ tipo: 'convite', convidado: 'Mano', socio: 'Noel', numeroDoSocio: '0007', data: HOJE[5] }],
      chegada: ['Hoje vim CERTINHO. Convidado do Noel. E trouxe casquinha pra fila INTEIRA.'],
      fatos: { barrado: ['mano-barrado-com-convite'] },
    }) : null),
    roteiro((q) => ({
      id: 'jeanlucDisfarcado', ficha: 'jeanluc', nome: 'Noel', rosto: fotoDe('jeanluc', { enfeite: 'bigodeFalso' }), espera: 'hojeNao',
      bordao: 'GLUGLU! Bonjour… digo, BOM DIA, BEBITOS!',
      respostas: { motivo: 'ABRIR O BAR! Tô atrasado! Gluglu… é assim que fala, né?' },
      docs: [carteirinha('Noel', fotoDe('noel'))],
      chegada: ['(de bigode, com três caixas de laranja vazias) GLUGLU! Sou o Noel! ESQUECI O GELO!', vezesPego(q) >= 3
        ? `(baixinho) ${vezesPego(q)} disfarces. ${vezesPego(q)}! Este é o último. E o melhor.`
        : lembranca(q)],
      pego: ['(o bigode cai devagar) …C\'est une catastrophe.'],
      desfecho: 'confessa',
      fatos: { entrou: ['jeanluc-disfarcado-entrou'], apontado: ['disfarce-descoberto'] },
      chama: { seEntrar: 'noelDeVerdade', depois: 0 },
    })),
  ],
  figurantesExtras: 1,
  defeitos: ['vencida', 'fotoDeOutro', 'foraDaLista', 'suspenso', 'numeroChutado', 'exameVencido', 'itemProibido'],
  reservas: {
    noelDeVerdade: () => ({
      id: 'noelDeVerdade', ficha: 'noel', nome: 'Noel', rosto: fotoDe('noel'), espera: 'entra',
      docs: [carteirinha('Noel', fotoDe('noel'))],
      chegada: ['MAS EU SOU O NOEL! QUEM ENTROU AGORA DE BIGODE?!'],
      fatos: { barrado: ['noel-barrado'] },
    }),
  },
  fatos: [
    'gatito-barrado', 'tializ-barrada', 'luna-achada', 'flynn-barrado', 'dogoes-entraram', 'rocco-barrado', 'valentina-barrada',
    'hipolito-renovado-entrou', 'hipolito-entrou-vencido', 'bento-barrado', 'beto-socio-barrado', 'alpacina-barrada-pelo-penteado',
    'bolo-barrado', 'preguica-barrada', 'mano-barrado-com-convite', 'jeanluc-disfarcado-entrou', 'disfarce-descoberto', 'noel-barrado',
    'copo-quebrado', 'som-alto-na-piscina', 'bola-na-piscina', 'espuma-na-piscina',
  ],
};

export const DIAS: readonly DiaDaPortaria[] = [DIA_1, DIA_2, DIA_3, DIA_4, DIA_5, DIA_6];

export const diaPorNumero = (n: number): DiaDaPortaria | null => DIAS.find((d) => d.numero === n) ?? null;

// ============================================================== os figurantes

/** um sorteio repetível (o mesmo da rota do Bebito) */
export function sorteio(semente: number): () => number {
  let s = (semente >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const escolher = <T>(rnd: () => number, lista: readonly T[]): T => lista[Math.min(lista.length - 1, Math.floor(rnd() * lista.length))];

/** os nomes que nenhum figurante sorteia (os do roteiro e os riscados de sempre) */
const NOMES_RESERVADOS = new Set(['Marina', 'Seu Bartolomeu', ...SOCIOS.map((s) => s.nome)]);

interface Sorteado {
  visitante: Visitante;
  /** as linhas que ele põe na prancheta (o figurante sócio) */
  lista: LinhaDaLista[];
}

/**
 * UM FIGURANTE: a espécie (o tipo), o nome, a cor e a marca sorteados; um
 * papel válido e, se houver, UM defeito aplicado em cima — no máximo uma
 * coisa errada (§2).
 */
function montarFigurante(
  rnd: () => number, n: number, i: number, papel: PapelDoFigurante, defeito: DefeitoDoFigurante | null,
  usados: Set<string>, numeros: Set<string>, especiesUsadas: Map<EspecieFigurante, number>,
): Sorteado {
  const hoje = HOJE[n - 1];
  // a fila variada: a espécie que menos apareceu hoje (empate, sorteio), e só as que ainda têm nome livre
  const livresDe = (e: EspecieFigurante): string[] => NOMES_DOS_FIGURANTES[e].filter((x) => !usados.has(x) && !NOMES_RESERVADOS.has(x));
  const comNome = ESPECIES_FIGURANTES.filter((e) => livresDe(e).length);
  const menos = Math.min(...comNome.map((e) => especiesUsadas.get(e) ?? 0));
  const especie: EspecieFigurante = escolher(rnd, comNome.filter((e) => (especiesUsadas.get(e) ?? 0) === menos));
  especiesUsadas.set(especie, (especiesUsadas.get(especie) ?? 0) + 1);
  const nome = escolher(rnd, livresDe(especie));
  usados.add(nome);
  const variacoes = VARIACOES_DOS_FIGURANTES[especie];
  const rosto: Retrato = { especie, cor: escolher(rnd, variacoes.cores), marca: escolher(rnd, variacoes.marcas) };
  let numero = '';
  do numero = String(600 + Math.floor(rnd() * 380)).padStart(4, '0'); while (numeros.has(numero));
  numeros.add(numero);
  const id = `figurante-${i}`;
  const lista: LinhaDaLista[] = [];
  const v: Visitante = { id, ficha: especie, nome, rosto, docs: [], espera: 'entra' };
  const docs: Documento[] = [];

  /** a foto "de outro": a mesma espécie com a cor ou a marca trocada */
  const fotoDeOutro = (): Retrato => {
    const outraCor = variacoes.cores.filter((c) => c !== rosto.cor);
    const outraMarca = variacoes.marcas.filter((m) => m !== rosto.marca);
    return rnd() < 0.5 && outraCor.length ? { ...rosto, cor: escolher(rnd, outraCor) } : { ...rosto, marca: escolher(rnd, outraMarca) };
  };

  if (papel === 'socio') {
    const c: Carteirinha = { tipo: 'carteirinha', nome, numero, validade: VALIDA, foto: { ...rosto }, clube: NOME_DO_CLUBE };
    lista.push({ nome, numero });
    if (defeito === 'vencida') c.validade = VENCIDA;
    if (defeito === 'fotoDeOutro') c.foto = fotoDeOutro();
    if (defeito === 'foraDaLista') lista.length = 0;
    if (defeito === 'suspenso') {
      // o riscado da prancheta que bate com a espécie, se houver; senão, este fica riscado hoje
      lista[0] = { nome, numero, suspenso: escolher(rnd, ['correu na borda da piscina', 'pulou de bomba no raso', 'pegou a boia do vizinho']) };
    }
    if (defeito === 'numeroChutado') {
      // a carteirinha é do IRMÃO parecido (a mesma cara, o nome do irmão, que ele diz ser): a foto e a
      // lista batem, e só o número de cor entrega — o caso do Beto, em figurante
      v.respostas = { numero: String(Number(numero) + 1 + Math.floor(rnd() * 8)).padStart(4, '0') };
    }
    docs.push(c);
    if (defeito === 'exameVencido' || defeito === 'itemProibido' || rnd() < 0.4) {
      if (n >= 5) {
        v.querPiscina = true;
        docs.push({ tipo: 'exame', nome, validade: defeito === 'exameVencido' ? VENCIDA : VALIDA });
      }
    }
    if (n >= 5) {
      const comuns: ItemDaSacola[] = ['toalha', 'protetor', 'chinelo', 'livro', 'sanduiche', 'oculosDeNatacao'];
      const sacola: ItemDaSacola[] = [escolher(rnd, comuns), escolher(rnd, comuns)];
      if (defeito === 'itemProibido') sacola.splice(1, 0, escolher(rnd, ['copoDeVidro', 'bolaDeFutebol', 'caixaDeSom'] as ItemDaSacola[]));
      v.sacola = [...new Set(sacola)];
    }
  } else if (papel === 'convidado') {
    const socios = SOCIOS.filter((s) => !s.suspenso);
    const anfitriao = defeito === 'socioSuspenso' ? escolher(rnd, SOCIOS.filter((s) => s.suspenso)) : escolher(rnd, socios);
    docs.push({
      tipo: 'convite', convidado: nome, socio: anfitriao.nome, numeroDoSocio: anfitriao.numero,
      data: defeito === 'conviteDeAmanha' ? amanha(n) : hoje,
    });
    if (defeito === 'convidadoTrocado') {
      // o nome que ele DIZ não é o do convite (o convite é de outro)
      const outro = NOMES_DOS_FIGURANTES[especie].find((x) => x !== nome && !usados.has(x)) ?? `${nome} Júnior`;
      (docs[0] as { convidado: string }).convidado = outro;
    }
  } else {
    const empresas = ['Papita Delivery', 'Floricultura Primavera', 'Padaria Pão Quentinho', 'Lavanderia Bolha'];
    const empresa = escolher(rnd, empresas);
    const destinos = ['Mania de Churrasco', 'Bar do Noel', 'Estufa da Josefina', 'Vestiário'];
    const itens: Record<string, string[]> = {
      'Papita Delivery': ['batata', 'refrigerante'], 'Floricultura Primavera': ['mudas', 'vasos'],
      'Padaria Pão Quentinho': ['pão francês', 'sonhos'], 'Lavanderia Bolha': ['toalhas limpas'],
    };
    docs.push({ tipo: 'cracha', nome, empresa, funcao: 'Entregador', foto: { ...rosto } });
    docs.push({
      tipo: 'ordem',
      empresa: defeito === 'empresaTrocada' ? escolher(rnd, empresas.filter((e) => e !== empresa)) : empresa,
      destino: defeito === 'destinoInexistente' ? escolher(rnd, ['Sala de Boliche', 'Pista de Kart', 'Cinema do Clube']) : escolher(rnd, destinos),
      itens: itens[empresa],
    });
  }
  v.docs = docs;
  v.espera = defeito === 'exameVencido' ? 'soClube' : defeito && defeito !== 'itemProibido' ? 'hojeNao' : 'entra';
  return { visitante: v, lista };
}

/** os defeitos que cabem num papel */
const DEFEITOS_DO_PAPEL: Readonly<Record<PapelDoFigurante, readonly DefeitoDoFigurante[]>> = {
  socio: ['vencida', 'fotoDeOutro', 'foraDaLista', 'suspenso', 'numeroChutado', 'exameVencido', 'itemProibido'],
  convidado: ['conviteDeAmanha', 'socioSuspenso', 'convidadoTrocado'],
  entregador: ['empresaTrocada', 'destinoInexistente'],
};

// ================================================================ montar o dia

export interface DiaMontado {
  dia: DiaDaPortaria;
  /** a fila, na ordem */
  fila: Visitante[];
  /** as reservas (montadas, para quando a fila chamar) */
  reservas: Readonly<Record<string, Visitante>>;
  /** o que a conferência precisa (a lista de hoje já com os figurantes) */
  contexto: ContextoDoDia;
  cenas: CenaDoDia[];
}

/**
 * MONTA UM DIA: o roteiro (com os fatos da semana), os figurantes sorteados
 * pela semente e a prancheta de hoje. A mesma semente dá o mesmo dia.
 */
export function montarDia(n: number, semente: number, fatosDaSemana: ReadonlySet<Fato>): DiaMontado {
  const dia = diaPorNumero(n);
  if (!dia) throw new Error(`não existe o dia ${n}`);
  const rnd = sorteio(semente * 131 + n * 7919);
  const q: Quadro = { n, hoje: HOJE[n - 1], tem: (f) => fatosDaSemana.has(f) };
  const usados = new Set<string>();
  const especiesUsadas = new Map<EspecieFigurante, number>();
  const numeros = new Set<string>(SOCIOS.map((s) => s.numero));
  const lista: LinhaDaLista[] = [...SOCIOS];
  if (n >= 6) lista.push(BETO_SOCIO);

  const fila: Visitante[] = [];
  let i = 0;
  const comFigurante = (papel: PapelDoFigurante, defeito: DefeitoDoFigurante | null): void => {
    const s = montarFigurante(rnd, n, i++, papel, defeito, usados, numeros, especiesUsadas);
    fila.push(s.visitante);
    lista.push(...s.lista);
  };
  const sortearDefeito = (papel: PapelDoFigurante): DefeitoDoFigurante | null => {
    const cabem = dia.defeitos.filter((d) => DEFEITOS_DO_PAPEL[papel].includes(d));
    // um terço com defeito (§13)
    return cabem.length && rnd() < 0.34 ? escolher(rnd, cabem) : null;
  };
  for (const e of dia.roteiro) {
    if (e.tipo === 'roteiro') {
      const v = e.montar(q);
      if (v) fila.push(v);
    } else {
      comFigurante(e.papel, e.defeito === 'sorteio' ? sortearDefeito(e.papel) : e.defeito);
    }
  }
  // os figurantes extras, sorteados entre os do roteiro (nunca antes do primeiro: a Gina ensina com ele)
  for (let k = 0; k < dia.figurantesExtras; k++) {
    const papel: PapelDoFigurante = n >= 4 && rnd() < 0.3 ? 'entregador' : n >= 3 && rnd() < 0.35 ? 'convidado' : 'socio';
    const antesDe = fila.length;
    comFigurante(papel, sortearDefeito(papel));
    const v = fila.pop()!;
    fila.splice(1 + Math.floor(rnd() * (antesDe - 1)), 0, v);
  }
  const reservas: Record<string, Visitante> = {};
  for (const [id, montar] of Object.entries(dia.reservas ?? {})) reservas[id] = montar(q);

  const contexto: ContextoDoDia = {
    hoje: HOJE[n - 1],
    regras: new Set(dia.regras),
    ferramentas: new Set(dia.ferramentas),
    lista: lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
  };
  const cenas = (dia.cenas ?? []).filter((c) => !c.quando || fatosDaSemana.has(c.quando));
  return { dia, fila, reservas, contexto, cenas };
}

/** o carimbo esperado dos visitantes que o roteiro declara à mão (para o teste) */
export type Esperado = Readonly<Record<string, Carimbo>>;

/**
 * O CHAMADO DA FILA (§9, "na hora"): depois de carimbar o visitante da posição
 * `i`, quem ele chama entra na fila `depois` atendimentos adiante — e quem ele
 * tira sai (o Bento de sempre dá lugar ao Bento sem carteirinha). Devolve a
 * fila nova (a de entrada não muda).
 */
export function chamarNaFila(
  fila: readonly Visitante[], i: number, carimbo: Carimbo, reservas: Readonly<Record<string, Visitante>>,
): Visitante[] {
  const v = fila[i];
  const c = v?.chama;
  const id = c ? (carimbo === 'hojeNao' ? c.seBarrar : c.seEntrar) : undefined;
  if (!c || !id || !reservas[id]) return [...fila];
  const nova = fila.filter((x, k) => k <= i || x.id !== c.tira);
  nova.splice(Math.min(nova.length, i + 1 + c.depois), 0, reservas[id]);
  return nova;
}
