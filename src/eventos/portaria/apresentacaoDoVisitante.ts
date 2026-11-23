import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import type { Visitante } from '../../minigames/portaria';
import { FICHAS } from '../../minigames/portaria';
import { alturaDoElevador, modeloDoVisitante, type ModeloDeVisitante } from '../../world/visitantesDaPortaria';
import { fundir } from '../../world/fundir';
import { macia } from '../../world/moveisDaBoutique';
import { JeanLuc } from '../../entities/bichos/JeanLuc';
import { vestirNaCantina } from '../../world/figurinosDaCantina';
import { capaceteDoCapy } from '../../world/motoDoCapy';

/** A pessoa que se compara é a mesma dos dados: disfarces, capacete e acompanhantes no mundo. */
export function apresentacaoDoVisitante(modelo: ModeloDeVisitante, v: Visitante) {
  const extras: THREE.Object3D[] = [], colegas: ModeloDeVisitante[] = [];
  const elevacaoPrincipal = alturaDoElevador(modelo.group);
  modelo.group.userData.alturaDeAtendimento = elevacaoPrincipal;
  const topoPrincipal = new THREE.Box3().setFromObject(modelo.group).max.y - modelo.group.position.y;
  let cabeca: THREE.Object3D = modelo.group;
  modelo.group.traverse(o => { if (cabeca === modelo.group && o.isObject3D && o.name.includes('cabeca')) cabeca = o; });
  cabeca.updateWorldMatrix(true, true);
  const caixa = new THREE.Box3().setFromObject(cabeca).applyMatrix4(cabeca.matrixWorld.clone().invert());
  const tamanho = caixa.getSize(new THREE.Vector3());
  const r = Math.max(.08, Math.min(.35, tamanho.x * .48));
  const z = Math.min(.4, caixa.max.z), y = caixa.min.y + tamanho.y * .58;
  const acessorio = new THREE.Group(); acessorio.name = 'disfarce-da-portaria'; cabeca.add(acessorio); extras.push(acessorio);
  const por = (g: THREE.Group, geo: THREE.BufferGeometry, cor: number, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); g.add(m); return m;
  };
  const capuz = (cor: number): void => {
    const m = por(acessorio, new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), cor, 0, y + r * .5, 0);
    m.scale.set(r * 1.18, r * .7, r * 1.1);
  };
  const enfeite = v.rosto.enfeite;
  const bicho = modelo.group.userData.bicho;
  const figurino = bicho instanceof JeanLuc ? vestirNaCantina(bicho,enfeite) : null;
  if (enfeite === 'oculosComNariz') {
    for (const lado of [-1, 1]) {
      const lente = por(acessorio, new THREE.TorusGeometry(r * .28, r * .045, 8, 20), P.pneu, lado * r * .32, y, z + r * .05); lente.rotation.x = 0;
    }
    const nariz = por(acessorio, new THREE.SphereGeometry(1, 16, 10), P.capivaraClaro, 0, y - r * .2, z + r * .23); nariz.scale.set(r * .17, r * .25, r * .2);
  } else if (enfeite === 'perucaDeFranja') {
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const cacho = por(acessorio, new THREE.SphereGeometry(r * .28, 12, 8), P.woodDark, Math.cos(a) * r * .9, y + r * .6, Math.sin(a) * r * .9); cacho.scale.y = 1.4;
    }
  } else if (enfeite === 'boneDeEntregador') {
    capuz(P.carroMenta);
    por(acessorio, macia(r * 1.6, r * .09, r * .7, r * .04), P.guaritaFaixa, 0, y + r * .45, z * .7);
  } else if (enfeite === 'bigodeFalso') {
    for (const lado of [-1, 1]) { const m = por(acessorio, new THREE.SphereGeometry(1, 16, 10), P.pneu, lado * r * .24, y - r * .35, z + r * .11); m.scale.set(r * .32, r * .1, r * .1); m.rotation.z = lado * -.25; }
  } else if (enfeite === 'toucaEBoia') {
    capuz(P.carroVermelho);
    const boia = new THREE.Mesh(new THREE.TorusGeometry(.23, .07, 12, 28), toon(P.carroAmarelo)); boia.rotation.x = Math.PI / 2; boia.position.y = .25; modelo.group.add(boia); extras.push(boia);
  } else if (enfeite === 'cascoDePapelao') {
    const casco = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), toon(P.portaoMetal)); casco.scale.set(.24, .16, .28); casco.position.set(0, .25, -.1); modelo.group.add(casco); extras.push(casco);
  }
  const capacete = new THREE.Group(); capacete.name = 'capacete-da-portaria';
  if (v.tapado) {
    capacete.add(capaceteDoCapy(true)); cabeca.add(capacete); extras.push(capacete);
  }
  fundir(acessorio);
  const apoios: Array<{ haste: THREE.Mesh; pessoa: ModeloDeVisitante }> = [];
  const acompanhar = (id: string, i: number, escondido = false): ModeloDeVisitante | null => {
    const f = FICHAS[id]; if (!f || id === 'netinho') return null;
    const m = modeloDoVisitante(id, f.retrato);
    m.group.position.set(escondido ? 0 : (i % 2 ? -1 : 1) * (.65 + Math.floor(i / 2) * .36), 0, escondido ? -.32 : -.2 - Math.floor(i / 2) * .38);
    m.group.scale.multiplyScalar(.82);
    const elevacaoDoColega = alturaDoElevador(m.group);
    m.group.position.y = elevacaoDoColega - elevacaoPrincipal;
    if (escondido) { const topo = new THREE.Box3().setFromObject(m.group).max.y - m.group.position.y; m.group.position.y = topoPrincipal - topo + .13; }
    modelo.group.add(m.group); colegas.push(m); extras.push(m.group);
    const apoio = new THREE.Mesh(new THREE.CylinderGeometry(.26, .29, 1, 20), toon(P.guaritaParede)); apoio.name = 'apoio-do-acompanhante'; apoio.position.copy(m.group.position); modelo.group.add(apoio); extras.push(apoio); apoios.push({ haste: apoio, pessoa: m });
    return m;
  };
  (v.grupo ?? []).forEach((id, i) => acompanhar(id, i));
  const escondido = v.escondido ? acompanhar(v.escondido, 0, true) : null;
  let revelou = false, tirandoCapacete = false, tempoDoCapacete = 0;
  return {
    atuar(acao: string): void { figurino?.atuar(acao); },
    update(dt: number): void {
      figurino?.update(dt);
      for (const m of colegas) m.update(dt);
      if (tirandoCapacete && capacete.visible) {
        tempoDoCapacete += dt; const k = Math.min(1, tempoDoCapacete / .85), ease = k * k * (3 - 2 * k);
        capacete.position.set(r * 1.8 * ease, r * 2.2 * ease, -r * .3 * ease);
        capacete.rotation.z = -.35 * ease;
        if (k === 1) capacete.visible = false;
      }
      for (const a of apoios) { a.haste.scale.y = Math.max(.01, modelo.group.position.y + a.pessoa.group.position.y); a.haste.position.y = (a.pessoa.group.position.y - modelo.group.position.y) / 2; a.haste.position.x = a.pessoa.group.position.x; }
    },
    corrigir(corrigidas: ReadonlySet<string>): void {
      if (corrigidas.has('rostoTapado') && !tirandoCapacete) { tirandoCapacete = true; modelo.gesticular(1.15); }
      if (escondido && corrigidas.has('alguemEscondido') && !revelou) {
        revelou = true;
        void escondido.irPara(.95, -.32, .8).then(() => escondido.encarar(0, 3));
      }
    },
    dispose(): void {
      figurino?.dispose();
      for (const m of colegas) m.dispose();
      for (const o of extras) { o.removeFromParent(); o.traverse(m => { if ((m as THREE.Mesh).isMesh) (m as THREE.Mesh).geometry.dispose(); }); }
    },
  };
}
