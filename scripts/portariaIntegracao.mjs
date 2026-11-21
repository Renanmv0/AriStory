/** Lançamento: entrada normal pelo clube e save representativo, somente no preview local. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const BASE=process.env.SMOKE_URL??'http://127.0.0.1:4212';
if(!['127.0.0.1','localhost'].includes(new URL(BASE).hostname))throw Error('Somente preview local.');
const OUT=process.argv[2]??'/tmp/integracao-portaria';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const erros=[],resultados=[];
const ok=(cond,msg)=>{assert.ok(cond,msg);console.log('✓ '+msg);resultados.push(msg);};
const TESTE=JSON.stringify({version:1,scene:'clube',flags:{'validacao:teste':true},stats:{'portaria:dia:6:vezes':999},carteira:7,memories:[]});
function fixture({mania=true,gina=false}={}){
 const stats={'validacao:contador':42};for(let n=1;n<=6;n++){stats[`turno:${n}:vezes`]=mania||n<6?1:0;stats[`turno:${n}:estrelas`]=mania||n<6?3:0;}
 return {version:1,scene:'clube',carteira:500,flags:{'turnos-migrados':true,'halloween:edicao-2026':true,'validacao:anterior':true},stats,
  memories:[{id:'validacao-anterior',title:'Memória preservada',note:'Dado anterior ao minigame',place:'Clube',icon:'📘',at:12345},...(gina?[{id:'girafa-da-portaria',title:'A Gina da portaria',note:'Já conhecemos a Gina',place:'Clube',icon:'🦒',at:23456}]:[])],
  apostila:{estrelas:{'oi-tudo-bem':3},abertas:['oi-tudo-bem'],anotacoes:{'oi-tudo-bem':'Anotação anterior preservada'}},retomadas:{'validacao:anterior':{etapa:2,marca:'preservar'}}};
}
async function preparar(save,{cel=false}={}){
 const context=await browser.newContext({viewport:cel?{width:390,height:844}:{width:1280,height:800},hasTouch:cel,isMobile:cel});
 await context.addInitScript(({save,teste})=>{if(!sessionStorage.getItem('validacao:semeada')){localStorage.setItem('aristory.save.v1',save);localStorage.setItem('aristory.save.v1.portaria',teste);sessionStorage.setItem('validacao:semeada','sim');}},{save:typeof save==='string'?save:JSON.stringify(save),teste:TESTE});
 const p=await context.newPage();p.on('pageerror',e=>erros.push(e.message));
 await carregar(p);
 await p.evaluate(()=>{const g=window.jogo;if(!g.flag('validacao:acervo')){const p=window.aristoryItens['quepe-cookie'];g.ganharPeca(p);g.vestirConjunto([p],'ari');g.setFlag('validacao:acervo');}});
 return{p,context};
}
async function carregar(p,reload=false){
 if(reload)await p.reload({waitUntil:'networkidle'});else await p.goto(BASE+'/?semente=7&depressa',{waitUntil:'networkidle'});
 await p.waitForFunction(()=>!!window.jogo?.current,undefined,{timeout:120000});
 await p.evaluate(()=>{const r=window.jogo.renderer;window.renderOriginal=r.render.bind(r);r.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});
 await p.waitForFunction(()=>!window.jogo.transitioning);
 const url=new URL(p.url());for(const chave of ['portaria','dia','guaritaNova','cena'])assert.equal(url.searchParams.has(chave),false);
}
async function clicar(p,sel){const l=typeof sel==='string'?p.locator(sel):sel;if(p.viewportSize().width<600)await l.tap();else await l.click();}
async function foto(p,nome){await p.evaluate(()=>{window.jogo.renderer.render=window.renderOriginal;});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await p.screenshot({path:`${OUT}-${nome}.png`});await p.evaluate(()=>{window.jogo.renderer.render=(s,c)=>{s.updateMatrixWorld();c.updateMatrixWorld();};});}
async function saveDe(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('aristory.save.v1')));}
async function falarComGina(p){
 await p.waitForFunction(()=>window.jogo.current?.def?.id==='clube');
 await p.evaluate(()=>{const g=window.jogo,it=g.current.world.interactables.find(i=>i.id==='clube:portaria');g.debugPlace(it.x,it.z+.35,Math.PI);});
 await p.waitForFunction(()=>window.jogo.hot?.id==='clube:portaria'&&!window.jogo.ui.dialogueOpen&&!window.jogo.player.locked&&!window.jogo.transitioning);
 if(p.viewportSize().width<600)await clicar(p,'.action-btn');else await p.keyboard.press('KeyE');
 await p.locator('.dialogue.show').waitFor();
}
async function conversa(p,{escolha=false}={}){
 const textos=new Set();for(let i=0;i<200;i++){
  const s=await p.evaluate(()=>({aberta:!!document.querySelector('.dialogue.show'),texto:document.querySelector('.dialogue .text')?.textContent,opcoes:document.querySelector('.escolhas')?.children.length??0,busy:window.jogo.current?.world.interactables.find(i=>i.id==='clube:portaria')?.busy}));
  if(s.texto)textos.add(s.texto);
  if(s.opcoes&&escolha)return [...textos];
  if(!s.aberta&&!s.busy)return [...textos];
  if(s.aberta&&!s.opcoes)await clicar(p,'.dialogue.show');
  await p.waitForTimeout(60);
 }throw Error('Conversa da Gina não terminou');
}
async function escolherDia(p,n){
 await falarComGina(p);await conversa(p,{escolha:true});
 const opcoes=await p.locator('.escolhas button').allTextContents();
 await clicar(p,p.locator('.escolhas button').filter({hasText:new RegExp(`Dia ${n}:`)}));
 await p.waitForFunction(n=>window.jogo.current?.def?.id==='portaria'&&window.portaria?.ex?.n===n,n,{timeout:120000});
 return opcoes;
}
async function abrirMesa(p){await clicar(p,'.pt-ab-pular');await p.waitForFunction(()=>window.portaria.comecou());await p.evaluate(()=>window.portaria.painel.mudarVista('documento'));}
async function livre(p){
 for(let i=0;i<800;i++){
  const s=await p.evaluate(()=>{document.querySelector('.pt-balao.show')?.click();return{ocupado:window.portaria.ocupado(),fala:window.portaria.painel.falando};});
  if(!s.ocupado&&!s.fala){await p.evaluate(()=>window.portaria.painel.mudarVista('documento'));return;}
  await p.waitForTimeout(80);
 }throw Error('Atendimento travado');
}
async function pista(p,s){
 if(s.startsWith('doc:')){const idx=await p.evaluate(s=>window.portaria.ex.janela.visitante.docs.findIndex(d=>d.tipo===s.split(':')[1]),s);await clicar(p,`[data-aba="doc:${idx}"]`);}
 else if(s==='lista')await clicar(p,'[data-aba="lista"]');
 else if(s==='calendario')await clicar(p,'[data-aba="hoje"]');
 else if(s.startsWith('manual:'))await clicar(p,'[data-aba="manual"]');
 await livre(p);const l=p.locator(`[data-pista="${s}"]`);await l.scrollIntoViewIfNeeded();await clicar(p,l);
}
async function jogarDiaUm(p){
 const decisoes=[];let recusado=null;
 for(let i=0;i<30;i++){
  await livre(p);if(!await p.locator('[data-acao="chamar"]:not([disabled])').count())break;
  await clicar(p,'[data-acao="chamar"]');await livre(p);const c=await p.evaluate(()=>window.portaria.conferir());assert.ok(c);
  const d={id:c.id,perguntas:[],apontados:[],confiscados:[],carimbo:c.carimbo};
  if(await p.locator('[data-acao="oferta:nao"]').isVisible()){await clicar(p,'[data-acao="oferta:nao"]');d.recusou=true;await livre(p);}
  for(const diff of c.diferencas){
   for(const a of diff.pistas){if(!a.startsWith('transcricao:'))continue;const assunto=a.slice(12);if(await p.evaluate(a=>window.portaria.ex.janela.perguntas.includes(a),assunto))continue;await clicar(p,'[data-acao="perguntar"]');await clicar(p,`[data-pergunta="${assunto}"]`);d.perguntas.push(assunto);await livre(p);}
   await clicar(p,'[data-acao="lupa"]');await pista(p,diff.pistas[0]);await pista(p,diff.pistas[1]);d.apontados.push(diff.pistas);await livre(p);
  }
  for(const item of c.proibidos){if(!await p.locator(`[data-confiscar="${item}"]`).isVisible()){await clicar(p,'[data-acao="sacola"]');await livre(p);}await clicar(p,`[data-confiscar="${item}"]`);d.confiscados.push(item);await livre(p);}
  // Uma recusa deliberada testa a memória no fluxo normal; os demais atendimentos são corretos.
  if(!recusado&&c.id.startsWith('figurante')&&c.carimbo==='entra'){
   recusado=await p.evaluate(()=>{const v=window.portaria.ex.janela.visitante;return{nome:v.nome,ficha:v.ficha,rosto:v.rosto};});d.carimbo='hojeNao';
  }
  await clicar(p,`[data-acao="carimbo:${d.carimbo}"]`);await livre(p);decisoes.push(d);console.log(`  dia 1: ${c.id} → ${d.carimbo}`);
 }
 assert.ok(recusado,'houve um figurante válido para testar o retorno');
 const esperado=await p.evaluate(ds=>{const e=window.portaria.expedienteLimpo();for(const d of ds){const v=e.proximo();if(v?.id!==d.id)throw Error('Fila diferente');if(d.recusou)e.responderOferta(false);for(const a of d.perguntas)e.perguntar(a);for(const [a,b]of d.apontados)e.apontar(a,b);for(const i of d.confiscados)e.confiscar(i);e.carimbar(d.carimbo);}const f=e.terminar();return{total:f.total,estrelas:f.estrelas,fatos:f.fatos,revisoes:f.revisoes};},decisoes);
 await clicar(p,'[data-acao="terminar"]');
 for(let i=0;i<300&&!await p.locator('.pt-envelope.show').isVisible();i++){await p.evaluate(()=>{document.querySelector('.pt-balao.show')?.click();document.querySelector('.pg-continuar')?.click();});await p.waitForTimeout(80);}
 await p.locator('.pt-envelope.show').waitFor();
 const real=await p.evaluate(()=>{const f=window.portaria.ex.terminar();return{total:f.total,estrelas:f.estrelas,fatos:f.fatos,revisoes:f.revisoes};});
 assert.deepEqual(real,esperado);assert.equal(real.estrelas,3);assert.ok(real.total>0);assert.equal(real.revisoes.length,1);
 await foto(p,'dia1-envelope-celular');const noEnvelope=await saveDe(p);
 await writeFile(`${OUT}-checkpoint-envelope.json`,JSON.stringify({recusado,esperado,noEnvelope,atendidos:decisoes.length}));
 await clicar(p,'[data-env="ok"]');await p.waitForFunction(()=>window.jogo.current?.def?.id==='clube'&&!window.jogo.transitioning,{},{timeout:120000});
 const liberado=await p.evaluate(()=>{const g=window.jogo;return !g.player.locked&&!g.player.riding&&!g.parceiro.riding&&!g.camOmbro&&g.player.object.parent===g.scene&&g.parceiro.object.parent===g.scene;});
 ok(liberado,'fechar o dia devolve câmera, corpos e controles ao clube');
 return{recusado,esperado,noEnvelope,atendidos:decisoes.length};
}
async function sair(p){await clicar(p,'[data-acao="sair"]');await p.locator('.pt-confirmar-saida[open]').waitFor();await clicar(p,'[data-saida="confirmar"]');for(let i=0;i<200;i++){if(await p.evaluate(()=>window.jogo.current?.def?.id==='clube'&&!window.jogo.transitioning))return;await p.evaluate(()=>document.querySelector('.pt-balao.show')?.click());await p.waitForTimeout(80);}throw Error('Não saiu da portaria');}
async function confirmarSaida(p,nome){
 const estado=()=>p.evaluate(()=>({indice:window.portaria.ex.indice,minutos:window.portaria.ex.minutos,atendidos:window.portaria.ex.atendimentos?.length,visitante:window.portaria.ex.janela?.visitante.id,save:localStorage.getItem('aristory.save.v1')}));
 const antes=await estado();await clicar(p,'[data-acao="sair"]');await p.locator('.pt-confirmar-saida[open]').waitFor();
 const pausado=await estado();
 for(const campo of ['indice','atendidos','visitante','save'])assert.deepEqual(pausado[campo],antes[campo]);
 assert.equal(await p.locator('[data-saida="continuar"]').evaluate(el=>el===document.activeElement),true);
 await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.querySelector('.pt-confirmar-saida').contains(document.activeElement)),true);
 await p.waitForTimeout(1500);assert.deepEqual(await estado(),pausado,'a pergunta não gasta tempo nem altera o expediente/save');
 await foto(p,`confirmacao-${nome}`);
 const caixa=await p.locator('.pt-confirmar-saida').boundingBox(),tela=p.viewportSize();assert.ok(caixa.x>=0&&caixa.y>=0&&caixa.x+caixa.width<=tela.width&&caixa.y+caixa.height<=tela.height);
 await clicar(p,'[data-saida="continuar"]');assert.equal(await p.evaluate(()=>window.portaria.painel.confirmandoSaida),false);
 await p.waitForFunction(m=>window.portaria.ex.minutos>m,pausado.minutos);assert.equal((await estado()).visitante,antes.visitante);
 await clicar(p,'[data-acao="sair"]');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>window.portaria.painel.confirmandoSaida),false);assert.equal(await p.evaluate(()=>window.jogo.ui.menuOpen),false);
 ok(true,`confirmação em ${nome}: relógio pausado, foco preso, continuar e Escape preservam a partida`);
}
function preservar(antes,depois){
 for(const campo of ['apostila','compradas','livro','decoracoes','bebitoBook','vagaLumesSoltos','tintas','bebitoMobile'])assert.deepEqual(depois[campo],antes[campo],campo);
 assert.deepEqual(depois.premios.filter(id=>id!=='cracha-da-portaria'),antes.premios,'os prêmios anteriores continuam intactos');
 const inv=structuredClone(depois.inventarios);for(const i of Object.values(inv))i.acervo=i.acervo.filter(p=>p.id!=='cracha-da-portaria');
 assert.deepEqual(inv,antes.inventarios,'roupas antigas, mãos e peças vestidas preservadas');
 assert.equal(depois.flags['validacao:anterior'],true);assert.equal(depois.stats['validacao:contador'],42);
 assert.deepEqual(depois.retomadas['validacao:anterior'],antes.retomadas['validacao:anterior']);
 assert.deepEqual(depois.memories.find(m=>m.id==='validacao-anterior'),antes.memories.find(m=>m.id==='validacao-anterior'));
 for(let n=1;n<=6;n++){assert.equal(depois.stats[`turno:${n}:vezes`],antes.stats[`turno:${n}:vezes`]);assert.equal(depois.stats[`turno:${n}:estrelas`],antes.stats[`turno:${n}:estrelas`]);}
}
try{
 if(process.env.SO!=='confirmacao'){
 // O mundo antes da última noite: conversar continua sendo só conversar.
 const antigo=await preparar(fixture({mania:false,gina:true}));
 await falarComGina(antigo.p);const conversaAntiga=await conversa(antigo.p);
 const saveAntigo=await saveDe(antigo.p);ok(!saveAntigo.flags['portaria:liberada'],'antes da última noite do Mania, a Gina não libera a portaria');
 ok(!conversaAntiga.some(t=>/Reformaram|me ajudarem na portaria/.test(t)),'a reforma não aparece antes da hora');
 await foto(antigo.p,'antes-do-mania');await antigo.context.close();

 // Depois do Mania, sem atalhos da portaria na URL e usando a chave normal de save.
 const {p,context}=await preparar(fixture(),{cel:true});const antes=await saveDe(p);
 await writeFile(`${OUT}-fixture-inicial.json`,JSON.stringify(antes,null,2));
 await falarComGina(p);const nova=await conversa(p);
 const aposConversa=await saveDe(p);
 ok(aposConversa.flags['portaria:liberada']&&aposConversa.memories.some(m=>m.id==='guarita-nova'),'a conversa completa com a Gina desbloqueia e registra a reforma');
 ok(nova.some(t=>/Sou a Gina/.test(t)),'quem ainda não conhecia a Gina ouve sua apresentação');
 const opcoes=await escolherDia(p,1);
 ok(opcoes.some(t=>/Dia 1:/.test(t))&&!opcoes.some(t=>/Dia 2:/.test(t)),'a escala inicial oferece somente o dia 1, ignorando o progresso do save de teste');
 await foto(p,'abertura-dia1-celular');await abrirMesa(p);
 const resultado=await jogarDiaUm(p);let depois=await saveDe(p);
 assert.equal(depois.stats['portaria:dia:1:vezes'],1);assert.equal(depois.carteira,antes.carteira+resultado.esperado.total);preservar(antes,depois);
 ok(true,`dia 1 completo: ${resultado.atendidos} visitantes, três estrelas, pagamento correto e progresso anterior preservado`);
 assert.equal(depois.premios.filter(id=>id==='cracha-da-portaria').length,1);
 for(const quem of ['ari','renan'])assert.equal(depois.inventarios[quem].acervo.filter(i=>i.id==='cracha-da-portaria').length,1);
 ok(true,'o crachá das três estrelas vai uma vez aos dois armários, sem trocar as roupas antigas');
 assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1.portaria')),TESTE);
 ok(true,'o fluxo normal não altera nem lê o save separado de teste');
 await foto(p,'volta-ao-clube');
 const pos=await p.evaluate(()=>window.jogo.playerPosition().toArray());await p.keyboard.down('KeyS');await p.waitForTimeout(1500);await p.keyboard.up('KeyS');
 const pos2=await p.evaluate(()=>window.jogo.playerPosition().toArray());ok(Math.hypot(pos2[0]-pos[0],pos2[2]-pos[2])>.15,'a dupla anda depois de fechar o expediente');
 await carregar(p,true);ok(await p.evaluate(()=>window.jogo.current.def.id==='clube'),'recarregar após fechar o expediente retoma o clube');
 const menu2=await escolherDia(p,2);ok(menu2.some(t=>/Dia 1:/.test(t))&&menu2.some(t=>/Dia 2:/.test(t))&&!menu2.some(t=>/Dia 3:/.test(t)),'dia 2 abre ao concluir o primeiro; dia 1 fica disponível para repetir');
 await carregar(p,true);assert.equal(await p.evaluate(()=>window.portaria.ex.n),2);
 ok(true,'recarregar dentro da portaria escolhe o dia aberto ainda não concluído');
 await abrirMesa(p);const primeiro=await p.evaluate(()=>window.portaria.ex.fila[0]);
 assert.equal(primeiro.nome,resultado.recusado.nome);assert.equal(primeiro.ficha,resultado.recusado.ficha);assert.deepEqual(primeiro.rosto,resultado.recusado.rosto);
 assert.ok(primeiro.chegada.some(t=>t.includes('não me deixaram entrar ontem')));
 await clicar(p,'[data-acao="chamar"]');await p.waitForFunction(()=>window.portaria.painel.falando);await foto(p,'lembranca-dia2');await livre(p);
 ok(true,'o recusado volta com a mesma aparência e lembra da decisão após recarregar no save normal');
 await confirmarSaida(p,'celular');
 await sair(p);depois=await saveDe(p);assert.equal(depois.stats['portaria:dia:2:vezes']??0,0);assert.equal(depois.carteira,antes.carteira+resultado.esperado.total);
 assert.deepEqual(depois.retomadas['portaria:encontros:v1'],resultado.noEnvelope.retomadas['portaria:encontros:v1']);
 ok(true,'abandonar o dia 2 não grava atendimento nem duplica pagamento');
 await escolherDia(p,1);assert.equal(await p.evaluate(()=>window.portaria.ex.n),1);await abrirMesa(p);await sair(p);
 ok(true,'repetir o dia 1 pela escala abre o dia escolhido, sem atalhos na URL');
 const normal=await p.evaluate(()=>localStorage.getItem('aristory.save.v1'));await p.goto(BASE+'/?portaria&cena=clube',{waitUntil:'networkidle'});await p.waitForFunction(()=>window.jogo?.current?.def?.id==='clube');
 await p.evaluate(()=>window.jogo.bump('validacao:teste',1));assert.equal(await p.evaluate(()=>localStorage.getItem('aristory.save.v1')),normal);
 ok(true,'jogar na chave de teste continua sem escrever no save normal');await context.close();

 // Uma aba descartada enquanto o envelope estava aberto não deve pagar de novo.
 const descarte=await preparar(JSON.stringify(resultado.noEnvelope));
 await descarte.p.waitForFunction(()=>!!window.portaria?.ex);
 assert.equal(await descarte.p.evaluate(()=>window.portaria.ex.n),2);const retomado=await saveDe(descarte.p);
 assert.equal(retomado.carteira,resultado.noEnvelope.carteira);assert.equal(retomado.stats['portaria:dia:1:vezes'],1);preservar(antes,retomado);
 ok(true,'reabrir a aba no estado do envelope conserva o pagamento único e avança ao dia 2');await descarte.context.close();

 // Save antigo sem os campos recentes, mas com Gina conhecida e Mania concluído.
 const conhecido=await preparar(fixture({gina:true}));await falarComGina(conhecido.p);const falas=await conversa(conhecido.p);
 assert.ok(!falas.some(t=>/Sou a Gina/.test(t)));const legado=await saveDe(conhecido.p);
 assert.equal(legado.memories.find(m=>m.id==='girafa-da-portaria').at,23456);
 assert.ok(legado.flags['portaria:liberada']);ok(true,'save antigo é normalizado, mantém a memória da Gina e recebe o desbloqueio');
 await conhecido.context.close();assert.deepEqual(erros,[]);
 }
 const pcFixture=fixture({gina:true});pcFixture.scene='portaria';pcFixture.flags['portaria:liberada']=true;pcFixture.stats['portaria:dia:1:vezes']=1;
 const pc=await preparar(pcFixture);await pc.p.waitForFunction(()=>!!window.portaria?.ex);await abrirMesa(pc.p);await clicar(pc.p,'[data-acao="chamar"]');await livre(pc.p);await confirmarSaida(pc.p,'computador');await sair(pc.p);await pc.context.close();
 const fechamento=await preparar(pcFixture);await fechamento.p.waitForFunction(()=>!!window.portaria?.ex);await abrirMesa(fechamento.p);
 await clicar(fechamento.p,'[data-acao="terminar"]');assert.equal(await fechamento.p.locator('[data-acao="sair"]').isDisabled(),true);
 for(let i=0;i<150&&!await fechamento.p.locator('.pt-envelope.show').isVisible();i++){await fechamento.p.evaluate(()=>document.querySelector('.pt-balao.show')?.click());await fechamento.p.waitForTimeout(60);}
 await fechamento.p.locator('.pt-envelope.show').waitFor();assert.equal(await fechamento.p.locator('[data-acao="sair"]').isDisabled(),true);
 await clicar(fechamento.p,'[data-env="ok"]');await fechamento.p.waitForFunction(()=>window.jogo.current.def.id==='clube'&&!window.jogo.transitioning);
 assert.equal(await fechamento.p.evaluate(()=>window.jogo.stat('portaria:dia:2:vezes')),1);await fechamento.context.close();ok(true,'o dia já registrado não pode ser abandonado durante o recado final ou envelope');
 assert.deepEqual(erros,[]);
 await writeFile(`${OUT}-resultado.json`,JSON.stringify({base:'8041f2966088fa269886c90f4dec09390278ddfe',preview:BASE,save:'fixtures representativas, não o save pessoal do aparelho',resultados,erros},null,2));
 console.log('tudo certo');
}finally{await browser.close();}
