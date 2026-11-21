/** Peças premiadas no jogo: pais do rig, caminhada, banco e guarda-roupa real. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4210',OUT=process.argv[2]??'/tmp/premios-roupas';
if(!['localhost','127.0.0.1'].includes(new URL(BASE).hostname))throw Error('Use preview local.');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const p=await browser.newPage({viewport:{width:1100,height:850}}),erros=[];
p.on('pageerror',e=>erros.push(e.message));
async function pausa(){await p.evaluate(()=>{const r=window.jogo.renderer;r.originalDoTeste??=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});}
async function foto(nome){await p.evaluate(()=>window.jogo.renderer.render=window.jogo.renderer.originalDoTeste);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await pausa();}
async function vestir(ids){await p.evaluate(ids=>{const g=window.jogo;for(const quem of ['ari','renan'])g.vestirConjunto(ids.map(id=>window.aristoryItens[id]),quem);},ids);await p.waitForFunction(ids=>[window.jogo.player,window.jogo.parceiro].every(q=>{const vistos=new Set();q.rig.group.traverse(o=>{if(o.userData.roupa)vistos.add(o.userData.roupa);});return ids.every(id=>vistos.has(id));}),ids);}
const roupas=['quepe-da-portaria','camisa-da-portaria','calca-da-portaria','tenis-da-portaria','pulseira-vip-da-portaria','apito-da-portaria'];
try{
 await p.addInitScript(()=>{if(!sessionStorage.getItem('fixture')){const stats={};for(let n=1;n<=6;n++)stats[`portaria:dia:${n}:estrelas`]=3;localStorage.setItem('aristory.save.v1.portaria',JSON.stringify({version:1,stats,flags:{},memories:[]}));sessionStorage.setItem('fixture','1');}});
 await p.goto(BASE+'/?portaria&cena=villa-lobos&em=-4.2,15.6&olhar=0.7&semHalloween&semFundir',{waitUntil:'networkidle'});
 await p.waitForFunction(()=>window.jogo?.current&&!window.jogo.transitioning);await pausa();
 // Marca antiga de três estrelas recebe as peças também sem voltar à guarita.
 await p.evaluate(()=>window.jogo.abrirGuardaRoupa());
 for(const quem of ['ari','renan'])assert.equal(await p.evaluate(quem=>window.jogo.wardrobeItems(quem).filter(i=>i.id.endsWith('-da-portaria')).length,quem),8);
 await p.keyboard.press('Escape');await vestir(roupas);
 const onde=await p.evaluate(()=>[window.jogo.player,window.jogo.parceiro].map(q=>{const r=q.rig,pais={};r.group.traverse(o=>{if(!o.userData.roupa)return;const t=o.parent===r.head?'cabeca':o.parent===r.body?'corpo':[r.armL,r.armR].includes(o.parent)?'braco':[r.legL,r.legR].includes(o.parent)?'perna':'outro';(pais[o.userData.roupa]??=[]).push(t);});return{pais,pes:r.pes.map(p=>p.visible),maos:window.jogo.handItems(r.spec.id).map(i=>i?.id)};}));
 for(const q of onde){for(const [id,pai]of Object.entries({'quepe-da-portaria':'cabeca','camisa-da-portaria':'corpo','calca-da-portaria':'perna','tenis-da-portaria':'perna','pulseira-vip-da-portaria':'braco','apito-da-portaria':'corpo'}))assert.ok(q.pais[id].includes(pai),id);assert.ok(q.pais['camisa-da-portaria'].includes('braco'));assert.ok(q.pais['calca-da-portaria'].includes('corpo'));assert.deepEqual(q.pes,[false,false]);assert.ok(!q.maos.some(id=>roupas.includes(id)));}
 console.log('✓ seis vagas, mangas, quadril, pés substituídos e mochila sem roupa');
 await p.evaluate(()=>{window.jogo.debugPlace(-4.2,15.6,.7);window.jogo.setZoom(1.2);});await foto('frente');
 await p.evaluate(()=>window.jogo.debugPlace(-4.2,15.6,-2.4));await foto('costas');
 const antes=await p.evaluate(()=>window.jogo.playerPosition().toArray());await p.keyboard.down('KeyD');
 await p.waitForFunction(antes=>{const p=window.jogo.playerPosition();return Math.hypot(p.x-antes[0],p.z-antes[2])>.7;},antes);await foto('andando');await p.keyboard.up('KeyD');console.log('✓ uniforme andando no mundo');
 await p.evaluate(()=>{window.jogo.debugPlace(-4.2,15.6,Math.PI);window.jogo.setZoom(1.2);});await p.keyboard.press('KeyE');
 for(let i=0;i<25&&!await p.locator('.escolhas button').count();i++){await p.keyboard.press('KeyE');await p.waitForTimeout(100);}
 await p.waitForFunction(()=>window.jogo.player.rig.sitting&&window.jogo.parceiro.rig.sitting,undefined,{timeout:30000});
 const ocultar=await p.addStyleTag({content:'.dialogue{visibility:hidden}'});await foto('sentados');await ocultar.evaluate(el=>el.remove());console.log('✓ calças e tênis sentados no banco, nos dois');
 for(let i=0;i<30;i++){if(await p.locator('.escolhas button').count())await p.locator('.escolhas button').last().click();else if(await p.locator('.dialogue.show').count())await p.keyboard.press('KeyE');else break;await p.waitForTimeout(100);}
 await p.waitForFunction(()=>!window.jogo.player.rig.sitting);
 for(const quem of ['ari','renan']){
  if(await p.evaluate(()=>window.jogo.playerId())!==quem)await p.evaluate(()=>window.jogo.swapCharacters());
  await p.evaluate(()=>window.jogo.abrirGuardaRoupa());await foto(`armario-${quem}`);await p.evaluate(()=>window.jogo.previa.girar(Math.PI));await p.waitForFunction(()=>Math.abs(window.jogo.previa.giro-window.jogo.previa.alvo)<.01);await foto(`armario-${quem}-costas`);await p.keyboard.press('Escape');
 }
 console.log('✓ prova do guarda-roupa real de frente e costas');
 await vestir(['quepe-da-portaria','colete-da-portaria','cracha-da-portaria','pulseira-vip-da-portaria']);await foto('colete-cracha');
 await p.reload({waitUntil:'networkidle'});await p.waitForFunction(()=>window.jogo?.current&&!window.jogo.transitioning);await pausa();
 for(const quem of ['ari','renan']){const estado=await p.evaluate(quem=>({vestindo:window.jogo.wearables(quem).map(i=>i?.id),armario:window.jogo.wardrobeItems(quem).map(i=>i.id)}),quem);assert.ok(estado.vestindo.includes('cracha-da-portaria'));assert.ok(estado.armario.includes('camisa-da-portaria'));}
 assert.deepEqual(erros,[]);console.log('✓ peças equipadas e guardadas sobrevivem ao recarregar, sem erro de runtime');
}finally{await browser.close();}
