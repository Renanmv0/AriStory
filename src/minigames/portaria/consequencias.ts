/**
 * AS CONSEQUÊNCIAS — o que volta das decisões da dupla (§9 do plano).
 *
 * Três lugares: NA HORA (o mundo reage: o pagode na piscina, o Noel de verdade
 * chegando — `EFEITOS_NA_HORA` e os chamados da fila), no FIM DO DIA (o
 * envelope da Gina, linha por linha, e o Boletim do Clube com as manchetes do
 * que aconteceu) e NOS DIAS SEGUINTES (os fatos gravados no save mudam quem
 * volta e como — `semana.ts`).
 */
import { carimboCerto, diferencas, fichaDe, proibidosNaSacola, type ContextoDoDia, type Diferenca, type Visitante } from './conferencia';
import { DIAS, diaPorNumero, type DiaDaPortaria } from './semana';
import { NOME_DO_ITEM, RELOGIO, VALOR, type Assunto, type Carimbo, type Fato, type ItemDaSacola, type Pista } from './tipos';

// ================================================================ um atendimento

/** o que a dupla FEZ com um visitante */
export interface Atendimento {
  visitante: Visitante;
  /** `null`: a fila acabou antes dele (17h) */
  carimbo: Carimbo | null;
  perguntas: readonly Assunto[];
  /** cada apontada, e se era diferença de verdade */
  apontados: ReadonlyArray<{ pistas: readonly [Pista, Pista]; diferenca: Diferenca | null }>;
  confiscados: readonly ItemDaSacola[];
  /** aceitou o agrado (a casquinha do Mano, a arepita da Tia Liz) */
  aceitouOferta?: boolean;
}

export type TipoDeErro = 'entrouQuemNaoPodia' | 'barrouQuemPodia' | 'carimboTrocado' | 'itemPassou' | 'agrado';

/** uma linha do envelope */
export interface LinhaDoEnvelope {
  valor: number;
  texto: string;
}

export interface AvaliacaoDoAtendimento {
  certo: boolean;
  carimboCerto: Carimbo;
  linhas: LinhaDoEnvelope[];
  erros: TipoDeErro[];
  /** errar com ele custa a terceira estrela */
  caro: boolean;
  fatos: Fato[];
  /** apontou uma diferença de verdade (a confissão, o achado) */
  achou: boolean;
}

/**
 * QUEM É, NO ENVELOPE: o nome de VERDADE (o da ficha, para os personagens com
 * nome), e não o que ele disse na janela — o Beto que dizia ser o Bento aparece
 * como "Beto (dizendo ser Bento)". O figurante não tem ficha com nome: vale o dele.
 */
export function quemNoEnvelope(v: Visitante): string {
  const ficha = fichaDe(v);
  const figurante = ficha.nome === ficha.nome.toLowerCase();
  if (figurante) return v.nome;
  return ficha.nome === v.nome ? ficha.nome : `${ficha.nome} (dizendo ser ${v.nome})`;
}

/** o fato que um proibido grava quando passa, se o visitante não tem um próprio */
const FATO_DO_ITEM: Partial<Record<ItemDaSacola, Fato>> = {
  caixaDeSom: 'som-alto-na-piscina',
  copoDeVidro: 'copo-quebrado',
  sabaoDeBolha: 'espuma-na-piscina',
  bolaDeFutebol: 'bola-na-piscina',
};

const AGRADO_PERMITIDO = (v: Visitante, certo: Carimbo): boolean => certo !== 'hojeNao' && v.oferta?.item === 'arepita';

/**
 * AVALIA UM ATENDIMENTO: o carimbo contra o certo, as linhas do envelope
 * (o certo paga, o achado paga mais, o erro desconta), os erros e os fatos.
 */
export function avaliarAtendimento(at: Atendimento, ctx: ContextoDoDia): AvaliacaoDoAtendimento {
  const v = at.visitante;
  const nome = quemNoEnvelope(v);
  /** o nome curto, para as linhas de bônus */
  const curto = fichaDe(v).nome === fichaDe(v).nome.toLowerCase() ? v.nome : fichaDe(v).nome;
  const certo = carimboCerto(v, ctx);
  const linhas: LinhaDoEnvelope[] = [];
  const erros: TipoDeErro[] = [];
  const fatos: Fato[] = [];
  const f = v.fatos ?? {};
  const achados = at.apontados.filter((a) => a.diferenca);
  const achou = achados.length > 0;

  if (at.carimbo === null) {
    return { certo: false, carimboCerto: certo, linhas, erros, caro: false, fatos, achou: false };
  }

  // ---- o carimbo
  const passou = at.carimbo !== 'hojeNao';
  if (at.carimbo === certo) {
    linhas.push({
      valor: VALOR.certo,
      texto: certo === 'hojeNao' ? `barrou ${nome} com razão` : certo === 'soClube' ? `${nome}, só o clube (sem piscina)` : `${nome}, tudo certo`,
    });
    // o achado: um só bônus por visitante, o maior
    const real = achados.find((a) => a.diferenca && !a.diferenca.aparente);
    const aparente = achados.find((a) => a.diferenca?.aparente);
    if (real && certo === 'hojeNao') {
      const pelaResposta = real.pistas.some((p) => p.startsWith('transcricao:'));
      const desfecho = v.desfecho ?? fichaDe(v).desfecho;
      linhas.push(pelaResposta
        ? { valor: VALOR.mentiraPega, texto: `a resposta que não batia (${curto})` }
        : { valor: VALOR.confissao, texto: desfecho === 'confessa' ? `a confissão (${curto})` : `pegou no pulo (${curto})` });
    } else if (aparente) {
      linhas.push({ valor: VALOR.achado, texto: v.escondido ? 'achou quem estava escondido' : `${curto} se corrigiu` });
    }
  } else if (passou && certo === 'hojeNao') {
    erros.push('entrouQuemNaoPodia');
    linhas.push({ valor: VALOR.entrouQuemNaoPodia, texto: `${nome} entrou sem poder` });
  } else if (!passou) {
    erros.push('barrouQuemPodia');
    linhas.push({ valor: VALOR.barrouQuemPodia, texto: `barrou ${nome} sem motivo` });
  } else {
    erros.push('carimboTrocado');
    linhas.push({ valor: VALOR.carimboTrocado, texto: certo === 'soClube' ? `${nome} foi pra piscina sem exame` : `${nome} ficou sem piscina à toa` });
  }

  // ---- a sacola: o proibido que não foi para os achados passou junto
  if (passou) {
    for (const item of proibidosNaSacola(v, ctx)) {
      if (at.confiscados.includes(item)) continue;
      erros.push('itemPassou');
      linhas.push({ valor: VALOR.itemPassou, texto: `o(a) ${NOME_DO_ITEM[item]} passou na sacola` });
      const proprios = f.passou?.[item];
      fatos.push(...(proprios ?? (FATO_DO_ITEM[item] ? [FATO_DO_ITEM[item]!] : [])));
    }
  }

  // ---- o agrado
  if (v.oferta && at.aceitouOferta !== undefined) {
    if (at.aceitouOferta) {
      fatos.push(...(f.aceitou ?? []));
      if (!AGRADO_PERMITIDO(v, certo)) {
        erros.push('agrado');
        linhas.push({ valor: VALOR.agrado, texto: `aceitou a ${v.oferta.item} de ${nome}` });
      }
    } else fatos.push(...(f.recusou ?? []));
  }

  // ---- os fatos da decisão
  fatos.push(...(passou ? f.entrou ?? [] : f.barrado ?? []));
  if (achou) fatos.push(...(f.apontado ?? []));

  return { certo: at.carimbo === certo && !erros.length, carimboCerto: certo, linhas, erros, caro: !!v.caro && erros.length > 0, fatos, achou };
}

// ================================================================ o fim do dia

export interface Manchete {
  titulo: string;
  linha: string;
  tom: 'bom' | 'ruim';
  /** quanto ela pesa no Boletim (as maiores consequências saem na frente); 1 se não disser */
  peso?: number;
}

/** as manchetes que um FATO do dia pode dar (o Boletim do Clube, §9) */
export const MANCHETES: Readonly<Record<Fato, Manchete>> = {
  // ---- as ruins (consequência de erro)
  'hipolito-entrou-vencido': { titulo: 'SÓCIO COM CARTEIRINHA DE 1998 É VISTO NO TRAMPOLIM', linha: 'Seu Hipólito: "vencida não, madura".', tom: 'ruim', peso: 2 },
  'noel-barrado': { titulo: 'SUCO ATRASADO: NOEL BARRADO NA PRÓPRIA PORTARIA', linha: 'Três caixas de laranja esperaram na calçada.', tom: 'ruim' },
  'josefina-barrada': { titulo: 'AS HORTÊNSIAS MURCHARAM', linha: 'A jardineira passou a manhã dentro do casco.', tom: 'ruim' },
  'capy-barrado': { titulo: 'PISCINA FICA SEM SALVA-VIDAS POR MEIA HORA', linha: 'O Capy esperou na calçada, de capacete e tudo.', tom: 'ruim', peso: 2 },
  'alpacina-barrada-pelo-penteado': { titulo: 'ALPACA BARRADA POR CAUSA DO PENTEADO', linha: '"O rosto era o mesmo, amores", desabafa Dona Alpacina.', tom: 'ruim' },
  'jeanluc-entrou-com-paris': { titulo: 'TORNEIO DE PING PONG CLANDESTINO NO DEQUE', linha: 'Um pato de boina diz que é sócio "em Paris".', tom: 'ruim' },
  'beto-entrou-com-a-do-bento': { titulo: 'GÊMEO ENTRA NO LUGAR DO IRMÃO', linha: 'Ninguém reparou na pinta da orelha.', tom: 'ruim', peso: 2 },
  'bento-sem-carteirinha': { titulo: 'SÓCIO BARRADO POR CULPA DO IRMÃO', linha: 'Bento: "isso não está nos conformes".', tom: 'ruim', peso: 2 },
  'preguica-barrada': { titulo: 'VOVÓ BARRADA NA PORTARIA', linha: 'Dona Preguiça foi embora devagarinho. Muito devagarinho.', tom: 'ruim', peso: 3 },
  'mano-entrou-sem-convite': { titulo: 'PINGUIM SEM CONVITE ABRE FILA DE SORVETE NA PISCINA', linha: 'A fila do Mano ficou maior que a da portaria.', tom: 'ruim' },
  'mano-casquinha-aceita': { titulo: 'PORTEIRO FLAGRADO DE BIGODE DE SORVETE', linha: 'Morango. A Gina pigarreou.', tom: 'ruim', peso: 2 },
  'hipolito-entrou-de-convidado': { titulo: 'SÓCIO CONVIDA A SI MESMO E ENTRA', linha: '"Quem é mais da minha confiança do que eu?"', tom: 'ruim' },
  'adubo-barrado': { titulo: 'ESTUFA SEM ADUBO', linha: 'A Josefina conversou com as plantas pra elas não ficarem tristes.', tom: 'ruim' },
  'carne-barrada': { titulo: 'MANIA SERVE SÓ SALADA', linha: 'A carne não passou da portaria. O Walter latiu baixinho o dia inteiro.', tom: 'ruim', peso: 3 },
  'gelo-barrado': { titulo: 'SUCO QUENTE! BAR DO NOEL FICA SEM GELO', linha: '"GLUGLU!", declarou o proprietário.', tom: 'ruim' },
  'alpacona-entrou': { titulo: 'ALPACA ENTRA COM A CARTEIRINHA DA PRIMA', linha: 'A pinta do focinho ficou em casa.', tom: 'ruim', peso: 2 },
  'tata-perdido-no-boliche': { titulo: 'ENTREGADOR PROCURA BOLICHE HÁ CINCO HORAS', linha: 'O clube não tem boliche. O Tatá ainda não sabe.', tom: 'ruim', peso: 2 },
  'baile-do-hipopotamo': { titulo: 'BAILE DO HIPOPÓTAMO NA PISCINA', linha: 'Vizinhos reclamam do pagode. O Capy apitou 47 vezes.', tom: 'ruim', peso: 2 },
  'som-alto-na-piscina': { titulo: 'SOM ALTO NA PISCINA', linha: 'A caixa de som entrou pela portaria, dentro de uma sacola.', tom: 'ruim' },
  'espuma-na-piscina': { titulo: 'PISCINA VIRA BANHEIRA DE ESPUMA', linha: 'O Cookie pediu desculpas, baixinho.', tom: 'ruim', peso: 2 },
  'copo-quebrado': { titulo: 'COPO DE VIDRO QUEBRA NA BEIRA DA PISCINA', linha: 'O Capy isolou a área com cones e um apito.', tom: 'ruim' },
  'bola-na-piscina': { titulo: 'FUTEBOL NA PISCINA', linha: 'O gol era a boia de patinho.', tom: 'ruim' },
  'picoles-barrados': { titulo: 'PICOLÉS DERRETEM NA CALÇADA', linha: 'O Tatá deu uma estrela pra portaria.', tom: 'ruim' },
  'tializ-barrada': { titulo: 'TIA LIZ E AS MENINAS FICAM DE FORA DO DIA DA ESCOLA', linha: 'A Sol pulou de tristeza.', tom: 'ruim', peso: 3 },
  'dogoes-entraram': { titulo: 'GATITOS × DOGÕES TERMINA NA PISCINA', linha: 'Ninguém sabe quem ganhou. Todo mundo se molhou.', tom: 'ruim', peso: 2 },
  'jeanluc-disfarcado-entrou': { titulo: 'DOIS NOÉIS NO CLUBE', linha: 'Um deles tinha bico amarelo e jogava ping pong.', tom: 'ruim', peso: 3 },
  // ---- as boas
  'hipolito-barrado': { titulo: 'SÓCIO MAIS ANTIGO PROMETE RENOVAR A CARTEIRINHA', linha: '"Desde o brejo, mas renovada", disse Seu Hipólito.', tom: 'bom' },
  'hipolito-renovado-entrou': { titulo: 'SEU HIPÓLITO RENOVA A CARTEIRINHA', linha: 'Trouxe bolo pra Gina e a carteirinha erguida como troféu.', tom: 'bom', peso: 2 },
  'jeanluc-barrado-paris': { titulo: 'PATO FRANCÊS BARRADO: "C\'EST UNE CATASTROPHE!"', linha: 'A carteirinha era do Club de Ping-Pong de Paris.', tom: 'bom' },
  'beto-pego': { titulo: 'GÊMEO PEGO PELO NÚMERO', linha: 'O Beto chutou "0127". O Bento é 0215.', tom: 'bom', peso: 2 },
  'mano-casquinha-recusada': { titulo: 'PORTEIRO RECUSA CASQUINHA: "REGRA É REGRA"', linha: 'O Mano respeitou e saiu dançando.', tom: 'bom' },
  'luna-achada': { titulo: 'PORTARIA ACHA A LUNA ATRÁS DA TIA LIZ', linha: 'A turma inteira entrou de mãos dadas.', tom: 'bom', peso: 2 },
  'disfarce-descoberto': { titulo: 'BIGODE FALSO CAI NA PORTARIA', linha: 'Jean-Luc: "c\'est une catastrophe". O Noel de verdade agradece.', tom: 'bom', peso: 3 },
  'rocco-barrado': { titulo: 'DOGÕES BARRADOS NO DIA DA ESCOLA', linha: 'O Rocco uivou. O Flynn mandou um "toca aqui" pela grade.', tom: 'bom' },
};

/** as manchetes de sempre, pelo resumo do dia (quando os fatos não dão três) */
function manchetesDoResumo(r: ResumoDoDia): Manchete[] {
  const ms: Manchete[] = [];
  if (r.erros === 0 && r.atendidos > 0) ms.push({ titulo: 'PORTARIA EXEMPLAR: NENHUM ERRO HOJE', linha: 'A Gina já fala em férias.', tom: 'bom' });
  if (r.atendidos === r.total) ms.push({ titulo: 'FILA ZERADA ANTES DAS CINCO', linha: 'Nem a Dona Preguiça segurou a fila.', tom: 'bom' });
  if (r.achados >= 2) ms.push({ titulo: 'OLHO DE ÁGUIA NA GUARITA', linha: `${r.achados} diferenças pegas na lupa.`, tom: 'bom' });
  if (r.entrouQuemNaoPodia >= 2) ms.push({ titulo: 'PENETRAS NA PISCINA', linha: `${r.entrouQuemNaoPodia} entraram sem poder.`, tom: 'ruim' });
  if (r.barrouQuemPodia >= 2) ms.push({ titulo: 'SÓCIOS RECLAMAM DA PORTARIA', linha: `${r.barrouQuemPodia} barrados sem motivo.`, tom: 'ruim' });
  if (r.atendidos < r.total) ms.push({ titulo: 'FILA DOBRA A ESQUINA', linha: `${r.total - r.atendidos} ficaram para amanhã.`, tom: 'ruim' });
  ms.push({ titulo: 'MAIS UM DIA NA PORTARIA', linha: 'O catavento girou, a cancela subiu, a Gina apitou.', tom: 'bom' });
  return ms;
}

export interface ResumoDoDia {
  total: number;
  atendidos: number;
  certos: number;
  erros: number;
  achados: number;
  entrouQuemNaoPodia: number;
  barrouQuemPodia: number;
  /** errou com quem é caro (a Dona Preguiça, a carne, a Tia Liz) */
  erroCaro: boolean;
}

export interface FimDoDia {
  resumo: ResumoDoDia;
  /** o envelope da Gina, linha por linha */
  linhas: LinhaDoEnvelope[];
  /** o total que vai para a carteira (nunca negativo) */
  total: number;
  estrelas: 1 | 2 | 3;
  fatos: Fato[];
  /** o Boletim do Clube: até três manchetes, as ruins primeiro */
  boletim: Manchete[];
  /** a Gina comenta: a abertura e a fala do fim */
  falaDaGina: readonly string[];
}

/**
 * AS ESTRELAS DO DIA (§12): três com a fila inteira atendida, no máximo um
 * erro e nenhum erro caro; duas com 70% de certos e 80% da fila; uma por
 * terminar. As estrelas são só para os prêmios: o dia seguinte abre por
 * TERMINAR (decisão do Renan).
 */
export function estrelasDoDia(r: ResumoDoDia): 1 | 2 | 3 {
  if (r.atendidos === r.total && r.erros <= 1 && !r.erroCaro) return 3;
  if (r.total > 0 && r.certos / r.total >= 0.7 && r.atendidos / r.total >= 0.8) return 2;
  return 1;
}

/** FECHA O DIA: soma o envelope, dá as estrelas, junta os fatos e escolhe as manchetes */
export function fecharODia(dia: DiaDaPortaria, atendimentos: readonly Atendimento[], ctx: ContextoDoDia): FimDoDia {
  const avs = atendimentos.map((a) => avaliarAtendimento(a, ctx));
  const linhas = avs.flatMap((a) => a.linhas);
  const fatos = [...new Set(avs.flatMap((a) => a.fatos))];
  const atendidos = atendimentos.filter((a) => a.carimbo !== null).length;
  const resumo: ResumoDoDia = {
    total: atendimentos.length,
    atendidos,
    certos: avs.filter((a) => a.certo).length,
    erros: avs.reduce((s, a) => s + a.erros.length, 0),
    achados: avs.filter((a) => a.achou).length,
    entrouQuemNaoPodia: avs.filter((a) => a.erros.includes('entrouQuemNaoPodia')).length,
    barrouQuemPodia: avs.filter((a) => a.erros.includes('barrouQuemPodia')).length,
    erroCaro: avs.some((a) => a.caro),
  };
  const soma = linhas.reduce((s, l) => s + l.valor, 0);
  const estrelas = estrelasDoDia(resumo);
  const doDia = fatos.map((f) => MANCHETES[f]).filter((m): m is Manchete => !!m)
    .sort((a, b) => (b.peso ?? 1) - (a.peso ?? 1));
  const ruins = doDia.filter((m) => m.tom === 'ruim');
  const boas = doDia.filter((m) => m.tom === 'bom');
  const doResumo = manchetesDoResumo(resumo);
  const boletim = [...ruins.slice(0, 2), ...boas, ...doResumo]
    .filter((m, i, todas) => todas.findIndex((x) => x.titulo === m.titulo) === i)
    .slice(0, 3);
  return {
    resumo, linhas, total: Math.max(0, soma), estrelas, fatos, boletim,
    falaDaGina: estrelas === 3 ? dia.gina.fimBom : dia.gina.fimRuim,
  };
}

// ============================================================== o relógio

/**
 * QUANTO TEMPO UM DIA LEVA (segundos de verdade): a régua de cada atendimento
 * mais os minutos de relógio do que se perguntou e apontou (e dos cochilos da
 * Dona Preguiça). É a conta que diz se as três estrelas (a fila inteira)
 * cabem no expediente.
 */
export function estimarOTempo(dia: DiaDaPortaria, atendimentos: readonly Atendimento[]): number {
  const porMinuto = dia.segundos / (RELOGIO.fecha - RELOGIO.abre);
  let minutos = 0;
  for (const a of atendimentos) {
    if (a.carimbo === null) continue;
    const vistas = new Set<string>();
    for (const p of a.perguntas) {
      minutos += vistas.has(p) ? RELOGIO.perguntaRepetida : RELOGIO.pergunta;
      if (fichaDe(a.visitante).jeito === 'dorminhoco') minutos += RELOGIO.cochilo;
      vistas.add(p);
    }
    for (const ap of a.apontados) minutos += ap.diferenca ? RELOGIO.apontar : RELOGIO.apontarAToa;
  }
  const atendidos = atendimentos.filter((a) => a.carimbo !== null).length;
  return atendidos * RELOGIO.segundosPorVisitante + minutos * porMinuto;
}

// ================================================================ na hora

/**
 * OS EFEITOS NA HORA (§9, o primeiro lugar): o que o mundo faz assim que um
 * fato acontece, ainda no mesmo dia. A cena acha o efeito pelo nome.
 */
export const EFEITOS_NA_HORA: Readonly<Record<Fato, string>> = {
  'baile-do-hipopotamo': 'pagodeNaPiscina',
  'som-alto-na-piscina': 'pagodeNaPiscina',
  'espuma-na-piscina': 'bolhasAtrasDoMuro',
  'copo-quebrado': 'apitoDoCapy',
  'bola-na-piscina': 'apitoDoCapy',
  'tata-perdido-no-boliche': 'tataPerdidoNaFila',
  'carne-barrada': 'walterTriste',
  'mano-entrou-sem-convite': 'musiquinhaDoSorvete',
  'dogoes-entraram': 'gritoDosDogoes',
};

// =============================================================== as falas de apoio

/** o PARCEIRO cutuca (§10): a dica de cada problema, sem dar a resposta inteira */
export const DICAS_DO_PARCEIRO: Readonly<Record<string, string>> = {
  vencida: 'Olha a data dessa carteirinha… e olha o calendário.',
  fotoNaoBate: 'Essa foto… é ele mesmo? Repara na cor. E na marca.',
  rostoTapado: 'Não dá pra ver a cara direito. Pede pra tirar.',
  outroClube: 'Esse escudo aí não é o do nosso clube, é?',
  foraDaLista: 'Procura esse número na prancheta.',
  numeroTrocado: 'O número da carteirinha bate com o da lista?',
  suspenso: 'Dá uma olhada na prancheta: tem risco nesse nome?',
  respostaNaoBate: 'Ele respondeu uma coisa e o papel diz outra…',
  conviteDeOutroDia: 'Esse convite é pra hoje mesmo?',
  conviteDeSiMesmo: 'Peraí… quem convidou e quem foi convidado são a mesma pessoa?',
  socioDoConviteSuspenso: 'Quem convidou tá riscado na lista.',
  socioDoConviteInexistente: 'Esse sócio que convidou existe na prancheta?',
  naoEstaNoConvite: 'Esse nome tá no convite coletivo?',
  alguemEscondido: 'Conta quantos são… acho que tem alguém escondido.',
  empresaTrocada: 'A empresa do crachá é a mesma da ordem?',
  destinoInexistente: 'Esse lugar existe no clube? Olha no manual.',
  semDocumento: 'Ele não entregou documento nenhum.',
  exameVencido: 'O exame da piscina tá vencido. Clube sim, piscina não.',
  itemProibido: 'Tem coisa proibida nessa sacola.',
  tudoCerto: 'Acho que tá tudo certo com esse aqui.',
};

/** a dica do parceiro para este visitante: a primeira diferença de verdade (ou o proibido da sacola), senão "tudo certo" */
export function dicaDoParceiro(v: Visitante, ctx: ContextoDoDia): string {
  const d = diferencas(v, ctx).find((x) => !x.aparente) ?? diferencas(v, ctx)[0];
  if (d) return DICAS_DO_PARCEIRO[d.problema];
  if (proibidosNaSacola(v, ctx).length) return DICAS_DO_PARCEIRO.itemProibido;
  return DICAS_DO_PARCEIRO.tudoCerto;
}

/** a fala de quando ele passa ou é barrado (a do dia, ou a da ficha) */
export function falaDaSaida(v: Visitante, carimbo: Carimbo): readonly string[] {
  const ficha = fichaDe(v);
  return carimbo === 'hojeNao' ? v.barrado ?? ficha.barrado : v.entra ?? ficha.entra;
}

// ================================================================ o save

/** o pedaço do `GameAPI` que o progresso usa (o mesmo do Mania) */
export interface SaveDaPortaria {
  stat(key: string): number;
  bump(key: string, by?: number): number;
  flag(key: string): boolean;
  setFlag(key: string, value?: boolean): void;
}

export const CHAVE = {
  vezes: (n: number) => `portaria:dia:${n}:vezes`,
  estrelas: (n: number) => `portaria:dia:${n}:estrelas`,
  recorde: (n: number) => `portaria:dia:${n}:recorde`,
  fato: (n: number, f: Fato) => `portaria:fato:${n}:${f}`,
} as const;

/** o dia está aberto na escala: o primeiro sempre, os outros quando o anterior TERMINOU (decisão do Renan) */
export function diaAberto(s: SaveDaPortaria, n: number): boolean {
  return n <= 1 || s.stat(CHAVE.vezes(n - 1)) > 0;
}

/** os fatos da semana ANTES do dia `n` (o que muda o roteiro dele) */
export function fatosAntesDoDia(s: SaveDaPortaria, n: number): Set<Fato> {
  const fs = new Set<Fato>();
  for (const dia of DIAS) {
    if (dia.numero >= n) break;
    for (const f of dia.fatos) if (s.flag(CHAVE.fato(dia.numero, f))) fs.add(f);
  }
  return fs;
}

const subirPara = (s: SaveDaPortaria, chave: string, valor: number): boolean => {
  const antes = s.stat(chave);
  if (valor <= antes) return false;
  s.bump(chave, valor - antes);
  return true;
};

export interface RegistroDoDia {
  /** a primeira vez das três estrelas neste dia: a hora do prêmio */
  primeiraVezTres: boolean;
  /** o dia seguinte acabou de abrir */
  abriu: number | null;
  /** a semana acabou de terminar pela primeira vez (o selo e a plaquinha) */
  semanaTerminada: boolean;
  recorde: boolean;
}

/**
 * GRAVA O FIM DE UM DIA: as vezes, as melhores estrelas, o recorde do envelope
 * e os FATOS dele — refazer um dia troca os fatos dele pelos da vez nova (o
 * passado da semana é o da última vez jogada).
 */
export function registrarODia(s: SaveDaPortaria, n: number, fim: FimDoDia): RegistroDoDia {
  const dia = diaPorNumero(n);
  if (!dia) throw new Error(`não existe o dia ${n}`);
  const tinhaTres = s.stat(CHAVE.estrelas(n)) >= 3;
  const abertoAntes = diaAberto(s, n + 1);
  const terminadaAntes = s.stat(CHAVE.vezes(DIAS.length)) > 0;
  s.bump(CHAVE.vezes(n), 1);
  subirPara(s, CHAVE.estrelas(n), fim.estrelas);
  const recorde = subirPara(s, CHAVE.recorde(n), fim.total);
  for (const f of dia.fatos) s.setFlag(CHAVE.fato(n, f), fim.fatos.includes(f));
  return {
    primeiraVezTres: fim.estrelas === 3 && !tinhaTres,
    abriu: diaPorNumero(n + 1) && !abertoAntes ? n + 1 : null,
    semanaTerminada: n === DIAS.length && !terminadaAntes,
    recorde,
  };
}

// ================================================================ os prêmios

/** o prêmio das três estrelas de cada dia (§12; os dois ganham) */
export const PREMIOS: Readonly<Record<number, { icone: string; nome: string }>> = {
  1: { icone: '🪪', nome: 'Crachá da portaria' },
  2: { icone: '📯', nome: 'Apito dourado' },
  3: { icone: '🧢', nome: 'Quepe de porteiro' },
  4: { icone: '🦺', nome: 'Colete refletivo' },
  5: { icone: '🎟️', nome: 'Pulseira VIP' },
  6: { icone: '👔', nome: 'Uniforme da portaria' },
};

/** o prêmio de terminar a semana */
export const PREMIO_DA_SEMANA = { selo: 'selo-equipe-do-clube', plaquinha: 'Porteiros do mês' } as const;
