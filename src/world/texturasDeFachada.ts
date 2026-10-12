import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { novaTextura, sorteio } from './texturasDeChao';

/**
 * Texturas de FACHADA: o reboco da parede, o friso do térreo e o tijolinho
 * do rodapé. Nasceram para a lojinha de roupas do Villa Lobos, e servem a
 * qualquer prédio de rua que queira parede de verdade em vez de cor chapada.
 *
 * As mesmas regras das texturas de chão e de casa: desenho em `<canvas>` na
 * hora em que o jogo sobe, nenhum arquivo de imagem, azulejo medido em METROS
 * (o UV vem de `uvDeParede()`, em `world/acabamento.ts`), e traço de 2 px ou
 * mais — o mipmap come o resto.
 *
 * O reboco e o friso são QUASE BRANCOS: o `toon()` multiplica a cor da
 * paleta pela textura, e a parede continua rosa porque quem dá o rosa é a
 * paleta. O tijolinho é a exceção, e por um motivo: rejunte é CLARO, e
 * multiplicar só escurece. Ali o desenho pinta o tijolo com a própria cor
 * da paleta (`P.lojaTijolo`) sobre fundo branco, e o material é o creme da
 * esquadria — o rejunte sai creme e o tijolo sai tijolo.
 */

/** pinta `desenhar` em volta da emenda: a mancha cortada na borda continua do outro lado */
function emVolta(s: number, x: number, y: number, r: number, desenhar: (x: number, y: number) => void): void {
  for (const dx of [-s, 0, s]) {
    for (const dy of [-s, 0, s]) {
      const px = x + dx;
      const py = y + dy;
      if (px + r < 0 || px - r > s || py + r < 0 || py - r > s) continue;
      desenhar(px, py);
    }
  }
}

/** a massa do reboco: manchas largas e apagadas, e o granulado da areia */
function massa(ctx: CanvasRenderingContext2D, s: number, semente: number): void {
  const rnd = sorteio(semente);
  ctx.fillStyle = '#fbfbfb';
  ctx.fillRect(0, 0, s, s);
  /*
   * MANCHA SOLTA, E NÃO GRADE — a lição do sofá: soma de senos deixa a
   * treliça à mostra e a parede sai quadriculada. Aqui são manchas redondas
   * em lugar sorteado, umas mais claras e outras mais escuras, como reboco
   * pintado à mão: a demão nunca sai igual.
   */
  for (let i = 0; i < 46; i++) {
    const r = s * (0.06 + rnd() * 0.16);
    const claro = rnd() < 0.45;
    const alfa = 0.035 + rnd() * 0.04;
    emVolta(s, rnd() * s, rnd() * s, r, (x, y) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const cor = claro ? '255,255,255' : '196,186,186';
      g.addColorStop(0, `rgba(${cor},${alfa})`);
      g.addColorStop(1, `rgba(${cor},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    });
  }
  // a areia: grão de 2 px, o menor que sobrevive ao mipmap
  for (let i = 0; i < 2600; i++) {
    const t = rnd() < 0.55 ? 255 : 200;
    ctx.fillStyle = `rgba(${t},${t},${t},0.32)`;
    ctx.fillRect(Math.floor(rnd() * s), Math.floor(rnd() * s), 2, 2);
  }
}

/**
 * REBOCO, para a parede lisa (o andar de cima, a platibanda, as laterais).
 *
 * É quase nada, de propósito: a parede de sete metros sem textura lia como
 * papelão, e com textura forte lia como parede suja. O que se quer é a
 * parede "respirar" — a demão de tinta que nunca sai igual.
 */
export function reboco(lado = 1.6): THREE.CanvasTexture {
  return novaTextura(`reboco:${lado}`, lado, (ctx, s) => massa(ctx, s, 3131));
}

/**
 * REBOCO COM FRISOS, para o térreo: o mesmo reboco, cortado por frisos
 * deitados a cada terço do azulejo.
 *
 * O friso é a assinatura de fachada de loja antiga — o térreo "pesa" e o
 * andar de cima fica leve. Cada friso é um traço escuro (a sombra dentro do
 * sulco) com um filete claro logo embaixo (a luz batendo na borda de baixo):
 * é esse par que faz o sulco parecer fundo sem nenhum relevo de verdade.
 *
 * SÓ DEITADO. O UV de `uvDeParede()` põe o `v` sempre na altura, então o
 * friso corre na horizontal em toda face — no montante estreito e na
 * parede larga, que é onde o `uvEmMetros` dos móveis (U no lado mais
 * comprido) o teria posto em pé.
 */
export function rebocoComFrisos(lado = 1.2): THREE.CanvasTexture {
  return novaTextura(`frisos:${lado}`, lado, (ctx, s) => {
    massa(ctx, s, 7177);
    const sulco = Math.max(3, Math.round(s * 0.018));
    for (let k = 0; k < 3; k++) {
      const y = Math.round((s / 3) * k);
      ctx.fillStyle = 'rgba(150,118,122,0.34)';
      ctx.fillRect(0, y, s, sulco);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillRect(0, y + sulco, s, Math.max(2, Math.round(sulco * 0.6)));
    }
  });
}

/** o hex da paleta em `r,g,b`, puxado (ou empurrado) por `k` */
function rgb(hex: number, k = 1): string {
  const c = (v: number): number => Math.max(0, Math.min(255, Math.round(v * k)));
  return `${c((hex >> 16) & 255)},${c((hex >> 8) & 255)},${c(hex & 255)}`;
}

/**
 * TIJOLINHO, para o rodapé.
 *
 * Aparelho corrido (cada fiada meio tijolo deslocada da de baixo), seis
 * fiadas por azulejo e dois tijolos por fiada. O tijolo tem 42 × 14 cm, que
 * é maior que o de verdade, e é de propósito — a lição da pedrinha da
 * calçada: na medida certa ele vira chiado a esta distância de câmera; maior,
 * o aparelho aparece.
 *
 * Cada tijolo tem o próprio tom (queimado um pouco mais ou menos), uma borda
 * de cima mais clara e uma de baixo mais escura — o mesmo par de luz e sombra
 * do friso, que dá relevo sem geometria.
 *
 * `cor` é o barro: o rosado da lojinha da Estella por padrão, e o tijolo de
 * churrascaria (`P.churrascoTijolo`, o mesmo da parede da grelha por dentro)
 * no restaurante do clube.
 */
export function tijolinho(lado = 0.84, cor: number = P.lojaTijolo): THREE.CanvasTexture {
  return novaTextura(`tijolinho:${lado}:${cor}`, lado, (ctx, s) => {
    const rnd = sorteio(8423);
    // o fundo é o rejunte: branco, que o material tinge de creme
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const fiadas = 6;
    const porFiada = 2;
    const alt = s / fiadas;
    const comp = s / porFiada;
    const junta = Math.max(3, Math.round(s * 0.016));
    for (let f = 0; f < fiadas; f++) {
      const desloca = f % 2 ? comp / 2 : 0;
      // o tijolo cortado pela emenda aparece nas duas bordas: o tom é sorteado
      // por tijolo, e não por pedaço, senão ele muda de cor no meio
      const tons = Array.from({ length: porFiada }, () => 0.9 + rnd() * 0.16);
      for (let k = -1; k <= porFiada; k++) {
        const x0 = k * comp + desloca + junta / 2;
        const y0 = f * alt + junta / 2;
        const w = comp - junta;
        const h = alt - junta;
        if (x0 > s || x0 + w < 0) continue;
        const tom = tons[((k % porFiada) + porFiada) % porFiada];
        ctx.fillStyle = `rgb(${rgb(cor, tom)})`;
        ctx.fillRect(x0, y0, w, h);
        // a luz na aresta de cima e a sombra na de baixo
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(x0, y0, w, 2);
        ctx.fillStyle = 'rgba(70,30,30,0.18)';
        ctx.fillRect(x0, y0 + h - 2, w, 2);
        // o queimado do barro: pintas de 2 px dentro do tijolo
        for (let p = 0; p < 10; p++) {
          const escuro = rnd() < 0.6;
          ctx.fillStyle = escuro ? `rgba(${rgb(cor, 0.72)},0.5)` : 'rgba(255,240,230,0.35)';
          ctx.fillRect(x0 + 2 + rnd() * (w - 6), y0 + 3 + rnd() * (h - 8), 2 + rnd() * 2, 2);
        }
      }
    }
  });
}
