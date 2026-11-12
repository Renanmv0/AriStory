/**
 * O BEBITO MOBILE — o carro que o Renan dá de presente para o Ari
 * (`docs/BEBITO-MOBILE.md`, `src/world/bebitoMobile/`).
 *
 * O carro ainda não mora em cena nenhuma (ele chega pela quest do presente):
 * este teste o estaciona na rua do Villa Lobos pelo atalho `?carro=x,z` e
 * confere, medindo:
 *
 * - O MODELO: a base no chão, o meio no meio, o tamanho que `BEBITO_MOBILE`
 *   diz, e o tamanho ao lado da dupla;
 * - A FICHA: cada vaga tem os encaixes dela, com nome; cada detalhe da ficha
 *   de fábrica está no carro; todo id do catálogo tem modelo; outra ficha dá
 *   outro carro (cor, placa, vaga vazia);
 * - O SAVE: a ficha torta volta consertada, o save antigo (sem o campo) abre
 *   com a de fábrica, e a ficha gravada volta igual depois de recarregar;
 * - OS COMANDOS: as rodas giram, o volante e as rodas da frente esterçam, o
 *   teto sai, os faróis, o freio e o pisca acendem, e o solavanco sobe e assenta;
 * - O PESO: quantos desenhos e triângulos o carro custa por quadro;
 * - e as FOTOS: os quatro lados na câmera de sempre, e de perto por fora e por
 *   dentro (com e sem teto).
 *
 * Uso: node scripts/bebitoMobile.mjs /caminho/prefixo
 *      SO=fotos|ficha|comandos|peso roda uma parte
 *      CEL=1 fotografa também no celular em pé
 */
import { chromium } from 'playwright';

const OUT = process.argv[2] ?? './bebito';
const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SO = process.env.SO ? process.env.SO.split(',') : null;
const roda = (parte) => !SO || SO.includes(parte);

/** onde o carro estaciona: a rua do parque, longe do ônibus, encostado na guia */
const VAGA = { x: 38.4, z: -9 };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 860 }, deviceScaleFactor: 1 });
const erros = [];
const falhas = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));
const confere = (ok, texto) => {
  console.log(`${ok ? '  ok ' : 'FALHA'} ${texto}`);
  if (!ok) falhas.push(texto);
};

/** `SEM_FUNDIR=1` monta o carro sem juntar as malhas (`?semFundir`): é o "antes" da conta do peso */
const SEM_FUNDIR = process.env.SEM_FUNDIR ? '&semFundir' : '';
const abrir = async (extra = SEM_FUNDIR) => {
  await page.goto(`${BASE}/?cena=villa-lobos&carro=${VAGA.x},${VAGA.z}&em=${VAGA.x + 5},${VAGA.z + 9}${extra}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.bebitoMobile, null, { timeout: 30000 });
  await page.waitForTimeout(1800);
};
await abrir();

/** a câmera de cena (perspectiva) num ponto em volta do carro, olhando para outro (em metros do carro SEM a escala dele) */
const cena = async (de, para) => {
  await page.evaluate(([d, p, v]) => {
    const V = window.jogo.scene.position.constructor;
    const e = window.aristoryBebitoMobile.BEBITO_MOBILE.escala;
    window.jogo.setCameraOmbro(new V(v.x + d[0] * e, d[1] * e, v.z + d[2] * e), new V(v.x + p[0] * e, p[1] * e, v.z + p[2] * e));
  }, [de, para, VAGA]);
  await page.waitForTimeout(700);
};
const isometrica = async (zoom) => {
  await page.evaluate((z) => {
    window.jogo.setCameraOmbro(null);
    window.jogo.focusCamera(window.bebitoMobile.group);
    window.jogo.setZoom(z);
  }, zoom);
  await page.waitForTimeout(1300);
};
const foto = (nome) => page.screenshot({ path: `${OUT}-${nome}.png` });

// ================================================================== o modelo
if (roda('modelo') || roda('ficha')) {
  const m = await page.evaluate(() => {
    const carro = window.bebitoMobile;
    const { BEBITO_MOBILE } = window.aristoryBebitoMobile;
    carro.group.updateWorldMatrix(true, true);
    const b = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] };
    const inv = carro.group.matrixWorld.clone().invert();
    const v = carro.group.position.clone();
    let malhas = 0;
    let triangulos = 0;
    carro.group.traverse((o) => {
      if (!o.isMesh || !o.geometry) return;
      // (os halos e a poça de luz são planos apagados: não contam no tamanho)
      let p = o;
      let apagado = false;
      for (; p && p !== carro.group; p = p.parent) if (!p.visible) apagado = true;
      if (apagado) return;
      malhas += 1;
      const n = o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count;
      triangulos += (n / 3) * (o.isInstancedMesh ? o.count : 1);
      if (o.isInstancedMesh) return;
      const pos = o.geometry.attributes.position;
      const mat = inv.clone().multiply(o.matrixWorld);
      for (let i = 0; i < pos.count; i += 3) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mat);
        b.min[0] = Math.min(b.min[0], v.x); b.max[0] = Math.max(b.max[0], v.x);
        b.min[1] = Math.min(b.min[1], v.y); b.max[1] = Math.max(b.max[1], v.y);
        b.min[2] = Math.min(b.min[2], v.z); b.max[2] = Math.max(b.max[2], v.z);
      }
    });
    return { b, malhas, triangulos: Math.round(triangulos), medidas: BEBITO_MOBILE };
  });
  console.log('— o modelo');
  const { b } = m;
  console.log(`   caixa: x ${b.min[0].toFixed(2)}…${b.max[0].toFixed(2)} · y ${b.min[1].toFixed(2)}…${b.max[1].toFixed(2)} · z ${b.min[2].toFixed(2)}…${b.max[2].toFixed(2)}`);
  console.log(`   ${m.malhas} malhas · ${m.triangulos} triângulos`);
  // (as rodas são lote e ficam fora da caixa medida; a lataria começa na soleira)
  confere(b.min[1] > 0.15 && b.min[1] < 0.4, `a carroceria fica acima do chão, em cima das rodas (${b.min[1].toFixed(2)})`);
  confere(Math.abs(b.max[1] - m.medidas.altura) < 0.75, `a altura bate com BEBITO_MOBILE (${b.max[1].toFixed(2)} com a antena, ${m.medidas.altura.toFixed(2)} o teto)`);
  confere(Math.abs((b.min[2] + b.max[2]) / 2) < 0.12, 'o carro está centrado no comprimento');
  confere(b.max[2] - b.min[2] < m.medidas.comprimento + 0.35, `o comprimento não passa do contrato (${(b.max[2] - b.min[2]).toFixed(2)} m, com os para-choques)`);
  confere(b.max[0] - b.min[0] < m.medidas.largura + 0.6, `a largura não passa do contrato (${(b.max[0] - b.min[0]).toFixed(2)} m, com os retrovisores)`);
}

// =================================================================== a ficha
if (roda('ficha')) {
  console.log('— a ficha e as vagas');
  const f = await page.evaluate(() => {
    const k = window.aristoryBebitoMobile;
    const carro = window.bebitoMobile;
    const vagas = {};
    for (const vaga of k.VAGAS_DO_CARRO) {
      const lista = carro.encaixes[vaga] ?? [];
      vagas[vaga] = {
        lugares: k.DEF_DAS_VAGAS[vaga].lugares,
        tipo: k.DEF_DAS_VAGAS[vaga].tipo,
        encaixes: lista.map((e) => e?.name ?? null),
        noCarro: lista.map((e) => {
          if (!e) return null;
          const peca = e.children.find((c) => c.name.startsWith('detalhe:'));
          return peca ? peca.name.slice(8) : (e.userData.adesivo ?? null);
        }),
      };
    }
    // todo id do catálogo monta num carro (uma ficha só com ele)
    const semModelo = [];
    for (const d of k.CATALOGO_DO_CARRO) {
      if (k.DEF_DAS_VAGAS[d.vaga].tipo === 'calota') continue;
      const ficha = k.copiarFicha(k.FICHA_DE_FABRICA);
      for (const v of k.VAGAS_DO_CARRO) ficha.vagas[v] = ficha.vagas[v].map(() => null);
      ficha.vagas[d.vaga][0] = d.id;
      const c = new k.BebitoMobile(ficha);
      const e = c.encaixes[d.vaga][0];
      const tem = e.children.some((x) => x.name === `detalhe:${d.id}`) || e.userData.adesivo === d.id;
      if (!tem) semModelo.push(d.id);
    }
    // outra ficha, outro carro
    const outra = k.copiarFicha(k.FICHA_DE_FABRICA);
    outra.pintura.lataria = 0xf6a6c0;
    outra.placa = 'ARI';
    outra.vagas.painel = [null, null, null];
    const c2 = new k.BebitoMobile(outra);
    const cor = c2.group.getObjectByName('lataria').material.color.getHex();
    const painel2 = c2.encaixes.painel.map((e) => e.children.length);
    // a ficha torta
    const torta = k.normalizarFicha({
      pintura: { lataria: 'azul', teto: -4, estofado: 0x112233 },
      placa: 'bebê do ari!!',
      vagas: { painel: ['nao-existe', 'estrela-do-ari', 'jean-luc-de-painel', 'girassol-da-josefina', 'a-mais'], teto: 'x' },
    });
    return {
      vagas, semModelo, cor, painel2, torta,
      fabrica: k.FICHA_DE_FABRICA, vazia: k.normalizarFicha(undefined), ficha: carro.ficha,
    };
  });
  for (const [vaga, v] of Object.entries(f.vagas)) {
    if (v.tipo === 'calota') continue;
    const nomes = v.encaixes.length === v.lugares && v.encaixes.every((n, i) => n === `vaga:${vaga}:${i}`);
    confere(nomes, `vaga ${vaga}: ${v.lugares} encaixe(s) com nome`);
    const pedido = f.fabrica.vagas[vaga];
    confere(JSON.stringify(v.noCarro) === JSON.stringify(pedido), `vaga ${vaga}: no carro está o que a ficha pede (${pedido.map((x) => x ?? '—').join(', ')})`);
  }
  confere(f.semModelo.length === 0, `todo detalhe do catálogo tem modelo${f.semModelo.length ? ' — faltam: ' + f.semModelo.join(', ') : ''}`);
  confere(f.cor === 0xf6a6c0, 'outra ficha pinta a lataria de outra cor');
  confere(f.painel2.every((n) => n === 0), 'vaga vazia na ficha é encaixe vazio no carro');
  confere(JSON.stringify(f.vazia) === JSON.stringify(f.fabrica), 'sem ficha nenhuma (save antigo) vem a de fábrica');
  const t = f.torta;
  confere(t.pintura.lataria === f.fabrica.pintura.lataria && t.pintura.teto === f.fabrica.pintura.teto && t.pintura.estofado === 0x112233, 'cor que não é cor volta ao padrão; a que é, fica');
  confere(t.placa === 'BEBEDOA', `a placa é limpa e cortada (${t.placa})`);
  confere(JSON.stringify(t.vagas.painel) === JSON.stringify([null, null, 'jean-luc-de-painel']), `id que não existe ou é de outra vaga vira lugar vazio, e lugar a mais é cortado (${JSON.stringify(t.vagas.painel)})`);
  confere(JSON.stringify(t.vagas.teto) === JSON.stringify(f.fabrica.vagas.teto), 'vaga que não é lista volta a de fábrica');

  // o save: gravar, recarregar e ler; e o save antigo, sem o campo
  await page.evaluate(() => {
    const j = window.jogo;
    const ficha = j.fichaDoBebitoMobile();
    ficha.placa = 'RENAN';
    ficha.vagas.teto = [null];
    ficha.vagas.painel = ['jean-luc-de-painel', null, null];
    j.salvarFichaDoBebitoMobile(ficha);
  });
  await abrir();
  const depois = await page.evaluate(() => ({ save: window.jogo.fichaDoBebitoMobile(), carro: window.bebitoMobile.ficha }));
  confere(depois.save.placa === 'RENAN' && depois.save.vagas.painel[0] === 'jean-luc-de-painel' && depois.save.vagas.painel[1] === null, 'a ficha gravada volta igual depois de recarregar');
  confere(depois.carro.placa === 'RENAN', 'o carro é montado com a ficha do save');
  // o save antigo: o mesmo save, sem o campo do carro
  await page.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      try {
        const dados = JSON.parse(localStorage.getItem(chave));
        if (dados && typeof dados === 'object' && 'bebitoMobile' in dados) {
          delete dados.bebitoMobile;
          localStorage.setItem(chave, JSON.stringify(dados));
        }
      } catch { /* não é o save */ }
    }
  });
  await abrir();
  const antigo = await page.evaluate(() => ({ save: window.jogo.fichaDoBebitoMobile(), fabrica: window.aristoryBebitoMobile.FICHA_DE_FABRICA }));
  confere(JSON.stringify(antigo.save) === JSON.stringify(antigo.fabrica), 'o save antigo, de antes do carro, abre com a ficha de fábrica');
}

// ================================================================ os comandos
if (roda('comandos')) {
  console.log('— os comandos');
  const c = await page.evaluate(() => {
    const carro = window.bebitoMobile;
    const g = carro.group;
    const rodas = g.getObjectByName('rodas');
    const volante = g.getObjectByName('volante');
    const teto = g.getObjectByName('teto');
    const carroceria = g.getObjectByName('carroceria');
    const matriz = () => Array.from(rodas.instanceMatrix.array.slice(0, 32));
    const m0 = matriz();
    carro.rodar(0.5);
    const m1 = matriz();
    const giro = m0.some((v, i) => Math.abs(v - m1[i]) > 1e-4);
    carro.estercar(0.4);
    const m2 = matriz();
    // a primeira e a segunda cópia são as da frente; a terceira é de trás
    const frenteVirou = m1.slice(0, 16).some((v, i) => Math.abs(v - m2[i]) > 1e-4);
    const trasFicou = Array.from(rodas.instanceMatrix.array.slice(32, 48)).every((v, i) => Math.abs(v - rodas.instanceMatrix.array[32 + i]) < 1e-9);
    const volanteGirou = Math.abs(volante.rotation.z) > 0.5;
    carro.estercar(0);
    carro.mostrarTeto(false);
    const semTeto = teto.visible === false;
    carro.mostrarTeto(true);
    carro.acenderFarois(true);
    const farois = g.getObjectByName('farois-acesos').visible && g.getObjectByName('poca-dos-farois').visible;
    carro.acenderFarois(false);
    carro.frear(true);
    const freio = g.getObjectByName('freio-aceso').visible;
    carro.frear(false);
    carro.pisca('esquerda');
    let esq = 0;
    let dir = 0;
    for (let i = 0; i < 60; i++) {
      carro.update(1 / 30);
      if (g.getObjectByName('pisca-esquerdo').visible) esq += 1;
      if (g.getObjectByName('pisca-direito').visible) dir += 1;
    }
    carro.pisca(null);
    // o solavanco: sobe, passa do ponto e assenta
    carro.solavanco(1);
    let pico = 0;
    for (let i = 0; i < 20; i++) {
      carro.update(1 / 30);
      pico = Math.max(pico, carroceria.position.y);
    }
    for (let i = 0; i < 240; i++) carro.update(1 / 30);
    const assentou = Math.abs(carroceria.position.y) < 0.002 && Math.abs(carroceria.rotation.x) < 0.002;
    // os penduricalhos balançam mais andando
    const pendente = g.getObjectByName('pendente-da-estrela');
    const amplitude = () => {
      let a = 0;
      for (let i = 0; i < 90; i++) {
        carro.update(1 / 30);
        a = Math.max(a, Math.abs(pendente.rotation.x));
      }
      return a;
    };
    const parado = amplitude();
    carro.andando(1);
    const andando = amplitude();
    carro.andando(0);
    const assentos = [carro.assentos.motorista, carro.assentos.passageiro, carro.assentos.frenteMeio, ...carro.assentos.tras].map((a) => ({ nome: a.name, x: +a.position.x.toFixed(2), y: +a.position.y.toFixed(2), z: +a.position.z.toFixed(2) }));
    // A CAMA: os encostos da frente deitam para trás e ficam rentes aos assentos
    const medirEncosto = () => {
      const e = g.getObjectByName('encosto:motorista');
      e.updateWorldMatrix(true, true);
      const inv = g.matrixWorld.clone().invert();
      const b = { minY: 1e9, maxY: -1e9, minZ: 1e9, maxZ: -1e9 };
      const v = g.position.clone();
      e.traverse((o) => {
        if (!o.isMesh) return;
        const pos = o.geometry.attributes.position;
        const m = inv.clone().multiply(o.matrixWorld);
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(m);
          b.minY = Math.min(b.minY, v.y); b.maxY = Math.max(b.maxY, v.y);
          b.minZ = Math.min(b.minZ, v.z); b.maxZ = Math.max(b.maxZ, v.z);
        }
      });
      return b;
    };
    const emPe = medirEncosto();
    carro.deitarEncostos(1);
    const logo = carro.camaFeita;
    for (let i = 0; i < 90; i++) carro.update(1 / 30);
    const feita = carro.camaFeita;
    const deitado = medirEncosto();
    carro.deitarEncostos(0, 'os-dois', true);
    const dePe = carro.camaFeita;
    carro.mostrarCargaDoBanco(false);
    const semCarga = g.getObjectByName('carga-do-banco-de-tras').visible === false;
    carro.mostrarCargaDoBanco(true);
    const k = window.aristoryBebitoMobile.BEBITO_MOBILE;
    return {
      giro, frenteVirou, trasFicou, volanteGirou, semTeto, farois, freio, esq, dir, pico, assentou, parado, andando, assentos,
      emPe, deitado, logo, feita, dePe, semCarga, cama: k.cama, alturaDoAssento: k.assento, temCama: carro.cama?.name === 'cama',
    };
  });
  confere(c.giro, 'rodar() gira as rodas');
  confere(c.frenteVirou && c.volanteGirou, 'estercar() vira as rodas da frente e o volante junto');
  confere(c.semTeto, 'mostrarTeto(false) tira o teto');
  confere(c.farois, 'acenderFarois() acende os halos e a poça na rua');
  confere(c.freio, 'frear() acende a luz de freio');
  confere(c.esq > 15 && c.esq < 50 && c.dir === 0, `o pisca da esquerda pisca sozinho (${c.esq} de 60 quadros aceso, o da direita ${c.dir})`);
  confere(c.pico > 0.01 && c.assentou, `o solavanco sobe (${(c.pico * 100).toFixed(1)} cm) e assenta`);
  confere(c.andando > c.parado * 2, `a estrela balança mais andando (${c.parado.toFixed(3)} → ${c.andando.toFixed(3)} rad)`);
  confere(c.assentos.length === 6 && c.assentos[0].x > 0 && c.assentos[1].x < 0, `seis lugares de sentar (dois na frente, o do meio para bicho pequeno, e três atrás), o motorista no +X (${c.assentos.map((a) => a.nome.slice(8)).join(', ')})`);
  confere(c.emPe.maxY > c.alturaDoAssento + 0.5, `em pé, o encosto da frente sobe ${(c.emPe.maxY - c.alturaDoAssento).toFixed(2)} m acima do assento`);
  confere(c.logo < 0.2 && c.feita > 0.999, 'deitarEncostos(1) deita devagar (o update é quem leva) e chega ao fim');
  confere(Math.abs(c.deitado.maxY - c.alturaDoAssento) < 0.012, `deitado, o encosto fica rente ao assento (${c.deitado.maxY.toFixed(3)} × ${c.alturaDoAssento.toFixed(3)})`);
  confere(c.dePe === 0, 'deitarEncostos(0, …, naHora) levanta na hora');
  confere(c.cama.comprimento > 1.85 && c.cama.largura > 1.9, `a cama feita tem ${c.cama.comprimento.toFixed(2)} × ${c.cama.largura.toFixed(2)} m (cabem os dois deitados, de 1,72 e 1,78)`);
  confere(c.temCama && c.semCarga, 'tem a âncora da cama, e mostrarCargaDoBanco(false) guarda o que vai no banco de trás');
}

// ==================================================================== o peso
if (roda('peso')) {
  console.log('— o peso (a câmera de sempre, o carro no meio do quadro)');
  await isometrica(9);
  const medir = async (visivel) => {
    await page.evaluate((v) => { window.bebitoMobile.group.visible = v; }, visivel);
    await page.waitForTimeout(900);
    return page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
  };
  const sem = await medir(false);
  const com = await medir(true);
  console.log(`   sem o carro: ${sem.calls} desenhos · ${sem.triangles} triângulos`);
  console.log(`   com o carro: ${com.calls} desenhos · ${com.triangles} triângulos`);
  console.log(`   a diferença no quadro: ${com.calls - sem.calls} desenhos e ${com.triangles - sem.triangles} triângulos (o parque se mexe, então isto oscila de uma medida para outra)`);
  // o número que não oscila: quantas malhas o carro tem (275 sem a junção, com \`SEM_FUNDIR=1\`)
  const malhas = await page.evaluate(() => {
    let n = 0;
    window.bebitoMobile.group.traverse((o) => {
      if (!o.isMesh) return;
      for (let p = o; p; p = p.parent) if (!p.visible) return;
      n += 1;
    });
    return n;
  });
  console.log(`   o carro tem ${malhas} malhas à vista`);
  if (!SEM_FUNDIR) confere(malhas <= 60, `o carro inteiro são no máximo 60 malhas (${malhas})`);
}

// =================================================================== as fotos
if (roda('fotos')) {
  console.log('— as fotos');
  // a dupla sai de perto: o carro sozinho
  await page.evaluate((v) => window.jogo.debugPlace(v.x + 9, v.z + 14, 0), VAGA);
  // os quatro lados na câmera de sempre (o carro gira, a câmera fica)
  for (const [nome, giro] of [['frente', 0], ['passageiro', Math.PI / 2], ['tras', Math.PI], ['motorista', -Math.PI / 2]]) {
    await page.evaluate((g) => { window.bebitoMobile.group.rotation.y = g; }, giro);
    await isometrica(7.5);
    await foto(`iso-${nome}`);
  }
  await page.evaluate(() => { window.bebitoMobile.group.rotation.y = 0; });

  // de perto, em volta
  const VOLTA = [
    ['frente-34', [4.4, 2.5, 5.4], [0, 0.95, 0.1]],
    ['frente', [0, 1.35, 6.9], [0, 0.95, 0]],
    ['lado-do-motorista', [7.4, 1.5, 0], [0, 1.0, 0]],
    ['lado-do-passageiro', [-7.4, 1.5, 0], [0, 1.0, 0]],
    ['tras-34', [-4.2, 2.5, -5.6], [0, 0.95, -0.1]],
    ['tras', [0, 1.3, -6.8], [0, 0.95, 0]],
    ['de-cima', [0.01, 8.8, 0.4], [0, 0, 0]],
    ['adesivos', [0.5, 1.15, -4.1], [0, 0.95, -2.2]],
    ['cara', [0.9, 1.0, 4.3], [0, 0.75, 2.2]],
    ['pelo-para-brisa', [0.5, 2.5, 3.3], [0, 1.2, 1.0]],
    ['roda', [2.9, 0.65, 2.9], [0.95, 0.42, 1.47]],
    ['janelas', [3.6, 1.9, 0.6], [1.0, 1.4, 0.2]],
    ['janelas-de-tras', [-3.4, 2.0, -2.6], [-0.9, 1.4, -1.2]],
  ];
  for (const [nome, de, para] of VOLTA) {
    await cena(de, para);
    await foto(nome);
  }
  // as luzes
  await page.evaluate(() => {
    const c = window.bebitoMobile;
    c.acenderFarois(true);
    c.frear(true);
    c.pisca('alerta');
    for (let i = 0; i < 3; i++) c.update(0.01);
  });
  await cena([4.4, 2.5, 5.4], [0, 0.95, 0.1]);
  await foto('luzes-frente');
  await cena([-4.2, 2.5, -5.6], [0, 0.95, -0.1]);
  await foto('luzes-tras');
  await page.evaluate(() => {
    const c = window.bebitoMobile;
    c.acenderFarois(false);
    c.frear(false);
    c.pisca(null);
  });

  // a casinha de boneca: o teto sai
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(false));
  for (const [nome, de, para] of [
    ['sem-teto', [2.6, 4.6, 3.0], [0, 0.7, -0.1]],
    ['sem-teto-de-cima', [0.01, 6.2, 0.2], [0, 0.5, 0]],
    ['painel', [-0.15, 2.05, -0.3], [0.05, 1.0, 1.25]],
    ['banco-de-tras', [0.1, 2.4, 0.6], [0, 0.75, -1.2]],
    ['chaveiro', [0.05, 1.25, 0.45], [0.2, 0.86, 1.1]],
  ]) {
    await cena(de, para);
    await foto(nome);
  }
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(true));
  await isometrica(7.5);
  await foto('iso-sem-teto-antes');

  // ao lado da dupla, para o tamanho
  await page.evaluate((v) => window.jogo.debugPlace(v.x + 2.1, v.z + 0.9, -Math.PI / 2), VAGA);
  await page.waitForTimeout(900);
  await isometrica(8);
  await foto('com-a-dupla');
  await cena([5.6, 1.7, 3.2], [0.6, 1.0, 0.3]);
  await foto('com-a-dupla-de-perto');

  if (process.env.CEL) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await isometrica(8);
    await foto('celular');
  }
}

// ================================================================ as faces coplanares
/*
 * O `zfighting.mjs` só mede caixa reta (`BoxGeometry`), e as caixas do carro são
 * de quina redonda. Aqui a mesma conta vale para elas: com `?semFundir` (antes
 * da junção, quando cada peça ainda é uma malha), a caixa envolvente de cada
 * caixa NÃO girada, no quadro da carroceria, e os pares de faces que olham para
 * o mesmo lado, no mesmo plano, com área em comum.
 */
if (roda('coplanar')) {
  console.log('— as faces coplanares (caixas de quina redonda, antes da junção)');
  await abrir('&semFundir');
  const r = await page.evaluate(() => {
    const carro = window.bebitoMobile;
    const raiz = carro.group.getObjectByName('carroceria');
    raiz.updateWorldMatrix(true, true);
    const inv = raiz.matrixWorld.clone().invert();
    const caixas = [];
    const Q = raiz.quaternion.constructor;
    const q = new Q();
    const qr = raiz.getWorldQuaternion(new Q()).invert();
    raiz.traverse((o) => {
      if (!o.isMesh || !['BoxGeometry', 'RoundedBoxGeometry'].includes(o.geometry?.type)) return;
      if (o.material?.transparent) return;
      // só a caixa que não está girada em relação ao carro
      o.getWorldQuaternion(q).premultiply(qr);
      if (Math.abs(q.x) > 1e-4 || Math.abs(q.y) > 1e-4 || Math.abs(q.z) > 1e-4) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const b = o.geometry.boundingBox.clone().applyMatrix4(inv.clone().multiply(o.matrixWorld));
      let dono = o;
      while (!dono.name && dono.parent) dono = dono.parent;
      caixas.push({ nome: `${dono.name}#${caixas.length}`, min: b.min.toArray(), max: b.max.toArray() });
    });
    const achados = [];
    for (let a = 0; a < caixas.length; a++) {
      for (let b = a + 1; b < caixas.length; b++) {
        const A = caixas[a];
        const B = caixas[b];
        for (let eixo = 0; eixo < 3; eixo++) {
          const o1 = (eixo + 1) % 3;
          const o2 = (eixo + 2) % 3;
          const s1 = Math.min(A.max[o1], B.max[o1]) - Math.max(A.min[o1], B.min[o1]);
          const s2 = Math.min(A.max[o2], B.max[o2]) - Math.max(A.min[o2], B.min[o2]);
          if (s1 <= 0.004 || s2 <= 0.004) continue;
          for (const f of ['min', 'max']) {
            if (Math.abs(A[f][eixo] - B[f][eixo]) < 0.0015) {
              achados.push(`${'xyz'[eixo]} = ${A[f][eixo].toFixed(3)} · área ${(s1 * s2).toFixed(4)} · ${A.nome}.${f} × ${B.nome}.${f}`);
            }
          }
        }
      }
    }
    return { quantas: caixas.length, achados };
  });
  console.log(`   ${r.quantas} caixas medidas`);
  for (const a of r.achados) console.log(`   ${a}`);
  confere(r.achados.length === 0, `nenhum par de faces coplanares (${r.achados.length})`);
  await abrir();
}

// ==================================================================== a porta
/*
 * A PORTA DO MOTORISTA GIRA DE VERDADE (`carro.abrirPorta`, docs/BEBITO-MOBILE-DENTRO.md):
 * o pedaço da pele da porta (a lataria, a janela, o forro e a maçaneta) é um grupo à
 * parte com o pivô na dobradiça da frente. O teste confere que fechada ela é a mesma
 * pele de antes (as malhas e a caixa), que aberta a beira de trás vai PARA FORA, que
 * fecha de volta, que o teto fora leva a janela dela junto, e fotografa fechada e aberta.
 */
if (roda('porta')) {
  console.log('— a porta do motorista (gira de verdade)');
  const medir = () => page.evaluate(() => {
    const carro = window.bebitoMobile;
    const g = carro.group;
    const pivo = g.getObjectByName('porta-do-motorista');
    g.updateWorldMatrix(true, true);
    const V = g.position.constructor;
    const B = (o) => {
      const mins = [1e9, 1e9, 1e9];
      const maxs = [-1e9, -1e9, -1e9];
      const v = new V();
      o.updateWorldMatrix(true, true);
      o.traverse((m) => {
        if (!m.isMesh || !m.visible) return;
        const p = m.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld);
          for (let k = 0; k < 3; k++) { mins[k] = Math.min(mins[k], v.getComponent(k)); maxs[k] = Math.max(maxs[k], v.getComponent(k)); }
        }
      });
      return { min: mins, max: maxs };
    };
    // no referencial do carro (a posição dele no mundo sai da conta): o x do carro é o do mundo, porque ele não gira
    const c = g.position;
    const cx = c.x;
    const caixa = B(pivo);
    const cima = pivo.getObjectByName('porta-cima');
    return {
      existe: !!pivo,
      rot: pivo.rotation.y,
      aberta: carro.portaAberta,
      malhas: (() => { let n = 0; pivo.traverse((o) => { if (o.isMesh) n++; }); return n; })(),
      xMax: caixa.max[0] - cx,
      xMin: caixa.min[0] - cx,
      cimaVisivel: cima ? cima.visible : null,
      larguraDoCarro: window.aristoryBebitoMobile.BEBITO_MOBILE.largura,
    };
  });
  const fechada = await medir();
  confere(fechada.existe && fechada.malhas >= 4, `a porta existe e tem malhas (${fechada.malhas})`);
  confere(fechada.rot === 0 && fechada.aberta === 0, 'nasce fechada');
  confere(fechada.xMax <= fechada.larguraDoCarro / 2 + 0.03, `fechada, a porta cabe dentro da largura do carro (x máx ${fechada.xMax.toFixed(3)} · metade ${(fechada.larguraDoCarro / 2).toFixed(3)})`);
  await isometrica(5);
  await page.screenshot({ path: `${OUT}-porta-fechada-iso.png` });
  await cena([3.2, 1.35, 1.3], [0.9, 0.85, 0.45]);
  await page.screenshot({ path: `${OUT}-porta-fechada-lado.png` });
  await page.evaluate(() => window.bebitoMobile.abrirPorta(true));
  await page.waitForFunction(() => window.bebitoMobile.portaAberta > 0.99, null, { timeout: 60000 });
  const aberta = await medir();
  confere(aberta.rot < -0.9, `aberta, ela gira para fora (rotation.y ${aberta.rot.toFixed(2)})`);
  confere(aberta.xMax > fechada.xMax + 0.45, `a beira de trás da porta vai PARA FORA do carro (x máx ${fechada.xMax.toFixed(2)} → ${aberta.xMax.toFixed(2)})`);
  await cena([3.2, 1.35, 1.3], [0.9, 0.85, 0.45]);
  await page.screenshot({ path: `${OUT}-porta-aberta-lado.png` });
  await cena([2.6, 1.6, -0.9], [0.3, 0.7, 0.35]);
  await page.screenshot({ path: `${OUT}-porta-aberta-de-tras.png` });
  await cena([1.6, 1.5, 3.0], [0.3, 0.8, 0.3]);
  await page.screenshot({ path: `${OUT}-porta-aberta-frente.png` });
  await isometrica(5);
  await page.screenshot({ path: `${OUT}-porta-aberta-iso.png` });
  // o teto fora leva a janela da porta junto
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(false));
  const semTeto = await medir();
  confere(semTeto.cimaVisivel === false, 'sem teto, a janela da porta some junto');
  await cena([3.0, 2.2, 0.8], [0.3, 0.7, 0.35]);
  await page.screenshot({ path: `${OUT}-porta-aberta-sem-teto.png` });
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(true));
  await page.evaluate(() => window.bebitoMobile.abrirPorta(false));
  await page.waitForFunction(() => window.bebitoMobile.portaAberta < 0.01, null, { timeout: 60000 });
  const fechou = await medir();
  confere(fechou.rot === 0 && Math.abs(fechou.xMax - fechada.xMax) < 1e-3, 'fecha de volta no mesmo lugar');
  await page.evaluate(() => window.bebitoMobile.abrirPorta(true, true));
  const peso = await page.evaluate(() => ({ ...window.jogo.renderer.info.render }));
  console.log(`   peso com a porta aberta: ${peso.calls} desenhos, ${peso.triangles} triângulos`);
  await page.evaluate(() => window.bebitoMobile.abrirPorta(false, true));
}

// =================================================================== os lugares
/*
 * A CABINE CABE A DUPLA? O pedido foi um carro fofo MAS espaçoso por dentro. As
 * poses de dirigir e de passageiro são da etapa das viagens; aqui os dois só
 * sentam nos lugares da frente, do jeito do banco de praça, para a foto e a
 * medida dizerem se a cabeça (que no corpo chibi é enorme) cabe sob o teto e
 * entre as portas.
 */
if (roda('lugares')) {
  console.log('— os lugares (a dupla sentada na frente)');
  await page.evaluate(() => {
    const j = window.jogo;
    const c = window.bebitoMobile;
    const V = j.scene.position.constructor;
    j.lockPlayer(true);
    // (o quadril do rig fica ~0,47 acima da origem dele: a mesma conta do banco de praça)
    j.ridePlayer(c.assentos.motorista, new V(0, -0.47, 0), 1, 0);
    j.rideCompanion(c.assentos.passageiro, new V(0, -0.47, 0), 1, 0);
    j.setSitting(true);
  });
  await page.waitForTimeout(1200);
  const folga = await page.evaluate(() => {
    const c = window.bebitoMobile;
    const k = window.aristoryBebitoMobile.BEBITO_MOBILE;
    const V = window.jogo.scene.position.constructor;
    const medir = (ancora) => {
      // a caixa de quem está sentado ali, no referencial do carro
      const inv = c.group.matrixWorld.clone().invert();
      const b = { minX: 1e9, maxX: -1e9, maxY: -1e9, minZ: 1e9, maxZ: -1e9 };
      const v = new V();
      ancora.updateWorldMatrix(true, true);
      ancora.traverse((o) => {
        if (!o.isMesh || !o.geometry?.attributes?.position) return;
        // (só o que se vê, e só o que é corpo: a sombra de bolinha no chão e o que está escondido não contam)
        for (let p = o; p && p !== ancora; p = p.parent) if (!p.visible) return;
        if (o.material?.transparent) return;
        const pos = o.geometry.attributes.position;
        const m = inv.clone().multiply(o.matrixWorld);
        for (let i = 0; i < pos.count; i += 2) {
          v.fromBufferAttribute(pos, i).applyMatrix4(m);
          b.minX = Math.min(b.minX, v.x); b.maxX = Math.max(b.maxX, v.x);
          b.maxY = Math.max(b.maxY, v.y);
          b.minZ = Math.min(b.minZ, v.z); b.maxZ = Math.max(b.maxZ, v.z);
        }
      });
      return b;
    };
    return { motorista: medir(c.assentos.motorista), passageiro: medir(c.assentos.passageiro), k };
  });
  const { motorista: mo, passageiro: pa, k } = folga;
  console.log(`   motorista: x ${mo.minX.toFixed(2)}…${mo.maxX.toFixed(2)} · topo ${mo.maxY.toFixed(2)} · z ${mo.minZ.toFixed(2)}…${mo.maxZ.toFixed(2)}`);
  console.log(`   passageiro: x ${pa.minX.toFixed(2)}…${pa.maxX.toFixed(2)} · topo ${pa.maxY.toFixed(2)} · z ${pa.minZ.toFixed(2)}…${pa.maxZ.toFixed(2)}`);
  confere(Math.max(mo.maxY, pa.maxY) < k.altura - 0.06, `a cabeça dos dois cabe sob o teto (${Math.max(mo.maxY, pa.maxY).toFixed(2)} de ${k.altura.toFixed(2)})`);
  confere(mo.maxX < k.largura / 2 - 0.08 && pa.minX > -k.largura / 2 + 0.08, 'ninguém atravessa a porta');
  confere(mo.minX > pa.maxX - 0.12, `os dois não se atravessam no meio (sobra ${(mo.minX - pa.maxX).toFixed(2)})`);
  for (const [nome, de, para] of [
    ['sentados-frente', [0.6, 1.9, 4.8], [0, 1.3, 0.8]],
    ['sentados-34', [4.4, 2.5, 5.4], [0, 0.95, 0.1]],
    ['sentados-lado', [6.6, 1.6, 0.5], [0, 1.15, 0.4]],
  ]) {
    await cena(de, para);
    await foto(nome);
  }
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(false));
  await cena([2.6, 4.6, 3.0], [0, 0.7, -0.1]);
  await foto('sentados-sem-teto');
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(true));
  await isometrica(7.5);
  await foto('sentados-iso');

  // NO BANCO DE TRÁS (o que vai em cima dele é guardado): a dupla em dois dos três lugares
  await page.evaluate(() => {
    const j = window.jogo;
    const c = window.bebitoMobile;
    const V = j.scene.position.constructor;
    c.mostrarCargaDoBanco(false);
    j.ridePlayer(c.assentos.tras[0], new V(0, -0.47, 0), 1, 0);
    j.rideCompanion(c.assentos.tras[2], new V(0, -0.47, 0), 1, 0);
    j.setSitting(true);
  });
  await page.waitForTimeout(1000);
  await cena([6.4, 1.7, -0.6], [0, 1.15, -0.5]);
  await foto('atras-lado');
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(false));
  await cena([2.8, 4.8, 2.6], [0, 0.7, -0.3]);
  await foto('atras-sem-teto');

  // A CAMA: os encostos da frente deitados, e os dois deitados lado a lado, com os pés para a frente
  await page.evaluate(() => {
    const j = window.jogo;
    const c = window.bebitoMobile;
    const V = j.scene.position.constructor;
    j.setSitting(false);
    c.deitarEncostos(1, 'os-dois', true);
    j.ridePlayer(c.cama, new V(-0.4, 0, 0), 1, 0);
    j.rideCompanion(c.cama, new V(0.4, 0, 0), 1, 0);
    j.setLying(true);
  });
  await page.waitForTimeout(1200);
  const naCama = await page.evaluate(() => {
    const c = window.bebitoMobile;
    const k = window.aristoryBebitoMobile.BEBITO_MOBILE;
    const V = window.jogo.scene.position.constructor;
    const inv = c.group.matrixWorld.clone().invert();
    const b = { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9, minZ: 1e9, maxZ: -1e9 };
    const v = new V();
    c.cama.updateWorldMatrix(true, true);
    c.cama.traverse((o) => {
      if (!o.isMesh || !o.geometry?.attributes?.position || o.material?.transparent) return;
      for (let p = o; p && p !== c.cama; p = p.parent) if (!p.visible) return;
      const pos = o.geometry.attributes.position;
      const m = inv.clone().multiply(o.matrixWorld);
      for (let i = 0; i < pos.count; i += 2) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m);
        b.minX = Math.min(b.minX, v.x); b.maxX = Math.max(b.maxX, v.x);
        b.minY = Math.min(b.minY, v.y); b.maxY = Math.max(b.maxY, v.y);
        b.minZ = Math.min(b.minZ, v.z); b.maxZ = Math.max(b.maxZ, v.z);
      }
    });
    return { b, k };
  });
  {
    const { b, k } = naCama;
    console.log(`   deitados: x ${b.minX.toFixed(2)}…${b.maxX.toFixed(2)} · y ${b.minY.toFixed(2)}…${b.maxY.toFixed(2)} · z ${b.minZ.toFixed(2)}…${b.maxZ.toFixed(2)}`);
    // (a âncora fica meio corpo acima do colchão, como na cama do quarto: só a nuca e os cachos afundam, como num travesseiro)
    confere(b.minY > k.cama.altura - 0.3, `deitados, só a nuca afunda no colchão (${b.minY.toFixed(2)} × ${k.cama.altura.toFixed(2)})`);
    confere(b.maxX < k.largura / 2 - 0.06 && b.minX > -k.largura / 2 + 0.06, 'deitados, os dois cabem entre as portas');
    confere(b.maxY < k.altura - 0.3, `deitados, sobra teto (${b.maxY.toFixed(2)} de ${k.altura.toFixed(2)})`);
  }
  await cena([2.8, 4.8, 2.6], [0, 0.7, -0.3]);
  await foto('cama-sem-teto');
  await cena([0.01, 6.4, 0.0], [0, 0.6, -0.1]);
  await foto('cama-de-cima');
  await page.evaluate(() => window.bebitoMobile.mostrarTeto(true));
  await cena([6.4, 1.9, 0.2], [0, 1.1, -0.1]);
  await foto('cama-lado');
  await page.evaluate(() => {
    const j = window.jogo;
    const c = window.bebitoMobile;
    j.setLying(false);
    c.deitarEncostos(0, 'os-dois', true);
    c.mostrarCargaDoBanco(true);
  });
}

console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console');
console.log(falhas.length ? `${falhas.length} FALHA(S)` : 'tudo certo');
await browser.close();
process.exit(erros.length || falhas.length ? 1 : 0);
