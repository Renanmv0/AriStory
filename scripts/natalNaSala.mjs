import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try{
const p=await b.newPage({viewport:{width:430,height:790},hasTouch:true});
const erros=[];p.on('pageerror',e=>erros.push(e.message));
const base = new URL(process.env.SMOKE_URL || 'http://127.0.0.1:4246');
if (!['localhost', '127.0.0.1'].includes(base.hostname)) throw Error('Use o preview local.');
const url = new URL('?cena=casa', base).href;
await p.goto(url);
const pronta=async()=>{
await p.waitForFunction(()=>window.jogo?.current?.world && !window.jogo.transitioning);
await p.evaluate(()=>{const g=window.jogo;window.desenho=g.renderer.render.bind(g.renderer);g.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});};
await pronta();
const existe=()=>p.evaluate(()=>!!window.jogo.current.world.root.getObjectByName('pinheiro-de-natal'));
assert.equal(await existe(),false);
await p.evaluate(()=>{window.jogo.setFlag('sentinela-teste');});
const normal=await p.evaluate(()=>localStorage.getItem('aristory.save.v1'));
await p.goto(url+'&natal');await pronta();assert.equal(await existe(),true);
assert.equal(await p.evaluate(()=>window.jogo.flag('sentinela-teste')),false);
async function abrir(){
 await p.waitForFunction(()=>window.jogo.current.world.interactables.find(i=>i.id==='natal:pinheiro')?.available);
 await p.locator('.prompt.show').filter({hasText:/árvore|Natal/}).waitFor();await p.locator('.action-btn').tap();
 await p.locator('.escolhas.show button').first().waitFor({timeout:7000});
}
await abrir();
await p.getByRole('button',{name:'Deixar para depois'}).click();
assert.equal(await p.evaluate(()=>window.jogo.flag('natal:2026:luzes-acesas')),false);
await abrir();await p.getByRole('button',{name:'🎨 Colorida'}).click();
await p.waitForFunction(()=>window.jogo.temMemoria('natal-2026-primeiras-luzes'));
await p.waitForTimeout(1000);
await p.locator('.dialogue.show').click();
await p.waitForFunction(()=>!document.querySelector('.dialogue.show'));
await p.evaluate(()=>{window.jogo.renderer.render=window.desenho;});await p.waitForTimeout(550);
await p.screenshot({path:process.argv[2] || '/tmp/natal-sala.png'});
await p.reload();await pronta();
assert.ok(await p.evaluate(()=>window.jogo.flag('natal:2026:luzes-coloridas')));
await abrir();await p.getByRole('button',{name:'✨ Dourada'}).click();
await p.waitForFunction(()=>!window.jogo.flag('natal:2026:luzes-coloridas'));
assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),normal);
assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1.natal-2026')).memories.filter(m=>m.id==='natal-2026-primeiras-luzes').length),1);
assert.deepEqual(erros,[]);
console.log('Entrada normal, primeira interação desde o spawn, adiar, cores, diário, recarga e save separados OK');
}finally{await b.close();}
