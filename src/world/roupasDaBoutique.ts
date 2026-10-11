import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { novaTextura, sorteio } from './texturasDeChao';
import { fundir } from './fundir';
import { raioDoTronco } from './uniformeDosGatitos';
import { camadaDeSola, formaDaSola, pe } from './roupasDePiscina';
import { tiara } from './roupas';
import { matelasse } from './texturasDeCasa';

/**
 * ======================================== A COLEÇÃO NOVA DA ESTELLA
 *
 * Pedido do Renan: mais roupa para comprar na boutique — "vestidos
 * detalhados, vestido mais simples porém bem feitos, diversos acessórios",
 * de todo tipo de peça, feitos com as técnicas das skills `threejs-*`.
 *
 * As vinte peças da primeira coleção eram cor em cima de geometria pronta. As
 * desta são MODELO NOVO, e o kit delas está aqui em cima:
 *
 * - `corpete`: a casca justa do tronco, uma `BufferGeometry` própria que
 *   segue a cápsula do rig e cujo topo É O DECOTE — coração, ombro a ombro,
 *   gola redonda, V de transpasse. A peça leva `peitoNu` e a cápsula vira
 *   pele: o colo que aparece acima do decote é pele de verdade, e não pano
 *   pintado;
 * - `saiaViva`: a saia que ACOMPANHA AS PERNAS. Ela lê os pivôs das pernas a
 *   cada quadro (`MedidasCorpo.pernas`) e abre o pano por cima delas: na
 *   passada a barra levanta na frente da perna que avança, e sentado o pano
 *   cai do colo como cortina. É o que deixa existir vestido LONGO — o curto
 *   da primeira coleção só cabia porque a perna não alcança uma barra a 13 cm
 *   do quadril;
 * - `noTronco`: dobra uma forma plana (gola, lapela, peitilho, bolso, a renda
 *   vazada) por cima do corpo, como decalque com espessura;
 * - `torneada`: o torno com franzido (o tecido que junta numa costura) e UV em
 *   metros — manga bufante, punho, copa de chapéu;
 * - as estampas, pintadas em canvas uma vez por combinação de cores: flores,
 *   listras, poá, linho, cetim, veludo, palha trançada, os brilhinhos.
 *
 * O referencial de cada vaga é o de sempre (skill `aristory-roupa`): tronco
 * e `extraQuadril` com y = 0 no CHÃO; pernas e pés no pivô de cada perna;
 * mãos e `extraBraco` no pivô de cada braço; cabeça no centro do crânio.
 *
 * E LEVE: cada peça termina em `fundir()` — os pedaços do mesmo material
 * viram uma malha só, sem mudar a imagem. A saia viva fica de fora sozinha
 * (ela marca `userData.viva`): a geometria dela muda a cada quadro.
 */

// =================================================================== o corpo

/** a cápsula do tronco do rig é achatada assim no z (`torso.scale.z`) */
const ACHATA = 0.82;

/** as alturas do corpo (y = 0 no chão), todas do rig — ver `CharacterRig` */
function alturas(m: MedidasCorpo) {
  const { h, w } = m;
  const quadril = m.legH;
  const r = h * 0.105 * w;
  return {
    r,
    quadril,
    /** onde o cilindro da cápsula começa e acaba (entre eles o raio é `r`) */
    cilindroBaixo: quadril + m.torsoH * 0.27,
    cilindroAlto: quadril + m.torsoH * 0.77,
    /** o fundo da cápsula, e o alto dela (que encosta no queixo) */
    fundo: quadril + m.torsoH * 0.27 - r,
    /** a cintura de vestido deste corpo de cabeção: baixa, logo acima do quadril */
    cintura: quadril + m.torsoH * 0.2,
    /** o pivô do ombro */
    ombro: quadril + m.torsoH * 0.86,
    /** o raio do calção do rig, que toda cintura de saia tem que cobrir */
    raioDoCalcao: h * 0.118 * w,
  };
}

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** um ponto na pele do tronco (com folga), no ângulo `a` (0 = frente) e altura `y` */
function naPele(m: MedidasCorpo, a: number, y: number, folga = 1.03): THREE.Vector3 {
  const R = Math.max(raioDoTronco(m, y), m.h * 0.012) * folga;
  return new THREE.Vector3(Math.sin(a) * R, y, Math.cos(a) * R * ACHATA);
}

/** a normal de fora do tronco no ângulo `a` (a elipse achatada, no plano) */
function normalDaPele(a: number): THREE.Vector3 {
  return new THREE.Vector3(Math.sin(a) * ACHATA, 0, Math.cos(a)).normalize();
}

/** prega um objeto (que olha para +Z) na pele do tronco */
function naPeleOlhando(obj: THREE.Object3D, m: MedidasCorpo, a: number, y: number, folga = 1.03): THREE.Object3D {
  const p = naPele(m, a, y, folga);
  const n = normalDaPele(a);
  obj.position.copy(p);
  obj.lookAt(p.x + n.x, p.y + n.y, p.z + n.z);
  return obj;
}

// =============================================================== as estampas

/**
 * AS ESTAMPAS: desenhadas UMA vez por combinação de cores (a chave leva as
 * cores) e reaproveitadas por toda peça que as pede. O UV das peças daqui é
 * em METROS (arco em volta do corpo × altura), então `lado` é o tamanho do
 * azulejo no pano: a flor tem o mesmo tamanho na saia e no corpete.
 *
 * Duas famílias:
 * - as COLORIDAS (flores, listras, poá, lenço, mostrador) já pintam a cor da
 *   peça: o material é branco e a textura manda;
 * - as de TRAMA (linho, cetim, veludo, palha, malha, brilhinhos) são quase
 *   brancas e MULTIPLICAM a cor da ficha — a mesma regra das texturas de
 *   móvel: escuro aqui é uma segunda demão de tinta.
 */
function estampaFloral(fundo: number, flor: number, florClara: number, folha: number, lado = 0.16): THREE.CanvasTexture {
  return novaTextura(`roupa-floral:${fundo}:${flor}:${florClara}:${folha}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(4471);
    /** desenha em volta das bordas também, para o azulejo emendar sem costura */
    const emVolta = (x: number, y: number, pintar: (x: number, y: number) => void): void => {
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) pintar(x + dx, y + dy);
    };
    // as folhinhas primeiro, por baixo das flores
    for (let i = 0; i < 16; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const ang = rnd() * Math.PI * 2;
      emVolta(x, y, (px, py) => {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(ang);
        ctx.fillStyle = css(folha);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.034, s * 0.012, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
    // as flores: cinco pétalas redondas e o miolo; duas cores, tamanhos variados
    for (let i = 0; i < 11; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const R = s * (0.026 + rnd() * 0.02);
      const cor = i % 3 === 0 ? florClara : flor;
      const giro = rnd() * Math.PI;
      emVolta(x, y, (px, py) => {
        ctx.fillStyle = css(cor);
        for (let k = 0; k < 5; k++) {
          const a = giro + (k / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(px + Math.cos(a) * R * 0.62, py + Math.sin(a) * R * 0.62, R * 0.52, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = css(cor === flor ? florClara : P.flowerYellow);
        ctx.beginPath();
        ctx.arc(px, py, R * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // os pontinhos soltos, que enchem o fundo sem pesar
    ctx.fillStyle = css(florClara);
    for (let i = 0; i < 40; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      ctx.beginPath();
      ctx.arc(x, y, s * 0.0045, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 512);
}

/** listras em pé: a larga da cor, o fundo, e um fiozinho no meio do fundo */
function listras(fundo: number, listra: number, lado = 0.05): THREE.CanvasTexture {
  return novaTextura(`roupa-listras:${fundo}:${listra}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(listra);
    ctx.fillRect(0, 0, s * 0.36, s);
    ctx.fillRect(s * 0.66, 0, s * 0.04, s);
  });
}

/** poá: bolinhas em quincôncio (a fileira de baixo meio passo deslocada) */
function poa(fundo: number, bola: number, lado = 0.055): THREE.CanvasTexture {
  return novaTextura(`roupa-poa:${fundo}:${bola}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(bola);
    for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s], [s / 2, s / 2]] as const) {
      ctx.beginPath();
      ctx.arc(x, y, s * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** linho: fio grosso irregular nas duas direções, quase branco (multiplica) */
function linho(lado = 0.08): THREE.CanvasTexture {
  return novaTextura('roupa-linho', lado, (ctx, s) => {
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(91);
    for (let i = 0; i < 140; i++) {
      const horizontal = i % 2 === 0;
      const p = rnd() * s;
      const c = rnd() * s;
      const comp = s * (0.08 + rnd() * 0.3);
      const tom = 222 + Math.floor(rnd() * 26);
      ctx.strokeStyle = `rgb(${tom},${tom},${tom})`;
      ctx.lineWidth = 1 + rnd() * 1.6;
      ctx.beginPath();
      if (horizontal) {
        ctx.moveTo(c, p);
        ctx.lineTo(c + comp, p);
      } else {
        ctx.moveTo(p, c);
        ctx.lineTo(p, c + comp);
      }
      ctx.stroke();
    }
  });
}

/**
 * Cetim: o brilho do pano é LUZ PINTADA. Faixas em pé, claras e escuras, com
 * a borda macia — os vincos onde a luz escorre. O toon não tem reflexo; é a
 * faixa clara que diz "cetim" de longe.
 */
function cetim(lado = 0.22): THREE.CanvasTexture {
  return novaTextura('roupa-cetim', lado, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, 0);
    const paradas: Array<[number, number]> = [
      [0, 205], [0.12, 238], [0.18, 255], [0.26, 226], [0.42, 200],
      [0.55, 232], [0.6, 250], [0.68, 220], [0.85, 198], [1, 205],
    ];
    for (const [t, v] of paradas) g.addColorStop(t, `rgb(${v},${v},${v})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/** veludo amassado: manchas macias claras e escuras, sem direção */
function veludo(lado = 0.14): THREE.CanvasTexture {
  return novaTextura('roupa-veludo', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(222,222,222)';
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(7);
    for (let i = 0; i < 36; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const R = s * (0.06 + rnd() * 0.12);
      const claro = rnd() < 0.5;
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, R);
        g.addColorStop(0, claro ? 'rgba(255,255,255,0.55)' : 'rgba(170,170,170,0.45)');
        g.addColorStop(1, 'rgba(222,222,222,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - R, y + dy - R, R * 2, R * 2);
      }
    }
  });
}

/** os brilhinhos do vestido de baile: o pano um tico abaixo do branco e as estrelinhas no branco */
function brilhinhos(lado = 0.12): THREE.CanvasTexture {
  return novaTextura('roupa-brilhinhos', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(232,232,232)';
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(3);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    for (let i = 0; i < 26; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const R = s * (0.008 + rnd() * 0.012);
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
      if (i % 3 === 0) {
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - R * 3, y);
        ctx.lineTo(x + R * 3, y);
        ctx.moveTo(x, y - R * 3);
        ctx.lineTo(x, y + R * 3);
        ctx.stroke();
      }
    }
  });
}

/** malha de tricô: as colunas de ponto (o "V" empilhado), quase branca */
function malha(lado = 0.03): THREE.CanvasTexture {
  return novaTextura('roupa-malha', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(240,240,240)';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgb(205,205,205)';
    ctx.lineWidth = s * 0.05;
    for (const x0 of [0, s / 2]) {
      for (let y = -s / 4; y < s * 1.25; y += s / 2) {
        ctx.beginPath();
        ctx.moveTo(x0 + s * 0.02, y);
        ctx.lineTo(x0 + s * 0.25, y + s * 0.22);
        ctx.lineTo(x0 + s * 0.48, y);
        ctx.stroke();
      }
    }
  });
}

/** palha trançada: fileiras de trancinha em V (o chapéu gira, então ela corre em volta) */
function palha(lado = 0.05): THREE.CanvasTexture {
  return novaTextura('roupa-palha', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(246,246,246)';
    ctx.fillRect(0, 0, s, s);
    const linhas = 4;
    const alto = s / linhas;
    for (let i = 0; i < linhas; i++) {
      const y = i * alto;
      for (let k = 0; k < 8; k++) {
        const x = (k / 8) * s;
        ctx.fillStyle = k % 2 ? 'rgb(214,214,214)' : 'rgb(236,236,236)';
        ctx.beginPath();
        ctx.moveTo(x, y + alto * 0.1);
        ctx.lineTo(x + s / 16, y + alto * 0.5);
        ctx.lineTo(x + s / 8, y + alto * 0.1);
        ctx.lineTo(x + s / 8, y + alto * 0.5);
        ctx.lineTo(x + s / 16, y + alto * 0.9);
        ctx.lineTo(x, y + alto * 0.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = 'rgb(196,196,196)';
      ctx.fillRect(0, y, s, alto * 0.06);
    }
  });
}

// ========================================================= o corpete justo

interface OpcoesDeCorpete {
  /** a altura do decote (y, no chão) em cada ângulo `a` (0 = frente, ±π = costas) */
  decote: (a: number) => number;
  /** onde a peça acaba embaixo; sem isto, ela fecha no fundo da cápsula */
  baixo?: number;
  /** o raio do tronco vezes isto (a casca não pode encostar na pele) */
  folga?: number;
  /** pano a mais, em metros, num ângulo e altura (a blusa solta, o peplum) */
  solto?: (a: number, y: number) => number;
  colunas?: number;
  linhas?: number;
}

/**
 * O CORPETE: uma casca que segue a cápsula do tronco e cujo topo é o DECOTE.
 *
 * É uma grade própria (`BufferGeometry`): cada coluna é um ângulo em volta do
 * corpo e sobe do fundo até `decote(a)`, então o recorte sai na própria
 * malha, sem furo nem máscara — coração, ombro a ombro, V, gola alta. A
 * costura fica nas COSTAS (`a = ±π`), onde ela some atrás do cabelo.
 *
 * O fundo fecha numa tigela no fundo da cápsula (o rig não tem quadril de
 * verdade: o tronco desce até entre as pernas). O UV é em metros.
 */
function corpete(m: MedidasCorpo, o: OpcoesDeCorpete): THREE.BufferGeometry {
  const c = alturas(m);
  const NC = o.colunas ?? 64;
  const NL = o.linhas ?? 16;
  const folga = o.folga ?? 1.03;
  const fecha = o.baixo === undefined;
  const yBaixo = o.baixo ?? c.cilindroBaixo;
  // na tigela, as linhas seguem o ÂNGULO (o polo é redondo); no resto, a altura
  const TIGELA = fecha ? 5 : 0;
  const pos: number[] = [];
  const uv: number[] = [];
  const circ = 2 * Math.PI * c.r * 0.91;
  for (let i = 0; i <= NC; i++) {
    const a = -Math.PI + (i / NC) * Math.PI * 2;
    const topo = o.decote(a);
    for (let j = 0; j <= TIGELA + NL; j++) {
      let y: number;
      if (j < TIGELA) {
        const fi = ((j + 0.02) / TIGELA) * (Math.PI / 2);
        y = c.cilindroBaixo - c.r * Math.cos(fi);
      } else {
        y = THREE.MathUtils.lerp(yBaixo, topo, (j - TIGELA) / NL);
      }
      // a folga do `solto` some no polo da tigela (senão o fundo abria um furo)
      const raio = raioDoTronco(m, y);
      const R = raio * folga + (o.solto?.(a, y) ?? 0) * Math.min(1, raio / c.r);
      pos.push(Math.sin(a) * R, y, Math.cos(a) * R * ACHATA);
      uv.push(((a + Math.PI) / (Math.PI * 2)) * circ, y);
    }
  }
  const linhas = TIGELA + NL + 1;
  const idx: number[] = [];
  for (let i = 0; i < NC; i++) {
    for (let j = 0; j < linhas - 1; j++) {
      const a = i * linhas + j;
      const b = (i + 1) * linhas + j;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** um vivo (cordão de acabamento) que corre pela pele em pontos [ângulo, altura] */
function vivoNaPele(m: MedidasCorpo, pontos: Array<[number, number]>, grossura: number, folga = 1.045, fechado = false): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos.map(([a, y]) => naPele(m, a, y, folga)), fechado);
  return new THREE.TubeGeometry(curva, Math.max(16, pontos.length * 6), grossura, 6, fechado);
}

/** o vivo que acompanha um decote inteiro (ou um trecho dele, de `a0` a `a1`) */
function vivoNoDecote(m: MedidasCorpo, decote: (a: number) => number, grossura: number, folga = 1.045, a0 = -Math.PI, a1 = Math.PI): THREE.BufferGeometry {
  const volta = a0 === -Math.PI && a1 === Math.PI;
  const pontos: Array<[number, number]> = [];
  const N = 48;
  // na volta inteira o último ponto seria o primeiro de novo, e a curva fechada dava um nó ali
  for (let i = 0; i < (volta ? N : N + 1); i++) {
    const a = a0 + ((a1 - a0) * i) / N;
    pontos.push([a, decote(a) - grossura * 0.4]);
  }
  return vivoNaPele(m, pontos, grossura, folga, volta);
}

/** um vivo que dá a volta inteira no corpo, numa altura só (a fita da cintura) */
function cintaNaPele(m: MedidasCorpo, y: number, grossura: number, folga = 1.06): THREE.BufferGeometry {
  return vivoNaPele(m, Array.from({ length: 32 }, (_, i) => [-Math.PI + (i / 32) * Math.PI * 2, y] as [number, number]), grossura, folga, true);
}

/**
 * DOBRA UMA PEÇA PLANA POR CIMA DO TRONCO — a gola, a lapela, o peitilho, o
 * bolso, a renda vazada. A peça nasce no plano: `x` é o ARCO em volta do
 * corpo a partir da frente (em metros), `y` é a altura (no chão) e `z` é o
 * quanto ela sai da pele. Aqui cada vértice vira ângulo e raio, e a forma
 * abraça o corpo como um decalque com espessura.
 */
function noTronco(geo: THREE.BufferGeometry, m: MedidasCorpo, folga = 1.04): THREE.BufferGeometry {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const R = Math.max(raioDoTronco(m, y), m.h * 0.02) * folga;
    const a = x / R;
    const raio = R + z;
    pos.setXYZ(i, Math.sin(a) * raio, y, Math.cos(a) * raio * ACHATA);
  }
  geo.deleteAttribute('normal');
  geo.computeVertexNormals();
  return geo;
}

/** uma forma plana com espessura e quina macia (para ir ao `noTronco`) */
function chapa(forma: THREE.Shape | THREE.Shape[], esp: number, bisel = esp * 0.45, curvas = 10, segBisel = 2): THREE.BufferGeometry {
  return new THREE.ExtrudeGeometry(forma, {
    depth: esp, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel * 0.8, bevelSegments: segBisel, curveSegments: curvas,
  });
}

// ===================================================== o torno com franzido

/**
 * O TORNO DE PANO: um `LatheGeometry` com o raio ondulando em `gomos` em volta
 * (o franzido de quando o tecido junta numa costura), mais fundo onde `fundo`
 * manda — a manga bufante franze no ombro e no punho e estufa no meio. O UV
 * sai em metros (arco × altura), para a estampa da manga ser a do vestido.
 */
function torneada(perfil: Array<[number, number]>, gomos = 0, fundo: (t: number) => number = () => 0, segmentos = 28): THREE.BufferGeometry {
  // o torno do three vira a face para FORA quando o perfil SOBE; quem escreve
  // de cima para baixo (a manga, do ombro ao punho) é desvirado aqui
  const desce = perfil[0][1] > perfil[perfil.length - 1][1];
  const pontos = desce ? [...perfil].reverse() : perfil;
  const geo = new THREE.LatheGeometry(pontos.map(([r, y]) => new THREE.Vector2(r, y)), segmentos);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const n = pontos.length;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, z);
    // o ângulo sai da COLUNA, e não do atan2: no atan2 a volta salta de π para
    // −π nas costas, e a estampa espremia numa faixa ali
    const fi = (Math.floor(i / n) / segmentos) * Math.PI * 2;
    const j = i % n;
    const t = (desce ? n - 1 - j : j) / (n - 1);
    let k = 1;
    if (gomos && r > 1e-5) k = (r - fundo(t) * (0.5 - 0.5 * Math.cos(fi * gomos))) / r;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
    uv.setXY(i, fi * Math.max(r, 0.02), y);
  }
  geo.computeVertexNormals();
  return geo;
}

// ======================================================== a saia que anda

interface OpcoesDeSaia {
  /** a cintura e a barra (y, no chão) */
  yTopo: number;
  yBarra: number;
  /** o raio do pano no ângulo `a` (0 = frente) e em `t` (0 = cintura, 1 = barra) */
  raio: (a: number, t: number) => number;
  /** o achatado em z (a saia redonda num corpo achatado parece inflada de perfil) */
  achata?: number;
  colunas?: number;
  linhas?: number;
  /**
   * as faixas de material: cada corte é o `t` em que o próximo material da
   * lista começa (a barra de renda, o cós). `[0.94]` com dois materiais = a
   * barra nos últimos 6% do comprimento
   */
  cortes?: number[];
  /** camada de fora: folga a mais contra a perna, para não encostar na de dentro */
  camada?: number;
  /**
   * um PAINEL e não a volta inteira: o pano vai do ângulo `arco[0]` ao
   * `arco[1]` (0 = frente). É o transpasse — o casaco trench e o vestido
   * envelope são dois painéis que se sobrepõem na frente
   */
  arco?: [number, number];
}

/**
 * ==================================== A SAIA VIVA — a que acompanha a perna
 *
 * Saia comprida em boneco que anda é a peça mais difícil do guarda-roupa: a
 * coxa gira até 0,62 rad na passada e 90° sentada, e uma saia rígida ou é
 * larga demais (um sino parado) ou a perna fura o pano. Por isso esta saia é
 * uma grade própria que se ACOMODA a cada quadro:
 *
 * 1. a cada quadro ela lê os dois pivôs das pernas (`MedidasCorpo.pernas`) e
 *    marca pontos ao longo de cada perna (coxa, canela, calcanhar e bico do
 *    pé), cada um com um raio;
 * 2. o pano CAI COMO CORTINA: numa altura qualquer da saia, o pano precisa
 *    cercar tudo o que está ACIMA dela — a perna que avança empurra a barra
 *    para a frente, e sentado, com a perna esticada no colo, o pano cai da
 *    ponta do pé até a barra, como num vestido de verdade;
 * 3. cada vértice só sai para fora no seu próprio raio (a "função de apoio"
 *    de um disco numa direção é `c·u + ρ`, uma conta de produto escalar), com
 *    um máximo suave contra o raio de descanso — o pano estufa sem quina;
 * 4. e ele ANDA NO TEMPO como pano: abre na hora (a perna nunca atravessa) e
 *    volta devagar, num amortecimento exponencial — a barra assenta depois
 *    que o passo acaba.
 *
 * Um a dois mil vértices e duas pernas: umas dezenas de milhares de contas por
 * quadro, e nenhuma quando a perna está parada e o pano já assentou.
 */
function saiaViva(m: MedidasCorpo, o: OpcoesDeSaia, materiais: THREE.Material | THREE.Material[]): THREE.Mesh {
  const { h, w } = m;
  const NC = o.colunas ?? 72;
  const ach = o.achata ?? 0.86;
  const cortes = o.cortes ?? [];
  // as linhas: uniformes, e os cortes de material entram como linha própria
  const base = o.linhas ?? 14;
  const ts = new Set<number>();
  for (let j = 0; j <= base; j++) ts.add(+(j / base).toFixed(5));
  for (const c of cortes) ts.add(+c.toFixed(5));
  const linhasT = [...ts].sort((x, y) => x - y);
  const NL = linhasT.length;
  const [a0, a1] = o.arco ?? [-Math.PI, Math.PI];
  const angulo = (i: number): number => a0 + ((a1 - a0) * i) / NC;

  const n = (NC + 1) * NL;
  const pos = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  const ux = new Float32Array(n);
  const uz = new Float32Array(n);
  const repouso = new Float32Array(n);
  const atual = new Float32Array(n);
  const ys = new Float32Array(NL);
  let maiorRaio = 0;
  for (let j = 0; j < NL; j++) ys[j] = THREE.MathUtils.lerp(o.yTopo, o.yBarra, linhasT[j]);
  for (let i = 0; i <= NC; i++) {
    const a = angulo(i);
    for (let j = 0; j < NL; j++) {
      const k = i * NL + j;
      const R = o.raio(a, linhasT[j]);
      const x = Math.sin(a) * R;
      const z = Math.cos(a) * R * ach;
      const t = Math.hypot(x, z);
      ux[k] = x / t;
      uz[k] = z / t;
      repouso[k] = t;
      atual[k] = t;
      maiorRaio = Math.max(maiorRaio, R);
      pos[k * 3] = x;
      pos[k * 3 + 1] = ys[j];
      pos[k * 3 + 2] = z;
      // o UV em metros: o arco (no raio da cintura, para a estampa não esticar
      // de lado) e o comprimento do pano
      uv[k * 2] = ((a + Math.PI) / (Math.PI * 2)) * 2 * Math.PI * o.raio(a, 0) * 1.4;
      uv[k * 2 + 1] = -Math.hypot(ys[j] - o.yTopo, (R - o.raio(a, 0)) * 0.6);
    }
  }
  const geo = new THREE.BufferGeometry();
  const atributo = new THREE.BufferAttribute(pos, 3);
  atributo.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', atributo);
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  // os triângulos, separados por faixa de material
  const idx: number[] = [];
  const faixaDe = (t: number): number => cortes.filter((c) => t >= c - 1e-6).length;
  let inicio = 0;
  let faixa = 0;
  const grupos: Array<[number, number, number]> = [];
  for (let j = 0; j < NL - 1; j++) {
    const f = faixaDe(linhasT[j]);
    if (f !== faixa) {
      grupos.push([inicio, idx.length - inicio, faixa]);
      inicio = idx.length;
      faixa = f;
    }
    for (let i = 0; i < NC; i++) {
      const a = i * NL + j;
      const b = (i + 1) * NL + j;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  grupos.push([inicio, idx.length - inicio, faixa]);
  geo.setIndex(idx);
  if (Array.isArray(materiais)) for (const [s, c, mi] of grupos) geo.addGroup(s, c, mi);
  geo.computeVertexNormals();
  // a esfera que cerca a saia em QUALQUER pose: senão ela some na beira da tela
  geo.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(0, (o.yTopo + o.yBarra) / 2, 0),
    maiorRaio + m.legH + Math.abs(o.yTopo - o.yBarra) / 2,
  );

  const saia = new THREE.Mesh(geo, materiais);
  // fora da `fundir()`: esta malha muda a cada quadro
  saia.userData.viva = true;
  const pernas = m.pernas;
  if (!pernas) return saia;

  // ------------------------------------------------- os pontos de cada perna
  const camada = o.camada ?? 0;
  const rPerna = h * 0.042 * w * 1.18 + h * 0.006 + camada;
  const rPe = h * 0.03 + camada;
  /** [x, y, z, raio] no pivô da perna; os de índice 0..3 formam a perna, 4 e 5 o pé */
  const amostras: Array<[number, number, number, number]> = [
    [0, -h * 0.02, 0, rPerna],
    [0, -h * 0.09, 0, rPerna],
    [0, -h * 0.16, 0, rPerna],
    [0, -h * 0.225, 0, rPerna],
    [0, -h * 0.255, -h * 0.022, rPe],
    [0, -h * 0.252, h * 0.064, rPe],
  ];
  const trechos: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5]];
  const NA = amostras.length;
  const px = new Float32Array(NA * 2);
  const py = new Float32Array(NA * 2);
  const pz = new Float32Array(NA * 2);
  const pr = new Float32Array(NA * 2);
  const v = new THREE.Vector3();
  const ultimaPose = new Float32Array(8);
  let ultimoRender: unknown = null;
  let ultimoQuadro = -1;
  let ultimaVez = 0;
  let assentando = false;
  // discos ativos de uma linha (no máximo 2 × (6 pontos + 5 trechos))
  const dx = new Float32Array(32);
  const dz = new Float32Array(32);
  const dr = new Float32Array(32);

  const acomodar = (dt: number): void => {
    // os pontos de cada perna, no referencial do corpo (o mesmo da saia)
    for (let l = 0; l < 2; l++) {
      const pivo = pernas[l];
      for (let s = 0; s < NA; s++) {
        const [x, y, z, r] = amostras[s];
        v.set(x, y, z).applyQuaternion(pivo.quaternion).add(pivo.position);
        const k = l * NA + s;
        px[k] = v.x;
        py[k] = v.y;
        pz[k] = v.z;
        pr[k] = r;
      }
    }
    const solta = 1 - Math.exp(-dt * 7);
    let mexeu = false;
    for (let j = 1; j < NL; j++) {
      const y = ys[j];
      // os discos que esta altura do pano precisa cercar: tudo da perna ACIMA dela
      let nd = 0;
      for (let l = 0; l < 2; l++) {
        const b = l * NA;
        // SENTADO o pé fica na altura do colo, de bico para cima: a cortina não
        // o cobre (ela cairia do bico do sapato e enterraria o pé no pano) —
        // ela cai do tornozelo, e o sapato sai pela frente da saia
        const pePraCima = py[b + 4] > pernas[l].position.y - h * 0.12;
        const nAmostras = pePraCima ? 4 : NA;
        for (let s = 0; s < nAmostras; s++) {
          // a amostra vale até o ALTO da bola (o centro mais o raio): sentado, a
          // coxa deitada passa pela altura do pano com a metade de cima, e
          // contando só o centro a metade de cima furava o colo
          if (py[b + s] + pr[b + s] >= y) {
            dx[nd] = px[b + s];
            dz[nd] = pz[b + s];
            dr[nd] = pr[b + s];
            nd++;
          }
        }
        for (const [s0, s1] of trechos) {
          if (s1 >= nAmostras) continue;
          const ya = py[b + s0];
          const yb = py[b + s1];
          if ((ya - y) * (yb - y) < 0) {
            const f = (y - ya) / (yb - ya);
            dx[nd] = px[b + s0] + (px[b + s1] - px[b + s0]) * f;
            dz[nd] = pz[b + s0] + (pz[b + s1] - pz[b + s0]) * f;
            dr[nd] = pr[b + s0] + (pr[b + s1] - pr[b + s0]) * f;
            nd++;
          }
        }
      }
      for (let i = 0; i <= NC; i++) {
        const k = i * NL + j;
        const tb = repouso[k];
        let alvo = tb;
        if (nd) {
          let req = 0;
          for (let d = 0; d < nd; d++) {
            const apoio = dx[d] * ux[k] + dz[d] * uz[k] + dr[d];
            if (apoio > req) req = apoio;
          }
          // máximo suave: o pano estufa redondo em volta da perna, sem quina
          const dif = tb - req;
          const suave = h * 0.012;
          alvo = (tb + req + Math.sqrt(dif * dif + suave * suave)) / 2;
          if (alvo - tb < 1e-4) alvo = tb;
        }
        const antes = atual[k];
        const novo = alvo > antes ? alvo : antes + (alvo - antes) * solta;
        if (Math.abs(novo - antes) > 1e-5) {
          mexeu = true;
          atual[k] = novo;
          pos[k * 3] = ux[k] * novo;
          pos[k * 3 + 2] = uz[k] * novo;
        }
      }
    }
    if (mexeu) {
      atributo.needsUpdate = true;
      geo.computeVertexNormals();
    }
    assentando = mexeu;
  };

  saia.onBeforeRender = (renderer) => {
    // multimaterial chama isto uma vez por faixa; um cálculo por quadro basta
    const quadro = renderer.info.render.frame;
    if (renderer === ultimoRender && quadro === ultimoQuadro) return;
    ultimoRender = renderer;
    ultimoQuadro = quadro;
    const agora = performance.now();
    const dt = Math.min(0.1, (agora - ultimaVez) / 1000);
    ultimaVez = agora;
    // a pose mudou? (rotação das duas pernas); parada e assentada, nada a fazer
    let mudou = false;
    for (let l = 0; l < 2; l++) {
      const q = pernas[l].quaternion;
      const vals = [q.x, q.y, q.z, q.w];
      for (let c = 0; c < 4; c++) {
        if (Math.abs(ultimaPose[l * 4 + c] - vals[c]) > 1e-5) {
          mudou = true;
          ultimaPose[l * 4 + c] = vals[c];
        }
      }
    }
    if (mudou || assentando) acomodar(dt);
  };
  // o primeiro quadro já sai acomodado (o boneco do painel nasce sentado às vezes)
  acomodar(1);
  return saia;
}

/** o raio de uma saia evasê com franzido: `r0` na cintura, `r1` na barra, `gomos` dobras */
function evase(r0: number, r1: number, gomos: number, fundo: number, curva = 1): (a: number, t: number) => number {
  return (a, t) => {
    const tt = Math.pow(t, curva);
    const dobra = fundo * Math.min(1, t * 1.6) * (0.5 - 0.5 * Math.cos(a * gomos));
    return r0 + (r1 - r0) * tt - dobra;
  };
}

/**
 * UMA FITA CHATA que corre por pontos, deitada sobre o que está por baixo:
 * a largura fica na tangente da superfície (perpendicular ao caminho e à
 * normal de fora, que é o raio horizontal), e a ponta acaba em V. É a ponta
 * de laço, a alça fina, a fita do chapéu — fita é chata, e tubo lê como
 * cordão.
 */
function fitaPorPontos(
  pontos: THREE.Vector3[], largura: number, pontaEmV = false, segmentos = 40,
  normal?: (p: THREE.Vector3) => THREE.Vector3, fechada = false,
): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos, fechada);
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const tang = new THREE.Vector3();
  const fora = new THREE.Vector3();
  const lado = new THREE.Vector3();
  for (let i = 0; i <= segmentos; i++) {
    const u = i / segmentos;
    const p = curva.getPointAt(u);
    curva.getTangentAt(u, tang);
    if (normal) fora.copy(normal(p));
    else fora.set(p.x, 0, p.z);
    if (fora.lengthSq() < 1e-8) fora.set(0, 0, 1);
    fora.normalize();
    lado.crossVectors(tang, fora).normalize();
    let meia = largura / 2;
    let recuo = 0;
    if (pontaEmV && i === segmentos) {
      // o corte em V: as duas beiradas avançam, o meio recua
      recuo = largura * 0.45;
      meia = largura / 2;
    }
    const centro = p.clone().addScaledVector(tang, -recuo);
    pos.push(p.x + lado.x * meia, p.y + lado.y * meia, p.z + lado.z * meia);
    pos.push(centro.x, centro.y, centro.z);
    pos.push(p.x - lado.x * meia, p.y - lado.y * meia, p.z - lado.z * meia);
    uv.push(0, u, 0.5, u, 1, u);
  }
  for (let i = 0; i < segmentos; i++) {
    const a = i * 3;
    const b = (i + 1) * 3;
    idx.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ====================================================== miudezas que repetem

/** um botão: o disco com a borda e os dois furinhos, olhando para +Z */
function botao(raio: number, cor: number): THREE.Group {
  const g = new THREE.Group();
  const disco = new THREE.Mesh(torneada([[0.0001, raio * 0.5], [raio * 0.8, raio * 0.45], [raio, raio * 0.25], [raio * 0.95, 0], [0.0001, 0]], 0, () => 0, 14), toon(cor));
  disco.rotation.x = Math.PI / 2;
  g.add(disco);
  const furo = toon(new THREE.Color(cor).multiplyScalar(0.6).getHex());
  for (const s of [-1, 1]) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.16, 6, 4), furo);
    f.scale.z = 0.4;
    f.position.set(s * raio * 0.3, 0, raio * 0.42);
    g.add(f);
  }
  return g;
}

/** um laço de fita macio: duas alças torneadas, o nó e as duas pontas caindo */
function lacoDeFita(e: number, cor: number | THREE.Material, pontas = 1.2): THREE.Group {
  const g = new THREE.Group();
  const mat = typeof cor === 'number' ? toon(cor, { doubleSide: true }) : cor;
  for (const lado of [-1, 1] as const) {
    // a alça é um anel achatado e franzido no nó: o meio cheio, a ponta fina
    const alca = new THREE.Mesh(new THREE.TorusGeometry(e * 0.62, e * 0.26, 8, 18), mat);
    alca.scale.set(1.1, 0.72, 0.5);
    alca.position.x = lado * e * 0.68;
    alca.rotation.z = lado * 0.18;
    g.add(alca);
    // a ponta: uma fita que cai com o corte em V
    const f = new THREE.Shape();
    f.moveTo(-e * 0.2, 0);
    f.lineTo(e * 0.2, 0);
    f.lineTo(e * 0.26, -e * pontas);
    f.lineTo(0, -e * (pontas - 0.22));
    f.lineTo(-e * 0.26, -e * pontas);
    f.closePath();
    const ponta = new THREE.Mesh(new THREE.ExtrudeGeometry(f, { depth: e * 0.06, bevelEnabled: false }), mat);
    ponta.position.set(lado * e * 0.18, -e * 0.08, -e * 0.08);
    ponta.rotation.set(0.25, 0, lado * 0.3);
    g.add(ponta);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(e * 0.28, 10, 8), typeof cor === 'number' ? toon(cor) : cor);
  no.scale.set(1, 1.15, 0.75);
  g.add(no);
  return g;
}

/** a manga bufante, no pivô do braço: franzida no ombro e no punho, estufada no meio */
function mangaBufante(m: MedidasCorpo, pano: THREE.Material, punho: THREE.Material | null, comprida = 0.12): THREE.Group {
  const { h, w } = m;
  const g = new THREE.Group();
  const R = h * 0.06 * w;
  const fim = -h * comprida;
  const perfil: Array<[number, number]> = [
    [h * 0.012, h * 0.03],
    [R * 0.8, h * 0.02],
    [R * 1.05, -h * 0.01],
    [R * 1.08, (fim - h * 0.01) * 0.55],
    [R * 0.92, fim + h * 0.012],
    [h * 0.043 * w, fim],
  ];
  const geo = torneada(perfil, 12, (t) => (t < 0.15 || t > 0.7 ? h * 0.006 : h * 0.0025), 30);
  g.add(new THREE.Mesh(geo, pano));
  if (punho) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(h * 0.043 * w, h * 0.0055, 6, 24), punho);
    anel.rotation.x = Math.PI / 2;
    anel.position.y = fim;
    g.add(anel);
  }
  return g;
}

// ===================================================================== peças

/**
 * VESTIDO DE POÁ — o simples bem feito.
 *
 * Vermelho de bolinha branca, gola Peter Pan branca, manga bufante curta com
 * o punho de vivo branco, fita na cintura com laçinho nas costas, três botões
 * no peito e a saia evasê até o joelho, franzida na cintura, com a barra de
 * vivo branco. O pano é UMA textura de poá para o corpete, a manga e a saia:
 * a bolinha tem o mesmo tamanho em toda parte.
 */
function vestidoDePoa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const fundo = peca?.cor ?? P.poaVermelho;
  const bola = peca?.corDetalhe ?? P.poaBolinha;
  const pano = toon(0xffffff, { mapa: poa(fundo, bola), doubleSide: true });
  const branco = toon(P.rendaMarfim);

  // o corpete, de gola redonda (um tico mais funda na frente)
  const yGola = c.cilindroAlto + c.r * 0.6;
  const decote = (a: number): number => yGola - h * 0.018 * Math.pow(Math.max(0, Math.cos(a)), 3);
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), pano));

  // a gola Peter Pan: duas abas redondas que se encontram na frente
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    const larg = h * 0.07;
    const alto = h * 0.034;
    f.moveTo(s * h * 0.003, 0);
    f.lineTo(s * larg, 0);
    f.quadraticCurveTo(s * larg * 1.04, -alto * 0.9, s * larg * 0.55, -alto);
    f.quadraticCurveTo(s * h * 0.006, -alto * 1.05, s * h * 0.003, -alto * 0.25);
    f.closePath();
    const geo = chapa(f, h * 0.002, h * 0.0016);
    geo.translate(0, yGola - h * 0.004, h * 0.001);
    g.add(new THREE.Mesh(noTronco(geo, m, 1.05), branco));
  }
  // os três botões, descendo do meio da gola
  for (let k = 0; k < 3; k++) {
    g.add(naPeleOlhando(botao(h * 0.0055, P.rendaMarfim), m, 0, yGola - h * 0.05 - k * h * 0.024, 1.05));
  }

  // a fita da cintura e o laçinho nas costas
  const yFita = c.cintura + h * 0.006;
  g.add(new THREE.Mesh(cintaNaPele(m, yFita, h * 0.0075), branco));
  const laco = lacoDeFita(h * 0.016, P.rendaMarfim);
  naPeleOlhando(laco, m, Math.PI, yFita, 1.12);
  g.add(laco);

  // a saia evasê, franzida, até o joelho, com o vivo branco na barra
  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.07, c.raioDoCalcao * 1.04);
  g.add(saiaViva(m, {
    yTopo: c.cintura + h * 0.004,
    yBarra: c.quadril - h * 0.15,
    raio: evase(r0, c.r * 2.15, 14, h * 0.008, 0.85),
    cortes: [0.95],
  }, [pano, branco]));

  return fundir(g);
}

/** a manga bufante do poá, no pivô de cada braço */
function mangaDoPoa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const pano = toon(0xffffff, { mapa: poa(peca?.cor ?? P.poaVermelho, peca?.corDetalhe ?? P.poaBolinha), doubleSide: true });
  return fundir(mangaBufante(m, pano, toon(P.rendaMarfim)));
}

/**
 * VESTIDO DE BAILE — o detalhado.
 *
 * Rosé com o acabamento champanhe: o corpete de decote coração com as
 * barbatanas (os vivos em pé do espartilho) e o vivo no decote; a manga
 * caída ombro a ombro, franzida no braço; a faixa de cetim na cintura com o
 * laçarote nas costas e as pontas descendo até a barra; e a saia até o chão
 * em DUAS camadas — o cetim rosé por baixo (com os brilhinhos pintados) e o
 * tule por cima, translúcido, em dois babados de barra recortada. As três
 * saias são vivas: a passada empurra as três, cada uma na sua folga.
 */
function vestidoDeBaile(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.baileRose;
  const acab = peca?.corDetalhe ?? P.baileChampanhe;
  const pano = toon(cor, { mapa: brilhinhos(), doubleSide: true });
  const liso = toon(cor);
  const champanhe = toon(acab);
  const tule = toon(P.baileTule, { opacity: 0.55, doubleSide: true });

  // ---- o corpete, decote coração: reto dos lados e atrás, os dois arcos na frente
  const yReto = c.cilindroAlto - h * 0.012;
  const decote = (a: number): number => {
    const x = Math.abs(a);
    if (x > 1.0) return yReto;
    const arco = h * 0.016 * Math.sin((Math.PI * x) / 1.0);
    const bico = h * 0.02 * Math.pow(Math.max(0, 1 - x / 0.22), 1.6);
    return yReto + arco - bico;
  };
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), liso));
  g.add(new THREE.Mesh(vivoNoDecote(m, decote, h * 0.0042, 1.04), champanhe));
  // as barbatanas: sete vivos em pé, do decote à cintura, na frente e dos lados
  for (const a of [-1.45, -0.95, -0.45, 0, 0.45, 0.95, 1.45]) {
    const topo = decote(a) - h * 0.006;
    g.add(new THREE.Mesh(vivoNaPele(m, [[a, c.cintura], [a * 1.04, (c.cintura + topo) / 2], [a, topo]], h * 0.0022, 1.036), champanhe));
  }
  // o cadarço do espartilho nas costas: a fita cruzada em X, entre dois vivos
  for (const s of [-1, 1] as const) {
    g.add(new THREE.Mesh(vivoNaPele(m, [[Math.PI - s * 0.16, c.cintura], [Math.PI - s * 0.16, yReto - h * 0.01]], h * 0.0026, 1.036), champanhe));
  }
  for (let k = 0; k < 5; k++) {
    const y0 = c.cintura + h * 0.012 + k * h * 0.024;
    for (const s of [-1, 1] as const) {
      g.add(new THREE.Mesh(vivoNaPele(m, [[Math.PI - s * 0.15, y0], [Math.PI + s * 0.15, y0 + h * 0.018]], h * 0.0016, 1.042), champanhe));
    }
  }

  // ---- a faixa de cetim da cintura e o laçarote nas costas, com as pontas compridas
  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.09, c.raioDoCalcao * 1.05);
  const r0Tule = r0 * 1.04;
  const yTopo = c.cintura + h * 0.002;
  const yFaixa = c.cintura + h * 0.004;
  const faixa = torneada([
    [raioDoTronco(m, yFaixa) * 1.075, yFaixa - h * 0.013],
    [raioDoTronco(m, yFaixa) * 1.09, yFaixa],
    [raioDoTronco(m, yFaixa) * 1.075, yFaixa + h * 0.013],
  ], 0, () => 0, 48);
  faixa.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(faixa, champanhe));
  const laco = lacoDeFita(h * 0.034, acab, 0.6);
  naPeleOlhando(laco, m, Math.PI, yFaixa, 1.16);
  g.add(laco);
  // as duas pontas compridas do laço, descendo por cima do babado de tule de cima
  const rTule = (t: number): number => (r0Tule + (h * 0.2 - r0Tule) * Math.pow(t, 0.7)) * 1.05 + h * 0.006;
  for (const s of [-1, 1] as const) {
    const pontos: THREE.Vector3[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = 0.08 + (i / 8) * 0.84;
      const y = THREE.MathUtils.lerp(yTopo, c.quadril - h * 0.1, t);
      const a = Math.PI + s * (0.12 + t * 0.14);
      const rr = rTule(t);
      pontos.push(new THREE.Vector3(Math.sin(a) * rr, y, Math.cos(a) * rr * 0.86));
    }
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.016, true), champanhe));
  }

  // ---- a saia de baile, até o chão: o cetim por baixo e as duas camadas de tule
  const chao = h * 0.012;
  g.add(saiaViva(m, {
    yTopo, yBarra: chao,
    raio: evase(r0, h * 0.235, 16, h * 0.014, 0.62),
    linhas: 18, colunas: 84,
  }, pano));
  // o tule: dois babados, o de cima mais curto, com a barra em festão
  const festao = (a: number, t: number, n: number, amp: number): number => amp * Math.max(0, t - 0.85) / 0.15 * Math.abs(Math.sin(a * n * 0.5));
  g.add(saiaViva(m, {
    yTopo, yBarra: chao + h * 0.03,
    raio: (a, t) => evase(r0 * 1.02, h * 0.245, 22, h * 0.01, 0.6)(a, t) + festao(a, t, 22, h * 0.012),
    linhas: 16, colunas: 88, camada: h * 0.008,
  }, tule));
  g.add(saiaViva(m, {
    yTopo, yBarra: c.quadril - h * 0.1,
    raio: (a, t) => evase(r0Tule, h * 0.2, 18, h * 0.008, 0.7)(a, t) + festao(a, t, 18, h * 0.014),
    linhas: 12, colunas: 80, camada: h * 0.016,
  }, tule));

  return fundir(g);
}

/** a manga caída do vestido de baile: a faixa de tule franzida no alto do braço */
function mangaDoBaile(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const { h, w } = m;
  const g = new THREE.Group();
  const cor = peca?.cor ?? P.baileRose;
  const R = h * 0.05 * w;
  const geo = torneada([
    [R * 0.86, -h * 0.028],
    [R * 1.12, -h * 0.042],
    [R * 1.18, -h * 0.058],
    [R * 1.05, -h * 0.072],
    [R * 0.88, -h * 0.078],
  ], 10, () => h * 0.004, 26);
  g.add(new THREE.Mesh(geo, toon(cor, { doubleSide: true })));
  // o vivo champanhe na boca de cima da manga
  const vivo = new THREE.Mesh(new THREE.TorusGeometry(R * 0.88, h * 0.0028, 5, 24), toon(peca?.corDetalhe ?? P.baileChampanhe));
  vivo.rotation.x = Math.PI / 2;
  vivo.position.y = -h * 0.028;
  g.add(vivo);
  return fundir(g);
}

/**
 * SAIA PLISSADA MIDI — na vaga das PERNAS.
 *
 * O plissado é a própria malha: o raio de cada coluna é um DENTE DE SERRA em
 * volta da saia (a face larga da prega sobe devagar e cai de uma vez no vinco),
 * e o toon pinta cada face de um degrau — de longe lê "prega", de perto lê
 * pano dobrado. As pregas nascem fechadas no cós (passadas a ferro) e abrem
 * para a barra, no meio da canela. O cós leva o botão forrado do lado.
 *
 * O PANO MORA NO CORPO (`extraQuadril`, y = 0 no chão), como o calção do rig;
 * a perna por baixo é pele (`pernasNuas`, que o rig deixa valer para a
 * própria saia). O `extra` das pernas não põe nada: a ficha precisa dele para
 * o rig pendurar a peça.
 */
function saiaPlissada(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.plissadaRosa;
  const corCos = peca?.corDetalhe ?? P.plissadaRosaCos;
  const pano = toon(cor, { doubleSide: true });

  const yCosCima = c.quadril + h * 0.08;
  const yCosBaixo = c.quadril + h * 0.055;
  const rCos = Math.max(c.r * 1.17, h * 0.122 * w);
  const cos = torneada([
    [rCos * 0.99, yCosBaixo],
    [rCos * 1.012, yCosBaixo + h * 0.004],
    [rCos * 1.012, yCosCima - h * 0.004],
    [rCos * 0.99, yCosCima],
    [raioDoTronco(m, yCosCima) * 0.98, yCosCima + h * 0.002],
  ], 0, () => 0, 48);
  cos.scale(1, 1, 0.86);
  g.add(new THREE.Mesh(cos, toon(corCos)));
  // o botão forrado do lado esquerdo do cós
  const b = botao(h * 0.006, corCos);
  b.position.set(-rCos * 0.72, (yCosCima + yCosBaixo) / 2, rCos * 0.86 * 0.72);
  b.lookAt(b.position.clone().add(new THREE.Vector3(-0.7, 0, 0.7)));
  g.add(b);

  const PREGAS = 30;
  const rBarra = c.r * 1.95;
  g.add(saiaViva(m, {
    yTopo: yCosBaixo + h * 0.003,
    yBarra: c.quadril - h * 0.2,
    raio: (a, t) => {
      const base = rCos * 1.005 + (rBarra - rCos) * Math.pow(t, 0.9);
      // o dente de serra: 0 no vinco, 1 na beira da prega
      const fase = ((a / (Math.PI * 2)) * PREGAS + 100) % 1;
      const fundo = h * 0.009 * Math.min(1, t * 1.4 + 0.05);
      return base - fundo * (1 - fase);
    },
    colunas: PREGAS * 5, linhas: 14,
  }, pano));
  return fundir(g);
}

// ======================================================= o kit, segunda parte

/** a normal de fora da CÁPSULA do tronco num ponto (vale no ombro, onde ela vira cúpula) */
function normalDoTronco(m: MedidasCorpo): (p: THREE.Vector3) => THREE.Vector3 {
  const c = alturas(m);
  return (p) => {
    const eixo = THREE.MathUtils.clamp(p.y, c.cilindroBaixo, c.cilindroAlto);
    return new THREE.Vector3(p.x, p.y - eixo, p.z / ACHATA).normalize();
  };
}

/** um ponto num lugar do corpo dado em ARCO (metros a partir da frente) em vez de ângulo */
function noArco(m: MedidasCorpo, x: number, y: number, folga = 1.04): [number, number] {
  const R = Math.max(raioDoTronco(m, y), m.h * 0.02) * folga;
  return [x / R, y];
}

/** a estampa do lenço de seda: a barra, as correntinhas e os medalhões */
function estampaDeLenco(fundo: number, desenho: number, lado = 0.07): THREE.CanvasTexture {
  return novaTextura(`roupa-lenco:${fundo}:${desenho}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = css(desenho);
    ctx.fillStyle = css(desenho);
    // a corrente em diagonal, elo por elo
    ctx.lineWidth = s * 0.025;
    for (let k = -1; k <= 1; k++) {
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        ctx.beginPath();
        ctx.ellipse(t * s + k * s * 0.5, t * s, s * 0.04, s * 0.022, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // o medalhão: o miolo, as oito pétalas e o anel
    const med = (x: number, y: number): void => {
      ctx.beginPath();
      ctx.arc(x, y, s * 0.11, 0, Math.PI * 2);
      ctx.lineWidth = s * 0.02;
      ctx.stroke();
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * s * 0.06, y + Math.sin(a) * s * 0.06, s * 0.026, s * 0.012, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, s * 0.02, 0, Math.PI * 2);
      ctx.fill();
    };
    for (const [x, y] of [[s * 0.75, s * 0.25], [-s * 0.25, s * 0.25], [s * 0.75, s * 1.25], [s * 0.75, -s * 0.75], [s * 0.25, s * 0.75]] as const) med(x, y);
  });
}

/** o mostrador do relógio: os doze traços, o 12 em destaque e os ponteiros às dez e dez */
function mostrador(fundo: number, traco: number, ouro: number): THREE.CanvasTexture {
  return novaTextura(`roupa-mostrador:${fundo}:${traco}:${ouro}`, 1, (ctx, s) => {
    const c = s / 2;
    ctx.fillStyle = css(ouro);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(fundo);
    ctx.beginPath();
    ctx.arc(c, c, s * 0.44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = css(traco);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const forte = k % 3 === 0;
      ctx.lineWidth = s * (forte ? 0.03 : 0.014);
      ctx.beginPath();
      ctx.moveTo(c + Math.sin(a) * s * (forte ? 0.3 : 0.34), c - Math.cos(a) * s * (forte ? 0.3 : 0.34));
      ctx.lineTo(c + Math.sin(a) * s * 0.4, c - Math.cos(a) * s * 0.4);
      ctx.stroke();
    }
    ctx.lineCap = 'round';
    for (const [ang, comp, larg] of [[-Math.PI / 3, 0.2, 0.034], [Math.PI / 3, 0.3, 0.022]] as const) {
      ctx.lineWidth = s * larg;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(c + Math.sin(ang) * s * comp, c - Math.cos(ang) * s * comp);
      ctx.stroke();
    }
    ctx.fillStyle = css(ouro);
    ctx.beginPath();
    ctx.arc(c, c, s * 0.035, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** o babado ondulado do braço (a manga borboleta, o punho de renda): franzido em cima, solto embaixo */
function babadoDoBraco(m: MedidasCorpo, y0: number, y1: number, r0: number, r1: number, pano: THREE.Material, gomos = 12): THREE.Mesh {
  const { h } = m;
  const geo = torneada([
    [r0, y0],
    [THREE.MathUtils.lerp(r0, r1, 0.45), THREE.MathUtils.lerp(y0, y1, 0.4)],
    [r1, y1],
  ], gomos, (t) => h * (0.0015 + 0.008 * t), 48);
  return new THREE.Mesh(geo, pano);
}

/** a manga comprida, do ombro ao punho, folgada por cima dos dois gomos do braço do rig */
function mangaComprida(m: MedidasCorpo, pano: THREE.Material, opts: { ombro?: number; cotovelo?: number; punho?: number; ate?: number; gomos?: number } = {}): THREE.Mesh {
  const { h, w } = m;
  const ombro = opts.ombro ?? 0.05;
  const cotovelo = opts.cotovelo ?? 0.048;
  const punho = opts.punho ?? 0.043;
  const ate = opts.ate ?? 0.235;
  const geo = torneada([
    [h * 0.02 * w, h * 0.028],
    [h * ombro * 0.86 * w, h * 0.016],
    [h * ombro * w, -h * 0.01],
    [h * (ombro + cotovelo) * 0.5 * w, -h * 0.08],
    [h * cotovelo * w, -h * 0.15],
    [h * punho * w, -h * ate],
  ], opts.gomos ?? 0, (t) => (t > 0.75 ? h * 0.004 * (t - 0.75) * 4 : 0), 26);
  return new THREE.Mesh(geo, pano);
}

/** o punho: uma faixa redonda na boca da manga */
function punhoDeManga(m: MedidasCorpo, y: number, raio: number, alto: number, mat: THREE.Material, gomos = 0): THREE.Mesh {
  const { h, w } = m;
  const r = h * raio * w;
  const geo = torneada([
    [r * 0.96, y - alto / 2],
    [r * 1.02, y - alto * 0.3],
    [r * 1.02, y + alto * 0.3],
    [r * 0.96, y + alto / 2],
  ], gomos, () => h * 0.0012, 30);
  return new THREE.Mesh(geo, mat);
}

/** o anel de babado no tronco (o decote da ciganinha, a barra da blusa): achatado como o corpo */
function babadoNoTronco(m: MedidasCorpo, perfil: Array<[number, number]>, pano: THREE.Material, gomos = 18, fundo = 0.008): THREE.Mesh {
  const geo = torneada(perfil, gomos, (t) => m.h * fundo * (0.25 + 0.75 * t), 80);
  geo.scale(1, 1, ACHATA);
  return new THREE.Mesh(geo, pano);
}

/** pontinhos de bordado (três por florzinha), espalhados numa fileira em volta do corpo */
function bordadoEmVolta(
  g: THREE.Group, m: MedidasCorpo, y: number, raio: (a: number) => number, quantas: number,
  cores: [number, number], achata = ACHATA, saltaCostas = false,
): void {
  const { h } = m;
  const a1 = toon(cores[0]);
  const a2 = toon(cores[1]);
  for (let i = 0; i < quantas; i++) {
    const a = -Math.PI + ((i + 0.5) / quantas) * Math.PI * 2;
    if (saltaCostas && Math.abs(a) > 2.6) continue;
    const R = raio(a);
    for (let k = 0; k < 3; k++) {
      const b = a + (k - 1) * (h * 0.0055) / R;
      const dy = k === 1 ? h * 0.004 : 0;
      const ponto = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0028, 5, 4), k === 1 ? a2 : a1);
      ponto.scale.set(1, 1, 0.5);
      ponto.position.set(Math.sin(b) * R, y + dy, Math.cos(b) * R * achata);
      ponto.lookAt(ponto.position.x * 2, ponto.position.y, ponto.position.z * 2);
      g.add(ponto);
    }
  }
}

// ============================================================ camisas e casacos

/**
 * BLUSA CIGANINHA — ombro a ombro, de algodão cru.
 *
 * O decote corre reto na altura do ombro e o colo fica de fora (`peitoNu`):
 * por cima dele, o BABADO franzido no elástico, com a fileira de florzinhas
 * bordadas (vermelho e azul, ponto de cruz); a manga é um bufante curto no
 * meio do braço (`extraBraco`), com o próprio babado; na frente, o cordão do
 * elástico com as duas borlas; e a barra solta, um babadinho em cima da calça.
 */
function blusaCiganinha(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.ciganinha;
  const pano = toon(cor, { mapa: linho(), doubleSide: true });
  const yDecote = c.cilindroAlto - h * 0.006;
  const solto = (_a: number, y: number): number => h * 0.007 * (1 - THREE.MathUtils.smoothstep(y, c.cintura, c.cilindroAlto));
  g.add(new THREE.Mesh(corpete(m, { decote: () => yDecote, folga: 1.04, solto }), pano));

  // o babado do decote: o elástico franzido em cima e o pano caindo por cima do peito
  const R = c.r * 1.045;
  const topo = yDecote + h * 0.008;
  g.add(babadoNoTronco(m, [
    [R * 0.995, topo],
    [R * 1.06, topo - h * 0.012],
    [R * 1.13, topo - h * 0.03],
    [R * 1.2, topo - h * 0.048],
  ], pano, 22, 0.009));
  // o vivo do elástico, por cima de tudo
  g.add(new THREE.Mesh(cintaNaPele(m, topo - h * 0.002, h * 0.0032, 1.05), pano));
  // o bordado na beira do babado
  bordadoEmVolta(g, m, topo - h * 0.04, () => R * 1.17, 18, [P.ciganinhaBordado, P.ciganinhaBordadoAzul]);

  // o cordão do elástico e as duas borlas, na frente
  for (const s of [-1, 1] as const) {
    const p0 = naPele(m, s * 0.05, topo - h * 0.003, 1.09);
    const p1 = naPele(m, s * 0.11, topo - h * 0.04, 1.2);
    const p2 = naPele(m, s * 0.13, topo - h * 0.06, 1.22);
    const cordao = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p0, p1, p2]), 12, h * 0.0016, 5, false);
    g.add(new THREE.Mesh(cordao, toon(P.ciganinhaBordado)));
    const borla = new THREE.Mesh(torneada([[0.0001, -h * 0.014], [h * 0.005, -h * 0.012], [h * 0.003, 0], [0.0001, h * 0.002]], 8, () => h * 0.001, 12), toon(P.ciganinhaBordado));
    borla.position.copy(p2);
    g.add(borla);
  }

  // a barra solta, um babadinho caindo por cima do cós da calça
  const yBarra = c.quadril + h * 0.045;
  const rB = raioDoTronco(m, yBarra) * 1.05 + h * 0.006;
  g.add(babadoNoTronco(m, [
    [rB * 0.99, yBarra],
    [rB * 1.06, yBarra - h * 0.02],
    [rB * 1.12, yBarra - h * 0.04],
  ], pano, 20, 0.006));
  bordadoEmVolta(g, m, yBarra - h * 0.032, () => rB * 1.1, 16, [P.ciganinhaBordadoAzul, P.ciganinhaBordado]);
  return fundir(g);
}

/** a manga da ciganinha: o bufante no meio do braço, com o babadinho e o bordado */
function mangaDaCiganinha(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(peca?.cor ?? P.ciganinha, { mapa: linho(), doubleSide: true });
  const R = h * 0.058 * w;
  const geo = torneada([
    [R * 0.9, -h * 0.012],
    [R * 1.12, -h * 0.03],
    [R * 1.14, -h * 0.06],
    [R * 0.82, -h * 0.088],
  ], 12, (t) => (t < 0.2 || t > 0.8 ? h * 0.005 : h * 0.002), 30);
  g.add(new THREE.Mesh(geo, pano));
  g.add(babadoDoBraco(m, -h * 0.086, -h * 0.104, R * 0.84, R * 1.08, pano, 14));
  bordadoEmVolta(g, m, -h * 0.094, () => R * 1.0, 10, [P.ciganinhaBordado, P.ciganinhaBordadoAzul], 1);
  return fundir(g);
}

/**
 * CAMISA DE SEDA COM LAÇO — a "pussy-bow" de seda champanhe.
 *
 * O pano é cetim de verdade nesta escala: o corpete leva a textura de brilho
 * pintado (as faixas de luz escorrendo em pé), e a manga também. A gola é uma
 * faixa em pé em volta do pescoço, e dela sai o LAÇO GRANDE com as pontas
 * compridas caindo no peito; a carcela desce com os botões de pérola; a manga
 * é bispo (folgada embaixo e franzida no punho, de dois botões).
 */
function camisaDeSeda(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.sedaChampanhe;
  const corLaco = peca?.corDetalhe ?? P.sedaChampanheLaco;
  const pano = toon(cor, { mapa: cetim() });
  const yGola = c.cilindroAlto + c.r * 0.6;
  const solto = (_a: number, y: number): number => h * 0.004 * (1 - THREE.MathUtils.smoothstep(y, c.cintura, c.cilindroAlto));
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, folga: 1.03, solto }), pano));
  // a gola em pé
  const rg = raioDoTronco(m, yGola);
  const gola = torneada([
    [rg * 1.02, yGola - h * 0.006],
    [rg * 1.06, yGola + h * 0.002],
    [raioDoTronco(m, yGola + h * 0.012) * 1.08, yGola + h * 0.012],
  ], 0, () => 0, 40);
  gola.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(gola, pano));
  // o laço grande, no colo (embaixo do queixo ele sumia: a cabeça do rig
  // encosta no peito), e as duas faixas da gola descendo até ele
  const fitaDoLaco = toon(corLaco, { mapa: cetim(), doubleSide: true });
  const yLaco = c.cilindroAlto + c.r * 0.12;
  const normal = normalDoTronco(m);
  for (const s of [-1, 1] as const) {
    g.add(new THREE.Mesh(fitaPorPontos([
      naPele(m, s * 0.62, yGola - h * 0.002, 1.07),
      naPele(m, s * 0.36, yGola - h * 0.016, 1.08),
      naPele(m, s * 0.1, yLaco + h * 0.008, 1.1),
    ], h * 0.011, false, 16, normal), fitaDoLaco));
  }
  const laco = lacoDeFita(h * 0.025, fitaDoLaco, 2.1);
  naPeleOlhando(laco, m, 0, yLaco, 1.16);
  laco.rotateX(-0.12);
  g.add(laco);
  // a carcela e os botões de pérola
  const carcela = new THREE.Shape();
  carcela.moveTo(-h * 0.0055, c.quadril + h * 0.02);
  carcela.lineTo(h * 0.0055, c.quadril + h * 0.02);
  carcela.lineTo(h * 0.0055, yGola - h * 0.03);
  carcela.lineTo(-h * 0.0055, yGola - h * 0.03);
  carcela.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(carcela, h * 0.0012, h * 0.001), m, 1.032), pano));
  for (let k = 0; k < 4; k++) {
    const perola = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0036, 10, 8), toon(P.perolaDeColar));
    perola.position.copy(naPele(m, 0, c.quadril + h * 0.04 + k * h * 0.03, 1.06));
    g.add(perola);
  }
  return fundir(g);
}

/** a manga bispo de seda, com o punho de dois botões */
function mangaDeSeda(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(peca?.cor ?? P.sedaChampanhe, { mapa: cetim(), doubleSide: true });
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.044 * w, h * 0.016],
    [h * 0.05 * w, -h * 0.01],
    [h * 0.052 * w, -h * 0.09],
    [h * 0.058 * w, -h * 0.17],
    [h * 0.06 * w, -h * 0.21],
    [h * 0.042 * w, -h * 0.232],
  ], 10, (t) => (t > 0.7 ? h * 0.006 * (t - 0.7) / 0.3 : 0), 28), pano));
  g.add(punhoDeManga(m, -h * 0.244, 0.0405, h * 0.024, pano));
  for (const dy of [-0.238, -0.25]) {
    const perola = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0028, 8, 6), toon(P.perolaDeColar));
    perola.position.set(lado * h * 0.042 * w, h * dy, h * 0.006);
    g.add(perola);
  }
  return fundir(g);
}

/**
 * SUÉTER DE TRANÇAS — tricô cor de aveia, grosso e folgado.
 *
 * A malha é textura (os "V" do ponto, quase brancos, multiplicando a cor), e
 * as TRANÇAS são geometria: cada trança é um par de fios (tubos) que se
 * cruzam um por cima do outro — o raio de cada um sobe e desce em fase
 * contrária, e o toon pinta o relevo. Cinco na frente e quatro nas costas,
 * com a canelura fina entre elas; a gola e a barra de ribana (a canelura no
 * próprio torno) e a manga com a trança descendo pelo lado de fora.
 */
function sueterDeTrancas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.sueterAveia;
  const corRib = peca?.corDetalhe ?? P.sueterAveiaRibana;
  const pano = toon(cor, { mapa: malha() });
  const ribana = toon(corRib, { mapa: malha() });
  const FOLGA = 1.07;
  const yGola = c.cilindroAlto + c.r * 0.55;
  const folgaEm = (y: number): number => h * 0.006 * (1 - THREE.MathUtils.smoothstep(y, c.cintura, c.cilindroAlto));
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, folga: FOLGA, solto: (_a, y) => folgaEm(y) }), pano));

  // a superfície do suéter numa altura, para as tranças se pregarem nela
  const raioEm = (y: number): number => raioDoTronco(m, y) * FOLGA + folgaEm(y) * Math.min(1, raioDoTronco(m, y) / c.r);
  const ponto = (a: number, y: number, sai: number): THREE.Vector3 => {
    const R = raioEm(y) + sai;
    return new THREE.Vector3(Math.sin(a) * R, y, Math.cos(a) * R * ACHATA);
  };
  const yBaixo = c.quadril + h * 0.055;
  const yAlto = yGola - h * 0.03;
  const trancas = [-0.95, -0.48, 0, 0.48, 0.95, Math.PI - 0.32, Math.PI + 0.32, Math.PI - 0.95, Math.PI + 0.95];
  const PASSO = h * 0.03;
  for (const a0 of trancas) {
    for (const fase of [0, Math.PI]) {
      const pontos: THREE.Vector3[] = [];
      for (let y = yBaixo; y <= yAlto + 1e-6; y += PASSO / 8) {
        const f = ((y - yBaixo) / PASSO) * Math.PI * 2 + fase;
        const arco = h * 0.0075 * Math.sin(f);
        const R = raioEm(y);
        pontos.push(ponto(a0 + arco / R, y, h * 0.0042 + h * 0.003 * Math.cos(f)));
      }
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), pontos.length, h * 0.0046, 5, false), pano));
    }
  }
  // a canelura fina entre as tranças
  for (const a of [-0.72, -0.24, 0.24, 0.72, Math.PI, Math.PI - 0.64, Math.PI + 0.64]) {
    const pontos: THREE.Vector3[] = [];
    for (let k = 0; k <= 6; k++) pontos.push(ponto(a, THREE.MathUtils.lerp(yBaixo, yAlto, k / 6), h * 0.0016));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 12, h * 0.0019, 4, false), pano));
  }

  // a gola careca de ribana
  const rg = raioEm(yGola);
  const gola = torneada([
    [rg * 0.99, yGola - h * 0.008],
    [rg * 1.03, yGola + h * 0.002],
    [raioDoTronco(m, yGola + h * 0.014) * 1.12, yGola + h * 0.014],
  ], 44, () => h * 0.0016, 88);
  gola.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(gola, ribana));
  // a barra de ribana, em pé em volta do quadril
  const rb = raioEm(c.quadril + h * 0.055) * 1.01;
  const barra = torneada([
    [rb * 0.97, c.quadril - h * 0.006],
    [rb, c.quadril - h * 0.002],
    [rb, c.quadril + h * 0.05],
    [rb * 0.99, c.quadril + h * 0.056],
  ], 48, () => h * 0.0018, 96);
  barra.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(barra, ribana));
  return fundir(g);
}

/** a manga do suéter: folgada, com a trança pelo lado de fora e o punho de ribana */
function mangaDoSueter(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(peca?.cor ?? P.sueterAveia, { mapa: malha() });
  const ribana = toon(peca?.corDetalhe ?? P.sueterAveiaRibana, { mapa: malha() });
  g.add(mangaComprida(m, pano, { ombro: 0.056, cotovelo: 0.052, punho: 0.046, ate: 0.226 }));
  g.add(punhoDeManga(m, -h * 0.238, 0.043, h * 0.026, ribana, 22));
  // a trança do lado de fora (o `lado` leva para fora em cada braço)
  const raioEm = (y: number): number => h * w * THREE.MathUtils.lerp(0.056, 0.046, THREE.MathUtils.clamp(-y / (h * 0.226), 0, 1));
  for (const fase of [0, Math.PI]) {
    const pontos: THREE.Vector3[] = [];
    for (let y = -h * 0.02; y >= -h * 0.215; y -= h * 0.004) {
      const f = (y / (h * 0.028)) * Math.PI * 2 + fase;
      const R = raioEm(y) + h * 0.0035 + h * 0.0025 * Math.cos(f);
      const ang = h * 0.006 * Math.sin(f) / R;
      pontos.push(new THREE.Vector3(lado * Math.cos(ang) * R, y, Math.sin(ang) * R));
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), pontos.length, h * 0.004, 5, false), pano));
  }
  return fundir(g);
}

/**
 * CASACO TRENCH — o clássico, de gabardine cáqui, transpassado.
 *
 * Em cima: a casca do corpo, as LAPELAS largas e a gola dobradas no peito
 * (`noTronco`), as duas fileiras de três botões de chifre, a pala de chuva no
 * ombro direito, as dragonas nos ombros, o cinto com a fivela e a ponta
 * solta, e a pala das costas. Embaixo, a SAIA DO CASACO até o joelho, em
 * DOIS PAINÉIS que se transpassam na frente e se abrem na fenda de trás —
 * vivos, como a saia de um vestido: a passada abre o casaco.
 */
function casacoTrench(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.trenchCaqui;
  const escuro = peca?.corDetalhe ?? P.trenchCaquiEscuro;
  const pano = toon(cor, { mapa: linho() });
  const panoDuplo = toon(cor, { mapa: linho(), doubleSide: true });
  const matEscuro = toon(escuro);
  const FOLGA = 1.075;
  const yGola = c.cilindroAlto + c.r * 0.5;
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, folga: FOLGA }), pano));

  // ---- as lapelas: largas, com o pique da gola, descendo até o transpasse
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(s * h * 0.012, yGola - h * 0.002);
    f.lineTo(s * h * 0.05, yGola - h * 0.008);
    f.lineTo(s * h * 0.047, yGola - h * 0.022);
    f.lineTo(s * h * 0.07, yGola - h * 0.026);
    f.quadraticCurveTo(s * h * 0.072, c.cilindroAlto - h * 0.02, s * h * 0.03, c.cilindroAlto - h * 0.075);
    f.lineTo(s * h * 0.012, yGola - h * 0.03);
    f.closePath();
    g.add(new THREE.Mesh(noTronco(chapa(f, h * 0.003, h * 0.0022), m, FOLGA + 0.02), pano));
  }
  // a gola, dando a volta por trás do pescoço
  const C = 2 * Math.PI * raioDoTronco(m, yGola) * 0.91 * FOLGA;
  const gola = new THREE.Shape();
  gola.moveTo(h * 0.03, yGola - h * 0.02);
  gola.lineTo(C - h * 0.03, yGola - h * 0.02);
  gola.lineTo(C - h * 0.016, yGola + h * 0.012);
  gola.lineTo(h * 0.016, yGola + h * 0.012);
  gola.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(gola, h * 0.003, h * 0.002, 4), m, FOLGA + 0.03), pano));

  // ---- a pala de chuva no ombro direito, e a pala das costas
  const pala = new THREE.Shape();
  pala.moveTo(h * 0.035, c.cilindroAlto + h * 0.012);
  pala.lineTo(h * 0.12, c.cilindroAlto + h * 0.012);
  pala.lineTo(h * 0.13, c.cilindroAlto - h * 0.045);
  pala.quadraticCurveTo(h * 0.08, c.cilindroAlto - h * 0.06, h * 0.04, c.cilindroAlto - h * 0.04);
  pala.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(pala, h * 0.0025, h * 0.0018), m, FOLGA + 0.012), pano));
  const Cc = 2 * Math.PI * c.r * 0.91 * FOLGA;
  const costas = new THREE.Shape();
  costas.moveTo(Cc / 2 - h * 0.09, c.cilindroAlto + h * 0.015);
  costas.lineTo(Cc / 2 + h * 0.09, c.cilindroAlto + h * 0.015);
  costas.lineTo(Cc / 2 + h * 0.095, c.cilindroAlto - h * 0.035);
  costas.quadraticCurveTo(Cc / 2, c.cilindroAlto - h * 0.06, Cc / 2 - h * 0.095, c.cilindroAlto - h * 0.035);
  costas.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(costas, h * 0.0025, h * 0.0018), m, FOLGA + 0.012), pano));

  // ---- os botões de chifre: duas fileiras de três, e o do pique da pala
  const yCinto = c.cintura + h * 0.012;
  for (const a of [-0.36, 0.36]) {
    for (let k = 0; k < 3; k++) {
      g.add(naPeleOlhando(botao(h * 0.0068, P.trenchBotao), m, a, yCinto + h * 0.03 + k * h * 0.034, FOLGA + 0.04));
    }
  }
  g.add(naPeleOlhando(botao(h * 0.005, P.trenchBotao), m, 0.85, c.cilindroAlto - h * 0.035, FOLGA + 0.045));

  // ---- as dragonas: a tira em cima de cada ombro, com o botãozinho perto da gola
  const normal = normalDoTronco(m);
  for (const s of [-1, 1] as const) {
    const pontos: THREE.Vector3[] = [];
    for (let k = 0; k <= 4; k++) {
      const x = s * c.r * THREE.MathUtils.lerp(0.42, 0.98, k / 4);
      const yTopo = c.cilindroAlto + Math.sqrt(Math.max(0, (c.r * FOLGA) ** 2 - x * x)) + h * 0.002;
      pontos.push(new THREE.Vector3(x, yTopo, 0));
    }
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.016, false, 12, normal), panoDuplo));
    const b = botao(h * 0.0045, P.trenchBotao);
    b.position.copy(pontos[0]).add(new THREE.Vector3(s * h * 0.004, h * 0.003, 0));
    b.lookAt(b.position.clone().add(normal(b.position)));
    g.add(b);
  }

  // ---- o cinto, a fivela e a ponta solta
  const rCinto = raioDoTronco(m, yCinto) * FOLGA + h * 0.004;
  const cinto = torneada([
    [rCinto, yCinto - h * 0.012],
    [rCinto * 1.012, yCinto],
    [rCinto, yCinto + h * 0.012],
  ], 0, () => 0, 56);
  cinto.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(cinto, pano));
  const fivela = new THREE.Shape();
  fivela.moveTo(-h * 0.014, -h * 0.016);
  fivela.lineTo(h * 0.014, -h * 0.016);
  fivela.lineTo(h * 0.014, h * 0.016);
  fivela.lineTo(-h * 0.014, h * 0.016);
  fivela.closePath();
  const furo = new THREE.Path();
  furo.moveTo(-h * 0.009, -h * 0.011);
  furo.lineTo(-h * 0.009, h * 0.011);
  furo.lineTo(h * 0.009, h * 0.011);
  furo.lineTo(h * 0.009, -h * 0.011);
  furo.closePath();
  fivela.holes.push(furo);
  const geoFivela = chapa(fivela, h * 0.002, h * 0.0012, 4);
  const malhaFivela = new THREE.Mesh(geoFivela, matEscuro);
  naPeleOlhando(malhaFivela, m, 0.12, yCinto, FOLGA + 0.09);
  g.add(malhaFivela);
  const ponta = fitaPorPontos([
    naPele(m, 0.2, yCinto, FOLGA + 0.08),
    naPele(m, 0.32, yCinto - h * 0.03, FOLGA + 0.16),
    naPele(m, 0.34, yCinto - h * 0.075, FOLGA + 0.2),
  ], h * 0.022, true, 16);
  g.add(new THREE.Mesh(ponta, panoDuplo));

  // ---- a saia do casaco: dois painéis transpassados, abertos na fenda de trás
  const r0 = raioDoTronco(m, c.cintura) * FOLGA + h * 0.006;
  const raio = evase(r0, c.r * 1.85, 6, h * 0.004, 0.9);
  const yTopo = yCinto + h * 0.004;
  const yBarra = c.quadril - h * 0.16;
  g.add(saiaViva(m, { yTopo, yBarra, raio, arco: [-0.42, Math.PI + 0.1], colunas: 48 }, panoDuplo));
  g.add(saiaViva(m, { yTopo, yBarra, raio, arco: [-Math.PI - 0.1, 0.42], colunas: 48, camada: h * 0.005 }, panoDuplo));
  return fundir(g);
}

/** a manga do trench, com a presilha e a fivelinha no punho (do lado de fora) */
function mangaDoTrench(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(peca?.cor ?? P.trenchCaqui, { mapa: linho() });
  g.add(mangaComprida(m, pano, { ombro: 0.058, cotovelo: 0.054, punho: 0.05, ate: 0.236 }));
  g.add(punhoDeManga(m, -h * 0.205, 0.0535, h * 0.014, pano));
  const fivela = new THREE.Mesh(new THREE.BoxGeometry(h * 0.004, h * 0.016, h * 0.014), toon(peca?.corDetalhe ?? P.trenchCaquiEscuro));
  fivela.position.set(lado * h * 0.055 * w, -h * 0.205, h * 0.01);
  g.add(fivela);
  return fundir(g);
}

// ================================================================== vestidos

/**
 * VESTIDO ENVELOPE FLORAL — o transpasse.
 *
 * Azul-noite com flores rosa e creme, pintado em canvas. O decote é o V do
 * transpasse, um tico deslocado (o painel de cima cruza do ombro direito para
 * a cintura esquerda, e a beirada dele é um vivo do próprio pano); a manga é
 * borboleta (o babado solto no alto do braço); a faixa da cintura amarra num
 * laço do lado esquerdo, com as pontas compridas; e a saia midi é de DOIS
 * PAINÉIS — o de cima transpassa o de baixo na frente —, com o babado na
 * barra.
 */
function vestidoEnvelope(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const fundo = peca?.cor ?? P.envelopeFundo;
  const flor = peca?.corDetalhe ?? P.envelopeFlor;
  const pano = toon(0xffffff, { mapa: estampaFloral(fundo, flor, P.envelopeFlorClara, P.envelopeFolha), doubleSide: true });

  const DESVIO = 0.1;
  const yV = c.cilindroAlto - h * 0.045;
  const yLado = c.cilindroAlto + c.r * 0.3;
  const yCostas = c.cilindroAlto + c.r * 0.55;
  const decote = (a: number): number => {
    const d = Math.abs(a - DESVIO);
    if (d < 0.8) return THREE.MathUtils.lerp(yV, yLado, d / 0.8);
    return THREE.MathUtils.lerp(yLado, yCostas, THREE.MathUtils.smoothstep(Math.abs(a), 0.9, 2.4));
  };
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), pano));
  // a beirada do decote enrolada, e a beirada do painel de cima descendo até a cintura
  g.add(new THREE.Mesh(vivoNoDecote(m, decote, h * 0.0034, 1.045, DESVIO - 0.85, DESVIO + 0.85), pano));
  g.add(new THREE.Mesh(vivoNaPele(m, [
    [DESVIO, yV - h * 0.002], [DESVIO - 0.25, yV - h * 0.03], [-0.55, c.cintura + h * 0.03], [-0.8, c.cintura + h * 0.004],
  ], h * 0.0038, 1.05), pano));

  // a faixa da cintura e o laço do lado esquerdo
  const yFaixa = c.cintura + h * 0.004;
  g.add(new THREE.Mesh(cintaNaPele(m, yFaixa, h * 0.0062, 1.07), pano));
  const laco = lacoDeFita(h * 0.017, pano, 2.6);
  naPeleOlhando(laco, m, -1.1, yFaixa, 1.16);
  g.add(laco);

  // a saia: o painel de baixo dá a volta, o de cima transpassa na frente; babado na barra
  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.07, c.raioDoCalcao * 1.04);
  const rB = c.r * 2.05;
  const comBabado = (extra: number) => (a: number, t: number): number => {
    const base = evase(r0 + extra, rB + extra, 10, h * 0.006, 0.85)(a, t);
    const babado = t > 0.82 ? ((t - 0.82) / 0.18) * (h * 0.02 + h * 0.008 * Math.sin(a * 26)) : 0;
    return base + babado;
  };
  const yTopo = c.cintura + h * 0.004;
  const yBarra = c.quadril - h * 0.19;
  g.add(saiaViva(m, { yTopo, yBarra, raio: comBabado(0), colunas: 96 }, pano));
  g.add(saiaViva(m, { yTopo, yBarra: yBarra + h * 0.006, raio: comBabado(h * 0.004), arco: [-0.55, 1.7], colunas: 56, camada: h * 0.005 }, pano));
  return fundir(g);
}

/** a manga borboleta do envelope: o babado solto no alto do braço */
function mangaDoEnvelope(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const { h, w } = m;
  const pano = toon(0xffffff, { mapa: estampaFloral(peca?.cor ?? P.envelopeFundo, peca?.corDetalhe ?? P.envelopeFlor, P.envelopeFlorClara, P.envelopeFolha), doubleSide: true });
  const g = new THREE.Group();
  g.add(babadoDoBraco(m, h * 0.012, -h * 0.07, h * 0.046 * w, h * 0.078 * w, pano, 10));
  return fundir(g);
}

/**
 * VESTIDO CHEMISE LISTRADO — a camisa que virou vestido.
 *
 * Listras azuis em pé no fundo branco (canvas). Gola de camisa de pontas, a
 * carcela com os botões até a cintura, o bolso no peito com a portinhola, a
 * manga curta dobrada (o barrado da dobra é o avesso, mais claro), o cinto de
 * tecido marinho com a argola dourada e a ponta, e a saia reta até o joelho.
 */
function vestidoChemise(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const fundo = peca?.cor ?? P.chemiseFundo;
  const listra = peca?.corDetalhe ?? P.chemiseListra;
  const pano = toon(0xffffff, { mapa: listras(fundo, listra), doubleSide: true });
  const branco = toon(fundo);
  const yGola = c.cilindroAlto + c.r * 0.58;
  const decote = (a: number): number => yGola - h * 0.03 * Math.pow(Math.max(0, 1 - Math.abs(a) / 0.3), 1.2);
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), pano));
  // o pé da gola e as duas pontas da gola
  const rg = raioDoTronco(m, yGola);
  const pe = torneada([[rg * 1.03, yGola - h * 0.004], [raioDoTronco(m, yGola + h * 0.012) * 1.1, yGola + h * 0.012]], 0, () => 0, 40);
  pe.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(pe, pano));
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(s * h * 0.006, yGola + h * 0.006);
    f.lineTo(s * h * 0.058, yGola + h * 0.004);
    f.lineTo(s * h * 0.05, yGola - h * 0.03);
    f.lineTo(s * h * 0.014, yGola - h * 0.04);
    f.closePath();
    g.add(new THREE.Mesh(noTronco(chapa(f, h * 0.0022, h * 0.0016), m, 1.075), pano));
  }
  // a carcela e os botões
  const carcela = new THREE.Shape();
  carcela.moveTo(-h * 0.006, c.cintura);
  carcela.lineTo(h * 0.006, c.cintura);
  carcela.lineTo(h * 0.006, yGola - h * 0.032);
  carcela.lineTo(-h * 0.006, yGola - h * 0.032);
  carcela.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(carcela, h * 0.0012, h * 0.001), m, 1.035), branco));
  for (let k = 0; k < 3; k++) {
    g.add(naPeleOlhando(botao(h * 0.0042, P.rendaMarfim), m, 0, c.cintura + h * 0.03 + k * h * 0.032, 1.05));
  }
  // o bolso do peito com a portinhola e o botãozinho
  const xB = -h * 0.045;
  const yB = c.cilindroAlto - h * 0.05;
  const bolso = new THREE.Shape();
  bolso.moveTo(xB - h * 0.017, yB - h * 0.02);
  bolso.lineTo(xB + h * 0.017, yB - h * 0.02);
  bolso.lineTo(xB + h * 0.017, yB + h * 0.014);
  bolso.lineTo(xB - h * 0.017, yB + h * 0.014);
  bolso.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(bolso, h * 0.0014, h * 0.001), m, 1.035), pano));
  const tampa = new THREE.Shape();
  tampa.moveTo(xB - h * 0.018, yB + h * 0.016);
  tampa.lineTo(xB + h * 0.018, yB + h * 0.016);
  tampa.lineTo(xB + h * 0.018, yB + h * 0.004);
  tampa.lineTo(xB, yB - h * 0.002);
  tampa.lineTo(xB - h * 0.018, yB + h * 0.004);
  tampa.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(tampa, h * 0.0016, h * 0.0011), m, 1.05), pano));
  const [aB] = noArco(m, xB, yB, 1.05);
  g.add(naPeleOlhando(botao(h * 0.003, P.rendaMarfim), m, aB, yB + h * 0.002, 1.075));

  // o cinto de tecido marinho com a argola dourada e a ponta
  const yCinto = c.cintura + h * 0.006;
  const cinto = toon(P.chemiseCinto);
  g.add(new THREE.Mesh(cintaNaPele(m, yCinto, h * 0.0075, 1.075), cinto));
  const argola = new THREE.Mesh(new THREE.TorusGeometry(h * 0.011, h * 0.0024, 6, 18), toon(P.ouroDeJoia));
  naPeleOlhando(argola, m, 0.35, yCinto, 1.15);
  g.add(argola);
  g.add(new THREE.Mesh(fitaPorPontos([
    naPele(m, 0.42, yCinto, 1.13), naPele(m, 0.5, yCinto - h * 0.03, 1.22), naPele(m, 0.52, yCinto - h * 0.07, 1.3),
  ], h * 0.014, true, 14), toon(P.chemiseCinto, { doubleSide: true })));

  // a saia reta até o joelho
  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.07, c.raioDoCalcao * 1.04);
  g.add(saiaViva(m, {
    yTopo: c.cintura + h * 0.004, yBarra: c.quadril - h * 0.15,
    raio: evase(r0, c.r * 1.8, 8, h * 0.003, 1),
  }, pano));
  return fundir(g);
}

/** a manga curta dobrada do chemise */
function mangaDoChemise(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(0xffffff, { mapa: listras(peca?.cor ?? P.chemiseFundo, peca?.corDetalhe ?? P.chemiseListra), doubleSide: true });
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.046 * w, h * 0.014],
    [h * 0.051 * w, -h * 0.015],
    [h * 0.05 * w, -h * 0.085],
  ], 0, () => 0, 26), pano));
  g.add(punhoDeManga(m, -h * 0.09, 0.0525, h * 0.016, toon(peca?.cor ?? P.chemiseFundo)));
  return fundir(g);
}

/**
 * VESTIDO DE ALCINHA DE LINHO — o simples, bem feito.
 *
 * Verde-sálvia de linho (a trama pintada), decote reto com um coração bem de
 * leve, alcinhas finas por cima dos ombros, quatro botões de coco do decote à
 * cintura, a costura da cintura marcada, e a saia midi franzida com o
 * pesponto claro perto da barra.
 */
function vestidoDeLinho(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.linhoSalvia;
  const pano = toon(cor, { mapa: linho(), doubleSide: true });
  const pesponto = toon(peca?.corDetalhe ?? P.linhoSalviaPesponto, { doubleSide: true });
  const yReto = c.cilindroAlto - h * 0.008;
  const decote = (a: number): number => yReto - h * 0.008 * Math.pow(Math.max(0, 1 - Math.abs(a) / 0.3), 1.5) + h * 0.004 * Math.sin(Math.min(Math.abs(a), 0.9) / 0.9 * Math.PI);
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), pano));
  g.add(new THREE.Mesh(vivoNoDecote(m, decote, h * 0.0026, 1.04), pano));
  // as alcinhas: do decote da frente, por cima do ombro, até o decote das costas
  const normal = normalDoTronco(m);
  const yOmbro = c.cilindroAlto + c.r * 0.68;
  for (const s of [-1, 1] as const) {
    const pontos: THREE.Vector3[] = [];
    for (let k = 0; k <= 12; k++) {
      const u = k / 12;
      const a = s * THREE.MathUtils.lerp(0.42, Math.PI - 0.42, u);
      const y = THREE.MathUtils.lerp(decote(a), yOmbro, Math.sin(Math.PI * u));
      pontos.push(naPele(m, a, y - h * 0.002, 1.045));
    }
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.008, false, 30, normal), pano));
  }
  // os botões de coco e a costura da cintura
  for (let k = 0; k < 4; k++) {
    g.add(naPeleOlhando(botao(h * 0.0045, P.botaoDeCoco), m, 0, c.cintura + h * 0.018 + k * h * 0.026, 1.045));
  }
  g.add(new THREE.Mesh(cintaNaPele(m, c.cintura + h * 0.004, h * 0.0034, 1.05), pano));

  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.07, c.raioDoCalcao * 1.04);
  g.add(saiaViva(m, {
    yTopo: c.cintura + h * 0.004, yBarra: c.quadril - h * 0.2,
    raio: evase(r0, c.r * 2.05, 12, h * 0.006, 0.85),
    cortes: [0.9, 0.915],
  }, [pano, pesponto, pano]));
  return fundir(g);
}

/**
 * VESTIDO LONGO DE CETIM — esmeralda, cortado no viés.
 *
 * O cetim é o brilho pintado; o decote é o "cowl" — o V raso com o pano
 * caindo em três dobras em U no peito —; as alcinhas finíssimas cruzam em X
 * nas costas, que são baixas; e a saia desce até o tornozelo, justa no quadril
 * e abrindo em sereia embaixo, com as dobras fundas do viés. Viva: na
 * passada ela chuta para a frente, que é o que cetim no viés faz.
 */
function vestidoDeCetim(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.cetimEsmeralda;
  const pano = toon(cor, { mapa: cetim(), doubleSide: true });
  const yAlto = c.cilindroAlto - h * 0.006;
  const decote = (a: number): number => {
    const x = Math.abs(a);
    if (x < 0.8) return yAlto - h * 0.034 * Math.pow(1 - x / 0.8, 1.4);
    if (x > 2.2) return yAlto - h * 0.05 * THREE.MathUtils.smoothstep(x, 2.2, 2.9);
    return yAlto;
  };
  g.add(new THREE.Mesh(corpete(m, { decote, baixo: c.cintura - h * 0.03 }), pano));
  g.add(new THREE.Mesh(vivoNoDecote(m, decote, h * 0.0022, 1.04), pano));
  // as dobras do cowl: três U caindo no peito, um dentro do outro
  for (let k = 0; k < 3; k++) {
    const largura = 0.62 - k * 0.12;
    const fundo = decote(0) - h * (0.012 + k * 0.011);
    const pontos: Array<[number, number]> = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10 * 2 - 1;
      pontos.push([u * largura, THREE.MathUtils.lerp(fundo, decote(u * largura) - h * 0.004, u * u)]);
    }
    g.add(new THREE.Mesh(vivoNaPele(m, pontos, h * 0.0032, 1.04 + k * 0.004), pano));
  }
  // as alcinhas: sobem da frente, passam pelo ombro e cruzam em X nas costas
  const normal = normalDoTronco(m);
  const yOmbro = c.cilindroAlto + c.r * 0.66;
  for (const s of [-1, 1] as const) {
    const pontos: THREE.Vector3[] = [];
    for (let k = 0; k <= 14; k++) {
      const u = k / 14;
      // da frente (s·0.62) até as costas do OUTRO lado (−s·(π − 0.5)), passando por cima do ombro s
      const a = u < 0.55
        ? s * THREE.MathUtils.lerp(0.62, Math.PI / 2 + 0.2, u / 0.55)
        : s * THREE.MathUtils.lerp(Math.PI / 2 + 0.2, Math.PI + 0.5, (u - 0.55) / 0.45);
      const yFim = decote(Math.PI - 0.5) - h * 0.002;
      const y = u < 0.55
        ? THREE.MathUtils.lerp(decote(0.62), yOmbro, Math.sin((u / 0.55) * Math.PI / 2))
        : THREE.MathUtils.lerp(yOmbro, yFim, Math.sin(((u - 0.55) / 0.45) * Math.PI / 2));
      pontos.push(naPele(m, a, y, 1.045 + (s > 0 ? 0.006 : 0)));
    }
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.0045, false, 40, normal), pano));
  }
  // a saia até o tornozelo, em sereia
  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.06, c.raioDoCalcao * 1.04);
  const rQuadril = c.r * 1.5;
  const rBarra = c.r * 2.15;
  g.add(saiaViva(m, {
    yTopo: c.cintura + h * 0.004, yBarra: h * 0.035,
    raio: (a, t) => {
      const corpo = r0 + (rQuadril - r0) * Math.min(1, t / 0.55);
      const sereia = t > 0.6 ? (rBarra - rQuadril) * Math.pow((t - 0.6) / 0.4, 1.6) : 0;
      const dobra = h * 0.009 * Math.min(1, t * 1.2) * (0.5 - 0.5 * Math.cos(a * 9));
      return corpo + sereia - dobra;
    },
    linhas: 20, colunas: 90,
  }, pano));
  return fundir(g);
}

/**
 * VESTIDO DE VELUDO COM GOLA DE RENDA — azul-noite.
 *
 * O veludo é a textura de manchas macias (o "amassado" que pega luz). A GOLA
 * DE RENDA é uma forma plana VAZADA — o contorno em festão e os furinhos em
 * fileira são `holes` da própria forma —, dobrada por cima dos ombros com o
 * `noTronco`: uma renda de verdade, que mostra o veludo pelos furos. Manga
 * comprida bufante no ombro, com o punho de renda em babado; os botõezinhos
 * de pérola; e a saia midi franzida.
 */
function vestidoDeVeludo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.veludoNoite;
  const corRenda = peca?.corDetalhe ?? P.rendaMarfim;
  const pano = toon(cor, { mapa: veludo(), doubleSide: true });
  const renda = toon(corRenda, { doubleSide: true });
  const yGola = c.cilindroAlto + c.r * 0.6;
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, baixo: c.cintura - h * 0.03 }), pano));

  // ---- a gola de renda, uma metade de cada lado, da frente até o meio das costas
  const C = 2 * Math.PI * raioDoTronco(m, yGola - h * 0.02) * 0.91 * 1.06;
  for (const s of [-1, 1] as const) {
    const larg = C / 2 - h * 0.006;
    const x0 = s * h * 0.004;
    const yTopo = yGola + h * 0.003;
    const yFundo = yGola - h * 0.05;
    const f = new THREE.Shape();
    f.moveTo(x0, yTopo);
    f.lineTo(x0 + s * larg, yTopo);
    f.lineTo(x0 + s * larg, yFundo + h * 0.008);
    // o festão: meias-luas ao longo da beirada de baixo
    const N = Math.max(6, Math.round(larg / (h * 0.016)));
    for (let i = N; i > 0; i--) {
      const xa = x0 + s * larg * (i / N);
      const xb = x0 + s * larg * ((i - 1) / N);
      f.quadraticCurveTo((xa + xb) / 2, yFundo - h * 0.008, xb, yFundo + h * 0.008);
    }
    f.lineTo(x0, yTopo);
    // os furinhos: uma fileira de ilhós e as gotinhas sobre cada meia-lua
    for (let i = 0; i < N; i++) {
      const xm = x0 + s * larg * ((i + 0.5) / N);
      const furo = new THREE.Path();
      furo.absellipse(xm, yFundo + h * 0.004, h * 0.0032, h * 0.0045, 0, Math.PI * 2, false, 0);
      f.holes.push(furo);
      const xi = x0 + s * larg * (i / N) + s * h * 0.004;
      if (i > 0) {
        const ilhos = new THREE.Path();
        ilhos.absarc(xi, yFundo + h * 0.022, h * 0.0034, 0, Math.PI * 2, false);
        f.holes.push(ilhos);
      }
    }
    // a renda é fina (1 mm): um degrau de bisel basta para a beirada pegar luz
    const geo = noTronco(chapa(f, h * 0.0012, h * 0.0008, 4, 1), m, 1.07);
    g.add(new THREE.Mesh(geo, renda));
  }
  // os botõezinhos de pérola, da gola à cintura
  for (let k = 0; k < 4; k++) {
    const perola = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0036, 10, 8), toon(P.perolaDeColar));
    perola.position.copy(naPele(m, 0, c.cintura + h * 0.02 + k * h * 0.026, 1.055));
    g.add(perola);
  }
  // a fita de veludo na cintura
  g.add(new THREE.Mesh(cintaNaPele(m, c.cintura + h * 0.004, h * 0.005, 1.06), pano));

  const r0 = Math.max(raioDoTronco(m, c.cintura) * 1.07, c.raioDoCalcao * 1.04);
  g.add(saiaViva(m, {
    yTopo: c.cintura + h * 0.004, yBarra: c.quadril - h * 0.19,
    raio: evase(r0, c.r * 2.1, 16, h * 0.007, 0.8),
  }, pano));
  return fundir(g);
}

/** a manga de veludo, bufante no ombro, com o babado de renda no punho */
function mangaDeVeludo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = toon(peca?.cor ?? P.veludoNoite, { mapa: veludo(), doubleSide: true });
  const renda = toon(peca?.corDetalhe ?? P.rendaMarfim, { doubleSide: true });
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.03],
    [h * 0.056 * w, h * 0.018],
    [h * 0.066 * w, -h * 0.02],
    [h * 0.054 * w, -h * 0.07],
    [h * 0.047 * w, -h * 0.15],
    [h * 0.043 * w, -h * 0.232],
  ], 12, (t) => (t < 0.35 ? h * 0.004 : 0), 28), pano));
  g.add(babadoDoBraco(m, -h * 0.228, -h * 0.256, h * 0.043 * w, h * 0.056 * w, renda, 16));
  return fundir(g);
}

// =========================================================== calças e saias

/**
 * SAIA DE TULE — rosa-balé, até a canela.
 *
 * O cós largo de cetim com o laço do lado; por baixo, o forro curto opaco; por
 * cima, TRÊS camadas de tule translúcido, cada uma mais cheia que a de dentro
 * — e é a soma das três que dá a cor: onde elas se sobrepõem o rosa fica mais
 * fundo, e na barra, onde só a de fora chega, ele clareia. As três são vivas.
 */
function saiaDeTule(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.tuleRosaBale;
  const corCetim = peca?.corDetalhe ?? P.tuleRosaBaleCetim;
  const cetimMat = toon(corCetim, { mapa: cetim(0.12) });
  const yCosCima = c.quadril + h * 0.082;
  const yCosBaixo = c.quadril + h * 0.05;
  const rCos = Math.max(c.r * 1.17, h * 0.122 * w);
  const cos = torneada([
    [rCos * 0.99, yCosBaixo],
    [rCos * 1.012, yCosBaixo + h * 0.004],
    [rCos * 1.012, yCosCima - h * 0.004],
    [rCos * 0.99, yCosCima],
    [raioDoTronco(m, yCosCima) * 0.98, yCosCima + h * 0.002],
  ], 0, () => 0, 48);
  cos.scale(1, 1, 0.86);
  g.add(new THREE.Mesh(cos, cetimMat));
  const laco = lacoDeFita(h * 0.016, toon(corCetim, { mapa: cetim(0.12), doubleSide: true }), 1.8);
  laco.position.set(-rCos * 0.62, (yCosCima + yCosBaixo) / 2, rCos * 0.86 * 0.82);
  laco.lookAt(laco.position.clone().add(new THREE.Vector3(-0.6, 0, 0.8)));
  g.add(laco);

  const yTopo = yCosBaixo + h * 0.003;
  g.add(saiaViva(m, {
    yTopo, yBarra: c.quadril - h * 0.075,
    raio: evase(rCos * 1.005, c.r * 1.55, 10, h * 0.004, 0.8),
  }, toon(cor, { doubleSide: true })));
  const tule = toon(cor, { opacity: 0.5, doubleSide: true });
  for (let k = 0; k < 3; k++) {
    g.add(saiaViva(m, {
      yTopo, yBarra: c.quadril - h * (0.19 - k * 0.012),
      raio: evase(rCos * (1.02 + k * 0.02), c.r * (1.95 + k * 0.18), 18 + k * 6, h * 0.008, 0.7),
      colunas: 72 + k * 12, camada: h * 0.004 * (k + 1),
    }, tule));
  }
  return fundir(g);
}

/**
 * JARDINEIRA JEANS — na vaga das PERNAS, com o peitilho no corpo.
 *
 * As pernas são a calça do rig pintada de jeans (a `cor`); o `extra` de cada
 * perna põe a barra dobrada e a costura de lado em pesponto mostarda; e o
 * `extraQuadril` (no corpo, y = 0 no chão) põe o resto: o quadril de jeans,
 * o cós, o PEITILHO com o bolso, as duas alças que cruzam nas costas, os
 * botões de metal e o pesponto em volta de tudo.
 */
function jardineira(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.jardineiraJeans;
  const jeans = toon(cor, { mapa: linho(0.05) });
  const jeansDuplo = toon(cor, { mapa: linho(0.05), doubleSide: true });
  const pesponto = toon(peca?.corDetalhe ?? P.jardineiraPesponto);
  const metal = toon(P.ouroDeJoia);
  // o quadril: a parte de cima da calça, por cima da cápsula do tronco
  const yCos = c.quadril + h * 0.07;
  g.add(new THREE.Mesh(corpete(m, { decote: () => yCos, folga: 1.04 }), jeans));
  const rc = raioDoTronco(m, yCos - h * 0.012) * 1.05;
  const cos = torneada([[rc, yCos - h * 0.024], [rc * 1.015, yCos - h * 0.012], [rc, yCos]], 0, () => 0, 48);
  cos.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(cos, jeans));
  for (const dy of [-0.0215, -0.0025]) g.add(new THREE.Mesh(cintaNaPele(m, yCos + h * dy, h * 0.0011, 1.075), pesponto));

  // o peitilho, com o pesponto em volta e o bolso
  const yTopo = c.cilindroAlto - h * 0.01;
  const L = h * 0.05;
  const peito = new THREE.Shape();
  peito.moveTo(-L, yCos - h * 0.02);
  peito.lineTo(L, yCos - h * 0.02);
  peito.lineTo(L, yTopo - h * 0.008);
  peito.quadraticCurveTo(L, yTopo, L - h * 0.008, yTopo);
  peito.lineTo(-L + h * 0.008, yTopo);
  peito.quadraticCurveTo(-L, yTopo, -L, yTopo - h * 0.008);
  peito.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(peito, h * 0.0022, h * 0.0016), m, 1.055), jeans));
  const contorno = (x0: number, x1: number, y0: number, y1: number, folga: number): void => {
    const pts: Array<[number, number]> = [
      noArco(m, x0, y0, folga), noArco(m, x0, y1, folga), noArco(m, (x0 + x1) / 2, y1, folga), noArco(m, x1, y1, folga), noArco(m, x1, y0, folga),
    ];
    g.add(new THREE.Mesh(vivoNaPele(m, pts, h * 0.0011, folga), pesponto));
  };
  contorno(-L + h * 0.005, L - h * 0.005, yCos - h * 0.01, yTopo - h * 0.005, 1.085);
  const yBolso = (yCos + yTopo) / 2;
  const bolso = new THREE.Shape();
  bolso.moveTo(-h * 0.026, yBolso - h * 0.022);
  bolso.lineTo(h * 0.026, yBolso - h * 0.022);
  bolso.lineTo(h * 0.028, yBolso + h * 0.016);
  bolso.lineTo(-h * 0.028, yBolso + h * 0.016);
  bolso.closePath();
  g.add(new THREE.Mesh(noTronco(chapa(bolso, h * 0.0016, h * 0.0012), m, 1.075), jeans));
  contorno(-h * 0.023, h * 0.023, yBolso - h * 0.019, yBolso + h * 0.012, 1.1);

  // as alças: do canto do peitilho, por cima do ombro, cruzando nas costas até o cós
  const normal = normalDoTronco(m);
  const yOmbro = c.cilindroAlto + c.r * 0.7;
  for (const s of [-1, 1] as const) {
    const [aCanto] = noArco(m, s * (L - h * 0.012), yTopo, 1.06);
    const pontos: THREE.Vector3[] = [];
    for (let k = 0; k <= 14; k++) {
      const u = k / 14;
      const a = u < 0.4
        ? THREE.MathUtils.lerp(aCanto, s * (Math.PI / 2), u / 0.4)
        : THREE.MathUtils.lerp(s * (Math.PI / 2), s * (Math.PI + 0.42), (u - 0.4) / 0.6);
      const y = u < 0.4
        ? THREE.MathUtils.lerp(yTopo - h * 0.006, yOmbro, Math.sin((u / 0.4) * Math.PI / 2))
        : THREE.MathUtils.lerp(yOmbro, yCos - h * 0.006, 1 - Math.cos(((u - 0.4) / 0.6) * Math.PI / 2));
      pontos.push(naPele(m, a, y, 1.07 + (s > 0 ? 0.008 : 0)));
    }
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.016, false, 40, normal), jeansDuplo));
    // o botão de metal no canto do peitilho
    const b = new THREE.Mesh(torneada([[0.0001, h * 0.004], [h * 0.006, h * 0.003], [h * 0.0065, 0], [0.0001, 0]], 0, () => 0, 16), metal);
    b.rotation.x = Math.PI / 2;
    const p = naPele(m, aCanto, yTopo - h * 0.01, 1.09);
    const grupo = new THREE.Group();
    grupo.add(b);
    grupo.position.copy(p);
    grupo.lookAt(p.clone().add(normalDaPele(aCanto)));
    g.add(grupo);
    // e o botão do lado do quadril
    g.add(naPeleOlhando(botao(h * 0.005, P.ouroDeJoia), m, s * 1.45, yCos - h * 0.035, 1.08));
  }
  return fundir(g);
}

/** a perna da jardineira: a barra dobrada com o pesponto, e a costura de lado */
function pernaDaJardineira(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const jeans = toon(peca?.cor ?? P.jardineiraJeans, { mapa: linho(0.05) });
  const pesponto = toon(peca?.corDetalhe ?? P.jardineiraPesponto);
  const yBarra = -m.legH * 0.8;
  const r = h * 0.042 * w;
  g.add(new THREE.Mesh(torneada([[r * 1.06, yBarra - h * 0.016], [r * 1.16, yBarra - h * 0.01], [r * 1.16, yBarra + h * 0.012], [r * 1.05, yBarra + h * 0.018]], 0, () => 0, 26), jeans));
  const fio = new THREE.Mesh(new THREE.TorusGeometry(r * 1.165, h * 0.001, 4, 30), pesponto);
  fio.rotation.x = Math.PI / 2;
  fio.position.y = yBarra + h * 0.006;
  g.add(fio);
  const costura = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0018, m.legH * 0.66, h * 0.0018), pesponto);
  costura.position.set(lado * r * 1.012, -m.legH * 0.42, 0);
  g.add(costura);
  return fundir(g);
}

// ===================================================================== pés

/**
 * O CABEDAL de um sapato: a sola extrudada para cima, com a quina de bisel, e
 * o alto de cada ponto dado por `altura(z)` (0..1) — é ele que decide o
 * desenho do sapato: a sapatilha é alta no bico e rebaixada atrás, a bota é
 * alta no tornozelo e desce no bico.
 */
function cabedal(m: MedidasCorpo, encolhe: number, y0: number, alto: number, bisel: number, altura: (z: number) => number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(formaDaSola(m, encolhe), {
    depth: alto, bevelEnabled: true, bevelThickness: bisel, bevelSize: m.h * 0.004, bevelSegments: 2, curveSegments: 10,
  });
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > 0) pos.setY(i, y * altura(pos.getZ(i)));
  }
  geo.computeVertexNormals();
  geo.translate(0, y0, 0);
  return geo;
}

/**
 * SAPATILHA DE BALÉ COM LAÇO — no lugar do pé (`substituiPe`).
 *
 * A sola fininha, o cabedal ALTO no bico e baixinho dos lados e atrás, e o
 * PEITO DO PÉ À MOSTRA na pele de quem calça (`MedidasCorpo.pele`): o pé é
 * uma forma própria por dentro, mais alta que o cabedal no meio e mais baixa
 * no bico — é a sapatilha que esconde os dedos e mostra o resto. O vivo na
 * boca e o lacinho de gorgorão em cima do bico.
 */
function sapatilha(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const p = pe(m);
  const cor = peca?.cor ?? P.sapatilhaRosa;
  const corLaco = peca?.corDetalhe ?? P.sapatilhaRosaLaco;
  const sola = new THREE.Color(cor).multiplyScalar(0.55).getHex();
  g.add(camadaDeSola(m, p.chao, h * 0.006, sola, 1.0));
  const zBico = p.z + p.meioComprimento;
  // o pé, na pele: alto no peito do pé, descendo para os dedos
  const pele = toon(m.pele ?? P.lojaManequim);
  g.add(new THREE.Mesh(cabedal(m, 0.86, p.chao + h * 0.006, h * 0.03, h * 0.008,
    (z) => 1 - 0.55 * THREE.MathUtils.smoothstep(z, p.z - h * 0.02, zBico)), pele));
  // o cabedal: o bico cobre os dedos, a lateral e o calcanhar são baixinhos
  const zBoca = p.z + h * 0.004;
  g.add(new THREE.Mesh(cabedal(m, 0.98, p.chao + h * 0.006, h * 0.022, h * 0.004,
    (z) => THREE.MathUtils.lerp(0.42, 1, THREE.MathUtils.smoothstep(z, zBoca - h * 0.01, zBoca + h * 0.006)) * (1 - 0.3 * THREE.MathUtils.smoothstep(z, zBoca + h * 0.02, zBico + h * 0.01))), toon(cor)));
  // o vivo da boca, contornando o pé no alto da lateral
  const vivo: THREE.Vector3[] = [];
  const sh = formaDaSola(m, 0.99).getSpacedPoints(48);
  for (const q of sh) {
    const z = -q.y;
    if (z > zBoca + h * 0.002) continue;
    vivo.push(new THREE.Vector3(q.x, p.chao + h * 0.006 + h * 0.022 * 0.42 + h * 0.004, z));
  }
  if (vivo.length > 3) {
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vivo), 48, h * 0.0016, 5, false), toon(corLaco)));
  }
  // o lacinho em cima do bico
  const laco = lacoDeFita(h * 0.0075, corLaco, 0.9);
  laco.position.set(0, p.chao + h * 0.006 + h * 0.022 + h * 0.004, zBoca + h * 0.006);
  laco.rotation.x = -1.15;
  g.add(laco);
  return fundir(g);
}

/**
 * BOTA DE MONTARIA — couro chocolate, cano até embaixo do joelho.
 *
 * O pé de bico redondo (o mesmo `cabedal`, alto atrás e descendo para o bico),
 * a sola com o salto baixo de montaria, e o CANO torneado que acompanha a
 * panturrilha e termina em bico na frente (o "espanhol": mais alto na frente
 * do joelho, mais baixo atrás), com a beirada virada, a costura de trás e a
 * presilha com a fivela do lado de fora.
 */
function botaDeMontaria(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const p = pe(m);
  const couro = peca?.cor ?? P.montariaCouro;
  const corSola = peca?.corDetalhe ?? P.montariaSola;
  const matCouro = toon(couro, { mapa: cetim(0.18) });
  g.add(camadaDeSola(m, p.chao, h * 0.008, corSola, 1.06));
  // o salto: um bloco baixo debaixo do calcanhar
  const salto = new THREE.Mesh(new THREE.BoxGeometry(h * 0.058 * w, h * 0.012, h * 0.03), toon(corSola));
  salto.position.set(0, p.chao + h * 0.004, p.z - p.meioComprimento * 0.72);
  g.add(salto);
  const zBico = p.z + p.meioComprimento;
  g.add(new THREE.Mesh(cabedal(m, 1.04, p.chao + h * 0.008, h * 0.042, h * 0.008,
    (z) => 1 - 0.5 * THREE.MathUtils.smoothstep(z, p.z - h * 0.01, zBico + h * 0.01)), matCouro));

  // o cano: torneado pela panturrilha, com o topo em bico na frente
  const yTornozelo = -m.legH + h * 0.04;
  const yTopo = -m.legH * 0.4;
  const R = h * 0.042 * w;
  const perfil: Array<[number, number]> = [
    [R * 1.2, yTornozelo],
    [R * 1.24, yTornozelo + h * 0.03],
    [R * 1.38, -m.legH * 0.62],
    [R * 1.36, -m.legH * 0.5],
    [R * 1.32, yTopo],
  ];
  const cano = torneada(perfil, 0, () => 0, 32);
  const pos = cano.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > yTopo - 1e-5) {
      const frente = pos.getZ(i) / Math.max(1e-5, Math.hypot(pos.getX(i), pos.getZ(i)));
      pos.setY(i, y + h * 0.022 * (0.5 + 0.5 * frente));
    }
  }
  cano.computeVertexNormals();
  g.add(new THREE.Mesh(cano, toon(couro, { mapa: cetim(0.18), doubleSide: true })));
  // a beirada virada do cano, seguindo o bico
  const beirada: THREE.Vector3[] = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const frente = Math.cos(a);
    beirada.push(new THREE.Vector3(Math.sin(a) * R * 1.33, yTopo + h * 0.022 * (0.5 + 0.5 * frente), Math.cos(a) * R * 1.33));
  }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beirada, true), 64, h * 0.003, 6, true), matCouro));
  // a costura de trás
  const costura = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0022, yTopo - yTornozelo - h * 0.01, h * 0.003), toon(corSola));
  costura.position.set(0, (yTopo + yTornozelo) / 2, -R * 1.33);
  g.add(costura);
  // a presilha e a fivela do lado de fora, perto do topo
  const yPresilha = yTopo - h * 0.02;
  const presilha = new THREE.Mesh(new THREE.BoxGeometry(h * 0.004, h * 0.012, h * 0.03), matCouro);
  presilha.position.set(lado * R * 1.38, yPresilha, -h * 0.006);
  g.add(presilha);
  const fivela = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0065, h * 0.0014, 5, 4), toon(P.ouroDeJoia));
  fivela.rotation.set(0, Math.PI / 2, Math.PI / 4);
  fivela.position.set(lado * R * 1.42, yPresilha, h * 0.006);
  g.add(fivela);
  return fundir(g);
}

// =================================================================== cabeça

/**
 * A ALTURA DA ABA: ela tem que passar POR CIMA do cabelo em toda a volta. A
 * conta procura, em volta da cabeça, o ponto mais alto do cabelo que fica do
 * lado de fora da copa — a aba começa um tico acima dele (o cacheado do Ari
 * é largo, e uma aba na altura do gorro entrava nos cachos).
 */
function alturaDaAba(m: MedidasCorpo, raioDaCopa: number): number {
  let alto = m.cabelo(0) - m.headR * 0.3;
  for (let a = 0.2; a <= 1.5; a += 0.05) {
    const R = m.cabelo(a);
    if (Math.sin(a) * R >= raioDaCopa * 0.98) alto = Math.max(alto, Math.cos(a) * R + m.headR * 0.03);
  }
  return alto;
}

/**
 * CHAPÉU DE PALHA COM FITA — de aba larga e mole.
 *
 * A palha é a trancinha pintada em canvas, correndo em volta (o UV do torno
 * dá a volta na copa e na aba). A copa redonda, a aba larga que cai na beira e
 * ondula de leve (o chapéu mole de verdade), o debrum na beira da aba, a fita
 * marinho em volta da copa e o laço do lado com as duas pontas caindo na aba.
 */
function chapeuDePalha(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const corPalha = peca?.cor ?? P.palhaDeChapeu;
  const corFita = peca?.corDetalhe ?? P.palhaDeChapeuFita;
  const mat = toon(corPalha, { mapa: palha(), doubleSide: true });
  const chapeu = new THREE.Group();
  chapeu.rotation.set(-0.08, 0, 0.06);
  g.add(chapeu);
  const RC = r * 0.9;
  const base = alturaDaAba(m, RC);
  const copa = torneada([[RC, 0], [RC * 0.98, r * 0.24], [RC * 0.9, r * 0.38], [RC * 0.6, r * 0.46], [0.0001, r * 0.48]], 0, () => 0, 40);
  copa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(copa, mat));
  // a aba: larga, caindo na beira, com uma onda de três voltas
  const RA = r * 1.62;
  const aba = torneada([[RC * 0.99, r * 0.01], [r * 1.2, -r * 0.02], [r * 1.42, -r * 0.07], [RA, -r * 0.15]], 0, () => 0, 64);
  const pa = aba.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i);
    const z = pa.getZ(i);
    const t = THREE.MathUtils.clamp((Math.hypot(x, z) - RC) / (RA - RC), 0, 1);
    pa.setY(i, pa.getY(i) + r * 0.05 * t * t * Math.sin(Math.atan2(x, z) * 3));
  }
  aba.computeVertexNormals();
  aba.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(aba, mat));
  // o debrum na beira da aba (segue a onda)
  const beira: THREE.Vector3[] = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    beira.push(new THREE.Vector3(Math.sin(a) * RA, base - r * 0.15 + r * 0.05 * Math.sin(a * 3), Math.cos(a) * RA));
  }
  chapeu.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beira, true), 128, r * 0.018, 5, true), toon(corPalha)));
  // a fita em volta da copa, e o laço do lado esquerdo com as pontas na aba
  const fita = torneada([[RC * 1.012, r * 0.02], [RC * 1.018, r * 0.08], [RC * 1.012, r * 0.15]], 0, () => 0, 40);
  fita.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(fita, toon(corFita)));
  const laco = lacoDeFita(r * 0.11, corFita, 1.6);
  laco.position.set(-RC * 1.06, base + r * 0.085, r * 0.12);
  laco.rotation.y = -Math.PI / 2 + 0.25;
  chapeu.add(laco);
  return fundir(g);
}

/**
 * CHAPÉU FEDORA — feltro caramelo, fita escura.
 *
 * A copa com o VINCO em gota no alto e os dois apertos na frente (os vértices
 * da copa empurrados para dentro), a aba curta virada para baixo na frente e
 * para cima atrás (a "quebra" do fedora), e a fita com o lacinho chato do lado.
 */
function chapeuFedora(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const feltro = toon(peca?.cor ?? P.fedoraFeltro, { mapa: veludo(0.08), doubleSide: true });
  const corFita = peca?.corDetalhe ?? P.fedoraFita;
  const RC = r * 0.84;
  const base = alturaDaAba(m, RC);
  const copa = torneada([[RC, 0], [RC * 0.97, r * 0.38], [RC * 0.86, r * 0.6], [RC * 0.42, r * 0.68], [0.0001, r * 0.58]], 0, () => 0, 44);
  const pc = copa.attributes.position;
  for (let i = 0; i < pc.count; i++) {
    const x = pc.getX(i);
    const y = pc.getY(i);
    const z = pc.getZ(i);
    const ang = Math.atan2(x, z);
    // os dois apertos da frente: ±0,5 rad da frente, na metade de cima da copa
    const aperto = Math.max(Math.exp(-((ang - 0.55) ** 2) / 0.05), Math.exp(-((ang + 0.55) ** 2) / 0.05)) * THREE.MathUtils.smoothstep(y, r * 0.22, r * 0.55);
    const k = 1 - 0.14 * aperto;
    pc.setX(i, x * k);
    pc.setZ(i, z * k);
  }
  copa.computeVertexNormals();
  copa.translate(0, base, 0);
  g.add(new THREE.Mesh(copa, feltro));
  const RA = r * 1.3;
  const aba = torneada([[RC * 0.99, 0], [r * 1.06, -r * 0.005], [RA, r * 0.03]], 0, () => 0, 56);
  const pa = aba.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i);
    const z = pa.getZ(i);
    const t = THREE.MathUtils.clamp((Math.hypot(x, z) - RC) / (RA - RC), 0, 1);
    // a quebra: desce na frente, sobe atrás e dos lados
    const frente = z / Math.max(1e-5, Math.hypot(x, z));
    pa.setY(i, pa.getY(i) + t * r * (frente > 0 ? -0.1 * frente * frente : 0.06 * frente * frente) + t * t * r * 0.05 * (1 - Math.abs(frente)));
  }
  aba.computeVertexNormals();
  aba.translate(0, base, 0);
  g.add(new THREE.Mesh(aba, feltro));
  const fita = torneada([[RC * 1.012, r * 0.01], [RC * 1.016, r * 0.065], [RC * 1.008, r * 0.12]], 0, () => 0, 44);
  fita.translate(0, base, 0);
  g.add(new THREE.Mesh(fita, toon(corFita)));
  const laco = lacoDeFita(r * 0.06, corFita, 0.6);
  laco.position.set(-RC * 1.03, base + r * 0.065, -r * 0.05);
  laco.rotation.y = -Math.PI / 2;
  laco.scale.z = 0.5;
  g.add(laco);
  return fundir(g);
}

/**
 * TIARA DE PÉROLAS — a faixa de veludo pousada no cabelo (a `tiara()` das
 * orelhinhas, que segue o contorno medido do cabelo de quem veste) e, por
 * cima dela, a fileira de pérolas graduadas: maiores no alto, menores perto
 * da orelha, com uma continha dourada entre cada uma.
 */
function tiaraDePerolas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const r = m.headR;
  const { g, naFaixa } = tiara(m, peca?.cor ?? P.tiaraVeludo);
  const perola = toon(peca?.corDetalhe ?? P.perolaDeColar);
  const ouro = toon(P.ouroDeJoia);
  const N = 17;
  for (let i = 0; i < N; i++) {
    const a = -1.15 + (i / (N - 1)) * 2.3;
    const tamanho = r * (0.048 + 0.03 * Math.cos(a * 1.2));
    const p = naFaixa(a);
    const fora = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
    const bola = new THREE.Mesh(new THREE.SphereGeometry(tamanho, 8, 6), perola);
    bola.position.copy(p).addScaledVector(fora, tamanho * 0.9).add(new THREE.Vector3(0, 0, r * 0.03));
    g.add(bola);
    if (i < N - 1) {
      const a2 = a + 2.3 / (N - 1) / 2;
      const conta = new THREE.Mesh(new THREE.SphereGeometry(r * 0.018, 6, 5), ouro);
      conta.position.copy(naFaixa(a2)).addScaledVector(new THREE.Vector3(Math.sin(a2), Math.cos(a2), 0), r * 0.04).add(new THREE.Vector3(0, 0, r * 0.03));
      g.add(conta);
    }
  }
  return fundir(g);
}

// ==================================================================== mãos

/**
 * RELÓGIO DOURADO — no pulso ESQUERDO só (a mão direita é a que segura as
 * coisas). A pulseira de elos em volta do pulso, a caixa torneada com o aro, o
 * MOSTRADOR pintado em canvas (os traços das horas e os ponteiros às dez e
 * dez) virado para fora do braço, e a coroa.
 */
function relogioDourado(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const { h, w } = m;
  const ouro = toon(peca?.cor ?? P.ouroDeJoia);
  const yPulso = -m.armLen * 0.79;
  const rPulso = h * 0.032 * w * 1.12;
  // a pulseira: dezoito elos em volta do pulso
  const N = 18;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const elo = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0105, h * 0.011, h * 0.0035), ouro);
    elo.position.set(Math.sin(a) * rPulso, yPulso, Math.cos(a) * rPulso);
    elo.rotation.y = a;
    elo.rotation.x = i % 2 ? 0.08 : -0.08;
    g.add(elo);
  }
  // a caixa e o mostrador, virados para fora do braço (−X neste braço)
  const caixa = new THREE.Group();
  caixa.position.set(lado * (rPulso + h * 0.001), yPulso, 0);
  caixa.rotation.z = -lado * Math.PI / 2;
  g.add(caixa);
  const R = h * 0.0125;
  caixa.add(new THREE.Mesh(torneada([[0.0001, 0], [R, 0], [R * 1.08, h * 0.002], [R * 1.04, h * 0.0048], [R * 0.86, h * 0.0052]], 0, () => 0, 32), ouro));
  const vidro = new THREE.Mesh(new THREE.CircleGeometry(R * 0.86, 32), toon(0xffffff, { mapa: mostrador(peca?.corDetalhe ?? P.relogioMostrador, P.relogioPonteiro, peca?.cor ?? P.ouroDeJoia) }));
  vidro.rotation.x = -Math.PI / 2;
  vidro.rotation.z = Math.PI / 2;
  vidro.position.y = h * 0.0049;
  caixa.add(vidro);
  const coroa = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0022, h * 0.0022, h * 0.004, 8), ouro);
  coroa.position.set(0, h * 0.0025, -R * 1.12);
  coroa.rotation.x = Math.PI / 2;
  caixa.add(coroa);
  return fundir(g);
}

/**
 * LUVAS LONGAS DE CETIM — as de ópera, marfim, até acima do cotovelo.
 *
 * O cano torneado por cima dos dois gomos do braço, franzido na boca de cima
 * (o cetim junta quando sobe), a mão calçada com o polegar, o brilho pintado
 * do cetim, e o botãozinho de pérola no lado de dentro do pulso.
 */
function luvasLongas(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.luvaMarfim;
  const mat = toon(cor, { mapa: cetim(0.08), doubleSide: true });
  g.add(new THREE.Mesh(torneada([
    [h * 0.0455 * w, -h * 0.1],
    [h * 0.0445 * w, -h * 0.12],
    [h * 0.042 * w, -h * 0.15],
    [h * 0.0375 * w, -h * 0.19],
    [h * 0.0362 * w, -h * 0.24],
    [h * 0.04 * w, -h * 0.258],
  ], 14, (t) => (t < 0.3 ? h * 0.003 * (1 - t / 0.3) : 0), 28), mat));
  const yMao = -m.armLen * 0.92;
  const mao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0435 * w, 16, 12), toon(cor, { mapa: cetim(0.08) }));
  mao.position.y = yMao;
  mao.scale.set(1, 1.1, 0.96);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.012 * w, h * 0.016, 4, 8), toon(cor, { mapa: cetim(0.08) }));
  polegar.position.set(-lado * h * 0.02 * w, yMao + h * 0.004, h * 0.025 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  const perola = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0028, 8, 6), toon(peca?.corDetalhe ?? P.perolaDeColar));
  perola.position.set(-lado * h * 0.026 * w, -h * 0.245, h * 0.024 * w);
  g.add(perola);
  return fundir(g);
}

/**
 * BOLSA DE MÃO — a estruturada de alça curta, vinho, pendurada na mão
 * ESQUERDA. O corpo de couro em trapézio com a quina macia, a aba, o fecho
 * de girar dourado na frente da aba, os pezinhos e a alça em arco subindo até
 * a mão. Fica do lado de fora do braço (o `lado`), para não bater na perna.
 */
function bolsaDeMao(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const { h } = m;
  const couro = toon(peca?.cor ?? P.bolsaVinho);
  const ouro = toon(peca?.corDetalhe ?? P.ouroDeJoia);
  const yMao = -m.armLen * 0.92;
  // a alça presa na mão, e a bolsa um tico jogada PARA FORA: reta embaixo da
  // mão, ela caía dentro de qualquer saia rodada
  const pivo = new THREE.Group();
  pivo.position.set(lado * h * 0.006, yMao + h * 0.006, 0);
  pivo.rotation.z = lado * 0.3;
  g.add(pivo);
  const bolsa = new THREE.Group();
  bolsa.position.y = -h * 0.04;
  // gira para a bolsa ficar no plano da passada (a largura em z, a cara para fora)
  bolsa.rotation.y = Math.PI / 2;
  pivo.add(bolsa);
  const L = h * 0.04;
  const A = h * 0.052;
  const E = h * 0.012;
  const corpoF = new THREE.Shape();
  corpoF.moveTo(-L, -A);
  corpoF.lineTo(L, -A);
  corpoF.lineTo(L * 0.8, 0);
  corpoF.lineTo(-L * 0.8, 0);
  corpoF.closePath();
  const corpoGeo = chapa(corpoF, E, h * 0.007, 6);
  corpoGeo.translate(0, 0, -E / 2);
  bolsa.add(new THREE.Mesh(corpoGeo, couro));
  // a aba, caindo pela frente
  const abaF = new THREE.Shape();
  abaF.moveTo(-L * 0.8, 0);
  abaF.lineTo(L * 0.8, 0);
  abaF.lineTo(L * 0.86, -A * 0.42);
  abaF.quadraticCurveTo(0, -A * 0.55, -L * 0.86, -A * 0.42);
  abaF.closePath();
  const abaGeo = chapa(abaF, h * 0.002, h * 0.0016, 6);
  abaGeo.translate(0, h * 0.002, E / 2 + h * 0.006);
  bolsa.add(new THREE.Mesh(abaGeo, couro));
  // o fecho de girar
  const fecho = new THREE.Mesh(new THREE.BoxGeometry(h * 0.012, h * 0.008, h * 0.003), ouro);
  fecho.position.set(0, -A * 0.44, E / 2 + h * 0.011);
  bolsa.add(fecho);
  const giro = new THREE.Mesh(new THREE.TorusGeometry(h * 0.003, h * 0.001, 4, 10), ouro);
  giro.position.set(0, -A * 0.44, E / 2 + h * 0.0128);
  bolsa.add(giro);
  // a alça em arco, de um canto ao outro, passando pela mão
  const alca = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-L * 0.62, h * 0.002, 0),
    new THREE.Vector3(-L * 0.45, h * 0.024, 0),
    new THREE.Vector3(0, h * 0.034, 0),
    new THREE.Vector3(L * 0.45, h * 0.024, 0),
    new THREE.Vector3(L * 0.62, h * 0.002, 0),
  ]), 24, h * 0.0032, 6, false);
  bolsa.add(new THREE.Mesh(alca, couro));
  for (const s of [-1, 1]) {
    const argola = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0035, h * 0.001, 4, 10), ouro);
    argola.position.set(s * L * 0.62, h * 0.002, 0);
    bolsa.add(argola);
  }
  return fundir(g);
}

// ============================================================== acessórios

/**
 * COLAR DE PÉROLAS — duas voltas.
 *
 * As pérolas são distribuídas por COMPRIMENTO de arco ao longo de uma curva
 * deitada na pele (alta na nuca, baixa no peito), uma encostada na outra; a
 * volta de fora é mais comprida e de pérolas um tico menores. Mais de cem
 * esferas que a `fundir()` junta numa malha só.
 */
function colarDePerolas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const perola = toon(peca?.cor ?? P.perolaDeColar);
  const yNuca = c.cilindroAlto + c.r * 0.62;
  for (const [yFrente, rp, folga] of [[c.cilindroAlto - h * 0.002, h * 0.0052, 1.07], [c.cilindroAlto - h * 0.036, h * 0.0046, 1.075]] as const) {
    const pontos: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      const a = -Math.PI + (i / 40) * Math.PI * 2;
      const y = yFrente + (yNuca - yFrente) * (0.5 - 0.5 * Math.cos(a));
      pontos.push(naPele(m, a, y, folga).add(normalDaPele(a).multiplyScalar(rp * 0.8)));
    }
    const curva = new THREE.CatmullRomCurve3(pontos, true);
    const N = Math.floor(curva.getLength() / (rp * 2.04));
    for (let i = 0; i < N; i++) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(rp, 7, 5), perola);
      bola.position.copy(curva.getPointAt(i / N));
      g.add(bola);
    }
  }
  // o fecho dourado, na nuca
  const fecho = new THREE.Mesh(new THREE.SphereGeometry(h * 0.005, 8, 6), toon(peca?.corDetalhe ?? P.ouroDeJoia));
  fecho.position.copy(naPele(m, Math.PI, yNuca, 1.09));
  g.add(fecho);
  return fundir(g);
}

/**
 * LENÇO DE SEDA — o "twilly" amarrado no pescoço.
 *
 * A faixa estampada dando a volta na base do pescoço, o nó do lado esquerdo e
 * as duas pontas caindo no peito (fitas chatas, cortadas em V). A estampa é
 * a do lenço — corrente e medalhão —, pintada em canvas com as cores da
 * ficha.
 */
function lencoDeSeda(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const tex = estampaDeLenco(peca?.cor ?? P.lencoAmarelo, peca?.corDetalhe ?? P.lencoEstampa);
  const pano = toon(0xffffff, { mapa: tex, doubleSide: true });
  const y0 = c.cilindroAlto + c.r * 0.5;
  const faixa = torneada([
    [raioDoTronco(m, y0 - h * 0.008) * 1.06, y0 - h * 0.008],
    [raioDoTronco(m, y0) * 1.1, y0],
    [raioDoTronco(m, y0 + h * 0.009) * 1.07, y0 + h * 0.009],
  ], 8, () => h * 0.002, 56);
  faixa.scale(1, 1, ACHATA);
  g.add(new THREE.Mesh(faixa, pano));
  // o nó, do lado esquerdo da frente
  const aNo = -0.55;
  const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.011, 12, 10), pano);
  no.scale.set(1.2, 0.95, 0.8);
  no.position.copy(naPele(m, aNo, y0 - h * 0.004, 1.16));
  g.add(no);
  for (const [a1, y1, a2, y2] of [[-0.72, y0 - h * 0.03, -0.8, y0 - h * 0.062], [-0.38, y0 - h * 0.034, -0.3, y0 - h * 0.07]] as const) {
    const pontos = [naPele(m, aNo, y0 - h * 0.008, 1.16), naPele(m, a1, y1, 1.1), naPele(m, a2, y2, 1.08)];
    g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.016, true, 16), pano));
  }
  return fundir(g);
}

/**
 * BOLSA TRANSVERSAL — couro caramelo matelassê.
 *
 * A alça dá a volta no corpo na diagonal (do ombro esquerdo ao quadril
 * direito, pela frente e pelas costas), deitada na pele; a bolsa fica na
 * frente do quadril direito, longe do balanço da mão: o corpo acolchoado
 * (a textura de matelassê do sofá), a aba e o fecho redondo dourado.
 */
function bolsaTransversal(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = alturas(m);
  const cor = peca?.cor ?? P.bolsaCaramelo;
  const couro = toon(cor);
  const ouro = toon(peca?.corDetalhe ?? P.ouroDeJoia);
  // a alça: a volta inteira na diagonal, deitada na pele
  const yAlto = c.cilindroAlto + c.r * 0.68;
  const yBaixo = c.quadril + h * 0.075;
  const normal = normalDoTronco(m);
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i < 28; i++) {
    const a = -Math.PI / 2 + (i / 28) * Math.PI * 2;
    const y = (yAlto + yBaixo) / 2 + (yAlto - yBaixo) / 2 * Math.cos(a + Math.PI / 2);
    pontos.push(naPele(m, a, y, 1.09));
  }
  g.add(new THREE.Mesh(fitaPorPontos(pontos, h * 0.011, false, 96, normal, true), toon(cor, { doubleSide: true })));
  // a bolsa, na frente do quadril direito
  const aBolsa = 0.62;
  const yBolsa = c.quadril + h * 0.035;
  const bolsa = new THREE.Group();
  naPeleOlhando(bolsa, m, aBolsa, yBolsa, 1.0);
  bolsa.position.copy(naPele(m, aBolsa, yBolsa, 1.0)).addScaledVector(normalDaPele(aBolsa), h * 0.03);
  g.add(bolsa);
  const L = h * 0.034;
  const A = h * 0.026;
  const forma = new THREE.Shape();
  forma.moveTo(-L, -A);
  forma.lineTo(L, -A);
  forma.lineTo(L, A);
  forma.lineTo(-L, A);
  forma.closePath();
  const corpoGeo = chapa(forma, h * 0.012, h * 0.006, 6);
  corpoGeo.translate(0, 0, -h * 0.012);
  // o UV do extrudado é a própria posição (em metros): o matelassê cai no tamanho certo
  bolsa.add(new THREE.Mesh(corpoGeo, toon(cor, { mapa: matelasse(0.05) })));
  const aba = new THREE.Shape();
  aba.moveTo(-L, A);
  aba.lineTo(L, A);
  aba.lineTo(L, 0);
  aba.quadraticCurveTo(0, -A * 0.35, -L, 0);
  aba.closePath();
  const abaGeo = chapa(aba, h * 0.002, h * 0.0016, 8);
  abaGeo.translate(0, h * 0.0015, h * 0.004);
  bolsa.add(new THREE.Mesh(abaGeo, couro));
  const fecho = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0045, h * 0.0014, 6, 16), ouro);
  fecho.position.set(0, -A * 0.16, h * 0.0085);
  bolsa.add(fecho);
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0024, 8, 6), ouro);
  miolo.position.set(0, -A * 0.16, h * 0.0085);
  bolsa.add(miolo);
  for (const s of [-1, 1]) {
    const argola = new THREE.Mesh(new THREE.TorusGeometry(h * 0.004, h * 0.0012, 4, 10), ouro);
    argola.position.set(s * L * 0.95, A + h * 0.002, -h * 0.004);
    bolsa.add(argola);
  }
  return fundir(g);
}

/** a vaga das pernas pede `extra`; a saia não põe nada nas pernas */
function nadaNaPerna(): THREE.Object3D {
  return new THREE.Group();
}

export {
  // camisas e casacos
  blusaCiganinha, mangaDaCiganinha, camisaDeSeda, mangaDeSeda,
  sueterDeTrancas, mangaDoSueter, casacoTrench, mangaDoTrench,
  // vestidos
  vestidoDePoa, mangaDoPoa, vestidoDeLinho, vestidoEnvelope, mangaDoEnvelope,
  vestidoChemise, mangaDoChemise,
  vestidoDeBaile, mangaDoBaile, vestidoDeCetim, vestidoDeVeludo, mangaDeVeludo,
  // calças e saias
  saiaPlissada, saiaDeTule, jardineira, pernaDaJardineira, nadaNaPerna,
  // pés, cabeça, mãos e acessórios
  sapatilha, botaDeMontaria, chapeuDePalha, chapeuFedora, tiaraDePerolas,
  relogioDourado, luvasLongas, bolsaDeMao, colarDePerolas, lencoDeSeda, bolsaTransversal,
  // o kit, para quem for fazer a próxima
  corpete, saiaViva, noTronco, torneada, evase, naPele, vivoNaPele,
  estampaFloral, listras, poa, linho, cetim, veludo, malha, palha,
};
