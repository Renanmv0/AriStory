import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { fundir } from '../../world/fundir';
import { folhasSecas } from '../../world/acampamento';
import { LoteDeAboboras, type CaraDeAbobora, type TamanhoDeAbobora, CARAS, ABOBORA } from '../../world/halloween/abobora';
import { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import {
  LapidesFofas, arcoDeBaloes, caldeirao, chapeuDeBruxa, espantalhoDeBoasVindas, fardoDeFeno, guirlanda,
  lencolDaBilheteria, panoDeFechado, plaquinhaDeRecado, pompom,
} from '../../world/halloween/pecas';
import { NessieNoLago, type LagoDoNessie } from '../../world/halloween/nessie';
import { eventoLiberado, faseDoHalloween, parqueEnfeitado } from './fase';
import { RECADOS_DO_PARQUE } from './recados';
import { ausentarNaCena, type Ausente, type RecadoNoPosto } from './ausentes';

/*
 * O PARQUE ENFEITADO (`docs/HALLOWEEN.md`, §4.1, a etapa 2).
 *
 * Lida a carta da Estella (fase `convite`), o Villa Lobos amanhece no pôr do
 * sol todo enfeitado — e vazio: os personagens foram se arrumar, e no posto de
 * cada um fica uma plaquinha de recado. A dupla vai comentando o que vê no
 * caminho até a boutique.
 *
 * O EVENTO É UMA CAMADA (§8.3): sem o `?halloween`, ou fora das fases do
 * evento, este módulo não monta NADA. A cena chama `quemFoiSeArrumar(g)` no
 * começo (para não montar quem não está) e `montarHalloweenNoParque(w, …)`
 * no fim (o enfeite vai por cima do parque pronto, e acha as peças dele —
 * as árvores, os postes, a sorveteria — pelas etiquetas).
 *
 * TUDO EM LOTE: as abóboras do parque inteiro são um `LoteDeAboboras`, o que
 * se pendura (bandeirolas, lanternas, fantasminhas, morceguinhos, teias) é um
 * `EnfeitesDePendurar`, as lápides são um `LapidesFofas`, e as peças únicas
 * passam pela `fundir()`.
 */

/** o que o parque empresta ao evento: o que não tem etiqueta, e o lago */
export interface PecasDoParque {
  /** o lago (a `AguaDoLago`): o Nessie anda pela margem e deixa rastro */
  agua: LagoDoNessie;
  /** a vaga de rastro do Nessie (uma acima das dos bichos de sempre) */
  vagaDoNessie: number;
  /** a conta de distância dos caminhos (`world/caminhos.ts`): negativo é no asfalto */
  caminho: (x: number, z: number) => number;
  /** a roda gigante */
  roda: { group: THREE.Object3D; cabins: readonly THREE.Object3D[] };
  /** um ponto do trapiche, no referencial dele (a terra no zero, a ponta em `+Z`) levado ao mundo */
  doTrapiche: (lx: number, lz: number) => { x: number; z: number };
  trapiche: { comprimento: number; altura: number };
  /** os lugares sem etiqueta */
  piquenique: { x: number; z: number };
  cestasDeDisco: ReadonlyArray<{ x: number; z: number }>;
  lojaDePatins: { x: number; z: number; balcao: { x: number; z: number } };
  /** a fachada da boutique (`x`), o meio da porta (`z`) */
  boutique: { x: number; z: number };
  xadrez: { x: number; z: number };
  pontoDeOnibus: { x: number; z: number };
  sorveteria: { x: number; z: number };
  /** onde o Mano, o Cookie e a Estella ficam (as plaquinhas vão no lugar deles) */
  postos: { mano: { x: number; z: number }; cookie: { x: number; z: number }; estella: { x: number; z: number } };
  /** o piquenique das coelhinhas, se ele está montado nesta visita */
  piqueniqueDasCoelhinhas: { x: number; z: number } | null;
  /** quem foi se arrumar (o corpo e o barulho): some do parque na fase `convite` */
  ausentes: ReadonlyArray<Ausente>;
  /** o centro da clareira e o raio dela: lá não vai enfeite */
  clareira: { x: number; z: number; raio: number };
}

export interface HalloweenNoParque {
  /** o parque está enfeitado agora */
  readonly enfeitado: boolean;
}

const SEM_EVENTO: HalloweenNoParque = { enfeitado: false };

/** a câmera de sempre vem de `+X/+Z`: virada para ela, a frente aparece */
const PARA_A_CAMERA = Math.PI / 4;

export function montarHalloweenNoParque(w: WorldBuilder, pecas: PecasDoParque): HalloweenNoParque {
  const g0 = w.game;
  if (!eventoLiberado() || !parqueEnfeitado(g0)) return SEM_EVENTO;
  const convite = faseDoHalloween(g0) === 'convite';

  const enfeite = new THREE.Group();
  enfeite.name = 'halloween-no-parque';
  w.root.add(enfeite);
  const aboboras = new LoteDeAboboras();
  const pendurados = new EnfeitesDePendurar();
  const lapides = new LapidesFofas();
  const unica = <T extends THREE.Object3D>(obj: T, x: number, y: number, z: number, giro = 0): T => {
    obj.position.set(x, y, z);
    obj.rotation.y = giro;
    const f = fundir(obj);
    w.add(f);
    return f;
  };

  // ---------------------------------------- as peças do parque, pela etiqueta
  w.root.updateMatrixWorld(true);
  const etiquetadas = (peca: string): THREE.Object3D[] => {
    const lista: THREE.Object3D[] = [];
    w.root.traverse((o) => {
      if (o.userData?.peca === peca && !o.parent?.userData?.peca) lista.push(o);
    });
    return lista;
  };
  const caixa = new THREE.Box3();
  const tamanho = new THREE.Vector3();
  const longeDaClareira = (x: number, z: number): boolean => Math.hypot(x - pecas.clareira.x, z - pecas.clareira.z) > pecas.clareira.raio + 4;

  /** uma abóbora no chão, com o colisor dela (as pequenas não barram) */
  let caraDaVez = 0;
  const abobora = (x: number, z: number, t: TamanhoDeAbobora, opts: { giro?: number; y?: number; cara?: CaraDeAbobora | null; cor?: number; tomba?: number; simples?: boolean; raio?: number } = {}): void => {
    const cara = opts.cara === null ? undefined : (opts.cara ?? CARAS[caraDaVez++ % CARAS.length]);
    aboboras.por({ x, z, y: opts.y, tamanho: t, giro: opts.giro ?? PARA_A_CAMERA, cara, cor: opts.cor, tomba: opts.tomba, simples: opts.simples, raio: opts.raio });
    const r = opts.raio ?? ABOBORA[t].raio;
    if ((opts.y ?? 0) < 0.05 && r > 0.2) w.blockCircle(x, z, r * 0.85);
  };
  const coresDaPilha = [P.abobora, P.aboboraClara, P.aboboraFunda, P.aboboraCreme];

  // ============================================================ o portão
  // a cerca do parque corre em z ≈ 27,8, e a dupla chega pelo vão do meio
  // (nasce em `0; 26`): o arco fica À FRENTE dela, e não atrás — atrás, o alto
  // do arco cairia na frente da cabeça dos dois na câmera de sempre
  unica(arcoDeBaloes(6.0, 3.0), 0, 0, 22.6);
  for (const s of [-1, 1]) {
    w.blockCircle(s * 3.0, 22.6, 0.32);
    // um montinho de abóboras no pé de cada lado do arco
    abobora(s * 3.55, 22.9, 'media', { giro: PARA_A_CAMERA + s * 0.3 });
    abobora(s * 3.2, 23.45, 'pequena', { cara: null, cor: coresDaPilha[s > 0 ? 3 : 1], simples: true });
  }
  // os fardos de feno ladeando o vão da cerca, com a pilha de abóboras em cima
  for (const [x, z, giro] of [[-4.3, 26.6, 0.35], [4.4, 26.5, -0.3]] as const) {
    unica(fardoDeFeno(), x, 0, z, giro);
    w.blockBox(x, z, 0.55, 0.36, -giro);
    abobora(x - 0.18, z + 0.05, 'media', { y: 0.47, giro: PARA_A_CAMERA - 0.2 });
    abobora(x + 0.3, z - 0.08, 'pequena', { y: 0.47, cara: null, cor: P.aboboraCreme, tomba: 0.2 });
    abobora(x + 0.75, z + 0.42, 'pequena', { cara: null, cor: P.aboboraClara, simples: true });
    abobora(x - 0.7, z + 0.45, 'pequena', { cara: 'susto' });
  }
  unica(espantalhoDeBoasVindas(), -5.8, 0, 25.0, 0.75);
  w.blockCircle(-5.8, 25.0, 0.4);

  // ========================================= os postes: varais e abóboras
  const postes = etiquetadas('poste').map((p) => {
    caixa.setFromObject(p);
    return { x: p.position.x, z: p.position.z, alto: caixa.max.y };
  }).filter((p) => longeDaClareira(p.x, p.z));
  const posteEm = (x: number, z: number) => postes.find((p) => Math.hypot(p.x - x, p.z - z) < 0.5);
  // os varais correm AO LADO do caminho (de poste a poste da mesma fileira),
  // nunca por cima dele: atravessado, ele passaria na frente da dupla
  const VARAIS: Array<[[number, number], [number, number]]> = [
    [[-4, 20], [-4, 8]],
    [[-4, 8], [-4, -8]],
    [[4, 22], [4, 6]],
    [[-7.6, -11.4], [-12.2, -19]],
  ];
  for (const [[ax, az], [bx, bz]] of VARAIS) {
    const a = posteEm(ax, az);
    const b = posteEm(bx, bz);
    if (!a || !b) continue;
    const h = Math.min(a.alto, b.alto) * 0.72;
    pendurados.varal(new THREE.Vector3(a.x, h, a.z), new THREE.Vector3(b.x, h, b.z), { barriga: 0.5 + Math.hypot(a.x - b.x, a.z - b.z) * 0.02, lanternaACada: 6 });
  }
  // uma abóbora no pé de cada poste, do lado de fora do caminho
  postes.forEach((p, i) => {
    let melhor = { dx: 0.55, dz: 0.55, d: -Infinity };
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const dx = Math.sin(a) * 0.55;
      const dz = Math.cos(a) * 0.55;
      // longe do asfalto e, de preferência, do lado da câmera
      const d = pecas.caminho(p.x + dx, p.z + dz) + 0.25 * Math.cos(a - PARA_A_CAMERA);
      if (d > melhor.d) melhor = { dx, dz, d };
    }
    abobora(p.x + melhor.dx, p.z + melhor.dz, i % 3 === 0 ? 'media' : 'pequena', { giro: PARA_A_CAMERA + ((i % 5) - 2) * 0.2 });
  });

  // =============================================== as árvores do parque
  const arvores = etiquetadas('arvore').filter((a) => longeDaClareira(a.position.x, a.position.z));
  arvores.forEach((arvore, i) => {
    caixa.setFromObject(arvore);
    caixa.getSize(tamanho);
    const raio = Math.min(tamanho.x, tamanho.z) / 2;
    const alto = tamanho.y;
    // do lado da câmera, girando um pouco de árvore para árvore
    const a = PARA_A_CAMERA + ((i * 1.7) % 1.6) - 0.8;
    const x = arvore.position.x + Math.sin(a) * raio * 0.6;
    const z = arvore.position.z + Math.cos(a) * raio * 0.6;
    const galho = alto * 0.42;
    switch (i % 4) {
      case 0:
        pendurados.fantasminha(x, galho, z, PARA_A_CAMERA, 0.9 + (i % 3) * 0.1);
        break;
      case 1:
        pendurados.morcego(x, galho + 0.1, z, PARA_A_CAMERA + 0.3);
        pendurados.morcego(arvore.position.x + Math.sin(a + 1.4) * raio * 0.55, galho + 0.3, arvore.position.z + Math.cos(a + 1.4) * raio * 0.55, PARA_A_CAMERA - 0.2, 0.85);
        break;
      case 2: {
        // a teia em pé entre o tronco e a copa, de frente para a câmera
        const tx = arvore.position.x + Math.sin(PARA_A_CAMERA) * 0.32;
        const tz = arvore.position.z + Math.cos(PARA_A_CAMERA) * 0.32;
        pendurados.teia(tx, Math.min(1.25, alto * 0.25), tz, PARA_A_CAMERA, 0.42, { inclina: 0.1, aranha: i % 8 === 2 });
        break;
      }
      default:
        pendurados.fantasminha(x, galho, z, PARA_A_CAMERA, 0.8);
        pendurados.morcego(arvore.position.x + Math.sin(a - 1.5) * raio * 0.5, galho + 0.25, arvore.position.z + Math.cos(a - 1.5) * raio * 0.5, PARA_A_CAMERA);
    }
  });

  // ================================================== a sorveteria do Mano
  {
    const s = pecas.sorveteria;
    if (convite) unica(panoDeFechado(2.3, 0.45, 0.4), s.x, 1.17, s.z + 1.32);
    for (const dx of [-0.75, 0, 0.75]) pendurados.morcego(s.x + dx, 2.42, s.z + 1.05, 0, 0.8);
  }
  // uma abóbora em cada mesinha da praça de gelo, e o chapéu de bruxa no boneco de neve
  etiquetadas('mesa-de-sorveteria').forEach((m, i) => {
    abobora(m.position.x + 0.16, m.position.z - 0.1, 'pequena', { y: 0.755, giro: PARA_A_CAMERA + i * 0.4, cara: CARAS[i % 4] });
  });
  for (const b of etiquetadas('boneco-de-neve')) {
    caixa.setFromObject(b);
    // a cabeça é a bola de cima: o chapéu senta um palmo abaixo do topo da caixa (a cenoura não conta)
    const chapeu = unica(chapeuDeBruxa(), b.position.x, caixa.max.y - 0.12, b.position.z, b.rotation.y);
    chapeu.scale.setScalar(0.72);
    chapeu.rotation.z = 0.12;
  }

  // ============================================== a bilheteria e a roda
  for (const b of etiquetadas('bilheteria')) {
    unica(lencolDaBilheteria(), b.position.x, 0, b.position.z, b.rotation.y);
    // a abóbora gigante ao lado (do tamanho do Cookie: ele gosta de coisa pequena, mas essa é dele)
    abobora(b.position.x - 2.55, b.position.z + 1.5, 'grande', { raio: 0.62, giro: PARA_A_CAMERA + 0.2, cara: 'sorriso' });
    abobora(b.position.x - 1.9, b.position.z + 2.25, 'pequena', { cara: null, cor: P.aboboraCreme, simples: true });
  }
  // o caldeirão no meio da praça (vazio de manhã; na festa ele enche)
  unica(caldeirao(), -3.6, 0, -13.9, 0.4);
  w.blockCircle(-3.6, -13.9, 0.42);
  // na roda: uma abóbora pendurada na frente de cada gôndola, e morceguinhos de papel colados nos raios
  const daRoda = new LoteDeAboboras();
  pecas.roda.cabins.forEach(() => daRoda.por({ x: 0, z: 0, tamanho: 'pequena', cara: 'sorriso', simples: true }));
  const aboborasDaRoda = daRoda.montar();
  pecas.roda.group.add(aboborasDaRoda);
  const naRoda = new EnfeitesDePendurar();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.13;
    const r = 6.4 + (i % 3) * 1.6;
    naRoda.recorte('morcego', Math.cos(a) * r, Math.sin(a) * r, 0.95, 0, 1.4);
    naRoda.recorte('morcego', Math.cos(a + 0.2) * (r - 1), Math.sin(a + 0.2) * (r - 1), -0.95, Math.PI, 1.2);
  }
  const aro = pecas.roda.group.getObjectByName('aro');
  const naRodaMontado = naRoda.montar();
  (aro ?? pecas.roda.group).add(naRodaMontado);
  const malhasDaRoda = aboborasDaRoda.children.filter((c): c is THREE.InstancedMesh => (c as THREE.InstancedMesh).isInstancedMesh);
  malhasDaRoda.forEach((m) => { m.frustumCulled = false; });
  const matriz = new THREE.Matrix4();
  const moverAboborasDaRoda = (): void => {
    const r = ABOBORA.pequena.raio * 1.15;
    pecas.roda.cabins.forEach((c, i) => {
      // pendurada na frente da gôndola, embaixo da janela, virada para fora
      matriz.compose(new THREE.Vector3(c.position.x, c.position.y - 1.35 - 0.62, 0.88), new THREE.Quaternion(), new THREE.Vector3(r, r, r));
      malhasDaRoda.forEach((m) => m.setMatrixAt(i, matriz));
    });
    malhasDaRoda.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
  };
  moverAboborasDaRoda();

  // ===================================== a loja de patins e o campinho
  {
    const L = pecas.lojaDePatins;
    abobora(L.balcao.x + 0.05, L.balcao.z + 0.7, 'pequena', { y: 1.07, cara: 'piscando' });
    const placa = unica(plaquinhaDeRecado([{ texto: 'Patins assombrados', assinatura: '👻🛼', letra: 'kalam', tinta: P.lanternaRoxa }], { largura: 0.7, altura: 0.42 }), L.x - 2.6, 0, L.z + 3.15, PARA_A_CAMERA - 0.3);
    placa.userData.peca = 'placa-patins-assombrados';
    w.blockCircle(L.x - 2.6, L.z + 3.15, 0.35);
  }
  for (const c of pecas.cestasDeDisco) pendurados.fantasminha(c.x + 0.42, 1.82, c.z + 0.2, PARA_A_CAMERA, 0.75);
  for (const a of etiquetadas('arquibancada')) {
    caixa.setFromObject(a);
    const meio = caixa.getCenter(new THREE.Vector3());
    abobora(meio.x - 1.6, meio.z + 0.4, 'media', { y: caixa.max.y * 0.5, giro: PARA_A_CAMERA });
    abobora(meio.x + 1.2, meio.z - 0.2, 'pequena', { y: caixa.max.y * 0.75, cara: 'dentinho' });
  }

  // ======================================= a arena e o piquenique
  for (const s of etiquetadas('suporte-de-raquetes')) {
    caixa.setFromObject(s);
    pendurados.teia(s.position.x + 0.05, caixa.max.y * 0.7, s.position.z + 0.15, s.rotation.y, 0.32, { aranha: true });
  }
  for (const p of etiquetadas('placar-de-ping-pong')) {
    caixa.setFromObject(p);
    abobora(p.position.x, p.position.z, 'pequena', { y: caixa.max.y - 0.01, giro: p.rotation.y, cara: 'sorriso' });
  }
  abobora(pecas.piquenique.x + 0.1, pecas.piquenique.z, 'media', { y: 0.76, cara: 'sorriso', giro: PARA_A_CAMERA });

  // ============================================================== o lago
  for (const lx of [-0.55, 0.55]) {
    const p = pecas.doTrapiche(lx, pecas.trapiche.comprimento - 0.35);
    abobora(p.x, p.z, lx < 0 ? 'media' : 'pequena', { y: pecas.trapiche.altura, giro: PARA_A_CAMERA });
  }
  for (const placa of etiquetadas('placa-do-lago')) {
    caixa.setFromObject(placa);
    pendurados.teia(placa.position.x + 0.25, caixa.max.y * 0.55, placa.position.z + 0.12, placa.rotation.y, 0.3, { aranha: true });
  }
  const nessie = new NessieNoLago(pecas.agua, pecas.vagaDoNessie);
  w.add(nessie.group);

  // ===================================================== a boutique
  {
    const B = pecas.boutique;
    // a guirlanda na porta, as teias nos cantos da vitrine e as abóboras na calçada
    unica(guirlanda(0.34), B.x + 0.1, 1.95, B.z, Math.PI / 2);
    pendurados.teia(B.x + 0.06, 2.55, B.z - 4.3, Math.PI / 2, 0.5, { aranha: true });
    pendurados.teia(B.x + 0.06, 2.6, B.z + 4.35, Math.PI / 2, 0.42, { aranha: false });
    pendurados.varal(new THREE.Vector3(B.x + 0.95, 2.95, B.z - 5.4), new THREE.Vector3(B.x + 0.95, 2.95, B.z + 5.4), { barriga: 0.35, passo: 0.45 });
    abobora(B.x + 0.75, B.z - 1.75, 'media', { giro: Math.PI / 2 - 0.3 });
    abobora(B.x + 0.6, B.z - 2.25, 'pequena', { cara: null, cor: P.aboboraCreme, simples: true });
    abobora(B.x + 0.75, B.z + 1.8, 'media', { giro: Math.PI / 2 + 0.2, cara: 'dentinho' });
    abobora(B.x + 0.6, B.z + 2.3, 'pequena', { cara: null, cor: P.aboboraClara, simples: true });
    // a aranhinha de feltro de guarda no tabuleiro de xadrez
    pendurados.aranhinha(pecas.xadrez.x, 0.8, pecas.xadrez.z, PARA_A_CAMERA, 1.6);
  }

  // ============================================ o ponto de ônibus
  {
    const p = pecas.pontoDeOnibus;
    const chapeu = unica(chapeuDeBruxa(), p.x + 0.15, 2.68, p.z, -0.6);
    chapeu.scale.setScalar(1.35);
    const placa = unica(plaquinhaDeRecado([{ texto: 'Ponto Assombrado', assinatura: '🚌👻', letra: 'kalam', tinta: P.aboboraFunda }], { largura: 0.7, altura: 0.42 }), p.x - 1.4, 0, p.z - 2.6, -0.6);
    placa.userData.peca = 'placa-ponto-assombrado';
    w.blockCircle(p.x - 1.4, p.z - 2.6, 0.35);
    abobora(p.x - 1.0, p.z - 1.9, 'pequena', { cara: 'susto', giro: -0.4 });
  }

  // ================================================= as lápides fofas
  const CEMITERIOS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
    [[-14.4, -13.4], [-13.2, -14.5], [-15.3, -14.6]],
    [[23.6, 16.6], [24.7, 15.6], [24.6, 17.8]],
    [[-6.0, 13.0], [-6.8, 14.3]],
    [[-18.6, -21.4], [-17.3, -22.4]],
    [[22.2, -20.5], [23.5, -21.3], [21.6, -21.8]],
    [[-30.5, 0.5], [-29.4, 1.6]],
  ];
  let frase = 0;
  CEMITERIOS.forEach((grupo, k) => grupo.forEach(([x, z], i) => {
    lapides.por(x, z, PARA_A_CAMERA + (i - 1) * 0.25 + k * 0.1, frase++, 0.95 + ((i + k) % 3) * 0.08);
    w.blockBox(x, z + 0.12, 0.3, 0.12, -(PARA_A_CAMERA + (i - 1) * 0.25 + k * 0.1));
  }));

  // =================================== as folhas secas na beira dos caminhos
  enfeite.add(folhasSecas(700, (rnd) => {
    const x = -12 + rnd() * 46;
    const z = -25 + rnd() * 60;
    const d = pecas.caminho(x, z);
    return d > -0.5 && d < 1.2 && Math.hypot(x, z + 26) > 9 ? [x, z] : null;
  }, 31));

  // ============================================== quem foi se arrumar
  if (convite) {
    const R = RECADOS_DO_PARQUE;
    const recados: RecadoNoPosto[] = [
      { recados: [R.mano], autor: 'Mano', x: pecas.postos.mano.x + 0.3, z: pecas.postos.mano.z + 0.2, giro: PARA_A_CAMERA - 0.2 },
      { recados: [R.cookie], autor: 'Cookie', x: pecas.postos.cookie.x, z: pecas.postos.cookie.z + 1.0, giro: PARA_A_CAMERA - 0.5 },
      { recados: [R.estella], autor: 'Estella', x: pecas.xadrez.x + 1.0, z: pecas.xadrez.z + 0.9, giro: Math.PI / 2 - 0.2 },
    ];
    if (pecas.piqueniqueDasCoelhinhas) {
      // a toalha ficou (o recado diz): só as três saíram, e os pompons esquecidos
      const c = pecas.piqueniqueDasCoelhinhas;
      recados.push({ recados: R.coelhinhas, autor: 'Luna', x: c.x + 1.6, z: c.z + 1.4, giro: PARA_A_CAMERA });
      const p1 = w.add(w.place(pompom(), c.x - 0.3, 0.05, c.z + 0.2));
      const p2 = w.add(w.place(pompom(P.aboboraClara, P.lanternaRoxa), c.x + 0.15, 0.05, c.z + 0.45));
      p1.scale.setScalar(1.2);
      p2.scale.setScalar(1.2);
    }
    // o quadro de inscrições da arena: o recado pregado na frente dos papéis
    for (const q of etiquetadas('quadro-de-inscricoes')) {
      const frente = { x: Math.sin(q.rotation.y), z: Math.cos(q.rotation.y) };
      recados.push({
        recados: [R.desafios], autor: 'Recado', modo: 'parede', y: 1.02, giro: q.rotation.y,
        x: q.position.x + frente.x * 0.09, z: q.position.z + frente.z * 0.09,
        lerEm: { x: q.position.x + frente.x * 1.1, z: q.position.z + frente.z * 1.1 },
      });
    }
    ausentarNaCena(w, {
      bichos: pecas.ausentes,
      interacoes: [
        'parque:mano', 'parque:sorveteria', 'parque:mesinha-*', 'parque:cookie', 'parque:bilheteria',
        'parque:roda-gigante', 'parque:estella', 'parque:xadrez', 'parque:jean-luc', 'parque:luna',
        'parque:sol', 'parque:estrella', 'parque:inscricoes',
      ],
      recados,
    });
  }

  // ====================================================== montar os lotes
  enfeite.add(aboboras.montar(), pendurados.montar(), lapides.montar());
  // a sombra só de quem tem corpo no chão: a casca das abóboras e a pedra das
  // lápides (a cara, o cabinho e o que balança no vento ficam sem: miúdos
  // demais para a sombra aparecer, e cada malha com sombra é um desenho a mais)
  enfeite.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.receiveShadow = true;
    m.castShadow = m.name.startsWith('casca-') || m.name === 'pedras';
  });

  // ============================================== o relógio do enfeite
  w.onUpdate((dt) => {
    pendurados.update(dt);
    naRoda.update(dt);
    nessie.update(dt);
    moverAboborasDaRoda();
  });

  enfeite.userData.contagem = {
    aboboras: aboboras.quantas,
    lapides: lapides.quantas,
    ...pendurados.contar(),
  };
  return { enfeitado: true };
}
