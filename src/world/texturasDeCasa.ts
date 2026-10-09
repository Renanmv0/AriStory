import * as THREE from 'three';
import { novaTextura, sorteio } from './texturasDeChao';

/**
 * Texturas de DENTRO DE CASA: a madeira dos móveis, o tecido do sofá e da
 * roupa de cama, o matelassê do edredom, o tapete felpudo e o capacho.
 *
 * Mesma regra das texturas de chão (`texturasDeChao.ts`), e pelos mesmos
 * motivos: desenho em `<canvas>` na hora em que o jogo sobe, nenhum arquivo de
 * imagem, e tudo QUASE BRANCO — o `toon()` multiplica a cor da paleta pela
 * textura, então o desenho só pode escurecer de leve (0,8 a 1,0 de luz). Quem
 * dá a cor continua sendo a paleta: a mesma madeira listrada serve para o
 * criado-mudo claro e para a cabeceira escura.
 *
 * O TAMANHO É EM METROS. Nos móveis o UV vem de `uvEmMetros()`
 * (`world/acabamento.ts`), que reescreve o UV da caixa a partir da posição do
 * vértice; com isso `repeat = 1/lado` dá o mesmo veio na tampa de 1,6 m da
 * escrivaninha e no pé de 6 cm da cadeira. Sem isso a caixa espicha o desenho
 * inteiro em cada face, e o veio sai fino num lado e grosso no outro.
 *
 * O TRAÇO TEM 1,5 PX OU MAIS: a esta distância de câmera o mipmap come o que
 * for mais fino, e o móvel volta a ficar liso (a lição do grão do asfalto).
 */

/** pinta uma linha horizontal ondulada que fecha nas duas bordas do azulejo */
function linhaQueFecha(
  ctx: CanvasRenderingContext2D, s: number, y0: number, amp: number, ondas: number, fase: number,
): void {
  // desenhada três vezes (em cima, no lugar e embaixo) para atravessar a
  // emenda vertical sem corte
  for (const dy of [-s, 0, s]) {
    ctx.beginPath();
    for (let x = 0; x <= s; x += 4) {
      const y = y0 + dy + amp * Math.sin((Math.PI * 2 * ondas * x) / s + fase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/**
 * VEIO DE MADEIRA, para os móveis.
 *
 * Madeira de móvel é mais calma que assoalho: não tem junta, só o veio
 * correndo no comprimento da peça. Três camadas: as faixas largas e
 * apagadas (o anel de crescimento cortado de lado), os riscos finos e
 * ondulados, e um nó de vez em quando. As ondas têm número inteiro de
 * períodos por azulejo, e é isso que esconde a emenda.
 *
 * O veio corre em U. Quem decide para onde U aponta em cada face é
 * `uvEmMetros()`: sempre no lado mais comprido, como numa tábua de verdade.
 */
export function veioDeMadeira(lado = 0.9): THREE.CanvasTexture {
  return novaTextura(`veio:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(5150);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);

    // as faixas largas
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(150,100,55,${0.05 + rnd() * 0.05})`;
      ctx.lineWidth = 8 + rnd() * 22;
      linhaQueFecha(ctx, s, rnd() * s, 2 + rnd() * 5, 1 + Math.floor(rnd() * 2), rnd() * 6.28);
    }
    // os riscos
    for (let k = 0; k < 30; k++) {
      ctx.strokeStyle = `rgba(120,78,40,${0.1 + rnd() * 0.16})`;
      ctx.lineWidth = 1.5 + rnd() * 1.4;
      linhaQueFecha(ctx, s, rnd() * s, 1 + rnd() * 4, 1 + Math.floor(rnd() * 3), rnd() * 6.28);
    }
    // um nó: anéis achatados, com cópias para fechar a emenda
    const nx = s * 0.62;
    const ny = s * 0.3;
    for (const [dx, dy] of [[0, 0], [-s, 0], [s, 0], [0, -s], [0, s]] as const) {
      for (let r = 0; r < 4; r++) {
        ctx.strokeStyle = `rgba(110,70,35,${0.22 - r * 0.04})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(nx + dx, ny + dy, 5 + r * 5, 2 + r * 2.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  });
}

/**
 * TECIDO MESCLADO, para o sofá.
 *
 * SEM TRAMA. A primeira versão desenhava os fios (sarja de 6 mm), e na tela
 * eles viravam MOIRÉ: manchas cinzentas de 5 cm nos travesseiros, porque o
 * fio cai perto do tamanho do pixel e a grade da tela "bate" com a do pano.
 * Nada menor que uns 2 cm sobrevive a esta câmera; o que o olho lê como
 * tecido é a MESCLA — manchas largas e suaves de fio mais claro e mais
 * escuro, como algodão de verdade.
 */
export function tramaDeTecido(lado = 0.5): THREE.CanvasTexture {
  return novaTextura(`tecido:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(2718);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, s, s);
    /**
     * Nada de grade. Soma de senos e ruído de grade (os dois foram tentados)
     * deixavam a TRELIÇA à mostra: o sofá saía quadriculado, como capitonê.
     * Aqui são manchas redondas soltas, cada uma num lugar sorteado, e um
     * granulado de 2 px por cima — mescla de algodão, sem padrão para o olho
     * achar. A mancha que passa da borda é pintada de novo do outro lado.
     */
    const pintar = (x: number, y: number, desenhar: (x: number, y: number) => void): void => {
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) desenhar(x + dx, y + dy);
    };
    for (let i = 0; i < 140; i++) {
      const r = 8 + rnd() * 26;
      const claro = rnd() < 0.5;
      const alfa = 0.05 + rnd() * 0.05;
      pintar(rnd() * s, rnd() * s, (x, y) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const cor = claro ? '255,255,255' : '200,200,200';
        g.addColorStop(0, `rgba(${cor},${alfa})`);
        g.addColorStop(1, `rgba(${cor},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      });
    }
    for (let i = 0; i < 5000; i++) {
      const t = rnd() < 0.5 ? 255 : 205;
      ctx.fillStyle = `rgba(${t},${t},${t},0.35)`;
      ctx.fillRect(Math.floor(rnd() * s), Math.floor(rnd() * s), 2, 2);
    }
  });
}

/**
 * MATELASSÊ, para o edredom.
 *
 * O edredom de verdade é estofado em losangos costurados: cada losango
 * estufa no meio e afunda na costura. O toon não tem relevo, então o relevo
 * vem PINTADO — claro no miolo do losango, escuro perto da costura, e a
 * costura tracejada por cima. É a única textura daqui que "faz luz", e é por
 * isso que o edredom deixa de parecer uma placa azul.
 *
 * Dois losangos por azulejo nas duas diagonais (`a = (x+y)`, `b = (x-y)`),
 * escolhidos para que somar `s` em x ou em y ande um número inteiro de
 * losangos: o desenho fecha sozinho na emenda.
 */
export function matelasse(lado = 0.34): THREE.CanvasTexture {
  return novaTextura(`matelasse:${lado}`, lado, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const meio = s / 2;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const a = (x + y) / meio;
        const b = (x - y + s) / meio;
        const fa = a - Math.floor(a);
        const fb = b - Math.floor(b);
        const estufado = Math.pow(Math.sin(Math.PI * fa) * Math.sin(Math.PI * fb), 0.55);
        let v = 0.8 + 0.2 * estufado;
        // a costura: perto da borda do losango, tracejada pelo outro eixo
        const pertoA = Math.min(fa, 1 - fa) * meio;
        const pertoB = Math.min(fb, 1 - fb) * meio;
        if (pertoA < 1.6 && (fb * 7) % 1 < 0.62) v = 0.74;
        if (pertoB < 1.6 && (fa * 7) % 1 < 0.62) v = 0.74;
        const i = (y * s + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(v * 255);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
}

/**
 * GRANITO, para a pedra da bancada da cozinha.
 *
 * Grão de 2 a 3 px, escuro e claro misturados, sem nenhuma direção — é a
 * ausência de veio que diz "pedra" e não "madeira".
 */
export function granito(lado = 0.6): THREE.CanvasTexture {
  return novaTextura(`granito:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(4242);
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1500; i++) {
      const escuro = rnd() < 0.6;
      const t = escuro ? 150 + rnd() * 70 : 255;
      ctx.fillStyle = `rgba(${t},${t},${t},${escuro ? 0.35 + rnd() * 0.4 : 0.7})`;
      const r = 1 + rnd() * 1.6;
      const x = rnd() * s;
      const y = rnd() * s;
      ctx.fillRect(x, y, r * 1.4, r);
      // o grão que passa da borda reaparece do outro lado
      if (x > s - 4) ctx.fillRect(x - s, y, r * 1.4, r);
      if (y > s - 4) ctx.fillRect(x, y - s, r * 1.4, r);
    }
  });
}

export type EstiloDeTapete = 'felpudo' | 'capacho';

const tapetes = new Map<string, THREE.CanvasTexture>();

/**
 * O DESENHO INTEIRO DE UM TAPETE, e não um azulejo.
 *
 * Tapete tem borda: a faixa da beirada e o losango do meio só existem uma vez,
 * então este canvas cobre a peça toda (UV de 0 a 1, sem repetir) e tem a
 * PROPORÇÃO do tapete — um 2,6 × 2,0 e um capacho de 1,4 × 0,8 são desenhos
 * diferentes, guardados cada um na sua chave.
 *
 *  - `felpudo`: o pelo é feito de milhares de tufinhos de 2 a 3 px, claros e
 *    escuros; por cima, a faixa clara da beirada com dois filetes e um losango
 *    claro no meio;
 *  - `capacho`: fibra de coco, traços curtos quase todos em pé, e a borda
 *    mais escura, que é como capacho de verdade é.
 */
export function desenhoDeTapete(largura: number, profundidade: number, estilo: EstiloDeTapete): THREE.CanvasTexture {
  const chave = `${estilo}:${largura}:${profundidade}`;
  const pronto = tapetes.get(chave);
  if (pronto) return pronto;

  const W = 512;
  const H = Math.max(64, Math.round((W * profundidade) / largura));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const rnd = sorteio(estilo === 'felpudo' ? 7781 : 9902);
  /** pixels por metro: o tufo tem o mesmo tamanho em tapete grande e pequeno */
  const ppm = W / largura;

  if (ctx) {
    ctx.fillStyle = estilo === 'felpudo' ? '#f4f4f4' : '#efefef';
    ctx.fillRect(0, 0, W, H);

    const tufos = Math.round(W * H * (estilo === 'felpudo' ? 0.09 : 0.12));
    for (let i = 0; i < tufos; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const claro = rnd() < 0.5;
      const t = claro ? 255 : 175 + rnd() * 50;
      ctx.strokeStyle = `rgba(${t},${t},${t},${claro ? 0.7 : 0.4})`;
      ctx.lineWidth = 1.6 + rnd() * 1.2;
      const ang = estilo === 'capacho' ? Math.PI / 2 + (rnd() - 0.5) * 0.6 : rnd() * Math.PI;
      const comp = (estilo === 'capacho' ? 4 : 2.5) + rnd() * 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang) * comp, y + Math.sin(ang) * comp);
      ctx.stroke();
    }

    const m = Math.round(Math.min(W, H) * 0.09);
    if (estilo === 'felpudo') {
      // a faixa clara da beirada, entre dois filetes
      const faixa = Math.max(6, Math.round(0.09 * ppm));
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(m, m, W - 2 * m, faixa);
      ctx.fillRect(m, H - m - faixa, W - 2 * m, faixa);
      ctx.fillRect(m, m, faixa, H - 2 * m);
      ctx.fillRect(W - m - faixa, m, faixa, H - 2 * m);
      ctx.strokeStyle = 'rgba(120,60,70,0.22)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
      ctx.strokeRect(m + faixa, m + faixa, W - 2 * (m + faixa), H - 2 * (m + faixa));
      // o losango do meio
      const cx = W / 2;
      const cy = H / 2;
      const rx = (W - 2 * (m + faixa)) * 0.3;
      const ry = (H - 2 * (m + faixa)) * 0.3;
      for (const [k, alfa] of [[1, 0.4], [0.62, 0.3]] as const) {
        ctx.fillStyle = `rgba(255,255,255,${alfa})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy - ry * k);
        ctx.lineTo(cx + rx * k, cy);
        ctx.lineTo(cx, cy + ry * k);
        ctx.lineTo(cx - rx * k, cy);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = 'rgba(70,50,30,0.45)';
      ctx.lineWidth = m * 0.8;
      ctx.strokeRect(m * 0.4, m * 0.4, W - m * 0.8, H - m * 0.8);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  tapetes.set(chave, tex);
  return tex;
}
