/** Regras dos prêmios: seis dias, ambos os guarda-roupas e idempotência. */
import { build } from 'esbuild';
import assert from 'node:assert/strict';
const r=await build({stdin:{contents:"export {concederPremiosDaGina} from './src/eventos/portaria/premiosDaGina';export {PREMIOS_DA_PORTARIA} from './src/world/itens';export {premiosPendentes,CHAVE_DO_PREMIO} from './src/minigames/portaria/premios';export {podeTingir} from './src/world/tintas'",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node'});
const P=await import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));
function mock(){const stats={},flags={},premios=new Set(),armarios={ari:new Set(),renan:new Set()},memorias=[];return{stats,flags,premios,armarios,memorias,stat:k=>stats[k]??0,flag:k=>flags[k]===true,setFlag:(k,v=true)=>flags[k]=v,ganharPeca:p=>{const nova=!premios.has(p.id);premios.add(p.id);for(const a of Object.values(armarios))a.add(p.id);return nova;},unlock:m=>memorias.push(m)};}
for(let n=1;n<=6;n++){
 const s=mock();for(const estrelas of [0,1,2]){s.stats[`portaria:dia:${n}:estrelas`]=estrelas;assert.deepEqual(P.concederPremiosDaGina(s),[]);assert.equal(s.premios.size,0);}
 s.stats[`portaria:dia:${n}:estrelas`]=3;assert.deepEqual(P.concederPremiosDaGina(s),[n]);
 const ids=P.PREMIOS_DA_PORTARIA[n].map(p=>p.id);assert.equal(ids.length,n===6?3:1);
 for(const p of P.PREMIOS_DA_PORTARIA[n]){assert.ok(s.armarios.ari.has(p.id)&&s.armarios.renan.has(p.id));assert.equal(p.tipo,'vestivel');assert.equal(p.preco,undefined);assert.notEqual(p.funcional,true);assert.equal(P.podeTingir(p),false);assert.equal(typeof p.extra,'function');}
 assert.deepEqual(P.concederPremiosDaGina(s),[]);assert.equal(s.premios.size,ids.length);assert.equal(s.memorias.length,n===6?1:0);
 console.log(`✓ dia ${n}: exige três estrelas, entrega ${ids.length} peça(s) para os dois e não repete`);
}
const antigo=mock();for(let n=1;n<=6;n++)antigo.stats[`portaria:dia:${n}:estrelas`]=3;
assert.deepEqual(P.premiosPendentes(antigo),[1,2,3,4,5,6]);assert.deepEqual(P.concederPremiosDaGina(antigo),[1,2,3,4,5,6]);assert.equal(antigo.premios.size,8);
const reaberto=mock();Object.assign(reaberto.stats,JSON.parse(JSON.stringify(antigo.stats)));Object.assign(reaberto.flags,JSON.parse(JSON.stringify(antigo.flags)));assert.deepEqual(P.concederPremiosDaGina(reaberto),[]);
console.log('✓ marcas antigas e flags persistidas: oito peças, sem exigir repetir os dias nem duplicar a entrega');
console.log('tudo certo');
