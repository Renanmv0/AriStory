/**
 * AS CARTAS DO JARDIM E A PROGRESSÃO DA RODADA — as regras antes da tela.
 *
 * O pedido do Renan que este teste guarda: **carta que você já tem não aparece
 * de novo**. E, junto, os outros três que moram na mesma lógica: bicho mais
 * fraco aparece primeiro, quem dá mais trabalho paga mais experiência, e subir
 * de nível fica cada vez mais caro.
 *
 * Tudo aqui é LÓGICA PURA (`src/minigames/jardim/`), então o teste não abre o
 * navegador: ele empacota os módulos com o esbuild que o Vite já traz e roda
 * no Node. Mil rodadas simuladas levam menos de um segundo — e mil rodadas é o
 * que pega uma repetição que acontece uma vez a cada trezentas.
 *
 * O que ele cobra:
 *
 * 1. O BARALHO: ids únicos, toda carta com nome/ícone/texto, toda série
 *    apontando para uma carta que existe, e `exclui` sempre de mão dupla.
 * 2. A MÃO: carta pega nunca volta à oferta; a série anda em ordem (a II não
 *    sai antes da I); `pegar` recusa repetida; a ficha é derivada (pegar e
 *    derivar de novo dá o mesmo número).
 * 3. O SORTEIO: sempre três cartas, nunca duas iguais na mesma mesa, lendária
 *    nunca antes do nível 4, e as três famílias juntas na maior parte das
 *    mesas do começo.
 * 4. MIL RODADAS até o baralho ACABAR: nenhuma carta repetida, e quando o
 *    baralho seca a tela continua com três (os consolos).
 * 5. A CURVA: custo crescente, degrau crescente, e os três primeiros níveis
 *    baratos.
 * 6. AS ONDAS: a estreia em ordem de tier, o solo de 10 s por uma porta só, o
 *    tanque e o chefe anunciados, e a rodada inteira terminando perto do
 *    nível 10 — o alvo do §7 do plano.
 *
 * Uso: node scripts/cartas.mjs
 */
import { build } from 'esbuild';

const saida = await build({
  stdin: {
    contents: `
      export * from './src/minigames/jardim/cartas';
      export * from './src/minigames/jardim/baralho';
      export * from './src/minigames/jardim/progressao';
      export * from './src/minigames/jardim/armas';
      export { PRAGAS } from './src/world/bichosDoJardim';
    `,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  logLevel: 'error',
});
const m = await import(
  'data:text/javascript;base64,' + Buffer.from(saida.outputFiles[0].text).toString('base64')
);

let falhas = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok ' : 'FALHOU'}  ${msg}`);
  if (!cond) falhas++;
};
/** o dado repetível: mesma semente, mesma sequência */
const dado = (semente) => {
  let s = semente >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
};

// ================================================================ 1. baralho
console.log('\n— o baralho');
const { CARTAS, CONSOLOS, MaoDeCartas } = m;
const ids = CARTAS.map((c) => c.id);
ok(new Set(ids).size === ids.length, `${ids.length} cartas, todos os ids unicos`);
ok(
  CARTAS.every((c) => c.nome && c.icone && c.texto && c.texto.length <= 70),
  'toda carta tem nome, icone e um texto que cabe na carta (ate 70 letras)',
);
ok(
  CARTAS.every((c) => (c.requer ?? []).every((r) => ids.includes(r))),
  'todo `requer` aponta para uma carta que existe',
);
ok(
  CARTAS.every((c) => (c.exclui ?? []).every((x) => CARTAS.find((o) => o.id === x)?.exclui?.includes(c.id))),
  'todo `exclui` e de mao dupla',
);
ok(CARTAS.every((c) => !c.repetivel), 'nenhuma carta do baralho e repetivel (so os consolos)');
ok(CONSOLOS.length >= 3 && CONSOLOS.every((c) => c.repetivel), 'ha consolos para tapar o buraco');
for (const f of ['regador', 'jardineiro', 'jardim']) {
  const daF = CARTAS.filter((c) => c.familia === f);
  ok(daF.some((c) => c.raridade === 'comum'), `familia ${f}: ${daF.length} cartas, e alguma comum`);
}
/*
 * A REGRA QUE DECIDE A RARIDADE: carta comum mexe em NUMERO, carta rara mexe
 * em REGRA. Medido: aplicar uma comum numa ficha limpa nao pode ligar nenhuma
 * regra — senao a ficha mente sobre o que a carta e.
 */
{
  const vazamentos = CARTAS.filter((c) => {
    if (c.raridade !== 'comum' || c.requer) return false;
    const f = m.fichaInicial();
    c.aplicar(f);
    // as comuns que so ligam UMA regra de conforto sao a excecao declarada
    return f.regras.size > 0 && !['bota', 'segundo-tonel', 'sino-da-porta'].includes(c.id);
  });
  ok(vazamentos.length === 0, `comum mexe em numero, nao em regra ${vazamentos.map((c) => c.id).join(' ')}`);
}

/*
 * A REGRA DO RENAN PARA O JATO: carta que mexe no jato muda alguma coisa que
 * se VE na animacao de ataque. Medido: aplicar a carta numa ficha limpa e, se
 * ela mexeu num numero do jato ou ligou uma regra do jato, ela TEM que ter
 * escrito no `jato` — senao e uma carta de jato sem desenho.
 */
{
  const NUMEROS = ['alcance', 'dano', 'cadencia', 'largura', 'empurraoDoJato', 'contraOGrandao'];
  const REGRAS_DO_JATO = [
    'segundo-bico', 'atravessa', 'poca', 'chuva', 'gota-gelada', 'jato-em-arco', 'borrifador',
    'crivo-giratorio', 'agua-com-sabao', 'jato-carregado', 'mira-no-grandao', 'mira-em-quem-come',
    'garoa', 'balde', 'pressao-acumulada', 'geiser', 'arco-iris', 'danca-da-chuva',
  ];
  const zerada = m.fichaInicial();
  const semDesenho = CARTAS.filter((c) => {
    const f = m.fichaInicial();
    c.aplicar(f);
    const mexeu = NUMEROS.some((k) => f[k] !== zerada[k])
      || [...f.regras].some((r) => REGRAS_DO_JATO.includes(r));
    return mexeu && Object.keys(f.jato).length === 0;
  });
  ok(semDesenho.length === 0, `toda carta de jato muda o desenho do jato ${semDesenho.map((c) => c.id).join(' ')}`);
}

// =================================================================== 2. mão
console.log('\n— a mao');
{
  const mao = new MaoDeCartas();
  ok(mao.pegar('bico-1', 1), 'pega o Bico mais longo');
  ok(!mao.pegar('bico-1', 1), 'recusa pegar a mesma carta de novo');
  ok(mao.ids.length === 1, 'e a mao continua com uma');
  ok(!mao.pegar('bico-3', 1), 'recusa o degrau III sem o II');
  ok(mao.pegar('bico-2', 1) && mao.pegar('bico-3', 1), 'II e depois III entram em ordem');
  ok(!mao.pegar('chuva', 3), 'lendaria recusada no nivel 3');
  ok(mao.pegar('chuva', 4), 'e aceita no 4');
  ok(mao.pegar('la-de-tras', 4) && !mao.pegar('os-dois-na-frente', 9), '`exclui` segura a carta rival');
  const a = mao.ficha();
  const b = mao.ficha();
  const base = m.fichaInicial().alcance;
  ok(Math.abs(a.alcance - base * 1.18 ** 3) < 1e-9, `tres bicos: alcance ${a.alcance.toFixed(2)} (${base} x 1,18^3)`);
  ok(a.alcance === b.alcance && a.regras.size === b.regras.size, 'derivar duas vezes da o mesmo numero');
  const estilo = mao.estiloDoRegador();
  ok(estilo.bico === 1 && estilo.nuvem === true, 'o regador desenha o bico inteiro e a nuvem da chuva');
  ok(estilo.estagio === 1, `3 cartas de regador = estagio ${estilo.estagio} (o de latao)`);
  const tanques = new MaoDeCartas();
  tanques.pegar('tanque-1');
  ok(tanques.ficha().tanque === 16 && tanques.estiloDoRegador().tanque > 0, 'Tanque maior: +4 jatos e o corpo engorda');
}

// =============================================================== 3. sorteio
console.log('\n— o sorteio');
{
  let tresFamilias = 0;
  let mesas = 0;
  let lendariaCedo = 0;
  let duplicada = 0;
  let naoTres = 0;
  for (let s = 1; s <= 2000; s++) {
    const rng = dado(s);
    const mao = new MaoDeCartas();
    const nivel = 1 + (s % 3);
    const mesa = mao.oferta(nivel, rng);
    mesas++;
    if (mesa.length !== 3) naoTres++;
    if (new Set(mesa.map((c) => c.id)).size !== mesa.length) duplicada++;
    if (new Set(mesa.map((c) => c.familia)).size === 3) tresFamilias++;
    if (mesa.some((c) => c.raridade === 'lendario')) lendariaCedo++;
  }
  ok(naoTres === 0, 'toda mesa tem tres cartas');
  ok(duplicada === 0, 'nenhuma mesa repete carta');
  ok(lendariaCedo === 0, 'nenhuma lendaria nos niveis 1 a 3');
  const pct = Math.round((tresFamilias / mesas) * 100);
  ok(pct >= 85, `as tres familias juntas em ${pct}% das mesas do comeco (minimo 85%)`);
}

// ====================================================== 4. mil rodadas inteiras
console.log('\n— mil rodadas ate o baralho acabar');
{
  let repetidas = 0;
  let foraDeOrdem = 0;
  let mesaCurta = 0;
  let consolosAntes = 0;
  let consolosNoFim = 0;
  let ofertaComCartaDaMao = 0;
  for (let s = 1; s <= 1000; s++) {
    const rng = dado(s * 7919);
    const mao = new MaoDeCartas();
    for (let nivel = 1; nivel <= CARTAS.length + 6; nivel++) {
      const mesa = mao.oferta(nivel, rng);
      if (mesa.length !== 3) mesaCurta++;
      if (mesa.some((c) => !c.repetivel && mao.tem(c.id))) ofertaComCartaDaMao++;
      const temDeVerdade = mesa.filter((c) => !c.repetivel);
      if (mesa.some((c) => c.repetivel) && mao.disponiveis(nivel).length >= 3) consolosAntes++;
      if (temDeVerdade.length === 0) consolosNoFim++;
      const escolha = mesa[Math.floor(rng() * mesa.length)];
      if (!escolha.repetivel && escolha.requer?.some((r) => !mao.tem(r))) foraDeOrdem++;
      if (!mao.pegar(escolha.id, nivel)) repetidas++;
    }
    if (new Set(mao.ids).size !== mao.ids.length) repetidas++;
  }
  ok(repetidas === 0, 'nenhuma carta pega duas vezes em mil rodadas');
  ok(ofertaComCartaDaMao === 0, 'nenhuma oferta mostrou carta que ja estava na mao');
  ok(foraDeOrdem === 0, 'nenhuma serie pulou degrau');
  ok(mesaCurta === 0, 'a mesa tem tres cartas ate o baralho acabar, e depois dele');
  ok(consolosAntes === 0, 'consolo nunca aparece enquanto ha tres cartas de verdade');
  ok(consolosNoFim > 0, 'com o baralho vazio, a tela vira so consolo (e nao trava)');
}

// ================================================== 4b. o baralho de cada arma
console.log('\n— o baralho de cada arma');
{
  const { ARMAS, CARTAS: todas, MaoDeCartas: Mao, servePara } = m;
  for (const arma of ARMAS.filter((a) => a.pronta)) {
    let fora = 0;
    let saiu = 0;
    for (let s = 1; s <= 300; s++) {
      const rng = dado(s * 104729);
      const mao = new Mao(arma.id);
      for (let nivel = 1; nivel <= 40; nivel++) {
        const oferta = mao.oferta(nivel, rng);
        for (const c of oferta) if (!c.repetivel && !servePara(c, arma.id)) fora++;
        const real = oferta.filter((c) => !c.repetivel);
        if (!real.length) break;
        mao.pegar(real[0].id, nivel);
        saiu++;
      }
    }
    ok(fora === 0, `${arma.nome}: 300 rodadas sem sortear carta que não serve nela (${saiu} pegas)`);
  }
  // a regra do Renan: a mangueira, de água infinita, não tem carta de tanque
  const daMangueira = todas.filter((c) => servePara(c, 'mangueira'));
  ok(!daMangueira.some((c) => /^tanque-/.test(c.id)), 'a mangueira não tem "Tanque maior"');
  ok(!todas.filter((c) => servePara(c, 'regador')).some((c) => c.soPara?.includes('mangueira')), 'e o regador não tem as cartas só da mangueira');
  const f = new Mao('mangueira').ficha();
  ok(f.regras.has('agua-infinita') && f.regras.has('presa-na-estufa') && f.gastoPorJato === 0,
    'a ficha de partida da mangueira: água infinita, presa na estufa, jato de graça');
  ok(new Mao('mangueira').estiloDoRegador().arma === 'mangueira', 'e a peça da mão é a dela');
  ok(ARMAS.every((a, i) => i === 0 ? a.anterior === null : a.anterior === ARMAS[i - 1].id),
    'as armas são uma fila: cada uma destranca pela anterior');
}

// ================================================================= 5. curva
console.log('\n— a curva de nivel');
{
  const custos = Array.from({ length: 12 }, (_, i) => m.custoDoNivel(i + 1));
  console.log('       custo por nivel:', custos.join(' '));
  console.log('       acumulado      :', custos.map((_, i) => m.gotasParaONivel(i + 1)).join(' '));
  ok(custos.every((c, i) => i === 0 || c > custos[i - 1]), 'cada nivel custa mais que o anterior');
  const degraus = custos.slice(1).map((c, i) => c - custos[i]);
  ok(degraus.every((d, i) => i === 0 || d >= degraus[i - 1]), 'e o degrau nunca encolhe');
  ok(m.gotasParaONivel(3) <= 25, `os tres primeiros niveis saem com ${m.gotasParaONivel(3)} gotas (ate 25)`);
  const n = m.nivelDasGotas(m.gotasParaONivel(4) + 3);
  ok(n.nivel === 4 && n.noNivel === 3 && n.custo === m.custoDoNivel(5), 'nivelDasGotas acerta nivel e sobra');
  ok(m.nivelDasGotas(0).nivel === 0, 'a rodada comeca do nivel 0');
}

// ========================================================== 6. as ondas
console.log('\n— as ondas');
{
  const { ONDAS, PRAGAS, ORDEM_DOS_TIERS } = m;
  const tierDe = (id) => ORDEM_DOS_TIERS.indexOf(PRAGAS.find((p) => p.id === id).tier);
  /*
   * AS ESTREIAS VÊM EM DUAS LEVAS — as seis primeiras pragas nas ondas 1 a 4,
   * e a segunda leva da 15ª em diante (pedido do Renan). Dentro de cada leva,
   * do mais fraco para o mais forte.
   */
  const levas = [ONDAS.slice(0, 14), ONDAS.slice(14)].map((l) => l.map((o) => o.estreia).filter(Boolean));
  ok(
    levas.every((ids) => ids.every((id, i) => i === 0 || tierDe(id) >= tierDe(ids[i - 1]))),
    `estreias em ordem de tier, em cada leva: ${levas.map((l) => l.join(' → ')).join(' | ')}`,
  );
  ok(levas[1].length >= 2 && ONDAS.slice(0, 14).every((o, i) => i < 5 || !o.estreia),
    'a segunda leva só estreia da 15ª onda em diante');
  // todo bicho do catálogo entra na rodada em algum momento
  const entram = new Set(ONDAS.flatMap((o) => [o.estreia, ...(o.anunciados ?? []).map((a) => a.praga)]));
  const fora = PRAGAS.filter((p) => !entram.has(p.id)).map((p) => p.id);
  ok(fora.length === 0, `toda praga do catálogo entra numa onda${fora.length ? ` (faltam: ${fora.join(', ')})` : ''}`);
  ok(ONDAS[0].estreia === 'lagartejo' && ONDAS[0].quantos === 1, 'a onda 1 e so o Lagartejo, um de cada vez');
  // gotas sobem com o tier, e nunca mentem sobre o encharque
  const porTier = ORDEM_DOS_TIERS.map((t) => PRAGAS.filter((p) => p.tier === t).map((p) => p.gotas));
  ok(
    porTier.every((g, i) => i === 0 || Math.min(...g) > Math.max(...porTier[i - 1])),
    `gotas por tier: ${porTier.map((g) => g.join('/')).join(' < ')}`,
  );

  let problemasDeSolo = 0;
  let anunciadosErrados = 0;
  let ordemErrada = 0;
  const niveisFinais = [];
  const niveisNaQuinta = [];
  for (let s = 1; s <= 300; s++) {
    const rng = dado(s * 104729);
    let gotas = 0;
    for (let n = 1; n <= ONDAS.length; n++) {
      const plano = m.planoDaOnda(n, rng);
      const onda = ONDAS[n - 1];
      if (onda.estreia) {
        const solo = plano.filter((e) => e.t < m.SOLO && !e.anunciada);
        if (!solo.every((e) => e.praga === onda.estreia)) problemasDeSolo++;
        if (new Set(solo.map((e) => e.porta)).size !== 1) problemasDeSolo++;
      }
      const tanques = plano.filter((e) => ['tanque', 'chefe'].includes(PRAGAS.find((p) => p.id === e.praga).tier));
      if (!tanques.every((e) => e.anunciada)) anunciadosErrados++;
      if (tanques.length !== (onda.anunciados?.length ?? 0)) anunciadosErrados++;
      // nenhum bicho que ainda nao estreou aparece antes da hora
      const jaEstreados = new Set(ONDAS.slice(0, n).map((o) => o.estreia).filter(Boolean));
      if (plano.some((e) => !e.anunciada && !jaEstreados.has(e.praga))) ordemErrada++;
      gotas += m.gotasDoPlano(plano);
      if (n === 5) niveisNaQuinta.push(m.nivelDasGotas(gotas).nivel);
    }
    niveisFinais.push(m.nivelDasGotas(gotas).nivel);
  }
  ok(problemasDeSolo === 0, 'o bicho novo entra sozinho, por uma porta so, nos primeiros 10 s');
  ok(anunciadosErrados === 0, 'tanque e chefe so entram anunciados, na conta certa');
  ok(ordemErrada === 0, 'nenhum bicho aparece antes da onda de estreia dele');
  const mediaDe = (l) => l.reduce((a, b) => a + b, 0) / l.length;
  const naQuinta = mediaDe(niveisNaQuinta);
  const media = mediaDe(niveisFinais);
  console.log(`       nivel medio se nenhum bicho escapar: ${naQuinta.toFixed(1)} na onda 5, ${media.toFixed(1)} na onda ${ONDAS.length}`);
  ok(ONDAS.length === 30 && m.TOTAL_DE_ONDAS === 30, 'a rodada tem trinta ondas (a trigésima é a vitória)');
  ok(naQuinta >= 9 && naQuinta <= 12, 'as cinco primeiras ondas levam perto do nivel 10 (entre 9 e 12)');
  ok(media >= 30 && media <= 36, 'as trinta ondas terminam entre o nivel 30 e o 36 (o premio do 30 cabe na rodada)');
  const chefeEm = (n) => ONDAS[n - 1].anunciados.filter((a) => PRAGAS.find((p) => p.id === a.praga).tier === 'chefe');
  ok([10, 15, 20, 25, 30].every((n) => chefeEm(n).length > 0), 'tem chefe nas ondas 10, 15, 20, 25 e 30');
  ok(chefeEm(25).some((a) => a.praga === 'escorpicamelo')
    && ONDAS.slice(0, 24).every((o) => !(o.anunciados ?? []).some((a) => a.praga === 'escorpicamelo')),
    'o Escorpicamelo estreia na 25ª onda');
  ok(new Set(chefeEm(30).map((a) => a.praga)).size === 2, 'a 30ª, o fim da rodada, traz os dois chefes juntos');
  // da 6ª à 30ª a onda nunca fica mais fácil que a anterior: nem menos bicho,
  // nem leva menor, nem intervalo maior, nem menos grandão
  const pesoDosGrandoes = (o) => (o.anunciados ?? [])
    .filter((a) => PRAGAS.find((p) => p.id === a.praga).tier === 'tanque').length;
  const naoAfrouxa = ONDAS.slice(5).every((o, i) => {
    const antes = ONDAS[4 + i];
    return o.total > antes.total && o.quantos >= antes.quantos && o.aCada <= antes.aCada
      && pesoDosGrandoes(o) >= pesoDosGrandoes(antes);
  });
  ok(naoAfrouxa, 'da quinta à trigésima, nenhuma onda afrouxa em relação à anterior');
  console.log(`       onda 20: ${ONDAS[19].total} bichos, ${ONDAS[19].quantos} por leva a cada ${ONDAS[19].aCada.toFixed(2)} s · onda 30: ${ONDAS[29].total}, ${ONDAS[29].quantos} a cada ${ONDAS[29].aCada.toFixed(2)} s`);

  const um = m.planoDaOnda(1, dado(42));
  console.log(`       onda 1: ${um.length} bichos em ${um.at(-1).t + ONDAS[0].aCada} s`);
  const cinco = m.planoDaOnda(5, dado(42));
  console.log(`       onda 5: ${cinco.length} bichos em ${cinco.at(-1).t} s, a chefe em ${cinco.find((e) => e.praga === 'mae-lagartejo').t} s`);
}

// ================================================ AS CARTAS SE SOMAM (builds)
/*
 * Regra do Renan: as cartas da rodada valem TODAS ao mesmo tempo. Uma deixa o
 * jato mais largo e a outra mais rápido? Com as duas, ele sai mais largo E mais
 * rápido. Aqui isso é provado para CADA PAR de cartas que pode estar junto na
 * mão (as que se excluem ficam de fora): o que uma carta muda sozinha continua
 * mudado com a outra do lado, e o que as duas mudam se acumula.
 */
{
  const ficha = (...ids) => {
    const f = m.fichaInicial();
    for (const id of ids) m.cartaPorId(id).aplicar(f);
    return f;
  };
  const base = m.fichaInicial();
  const NUMEROS = Object.keys(base).filter((k) => typeof base[k] === 'number');
  const mudou = (f, k) => Math.abs(f[k] - base[k]) > 1e-9;
  const pares = [];
  const cartas = m.CARTAS.filter((c) => !c.repetivel);
  for (let i = 0; i < cartas.length; i++) {
    for (let j = i + 1; j < cartas.length; j++) {
      const a = cartas[i];
      const b = cartas[j];
      if (a.exclui?.includes(b.id) || b.exclui?.includes(a.id)) continue;
      pares.push([a, b]);
    }
  }
  const perdidos = [];
  for (const [a, b] of pares) {
    const fa = ficha(a.id);
    const fb = ficha(b.id);
    const fab = ficha(a.id, b.id);
    for (const k of NUMEROS) {
      const ma = mudou(fa, k);
      const mb = mudou(fb, k);
      if (ma && mb) {
        // as duas mexem no mesmo número: o resultado tem que ir além de cada uma
        const alem = (x) => Math.abs(fab[k] - base[k]) > Math.abs(x[k] - base[k]) + 1e-9
          || Math.sign(fab[k] - base[k]) !== Math.sign(x[k] - base[k]);
        if (!alem(fa) && !alem(fb) && !(k === 'coleta')) perdidos.push(`${a.id}+${b.id}: ${k} não acumulou`);
      } else if (ma && Math.abs(fab[k] - fa[k]) > 1e-9) perdidos.push(`${a.id}+${b.id}: ${k} de ${a.id} se perdeu`);
      else if (mb && Math.abs(fab[k] - fb[k]) > 1e-9) perdidos.push(`${a.id}+${b.id}: ${k} de ${b.id} se perdeu`);
    }
    for (const r of [...fa.regras, ...fb.regras]) if (!fab.regras.has(r)) perdidos.push(`${a.id}+${b.id}: a regra ${r} sumiu`);
    for (const [nome, fx] of [[a.id, fa], [b.id, fb]]) {
      for (const k of Object.keys(fx.jato)) if (fab.jato[k] === undefined) perdidos.push(`${a.id}+${b.id}: o jato.${k} de ${nome} sumiu`);
      for (const k of Object.keys(fx.estilo)) if (fab.estilo[k] === undefined) perdidos.push(`${a.id}+${b.id}: o regador.${k} de ${nome} sumiu`);
    }
  }
  console.log(`       ${pares.length} pares de cartas que podem estar juntas na mão`);
  if (perdidos.length) console.log('       ' + perdidos.slice(0, 12).join('\n       '));
  ok(perdidos.length === 0, 'em todo par, as duas cartas valem juntas (nada de uma apagar a outra)');
  // o exemplo do Renan, escrito: Leque aberto + Braço solto
  const leque = ficha('leque-1');
  const braco = ficha('braco-1');
  const os2 = ficha('leque-1', 'braco-1');
  ok(os2.largura === leque.largura && os2.cadencia === braco.cadencia && os2.largura > base.largura && os2.cadencia < base.cadencia,
    `Leque aberto + Braço solto: ${os2.largura}° de leque E um jato a cada ${os2.cadencia.toFixed(2)} s`);
}

console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
