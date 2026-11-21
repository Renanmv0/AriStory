/** Aberturas reais dos seis dias; câmera, demonstrações, pulo e limpeza. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const OUT=process.argv[2]??'/tmp/portaria-abertura';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4173';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use preview isolado.');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
const casos=(process.env.DIAS??'1,2,3,4,5,6').split(',').map(Number);
async function abrir(n,{cel=false,reduzido=false}={}){
 const context=await browser.newContext({viewport:cel?{width:390,height:844}:{width:1280,height:720},hasTouch:cel,reducedMotion:reduzido?'reduce':'no-preference'});
 const p=await context.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(`${BASE}/?portaria&cena=portaria&dia=${n}&semente=7`,{waitUntil:'networkidle'});
 await p.waitForFunction(()=>!!window.portaria?.abertura,{timeout:90000});
 await p.evaluate(()=>{const r=window.jogo.renderer;window.renderOriginal=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});
 await p.waitForTimeout(500);
 return {p,context};
}
async function foto(p,nome){await p.evaluate(()=>{window.jogo.renderer.render=window.renderOriginal;});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await p.evaluate(()=>{window.jogo.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});}
async function intacto(p){
 const s=await p.evaluate(()=>({inicio:window.portaria.comecou(),indice:window.portaria.ex.indice,cam:window.jogo.camOmbro.position.toArray(),painel:window.portaria.painel.aberta,normal:localStorage.getItem('aristory.save.v1')}));
 assert.equal(s.inicio,false);assert.equal(s.indice,-1);assert.equal(s.painel,false);assert.equal(s.normal,null);
 assert.ok(s.cam.every((v,i)=>Math.abs(v-[0,1.7,.44][i])<.001),'a câmera fica no banco, em primeira pessoa');
}
async function limpo(p){
 await p.waitForFunction(()=>window.portaria.comecou());
 const s=await p.evaluate(()=>({papeis:window.portaria.mesa.naMesa.length,leitura:window.portaria.mesa.naLeitura,indice:window.portaria.ex.indice,livre:!window.portaria.ocupado(),painel:window.portaria.painel.aberta,ui:!!document.querySelector('.pt-abertura'),objetos:[window.portaria.mesa.prancheta,window.portaria.mesa.calendario,...window.portaria.mesa.group.children.filter(o=>o.name.startsWith('papel:'))].map(o=>o.scale.toArray()),hora:window.portaria.ex.hora}));
 assert.equal(s.papeis,0);assert.equal(s.leitura,null);assert.equal(s.indice,-1);assert.equal(s.livre,true);assert.equal(s.painel,true);assert.equal(s.ui,false);assert.ok(s.objetos.every(a=>a.every(v=>v===1)));assert.ok(['09:00','Sem limite'].includes(s.hora));
}
try{
 for(const n of casos){
  const cel=n===2||n>=4;const {p,context}=await abrir(n,{cel,reduzido:n===3});
  await intacto(p);if(n===1)await foto(p,'gina-pc');
  await p.getByRole('button',{name:'Ver exemplo'}).click();
  await p.waitForFunction(()=>!document.querySelector('.pt-ab-proximo').disabled);
  await p.waitForTimeout(300);await intacto(p);
  const tipos=await p.evaluate(()=>window.portaria.mesa.naMesa.map(p=>p.tipo));
  assert.deepEqual(tipos,[['carteirinha'],['carteirinha'],['convite'],['cracha','ordem'],['exame'],['conviteColetivo']][n-1]);
  if(n===5)assert.equal(await p.evaluate(()=>window.portaria.mesa.papeis.get('exame').carimbo),'soClube');
  if(n===3)assert.match(await p.locator('.pt-ab-fala').innerText(),/sócio que convidou/);
  // O cartão e o botão cabem no celular; o exemplo fica fora da caixa de fala.
  const tela=await p.evaluate(()=>{const c=document.querySelector('.pt-ab-cartao').getBoundingClientRect(),b=document.querySelector('.pt-ab-proximo').getBoundingClientRect();return{c:[c.left,c.top,c.right,c.bottom],b:[b.left,b.top,b.right,b.bottom],w:innerWidth,h:innerHeight};});
  for(const a of [tela.c,tela.b])assert.ok(a[0]>=0&&a[1]>=0&&a[2]<=tela.w&&a[3]<=tela.h);
  const limites=await p.evaluate(()=>window.portaria.mesa.naMesa.map(({grupo})=>{const c=window.jogo.camOmbro,g=grupo.children[0].geometry;grupo.updateWorldMatrix(true,true);const pontos=Array.from({length:g.attributes.position.count},(_,i)=>grupo.position.clone().fromBufferAttribute(g.attributes.position,i).applyMatrix4(grupo.children[0].matrixWorld).project(c));return pontos.every(v=>Math.abs(v.x)<.98&&Math.abs(v.y)<.98);}));
  assert.ok(limites.every(Boolean),'os exemplos 3D cabem inteiros no enquadramento');
  await foto(p,`dia${n}${cel?'-cel':'-pc'}`);
  await p.getByRole('button',{name:'Entendi'}).click();await p.waitForFunction(()=>!document.querySelector('.pt-ab-proximo').disabled);
  if(n>1)assert.match(await p.locator('.pt-ab-fala').innerText(),/continu|mesmas|Valem|vale|esqueçam/i);
  await p.getByRole('button',{name:'Começar expediente'}).click();await limpo(p);
  console.log(`✓ dia ${n}: primeira pessoa, exemplo correto, tempo parado e mesa limpa (${cel?'celular':'computador'})`);
  await context.close();
 }
 if(!process.env.DIAS){
  for(const [n,etapa] of [[1,'inicio'],[4,'voo'],[5,'carimbo']]){
   const {p,context}=await abrir(n,{cel:true});
   if(etapa!=='inicio'){await p.getByRole('button',{name:'Ver exemplo'}).click();if(etapa==='carimbo')await p.waitForFunction(()=>!!window.portaria.mesa.batida);}
   if(etapa==='inicio')await p.keyboard.press('Escape');else await p.getByRole('button',{name:'Pular explicação'}).click();
   await limpo(p);await p.waitForTimeout(1800);await limpo(p);
   console.log(`✓ pular durante ${etapa}: sem papel, carimbo ou callback tardio`);
   await context.close();
  }
 }
 assert.deepEqual(erros,[]);console.log('tudo certo');
}finally{await browser.close();}
