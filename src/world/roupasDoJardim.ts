import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';

/**
 * A SEGUNDA LEVA DA LOJINHA DA JOSEFINA — a geometria.
 *
 * Pedido do Renan: luvas de cores diferentes com estampas fofas de coisas do
 * jogo (uma verde), pins de flor e de bichinho para o cabelo, pulseiras de
 * flor e de pedrinha, vestidos floridos, camisetas de natureza, camisetas
 * LARGAS (soltas do corpo, como o moletom) e calças LARGAS de jardinagem —
 * "muito bem feitos e detalhados".
 *
 * Mora num arquivo próprio porque `roupas.ts` já passa de 2.700 linhas; a
 * regra é a mesma de lá (skill `aristory-roupa`): cada função recebe as
 * medidas e devolve um `Object3D` NOVO, e o referencial é o do slot:
 *
 * | slot                     | y = 0 fica em        |
 * |--------------------------|----------------------|
 * | `tronco`                 | o CHÃO               |
 * | `pernas`                 | o quadril (por perna)|
 * | `maos`, `extraBraco`     | o ombro (por braço)  |
 * | `acessorio` + `cabeca`   | o centro do crânio   |
 *
 * OS NÚMEROS DO CORPO saem do rig (`CharacterRig`) e estão reunidos em
 * `corpo()` logo abaixo, cada um com o lugar de onde veio — medir de novo no
 * rig é o que evita peça flutuando ou enterrada.
 */

// ------------------------------------------------------------------ o corpo

/** as medidas do rig de que as peças precisam, em metros */
function corpo(m: MedidasCorpo) {
  const { h, w } = m;
  return {
    /** a cápsula do tronco: raio, achatada em 0,82 no z */
    raioTorso: h * 0.105 * w,
    ACHATA: 0.82,
    /** o quadril (onde as pernas penduram), a partir do chão */
    quadril: m.legH,
    /** a manga do rig e o antebraço */
    raioManga: h * 0.038 * w,
    raioPulso: h * 0.032 * w,
    /** a mão: esfera no fim do braço */
    raioMao: h * 0.04 * w,
    yMao: -m.armLen * 0.92,
    yPulso: -m.armLen * 0.8,
    /** a perna do rig: cápsula de raio 0,042·h·w */
    raioPerna: h * 0.042 * w,
  };
}

// ------------------------------------------------------- os desenhos que repetem

/**
 * UMA FLORZINHA de cinco (ou mais) pétalas, deitada no plano XY e olhando
 * para `+Z` — é a unidade de tudo o que é florido aqui: pin, estampa,
 * pulseira e vestido.
 */
function florzinha(raio: number, petala: number, miolo: number, petalas = 5): THREE.Group {
  const g = new THREE.Group();
  const matPetala = toon(petala);
  for (let i = 0; i < petalas; i++) {
    const a = (i / petalas) * Math.PI * 2 + Math.PI / 2;
    const p = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.42, 8, 6), matPetala);
    p.scale.set(0.78, 1.05, 0.34);
    p.position.set(Math.cos(a) * raio * 0.52, Math.sin(a) * raio * 0.52, 0);
    p.rotation.z = a - Math.PI / 2;
    g.add(p);
  }
  const centro = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.3, 8, 6), toon(miolo));
  centro.scale.z = 0.5;
  centro.position.z = raio * 0.08;
  g.add(centro);
  return g;
}

/** Uma folhinha: oval achatada com a nervura clara no meio, apontando para `+Y`. */
function folhinha(comprimento: number, cor: number, nervura: number = P.luvaFolhaNervura): THREE.Group {
  const g = new THREE.Group();
  const folha = new THREE.Mesh(new THREE.SphereGeometry(comprimento * 0.5, 10, 8), toon(cor));
  folha.scale.set(0.55, 1, 0.22);
  g.add(folha);
  const risco = new THREE.Mesh(new THREE.BoxGeometry(comprimento * 0.05, comprimento * 0.8, comprimento * 0.05), toon(nervura));
  risco.position.z = comprimento * 0.1;
  g.add(risco);
  return g;
}

/**
 * UMA JOANINHA vista de cima: o casco vermelho em meia esfera, a linha das
 * asas, as bolinhas pretas e a cabecinha com as antenas. Olha para `+Z`
 * (o casco sobe em `+Z`), a cabeça para `+Y`.
 */
function joaninha(raio: number): THREE.Group {
  const g = new THREE.Group();
  const vermelho = toon(P.joaninhaVermelho);
  const preto = toon(P.joaninhaPreto);
  const casco = new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), vermelho);
  casco.rotation.x = Math.PI / 2;
  casco.scale.set(1, 0.55, 1.05);
  g.add(casco);
  const linha = new THREE.Mesh(new THREE.BoxGeometry(raio * 0.07, raio * 1.9, raio * 0.1), preto);
  linha.position.z = raio * 0.52;
  g.add(linha);
  for (const [x, y] of [[0.45, 0.35], [-0.45, 0.35], [0.5, -0.35], [-0.5, -0.35], [0.22, -0.72], [-0.22, -0.72]] as const) {
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.16, 8, 6), preto);
    bolinha.scale.z = 0.4;
    bolinha.position.set(x * raio, y * raio, raio * 0.46 * Math.sqrt(Math.max(0.1, 1 - x * x - y * y * 0.8)) + raio * 0.05);
    g.add(bolinha);
  }
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.42, 10, 8), preto);
  cabeca.scale.z = 0.6;
  cabeca.position.set(0, raio * 1.02, raio * 0.1);
  g.add(cabeca);
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.1, 6, 5), toon(P.joaninhaBolinha));
    olho.position.set(lado * raio * 0.17, raio * 1.12, raio * 0.3);
    g.add(olho);
    const antena = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.035, raio * 0.035, raio * 0.5, 5), preto);
    antena.position.set(lado * raio * 0.2, raio * 1.52, raio * 0.1);
    antena.rotation.z = -lado * 0.45;
    g.add(antena);
  }
  return g;
}

/**
 * UMA ABELHINHA de lado: o corpo oval amarelo com duas listras marrons, o
 * ferrãozinho, as duas asas translúcidas em cima e o olhinho. Olha para `+Z`,
 * voando para `+X`.
 */
function abelhinha(raio: number): THREE.Group {
  const g = new THREE.Group();
  const corpoAbelha = new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 10), toon(P.abelhaAmarela));
  corpoAbelha.scale.set(1.35, 1, 0.9);
  g.add(corpoAbelha);
  const listra = toon(P.abelhaListra);
  for (const x of [-0.35, 0.2]) {
    const faixa = new THREE.Mesh(new THREE.TorusGeometry(raio * 0.93 * Math.sqrt(1 - x * x * 0.5), raio * 0.14, 6, 16), listra);
    faixa.rotation.y = Math.PI / 2;
    faixa.scale.set(1, 1, 0.9);
    faixa.position.x = x * raio * 1.35;
    g.add(faixa);
  }
  const ferrao = new THREE.Mesh(new THREE.ConeGeometry(raio * 0.18, raio * 0.4, 6), listra);
  ferrao.rotation.z = Math.PI / 2;
  ferrao.position.x = -raio * 1.5;
  g.add(ferrao);
  const olho = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.16, 6, 5), listra);
  olho.position.set(raio * 1.02, raio * 0.2, raio * 0.55);
  g.add(olho);
  const asa = toon(P.asaTransparente, { opacity: 0.8 });
  for (const [x, rot] of [[0.1, 0.35], [-0.35, -0.2]] as const) {
    const a = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.62, 10, 8), asa);
    a.scale.set(0.7, 1, 0.25);
    a.position.set(x * raio, raio * 1.2, raio * 0.1);
    a.rotation.z = rot;
    g.add(a);
  }
  return g;
}

/**
 * UMA BORBOLETA de frente: duas asas de cima grandes (lilás), duas de baixo
 * menores (rosa), cada uma com uma pintinha branca, o corpinho escuro no meio
 * e as antenas. Olha para `+Z`.
 */
function borboleta(raio: number, cima: number = P.borboletaAsa, baixo: number = P.borboletaAsaBaixa): THREE.Group {
  const g = new THREE.Group();
  const pinta = toon(P.florBranca);
  for (const lado of [-1, 1] as const) {
    const asaCima = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.6, 12, 8), toon(cima));
    asaCima.scale.set(1, 0.85, 0.22);
    asaCima.position.set(lado * raio * 0.6, raio * 0.35, 0);
    asaCima.rotation.z = lado * 0.35;
    g.add(asaCima);
    const asaBaixo = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.42, 10, 8), toon(baixo));
    asaBaixo.scale.set(0.9, 1, 0.22);
    asaBaixo.position.set(lado * raio * 0.45, -raio * 0.42, 0.001);
    asaBaixo.rotation.z = -lado * 0.4;
    g.add(asaBaixo);
    const p = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.13, 8, 6), pinta);
    p.scale.z = 0.3;
    p.position.set(lado * raio * 0.72, raio * 0.45, raio * 0.12);
    g.add(p);
    const antena = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.03, raio * 0.03, raio * 0.55, 5), toon(P.borboletaCorpo));
    antena.position.set(lado * raio * 0.13, raio * 0.78, raio * 0.05);
    antena.rotation.z = -lado * 0.4;
    g.add(antena);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.06, 6, 5), toon(P.borboletaCorpo));
    ponta.position.set(lado * raio * 0.25, raio * 1.03, raio * 0.05);
    g.add(ponta);
  }
  const corpoB = new THREE.Mesh(new THREE.CapsuleGeometry(raio * 0.1, raio * 0.8, 4, 8), toon(P.borboletaCorpo));
  corpoB.position.z = raio * 0.08;
  g.add(corpoB);
  return g;
}

/** UMA GOTINHA — a gota de experiência do jogo: bolinha com a ponta para cima e o brilho. */
function gotinha(raio: number, cor: number = P.gotaAgua): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(raio, 10, 8), mat);
  bola.scale.z = 0.45;
  g.add(bola);
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(raio * 0.72, raio * 1.1, 10), mat);
  ponta.scale.z = 0.45;
  ponta.position.y = raio * 0.95;
  g.add(ponta);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.25, 6, 5), toon(P.gotaBrilho));
  brilho.scale.z = 0.4;
  brilho.position.set(-raio * 0.35, raio * 0.25, raio * 0.35);
  g.add(brilho);
  return g;
}

/** UM GIRASSOL pequeno: oito pétalas amarelas em volta do miolo marrom. */
function girassolzinho(raio: number): THREE.Group {
  const g = florzinha(raio, P.girassolPetala, P.girassolMiolo, 8);
  return g;
}

/**
 * Cola um desenho numa superfície: põe em `(x, y, z)` e vira a cara dele
 * (`+Z`) para fora, na direção `(nx, ny, nz)`.
 */
function colar(obj: THREE.Object3D, pai: THREE.Object3D, x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
  pai.add(obj);
  obj.position.set(x, y, z);
  obj.lookAt(x + nx, y + ny, z + nz);
}

/** Um ponto na frente do tronco, na altura `y` e no ângulo `a` (0 = frente). */
function noTronco(m: MedidasCorpo, a: number, y: number, folga = 1.02, raio = corpo(m).raioTorso, achata = corpo(m).ACHATA) {
  return {
    x: Math.sin(a) * raio * folga,
    y,
    z: Math.cos(a) * raio * achata * folga,
    nx: Math.sin(a),
    nz: Math.cos(a),
  };
}

// ================================================================== AS LUVAS

type EstampaDeLuva = 'girassol' | 'joaninha' | 'folha' | 'gota';

/**
 * AS LUVAS ESTAMPADAS: a mão calçada, o punho de outra cor com um frisinho, e
 * a ESTAMPA NO DORSO — no lado de FORA da mão, que é o que aparece com o braço
 * caído. Cada uma estampa uma coisa do jogo: o girassol (a moeda da estufa), a
 * joaninha (o chapéu), a folha (a estufa — a verde) e a gota (a experiência).
 *
 * REFERENCIAL: o pivô de cada braço (`maos`). O "lado de fora" é `+X` no braço
 * de `+X` e `-X` no de `-X`: por isso o `lado` MULTIPLICA o x da estampa (a
 * pegadinha do sinal da skill de roupa).
 */
function luvasCom(estampa: EstampaDeLuva) {
  return (m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const c = corpo(m);
    const g = new THREE.Group();
    const cor = peca?.cor ?? P.luvaFolha;
    const raio = c.raioMao * 1.15;
    const mao = new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 12), toon(cor));
    mao.position.y = c.yMao;
    mao.scale.set(1, 1.08, 1);
    g.add(mao);
    // o polegar, um gominho para a frente e para dentro
    const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(raio * 0.3, raio * 0.35, 4, 8), toon(cor));
    polegar.position.set(-lado * raio * 0.45, c.yMao + raio * 0.1, raio * 0.6);
    polegar.rotation.set(0.5, 0, lado * 0.6);
    g.add(polegar);
    // o punho dobrado, com o frisinho na borda
    const punhoCor = peca?.corDetalhe ?? P.florBranca;
    const cano = new THREE.Mesh(new THREE.CylinderGeometry(c.raioPulso * 1.5, c.raioPulso * 1.32, m.h * 0.04, 16), toon(punhoCor));
    cano.position.y = c.yPulso;
    g.add(cano);
    const friso = new THREE.Mesh(new THREE.TorusGeometry(c.raioPulso * 1.5, m.h * 0.0055, 5, 18), toon(cor));
    friso.rotation.x = Math.PI / 2;
    friso.position.y = c.yPulso + m.h * 0.02;
    g.add(friso);

    // a estampa, no dorso (lado de fora)
    const fora = (obj: THREE.Object3D, dy = 0, dz = 0): void => {
      colar(obj, g, lado * raio * 0.97, c.yMao + dy, dz, lado, 0, 0.15);
    };
    if (estampa === 'girassol') {
      fora(girassolzinho(raio * 0.62));
    } else if (estampa === 'folha') {
      const f = folhinha(raio * 1.2, P.leafDark);
      fora(f);
      f.rotateZ(0.5);
      // e duas folhinhas bordadas no punho
      for (const a of [0.8, -0.8]) {
        colar(folhinha(m.h * 0.018, P.luvaFolha), g, Math.sin(a) * c.raioPulso * 1.52, c.yPulso, Math.cos(a) * c.raioPulso * 1.52, Math.sin(a), 0, Math.cos(a));
      }
    } else if (estampa === 'gota') {
      fora(gotinha(raio * 0.3), raio * 0.22, -raio * 0.2);
      fora(gotinha(raio * 0.22), -raio * 0.3, raio * 0.25);
      fora(gotinha(raio * 0.18), raio * 0.32, raio * 0.42);
    } else {
      // a JOANINHA: a luva inteira é o casco — bolinhas pretas por toda ela, e
      // uma joaninha inteira pousada no dorso
      const preto = toon(P.joaninhaPreto);
      for (const [a, dy] of [[0.9, 0.35], [2.2, -0.3], [3.5, 0.3], [4.8, -0.35], [5.8, 0.4]] as const) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.17, 8, 6), preto);
        b.scale.z = 0.35;
        colar(b, g, Math.cos(a) * raio * 0.98, c.yMao + dy * raio, Math.sin(a) * raio * 0.98, Math.cos(a), dy * 0.5, Math.sin(a));
      }
      fora(joaninha(raio * 0.36), -raio * 0.05, 0);
    }
    return g;
  };
}

const luvasDeGirassol = luvasCom('girassol');
const luvasDeJoaninha = luvasCom('joaninha');
const luvasDeFolha = luvasCom('folha');
const luvasDeGotinha = luvasCom('gota');

// ================================================================= AS PULSEIRAS

/**
 * A PULSEIRA DE FLORZINHAS: um cordão verde no pulso esquerdo com oito
 * florzinhas em volta, alternando rosa, amarela e branca, e duas folhinhas.
 * Só monta no braço de `-X` (a mão direita segura as coisas do jogo).
 */
function pulseiraDeFlores(m: MedidasCorpo, lado: -1 | 1 = 1): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const c = corpo(m);
  const raio = c.raioPulso * 1.2;
  const y = c.yPulso + m.h * 0.005;
  const cordao = new THREE.Mesh(new THREE.TorusGeometry(raio, m.h * 0.004, 5, 20), toon(P.cordaDeFlor));
  cordao.rotation.x = Math.PI / 2;
  cordao.position.y = y;
  g.add(cordao);
  const cores: Array<[number, number]> = [[P.florRosa, P.flowerYellow], [P.flowerYellow, P.girassolMiolo], [P.florBranca, P.flowerYellow], [P.florLilas, P.flowerYellow]];
  const quantas = 8;
  for (let i = 0; i < quantas; i++) {
    const a = (i / quantas) * Math.PI * 2;
    const [petala, miolo] = cores[i % cores.length];
    const f = florzinha(m.h * 0.012, petala, miolo);
    colar(f, g, Math.cos(a) * raio, y, Math.sin(a) * raio, Math.cos(a), 0, Math.sin(a));
  }
  for (const a of [Math.PI * 0.12, Math.PI * 1.12]) {
    const f = folhinha(m.h * 0.016, P.leafLight);
    colar(f, g, Math.cos(a) * raio * 1.02, y - m.h * 0.008, Math.sin(a) * raio * 1.02, Math.cos(a), 0, Math.sin(a));
  }
  return g;
}

/**
 * A PULSEIRA DE PEDRINHAS COLORIDAS: doze pedrinhas lapidadas (poliedros de
 * facetas grandes, que no toon leem como pedra) em cinco cores — quartzo
 * rosa, ametista, água-marinha, citrino e jade —, com um fecho dourado.
 */
function pulseiraDePedrinhas(m: MedidasCorpo, lado: -1 | 1 = 1): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const c = corpo(m);
  const raio = c.raioPulso * 1.22;
  const y = c.yPulso + m.h * 0.004;
  const cores = [P.pedraQuartzo, P.pedraAmetista, P.pedraAguaMarinha, P.pedraCitrino, P.pedraJade];
  const quantas = 12;
  for (let i = 0; i < quantas; i++) {
    const a = (i / quantas) * Math.PI * 2;
    const geo = i % 2 === 0 ? new THREE.OctahedronGeometry(m.h * 0.0105) : new THREE.IcosahedronGeometry(m.h * 0.0095);
    const pedra = new THREE.Mesh(geo, toon(cores[i % cores.length], { glow: 0.25 }));
    pedra.position.set(Math.cos(a) * raio, y, Math.sin(a) * raio);
    pedra.rotation.set(i * 0.7, i * 1.3, 0);
    g.add(pedra);
  }
  const fecho = new THREE.Mesh(new THREE.TorusGeometry(m.h * 0.006, m.h * 0.0022, 5, 10), toon(P.fechoDourado, { glow: 0.2 }));
  fecho.position.set(0, y - m.h * 0.01, raio + m.h * 0.003);
  g.add(fecho);
  return g;
}

// ============================================================== OS PINS DE CABELO

/**
 * Prende um pin no CABELO, no ângulo `a` a partir do alto (positivo para
 * `+X`), pousado no CONTORNO MEDIDO do cabelo de quem veste — a conta da
 * presilha de estrela e da tiara: raio fixo servia a um dos dois e sumia na
 * juba do outro. O pin olha para fora e um tanto para a frente, senão de
 * frente ele vira um risco.
 */
function noCabelo(m: MedidasCorpo, a: number, pin: THREE.Object3D, frente = 0.55): THREE.Object3D {
  const pivo = new THREE.Group();
  pivo.rotation.z = Math.PI / 2 - a;
  pin.position.x = m.cabelo(a) + m.headR * 0.03;
  pin.rotation.y = Math.PI / 2 - frente;
  pivo.add(pin);
  const g = new THREE.Group();
  g.position.z = m.headR * 0.02;
  g.add(pivo);
  return g;
}

/** o grampinho por trás de cada pin: uma barrinha dourada que "prende" no cabelo */
function comGrampo(m: MedidasCorpo, enfeite: THREE.Object3D): THREE.Group {
  const g = new THREE.Group();
  const grampo = new THREE.Mesh(new THREE.BoxGeometry(m.headR * 0.32, m.headR * 0.04, m.headR * 0.03), toon(P.fechoDourado));
  grampo.position.z = -m.headR * 0.04;
  g.add(grampo);
  g.add(enfeite);
  return g;
}

/** PIN DE MARGARIDA: oito pétalas brancas e o miolo amarelo. */
function pinDeMargarida(m: MedidasCorpo): THREE.Object3D {
  return noCabelo(m, 0.9, comGrampo(m, florzinha(m.headR * 0.26, P.florBranca, P.flowerYellow, 8)));
}

/** PIN DE JOANINHA: a joaninha inteira, pousada no cabelo, andando para cima. */
function pinDeJoaninha(m: MedidasCorpo): THREE.Object3D {
  return noCabelo(m, 0.85, comGrampo(m, joaninha(m.headR * 0.16)));
}

/** PIN DE ABELHINHA: a abelha de perfil, voando para a frente, com uma florzinha. */
function pinDeAbelhinha(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const abelha = abelhinha(m.headR * 0.12);
  abelha.position.set(m.headR * 0.05, m.headR * 0.08, m.headR * 0.03);
  g.add(abelha);
  const flor = florzinha(m.headR * 0.14, P.florRosa, P.flowerYellow);
  flor.position.set(-m.headR * 0.14, -m.headR * 0.1, 0);
  g.add(flor);
  return noCabelo(m, 0.9, comGrampo(m, g));
}

/** PIN DE BORBOLETA: a borboleta lilás e rosa, de asas abertas. */
function pinDeBorboleta(m: MedidasCorpo): THREE.Object3D {
  const b = borboleta(m.headR * 0.22);
  b.rotation.z = -0.35;
  return noCabelo(m, 0.9, comGrampo(m, b));
}

// ========================================================== AS CAMISETAS DE NATUREZA

/**
 * Uma estampa no PEITO de camiseta justa (a cápsula do rig): o desenho
 * montado no plano XY olhando para `+Z`, colado na frente do tronco.
 */
function noPeito(m: MedidasCorpo, desenho: THREE.Object3D, altura = 0.6): THREE.Object3D {
  const g = new THREE.Group();
  const p = noTronco(m, 0, m.legH + m.torsoH * altura, 1.0);
  colar(desenho, g, p.x, p.y, p.z + m.h * 0.004, 0, 0, 1);
  return g;
}

/**
 * CAMISETA DE JOANINHA: creme, com uma joaninha grande no peito subindo por
 * uma folha, e três pegadinhas de bolinha atrás dela — o caminho que ela fez.
 */
function estampaJoaninha(m: MedidasCorpo): THREE.Object3D {
  const d = new THREE.Group();
  const e = m.h * 0.022;
  const folha = folhinha(e * 3.2, P.leafLight);
  folha.rotation.z = -0.6;
  folha.position.set(-e * 0.4, -e * 0.5, 0);
  d.add(folha);
  const j = joaninha(e * 1.05);
  j.rotation.z = -0.35;
  j.position.set(e * 0.3, e * 0.4, e * 0.2);
  d.add(j);
  for (const [x, y] of [[-1.3, -1.4], [-1.6, -0.6], [-1.75, 0.2]] as const) {
    const pinta = new THREE.Mesh(new THREE.SphereGeometry(e * 0.14, 6, 5), toon(P.joaninhaVermelho));
    pinta.scale.z = 0.3;
    pinta.position.set(x * e, y * e, 0);
    d.add(pinta);
  }
  return noPeito(m, d);
}

/** CAMISETA DE BORBOLETA: lilás-clara, com uma borboleta grande e duas pequenas. */
function estampaBorboleta(m: MedidasCorpo): THREE.Object3D {
  const d = new THREE.Group();
  const e = m.h * 0.022;
  const grande = borboleta(e * 1.5);
  d.add(grande);
  const pequena = borboleta(e * 0.6, P.florAzul, P.florRosa);
  pequena.position.set(e * 1.8, e * 1.1, 0);
  pequena.rotation.z = -0.4;
  d.add(pequena);
  const outra = borboleta(e * 0.5, P.flowerYellow, P.florRosa);
  outra.position.set(-e * 1.7, -e * 1.2, 0);
  outra.rotation.z = 0.5;
  d.add(outra);
  return noPeito(m, d);
}

/** CAMISETA DE ABELHINHA: amarelo-mel com a abelha voando por um rastro pontilhado até uma flor. */
function estampaAbelha(m: MedidasCorpo): THREE.Object3D {
  const d = new THREE.Group();
  const e = m.h * 0.022;
  const abelha = abelhinha(e * 0.95);
  abelha.position.set(e * 0.6, e * 0.35, e * 0.15);
  d.add(abelha);
  const flor = florzinha(e * 1.15, P.florRosa, P.flowerYellow);
  flor.position.set(-e * 1.3, -e * 1.0, 0);
  d.add(flor);
  // o rastro do voo: pontinhos numa curva, da flor até a abelha
  for (let i = 1; i < 6; i++) {
    const t = i / 6;
    const ponto = new THREE.Mesh(new THREE.SphereGeometry(e * 0.08, 5, 4), toon(P.abelhaListra));
    ponto.scale.z = 0.3;
    ponto.position.set(-e * 1.3 + t * e * 1.5, -e * 1.0 + t * e * 1.2 + Math.sin(t * Math.PI) * e * 0.7, 0);
    d.add(ponto);
  }
  return noPeito(m, d);
}

/**
 * CAMISETA DE FLORZINHAS: verde-menta com florzinhas espalhadas pela frente e
 * pelas costas (estampa corrida, não um desenho só no peito) — é a camiseta
 * florida "de detalhe": muitas pequenas, e não uma grande.
 */
function estampaFlorzinhas(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const cores: Array<[number, number]> = [[P.florBranca, P.flowerYellow], [P.florRosa, P.flowerYellow], [P.flowerYellow, P.girassolMiolo], [P.florLilas, P.florBranca]];
  // uma grade torta: cada linha deslocada meia casa, com um tremido
  let n = 0;
  for (let linha = 0; linha < 4; linha++) {
    const y = m.legH + m.torsoH * (0.2 + linha * 0.16);
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2 + (linha % 2) * (Math.PI / 9) + Math.sin(k * 3.1 + linha) * 0.08;
      const p = noTronco(m, a, y + Math.sin(k * 1.7 + linha * 2) * m.h * 0.006, 1.01);
      const [petala, miolo] = cores[n++ % cores.length];
      colar(florzinha(m.h * 0.011, petala, miolo), g, p.x, p.y, p.z, p.nx, 0, p.nz);
    }
  }
  return g;
}

/** a manga da camiseta de florzinhas: três florzinhas em volta da manga do rig */
function mangaDeFlorzinhas(m: MedidasCorpo, lado: -1 | 1 = 1): THREE.Object3D {
  const c = corpo(m);
  const g = new THREE.Group();
  const cores = [P.florBranca, P.florRosa, P.flowerYellow];
  for (let i = 0; i < 3; i++) {
    const a = lado * (0.4 + i * 1.3);
    colar(florzinha(m.h * 0.01, cores[i], P.flowerYellow), g, Math.sin(a) * c.raioManga * 1.02, -m.armLen * (0.16 + i * 0.07), Math.cos(a) * c.raioManga * 1.02, Math.sin(a), 0, Math.cos(a));
  }
  return g;
}

// ============================================================== AS CAMISETAS LARGAS

/**
 * A CAMISETA LARGA (oversize) — pedido do Renan: "camisetas que não ficassem
 * coladas no modelo do personagem", como o moletom.
 *
 * É o casco do moletom em versão de verão: um cilindro FECHADO em volta do
 * tronco (fechado para a câmera baixa não enxergar o torso lá dentro), com o
 * ombro caído (a calota baixa) e a BARRA ABAIXO DO QUADRIL, abrindo um tico —
 * camiseta larga cai reto e sobra embaixo, é o que diz "oversize" de longe.
 * A gola careca é um anel de ribana justo no pescoço, e na barra fica uma
 * faixa de pesponto.
 *
 * O RAIO É O DO MOLETOM (`1,1·raioTorso`), e pelo mesmo motivo dele: mais
 * largo, o casco engole o braço colado no corpo e a silhueta vira um bloco.
 * A folga que se VÊ vem da barra comprida e aberta e da manga larga (esta
 * função + `mangaLarga`), e não de um casco gordo.
 */
function camisetaLarga(estampa: (m: MedidasCorpo, frenteZ: number, y: number) => THREE.Object3D) {
  return (m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const { h } = m;
    const c = corpo(m);
    const hipY = m.legH;
    const ombroY = hipY + m.torsoH * 0.86;
    const ACHATA = 0.92;
    const RAIO = c.raioTorso * 1.1;
    const RAIO_BARRA = c.raioTorso * 1.2;
    const BARRA = hipY - h * 0.035;
    const TOPO = ombroY + m.torsoH * 0.02;
    const pano = toon(peca?.cor ?? P.largaCogumelo);
    const panoDuplo = toon(peca?.cor ?? P.largaCogumelo, { doubleSide: true });
    const ribana = toon(peca?.corDetalhe ?? P.largaCogumeloBarra, { doubleSide: true });

    const casco = new THREE.Mesh(new THREE.CylinderGeometry(RAIO, RAIO_BARRA, TOPO - BARRA, 24), pano);
    casco.position.y = (TOPO + BARRA) / 2;
    casco.scale.z = ACHATA;
    g.add(casco);
    // o ombro caído: calota baixa e larga
    const ombro = new THREE.Mesh(new THREE.SphereGeometry(RAIO, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), pano);
    ombro.position.y = TOPO;
    ombro.scale.set(1, 0.36, ACHATA);
    g.add(ombro);
    // a barra: faixa de pesponto, um degrau mais larga
    const barra = new THREE.Mesh(new THREE.CylinderGeometry(RAIO_BARRA * 1.02, RAIO_BARRA * 1.03, h * 0.02, 24, 1, true), ribana);
    barra.position.y = BARRA + h * 0.01;
    barra.scale.z = ACHATA;
    g.add(barra);
    // a gola careca: ribana justa em volta do pescoço (o crânio grande do rig
    // tapa a de trás; a da frente aparece embaixo do queixo)
    const gola = new THREE.Mesh(new THREE.TorusGeometry(c.raioTorso * 0.62, h * 0.009, 6, 20), ribana);
    gola.rotation.x = Math.PI / 2 - 0.25;
    gola.scale.set(1, 0.9, 1);
    gola.position.set(0, TOPO + h * 0.02, c.raioTorso * 0.22);
    g.add(gola);
    // as duas costuras de lado, descendo do ombro à barra: o que dá o "caimento"
    for (const lado of [-1, 1] as const) {
      const costura = new THREE.Mesh(new THREE.BoxGeometry(h * 0.004, TOPO - BARRA, h * 0.004), panoDuplo);
      costura.position.set(lado * (RAIO + RAIO_BARRA) * 0.5 * 1.005, (TOPO + BARRA) / 2, 0);
      costura.rotation.z = lado * Math.atan2(RAIO_BARRA - RAIO, TOPO - BARRA);
      g.add(costura);
    }
    // a estampa grande no peito
    g.add(estampa(m, RAIO * ACHATA, hipY + m.torsoH * 0.5));
    return g;
  };
}

/**
 * A MANGA LARGA das camisetas largas: um tubo aberto e folgado até o
 * cotovelo, com a barra dobrada. Simétrica (sem deslocamento para o lado),
 * então o `lado` não entra na conta.
 */
function mangaLarga(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const ATE = 0.5;
  const pano = toon(peca?.cor ?? P.largaCogumelo, { doubleSide: true });
  const ombro = new THREE.Mesh(new THREE.SphereGeometry(h * 0.06 * w, 12, 10), toon(peca?.cor ?? P.largaCogumelo));
  ombro.position.y = -m.armLen * 0.04;
  ombro.scale.set(1, 0.9, 0.95);
  g.add(ombro);
  const tubo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.058 * w, h * 0.066 * w, m.armLen * ATE, 16, 1, true), pano);
  tubo.position.y = -m.armLen * ATE * 0.5;
  g.add(tubo);
  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.068 * w, h * 0.07 * w, h * 0.022, 16, 1, true),
    toon(peca?.corDetalhe ?? P.largaCogumeloBarra, { doubleSide: true }),
  );
  dobra.position.y = -m.armLen * ATE + h * 0.011;
  g.add(dobra);
  return g;
}

/** estampa da larga de cogumelo: um cogumelo vermelho de bolinhas, com a grama embaixo */
const larguraDaEstampa = (m: MedidasCorpo): number => m.h * 0.026;
function estampaCogumelo(m: MedidasCorpo, frenteZ: number, y: number): THREE.Object3D {
  const g = new THREE.Group();
  const e = larguraDaEstampa(m);
  const d = new THREE.Group();
  const pe = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.42, e * 0.7, 4, 8), toon(P.cogumeloPe));
  pe.scale.z = 0.35;
  pe.position.y = -e * 0.55;
  d.add(pe);
  const chapeu = new THREE.Mesh(new THREE.SphereGeometry(e * 1.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.cogumeloChapeu));
  chapeu.scale.set(1, 0.75, 0.3);
  chapeu.position.y = e * 0.05;
  d.add(chapeu);
  for (const [x, yy, r] of [[-0.6, 0.4, 0.22], [0.15, 0.72, 0.18], [0.7, 0.3, 0.2], [-0.1, 0.28, 0.14]] as const) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(e * r, 8, 6), toon(P.florBranca));
    b.scale.z = 0.3;
    b.position.set(x * e, yy * e, e * 0.35);
    d.add(b);
  }
  for (const x of [-1.1, -0.7, 0.8, 1.15]) {
    const capim = new THREE.Mesh(new THREE.ConeGeometry(e * 0.1, e * 0.55, 4), toon(P.leafLight));
    capim.scale.z = 0.3;
    capim.position.set(x * e, -e * 1.05, 0);
    capim.rotation.z = -x * 0.2;
    d.add(capim);
  }
  colar(d, g, 0, y, frenteZ + m.h * 0.004, 0, 0, 1);
  return g;
}

/** estampa da larga de sapinho: a carinha do sapo verde, de olhão e bochecha rosa */
function estampaSapo(m: MedidasCorpo, frenteZ: number, y: number): THREE.Object3D {
  const g = new THREE.Group();
  const e = larguraDaEstampa(m);
  const d = new THREE.Group();
  const verde = toon(P.sapoVerde);
  const cara = new THREE.Mesh(new THREE.SphereGeometry(e * 1.25, 16, 10), verde);
  cara.scale.set(1.2, 0.8, 0.25);
  d.add(cara);
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(e * 0.48, 12, 8), verde);
    olho.scale.z = 0.3;
    olho.position.set(lado * e * 0.75, e * 0.85, 0);
    d.add(olho);
    const branco = new THREE.Mesh(new THREE.SphereGeometry(e * 0.32, 10, 8), toon(P.florBranca));
    branco.scale.z = 0.3;
    branco.position.set(lado * e * 0.75, e * 0.88, e * 0.1);
    d.add(branco);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(e * 0.16, 8, 6), toon(P.joaninhaPreto));
    pupila.scale.z = 0.3;
    pupila.position.set(lado * e * 0.72, e * 0.84, e * 0.17);
    d.add(pupila);
    const bochecha = new THREE.Mesh(new THREE.SphereGeometry(e * 0.24, 8, 6), toon(P.sapoBochecha));
    bochecha.scale.set(1.2, 0.8, 0.25);
    bochecha.position.set(lado * e * 0.85, -e * 0.15, e * 0.2);
    d.add(bochecha);
  }
  const boca = new THREE.Mesh(new THREE.TorusGeometry(e * 0.45, e * 0.05, 5, 14, Math.PI), toon(P.abelhaListra));
  boca.rotation.z = Math.PI;
  boca.position.set(0, -e * 0.05, e * 0.25);
  d.add(boca);
  colar(d, g, 0, y, frenteZ + m.h * 0.004, 0, 0, 1);
  return g;
}

/** estampa da larga de lavanda: três raminhos de lavanda amarrados com um laço */
function estampaLavanda(m: MedidasCorpo, frenteZ: number, y: number): THREE.Object3D {
  const g = new THREE.Group();
  const e = larguraDaEstampa(m);
  const d = new THREE.Group();
  for (const [x, rot] of [[-0.45, 0.28], [0, 0], [0.45, -0.28]] as const) {
    const ramo = new THREE.Group();
    const haste = new THREE.Mesh(new THREE.BoxGeometry(e * 0.07, e * 2.4, e * 0.05), toon(P.leafDark));
    ramo.add(haste);
    for (let k = 0; k < 7; k++) {
      for (const lado of [-1, 1] as const) {
        const botao = new THREE.Mesh(new THREE.SphereGeometry(e * 0.13, 6, 5), toon(k % 2 ? P.lavandaFlor : P.florLilas));
        botao.scale.set(0.8, 1.1, 0.35);
        botao.position.set(lado * e * 0.1, e * (0.35 + k * 0.13), 0);
        ramo.add(botao);
      }
    }
    ramo.position.set(x * e, 0, 0);
    ramo.rotation.z = rot;
    d.add(ramo);
  }
  const lacinho = new THREE.Group();
  for (const lado of [-1, 1] as const) {
    const ala = new THREE.Mesh(new THREE.SphereGeometry(e * 0.28, 8, 6), toon(P.florRosa));
    ala.scale.set(1.3, 0.8, 0.3);
    ala.position.x = lado * e * 0.3;
    lacinho.add(ala);
  }
  lacinho.position.set(0, -e * 0.4, e * 0.1);
  d.add(lacinho);
  colar(d, g, 0, y, frenteZ + m.h * 0.004, 0, 0, 1);
  return g;
}

const camisetaLargaCogumelo = camisetaLarga(estampaCogumelo);
const camisetaLargaSapo = camisetaLarga(estampaSapo);
const camisetaLargaLavanda = camisetaLarga(estampaLavanda);

// ================================================================ OS VESTIDOS FLORIDOS

/**
 * O VESTIDO FLORIDO: vestido de alça de verão, com a saia em DOIS BABADOS
 * (a de cima justa na cintura, a de baixo abrindo), florido de ponta a ponta.
 *
 * REFERENCIAL: o corpo, y = 0 no CHÃO (`tronco`). A barra fica a 2× o raio do
 * torso pela mesma conta do vestido rosa: é o que a coxa precisa para
 * balançar a 0,62 rad sem atravessar a saia.
 *
 * O corpete é o torso do rig pintado com a `cor` da ficha; esta função põe o
 * que ele não tem: as duas alcinhas, o franzido do decote, a faixa da
 * cintura com o laço, a saia, a barra de renda e AS FLORES — no corpete, na
 * saia de cima e na de baixo, cada uma olhando para fora da superfície em que
 * está pregada (`colar`), em três cores que variam por vestido.
 */
function vestidoFlorido(petalas: readonly number[], miolo: number, folha: number = P.leafLight) {
  return (m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const { h } = m;
    const c = corpo(m);
    const hipY = m.legH;
    const ACHATA = 0.85;
    const corPano = peca?.cor ?? P.vestidoMargarida;
    const pano = toon(corPano, { doubleSide: true });
    const renda = toon(peca?.corDetalhe ?? P.vestidoMargaridaBarra, { doubleSide: true });
    const fitaCor = new THREE.Color(corPano).multiplyScalar(0.8).getHex();
    const fita = toon(fitaCor);

    // ---- o corpete: o franzido do decote e as duas alcinhas
    const decote = new THREE.Mesh(new THREE.CylinderGeometry(c.raioTorso * 1.06, c.raioTorso * 1.04, h * 0.022, 20, 1, true), renda);
    decote.position.y = hipY + m.torsoH * 0.74;
    decote.scale.z = c.ACHATA;
    g.add(decote);
    for (const lado of [-1, 1] as const) {
      const alca = new THREE.Mesh(new THREE.TorusGeometry(c.raioTorso * 0.42, h * 0.006, 5, 12, Math.PI), fita);
      alca.position.set(lado * c.raioTorso * 0.5, hipY + m.torsoH * 0.76, 0);
      alca.rotation.y = Math.PI / 2;
      alca.scale.set(1, 0.9, 0.9);
      g.add(alca);
    }
    // flores no corpete: uma fileira em volta do peito
    for (let k = 0; k < 7; k++) {
      const a = -1.1 + k * (2.2 / 6);
      const p = noTronco(m, a, hipY + m.torsoH * (0.52 + (k % 2) * 0.1), 1.015);
      colar(florzinha(h * 0.011, petalas[k % petalas.length], miolo), g, p.x, p.y, p.z, p.nx, 0, p.nz);
    }

    // ---- a cintura: a faixa e o laço
    const cinta = new THREE.Mesh(new THREE.CylinderGeometry(c.raioTorso * 1.07, c.raioTorso * 1.07, h * 0.026, 20, 1, true), fita);
    cinta.position.y = hipY + m.torsoH * 0.2;
    cinta.scale.z = ACHATA;
    g.add(cinta);
    const lacinho = new THREE.Group();
    for (const lado of [-1, 1] as const) {
      const ala = new THREE.Mesh(new THREE.SphereGeometry(h * 0.014, 10, 8), fita);
      ala.scale.set(1.4, 0.8, 0.45);
      ala.position.x = lado * h * 0.016;
      ala.rotation.z = lado * 0.2;
      lacinho.add(ala);
      const ponta = new THREE.Mesh(new THREE.BoxGeometry(h * 0.008, h * 0.03, h * 0.003), fita);
      ponta.position.set(lado * h * 0.008, -h * 0.018, 0);
      ponta.rotation.z = lado * 0.3;
      lacinho.add(ponta);
    }
    lacinho.position.set(c.raioTorso * 0.5, hipY + m.torsoH * 0.2, c.raioTorso * 0.95 * ACHATA);
    g.add(lacinho);

    // ---- a saia em dois babados
    const topoSaia = hipY + m.torsoH * 0.18;
    const meio = hipY - h * 0.045;
    const barra = hipY - h * 0.14;
    const rCima = c.raioTorso * 1.04;
    const rMeio = c.raioTorso * 1.55;
    const rBarra = c.raioTorso * 2.0;
    const cima = new THREE.Mesh(new THREE.CylinderGeometry(rCima, rMeio, topoSaia - meio, 24, 1, true), pano);
    cima.position.y = (topoSaia + meio) / 2;
    cima.scale.z = ACHATA;
    g.add(cima);
    const baixo = new THREE.Mesh(new THREE.CylinderGeometry(rMeio * 0.97, rBarra, meio - barra + h * 0.012, 24, 1, true), pano);
    baixo.position.y = (meio + barra) / 2 - h * 0.006;
    baixo.scale.z = ACHATA;
    g.add(baixo);
    // o franzido entre os dois babados e a renda na barra
    const franzido = new THREE.Mesh(new THREE.TorusGeometry(rMeio * 0.99, h * 0.006, 5, 28), renda);
    franzido.rotation.x = Math.PI / 2;
    franzido.scale.set(1, ACHATA, 1);
    franzido.position.y = meio;
    g.add(franzido);
    const bainha = new THREE.Mesh(new THREE.CylinderGeometry(rBarra * 1.03, rBarra * 1.09, h * 0.028, 24, 1, true), renda);
    bainha.position.y = barra;
    bainha.scale.z = ACHATA;
    g.add(bainha);

    // ---- as flores da saia: espalhadas nos dois babados, com folhinhas
    const naSaia = (y0: number, y1: number, r0: number, r1: number, t: number, a: number): { x: number; y: number; z: number; nx: number; ny: number; nz: number } => {
      const y = y0 + (y1 - y0) * t;
      const r = (r0 + (r1 - r0) * t) * 1.012;
      const inclina = (r1 - r0) / Math.max(1e-6, y0 - y1);
      return { x: Math.sin(a) * r, y, z: Math.cos(a) * r * ACHATA, nx: Math.sin(a), ny: inclina * 0.6, nz: Math.cos(a) };
    };
    let n = 0;
    const faixas: Array<[number, number, number, number, number, number]> = [
      // y0, y1, r0, r1, quantas por volta, tamanho
      [topoSaia, meio, rCima, rMeio, 11, 0.013],
      [meio, barra, rMeio, rBarra, 14, 0.016],
    ];
    for (const [y0, y1, r0, r1, quantas, tamanho] of faixas) {
      for (const t of [0.3, 0.72]) {
        for (let k = 0; k < quantas; k++) {
          const a = (k / quantas) * Math.PI * 2 + (t > 0.5 ? Math.PI / quantas : 0) + Math.sin(k * 2.3) * 0.06;
          const p = naSaia(y0, y1, r0, r1, t + Math.sin(k * 1.9) * 0.06, a);
          const flor = florzinha(h * tamanho, petalas[n % petalas.length], miolo);
          colar(flor, g, p.x, p.y, p.z, p.nx, p.ny, p.nz);
          if (n % 3 === 0) {
            const f = folhinha(h * tamanho * 1.3, folha);
            const q = naSaia(y0, y1, r0, r1, Math.min(0.95, t + 0.14), a + 0.12);
            colar(f, g, q.x, q.y, q.z, q.nx, q.ny, q.nz);
            f.rotateZ(0.7);
          }
          n++;
        }
      }
    }
    return g;
  };
}

const vestidoDeMargaridas = vestidoFlorido([P.florBranca, P.florBranca, P.flowerYellow], P.flowerYellow);
const vestidoDeRosinhas = vestidoFlorido([P.florRosaFunda, P.florRosa, P.florBranca], P.flowerYellow);
const vestidoDoCampo = vestidoFlorido([P.flowerYellow, P.florBranca, P.florLilas], P.girassolMiolo);

// ================================================================== AS CALÇAS LARGAS

type JeitoDeCalca = 'cargo' | 'pantalona' | 'jardineiro';

/**
 * AS CALÇAS LARGAS DE JARDINAGEM — pedido do Renan: "um modelo um pouco
 * maior, não coladas como as que são hoje". A perna do rig continua pintada
 * com a `cor` da ficha, e por cima dela vai um TUBO FOLGADO que desce do
 * quadril até o tornozelo, abrindo para baixo — é a folga que se vê.
 *
 * REFERENCIAL: o pivô de CADA perna (`pernas`), y = 0 no quadril, a perna em
 * `-Y`. Dobra junto com a coxa na caminhada e no sentar, de graça.
 *
 * O que fica de LADO (o bolso da cargo, a pazinha da de jardineiro) usa o
 * `lado`: "fora" é `+X` na perna de `+X` e `-X` na de `-X`.
 *
 * - `cargo`: cáqui, com o bolsão de lado de tampa e botão, a joelheira verde
 *   costurada (quem planta ajoelha) e a barra dobrada;
 * - `pantalona`: verde-musgo, bem aberta embaixo, com um raminho bordado na
 *   barra e a dobra larga;
 * - `jardineiro`: azul de brim com pesponto amarelo, um remendo de florzinha
 *   no joelho e a pazinha de jardim enfiada no bolso de lado.
 */
function calcaLarga(jeito: JeitoDeCalca) {
  return (m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const { h, w } = m;
    const legH = m.legH;
    const cor = peca?.cor ?? P.calcaCargo;
    const pano = toon(cor, { doubleSide: true });
    const detalhe = peca?.corDetalhe ?? P.calcaCargoBolso;
    const TOPO = legH * 0.03;
    const BARRA = -legH * 0.9;
    const rTopo = h * 0.06 * w;
    const rBarra = h * (jeito === 'pantalona' ? 0.085 : 0.068) * w;
    const comprimento = TOPO - BARRA;
    const tubo = new THREE.Mesh(new THREE.CylinderGeometry(rTopo, rBarra, comprimento, 18, 1, true), pano);
    tubo.position.y = (TOPO + BARRA) / 2;
    g.add(tubo);
    // a tampa de cima fecha o tubo no quadril (senão a câmera baixa vê a perna por dentro)
    const tampa = new THREE.Mesh(new THREE.CircleGeometry(rTopo, 18), pano);
    tampa.rotation.x = -Math.PI / 2;
    tampa.position.y = TOPO;
    g.add(tampa);
    // o raio do tubo numa altura (a superfície em que as coisas se pregam)
    const raioEm = (y: number): number => rTopo + (rBarra - rTopo) * ((TOPO - y) / comprimento);

    // a barra dobrada: um anel mais largo, da cor do detalhe
    const barraCor = jeito === 'jardineiro' ? cor : detalhe;
    const dobra = new THREE.Mesh(
      new THREE.CylinderGeometry(rBarra * 1.04, rBarra * 1.06, h * (jeito === 'pantalona' ? 0.034 : 0.026), 18, 1, true),
      toon(barraCor, { doubleSide: true }),
    );
    dobra.position.y = BARRA + h * 0.013;
    g.add(dobra);

    if (jeito === 'cargo') {
      // o bolsão de lado: caixa com a tampa e o botão
      const yBolso = -legH * 0.36;
      const rB = raioEm(yBolso);
      const bolso = new THREE.Mesh(new THREE.BoxGeometry(h * 0.012, h * 0.06, h * 0.05), toon(detalhe));
      bolso.position.set(lado * (rB + h * 0.004), yBolso, 0);
      g.add(bolso);
      const aba = new THREE.Mesh(new THREE.BoxGeometry(h * 0.016, h * 0.016, h * 0.054), toon(new THREE.Color(detalhe).multiplyScalar(0.85).getHex()));
      aba.position.set(lado * (rB + h * 0.007), yBolso + h * 0.03, 0);
      g.add(aba);
      const botao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.004, 6, 5), toon(P.fechoDourado));
      botao.position.set(lado * (rB + h * 0.016), yBolso + h * 0.028, 0);
      g.add(botao);
      // a joelheira verde, na frente do joelho, com o pesponto em volta
      const yJoelho = -legH * 0.55;
      const joelheira = new THREE.Mesh(new THREE.SphereGeometry(raioEm(yJoelho) * 0.7, 12, 8), toon(P.calcaCargoJoelho));
      joelheira.scale.set(1, 1.15, 0.28);
      joelheira.position.set(0, yJoelho, raioEm(yJoelho) * 0.96);
      g.add(joelheira);
      const pesponto = new THREE.Mesh(new THREE.TorusGeometry(raioEm(yJoelho) * 0.62, h * 0.0022, 4, 18), toon(P.florBranca));
      pesponto.scale.set(1, 1.15, 1);
      pesponto.position.set(0, yJoelho, raioEm(yJoelho) * 1.02);
      g.add(pesponto);
    } else if (jeito === 'pantalona') {
      // um raminho bordado subindo da barra, do lado de fora
      const yR = BARRA + h * 0.07;
      const rR = raioEm(yR);
      const ramo = new THREE.Group();
      const haste = new THREE.Mesh(new THREE.BoxGeometry(h * 0.004, h * 0.07, h * 0.003), toon(P.leafLight));
      ramo.add(haste);
      for (let k = 0; k < 3; k++) {
        for (const s of [-1, 1] as const) {
          const f = folhinha(h * 0.018, P.leafLight);
          f.position.set(s * h * 0.008, -h * 0.02 + k * h * 0.022, 0);
          f.rotation.z = -s * 0.8;
          ramo.add(f);
        }
      }
      const flor = florzinha(h * 0.012, P.florBranca, P.flowerYellow);
      flor.position.y = h * 0.045;
      ramo.add(flor);
      const a = lado * 0.9;
      colar(ramo, g, Math.sin(a) * rR * 1.01, yR, Math.cos(a) * rR * 1.01, Math.sin(a), 0, Math.cos(a));
      // o cós largo: uma faixa um pouco acima da coxa (a cintura de pantalona é alta)
      const cos = new THREE.Mesh(new THREE.CylinderGeometry(rTopo * 1.04, rTopo * 1.04, h * 0.02, 18, 1, true), toon(detalhe, { doubleSide: true }));
      cos.position.y = TOPO - h * 0.012;
      g.add(cos);
    } else {
      // o pesponto amarelo descendo pela lateral de fora, e a costura de dentro
      const costura = toon(peca?.corDetalhe ?? P.calcaJardineiroCostura);
      for (const [x, largura] of [[lado, 1], [-lado, 0.7]] as const) {
        const linha = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003 * largura, comprimento * 0.95, h * 0.003), costura);
        const rMedio = (rTopo + rBarra) / 2;
        linha.position.set(x * rMedio * 1.01, (TOPO + BARRA) / 2, 0);
        linha.rotation.z = -x * Math.atan2(rBarra - rTopo, comprimento);
        g.add(linha);
      }
      // o remendo de florzinha no joelho
      const yJoelho = -legH * 0.52;
      const rJ = raioEm(yJoelho);
      const remendo = new THREE.Mesh(new THREE.BoxGeometry(h * 0.04, h * 0.04, h * 0.003), toon(P.vestidoRosinhaBarra));
      remendo.position.set(0, yJoelho, rJ * 1.01);
      remendo.rotation.z = 0.15;
      g.add(remendo);
      const flor = florzinha(h * 0.013, P.florRosa, P.flowerYellow);
      flor.position.set(0, yJoelho, rJ * 1.01 + h * 0.003);
      g.add(flor);
      // o bolso de lado com a pazinha de jardim enfiada, cabo para cima
      const yBolso = -legH * 0.3;
      const rB = raioEm(yBolso);
      const bolso = new THREE.Mesh(new THREE.BoxGeometry(h * 0.01, h * 0.05, h * 0.045), toon(new THREE.Color(cor).multiplyScalar(0.85).getHex()));
      bolso.position.set(lado * (rB + h * 0.003), yBolso, 0);
      g.add(bolso);
      const pazinha = new THREE.Group();
      const cabo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.006, h * 0.007, h * 0.045, 8), toon(P.pazinhaCabo));
      cabo.position.y = h * 0.035;
      pazinha.add(cabo);
      const lamina = new THREE.Mesh(new THREE.SphereGeometry(h * 0.013, 8, 6), toon(P.pazinhaLamina));
      lamina.scale.set(1, 1.4, 0.35);
      lamina.position.y = -h * 0.002;
      pazinha.add(lamina);
      pazinha.position.set(lado * (rB + h * 0.011), yBolso + h * 0.01, 0);
      pazinha.rotation.y = Math.PI / 2;
      g.add(pazinha);
    }
    return g;
  };
}

const calcaCargoDeJardim = calcaLarga('cargo');
const calcaPantalona = calcaLarga('pantalona');
const calcaDeJardineiro = calcaLarga('jardineiro');

export {
  luvasDeGirassol, luvasDeJoaninha, luvasDeFolha, luvasDeGotinha,
  pulseiraDeFlores, pulseiraDePedrinhas,
  pinDeMargarida, pinDeJoaninha, pinDeAbelhinha, pinDeBorboleta,
  estampaJoaninha, estampaBorboleta, estampaAbelha, estampaFlorzinhas, mangaDeFlorzinhas,
  camisetaLargaCogumelo, camisetaLargaSapo, camisetaLargaLavanda, mangaLarga,
  vestidoDeMargaridas, vestidoDeRosinhas, vestidoDoCampo,
  calcaCargoDeJardim, calcaPantalona, calcaDeJardineiro,
};

// os desenhos e as contas de corpo que as outras levas reaproveitam (o
// vestiário do clube, em `roupasDePiscina.ts`)
export { corpo, florzinha, folhinha, colar, noTronco };
