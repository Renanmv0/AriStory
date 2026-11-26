import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const url=new URL(process.env.SMOKE_URL || 'http://127.0.0.1:4251');
if(!['localhost','127.0.0.1'].includes(url.hostname))throw Error('Use a prévia local.');
const pasta=process.argv[2] || '/tmp/previa-papita';
await mkdir(pasta,{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try {
  const p=await b.newPage({viewport:{width:480,height:780},hasTouch:true});
  const erros=[];p.on('pageerror',e=>{erros.push(e.message);console.error(e.message);});
  async function pronta(){
    await p.waitForFunction(()=>window.jogo?.current?.world && !window.jogo.transitioning);
    await p.evaluate(()=>{const g=window.jogo;window.desenho=g.renderer.render.bind(g.renderer);window.rapido=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};g.renderer.render=window.rapido;});
  }
  async function foto(nome){
    await p.evaluate(()=>{window.jogo.renderer.render=window.desenho;});
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.screenshot({path:pasta+'/'+nome+'.png'});
    await p.evaluate(()=>{window.jogo.renderer.render=window.rapido;});
  }
  async function falasAte(teste){
    await p.waitForFunction(t=>{if(window.jogo.flag(t)&&!window.jogo.emDialogo())return true;document.querySelector('.dialogue.show')?.click();return false;},teste,{timeout:35000});
  }
  async function interagir(rotulo){
    await p.evaluate(rotulo=>{const g=window.jogo,it=g.current.world.interactables.find(i=>i.label===rotulo);if(!it)throw Error(rotulo);g.debugPlace(it.x,it.z);},rotulo);
    await p.waitForFunction(rotulo=>window.jogo.hot?.label===rotulo&&!window.jogo.transitioning,rotulo);
    await p.locator('.action-btn').tap();
  }
  await p.goto(url.href);await pronta();
  assert.equal(await p.evaluate(()=>window.jogo.current.def.id),'casa');
  await p.evaluate(()=>window.jogo.setFlag('papita-save-controle'));
  const normal=await p.evaluate(()=>localStorage.getItem('aristory.save.v1'));
  await p.goto(new URL('?natal',url).href);await pronta();
  assert.equal(await p.evaluate(()=>window.jogo.current.def.id),'quarto');
  await falasAte('natal:2026:ouviu-a-campainha');
  await interagir('Voltar pra sala');
  await p.waitForFunction(()=>window.jogo.current.def.id==='casa'&&!window.jogo.transitioning);
  await interagir('Receber o Papita Delivery');
  await p.locator('.dialogue.show').waitFor();
  await foto('entrega-do-tata');
  await falasAte('natal:2026:recebeu-do-tata');
  await p.reload();await pronta();
  assert.equal(await p.evaluate(()=>window.jogo.current.def.id),'casa');
  assert.ok(await p.evaluate(()=>!window.jogo.current.world.interactables.some(i=>i.id==='natal:entrega')));
  await interagir('Entrar no quarto do Ari');
  await p.waitForFunction(()=>window.jogo.current.def.id==='quarto'&&!window.jogo.transitioning);
  await interagir('Provar as fantasias de Natal');
  await p.getByRole('button',{name:'Daqui a pouco'}).click();
  await interagir('Provar as fantasias de Natal');
  await p.getByRole('button',{name:'Vamos provar'}).click();
  await p.waitForFunction(()=>window.jogo.flag('natal:2026:vestiram-os-presentes')&&window.jogo.emDialogo());
  await foto('fantasias-de-natal');
  await falasAte('natal:2026:vestiram-os-presentes');await p.reload();await pronta();
  const vestem=await p.evaluate(()=>['ari','renan'].map(id=>window.jogo.wearables(id).filter(Boolean).map(i=>i.id)));
  assert.ok(vestem[0].includes('natal-gorro-estrela')&&vestem[1].includes('natal-tiara-rena'));
  assert.ok(vestem.every(roupas=>roupas.filter(id=>id.startsWith('natal-')).length===4));
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),normal);
  assert.deepEqual(erros,[]);console.log('Campainha, portas, Papita, prova, recarga, roupas e save isolado OK.');
}finally{await b.close();}
