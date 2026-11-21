/** A primeira semana fica fixa mesmo quando a escala ganhar dias novos. */
import { build } from 'esbuild';
import assert from 'node:assert/strict';
const r=await build({stdin:{contents:"export * from './src/minigames/portaria/homenagem'",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node'});
const p=await import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));
assert.deepEqual(p.DIAS_DA_PRIMEIRA_SEMANA,[1,2,3,4,5,6]);
for(const estrelas of [0,1,2,3]){
 const stats={};for(let n=1;n<=6;n++){stats[`portaria:dia:${n}:vezes`]=1;stats[`portaria:dia:${n}:estrelas`]=estrelas;}
 const s={stat:k=>stats[k]??0,flag:()=>false};
 assert.equal(p.homenagemDaGinaPendente(s),true);
 for(let n=1;n<=6;n++){stats[`portaria:dia:${n}:vezes`]=0;assert.equal(p.homenagemDaGinaPendente(s),false);stats[`portaria:dia:${n}:vezes`]=1;}
 assert.equal(p.homenagemDaGinaPendente({...s,flag:k=>k===p.HOMENAGEM_DA_GINA}),false);
}
console.log('✓ exige os seis dias concluídos, independe de estrelas e não repete');
console.log('✓ marco da primeira semana permanece em 1–6 para futuras expansões');
