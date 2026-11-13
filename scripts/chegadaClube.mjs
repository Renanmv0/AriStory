/** Entrada do clube: cenas da cancela e da manobra, motorista e controle preservados. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use o preview isolado.');
const OUT=process.argv[2]??'/tmp/chegada-clube';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[],espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:120000});
async function desenho(p,normal){await p.evaluate(normal=>{const r=window.jogo.renderer;window.renderNormal??=r.render.bind(r);r.render=normal?window.renderNormal:(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};},normal);}
async function foto(p,nome){
 const ritmo=await p.evaluate(()=>{const r=window.aristoryBebitoMobile.ritmoDoPresente,v=r.vezes;r.vezes=0;return v;});
 await desenho(p,true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});
 await desenho(p,false);await p.evaluate(v=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=v;},ritmo);
}
async function preparar(p,motorista,controle,parque=false){
 await p.goto(`${BASE}/?bebito&semHalloween&cena=casa`);await espera(p,()=>!!window.jogo?.current&&!window.jogo.transitioning);await desenho(p,false);
 await p.evaluate(({motorista,controle,parque})=>{const g=window.jogo,b=window.aristoryBebitoMobile;for(const f of ['bebito:surpresa','bebito:renan-saiu','bebito:ganhou'])g.setFlag(f);if(g.playerId()!==controle)g.swapCharacters();b.pedirViagem({sentido:parque?'ida':'parque-clube',motorista,semente:7});g.goTo('viagem-de-carro');},{motorista,controle,parque});
 await espera(p,()=>window.jogo.idDaCena==='viagem-de-carro'&&!window.jogo.transitioning);
 await p.evaluate(()=>{const v=window.aristoryBebitoMobile.viagem;v.estado.fase='chegando';v.estado.s=v.rota.chegada-.05;v.estado.v=0;});
 const inicio=Date.now();
 while(Date.now()-inicio<90000){
  if(await p.evaluate(()=>window.jogo.idDaCena!=='viagem-de-carro'))break;
  await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});await p.waitForTimeout(80);
 }
 await espera(p,()=>!!window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada);
 await p.evaluate(()=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=0;});
 await espera(p,()=>!window.jogo.transitioning&&window.jogo.player.riding);
}
async function instrumentar(p){
 await p.evaluate(()=>{
  window.chegadaTeste={fases:[],trechos:[],colisoes:[],atravessouFechada:false};
  const g=window.jogo,w=g.current.world,c=g.scene.getObjectByName('bebito-mobile'),m=window.aristoryBebitoMobile.BEBITO_MOBILE;
  const sobrepoe=(b)=>{const t=c.rotation.y,ux=[Math.cos(t),-Math.sin(t)],uz=[Math.sin(t),Math.cos(t)],dx=b.x-c.position.x,dz=b.z-c.position.z;return[ux,uz,[1,0],[0,1]].every(([ax,az])=>Math.abs(dx*ax+dz*az)<(m.largura/2-.04)*Math.abs(ux[0]*ax+ux[1]*az)+(m.comprimento/2-.08)*Math.abs(uz[0]*ax+uz[1]*az)+b.hw*Math.abs(ax)+b.hd*Math.abs(az)-.02);};
  w.onUpdate(()=>{
   const e=c.userData.chegada,r=window.chegadaTeste,est=w.root.userData.estacionamentoDoClube;
   if(!r.fases.includes(e.fase))r.fases.push(e.fase);if(!r.trechos.includes(e.trecho))r.trechos.push(e.trecho);
   if(e.fase==='concluida'||e.fase==='descendo'||e.fase==='devolvendo')return;
   if(e.trecho===1&&e.progresso>.1&&est.cancela.abertura<.99)r.atravessouFechada=true;
   for(const b of w.colliders){
    if(b.kind!=='box'||(Math.abs(b.x+58.2)<.01&&Math.abs(b.z-3)<.01))continue;
    const carroOuMuro=(b.hw>=1&&b.hw<4&&b.hd>=.8&&b.hd<5)||b.hw>8||b.hd>10||b===est.barreira;
    if(carroOuMuro&&sobrepoe(b)&&r.colisoes.length<5)r.colisoes.push({fase:e.fase,trecho:e.trecho,x:c.position.x,z:c.position.z,colisor:b});
   }
  });
 });
}
try{
 for(const mobile of [false,true])for(const motorista of ['ari','renan']){
  const controle=mobile?motorista:(motorista==='ari'?'renan':'ari');
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1200,height:850},hasTouch:mobile,isMobile:mobile}),p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
  await preparar(p,motorista,controle);
  await instrumentar(p);
  const nome=mobile?'celular':'computador',fotos=motorista==='ari';
  assert.equal(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase),'apresentando');
  if(fotos)await foto(p,nome+'-apresentacao');
  await p.evaluate(()=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=3;});
  await espera(p,()=>{const w=window.jogo.current.world,c=window.jogo.scene.getObjectByName('bebito-mobile');return c.userData.chegada.fase==='abrindo'&&w.root.userData.estacionamentoDoClube.cancela.abertura>.15;});
  if(fotos)await foto(p,nome+'-cancela');
  await espera(p,()=>{const e=window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada;return e.trecho===4&&e.progresso>.3;});
  if(fotos)await foto(p,nome+'-manobra');
  await espera(p,()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase==='concluida');
  const fim=await p.evaluate(()=>{const g=window.jogo,c=g.scene.getObjectByName('bebito-mobile');return{...window.chegadaTeste,motorista:c.userData.chegada.motorista,x:c.position.x,z:c.position.z,giro:c.rotation.y,livre:!g.player.locked&&!g.player.riding&&!g.parceiro.riding,cameraLivre:g.camOmbro===null,interagir:g.current.world.interactables.find(i=>i.id==='clube:bebito-mobile').enabled};});
  assert.equal(fim.motorista,motorista);assert.ok(fim.livre&&fim.cameraLivre&&fim.interagir);assert.ok(Math.abs(fim.x+58.2)<.01&&Math.abs(fim.z-3)<.01&&Math.abs(fim.giro+Math.PI/2)<.01);
  for(const fase of ['apresentando','aproximando','abrindo','entrando','estacionando','estacionado','descendo','devolvendo','concluida'])assert.ok(fim.fases.includes(fase),fase);
  assert.deepEqual(fim.trechos,[0,1,2,3,4]);assert.equal(fim.atravessouFechada,false);assert.deepEqual(fim.colisoes,[]);
  if(fotos)await foto(p,nome+'-na-vaga');console.log(nome,motorista,'todas as fases, caminho, cancela e controle passaram');
  // Depois da animação, recarregar conserva o carro e não reproduz a cena.
  await p.goto(`${BASE}/?bebito&semHalloween`);await espera(p,()=>window.jogo?.idDaCena==='clube'&&!window.jogo.transitioning);await desenho(p,false);
  assert.equal(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada),undefined);
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);await ctx.close();
 }
 // A configuração padrão do parque continua sem a apresentação exclusiva do clube.
 const ctx=await browser.newContext({viewport:{width:1000,height:760}}),p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));await preparar(p,'renan','ari',true);
 assert.notEqual(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase),'apresentando');
 await p.evaluate(()=>{window.aristoryBebitoMobile.ritmoDoPresente.vezes=4;});await espera(p,()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase==='concluida');
 assert.equal(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.motorista),'renan');await ctx.close();
 assert.deepEqual(erros,[]);console.log('Clube em computador/celular e chegada do parque validados sem erros.');
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){console.log('falha',await p.evaluate(()=>({cena:window.jogo?.idDaCena,chegada:window.jogo?.scene.getObjectByName('bebito-mobile')?.userData.chegada,teste:window.chegadaTeste})).catch(()=>null));await desenho(p,true).catch(()=>{});await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await browser.close();}
