import { neveNaJanela } from './primeiraNeve';
import * as T from 'three';
import { toon } from '../../core/materials';
import { arvore } from '../../world/arvores';
import { estrela } from '../../world/uniformeDosGatitos';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { NATAL_NO_JOGO, TESTE_DE_NATAL, ARVORE_ACESA } from '../Natal';

const COLORIDA = 'natal:2026:luzes-coloridas';
const MEMORIA = 'natal-2026-primeiras-luzes';

export function montarNatalNaSala(w: WorldBuilder, xJanela: number, zJanela: number) {
  if (!NATAL_NO_JOGO && !TESTE_DE_NATAL) return;
  const g = w.game;
  const x = 2.55, z = 2.52;
  const arv = arvore('pinheiro', .6, .24);
  arv.name = 'pinheiro-de-natal';
  w.add(w.place(arv, x, 0, z));
  w.blockCircle(x, z, .46);
  const vaso = new T.Mesh(new T.CylinderGeometry(.27,.215,.32,16), toon(0xa44f42));
  vaso.position.y = .17; arv.add(vaso);
  const aro = new T.Mesh(new T.CylinderGeometry(.28,.28,.045,16), toon(0xecc589));
  aro.position.y = .31; arv.add(aro);

  const fio = new T.CatmullRomCurve3(Array.from({length:97}, (_,i)=>{
    const t = i / 96;
    const a = t * Math.PI * 8 + .5;
    const r = .69 * (1-t) + .074;
    return new T.Vector3(r*Math.cos(a), .72+1.41*t-.028*Math.sin(a*3), r*Math.sin(a));
  }));
  arv.add(new T.Mesh(new T.TubeGeometry(fio,112,.009,5,false),toon(0xb29558)));
  const lampadas = new T.InstancedMesh(new T.SphereGeometry(.041,10,8),new T.MeshBasicMaterial(),36);
  lampadas.name = 'luzes-de-natal';
  const matriz = new T.Matrix4();
  for(let i=0;i<lampadas.count;i++){
    const p = fio.getPointAt(i/(lampadas.count-1));
    lampadas.setMatrixAt(i,matriz.makeTranslation(p.x,p.y,p.z));
  }
  arv.add(lampadas);
  const bola = new T.SphereGeometry(.078,14,10);
  const coresDasBolas = [0xd54c49,0xf2c27b,0xe7a7b4];
  const enfeites = new T.InstancedMesh(bola, toon(0xffffff), 15);
  for(let i=0;i<enfeites.count;i++){
    const p=fio.getPointAt((i+.4)/enfeites.count);
    enfeites.setMatrixAt(i,matriz.makeTranslation(p.x,p.y-.075,p.z));
    enfeites.setColorAt(i,new T.Color(coresDasBolas[i%3]));
  }
  arv.add(enfeites);
  const topo = estrela(.205,0xffdb87);
  topo.rotation.y = .65;
  topo.position.y = 2.36;
  const dourado = new T.MeshBasicMaterial();
  topo.material = dourado;
  arv.add(topo);
  w.aoDesmontar(()=>{ dourado.dispose(); lampadas.material.dispose(); lampadas.dispose(); enfeites.dispose(); });

  const repouso = new T.Color(0x776549), apagada = new T.Color(0xae8252);
  const mel = new T.Color(0xffdd8e), ponta = new T.Color(0xffefab);
  const cores = [0xff9a8c,0x91e2bf,0xffdd85,0x9fcaff].map(c=>new T.Color(c));
  const tinta = new T.Color();
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
  let acesa = g.flag(ARVORE_ACESA), colorida = g.flag(COLORIDA);
  neveNaJanela(w,xJanela,zJanela,()=>acesa);
  let tempo = acesa ? 1 : 0;
  function pintar() {
    for(let i=0;i<lampadas.count;i++){
      const atraso = reduzir.matches ? 0 : i/(lampadas.count-1)*.68;
      const k=T.MathUtils.smoothstep(tempo, atraso, atraso+.27);
      lampadas.setColorAt(i,tinta.copy(repouso).lerp(colorida?cores[i%cores.length]:mel,k));
    }
    lampadas.instanceColor!.needsUpdate = true;
    dourado.color.copy(apagada).lerp(ponta,T.MathUtils.smoothstep(tempo,.7,1));
  }
  pintar();
  w.onUpdate(dt=>{
    if(!acesa || tempo>=1)return;
    tempo=Math.min(1,tempo+dt/(reduzir.matches ? .4 : 1.55)); pintar();
  });
  const interacao=w.interact({id:'natal:pinheiro',x,z,radius:1.75,
    label:acesa?'Ver as luzes de Natal':'Acender a árvore',icon:'🎄',highlight:arv,
    onInteract:async jogo=>{
      const escolha=await jogo.ask(acesa?'Que luz fica mais bonita na nossa sala?':'A estrela já está no topo. Que luz vocês querem acender?', ['✨ Dourada','🎨 Colorida','Deixar para depois']);
      if(escolha!==0 && escolha!==1)return;
      const primeira=!acesa;
      colorida=escolha===1;
      jogo.setFlag(COLORIDA,colorida); jogo.setFlag(ARVORE_ACESA);
      acesa=true; tempo=0; pintar();
      interacao.label='Ver as luzes de Natal';
      jogo.som('clique');
      if(primeira){
        jogo.unlock({id:MEMORIA,title:'As primeiras luzes',place:'Casa do Ari',icon:'🎄',
          note:'Ari e Renan acenderam juntos a árvore da sala. A estrela lá no alto foi a última a acordar.'});
        await jogo.say('Olha lá em cima… A estrela esperou a gente.',jogo.companionName());
      }
    }});
}
