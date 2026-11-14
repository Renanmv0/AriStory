/** Regressão: balanço sobre o caminho/perto do muro e giros seguidos com uma única seleção. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use apenas o preview isolado.');
const OUT=process.argv[2]??'/tmp/jardim';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];const espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:120000});
async function desenho(p,ativo){await p.evaluate(ativo=>{const r=window.jogo.renderer;window.desenhoCompleto??=r.render.bind(r);r.render=ativo?window.desenhoCompleto:(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};},ativo);}
async function foto(p,path){await desenho(p,true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path});await desenho(p,false);}
const clicar=(p,n,mobile)=>mobile?p.getByRole('button',{name:n,exact:true}).tap():p.getByRole('button',{name:n,exact:true}).click();
async function preparar(p,x,z,f=0){
 await p.evaluate(({x,z,f})=>{const g=window.jogo,d=g.current.world.root.userData.decorador;g.debugPlace(x-Math.sin(f)*2.15,z-Math.cos(f)*2.15,f);g.releaseCompanion(-7.5,-3,0);g.holdCompanion(-7.5,-3);d.colocar('quintal-balanco');},{x,z,f});
 await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 return p.evaluate(()=>{const d=window.jogo.current.world.root.userData.decorador,m=d.modo;return{x:m.x,z:m.z,motivo:m.motivo,uid:m.uid};});
}
async function escolhas(p){for(let i=0;i<150;i++){if(await p.locator('.escolhas.show button').count())return;await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});await p.waitForTimeout(100);}throw Error('Escolhas não abriram');}
try{
 for(const mobile of [false,true]){
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1200,height:860},isMobile:mobile,hasTouch:mobile});const p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
  await p.goto(`${BASE}/?bebito&cena=casa`);await espera(p,()=>!!window.jogo?.current);await desenho(p,false);
  await p.evaluate(()=>{const g=window.jogo;for(const f of ['bebito:surpresa','bebito:renan-saiu','bebito:ganhou','quintal:arvore-da-casa'])g.setFlag(f);g.salvarDecoracoes([1,2,3].map(uid=>({uid:90000+uid,id:'quintal-balanco',posta:null})));g.goTo('frente-da-casa');});
  await espera(p,()=>window.jogo.idDaCena==='frente-da-casa'&&!!window.jogo.current.world.root.userData.decorador);
  const modo=mobile?'celular':'computador';
  const perto=await preparar(p,5,1.2);assert.equal(perto.motivo,null);assert.ok(Math.abs(perto.x-5)<.01&&Math.abs(perto.z-1.2)<.01);
  await foto(p,`${OUT}-${modo}-muro-permitido.png`);
  await p.locator('.posicionador [data-botao="colocar"]').click();
  await espera(p,()=>!window.jogo.current.world.root.userData.decorador.decorando);
  const lajes=await preparar(p,2,-1.6);assert.equal(lajes.motivo,null);assert.ok(Math.abs(lajes.x-2)<.01&&Math.abs(lajes.z+1.6)<.01);
  await foto(p,`${OUT}-${modo}-lajes-permitidas.png`);
  await p.locator('.posicionador [data-botao="colocar"]').click();await espera(p,()=>!window.jogo.current.world.root.userData.decorador.decorando);
  for(const [x,z,termo] of [[2,1.2,'portão'],[2,-3,'porta'],[6.5,1.2,'fora'],[5,1.2,'outro enfeite']]){
   const invalido=await preparar(p,x,z,termo==='portão'?Math.PI:termo==='porta'?Math.PI/2:0);assert.ok(invalido.motivo?.includes(termo),JSON.stringify(invalido));
   assert.equal(await p.locator('.posicionador [data-botao="colocar"]').isDisabled(),true);
   await p.locator('.posicionador [data-botao="cancelar"]').click();
  }
  console.log(modo,': balanço colocado perto do muro e sobre as lajes; porta, portão, muro e outras peças protegidos');
  await p.evaluate(()=>{const g=window.jogo,d=g.current.world.root.userData.decorador;g.debugPlace(3.15,1.2,Math.PI/2);d.editar();g.setZoom(9);});
  await espera(p,()=>document.querySelector('.posicionador.show.editando')&&document.querySelector('.prompt.show')?.textContent.toLowerCase().includes('mexer no balanço'));
  if(mobile)await p.locator('.prompt.show').tap();else await p.keyboard.press('KeyE');
  await espera(p,()=>document.querySelectorAll('.escolhas.show button').length===4);
  for(let i=1;i<=5;i++){
   await clicar(p,'Girar',mobile);
   await espera(p,()=>document.querySelectorAll('.escolhas.show button').length===4);
   const salvo=await p.evaluate(uid=>window.jogo.decoracoes().find(d=>d.uid===uid).posta,perto.uid);
   assert.ok(Math.abs(salvo.giro-i*Math.PI/4)<.0001);assert.equal(salvo.x,5);assert.equal(salvo.z,1.2);
  }
  await foto(p,`${OUT}-${modo}-cinco-giros.png`);
  await clicar(p,'Deixar assim',mobile);await espera(p,()=>!window.jogo.emDialogo());
  await p.evaluate(()=>window.jogo.current.world.root.userData.decorador.pararDeEditar());
  // O uso real precisa ler a orientação atual, não a capturada ao montar a peça.
  await p.evaluate(uid=>{void window.jogo.current.world.interactables.find(i=>i.id===`usar:${uid}`).trigger(window.jogo);},perto.uid);
  await escolhas(p);await clicar(p,'Levantar',mobile);await espera(p,()=>!window.jogo.player.locked&&!window.jogo.player.riding);
  const saiu=await p.evaluate(()=>({x:window.jogo.player.position.x,z:window.jogo.player.position.z}));
  const giro=5*Math.PI/4,esperado={x:5+Math.sin(giro)*1.3-Math.cos(giro)*.5,z:1.2+Math.cos(giro)*1.3+Math.sin(giro)*.5};
  assert.ok(Math.hypot(saiu.x-esperado.x,saiu.z-esperado.z)<.3,JSON.stringify({saiu,esperado}));
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
  await p.goto(`${BASE}/?bebito`);await espera(p,()=>window.jogo?.idDaCena==='frente-da-casa'&&window.jogo.current.world.root.userData.decorador);
  await desenho(p,false);
  const recarga=await p.evaluate(uid=>{const g=window.jogo,d=g.current.world.root.userData.decorador;return{giro:g.decoracoes().find(k=>k.uid===uid).posta.giro,pecas:d.pecas().filter(k=>k.ficha.id==='quintal-balanco').length};},perto.uid);
  assert.ok(Math.abs(recarga.giro-giro)<.0001);assert.equal(recarga.pecas,2);
  console.log(modo,': cinco giros sem resselecionar, uso com direção atual e save após recarga passaram');await ctx.close();
 }
 // O editor é compartilhado com a estufa: repetir giros e mudar/cancelar continua funcionando lá.
 const ctx=await browser.newContext({viewport:{width:1200,height:800}}),p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(`${BASE}/?bebito&cena=casa`);await espera(p,()=>!!window.jogo?.current);await desenho(p,false);
 await p.evaluate(()=>{window.jogo.salvarDecoracoes([{uid:99001,id:'anao-de-jardim',posta:{x:9.55,z:4,giro:0}}]);window.jogo.goTo('estufa');});
 await espera(p,()=>window.jogo.idDaCena==='estufa'&&window.jogo.current.world.root.userData.decorador);
 await p.evaluate(()=>{const g=window.jogo;g.current.world.root.userData.decorador.editar();void g.current.world.interactables.find(i=>i.id==='decoracao:99001').trigger(g);});
 await espera(p,()=>document.querySelectorAll('.escolhas.show button').length===4);
 for(let i=1;i<=3;i++){await clicar(p,'Girar',false);await espera(p,()=>document.querySelectorAll('.escolhas.show button').length===4);assert.ok(Math.abs(await p.evaluate(()=>window.jogo.decoracoes().find(d=>d.uid===99001).posta.giro)-i*Math.PI/4)<.0001);}
 await clicar(p,'Mudar de lugar',false);await espera(p,()=>window.jogo.current.world.root.userData.decorador.decorando);
 await p.locator('.posicionador [data-botao="cancelar"]').click();await espera(p,()=>!window.jogo.current.world.root.userData.decorador.decorando);
 assert.ok(Math.abs(await p.evaluate(()=>window.jogo.decoracoes().find(d=>d.uid===99001).posta.giro)-3*Math.PI/4)<.0001);
 await ctx.close();console.log('Estufa: giros seguidos e mudar/cancelar preservaram a peça.');
 assert.deepEqual(erros,[]);console.log('Jardim validado sem erros de página.');
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){console.log('falha:',await p.evaluate(()=>({cena:window.jogo?.idDaCena,dialogo:document.querySelector('.dialogue.show')?.textContent,modo:window.jogo?.current?.world.root.userData.decorador?.modo?.motivo})).catch(()=>null));await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await browser.close();}
