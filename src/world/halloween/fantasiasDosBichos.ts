import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir } from '../fundir';
import { medidorDePasso, espelhada } from '../fantasias';
import type { Estella } from '../../entities/bichos/Estella';
import type { Pelusa } from '../../entities/bichos/Pelusa';

/**
 * AS FANTASIAS DOS BICHOS na boutique (`docs/HALLOWEEN.md`, §2.3.1).
 *
 * É CAMADA, como o resto do evento: a classe da Estella e a do Pelusa não
 * mudam uma linha. Estas funções recebem o bicho JÁ MONTADO e penduram a
 * fantasia nos grupos dele (o corpo, a cabeça), achados pela posição que a
 * classe dá a eles — o cérebro e a pose continuam os de sempre.
 *
 * - A ESTELLA DE ARANHA, "do jeito dela" (pedido do Renan): nas cores da
 *   loja — o rosa do toldo, o vinho e o rosa-antigo da boutique —, e não no
 *   preto de aranha de verdade. Mais quatro patinhas de feltro listradas (com
 *   as quatro dela dá oito), a tiara de seis olhinhos, o novelo de lã no lombo
 *   com o fio virando teia no flanco, e o laço de aranha. A fita métrica e os
 *   óculos continuam: ela continua sendo ela.
 * - O PELUSA MORCEGUINHO: as asinhas e as orelhinhas de morcego, dormindo em
 *   pãozinho no pufe, de olhos fechados.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

/** as listras de feltro das patinhas: rosa e vinho, correndo ao longo da perna */
let listrasDaPata: THREE.CanvasTexture | null = null;
function texturaDaPata(): THREE.CanvasTexture {
  if (listrasDaPata) return listrasDaPata;
  const cv = document.createElement('canvas');
  cv.width = 128;
  cv.height = 32;
  const ctx = cv.getContext('2d');
  if (ctx) {
    ctx.fillStyle = css(P.lojaToldo);
    ctx.fillRect(0, 0, 128, 32);
    ctx.fillStyle = css(P.boutiqueVinho);
    ctx.fillRect(64, 0, 64, 32);
    // o pesponto: tracinhos claros na junta de cada listra
    ctx.fillStyle = 'rgba(255,240,240,0.55)';
    for (const x of [62, 126]) for (let y = 2; y < 32; y += 8) ctx.fillRect(x, y, 3, 4);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  listrasDaPata = t;
  return t;
}

/** o filho de `pai` que está nesta posição (os grupos da classe não têm nome) */
function filhoEm(pai: THREE.Object3D, x: number, y: number, z: number): THREE.Object3D | null {
  return pai.children.find((o) => Math.abs(o.position.x - x) < 1e-3 && Math.abs(o.position.y - y) < 1e-3 && Math.abs(o.position.z - z) < 1e-3) ?? null;
}

// ====================================================== a Estella de aranha

/** um olhinho de feltro com o brilho e os três cílios (olha para `+Z`) */
function olhinho(raio: number): THREE.Group {
  const g = new THREE.Group();
  const branco = new THREE.Mesh(new THREE.SphereGeometry(raio, 14, 10), toon(P.boutiqueRosaClaro));
  branco.scale.z = 0.55;
  g.add(branco);
  const pupila = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.62, 12, 8), toon(P.boutiqueVinho));
  pupila.scale.z = 0.5;
  pupila.position.set(0, -raio * 0.12, raio * 0.3);
  g.add(pupila);
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.2, 6, 5), toon(0xffffff));
  brilho.position.set(-raio * 0.22, raio * 0.12, raio * 0.6);
  g.add(brilho);
  const cilio = toon(P.boutiqueVinho);
  for (let k = -1; k <= 1; k++) {
    const c = new THREE.Mesh(new THREE.CapsuleGeometry(raio * 0.07, raio * 0.35, 2, 4), cilio);
    const a = k * 0.55;
    c.position.set(Math.sin(a) * raio * 1.02, Math.cos(a) * raio * 1.02, 0);
    c.rotation.z = -a;
    g.add(c);
  }
  return g;
}

/**
 * Veste a Estella de ARANHA. Devolve o grupo da fantasia (para o teste
 * achar) — as patinhas de feltro balançam sozinhas, mais andando.
 */
export function fantasiarEstellaDeAranha(estella: Estella): THREE.Group {
  const cabeca = estella.group.getObjectByName('cabeca-da-estella');
  const corpo = cabeca?.parent;
  const fantasia = new THREE.Group();
  fantasia.name = 'fantasia-de-aranha';
  if (!cabeca || !corpo) return fantasia;
  corpo.add(fantasia);

  // --------------------------------------------------- as patinhas de feltro
  /*
   * QUATRO, duas de cada lado, saindo do flanco ENTRE as patas de verdade (que
   * ficam em z = ±0,26): sobem num arco até o "joelho" e caem para fora, com
   * o pompom na ponta, sem chegar ao chão — patinha de pelúcia pendurada, não
   * perna que pisa (pisar pediria passo próprio, e ela anda com as quatro dela).
   */
  const feltro = toon(0xffffff, { mapa: texturaDaPata() });
  const pompom = toon(P.boutiqueRosaAntigo);
  const joelho = toon(P.boutiqueVinho);
  const pivos: THREE.Group[] = [];
  for (const lado of [-1, 1] as const) {
    for (const [z, abre] of [[0.12, 0.35], [-0.1, -0.3]] as const) {
      const pivo = new THREE.Group();
      pivo.position.set(lado * 0.3, 0.64, z);
      const curva = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(lado * 0.12, 0.1, abre * 0.15),
        new THREE.Vector3(lado * 0.24, 0.12, abre * 0.3),
        new THREE.Vector3(lado * 0.33, 0.0, abre * 0.42),
        new THREE.Vector3(lado * 0.38, -0.2, abre * 0.48),
        new THREE.Vector3(lado * 0.39, -0.34, abre * 0.5),
      ]);
      const perna = new THREE.Mesh(new THREE.TubeGeometry(curva, 40, 0.032, 10, false), feltro);
      pivo.add(perna);
      const bola = new THREE.Mesh(new THREE.SphereGeometry(0.047, 12, 10), pompom);
      bola.position.copy(curva.getPoint(1));
      pivo.add(bola);
      const junta = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), joelho);
      junta.position.copy(curva.getPoint(0.42));
      pivo.add(junta);
      pivo.userData.lado = lado;
      pivo.userData.base = pivo.rotation.z;
      fantasia.add(pivo);
      pivos.push(pivo);
    }
  }

  // --------------------------------------------------- a tiara de olhinhos
  /*
   * Uma faixa vinho por cima do topete, de orelha a orelha, e os SEIS olhinhos
   * em duas fileiras: dois grandes na frente, embaixo, e quatro pequenos atrás
   * e mais alto — o arranjo dos olhos de aranha, em feltro fofo.
   */
  const tiara = new THREE.Group();
  const arco: THREE.Vector3[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = -1.25 + (2.5 * i) / 20;
    arco.push(new THREE.Vector3(Math.sin(a) * 0.205, 0.02 + Math.cos(a) * 0.19, -0.01));
  }
  tiara.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arco), 40, 0.013, 6, false), toon(P.boutiqueVinho)));
  const haste = toon(P.boutiqueVinho);
  for (const [x, y, z, r] of [
    [-0.06, 0.27, 0.03, 0.036], [0.06, 0.27, 0.03, 0.036],
    [-0.15, 0.25, -0.0, 0.024], [0.15, 0.25, -0.0, 0.024],
    [-0.09, 0.33, -0.01, 0.022], [0.09, 0.33, -0.01, 0.022],
  ] as const) {
    // a hastinha de arame encapado, da faixa até o olho
    const de = new THREE.Vector3(x * 0.8, 0.2, -0.01);
    const ate = new THREE.Vector3(x, y, z);
    const fio = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(de, ate), 3, 0.005, 5, false), haste);
    tiara.add(fio);
    const o = olhinho(r);
    o.position.copy(ate);
    o.lookAt(ate.x * 1.6, ate.y + 0.05, ate.z + 0.5);
    tiara.add(o);
  }
  cabeca.add(fundir(tiara));

  // o LAÇO do topete vai para o lado da tiara e vira laço de aranha: vinho,
  // com bolinhas rosa
  const laco = filhoEm(cabeca, 0, 0.21, 0.03);
  if (laco) {
    laco.position.set(0.17, 0.15, 0.02);
    laco.rotation.z = -0.5;
    const vinho = toon(P.boutiqueVinho);
    laco.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (m.geometry as THREE.BufferGeometry).type === 'ConeGeometry') m.material = vinho;
    });
    for (const lado of [-1, 1]) {
      for (const [dx, dy] of [[0.035, 0.008], [0.06, -0.006]] as const) {
        const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 5), toon(P.lojaToldo));
        bolinha.position.set(lado * dx, dy, 0.022);
        laco.add(bolinha);
      }
    }
  }

  // --------------------------------------------- o novelo e a teia de lã
  const novelo = new THREE.Group();
  novelo.position.set(0.02, 0.99, -0.22);
  const la = toon(P.lojaToldo);
  const fioDaLa = toon(new THREE.Color(P.lojaToldo).multiplyScalar(0.82).getHex());
  novelo.add(new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), la));
  // as voltas do fio enrolado, em várias direções
  for (let k = 0; k < 6; k++) {
    const volta = new THREE.Mesh(new THREE.TorusGeometry(0.086, 0.006, 5, 28), fioDaLa);
    volta.rotation.set(k * 0.9, k * 1.7, k * 0.4);
    novelo.add(volta);
  }
  fantasia.add(fundir(novelo));
  // A TEIA no flanco de −X (o que a câmera vê quando ela está na porta): os
  // raios e três voltas de fio, e o fio que sai do novelo e desce até ela
  const teia = new THREE.Group();
  teia.position.set(-0.37, 0.62, -0.04);
  teia.rotation.y = -Math.PI / 2;
  const fioClaro = toon(P.boutiqueRosaClaro);
  const RAIOS = 7;
  const R = 0.15;
  for (let k = 0; k < RAIOS; k++) {
    const a = (k / RAIOS) * Math.PI * 2;
    const raio = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0)), 2, 0.004, 4, false), fioClaro);
    teia.add(raio);
  }
  for (const f of [0.38, 0.66, 0.94]) {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= RAIOS; k++) {
      const a = (k / RAIOS) * Math.PI * 2;
      // a volta afunda um tico entre um raio e outro, como fio de verdade
      pts.push(new THREE.Vector3(Math.cos(a) * R * f, Math.sin(a) * R * f, 0));
      if (k < RAIOS) {
        const am = ((k + 0.5) / RAIOS) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(am) * R * f * 0.9, Math.sin(am) * R * f * 0.9, 0));
      }
    }
    teia.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 60, 0.0035, 4, true), fioClaro));
  }
  fantasia.add(fundir(teia));
  {
    const de = novelo.position.clone().add(new THREE.Vector3(-0.07, -0.03, 0.02));
    const ate = teia.position.clone().add(new THREE.Vector3(0, 0.15, 0));
    const meio = de.clone().lerp(ate, 0.5).add(new THREE.Vector3(-0.06, 0.02, 0.04));
    fantasia.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(de, meio, ate), 16, 0.005, 5, false), la));
  }

  // ------------------------------------------------- as patinhas balançam
  const passo = medidorDePasso();
  let fase = 0;
  let ultima = 0;
  let quadroVisto = -1;
  const primeira = pivos[0].children[0] as THREE.Mesh;
  primeira.onBeforeRender = (renderer) => {
    const quadro = renderer.info.render.frame;
    if (quadro === quadroVisto) return;
    quadroVisto = quadro;
    const agora = performance.now();
    const dt = ultima ? Math.min(0.1, (agora - ultima) / 1000) : 0;
    ultima = agora;
    const v = Math.min(1, Math.abs(passo(estella.group, dt)) / 0.5);
    fase += dt * (1.6 + 7 * v);
    pivos.forEach((p, i) => {
      const lado = p.userData.lado as number;
      const onda = Math.sin(fase - i * 0.9);
      p.rotation.z = lado * onda * (0.05 + 0.14 * v);
      p.rotation.x = Math.sin(fase * 0.5 + i) * 0.05 * (1 + v);
    });
  };
  return fantasia;
}

// ===================================================== o Pelusa morceguinho

/**
 * Veste o Pelusa de MORCEGUINHO e põe ele para DORMIR em pãozinho (quem
 * decide onde é a cena). Devolve o `update` que a cena chama DEPOIS do
 * `pelusa.update(dt)`: ele fecha os olhos (a pose do gato deixa meio
 * abertos) e faz a respiração lenta de quem dorme.
 */
export function pelusaMorceguinho(pelusa: Pelusa): (dt: number) => void {
  const corpo = pelusa.group.children[0];
  const cabeca = corpo ? filhoEm(corpo, 0, 0.288, 0.152) : null;
  pelusa.deitar(true);
  pelusa.entrarEmServico();
  if (!corpo || !cabeca) return () => {};

  // as ASINHAS: duas asas de feltro roxo nas costas, abertas e deitadinhas
  const feltro = toon(P.morceguinhoFeltro);
  const membrana = toon(P.morceguinhoMembrana);
  const e = 0.13;
  const forma = new THREE.Shape();
  forma.moveTo(0, e * 0.12);
  forma.quadraticCurveTo(e * 0.42, e * 0.6, e, e * 0.45);
  forma.quadraticCurveTo(e * 0.95, e * 0.12, e * 0.98, -e * 0.08);
  forma.quadraticCurveTo(e * 0.8, e * 0.02, e * 0.66, -e * 0.15);
  forma.quadraticCurveTo(e * 0.5, -e * 0.02, e * 0.36, -e * 0.22);
  forma.quadraticCurveTo(e * 0.2, -e * 0.05, 0, -e * 0.1);
  forma.closePath();
  const geo = new THREE.ExtrudeGeometry(forma, { depth: 0.004, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 10 });
  const asas = new THREE.Group();
  asas.position.set(0, 0.215, -0.03);
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(lado > 0 ? geo : espelhada(geo), membrana);
    // deitada sobre o lombo, abrindo para o lado e um pouco para cima
    asa.rotation.set(-Math.PI / 2 + 0.6, 0, lado * 0.3);
    asa.position.x = lado * 0.012;
    asas.add(asa);
    // o braço da asa (a borda de cima), em cordão de feltro escuro
    const pontos = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, e * 0.12, 0.006), new THREE.Vector3(e * 0.42, e * 0.6, 0.006), new THREE.Vector3(e, e * 0.45, 0.006),
    ).getPoints(12).map((p) => p.setX(p.x * lado));
    const borda = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 16, 0.006, 5, false), feltro);
    borda.rotation.copy(asa.rotation);
    borda.position.copy(asa.position);
    asas.add(borda);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), feltro);
  miolo.scale.y = 0.6;
  asas.add(miolo);
  corpo.add(fundir(asas));

  // as ORELHINHAS de morcego numa faixinha, atrás das orelhas de gato
  const tiara = new THREE.Group();
  const arco: THREE.Vector3[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = -1.1 + (2.2 * i) / 12;
    arco.push(new THREE.Vector3(Math.sin(a) * 0.098, 0.005 + Math.cos(a) * 0.098, -0.035));
  }
  tiara.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arco), 24, 0.007, 5, false), feltro));
  const orelha = new THREE.Shape();
  orelha.moveTo(-0.025, 0);
  orelha.quadraticCurveTo(-0.03, 0.05, 0.004, 0.08);
  orelha.quadraticCurveTo(0.015, 0.06, 0.03, 0.055);
  orelha.quadraticCurveTo(0.024, 0.035, 0.036, 0.02);
  orelha.quadraticCurveTo(0.03, 0.006, 0.025, 0);
  orelha.closePath();
  const geoOrelha = new THREE.ExtrudeGeometry(orelha, { depth: 0.004, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 8 });
  for (const lado of [-1, 1] as const) {
    const o = new THREE.Mesh(lado > 0 ? geoOrelha : espelhada(geoOrelha), feltro);
    const a = lado * 0.78;
    o.position.set(Math.sin(a) * 0.1, 0.005 + Math.cos(a) * 0.1, -0.037);
    o.rotation.z = -a * 0.9;
    tiara.add(o);
  }
  cabeca.add(fundir(tiara));

  // os olhos (esferas na frente da cabeça) e a respiração de quem dorme
  const olhos = cabeca.children.filter((o) => Math.abs(Math.abs(o.position.x) - 0.044) < 1e-3 && Math.abs(o.position.z - 0.09) < 1e-3);
  let relogio = 0;
  return (dt) => {
    relogio += dt;
    for (const o of olhos) o.scale.y = 0.1;
    const respira = 1 + Math.sin(relogio * 1.6) * 0.035;
    corpo.scale.set(1 + (respira - 1) * 0.6, respira, 1);
  };
}
