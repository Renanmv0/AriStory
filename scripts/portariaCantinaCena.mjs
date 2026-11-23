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
  for(const dia of (process.env.DIAS || '7,8,9,10,11,12').split(',').map(Number)){
    const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    p.on('pageerror',e=>{erros.push(e.message);console.error(e.message);});
    await p.goto(base+'/?portaria&cena=portaria&dia='+dia+'&depressa&semente=7');
    await p.waitForFunction(()=>window.portaria?.ex);
    const foto=async(nome)=>{
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
    if(dia===7){await p.locator('.pt-jardim').waitFor();await foto('treino');await molhar();}
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
    await p.evaluate(c=>window.portaria.painel.acoes.carimbar(c),dia===7?'entra':carimbo);
    await p.locator('.pt-balao.show').waitFor({timeout:35000});
    await foto('carimbo');
    if(dia===7){
      await p.waitForFunction(()=>{document.querySelector('.pt-balao.show')?.click();return !!document.querySelector('.pt-jardim');});
      await foto('ocorrencia');await molhar();
      assert.equal(await p.evaluate(()=>window.portaria.ex.atendimentos.at(-1).poteRecuperado),true);
    }
    await livre();assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
    console.log('Dia',dia,id,carimbo,'OK');await p.close();
  }
  assert.deepEqual(erros,[]);
}finally{await browser.close();}
