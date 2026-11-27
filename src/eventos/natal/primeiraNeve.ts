import * as T from 'three';
import { toon } from '../../core/materials';
import { Pelusa } from '../../entities/bichos/Pelusa';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { FACHADA } from '../../world/frenteDaCasa';
import { fundir } from '../../world/fundir';
import { estrela } from '../../world/uniformeDosGatitos';
import { NATAL_NO_JOGO, TESTE_DE_NATAL, VESTIRAM, CONVITE } from '../Natal';
import { conviteDaGina } from './conviteDaGina';
import { nevar } from './neve';

const JANELA = 'natal:2026:abriu-a-cortina';
const MARFIM=0xffe8c4, PINHO=0x356651, CEREJA=0xac4150;
function esfera(pai:T.Group,cor:number,x:number,y:number,z:number,l:number,a:number,f:number){
  const m=new T.Mesh(new T.SphereGeometry(1,12,9),toon(cor));
  m.position.set(x,y,z);m.scale.set(l,a,f);pai.add(m);return m;
}
function vistaDaRua(){
  const c=document.createElement('canvas'); c.width=480;c.height=300;
  const p=c.getContext('2d')!;
  const ceu=p.createLinearGradient(0,0,0,300);
  ceu.addColorStop(0,'#839dba');ceu.addColorStop(.7,'#c8dbe3');ceu.addColorStop(1,'#eff4ee');
  p.fillStyle=ceu;p.fillRect(0,0,480,300);
  for(const [x,y,l] of [[-18,147,94],[87,135,100],[232,155,85],[361,138,100]]){
    p.fillStyle='#a4aba9';p.fillRect(x,y,l*.93,80);
    p.beginPath();p.moveTo(x-7,y);p.lineTo(x+l*.45,y-37);p.lineTo(x+l,y);p.closePath();
    p.fillStyle='#f4f2e7';p.fill();p.fillStyle='#ffe0a1';p.fillRect(x+l*.27,y+14,18,26);
  }
  p.fillStyle='#86a79a';
  for(let i=0;i<16;i++){
    const x=(i*117)%480, y=185+(i%4)*7;
    p.beginPath();p.moveTo(x-21,y);p.lineTo(x,y-68);p.lineTo(x+21,y);p.fill();
  }
  p.fillStyle='#e6efea';p.fillRect(0,200,480,100);p.fillStyle='#9aadab';
  p.fillRect(0,232,480,6);
  for(let i=0;i<12;i++)p.fillRect(i*45,223,9,60);
  const mapa=new T.CanvasTexture(c);mapa.colorSpace=T.SRGBColorSpace;return mapa;
}

export function neveNaJanela(w:WorldBuilder, x:number,z:number,acesa:()=>boolean){
  if(!w.game.flag(VESTIRAM))return;
  const g=w.game;
  // Festão voltado para dentro: a moldura da porta recebe o par de meias da dupla.
  const enfeites=new T.Group();
  for(let i=0;i<=22;i++){
    const t=i/22, xRamo=(t-.5)*2.25, yRamo=2.27-.12*Math.sin(t*Math.PI);
    const ramo=esfera(enfeites,i%2?PINHO:0x42795f,xRamo,yRamo,z-.18,.105,.067,.088);
    ramo.rotation.z=(i%2?1:-1)*.36;
    if(i%4===1)esfera(enfeites,i%8===1?0xecc678:CEREJA,xRamo,yRamo-.065,z-.24,.039,.043,.039);
  }
  for(const [i,cor] of [CEREJA,PINHO].entries()){
    const xMeia=.91+i*.31, yMeia=1.61-i*.08;
    esfera(enfeites,cor,xMeia,yMeia,z-.19,.086,.145,.044);
    esfera(enfeites,cor,xMeia-.05,yMeia-.105,z-.19,.106,.068,.044);
    esfera(enfeites,MARFIM,xMeia,yMeia+.109,z-.205,.094,.042,.048);
    const ponto=estrela(.032,0xffce82);ponto.rotation.y=Math.PI;ponto.position.set(xMeia,yMeia,z-.24);enfeites.add(ponto);
  }
  w.add(fundir(enfeites));
  const janela=new T.Group();janela.position.set(x,0,z);w.root.add(janela);
  const mapa=vistaDaRua(),mVista=new T.MeshBasicMaterial({map:mapa});
  const vista=new T.Mesh(new T.PlaneGeometry(1.48,1.02),mVista);
  vista.position.set(0,1.18,.07);vista.rotation.y=Math.PI;janela.add(vista);
  const ar=new T.Group();ar.position.set(0,.69,.025);janela.add(ar);nevar(w,ar,1.39,.94,.045,33);
  w.aoDesmontar(()=>{mapa.dispose();mVista.dispose();});

  const panos=[-1,1].map(lado=>{
    const pano=new T.Group();
    const tecido=new T.Mesh(new T.BoxGeometry(.74,.94,.042),toon(CEREJA));
    pano.add(tecido);
    for(let i=0;i<7;i++)esfera(pano,i%2?0xbd5762:0x963c4c,(i-3)*.103,0,-.023,.042,.46,.027);
    for(let i=0;i<3;i++){
      const flor=estrela(.035,MARFIM);flor.position.set((i-1)*.19,-.34,-.05);flor.rotation.y=Math.PI;pano.add(flor);
    }
    janela.add(fundir(pano));return {lado,pano};
  });
  const noPeitoril=!g.flag(CONVITE);
  const pelusa=new Pelusa({minX:x-.75,maxX:x+.75,minZ:z-.5,maxZ:z});
  pelusa.sentarEm(x+.43,z-.30,-1.34,.705);w.add(pelusa.group);
  const banquinho=new T.Group();
  const assento=new T.Mesh(new T.CylinderGeometry(.25,.22,.065,20),toon(0xb5835d));
  assento.position.y=.67;banquinho.add(assento);
  for(const l of [-1,1])for(const f of [-1,1]){
    const perna=new T.Mesh(new T.CylinderGeometry(.026,.037,.65,8),toon(0x916745));
    perna.position.set(l*.15,.33,f*.14);banquinho.add(perna);
  }
  w.add(w.place(fundir(banquinho),x+.47,0,z-.33));
  const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let abriu=g.flag(JANELA), abertura=abriu?1:0, chamada=abriu, espera=0, ativa=true;
  function puxar(){
    const k=T.MathUtils.smoothstep(abertura,0,1);
    for(const {lado,pano} of panos){
      pano.scale.x=1-.81*k;pano.position.set(lado*(.375+.32*k),1.16,-.245);
    }
  }
  puxar();
  const olhar=w.interact({id:'natal:cortina',x:x+.22,z:z-.82,radius:1.35,priority:2,
    label:abriu?(noPeitoril?'Ver a neve com o Pelusa':'Olhar a neve pela janela'):'Abrir a cortina com o Pelusa',icon:'❄️',
    onInteract:async()=>{
      if(!acesa())return;
      const primeira=!abriu;
      abriu=true;g.setFlag(JANELA);olhar.label=noPeitoril?'Ver a neve com o Pelusa':'Olhar a neve pela janela';
      g.lockPlayer(true);g.setPlayerVisible(false);g.setCompanionVisible(false);
      // Mantém o banco e as duas folhas da cortina dentro do quadro em tela estreita.
      const lente=T.MathUtils.radToDeg(2*Math.atan(Math.max(.40,.36*innerHeight/innerWidth)));
      g.setCameraOmbro(new T.Vector3(x+.06,1.31,z-2.6),new T.Vector3(x+.10,1.10,z),lente);
      try{
        if(primeira){g.som('folhear');await g.wait(reduz ? .12 : .95);}
        if(!ativa)return;
        if(!noPeitoril){await g.say('Ainda tá nevando. Até as casinhas da rua ganharam um gorro branco.', 'Ari');return;}
        pelusa.tocarNoVidro();g.som('miado');
        await g.say(primeira?'Ele tentou pegar o floco! Olha o focinho dele encostado no vidro.':'O Pelusa ainda está de olho naquele floco.', 'Ari');
        if(ativa&&primeira)await g.say('Olha lá fora… tem pegadas na neve até o correio do portão. Vamos ver?', 'Renan');
      }finally{if(ativa){g.setCameraOmbro(null);g.setPlayerVisible(true);g.setCompanionVisible(true);g.lockPlayer(false);}}
    }});
  olhar.enabled=acesa();janela.visible=olhar.enabled;pelusa.group.visible=olhar.enabled && noPeitoril;
  w.onUpdate(dt=>{
    const ligada=acesa();
    olhar.enabled=ligada;janela.visible=ar.visible=ligada;pelusa.group.visible=ligada && noPeitoril;
    if(!ligada)return;
    if(noPeitoril)pelusa.update(dt);
    if(!chamada && !g.emDialogo() && (espera+=dt)>1.5){
      chamada=true;g.som('miado');g.toast('O Pelusa está espiando a cortina da sala.','🐾');
    }
    if(abriu && abertura<1){abertura=Math.min(1,abertura+dt/(reduz ? .10 : .86));puxar();}
  });
  w.aoDesmontar(()=>{ativa=false;});
}

export function quintalNevado(g:GameAPI){
  return (NATAL_NO_JOGO || TESTE_DE_NATAL) && g.flag(JANELA);
}

export function neveNoQuintal(w:WorldBuilder, porta:{x:number;z:number}, xCorreio:number,zMuro:number,altoMuro:number){
  const g=w.game;
  if(!quintalNevado(g))return;
  const jardim=new T.Group();
  const ar=new T.Group();ar.position.set(porta.x,0,zMuro-3);w.root.add(ar);nevar(w,ar,20,8,18,310);
  // Duas placas irregulares seguem a inclinação real das águas; as telhas ainda aparecem nos recortes.
  const neve=toon(0xe6efed,{doubleSide:true}), meiaAgua=FACHADA.fundo/2+.5;
  for(const lado of [-1,1]){
    const vertices:number[]=[],faces:number[]=[];
    for(let i=0;i<=36;i++){
      const t=i/36, x=porta.x+(t-.5)*(FACHADA.largura+.68);
      const borda=.77+.13*Math.sin(i*.61+lado)+.07*Math.cos(i*1.26);
      for(const fracao of [.015,borda]){
        const distancia=meiaAgua*fracao;
        vertices.push(x,FACHADA.alto+.057+.44*(meiaAgua-distancia),porta.z-FACHADA.fundo/2+lado*distancia);
      }
      if(i){const a=i*2;faces.push(a-2,a-1,a,a,a-1,a+1);}
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(faces);geo.computeVertexNormals();
    jardim.add(new T.Mesh(geo,neve));
  }
  // A neve recém-caída se junta na beira do caminho e sobre a hera, sem bloquear os enfeites do jogador.
  for(let i=0;i<24;i++){
    const lado=i%2?1:-1, t=Math.floor(i/2)/11;
    esfera(jardim,0xe0eae7,porta.x+lado*(1.15+.22*Math.sin(i*3)),.025,porta.z+.8+t*(zMuro-porta.z-1.2),
      .37+.13*Math.cos(i),.06+.018*Math.sin(i),.64);
  }
  for(const lado of [-1,1])for(let i=0;i<5;i++){
    esfera(jardim,0xeaf1ee,porta.x+lado*(1.3+i*.68),altoMuro+.025,zMuro,.46,.085,.12);
  }
  // O par de sola e salto deixa legível o sentido até a caixa de cartas.
  for(let i=0;i<15;i++){
    const t=i/14, z=porta.z+1.35+t*(zMuro-porta.z-1.85);
    const x=porta.x+.38+Math.sin(t*Math.PI*2)*.23+t*(xCorreio-porta.x-.38);
    esfera(jardim,0xe9f0ee,x,.05,z,.32,.055,.38);
    const bota=new T.Group();bota.position.set(x+(i%2?.09:-.09),.104,z);
    bota.rotation.y=.15*Math.cos(i)+.12;
    esfera(bota,0xa4b8b7,0,0,.047,.058,.008,.077);
    esfera(bota,0xa4b8b7,0,0,-.057,.045,.008,.033);jardim.add(bota);
  }
  // A aba e o lacre voltados para o jardim, na face interna do pilar do correio.
  const envelope=new T.Group(),papel=new T.Mesh(new T.BoxGeometry(.42,.29,.038),toon(MARFIM));
  envelope.add(papel);
  const aba=new T.Shape();aba.moveTo(-.2,.132);aba.lineTo(.2,.132);aba.lineTo(0,-.025);aba.closePath();
  const dobra=new T.Mesh(new T.ShapeGeometry(aba),toon(0xedcb93,{doubleSide:true}));dobra.position.z=-.021;envelope.add(dobra);
  esfera(envelope,CEREJA,0,-.026,-.036,.039,.037,.012);
  envelope.position.set(xCorreio,1.26,zMuro-.20);envelope.rotation.z=-.10;jardim.add(envelope);
  const guirlanda=new T.Mesh(new T.TorusGeometry(.20,.056,9,28),toon(PINHO));
  guirlanda.position.set(porta.x,1.68,porta.z+.15);jardim.add(guirlanda);
  for(const lado of [-1,1])esfera(jardim,CEREJA,porta.x+.05*lado,1.48,porta.z+.17,.062,.042,.042);
  w.add(fundir(jardim));
  const correio=w.interact({id:'natal:correio',x:xCorreio,z:zMuro-.73,radius:1.25,priority:1,icon:'✉️',
    label:g.flag(CONVITE)?'Reler o convite da Gina':'Pegar o convite da Gina',onInteract:async()=>{
      if(!g.flag(CONVITE)){
        g.som('folhear');g.setFlag(CONVITE);
        g.unlock({id:'natal-2026-convite',title:'Dois lugares na ceia',place:'Quintal do Ari',icon:'💌',note:conviteDaGina.legenda});
        correio.label='Reler o convite da Gina';
      }
      await g.lerCarta(conviteDaGina);
    }});
}
