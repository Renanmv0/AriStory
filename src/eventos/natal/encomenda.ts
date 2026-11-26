import * as T from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { caixaDeEncomenda } from '../../world/quintal';
import { modeloDoVisitante } from '../../world/visitantesDaPortaria';
import { FICHAS } from '../../minigames/portaria/personagens';
import { NATAL_DO_ARI, NATAL_DO_RENAN, PECAS_DE_NATAL } from '../../world/figurinosDeNatal';
import { NATAL_NO_JOGO, TESTE_DE_NATAL } from '../Natal';

export const CAMPAINHA = 'natal:2026:ouviu-a-campainha';
const ENTREGUE = 'natal:2026:recebeu-do-tata';
const VESTIRAM = 'natal:2026:vestiram-os-presentes';

export function natalNoQuarto(w: WorldBuilder, xArmario:number, zArmario:number) {
  if (!NATAL_NO_JOGO && !TESTE_DE_NATAL) return;
  const g=w.game;
  let tempo=0, tocou=g.flag(CAMPAINHA), ativa=true;
  w.aoDesmontar(()=>{ativa=false;});
  w.onUpdate(dt=>{
    if(tocou || g.emDialogo())return;
    tempo+=dt;
    if(tempo<1)return;
    tocou=true;
    void (async()=>{
      await g.say('Por que você está olhando tanto pra porta?', 'Ari');
      if(!ativa)return;
      g.som('sino');g.setFlag(CAMPAINHA);
      await g.say('Dlim-dom! A campainha tocou lá embaixo.', '🔔 Campainha');
      if(ativa)await g.say('Chegou! Vem comigo atender na sala?', 'Renan');
    })();
  });

  if(!g.flag(ENTREGUE) || g.flag(VESTIRAM))return;
  const caixa=w.add(w.place(caixaDeEncomenda(.88),xArmario-.38,0,zArmario+.87));
  const presente=w.interact({id:'natal:provar',x:xArmario,z:zArmario+1.27,radius:1.85,priority:2,
    icon:'🎁',label:'Provar as fantasias de Natal',highlight:caixa,
    onInteract:async()=>{
      if(await g.ask('Abrir os dois pacotinhos e vestir as fantasias?', ['Vamos provar','Daqui a pouco'])!==0 || !ativa)return;
      g.lockPlayer(true);g.bloquearTroca(true);
      try {
        await g.escurecerTela(true);
        if(!ativa)return;
        for(const peca of Object.values(PECAS_DE_NATAL))g.ganharPeca(peca);
        g.vestirConjunto(NATAL_DO_ARI,'ari');g.vestirConjunto(NATAL_DO_RENAN,'renan');
        g.setFlag(VESTIRAM);presente.enabled=false;caixa.visible=false;
        const ari=g.playerId()==='ari';
        g.releasePlayer(ari?1.0:1.86,-1.2,ari ? .12 : -.12);
        g.releaseCompanion(ari?1.86:1.0,-1.2,ari ? -.12 : .12);
        g.lockPlayer(true);g.holdCompanion(1.45,2);
        // Deixa espaço para os chifrinhos, as duas botinas e o balão no celular.
        const lente = T.MathUtils.radToDeg(2*Math.atan(Math.max(.49, .32*innerHeight/innerWidth)));
        g.setCameraOmbro(new T.Vector3(1.43,1.23,2.16),new T.Vector3(1.43,.82,-1.2),lente);
        g.som('folhear');await g.escurecerTela(false);
        if(!ativa)return;
        await g.say('Você pediu uma estrelinha pra combinar com a minha presilha!', 'Ari');
        if(ativa)await g.say('E dois chifrinhos pra eu enroscar no pisca-pisca enquanto você monta a árvore.', 'Renan');
      } finally {
        if(ativa){g.setCameraOmbro(null);g.freeCompanion();g.bloquearTroca(false);g.lockPlayer(false);}
      }
    }});
}

export function entregaNaSala(w:WorldBuilder) {
  const g=w.game;
  if((!NATAL_NO_JOGO && !TESTE_DE_NATAL) || !g.flag(CAMPAINHA) || g.flag(ENTREGUE))return;
  const tata=modeloDoVisitante('tata',FICHAS.tata.retrato);
  const x=.83,z=3.28;
  w.add(w.place(tata.group,x,0,z));tata.encarar(-1,2.5);
  const caixa=w.add(w.place(caixaDeEncomenda(.9),x-.46,0,z-.20));
  let ativa=true;
  w.onUpdate(dt=>{if(tata.group.visible)tata.update(dt);});
  w.aoDesmontar(()=>{ativa=false;tata.dispose();});
  const receber=w.interact({id:'natal:entrega',x:x-.87,z:z-.56,radius:1.95,priority:2,icon:'🥔',
    label:'Receber o Papita Delivery',highlight:caixa,
    onInteract:async()=>{
      // Olhando da sala para a soleira: o muro frontal fica atrás do entregador.
      const olho=new T.Vector3(1.93,1.12,1.65);
      tata.encarar(olho.x,olho.z);tata.gesticular(1.4);
      g.setCameraOmbro(olho,new T.Vector3(.68,.55,3.22),54);g.som('caixa');
      await g.say('Papita Delivery! Um pacote pro Ari, um pro Renan. Ah, é a mesma casa. Ganhei uma viagem!', 'Tatá');
      if(!ativa)return;
      await g.say('Fui eu que pedi. O seu tem uma estrela na etiqueta. Vamos abrir juntos no armário do quarto?', 'Renan');
      if(!ativa)return;
      g.setCameraOmbro(null);g.setFlag(ENTREGUE);receber.enabled=false;caixa.visible=false;
      await tata.irPara(0,4.55,1.7);
      if(ativa)tata.group.visible=false;
    }});
}
