/**
 * A NOITE NA CLAREIRA — a etapa B do acampamento (`docs/ACAMPAMENTO.md`).
 *
 * Ele MEDE e fotografa:
 *
 * - de dia, lá dentro da barraca, "Passar a noite aqui" escurece o céu de
 *   verdade (a fila dia → dourada → pôr do sol → crepúsculo → noite), com a
 *   cúpula do céu na tomada de fora; de noite, o varal aceso lâmpada por
 *   lâmpada, a lanterna acesa (a barraca brilha), os vaga-lumes piscando, os
 *   grilos e a música de ninar, e a escolha de dentro vira "Dormir";
 * - sair da barraca de noite e SAIR DA CLAREIRA volta o dia (o céu, as
 *   luzes e a música do parque);
 * - DORMIR: a porta fecha de verdade (o pano inteiro, o zíper), os dois
 *   deitam de conchinha com o RENAN ATRÁS abraçando (a escolha dele), o boa
 *   noite literal, a lanterna apaga, a tela escurece com o sono, e de manhã a
 *   aurora, o passarinho, a porta abrindo, os dois na porta olhando o lago e
 *   o sol nascendo na cúpula — com a memória no diário, e o dia de volta.
 *
 * - DE MANHÃ, O SOL APARECE: na tomada do nascer, o disco do sol cai dentro
 *   do quadro e nenhuma árvore fica entre a câmera e ele (as duas do leste
 *   viraram arbustos floridos, pedido do Renan, que viu no celular). `CEL=1`
 *   roda tudo na tela de celular em pé, onde o quadro é mais estreito.
 *
 * O navegador do teste anda devagar: o relógio da noite é acelerado pelo
 * gancho da cena (`ritmo`), e tudo é esperado por estado, nunca por tempo.
 *
 * Uso: node scripts/noite.mjs /caminho/prefixo   (CEL=1 para o celular)
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './noite';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const CEL = process.env.CEL === '1';
const page = await browser.newPage(CEL
  ? { viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
  : { viewport: { width: 1000, height: 880 } });
const erros = [];
const falhas = [];
const checar = (ok, msg) => { if (!ok) falhas.push(msg); };
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });
const temEscolha = () => page.locator('.escolhas.show button').count();
const temFala = () => page.locator('.dialogue.show').count();
const escolhas = () => page.locator('.escolhas.show button').allTextContents();
const escolher = async (texto) => {
  for (let i = 0; i < 240 && !(await temEscolha()); i++) await page.waitForTimeout(250);
  await page.locator('.escolhas.show button', { hasText: texto }).first().click();
  await page.waitForTimeout(300);
};
/** passa as falas até aparecer uma escolha; devolve o texto de cada fala (lido inteiro) */
const passarFalas = async (limite = 400) => {
  const lidas = [];
  for (let i = 0; i < limite; i++) {
    if (await temEscolha()) break;
    if (await temFala()) {
      await page.waitForTimeout(1600);
      lidas.push((await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '');
      await page.keyboard.press('KeyE');
    }
    await page.waitForTimeout(200);
  }
  return lidas;
};
/**
 * a fala INTEIRA: ela aparece letra por letra, e o navegador do teste às
 * vezes engasga no meio (duas leituras iguais ainda incompletas) — então
 * espera a máquina de escrever da `Ui` terminar (`typing` volta a `null`)
 */
const lerFala = async () => {
  for (let i = 0; i < 60 && (await page.evaluate(() => window.jogo.ui.typing !== null)); i++) await page.waitForTimeout(150);
  return (await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '';
};
/** o estado da noite, pelo gancho de teste da barraca */
const noite = () => page.evaluate(() => {
  const j = window.jogo;
  let b = null;
  j.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') b = o; });
  const t = b.userData.teste;
  const halos = t.varal.getObjectByName('halosDoVaral');
  const cores = halos.instanceColor.array;
  let acesasNoVaral = 0;
  for (let i = 0; i < halos.count; i++) if (cores[i * 3] > 0.9) acesasNoVaral++;
  const globo = b.getObjectByName('globo');
  const panos = ['portaFechadaAlta', 'portaFechadaBaixa'].map((n) => b.getObjectByName(n));
  return {
    estado: t.estado(),
    estrelas: t.momento().estrelas,
    fundo: j.scene.background.getHex(),
    ceuVisivel: t.ceu.group.visible,
    solVisivel: t.ceu.sol.visible,
    cameraDeCena: !!j.cameraDeCena(),
    clima: j.climaDaMusica,
    acesasNoVaral,
    lampadas: halos.count,
    acesa: b.userData.acesa === true,
    globoBrilha: (globo.material.emissiveIntensity ?? 0) > 0.5 && globo.material.emissive?.getHex() > 0,
    luzDeDentro: b.getObjectByName('luzDeDentro').visible,
    vagaLumes: t.vagaLumes.acesos,
    portaFechada: b.userData.portaFechada,
    panosInteiros: panos.every((p) => p.visible && p.geometry.drawRange.count >= p.geometry.index.count),
    jeito: j.beijoDeitado.comoEstao,
    deitado: j.player.riding,
    sons: Object.fromEntries(j.audio.contagem),
    veu: document.querySelector('.veil')?.className ?? '',
  };
});
const entrarNaBarraca = async () => {
  const PORTA = await page.evaluate(() => {
    let t = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
    return t.PORTA;
  });
  let prompt = false;
  for (let i = 0; i < 20 && !prompt; i++) {
    await page.evaluate(([x, z]) => window.jogo.debugPlace(x, z, Math.PI * 1.25), [PORTA.x, PORTA.z]);
    await page.waitForTimeout(350);
    prompt = /entrar na barraca/i.test((await page.locator('.prompt .label').textContent().catch(() => '')) ?? '');
  }
  await page.keyboard.press('KeyE');
  await escolher('Entrar');
  return prompt;
};
/** escolhe "Passar a noite aqui" e espera a noite chegar (até o "E agora?" de novo) */
const anoitecer = async (fotografar) => {
  await escolher('Passar a noite aqui');
  const visto = { ceu: false, camera: false, fotos: 0 };
  for (let i = 0; i < 900; i++) {
    const n = await noite();
    visto.ceu ||= n.ceuVisivel;
    visto.camera ||= n.cameraDeCena;
    if (fotografar && visto.fotos === 0 && n.estrelas > 0.35 && n.estrelas < 0.6) { visto.fotos++; await foto('1-crepusculo'); }
    if (fotografar && visto.fotos === 1 && n.estrelas > 0.98 && n.ceuVisivel) { visto.fotos++; await foto('2-anoiteceu'); }
    if (n.estado === 'noite' && (await temEscolha())) break;
    if (await temFala()) {
      await page.waitForTimeout(900);
      await page.keyboard.press('KeyE');
    }
    await page.waitForTimeout(120);
  }
  return visto;
};

// ======================================================== 1. a noite chega
await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ flags: { 'clareira-achada': true } })), SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await page.waitForTimeout(1200);
await page.mouse.click(500, 440);
await page.evaluate(() => {
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') o.userData.teste.ritmo.vezes = 3; });
});
const diaAntes = await noite();
const entrou = await entrarNaBarraca();
const falasDeEntrada = await passarFalas();
const menuDeDia = await escolhas();
const anoitecer1 = await anoitecer(true);
await passarFalas();
const deNoite = await noite();
const menuDeNoite = await escolhas();
await foto('3-dentro-de-noite');

// ================================================ 2. de noite, lá fora
await escolher('Sair da barraca');
await passarFalas();
await page.waitForTimeout(1500);
const CL = await page.evaluate(() => {
  let t = null;
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') t = o.userData.teste; });
  return t.CLAREIRA;
});
await page.evaluate(([x, z]) => { window.jogo.debugPlace(x + 1.4, z + 1.6, -2.4); window.jogo.setZoom(10); }, [CL.x, CL.z]);
await page.waitForTimeout(3500);
const laFora = await noite();
await foto('4-clareira-de-noite');

// ======================================= 3. sair da clareira volta o dia
await page.evaluate(() => window.jogo.debugPlace(-30.5, 15.6, 1.6));
for (let i = 0; i < 120 && (await noite()).estado !== 'dia'; i++) await page.waitForTimeout(250);
// a virada de volta (2,2 s de jogo) e o céu do motor devolvido
for (let i = 0; i < 160 && (await noite()).fundo !== diaAntes.fundo; i++) await page.waitForTimeout(250);
const deVolta = await noite();

// ======================================================== 4. dormir
await page.evaluate(([x, z]) => window.jogo.debugPlace(x + 1.2, z + 1.4, -2.4), [CL.x, CL.z]);
await page.waitForTimeout(800);
await page.evaluate(() => {
  window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'barraca-iglu') o.userData.teste.ritmo.vezes = 5; });
});
await entrarNaBarraca();
await passarFalas();
await anoitecer(false);
await passarFalas();
const somAntes = (await noite()).sons;
await escolher('Dormir');
const dormir = {
  fechou: false, panosInteiros: false, conchinha: null, boaNoite: [], apagouAntesDoSono: null,
  sono: false, manha: null, abriu: false, nascer: null, fotos: new Set(),
};
for (let i = 0; i < 1500; i++) {
  const n = await noite();
  if (n.portaFechada >= 1 && !dormir.fechou) {
    dormir.fechou = true;
    dormir.panosInteiros = n.panosInteiros;
    await page.waitForTimeout(200);
    await foto('5-barraca-fechada');
  }
  // de conchinha (já virados de todo): os dois para o MESMO lado, e quem está na frente é o Ari
  const virou = n.jeito === 'conchinha' && (await page.evaluate(() => Math.abs(window.jogo.player.rig.group.rotation.y) > 1.56));
  if (virou && !dormir.conchinha) {
    dormir.conchinha = await page.evaluate(() => {
      const j = window.jogo;
      const quem = (ator) => ({ nome: ator.rig.spec.name, x: ator.object.position.x, giro: ator.rig.group.rotation.y, abraca: ator.rig.abracando });
      return [quem(j.player), quem(j.parceiro)];
    });
  }
  if (/sono/.test(n.veu) && /\bon\b/.test(n.veu) && !dormir.sono) {
    dormir.sono = true;
    dormir.apagouAntesDoSono = !n.acesa && !n.luzDeDentro;
    await page.waitForTimeout(1000);
    await foto('7-sono');
  }
  if (n.estado === 'manha' && !dormir.manha && !/\bon\b/.test(n.veu)) dormir.manha = n;
  if (dormir.manha && n.portaFechada <= 0 && !n.deitado) dormir.abriu = true;
  if (dormir.abriu && n.cameraDeCena && n.ceuVisivel && !dormir.nascer && (await temFala())) {
    dormir.nascer = n;
    await page.waitForTimeout(500);
    await foto('8-nascer-do-sol');
    /*
     * O SOL NA TELA E SEM NADA NA FRENTE: o centro do disco projetado na
     * câmera de cena cai dentro do quadro, e o raio da câmera até ele não
     * passa por dentro da caixa de nenhuma árvore (caixa é generosa: se ela
     * não pega, a copa também não).
     */
    dormir.visao = await page.evaluate(() => {
      const j = window.jogo;
      const cam = j.cameraDeCena();
      let b = null;
      const caixas = [];
      j.current.world.root.traverse((o) => {
        if (o.userData?.peca === 'barraca-iglu') b = o;
      });
      const sol = b.userData.teste.ceu.sol;
      const V = cam.position.constructor;
      const p = sol.getWorldPosition(new V());
      const ndc = p.clone().project(cam);
      let Box3 = null;
      j.current.world.root.traverse((o) => { if (!Box3 && o.geometry?.boundingBox) Box3 = o.geometry.boundingBox.constructor; });
      if (!Box3) {
        j.current.world.root.traverse((o) => { if (!Box3 && o.geometry) { o.geometry.computeBoundingBox(); Box3 = o.geometry.boundingBox.constructor; } });
      }
      j.current.world.root.traverse((o) => { if (o.userData?.peca === 'arvore') caixas.push(new Box3().setFromObject(o)); });
      const dir = p.clone().sub(cam.position).normalize();
      const q = new V();
      let tapadoPor = null;
      for (let d = 0.5; d < 45 && !tapadoPor; d += 0.25) {
        q.copy(cam.position).addScaledVector(dir, d);
        const caixa = caixas.find((c) => c.containsPoint(q));
        if (caixa) tapadoPor = [+q.x.toFixed(1), +q.y.toFixed(1), +q.z.toFixed(1)];
      }
      return { naTela: Math.abs(ndc.x) < 0.9 && Math.abs(ndc.y) < 0.9 && ndc.z < 1, ndc: [+ndc.x.toFixed(2), +ndc.y.toFixed(2)], tapadoPor };
    });
  }
  if (dormir.nascer && n.estado === 'dia' && !n.cameraDeCena) break;
  if (await temFala()) {
    const texto = await lerFala();
    if (/^Boa noite/.test(texto)) {
      dormir.boaNoite.push(texto);
      if (!dormir.fotos.has('c')) { dormir.fotos.add('c'); await foto('6-conchinha'); }
    }
    await page.keyboard.press('KeyE');
  }
  await page.waitForTimeout(100);
}
await page.waitForTimeout(800);
const fim = await noite();
await foto('9-de-manha');
const save = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
const solto = await page.evaluate(() => ({ locked: window.jogo.player.locked, riding: window.jogo.player.riding }));

// ======================================================================= laudo
checar(entrou, 'o prompt de entrar na barraca nao apareceu');
checar(falasDeEntrada.at(-1) === 'Agora é só a gente bebito', `a entrada fecha com a fala do Renan: ${JSON.stringify(falasDeEntrada)}`);
checar(menuDeDia.includes('Passar a noite aqui'), `de dia, la dentro, da para passar a noite: ${JSON.stringify(menuDeDia)}`);
checar(anoitecer1.ceu && anoitecer1.camera, `o anoitecer e visto de fora, com a cupula do ceu: ${JSON.stringify(anoitecer1)}`);
checar(deNoite.estado === 'noite' && deNoite.estrelas > 0.99, `a noite chegou: ${JSON.stringify(deNoite)}`);
checar(deNoite.fundo !== diaAntes.fundo, 'o ceu do motor escureceu');
checar(deNoite.clima === 'noite-na-clareira', `a musica de ninar: ${deNoite.clima}`);
checar(deNoite.acesasNoVaral === deNoite.lampadas, `o varal todo aceso: ${deNoite.acesasNoVaral}/${deNoite.lampadas}`);
checar(deNoite.acesa && deNoite.globoBrilha && deNoite.luzDeDentro, `a lanterna acesa: ${JSON.stringify(deNoite)}`);
checar(!deNoite.ceuVisivel && deNoite.cameraDeCena, 'la dentro de noite, a cupula some e a camera olha de cima');
checar(menuDeNoite.includes('Dormir') && !menuDeNoite.includes('Passar a noite aqui'), `de noite, a escolha vira dormir: ${JSON.stringify(menuDeNoite)}`);
checar(laFora.vagaLumes >= 3, `vaga-lumes piscando: ${laFora.vagaLumes}`);
checar((laFora.sons.grilo ?? 0) > 0, `os grilos de noite: ${JSON.stringify(laFora.sons)}`);
checar(deVolta.estado === 'dia' && deVolta.fundo === diaAntes.fundo, `sair da clareira volta o dia: ${JSON.stringify(deVolta)}`);
checar(deVolta.clima === 'villa-lobos' && !deVolta.acesa && deVolta.acesasNoVaral === 0, `e apaga as luzes e devolve a musica: ${JSON.stringify(deVolta)}`);
checar(dormir.fechou && dormir.panosInteiros, `dormir fecha a porta inteira: ${JSON.stringify(dormir)}`);
checar(((await noite()).sons.ziper ?? 0) >= (somAntes.ziper ?? 0) + 2, 'o ziper fechando e abrindo');
const [a, b] = dormir.conchinha ?? [];
const renan = [a, b].find((q) => q?.nome === 'Renan');
const ari = [a, b].find((q) => q?.nome === 'Ari');
checar(renan && ari && Math.abs(renan.giro - ari.giro) < 0.01 && Math.abs(Math.abs(ari.giro) - Math.PI / 2) < 0.01,
  `de conchinha, os dois virados para o mesmo lado: ${JSON.stringify(dormir.conchinha)}`);
checar(renan && ari && (ari.x - renan.x) * Math.sign(ari.giro) > 0.3, `o Renan atras, o Ari na frente: ${JSON.stringify(dormir.conchinha)}`);
checar(renan?.abraca === true && ari?.abraca === false, `quem abraca e o Renan: ${JSON.stringify(dormir.conchinha)}`);
checar(dormir.boaNoite.join('|') === 'Boa noite, bebito|Boa noite, bebitolito', `o boa noite literal: ${JSON.stringify(dormir.boaNoite)}`);
checar(dormir.sono && dormir.apagouAntesDoSono, `a lanterna apaga e a tela escurece com o sono: ${JSON.stringify(dormir)}`);
checar(dormir.manha && (fim.sons.passarinho ?? 0) > 0, `de manha, o passarinho: ${JSON.stringify(fim.sons)}`);
checar(dormir.abriu, 'de manha a porta abre e os dois saem');
checar(dormir.nascer?.solVisivel, `o sol nascendo na cupula: ${JSON.stringify(dormir.nascer)}`);
checar(dormir.visao?.naTela && !dormir.visao?.tapadoPor, `da porta, o sol nasce na tela e sem arvore na frente: ${JSON.stringify(dormir.visao)}`);
checar(fim.estado === 'dia' && !fim.cameraDeCena && fim.fundo === diaAntes.fundo, `o dia de volta no fim: ${JSON.stringify(fim)}`);
checar(!solto.locked && !solto.riding, `a dupla solta no fim: ${JSON.stringify(solto)}`);
checar((save.memories ?? []).some((m) => m.id === 'noite-na-barraca'), 'a memoria da noite nao entrou no diario');
falhas.push(...erros);

console.log('1. noite:', JSON.stringify({ estado: deNoite.estado, clima: deNoite.clima, varal: `${deNoite.acesasNoVaral}/${deNoite.lampadas}`, acesa: deNoite.acesa, menu: menuDeNoite }));
console.log('2. la fora:', JSON.stringify({ vagaLumes: laFora.vagaLumes, grilos: laFora.sons.grilo }), '· de volta:', JSON.stringify({ estado: deVolta.estado, clima: deVolta.clima }));
console.log('3. o sol:', JSON.stringify(dormir.visao));
console.log('3. dormir:', JSON.stringify({ fechou: dormir.fechou, conchinha: dormir.conchinha, boaNoite: dormir.boaNoite, sono: dormir.sono, abriu: dormir.abriu, sol: dormir.nascer?.solVisivel }));
await browser.close();
if (falhas.length) {
  console.log('\nFALHAS:');
  for (const f of falhas) console.log(' -', f);
  process.exit(1);
}
console.log('\nsem erros');
