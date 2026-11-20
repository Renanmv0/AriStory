/**
 * OS CAMPOS DE CADA PAPEL — onde, na folha, mora cada pista que a lupa aponta.
 *
 * É dado puro (sem canvas): o pintor dos papéis (`world/papeisDaPortaria.ts`)
 * desenha cada campo no retângulo dele, e a mesa (`ui/mesaDaPortaria.ts`) põe o
 * alvo clicável no mesmo retângulo. O `id` do campo é a própria PISTA
 * (`doc:carteirinha:validade`), e o teste sem navegador confere que toda pista
 * que a conferência pode pedir tem onde ser tocada.
 *
 * Os retângulos são em FRAÇÃO da folha (0 a 1), para a folha valer em qualquer
 * tamanho: pequena na bancada, grande na tela.
 */
import type { Assunto, Pista, TipoDeDocumento } from './tipos';
import type { Regra } from './conferencia';

export interface CampoDoPapel {
  pista: Pista;
  /** o que a lupa diz quando passa por cima */
  rotulo: string;
  /** o retângulo na folha, em fração (x, y, largura, altura) */
  x: number;
  y: number;
  l: number;
  a: number;
}

/** a proporção de cada papel (largura / altura) e os campos dele */
export interface FormatoDoPapel {
  proporcao: number;
  campos: readonly CampoDoPapel[];
}

export const PAPEIS: Readonly<Record<TipoDeDocumento, FormatoDoPapel>> = {
  carteirinha: {
    proporcao: 1.6,
    campos: [
      { pista: 'doc:carteirinha:escudo', rotulo: 'o escudo', x: 0.03, y: 0.04, l: 0.94, a: 0.2 },
      { pista: 'doc:carteirinha:foto', rotulo: 'a foto', x: 0.05, y: 0.29, l: 0.3, a: 0.6 },
      { pista: 'doc:carteirinha:nome', rotulo: 'o nome', x: 0.39, y: 0.29, l: 0.57, a: 0.18 },
      { pista: 'doc:carteirinha:numero', rotulo: 'o número', x: 0.39, y: 0.5, l: 0.57, a: 0.17 },
      { pista: 'doc:carteirinha:validade', rotulo: 'a validade', x: 0.39, y: 0.7, l: 0.57, a: 0.18 },
    ],
  },
  convite: {
    proporcao: 1.42,
    campos: [
      { pista: 'doc:convite:convidado', rotulo: 'o convidado', x: 0.08, y: 0.3, l: 0.84, a: 0.16 },
      { pista: 'doc:convite:socio', rotulo: 'quem convidou', x: 0.08, y: 0.49, l: 0.56, a: 0.15 },
      { pista: 'doc:convite:numeroDoSocio', rotulo: 'o número de quem convidou', x: 0.66, y: 0.49, l: 0.26, a: 0.15 },
      { pista: 'doc:convite:data', rotulo: 'a data', x: 0.08, y: 0.68, l: 0.84, a: 0.15 },
    ],
  },
  conviteColetivo: {
    proporcao: 0.72,
    campos: [
      { pista: 'doc:conviteColetivo:socio', rotulo: 'quem convidou', x: 0.08, y: 0.17, l: 0.58, a: 0.08 },
      { pista: 'doc:conviteColetivo:numeroDoSocio', rotulo: 'o número de quem convidou', x: 0.68, y: 0.17, l: 0.24, a: 0.08 },
      { pista: 'doc:conviteColetivo:nomes', rotulo: 'os nomes da turma', x: 0.08, y: 0.3, l: 0.84, a: 0.5 },
      { pista: 'doc:conviteColetivo:data', rotulo: 'a data', x: 0.08, y: 0.84, l: 0.84, a: 0.09 },
    ],
  },
  cracha: {
    proporcao: 0.66,
    campos: [
      { pista: 'doc:cracha:empresa', rotulo: 'a empresa', x: 0.05, y: 0.1, l: 0.9, a: 0.14 },
      { pista: 'doc:cracha:foto', rotulo: 'a foto', x: 0.2, y: 0.27, l: 0.6, a: 0.38 },
      { pista: 'doc:cracha:nome', rotulo: 'o nome', x: 0.05, y: 0.68, l: 0.9, a: 0.13 },
    ],
  },
  ordem: {
    proporcao: 0.78,
    campos: [
      { pista: 'doc:ordem:empresa', rotulo: 'a empresa', x: 0.06, y: 0.04, l: 0.88, a: 0.14 },
      { pista: 'doc:ordem:destino', rotulo: 'o destino', x: 0.06, y: 0.27, l: 0.88, a: 0.15 },
      { pista: 'doc:ordem:itens', rotulo: 'o que leva', x: 0.06, y: 0.47, l: 0.88, a: 0.3 },
    ],
  },
  exame: {
    proporcao: 0.78,
    campos: [
      { pista: 'doc:exame:nome', rotulo: 'o nome', x: 0.06, y: 0.33, l: 0.88, a: 0.14 },
      { pista: 'doc:exame:validade', rotulo: 'a validade', x: 0.06, y: 0.55, l: 0.88, a: 0.14 },
    ],
  },
};

/**
 * OS ALVOS DE FORA DOS PAPÉIS: o rosto na janela, o calendário da parede, a
 * prancheta, a bancada vazia e as regras do manual. A transcrição é
 * `transcricao:<assunto>` (uma linha por pergunta feita).
 */
export const ALVOS_DA_MESA: readonly { pista: Pista; rotulo: string }[] = [
  { pista: 'rosto', rotulo: 'o rosto na janela' },
  { pista: 'calendario', rotulo: 'o calendário (hoje)' },
  { pista: 'lista', rotulo: 'a lista de sócios' },
  { pista: 'bancada', rotulo: 'a bancada vazia' },
  { pista: 'manual:escudo', rotulo: 'o manual: o escudo do clube' },
  { pista: 'manual:destinos', rotulo: 'o manual: os lugares do clube' },
  { pista: 'manual:documentos', rotulo: 'o manual: quem pode entrar' },
];

export const pistaDaTranscricao = (a: Assunto): Pista => `transcricao:${a}`;

/** a pista tem onde ser tocada na mesa? (o teste cobra para toda pista da conferência) */
export function pistaTemAlvo(p: Pista): boolean {
  if (p.startsWith('transcricao:')) return true;
  if (ALVOS_DA_MESA.some((a) => a.pista === p)) return true;
  return Object.values(PAPEIS).some((f) => f.campos.some((c) => c.pista === p));
}

/** o rótulo de uma pista, para a lupa e o balão */
export function rotuloDaPista(p: Pista): string {
  if (p.startsWith('transcricao:')) return `o que ele respondeu (${p.slice('transcricao:'.length)})`;
  const fora = ALVOS_DA_MESA.find((a) => a.pista === p);
  if (fora) return fora.rotulo;
  for (const f of Object.values(PAPEIS)) {
    const c = f.campos.find((x) => x.pista === p);
    if (c) return c.rotulo;
  }
  return p;
}

/** O MANUAL DA PORTARIA: o texto de cada regra, na ordem em que os dias trazem */
export const TEXTO_DA_REGRA: Readonly<Record<Regra, string>> = {
  validade: 'A carteirinha tem que estar na validade: confira com o calendário de hoje.',
  foto: 'A foto tem que ser de quem está na janela — a mesma espécie, a mesma cor e a mesma marca. Penteado e enfeite não contam.',
  lista: 'O número da carteirinha tem que estar na lista de sócios, com o mesmo nome, e sem risco.',
  convite: 'Convidado entra com convite: com a data de hoje, e quem convidou tem que estar na lista.',
  entrega: 'Entregador entra com o crachá e a ordem de entrega da MESMA empresa, para um lugar que existe no clube.',
  exame: 'A piscina pede o exame em dia. Exame vencido: 🟡 SÓ O CLUBE.',
  sacola: 'O que não pode entrar vai para os achados (tire da sacola antes de carimbar).',
  coletivo: 'O convite coletivo vale para a turma toda: conte quem veio e confira os nomes.',
};

/** o escudo do clube, do jeito que o manual descreve */
export const TEXTO_DO_ESCUDO = 'A carteirinha do clube tem a faixa verde e o escudo dourado com a girafinha. Carteirinha de outro clube não vale aqui.';
