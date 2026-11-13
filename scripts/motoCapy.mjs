/** Moto, encontro completo e vaga desbloqueada; somente preview isolado. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177',OUT=process.argv[2]??'/tmp/moto-capy';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use preview.');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[],espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:90000});
async function desenho(p,sim){await p.evaluate(sim=>{const r=window.jogo.renderer;window.renderNormal??=r.render.bind(r);r.render=sim?window.renderNormal:(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};},sim);}
async function foto(p,nome){await desenho(p,true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await desenho(p,false);}
try{
for(const mobile of process.env.SO==='modelo'?[false]:[false,true]){
 const c=await b.newContext({viewport:mobile?{width:390,height:844}:{width:1200,height:850},hasTouch:mobile,isMobile:mobile}),p=await c.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(BASE+`/?bebito&carroPorDentro&semHalloween&cena=viagem-de-carro&viagem=${mobile?'ida,renan,4':'casa-clube,ari,1'}`);
 await espera(p,()=>window.jogo?.current.world.root.userData.novidadesDaViagem?.encontro&&!window.jogo.transitioning);await desenho(p,false);
 await p.evaluate(()=>{const v=window.aristoryBebitoMobile.viagem;v.estado.s=v.rota.encontro.s-61;v.estado.fase='dirigindo';v.piloto='bom';v.vezes=3;});
 await espera(p,()=>window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase==='falando');
 await espera(p,()=>document.querySelector('.dialogue.show')?.textContent.includes('Capacete afivelado'));
 await p.evaluate(()=>window.aristoryBebitoMobile.viagem.vezes=0);
 const medidas=await p.evaluate(()=>{const n=window.jogo.current.world.root.userData.novidadesDaViagem.encontro,m=n.carro,g=window.jogo;const patas=m.capy.patas.map(p=>m.group.worldToLocal(p.children[1].getWorldPosition(m.group.position.clone())).toArray());return{patas,nome:n.nome,capacete:!!m.capy.apoioDoCapacete.getObjectByName('capacete-do-capy'),pilotando:m.capy.pilotando,velocidade:window.aristoryBebitoMobile.viagem.estado.v,motorista:g.player.rig.noCarro==='dirigindo'?g.playerId():g.companionId()};});
 assert.equal(medidas.nome,'Capy');assert.ok(medidas.capacete&&medidas.pilotando);assert.ok(medidas.velocidade<.1);assert.equal(medidas.motorista,mobile?'renan':'ari');
 for(let i=0;i<4;i++){const [x,y,z]=medidas.patas[i],frente=i<2;assert.ok(Math.hypot(Math.abs(x)-(frente?.36:.432),y-(frente?1.24:.67),z-(frente?.19:-.49))<(frente?.2:.09),'pata próxima do guidão ou pedaleira');}
 await foto(p,mobile?'celular-encontro':'computador-encontro');
 // Retrato da moto, mantendo o ator e a pose reais da cena.
 await p.evaluate(()=>{const g=window.jogo,m=g.current.world.root.userData.novidadesDaViagem.encontro.carro.group;window.cameraNormal=g.setCameraOmbro.bind(g);const f=innerWidth<600?1.5:1,para=m.position.clone().add(m.position.clone().set(0,1,0)),de=m.position.clone().set(4.2*f,2.7*f,4.8*f).applyQuaternion(m.quaternion).add(m.position);g.setCameraOmbro=()=>window.cameraNormal(de,para);});
 await foto(p,mobile?'celular-perto':'computador-perto');
 await p.evaluate(()=>{window.jogo.setCameraOmbro=window.cameraNormal;window.aristoryBebitoMobile.viagem.vezes=3;});
 let fim=false;const inicio=Date.now();
 while(Date.now()-inicio<90000){if(await p.evaluate(()=>window.jogo.current.world.root.userData.novidadesDaViagem.encontro.estado.fase==='feito')){fim=true;break;}await p.evaluate(()=>document.querySelector('.dialogue.show')?.click());await p.waitForTimeout(70);}
 assert.ok(fim);assert.ok(await p.evaluate(()=>window.jogo.temMemoria('capy-na-estrada')));assert.equal(await p.evaluate(()=>window.aristoryBebitoMobile.viagem.estado.vistos.capy),1);assert.equal(await p.evaluate(()=>window.jogo.temMemoria('noel-na-estrada')),false);
 await p.evaluate(()=>{const g=window.jogo;g.setFlag('bebito:viagem-em-andamento',false);g.goTo('clube','do-estacionamento');});await espera(p,()=>window.jogo.idDaCena==='clube'&&!window.jogo.transitioning);
 assert.deepEqual(await p.evaluate(()=>window.jogo.current.world.root.userData.estacionamentoDoClube.carros.map(c=>c.personagem)),['capy']);
 await p.goto(BASE+'/?bebito&semHalloween&cena=clube&entrada=do-estacionamento');await espera(p,()=>window.jogo?.idDaCena==='clube'&&!window.jogo.transitioning);await desenho(p,false);
 assert.deepEqual(await p.evaluate(()=>window.jogo.current.world.root.userData.estacionamentoDoClube.carros.map(c=>c.personagem)),['capy']);
 await p.evaluate(()=>{const g=window.jogo,alvo=new g.player.object.constructor();alvo.position.set(-70.2,.6,-5);g.focusCamera(alvo);g.setZoom(12);g.iso.snapTo(alvo.position);});await foto(p,mobile?'celular-vaga':'computador-vaga');
 assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);console.log(mobile?'Celular':'Computador','Capy de capacete, encontro, motorista, memória e moto na vaga passaram.');await c.close();
}
assert.deepEqual(erros,[]);
}finally{await b.close();}
