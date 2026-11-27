import * as T from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';

/** Uma única nuvem local; dentro de casa o volume se limita ao lado de fora do vidro. */
export function nevar(w: WorldBuilder, pai: T.Group, largura:number, altura:number, fundo:number, quantidade:number) {
  const leve = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = leve ? Math.ceil(quantidade / 3) : quantidade;
  const pos = new Float32Array(n*3), inicial = new Float32Array(n*3);
  const velocidade = new Float32Array(n);
  let seed = 2712;
  const sorteio = () => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
  for(let i=0;i<n;i++){
    inicial[3*i]=(sorteio()-.5)*largura*.94;
    inicial[3*i+1]=sorteio()*altura;
    inicial[3*i+2]=(sorteio()-.5)*fundo;
    velocidade[i]=(.12+sorteio()*.22)*(leve ? .45 : 1);
  }
  pos.set(inicial);
  const geo=new T.BufferGeometry(), atributo=new T.BufferAttribute(pos,3).setUsage(T.DynamicDrawUsage);
  geo.setAttribute('position',atributo);
  const c=document.createElement('canvas');c.width=c.height=32;
  const ctx=c.getContext('2d')!;
  const luz=ctx.createRadialGradient(16,16,2,16,16,15);
  luz.addColorStop(0,'white');luz.addColorStop(.68,'#fffffff2');luz.addColorStop(1,'#ffffff00');
  ctx.fillStyle=luz;ctx.fillRect(0,0,32,32);
  const mapa=new T.CanvasTexture(c);
  const material=new T.PointsMaterial({map:mapa,color:0xfffafa,size:largura<2 ? .03 : .075,transparent:true,opacity:.9,depthWrite:false});
  const flocos=new T.Points(geo,material);flocos.frustumCulled=false;flocos.renderOrder=2;pai.add(flocos);
  let t=0;
  w.onUpdate(dt=>{
    if(!pai.visible)return;
    t+=dt;
    for(let i=0;i<n;i++){
      pos[3*i]=inicial[3*i]+Math.sin(t*.72+i*2.7)*Math.min(.025*largura,.18);
      pos[3*i+1]=T.MathUtils.euclideanModulo(inicial[3*i+1]-t*velocidade[i],altura);
    }
    atributo.needsUpdate=true;
  });
  w.aoDesmontar(()=>{geo.dispose();material.dispose();mapa.dispose();});
}
