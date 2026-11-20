/**
 * OS PAPÉIS DA PORTARIA — a carteirinha, o convite, o crachá, a ordem de
 * entrega, o exame da piscina, a prancheta, o calendário e o RETRATO de cada
 * bicho, todos pintados em canvas (nenhuma imagem de fora).
 *
 * UM PINTOR, DUAS SAÍDAS (`docs/PORTARIA-DO-CLUBE.md` §14): o mesmo canvas é a
 * textura do papel em cima da bancada (3D) e a folha ampliada da mesa
 * (`ui/mesaDaPortaria.ts`), onde se lê e se aponta. Cada campo é pintado no
 * retângulo que `minigames/portaria/campos.ts` diz — e a mesa põe o alvo
 * clicável no mesmo lugar.
 *
 * O RETRATO sai da ficha (`Retrato`: espécie, cor, marca, cabelo, enfeite): a
 * cabeça e o focinho de cada espécie, a pelagem pelo nome, a marca que
 * distingue (é ela que denuncia o Beto e a Alpacona) e o enfeite — que é onde
 * moram os disfarces do Jean-Luc.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { PAPEIS } from '../minigames/portaria/campos';
import { pintarRetrato } from './retratosDaPortaria';
import { escrever, NOME_DO_CLUBE, NOME_DO_ITEM, type Carimbo, type Data, type Documento, type LinhaDaLista } from '../minigames/portaria/tipos';
import { FONTE_FORMA } from './halloween/barracaDoWalter';

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const LETRA = 'ui-rounded, "Nunito", system-ui, sans-serif';
const MAO = FONTE_FORMA;


// ================================================================ o retrato
// (o pintor dos retratos mora em `retratosDaPortaria.ts`; este arquivo reexporta)
export { PELAGEM, pintarRetrato } from './retratosDaPortaria';

const elipse = (c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0): void => {
  c.beginPath();
  c.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot, 0, Math.PI * 2);
};

// ================================================================ os papéis

/** o tamanho do canvas de cada papel (o lado maior tem 640 px) */
export function tamanhoDoPapel(tipo: Documento['tipo']): { l: number; a: number } {
  const p = PAPEIS[tipo].proporcao;
  return p >= 1 ? { l: 640, a: Math.round(640 / p) } : { l: Math.round(640 * p), a: 640 };
}

const campo = (tipo: Documento['tipo'], pista: string, l: number, a: number): { x: number; y: number; l: number; a: number } => {
  const c = PAPEIS[tipo].campos.find((x) => x.pista === pista);
  if (!c) return { x: 0, y: 0, l: 0, a: 0 };
  return { x: c.x * l, y: c.y * a, l: c.l * l, a: c.a * a };
};

/** um rótulo pequeno em cima e o valor grande embaixo, dentro do retângulo do campo */
function escreverCampo(c: CanvasRenderingContext2D, r: { x: number; y: number; l: number; a: number }, rotulo: string, valor: string, cor: string = css(P.tintaDaPortaria), fonte = LETRA): void {
  c.fillStyle = 'rgba(70,80,90,0.75)';
  c.font = `700 ${Math.round(r.a * 0.26)}px ${LETRA}`;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.fillText(rotulo.toUpperCase(), r.x + 4, r.y + 2);
  c.fillStyle = cor;
  let tam = Math.round(r.a * 0.56);
  c.font = `700 ${tam}px ${fonte}`;
  while (c.measureText(valor).width > r.l - 8 && tam > 10) { tam -= 1; c.font = `700 ${tam}px ${fonte}`; }
  c.fillText(valor, r.x + 4, r.y + r.a * 0.36);
  c.strokeStyle = 'rgba(70,80,90,0.25)';
  c.lineWidth = 1;
  c.beginPath(); c.moveTo(r.x + 2, r.y + r.a - 1); c.lineTo(r.x + r.l - 2, r.y + r.a - 1); c.stroke();
}

/** o papel com o grão, a sombra da borda e as quinas arredondadas */
function folha(c: CanvasRenderingContext2D, l: number, a: number, cor = css(P.papelDaPortaria), raio = 18): void {
  c.clearRect(0, 0, l, a);
  c.fillStyle = cor;
  c.beginPath(); c.roundRect(2, 2, l - 4, a - 4, raio); c.fill();
  c.fillStyle = 'rgba(120,100,70,0.05)';
  for (let i = 0; i < 220; i++) c.fillRect((i * 97) % l, (i * 53) % a, 2, 2);
  c.strokeStyle = 'rgba(80,70,50,0.25)';
  c.lineWidth = 3;
  c.beginPath(); c.roundRect(2, 2, l - 4, a - 4, raio); c.stroke();
}

/** o escudo do clube em miniatura: o círculo verde e dourado com a girafinha */
function escudo(c: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  c.fillStyle = css(P.gold); elipse(c, x, y, r, r); c.fill();
  c.fillStyle = css(P.guaritaFaixa); elipse(c, x, y, r * 0.86, r * 0.86); c.fill();
  c.fillStyle = css(P.girafaPelo); elipse(c, x, y + r * 0.05, r * 0.32, r * 0.38); c.fill();
  c.fillStyle = css(P.girafaMancha); elipse(c, x - r * 0.12, y, r * 0.07, r * 0.07); c.fill(); elipse(c, x + r * 0.1, y + r * 0.15, r * 0.06, r * 0.06); c.fill();
  c.fillStyle = '#2b2721'; for (const k of [-1, 1]) { elipse(c, x + k * r * 0.11, y - r * 0.06, r * 0.04, r * 0.04); c.fill(); }
}

/** o nome da empresa e a cor dela (o crachá e a ordem) */
const COR_DA_EMPRESA: Readonly<Record<string, string>> = {
  'Papita Delivery': '#f2b53a', 'Croissant Express': '#3b6fd0', 'Açougue do Bairro': '#c8473f', 'Gelo Polar': '#58b9d8',
  'Floricultura Primavera': '#e98aa8', 'Padaria Pão Quentinho': '#b07c46', 'Lavanderia Bolha': '#9d86d8',
};

/**
 * PINTA UM PAPEL no canvas (do tamanho de `tamanhoDoPapel`). Os campos caem
 * nos retângulos de `PAPEIS`. `carimbo` põe a marca de tinta por cima.
 */
export function pintarPapel(c: CanvasRenderingContext2D, d: Documento, carimbo: Carimbo | null = null): void {
  const { l, a } = tamanhoDoPapel(d.tipo);
  const R = (pista: string): { x: number; y: number; l: number; a: number } => campo(d.tipo, pista, l, a);
  if (d.tipo === 'carteirinha') {
    const doClube = d.clube === NOME_DO_CLUBE;
    folha(c, l, a, doClube ? '#f6f1e2' : '#f4f2fb', 26);
    const e = R('doc:carteirinha:escudo');
    // a faixa do alto: verde do clube (ou a tricolor de Paris)
    if (doClube) {
      c.fillStyle = css(P.guaritaFaixa); c.beginPath(); c.roundRect(e.x, e.y, e.l, e.a, 14); c.fill();
      escudo(c, e.x + e.a * 0.55, e.y + e.a / 2, e.a * 0.4);
      c.fillStyle = '#fbf6e8'; c.font = `800 ${Math.round(e.a * 0.42)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillText('CLUBE · CARTEIRA DE SÓCIO', e.x + e.a * 1.15, e.y + e.a / 2);
    } else {
      const t = e.l / 3;
      ['#2f56b0', css(P.peloBranco), '#d4423c'].forEach((cor, k) => { c.fillStyle = cor; c.fillRect(e.x + k * t, e.y, t, e.a); });
      c.fillStyle = '#1f2a55'; c.font = `800 ${Math.round(e.a * 0.36)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(d.clube.toUpperCase(), e.x + e.l / 2, e.y + e.a / 2);
    }
    const f = R('doc:carteirinha:foto');
    c.fillStyle = '#ffffff'; c.fillRect(f.x - 4, f.y - 4, f.l + 8, f.a + 8);
    pintarRetrato(c, f.x, f.y, f.l, f.a, d.foto);
    escreverCampo(c, R('doc:carteirinha:nome'), 'Nome', d.nome);
    escreverCampo(c, R('doc:carteirinha:numero'), 'Nº de sócio', d.numero);
    escreverCampo(c, R('doc:carteirinha:validade'), 'Válida até', escrever(d.validade));
    // a fita holográfica embaixo
    const gr = c.createLinearGradient(0, a - 22, l, a - 8);
    gr.addColorStop(0, 'rgba(150,200,240,0.5)'); gr.addColorStop(0.5, 'rgba(240,190,230,0.5)'); gr.addColorStop(1, 'rgba(190,240,200,0.5)');
    c.fillStyle = gr; c.fillRect(20, a - 22, l - 40, 10);
  } else if (d.tipo === 'convite') {
    folha(c, l, a, '#fff5f3', 22);
    // a borda de florzinhas
    c.fillStyle = '#f08aa8';
    for (let k = 0; k < 26; k++) { const t = k / 26; const px = 20 + t * (l - 40); elipse(c, px, 18, 5, 5); c.fill(); elipse(c, px, a - 18, 5, 5); c.fill(); }
    c.fillStyle = '#b8476a'; c.font = `700 ${Math.round(a * 0.11)}px ${MAO}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('Convite', l / 2, a * 0.17);
    escreverCampo(c, R('doc:convite:convidado'), 'Convidado(a)', d.convidado, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:socio'), 'Sócio que convida', d.socio, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:numeroDoSocio'), 'Nº', d.numeroDoSocio, '#3a2b55', MAO);
    escreverCampo(c, R('doc:convite:data'), 'Válido para o dia', escrever(d.data), '#3a2b55', MAO);
  } else if (d.tipo === 'conviteColetivo') {
    folha(c, l, a, '#f3f6ff', 22);
    c.fillStyle = '#3f6fc6'; c.fillRect(0, 0, l, a * 0.12);
    c.fillStyle = '#f2c14a'; c.font = `800 ${Math.round(a * 0.05)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('DIA DA ESCOLA NO CLUBE', l / 2, a * 0.06);
    escreverCampo(c, R('doc:conviteColetivo:socio'), 'Sócio que convida', d.socio, '#243f78', MAO);
    escreverCampo(c, R('doc:conviteColetivo:numeroDoSocio'), 'Nº', d.numeroDoSocio, '#243f78', MAO);
    const n = R('doc:conviteColetivo:nomes');
    c.fillStyle = 'rgba(70,80,90,0.75)'; c.font = `700 ${Math.round(n.a * 0.06)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('A TURMA', n.x + 4, n.y);
    c.fillStyle = '#243f78'; c.font = `700 ${Math.round(n.a * 0.095)}px ${MAO}`;
    d.nomes.forEach((nome, k) => c.fillText(`· ${nome}`, n.x + 10, n.y + n.a * (0.1 + k * 0.125)));
    escreverCampo(c, R('doc:conviteColetivo:data'), 'Válido para o dia', escrever(d.data), '#243f78', MAO);
  } else if (d.tipo === 'cracha') {
    const cor = COR_DA_EMPRESA[d.empresa] ?? '#7a8a9a';
    folha(c, l, a, '#fbfbf8', 20);
    c.fillStyle = cor; c.fillRect(0, 0, l, a * 0.26);
    c.fillStyle = '#d9d9d9'; c.beginPath(); c.roundRect(l / 2 - 40, 14, 80, 16, 8); c.fill();
    const e = R('doc:cracha:empresa');
    c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    let tam = Math.round(e.a * 0.5); c.font = `800 ${tam}px ${LETRA}`;
    while (c.measureText(d.empresa.toUpperCase()).width > e.l - 10 && tam > 10) { tam -= 1; c.font = `800 ${tam}px ${LETRA}`; }
    c.fillText(d.empresa.toUpperCase(), e.x + e.l / 2, e.y + e.a / 2);
    const f = R('doc:cracha:foto');
    c.fillStyle = cor; c.fillRect(f.x - 5, f.y - 5, f.l + 10, f.a + 10);
    pintarRetrato(c, f.x, f.y, f.l, f.a, d.foto);
    const nm = R('doc:cracha:nome');
    c.fillStyle = css(P.tintaDaPortaria); c.font = `800 ${Math.round(nm.a * 0.55)}px ${LETRA}`; c.textAlign = 'center';
    c.fillText(d.nome, nm.x + nm.l / 2, nm.y + nm.a * 0.45);
    c.fillStyle = 'rgba(70,80,90,0.8)'; c.font = `700 ${Math.round(nm.a * 0.32)}px ${LETRA}`;
    c.fillText(d.funcao.toUpperCase(), nm.x + nm.l / 2, nm.y + nm.a * 1.05);
  } else if (d.tipo === 'ordem') {
    const cor = COR_DA_EMPRESA[d.empresa] ?? '#7a8a9a';
    folha(c, l, a, '#fdfbf3', 10);
    const e = R('doc:ordem:empresa');
    c.fillStyle = cor; c.fillRect(e.x, e.y, e.l, e.a);
    c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(e.a * 0.36)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(`ORDEM DE ENTREGA · ${d.empresa.toUpperCase()}`, e.x + e.l / 2, e.y + e.a / 2, e.l - 12);
    escreverCampo(c, R('doc:ordem:destino'), 'Destino no clube', d.destino);
    const it = R('doc:ordem:itens');
    c.fillStyle = 'rgba(70,80,90,0.75)'; c.font = `700 ${Math.round(it.a * 0.09)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('ITENS', it.x + 4, it.y);
    c.fillStyle = css(P.tintaDaPortaria); c.font = `600 ${Math.round(it.a * 0.13)}px ${MAO}`;
    d.itens.forEach((x, k) => c.fillText(`☐ ${x}`, it.x + 10, it.y + it.a * (0.18 + k * 0.2)));
    c.strokeStyle = 'rgba(70,80,90,0.3)'; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(it.x, it.y + it.a * (0.36 + k * 0.2)); c.lineTo(it.x + it.l, it.y + it.a * (0.36 + k * 0.2)); c.stroke(); }
  } else if (d.tipo === 'exame') {
    folha(c, l, a, '#f1fbfb', 10);
    c.fillStyle = '#4ea9c9'; c.fillRect(0, 0, l, a * 0.22);
    c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(a * 0.055)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('EXAME DA PISCINA', l / 2, a * 0.08);
    c.font = `700 ${Math.round(a * 0.035)}px ${LETRA}`; c.fillText('Dermatológico · Clube', l / 2, a * 0.15);
    // a onda
    c.strokeStyle = '#4ea9c9'; c.lineWidth = 4; c.beginPath();
    for (let x = 0; x <= l; x += 8) c.lineTo(x, a * 0.27 + Math.sin(x / 18) * 4); c.stroke(); c.lineWidth = 1;
    escreverCampo(c, R('doc:exame:nome'), 'Nome', d.nome);
    escreverCampo(c, R('doc:exame:validade'), 'Apto(a) até', escrever(d.validade));
    c.fillStyle = css(P.carimboEntra); c.font = `800 ${Math.round(a * 0.06)}px ${MAO}`; c.textAlign = 'center';
    c.fillText('APTO ✓', l * 0.72, a * 0.85);
  }
  if (carimbo) pintarCarimbo(c, l, a, carimbo);
}

/** a marca de tinta do carimbo, torta, com a borda falhada */
export function pintarCarimbo(c: CanvasRenderingContext2D, l: number, a: number, carimbo: Carimbo): void {
  const cor = carimbo === 'entra' ? P.carimboEntra : carimbo === 'hojeNao' ? P.carimboHojeNao : P.carimboSoClube;
  const texto = carimbo === 'entra' ? 'ENTRA' : carimbo === 'hojeNao' ? 'HOJE NÃO' : 'SÓ O CLUBE';
  c.save();
  c.translate(l * 0.6, a * 0.58);
  c.rotate(-0.18);
  c.globalAlpha = 0.82;
  c.strokeStyle = css(cor);
  c.fillStyle = css(cor);
  const w = Math.min(l, a) * 0.8;
  const h = w * 0.3;
  c.lineWidth = h * 0.09;
  c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h * 0.18); c.stroke();
  c.font = `900 ${Math.round(h * 0.5)}px ${LETRA}`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(texto, 0, h * 0.04, w * 0.9);
  // a tinta falhada: furinhos da cor do papel
  c.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 40; i++) { elipse(c, ((i * 37) % w) - w / 2, ((i * 17) % h) - h / 2, 2 + (i % 3), 2); c.fill(); }
  c.restore();
}

// ================================================================ a prancheta, o calendário, o manual

/** a lista de sócios da prancheta (os riscados com o motivo em vermelho) */
export function pintarLista(c: CanvasRenderingContext2D, l: number, a: number, lista: readonly LinhaDaLista[]): void {
  folha(c, l, a, '#fbf8ee', 8);
  c.fillStyle = css(P.guaritaFaixa); c.font = `800 ${Math.round(a * 0.036)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('LISTA DE SÓCIOS', l / 2, a * 0.045);
  c.fillStyle = 'rgba(70,80,90,0.6)'; c.font = `700 ${Math.round(a * 0.018)}px ${LETRA}`;
  c.fillText('riscado em vermelho: suspenso', l / 2, a * 0.08);
  const passo = (a * 0.88) / Math.max(12, lista.length);
  // a margem vermelha do caderno
  c.strokeStyle = 'rgba(216,66,58,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(l * 0.22, a * 0.1); c.lineTo(l * 0.22, a * 0.98); c.stroke(); c.lineWidth = 1;
  lista.forEach((s, k) => {
    const y = a * 0.1 + k * passo;
    c.strokeStyle = 'rgba(120,160,190,0.45)'; c.beginPath(); c.moveTo(l * 0.04, y + passo); c.lineTo(l * 0.96, y + passo); c.stroke();
    const yNome = s.suspenso ? y + passo * 0.36 : y + passo * 0.55;
    c.fillStyle = css(P.tintaDaPortaria); c.font = `800 ${Math.round(passo * 0.36)}px ${LETRA}`; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillText(s.numero, l * 0.05, yNome);
    c.font = `700 ${Math.round(passo * 0.46)}px ${MAO}`;
    c.fillText(s.nome, l * 0.25, yNome);
    if (s.suspenso) {
      const fim = l * 0.25 + c.measureText(s.nome).width + 8;
      c.strokeStyle = css(P.carimboHojeNao); c.lineWidth = 3; c.beginPath(); c.moveTo(l * 0.04, yNome + 1); c.lineTo(fim, yNome - 2); c.stroke(); c.lineWidth = 1;
      c.fillStyle = css(P.carimboHojeNao); c.font = `600 ${Math.round(passo * 0.3)}px ${MAO}`;
      c.fillText(`suspenso: ${s.suspenso}`, l * 0.25, y + passo * 0.78, l * 0.72);
    }
  });
}

/** o calendário de mesa: o dia da semana, o número grande e o mês */
const DIAS_DA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
/** o dia da semana de uma data ("segunda") */
export const diaDaSemana = (d: Data): string => DIAS_DA_SEMANA[new Date(d.a, d.m - 1, d.d).getDay()];

export function pintarCalendario(c: CanvasRenderingContext2D, l: number, a: number, hoje: Data): void {
  folha(c, l, a, '#fbfaf5', 14);
  c.fillStyle = css(P.carimboHojeNao); c.beginPath(); c.roundRect(2, 2, l - 4, a * 0.28, [14, 14, 0, 0]); c.fill();
  c.fillStyle = '#ffffff'; c.font = `800 ${Math.round(a * 0.15)}px ${LETRA}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(diaDaSemana(hoje).toUpperCase(), l / 2, a * 0.15, l * 0.9);
  c.fillStyle = css(P.tintaDaPortaria); c.font = `900 ${Math.round(a * 0.42)}px ${LETRA}`;
  c.fillText(String(hoje.d), l / 2, a * 0.58);
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  c.font = `700 ${Math.round(a * 0.12)}px ${LETRA}`; c.fillStyle = '#7a8088';
  c.fillText(`${MES[hoje.m - 1]} · ${hoje.a}`, l / 2, a * 0.86);
}

/** a capa do manual de argola: o verde do clube, o escudo e o título */
export function pintarManual(c: CanvasRenderingContext2D, l: number, a: number): void {
  c.clearRect(0, 0, l, a);
  c.fillStyle = css(P.guaritaFaixa);
  c.fillRect(0, 0, l, a);
  // a lombada mais escura e as costuras
  c.fillStyle = 'rgba(0,0,0,0.18)';
  c.fillRect(l - l * 0.12, 0, l * 0.12, a);
  c.strokeStyle = 'rgba(255,240,200,0.5)';
  c.setLineDash([6, 5]);
  c.lineWidth = 2;
  c.strokeRect(l * 0.06, a * 0.05, l * 0.78, a * 0.9);
  c.setLineDash([]);
  escudo(c, l * 0.45, a * 0.36, l * 0.2);
  c.fillStyle = css(P.gold);
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `900 ${Math.round(l * 0.1)}px ${LETRA}`;
  c.fillText('MANUAL', l * 0.45, a * 0.66);
  c.font = `800 ${Math.round(l * 0.065)}px ${LETRA}`;
  c.fillText('DA PORTARIA', l * 0.45, a * 0.75);
}

/** o nome de um item da sacola (para a mesa) */
export const nomeDoItem = (i: keyof typeof NOME_DO_ITEM): string => NOME_DO_ITEM[i];

// ================================================================ as texturas

/** uma textura de canvas do tamanho dado, desenhada por `pintar` (refazer: `redesenhar`) */
export class PapelPintado {
  readonly canvas: HTMLCanvasElement;
  readonly textura: THREE.CanvasTexture;
  constructor(readonly l: number, readonly a: number, private pintar: (c: CanvasRenderingContext2D) => void) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = l;
    this.canvas.height = a;
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 8;
    this.redesenhar();
    if (typeof document !== 'undefined' && document.fonts) {
      void document.fonts.load(`700 40px ${MAO}`).then(() => this.redesenhar(), () => {});
    }
  }

  redesenhar(pintar?: (c: CanvasRenderingContext2D) => void): void {
    if (pintar) this.pintar = pintar;
    const c = this.canvas.getContext('2d');
    if (!c) return;
    this.pintar(c);
    this.textura.needsUpdate = true;
  }

  dispose(): void {
    this.textura.dispose();
  }
}

/** o papel de um documento (com o carimbo, se já carimbado) */
export function papelDoDocumento(d: Documento, carimbo: Carimbo | null = null): PapelPintado {
  const { l, a } = tamanhoDoPapel(d.tipo);
  return new PapelPintado(l, a, (c) => pintarPapel(c, d, carimbo));
}
