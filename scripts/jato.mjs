/**
 * O JATO DE CADA CARTA — a regra do Renan, medida.
 *
 * "Cada carta que muda os jatos do regador precisa mudar algo visualmente na
 * animação de ataque." Este teste monta a VITRINE do jato (`?cena=estufa&jato=`:
 * três lagartejos parados na frente da dupla, que nascem de novo quando são
 * espantados) com cada carta na mão, faz o regador atirar, e confere na
 * CONTAGEM do desenho (`DesenhoDoJato.contagem`) que o efeito daquela carta
 * apareceu — a poça, o cristal, o arco que sobe, os três fios, o alvinho.
 * Foto sozinha não prova: ela mostraria uma poça que apareceu por acaso.
 *
 * E o SOM: cada carta que muda o jato toca o dela (`som`), contado no
 * `jogo.audio.contagem` — que conta mesmo sem o áudio ter acordado.
 *
 * E fotografa cada uma, para olhar: `<prefixo>-<carta>.png`.
 *
 * O relógio do Chromium sem tela anda a ~1/5: o teste espera por EVENTO (a
 * contagem mudar), com teto, e nunca por tempo fixo.
 *
 * Uso: node scripts/jato.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './jato';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/**
 * CARTA POR CARTA: o que tem que aparecer. `adiantar` liga um relógio sem
 * esperar (gêiser, chuva, crivo…); `acao` faz a dupla segurar E ou andar.
 */
const CASOS = [
  // o basico prova o contrario tambem: SEM carta, nenhum efeito especial aparece
  {
    cartas: '', nome: 'basico', som: 'jato', o: 'cone e respingo, e nada de especial',
    ok: (d) => (d.formas.cone ?? 0) > 0 && d.respingos > 0 && Object.keys(d.formas).length === 1
      && !d.cristais && !d.pocas && !d.bolhas && !d.arcosIris && !d.miras && !d.trancos && !d.vaporDoCaminho
      && Object.keys(d.especiais).length === 0,
  },
  { cartas: 'bico-1,bico-2,bico-3', ok: (d) => d.disparos > 0, o: 'atira' },
  { cartas: 'jato-1,jato-2,jato-3', ok: (d) => d.respingos > 0, o: 'respingo' },
  { cartas: 'braco-1,braco-2,braco-3', ok: (d) => d.disparos > 0, o: 'atira' },
  { cartas: 'leque-1,leque-2,leque-3', ok: (d) => (d.formas.cone ?? 0) > 0, o: 'cone' },
  { cartas: 'segundo-bico', ok: (d, e) => d.disparos >= 2 * e.jatosDados, o: 'dois jatos por ataque' },
  { cartas: 'orvalho', som: 'vapor', ok: (d) => d.vaporDoCaminho > 0, o: 'vapor no caminho' },
  { cartas: 'mangueira', som: 'jatoLongo', ok: (d) => (d.formas.linha ?? 0) > 0, o: 'linha comprida' },
  { cartas: 'pressao', som: 'jatoForte', ok: (d) => (d.formas.reto ?? 0) > 0, o: 'jato reto' },
  { cartas: 'gota-pesada-1,gota-pesada-2,gota-pesada-3', som: 'tranco', ok: (d) => d.trancos > 0, o: 'tranco' },
  { cartas: 'agua-morna', som: 'vapor', praga: 'preguipolvo', ok: (d) => d.vapores > 0, o: 'vapor no bicho grande' },
  { cartas: 'gota-gelada', som: 'gelo', ok: (d) => d.cristais > 0 && (d.tintas.gelo ?? 0) > 0, o: 'agua azul-gelo e cristais' },
  { cartas: 'jato-em-arco', som: 'jatoArco', ok: (d) => (d.formas.arco ?? 0) > 0 && d.alturaMaxima > 2.2, o: 'arco acima de 2,2 m' },
  { cartas: 'borrifador', ok: (d) => (d.formas.fio ?? 0) >= 3, o: 'tres fios' },
  { cartas: 'mira-no-grandao', som: 'mira', ok: (d) => d.miras > 0, o: 'alvinho' },
  { cartas: 'mira-em-quem-come', som: 'mira', ok: (d) => d.miras > 0, o: 'alvinho' },
  { cartas: 'garoa', som: 'pingo', acao: 'andar', ok: (d) => d.garoas > 0, o: 'rastro no chao' },
  { cartas: 'pressao-acumulada', som: 'jatoForte', ok: (d) => (d.especiais['pressao-cheia'] ?? 0) > 0, o: 'jato de tanque cheio' },
  { cartas: 'crivo-giratorio', som: 'anel', adiantar: 'crivo', ok: (d) => d.aneis > 0, o: 'anel em volta' },
  { cartas: 'agua-com-sabao', som: 'bolha', ok: (d) => (d.tintas.sabao ?? 0) > 0 && d.bolhas > 0, o: 'bolhas e a bolha grande' },
  { cartas: 'jato-carregado', som: 'jatao', adiantar: 'carga', ok: (d) => (d.especiais.carregado ?? 0) > 0 && d.carga > 0, o: 'carga e jatao' },
  { cartas: 'balde', som: 'balde', acao: 'balde', ok: (d) => d.aneis > 0, o: 'onda em circulo' },
  { cartas: 'geiser', som: 'geiser', adiantar: 'geiser', ok: (d) => d.rachaduras > 0 && d.geiseres > 0, o: 'racha e coluna' },
  { cartas: 'arco-iris', som: 'arcoIris', adiantar: 'arco-iris', ok: (d) => d.arcosIris > 0 && (d.tintas['arco-iris'] ?? 0) > 0, o: 'arco-iris no ar' },
  { cartas: 'poca', ok: (d) => d.pocas > 0, o: 'poca no chao' },
  { cartas: 'chuva', som: 'trovao', adiantar: 'chuva', ok: (d) => d.chuvas > 0, o: 'nuvem e chuva' },
  { cartas: 'danca-da-chuva', som: 'chuvinha', adiantar: 'danca', ok: (d) => d.chuvas > 0, o: 'nuvem em volta' },
  /*
   * AS COMBINAÇÕES — regra do Renan: as cartas da mão valem todas juntas. Um
   * caso por encontro que antes apagava uma das duas: agora as duas aparecem
   * no MESMO ataque.
   */
  { nome: 'combo-borrifador-pressao', cartas: 'borrifador,pressao', ok: (d) => (d.formas.fio ?? 0) >= 3, o: 'tres fios, e cada um atravessa' },
  { nome: 'combo-segundo-bico-borrifador', cartas: 'segundo-bico,borrifador', ok: (d) => (d.formas.fio ?? 0) >= 6, o: 'tres fios na frente e tres atras' },
  { nome: 'combo-carregado-borrifador', cartas: 'jato-carregado,borrifador', adiantar: 'carga', ok: (d) => (d.especiais.carregado ?? 0) >= 3, o: 'tres jataos em leque' },
  { nome: 'combo-carregado-poca', cartas: 'jato-carregado,poca', adiantar: 'carga', ok: (d) => (d.especiais.carregado ?? 0) > 0 && d.pocas >= 4, o: 'o jatao deixa a linha molhada' },
  { nome: 'combo-segundo-bico-carregado', cartas: 'segundo-bico,jato-carregado', adiantar: 'carga', ok: (d) => (d.especiais.carregado ?? 0) >= 2, o: 'jatao na frente e atras' },
  { nome: 'combo-pressao-acumulada-borrifador', cartas: 'pressao-acumulada,borrifador', ok: (d) => (d.especiais['pressao-cheia'] ?? 0) >= 3 && (d.formas.fio ?? 0) >= 3, o: 'os tres fios de tanque cheio' },
  { nome: 'combo-arco-mangueira', cartas: 'jato-em-arco,mangueira', ok: (d) => (d.formas.arco ?? 0) > 0 && d.alturaMaxima > 2.2, o: 'arco longo e fino' },
  { nome: 'combo-arco-pressao', cartas: 'jato-em-arco,pressao', ok: (d) => (d.formas.arco ?? 0) > 0, o: 'arco que passa do bicho' },
  { nome: 'combo-crivo-poca', cartas: 'crivo-giratorio,poca', adiantar: 'crivo', ok: (d) => d.aneis > 0 && d.pocas > 0, o: 'o anel deixa poca' },
];

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 760 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
const problemas = [];

await page.goto(`${BASE}/?cena=estufa`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('aristory.save.v1'));

const rodada = () => page.evaluate(() => window.jogo.current.world.root.userData.rodada.estado());

for (const caso of CASOS) {
  const nome = caso.nome ?? caso.cartas.split(',')[0];
  await page.goto(
    `${BASE}/?cena=estufa&em=0,1&zoom=5&jato=${caso.cartas}${caso.praga ? `&praga=${caso.praga}` : ''}`,
    { waitUntil: 'networkidle' },
  );
  // espera a vitrine montar (os três bichos na frente)
  for (let i = 0; i < 40; i++) {
    const pronto = await page.evaluate(() => {
      const r = window.jogo?.current?.world?.root?.userData?.rodada;
      return !!r && r.estado().invasores.length >= 3;
    });
    if (pronto) break;
    await page.waitForTimeout(250);
  }
  await page.mouse.click(500, 700);
  if (caso.adiantar) {
    await page.evaluate((q) => window.jogo.current.world.root.userData.rodada.adiantar(q), caso.adiantar);
  }

  let fotografou = false;
  let e = await rodada();
  if (caso.acao === 'balde') await page.keyboard.down('KeyE');
  if (caso.acao === 'andar') await page.keyboard.down('KeyD');
  for (let i = 0; i < 40; i++) {
    if (!caso.acao) await page.evaluate(() => window.jogo.current.world.root.userData.rodada.forcarJato());
    await page.waitForTimeout(220);
    e = await rodada();
    if (!fotografou && (e.desenho.disparos > 0 || e.desenho.aneis > 0 || e.desenho.chuvas > 0 || e.desenho.garoas > 1)) {
      await page.waitForTimeout(260);
      await page.screenshot({ path: `${OUT}-${nome}.png` });
      fotografou = true;
    }
    if (caso.ok(e.desenho, e) && fotografou && i >= 3) break;
  }
  if (caso.acao === 'balde') await page.keyboard.up('KeyE');
  if (caso.acao === 'andar') await page.keyboard.up('KeyD');
  e = await rodada();
  const passou = caso.ok(e.desenho, e);
  const tocou = caso.som
    ? await page.evaluate((n) => window.jogo.audio.contagem.get(n) ?? 0, caso.som)
    : 1;
  console.log(`${passou ? '  ok ' : 'FALHOU'}  ${nome.padEnd(20)} ${caso.o}${caso.som ? ` · som ${caso.som} ${tocou ? 'tocou' : 'NAO tocou'}` : ''}`);
  if (!passou) problemas.push(`${nome}: nao apareceu "${caso.o}" (${JSON.stringify(e.desenho)})`);
  if (!tocou) problemas.push(`${nome}: o som "${caso.som}" nao tocou`);
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
if (erros.length) problemas.push('erros de console');
await browser.close();
if (problemas.length) {
  console.log('FALHOU:\n- ' + [...new Set(problemas)].join('\n- '));
  process.exit(1);
}
console.log('tudo certo');
process.exit(0);
