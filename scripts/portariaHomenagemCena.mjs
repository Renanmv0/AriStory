/** Homenagem em primeira pessoa: cinco momentos, cartão físico e retomada segura. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4211',OUT=process.argv[2]??'/tmp/homenagem',SO=process.env.SO??'';
if(!['localhost','127.0.0.1'].includes(new URL(BASE).hostname))throw Error('Use preview local.');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[],CHAVE='portaria:homenagem:primeira-semana';
async function abrir({cel=false,reduzido=false,completa=true,previa=false,renan=false}={}){
 const ctx=await browser.newContext({viewport:cel?{width:390,height:844}:{width:1100,height:850},hasTouch:cel,reducedMotion:reduzido?'reduce':'no-preference'});
 await ctx.addInitScript(completa=>{if(sessionStorage.getItem('fixture-homenagem'))return;const stats={};for(let n=1;n<=6;n++){stats[`portaria:dia:${n}:vezes`]=completa||n<6?1:0;stats[`portaria:dia:${n}:estrelas`]=1;}localStorage.setItem('aristory.save.v1.portaria',JSON.stringify({version:1,carteira:123,stats,flags:{},memories:[]}));localStorage.setItem('aristory.save.v1',JSON.stringify({version:1,carteira:987,flags:{sentinela:true}}));sessionStorage.setItem('fixture-homenagem','1');},completa);
 const p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));await p.goto(`${BASE}/?portaria&cena=${renan?'clube':'portaria'}&dia=6&depressa${previa?'&homenagem':''}`,{waitUntil:'networkidle'});
 if(renan){await p.waitForFunction(()=>window.jogo?.current&&!window.jogo.transitioning);await p.evaluate(()=>{window.jogo.swapCharacters();window.jogo.goTo('portaria');});}
 await p.waitForFunction(()=>window.portaria?.ex);await pausa(p);
 if(completa||previa)await p.locator('.homenagem-gina').waitFor();
 return {p,ctx};
}
async function pausa(p){await p.evaluate(()=>{const r=window.jogo.renderer;r.originalHomenagem??=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});}
async function foto(p,nome){await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>window.jogo.renderer.render=window.jogo.renderer.originalHomenagem);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await pausa(p);}
async function pronta(p){await p.waitForFunction(()=>{const h=window.portaria.homenagemDaGina();return h&&!h.travada;},undefined,{timeout:30000});}
async function cabecaInteira(p,parceiro=false){const limites=await p.evaluate(parceiro=>{const h=window.portaria.homenagemDaGina(),c=window.jogo.camOmbro,lim={x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity},cabeca=parceiro?window.jogo.parceiro.rig.head:h.gina.cabecaDaGina;cabeca.traverse(o=>{if(!o.isMesh)return;let pai=o;while(pai){if(pai.userData.peca==='cartao-de-agradecimento-da-gina')return;pai=pai.parent;}const pos=o.geometry.attributes.position,v=o.position.clone();for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld).project(c);lim.x0=Math.min(lim.x0,v.x);lim.x1=Math.max(lim.x1,v.x);lim.y0=Math.min(lim.y0,v.y);lim.y1=Math.max(lim.y1,v.y);}});return lim;},parceiro);assert.ok(limites.x0>-.98&&limites.x1<.98&&limites.y1<.96,`cabeça inteira: ${JSON.stringify(limites)}`);}
async function salvar(p,esperada){const r=await p.evaluate(chave=>({save:JSON.parse(localStorage.getItem('aristory.save.v1.portaria')),normal:JSON.parse(localStorage.getItem('aristory.save.v1'))}),CHAVE);assert.equal(r.save.flags[CHAVE]===true,esperada);assert.equal(r.save.carteira,123);assert.equal(r.normal.carteira,987);assert.equal(r.normal.flags.sentinela,true);for(let n=1;n<=5;n++)assert.equal(r.save.stats[`portaria:dia:${n}:vezes`],1);return r;}
async function limpo(p){await p.waitForFunction(()=>window.portaria.comecou());const r=await p.evaluate(()=>{let cartoes=0;window.jogo.scene.traverse(o=>{if(o.userData.peca==='cartao-de-agradecimento-da-gina')cartoes++;});return{cartoes,ui:!!document.querySelector('.homenagem-gina'),indice:window.portaria.ex.indice,hora:window.portaria.ex.hora,body:document.body.classList.contains('portaria-em-homenagem')};});assert.equal(r.cartoes,0);assert.equal(r.ui,false);assert.equal(r.indice,-1);assert.equal(r.hora,'09:00');assert.equal(r.body,false);}
try{
 for(const cel of [false,true]){
  if(SO&&SO!==(cel?'celular':'pc'))continue;
  const {p,ctx}=await abrir({cel});
  for(let n=0;n<5;n++){
   await pronta(p);assert.equal(await p.locator('.homenagem-gina').getAttribute('data-etapa'),String(n));await salvar(p,false);
   const estado=await p.evaluate(()=>{const h=window.portaria.homenagemDaGina(),c=window.jogo.camOmbro,el=document.querySelector('.hg-fala').getBoundingClientRect();return{olho:c.position.toArray(),relogio:window.portaria.ex.minutos,indice:window.portaria.ex.indice,caixa:[el.left,el.top,el.right,el.bottom],w:innerWidth,h:innerHeight,cartaoNaMesa:!!h.origemDoCartao,abertura:h.cartao.dobra.rotation.x};});
   assert.ok(estado.olho.every((v,i)=>Math.abs(v-[0,1.7,.44][i])<.0001));assert.equal(estado.relogio,0);assert.equal(estado.indice,-1);assert.ok(estado.caixa[0]>=0&&estado.caixa[1]>=0&&estado.caixa[2]<=estado.w&&estado.caixa[3]<=estado.h);
   if(n===1){assert.equal(estado.cartaoNaMesa,true);assert.ok(estado.abertura>.63);}
   if(n===3)assert.equal(await p.locator('.hg-etiqueta b').textContent(),await p.evaluate(()=>window.jogo.companionName()));
   if(n===0||n>=2)await cabecaInteira(p,n===3);
   await foto(p,`${cel?'celular':'pc'}-${n}`);
   if(n===2)console.log('peso da conversa:',await p.evaluate(()=>({calls:window.jogo.renderer.info.render.calls,triangles:window.jogo.renderer.info.render.triangles})));
   await p.locator('.hg-proximo').click();
  }
  await limpo(p);await salvar(p,true);
  await p.reload({waitUntil:'networkidle'});await p.waitForFunction(()=>window.portaria?.ex);await pausa(p);await p.locator('.pt-ab-pular').click();await limpo(p);await salvar(p,true);
  console.log(`✓ ${cel?'celular':'computador'}: cinco momentos, cartão entregue, primeira pessoa, relógio parado e entrega única`);await ctx.close();
 }
 if(!SO||SO==='pulos'){
  for(const etapa of [0,1]){const {p,ctx}=await abrir({reduzido:etapa===0});if(etapa===1){await pronta(p);await p.locator('.hg-proximo').click();await p.waitForFunction(()=>!!window.portaria.homenagemDaGina().origemDoCartao);await foto(p,'entrega-do-cartao');}await p.locator('.hg-pular').click();await limpo(p);await salvar(p,true);console.log(`✓ pular na etapa ${etapa}: cartão e controle limpos`);await ctx.close();}
  const {p,ctx}=await abrir();await p.evaluate(()=>{window.homenagemCancelada=window.portaria.homenagemDaGina();window.jogo.goTo('clube');});await p.waitForFunction(()=>window.jogo.current?.def.id==='clube'&&!window.jogo.transitioning);await salvar(p,false);assert.equal(await p.locator('.homenagem-gina').count(),0);assert.equal(await p.evaluate(()=>window.homenagemCancelada.gina.naHomenagem),null);console.log('✓ sair da cena cancela sem consumir a homenagem');await ctx.close();
 }
 if(!SO||SO==='gatilhos'){
  const {p,ctx}=await abrir({completa:false});await p.locator('.pt-ab-pular').click();await limpo(p);await salvar(p,false);console.log('✓ cinco dias não disparam a homenagem');await ctx.close();
  const v=await abrir({completa:false,previa:true});await v.p.locator('.hg-pular').click();await limpo(v.p);await salvar(v.p,false);console.log('✓ atalho de preview não consome a cena nem conclui dias');await v.ctx.close();
 }
 if(!SO||SO==='renan'){
  const {p,ctx}=await abrir({cel:true,renan:true});
  assert.equal(await p.evaluate(()=>window.jogo.playerName()),'Renan');
  for(let i=0;i<3;i++){await pronta(p);await p.locator('.hg-proximo').click();}await pronta(p);
  assert.equal(await p.locator('.hg-etiqueta b').textContent(),'Ari');await cabecaInteira(p,true);await foto(p,'ari-com-renan-jogando');
  await p.locator('.hg-pular').click();await limpo(p);await salvar(p,true);await ctx.close();console.log('✓ Renan no controle: Ari responde no banco ao lado');
 }
 assert.deepEqual(erros,[]);console.log('tudo certo');
}finally{await browser.close();}
