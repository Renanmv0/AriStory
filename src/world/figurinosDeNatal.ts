import * as T from 'three';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { toon } from '../core/materials';
import { corpete, naPele, veludo } from './roupasDaBoutique';
import { estrela } from './uniformeDosGatitos';
import { calcaListrada, sapatoDeVerniz } from './fantasias';

const CEREJA = 0xad2342, PINHO = 0x215850, MARFIM = 0xffedcd, OURO = 0xf4bd58, CANELA = 0x92583c;
function bola(g:T.Object3D, cor:number, x:number,y:number,z:number,rx:number,ry:number,rz:number) {
  const m=new T.Mesh(new T.SphereGeometry(1,16,12),toon(cor));
  m.position.set(x,y,z); m.scale.set(rx,ry,rz);g.add(m);return m;
}
function cordao(g:T.Object3D,p:T.Vector3[],r:number,cor:number) {
  const curva=new T.CatmullRomCurve3(p);
  g.add(new T.Mesh(new T.TubeGeometry(curva,Math.max(12,p.length*2),r,7,false),toon(cor)));
}
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

function touquinha(m:MedidasCorpo) {
  const g=new T.Group(), chapeu=new T.Group(), r=m.headR;
  chapeu.rotation.z=-.26;chapeu.position.set(.29*r,m.cabelo(.25)-.17*r,.035*r);g.add(chapeu);
  // Gomos do veludo: a ponta dobra para o lado e termina no pompom.
  const aneis=[[0,0,.83],[.015,.22,.79],[.09,.47,.64],[.23,.68,.46],[.42,.81,.30],[.63,.79,.18],[.78,.64,.08],[.81,.54,.02]];
  const pos:number[]=[],indices:number[]=[];
  for(const [x,y,largura] of aneis)for(let j=0;j<32;j++){
    const a=j*Math.PI/16,f=largura*(1+.025*Math.cos(6*a));
    pos.push((x+Math.cos(a)*f)*r,y*r,Math.sin(a)*f*.88*r);
  }
  for(let i=0;i<aneis.length-1;i++)for(let j=0;j<32;j++){
    const a=i*32+j,b=i*32+(j+1)%32;indices.push(a,a+32,b,b,a+32,b+32);
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(indices);geo.computeVertexNormals();
  chapeu.add(new T.Mesh(geo,toon(CEREJA)));
  for(let j=0;j<18;j++){const a=j*Math.PI/9;bola(chapeu,MARFIM,.78*r*Math.cos(a),.05*r,.67*r*Math.sin(a),.20*r,.17*r,.17*r);}
  bola(chapeu,MARFIM,.83*r,.50*r,0,.23*r,.23*r,.23*r);
  const broche=estrela(.21*r,OURO);broche.position.set(0,.22*r,.73*r);chapeu.add(broche);
  return g;
}

function tiaraDeRena(m:MedidasCorpo) {
  const g=new T.Group(),r=m.headR;
  // A tiara acompanha o volume dos cachos desta pessoa.
  const pontos=Array.from({length:23},(_,i)=>{const a=(i/22-.5)*2.55,d=m.cabelo(a)+.025*r;return v(Math.sin(a)*d,Math.cos(a)*d,0);});
  cordao(g,pontos,.077*r,CEREJA);
  for(const s of [-1,1]){
    const base=m.cabelo(s*.54),raiz=v(s*Math.sin(.54)*base,Math.cos(.54)*base,0);
    const galho=new T.Group();galho.position.copy(raiz);galho.scale.setScalar(r);g.add(galho);
    const principal=[v(0,0,0),v(s*.15,.37,0),v(s*.27,.70,-.08),v(s*.20,.98,-.11)];
    cordao(galho,principal,.083,CANELA);
    const pontas=[principal[3],v(s*.55,.70,-.05),v(-s*.08,.64,.04)];
    cordao(galho,[principal[1],v(s*.42,.50,0),pontas[1]],.067,CANELA);
    cordao(galho,[principal[1],v(0,.49,.02),pontas[2]],.06,CANELA);
    for(const p of pontas)bola(galho,CANELA,p.x,p.y,p.z,.08,.08,.08);
    const orelha=bola(galho,CANELA,s*.33,-.10,.03,.22,.39,.13);orelha.rotation.z=-s*.92;
    const miolo=bola(galho,0xebaf94,s*.34,-.095,.14,.115,.26,.045);miolo.rotation.z=-s*.92;
    if(s===1){bola(galho,CEREJA,.06,.02,.15,.11,.11,.11);bola(galho,CEREJA,.21,.04,.13,.095,.095,.095);}
  }
  return g;
}

function casaco(m:MedidasCorpo,ari:boolean) {
  const g=new T.Group(),h=m.h, y=(t:number)=>m.legH+m.torsoH*t;
  const folga=1.085;
  g.add(new T.Mesh(corpete(m,{baixo:y(-.06),decote:()=>y(.94),folga}),toon(ari?CEREJA:PINHO,{mapa:veludo(),doubleSide:true})));
  // Bordado contínuo; acompanha o contorno inclusive quando visto pelas costas.
  for(const [altura,esp,cor] of [[.15,.007,OURO],[.19,.012,MARFIM],[.27,.006,OURO],[.84,.014,MARFIM]]){
    const aro=Array.from({length:41},(_,j)=>naPele(m,j*Math.PI/20,y(altura),folga+.02));
    cordao(g,aro,esp*h,cor);
  }
  for(let i=0;i<14;i++){
    const a=i*Math.PI/7;
    const ponto=estrela(h*.013,i%2?MARFIM:OURO);ponto.position.copy(naPele(m,a,y(.38),folga+.04));ponto.rotation.y=a;g.add(ponto);
  }
  const centro=naPele(m,0,y(.65),folga+.06);
  if(ari){
    const medalhao=estrela(.046*h,OURO);medalhao.position.copy(centro);g.add(medalhao);
    const miolo=estrela(.026*h,MARFIM);miolo.position.copy(centro);miolo.position.z+=.013*h;g.add(miolo);
  }else{
    const laco=new T.Group();laco.position.copy(centro);laco.scale.setScalar(h);g.add(laco);
    for(const s of [-1,1]){const l=bola(laco,CEREJA,s*.035,.014,0,.038,.022,.013);l.rotation.z=s*.34;}
    bola(laco,OURO,0,-.008,.01,.021,.024,.02);
  }
  return g;
}
function punho(m:MedidasCorpo){
  const g=new T.Group(),r=m.h*.042*m.w;
  for(const [y,raio,cor] of [[-.69,1.1,MARFIM],[-.61,1.06,OURO]]){
    const faixa=new T.Mesh(new T.CylinderGeometry(r*raio,r*raio,m.h*.017,18),toon(cor));faixa.position.y=m.armLen*y;g.add(faixa);
  }return g;
}
const comum={tipo:'vestivel',nota:'Do pedido de Natal do Renan · Papita Delivery'} as const;
export const PECAS_DE_NATAL = {
  gorroEstrela:{...comum,id:'natal-gorro-estrela',nome:'Touquinha da Estrela',icone:'🎅',slot:'cabeca',amostra:CEREJA,extra:touquinha},
  tiaraRena:{...comum,id:'natal-tiara-rena',nome:'Galhinhos de Rena',icone:'🦌',slot:'cabeca',amostra:CANELA,extra:tiaraDeRena},
  casacoEstrela:{...comum,id:'natal-casaco-estrela',nome:'Casaco Noite de Estrelas',icone:'🌟',slot:'tronco',cor:CEREJA,corDetalhe:CEREJA,extra:(m:MedidasCorpo)=>casaco(m,true),extraBraco:punho},
  casacoRena:{...comum,id:'natal-casaco-rena',nome:'Casaco Rena do Bosque',icone:'🎄',slot:'tronco',cor:PINHO,corDetalhe:PINHO,extra:(m:MedidasCorpo)=>casaco(m,false),extraBraco:punho},
  meiasEstrela:{...comum,id:'natal-meias-estrela',nome:'Listras de bengalinha',icone:'🍬',slot:'pernas',cor:0x83334b,corDetalhe:0xe6b0a4,extra:calcaListrada},
  meiasRena:{...comum,id:'natal-meias-rena',nome:'Tricô da floresta',icone:'🧶',slot:'pernas',cor:0x34494a,corDetalhe:0x53756b,extra:calcaListrada},
  botas:{...comum,id:'natal-botinas',nome:'Botinas de fivela dourada',icone:'🥾',slot:'pes',cor:0x653e36,corDetalhe:OURO,substituiPe:true,extra:sapatoDeVerniz},
} satisfies Record<string,ItemDef>;
const p=PECAS_DE_NATAL;
export const NATAL_DO_ARI=[p.gorroEstrela,p.casacoEstrela,p.meiasEstrela,p.botas];
export const NATAL_DO_RENAN=[p.tiaraRena,p.casacoRena,p.meiasRena,p.botas];
