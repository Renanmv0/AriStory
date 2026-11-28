import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../../core/materials';
import { papelDaBilheteria } from './naBilheteria';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Mano } from '../../entities/bichos/Mano';
import { NATAL_NO_JOGO, TESTE_DE_NATAL, PRESENTE_COOKIE, PRESENTE_MANO } from '../Natal';
import { saborDaCeia } from './globoDoMano';

const AJUSTADA='natal:2026:alca-ajustada', CEREJA='natal:2026:alca-cereja';
const pinho=0x356957, vinho=0xaa3851, mel=0xd9a558, creme=0xffebcb;
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const suave=(t:number)=>T.MathUtils.smoothstep(t,0,1);

function malha(g:T.Object3D,geo:T.BufferGeometry,cor:number,x:number,y:number,z:number){
  const m=new T.Mesh(geo,toon(cor));m.position.set(x,y,z);g.add(m);return m;
}
function caixa(g:T.Object3D,cor:number,x:number,y:number,z:number,l:number,a:number,p:number){
  return malha(g,new RoundedBoxGeometry(l,a,p,2,Math.min(.017,a/4,p/4,l/4)),cor,x,y,z);
}
function oval(g:T.Object3D,cor:number,x:number,y:number,z:number,a:number,b:number,c:number){
  const m=malha(g,new T.SphereGeometry(1,20,14),cor,x,y,z);m.scale.set(a,b,c);return m;
}

function montarOficina(){
  const oficina=new T.Group(), tampo=.65;
  for(const x of [-.37,.37])for(const z of [-.21,.21])caixa(oficina,pinho,x,tampo/2,z,.045,tampo,.045);
  caixa(oficina,mel,0,tampo,0,.93,.055,.59);
  caixa(oficina,vinho,0,.69,0,.74,.055,.43);
  caixa(oficina,creme,0,.72,0,.70,.018,.40);
  const tampa=new T.Group();tampa.position.set(0,.737,-.21);oficina.add(tampa);
  // Tampa-caixa: mesmo fechada, há espaço para a tira arqueada sobre o cabo.
  caixa(tampa,pinho,0,.203,.211,.75,.033,.428);
  caixa(tampa,mel,0,.222,.212,.088,.008,.426);
  for(const lado of [-1,1]){
    caixa(tampa,pinho,lado*.362,.10,.212,.024,.205,.426);
    caixa(tampa,pinho,0,.10,.212+lado*.203,.72,.205,.023);
  }
  caixa(tampa,creme,0,.182,.212,.68,.010,.36);
  const etiqueta=papelDaBilheteria('mano');
  const original=new T.Mesh(new T.PlaneGeometry(.38,.19),etiqueta);
  original.rotation.x=Math.PI/2;original.position.set(0,.174,.21);tampa.add(original);
  const verso=new T.Mesh(new T.PlaneGeometry(.19,.095),etiqueta);
  verso.rotation.set(-Math.PI/2,0,-.22);verso.position.set(.17,.225,.26);tampa.add(verso);
  const colher=new T.Group(), alca=new T.Group();
  caixa(colher,0xba7851,0,0,-.018,.084,.038,.245);
  caixa(colher,mel,0,.003,.115,.053,.031,.091);
  const concha=malha(colher,new T.SphereGeometry(1,32,16,0,Math.PI*2,Math.PI/2,Math.PI/2),0xe6c994,0,.019,.232);
  concha.material=toon(0xe6c994,{doubleSide:true});concha.scale.set(.099,.056,.116);
  const borda=malha(colher,new T.TorusGeometry(1,.044,7,36),mel,0,.018,.232);
  borda.rotation.x=Math.PI/2;borda.scale.set(.099,.116,.11);
  for(const lado of [-1,1])oval(colher,mel,lado*.035,.019,-.063,.010,.008,.010);
  // Uma tira chata com duas bordas costuradas, deixando espaço entre o cabo e o couro.
  const percurso=new T.CatmullRomCurve3([v(-.045,.014,-.068),v(-.065,.084,-.067),v(0,.127,-.067),v(.065,.084,-.067),v(.045,.014,-.068)]);
  const vertices:number[]=[],indices:number[]=[];
  for(let i=0;i<=24;i++){
    const p=percurso.getPointAt(i/24);
    for(const d of [-.023,.023])vertices.push(p.x,p.y,p.z+d);
    if(i){const j=i*2;indices.push(j-2,j-1,j,j-1,j+1,j);}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
  const couro=new T.Mesh(geo,toon(pinho,{doubleSide:true}));alca.add(couro);
  for(let i=1;i<23;i+=2){
    for(const d of [-.017,.017]){
      const a=percurso.getPointAt(i/24),b=percurso.getPointAt((i+.85)/24);
      a.z+=d;b.z+=d;
      malha(alca,new T.TubeGeometry(new T.LineCurve3(a,b),2,.002,5,false),creme,0,.001,0);
    }
  }
  colher.add(alca);oficina.add(colher);
  return {oficina,tampa,colher,alca,couro,etiqueta};
}

export function presenteDoMano(w:WorldBuilder,posto:{x:number;z:number},mano:Mano,ocupado:()=>boolean){
  if(!TESTE_DE_NATAL&&!NATAL_NO_JOGO)return;
  const g=w.game,x=posto.x+1.87,z=posto.z+2.30;
  const ajustar='Ajustar a colher do Mano', entregar='Dar a colher ao Mano', rever='Ver o Mano servir';
  let pecas:ReturnType<typeof montarOficina>|undefined;
  let ativa=true, quadro:((dt:number)=>void)|undefined, terminar:(()=>void)|undefined;
  const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function guardar(){
    if(!pecas)return;
    const {oficina,colher,alca,tampa,couro}=pecas;
    oficina.add(colher);colher.scale.setScalar(1);colher.rotation.set(0,.99,0);
    colher.position.set(-.035,.783,-.039);
    alca.position.x=g.flag(AJUSTADA)?0:-.13;
    tampa.rotation.x=g.flag(AJUSTADA)&&!g.flag(PRESENTE_MANO)?0:-1.90;
    couro.material=toon(g.flag(CEREJA)?vinho:pinho,{doubleSide:true});
    it.label=g.flag(PRESENTE_MANO)?rever:g.flag(AJUSTADA)?entregar:ajustar;
  }
  function animar(segundos:number,desenhar:(t:number)=>void){
    if(reduz||!ativa){if(ativa)desenhar(1);return Promise.resolve();}
    return new Promise<void>(resolve=>{
      let t=0;terminar=resolve;
      quadro=dt=>{
        t=Math.min(1,t+dt/segundos);desenhar(t);
        if(t===1){quadro=undefined;terminar=undefined;resolve();}
      };
    });
  }
  const it=w.interact({id:'natal:colher-do-mano',x,z:z+.54,radius:1.13,priority:3,label:ajustar,icon:'🎁',onInteract:async()=>{
    if(!pecas||ocupado())return;
    const {tampa,colher,alca,couro}=pecas,asa=mano.membroDeEntrega;
    let teste:T.Group|undefined,bola:T.Mesh|undefined;
    const fov=T.MathUtils.radToDeg(2*Math.atan(Math.max(.38,.43*innerHeight/innerWidth)));
    const perto=v(x+.04,1.46,z+.84), mesa=v(x,.78,z);
    const longe=v(mano.x+.09,1.14,mano.z+2.0), pinguim=v(mano.x-.15,.74,mano.z+.16);
    const pos=new T.Vector3(),mira=new T.Vector3();
    const camera=(t:number)=>g.setCameraOmbro(pos.lerpVectors(perto,longe,suave(t)),mira.lerpVectors(mesa,pinguim,suave(t)),fov);
    g.lockPlayer(true);g.setPlayerVisible(false);g.setCompanionVisible(false);
    try{
      camera(0);
      if(!g.flag(AJUSTADA)){
        await g.say('A etiqueta do Cookie coube na caixa. Agora falta prender a tira no cabo. Assim o Mano pode abrir a nadadeira sem deixar a colher cair.', 'Renan');
        if(!ativa)return;
        const cor=await g.ask('Qual alça de couro vamos costurar?', ['🌲 Verde-pinho','🍒 Vermelho-cereja','Voltar depois']);
        if(!ativa||cor<0||cor>1)return;
        couro.material=toon(cor===1?vinho:pinho,{doubleSide:true});g.som('folhear');
        await animar(.9,t=>{alca.position.set(-.13*(1-suave(t)),.07*Math.sin(t*Math.PI),0);});
        if(!ativa)return;
        g.som('clique');await g.say('Passei a fita pelos dois rebites. Puxa daí, Ari. Ficou firme?', 'Renan');
        if(!ativa)return;
        await animar(.62,t=>{tampa.rotation.x=-1.90*(1-suave(t));});
        if(!ativa)return;
        g.setFlag(CEREJA,cor===1);g.setFlag(AJUSTADA);guardar();
      }
      const primeira=!g.flag(PRESENTE_MANO);
      if(primeira){
        if(await g.ask('A colher está pronta. Vamos chamar o Mano?', ['🎁 Entregar o presente','Guardar para depois'])!==0||!ativa)return;
        g.som('sino');await animar(.58,t=>{tampa.rotation.x=-1.90*suave(t);});
        if(!ativa)return;
      }
      // O ponto de pegar a bola e a boca do copinho vêm do alcance real da asa.
      mano.pararDeEncarar();mano.group.rotation.y=0;
      const repouso=v(-.16,.012,0),mergulho=v(-1.02,-.93,0),copo=v(-1.23,.10,0),alto=v(-1.96,-.50,0);
      const posar=(p:T.Vector3)=>mano.posarComColher(p.x,p.y);
      const destino=v(0,-.143,-.040),giro=new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2,0,0));
      const pegarPonto=(pose:T.Vector3)=>{
        posar(pose);
        const centro=v(0,.054,.232).applyQuaternion(giro).add(destino);
        return asa.localToWorld(centro);
      };
      const pote=pegarPonto(mergulho),casquinha=pegarPonto(copo);
      posar(repouso);
      teste=new T.Group();w.add(teste);
      // Um pouco de ar entre a colher e o copo deixa a soltura da bola legível.
      casquinha.y-=.065;
      const altura=Math.min(pote.y-.13,casquinha.y-.17);
      const cx=(pote.x+casquinha.x)/2,cz=(pote.z+casquinha.z)/2;
      caixa(teste,creme,cx,altura-.017,cz,Math.abs(pote.x-casquinha.x)+.33,.034,Math.abs(pote.z-casquinha.z)+.31);
      for(const lado of [-1,1])for(const frente of [-1,1])
        caixa(teste,pinho,cx+lado*.18,altura*.5,cz+frente*.098,.036,altura,.036);
      const sabor=saborDaCeia(g);
      malha(teste,new T.CylinderGeometry(.133,.104,pote.y-altura,24),0xba7977,pote.x,(pote.y+altura)*.5,pote.z);
      const sorvete=new T.Color(sabor.cor).lerp(new T.Color(creme),.27).getHex();
      oval(teste,sorvete,pote.x,pote.y,pote.z,.123,.040,.123);
      for(let i=0;i<2;i++){
        malha(teste,new T.CylinderGeometry(.133-i*.009,.133-i*.009,.010,28),mel,pote.x,pote.y-.012-i*.048,pote.z);
      }
      malha(teste,new T.CylinderGeometry(.082,.055,casquinha.y-altura-.035,24),vinho,casquinha.x,(casquinha.y+altura-.035)*.5,casquinha.z);
      malha(teste,new T.CylinderGeometry(.086,.083,.018,24),creme,casquinha.x,casquinha.y-.038,casquinha.z);
      // A entrega passa do veludo para a asa sem saltar entre coordenadas locais.
      asa.attach(colher);
      const origem=colher.position.clone(),q=colher.quaternion.clone(),tam=colher.scale.clone();
      const unit=v(1,1,1);
      await animar(1.18,t=>{
        const k=suave(t);camera(t);colher.position.lerpVectors(origem,destino,k);colher.position.y+=.11*Math.sin(Math.PI*t);
        colher.quaternion.slerpQuaternions(q,giro,k);colher.scale.lerpVectors(tam,unit,k);
        mano.posarComColher(-.16-.89*k,-.38*k);
      });
      if(!ativa)return;
      if(primeira){await g.say('É pra mim? Olha! Abri a nadadeira e ela ficou aqui. Pera. Isso merece um teste científico. De sorvete.', 'Mano');if(!ativa)return;}
      const detalhe=v(mano.x-.08,1.04,mano.z+1.68), miraDetalhe=v(cx+.08,mano.group.position.y+.66,cz-.09);
      const aproximar=(t:number)=>g.setCameraOmbro(pos.lerpVectors(longe,detalhe,suave(t)),mira.lerpVectors(pinguim,miraDetalhe,suave(t)),fov);
      const deslizar=(de:T.Vector3,para:T.Vector3,t:number)=>mano.posarComColher(T.MathUtils.lerp(de.x,para.x,suave(t)),T.MathUtils.lerp(de.y,para.y,suave(t)));
      await animar(.73,t=>{deslizar(v(-1.05,-.38,0),mergulho,t);aproximar(t);});
      if(!ativa)return;
      bola=oval(colher,sorvete,0,.054,.232,.079,.072,.081);
      // A beirada irregular é a última volta da concha ao raspar o sorvete.
      for(let i=0;i<9;i++){
        const a=i*Math.PI*2/9;
        const borda=malha(bola,new T.SphereGeometry(1,10,6),sorvete,.76*Math.cos(a),-.36,.75*Math.sin(a));
        borda.scale.set(.27,.20+(i%3)*.022,.26);
      }
      await animar(.69,t=>deslizar(mergulho,alto,t));
      if(!ativa)return;
      await g.say('Uma bola de '+sabor.nome+'. Redondinha. E a colher ainda tá comigo!', 'Mano');
      if(!ativa)return;
      await animar(.66,t=>deslizar(alto,copo,t));
      if(!ativa)return;
      teste.attach(bola);const de=bola.position.clone();
      await animar(.38,t=>{bola!.position.lerpVectors(de,casquinha,t*t);});
      if(!ativa)return;
      g.som('sorvete');await animar(.65,t=>{deslizar(copo,alto,t);aproximar(1-.53*t);});
      if(!ativa)return;
      if(primeira){
        g.setFlag(PRESENTE_MANO);g.unlock({id:'natal-2026-presente-mano',title:'Na medida da nadadeira',place:'Sorveteria do Mano',icon:'🥄',
          note:'Ari e Renan fizeram uma colher com alça '+(g.flag(CEREJA)?'vermelho-cereja':'verde-pinho')+'. O Mano estreou o presente servindo uma bola de '+sabor.nome+'.'});
      }
      await g.say(primeira?'Essa primeira é pra vocês dividirem. A Estella sempre faz bainha nas minhas alças… Dessa vez a gente podia levar uma surpresa pra ela também, né?':'Prontinho. Dessa vez eu nem olhei pra colher. Só um pouquinho.', 'Mano');
      if(!ativa)return;
      // A colher volta ao estojo aberto, na mesma posição em que se pode revê-la.
      pecas.oficina.attach(colher);
      const saida=colher.position.clone(),giroSaida=colher.quaternion.clone(),escalaSaida=colher.scale.clone();
      const pouso=v(-.035,.783,-.039),giroPouso=new T.Quaternion().setFromEuler(new T.Euler(0,.99,0));
      const olhoSaida=pos.clone(),miraSaida=mira.clone();
      await animar(.82,t=>{
        const k=suave(t);
        colher.position.lerpVectors(saida,pouso,k);colher.position.y+=.13*Math.sin(t*Math.PI);
        colher.quaternion.slerpQuaternions(giroSaida,giroPouso,k);colher.scale.lerpVectors(escalaSaida,unit,k);
        g.setCameraOmbro(pos.lerpVectors(olhoSaida,perto,k),mira.lerpVectors(miraSaida,mesa,k),fov);
      });
    }finally{
      mano.soltarColher();
      if(bola){bola.removeFromParent();bola.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});}
      if(teste){teste.removeFromParent();teste.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});}
      if(ativa){guardar();g.setCameraOmbro(null);g.setPlayerVisible(true);g.setCompanionVisible(true);g.lockPlayer(false);}
    }
  }});
  it.enabled=false;
  w.onUpdate(dt=>{
    if(!pecas&&g.flag(PRESENTE_COOKIE)){
      pecas=montarOficina();w.add(w.place(pecas.oficina,x,0,z));w.blockBox(x,z,.46,.30);guardar();
    }
    it.enabled=!!pecas&&!ocupado();quadro?.(dt);
  });
  w.aoDesmontar(()=>{ativa=false;quadro=undefined;terminar?.();pecas?.etiqueta.map?.dispose();pecas?.etiqueta.dispose();});
}
