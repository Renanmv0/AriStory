import * as T from 'three';
import { toon } from '../../core/materials';
import { vasoDePlanta, letreiro, copoDeSuco, biscoitoDaEstella, mesaDePatio } from '../../world/props';
import { macia } from '../../world/moveisDaBoutique';
import { MESA_DA_PORTARIA } from '../../world/mesaDaPortaria';

/** A mesma bandeja recebe o menu por engano, a flor de exemplo e o último biscoito. */
export class AderecosDaCantina {
  private readonly grupo=new T.Group();
  private readonly suporte=new T.Group();
  private readonly origem=new T.Vector3();
  private readonly destino=new T.Vector3(.025,MESA_DA_PORTARIA.topo+.025,1.23);
  private voo=0;
  private pronto:(()=>void)|null=null;
  private readonly vasos:T.Group[]=[];
  private readonly mesaDaFesta:T.Group;
  constructor(raiz:T.Object3D,private dia:number,fatos:ReadonlySet<string>) {
    raiz.add(this.grupo);this.grupo.add(this.suporte);this.suporte.visible=false;
    for(let i=0;i<3;i++){
      const vaso=vasoDePlanta(i===1?'girassol':'lavanda',.27+i*.028,i*.15);
      vaso.position.set(-1.15-i*.62,.03,4.3+i*.1);this.grupo.add(vaso);this.vasos.push(vaso);
    }
    this.florir(fatos.has('flores-entregues'));
    this.mesaDaFesta=mesaDePatio();this.mesaDaFesta.position.set(.85,.035,6.0);this.grupo.add(this.mesaDaFesta);
    this.mesaDaFesta.visible=dia===10 || fatos.has('sucos-entregues');
    const altura=new T.Box3().setFromObject(this.mesaDaFesta).max.y;
    for(let i=0;i<3;i++){
      const copo=copoDeSuco([0xf8b046,0xe48485,0xd0cb6c][i]);copo.position.set((i-1)*.17,altura-.035,0);
      this.mesaDaFesta.add(copo);
    }
    if(dia===12){
      const poste=(x:number)=>{const m=new T.Mesh(new T.CylinderGeometry(.035,.045,2.55,10),toon(0x896950));m.position.set(x,1.28,5.75);this.grupo.add(m);};
      poste(-2.5);poste(2.5);
      const pts=[];
      for(let i=0;i<=16;i++){
        const x=-2.5+5*i/16,y=2.54-.32*Math.sin(Math.PI*i/16);
        pts.push(new T.Vector3(x,y,5.75));
        if(i%2===1){const s=new T.Shape([new T.Vector2(-.13,0),new T.Vector2(0,-.22),new T.Vector2(.13,0)]);
          const m=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.006,bevelEnabled:false}),toon([0xe39a96,0xf3cf76,0x75b6a2][((i-1)/2)%3]));m.position.copy(pts[i]);this.grupo.add(m);}
      }
      this.grupo.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),32,.008,6,false),toon(0x937960)));
    }
  }
  florir(visivel:boolean){this.vasos.forEach(v=>v.visible=visivel);}
  async receber(origem:T.Vector3){
    this.suporte.visible=true;this.origem.copy(origem);
    if(this.dia===7){
      const s=new T.Shape();s.absarc(0,0,.072,.52,Math.PI*2-.52,false);
      s.quadraticCurveTo(.032,0,.072*Math.cos(.52),.072*Math.sin(.52));
      const medalha=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.008,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:2}),toon(0xf2bc66));
      medalha.rotation.x=-Math.PI/2;this.suporte.add(medalha);
      const l=letreiro('FISCAL',.092,.025,'#754b23');l.rotation.set(-Math.PI/2,0,Math.PI);l.position.y=.013;this.suporte.add(l);
    }
    if(this.dia===9){this.suporte.add(vasoDePlanta('lavanda',.11,.2));}
    if(this.dia===10){
      const menu=new T.Mesh(macia(.28,.009,.33,.004),toon(0xffd899));this.suporte.add(menu);
      for(const [i,t] of ['SUCO DO NOEL','Laranja','R$ 8'].entries()){
        const l=letreiro(t,.22,.046,'#653e27');l.position.set(0,.007,.093-i*.081);l.rotation.set(-Math.PI/2,0,Math.PI);this.suporte.add(l);
      }
    }
    if(this.dia===12){const doce=biscoitoDaEstella();doce.scale.setScalar(1.8);this.suporte.add(doce);}
    this.suporte.position.copy(origem);this.voo=0;
    await new Promise<void>(resolve=>{this.pronto=resolve;});
  }
  retirar(){this.suporte.visible=false;}
  update(dt:number){
    if(!this.pronto)return;
    this.voo=Math.min(1,this.voo+dt/.85);
    const k=this.voo*this.voo*(3-2*this.voo);
    this.suporte.position.lerpVectors(this.origem,this.destino,k);this.suporte.position.y+=.16*Math.sin(k*Math.PI);
    this.suporte.rotation.y=(1-k)*.7;
    if(this.voo===1){this.pronto();this.pronto=null;}
  }
  dispose(){this.pronto?.();this.pronto=null;this.grupo.removeFromParent();
    this.grupo.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();if(o.material instanceof T.MeshBasicMaterial&&o.material.map){o.material.map.dispose();o.material.dispose();}}});
  }
}
