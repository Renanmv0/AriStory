import * as T from 'three';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { toon } from '../core/materials';
import { fundir } from './fundir';
import { veludo } from './roupasDaBoutique';
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

// Perfil em unidades da peça: altura no tronco/braço e raio relativo à largura do molde.
// A dobra para dentro no começo fecha a parte de baixo da barra.
type Perfil = ReadonlyArray<readonly [number, number]>;
function malhaDeTrico(perfil: Perfil, altura: number, largura: number, cor: number, profundidade = 1) {
  const pontos = perfil.map(([y, r]) => new T.Vector2(r * largura, y * altura));
  const geo = new T.LatheGeometry(pontos, 40);
  const mesh = new T.Mesh(geo, toon(cor, { mapa: veludo(), doubleSide: true }));
  mesh.scale.z = profundidade;
  return mesh;
}

const CORPO: Perfil = [
  [-.135, .99], [-.14, 1.10], [-.117, 1.15], [-.039, 1.17],
  [-.010, 1.18], [.045, 1.29], [.16, 1.32], [.42, 1.30],
  [.65, 1.25], [.80, 1.21], [.89, 1.12], [.946, .90], [.98, .70],
];
const CREME = 0xffe5ba, FRAMBOESA = 0x843449, SALVIA = 0x49776a;

function casaco(m: MedidasCorpo, ari: boolean) {
  const g = new T.Group();
  const h = m.h, r = h * .105 * m.w, altura = m.torsoH;
  const cor = ari ? CEREJA : PINHO;
  const base = malhaDeTrico(CORPO, altura, r, cor, .90);
  g.position.y = m.legH;
  g.add(base);

  // O bordado e os bolsos assentam no volume da malha, inclusive nas laterais.
  function superficie(a: number, y: number, relevo = 0) {
    const i = CORPO.findIndex(([nivel], indice) => indice >= 2 && nivel >= y);
    const [baixo, r0] = CORPO[i - 1], [alto, r1] = CORPO[i];
    const raio = r * T.MathUtils.lerp(r0, r1, (y - baixo) / (alto - baixo)) + relevo;
    return v(Math.sin(a) * raio, y * altura, Math.cos(a) * raio * .90);
  }
  function debrum(y: number, corLinha: number, esp: number) {
    const aro = Array.from({length: 49}, (_,i) => superficie(i * Math.PI / 24, y, .001*h));
    cordao(g, aro, esp * h, corLinha);
  }
  debrum(-.095, CREME, .0035);
  debrum(-.050, OURO, .0025);
  for (let i=0; i<32; i++) {
    const a=i*Math.PI/16;
    cordao(g,[superficie(a,-.087,.002*h),superficie(a,-.067,.003*h),superficie(a,-.055,.002*h)],.0017*h,ari?0xca6876:0x689383);
  }

  // Uma faixa de pequenas estrelas percorre também as costas.
  for(let i=0; i<15; i++){
    const a=(i+.5)*2*Math.PI/15;
    const bordado=estrela(h*.011, i%2 ? CREME : OURO);
    bordado.rotation.y=a;
    bordado.position.copy(superficie(a,.12,.002*h));
    g.add(bordado);
  }

  // Bolso acolchoado com a boca aberta e o aplique costurado na face externa.
  const bolso=new T.Group();
  bolso.position.copy(superficie(0,.43));bolso.scale.setScalar(h);g.add(bolso);
  const feltro=ari ? FRAMBOESA : SALVIA;
  bola(bolso,feltro,0,-.003,0,.076,.053,.024);
  cordao(bolso,[v(-.068,.021,.006),v(0,.013,.023),v(.068,.021,.006)],.0045,ari?0xe19399:0xa1b99a);
  if(ari){
    const estrelaDoBolso=estrela(.041,OURO);
    estrelaDoBolso.position.set(0,-.009,.024);bolso.add(estrelaDoBolso);
    for(const lado of [-1,1]){
      bola(bolso,0x603a33,lado*.009,-.008,.035,.003,.004,.0025);
      bola(bolso,0xe69a8e,lado*.015,-.015,.034,.004,.0025,.002);
    }
    // Gola de duas pétalas, com fecho e dois pompons em alturas diferentes.
    for(const lado of [-1,1]){
      const petala=bola(g,CREME,lado*.043*h,.85*altura,.081*h,.055*h,.032*h,.025*h);
      petala.rotation.z=lado*.26;
      const fim=superficie(lado*.19,.63+(lado+1)*.034,.006*h);
      cordao(g,[superficie(0,.85,.004*h),superficie(lado*.12,.77,.008*h),fim],.003*h,OURO);
      bola(g,MARFIM,fim.x,fim.y,fim.z,.012*h,.014*h,.012*h);
    }
  }else{
    // Uma rena de feltro com o focinho e as orelhas em relevo.
    for(const lado of [-1,1]){
      cordao(bolso,[v(lado*.013,.002,.024),v(lado*.021,.018,.023),v(lado*.023,.029,.020)],.0034,CANELA);
      cordao(bolso,[v(lado*.020,.016,.023),v(lado*.031,.018,.022),v(lado*.034,.022,.021)],.0028,CANELA);
      const orelha=bola(bolso,CANELA,lado*.025,.001,.025,.012,.006,.005);orelha.rotation.z=lado*.4;
    }
    bola(bolso,0xc99368,0,-.010,.026,.028,.022,.008);
    for(const lado of [-1,1])bola(bolso,0x48312a,lado*.011,-.007,.034,.003,.0036,.0025);
    bola(bolso,CEREJA,0,-.017,.035,.008,.006,.005);
    // Gola dobrada e cachecol curto jogado para um lado.
    g.add(malhaDeTrico([[.79,1.17],[.81,1.21],[.88,1.16],[.94,1.03],[.95,.93]],altura,r,FRAMBOESA,.94));
    const ponta=new T.Group();ponta.position.copy(superficie(.56,.69,.012*h));ponta.rotation.y=.5;ponta.rotation.z=.19;g.add(ponta);
    bola(ponta,FRAMBOESA,0,0,0,.024*h,.059*h,.014*h);
    for(const faixa of [-.035,-.027])cordao(ponta,[v(-.018*h,faixa*h,.004*h),v(0,faixa*h,.013*h),v(.018*h,faixa*h,.004*h)],.0027*h,OURO);
    for(const lado of [-1,0,1])bola(ponta,FRAMBOESA,lado*.009*h,-.053*h,.002*h,.003*h,.013*h,.003*h);
  }
  return fundir(g);
}

function manga(m: MedidasCorpo, cor: number) {
  const g=new T.Group(), raio=m.h*.038*m.w, altura=m.armLen;
  // Manga caída no ombro, fofa no antebraço e franzida antes do punho.
  g.add(malhaDeTrico([[-.80,.88],[-.77,1.11],[-.66,1.18],[-.61,1.35],[-.40,1.40],[-.17,1.45],[-.05,1.33],[.03,1.02],[.07,.58],[.077,.1]],altura,raio,cor));
  g.add(malhaDeTrico([[-.82,.86],[-.81,1.10],[-.78,1.16],[-.69,1.22],[-.673,1.16]],altura,raio,CREME));
  g.add(malhaDeTrico([[-.755,1.19],[-.735,1.20]],altura,raio,OURO));
  return fundir(g);
}

const comum={tipo:'vestivel',nota:'Do pedido de Natal do Renan · Papita Delivery'} as const;
export const PECAS_DE_NATAL = {
  gorroEstrela:{...comum,id:'natal-gorro-estrela',nome:'Touquinha da Estrela',icone:'🎅',slot:'cabeca',amostra:CEREJA,extra:touquinha},
  tiaraRena:{...comum,id:'natal-tiara-rena',nome:'Galhinhos de Rena',icone:'🦌',slot:'cabeca',amostra:CANELA,extra:tiaraDeRena},
  casacoEstrela:{...comum,id:'natal-casaco-estrela',nome:'Casaco Noite de Estrelas',icone:'🌟',slot:'tronco',cor:CEREJA,corDetalhe:CEREJA,extra:(m:MedidasCorpo)=>casaco(m,true),extraBraco:(m:MedidasCorpo)=>manga(m,CEREJA)},
  casacoRena:{...comum,id:'natal-casaco-rena',nome:'Casaco Rena do Bosque',icone:'🎄',slot:'tronco',cor:PINHO,corDetalhe:PINHO,extra:(m:MedidasCorpo)=>casaco(m,false),extraBraco:(m:MedidasCorpo)=>manga(m,PINHO)},
  meiasEstrela:{...comum,id:'natal-meias-estrela',nome:'Listras de bengalinha',icone:'🍬',slot:'pernas',cor:0x83334b,corDetalhe:0xe6b0a4,extra:calcaListrada},
  meiasRena:{...comum,id:'natal-meias-rena',nome:'Tricô da floresta',icone:'🧶',slot:'pernas',cor:0x34494a,corDetalhe:0x53756b,extra:calcaListrada},
  botas:{...comum,id:'natal-botinas',nome:'Botinas de fivela dourada',icone:'🥾',slot:'pes',cor:0x653e36,corDetalhe:OURO,substituiPe:true,extra:sapatoDeVerniz},
} satisfies Record<string,ItemDef>;
const p=PECAS_DE_NATAL;
export const NATAL_DO_ARI=[p.gorroEstrela,p.casacoEstrela,p.meiasEstrela,p.botas];
export const NATAL_DO_RENAN=[p.tiaraRena,p.casacoRena,p.meiasRena,p.botas];
