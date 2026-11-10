import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { quina } from '../lojaDeRoupas';
import { frisbee, raquete } from '../props';
import { toalhaXadrez } from '../texturasDeCasa';
import { uvEmMetrosPorTriangulo } from '../acabamento';
import { emblemaDosGatitos } from '../uniformeDosGatitos';

/**
 * ============================== OS DETALHES DO BEBITO MOBILE (as referências)
 *
 * Cada enfeite do carro é uma lembrança de alguém ou de algum lugar do jogo
 * (a lista e a origem de cada um moram no catálogo, em `ficha.ts`). Aqui
 * mora o MODELO de cada um: uma função por id, que devolve a peça com a
 * origem NO ENCAIXE da vaga dela:
 *
 * | vaga          | a origem é                 | para onde olha (`+Z` da peça)        |
 * |---------------|----------------------------|--------------------------------------|
 * | `painel`      | o pé, em cima do painel    | para a cabine (quem vai no banco)    |
 * | `retrovisor`  | o nó, na haste do espelho  | para a cabine; pende para `−Y`       |
 * | `chave`       | o miolo da ignição         | para fora do painel (a cabine)       |
 * | `portaMalas`  | o tampão de trás           | para o vidro de trás                 |
 * | `bancoDeTras` | o assento                  | para a frente do carro               |
 * | `teto`        | o bagageiro                | para a frente do carro               |
 *
 * O QUE BALANÇA diz que balança: um grupo com NOME e `userData.balanca`
 * (`{ x?: [amplitude, velocidade], z?: [...] }`, em radianos e rad/s) oscila
 * em volta da pose em que nasceu — pouco com o carro parado, mais andando e
 * muito num solavanco. É a mesma ideia do look da Valentina. O carro acha
 * esses grupos sozinho (`BebitoMobile.update`).
 *
 * As peças são MAIORES que as de verdade (um chaveiro de 4 cm some ao lado
 * do corpo chibi): a régua é ler de longe, pela janela.
 *
 * Detalhe novo: uma entrada no catálogo da ficha e uma função aqui.
 */

export interface Balanca { x?: readonly [number, number]; z?: readonly [number, number] }

const esfera = (r: number, mat: THREE.Material, sx = 1, sy = 1, sz = 1, gomos = 12): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, gomos, Math.max(6, Math.round(gomos * 0.7))), mat);
  m.scale.set(sx, sy, sz);
  return m;
};

const por = <T extends THREE.Object3D>(pai: THREE.Object3D, o: T, x = 0, y = 0, z = 0): T => {
  o.position.set(x, y, z);
  pai.add(o);
  return o;
};

/** um grupo que balança (com nome: é fronteira da `fundir()`, e o que está dentro vira uma malha só lá dentro) */
function queBalanca(nome: string, balanca: Balanca): THREE.Group {
  const g = new THREE.Group();
  g.name = nome;
  g.userData.balanca = balanca;
  return g;
}

/** o cordãozinho de pendurar: da origem para baixo */
function cordao(comprimento: number): THREE.Mesh {
  const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, comprimento, 5), toon(P.bebitoCordao));
  fio.position.y = -comprimento / 2;
  return fio;
}

// ================================================================== o painel

/**
 * O JEAN-LUC DE PAINEL: o pato francês do lago, de boneco de mola — a cabeça
 * grande balançando em cima do corpinho. As peças são as dele no jogo
 * (`entities/bichos/JeanLuc.ts`): a BOINA azul-marinho tombada de lado, com o
 * rabinho de pano; a camisa de jogador CREME com a gola vermelha e a
 * bandeirinha tricolor no peito; o bico de espátula, o rabinho empinado, o pé
 * de pata grande — e a raquete na asa.
 */
function jeanLucDePainel(): THREE.Group {
  const g = new THREE.Group();
  const pena = toon(P.patoPena);
  const azul = toon(P.azulFranca);
  const bico = toon(P.patoBico);
  const vermelho = toon(P.vermelhoFranca);

  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.078, 0.018, 16), toon(P.bebitoCromo)), 0, 0.009, 0);
  // o corpinho de pato (a barriga para a frente) e a camisa creme por cima do peito
  por(g, esfera(1, pena, 0.068, 0.066, 0.072), 0, 0.074, 0);
  por(g, esfera(1, toon(P.camisaDoJeanLuc), 0.073, 0.05, 0.074), 0, 0.104, 0.004);
  // a gola vermelha em volta do pescoço e a bandeirinha no peito: azul, branco e vermelho, em pé
  const gola = por(g, new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 6, 14), vermelho), 0, 0.15, 0.004);
  gola.rotation.x = Math.PI / 2;
  [azul, toon(P.metalWhite), vermelho].forEach((mat, i) => {
    por(g, new THREE.Mesh(quina(0.012, 0.034, 0.008, 0.002), mat), (i - 1) * 0.012, 0.112, 0.074);
  });
  // o rabinho empinado, as duas asas e os pés de pata, grandes
  const rabo = por(g, new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.05, 7), pena), 0, 0.09, -0.07);
  rabo.rotation.x = -0.9;
  for (const lado of [-1, 1]) {
    por(g, esfera(1, pena, 0.016, 0.04, 0.046), lado * 0.071, 0.09, -0.004);
    por(g, esfera(1, bico, 0.028, 0.008, 0.036), lado * 0.032, 0.022, 0.046);
  }
  // a raquete na asa direita (a esquerda de quem olha de frente)
  const raquetinha = por(g, new THREE.Group(), -0.094, 0.1, 0.03);
  raquetinha.rotation.set(0, 0.5, 0.35);
  por(raquetinha, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.008, 12).rotateX(Math.PI / 2), toon(P.metalRed)), 0, 0.034, 0);
  por(raquetinha, new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.007, 0.04, 6), toon(P.woodDark)), 0, -0.012, 0);
  // a mola
  por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.034, 8), toon(P.bebitoMola)), 0, 0.166, 0.004);

  // a cabeça, grande, na ponta da mola
  const cabeca = por(g, queBalanca('cabeca-do-jean-luc', { x: [0.16, 7.3], z: [0.2, 5.9] }), 0, 0.178, 0.004);
  por(cabeca, esfera(0.075, pena, 1, 0.94, 0.96, 14), 0, 0.07, 0);
  // o bico chato e largo, com a mandíbula um degrau menor por baixo
  por(cabeca, esfera(1, bico, 0.052, 0.015, 0.05), 0, 0.054, 0.074);
  por(cabeca, esfera(1, toon(P.patoBicoEscuro), 0.04, 0.008, 0.038), 0, 0.042, 0.068);
  for (const lado of [-1, 1]) {
    por(cabeca, esfera(0.011, toon(P.bebitoBorracha), 1, 1.25, 0.6, 8), lado * 0.03, 0.09, 0.064);
    por(cabeca, esfera(0.013, toon(P.patoBochecha), 1, 0.7, 0.4, 8), lado * 0.05, 0.064, 0.052);
  }
  // a boina: a aba, a cúpula macia bem mais larga que a aba (é o que faz ler boina e não boné) e o rabinho
  const boina = por(cabeca, new THREE.Group(), 0.012, 0.13, -0.006);
  boina.rotation.set(-0.12, 0, 0.36);
  por(boina, new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.012, 14), azul));
  por(boina, esfera(1, azul, 0.088, 0.026, 0.088, 14), 0.008, 0.014, 0);
  por(boina, new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.022, 6), azul), 0.008, 0.046, 0);
  return g;
}

/**
 * O GIRASSOL DA JOSEFINA: um vasinho de barro com o laço rosa dela e um
 * girassol que dança (o da moeda da lojinha da estufa). A flor olha para
 * cima e para a cabine.
 */
function girassolDaJosefina(): THREE.Group {
  const g = new THREE.Group();
  const perfil = [[0.0001, 0], [0.046, 0], [0.06, 0.082], [0.068, 0.088], [0.068, 0.104], [0.057, 0.104], [0.055, 0.094], [0.0001, 0.094]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  por(g, new THREE.Mesh(new THREE.LatheGeometry(perfil, 14), toon(P.bebitoVasinho)));
  // o laço da Josefina, na frente do vaso
  const rosa = toon(P.bebitoLacoRosa);
  for (const lado of [-1, 1]) {
    const alca = por(g, esfera(1, rosa, 0.024, 0.016, 0.01, 8), lado * 0.022, 0.058, 0.057);
    alca.rotation.z = lado * 0.35;
  }
  por(g, esfera(0.009, rosa, 1, 1, 0.8, 8), 0, 0.058, 0.06);

  const verde = toon(P.bebitoFolha);
  const haste = por(g, queBalanca('haste-do-girassol', { z: [0.13, 3.1], x: [0.05, 2.3] }), 0, 0.094, 0);
  por(haste, new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.009, 0.15, 6), verde), 0, 0.075, 0);
  for (const lado of [-1, 1]) {
    const folha = por(haste, esfera(1, verde, 0.034, 0.006, 0.018, 8), lado * 0.034, 0.05 + (lado > 0 ? 0.03 : 0), 0);
    folha.rotation.z = lado * 0.55;
  }
  // a flor: o miolo, e as pétalas numa malha só
  const flor = por(haste, new THREE.Group(), 0, 0.158, 0.012);
  flor.rotation.x = 0.85;
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.girassolMiolo));
  miolo.scale.y = 0.45;
  flor.add(miolo);
  const petalas: THREE.BufferGeometry[] = [];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const p = new THREE.SphereGeometry(1, 6, 4);
    p.scale(0.014, 0.004, 0.03);
    p.translate(0, 0, 0.056);
    p.rotateX(-0.22);
    p.rotateY(a);
    petalas.push(p);
  }
  flor.add(new THREE.Mesh(mergeGeometries(petalas), toon(P.girassolPetala)));
  return g;
}

// ============================================================== o retrovisor

/** a estrela de cinco pontas (a da presilha do Ari), gordinha */
function geoEstrela(raio: number, grossura: number): THREE.BufferGeometry {
  const forma = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? raio : raio * 0.5;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) forma.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else forma.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  forma.closePath();
  const b = grossura * 0.3;
  const geo = new THREE.ExtrudeGeometry(forma, { depth: grossura - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2 });
  geo.translate(0, 0, -(grossura - 2 * b) / 2);
  return geo;
}

/** A ESTRELA DO ARI: a presilha de estrela do cabelo dele, pendurada num cordão */
function estrelaDoAri(): THREE.Group {
  const g = new THREE.Group();
  const pendente = por(g, queBalanca('pendente-da-estrela', { x: [0.2, 3.4], z: [0.1, 2.6] }));
  pendente.add(cordao(0.15));
  por(pendente, new THREE.Mesh(geoEstrela(0.062, 0.026), toon(P.estrelaDoAri)), 0, -0.2, 0);
  por(pendente, esfera(0.008, toon(P.bebitoCromo), 1, 1, 1, 6), 0, -0.146, 0);
  return g;
}

/** O POMPOM DOS GATITOS: o da torcida, amarelo e azul alternando (a mesma espiral do da Luna) */
function pompomDosGatitos(): THREE.Group {
  const g = new THREE.Group();
  const pendente = por(g, queBalanca('pendente-do-pompom', { x: [0.24, 2.9], z: [0.13, 3.7] }));
  pendente.add(cordao(0.24));
  const amarelo = toon(P.lunaPomponAmarelo);
  const azul = toon(P.lunaPomponAzul);
  const bola = por(pendente, new THREE.Group(), 0, -0.285, 0);
  bola.add(esfera(0.04, amarelo, 1, 1, 1, 8));
  const N = 16;
  const ouro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * ouro;
    por(bola, esfera(0.024, i % 2 ? azul : amarelo, 1, 1, 1, 6), Math.cos(a) * r * 0.044, y * 0.044, Math.sin(a) * r * 0.044);
  }
  return g;
}

// ==================================================================== a chave

/**
 * O CHAVEIRO DO PELUSA: a chave na ignição, a argola e a carinha do gato do
 * Ari pendurada — branco creme, a máscara e as orelhas cinza, o focinho rosa.
 */
function chaveiroDoPelusa(): THREE.Group {
  const g = new THREE.Group();
  const cromo = toon(P.bebitoCromo);
  // a chave: a haste entra no painel, a cabeça fica para fora
  const haste = por(g, new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.03, 6), cromo), 0, 0, 0.014);
  haste.rotation.x = Math.PI / 2;
  por(g, new THREE.Mesh(quina(0.034, 0.04, 0.008, 0.003), toon(P.bebitoBorracha)), 0, 0, 0.034);
  const pendente = por(g, queBalanca('pendente-do-chaveiro', { z: [0.3, 4.3], x: [0.12, 3.1] }), 0, -0.012, 0.036);
  const argola = por(pendente, new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.003, 5, 14), cromo), 0, -0.018, 0);
  argola.rotation.y = Math.PI / 2;
  por(pendente, new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 5), cromo), 0, -0.05, 0);

  const cabeca = por(pendente, new THREE.Group(), 0, -0.106, 0);
  const branco = toon(P.pelusaBranco);
  const cinza = toon(P.pelusaCinza);
  cabeca.add(esfera(0.05, branco, 1, 0.9, 0.86, 14));
  // a máscara cinza: a calota de cima, um fio maior que a cabeça
  const mascara = new THREE.Mesh(new THREE.SphereGeometry(0.0515, 14, 6, 0, Math.PI * 2, 0, Math.PI * 0.4), cinza);
  mascara.scale.set(1, 0.9, 0.86);
  mascara.rotation.x = -0.25;
  cabeca.add(mascara);
  for (const lado of [-1, 1]) {
    const orelha = por(cabeca, new THREE.Group(), lado * 0.03, 0.036, -0.004);
    orelha.rotation.z = -lado * 0.3;
    por(orelha, new THREE.Mesh(new THREE.ConeGeometry(0.019, 0.034, 6), cinza), 0, 0.012, 0);
    por(orelha, new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.022, 6), toon(P.pelusaOrelha)), 0, 0.009, 0.007);
    por(cabeca, esfera(0.007, toon(P.bebitoBorracha), 1, 1.2, 0.6, 6), lado * 0.019, 0.004, 0.04);
  }
  por(cabeca, esfera(0.02, branco, 1.1, 0.75, 0.7, 8), 0, -0.014, 0.034);
  por(cabeca, esfera(0.006, toon(P.pelusaFocinho), 1.2, 0.8, 0.7, 6), 0, -0.007, 0.047);
  return g;
}

// ================================================================ o porta-malas

/** O FRISBEE E AS RAQUETES: o disco de sábado e as duas raquetes da mesa do parque, largados no tampão */
function frisbeeERaquetes(): THREE.Group {
  const g = new THREE.Group();
  // as raquetes deitadas (a borracha para cima), cruzadas, e o frisbee encostado nelas
  const vermelha = raquete(P.metalRed);
  vermelha.rotation.set(-Math.PI / 2, 0.5, 0, 'YXZ');
  por(g, vermelha, -0.2, 0.022, -0.04);
  const azul = raquete(P.fabricBlue);
  azul.rotation.set(-Math.PI / 2, -0.75, 0, 'YXZ');
  por(g, azul, -0.02, 0.06, 0.03);
  const disco = frisbee();
  disco.rotation.set(0.42, 0.3, 0);
  por(g, disco, 0.33, 0.1, -0.02);
  // a bolinha de ping pong, que rolou para o canto
  por(g, esfera(0.03, toon(P.metalWhite), 1, 1, 1, 10), 0.08, 0.03, 0.2);
  return g;
}

// ================================================================ o banco de trás

/** um livro deitado: a capa, a faixa do título e o miolo de páginas aparecendo em três lados */
function livro(l: number, a: number, p: number, capa: number, faixa: number): THREE.Group {
  const g = new THREE.Group();
  por(g, new THREE.Mesh(quina(l, a, p, 0.008), toon(capa)), 0, a / 2, 0);
  por(g, new THREE.Mesh(quina(l - 0.012, a - 0.014, p - 0.004, 0.004), toon(P.livroMiolo)), 0.01, a / 2, 0);
  por(g, new THREE.Mesh(quina(l * 0.5, 0.004, p * 0.2, 0.0015), toon(faixa)), -l * 0.06, a + 0.0005, -p * 0.2);
  return g;
}

/**
 * O BEBITO BOOK E OS DOIS LIVROS: a pilha no banco de trás. Embaixo, A Toca
 * das Raposas (o do Renan); no meio, o Aristóteles e Dante (o do Ari) — os
 * dois que ficam na mesma prateleira do quarto; em cima, o caderninho de capa
 * de pano dos planos, com o elástico e a etiqueta.
 */
function bebitoBookELivros(): THREE.Group {
  const g = new THREE.Group();
  const doRenan = por(g, livro(0.36, 0.06, 0.25, P.livroDoRenan, P.livroDoRenanFaixa));
  doRenan.rotation.y = 0.12;
  const doAri = por(g, livro(0.34, 0.052, 0.235, P.livroDoAri, P.livroDoAriFaixa), 0.012, 0.06, 0.006);
  doAri.rotation.y = -0.2;
  // o caderninho: a capa de pano, as folhas, o elástico atravessado e a etiqueta
  const caderno = por(g, new THREE.Group(), -0.01, 0.112, 0.004);
  caderno.rotation.y = 0.34;
  por(caderno, new THREE.Mesh(quina(0.24, 0.042, 0.3, 0.012), toon(P.bebitoBookCapa)), 0, 0.021, 0);
  por(caderno, new THREE.Mesh(quina(0.226, 0.03, 0.296, 0.004), toon(P.livroMiolo)), 0.01, 0.021, 0);
  por(caderno, new THREE.Mesh(quina(0.022, 0.046, 0.304, 0.004), toon(P.bebitoBookElastico)), 0.07, 0.021, 0);
  por(caderno, new THREE.Mesh(quina(0.11, 0.004, 0.07, 0.0015), toon(P.bebitoBookEtiqueta)), -0.035, 0.0425, 0.02);
  // o coraçãozinho da etiqueta
  por(caderno, esfera(0.012, toon(P.heart), 1, 0.3, 1, 8), -0.035, 0.0445, 0.02);
  return g;
}

/**
 * A MANTINHA DA ESTELLA: uma manta de lã xadrez dobrada em três, com a
 * etiqueta de couro que a ovelha costureira prega em tudo o que faz, e do
 * lado o pote de biscoitinhos — ninguém sai de perto dela sem um.
 */
function mantinhaDaEstella(): THREE.Group {
  const g = new THREE.Group();
  const la = toon(0xffffff, { mapa: toalhaXadrez(0.12, P.mantinhaListra) });
  const dobras: Array<[number, number, number, number]> = [[0.44, 0.34, 0, 0], [0.42, 0.32, 0.004, -0.004], [0.4, 0.3, -0.004, 0.006]];
  dobras.forEach(([l, p, dx, dz], i) => {
    por(g, new THREE.Mesh(uvEmMetrosPorTriangulo(quina(l, 0.05, p, 0.022)), la), -0.07 + dx, 0.025 + i * 0.047, dz);
  });
  // a borda de lã lisa da dobra de cima e a etiqueta de couro no canto
  // (mais estreita e 3 mm mais alta que a dobra: do mesmo tamanho, o topo e as pontas caíam nos planos dela)
  por(g, new THREE.Mesh(quina(0.385, 0.016, 0.028, 0.007), toon(P.mantinhaLa)), -0.074, 0.139, 0.156);
  por(g, new THREE.Mesh(quina(0.06, 0.006, 0.04, 0.002), toon(P.mantinhaEtiqueta)), 0.07, 0.146, 0.1);

  // o pote de biscoitinhos: o vidro torneado, os biscoitos empilhados tortos e a tampa rosa
  const pote = por(g, new THREE.Group(), 0.22, 0, 0.04);
  pote.name = 'pote-de-biscoitos';
  const massa = toon(P.biscoitoMassa);
  [0, 0.4, -0.3, 0.7, 0.1].forEach((giro, i) => {
    const b = por(pote, new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.05, 0.02, 10), i % 2 ? toon(P.biscoitoBorda) : massa), Math.sin(giro * 5) * 0.008, 0.02 + i * 0.024, Math.cos(giro * 3) * 0.006);
    b.rotation.set(giro * 0.18, giro, -giro * 0.14);
  });
  const perfil = [[0.0001, 0.004], [0.058, 0.004], [0.066, 0.02], [0.066, 0.13], [0.054, 0.15], [0.054, 0.162]].map(([x, y]) => new THREE.Vector2(x, y));
  const vidro = new THREE.Mesh(new THREE.LatheGeometry(perfil, 16), toon(P.vidroDoPote, { opacity: 0.32, doubleSide: true }));
  vidro.name = 'vidro-do-pote';
  pote.add(vidro);
  por(pote, new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.022, 16), toon(P.poteTampa)), 0, 0.172, 0);
  por(pote, esfera(0.016, toon(P.poteTampa), 1, 0.8, 1, 8), 0, 0.19, 0);
  return g;
}

// =============================================================== o vidro de trás

/** O EMBLEMA DOS GATITOS: o escudo de verdade (o disco amarelo, o G e as orelhinhas), colado no vidro */
function emblema(): THREE.Group {
  const g = new THREE.Group();
  g.add(emblemaDosGatitos(0.085));
  return g;
}

/** os modelos, pelo id do catálogo (`ficha.ts`). Adesivo de canvas mora em `impressos.ts` */
export const PECAS_DO_CARRO: Readonly<Record<string, () => THREE.Group>> = {
  'jean-luc-de-painel': jeanLucDePainel,
  'girassol-da-josefina': girassolDaJosefina,
  'estrela-do-ari': estrelaDoAri,
  'pompom-dos-gatitos': pompomDosGatitos,
  'chaveiro-do-pelusa': chaveiroDoPelusa,
  'frisbee-e-raquetes': frisbeeERaquetes,
  'bebito-book-e-livros': bebitoBookELivros,
  'mantinha-da-estella': mantinhaDaEstella,
  'emblema-dos-gatitos': emblema,
};
