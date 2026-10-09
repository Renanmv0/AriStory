import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { flat, toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * ========================================= OS MÓVEIS DA CASA DO ARI
 *
 * A sala e a cozinha do Ari, refeitas peça por peça com o mesmo cuidado do
 * quarto: quina arredondada em tudo que a mão encosta (é o que deixa o jogo
 * fofo — caixa de quina viva parece caixote), pé de palito, puxador, e um
 * detalhe de gente morando (os ímãs na geladeira, o detergente na pia, a
 * almofada torta no sofá).
 *
 * São peças NOVAS, e não as do `furniture.ts` reescritas: a escola e o Mania
 * usam a pia, a mesa, o sofá e a geladeira de lá, e ninguém pediu para eles
 * mudarem. O TAMANHO POR FORA é o das peças antigas, para os colisores, as
 * interações e as cenas (sentar no sofá, a caneca na mesinha) continuarem
 * valendo.
 *
 * As madeiras são `P.wood`/`P.woodDark`, o tecido do sofá é a cor que chega
 * e a pedra da pia é `P.concrete`: é por essas cores que o acabamento da
 * cena (`acabar`) põe veio, tecido e granito.
 *
 * Técnica (as skills de three no jogo de verdade): `RoundedBoxGeometry` para a
 * quina macia, `LatheGeometry` para o vaso e a cúpula, `TubeGeometry` para a
 * torneira, `InstancedMesh` com cor por instância para as folhas, e um
 * `<canvas>` para o que passa na TV.
 */

/** caixa de quina arredondada: o tijolo de tudo aqui */
function macia(l: number, a: number, p: number, raio = 0.02): THREE.BufferGeometry {
  return new RoundedBoxGeometry(l, a, p, 2, Math.min(raio, l / 2 - 0.001, a / 2 - 0.001, p / 2 - 0.001));
}

/**
 * Um pé de palito cônico, da base `y = 0` até `alto`.
 *
 * A ORIGEM É A PONTA DE BAIXO, dentro da própria geometria (e não um
 * `position.y = alto / 2`): quem usa faz `pe.position.set(x, 0, z)` e gira o pé
 * para abrir, e as duas coisas só dão certo assim. Com a origem no meio, o
 * `set(x, 0, z)` jogava metade do pé para baixo do chão — a mesa, as cadeiras,
 * a mesinha e o sofá ficaram flutuando, o tampo sem pé nenhum embaixo — e o
 * giro levantava a ponta do chão.
 */
function pePalito(alto: number, cor: number = P.woodDark, raio = 0.022): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(raio, raio * 0.6, alto, 8);
  geo.translate(0, alto / 2, 0);
  return new THREE.Mesh(geo, toon(cor));
}

// =================================================================== TV

/**
 * O RACK E A TV. Rack baixo de pés palito, com duas portinhas de ripas e um
 * nicho aberto no meio (onde moram uns livros e uma caixinha de som); a TV é
 * fina, de borda estreita, em pé sobre dois pezinhos. Em cima do rack, uma
 * plantinha e um porta-retrato.
 *
 * A TELA continua sendo uma malha chamada `tela`, porque é ela que a cena
 * troca para ligar a TV (`telaDeTvLigada`). Frente da peça: +Z.
 */
export function rackComTv(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'rack-da-tv';
  const L = 1.8;
  const P_ = 0.42;
  const PES = 0.16;
  const ALT = 0.36;
  const madeira = toon(P.wood);

  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pe = pePalito(PES + 0.01);
    pe.position.x = x * (L / 2 - 0.1);
    pe.position.z = z * (P_ / 2 - 0.07);
    g.add(pe);
  }
  const corpo = new THREE.Mesh(macia(L, ALT, P_, 0.025), madeira);
  corpo.position.y = PES + ALT / 2;
  g.add(corpo);
  // o nicho do meio, recuado e escuro
  const nicho = new THREE.Mesh(macia(0.56, ALT - 0.08, 0.04, 0.01), toon(P.woodDark));
  nicho.position.set(0, PES + ALT / 2, P_ / 2 - 0.01);
  g.add(nicho);
  // as duas portinhas de ripas, uma de cada lado do nicho
  for (const lado of [-1, 1]) {
    const porta = new THREE.Mesh(macia(0.56, ALT - 0.06, 0.03, 0.01), toon(P.woodDark));
    porta.position.set(lado * 0.5, PES + ALT / 2, P_ / 2 + 0.005);
    g.add(porta);
    for (let r = 0; r < 7; r++) {
      const ripa = new THREE.Mesh(new THREE.BoxGeometry(0.05, ALT - 0.1, 0.012), madeira);
      ripa.position.set(lado * 0.5 - 0.24 + r * 0.08, PES + ALT / 2, P_ / 2 + 0.024);
      g.add(ripa);
    }
  }
  // no nicho: três livros deitados e uma caixinha de som redonda
  const nichoY = PES + 0.04;
  [P.metalRed, P.fabricBlue, P.gold].forEach((c, i) => {
    const livro = new THREE.Mesh(macia(0.22 - i * 0.02, 0.035, 0.16, 0.006), toon(c));
    livro.position.set(-0.13, nichoY + 0.0175 + i * 0.036, P_ / 2 - 0.12);
    livro.rotation.y = (i - 1) * 0.08;
    g.add(livro);
  });
  const som = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), toon(P.tvCorpo));
  som.scale.y = 0.8;
  som.position.set(0.14, nichoY + 0.06, P_ / 2 - 0.12);
  g.add(som);

  // a TV
  const TOPO = PES + ALT;
  const tvL = 1.5;
  const tvA = 0.86;
  for (const lado of [-1, 1]) {
    const pe = new THREE.Mesh(macia(0.05, 0.08, 0.2, 0.012), toon(P.tvCorpo));
    pe.position.set(lado * 0.55, TOPO + 0.04, 0);
    pe.rotation.z = lado * 0.35;
    g.add(pe);
  }
  const painel = new THREE.Mesh(macia(tvL, tvA, 0.05, 0.02), toon(P.tvCorpo));
  painel.position.set(0, TOPO + 0.08 + tvA / 2, 0);
  g.add(painel);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(tvL - 0.08, tvA - 0.08), toon(P.tvTelaApagada));
  tela.name = 'tela';
  tela.position.set(0, TOPO + 0.08 + tvA / 2, 0.0265);
  g.add(tela);
  // a luzinha vermelha de "em espera", embaixo da tela
  const espera = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), toon(P.metalRed, { glow: 0.8 }));
  espera.position.set(tvL / 2 - 0.1, TOPO + 0.08 + 0.02, 0.03);
  g.add(espera);

  // em cima do rack, nas pontas: uma plantinha e um porta-retrato
  const vasinho = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 14), toon(P.vasoCreme));
  vasinho.position.set(0.8, TOPO + 0.05, 0.08);
  g.add(vasinho);
  const tufo = folhagem(7, 0.07, 9);
  tufo.position.set(0.8, TOPO + 0.1, 0.08);
  g.add(tufo);
  const retrato = new THREE.Group();
  retrato.position.set(-0.82, TOPO, 0.1);
  retrato.rotation.y = 0.3;
  const moldura = new THREE.Mesh(macia(0.14, 0.17, 0.02, 0.006), toon(P.gold));
  moldura.position.y = 0.085;
  moldura.rotation.x = -0.12;
  retrato.add(moldura);
  const foto = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.13), flat(P.skyDusk));
  foto.position.set(0, 0.085, 0.012);
  foto.rotation.x = -0.12;
  retrato.add(foto);
  g.add(retrato);
  return g;
}

/**
 * O que passa na TV ligada: o show, desenhado em canvas — palco escuro,
 * holofote, o piano e o comediante sentado nele. Uma imagem só, sem animar:
 * a TV da sala é paisagem, não programa.
 */
let materialDaTv: THREE.MeshBasicMaterial | null = null;
export function telaDeTvLigada(): THREE.MeshBasicMaterial {
  if (materialDaTv) return materialDaTv;
  const W = 384;
  const H = 216;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const fundo = ctx.createLinearGradient(0, 0, 0, H);
    fundo.addColorStop(0, '#1d2350');
    fundo.addColorStop(1, '#3b2a5c');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, W, H);
    // o holofote: um cone claro descendo até o palco
    const luz = ctx.createLinearGradient(0, 0, 0, H);
    luz.addColorStop(0, 'rgba(255,240,200,0.55)');
    luz.addColorStop(1, 'rgba(255,240,200,0.1)');
    ctx.fillStyle = luz;
    ctx.beginPath();
    ctx.moveTo(W * 0.47, 0);
    ctx.lineTo(W * 0.53, 0);
    ctx.lineTo(W * 0.72, H * 0.86);
    ctx.lineTo(W * 0.28, H * 0.86);
    ctx.closePath();
    ctx.fill();
    // o palco
    ctx.fillStyle = '#6b4a7a';
    ctx.fillRect(0, H * 0.82, W, H * 0.18);
    ctx.fillStyle = 'rgba(255,240,200,0.35)';
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.86, W * 0.2, H * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    // o piano: corpo escuro e as teclas
    ctx.fillStyle = '#15151c';
    ctx.fillRect(W * 0.52, H * 0.55, W * 0.2, H * 0.29);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(W * 0.52, H * 0.55, W * 0.2, H * 0.05);
    ctx.fillStyle = '#15151c';
    for (let k = 0; k < 9; k++) ctx.fillRect(W * 0.525 + k * W * 0.022, H * 0.55, 3, H * 0.03);
    // o comediante no banquinho, de perfil: cabeça, cabelo, corpo
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(W * 0.4, H * 0.5, W * 0.07, H * 0.24);
    ctx.fillStyle = '#e9b98f';
    ctx.beginPath();
    ctx.arc(W * 0.435, H * 0.43, H * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a3a22';
    ctx.beginPath();
    ctx.arc(W * 0.43, H * 0.405, H * 0.055, Math.PI, Math.PI * 2.1);
    ctx.fill();
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(W * 0.38, H * 0.74, W * 0.11, H * 0.03);
    // as estrelinhas do fundo
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (const [x, y] of [[0.1, 0.15], [0.2, 0.32], [0.82, 0.2], [0.9, 0.4], [0.7, 0.08], [0.15, 0.55]]) {
      ctx.fillRect(W * x, H * y, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  materialDaTv = new THREE.MeshBasicMaterial({ map: tex });
  return materialDaTv;
}

// ============================================================== cozinha

/**
 * A PIA DA COZINHA (bancada de 3,6 com armário embaixo): portas com puxador,
 * rodapé recuado, pedra com rodabanca, a cuba de inox AFUNDADA na pedra com a
 * torneira curva, um fogão de duas bocas na outra ponta, o detergente e uma
 * tábua de cortar.
 *
 * A cuba fica em `largura/2 - 0.55`, onde a antiga ficava: é ali que a cena
 * põe o "Olhar a pia". Frente: +Z.
 */
export function pia(largura = 3.6, corDoArmario: number = P.wallMint): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pia';
  const PROF = 0.65;
  const ALT = 0.9;
  const RODAPE = 0.08;

  const rodape = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.06, RODAPE, PROF - 0.08), toon(P.woodDark));
  rodape.position.set(0, RODAPE / 2, -0.03);
  g.add(rodape);
  const corpo = new THREE.Mesh(macia(largura, ALT - RODAPE, PROF, 0.015), toon(corDoArmario));
  corpo.position.y = RODAPE + (ALT - RODAPE) / 2;
  g.add(corpo);
  // as portas: em pares de 0,45, cada uma com o seu puxador de barra
  const portas = Math.floor(largura / 0.45);
  const larg = largura / portas;
  for (let i = 0; i < portas; i++) {
    const x = -largura / 2 + larg * (i + 0.5);
    const porta = new THREE.Mesh(macia(larg - 0.025, ALT - RODAPE - 0.08, 0.03, 0.012), toon(corDoArmario));
    porta.position.set(x, RODAPE + (ALT - RODAPE) / 2 - 0.01, PROF / 2 + 0.008);
    g.add(porta);
    const ladoDoPux = i % 2 === 0 ? 1 : -1;
    const pux = new THREE.Mesh(macia(0.018, 0.12, 0.02, 0.008), toon(P.inoxEscuro));
    pux.position.set(x + ladoDoPux * (larg / 2 - 0.06), ALT - 0.15, PROF / 2 + 0.032);
    g.add(pux);
  }

  // a pedra, com uma sobra na frente, e a rodabanca encostada na parede
  const TAMPO = ALT + 0.04;
  const pedra = new THREE.Mesh(macia(largura + 0.06, 0.04, PROF + 0.06, 0.012), toon(P.concrete));
  pedra.position.set(0, ALT + 0.02, 0.02);
  g.add(pedra);
  const rodabanca = new THREE.Mesh(macia(largura + 0.06, 0.12, 0.025, 0.008), toon(P.concrete));
  rodabanca.position.set(0, TAMPO + 0.06, -PROF / 2 + 0.005);
  g.add(rodabanca);

  // a cuba: borda de inox e o fundo escuro, afundado
  const xCuba = largura / 2 - 0.55;
  const borda = new THREE.Mesh(macia(0.56, 0.012, 0.42, 0.01), toon(P.inox));
  borda.position.set(xCuba, TAMPO + 0.002, 0.02);
  g.add(borda);
  const fundoCuba = new THREE.Mesh(macia(0.48, 0.012, 0.34, 0.03), toon(P.inoxEscuro));
  fundoCuba.position.set(xCuba, TAMPO + 0.006, 0.02);
  g.add(fundoCuba);
  const ralo = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.004, 14), toon(P.inox));
  ralo.position.set(xCuba, TAMPO + 0.0135, 0.02);
  g.add(ralo);
  // a torneira: um pescoço curvo de inox, saindo de trás da cuba
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(xCuba, TAMPO, -0.22),
    new THREE.Vector3(xCuba, TAMPO + 0.22, -0.22),
    new THREE.Vector3(xCuba, TAMPO + 0.3, -0.14),
    new THREE.Vector3(xCuba, TAMPO + 0.22, -0.05),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 18, 0.016, 8), toon(P.inox)));
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.03, 14), toon(P.inox));
  base.position.set(xCuba, TAMPO + 0.015, -0.22);
  g.add(base);
  const registro = new THREE.Mesh(macia(0.06, 0.02, 0.02, 0.008), toon(P.inox));
  registro.position.set(xCuba + 0.05, TAMPO + 0.18, -0.22);
  g.add(registro);

  // o detergente e a esponja, do lado da cuba
  const frasco = new THREE.Mesh(macia(0.06, 0.16, 0.045, 0.02), toon(P.detergente));
  frasco.position.set(xCuba - 0.36, TAMPO + 0.08, -0.15);
  g.add(frasco);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.03, 10), toon(P.metalWhite));
  tampa.position.set(xCuba - 0.36, TAMPO + 0.175, -0.15);
  g.add(tampa);
  const esponja = new THREE.Mesh(macia(0.09, 0.035, 0.06, 0.01), toon(P.gold));
  esponja.position.set(xCuba - 0.36, TAMPO + 0.0175, -0.04);
  esponja.rotation.y = 0.3;
  g.add(esponja);

  // o fogão de duas bocas, na outra ponta, e a tábua no meio
  const xFogao = -largura / 2 + 0.5;
  const vidro = new THREE.Mesh(macia(0.56, 0.02, 0.46, 0.015), toon(P.fogaoVidro));
  vidro.position.set(xFogao, TAMPO + 0.01, 0.02);
  g.add(vidro);
  for (const dx of [-0.14, 0.14]) {
    const boca = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.02, 20), toon(P.fogaoBoca));
    boca.position.set(xFogao + dx, TAMPO + 0.025, 0.0);
    g.add(boca);
    const grelha = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.008, 6, 20), toon(P.tvCorpo));
    grelha.rotation.x = Math.PI / 2;
    grelha.position.set(xFogao + dx, TAMPO + 0.04, 0.0);
    g.add(grelha);
  }
  // uma chaleira em cima da boca da direita — a casa acordou tarde
  const chaleira = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), toon(P.metalRed));
  chaleira.scale.y = 0.8;
  chaleira.position.set(xFogao + 0.14, TAMPO + 0.11, 0.0);
  g.add(chaleira);
  const bico = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.09, 8), toon(P.metalRed));
  bico.rotation.z = -0.9;
  bico.position.set(xFogao + 0.24, TAMPO + 0.13, 0.0);
  g.add(bico);
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 14, Math.PI), toon(P.tvCorpo));
  alca.position.set(xFogao + 0.14, TAMPO + 0.17, 0.0);
  g.add(alca);
  const tabua = new THREE.Mesh(macia(0.36, 0.02, 0.24, 0.02), toon(P.wood));
  tabua.position.set(-0.2, TAMPO + 0.01, 0.04);
  tabua.rotation.y = -0.12;
  g.add(tabua);
  return g;
}

/**
 * OS ARMÁRIOS DE CIMA da cozinha: portas com puxador, uma prateleira aberta no
 * meio com potes e canecas, e uma sanca embaixo. Pendure com `w.place(…, y)`
 * no meio da altura (como o `upperCabinets`). Frente: +Z.
 */
export function armarioAereo(largura = 2.6, cor: number = P.wallCream): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'armario-aereo';
  const ALT = 0.6;
  const PROF = 0.34;
  const corpo = new THREE.Mesh(macia(largura, ALT, PROF, 0.015), toon(cor));
  g.add(corpo);
  const NICHO = 0.6;
  // o nicho aberto do meio: fundo recuado e uma prateleira
  // um dedo mais estreito que a boca do nicho, para as bordas não caírem no
  // mesmo plano das prateleiras
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(NICHO - 0.01, ALT - 0.06, 0.03), toon(P.wood));
  fundo.position.set(0, 0, PROF / 2 - 0.004);
  g.add(fundo);
  const prateleira = new THREE.Mesh(new THREE.BoxGeometry(NICHO, 0.02, 0.12), toon(P.wood));
  prateleira.position.set(0, -0.02, PROF / 2 + 0.06);
  g.add(prateleira);
  // potes de vidro com tampa de madeira, e duas canecas embaixo
  [[-0.18, P.gold], [0, P.flowerPink], [0.18, P.leafLight]].forEach(([x, c]) => {
    const pote = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.13, 14), toon(c as number));
    pote.position.set(x as number, -0.01 + 0.075, PROF / 2 + 0.06);
    g.add(pote);
    const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.02, 14), toon(P.wood));
    tampa.position.set(x as number, -0.01 + 0.15, PROF / 2 + 0.06);
    g.add(tampa);
  });
  for (const [x, c] of [[-0.12, P.metalWhite], [0.12, P.fabricBlue]] as const) {
    const caneca = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 12), toon(c));
    caneca.position.set(x, -0.24, PROF / 2 + 0.06);
    g.add(caneca);
  }
  const baseNicho = new THREE.Mesh(new THREE.BoxGeometry(NICHO, 0.02, 0.12), toon(P.wood));
  baseNicho.position.set(0, -ALT / 2 + 0.01, PROF / 2 + 0.06);
  g.add(baseNicho);
  // as portas dos dois lados
  const ladoL = (largura - NICHO) / 2;
  const n = Math.max(1, Math.round(ladoL / 0.5));
  for (const lado of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      const larg = ladoL / n;
      const x = lado * (NICHO / 2 + larg * (i + 0.5));
      const porta = new THREE.Mesh(macia(larg - 0.02, ALT - 0.04, 0.025, 0.01), toon(cor));
      porta.position.set(x, 0, PROF / 2 + 0.005);
      g.add(porta);
      const pux = new THREE.Mesh(macia(0.08, 0.016, 0.018, 0.007), toon(P.inoxEscuro));
      pux.position.set(x, -ALT / 2 + 0.07, PROF / 2 + 0.026);
      g.add(pux);
    }
  }
  return g;
}

/**
 * A GELADEIRA: duas portas de quina macia (o congelador em cima), puxadores
 * em pé, os pezinhos, e a porta de baixo cheia de ímãs — um coração, uma
 * estrela, um bilhetinho preso. Frente: +Z.
 */
export function geladeira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'geladeira';
  const L = 0.8;
  const A = 1.8;
  const PR = 0.7;
  const corpo = new THREE.Mesh(macia(L, A - 0.04, PR - 0.04, 0.05), toon(P.metalWhite));
  corpo.position.set(0, 0.04 + (A - 0.04) / 2, -0.02);
  g.add(corpo);
  for (const x of [-1, 1]) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8), toon(P.inoxEscuro));
    pe.position.set(x * (L / 2 - 0.08), 0.02, 0.2);
    g.add(pe);
  }
  // as portas: a de baixo e a do congelador
  const CORTE = 1.25;
  for (const [y0, y1] of [[0.06, CORTE - 0.01], [CORTE + 0.01, A - 0.02]] as const) {
    const porta = new THREE.Mesh(macia(L - 0.02, y1 - y0, 0.05, 0.04), toon(P.metalWhite));
    porta.position.set(0, (y0 + y1) / 2, PR / 2 - 0.02);
    g.add(porta);
    const pux = new THREE.Mesh(macia(0.03, Math.min(0.32, (y1 - y0) * 0.5), 0.03, 0.012), toon(P.inoxEscuro));
    pux.position.set(L / 2 - 0.08, y0 < 0.5 ? y1 - 0.25 : y0 + 0.17, PR / 2 + 0.025);
    g.add(pux);
  }
  // os ímãs da porta de baixo
  const imas: Array<[number, number, number, 'coracao' | 'estrela' | 'bola']> = [
    [-0.18, 1.05, P.imaRosa, 'coracao'],
    [0.05, 1.1, P.imaAmarelo, 'estrela'],
    [-0.05, 0.86, P.imaAzul, 'bola'],
  ];
  for (const [x, y, cor, forma] of imas) {
    const geo = forma === 'coracao' ? formaDeCoracao(0.05) : forma === 'estrela' ? formaDeEstrela(0.045) : new THREE.CylinderGeometry(0.03, 0.03, 0.015, 16).rotateX(Math.PI / 2);
    const ima = new THREE.Mesh(geo, toon(cor));
    ima.position.set(x, y, PR / 2 + 0.008);
    g.add(ima);
  }
  // o bilhetinho preso pelo ímã azul
  const bilhete = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.003), toon(P.cupula));
  bilhete.position.set(-0.05, 0.76, PR / 2 + 0.006);
  bilhete.rotation.z = 0.08;
  g.add(bilhete);
  return g;
}

function formaDeCoracao(tam: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.6, -0.1, -0.6, 0.45, -0.25, 0.45);
  s.bezierCurveTo(-0.08, 0.45, 0, 0.3, 0, 0.22);
  s.bezierCurveTo(0, 0.3, 0.08, 0.45, 0.25, 0.45);
  s.bezierCurveTo(0.6, 0.45, 0.6, -0.1, 0, -0.5);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: 8 });
  geo.scale(tam, tam, tam);
  return geo;
}

function formaDeEstrela(tam: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.5 : 0.22;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
  geo.scale(tam, tam, tam);
  return geo;
}

/**
 * A MESA DE JANTAR: tampo de quina macia com borda, pés palito abertos, um
 * caminho de mesa no meio e o vasinho de flores. Mesmo tamanho da antiga.
 */
export function mesaDeJantar(largura = 1.5, prof = 0.9): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesa-de-jantar';
  const ALT = 0.75;
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pe = pePalito(ALT - 0.03, P.woodDark, 0.03);
    pe.position.set(x * (largura / 2 - 0.14), 0, z * (prof / 2 - 0.12));
    pe.rotation.set(-z * 0.06, 0, x * 0.06);
    g.add(pe);
  }
  const travessa = new THREE.Mesh(macia(largura - 0.2, 0.06, prof - 0.16, 0.01), toon(P.woodDark));
  travessa.position.y = ALT - 0.06;
  g.add(travessa);
  const tampo = new THREE.Mesh(macia(largura, 0.05, prof, 0.02), toon(P.wood));
  tampo.position.y = ALT - 0.005;
  g.add(tampo);
  const caminho = new THREE.Mesh(macia(0.3, 0.006, prof + 0.06, 0.003), toon(P.cupula));
  caminho.position.y = ALT + 0.023;
  g.add(caminho);
  const vaso = new THREE.Mesh(new THREE.LatheGeometry(
    [[0, 0], [0.05, 0], [0.065, 0.05], [0.04, 0.12], [0.045, 0.15], [0, 0.15]].map(([r, y]) => new THREE.Vector2(r, y)), 16,
  ), toon(P.wallMint));
  vaso.position.y = ALT + 0.026;
  g.add(vaso);
  for (const [dx, dz, cor] of [[-0.03, 0, P.flowerPink], [0.03, 0.02, P.flowerYellow], [0, -0.03, P.metalWhite]] as const) {
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 4), toon(P.leafMid));
    cabo.position.set(dx, ALT + 0.026 + 0.2, dz);
    g.add(cabo);
    const flor = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), toon(cor));
    flor.scale.y = 0.75;
    flor.position.set(dx, ALT + 0.026 + 0.28, dz);
    g.add(flor);
  }
  return g;
}

/**
 * A CADEIRA DE JANTAR: pés palito, assento com almofadinha e encosto de ripas
 * em arco. Mesma frente da `chair` (encosto em -Z, quem senta olha +Z).
 */
export function cadeiraDeJantar(almofada: number = P.flowerPink): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cadeira-de-jantar';
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pe = pePalito(0.45, P.woodDark, 0.02);
    pe.position.set(x * 0.19, 0, z * 0.19);
    pe.rotation.set(-z * 0.05, 0, x * 0.05);
    g.add(pe);
  }
  const assento = new THREE.Mesh(macia(0.48, 0.05, 0.46, 0.02), toon(P.wood));
  assento.position.y = 0.46;
  g.add(assento);
  const fofa = new THREE.Mesh(macia(0.42, 0.05, 0.4, 0.025), toon(almofada));
  fofa.position.set(0, 0.505, 0.01);
  g.add(fofa);
  for (const x of [-1, 1]) {
    const montante = new THREE.Mesh(macia(0.04, 0.52, 0.04, 0.012), toon(P.wood));
    montante.position.set(x * 0.2, 0.74, -0.21);
    montante.rotation.x = -0.1;
    g.add(montante);
  }
  const arco = new THREE.Mesh(macia(0.46, 0.09, 0.04, 0.02), toon(P.wood));
  arco.position.set(0, 0.97, -0.235);
  arco.rotation.x = -0.1;
  g.add(arco);
  for (const x of [-0.1, 0, 0.1]) {
    const ripa = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), toon(P.wood));
    ripa.position.set(x, 0.74, -0.215);
    ripa.rotation.x = -0.1;
    g.add(ripa);
  }
  return g;
}

// ================================================================== sala

/**
 * O SOFÁ: braços redondos, duas almofadas de assento e duas de encosto (com o
 * vinco entre elas), pés palito e duas almofadinhas de enfeite tortas, uma
 * de cada cor. O assento fica na mesma altura do antigo (0,5), porque a cena
 * do sofá senta os dois nele. Frente: +Z, encosto em -Z.
 */
export function sofaFofo(cor: number = P.fabricRed, largura = 2.4): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'sofa';
  const tecido = toon(cor);
  const PES = 0.12;
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pe = pePalito(PES + 0.01, P.woodDark, 0.025);
    pe.position.set(x * (largura / 2 - 0.15), 0, z * 0.33);
    g.add(pe);
  }
  const base = new THREE.Mesh(macia(largura, 0.2, 0.9, 0.05), tecido);
  base.position.y = PES + 0.1;
  g.add(base);
  const encosto = new THREE.Mesh(macia(largura, 0.62, 0.24, 0.08), tecido);
  encosto.position.set(0, PES + 0.45, -0.33);
  g.add(encosto);
  for (const lado of [-1, 1]) {
    const braco = new THREE.Mesh(macia(0.24, 0.42, 0.9, 0.1), tecido);
    braco.position.set(lado * (largura / 2 - 0.12), PES + 0.3, 0);
    g.add(braco);
  }
  // as almofadas de assento e de encosto, metade da largura útil cada
  const util = largura - 0.48;
  for (const lado of [-1, 1]) {
    const assento = new THREE.Mesh(macia(util / 2 - 0.02, 0.14, 0.62, 0.06), tecido);
    assento.position.set(lado * (util / 4), PES + 0.27, 0.1);
    g.add(assento);
    const costas = new THREE.Mesh(macia(util / 2 - 0.03, 0.42, 0.16, 0.07), tecido);
    costas.position.set(lado * (util / 4), PES + 0.52, -0.16);
    costas.rotation.x = -0.12;
    g.add(costas);
  }
  // as almofadinhas de enfeite, tortas, nas pontas
  for (const [lado, c, giro] of [[1, P.flowerPink, 0.35], [-1, P.cupula, -0.3]] as const) {
    const almofada = new THREE.Mesh(macia(0.36, 0.34, 0.12, 0.06), toon(c));
    almofada.position.set(lado * (util / 2 - 0.2), PES + 0.52, -0.02);
    almofada.rotation.set(-0.35, giro * 0.5, giro);
    g.add(almofada);
  }
  return g;
}

/**
 * A MESINHA DE CENTRO: tampo oval de madeira com borda, prateleira de baixo
 * com revistas e pés palito. O tampo fica a 0,5, onde a cena põe a caneca.
 */
export function mesinhaDeCentro(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'mesinha-de-centro';
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pe = pePalito(0.46, P.woodDark, 0.025);
    pe.position.set(x * 0.46, 0, z * 0.22);
    pe.rotation.set(-z * 0.08, 0, x * 0.08);
    g.add(pe);
  }
  const tampo = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.05, 40), toon(P.wood));
  tampo.scale.z = 0.58;
  tampo.position.y = 0.475;
  g.add(tampo);
  const prateleira = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 32), toon(P.wood));
  prateleira.scale.z = 0.5;
  prateleira.position.y = 0.16;
  g.add(prateleira);
  [[P.fabricBlue, 0.1], [P.flowerPink, -0.15], [P.gold, 0.25]].forEach(([c, giro], i) => {
    const revista = new THREE.Mesh(macia(0.3, 0.012, 0.22, 0.004), toon(c as number));
    revista.position.set(-0.15 + i * 0.03, 0.18 + i * 0.013, 0);
    revista.rotation.y = giro as number;
    g.add(revista);
  });
  return g;
}

/**
 * O ABAJUR DE PÉ: três pernas de tripé abertas, haste fina e a cúpula de
 * tambor torneada (`LatheGeometry`), na mesma altura da antiga (1,68), que é
 * onde a cena pendura o halo. A cúpula chama `cupula`.
 */
export function abajurDePe(aceso = true): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'abajur-de-pe';
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const perna = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.95, 6), toon(P.woodDark));
    perna.position.set(Math.cos(a) * 0.13, 0.45, Math.sin(a) * 0.13);
    perna.rotation.set(Math.sin(a) * 0.28, 0, -Math.cos(a) * 0.28);
    g.add(perna);
  }
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.75, 8), toon(P.inoxEscuro));
  haste.position.y = 1.25;
  g.add(haste);
  const perfil = [[0.24, -0.17], [0.25, -0.15], [0.21, 0.15], [0.2, 0.17]].map(([r, y]) => new THREE.Vector2(r, y));
  const cupula = new THREE.Mesh(
    new THREE.LatheGeometry(perfil, 32),
    toon(aceso ? P.cupula : P.cupulaApagada, { glow: aceso ? 0.5 : 0, doubleSide: true }),
  );
  cupula.name = 'cupula';
  cupula.position.y = 1.68;
  g.add(cupula);
  // o friso de cima e o de baixo da cúpula
  for (const [y, r] of [[1.68 + 0.165, 0.205], [1.68 - 0.165, 0.245]] as const) {
    const friso = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 6, 32), toon(P.gold));
    friso.rotation.x = Math.PI / 2;
    friso.position.y = y;
    g.add(friso);
  }
  return g;
}

/**
 * A MÁQUINA DE LAVAR: quina macia, a escotilha redonda com o aro, o vidro e o
 * TAMBOR com roupa colorida dentro (o grupo `tambor`, que a cena gira quando a
 * máquina está ligada), o painel com o botão de girar e a gaveta do sabão.
 * Frente: +Z.
 */
export function maquinaDeLavar(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'maquina-de-lavar';
  const corpo = new THREE.Mesh(macia(0.66, 0.88, 0.64, 0.05), toon(P.metalWhite));
  corpo.position.y = 0.46;
  g.add(corpo);
  for (const x of [-1, 1]) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), toon(P.inoxEscuro));
    pe.position.set(x * 0.25, 0.015, 0.22);
    g.add(pe);
  }
  // o painel de cima: a gaveta do sabão, o botão de girar e as luzinhas
  const painel = new THREE.Mesh(macia(0.62, 0.13, 0.03, 0.012), toon(P.inox));
  painel.position.set(0, 0.82, 0.32);
  g.add(painel);
  const gaveta = new THREE.Mesh(macia(0.18, 0.08, 0.02, 0.008), toon(P.metalWhite));
  gaveta.position.set(-0.18, 0.82, 0.34);
  g.add(gaveta);
  const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.025, 20), toon(P.metalWhite));
  botao.rotation.x = Math.PI / 2;
  botao.position.set(0.16, 0.82, 0.345);
  g.add(botao);
  const marca = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.03, 0.004), toon(P.tvCorpo));
  marca.position.set(0.16, 0.835, 0.359);
  g.add(marca);
  for (let i = 0; i < 3; i++) {
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), toon(i === 0 ? P.leafLight : P.imaAzul, { glow: 0.6 }));
    luz.position.set(0.02 + i * 0.03, 0.82, 0.338);
    g.add(luz);
  }
  // a escotilha: aro grosso, e o tambor com a roupa atrás do vidro
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 12, 32), toon(P.inox));
  aro.position.set(0, 0.42, 0.32);
  g.add(aro);
  const tambor = new THREE.Group();
  tambor.name = 'tambor';
  tambor.position.set(0, 0.42, 0.3);
  const fundoTambor = new THREE.Mesh(new THREE.CircleGeometry(0.15, 28), toon(P.inoxEscuro));
  tambor.add(fundoTambor);
  [[0.06, 0.04, P.fabricBlue], [-0.06, -0.03, P.flowerPink], [0.0, -0.08, P.gold], [-0.05, 0.07, P.roupaListraManga]].forEach(([x, y, c]) => {
    const roupa = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), toon(c as number));
    roupa.scale.set(1.1, 0.8, 0.4);
    roupa.position.set(x as number, y as number, 0.01);
    tambor.add(roupa);
  });
  g.add(tambor);
  const vidro = new THREE.Mesh(new THREE.CircleGeometry(0.16, 28), toon(P.glass, { opacity: 0.45, glow: 0.1 }));
  vidro.position.set(0, 0.42, 0.335);
  g.add(vidro);
  return g;
}

/**
 * A PRATELEIRA DE PAREDE: tábua de quina macia em duas mãos-francesas, e em
 * cima uma fileira de livros com um tombado, uma jiboia pendendo pela borda e
 * uma vela num potinho. Pendure com `w.place(prateleira(), x, altura, z)`.
 */
export function prateleiraDeParede(largura = 1.0): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'prateleira-de-parede';
  const tabua = new THREE.Mesh(macia(largura, 0.04, 0.22, 0.012), toon(P.wood));
  g.add(tabua);
  for (const x of [-1, 1]) {
    // a mão sobe 5 mm por dentro do braço (sobrepor, e não encostar)
    const mao = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.125, 0.03), toon(P.tvCorpo));
    mao.position.set(x * (largura / 2 - 0.12), -0.0775, -0.08);
    g.add(mao);
    // o braço um fio mais fino e mais alto que a mão: com a mesma largura e o
    // pé do braço no topo da mão, as faces coincidiam no encontro
    const braco = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.025, 0.16), toon(P.tvCorpo));
    braco.position.set(x * (largura / 2 - 0.12), -0.0325, -0.02);
    g.add(braco);
  }
  // os livros, da esquerda, com o último tombado
  const cores = [P.metalRed, P.leafMid, P.gold, P.fabricBlue];
  let x = -largura / 2 + 0.06;
  cores.forEach((c, i) => {
    const larg = 0.045 + (i % 2) * 0.015;
    const alt = 0.2 + ((i * 3) % 4) * 0.02;
    const livro = new THREE.Mesh(macia(larg, alt, 0.15, 0.006), toon(c));
    const tombado = i === cores.length - 1;
    livro.position.set(x + larg / 2 + (tombado ? 0.05 : 0), 0.02 + alt / 2 - (tombado ? 0.02 : 0), 0);
    if (tombado) livro.rotation.z = -0.38;
    g.add(livro);
    x += larg + 0.006;
  });
  // a vela num potinho
  const pote = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 14), toon(P.cupula));
  pote.position.set(0.05, 0.05, 0.02);
  g.add(pote);
  const chama = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.luzDeAbajur, { glow: 0.9 }));
  chama.scale.y = 1.6;
  chama.position.set(0.05, 0.095, 0.02);
  g.add(chama);
  // a jiboia na ponta, com as folhas caindo pela borda
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.11, 14), toon(P.plantPot));
  vaso.position.set(largura / 2 - 0.12, 0.075, 0);
  g.add(vaso);
  const folhas = folhagem(10, 0.06, 23, true);
  folhas.position.set(largura / 2 - 0.12, 0.13, 0);
  g.add(folhas);
  return g;
}

// ============================================================== plantas

/**
 * A JIBOIA EM VASO (as duas plantas da sala): vaso torneado com pratinho,
 * terra, e um monte de folhas de coração (`folhaDeCoracao`) num
 * `InstancedMesh` com cor por folha — algumas subindo, outras caindo pela
 * borda, que é o jeito de uma jiboia.
 */
export function jiboiaEmVaso(escala = 1, corDoVaso: number = P.vasoCreme): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'jiboia';
  const s = escala;
  const prato = new THREE.Mesh(new THREE.CylinderGeometry(0.21 * s, 0.18 * s, 0.025 * s, 24), toon(corDoVaso));
  prato.position.y = 0.0125 * s;
  g.add(prato);
  const perfil = [
    [0, 0], [0.12, 0], [0.17, 0.05], [0.2, 0.16], [0.19, 0.27],
    [0.205, 0.28], [0.205, 0.31], [0.185, 0.31], [0.17, 0.29], [0, 0.29],
  ].map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const vaso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), toon(corDoVaso));
  vaso.position.y = 0.025 * s;
  g.add(vaso);
  const terra = new THREE.Mesh(new THREE.CircleGeometry(0.175 * s, 24), toon(P.terraDeVaso));
  terra.rotation.x = -Math.PI / 2;
  terra.position.y = (0.025 + 0.295) * s;
  g.add(terra);
  const folhas = folhagem(34, 0.16 * s, 7, true);
  folhas.position.y = (0.025 + 0.3) * s;
  g.add(folhas);
  return g;
}

/**
 * Um tufo de folhas de coração com a base na origem: `quantas` folhas de
 * `tam` metros, metade subindo em leque e (com `pendente`) um terço caindo
 * pela borda. Sorteio próprio, então a mesma planta sai sempre igual.
 */
function folhagem(quantas: number, tam: number, semente: number, pendente = false): THREE.InstancedMesh {
  const folhas = new THREE.InstancedMesh(folhaDeCoracao(), toon(0xffffff, { doubleSide: true }), quantas);
  let sem = semente;
  const rnd = (): number => {
    sem = (sem * 16807) % 2147483647;
    return sem / 2147483647;
  };
  const cores = [P.leafMid, P.leafLight, P.leafDark, P.leafLight];
  const m = new THREE.Matrix4();
  for (let i = 0; i < quantas; i++) {
    const a = (i / quantas) * Math.PI * 2 + rnd() * 0.5;
    const cai = pendente && i % 3 === 2;
    // inclinação a partir da vertical: as do meio quase em pé, as de fora
    // abrindo, e as pendentes passando da horizontal para baixo
    // cada folha nasce de um cabo invisível: as de dentro sobem mais e ficam
    // quase em pé, as de fora abrem — é o que faz o tufo virar um montinho
    // redondo em vez de uma roseta rente à terra
    const dentro = rnd();
    const tomba = cai ? 1.8 + rnd() * 0.5 : 0.15 + (1 - dentro) * 0.9;
    const raio = cai ? tam * 0.75 : tam * (0.05 + (1 - dentro) * 0.45);
    const alto = cai ? 0 : tam * (0.3 + dentro * 1.2);
    const q = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(0, Math.PI / 2 - a, 0))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tomba));
    const esc = tam * (0.8 + rnd() * 0.4);
    m.compose(
      new THREE.Vector3(Math.cos(a) * raio, alto, Math.sin(a) * raio),
      q,
      new THREE.Vector3(esc, esc, esc),
    );
    folhas.setMatrixAt(i, m);
    folhas.setColorAt(i, new THREE.Color(cores[i % cores.length]));
  }
  folhas.instanceMatrix.needsUpdate = true;
  if (folhas.instanceColor) folhas.instanceColor.needsUpdate = true;
  return folhas;
}

/**
 * Uma folha de coração (de jiboia) de 1 m, com o cabinho na origem e a ponta
 * em +Y, olhando para +Z: a silhueta em `Shape`, dobrada de leve na nervura
 * do meio e curvada para fora na ponta.
 */
let folhaPronta: THREE.BufferGeometry | null = null;
function folhaDeCoracao(): THREE.BufferGeometry {
  if (folhaPronta) return folhaPronta;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-0.25, -0.12, -0.55, 0.1, -0.45, 0.42);
  s.bezierCurveTo(-0.34, 0.72, -0.1, 0.92, 0, 1.1);
  s.bezierCurveTo(0.1, 0.92, 0.34, 0.72, 0.45, 0.42);
  s.bezierCurveTo(0.55, 0.1, 0.25, -0.12, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 6);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.abs(x) * 0.22 + 0.18 * y * y);
  }
  geo.computeVertexNormals();
  folhaPronta = geo;
  return geo;
}

// ============================================================ porta da rua

/**
 * A PORTA DA RUA: folha de madeira com quatro almofadas em relevo dos DOIS
 * lados (ela é vista de dentro e, girando a câmera, de fora), maçaneta
 * redonda com espelho, olho mágico, soleira de pedra no chão, batente com
 * guarnição e uma plaquinha de número em cima, do lado da sala.
 *
 * Mesmo contrato da `interiorDoor`: a folha mora na `dobradica` (lateral
 * esquerda) e a porta vai CENTRADA na linha da parede. O vão que ela pede tem
 * `largura + 0.2` (folha mais os dois batentes): é essa a medida que a cena
 * deixa aberta na parede, sem mureta passando por baixo.
 *
 * Frente: +Z.
 */
export function portaDaRua(cor: number = P.woodDark, largura = 0.95, altura = 2.1): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'porta-da-rua';
  const ESP = 0.06;
  const BAT = 0.1; // largura do batente
  const PROF = 0.24; // mais fino que a parede (0,3): não divide plano com ela
  const FACE = 0.15; // a face da parede (meia espessura): a guarnição fica à frente dela

  // a soleira: uma régua de pedra no chão, de um batente ao outro
  const soleira = new THREE.Mesh(macia(largura + BAT * 2, 0.025, PROF + 0.06, 0.008), toon(P.concrete));
  soleira.position.y = 0.0125;
  g.add(soleira);

  for (const lado of [-1, 1]) {
    const batente = new THREE.Mesh(new THREE.BoxGeometry(BAT, altura + BAT, PROF), toon(P.woodDark));
    batente.position.set(lado * (largura / 2 + BAT / 2), (altura + BAT) / 2, 0);
    g.add(batente);
  }
  // A verga ENCAIXA entre os dois batentes (1 mm dentro de cada um), um dedo
  // mais rasa e 5 mm mais baixa: com a mesma largura total e a mesma
  // profundidade, as faces dela e as dos batentes caíam nos mesmos planos.
  const verga = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.002, BAT - 0.005, PROF - 0.02), toon(P.woodDark));
  verga.position.y = altura + (BAT - 0.005) / 2;
  g.add(verga);
  // a guarnição: a moldura arredondada que cobre a junta do batente com a
  // parede, nas duas faces
  for (const face of [-1, 1]) {
    for (const lado of [-1, 1]) {
      const g1 = new THREE.Mesh(macia(0.06, altura + BAT + 0.05, 0.03, 0.01), toon(P.wood));
      g1.position.set(lado * (largura / 2 + BAT - 0.02), (altura + BAT + 0.05) / 2, face * (FACE + 0.012));
      g.add(g1);
    }
    const topo = new THREE.Mesh(macia(largura + BAT * 2 + 0.06, 0.06, 0.03, 0.01), toon(P.wood));
    topo.position.set(0, altura + BAT + 0.02, face * (FACE + 0.012));
    g.add(topo);
  }

  // a folha, na dobradiça
  const dobradica = new THREE.Group();
  dobradica.name = 'dobradica';
  dobradica.position.x = -largura / 2;
  g.add(dobradica);
  const folha = new THREE.Mesh(macia(largura - 0.01, altura - 0.03, ESP, 0.015), toon(cor));
  folha.position.set(largura / 2, 0.025 + (altura - 0.03) / 2, 0);
  dobradica.add(folha);
  // as quatro almofadas, nas duas faces: duas compridas em cima, duas curtas
  // embaixo, cada uma um degrauzinho saltado da folha
  const larg = (largura - 0.3) / 2;
  const almofadas: Array<[number, number, number]> = [
    [-1, altura * 0.66, altura * 0.42],
    [1, altura * 0.66, altura * 0.42],
    [-1, altura * 0.22, altura * 0.28],
  ];
  almofadas.push([1, altura * 0.22, altura * 0.28]);
  for (const face of [-1, 1]) {
    for (const [lado, y, alto] of almofadas) {
      const almofada = new THREE.Mesh(macia(larg, alto, 0.02, 0.01), toon(cor));
      almofada.position.set(largura / 2 + lado * (larg / 2 + 0.05), y, face * (ESP / 2 + 0.006));
      dobradica.add(almofada);
    }
    // a maçaneta: espelho (a plaquinha) e a bola
    const espelho = new THREE.Mesh(macia(0.05, 0.16, 0.012, 0.006), toon(P.gold));
    espelho.position.set(largura - 0.11, altura * 0.47, face * (ESP / 2 + 0.006));
    dobradica.add(espelho);
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), toon(P.gold, { glow: 0.15 }));
    bola.position.set(largura - 0.11, altura * 0.47, face * (ESP / 2 + 0.04));
    dobradica.add(bola);
  }
  // o olho mágico, no meio, na altura do olho
  const olho = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, ESP + 0.02, 12), toon(P.gold));
  olho.rotation.x = Math.PI / 2;
  olho.position.set(largura / 2, altura * 0.78, 0);
  dobradica.add(olho);

  // a plaquinha do número, em cima da verga, do lado da frente
  const placa = new THREE.Mesh(macia(0.22, 0.12, 0.02, 0.02), toon(P.cupula));
  placa.position.set(0, altura + BAT + 0.14, FACE + 0.035);
  g.add(placa);
  const coracao = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), toon(P.heart));
  coracao.scale.set(1.2, 1, 0.5);
  coracao.position.set(0, altura + BAT + 0.14, FACE + 0.047);
  g.add(coracao);
  return g;
}
