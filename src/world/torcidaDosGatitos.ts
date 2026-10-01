import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { colar, corpo } from './roupasDoJardim';
import { emblemaDosGatitos, estrela, raioDoTronco, textoEmArco } from './uniformeDosGatitos';

/**
 * A ROUPA DE CHEERLEADER DOS GATITOS — o prêmio da festa do fim do Módulo 1:
 * depois da dança no ginásio, as três coelhinhas dão à dupla "a roupa das
 * cheerleaders", do MESMO MODELO da delas (pedido do Renan: "extremamente
 * detalhado e fofo").
 *
 * O uniforme das coelhinhas (`entities/bichos/CoelhaDaTorcida.ts`) é: o top
 * azul com o círculo amarelo e o "G" no peito, a saia azul com a barra
 * amarela, os pompons de bolotas amarelas e azuis, e um laço. Aqui ele vira
 * quatro peças, uma por vaga:
 *
 * - **o uniforme** (`tronco`): o top sem manga, com o decote em V de vivo
 *   amarelo e branco, o círculo do G, as faixas dos lados e o laçinho no V, e
 *   a SAIA PREGUEADA — gomos azuis com o fundo das pregas amarelo, que abrem
 *   para baixo — com o cós e as duas listras da barra;
 * - **o shortinho e o meião** (`pernas`): o shortinho azul de baixo da saia (o
 *   calção do rig, como as bermudas) e o meião branco até o joelho, com a
 *   dobra e as listras azul e amarela;
 * - **o laço de torcida** (`acessorio`, na cabeça): o laçarote amarelo de
 *   cheerleader, com o vivo branco e o nó azul, pousado no cabelo;
 * - **os pompons** (`maos`): um em cada mão, de bolotas amarelas e azuis,
 *   igualzinhos aos delas.
 *
 * O referencial de cada vaga é o de sempre (skill `aristory-roupa`): tronco
 * com y = 0 no CHÃO, pernas e mãos no pivô de cada membro, a cabeça no centro
 * do crânio.
 */

const AZUL = P.gatitosAzul;
const MARINHO = P.gatitosAzulEscuro;
const AMARELO = P.gatitosAmarelo;
const BRANCO = P.gatitosBranco;

// ============================================================== o uniforme

/** um ponto na FRENTE da cápsula do tronco (ou nas costas), em `x` para o lado e altura `y` */
function naFrente(m: MedidasCorpo, x: number, y: number, folga = 1.02, costas = false): THREE.Vector3 {
  const R = raioDoTronco(m, y);
  const z = Math.sqrt(Math.max(0, R * R - x * x)) * corpo(m).ACHATA * folga;
  return new THREE.Vector3(x, y, costas ? -z : z);
}

/** um vivo (cordão de acabamento) passando por pontos, um tubo fino */
function vivo(pontos: THREE.Vector3[], grossura: number, cor: number): THREE.Mesh {
  const curva = new THREE.CatmullRomCurve3(pontos);
  return new THREE.Mesh(new THREE.TubeGeometry(curva, 24, grossura, 6, false), toon(cor));
}

/** o laçinho do decote: duas abas, as pontas caindo e o nó */
function lacinho(e: number, cor: number, no: number): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  for (const lado of [-1, 1] as const) {
    const aba = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mat);
    aba.scale.set(e * 1.05, e * 0.62, e * 0.32);
    aba.position.x = lado * e * 0.95;
    aba.rotation.z = lado * 0.22;
    g.add(aba);
    const ponta = new THREE.Mesh(new THREE.BoxGeometry(e * 0.42, e * 1.2, e * 0.14), mat);
    ponta.position.set(lado * e * 0.4, -e * 0.8, -e * 0.05);
    ponta.rotation.z = lado * 0.35;
    g.add(ponta);
  }
  const n = new THREE.Mesh(new THREE.SphereGeometry(e * 0.36, 10, 8), toon(no));
  n.scale.z = 0.7;
  n.position.z = e * 0.12;
  g.add(n);
  return g;
}

/**
 * A SAIA PREGUEADA, como malha própria: N gomos azuis em volta, e entre um e
 * outro o FUNDO DA PREGA, amarelo, um degrau para dentro. Em cima as pregas
 * fecham (o azul dá a volta inteira, colado no cós); embaixo elas abrem, e o
 * amarelo aparece — é a saia de torcida de verdade, e não um cone.
 *
 * Cada gomo azul tem a beirada da direita um tico para dentro da da esquerda:
 * é o serrilhado que a luz pega, e que faz ler "prega" de longe.
 */
function saiaPregueada(
  yTopo: number, yBarra: number, rTopo: number, rBarra: number, achata: number, n: number,
): THREE.Group {
  const g = new THREE.Group();
  const passo = (Math.PI * 2) / n;
  const azul: number[] = [];
  const amarelo: number[] = [];
  const ponto = (a: number, r: number, y: number): [number, number, number] => [Math.sin(a) * r, y, Math.cos(a) * r * achata];
  const quad = (lista: number[], p: Array<[number, number, number]>): void => {
    // dois triângulos: 0-1-2 e 0-2-3
    lista.push(...p[0], ...p[1], ...p[2], ...p[0], ...p[2], ...p[3]);
  };
  const FAIXAS = 5;
  for (let k = 0; k < n; k++) {
    const meio = k * passo;
    for (let f = 0; f < FAIXAS; f++) {
      const t0 = f / FAIXAS;
      const t1 = (f + 1) / FAIXAS;
      const y0 = THREE.MathUtils.lerp(yTopo, yBarra, t0);
      const y1 = THREE.MathUtils.lerp(yTopo, yBarra, t1);
      const r0 = THREE.MathUtils.lerp(rTopo, rBarra, t0);
      const r1 = THREE.MathUtils.lerp(rTopo, rBarra, t1);
      // o gomo azul: inteiro em cima, 70% embaixo (a prega abre)
      const meiaLarg = (t: number): number => passo * 0.5 * THREE.MathUtils.lerp(1.02, 0.7, t);
      const serra = 0.975;
      quad(azul, [
        ponto(meio - meiaLarg(t0), r0, y0),
        ponto(meio - meiaLarg(t1), r1, y1),
        ponto(meio + meiaLarg(t1), r1 * serra, y1),
        ponto(meio + meiaLarg(t0), r0 * serra, y0),
      ]);
      // o fundo amarelo da prega, entre este gomo e o próximo, recuado
      const fundo = meio + passo / 2;
      const meiaFundo = (t: number): number => passo * 0.5 * THREE.MathUtils.lerp(0.02, 0.34, t);
      quad(amarelo, [
        ponto(fundo - meiaFundo(t0), r0 * 0.955, y0),
        ponto(fundo - meiaFundo(t1), r1 * 0.955, y1),
        ponto(fundo + meiaFundo(t1), r1 * 0.955, y1),
        ponto(fundo + meiaFundo(t0), r0 * 0.955, y0),
      ]);
    }
  }
  for (const [lista, cor] of [[azul, AZUL], [amarelo, AMARELO]] as const) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(lista, 3));
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, toon(cor, { doubleSide: true })));
  }
  return g;
}

/**
 * O UNIFORME DE CHEERLEADER: o top pinta o tronco do rig de azul (a `cor`
 * da ficha), com o braço nu (`bracosNus`) e a perna nua (`pernasNuas`); esta
 * função põe o resto — o decote em V, o círculo do G, as faixas dos lados, as
 * cavas, o laçinho, e a saia inteira com o cós.
 */
function uniformeDeTorcida(m: MedidasCorpo, _lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpo(m);
  const r = c.raioTorso;
  const hipY = m.legH;
  const ombroY = hipY + m.torsoH * 0.86;

  // ---- O DECOTE EM V: o vivo amarelo de fora, o branco por dentro, e outro
  // amarelo — as três linhas de uniforme de torcida, descendo dos ombros até
  // o meio do peito
  const yOmbro = hipY + m.torsoH * 0.86;
  const yPonta = hipY + m.torsoH * 0.6;
  for (const [recuo, grossura, cor] of [[0, 0.0062, AMARELO], [0.017, 0.0038, BRANCO], [0.03, 0.0048, AMARELO]] as const) {
    const pontos: THREE.Vector3[] = [];
    const xOmbro = r * 0.62 - h * recuo * 0.8;
    const yBaixo = yPonta + h * recuo;
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      // de um ombro à ponta e da ponta ao outro ombro
      const lado = u < 0.5 ? -1 : 1;
      const v = u < 0.5 ? 1 - u * 2 : (u - 0.5) * 2;
      const x = lado * xOmbro * v;
      const y = yBaixo + (yOmbro - yBaixo) * v;
      pontos.push(naFrente(m, x, y, 1.025));
    }
    g.add(vivo(pontos, h * grossura, cor));
  }
  // o laçinho amarelo na ponta do V, com o nó azul
  const laco = lacinho(h * 0.011, AMARELO, MARINHO);
  const pLaco = naFrente(m, 0, yPonta - h * 0.004, 1.06);
  colar(laco, g, pLaco.x, pLaco.y, pLaco.z, 0, 0, 1);

  // ---- O CÍRCULO DO G: o emblema das coelhinhas (sem as orelhinhas do time)
  const pG = naFrente(m, 0, hipY + m.torsoH * 0.42, 1.0);
  colar(emblemaDosGatitos(h * 0.023, AMARELO, AZUL, false), g, pG.x, pG.y, pG.z, 0, 0, 1);

  // ---- AS COSTAS: o mesmo vivo triplo, num U raso de ombro a ombro, o
  // "GATITOS" em arco (amarelo com a borda branca, letra de time) e as três
  // estrelinhas — abaixo do cabelo, que no Ari desce até o meio das costas
  for (const [recuo, grossura, cor] of [[0, 0.0062, AMARELO], [0.017, 0.0038, BRANCO], [0.03, 0.0048, AMARELO]] as const) {
    const pontos: THREE.Vector3[] = [];
    const xOmbro = r * 0.62 - h * recuo * 0.8;
    const fundo = m.torsoH * 0.09 + h * recuo * 0.6;
    for (let i = 0; i <= 8; i++) {
      const v = i / 8 * 2 - 1;
      pontos.push(naFrente(m, v * xOmbro, yOmbro - fundo * (1 - v * v), 1.025, true));
    }
    g.add(vivo(pontos, h * grossura, cor));
  }
  const yNasCostas = hipY + m.torsoH * 0.5;
  textoEmArco(g, 'GATITOS', {
    raio: raioDoTronco(m, yNasCostas) * 1.014, achata: c.ACHATA, y: yNasCostas, costas: true,
    passo: 0.15, curva: h * 0.0011, inclina: 0.055, alto: h * 0.022, cor: AMARELO, contorno: BRANCO,
  });
  const yEstrelas = yNasCostas - h * 0.03;
  for (const k of [-1, 0, 1]) {
    const ang = Math.PI + k * 0.24;
    const rr = raioDoTronco(m, yEstrelas) * 1.012;
    colar(estrela(h * 0.0075, BRANCO), g, Math.sin(ang) * rr, yEstrelas - Math.abs(k) * h * 0.003, Math.cos(ang) * rr * c.ACHATA,
      Math.sin(ang), 0, Math.cos(ang) / c.ACHATA);
  }

  // ---- AS FAIXAS DOS LADOS: amarela com os dois vivos brancos, da cava ao cós
  for (const lado of [-1, 1] as const) {
    const yCima = hipY + m.torsoH * 0.72;
    const yBaixo = hipY + m.torsoH * 0.26;
    const yMeio = (yCima + yBaixo) / 2;
    const faixa = new THREE.Group();
    for (const [z, larg, cor] of [[0, 0.012, AMARELO], [-0.0085, 0.0026, BRANCO], [0.0085, 0.0026, BRANCO]] as const) {
      const tira = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, yCima - yBaixo, h * larg), toon(cor));
      tira.position.z = h * z;
      faixa.add(tira);
    }
    faixa.position.set(lado * raioDoTronco(m, yMeio) * 1.012, yMeio, 0);
    g.add(faixa);
  }

  // ---- AS CAVAS: o vivo amarelo em volta da raiz do braço, que sai nu
  for (const lado of [-1, 1] as const) {
    const cava = new THREE.Mesh(new THREE.TorusGeometry(h * 0.047 * w, h * 0.0055, 6, 22), toon(AMARELO));
    cava.rotation.y = Math.PI / 2;
    cava.scale.set(1, 1.15, 0.9);
    cava.position.set(lado * h * 0.096 * w, ombroY - h * 0.012, 0);
    g.add(cava);
  }

  // ---- A SAIA: o cós amarelo com o filete branco, e as pregas
  /*
   * O CÓS cobre o calção do rig (o shortinho de baixo, `0,118·h·w` de raio,
   * até `legH + 0,064·h`): mais estreito ou mais baixo que isso, o shortinho
   * vazava por cima da saia.
   */
  const ACHATA = 0.86;
  const yCosCima = hipY + h * 0.078;
  const yCosBaixo = hipY + h * 0.054;
  const rCos = Math.max(r * 1.17, h * 0.122 * w);
  const cos = new THREE.Mesh(new THREE.CylinderGeometry(rCos, rCos * 1.01, yCosCima - yCosBaixo, 28, 1, true), toon(AMARELO, { doubleSide: true }));
  cos.position.y = (yCosCima + yCosBaixo) / 2;
  cos.scale.z = ACHATA;
  g.add(cos);
  // a tampa do cós: fecha o vão entre o tronco e o cós por cima
  const tampa = new THREE.Mesh(new THREE.RingGeometry(raioDoTronco(m, yCosCima) * 0.95, rCos, 28), toon(AZUL, { doubleSide: true }));
  tampa.rotation.x = -Math.PI / 2;
  tampa.scale.y = ACHATA;
  tampa.position.y = yCosCima;
  g.add(tampa);
  const filete = new THREE.Mesh(new THREE.CylinderGeometry(rCos * 1.012, rCos * 1.014, h * 0.004, 28, 1, true), toon(BRANCO, { doubleSide: true }));
  filete.position.y = yCosBaixo + h * 0.004;
  filete.scale.z = ACHATA;
  g.add(filete);

  const yTopo = yCosBaixo + h * 0.002;
  const yBarra = hipY - h * 0.1;
  const rTopo = rCos * 1.0;
  const rBarra = r * 1.7;
  g.add(saiaPregueada(yTopo, yBarra, rTopo, rBarra, ACHATA, 18));
  // as duas listras da barra: a branca e, rente à beirada, a amarela
  const raioEm = (y: number): number => THREE.MathUtils.lerp(rTopo, rBarra, (yTopo - y) / (yTopo - yBarra));
  for (const [y, alto, cor] of [[yBarra + h * 0.024, h * 0.006, BRANCO], [yBarra + h * 0.007, h * 0.01, AMARELO]] as const) {
    const listra = new THREE.Mesh(new THREE.CylinderGeometry(raioEm(y + alto / 2) * 1.012, raioEm(y - alto / 2) * 1.012, alto, 36, 1, true), toon(cor, { doubleSide: true }));
    listra.position.y = y;
    listra.scale.z = ACHATA;
    g.add(listra);
  }
  // o "G" pequenininho na barra, do lado esquerdo da frente — o detalhe que
  // só quem chega perto vê
  const aG = -0.55;
  const yG = yBarra + h * 0.045;
  const rG = raioEm(yG) * 1.015;
  colar(emblemaDosGatitos(h * 0.011, AMARELO, AZUL, false), g, Math.sin(aG) * rG, yG, Math.cos(aG) * rG * ACHATA, Math.sin(aG), 0.35, Math.cos(aG));
  return g;
}

// ======================================================= o shortinho e o meião

/**
 * O MEIÃO, no pivô de cada perna: o tubo branco do joelho ao tornozelo (um
 * tico mais largo que a perna), a dobra de cima, as duas listras — azul e
 * amarela — logo abaixo da dobra, e o círculo do G pequeno do lado de fora.
 *
 * O shortinho de baixo da saia é o calção do rig: a ficha só declara a cor
 * dele (`corBanho`, sem `cor`), como as bermudas — e com isso a perna sai de
 * pele, que é o que o meião precisa.
 */
function meiaoDeTorcida(m: MedidasCorpo, lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const legH = m.legH;
  const TOPO = -legH * 0.5;
  const FIM = -legH * 0.86;
  const raio = h * 0.0455 * w;
  const branco = toon(BRANCO);
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio * 0.96, TOPO - FIM, 18), branco);
  tubo.position.y = (TOPO + FIM) / 2;
  g.add(tubo);
  // a dobra: um anel mais gordo no alto, com a costura por baixo
  const dobra = new THREE.Mesh(new THREE.CylinderGeometry(raio * 1.1, raio * 1.1, h * 0.022, 18), branco);
  dobra.position.y = TOPO - h * 0.006;
  g.add(dobra);
  const costura = new THREE.Mesh(new THREE.TorusGeometry(raio * 1.1, h * 0.0016, 4, 22), toon(P.gatitosCreme));
  costura.rotation.x = Math.PI / 2;
  costura.position.y = TOPO - h * 0.017;
  g.add(costura);
  // as listras: azul e amarela
  for (const [y, cor] of [[TOPO - h * 0.03, AZUL], [TOPO - h * 0.042, AMARELO]] as const) {
    const listra = new THREE.Mesh(new THREE.CylinderGeometry(raio * 1.012, raio * 1.012, h * 0.008, 18, 1, true), toon(cor, { doubleSide: true }));
    listra.position.y = y;
    g.add(listra);
  }
  // o G do lado de fora, no meio da canela
  colar(emblemaDosGatitos(h * 0.009, AMARELO, AZUL, false), g, lado * raio * 1.02, TOPO - h * 0.075, 0, lado, 0, 0);
  return g;
}

// ========================================================== o laço de torcida

/**
 * O LAÇO DE TORCIDA: o laçarote das cheerleaders, maior que qualquer laço de
 * roupa — duas abas amarelas grandes com o vivo branco em volta, o nó azul e
 * as duas pontas compridas, cada uma com o corte em V.
 *
 * ONDE ELE MORA: no COCURUTO, um tico para trás e para a direita de quem
 * veste (a esquerda é da presilha de estrela da Ari). As abas correm para os
 * LADOS, tangentes à cabeça — pousado pelo `noCabelo`, que aponta o enfeite
 * para fora, as abas ficavam uma enterrada no cabelo e a outra espetada, e de
 * lado o laço parecia uma folha só. Aqui ele deita para trás (a cara olhando
 * para cima e para a frente, como a câmera vê) e as pontas descem pela nuca.
 */
function lacoDeTorcida(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const r = m.headR;
  const g = new THREE.Group();
  const amarelo = toon(peca?.cor ?? AMARELO);
  const branco = toon(BRANCO);
  const vincado = toon(new THREE.Color(peca?.cor ?? AMARELO).multiplyScalar(0.8).getHex());
  for (const lado of [-1, 1] as const) {
    // a aba: uma gota achatada, mais gorda na ponta de fora
    const aba = new THREE.Group();
    const corpoDaAba = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), amarelo);
    corpoDaAba.scale.set(r * 0.36, r * 0.25, r * 0.12);
    aba.add(corpoDaAba);
    // o vivo branco em volta da aba
    const borda = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 5, 26), branco);
    borda.scale.set(r * 0.36, r * 0.25, r * 0.6);
    aba.add(borda);
    // as duas dobras do pano, do nó para a ponta, de cada lado da aba
    for (const y of [-1, 1]) {
      const vinco = new THREE.Mesh(new THREE.BoxGeometry(r * 0.3, r * 0.018, r * 0.02), vincado);
      vinco.position.set(-lado * r * 0.04, y * r * 0.07, r * 0.11);
      vinco.rotation.z = -lado * y * 0.22;
      aba.add(vinco);
    }
    aba.position.x = lado * r * 0.34;
    aba.rotation.z = lado * 0.22;
    g.add(aba);
    // a ponta comprida, com o corte em V embaixo; dobra para trás, e desce pela nuca
    const forma = new THREE.Shape();
    forma.moveTo(-r * 0.07, 0);
    forma.lineTo(r * 0.07, 0);
    forma.lineTo(r * 0.09, -r * 0.4);
    forma.lineTo(0, -r * 0.33);
    forma.lineTo(-r * 0.09, -r * 0.4);
    forma.closePath();
    const ponta = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: r * 0.03, bevelEnabled: false }), toon(peca?.cor ?? AMARELO, { doubleSide: true }));
    ponta.position.set(lado * r * 0.07, -r * 0.04, -r * 0.05);
    ponta.rotation.set(0.75, 0, lado * 0.42);
    g.add(ponta);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(r * 0.12, 12, 10), toon(peca?.corDetalhe ?? AZUL));
  no.scale.set(1, 1.2, 0.8);
  no.position.z = r * 0.03;
  g.add(no);
  // o brilhinho branco no nó
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(r * 0.03, 8, 6), branco);
  brilho.position.set(-r * 0.035, r * 0.05, r * 0.12);
  g.add(brilho);

  // no cocuruto: a 0,2 rad do alto para a direita, no contorno do cabelo
  const a = 0.2;
  const R = m.cabelo(a);
  const pouso = new THREE.Group();
  pouso.position.set(Math.sin(a) * R * 1.0, Math.cos(a) * R * 1.0, -r * 0.1);
  /*
   * Deita para trás 0,6 rad: a cara olha para a frente e um tanto para cima —
   * de frente para a câmera do jogo (que olha de 35° para baixo) e ainda
   * inteira no boneco do guarda-roupa, que é visto na altura dos olhos. Mais
   * deitado (0,95) ele virava um risco no boneco.
   */
  pouso.rotation.set(-0.6, 0, -a, 'YXZ');
  pouso.add(g);
  return pouso;
}

// ================================================================= os pompons

/**
 * O POMPOM, em cada mão: o mesmo das coelhinhas — um miolo amarelo e bolotas
 * espalhadas pela superfície em espiral de Fibonacci (sem sorteio, para a
 * foto não mudar), alternando amarelo e azul —, na escala da mão de gente, e
 * com umas fitinhas mais compridas saindo para dar o volume de franja.
 *
 * REFERENCIAL: o pivô do braço, y = 0 no ombro; a mão fica a `0,92·armLen`.
 * O pompom fica um tico para fora e para a frente, com a mão dentro dele.
 */
function pomponsDeTorcida(m: MedidasCorpo, lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const amarelo = toon(P.lunaPomponAmarelo);
  const azul = toon(P.lunaPomponAzul);
  const R = h * 0.05;
  const pompom = new THREE.Group();
  pompom.position.set(lado * h * 0.012, -m.armLen * 0.96, h * 0.01);
  g.add(pompom);
  pompom.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.9, 12, 10), amarelo));
  const N = 34;
  const ouro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const raio = Math.sqrt(1 - y * y);
    const a = i * ouro;
    const bolota = new THREE.Mesh(new THREE.SphereGeometry(R * 0.42, 8, 6), i % 2 ? azul : amarelo);
    bolota.position.set(Math.cos(a) * raio * R, y * R, Math.sin(a) * raio * R);
    pompom.add(bolota);
  }
  // as fitinhas: tirinhas compridas saindo para todo lado, de franja
  for (let i = 0; i < 18; i++) {
    const y = 1 - ((i + 0.5) / 18) * 2;
    const raio = Math.sqrt(1 - y * y);
    const a = i * ouro + 0.7;
    const dir = new THREE.Vector3(Math.cos(a) * raio, y, Math.sin(a) * raio);
    const fita = new THREE.Mesh(new THREE.BoxGeometry(R * 0.16, R * 0.62, R * 0.04), i % 2 ? amarelo : azul);
    fita.position.copy(dir.clone().multiplyScalar(R * 1.25));
    fita.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    pompom.add(fita);
  }
  // o cabinho, saindo de baixo da mão
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.006, h * 0.006, h * 0.03, 8), toon(MARINHO));
  cabo.position.set(lado * h * 0.004, -m.armLen * 0.92 + h * 0.012, 0);
  g.add(cabo);
  return g;
}

export { uniformeDeTorcida, meiaoDeTorcida, lacoDeTorcida, pomponsDeTorcida };
