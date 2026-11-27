import * as T from 'three';
import { toon } from '../../core/materials';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { FLOCO_NA_TOALHA, TOALHA } from '../Natal';

const MEL = '#b78038', PINHO = '#27634f', CEREJA = '#a63349';
type Ponto = [number, number];

function bordado() {
  const tela = document.createElement('canvas');
  tela.width = 1024;
  tela.height = 576;
  const c = tela.getContext('2d')!;
  c.fillStyle = '#fff0d6';
  c.fillRect(0, 0, 1024, 576);
  // Trama de linho e bainha dupla em ponto corrido.
  for (let i = 0; i < 1024; i += 5) {
    c.fillStyle = '#aa724815'; c.fillRect(i, 0, 1, 576);
    c.fillStyle = '#fffaf1'; c.fillRect(0, i, 1024, 1);
  }
  c.lineJoin = c.lineCap = 'round';
  function linha(pontos: Ponto[], cor: string, largura: number) {
    c.strokeStyle = cor; c.lineWidth = largura; c.beginPath();
    pontos.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.stroke();
  }
  function disco(x: number, y: number, r: number, cor: string) {
    c.fillStyle = cor; c.beginPath(); c.arc(x,y,r,0,2*Math.PI); c.fill();
  }
  c.strokeStyle = PINHO; c.lineWidth = 9; c.strokeRect(18,18,988,540);
  c.setLineDash([8,6]); c.lineWidth = 3; c.strokeStyle = MEL; c.strokeRect(31,31,962,514); c.setLineDash([]);
  // Festões de ramos e frutinhas ao longo das duas ourelas.
  for (const y of [58,515]) {
    const ramo: Ponto[] = [];
    for (let i = 0; i <= 48; i++) {
      const x = 58+i*19, v = y+8*Math.sin(i*Math.PI/6);
      ramo.push([x,v]);
      c.save(); c.translate(x,v); c.rotate(i%2 ? -.55 : .55);
      c.fillStyle = i%2 ? '#448163' : PINHO; c.beginPath(); c.ellipse(0,-5,4,10,0,0,7); c.fill(); c.restore();
      if (i%4===0) { disco(x,v,5,CEREJA); disco(x+6,v+2,3.5,'#c7555b'); }
    }
    linha(ramo,PINHO,2);
  }
  // A roda do Villa Lobos, com oito cabines e a sorveteria do Mano ao pé.
  const cx = 478, cy = 234, raio = 122;
  c.strokeStyle = CEREJA; c.lineWidth = 8; c.beginPath(); c.arc(cx,cy,raio,0,2*Math.PI); c.stroke();
  for (let i=0;i<8;i++) {
    const a=i*Math.PI/4, x=cx+Math.cos(a)*raio, y=cy+Math.sin(a)*raio;
    linha([[cx,cy],[x,y]],MEL,3);
    linha([[x-9,y+12],[x,y],[x+9,y+12]],PINHO,3);
    c.fillStyle=i%2 ? CEREJA : PINHO; c.fillRect(x-12,y+12,24,13);
  }
  linha([[cx-56,415],[cx,cy],[cx+56,415]],PINHO,9); disco(cx,cy,10,MEL);
  for (const [x,y,esc] of [[192,365,1],[283,393,.65],[660,387,.72]]) {
    c.save(); c.translate(x,y); c.scale(esc,esc);
    linha([[0,0],[0,-112]],MEL,7);
    for(let j=0;j<4;j++) linha([[-32+j*6,-22-j*23],[0,-58-j*23],[32-j*6,-22-j*23]],PINHO,8);
    c.restore();
  }
  c.fillStyle='#825716'; c.fillRect(698,329,78,59); c.fillStyle=CEREJA; c.fillRect(690,318,94,14);
  for(let i=0;i<5;i++){c.fillStyle=i%2?'#fff2d0':CEREJA;c.fillRect(693+i*18,306,18,19);}
  linha([[730,386],[730,350],[751,350],[751,386]],PINHO,4);
  c.fillStyle = PINHO; c.textAlign='center'; c.font='italic 32px Georgia, serif'; c.fillText('Villa Lobos',478,469);
  const textura = new T.CanvasTexture(tela);
  textura.colorSpace = T.SRGBColorSpace; textura.anisotropy = 4;
  // Cada tracinho sai do bastidor na ordem em que a agulha passaria.
  function pontosDoMotivo(floco: boolean): Ponto[][] {
    const pontos: Ponto[][] = [];
    const polar=(a:number,r:number):Ponto => [828+Math.sin(a)*r,212-Math.cos(a)*r];
    if(floco){
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3;
        pontos.push([polar(a,0),polar(a,58)]);
        for(const lado of [-1,1]) pontos.push([polar(a,31),polar(a+lado*.32,47)]);
      }
    } else {
      for(let i=0;i<10;i++) {
        const a=i*Math.PI/5;
        pontos.push([polar(a,i%2?26:61),polar(a+Math.PI/5,i%2?61:26)]);
      }
      for(let i=0;i<5;i++) pontos.push([polar(0,0),polar(i*2*Math.PI/5,51)]);
    }
    return pontos;
  }
  function bordar(segmento:Ponto[],floco:boolean){
    linha(segmento,floco?'#367775':MEL,8);
    c.setLineDash([4,5]); linha(segmento,floco?'#a1d3c8':'#f4ca74',2.5); c.setLineDash([]);
    textura.needsUpdate=true;
  }
  return { textura, pontosDoMotivo, bordar };
}

export function prepararToalhaDaCeia(w:WorldBuilder, piso:T.Group, caixa:{x:number;z:number}, entregar:()=>void) {
  const g=w.game, desenho=bordado();
  const geometria=new T.PlaneGeometry(1,1,18,64);
  const pos=geometria.getAttribute('position');
  const material=new T.MeshStandardMaterial({map:desenho.textura,roughness:.96,side:T.DoubleSide});
  const pano=new T.Mesh(geometria,material);
  pano.position.set(caixa.x,1.018,caixa.z);
  piso.add(pano);
  const agulha = new T.Group();
  const haste = new T.Mesh(new T.ConeGeometry(.006,.14,8),toon(0xa8b6b7));
  haste.rotation.z=Math.PI; haste.position.y=.07; agulha.add(haste);
  const olhoDaAgulha=new T.Mesh(new T.TorusGeometry(.008,.0025,6,12),toon(0x89989c));
  olhoDaAgulha.scale.y=1.55; olhoDaAgulha.position.y=.145; agulha.add(olhoDaAgulha);
  const curvaDoFio=new T.QuadraticBezierCurve3(new T.Vector3(0,.15,0),new T.Vector3(.08,.2,.015),new T.Vector3(.13,.025,.015));
  const fio=new T.Mesh(new T.TubeGeometry(curvaDoFio,14,.003,5,false),toon(0xba914e));
  agulha.add(fio); agulha.rotation.z=-.38; agulha.visible=false; pano.add(agulha);

  for(const [z,cor] of [[-.18,0x367775],[.055,0xbb8b47]]){
    const carretel=new T.Group();
    for (const y of [.012,.128]){
      const aba=new T.Mesh(new T.CylinderGeometry(.072,.07,.02,20),toon(0xc89763));
      aba.position.y=y; carretel.add(aba);
    }
    const linha=new T.Mesh(new T.CylinderGeometry(.06,.06,.10,24),toon(cor));
    linha.position.y=.07; carretel.add(linha);
    for(let i=0;i<5;i++){
      const volta=new T.Mesh(new T.TorusGeometry(.060,.003,5,20),toon(cor));
      volta.rotation.x=Math.PI/2+.06; volta.position.y=.03+i*.018; carretel.add(volta);
    }
    carretel.position.set(-1.06,0,z); pano.add(carretel);
  }
  const fitaMat=new T.MeshStandardMaterial({color:0x913347,roughness:.7});
  const fita=new T.Group();
  const cinta=new T.Mesh(new T.CylinderGeometry(.114,.114,.095,32,1,true),fitaMat);
  cinta.rotation.z=Math.PI/2; fita.add(cinta);
  for(const lado of [-1,1]){
    const alca=new T.Mesh(new T.TorusGeometry(.053,.010,8,20),fitaMat);
    alca.scale.set(1.15,.65,1); alca.rotation.z=lado*.45; alca.position.set(lado*.051,.135,.005); fita.add(alca);
  }
  pano.add(fita); fita.visible=false;
  function enrolar(progresso:number){
    const corte=1-progresso, raio=.106, comprimento=1.07;
    for(let j=0;j<=64;j++){
      const t=j/64, livre=Math.min(t,corte), d=livre*comprimento;
      let z=-.34+Math.min(d,.68), y=.006;
      if(d>.68){
        const curva=Math.min((d-.68)/.075,Math.PI/2);
        z+=.075*Math.sin(curva);
        y-=.075*(1-Math.cos(curva))+Math.max(0,d-.68-.075*Math.PI/2);
      }
      if(t>corte){
        const ang=(t-corte)*comprimento/raio;
        const camada=raio-.020*(t-corte);
        y+=raio-camada*Math.cos(ang); z+=camada*Math.sin(ang);
      }
      for(let i=0;i<=18;i++){
        const dobra=.006*Math.cos(i*Math.PI/3)*(.4+.6*t);
        pos.setXYZ(j*19+i,(i/18-.5)*1.85,y+dobra,z+.18*progresso);
      }
    }
    pos.needsUpdate=true; geometria.computeVertexNormals(); geometria.computeBoundingSphere();
    fita.position.set(0,.115,-.16);
  }
  enrolar(0);
  let ativa=true;
  w.aoDesmontar(()=>{ativa=false; desenho.textura.dispose(); material.dispose(); fitaMat.dispose();});
  let animacao: ((dt:number)=>void) | null=null;
  w.onUpdate(dt=>animacao?.(dt));
  return async () => {
    const olho=new T.Vector3(caixa.x+.05,2.28,caixa.z+1.42);
    const alvo=new T.Vector3(caixa.x,.96,caixa.z);
    const lente=T.MathUtils.radToDeg(2*Math.atan(Math.max(.44,.59*innerHeight/innerWidth)));
    g.lockPlayer(true); g.setPlayerVisible(false); g.setCompanionVisible(false);
    g.setCameraOmbro(olho,alvo,lente);
    try {
      await g.say('Cariños, eu bordei até as cabininhas da roda! Deixei esse cantinho pra vocês assinarem com um desenho.', 'Estella');
      if(!ativa)return;
      const escolha=await g.ask('O que vamos bordar juntos?', ['❄️ Um floco da primeira neve','⭐ A estrela da nossa árvore','Voltar depois']);
      if(!ativa || (escolha!==0 && escolha!==1))return;
      const floco=escolha===0, pontos=desenho.pontosDoMotivo(floco);
      const breve=matchMedia('(prefers-reduced-motion: reduce)').matches;
      fio.material=toon(floco?0x478e89:0xba914e);
      agulha.visible=!breve;
      let t=0, feito=0;
      const costura=(dt:number)=>{
        t=Math.min(1,t+dt/(breve ? .15 : 1.55));
        const fim=Math.floor(t*pontos.length);
        while(feito<fim)desenho.bordar(pontos[feito++],floco);
        const [de,para]=pontos[Math.min(feito,pontos.length-1)];
        const passo=t*pontos.length-fim;
        const x=T.MathUtils.lerp(de[0],para[0],passo)/1024;
        const v=T.MathUtils.lerp(de[1],para[1],passo)/576;
        agulha.position.set((x-.5)*1.85,.012+.035*Math.sin(Math.PI*passo),-.34+v*1.07);
      };
      animacao=costura; g.som('folhear'); await g.wait(breve ? .22 : 1.65);
      if(!ativa)return;
      costura(2); animacao=null; agulha.visible=false;
      await g.say(floco?'É o floco que o Pelusa tentou pegar! Esse ele não vai ver derreter.':'É a estrelinha da sala! Agora a gente tem uma acesa em cada ponta da festa.', 'Ari');
      if(!ativa)return;
      await g.say('Agora enrolem, meus amores. A Gina dobrou a do ano passado e o vinco passou bem no meio do meu bordado. O pinguim ficou de joelhos até a Páscoa!', 'Estella');
      if(!ativa)return;
      t=0; g.som('folhear');
      animacao=dt=>{t=Math.min(1,t+dt/(breve ? .16 : 1.05)); enrolar(T.MathUtils.smoothstep(t,0,1));};
      await g.wait(breve ? .22 : 1.15);
      if(!ativa)return;
      animacao=null; enrolar(1); fita.visible=true;
      await g.say('Prontinho, laço dado. E o Mano pediu que vocês passem na sorveteria. Parece que ele guardou uma coisa no gelo.', 'Estella');
      if(!ativa)return;
      g.setFlag(FLOCO_NA_TOALHA,floco); g.setFlag(TOALHA);
      g.unlock({id:'natal-2026-toalha',title:'O último ponto da toalha',place:'Boutique da Estella',icon:'🧵',
        note:'Estella bordou o Villa Lobos na toalha da ceia. No último cantinho, Ari e Renan costuraram '+(floco?'o floco que o Pelusa viu pela janela.':'a estrela que acenderam na sala.')+' Guardaram a toalha enrolada, do jeitinho que ela ensinou.'});
      pano.visible=false; entregar(); g.toast('Toalha da ceia guardada', '🎀');
    } finally {
      animacao=null;
      if(ativa){g.setCameraOmbro(null);g.setPlayerVisible(true);g.setCompanionVisible(true);g.lockPlayer(false);}
    }
  };
}
