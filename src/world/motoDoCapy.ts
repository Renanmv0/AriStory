import * as THREE from 'three';
import { Capy } from '../entities/bichos/Capy';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir, fundirComoFundo } from './fundir';
import { quina } from './lojaDeRoupas';

/** Esportiva vermelha: carenagem curva, aros dourados e duas rodas de verdade. */
export class MotoDoCapy {
  readonly group = new THREE.Group();
  readonly capy = new Capy({ minX: -1, maxX: 1, minZ: -1, maxZ: 1 });
  private readonly rodas: THREE.Group[] = [];
  constructor(estacionada = false) {
    this.group.userData.peca = 'moto-do-capy';
    const lata = new THREE.Group();
    const por = (geo: THREE.BufferGeometry, cor: number, x: number, y: number, z: number): THREE.Mesh => {
      const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); lata.add(m); return m;
    };
    const tubo = (a: number[], b: number[], raio: number, cor: number): void => {
      const inicio = new THREE.Vector3(...a), fim = new THREE.Vector3(...b), d = fim.clone().sub(inicio);
      const m = por(new THREE.CylinderGeometry(raio, raio, d.length(), 10), cor, 0, 0, 0);
      m.position.copy(inicio.add(fim).multiplyScalar(.5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    };
    const painel = (pontos: number[][], largura: number, cor: number, x = 0): void => {
      const s = new THREE.Shape(); pontos.forEach(([z, y], i) => i ? s.lineTo(-z, y) : s.moveTo(-z, y)); s.closePath();
      const geo = new THREE.ExtrudeGeometry(s, { depth: largura, bevelEnabled: true, bevelThickness: .035, bevelSize: .055, bevelSegments: 3, steps: 1 });
      geo.translate(0, 0, -largura / 2); geo.rotateY(Math.PI / 2); por(geo, cor, x, 0, 0);
    };
    for (const z of [-1.02, 1.02]) {
      const roda = new THREE.Group(); roda.position.set(0, .455, z); roda.rotation.y = Math.PI / 2;
      const pneu = new THREE.Mesh(new THREE.TorusGeometry(.34, .115, 12, 32), toon(P.pneu)); roda.add(pneu);
      for (const lado of [-1, 1]) {
        const aro = new THREE.Mesh(new THREE.TorusGeometry(.27, .035, 8, 28), toon(P.carroAmarelo)); aro.position.z = lado * .085; roda.add(aro);
        const disco = new THREE.Mesh(new THREE.RingGeometry(.12, .215, 24), toon(P.churrascoInox, { doubleSide: true })); disco.position.z = lado * .105; roda.add(disco);
      }
      for (let i = 0; i < 5; i++) {
        const raio = new THREE.Mesh(quina(.045, .25, .09, .012), toon(P.carroAmarelo));
        const a = i * Math.PI * 2 / 5; raio.position.set(Math.sin(a) * .15, Math.cos(a) * .15, 0); raio.rotation.z = -a; roda.add(raio);
      }
      const eixo = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .28, 12).rotateX(Math.PI / 2), toon(P.churrascoInox)); roda.add(eixo);
      this.rodas.push(roda); this.group.add(fundir(roda));
    }
    painel([[-.84, .43], [-.6, .35], [.65, .4], [.8, .8], [.45, 1.03], [-.46, .95]], .53, P.salvaVidasVermelho);
    // Laterais abertas atrás das rodas; a frente afina como uma esportiva.
    for (const lado of [-1, 1]) {
      painel([[-.55, .47], [.55, .48], [.75, 1.18], [.4, 1.27], [.02, .95]], .045, P.salvaVidasVermelho, lado * .32);
      for (let i = 0; i < 3; i++) {
        const respiro = por(quina(.018, .22, .045, .009), P.pneu, lado * .405, .7, .08 + i * .12); respiro.rotation.x = -.35;
      }
      tubo([lado * .22, .46, 1.02], [lado * .22, 1.23, .58], .045, P.churrascoInox);
      tubo([lado * .2, .46, -1.02], [lado * .2, .68, -.25], .065, P.churrascoInoxEscuro);
      tubo([lado * .32, .67, -.49], [lado * .53, .67, -.49], .04, P.churrascoInox);
      tubo([lado * .26, 1.13, .25], [lado * .36, 1.24, .19], .045, P.pneu);
      tubo([lado * .34, 1.24, .23], [lado * .47, 1.47, .47], .025, P.pneu);
      por(quina(.19, .1, .09, .04), P.pneu, lado * .48, 1.48, .48);
      por(quina(.14, .06, .012, .02), P.churrascoInox, lado * .48, 1.48, .427);
    }
    const tanque = por(new THREE.SphereGeometry(1, 24, 16), P.salvaVidasVermelho, 0, 1.03, -.02); tanque.scale.set(.36, .23, .45);
    por(new THREE.CylinderGeometry(.09, .09, .025, 16), P.churrascoInox, 0, 1.265, -.02);
    painel([[-1.36, 1.09], [-1.12, 1.2], [-.64, 1.05], [-.52, .87], [-1.22, .91]], .47, P.salvaVidasVermelho);
    por(quina(.49, .12, .54, .055), P.pneu, 0, 1.10, -.64);
    por(quina(.4, .09, .32, .04), P.pneu, 0, 1.26, -1.08);
    por(quina(.3, .06, .035, .015), P.salvaVidasVermelho, 0, 1.035, -1.42);
    const bico = por(new THREE.SphereGeometry(1, 24, 16), P.salvaVidasVermelho, 0, 1.23, .78); bico.scale.set(.43, .3, .35);
    for (const lado of [-1, 1]) {
      const farol = por(quina(.23, .085, .055, .025), P.luzDoPortao, lado * .21, 1.23, 1.107); farol.rotation.z = lado * .18;
    }
    const vidro = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, 1.4), toon(P.churrascoInox, { opacity: .65, doubleSide: true }));
    vidro.scale.set(.32, .4, .22); vidro.position.set(0, 1.44, .72); vidro.rotation.x = -.4; lata.add(vidro);
    const paraLama = por(new THREE.TorusGeometry(.49, .07, 8, 24, Math.PI), P.salvaVidasVermelho, 0, .455, 1.02); paraLama.rotation.y = Math.PI / 2;
    tubo([.31, .38, -.92], [.35, .58, -.45], .09, P.churrascoInoxEscuro);
    por(new THREE.CylinderGeometry(.07, .07, .1, 12).rotateX(Math.PI / 2), P.pneu, .31, .38, -1.0);
    this.group.add(fundir(lata));
    if (!estacionada) {
      this.capy.entrarEmServico(); this.capy.pilotando = true;
      this.capy.group.scale.setScalar(2.4); this.capy.group.position.set(0, .46, -.35);
      const capacete = new THREE.Group(); capacete.name = 'capacete-do-capy';
      const casco = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16, 0, Math.PI * 2, 0, 1.4), toon(P.salvaVidasVermelho));
      casco.scale.set(.164, .15, .17); casco.position.y = .045; capacete.add(casco);
      for (const lado of [-1, 1]) {
        const tira = new THREE.Mesh(quina(.018, .16, .025, .006), toon(P.pneu)); tira.position.set(lado * .13, -.01, .04); capacete.add(tira);
      }
      const faixa = new THREE.Mesh(quina(.035, .018, .15, .008), toon(P.salvaVidasBranco)); faixa.position.set(0, .187, -.015); capacete.add(faixa);
      const fecho = new THREE.Mesh(quina(.08, .025, .025, .006), toon(P.churrascoInox)); fecho.position.set(0, -.09, .07); capacete.add(fecho);
      this.capy.apoioDoCapacete.add(fundir(capacete)); this.group.add(this.capy.group); this.update(0, 0, false);
    } else {
      // Descanso lateral só na vaga; a moto em viagem mantém as rodas no chão.
      tubo([-.2, .55, -.4], [-.51, .03, -.49], .03, P.churrascoInoxEscuro);
      fundirComoFundo(this.group);
    }
  }
  update(dt: number, distancia: number, conversando: boolean): void {
    for (const roda of this.rodas) roda.rotation.z -= distancia / .455;
    this.capy.olharNaMoto = conversando ? .35 : 0;
    this.capy.update(dt);
  }
}
