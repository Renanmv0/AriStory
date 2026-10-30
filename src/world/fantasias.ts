import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { novaTextura, sorteio } from './texturasDeChao';
import { fundir } from './fundir';
import { raioDoTronco } from './uniformeDosGatitos';
import { camadaDeSola, formaDaSola, pe } from './roupasDePiscina';
import { tiara } from './roupas';
import { cetim, corpete, naPele, torneada, veludo, vivoNaPele } from './roupasDaBoutique';

/**
 * ========================================= AS FANTASIAS DA ESTELLA
 *
 * O presente da etapa 3 do Halloween (`docs/HALLOWEEN.md`, §2.3.1 e §5.1): a
 * Estella costurou uma fantasia para cada um, e a dupla sai do provador
 * vestida — o Ari de VAMPIRO e o Renan de MORCEGUINHO. Depois do evento elas
 * ficam no guarda-roupa para sempre, e qualquer um veste qualquer uma.
 *
 * Pedido do Renan: "bem detalhadas e bem feitas", e SEM topete — cada um
 * continua com o próprio cabelo. Cada fantasia ocupa as seis vagas do corpo:
 *
 * | vaga      | vampiro                                   | morceguinho                              |
 * |-----------|-------------------------------------------|------------------------------------------|
 * | cabeça    | as presinhas                              | a tiara de orelhas de morcego            |
 * | tronco    | colete de cetim, camisa de babado, gola   | o moletom de feltro, barriguinha e barra recortada |
 * | pernas    | a calça social com a faixa de cetim       | a calça listrada roxa e preta            |
 * | pés       | o sapato de verniz com fivela             | as pantufas de morceguinho               |
 * | mãos      | as luvas brancas                          | as luvinhas com unhinha                  |
 * | acessório | a CAPA (forro vermelho, gola em pé)       | as ASINHAS nas costas                    |
 *
 * O referencial de cada vaga é o da skill `aristory-roupa`: tronco e
 * acessório do corpo com y = 0 no CHÃO; pernas e pés no pivô de cada perna
 * (y = 0 no quadril); mãos e `extraBraco` no pivô de cada braço (y = 0 no
 * ombro); cabeça no centro do crânio. O que vai para o lado multiplica pelo
 * `lado` (o membro esquerdo nasce em x negativo).
 *
 * AS DUAS PEÇAS QUE SE MEXEM são as que dão a graça da fantasia, e as duas
 * leem a pose a cada quadro, como a saia viva da boutique:
 *
 * - a CAPA (`capaViva`) é uma grade de pano que cai dos ombros e se acomoda
 *   em volta do que está DENTRO dela — os braços que balançam (os pivôs em
 *   `MedidasCorpo.bracos`) e as pernas (`pernas`) — e, andando, se abre para
 *   trás com o vento da caminhada. O forro vermelho é a mesma grade vista por
 *   dentro;
 * - as ASINHAS batem devagar parado e depressa andando.
 *
 * Tudo o que é fixo termina em `fundir()`; a capa e as asas ficam de fora
 * (`userData.viva` e o grupo com nome `asas`).
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const escuro = (cor: number, quanto = 0.78): number => new THREE.Color(cor).multiplyScalar(quanto).getHex();

/** as alturas do corpo que todas as peças daqui usam (todas do rig) */
function corpoDe(m: MedidasCorpo) {
  const { h, w } = m;
  const quadril = m.legH;
  return {
    r: h * 0.105 * w,
    ACHATA: 0.82,
    quadril,
    ombro: quadril + m.torsoH * 0.86,
    topo: quadril + m.torsoH,
    meioOmbro: h * 0.1 * w,
    raioManga: h * 0.038 * w,
    yMao: -m.armLen * 0.92,
    yPulso: -m.armLen * 0.8,
    raioMao: h * 0.04 * w,
  };
}

/**
 * QUEM VESTE ESTÁ ANDANDO? A peça não vê o jogo, então ela mede: a posição
 * do corpo no mundo, de um quadro para o outro, no referencial dele (frente
 * é `+Z`). Devolve a velocidade para a frente, em m/s, amortecida.
 */
function medidorDePasso(): (obj: THREE.Object3D, dt: number) => number {
  const antes = new THREE.Vector3();
  const agora = new THREE.Vector3();
  const frente = new THREE.Vector3();
  let primeira = true;
  let suave = 0;
  return (obj, dt) => {
    obj.getWorldPosition(agora);
    if (primeira || dt <= 0) {
      antes.copy(agora);
      primeira = false;
      return suave;
    }
    frente.set(0, 0, 1).transformDirection(obj.matrixWorld);
    frente.y = 0;
    const d = agora.clone().sub(antes);
    d.y = 0;
    antes.copy(agora);
    // um teletransporte (trocar de cena, o `debugPlace`) não é passo
    const v = d.length() > 1 ? 0 : d.dot(frente.normalize()) / dt;
    suave += (THREE.MathUtils.clamp(v, -4, 4) - suave) * Math.min(1, dt * 6);
    return suave;
  };
}

// ============================================================ as texturas

/** as listras de meia da calça do morceguinho: horizontais, com a costura do tricô */
function listrasDeMeia(fundo: number, listra: number, lado = 0.06): THREE.CanvasTexture {
  return novaTextura(`fantasia-listras:${fundo}:${listra}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = css(listra);
    ctx.fillRect(0, s * 0.5, s, s * 0.5);
    // o ponto de tricô por cima das duas: colunas de V bem finos
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = s * 0.012;
    for (let x = 0; x < s; x += s / 16) {
      for (let y = -s / 16; y < s; y += s / 8) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + s / 32, y + s / 16);
        ctx.lineTo(x + s / 16, y);
        ctx.stroke();
      }
    }
  });
}

/** o feltro: um granulado fofo de fibras curtas, quase branco (multiplica a cor) */
function feltro(lado = 0.08): THREE.CanvasTexture {
  return novaTextura('fantasia-feltro', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(236,236,236)';
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(913);
    for (let i = 0; i < 900; i++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const a = rnd() * Math.PI;
      const l = s * (0.01 + rnd() * 0.025);
      ctx.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(190,190,190,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      ctx.stroke();
    }
  });
}

// ===================================================== peças pequenas comuns

/** uma forma plana com espessura e quina macia */
function chapa(forma: THREE.Shape, esp: number, bisel = esp * 0.45, curvas = 12): THREE.BufferGeometry {
  return new THREE.ExtrudeGeometry(forma, {
    depth: esp, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel * 0.8, bevelSegments: 2, curveSegments: curvas,
  });
}

/** um medalhão: o disco dourado com o aro, as oito contas em volta e a gema no meio (olha para `+Z`) */
function medalhao(raio: number, ouro: number, gema: number): THREE.Group {
  const g = new THREE.Group();
  const matOuro = toon(ouro);
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio * 0.92, raio * 0.28, 24), matOuro);
  disco.rotation.x = Math.PI / 2;
  g.add(disco);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(raio * 0.98, raio * 0.12, 6, 24), toon(escuro(ouro, 0.82)));
  aro.position.z = raio * 0.12;
  g.add(aro);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const conta = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.11, 6, 5), matOuro);
    conta.position.set(Math.cos(a) * raio * 0.72, Math.sin(a) * raio * 0.72, raio * 0.18);
    g.add(conta);
  }
  const pedra = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.48, 14, 10), toon(gema));
  pedra.scale.z = 0.55;
  pedra.position.z = raio * 0.18;
  g.add(pedra);
  // o brilho da gema: luz pintada, um pontinho claro no alto
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.12, 6, 5), toon(0xffe9ee));
  brilho.position.set(-raio * 0.16, raio * 0.18, raio * 0.42);
  g.add(brilho);
  return g;
}

// =============================================================== O VAMPIRO

/**
 * AS PRESINHAS (cabeça): as duas presas de vampiro saindo do sorriso, um
 * tico separadas, curtinhas e de ponta redonda — fofas, não de filme. Elas
 * pousam na linha da boca (o meio-toro do rig, centro em `(0; -0,38·r)`, raio
 * 0,16·r) e descem rentes ao rosto, um pouco para a frente.
 */
function presinhasDeVampiro(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const marfim = toon(peca?.cor ?? P.vampiroPresa);
  for (const s of [-1, 1] as const) {
    const x = s * r * 0.085;
    // a altura do sorriso nesse x (a metade de baixo do arco da boca)
    const yBoca = -r * 0.38 - Math.sqrt((r * 0.16) ** 2 - x * x);
    const presa = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 0.034, r * 0.1, 12), marfim);
    cone.rotation.x = Math.PI; // a ponta para baixo
    cone.position.y = -r * 0.05;
    presa.add(cone);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(r * 0.012, 8, 6), marfim);
    ponta.position.y = -r * 0.098;
    presa.add(ponta);
    const raiz = new THREE.Mesh(new THREE.SphereGeometry(r * 0.034, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), marfim);
    raiz.scale.y = 0.5;
    presa.add(raiz);
    // na pele do rosto: o crânio é uma esfera achatada 1,04 em y
    const yc = yBoca + r * 0.012;
    const z = Math.sqrt(Math.max(0, 1 - (yc / (1.04 * r)) ** 2 - (x / r) ** 2)) * r;
    presa.position.set(x, yc, z + r * 0.035);
    // rente ao queixo (que vira para baixo) e a pontinha abrindo um fio
    presa.rotation.set(-0.45, 0, s * 0.08);
    g.add(presa);
  }
  return fundir(g);
}

/**
 * O COLETE DE VAMPIRO (tronco), que É a camisa também: a `cor` pinta o
 * tronco do rig de marfim (a camisa), e por cima entram
 *
 * - o COLETE de cetim vinho, um `corpete` com o V fundo na frente, o vivo
 *   dourado na borda, os três botões e a corrente de relógio que sai do
 *   botão do meio para o bolso;
 * - as costas de cetim escuro com a fivela de ajuste;
 * - o JABOT: três babados de renda caindo em cascata no peito;
 * - a GOLA ALTA da camisa, com as duas pontas dobradas, e o broche de rubi.
 */
function coleteDeVampiro(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const camisa = peca?.cor ?? P.vampiroCamisa;
  const vinho = P.vampiroColete;
  const ouro = P.fivelaDourada;
  const alto = c.quadril + m.torsoH * 0.77;
  const yGola = alto + c.r * 0.55;
  const fundoDoV = c.quadril + m.torsoH * 0.36;
  const ABRE = 0.5;
  const decote = (a: number): number => {
    const k = Math.min(1, Math.abs(a) / ABRE);
    // o V desce em curva (a lapela do colete abre mais embaixo)
    return fundoDoV + (yGola - fundoDoV) * Math.pow(k, 0.8);
  };
  const baixo = c.quadril + m.torsoH * 0.06;
  const pano = toon(vinho, { mapa: cetim(0.18), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote, baixo, folga: 1.06, colunas: 80, linhas: 18 }), pano));
  // a ponta do colete na frente: dois bicos descendo um fio abaixo da barra
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(0, 0);
    f.lineTo(s * h * 0.05, 0);
    f.lineTo(s * h * 0.006, -h * 0.022);
    f.closePath();
    const geo = new THREE.ShapeGeometry(f);
    const bico = new THREE.Mesh(geo, pano);
    bico.position.copy(naPele(m, s * 0.04, baixo + h * 0.001, 1.06));
    bico.position.y = baixo + h * 0.0015;
    g.add(bico);
  }
  // as costas: cetim escuro, um fio por fora, com a fivela de ajuste
  const costas = (a: number): number => (Math.abs(a) > 2.25 ? yGola - h * 0.014 : baixo + h * 0.012);
  g.add(new THREE.Mesh(corpete(m, { decote: costas, baixo: baixo + h * 0.012, folga: 1.075, colunas: 80, linhas: 14 }),
    toon(P.vampiroCetim, { mapa: cetim(0.18), doubleSide: true })));
  const yAjuste = c.quadril + m.torsoH * 0.28;
  const fivela = new THREE.Mesh(new THREE.TorusGeometry(h * 0.008, h * 0.0018, 4, 4), toon(ouro));
  fivela.position.copy(naPele(m, Math.PI, yAjuste, 1.105));
  fivela.rotation.z = Math.PI / 4;
  fivela.lookAt(fivela.position.clone().multiplyScalar(2).setY(yAjuste));
  g.add(fivela);
  g.add(new THREE.Mesh(vivoNaPele(m, [[Math.PI - 0.4, yAjuste], [Math.PI, yAjuste], [Math.PI + 0.4, yAjuste]], h * 0.004, 1.09), toon(P.vampiroCetim)));

  // o vivo dourado da borda do V e da barra
  const matOuro = toon(ouro);
  const borda: Array<[number, number]> = [];
  for (let i = 0; i <= 14; i++) {
    const a = -ABRE + (2 * ABRE * i) / 14;
    borda.push([a, decote(a) + h * 0.001]);
  }
  g.add(new THREE.Mesh(vivoNaPele(m, borda, h * 0.0028, 1.075), matOuro));
  const barra: Array<[number, number]> = [];
  for (let i = 0; i <= 24; i++) {
    const a = -2.25 + (4.5 * i) / 24;
    barra.push([a, baixo + h * 0.003]);
  }
  g.add(new THREE.Mesh(vivoNaPele(m, barra, h * 0.0024, 1.075), matOuro));

  // OS TRÊS BOTÕES forrados, descendo do fundo do V
  const yBotoes = [fundoDoV - h * 0.012, fundoDoV - h * 0.032, fundoDoV - h * 0.052];
  for (const y of yBotoes) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0055, 12, 8), matOuro);
    b.position.copy(naPele(m, 0, y, 1.085));
    b.scale.set(1, 1, 0.55);
    g.add(b);
  }
  // os bolsos de vivo, e a CORRENTE do relógio: do botão do meio até o bolso
  // da direita, caindo em barriga, elo por elo
  const yBolso = c.quadril + m.torsoH * 0.22;
  for (const s of [-1, 1] as const) {
    g.add(new THREE.Mesh(vivoNaPele(m, [[s * 0.42, yBolso + h * 0.004], [s * 0.6, yBolso], [s * 0.78, yBolso - h * 0.004]], h * 0.003, 1.08), matOuro));
  }
  {
    const de = naPele(m, 0.04, yBotoes[1], 1.1);
    const ate = naPele(m, 0.55, yBolso + h * 0.004, 1.1);
    const meio = naPele(m, 0.3, Math.min(de.y, ate.y) - h * 0.026, 1.12);
    const curva = new THREE.QuadraticBezierCurve3(de, meio, ate);
    const N = 13;
    const elo = new THREE.TorusGeometry(h * 0.0028, h * 0.0008, 4, 8);
    for (let k = 0; k <= N; k++) {
      const p = curva.getPoint(k / N);
      const t = curva.getTangent(k / N);
      const anel = new THREE.Mesh(elo, matOuro);
      anel.position.copy(p);
      anel.lookAt(p.clone().add(t));
      anel.rotateZ(k % 2 ? Math.PI / 2 : 0);
      g.add(anel);
    }
  }

  // O JABOT: três babados de renda marfim, um embaixo do outro, abrindo em
  // leque para baixo, com a barra ondulada — o que diz "vampiro" de longe
  const renda = toon(camisa, { mapa: cetim(0.1), doubleSide: true });
  const frenteDoPeito = (y: number): number => raioDoTronco(m, y) * c.ACHATA * 1.06;
  for (let k = 0; k < 3; k++) {
    const yTopo = yGola - h * 0.012 - k * h * 0.024;
    const alto2 = h * (0.034 - k * 0.003);
    const larg = h * (0.026 + k * 0.006);
    const geo = new THREE.CylinderGeometry(h * 0.006, larg, alto2, 28, 4, true, -Math.PI / 2, Math.PI);
    // a barra ondulada: o raio de baixo ondula em sete gomos
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = 0.5 - y / alto2; // 0 em cima, 1 embaixo
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(x, z);
      const onda = 1 + 0.18 * t * Math.sin(a * 7);
      pos.setXYZ(i, x * onda, y - t * t * h * 0.003 * Math.cos(a * 7), z * onda);
    }
    geo.computeVertexNormals();
    const babado = new THREE.Mesh(geo, renda);
    babado.scale.z = 0.38;
    babado.position.set(0, yTopo - alto2 / 2, frenteDoPeito(yTopo - alto2 / 2) + h * 0.004);
    g.add(babado);
  }

  // A GOLA ALTA da camisa: o colarinho em pé em volta do pescoço e as duas
  // pontas dobradas para a frente, e o broche de rubi no meio
  const branco = toon(camisa, { doubleSide: true });
  const gola = new THREE.Mesh(new THREE.CylinderGeometry(c.r * 0.6, c.r * 0.66, h * 0.03, 28, 1, true), branco);
  gola.position.set(0, yGola + h * 0.012, -c.r * 0.04);
  gola.scale.z = 0.92;
  g.add(gola);
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(s * h * 0.003, 0);
    f.lineTo(s * h * 0.036, h * 0.004);
    f.lineTo(s * h * 0.016, -h * 0.03);
    f.closePath();
    const ponta = new THREE.Mesh(chapa(f, h * 0.0015, h * 0.0008), branco);
    ponta.position.set(0, yGola + h * 0.004, c.r * 0.6 * 0.92 - c.r * 0.04);
    ponta.rotation.x = -0.35;
    g.add(ponta);
  }
  const broche = medalhao(h * 0.011, ouro, P.vampiroGema);
  broche.position.set(0, yGola - h * 0.004, c.r * 0.62 + h * 0.008);
  broche.rotation.x = -0.25;
  g.add(broche);
  return fundir(g);
}

/**
 * A MANGA DA CAMISA DE VAMPIRO (`extraBraco`): a manga "de poeta", bufante
 * do cotovelo ao punho, franzida no punho de renda que cai por cima da luva.
 */
function mangaDeVampiro(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const camisa = peca?.corDetalhe ?? peca?.cor ?? P.vampiroCamisa;
  const pano = toon(camisa, { mapa: cetim(0.12), doubleSide: true });
  const L = m.armLen;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.026],
    [h * 0.046 * w, h * 0.014],
    [h * 0.05 * w, -h * 0.012],
    [h * 0.047 * w, -L * 0.3],
    [h * 0.056 * w, -L * 0.55],
    [h * 0.058 * w, -L * 0.68],
    [h * 0.04 * w, -L * 0.76],
  ], 10, (t) => (t > 0.45 ? h * 0.004 * (t - 0.45) * 2 : 0), 28), pano));
  // o punho justo e a renda caindo em volta do pulso
  g.add(new THREE.Mesh(torneada([
    [h * 0.041 * w, -L * 0.75],
    [h * 0.042 * w, -L * 0.79],
  ], 0, () => 0, 24), toon(camisa)));
  g.add(new THREE.Mesh(torneada([
    [h * 0.041 * w, -L * 0.785],
    [h * 0.047 * w, -L * 0.8],
    [h * 0.054 * w, -L * 0.825],
  ], 12, (t) => h * 0.005 * t, 36), pano));
  return fundir(g);
}

/**
 * A CALÇA SOCIAL (pernas): a `cor` pinta a perna de preto, e cada perna
 * ganha a FAIXA DE CETIM do lado de fora (a calça de smoking), o vinco na
 * frente e a barra que abre um tico por cima do sapato.
 */
function calcaDeVampiro(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.vampiroCalca;
  const faixa = peca?.corDetalhe ?? P.vampiroCetim;
  const rp = h * 0.042 * w;
  const TOPO = -h * 0.01;
  const FIM = -m.legH * 0.9;
  // a faixa de cetim, do quadril à barra, colada no lado de fora
  const geoFaixa = new THREE.BoxGeometry(h * 0.003, TOPO - FIM, h * 0.011);
  const tira = new THREE.Mesh(geoFaixa, toon(faixa, { mapa: cetim(0.08) }));
  tira.position.set(lado * rp * 1.04, (TOPO + FIM) / 2, 0);
  g.add(tira);
  // o vinco da frente: um fio um tom acima do pano
  const vinco = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0016, (TOPO - FIM) * 0.9, h * 0.0016), toon(new THREE.Color(cor).offsetHSL(0, 0, 0.08).getHex()));
  vinco.position.set(0, (TOPO + FIM) / 2, rp * 1.02);
  g.add(vinco);
  // a barra: abre de leve por cima do peito do pé
  g.add(new THREE.Mesh(torneada([
    [rp * 1.02, FIM + h * 0.03],
    [rp * 1.1, FIM],
    [rp * 1.16, FIM - h * 0.012],
  ], 0, () => 0, 22), toon(cor, { doubleSide: true })));
  return fundir(g);
}

/**
 * O SAPATO DE VERNIZ (pés), que SUBSTITUI o pé do rig como o tênis: a sola
 * fina com o vivo da costura, o cabedal preto e rebaixado para o bico (sapato
 * social é mais baixo que tênis), o BRILHO do verniz pintado em duas faixas
 * claras (luz pintada: o toon não tem reflexo), a tira e a FIVELA dourada.
 */
function sapatoDeVerniz(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const h = m.h;
  const p = pe(m);
  const verniz = peca?.cor ?? P.vampiroVerniz;
  const ouro = peca?.corDetalhe ?? P.fivelaDourada;
  const ENC = 1.02;
  g.add(camadaDeSola(m, p.chao, h * 0.006, 0x3a2a22, ENC * 1.03));
  g.add(camadaDeSola(m, p.chao + h * 0.005, h * 0.0012, 0x8a6a4a, ENC * 1.045));
  // o salto: um tico mais grosso embaixo do calcanhar
  const salto = new THREE.Mesh(new THREE.BoxGeometry(p.meiaLargura * 1.8, h * 0.006, h * 0.03), toon(0x3a2a22));
  salto.position.set(0, p.chao + h * 0.003, p.z - p.meioComprimento * 0.8);
  g.add(salto);

  const y0 = p.chao + h * 0.008;
  const H = h * 0.034;
  const BISEL = h * 0.008;
  const escala = ENC * 0.92;
  const geo = new THREE.ExtrudeGeometry(formaDaSola(m, escala), {
    depth: H, bevelEnabled: true, bevelThickness: BISEL, bevelSize: h * 0.0045, bevelSegments: 4, curveSegments: 14,
  });
  geo.rotateX(-Math.PI / 2);
  const zBico = p.z + (p.meioComprimento + h * 0.012) * escala;
  const alturaEm = (z: number): number => 1 - 0.6 * THREE.MathUtils.smoothstep(z, p.z - h * 0.01, zBico);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > 0) pos.setY(i, y * alturaEm(pos.getZ(i)));
  }
  geo.computeVertexNormals();
  geo.translate(0, y0, 0);
  g.add(new THREE.Mesh(geo, toon(verniz)));
  const topoEm = (z: number): number => y0 + (H + BISEL) * alturaEm(z);

  // o BRILHO do verniz: duas faixas claras compridas no bico, uma de cada lado
  const brilho = toon(P.vampiroBrilho);
  for (const s of [-1, 1] as const) {
    const z = p.z + h * 0.022;
    const faixa = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.0024, h * 0.03, 3, 6), brilho);
    faixa.rotation.x = Math.PI / 2 - 0.12;
    faixa.position.set(s * p.meiaLargura * 0.82, topoEm(z) - h * 0.004, z + h * 0.006);
    g.add(faixa);
  }
  // a TIRA por cima do peito do pé e a FIVELA quadrada com o pino
  // a fivela no PEITO DO PÉ, na frente da barra da calça (que cobre o tornozelo)
  const zFivela = p.z + h * 0.016;
  const yFivela = topoEm(zFivela) + h * 0.0012;
  const tira = new THREE.Mesh(new THREE.BoxGeometry(p.meiaLargura * 2.3, h * 0.003, h * 0.016), toon(escuro(verniz, 1.6)));
  tira.position.set(0, yFivela - h * 0.0008, zFivela);
  tira.rotation.x = -0.32;
  g.add(tira);
  const matOuro = toon(ouro);
  const quadro = new THREE.Group();
  quadro.position.set(0, yFivela + h * 0.0008, zFivela);
  quadro.rotation.x = -0.32;
  const L = h * 0.022;
  const E = h * 0.0034;
  for (const [x, z, lx, lz] of [[0, L / 2, L + E, E], [0, -L / 2, L + E, E], [L / 2, 0, E, L], [-L / 2, 0, E, L]] as const) {
    const lado = new THREE.Mesh(new THREE.BoxGeometry(lx, E, lz), matOuro);
    lado.position.set(x, 0, z);
    quadro.add(lado);
  }
  const pino = new THREE.Mesh(new THREE.BoxGeometry(E * 0.6, E * 0.8, L), matOuro);
  quadro.add(pino);
  g.add(quadro);
  return fundir(g);
}

/**
 * AS LUVAS BRANCAS (mãos): de punho largo que abre como cálice no antebraço,
 * a mão estufada, o polegar e as três costuras no dorso — luva de mágico, de
 * conde, de desenho animado.
 */
function luvasDeVampiro(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.vampiroLuva;
  const mat = toon(cor, { mapa: cetim(0.06) });
  const matDuplo = toon(cor, { mapa: cetim(0.06), doubleSide: true });
  // o cálice do punho: abre do pulso para cima
  g.add(new THREE.Mesh(torneada([
    [h * 0.035 * w, c.yPulso - h * 0.012],
    [h * 0.038 * w, c.yPulso + h * 0.01],
    [h * 0.048 * w, c.yPulso + h * 0.038],
    [h * 0.053 * w, c.yPulso + h * 0.046],
  ], 0, () => 0, 26), matDuplo));
  // a dobra do cálice: um anel por cima da boca
  const dobra = new THREE.Mesh(new THREE.TorusGeometry(h * 0.052 * w, h * 0.0035, 6, 26), mat);
  dobra.rotation.x = Math.PI / 2;
  dobra.position.y = c.yPulso + h * 0.046;
  g.add(dobra);
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.1, 18, 12), mat);
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.08, 0.96);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.013 * w, h * 0.016, 4, 8), mat);
  polegar.position.set(-lado * h * 0.022 * w, c.yMao + h * 0.004, h * 0.026 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  // as três costuras no dorso (o lado de fora: `lado` em x)
  const costura = toon(escuro(cor, 0.72));
  for (let k = -1; k <= 1; k++) {
    const fio = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.0014, h * 0.018, 2, 4), costura);
    const a = k * 0.32;
    const R = c.raioMao * 1.1 * 1.01;
    fio.position.set(lado * Math.cos(a) * R * 0.98, c.yMao + h * 0.004, Math.sin(a) * R * 0.96);
    fio.rotation.z = lado * 0.08;
    g.add(fio);
  }
  return fundir(g);
}

// ---------------------------------------------------------------- a capa

interface OpcoesDeCapa {
  yTopo: number;
  yBarra: number;
  /** quanto da volta, a partir das COSTAS, o pano cobre (meia largura, em rad) em `t` */
  cobre: (t: number) => number;
  /** o raio do pano no ângulo `a` (0 = frente) e em `t` (0 = gola, 1 = barra) */
  raio: (a: number, t: number) => number;
  /** as alturas das linhas (de 0 a 1) — mais juntas em cima, onde o pano dobra no ombro */
  linhas: number[];
  colunas?: number;
  /** de que linha para baixo o pano de fora troca para o segundo material (a barra) */
  barra?: number;
}

/**
 * ===================================== A CAPA VIVA — o pano que cai dos ombros
 *
 * A mesma ideia da saia viva da boutique (`saiaViva`), só que pendurada no
 * PESCOÇO e aberta na frente: uma grade de pano que, a cada quadro, cerca o
 * que está DENTRO dela — os braços (o balanço da caminhada joga a mão para
 * trás) e as pernas — como cortina: numa altura, o pano cerca tudo o que
 * está acima dela. Cada vértice só sai pelo seu raio (a função de apoio de um
 * disco, `c·u + ρ`), com o máximo suave, e volta devagar (o pano assenta).
 *
 * A diferença é o VENTO: andando para a frente, a barra de trás se abre e
 * ondula — o vampiro de desenho, de capa voando. A velocidade é medida pelo
 * próprio pano (`medidorDePasso`).
 *
 * O FORRO é a mesma grade vista por dentro: duas malhas na mesma geometria,
 * uma com a face de fora (a lã quase preta) e outra com a de dentro (o cetim
 * vermelho). Elas nunca brigam pelo pixel: uma desenha só a frente dos
 * triângulos, a outra só o verso.
 */
function capaViva(m: MedidasCorpo, o: OpcoesDeCapa, fora: THREE.Material | THREE.Material[], dentro: THREE.Material): THREE.Group {
  const { h, w } = m;
  const NC = o.colunas ?? 56;
  const ts = o.linhas;
  const NL = ts.length;
  const ACH = 0.86;
  const n = (NC + 1) * NL;
  const pos = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  const ux = new Float32Array(n);
  const uz = new Float32Array(n);
  const repouso = new Float32Array(n);
  const atual = new Float32Array(n);
  const vento = new Float32Array(n);
  const peso = new Float32Array(n);
  const ys = new Float32Array(NL);
  for (let j = 0; j < NL; j++) ys[j] = THREE.MathUtils.lerp(o.yTopo, o.yBarra, ts[j]);
  let maior = 0;
  for (let i = 0; i <= NC; i++) {
    const s = i / NC; // 0 e 1 são as duas bordas da frente
    for (let j = 0; j < NL; j++) {
      const t = ts[j];
      const A = o.cobre(t);
      const a = Math.PI + (s * 2 - 1) * A;
      const k = i * NL + j;
      const R = o.raio(a, t);
      const x = Math.sin(a) * R;
      const z = Math.cos(a) * R * ACH;
      const d = Math.hypot(x, z);
      ux[k] = x / d;
      uz[k] = z / d;
      repouso[k] = d;
      atual[k] = d;
      // o vento pega a barra, e mais as costas que as bordas
      peso[k] = Math.pow(t, 1.6) * (0.35 + 0.65 * Math.max(0, -Math.cos(a)));
      maior = Math.max(maior, R);
      pos[k * 3] = x;
      pos[k * 3 + 1] = ys[j];
      pos[k * 3 + 2] = z;
      uv[k * 2] = s * 2 * A * 0.2;
      uv[k * 2 + 1] = ys[j];
    }
  }
  const geo = new THREE.BufferGeometry();
  const atributo = new THREE.BufferAttribute(pos, 3);
  atributo.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', atributo);
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const idx: number[] = [];
  // linha por linha, para a BARRA ser um grupo só no fim do índice
  const jBarra = o.barra ?? NL;
  let inicioDaBarra = -1;
  for (let j = 0; j < NL - 1; j++) {
    if (j === jBarra && inicioDaBarra < 0) inicioDaBarra = idx.length;
    for (let i = 0; i < NC; i++) {
      const a = i * NL + j;
      const b = (i + 1) * NL + j;
      // a face de FORA olha para fora: a ordem dos cantos da saia viva
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  geo.setIndex(idx);
  if (inicioDaBarra >= 0) {
    geo.addGroup(0, inicioDaBarra, 0);
    geo.addGroup(inicioDaBarra, idx.length - inicioDaBarra, 1);
  }
  geo.computeVertexNormals();
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, (o.yTopo + o.yBarra) / 2, 0), maior + h * 0.4);

  const capa = new THREE.Group();
  capa.name = 'capa';
  const de = new THREE.Mesh(geo, fora);
  const forro = new THREE.Mesh(geo, dentro);
  de.userData.viva = true;
  forro.userData.viva = true;
  de.castShadow = true;
  capa.add(de, forro);

  // ----------------------------------------- o que está dentro do pano
  const obstaculos: Array<{ pivo: THREE.Object3D; pontos: Array<[number, number, number, number]> }> = [];
  const rBraco = h * 0.058 * w;
  for (const pivo of m.bracos ?? []) {
    obstaculos.push({
      pivo,
      pontos: [
        [0, -m.armLen * 0.05, 0, rBraco],
        [0, -m.armLen * 0.35, 0, rBraco],
        [0, -m.armLen * 0.66, 0, rBraco],
        [0, -m.armLen * 0.92, 0, h * 0.05 * w],
      ],
    });
  }
  const rPerna = h * 0.042 * w * 1.2 + h * 0.008;
  for (const pivo of m.pernas ?? []) {
    obstaculos.push({
      pivo,
      pontos: [
        [0, -h * 0.02, 0, rPerna],
        [0, -h * 0.12, 0, rPerna],
        [0, -h * 0.225, 0, rPerna],
        [0, -h * 0.252, -h * 0.02, h * 0.032],
      ],
    });
  }
  const NP = obstaculos.reduce((s, ob) => s + ob.pontos.length, 0);
  const px = new Float32Array(NP);
  const py = new Float32Array(NP);
  const pz = new Float32Array(NP);
  const pr = new Float32Array(NP);
  const dx = new Float32Array(NP * 2);
  const dz = new Float32Array(NP * 2);
  const dr = new Float32Array(NP * 2);
  const v = new THREE.Vector3();
  const passo = medidorDePasso();
  let relogio = 0;
  /**
   * SENTADO, o pano não cai até o chão: ele assenta no banco. Com as coxas na
   * horizontal, as linhas abaixo do quadril sobem e se juntam logo abaixo
   * dele — a capa dobrada no assento, atrás de quem senta, em vez de
   * atravessar o banco até o chão.
   */
  const yAssento = m.legH - h * 0.03;
  const ysDePe = Float32Array.from(ys);
  let sentado = 0;
  const coxa = new THREE.Vector3();

  const acomodar = (dt: number, velocidade: number): void => {
    const pernas = m.pernas;
    if (pernas) {
      let deitada = 0;
      for (const pv of pernas) {
        coxa.set(0, -1, 0).applyQuaternion(pv.quaternion);
        deitada += THREE.MathUtils.smoothstep(coxa.y, -0.8, -0.35) / pernas.length;
      }
      sentado += (deitada - sentado) * Math.min(1, dt * 8);
      for (let j = 0; j < NL; j++) {
        const dePe = ysDePe[j];
        const assentado = dePe >= yAssento ? dePe : yAssento - (yAssento - dePe) * 0.12;
        ys[j] = THREE.MathUtils.lerp(dePe, assentado, sentado);
        for (let i = 0; i <= NC; i++) pos[(i * NL + j) * 3 + 1] = ys[j];
      }
    }
    let q = 0;
    const comeco: number[] = [];
    for (const ob of obstaculos) {
      comeco.push(q);
      for (const [x, y, z, r] of ob.pontos) {
        v.set(x, y, z).applyQuaternion(ob.pivo.quaternion).add(ob.pivo.position);
        px[q] = v.x;
        py[q] = v.y;
        pz[q] = v.z;
        pr[q] = r;
        q++;
      }
    }
    const solta = 1 - Math.exp(-dt * 6);
    const sopro = Math.max(0, velocidade);
    for (let j = 1; j < NL; j++) {
      const y = ys[j];
      // cortina: os pontos ACIMA desta altura, e os trechos que a atravessam
      let nd = 0;
      for (let b = 0; b < obstaculos.length; b++) {
        const ini = comeco[b];
        const cnt = obstaculos[b].pontos.length;
        for (let s = 0; s < cnt; s++) {
          const k = ini + s;
          if (py[k] + pr[k] >= y) {
            dx[nd] = px[k];
            dz[nd] = pz[k];
            dr[nd] = pr[k];
            nd++;
          }
          if (s + 1 < cnt) {
            const k2 = k + 1;
            if ((py[k] - y) * (py[k2] - y) < 0) {
              const f = (y - py[k]) / (py[k2] - py[k]);
              dx[nd] = px[k] + (px[k2] - px[k]) * f;
              dz[nd] = pz[k] + (pz[k2] - pz[k]) * f;
              dr[nd] = pr[k] + (pr[k2] - pr[k]) * f;
              nd++;
            }
          }
        }
      }
      for (let i = 0; i <= NC; i++) {
        const k = i * NL + j;
        // o vento: a barra abre para trás, ondulando em volta da capa
        const ondula = 0.75 + 0.25 * Math.sin(relogio * 7 + i * 0.45 + j * 0.3);
        const alvoVento = sopro * peso[k] * h * 0.09 * ondula;
        vento[k] += (alvoVento - vento[k]) * Math.min(1, dt * 4);
        const tb = repouso[k] + vento[k];
        let alvo = tb;
        if (nd) {
          let req = 0;
          for (let d = 0; d < nd; d++) {
            const apoio = dx[d] * ux[k] + dz[d] * uz[k] + dr[d];
            if (apoio > req) req = apoio;
          }
          const dif = tb - req;
          const suave = h * 0.012;
          alvo = (tb + req + Math.sqrt(dif * dif + suave * suave)) / 2;
          if (alvo - tb < 1e-4) alvo = tb;
        }
        const antes = atual[k];
        const novo = alvo > antes ? alvo : antes + (alvo - antes) * solta;
        atual[k] = novo;
        pos[k * 3] = ux[k] * novo;
        pos[k * 3 + 2] = uz[k] * novo;
      }
    }
    atributo.needsUpdate = true;
    geo.computeVertexNormals();
  };

  let ultimoQuadro = -1;
  let ultimoRender: unknown = null;
  let ultimaVez = 0;
  const antesDeDesenhar = (renderer: THREE.WebGLRenderer): void => {
    const quadro = renderer.info.render.frame;
    if (renderer === ultimoRender && quadro === ultimoQuadro) return;
    ultimoRender = renderer;
    ultimoQuadro = quadro;
    const agora = performance.now();
    const dt = ultimaVez ? Math.min(0.1, (agora - ultimaVez) / 1000) : 0;
    ultimaVez = agora;
    relogio += dt;
    acomodar(Math.max(dt, 1 / 60), passo(capa, dt));
  };
  de.onBeforeRender = antesDeDesenhar;
  forro.onBeforeRender = antesDeDesenhar;
  acomodar(1, 0);
  return capa;
}

/**
 * A CAPA DE VAMPIRO (acessório, preso no corpo e nas costas): a lã quase
 * preta por fora e o cetim vermelho por dentro, caindo dos ombros até o meio
 * da canela (`capaViva`); a GOLA EM PÉ, alta atrás da cabeça e recortada em
 * três bicos, preta por fora e vermelha por dentro, com o vivo dourado; e o
 * FECHO no pescoço: dois medalhões de rubi presos por uma correntinha.
 */
function capaDeVampiro(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const preto = peca?.cor ?? P.vampiroCapa;
  const vermelho = peca?.corDetalhe ?? P.vampiroForro;
  const yTopo = c.topo - m.torsoH * 0.04;
  const yBarra = m.legH * 0.3;
  const tOmbro = (yTopo - c.ombro) / (yTopo - yBarra);
  const debaixo = m.porBaixo;
  const ACH = 0.86;
  /** o que já está no corpo por baixo (o colete), como cortina: a capa nunca entra */
  const precisa = (a: number, t: number): number => {
    if (!debaixo) return 0;
    const sen = Math.sin(a);
    const cos = ACH * Math.cos(a);
    const direcao = Math.atan2(sen, cos);
    const escala = 1.06 / Math.hypot(sen, cos);
    let r = 0;
    for (let k = 0; k <= 10; k++) {
      const s = (k / 10) * t;
      r = Math.max(r, debaixo(direcao, THREE.MathUtils.lerp(yTopo, yBarra, s)) * escala);
    }
    return r;
  };
  const rPescoco = Math.max(raioDoTronco(m, yTopo) * 1.25, c.r * 0.72);
  const ombroEm = (a: number): number => {
    const s2 = Math.sin(a) ** 2;
    return c.r * (1.14 + 0.5 * s2);
  };
  const raio = (a: number, t: number): number => {
    let R: number;
    if (t <= tOmbro) {
      // do pescoço ao ombro o pano desce pela curva do ombro (sai rápido, assenta)
      const u = t / tOmbro;
      R = THREE.MathUtils.lerp(rPescoco, ombroEm(a), 1 - (1 - u) * (1 - u));
    } else {
      const u = (t - tOmbro) / (1 - tOmbro);
      // abre em sino até a barra, com seis dobras fundas atrás
      const dobra = h * 0.024 * Math.min(1, u * 1.4) * (0.5 - 0.5 * Math.cos((a - Math.PI) * 7));
      R = ombroEm(a) * (1 + 0.55 * Math.pow(u, 1.1)) - dobra;
    }
    return Math.max(R, precisa(a, t));
  };
  const linhas = [0, 0.015, 0.032, 0.05, 0.07, 0.095];
  for (let k = 1; k <= 16; k++) linhas.push(0.095 + (0.875 * k) / 16);
  // a última faixa é a BARRA: o forro vermelho dobrado para fora, um dedo de largura
  linhas.push(1);
  const barra = linhas.length - 2;
  const cobre = (t: number): number => {
    // em cima ela abraça o pescoço (os dois cantos quase se encontram no
    // fecho); logo abaixo do ombro abre, e as bordas descem pelos lados
    const fechada = Math.PI - 0.2;
    const aberta = Math.PI - 1.0;
    const u = THREE.MathUtils.smoothstep(t, 0, 0.13);
    return THREE.MathUtils.lerp(fechada, aberta, u) - 0.12 * Math.max(0, t - 0.13);
  };
  const fora = toon(preto, { mapa: veludo(0.12) });
  const forro = forroDe(toon(vermelho, { mapa: cetim(0.16) }));
  const vivoDaBarra = toon(vermelho, { mapa: cetim(0.16) });
  g.add(capaViva(m, { yTopo, yBarra, raio, cobre, linhas, colunas: 60, barra }, [fora, vivoDaBarra], forro));

  // ------------------------------------------------ a gola em pé
  const fixo = new THREE.Group();
  const ABRE = 1.9; // meia largura da gola, a partir das costas
  const NCg = 40;
  const NLg = 6;
  const yG0 = yTopo - h * 0.004;
  const ALTA = h * 0.115;
  const posG: number[] = [];
  const idxG: number[] = [];
  const topoDaGola = (s: number): number => {
    // três bicos: o do meio, nas costas, é o mais alto; os das pontas, menores
    const bicos = Math.abs(Math.cos(s * Math.PI * 1.5));
    const queda = 1 - 0.35 * Math.abs(s * 2 - 1) ** 1.5;
    return ALTA * queda * (0.82 + 0.18 * bicos);
  };
  for (let i = 0; i <= NCg; i++) {
    const s = i / NCg;
    const a = Math.PI + (s * 2 - 1) * ABRE;
    const topo = topoDaGola(s);
    for (let j = 0; j <= NLg; j++) {
      const u = j / NLg;
      const y = yG0 + topo * u;
      // abre como cálice: sai do pescoço e vai para fora, curvando
      const R = rPescoco * 1.04 + h * 0.07 * Math.pow(u, 1.3);
      posG.push(Math.sin(a) * R, y, Math.cos(a) * R * 0.92);
    }
  }
  for (let i = 0; i < NCg; i++) {
    for (let j = 0; j < NLg; j++) {
      const a = i * (NLg + 1) + j;
      const b = (i + 1) * (NLg + 1) + j;
      idxG.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geoG = new THREE.BufferGeometry();
  geoG.setAttribute('position', new THREE.Float32BufferAttribute(posG, 3));
  geoG.setIndex(idxG);
  geoG.computeVertexNormals();
  fixo.add(new THREE.Mesh(geoG, toon(preto)));
  fixo.add(new THREE.Mesh(geoG, forroDe(toon(vermelho))));
  // o vivo dourado na beirada de cima da gola, bico por bico
  const beirada: THREE.Vector3[] = [];
  for (let i = 0; i <= NCg; i++) {
    const s = i / NCg;
    const a = Math.PI + (s * 2 - 1) * ABRE;
    const R = rPescoco * 1.04 + h * 0.07;
    beirada.push(new THREE.Vector3(Math.sin(a) * R, yG0 + topoDaGola(s), Math.cos(a) * R * 0.92));
  }
  fixo.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beirada), 80, h * 0.0022, 5, false), toon(P.fivelaDourada)));

  // ------------------------------------------------ o fecho
  const yFecho = yTopo - h * 0.008;
  const aFecho = 0.42;
  const pontoDoFecho = (s: -1 | 1): THREE.Vector3 => {
    const a = s * aFecho;
    const R = rPescoco * 1.1;
    return new THREE.Vector3(Math.sin(a) * R, yFecho, Math.cos(a) * R * ACH + h * 0.004);
  };
  for (const s of [-1, 1] as const) {
    const md = medalhao(h * 0.012, P.fivelaDourada, P.vampiroGema);
    const p = pontoDoFecho(s);
    md.position.copy(p);
    md.lookAt(p.x * 2, p.y, p.z * 2 + h * 0.2);
    fixo.add(md);
  }
  {
    const a0 = pontoDoFecho(-1);
    const a1 = pontoDoFecho(1);
    const meio = a0.clone().add(a1).multiplyScalar(0.5);
    meio.y -= h * 0.018;
    meio.z += h * 0.012;
    const curva = new THREE.QuadraticBezierCurve3(a0, meio, a1);
    const elo = new THREE.TorusGeometry(h * 0.0026, h * 0.0008, 4, 8);
    const matOuro = toon(P.fivelaDourada);
    for (let k = 1; k < 12; k++) {
      const p = curva.getPoint(k / 12);
      const t = curva.getTangent(k / 12);
      const anel = new THREE.Mesh(elo, matOuro);
      anel.position.copy(p);
      anel.lookAt(p.clone().add(t));
      anel.rotateZ(k % 2 ? Math.PI / 2 : 0);
      fixo.add(anel);
    }
  }
  g.add(fundir(fixo));
  void w;
  return g;
}

/** o mesmo material visto pelo VERSO (o forro): uma cópia guardada, nunca uma por peça */
const forros = new WeakMap<THREE.Material, THREE.Material>();
function forroDe(mat: THREE.Material): THREE.Material {
  let f = forros.get(mat);
  if (!f) {
    f = mat.clone();
    f.side = THREE.BackSide;
    forros.set(mat, f);
  }
  return f;
}

// =========================================================== O MORCEGUINHO

/**
 * A ORELHA DE MORCEGO: pontuda e larga na base, com um entalhe na borda de
 * fora (o "dente" da orelha de morcego de desenho) e a ponta virando de
 * leve. Desenhada no plano XY, a base em y = 0, olhando para `+Z`.
 */
function formaDaOrelha(alta: number, larga: number): THREE.Shape {
  const f = new THREE.Shape();
  // a borda de DENTRO sobe quase reta até a ponta, que vira um tico para fora;
  // a de FORA desce em dois recortes (os "dedos" da orelha de morcego)
  f.moveTo(-larga * 0.42, 0);
  f.quadraticCurveTo(-larga * 0.5, alta * 0.6, larga * 0.05, alta);
  f.quadraticCurveTo(larga * 0.2, alta * 0.8, larga * 0.38, alta * 0.72);
  f.quadraticCurveTo(larga * 0.3, alta * 0.58, larga * 0.52, alta * 0.44);
  f.quadraticCurveTo(larga * 0.42, alta * 0.3, larga * 0.58, alta * 0.16);
  f.quadraticCurveTo(larga * 0.5, alta * 0.04, larga * 0.42, 0);
  f.quadraticCurveTo(0, -alta * 0.04, -larga * 0.42, 0);
  return f;
}

/**
 * A TIARA DE ORELHAS DE MORCEGO (cabeça): a faixa roxa por cima do cabelo
 * (a `tiara`, que pousa no contorno MEDIDO do cabelo de quem veste) e as duas
 * orelhas grandes de feltro, com o miolo rosado e a costurinha em volta.
 */
function tiaraDeMorcego(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const r = m.headR;
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const miolo = peca?.corDetalhe ?? P.morceguinhoOrelha;
  const { g, naFaixa } = tiara(m, cor);
  const fora = toon(cor, { mapa: feltro(0.05) });
  const dentro = toon(miolo, { mapa: feltro(0.05) });
  const ALTA = r * 0.7;
  const LARGA = r * 0.62;
  for (const lado of [-1, 1] as const) {
    const a = lado * 0.62;
    const presa = naFaixa(a);
    const orelha = new THREE.Group();
    // a direita é a esquerda espelhada NA GEOMETRIA (escala negativa viraria a face)
    const geoCasca = chapa(formaDaOrelha(ALTA, LARGA), r * 0.03, r * 0.025);
    geoCasca.translate(0, 0, -r * 0.03);
    const geoMiolo = new THREE.ShapeGeometry(formaDaOrelha(ALTA * 0.7, LARGA * 0.62), 12);
    geoMiolo.translate(-LARGA * 0.04, ALTA * 0.1, r * 0.026);
    orelha.add(new THREE.Mesh(lado === -1 ? espelhada(geoCasca) : geoCasca, fora));
    orelha.add(new THREE.Mesh(lado === -1 ? espelhada(geoMiolo) : geoMiolo, dentro));
    const normal = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
    const em = new THREE.Vector3(0, 1, 0).lerp(normal, 0.72).normalize();
    orelha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), em);
    // a cara larga da orelha vira um tico para a frente e para fora
    orelha.rotateY(lado * -0.25);
    orelha.position.copy(presa).addScaledVector(em, -r * 0.04);
    g.add(orelha);
  }
  return g;
}

/**
 * Um ponto no tronco dado como DECALQUE: `x` é o arco em volta do corpo a
 * partir da frente (em metros), e `y` a altura relativa a `y0`.
 */
function noRemendo(m: MedidasCorpo, y0: number, x: number, y: number, folga: number): THREE.Vector3 {
  const c = corpoDe(m);
  const yy = y0 + y;
  const R = Math.max(raioDoTronco(m, yy), c.r * 0.5) * folga;
  const a = x / (Math.max(raioDoTronco(m, y0), c.r * 0.5) * folga);
  return new THREE.Vector3(Math.sin(a) * R, yy, Math.cos(a) * R * c.ACHATA);
}

/**
 * UM REMENDO OVAL colado na frente do tronco (a barriguinha): uma grade polar
 * em anéis, cada vértice posto na pele por `noRemendo` — ele dobra junto com
 * a curva do corpo, e as faces olham para fora.
 */
function remendoNoTronco(m: MedidasCorpo, y0: number, rx: number, ry: number, folga: number, N = 32, M = 6): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let k = 0; k <= M; k++) {
    const u = k / M;
    for (let j = 0; j <= N; j++) {
      const t = (j / N) * Math.PI * 2;
      const x = Math.cos(t) * rx * u;
      const y = Math.sin(t) * ry * u;
      const p = noRemendo(m, y0, x, y, folga);
      pos.push(p.x, p.y, p.z);
      uv.push(x, y);
    }
  }
  for (let k = 0; k < M; k++) {
    for (let j = 0; j < N; j++) {
      const a = k * (N + 1) + j;
      const b = (k + 1) * (N + 1) + j;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * O MOLETOM DE MORCEGUINHO (tronco): a `cor` pinta o tronco do rig de feltro
 * roxo-escuro, e por cima
 *
 * - a BARRIGUINHA lilás, um oval de feltro costurado com ponto aparente;
 * - a BARRA RECORTADA em bicos de asa de morcego, caindo por cima da calça;
 * - a gola canelada e dois pompons de cordão;
 * - e nas costas, onde o cabelo deixa ver, um morceguinho bordado.
 */
function moletomDeMorcego(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const barriga = peca?.corDetalhe ?? P.morceguinhoBarriga;
  // a casca do moletom: folgada, com a trama de feltro (a cápsula pintada fica por dentro)
  const yGola = c.topo - m.torsoH * 0.02;
  const baixo = c.quadril - h * 0.005;
  const pano = toon(cor, { mapa: feltro(0.08), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, baixo, folga: 1.08, colunas: 72, linhas: 16 }), pano));

  // A BARRA EM BICOS de asa: a saia curtinha que desce da barra em sete
  // bicos arredondados em volta do corpo
  {
    const N = 14;
    const NC = N * 8;
    const posB: number[] = [];
    const idxB: number[] = [];
    const yB = baixo + h * 0.006;
    const QUEDA = h * 0.034;
    for (let i = 0; i <= NC; i++) {
      const a = -Math.PI + (i / NC) * Math.PI * 2;
      const fase = (i % 8) / 8;
      const bico = Math.pow(Math.sin(fase * Math.PI), 0.7);
      const R = Math.max(raioDoTronco(m, yB), c.r * 0.9) * 1.11;
      for (const u of [0, 1]) {
        const y = yB - u * QUEDA * (0.45 + 0.55 * bico);
        const Ru = R * (1 + 0.05 * u);
        posB.push(Math.sin(a) * Ru, y, Math.cos(a) * Ru * c.ACHATA);
      }
    }
    for (let i = 0; i < NC; i++) {
      const a = i * 2;
      const b = (i + 1) * 2;
      idxB.push(a, a + 1, b, b, a + 1, b + 1);
    }
    const geoB = new THREE.BufferGeometry();
    geoB.setAttribute('position', new THREE.Float32BufferAttribute(posB, 3));
    geoB.setIndex(idxB);
    geoB.computeVertexNormals();
    g.add(new THREE.Mesh(geoB, toon(escuro(cor, 0.85), { mapa: feltro(0.08), doubleSide: true })));
  }

  // A BARRIGUINHA: um oval de feltro claro na frente, e o ponto aparente em volta
  const yBarriga = c.quadril + m.torsoH * 0.42;
  g.add(new THREE.Mesh(remendoNoTronco(m, yBarriga, h * 0.052, h * 0.062, 1.095), toon(barriga, { mapa: feltro(0.05) })));
  {
    const linha = toon(escuro(barriga, 0.72));
    const N = 26;
    for (let k = 0; k < N; k++) {
      const t = (k / N) * Math.PI * 2;
      const p = noRemendo(m, yBarriga, Math.cos(t) * h * 0.044, Math.sin(t) * h * 0.054, 1.102);
      const ponto = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.0011, h * 0.004, 2, 4), linha);
      ponto.position.copy(p);
      ponto.rotation.z = t;
      g.add(ponto);
    }
  }

  // A GOLA canelada e o cordão com os dois pompons
  const gola = new THREE.Mesh(new THREE.TorusGeometry(c.r * 0.66, h * 0.008, 8, 28), toon(escuro(cor, 0.8), { mapa: feltro(0.05) }));
  gola.rotation.x = Math.PI / 2 - 0.25;
  gola.position.set(0, yGola + h * 0.004, c.r * 0.12);
  g.add(gola);
  const lilas = toon(P.morceguinhoBarriga);
  for (const s of [-1, 1] as const) {
    const de = new THREE.Vector3(s * c.r * 0.28, yGola - h * 0.002, c.r * 0.66);
    const ate = new THREE.Vector3(s * c.r * 0.33, yGola - h * 0.05, c.r * c.ACHATA * 1.1);
    const cordao = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(de, de.clone().lerp(ate, 0.5).add(new THREE.Vector3(0, 0, h * 0.006)), ate), 10, h * 0.0018, 5, false), lilas);
    g.add(cordao);
    const pompom = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0065, 10, 8), lilas);
    pompom.position.copy(ate).add(new THREE.Vector3(0, -h * 0.004, 0));
    g.add(pompom);
  }

  // nas costas, BAIXO (a juba do Ari cobre o alto): o morceguinho bordado
  {
    const y = c.quadril + m.torsoH * 0.36;
    const bord = new THREE.Group();
    const e = h * 0.022;
    const asa = new THREE.Shape();
    asa.moveTo(0, e * 0.15);
    asa.quadraticCurveTo(e * 0.7, e * 0.75, e * 1.45, e * 0.45);
    asa.quadraticCurveTo(e * 1.2, e * 0.05, e * 1.1, -e * 0.2);
    asa.quadraticCurveTo(e * 0.85, -e * 0.05, e * 0.7, -e * 0.3);
    asa.quadraticCurveTo(e * 0.45, -e * 0.12, e * 0.25, -e * 0.35);
    asa.quadraticCurveTo(e * 0.1, -e * 0.15, 0, -e * 0.2);
    asa.closePath();
    const lil = toon(P.morceguinhoBarriga);
    for (const s of [-1, 1]) {
      const geo = new THREE.ShapeGeometry(asa, 8);
      if (s < 0) {
        geo.scale(-1, 1, 1);
        // espelhar vira a face: a ordem dos cantos volta ao certo
        const ix = geo.getIndex();
        if (ix) for (let k = 0; k < ix.count; k += 3) { const t = ix.getX(k + 1); ix.setX(k + 1, ix.getX(k + 2)); ix.setX(k + 2, t); }
      }
      bord.add(new THREE.Mesh(geo, lil));
    }
    const corpinho = new THREE.Mesh(new THREE.CircleGeometry(e * 0.3, 14), lil);
    corpinho.scale.y = 1.25;
    corpinho.position.z = e * 0.01;
    bord.add(corpinho);
    for (const s of [-1, 1]) {
      const orelha = new THREE.Mesh(new THREE.CircleGeometry(e * 0.12, 3), lil);
      orelha.position.set(s * e * 0.14, e * 0.36, e * 0.01);
      orelha.rotation.z = Math.PI / 2;
      bord.add(orelha);
    }
    const R = Math.max(raioDoTronco(m, y), c.r * 0.5) * 1.085;
    bord.position.set(0, y, -R * c.ACHATA - h * 0.002);
    bord.rotation.y = Math.PI;
    g.add(bord);
  }
  return fundir(g);
}

/**
 * A MANGA DO MOLETOM (`extraBraco`): comprida, de feltro, com o punho
 * canelado e, por baixo do braço, a MEMBRANINHA de asa recortada em bicos,
 * do cotovelo ao punho — abrindo o braço, o morceguinho "abre a asa".
 */
function mangaDeMorcego(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const pano = toon(cor, { mapa: feltro(0.06), doubleSide: true });
  const L = m.armLen;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.047 * w, h * 0.014],
    [h * 0.051 * w, -h * 0.012],
    [h * 0.049 * w, -L * 0.4],
    [h * 0.046 * w, -L * 0.72],
  ], 0, () => 0, 24), pano));
  // o punho canelado (nervuras em volta)
  const yPunho = -L * 0.76;
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.042 * w, h * 0.04 * w, L * 0.08, 18), toon(escuro(cor, 0.82)));
  punho.position.y = yPunho;
  g.add(punho);
  const nerv = toon(escuro(cor, 0.62));
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const risco = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0015, L * 0.07, h * 0.0015), nerv);
    risco.position.set(Math.sin(a) * h * 0.0413 * w, yPunho, Math.cos(a) * h * 0.0413 * w);
    g.add(risco);
  }
  // A MEMBRANINHA de asa por baixo do braço (do lado de DENTRO, `-lado`),
  // presa do cotovelo ao punho, com três bicos para baixo
  const memb = new THREE.Shape();
  const topo = -L * 0.32;
  const fim = -L * 0.74;
  const fundo = h * 0.04;
  memb.moveTo(0, topo);
  memb.lineTo(0, fim);
  memb.quadraticCurveTo(fundo * 0.6, fim + h * 0.004, fundo, fim - h * 0.006);
  memb.quadraticCurveTo(fundo * 0.75, fim + (topo - fim) * 0.3, fundo * 1.05, fim + (topo - fim) * 0.42);
  memb.quadraticCurveTo(fundo * 0.7, fim + (topo - fim) * 0.62, fundo * 0.95, fim + (topo - fim) * 0.75);
  memb.quadraticCurveTo(fundo * 0.4, topo - h * 0.004, 0, topo);
  const geo = chapa(memb, h * 0.002, h * 0.0015);
  const asinha = new THREE.Mesh(geo, toon(P.morceguinhoMembrana, { mapa: feltro(0.05) }));
  // no plano de trás do braço, saindo para trás (−Z): gira para o plano YZ
  asinha.rotation.y = Math.PI / 2;
  asinha.position.set(-lado * h * 0.004, 0, -h * 0.04 * w);
  g.add(asinha);
  return fundir(g);
}

/**
 * A CALÇA LISTRADA (pernas): roxa e preta, de malha, um tubo um tico folgado
 * por cima da perna (pintada de preto pela `cor`), com o punho canelado no
 * tornozelo.
 */
function calcaListrada(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const escura = peca?.cor ?? P.morceguinhoListraEscura;
  const listra = peca?.corDetalhe ?? P.morceguinhoListra;
  const mapa = listrasDeMeia(escura, listra, h * 0.045);
  const pano = toon(0xffffff, { mapa, doubleSide: true });
  const TOPO = h * 0.012;
  const PUNHO = -m.legH * 0.8;
  const FIM = -m.legH * 0.87;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, TOPO + h * 0.004],
    [h * 0.052 * w, TOPO],
    [h * 0.05 * w, -m.legH * 0.4],
    [h * 0.048 * w, PUNHO],
  ], 0, () => 0, 24), pano));
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.046 * w, h * 0.045 * w, PUNHO - FIM, 20), toon(escura));
  punho.position.y = (PUNHO + FIM) / 2;
  g.add(punho);
  const nerv = toon(escuro(listra, 0.7));
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const risco = new THREE.Mesh(new THREE.BoxGeometry(h * 0.0014, (PUNHO - FIM) * 0.8, h * 0.0014), nerv);
    risco.position.set(Math.sin(a) * h * 0.0462 * w, (PUNHO + FIM) / 2, Math.cos(a) * h * 0.0462 * w);
    g.add(risco);
  }
  return fundir(g);
}

/**
 * AS PANTUFAS DE MORCEGUINHO (pés), que SUBSTITUEM o pé do rig: o corpo
 * fofo e redondo de pelúcia roxa, a sola creme, duas orelhinhas pontudas, os
 * olhos de botão com o brilho, os dentinhos e as duas asinhas dos lados.
 */
function pantufasDeMorcego(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const h = m.h;
  const p = pe(m);
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const pelucia = toon(cor, { mapa: veludo(0.06) });
  g.add(camadaDeSola(m, p.chao, h * 0.007, P.morceguinhoBarriga, 1.08));
  // o corpo: uma bola achatada e comprida, mais alta atrás
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), pelucia);
  corpo.scale.set(p.meiaLargura * 1.35, h * 0.032, p.meioComprimento * 1.22);
  corpo.position.set(0, p.chao + h * 0.022, p.z + h * 0.004);
  g.add(corpo);
  // a boca da pantufa: o anel em volta do tornozelo
  const boca = new THREE.Mesh(new THREE.TorusGeometry(h * 0.04 * m.w, h * 0.008, 8, 22), toon(escuro(cor, 0.85), { mapa: veludo(0.06) }));
  boca.rotation.x = Math.PI / 2;
  boca.position.set(0, p.chao + h * 0.045, p.z - h * 0.02);
  g.add(boca);
  // A CARA, no alto do bico (é o que a câmera de cima vê): os olhos de
  // botão com o branquinho e o brilho, os dois dentinhos na beira da frente,
  // e as orelhinhas pontudas de pelúcia com o miolo rosado
  const meio = p.meioComprimento * 1.22;
  const naCasca = (x: number, frente: number): THREE.Vector3 => {
    // um ponto na bola achatada do corpo, `frente` de 0 (meio) a 1 (bico)
    const z = p.z + h * 0.004 + frente * meio;
    const k = 1 - frente * frente - (x / (p.meiaLargura * 1.35)) ** 2;
    return new THREE.Vector3(x, p.chao + h * 0.022 + h * 0.032 * Math.sqrt(Math.max(0, k)), z);
  };
  const botao = toon(P.morceguinhoBotao);
  const branco = toon(0xffffff);
  const rosa = toon(P.morceguinhoOrelha);
  for (const s2 of [-1, 1] as const) {
    const pO = naCasca(s2 * h * 0.012, 0.62);
    const olho = new THREE.Group();
    const fundo = new THREE.Mesh(new THREE.CircleGeometry(h * 0.0078, 16), branco);
    olho.add(fundo);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0052, 12, 8), botao);
    pupila.scale.z = 0.5;
    pupila.position.set(0, -h * 0.001, h * 0.0015);
    olho.add(pupila);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0016, 6, 4), branco);
    luz.position.set(-h * 0.0018, h * 0.0012, h * 0.0042);
    olho.add(luz);
    olho.position.copy(pO);
    // deitado na casca: olha para cima e para a frente
    olho.lookAt(pO.x * 1.4, pO.y + h * 0.05, pO.z + h * 0.035);
    g.add(olho);
    const pD = naCasca(s2 * h * 0.0045, 0.93);
    const dente = new THREE.Mesh(new THREE.ConeGeometry(h * 0.0032, h * 0.0075, 8), toon(P.morceguinhoUnha));
    dente.rotation.x = Math.PI - 0.5;
    dente.position.copy(pD).add(new THREE.Vector3(0, -h * 0.003, h * 0.002));
    g.add(dente);
    // as orelhinhas, atrás dos olhos, em pé e abrindo
    const pE = naCasca(s2 * h * 0.017, 0.25);
    const orelha = new THREE.Group();
    const fora = new THREE.Mesh(new THREE.ConeGeometry(h * 0.009, h * 0.024, 4), pelucia);
    fora.rotation.y = Math.PI / 4;
    fora.position.y = h * 0.012;
    orelha.add(fora);
    const miolo = new THREE.Mesh(new THREE.ConeGeometry(h * 0.0055, h * 0.015, 4), rosa);
    miolo.rotation.y = Math.PI / 4;
    miolo.position.set(0, h * 0.0095, h * 0.0034);
    orelha.add(miolo);
    orelha.position.copy(pE).add(new THREE.Vector3(0, -h * 0.003, 0));
    orelha.rotation.set(0.2, 0, -s2 * 0.4);
    g.add(orelha);
    // a asinha do lado: a mesma forma da membrana, pequena, abrindo para trás
    const asa = new THREE.Shape();
    const e = h * 0.022;
    asa.moveTo(0, 0);
    asa.quadraticCurveTo(e * 0.4, e * 0.9, e * 1.2, e * 0.75);
    asa.quadraticCurveTo(e * 0.9, e * 0.4, e * 0.95, e * 0.15);
    asa.quadraticCurveTo(e * 0.6, e * 0.3, e * 0.5, 0);
    asa.closePath();
    const geo = chapa(asa, h * 0.002, h * 0.0012);
    const asinha = new THREE.Mesh(geo, toon(P.morceguinhoMembrana));
    asinha.position.set(s2 * p.meiaLargura * 1.25, p.chao + h * 0.02, p.z - h * 0.005);
    asinha.rotation.y = s2 > 0 ? Math.PI / 2 + 0.3 : -Math.PI / 2 - 0.3;
    g.add(asinha);
  }
  return fundir(g);
}

/**
 * AS LUVINHAS COM UNHINHA (mãos): luva de feltro roxa, gordinha, o punho
 * canelado e as quatro unhinhas creme saindo da ponta.
 */
function luvinhasDeMorcego(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const unha = peca?.corDetalhe ?? P.morceguinhoUnha;
  const mat = toon(cor, { mapa: feltro(0.04) });
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.12, 16, 12), mat);
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.1, 0.98);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.013 * w, h * 0.014, 4, 8), mat);
  polegar.position.set(-lado * h * 0.022 * w, c.yMao + h * 0.004, h * 0.026 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  const punho = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.038 * w, h * 0.036 * w, h * 0.026, 16), toon(escuro(cor, 0.8)));
  punho.position.y = c.yPulso + h * 0.002;
  g.add(punho);
  // as quatro unhinhas na ponta da mão, viradas para baixo e para a frente
  const matUnha = toon(unha);
  for (let k = 0; k < 4; k++) {
    const a = (k - 1.5) * 0.36;
    const u = new THREE.Mesh(new THREE.ConeGeometry(h * 0.0038, h * 0.011, 8), matUnha);
    const R = c.raioMao * 1.1;
    u.position.set(Math.sin(a) * R * 0.6, c.yMao - R * 0.95, Math.cos(a) * R * 0.35 + h * 0.004);
    u.rotation.set(Math.PI + 0.35, 0, -a * 0.6);
    g.add(u);
  }
  return fundir(g);
}

/**
 * AS ASINHAS (acessório, nas costas): duas asas de morcego de feltro,
 * presas no meio das costas e abrindo para os lados e para cima, em volta do
 * cabelo. Cada uma é a silhueta de asa (os três bicos da membrana) com bisel
 * gordo, a membrana um tom acima, os três "dedos" de cordão e a unhinha na
 * ponta. Elas BATEM: devagar parado, depressa andando.
 */
function asinhasDeMorcego(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.morceguinhoFeltro;
  const membrana = peca?.corDetalhe ?? P.morceguinhoMembrana;
  const yBase = c.quadril + m.torsoH * 0.56;
  const zCostas = -c.r * c.ACHATA - h * 0.012;
  const e = h * 0.175; // a envergadura de uma asa
  const asa = new THREE.Shape();
  asa.moveTo(0, e * 0.12);
  asa.quadraticCurveTo(e * 0.42, e * 0.62, e * 1.0, e * 0.48);
  asa.quadraticCurveTo(e * 0.95, e * 0.14, e * 0.98, -e * 0.08);
  asa.quadraticCurveTo(e * 0.8, e * 0.02, e * 0.68, -e * 0.16);
  asa.quadraticCurveTo(e * 0.52, -e * 0.02, e * 0.38, -e * 0.24);
  asa.quadraticCurveTo(e * 0.22, -e * 0.06, 0, -e * 0.12);
  asa.closePath();
  const geoAsa = chapa(asa, h * 0.003, h * 0.0035, 14);
  geoAsa.translate(0, 0, -h * 0.003);
  const matMembrana = toon(membrana, { mapa: feltro(0.06) });
  const matDedo = toon(cor, { mapa: feltro(0.06) });
  const matUnha = toon(P.morceguinhoUnha);
  // os três dedos: do ombro da asa até cada bico
  const dedos: Array<[number, number]> = [[0.98, -0.08], [0.68, -0.16], [0.38, -0.24]];
  const asas = new THREE.Group();
  asas.name = 'asas';
  const pivos: THREE.Group[] = [];
  for (const s of [-1, 1] as const) {
    const pivo = new THREE.Group();
    pivo.position.set(s * h * 0.012, yBase, zCostas);
    const lamina = new THREE.Group();
    // a asa abre para o lado, um pouco para trás e para cima
    // (a da esquerda é a forma ESPELHADA, que já nasce apontando para −X)
    lamina.rotation.set(0.18, s * 0.32, s * 0.42);
    const geo = s > 0 ? geoAsa : espelhada(geoAsa);
    lamina.add(new THREE.Mesh(geo, matMembrana));
    const ombro = new THREE.Vector3(e * 0.0, e * 0.12, h * 0.004);
    const alto = new THREE.Vector3(e * 1.0, e * 0.48, h * 0.004);
    // o braço da asa (a borda de cima) e os dedos, em cordão de feltro escuro
    lamina.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(ombro, new THREE.Vector3(e * 0.42, e * 0.62, h * 0.004), alto), 20, h * 0.004, 6, false), matDedo));
    for (const [dx, dy] of dedos) {
      const ponta = new THREE.Vector3(e * dx, e * dy, h * 0.0035);
      const de = new THREE.Vector3(e * 0.55, e * 0.5, h * 0.0035);
      lamina.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(de, ponta), 4, h * 0.0022, 5, false), matDedo));
    }
    const unha = new THREE.Mesh(new THREE.ConeGeometry(h * 0.004, h * 0.012, 8), matUnha);
    unha.position.copy(alto).add(new THREE.Vector3(e * 0.03, e * 0.03, 0));
    unha.rotation.z = -0.9;
    lamina.add(unha);
    pivo.add(lamina);
    asas.add(pivo);
    pivos.push(pivo);
  }
  // o miolo que prende as duas asas nas costas: um botão de feltro
  const presa = new THREE.Mesh(new THREE.SphereGeometry(h * 0.012, 12, 8), matDedo);
  presa.scale.z = 0.55;
  presa.position.set(0, yBase, zCostas + h * 0.002);
  g.add(presa);
  g.add(asas);

  // BATER AS ASAS: o ângulo em volta do eixo de cada pivô (vertical, nas
  // costas), devagar parado e mais largo e depressa andando
  const passo = medidorDePasso();
  let fase = 0;
  let ultimaVez = 0;
  let ultimoQuadro = -1;
  const malha = asas.children[0].children[0].children[0] as THREE.Mesh;
  const bater = (renderer: THREE.WebGLRenderer): void => {
    const quadro = renderer.info.render.frame;
    if (quadro === ultimoQuadro) return;
    ultimoQuadro = quadro;
    const agora = performance.now();
    const dt = ultimaVez ? Math.min(0.1, (agora - ultimaVez) / 1000) : 0;
    ultimaVez = agora;
    const v = Math.min(1, Math.abs(passo(g, dt)) / 2);
    fase += dt * (2.2 + 6 * v) * Math.PI;
    const amp = 0.08 + 0.26 * v;
    const bate = Math.sin(fase) * amp;
    pivos[0].rotation.y = -bate;
    pivos[1].rotation.y = bate;
  };
  malha.onBeforeRender = bater;
  return g;
}

/** a geometria espelhada em X, com a ordem dos cantos desvirada (senão a face vira do avesso) */
function espelhada(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.clone();
  g.scale(-1, 1, 1);
  const ix = g.getIndex();
  if (ix) {
    for (let k = 0; k < ix.count; k += 3) {
      const t = ix.getX(k + 1);
      ix.setX(k + 1, ix.getX(k + 2));
      ix.setX(k + 2, t);
    }
  } else {
    const pos = g.attributes.position;
    for (let k = 0; k < pos.count; k += 3) {
      for (const atr of Object.values(g.attributes)) {
        const a = atr as THREE.BufferAttribute;
        for (let c = 0; c < a.itemSize; c++) {
          const t = a.getComponent(k + 1, c);
          a.setComponent(k + 1, c, a.getComponent(k + 2, c));
          a.setComponent(k + 2, c, t);
        }
      }
    }
  }
  g.computeVertexNormals();
  return g;
}

export {
  // o vampiro
  presinhasDeVampiro, coleteDeVampiro, mangaDeVampiro, calcaDeVampiro, sapatoDeVerniz, luvasDeVampiro, capaDeVampiro,
  // o morceguinho
  tiaraDeMorcego, moletomDeMorcego, mangaDeMorcego, calcaListrada, pantufasDeMorcego, luvinhasDeMorcego, asinhasDeMorcego,
  // o kit (as fantasias da caça, `fantasiasDaCaca.ts`, usam também)
  capaViva, medalhao, medidorDePasso, espelhada, corpoDe, feltro, listrasDeMeia, chapa, forroDe,
  remendoNoTronco, noRemendo,
};
export type { OpcoesDeCapa };
