/** Rota do clube e encontro com o Noel; somente em preview com save isolado. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use o preview isolado.');
const OUT=process.argv[2]??'/tmp/viagem-clube';
const codigo=ts.transpileModule(await readFile(new URL('../src/eventos/bebitoMobile/rota.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {gerarRota}=await import('data:text/javascript;base64,'+Buffer.from(codigo).toString('base64'));
for(let seed=1;seed<=150;seed++)for(const sentido of ['ida','volta','parque-clube','clube-parque','casa-clube','clube-casa']){
 const r=gerarRota(seed,sentido);assert.deepEqual(r,gerarRota(seed,sentido));
 assert.ok(r.coracoes.every(c=>Math.abs(c.l)<=2.3&&c.s<r.chegada));
 if(r.encontro)assert.ok(r.eventos.every(e=>Math.abs(e.s-r.encontro.s)>120));
 if(sentido.includes('clube')){assert.equal(r.eventos.length,r.encontro?.personagem==='josefina'?6:7);assert.ok(r.eventos.some(e=>e.tipo==='onda-verde'));}
 else{assert.equal(r.comprimento,r.encontro?880:640);assert.equal(r.eventos.length,8);assert.equal(r.eventos.filter(e=>e.tipo==='travessia').length,2);}
}
console.log('900 rotas: determinismo, legado, encontros opcionais e espaço livre passaram.');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];const espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:120000});
async function desenho(p,ligado){await p.evaluate(ligado=>{const r=window.jogo.renderer;window.renderNormal??=r.render.bind(r);r.render=ligado?window.renderNormal:(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};},ligado);}
async function foto(p,nome){
 const vezes=await p.evaluate(()=>{const v=window.aristoryBebitoMobile.viagem,antes=v.vezes;v.vezes=0;return antes;});
 await desenho(p,true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});
 console.log('foto',nome,await p.evaluate(()=>({...window.jogo.renderer.info.render})));
 await desenho(p,false);await p.evaluate(v=>{window.aristoryBebitoMobile.viagem.vezes=v;},vezes);
}
async function avancar(p){await p.evaluate(()=>{if(!document.querySelector('.escolhas.show button'))document.querySelector('.dialogue.show')?.click();});}
async function ate(p,f,teto=150000){const inicio=Date.now();while(Date.now()-inicio<teto){if(await p.evaluate(f))return;await avancar(p);await p.waitForTimeout(70);}throw Error('Estado esperado não chegou');}
async function escolher(p,n){await p.getByRole('button',{name:n,exact:true}).click({timeout:30000});}
async function mudarCena(p,cena,entrada){await espera(p,()=>!window.jogo.transitioning);await p.evaluate(({cena,entrada})=>window.jogo.goTo(cena,entrada),{cena,entrada});await espera(p,c=>window.jogo.idDaCena===c&&!window.jogo.transitioning,cena);}
async function pose(p,motorista){const d=await p.evaluate(()=>{const g=window.jogo;return{motorista:g.player.rig.noCarro==='dirigindo'?g.playerId():g.companionId(),poses:[g.player.rig.noCarro,g.parceiro.rig.noCarro]};});assert.equal(d.motorista,motorista);assert.ok(d.poses.includes('dirigindo')&&d.poses.includes('passageiro'));}
async function percorrer(p,sentido,motorista,prefixo){
 await espera(p,()=>window.jogo?.idDaCena==='viagem-de-carro'&&!window.jogo.transitioning&&window.jogo.current.world.root.userData.novidadesDaViagem);
 await desenho(p,false);await p.evaluate(()=>{window.aristoryBebitoMobile.viagem.vezes=5;window.aristoryBebitoMobile.viagem.piloto='bom';window.aristoryBebitoMobile.ritmoDoPresente.vezes=5;});
 assert.equal(await p.evaluate(()=>window.aristoryBebitoMobile.viagem.rota.sentido),sentido);await pose(p,motorista);
 const fotos=new Set();let interna=false,passouNoel=false,resumo,primeiraFala=false,ultimoNoel=-Infinity;
 const inicio=Date.now();
 while(Date.now()-inicio<240000){
  const e=await p.evaluate(()=>{const g=window.jogo,v=window.aristoryBebitoMobile.viagem,n=g.current.world.root.userData.novidadesDaViagem?.noel;return{cena:g.idDaCena,s:v.estado?.s,fase:v.estado?.fase,v:v.estado?.v,l:v.estado?.l,visao:v.estado?.visao,noel:n?{...n.estado}:null,vistos:{...v.estado?.vistos},tropecos:v.estado?.tropecos,sustos:v.estado?.sustos,coracoes:v.estado?.coracoes};});
  if(e.cena!=='viagem-de-carro'){resumo=e;break;}
  if(e.noel&&e.noel.fase!=='esperando'){assert.ok(e.noel.s>=ultimoNoel-.2,'o Noel segue para frente ao frear');ultimoNoel=e.noel.s;}
  if(!interna&&sentido==='parque-clube'&&e.s>320&&e.s<350){interna=true;await p.evaluate(()=>{void window.aristoryBebitoMobile.viagem.passageiro.trocar();});}
  if(prefixo&&e.s>270&&e.s<290&&!fotos.has('rega')){fotos.add('rega');await foto(p,prefixo+'-rega');}
  if(e.noel?.fase==='ultrapassando'&&e.noel.relativo>-8&&!fotos.has('ultrapassagem')){fotos.add('ultrapassagem');assert.ok(Math.abs(e.l-1.75)<.2);await pose(p,motorista);if(prefixo)await foto(p,prefixo+'-noel-ultrapassando');}
  if(e.noel?.fase==='falando'){
   assert.ok(e.v<.15&&Math.abs(e.l-1.75)<.2);
   if(!primeiraFala){primeiraFala=true;await espera(p,()=>document.querySelector('.dialogue.show')?.textContent.includes('GELO'));if(prefixo)await foto(p,prefixo+'-noel-conversa');await pose(p,motorista);}
  }
  if(e.noel?.fase==='feito'&&!passouNoel){passouNoel=true;await pose(p,motorista);console.log(sentido,'Noel terminou; motorista preservado.');}
  if(prefixo&&e.s>670&&e.s<690&&!fotos.has('onda')){fotos.add('onda');await foto(p,prefixo+'-onda-verde');}
  if(prefixo&&e.s>845&&e.s<860&&!fotos.has('paisagem')){fotos.add('paisagem');await foto(p,prefixo+'-paisagem');}
  await avancar(p);await p.waitForTimeout(50);
 }
 assert.ok(resumo,'a viagem chegou');assert.ok(passouNoel&&primeiraFala,'encontro inteiro aconteceu');
 console.log('viagem',sentido,resumo);assert.equal(resumo.tropecos,0);assert.equal(resumo.sustos,0);
 for(const tipo of ['lombada','travessia','rega','noel','obra','onda-verde','semaforo','poca'])assert.ok(resumo.vistos[tipo],tipo+' aconteceu');
 assert.ok(resumo.vistos['onda-aproveitada'],'piloto aproveitou a aceleração da onda verde');
 await espera(p,()=>window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada?.fase==='concluida');
 const chegada=await p.evaluate(()=>{const g=window.jogo,c=g.scene.getObjectByName('bebito-mobile');return{motorista:c.userData.chegada.motorista,x:c.position.x,z:c.position.z,livre:!g.player.locked&&!g.player.riding,clube:g.flag('bebito:carro-no-clube'),parque:g.flag('bebito:carro-no-parque')};});
 assert.equal(chegada.motorista,motorista);assert.ok(chegada.livre);assert.equal(chegada.clube,sentido==='parque-clube');assert.equal(chegada.parque,sentido==='clube-parque');
 if(sentido==='parque-clube'){assert.ok(Math.abs(chegada.x+58.2)<.1&&Math.abs(chegada.z-3)<.1);if(prefixo)await foto(p,prefixo+'-estacionado');}
 console.log('chegada',chegada);
}
try{
 const ctx=await browser.newContext({viewport:{width:1200,height:850}}),p=await ctx.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(`${BASE}/?bebito&semHalloween&cena=casa`);await espera(p,()=>!!window.jogo?.current);await desenho(p,false);
 await p.evaluate(()=>{const g=window.jogo;for(const f of ['bebito:surpresa','bebito:renan-saiu','bebito:ganhou','bebito:carro-no-parque'])g.setFlag(f);if(g.playerId()!=='renan')g.swapCharacters();g.goTo('villa-lobos','do-carro');});
 await espera(p,()=>window.jogo.current.world.interactables.some(i=>i.id==='parque:bebito-mobile'));
 await p.evaluate(()=>{void window.jogo.current.world.interactables.find(i=>i.id==='parque:bebito-mobile').trigger(window.jogo);});
 await escolher(p,'Clube');await escolher(p,'Ari');await ate(p,()=>window.jogo.idDaCena==='viagem-de-carro');
 // Recarregar a estrada conserva a escolha e não cria carro em outro lugar.
 await p.goto(`${BASE}/?bebito&semHalloween`);await espera(p,()=>window.jogo?.idDaCena==='viagem-de-carro'&&window.aristoryBebitoMobile?.viagem.rota);
 assert.equal(await p.evaluate(()=>window.aristoryBebitoMobile.viagem.rota.sentido),'parque-clube');
 await percorrer(p,'parque-clube','ari','computador');
 await p.goto(`${BASE}/?bebito&semHalloween`);await espera(p,()=>window.jogo?.idDaCena==='clube');await desenho(p,false);
 assert.equal(await p.evaluate(()=>window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada),undefined);
 await p.evaluate(()=>{void window.jogo.current.world.interactables.find(i=>i.id==='clube:bebito-mobile').trigger(window.jogo);});
 await p.evaluate(()=>{const g=window.jogo;g.bump('bebito:viagens',3-g.stat('bebito:viagens'));});await escolher(p,'Parque Villa Lobos');await escolher(p,'Renan');await ate(p,()=>window.jogo.idDaCena==='viagem-de-carro');
 await percorrer(p,'clube-parque','renan',null);
 // O carro não duplica na garagem nem no clube quando está no parque.
 await mudarCena(p,'frente-da-casa');assert.equal(await p.evaluate(()=>!!window.jogo.scene.getObjectByName('bebito-mobile')),false);
 await mudarCena(p,'clube');assert.equal(await p.evaluate(()=>!!window.jogo.scene.getObjectByName('bebito-mobile')),false);
 // A volta antiga do parque para casa continua funcionando depois do clube.
 await mudarCena(p,'villa-lobos','do-carro');
 await p.evaluate(()=>{void window.jogo.current.world.interactables.find(i=>i.id==='parque:bebito-mobile').trigger(window.jogo);});
 await escolher(p,'Casa do Ari');await escolher(p,'Renan');await ate(p,()=>window.jogo.idDaCena==='viagem-de-carro');
 await p.evaluate(()=>{window.aristoryBebitoMobile.viagem.vezes=4;window.aristoryBebitoMobile.viagem.piloto='bom';});
 await ate(p,()=>window.jogo.idDaCena==='frente-da-casa',180000);
 assert.ok(await p.evaluate(()=>!!window.jogo.scene.getObjectByName('bebito-mobile')));
 assert.equal(await p.evaluate(()=>window.jogo.flag('bebito:carro-no-clube')||window.jogo.flag('bebito:carro-no-parque')),false);
 console.log('Rota antiga de volta para casa e carro na garagem passaram.');
 assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);await ctx.close();
 // Celular: Noel vindo por trás, faixa automática contra o manche e conversa parada.
 const cel=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),m=await cel.newPage();m.on('pageerror',e=>erros.push(e.message));
 await m.goto(`${BASE}/?bebito&semHalloween&cena=viagem-de-carro&viagem=parque-clube,renan,1`);await espera(m,()=>window.jogo?.current.world.root.userData.novidadesDaViagem?.noel);await desenho(m,false);
 await m.evaluate(()=>{const v=window.aristoryBebitoMobile.viagem,n=window.jogo.current.world.root.userData.novidadesDaViagem.noel;v.estado.s=n.s-61;v.estado.l=-1.75;v.estado.v=14;v.vezes=2;});
 await m.keyboard.down('ArrowLeft');await espera(m,()=>window.jogo.current.world.root.userData.novidadesDaViagem.noel.estado.fase==='falando');await m.keyboard.up('ArrowLeft');
 await espera(m,()=>document.querySelector('.dialogue.show')?.textContent.includes('GELO'));await pose(m,'renan');await foto(m,'celular-noel-conversa');
 assert.ok(await m.evaluate(()=>Math.abs(window.aristoryBebitoMobile.viagem.estado.l-1.75)<.2));
 await ate(m,()=>window.jogo.current.world.root.userData.novidadesDaViagem.noel.estado.fase==='feito');
 await pose(m,'renan');
 // Sem acelerar, perde-se a onda verde, espera-se o vermelho e o caminho reabre.
 await m.evaluate(()=>{const v=window.aristoryBebitoMobile.viagem,o=window.jogo.current.world.root.userData.novidadesDaViagem.onda;v.estado.s=o.s-73;v.estado.v=9.5;v.estado.l=1.75;v.vezes=3;});
 await espera(m,()=>{const o=window.jogo.current.world.root.userData.novidadesDaViagem.onda,v=window.aristoryBebitoMobile.viagem.estado;return o.sinais[1].cor==='vermelho'&&v.v<.1;});
 assert.ok(await m.evaluate(()=>{const o=window.jogo.current.world.root.userData.novidadesDaViagem.onda;return window.aristoryBebitoMobile.viagem.estado.s+2.6<=o.s+28-3.4+.2;}));
 await espera(m,()=>{const o=window.jogo.current.world.root.userData.novidadesDaViagem.onda;return window.aristoryBebitoMobile.viagem.estado.s>o.s+33;});
 assert.equal(await m.evaluate(()=>window.jogo.current.world.root.userData.novidadesDaViagem.onda.verdeAproveitado),false);
 console.log('Onda verde perdida: parou no vermelho e seguiu após abrir.');
 assert.equal(await m.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);await cel.close();
 assert.deepEqual(erros,[]);console.log('Ida, volta, recarga, motoristas e celular passaram sem erros de página.');
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){console.log('falha',await p.evaluate(()=>({cena:window.jogo?.idDaCena,estado:window.aristoryBebitoMobile?.viagem.estado,noel:window.jogo?.current?.world.root.userData.novidadesDaViagem?.noel?.estado,dialogo:document.querySelector('.dialogue.show')?.textContent})).catch(()=>null));await desenho(p,true).catch(()=>{});await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await browser.close();}
