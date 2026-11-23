import * as T from 'three';
import { toon } from '../../core/materials';
import { duck } from '../../world/props';
import '../../ui/mangueiraDaGina.css';

/** O treino da Gina, antes de abrir a guarita. */
export class MangueiraDaGina {
  private readonly jardim=new T.Group();
  private readonly camera=new T.PerspectiveCamera(58,1,.01,80);
  private readonly olho=new T.Vector3(1.9,1.05,3.05);
  private readonly olhar=new T.Vector3();
  private readonly bico=new T.Group();
  private readonly agua:T.Mesh[]=[];
  private readonly balde=new T.Group();
  private readonly alvo:T.Object3D;
  private readonly ui=document.createElement('section');
  private readonly dica=document.createElement('strong');
  private readonly teclas=new Set<string>();
  private readonly mira=new T.Vector2(0,0);
  private readonly raio=new T.Raycaster();
  private readonly acerto=new T.Vector3();
  private tempo=0;
  private carga=0;
  private final=0;
  private fechada=false;
  private andando=false;
  private rumo=new T.Vector2(0,1);
  private jorrando=false;
  private teclado=false;
  private iniciou=false;
  private resolver!: (molhou:boolean)=>void;
  readonly pronta=new Promise<boolean>(resolve=>{this.resolver=resolve;});

  constructor(raiz:T.Object3D,
    private focar:(de:T.Vector3,para:T.Vector3,lente:number)=>void) {
    raiz.add(this.jardim);
    const peca=(p:T.Object3D,g:T.BufferGeometry,c:number,x:number,y:number,z:number)=>{
      const m=new T.Mesh(g,toon(c));m.position.set(x,y,z);p.add(m);return m;
    };
    const latas=(p:T.Group,cor:number,r:number,h:number)=>{
      peca(p,new T.CylinderGeometry(r,r*.78,h,32,1,true),cor,0,h/2,0);
      const aro=peca(p,new T.TorusGeometry(r,.014,8,32),0xffd587,0,h,0);aro.rotation.x=Math.PI/2;
      peca(p,new T.CylinderGeometry(r*.83,r*.83,.016,28),0x78cddc,0,h*.38,0);
    };
    latas(this.balde,0x399990,.29,.35); this.balde.position.set(2.04,.04,5.9);this.jardim.add(this.balde);
    this.alvo=duck(0xffce52);this.alvo.rotation.y=2.3;
    for(const s of [-1,1])peca(this.alvo,new T.SphereGeometry(.018,10,8),0x322d32,s*.079,.427,.222);
    this.jardim.add(this.alvo);
    this.alvo.position.set(2,.04,5.35);
    this.jardim.add(this.bico);
    peca(this.bico,new T.CylinderGeometry(.045,.063,.24,18),0x44826a,0,0,0).rotation.x=Math.PI/2;
    for(const z of [-.065,.03,.1])peca(this.bico,new T.CylinderGeometry(.05,.05,.025,18),0xe6b45e,0,0,z).rotation.x=Math.PI/2;
    peca(this.bico,new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,0,-.1),new T.Vector3(.02,-.04,-.22),new T.Vector3(.14,-.25,-.28)]),14,.037,8,false),0x44826a,0,0,0);
    for(let i=0;i<22;i++){
      const gota=peca(this.jardim,new T.SphereGeometry(1,8,6),i%3?0x85d8ee:0xc6f6ff,0,0,0);
      gota.scale.set(.025,.023,.044);gota.visible=false;this.agua.push(gota);
    }
    this.ui.className='pt-jardim';
    this.ui.setAttribute('aria-label','Treino da mangueira');
    this.dica.textContent='Gina: empurre o patinho até o balde com a água!';
    const instru=document.createElement('small');instru.textContent='Segure na cena para mirar e jogar água.';
    const andar=document.createElement('button');andar.textContent='👣 Andar';
    const jato=document.createElement('button');jato.textContent='💧 Jato';
    const voltar=document.createElement('button');voltar.textContent='Pular treino';
    const topo=document.createElement('header'),rodape=document.createElement('footer');topo.append(this.dica,instru);rodape.append(andar,jato);
    this.ui.append(topo,voltar,rodape);document.body.append(this.ui);
    const segurar=(e:HTMLElement,acao:(on:boolean)=>void)=>{
      e.onpointerdown=ev=>{ev.stopPropagation();e.setPointerCapture(ev.pointerId);acao(true);};
      e.onlostpointercapture=()=>acao(false);
    };
    segurar(andar,on=>{this.andando=on;this.iniciou=true;});
    andar.onpointermove=e=>{
      if(!andar.hasPointerCapture(e.pointerId))return;
      const rect=andar.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2;
      if(Math.hypot(dx,dy)>16)this.rumo.set(-dx,-dy).normalize();else this.rumo.set(0,1);
    };
    const soltar=andar.onlostpointercapture;
    andar.onlostpointercapture=e=>{this.rumo.set(0,1);soltar?.call(andar,e);};
    segurar(jato,on=>{this.jorrando=on;this.teclado=true;this.iniciou=true;});
    voltar.onclick=()=>this.fechar(false);
    const mirar=(e:PointerEvent)=>this.mira.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);
    this.ui.onpointerdown=e=>{
      if((e.target as Element).closest('button'))return;
      this.ui.setPointerCapture(e.pointerId);this.jorrando=true;this.teclado=false;this.iniciou=true;mirar(e);
    };
    this.ui.onpointermove=e=>{if(this.ui.hasPointerCapture(e.pointerId))mirar(e);};
    this.ui.onlostpointercapture=e=>{if(e.target===this.ui)this.jorrando=false;};
    window.addEventListener('keydown',this.tecla,true);window.addEventListener('keyup',this.tecla,true);
    window.addEventListener('blur',this.parar);
    this.update(0);
  }
  private parar=()=>{this.teclas.clear();this.jorrando=false;this.andando=false;};
  private tecla=(e:KeyboardEvent)=>{
    if(!['Space','KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;
    if(e.code==='Space' && e.target instanceof HTMLButtonElement)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(e.type==='keydown'){this.teclas.add(e.code);this.iniciou=true;if(e.code==='Space')this.teclado=true;}
    else this.teclas.delete(e.code);
  };
  update(dt:number){
    if(this.fechada)return;
    if(this.iniciou)this.tempo+=dt;
    const tem=(...t:string[])=>t.some(k=>this.teclas.has(k));
    const avanco=(this.andando?this.rumo.y:0)+Number(tem('KeyW','ArrowUp'))-Number(tem('KeyS','ArrowDown'));
    this.olho.z=T.MathUtils.clamp(this.olho.z+avanco*dt*1.6,2.95,4.55);
    this.olho.x=T.MathUtils.clamp(this.olho.x+((this.andando?this.rumo.x:0)+Number(tem('KeyA','ArrowLeft'))-Number(tem('KeyD','ArrowRight')))*dt*1.5,1.3,2.9);
    const pos=this.alvo.position;
    pos.z=5.35+.55*this.carga;pos.y=.055+.48*Math.sin(this.carga*Math.PI*.74);
    this.olhar.set(2.06,.32,5.65);this.focar(this.olho,this.olhar,58);
    this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.camera.position.copy(this.olho);
    this.camera.lookAt(this.olhar);this.camera.updateMatrixWorld();
    this.bico.position.copy(this.olho).add(new T.Vector3(.09,-.135,-.57).applyQuaternion(this.camera.quaternion));
    const alvo=pos.clone();alvo.y+=.21;
    if(this.teclado)this.acerto.copy(alvo);
    else {
      this.raio.setFromCamera(this.mira,this.camera);
      this.raio.ray.at((alvo.z-this.olho.z)/Math.max(.1,this.raio.ray.direction.z),this.acerto);
    }
    this.bico.lookAt(this.acerto);
    const jato=this.jorrando||tem('Space'), perto=this.olho.distanceTo(alvo)<2.45;
    for(let i=0;i<this.agua.length;i++){
      const g=this.agua[i];g.visible=jato;
      const t=(i/this.agua.length+this.tempo*1.9)%1;
      g.position.copy(this.bico.position).lerp(this.acerto,t*(perto?1:.64));g.position.y+=.19*Math.sin(Math.PI*t);
    }
    if(jato&&!perto)this.dica.textContent='Chegue mais perto · segure 👣 Andar';
    else if(!this.final&&this.iniciou)this.dica.textContent='Mire no patinho até ele cair no balde.';
    if(jato&&perto&&this.acerto.distanceTo(alvo)<.48)this.carga=Math.min(1,this.carga+dt*.94);
    if(this.carga>=1){this.final+=dt;this.dica.textContent='Ploc! Gina: “Funcionou. Meu sapato também confirma.”';if(this.final>1.6)this.fechar(true);}
  }
  fechar(resultado=false){
    if(this.fechada)return;this.fechada=true;
    window.removeEventListener('keydown',this.tecla,true);window.removeEventListener('keyup',this.tecla,true);window.removeEventListener('blur',this.parar);
    this.ui.remove();this.jardim.removeFromParent();
    this.jardim.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});
    this.resolver(resultado);
  }
}
