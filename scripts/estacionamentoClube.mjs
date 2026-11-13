/** Estacionamento do clube: fotos e acessos reais, sem antecipar a viagem. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use o preview isolado.');
const OUT=process.argv[2]??'/tmp/estacionamento-clube';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
const espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:90000});
async function desenho(p,ligar){await p.evaluate(ligar=>{const r=window.jogo.renderer;window.renderNormal??=r.render.bind(r);r.render=ligar?window.renderNormal:(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};},ligar);}
async function foto(p,nome,x,z,zoom){
 await p.evaluate(({x,z,zoom})=>{const g=window.jogo,alvo=new g.player.object.constructor();alvo.position.set(x,.5-Math.max(0,zoom-14)*.38,z);g.focusCamera(alvo);g.setZoom(zoom);g.iso.snapTo(alvo.position);},{x,z,zoom});
 await desenho(p,true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await p.screenshot({path:`${OUT}-${nome}.png`});
 const peso=await p.evaluate(()=>({...window.jogo.renderer.info.render}));
 console.log(nome,'desenhos/triângulos',peso.calls,peso.triangles);
 await desenho(p,false);await p.evaluate(()=>window.jogo.focusCamera(null));
}
async function andar(p,eixo,ate){
 const agora=await p.evaluate(e=>window.jogo.player.position[e],eixo),positivo=ate>agora;
 const teclas=eixo==='x'?(positivo?['KeyS','KeyD']:['KeyW','KeyA']):(positivo?['KeyA','KeyS']:['KeyW','KeyD']);
 for(const k of teclas)await p.keyboard.down(k);
 // Solta as duas teclas no mesmo quadro antes da inércia; o transporte CDP
 // pode atrasar um keyup e criar uma diagonal que o jogador não comandou.
 try{await p.evaluate(({eixo,ate,positivo,teclas})=>new Promise((resolve,reject)=>{
   const limite=performance.now()+90000,parar=ate-(positivo ? 0.45 : -0.45);
   const soltar=()=>teclas.forEach(code=>window.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true})));
   const verificar=()=>{const v=window.jogo.player.position[eixo];if(positivo?v>=parar:v<=parar){soltar();resolve();}else if(performance.now()>limite){soltar();reject(Error('Caminho bloqueado em '+eixo+': '+v));}else requestAnimationFrame(verificar);};verificar();
 }),{eixo,ate,positivo,teclas});}
 finally{for(const k of teclas)await p.keyboard.up(k);}
 await espera(p,()=>window.jogo.player.velocity.lengthSq()<.0001);
}
try{
 const ctx=await browser.newContext({viewport:{width:1200,height:900}}),p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(`${BASE}/?bebito&semHalloween&cena=clube`);await espera(p,()=>!!window.jogo?.current?.world.root.userData.estacionamentoDoClube);
 await desenho(p,false);
 const inicial=await p.evaluate(()=>{const g=window.jogo,w=g.current.world;return{limite:w.bounds.minX,onibus:w.colliders.some(c=>c.kind==='box'&&c.x===-31.9&&c.z===9),saida:w.interactables.some(i=>i.id==='door:villa-lobos:clube'),vaga:w.root.userData.estacionamentoDoClube.vaga,cena:g.idDaCena};});
 assert.ok(inicial.limite<-62);assert.ok(inicial.onibus&&inicial.saida);assert.equal(inicial.cena,'clube');assert.equal(inicial.vaga.x,-58.2);
 await p.evaluate(()=>window.jogo.debugPlace(-57.4,7,Math.PI/2));
 await foto(p,'computador-geral',-43,3,40);
 await foto(p,'computador-vagas',-52,1.8,29);
 // A pé: vaga → passagem → faixa fora do ônibus → portão → interior do clube.
 await andar(p,'x',-39);await andar(p,'z',1.8);await andar(p,'x',-27.4);await andar(p,'z',7);await andar(p,'x',-21.5);
 assert.equal(await p.evaluate(()=>window.jogo.idDaCena),'clube');
 const ida=await p.evaluate(()=>({x:window.jogo.player.position.x,z:window.jogo.player.position.z,par:window.jogo.companionPosition().toArray()}));
 assert.ok(ida.x>-24.5);assert.ok(Math.abs(ida.z-7)<1);console.log('Caminhada até a portaria:',ida);
 // Volta pelo mesmo acesso, sem teleporte entre os segmentos.
 await andar(p,'x',-27.4);await andar(p,'z',1.8);await andar(p,'x',-39);await andar(p,'z',7);await andar(p,'x',-57.4);
 assert.ok(await p.evaluate(()=>window.jogo.player.position.x)<-57);console.log('Volta da portaria até a vaga passou.');
 // A cancela abre e remove o bloqueio físico, e volta a fechar quando os dois saem.
 await p.evaluate(()=>window.jogo.debugPlace(-45,12.5,Math.PI/2));
 await espera(p,()=>window.jogo.current.world.root.userData.estacionamentoDoClube.cancela.abertura>.95);
 assert.equal(await p.evaluate(()=>{const w=window.jogo.current.world;return w.colliders.includes(w.root.userData.estacionamentoDoClube.barreira);}),false);
 await andar(p,'x',-38.5);
 await foto(p,'computador-entrada',-42,11,17);
 await p.evaluate(()=>window.jogo.debugPlace(-52,-3,0));
 await espera(p,()=>window.jogo.current.world.root.userData.estacionamentoDoClube.cancela.abertura<.01);
 assert.equal(await p.evaluate(()=>{const w=window.jogo.current.world;return w.colliders.includes(w.root.userData.estacionamentoDoClube.barreira);}),true);
 assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
 console.log('Cancela, barreira física, ônibus e save isolado passaram.');
 await ctx.close();
 const cel=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),m=await cel.newPage();m.on('pageerror',e=>erros.push(e.message));
 await m.goto(`${BASE}/?bebito&semHalloween&cena=clube&entrada=do-estacionamento`);await espera(m,()=>!!window.jogo?.current?.world.root.userData.estacionamentoDoClube);
 await desenho(m,false);
 assert.ok(await m.evaluate(()=>window.jogo.player.position.x)<-55);
 await foto(m,'celular-vaga',-56.5,4.5,16);
 await m.evaluate(()=>window.jogo.debugPlace(-39,7,-Math.PI/2));
 await foto(m,'celular-acesso',-41.2,8,19);
 assert.equal(await m.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
 await cel.close();assert.deepEqual(erros,[]);console.log('Estacionamento validado sem erros de página.');
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){console.log('falha',await p.evaluate(()=>({cena:window.jogo?.idDaCena,pos:window.jogo?.player?.position?.toArray(),dialogo:document.querySelector('.dialogue.show')?.textContent})).catch(()=>null));await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await browser.close();}
