/**
 * AS CARTAS NA RODADA — cada carta de jardineiro, de jardim e do clube FAZ a
 * coisa dela, e não só entra na mão.
 *
 * As de jato têm o teste delas (`jato.mjs`, que mede o desenho). Estas aqui
 * mexem no resto: o corpo de quem rega, os bichos, os canteiros, as portas e o
 * pessoal do clube. Cada caso monta uma ESTUFA DE LABORATÓRIO — a rodada sem
 * ondas (a vitrine), sem os bichos parados dela — e põe exatamente o que a
 * carta precisa para agir: três bichos perto para o Grito, um canteiro pela
 * metade com bicho em cima para o Walter, oito gotas no chão para o Noel.
 *
 * O QUE PROVA QUE A CARTA AGIU é o contador `efeitos` da rodada (cada carta
 * soma um quando faz a coisa dela) MAIS um efeito no mundo que a carta
 * descreve: o bicho recuou, o canteiro se recuperou, a velocidade subiu, o
 * portão mudou. Contador sozinho diria só que o código passou por ali.
 *
 * Nada aqui espera tempo fixo: cada caso espera a CONDIÇÃO (com teto), porque
 * o Chromium sem tela anda a ~1/5 e a rodada roda 3× mais rápido no teste.
 *
 *   node scripts/cartasNaRodada.mjs /tmp/cr            # todas
 *   node scripts/cartasNaRodada.mjs /tmp/cr grito,bota # só essas
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? '/tmp/cr';
const SO = process.argv[3] ? new Set(process.argv[3].split(',')) : null;
const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const erros = [];
page.on('pageerror', (e) => erros.push(String(e)));
// o certificado das fontes de fora falha no Chromium sem rede: não é do jogo
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_CERT|net::ERR_/.test(m.text())) erros.push(m.text()); });

await page.goto(`${BASE}/?cena=estufa&em=0,-2&zoom=16`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !!window.jogo?.current?.world?.root?.userData?.rodada, null, { timeout: 30000 });
await page.mouse.click(640, 400);

const rodada = (fn, arg) => page.evaluate(fn, arg);
const estado = () => rodada(() => window.jogo.current.world.root.userData.rodada.estado());

/** espera uma condição sobre o estado, com teto; devolve o último estado */
async function ate(pred, teto = 20000) {
  const fim = Date.now() + teto;
  let e = await estado();
  while (!pred(e) && Date.now() < fim) {
    await page.waitForTimeout(200);
    e = await estado();
  }
  return e;
}

/**
 * A ESTUFA DE LABORATÓRIO: a rodada anterior sai (sem a fala da Josefina, que
 * travaria o jogador), a dupla vai para `(x, z)`, e a rodada começa com as
 * cartas na mão, sem onda e sem bicho.
 */
async function laboratorio(cartas, { x = -4, z = -2, folga = false } = {}) {
  await rodada(([cartas, x, z, folga]) => {
    const u = window.jogo.current.world.root.userData;
    const r = u.rodada;
    r.aoAcabar = null;
    if (r.rodando) r.terminar();
    // o que sobrou de um caso na mão de quem (a Troca de turno troca o corpo)
    if (window.jogo.playerId() !== 'ari') window.jogo.swapCharacters();
    window.jogo.debugPlace(x, z, Math.PI);
    r.escolhaForcada = 0;
    r.escalaDoTempo = 3;
    r.regadorDeFolga = folga;
    u.vitrineDoJato(cartas);
    r.limparBichos();
  }, [cartas, x, z, folga]);
  await page.waitForTimeout(300);
}

const resultados = [];
function confere(id, ok, detalhe) {
  resultados.push({ id, ok, detalhe });
  console.log(`  ${ok ? 'ok  ' : 'FALHOU'} ${id}${detalhe ? ` — ${detalhe}` : ''}`);
}

/** pega a primeira carta da tela aberta (em dois tempos: marca e confirma) */
async function pegarDaTela() {
  for (let i = 0; i < 40; i++) {
    const aberta = await page.evaluate(() => document.querySelector('.cartas-do-jardim')?.classList.contains('show'));
    if (aberta) break;
    await page.waitForTimeout(200);
  }
  const raridades = await page.evaluate(() =>
    [...document.querySelectorAll('.cartas-do-jardim .carta-jardim')].map((el) =>
      (el.className.match(/r-(comum|incomum|raro|lendario|consolo)/) ?? [])[1]),
  );
  await page.keyboard.press('Digit1');
  await page.waitForTimeout(400);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(800);
  return raridades;
}

const efeito = (e, id) => e.efeitos?.[id] ?? 0;

const CASOS = {
  // ============================================================ jardineiro
  bota: async () => {
    // a Lavanda fica em (-3,6; 8,8), com 1,6 de fundo: a terra começa em z = 8
    await laboratorio(['bota'], { x: -4.6, z: 6.6, folga: true });
    await page.keyboard.down('KeyS');
    let eu = await page.evaluate(() => window.jogo.playerPosition());
    for (let i = 0; i < 40 && eu.z < 8.4; i++) {
      await page.waitForTimeout(200);
      eu = await page.evaluate(() => window.jogo.playerPosition());
    }
    await page.keyboard.up('KeyS');
    const e = await estado();
    // sem a Bota o colisor segura o corpo (raio 0,42) em z = 7,58
    confere('bota', efeito(e, 'bota') > 0 && eu.z > 8.3, `andou até z ${eu.z.toFixed(2)} (a terra começa em 8)`);
  },
  pique: async () => {
    await laboratorio(['pique'], { x: -7, z: -7, folga: true });
    await page.keyboard.down('KeyS');
    const e = await ate((s) => s.velocidade > 1.25, 12000);
    await page.keyboard.up('KeyS');
    confere('pique', efeito(e, 'pique') > 0 && e.velocidade > 1.25 && e.desenho.poeiras > 0,
      `velocidade ${e.velocidade.toFixed(2)}, ${e.desenho.poeiras} poeiras`);
  },
  'pe-na-poca': async () => {
    await laboratorio(['poca', 'pe-na-poca'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.pocaAqui());
    const e = await ate((s) => efeito(s, 'pe-na-poca') > 0, 6000);
    confere('pe-na-poca', efeito(e, 'pe-na-poca') > 0 && e.velocidade > 1.3, `velocidade ${e.velocidade.toFixed(2)}`);
  },
  assobio: async () => {
    await laboratorio(['assobio'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('lagartejo', -2.5, -4.5);
      r.adiantar('assobio');
    });
    const e = await ate((s) => efeito(s, 'assobio') > 0, 6000);
    confere('assobio', efeito(e, 'assobio') > 0 && e.invasores.some((i) => i.estado === 'recuando') && e.desenho.notas > 0,
      `estados ${e.invasores.map((i) => i.estado).join(',')}`);
  },
  pulinho: async () => {
    await laboratorio(['pulinho'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', -4, -2.3));
    const e = await ate((s) => efeito(s, 'pulinho') > 0, 6000);
    confere('pulinho', efeito(e, 'pulinho') > 0 && e.invasores.some((i) => i.tonto), 'tonto depois do pulo');
  },
  grito: async () => {
    await laboratorio(['grito'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('lagartejo', -3, -3.5);
      r.soltarBicho('lagartejo', -5, -3.5);
      r.soltarBicho('gafanhopo', -4, -4.5);
    });
    const e = await ate((s) => efeito(s, 'grito') > 0, 6000);
    const recuando = e.invasores.filter((i) => i.estado === 'recuando').length;
    confere('grito', efeito(e, 'grito') > 0 && recuando === 3 && e.desenho.ondas > 0, `${recuando} recuando até a porta`);
  },
  coracaozinho: async () => {
    await laboratorio(['coracaozinho'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('lagartejo', -3, -3);
      r.fixarNivel(99);
      r.darGotas(20);
    });
    const e = await ate((s) => efeito(s, 'coracaozinho') > 0, 4000);
    confere('coracaozinho', efeito(e, 'coracaozinho') > 0 && e.invasores.some((i) => i.tonto), 'o bicho perto parou');
  },
  'ima-de-gota': async () => {
    await laboratorio(['ima-de-gota'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarGotasAqui(3, -2, 4));
    await ate((s) => s.gotasNoChao === 4, 4000);
    await page.waitForTimeout(1500);
    await rodada(() => window.jogo.current.world.root.userData.rodada.darGotas(5));
    await pegarDaTela();
    const e = await ate((s) => s.gotasNoChao === 0, 8000);
    confere('ima-de-gota', efeito(e, 'ima-de-gota') > 0 && e.gotasNoChao === 0 && e.juntadas >= 9,
      `juntadas ${e.juntadas}, no chão ${e.gotasNoChao}`);
  },
  'sorte-de-principiante': async () => {
    await laboratorio(['sorte-de-principiante'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.darGotas(5));
    const raridades = await pegarDaTela();
    const e = await estado();
    confere('sorte-de-principiante', efeito(e, 'sorte-de-principiante') > 0 && raridades.length === 3 && !raridades.includes('comum'),
      `no nível 1 a mesa veio ${raridades.join(', ')}`);
  },
  bis: async () => {
    await laboratorio(['bis'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.pegarCarta('bico-1', 3));
    const e = await ate((s) => s.mao.includes('bico-2'), 4000);
    confere('bis', efeito(e, 'bis') > 0 && e.mao.includes('bico-1') && e.mao.includes('bico-2'), `mão ${e.mao.join(',')}`);
  },
  'troca-de-turno': async () => {
    await laboratorio(['troca-de-turno'], { folga: true });
    await rodada(() => { window.jogo.current.world.root.userData.rodada.agua = 0; });
    await page.keyboard.press('KeyT');
    const e = await ate((s) => efeito(s, 'troca-de-turno') > 0, 5000);
    const regador = await page.evaluate(() => window.jogo.getActiveHandItem()?.id);
    confere('troca-de-turno', efeito(e, 'troca-de-turno') > 0 && regador === 'regador' && e.agua >= e.tanque - 0.01,
      `quem entrou está com ${regador}, água ${e.agua.toFixed(1)}/${e.tanque}`);
  },
  'olho-de-jardineira': async () => {
    await laboratorio(['olho-de-jardineira'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', 1, -6));
    const e = await ate((s) => s.trilha > 0, 4000);
    confere('olho-de-jardineira', e.trilha > 3, `${e.trilha} pontinhos`);
  },
  'os-dois-na-frente': async () => {
    await laboratorio(['os-dois-na-frente'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', -5.2, -4));
    const e = await ate((s) => efeito(s, 'os-dois-na-frente') >= 2, 10000);
    const temRegador = await page.evaluate(() => window.jogo.hasItem('regador', window.jogo.companionId()));
    confere('os-dois-na-frente', efeito(e, 'os-dois-na-frente') >= 2 && temRegador,
      `o parceiro de regador (${temRegador}) atirou ${efeito(e, 'os-dois-na-frente') - 1}×`);
  },
  'dedo-verde': async () => {
    await laboratorio(['dedo-verde'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.ferirCanteiro(0, 0.5);
      r.forcarFimDeOnda();
    });
    const e = await estado();
    const c = e.canteiros[0];
    confere('dedo-verde', efeito(e, 'dedo-verde') > 0 && c.vida > c.vidaMax * 0.6, `de 50% para ${Math.round((100 * c.vida) / c.vidaMax)}%`);
  },

  // ================================================================ jardim
  'segundo-tonel': async () => {
    await laboratorio(['segundo-tonel'], { x: 12.6, z: -7.4, folga: true });
    await rodada(() => { window.jogo.current.world.root.userData.rodada.agua = 0; });
    const e = await ate((s) => efeito(s, 'segundo-tonel') > 0 && s.agua > 3, 8000);
    confere('segundo-tonel', e.segundoTonel && efeito(e, 'segundo-tonel') > 0 && e.agua > 3, `encheu até ${e.agua.toFixed(1)} no tonel da direita`);
  },
  'la-de-tras': async () => {
    await laboratorio(['la-de-tras'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      window.jogo.parceiro.teleport(1, 6.8, Math.PI);
      r.ferirCanteiro(2, 0.4);
      r.adiantar('la-de-tras');
    });
    const e = await ate((s) => s.canteiros[2].vida > s.canteiros[2].vidaMax * 0.45, 10000);
    const c = e.canteiros[2];
    confere('la-de-tras', efeito(e, 'la-de-tras') > 0 && c.vida > c.vidaMax * 0.45, `${c.nome}: 40% → ${Math.round((100 * c.vida) / c.vidaMax)}%`);
  },
  espantalho: async () => {
    await laboratorio(['espantalho'], { x: -6, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('lagartejo', -3, -8);
      r.soltarBicho('lagartejo', 2, -8.5);
      r.soltarBicho('lagartejo', 4, -8);
    });
    const e = await ate((s) => s.invasores.filter((i) => i.puxado).length === 3, 8000);
    const puxados = e.invasores.filter((i) => i.puxado).length;
    confere('espantalho', e.espantalho > 0 && puxados === 3 && efeito(e, 'espantalho') >= 3, `${puxados} puxados, ${e.espantalho.toFixed(1)} s restando`);
  },
  'josefina-ajuda': async () => {
    await laboratorio(['josefina-ajuda'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.ferirCanteiro(1, 0.3));
    const e = await ate((s) => s.canteiros[1].vida > s.canteiros[1].vidaMax * 0.5, 10000);
    const c = e.canteiros[1];
    confere('josefina-ajuda', efeito(e, 'josefina-ajuda') > 0 && c.vida > c.vidaMax * 0.5, `${c.nome}: 30% → ${Math.round((100 * c.vida) / c.vidaMax)}%`);
  },
  'portao-emperrado': async () => {
    await laboratorio(['portao-emperrado'], { folga: true });
    const e0 = await estado();
    await rodada((p) => window.jogo.current.world.root.userData.rodada.agendar('lagartejo', p, 0.1), e0.emperrado);
    const e = await ate((s) => s.invasores.length > 0, 4000);
    const porta = e.invasores[0]?.porta;
    confere('portao-emperrado', e0.emperrado !== null && porta !== undefined && porta !== e0.emperrado && efeito(e, 'portao-emperrado') > 0,
      `emperrou o ${e0.emperrado}, o bicho veio pelo ${porta}`);
  },
  'cerca-viva': async () => {
    await laboratorio(['cerca-viva'], { x: -3.6, z: 6.4, folga: true });
    const e0 = await ate((s) => s.canteiros.some((c) => c.protegido), 3000);
    const i = e0.canteiros.findIndex((c) => c.protegido);
    await rodada((c) => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', c.x, c.z - 1.3), e0.canteiros[i]);
    await page.waitForTimeout(5000);
    const e = await estado();
    confere('cerca-viva', i >= 0 && e.canteiros[i].vida >= e.canteiros[i].vidaMax - 0.01 && efeito(e, 'cerca-viva') > 0,
      `${e0.canteiros[i]?.nome} intocado (${e.canteiros[i]?.vida.toFixed(1)}/${e.canteiros[i]?.vidaMax})`);
  },
  toldo: async () => {
    await laboratorio(['toldo'], { x: -3.6, z: 6.4, folga: true });
    const e = await ate((s) => s.canteiros.some((c) => c.toldo), 3000);
    const c = e.canteiros.find((k) => k.toldo);
    const outro = e.canteiros.find((k) => !k.toldo);
    confere('toldo', !!c && c.vidaMax > outro.vidaMax * 1.45, `${c?.nome}: ${c?.vidaMax} contra ${outro?.vidaMax}`);
  },
  'canteiro-de-pimenta': async () => {
    await laboratorio(['canteiro-de-pimenta'], { x: -3.6, z: 6.2, folga: true });
    const e0 = await ate((s) => s.canteiros.some((c) => c.pimenta), 3000);
    const c = e0.canteiros.find((k) => k.pimenta);
    await rodada((c) => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', c.x + 0.5, c.z - 1.6), c);
    const e = await ate((s) => efeito(s, 'canteiro-de-pimenta') > 0, 8000);
    confere('canteiro-de-pimenta', efeito(e, 'canteiro-de-pimenta') > 0 && e.invasores.every((i) => i.estado === 'fugindo') && e.desenho.ardidos > 0,
      `mordeu ${c?.nome} e saiu correndo`);
  },
  'planta-carnivora': async () => {
    await laboratorio(['planta-carnivora'], { x: -3.6, z: 6.2, folga: true });
    const e0 = await ate((s) => s.canteiros.some((c) => c.carnivora), 3000);
    const c = e0.canteiros.find((k) => k.carnivora);
    await rodada((c) => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', c.x - 0.6, c.z - 1.8), c);
    const e = await ate((s) => efeito(s, 'planta-carnivora') > 0, 8000);
    confere('planta-carnivora', efeito(e, 'planta-carnivora') > 0 && e.espantados > 0, `${c?.nome} mordeu (${e.espantados} espantado)`);
  },
  'sino-da-porta': async () => {
    await laboratorio(['sino-da-porta'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', 0, -12.2, { porta: 1, fora: true }));
    const e = await ate((s) => efeito(s, 'sino-da-porta') > 0, 10000);
    confere('sino-da-porta', efeito(e, 'sino-da-porta') > 0 && e.desenho.ondas > 0, 'tocou quando ele passou o portão');
  },
  'girassol-vigia': async () => {
    await laboratorio(['girassol-vigia'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.agendar('lagartejo', 2, 60));
    const e = await ate((s) => efeito(s, 'girassol-vigia') > 0, 4000);
    const giro = await page.evaluate(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      const c = r.canteiros.find((k) => k.tipo === 'girassol');
      return c.peca.userData.mudas.map((m, i) => Math.abs(m.rotation.y - c.giros[i])).reduce((a, b) => Math.max(a, b), 0);
    });
    confere('girassol-vigia', efeito(e, 'girassol-vigia') > 0 && giro > 0.2, `as flores giraram ${giro.toFixed(2)} rad`);
  },
  cerquinha: async () => {
    await laboratorio(['cerquinha'], { x: -7, z: 3, folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('lagartejo', 0.5, -7.5));
    let furou = false;
    let passou = false;
    for (let i = 0; i < 60 && !passou; i++) {
      await page.waitForTimeout(200);
      const e = await estado();
      const b = e.invasores[0];
      if (!b) break;
      if (Math.abs(b.x) < 3 && Math.abs(b.z + 4.2) < 0.12) furou = true;
      if (b.z > -3.2) passou = true;
    }
    const e = await estado();
    confere('cerquinha', !furou && passou && efeito(e, 'cerquinha') > 0, passou ? (furou ? 'atravessou a cerca' : 'contornou pela ponta') : 'não passou da cerca');
  },
  aspersor: async () => {
    await laboratorio(['aspersor'], { x: -7, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('coelhatu', 1.4, -1.2);
      r.adiantar('aspersor');
    });
    const e = await ate((s) => efeito(s, 'aspersor') > 0, 8000);
    const b = e.invasores[0];
    confere('aspersor', efeito(e, 'aspersor') > 0 && (!b || b.vida < b.vidaMax), 'o anel molhou o bicho do lado');
  },
  sementeira: async () => {
    await laboratorio(['sementeira'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.ferirCanteiro(0, 0);
      r.forcarComecoDeOnda();
    });
    const e = await estado();
    const c = e.canteiros[0];
    confere('sementeira', efeito(e, 'sementeira') > 0 && Math.abs(c.vida - c.vidaMax * 0.5) < 0.01, `brotou com ${Math.round((100 * c.vida) / c.vidaMax)}%`);
  },
  'estufa-trancada': async () => {
    await laboratorio(['estufa-trancada'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.forcarComecoDeOnda();
      r.soltarBicho('lagartejo', 0, -13, { porta: 1, fora: true });
    });
    const e = await ate((s) => efeito(s, 'estufa-trancada') > 0, 8000);
    const b = e.invasores[0];
    confere('estufa-trancada', e.trancas.length === 3 && efeito(e, 'estufa-trancada') > 0 && b && b.z < -11.3,
      `${e.trancas.length} cadeados, o bicho esperando em z ${b?.z.toFixed(2)}`);
  },
  'apito-da-gina': async () => {
    await laboratorio(['apito-da-gina'], { x: -7, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      for (const [x, z] of [[-2, -6], [0, -6], [2, -6], [4, -6]]) r.soltarBicho('lagartejo', x, z);
    });
    const e = await ate((s) => efeito(s, 'apito-da-gina') > 0, 5000);
    confere('apito-da-gina', efeito(e, 'apito-da-gina') > 0 && e.invasores.filter((i) => i.tonto).length === 4, 'os quatro congelaram');
  },
  'picole-do-mano': async () => {
    await laboratorio(['picole-do-mano'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.agua = 0;
      r.forcarFimDeOnda();
    });
    const e0 = await estado();
    if (e0.picole) await page.evaluate((p) => window.jogo.debugPlace(p.x, p.z, 0), e0.picole);
    const e = await ate((s) => efeito(s, 'picole-do-mano') > 0, 5000);
    confere('picole-do-mano', !!e0.picole && efeito(e, 'picole-do-mano') > 0 && e.agua >= e.tanque - 0.5 && e.velocidade > 1.25,
      `água ${e.agua.toFixed(1)}/${e.tanque}, velocidade ${e.velocidade.toFixed(2)}`);
  },
  'noel-avisa': async () => {
    await laboratorio(['noel-avisa'], { folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.forcarFimDeOnda());
    const e = await estado();
    confere('noel-avisa', efeito(e, 'noel-avisa') > 0, 'gritou o portão da próxima onda');
  },
  'jean-luc-no-tonel': async () => {
    await laboratorio(['jean-luc-no-tonel'], { x: -12.6, z: -7.4, folga: true });
    await rodada(() => { window.jogo.current.world.root.userData.rodada.agua = 0; });
    const e = await ate((s) => efeito(s, 'jean-luc-no-tonel') > 0, 5000);
    confere('jean-luc-no-tonel', efeito(e, 'jean-luc-no-tonel') > 0 && e.agua >= e.tanque - 0.01, 'encheu na hora');
  },
  'capy-salva-vidas': async () => {
    await laboratorio(['capy-salva-vidas'], { x: -7, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('coelhatu', 0.4, -2);
      r.soltarBicho('coelhatu', -0.4, 0.5);
    });
    const e0 = await ate((s) => efeito(s, 'capy-salva-vidas') > 0, 5000);
    const e = await ate((s) => s.invasores.every((i) => i.vida < i.vidaMax), 8000);
    confere('capy-salva-vidas', efeito(e0, 'capy-salva-vidas') > 0 && e.invasores.every((i) => i.vida < i.vidaMax), 'o jato do corredor molhou os dois');
  },
  'walter-de-plantao': async () => {
    await laboratorio(['walter-de-plantao'], { x: -7, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.soltarBicho('lagartejo', 2, 3);
      r.adiantar('walter');
    });
    const e = await ate((s) => efeito(s, 'walter-de-plantao') > 0, 5000);
    confere('walter-de-plantao', efeito(e, 'walter-de-plantao') > 0 && e.invasores[0]?.estado === 'recuando', 'latiu e ele recuou');
  },
  'adubo-do-noel': async () => {
    await laboratorio(['adubo-do-noel'], { x: 3.6, z: 5.6 });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('coelhatu', 3.2, 7.4));
    const e = await ate((s) => efeito(s, 'adubo-do-noel') > 0, 10000);
    confere('adubo-do-noel', efeito(e, 'adubo-do-noel') > 0 && e.canteiros.some((c) => c.adubado) && e.desenho.adubos > 0, 'o canteiro regado ficou adubado');
  },

  // ============================================================ chamados
  'chama-capy': async () => {
    await laboratorio(['chama-capy'], { x: -7, z: 3, folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('coelhatu', -3.6, 6.6));
    const e = await ate((s) => efeito(s, 'chama-capy') >= 2, 25000);
    confere('chama-capy', efeito(e, 'chama-capy') >= 2, `o Capy correu e regou ${efeito(e, 'chama-capy') - 1}×`);
  },
  'chama-gina': async () => {
    await laboratorio(['chama-gina'], { folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.agendar('lagartejo', 0, 40);
      r.agendar('lagartejo', 0, 41);
      r.agendar('lagartejo', 2, 42);
      r.forcarComecoDeOnda();
    });
    const e = await estado();
    const gina = e.trancas.find((t) => t.quem === 'gina');
    confere('chama-gina', efeito(e, 'chama-gina') > 0 && gina?.porta === 0, `trancou o portão ${gina?.porta}`);
  },
  'chama-walter': async () => {
    await laboratorio(['chama-walter'], { x: -7, z: 3, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.ferirCanteiro(1, 0.45);
      r.soltarBicho('coelhatu', -3.6, 7.3);
    });
    const e = await ate((s) => efeito(s, 'chama-walter') > 0, 25000);
    confere('chama-walter', efeito(e, 'chama-walter') > 0 && e.invasores.every((i) => i.estado === 'fugindo'), 'correu latindo e espantou');
  },
  'chama-noel': async () => {
    // o Noel anda no relógio do jogo, e não no da rodada: aqui a rodada roda a
    // 1×, senão os 20 s dele acabam antes de ele atravessar a estufa
    await laboratorio(['chama-noel'], { x: 2.5, z: 1.5, folga: true });
    await rodada(() => {
      const r = window.jogo.current.world.root.userData.rodada;
      r.escalaDoTempo = 1;
      r.fixarNivel(99);
      r.soltarGotasAqui(5.2, 2.6, 9);
    });
    const e = await ate((s) => efeito(s, 'chama-noel') > 0, 60000);
    confere('chama-noel', efeito(e, 'chama-noel') > 0 && e.juntadas > 0, `trouxe ${e.juntadas} gotas`);
  },
  'mutirao-do-clube': async () => {
    await laboratorio(['mutirao-do-clube'], { x: -7, z: 3, folga: true });
    await rodada(() => window.jogo.current.world.root.userData.rodada.soltarBicho('mae-lagartejo', 0, -6));
    const e = await ate((s) => efeito(s, 'mutirao-do-clube') >= 2, 25000);
    confere('mutirao-do-clube', e.chamados.mutirao > 0 && efeito(e, 'mutirao-do-clube') >= 2, `os quatro em ação (${efeito(e, 'mutirao-do-clube')} ações)`);
  },
};

/**
 * ONDE OLHAR NA FOTO de cada carta: o ponto e o zoom. Sem isto a câmera segue
 * a dupla, e a peça da carta (a dioneia, o cadeado no portão do fundo) fica
 * atrás dela ou fora do quadro.
 */
const FOTO = {
  bota: [-3.6, 8, 7],
  'olho-de-jardineira': [0, -3, 10],
  'segundo-tonel': [13.8, -7.4, 7],
  'la-de-tras': [2, 7.6, 8],
  espantalho: [0, -6.6, 7],
  'josefina-ajuda': [-2.4, 7.8, 8],
  'portao-emperrado': [0, -11, 8],
  'cerca-viva': [-3.6, 8.4, 7],
  toldo: [-3.6, 8.4, 7],
  'canteiro-de-pimenta': [-3.6, 8.4, 6],
  'planta-carnivora': [-3.6, 8, 5.5],
  'sino-da-porta': [0, -10.5, 8],
  'girassol-vigia': [-12.4, 0.2, 6],
  cerquinha: [0, -4.2, 8],
  aspersor: [0, -0.6, 6],
  'estufa-trancada': [0, -11, 8],
  'picole-do-mano': null,
  'jean-luc-no-tonel': [-13.8, -7.4, 5],
  'capy-salva-vidas': [0, 3, 12],
  'chama-capy': [-3.6, 5.5, 9],
  'chama-gina': [-6.5, -9, 9],
  'chama-walter': [-3.6, 6, 8],
  'chama-noel': [4, 2.5, 8],
  'mutirao-do-clube': [0, -2, 14],
};

for (const [id, caso] of Object.entries(CASOS)) {
  if (SO && !SO.has(id)) continue;
  try {
    await caso();
  } catch (e) {
    confere(id, false, `quebrou: ${e.message.split('\n')[0]}`);
  }
  const foto = FOTO[id];
  if (foto) {
    await page.evaluate(([x, z, zoom]) => {
      const alvo = window.__alvoDaFoto ?? (window.__alvoDaFoto = new window.jogo.current.world.root.constructor());
      alvo.position.set(x, 0, z);
      window.jogo.current.world.root.add(alvo);
      window.jogo.focusCamera(alvo);
      window.jogo.setZoom(zoom);
    }, foto);
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: `${OUT}-${id}.png` });
  if (foto) await page.evaluate(() => { window.jogo.focusCamera(null); window.jogo.setZoom(16); });
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');
await browser.close();
const falhas = resultados.filter((r) => !r.ok);
if (falhas.length || erros.length) {
  console.log(`FALHOU: ${falhas.map((f) => f.id).join(', ')}`);
  process.exit(1);
}
console.log(`tudo certo (${resultados.length} cartas)`);
process.exit(0);
