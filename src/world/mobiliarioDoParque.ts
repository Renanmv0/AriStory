/**
 * O MOBILIÁRIO DO PARQUE: o poste de lanterna e a lixeira de ripa, da mesma
 * família do banco de praça (`bancoDePraca.ts`) — ferro fundido verde-garrafa,
 * madeira com veio e um fio de dourado.
 *
 * - **o poste** (`poste()`): base octogonal torneada com o anel dourado, a
 *   coluna CANELADA (o cilindro de 16 gomos com um sim, um não recolhido: a
 *   faceta do toon desenha cada canelura), os anéis, o capitel, quatro
 *   volutas segurando a bandeja e a lanterna sextavada de vidro ACESO
 *   afinando para baixo, com os montantes nas quinas, o telhadinho de abas
 *   e o pináculo; o halo em volta da lanterna e a poça de luz pintada no
 *   chão, fracos de dia;
 * - **a lixeira** (`lixeira()`): ripas de madeira em roda com dois aros de
 *   ferro, o saco escuro dobrado por cima da borda, o chapéu de chuva sobre
 *   três pezinhos (o lixo entra pelo vão) e a plaquinha de reciclagem;
 * - **a luz de verdade** (`LuzesDosPostes`): poucas `PointLight` (quatro) que
 *   acompanham a dupla e vão para os postes mais perto dela. Luz nova muda o
 *   shader da cena inteira e cada uma pesa em todo pixel iluminado: com um
 *   número FIXO de luzes, o shader é compilado uma vez, e o peso não cresce
 *   com o número de postes. A luz que vai trocar de poste apaga devagar antes
 *   (ela já está longe, fraca) e acende devagar no novo — sem estalo.
 *
 * Os dois têm o tamanho dos antigos (o poste ~3,9 de altura e 0,25 de raio
 * de pé; a lixeira 0,27 de raio): os colisores das cenas continuam valendo.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { uvEmMetros } from './acabamento';
import { fundir } from './fundir';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { veioDeMadeira } from './texturasDeCasa';

/** a altura do miolo da lanterna (onde mora a luz) */
export const POSTE = { lanterna: 3.34, raioDoPe: 0.25 } as const;

const v2 = (r: number, y: number): THREE.Vector2 => new THREE.Vector2(r, y);

/** o perfil `[raio, y]` girado (de baixo para cima, anti-horário: a face sai para fora) */
function torneado(perfil: Array<[number, number]>, gomos: number): THREE.LatheGeometry {
  return new THREE.LatheGeometry(perfil.map(([r, y]) => v2(r, y)), gomos);
}

/** um tubo de `a` até `b` (montante, pezinho) */
function haste(a: THREE.Vector3, b: THREE.Vector3, r: number, gomos = 6): THREE.BufferGeometry {
  const d = b.clone().sub(a);
  const geo = new THREE.CylinderGeometry(r, r, d.length(), gomos, 1, true);
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
  geo.translate(a.x + d.x / 2, a.y + d.y / 2, a.z + d.z / 2);
  return geo;
}

// ===================================================================== O POSTE

export function poste(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'poste';
  const ferro = toon(P.bancoFerro);
  const dourado = toon(P.gold);
  const vidro = toon(P.luzDoPoste, { glow: 0.85 });
  const peca = (geo: THREE.BufferGeometry, mat: THREE.Material, y = 0): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    g.add(m);
    return m;
  };

  // a base: oito faces, o degrau, a barriga afinando e o colarinho
  peca(torneado([
    [0.0001, 0], [0.25, 0], [0.25, 0.07], [0.215, 0.1], [0.195, 0.17], [0.16, 0.21],
    [0.13, 0.34], [0.112, 0.5], [0.135, 0.55], [0.135, 0.6], [0.095, 0.645], [0.0001, 0.65],
  ], 8), ferro);
  // o anel dourado no colarinho (um fio maior que ele: não divide a face)
  peca(new THREE.CylinderGeometry(0.142, 0.142, 0.03, 8, 1, true), dourado, 0.575);

  /*
   * A COLUNA CANELADA: 16 gomos, um sim e um não recolhidos para dentro. Sem
   * índice (cada face com a sua normal), o toon pinta cada canelura de um tom.
   */
  const ALTO = 2.26;
  const fuste = new THREE.CylinderGeometry(0.066, 0.08, ALTO, 16, 1, true);
  {
    const pos = fuste.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const j = i % 17;
      const k = j % 2 ? 0.84 : 1;
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i), pos.getZ(i) * k);
    }
  }
  const canelado = fuste.toNonIndexed();
  canelado.computeVertexNormals();
  peca(canelado, ferro, 0.64 + ALTO / 2);
  // os anéis: um no meio, dourado, e o de cima, de ferro
  peca(torneado([[0.07, -0.03], [0.095, -0.015], [0.095, 0.015], [0.07, 0.03]], 12), dourado, 1.75);
  // o capitel
  peca(torneado([[0.066, 2.86], [0.1, 2.9], [0.115, 2.95], [0.115, 2.98], [0.08, 3.01], [0.06, 3.03]], 12), ferro);

  /*
   * AS VOLUTAS: quatro braços que saem do capitel, abrem e enrolam embaixo
   * da bandeja da lanterna — a mesma voluta do braço do banco.
   */
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    const naRoda = (r: number, y: number): THREE.Vector3 => new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
    const curva = new THREE.CatmullRomCurve3([
      naRoda(0.07, 2.72), naRoda(0.15, 2.8), naRoda(0.2, 2.92), naRoda(0.19, 3.03),
      naRoda(0.15, 3.02), naRoda(0.15, 2.96), naRoda(0.18, 2.97),
    ], false, 'centripetal');
    peca(new THREE.TubeGeometry(curva, 12, 0.014, 5, false), ferro);
  }

  // a bandeja da lanterna, de seis faces (as quinas casam com as do vidro)
  peca(torneado([[0.0001, 3.04], [0.1, 3.04], [0.175, 3.085], [0.175, 3.12], [0.13, 3.135], [0.0001, 3.135]], 6), ferro);

  /*
   * A LANTERNA: o vidro aceso é um sextavado que afina para baixo, entre a
   * bandeja e o telhado; os montantes de ferro correm nas seis quinas.
   */
  const VIDRO = { baixo: 3.13, alto: 3.56, rBaixo: 0.15, rAlto: 0.205 };
  peca(new THREE.CylinderGeometry(VIDRO.rAlto, VIDRO.rBaixo, VIDRO.alto - VIDRO.baixo, 6, 1, true), vidro,
    (VIDRO.baixo + VIDRO.alto) / 2).name = 'vidro-aceso';
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const quina = (r: number, y: number): THREE.Vector3 => new THREE.Vector3(Math.sin(a) * (r + 0.006), y, Math.cos(a) * (r + 0.006));
    peca(haste(quina(VIDRO.rBaixo, VIDRO.baixo - 0.01), quina(VIDRO.rAlto, VIDRO.alto + 0.01), 0.013, 4), ferro);
  }
  // o telhadinho: a aba que sobra para fora, a água e o gargalo do pináculo
  peca(torneado([
    [0.0001, 3.545], [0.235, 3.545], [0.245, 3.57], [0.205, 3.6], [0.11, 3.71], [0.055, 3.77], [0.04, 3.8], [0.0001, 3.81],
  ], 6), ferro);
  peca(new THREE.SphereGeometry(0.038, 8, 6), dourado, 3.84);
  peca(new THREE.ConeGeometry(0.016, 0.12, 6), dourado, 3.93);

  // o halo da lanterna e a poça pintada no chão: fracos, é dia
  const halo = haloDeLampada(1.25, P.luzDoPoste, 0.45);
  halo.position.y = POSTE.lanterna;
  g.add(halo);
  const poca = pocaDeLuz(1.7, P.luzDoPoste, 0.1);
  poca.position.y = 0.012;
  g.add(poca);

  // onde a luz de verdade se pendura (o `LuzesDosPostes` acha por aqui)
  const lanterna = new THREE.Object3D();
  lanterna.name = 'lanterna-do-poste';
  lanterna.position.y = POSTE.lanterna;
  g.add(lanterna);

  return fundir(g);
}

// =================================================================== A LIXEIRA

/** a plaquinha de reciclagem: três setas em roda, brancas no verde do ferro */
let placaDeReciclagem: THREE.MeshBasicMaterial | null = null;
function materialDaPlaca(): THREE.MeshBasicMaterial {
  if (placaDeReciclagem) return placaDeReciclagem;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const c = (hex: number): string => `#${hex.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = c(P.bancoFerro);
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = c(P.gold);
    ctx.lineWidth = 6;
    ctx.strokeRect(5, 5, 118, 118);
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      const a0 = (k / 3) * Math.PI * 2 - Math.PI / 2 + 0.35;
      const a1 = a0 + Math.PI * 2 / 3 - 0.75;
      ctx.beginPath();
      ctx.arc(64, 68, 34, a0, a1);
      ctx.stroke();
      // a ponta da seta
      const px = 64 + Math.cos(a1) * 34;
      const py = 68 + Math.sin(a1) * 34;
      const t = a1 + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(px + Math.cos(t) * 14, py + Math.sin(t) * 14);
      ctx.lineTo(px + Math.cos(a1) * 11 - Math.cos(t) * 3, py + Math.sin(a1) * 11 - Math.sin(t) * 3);
      ctx.lineTo(px - Math.cos(a1) * 11 - Math.cos(t) * 3, py - Math.sin(a1) * 11 - Math.sin(t) * 3);
      ctx.closePath();
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  placaDeReciclagem = new THREE.MeshBasicMaterial({ map: tex });
  return placaDeReciclagem;
}

export function lixeira(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'lixeira';
  const ferro = toon(P.bancoFerro);
  const madeira = toon(P.wood, { mapa: veioDeMadeira() });
  const saco = toon(P.lixeiraSaco);
  const dourado = toon(P.gold);
  const peca = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  const R = 0.232;

  // o pé de ferro
  peca(torneado([[0.0001, 0], [0.255, 0], [0.255, 0.035], [0.225, 0.07], [0.0001, 0.07]], 14), ferro);
  // o saco: o forro escuro, o fundo lá dentro e a dobra por cima da borda
  peca(new THREE.CylinderGeometry(0.212, 0.2, 0.64, 14, 1, true), saco, 0, 0.39);
  peca(new THREE.CircleGeometry(0.205, 14).rotateX(-Math.PI / 2), saco, 0, 0.5);
  peca(torneado([[0.2, 0.7], [0.248, 0.715], [0.256, 0.735], [0.215, 0.748]], 14), saco);

  // as ripas em roda, com o veio
  const RIPAS = 14;
  for (let k = 0; k < RIPAS; k++) {
    const a = (k / RIPAS) * Math.PI * 2;
    const geo = new THREE.BoxGeometry(0.078, 0.62, 0.022);
    uvEmMetros(geo);
    const m = peca(geo, madeira, Math.sin(a) * R, 0.405, Math.cos(a) * R);
    m.rotation.y = a;
  }
  // os dois aros (abertos: um fio por fora das ripas)
  for (const y of [0.2, 0.6]) peca(new THREE.CylinderGeometry(0.25, 0.25, 0.035, 16, 1, true), ferro, 0, y, 0);

  // o chapéu de chuva: três pezinhos na borda, e o domo fechado embaixo
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + Math.PI / 6;
    peca(haste(new THREE.Vector3(Math.sin(a) * 0.2, 0.7, Math.cos(a) * 0.2), new THREE.Vector3(Math.sin(a) * 0.21, 0.845, Math.cos(a) * 0.21), 0.012), ferro);
  }
  peca(torneado([
    [0.0001, 0.84], [0.272, 0.84], [0.275, 0.86], [0.245, 0.9], [0.17, 0.945], [0.08, 0.972], [0.0001, 0.978],
  ], 16), ferro);
  peca(new THREE.SphereGeometry(0.03, 8, 6), dourado, 0, 0.995, 0);

  // a plaquinha de reciclagem na frente, sobre as ripas
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.13), materialDaPlaca());
  placa.position.set(0, 0.42, R + 0.014);
  g.add(placa);

  return fundir(g);
}

// ========================================================= A LUZ DE VERDADE

/**
 * As LUZES DE VERDADE dos postes: `quantas` `PointLight` que vão para os
 * postes mais perto do `foco` (a dupla). A cena faz:
 *
 * ```ts
 * const luzes = new LuzesDosPostes(w.root);
 * w.add(luzes.grupo);
 * w.onUpdate((dt) => luzes.update(dt, g.playerPosition()));
 * ```
 *
 * Os postes são achados na primeira atualização (todos que a cena montou,
 * pela `lanterna-do-poste`). `noite` (0 a 1) é da cena: a clareira sobe ao
 * anoitecer, e a luz fica mais forte.
 */
export class LuzesDosPostes {
  readonly grupo = new THREE.Group();
  /** 0 de dia, 1 de noite */
  noite = 0;
  private readonly luzes: THREE.PointLight[] = [];
  private readonly dono: number[] = [];
  private postes: THREE.Vector3[] | null = null;

  constructor(private readonly raiz: THREE.Object3D, quantas = 4) {
    this.grupo.name = 'luzes-dos-postes';
    for (let i = 0; i < quantas; i++) {
      const luz = new THREE.PointLight(P.luzDoPoste, 0, 10, 2);
      luz.castShadow = false;
      this.grupo.add(luz);
      this.luzes.push(luz);
      this.dono.push(-1);
    }
  }

  /** quantos postes ela achou (para o teste) */
  get quantosPostes(): number {
    return this.postes?.length ?? 0;
  }

  /**
   * A força de uma luz pela distância da dupla ao poste: cheia perto, some a
   * 16 m. De dia ela é forte o bastante para a poça morna aparecer na grama
   * e na roupa de quem passa embaixo (com 5 sumia no sol); de noite, o dobro.
   */
  private forca(d: number): number {
    const perto = 1 - THREE.MathUtils.smoothstep(d, 9, 16);
    return perto * (11 + this.noite * 14);
  }

  update(dt: number, foco: THREE.Vector3): void {
    if (!this.postes) {
      const lista: THREE.Vector3[] = [];
      this.raiz.updateMatrixWorld(true);
      this.raiz.traverse((o) => {
        if (o.name === 'lanterna-do-poste') lista.push(o.getWorldPosition(new THREE.Vector3()));
      });
      this.postes = lista;
    }
    const postes = this.postes;
    if (!postes.length) return;
    // os postes mais perto da dupla, do mais perto para o mais longe
    const dist = postes.map((p, i) => [Math.hypot(p.x - foco.x, p.z - foco.z), i] as const);
    dist.sort((a, b) => a[0] - b[0]);
    const escolhidos = new Set(dist.slice(0, this.luzes.length).map(([, i]) => i));
    const livres = [...escolhidos].filter((i) => !this.dono.includes(i));
    const passo = Math.min(1, dt * 2.5);
    this.luzes.forEach((luz, k) => {
      const meu = this.dono[k];
      if (meu >= 0 && escolhidos.has(meu)) {
        const p = postes[meu];
        luz.intensity += (this.forca(Math.hypot(p.x - foco.x, p.z - foco.z)) - luz.intensity) * passo;
        return;
      }
      // o poste dela saiu da lista: apaga devagar, e só troca de poste apagada
      luz.intensity += (0 - luz.intensity) * passo;
      if (luz.intensity < 0.05 && livres.length) {
        const novo = livres.shift() as number;
        this.dono[k] = novo;
        luz.position.copy(postes[novo]);
        luz.intensity = 0;
      }
    });
  }
}
