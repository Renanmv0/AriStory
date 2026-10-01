/**
 * A APOSTILA DO GATITO — as lições e as regras, antes do livro.
 *
 * Tudo aqui é LÓGICA PURA (`src/minigames/aula/`), então o teste não abre o
 * navegador: empacota os módulos com o esbuild que o Vite já traz e roda no
 * Node, como o `cartas.mjs` do jardim.
 *
 * O que ele cobra:
 *
 * 1. AS LIÇÕES DOS DOIS MÓDULOS bem montadas (`conferirModulo`): toda opção certa existe,
 *    toda lacuna tem resposta e porquê, nenhum distrator é também resposta,
 *    todo grupo tem alguém, toda tabela tem as colunas certas, e cada lição
 *    tem pelo menos cinco exercícios de cinco tipos DIFERENTES — o pedido do
 *    Renan é "exercícios bastante variados".
 * 2. A NOTA: terminar vale uma estrela, 65% de primeira vale duas, 90% três.
 * 3. O DIGITADO: maiúscula, espaço e pontuação não importam; acento esquecido
 *    vale (com aviso); "em baixo" não é "embaixo".
 * 4. A TRAVA: a lição só abre com a aula dada E a anterior concluída; a lição
 *    da vez é a primeira sem estrela.
 * 5. O LIVRO: duas páginas de rosto, quatro por lição — a explicação de toda
 *    lição começa na página da ESQUERDA de uma dupla, para as duas páginas
 *    dela ficarem lado a lado no computador (e os exercícios, na dupla
 *    seguinte).
 * 6. O EMBARALHO: repetível, e nunca devolve a ordem certa.
 *
 * Uso: node scripts/apostila.mjs
 */
import { build } from 'esbuild';

const saida = await build({
  stdin: {
    contents: `export * from './src/minigames/aula/apostila';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const url = `data:text/javascript;base64,${Buffer.from(saida.outputFiles[0].text).toString('base64')}`;
const A = await import(url);

let falhas = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`  ok  ${msg}`);
  else {
    falhas += 1;
    console.log(`  XX  ${msg}`);
  }
};

// ------------------------------------------------------------ 1. as lições
console.log('\n1. as lições');
const M = A.MODULO_1;
const problemas = A.conferirModulo(M);
for (const p of problemas) console.log(`      · ${p}`);
ok(problemas.length === 0, `o módulo sem problemas (${problemas.length})`);
ok(M.licoes.length === 6, `seis lições (${M.licoes.length})`);
for (const l of M.licoes) {
  const tipos = new Set(l.exercicios.map((e) => e.tipo));
  console.log(`      ${l.numero}. ${l.titulo} — ${l.exercicios.length} exercícios, ${tipos.size} tipos, ${A.itensDaLicao(l)} itens`);
}
const todosOsTipos = new Set(M.licoes.flatMap((l) => l.exercicios.map((e) => e.tipo)));
ok(todosOsTipos.size === 10, `os dez tipos de exercício aparecem no módulo (${[...todosOsTipos].join(', ')})`);
const temas = new Set(M.licoes.map((l) => l.subtitulo));
ok(temas.size === 6, 'cada lição com uma situação diferente');

// sabotagem: o conferidor tem que pegar erro de verdade
const quebrado = structuredClone(M);
quebrado.licoes[0].exercicios[3].itens[0].certa = 7;
quebrado.licoes[1].exercicios.find((e) => e.tipo === 'lacunas').distratores = ['jantar'];
const pegos = A.conferirModulo(quebrado);
ok(pegos.length >= 2, `o conferidor pega a lição sabotada (${pegos.length} problemas)`);

// quem chama cada aula (pedido do Renan): a Luna a 1, a Sol a 2, a Estrella a 3
ok(M.licoes.slice(0, 3).map((l) => l.aula.chama).join(',') === 'luna,sol,estrella', 'a Luna chama a 1ª aula, a Sol a 2ª e a Estrella a 3ª');
ok(M.licoes.slice(3).every((l) => l.aula.chama === 'qualquer'), 'da 4ª em diante, qualquer uma das três chama');
ok(A.irmasNoGinasio(0).join() === 'luna' && A.irmasNoGinasio(1).join() === 'luna,sol' && A.irmasNoGinasio(2).length === 3,
  'no ginásio: só a Luna, depois a Luna e a Sol, depois as três');

// ---------------------------------------------------------- 1b. o Módulo 2
console.log('\n1b. o Módulo 2');
const M2 = A.MODULO_2;
const problemas2 = A.conferirModulo(M2);
for (const p of problemas2) console.log(`      · ${p}`);
ok(problemas2.length === 0, `o Módulo 2 sem problemas (${problemas2.length})`);
ok(M2.licoes.length === 6 && M2.licoes.map((l) => l.numero).join() === '7,8,9,10,11,12',
  `seis lições, numeradas de 7 a 12 — a numeração continua (${M2.licoes.map((l) => l.numero).join()})`);
for (const l of M2.licoes) {
  const tipos = new Set(l.exercicios.map((e) => e.tipo));
  console.log(`      ${l.numero}. ${l.titulo} — ${l.explicacao.length} de explicação, ${l.exercicios.length} exercícios, ${tipos.size} tipos, ${A.itensDaLicao(l)} itens`);
}
ok(new Set(M2.licoes.flatMap((l) => l.exercicios.map((e) => e.tipo))).size === 10, 'os dez tipos de exercício aparecem no Módulo 2');
const todasAsLicoes = A.MODULOS.flatMap((m) => m.licoes);
ok(new Set(todasAsLicoes.map((l) => l.id)).size === todasAsLicoes.length, 'nenhum id repetido no curso (é a chave do save)');
ok(new Set(todasAsLicoes.map((l) => l.subtitulo)).size === todasAsLicoes.length, 'cada lição do curso com uma situação diferente');
ok(M2.licoes.every((l) => l.aula.chama === 'qualquer'), 'no Módulo 2, qualquer uma das três chama a aula');
ok(A.licoesAntesDe(M2) === 6 && A.licoesAntesDe(M) === 0, 'o Módulo 2 começa depois das seis do 1');
// sabotagem: uma lição do Módulo 2 com o número do Módulo 1
const m2ruim = structuredClone(M2);
m2ruim.licoes[0].numero = 1;
ok(A.conferirModulo(m2ruim).some((e) => e.includes('número')), 'o conferidor cobra a numeração continuada');

// ------------------------------------------------------------- 2. a nota
console.log('\n2. a nota');
ok(A.estrelasPor(0, 25) === 1, 'terminar com tudo errado ainda vale uma estrela');
ok(A.estrelasPor(16, 25) === 1 && A.estrelasPor(17, 25) === 2, '65% é a linha das duas');
ok(A.estrelasPor(22, 25) === 2 && A.estrelasPor(23, 25) === 3, '90% é a linha das três');
ok(A.estrelasPor(25, 25) === 3, 'tudo certo, três');

// ---------------------------------------------------------- 3. o digitado
console.log('\n3. o digitado');
ok(A.conferirDigitado('Tchau!', ['tchau']) === 'certo', '"Tchau!" com maiúscula e exclamação');
ok(A.conferirDigitado('  a   gente ', ['a gente']) === 'certo', 'espaço sobrando');
ok(A.conferirDigitado('paozinho', ['pãozinho']) === 'acento', 'sem o til: vale, com aviso');
ok(A.conferirDigitado('maracuja', ['maracujá']) === 'acento', 'sem o acento agudo');
ok(A.conferirDigitado('em baixo', ['embaixo']) === 'errado', '"em baixo" não é "embaixo"');
ok(A.conferirDigitado('', ['tchau']) === 'errado', 'em branco é errado');
ok(A.conferirDigitado('chao', ['tchau']) === 'errado', '"chao" não é "tchau"');

// ------------------------------------------------------------ 4. a trava
console.log('\n4. a trava');
const ids = M.licoes.map((l) => l.id);
const nada = { estrelas: {}, abertas: [] };
ok(!A.licaoLiberada(M, nada, 0), 'sem aula nenhuma, nem a lição 1 abre');
ok(A.licaoDaVez(M, nada).id === ids[0], 'a primeira aula é a lição 1');
const umaAula = { estrelas: {}, abertas: [ids[0]] };
ok(A.licaoLiberada(M, umaAula, 0), 'a aula dada abre a lição 1');
ok(!A.licaoLiberada(M, umaAula, 1), 'e só ela');
const pulando = { estrelas: {}, abertas: [ids[0], ids[1]] };
ok(!A.licaoLiberada(M, pulando, 1), 'a lição 2 não abre sem a 1 concluída, nem com a aula dada');
const feita = { estrelas: { [ids[0]]: 2 }, abertas: [ids[0]] };
ok(A.licaoDaVez(M, feita).id === ids[1], 'com a 1 concluída, a aula da vez é a 2');
ok(!A.licaoLiberada(M, feita, 1), 'e a 2 espera a aula');
const tudo = { estrelas: Object.fromEntries(ids.map((id) => [id, 3])), abertas: ids };
ok(A.licaoDaVez(M, tudo) === null, 'módulo terminado: não tem aula da vez');
ok(A.estrelasDoModulo(M, tudo) === 18, 'dezoito estrelas no máximo');

// o CURSO: o Módulo 2 só tem aula da vez com o Módulo 1 inteiro
const ids2 = M2.licoes.map((l) => l.id);
ok(A.licaoDaVezNoCurso(feita).id === ids[1], 'no curso, com o Módulo 1 pela metade, a aula da vez é dele');
ok(A.licaoDaVezNoCurso(tudo).id === ids2[0], 'com o Módulo 1 inteiro, a aula da vez é a lição 7');
ok(A.moduloConcluido(M, tudo) && !A.moduloConcluido(M2, tudo), 'o Módulo 1 concluído, o 2 não');
const tudoTudo = { estrelas: Object.fromEntries([...ids, ...ids2].map((id) => [id, 3])), abertas: [...ids, ...ids2] };
ok(A.licaoDaVezNoCurso(tudoTudo) === null, 'o curso inteiro terminado: não tem aula da vez');
ok(A.moduloAtual(tudo).id === 'modulo-1' && A.moduloAtual({ ...tudo, abertas: [...ids, ids2[0]] }).id === 'modulo-2',
  'fora da aula, o livro é o do módulo da última lição dada');
ok(A.moduloDaLicao(ids2[3])?.id === 'modulo-2' && A.moduloDaLicao(ids[0])?.id === 'modulo-1', 'cada lição sabe o seu módulo');
ok(A.licoesConcluidasNoCurso(tudoTudo) === 12, 'doze lições no curso');

// ------------------------------------------------------------ 5. o livro
console.log('\n5. o livro');
const paginas = A.paginasDoModulo(M);
ok(paginas.length % 2 === 0, `${paginas.length} páginas, número par: a última dupla fecha`);
/** a ordem das páginas de uma lição: explicação(ões), exercício(s), fechamento, e a de anotações se der ímpar */
const conferirLicao = (m, pgs, i) => {
  const l = m.licoes[i];
  const p = A.primeiraPaginaDa(m, i);
  const minhas = pgs.filter((x) => x.licao === i);
  const tipos = minhas.map((x) => x.tipo);
  const esperado = [
    ...l.explicacao.map(() => 'explicacao'),
    ...A.paginasDeExercicio(l).map(() => 'exercicios'),
    'fechamento',
  ];
  if (esperado.length % 2) esperado.push('anotacoes');
  return p % 2 === 0 && pgs[p] === minhas[0] && tipos.join() === esperado.join()
    && A.paginaDosExercicios(m, i) === p + l.explicacao.length;
};
const paginas2 = A.paginasDoModulo(M2);
ok(paginas2.length % 2 === 0 && M2.licoes.every((_, i) => conferirLicao(M2, paginas2, i)),
  `o livro do Módulo 2: ${paginas2.length} páginas, toda lição começando na esquerda da dupla`);
M.licoes.forEach((l, i) => {
  ok(conferirLicao(M, paginas, i), `lição ${i + 1}: começa na esquerda da dupla (p. ${A.primeiraPaginaDa(M, i) + 1}), ${l.explicacao.length} de explicação, exercícios e fechamento`);
});
// O LIVRO FLEXÍVEL: uma lição com três páginas de explicação e exercícios em
// duas, outra com três de explicação (dá ímpar: ganha a de anotações)
const flex = structuredClone(M);
flex.licoes[0].explicacao = [...flex.licoes[0].explicacao, flex.licoes[0].explicacao[1]];
flex.licoes[0].exercicios[3].novaPagina = true;
flex.licoes[1].explicacao = [...flex.licoes[1].explicacao, flex.licoes[1].explicacao[1]];
const pf = A.paginasDoModulo(flex);
ok(A.paginasDeExercicio(flex.licoes[0]).map((x) => `${x.de}-${x.ate}`).join() === `0-3,3-${flex.licoes[0].exercicios.length}`,
  '`novaPagina` quebra os exercícios em duas páginas');
ok(pf.filter((x) => x.licao === 0).length === 6 && pf.filter((x) => x.licao === 1).at(-1).tipo === 'anotacoes',
  'três de explicação e dois de exercício: seis páginas; três e um: cinco, e a de anotações completa');
ok(flex.licoes.every((_, i) => conferirLicao(flex, pf, i)) && pf.length % 2 === 0,
  'com páginas a mais, toda lição continua começando na esquerda da dupla');
ok(A.conferirModulo(flex).length === 0, 'o conferidor aceita lição de qualquer tamanho');
const semExplicacao = structuredClone(M);
semExplicacao.licoes[2].explicacao = [];
ok(A.conferirModulo(semExplicacao).some((e) => e.includes('explicação')), 'mas não aceita lição sem nenhuma página de explicação');

// --------------------------------------------------------- 6. o embaralho
console.log('\n6. o embaralho');
const frase = ['A gente', 'se', 'vê', 'amanhã!'];
const e1 = A.embaralhar(frase, 'x');
const e2 = A.embaralhar(frase, 'x');
ok(e1.join('|') === e2.join('|'), 'a mesma semente, a mesma ordem');
let igual = 0;
for (let s = 0; s < 500; s++) if (A.embaralhar(frase, `s${s}`).join('|') === frase.join('|')) igual += 1;
ok(igual === 0, 'nunca devolve a frase montada (500 sementes)');
ok([...e1].sort().join('|') === [...frase].sort().join('|'), 'não perde nem inventa peça');

console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
