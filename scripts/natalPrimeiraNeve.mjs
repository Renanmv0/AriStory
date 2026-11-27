import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base=new URL(process.env.SMOKE_URL || 'http://127.0.0.1:4268');
if(!['localhost','127.0.0.1'].includes(base.hostname))throw Error('Use a prévia local.');
const pasta=process.argv[2] || '/tmp/natal-neve';
await mkdir(pasta,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try {
  const p=await browser.newPage({viewport:{width:430,height:800},hasTouch:true});
  const erros=[];p.on('pageerror',e=>{erros.push(String(e));console.error(e);});
  async function pronta(){
    await p.waitForFunction(()=>window.jogo?.current && !window.jogo.transitioning);
    await p.evaluate(()=>{const r=window.jogo.renderer;window.renderReal=r.render.bind(r);window.rapido=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};r.render=window.rapido;});
  }
  async function foto(nome){
    await p.evaluate(()=>{window.jogo.renderer.render=window.renderReal;});
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.screenshot({path:pasta+'/'+nome+'.png'});
    await p.evaluate(()=>{window.jogo.renderer.render=window.rapido;});
  }
  async function usar(rotulo){
    await p.evaluate(rotulo=>{const g=window.jogo,i=g.current.world.interactables.find(i=>i.label===rotulo);if(!i)throw Error(rotulo);g.debugPlace(i.x,i.z);},rotulo);
    await p.waitForFunction(rotulo=>!window.jogo.transitioning && window.jogo.hot?.label===rotulo,rotulo);
    await p.locator('.action-btn').tap();
  }
  const normal=new URL('?cena=casa',base),natal=new URL('?natal&cena=casa',base),quintal=new URL('?natal&cena=frente-da-casa',base);
  await p.goto(normal.href);await pronta();
  await p.evaluate(()=>window.jogo.setFlag('controle-do-save'));
  const save=await p.evaluate(()=>localStorage.getItem('aristory.save.v1'));
  await p.goto(natal.href);await pronta();
  assert.ok(await p.evaluate(()=>!window.jogo.current.world.interactables.some(i=>i.id==='natal:cortina')));
  // Um save de quem recebeu o presente na prévia anterior, mas ainda não acendeu a árvore.
  await p.evaluate(()=>window.jogo.setFlag('natal:2026:vestiram-os-presentes'));await p.reload();await pronta();
  assert.ok(await p.evaluate(()=>!window.jogo.current.world.interactables.find(i=>i.id==='natal:cortina').enabled));
  await usar('Acender a árvore');await p.getByRole('button',{name:'🎨 Colorida'}).click();
  await p.locator('.dialogue.show').waitFor();await p.waitForFunction(()=>{document.querySelector('.dialogue.show')?.click();return !window.jogo.emDialogo();});
  // Recarregar com a árvore já acesa também libera a cortina sem repetir a escolha.
  await p.reload();await pronta();
  await usar('Abrir a cortina com o Pelusa');
  await p.locator('.dialogue.show').waitFor();
  await foto('pelusa-na-janela');
  await p.waitForFunction(()=>{document.querySelector('.dialogue.show')?.click();return !window.jogo.camOmbro;});
  await usar('Sair pro jardim');
  await p.waitForFunction(()=>window.jogo.current.def.id==='frente-da-casa'&&!window.jogo.transitioning);
  await p.evaluate(()=>window.jogo.debugPlace(2.7,-.2));
  await p.waitForTimeout(500);await foto('pegadas-no-quintal');
  await usar('Pegar o convite da Gina');
  await p.locator('.memorias.show .close').waitFor();
  await foto('convite-da-gina');await p.locator('.memorias .close').click();
  await p.goto(quintal.href);await pronta();await usar('Reler o convite da Gina');
  await p.locator('.memorias.show .close').click();
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1.natal-2026')).memories.filter(m=>m.id==='natal-2026-convite').length),1);
  await p.goto(new URL('?natal&cena=quarto',base).href);await pronta();
  assert.ok(await p.evaluate(()=>window.jogo.current.world.interactables.find(i=>i.id==='quarto:pelusa').enabled));
  await p.evaluate(()=>window.jogo.abrirMemoria('convite-ceia-da-gina'));
  assert.equal(await p.locator('.memorias.show h2').textContent(),'Um convite da Gina');
  await p.locator('.memorias .close').click();
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),save);
  assert.deepEqual(erros,[]);console.log('Janela, árvore já acesa, saída a pé, correio, releitura e isolamento OK.');
}finally{await browser.close();}
