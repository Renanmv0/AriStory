/** Memória persistente, replays e retornos sem Three.js. */
import {build} from 'esbuild';
import assert from 'node:assert/strict';
const r=await build({stdin:{contents:"export * from './src/minigames/portaria/index'",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node'});
const P=await import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));
function save(){const stats=new Map(),flags=new Map(),dados=new Map();return{stat:k=>stats.get(k)??0,bump:(k,v=1)=>{stats.set(k,(stats.get(k)??0)+v);return stats.get(k);},flag:k=>flags.get(k)??false,setFlag:(k,v=true)=>flags.set(k,v),retomada:k=>dados.has(k)?JSON.parse(dados.get(k)):null,guardarRetomada:(k,v)=>dados.set(k,JSON.stringify(v)),dados};}
const at=(v,c)=>({visitante:v,carimbo:c,perguntas:[],apontados:[],confiscados:[]});
const novo=(s,n,semente=7)=>new P.Expediente(n,semente,P.fatosAntesDoDia(s,n),P.encontrosAntesDoDia(s,n));
function certo(e,v){const ds=P.diferencas(v,e.contexto);for(const d of ds)for(const p of d.pistas)if(p.startsWith('transcricao:')&&!e.janela.perguntas.includes(p.slice(12)))e.perguntar(p.slice(12));for(const d of ds)e.apontar(...d.pistas);for(const i of P.proibidosNaSacola(v,e.contexto))e.confiscar(i);return P.carimboCerto(v,e.contexto);}
// Um barrado de verdade reaparece com a mesma identidade, rosto e matrícula.
const s=save(),d1=novo(s,1),v=d1.fila.find(v=>v.id.startsWith('figurante'));
const fim=P.fecharODia(d1.dia,[at(v,'hojeNao'),at(d1.fila.find(x=>x.ficha==='alpacina'),null)],d1.contexto);
P.registrarODia(s,1,fim);
assert.equal(P.encontrosAntesDoDia(s,2).length,1);assert.equal(P.encontrosAntesDoDia(s,1).length,0);
const d2=novo(s,2),voltou=d2.fila.find(x=>P.identidadeDaPortaria(x)===P.identidadeDaPortaria(v));
assert.ok(voltou,'o barrado volta na fila seguinte');assert.deepEqual(voltou.rosto,v.rosto);assert.equal(voltou.docs.find(x=>x.tipo==='carteirinha').numero,v.docs.find(x=>x.tipo==='carteirinha').numero);assert.match(voltou.chegada[0],/não me deixaram entrar ontem/);assert.equal(P.carimboCerto(voltou,d2.contexto),'entra');
assert.equal(d2.fila.length,P.montarDia(2,7,P.fatosAntesDoDia(s,2)).fila.length);assert.equal(d2.fila.filter(x=>P.identidadeDaPortaria(x)===P.identidadeDaPortaria(v)).length,1);
console.log('✓ persistência JSON, retorno, identidade, documento corrigido e fila do mesmo tamanho');
// Repetir o primeiro dia troca só suas lembranças; ele não enxerga o futuro.
P.registrarODia(s,1,P.fecharODia(d1.dia,[at(v,'entra')],d1.contexto));
assert.equal(P.encontrosAntesDoDia(s,2).length,1);assert.equal(P.encontrosAntesDoDia(s,2)[0].carimbo,'entra');
const encontro=structuredClone(v);P.recordarChegada(encontro,P.ultimosEncontros(P.encontrosAntesDoDia(s,2),2),2);assert.match(encontro.chegada[0],/me atenderam ontem/);
assert.equal(novo(s,1).fila.some(x=>x.chegada?.some(f=>f.includes('Vocês me atenderam'))),false);
// A pessoa é o Beto, mesmo se ele disse ser o Bento.
const b2=P.montarDia(2,7,new Set()).fila.find(x=>x.ficha==='beto'),mem=P.lembrarAtendimento(2,b2,'hojeNao');assert.equal(mem.nome,'Beto');
const m3=P.montarDia(3,7,new Set(),[mem]);assert.match(m3.fila.find(x=>x.ficha==='beto').chegada[0],/não me deixaram/);assert.doesNotMatch(m3.fila.find(x=>x.ficha==='bento').chegada?.[0]??'',/não me deixaram/);
const alp=P.montarDia(5,7,new Set()).fila.find(x=>x.ficha==='alpacina');const a6=P.montarDia(6,7,new Set(),[P.lembrarAtendimento(5,alp,'soClube')]).fila.find(x=>x.ficha==='alpacina');assert.match(a6.chegada[0],/sem piscina/);assert.equal(a6.rosto.cabelo,'trofeu');
const noel=P.montarDia(1,7,new Set()).fila.find(x=>x.ficha==='noel');assert.equal(P.lembrarAtendimento(1,noel,'hojeNao'),null);const copiado=structuredClone(noel);P.recordarChegada(copiado,[{...mem,ficha:'noel',nome:'Noel'}],3);assert.deepEqual(copiado,noel);
assert.deepEqual(P.normalizarEncontros([null,{}, {dia:99}, {...mem,rosto:null}]),[]);
console.log('✓ replay, ordem cronológica, identidade dos gêmeos, penteados e conhecidos preservados');
// Duas semanas em três políticas e várias sementes: também cobre retornos de espécies nomeadas.
let retornos=0;
for(const politica of ['certo','barrar','entrar'])for(let seed=1;seed<=40;seed++){
 const arq=save();for(let n=1;n<=P.DIAS.length;n++){
  const e=novo(arq,n,seed),base=P.montarDia(n,seed,P.fatosAntesDoDia(arq,n));assert.equal(e.fila.length,base.fila.length);
  const tem=tipo=>e.fila.some(v=>v.docs.some(d=>d.tipo===tipo));if(n>=3){assert.ok(tem('carteirinha'));assert.ok(tem('convite'));}if(n>=4)assert.ok(tem('ordem'));if(n>=5)assert.ok(e.fila.some(v=>!v.querPiscina&&v.docs.some(d=>d.tipo==='convite')));
  const programados=new Set(base.fila.filter(v=>!v.id.startsWith('figurante')).map(P.identidadeDaPortaria));
  const atuais=new Set();for(const v of e.fila){assert.equal(P.carimboCerto(v,e.contexto),v.espera,`${n} ${seed} ${v.nome}`);if(v.id.startsWith('figurante')){const id=P.identidadeDaPortaria(v);assert.ok(!programados.has(id));assert.ok(!atuais.has(id));atuais.add(id);if(v.chegada?.[0]?.includes('não me deixaram'))retornos++;}}
  let v;while((v=e.proximo()))e.carimbar(politica==='certo'?certo(e,v):politica==='barrar'?'hojeNao':'entra');const fim=e.terminar();if(politica==='certo')assert.equal(fim.estrelas,3,`${n} ${seed}`);P.registrarODia(arq,n,fim);
  const guardados=P.normalizarEncontros(arq.retomada(P.CHAVE_DOS_ENCONTROS));assert.ok(guardados.length<=288);assert.ok(guardados.every(x=>x.dia<=n));
 }
}
assert.ok(retornos>0);console.log(`✓ doze dias × 40 sementes × três políticas; ${retornos} retornos, sem perder mistura ou cenas`);
console.log('tudo certo');
