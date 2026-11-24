// Fotos da câmera do visitante e verificação das decisões no preview local.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base = process.env.SMOKE_URL || 'http://127.0.0.1:4223';
if (!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw Error('Use o preview local');
const out = process.argv[2] || '/tmp/cantina';
await mkdir(out,{recursive:true});
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
try {
  const desfecho=process.env.DESFECHO || 'recuperou';
  for(const dia of (process.env.DIAS || '7,8,9,10,11,12').split(',').map(Number)){
    const p=await browser.newPage({viewport:process.env.PC?{width:1100,height:800}:{width:390,height:844},hasTouch:!process.env.PC,reducedMotion:process.env.ANIMACOES?'no-preference':'reduce'});
    p.on('pageerror',e=>{erros.push(e.message);console.error(e.message);});
    await p.goto(base+'/?portaria&cena=portaria&dia='+dia+'&depressa&semente=7');
    await p.waitForFunction(()=>window.portaria?.ex);
    const foto=async(nome)=>{
      if(desfecho!=='recuperou' && !(desfecho==='escapou' && nome==='corrida'))return;
      await p.evaluate(()=>{window.jogo.renderer.render=window.desenho;});
      await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      await p.screenshot({path:out+'/dia-'+dia+'-'+nome+'.png'});
      await pausa();
    };
    const pausa=()=>p.evaluate(()=>{const r=window.jogo.renderer;window.desenho??=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});
    await pausa();
    await p.locator('.pt-ab-pular').click();
    async function molhar(){
      await p.locator('.pt-jardim').waitFor();
      const andar=p.getByRole('button',{name:'👣 Andar'}),jato=p.getByRole('button',{name:'💧 Jato'});
      const b=await andar.boundingBox();await p.mouse.move(b.x+22,b.y+22);await p.mouse.down();await p.waitForTimeout(1450);await p.mouse.up();
      const j=await jato.boundingBox();await p.mouse.move(j.x+22,j.y+22);await p.mouse.down();
      await p.locator('.pt-jardim').waitFor({state:'hidden',timeout:22000});await p.mouse.up();
    }
    if(dia===7){
      await p.locator('.pt-jardim').waitFor();
      if(desfecho==='recuperou'){await foto('treino');await molhar();}
      else await p.getByRole('button',{name:'Pular treino'}).click();
    }
    await p.waitForFunction(()=>window.portaria.comecou());
    const id=await p.evaluate(dia=>{
      const ex=window.portaria.ex;
      const i=ex.fila.findIndex(v=>v.ficha===(dia===10?'noel':'jeanluc'));
      ex.indice=i-1;window.portaria.painel.acoes.chamar();return ex.fila[i].id;
    },dia);
    await p.locator('.pt-balao.show').waitFor({timeout:45000});
    if(dia===7) {
      await foto('distintivo');
      await p.locator('.pt-balao.show').click();
      await p.waitForFunction(()=>window.portaria.painel.vista==='visitante' && window.portaria.painel.falando);
    }
    if(dia!==10)await foto('chegada');
    async function livre(){await p.waitForFunction(()=>{document.querySelector('.pt-balao.show')?.click();return !window.portaria.ocupado()&&!window.portaria.painel.falando;},null,{timeout:50000});}
    await livre();
    await p.evaluate(()=>window.portaria.painel.mudarVista('visitante'));
    await foto('comparacao');
    const carimbo=await p.evaluate(()=>window.portaria.conferir().carimbo);
    assert.equal(carimbo,[7,8,9].includes(dia)?'hojeNao':'entra');
    await p.evaluate(c=>window.portaria.painel.acoes.carimbar(c),dia===7&&desfecho!=='recusou'?'entra':carimbo);
    await p.locator('.pt-balao.show').waitFor({timeout:35000});
    await foto('carimbo');
    if(dia===7 && desfecho!=='recusou'){
      const hora=await p.evaluate(()=>window.portaria.ex.hora);
      await p.waitForFunction(()=>{document.querySelector('.pt-balao.show')?.click();return document.querySelector('.pt-corrida')?.dataset.etapa==='aviso';});
      await foto('flagrante');
      await p.waitForFunction(()=>{document.querySelector('.dialogue.show')?.click();return document.querySelector('.pt-corrida')?.dataset.etapa==='corrida';});
      assert.ok(await p.evaluate(()=>!window.jogo.camOmbro && !window.jogo.player.riding && !window.jogo.player.locked));
      await foto('corrida');
      if(desfecho==='recuperou'){
        await p.keyboard.down('s');await p.keyboard.down('d');
        const espantar=p.getByRole('button',{name:'💧 Espantar',exact:true});
        await espantar.waitFor({timeout:9000});await p.keyboard.up('s');await p.keyboard.up('d');
        const movimento = await espantar.locator('strong').evaluate(el=>getComputedStyle(el).animationName);
        assert.equal(movimento,process.env.ANIMACOES?'pt-espantar-alcance':'none');
        if(process.env.ANIMACOES){
          const pausadas=await p.evaluateHandle(()=>{
            const w=window.jogo.current.world, atualizar=w.updaters;
            w.updaters=[];
            for(const anim of document.querySelector('.pt-corrida button').getAnimations({subtree:true})){
              anim.pause();anim.currentTime=180;
            }
            return atualizar;
          });
          await foto('espantar');await p.evaluate(fns=>{window.jogo.current.world.updaters=fns;},pausadas);
          await pausadas.dispose();
        }
        if(process.env.PC)await p.keyboard.press('e');else await espantar.tap();
        await p.waitForFunction(()=>document.querySelector('.pt-corrida')?.dataset.etapa==='banho');
        await p.waitForTimeout(440);await foto('mangueirada');
      }
      await p.waitForFunction(()=>!document.querySelector('.pt-corrida'),null,{timeout:35000});
      assert.equal(await p.evaluate(()=>window.portaria.ex.atendimentos.at(-1).poteRecuperado),desfecho==='recuperou');
      assert.equal(await p.evaluate(()=>window.portaria.ex.hora),hora);
      assert.ok(await p.evaluate(()=>window.jogo.player.riding && window.jogo.player.locked && !!window.jogo.camOmbro));
    }
    await livre();
    if(dia===7){
      assert.equal(await p.locator('.pt-corrida').count(),0);
      const antes=await p.evaluate(()=>window.portaria.ex.indice);
      await p.evaluate(()=>window.portaria.painel.acoes.chamar());await livre();
      assert.equal(await p.evaluate(()=>window.portaria.ex.indice),antes+1);
    }
    assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
    console.log('Dia',dia,id,carimbo,'OK');await p.close();
  }
  assert.deepEqual(erros,[]);
}finally{await browser.close();}
