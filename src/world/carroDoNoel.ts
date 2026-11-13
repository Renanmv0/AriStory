import * as THREE from 'three';
import { Noel } from '../entities/bichos/Noel';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { carroEstacionado } from './estacionamento';
import { fundir } from './fundir';
import { quina } from './lojaDeRoupas';
import { novaTextura } from './texturasDeChao';
import { copoDeSuco } from './props';

const tinta = (cor: number): string => `#${cor.toString(16).padStart(6, '0')}`;

/** A mesma identidade do avental do Noel, com laranja cortada e letras cremosas. */
function rotuloDoNoel(tipo: 'marca' | 'fruta' | 'sabores'): THREE.CanvasTexture {
  return novaTextura(`carro-do-noel:${tipo}`, 1, (ctx, s) => {
    ctx.fillStyle = tinta(P.aventalDoNoel); ctx.fillRect(0, 0, s, s);
    if (tipo === 'fruta') {
      const x = s / 2, y = s * 0.53, r = s * 0.35;
      ctx.fillStyle = tinta(P.laranjaCasca); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = tinta(P.laranjaPolpa); ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = tinta(P.aventalFaixa); ctx.lineWidth = s * 0.018;
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76); ctx.stroke(); }
      ctx.fillStyle = tinta(P.portaoMetal); ctx.beginPath(); ctx.ellipse(s * 0.66, s * 0.14, s * 0.12, s * 0.05, -0.5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = tinta(P.aventalFaixa); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (tipo === 'marca') {
        ctx.font = `900 ${s * 0.24}px sans-serif`; ctx.fillText('SUCOS', s / 2, s * 0.33);
        ctx.font = `900 ${s * 0.18}px sans-serif`; ctx.fillText('DO NOEL', s / 2, s * 0.67);
      } else {
        ctx.font = `900 ${s * 0.15}px sans-serif`; ctx.fillText('FRESQUINHOS', s / 2, s * 0.18);
        ctx.font = `800 ${s * 0.14}px sans-serif`;
        for (const [texto, y] of [['Laranja', .42], ['Limão', .64], ['Uva', .84]] as const) ctx.fillText(texto, s / 2, s * y);
      }
    }
  });
}

/** Caminhonete de sucos: cabine aberta, loja na caçamba e balcão que abre na parada. */
export class CarroDoNoel {
  readonly group = new THREE.Group();
  readonly noel = new Noel({ minX: -2, maxX: 2, minZ: -2, maxZ: 2 });
  private readonly rodas: THREE.Object3D[] = [];
  private readonly balcao = new THREE.Group();
  private abertura = 0;
  constructor() {
    this.group.userData.peca = 'carro-do-noel';
    const carro = carroEstacionado(P.laranjaCasca, true);
    // Rodas separadas do corpo estático para poderem girar de verdade.
    for (const o of [...carro.children]) {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry.type === 'CylinderGeometry') {
        m.name = `roda-do-noel-${this.rodas.length}`; this.rodas.push(m);
        if ((m.geometry as THREE.CylinderGeometry).parameters.radiusTop < 0.2) m.material = toon(P.aventalDoNoel);
      }
    }
    this.group.add(fundir(carro));
    const banco = new THREE.Mesh(quina(0.55, 0.12, 0.55, 0.04), toon(P.portaoMetal));
    banco.position.set(-0.4, 0.85, 0.4); this.group.add(banco);
    // O bicho conserva as próprias poses: não fundir suas asas, pescoço e leque.
    this.noel.entrarEmServico();
    this.noel.group.position.set(-0.4, 0.89, 0.4);
    this.group.add(this.noel.group);
    const volante = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 14), toon(P.pneu));
    volante.position.set(-0.4, 1.13, 0.9); volante.rotation.x = -0.7; this.group.add(volante);
    const venda = new THREE.Group(); venda.userData.peca = 'loja-de-sucos-do-noel';
    const por = (l: number, a: number, p: number, x: number, y: number, z: number, cor: number): THREE.Mesh => {
      const m = new THREE.Mesh(quina(l, a, p, 0.025), toon(cor)); m.position.set(x, y, z); venda.add(m); return m;
    };
    // A janela é um vão de verdade: balcão embaixo, prateleira e jarras por dentro.
    por(1.94, .24, 1.5, 0, 1.02, -1.35, P.aventalDoNoel);
    por(.12, 1.18, 1.5, .91, 1.59, -1.35, P.aventalDoNoel);
    por(1.94, 1.18, .1, 0, 1.59, -2.06, P.aventalDoNoel);
    for (const z of [-2.02, -.68]) por(.1, 1.15, .1, -.91, 1.57, z, P.aventalFaixa);
    por(1.99, .1, 1.56, 0, 2.2, -1.35, P.aventalFaixa);
    por(1.75, .06, .9, 0, 1.18, -1.37, P.aventalFaixa);
    // Toldo de listras, curto para deixar o balcão e o motorista à vista.
    for (let k = 0; k < 6; k++) {
      por(.5, .06, .24, -1.15, 2.14, -1.95 + k * .24, k % 2 ? P.aventalFaixa : P.aventalDoNoel);
      por(.045, .14, .24, -1.39, 2.08, -1.95 + k * .24, k % 2 ? P.aventalFaixa : P.aventalDoNoel);
    }
    const placa = (tipo: 'marca' | 'fruta' | 'sabores', l: number, a: number, x: number, y: number, z: number, giro: number): void => {
      const face = new THREE.Mesh(new THREE.PlaneGeometry(l, a), toon(P.metalWhite, { mapa: rotuloDoNoel(tipo) }));
      face.position.set(x, y, z); face.rotation.y = giro; venda.add(face);
    };
    // Letreiro incorporado ao teto e um grande gomo de laranja na silhueta.
    por(1.72, .55, .09, 0, 2.48, -.77, P.aventalDoNoel);
    placa('marca', 1.62, .51, 0, 2.48, -.718, 0);
    const rodela = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .07, 20).rotateX(Math.PI / 2), toon(P.laranjaCasca));
    rodela.position.set(.4, 2.94, -.78); venda.add(rodela);
    const fruta = new THREE.Mesh(new THREE.CircleGeometry(.32, 20), toon(P.metalWhite, { mapa: rotuloDoNoel('fruta') }));
    fruta.position.set(.4, 2.94, -.734); venda.add(fruta);
    placa('fruta', .75, .75, .98, 1.61, -1.35, Math.PI / 2);
    placa('sabores', .52, .68, -.41, 1.65, -.728, 0);
    // Copos do próprio bar do Noel; jarras coloridas, com alça e tampa.
    for (let k = 0; k < 3; k++) {
      const sabor = [P.laranja, P.aventalDoNoel, P.carroLilas][k];
      const jarra = new THREE.Group();
      const liquido = new THREE.Mesh(new THREE.CylinderGeometry(.1, .115, .3, 12), toon(sabor)); liquido.position.y = .16; jarra.add(liquido);
      const tampa = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .035, 12), toon(P.aventalFaixa)); tampa.position.y = .33; jarra.add(tampa);
      const alca = new THREE.Mesh(new THREE.TorusGeometry(.09, .018, 5, 10), toon(P.aventalFaixa)); alca.position.set(.105, .17, 0); jarra.add(alca);
      jarra.position.set(-.65, 1.22, -1.8 + k * .4); venda.add(jarra);
      const copo = copoDeSuco(sabor); copo.scale.setScalar(.65); copo.position.set(-.3, 1.22, -1.8 + k * .4); venda.add(copo);
    }
    // A aba fecha contra a carroceria em movimento e vira apoio horizontal quando ele conversa.
    this.balcao.name = 'balcao-do-noel'; this.balcao.position.set(-.98, 1.17, -1.35);
    const aba = new THREE.Mesh(quina(.43, .065, 1.34, .02), toon(P.aventalFaixa)); aba.position.x = -.215; this.balcao.add(aba);
    this.balcao.rotation.z = -Math.PI / 2; venda.add(this.balcao);
    this.group.add(fundir(venda));
    // Faixa verde cítrica nas duas laterais e no capô.
    const faixas = new THREE.Group();
    for (const x of [-1.017, 1.017]) { const f = new THREE.Mesh(quina(.025, .12, 3.8, .008), toon(P.aventalDoNoel)); f.position.set(x, .57, 0); faixas.add(f); }
    const emblema = new THREE.Mesh(new THREE.PlaneGeometry(.65, .65), toon(P.metalWhite, { mapa: rotuloDoNoel('fruta') }));
    emblema.rotation.x = -Math.PI / 2; emblema.position.set(.15, .99, 1.36); faixas.add(emblema); this.group.add(fundir(faixas));
    const caixa = new THREE.Group();
    for (const z of [-0.34, 0.34]) for (const y of [0.08, 0.23]) {
      const r = new THREE.Mesh(quina(0.65, 0.11, 0.055, 0.012), toon(P.wood)); r.position.set(0, y, z); caixa.add(r);
    }
    for (const x of [-0.3, 0.3]) {
      const r = new THREE.Mesh(quina(0.055, 0.32, 0.7, 0.012), toon(P.wood)); r.position.set(x, 0.16, 0); caixa.add(r);
    }
    const frutas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.105, 10, 8), toon(P.laranjaCasca), 9);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 9; i++) frutas.setMatrixAt(i, m.makeTranslation((i % 3 - 1) * 0.18, 0.26 + (i % 2) * 0.045, (Math.floor(i / 3) - 1) * 0.2));
    caixa.add(frutas); caixa.scale.setScalar(.8); caixa.position.set(.43, .9, -.36); this.group.add(fundir(caixa));
  }
  update(dt: number, distancia: number, conversando: boolean): void {
    for (const r of this.rodas) r.rotation.x += distancia / 0.34;
    this.noel.update(dt);
    this.noel.group.rotation.y = conversando ? -Math.PI / 2 : 0;
    this.abertura += ((conversando ? 1 : 0) - this.abertura) * (1 - Math.exp(-5 * dt));
    this.balcao.rotation.z = -(1 - this.abertura) * Math.PI / 2;
  }
}
