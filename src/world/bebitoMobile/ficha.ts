import { PALETTE as P } from '../../palette';

/**
 * ================================================ A FICHA DO BEBITO MOBILE
 *
 * O Bebito Mobile é o carro que o Renan dá de presente para o Ari
 * (`docs/BEBITO-MOBILE.md`). Ele NÃO é uma peça fixa no código: é uma FICHA
 * — a pintura, a placa e o que vai em cada VAGA do carro —, e o modelo
 * (`BebitoMobile.ts`) se monta lendo a ficha. É o mesmo princípio dos looks
 * da Valentina (`world/looksDaValentina.ts`) e do ateliê de tingimento
 * (`world/tintas.ts`): detalhe novo é uma entrada nova no catálogo, e trocar
 * um detalhe é trocar um id na ficha.
 *
 * A EDIÇÃO AINDA NÃO EXISTE (pedido do Renan: desenhar pensando nela, sem
 * fazer agora). O que já está pronto para ela:
 *
 *  - a ficha é SÓ DADO (números, textos e ids), e é ela que mora no save
 *    (`SaveState.fichaDoBebitoMobile`), com `normalizarFicha` na leitura:
 *    save antigo, de antes do carro, recebe a de fábrica; id que saiu do
 *    catálogo vira vaga vazia; cor ou placa torta volta ao padrão;
 *  - cada VAGA tem os seus LUGARES (os pontos de encaixe no modelo, com
 *    nome: `vaga:painel:0`…) e só aceita o tipo de coisa que cabe nela;
 *  - o catálogo diz DE ONDE vem cada referência (`origem`), para o painel de
 *    edição poder contar a história de cada enfeite.
 *
 * Este arquivo não conhece o three: o save o importa sem puxar geometria.
 */

/** as vagas do carro, na ordem em que o modelo as monta */
export const VAGAS_DO_CARRO = [
  'painel', 'retrovisor', 'chave', 'teto', 'portaMalas', 'bancoDeTras', 'vidroTraseiro', 'paraChoque', 'rodas',
] as const;
export type VagaDoCarro = (typeof VAGAS_DO_CARRO)[number];

export interface DefDaVaga {
  nome: string;
  /** quantos lugares a vaga tem (cada lugar é um ponto de encaixe no modelo) */
  lugares: number;
  /** o que cabe: uma peça 3D, um adesivo (pintura em canvas) ou um jogo de calotas */
  tipo: 'peca' | 'adesivo' | 'calota';
  /** onde fica, para o painel de edição */
  onde: string;
}

export const DEF_DAS_VAGAS: Readonly<Record<VagaDoCarro, DefDaVaga>> = {
  painel: { nome: 'Painel', lugares: 3, tipo: 'peca', onde: 'em cima do painel: do lado do passageiro, no meio e no canto do motorista' },
  retrovisor: { nome: 'Retrovisor', lugares: 2, tipo: 'peca', onde: 'pendurado no retrovisor de dentro' },
  chave: { nome: 'Chave', lugares: 1, tipo: 'peca', onde: 'o chaveiro, na chave da ignição' },
  teto: { nome: 'Teto', lugares: 1, tipo: 'peca', onde: 'no bagageiro, em cima do teto' },
  portaMalas: { nome: 'Porta-malas', lugares: 2, tipo: 'peca', onde: 'no tampão de trás, à vista pelo vidro' },
  bancoDeTras: { nome: 'Banco de trás', lugares: 2, tipo: 'peca', onde: 'em cima do banco de trás, um de cada lado' },
  vidroTraseiro: { nome: 'Vidro de trás', lugares: 2, tipo: 'adesivo', onde: 'nos dois cantos de baixo do vidro de trás' },
  paraChoque: { nome: 'Para-choque', lugares: 3, tipo: 'adesivo', onde: 'na tampa de trás, logo acima do para-choque' },
  rodas: { nome: 'Rodas', lugares: 1, tipo: 'calota', onde: 'as quatro calotas' },
};

export interface DetalheDoCarro {
  id: string;
  nome: string;
  vaga: VagaDoCarro;
  /** de onde vem a referência, no jogo */
  origem: string;
}

/**
 * O CATÁLOGO: tudo o que pode ir numa vaga. Hoje são só os detalhes que o
 * Renan e o Ari escolheram para o carro de fábrica; a edição futura cresce
 * esta lista (e o montador de cada id em `acessorios.ts`/`impressos.ts`).
 */
export const CATALOGO_DO_CARRO: readonly DetalheDoCarro[] = [
  { id: 'jean-luc-de-painel', nome: 'Jean-Luc de painel', vaga: 'painel', origem: 'o pato francês do lago do Villa Lobos, de boina, balançando a cabeça' },
  { id: 'girassol-da-josefina', nome: 'Girassol da Josefina', vaga: 'painel', origem: 'o girassol é a moeda da lojinha da estufa, e o laço rosa é o dela' },
  { id: 'estrela-do-ari', nome: 'Estrela do Ari', vaga: 'retrovisor', origem: 'a presilha de estrela do cabelo do Ari' },
  { id: 'pompom-dos-gatitos', nome: 'Pompom dos Gatitos', vaga: 'retrovisor', origem: 'o pompom azul e amarelo da Luna, da Sol e da Estrella' },
  { id: 'chaveiro-do-pelusa', nome: 'Chaveiro do Pelusa', vaga: 'chave', origem: 'o gato do Ari, branco e cinza' },
  { id: 'frisbee-e-raquetes', nome: 'Frisbee e raquetes', vaga: 'portaMalas', origem: 'o frisbee de sábado e as raquetes da mesa de ping pong do parque' },
  { id: 'bebito-book-e-livros', nome: 'Bebito book e os dois livros', vaga: 'bancoDeTras', origem: 'o caderninho da barraca, o Aristóteles e Dante do Ari e A Toca das Raposas do Renan' },
  { id: 'mantinha-da-estella', nome: 'Mantinha da Estella', vaga: 'bancoDeTras', origem: 'uma manta de lã costurada pela Estella, com o pote de biscoitinhos' },
  { id: 'emblema-dos-gatitos', nome: 'Emblema dos Gatitos', vaga: 'vidroTraseiro', origem: 'o escudo da atlética da Escola do Gatito' },
  { id: 'six-seven', nome: 'Six seven', vaga: 'vidroTraseiro', origem: 'o 67 do Gatito e do placar do ginásio' },
  { id: 'adesivo-da-roda-gigante', nome: 'Roda gigante', vaga: 'paraChoque', origem: 'a roda branca do Villa Lobos, onde os dois subiram na mesma cabine' },
  { id: 'adesivo-do-mania', nome: 'Mania de Churrasco', vaga: 'paraChoque', origem: 'o restaurante do Walter, achado pela porta dos fundos' },
  { id: 'adesivo-do-mano', nome: 'Sorvete do Mano', vaga: 'paraChoque', origem: 'a casquinha do quiosque do Mano: morango pro Ari, maracujá pro Renan' },
  { id: 'calota-classica', nome: 'Calota clássica', vaga: 'rodas', origem: 'a de fábrica: roda creme, calota de cromo e pneu de banda branca' },
];

const POR_ID = new Map(CATALOGO_DO_CARRO.map((d) => [d.id, d]));

export function detalheDoCarro(id: string): DetalheDoCarro | undefined {
  return POR_ID.get(id);
}

export interface PinturaDoCarro {
  /** a lataria (da cintura para baixo, e o capô) */
  lataria: number;
  /** o teto e as colunas */
  teto: number;
  /** os bancos */
  estofado: number;
}

export interface FichaDoBebitoMobile {
  pintura: PinturaDoCarro;
  /** o que está escrito na placa (até 7 letras e números) */
  placa: string;
  /** o id do detalhe em cada lugar de cada vaga (`null` é lugar vazio) */
  vagas: Record<VagaDoCarro, (string | null)[]>;
}

export const TAMANHO_DA_PLACA = 7;

/** o carro como os dois escolheram, em novembro de 2026 */
export const FICHA_DE_FABRICA: FichaDoBebitoMobile = {
  pintura: { lataria: P.bebitoAzulCeu, teto: P.bebitoCreme, estofado: P.bebitoEstofado },
  placa: 'BEBITO',
  vagas: {
    painel: ['girassol-da-josefina', 'jean-luc-de-painel', null],
    retrovisor: ['estrela-do-ari', 'pompom-dos-gatitos'],
    chave: ['chaveiro-do-pelusa'],
    // o bagageiro vai vazio de fábrica: a vaga existe, e a edição enche
    teto: [null],
    portaMalas: ['frisbee-e-raquetes', null],
    bancoDeTras: ['bebito-book-e-livros', 'mantinha-da-estella'],
    vidroTraseiro: ['emblema-dos-gatitos', 'six-seven'],
    paraChoque: ['adesivo-da-roda-gigante', 'adesivo-do-mania', 'adesivo-do-mano'],
    rodas: ['calota-classica'],
  },
};

/** uma cópia solta da ficha (a de fábrica nunca é mexida) */
export function copiarFicha(f: FichaDoBebitoMobile): FichaDoBebitoMobile {
  const vagas = {} as Record<VagaDoCarro, (string | null)[]>;
  for (const v of VAGAS_DO_CARRO) vagas[v] = [...f.vagas[v]];
  return { pintura: { ...f.pintura }, placa: f.placa, vagas };
}

const ehCor = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 0xffffff;

/** só letra maiúscula sem acento e número, no tamanho da placa; vazia volta a de fábrica */
export function normalizarPlaca(cru: unknown): string {
  if (typeof cru !== 'string') return FICHA_DE_FABRICA.placa;
  const limpa = cru.normalize('NFD').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, TAMANHO_DA_PLACA);
  return limpa || FICHA_DE_FABRICA.placa;
}

/**
 * A FICHA QUE VEM DO SAVE, venha o que vier: save de antes do carro (sem o
 * campo) recebe a de fábrica; vaga que falta recebe a de fábrica DELA (um
 * save de hoje aberto depois que o carro ganhar uma vaga nova); lugar a mais
 * é cortado e lugar a menos é completado com vazio; id que não existe mais,
 * ou que é de outra vaga, vira lugar vazio.
 */
export function normalizarFicha(cru: unknown): FichaDoBebitoMobile {
  const ficha = copiarFicha(FICHA_DE_FABRICA);
  if (!cru || typeof cru !== 'object' || Array.isArray(cru)) return ficha;
  const f = cru as Partial<FichaDoBebitoMobile>;
  if (f.pintura && typeof f.pintura === 'object') {
    for (const parte of ['lataria', 'teto', 'estofado'] as const) {
      const cor = (f.pintura as Partial<PinturaDoCarro>)[parte];
      if (ehCor(cor)) ficha.pintura[parte] = cor;
    }
  }
  ficha.placa = normalizarPlaca(f.placa);
  if (f.vagas && typeof f.vagas === 'object' && !Array.isArray(f.vagas)) {
    for (const vaga of VAGAS_DO_CARRO) {
      const lista = (f.vagas as Partial<Record<VagaDoCarro, unknown>>)[vaga];
      if (!Array.isArray(lista)) continue;
      ficha.vagas[vaga] = Array.from({ length: DEF_DAS_VAGAS[vaga].lugares }, (_, i) => {
        const id = lista[i];
        return typeof id === 'string' && POR_ID.get(id)?.vaga === vaga ? id : null;
      });
    }
  }
  return ficha;
}

/** as duas fichas dão o mesmo carro? (o modelo só se remonta quando a ficha muda) */
export function mesmaFicha(a: FichaDoBebitoMobile, b: FichaDoBebitoMobile): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
