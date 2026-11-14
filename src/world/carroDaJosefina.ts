import { acabamentoDosCarros } from './acabamentoDosCarros';
import * as THREE from 'three';
import { Josefina } from '../entities/bichos/Josefina';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { carroEstacionado } from './estacionamento';
import { fundir } from './fundir';
import { quina } from './lojaDeRoupas';
import { regador, vasoDePlanta } from './props';
import { novaTextura } from './texturasDeChao';

/** Caminhonete aberta de jardinagem; mudas de verdade, motorista e rodas separados. */
export class CarroDaJosefina {
  readonly group = new THREE.Group();
  readonly josefina = new Josefina({ minX: -1, maxX: 1, minZ: -1, maxZ: 1 });
  private readonly rodas: THREE.Object3D[] = [];
  private readonly carga = new THREE.Group();
  private tempo = 0;
  constructor(estacionado = false) {
    this.group.userData.peca = 'carro-da-josefina';
    const carro = carroEstacionado(P.carroMenta, true);
    for (const o of carro.children) {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry.type === 'CylinderGeometry') {
        m.name = `roda-da-josefina-${this.rodas.length}`; this.rodas.push(m);
      }
    }
    this.group.add(fundir(carro));
    this.group.add(acabamentoDosCarros(true));
    const acabamento = new THREE.Group();
    const por = (l: number, a: number, p: number, x: number, y: number, z: number, cor: number): void => {
      const m = new THREE.Mesh(quina(l, a, p, .025), toon(cor)); m.position.set(x, y, z); acabamento.add(m);
    };
    // Assento elevado: a cabecinha aparece por cima do para-brisa baixo.
    por(.62, .35, .65, -.4, 1.11, .35, P.aventalFaixa);
    // Caçamba baixa e ripas deixam as folhas aparecerem nas tomadas da estrada.
    por(1.78, .1, 1.5, 0, .96, -1.3, P.wood);
    for (const x of [-.91, .91]) {
      for (const y of [1.14, 1.34]) por(.08, .12, 1.58, x, y, -1.3, P.aventalFaixa);
      for (const z of [-2.04, -.56]) por(.11, .55, .11, x, 1.23, z, P.portaoMetal);
    }
    por(1.78, .3, .09, 0, 1.2, -2.07, P.portaoMetal);
    const rotulo = novaTextura('plantinhas-da-josefina', 1, (ctx, s) => {
      ctx.fillStyle = `#${P.aventalFaixa.toString(16)}`; ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = `#${P.portaoMetal.toString(16)}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `900 ${s * .2}px sans-serif`; ctx.fillText('PLANTINHAS', s / 2, s * .34);
      ctx.font = `800 ${s * .17}px sans-serif`; ctx.fillText('DA JOSEFINA', s / 2, s * .68);
    });
    for (const x of [-1.025, 1.025]) {
      const placa = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .36), toon(P.metalWhite, { mapa: rotulo }));
      placa.position.set(x, .64, -.6); placa.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2; acabamento.add(placa);
    }
    const volante = new THREE.Mesh(new THREE.TorusGeometry(.19, .025, 6, 14), toon(P.pneu));
    volante.position.set(-.4, 1.25, .91); volante.rotation.x = -.7; acabamento.add(volante);
    const r = regador(); r.scale.setScalar(.6); r.position.set(.48, .92, .3); acabamento.add(r);
    this.group.add(fundir(acabamento));
    this.josefina.entrarEmServico(); this.josefina.group.scale.setScalar(1.7);
    this.josefina.group.position.set(-.4, 1.28, .35); if (!estacionado) this.group.add(this.josefina.group);
    for (let k = 0; k < 4; k++) {
      const vaso = vasoDePlanta(k < 2 ? 'lavanda' : 'samambaia', .3, k * .23);
      vaso.scale.setScalar(.78); vaso.position.set(k % 2 ? .46 : -.46, 1.02, k < 2 ? -1.68 : -.94); this.carga.add(vaso);
    }
    this.group.add(fundir(this.carga));
  }
  update(dt: number, distancia: number, conversando: boolean): void {
    this.tempo += dt;
    for (const r of this.rodas) r.rotation.x += distancia / .34;
    this.josefina.update(dt);
    this.josefina.group.rotation.y = conversando ? -Math.PI / 4 : 0;
    this.carga.rotation.z = conversando ? 0 : Math.sin(this.tempo * 3) * .012;
  }
}
