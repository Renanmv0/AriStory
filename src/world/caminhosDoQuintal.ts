import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { quina } from './lojaDeRoupas';
import { uvDeParede, uvEmMetrosPorTriangulo } from './acabamento';
import { reboco } from './texturasDeFachada';
import { veioDeMadeira } from './texturasDeCasa';
import { calcadaDePedrinha, novaTextura, sorteio } from './texturasDeChao';
import { pedrisco } from './plantasDeJardim';

/**
 * OS CAMINHOS DO QUINTAL (`docs/QUINTAL.md`, etapa 2): o caminho da casa do Ari
 * — da porta ao portão, e o ramal até a passagem da mureta — em cinco jeitos.
 * "Podemos comprar novos tipos de caminhos de lajes também!" (o Renan): o
 * Papita Delivery vende os outros quatro, e as ferramentas da garagem trocam
 * qual está no chão. O TRAÇADO é sempre o mesmo (a regra da casa: passagem
 * tem eixo, e o eixo fica livre); o que muda é a matéria.
 *
 * Um caminho é montado por TRECHOS retos (em `x` ou em `z`), no mundo: a
 * função devolve um grupo já no lugar, para a cena juntar como fundo
 * (`fundirComoFundo`) e trocar inteiro quando o Ari escolhe outro.
 */

export interface TrechoDeCaminho {
  /** de onde a onde, no chão do mundo (o trecho é reto, em `x` ou em `z`) */
  readonly a: readonly [number, number];
  readonly b: readonly [number, number];
  readonly largura: number;
}

export type EstiloDeCaminho = 'lajes' | 'pedras' | 'tijolinho' | 'dormentes' | 'portuguesa';

/** um trecho, lido: o meio, o comprimento, se corre em x, e um ponto a uma distância `s` do começo */
function ler(t: TrechoDeCaminho): { L: number; emX: boolean; dir: number; em: (s: number, l?: number) => [number, number] } {
  const dx = t.b[0] - t.a[0];
  const dz = t.b[1] - t.a[1];
  const emX = Math.abs(dx) > Math.abs(dz);
  const L = Math.hypot(dx, dz);
  const ux = dx / L;
  const uz = dz / L;
  return {
    L, emX, dir: emX ? Math.sign(dx) : Math.sign(dz),
    // `l` anda de lado (perpendicular), para pôr duas pedras lado a lado
    em: (s, l = 0) => [t.a[0] + ux * s - uz * l, t.a[1] + uz * s + ux * l],
  };
}

/** as LAJES DE SEMPRE: placas de cimento de 82 cm, de 1,03 em 1,03 (o caminho da casa como nasceu) */
function lajes(trechos: readonly TrechoDeCaminho[], g: THREE.Group): void {
  const laje = toon(P.casaLaje, { mapa: reboco(1.1) });
  for (const t of trechos) {
    const { L, emX, em } = ler(t);
    const n = Math.floor((L - 0.82) / 1.03) + 1;
    for (let k = 0; k < n; k++) {
      const [x, z] = em(0.41 + k * 1.03);
      const lx = emX ? 0.82 : t.largura;
      const lz = emX ? t.largura : 0.82;
      const m = new THREE.Mesh(uvDeParede(quina(lx, 0.06, lz, 0.02), x, 0, z), laje);
      m.position.set(x, 0.012, z);
      g.add(m);
    }
  }
}

/** um contorno de pedra de rio: um círculo torto */
function contornoDePedra(raio: number, rnd: () => number): THREE.Shape {
  const forma = new THREE.Shape();
  const N = 11;
  const fases = [rnd() * 6.28, rnd() * 6.28];
  const achata = 0.78 + rnd() * 0.2;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = raio * (1 + Math.sin(a * 2 + fases[0]) * 0.1 + Math.sin(a * 3 + fases[1]) * 0.06);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * achata;
    if (i === 0) forma.moveTo(x, y);
    else forma.lineTo(x, y);
  }
  forma.closePath();
  return forma;
}

/** as PEDRAS DE PASSAR: placas de pedra tortas, de bisel macio, desencontradas aos pares */
function pedras(trechos: readonly TrechoDeCaminho[], g: THREE.Group): void {
  const rnd = sorteio(8080);
  const tons = [P.pedraDoCaminho, P.pedraDoCaminhoClara, P.pedraDoCaminhoEscura];
  for (const t of trechos) {
    const { L, em } = ler(t);
    const passo = 0.62;
    const n = Math.floor(L / passo);
    for (let k = 0; k < n; k++) {
      // uma grande no meio, ou duas menores lado a lado (alternando)
      const dupla = t.largura > 1.2 && k % 2 === 1;
      const lados = dupla ? [-t.largura * 0.22, t.largura * 0.22] : [(rnd() - 0.5) * t.largura * 0.15];
      for (const l of lados) {
        const raio = dupla ? 0.24 + rnd() * 0.04 : Math.min(0.36, t.largura * 0.3) + rnd() * 0.04;
        const geo = new THREE.ExtrudeGeometry(contornoDePedra(raio, rnd), {
          depth: 0.03, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.022, bevelSegments: 2, curveSegments: 4,
        });
        geo.rotateX(-Math.PI / 2);
        const [x, z] = em(passo * (k + 0.5), l);
        const m = new THREE.Mesh(uvEmMetrosPorTriangulo(geo), toon(tons[Math.floor(rnd() * tons.length)], { mapa: reboco(0.9) }));
        m.position.set(x, 0.0, z);
        m.rotation.y = rnd() * Math.PI;
        g.add(m);
      }
    }
  }
}

/**
 * o TIJOLINHO em canvas: fiadas desencontradas (cada uma anda meio tijolo), o
 * tijolo de 20 × 10 com o seu tom, e a junta de areia bem marcada — é a junta
 * que faz ler "tijolinho" a esta distância. (A primeira versão era espinha de
 * peixe: de perto virava um xadrez torto.)
 */
function tijolosEmFiada(): THREE.CanvasTexture {
  return novaTextura('tijolinho-fiada', 0.8, (ctx, s) => {
    const rnd = sorteio(2024);
    ctx.fillStyle = '#b9a58f';
    ctx.fillRect(0, 0, s, s);
    const fiadas = 8;
    const alto = s / fiadas;
    const largo = alto * 2;
    const junta = Math.max(2, s * 0.012);
    for (let f = 0; f < fiadas; f++) {
      const desvio = (f % 2) * largo * 0.5;
      for (let k = -1; k <= s / largo; k++) {
        const v = 0.84 + rnd() * 0.16;
        ctx.fillStyle = `rgb(${Math.round(255 * v)},${Math.round(255 * v * 0.96)},${Math.round(255 * v * 0.92)})`;
        ctx.beginPath();
        ctx.roundRect(k * largo + desvio + junta, f * alto + junta, largo - junta * 2, alto - junta * 2, 2);
        ctx.fill();
        // (o tijolo que sai por um lado entra pelo outro)
        ctx.beginPath();
        ctx.roundRect(k * largo + desvio + junta - s, f * alto + junta, largo - junta * 2, alto - junta * 2, 2);
        ctx.fill();
      }
    }
  });
}

/** uma faixa de chão (decalque) por um trecho, com o UV em metros */
function faixa(t: TrechoDeCaminho, mat: THREE.Material, folga = 0): THREE.Mesh {
  const { L, emX } = ler(t);
  const cx = (t.a[0] + t.b[0]) / 2;
  const cz = (t.a[1] + t.b[1]) / 2;
  const lx = (emX ? L : t.largura) + folga;
  const lz = (emX ? t.largura : L) + folga;
  const forma = new THREE.Shape();
  forma.moveTo(cx - lx / 2, -(cz - lz / 2));
  forma.lineTo(cx + lx / 2, -(cz - lz / 2));
  forma.lineTo(cx + lx / 2, -(cz + lz / 2));
  forma.lineTo(cx - lx / 2, -(cz + lz / 2));
  forma.closePath();
  const geo = new THREE.ShapeGeometry(forma);
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, mat);
  m.position.y = 0.014;
  m.renderOrder = 2;
  m.receiveShadow = true;
  return m;
}

/** a guia de tijolo em pé (ou de pedra), nas duas beiras de um trecho */
function guias(t: TrechoDeCaminho, g: THREE.Group, cor: number, mapa: THREE.Texture): void {
  const { L, emX, em } = ler(t);
  const mat = toon(cor, { mapa });
  for (const lado of [-1, 1]) {
    const [x, z] = em(L / 2, lado * (t.largura / 2 + 0.05));
    const geo = quina(emX ? L + 0.1 : 0.1, 0.05, emX ? 0.1 : L + 0.1, 0.012);
    const m = new THREE.Mesh(uvDeParede(geo, x, 0, z), mat);
    m.position.set(x, 0.006, z);
    g.add(m);
  }
}

/** o TIJOLINHO: as fiadas e a guia de tijolo em pé dos dois lados */
function tijolinho(trechos: readonly TrechoDeCaminho[], g: THREE.Group): void {
  const mat = toon(P.tijolinhoDoCaminho, { mapa: tijolosEmFiada(), decal: true });
  for (const t of trechos) {
    g.add(faixa(t, mat));
    guias(t, g, P.tijolinhoGuia, reboco(0.6));
  }
}

/** os DORMENTES: vigas de madeira com veio deitadas de través, no pedrisco */
function dormentes(trechos: readonly TrechoDeCaminho[], g: THREE.Group): void {
  const madeira = toon(P.dormenteMadeira, { mapa: veioDeMadeira() });
  const pedra = toon(P.pedriscoBranco, { mapa: pedrisco(), decal: true });
  const rnd = sorteio(515);
  for (const t of trechos) {
    g.add(faixa(t, pedra, -0.1));
    const { L, emX, em } = ler(t);
    const n = Math.floor((L - 0.25) / 0.5) + 1;
    for (let k = 0; k < n; k++) {
      const [x, z] = em(0.15 + k * 0.5 + 0.06);
      const comprido = t.largura + 0.12 + (rnd() - 0.5) * 0.12;
      const geo = uvEmMetrosPorTriangulo(quina(emX ? 0.26 : comprido, 0.07, emX ? comprido : 0.26, 0.02));
      const m = new THREE.Mesh(geo, madeira);
      m.position.set(x + (emX ? 0 : (rnd() - 0.5) * 0.06), 0.03, z + (emX ? (rnd() - 0.5) * 0.06 : 0));
      m.rotation.y = (rnd() - 0.5) * 0.06;
      g.add(m);
    }
  }
}

/** a PEDRA PORTUGUESA: a calçada de pedrinha da praça, com a guia de pedra escura */
function portuguesa(trechos: readonly TrechoDeCaminho[], g: THREE.Group): void {
  const mat = toon(P.pedraPortuguesa, { mapa: calcadaDePedrinha(1.2, 7), decal: true });
  for (const t of trechos) {
    g.add(faixa(t, mat));
    guias(t, g, P.pedraDoCaminhoEscura, reboco(0.6));
  }
}

const MONTA: Record<EstiloDeCaminho, (trechos: readonly TrechoDeCaminho[], g: THREE.Group) => void> = {
  lajes, pedras, tijolinho, dormentes, portuguesa,
};

/** O caminho inteiro num estilo, já no lugar (para a cena juntar como fundo e trocar). */
export function caminhoDoQuintal(estilo: EstiloDeCaminho, trechos: readonly TrechoDeCaminho[]): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = `caminho-${estilo}`;
  MONTA[estilo](trechos, g);
  return g;
}

/**
 * Um PEDAÇO do caminho, centrado na origem: é o retrato do cartão no Papita
 * (2,4 m de caminho, a largura da casa).
 */
export function amostraDeCaminho(estilo: EstiloDeCaminho): THREE.Group {
  return caminhoDoQuintal(estilo, [{ a: [0, -1.2], b: [0, 1.2], largura: 1.3 }]);
}
