/**
 * A PORTARIA DO CLUBE — as regras do minigame, antes da cena
 * (`src/minigames/portaria/`, `docs/PORTARIA-DO-CLUBE.md` §14, etapa 1).
 *
 * Tudo é LÓGICA PURA: o teste empacota com o esbuild e roda no Node, como o
 * `apostila.mjs` e o `cartas.mjs`. O que ele cobra:
 *
 * 1. OS PERSONAGENS: cada ficha com bordão, as falas de cada momento e as cinco
 *    animações; bordões distintos (para lembrar de quem volta); nada de rato,
 *    golfinho ou barata em lugar nenhum.
 * 2. OS DIAS, em centenas de sementes e nos três caminhos da semana (sem fatos,
 *    jogando certo, jogando tudo errado): o carimbo que o roteiro ESPERA é o
 *    que os PAPÉIS dizem; todo visitante errado pode ser pego com as
 *    ferramentas do dia; ninguém traz papel de regra que ainda não vale; um
 *    terço (mais ou menos) com alguma coisa errada; os fatos de cada um estão
 *    na lista do dia.
 * 3. PERGUNTAR E APONTAR: a validade do Hipólito, o capacete do Capy, o
 *    penteado da Alpacina, o número do Beto (só depois de perguntar), a
 *    Dona Preguiça cochilando, a Luna atrás da Tia Liz, o bigode do Jean-Luc,
 *    o boliche do Tatá; e o dia 1 sem lista nem pergunta.
 * 4. O FIM DO DIA: jogando certo, três estrelas, nada de erro e o Boletim bom;
 *    jogando tudo errado, o envelope menor (nunca negativo), menos estrelas e
 *    as manchetes ruins na frente; a fila pela metade tira a terceira estrela.
 * 5. A SEMANA NO SAVE: o dia seguinte abre por terminar; refazer um dia troca os
 *    fatos dele; as consequências chegam nos dias seguintes (o Hipólito
 *    renovado ou não, o Walter de salada, o Mano com casquinha para a fila);
 *    os chamados da fila (o Noel de verdade atrás do falso, o Bento sem
 *    carteirinha no lugar do de sempre); a semana terminada e os prêmios.
 *
 * Uso: node scripts/portaria.mjs
 */
import { build } from 'esbuild';

const saida = await build({
  stdin: { contents: `export * from './src/minigames/portaria/index';`, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, write: false, format: 'esm', platform: 'node',
});
const P = await import(`data:text/javascript;base64,${Buffer.from(saida.outputFiles[0].text).toString('base64')}`);

let falhas = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`  ok  ${msg}`);
  else { falhas += 1; console.log(`  XX  ${msg}`); }
};

// ======================================================= 1. os personagens
console.log('\n1. os personagens');
const fichas = Object.values(P.FICHAS);
const MOMENTOS = ['chegada', 'entra', 'barrado', 'aToa', 'irritado', 'motivo', 'pego'];
const semFala = fichas.filter((f) => !f.bordao || MOMENTOS.some((m) => !f[m]?.length));
ok(!semFala.length, `as ${fichas.length} fichas com bordão e fala em cada momento${semFala.length ? ' — faltam: ' + semFala.map((f) => f.id) : ''}`);
const semAnim = fichas.filter((f) => ['chegada', 'tique', 'entra', 'barrado', 'apontado'].some((a) => !f.animacoes?.[a]));
ok(!semAnim.length, `cada uma com as cinco animações${semAnim.length ? ' — faltam: ' + semAnim.map((f) => f.id) : ''}`);
const recorrentes = ['hipolito', 'alpacina', 'bento', 'beto', 'tata', 'preguica', 'lontra', 'bode', 'coala', 'pandaVermelho', 'texugo'];
const bordoes = recorrentes.map((id) => P.FICHAS[id].bordao);
ok(new Set(bordoes).size === bordoes.length, 'os recorrentes e os figurantes com bordões distintos');
const jeitos = recorrentes.map((id) => P.FICHAS[id].jeito);
ok(new Set(jeitos).size === jeitos.length, `cada recorrente com um jeito de responder próprio (${jeitos.join(', ')})`);
const tudo = JSON.stringify({ fichas: P.FICHAS, manchetes: P.MANCHETES, dicas: P.DICAS_DO_PARCEIRO, nomes: P.NOMES_DOS_FIGURANTES, gina: P.DIAS.map((d) => d.gina) });
const proibidas = /\b(ratos?|camundongos?|ratazanas?|golfinhos?|baratas?)\b/i;
ok(!proibidas.test(tudo), 'nada de rato, golfinho ou barata nos textos');

// ======================================================== jogar um dia
/** a decisão CERTA para um visitante: o carimbo da conferência, os proibidos confiscados, a primeira diferença apontada */
const jogarCerto = (v, ctx) => {
  const ds = P.diferencas(v, ctx);
  const perguntas = new Set();
  const apontados = [];
  const pegavel = ds.find((d) => d.pistas.every((p) => P.pistaDisponivel(p, ctx, new Set(d.pistas.filter((x) => x.startsWith('transcricao:')).map((x) => x.slice(12))))));
  if (pegavel) {
    for (const p of pegavel.pistas) if (p.startsWith('transcricao:')) perguntas.add(p.slice(12));
    const r = P.apontar(v, ctx, pegavel.pistas[0], pegavel.pistas[1], perguntas);
    apontados.push({ pistas: pegavel.pistas, diferenca: r.diferenca });
  }
  return {
    visitante: v, carimbo: P.carimboCerto(v, ctx), perguntas: [...perguntas], apontados,
    confiscados: P.proibidosNaSacola(v, ctx),
    aceitouOferta: v.oferta ? v.oferta.item === 'arepita' : undefined,
  };
};
/** a decisão de quem deixa TODO MUNDO entrar, sem olhar a sacola e aceitando todo agrado */
const jogarErrado = (v) => ({
  visitante: v, carimbo: 'entra', perguntas: [], apontados: [], confiscados: [], aceitouOferta: v.oferta ? true : undefined,
});

/** joga um dia inteiro, seguindo os chamados da fila */
const jogarODia = (n, semente, fatos, decidir, quantos = Infinity) => {
  const m = P.montarDia(n, semente, fatos);
  let fila = [...m.fila];
  const ats = [];
  for (let i = 0; i < fila.length; i++) {
    if (ats.length >= quantos) { ats.push({ visitante: fila[i], carimbo: null, perguntas: [], apontados: [], confiscados: [] }); continue; }
    const a = decidir(fila[i], m.contexto);
    ats.push(a);
    fila = P.chamarNaFila(fila, i, a.carimbo, m.reservas);
  }
  return { m, ats, fim: P.fecharODia(m.dia, ats, m.contexto), fila };
};

/** um save de mentira (o pedaço do GameAPI que as regras usam) */
const novoSave = () => {
  const stats = new Map();
  const flags = new Map();
  return {
    stat: (k) => stats.get(k) ?? 0,
    bump: (k, by = 1) => { stats.set(k, (stats.get(k) ?? 0) + by); return stats.get(k); },
    flag: (k) => flags.get(k) ?? false,
    setFlag: (k, v = true) => flags.set(k, v),
    flags,
  };
};

/** joga a semana inteira com uma decisão, devolvendo os fatos antes de cada dia */
const jogarASemana = (decidir, semente = 1) => {
  const s = novoSave();
  const porDia = [];
  for (const dia of P.DIAS) {
    const antes = P.fatosAntesDoDia(s, dia.numero);
    const r = jogarODia(dia.numero, semente, antes, decidir);
    P.registrarODia(s, dia.numero, r.fim);
    porDia.push({ antes, ...r });
  }
  return { s, porDia };
};

// ============================================================ 2. os dias
console.log('\n2. os dias');
ok(P.DIAS.length === 6, `seis dias (${P.DIAS.length})`);
const certa = jogarASemana(jogarCerto);
const errada = jogarASemana(jogarErrado);
/** a decisão de quem BARRA todo mundo (é o caminho que monta os "foi barrado sem motivo" da semana) */
const barraTudo = (v) => ({ visitante: v, carimbo: 'hojeNao', perguntas: [], apontados: [], confiscados: [], aceitouOferta: v.oferta ? false : undefined });
const barrando = jogarASemana(barraTudo);
const caminhos = [
  ['sem fatos', () => new Set()],
  ['jogando certo', (n) => certa.porDia[n - 1].antes],
  ['jogando tudo errado', (n) => errada.porDia[n - 1].antes],
  ['barrando todo mundo', (n) => barrando.porDia[n - 1].antes],
];
ok(['josefina-barrada', 'noel-barrado', 'alpacina-barrada-pelo-penteado', 'preguica-barrada', 'carne-barrada'].every((f) => barrando.porDia.some((d) => d.fim.fatos.includes(f))),
  'barrando todo mundo, a semana grava os "barrado sem motivo" (Josefina, Noel, Alpacina, Dona Preguiça, a carne)');
const DOC_DA_REGRA = { convite: 'convite', conviteColetivo: 'coletivo', cracha: 'entrega', ordem: 'entrega', exame: 'exame' };
for (const dia of P.DIAS) {
  const n = dia.numero;
  const problemas = new Set();
  let total = 0;
  let errados = 0;
  let tamanhos = [];
  for (const [rotulo, fatos] of caminhos) {
    for (let semente = 1; semente <= 150; semente++) {
      const m = P.montarDia(n, semente, fatos(n));
      tamanhos.push(m.fila.length);
      const todos = [...m.fila, ...Object.values(m.reservas)];
      const ids = new Set(m.fila.map((v) => v.id));
      if (ids.size !== m.fila.length) problemas.add(`${rotulo}: ids repetidos na fila`);
      for (const v of todos) {
        if (!P.FICHAS[v.ficha]) problemas.add(`${v.id}: sem ficha ${v.ficha}`);
        const certo = P.carimboCerto(v, m.contexto);
        if (certo !== v.espera) problemas.add(`${rotulo} s${semente} ${v.id}: o roteiro espera ${v.espera} e os papéis dizem ${certo} (${P.diferencas(v, m.contexto).map((d) => d.problema)})`);
        for (const d of v.docs) {
          const regra = DOC_DA_REGRA[d.tipo];
          if (regra && !m.contexto.regras.has(regra)) problemas.add(`${v.id}: traz ${d.tipo} antes da regra`);
        }
        if (v.sacola?.some((i) => P.PROIBIDOS[i]) && !m.contexto.regras.has('sacola')) problemas.add(`${v.id}: proibido na sacola antes do dia 5`);
        const reais = P.diferencas(v, m.contexto).filter((d) => !d.aparente);
        if (certo !== 'entra') {
          const pegaveis = reais.filter((d) => P.ferramentasQuePegam(d, m.contexto).length);
          if (!pegaveis.length) problemas.add(`${rotulo} s${semente} ${v.id}: errado e ninguém pega (${reais.map((d) => d.problema)})`);
        }
        for (const d of P.diferencas(v, m.contexto).filter((x) => x.aparente)) {
          if (!P.ferramentasQuePegam(d, m.contexto).includes('apontar')) problemas.add(`${v.id}: a diferença aparente não se aponta`);
        }
        // os fatos que ele pode gravar estão na lista do dia
        const f = v.fatos ?? {};
        const possiveis = [...(f.entrou ?? []), ...(f.barrado ?? []), ...(f.aceitou ?? []), ...(f.recusou ?? []), ...(f.apontado ?? []),
          ...Object.values(f.passou ?? {}).flat()];
        for (const item of v.sacola ?? []) if (P.PROIBIDOS[item] && !f.passou?.[item]) possiveis.push({ caixaDeSom: 'som-alto-na-piscina', copoDeVidro: 'copo-quebrado', sabaoDeBolha: 'espuma-na-piscina', bolaDeFutebol: 'bola-na-piscina' }[item]);
        for (const fato of possiveis) if (!dia.fatos.includes(fato)) problemas.add(`dia ${n}: o fato ${fato} (${v.id}) não está na lista do dia`);
      }
      for (const v of m.fila) {
        if (/\d/.test(v.nome)) problemas.add(`${v.id}: nome com número (${v.nome})`);
        total += 1;
        if (P.carimboCerto(v, m.contexto) !== 'entra' || P.proibidosNaSacola(v, m.contexto).length) errados += 1;
      }
    }
  }
  const min = Math.min(...tamanhos);
  const max = Math.max(...tamanhos);
  for (const p of [...problemas].slice(0, 8)) console.log(`      · ${p}`);
  ok(problemas.size === 0, `dia ${n} (${dia.nome}): o roteiro bate com os papéis, todo errado é pegável, regra no dia certo, fatos declarados${problemas.size ? ` — ${problemas.size} problemas` : ''}`);
  const fracao = errados / total;
  ok(fracao > 0.2 && fracao < 0.62, `dia ${n}: ${Math.round(fracao * 100)}% da fila com alguma coisa errada (entre 20% e 62%)`);
  ok(min >= 8 && max <= 16, `dia ${n}: a fila de ${min} a ${max} visitantes`);
}

// =================================================== 3. perguntar e apontar
console.log('\n3. perguntar e apontar');
const achar = (n, id, fatos = new Set(), semente = 3) => {
  const m = P.montarDia(n, semente, fatos);
  const v = m.fila.find((x) => x.id === id) ?? m.reservas[id];
  return { v, ctx: m.contexto };
};
const nada = new Set();
{
  const { v, ctx } = achar(1, 'hipolito');
  const r = P.apontar(v, ctx, 'calendario', 'doc:carteirinha:validade', nada);
  ok(r.diferenca?.problema === 'vencida' && r.desfecho === 'seEnrola', `o Hipólito: a validade contra o calendário pega, e ele se enrola ("${r.falas[0]}")`);
  const aToa = P.apontar(v, ctx, 'doc:carteirinha:foto', 'rosto', nada);
  ok(aToa.diferenca === null, `apontar a foto dele à toa: "${aToa.falas[0]}"`);
  ok(!P.pistaDisponivel('lista', ctx, nada) && !P.pistaDisponivel('transcricao:nome', ctx, new Set(['nome'])), 'o dia 1 sem a lista e sem a pergunta');
}
{
  const { v, ctx } = achar(1, 'capy');
  const r = P.apontar(v, ctx, 'rosto', 'doc:carteirinha:foto', nada);
  ok(r.diferenca?.aparente && r.desfecho === 'seCorrige' && P.carimboCerto(v, ctx) === 'entra', `o Capy de capacete: apontado, tira o capacete e entra ("${r.falas[0]}")`);
}
{
  const { v, ctx } = achar(1, 'alpacina');
  ok(v.rosto.cabelo !== v.docs[0].foto.cabelo && P.apontar(v, ctx, 'rosto', 'doc:carteirinha:foto', nada).diferenca === null,
    'a Alpacina de coque com a foto de franja: penteado não conta');
}
{
  const { v, ctx } = achar(2, 'beto');
  const antesDePerguntar = P.apontar(v, ctx, 'transcricao:numero', 'doc:carteirinha:numero', nada);
  const p = P.perguntar(v, 'numero', false);
  const depois = P.apontar(v, ctx, 'transcricao:numero', 'doc:carteirinha:numero', new Set(['numero']));
  const rep = P.perguntar(v, 'numero', true);
  ok(antesDePerguntar.diferenca === null && p.valor === '0127' && depois.diferenca?.problema === 'respostaNaoBate' && depois.desfecho === 'confessa',
    `o Beto: o número só se aponta depois de perguntar ("${p.falas[0]}") — e confessa ("${depois.falas[0]}")`);
  ok(rep.repetida && rep.valor === '0127', `perguntar de novo irrita e não muda a resposta ("${rep.falas[0]}")`);
}
{
  const { v } = achar(2, 'preguica');
  const p = P.perguntar(v, 'numero', false);
  ok(p.falas.length === 3 && p.falas[1].includes('zZz') && p.falas.join(' ').includes('0009'), `a Dona Preguiça cochila no meio: ${p.falas.join(' / ')}`);
}
{
  const { v, ctx } = achar(6, 'tializ');
  const p = P.perguntar(v, 'quantos', false);
  const r = P.apontar(v, ctx, 'rosto', 'transcricao:quantos', new Set(['quantos']));
  ok(p.valor === '4' && r.diferenca?.problema === 'alguemEscondido' && r.desfecho === 'seCorrige' && P.carimboCerto(v, ctx) === 'entra',
    `a Tia Liz diz "${p.falas[0]}", só três na janela: apontado, a Luna aparece ("${r.falas[0]}")`);
}
{
  const { v, ctx } = achar(6, 'jeanlucDisfarcado');
  const r = P.apontar(v, ctx, 'doc:carteirinha:foto', 'rosto', nada);
  ok(r.diferenca?.problema === 'fotoNaoBate' && r.desfecho === 'confessa', `o "Noel" de bigode: a foto é de um peru ("${r.falas[0]}")`);
}
{
  const { v, ctx } = achar(4, 'tataBoliche');
  const r = P.apontar(v, ctx, 'doc:ordem:destino', 'manual:destinos', nada);
  ok(r.diferenca?.problema === 'destinoInexistente' && r.desfecho === 'confessa', `o Tatá e a Sala de Boliche: "${r.falas[0]}"`);
}
{
  const { v, ctx } = achar(4, 'alpacona');
  ok(P.apontar(v, ctx, 'rosto', 'doc:carteirinha:foto', nada).diferenca?.problema === 'fotoNaoBate', 'a Alpacona com a carteirinha da prima: a pinta do focinho entrega');
}
{
  const { v, ctx } = achar(3, 'hipolito');
  ok(P.carimboCerto(v, ctx) === 'hojeNao' && P.diferencas(v, ctx).some((d) => d.problema === 'conviteDeSiMesmo'), 'o Hipólito convidado de si mesmo');
}
{
  const { v, ctx } = achar(3, 'mano');
  const a = P.avaliarAtendimento({ visitante: v, carimbo: 'hojeNao', perguntas: [], apontados: [], confiscados: [], aceitouOferta: true }, ctx);
  ok(a.erros.includes('agrado') && a.fatos.includes('mano-casquinha-aceita') && a.linhas.some((l) => l.valor < 0),
    'aceitar a casquinha do Mano desconta no envelope e vira fato (mesmo barrando)');
  const t = achar(6, 'tializ');
  const b = P.avaliarAtendimento({ visitante: t.v, carimbo: 'entra', perguntas: [], apontados: [], confiscados: [], aceitouOferta: true }, t.ctx);
  ok(!b.erros.length, 'a arepita da Tia Liz (que está no convite) é presente, não suborno');
}
{
  const { v, ctx } = achar(5, 'hipolito');
  const sem = P.avaliarAtendimento({ visitante: v, carimbo: P.carimboCerto(v, ctx), perguntas: [], apontados: [], confiscados: [] }, ctx);
  const com = P.avaliarAtendimento({ visitante: v, carimbo: P.carimboCerto(v, ctx), perguntas: [], apontados: [], confiscados: ['caixaDeSom'] }, ctx);
  ok(P.proibidosNaSacola(v, ctx).includes('caixaDeSom'), 'a caixa de som do Hipólito na sacola de sexta');
  if (P.carimboCerto(v, ctx) !== 'hojeNao') {
    ok(sem.erros.includes('itemPassou') && sem.fatos.includes('baile-do-hipopotamo') && !com.erros.length,
      'sem confiscar, o som passa (e vira o baile do hipopótamo); confiscado, tudo certo');
  }
}

// ===================================================== 4. o fim do dia
console.log('\n4. o fim do dia');
for (const r of certa.porDia) {
  const d = r.m.dia;
  ok(r.fim.estrelas === 3 && r.fim.resumo.erros === 0 && r.fim.boletim.every((b) => b.tom === 'bom') && r.fim.total > 0,
    `dia ${d.numero} jogado certo: 3 estrelas, R$ ${r.fim.total}, "${r.fim.boletim[0]?.titulo}"`);
}
for (const r of errada.porDia) {
  const d = r.m.dia;
  const bom = certa.porDia[d.numero - 1].fim.total;
  ok(r.fim.total >= 0 && r.fim.total < bom && r.fim.estrelas < 3 && r.fim.boletim[0]?.tom === 'ruim' && r.fim.linhas.some((l) => l.valor < 0),
    `dia ${d.numero} jogado errado: R$ ${r.fim.total} (contra R$ ${bom}), ${r.fim.estrelas} estrela(s), "${r.fim.boletim[0]?.titulo}"`);
}
{
  const r = jogarODia(1, 1, new Set(), jogarCerto, 4);
  ok(r.fim.estrelas < 3 && r.fim.resumo.atendidos === 4, `a fila pela metade (17h): ${r.fim.estrelas} estrela(s), "${r.fim.boletim.map((b) => b.titulo).join(' / ')}"`);
}
{
  const linhasE2 = errada.porDia[1].fim.linhas.map((l) => l.texto);
  const linhasC1 = certa.porDia[0].fim.linhas.map((l) => l.texto);
  const linhasE6 = errada.porDia[5].fim.linhas.map((l) => l.texto);
  ok(linhasE2.some((t) => t.startsWith('Beto (dizendo ser Bento) entrou sem poder')) && linhasE6.some((t) => t.startsWith('Jean-Luc (dizendo ser Noel)')),
    'o envelope diz quem era DE VERDADE: "Beto (dizendo ser Bento)", "Jean-Luc (dizendo ser Noel)"');
  ok(linhasC1.includes('barrou Seu Hipólito com razão'), 'e o barrado com razão aparece como tal ("barrou Seu Hipólito com razão")');
  const mostrar = (rotulo, fim) => {
    console.log(`      ${rotulo}: R$ ${fim.total}, ${fim.estrelas} estrela(s)`);
    for (const l of fim.linhas) console.log(`        ${l.valor > 0 ? '+' : '−'}R$ ${Math.abs(l.valor)} · ${l.texto}`);
    for (const b of fim.boletim) console.log(`        📰 ${b.titulo} — ${b.linha}`);
    console.log(`        🦒 ${fim.falaDaGina.join(' ')}`);
  };
  mostrar('o dia 2 jogado errado', errada.porDia[1].fim);
  mostrar('o dia 4 barrando todo mundo', barrando.porDia[3].fim);
  mostrar('o dia 6 jogado certo', certa.porDia[5].fim);
}

// ============================================================== o relógio
console.log('\n4b. o relógio');
/** quem joga com calma: pergunta o nome de todo mundo (do dia 2 em diante) e aponta o que achar */
const jogarComCalma = (v, ctx) => {
  const a = jogarCerto(v, ctx);
  return ctx.ferramentas.has('perguntar') ? { ...a, perguntas: [...new Set(['nome', ...a.perguntas])] } : a;
};
for (const dia of P.DIAS) {
  let pior = 0;
  let piorCalma = 0;
  for (let semente = 1; semente <= 60; semente++) {
    const fatos = certa.porDia[dia.numero - 1].antes;
    pior = Math.max(pior, P.estimarOTempo(dia, jogarODia(dia.numero, semente, fatos, jogarCerto).ats));
    piorCalma = Math.max(piorCalma, P.estimarOTempo(dia, jogarODia(dia.numero, semente, fatos, jogarComCalma).ats));
  }
  ok(pior <= dia.segundos * 0.85 && piorCalma <= dia.segundos,
    `dia ${dia.numero}: a fila inteira cabe nos ${dia.segundos} s — jogando certo, ${Math.round(pior)} s; perguntando o nome de todo mundo, ${Math.round(piorCalma)} s`);
}

// ======================================================= 5. a semana no save
console.log('\n5. a semana no save');
{
  const s = novoSave();
  ok(P.diaAberto(s, 1) && !P.diaAberto(s, 2), 'no começo, só o dia 1 aberto');
  const r1 = jogarODia(1, 1, new Set(), jogarErrado);
  const reg = P.registrarODia(s, 1, r1.fim);
  ok(P.diaAberto(s, 2) && reg.abriu === 2, 'terminar o dia 1 (mesmo mal) abre o 2 — basta terminar');
  ok(P.fatosAntesDoDia(s, 2).has('hipolito-entrou-vencido'), 'o Hipólito vencido que entrou fica nos fatos da semana');
  const r1b = jogarODia(1, 1, new Set(), jogarCerto);
  const reg2 = P.registrarODia(s, 1, r1b.fim);
  const f2 = P.fatosAntesDoDia(s, 2);
  ok(!f2.has('hipolito-entrou-vencido') && f2.has('hipolito-barrado') && reg2.primeiraVezTres, 'refazer o dia 1 certo troca os fatos dele, e as três estrelas dão o prêmio');
}
{
  const h5c = certa.porDia[4].m.fila.find((v) => v.id === 'hipolito');
  const h5e = errada.porDia[4].m.fila.find((v) => v.id === 'hipolito');
  const h6c = certa.porDia[5].m.fila.find((v) => v.id === 'hipolito');
  ok(h5c.espera === 'entra' && h5e.espera === 'hojeNao' && /RENOVADA/.test(h6c.chegada[0]),
    'o Hipólito barrado na segunda chega renovado na sexta e no sábado; o deixado entrar continua vencido');
  ok(certa.porDia[1].m.fila.find((v) => v.id === 'hipolito').chegada[0] !== errada.porDia[1].m.fila.find((v) => v.id === 'hipolito').chegada[0],
    'e na terça ele lembra da segunda ("Segunda deixaram!")');
  // (deixar todo mundo entrar não barra a carne: aqui, a quinta de quem barra todo mundo)
  const q4 = jogarODia(4, 1, certa.porDia[3].antes, barraTudo);
  ok(q4.fim.fatos.includes('carne-barrada') && q4.fim.boletim.some((b) => /SALADA/.test(b.titulo))
    && !P.montarDia(5, 1, certa.porDia[4].antes).cenas.some((c) => c.id === 'walterComSalada')
    && P.montarDia(5, 1, new Set([...certa.porDia[4].antes, ...q4.fim.fatos])).cenas.some((c) => c.id === 'walterComSalada'),
    'a carne barrada na quinta ("MANIA SERVE SÓ SALADA") põe o Walter de salada na sexta');
  ok(errada.porDia[5].m.fila.some((v) => v.id === 'mano') && !certa.porDia[5].m.fila.some((v) => v.id === 'mano'),
    'a casquinha aceita na quarta traz o Mano com casquinha para a fila no sábado');
}
{
  // os chamados da fila
  const e2 = errada.porDia[1];
  const iBeto = e2.fila.findIndex((v) => v.id === 'beto');
  ok(e2.fila.some((v) => v.id === 'bentoSemCarteirinha') && !e2.fila.some((v) => v.id === 'bento')
    && e2.fila.findIndex((v) => v.id === 'bentoSemCarteirinha') === iBeto + 3,
    'o Beto que entra traz o Bento sem carteirinha dois atendimentos depois, no lugar do Bento de sempre');
  ok(certa.porDia[1].fila.some((v) => v.id === 'bento') && !certa.porDia[1].fila.some((v) => v.id === 'bentoSemCarteirinha'),
    'o Beto barrado: o Bento de sempre, com a carteirinha');
  const e6 = errada.porDia[5];
  const iJL = e6.fila.findIndex((v) => v.id === 'jeanlucDisfarcado');
  ok(e6.fila[iJL + 1]?.id === 'noelDeVerdade' && e6.fim.fatos.includes('jeanluc-disfarcado-entrou'),
    'o "Noel" de bigode que entra traz o Noel de verdade logo atrás ("MAS EU SOU O NOEL!")');
  ok(!certa.porDia[5].fila.some((v) => v.id === 'noelDeVerdade') && certa.porDia[5].fim.fatos.includes('disfarce-descoberto'),
    'o disfarce descoberto: o bigode cai e vira manchete');
}
{
  const s = novoSave();
  let ultimo;
  for (const dia of P.DIAS) ultimo = P.registrarODia(s, dia.numero, jogarODia(dia.numero, 2, P.fatosAntesDoDia(s, dia.numero), jogarCerto).fim);
  const deNovo = P.registrarODia(s, 6, jogarODia(6, 2, P.fatosAntesDoDia(s, 6), jogarCerto).fim);
  ok(ultimo.semanaTerminada && !deNovo.semanaTerminada, 'terminar o sábado termina a semana (uma vez só: o selo e a plaquinha)');
  ok(Object.keys(P.PREMIOS).length === 6 && P.PREMIO_DA_SEMANA.selo, `os prêmios: ${Object.values(P.PREMIOS).map((p) => p.nome).join(', ')}`);
}

// ======================================================== o Jean-Luc disfarçado
console.log('\n6. o Jean-Luc, todo dia com um disfarce');
{
  const disfarces = [];
  for (const dia of P.DIAS) {
    for (const [rotulo, caminho] of [['certo', certa], ['errado', errada], ['barrando', barrando]]) {
      const fila = caminho.porDia[dia.numero - 1].fila;
      const jl = fila.filter((v) => v.ficha === 'jeanluc');
      if (jl.length !== 1) disfarces.push(`XX dia ${dia.numero} (${rotulo}): ${jl.length} Jean-Lucs`);
      else if (rotulo === 'certo') disfarces.push(`${jl[0].nome} (${jl[0].rosto.enfeite})`);
    }
  }
  const enfeites = new Set(disfarces.map((d) => d.split('(')[1]));
  ok(disfarces.length === 6 && enfeites.size === 6 && !disfarces.some((d) => d.startsWith('XX')),
    `ele vem nos seis dias, com seis disfarces: ${disfarces.join(', ')}`);
  // barrado SEM a lupa também conta como pego
  const lembra = (decidir) => {
    const s = novoSave();
    for (const dia of P.DIAS.slice(0, 2)) P.registrarODia(s, dia.numero, jogarODia(dia.numero, 1, P.fatosAntesDoDia(s, dia.numero), decidir).fim);
    const f = P.fatosAntesDoDia(s, 3);
    return { vezes: P.vezesPego((x) => f.has(x)), fala: P.montarDia(3, 1, f).fila.find((v) => v.ficha === 'jeanluc').chegada[1] };
  };
  const semLupa = lembra(barraTudo);
  const comLupa = lembra(jogarCerto);
  const deixando = lembra(jogarErrado);
  ok(semLupa.vezes === 2 && comLupa.vezes === 2 && deixando.vezes === 0,
    `ele lembra de cada dia em que não passou, barrado com ou sem a lupa (na quarta: "${semLupa.fala}"; deixado entrar: "${deixando.fala}")`);
}

// ============================================================== um dia, por escrito
console.log('\n   a fila do dia 2 (semente 1, jogando certo):');
for (const v of certa.porDia[1].fila) {
  const ctx = certa.porDia[1].m.contexto;
  const ds = P.diferencas(v, ctx).map((d) => d.problema + (d.aparente ? '*' : ''));
  console.log(`      ${P.FICHAS[v.ficha].icone} ${v.nome.padEnd(16)} ${P.carimboCerto(v, ctx).padEnd(8)} ${ds.join(', ')}`);
}

if (process.env.FALAS) {
  for (const n of [3, 6]) {
    const m = P.montarDia(n, 1, certa.porDia[n - 1].antes);
    console.log(`\n   as falas do dia ${n} (FALAS=1):`);
    for (const v of m.fila) {
      const f = P.FICHAS[v.ficha];
      console.log(`      ${f.icone} ${v.nome}: "${v.bordao ?? f.bordao}" ${(v.chegada ?? f.chegada).slice(0, 1).map((x) => `"${x}"`).join(' ')}`);
      for (const a of P.assuntosDe(v)) console.log(`         ${P.PERGUNTA[a]} → ${P.perguntar(v, a, false).falas.join(' / ')}`);
    }
  }
}

console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
