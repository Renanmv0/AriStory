import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import { medalhao, medidorDePasso } from '../fantasias';
import type { Mano } from '../../entities/bichos/Mano';
import type { Cookie } from '../../entities/bichos/Cookie';
import type { JeanLuc } from '../../entities/bichos/JeanLuc';
import type { PatoDoLago } from '../../entities/bichos/PatoDoLago';

/*
 * AS FANTASIAS DO PARQUE na festa de Halloween (`docs/HALLOWEEN.md`, §3, a
 * etapa 4): uma fantasia SÓ DE CADA UM (decisão do Renan), bem feita, fofa
 * e detalhada.
 *
 * - O MANO DE VAMPIRO, igual ao Ari de propósito: a capa preta de forro
 *   vermelho com a gola em pé, o babado no pescoço, o medalhão, as presinhas
 *   e o topete de gel. O chapéu de casquinha e o avental ficam em casa;
 * - O COOKIE DE FANTASMA DE LENÇOL gigante: o lençol caindo em dobras sobre o
 *   corpo e um capuz sobre a cabeça, os dois furinhos dos olhos, a tromba
 *   saindo pelo pano com um laço laranja na ponta, e as pernas de elefante
 *   aparecendo embaixo;
 * - O JEAN-LUC DE FANTASMA DA ÓPERA: a meia-máscara de porcelana, a capa de
 *   ópera preta com forro vinho, a cartolinha e uma rosa vermelha no bico;
 * - OS PATOS DE DIABINHO: a tiara de chifrinhos em todos, e a capinha
 *   vermelha nos grandes.
 *
 * CAMADA, como a Estella de aranha (`fantasiasDosBichos.ts`): a classe de
 * nenhum deles muda. As peças penduram nos grupos que a classe já tem,
 * achados pelo NOME (`cabeca-do-mano`, `cabeca-do-cookie`…) — a pose, o
 * cérebro e o passeio continuam os de sempre. O que fica escondido embaixo
 * da fantasia (o avental do Mano, o corpo do Cookie debaixo do lençol, a
 * boina do Jean-Luc) só fica invisível: nada é apagado.
 */

/** o mesmo pano do lado de dentro: a ordem dos triângulos invertida e a normal para dentro */
function avesso(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.clone();
  const ix = g.getIndex();
  if (ix) {
    for (let k = 0; k < ix.count; k += 3) {
      const t = ix.getX(k + 1);
      ix.setX(k + 1, ix.getX(k + 2));
      ix.setX(k + 2, t);
    }
  }
  const n = g.getAttribute('normal');
  if (n) for (let i = 0; i < n.count; i++) n.setXYZ(i, -n.getX(i), -n.getY(i), -n.getZ(i));
  return g;
}

/**
 * UMA CAPA DE BICHO: um torneado ABERTO na frente (só as costas e um tico dos
 * lados), do pescoço até a barra, com o forro de outra cor do lado de dentro.
 * `perfil` é [raio, altura] de cima para baixo; `abertura` é quanto da volta
 * ela cobre (centrada nas costas, `-Z`); `achata` encolhe o `z` (bicho de
 * corpo oval). A barra ondula de leve: pano de verdade não corta reto.
 */
export function capaDeBicho(
  perfil: ReadonlyArray<readonly [number, number]>, abertura: number, cor: number, forro: number, achata = 1,
): THREE.Group {
  const g = new THREE.Group();
  // de baixo para cima: é assim que o torneado vira a face para fora
  const pontos = [...perfil].reverse().map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pontos, 28, Math.PI - abertura / 2, abertura);
  geo.scale(1, 1, achata);
  // a barra ondulando: só a fileira de baixo desce e sobe, e as dobras puxam o raio
  const pos = geo.getAttribute('position');
  const yBarra = pontos[0].y;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const a = Math.atan2(x, z);
    const baixo = THREE.MathUtils.clamp(1 - (pos.getY(i) - yBarra) / 0.12, 0, 1);
    pos.setY(i, pos.getY(i) + baixo * 0.012 * Math.sin(a * 9));
    const dobra = 1 + baixo * 0.05 * Math.sin(a * 9);
    pos.setX(i, x * dobra);
    pos.setZ(i, z * dobra);
  }
  geo.computeVertexNormals();
  const fora = new THREE.Mesh(geo, toon(cor));
  fora.name = 'capa-fora';
  g.add(fora);
  const dentro = new THREE.Mesh(avesso(geo), toon(forro));
  dentro.name = 'capa-forro';
  g.add(dentro);
  return g;
}

/**
 * A capa balança com o passo de quem a veste: andando para a frente, ela
 * abre para trás (`rotation.x` negativo, a partir do pescoço).
 */
export function balancarComOPasso(capa: THREE.Object3D, quem: THREE.Object3D, quanto = 0.35): void {
  const passo = medidorDePasso();
  let antes = performance.now();
  // o gatilho do quadro mora numa MALHA (grupo não é desenhado)
  let malha: THREE.Mesh | undefined;
  capa.traverse((o) => { if (!malha && (o as THREE.Mesh).isMesh) malha = o as THREE.Mesh; });
  if (!malha) return;
  malha.onBeforeRender = () => {
    const agora = performance.now();
    const dt = Math.min(0.1, (agora - antes) / 1000);
    antes = agora;
    if (dt <= 0) return;
    const v = passo(quem, dt);
    const alvo = -THREE.MathUtils.clamp(v, 0, 2) * quanto * 0.5 - 0.04 * Math.sin(agora / 700);
    capa.rotation.x += (alvo - capa.rotation.x) * Math.min(1, dt * 5);
  };
}

/** o filho de `pai` que está nesta posição (os grupos da classe não têm nome) */
function filhoEm(pai: THREE.Object3D, x: number, y: number, z: number): THREE.Object3D | null {
  return pai.children.find((o) => Math.abs(o.position.x - x) < 1e-3 && Math.abs(o.position.y - y) < 1e-3 && Math.abs(o.position.z - z) < 1e-3) ?? null;
}

// =========================================================== o Mano vampiro

/**
 * Veste o Mano de VAMPIRO. Devolve o grupo da fantasia (o teste acha pelo
 * nome `fantasia-de-vampiro`).
 */
export function fantasiarManoDeVampiro(mano: Mano): THREE.Group {
  const cabeca = mano.group.getObjectByName('cabeca-do-mano');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-vampiro';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);

  // o sorveteiro fica em casa: o chapéu de casquinha, o peitilho, as alças e o crachá
  const chapeu = cabeca.getObjectByName('chapeu-do-mano');
  if (chapeu) chapeu.visible = false;
  for (const [x, y, z] of [[0, 0.225, 0.135], [0, 0.305, 0.178], [-0.082, 0.41, 0.135], [0.082, 0.41, 0.135], [0.07, 0.315, 0.205]] as const) {
    const peca = filhoEm(corpo, x, y, z);
    if (peca) peca.visible = false;
  }

  // ----------------------------------------------------------- a capa
  // do pescoço (o peito acaba em 0,575) até quase o chão, aberta na frente:
  // as asinhas dele passam pelos lados e a barriga clara continua à mostra
  const pivo = new THREE.Group();
  pivo.name = 'capa-do-mano';
  pivo.position.set(0, 0.54, 0);
  const capa = capaDeBicho([[0.11, 0.0], [0.19, -0.07], [0.225, -0.2], [0.245, -0.36], [0.255, -0.5]], Math.PI * 1.05, P.vampiroCapa, P.vampiroForro, 0.92);
  pivo.add(capa);
  fantasia.add(pivo);
  balancarComOPasso(pivo, mano.group);

  // a GOLA EM PÉ, alta atrás da cabeça e abrindo para fora, com o forro vermelho
  // virado para a frente (é ele que se vê da câmera, por cima do ombro)
  const gola = capaDeBicho([[0.21, 0.28], [0.17, 0.14], [0.13, 0.04], [0.115, 0.0]], Math.PI * 0.95, P.vampiroCapa, P.vampiroForro, 0.95);
  gola.position.y = 0.53;
  fantasia.add(gola);

  // ----------------------------------------- o babado, o laço e o medalhão
  const babado = new THREE.Group();
  const camisa = toon(P.vampiroCamisa);
  for (let k = 0; k < 3; k++) {
    // três camadas de babado, cada uma mais larga e mais baixa
    const camada = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), camisa);
    camada.scale.set(0.05 + k * 0.012, 0.028, 0.03);
    camada.rotation.x = Math.PI;
    camada.position.set(0, 0.5 - k * 0.032, 0.17 + k * 0.006);
    babado.add(camada);
  }
  fantasia.add(babado);
  // a fita vermelha em V no pescoço, segurando o medalhão
  for (const lado of [-1, 1] as const) {
    const fita = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.13, 5), toon(P.vampiroForro));
    fita.position.set(lado * 0.045, 0.46, 0.165);
    fita.rotation.z = lado * 0.55;
    fita.rotation.x = -0.25;
    fantasia.add(fita);
  }
  const joia = medalhao(0.028, P.fivelaDourada, P.vampiroGema);
  joia.position.set(0, 0.415, 0.19);
  joia.rotation.x = -0.2;
  fantasia.add(joia);

  // ------------------------------------------- as presinhas e o topete de gel
  const presa = toon(P.vampiroPresa);
  for (const lado of [-1, 1] as const) {
    const dente = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.034, 6), presa);
    dente.rotation.x = Math.PI;
    dente.position.set(lado * 0.022, -0.046, 0.15);
    cabeca.add(dente);
  }
  // o GEL: o alto da cabeça penteado para trás, lido pelos fios de brilho
  // que correm da testa para a nuca (uma peça de cabelo por cima viraria
  // boina no pinguim, que já é escuro)
  const gel = toon(P.pinguimCasacoLuz, { glow: 0.2 });
  for (const [x, comp] of [[-0.03, 1.15], [0.028, 1.3]] as const) {
    const fio = new THREE.Mesh(new THREE.TorusGeometry(0.151, 0.0026, 4, 16, comp), gel);
    // um arco no plano YZ, do alto da testa até a nuca
    fio.rotation.set(0, Math.PI / 2, 0);
    fio.rotation.z = Math.PI / 2 - comp / 2 + 0.25;
    fio.position.x = x;
    fio.scale.set(1, 1, 1);
    cabeca.add(fio);
  }
  // a ponta do "bico de viúva", descendo na testa
  const bico = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 4), toon(P.vampiroCapa));
  bico.rotation.x = Math.PI + 0.55;
  bico.position.set(0, 0.105, 0.105);
  bico.scale.set(1, 1, 0.45);
  cabeca.add(bico);
  return fantasia;
}

// =========================================================== o Cookie fantasma

interface Elipsoide {
  c: THREE.Vector3;
  r: THREE.Vector3;
}

/** a maior distância, saindo de `o` na direção `d`, até a casca de algum elipsoide */
function ateACasca(o: THREE.Vector3, d: THREE.Vector3, formas: readonly Elipsoide[]): number {
  let melhor = 0;
  for (const { c, r } of formas) {
    // |(o + t d - c) / r|² = 1
    const ox = (o.x - c.x) / r.x;
    const oy = (o.y - c.y) / r.y;
    const oz = (o.z - c.z) / r.z;
    const dx = d.x / r.x;
    const dy = d.y / r.y;
    const dz = d.z / r.z;
    const a = dx * dx + dy * dy + dz * dz;
    const b = 2 * (ox * dx + oy * dy + oz * dz);
    const cc = ox * ox + oy * oy + oz * oz - 1;
    const disc = b * b - 4 * a * cc;
    if (disc < 0) continue;
    const t = (-b + Math.sqrt(disc)) / (2 * a);
    if (t > melhor) melhor = t;
  }
  return melhor;
}

/**
 * UM LENÇOL DEITADO SOBRE UM CORPO: a cúpula segue a casca da união dos
 * `formas` (um raio a partir do `centro`, mais a `folga` do pano), e da
 * borda da cúpula (`ateOnde` rad a partir do alto) o pano CAI reto até a
 * barra, que é `barra(ângulo)` — mais curta na frente, mais comprida atrás.
 * A barra ondula em `ondas` dobras, e as dobras crescem descendo.
 */
function lencolSobre(
  formas: readonly Elipsoide[], centro: THREE.Vector3,
  opts: { folga: number; ateOnde: number; barra: (a: number) => number; ondas: number; abre?: number },
): THREE.BufferGeometry {
  const VOLTA = 64;
  const CUPULA = 16;
  const QUEDA = 8;
  const pos: number[] = [];
  const d = new THREE.Vector3();
  const anel: THREE.Vector3[] = [];
  for (let j = 0; j <= CUPULA; j++) {
    const th = (j / CUPULA) * opts.ateOnde;
    for (let i = 0; i <= VOLTA; i++) {
      const a = (i / VOLTA) * Math.PI * 2;
      d.set(Math.sin(th) * Math.sin(a), Math.cos(th), Math.sin(th) * Math.cos(a));
      const t = ateACasca(centro, d, formas) + opts.folga;
      const p = centro.clone().addScaledVector(d, t);
      pos.push(p.x, p.y, p.z);
      if (j === CUPULA) anel.push(p);
    }
  }
  const abre = opts.abre ?? 1.08;
  for (let k = 1; k <= QUEDA; k++) {
    const f = k / QUEDA;
    for (let i = 0; i <= VOLTA; i++) {
      const a = (i / VOLTA) * Math.PI * 2;
      const q = anel[i];
      const yBarra = Math.min(q.y, opts.barra(a) + 0.04 * Math.sin(a * opts.ondas + 0.6));
      const dobra = 1 + f * (abre - 1) + f * f * 0.05 * Math.sin(a * opts.ondas);
      pos.push(centro.x + (q.x - centro.x) * dobra, q.y + (yBarra - q.y) * Math.pow(f, 0.85), centro.z + (q.z - centro.z) * dobra);
    }
  }
  const linhas = CUPULA + 1 + QUEDA;
  const idx: number[] = [];
  for (let j = 0; j < linhas - 1; j++) {
    for (let i = 0; i < VOLTA; i++) {
      const a = j * (VOLTA + 1) + i;
      const b = a + VOLTA + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // a face tem que olhar para FORA do centro: se não olha, vira o pano
  const n = geo.getAttribute('normal');
  const pp = geo.getAttribute('position');
  let soma = 0;
  for (let i = 0; i < n.count; i++) soma += n.getX(i) * (pp.getX(i) - centro.x) + n.getY(i) * (pp.getY(i) - centro.y) + n.getZ(i) * (pp.getZ(i) - centro.z);
  return soma < 0 ? avesso(geo) : geo;
}

/** um furinho de olho no lençol: um oval escuro colado no pano, virado pela normal */
function furinhoDeOlho(no: THREE.Vector3, normal: THREE.Vector3, raio: number): THREE.Mesh {
  const furo = new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 10), toon(P.olhoDeBoneco));
  furo.scale.set(0.8, 1.15, 0.22);
  furo.position.copy(no);
  furo.lookAt(no.clone().add(normal));
  return furo;
}

/** o laço laranja da ponta da tromba: as duas alças, o nó e as duas pontas soltas */
function lacoDaTromba(): THREE.Group {
  const g = new THREE.Group();
  const fita = toon(P.lacoDoCookie);
  const fundo = toon(P.lacoDoCookieFundo);
  for (const lado of [-1, 1] as const) {
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 6, 14), fita);
    alca.scale.set(1, 0.65, 0.6);
    alca.position.set(lado * 0.05, 0, 0);
    alca.rotation.z = lado * 0.25;
    g.add(alca);
    const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.075, 0.01), fundo);
    ponta.position.set(lado * 0.022, -0.05, 0.004);
    ponta.rotation.z = lado * 0.35;
    g.add(ponta);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), fita);
  no.scale.set(1, 1, 0.8);
  g.add(no);
  return g;
}

/**
 * Veste o Cookie de FANTASMA DE LENÇOL. O corpo de elefante fica escondido
 * debaixo do pano (só as quatro pernas e a tromba aparecem); o lençol do
 * corpo é do corpo, e o CAPUZ é da cabeça — ela sobe quando ele sonha com a
 * roda, e um pano só rasgaria.
 */
export function fantasiarCookieDeFantasma(cookie: Cookie): THREE.Group {
  const cabeca = cookie.group.getObjectByName('cabeca-do-cookie');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-fantasma';
  if (!cabeca || !corpo) return fantasia;

  // o que fica debaixo do pano: tudo do corpo menos as pernas (os grupos em
  // y 0,86) e a cabeça; da cabeça, tudo menos o primeiro gomo da tromba
  const gomoDaTromba = filhoEm(cabeca, 0, -0.12, 0.27);
  for (const o of corpo.children) {
    const perna = Math.abs(o.position.y - 0.86) < 1e-3 && !(o as THREE.Mesh).isMesh;
    if (o !== cabeca && !perna) o.visible = false;
  }
  for (const o of cabeca.children) if (o !== gomoDaTromba) o.visible = false;

  const pano = toon(P.fantasmaDePano, { doubleSide: true });

  // ------------------------------------------------------ o lençol do corpo
  const doCorpo = lencolSobre(
    [
      { c: new THREE.Vector3(0, 1.24, 0), r: new THREE.Vector3(0.6, 0.58, 0.82) },
      { c: new THREE.Vector3(0, 1.5, 0.3), r: new THREE.Vector3(0.5, 0.42, 0.4) },
    ],
    new THREE.Vector3(0, 1.3, 0.05),
    // cai até a altura do joelho dos lados e atrás; na frente o capuz cobre
    { folga: 0.05, ateOnde: 1.62, barra: (a) => 0.52 + 0.1 * Math.max(0, Math.cos(a)), ondas: 11, abre: 1.1 },
  );
  const lencol = new THREE.Mesh(doCorpo, pano);
  lencol.name = 'lencol-do-cookie';
  lencol.castShadow = true;
  fantasia.add(lencol);
  corpo.add(fantasia);

  // ------------------------------------------------- o capuz, com os olhos
  const capuz = new THREE.Group();
  capuz.name = 'capuz-do-cookie';
  const formasDaCabeca: Elipsoide[] = [
    { c: new THREE.Vector3(0, 0, 0), r: new THREE.Vector3(0.38, 0.36, 0.34) },
    { c: new THREE.Vector3(0.15, 0.25, 0.06), r: new THREE.Vector3(0.21, 0.2, 0.2) },
    { c: new THREE.Vector3(-0.15, 0.25, 0.06), r: new THREE.Vector3(0.21, 0.2, 0.2) },
    // as orelhas marcam o pano dos dois lados (elas ficam debaixo dele)
    { c: new THREE.Vector3(0.4, -0.04, -0.12), r: new THREE.Vector3(0.12, 0.36, 0.32) },
    { c: new THREE.Vector3(-0.4, -0.04, -0.12), r: new THREE.Vector3(0.12, 0.36, 0.32) },
  ];
  const centro = new THREE.Vector3(0, 0.05, 0);
  const geoCapuz = lencolSobre(formasDaCabeca, centro, {
    folga: 0.045,
    ateOnde: 1.9,
    // na frente ele para logo abaixo dos olhos (a tromba sai por baixo);
    // dos lados e atrás desce até cobrir o pescoço e a emenda com o lençol
    barra: (a) => -0.2 - 0.32 * (1 - Math.max(0, Math.cos(a))),
    ondas: 9,
    abre: 1.06,
  });
  const malhaDoCapuz = new THREE.Mesh(geoCapuz, pano);
  malhaDoCapuz.castShadow = true;
  capuz.add(malhaDoCapuz);
  // os dois furinhos, na direção dos olhos de verdade (que ficam debaixo)
  for (const lado of [-1, 1] as const) {
    const d = new THREE.Vector3(lado * 0.19, 0.02, 0.29).sub(centro).normalize();
    const t = ateACasca(centro, d, formasDaCabeca) + 0.045 + 0.006;
    const no = centro.clone().addScaledVector(d, t);
    capuz.add(furinhoDeOlho(no, d, 0.055));
  }
  // a boquinha em "o", um tico abaixo e entre os olhos
  {
    const d = new THREE.Vector3(0, -0.13, 0.33).sub(centro).normalize();
    const t = ateACasca(centro, d, formasDaCabeca) + 0.045 + 0.006;
    const boca = furinhoDeOlho(centro.clone().addScaledVector(d, t), d, 0.03);
    boca.scale.set(0.9, 0.75, 0.22);
    capuz.add(boca);
  }
  // as bochechas rosadas embaixo dos olhos: é o que deixa o fantasma fofo
  for (const lado of [-1, 1] as const) {
    const d = new THREE.Vector3(lado * 0.27, -0.09, 0.27).sub(centro).normalize();
    const t = ateACasca(centro, d, formasDaCabeca) + 0.045 + 0.004;
    const bochecha = furinhoDeOlho(centro.clone().addScaledVector(d, t), d, 0.045);
    bochecha.material = toon(P.bochechaDeBoneco);
    bochecha.scale.set(1.2, 0.7, 0.15);
    capuz.add(bochecha);
  }
  cabeca.add(capuz);

  // ------------------------------------------------- o laço na tromba
  let ponta: THREE.Object3D | null = gomoDaTromba;
  while (ponta) {
    const proximo: THREE.Object3D | undefined = ponta.children.find((o) => !(o as THREE.Mesh).isMesh);
    if (!proximo) break;
    ponta = proximo;
  }
  if (ponta) {
    const laco = lacoDaTromba();
    laco.position.set(0, -0.14, 0.04);
    laco.rotation.x = -0.3;
    laco.scale.setScalar(1.6);
    ponta.add(laco);
  }
  return fantasia;
}

// ===================================================== o Jean-Luc da ópera

/**
 * Veste o Jean-Luc de FANTASMA DA ÓPERA — ele é francês, e a ópera é de
 * Paris. A boina azul fica em casa.
 */
export function fantasiarJeanLucDaOpera(jeanLuc: JeanLuc): THREE.Group {
  const cabeca = jeanLuc.group.getObjectByName('cabeca-do-jean-luc');
  const pescoco = cabeca?.parent;
  const corpo = pescoco?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-da-opera';
  if (!cabeca || !pescoco || !corpo) return fantasia;
  corpo.add(fantasia);
  const boina = filhoEm(cabeca, 0, 0.085, -0.005);
  if (boina) boina.visible = false;

  // ----------------------------------------------- a meia-máscara
  // no lado do rosto que a câmera vê (o `+X`): da testa até a bochecha, em
  // volta do olho — o olho passa por ela, que é o furo da máscara. O Jean-Luc
  // é BRANCO: máscara branca nele sumia de longe (o Renan reparou). Ela é
  // de prata, com a borda e o aro do olho DOURADOS — é o contraste que lê.
  const R = 0.121;
  const PHI0 = Math.PI / 2 - 0.2;
  const PHI1 = Math.PI + 0.15;
  const TH0 = 0.45;
  const TH1 = 1.72;
  const mascara = new THREE.Group();
  mascara.name = 'mascara-da-opera';
  mascara.add(new THREE.Mesh(new THREE.SphereGeometry(R, 18, 12, PHI0, PHI1 - PHI0, TH0, TH1 - TH0), toon(P.mascaraDaOpera)));
  // o ponto da esfera (o mesmo jeito do three: `x = -cos φ sen θ`, `z = sen φ sen θ`)
  const naEsfera = (phi: number, th: number, r = R + 0.002): THREE.Vector3 =>
    new THREE.Vector3(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
  const borda: THREE.Vector3[] = [];
  const N = 10;
  for (let k = 0; k <= N; k++) borda.push(naEsfera(PHI0 + (PHI1 - PHI0) * (k / N), TH0));
  for (let k = 1; k <= N; k++) borda.push(naEsfera(PHI1, TH0 + (TH1 - TH0) * (k / N)));
  for (let k = 1; k <= N; k++) borda.push(naEsfera(PHI1 - (PHI1 - PHI0) * (k / N), TH1));
  for (let k = 1; k <= N; k++) borda.push(naEsfera(PHI0, TH1 - (TH1 - TH0) * (k / N)));
  const contorno = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(borda, true, 'centripetal'), 80, 0.0065, 5, true),
    toon(P.fivelaDourada),
  );
  mascara.add(contorno);
  // o furo do olho: um aro escuro em volta do olho de verdade, pousado na máscara
  const olho = new THREE.Vector3(0.055, 0.032, 0.078).normalize();
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.0045, 5, 18), toon(P.cartolaDaOpera));
  aro.position.copy(olho.clone().multiplyScalar(R + 0.003));
  aro.lookAt(olho.clone().multiplyScalar(1));
  aro.scale.set(1, 0.8, 1);
  mascara.add(aro);
  cabeca.add(mascara);

  // ----------------------------------------------- a cartolinha
  const cartola = new THREE.Group();
  cartola.name = 'cartola-da-opera';
  const feltro = toon(P.cartolaDaOpera);
  const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.05, 0.1, 18), feltro);
  copa.position.y = 0.06;
  cartola.add(copa);
  const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.009, 22), feltro);
  aba.scale.set(1, 1, 0.86);
  aba.position.y = 0.01;
  cartola.add(aba);
  const faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.0515, 0.0512, 0.02, 18, 1, true), toon(P.forroDaOpera));
  faixa.position.y = 0.025;
  cartola.add(faixa);
  cartola.scale.setScalar(1.3);
  cartola.position.set(-0.015, 0.096, -0.012);
  cartola.rotation.set(-0.12, 0, 0.22);
  cabeca.add(fundir(cartola));

  // ----------------------------------------------- a rosa no bico
  const rosa = new THREE.Group();
  rosa.name = 'rosa-no-bico';
  const caule = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.12, 5), toon(P.folhaDaRosa));
  caule.rotation.z = Math.PI / 2;
  caule.position.x = 0.02;
  rosa.add(caule);
  for (const [x, giro] of [[0.0, 0.5], [0.035, -0.6]] as const) {
    const folha = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 5), toon(P.folhaDaRosa));
    folha.scale.set(1.6, 0.35, 0.8);
    folha.position.set(x, 0.006, 0);
    folha.rotation.y = giro;
    rosa.add(folha);
  }
  const botao = new THREE.Group();
  botao.position.x = 0.085;
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), toon(P.rosaDaOperaFunda));
  botao.add(miolo);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const petala = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), toon(P.rosaDaOpera));
    petala.scale.set(0.9, 1, 0.5);
    petala.position.set(Math.cos(a) * 0.009, Math.sin(a) * 0.009, 0);
    petala.lookAt(petala.position.clone().multiplyScalar(3));
    botao.add(petala);
  }
  botao.rotation.y = Math.PI / 2;
  rosa.add(botao);
  // atravessada no bico, presa entre a espátula e a mandíbula, com a flor
  // para o lado da câmera
  rosa.scale.setScalar(1.7);
  rosa.position.set(-0.02, -0.03, 0.15);
  cabeca.add(fundir(rosa));

  // ----------------------------------------------- a capa de ópera
  const pivo = new THREE.Group();
  pivo.name = 'capa-da-opera';
  pivo.position.set(0, 0.43, 0.0);
  // curta e LARGA, de ópera: ela acaba antes do rabinho (em 0,235), que fica
  // à mostra embaixo, e abre bem para os lados, onde a câmera vê
  pivo.add(capaDeBicho([[0.075, 0.0], [0.16, -0.045], [0.215, -0.1], [0.245, -0.16], [0.265, -0.2]], Math.PI * 1.2, P.capaDaOpera, P.forroDaOpera, 1.12));
  fantasia.add(pivo);
  // a GOLA de ópera em pé atrás da cabeça, com o forro vinho virado para a
  // frente: é a mancha de cor que diz "capa" de longe
  const golaDeOpera = capaDeBicho([[0.165, 0.15], [0.13, 0.07], [0.09, 0.0]], Math.PI * 1.1, P.capaDaOpera, P.forroDaOpera, 1.05);
  golaDeOpera.position.y = 0.42;
  fantasia.add(golaDeOpera);
  // a gravata-borboleta preta por cima da gola da camisa
  const gravata = new THREE.Group();
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.05, 4), toon(P.capaDaOpera));
    asa.rotation.z = lado * Math.PI / 2;
    asa.position.x = lado * 0.024;
    asa.scale.set(1, 1, 0.5);
    gravata.add(asa);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), toon(P.forroDaOpera));
  gravata.add(no);
  gravata.position.set(0, 0.405, 0.1);
  gravata.rotation.x = -0.3;
  fantasia.add(fundir(gravata));
  balancarComOPasso(pivo, jeanLuc.group, 0.3);
  // o fecho dourado no pescoço
  const fecho = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toon(P.fivelaDourada));
  fecho.position.set(0, 0.43, 0.07);
  fantasia.add(fecho);
  return fantasia;
}

// ===================================================== os patos de diabinho

/**
 * Veste um pato do lago de DIABINHO: a tiara com os dois chifrinhos em
 * todos; a capinha vermelha só nos grandes (o filhote é só chifrinho).
 */
export function fantasiarPatoDeDiabinho(pato: PatoDoLago, filhote: boolean): THREE.Group {
  const cabeca = pato.group.getObjectByName('cabeca');
  const corpo = pato.group.getObjectByName('corpo');
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-diabinho';
  if (!cabeca || !corpo) return fantasia;
  const k = filhote ? 1.4 : 1;
  const r = 0.085 * k;

  // a tiara: um arco fino por cima da cabeça, de orelha a orelha
  const tiara = new THREE.Group();
  tiara.name = 'tiara-de-diabinho';
  const arco = new THREE.Mesh(new THREE.TorusGeometry(r * 1.02, r * 0.07, 5, 18, Math.PI), toon(P.tiaraDeDiabinho));
  // o arco nasce no plano XY: de lado a lado, por cima, um tico para trás
  arco.rotation.x = -0.25;
  tiara.add(arco);
  // os chifrinhos: um cone curvadinho de cada lado, abrindo para fora
  for (const lado of [-1, 1] as const) {
    const chifre = new THREE.Mesh(new THREE.ConeGeometry(r * 0.2, r * 0.55, 8), toon(P.chifreDeDiabinho));
    chifre.position.set(lado * r * 0.48, r * 0.98, -r * 0.08);
    chifre.rotation.z = -lado * 0.42;
    chifre.rotation.x = -0.2;
    tiara.add(chifre);
  }
  cabeca.add(fundir(tiara));

  if (!filhote) {
    // a capinha: um pedaço de casca por cima do lombo, preso no pescoço
    const capinha = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 8, Math.PI * 1.08, Math.PI * 0.84, 0.18, 1.0),
      toon(P.capinhaDeDiabinho, { doubleSide: true }),
    );
    capinha.name = 'capinha-de-diabinho';
    // por cima das asas (que deitam no lombo), e não entre elas
    capinha.scale.set(0.22, 0.185, 0.3);
    capinha.position.set(0, 0.04, -0.03);
    fantasia.add(capinha);
    // o laço da capinha, na base do pescoço
    const laco = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.009, 5, 16), toon(P.capinhaDeDiabinho));
    laco.rotation.x = Math.PI / 2 - 0.3;
    laco.position.set(0, 0.13, 0.15);
    fantasia.add(laco);
    corpo.add(fantasia);
  } else {
    corpo.add(fantasia);
  }
  return fantasia;
}
