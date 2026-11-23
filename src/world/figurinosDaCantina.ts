import * as T from 'three';
import { toon } from '../core/materials';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { macia } from './moveisDaBoutique';
import { fundir } from './fundir';
import { vasoDePlanta } from './props';

type Palco = T.Object3D;
const ouro = 0xf1bf67, linho = 0xffefcf, couro = 0x78462e, tinta = 0x352b37;
function grupo(p: Palco, x=0, y=0, z=0) {
  const g = new T.Group(); p.add(g); g.position.set(x,y,z); return g;
}
function malha(p: Palco, geo:T.BufferGeometry, cor:number, x:number,y:number,z:number) {
  const m = new T.Mesh(geo,toon(cor)); m.position.set(x,y,z); p.add(m); return m;
}
function oval(p:Palco,c:number,x:number,y:number,z:number,a:number,b:number,d:number) {
  const m=malha(p,new T.SphereGeometry(1,20,14),c,x,y,z); m.scale.set(a,b,d); return m;
}
function caixa(p:Palco,c:number,x:number,y:number,z:number,a:number,b:number,d:number) {
  return malha(p,macia(a,b,d,Math.min(a,b,d)*.2),c,x,y,z);
}
function disco(p:Palco,c:number,x:number,y:number,z:number,raio:number,alto:number,base=raio) {
  return malha(p,new T.CylinderGeometry(raio,base,alto,32),c,x,y,z);
}
function fio(p:Palco,c:number,r:number,pontos:number[][]) {
  const curva=new T.CatmullRomCurve3(pontos.map(([x,y,z])=>new T.Vector3(x,y,z)));
  return malha(p,new T.TubeGeometry(curva,18,r,7,false),c,0,0,0);
}
function pano(p:Palco,c:number,pontos:number[][],z:number) {
  const s=new T.Shape(pontos.map(([x,y])=>new T.Vector2(x,y)));
  return malha(p,new T.ExtrudeGeometry(s,{depth:.004,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:2}),c,0,0,z);
}
function lente(p:Palco,x:number,y:number,z:number,r:number) {
  malha(p,new T.TorusGeometry(r,.005,8,32),ouro,x,y,z);
}
function camera(p:Palco,touca:boolean) {
  caixa(p,couro,0,0,0,.184,.111,.071);
  for (const x of [-.084,.084]) caixa(p,ouro,x,0,.005,.013,.108,.073);
  caixa(p,tinta,0,0,.041,.126,.09,.018);
  for(let i=0;i<5;i++) caixa(p,i%2?tinta:0x64505b,0,0,.054+.009*i,.106-i*.007,.076-i*.004,.013);
  const aro=disco(p,ouro,0,0,.106,.037,.016); aro.rotation.x=Math.PI/2;
  oval(p,0x2c5363,0,0,.117,.028,.028,.009);
  oval(p,linho,-.008,.012,.125,.006,.006,.002);
  caixa(p,ouro,.058,.062,0,.028,.018,.027);
  if(touca) {
    oval(p,0x9fd9dc,0,.054,0,.11,.04,.061);
    for(let i=0;i<5;i++){
      const x=(i-2)*.033; oval(p,0xffdc63,x,.064,.051,.009,.006,.004);
      oval(p,0xffdc63,x+.005,.071,.052,.005,.005,.004);
    }
  }
}
function biscoito(p:Palco,x:number,y:number,z:number,r:number) {
  const s=new T.Shape();
  // O recorte na borda é a mordida; continua legível contra o paletó escuro.
  s.absarc(0,0,r,.48,Math.PI*2-.48,false);
  s.quadraticCurveTo(r*.52,0,r*Math.cos(.48),r*Math.sin(.48));
  const m=malha(p,new T.ExtrudeGeometry(s,{depth:.005,bevelEnabled:true,bevelThickness:.0015,bevelSize:.0015,bevelSegments:2}),ouro,x,y,z);
  for(const [a,b] of [[-.4,.23],[.15,.45],[-.12,-.45]]) oval(m,couro,r*a,r*b,.007,.003,.003,.002);
}
function chapeuDePalha(p:Palco){
  oval(p,0xd6a357,0,.093,0,.168,.014,.144);
  disco(p,0xecc27a,0,.121,-.005,.087,.055,.113);
  disco(p,0x64734b,0,.105,-.005,.109,.017,.115);
  for(let i=0;i<3;i++){
    const aro=malha(p,new T.TorusGeometry(.12+i*.016,.0018,5,48),0xbb894b,0,.099-i*.001,0);
    aro.rotation.x=Math.PI/2; aro.scale.y=.87;
  }
}
function garfinho(p:Palco,x:number,giro:number){
  const g=grupo(p,x,.09,0); g.rotation.z=giro;
  caixa(g,linho,0,0,0,.006,.09,.005);
  caixa(g,ouro,0,.046,0,.026,.012,.006);
  for(const k of [-1,0,1]) caixa(g,linho,k*.01,.063,0,.005,.029,.004);
}
export function vestirNaCantina(pato:JeanLuc, traje:string|undefined) {
  const fotografo=traje==='fotografoDaFesta'||traje==='fotografoDeTouca';
  const fiscal=traje==='fiscalDeCrocancia', florista=traje==='floristaGastronomico', maestro=traje==='maestroDaCantina';
  if(!fotografo&&!fiscal&&!florista&&!maestro) return null;
  const cabeca=grupo(pato.cabecaDoPato), corpo=grupo(pato.raqueteNaMao.parent!.parent!);
  const asa=pato.raqueteNaMao.parent!;
  const mao=grupo(asa,0,-.17,.075);
  const cor=fiscal?0x263c57:fotografo?0x997349:florista?0x477357:0x633553;
  pato.group.traverse(o=>{
    if(o.name==='bandeira-do-pato') o.visible=false;
    if(o.name==='tecido-do-pato') (o as T.Mesh).material=toon(cor);
  });
  pato.raqueteNaMao.visible=false;
  pato.cabecaDoPato.getObjectByName('boina-do-jean-luc')!.visible=fotografo;
  const adereco=grupo(cabeca);
  const detalhe=grupo(mao);
  const tampa=grupo(detalhe,0,.047,.012);
  const ponta=grupo(adereco,.041,.01,.17);
  const claridade=grupo(detalhe,-.055,.08,.022);
  const quepe=grupo(cabeca);
  if(fiscal){
    quepe.name='quepe-do-fiscal';
    disco(quepe,cor,0,.117,-.005,.117,.061,.104);
    disco(quepe,ouro,0,.095,-.005,.109,.009);
    oval(quepe,0x242937,0,.083,.087,.093,.009,.072);
    biscoito(quepe,0,.125,.115,.018);
    biscoito(corpo,.067,.343,.168,.031);
    lente(adereco,.057,.034,.126,.038);
    fio(adereco,ouro,.003,[[.093,.035,.126],[.118,.028,.087],[.11,-.037,.071],[.098,-.062,.083]]);
    for(const x of [-.026,.026]) for(let i=0;i<3;i++) oval(corpo,ouro,x,.285+i*.027,.181,.006,.006,.004);
    caixa(detalhe,couro,0,.012,.03,.137,.11,.039);
    for(let i=0;i<4;i++) caixa(detalhe,i%2?linho:0xc58741,0,.057,.015+i*.009,.124,.02,.006);
    caixa(tampa,0x9b6743,0,-.023,.033,.138,.055,.009);
    caixa(tampa,ouro,0,-.037,.04,.021,.016,.005);
  } else if(fotografo){
    for(const s of [-1,1]){
      fio(adereco,tinta,.009,[[s*.005,.006,.169],[s*.025,.012,.177],[s*.043,.01,.17]]);
      if(s<0) fio(adereco,tinta,.009,[[-.041,.01,.17],[-.064,.003,.164],[-.085,-.012,.151]]);
      caixa(corpo,couro,s*.085,.29,.151,.057,.058,.018).rotation.y=s*.36;
      fio(corpo,couro,.006,[[s*.071,.414,.078],[s*.112,.337,.133],[s*.064,.264,.18]]);
    }
    fio(ponta,tinta,.009,[[0,0,0],[.022,-.006,-.008],[.044,-.022,-.019]]);
    for(const s of [-1,1])caixa(claridade,linho,0,0,0,.007,.11,.004).rotation.z=s*.77;
    claridade.visible=false;
    camera(detalhe,traje==='fotografoDeTouca');
    caixa(detalhe,linho,-.055,.08,0,.074,.043,.033);
  } else if(florista){
    chapeuDePalha(cabeca);
    for(const s of [-1,1]) fio(corpo,linho,.008,[[s*.102,.408,.06],[s*.087,.374,.14],[s*.07,.297,.175]]);
    pano(corpo,0x68946d,[[-.083,.36],[.083,.36],[.127,.245],[0,.227],[-.127,.245]],.205);
    for(const s of [-1,1]) for(let i=0;i<3;i++) oval(corpo,0xf1cc80,s*(.023+i*.016),.25+i*.011,.213,.009,.004,.003).rotation.z=s*.5;
    const vaso=vasoDePlanta('suculenta',.086,.4); detalhe.add(vaso);
    for(const s of [-1,1]){
      fio(detalhe,0x518052,.004,[[s*.018,.09,0],[s*.025,.133,0],[s*.036,.178,.007]]);
      for(let i=0;i<4;i++) oval(detalhe,i%2?0x84aa5d:0x588a51,s*(.025+(i%2)*.014),.112+i*.018,.008,.019,.011,.008).rotation.z=s*(i%2?.6:-.55);
    }
    garfinho(detalhe,-.045,.34); garfinho(detalhe,.046,-.42);
  } else {
    pano(corpo,linho,[[-.07,.397],[.07,.397],[.057,.337],[0,.27],[-.057,.337]],.174);
    for(const s of [-1,1]){
      pano(corpo,0x49283e,[[s*.056,.395],[s*.119,.373],[s*.085,.348],[s*.098,.343],[s*.027,.282]],.18);
      oval(corpo,0xbd7180,s*.029,.382,.186,.033,.019,.012).rotation.z=s*.2;
    }
    oval(corpo,0x773e54,0,.382,.199,.013,.013,.009);
    for(let i=0;i<3;i++) oval(corpo,ouro,0,.304+i*.021,.185,.005,.005,.004);
    const colher=grupo(detalhe); colher.rotation.z=-.4;
    disco(colher,couro,0,.067,0,.008,.19);
    oval(colher,0xd7a05d,0,.171,0,.03,.049,.009);
    oval(colher,0xab7647,0,.173,.008,.02,.034,.004);
  }
  // Cada ilha estática é fundida separadamente dos pivôs de atuação.
  for(const g of [adereco,detalhe,tampa,ponta,claridade]) g.name='pivo-de-figurino';
  for(const g of [cabeca,corpo,mao]) fundir(g);
  let fase=0,tempo=0,modo='chegada';
  const atuar=(acao:string)=>{
    if(fotografo){adereco.attach(ponta);ponta.position.set(.041,.01,.17);ponta.rotation.set(0,0,0);}
    modo=acao;tempo=0;
  };
  return { atuar, update(dt:number){
    fase+=dt; tempo+=dt;
    const gesto=tempo<2.5?Math.sin(Math.PI*tempo/2.5)**2:0;
    const ritmo=Math.sin(fase*(maestro?4.5:1.8));
    mao.rotation.x=(florista?.17:fotografo?.04:-.28)-.07*ritmo-(fotografo?.18:.12)*gesto;
    mao.position.set(fotografo?-.063:0,-.12+(fotografo?.175:.045)*gesto,.115+(fotografo?.044:0)*gesto);
    mao.rotation.z=maestro?.24+ritmo*.36:florista?-.13+.28*gesto:-.15;
    if(fiscal) {
      const encharcado=modo==='banho'?Math.min(1,tempo*2):modo==='fugaMolhada'?1:0;
      quepe.rotation.x=.46*encharcado;
      quepe.position.y=-.023*encharcado;
      if(modo==='fugaMolhada'){mao.position.y+=.18;mao.rotation.x=-.95;}
      adereco.rotation.z=.05*ritmo+.24*gesto;
      tampa.rotation.x=modo==='carimbo'?-1.7*gesto:0;
    }
    if(fotografo){
      claridade.visible=modo==='comparar' && tempo>.8 && tempo<1.04;
      if(modo==='comparar' && tempo>1.05 && ponta.parent!==detalhe){
        detalhe.add(ponta);ponta.position.set(.07,.038,.055);ponta.rotation.z=-.65;
      }
    }
    if(fotografo && modo==='comparar') adereco.rotation.z=-.38*gesto;
  }, dispose(){for(const g of [cabeca,corpo,mao]){g.removeFromParent();g.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});}} };
}
