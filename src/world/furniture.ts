import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { brilhoDeLuz, claridade, toon, flat, luzNoChao } from '../core/materials';
import { PALETTE as P } from '../palette';
import { uvEmMetros, uvEmMetrosPorTriangulo } from './acabamento';
import { desenhoDeTapete, matelasse, veioDeMadeira, type EstiloDeTapete } from './texturasDeCasa';

/**
 * Kit de interiores. Mesma convencao dos props: Group com base em y=0.
 */

export function rug(width = 3, depth = 2.2, color: number = P.rug): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), toon(color));
  m.position.y = 0.02;
  m.receiveShadow = true;
  return m;
}

/**
 * O TAPETE DE VERDADE: canto arredondado, um dedo de espessura, o desenho
 * inteiro pintado em canvas (`desenhoDeTapete`) e, no felpudo, a FRANJA de
 * algodão nas duas pontas curtas.
 *
 * O `rug()` de cima continua existindo para quem só quer uma mancha de cor no
 * chão (a escola, o Mania); este é o tapete de casa.
 *
 * A franja é um `InstancedMesh`: sessenta fiozinhos por ponta são UMA malha
 * só, e cada um sai com um giro e um comprimento sorteados — fio alinhado
 * como pente parece régua.
 */
export function tapete(
  largura = 2.6, profundidade = 2.0, cor: number = P.rug, estilo: EstiloDeTapete = 'felpudo',
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tapete';
  const alto = estilo === 'felpudo' ? 0.035 : 0.025;
  const r = Math.min(largura, profundidade) * 0.04;
  const forma = new THREE.Shape();
  const hx = largura / 2;
  const hz = profundidade / 2;
  forma.moveTo(-hx + r, -hz);
  forma.lineTo(hx - r, -hz);
  forma.quadraticCurveTo(hx, -hz, hx, -hz + r);
  forma.lineTo(hx, hz - r);
  forma.quadraticCurveTo(hx, hz, hx - r, hz);
  forma.lineTo(-hx + r, hz);
  forma.quadraticCurveTo(-hx, hz, -hx, hz - r);
  forma.lineTo(-hx, -hz + r);
  forma.quadraticCurveTo(-hx, -hz, -hx + r, -hz);
  const geo = new THREE.ExtrudeGeometry(forma, { depth: alto, bevelEnabled: false, curveSegments: 4 });
  // o UV cobre o tapete inteiro de 0 a 1: o desenho tem borda e não se repete
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / largura + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / profundidade + 0.5;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const corpo = new THREE.Mesh(geo, toon(cor, { mapa: desenhoDeTapete(largura, profundidade, estilo) }));
  // deitado: a forma nasce em XY e é extrudada em +Z; girada, o +Y dela vira -Z
  // e a espessura sobe a partir do chão
  corpo.rotation.x = -Math.PI / 2;
  g.add(corpo);

  if (estilo === 'felpudo') {
    // a franja vai nas pontas CURTAS (as que ficam no eixo mais comprido)
    const noX = largura >= profundidade;
    const lado = noX ? profundidade : largura;
    const passo = 0.034;
    const porPonta = Math.floor((lado - 2 * r) / passo);
    const fio = new THREE.BoxGeometry(0.014, 0.008, 0.075);
    fio.translate(0, 0.004, 0.0375);
    const franja = new THREE.InstancedMesh(fio, toon(P.franjaDeTapete), porPonta * 2);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const escala = new THREE.Vector3();
    let n = 0;
    let semente = 17;
    const rnd = (): number => {
      semente = (semente * 16807) % 2147483647;
      return semente / 2147483647;
    };
    for (const ponta of [-1, 1] as const) {
      for (let k = 0; k < porPonta; k++) {
        const ao = -lado / 2 + r + passo * (k + 0.5);
        const giro = (rnd() - 0.5) * 0.5;
        // o fio sai para fora da ponta: +X (ou -X) no tapete largo
        const angulo = noX ? (ponta > 0 ? Math.PI / 2 : -Math.PI / 2) + giro : (ponta > 0 ? 0 : Math.PI) + giro;
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angulo);
        escala.set(1, 1, 0.75 + rnd() * 0.5);
        const x = noX ? ponta * (hx - 0.01) : ao;
        const z = noX ? ao : ponta * (hz - 0.01);
        m.compose(new THREE.Vector3(x, 0, z), q, escala);
        franja.setMatrixAt(n++, m);
      }
    }
    franja.instanceMatrix.needsUpdate = true;
    g.add(franja);
  }
  return g;
}

/**
 * A POÇA DE LUZ de uma lâmpada: o degradê redondo da `luzNoChao`, somado ao
 * que está embaixo. Deitada (no chão, embaixo do abajur de pé) ou EM PÉ (o
 * leque de luz que o abajur da cabeceira joga na parede atrás dele, olhando
 * para +Z).
 */
export function pocaDeLuz(raio: number, cor: number = P.luzDeAbajur, forca = 0.45, emPe = false): THREE.Mesh {
  const poca = new THREE.Mesh(new THREE.PlaneGeometry(raio * 2, raio * 2), luzNoChao(cor, forca));
  if (!emPe) poca.rotation.x = -Math.PI / 2;
  poca.renderOrder = 2;
  poca.userData.semSombra = true;
  return poca;
}

/** O HALO macio em volta de uma cúpula acesa, sempre de frente para a câmera. */
export function haloDeLampada(tamanho: number, cor: number = P.luzDeAbajur, forca = 0.6): THREE.Sprite {
  const halo = new THREE.Sprite(brilhoDeLuz(cor, forca));
  halo.scale.set(tamanho, tamanho, 1);
  halo.renderOrder = 3;
  return halo;
}

/**
 * A CLARIDADE DA JANELA: o retângulo de luz do dia que a janela joga no chão,
 * e o feixe bem fraco que desce até ele.
 *
 * Origem no pé da parede, embaixo do meio da janela; +Z é para dentro do
 * cômodo (pendure com `w.place(…, rot)` do mesmo jeito que a janela). A luz
 * entra descendo num ângulo `inclinacao` (rad, a partir do chão): o canto de
 * cima da janela cai mais longe da parede, o de baixo mais perto, e a mancha
 * é a sombra da janela ao contrário.
 *
 * Não é sol de verdade, e nem quer ser: o sol do cenário vem do outro lado.
 * É claridade — fraca, de borda macia, a cor de luz do dia —, e por isso não
 * briga com as sombras dos móveis.
 */
export function claridadeDaJanela(
  largura: number, altura: number, centro: number, inclinacao = 0.95, forca = 0.22,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'claridade';
  const t = Math.tan(inclinacao);
  const perto = (centro - altura / 2) / t;
  const longe = (centro + altura / 2) / t;
  const mancha = new THREE.Mesh(new THREE.PlaneGeometry(largura, longe - perto), claridade(P.luzDeJanela, forca));
  mancha.rotation.x = -Math.PI / 2;
  mancha.position.set(0, 0.004, (perto + longe) / 2);
  mancha.renderOrder = 2;
  mancha.userData.semSombra = true;
  g.add(mancha);

  // o feixe: dois planos (o de cima e o de baixo do volume de luz), bem fracos
  for (const [y0, z1] of [[centro + altura / 2, longe], [centro - altura / 2, perto]] as const) {
    const comp = Math.hypot(y0, z1);
    const feixe = new THREE.Mesh(new THREE.PlaneGeometry(largura, comp), claridade(P.luzDeJanela, forca * 0.28));
    feixe.position.set(0, y0 / 2, z1 / 2);
    // o plano nasce em pé (XY); deitar até ligar o vão da janela ao chão
    feixe.rotation.x = -Math.atan2(z1, y0);
    feixe.renderOrder = 3;
    feixe.userData.semSombra = true;
    g.add(feixe);
  }
  return g;
}

export function sofa(color: number = P.sofa, width = 2.2): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.42, 0.9), toon(color));
  base.position.y = 0.28;
  g.add(base);
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, 0.62, 0.24), toon(color));
  back.position.set(0, 0.72, -0.35);
  g.add(back);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.9), toon(color));
    arm.position.set(side * (width / 2 - 0.12), 0.62, 0);
    g.add(arm);
  }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.14, 6), toon(P.woodDark));
    foot.position.set(x * (width / 2 - 0.2), 0.07, z * 0.34);
    g.add(foot);
  }
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.34), toon(P.flowerPink));
  cushion.position.set(width / 2 - 0.5, 0.55, -0.14);
  cushion.rotation.set(0.9, 0.4, 0);
  g.add(cushion);
  return g;
}

export function coffeeTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.46;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 6), toon(P.woodDark));
    leg.position.set(x * 0.5, 0.23, z * 0.27);
    g.add(leg);
  }
  return g;
}

export function tvSet(on = false): THREE.Group {
  const g = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.45), toon(P.woodDark));
  stand.position.y = 0.25;
  g.add(stand);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.08), toon(0x1f2229));
  panel.position.y = 0.95;
  g.add(panel);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.36, 0.72),
    flat(on ? 0x8fd7ff : P.screen, 1),
  );
  screen.name = 'tela'; // a cena troca o material desta malha para ligar a TV
  screen.position.set(0, 0.95, 0.05);
  g.add(screen);
  return g;
}

/**
 * Estante de livros: carcaca com vao de verdade, e os livros DENTRO dele.
 *
 * A primeira versao era um bloco macico de 0,32 de profundidade com os livros
 * enfiados nele, e a face da frente dos dois caia no mesmo z (0,16). Duas
 * superficies coplanares brigam pelo mesmo pixel: as lombadas serrilhavam e
 * piscavam conforme a camera girava, e o resto do livro ficava enterrado na
 * madeira. Nao adianta empurrar o livro para a frente — ele so passaria a
 * flutuar colado numa parede. A peca precisa ser oca.
 *
 * Entao: duas laterais, um fundo recuado e as tabuas. O vao util vai de
 * `-prof/2 + espessura` (o fundo) ate `+prof/2` (a boca), e os livros vivem
 * com folga no meio dele — nenhuma face encosta em nenhuma outra.
 */
export function bookshelf(height = 2.1, width = 1.2, cor: number = P.woodDark): THREE.Group {
  const g = new THREE.Group();
  // etiqueta para o teste achar a peca na cena e medir a folga das lombadas
  g.userData.peca = 'estante';
  const prof = 0.32;
  const esp = 0.04;

  // O fundo sai 1 cm POR TRÁS das laterais, e para 1 cm antes do topo e da base.
  //
  // Alinhado com elas, ele dividia SEIS planos de face — as duas laterais, o
  // topo, a base e a traseira — e a estante serrilhava na quina toda vez que a
  // câmera girava. Sobressair também é como estante de verdade é: a costa passa
  // por trás dos montantes.
  // `width - esp` (e não `- esp * 2`): assim ele entra 2 cm em cada lateral, em
  // vez de terminar no mesmo x das tábuas
  const fundo = new THREE.Mesh(
    new THREE.BoxGeometry(width - esp, height - 0.02, esp),
    toon(P.estanteFundo),
  );
  fundo.position.set(0, height / 2, -prof / 2 - 0.005);
  g.add(fundo);

  for (const lado of [-1, 1]) {
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(esp, height, prof), toon(cor));
    lateral.position.set((lado * (width - esp)) / 2, height / 2, 0);
    g.add(lateral);
  }

  // as tabuas: `vaos + 1` delas, contando a base e o topo
  const vaos = Math.max(2, Math.floor(height / 0.5));
  const alturaDoVao = height / vaos;
  for (let i = 0; i <= vaos; i++) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(width - esp * 2, esp, prof), toon(cor));
    // base e topo encostam na ponta; o resto fica no meio da divisao
    const y = i === 0 ? esp / 2 : i === vaos ? height - esp / 2 : alturaDoVao * i;
    tabua.position.set(0, y, 0);
    g.add(tabua);
  }

  const cores = [P.metalRed, P.fabricBlue, P.gold, P.bush, P.flowerPink];
  for (let v = 0; v < vaos; v++) {
    const chao = alturaDoVao * v + esp / 2;
    const teto = alturaDoVao * (v + 1) - esp / 2;
    const livre = teto - chao;

    // Enche a prateleira da esquerda para a direita ate acabar o espaco, com
    // larguras variadas — cinco livros iguais espacados na mao saem com cara de
    // grade. O ultimo vai tombado, apoiado na quina, como estante de verdade.
    let x = -width / 2 + esp + 0.03;
    let n = 0;
    const limite = width / 2 - esp - 0.03;
    while (n < 7) {
      const larg = 0.05 + ((v * 3 + n * 5) % 4) * 0.018;
      const alt = Math.min(livre * 0.92, 0.26 + ((v + n * 2) % 4) * 0.035);
      if (x + larg > limite) break;
      // o ultimo cabe deitado? entao ele tomba
      const tomba = n >= 3 && x + larg + alt * 0.5 > limite;

      const livro = new THREE.Mesh(
        new THREE.BoxGeometry(larg, alt, 0.17),
        toon(cores[(v * 2 + n) % cores.length]),
      );
      // z = 0.02: sobra folga para o fundo (-0.12) e para a boca (0.16), entao
      // nenhuma face do livro encosta na carcaca
      livro.position.set(0, alt / 2, 0.02);
      livro.userData.livro = true;

      // O giro mora num pivo na BASE do livro. Girando a malha direto, ela roda
      // em torno do proprio centro e a quina de baixo afunda na prateleira.
      const pivo = new THREE.Group();
      pivo.position.set(x + larg / 2, chao, 0);
      if (tomba) pivo.rotation.z = -0.42;
      pivo.add(livro);
      g.add(pivo);

      x += tomba ? larg + alt * 0.42 : larg + 0.012;
      n++;
    }
  }

  return g;
}

/**
 * A ESTANTE DO QUARTO DO ARI: a `bookshelf` de cima com acabamento de móvel
 * de verdade — cornija sobrando por cima, rodapé recuado, quatro vãos — e
 * prateleiras que parecem de alguém: livros de alturas e larguras diferentes
 * (alguns com faixa na lombada), uma pilha deitada com uma suculenta em cima,
 * um porta-retrato, uma caixinha, e o último livro de cada fileira tombado.
 *
 * O CONTRATO DA ESTANTE continua o da `bookshelf` (o `quarto.mjs` mede): a
 * carcaça é malha filha direta, cada livro mora num pivô com
 * `userData.livro`, e nenhum livro encosta na boca nem no fundo. Os enfeites
 * vão dentro de GRUPOS, para não entrarem na conta da carcaça.
 */
export function estanteDeLivros(altura = 1.9, largura = 1.1, cor: number = P.woodDark): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'estante';
  const prof = 0.32;
  const esp = 0.04;
  const madeira = toon(cor);
  const RODAPE = 0.07;

  const fundo = new THREE.Mesh(new THREE.BoxGeometry(largura - esp, altura - 0.02, esp), toon(P.estanteFundo));
  fundo.position.set(0, altura / 2, -prof / 2 - 0.005);
  g.add(fundo);
  for (const lado of [-1, 1]) {
    // um centímetro mais alta: a ponta entra na cornija em vez de encostar nela
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(esp, altura + 0.01, prof), madeira);
    lateral.position.set((lado * (largura - esp)) / 2, (altura + 0.01) / 2, 0);
    g.add(lateral);
  }
  const cornija = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.05, 0.04, prof + 0.035), madeira);
  cornija.position.set(0, altura + 0.019, 0.006);
  g.add(cornija);
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura - esp * 2 - 0.004, RODAPE, prof - 0.04), madeira);
  rodape.position.set(0, RODAPE / 2, -0.01);
  g.add(rodape);

  const vaos = 4;
  const base = RODAPE;
  const alturaDoVao = (altura - base) / vaos;
  for (let i = 0; i <= vaos; i++) {
    if (i === vaos) break; // o topo é a cornija
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(largura - esp * 2 - 0.004, esp * 0.75, prof - 0.012), madeira);
    tabua.position.set(0, base + alturaDoVao * i + (esp * 0.75) / 2, 0.003);
    g.add(tabua);
  }

  const CORES = [
    P.metalRed, P.fabricBlue, P.gold, P.bush, P.flowerPink, P.wallMint,
    P.roupaLa, P.chocolate, P.pcTeclaForte, P.laranja,
  ];
  let semente = 31;
  const rnd = (): number => {
    semente = (semente * 16807) % 2147483647;
    return semente / 2147483647;
  };
  /** um livro em pé (ou tombado `giro` rad) com a base em (x, chão) */
  const livro = (x: number, chao: number, larg: number, alt: number, giro = 0, deitado = false): void => {
    const cor = CORES[Math.floor(rnd() * CORES.length)];
    const pivo = new THREE.Group();
    pivo.position.set(x, chao, 0);
    pivo.rotation.z = giro;
    const corpo = deitado
      ? new THREE.Mesh(new THREE.BoxGeometry(alt, larg, 0.19), toon(cor))
      : new THREE.Mesh(new THREE.BoxGeometry(larg, alt, 0.17), toon(cor));
    corpo.position.set(0, (deitado ? larg : alt) / 2, 0.02);
    corpo.userData.livro = true;
    pivo.add(corpo);
    // a faixa da lombada: um anel claro, 2 mm mais gordo que o livro
    if (!deitado && rnd() < 0.55) {
      for (const k of [0.16, 0.78]) {
        const faixa = new THREE.Mesh(new THREE.BoxGeometry(larg + 0.004, 0.014, 0.174), toon(P.cupula));
        faixa.position.set(0, alt * k, 0.02);
        pivo.add(faixa);
      }
    }
    g.add(pivo);
  };

  const enfeite = new THREE.Group();
  g.add(enfeite);
  for (let v = 0; v < vaos; v++) {
    const chao = base + alturaDoVao * v + esp * 0.75;
    const livre = alturaDoVao - esp * 0.75;
    let x = -largura / 2 + esp + 0.025;
    let limite = largura / 2 - esp - 0.025;

    // cada vão com um enfeite, num canto, para os livros não virarem papel de parede
    if (v === 1) {
      // uma pilha deitada com uma suculenta em cima, à direita
      const xp = limite - 0.12;
      for (let k = 0; k < 3; k++) livro(xp + (k % 2) * 0.012, chao + k * 0.035, 0.035, 0.22 - k * 0.02, 0, true);
      const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.06, 12), toon(P.plantPot));
      vaso.position.set(xp, chao + 0.105 + 0.03, 0.02);
      enfeite.add(vaso);
      for (let f = 0; f < 6; f++) {
        const a = (f / 6) * Math.PI * 2;
        const folha = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), toon(f % 2 ? P.leafLight : P.leafMid));
        folha.scale.set(0.6, 1.3, 0.6);
        folha.position.set(xp + Math.cos(a) * 0.022, chao + 0.18, 0.02 + Math.sin(a) * 0.022);
        folha.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
        enfeite.add(folha);
      }
      limite = xp - 0.15;
    } else if (v === 2) {
      // um porta-retrato em pé, à esquerda
      const ret = new THREE.Group();
      ret.position.set(x + 0.08, chao, 0.02);
      ret.rotation.y = 0.25;
      const moldura = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.02), toon(P.gold));
      moldura.position.y = 0.09;
      moldura.rotation.x = -0.12;
      ret.add(moldura);
      const foto = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.14, 0.006), toon(P.skyDusk));
      foto.position.set(0, 0.09, 0.011);
      foto.rotation.x = -0.12;
      ret.add(foto);
      enfeite.add(ret);
      x += 0.19;
    } else if (v === 0) {
      // uma caixinha de guardar coisa, à direita
      const cx = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.16, 0.22, 2, 0.015), toon(P.armarioCaixa));
      cx.position.set(limite - 0.11, chao + 0.08, 0.0);
      enfeite.add(cx);
      limite -= 0.25;
    }

    // os livros, da esquerda para a direita, com o último tombado
    let n = 0;
    while (n < 12) {
      const larg = 0.03 + rnd() * 0.04;
      const alt = Math.min(livre * 0.9, 0.22 + rnd() * 0.13);
      if (x + larg > limite) break;
      const tomba = n >= 3 && x + larg + alt * 0.5 > limite;
      if (tomba && x + alt * 0.42 + larg > limite + 0.02) break;
      livro(x + larg / 2, chao, larg, alt, tomba ? -0.42 : 0);
      x += tomba ? larg + alt * 0.42 : larg + 0.006;
      n++;
      if (tomba) break;
    }
  }

  // em cima da cornija: dois livros deitados
  const topo = altura + 0.039;
  livro(-0.25, topo, 0.04, 0.24, 0, true);
  livro(-0.24, topo + 0.04, 0.035, 0.2, 0, true);
  return g;
}

/**
 * A ESPADA-DE-SÃO-JORGE do quarto do Ari: um vaso torneado de cerâmica no seu
 * pratinho, terra, e as folhas compridas e pontudas subindo em leque.
 *
 * O VASO É `LatheGeometry`: um perfil de meia dúzia de pontos (o pé, a
 * barriga, a boca com a borda virada) girado em volta do eixo. Sai redondo de
 * verdade, com a borda que segura a luz — o cilindro de antes era um copo.
 *
 * A FOLHA É GEOMETRIA PRÓPRIA (`folhaDeEspada`): a silhueta de lança, dobrada
 * no meio como uma calha (a nervura) e curvada para fora no comprimento. As
 * nove folhas são UM `InstancedMesh`, cada uma com a sua altura, o seu giro e
 * a sua cor (`setColorAt`): verde-escuro, verde-claro e duas com a beirada
 * amarelada, que é a cara da planta.
 */
export function plantaDeEspada(escala = 1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'planta-do-quarto';
  const s = escala;

  // o pratinho embaixo
  const prato = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.17 * s, 0.03 * s, 24), toon(P.plantPot));
  prato.position.y = 0.015 * s;
  g.add(prato);

  // o vaso: o perfil (raio, altura) de baixo para cima, por dentro na volta
  const perfil = [
    [0.0, 0.0], [0.13, 0.0], [0.15, 0.03], [0.185, 0.2], [0.19, 0.3],
    [0.215, 0.31], [0.22, 0.345], [0.2, 0.355], [0.18, 0.33], [0.0, 0.33],
  ].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), toon(P.plantPot));
  vaso.position.y = 0.03 * s;
  g.add(vaso);
  // uma faixa clara na barriga do vaso
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.1885 * s, 0.186 * s, 0.035 * s, 28, 1, true), toon(P.cupula));
  faixa.position.y = (0.03 + 0.24) * s;
  g.add(faixa);
  const terra = new THREE.Mesh(new THREE.CircleGeometry(0.18 * s, 24), toon(P.terraDeVaso));
  terra.rotation.x = -Math.PI / 2;
  terra.position.y = (0.03 + 0.335) * s;
  g.add(terra);

  // as folhas
  const geo = folhaDeEspada();
  const folhas = new THREE.InstancedMesh(geo, toon(0xffffff, { doubleSide: true }), 9);
  const cores = [
    P.folhaEspada, P.folhaEspadaClara, P.folhaEspada, P.folhaEspadaBorda, P.folhaEspada,
    P.folhaEspadaClara, P.folhaEspada, P.folhaEspadaBorda, P.folhaEspadaClara,
  ];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + Math.sin(i * 7.3) * 0.3;
    const longe = i % 3 === 0 ? 0.03 : 0.08;
    // as do meio mais altas e em pé, as de fora mais baixas e abrindo
    const alto = (i % 3 === 0 ? 0.95 : 0.7 + (i % 2) * 0.12) * s;
    // gira a face (+Z) para fora do vaso, na direção `a`, e tomba para lá
    q.setFromEuler(new THREE.Euler(0, Math.PI / 2 - a, 0)).multiply(
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.08 + longe * 2.2),
    );
    m.compose(
      new THREE.Vector3(Math.cos(a) * longe * s, (0.03 + 0.335) * s, Math.sin(a) * longe * s),
      q,
      new THREE.Vector3(s, alto, s),
    );
    folhas.setMatrixAt(i, m);
    folhas.setColorAt(i, new THREE.Color(cores[i]));
  }
  folhas.instanceMatrix.needsUpdate = true;
  if (folhas.instanceColor) folhas.instanceColor.needsUpdate = true;
  g.add(folhas);
  return g;
}

/**
 * Uma folha de espada-de-são-jorge, de 1 m de altura (a planta escala), com a
 * base na origem e a face olhando para +Z: larga embaixo, mais larga um terço
 * acima, afinando até a ponta. Dobrada em calha (a beirada um pouco para a
 * frente da nervura) e curvada para +Z no alto, que é para fora do vaso.
 */
function folhaDeEspada(): THREE.BufferGeometry {
  const fatias = 14;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let k = 0; k <= fatias; k++) {
    const t = k / fatias;
    const largura = 0.09 * Math.sin(Math.PI * Math.pow(t, 0.7)) + 0.022 * (1 - t);
    const curva = 0.13 * t * t;
    for (const lado of [-1, 0, 1]) {
      const x = lado * largura;
      const calha = lado === 0 ? 0 : 0.018 * (1 - t);
      pos.push(x, t, curva + calha);
    }
  }
  for (let k = 0; k < fatias; k++) {
    for (let c = 0; c < 2; c++) {
      const a = k * 3 + c;
      const b = a + 3;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * A CAMA (a do quarto do Ari): estrado e cabeceira de madeira com veio,
 * colchão de canto arredondado, o edredom de matelassê caindo pelas beiradas,
 * o lençol dobrado por cima dele e dois travesseiros.
 *
 * Lençol e fronha ficam LISOS, de propósito: são o descanso do olho ao lado
 * do matelassê, e a mescla de tecido no branco virava mancha cinzenta.
 *
 * AS ALTURAS SÃO AS DA CAMA ANTIGA, e não por acaso: a cena de deitar
 * (`scenes/quarto.ts`) põe a âncora dos dois em cima do colchão contando com
 * o topo do edredom perto de 0,68. Mexer aqui é mexer lá.
 *
 * O EDREDOM NÃO É CAIXA. Caixa sobre caixa era o que fazia a cama parecer um
 * bloco: tecido de verdade dobra na quina do colchão e cai. Aqui ele é uma
 * folha (`edredom()`, abaixo) dobrada em volta do colchão, com a beirada
 * caindo nos lados e no pé — e o UV dela é o comprimento do pano em metros,
 * então os losangos do matelassê seguem a dobra sem esticar.
 */
export function bed(color: number = P.fabricBlue): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cama';
  const veio = veioDeMadeira();
  const madeira = (cor: number): THREE.Material => toon(cor, { mapa: veio });

  const base = new THREE.Mesh(new BoxGeometryMetro(1.5, 0.35, 2.1), madeira(P.woodDark));
  base.position.y = 0.2;
  g.add(base);

  const mattress = new THREE.Mesh(panoArredondado(1.44, 0.24, 2.0, 0.05), toon(P.lencol));
  mattress.position.y = 0.49;
  g.add(mattress);

  const duvet = new THREE.Mesh(
    edredom({ largura: 1.44, comprimento: 1.375, topo: 0.665, raio: 0.07, cai: 0.4 }),
    toon(color, { mapa: matelasse(), doubleSide: true }),
  );
  duvet.position.z = -0.375;
  duvet.name = 'edredom';
  g.add(duvet);

  // o lençol dobrado por cima da beirada de cima do edredom
  const dobra = new THREE.Mesh(panoArredondado(1.5, 0.06, 0.24, 0.028), toon(P.lencol));
  dobra.position.set(0, 0.675, -0.3);
  g.add(dobra);

  // dois travesseiros, um de cada lado, encostados na cabeceira
  for (const lado of [-1, 1] as const) {
    const travesseiro = new THREE.Mesh(
      panoArredondado(0.62, 0.15, 0.38, 0.07),
      toon(P.fronha),
    );
    travesseiro.position.set(lado * 0.36, 0.69, -0.76);
    travesseiro.rotation.set(-0.16, lado * 0.04, 0);
    g.add(travesseiro);
  }

  const head = new THREE.Mesh(new BoxGeometryMetro(1.55, 0.7, 0.12), madeira(P.wood));
  head.position.set(0, 0.6, -1.06);
  g.add(head);
  // o friso de cima da cabeceira: uma régua mais escura, um dedo mais larga
  const friso = new THREE.Mesh(new BoxGeometryMetro(1.61, 0.06, 0.16), madeira(P.woodDark));
  friso.position.set(0, 0.97, -1.06);
  g.add(friso);

  return g;
}

/**
 * Caixa de canto arredondado (colchão, travesseiro, lençol) com o UV em
 * metros, decidido por triângulo (ver `uvEmMetrosPorTriangulo`): o UV de
 * fábrica do `RoundedBoxGeometry` é de 0 a 1 por face, e qualquer textura
 * posta nele esticaria diferente em cada pedaço da quina.
 */
function panoArredondado(l: number, a: number, p: number, raio: number): THREE.BufferGeometry {
  return uvEmMetrosPorTriangulo(new RoundedBoxGeometry(l, a, p, 3, raio));
}

/** `BoxGeometry` que já nasce com o UV em metros (ver `uvEmMetros`). */
class BoxGeometryMetro extends THREE.BoxGeometry {
  constructor(l: number, a: number, p: number) {
    super(l, a, p);
    uvEmMetros(this);
  }
}

/**
 * A folha do edredom, dobrada em volta de um colchão.
 *
 * Nasce como um pano plano, medido em metros: `u` atravessa a largura (com a
 * sobra das duas beiradas) e `v` vai da cabeceira ao pé (com a sobra do pé).
 * Cada ponto do pano é então "dobrado": o que passa da largura do colchão faz
 * um quarto de volta de raio `raio` na quina e desce reto; o mesmo no pé. Nas
 * duas quinas do pé a ponta desce um pouco mais que as beiradas — que é como
 * a ponta de um edredom cai de verdade —, mas sem chegar ao chão.
 *
 * O meio estufa de leve (um dedo mais alto no centro que na beirada), senão a
 * folha sai lisa como tampo de mesa.
 *
 * Origem: o meio da beirada de CIMA do edredom, no chão; o pano anda para +Z.
 */
export function edredom(opts: {
  largura: number; comprimento: number; topo: number; raio: number; cai: number;
}): THREE.BufferGeometry {
  const { largura, comprimento, topo, raio, cai } = opts;
  const arco = (Math.PI / 2) * raio;
  const totalU = largura + cai * 2;
  const totalV = comprimento + cai;
  const geo = new THREE.PlaneGeometry(totalU, totalV, 48, 44);
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  /** a dobra de uma ponta: quanto anda para fora e quanto desce */
  const dobrar = (s: number): [number, number] => {
    if (s <= 0) return [s, 0];
    if (s < arco) {
      const t = s / raio;
      return [raio * Math.sin(t), raio * (1 - Math.cos(t))];
    }
    return [raio, raio + (s - arco)];
  };
  for (let i = 0; i < pos.count; i++) {
    // o PlaneGeometry nasce em XY: x é o `u`, e o `y` (de cima para baixo) vira o `v`
    const u = pos.getX(i);
    const v = totalV / 2 - pos.getY(i);
    const [fx, dx] = dobrar(Math.abs(u) - largura / 2);
    const [fz, dz] = dobrar(v - comprimento);
    const x = Math.sign(u) * (largura / 2 + fx);
    const z = comprimento + fz;
    const dentroX = Math.max(0, 1 - Math.abs(u) / (largura / 2));
    const dentroZ = Math.min(1, v / 0.25) * Math.max(0, Math.min(1, (comprimento - v) / 0.3));
    const estufa = 0.03 * Math.sin((dentroX * Math.PI) / 2) * dentroZ;
    // nas quinas do pé as duas dobras se encontram: a maior manda, e a menor
    // só puxa um pouco mais (somadas inteiras, a ponta furava o chão)
    const desce = Math.max(dx, dz) + 0.3 * Math.min(dx, dz);
    pos.setXYZ(i, x, topo - desce + estufa, z);
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

/**
 * A ESCRIVANINHA COM O COMPUTADOR (a do quarto do Ari).
 *
 * O monitor é o de sempre — a cena cola a tela de verdade nele (a área de
 * trabalho com a pasta do laboratório, 1,5 cm à frente do plano azul) —, e em
 * volta dele mora o resto do computador: pé de verdade, teclado com as teclas,
 * mouse no mousepad, duas caixinhas de som, a webcam em cima da tela, um
 * post-it colado na borda e o gabinete no chão, embaixo da mesa, com a
 * luzinha acesa. A frente da peça é +Z (onde senta quem usa); a mão do mouse
 * é +X, que é a direita de quem senta olhando a tela.
 */
export function desk(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'escrivaninha';
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.7), toon(P.wood));
  top.position.y = 0.74;
  g.add(top);
  for (const x of [-0.72, 0.72]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.66), toon(P.woodDark));
    leg.position.set(x, 0.37, 0);
    g.add(leg);
  }
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.06), toon(P.pcCorpo));
  monitor.position.set(0, 1.08, -0.18);
  g.add(monitor);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), flat(0x9fd8ff));
  glow.position.set(0, 1.08, -0.14);
  g.add(glow);
  // O pescoço do monitor, ATRÁS da tela. O pé antigo era um cone de 12 cm de
  // raio no meio do monitor: a boca dele passava da frente da tela e aparecia
  // como um triângulo escuro tapando a parte de baixo da área de trabalho.
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.03), toon(P.pcCorpo));
  stand.position.set(0, 0.88, -0.228);
  g.add(stand);
  g.add(computador());
  return g;
}

/** O resto do computador, em volta do monitor (ver `desk`). */
function computador(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'computador';
  const MESA = 0.78; // o tampo da escrivaninha
  const corpo = toon(P.pcCorpo);

  // o pé do monitor: uma base oval no tampo, e não o cilindro saindo da madeira
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.018, 20), corpo);
  base.scale.z = 0.62;
  base.position.set(0, MESA + 0.009, -0.2);
  g.add(base);

  // ------------------------------------------------------------ o teclado
  // A carcaça arredondada e as teclas num `InstancedMesh`: sessenta e poucas
  // teclas são UMA malha. Quatro fileiras de 13, mais a barra de espaço e as
  // teclas de canto num lilás mais forte, como teclado de gente que gosta de
  // teclado. Inclinado de leve para quem senta, como os pezinhos fazem.
  const teclado = new THREE.Group();
  teclado.position.set(-0.04, MESA, 0.13);
  teclado.rotation.x = 0.06;
  const LARG = 0.46;
  const PROF = 0.155;
  const carcaca = new THREE.Mesh(new RoundedBoxGeometry(LARG, 0.022, PROF, 2, 0.008), toon(P.pcTeclado));
  carcaca.position.y = 0.011;
  teclado.add(carcaca);
  const passo = 0.031;
  const tecla = new RoundedBoxGeometry(0.025, 0.012, 0.025, 1, 0.004);
  const comuns: THREE.Matrix4[] = [];
  const fortes: THREE.Matrix4[] = [];
  const m = (x: number, z: number, larg = 1): THREE.Matrix4 =>
    new THREE.Matrix4().compose(
      new THREE.Vector3(x, 0.026, z),
      new THREE.Quaternion(),
      new THREE.Vector3(larg, 1, 1),
    );
  const x0 = -LARG / 2 + 0.03;
  for (let fila = 0; fila < 4; fila++) {
    const z = -PROF / 2 + 0.026 + fila * passo;
    for (let k = 0; k < 13; k++) {
      const canto = k === 0 || k === 12;
      (canto ? fortes : comuns).push(m(x0 + k * passo + (fila % 2) * 0.008, z));
    }
  }
  // a fileira de baixo: dois cantos e a barra de espaço comprida
  const zBaixo = -PROF / 2 + 0.026 + 4 * passo;
  fortes.push(m(x0, zBaixo), m(x0 + 12 * passo, zBaixo));
  for (const k of [1, 2, 10, 11]) comuns.push(m(x0 + k * passo, zBaixo));
  comuns.push(m(x0 + 6 * passo, zBaixo, 6.4));
  for (const [lista, cor] of [[comuns, P.pcTecla], [fortes, P.pcTeclaForte]] as const) {
    const teclas = new THREE.InstancedMesh(tecla, toon(cor), lista.length);
    lista.forEach((mat, i) => teclas.setMatrixAt(i, mat));
    teclas.instanceMatrix.needsUpdate = true;
    teclado.add(teclas);
  }
  g.add(teclado);

  // ------------------------------------------------- o mouse no mousepad
  const pad = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.006, 0.19, 2, 0.003), toon(P.pcMousepad));
  pad.position.set(0.4, MESA + 0.003, 0.12);
  g.add(pad);
  const mouse = new THREE.Group();
  mouse.position.set(0.41, MESA + 0.006, 0.13);
  mouse.rotation.y = -0.18;
  const casco = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.pcTeclado));
  casco.scale.set(0.82, 0.62, 1.35);
  mouse.add(casco);
  // o risco entre os dois botões e a rodinha
  const risco = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.004, 0.03), toon(P.pcTeclaForte));
  risco.position.set(0, 0.02, -0.02);
  mouse.add(risco);
  const rodinha = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.005, 10), toon(P.pcCorpo));
  rodinha.rotation.z = Math.PI / 2;
  rodinha.position.set(0, 0.021, -0.016);
  mouse.add(rodinha);
  g.add(mouse);
  // o fio do mouse, uma curva macia até atrás do monitor
  const fio = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.41, MESA + 0.012, 0.085),
        new THREE.Vector3(0.39, MESA + 0.006, 0.0),
        new THREE.Vector3(0.3, MESA + 0.004, -0.12),
        new THREE.Vector3(0.12, MESA + 0.004, -0.26),
      ]),
      20, 0.0035, 5,
    ),
    toon(P.pcCorpo),
  );
  g.add(fio);

  // ------------------------------------------------- as caixinhas de som
  for (const lado of [-1, 1] as const) {
    const caixa = new THREE.Group();
    caixa.position.set(lado * 0.56, MESA, -0.17);
    caixa.rotation.y = -lado * 0.25;
    const gabinete = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.18, 0.1, 2, 0.012), corpo);
    gabinete.position.y = 0.09;
    caixa.add(gabinete);
    // o alto-falante: um anel claro e o miolo escuro, na frente
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.008, 18), toon(P.pcTecla));
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 0.075, 0.052);
    caixa.add(cone);
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 14), corpo);
    miolo.rotation.x = Math.PI / 2;
    miolo.position.set(0, 0.075, 0.056);
    caixa.add(miolo);
    const tweeter = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12), toon(P.pcTecla));
    tweeter.rotation.x = Math.PI / 2;
    tweeter.position.set(0, 0.145, 0.052);
    caixa.add(tweeter);
    g.add(caixa);
  }

  // --------------------------------------------- em cima e na borda da tela
  const webcam = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.03, 0.035, 2, 0.01), corpo);
  webcam.position.set(0, 1.348, -0.175);
  g.add(webcam);
  const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), toon(P.pcLed, { glow: 0.3 }));
  lente.rotation.x = Math.PI / 2;
  lente.position.set(0, 1.348, -0.155);
  g.add(lente);
  // o post-it, metade para fora da borda direita da tela, um pouco torto
  const postit = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.003), toon(P.pcPostit));
  postit.position.set(0.415, 1.2, -0.146);
  postit.rotation.z = -0.12;
  g.add(postit);

  // --------------------------------------- o gabinete, no chão, embaixo da mesa
  const torre = new THREE.Group();
  torre.position.set(-0.46, 0, 0.0);
  const caixaDoPc = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.44, 0.44, 2, 0.015), corpo);
  caixaDoPc.position.y = 0.23;
  torre.add(caixaDoPc);
  // os pezinhos, para ele não nascer do chão
  for (const z of [-0.16, 0.16]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.03), corpo);
    pe.position.set(0, 0.006, z);
    torre.add(pe);
  }
  // a frente: as grelhas de ventilação e a luzinha acesa (a que diz "ligado")
  for (let i = 0; i < 4; i++) {
    const grelha = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.008, 0.004), toon(P.pcGrelha));
    grelha.position.set(0, 0.32 - i * 0.03, 0.222);
    torre.add(grelha);
  }
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.008, 0.004), toon(P.pcLed, { glow: 0.9 }));
  led.position.set(0, 0.405, 0.222);
  torre.add(led);
  const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.006, 14), toon(P.pcLed, { glow: 0.6 }));
  botao.rotation.x = Math.PI / 2;
  botao.position.set(0, 0.375, 0.222);
  torre.add(botao);
  g.add(torre);
  return g;
}

export function chair(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), toon(color));
  seat.position.y = 0.46;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.07), toon(color));
  back.position.set(0, 0.75, -0.22);
  g.add(back);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.06), toon(P.woodDark));
    leg.position.set(x * 0.2, 0.23, z * 0.2);
    g.add(leg);
  }
  return g;
}

export function counter(width = 2.4): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.65), toon(P.wallMint));
  body.position.y = 0.45;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.08, 0.72), toon(P.concrete));
  top.position.y = 0.94;
  g.add(top);
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), toon(P.metalWhite));
  sink.position.set(width / 2 - 0.55, 0.97, 0);
  g.add(sink);
  return g;
}

export function fridge(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.7), toon(P.metalWhite));
  body.position.y = 0.9;
  g.add(body);
  const split = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.72), toon(P.metalGrey));
  split.position.y = 1.25;
  g.add(split);
  for (const y of [0.7, 1.45]) {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), toon(P.metalGrey));
    handle.position.set(0.3, y, 0.37);
    g.add(handle);
  }
  return g;
}

export function pottedPlant(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.17 * scale, 0.34 * scale, 10), toon(P.plantPot));
  pot.position.y = 0.17 * scale;
  g.add(pot);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 8, 6), toon(i % 2 ? P.leafMid : P.leafLight));
    leaf.scale.set(0.5, 1.5, 0.5);
    leaf.position.set(Math.cos(a) * 0.12 * scale, 0.6 * scale, Math.sin(a) * 0.12 * scale);
    leaf.rotation.z = Math.cos(a) * 0.4;
    leaf.rotation.x = -Math.sin(a) * 0.4;
    g.add(leaf);
  }
  return g;
}

/** Quadro na parede: monte com a cor que quiser e pendure com w.place(). */
export function pictureFrame(width = 0.7, height = 0.55, art: number = P.skyDusk): THREE.Group {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), toon(P.woodDark));
  g.add(frame);
  // decalque: a tela fica a 5 mm da frente da moldura, folga curta demais para
  // o buffer de profundidade decidir sozinho (ver `ToonOptions.decal`)
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.1, height - 0.1), flat(art, 1, true));
  canvas.position.z = 0.03;
  canvas.renderOrder = 1;
  g.add(canvas);
  return g;
}

/**
 * O quadro de memorias: placa de cortica com fotos pregadas por cima.
 *
 * As "fotos" nao mostram nada — sao retangulos brancos com um miolo colorido,
 * porque a esta distancia e do angulo da camera isometrica nada mais se leria.
 * O que a memoria mostra de verdade e o painel que abre no `w.interact`; aqui
 * o que importa e o objeto dizer de longe "tem lembranca pendurada nesta
 * parede", e para isso bastam quatro retangulos tortos e uma tachinha em cada.
 */
export function muralDeMemorias(largura = 1.3, altura = 1.0): THREE.Group {
  const g = new THREE.Group();

  const moldura = new THREE.Mesh(
    new THREE.BoxGeometry(largura, altura, 0.05),
    toon(P.woodDark),
  );
  g.add(moldura);

  /**
   * Daqui para baixo e tudo decalque, empilhado por `renderOrder`.
   *
   * O mural e a peca mais fina do jogo: a cortica fica a 5 mm da moldura, o
   * furo a 5 mm da cortica e o miolo da polaroide a 2 MM do papel. Nenhuma
   * dessas folgas sobrevive a um buffer de profundidade de celular — e a briga
   * por pixel aparece justo de perto, que e como se olha o quadro. Como
   * decalque nao grava profundidade, quem manda e a ordem de pintura abaixo, e
   * a tachinha (solida, `renderOrder` 0) continua tapando o que esta atras.
   */
  const placa = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.1, altura - 0.1),
    flat(P.cortica, 1, true),
  );
  placa.position.z = 0.03;
  placa.renderOrder = 1;
  g.add(placa);

  // os furos da cortica: so uns riscos escuros, para a placa nao ficar chapada
  for (let i = 0; i < 14; i++) {
    const furo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.018, 0.018),
      flat(P.corticaEscura, 1, true),
    );
    furo.renderOrder = 2;
    // espalhados por uma conta fixa: mural montado duas vezes tem que sair
    // igual, senao a foto do teste muda sozinha a cada build
    furo.position.set(
      (((i * 37) % 100) / 100 - 0.5) * (largura - 0.24),
      (((i * 61) % 100) / 100 - 0.5) * (altura - 0.24),
      0.035,
    );
    g.add(furo);
  }

  // as fotos pregadas, cada uma com a sua tachinha
  const fotos: Array<[number, number, number, number, number, number]> = [
    // x, y, largura, altura, giro, cor do miolo
    [-0.3, 0.2, 0.34, 0.28, 0.06, P.skyDusk],
    [0.26, 0.24, 0.3, 0.26, -0.09, P.water],
    [-0.24, -0.22, 0.3, 0.26, -0.05, P.flowerPink],
    [0.3, -0.2, 0.32, 0.24, 0.08, P.leafMid],
  ];
  const tachinhas = [P.heart, P.gold, P.frisbee, P.heart];

  fotos.forEach(([x, y, lw, lh, giro, cor], i) => {
    const foto = new THREE.Group();

    const papel = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), flat(P.metalWhite, 1, true));
    papel.renderOrder = 3;
    foto.add(papel);
    // a margem larga embaixo e o que faz o retangulo virar polaroide
    const miolo = new THREE.Mesh(
      new THREE.PlaneGeometry(lw - 0.06, lh - 0.1),
      flat(cor, 1, true),
    );
    miolo.position.set(0, 0.02, 0.002);
    miolo.renderOrder = 4;
    foto.add(miolo);

    const tachinha = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 8, 6),
      toon(tachinhas[i]),
    );
    tachinha.position.set(0, lh / 2 - 0.03, 0.012);
    foto.add(tachinha);

    foto.position.set(x, y, 0.04);
    foto.rotation.z = giro;
    g.add(foto);
  });

  return g;
}

/** Janela vazada numa parede: moldura + vidro translucido. */
export function windowFrame(width = 1.2, height = 1.2): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(width, height), flat(P.glass, 0.55));
  g.add(glass);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.08, 0.08), toon(P.metalWhite));
  bar.position.y = height / 2;
  g.add(bar);
  const bar2 = bar.clone();
  bar2.position.y = -height / 2;
  g.add(bar2);
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.08), toon(P.metalWhite));
    post.position.x = (side * width) / 2;
    g.add(post);
  }
  return g;
}

export function mug(color = 0xffffff): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.13, 10), toon(color));
  body.position.y = 0.065;
  g.add(body);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 6, 12), toon(color));
  handle.position.set(0.08, 0.07, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);
  return g;
}

export function diningTable(width = 1.5, depth = 0.9): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.09, depth), toon(P.wood));
  top.position.y = 0.75;
  g.add(top);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), toon(P.woodDark));
    leg.position.set(x * (width / 2 - 0.14), 0.37, z * (depth / 2 - 0.14));
    g.add(leg);
  }
  /**
   * A FLOREIRA VAI NUM GRUPO SEPARADO, e nao solta na mesa, porque ela DISPUTA
   * O CENTRO com o prato: a comida que o garcom serve pousa exatamente aqui, e
   * sem tirar o vaso o prato atravessa as flores.
   *
   * A mesa de patio do clube resolveu isso tirando o vasinho de vez. Aqui nao
   * dava: sao onze mesas, e um salao inteiro de mesas peladas fica pobre. Entao
   * a floreira fica, com nome e atalho em `userData` — quem serve comida nesta
   * mesa esconde ela enquanto dura a refeicao.
   */
  const floreira = new THREE.Group();
  floreira.name = 'floreira';
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.16, 10), toon(P.wallMint));
  vaso.position.y = 0.87;
  floreira.add(vaso);
  for (const side of [-1, 1]) {
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), toon(side < 0 ? P.flowerPink : P.flowerYellow));
    flor.position.set(side * 0.05, 1.03, 0);
    floreira.add(flor);
  }
  g.add(floreira);
  g.userData.floreira = floreira;
  return g;
}

export function floorLamp(lit = true): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.06, 12), toon(P.woodDark));
  base.position.y = 0.03;
  g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), toon(P.metalGrey));
  pole.position.y = 0.78;
  g.add(pole);
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.3, 0.34, 14, 1, true),
    toon(lit ? P.cupula : P.cupulaApagada, { glow: lit ? 0.5 : 0, doubleSide: true }),
  );
  shade.position.y = 1.68;
  shade.name = 'cupula';
  g.add(shade);
  return g;
}

/** Prateleira de parede: pendure com w.place(shelf(), x, altura, z, rot). */
export function wallShelf(width = 1.1): THREE.Group {
  const g = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, 0.24), toon(P.wood));
  g.add(board);
  const cores = [0xd9603f, 0x5cb04f, 0xffc94d];
  for (let i = 0; i < 3; i++) {
    const item = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.16), toon(cores[i]));
    item.position.set(-width / 2 + 0.2 + i * 0.16, 0.15, 0);
    g.add(item);
  }
  const planta = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), toon(P.leafMid));
  planta.position.set(width / 2 - 0.22, 0.16, 0);
  planta.scale.y = 0.8;
  g.add(planta);
  return g;
}

/** Armario aereo da cozinha. */
export function upperCabinets(width = 2.0): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.6, 0.34), toon(P.wallCream));
  g.add(body);
  for (const side of [-1, 1]) {
    const puxador = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), toon(P.metalGrey));
    puxador.position.set(side * width * 0.22, -0.18, 0.19);
    g.add(puxador);
  }
  return g;
}

export function washingMachine(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.9, 0.64), toon(P.metalWhite));
  corpo.position.y = 0.45;
  g.add(corpo);
  const porta = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), toon(0x9fb6c4));
  porta.position.set(0, 0.5, 0.33);
  porta.rotation.x = Math.PI / 2;
  g.add(porta);
  const vidro = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), toon(0x3b4650));
  vidro.position.set(0, 0.5, 0.36);
  vidro.rotation.x = Math.PI / 2;
  g.add(vidro);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.03), toon(0xdfe4e8));
  painel.position.set(0, 0.82, 0.33);
  g.add(painel);
  for (const x of [-0.2, 0, 0.2]) {
    const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), toon(P.metalGrey));
    botao.position.set(x, 0.82, 0.36);
    botao.rotation.x = Math.PI / 2;
    g.add(botao);
  }
  return g;
}

/** Porta com batente. Encaixe num vao de parede com w.place(). */
/**
 * Porta com batente, para encaixar num vão de parede.
 *
 * `profundidade` é a espessura do batente: mantenha MENOR que a espessura da
 * parede (0.3 no `w.wall`) e centre a porta na linha da parede. Batente com a
 * mesma espessura da parede deixa as faces coplanares e elas piscam.
 */
export function interiorDoor(
  cor: number = P.wood,
  largura = 0.9,
  altura = 2.1,
  profundidade = 0.24,
): THREE.Group {
  const g = new THREE.Group();
  /*
   * A FOLHA E A MAÇANETA MORAM NUMA DOBRADIÇA, na lateral esquerda: é o que
   * deixa a cena abrir a porta girando `dobradica.rotation.y` (positivo abre
   * para `-Z`, para dentro de quem olha a porta de frente). Achada pelo NOME
   * (`getObjectByName('dobradica')`), e não por `userData`: peça do kit é
   * clonada, e o clone copia `userData` como JSON.
   */
  const dobradica = new THREE.Group();
  dobradica.name = 'dobradica';
  dobradica.position.x = -largura / 2;
  g.add(dobradica);
  const folha = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.08), toon(cor));
  folha.position.set(largura / 2, altura / 2, 0);
  dobradica.add(folha);
  for (const side of [-1, 1]) {
    const batente = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, altura + 0.1, profundidade),
      toon(P.woodDark),
    );
    batente.position.set((side * (largura + 0.09)) / 2, (altura + 0.1) / 2, 0);
    g.add(batente);
  }
  const verga = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.2, 0.1, profundidade),
    toon(P.woodDark),
  );
  verga.position.y = altura + 0.05;
  g.add(verga);
  const maca = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), toon(P.gold, { glow: 0.15 }));
  maca.position.set(largura - 0.14, altura * 0.45, 0.07);
  dobradica.add(maca);
  return g;
}

/** Criado-mudo com abajur. */
/**
 * Armario de duas portas. A frente e o lado +Z, como todo movel do kit.
 *
 * A porta da direita fica entreaberta: um bloco liso de 1,6 x 2,1 na camera
 * isometrica vira um paralelepipedo sem leitura, e a fresta e o que diz que
 * aquilo abre.
 */
/**
 * O ARMÁRIO (o do quarto do Ari): carcaça OCA de madeira, duas portas
 * pintadas com moldura em relevo, duas gavetas embaixo, cornija em cima e,
 * pela porta da direita entreaberta, o lado de dentro — o fundo escuro, o
 * varão com as roupas penduradas nos cabides e a prateleira de cima com roupa
 * dobrada. Em cima dele, uma caixa organizadora.
 *
 * A primeira versão era um bloco maciço: a porta entreaberta mostrava a face
 * de madeira do próprio bloco, e o "vão escuro" de dentro ficava enterrado
 * atrás dela. Agora a peça é feita de tábuas (laterais, fundo, base, teto) e o
 * vão existe.
 *
 * O tamanho por fora não mudou (1,6 × 2,1 × 0,62): o colisor e o ponto de
 * abrir do quarto continuam valendo.
 */
export function armario(cor: number = P.wood, largura = 1.6, altura = 2.1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'armario';
  const prof = 0.62;
  const esp = 0.04;
  const madeira = toon(P.woodDark);
  const RODAPE = 0.08;
  const GAVETAS = 0.36; // altura da faixa das gavetas, contando o rodapé

  // ------------------------------------------------------------- carcaça
  // As tábuas se SOBREPÕEM um dedo em vez de encostar (ver a skill de peça):
  // as laterais entram 1 cm no teto, o fundo passa por trás delas.
  for (const lado of [-1, 1] as const) {
    const lateral = new THREE.Mesh(new THREE.BoxGeometry(esp, altura + 0.01, prof), madeira);
    lateral.position.set(lado * (largura / 2 - esp / 2), (altura + 0.01) / 2, 0);
    g.add(lateral);
  }
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(largura - esp, altura - RODAPE, 0.02), toon(P.armarioFundo));
  fundo.position.set(0, RODAPE + (altura - RODAPE) / 2, -prof / 2 + 0.005);
  g.add(fundo);
  // o rodapé, recuado, e o teto/cornija, que sobra um dedo para a frente e
  // para os lados
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura - esp * 2 - 0.004, RODAPE, prof - 0.06), madeira);
  rodape.position.set(0, RODAPE / 2, -0.02);
  g.add(rodape);
  const cornija = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.05, prof + 0.05), madeira);
  cornija.position.set(0, altura + 0.024, 0.01);
  g.add(cornija);
  // as prateleiras de dentro: o chão do vão, a divisão das gavetas e a de cima
  for (const y of [GAVETAS, altura - 0.38]) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(largura - esp * 2 - 0.004, 0.025, prof - 0.05), madeira);
    tabua.position.set(0, y, -0.015);
    g.add(tabua);
  }

  // ------------------------------------------------------------ as gavetas
  const larguraGaveta = (largura - esp * 2) / 2 - 0.012;
  for (const lado of [-1, 1] as const) {
    const frente = new THREE.Mesh(new THREE.BoxGeometry(larguraGaveta, GAVETAS - RODAPE - 0.03, 0.035), toon(cor));
    frente.position.set(lado * (larguraGaveta / 2 + 0.008), RODAPE + (GAVETAS - RODAPE) / 2, prof / 2 + 0.0175);
    g.add(frente);
    const puxador = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.022, 0.025), toon(P.metalGrey));
    puxador.position.set(lado * (larguraGaveta / 2 + 0.008), RODAPE + (GAVETAS - RODAPE) / 2 + 0.03, prof / 2 + 0.047);
    g.add(puxador);
  }

  // -------------------------------------------------- dentro, pela fresta
  const VARAO = altura - 0.5;
  const varao = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, largura - esp * 2, 8), toon(P.metalGrey));
  varao.rotation.z = Math.PI / 2;
  varao.position.set(0, VARAO, 0);
  g.add(varao);
  // As roupas, de lado no varão (finas em x, largas em z), cada uma no seu
  // cabide. Ficam quase todas na metade da DIREITA, que é a que se vê pela
  // porta aberta; a da esquerda fica atrás da porta fechada.
  const cabide = new THREE.TorusGeometry(0.075, 0.006, 4, 14, Math.PI);
  const roupas: Array<[number, number, number]> = [
    [0.08, P.roupaLa, 0.78], [0.2, P.roupaListra, 0.62], [0.31, P.pcPostit, 0.7],
    [0.42, P.wallMint, 0.9], [0.53, P.roupaLaBarra, 0.66], [0.64, P.fabricBlue, 0.74],
    [-0.3, P.flowerPink, 0.8], [-0.5, P.roupaListraManga, 0.7],
  ];
  for (const [x, corDaRoupa, comprimento] of roupas) {
    const pendurada = new THREE.Group();
    pendurada.position.set(x, VARAO, 0);
    // um tiquinho torta, como roupa de verdade num varão
    pendurada.rotation.y = Math.sin(x * 13) * 0.12;
    const arco = new THREE.Mesh(cabide, toon(P.metalGrey));
    arco.rotation.y = Math.PI / 2;
    arco.position.y = -0.075;
    arco.rotation.z = 0;
    pendurada.add(arco);
    // a peça: ombro largo e arredondado em cima, caindo reta
    const peca = new THREE.Mesh(new RoundedBoxGeometry(0.035, comprimento, 0.4, 2, 0.015), toon(corDaRoupa));
    peca.position.y = -0.09 - comprimento / 2;
    pendurada.add(peca);
    g.add(pendurada);
  }
  // a prateleira de cima: duas pilhas de roupa dobrada
  for (const [x, cores] of [[0.18, [P.roupaListra, P.roupaLaBarra, P.roupaLa]], [0.5, [P.wallMint, P.flowerPink]]] as const) {
    cores.forEach((c, i) => {
      const dobrada = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.06, 0.3, 2, 0.02), toon(c));
      dobrada.position.set(x + (i % 2) * 0.01, altura - 0.38 + 0.0125 + 0.03 + i * 0.058, 0);
      dobrada.rotation.y = (i - 1) * 0.04;
      g.add(dobrada);
    });
  }

  // ------------------------------------------------------------ as portas
  const meia = largura / 2 - esp;
  const altPorta = altura - GAVETAS - 0.03;
  const yPorta = GAVETAS + 0.015 + altPorta / 2;
  for (const lado of [-1, 1] as const) {
    // pivô na dobradiça, para a porta girar a partir da lateral
    const eixo = new THREE.Group();
    eixo.position.set(lado * meia, yPorta, prof / 2 + 0.003);
    if (lado > 0) eixo.rotation.y = -0.62; // a da direita, entreaberta
    g.add(eixo);

    const larg = meia - 0.006;
    const folha = new THREE.Mesh(new THREE.BoxGeometry(larg, altPorta, 0.035), toon(cor));
    folha.position.set(-lado * larg / 2, 0, 0.0175);
    eixo.add(folha);
    // A moldura em relevo: quatro réguas formando a almofada da porta. As em
    // pé ficam ENTRE as deitadas e são 4 mm mais grossas — com a mesma
    // espessura e cruzando nas quinas, as faces da frente caíam no mesmo plano.
    const margem = 0.07;
    const regua = 0.025;
    const xm = -lado * larg / 2;
    for (const [w, h, dx, dy, d] of [
      [larg - margem * 2 + regua, regua, 0, altPorta / 2 - margem, 0.012],
      [larg - margem * 2 + regua, regua, 0, -altPorta / 2 + margem, 0.012],
      [regua, altPorta - margem * 2 - regua, -(larg / 2 - margem), 0, 0.016],
      [regua, altPorta - margem * 2 - regua, larg / 2 - margem, 0, 0.016],
    ] as const) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toon(cor));
      // as em pé entram 1 mm na folha, para as costas também não coincidirem
      r.position.set(xm + dx, dy, 0.035 + d / 2 - (d > 0.012 ? 0.001 : 0));
      eixo.add(r);
    }
    // o puxador comprido, em pé, entre a moldura e a junta das duas portas
    // (em cima da régua da moldura, as faces dos dois coincidiam)
    const xPux = -lado * (larg - 0.033);
    const puxador = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.32, 8), toon(P.metalGrey));
    puxador.position.set(xPux, 0, 0.074);
    eixo.add(puxador);
    for (const dy of [-0.13, 0.13]) {
      const apoio = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, 0.04), toon(P.metalGrey));
      apoio.position.set(xPux, dy, 0.054);
      eixo.add(apoio);
    }
  }

  // ------------------------------------------------ em cima: a caixa
  const caixa = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.22, 0.36, 2, 0.02), toon(P.armarioCaixa));
  caixa.position.set(-0.35, altura + 0.049 + 0.11, 0);
  caixa.rotation.y = 0.06;
  g.add(caixa);
  const tampa = new THREE.Mesh(new RoundedBoxGeometry(0.53, 0.04, 0.39, 2, 0.015), toon(P.armarioCaixa));
  tampa.position.set(-0.35, altura + 0.049 + 0.225, 0);
  tampa.rotation.y = 0.06;
  g.add(tampa);
  return g;
}

/**
 * Espelho de corpo inteiro, encostado na parede.
 *
 * Nao reflete nada: reflexao de verdade pede uma segunda passada de render, e o
 * jogo inteiro e toon chapado. O vidro e um plano claro e translucido, que na
 * luz do quarto le como espelho sem custar nada.
 */
export function espelho(cor: number = P.wood, altura = 1.7): THREE.Group {
  const g = new THREE.Group();
  const larg = 0.62;

  const moldura = new THREE.Mesh(
    new THREE.BoxGeometry(larg, altura, 0.07),
    toon(cor),
  );
  moldura.position.y = altura / 2;
  g.add(moldura);

  const vidro = new THREE.Mesh(
    new THREE.BoxGeometry(larg - 0.14, altura - 0.16, 0.03),
    toon(P.glass, { opacity: 0.72, glow: 0.12 }),
  );
  vidro.position.set(0, altura / 2, 0.04);
  g.add(vidro);

  // encosta na parede com uma inclinacao de leve
  g.rotation.x = -0.05;
  return g;
}

export function nightstand(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.4), toon(P.wood));
  corpo.position.y = 0.25;
  g.add(corpo);
  const gaveta = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.03), toon(P.woodDark));
  gaveta.position.set(0, 0.32, 0.21);
  g.add(gaveta);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.16, 8), toon(P.metalGrey));
  base.position.y = 0.58;
  g.add(base);
  const cupula = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.15, 0.18, 12, 1, true),
    toon(P.cupula, { glow: 0.45, doubleSide: true }),
  );
  cupula.position.y = 0.75;
  cupula.name = 'cupula';
  g.add(cupula);
  return g;
}

/* ========================================================================
 * MANIA DE CHURRASCO — o que sobrou aqui do kit do restaurante por dentro.
 *
 * As peças do Mania (churrasqueira, fogão, pia, bancadas, balcões, bar,
 * banquetas, luz, mesas) moram em `world/moveisDoMania.ts` desde a reforma do
 * salão. Ficaram aqui o quadro de giz (a escola também usa) e o retrato do
 * Walter pintado em canvas (`pintarOWalter`, que o quadro novo do empregado
 * do mês reaproveita).
 * ===================================================================== */

/**
 * QUADRO DE GIZ com o cardápio do dia. O texto sai de um canvas em tempo de
 * execução — a mesma exceção do letreiro das placas, nenhum arquivo entra.
 */
export function quadroDeGiz(
  linhas: readonly string[], largura = 1.6, altura = 1.2, cor: number = P.churrascoQuadroNegro,
): THREE.Group {
  const g = new THREE.Group();
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.06), toon(P.woodDark));
  g.add(moldura);
  const lousa = new THREE.Mesh(
    new THREE.BoxGeometry(largura - 0.12, altura - 0.12, 0.03), toon(cor),
  );
  lousa.position.z = 0.03;
  g.add(lousa);

  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = Math.round((384 * (altura - 0.16)) / (largura - 0.16));
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const passo = canvas.height / (linhas.length + 0.6);
    linhas.forEach((linha, i) => {
      const titulo = i === 0;
      ctx.fillStyle = titulo ? '#ffe9a8' : '#f4f1e6';
      ctx.font = `${titulo ? 'bold ' : ''}${Math.round(passo * (titulo ? 0.62 : 0.46))}px ui-rounded, "Nunito", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(linha, canvas.width / 2, passo * (i + 0.7));
    });
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const escrita = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.16, altura - 0.16),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
  escrita.position.z = 0.05;
  g.add(escrita);
  return g;
}

/** O retrato: a cabeca do Walter de frente, com a faixa e o nome. */
export function pintarOWalter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  css: (cor: number) => string,
): void {
  // ------------------------------------------------------------ o fundo
  ctx.fillStyle = css(P.churrascoParede);
  ctx.fillRect(0, 0, w, h);

  // a faixa do titulo, no alto
  ctx.fillStyle = css(P.churrascoQuadroNegro);
  ctx.fillRect(0, 0, w, h * 0.13);
  ctx.fillStyle = css(P.churrascoBrasaViva);
  ctx.font = `bold ${Math.round(h * 0.052)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMPREGADO DO MÊS', w / 2, h * 0.066);

  // o oval do retrato, num tom quente
  const cx = w / 2;
  const cy = h * 0.45;
  const rx = w * 0.37;
  const ry = h * 0.25;
  ctx.fillStyle = css(P.churrascoTijolo);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00000018';
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.012, rx * 0.94, ry * 0.94, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---------------------------------------------------------- o cachorro
  const R = w * 0.19;   // o raio da cabeca, e a regua de tudo abaixo

  /**
   * A GRAVATA VEM PRIMEIRO, porque ela fica atras do queixo — e vem BAIXA, em
   * `R * 1,08`. Na primeira versao ela estava em `0,92` e a linguinha, que vai
   * ate `R * 0,81`, cobria o no e as duas asas: sobrava um borrao vermelho onde
   * era para ter uma gravata borboleta.
   */
  ctx.fillStyle = css(P.gravataBorboleta);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + R * 1.08);
    ctx.lineTo(cx + lado * R * 0.66, cy + R * 0.84);
    ctx.lineTo(cx + lado * R * 0.66, cy + R * 1.32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = css(P.gravataNo);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 1.08, R * 0.15, R * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // as orelhas caidas, uma de cada lado, ANTES da cabeca para ficarem atras
  ctx.fillStyle = css(P.cachorroOrelha);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.9, cy + R * 0.2, R * 0.34, R * 0.68, lado * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }

  // a cabeca
  ctx.fillStyle = css(P.cachorroPelo);
  ctx.beginPath();
  ctx.ellipse(cx, cy - R * 0.06, R * 0.86, R * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // o focinho claro
  ctx.fillStyle = css(P.cachorroPeito);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.36, R * 0.44, R * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();

  // a linguinha de fora, que e o que faz o retrato ser FOFO e nao 3x4
  ctx.fillStyle = css(P.churrascoToalha);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.62, R * 0.15, R * 0.19, 0, 0, Math.PI * 2);
  ctx.fill();

  // o nariz
  ctx.fillStyle = css(P.cachorroFocinho);
  ctx.beginPath();
  ctx.ellipse(cx, cy + R * 0.22, R * 0.17, R * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(1, R * 0.055);
  ctx.strokeStyle = css(P.cachorroFocinho);
  ctx.beginPath();
  ctx.moveTo(cx, cy + R * 0.33);
  ctx.lineTo(cx, cy + R * 0.46);
  ctx.stroke();

  // os olhos, com o brilhinho
  for (const lado of [-1, 1]) {
    ctx.fillStyle = css(P.cachorroFocinho);
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.34, cy - R * 0.16, R * 0.12, R * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.3, cy - R * 0.22, R * 0.045, R * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // as sobrancelhas claras: sao elas que dao EXPRESSAO a um focinho simetrico
  ctx.fillStyle = css(P.cachorroPeito);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + lado * R * 0.36, cy - R * 0.42, R * 0.14, R * 0.07, lado * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // ------------------------------------------------------------- o nome
  ctx.fillStyle = css(P.churrascoQuadroNegro);
  ctx.font = `bold ${Math.round(h * 0.085)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillText('WALTER', w / 2, h * 0.795);
  ctx.font = `${Math.round(h * 0.037)}px ui-rounded, "Nunito", system-ui, sans-serif`;
  ctx.fillStyle = css(P.churrascoFaixa);
  ctx.fillText('garçom · atendimento nota 10', w / 2, h * 0.862);

  // as estrelinhas embaixo, o carimbo de que ele ganhou
  ctx.fillStyle = css(P.churrascoBrasaViva);
  for (let i = 0; i < 5; i++) {
    estrela(ctx, w * (0.3 + i * 0.1), h * 0.94, h * 0.023);
  }
}

/** Uma estrela de cinco pontas, cheia. */
function estrela(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const raio = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(ang) * raio;
    const y = cy + Math.sin(ang) * raio;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/* ============================================================================
 *                     O MIOLO DA LOJINHA DE ROUPAS
 *
 * As peças de dentro da loja da Estella moravam aqui até a segunda reforma.
 * Hoje elas têm arquivo próprio: `world/moveisDaBoutique.ts` (araras,
 * provadores, balcão, bustos, estantes, estofados, luz), `world/roupasNaArara.ts`
 * (as peças do catálogo penduradas, em instância) e `world/escadaRolante.ts`.
 * ========================================================================== */

// ===================================================== A ESCOLA DO GATITO
//
// As peças da escola: o saguão (armários, a escadaria, a vitrine de troféus),
// o refeitório, as salas de aula, a sala de descanso, a dos professores e o
// ginásio. Toda peça olha para `+Z` e nasce com a base em `y = 0`, como o resto
// do kit. O plano da escola está em `docs/ESCOLA.md`.

/**
 * Uma pintura em `<canvas>` num plano, para placa, cartaz e bandeira.
 *
 * É a mesma técnica do `quadroDeGiz` e do `letreiro`: o desenho é código, e
 * nenhum arquivo de imagem entra no repositório. A resolução acompanha a
 * proporção do plano, para a letra não sair esticada.
 */
function pinturaEmCanvas(
  largura: number, altura: number,
  pintar: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  px = 512,
): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = Math.max(32, Math.round((px * altura) / largura));
  const ctx = canvas.getContext('2d');
  if (ctx) pintar(ctx, canvas.width, canvas.height);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
}

/** a fonte arredondada de toda placa do jogo */
const fonteRedonda = (px: number, negrito = true): string =>
  `${negrito ? 'bold ' : ''}${Math.round(px)}px ui-rounded, "Nunito", system-ui, sans-serif`;

/** Escreve centrado, encolhendo a letra até caber na largura. */
function escreverCabendo(
  ctx: CanvasRenderingContext2D, texto: string, x: number, y: number, larguraMax: number, px: number, negrito = true,
): void {
  let tamanho = px;
  ctx.font = fonteRedonda(tamanho, negrito);
  while (tamanho > 8 && ctx.measureText(texto).width > larguraMax) {
    tamanho -= 2;
    ctx.font = fonteRedonda(tamanho, negrito);
  }
  ctx.fillText(texto, x, y);
}

/**
 * ARMÁRIOS DE ESCOLA, a fileira de portinhas com as grades de ventilação — a
 * peça que mais diz "corredor de escola" de longe.
 *
 * O corpo é UM bloco só, e as portas são placas por cima dele com uma fresta
 * entre uma e outra: é a fresta escura que conta as portas. As cores vêm numa
 * lista e se revezam (azul e amarelo, as duas cores da escola).
 *
 * Nenhuma face encosta em outra do mesmo lado: o rodapé é mais raso que o
 * corpo, e o chapéu de cima é mais largo e mais fundo.
 */
export function armariosDeEscola(
  portas = 5, cores: readonly number[] = [P.escolaArmarioAzul, P.escolaArmarioAmarelo],
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'armarios-de-escola';
  const L = 0.46;
  const A = 1.86;
  const F = 0.46;
  const largura = portas * L;

  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, A - 0.08, F), toon(P.escolaArmarioPorta));
  corpo.position.y = 0.08 + (A - 0.08) / 2;
  g.add(corpo);
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.04, 0.08, F - 0.06), toon(P.woodDark));
  rodape.position.y = 0.04;
  g.add(rodape);
  const chapeu = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.04, 0.05, F + 0.04), toon(P.escolaArmarioPorta));
  chapeu.position.y = A + 0.025;
  g.add(chapeu);

  const grade = toon(P.escolaArmarioPorta);
  const metal = toon(P.metalGrey);
  for (let i = 0; i < portas; i++) {
    const x = -largura / 2 + L * (i + 0.5);
    const porta = new THREE.Mesh(new THREE.BoxGeometry(L - 0.04, A - 0.2, 0.025), toon(cores[i % cores.length]));
    porta.position.set(x, 0.1 + (A - 0.2) / 2 + 0.02, F / 2 + 0.012);
    g.add(porta);
    // a grade de ventilação: três risquinhos escuros perto do alto
    for (let r = 0; r < 3; r++) {
      const risco = new THREE.Mesh(new THREE.BoxGeometry(L - 0.16, 0.022, 0.01), grade);
      risco.position.set(x, A - 0.28 - r * 0.06, F / 2 + 0.029);
      g.add(risco);
    }
    const trinco = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.03), metal);
    trinco.position.set(x + L / 2 - 0.09, 0.98, F / 2 + 0.035);
    g.add(trinco);
    // a plaquinha do número, um retângulo claro
    const numero = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.01), toon(P.metalWhite));
    numero.position.set(x, A - 0.52, F / 2 + 0.029);
    g.add(numero);
  }
  return g;
}

/**
 * A ESCADARIA DO SAGUÃO: dois lances que sobem das pontas e se encontram num
 * patamar no meio, encostados na parede do fundo — a escada de escola de filme.
 *
 * Por enquanto ela não leva a lugar nenhum (pedido do Renan): o patamar para
 * numa porta fechada na parede, que a cena põe. A peça é MACIÇA — cada degrau é
 * um bloco do chão até o piso dele — porque vazada ela pediria o avesso dos
 * degraus, e ninguém vê o avesso de uma escada encostada na parede.
 *
 * Correndo no X, com o fundo (`-Z`) contra a parede e o corrimão na frente
 * (`+Z`), que é o lado da câmera. O lance da esquerda sobe para `+X`, o da
 * direita sobe para `-X`, e os dois chegam ao patamar em `x = ±patamar/2`.
 *
 * Os pisos de madeira são um tico mais largos que o bloco (na frente e atrás)
 * e avançam 3 cm sobre o degrau de baixo: é esse bocel que desenha a serrilha,
 * e é ele que mantém as faces do piso fora do plano das faces do bloco.
 */
export function escadariaDoSaguao(
  altura = 3.2, lance = 5.6, larguraLance = 2.2, patamar = 4, cor: number = P.escolaCorrimao,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'escadaria';
  const n = Math.round(altura / 0.19);
  const espelho = altura / n;
  const piso = lance / n;
  const L = larguraLance;
  const bloco = toon(cor);
  const madeira = toon(P.escolaDegrau);
  const corrimao = toon(P.escolaRodape);
  const metal = toon(P.metalGrey);

  // o patamar: um bloco do chão até o alto, com o piso de madeira por cima
  const base = new THREE.Mesh(new THREE.BoxGeometry(patamar, altura, L), bloco);
  base.position.y = altura / 2;
  g.add(base);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(patamar + 0.02, 0.05, L + 0.04), madeira);
  tampo.position.y = altura + 0.025;
  g.add(tampo);
  // um painel de rodapé azul na frente do patamar, para ele não ser um muro liso
  const faixa = new THREE.Mesh(new THREE.BoxGeometry(patamar - 0.3, altura - 0.5, 0.02), toon(P.escolaParedeAzul));
  faixa.position.set(0, (altura - 0.5) / 2 + 0.2, L / 2 + 0.01);
  g.add(faixa);

  for (const lado of [-1, 1]) {
    // lado -1 = lance da esquerda, que sobe para +X; +1 = o da direita
    const x0 = lado * (patamar / 2 + lance);
    for (let i = 1; i <= n; i++) {
      const h = espelho * i;
      // o i-ésimo degrau, contado de baixo: fica entre `x0` e o patamar
      const xc = x0 - lado * piso * (i - 0.5);
      const degrau = new THREE.Mesh(new THREE.BoxGeometry(piso, h, L), bloco);
      degrau.position.set(xc, h / 2, 0);
      g.add(degrau);
      const tabua = new THREE.Mesh(new THREE.BoxGeometry(piso + 0.03, 0.045, L + 0.04), madeira);
      // o bocel avança para o lado de baixo (o lado de `x0`)
      tabua.position.set(xc + lado * 0.015, h + 0.0225, 0);
      g.add(tabua);
    }

    // O CORRIMÃO, na frente: pilaretes e um tubo inclinado por cima deles
    const zc = L / 2 - 0.08;
    const pilaretes = 5;
    for (let k = 0; k <= pilaretes; k++) {
      const f = k / pilaretes;
      const x = x0 - lado * lance * f;
      const chao = Math.max(espelho, altura * f);
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 6), metal);
      pil.position.set(x, chao + 0.475, zc);
      g.add(pil);
    }
    const comp = Math.hypot(lance, altura);
    const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, comp, 8), corrimao);
    tubo.position.set(x0 - lado * lance / 2, altura / 2 + 0.95, zc);
    // o tubo nasce em pé (no Y): deitar na direção (lance, altura) do lance
    tubo.rotation.z = lado * Math.atan2(lance, altura);
    g.add(tubo);
  }

  // o guarda-corpo do patamar, na frente dele
  const zc = L / 2 - 0.08;
  for (let k = 0; k <= 4; k++) {
    const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 6), metal);
    pil.position.set(-patamar / 2 + (patamar * k) / 4, altura + 0.475, zc);
    g.add(pil);
  }
  const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, patamar, 8), corrimao);
  barra.rotation.z = Math.PI / 2;
  barra.position.set(0, altura + 0.95, zc);
  g.add(barra);
  return g;
}

/** Um troféu de taça: pedestal, haste, a taça e as duas alças. */
function tacinha(escala = 1, gato = false): THREE.Group {
  const g = new THREE.Group();
  const ouro = toon(P.trofeuOuro);
  const pe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.14), toon(P.trofeuPedestal));
  pe.position.y = 0.03;
  g.add(pe);
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 0.1, 8), ouro);
  haste.position.y = 0.11;
  g.add(haste);
  const taca = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.035, 0.13, 12), ouro);
  taca.position.y = 0.225;
  g.add(taca);
  for (const lado of [-1, 1]) {
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 5, 10, Math.PI), ouro);
    alca.position.set(lado * 0.085, 0.235, 0);
    alca.rotation.z = -lado * Math.PI / 2;
    g.add(alca);
  }
  if (gato) {
    // o troféu dos Gatitos: uma cabecinha de gato em cima da taça
    const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), ouro);
    cabeca.position.y = 0.33;
    g.add(cabeca);
    for (const lado of [-1, 1]) {
      const orelha = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 6), ouro);
      orelha.position.set(lado * 0.03, 0.38, 0);
      orelha.rotation.z = -lado * 0.3;
      g.add(orelha);
    }
  }
  g.scale.setScalar(escala);
  return g;
}

/**
 * A VITRINE DE TROFÉUS do saguão: armário baixo embaixo, prateleiras com as
 * taças em cima, e um vidro bem de leve na frente.
 *
 * O vidro é quase invisível de propósito — é o que deixa as taças à vista (a
 * lição do quiosque: vidro fechado some no toon e tapa o que está dentro). O
 * que diz "vitrine" é a moldura e o reflexo em diagonal.
 */
export function vitrineDeTrofeus(largura = 2.2): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'vitrine-de-trofeus';
  const F = 0.5;
  const madeira = toon(P.woodDark);
  const base = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.8, F), toon(P.wood));
  base.position.y = 0.4;
  g.add(base);
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.1, 1.3, 0.04), toon(P.escolaRodape));
  fundo.position.set(0, 0.8 + 0.65, -F / 2 + 0.04);
  g.add(fundo);
  // as laterais e o chapéu: moldura grossa, mais funda que o armário de baixo
  for (const lado of [-1, 1]) {
    const lat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.36, F + 0.02), madeira);
    lat.position.set(lado * (largura / 2 - 0.03), 0.8 + 0.68, 0);
    g.add(lat);
  }
  const chapeu = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.08, F + 0.06), madeira);
  chapeu.position.y = 2.2;
  g.add(chapeu);

  const vidroMat = toon(P.glass, { opacity: 0.16 });
  const prateleira = toon(P.glass, { opacity: 0.5 });
  for (const [y, itens] of [
    [0.82, [[-0.7, 1.15, false], [-0.2, 1.5, true], [0.35, 1.1, false], [0.75, 0.9, false]]],
    [1.42, [[-0.6, 0.85, false], [-0.1, 1.0, false], [0.5, 1.2, false]]],
  ] as const) {
    if (y > 1) {
      const tabua = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.14, 0.025, F - 0.1), prateleira);
      tabua.position.set(0, y - 0.015, 0);
      g.add(tabua);
    }
    for (const [x, esc, gato] of itens) {
      const t = tacinha(esc, gato);
      t.position.set(x * (largura / 2.2), y, 0.02);
      g.add(t);
    }
  }
  const vidro = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.12, 1.3, 0.015), vidroMat);
  vidro.position.set(0, 0.8 + 0.66, F / 2 - 0.01);
  g.add(vidro);
  // o reflexo: duas faixas brancas em diagonal, que é como vidro se lê
  for (const dx of [-0.35, -0.15]) {
    const brilho = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.004), toon(0xffffff, { opacity: 0.45 }));
    brilho.position.set(dx * largura, 1.5, F / 2 + 0.002);
    brilho.rotation.z = -0.5;
    g.add(brilho);
  }
  return g;
}

/**
 * MESA DE REFEITÓRIO, a comprida com os dois bancos presos — a mesa de
 * escola de filme.
 *
 * As medidas batem com a mesa de piquenique (tampo em 0,78, assento em 0,47,
 * banco a 0,74 do meio), para a mesma âncora de sentar servir nas duas.
 */
export function mesaDeRefeitorio(comprimento = 3.2, cor: number = P.escolaArmarioAzul): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-refeitorio';
  const metal = toon(P.metalGrey);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(comprimento, 0.06, 0.92), toon(P.metalWhite));
  tampo.position.y = 0.75;
  g.add(tampo);
  // a borda colorida, um tico mais baixa e mais larga que o tampo
  const borda = new THREE.Mesh(new THREE.BoxGeometry(comprimento + 0.03, 0.035, 0.95), toon(cor));
  borda.position.y = 0.705;
  g.add(borda);
  for (const lado of [-1, 1]) {
    const assento = new THREE.Mesh(new THREE.BoxGeometry(comprimento - 0.1, 0.06, 0.34), toon(cor));
    assento.position.set(0, 0.44, lado * 0.74);
    g.add(assento);
  }
  // os cavaletes: um de cada ponta, segurando mesa e bancos juntos
  for (const ponta of [-1, 1]) {
    const x = ponta * (comprimento / 2 - 0.35);
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), metal);
    pe.position.set(x, 0.36, 0);
    g.add(pe);
    const travessa = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.56), metal);
    travessa.position.set(x, 0.38, 0);
    g.add(travessa);
    for (const lado of [-1, 1]) {
      const pezinho = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), metal);
      pezinho.position.set(x, 0.2, lado * 0.74);
      g.add(pezinho);
    }
  }
  return g;
}

/**
 * O BALCÃO DO REFEITÓRIO: o bufê de escola, com as cubas do prato feito e o
 * trilho de bandeja correndo na frente.
 *
 * As cubas ficam ABERTAS (a lição do quiosque: vidro fechado por cima de
 * comida some no toon e tapa o que está dentro). Não tem ninguém servindo
 * ainda — o Renan vai pôr um personagem novo aqui depois.
 */
export function balcaoDeRefeitorio(largura = 6): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'balcao-de-refeitorio';
  const F = 0.85;
  const inox = toon(P.churrascoInox);
  const inoxEscuro = toon(P.churrascoInoxEscuro);
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.88, F), toon(P.escolaParedeAzul));
  corpo.position.y = 0.44;
  g.add(corpo);
  // a faixa de inox na frente do corpo, e o tampo por cima de tudo
  const saia = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.2, 0.3, 0.02), inoxEscuro);
  saia.position.set(0, 0.2, F / 2 + 0.01);
  g.add(saia);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.05, F + 0.06), inox);
  tampo.position.y = 0.905;
  g.add(tampo);

  // as cubas: caixinha de inox com a comida um tico abaixo da borda
  const comidas = [P.refeitorioArroz, P.refeitorioFeijao, P.refeitorioMacarrao, P.refeitorioFrango, P.refeitorioSalada, P.laranja];
  const n = Math.max(3, Math.floor((largura - 1.4) / 0.62));
  for (let i = 0; i < n; i++) {
    const x = -largura / 2 + 0.55 + i * 0.62;
    const cuba = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.42), inoxEscuro);
    cuba.position.set(x, 0.98, -0.05);
    g.add(cuba);
    const comida = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.36), toon(comidas[i % comidas.length]));
    comida.position.set(x, 1.025, -0.05);
    g.add(comida);
    // um monte no meio de cada cuba, para ler como comida e não como tinta
    const monte = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), toon(comidas[i % comidas.length]));
    monte.scale.set(1.3, 0.35, 1);
    monte.position.set(x, 1.04, -0.05);
    g.add(monte);
  }

  // o trilho de bandeja: três tubos na frente, em mãos-francesas
  for (let k = 0; k < 3; k++) {
    const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, largura - 0.3, 6), inox);
    tubo.rotation.z = Math.PI / 2;
    tubo.position.set(0, 0.84, F / 2 + 0.12 + k * 0.1);
    g.add(tubo);
  }
  for (const x of [-largura / 2 + 0.3, 0, largura / 2 - 0.3]) {
    const mao = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.34), inoxEscuro);
    mao.position.set(x, 0.82, F / 2 + 0.17);
    g.add(mao);
  }

  // a pilha de bandejas na ponta da direita
  for (let k = 0; k < 6; k++) {
    const bandeja = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, 0.34), toon(P.refeitorioBandeja));
    bandeja.position.set(largura / 2 - 0.4, 0.94 + k * 0.024, 0.12);
    g.add(bandeja);
  }
  return g;
}

/**
 * MÁQUINA DE LANCHES: a de moedinha, com as fileiras de pacotinho coloridos
 * atrás do vidro e o teclado do lado.
 */
export function maquinaDeLanches(cor: number = P.escolaFaixa): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'maquina-de-lanches';
  const L = 0.95;
  const A = 1.85;
  const F = 0.75;
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(L, A, F), toon(cor));
  corpo.position.y = A / 2;
  g.add(corpo);
  // a janela: um fundo escuro recuado, com os lanches em quatro prateleiras
  const janela = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.2, 0.02), toon(P.screen));
  janela.position.set(-0.1, 1.12, F / 2 + 0.005);
  g.add(janela);
  const cores = [P.gold, P.escolaArmarioAzul, P.flowerPink, P.limao, P.laranja, P.metalWhite];
  for (let linha = 0; linha < 4; linha++) {
    const y = 0.65 + linha * 0.28;
    const prateleira = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.015, 0.05), toon(P.metalGrey));
    prateleira.position.set(-0.1, y - 0.03, F / 2 + 0.03);
    g.add(prateleira);
    for (let c = 0; c < 4; c++) {
      const pacote = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.04), toon(cores[(linha * 2 + c) % cores.length]));
      pacote.position.set(-0.1 - 0.22 + c * 0.146, y + 0.06, F / 2 + 0.035);
      // o nome deixa a cena achar o pacote que "caiu" e escondê-lo até repor
      pacote.name = `pacote-${linha}-${c}`;
      g.add(pacote);
    }
  }
  // o teclado: botõezinhos em grade, e a boca do troco embaixo dele
  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), toon(P.metalWhite));
    b.position.set(0.3 + (i % 3) * 0.055, 1.3 - Math.floor(i / 3) * 0.055, F / 2 + 0.01);
    g.add(b);
  }
  const moeda = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.02), toon(P.metalGrey));
  moeda.position.set(0.355, 1.02, F / 2 + 0.01);
  g.add(moeda);
  const retirada = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.02), toon(P.screen));
  retirada.position.set(-0.1, 0.25, F / 2 + 0.005);
  g.add(retirada);
  // a faixa de luz no alto: acesa de leve
  const luz = new THREE.Mesh(new THREE.BoxGeometry(L - 0.1, 0.12, 0.02), toon(P.metalWhite, { glow: 0.5 }));
  luz.position.set(0, A - 0.12, F / 2 + 0.005);
  g.add(luz);
  return g;
}

/**
 * A LOUSA DE SALA DE AULA: o quadro de giz verde (o mesmo `quadroDeGiz` do
 * Mania, na cor de escola) com a canaleta embaixo, o giz e o apagador.
 */
export function lousaDeSala(linhas: readonly string[], largura = 3.4, altura = 1.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lousa';
  const quadro = quadroDeGiz(linhas, largura, altura, P.escolaLousa);
  g.add(quadro);
  const canaleta = new THREE.Mesh(new THREE.BoxGeometry(largura * 0.9, 0.04, 0.12), toon(P.woodDark));
  canaleta.position.set(0, -altura / 2 - 0.02, 0.06);
  g.add(canaleta);
  for (const [x, cor] of [[-0.6, P.metalWhite], [-0.45, P.gold], [0.3, P.flowerPink]] as const) {
    const giz = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), toon(cor));
    giz.rotation.z = Math.PI / 2;
    giz.position.set(x, -altura / 2 + 0.012, 0.08);
    g.add(giz);
  }
  const apagador = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.07), toon(P.escolaArmarioAzul));
  apagador.position.set(0.8, -altura / 2 + 0.025, 0.07);
  g.add(apagador);
  return g;
}

/**
 * CARTEIRA ESCOLAR: a mesinha com a cadeira de escola atrás dela. Quem senta
 * olha para `+Z` (a peça olha para `+Z`, como todo o kit): a cena gira meia
 * volta para a turma olhar para a lousa no fundo.
 *
 * O assento fica com o topo em 0,47 — o mesmo da mesa de piquenique, para a
 * âncora de sentar servir nas duas.
 */
export function carteiraEscolar(cor: number = P.escolaCarteira): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'carteira-escolar';
  const metal = toon(P.escolaCarteiraPe);
  const madeira = toon(cor);
  // a mesinha
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.035, 0.46), madeira);
  tampo.position.set(0, 0.72, 0.16);
  g.add(tampo);
  const gradinha = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.36), metal);
  gradinha.position.set(0, 0.54, 0.18);
  g.add(gradinha);
  for (const [x, z] of [[-0.29, -0.03], [0.29, -0.03], [-0.29, 0.35], [0.29, 0.35]] as const) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.7, 6), metal);
    perna.position.set(x, 0.35, z);
    g.add(perna);
  }
  // a cadeira, atrás
  const assento = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.4), madeira);
  assento.position.set(0, 0.45, -0.38);
  g.add(assento);
  const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.03), madeira);
  encosto.position.set(0, 0.72, -0.6);
  encosto.rotation.x = -0.08;
  g.add(encosto);
  for (const [x, z] of [[-0.18, -0.2], [0.18, -0.2], [-0.18, -0.56], [0.18, -0.56]] as const) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.44, 6), metal);
    perna.position.set(x, 0.22, z);
    g.add(perna);
  }
  for (const x of [-0.18, 0.18]) {
    const montante = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 6), metal);
    montante.position.set(x, 0.62, -0.58);
    g.add(montante);
  }
  return g;
}

/**
 * MESA DO PROFESSOR: a mesa grande de madeira com gaveteiro, o painel da
 * frente virado para a turma (`+Z`), e o que todo professor tem em cima dela —
 * a pilha de livros, o pote de lápis e a maçã.
 */
export function mesaDoProfessor(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-do-professor';
  const madeira = toon(P.wood);
  const escura = toon(P.woodDark);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.8), madeira);
  tampo.position.y = 0.76;
  g.add(tampo);
  // o painel da frente e o gaveteiro, recuados do tampo
  const painel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.04), escura);
  painel.position.set(0, 0.46, 0.33);
  g.add(painel);
  const gaveteiro = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.72, 0.7), escura);
  gaveteiro.position.set(0.55, 0.36, -0.02);
  g.add(gaveteiro);
  const lateral = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.7), escura);
  lateral.position.set(-0.74, 0.36, -0.02);
  g.add(lateral);
  for (let k = 0; k < 3; k++) {
    const puxador = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.02), toon(P.gold));
    puxador.position.set(0.55, 0.62 - k * 0.2, -0.38);
    g.add(puxador);
  }
  // em cima: livros, lápis e a maçã
  const livros = [P.escolaArmarioAzul, P.escolaFaixa, P.escolaArmarioAmarelo];
  livros.forEach((cor, k) => {
    const livro = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.22), toon(cor));
    livro.position.set(-0.5, 0.815 + k * 0.05, -0.05);
    livro.rotation.y = (k - 1) * 0.12;
    g.add(livro);
  });
  const pote = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10), toon(P.escolaRodape));
  pote.position.set(0.5, 0.85, -0.2);
  g.add(pote);
  for (const [dx, cor] of [[-0.015, P.gold], [0.018, P.escolaFaixa], [0, P.escolaArmarioAzul]] as const) {
    const lapis = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 5), toon(cor));
    lapis.position.set(0.5 + dx, 0.94, -0.2 + dx);
    lapis.rotation.z = dx * 6;
    g.add(lapis);
  }
  const maca = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), toon(P.fabricRed));
  maca.position.set(0.15, 0.85, 0.12);
  g.add(maca);
  const folha = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 4), toon(P.leafMid));
  folha.scale.set(1.4, 0.4, 0.8);
  folha.position.set(0.17, 0.915, 0.12);
  g.add(folha);
  return g;
}

/**
 * GLOBO TERRESTRE na mesinha: a bola azul inclinada no eixo, com manchas de
 * continente, dentro do arco de metal. A esfera tem nome (`globo`) para a
 * cena poder girar ela.
 */
export function globoTerrestre(dePe = false): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'globo';
  // de pé, ele ganha um pedestal de madeira da altura de uma mesa
  const alto = dePe ? 0.72 : 0;
  const pe = new THREE.Mesh(new THREE.CylinderGeometry(dePe ? 0.2 : 0.1, dePe ? 0.24 : 0.13, 0.05, 12), toon(P.woodDark));
  pe.position.y = 0.025;
  g.add(pe);
  if (dePe) {
    const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, alto, 8), toon(P.wood));
    coluna.position.y = alto / 2 + 0.03;
    g.add(coluna);
  }
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 6), toon(P.gold));
  haste.position.y = 0.1 + alto;
  g.add(haste);
  const inclinado = new THREE.Group();
  inclinado.position.y = 0.36 + alto;
  inclinado.rotation.z = 0.41;
  g.add(inclinado);
  const arco = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.012, 5, 20, Math.PI), toon(P.gold));
  arco.rotation.z = -Math.PI / 2;
  inclinado.add(arco);
  const globo = new THREE.Group();
  globo.name = 'globo';
  inclinado.add(globo);
  globo.add(new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 12), toon(P.water)));
  // os continentes: calotas verdes coladas na bola, um tico para fora dela
  const terra = toon(P.leafMid);
  for (const [lat, lon, tam] of [
    [0.3, 0.2, 0.09], [-0.25, 0.5, 0.08], [0.45, 2.1, 0.11], [0.1, 2.6, 0.07],
    [-0.4, 3.4, 0.06], [0.55, 4.2, 0.09], [-0.1, 5.2, 0.08],
  ] as const) {
    const mancha = new THREE.Mesh(new THREE.SphereGeometry(tam, 8, 6), terra);
    mancha.scale.set(1.3, 1, 0.35);
    const dir = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
    mancha.position.copy(dir.clone().multiplyScalar(0.205));
    mancha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    globo.add(mancha);
  }
  return g;
}

/**
 * CARTAZ DE PAREDE: uma folha colorida com título e linhas, em `<canvas>`.
 * Serve para o alfabeto da sala, o mural de avisos e as faixas do ginásio.
 */
export function cartazDeParede(
  titulo: string, linhas: readonly string[], largura = 1.2, altura = 0.9,
  fundo = '#fff6dc', tinta = '#2f5596',
): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cartaz';
  const papel = pinturaEmCanvas(largura, altura, (ctx, w, h) => {
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = tinta;
    ctx.lineWidth = Math.max(4, w * 0.012);
    ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, w - ctx.lineWidth * 2, h - ctx.lineWidth * 2);
    ctx.fillStyle = tinta;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const temTitulo = titulo.length > 0;
    const faixas = linhas.length + (temTitulo ? 1.3 : 0);
    const passo = h / (faixas + 0.6);
    let y = passo * 0.8;
    if (temTitulo) {
      escreverCabendo(ctx, titulo, w / 2, y, w * 0.88, passo * 0.9);
      y += passo * 1.3;
    }
    for (const linha of linhas) {
      escreverCabendo(ctx, linha, w / 2, y, w * 0.88, passo * 0.62, false);
      y += passo;
    }
  });
  papel.position.z = 0.012;
  g.add(papel);
  // a folha tem corpo: um cartão fininho atrás da pintura
  const cartao = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.015), toon(P.metalWhite));
  g.add(cartao);
  return g;
}

/**
 * PLACA DE PORTA, bilíngue: o nome da sala em português, grande, e em
 * espanhol embaixo, pequeno. A escola ensina só de andar por ela.
 */
export function placaDePorta(portugues: string, espanhol = ''): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-de-porta';
  const L = 1.5;
  const A = espanhol ? 0.46 : 0.34;
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(L, A, 0.04), toon(P.escolaRodape));
  g.add(fundo);
  const texto = pinturaEmCanvas(L - 0.08, A - 0.06, (ctx, w, h) => {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    if (espanhol) {
      escreverCabendo(ctx, portugues, w / 2, h * 0.36, w * 0.94, h * 0.46);
      ctx.fillStyle = '#ffe39a';
      escreverCabendo(ctx, espanhol, w / 2, h * 0.78, w * 0.94, h * 0.26, false);
    } else {
      escreverCabendo(ctx, portugues, w / 2, h / 2, w * 0.94, h * 0.62);
    }
  });
  texto.position.z = 0.022;
  g.add(texto);
  return g;
}

/**
 * BANDEIRA pendurada na parede, pintada em `<canvas>`: a do Brasil e a da
 * Venezuela, lado a lado na sala de português e na de espanhol.
 *
 * Desenhadas por forma, não por foto: o losango e o círculo do Brasil, e as
 * três faixas com o arco de oito estrelas da Venezuela.
 */
export function bandeira(pais: 'brasil' | 'venezuela', largura = 0.9): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = `bandeira-${pais}`;
  const altura = largura * 0.66;
  const pano = pinturaEmCanvas(largura, altura, (ctx, w, h) => {
    if (pais === 'brasil') {
      ctx.fillStyle = '#1f9e4a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffd52e';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.08);
      ctx.lineTo(w * 0.92, h * 0.5);
      ctx.lineTo(w * 0.5, h * 0.92);
      ctx.lineTo(w * 0.08, h * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#233d8f';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, h * 0.25, 0, Math.PI * 2);
      ctx.fill();
      // a faixa branca, curvada
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = h * 0.05;
      ctx.beginPath();
      ctx.arc(w * 0.44, h * 0.95, h * 0.55, -Math.PI * 0.62, -Math.PI * 0.26);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      for (const [x, y] of [[0.44, 0.58], [0.5, 0.64], [0.56, 0.57], [0.47, 0.68], [0.53, 0.7]]) {
        ctx.beginPath();
        ctx.arc(w * x, h * y, h * 0.012, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const faixas = ['#ffcc00', '#00247d', '#cf142b'];
      faixas.forEach((cor, i) => {
        ctx.fillStyle = cor;
        ctx.fillRect(0, (h * i) / 3, w, h / 3 + 1);
      });
      // o arco de oito estrelas na faixa azul
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        const a = Math.PI * (0.18 + (0.64 * i) / 7);
        const x = w * 0.5 - Math.cos(a) * h * 0.3;
        const y = h * 0.62 - Math.sin(a) * h * 0.2;
        estrela(ctx, x, y, h * 0.035);
      }
    }
  });
  pano.position.z = 0.02;
  g.add(pano);
  // a vareta em cima, de onde ela pende
  const vareta = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, largura + 0.14, 6), toon(P.woodDark));
  vareta.rotation.z = Math.PI / 2;
  vareta.position.set(0, altura / 2 + 0.015, 0.02);
  g.add(vareta);
  return g;
}

/** RELÓGIO DE PAREDE redondo, virado para `+Z`. */
export function relogioDeParede(raio = 0.28): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'relogio';
  const mostrador = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, 0.04, 24), toon(P.metalWhite));
  mostrador.rotation.x = Math.PI / 2;
  g.add(mostrador);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(raio, 0.03, 6, 24), toon(P.escolaRodape));
  aro.position.z = 0.02;
  g.add(aro);
  const escuro = toon(P.screen);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const marca = new THREE.Mesh(new THREE.BoxGeometry(0.02, i % 3 === 0 ? 0.06 : 0.035, 0.01), escuro);
    marca.position.set(Math.sin(a) * raio * 0.8, Math.cos(a) * raio * 0.8, 0.025);
    marca.rotation.z = -a;
    g.add(marca);
  }
  // os ponteiros: dez para as duas, a hora de relógio de vitrine
  for (const [comp, ang] of [[raio * 0.5, 1.1], [raio * 0.72, -0.55]] as const) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.018, comp, 0.01), escuro);
    p.geometry.translate(0, comp / 2, 0);
    p.position.z = 0.032;
    p.rotation.z = ang;
    g.add(p);
  }
  return g;
}

/**
 * CESTA DE BASQUETE, a de ginásio: o poste com a proteção azul, o braço, a
 * tabela branca com o quadradinho vermelho, o aro e a rede. O aro fica a 3,05
 * do chão, como o de verdade, e a tabela olha para `+Z` (a quadra).
 */
export function cestaDeBasquete(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cesta-de-basquete';
  const metal = toon(P.metalGrey);
  const protecao = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), toon(P.escolaArmarioAzul));
  protecao.position.set(0, 0.8, -1.2);
  g.add(protecao);
  const poste = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), metal);
  poste.position.set(0, 1.5, -1.2);
  g.add(poste);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.1), metal);
  braco.position.set(0, 3.25, -0.62);
  g.add(braco);
  const tabela = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.06), toon(P.escolaTabela));
  tabela.position.set(0, 3.45, -0.04);
  g.add(tabela);
  // a borda e o quadradinho de mira, vermelhos, por cima da tabela
  const vermelho = toon(P.escolaFaixa);
  for (const [w, h, x, y] of [
    [1.8, 0.05, 0, 0.5], [1.8, 0.05, 0, -0.5], [0.05, 1.05, -0.88, 0], [0.05, 1.05, 0.88, 0],
    [0.6, 0.04, 0, 0.22], [0.6, 0.04, 0, -0.2], [0.04, 0.42, -0.28, 0.01], [0.04, 0.42, 0.28, 0.01],
  ] as const) {
    const risco = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.01), vermelho);
    risco.position.set(x, 3.45 + y, -0.005);
    g.add(risco);
  }
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 6, 20), toon(P.escolaBolaDeBasquete));
  aro.rotation.x = Math.PI / 2;
  aro.position.set(0, 3.05, 0.26);
  g.add(aro);
  // a rede: fios caindo do aro e fechando embaixo
  const fio = toon(P.metalWhite);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const topo = new THREE.Vector3(Math.cos(a) * 0.22, 3.04, 0.26 + Math.sin(a) * 0.22);
    const pe = new THREE.Vector3(Math.cos(a) * 0.12, 2.64, 0.26 + Math.sin(a) * 0.12);
    const meio = topo.clone().add(pe).multiplyScalar(0.5);
    const dir = pe.clone().sub(topo);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, dir.length(), 4), fio);
    f.position.copy(meio);
    f.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(f);
  }
  return g;
}

/** A BOLA DE BASQUETE: laranja, com os gomos pretos. */
export function bolaDeBasquete(raio = 0.12): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'bola-de-basquete';
  g.add(new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 10), toon(P.escolaBolaDeBasquete)));
  const gomo = toon(P.screen);
  for (const [rx, ry] of [[0, 0], [Math.PI / 2, 0], [0, Math.PI / 2]] as const) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(raio * 1.005, raio * 0.04, 4, 20), gomo);
    anel.rotation.set(rx, ry, 0);
    g.add(anel);
  }
  return g;
}

/** O CARRINHO DE BOLAS do ginásio: a cesta de arame com as bolas dentro. */
export function carrinhoDeBolas(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'carrinho-de-bolas';
  const metal = toon(P.metalGrey);
  for (const [x, z] of [[-0.35, -0.25], [0.35, -0.25], [-0.35, 0.25], [0.35, 0.25]] as const) {
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.75, 6), metal);
    perna.position.set(x, 0.42, z);
    g.add(perna);
    const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), toon(P.screen));
    roda.rotation.x = Math.PI / 2;
    roda.position.set(x, 0.05, z);
    g.add(roda);
  }
  for (const y of [0.3, 0.78]) {
    for (const z of [-0.25, 0.25]) {
      const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.72, 6), metal);
      barra.rotation.z = Math.PI / 2;
      barra.position.set(0, y, z);
      g.add(barra);
    }
  }
  for (const [x, y, z] of [[-0.2, 0.44, -0.1], [0.05, 0.44, 0.1], [0.22, 0.44, -0.08], [-0.08, 0.6, 0.02], [0.14, 0.62, 0.12]] as const) {
    const b = bolaDeBasquete(0.12);
    b.position.set(x, y, z);
    b.rotation.set(x * 3, z * 5, y);
    g.add(b);
  }
  return g;
}

/**
 * O PLACAR DO GINÁSIO, pendurado na parede: o painel escuro com os números
 * vermelhos. O texto vem da cena.
 */
export function placarDeGinasio(casa: string, pontosCasa: string, visita: string, pontosVisita: string): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placar-de-ginasio';
  const L = 2.6;
  const A = 1.2;
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(L, A, 0.2), toon(P.screen));
  g.add(caixa);
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(L + 0.1, A + 0.1, 0.16), toon(P.escolaRodape));
  moldura.position.z = -0.04;
  g.add(moldura);
  const tela = pinturaEmCanvas(L - 0.14, A - 0.14, (ctx, w, h) => {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffe39a';
    escreverCabendo(ctx, casa, w * 0.25, h * 0.22, w * 0.46, h * 0.2);
    escreverCabendo(ctx, visita, w * 0.75, h * 0.22, w * 0.46, h * 0.2);
    ctx.fillStyle = '#ff5a4a';
    escreverCabendo(ctx, pontosCasa, w * 0.25, h * 0.64, w * 0.4, h * 0.52);
    escreverCabendo(ctx, pontosVisita, w * 0.75, h * 0.64, w * 0.4, h * 0.52);
    ctx.fillStyle = '#7fd6ff';
    escreverCabendo(ctx, '·', w * 0.5, h * 0.6, w * 0.1, h * 0.4);
  });
  tela.position.z = 0.105;
  g.add(tela);
  return g;
}

/** PUFE DE SACO, o da sala de descanso: largado, afundado no meio. */
export function pufeSaco(cor: number = P.escolaPufe): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pufe-saco';
  const saco = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), toon(cor));
  saco.scale.set(1, 0.62, 1);
  saco.position.y = 0.3;
  g.add(saco);
  // o encosto: o saco sobe atrás, onde a pessoa afundou na frente
  const encosto = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 10), toon(cor));
  encosto.scale.set(1.15, 0.9, 0.7);
  encosto.position.set(0, 0.5, -0.26);
  g.add(encosto);
  return g;
}

/**
 * ESCANINHOS da sala dos professores: a estante de nichos, um por professor,
 * com papel dentro e a plaquinha do nome embaixo de cada um.
 */
export function escaninhos(colunas = 4, linhas = 3): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'escaninhos';
  const C = 0.42;
  const F = 0.4;
  const L = colunas * C;
  const A = linhas * C;
  const madeira = toon(P.wood);
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(L, A, 0.03), toon(P.estanteFundo));
  fundo.position.set(0, 0.2 + A / 2, -F / 2 + 0.015);
  g.add(fundo);
  const pe = new THREE.Mesh(new THREE.BoxGeometry(L - 0.04, 0.2, F - 0.04), toon(P.woodDark));
  pe.position.y = 0.1;
  g.add(pe);
  for (let i = 0; i <= linhas; i++) {
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(L + 0.02, 0.03, F), madeira);
    tabua.position.set(0, 0.2 + i * C, 0);
    g.add(tabua);
  }
  for (let i = 0; i <= colunas; i++) {
    const div = new THREE.Mesh(new THREE.BoxGeometry(0.03, A - 0.03, F - 0.02), madeira);
    div.position.set(-L / 2 + i * C, 0.2 + A / 2, 0.01);
    g.add(div);
  }
  const papel = toon(P.metalWhite);
  for (let c = 0; c < colunas; c++) {
    for (let l = 0; l < linhas; l++) {
      if ((c + l) % 3 === 2) continue;
      const folhas = new THREE.Mesh(new THREE.BoxGeometry(C * 0.6, 0.03 + ((c * 7 + l) % 3) * 0.02, F * 0.7), papel);
      folhas.position.set(-L / 2 + C * (c + 0.5), 0.2 + l * C + 0.035, -0.02);
      g.add(folhas);
      const plaquinha = new THREE.Mesh(new THREE.BoxGeometry(C * 0.5, 0.05, 0.01), toon(P.gold));
      plaquinha.position.set(-L / 2 + C * (c + 0.5), 0.2 + l * C + 0.005, F / 2 + 0.006);
      g.add(plaquinha);
    }
  }
  return g;
}

/** A CAFETEIRA da sala dos professores: a máquina e a jarra de vidro com café. */
export function cafeteira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cafeteira';
  const preto = toon(P.screen);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.26), preto);
  base.position.y = 0.02;
  g.add(base);
  const torre = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.1), preto);
  torre.position.set(0, 0.21, -0.08);
  g.add(torre);
  const topo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.24), preto);
  topo.position.set(0, 0.36, -0.01);
  g.add(topo);
  const jarra = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.16, 12), toon(P.glass, { opacity: 0.55 }));
  jarra.position.set(0, 0.12, 0.04);
  g.add(jarra);
  const cafe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.08, 12), toon(P.chocolate));
  cafe.position.set(0, 0.085, 0.04);
  g.add(cafe);
  const luz = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.01), toon(P.escolaFaixa, { glow: 0.8 }));
  luz.position.set(0.1, 0.36, 0.11);
  g.add(luz);
  return g;
}

/**
 * A CAMINHA DO GATITO, na sala dos professores: a almofada redonda de
 * borda alta, com um novelo de lã do lado.
 */
export function caminhaDoGatito(cor: number = P.escolaArmarioAzul): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'caminha-do-gatito';
  const fundo = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.1, 18), toon(cor));
  fundo.position.y = 0.05;
  g.add(fundo);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 8, 20), toon(cor));
  borda.rotation.x = Math.PI / 2;
  borda.position.y = 0.14;
  g.add(borda);
  const almofada = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.05, 18), toon(P.gatitoCreme));
  almofada.position.y = 0.12;
  g.add(almofada);
  const novelo = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), toon(P.flowerPink));
  novelo.position.set(0.55, 0.09, 0.2);
  g.add(novelo);
  const fio = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 4, 12, Math.PI), toon(P.flowerPink));
  fio.rotation.x = Math.PI / 2;
  fio.position.set(0.62, 0.01, 0.3);
  g.add(fio);
  return g;
}

/**
 * OS OCULINHOS DO GATITO, largados em cima da mesa do professor: os mesmos
 * aros redondos que ele põe na hora da aula, com as hastes dobradas.
 */
export function oculinhosDoGatito(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'oculinhos-do-gatito';
  const aro = toon(P.gatitoOculos);
  for (const lado of [-1, 1]) {
    const lente = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.0055, 6, 18), aro);
    lente.position.set(lado * 0.045, 0.038, 0);
    lente.rotation.x = -0.25;
    g.add(lente);
    const haste = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.006, 0.006), aro);
    haste.position.set(lado * 0.035, 0.012, -0.03);
    g.add(haste);
  }
  const ponte = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.005, 4, 10, Math.PI), aro);
  ponte.position.set(0, 0.045, 0);
  ponte.rotation.x = -0.25;
  g.add(ponte);
  return g;
}

/**
 * O LOGO DA ESCOLA num painel: a cara do Gatito — o círculo metade creme,
 * metade caramelo, os dois olhinhos e a linguinha — e o nome ao lado.
 */
export function logoDaEscola(nome: string, largura = 4.2, altura = 1.1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'logo-da-escola';
  const placa = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.06), toon(P.escolaRodape));
  g.add(placa);
  const borda = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.1, altura + 0.1, 0.03), toon(P.escolaArmarioAmarelo));
  borda.position.z = -0.02;
  g.add(borda);
  const pintura = pinturaEmCanvas(largura - 0.1, altura - 0.1, (ctx, w, h) => {
    const r = h * 0.4;
    const cx = h * 0.52;
    const cy = h * 0.5;
    // as orelhas: chocolate à esquerda de quem olha, caramelo à direita
    for (const [lado, cor] of [[-1, '#5f4a3f'], [1, '#cf8d5c']] as const) {
      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.moveTo(cx + lado * r * 0.35, cy - r * 0.8);
      ctx.lineTo(cx + lado * r * 0.9, cy - r * 1.18);
      ctx.lineTo(cx + lado * r * 0.88, cy - r * 0.45);
      ctx.closePath();
      ctx.fill();
    }
    // a cara: metade creme, metade caramelo (a costura passa ao lado do nariz)
    ctx.fillStyle = '#f3ecdf';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#cf8d5c';
    ctx.fillRect(cx + r * 0.18, cy - r, r, r * 2);
    ctx.restore();
    ctx.fillStyle = '#1f1b1d';
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + lado * r * 0.42, cy - r * 0.02, r * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.2, r * 0.1, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1f1b1d';
    ctx.lineWidth = r * 0.06;
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + lado * r * 0.12, cy + r * 0.3, r * 0.12, 0, Math.PI);
      ctx.stroke();
    }
    ctx.fillStyle = '#e57b90';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.06, cy + r * 0.5, r * 0.09, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    // o nome
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    escreverCabendo(ctx, nome, (w + h) / 2, h * 0.52, w - h * 1.15, h * 0.5);
  });
  pintura.position.z = 0.035;
  g.add(pintura);
  return g;
}
