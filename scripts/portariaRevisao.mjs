/** Casos reais da conferência e revisão dos seis dias, sem navegador. */
import { build } from 'esbuild';
import assert from 'node:assert/strict';
const r=await build({stdin:{contents:"export * from './src/minigames/portaria/index'",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node'});
const P=await import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));
const dia=n=>P.montarDia(n,7,new Set());
const at=(v,carimbo,extra={})=>({visitante:v,carimbo,perguntas:[],apontados:[],confiscados:[],...extra});
function revisar(n,v,c,extra={}){const d=dia(n);return P.fecharODia(P.diaPorNumero(n),[at(v,c,extra)],d.contexto).revisoes[0];}
function achar(n,problema){for(let seed=1;seed<100;seed++){const d=P.montarDia(n,seed,new Set()),v=d.fila.find(v=>P.diferencas(v,d.contexto).some(x=>x.problema===problema));if(v)return {d,v};}throw Error('Caso não encontrado: '+problema);}
const h=dia(1).fila.find(v=>v.ficha==='hipolito');
const vencido=revisar(1,h,'entra');assert.match(vencido.esperado,/HOJE NÃO/);assert.match(vencido.motivo,/1998/);assert.match(vencido.motivo,/23\/11\/2026/);assert.match(vencido.conferir,/validade|Validade/);
const alp=dia(1).fila.find(v=>v.ficha==='alpacina');assert.match(revisar(1,alp,'hojeNao').motivo,/penteado/);
const capy=dia(5).fila.find(v=>v.ficha==='capy');const capacete=dia(1).fila.find(v=>v.tapado);assert.match(revisar(1,capacete,'hojeNao').conferir,/capacete/);
const turma=dia(6).fila.find(v=>v.escondido);assert.match(revisar(6,turma,'hojeNao').motivo,/também estava no convite/);
const estella=dia(3).fila.find(v=>v.ficha==='estella');assert.match(revisar(3,estella,'hojeNao').motivo,/não precisa apresentar carteirinha/);
const tata=dia(4).fila.find(v=>v.ficha==='tata');assert.match(revisar(4,tata,'hojeNao').motivo,/Entregador usa crachá/);
const {d:piscina,v:expirado}=achar(5,'exameVencido');
assert.equal(P.carimboCerto(expirado,piscina.contexto),'soClube');
for(const errado of ['entra','hojeNao']){const f=P.fecharODia(P.diaPorNumero(5),[at(expirado,errado)],piscina.contexto).revisoes[0];assert.match(f.esperado,/SÓ O CLUBE/);assert.match(f.motivo,/sem barrar o clube/);}
assert.match(revisar(5,capy,'soClube').motivo,/Não estava vencido/);
const saco=dia(5).fila.find(v=>P.proibidosNaSacola(v,dia(5).contexto).length&&P.carimboCerto(v,dia(5).contexto)==='entra');
const item=revisar(5,saco,'entra');assert.match(item.feito,/sacola/);assert.match(item.esperado,/Retirar/);assert.match(item.conferir,/não muda o carimbo/);
assert.equal(revisar(5,saco,'entra',{confiscados:P.proibidosNaSacola(saco,dia(5).contexto)}),undefined);
const mano=dia(3).fila.find(v=>v.ficha==='mano');assert.match(revisar(3,mano,'hojeNao',{aceitouOferta:true}).esperado,/Recusar o agrado/);
const liz=dia(6).fila.find(v=>v.oferta?.item==='arepita');assert.ok(liz);assert.equal(revisar(6,liz,P.carimboCerto(liz,dia(6).contexto),{aceitouOferta:true}),undefined);
console.log('✓ validade, penteado, capacete, grupo escondido, convite, entrega, piscina, sacola e agrados');
// Uma resposta ainda não ouvida é uma conferência possível, nunca uma fala inventada.
const beto=structuredClone(dia(2).fila.find(v=>v.ficha==='beto'));beto.rosto={...beto.docs.find(d=>d.tipo==='carteirinha').foto};
const semPergunta=revisar(2,beto,'entra'),comPergunta=revisar(2,beto,'entra',{perguntas:['numero']});
assert.match(semPergunta.visitante,/Beto \(dizendo ser Bento\)/);assert.match(semPergunta.motivo,/Uma pergunta permitiria/);assert.match(comPergunta.motivo,/Na resposta registrada/);assert.match(comPergunta.motivo,/0127/);
assert.match(semPergunta.conferir,/Perguntem/);
const numeroErrado=structuredClone(dia(2).fila.find(v=>v.ficha==='bento'));numeroErrado.docs[0].numero='9999';assert.match(revisar(2,numeroErrado,'entra').motivo,/9999.*0215/);
const conviteErrado=structuredClone(estella);conviteErrado.docs[0].numeroDoSocio='9999';assert.match(revisar(3,conviteErrado,'entra').motivo,/Noel \(9999\)/);
const grupoErrado=structuredClone(turma);grupoErrado.grupo.push('noel');assert.match(revisar(6,grupoErrado,'entra').motivo,/Fora da relação do convite: Noel/);
const f=P.fecharODia(P.diaPorNumero(1),[at(h,'entra'),at(alp,'hojeNao'),at(h,null)],dia(1).contexto);assert.equal(f.revisoes.length,2);
const caro=dia(2).fila.find(v=>v.ficha==='preguica');const d2=dia(2);const fim=P.fecharODia(P.diaPorNumero(2),[at(d2.fila.find(v=>v.ficha==='jeanluc'),'entra'),at(caro,'hojeNao')],d2.contexto);assert.equal(fim.revisoes[0].visitante,'Dona Preguiça');
const intactos=JSON.stringify({v:h,ctx:dia(1).contexto});revisar(1,h,'entra');assert.equal(JSON.stringify({v:h,ctx:dia(1).contexto}),intactos);
console.log('✓ nomes verdadeiros, respostas não perguntadas, prioridade e visitantes não atendidos');
const cobertos=new Set();
for(let n=1;n<=6;n++)for(let seed=1;seed<=40;seed++){
 const d=P.montarDia(n,seed,new Set());
 for(const v of d.fila){
  const certo=P.carimboCerto(v,d.contexto),confiscados=P.proibidosNaSacola(v,d.contexto);
  assert.equal(P.fecharODia(P.diaPorNumero(n),[at(v,certo,{confiscados,aceitouOferta:false})],d.contexto).revisoes.length,0);
  for(const c of ['entra','soClube','hojeNao']){
   const a=at(v,c),av=P.avaliarAtendimento(a,d.contexto),fim=P.fecharODia(P.diaPorNumero(n),[a],d.contexto);
   assert.equal(fim.revisoes.length,av.erros.length?1:0);
   for(const rev of fim.revisoes){for(const t of Object.values(rev)){assert.equal(typeof t,'string');assert.ok(t.length>0);assert.doesNotMatch(t,/undefined|doc:[a-z]|manual:[a-z]|transcricao:/);}assert.equal(rev.visitante,P.quemNoEnvelope(v));}
   for(const ds of P.diferencas(v,d.contexto))if(!ds.aparente)cobertos.add(ds.problema);
  }
 }
 const todos=d.fila.map(v=>at(v,'entra'));assert.ok(P.fecharODia(P.diaPorNumero(n),todos,d.contexto).revisoes.length<=2);
 assert.deepEqual(P.fecharODia(P.diaPorNumero(n),d.fila.map(v=>at(v,null)),d.contexto).revisoes,[]);
}
console.log(`✓ seis dias × 40 sementes: ${cobertos.size} tipos de irregularidade, todos os carimbos e limite de dois casos`);
console.log('tudo certo');
