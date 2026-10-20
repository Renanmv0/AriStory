import type { SomNome } from '../audio/efeitos';
import {
  LINHAS_POR_PAGINA, dataDeHoje, escreverNaLinha, folhaEscrita, linhasEmBranco, paginasDoBook, perguntasRespondidas,
  type BebitoBookNoSave, type Escritor, type FolhaDoBook, type PaginaDoBook, type Rabisco,
} from '../minigames/bebitoBook';
import { escapar } from './telaDeCartas';

/**
 * ======================================================== O BEBITO BOOK
 *
 * O caderninho dos planos pro futuro, aberto na barraca da clareira com os
 * dois deitados de frente um para o outro (pedido do Renan). As regras e as
 * perguntas moram em `minigames/bebitoBook.ts`; aqui é o papel.
 *
 * - A CAPA é de pano, costurada, com a etiqueta do nome, adesivos (a barraca,
 *   a lua, um coração), uma polaroid dos dois presa com fita, rabiscos de
 *   caneta de gel, o elástico de fechar e a fitinha de marcar página. Abre
 *   num toque: o elástico sai e a capa vira em 3D em volta da lombada.
 * - O MIOLO é de caderno comum: papel creme, pauta azul, margem vermelha,
 *   "Data __/__/__" no alto e a pergunta escrita a caneta com marca-texto.
 *   No computador, duas páginas abertas; no celular, uma.
 * - ESCREVER: toca na linha e digita. Cada um escreve com A SUA LETRA (duas
 *   fontes de caligrafia do Google Fonts, carregadas no `index.html`) e a
 *   sua tinta; a caneta troca de mão no botão (ou no T, como a troca do
 *   jogo). A palavra que não cabe desce para a linha de baixo, e a data da
 *   página se escreve sozinha na primeira letra.
 *
 * O caderno inteiro é desenhado numa MEDIDA FIXA (a página tem 520 × 740) e
 * escalado para caber na tela. É isso que faz a mesma linha caber o mesmo
 * tanto de letra no computador e no celular — o que se escreveu num nunca
 * transborda no outro. Nenhuma imagem de arquivo: o pano, o grão do papel e a
 * estampa da guarda são desenhados em `<canvas>` e SVG na hora; a polaroid é
 * o retrato dos modelos 3D (quem passa é o `Game`).
 */

export interface PedidoDoBebitoBook {
  /** o caderno salvo (uma cópia: o livro devolve pelo `aoSalvar`) */
  caderno: BebitoBookNoSave;
  nomes: Readonly<Record<Escritor, string>>;
  /** quem começa com a caneta na mão: quem está sendo controlado */
  caneta: Escritor;
  /** o rosto de cada um, para a polaroid da capa */
  retrato?: (quem: Escritor) => string;
  /** grava o caderno inteiro (o livro chama sozinho, um tiquinho depois de cada letra) */
  aoSalvar: (caderno: BebitoBookNoSave) => void;
}

export interface ResultadoDoBebitoBook {
  /** abriu a capa (e não só olhou de fora) */
  abriu: boolean;
  /** escreveu alguma coisa desta vez */
  escreveu: boolean;
  /** perguntas com resposta, agora e antes de abrir */
  respondidas: number;
  respondidasAntes: number;
}

// as medidas do papel, em pixels de desenho (o caderno é escalado inteiro)
const PW = 520;
const PH = 740;
const BORDA = 12;
const LARGURA = { duplo: 2 * (PW + BORDA), simples: PW + BORDA };
const ALTURA = PH + 2 * BORDA;
/** o que sai do caderno: a fitinha por baixo, o elástico e a sombra do lado */
const SOBRA = { baixo: 40, lado: 22 };

/**
 * A LETRA DE CADA UM. Caveat (Impallari Type) é a mais parecida com letra
 * corrida de verdade — as letras emendam e variam; Kalam (Indian Type
 * Foundry) é letra de forma escrita à mão, mais redondinha. As duas têm os
 * acentos do português. A medida tem que ser A MESMA do CSS
 * (`.bebito-book .de-ari` / `.de-renan`): é por ela que a palavra desce de linha.
 */
const LETRA: Record<Escritor, { fonte: string; tinta: string }> = {
  ari: { fonte: "400 31px Caveat, 'Segoe Print', 'Bradley Hand', cursive", tinta: '#284c9c' },
  renan: { fonte: "400 23px Kalam, 'Comic Sans MS', 'Segoe Print', cursive", tinta: '#71368d' },
};
/** a largura que a letra pode ocupar numa linha: a página menos a margem, a folga do fim e o respiro do campo */
const LARGURA_DA_LINHA = PW - 70 - 22 - 8 - 4;

const MARCA_TEXTO = ['amarelo', 'rosa', 'verde', 'lilas'] as const;

// ================================================================ desenhos

/** a estrela de cinco pontas, para os rabiscos e os adesivos */
function pontasDeEstrela(cx: number, cy: number, R: number, r: number): string {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const raio = i % 2 ? r : R;
    p.push(`${(cx + Math.cos(a) * raio).toFixed(1)} ${(cy + Math.sin(a) * raio).toFixed(1)}`);
  }
  return `M${p.join(' L')} Z`;
}

const CORACAO = 'M32 52 C 10 38, 9 17, 22 15 C 28 14, 31 19, 32 23 C 33 19, 36 14, 42 15 C 55 17, 54 38, 32 52 Z';

/** os rabiscos de canto de página, a caneta: traço solto, sem preenchimento */
const RABISCOS: Record<Rabisco, string> = {
  aviao: `<path d="M57 11 L6 30 L26 36 Z"/><path d="M57 11 L26 36 L36 53 Z"/><path d="M26 36 L25 47 L31 43"/>
    <path d="M5 53 q7 -9 13 -4 t11 -9" stroke-dasharray="2.5 4"/>`,
  casinha: `<path d="M11 31 L32 12 L53 31"/><path d="M16 27 V53 H48 V27"/><path d="M27 53 V40 H36 V53"/>
    <path d="M42 22 V12 H47 V26"/><path d="M44 8 q-4 -3 0 -6"/>
    <path d="M41 35 c-2 -3 -6 -1 -4 2 l4 4 l4 -4 c2 -3 -2 -5 -4 -2z" />`,
  patinha: `<path d="M21 44 c0 -9 22 -9 22 0 c0 6 -6 8 -11 8 c-5 0 -11 -2 -11 -8z"/>
    <ellipse cx="15" cy="32" rx="4.5" ry="5.5" transform="rotate(-20 15 32)"/><ellipse cx="25" cy="23" rx="4.5" ry="5.8"/>
    <ellipse cx="39" cy="23" rx="4.5" ry="5.8"/><ellipse cx="49" cy="32" rx="4.5" ry="5.5" transform="rotate(20 49 32)"/>`,
  xicara: `<path d="M13 30 H45 V37 C45 51 13 51 13 37 Z"/><path d="M45 33 c9 -1 9 11 0 9"/><path d="M7 53 C 20 56, 38 56, 51 53"/>
    <path d="M23 24 c-4 -4 4 -6 0 -11"/><path d="M33 24 c-4 -4 4 -6 0 -11"/>`,
  montanha: `<path d="M3 53 L22 23 L32 37 L40 27 L60 53"/><path d="M16 32 l6 -9 l6 9 l-3 -2 l-3 3 l-3 -3 z"/>
    <circle cx="49" cy="13" r="6"/><path d="M8 58 H56" stroke-dasharray="3 4"/>`,
  estrela: `<path d="${pontasDeEstrela(30, 33, 20, 8.5)}"/><path d="M52 10 v8 M48 14 h8"/><path d="M53 46 v6 M50 49 h6"/>`,
  coracao: `<path d="${CORACAO}"/><path d="M50 11 l4 -4"/><path d="M55 19 l6 -1"/><path d="M45 7 l1 -5"/>`,
  balao: `<path d="M32 5 C 13 5, 11 26, 26 40 L38 40 C 53 26, 51 5, 32 5 Z"/><path d="M32 5 C 25 14, 25 30, 29 40"/>
    <path d="M32 5 C 39 14, 39 30, 35 40"/><path d="M27 40 L28 48 M37 40 L36 48"/><path d="M26 48 H38 V56 H26 Z"/>`,
  sol: `<circle cx="32" cy="32" r="11"/><path d="M28 30 v1 M36 30 v1 M27 35 q5 4 10 0"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4 + 0.2;
      return `<path d="M${(32 + Math.cos(a) * 15).toFixed(1)} ${(32 + Math.sin(a) * 15).toFixed(1)} L${(32 + Math.cos(a) * 23).toFixed(1)} ${(32 + Math.sin(a) * 23).toFixed(1)}"/>`;
    }).join('')}`,
  flor: `${[0, 1, 2, 3, 4].map((i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return `<circle cx="${(32 + Math.cos(a) * 8).toFixed(1)}" cy="${(22 + Math.sin(a) * 8).toFixed(1)}" r="6.5"/>`;
  }).join('')}<circle cx="32" cy="22" r="4"/><path d="M32 33 C 30 43, 34 50, 32 60"/>
    <path d="M32 50 c-10 -1 -13 -10 -13 -10 c9 0 13 6 13 10"/>`,
  notas: `<path d="M20 46 V18 L45 12 V40"/><path d="M20 25 L45 19"/>
    <ellipse cx="15.5" cy="46" rx="5.5" ry="4.2" transform="rotate(-20 15.5 46)"/>
    <ellipse cx="40.5" cy="40" rx="5.5" ry="4.2" transform="rotate(-20 40.5 40)"/>`,
  coracoes: `<path d="${CORACAO}" transform="translate(-3 -6) scale(0.72)"/><path d="${CORACAO}" transform="translate(22 14) scale(0.6)"/>
    <path d="M30 18 q6 -6 12 2" stroke-dasharray="2 3"/>`,
  lua: `<path d="M40 9 A 22 22 0 1 0 52 44 A 17 17 0 1 1 40 9 Z"/><path d="${pontasDeEstrela(52, 16, 5, 2.2)}"/>
    <path d="M14 14 v6 M11 17 h6"/>`,
  barraca: `<path d="M4 56 H60"/><path d="M8 56 C 10 22, 54 22, 56 56"/><path d="M23 56 C 23 40, 41 40, 41 56"/>
    <path d="M13 42 C 22 28, 42 28, 51 42"/><path d="M32 25 V14 l7 2.5 l-7 2.5"/>
    <path d="M50 12 c-1.5 -2.5 -5 -1 -3.5 1.5 l3.5 3.5 l3.5 -3.5 c1.5 -2.5 -2 -4 -3.5 -1.5z"/>`,
};

function rabisco(nome: Rabisco, classe = 'rabisco'): string {
  return `<svg class="${classe}" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${RABISCOS[nome]}</svg>`;
}

/** a caneta esferográfica do botão de quem escreve: o corpo na cor da tinta */
function desenhoDaCaneta(tinta: string): string {
  return `<svg class="desenho-caneta" viewBox="0 0 92 22" aria-hidden="true">
    <path class="ponta" d="M4 11 L14 7.6 V14.4 Z" fill="#c9ccd4"/><circle class="ponta" cx="4.5" cy="11" r="1.4" fill="${tinta}"/>
    <rect x="14" y="6" width="56" height="10" rx="3" fill="${tinta}"/>
    <rect x="14" y="7" width="56" height="2.6" rx="1.3" fill="#fff" opacity="0.32"/>
    <rect class="tampa" x="56" y="5" width="32" height="12" rx="4" fill="${tinta}" stroke="rgba(0,0,0,0.18)"/>
    <rect class="tampa" x="62" y="2.5" width="22" height="3.2" rx="1.6" fill="#d9dbe2"/>
  </svg>`;
}

/**
 * OS DESENHOS DE CANVAS, feitos uma vez só: o pano da capa (fio de linho
 * cruzado, com os nozinhos irregulares do tecido) e o grão do papel. Saem
 * como imagem `data:` para o CSS repetir — nada vem de arquivo.
 */
let texturas: { pano: string; papel: string; guarda: string } | null = null;
function desenharTexturas(): { pano: string; papel: string; guarda: string } {
  if (texturas) return texturas;
  const sorte = (() => {
    let s = 1234567;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  })();
  const fazer = (lado: number, pintar: (c: CanvasRenderingContext2D) => void): string => {
    const tela = document.createElement('canvas');
    tela.width = tela.height = lado;
    const c = tela.getContext('2d');
    if (!c) return '';
    pintar(c);
    try {
      return tela.toDataURL('image/png');
    } catch {
      return '';
    }
  };
  // o LINHO: fios de 2 px nos dois sentidos, claros e escuros, e os nozinhos
  const pano = fazer(192, (c) => {
    for (let y = 0; y < 192; y += 2) {
      c.fillStyle = sorte() < 0.5 ? `rgba(255,255,255,${0.03 + sorte() * 0.06})` : `rgba(60,20,20,${0.03 + sorte() * 0.07})`;
      c.fillRect(0, y, 192, 1);
    }
    for (let x = 0; x < 192; x += 2) {
      c.fillStyle = sorte() < 0.5 ? `rgba(255,255,255,${0.02 + sorte() * 0.05})` : `rgba(60,20,20,${0.03 + sorte() * 0.06})`;
      c.fillRect(x, 0, 1, 192);
    }
    for (let i = 0; i < 70; i++) {
      const horizontal = sorte() < 0.5;
      c.fillStyle = sorte() < 0.5 ? 'rgba(255,240,230,0.13)' : 'rgba(70,20,20,0.12)';
      const x = Math.floor(sorte() * 192);
      const y = Math.floor(sorte() * 96) * 2;
      const comp = 4 + sorte() * 12;
      if (horizontal) c.fillRect(x, y, comp, 1.4);
      else c.fillRect(Math.floor(x / 2) * 2, y, 1.4, comp);
    }
  });
  // o PAPEL: pintinhas e fiapos bem de leve
  const papel = fazer(160, (c) => {
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = `rgba(${sorte() < 0.5 ? '140,115,80' : '255,255,255'},${0.025 + sorte() * 0.05})`;
      c.fillRect(sorte() * 160, sorte() * 160, 1 + sorte(), 1 + sorte());
    }
    c.strokeStyle = 'rgba(150,125,90,0.06)';
    c.lineWidth = 0.7;
    for (let i = 0; i < 26; i++) {
      const x = sorte() * 160;
      const y = sorte() * 160;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + (sorte() - 0.5) * 10, y + (sorte() - 0.5) * 10, x + (sorte() - 0.5) * 16, y + (sorte() - 0.5) * 16);
      c.stroke();
    }
  });
  // a GUARDA: a estampa do verso da capa — barraquinhas, estrelas, corações e luas
  const guarda = fazer(120, (c) => {
    c.fillStyle = '#fbf1e2';
    c.fillRect(0, 0, 120, 120);
    const barraca = (x: number, y: number, s: number): void => {
      c.fillStyle = '#ec8a52';
      c.beginPath();
      c.moveTo(x - 9 * s, y);
      c.bezierCurveTo(x - 8 * s, y - 13 * s, x + 8 * s, y - 13 * s, x + 9 * s, y);
      c.closePath();
      c.fill();
      c.fillStyle = '#9aa1ad';
      c.fillRect(x - 9 * s, y - 2 * s, 18 * s, 2 * s);
      c.fillStyle = '#b85a2e';
      c.beginPath();
      c.moveTo(x - 3 * s, y);
      c.quadraticCurveTo(x, y - 8 * s, x + 3 * s, y);
      c.fill();
    };
    const coracao = (x: number, y: number, s: number): void => {
      c.fillStyle = '#e9768f';
      c.beginPath();
      c.moveTo(x, y + 4 * s);
      c.bezierCurveTo(x - 7 * s, y - 1 * s, x - 3 * s, y - 7 * s, x, y - 3 * s);
      c.bezierCurveTo(x + 3 * s, y - 7 * s, x + 7 * s, y - 1 * s, x, y + 4 * s);
      c.fill();
    };
    const estrela = (x: number, y: number, s: number): void => {
      c.fillStyle = '#f0bf47';
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const r = (i % 2 ? 2.2 : 5) * s;
        c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      c.fill();
    };
    const lua = (x: number, y: number, s: number): void => {
      c.fillStyle = '#8b7bc4';
      c.beginPath();
      c.arc(x, y, 5.5 * s, 0, Math.PI * 2);
      c.fill();
      c.globalCompositeOperation = 'destination-out';
      c.beginPath();
      c.arc(x + 2.6 * s, y - 1.6 * s, 4.6 * s, 0, Math.PI * 2);
      c.fill();
      c.globalCompositeOperation = 'source-over';
    };
    // o meio-salto da estampa de papel de presente: a fila de baixo anda meia casa
    for (const [dx, dy] of [[0, 0], [60, 60], [120, 0], [0, 120], [120, 120]] as const) {
      barraca(18 + dx, 30 + dy, 1);
      coracao(48 + dx, 14 + dy, 0.9);
      estrela(44 + dx, 44 + dy, 0.9);
      lua(14 + dx, 52 + dy, 0.85);
    }
    c.fillStyle = 'rgba(200,160,120,0.35)';
    for (let i = 0; i < 40; i++) c.fillRect(sorte() * 120, sorte() * 120, 1.6, 1.6);
  });
  texturas = { pano, papel, guarda };
  return texturas;
}

/** um sorteio fixo por página e linha: a letra pende um tiquinho, sempre do mesmo jeito */
function jeitoDaLinha(pagina: string, linha: number): { giro: number; anda: number } {
  let h = 2166136261;
  for (const ch of `${pagina}:${linha}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const a = ((h >>> 0) % 1000) / 1000;
  const b = (((h >>> 10) >>> 0) % 1000) / 1000;
  return { giro: (a - 0.5) * 0.7, anda: (b - 0.5) * 5 };
}

export class BebitoBook {
  private readonly raiz: HTMLDivElement;
  private readonly mesa: HTMLDivElement;
  private readonly caderno: HTMLDivElement;
  private readonly palco: HTMLDivElement;
  private readonly livro: HTMLDivElement;
  private readonly esq: HTMLElement;
  private readonly dir: HTMLElement;
  private readonly capa: HTMLDivElement;
  private readonly frenteDaCapa: HTMLDivElement;
  private readonly versoDaCapa: HTMLDivElement;
  private readonly dica: HTMLDivElement;
  private readonly onde: HTMLElement;
  private readonly antes: HTMLButtonElement;
  private readonly depois: HTMLButtonElement;
  private readonly canetas: HTMLButtonElement[];
  private readonly regua: CanvasRenderingContext2D | null;
  private readonly paginas: PaginaDoBook[] = paginasDoBook();
  private pedido: PedidoDoBebitoBook | null = null;
  private dados: BebitoBookNoSave = { comecadoEm: null, quemComecou: null, marcador: null, folhas: {} };
  private caneta: Escritor = 'ari';
  /** a página aberta: no computador, a da esquerda da dupla (índice par) */
  private pagina = 1;
  private duplo = true;
  /** a capa está aberta (e o miolo, à mostra) */
  private capaAberta = false;
  private animando = false;
  private fechando = false;
  private escreveu = false;
  private abriu = false;
  private respondidasAntes = 0;
  private resolver: ((r: ResultadoDoBebitoBook) => void) | null = null;
  private salvarTimer = 0;
  private dicaTimer = 0;
  private ultimoRabisco = 0;
  private dedo: { x: number; y: number; t: number } | null = null;
  /** quanto o caderno sobe para a linha não ficar atrás do teclado do celular */
  private subida = 0;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="mesa">
        <div class="caderno">
          <div class="palco">
            <div class="livro duplo fechado">
              <div class="tabua dir"><i class="elastico-solto cima"></i><i class="elastico-solto baixo"></i></div>
              <div class="tabua esq"></div>
              <section class="pagina esq"></section>
              <section class="pagina dir"></section>
              <div class="dobra" aria-hidden="true"></div>
              <div class="fitinha" aria-hidden="true"></div>
              <div class="capa" role="button" tabindex="0" aria-label="abrir o Bebito book">
                <div class="face frente"></div>
                <div class="face verso"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="dica-do-caderno" role="status"></div>
      </div>
      <nav class="barra-do-caderno">
        <button class="virar antes" aria-label="página anterior">◀</button>
        <div class="canetas" role="radiogroup" aria-label="quem está escrevendo">
          <button class="caneta" data-quem="ari" role="radio"></button>
          <button class="caneta" data-quem="renan" role="radio"></button>
        </div>
        <span class="onde"></span>
        <button class="virar depois" aria-label="próxima página">▶</button>
        <button class="fechar-caderno" aria-label="fechar o caderno"><span class="largo">fechar </span>✕</button>
      </nav>
    `;
    this.mesa = raiz.querySelector('.mesa')!;
    this.caderno = raiz.querySelector('.caderno')!;
    this.palco = raiz.querySelector('.palco')!;
    this.livro = raiz.querySelector('.livro')!;
    this.esq = raiz.querySelector('.pagina.esq')!;
    this.dir = raiz.querySelector('.pagina.dir')!;
    this.capa = raiz.querySelector('.capa')!;
    this.frenteDaCapa = raiz.querySelector('.capa .frente')!;
    this.versoDaCapa = raiz.querySelector('.capa .verso')!;
    this.dica = raiz.querySelector('.dica-do-caderno')!;
    this.onde = raiz.querySelector('.onde')!;
    this.antes = raiz.querySelector('.virar.antes')!;
    this.depois = raiz.querySelector('.virar.depois')!;
    this.canetas = [...raiz.querySelectorAll<HTMLButtonElement>('.caneta')];
    this.regua = document.createElement('canvas').getContext('2d');

    raiz.querySelector('.fechar-caderno')!.addEventListener('click', () => this.fechar());
    this.antes.addEventListener('click', () => this.folhear(-1));
    this.depois.addEventListener('click', () => (this.capaAberta ? this.folhear(1) : void this.abrirCapa()));
    this.capa.addEventListener('click', () => {
      if (!this.capaAberta) void this.abrirCapa();
    });
    for (const b of this.canetas) {
      b.addEventListener('click', () => this.trocarCaneta(b.dataset.quem as Escritor));
    }
    // ----------------------------------------------------- escrever
    this.livro.addEventListener('input', (e) => {
      const campo = e.target as HTMLInputElement;
      if (campo.classList?.contains('linha')) this.aoEscrever(campo, (e as InputEvent).isComposing === true);
    });
    // o teclado do celular monta a palavra aos poucos (a "composição"): a
    // quebra de linha espera a palavra terminar, senão ela sai repetida
    this.livro.addEventListener('compositionend', (e) => {
      const campo = e.target as HTMLInputElement;
      if (campo.classList?.contains('linha')) this.aoEscrever(campo, false);
    });
    this.livro.addEventListener('keydown', (e) => {
      const campo = e.target as HTMLInputElement;
      if (campo.classList?.contains('linha')) this.aoTeclar(campo, e);
    });
    this.livro.addEventListener('focusin', (e) => {
      const campo = e.target as HTMLInputElement;
      if (!campo.classList?.contains('linha')) return;
      if (campo.readOnly && campo.value) {
        const dono = campo.classList.contains('de-ari') ? 'ari' : 'renan';
        this.avisar(`Essa linha é da letra do ${this.nome(dono)}. Passa a caneta pra ele mexer nela ✍️`);
      }
      this.ajustarAoTeclado();
    });
    this.livro.addEventListener('focusout', () => window.setTimeout(() => this.ajustarAoTeclado(), 60));
    // arrastar o dedo para o lado vira a página — menos com o teclado de pé
    this.livro.addEventListener('pointerdown', (e) => {
      this.dedo = { x: e.clientX, y: e.clientY, t: performance.now() };
    });
    this.livro.addEventListener('pointerup', (e) => {
      const d = this.dedo;
      this.dedo = null;
      if (!d || !this.capaAberta || this.escrevendo()) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - d.t < 700) {
        this.folhear(dx < 0 ? 1 : -1);
      }
    });
    window.addEventListener('keydown', (e) => {
      if (!this.aberto || (e.target as HTMLElement)?.closest?.('input, textarea')) return;
      if (!this.capaAberta) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          void this.abrirCapa();
        }
        return;
      }
      if (e.key === 'ArrowRight') this.folhear(1);
      if (e.key === 'ArrowLeft') this.folhear(-1);
      // o T troca a caneta de mão, como troca quem joga
      if (e.code === 'KeyT') this.trocarCaneta(this.caneta === 'ari' ? 'renan' : 'ari');
    });
    /*
     * A TELA MUDOU (o celular girou, a barra do navegador sumiu, a janela
     * mudou de tamanho): o caderno se mede DE NOVO pela caixa dele mesmo, e
     * não pelo `window.innerWidth` — no iPhone, girar o aparelho dispara o
     * aviso antes de a medida nova chegar, e o caderno ficava do tamanho da
     * tela velha, cortado na borda. O `ResizeObserver` vê a caixa de verdade;
     * a volta de 400 ms depois de girar é a rede para o aviso atrasado.
     */
    const remedir = (): void => {
      if (!this.aberto) return;
      const caixa = this.raiz.getBoundingClientRect();
      // o teclado do celular que encolhe a janela não encolhe o caderno: quem
      // cuida dele é o `ajustarAoTeclado`, que sobe a linha
      if (Math.abs(caixa.width - this.medida.w) < 1 && caixa.height < this.medida.h && this.escrevendo()) return;
      if (Math.abs(caixa.width - this.medida.w) < 1 && Math.abs(caixa.height - this.medida.h) < 1) return;
      const antes = this.duplo;
      this.medirTela();
      if (antes !== this.duplo) {
        this.pagina = this.alinhar(this.pagina);
        this.pintarTudo();
      }
    };
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => remedir()).observe(this.raiz);
    window.addEventListener('resize', remedir);
    window.addEventListener('orientationchange', () => window.setTimeout(remedir, 400));
    window.visualViewport?.addEventListener('resize', () => this.ajustarAoTeclado());
    window.visualViewport?.addEventListener('scroll', () => this.ajustarAoTeclado());
    // a aba que some (o celular descarta) não perde a última palavra
    window.addEventListener('pagehide', () => this.salvar());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.salvar();
    });
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  /** o que está aberto agora: para o teste ler sem adivinhar o DOM */
  get estado(): { capaAberta: boolean; pagina: string; duplo: boolean; caneta: Escritor; animando: boolean } {
    return {
      capaAberta: this.capaAberta,
      pagina: this.paginas[this.pagina]?.id ?? '',
      duplo: this.duplo,
      caneta: this.caneta,
      animando: this.animando,
    };
  }

  /** Mostra o caderno fechado na mesa e resolve quando ele fecha de novo. */
  abrir(pedido: PedidoDoBebitoBook): Promise<ResultadoDoBebitoBook> {
    return new Promise((resolve) => {
      this.pedido = pedido;
      this.dados = structuredClone(pedido.caderno);
      this.caneta = pedido.caneta;
      this.escreveu = false;
      this.abriu = false;
      this.fechando = false;
      this.animando = false;
      this.capaAberta = false;
      this.respondidasAntes = perguntasRespondidas(this.dados);
      this.resolver = resolve;
      // as duas letras, antes da primeira tecla (a medida da linha depende delas)
      this.garantirLetras();
      const t = desenharTexturas();
      this.raiz.style.setProperty('--pano', t.pano ? `url(${t.pano})` : 'none');
      this.raiz.style.setProperty('--papel', t.papel ? `url(${t.papel})` : 'none');
      this.raiz.style.setProperty('--guarda', t.guarda ? `url(${t.guarda})` : 'none');
      this.raiz.classList.add('show');
      this.medirTela();
      // a fitinha marca onde os dois pararam; na primeira vez, a folha de rosto
      const marcada = this.paginas.findIndex((p) => p.id === this.dados.marcador);
      this.pagina = this.alinhar(marcada >= 0 ? marcada : this.duplo ? 0 : 1);
      this.frenteDaCapa.innerHTML = this.htmlDaCapa();
      // o verso da capa é a guarda da frente: aberta, ela deita onde fica a página da esquerda
      const guarda = this.htmlDaPagina(0, 'esq');
      this.versoDaCapa.innerHTML = `<section class="pagina ${guarda.classe}">${guarda.html}</section>`;
      this.livro.classList.remove('aberto', 'capa-fora', 'elastico-fora');
      this.livro.classList.add('fechado');
      this.capa.classList.remove('virada', 'some');
      this.pintarTudo();
      this.pintarCanetas();
      this.subida = 0;
      this.mesa.style.transform = '';
      this.caderno.classList.remove('chegando');
      void this.caderno.offsetWidth;
      this.caderno.classList.add('chegando');
      this.som?.('diario');
    });
  }

  /**
   * A LETRA É A IMERSÃO: se a folha do Google Fonts não chegou, ou uma parte
   * da fonte falhou (rede do celular caindo), pede de novo — cada vez que o
   * caderno abre. A folha repetida cria faces novas, que baixam de novo; o
   * que já foi escrito troca de letra sozinho quando ela chega. Devolve se as
   * duas letras já estão prontas.
   */
  garantirLetras(): boolean {
    const fontes = document.fonts;
    if (!fontes) return false;
    const faces = [...fontes].filter((f) => /Caveat|Kalam/.test(f.family));
    const pronta = (nome: string): boolean => faces.some((f) => f.family.includes(nome) && f.status === 'loaded');
    if (pronta('Caveat') && pronta('Kalam')) return true;
    const falhou = faces.length === 0 || faces.some((f) => f.status === 'error');
    const folha = document.querySelector<HTMLLinkElement>('link[href*="family=Caveat"]');
    if (falhou && folha) {
      const outra = folha.cloneNode() as HTMLLinkElement;
      outra.dataset.deNovo = '1';
      document.head.appendChild(outra);
      outra.addEventListener('load', () => this.carregarLetras(), { once: true });
    }
    this.carregarLetras();
    return false;
  }

  private carregarLetras(): void {
    // a promessa recusada (sem rede) não pode virar erro solto na página
    for (const quem of ['ari', 'renan'] as const) void document.fonts?.load(LETRA[quem].fonte).catch(() => undefined);
  }

  /** Fecha a capa (com o elástico) e devolve o caderno. O Escape chama isto. */
  fechar(): void {
    if (!this.aberto || this.fechando) return;
    this.fechando = true;
    (document.activeElement as HTMLElement | null)?.blur?.();
    this.salvar();
    void (async () => {
      if (this.capaAberta) await this.fecharCapa();
      this.raiz.classList.remove('show');
      this.som?.('menu');
      const r = this.resolver;
      this.resolver = null;
      this.fechando = false;
      // fechado, o livro esquece o pedido: um "recomeçar do zero" depois não é desfeito por ele
      this.pedido = null;
      r?.({
        abriu: this.abriu,
        escreveu: this.escreveu,
        respondidas: perguntasRespondidas(this.dados),
        respondidasAntes: this.respondidasAntes,
      });
    })();
  }

  // ================================================================= a capa

  /** espera a transição de um elemento (com rede, para aba escondida não travar) */
  private esperarTransicao(el: HTMLElement, ms: number): Promise<void> {
    return new Promise((ok) => {
      let feito = false;
      const fim = (): void => {
        if (feito) return;
        feito = true;
        ok();
      };
      el.addEventListener('transitionend', (e) => { if (e.target === el) fim(); });
      window.setTimeout(fim, ms);
    });
  }

  /**
   * ABRIR: o elástico escorrega para fora da capa, o caderno anda para o meio
   * da mesa (no computador ele abre para os dois lados) e a capa vira em 3D
   * em volta da lombada. Lá do outro lado, o verso dela é a guarda estampada.
   */
  private async abrirCapa(): Promise<void> {
    if (this.capaAberta || this.animando || !this.aberto) return;
    this.animando = true;
    this.abriu = true;
    if (!this.dados.comecadoEm) {
      // a primeira vez: a folha de rosto ganha a data, na letra de quem abriu
      this.dados.comecadoEm = dataDeHoje();
      this.dados.quemComecou = this.caneta;
      this.pintarTudo();
      this.agendarSalvar();
    }
    this.livro.classList.add('elastico-fora');
    this.som?.('caneta');
    await new Promise((ok) => window.setTimeout(ok, 260));
    this.som?.('folhear');
    this.livro.classList.remove('fechado');
    this.capa.classList.add('virada');
    await this.esperarTransicao(this.capa, 1300);
    // a capa deitou do outro lado: a tábua da esquerda e a página assumem, e ela some de leve
    this.livro.classList.add('aberto');
    this.capa.classList.add('some');
    await new Promise((ok) => window.setTimeout(ok, 220));
    this.livro.classList.add('capa-fora');
    this.capaAberta = true;
    this.animando = false;
    this.pintarNavegacao();
  }

  private async fecharCapa(): Promise<void> {
    if (!this.capaAberta) return;
    this.animando = true;
    this.livro.classList.remove('capa-fora');
    void this.capa.offsetWidth;
    this.capa.classList.remove('some');
    await new Promise((ok) => window.setTimeout(ok, 200));
    this.livro.classList.remove('aberto');
    this.livro.classList.add('fechado');
    this.capa.classList.remove('virada');
    this.som?.('folhear');
    await this.esperarTransicao(this.capa, 1300);
    this.livro.classList.remove('elastico-fora');
    this.som?.('caneta');
    await new Promise((ok) => window.setTimeout(ok, 240));
    this.capaAberta = false;
    this.animando = false;
  }

  // ============================================================== a medida

  /** o tamanho da tela (a caixa do caderno) na última medida */
  private medida = { w: 0, h: 0 };

  private medirTela(): void {
    const tela = this.raiz.getBoundingClientRect();
    const w = tela.width || window.innerWidth;
    const h = tela.height || window.innerHeight;
    this.medida = { w, h };
    this.duplo = w >= 820 && w > h * 1.05;
    this.livro.classList.toggle('duplo', this.duplo);
    this.livro.classList.toggle('simples', !this.duplo);
    const largura = this.duplo ? LARGURA.duplo : LARGURA.simples;
    const caixa = this.mesa.getBoundingClientRect();
    const cabeW = Math.max(200, caixa.width - 12);
    const cabeH = Math.max(200, caixa.height - 6);
    // no celular a sobra do lado é só a sombra: cada pixel de largura vira letra maior
    const lado = this.duplo ? SOBRA.lado : 6;
    const s = Math.min(cabeW / (largura + lado * 2), cabeH / (ALTURA + SOBRA.baixo), 1.15);
    this.caderno.style.width = `${(largura + lado * 2) * s}px`;
    this.caderno.style.height = `${(ALTURA + SOBRA.baixo) * s}px`;
    this.palco.style.transform = `scale(${s})`;
    this.palco.style.width = `${largura + lado * 2}px`;
    this.palco.style.height = `${ALTURA + SOBRA.baixo}px`;
    this.livro.style.left = `${lado}px`;
  }

  /** no computador a dupla começa numa página par; no celular, as guardas ficam de fora */
  private alinhar(p: number): number {
    const ultima = this.paginas.length - 1;
    if (this.duplo) {
      const par = Math.max(0, Math.min(ultima - 1, p - (p % 2)));
      return par;
    }
    return Math.max(1, Math.min(ultima - 1, p));
  }

  private get primeira(): number {
    return this.duplo ? 0 : 1;
  }

  private get ultima(): number {
    // a guarda de trás é a direita da última dupla; no celular ela não entra
    return this.paginas.length - 2;
  }

  // ============================================================== folhear

  private folhear(sentido: 1 | -1): void {
    if (!this.aberto || !this.capaAberta || this.animando) return;
    const passo = this.duplo ? 2 : 1;
    const alvo = this.pagina + sentido * passo;
    if (alvo < this.primeira || alvo > this.ultima) {
      this.avisar(sentido > 0 ? 'Essa é a última página. Mas a gente sempre arruma mais caderno ♥' : 'Essa é a primeira página do caderno.');
      return;
    }
    this.virar(alvo);
  }

  /**
   * A FOLHA VIRA EM 3D na dobra do caderno (o mesmo jeito da apostila do
   * Gatito): por baixo, a página nova já está pintada; a folha leva, na
   * frente, a cópia da que sai e, no verso, a que chega do outro lado.
   * Acabou o giro, a cópia some e a página de verdade toma o lugar — as
   * linhas de escrever nunca vivem na cópia.
   */
  private virar(alvo: number): void {
    (document.activeElement as HTMLElement | null)?.blur?.();
    const de = this.pagina;
    const frente = alvo > de;
    this.pagina = alvo;
    this.dados.marcador = this.paginas[alvo].id;
    this.agendarSalvar();
    this.som?.('folhear');
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.pintarTudo();
      return;
    }
    this.animando = true;
    const folha = document.createElement('div');
    folha.className = `folha-virando ${frente ? 'pra-frente' : 'pra-tras'}`;
    const faceA = document.createElement('section');
    const faceB = document.createElement('section');
    const pintarFace = (face: HTMLElement, indice: number, lado: 'esq' | 'dir', qual: 'frente' | 'verso'): void => {
      const p = this.htmlDaPagina(indice, lado, false);
      face.className = `pagina face ${qual} ${p.classe}`;
      face.innerHTML = p.html;
    };
    let depois: () => void;
    if (this.duplo) {
      if (frente) {
        // a folha é a página da DIREITA indo para a esquerda
        pintarFace(faceA, de + 1, 'dir', 'frente');
        pintarFace(faceB, alvo, 'esq', 'verso');
        this.pintarNo(this.dir, alvo + 1, 'dir');
        depois = () => this.pintarNo(this.esq, alvo, 'esq');
      } else {
        pintarFace(faceA, de, 'esq', 'frente');
        pintarFace(faceB, alvo + 1, 'dir', 'verso');
        this.pintarNo(this.esq, alvo, 'esq');
        depois = () => this.pintarNo(this.dir, alvo + 1, 'dir');
      }
    } else if (frente) {
      // uma página só: a de cima vira para longe e mostra a de baixo
      pintarFace(faceA, de, 'dir', 'frente');
      pintarFace(faceB, alvo, 'esq', 'verso');
      this.pintarNo(this.dir, alvo, 'dir');
      depois = () => undefined;
    } else {
      // voltando, a página anterior vem de trás da lombada e cobre a atual
      folha.classList.add('volta');
      pintarFace(faceA, alvo, 'dir', 'frente');
      pintarFace(faceB, de, 'esq', 'verso');
      depois = () => this.pintarNo(this.dir, alvo, 'dir');
    }
    folha.append(faceA, faceB);
    this.livro.appendChild(folha);
    this.pintarNavegacao();
    let feito = false;
    const terminar = (): void => {
      if (feito) return;
      feito = true;
      depois();
      folha.remove();
      this.animando = false;
      this.pintarNavegacao();
    };
    requestAnimationFrame(() => requestAnimationFrame(() => folha.classList.add('vai')));
    folha.addEventListener('transitionend', (e) => { if (e.target === folha) terminar(); });
    window.setTimeout(terminar, 1000);
  }

  // ================================================================ pintar

  private pintarTudo(): void {
    if (this.duplo) {
      this.pintarNo(this.esq, this.pagina, 'esq');
      this.pintarNo(this.dir, this.pagina + 1, 'dir');
    } else {
      this.esq.innerHTML = '';
      this.esq.className = 'pagina esq vazia';
      this.pintarNo(this.dir, this.pagina, 'dir');
    }
    this.pintarNavegacao();
  }

  private pintarNo(slot: HTMLElement, indice: number, lado: 'esq' | 'dir'): void {
    const p = this.htmlDaPagina(indice, lado, true);
    slot.className = `pagina ${lado} ${p.classe}`;
    slot.innerHTML = p.html;
    slot.dataset.indice = String(indice);
  }

  private pintarNavegacao(): void {
    const ate = this.pagina;
    this.antes.disabled = !this.capaAberta || ate <= this.primeira;
    this.depois.disabled = this.capaAberta && ate >= this.ultima;
    this.depois.setAttribute('aria-label', this.capaAberta ? 'próxima página' : 'abrir o caderno');
    if (!this.capaAberta) {
      this.onde.innerHTML = '<span class="toque">toque na capa pra abrir</span>';
      return;
    }
    const nomeDe = (i: number): string => {
      const p = this.paginas[i];
      if (!p) return '';
      if (p.tipo === 'rosto') return 'folha de rosto';
      if (p.tipo === 'guarda') return '';
      return p.pergunta.id === 'livre' ? 'espaço livre' : `pergunta ${p.numero}`;
    };
    const total = this.paginas.filter((p) => p.tipo === 'pergunta' && p.pergunta.id !== 'livre').length;
    const partes = this.duplo ? [nomeDe(ate), nomeDe(ate + 1)].filter(Boolean) : [nomeDe(ate)];
    this.onde.innerHTML = `<b>${escapar(partes.join(' · '))}</b><small>${total} perguntas</small>`;
  }

  private pintarCanetas(): void {
    for (const b of this.canetas) {
      const quem = b.dataset.quem as Escritor;
      b.innerHTML = `${desenhoDaCaneta(LETRA[quem].tinta)}<span class="nome de-${quem}">${escapar(this.nome(quem))}</span>`;
      b.classList.toggle('na-mao', quem === this.caneta);
      b.setAttribute('aria-checked', String(quem === this.caneta));
      b.setAttribute('aria-label', `${this.nome(quem)} escreve`);
    }
    this.raiz.dataset.caneta = this.caneta;
  }

  private nome(quem: Escritor): string {
    return this.pedido?.nomes[quem] ?? (quem === 'ari' ? 'Ari' : 'Renan');
  }

  /** a caneta passa de mão: as linhas em branco ganham a letra de quem pegou */
  private trocarCaneta(quem: Escritor): void {
    if (quem === this.caneta) return;
    this.caneta = quem;
    this.som?.('caneta');
    this.pintarCanetas();
    const ativo = document.activeElement as HTMLInputElement | null;
    for (const slot of [this.esq, this.dir]) {
      const id = this.paginas[Number(slot.dataset.indice)]?.id;
      if (id) this.aplicarLinhas(slot, this.folhaDe(id));
    }
    // quem estava com o cursor numa linha que agora é do outro, perde a vez
    if (ativo?.classList?.contains('linha') && ativo.readOnly) ativo.blur();
  }

  // ---------------------------------------------------------------- páginas

  private folhaDe(id: string): FolhaDoBook {
    let f = this.dados.folhas[id];
    if (!f) {
      f = { linhas: linhasEmBranco() };
      this.dados.folhas[id] = f;
    }
    return f;
  }

  /** o html de uma página: `vivo` com as linhas de escrever; a cópia da folha virando, só leitura */
  private htmlDaPagina(indice: number, lado: 'esq' | 'dir' = 'esq', vivo = false): { classe: string; html: string } {
    const p = this.paginas[indice];
    const ladoDe = `lado-${lado}`;
    if (!p) return { classe: `vazia ${ladoDe}`, html: '' };
    if (p.tipo === 'guarda') return { classe: `guarda ${p.id} ${ladoDe}`, html: this.htmlDaGuarda(p.id) };
    if (p.tipo === 'rosto') return { classe: `rosto ${ladoDe}`, html: this.htmlDoRosto(indice) };
    const folha = this.dados.folhas[p.id];
    const linhas = folha?.linhas ?? linhasEmBranco();
    const emBranco = !folhaEscrita(folha);
    const cor = MARCA_TEXTO[(p.numero - 1) % MARCA_TEXTO.length];
    const livre = p.pergunta.id === 'livre';
    const campos = linhas.map((l, i) => {
      const quem = l.texto && l.quem ? l.quem : this.caneta;
      const alheia = !!l.texto && quem !== this.caneta;
      const { giro, anda } = jeitoDaLinha(p.id, i);
      const dica = vivo && emBranco && i === 0 ? ` placeholder="${this.convite(livre)}"` : '';
      return `<input class="linha de-${quem}${alheia ? ' alheia' : ''}" data-i="${i}" value="${escapar(l.texto)}"
        style="--giro:${giro.toFixed(2)}deg;--anda:${anda.toFixed(1)}px"${dica}
        ${vivo ? '' : 'tabindex="-1" '}${!vivo || alheia ? 'readonly ' : ''}autocomplete="off"
        autocapitalize="${i === 0 || !linhas[i - 1].texto ? 'sentences' : 'off'}" spellcheck="false" enterkeyhint="next" maxlength="140"
        aria-label="linha ${i + 1}${livre ? '' : ` da pergunta ${p.numero}`}">`;
    }).join('');
    const data = folha?.data && folha.quemData
      ? `<b class="escrita de-${folha.quemData}">${escapar(folha.data)}</b>` : '';
    const html = `
      <header class="cabeca-da-pagina">
        <span class="numero">${livre ? 'extra' : `nº ${p.numero}`}</span>
        <span class="data">Data <i class="vao">${data}<em>____/____/____</em></i></span>
      </header>
      <h3 class="pergunta marca-${cor}"><div><span>${escapar(p.pergunta.texto)}</span></div></h3>
      ${livre ? '<p class="sub-livre">pra escrever o que vier no coração</p>' : ''}
      <div class="pauta">${campos}</div>
      <footer class="pe-da-pagina">${rabisco(p.pergunta.rabisco)}<span class="folha-n">${indice}</span></footer>`;
    return { classe: `pergunta-${livre ? 'livre' : 'normal'} ${ladoDe}`, html };
  }

  private htmlDoRosto(indice: number): string {
    const ari = escapar(this.nome('ari'));
    const renan = escapar(this.nome('renan'));
    const quem = this.dados.quemComecou ?? this.caneta;
    const quando = this.dados.comecadoEm
      ? `<span class="escrita de-${quem}">${escapar(this.dados.comecadoEm)}</span>` : '';
    const outro: Escritor = quem === 'ari' ? 'renan' : 'ari';
    return `
      <div class="titulo-rosto"><span class="bebito">Bebito</span><span class="book">book</span>
        <svg class="sublinha" viewBox="0 0 300 24" aria-hidden="true"><path d="M8 14 C 60 4, 110 22, 160 12 S 250 6, 292 14"
          fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div>
      <div class="ficha">
        <p><span class="rotulo">Nome</span><span class="vaozinho"><span class="escrita de-ari">${ari}</span>
          <span class="escrita de-renan e">&amp;</span><span class="escrita de-renan">${renan}</span></span></p>
        <p><span class="rotulo">Matéria</span><span class="vaozinho"><span class="escrita de-${quem}">os nossos planos pro futuro</span></span></p>
        <p><span class="rotulo">Começado em</span><span class="vaozinho">${quando}</span></p>
        <p><span class="rotulo">Onde</span><span class="vaozinho"><span class="escrita de-${outro}">na barraca da clareira, deitadinhos</span></span></p>
      </div>
      <div class="regras">
        <p class="rotulo">regras do caderno</p>
        <ol>
          <li class="escrita de-ari">Só nós dois podemos escrever aqui.</li>
          <li class="escrita de-renan">Cada um com a sua letra.</li>
          <li class="escrita de-ari">Plano escrito é plano prometido.</li>
        </ol>
      </div>
      ${rabisco('barraca', 'rabisco grande')}
      <footer class="pe-da-pagina"><span class="folha-n">${indice}</span></footer>`;
  }

  private htmlDaGuarda(id: 'guarda-frente' | 'guarda-tras'): string {
    if (id === 'guarda-frente') {
      return `
        <div class="bilhete-de-achados">
          <p class="impresso">se você achar este caderno,</p>
          <p class="escrita de-renan">Devolver para o ${escapar(this.nome('ari'))} ou para o ${escapar(this.nome('renan'))}</p>
        </div>`;
    }
    return `
      <div class="bolso">
        <div class="cartaozinho"><span class="escrita de-ari">pra ler daqui a dez anos</span></div>
        <div class="frente-do-bolso"><span class="escrita de-renan">bilhetinhos</span></div>
      </div>
      <p class="colofao">Bebito book · edição única · feito à mão na clareira</p>`;
  }

  /** A CAPA: pano, lombada, costura, etiqueta, adesivos, polaroid, rabiscos, elástico e fitinha */
  private htmlDaCapa(): string {
    const ari = escapar(this.nome('ari'));
    const renan = escapar(this.nome('renan'));
    const foto = (quem: Escritor): string => {
      const src = this.pedido?.retrato?.(quem) ?? '';
      return src ? `<img src="${src}" alt="${escapar(this.nome(quem))}">` : `<span class="sem-foto">${quem === 'ari' ? '🙂' : '😄'}</span>`;
    };
    const brilho = (x: number, y: number, s: number): string =>
      `<path d="M${x} ${y - 7 * s} Q ${x + 1.2 * s} ${y - 1.2 * s} ${x + 7 * s} ${y} Q ${x + 1.2 * s} ${y + 1.2 * s} ${x} ${y + 7 * s}
        Q ${x - 1.2 * s} ${y + 1.2 * s} ${x - 7 * s} ${y} Q ${x - 1.2 * s} ${y - 1.2 * s} ${x} ${y - 7 * s} Z"/>`;
    const coracaozinho = (x: number, y: number, s: number): string =>
      `<path d="${CORACAO}" transform="translate(${x - 32 * s} ${y - 32 * s}) scale(${s})" fill="none"/>`;
    return `
      <div class="lombada"><i class="costura-da-lombada"></i></div>
      <div class="costura-da-capa"></div>
      <div class="desgaste"></div>
      <svg class="rabiscos-de-gel" viewBox="0 0 532 764" aria-hidden="true" fill="#fff" stroke="#fff"
        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        ${brilho(122, 112, 1)} ${brilho(436, 300, 0.8)} ${brilho(150, 470, 0.7)} ${brilho(470, 560, 1.1)} ${brilho(96, 330, 0.6)}
        <g fill="none">${coracaozinho(398, 112, 0.32)} ${coracaozinho(118, 560, 0.28)} ${coracaozinho(440, 452, 0.24)}</g>
        <path d="M84 420 h10 M100 420 h10 M116 420 h10" fill="none"/>
        <path d="M402 640 q 14 -14 28 0 t 28 0" fill="none"/>
        <circle cx="200" cy="96" r="2.2"/><circle cx="372" cy="174" r="1.8"/><circle cx="430" cy="380" r="2"/>
        <circle cx="114" cy="640" r="1.8"/><circle cx="300" cy="700" r="2.2"/>
      </svg>
      <div class="etiqueta">
        <div class="titulo-da-capa"><span class="bebito">Bebito</span><span class="book">book</span></div>
        <svg class="floreio" viewBox="0 0 240 20" aria-hidden="true"><path d="M6 10 C 50 2, 80 18, 120 10 S 200 3, 234 10"
          fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          <path d="${CORACAO}" transform="translate(108 -1) scale(0.36)" fill="#e9768f"/></svg>
        <div class="sub-da-capa">os nossos planos pro futuro</div>
        <div class="donos-da-capa"><span class="de-ari">${ari}</span> &amp; <span class="de-renan">${renan}</span></div>
      </div>
      <div class="adesivo adesivo-barraca">
        <svg viewBox="0 0 140 112" aria-hidden="true">
          <g class="recorte"><path d="M10 96 C 12 30, 128 30, 130 96 Z"/><ellipse cx="70" cy="96" rx="66" ry="12"/><circle cx="112" cy="22" r="12"/></g>
          <ellipse cx="70" cy="96" rx="64" ry="10" fill="#8cc46c"/>
          <path d="M14 94 C 16 34, 124 34, 126 94 Z" fill="#ef8a4c"/>
          <path d="M14 94 C 16 34, 124 34, 126 94 Z" fill="url(#brilhoBarraca)"/>
          <path d="M15 88 H125 C 125.6 90, 126 92, 126 94 H14 C 14 92, 14.4 90, 15 88 Z" fill="#9ca3af"/>
          <path d="M50 94 C 50 62, 90 62, 90 94 Z" fill="#c35a2a"/><path d="M70 64 V94" stroke="#8a3d1b" stroke-width="2"/>
          <path d="M22 70 C 44 40, 96 40, 118 70" fill="none" stroke="#b55126" stroke-width="2.2"/>
          <path d="M70 40 V24 l12 4 l-12 4" fill="#f6d36b" stroke="#8a3d1b" stroke-width="1.5"/>
          <path d="M106 14 a 10 10 0 1 0 12 13 a 8 8 0 1 1 -12 -13 Z" fill="#f6d36b"/>
          <defs><linearGradient id="brilhoBarraca" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/>
            <stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
        </svg>
      </div>
      <div class="adesivo adesivo-lua">
        <svg viewBox="0 0 110 96" aria-hidden="true">
          <g class="recorte"><circle cx="44" cy="50" r="38"/><circle cx="88" cy="22" r="16"/><circle cx="92" cy="72" r="12"/></g>
          <path d="M50 16 A 34 34 0 1 0 74 74 A 27 27 0 1 1 50 16 Z" fill="#f7d260"/>
          <path d="M50 16 A 34 34 0 1 0 74 74 A 27 27 0 1 1 50 16 Z" fill="url(#brilhoLua)"/>
          <circle cx="30" cy="54" r="3.5" fill="#e9b93e"/><circle cx="38" cy="70" r="2.4" fill="#e9b93e"/>
          <path d="M33 58 q 4 3 8 0" stroke="#7a5a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <circle cx="31" cy="48" r="1.6" fill="#7a5a1a"/><circle cx="41" cy="49" r="1.6" fill="#7a5a1a"/>
          <path d="${pontasDeEstrela(88, 22, 13, 5.5)}" fill="#fff4b8"/><path d="${pontasDeEstrela(92, 72, 9, 4)}" fill="#fff4b8"/>
          <defs><linearGradient id="brilhoLua" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/>
            <stop offset="0.45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
        </svg>
      </div>
      <div class="adesivo adesivo-coracao">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path class="recorte" d="${CORACAO}"/>
          <path d="${CORACAO}" fill="#e2566f"/>
          <path d="M22 20 C 16 21, 14 28, 17 33" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.75"/>
          <text x="32" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="#fff"
            font-family="Nunito, sans-serif">${escapar(this.nome('ari').charAt(0))}+${escapar(this.nome('renan').charAt(0))}</text>
        </svg>
      </div>
      <div class="adesivo adesivo-estrela">
        <svg viewBox="0 0 64 64" aria-hidden="true"><path class="recorte" d="${pontasDeEstrela(32, 33, 26, 12)}"/>
          <path d="${pontasDeEstrela(32, 33, 25, 11.5)}" fill="#8d7ccc"/>
          <path d="${pontasDeEstrela(32, 33, 25, 11.5)}" fill="url(#brilhoEstrela)"/>
          <defs><linearGradient id="brilhoEstrela" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/>
            <stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>
      </div>
      <div class="polaroid">
        <i class="durex"></i>
        <div class="foto">${foto('ari')}${foto('renan')}<i class="estrelinhas-da-foto"></i></div>
        <span class="legenda de-ari">nós dois</span>
      </div>
      <div class="elastico"></div>`;
  }

  // ============================================================== escrever

  /** a página (seção) e a folha do campo */
  private daLinha(campo: HTMLInputElement): { slot: HTMLElement; id: string; i: number } | null {
    const slot = campo.closest<HTMLElement>('section.pagina');
    const id = slot && this.paginas[Number(slot.dataset.indice)]?.id;
    if (!slot || !id) return null;
    return { slot, id, i: Number(campo.dataset.i) };
  }

  private readonly cabe = (texto: string, quem: Escritor): boolean => {
    if (!this.regua) return texto.length <= 34;
    this.regua.font = LETRA[quem].fonte;
    return this.regua.measureText(texto).width <= LARGURA_DA_LINHA;
  };

  private aoEscrever(campo: HTMLInputElement, compondo: boolean): void {
    const onde = this.daLinha(campo);
    if (!onde) return;
    const folha = this.folhaDe(onde.id);
    if (compondo) {
      // no meio da palavra do teclado: só guarda o que cabe, a quebra vem no fim dela
      if (campo.readOnly || !this.cabe(campo.value, this.caneta)) return;
      folha.linhas[onde.i] = { texto: campo.value, quem: campo.value ? this.caneta : null };
      this.escreveu = true;
      this.agendarSalvar();
      return;
    }
    const antes = folha.linhas[onde.i]?.texto ?? '';
    const estavaEmBranco = !folhaEscrita(folha);
    const r = escreverNaLinha(folha.linhas, onde.i, campo.value, campo.selectionStart ?? campo.value.length, this.caneta, this.cabe);
    if (!r) {
      // não tem mais linha: a tecla não entra
      const pos = Math.max(0, (campo.selectionStart ?? antes.length) - (campo.value.length - antes.length));
      campo.value = antes;
      campo.setSelectionRange(pos, pos);
      this.avisar('A página acabou. Vira a folha e continua na próxima ✍️');
      return;
    }
    folha.linhas = r.linhas;
    if (estavaEmBranco && folhaEscrita(folha) && !folha.data) {
      // a primeira letra da página escreve a data no alto, na letra de quem começou
      folha.data = dataDeHoje();
      folha.quemData = this.caneta;
      const vao = onde.slot.querySelector('.data .vao');
      if (vao) vao.insertAdjacentHTML('afterbegin', `<b class="escrita de-${this.caneta}">${escapar(folha.data)}</b>`);
    }
    this.aplicarLinhas(onde.slot, folha);
    const alvo = onde.slot.querySelector<HTMLInputElement>(`.linha[data-i="${r.cursor.linha}"]`);
    if (alvo) {
      if (document.activeElement !== alvo) alvo.focus({ preventScroll: true });
      alvo.setSelectionRange(r.cursor.pos, r.cursor.pos);
    }
    if (campo.value.length >= antes.length || r.cursor.linha !== onde.i) {
      const agora = performance.now();
      if (agora - this.ultimoRabisco > 45) {
        this.ultimoRabisco = agora;
        this.som?.('rabisco');
      }
    }
    this.escreveu = true;
    this.agendarSalvar();
    this.ajustarAoTeclado();
  }

  /** passa o modelo da folha para os campos da página: o texto, a letra e quem pode mexer */
  private aplicarLinhas(slot: HTMLElement, folha: FolhaDoBook): void {
    const emBranco = !folhaEscrita(folha);
    slot.querySelectorAll<HTMLInputElement>('.linha').forEach((campo) => {
      const i = Number(campo.dataset.i);
      const l = folha.linhas[i] ?? { texto: '', quem: null };
      if (campo.value !== l.texto) campo.value = l.texto;
      const quem = l.texto && l.quem ? l.quem : this.caneta;
      const alheia = !!l.texto && quem !== this.caneta;
      campo.classList.toggle('de-ari', quem === 'ari');
      campo.classList.toggle('de-renan', quem === 'renan');
      campo.classList.toggle('alheia', alheia);
      campo.readOnly = alheia;
      // a maiúscula automática do celular só no começo de uma resposta, não na linha que continua a frase
      campo.autocapitalize = i === 0 || !folha.linhas[i - 1]?.texto ? 'sentences' : 'off';
      if (i === 0) {
        if (emBranco) campo.placeholder = this.convite(this.paginas[Number(slot.dataset.indice)]?.id === 'livre');
        else campo.removeAttribute('placeholder');
      }
    });
  }

  private aoTeclar(campo: HTMLInputElement, e: KeyboardEvent): void {
    const onde = this.daLinha(campo);
    if (!onde) return;
    const ir = (i: number, pos: number | 'fim'): boolean => {
      const alvo = onde.slot.querySelector<HTMLInputElement>(`.linha[data-i="${i}"]`);
      if (!alvo) return false;
      e.preventDefault();
      alvo.focus({ preventScroll: true });
      const p = pos === 'fim' ? alvo.value.length : Math.min(pos, alvo.value.length);
      alvo.setSelectionRange(p, p);
      return true;
    };
    const ini = campo.selectionStart ?? 0;
    const fimDoSel = campo.selectionEnd ?? ini;
    if (e.key === 'Enter') {
      e.preventDefault();
      // a próxima linha em que dá para escrever (a do outro, com letra, fica)
      const folha = this.folhaDe(onde.id);
      for (let k = onde.i + 1; k < LINHAS_POR_PAGINA; k++) {
        const l = folha.linhas[k];
        if (!l.texto || l.quem === this.caneta) {
          ir(k, 'fim');
          return;
        }
      }
      this.avisar('A página acabou. Vira a folha e continua na próxima ✍️');
    } else if (e.key === 'ArrowDown') {
      ir(onde.i + 1, ini);
    } else if (e.key === 'ArrowUp') {
      ir(onde.i - 1, ini);
    } else if (e.key === 'Backspace' && ini === 0 && fimDoSel === 0 && onde.i > 0) {
      // no começo da linha, o apagar volta para o fim da de cima
      ir(onde.i - 1, 'fim');
    } else if (e.key === 'ArrowLeft' && ini === 0 && fimDoSel === 0 && onde.i > 0) {
      ir(onde.i - 1, 'fim');
    } else if (e.key === 'ArrowRight' && ini === campo.value.length && fimDoSel === ini) {
      ir(onde.i + 1, 0);
    }
  }

  /** o convite da primeira linha em branco: no celular se toca, no computador se clica */
  private convite(livre: boolean): string {
    if (livre) return 'o que vier na cabeça…';
    return window.matchMedia?.('(pointer: coarse)').matches ? 'toca aqui e escreve…' : 'clica aqui e escreve…';
  }

  private escrevendo(): boolean {
    const a = document.activeElement as HTMLElement | null;
    return !!a && a.classList?.contains('linha') && this.raiz.contains(a);
  }

  /**
   * O TECLADO DO CELULAR sobe por cima da metade de baixo da tela: a linha
   * em que se escreve não pode ficar atrás dele. Com o teclado de pé (a área
   * visível encolhe), o caderno sobe o que faltar para a linha aparecer.
   */
  private ajustarAoTeclado(): void {
    const vv = window.visualViewport;
    const campo = document.activeElement as HTMLInputElement | null;
    let subida = 0;
    if (vv && this.aberto && this.escrevendo() && campo && vv.height < window.innerHeight - 80) {
      const r = campo.getBoundingClientRect();
      const fundo = r.bottom + this.subida;
      const visivelAte = vv.offsetTop + vv.height - 18;
      subida = Math.max(0, fundo - visivelAte);
      // e nunca a ponto de a linha passar do alto da tela
      subida = Math.min(subida, Math.max(0, r.top + this.subida - vv.offsetTop - 40));
    }
    if (Math.abs(subida - this.subida) < 1) return;
    this.subida = subida;
    this.mesa.style.transform = subida ? `translateY(${-subida}px)` : '';
  }

  private avisar(texto: string): void {
    this.dica.textContent = texto;
    this.dica.classList.add('show');
    window.clearTimeout(this.dicaTimer);
    this.dicaTimer = window.setTimeout(() => this.dica.classList.remove('show'), 2600);
  }

  // =================================================================== salvar

  private agendarSalvar(): void {
    window.clearTimeout(this.salvarTimer);
    this.salvarTimer = window.setTimeout(() => this.salvar(), 350);
  }

  private salvar(): void {
    window.clearTimeout(this.salvarTimer);
    if (!this.pedido) return;
    this.pedido.aoSalvar(structuredClone(this.dados));
  }
}
