import * as T from 'three';
import { toon } from '../../core/materials';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { ModeloDeVisitante } from '../../world/visitantesDaPortaria';
import { biscoitoDaEstella, vasoDePlanta } from '../../world/props';
import { JatoDeMangueira, MangueiraSolta, pistolaDeMangueira } from '../../world/lavagemDoOnibus';
import { macia } from '../../world/moveisDaBoutique';

const MESA = new T.Vector3(4.45, .63, 4.05);
const VOLTA = [[5.9, 4.15], [6.9, 5.05], [6.95, 6.8], [6.1, 7.2], [3.7, 7.1],
  [3.05, 6.35], [3.1, 5.2], [3.5, 4.45], [4.8, 3.3], [7.4, 3.4]] as const;
type Etapa = 'entrada' | 'espiada' | 'aviso' | 'arrancada' | 'corrida' | 'banho' | 'fuga' | 'fim';

/** A entrada segue pela janela. Só quando ele dispara a câmera entrega o jardim ao jogador. */
export class PerseguicaoDoFiscal {
  private etapa: Etapa = 'entrada';
  private tempo = 0;
  private trecho = 0;
  private noDestino = false;
  private molhado = false;
  private naIso = false;
  private fechada = false;
  private readonly objetos = new T.Group();
  private readonly pote = new T.Group();
  private readonly foco = new T.Object3D();
  private readonly jato = new JatoDeMangueira();
  private readonly mangueira = new MangueiraSolta();
  private readonly esguicho = pistolaDeMangueira();
  private readonly ponta = this.esguicho.getObjectByName('ponta')!;
  private readonly engate = this.esguicho.getObjectByName('engate')!;
  private readonly torneira = new T.Vector3(3.25,.25,3.15);
  private readonly de = new T.Vector3();
  private readonly para = new T.Vector3();
  private readonly direcao = new T.Vector3();
  private readonly entrega = new T.Vector3();
  private readonly limites;
  private readonly colisores;
  private readonly interacao;
  private readonly pessoa: string;
  private readonly guia = document.createElement('div');
  private readonly legenda = document.createElement('span');
  private readonly botao = document.createElement('button');
  private resolver!: (recuperou: boolean) => void;
  readonly pronta = new Promise<boolean>(r => { this.resolver = r; });

  constructor(private w: WorldBuilder, private pato: ModeloDeVisitante,
    private portao: (aberto: boolean) => void, private atuar: (acao: string) => void) {
    this.limites = w.bounds;
    this.colisores = w.colisoresAgora();
    this.pessoa = w.game.playerId();
    w.root.add(this.objetos);
    this.objetos.add(this.foco, this.pote, this.jato.group, this.mangueira.malha);
    this.montarJardim();
    this.guia.className = 'pt-corrida';
    this.guia.append(this.legenda,this.botao);
    this.guia.hidden = true;
    this.botao.hidden = true;
    this.botao.type = 'button';
    const rotulo = document.createElement('strong');
    rotulo.textContent = '💧 Espantar';
    this.botao.append(rotulo);
    this.botao.onclick = () => this.espantar();
    document.body.append(this.guia);
    this.interacao = w.interact({id:'espantar-fiscal',x:0,z:0,radius:1.55,priority:100,
      icon:'💧',label:'Espantar',onInteract:()=>this.espantar()});
    this.interacao.enabled = false;
    this.portao(true);
    this.andar(2.55,3.65,1.12);
    this.foco.position.set(4.95,.5,5.25);
    w.game.focusCamera(this.foco);
    w.game.enquadrar(6.3,5.7);
  }

  private montarJardim() {
    const peca = (pai:T.Object3D,geo:T.BufferGeometry,cor:number,x:number,y:number,z:number) => {
      const m = new T.Mesh(geo,toon(cor)); m.position.set(x,y,z); pai.add(m); return m;
    };
    const canteiro = new T.Group(); this.objetos.add(canteiro); canteiro.position.set(5.12,0,5.72);
    peca(canteiro,macia(2.32,.15,1.04,.07),0xb77958,0,.08,0);
    peca(canteiro,macia(2.17,.06,.9,.025),0x80593d,0,.162,0);
    for (let i=0;i<5;i++) {
      const flor=vasoDePlanta(i%2?'lavanda':'girassol',.16,i*.13);
      flor.position.set((i-2)*.4,.12,.12*Math.cos(i)); canteiro.add(flor);
    }
    peca(this.objetos,macia(.96,.07,.68,.035),0xf3ce91,MESA.x,.59,MESA.z);
    for(const x of [-.38,.38]) for(const z of [-.25,.25])
      peca(this.objetos,macia(.07,.57,.07,.015),0x945d41,MESA.x+x,.285,MESA.z+z);
    this.pote.position.copy(MESA);
    peca(this.pote,new T.CylinderGeometry(.13,.105,.18,20),0xc67b5d,0,.09,0);
    peca(this.pote,new T.CylinderGeometry(.14,.134,.025,24),0xffca81,0,.185,0);
    for(const x of [-.057,0,.059]) {
      const doce=biscoitoDaEstella(); doce.position.set(x,.204,.02*Math.cos(x*48)); this.pote.add(doce);
    }
  }
  private andar(x: number, z: number, velocidade: number) {
    this.noDestino = false;
    void this.pato.irPara(x, z, velocidade).then(() => { this.noDestino = true; });
  }
  private mudar(etapa:Etapa){
    this.etapa=etapa; this.tempo=0; this.guia.dataset.etapa=etapa;
  }
  private perto(){
    const p=this.w.game.playerPosition(), d=this.pato.group.position;
    return Math.hypot(p.x-d.x,p.z-d.z)<=1.55;
  }
  private abrirCorrida(){
    const g=this.w.game;
    this.mudar('corrida'); this.naIso=true;
    this.w.setBounds(2.05,2.85,7.85,7.55);
    this.w.blockBox(5.12,5.72,1.16,.52);
    this.w.blockBox(MESA.x,MESA.z,.48,.34);
    g.setSitting(false);g.mostrarCabeca('jogador',true);g.setPlayerVisible(true);
    g.releasePlayer(2.65,3.25,.95);
    g.releaseCompanion(2.2,3.01,.95);g.holdCompanion(4.5,4.4);
    g.bloquearTroca(true);
    g.segurarNaCena(this.pessoa,this.esguicho,'none');
    g.setCameraOmbro(null);
    this.mangueira.malha.visible=true;
    this.guia.hidden=false;
    this.legenda.textContent='Alcance o fiscal! Dá para cortar pelo lado do canteiro.';
    this.interacao.enabled=true;
    this.andar(...VOLTA[0],1.25);
  }
  private espantar(){
    if(this.etapa!=='corrida'||!this.perto())return;
    this.molhado=true; this.mudar('banho'); this.interacao.enabled=false;
    this.botao.hidden=true;
    const g=this.w.game,p=this.pato.group.position;
    this.andar(p.x,p.z,1);this.pato.encarar(g.playerPosition().x,g.playerPosition().z);
    const jogador=g.playerPosition();
    g.releasePlayer(jogador.x,jogador.z,Math.atan2(p.x-jogador.x,p.z-jogador.z));
    g.lockPlayer(true);g.lavarNaCena('jogador','mangueira',.15);
    this.atuar('banho');this.pato.gesticular(1.2);
    this.legenda.textContent='Jean-Luc: “Os biscoitos exigem armazenamento a seco!”';
    this.foco.position.copy(p).lerp(g.playerPosition(),.5);this.foco.position.y=.65;
    g.enquadrar(3.8,4.4);
  }
  private fugir(){
    this.mudar('fuga');this.botao.hidden=true;this.interacao.enabled=false;
    this.w.game.lockPlayer(true);
    this.legenda.textContent=this.molhado?'O pote ficou. O fiscal foi embora pingando.':'Jean-Luc escapou com um biscoito!';
    this.atuar(this.molhado?'fugaMolhada':'carimbo');
    const pos=this.pato.group.position;
    this.andar(pos.x+3.5,pos.z-.35,2.8);
  }
  update(dt:number){
    if(this.fechada)return;
    this.tempo+=dt;
    const p=this.pato.group.position,g=this.w.game;
    if(!this.naIso){
      // Olho no guichê; acompanha o visitante até a cancela, à altura de quem está sentado.
      this.de.set(.25,1.62,2.32);
      this.para.copy(p);this.para.y=.44;
      g.setCameraOmbro(this.de,this.para,55);
    } else {
      this.engate.getWorldPosition(this.de);
      this.mangueira.esticar(this.torneira,this.de);
    }
    switch(this.etapa){
      case 'entrada':
        if(this.tempo>=2.25 && this.noDestino){
          this.pato.encarar(0,1.5);this.mudar('espiada');
        } break;
      case 'espiada':
        if(this.tempo>.55){
          this.mudar('aviso');g.som('apito');
          void g.say('Bebitos… a vistoria é amanhã. E ele tá indo direto pro pote!', 'Gina').then(()=>{
            if(this.fechada)return;
            this.mudar('arrancada');this.andar(4.13,3.65,2.65);
          });
        } break;
      case 'arrancada':
        if(this.noDestino){
          this.portao(false);
          this.pato.group.add(this.pote);this.pote.position.set(-.17,.32,.15);
          this.atuar('roubar');this.abrirCorrida();
        } break;
      case 'corrida': {
        this.interacao.moveTo(p.x,p.z);this.botao.hidden=!this.perto();
        if(this.noDestino){
          this.trecho++;
          if(this.trecho===VOLTA.length)this.fugir();
          else { const [proximoX,proximoZ]=VOLTA[this.trecho]; this.andar(proximoX,proximoZ,1.25); }
        } break;
      }
      case 'banho': {
        const t=this.tempo;
        if(t>.28&&!this.jato.ligado && t<1.25){this.jato.ligado=true;g.som('mangueira');}
        this.jato.alvo.set(p.x,.38,p.z);
        this.ponta.getWorldPosition(this.de);
        this.direcao.subVectors(this.jato.alvo,this.de).normalize();
        this.jato.apontar(this.de,this.direcao);
        if(t>=1.25)this.jato.ligado=false;
        this.jato.update(dt);
        if(t<.62)this.pote.position.y=.32+.4*Math.min(1,t/.52);
        else {
          if(this.pote.parent!==this.objetos){this.objetos.attach(this.pote);this.entrega.copy(this.pote.position);g.som('respingo');}
          const k=Math.min(1,(t-.62)/.75);
          this.pote.position.lerpVectors(this.entrega,MESA,k);this.pote.position.y+=.6*Math.sin(k*Math.PI);
        }
        if(t>1.95)this.fugir();
        break;
      }
      case 'fuga':
        this.foco.position.lerp(this.para.set(p.x,.58,p.z),1-Math.exp(-dt*3));
        if(this.molhado)this.jato.update(dt);
        if(this.tempo>1.25)this.fechar();
        break;
    }
  }
  fechar(){
    if(this.fechada)return;
    this.fechada=true;this.mudar('fim');this.portao(false);
    const g=this.w.game;
    this.interacao.enabled=false;this.guia.remove();
    this.w.bounds=this.limites;this.w.usarColisores(this.colisores);
    if(this.naIso){g.segurarNaCena(this.pessoa,null);g.lavarNaCena('jogador',null);g.mirarJogador(null);g.freeCompanion();g.bloquearTroca(false);}
    g.focusCamera(null);
    this.objetos.add(this.pote);this.objetos.removeFromParent();
    for(const raiz of [this.objetos,this.esguicho])raiz.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});
    this.resolver(this.molhado);
  }
}
