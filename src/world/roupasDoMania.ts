import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { fundir } from './fundir';
import { raioDoTronco } from './uniformeDosGatitos';
import { cintaNaPele, evase, lacoDeFita, naPele, saiaViva } from './roupasDaBoutique';

/**
 * AS ROUPAS DO MANIA DE CHURRASCO — os prêmios da temporada de turnos.
 *
 * O Walter dá uma peça na primeira vez das três estrelas de cada turno (§13.5
 * de `docs/MINIGAME-RESTAURANTE.md`): a gravatinha no turno 1 (ela mora em
 * `roupas.ts`, é de antes da temporada), o avental de garçom no 2, e as
 * próximas — o bloquinho com o lápis, o colete, a bandana e o dólmã — entram
 * aqui conforme os turnos delas.
 *
 * A regra é a da skill `aristory-roupa`: cada função recebe as medidas e
 * devolve um `Object3D` NOVO, no referencial do slot (`tronco`: y = 0 no
 * CHÃO). O kit é o da boutique da Estella (`roupasDaBoutique.ts`): a saia viva
 * que acompanha a perna, a cinta e o laço.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

// ------------------------------------------------------------- o avental

/**
 * O PANO DO AVENTAL, pintado UMA vez: a sarja preta, as costuras de pesponto
 * nas bordas e na barra, o bolso largo dividido no meio, e o "Mania" bordado
 * em dourado com a chaminha do letreiro do restaurante ao lado.
 *
 * O bordado é TEXTURA, e não peça pregada por cima, de propósito: o avental é
 * uma saia viva (a perna empurra o pano a cada passo), e um "Mania" de
 * geometria ficaria parado no ar enquanto o pano andava embaixo dele. Na
 * textura, o bordado anda junto com o tecido.
 *
 * O desenho cobre o painel inteiro, de borda a borda (o UV do avental é
 * refeito de 0 a 1, ver `aventalDeGarcom`): o canvas tem a proporção do pano
 * de um adulto — uns 0,5 m de largura por 0,7 de comprimento.
 */
let panoDoAvental: THREE.CanvasTexture | null = null;
function texturaDoAvental(): THREE.CanvasTexture {
  if (panoDoAvental) return panoDoAvental;
  const W = 512;
  const H = 704;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // a sarja: o fundo e as diagonais finas da trama
    ctx.fillStyle = css(P.aventalGarcom);
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 2;
    for (let d = -H; d < W; d += 7) {
      ctx.beginPath();
      ctx.moveTo(d, H);
      ctx.lineTo(d + H, 0);
      ctx.stroke();
    }

    // o PESPONTO: linha tracejada um tom acima do pano
    const pesponto = (pontos: Array<[number, number]>, cor = css(P.aventalGarcomCostura), largura = 3): void => {
      ctx.save();
      ctx.strokeStyle = cor;
      ctx.lineWidth = largura;
      ctx.setLineDash([11, 7]);
      ctx.beginPath();
      ctx.moveTo(...pontos[0]);
      for (const p of pontos.slice(1)) ctx.lineTo(...p);
      ctx.stroke();
      ctx.restore();
    };
    // as bainhas das laterais e da barra
    const B = 18;
    pesponto([[B, 26], [B, H - B], [W - B, H - B], [W - B, 26]]);
    // a barra dobrada: uma faixa um fio mais escura embaixo
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, H - 34, W, 34);

    // O BOLSO LARGO, de lado a lado do meio: a boca dobrada (mais clara), o
    // pesponto em volta e a divisão do meio — bolso de bloquinho e de caneta
    const bx0 = W * 0.17;
    const bx1 = W * 0.83;
    const by0 = H * 0.5;
    const by1 = H * 0.72;
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(bx0, by0, bx1 - bx0, 12);
    pesponto([[bx0 + 6, by0 + 18], [bx0 + 6, by1 - 6], [bx1 - 6, by1 - 6], [bx1 - 6, by0 + 18]]);
    pesponto([[bx0, by0 + 13], [bx1, by0 + 13]]);
    pesponto([[W / 2, by0 + 18], [W / 2, by1 - 6]]);

    // O "MANIA" BORDADO, acima do bolso: a letra do letreiro do restaurante,
    // cheia de fio dourado, com o contorno no dourado escuro (é o ponto
    // cheio de bordado que faz a borda) e um brilho de fio na diagonal
    const texto = 'Mania';
    const cy = H * 0.33;
    ctx.font = `bold 118px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const largo = ctx.measureText(texto).width;
    const cx = W / 2 + 22;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = css(P.aventalGarcomBordadoEscuro);
    ctx.lineWidth = 10;
    ctx.strokeText(texto, cx, cy);
    ctx.fillStyle = css(P.aventalGarcomBordado);
    ctx.fillText(texto, cx, cy);
    // os fios: riscas finas em diagonal só dentro das letras
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(255,240,190,0.35)';
    ctx.lineWidth = 2;
    for (let d = cx - largo; d < cx + largo; d += 6) {
      ctx.beginPath();
      ctx.moveTo(d, cy + 60);
      ctx.lineTo(d + 50, cy - 60);
      ctx.stroke();
    }
    ctx.restore();

    // a chaminha do letreiro, à esquerda da palavra, também em fio dourado
    const fx = cx - largo / 2 - 40;
    const fy = cy + 6;
    const gota = (s: number, cor: string): void => {
      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.moveTo(fx, fy - s * 1.6);
      ctx.bezierCurveTo(fx + s * 0.35, fy - s * 0.9, fx + s * 1.05, fy - s * 0.35, fx + s * 0.85, fy + s * 0.35);
      ctx.bezierCurveTo(fx + s * 0.7, fy + s * 0.95, fx - s * 0.7, fy + s * 0.95, fx - s * 0.85, fy + s * 0.35);
      ctx.bezierCurveTo(fx - s * 1.0, fy - s * 0.2, fx - s * 0.5, fy - s * 0.6, fx, fy - s * 1.6);
      ctx.closePath();
      ctx.fill();
    };
    gota(30, css(P.aventalGarcomBordadoEscuro));
    gota(25, css(P.aventalGarcomBordado));
    gota(12, css(P.aventalGarcomBordadoEscuro));

    // "de Churrasco", pequeno, embaixo: em pesponto dourado, como a linha
    // fina que os bordados de uniforme fazem debaixo da marca
    ctx.font = `bold 34px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.fillStyle = css(P.aventalGarcomBordado);
    ctx.fillText('de Churrasco', W / 2, cy + 82);
  }
  panoDoAvental = new THREE.CanvasTexture(canvas);
  panoDoAvental.colorSpace = THREE.SRGBColorSpace;
  panoDoAvental.anisotropy = 4;
  return panoDoAvental;
}

/**
 * O AVENTAL DE GARÇOM DO MANIA — prêmio das três estrelas do turno 2.
 *
 * Avental de bistrô: só da cintura para baixo, COMPRIDO (até o meio da
 * canela), preto, com o "Mania" bordado em dourado, o bolso largo de
 * bloquinho e a fita amarrada num laço nas costas. Vai por CIMA da roupa
 * (sem `cor` na ficha): a camiseta de baixo continua a da pessoa.
 *
 * COMPRIDO SÓ DÁ PORQUE É SAIA VIVA. O avental da Josefina para no meio da
 * coxa justamente porque pano comprido e rígido é o que a perna atravessa na
 * passada. Este é um PAINEL de `saiaViva` (a frente e os lados, aberto atrás,
 * como avental de verdade): a perna que avança empurra o pano, e sentado ele
 * cai do colo como cortina.
 *
 * REFERENCIAL: o tronco, y = 0 no CHÃO.
 */
function aventalDeGarcom(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const quadril = m.legH;
  const cintura = quadril + m.torsoH * 0.2;
  // o raio do calção do rig: toda cintura de saia tem que cobri-lo
  const raioDoCalcao = h * 0.118 * w;
  const r0 = Math.max(raioDoTronco(m, cintura) * 1.07, raioDoCalcao * 1.06);
  const pano = toon(0xffffff, { mapa: texturaDoAvental(), doubleSide: true });
  const fita = toon(P.aventalGarcomFita, { doubleSide: true });

  // O PAINEL: 150° da frente e dos lados, da cintura ao meio da canela, com
  // um evasê leve e quatro dobras rasas (avental de sarja cai quase reto)
  const COLUNAS = 40;
  const LINHAS = 16;
  const ARCO = 1.3;
  const saia = saiaViva(m, {
    yTopo: cintura + h * 0.004,
    yBarra: quadril * 0.36,
    raio: evase(r0, r0 * 1.42, 4, h * 0.003, 0.9),
    arco: [-ARCO, ARCO],
    colunas: COLUNAS,
    linhas: LINHAS,
  }, pano);
  /**
   * O UV DA SAIA VIVA É EM METROS (para a estampa de azulejo da boutique ter
   * o mesmo tamanho em todo pano). Aqui o desenho é UM só e cobre o painel de
   * borda a borda, então ele é refeito de 0 a 1: `u` no arco, `v` da cintura
   * (1, o alto do canvas) até a barra (0). A ordem dos vértices é a da
   * `saiaViva`: coluna por coluna, linha por linha (sem cortes, as linhas são
   * `LINHAS + 1`).
   */
  const uv = saia.geometry.attributes.uv as THREE.BufferAttribute;
  const NL = LINHAS + 1;
  for (let k = 0; k < uv.count; k++) {
    const i = Math.floor(k / NL);
    const j = k % NL;
    uv.setXY(k, i / COLUNAS, 1 - j / LINHAS);
  }
  uv.needsUpdate = true;
  g.add(saia);

  // A FITA da cintura, a volta inteira, e o laço com as pontas nas costas
  const yFita = cintura + h * 0.002;
  g.add(new THREE.Mesh(cintaNaPele(m, yFita, h * 0.009, 1.1), fita));
  const laco = lacoDeFita(h * 0.022, fita, 2.4);
  // nas costas e virado para fora (o laço olha para `+Z`)
  laco.position.copy(naPele(m, Math.PI, yFita, 1.13));
  laco.rotation.y = Math.PI;
  g.add(laco);

  return fundir(g);
}

export { aventalDeGarcom };
