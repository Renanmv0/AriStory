import * as THREE from 'three';
import type { MedidasCorpo } from '../core/types';
import { pinturaAcesa, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { fundir } from './fundir';
import { macia } from './moveisDaBoutique';
import { alturaDaAba, corpete, naPele, noTronco, torneada, vivoNaPele, cintaNaPele } from './roupasDaBoutique';
import { estrela, montarTenis } from './uniformeDosGatitos';
import { escudoDoClube } from './carrinhoDeGolfeDaGina';
import { novaTextura } from './texturasDeChao';

/** Os presentes da Gina: peças reais do guarda-roupa, medidas para cada corpo. */
const V = THREE.Vector3;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const por = (g: THREE.Object3D, geo: THREE.BufferGeometry, cor: number, x = 0, y = 0, z = 0): THREE.Mesh => {
  const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); g.add(m); return m;
};
const tubo = (pontos: THREE.Vector3[], raio: number): THREE.BufferGeometry =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), Math.max(20, pontos.length * 5), raio, 8, false);
const placa = (l: number, a: number, p: number): THREE.BufferGeometry => macia(l, a, p, Math.min(p * .45, l * .08));

function coracao(r: number, cor = P.portariaRosa): THREE.Mesh {
  const f = new THREE.Shape(); f.moveTo(0, -.9 * r);
  f.bezierCurveTo(-1.8 * r, .15 * r, -.85 * r, 1.25 * r, 0, .55 * r);
  f.bezierCurveTo(.85 * r, 1.25 * r, 1.8 * r, .15 * r, 0, -.9 * r);
  return new THREE.Mesh(new THREE.ExtrudeGeometry(f, { depth: r * .2, bevelEnabled: true, bevelSize: r * .08, bevelThickness: r * .08, bevelSegments: 2, curveSegments: 12 }), toon(cor));
}

/** A girafinha é a mesma do clube; medalhão com rebordo de latão e esmalte. */
function medalhao(r: number): THREE.Group {
  const g = new THREE.Group();
  por(g, new THREE.CylinderGeometry(r, r, r * .18, 32), P.portariaOuro).rotation.x = Math.PI / 2;
  const desenho = new THREE.Mesh(new THREE.CircleGeometry(r * .88, 32), pinturaAcesa(escudoDoClube()));
  desenho.position.z = r * .11; g.add(desenho); return g;
}

function sarja(): THREE.Texture {
  return novaTextura('sarja-dos-premios-da-gina', .16, (c, s) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, s, s);
    c.strokeStyle = '#e5e9e1'; c.lineWidth = 1;
    for (let x = -s; x < s * 2; x += 7) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + s, s); c.stroke(); }
  });
}

/** Fitas acompanham o volume da roupa de baixo, inclusive o moletom do Renan. */
function naRoupa(m: MedidasCorpo, a: number, y: number): THREE.Vector3 {
  const p = naPele(m, a, y, 1.1);
  const r = Math.max(Math.hypot(p.x, p.z), (m.porBaixo?.(a, y) ?? 0) + m.h * .009);
  return new V(Math.sin(a) * r, y, Math.cos(a) * r);
}
function cordao(g: THREE.Object3D, m: MedidasCorpo, baixo: number, cor: number): void {
  const alto = m.legH + m.torsoH * .86;
  for (const lado of [-1, 1]) {
    const pontos = [naRoupa(m, lado * 1.45, alto), naRoupa(m, lado * .72, alto + m.h * .025),
      naRoupa(m, lado * .34, alto - m.h * .035), naRoupa(m, lado * .07, baixo)];
    por(g, tubo(pontos, m.h * .007), cor);
    // Costura creme, deslocada para fora da fita: não disputa a mesma superfície.
    por(g, tubo(pontos.map(p => p.clone().add(new V(lado * m.h * .002, 0, m.h * .006))), m.h * .0012), P.portariaCreme);
  }
}

function desenhoDoCracha(): THREE.Texture {
  return novaTextura('cracha-equipe-dos-bebitos', 1, (c, s) => {
    c.fillStyle = css(P.portariaCreme); c.fillRect(0, 0, s, s);
    c.fillStyle = css(P.portariaVerde); c.fillRect(0, 0, s, s * .19);
    c.textAlign = 'center'; c.fillStyle = css(P.portariaCreme);
    c.font = `900 ${s * .075}px sans-serif`; c.fillText('EQUIPE DO CLUBE', s / 2, s * .125);
    c.drawImage(escudoDoClube().image as HTMLCanvasElement, s * .29, s * .25, s * .42, s * .42);
    c.fillStyle = css(P.portariaVerdeEscuro); c.font = `900 ${s * .078}px sans-serif`;
    c.fillText('ARI & RENAN', s / 2, s * .78);
    c.font = `600 ${s * .048}px sans-serif`; c.fillText('porteiros de coração', s / 2, s * .87);
    c.fillStyle = css(P.portariaOuroSombra); c.font = `900 ${s * .065}px sans-serif`; c.fillText('★  ★  ★', s / 2, s * .97);
  }, 512);
}

export function crachaDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group(), h = m.h;
  const y = m.legH + m.torsoH * .63;
  cordao(g, m, y + h * .045, P.portariaVerde);
  const cartao = new THREE.Group(); cartao.position.copy(naRoupa(m, 0, y)); cartao.position.z += h * .012;
  cartao.rotation.z = -.055; g.add(cartao);
  const l = h * .105, a = h * .125, esp = h * .004;
  por(cartao, placa(l + h * .009, a + h * .009, esp), P.portariaOuro);
  por(cartao, placa(l, a, esp), P.portariaCreme, 0, 0, esp * .7);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(l * .94, a * .94), pinturaAcesa(desenhoDoCracha()));
  face.position.z = esp * 1.4; cartao.add(face);
  por(cartao, placa(l * .28, a * .14, esp * 1.8), P.inox, 0, a * .55, 0);
  por(cartao, new THREE.TorusGeometry(h * .009, h * .002, 8, 20), P.portariaOuro, 0, a * .68);
  const mimo = coracao(h * .01); mimo.position.set(l * .48, -a * .53, esp * 1.8); cartao.add(mimo);
  return fundir(g);
}

export function apitoDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group(), h = m.h, y = m.legH + m.torsoH * .52;
  cordao(g, m, y + h * .04, P.portariaMenta);
  const apito = new THREE.Group(); apito.position.copy(naRoupa(m, 0, y)); apito.position.z += h * .024;
  apito.rotation.z = -.23; g.add(apito);
  const r = h * .034, l = h * .044;
  const tambor = por(apito, new THREE.CylinderGeometry(r, r, l, 32), P.portariaOuro); tambor.rotation.x = Math.PI / 2;
  for (const lado of [-1, 1]) {
    por(apito, new THREE.TorusGeometry(r * .88, h * .002, 8, 32), P.portariaOuroSombra, 0, 0, lado * l * .51);
  }
  por(apito, placa(h * .028, h * .044, h * .026), P.portariaOuro, 0, r * 1.08, 0);
  por(apito, placa(h * .021, h * .006, h * .002), P.portariaVerdeEscuro, 0, r * 1.56, h * .014);
  por(apito, placa(h * .023, h * .006, h * .002), P.portariaOuroSombra, 0, h * .011, l * .51);
  por(apito, new THREE.TorusGeometry(h * .011, h * .0025, 8, 20), P.portariaOuro, 0, h * .044, -.01 * h);
  const mimo = coracao(h * .011); mimo.position.set(0, -h * .049, r * .6); apito.add(mimo);
  for (const dy of [-.034, -.043]) por(apito, new THREE.TorusGeometry(h * .006, h * .0015, 8, 20), P.portariaOuro, 0, h * dy, r * .6);
  const e = estrela(h * .007, P.portariaCreme); e.position.set(0, -h * .008, l * .52); apito.add(e);
  return fundir(g);
}

export function quepeDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group(), r = m.headR * 1.05;
  const y = alturaDaAba(m, r) + m.headR * .035;
  const copa = new THREE.Mesh(torneada([[r * 1.04, r * .155], [r * 1.12, r * .28], [r * 1.06, r * .43], [r * .75, r * .53], [0, r * .55]], 0), toon(P.portariaCreme, { mapa: sarja() }));
  copa.position.y = y; copa.scale.z = .86; g.add(copa);
  const faixa = por(g, new THREE.CylinderGeometry(r * 1.035, r, r * .16, 48, 1, true), P.portariaVerde, 0, y + r * .075); faixa.scale.z = .86;
  for (const altura of [.01, .16]) {
    const aro = por(g, new THREE.TorusGeometry(r * 1.035, r * .013, 8, 48), P.portariaOuro, 0, y + r * altura); aro.rotation.x = Math.PI / 2; aro.scale.y = .86;
  }
  // Aba em meia-lua de verdade, com a quina macia e o vivo na curva.
  const f = new THREE.Shape(); f.moveTo(-r * .88, r * .35);
  f.quadraticCurveTo(-r * 1.1, r * 1.43, 0, r * 1.52); f.quadraticCurveTo(r * 1.1, r * 1.43, r * .88, r * .35);
  f.quadraticCurveTo(0, r * .75, -r * .88, r * .35);
  const aba = new THREE.Mesh(new THREE.ExtrudeGeometry(f, { depth: r * .05, bevelEnabled: true, bevelSize: r * .025, bevelThickness: r * .018, bevelSegments: 3, curveSegments: 24 }), toon(P.portariaVerdeEscuro));
  aba.rotation.x = Math.PI / 2; aba.position.y = y; g.add(aba);
  const frente: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24, a = -Math.PI * .5 + t * Math.PI; frente.push(new V(Math.sin(a) * r * .87, y - r * .028, r * .55 + Math.cos(a) * r * .95)); }
  por(g, tubo(frente, r * .014), P.portariaOuro);
  const escudo = medalhao(r * .225); escudo.position.set(0, y + r * .26, r * .99); escudo.rotation.x = -.08; g.add(escudo);
  const tira: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) { const a = -.95 + i / 16 * 1.9; tira.push(new V(Math.sin(a) * r, y + r * (.07 - .07 * Math.cos(a)), Math.cos(a) * r * .92)); }
  por(g, tubo(tira, r * .027), P.portariaOuro);
  for (const lado of [-1, 1]) { const botao = coracao(r * .06); botao.position.set(lado * r * .86, y + r * .08, r * .53); g.add(botao); }
  return fundir(g);
}

function gola(g: THREE.Object3D, m: MedidasCorpo, y: number, cor: number): void {
  for (const lado of [-1, 1]) {
    const f = new THREE.Shape(); f.moveTo(lado * m.h * .003, y);
    f.lineTo(lado * m.h * .05, y + m.h * .003); f.quadraticCurveTo(lado * m.h * .053, y - m.h * .02, lado * m.h * .021, y - m.h * .043); f.closePath();
    const geo = new THREE.ExtrudeGeometry(f, { depth: m.h * .002, bevelEnabled: true, bevelSize: m.h * .001, bevelThickness: m.h * .001, bevelSegments: 2 });
    g.add(new THREE.Mesh(noTronco(geo, m, 1.1), toon(cor)));
  }
}
function bolso(g: THREE.Object3D, m: MedidasCorpo, lado: number, y: number, cor: number, folga = 1.1): void {
  const f = new THREE.Shape(), l = m.h * .051, a = m.h * .039;
  const x = lado * m.h * .063;
  f.moveTo(x - l / 2, y); f.lineTo(x + l / 2, y); f.lineTo(x + l * .43, y - a * .8); f.quadraticCurveTo(x, y - a * 1.2, x - l * .43, y - a * .8); f.closePath();
  const geo = new THREE.ExtrudeGeometry(f, { depth: m.h * .002, bevelEnabled: true, bevelSize: m.h * .001, bevelThickness: m.h * .001, bevelSegments: 2 });
  g.add(new THREE.Mesh(noTronco(geo, m, folga), toon(cor)));
  const pontos = [[lado * .38, y], [lado * .62, y - m.h * .002], [lado * .9, y - m.h * .006]] as Array<[number, number]>;
  por(g, vivoNaPele(m, pontos, m.h * .0018, folga + .02), P.portariaCreme);
}
function bordado(g: THREE.Object3D, m: MedidasCorpo, a: number, y: number, r: number): void {
  const e = medalhao(r); e.position.copy(naPele(m, a, y, 1.14)); e.rotation.y = a; g.add(e);
}

export function coleteDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group(), h = m.h, q = m.legH;
  const alto = q + m.torsoH * .77 + h * .105 * m.w * .55;
  const fundoV = q + m.torsoH * .53, baixo = q + m.torsoH * .14;
  const decote = (a: number): number => fundoV + (alto - fundoV) * Math.min(1, Math.abs(a) / .62);
  g.add(new THREE.Mesh(corpete(m, { decote, baixo, folga: 1.07 }), toon(P.portariaVerde, { mapa: sarja(), doubleSide: true })));
  const borda: Array<[number, number]> = Array.from({length:25},(_,i)=>{const a=-.62+i/24*1.24;return[a,decote(a)];});
  por(g, vivoNaPele(m, borda, h * .003, 1.095), P.portariaOuro);
  gola(g, m, alto - h * .005, P.portariaCreme);
  // Duas faixas refletivas em relevo, com filete creme e pesponto separado.
  for (const y of [q + m.torsoH * .25, q + m.torsoH * .39]) {
    const faixa = por(g, corpete(m, {decote:()=>y+h*.013,baixo:y-h*.013,folga:1.085}), P.portariaRefletivo);
    faixa.name = 'faixa-refletiva';
    por(g, cintaNaPele(m, y + h * .009, h * .0014, 1.1), P.portariaOuro);
  }
  for (const lado of [-1, 1]) bolso(g, m, lado, q + m.torsoH * .47, P.portariaVerdeEscuro);
  for (let i=0;i<3;i++) por(g,new THREE.SphereGeometry(h*.0045,12,8),P.portariaOuro,0,fundoV-h*(.014+i*.025),naPele(m,0,fundoV-h*(.014+i*.025),1.12).z);
  bordado(g,m,-.68,q+m.torsoH*.69,h*.025);
  const mimo=coracao(h*.011);mimo.position.copy(naPele(m,.78,q+m.torsoH*.58,1.12));mimo.rotation.y=.78;g.add(mimo);
  return fundir(g);
}

export function pulseiraVipDaPortaria(m: MedidasCorpo, lado: -1 | 1): THREE.Object3D {
  const g = new THREE.Group(); if(lado!==-1)return g;
  const h=m.h,r=h*.032*m.w*1.22,y=-m.armLen*.79;
  por(g,new THREE.CylinderGeometry(r,r,h*.032,40,1,true),P.portariaMenta,0,y);
  for(const dy of [-.017,.017]){const aro=por(g,new THREE.TorusGeometry(r,h*.0022,8,40),P.portariaOuro,0,y+h*dy);aro.rotation.x=Math.PI/2;}
  const placaVip=por(g,placa(h*.052,h*.025,h*.005),P.portariaCreme,0,y,r+h*.003);
  for(let i=0;i<3;i++){const e=estrela(h*.005,P.portariaOuro);e.position.set(h*(i-1)*.014,y,r+h*.007);g.add(e);}
  placaVip.name='pulseira-vip';
  const argola=por(g,new THREE.TorusGeometry(h*.006,h*.0015,8,20),P.portariaOuro,-r*.65,y-h*.024,r*.6);
  const mimo=coracao(h*.012);mimo.position.copy(argola.position).add(new V(0,-h*.016,h*.001));g.add(mimo);
  for(let i=0;i<5;i++){const a=Math.PI*.65+i*.4;por(g,new THREE.SphereGeometry(h*.004,12,8),i%2?P.portariaRosa:P.portariaCreme,Math.sin(a)*r,y,Math.cos(a)*r);}
  return fundir(g);
}

export function camisaDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g=new THREE.Group(),h=m.h,q=m.legH;
  const alto=q+m.torsoH*.77+h*.105*m.w*.55;
  const decote=(a:number):number=>alto-h*.025*(1-Math.min(1,Math.abs(a)/.6));
  g.add(new THREE.Mesh(corpete(m,{decote,folga:1.045}),toon(P.portariaVerde,{mapa:sarja()})));
  gola(g,m,alto-h*.003,P.portariaCreme);
  const faixa=Array.from({length:8},(_,i):[number,number]=>[0,q+m.torsoH*(.22+i*.075)]);
  por(g,vivoNaPele(m,faixa,h*.005,1.065),P.portariaCreme);
  for(let i=0;i<5;i++){const y=q+m.torsoH*(.25+i*.105);por(g,new THREE.SphereGeometry(h*.004,12,8),P.portariaOuro,0,y,naPele(m,0,y,1.1).z);}
  bolso(g,m,-1,q+m.torsoH*.65,P.portariaVerdeEscuro,1.07);
  bordado(g,m,.58,q+m.torsoH*.67,h*.027);
  // O abraço da Gina nas costas: três estrelas e um coração bordados abaixo do cabelo.
  for(let i=0;i<3;i++){const e=estrela(h*.011,P.portariaOuro);e.position.copy(naPele(m,Math.PI+(i-1)*.24,q+m.torsoH*.5,1.075));e.rotation.y=Math.PI+(i-1)*.24;g.add(e);}
  const mimo=coracao(h*.014);mimo.position.copy(naPele(m,Math.PI,q+m.torsoH*.32,1.075));mimo.rotation.y=Math.PI;g.add(mimo);
  return fundir(g);
}

export function mangaDaPortaria(m: MedidasCorpo, lado: -1|1): THREE.Object3D {
  const g=new THREE.Group(),h=m.h,r=h*.037*m.w;
  const y=-m.armLen*.37;
  const faixa=por(g,new THREE.CylinderGeometry(r*1.1,r*1.05,h*.018,32,1,true),P.portariaVerde,0,y);faixa.rotation.z=lado*.04;
  const vivo=por(g,new THREE.TorusGeometry(r*1.07,h*.0025,8,32),P.portariaOuro,0,y-h*.009);vivo.rotation.x=Math.PI/2;
  return fundir(g);
}

export function calcaDaPortaria(m: MedidasCorpo, lado: -1|1): THREE.Object3D {
  const g=new THREE.Group(),h=m.h,alto=h*.058*m.w,baixo=h*.041*m.w;
  const pano=new THREE.Mesh(torneada([[alto,0],[alto*1.02,-m.legH*.18],[alto*.94,-m.legH*.53],[baixo,-m.legH*.9],[baixo,-m.legH*.96]],0),toon(P.portariaVerdeEscuro,{mapa:sarja()}));g.add(pano);
  for(const cor of [P.portariaMenta,P.portariaOuro]){
    const pontos=[0,.2,.5,.74,.93].map(t=>new V(lado*(alto+(baixo-alto)*t)*1.025,-m.legH*t,cor===P.portariaOuro?h*.006:-h*.006));
    por(g,tubo(pontos,cor===P.portariaOuro?h*.0018:h*.0038),cor);
  }
  const bolso=por(g,placa(h*.003,h*.055,h*.042),P.portariaVerde,lado*alto*1.02,-m.legH*.22,h*.008);bolso.rotation.x=.08;
  const barra=por(g,new THREE.CylinderGeometry(baixo*1.025,baixo*1.03,h*.022,32,1,true),P.portariaVerde,0,-m.legH*.93);barra.name='barra-da-calca';
  return fundir(g);
}
export function cosDaPortaria(m: MedidasCorpo): THREE.Object3D {
  const g=new THREE.Group(),h=m.h,y=m.legH+m.torsoH*.17;
  // O quadril também veste a calça: cobre o calção do rig até entre as pernas.
  por(g,corpete(m,{decote:()=>y+h*.012,folga:1.08}),P.portariaVerdeEscuro);
  // A cápsula afina antes de encontrar as coxas. O tecido do quadril faz a
  // ponte, sem deixar a abertura das pernas parecendo separada da cintura.
  const quadril=torneada([[h*.094*m.w,m.legH-h*.028],
    [h*.114*m.w,m.legH+h*.004],[h*.113*m.w,m.legH+h*.026],
    [naPele(m,Math.PI/2,y,1.08).x,y+h*.003]],0);
  quadril.scale(1,1,.82);por(g,quadril,P.portariaVerdeEscuro);
  const fivela=por(g,placa(h*.03,h*.019,h*.005),P.portariaOuro,0,y,naPele(m,0,y,1.12).z);
  fivela.name='fivela-da-portaria';return fundir(g);
}
export function tenisDaPortaria(m: MedidasCorpo): THREE.Object3D {
  return fundir(montarTenis(m,{cabedal:P.portariaCreme,listra:P.portariaVerde,sola:P.portariaCreme,filete:P.portariaVerdeEscuro,entressola:P.portariaCreme,fileteDoMeio:P.portariaOuro,cadarco:P.portariaMenta,colarinho:P.portariaRosa,alca:P.portariaVerde,emblema:false}));
}
