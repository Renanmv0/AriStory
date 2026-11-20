/** Regressão do atraso na primeira pessoa: aceleração, curvas, freada e deslocamento no mundo. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';
const fonte=await readFile(new URL('../src/eventos/bebitoMobile/cameraDeDentro.ts',import.meta.url),'utf8');
const js=ts.transpileModule(fonte,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from ['"]three['"]/,`from ${JSON.stringify(import.meta.resolve('three'))}`);
const {CameraDeDentro}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
for(const quem of ['jogador','parceiro'])for(const fps of [20,60,120]){
 const mundo=new THREE.Group(),grupo=new THREE.Group();mundo.position.set(800,0,-430);mundo.rotation.y=.7;mundo.add(grupo);
 const cabecas={jogador:new THREE.Object3D(),parceiro:new THREE.Object3D()};
 cabecas.jogador.position.set(-.5,1.4,.5);cabecas.parceiro.position.set(.5,1.4,.5);grupo.add(...Object.values(cabecas));
 const camera=new THREE.PerspectiveCamera();let teto=true;const visivel={jogador:true,parceiro:true};
 const g={cabecaDe:q=>cabecas[q].getWorldPosition(new THREE.Vector3()),encostarNoCarro:()=>{},mostrarCabeca:(q,v)=>visivel[q]=v,setCameraOmbro:(de,para)=>{if(de){camera.position.copy(de);camera.lookAt(para);}},olharLivre:()=>({x:0,y:0})};
 const cama=new THREE.Object3D();grupo.add(cama);
 const c=new CameraDeDentro(g,{group:grupo,cama,mostrarTeto:v=>teto=v},quem);
 void c.ligar({de:new THREE.Vector3(0,2,4),para:new THREE.Vector3()},.001);c.update(1/fps);
 let maximo=0,oscilacao=0,velocidade=0;
 const direcao=new THREE.Vector3(),q=new THREE.Quaternion();
 for(let i=0;i<fps*9;i++){
  const t=i/fps,dt=1/fps;
  velocidade=t<3?t*8:t<6?24:Math.max(0,24-(t-6)*12);
  grupo.position.z+=velocidade*dt;grupo.position.x+=Math.sin(t)*2*dt;grupo.rotation.y=Math.sin(t*.7)*.5;
  c.update(dt);
  grupo.getWorldQuaternion(q);direcao.set(0,Math.sin(c.altura),Math.cos(c.altura)).applyQuaternion(q);
  const esperado=g.cabecaDe(quem).addScaledVector(direcao,.1);esperado.y+=.05;
  maximo=Math.max(maximo,camera.position.distanceTo(esperado));
 }
 // Parado, a imagem equivale ao filtro anterior; só o movimento do carro muda.
 const referencia=camera.position.clone();
 // O filtro ainda amortece o balanço LOCAL do banco, sem carregar a câmera para trás.
 for(let i=0;i<fps*2;i++){
  cabecas[quem].position.y=1.4+Math.sin(i/fps*18)*.015;
  const esperado=g.cabecaDe(quem).addScaledVector(direcao,.1);esperado.y+=.05;
  referencia.lerp(esperado,1-Math.exp(-14/fps));
  c.update(1/fps);
  assert.ok(camera.position.distanceTo(referencia)<.00001,'Parado, a suavização e o enquadramento continuam iguais.');
  oscilacao=Math.max(oscilacao,camera.position.distanceTo(esperado));
 }
 console.log(`${quem}, ${fps} fps: atraso do deslocamento ${maximo.toFixed(6)} m; amortecimento local ${oscilacao.toFixed(4)} m`);
 assert.ok(maximo<.00001,'O carro deve carregar o olho sem atraso ao acelerar, curvar ou frear.');
 assert.ok(oscilacao>.001&&oscilacao<.035,'O balanço local continua suavizado.');
 assert.equal(visivel[quem],false);c.cortar();assert.equal(visivel[quem],true);assert.equal(teto,true);
}
console.log('Câmera acompanha o carro sem atraso e preserva a suavização local.');
