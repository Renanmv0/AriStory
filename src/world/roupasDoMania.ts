import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { fundir } from './fundir';
import { montarTenis, raioDoTronco } from './uniformeDosGatitos';
import { cintaNaPele, corpete, evase, lacoDeFita, naPele, noTronco, saiaViva, vivoNaPele } from './roupasDaBoutique';
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
 * REFERENCIAL: o tronco, y = 0 no CHÃO.
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
  const saia = saiaViva(m, {
    yTopo: cintura + h * 0.004,
    yBarra: quadril * 0.36,
    raio: evase(r0, r0 * 1.42, 4, h * 0.003, 0.9),
    arco: [-ARCO, ARCO],
    colunas: COLUNAS,
    linhas: LINHAS,
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
  g.add(new THREE.Mesh(cintaNaPele(m, yFita, h * 0.009, 1.1), fita));
  const laco = lacoDeFita(h * 0.022, fita, 2.4);
  // nas costas e virado para fora (o laço olha para `+Z`)
  laco.position.copy(naPele(m, Math.PI, yFita, 1.13));
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

export { aventalDeGarcom, tenisDeGarcom, lapisNaOrelha, bloquinhoNaMao, coleteDeGarcom };
