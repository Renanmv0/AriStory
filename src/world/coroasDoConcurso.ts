import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { novaTextura, sorteio } from './texturasDeChao';
import { fundir } from './fundir';
import { alturaDaAba, torneada, veludo } from './roupasDaBoutique';
import { chapa, feltro } from './fantasias';

/*
 * AS COROAS DO CONCURSO DE FANTASIAS (`docs/HALLOWEEN.md`, §7.1, G — a 6d):
 * o prêmio que a Estella põe na cabeça da dupla, no palquinho do salão da
 * abóbora. Vaga `cabeca` (y = 0 no centro do crânio), com o capricho das
 * fantasias:
 *
 * - a COROA DE RAINHA (o Ari): pequena, alta e delicada, pousada no alto dos
 *   cachos e um tico de lado; oito paineis de ouro com a ponta em ARCO (a
 *   ogiva), uma pérola em cada ponta, as pedrinhas roxas e laranja alternando
 *   e, no painel da frente, uma ABÓBORINHA de gomos com o cabinho e a folha;
 * - a COROA DE REI (o Renan): mais larga, seis paineis de PONTA RETA com a
 *   bolinha de ouro, a borda de ARMINHO de Halloween (roxo com pintinhas), o
 *   veludo roxo estufado aparecendo por dentro e um MORCEGUINHO de feltro
 *   no meio da frente.
 *
 * Os paineis ficam em volta de um polígono, inclinados para fora como coroa
 * de verdade (`rotation.x` positivo leva o alto do painel para fora); a
 * chapa tem bisel, e o aro de baixo e o de cima fecham a quina. Presente do
 * concurso: fora do ateliê de tinta (entra em `TODAS_AS_FANTASIAS`), e a cor
 * da ficha só repete a do modelo.
 */

/** o painel de uma coroa: a base reta, os lados subindo e a ponta (o arco ou a ponta reta) */
function painel(base: number, topo: number, alto: number, ponta: number, jeito: 'arco' | 'reta'): THREE.Shape {
  const f = new THREE.Shape();
  f.moveTo(-base / 2, 0);
  f.lineTo(base / 2, 0);
  f.lineTo(topo / 2, alto);
  if (jeito === 'arco') {
    // a ogiva: os flancos CÔNCAVOS subindo até a ponta fina (com o ombro
    // cheio, a ponta virava uma corcova e a coroa parecia baixa)
    f.quadraticCurveTo(topo * 0.16, alto + ponta * 0.4, 0, alto + ponta);
    f.quadraticCurveTo(-topo * 0.16, alto + ponta * 0.4, -topo / 2, alto);
  } else {
    // a ponta reta, com o dentinho de cada lado
    f.lineTo(topo * 0.22, alto + ponta * 0.08);
    f.lineTo(0, alto + ponta);
    f.lineTo(-topo * 0.22, alto + ponta * 0.08);
    f.lineTo(-topo / 2, alto);
  }
  f.lineTo(-base / 2, 0);
  return f;
}

/** o arminho de Halloween: pelúcia roxa com as pintinhas pretas (o rabinho do arminho, em roxo) */
function arminho(): THREE.CanvasTexture {
  return novaTextura('coroa:arminho', 0.06, (c, s) => {
    const rnd = sorteio(5150);
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, s, s);
    // o pelo: riscos curtinhos claros e escuros
    for (let i = 0; i < 260; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      c.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(190,190,200,0.5)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + (rnd() - 0.5) * 6, y + 4 + rnd() * 4);
      c.stroke();
    }
    // as pintinhas: a gota escura com o rabinho
    c.fillStyle = '#2a1d3a';
    for (const [x, y] of [[0.25, 0.3], [0.75, 0.72]] as const) {
      c.beginPath();
      c.ellipse(x * s, y * s, s * 0.06, s * 0.1, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo((x - 0.03) * s, (y + 0.06) * s);
      c.lineTo(x * s, (y + 0.18) * s);
      c.lineTo((x + 0.03) * s, (y + 0.06) * s);
      c.fill();
    }
  });
}

interface Anel {
  /** o raio do polígono no pé da coroa */
  raio: number;
  paineis: number;
  alto: number;
  ponta: number;
  jeito: 'arco' | 'reta';
  /** quanto o alto abre para fora */
  abre: number;
}

/**
 * os paineis em volta, e onde fica o meio de cada um (para a pedrinha) e a
 * ponta (para a pérola ou a bolinha), já no referencial da coroa
 */
function anelDePaineis(a: Anel, ouro: THREE.Material): { grupo: THREE.Group; meios: THREE.Object3D[]; pontas: THREE.Vector3[] } {
  const grupo = new THREE.Group();
  const meios: THREE.Object3D[] = [];
  const pontas: THREE.Vector3[] = [];
  const corda = 2 * a.raio * Math.tan(Math.PI / a.paineis);
  const geo = chapa(painel(corda * 1.02, corda * (1 + a.abre * 1.1), a.alto, a.ponta, a.jeito), a.raio * 0.035, a.raio * 0.012, 10);
  geo.translate(0, 0, -a.raio * 0.035);
  for (let k = 0; k < a.paineis; k++) {
    const giro = (k / a.paineis) * Math.PI * 2;
    const p = new THREE.Group();
    p.rotation.set(a.abre, giro, 0, 'YXZ');
    const apotema = a.raio * Math.cos(Math.PI / a.paineis);
    p.position.set(Math.sin(giro) * apotema, 0, Math.cos(giro) * apotema);
    p.add(new THREE.Mesh(geo, ouro));
    const meio = new THREE.Object3D();
    meio.position.set(0, a.alto * 0.5, a.raio * 0.012);
    p.add(meio);
    meios.push(meio);
    grupo.add(p);
    p.updateMatrix();
    pontas.push(new THREE.Vector3(0, a.alto + a.ponta, 0).applyMatrix4(p.matrix));
  }
  return { grupo, meios, pontas };
}

/** uma pedrinha lapidada em cabochão (o oval abaulado), olhando para `+Z` */
function pedrinha(raio: number, cor: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(raio, 12, 8), toon(cor, { glow: 0.18 }));
  m.scale.set(0.8, 1, 0.45);
  return m;
}

/** a abóborinha da coroa de rainha (de gomos, com o cabinho torto e a folhinha), assentada em y = 0 */
function aboborinha(raio: number): THREE.Group {
  const g = new THREE.Group();
  const corpo = torneada([[0.0001, -raio * 0.78], [raio * 0.7, -raio * 0.62], [raio, -raio * 0.1], [raio * 0.85, raio * 0.5], [0.0001, raio * 0.66]], 8, () => raio * 0.14, 32);
  corpo.translate(0, raio * 0.78, 0);
  g.add(new THREE.Mesh(corpo, toon(P.coroaAboborinha)));
  const cabinho = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.1, raio * 0.15, raio * 0.42, 6), toon(P.coroaAboborinhaCabinho));
  cabinho.position.set(raio * 0.05, raio * 1.6, 0);
  cabinho.rotation.z = -0.35;
  g.add(cabinho);
  const folha = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.32, 8, 6), toon(P.coroaAboborinhaCabinho));
  folha.scale.set(1, 0.25, 0.6);
  folha.position.set(-raio * 0.35, raio * 1.42, 0);
  folha.rotation.z = 0.5;
  g.add(folha);
  return g;
}

/** o morceguinho de feltro da coroa de rei (as asas abertas, os olhinhos), olhando para `+Z` */
function morceguinho(largo: number): THREE.Group {
  const g = new THREE.Group();
  const f = new THREE.Shape();
  const L = largo / 2;
  f.moveTo(0, -L * 0.25);
  // a asa da direita, com os três recortes de baixo
  f.quadraticCurveTo(L * 0.35, -L * 0.05, L * 0.55, -L * 0.3);
  f.quadraticCurveTo(L * 0.7, -L * 0.1, L * 0.85, -L * 0.28);
  f.quadraticCurveTo(L * 0.95, -L * 0.05, L, -L * 0.05);
  f.quadraticCurveTo(L * 0.75, L * 0.35, L * 0.2, L * 0.22);
  // as orelhinhas
  f.lineTo(L * 0.16, L * 0.5);
  f.lineTo(L * 0.05, L * 0.3);
  f.lineTo(-L * 0.05, L * 0.3);
  f.lineTo(-L * 0.16, L * 0.5);
  f.lineTo(-L * 0.2, L * 0.22);
  f.quadraticCurveTo(-L * 0.75, L * 0.35, -L, -L * 0.05);
  f.quadraticCurveTo(-L * 0.95, -L * 0.05, -L * 0.85, -L * 0.28);
  f.quadraticCurveTo(-L * 0.7, -L * 0.1, -L * 0.55, -L * 0.3);
  f.quadraticCurveTo(-L * 0.35, -L * 0.05, 0, -L * 0.25);
  g.add(new THREE.Mesh(chapa(f, largo * 0.06, largo * 0.025, 10), toon(P.morceguinhoFeltro, { mapa: feltro(0.05) })));
  for (const lado of [-1, 1]) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(largo * 0.045, 8, 6), toon(P.coroaPerola));
    olho.position.set(lado * L * 0.09, L * 0.08, largo * 0.1);
    g.add(olho);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(largo * 0.022, 6, 4), toon(P.arminhoPinta));
    pupila.position.set(lado * L * 0.09, L * 0.07, largo * 0.13);
    g.add(pupila);
  }
  return g;
}

/** A COROA DE RAINHA (o Ari): pequena e alta, com as pontas em arco, as pérolas e a abóborinha. */
function coroaDeRainha(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const ouro = toon(peca?.cor ?? P.coroaOuro);
  const sombra = toon(P.coroaOuroSombra);
  const coroa = new THREE.Group();
  // pousada no alto dos cachos, um tico de lado e para trás: coquete
  coroa.rotation.set(-0.1, 0, 0.14);
  g.add(coroa);
  const RC = r * 0.58;
  coroa.position.y = alturaDaAba(m, RC) - r * 0.06;
  const anel: Anel = { raio: RC, paineis: 8, alto: r * 0.17, ponta: r * 0.36, jeito: 'arco', abre: 0.16 };
  const { grupo, meios, pontas } = anelDePaineis(anel, ouro);
  coroa.add(grupo);
  // o aro de baixo (mais grosso) e o de cima (fininho), fechando a quina dos paineis
  const aroDeBaixo = new THREE.Mesh(new THREE.TorusGeometry(RC * 1.0, r * 0.03, 6, 32).rotateX(Math.PI / 2), sombra);
  aroDeBaixo.position.y = r * 0.015;
  coroa.add(aroDeBaixo);
  const aroDeCima = new THREE.Mesh(new THREE.TorusGeometry(RC * 1.0 + anel.alto * Math.sin(anel.abre), r * 0.016, 5, 32).rotateX(Math.PI / 2), ouro);
  aroDeCima.position.y = anel.alto * Math.cos(anel.abre);
  coroa.add(aroDeCima);
  // as pérolas nas pontas
  const perola = toon(P.coroaPerola, { glow: 0.12 });
  for (const p of pontas) {
    const bola = new THREE.Mesh(new THREE.SphereGeometry(r * 0.04, 10, 8), perola);
    bola.position.copy(p).add(new THREE.Vector3(0, r * 0.025, 0));
    coroa.add(bola);
  }
  // as pedrinhas alternando, e a abóborinha no painel da frente
  meios.forEach((meio, k) => {
    if (k === 0) {
      const ab = aboborinha(r * 0.095);
      ab.position.set(0, -r * 0.08, r * 0.03);
      meio.add(ab);
      return;
    }
    const pedra = pedrinha(r * 0.05, k % 2 ? P.coroaPedraRoxa : P.coroaPedraLaranja);
    pedra.position.z = r * 0.01;
    meio.add(pedra);
  });
  return fundir(g);
}

/** A COROA DE REI (o Renan): larga, de pontas retas, a borda de arminho, o veludo e o morceguinho. */
function coroaDeRei(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const ouro = toon(peca?.cor ?? P.coroaOuro);
  const coroa = new THREE.Group();
  coroa.rotation.set(-0.06, 0, -0.06);
  g.add(coroa);
  const RC = r * 0.8;
  coroa.position.y = alturaDaAba(m, RC) - r * 0.04;
  // o veludo estufado aparecendo por dentro (os seis gomos entre as pontas)
  const veludoDeDentro = torneada([[RC * 0.92, r * 0.05], [RC * 0.9, r * 0.24], [RC * 0.62, r * 0.42], [0.0001, r * 0.5]], 6, (t) => r * 0.05 * Math.sin(Math.PI * t), 36);
  coroa.add(new THREE.Mesh(veludoDeDentro, toon(peca?.corDetalhe ?? P.coroaVeludo, { mapa: veludo(0.06) })));
  const botao = new THREE.Mesh(new THREE.SphereGeometry(r * 0.06, 10, 8), ouro);
  botao.position.y = r * 0.52;
  coroa.add(botao);
  const anel: Anel = { raio: RC, paineis: 6, alto: r * 0.22, ponta: r * 0.2, jeito: 'reta', abre: 0.1 };
  const { grupo, meios, pontas } = anelDePaineis(anel, ouro);
  grupo.position.y = r * 0.06;
  coroa.add(grupo);
  for (const p of pontas) {
    const bola = new THREE.Mesh(new THREE.SphereGeometry(r * 0.045, 10, 8), ouro);
    bola.position.copy(p).add(new THREE.Vector3(0, r * 0.085, 0));
    coroa.add(bola);
  }
  // a borda de arminho no pé, gordinha
  const borda = new THREE.Mesh(new THREE.TorusGeometry(RC * 1.04, r * 0.085, 10, 36).rotateX(Math.PI / 2), toon(P.arminhoRoxo, { mapa: arminho() }));
  borda.scale.y = 0.85;
  borda.position.y = r * 0.04;
  coroa.add(borda);
  // as pedrinhas, e o morceguinho no painel da frente
  meios.forEach((meio, k) => {
    if (k === 0) {
      const bat = morceguinho(r * 0.34);
      bat.position.set(0, r * 0.02, r * 0.02);
      meio.add(bat);
      return;
    }
    const pedra = pedrinha(r * 0.055, k % 2 ? P.coroaPedraLaranja : P.coroaPedraRoxa);
    pedra.position.z = r * 0.01;
    meio.add(pedra);
  });
  return fundir(g);
}

export { coroaDeRainha, coroaDeRei };
