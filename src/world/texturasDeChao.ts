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

/**
 * ASFALTO, para as ruas e os caminhos do Villa-Lobos.
 *
 * Asfalto não tem junta nem assentamento: o que o olho lê nele é o AGREGADO —
 * a brita miúda misturada no piche, que pega a luz de um jeito diferente do
 * ligante em volta. Então aqui não existe borda nenhuma; é tudo grão solto, o
 * que também é a defesa contra a emenda do azulejo (mesmo princípio da grama).
 *
 * A base é o cinza da paleta e a textura MULTIPLICA, então quem desenha o grão
 * é o CLARO: cada pedrinha é um pontinho quase branco, e o escuro entra só de
 * leve para a pedra ter sombra e não virar sal derramado.
 *
 * `lado = 5` põe umas 50 px por unidade de mundo, o que faz a brita cair em
 * 1 a 2 px — do tamanho em que ela some quando você anda e aparece quando você
 * para, que é exatamente o que asfalto faz na vida real. Maior que isso ele
 * lê como cascalho solto, e o caminho do parque vira estrada de terra.
 */
export function asfalto(lado = 5): THREE.CanvasTexture {
  return novaTextura(`asfalto:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(9081977);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);

    // manchas largas, em 3×3 cópias para atravessarem a emenda: é o remendo
    // velho, a parte que pegou mais sol, a poça que secou
    for (let i = 0; i < 8; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.12 + rnd() * 0.2);
      const clara = rnd() > 0.45;
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
          g.addColorStop(0, clara ? 'rgba(255,255,255,0.46)' : 'rgba(96,92,88,0.2)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
        }
      }
    }

    // o agregado: cada grão é uma pedrinha clara com uma sombra colada embaixo,
    // e é o par dos dois que dá volume. Só o ponto claro faria neve.
    //
    // O grão nasceu com 0,5 a 1,8 px e SUMIA no jogo: a esta distância de
    // câmera o mipmap come qualquer coisa de um pixel, e sobrava asfalto liso.
    // Com 0,7 a 2,4 ele aguenta um nível de mipmap e continua lendo de longe.
    for (let i = 0; i < 4200; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = 0.7 + rnd() * 1.7;
      ctx.fillStyle = `rgba(80,76,72,${0.06 + rnd() * 0.09})`;
      ctx.beginPath();
      ctx.arc(x + r * 0.5, y + r * 0.6, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.45})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/**
 * ASSOALHO DE MADEIRA, para o salão do Mania de Churrasco.
 *
 * Piso de tábua é uma coisa só: JUNTA. A tábua em si é quase lisa, e o que o
 * olho lê são as linhas escuras entre elas e as emendas de topo, que num
 * assoalho de verdade NUNCA caem alinhadas — cada fiada começa num ponto
 * diferente. Sem esse desencontro sai um papel quadriculado.
 *
 * O veio é o segundo detalhe: dois ou três riscos claros por tábua, no
 * comprimento. É pouca coisa, e é o que separa madeira de plástico marrom.
 */
export function assoalhoDeMadeira(lado = 2.4, tabuas = 8): THREE.CanvasTexture {
  return novaTextura(`assoalho:${lado}:${tabuas}`, lado, (ctx, s) => {
    const rnd = sorteio(19870704);
    const passo = s / tabuas;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);

    for (let i = 0; i < tabuas; i++) {
      const y = i * passo;
      // cada tábua com o seu tom, entre 0,9 e 1,0 de luz
      const luz = 0.9 + rnd() * 0.1;
      const v = Math.round(255 * luz);
      ctx.fillStyle = `rgb(${v},${v - 4},${v - 10})`;
      ctx.fillRect(0, y, s, passo);

      // o veio: riscos claros no comprimento
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = `rgba(255,255,255,${0.35 + rnd() * 0.3})`;
        ctx.lineWidth = 0.8 + rnd() * 0.7;
        ctx.beginPath();
        const yy = y + passo * (0.2 + k * 0.28) + rnd() * 2;
        ctx.moveTo(0, yy);
        ctx.bezierCurveTo(s * 0.3, yy + (rnd() - 0.5) * 2.5, s * 0.7, yy + (rnd() - 0.5) * 2.5, s, yy);
        ctx.stroke();
      }

      // a junta entre esta tábua e a de baixo
      ctx.fillStyle = 'rgba(120,92,62,0.3)';
      ctx.fillRect(0, y + passo - 1.4, s, 1.4);

      // as emendas de topo, desencontradas fiada a fiada
      const quantas = 2 + Math.floor(rnd() * 2);
      for (let e = 0; e < quantas; e++) {
        const x = ((e + rnd()) / quantas) * s;
        ctx.fillStyle = 'rgba(120,92,62,0.34)';
        ctx.fillRect(x, y + 1, 1.6, passo - 2.4);
      }
    }
  });
}

/**
 * CALÇADA DE PEDRINHA, para o Villa-Lobos.
 *
 * Ela existe para NÃO ser o piso do clube. Os dois são chão claro de área
 * pública, e se usassem a mesma textura os dois cenários iam parecer o mesmo
 * lugar — o que separa um do outro é a ESCALA da unidade: no clube são poucas
 * placas grandes de borda de piscina, aqui são muitas pedrinhas miúdas, como
 * calçada de praça.
 *
 * A pedra é assentada em FIADAS DESENCONTRADAS (cada linha ímpar anda meia
 * pedra), que é como se assenta de verdade e é o que quebra a leitura de grade.
 * Cada pedra ganha um tom próprio e uma sobrinha na quina de baixo — sem esse
 * degrau de luz elas viram quadradinhos chapados e o olho lê xadrez.
 *
 * A PEDRA É MAIOR QUE A DE VERDADE. Comecei com 18 cm, que é a medida real da
 * pedra portuguesa, e na tela ela virou chiado cinza: a esta distância de
 * câmera não dá para distinguir uma pedra da outra. Com 40 cm o assentamento
 * aparece, que é o que importa aqui — o jogo é estilizado, e ler ganha de medir.
 */
export function calcadaDePedrinha(lado = 2.4, porLinha = 6): THREE.CanvasTexture {
  return novaTextura(`pedrinha:${lado}:${porLinha}`, lado, (ctx, s) => {
    const rnd = sorteio(31415926);
    const passo = s / porLinha;
    const folga = passo * 0.13;

    // a argamassa entre as pedras
    ctx.fillStyle = 'rgba(196,190,178,1)';
    ctx.fillRect(0, 0, s, s);

    for (let linha = 0; linha < porLinha; linha++) {
      // as fiadas ímpares andam meia pedra — e a pedra que sai por um lado
      // entra pelo outro, senão a emenda do azulejo aparece
      const desvio = (linha % 2) * passo * 0.5;
      for (let col = -1; col <= porLinha; col++) {
        const x = col * passo + desvio;
        const y = linha * passo;
        // cada pedra com o seu tom, entre 0,88 e 1,0 de luz
        const luz = 0.88 + rnd() * 0.12;
        const v = Math.round(255 * luz);
        ctx.fillStyle = `rgb(${v},${v - 3},${v - 8})`;
        ctx.beginPath();
        ctx.roundRect(x + folga, y + folga, passo - folga * 2, passo - folga * 2, passo * 0.16);
        ctx.fill();
        // a sombrinha na quina de baixo, que dá o degrau de assentamento
        ctx.fillStyle = 'rgba(150,144,132,0.22)';
        ctx.fillRect(x + folga, y + passo - folga * 2.4, passo - folga * 2, folga * 1.2);
      }
    }

    // manchas largas por cima de tudo: calçada de praça não tem tom uniforme,
    // e são elas que impedem o campo de pedrinha de virar ruído parelho
    for (let i = 0; i < 6; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.16 + rnd() * 0.2);
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
          g.addColorStop(0, rnd() > 0.5 ? 'rgba(255,255,255,0.32)' : 'rgba(148,142,128,0.14)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
        }
      }
    }
  });
}
