/** Dois expedientes curtos com erros reais pela interface; revisão e pagamento. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4190',OUT=process.argv[2]??'/tmp/revisao';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use preview isolado.');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
async function abrir(n,cel){
 const context=await browser.newContext({viewport:cel?{width:390,height:844}:{width:1280,height:800},hasTouch:cel});
 const page=await context.newPage();page.on('pageerror',e=>erros.push(e.message));
 await page.goto(`${BASE}/?portaria&cena=portaria&dia=${n}&semente=7&depressa`,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!!window.portaria?.ex,undefined,{timeout:90000});
 await page.evaluate(()=>{const r=window.jogo.renderer;window.renderOriginal=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});
 await page.getByRole('button',{name:'Pular explicação'}).click();await page.waitForFunction(()=>window.portaria.comecou());
 return {page,context};
}
async function foto(p,nome){await p.evaluate(()=>{window.jogo.renderer.render=window.renderOriginal;});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await p.evaluate(()=>{window.jogo.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});}
async function livre(p){
 for(let i=0;i<500;i++){
  const s=await p.evaluate(()=>{document.querySelector('.pt-balao.show')?.click();return{ocupado:window.portaria.ocupado(),falando:window.portaria.painel.falando};});
  if(!s.ocupado&&!s.falando){await p.evaluate(()=>window.portaria.painel.mudarVista('documento'));return;}
  await p.waitForTimeout(80);
 }
 throw Error('A interface não ficou livre');
}
try{
 for(const n of process.env.DIAS?process.env.DIAS.split(',').map(Number):[1,5]){
  const {page:p,context}=await abrir(n,n===5);
  const saldoAntes=await p.evaluate(()=>window.jogo.carteira());
  const ids=await p.evaluate(n=>{
   const a=window.portaria,e=a.ex;
   const fila=n===1?[e.fila.find(v=>v.ficha==='hipolito'),e.fila.find(v=>v.ficha==='alpacina')]
    :[e.fila.find(v=>a.carimboCerto(v,e.contexto)==='soClube'),e.fila.find(v=>a.carimboCerto(v,e.contexto)==='entra'&&a.proibidosNaSacola(v,e.contexto).length)];
   if(fila.some(v=>!v))throw Error('Faltou caso de revisão');
   e.fila=fila;for(const [id,m]of a.modelos)m.group.visible=fila.some(v=>v.id===id);
   a.painel.mudarVista('documento');return fila.map(v=>v.id);
  },n);
  for(let i=0;i<2;i++){
   await p.locator('[data-acao="chamar"]').click();await livre(p);
   await p.locator(`[data-acao="carimbo:${n===1&&i===1?'hojeNao':'entra'}"]`).click();await livre(p);
  }
  await p.locator('[data-acao="terminar"]').click();
  for(let i=0;i<100&&!await p.locator('.pt-envelope.show').isVisible();i++){await p.evaluate(()=>document.querySelector('.pt-balao.show')?.click());await p.waitForTimeout(80);}
  await p.locator('.pt-envelope.show').waitFor();
  const fim=await p.evaluate(()=>window.portaria.ex.terminar());
  assert.equal(fim.revisoes.length,2);assert.equal(await p.locator('[data-revisao]').count(),2);
  for(const r of fim.revisoes){const el=p.locator('[data-revisao]').filter({has:p.getByRole('heading',{name:r.visitante,exact:true})});assert.equal(await el.count(),1);await el.getByText(r.motivo,{exact:true}).waitFor();}
  if(n===1){assert.match(await p.locator('.pt-revisoes').innerText(),/1998/);assert.match(await p.locator('.pt-revisoes').innerText(),/penteado/);}
  if(n===5){assert.match(await p.locator('.pt-revisoes').innerText(),/SÓ O CLUBE/);assert.match(await p.locator('.pt-revisoes').innerText(),/sacola/);}
  await foto(p,`dia${n}-${n===5?'celular':'computador'}`);
  await p.locator('[data-revisao]').last().scrollIntoViewIfNeeded();await foto(p,`dia${n}-segunda-revisao`);
  assert.ok(await p.locator('.pt-env li').count()>0,'os valores detalhados continuam no envelope');
  const botoes=await p.evaluate(()=>{const b=document.querySelector('[data-env="ok"]').getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight;});assert.ok(botoes,'fechar continua acessível');
  await p.locator('[data-env="ok"]').click();await p.waitForFunction(()=>window.jogo.current?.def?.id==='clube');
  const depois=await p.evaluate(n=>({vezes:window.jogo.stat(`portaria:dia:${n}:vezes`),saldo:window.jogo.carteira(),normal:localStorage.getItem('aristory.save.v1')}),n);
  assert.equal(depois.vezes,1);assert.equal(depois.saldo-saldoAntes,fim.total);assert.equal(depois.normal,null);
  console.log(`✓ dia ${n}: ${ids.join(', ')}, duas revisões pela tela, valores preservados e save isolado`);
  await context.close();
 }
 if(!process.env.DIAS){
  const {page:p,context}=await abrir(1,true);
  // Estados sem erro: a UI recebe o resultado real de um encerramento, sem inventar um caso.
  for(const vazio of [true,false]){
   await p.evaluate(vazio=>{const a=window.portaria,e=a.ex;if(!vazio){const v=e.fila.find(v=>a.carimboCerto(v,e.contexto)==='entra');e.fila=[v];e.proximo();e.carimbar('entra');e.fim=null;}const fim=e.terminar();void a.painel.envelope(fim,{});},vazio);
   assert.equal(await p.locator('[data-revisao]').count(),0);
   assert.match(await p.locator('.pt-rev-bom').innerText(),vazio?/não houve atendimentos/:/Nenhum erro nos atendimentos feitos/);
   await foto(p,vazio?'sem-atendimentos':'sem-erros');await p.locator('[data-env="ok"]').click();
  }
  await context.close();console.log('✓ recados de nenhum atendimento e nenhum erro, sem elogio indevido');
 }
 assert.deepEqual(erros,[]);console.log('tudo certo');
}finally{await browser.close();}
