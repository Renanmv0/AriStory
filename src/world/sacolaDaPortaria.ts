import * as THREE from 'three';
import { pinturaAcesa, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import type { ItemDaSacola } from '../minigames/portaria';
import { macia, tubo } from './moveisDaBoutique';
import { fundir } from './fundir';
import { novaTextura } from './texturasDeChao';
import { veioDeMadeira } from './texturasDeCasa';
import { MESA_DA_PORTARIA as M } from './mesaDaPortaria';

/** Trama clara que multiplica a cor sem criar material ou textura por visitante. */
function trama(): THREE.CanvasTexture {
  return novaTextura('lona-e-feltro-da-portaria', 1, (ctx, s) => {
    ctx.fillStyle = '#f5f6f3'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#dfe5dd'; ctx.lineWidth = 1;
    for (let i = 1; i < s; i += 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.moveTo(0, i + 1); ctx.lineTo(s, i + 1); ctx.stroke(); }
  });
}

/** Objetos táteis em escala de balcão; cada item da sacola conserva sua identidade. */
function itemDaSacola(item: ItemDaSacola): THREE.Group {
  const g = new THREE.Group(); g.name = `item:${item}`;
  const por = (geo: THREE.BufferGeometry, cor: number, x = 0, y = 0, z = 0): THREE.Mesh => {
    const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); g.add(m); return m;
  };
  const caixa = (l: number, a: number, p: number, cor: number, y = a / 2): THREE.Mesh => por(macia(l, a, p, Math.min(.008, a / 3)), cor, 0, y);
  if (item === 'bolaDeBasquete' || item === 'bolaDeFutebol' || item === 'patoDeBorracha' || item === 'tricô') {
    const cor = item === 'bolaDeBasquete' ? P.laranjaCasca : item === 'tricô' ? P.carroLilas : item === 'patoDeBorracha' ? P.carroAmarelo : P.metalWhite;
    const corpo = por(new THREE.SphereGeometry(.055, 20, 14), cor, 0, .055); if (item === 'patoDeBorracha') corpo.scale.set(1, .7, 1.15);
    if (item === 'patoDeBorracha') {
      por(new THREE.SphereGeometry(.033, 16, 10), cor, 0, .105, .025);
      por(macia(.038, .014, .035, .005), P.laranjaCasca, 0, .1, .059);
      for (const x of [-.024, .024]) por(new THREE.SphereGeometry(.004, 8, 6), P.pneu, x, .116, .045);
    } else {
      for (let i = 0; i < (item === 'tricô' ? 7 : 3); i++) {
        const aro = por(new THREE.TorusGeometry(.0555, .0015, 4, 32), item === 'tricô' ? P.aventalFaixa : P.pneu, 0, .055);
        aro.rotation.set(i * .52, i * .9, 0);
      }
      if (item === 'tricô') for (const lado of [-1, 1]) { const agulha = por(new THREE.CylinderGeometry(.002, .002, .15, 8), P.wood, lado * .017, .08); agulha.rotation.z = lado * .4; }
    }
  } else if (item === 'boia' || item === 'oculosDeNatacao' || item === 'raqueteDePingPong') {
    if (item === 'boia') { const a = por(new THREE.TorusGeometry(.054, .018, 12, 28), P.carroVermelho, 0, .02); a.rotation.x = Math.PI / 2; }
    else if (item === 'raqueteDePingPong') {
      const a = por(new THREE.CylinderGeometry(.049, .049, .009, 24), P.salvaVidasVermelho, 0, .013); a.scale.z = 1.12;
      por(macia(.022, .013, .075, .005), P.wood, 0, .014, -.067);
    } else {
      for (const lado of [-1, 1]) {
        const aro = por(new THREE.TorusGeometry(.025, .006, 8, 20), P.hortensiaAzul, lado * .03, .012); aro.rotation.x = Math.PI / 2;
        const vidro = new THREE.Mesh(new THREE.CircleGeometry(.021, 20), toon(P.churrascoInox, { opacity: .6 })); vidro.rotation.x = -Math.PI / 2; vidro.position.set(lado * .03, .014, 0); g.add(vidro);
      }
      por(macia(.018, .009, .014, .003), P.hortensiaAzul, 0, .012);
    }
  } else if (item === 'protetor' || item === 'sabaoDeBolha' || item === 'copoDeVidro') {
    const cor = item === 'sabaoDeBolha' ? P.carroMenta : P.aventalFaixa;
    if (item === 'copoDeVidro') {
      const copo = new THREE.Mesh(new THREE.CylinderGeometry(.035, .027, .1, 24, 1, true), toon(P.churrascoInox, { opacity: .5, doubleSide: true })); copo.position.y = .051; g.add(copo);
      por(new THREE.CylinderGeometry(.027, .027, .004, 24), P.churrascoInox, 0, .004);
    } else {
      caixa(.06, .09, .035, cor);
      por(new THREE.CylinderGeometry(.018, .018, .016, 16), P.carroAmarelo, 0, .098);
      por(macia(.038, .04, .002, .002), P.metalWhite, 0, .05, .0185);
      const sol = por(new THREE.CircleGeometry(.011, 16), P.laranjaCasca, 0, .053, .0205); sol.rotation.y = 0;
    }
  } else if (item === 'caixaDeSom') {
    caixa(.12, .07, .045, P.pneu);
    for (const x of [-.032, .032]) { const a = por(new THREE.TorusGeometry(.022, .004, 8, 20), P.churrascoInox, x, .038, .025); a.rotation.x = 0; }
    por(macia(.05, .008, .012, .003), P.carroLilas, 0, .077);
  } else if (item === 'sanduiche') {
    caixa(.11, .018, .09, P.aventalFaixa, .016); caixa(.105, .012, .085, P.portaoMetal, .031); caixa(.11, .018, .09, P.aventalFaixa, .046);
  } else if (item === 'livro' || item === 'toalha') {
    caixa(.11, .025, .14, item === 'livro' ? P.carroVermelho : P.hortensiaAzul);
    caixa(.095, .014, .127, P.aventalFaixa, .014);
    if (item === 'toalha') for (const x of [-.035, .035]) por(macia(.012, .002, .14, .0005), P.metalWhite, x, .027);
  } else {
    for (const x of [-.03, .03]) {
      const sola = por(macia(.042, .012, .12, .005), P.carroMenta, x, .009); sola.rotation.y = x * 2;
      const tira = por(new THREE.TorusGeometry(.017, .004, 8, 16, Math.PI), P.aventalFaixa, x, .019, .02); tira.rotation.y = Math.PI / 2;
    }
  }
  return fundir(g);
}

/** Sacola de lona, bandeja de inspeção e caixa de achados; movimentos no relógio da cena. */
export class SacolaDaPortaria {
  readonly group = new THREE.Group();
  readonly sacola = new THREE.Group();
  readonly itens = new Map<ItemDaSacola, THREE.Group>();
  private readonly guardados = new THREE.Group();
  private viva = true;
  private movimentos: Array<{ obj: THREE.Object3D; de: THREE.Vector3; para: THREE.Vector3; t: number; dur: number; fim?: () => void }> = [];
  private readonly casa = new THREE.Vector3(-.46, M.topo + .015, .8);
  private readonly achados = new THREE.Vector3(-.69, M.topo + .09, .78);
  constructor() {
    this.group.userData.peca = 'sacola-da-portaria';
    this.group.add(this.guardados);
    this.sacola.name = 'sacola-do-visitante';
    const bolsa = new THREE.Mesh(macia(.2, .16, .14, .035), toon(P.guaritaFaixa, { mapa: trama() })); bolsa.position.y = .08; this.sacola.add(bolsa);
    const bolso = new THREE.Mesh(macia(.15, .075, .014, .01), toon(P.carroMenta)); bolso.position.set(0, .065, -.077); this.sacola.add(bolso);
    for (const z of [-.045, .045]) {
      const alca = new THREE.Mesh(tubo([[-.055, .15, z], [-.06, .23, z], [.06, .23, z], [.055, .15, z]], .006, 12, 8), toon(P.woodDark)); this.sacola.add(alca);
    }
    const ziper = new THREE.Mesh(new THREE.CylinderGeometry(.003, .003, .16, 8).rotateZ(Math.PI / 2), toon(P.gold)); ziper.position.y = .163; this.sacola.add(ziper);
    fundir(this.sacola); this.sacola.visible = false; this.group.add(this.sacola);
    // Feltro com borda de latão: os itens ficam separados dos papéis da leitura.
    const bandeja = new THREE.Group();
    const base = new THREE.Mesh(macia(.63, .012, .23, .014), toon(P.woodDark)); base.position.set(.04, M.topo + .006, .8); bandeja.add(base);
    const feltro = new THREE.Mesh(macia(.6, .006, .2, .012), toon(P.guaritaFaixa, { mapa: trama() })); feltro.position.set(.04, M.topo + .014, .8); bandeja.add(feltro);
    for (const z of [.695, .905]) { const friso = new THREE.Mesh(macia(.61, .005, .007, .002), toon(P.gold)); friso.position.set(.04, M.topo + .015, z); bandeja.add(friso); }
    this.group.add(fundir(bandeja));
    const caixa = new THREE.Group(); caixa.position.copy(this.achados); caixa.name = 'achados-da-portaria';
    for (const x of [-.09, .09]) { const m = new THREE.Mesh(macia(.014, .09, .19, .005), toon(P.wood, { mapa: veioDeMadeira() })); m.position.set(x, 0, 0); caixa.add(m); }
    for (const z of [-.09, .09]) { const m = new THREE.Mesh(macia(.18, .09, .014, .005), toon(P.wood, { mapa: veioDeMadeira() })); m.position.set(0, 0, z); caixa.add(m); }
    const fundo = new THREE.Mesh(macia(.18, .012, .18, .004), toon(P.wood, { mapa: veioDeMadeira() }));
    fundo.position.y = -.04; caixa.add(fundo);
    const rotulo = novaTextura('caixa-de-achados-da-portaria', 1, (ctx, s) => {
      ctx.fillStyle = '#fff7df'; ctx.fillRect(0, 0, s, s); ctx.fillStyle = '#4f573d';
      ctx.font = `900 ${s * .17}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ACHADOS', s / 2, s / 2);
    });
    const etiqueta = new THREE.Mesh(new THREE.PlaneGeometry(.14, .045), pinturaAcesa(rotulo));
    etiqueta.position.set(0, 0, -.1); etiqueta.rotation.y = Math.PI; caixa.add(etiqueta);
    this.group.add(fundir(caixa));
  }
  private mover(obj: THREE.Object3D, para: THREE.Vector3, dur: number): Promise<void> {
    return new Promise(fim => this.movimentos.push({ obj, de: obj.position.clone(), para, t: 0, dur, fim }));
  }
  async apresentar(itens: readonly ItemDaSacola[], origem: THREE.Vector3): Promise<void> {
    this.sacola.visible = true; this.sacola.position.copy(origem);
    await this.mover(this.sacola, this.casa, .65);
    if (!this.viva) return;
    for (const [i, item] of itens.entries()) {
      if (!this.viva) return;
      if (this.itens.has(item)) continue;
      const o = itemDaSacola(item); o.position.copy(this.casa).add(new THREE.Vector3(0, .18, 0)); this.itens.set(item, o); this.group.add(o);
      await this.mover(o, new THREE.Vector3(-.18 + (i % 4) * .14, M.topo + .022, .8 + Math.floor(i / 4) * .13), .3);
    }
  }
  async retirar(item: ItemDaSacola, confiscar: boolean): Promise<void> {
    const o = this.itens.get(item); if (!o) return;
    const n = this.guardados.children.length;
    const destino = this.achados.clone().add(new THREE.Vector3(Math.sin(n * 2.39996) * .025, -.03 + n * .014, Math.cos(n * 2.39996) * .025));
    await this.mover(o, confiscar ? destino : this.casa.clone().add(new THREE.Vector3(0, .12, 0)), .45);
    if (!this.viva) return;
    if (confiscar) {
      o.userData.confiscado = true;
      this.guardados.add(o); this.itens.delete(item);
    } else o.visible = false;
  }
  async devolver(destino: THREE.Vector3): Promise<void> {
    for (const o of this.itens.values()) o.visible = false;
    if (this.sacola.visible) await this.mover(this.sacola, destino, .55);
    if (!this.viva) return;
    this.sacola.visible = false;
    for (const o of this.itens.values()) { o.removeFromParent(); o.traverse(m => { if ((m as THREE.Mesh).isMesh || (m as THREE.LineSegments).isLineSegments) (m as THREE.Mesh).geometry.dispose(); }); }
    this.itens.clear();
  }
  dispose(): void { this.viva = false; for (const m of this.movimentos.splice(0)) m.fim?.(); }
  update(dt: number): void {
    for (const m of [...this.movimentos]) {
      m.t += dt; const k = Math.min(1, m.t / m.dur), ease = k * k * (3 - 2 * k);
      m.obj.position.lerpVectors(m.de, m.para, ease); m.obj.position.y += Math.sin(k * Math.PI) * .055;
      m.obj.rotation.y = Math.sin(k * Math.PI) * .06;
      if (k === 1) { this.movimentos.splice(this.movimentos.indexOf(m), 1); m.fim?.(); }
    }
  }
}
