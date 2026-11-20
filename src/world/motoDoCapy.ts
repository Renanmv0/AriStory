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
    detalhesDaMoto(lata, por, tubo);
    this.group.add(fundir(lata));
    if (!estacionada) {
      this.capy.entrarEmServico(); this.capy.pilotando = true;
      this.capy.group.scale.setScalar(2.4); this.capy.group.position.set(0, .46, -.35);
      this.capy.apoioDoCapacete.add(capaceteDoCapy());
      this.group.add(this.capy.group); this.update(0, 0, false);
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

type Por = (geo: THREE.BufferGeometry, cor: number, x: number, y: number, z: number) => THREE.Mesh;
type Tubo = (a: number[], b: number[], raio: number, cor: number) => void;

/** uma engrenagem chata (a coroa e o pinhao da corrente), com dentes de verdade */
function engrenagem(raio: number, dentes: number, espessura: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const passos = dentes * 4;
  for (let i = 0; i <= passos; i++) {
    const a = (i / passos) * Math.PI * 2, fora = i % 4 === 1 || i % 4 === 2;
    const r = fora ? raio : raio * 0.86;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r); else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const furo = new THREE.Path(); furo.absarc(0, 0, raio * 0.35, 0, Math.PI * 2, true); s.holes.push(furo);
  const geo = new THREE.ExtrudeGeometry(s, { depth: espessura, bevelEnabled: false, curveSegments: 4 });
  geo.translate(0, 0, -espessura / 2); geo.rotateY(Math.PI / 2);
  return geo;
}

/**
 * Os detalhes que fazem a esportiva ler como moto de verdade de perto: o
 * escapamento com a curva do coletor e a ponteira cromada, a corrente com a
 * coroa e o pinhao do lado esquerdo, as pincas douradas no disco da frente
 * (o mesmo dourado dos aros), a lanterna e os piscas, e o emblema do Capy
 * nos dois lados da carenagem: o disco branco com a cruz de salva-vidas.
 */
function detalhesDaMoto(lata: THREE.Group, por: Por, tubo: Tubo): void {
  // ------------------------------------------------ o escapamento (lado direito)
  const coletor = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.2, .62, .42), new THREE.Vector3(.27, .4, .15),
    new THREE.Vector3(.33, .37, -.25), new THREE.Vector3(.39, .45, -.5),
  ]);
  const cano = new THREE.Mesh(new THREE.TubeGeometry(coletor, 24, .035, 10), toon(P.churrascoInoxEscuro)); lata.add(cano);
  const de = new THREE.Vector3(.39, .45, -.5), ate = new THREE.Vector3(.41, .64, -1.06);
  const eixo = ate.clone().sub(de), meio = de.clone().add(ate).multiplyScalar(.5), giro = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), eixo.clone().normalize());
  const lata2 = (geo: THREE.BufferGeometry, cor: number, ao: number): void => {
    const m = new THREE.Mesh(geo, toon(cor)); m.quaternion.copy(giro); m.position.copy(de).addScaledVector(eixo, ao); lata.add(m);
  };
  lata2(new THREE.CylinderGeometry(.088, .072, eixo.length(), 16), P.churrascoInoxEscuro, .5);
  lata2(new THREE.CylinderGeometry(.093, .093, .05, 16), P.churrascoInox, .97);           // a ponteira cromada
  lata2(new THREE.CylinderGeometry(.06, .06, .052, 14), P.pneu, .985);                       // o furo da ponteira
  lata2(new THREE.CylinderGeometry(.076, .088, .045, 16), P.churrascoInox, .06);           // a abracadeira da frente
  // o protetor de calor em cima do silencioso
  const protetor = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095, eixo.length() * .55, 14, 1, true, -1.1, 2.2), toon(P.pneu, { doubleSide: true }));
  protetor.quaternion.copy(giro); protetor.position.copy(meio); protetor.rotateY(Math.PI * .5); lata.add(protetor);

  // ------------------------------------------- a corrente (lado esquerdo)
  const X = -.155;
  por(engrenagem(.125, 18, .014), P.carroAmarelo, X, .455, -1.02);
  por(engrenagem(.06, 10, .016), P.churrascoInoxEscuro, X, .56, -.32);
  const volta = new THREE.CatmullRomCurve3([
    new THREE.Vector3(X, .585, -1.02), new THREE.Vector3(X, .605, -.67), new THREE.Vector3(X, .625, -.33),
    new THREE.Vector3(X, .56, -.25), new THREE.Vector3(X, .495, -.33), new THREE.Vector3(X, .41, -.67),
    new THREE.Vector3(X, .325, -1.02), new THREE.Vector3(X, .455, -1.15),
  ], true);
  lata.add(new THREE.Mesh(new THREE.TubeGeometry(volta, 72, .011, 5, true), toon(P.pneu)));

  // --------------------------------- as pincas de freio douradas na frente
  for (const lado of [-1, 1]) {
    const pinca = por(quina(.035, .1, .055, .012), P.carroAmarelo, lado * .128, .62, .9); pinca.rotation.x = .6;
  }

  // ---------------------------------------------- a lanterna e os piscas
  // a lanterna: a caixa escura em volta, para o vermelho dela nao sumir no vermelho da moto
  const caixa = por(quina(.21, .075, .04, .015), P.pneu, 0, 1.13, -1.37); caixa.rotation.x = -.35;
  const lanterna = por(quina(.17, .045, .03, .012), P.onibusLanterna, 0, 1.13, -1.388); lanterna.rotation.x = -.35;
  for (const lado of [-1, 1]) {
    tubo([lado * .1, 1.0, -1.28], [lado * .2, 1.0, -1.3], .009, P.pneu);
    por(quina(.05, .03, .035, .012), P.onibusPisca, lado * .215, 1.0, -1.3);
    por(quina(.035, .03, .06, .012), P.onibusPisca, lado * .345, 1.18, .93);
  }

  // ---------------------------------- o emblema do Capy na carenagem
  for (const lado of [-1, 1]) {
    const x = lado * .382;
    const disco = new THREE.Mesh(new THREE.CircleGeometry(.105, 28), toon(P.salvaVidasBranco));
    disco.position.set(x, .93, .45); disco.rotation.y = lado * Math.PI / 2; lata.add(disco);
    for (const [a, l] of [[.11, .032], [.032, .11]]) {
      const braco = new THREE.Mesh(new THREE.PlaneGeometry(l, a), toon(P.salvaVidasVermelho));
      braco.position.set(x + lado * .004, .93, .45); braco.rotation.y = lado * Math.PI / 2; lata.add(braco);
    }
  }
}

/**
 * O CAPACETE ABERTO do Capy (um 3/4, para a cara e o oculos aparecerem): a
 * cupula vermelha inclinada para tras — a testa sobe e a nuca desce —, o
 * friso de borracha na borda, a pala curtinha na frente, a faixa branca de
 * ponta a ponta por cima, os tres respiros, a cruz de salva-vidas nos lados
 * e a jugular passando por baixo do queixo com a fivela. O grupo vai na
 * cabeca dele, entao vira junto quando ele olha para o lado.
 */
function capaceteDoCapy(): THREE.Group {
  const capacete = new THREE.Group(); capacete.name = 'capacete-do-capy';
  const casco = new THREE.Group(); casco.position.y = .045; casco.rotation.x = -.3; capacete.add(casco);
  const R = { x: .164, y: .15, z: .17 }, BORDA = 1.4;
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, BORDA), toon(P.salvaVidasVermelho));
  cupula.scale.set(R.x, R.y, R.z); casco.add(cupula);
  const forro = new THREE.Mesh(new THREE.SphereGeometry(.97, 32, 16, 0, Math.PI * 2, 0, BORDA), toon(P.onibusInterior, { doubleSide: true }));
  forro.scale.set(R.x, R.y, R.z); casco.add(forro);
  // o friso de borracha na beira
  const friso = new THREE.Mesh(new THREE.TorusGeometry(1, .055, 6, 48).rotateX(Math.PI / 2), toon(P.pneu));
  friso.scale.set(R.x * Math.sin(BORDA), R.y * .9, R.z * Math.sin(BORDA)); friso.position.y = R.y * Math.cos(BORDA); casco.add(friso);
  // a pala: um pedaco de cone abrindo para baixo e para a frente
  const pala = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 1, 28, 1, true, -.75, 1.5), toon(P.salvaVidasVermelho, { doubleSide: true }));
  pala.scale.set(R.x * Math.sin(BORDA), .022, R.z * Math.sin(BORDA)); pala.position.y = R.y * Math.cos(BORDA) - .006; casco.add(pala);
  // a faixa branca da testa a nuca
  const a0 = Math.PI / 2 - (BORDA - .04);
  const faixa = new THREE.TorusGeometry(1, .05, 4, 40, Math.PI - 2 * a0); faixa.scale(1, 1, 2.6); faixa.rotateZ(a0); faixa.rotateY(Math.PI / 2);
  const listra = new THREE.Mesh(faixa, toon(P.salvaVidasBranco)); listra.scale.set(R.x, R.y, R.z); casco.add(listra);
  // pontos na casca: a posicao e o giro que deita uma peca nela
  const naCasca = (dir: THREE.Vector3, eixoLocal: THREE.Vector3, fora = .002): { p: THREE.Vector3; q: THREE.Quaternion } => {
    const u = dir.clone().normalize(), p = new THREE.Vector3(u.x * R.x, u.y * R.y, u.z * R.z);
    const n = new THREE.Vector3(p.x / (R.x * R.x), p.y / (R.y * R.y), p.z / (R.z * R.z)).normalize();
    return { p: p.addScaledVector(n, fora), q: new THREE.Quaternion().setFromUnitVectors(eixoLocal, n) };
  };
  // os respiros, na frente do alto, dos dois lados da faixa
  for (const x of [-.36, .36]) for (const z of [.55, .3]) {
    const { p, q } = naCasca(new THREE.Vector3(x, 1, z), new THREE.Vector3(0, 1, 0));
    const respiro = new THREE.Mesh(quina(.016, .01, .05, .004), toon(P.pneu)); respiro.position.copy(p); respiro.quaternion.copy(q); casco.add(respiro);
  }
  // a cruz de salva-vidas nos dois lados
  for (const lado of [-1, 1]) {
    const { p, q } = naCasca(new THREE.Vector3(lado * .82, .5, -.12), new THREE.Vector3(lado, 0, 0), .003);
    for (const [a, l] of [[.05, .015], [.015, .05]]) {
      const braco = new THREE.Mesh(quina(.006, a, l, .002), toon(P.salvaVidasBranco)); braco.position.copy(p); braco.quaternion.copy(q); casco.add(braco);
    }
  }
  // a jugular: de um lado da borda, por baixo do queixo, ate o outro
  const jugular = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.15, .065, .01), new THREE.Vector3(-.137, -.03, .05), new THREE.Vector3(-.082, -.106, .072),
    new THREE.Vector3(0, -.127, .077), new THREE.Vector3(.082, -.106, .072), new THREE.Vector3(.137, -.03, .05), new THREE.Vector3(.15, .065, .01),
  ]);
  capacete.add(new THREE.Mesh(new THREE.TubeGeometry(jugular, 40, .0045, 5), toon(P.pneu)));
  const fivela = new THREE.Mesh(quina(.014, .03, .03, .005), toon(P.churrascoInox)); fivela.position.set(.112, -.075, .066); fivela.rotation.z = .7; capacete.add(fivela);
  return fundir(capacete);
}
