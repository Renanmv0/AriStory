/**
 * AS TEXTURAS DO GELO DA PRAÇA DO MANO — o que faz a lâmina ler como rinque, e
 * não como piso azul-claro.
 *
 * Gelo de pista de verdade se lê por quatro coisas, e cada uma mora num
 * desenho:
 *
 *  1. a PISTA (`geloDaPista`): um canvas SÓ, do tamanho do rinque, sem
 *     azulejo. É nele que está a vida da pista inteira: os riscos de patim
 *     dando a VOLTA no rinque (é para onde todo mundo patina), as voltinhas
 *     de quem girou no meio, as freadas de lado com o pó de gelo, a geada
 *     esbranquiçada encostada na borda (onde ninguém passa e o gelo raspado
 *     se junta) e as lagoas de gelo limpo, mais fundas, no meio;
 *  2. o DETALHE (`geloDetalhe`): o azulejo miúdo dos arranhões e dos pontinhos
 *     de geada, que só aparece de perto;
 *  3. o POR DENTRO (`geloPorDentro`): as trincas, as estrelas de batida e as
 *     bolhas presas — DEBAIXO da superfície. O shader (`GeloDoRinque`, em
 *     `core/shaders.ts`) lê este desenho deslocado pela direção da câmera, e
 *     quando a câmera gira as trincas andam por baixo dos riscos: é a
 *     paralaxe que dá FUNDURA ao gelo;
 *  4. o cintilar e os riscos que a dupla deixa patinando, que são do shader.
 *
 * Os dois primeiros são COR (quase brancos: o material multiplica, e o
 * branco puro é a geada, um degrau mais clara que o gelo). O terceiro é
 * DADO: o vermelho é o quanto escurece para o azul do fundo, o verde é o
 * quanto clareia (o brilho da trinca, a bolha).
 */
import * as THREE from 'three';
import { novaTextura, sorteio } from './texturasDeChao';

/** o desenho de uma volta em torno do rinque: retângulo de quina gorda (superelipse) */
function naVolta(hx: number, hz: number, a: number, k: number): [number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const n = 0.55; // < 1: mais quadrado que a elipse
  return [Math.sign(c) * Math.abs(c) ** n * hx * k, Math.sign(s) * Math.abs(s) ** n * hz * k];
}

const pistas = new Map<string, THREE.CanvasTexture>();

/**
 * A PISTA: o canvas do rinque inteiro, `largura × profundidade` em metros, com
 * o `y` do canvas crescendo para `+Z` (a frente da praça). O UV é o da forma
 * em metros (`ShapeGeometry` deitado: `u = x`, `v = −z`), e o `repeat`/
 * `offset` levam o rinque para o 0–1.
 */
export function geloDaPista(largura: number, profundidade: number, raio: number): THREE.CanvasTexture {
  const chave = `${largura}:${profundidade}:${raio}`;
  const pronta = pistas.get(chave);
  if (pronta) return pronta;

  const W = 1024;
  const H = Math.round((W * profundidade) / largura);
  const px = W / largura; // pixels por metro
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const rnd = sorteio(31415);
    const cx = W / 2;
    const cy = H / 2;
    const hx = W / 2;
    const hy = H / 2;

    // o gelo: um degrau ABAIXO do branco, para a geada poder ser mais clara
    ctx.fillStyle = 'rgb(232,242,248)';
    ctx.fillRect(0, 0, W, H);

    // ---------------------------------------------- as lagoas de gelo limpo
    // mais fundas no meio, onde a máquina alisou; azul, não cinza
    for (let i = 0; i < 16; i++) {
      const [ox, oy] = naVolta(hx, hy, rnd() * Math.PI * 2, rnd() * 0.75);
      const r = px * (0.8 + rnd() * 1.8);
      const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, r);
      g.addColorStop(0, `rgba(150,196,222,${0.22 + rnd() * 0.2})`);
      g.addColorStop(0.6, 'rgba(170,208,228,0.12)');
      g.addColorStop(1, 'rgba(190,220,236,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx + ox - r, cy + oy - r, r * 2, r * 2);
    }

    // ------------------------------------------- a geada encostada na borda
    // um contorno largo e borrado, branco, por dentro da beira do rinque
    const contorno = (recuo: number): void => {
      const r = Math.max(4, raio * px - recuo);
      ctx.beginPath();
      ctx.roundRect(recuo, recuo, W - recuo * 2, H - recuo * 2, r);
    };
    // traços concêntricos cada vez mais finos (o `filter` do canvas não existe
    // em todo navegador): perto da beira todos se somam, mais para dentro só
    // os largos — sai um degradê sem borrar nada
    for (let k = 0; k < 16; k++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.075)';
      ctx.lineWidth = px * 2.6 * (1 - k / 16);
      contorno(0);
      ctx.stroke();
    }
    // os montinhos de raspa de gelo na beira, onde a lâmina joga o pó
    for (let i = 0; i < 70; i++) {
      const a = rnd() * Math.PI * 2;
      const [ox, oy] = naVolta(hx, hy, a, 0.9 + rnd() * 0.08);
      const r = px * (0.08 + rnd() * 0.22);
      const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, r);
      g.addColorStop(0, `rgba(255,255,255,${0.35 + rnd() * 0.35})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx + ox - r, cy + oy - r, r * 2, r * 2);
    }

    // ------------------------------------------------ os riscos dando a volta
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const trilha = (k: number, a0: number, comp: number, alfa: number, larg: number, desvio = 0): void => {
      ctx.strokeStyle = `rgba(255,255,255,${alfa})`;
      ctx.lineWidth = larg;
      ctx.beginPath();
      const passos = Math.max(6, Math.round(comp * 18));
      const onda = rnd() * 6;
      for (let p = 0; p <= passos; p++) {
        const t = p / passos;
        const a = a0 + comp * t;
        const kk = k + 0.025 * Math.sin(t * 7 + onda) + 0.012 * Math.sin(t * 19 + onda * 2);
        const [ox, oy] = naVolta(hx, hy, a, kk);
        const x = cx + ox + desvio * Math.cos(a);
        const y = cy + oy + desvio * Math.sin(a);
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    for (let i = 0; i < 190; i++) {
      // mais riscos na faixa onde se patina (0,55 a 0,85 do caminho até a borda)
      const k = rnd() < 0.7 ? 0.55 + rnd() * 0.3 : 0.2 + rnd() * 0.72;
      const a0 = rnd() * Math.PI * 2;
      const comp = 0.25 + rnd() * 1.6;
      const alfa = 0.18 + rnd() * 0.42;
      const larg = 0.8 + rnd() * 1.6;
      trilha(k, a0, comp, alfa, larg);
      // a outra lâmina do mesmo patins, colada
      if (rnd() < 0.45) trilha(k, a0 + 0.02, comp * 0.9, alfa * 0.7, larg * 0.8, 2.2 + rnd() * 2);
    }

    // ------------------------------------- as voltinhas de quem girou no meio
    for (let i = 0; i < 4; i++) {
      const [ox, oy] = naVolta(hx, hy, rnd() * Math.PI * 2, rnd() * 0.4);
      const r0 = px * (0.25 + rnd() * 0.35);
      ctx.strokeStyle = `rgba(255,255,255,${0.16 + rnd() * 0.14})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      const voltas = 1.2 + rnd() * 0.8;
      for (let p = 0; p <= 80; p++) {
        const t = p / 80;
        const a = t * voltas * Math.PI * 2;
        const r = r0 * (0.5 + 0.5 * t) * (1 + 0.12 * Math.sin(a * 3 + i));
        const x = cx + ox + Math.cos(a) * r;
        const y = cy + oy + Math.sin(a) * r * 0.75;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // -------------------------------- as freadas de lado, com o pó de gelo
    for (let i = 0; i < 6; i++) {
      const a = rnd() * Math.PI * 2;
      const [ox, oy] = naVolta(hx, hy, a, 0.45 + rnd() * 0.4);
      const x = cx + ox;
      const y = cy + oy;
      const rumo = a + Math.PI / 2 + (rnd() - 0.5) * 0.6;
      const comp = px * (0.3 + rnd() * 0.25);
      // o leque de raspas
      for (let k = 0; k < 9; k++) {
        const b = rumo + (k / 8 - 0.5) * 0.5;
        ctx.strokeStyle = `rgba(255,255,255,${0.25 + rnd() * 0.3})`;
        ctx.lineWidth = 1 + rnd() * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(b) * comp * (0.6 + rnd() * 0.4), y + Math.sin(b) * comp * (0.6 + rnd() * 0.4));
        ctx.stroke();
      }
      // e o pó jogado na ponta
      const g = ctx.createRadialGradient(x + Math.cos(rumo) * comp, y + Math.sin(rumo) * comp, 0, x + Math.cos(rumo) * comp, y + Math.sin(rumo) * comp, comp * 0.6);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x + Math.cos(rumo) * comp - comp, y + Math.sin(rumo) * comp - comp, comp * 2, comp * 2);
    }

    // ---------------------------------- os arranhões soltos, em toda direção
    for (let i = 0; i < 420; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const a = rnd() * Math.PI * 2;
      const comp = 6 + rnd() * 34;
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + rnd() * 0.22})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * comp, y + Math.sin(a) * comp);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  // a forma está em metros, centrada: o rinque vai de −meio a +meio
  tex.repeat.set(1 / largura, 1 / profundidade);
  tex.offset.set(0.5, 0.5);
  pistas.set(chave, tex);
  return tex;
}

/**
 * O DETALHE: arranhões finos em toda direção e os pontinhos de geada, num
 * azulejo de 2 m. Quase branco (multiplica); o pontinho é o branco cheio.
 */
export function geloDetalhe(lado = 2): THREE.CanvasTexture {
  return novaTextura(`gelo-detalhe:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(2718);
    ctx.fillStyle = 'rgb(246,250,252)';
    ctx.fillRect(0, 0, s, s);
    ctx.lineCap = 'round';
    for (let i = 0; i < 260; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      // os arranhões puxam para a mesma família de direção, como na pista
      const a = rnd() < 0.6 ? 0.3 + (rnd() - 0.5) * 0.7 : rnd() * Math.PI;
      const comp = 8 + rnd() * 60;
      const claro = rnd() < 0.7;
      ctx.strokeStyle = claro ? `rgba(255,255,255,${0.4 + rnd() * 0.5})` : `rgba(170,200,220,${0.15 + rnd() * 0.15})`;
      ctx.lineWidth = 0.6 + rnd() * 0.9;
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          ctx.beginPath();
          ctx.moveTo(x + dx, y + dy);
          ctx.lineTo(x + dx + Math.cos(a) * comp, y + dy + Math.sin(a) * comp);
          ctx.stroke();
        }
      }
    }
    // a geada: pontinhos de 2 a 3 px (menor que isso o mipmap come)
    for (let i = 0; i < 520; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.5 + rnd() * 0.5})`;
      ctx.beginPath();
      ctx.arc(rnd() * s, rnd() * s, 0.8 + rnd() * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 512);
}

const dados = new Map<string, THREE.CanvasTexture>();

/**
 * O POR DENTRO: a nuvem de gelo mais fundo, mais azul (VERMELHO), as bolhas
 * presas e o brilho da face partida (VERDE), e a linha de sombra das trincas
 * (AZUL) — poucas trincas e uma estrela de batida: gelo de pista é liso, e
 * trinca em toda parte lia como vidro quebrado.
 *
 * É DADO, não cor: o canvas sai sem espaço de cor e o shader lê os canais.
 */
export function geloPorDentro(lado = 3.2): THREE.CanvasTexture {
  const chave = `${lado}`;
  const pronta = dados.get(chave);
  if (pronta) return pronta;
  const s = 512;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const rnd = sorteio(1618);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, s, s);
    ctx.globalCompositeOperation = 'lighter';
    const emVolta = (desenhar: (dx: number, dy: number) => void): void => {
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) desenhar(dx, dy);
    };
    // a nuvem do fundo
    for (let i = 0; i < 9; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.12 + rnd() * 0.2);
      emVolta((dx, dy) => {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        g.addColorStop(0, `rgba(${Math.round(70 + rnd() * 60)},0,0,1)`);
        g.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      });
    }
    ctx.lineCap = 'round';
    /** um trecho de trinca: a sombra (vermelho) e o brilho (verde) colado a ela */
    const trecho = (x0: number, y0: number, x1: number, y1: number, forca: number): void => {
      const nx = -(y1 - y0);
      const ny = x1 - x0;
      const n = Math.hypot(nx, ny) || 1;
      const ox = (nx / n) * 1.6;
      const oy = (ny / n) * 1.6;
      emVolta((dx, dy) => {
        ctx.strokeStyle = `rgba(0,0,${Math.round(220 * forca)},1)`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(x0 + dx, y0 + dy);
        ctx.lineTo(x1 + dx, y1 + dy);
        ctx.stroke();
        ctx.strokeStyle = `rgba(0,${Math.round(200 * forca)},0,1)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x0 + dx + ox, y0 + dy + oy);
        ctx.lineTo(x1 + dx + ox, y1 + dy + oy);
        ctx.stroke();
      });
    };
    /** uma trinca que anda mudando de rumo e solta galhos */
    const trinca = (x: number, y: number, a: number, passos: number, forca: number): void => {
      for (let p = 0; p < passos; p++) {
        const comp = 6 + rnd() * 14;
        const nx = x + Math.cos(a) * comp;
        const ny = y + Math.sin(a) * comp;
        trecho(x, y, nx, ny, forca);
        if (rnd() < 0.3 && forca > 0.35) trinca(nx, ny, a + (rnd() < 0.5 ? -1 : 1) * (0.6 + rnd() * 0.6), 2 + Math.floor(rnd() * 4), forca * 0.6);
        x = nx;
        y = ny;
        a += (rnd() - 0.5) * 0.7;
        forca *= 0.96;
      }
    };
    for (let i = 0; i < 3; i++) trinca(rnd() * s, rnd() * s, rnd() * Math.PI * 2, 6 + Math.floor(rnd() * 7), 0.55 + rnd() * 0.35);
    // as estrelas de batida: raios curtos saindo de um ponto e dois arcos em volta
    for (let i = 0; i < 1; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const raios = 7 + Math.floor(rnd() * 4);
      for (let k = 0; k < raios; k++) {
        const a = (k / raios) * Math.PI * 2 + rnd() * 0.4;
        trinca(x, y, a, 2 + Math.floor(rnd() * 3), 0.85);
      }
      for (const r of [10 + rnd() * 6, 20 + rnd() * 8]) {
        let a = rnd() * Math.PI * 2;
        const fim = a + 1.5 + rnd() * 2;
        while (a < fim) {
          const b = a + 0.35;
          trecho(x + Math.cos(a) * r, y + Math.sin(a) * r, x + Math.cos(b) * r, y + Math.sin(b) * r, 0.55);
          a = b + 0.1;
        }
      }
    }
    // as bolhas presas: em cacho, de tamanhos diferentes (só verde)
    for (let i = 0; i < 14; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const n = 3 + Math.floor(rnd() * 8);
      for (let k = 0; k < n; k++) {
        const bx = x + (rnd() - 0.5) * 22;
        const by = y + (rnd() - 0.5) * 22;
        const r = 0.9 + rnd() * 2.2;
        emVolta((dx, dy) => {
          ctx.fillStyle = `rgba(0,${Math.round(150 + rnd() * 100)},0,1)`;
          ctx.beginPath();
          ctx.arc(bx + dx, by + dy, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  dados.set(chave, tex);
  return tex;
}

/**
 * A NEVE PISADA da beirada do rinque: montinhos macios (sombra azul de um
 * lado, luz do outro), as marcas de bota e o brilho. Quase branco.
 */
export function neveBatida(lado = 2.4): THREE.CanvasTexture {
  return novaTextura(`neve-batida:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(1979);
    ctx.fillStyle = 'rgb(244,248,251)';
    ctx.fillRect(0, 0, s, s);
    const emVolta = (desenhar: (dx: number, dy: number) => void): void => {
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) desenhar(dx, dy);
    };
    // os montinhos: cada um com a sombra embaixo e a luz em cima
    for (let i = 0; i < 40; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.03 + rnd() * 0.07);
      emVolta((dx, dy) => {
        const sombra = ctx.createRadialGradient(x + dx + r * 0.3, y + dy + r * 0.35, 0, x + dx + r * 0.3, y + dy + r * 0.35, r);
        sombra.addColorStop(0, 'rgba(170,198,220,0.35)');
        sombra.addColorStop(1, 'rgba(170,198,220,0)');
        ctx.fillStyle = sombra;
        ctx.fillRect(x + dx - r, y + dy - r, r * 2.6, r * 2.6);
        const luz = ctx.createRadialGradient(x + dx - r * 0.2, y + dy - r * 0.25, 0, x + dx - r * 0.2, y + dy - r * 0.25, r * 0.8);
        luz.addColorStop(0, 'rgba(255,255,255,0.9)');
        luz.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = luz;
        ctx.fillRect(x + dx - r * 1.2, y + dy - r * 1.2, r * 2, r * 2);
      });
    }
    // as marcas de bota, aos pares, em fila
    for (let f = 0; f < 3; f++) {
      let x = rnd() * s;
      let y = rnd() * s;
      const a = rnd() * Math.PI * 2;
      for (let p = 0; p < 7; p++) {
        const lado = p % 2 ? 1 : -1;
        const bx = x + Math.cos(a + Math.PI / 2) * 6 * lado;
        const by = y + Math.sin(a + Math.PI / 2) * 6 * lado;
        emVolta((dx, dy) => {
          ctx.save();
          ctx.translate(bx + dx, by + dy);
          ctx.rotate(a);
          ctx.fillStyle = 'rgba(160,190,214,0.28)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 7, 3.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        x += Math.cos(a) * 16;
        y += Math.sin(a) * 16;
      }
    }
    // o brilho da neve
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.4 + rnd() * 0.3})`;
      ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
    }
  });
}
