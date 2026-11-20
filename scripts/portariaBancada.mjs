/** Bancada real: cliques pelo canvas, leitura preservada, entrega, carimbo e sacola. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4177',OUT=process.argv[2]??'/tmp/portaria-bancada';
if(new URL(BASE).hostname==='renanmv0.github.io')throw Error('Use preview isolado.');
const b=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[],espera=(p,f,a)=>p.waitForFunction(f,a,{timeout:120000});
async function livre(p){const fim=Date.now()+120000;while(Date.now()<fim){const e=await p.evaluate(()=>{document.querySelector('.dialogue.show')?.click();document.querySelector('.pt-balao.show')?.click();return !!window.portaria?.comecou()&&!window.portaria.ocupado()&&!window.portaria.painel.falando;});if(e)return;await p.waitForTimeout(90);}throw Error('Atendimento não ficou livre');}
async function cameraFirme(p){await espera(p,()=>{const g=window.jogo,c=g.camOmbro,v=window.portaria.painel.vista,cel=innerHeight>innerWidth;const de=v==='visitante'?[0,1.72,.45]:v==='bancada'?[0,cel?2.8:1.85,cel?.5:.2]:[0,1.7,.44];const para=v==='visitante'?[0,1.74,2.72]:v==='bancada'?[0,cel?1.02:1.1,cel?1.45:1.65]:cel?[0,.92,2.9]:[1.3,.95,2.9];const esperado=c.clone();esperado.position.set(...de);esperado.lookAt(...para);return c.position.distanceTo(esperado.position)<.03&&c.quaternion.angleTo(esperado.quaternion)<.015;});}
async function foto(p,nome){await cameraFirme(p);await p.evaluate(()=>{const w=window.jogo.current.world;window.updatersDaFoto=w.updaters;w.updaters=[];});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await p.evaluate(()=>{window.jogo.current.world.updaters=window.updatersDaFoto;});}
async function clicar3D(p,nome){await cameraFirme(p);const pos=await p.evaluate(nome=>{const g=window.jogo,w=g.current.world;let obj;
if(nome==='visitante'){const m=window.portaria.modelos.get(window.portaria.ex.janela.visitante.id).group;m.traverse(o=>{if(!obj&&o.name.includes('cabeca'))obj=o;});}
else obj=nome.startsWith('item:')?window.portaria.sacola.itens.get(nome.slice(5)):window.portaria.mesa.group.getObjectByName(nome)??window.portaria.sacola.group.getObjectByName(nome);if(!obj)throw Error('Objeto não encontrado: '+nome);const hit=obj.getObjectByName('area-de-toque')??obj;const v=hit.getWorldPosition(g.player.position.clone()).project(g.camOmbro??g.iso.camera);return{x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2};},nome);assert.ok(pos.x>0&&pos.x<(await p.viewportSize()).width&&pos.y>0&&pos.y<(await p.viewportSize()).height,'alvo dentro da tela: '+nome);await p.mouse.move(pos.x,pos.y);await p.waitForTimeout(100);if(process.env.DEPURAR)console.log(nome,await p.evaluate(({x,y})=>({elemento:document.elementFromPoint(x,y)?.className,sobre:window.jogo.apontador.emCima?.obj.name,bloqueado:window.jogo.apontador.bloqueado,alvos:window.jogo.apontador.clicaveis.filter(c=>c.ligado).map(c=>c.obj.name)}),pos));if(await p.evaluate(()=>navigator.maxTouchPoints>0))await p.touchscreen.tap(pos.x,pos.y);else await p.mouse.click(pos.x,pos.y);}
try{
 for(const mobile of process.env.SACOLA?[false]:process.env.GRUPO?[true]:process.env.CEL?[true]:[false,true]){
  const c=await b.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:850},isMobile:mobile,hasTouch:mobile}),p=await c.newPage();p.on('pageerror',e=>erros.push(e.message));
  await p.goto(BASE+`/?portaria&cena=portaria&dia=${process.env.DIA??(mobile?6:1)}&semente=7&depressa`);await espera(p,()=>!!window.portaria?.ex);await livre(p);await espera(p,()=>window.jogo.camOmbro.position.z<.7);
  const nome=mobile?'celular':'computador';assert.equal(await p.evaluate(()=>window.portaria.painel.vista),'bancada');await foto(p,nome+'-bancada');
  if(process.env.SACOLA||process.env.GRUPO)await p.evaluate(({grupo,proibido})=>{const x=window.portaria.ex.fila.findIndex(v=>grupo?!!v.escondido:v.sacola?.length&&v.docs.some(d=>d.tipo==='carteirinha')&&(!proibido||window.portaria.proibidosNaSacola(v,window.portaria.ex.contexto).length));if(x<0)throw Error('Nenhum visitante com sacola');window.portaria.ex.indice=x-1;},{grupo:!!process.env.GRUPO,proibido:!!process.env.PROIBIDO});
  await clicar3D(p,'campainha');
  // A entrega tem que iniciar pelo clique 3D, mantendo os dois sentados.
  await espera(p,()=>!!window.portaria.ex.janela);
  for(let i=0;i<600;i++){
   const entrega=await p.evaluate(()=>{document.querySelector('.pt-balao.show')?.click();return [...window.portaria.mesa.papeis.values()].some(p=>p.voo?.origem&&p.voo.t>.15&&p.voo.t<.8);});
   if(entrega){await foto(p,nome+'-entrega');break;}await p.waitForTimeout(50);
  }
  await livre(p);
  if(await p.locator('[data-acao="oferta:nao"]').count()){await p.locator('[data-acao="oferta:nao"]').click();await livre(p);}
  assert.equal(await p.evaluate(()=>window.portaria.painel.vista),'bancada');assert.ok(await p.evaluate(()=>window.jogo.player.locked&&window.jogo.player.riding&&window.jogo.parceiro.riding));
  await foto(p,nome+'-documentos');
  const tipo=await p.evaluate(()=>window.portaria.mesa.naMesa[0].tipo);await clicar3D(p,'papel:'+tipo);await espera(p,()=>window.portaria.painel.vista==='documento');await livre(p);await foto(p,nome+'-leitura');
  const antes=await p.evaluate(()=>{const f=document.querySelector('.pt-folha');f.scrollTop=20;return{aba:window.portaria.painel.aba,scroll:f.scrollTop,documento:window.portaria.ex.janela.visitante.docs[0]};});
  await p.getByRole('button',{name:'👀 Ver visitante',exact:true}).click();await espera(p,()=>window.portaria.painel.vista==='visitante');await p.waitForTimeout(250);await foto(p,nome+'-visitante');
  assert.equal(await p.locator('.pt-painel').isVisible(),false);assert.ok(await p.locator('.pt-comparacao').isVisible());
  await p.locator('.pt-comparacao button').click();await espera(p,()=>window.portaria.painel.vista==='documento');assert.deepEqual(await p.evaluate(()=>window.portaria.painel.aba),antes.aba);
  // Voltar à bancada conserva o expediente; a data e o manual também são objetos clicáveis.
  await p.getByRole('button',{name:'↓ Ver bancada',exact:true}).click();await clicar3D(p,'calendario');await espera(p,()=>window.portaria.painel.vista==='documento');
  await p.getByRole('button',{name:'↓ Ver bancada',exact:true}).click();
  const temSacola=await p.evaluate(()=>window.portaria.ex.janela.visitante.sacola?.length>0);
  if(temSacola){await p.getByRole('button',{name:'🎒 Sacola',exact:true}).click();await livre(p);assert.ok(await p.evaluate(()=>window.portaria.sacola.itens.size>0));await foto(p,nome+'-sacola');
   const item=await p.evaluate(()=>window.portaria.conferir().proibidos[0]??window.portaria.ex.janela.visitante.sacola[0]);
   if(await p.getByRole('button',{name:'Fechar inspeção',exact:true}).isVisible())await p.getByRole('button',{name:'Fechar inspeção',exact:true}).click();
   await clicar3D(p,'item:'+item);await p.locator(`[data-confiscar="${item}"]`).click();await livre(p);
   assert.ok(await p.evaluate(item=>!window.portaria.sacola.itens.get(item)?.visible,item));
   if(process.env.PROIBIDO){assert.ok(await p.evaluate(item=>window.portaria.ex.janela.confiscados.includes(item),item));assert.ok(await p.evaluate(item=>window.portaria.sacola.group.getObjectByName('item:'+item)?.visible,item));}
   await foto(p,nome+'-item-inspecionado');
  }
  if(process.env.GRUPO){
   await p.getByRole('button',{name:'🪪 Ler documentos',exact:true}).click();
   await p.locator('[data-acao="perguntar"]').click();await p.locator('[data-pergunta="quantos"]').click();await livre(p);
   await p.locator('[data-acao="lupa"]').click();await p.locator('[data-pista="transcricao:quantos"]').click();
   await p.getByRole('button',{name:'👀 Ver visitante',exact:true}).click();await foto(p,nome+'-grupo-escondido');
   assert.equal(await p.evaluate(()=>window.portaria.painel.primeira),'transcricao:quantos');
   await clicar3D(p,'visitante');await livre(p);
   assert.ok(await p.evaluate(()=>window.portaria.ex.janela.corrigidas.has('alguemEscondido')));
   await espera(p,()=>{let luna;window.portaria.modelos.get(window.portaria.ex.janela.visitante.id).group.traverse(o=>{if(o.userData.peca==='luna')luna=o;});return luna?.position.x>.94&&Math.abs(luna.rotation.y-Math.atan2(-.95,3.32))<.08;});
   assert.ok(await p.evaluate(()=>{let luna;window.portaria.modelos.get(window.portaria.ex.janela.visitante.id).group.traverse(o=>{if(o.userData.peca==='luna')luna=o;});return luna?.position.x>.8;}));
   await foto(p,nome+'-grupo-revelado');
   await p.getByRole('button',{name:'↓ Ver bancada',exact:true}).click();
  }
  // O carimbo físico conclui a mesma decisão que a tela usava.
  const carimbo=await p.evaluate(()=>window.portaria.conferir().carimbo);
  const ofertas=await p.locator('[data-acao="oferta:nao"]').count();if(ofertas)await p.locator('[data-acao="oferta:nao"]').click();
  await clicar3D(p,'carimbo:'+carimbo);await espera(p,()=>window.portaria.ocupado());await livre(p);assert.equal(await p.evaluate(()=>window.portaria.ex.janela),null);
  assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),null);
  console.log(nome,'cliques 3D, documentos, comparação, controle travado, decisão e save isolado passaram.');await c.close();
 }
 assert.deepEqual(erros,[]);
}catch(e){for(const c of b.contexts())for(const p of c.pages()){console.log('falha',await p.evaluate(()=>({vista:window.portaria?.painel.vista,ocupado:window.portaria?.ocupado(),janela:window.portaria?.ex.janela?.visitante.nome,erro:document.body.textContent?.slice(-300)})).catch(()=>null));await p.screenshot({path:`${OUT}-falha.png`}).catch(()=>{});}throw e;}finally{await b.close();}
