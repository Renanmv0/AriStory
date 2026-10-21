/**
 * O LAGO DO VILLA LOBOS, de cara nova — mede e fotografa.
 *
 * Uma parte por pedaço (`SO=agua,patos,...`; sem `SO` roda todas):
 *
 * - AGUA: o contorno torto (o ponto do Jean-Luc dentro d'água, a trilha da
 *   clareira e a arena fora da areia), o material da água no lugar do disco,
 *   e as fotos de longe e de perto;
 * - BEIRA: não dá para entrar na água por nenhum lado da margem, nem pelos
 *   lados nem pela ponta do trapiche; no trapiche o pé fica na tábua (o
 *   relevo) e na areia volta ao chão;
 * - PATOS: eles nadam (andam de verdade), os patinhos vão atrás da mãe, o
 *   mergulho de cabeça some com a cabeça na água, e o rastro chega na água;
 * - GARCA: o bote leva o bico até a água; com a dupla perto ela voa e pousa
 *   em outro ponto de pesca;
 * - TIGRES: com a dupla perto do tronco os três pulam n'água; longe, voltam;
 * - PEDRINHA: a carga certa quica, a forte demais é "tibum", segurar F na
 *   ponta do trapiche joga, e o outro joga a dele;
 * - PONTA: sentar na beirada (as pernas penduradas, o pé fazendo marola, a
 *   memória) e levantar de volta no trapiche;
 * - MOEDA: a moedinha do desejo custa R$ 1, voa, cai e dá a memória;
 * - CLIQUE: o mouse na água faz marola; a placa fala.
 *
 * Uso: node scripts/lago.mjs /caminho/prefixo
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './lago';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SAVE = 'aristory.save.v1';
const SO = process.env.SO ?? '';
const parte = (nome) => !SO || SO.split(',').includes(nome);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
// CEL=1: tela de celular em pé (o aviso quebra em linhas e não pode tapar a barra de força)
const page = await browser.newPage({ viewport: process.env.CEL ? { width: 390, height: 760 } : { width: 1100, height: 820 }, ignoreHTTPSErrors: true });
const erros = [];
const falhas = [];
const checar = (ok, msg, dado) => {
  if (!ok) falhas.push(dado === undefined ? msg : `${msg}: ${JSON.stringify(dado)}`);
  if (process.env.LOG) console.log(`  ${ok ? 'ok ' : 'FALHOU'} ${msg}${dado === undefined ? '' : ' ' + JSON.stringify(dado)}`);
};
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_|ERR_CERT|favicon/.test(m.text())) erros.push('console: ' + m.text()); });
const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });
const temEscolha = () => page.locator('.escolhas.show button').count();
const temFala = () => page.locator('.dialogue.show').count();
const escolher = async (texto) => {
  for (let i = 0; i < 240 && !(await temEscolha()); i++) await page.waitForTimeout(250);
  await page.locator('.escolhas.show button', { hasText: texto }).first().click();
  await page.waitForTimeout(300);
};
/** passa as falas até aparecer uma escolha (ou acabar), devolve o que foi dito */
const passarFalas = async (limite = 80) => {
  const ditas = [];
  for (let i = 0; i < limite; i++) {
    if (await temEscolha()) break;
    if (await temFala()) {
      if (await page.evaluate(() => window.jogo.ui.typing !== null)) {
        await page.waitForTimeout(150);
        continue;
      }
      ditas.push((await page.locator('.dialogue .text').textContent().catch(() => '')) ?? '');
      await page.keyboard.press('KeyE');
    }
    await page.waitForTimeout(250);
    if (!(await temFala()) && !(await temEscolha()) && ditas.length && i > 6) break;
  }
  return ditas;
};
/** passa as falas até aparecer uma escolha */
const ateEscolha = async (limite = 160) => {
  for (let i = 0; i < limite && !(await temEscolha()); i++) {
    if ((await temFala()) && !(await page.evaluate(() => window.jogo.ui.typing !== null))) await page.keyboard.press('KeyE');
    await page.waitForTimeout(250);
  }
};
/** o gancho da cena, achado uma vez (varrer o parque a cada passo pesava) */
const lago = (fn, arg) => page.evaluate(([corpo, a]) => {
  if (!window.__ganchoDoLago) {
    window.jogo.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') window.__ganchoDoLago = o.userData.teste; });
  }
  // eslint-disable-next-line no-new-func
  return new Function('t', 'a', 'j', corpo)(window.__ganchoDoLago, a, window.jogo);
}, [fn, arg]);
const por = async (corpo, limite = 60, arg) => {
  for (let i = 0; i < limite * 4; i++) {
    if (await lago(corpo, arg)) return true;
    await page.waitForTimeout(250);
  }
  return false;
};
const ir = (x, z, olhar = Math.PI * 1.25) => page.evaluate(([a, b, c]) => window.jogo.debugPlace(a, b, c), [x, z, olhar]);
const memorias = () => page.evaluate((k) => (JSON.parse(localStorage.getItem(k) ?? '{}').memories ?? []).map((m) => m.id), SAVE);
const sons = () => page.evaluate(() => Object.fromEntries(window.jogo.audio.contagem));

await page.goto(`${BASE}/?cena=villa-lobos`, { waitUntil: 'networkidle' });
await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ carteira: 5 })), SAVE);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => window.jogo?.current?.world, null, { timeout: 60000 });
await lago('t.ritmo.vezes = 3; return true;');
await ir(-12.5, 15.5);
await page.waitForTimeout(1500);

// ======================================================================= AGUA
if (parte('agua')) {
  const m = await lago(`
    const f = (x, z) => t.agua.fundura(x, z);
    let malha = null;
    j.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') malha = o; });
    return {
      jeanLuc: f(-18.4, 17.2), trilha: f(-30.9, 15.6), arena: f(-19.7, 21.2), olhar: f(-13, 11),
      chave: malha?.material?.customProgramCacheKey?.(),
      ninfeias: t.ninfeias.folhasNaAgua.length, tufos: t.tufos.length,
    };`);
  checar(m.jeanLuc > 0.8, 'o Jean-Luc emerge dentro d\'água', m.jeanLuc);
  checar(m.trilha < -1.5, 'a trilha da clareira fica fora da água e da areia', m.trilha);
  checar(m.arena < -1.2, 'a quina da arena fica fora da areia', m.arena);
  checar(m.chave === 'agua-do-lago', 'o disco do lago pinta com a água nova', m.chave);
  checar(m.ninfeias >= 30, 'tem ninféia no lago', m.ninfeias);
  checar(m.tufos >= 5, 'tem taboal na beira', m.tufos);

  // as fotos de longe (três giros de câmera) e o peso
  await ir(-13.2, 16.8);
  await page.evaluate(() => window.jogo.setZoom(17));
  await page.waitForTimeout(1500);
  await foto('lago');
  const info = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
  console.log(`  peso na vista do lago: ${info.calls} desenhos, ${info.triangles} triângulos`);
  for (let i = 1; i <= 2; i++) {
    await page.keyboard.press('KeyR');
    await page.waitForTimeout(1200);
    await foto(`lago-giro${i}`);
  }
  await page.keyboard.press('KeyR');
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(800);
}

// ====================================================================== BEIRA
if (parte('beira')) {
  /*
   * A ÁGUA NÃO SE PISA — medido nos colisores, e não andando: o navegador do
   * teste roda o jogo a poucos quadros por segundo, e andar até a beira por
   * dez lados levaria minutos. Volta inteira no lago, de 0,5° em 0,5°, e em
   * cada ângulo os pontos da faixa da beira (da areia molhada até 1,2 m
   * dentro d'água): todo ponto tem que estar dentro de algum colisor (com o
   * raio da dupla, 0,42) — menos as tábuas do trapiche, que se pisam. A faixa
   * fechada é o que basta: o meio do lago fica do lado de dentro dela.
   */
  const livres = await lago(`
    const cols = j.current.world.colliders;
    const R = 0.42;
    const preso = (x, z) => cols.some((c) => {
      if (c.kind === 'circle') return Math.hypot(x - c.x, z - c.z) < c.r + R;
      const cos = Math.cos(-c.rot), sin = Math.sin(-c.rot);
      const rx = x - c.x, rz = z - c.z;
      const lx = rx * cos - rz * sin, lz = rx * sin + rz * cos;
      const dx = lx - Math.max(-c.hw, Math.min(c.hw, lx));
      const dz = lz - Math.max(-c.hd, Math.min(c.hd, lz));
      return dx * dx + dz * dz < R * R;
    });
    const soltos = [];
    for (let i = 0; i < 720; i++) {
      const a = (i / 720) * Math.PI * 2;
      for (const f of [-0.45, -0.2, 0.1, 0.5, 1.2]) {
        const p = t.agua.naBeira(a, f);
        const l = t.trapiche.noTrapiche(p.x, p.z);
        if (Math.abs(l.x) < 0.85 && l.z > -0.2 && l.z < 5.0) continue;
        if (!preso(p.x, p.z)) soltos.push([+(a * 180 / Math.PI).toFixed(1), f]);
      }
    }
    return soltos;`);
  checar(livres.length === 0, 'nenhum ponto da beira ou da água fica pisável (fora as tábuas)', livres.slice(0, 12));

  // o trapiche: a tábua sob o pé, a cerca dos lados e a ponta
  const deque = await lago(`
    const tr = t.trapiche;
    return { meio: tr.doTrapiche(0, 3), ponta: tr.ponta, lado: tr.doTrapiche(0.6, 3.5), giro: tr.giro };`);
  await ir(deque.meio.x, deque.meio.z, deque.giro);
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => window.jogo.playerPosition().y);
  checar(Math.abs(y - 0.2) < 0.02, 'no trapiche o pé fica na tábua', y.toFixed(3));
  // empurrar para o lado (para fora do trapiche) e para a frente (para fora da ponta)
  for (const tecla of ['KeyA', 'KeyD', 'KeyW']) {
    await ir(deque.meio.x, deque.meio.z, deque.giro);
    await page.keyboard.down(tecla);
    await page.waitForTimeout(2200);
    await page.keyboard.up(tecla);
    const l = await lago('const p = j.playerPosition(); return { ...t.trapiche.noTrapiche(p.x, p.z), y: p.y };');
    checar(Math.abs(l.x) < 0.95 && l.z < 5.05, `${tecla} no trapiche não cai na água`, l);
  }
  await ir(deque.lado.x, deque.lado.z, deque.giro);
  await page.waitForTimeout(500);
  await foto('trapiche');
  // de volta à areia, de volta ao chão
  const fora = await lago('return t.agua.naBeira(0, -1.6);');
  await ir(fora.x, fora.z);
  await page.waitForTimeout(600);
  const y0 = await page.evaluate(() => window.jogo.playerPosition().y);
  checar(Math.abs(y0) < 0.005, 'fora do trapiche o pé volta ao chão', y0);
}

// ====================================================================== PATOS
if (parte('patos')) {
  await ir(-12.5, 15.5);
  const antes = await lago('return t.patos.map((p) => [p.x, p.z]);');
  // pelo relógio do LAGO, e não da parede: o navegador do teste roda o jogo
  // a poucos quadros por segundo
  const t0 = await lago('return t.agua.tempo;');
  await por('return t.agua.tempo > a + 30;', 120, t0);
  const depois = await lago(`return {
    pos: t.patos.map((p) => [p.x, p.z]),
    filhotes: t.patinhos.map((p) => Math.hypot(p.x - t.mae.x, p.z - t.mae.z)),
    naAgua: t.patos.map((p) => t.agua.fundura(p.x, p.z)),
    rastros: t.agua.uniforms.uRastros.value.filter((v) => v.w > 0).length,
  };`);
  const andou = depois.pos.slice(0, 3).map(([x, z], i) => Math.hypot(x - antes[i][0], z - antes[i][1]));
  checar(andou.filter((d) => d > 0.5).length >= 2, 'os patos nadam', andou.map((d) => d.toFixed(2)));
  checar(Math.max(...depois.filhotes) < 3, 'os patinhos vão atrás da mãe', depois.filhotes.map((d) => d.toFixed(2)));
  checar(Math.min(...depois.naAgua) > 0.3, 'nenhum pato sai da água', depois.naAgua.map((d) => d.toFixed(2)));
  checar(depois.rastros >= 7, 'cada pato deixa rastro na água', depois.rastros);
  // o mergulho de cabeça
  await lago("t.patos[0].entrarEmServico(); t.patos[0].fazer('mergulho'); return true;");
  await por("return t.patos[0].gestoAgora !== 'mergulho';", 30);
  const tombo = await lago('return t.patos[0].maiorTombo;');
  const mergulhou = tombo > 1.2;
  await lago('t.patos[0].voltarAPassear(); return true;');
  checar(mergulhou, 'o mergulho de cabeça tomba o pato até o rabo ficar de pé', tombo.toFixed(2));
  // de perto: a mãe e os patinhos
  await page.evaluate(() => {
    let mae = null;
    window.jogo.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') mae = o.userData.teste.mae.group; });
    window.jogo.focusCamera(mae);
    window.jogo.setZoom(4.5);
  });
  await page.waitForTimeout(1200);
  await foto('patos');
  await lago("t.patos[1].fazer('asas'); return true;");
  await page.evaluate(() => {
    let p = null;
    window.jogo.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') p = o.userData.teste.patos[1].group; });
    window.jogo.focusCamera(p);
    window.jogo.setZoom(3);
  });
  await page.waitForTimeout(500);
  await foto('pato-asas');
  await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(15); });
}

// ====================================================================== GARCA
if (parte('garca')) {
  await ir(-12.5, 15.5);
  await page.evaluate(() => {
    let g = null;
    window.jogo.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') g = o.userData.teste.garca.group; });
    window.jogo.focusCamera(g);
    window.jogo.setZoom(3.6);
  });
  await page.waitForTimeout(2500);
  await foto('garca');
  // o bote: o bico desce até a água
  await lago('t.garca.darOBote(); return true;');
  await page.waitForTimeout(150);
  await foto('garca-bote');
  await por("return t.garca.fazendoAgora !== 'bote';", 10);
  const menor = await lago('return t.garca.bicoMaisBaixo;');
  checar(menor < 0.06 && menor > -0.15, 'o bote leva o bico até a água', menor.toFixed(3));
  // a dupla chega perto: ela voa para outro ponto de pesca
  const de = await lago('return { x: t.garca.x, z: t.garca.z };');
  await page.evaluate(() => window.jogo.focusCamera(null));
  const beira = await lago('return t.agua.naBeira(t.agua.angulo(t.garca.x, t.garca.z), -1.0);');
  await ir(beira.x, beira.z);
  const voou = await por('return t.garca.voando;', 10);
  checar(voou, 'a garça voa quando a dupla chega perto');
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    let g = null;
    window.jogo.current.world.root.traverse((o) => { if (o.name === 'agua-do-lago') g = o.userData.teste.garca.group; });
    window.jogo.focusCamera(g);
    window.jogo.setZoom(5);
  });
  await page.waitForTimeout(400);
  await foto('garca-voando');
  const pousou = await por('return !t.garca.voando;', 30);
  const para = await lago('return { x: t.garca.x, z: t.garca.z, y: t.garca.group.position.y };');
  checar(pousou && Math.hypot(para.x - de.x, para.z - de.z) > 3, 'ela pousa em outro ponto de pesca', para);
  await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(15); });
}

// ===================================================================== TIGRES
if (parte('tigres')) {
  const tronco = await lago('return t.tronco;');
  await ir(-12.5, 15.5);
  await page.evaluate(() => {
    let tr = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'tronco-do-lago') tr = o; });
    window.jogo.focusCamera(tr);
    window.jogo.setZoom(3.2);
  });
  await page.waitForTimeout(1200);
  await foto('tigres');
  const noTronco = await lago('return t.tigres.filter((x) => x.noTronco).length;');
  checar(noTronco === 3, 'os três tigres-d\'água tomam sol no tronco', noTronco);
  const plocs = (await sons()).ploc ?? 0;
  await page.evaluate(() => window.jogo.focusCamera(null));
  const naAreia = await lago('return t.agua.naBeira(t.agua.angulo(t.tronco.x, t.tronco.z), -1.2);');
  await ir(naAreia.x, naAreia.z);
  const pularam = await por('return t.tigres.every((x) => x.naAgua);', 15);
  checar(pularam, 'com a dupla perto, os três pulam n\'água');
  checar(((await sons()).ploc ?? 0) >= plocs + 3, 'cada um com o seu "ploc"');
  await page.evaluate(() => {
    let tr = null;
    window.jogo.current.world.root.traverse((o) => { if (o.userData?.peca === 'tronco-do-lago') tr = o; });
    window.jogo.focusCamera(tr);
    window.jogo.setZoom(4);
  });
  await page.waitForTimeout(1500);
  await foto('tigres-nadando');
  await page.evaluate(() => window.jogo.focusCamera(null));
  await ir(-12.5, 15.5);
  const voltaram = await por('return t.tigres.every((x) => x.noTronco);', 60);
  checar(voltaram, 'com a dupla longe, eles voltam para o tronco');
}

// =================================================================== PEDRINHA
if (parte('pedrinha')) {
  const deque = await lago('return { ponta: t.trapiche.ponta, giro: t.trapiche.giro };');
  await ir(deque.ponta.x, deque.ponta.z, deque.giro);
  await page.waitForTimeout(800);
  // a carga certa quica; a forte demais é "tibum"
  const q0 = (await sons()).quique ?? 0;
  await lago('t.jogarPedrinha(0.76); return true;');
  await por('return t.minhaPedra.voando;', 10);
  await page.waitForTimeout(300);
  await foto('pedrinha-voando');
  await por('return t.minhaPedra.terminou;', 20);
  const certa = await lago('return t.minhaPedra.quiques;');
  checar(certa >= 4, 'a carga certa dá vários quiques', certa);
  checar(((await sons()).quique ?? 0) - q0 >= certa, 'cada quique com o seu "tic"');
  await lago('t.jogarPedrinha(0.99); return true;');
  // espera SAIR da mão antes de esperar cair: senão o "terminou" é o da pedra de antes
  await por('return t.minhaPedra.voando;', 10);
  await por('return t.minhaPedra.terminou;', 20);
  const forte = await lago('return t.minhaPedra.quiques;');
  checar(forte === 0, 'forte demais é tibum', forte);
  // segurar F de verdade, na ponta do trapiche (o navegador do teste roda o
  // jogo devagar: segura até a barra aparecer)
  await page.waitForTimeout(800);
  await page.keyboard.down('KeyF');
  for (let i = 0; i < 40 && !(await page.locator('.carga.show').count()); i++) await page.waitForTimeout(150);
  const barra = await page.locator('.carga.show').count();
  await page.waitForTimeout(300);
  // carregando, o aviso sai da frente da barra (no celular ele a tapava inteira)
  const avisoNaFrente = await page.evaluate(() => Number(getComputedStyle(document.querySelector('.prompt')).opacity));
  await foto('pedrinha-barra');
  await page.keyboard.up('KeyF');
  checar(barra > 0, 'segurar F mostra a barra de força');
  checar(avisoNaFrente < 0.05, 'o aviso some enquanto a barra carrega', avisoNaFrente);
  const saiu = await por('return t.minhaPedra.voando || t.minhaPedra.terminou;', 6);
  checar(saiu, 'soltar o F joga a pedrinha');
  await por('return t.minhaPedra.terminou;', 20);
  // a vez do outro
  await lago('t.outroJoga(); return true;');
  const ele = await por('return t.pedraDoOutro.voando || t.pedraDoOutro.terminou;', 6);
  checar(ele, 'o outro joga a dele');
  await por('return t.pedraDoOutro.terminou;', 20);
  await passarFalas(20);
  const recorde = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '{}').stats?.['lago.recorde'] ?? 0, SAVE);
  checar(recorde >= certa, 'o recorde de quiques fica guardado', recorde);
}

// ====================================================================== PONTA
if (parte('ponta')) {
  const deque = await lago('return { ponta: t.trapiche.ponta, giro: t.trapiche.giro };');
  await ir(deque.ponta.x, deque.ponta.z, deque.giro);
  await page.waitForTimeout(800);
  await page.keyboard.press('KeyE');
  await escolher('Sentar na beirada');
  const marolas0 = await lago('return t.agua.uniforms.uMarolas.value.filter((v) => v.w > 0).length;');
  await ateEscolha();
  const sentados = await lago('return t.sentados() && j.player.riding && j.parceiro.riding;');
  checar(sentados, 'os dois sentam na beirada');
  const pernas = await page.evaluate(() => [window.jogo.player.rig.legL.rotation.x, window.jogo.parceiro.rig.legR.rotation.x]);
  checar(pernas.every((x) => x > -1.0 && x < 0.2), 'as pernas penduradas para baixo (não para a frente)', pernas.map((x) => x.toFixed(2)));
  // o pé fazendo marola
  await page.waitForTimeout(2500);
  const marolas = await lago('return t.agua.uniforms.uMarolas.value.filter((v) => v.w > 0 && t.agua.tempo - v.z < 3).length;');
  checar(marolas >= 1, 'o pé na água faz marola', { antes: marolas0, agora: marolas });
  await foto('ponta-sentados');
  await page.keyboard.press('KeyR');
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1200);
  await foto('ponta-sentados-de-frente');
  await page.keyboard.press('KeyR');
  await page.keyboard.press('KeyR');
  checar((await memorias()).includes('lago-pe-na-agua'), 'a memória do pé na água');
  await escolher('Levantar');
  await page.waitForTimeout(800);
  const solto = await page.evaluate(() => ({ riding: window.jogo.player.riding, y: window.jogo.playerPosition().y }));
  checar(!solto.riding && Math.abs(solto.y - 0.2) < 0.03, 'levanta de volta em cima do trapiche', solto);
}

// ====================================================================== MOEDA
if (parte('moeda')) {
  const deque = await lago('return { ponta: t.trapiche.ponta, giro: t.trapiche.giro };');
  await ir(deque.ponta.x, deque.ponta.z, deque.giro);
  await page.waitForTimeout(800);
  const antes = await page.evaluate(() => window.jogo.carteira());
  await page.keyboard.press('KeyE');
  await escolher('moedinha');
  await por('return t.moedaNoAr?.visible;', 10);
  await foto('moeda-no-ar');
  await passarFalas(30);
  const depois = await page.evaluate(() => window.jogo.carteira());
  checar(depois === antes - 1, 'a moedinha custa R$ 1', { antes, depois });
  checar((await memorias()).includes('lago-moedinha'), 'a memória da moedinha');
}

// ===================================================================== CLIQUE
if (parte('clique')) {
  // nenhuma fala pendurada de antes (o clique e a placa não valem com o jogo travado)
  for (let i = 0; i < 20 && ((await temFala()) || (await temEscolha())); i++) {
    if (await temEscolha()) await page.keyboard.press('Escape');
    else await page.keyboard.press('KeyE');
    await page.waitForTimeout(300);
  }
  const ondeOlhar = await lago('return t.agua.naBeira(0.15, -1.6);');
  await ir(ondeOlhar.x, ondeOlhar.z);
  // a câmera de volta ao normal: as partes de antes deixam o zoom colado, e o
  // ponto da água caía fora da tela
  await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(15); });
  await page.waitForTimeout(1500);
  // projeta um ponto da água, na frente da dupla, na tela pela câmera de verdade
  const naAgua = await lago('return t.agua.naBeira(0.15, 2.2);');
  const tela = await page.evaluate(({ x, z }) => {
    const j = window.jogo;
    const v = j.playerPosition().clone().set(x, 0, z).project(j.iso.camera);
    const r = document.querySelector('canvas').getBoundingClientRect();
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
  }, naAgua);
  const g0 = (await sons()).gota ?? 0;
  await page.mouse.move(tela.x, tela.y);
  await page.waitForTimeout(200);
  await page.mouse.down();
  await page.mouse.up();
  for (let i = 0; i < 20 && ((await sons()).gota ?? 0) <= g0; i++) await page.waitForTimeout(250);
  checar(((await sons()).gota ?? 0) > g0, 'o mouse na água faz o "plim" e a marola');
  await foto('clique');
  // a placa
  const placa = await lago('return t.placa;');
  for (let i = 0; i < 20; i++) {
    await ir(placa.x + 0.55, placa.z + 0.55);
    await page.waitForTimeout(400);
    if (/placa/.test((await page.locator('.prompt .label').textContent().catch(() => '')) ?? '')) break;
  }
  await page.keyboard.press('KeyE');
  for (let i = 0; i < 40 && !(await temFala()); i++) await page.waitForTimeout(250);
  const falas = await passarFalas(40);
  checar(falas.some((f) => /Proibido nadar/.test(f)), 'a placa de proibido nadar', falas);
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
if (falhas.length) console.log('FALHAS:\n - ' + falhas.join('\n - '));
else console.log('tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
