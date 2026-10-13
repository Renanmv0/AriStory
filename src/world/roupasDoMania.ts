import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { fundir } from './fundir';
import { montarTenis, raioDoTronco } from './uniformeDosGatitos';
import {
  alturaDaAba, cintaNaPele, corpete, evase, lacoDeFita, naPele, noTronco, saiaViva, torneada, vivoNaPele,
} from './roupasDaBoutique';
import { bloquinhoDeComandas } from './moveisDoMania';

/**
 * AS ROUPAS DO MANIA DE CHURRASCO — os prêmios da temporada de turnos.
 *
 * O Walter dá uma peça na primeira vez das três estrelas de cada turno (§13.5
 * de `docs/MINIGAME-RESTAURANTE.md`): a gravatinha no turno 1 (ela mora em
 * `roupas.ts`, é de antes da temporada), o avental de garçom no 2, e as
 * próximas — o bloquinho com o lápis, o colete, a bandana e o dólmã — entram
 * aqui conforme os turnos delas.
 *
 * A regra é a da skill `aristory-roupa`: cada função recebe as medidas e
 * devolve um `Object3D` NOVO, no referencial do slot (`tronco`: y = 0 no
 * CHÃO). O kit é o da boutique da Estella (`roupasDaBoutique.ts`): a saia viva
 * que acompanha a perna, a cinta e o laço.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

// ------------------------------------------------------------- o avental

/**
 * O PANO DO AVENTAL, pintado UMA vez: a sarja preta, as costuras de pesponto
 * nas bordas e na barra, o bolso largo dividido no meio, e o "Mania" bordado
 * em dourado com a chaminha do letreiro do restaurante ao lado.
 *
 * O bordado é TEXTURA, e não peça pregada por cima, de propósito: o avental é
 * uma saia viva (a perna empurra o pano a cada passo), e um "Mania" de
 * geometria ficaria parado no ar enquanto o pano andava embaixo dele. Na
 * textura, o bordado anda junto com o tecido.
 *
 * O desenho cobre o painel inteiro, de borda a borda (o UV do avental é
 * refeito de 0 a 1, ver `aventalDeGarcom`): o canvas tem a proporção do pano
 * de um adulto — uns 0,5 m de largura por 0,7 de comprimento.
 */
let panoDoAvental: THREE.CanvasTexture | null = null;
function texturaDoAvental(): THREE.CanvasTexture {
  if (panoDoAvental) return panoDoAvental;
  const W = 512;
  const H = 704;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // a sarja: o fundo e as diagonais finas da trama
    ctx.fillStyle = css(P.aventalGarcom);
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 2;
    for (let d = -H; d < W; d += 7) {
      ctx.beginPath();
      ctx.moveTo(d, H);
      ctx.lineTo(d + H, 0);
      ctx.stroke();
    }

    // o PESPONTO: linha tracejada um tom acima do pano
    const pesponto = (pontos: Array<[number, number]>, cor = css(P.aventalGarcomCostura), largura = 3): void => {
      ctx.save();
      ctx.strokeStyle = cor;
      ctx.lineWidth = largura;
      ctx.setLineDash([11, 7]);
      ctx.beginPath();
      ctx.moveTo(...pontos[0]);
      for (const p of pontos.slice(1)) ctx.lineTo(...p);
      ctx.stroke();
      ctx.restore();
    };
    // as bainhas das laterais e da barra
    const B = 18;
    pesponto([[B, 26], [B, H - B], [W - B, H - B], [W - B, 26]]);
    // a barra dobrada: uma faixa um fio mais escura embaixo
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, H - 34, W, 34);

    // O BOLSO LARGO, de lado a lado do meio: a boca dobrada (mais clara), o
    // pesponto em volta e a divisão do meio — bolso de bloquinho e de caneta
    const bx0 = W * 0.17;
    const bx1 = W * 0.83;
    const by0 = H * 0.5;
    const by1 = H * 0.72;
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(bx0, by0, bx1 - bx0, 12);
    pesponto([[bx0 + 6, by0 + 18], [bx0 + 6, by1 - 6], [bx1 - 6, by1 - 6], [bx1 - 6, by0 + 18]]);
    pesponto([[bx0, by0 + 13], [bx1, by0 + 13]]);
    pesponto([[W / 2, by0 + 18], [W / 2, by1 - 6]]);

    // O "MANIA" BORDADO, acima do bolso: a letra do letreiro do restaurante,
    // cheia de fio dourado, com o contorno no dourado escuro (é o ponto
    // cheio de bordado que faz a borda) e um brilho de fio na diagonal
    const texto = 'Mania';
    const cy = H * 0.33;
    ctx.font = `bold 118px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const largo = ctx.measureText(texto).width;
    const cx = W / 2 + 22;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = css(P.aventalGarcomBordadoEscuro);
    ctx.lineWidth = 10;
    ctx.strokeText(texto, cx, cy);
    ctx.fillStyle = css(P.aventalGarcomBordado);
    ctx.fillText(texto, cx, cy);
    // os fios: riscas finas em diagonal só dentro das letras
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(255,240,190,0.35)';
    ctx.lineWidth = 2;
    for (let d = cx - largo; d < cx + largo; d += 6) {
      ctx.beginPath();
      ctx.moveTo(d, cy + 60);
      ctx.lineTo(d + 50, cy - 60);
      ctx.stroke();
    }
    ctx.restore();

    // a chaminha do letreiro, à esquerda da palavra, também em fio dourado
    const fx = cx - largo / 2 - 40;
    const fy = cy + 6;
    const gota = (s: number, cor: string): void => {
      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.moveTo(fx, fy - s * 1.6);
      ctx.bezierCurveTo(fx + s * 0.35, fy - s * 0.9, fx + s * 1.05, fy - s * 0.35, fx + s * 0.85, fy + s * 0.35);
      ctx.bezierCurveTo(fx + s * 0.7, fy + s * 0.95, fx - s * 0.7, fy + s * 0.95, fx - s * 0.85, fy + s * 0.35);
      ctx.bezierCurveTo(fx - s * 1.0, fy - s * 0.2, fx - s * 0.5, fy - s * 0.6, fx, fy - s * 1.6);
      ctx.closePath();
      ctx.fill();
    };
    gota(30, css(P.aventalGarcomBordadoEscuro));
    gota(25, css(P.aventalGarcomBordado));
    gota(12, css(P.aventalGarcomBordadoEscuro));

    // "de Churrasco", pequeno, embaixo: em pesponto dourado, como a linha
    // fina que os bordados de uniforme fazem debaixo da marca
    ctx.font = `bold 34px ui-rounded, "Nunito", system-ui, sans-serif`;
    ctx.fillStyle = css(P.aventalGarcomBordado);
    ctx.fillText('de Churrasco', W / 2, cy + 82);
  }
  panoDoAvental = new THREE.CanvasTexture(canvas);
  panoDoAvental.colorSpace = THREE.SRGBColorSpace;
  panoDoAvental.anisotropy = 4;
  return panoDoAvental;
}

/**
 * O AVENTAL DE GARÇOM DO MANIA — prêmio das três estrelas do turno 2.
 *
 * Avental de bistrô: só da cintura para baixo, COMPRIDO (até o meio da
 * canela), preto, com o "Mania" bordado em dourado, o bolso largo de
 * bloquinho e a fita amarrada num laço nas costas. Vai por CIMA da roupa
 * (sem `cor` na ficha): a camiseta de baixo continua a da pessoa.
 *
 * COMPRIDO SÓ DÁ PORQUE É SAIA VIVA. O avental da Josefina para no meio da
 * coxa justamente porque pano comprido e rígido é o que a perna atravessa na
 * passada. Este é um PAINEL de `saiaViva` (a frente e os lados, aberto atrás,
 * como avental de verdade): a perna que avança empurra o pano, e sentado ele
 * cai do colo como cortina.
 *
 * É ACESSÓRIO preso no corpo (`presoEm: 'corpo'`), e não peça de tronco:
 * assim ele vai por cima de QUALQUER roupa — o colete, a camiseta, um
 * vestido — sem tomar a vaga dela (pedido do Renan).
 *
 * REFERENCIAL: o do corpo, y = 0 no CHÃO (o mesmo do tronco).
 */
function aventalDeGarcom(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const quadril = m.legH;
  const cintura = quadril + m.torsoH * 0.2;
  // o raio do calção do rig: toda cintura de saia tem que cobri-lo
  const raioDoCalcao = h * 0.118 * w;
  const r0 = Math.max(raioDoTronco(m, cintura) * 1.07, raioDoCalcao * 1.06);
  const pano = toon(0xffffff, { mapa: texturaDoAvental(), doubleSide: true });
  const fita = toon(P.aventalGarcomFita, { doubleSide: true });

  // O PAINEL: 150° da frente e dos lados, da cintura ao meio da canela, com
  // um evasê leve e quatro dobras rasas (avental de sarja cai quase reto)
  const COLUNAS = 40;
  const LINHAS = 16;
  const ARCO = 1.3;
  const yTopo = cintura + h * 0.004;
  const yBarra = quadril * 0.36;
  /*
   * POR CIMA DO QUE ESTIVER POR BAIXO. O avental é acessório e veste com
   * qualquer roupa de tronco; com um vestido rodado, o pano dele sumia dentro
   * da saia do vestido. `m.porBaixo` é a medida da roupa de baixo (o rig mede
   * a geometria montada), com 3,5% de folga, e o pano cai como pano:
   *
   * - como CORTINA: em cada altura ele cerca tudo o que está por baixo dali
   *   para cima (não entra debaixo de um babado);
   * - e RETO da cintura até o ponto mais largo abaixo: o vestido rosa tem duas
   *   camadas, e o avental que só seguia a medida fazia o degrau delas.
   *
   * Sem roupa rodada por baixo a conta não muda nada: o avental é o de sempre.
   */
  const ACHATA = 0.86; // o padrão da `saiaViva`
  const debaixo = m.porBaixo;
  const solto = evase(r0, r0 * 1.42, 4, h * 0.003, 0.9);
  const AMOSTRAS = 16;
  const precisa = (a: number, t: number): number => {
    if (!debaixo) return 0;
    // o ângulo do painel vira a direção de verdade no corpo achatado
    const sen = Math.sin(a);
    const cos = ACHATA * Math.cos(a);
    const direcao = Math.atan2(sen, cos);
    const escala = 1.035 / Math.hypot(sen, cos);
    const topo = solto(a, 0);
    const naAltura = (s: number): number => debaixo(direcao, THREE.MathUtils.lerp(yTopo, yBarra, s)) * escala;
    let r = naAltura(t);
    for (let k = 0; k <= AMOSTRAS; k++) {
      const s = k / AMOSTRAS;
      const d = naAltura(s);
      // acima: a cortina; abaixo: a reta que sai da cintura e passa por fora dele
      r = Math.max(r, s <= t ? d : topo + ((d - topo) * t) / s);
    }
    return r;
  };
  const rodado = precisa(0, 1) > solto(0, 1);
  const saia = saiaViva(m, {
    yTopo,
    yBarra,
    raio: (a, t) => Math.max(solto(a, t), precisa(a, t)),
    arco: [-ARCO, ARCO],
    colunas: COLUNAS,
    linhas: LINHAS,
    // por cima de uma saia viva, a folga a mais contra a perna da de dentro
    camada: rodado ? h * 0.012 : 0,
  }, pano);
  /**
   * O UV DA SAIA VIVA É EM METROS (para a estampa de azulejo da boutique ter
   * o mesmo tamanho em todo pano). Aqui o desenho é UM só e cobre o painel de
   * borda a borda, então ele é refeito de 0 a 1: `u` no arco, `v` da cintura
   * (1, o alto do canvas) até a barra (0). A ordem dos vértices é a da
   * `saiaViva`: coluna por coluna, linha por linha (sem cortes, as linhas são
   * `LINHAS + 1`).
   */
  const uv = saia.geometry.attributes.uv as THREE.BufferAttribute;
  const NL = LINHAS + 1;
  for (let k = 0; k < uv.count; k++) {
    const i = Math.floor(k / NL);
    const j = k % NL;
    uv.setXY(k, i / COLUNAS, 1 - j / LINHAS);
  }
  uv.needsUpdate = true;
  g.add(saia);

  // A FITA da cintura, a volta inteira, e o laço com as pontas nas costas
  const yFita = cintura + h * 0.002;
  const cinta = new THREE.Mesh(cintaNaPele(m, yFita, h * 0.009, 1.1), fita);
  // a cintura do vestido mais larga que a fita: a fita abre junto, por cima
  let maiorNaCintura = 0;
  for (let k = 0; k < 16; k++) maiorNaCintura = Math.max(maiorNaCintura, debaixo?.((k / 16) * Math.PI * 2, yFita) ?? 0);
  const abre = Math.max(1, (maiorNaCintura * 1.03) / (raioDoTronco(m, yFita) * 1.1));
  cinta.scale.set(abre, 1, abre);
  g.add(cinta);
  const laco = lacoDeFita(h * 0.022, fita, 2.4);
  // nas costas e virado para fora (o laço olha para `+Z`)
  laco.position.copy(naPele(m, Math.PI, yFita, 1.13 * abre));
  laco.rotation.y = Math.PI;
  g.add(laco);

  return fundir(g);
}

/**
 * O TÊNIS DE GARÇOM — a melhoria "Tênis de garçom" do turno, e não uma peça
 * do guarda-roupa: a cena calça os dois só enquanto o turno roda
 * (`g.vestirNaCena`), e tira no fim. O sapato é o mesmo do time dos Gatitos
 * (`montarTenis`), no preto do avental, com as listras no dourado do bordado
 * e sem o emblema do time.
 */
function tenisDeGarcom(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  return montarTenis(m, {
    cabedal: peca?.cor ?? P.aventalGarcom,
    listra: peca?.corDetalhe ?? P.aventalGarcomBordado,
    sola: P.tenisGarcomSola, filete: P.aventalGarcomFita, entressola: P.tenisGarcomSola,
    fileteDoMeio: P.aventalGarcomBordado,
    cadarco: P.tenisGarcomCadarco, colarinho: P.aventalGarcomFita, alca: P.aventalGarcomBordado,
    emblema: false,
  });
}

// ------------------------------------------ o prêmio do turno 3

/**
 * O LÁPIS NA ORELHA — metade do prêmio das três estrelas do turno 3 (a outra
 * metade é o bloquinho na mão). O lápis amarelo de garçom, apontado, com a
 * virola de latão e a borracha, deitado atrás da orelha direita e por cima do
 * cabelo: a ponta para a frente, a borracha para trás e um tico para cima.
 *
 * REFERENCIAL: a cabeça (`acessorio` com `presoEm: 'cabeca'`), y = 0 no
 * centro do crânio, olhando para `+Z`. O lado é o `+X` da pessoa (a direita
 * dela), e ele pousa onde o CABELO termina naquele lado (`m.cabelo`), senão o
 * cabelo cacheado do Ari engoliria o lápis inteiro.
 */
function lapisNaOrelha(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const ANGULO = 1.38;
  const x = Math.max(m.cabelo(ANGULO), r * 1.02) + r * 0.03;
  const lapis = new THREE.Group();
  lapis.position.set(x, -r * 0.12, -r * 0.08);
  // deitado no eixo da frente para trás, a borracha subindo um pouco atrás
  lapis.rotation.set(Math.PI / 2 - 0.25, 0, 0.12);
  g.add(lapis);
  const L = r * 1.1;
  const R = r * 0.045;
  lapis.add(new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 6), toon(P.churrascoLapis)));
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(R, L * 0.18, 6), toon(P.churrascoLapisMadeira));
  ponta.position.y = L / 2 + L * 0.09;
  lapis.add(ponta);
  const grafite = new THREE.Mesh(new THREE.ConeGeometry(R * 0.36, L * 0.06, 6), toon(P.churrascoCarvao));
  grafite.position.y = L / 2 + L * 0.155;
  lapis.add(grafite);
  const virola = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.06, R * 1.06, L * 0.09, 10), toon(P.churrascoLatao));
  virola.position.y = -L / 2 - L * 0.045;
  lapis.add(virola);
  const borracha = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.98, R * 0.98, L * 0.08, 10), toon(P.churrascoBorracha));
  borracha.position.y = -L / 2 - L * 0.13;
  lapis.add(borracha);
  return fundir(g);
}

/**
 * O BLOQUINHO NA MÃO — a outra metade do prêmio do turno 3: o MESMO bloquinho
 * de comandas que aparece na hora de anotar (a melhoria), agora para levar
 * para casa, na mão ESQUERDA (a direita é a do sorvete e do regador).
 *
 * REFERENCIAL: o pivô do braço (`maos`), y = 0 no ombro, o braço pendendo em
 * `-Y`. Monta só no braço esquerdo (`lado === -1`): no outro devolve vazio.
 * A capa fica de pé ao lado da mão, virada para a frente e um tico para fora.
 */
function bloquinhoNaMao(m: MedidasCorpo, lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const bloco = bloquinhoDeComandas();
  // ele nasce deitado (para a pose de anotar): de pé, com a folha para a frente
  bloco.rotation.set(Math.PI / 2 - 0.2, 0, 0.45);
  bloco.scale.setScalar(m.h / 1.75 * 0.85);
  bloco.position.set(-m.h * 0.012, -m.armLen * 0.96, m.h * 0.03);
  g.add(bloco);
  return fundir(g);
}

// ------------------------------------------ o prêmio do turno 4

/**
 * O COLETE DE GARÇOM — prêmio das três estrelas do turno 4, que a Estella diz
 * que costurou. Colete grafite de alfaiataria por cima da camisa branca (a
 * `cor` da ficha pinta a camiseta do rig de branco, e a `corDetalhe` a manga):
 * o decote em V fundo, a gola da camisa em pontas aparecendo no V, os quatro
 * botões dourados, os dois bolsos de vivo embaixo e o de peito, e nas costas
 * o forro vinho com a fivela de ajuste.
 *
 * O CORPO DO COLETE é o `corpete` da boutique (a casca que segue o tronco com
 * o decote como topo); o V é a função do decote, fundo na frente e reto nas
 * costas. REFERENCIAL: o tronco, y = 0 no CHÃO.
 */
function coleteDeGarcom(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const quadril = m.legH;
  const r = h * 0.105 * w;
  const alto = quadril + m.torsoH * 0.77;
  const yGola = alto + r * 0.55;
  const fundoDoV = quadril + m.torsoH * 0.5;
  const ABRE = 0.62;
  // o V: na frente desce até o meio do peito, abrindo para os lados em reta
  const decote = (a: number): number => {
    const k = Math.min(1, Math.abs(a) / ABRE);
    return fundoDoV + (yGola - fundoDoV) * k;
  };
  const pano = toon(P.coleteGarcom, { doubleSide: true });
  const baixo = quadril + m.torsoH * 0.12;
  g.add(new THREE.Mesh(corpete(m, { decote, baixo, folga: 1.06, colunas: 72, linhas: 18 }), pano));
  // as costas de forro vinho: um painel do mesmo corpete, só atrás, um fio por fora
  const costas = (a: number): number => (Math.abs(a) > 2.3 ? yGola - h * 0.012 : baixo + h * 0.012);
  g.add(new THREE.Mesh(corpete(m, { decote: costas, baixo: baixo + h * 0.012, folga: 1.075, colunas: 72, linhas: 14 }), toon(P.coleteGarcomForro, { doubleSide: true })));
  // a fivela de ajuste nas costas, na cintura
  const yAjuste = quadril + m.torsoH * 0.3;
  const fivela = new THREE.Mesh(new THREE.BoxGeometry(h * 0.022, h * 0.012, h * 0.004), toon(P.aventalGarcomBordado));
  fivela.position.copy(naPele(m, Math.PI, yAjuste, 1.1));
  fivela.lookAt(fivela.position.clone().multiplyScalar(2).setY(yAjuste));
  g.add(fivela);
  g.add(new THREE.Mesh(vivoNaPele(m, [[Math.PI - 0.35, yAjuste], [Math.PI, yAjuste], [Math.PI + 0.35, yAjuste]], h * 0.004, 1.09), toon(P.coleteGarcom)));

  // o vivo da borda do V, um tom acima do pano
  const vivo = toon(P.aventalGarcomFita);
  const borda: Array<[number, number]> = [];
  for (let i = 0; i <= 12; i++) {
    const a = -ABRE + (2 * ABRE * i) / 12;
    borda.push([a, decote(a) + h * 0.001]);
  }
  g.add(new THREE.Mesh(vivoNaPele(m, borda, h * 0.0035, 1.075), vivo));

  // OS QUATRO BOTÕES dourados, descendo do fundo do V
  const dourado = toon(P.aventalGarcomBordado);
  for (let k = 0; k < 4; k++) {
    const y = fundoDoV - h * 0.012 - k * h * 0.024;
    const b = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0055, 10, 6), dourado);
    b.position.copy(naPele(m, 0, y, 1.085));
    b.scale.set(1, 1, 0.55);
    g.add(b);
  }
  // os BOLSOS de vivo: dois embaixo, um de cada lado, e o de peito à esquerda
  for (const s of [-1, 1] as const) {
    const y = quadril + m.torsoH * 0.27;
    g.add(new THREE.Mesh(vivoNaPele(m, [[s * 0.45, y], [s * 0.62, y - h * 0.004], [s * 0.8, y - h * 0.008]], h * 0.0032, 1.08), vivo));
  }
  const yPeito = quadril + m.torsoH * 0.62;
  g.add(new THREE.Mesh(vivoNaPele(m, [[-0.72, yPeito], [-0.86, yPeito + h * 0.003], [-1.0, yPeito + h * 0.006]], h * 0.0032, 1.08), vivo));

  // A GOLA DA CAMISA em pontas, aparecendo no V: duas abas brancas dobradas
  // sobre o tronco (`noTronco`), uma de cada lado do pescoço
  const branco = toon(P.camisaDeGarcom, { doubleSide: true });
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(s * h * 0.004, 0);
    f.lineTo(s * h * 0.05, h * 0.004);
    f.lineTo(s * h * 0.022, -h * 0.042);
    f.closePath();
    const geo = new THREE.ExtrudeGeometry(f, { depth: h * 0.002, bevelEnabled: true, bevelThickness: h * 0.001, bevelSize: h * 0.001, bevelSegments: 1 });
    geo.translate(0, yGola - h * 0.004, 0);
    g.add(new THREE.Mesh(noTronco(geo, m, 1.07), branco));
  }
  return fundir(g);
}


// ------------------------------------------ o prêmio do turno 5

/**
 * O PANO DA BANDANA: o vinho do Mania com a estampa de bandana de verdade —
 * a barra de dois fios perto da beira, as gotas (o "paisley", com a voltinha
 * na ponta) e os pontinhos entre elas, tudo no dourado do bordado do avental.
 * Desenhado uma vez só; o UV da bandana dá três voltas dele em torno da
 * cabeça (`u`) e vai do alto à beira (`v`).
 */
let panoDaBandana: THREE.CanvasTexture | null = null;
function texturaDaBandana(): THREE.CanvasTexture {
  if (panoDaBandana) return panoDaBandana;
  const W = 256;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = css(P.bandanaChurrasco);
    ctx.fillRect(0, 0, W, H);
    const ouro = css(P.bandanaChurrascoEstampa);
    // a barra perto da beira (v = 0 é a beira, embaixo no canvas é o v = 0)
    ctx.fillStyle = ouro;
    ctx.fillRect(0, H - 34, W, 5);
    ctx.fillRect(0, H - 22, W, 2);
    // os pontinhos da barra
    for (let x = 6; x < W; x += 16) {
      ctx.beginPath();
      ctx.arc(x, H - 12, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    // AS GOTAS: a gota com a voltinha na ponta e o miolo vazado
    const gota = (x: number, y: number, s: number, giro: number): void => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(giro);
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.bezierCurveTo(-11, 10, -12, -4, -2, -9);
      ctx.bezierCurveTo(3, -12, 9, -14, 8, -19);
      ctx.bezierCurveTo(13, -12, 12, 8, 0, 12);
      ctx.fillStyle = ouro;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-1, 2, 3.6, 5.2, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = css(P.bandanaChurrasco);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-1, 2, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = ouro;
      ctx.fill();
      ctx.restore();
    };
    const lugares: Array<[number, number, number, number]> = [
      [40, 50, 1.1, 0.4], [128, 38, 1.0, -0.6], [212, 60, 1.15, 1.2],
      [84, 120, 1.05, 2.4], [176, 132, 1.1, -1.8], [36, 180, 0.95, -0.2], [140, 196, 1.0, 0.9], [230, 190, 0.9, 2.9],
    ];
    for (const [x, y, s, giro] of lugares) gota(x, y, s, giro);
    ctx.fillStyle = ouro;
    for (const [x, y] of [[84, 70], [168, 92], [20, 120], [236, 118], [100, 166], [196, 166], [60, 216], [176, 224]]) {
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  panoDaBandana = new THREE.CanvasTexture(canvas);
  panoDaBandana.colorSpace = THREE.SRGBColorSpace;
  panoDaBandana.wrapS = THREE.RepeatWrapping;
  return panoDaBandana;
}

/**
 * A BANDANA DE CHURRASQUEIRO — prêmio das três estrelas do turno 5, no molde
 * da bandana do Flynn (a faixa, o nó atrás e as duas pontas caindo), só que
 * de churrasqueiro: o pano COBRE a cabeça, como quem trabalha na grelha, no
 * vinho do Mania com a estampa dourada.
 *
 * O PANO SEGUE O CABELO, não o crânio: o raio em cada altura é o de
 * `m.cabelo` (o cacheado do Ari vai a 1,5·headR, os cachos do Renan a 1,3), e
 * a beira desce pouco na frente (fica acima da sobrancelha), passa por cima da
 * orelha e desce mais atrás, na nuca, onde mora o nó.
 *
 * REFERENCIAL: a cabeça, y = 0 no centro do crânio, olhando para `+Z`.
 */
function bandanaDeChurrasqueiro(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const COLUNAS = 48;
  const LINHAS = 14;
  // até onde o pano desce, pelo ângulo `fi` em volta da cabeça (0 = frente)
  const ateOnde = (fi: number): number => 0.98 + 0.7 * (0.5 - 0.5 * Math.cos(fi));
  // a distância do centro até o pano, pelo ângulo `te` a partir do alto
  const raio = (te: number): number => Math.max(m.cabelo(Math.min(te, 1.5)), r * 1.02) * 1.035 + r * 0.012;
  const ponto = (fi: number, te: number): THREE.Vector3 => {
    const R = raio(te);
    return new THREE.Vector3(Math.sin(te) * Math.sin(fi) * R, Math.cos(te) * R, Math.sin(te) * Math.cos(fi) * R);
  };
  const pos: number[] = [];
  const uv: number[] = [];
  for (let i = 0; i <= COLUNAS; i++) {
    const fi = -Math.PI + (i / COLUNAS) * Math.PI * 2;
    for (let j = 0; j <= LINHAS; j++) {
      const t = j / LINHAS;
      const p = ponto(fi, t * ateOnde(fi));
      pos.push(p.x, p.y, p.z);
      uv.push((i / COLUNAS) * 3, 1 - t);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < COLUNAS; i++) {
    for (let j = 0; j < LINHAS; j++) {
      const a = i * (LINHAS + 1) + j;
      const b = (i + 1) * (LINHAS + 1) + j;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, toon(0xffffff, { mapa: texturaDaBandana(), doubleSide: true })));

  // A BAINHA: a beira enrolada, um tom abaixo do pano
  const bainha = toon(P.bandanaChurrascoBainha);
  const beira: THREE.Vector3[] = [];
  for (let i = 0; i < 48; i++) {
    const fi = -Math.PI + (i / 48) * Math.PI * 2;
    beira.push(ponto(fi, ateOnde(fi)));
  }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beira, true), 96, r * 0.022, 6, true), bainha));

  // O NÓ na nuca, e as duas pontas caindo para trás e para fora
  const pano = toon(P.bandanaChurrasco, { doubleSide: true });
  const no = ponto(Math.PI, ateOnde(Math.PI) - 0.08);
  no.multiplyScalar(1.03);
  for (const s of [-1, 1] as const) {
    const bolota = new THREE.Mesh(new THREE.SphereGeometry(r * 0.14, 12, 8), pano);
    bolota.scale.set(1, 0.8, 0.7);
    bolota.position.set(no.x + s * r * 0.1, no.y, no.z);
    g.add(bolota);
    const pivo = new THREE.Group();
    pivo.position.set(no.x + s * r * 0.05, no.y - r * 0.04, no.z);
    // `rotation.x` positivo leva o `-Y` (para onde a ponta cai) para o `-Z`: para trás
    pivo.rotation.set(0.45, 0, -s * 0.32);
    const forma = new THREE.Shape();
    forma.moveTo(-r * 0.12, 0);
    forma.lineTo(r * 0.12, 0);
    forma.lineTo(r * 0.15, -r * 0.62);
    forma.lineTo(0, -r * 0.8);
    forma.lineTo(-r * 0.15, -r * 0.62);
    forma.closePath();
    const ponta = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: r * 0.02, bevelEnabled: false }), pano);
    pivo.add(ponta);
    g.add(pivo);
  }
  return fundir(g);
}

// ------------------------------------------ o prêmio do turno 6

/**
 * O BORDADO DO PEITO do dólmã: "Mania" em preto com a chama dourada, no
 * molde do bordado do avental. Um decalque pequeno, desenhado uma vez.
 */
let bordadoDoDolma: THREE.CanvasTexture | null = null;
function texturaDoBordadoDoDolma(): THREE.CanvasTexture {
  if (bordadoDoDolma) return bordadoDoDolma;
  const W = 256;
  const H = 96;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = css(P.dolmaBranco);
    ctx.fillRect(0, 0, W, H);
    // a chama dourada
    ctx.fillStyle = css(P.aventalGarcomBordado);
    ctx.beginPath();
    ctx.moveTo(34, 78);
    ctx.bezierCurveTo(12, 70, 14, 40, 34, 16);
    ctx.bezierCurveTo(36, 34, 52, 40, 50, 60);
    ctx.bezierCurveTo(50, 70, 44, 78, 34, 78);
    ctx.fill();
    ctx.fillStyle = css(P.dolmaVivo);
    ctx.font = 'bold 50px ui-rounded, "Nunito", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('Mania', 62, 50);
  }
  bordadoDoDolma = new THREE.CanvasTexture(canvas);
  bordadoDoDolma.colorSpace = THREE.SRGBColorSpace;
  return bordadoDoDolma;
}

/**
 * O DÓLMÃ DE COZINHEIRO — metade do prêmio do turno 6 (a outra é o chapéu).
 * O branco de chef: a `cor` e a `corDetalhe` da ficha pintam o corpo e as
 * mangas do rig, e a geometria é o que faz um dólmã ser dólmã:
 *
 * - o TRANSPASSE: a frente da esquerda cruza por cima da direita (um painel
 *   do `corpete`, um fio por fora), com o vivo preto na beira;
 * - as DUAS FILEIRAS de botões de pano preto, quatro de cada lado;
 * - a GOLA PADRE em pé, com o vivo preto em cima;
 * - e o "Mania" bordado no peito, com a chama dourada.
 *
 * REFERENCIAL: o tronco, y = 0 no CHÃO.
 */
function dolmaDeCozinheiro(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const quadril = m.legH;
  const r = h * 0.105 * w;
  const yGola = quadril + m.torsoH * 0.77 + r * 0.55;
  const baixo = quadril + m.torsoH * 0.04;
  // o transpasse: da costura do lado esquerdo até a beira, um pouco à direita do meio
  const BEIRA = 0.36;
  const LADO = -1.45;
  const branco = toon(P.dolmaBranco, { doubleSide: true });
  const preto = toon(P.dolmaVivo);
  const painel = (a: number): number => (a > LADO && a < BEIRA ? yGola - h * 0.006 : baixo + h * 0.002);
  g.add(new THREE.Mesh(corpete(m, { decote: painel, baixo, folga: 1.055, colunas: 96, linhas: 18 }), branco));
  // O VIVO PRETO na beira do transpasse, de cima a baixo, e na barra dele
  const beira: Array<[number, number]> = [];
  for (let k = 0; k <= 10; k++) beira.push([BEIRA - 0.012, THREE.MathUtils.lerp(yGola - h * 0.008, baixo + h * 0.004, k / 10)]);
  g.add(new THREE.Mesh(vivoNaPele(m, beira, h * 0.003, 1.065), preto));
  const barra: Array<[number, number]> = [];
  for (let k = 0; k <= 12; k++) barra.push([THREE.MathUtils.lerp(LADO + 0.05, BEIRA - 0.012, k / 12), baixo + h * 0.004]);
  g.add(new THREE.Mesh(vivoNaPele(m, barra, h * 0.003, 1.065), preto));

  // AS DUAS FILEIRAS DE BOTÕES de pano: a de fora no painel, a de dentro do outro lado
  const yBotao = (k: number): number => yGola - h * 0.04 - k * h * 0.045;
  for (const a of [BEIRA - 0.13, -0.48] as const) {
    for (let k = 0; k < 4; k++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0062, 10, 6), preto);
      b.position.copy(naPele(m, a, yBotao(k), a > LADO && a < BEIRA ? 1.075 : 1.06));
      b.scale.set(1, 1, 0.6);
      b.lookAt(b.position.clone().multiplyScalar(2).setY(b.position.y));
      g.add(b);
    }
  }

  // A GOLA PADRE: uma faixa em pé, um tico mais aberta em cima, com o vivo preto
  const rGola = r * 0.62;
  const gola = new THREE.Mesh(torneada([[rGola, 0], [rGola * 1.04, h * 0.032]], 0, () => 0, 36), branco);
  gola.position.y = yGola - h * 0.012;
  gola.scale.z = 0.92;
  g.add(gola);
  const vivoDaGola = new THREE.Mesh(new THREE.TorusGeometry(rGola * 1.045, h * 0.0028, 6, 36), preto);
  vivoDaGola.rotation.x = Math.PI / 2;
  vivoDaGola.position.y = yGola - h * 0.012 + h * 0.032;
  vivoDaGola.scale.y = 0.92;
  g.add(vivoDaGola);

  // O BORDADO no peito do lado de fora do transpasse (o esquerdo de quem veste)
  const yPeito = quadril + m.torsoH * 0.6;
  const largura = h * 0.07;
  const bordado = new THREE.PlaneGeometry(largura, largura * 0.375, 8, 2);
  bordado.translate(-r * 0.62, yPeito, h * 0.002);
  g.add(new THREE.Mesh(noTronco(bordado, m, 1.062), toon(0xffffff, { mapa: texturaDoBordadoDoDolma() })));
  return fundir(g);
}

/**
 * O CHAPÉU DE COZINHEIRO — a outra metade do prêmio do turno 6. O toque
 * branco alto: a faixa lisa embaixo, com o vivo preto, e o pano PREGUEADO que
 * estufa em cogumelo em cima. As pregas são o `gomos` do torno (o mesmo
 * franzido das saias da boutique), mais fundas no alto, onde o pano estufa.
 *
 * A faixa pousa POR CIMA DO CABELO (`alturaDaAba`, a conta dos chapéus da
 * boutique) — no cacheado do Ari ela sobe, e o chapéu continua inteiro.
 *
 * REFERENCIAL: a cabeça, y = 0 no centro do crânio.
 */
function chapeuDeCozinheiro(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const RC = r * 0.9;
  const base = alturaDaAba(m, RC) - r * 0.06;
  const branco = toon(P.dolmaBranco, { doubleSide: true });
  const chapeu = new THREE.Group();
  chapeu.rotation.set(-0.06, 0, 0.05);
  g.add(chapeu);
  // a faixa lisa
  const faixa = torneada([[RC, 0], [RC * 1.01, r * 0.34]], 0, () => 0, 40);
  faixa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(faixa, branco));
  const vivo = new THREE.Mesh(new THREE.TorusGeometry(RC * 1.012, r * 0.022, 6, 40), toon(P.dolmaVivo));
  vivo.rotation.x = Math.PI / 2;
  vivo.position.y = base + r * 0.3;
  chapeu.add(vivo);
  // o pano pregueado, estufando em cogumelo
  const copa = torneada([
    [RC * 0.97, r * 0.3], [RC * 1.12, r * 0.6], [RC * 1.26, r * 0.92], [RC * 1.32, r * 1.08],
    [RC * 1.24, r * 1.22], [RC * 0.9, r * 1.33], [RC * 0.45, r * 1.38], [0.0001, r * 1.39],
  ], 12, (t) => r * 0.1 * Math.min(1, t * 1.6) * (1 - Math.max(0, t - 0.7) * 3), 96);
  copa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(copa, branco));
  return fundir(g);
}

export {
  aventalDeGarcom, tenisDeGarcom, lapisNaOrelha, bloquinhoNaMao, coleteDeGarcom,
  bandanaDeChurrasqueiro, dolmaDeCozinheiro, chapeuDeCozinheiro,
};
