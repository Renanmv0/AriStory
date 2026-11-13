/** Regressão: câmera/menu do passageiro sem trocar motorista, para os quatro pares de jogador/motorista. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4175';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use o preview isolado.');
const OUT=process.argv[2]??'/tmp/motorista';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
const espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:360000});
async function menu(p){for(let i=0;i<200;i++){if(await p.locator('.escolhas.show button').count())return;await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});await p.waitForTimeout(100);}throw Error('Menu não voltou');}
// No modo rápido só as capturas usam GPU; a simulação e as matrizes seguem normais.
async function desenhar(p,ativo){if(!process.env.RAPIDO)return;await p.evaluate(ativo=>{const r=window.jogo.renderer;window.desenhoNormalDoTeste??=r.render.bind(r);r.render=ativo?window.desenhoNormalDoTeste:(cena,camera)=>{cena.updateMatrixWorld();camera.updateMatrixWorld();};},ativo);}
async function foto(p,path){await desenhar(p,true);await p.evaluate(()=>window.jogo.renderer.setPixelRatio(1));await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path});await p.evaluate(()=>window.jogo.renderer.setPixelRatio(0.6));await desenhar(p,false);}
async function conferir(p,controle,motorista,dentro){
 const e=await p.evaluate(()=>{const g=window.jogo,c=window.aristoryBebitoMobile.viagem.passageiro.camera;return{jogador:g.playerId(),motorista:g.player.rig.noCarro==='dirigindo'?g.playerId():g.companionId(),poses:[g.player.rig.noCarro,g.parceiro.rig.noCarro],quem:c.quem,dist:g.camOmbro?.position.distanceTo(g.cabecaDe(c.quem)),cabecas:[g.player.rig.head.visible,g.parceiro.rig.head.visible]};});
 const quem=controle===motorista?'parceiro':'jogador';
 assert.equal(e.jogador,controle);assert.equal(e.motorista,motorista);assert.equal(e.quem,quem);
 assert.deepEqual(e.poses,controle===motorista?['dirigindo','passageiro']:['passageiro','dirigindo']);
 if(dentro){assert.ok(e.dist<0.8, `câmera distante do passageiro: ${e.dist}`);assert.deepEqual(e.cabecas,quem==='jogador'?[false,true]:[true,false]);}else assert.deepEqual(e.cabecas,[true,true]);
}
try{
 for(const controle of ['ari','renan'])for(const motorista of ['ari','renan']){
  const passageiro=motorista==='ari'?'Renan':'Ari',nomeMotorista=motorista==='ari'?'Ari':'Renan';
  const mobile=controle==='renan';
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1200,height:800},isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
  await p.goto(`${BASE}/?bebito&carroPorDentro&cena=casa`);await espera(p,()=>!!window.jogo?.current);await desenhar(p,false);
  await p.evaluate(({controle,motorista})=>{const g=window.jogo,b=window.aristoryBebitoMobile;for(const f of ['bebito:surpresa','bebito:renan-saiu','bebito:ganhou'])g.setFlag(f);if(g.playerId()!==controle)g.swapCharacters();g.renderer.setPixelRatio(0.6);b.ritmoDoPresente.vezes=5;b.pedirViagem({sentido:'ida',motorista,semente:3});g.goTo('viagem-de-carro');},{controle,motorista});
  await espera(p,()=>window.jogo.idDaCena==='viagem-de-carro'&&window.aristoryBebitoMobile.viagem.estado.fase==='dirigindo');
  console.log(`${controle} controlado, ${motorista} dirigindo: início`);
  await conferir(p,controle,motorista,false);
  await p.locator('.botao-da-viagem').click();await espera(p,()=>window.aristoryBebitoMobile.viagem.passageiro.camera.dentro===1);
  await conferir(p,controle,motorista,true);
  await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await p.keyboard.down('KeyE');await espera(p,()=>document.querySelectorAll('.escolhas.show button').length>0);await p.keyboard.up('KeyE');
  assert.equal(await p.locator('.dialogue.show .who').textContent(),passageiro);
  const opcoes=await p.locator('.escolhas.show button').allTextContents();
  assert.equal(opcoes[0],passageiro==='Renan'?'Jogar Brawl Stars no celular':'Cantarolar Danza Kuduro');
  assert.equal(opcoes[2],`Encostar no ombro de ${nomeMotorista}`);
  await p.getByRole('button',{name:opcoes[0],exact:true}).click();
  await espera(p,n=>document.querySelector('.dialogue.show .who')?.textContent===n,passageiro);
  if(passageiro==='Renan'){
   for(let i=0;i<100;i++){if(await p.evaluate(()=>window.aristoryBebitoMobile.viagem.passageiro.celular.group.visible))break;await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});await p.waitForTimeout(100);}
   await espera(p,()=>window.aristoryBebitoMobile.viagem.passageiro.celular.group.visible);
   await p.evaluate(()=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=0;});
  }else await espera(p,()=>document.querySelector('.dialogue.show .text')?.textContent.includes('Danza Kuduro'));
  await foto(p,`${OUT}-${controle}-${motorista}-interacao.png`);
  await p.evaluate(()=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=5;});
  await menu(p);await conferir(p,controle,motorista,true);
  await p.getByRole('button',{name:`Encostar no ombro de ${nomeMotorista}`,exact:true}).click();
  await espera(p,()=>window.aristoryBebitoMobile.viagem.passageiro.camera.especial===1&&window.jogo.emDialogo());
  const gesto=await p.evaluate(()=>{const g=window.jogo,c=window.aristoryBebitoMobile.viagem.passageiro.camera;const carona=c.quem==='jogador'?g.player:g.parceiro,piloto=c.quem==='jogador'?g.parceiro:g.player;return{carona:carona.rig.body.rotation.z,piloto:piloto.rig.body.rotation.z,pose:piloto.rig.noCarro,cabecas:g.player.rig.head.visible&&g.parceiro.rig.head.visible};});
  assert.ok(gesto.carona<-.2&&Math.abs(gesto.piloto)<.01&&gesto.cabecas);assert.equal(gesto.pose,'dirigindo');
  if(controle==='ari')await foto(p,`${OUT}-${controle}-${motorista}-carinho.png`);
  await menu(p);await espera(p,()=>window.aristoryBebitoMobile.viagem.passageiro.camera.especial===0);
  await p.getByRole('button',{name:'Só olhar a paisagem',exact:true}).click();
  await p.locator('.botao-da-viagem').click();await espera(p,()=>window.aristoryBebitoMobile.viagem.estado.visao==='fora');
  await conferir(p,controle,motorista,false);
  await p.keyboard.press('KeyV');await espera(p,()=>window.aristoryBebitoMobile.viagem.passageiro.camera.dentro===1&&window.aristoryBebitoMobile.viagem.estado.visao==='dentro');
  await conferir(p,controle,motorista,true);
  console.log(`${controle}/${motorista}: câmera, menu de ${passageiro}, fala, gesto e retorno corretos`);
  if(controle==='ari'){
   await p.evaluate(()=>{const b=window.aristoryBebitoMobile;b.ritmoDoPresente.vezes=10;b.viagem.estado.s=b.viagem.rota.chegada+2;b.viagem.estado.v=0;b.viagem.estado.fase='fim';});
   for(let i=0;i<200;i++){if(await p.evaluate(()=>window.jogo.idDaCena==='villa-lobos'))break;await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});await p.waitForTimeout(100);}
   await espera(p,()=>window.jogo.idDaCena==='villa-lobos'&&window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada);
   assert.equal(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.motorista),motorista);
   await espera(p,()=>window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada?.fase==='concluida'&&!window.jogo.player.locked);
   assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
   console.log(`${controle}/${motorista}: chegada preservou o motorista e devolveu o controle`);
  }
  await ctx.close();
 }
 assert.deepEqual(erros,[]);console.log('Os quatro pares passaram, sem erros de página.');
}catch(e){for(const ctx of browser.contexts())for(const p of ctx.pages()){console.log('falha:',await p.evaluate(()=>({cena:window.jogo?.idDaCena,fala:document.querySelector('.dialogue.show')?.textContent})).catch(()=>null));await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await browser.close();}
