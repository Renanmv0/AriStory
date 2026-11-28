import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = new URL(process.env.SMOKE_URL || 'http://127.0.0.1:4274');
if (!['localhost','127.0.0.1'].includes(base.hostname)) throw Error('Use a prévia local.');
const pasta = process.argv[2] || '/tmp/natal-toalha';
await mkdir(pasta,{recursive:true});
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try {
  const p = await browser.newPage({viewport:{width:430,height:800},hasTouch:true});
  const erros=[]; p.on('pageerror', e=>{erros.push(String(e)); console.error(e);});
  async function abrir(query) {
    await p.goto(new URL(query,base).href,{waitUntil:'domcontentloaded'});
    await p.waitForFunction(()=>window.jogo?.current && !window.jogo.transitioning);
    await p.evaluate(()=>{
      const r=window.jogo.renderer;
      window.real=r.render.bind(r); window.leve=(s,c)=>{s.updateMatrixWorld(); c.updateMatrixWorld();}; r.render=window.leve;
    });
  }
  async function foto(nome) {
    await p.evaluate(()=>{window.jogo.renderer.render=window.real;});
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.screenshot({path:pasta+'/'+nome+'.png'});
    await p.evaluate(()=>{window.jogo.renderer.render=window.leve;});
  }
  async function usar(label) {
    await p.evaluate(label=>{
      const g=window.jogo, it=g.current.world.interactables.find(it=>it.label===label);
      if (!it) throw Error(label);
      g.debugPlace(it.x,it.z);
    },label);
    await p.waitForFunction(label=>window.jogo.hot?.label===label && !window.jogo.transitioning,label);
    await p.locator('.action-btn').tap();
  }
  async function passarAte(texto) {
    await p.waitForFunction(t=>{
      const d=document.querySelector('.dialogue.show');
      if (!d) return false;
      if (d.textContent.includes(t)) return true;
      d.click(); return false;
    },texto);
  }
  async function escolher(nome) {
    await p.waitForFunction(()=>{
      if (document.querySelector('.escolhas.show button')) return true;
      document.querySelector('.dialogue.show')?.click();return false;
    });
    await p.getByRole('button',{name:nome}).click();
  }
  const loja='?natal&cena=lojinha', acao='Bordar a toalha da ceia';
  const flagMotivo='natal:2026:floco-na-toalha', flagPronta='natal:2026:toalha-da-ceia';
  await abrir('?cena=lojinha'); await p.evaluate(()=>window.jogo.setFlag('controle-oficial'));
  const save=await p.evaluate(()=>localStorage.getItem('aristory.save.v1'));
  await abrir(loja);
  assert.equal(await p.evaluate(acao=>window.jogo.current.world.interactables.some(i=>i.label===acao),acao),false);
  await p.evaluate(()=>window.jogo.setFlag('natal:2026:convite-da-gina'));
  const antes=await p.evaluate(()=>localStorage.getItem('aristory.save.v1.natal-2026'));
  await abrir('?natal&cena=villa-lobos');
  assert.equal(await p.evaluate(()=>window.jogo.current.world.interactables.some(i=>i.id==='natal:sobremesa')),false);
  await usar('Buscar a toalha na boutique');
  await p.waitForFunction(()=>window.jogo.current.def.id==='lojinha'&&!window.jogo.transitioning);
  await usar(acao);await escolher('Voltar depois');
  assert.equal(await p.evaluate(flag=>window.jogo.flag(flag),flagPronta),false);
  for (const [motivo,nome] of [[true,'floco'],[false,'estrela']]) {
    if(!motivo){
      await p.evaluate(a=>localStorage.setItem('aristory.save.v1.natal-2026',a),antes);
      await abrir(loja);
      await p.emulateMedia({reducedMotion:'reduce'});
    }
    await usar(acao);await escolher(motivo?'❄️ Um floco da primeira neve':'⭐ A estrela da nossa árvore');
    await passarAte(motivo?'É o floco':'É a estrelinha');
    await foto('toalha-'+nome);
    await passarAte('Prontinho');
    if(motivo)await foto('toalha-enrolada');
    await p.waitForFunction(flag=>{document.querySelector('.dialogue.show')?.click();return window.jogo.flag(flag);},flagPronta);
    await abrir(loja);
    assert.equal(await p.evaluate(flag=>window.jogo.flag(flag),flagMotivo),motivo);
    const ids=await p.evaluate(()=>window.jogo.current.world.interactables.map(i=>i.label));
    assert.ok(ids.includes('Olhar o balcão')&&!ids.includes(acao));
    assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1.natal-2026')).memories.filter(m=>m.id==='natal-2026-toalha').length),1);
    await usar('Voltar pra calçada');
    await p.waitForFunction(()=>window.jogo.current.def.id==='villa-lobos'&&!window.jogo.transitioning);
    const surpresa='Abrir a surpresa do Mano', sobremesa='natal:2026:globo-do-mano';
    if(motivo) {
      await usar(surpresa); await escolher('Decidir depois');
      assert.equal(await p.evaluate(flag=>window.jogo.flag(flag),sobremesa),false);
    }
    await usar(surpresa);
    await passarAte(motivo?'Você fez até o floco':'Olha a estrela');
    await escolher(motivo?'🍓 Morango do Ari':'💛 Maracujá do Renan');
    await passarAte(motivo?'Uma pista de morango':'Ficou parecendo o sol');
    await foto(motivo?'globo-morango':'globo-maracuja');
    await passarAte('Globo de neve pronto!');
    if(motivo)await foto('mano-na-sorveteria');
    await p.waitForFunction(flag=>{document.querySelector('.dialogue.show')?.click();return window.jogo.flag(flag);},sobremesa);
    await abrir('?natal&cena=villa-lobos');
    await usar('Rever a sobremesa da ceia');
    await passarAte(motivo?'calda de morango':'calda de maracujá');
    if(motivo){
      await escolher('🥭 Ver o globo de manga'); await passarAte('Os cubinhos');
      assert.equal(await p.evaluate(()=>window.jogo.flag('natal:2026:calda-de-manga')),false);
    }else{
      await escolher('Voltar ao parque');
    }
    await p.waitForFunction(()=>{document.querySelector('.dialogue.show')?.click();return !window.jogo.camOmbro;});
    assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1.natal-2026')).memories.filter(m=>m.id==='natal-2026-globo').length),1);

  }
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),save);
  assert.deepEqual(erros,[]);console.log('Porta do parque, convite obrigatório, adiamento, dois bordados, movimento reduzido, recarga, balcão, sobremesa dos dois sabores, revisão e save oficial OK.');
} finally {await browser.close();}
