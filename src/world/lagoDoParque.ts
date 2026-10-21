import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { flat, toon } from '../core/materials';
import { AguaDoLago, Vento, type CoresDoLago, type FormaDoLago } from '../core/shaders';
import { PALETTE as P } from '../palette';
import { acabar } from './acabamento';
import { fundir } from './fundir';
import { letreiro } from './props';
import { veioDeMadeira } from './texturasDeCasa';
import { novaTextura, sorteio } from './texturasDeChao';

/**
 * ============================================ O LAGO DO VILLA LOBOS, DE CARA NOVA
 *
 * Foi uma das primeiras coisas do jogo — dois discos (areia e água), três
 * patos parados, quatro juncos e seis vitórias-régias chapadas — e nunca mais
 * tinha sido mexido. Este é o kit dele:
 *
 *  - **o contorno** (`FORMA_DO_LAGO`): a margem torta, de onde saem a água
 *    (`AguaDoLago`, em `core/shaders.ts`), os colisores, os seixos, o lugar de
 *    cada junco e de cada bicho — tudo pergunta para a MESMA conta;
 *  - **o trapiche**: o deque de madeira que entra na água, com as tábuas
 *    soltas uma a uma, as estacas, o guarda-corpo, a boia salva-vidas e o
 *    rolo de corda no cabeço da ponta. A ponta é aberta: é de onde se senta
 *    com o pé na água e de onde se joga pedrinha;
 *  - **a placa** de "proibido nadar" (o Renan já tinha gritado "NÃAAOOO");
 *  - **os seixos** da beira, **as ninféias** (folha com fenda e veio, flor
 *    rosa e branca, botão) e **o taboal** balançando com o vento — os três em
 *    `InstancedMesh`, uma malha para centenas de cópias;
 *  - **o tronco** caído onde os tigres-d'água tomam sol;
 *  - as peças pequenas que voam: a pedrinha chata, a moedinha e o peixe.
 *
 * Os BICHOS (patos, garça, tartarugas) moram em `entities/bichos/`, e o que é
 * vida miúda do lago (libélulas, o cardume, o peixe que pula), em
 * `world/vidaDoLago.ts`.
 */

/**
 * A MARGEM: raio médio de 8 m em volta de (-21; 11), e quatro ondas que a
 * entortam entre 7,3 e 8,5. Medido contra o resto do parque: o ponto onde o
 * Jean-Luc emerge fica 1,3 m dentro d'água, a trilha da clareira e a quina da
 * arena ficam a mais de um metro da areia, e a areia nunca passa de 9,6 do
 * centro.
 */
export const FORMA_DO_LAGO: FormaDoLago = {
  centro: [-21, 11],
  raio: 8.0,
  margem: [[2, 0.36, 0.35], [3, 0.22, 2.4], [5, 0.11, 4.1], [7, 0.05, 1.0]],
  areia: { base: 0.95, ondas: [[3, 0.24, 1.1], [5, 0.13, 0.4], [8, 0.06, 2.9]] },
};

export const CORES_DO_LAGO: CoresDoLago = {
  raso: P.aguaRasa,
  meio: P.water,
  fundo: P.aguaFunda,
  maisFundo: P.aguaMaisFunda,
  crista: P.cristaDaAgua,
  espuma: P.espumaDoLago,
  areia: P.sand,
  areiaMolhada: P.areiaMolhada,
  peixe: P.sombraDePeixe,
  moeda: P.moedaNoFundo,
};

/** a água do lago do parque (uma por cena: o relógio e as marolas são dela) */
export function aguaDoLago(): AguaDoLago {
  return new AguaDoLago(FORMA_DO_LAGO, CORES_DO_LAGO);
}

// ================================================================ o trapiche

/**
 * As medidas do trapiche, no referencial DELE: a origem é o meio da ponta de
 * terra, e ele entra na água pelo `+Z`.
 */
export const TRAPICHE = {
  largura: 1.7,
  comprimento: 5.0,
  /** o topo das tábuas, acima da água */
  altura: 0.2,
  /** a rampinha da terra até o deque */
  rampa: 0.75,
  /** quanto da ponta fica sem guarda-corpo (é ali que se senta) */
  pontaAberta: 1.75,
};

/** a altura do piso do trapiche a `lz` metros da ponta de terra */
export function alturaNoTrapiche(lz: number): number {
  const t = Math.max(0, Math.min(1, lz / TRAPICHE.rampa));
  return 0.03 + (TRAPICHE.altura - 0.03) * t;
}

/**
 * O TRAPICHE: o deque de madeira que entra no lago.
 *
 * O que faz ler como trapiche de verdade, e não como uma tampa marrom boiando:
 *
 *  - **tábua por tábua**, atravessadas, com fresta entre elas e cada uma num
 *    tom (três madeiras, de nova a velha cinzenta) e um tico mais comprida ou
 *    mais curta que a vizinha — é a mão de quem pregou;
 *  - **as estacas** saindo da água dos dois lados, com as vigas por baixo, e
 *    as duas da ponta subindo como cabeço de amarrar (uma com o rolo de corda);
 *  - **o guarda-corpo** só na metade de terra: a ponta é aberta, e é dela que
 *    os dois sentam com o pé na água;
 *  - **a boia salva-vidas** pendurada no último poste, laranja com as faixas
 *    brancas, virada para fora.
 *
 * Madeira com veio (`veioDeMadeira`, pelo `acabar`) e tudo fundido por
 * material no fim: são umas 120 peças, e desenham como meia dúzia.
 */
export function trapiche(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'trapiche';
  const { largura, comprimento, altura, rampa, pontaAberta } = TRAPICHE;
  const meia = largura / 2;
  const rnd = sorteio(4711);
  const tons = [P.trapicheTabua, P.trapicheTabuaClara, P.trapicheTabua, P.trapicheTabuaVelha, P.trapicheTabuaClara];
  const ESPESSURA = 0.045;

  // ------------------------------------------------------------- as tábuas
  const n = Math.floor((comprimento - rampa) / 0.18);
  const passo = (comprimento - rampa) / n;
  for (let i = 0; i < n; i++) {
    const sobra = (rnd() - 0.5) * 0.06;
    const tabua = new THREE.Mesh(
      new THREE.BoxGeometry(largura + sobra, ESPESSURA, passo - 0.022),
      toon(tons[Math.floor(rnd() * tons.length)]),
    );
    tabua.position.set((rnd() - 0.5) * 0.02, altura - ESPESSURA / 2 - rnd() * 0.004, rampa + passo * (i + 0.5));
    tabua.rotation.y = (rnd() - 0.5) * 0.012;
    g.add(tabua);
  }

  // ---------------------------------------------------- a rampa da terra
  const inclina = Math.atan2(altura - 0.03, rampa);
  const lado = Math.hypot(rampa, altura - 0.03);
  for (let i = 0; i < 4; i++) {
    const k = (i + 0.5) / 4;
    const tabua = new THREE.Mesh(new THREE.BoxGeometry(largura - 0.04, ESPESSURA, lado / 4 - 0.02), toon(tons[i % tons.length]));
    tabua.position.set(0, 0.03 + (altura - 0.03) * k - ESPESSURA / 2, rampa * k);
    tabua.rotation.x = -inclina;
    g.add(tabua);
  }
  // as duas cunhas de apoio da rampa
  const cunha = new THREE.Shape();
  cunha.moveTo(0, 0);
  cunha.lineTo(rampa + 0.02, 0);
  cunha.lineTo(rampa + 0.02, altura - ESPESSURA - 0.005);
  cunha.lineTo(0.05, 0.02);
  cunha.closePath();
  for (const x of [-meia + 0.12, meia - 0.12]) {
    const geo = new THREE.ExtrudeGeometry(cunha, { depth: 0.07, bevelEnabled: false });
    geo.rotateY(-Math.PI / 2);
    const peca = new THREE.Mesh(geo, toon(P.trapicheViga));
    peca.position.set(x - 0.035, 0, 0);
    g.add(peca);
  }

  // --------------------------------------------- as vigas e as travessas
  const VIGA = 0.12;
  for (const x of [-meia + 0.11, 0, meia - 0.11]) {
    const viga = new THREE.Mesh(new THREE.BoxGeometry(0.08, VIGA, comprimento - rampa + 0.04), toon(P.trapicheViga));
    // 4 mm DENTRO das tábuas: encostar daria face coplanar com o fundo delas
    viga.position.set(x, altura - ESPESSURA - VIGA / 2 + 0.004, rampa + (comprimento - rampa) / 2 - 0.01);
    g.add(viga);
  }

  // ------------------------------------------------------------- as estacas
  const fileiras: number[] = [];
  for (let z = rampa + 0.3; z < comprimento - 0.5; z += 1.3) fileiras.push(z);
  fileiras.push(comprimento - 0.1);
  const X_DA_ESTACA = meia + 0.04;
  fileiras.forEach((z, i) => {
    const ponta = i === fileiras.length - 1;
    for (const s of [-1, 1]) {
      const topo = ponta ? altura + 0.38 : altura - 0.02;
      const base = -0.25;
      const estaca = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.08, topo - base, 10), toon(P.trapicheEstaca));
      estaca.position.set(s * X_DA_ESTACA, (topo + base) / 2, z);
      estaca.rotation.y = rnd() * 3;
      g.add(estaca);
      if (ponta) {
        // o cabeço: a tampa abaulada de quem já foi muito amarrado
        const tampa = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.trapicheEstaca));
        tampa.scale.y = 0.45;
        tampa.position.set(s * X_DA_ESTACA, topo - 0.004, z);
        g.add(tampa);
      }
    }
    // a travessa embaixo das vigas, de estaca a estaca
    const travessa = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.09, 0.08), toon(P.trapicheViga));
    travessa.position.set(0, altura - ESPESSURA - VIGA - 0.04, z);
    g.add(travessa);
  });

  // o rolo de corda no cabeço da direita da ponta
  const zPonta = fileiras[fileiras.length - 1];
  for (let k = 0; k < 3; k++) {
    const volta = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.019, 6, 18), toon(P.cordaDoTrapiche));
    volta.rotation.x = Math.PI / 2 + (k - 1) * 0.08;
    volta.position.set(X_DA_ESTACA, altura + 0.08 + k * 0.036, zPonta);
    g.add(volta);
  }

  // ------------------------------------------------------- o guarda-corpo
  const fimDoCorrimao = comprimento - pontaAberta;
  const postes: number[] = [];
  for (let z = rampa; z <= fimDoCorrimao + 0.01; z += (fimDoCorrimao - rampa) / 2) postes.push(z);
  const X_DO_POSTE = meia + 0.035;
  for (const s of [-1, 1]) {
    for (const z of postes) {
      const poste = new THREE.Mesh(new THREE.BoxGeometry(0.075, 1.04, 0.075), toon(P.trapicheViga));
      poste.position.set(s * X_DO_POSTE, altura - 0.16 + 0.52, z);
      g.add(poste);
    }
    // o corrimão passa 1 cm de cada poste das pontas: rente, a ponta dele caía
    // no mesmo plano da face do poste
    const comp = fimDoCorrimao - rampa + 0.095;
    const corrimao = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.05, comp), toon(P.trapicheTabuaClara));
    corrimao.position.set(s * X_DO_POSTE, altura + 0.9, rampa + comp / 2 - 0.0475);
    g.add(corrimao);
    const meio = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, comp - 0.04), toon(P.trapicheViga));
    meio.position.set(s * (X_DO_POSTE + 0.002), altura + 0.47, rampa + comp / 2 - 0.0475);
    g.add(meio);
  }

  // --------------------------------------------- a boia salva-vidas
  const boia = new THREE.Group();
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.048, 10, 28), toon(P.boiaSalvaVidas));
  boia.add(anel);
  for (let k = 0; k < 4; k++) {
    const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.051, 10, 5, 0.36), toon(P.boiaSalvaVidasFaixa));
    faixa.rotation.z = k * (Math.PI / 2) + Math.PI / 4 - 0.18;
    boia.add(faixa);
  }
  // pendurada pela corda no gancho do poste, virada para fora (+X)
  boia.rotation.y = Math.PI / 2;
  boia.position.set(X_DO_POSTE + 0.1, altura + 0.55, fimDoCorrimao);
  g.add(boia);
  const alca = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 5), toon(P.cordaDoTrapiche));
  alca.position.set(X_DO_POSTE + 0.07, altura + 0.8, fimDoCorrimao);
  alca.rotation.z = 0.3;
  g.add(alca);

  // a ponta, onde os dois sentam: a cena ancora nela
  const pontaDoDeque = new THREE.Object3D();
  pontaDoDeque.name = 'ponta-do-trapiche';
  pontaDoDeque.position.set(0, altura, comprimento);
  g.add(pontaDoDeque);

  const madeira = veioDeMadeira(0.7);
  acabar(g, [
    [P.trapicheTabua, madeira], [P.trapicheTabuaClara, madeira], [P.trapicheTabuaVelha, madeira],
    [P.trapicheViga, madeira], [P.trapicheEstaca, madeira],
  ]);
  return fundir(g);
}

// =================================================================== a placa

/**
 * A PLACA da beira: tábua branca com moldura vermelha, "PROIBIDO NADAR" em
 * duas linhas e um nadador cortado em cima — num poste de madeira, na entrada
 * do trapiche. Base em `y = 0`, olhando para `+Z`.
 */
export function placaDoLago(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-do-lago';
  const poste = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 0.08), toon(P.trapicheViga));
  poste.position.y = 0.625;
  g.add(poste);
  const L = 0.7;
  const A = 0.5;
  const Y = 1.12;
  const tabua = new THREE.Mesh(new THREE.BoxGeometry(L, A, 0.035), toon(P.placaDoLago));
  tabua.position.set(0, Y, 0.06);
  g.add(tabua);
  // a moldura vermelha, 4 réguas por cima da frente. As de pé são um tico
  // mais finas, mais curtas e recuadas que as deitadas: na quina, réguas do
  // mesmo tamanho dividiam o plano da ponta, do topo e das duas faces
  for (const [w, h, x, y, fundo] of [
    [L, 0.03, 0, A / 2 - 0.015, 0.012], [L, 0.03, 0, -A / 2 + 0.015, 0.012],
    [0.028, A - 0.012, L / 2 - 0.018, 0, 0.009], [0.028, A - 0.012, -L / 2 + 0.018, 0, 0.009],
  ] as const) {
    const regua = new THREE.Mesh(new THREE.BoxGeometry(w, h, fundo), toon(P.placaDoLagoTinta));
    regua.position.set(x, Y + y, 0.06 + 0.0175 + 0.0045);
    g.add(regua);
  }
  const vermelho = `#${P.placaDoLagoTinta.toString(16).padStart(6, '0')}`;
  const linha1 = letreiro('PROIBIDO', L * 0.8, 0.12, vermelho);
  linha1.position.set(0, Y - 0.05, 0.06 + 0.0175 + 0.003);
  g.add(linha1);
  const linha2 = letreiro('NADAR', L * 0.62, 0.11, vermelho);
  linha2.position.set(0, Y - 0.16, 0.06 + 0.0175 + 0.003);
  g.add(linha2);
  // o nadador cortado: a cabeça, o braço em arco e a onda, e o risco por cima
  const icone = new THREE.Group();
  icone.position.set(0, Y + 0.12, 0.06 + 0.0175 + 0.004);
  const tinta = toon(P.placaDoLagoTinta);
  const cabeca = new THREE.Mesh(new THREE.CircleGeometry(0.022, 14), tinta);
  cabeca.position.set(-0.045, 0.012, 0);
  icone.add(cabeca);
  const braco = new THREE.Mesh(new THREE.RingGeometry(0.038, 0.05, 14, 1, 0.2, 2.2), tinta);
  braco.position.set(0.0, -0.005, 0);
  icone.add(braco);
  const onda = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.012), tinta);
  onda.position.set(0, -0.035, 0);
  icone.add(onda);
  const risco = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.016), tinta);
  risco.rotation.z = -0.62;
  risco.position.z = 0.001;
  icone.add(risco);
  g.add(icone);
  return fundir(g);
}

// =================================================================== os seixos

/**
 * OS SEIXOS DA BEIRA: pedrinhas de rio, achatadas e de quatro cinzas, na
 * linha onde a água encosta na areia — uns na areia molhada, uns aflorando
 * dentro d'água (afundados até ficar só a corcova de fora). Um `InstancedMesh`
 * só, com a cor por instância.
 *
 * @param livre a cena diz onde NÃO pôr (o trapiche, a entrada dele)
 */
export function seixosDaBeira(agua: AguaDoLago, quantos: number, livre: (x: number, z: number) => boolean): THREE.InstancedMesh {
  // o icosaedro cru (20 faces): o seixo tem de 4 a 8 px na tela, e são 170
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // o ruído pela POSIÇÃO (como a `rock()`): por índice rasgaria as quinas
    const n = Math.sin(Math.round(x * 100) * 12.9898 + Math.round(y * 100) * 78.233 + Math.round(z * 100) * 37.719) * 43758.5453;
    const k = 1 + (n - Math.floor(n) - 0.5) * 0.18;
    pos.setXYZ(i, x * k, y * k * 0.45, z * k);
  }
  geo.computeVertexNormals();
  const malha = new THREE.InstancedMesh(geo, toon(0xffffff), quantos);
  malha.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(quantos * 3), 3);
  const cores = [P.seixoClaro, P.seixoMeio, P.seixoEscuro, P.seixoVerde, P.seixoMeio];
  const rnd = sorteio(90210);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const c = new THREE.Color();
  let i = 0;
  for (let tentativa = 0; tentativa < quantos * 6 && i < quantos; tentativa++) {
    const a = rnd() * Math.PI * 2;
    // a maioria em volta da linha d'água, e um rabicho para dentro
    const recuo = -0.32 + rnd() * rnd() * 0.75;
    const p = agua.naBeira(a, recuo);
    if (!livre(p.x, p.z)) continue;
    const tam = 0.035 + rnd() * rnd() * 0.08;
    const naAgua = recuo > 0.02;
    e.set((rnd() - 0.5) * 0.3, rnd() * 6.28, (rnd() - 0.5) * 0.3);
    q.setFromEuler(e);
    m.compose(
      new THREE.Vector3(p.x, tam * 0.3 - (naAgua ? tam * 0.35 : 0), p.z),
      q,
      new THREE.Vector3(tam * (1 + rnd() * 0.5), tam, tam),
    );
    malha.setMatrixAt(i, m);
    malha.setColorAt(i, c.setHex(cores[Math.floor(rnd() * cores.length)]));
    i++;
  }
  malha.count = i;
  malha.userData.peca = 'seixos-da-beira';
  // seixo de 5 cm não faz sombra que se veja; ele RECEBE a do junco e a da dupla
  malha.userData.semSombra = true;
  return malha;
}

// ================================================================ as ninféias

/** uma folha de ninféia na água, e o que nasce dela */
export interface Ninfeia {
  x: number;
  z: number;
  escala: number;
  giro: number;
  flor: 'rosa' | 'branca' | 'botao' | null;
}

/**
 * A folha: um disco com a FENDA (o "V" que vai da borda até o meio, que é o
 * que separa ninféia de bolacha) e a borda virada um tico para cima. O veio é
 * desenho de canvas: raios saindo do miolo e um aro mais escuro na borda.
 */
function folhaDeNinfeia(): THREE.BufferGeometry {
  const fenda = 0.24;
  const geo = new THREE.CircleGeometry(1, 30, fenda / 2, Math.PI * 2 - fenda);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    // a concha: a borda sobe, e ondula de leve
    pos.setY(i, 0.045 * r * r + 0.012 * Math.sin(Math.atan2(z, x) * 5) * r);
  }
  geo.computeVertexNormals();
  return geo;
}

function veiosDaNinfeia(): THREE.CanvasTexture {
  return novaTextura('veios-da-ninfeia', 1, (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    const c = s / 2;
    // manchas claras de folha que pegou sol
    const rnd = sorteio(321);
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = `rgba(255,255,230,${0.12 + rnd() * 0.12})`;
      ctx.beginPath();
      ctx.arc(rnd() * s, rnd() * s, 8 + rnd() * 22, 0, Math.PI * 2);
      ctx.fill();
    }
    // os veios, do miolo para a borda
    ctx.strokeStyle = 'rgba(40,95,45,0.32)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.quadraticCurveTo(c + Math.cos(a + 0.12) * c * 0.5, c + Math.sin(a + 0.12) * c * 0.5, c + Math.cos(a) * c * 0.97, c + Math.sin(a) * c * 0.97);
      ctx.stroke();
    }
    // o aro da borda, mais escuro
    ctx.strokeStyle = 'rgba(35,85,40,0.45)';
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(c, c, c * 0.95, 0, Math.PI * 2);
    ctx.stroke();
    // o miolo
    ctx.fillStyle = 'rgba(60,110,50,0.4)';
    ctx.beginPath();
    ctx.arc(c, c, s * 0.035, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** a pétala pontuda: um elipsoide com a ponta fechando (base no zero, ponta em +Z) */
function petala(comprimento: number, largura: number): THREE.BufferGeometry {
  // 5×3 basta: a pétala tem uns 3 px na tela, e a flor tem 23 delas
  const geo = new THREE.SphereGeometry(1, 5, 3);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const fecha = z > 0 ? Math.pow(1 - z, 0.7) : 1;
    pos.setXYZ(i, pos.getX(i) * largura * fecha, pos.getY(i) * largura * 0.28, (z + 1) * comprimento * 0.5);
  }
  geo.computeVertexNormals();
  return geo;
}

/** a flor aberta: três voltas de pétalas, das deitadas às de pé */
function florDeNinfeia(): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  const voltas = [
    { n: 9, comp: 0.13, larg: 0.035, ergue: 0.32, giro: 0 },
    { n: 8, comp: 0.105, larg: 0.03, ergue: 0.8, giro: 0.2 },
    { n: 6, comp: 0.075, larg: 0.024, ergue: 1.2, giro: 0.5 },
  ];
  for (const v of voltas) {
    for (let k = 0; k < v.n; k++) {
      const p = petala(v.comp, v.larg);
      p.rotateX(-v.ergue);
      p.rotateY((k / v.n) * Math.PI * 2 + v.giro);
      partes.push(p);
    }
  }
  const flor = mergeGeometries(partes);
  flor.translate(0, 0.012, 0);
  return flor;
}

function mioloDaNinfeia(): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [new THREE.CylinderGeometry(0.03, 0.026, 0.05, 10).translate(0, 0.03, 0)];
  // os estames em volta do miolo
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    partes.push(new THREE.CylinderGeometry(0.004, 0.004, 0.035, 4).translate(Math.cos(a) * 0.034, 0.045, Math.sin(a) * 0.034));
  }
  return mergeGeometries(partes);
}

function botaoDeNinfeia(): THREE.BufferGeometry {
  const botao = petala(0.12, 0.034);
  botao.rotateX(-Math.PI / 2);
  return botao;
}

/**
 * AS NINFÉIAS, todas em lote: as folhas, as flores (rosa e branca são a MESMA
 * malha, com a cor por instância), os miolos e os botões. Elas boiam: cada
 * uma sobe e desce no seu tempo, e balança mais quando passa uma marola por
 * ela (`balancar`) — o pato passando por perto mexe nas folhas.
 */
export class Ninfeias {
  readonly grupo = new THREE.Group();
  private readonly folhas: THREE.InstancedMesh;
  private readonly flores: THREE.InstancedMesh;
  private readonly miolos: THREE.InstancedMesh;
  private readonly botoes: THREE.InstancedMesh;
  private readonly lista: Ninfeia[];
  private readonly fase: number[];
  private readonly sacode: number[];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private relogio = 0;

  constructor(lista: Ninfeia[]) {
    this.lista = lista;
    this.grupo.userData.peca = 'ninfeias';
    this.fase = lista.map((_, i) => (i * 2.399) % (Math.PI * 2));
    this.sacode = lista.map(() => 0);
    const comFlor = lista.filter((n) => n.flor === 'rosa' || n.flor === 'branca').length;
    const comBotao = lista.filter((n) => n.flor === 'botao').length;
    this.folhas = new THREE.InstancedMesh(folhaDeNinfeia(), toon(0xffffff, { mapa: veiosDaNinfeia() }), lista.length);
    this.flores = new THREE.InstancedMesh(florDeNinfeia(), toon(0xffffff), Math.max(1, comFlor));
    this.miolos = new THREE.InstancedMesh(mioloDaNinfeia(), toon(P.ninfeiaMiolo), Math.max(1, comFlor));
    this.botoes = new THREE.InstancedMesh(botaoDeNinfeia(), toon(P.ninfeiaBotao), Math.max(1, comBotao));
    this.flores.count = comFlor;
    this.miolos.count = comFlor;
    this.botoes.count = comBotao;
    for (const malha of [this.folhas, this.flores, this.miolos, this.botoes]) {
      malha.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.grupo.add(malha);
    }
    // a flor e o botão são miúdos demais para a sombra deles se ver; a folha
    // faz sombra na água, e é ela que assenta a ninféia
    for (const malha of [this.flores, this.miolos, this.botoes]) malha.userData.semSombra = true;
    const c = new THREE.Color();
    const verdes = [P.ninfeiaFolha, P.ninfeiaFolhaEscura, P.ninfeiaFolha, P.juncoClaro];
    let f = 0;
    lista.forEach((n, i) => {
      this.folhas.setColorAt(i, c.setHex(verdes[i % verdes.length]));
      if (n.flor === 'rosa' || n.flor === 'branca') {
        this.flores.setColorAt(f++, c.setHex(n.flor === 'rosa' ? P.ninfeiaRosa : P.ninfeiaBranca));
      }
    });
    this.atualizar(0);
  }

  /** onde cada folha está (a cena usa para o pato desviar) */
  get folhasNaAgua(): ReadonlyArray<Ninfeia> {
    return this.lista;
  }

  /** uma marola passou em (x, z): as folhas de perto balançam mais */
  balancar(x: number, z: number, forca = 1, alcance = 1.6): void {
    this.lista.forEach((n, i) => {
      const d = Math.hypot(n.x - x, n.z - z);
      if (d < alcance) this.sacode[i] = Math.max(this.sacode[i], forca * (1 - d / alcance));
    });
  }

  atualizar(dt: number): void {
    this.relogio += dt;
    const t = this.relogio;
    let f = 0;
    let b = 0;
    this.lista.forEach((n, i) => {
      this.sacode[i] = Math.max(0, this.sacode[i] - dt * 0.7);
      const sacode = this.sacode[i];
      const ph = this.fase[i];
      const sobe = Math.sin(t * 0.9 + ph) * 0.006 + Math.sin(t * 5.2 + ph) * 0.012 * sacode;
      const tomba = Math.sin(t * 0.7 + ph * 1.3) * 0.025 + Math.sin(t * 4.6 + ph) * 0.08 * sacode;
      const y = 0.03 + sobe;
      this.e.set(tomba, n.giro + Math.sin(t * 0.13 + ph) * 0.06, tomba * 0.6);
      this.q.setFromEuler(this.e);
      this.m.compose(this.v.set(n.x, y, n.z), this.q, this.s.setScalar(n.escala * 0.42));
      this.folhas.setMatrixAt(i, this.m);
      if (n.flor === 'rosa' || n.flor === 'branca') {
        // a flor sai do lado da fenda, de pé sobre a folha
        const ox = Math.cos(n.giro) * 0.16 * n.escala;
        const oz = -Math.sin(n.giro) * 0.16 * n.escala;
        this.e.set(tomba * 0.5, n.giro * 2.1, 0);
        this.q.setFromEuler(this.e);
        this.m.compose(this.v.set(n.x + ox, y + 0.02, n.z + oz), this.q, this.s.setScalar(n.escala * 0.9));
        this.flores.setMatrixAt(f, this.m);
        this.miolos.setMatrixAt(f, this.m);
        f++;
      } else if (n.flor === 'botao') {
        const ox = Math.cos(n.giro) * 0.17 * n.escala;
        const oz = -Math.sin(n.giro) * 0.17 * n.escala;
        this.e.set(0.15 + tomba, n.giro, 0.1);
        this.q.setFromEuler(this.e);
        this.m.compose(this.v.set(n.x + ox, y - 0.005, n.z + oz), this.q, this.s.setScalar(n.escala));
        this.botoes.setMatrixAt(b++, this.m);
      }
    });
    this.folhas.instanceMatrix.needsUpdate = true;
    this.flores.instanceMatrix.needsUpdate = true;
    this.miolos.instanceMatrix.needsUpdate = true;
    this.botoes.instanceMatrix.needsUpdate = true;
  }
}

/**
 * Uma colônia de ninféias em volta de (cx, cz): folhas de tamanhos variados,
 * sem uma em cima da outra (sorteio com recusa), e de vez em quando uma flor
 * ou um botão.
 */
export function coloniaDeNinfeias(
  cx: number, cz: number, raio: number, quantas: number, semente: number,
  cabe: (x: number, z: number) => boolean,
): Ninfeia[] {
  const rnd = sorteio(semente);
  const lista: Ninfeia[] = [];
  for (let t = 0; t < quantas * 12 && lista.length < quantas; t++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * raio;
    const x = cx + Math.cos(a) * d;
    const z = cz + Math.sin(a) * d;
    const escala = 0.7 + rnd() * 0.65;
    if (!cabe(x, z)) continue;
    if (lista.some((n) => Math.hypot(n.x - x, n.z - z) < (n.escala + escala) * 0.4)) continue;
    const sorte = rnd();
    lista.push({
      x, z, escala, giro: rnd() * Math.PI * 2,
      flor: sorte < 0.16 ? 'rosa' : sorte < 0.26 ? 'branca' : sorte < 0.34 ? 'botao' : null,
    });
  }
  return lista;
}

// ================================================================== o taboal

/** um tufo de taboa e junco na beira: centro, raio, quantas folhas e a altura */
export interface TufoDeTaboa {
  x: number;
  z: number;
  raio: number;
  folhas: number;
  altura: number;
  /** quantas taboas (a espiga marrom) saem do meio do tufo */
  espigas: number;
}

/** a folha de junco: uma fita afinando até a ponta, curvada para fora (altura 1) */
function folhaDeJunco(): THREE.BufferGeometry {
  const segmentos = 6;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segmentos; i++) {
    const y = i / segmentos;
    const meia = 0.024 * (1 - Math.pow(y, 1.6)) + 0.002;
    const curva = 0.16 * y * y;
    pos.push(-meia, y, curva, meia, y, curva + 0.004);
    uv.push(0, y, 1, y);
    if (i < segmentos) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** a haste da taboa (altura 1) */
function hasteDaTaboa(): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(0.008, 0.013, 1, 5).translate(0, 0.5, 0);
}

/** a espiga marrom no alto da haste, e o espetinho fino acima dela */
function espigaDaTaboa(): THREE.BufferGeometry {
  return mergeGeometries([
    new THREE.CapsuleGeometry(0.03, 0.15, 4, 8).translate(0, 0.8, 0),
    new THREE.CylinderGeometry(0.003, 0.005, 0.12, 4).translate(0, 0.94, 0),
  ]);
}

/**
 * O TABOAL: os tufos de junco e taboa da beira, balançando com o vento.
 *
 * O balanço é o `Vento` do kit de shaders (o mesmo da grama do laboratório):
 * a ponta voa, a raiz fica plantada, e a fase de cada folha sai da posição
 * dela — a rajada atravessa o tufo em onda. As folhas, as hastes e as espigas
 * são três `InstancedMesh`; haste e espiga dividem a MESMA matriz por
 * instância, e é a espiga já nascer na altura da ponta da haste (em vez de ser
 * filha dela) que faz as duas balançarem juntas sem nenhuma conta a mais.
 */
export function taboal(tufos: TufoDeTaboa[], vento: Vento, semente = 77): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'taboal';
  const rnd = sorteio(semente);
  const totalDeFolhas = tufos.reduce((s, t) => s + t.folhas, 0);
  const totalDeEspigas = tufos.reduce((s, t) => s + t.espigas, 0);
  const folhas = new THREE.InstancedMesh(folhaDeJunco(), vento.material(0xffffff), totalDeFolhas);
  const hastes = new THREE.InstancedMesh(hasteDaTaboa(), vento.material(P.juncoMeio), Math.max(1, totalDeEspigas));
  const espigas = new THREE.InstancedMesh(espigaDaTaboa(), vento.material(P.espigaDaTaboa), Math.max(1, totalDeEspigas));
  hastes.count = totalDeEspigas;
  espigas.count = totalDeEspigas;
  const verdes = [P.juncoClaro, P.juncoMeio, P.juncoEscuro, P.juncoMeio, P.leafMid];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const c = new THREE.Color();
  let f = 0;
  let k = 0;
  for (const t of tufos) {
    for (let i = 0; i < t.folhas; i++) {
      const a = rnd() * Math.PI * 2;
      const d = Math.sqrt(rnd()) * t.raio;
      const x = t.x + Math.cos(a) * d;
      const z = t.z + Math.sin(a) * d;
      // a folha se curva para FORA do tufo (o `+Z` dela vira para longe do meio)
      const giro = Math.atan2(x - t.x, z - t.z) + (rnd() - 0.5) * 1.2;
      const h = t.altura * (0.55 + rnd() * 0.55) * (1 - (d / t.raio) * 0.3);
      e.set((rnd() - 0.5) * 0.12, giro, (rnd() - 0.5) * 0.12);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1 + rnd() * 0.4, h, 0.7 + h * 0.5));
      folhas.setMatrixAt(f, m);
      folhas.setColorAt(f, c.setHex(verdes[Math.floor(rnd() * verdes.length)]));
      f++;
    }
    for (let i = 0; i < t.espigas; i++) {
      const a = rnd() * Math.PI * 2;
      const d = rnd() * t.raio * 0.5;
      e.set((rnd() - 0.5) * 0.08, rnd() * 6.28, (rnd() - 0.5) * 0.08);
      q.setFromEuler(e);
      m.compose(
        new THREE.Vector3(t.x + Math.cos(a) * d, 0, t.z + Math.sin(a) * d),
        q,
        new THREE.Vector3(1, t.altura * (1.05 + rnd() * 0.3), 1),
      );
      hastes.setMatrixAt(k, m);
      espigas.setMatrixAt(k, m);
      k++;
    }
  }
  g.add(folhas, hastes, espigas);
  return g;
}

// ================================================================= o tronco

/**
 * O TRONCO CAÍDO da beira, onde os tigres-d'água tomam sol: deitado na água
 * com uma ponta encostada na margem, a casca com veio, o corte claro com os
 * anéis, um toco de galho e as manchas de musgo. Comprimento no `+Z`, a ponta
 * de terra no zero. `afunda` é o quanto o fundo dele está abaixo da água — o
 * chão do mundo esconde o que fica embaixo.
 */
export const TRONCO = { comprimento: 2.5, raio: 0.21, afunda: 0.1 };

export function troncoDoLago(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'tronco-do-lago';
  const { comprimento, raio, afunda } = TRONCO;
  const y = raio - afunda;
  const casca = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.9, raio, comprimento, 14, 3), toon(P.troncoDoLago));
  casca.rotation.x = Math.PI / 2;
  casca.position.set(0, y, comprimento / 2);
  g.add(casca);
  // os dois cortes, com os anéis
  for (const [z, r, s] of [[0, raio, -1], [comprimento, raio * 0.9, 1]] as const) {
    const corte = new THREE.Mesh(new THREE.CircleGeometry(r * 0.93, 14), toon(P.troncoDoLagoMiolo));
    corte.position.set(0, y, z + s * 0.004);
    corte.rotation.y = s > 0 ? 0 : Math.PI;
    g.add(corte);
    for (const k of [0.35, 0.65]) {
      const anel = new THREE.Mesh(new THREE.RingGeometry(r * k, r * k + 0.012, 16), toon(P.troncoDoLago));
      anel.position.set(0, y, z + s * 0.006);
      anel.rotation.y = s > 0 ? 0 : Math.PI;
      g.add(anel);
    }
  }
  // o toco de galho, e as manchas de musgo por cima
  const galho = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 0.32, 7), toon(P.troncoDoLago));
  galho.position.set(raio * 0.7, y + raio * 0.55, comprimento * 0.62);
  galho.rotation.set(0.5, 0, -0.9);
  g.add(galho);
  const rnd = sorteio(6061);
  for (let i = 0; i < 7; i++) {
    const a = -0.9 + rnd() * 1.8;
    const musgo = new THREE.Mesh(new THREE.SphereGeometry(0.07 + rnd() * 0.05, 8, 5), toon(P.musgoDoTronco));
    musgo.scale.set(1, 0.25, 1.6);
    const zz = 0.2 + rnd() * (comprimento - 0.4);
    const rr = raio * (1 - (zz / comprimento) * 0.1);
    musgo.position.set(Math.sin(a) * rr * 0.98, y + Math.cos(a) * rr * 0.98, zz);
    musgo.rotation.z = -a;
    g.add(musgo);
  }
  acabar(g, [[P.troncoDoLago, veioDeMadeira(0.5)]]);
  return fundir(g);
}

/** a altura do topo do tronco, para pôr bicho em cima */
export function topoDoTronco(): number {
  return TRONCO.raio * 2 - TRONCO.afunda;
}

// ==================================================== as peças pequenas que voam

/** a pedrinha chata de quicar: um seixo achatado, cinza de rio */
export function pedrinhaDeQuicar(): THREE.Mesh {
  const geo = new THREE.IcosahedronGeometry(0.05, 1);
  geo.scale(1.25, 0.35, 1);
  const pedra = new THREE.Mesh(geo, toon(P.seixoMeio));
  pedra.castShadow = true;
  pedra.userData.peca = 'pedrinha-de-quicar';
  return pedra;
}

/** a moedinha do desejo: um disquinho dourado com a borda um tom mais escuro */
export function moedinha(): THREE.Group {
  const g = new THREE.Group();
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.005, 16), toon(P.gold));
  g.add(face);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.0035, 4, 18), toon(P.moedaNoFundo));
  borda.rotation.x = Math.PI / 2;
  g.add(borda);
  g.userData.peca = 'moedinha';
  return fundir(g);
}

/**
 * O PEIXE QUE PULA: corpo de elipsoide prateado com o dorso escuro, a cauda em
 * leque e a nadadeira de cima. Comprimento no `+Z` (a cabeça), centrado.
 */
export function peixeQuePula(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'peixe-que-pula';
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), toon(P.peixePrata));
  corpo.scale.set(0.045, 0.06, 0.15);
  g.add(corpo);
  const dorso = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.42), toon(P.peixeDorso));
  dorso.scale.set(0.047, 0.062, 0.152);
  g.add(dorso);
  const cauda = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.09, 4), toon(P.peixeDorso));
  cauda.scale.set(0.25, 1, 1);
  cauda.rotation.x = -Math.PI / 2;
  cauda.position.z = -0.17;
  g.add(cauda);
  const barbatana = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 3), toon(P.peixeDorso));
  barbatana.scale.set(0.3, 1, 1.4);
  barbatana.position.set(0, 0.065, -0.01);
  barbatana.rotation.x = -0.5;
  g.add(barbatana);
  for (const s of [-1, 1]) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 5), toon(P.pragaPupila));
    olho.position.set(s * 0.036, 0.014, 0.1);
    g.add(olho);
  }
  return fundir(g);
}

/**
 * A LIBÉLULA: abdômen comprido e fino, o tórax, a cabeça de olhão e as quatro
 * asas de vidro (num grupo com nome, para baterem). Do tamanho de verdade —
 * uns 8 cm —, porque é o tamanho que faz ela ler como libélula e não como
 * avião. Cabeça no `+Z`.
 */
export function libelula(cor: number = P.libelulaAzul): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'libelula';
  const corpo = toon(cor);
  const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0075, 0.075, 5), corpo);
  abdomen.rotation.x = Math.PI / 2;
  abdomen.position.z = -0.04;
  g.add(abdomen);
  const torax = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), corpo);
  torax.scale.set(1, 0.9, 1.3);
  g.add(torax);
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), toon(P.peixeDorso));
  cabeca.scale.set(1.5, 0.9, 0.9);
  cabeca.position.z = 0.016;
  g.add(cabeca);
  const asas = new THREE.Group();
  asas.name = 'asas';
  const vidro = flat(P.asaDeLibelula, 0.55);
  for (const [z, comp] of [[0.004, 0.05], [-0.008, 0.045]] as const) {
    for (const s of [-1, 1]) {
      const asa = new THREE.Mesh(new THREE.CircleGeometry(1, 10), vidro);
      asa.scale.set(comp, 0.009, 1);
      asa.rotation.x = -Math.PI / 2;
      asa.position.set(s * (comp + 0.004), 0.004, z);
      asas.add(asa);
    }
  }
  g.add(asas);
  return g;
}
