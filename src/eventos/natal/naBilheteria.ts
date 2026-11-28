import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../../core/materials';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Cookie } from '../../entities/bichos/Cookie';
import type { Interactable } from '../../world/Interactable';
import { PRESENTE_MANO, MAQUINA_ABERTA, NATAL_NO_JOGO, PRESENTE_COOKIE, SOBREMESA, TESTE_DE_NATAL } from '../Natal';

const vinho=0xa73549, mel=0xe1af61, pinho=0x28584f, creme=0xf8e6c1;
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

function bloco(g:T.Group, x:number,y:number,z:number, l:number,a:number,p:number, cor:number, raio=.015){
  const m=new T.Mesh(new RoundedBoxGeometry(l,a,p,2,raio),toon(cor));
  m.position.set(x,y,z);g.add(m);return m;
}
function cordao(g:T.Group, pontos:T.Vector3[], r:number, cor:number){
  const curva=new T.CatmullRomCurve3(pontos);
  const m=new T.Mesh(new T.TubeGeometry(curva,26,r,7,false),toon(cor));g.add(m);return m;
}
type Papel = 'embrulho' | 'cookie' | 'mano';
export function papelDaBilheteria(tipo:Papel){
  const tela=document.createElement('canvas');tela.width=640;tela.height=320;
  const c=tela.getContext('2d')!;
  c.fillStyle=tipo==='embrulho'?'#a4364c':'#fff0d0';c.fillRect(0,0,640,320);
  if(tipo==='embrulho'){
    for(let j=0;j<5;j++)for(let i=0;i<10;i++){
      const x=i*74+(j%2)*37,y=j*74;
      c.fillStyle='#f0c58e';c.beginPath();c.moveTo(x,y-12);c.lineTo(x+4,y-3);
      c.lineTo(x+11,y);c.lineTo(x+3,y+4);c.lineTo(x,y+13);c.lineTo(x-4,y+3);c.lineTo(x-11,y);c.lineTo(x-4,y-3);c.closePath();c.fill();
    }
  }else{
    const tinta=tipo==='cookie'?'#276553':'#9d3d4d';
    c.strokeStyle=tinta;c.lineWidth=5;c.strokeRect(10,10,620,300);
    c.lineWidth=2;c.strokeStyle='#bb924c';c.strokeRect(19,19,602,282);
    c.strokeStyle=tinta;c.lineWidth=4;
    c.beginPath();c.arc(112,139,62,0,Math.PI*2);c.stroke();
    for(let i=0;i<8;i++){
      const ang=i*Math.PI/4,x=112+62*Math.cos(ang),y=139+62*Math.sin(ang);
      c.beginPath();c.moveTo(112,139);c.lineTo(x,y);c.stroke();
      c.fillStyle=i%2?'#b64247':'#d2a454';c.fillRect(x-8,y+2,16,12);
    }
    c.beginPath();c.moveTo(80,245);c.lineTo(112,139);c.lineTo(145,245);c.stroke();
    c.textAlign='left';c.fillStyle=tinta;c.font='bold 25px sans-serif';c.fillText('NATAL NO VILLA LOBOS',203,76);
    c.font='bold 62px Georgia';c.fillText(tipo==='cookie'?'Para o Cookie':'Para o Mano',201,155);
    c.font='28px Georgia';c.fillText(tipo==='cookie'?'Por todos os sorrisos':'Uma surpresa de quem',205,207);
    c.fillText(tipo==='cookie'?'que começam aqui.':'sempre ganha sorvete.',205,244);
    c.font='italic 23px Georgia';c.fillText('Com carinho, Ari e Renan',205,282);
  }
  const tex=new T.CanvasTexture(tela);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
  return new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});
}
function prensa(){
  const raiz=new T.Group(), maquina=new T.Group(), pacote=new T.Group(), alavanca=new T.Group();
  const estampa=papelDaBilheteria('embrulho'), dedicacao=papelDaBilheteria('cookie'), etiqueta=papelDaBilheteria('mano');
  raiz.add(maquina,pacote);
  bloco(maquina,0,.027,0,.61,.054,.35,mel);
  bloco(maquina,0,.16,0,.56,.25,.30,pinho,.035);
  bloco(maquina,0,.28,-.02,.53,.064,.26,mel);
  bloco(maquina,0,.17,.153,.37,.045,.012,0x352e2b,.005);
  for(const x of [-.235,.235]){
    bloco(maquina,x,.16,.156,.014,.18,.012,mel,.004);
    bloco(maquina,x,.345,-.049,.023,.13,.075,pinho);
  }
  const bobina=new T.Mesh(new T.CylinderGeometry(.081,.081,.422,24),toon(creme));
  bobina.rotation.z=Math.PI/2;bobina.position.set(0,.373,-.05);maquina.add(bobina);
  for(const x of [-.218,.218]){
    const aro=new T.Mesh(new T.CylinderGeometry(.088,.088,.012,24),toon(vinho));
    aro.rotation.z=Math.PI/2;aro.position.set(x,.373,-.05);maquina.add(aro);
  }
  alavanca.position.set(.285,.17,.01);maquina.add(alavanca);
  cordao(alavanca,[v(0,0,0),v(.042,0,.01),v(.048,.105,.036)],.014,mel);
  bloco(alavanca,.052,.12,.039,.066,.046,.048,vinho);
  const caixa:T.Mesh=bloco(pacote,0,.242,.012,.726,.484,.395,vinho,.018);
  caixa.material=estampa;
  bloco(pacote,0,.245,.014,.097,.493,.402,mel,.006);
  bloco(pacote,0,.244,.016,.733,.057,.402,mel,.006);
  for(const lado of [-1,1]){
    cordao(pacote,[v(0,.504,.02),v(lado*.094,.58,.004),v(lado*.173,.571,.014),v(lado*.143,.518,.036),v(0,.504,.02)],.021,mel);
    const cauda=bloco(pacote,lado*.077,.493,.098,.046,.009,.22,mel,.003);cauda.rotation.y=-lado*.58;
  }
  bloco(pacote,0,.507,.02,.059,.044,.055,0xf1c376);
  const bilhete=new T.Mesh(new T.PlaneGeometry(.438,.219),dedicacao);
  const tira=new T.Mesh(new T.PlaneGeometry(.295,.1475),etiqueta);
  tira.position.set(.35,.003,.09);tira.rotation.set(-Math.PI/2,0,-.24);
  raiz.add(bilhete,tira);
  return {raiz,maquina,pacote,alavanca,bilhete,tira,soltar(){
    for(const mat of [estampa,dedicacao,etiqueta]){mat.map?.dispose();mat.dispose();}
  }};
}

export function natalNaBilheteria(w:WorldBuilder, local:{x:number;z:number}, guiche:Interactable, ocupado:()=>boolean, cookie:Cookie, pausarCookie:(sim:boolean)=>void) {
  const g=w.game;
  if(!NATAL_NO_JOGO && !TESTE_DE_NATAL)return null;
  let pecas:ReturnType<typeof prensa>|undefined;
  let ativa=true, emCena=false;
  let mover:((dt:number)=>void)|undefined;
  const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const x=local.x-.035,z=local.z+1.174;
  function sincronizar(){
    if(!pecas)return;
    const aberta=g.flag(MAQUINA_ABERTA), entregue=g.flag(PRESENTE_COOKIE);
    pecas.pacote.visible=!aberta;pecas.maquina.visible=aberta;
    pecas.tira.visible=pecas.bilhete.visible=entregue;
    pecas.bilhete.position.set(.425,.48,-.097);pecas.bilhete.rotation.set(0,0,-.06);
    guiche.label=entregue?'Ver a dedicatória do Cookie':aberta?'Imprimir o presente do Cookie':'Desatar o laço do guichê';
    guiche.icon=entregue?'🎟️':'🎁';
  }
  function atualizar(){
    if(pecas || !g.flag(SOBREMESA))return;
    pecas=prensa();w.add(w.place(pecas.raiz,x,1.077,z));sincronizar();
  }
  atualizar();
  w.onUpdate(dt=>{atualizar();mover?.(dt);});
  w.aoDesmontar(()=>{ativa=false;mover=undefined;pecas?.soltar();});
  async function animar(dur:number,frame:(t:number)=>void){
    if(reduz){frame(1);return;}
    let tempo=0;mover=dt=>{tempo=Math.min(dur,tempo+dt);frame(tempo/dur);};
    await g.wait(dur);
    if(ativa){frame(1);mover=undefined;}
  }
  return async ()=>{
    atualizar();
    if(!pecas || ocupado())return false;
    if(emCena)return true;
    emCena=true;
    const {pacote,maquina,bilhete,alavanca,tira}=pecas;
    g.lockPlayer(true);g.setPlayerVisible(false);g.setCompanionVisible(false);
    const fov=T.MathUtils.radToDeg(2*Math.atan(Math.max(.42,.51*innerHeight/innerWidth)));
    g.setCameraOmbro(v(x+.10,1.74,z+1.47),v(x,1.39,z),fov);
    let mostrandoCookie=false;
    try{
      if(g.flag(PRESENTE_COOKIE)){
        await g.say(g.flag(PRESENTE_MANO) ? 'O Mano me mostrou a colher nova. Contou que agora consegue servir até quando a nadadeira tá gelada!' : 'Deixei o meu aqui na janela. Levem a etiqueta até a mesinha ao lado da sorveteria. Dá para montar lá a colher do Mano.', 'Cookie');
        return true;
      }
      if(!g.flag(MAQUINA_ABERTA)){
        await g.say('O Jean-Luc perguntou qual máquina fazia as etiquetas. Eu apontei. Quando voltei, só dava pra ver esse laço.', 'Cookie');
        if(!ativa)return true;
        await g.say('Tem um cartão. “Se a máquina imprime presentes, a máquina também merece um. Bisous, Jean-Luc.”', 'Renan');
        if(!ativa || await g.ask('O nó tem duas pontas. A dourada está soltinha.', ['🎀 Puxar a fita dourada','Deixar para depois'])!==0 || !ativa)return true;
        g.som('folhear');maquina.visible=true;
        await animar(.83,t=>{
          const k=T.MathUtils.smoothstep(t,0,1);
          pacote.position.set(-.35*k,.27*Math.sin(Math.PI*k),.17*k);
          pacote.rotation.z=.22*k;pacote.scale.set(1-.95*k,1-.97*k,1-.93*k);
        });
        if(!ativa)return true;
        g.setFlag(MAQUINA_ABERTA);sincronizar();
      }
      await g.say('A gente sempre sai daqui segurando alguma coisa que os outros deram. E se, neste Natal, fosse a nossa vez?', 'Ari');
      if(!ativa || await g.ask('O Cookie já entregou tantos bilhetes. Vamos fazer um só dele?', ['🎟️ Girar a manivela','Guardar para depois'])!==0 || !ativa)return true;
      bilhete.visible=true;g.som('clique');
      await animar(1.12,t=>{
        alavanca.rotation.x=t*Math.PI*4;
        bilhete.scale.y=.01+.99*t;
        bilhete.position.set(0,.17-.099*t,.166+.030*t);bilhete.rotation.set(-.22*t,0,0);
      });
      if(!ativa)return true;
      g.setCameraOmbro(v(x,1.33,z+.87),v(x,1.16,z+.19),fov);
      await g.say('“Para o Cookie, por todos os sorrisos que começam aqui.” Assinamos nós dois. Feliz Natal, Cookie!', 'Ari');
      if(!ativa)return true;
      await animar(.74,t=>{
        const k=T.MathUtils.smoothstep(t,0,1);
        bilhete.position.set(.425*k,.071+.409*k+.12*Math.sin(k*Math.PI),.196-.293*k);
        bilhete.rotation.set(-.22*(1-k),0,-.06*k);
      });
      if(!ativa)return true;
      tira.visible=true;g.som('sino');
      mostrandoCookie=true;pausarCookie(true);
      cookie.entrarEmServico();cookie.encarar(cookie.x+.06,cookie.z+2.2);cookie.receberCarinho();
      g.setCameraOmbro(v(cookie.x+.06,1.47,cookie.z+2.48),v(cookie.x,.94,cookie.z),fov);
      await g.say('Eu sempre rasgo o canhotinho antes de entregar. O meu eu vou guardar inteiro. Até a parte do picote.', 'Cookie');
      if(!ativa)return true;
      g.setCameraOmbro(v(x+.32,1.72,z+1.15),v(x+.20,1.39,z),fov);
      await g.say('Sobrou papel pra embrulhar os presentes de todo mundo! Essa primeira etiqueta é pro Mano. Vamos achar uma colher que caiba direitinho na nadadeira dele?', 'Renan');
      if(!ativa)return true;
      g.setFlag(PRESENTE_COOKIE);
      g.unlock({id:'natal-2026-presente-cookie',title:'Um bilhete para o bilheteiro',place:'Bilheteria do Villa Lobos',icon:'🎟️',
        note:'Ari e Renan deram ao Cookie um bilhete só dele. Ele pendurou a dedicatória na janela. A primeira etiqueta dos próximos presentes leva o nome do Mano.'});
      return true;
    }finally{
      emCena=false;mover=undefined;
      if(ativa){if(mostrandoCookie){cookie.pararDeEncarar();pausarCookie(false);}
        sincronizar();g.setCameraOmbro(null);g.setPlayerVisible(true);g.setCompanionVisible(true);g.lockPlayer(false);}
    }
  };
}
