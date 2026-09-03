import * as THREE from 'three';

/**
 * Texturas de chão, desenhadas em `<canvas>` na hora em que o jogo sobe.
 *
 * POR QUE TEXTURA E NÃO DECALQUE. O jogo já sabe manchar o chão com
 * `w.patch()`/`w.disc()`, e é assim que a praça do parque tem terra e calçada.
 * Mas o deque do clube tem 48 × 38: um piso de placas de 2 m viraria mais de
 * 400 malhas só para desenhar as juntas, e a grama em volta pediria outras
 * tantas. Uma textura que se repete faz o mesmo trabalho com UMA malha e um
 * desenho de 256 px.
 *
 * ISTO NÃO QUEBRA O "ZERO ASSET". A regra do projeto é que nenhum arquivo de
 * imagem entra no repositório — e nenhum entra: o desenho é código, pintado com
 * a API Canvas 2D em tempo de execução, exatamente como o texto das placas
 * (`letreiro()`) e as memórias do quadro do Ari.
 *
 * COMO O TAMANHO FUNCIONA. O `ShapeGeometry`, que é o que o `groundWithHoles`
 * usa, gera UV a partir da POSIÇÃO do vértice — em unidades de mundo, e não em
 * 0..1 como o `PlaneGeometry`. Isso é uma sorte aqui: basta `repeat = 1/lado`
 * para o azulejo sair sempre do mesmo tamanho, seja num chão de 34 ou de 160.
 *
 * AS CORES SÃO QUASE BRANCAS, de propósito. O material toon MULTIPLICA a cor
 * base pela textura, então tudo que for escuro aqui vira sujeira lá. O desenho
 * trabalha entre 0,88 e 1,0 de luminosidade: o suficiente para o olho ver junta
 * e granulado, longe o bastante de virar uma segunda camada de tinta.
 */

/** cada textura é desenhada UMA vez e reaproveitada por todas as cenas */
const cache = new Map<string, THREE.CanvasTexture>();

/**
 * Ruído determinístico. Não usa `Math.random` porque a textura é desenhada uma
 * vez e vive a sessão inteira: se ela mudasse a cada carga, o mesmo cenário
 * teria chão diferente a cada partida — e depurar "a mancha está no lugar
 * errado" viraria impossível.
 */
function sorteio(semente: number): () => number {
  let s = semente >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function novaTextura(chave: string, lado: number, pintar: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const pronta = cache.get(chave);
  if (pronta) return pronta;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  // `lado` é o tamanho do azulejo em unidades de MUNDO; o UV do `ShapeGeometry`
  // já vem em metros, então o repeat é o inverso dele
  tex.repeat.set(1 / lado, 1 / lado);
  tex.colorSpace = THREE.SRGBColorSpace;
  // sem anisotropia o piso vira listra cintilante no fundo da tela, que é onde
  // o azulejo fica quase de perfil
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  cache.set(chave, tex);
  return tex;
}

/**
 * PISO DE PLACAS, para o deque do clube.
 *
 * Uma placa por azulejo, com junta nos dois lados e um granulado de cimento por
 * dentro. A junta é desenhada em DUAS bordas só (a de cima e a da esquerda):
 * com as quatro, a repetição soma junta com junta e a linha sai com o dobro da
 * espessura no encontro dos azulejos.
 *
 * O CANTINHO DESGASTADO é o detalhe que tira a cara de "gerado por script":
 * quatro manchinhas claras nas quinas, como placa de piscina que já viu sol.
 */
export function pisoDePlacas(lado = 2): THREE.CanvasTexture {
  return novaTextura(`placas:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(20260903);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);

    // o granulado de cimento: pontinhos claros e escuros, bem de leve
    for (let i = 0; i < 2600; i++) {
      const claro = rnd() > 0.5;
      ctx.fillStyle = claro ? 'rgba(255,255,255,0.9)' : `rgba(120,110,95,${0.05 + rnd() * 0.05})`;
      const r = 0.6 + rnd() * 1.5;
      ctx.beginPath();
      ctx.arc(rnd() * s, rnd() * s, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // manchas largas e suaves, para o piso não ficar uniformemente pontilhado
    for (let i = 0; i < 7; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.08 + rnd() * 0.14);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(150,142,126,${0.05 + rnd() * 0.04})`);
      g.addColorStop(1, 'rgba(150,142,126,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // as juntas — só em duas bordas, ver o cabeçalho
    const junta = s * 0.016;
    ctx.fillStyle = 'rgba(112,104,90,0.34)';
    ctx.fillRect(0, 0, s, junta);
    ctx.fillRect(0, 0, junta, s);
    // uma luz do lado de dentro da junta: é ela que dá relevo à placa
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, junta, s, junta * 0.7);
    ctx.fillRect(junta, 0, junta * 0.7, s);

    // os cantinhos desgastados
    for (const [cx, cy] of [[0, 0], [s, 0], [0, s], [s, s]] as const) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.16);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - s * 0.16, cy - s * 0.16, s * 0.32, s * 0.32);
    }
  });
}

/**
 * GRAMA, para o tapete verde em volta do clube.
 *
 * Aqui a repetição é INIMIGA: azulejo de grama vira xadrez na hora. Três
 * defesas contra isso, e as três importam:
 *
 *  1. o azulejo é GRANDE (9 unidades), então a repetição cai fora do que a
 *     câmera enquadra de uma vez. Com 6 dava para pegar a grade das manchas
 *     largas na vista de longe do clube — 9 empurra a repetição para fora do
 *     enquadramento;
 *  2. NENHUMA borda desenhada — nada de linha, nada de moldura, só conteúdo
 *     solto que atravessa a emenda;
 *  3. as manchas largas são desenhadas em NOVE cópias, uma por vizinho, para
 *     que uma mancha cortada na borda continue do outro lado. É o que faz a
 *     emenda sumir de vez.
 *
 * Os tufos são traços curtos e inclinados, e não pontos: ponto lê como areia,
 * traço lê como folha.
 */
export function tapeteDeGrama(lado = 9): THREE.CanvasTexture {
  return novaTextura(`grama:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(777001);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);

    // as manchas largas, em 3×3 cópias para atravessar as emendas
    for (let i = 0; i < 9; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.14 + rnd() * 0.2);
      const escura = rnd() > 0.45;
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
          g.addColorStop(0, escura ? 'rgba(96,124,74,0.11)' : 'rgba(255,255,255,0.34)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
        }
      }
    }

    // os tufos
    ctx.lineCap = 'round';
    for (let i = 0; i < 1500; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const a = -Math.PI / 2 + (rnd() - 0.5) * 1.1;
      const comp = 2.5 + rnd() * 4.5;
      const claro = rnd() > 0.42;
      ctx.strokeStyle = claro
        ? `rgba(255,255,255,${0.3 + rnd() * 0.4})`
        : `rgba(78,110,58,${0.08 + rnd() * 0.1})`;
      ctx.lineWidth = 0.9 + rnd() * 0.9;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * comp, y + Math.sin(a) * comp);
      ctx.stroke();
    }
  });
}
