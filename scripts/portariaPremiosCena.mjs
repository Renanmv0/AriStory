/** Prêmios reais: galeria, armazenamento, legado e as peças em movimento. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4210',OUT=process.argv[2]??'/tmp/premios-gina',SO=process.env.SO??'';
if(!['localhost','127.0.0.1'].includes(new URL(BASE).hostname))throw Error('Use preview local.');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
const ids=['cracha-da-portaria','apito-da-portaria','quepe-da-portaria','colete-da-portaria','pulseira-vip-da-portaria','camisa-da-portaria','calca-da-portaria','tenis-da-portaria'];
async function abrir(cel=false,estrelas=3){
 const context=await browser.newContext({viewport:cel?{width:390,height:844}:{width:1100,height:900},hasTouch:cel});
 await context.addInitScript(estrelas=>{if(!sessionStorage.getItem('premios:fixture')){const stats={};for(let n=1;n<=6;n++)stats[`portaria:dia:${n}:estrelas`]=estrelas;localStorage.setItem('aristory.save.v1.portaria',JSON.stringify({version:1,stats,flags:{},memories:[],carteira:123}));localStorage.setItem('aristory.save.v1',JSON.stringify({version:1,carteira:987,flags:{'preservar-oficial':true}}));sessionStorage.setItem('premios:fixture','sim');}},estrelas);
 const p=await context.newPage();p.on('pageerror',e=>erros.push(e.message));await p.goto(BASE+'/?portaria&cena=portaria&dia=1&depressa',{waitUntil:'networkidle'});
 await p.waitForFunction(()=>!!window.portaria?.ex,undefined,{timeout:120000});await pausar(p);
 await p.locator('.pt-ab-pular').click();
 if(estrelas===3){await p.locator('.presente-gina').waitFor();await pausar(p);}
 else await p.waitForFunction(()=>window.portaria.comecou());
 return{p,context};
}
async function pausar(p){await p.evaluate(()=>{const rs=[window.jogo.renderer,window.portaria?.premiosDaGina()?.renderer].filter(Boolean);for(const r of rs){r.originalDoTeste??=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};}});}
async function foto(p,nome){await p.evaluate(()=>{for(const r of [window.jogo.renderer,window.portaria?.premiosDaGina()?.renderer].filter(Boolean))r.render=r.originalDoTeste??r.render;});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await pausar(p);}
async function giro(p,delta){for(let i=0;i<Math.abs(delta);i++)await p.locator(`[data-pg="${delta<0?'esquerda':'direita'}"]`).click();await p.waitForFunction(()=>{const p=window.portaria.premiosDaGina();return Math.abs(p.giro-p.alvo)<.005;});}
async function conferirArmarios(p){const s=await p.evaluate(()=>({a:window.jogo.wardrobeItems('ari').map(p=>p.id),r:window.jogo.wardrobeItems('renan').map(p=>p.id),save:JSON.parse(localStorage.getItem('aristory.save.v1.portaria')),oficial:JSON.parse(localStorage.getItem('aristory.save.v1'))}));for(const id of ids){assert.ok(s.a.includes(id)&&s.r.includes(id),id);assert.equal(s.save.premios.filter(p=>p===id).length,1);}assert.equal(s.save.carteira,123);assert.equal(s.oficial.carteira,987);assert.equal(s.oficial.flags['preservar-oficial'],true);return s;}
try{
 if(!SO||SO==='galeria'){
  const {p,context}=await abrir(false);await conferirArmarios(p);const peso=[];
  for(let n=1;n<=6;n++){
   await p.waitForFunction(n=>{const d=window.portaria.premiosDaGina();return d.dias[d.indice]===n;},n);
   if(process.env.DIAS&&!process.env.DIAS.split(',').map(Number).includes(n)){if(n<6)await p.locator('[data-pg="seguinte"]').click();continue;}
   for(const quem of ['ari','renan']){
    await p.locator(`[data-pg="${quem}"]`).click();await pausar(p);
    await foto(p,`dia${n}-${quem}-frente`);await giro(p,4);await foto(p,`dia${n}-${quem}-costas`);await giro(p,-4);
    await p.locator('[data-pg="detalhe"]').click();await foto(p,`dia${n}-${quem}-detalhe`);await p.locator('[data-pg="detalhe"]').click();
   }
   const perfil=await p.evaluate(()=>{const d=window.portaria.premiosDaGina(),r=d.renderer.info.render;let malhas=0;d.rig.group.traverse(o=>{if(o.isMesh)malhas++;});return{calls:r.calls,triangles:r.triangles,malhas};});peso.push({dia:n,...perfil});
   if(n<6)await p.locator('[data-pg="seguinte"]').click();
   console.log(`✓ galeria do dia ${n}: Ari/Renan de frente, costas e detalhe`);
  }
  console.log('peso da prova:',JSON.stringify(peso));
  await p.locator('.pg-continuar').click();await p.waitForFunction(()=>window.portaria.comecou());
  await p.reload({waitUntil:'networkidle'});await p.waitForFunction(()=>!!window.portaria?.ex);await pausar(p);await p.locator('.pt-ab-pular').click();await p.waitForFunction(()=>window.portaria.comecou());
  assert.equal(await p.locator('.presente-gina').count(),0);await conferirArmarios(p);console.log('✓ recarregar conserva oito peças e não repete a entrega');await context.close();
 }
 if(!SO||SO==='celular'){
  const {p,context}=await abrir(true);await conferirArmarios(p);await p.locator('[data-pg="renan"]').tap();await foto(p,'celular-cracha');
  const rect=await p.locator('.pg-prova').boundingBox();await p.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height/2);
  const cdp=await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:21}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await p.evaluate(()=>window.portaria.premiosDaGina().dedo),null);await cdp.detach();
  for(let n=1;n<6;n++)await p.locator('[data-pg="seguinte"]').tap();await foto(p,'celular-uniforme');
  const antes=await p.locator('.pg-prova canvas').evaluate(c=>[c.width,c.height]);for(let i=0;i<6;i++)await p.locator('[data-pg="detalhe"]').tap();const depois=await p.locator('.pg-prova canvas').evaluate(c=>[c.width,c.height]);assert.deepEqual(depois,antes,'canvas não cresce sozinho');
  await p.locator('.pg-continuar').tap();await p.waitForFunction(()=>window.portaria.comecou());await context.close();console.log('✓ celular: prova, toque cancelado, canvas estável e botão de continuar');
 }
 if(!SO||SO==='sem-premio'){
  for(const estrelas of [0,1,2]){const {p,context}=await abrir(false,estrelas);assert.equal(await p.locator('.presente-gina').count(),0);await p.evaluate(()=>window.jogo.abrirGuardaRoupa());assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1.portaria')).premios.length),0);await context.close();}
  console.log('✓ zero, uma ou duas estrelas não dão os presentes');
 }
 assert.deepEqual(erros,[]);console.log('tudo certo');
}finally{await browser.close();}
