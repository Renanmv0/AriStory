import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use preview.');
const OUT=process.argv[2]??'/tmp/cookie';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[];
try{
for(const rapido of [false,true]){
 const c=await b.newContext({viewport:rapido?{width:390,height:844}:{width:1200,height:850}}),p=await c.newPage();p.on('pageerror',e=>erros.push(e.message));
 await p.goto(BASE+'/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,1');
 await p.waitForFunction(()=>window.jogo?.current&&!window.jogo.transitioning);
 const seed=await p.evaluate(()=>{const g=window.aristoryBebitoMobile.gerarRota;let tem=0,sem=0,primeira;for(let s=1;s<=200;s++){const r=g(s,'ida');if(r.eventos.some(e=>e.bolhasDoCookie)){tem++;primeira??=s;}else sem++;if(g(s,'casa-clube').eventos.some(e=>e.bolhasDoCookie))throw Error('Cookie fora da rota do parque');if(JSON.stringify(r)!==JSON.stringify(g(s,'ida')))throw Error('Sorteio instável');}if(tem<40||sem<80)throw Error('Distribuição incorreta');return primeira;});
 await p.goto(BASE+`/?bebito&semHalloween&cena=viagem-de-carro&viagem=ida,ari,${seed}`);
 await p.waitForFunction(()=>window.jogo?.current.world.root.userData.novidadesDaViagem?.cookie&&!window.jogo.transitioning);
 await p.evaluate(()=>{const g=window.jogo,v=window.aristoryBebitoMobile.viagem,n=g.current.world.root.userData.novidadesDaViagem;window.renderOriginal=g.renderer.render.bind(g.renderer);g.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};if(n.encontro){n.encontro.estado.fase='feito';n.encontro.carro.group.visible=false;}v.vezes=0;v.estado.fase='dirigindo';v.estado.s=n.cookie.s-18;v.estado.v=0;});
 // Foto da brincadeira usando a câmera de inspeção já disponível no jogo.
 await p.evaluate(()=>{const g=window.jogo,v=window.aristoryBebitoMobile.viagem,k=g.current.world.root.userData.novidadesDaViagem.cookie;const f=innerWidth<600?1.8:1,a=v.naPista(k.s,2),d=v.naPista(k.s-9*f,2+11*f);v.camera={de:[d.x,8*f,d.z],para:[a.x,1.3,a.z]};g.renderer.render=window.renderOriginal;});
 await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${rapido?'celular':'computador'}.png`});
 await p.evaluate(rapido=>{const g=window.jogo,v=window.aristoryBebitoMobile.viagem,k=g.current.world.root.userData.novidadesDaViagem.cookie;g.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};v.estado.s=k.s-(rapido?.08:28);v.estado.v=14;v.piloto=rapido?'nenhum':'bom';v.vezes=1;},rapido);
 await p.waitForFunction(()=>window.aristoryBebitoMobile.viagem.estado.vistos['bolhas-cookie']);
 await p.waitForFunction(rapido=>window.jogo.current.world.root.userData.novidadesDaViagem.cookie.bolhas.visible===!rapido,rapido);
 const r=await p.evaluate(()=>{const g=window.jogo,v=window.aristoryBebitoMobile.viagem;return{vistos:v.estado.vistos['bolhas-cookie'],gentilezas:v.estado.gentilezas,bolhas:g.current.world.root.userData.novidadesDaViagem.cookie.bolhas.visible,save:localStorage.getItem('aristory.save.v1')};});
 assert.equal(r.vistos,1);assert.equal(r.bolhas,!rapido);assert.equal(r.gentilezas,rapido?0:1);assert.equal(r.save,null);
 console.log(rapido?'Passagem rápida: bolhas estouram.':'Passagem devagar: bolhas preservadas e carinho recompensado.');await c.close();
}
assert.deepEqual(erros,[]);
}finally{await b.close();}
