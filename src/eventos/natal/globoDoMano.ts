import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { estrela } from '../../world/uniformeDosGatitos';
import type { Mano } from '../../entities/bichos/Mano';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { FLOCO_NA_TOALHA, NATAL_NO_JOGO, TESTE_DE_NATAL, TOALHA } from '../Natal';

const SOBREMESA = 'natal:2026:globo-do-mano';
const MARACUJA = 'natal:2026:calda-de-maracuja';
const creme = 0xffeed6, ouro = 0xe7b665, verde = 0x21605a, cereja = 0xa7314b;
const chocolate = 0x463038, casquinha = 0xcb915b;
const v = (x:number, y:number, z:number) => new T.Vector3(x,y,z);

function por(grupo:T.Group, geo:T.BufferGeometry, cor:number, x:number,y:number,z:number) {
  const m=new T.Mesh(geo,toon(cor));
  m.position.set(x,y,z); grupo.add(m); return m;
}
function bola(g:T.Group, cor:number, x:number,y:number,z:number, a:number,b:number,c:number) {
  const m=por(g,new T.SphereGeometry(1,18,14),cor,x,y,z);
  m.scale.set(a,b,c); return m;
}
function aro(g:T.Group, cor:number, x:number,y:number,z:number, raio:number, esp:number) {
  const m=por(g,new T.TorusGeometry(raio,esp,8,48),cor,x,y,z);
  m.rotation.x=Math.PI/2; return m;
}
function fio(g:T.Group, cor:number, a:T.Vector3[], esp:number) {
  return por(g,new T.TubeGeometry(new T.CatmullRomCurve3(a),Math.max(8,a.length*2),esp,6,false),cor,0,0,0);
}

// Duas miniaturas de chocolate. O gorro do Ari e as hastes de biscoito do Renan
// repetem os presentes que trouxeram os dois até aqui.
function pinguinzinho(rena:boolean) {
  const g=new T.Group(), cor=rena?verde:cereja;
  bola(g,chocolate,0,.117,0,.090,.121,.081);
  bola(g,creme,0,.107,.052,.068,.086,.035);
  bola(g,chocolate,0,.245,0,.092,.087,.081);
  for(const lado of [-1,1]) {
    bola(g,creme,lado*.032,.241,.062,.043,.050,.020);
    bola(g,0x30232b,lado*.031,.254,.079,.010,.013,.006);
    bola(g,0xf6b763,lado*.048,.018,.028,.041,.019,.053);
    const asa=bola(g,chocolate,lado*.086,.138,-.001,.027,.077,.041);
    asa.rotation.z=lado*.36;
    if(rena){
      fio(g,casquinha,[v(lado*.053,.302,0),v(lado*.068,.348,0),v(lado*.063,.385,0)],.009);
      fio(g,casquinha,[v(lado*.066,.345,0),v(lado*.095,.367,0)],.008);
    }
  }
  bola(g,0xf2ae51,0,.229,.087,.022,.012,.017);
  aro(g,cor,0,.182,0,.074,.013);
  const ponta=bola(g,cor,.045,.142,.067,.018,.045,.010); ponta.rotation.z=.28;
  if(!rena){
    const gorro=por(g,new T.ConeGeometry(.082,.107,24),cereja,0,.351,0); gorro.rotation.z=-.23;
    aro(g,creme,0,.303,0,.072,.012);
    bola(g,creme,.014,.404,0,.021,.021,.021);
  }
  return g;
}

function carrinho(floco:boolean) {
  const base=new T.Group();
  for(const x of [-.53,.53])for(const z of [-.27,.27]){
    const roda=por(base,new T.CylinderGeometry(.126,.126,.044,20),verde,x,.13,z); roda.rotation.z=Math.PI/2;
    bola(base,ouro,x+Math.sign(x)*.025,.13,z,.015,.057,.057);
  }
  por(base,new RoundedBoxGeometry(1.26,.49,.74,3,.055),verde,0,.46,0);
  por(base,new RoundedBoxGeometry(1.33,.062,.81,3,.026),ouro,0,.713,0);
  por(base,new RoundedBoxGeometry(1.30,.038,.78,3,.022),creme,0,.75,0);
  for(const x of [-.48,-.24,0,.24,.48]){
    const e=estrela(.042,ouro); e.position.set(x,.50,.374); base.add(e);
  }
  const prato=por(base,new T.CylinderGeometry(.422,.34,.056,48),cereja,0,.796,0);
  prato.receiveShadow=true; aro(base,ouro,0,.82,0,.409,.012);
  bola(base,creme,0,.839,0,.369,.083,.351);
  const torre=new T.Group();
  por(torre,new T.ConeGeometry(.109,.242,5),verde,0,.142,0);
  por(torre,new T.ConeGeometry(.089,.175,5),0x6f9a77,0,.219,0);
  por(torre,new T.ConeGeometry(.061,.139,5),creme,0,.267,0);
  if(floco){
    for(let k=0;k<3;k++){
      const braco=por(torre,new T.CapsuleGeometry(.009,.077,3,6),0x82d7d4,0,.362,0);
      braco.rotation.z=k*Math.PI/3;
    }
  } else {
    const e=estrela(.05,ouro); e.position.y=.365; torre.add(e);
  }
  torre.position.set(0,.90,-.186); base.add(torre);
  for(const rena of [false,true]){
    const p=pinguinzinho(rena); p.position.set(rena ? .131 : -.134,.906,rena ? .03 : .08);
    p.rotation.y=rena?-.24:.22; base.add(p);
  }
  const caminho:T.Vector3[]=[];
  for(let k=0;k<64;k++){
    const ang=k*Math.PI/32, r=.314+.018*Math.cos(ang*5);
    caminho.push(v(r*Math.cos(ang),.006*Math.sin(ang*5),r*Math.sin(ang)));
  }
  const curva=new T.CatmullRomCurve3(caminho,true);
  const calda=por(base,new T.TubeGeometry(curva,96,.021,8,true),cereja,0,.879,0);
  calda.scale.y=.60; calda.visible=false;
  calda.removeFromParent(); // móvel: mantém a geometria própria para revelar a calda ponto a ponto

  const tampa=new T.Group(), concha=new T.Group();
  const vidro=new T.MeshPhongMaterial({color:0xccebed,transparent:true,opacity:.19,shininess:90,depthWrite:false});
  const c= new T.Mesh(new T.SphereGeometry(.437,40,24,0,Math.PI*2,0,Math.PI/2),vidro);
  c.userData.semSombra=true; c.scale.y=1.44; concha.add(c);
  aro(concha,ouro,0,0,0,.439,.011);
  bola(concha,ouro,0,.653,0,.045,.030,.045);
  const argola=por(concha,new T.TorusGeometry(.037,.008,8,22),ouro,0,.705,0);
  argola.rotation.y=.18;
  concha.position.z=.437; tampa.position.set(0,.825,-.437); tampa.add(concha);
  fundir(base); base.add(calda,tampa);
  const colher=new T.Group();
  bola(colher,ouro,0,0,0,.061,.018,.081);
  fio(colher,ouro,[v(0,0,-.052),v(.015,.026,-.15),v(.07,.068,-.30)],.012);
  const porcao=bola(colher,0xffffff,0,.016,0,.052,.018,.066);
  colher.visible=false; base.add(colher);
  return {base,tampa,calda,colher,porcao,vidro};
}

export function montarGloboDoMano(w:WorldBuilder, posto:{x:number;z:number}, mano:Mano, ocupado:()=>boolean) {
  const g=w.game;
  if(!(NATAL_NO_JOGO || TESTE_DE_NATAL) || !g.flag(TOALHA)) return;
  const floco=g.flag(FLOCO_NA_TOALHA);
  const {base,tampa,calda,colher,porcao,vidro}=carrinho(floco);
  const x=posto.x-.83, z=posto.z+1.96;
  w.add(w.place(base,x,0,z)); w.blockBox(x,z,.65,.39);
  let pronta=g.flag(SOBREMESA), ativa=true, animar:((dt:number)=>void)|null=null;
  const breve=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sabor(maracuja:boolean) {
    const tinta=toon(maracuja?0xeea72c:0xb93853);
    calda.material=tinta; porcao.material=tinta;
  }
  sabor(g.flag(MARACUJA)); calda.visible=pronta;
  w.aoDesmontar(()=>{ativa=false; vidro.dispose();});
  async function animacao(dur:number, desenhar:(t:number)=>void) {
    if(breve){desenhar(1);return;}
    let tempo=0;
    animar=dt=>{tempo=Math.min(dur,tempo+dt); desenhar(tempo/dur);};
    await g.wait(dur);
    if(ativa){desenhar(1); animar=null;}
  }
  const abrir='Abrir a surpresa do Mano', rever='Rever a sobremesa da ceia';
  const it=w.interact({id:'natal:sobremesa',x,z:z+.78,radius:1.17,priority:2,label:pronta?rever:abrir,icon:'🍨',
    onInteract:async()=>{
      if(ocupado())return;
      g.lockPlayer(true); g.setPlayerVisible(false); g.setCompanionVisible(false);
      const lente=T.MathUtils.radToDeg(2*Math.atan(Math.max(.39,.48*innerHeight/innerWidth)));
      function enquadrar(perto:boolean){
        const centro=perto?x:x+.78;
        g.setCameraOmbro(v(centro+.02,perto?1.78:1.64,z+(perto?1.45:2.63)),v(centro,perto ? .99 : 1.11,z-.03),lente);
      }
      try {
        enquadrar(false); mano.encarar(x+.72,z+2.4);
        if(!pronta){
          await g.say('ABAIXEM A VOZ! A sobremesa tá dormindo. Mentira. Eu só queria fazer uma entrada.', 'Mano');
          if(!ativa)return;
        }
        enquadrar(true); g.som('clique');
        await animacao(.8,t=>{tampa.rotation.x=-1.67*T.MathUtils.smoothstep(t,0,1);});
        if(!ativa)return;
        if(pronta){
          await g.say('Dois pinguins, uma árvore e calda de '+(g.flag(MARACUJA)?'maracujá':'morango')+'. Eu conto os dois pinguins toda vez que o Jean-Luc passa aqui.', 'Mano');
          return;
        }
        await g.say(floco?'Você fez até o floco da nossa toalha! E aquele pinguinzinho de gorro… sou eu?':'Olha a estrela da nossa toalha lá no pinheiro! E aquele pinguinzinho de gorro… sou eu?', 'Ari');
        if(!ativa)return;
        await g.say('E eu de rena! Ele fez as hastes de casquinha.', 'Renan');
        if(!ativa)return;
        const escolha=await g.ask('Qual calda vai contornar a neve de baunilha?', ['🍓 Morango do Ari','💛 Maracujá do Renan','Decidir depois']);
        if(!ativa || (escolha!==0 && escolha!==1))return;
        const maracuja=escolha===1; sabor(maracuja);
        // O traço cresce ao redor do prato e acompanha a colher.
        const geo=calda.geometry, total=geo.index!.count;
        calda.visible=true; colher.visible=!breve;
        g.som('sorvete');
        await animacao(1.55,t=>{
          const a=t*Math.PI*2;
          colher.position.set(.314*Math.cos(a),.912+.01*Math.sin(a*5),.314*Math.sin(a));
          colher.rotation.set(-.3,-a,-.30);
          geo.setDrawRange(0,Math.floor(total*t/3)*3);
        });
        if(!ativa)return;
        colher.visible=false;
        await g.say(maracuja?'Ficou parecendo o sol dando uma volta no Polo Sul. Renan, você pode voltar pra cozinha amanhã.':'Uma pista de morango pros pinguins! Ari, se um deles escorregar, a culpa é minha. Eu encerei.', 'Mano');
        if(!ativa)return;
        await animacao(.65,t=>{tampa.rotation.x=-1.67*(1-T.MathUtils.smoothstep(t,0,1));});
        if(!ativa)return;
        enquadrar(false); mano.dancar(breve ? .32 : 1.65); g.som('pinguim');
        await g.say('Globo de neve pronto! Eu levo pra ceia, de nadadeira em nadadeira. E vão ver o Cookie na bilheteria. Pedi papel de presente e o Jean-Luc mandou embrulhar a máquina de bilhete.', 'Mano');
        if(!ativa)return;
        g.setFlag(MARACUJA,maracuja); g.setFlag(SOBREMESA);
        g.unlock({id:'natal-2026-globo',title:'Neve de colher',place:'Sorveteria do Mano',icon:'🍨',
          note:'O Mano fez Ari e Renan de pinguins de chocolate. A árvore levou '+(floco?'o floco':'a estrela')+' da toalha da Estella e a dupla terminou o globo com calda de '+(maracuja?'maracujá.':'morango.')});
        pronta=true; it.label=rever;
      } finally {
        animar=null;
        if(ativa){
          tampa.rotation.x=0; calda.visible=pronta; colher.visible=false;
          g.setCameraOmbro(null); g.setPlayerVisible(true); g.setCompanionVisible(true); g.lockPlayer(false);
        }
      }
    }});
  w.onUpdate(dt=>{it.enabled=!ocupado(); animar?.(dt);});
}
