/** Câmeras com cada personagem REAL e chegada completa ao estacionamento.
 * CHROME_PATH=... CEL=1 SO=carinho|chegada JOGADOR=ari|renan
 * Usa só o preview e contextos de navegador novos, com save ?bebito.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
if (new URL(BASE).hostname === 'renanmv0.github.io') throw new Error('Este teste usa somente preview separado do jogo oficial.');
const OUT = process.argv[2] ?? '/tmp/cameras';
const SO = process.env.SO;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const erros = [];
const verifica = (ok, nome) => { assert.ok(ok, nome); console.log('ok:', nome); };
const espera = (page, f, arg) => page.waitForFunction(f, arg, { timeout: 180000 });
const botao = (page, texto) => page.getByRole('button', { name: texto, exact: true });
async function escolhas(page) {
  for (let i = 0; i < 100; i++) {
    if (await page.locator('.escolhas.show button').count()) return;
    // Clique síncrono: um E enfileirado no quadro seguinte podia selecionar a primeira opção do menu recém-aberto.
    await page.evaluate(() => { if (!document.querySelector('.escolhas.show button')) document.querySelector('.dialogue.show')?.click(); });
    await page.waitForTimeout(200);
  }
  throw new Error('O menu não abriu');
}
async function novaViagem(jogador) {
  const ctx = await browser.newContext(process.env.CEL ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1200, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => { if (erros.length < 20) erros.push(e.message); });
  await page.goto(`${BASE}/?bebito&carroPorDentro&cena=casa`);
  await espera(page, () => !!window.jogo?.current);
  await page.evaluate(jogador => {
    const g = window.jogo, b = window.aristoryBebitoMobile;
    for (const f of ['bebito:surpresa', 'bebito:renan-saiu', 'bebito:ganhou']) g.setFlag(f);
    if (g.playerId() !== jogador) g.swapCharacters();
    b.ritmoDoPresente.vezes = 5;
    b.pedirViagem({ sentido: 'ida', motorista: jogador, semente: 3 });
    g.goTo('viagem-de-carro');
  }, jogador);
  await espera(page, () => window.jogo.idDaCena === 'viagem-de-carro' && window.aristoryBebitoMobile.viagem.estado?.fase === 'dirigindo');
  return page;
}
try {
  for (const jogador of process.env.JOGADOR ? [process.env.JOGADOR] : ['ari', 'renan']) {
    const page = await novaViagem(jogador);
    verifica(await page.evaluate(j => window.jogo.playerId() === j, jogador), `${jogador}: personagem selecionado de verdade`);
    if (!SO || SO === 'carinho') {
      await page.locator('.botao-da-viagem').click();
      console.log('botão de visão acionado');
      await espera(page, () => window.aristoryBebitoMobile.viagem.passageiro.camera.dentro === 1);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.keyboard.down('KeyE');
      await espera(page, () => document.querySelectorAll('.escolhas.show button').length > 0);
      await page.keyboard.up('KeyE');
      const outro = jogador === 'ari' ? 'Renan' : 'Ari';
      await botao(page, `Encostar no ombro de ${outro}`).click();
      await espera(page, () => window.aristoryBebitoMobile.viagem.passageiro.camera.especial === 1 && window.jogo.emDialogo());
      const antes = await page.evaluate(() => window.aristoryBebitoMobile.viagem.estado.s);
      console.log('carinho em cena');
      const carinho = await page.evaluate(() => {
        const g = window.jogo, c = g.scene.getObjectByName('bebito-mobile');
        const cam = c.worldToLocal(g.camOmbro.position.clone());
        const dentro = p => { const v = p.clone().project(g.camOmbro); return Math.abs(v.x) < 0.85 && Math.abs(v.y) < 0.85 && v.z < 1; };
        return { z: cam.z, rostos: g.player.rig.head.visible && g.parceiro.rig.head.visible,
          enquadrados: dentro(g.cabecaDe('jogador')) && dentro(g.cabecaDe('parceiro')),
          gesto: g.player.rig.body.rotation.z, piloto: window.aristoryBebitoMobile.viagem.estado.piloto,
          pose: g.parceiro.rig.noCarro, peso: { ...g.renderer.info.render } };
      });
      await page.screenshot({ path: `${OUT}-${jogador}-carinho-frente.png` });
      verifica(carinho.z > 2 && carinho.rostos && carinho.enquadrados, `${jogador}: vista frontal com os dois rostos enquadrados`);
      verifica(carinho.gesto < -0.2 && carinho.pose === 'dirigindo', `${jogador}: encosta no ombro de quem continua dirigindo`);
      console.log('peso carinho:', JSON.stringify(carinho.peso));
      await escolhas(page);
      await espera(page, () => window.aristoryBebitoMobile.viagem.passageiro.camera.especial === 0);
      verifica(await page.evaluate(() => !window.jogo.player.rig.head.visible && Math.abs(window.jogo.player.rig.body.rotation.z) < 0.01), 'voltou à primeira pessoa e desfez o gesto');
      verifica((await page.evaluate(() => window.aristoryBebitoMobile.viagem.estado.s)) > antes, 'o carro continua andando durante o carinho');
      if (jogador === 'renan') {
        await botao(page, 'Jogar Brawl Stars no celular').click();
        for (let i = 0; i < 80; i++) {
          if (await page.evaluate(() => window.aristoryBebitoMobile.viagem.passageiro.celular.group.visible)) break;
          await page.keyboard.press('KeyE'); await page.waitForTimeout(200);
        }
        verifica(await page.evaluate(() => window.aristoryBebitoMobile.viagem.passageiro.celular.group.visible), 'o Renan de verdade vê o celular na primeira pessoa');
        await page.screenshot({ path: `${OUT}-renan-celular.png` });
        await escolhas(page);
      }
      await botao(page, 'Só olhar a paisagem').click();
      await page.locator('.botao-da-viagem').click();
      console.log('botão de visão acionado');
      await espera(page, () => window.aristoryBebitoMobile.viagem.estado.visao === 'fora');
      verifica(await page.evaluate(() => window.jogo.player.rig.noCarro === 'dirigindo' && window.jogo.player.rig.head.visible && !window.aristoryBebitoMobile.viagem.estado.piloto), 'retomou o volante, a pose e a câmera externa');
    }
    if (!SO || SO === 'chegada') {
      // A integração final é exercitada pela conclusão real da cena, abreviando só a distância da estrada.
      // O percurso inteiro do piloto é conferido separadamente por carroPorDentro.mjs (SO=piloto).
      if (jogador === 'renan') {
        await page.locator('.botao-da-viagem').click();
      console.log('botão de visão acionado');
        await espera(page, () => window.aristoryBebitoMobile.viagem.passageiro.camera.dentro === 1);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.keyboard.down('KeyE');
        await espera(page, () => document.querySelectorAll('.escolhas.show button').length > 0);
        await page.keyboard.up('KeyE');
        await botao(page, 'Encostar no ombro de Ari').click();
        await espera(page, () => window.aristoryBebitoMobile.viagem.passageiro.camera.especial === 1 && window.jogo.emDialogo());
      }
      const motorista = await page.evaluate(() => window.jogo.player.rig.noCarro === 'dirigindo' ? window.jogo.playerId() : (window.jogo.playerId() === 'ari' ? 'renan' : 'ari'));
      await page.evaluate(() => { const v = window.aristoryBebitoMobile.viagem; v.estado.s = v.rota.chegada + 2; v.estado.v = 0; v.estado.fase = 'fim'; });
      if (jogador === 'renan') {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        verifica(await page.evaluate(() => window.jogo.idDaCena === 'viagem-de-carro' && window.aristoryBebitoMobile.viagem.passageiro.camera.encostar === 1 && window.jogo.emDialogo()), 'a chegada espera o carinho terminar sem sobrescrever a conversa');
      }
      for (let i = 0; i < 120; i++) {
        if (await page.evaluate(() => window.jogo.idDaCena === 'villa-lobos')) break;
        await page.keyboard.press('KeyE'); await page.waitForTimeout(200);
      }
      await espera(page, () => window.jogo.idDaCena === 'villa-lobos' && window.jogo.scene.getObjectByName('bebito-mobile')?.userData.chegada);
      await page.evaluate(() => {
        const g = window.jogo, carro = g.scene.getObjectByName('bebito-mobile');
        const medidas = window.aristoryBebitoMobile.BEBITO_MOBILE;
        const col = g.current.world.colliders.filter(c => c.x > 45 && !(Math.abs(c.x - 51.9) < 0.01 && Math.abs(c.z - 5.5) < 0.01));
        window.colisoesDaChegada = [];
        g.current.world.onUpdate(() => {
          if (carro.userData.chegada.fase === 'concluida') return;
          const giro = carro.rotation.y, x = carro.position.x, z = carro.position.z;
          const eixos = [[Math.cos(giro), -Math.sin(giro)], [Math.sin(giro), Math.cos(giro)]];
          const meias = [medidas.largura / 2, medidas.comprimento / 2];
          for (const c of col) {
            let bate;
            if (c.kind === 'circle') {
              const dx = c.x - x, dz = c.z - z;
              const lx = dx * eixos[0][0] + dz * eixos[0][1];
              const lz = dx * eixos[1][0] + dz * eixos[1][1];
              bate = Math.hypot(Math.max(0, Math.abs(lx) - meias[0]), Math.max(0, Math.abs(lz) - meias[1])) < c.r;
            } else {
              const outros = [[Math.cos(c.rot), -Math.sin(c.rot)], [Math.sin(c.rot), Math.cos(c.rot)]];
              bate = [...eixos, ...outros].every(a => {
                const proj = (axes, h) => axes.reduce((r, b, i) => r + Math.abs(a[0] * b[0] + a[1] * b[1]) * h[i], 0);
                return Math.abs((c.x - x) * a[0] + (c.z - z) * a[1]) < proj(eixos, meias) + proj(outros, [c.hw, c.hd]);
              });
            }
            if (bate && window.colisoesDaChegada.length < 10) window.colisoesDaChegada.push({ c, x, z, giro });
          }
        });
      });
      for (const fase of ['abrindo', 'entrando', 'estacionando', 'estacionado']) {
        await espera(page, f => window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase === f, fase);
        await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 0; });
        verifica(await page.evaluate(m => window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.motorista === m && window.jogo.player.locked, motorista), 'motorista preservado e controle travado durante a manobra');
        if (fase === 'entrando') verifica(await page.evaluate(() => window.jogo.scene.getObjectByName('braco-da-cancela').rotation.z > 1.37), 'o carro só entra depois que a cancela está aberta');
        await page.screenshot({ path: `${OUT}-${jogador}-chegada-${fase}.png` });
        await page.evaluate(() => { window.aristoryBebitoMobile.ritmoDoPresente.vezes = 3; });
      }
      await espera(page, () => window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada.fase === 'concluida');
      const colisoes = await page.evaluate(() => window.colisoesDaChegada);
      verifica(colisoes.length === 0, `a carroceria não atravessa os obstáculos: ${JSON.stringify(colisoes)}`);
      const fim = await page.evaluate(() => {
        const g = window.jogo, c = g.scene.getObjectByName('bebito-mobile');
        return { x: c.position.x, z: c.position.z, giro: c.rotation.y, livre: !g.player.locked && !g.player.riding && !g.parceiro.riding,
          porta: c.userData.carro.portaAberta,
          poses: g.player.rig.noCarro === null && g.parceiro.rig.noCarro === null, camera: g.camOmbro === null,
          flag: g.flag('bebito:carro-no-parque'), viagens: g.stat('bebito:viagens-feitas'), oficial: localStorage.getItem('aristory.save.v1'), peso: { ...g.renderer.info.render } };
      });
      verifica(Math.abs(fim.x - 51.9) < 0.01 && Math.abs(fim.z - 5.5) < 0.01 && Math.abs(fim.giro + Math.PI / 2) < 0.01, 'carro na vaga do coração, de frente para a rua');
      verifica(await page.evaluate(() => window.jogo.scene.getObjectByName('braco-da-cancela').rotation.z === 0), 'a cancela fechou depois da passagem');
      verifica(fim.porta === 0 && fim.livre && fim.poses && fim.camera && fim.flag && fim.viagens === 1 && fim.oficial === null, 'dupla livre, câmera restaurada e progresso gravado somente no save de teste');
      console.log('peso chegada:', JSON.stringify(fim.peso));
      await page.screenshot({ path: `${OUT}-${jogador}-chegada-concluida.png` });
      await page.goto(`${BASE}/?bebito&carroPorDentro`); await espera(page, () => window.jogo?.idDaCena === 'villa-lobos');
      verifica(await page.evaluate(() => !!window.jogo.scene.getObjectByName('bebito-mobile') && !window.jogo.scene.getObjectByName('bebito-mobile').userData.chegada && window.jogo.stat('bebito:viagens-feitas') === 1), 'recarregar mantém o carro estacionado sem repetir a chegada nem creditar outra viagem');
    }
    await page.context().close();
  }
  verifica(erros.length === 0, `sem erros de página: ${erros.join('; ')}`);
} catch (erro) {
  for (const ctx of browser.contexts()) for (const page of ctx.pages()) {
    console.log('estado na falha:', await page.evaluate(() => ({ cena: window.jogo?.idDaCena, estado: window.aristoryBebitoMobile?.viagem.estado, botoes: [...document.querySelectorAll('.escolhas.show button')].map(b => b.textContent), fala: document.querySelector('.dialogue.show .text')?.textContent })).catch(() => null));
    await page.screenshot({ path: `${OUT}-falha.png` }).catch(() => {});
  }
  throw erro;
} finally { await browser.close(); }
