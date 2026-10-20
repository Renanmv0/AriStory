import * as THREE from 'three';
import { brilhoDeLuz, brilhoEmLote, ceuEmDegrade, flat } from '../core/materials';
import type { SceneAmbient } from '../core/types';
import { PALETTE as P } from '../palette';

/**
 * ========================================================= A NOITE NA CLAREIRA
 *
 * As peças da etapa B do acampamento (`docs/ACAMPAMENTO.md`): o céu de cada
 * momento (do dia ao pôr do sol, à noite e à aurora), a cúpula que mostra
 * esse céu nas tomadas de câmera de cena — com as estrelas, a lua e o sol
 * baixo —, e os vaga-lumes. As luzes da barraca e do varal moram no kit do
 * acampamento (`acenderBarraca`, `acenderVaral`).
 *
 * NENHUMA LUZ NOVA NO MOTOR. A noite é o MESMO sol e o MESMO céu do motor
 * (`g.luzDoCeu`), com outras cores e outra força — de noite, o "sol" é a lua:
 * fraca, azulada, de cima. O que brilha é luz pintada: halo somado à cor de
 * baixo (`brilhoEmLote`) e material com `glow`.
 */

// ================================================================ os momentos

/** O céu de um momento: a luz do motor e a cúpula das tomadas de perto. */
export interface MomentoDoCeu {
  /** o alto da cúpula */
  alto: number;
  /** o horizonte — e a névoa, para o fundo do parque sumir na mesma cor */
  baixo: number;
  ambiente: number;
  forcaAmbiente: number;
  sol: number;
  forcaSol: number;
  /** de onde vem o sol (ou a lua) */
  dirSol: [number, number, number];
  /** 0 a 1: quanto das estrelas e da lua aparece */
  estrelas: number;
}

/** O dia é o do próprio cenário, para a volta acabar exatamente nele. */
export function momentoDoDia(a: SceneAmbient): MomentoDoCeu {
  return {
    alto: a.sky,
    baixo: a.fog ?? a.sky,
    ambiente: a.ambientColor ?? a.sky,
    forcaAmbiente: a.ambientIntensity ?? 1,
    sol: a.sunColor ?? 0xfff2d0,
    forcaSol: a.sunIntensity ?? 1.6,
    dirSol: a.sunDir ?? [14, 20, 9],
    estrelas: 0,
  };
}

/*
 * Leste é `+X` (o lago fica a leste da clareira): o sol se põe a OESTE, atrás
 * da barraca, e nasce a LESTE, atrás do lago. Baixo, ele vem quase deitado.
 */
export const TARDE_DOURADA: MomentoDoCeu = {
  alto: P.ceuDouradoAlto, baixo: P.ceuDouradoBaixo, ambiente: P.luzDourada, forcaAmbiente: 0.95,
  sol: P.solDourado, forcaSol: 1.5, dirSol: [-20, 9, 5], estrelas: 0,
};
export const POR_DO_SOL: MomentoDoCeu = {
  alto: P.ceuPorDoSolAlto, baixo: P.ceuPorDoSolBaixo, ambiente: P.luzPorDoSol, forcaAmbiente: 0.85,
  sol: P.solPorDoSol, forcaSol: 1.15, dirSol: [-22, 3.5, 4], estrelas: 0,
};
export const CREPUSCULO: MomentoDoCeu = {
  alto: P.ceuCrepusculoAlto, baixo: P.ceuCrepusculoBaixo, ambiente: P.luzCrepusculo, forcaAmbiente: 0.8,
  sol: P.solCrepusculo, forcaSol: 0.55, dirSol: [-22, 1.6, 4], estrelas: 0.4,
};
export const NOITE: MomentoDoCeu = {
  alto: P.ceuNoiteAlto, baixo: P.ceuNoiteBaixo, ambiente: P.luzDaNoite, forcaAmbiente: 0.8,
  sol: P.luar, forcaSol: 0.6, dirSol: [-8, 22, -10], estrelas: 1,
};
export const AURORA: MomentoDoCeu = {
  alto: P.ceuAuroraAlto, baixo: P.ceuAuroraBaixo, ambiente: P.luzDaAurora, forcaAmbiente: 0.88,
  // um tico ao norte do leste: da porta da barraca, o sol nasce quase no meio
  // da tomada — dentro do quadro estreito do celular em pé também (±18°)
  sol: P.solNascente, forcaSol: 1.05, dirSol: [22, 3, 2.5], estrelas: 0.15,
};

const ca = new THREE.Color();
const cb = new THREE.Color();
const misturaCor = (a: number, b: number, k: number): number => ca.setHex(a).lerp(cb.setHex(b), k).getHex();

/**
 * A MANHÃ CEDO, entre a aurora e o dia: o sol já subiu um palmo, NO MESMO
 * RUMO da aurora — sobe quase reto, sem deslizar para o lado. Sem ela, a
 * fila ia direto para o sol do meio-dia (alto e bem mais ao sul), e na tela
 * estreita do celular em pé o sol escapava do quadro no meio da conversa.
 */
export const MANHA_CEDO: MomentoDoCeu = {
  alto: P.ceuManhaAlto, baixo: P.ceuManhaBaixo, ambiente: P.luzDaManha, forcaAmbiente: 0.95,
  sol: P.solDaManha, forcaSol: 1.35, dirSol: [22, 7.5, 2.8], estrelas: 0,
};

/** o momento entre `a` e `b` (`k` de 0 a 1), escrito em `alvo` */
export function misturarMomentos(a: MomentoDoCeu, b: MomentoDoCeu, k: number, alvo: MomentoDoCeu): MomentoDoCeu {
  alvo.alto = misturaCor(a.alto, b.alto, k);
  alvo.baixo = misturaCor(a.baixo, b.baixo, k);
  alvo.ambiente = misturaCor(a.ambiente, b.ambiente, k);
  alvo.forcaAmbiente = a.forcaAmbiente + (b.forcaAmbiente - a.forcaAmbiente) * k;
  alvo.sol = misturaCor(a.sol, b.sol, k);
  alvo.forcaSol = a.forcaSol + (b.forcaSol - a.forcaSol) * k;
  alvo.dirSol = [0, 1, 2].map((i) => a.dirSol[i] + (b.dirSol[i] - a.dirSol[i]) * k) as [number, number, number];
  alvo.estrelas = a.estrelas + (b.estrelas - a.estrelas) * k;
  return alvo;
}

/**
 * Uma FILA de momentos, de ponta a ponta em `t` de 0 a 1 (a virada do dia
 * para a noite é `[dia, dourada, pôr do sol, crepúsculo, noite]`). Cada trecho
 * leva o mesmo tempo, e a curva é suave em cada um.
 */
export function momentoNaFila(fila: readonly MomentoDoCeu[], t: number, alvo: MomentoDoCeu): MomentoDoCeu {
  const n = fila.length - 1;
  const x = THREE.MathUtils.clamp(t, 0, 1) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const k = x - i;
  return misturarMomentos(fila[i], fila[i + 1], k * k * (3 - 2 * k), alvo);
}

/** a luz do motor (`g.luzDoCeu`) de um momento */
export function luzDoMomento(m: MomentoDoCeu): Partial<SceneAmbient> {
  return {
    sky: m.baixo,
    fog: m.baixo,
    ambientColor: m.ambiente,
    ambientIntensity: m.forcaAmbiente,
    sunColor: m.sol,
    sunIntensity: m.forcaSol,
    sunDir: m.dirSol,
  };
}

/** um momento novo para servir de `alvo` */
export function momentoEmBranco(): MomentoDoCeu {
  return { ...NOITE, dirSol: [...NOITE.dirSol] as [number, number, number] };
}

// =================================================================== o céu

/** semente determinística, como o `w.rng` (a mesma noite em toda foto) */
function sorteio(semente: number): () => number {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * O CÉU DA CLAREIRA, para as tomadas de câmera de cena (a isométrica olha o
 * chão e nunca vê o céu): uma cúpula de 60 m em volta da clareira com o
 * degradê do momento — o horizonte embaixo, o alto em cima e o CLARÃO do sol
 * em volta dele quando ele está baixo (o pôr do sol atrás da barraca, a
 * aurora atrás do lago) —, as estrelas em lote, a lua e o disco do sol.
 *
 * A cúpula é desenhada antes de tudo e não grava profundidade: árvore,
 * barraca e o resto do parque passam na frente dela, e a névoa (da cor do
 * horizonte) emenda o fundo do parque com o céu.
 */
export class CeuDaClareira {
  readonly group = new THREE.Group();
  private readonly cupula: THREE.Mesh;
  private readonly cores: THREE.BufferAttribute;
  private readonly direcoes: THREE.Vector3[] = [];
  private readonly estrelas: THREE.InstancedMesh;
  /** brilho próprio e fase do piscar de cada estrela */
  private readonly brilhos: Float32Array;
  private readonly fases: Float32Array;
  private readonly lua = new THREE.Group();
  private readonly sol = new THREE.Group();
  private relogio = 0;
  private forcaDasEstrelas = 0;
  private readonly cor = new THREE.Color();
  private readonly alto = new THREE.Color();
  private readonly baixo = new THREE.Color();
  private readonly clarao = new THREE.Color();
  private readonly dir = new THREE.Vector3();

  constructor(private readonly raio = 60, quantasEstrelas = 260) {
    this.group.userData.peca = 'ceu-da-clareira';
    // a meia esfera de cima e um tico abaixo do horizonte (o parque é plano)
    const geo = new THREE.SphereGeometry(raio, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2 + 0.1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) this.direcoes.push(new THREE.Vector3().fromBufferAttribute(pos, i).normalize());
    this.cores = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
    geo.setAttribute('color', this.cores);
    this.cupula = new THREE.Mesh(geo, ceuEmDegrade());
    this.cupula.renderOrder = -10;
    this.cupula.frustumCulled = false;
    this.cupula.userData.semSombra = true;
    this.group.add(this.cupula);

    // AS ESTRELAS: halos pequenos em lote, mais densas no alto
    const rnd = sorteio(9137);
    this.estrelas = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.estrela, 1), quantasEstrelas);
    this.estrelas.userData.semSombra = true;
    this.estrelas.renderOrder = -9;
    this.estrelas.frustumCulled = false;
    this.brilhos = new Float32Array(quantasEstrelas);
    this.fases = new Float32Array(quantasEstrelas);
    const m = new THREE.Object3D();
    const preto = new THREE.Color(0, 0, 0);
    for (let i = 0; i < quantasEstrelas; i++) {
      const a = rnd() * Math.PI * 2;
      // elevação de 10° a 90°, mais estrela no alto (o horizonte tem névoa)
      const el = 0.17 + Math.pow(rnd(), 0.75) * (Math.PI / 2 - 0.17);
      const r = raio * 0.94;
      m.position.set(Math.cos(a) * Math.cos(el) * r, Math.sin(el) * r, Math.sin(a) * Math.cos(el) * r);
      const grande = rnd();
      m.scale.setScalar(grande > 0.93 ? 1.5 + rnd() * 0.6 : 0.55 + rnd() * 0.55);
      m.updateMatrix();
      this.estrelas.setMatrixAt(i, m.matrix);
      this.estrelas.setColorAt(i, preto);
      this.brilhos[i] = grande > 0.93 ? 1 : 0.45 + rnd() * 0.45;
      this.fases[i] = rnd() * Math.PI * 2;
    }
    this.estrelas.instanceMatrix.needsUpdate = true;
    this.group.add(this.estrelas);

    // A LUA: o disco claro, as manchinhas (mares) e o halo, a noroeste — o
    // céu que a tomada da noite olha por cima da barraca
    const disco = new THREE.Mesh(new THREE.CircleGeometry(2.6, 28), flat(P.lua));
    const mares = new THREE.Group();
    for (const [x, y, r] of [[-0.8, 0.5, 0.62], [0.6, -0.4, 0.8], [0.4, 0.9, 0.38], [-0.5, -0.9, 0.42]] as const) {
      const mar = new THREE.Mesh(new THREE.CircleGeometry(r, 16), flat(P.ceuAuroraAlto, 0.22));
      mar.position.set(x, y, 0.05);
      mares.add(mar);
    }
    const haloDaLua = new THREE.Sprite(brilhoDeLuz(P.lua, 0.55));
    haloDaLua.scale.set(15, 15, 1);
    haloDaLua.renderOrder = -8;
    // o halo ATRÁS do disco: no mesmo plano, o quadrado do halo (de frente
    // para a câmera) cortava o disco na diagonal e clareava metade dele
    haloDaLua.position.z = -2;
    this.lua.add(disco, mares, haloDaLua);
    this.lua.position.set(-0.52, 0.62, -0.59).normalize().multiplyScalar(raio * 0.9);
    deFrenteParaOMeio(this.lua);
    this.lua.visible = false;
    this.group.add(this.lua);

    // O SOL BAIXO: o disco e o halo largo (pôr do sol e aurora)
    const discoDoSol = new THREE.Mesh(new THREE.CircleGeometry(3.4, 28), flat(P.solDoCeu));
    const haloDoSol = new THREE.Sprite(brilhoDeLuz(P.solNascente, 0.7));
    haloDoSol.scale.set(26, 26, 1);
    haloDoSol.renderOrder = -8;
    haloDoSol.position.z = -2;
    this.sol.add(discoDoSol, haloDoSol);
    this.sol.visible = false;
    this.group.add(this.sol);

    this.group.traverse((o) => {
      o.userData.semSombra = true;
      o.frustumCulled = false;
    });
    this.group.visible = false;
  }

  /** pinta o céu do momento: a cúpula, o sol baixo, a lua e as estrelas */
  aplicar(m: MomentoDoCeu): void {
    this.alto.setHex(m.alto);
    this.baixo.setHex(m.baixo);
    this.clarao.setHex(m.sol);
    this.dir.set(...m.dirSol).normalize();
    // o sol só aparece (e o clarão só pinta o horizonte) quando está BAIXO —
    // até uns 26° (a manhã cedo ainda mostra o disco)
    const baixo = THREE.MathUtils.clamp(1 - this.dir.y / 0.45, 0, 1);
    const forcaDoClarao = baixo * Math.min(1, m.forcaSol);
    for (let i = 0; i < this.direcoes.length; i++) {
      const d = this.direcoes[i];
      const subida = Math.pow(THREE.MathUtils.clamp(d.y, 0, 1), 0.55);
      this.cor.copy(this.baixo).lerp(this.alto, subida);
      const perto = Math.max(0, d.dot(this.dir));
      this.cor.lerp(this.clarao, Math.pow(perto, 6) * forcaDoClarao * (1 - subida * 0.6));
      this.cores.setXYZ(i, this.cor.r, this.cor.g, this.cor.b);
    }
    this.cores.needsUpdate = true;

    this.sol.visible = baixo > 0.05 && m.forcaSol > 0.7;
    if (this.sol.visible) {
      // um tico acima do horizonte, mesmo quando a luz já vem deitada
      this.sol.position.copy(this.dir).setY(Math.max(this.dir.y, 0.05)).normalize().multiplyScalar(this.raio * 0.9);
      deFrenteParaOMeio(this.sol);
    }
    this.forcaDasEstrelas = m.estrelas;
    this.lua.visible = m.estrelas > 0.45;
    this.pintarEstrelas();
  }

  /** o piscar das estrelas (o relógio do jogo) */
  update(dt: number): void {
    if (!this.group.visible || this.forcaDasEstrelas <= 0) return;
    this.relogio += dt;
    this.pintarEstrelas();
  }

  set visivel(v: boolean) {
    this.group.visible = v;
  }

  private pintarEstrelas(): void {
    const n = this.estrelas.count;
    const k = this.forcaDasEstrelas;
    for (let i = 0; i < n; i++) {
      // as fracas aparecem por último: a primeira estrela é a mais forte
      const aparece = THREE.MathUtils.clamp((k - (1 - this.brilhos[i]) * 0.7) / 0.3, 0, 1);
      const pisca = 0.78 + 0.22 * Math.sin(this.relogio * (1.3 + (i % 5) * 0.4) + this.fases[i]);
      this.estrelas.setColorAt(i, this.cor.setScalar(aparece * this.brilhos[i] * pisca));
    }
    if (this.estrelas.instanceColor) this.estrelas.instanceColor.needsUpdate = true;
  }
}

/**
 * Vira o disco (a face `+Z`) para o MEIO da cúpula. Não é `lookAt(0, 0, 0)`:
 * o `lookAt` mira no MUNDO, e a cúpula mora na clareira — o disco saía de
 * lado, como uma lua minguante.
 */
const FRENTE = new THREE.Vector3(0, 0, 1);
function deFrenteParaOMeio(disco: THREE.Object3D): void {
  disco.quaternion.setFromUnitVectors(FRENTE, disco.position.clone().negate().normalize());
}

// ============================================================== os vaga-lumes

interface VagaLume {
  x: number;
  y: number;
  z: number;
  /** as fases e as velocidades do passeio */
  f: [number, number, number];
  w: [number, number, number];
  /** o relógio do piscar e quanto dura uma volta dele */
  pisca: number;
  periodo: number;
}

/**
 * OS VAGA-LUMES da borda da clareira: um pontinho verde-limão e um halo,
 * em DOIS lotes para todos (o ponto e o halo). Cada um passeia devagar em
 * volta do lugar dele (três senos defasados) e PISCA: acende macio, fica um
 * instante e apaga, de tempos em tempos — e cada um no seu tempo, senão a
 * clareira inteira piscaria junto como enfeite de Natal.
 *
 * `brilho` (0 a 1) é a noite: no crepúsculo eles vão aparecendo, e de dia
 * somem. `centro` e os raios são do mundo; a peça mora na origem.
 */
export class VagaLumes {
  readonly group = new THREE.Group();
  private readonly pontos: THREE.InstancedMesh;
  private readonly halos: THREE.InstancedMesh;
  private readonly bichos: VagaLume[] = [];
  private relogio = 0;
  private readonly m = new THREE.Object3D();
  private readonly cor = new THREE.Color();

  constructor(
    centro: { x: number; z: number },
    raioMin: number,
    raioMax: number,
    quantos = 26,
    semente = 4242,
    /** onde não pode ter vaga-lume parado (a barraca), no mundo */
    fora: ReadonlyArray<{ x: number; z: number; r: number }> = [],
  ) {
    this.group.userData.peca = 'vaga-lumes';
    const rnd = sorteio(semente);
    for (let i = 0; i < quantos * 4 && this.bichos.length < quantos; i++) {
      const a = rnd() * Math.PI * 2;
      const r = raioMin + Math.sqrt(rnd()) * (raioMax - raioMin);
      const x = centro.x + Math.cos(a) * r;
      const z = centro.z + Math.sin(a) * r;
      if (fora.some((f) => Math.hypot(x - f.x, z - f.z) < f.r)) continue;
      this.bichos.push({
        x, z, y: 0.3 + rnd() * 1.35,
        f: [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28],
        w: [0.25 + rnd() * 0.3, 0.2 + rnd() * 0.3, 0.5 + rnd() * 0.6],
        pisca: rnd() * 3,
        periodo: 1.8 + rnd() * 2.6,
      });
    }
    const n = this.bichos.length;
    this.pontos = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, 8, 6), flat(P.vagaLume), n);
    this.halos = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), brilhoEmLote(P.vagaLumeBrilho, 0.95), n);
    this.halos.renderOrder = 62;
    const preto = new THREE.Color(0, 0, 0);
    for (let i = 0; i < n; i++) this.halos.setColorAt(i, preto);
    for (const lote of [this.pontos, this.halos]) {
      lote.frustumCulled = false; // eles andam
      lote.userData.semSombra = true;
      this.group.add(lote);
    }
    this.group.visible = false;
  }

  /** um passo: o passeio e o piscar; `brilho` é quanto da noite já chegou */
  update(dt: number, brilho: number): void {
    this.group.visible = brilho > 0.01;
    if (!this.group.visible) return;
    this.relogio += dt;
    const t = this.relogio;
    for (let i = 0; i < this.bichos.length; i++) {
      const b = this.bichos[i];
      b.pisca += dt;
      // o pulso: sobe em 0,25 do período, desce em 0,35, e o resto apagado
      const fase = (b.pisca % b.periodo) / b.periodo;
      const pulso = fase < 0.25 ? Math.sin((fase / 0.25) * Math.PI * 0.5) : fase < 0.6 ? Math.cos(((fase - 0.25) / 0.35) * Math.PI * 0.5) : 0;
      const luz = (0.06 + 0.94 * pulso) * brilho;
      this.m.position.set(
        b.x + Math.sin(t * b.w[0] + b.f[0]) * 0.55,
        b.y + Math.sin(t * b.w[2] + b.f[2]) * 0.18,
        b.z + Math.cos(t * b.w[1] + b.f[1]) * 0.55,
      );
      this.m.scale.setScalar(0.35 + 0.65 * luz);
      this.m.updateMatrix();
      this.pontos.setMatrixAt(i, this.m.matrix);
      this.m.scale.setScalar(0.36);
      this.m.updateMatrix();
      this.halos.setMatrixAt(i, this.m.matrix);
      this.halos.setColorAt(i, this.cor.setScalar(luz));
    }
    this.pontos.instanceMatrix.needsUpdate = true;
    this.halos.instanceMatrix.needsUpdate = true;
    if (this.halos.instanceColor) this.halos.instanceColor.needsUpdate = true;
  }

  /** quantos estão acesos agora (o teste mede por aqui) */
  get acesos(): number {
    const c = this.halos.instanceColor;
    if (!c || !this.group.visible) return 0;
    let n = 0;
    for (let i = 0; i < this.halos.count; i++) if (c.getX(i) > 0.4) n++;
    return n;
  }
}
