/**
 * ============================================== A ROTA DE UMA VIAGEM DE CARRO
 *
 * A etapa C do Bebito Mobile (`docs/BEBITO-MOBILE.md`): a viagem entre a casa
 * do Ari e o Villa Lobos, com quem joga DIRIGINDO. Este arquivo é só a conta
 * — o caminho, os trechos de paisagem e o que acontece na pista —, sorteada
 * por uma semente: cada viagem sai diferente, e a mesma semente dá a mesma
 * viagem (é assim que o teste confere as regras em trezentas rotas, e que uma
 * foto reprovada pode ser repetida).
 *
 * Não conhece o three nem o motor: a cena (`scenes/viagemDeCarro.ts`) lê a
 * rota e monta o mundo.
 *
 * AS COORDENADAS DA PISTA: `s` é o quanto se andou (metros, de 0 ao
 * `comprimento`) e `l` é o lado (0 no meio da pista, positivo para a
 * DIREITA de quem dirige). A pista é de mão única, com duas faixas.
 */

export const SENTIDOS = ['ida', 'volta', 'parque-clube', 'clube-parque', 'casa-clube', 'clube-casa'] as const;
export type Sentido = typeof SENTIDOS[number];
export type DestinoDeCarro = 'casa' | 'parque' | 'clube';
export const destinoDaRota = (sentido: Sentido): DestinoDeCarro =>
  sentido === 'ida' || sentido === 'clube-parque' ? 'parque' : sentido === 'parque-clube' || sentido === 'casa-clube' ? 'clube' : 'casa';
export const rotaDoClube = (sentido: Sentido): boolean => sentido.includes('clube');
export type PersonagemNaEstrada = 'noel' | 'josefina' | 'capy';
/** Uma chance por partida: 30% Noel, 30% Josefina, 20% Capy, 20% sem encontro. */
export function sortearEncontro(semente: number, sentido: Sentido): PersonagemNaEstrada | null {
  const valor = sorteio(semente * 97 + SENTIDOS.indexOf(sentido) * 131 + 43)();
  return valor < 0.3 ? 'noel' : valor < 0.6 ? 'josefina' : valor < 0.8 ? 'capy' : null;
}

/** o pedido que a cena de partida deixa para a cena da viagem */
export interface PedidoDeViagem {
  /** `ida`: da casa do Ari ao Villa Lobos; `volta`: do parque para casa */
  sentido: Sentido;
  /** o id de quem dirige (`ari` ou `renan`) */
  motorista: string;
  semente: number;
}

let pedido: PedidoDeViagem | null = null;
export function pedirViagem(p: PedidoDeViagem): void {
  pedido = p;
}
export function pedidoDeViagem(): PedidoDeViagem | null {
  return pedido;
}

/** as medidas da pista */
export const PISTA = {
  /** a largura de uma faixa */
  faixa: 3.5,
  /** do meio da pista até a guia */
  meia: 3.5,
  /** a largura da calçada, de cada lado */
  calcada: 2.6,
  /** o meio de cada faixa: a da esquerda e a da direita */
  meios: [-1.75, 1.75],
  /** até onde o MEIO do carro pode ir (as rodas não sobem na guia) */
  limite: 2.3,
} as const;

/** os trechos de paisagem */
export type Bioma = 'bairro' | 'avenida' | 'parque' | 'hortas' | 'esportivo';
export interface Trecho {
  bioma: Bioma;
  de: number;
  ate: number;
}

/**
 * O QUE ACONTECE NA PISTA:
 *
 * - `travessia`: faixa de pedestres com bichos atravessando — tem que PARAR;
 * - `semaforo`: fecha quando o carro chega perto;
 * - `obra`: uma faixa fechada por cones e cavaletes — trocar de faixa;
 * - `buracos`: três buracos espalhados — desviar;
 * - `lombada`: de um lado a outro — passar devagar;
 * - `poca`: uma poça numa faixa — só espirra (é de graça, e é divertido);
 * - `onibus`: o ônibus da cidade andando devagar numa faixa — ultrapassar.
 */
export type TipoDeEvento = 'travessia' | 'semaforo' | 'obra' | 'buracos' | 'lombada' | 'poca' | 'onibus' | 'rega' | 'onda-verde';
export type BichosDaTravessia = 'patos' | 'tigres';

export interface EventoDaRota {
  tipo: TipoDeEvento;
  s: number;
  /** a faixa em que o evento está (0 esquerda, 1 direita); os de pista inteira ignoram */
  faixa: 0 | 1;
  /** Brincadeira opcional junto à poça, nas viagens para o parque. */
  bolhasDoCookie?: boolean;
  /** só da travessia: quem atravessa, de que lado vem (−1 esquerda, 1 direita) e quantos */
  bichos?: BichosDaTravessia;
  lado?: -1 | 1;
  quantos?: number;
  /** só dos buracos: onde está cada um, em relação ao `s` do evento */
  buracos?: Array<{ ds: number; l: number }>;
}

export interface Coracao {
  s: number;
  l: number;
}

export interface Rota {
  sentido: Sentido;
  semente: number;
  comprimento: number;
  /** onde o carro para sozinho, na chegada */
  chegada: number;
  trechos: Trecho[];
  eventos: EventoDaRota[];
  encontro?: { personagem: PersonagemNaEstrada; s: number };
  coracoes: Coracao[];
  /** a luz da viagem */
  momento: 'dia' | 'tarde';
  /** os números da curva (a cena não precisa deles: usa `eixoDaRota`) */
  curva: { a1: number; k1: number; f1: number; a2: number; k2: number; f2: number };
}

export const COMPRIMENTO_DA_ROTA = 640;
/** o primeiro e o último evento ficam longe das pontas: sair e chegar são tranquilos */
const PRIMEIRO_EVENTO = 78;
const ULTIMO_EVENTO = COMPRIMENTO_DA_ROTA - 112;

/** o sorteio de sempre (o mesmo de `world/texturasDeChao.ts`, sem o three junto) */
function sorteio(semente: number): () => number {
  let s = (semente * 2654435761) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** o `x` do meio da pista e a inclinação dela (dx/ds) em `s`: duas ondas, retas nas pontas */
export function eixoDaRota(rota: Pick<Rota, 'curva' | 'comprimento'>, s: number): { x: number; inclina: number } {
  const { a1, k1, f1, a2, k2, f2 } = rota.curva;
  // a envoltória: zero nas duas pontas (sair e chegar em linha reta), um no meio
  const borda = 60;
  const sobe = Math.min(1, Math.max(0, s / borda));
  const desce = Math.min(1, Math.max(0, (rota.comprimento - s) / borda));
  const suave = (t: number): number => t * t * (3 - 2 * t);
  const env = suave(sobe) * suave(desce);
  const dSobe = s > 0 && s < borda ? (6 * sobe * (1 - sobe)) / borda : 0;
  const dDesce = s < rota.comprimento && rota.comprimento - s < borda ? (-6 * desce * (1 - desce)) / borda : 0;
  const dEnv = dSobe * suave(desce) + suave(sobe) * dDesce;
  const onda = a1 * Math.sin(k1 * s + f1) + a2 * Math.sin(k2 * s + f2);
  const dOnda = a1 * k1 * Math.cos(k1 * s + f1) + a2 * k2 * Math.cos(k2 * s + f2);
  return { x: env * onda, inclina: dEnv * onda + env * dOnda };
}

/**
 * SORTEIA UMA ROTA. As regras que toda rota obedece (o `scripts/viagem.mjs`
 * confere em centenas de sementes):
 *
 * - oito eventos, um de cada tipo e a travessia DUAS vezes (uma de patos,
 *   uma de tigres-d'água): é o que o Renan mais pediu;
 * - o primeiro evento é manso (poça ou lombada): ensina sem castigar;
 * - as duas travessias nunca vêm uma depois da outra;
 * - entre um evento e o seguinte sobram pelo menos 55 m;
 * - nada fecha as duas faixas ao mesmo tempo (obra e ônibus ocupam UMA);
 * - os corações levam o olho para a faixa livre antes de cada obstáculo.
 */
export function gerarRota(semente: number, sentido: Sentido): Rota {
  if (rotaDoClube(sentido)) return gerarRotaDoClube(semente, sentido);
  const rnd = sorteio(semente * 31 + (sentido === 'ida' ? 7 : 19));
  const comprimento = COMPRIMENTO_DA_ROTA;
  const curva = {
    a1: 9 + rnd() * 3, k1: (Math.PI * 2) / (250 + rnd() * 60), f1: rnd() * Math.PI * 2,
    a2: 2.5 + rnd() * 1.5, k2: (Math.PI * 2) / (105 + rnd() * 30), f2: rnd() * Math.PI * 2,
  };

  // os trechos: saindo de casa é bairro, avenida, e a beira do parque; voltando, ao contrário
  const cortes = [0, 205 + rnd() * 20, 415 + rnd() * 20, comprimento];
  const ordem: Bioma[] = sentido === 'ida' ? ['bairro', 'avenida', 'parque'] : ['parque', 'avenida', 'bairro'];
  const trechos: Trecho[] = ordem.map((bioma, i) => ({ bioma, de: cortes[i], ate: cortes[i + 1] }));

  // os oito eventos, embaralhados com as regras
  const tipos: TipoDeEvento[] = ['travessia', 'travessia', 'semaforo', 'obra', 'buracos', 'lombada', 'poca', 'onibus'];
  const embaralhar = (): TipoDeEvento[] => {
    const lista = [...tipos];
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  };
  const vale = (lista: TipoDeEvento[]): boolean => {
    if (lista[0] !== 'poca' && lista[0] !== 'lombada') return false;
    for (let i = 1; i < lista.length; i++) if (lista[i] === 'travessia' && lista[i - 1] === 'travessia') return false;
    // o ônibus precisa de pista livre na frente: nada de travessia nem semáforo logo depois dele
    const onibus = lista.indexOf('onibus');
    const depois = lista[onibus + 1];
    return depois !== 'travessia' && depois !== 'semaforo' && depois !== 'obra';
  };
  let lista = embaralhar();
  for (let tentativa = 0; tentativa < 200 && !vale(lista); tentativa++) lista = embaralhar();
  if (!vale(lista)) lista = ['poca', 'travessia', 'buracos', 'onibus', 'lombada', 'travessia', 'obra', 'semaforo'];

  const passo = (ULTIMO_EVENTO - PRIMEIRO_EVENTO) / (lista.length - 1);
  let patosJaForam = rnd() < 0.5;
  const eventos: EventoDaRota[] = lista.map((tipo, i) => {
    const s = PRIMEIRO_EVENTO + i * passo + (rnd() - 0.5) * 9;
    const faixa: 0 | 1 = rnd() < 0.5 ? 0 : 1;
    const evento: EventoDaRota = { tipo, s, faixa };
    if (tipo === 'travessia') {
      evento.bichos = patosJaForam ? 'tigres' : 'patos';
      patosJaForam = !patosJaForam;
      evento.lado = rnd() < 0.5 ? -1 : 1;
      evento.quantos = evento.bichos === 'patos' ? 3 + Math.floor(rnd() * 3) : 2 + Math.floor(rnd() * 2);
    }
    if (tipo === 'buracos') {
      // três buracos, cada um numa posição: nunca os três fechando a pista na mesma linha
      const lados = rnd() < 0.5 ? [-1.9, 1.3, -0.4] : [1.9, -1.3, 0.4];
      evento.buracos = lados.map((l, k) => ({ ds: k * 7.5, l: l + (rnd() - 0.5) * 0.5 }));
    }
    return evento;
  });

  // os corações: uma fileira na faixa LIVRE antes de cada obstáculo, e ondas nos vãos
  const coracoes: Coracao[] = [];
  const fileira = (s0: number, l0: number, l1: number, quantos: number): void => {
    for (let k = 0; k < quantos; k++) {
      const t = quantos > 1 ? k / (quantos - 1) : 0;
      coracoes.push({ s: s0 + k * 3.4, l: l0 + (l1 - l0) * t * t * (3 - 2 * t) });
    }
  };
  for (const e of eventos) {
    const livre = PISTA.meios[e.faixa === 0 ? 1 : 0];
    const fechada = PISTA.meios[e.faixa];
    if (e.tipo === 'obra') fileira(e.s - 30, fechada, livre, 6);
    else if (e.tipo === 'onibus') fileira(e.s - 24, fechada, livre, 5);
    else if (e.tipo === 'poca') fileira(e.s - 18, livre, fechada, 5);
    else if (e.tipo === 'buracos' && e.buracos) fileira(e.s - 16, 0, -e.buracos[0].l * 0.9, 4);
  }
  for (let i = 0; i < eventos.length - 1; i++) {
    // no vão entre dois eventos, uma onda de um lado para o outro
    const meio = (eventos[i].s + eventos[i + 1].s) / 2;
    const vai = rnd() < 0.5 ? 1 : -1;
    fileira(meio - 6, vai * 1.75, -vai * 1.75, 5);
  }
  fileira(34, 0, PISTA.meios[rnd() < 0.5 ? 0 : 1], 5);

  const rota: Rota = {
    sentido, semente, comprimento, chegada: comprimento - 16,
    trechos, eventos, coracoes, curva,
    momento: rnd() < 0.3 ? 'tarde' : 'dia',
  };
  const personagem = sortearEncontro(semente, sentido);
  if (personagem) {
    // Uma saída tranquila antes dos obstáculos: ninguém disputa a faixa com
    // o ônibus ou os bichos. A paisagem e os obstáculos de sempre são mantidos.
    const deslocar = (s: number): number => s < 60 ? s : s + 240;
    rota.comprimento += 240; rota.chegada += 240;
    for (const t of rota.trechos) { t.de = deslocar(t.de); t.ate = deslocar(t.ate); }
    for (const e of rota.eventos) e.s = deslocar(e.s);
    for (const c of rota.coracoes) c.s = deslocar(c.s);
    rota.encontro = { personagem, s: 130 };
  }
  decorarCaminhoDoParque(rota);
  return rota;
}

/** Outra região da cidade, usando a mesma pista, curva, controles e eventos do carro. */
function gerarRotaDoClube(semente: number, sentido: Sentido): Rota {
  const indo = destinoDaRota(sentido) === 'clube';
  const base = gerarRota(semente, indo ? 'ida' : 'volta');
  const rnd = sorteio(semente * 53 + (indo ? 101 : 211));
  const comprimento = 1000;
  // O bairro e a avenida são os mesmos da saída de casa; hortas e alameda
  // esportiva são compartilhadas com o caminho do parque. A volta os inverte.
  const acessos: Trecho[] = sentido === 'casa-clube' || sentido === 'clube-casa'
    ? [{ bioma: 'bairro', de: 0, ate: 220 }, { bioma: 'avenida', de: 220, ate: 350 }]
    : [{ bioma: 'parque', de: 0, ate: 350 }];
  const trechos: Trecho[] = [...acessos, { bioma: 'hortas', de: 350, ate: 650 }, { bioma: 'esportivo', de: 650, ate: comprimento }];
  const personagem = sortearEncontro(semente, sentido);
  const encontro = personagem ? { personagem, s: 430 + (rnd() - 0.5) * 6 } : undefined;
  const tipos: Array<[TipoDeEvento, number]> = [
    ['lombada', 80], ['travessia', 175], ['rega', 285],
    ['obra', 565], ['onda-verde', 685], ['semaforo', 820], ['poca', 900],
  ];
  const eventos = tipos.filter(([tipo]) => tipo !== 'rega' || personagem !== 'josefina').map(([tipo, s]): EventoDaRota => ({
    tipo, s: s + (rnd() - 0.5) * 6, faixa: rnd() < 0.5 ? 0 : 1,
    ...(tipo === 'travessia' ? { bichos: indo ? 'patos' as const : 'tigres' as const, lado: 1 as const, quantos: 3 } : {}),
  }));
  const obra = eventos.find(e => e.tipo === 'obra')!;
  const coracoes: Coracao[] = [];
  for (let s = 32; s < comprimento - 90; s += 7) {
    // Só reserva o corredor quando um personagem foi sorteado.
    if (encontro && s > encontro.s - 80 && s < encontro.s + 95) continue;
    const l = s > obra.s - 35 && s < obra.s + 24 ? PISTA.meios[obra.faixa === 0 ? 1 : 0] : Math.sin(s * 0.045) * 1.55;
    coracoes.push({ s, l });
  }
  const rota: Rota = { ...base, sentido, comprimento, chegada: comprimento - 16, eventos, coracoes, encontro,
    trechos: indo ? trechos : trechos.map(t => ({ bioma: t.bioma, de: comprimento - t.ate, ate: comprimento - t.de })).reverse(),
  };
  decorarCaminhoDoParque(rota);
  return rota;
}

/** O Cookie pode aparecer na poça, sem sobrepor travessias ou a cena dos carros. */
function decorarCaminhoDoParque(rota: Rota): void {
  if (destinoDaRota(rota.sentido) !== 'parque' || sorteio(rota.semente * 71 + 503)() >= .35) return;
  const poca = rota.eventos.find(e => e.tipo === 'poca');
  if (poca) poca.bolhasDoCookie = true;
}

/** o trecho de paisagem em `s` */
export function biomaEm(rota: Rota, s: number): Bioma {
  for (const t of rota.trechos) if (s >= t.de && s < t.ate) return t.bioma;
  return rota.trechos[rota.trechos.length - 1].bioma;
}

/**
 * A NOTA DA VIAGEM, de uma a três estrelas: três é não ter esbarrado em nada
 * e ter parado para todo mundo; cada tropeço tira um pouco. Nunca zero — é
 * um passeio, não uma prova.
 */
export function estrelasDaViagem(tropecos: number, sustos: number): 1 | 2 | 3 {
  const pontos = tropecos + sustos * 2;
  return pontos === 0 ? 3 : pontos <= 3 ? 2 : 1;
}
