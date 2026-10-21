import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SomNome } from '../audio/efeitos';
import { brilhoDeLuz, flat, luzNoChao, toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * ================================================== O RADINHO DE PILHA
 *
 * A etapa D do acampamento (`docs/ACAMPAMENTO.md`): o radinho que o Renan
 * pediu para a dança lenta — "um pequeno radinho bonitinho que será onde
 * vamos interagir para dançar na parte da noite; de manhã não faz nada".
 *
 * Um rádio portátil antigo, de pilha: o corpo verde-menta de quina macia, o
 * painel creme, o alto-falante redondo de grade furadinha com o aro cromado,
 * o mostrador de sintonia com a escala de FM (e um coraçãozinho na estação
 * deles), dois botões serrilhados, o ledzinho, a alça de couro e a antena
 * telescópica deitada em cima.
 *
 * LIGAR É UMA COREOGRAFIA, não um interruptor: o botão do volume gira e
 * estala, o led acende, o mostrador clareia âmbar (piscando um tico, como
 * lâmpada velha), a antena levanta e estica gomo por gomo, e a agulha corre
 * a escala com o botão de sintonia girando junto — passa do ponto, volta e
 * assenta no coraçãozinho. TOCANDO, ele vive: o corpo inteiro pulsa no
 * tempo da música (estica e achata, de desenho animado), balança devagar de
 * um lado para o outro, o miolo do alto-falante bate e saem notinhas
 * coloridas boiando para cima (um `InstancedMesh` só para todas).
 *
 * Contrato do kit: base em `y = 0`, frente em `+Z`, centrado. O que se mexe
 * tem nome (fronteira da `fundir()`): o `corpo` (que pulsa), a `antena`, os
 * dois botões, a `agulha`, o `cone`. O que acende troca de malha (o led
 * aceso e o apagado são duas) ou é luz pintada (o mostrador), nunca troca de
 * material em malha juntada.
 */

/** a batida da dança lenta: a mesma do clima `'danca-lenta'` (`audio/musica.ts`) */
export const BATIDA_DO_RADINHO = 66;

/** onde a agulha mora na escala (0 a 1): o coraçãozinho, a estação deles */
const ESTACAO = 0.62;
/** o corpo: largura, altura e fundo (a alça e a antena passam disso) */
const L = 0.34;
const A = 0.2;
const F = 0.11;
/** a altura dos pezinhos: o corpo começa aqui */
const PE = 0.012;
/** o mostrador, no quadro do corpo */
const DIAL = { x: 0.07, y: 0.128, l: 0.1, a: 0.038 };
/** quanto cada gomo da antena sai de dentro do anterior */
const GOMO = 0.074;

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

function macia(l: number, a: number, p: number, raio: number, segs = 3): THREE.BufferGeometry {
  return new RoundedBoxGeometry(l, a, p, segs, Math.min(raio, l / 2 - 0.0005, a / 2 - 0.0005, p / 2 - 0.0005));
}

function por(pai: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

let texturaDaGrade: THREE.CanvasTexture | null = null;
/** a grade do alto-falante: o cromado escovado com os furinhos em colmeia */
function gradeDoAltoFalante(): THREE.CanvasTexture {
  if (texturaDaGrade) return texturaDaGrade;
  const tela = document.createElement('canvas');
  tela.width = 128;
  tela.height = 128;
  const c = tela.getContext('2d');
  if (c) {
    const fundo = c.createRadialGradient(54, 50, 6, 64, 64, 70);
    fundo.addColorStop(0, '#eef1f4');
    fundo.addColorStop(1, css(P.radinhoCromo));
    c.fillStyle = fundo;
    c.fillRect(0, 0, 128, 128);
    c.fillStyle = css(P.radinhoGrade);
    const passo = 8.5;
    for (let linha = 0; linha * passo * 0.87 < 136; linha++) {
      const y = 4 + linha * passo * 0.87;
      for (let x = (linha % 2) * passo * 0.5; x < 132; x += passo) {
        c.beginPath();
        c.arc(x, y, 2.5, 0, Math.PI * 2);
        c.fill();
      }
    }
  }
  texturaDaGrade = new THREE.CanvasTexture(tela);
  texturaDaGrade.colorSpace = THREE.SRGBColorSpace;
  texturaDaGrade.anisotropy = 4;
  return texturaDaGrade;
}

let texturaDoMostrador: THREE.CanvasTexture | null = null;
/** o mostrador: a escala de FM com os risquinhos, os números e o coraçãozinho da estação */
function mostrador(): THREE.CanvasTexture {
  if (texturaDoMostrador) return texturaDoMostrador;
  const tela = document.createElement('canvas');
  tela.width = 256;
  tela.height = 96;
  const c = tela.getContext('2d');
  if (c) {
    c.fillStyle = css(P.radinhoMostrador);
    c.fillRect(0, 0, 256, 96);
    // um degradê de vidro velho: mais claro no meio
    const brilho = c.createLinearGradient(0, 0, 0, 96);
    brilho.addColorStop(0, 'rgba(255,255,255,0.35)');
    brilho.addColorStop(0.5, 'rgba(255,255,255,0)');
    brilho.addColorStop(1, 'rgba(120,80,30,0.18)');
    c.fillStyle = brilho;
    c.fillRect(0, 0, 256, 96);
    const marrom = '#6a4426';
    c.strokeStyle = marrom;
    c.fillStyle = marrom;
    c.lineWidth = 2;
    // os risquinhos: 88 a 108, um por megahertz, maior a cada quatro
    const x0 = 22;
    const x1 = 234;
    for (let i = 0; i <= 20; i++) {
      const x = x0 + ((x1 - x0) * i) / 20;
      const grande = i % 4 === 0;
      c.beginPath();
      c.moveTo(x, 30);
      c.lineTo(x, grande ? 52 : 42);
      c.stroke();
      if (grande) {
        c.font = 'bold 19px ui-rounded, Nunito, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'top';
        c.fillText(String(88 + i), x, 56);
      }
    }
    c.beginPath();
    c.moveTo(x0, 30);
    c.lineTo(x1, 30);
    c.stroke();
    c.font = 'bold 16px ui-rounded, Nunito, sans-serif';
    c.textAlign = 'left';
    c.textBaseline = 'top';
    c.fillText('FM', 6, 6);
    c.textAlign = 'right';
    c.fillText('MHz', 250, 6);
    // o coraçãozinho, em cima da estação deles
    const xc = x0 + (x1 - x0) * ESTACAO;
    c.fillStyle = css(P.radinhoAgulha);
    c.beginPath();
    c.moveTo(xc, 26);
    c.bezierCurveTo(xc - 12, 16, xc - 9, 4, xc, 11);
    c.bezierCurveTo(xc + 9, 4, xc + 12, 16, xc, 26);
    c.fill();
  }
  texturaDoMostrador = new THREE.CanvasTexture(tela);
  texturaDoMostrador.colorSpace = THREE.SRGBColorSpace;
  texturaDoMostrador.anisotropy = 4;
  return texturaDoMostrador;
}

/**
 * UMA COLCHEIA (♪): a cabeça oval inclinada, a haste e a bandeirinha curva,
 * extrudadas fininhas com bisel — boiando de frente para a câmera, ela lê de
 * longe como nota de desenho. Base da cabeça na origem; ~5 cm de altura.
 */
function geometriaDaNota(): THREE.BufferGeometry {
  const extrudar = (forma: THREE.Shape): THREE.BufferGeometry =>
    new THREE.ExtrudeGeometry(forma, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.0012, bevelSegments: 1, curveSegments: 10 });
  const cabeca = new THREE.Shape();
  cabeca.absellipse(0, 0, 0.0115, 0.0082, 0, Math.PI * 2, false, 0.45);
  const haste = new THREE.Shape();
  haste.moveTo(0.0078, 0.002);
  haste.lineTo(0.0108, 0.002);
  haste.lineTo(0.0108, 0.045);
  haste.lineTo(0.0078, 0.045);
  haste.closePath();
  const bandeira = new THREE.Shape();
  bandeira.moveTo(0.0105, 0.045);
  bandeira.bezierCurveTo(0.012, 0.036, 0.026, 0.034, 0.024, 0.018);
  bandeira.bezierCurveTo(0.03, 0.03, 0.022, 0.036, 0.0105, 0.034);
  bandeira.closePath();
  const partes = [cabeca, haste, bandeira].map((f) => extrudar(f).toNonIndexed());
  const junta = mergeGeometries(partes) ?? partes[0];
  junta.translate(0, 0, -0.0015);
  return junta;
}

interface Animacao {
  t: number;
  dur: number;
  passo: (k: number) => void;
  fim: () => void;
}

interface Nota {
  vida: number;
  dur: number;
  de: THREE.Vector3;
  deriva: number;
  fase: number;
  espelho: number;
}

const suave = (k: number): number => k * k * (3 - 2 * k);

export class Radinho {
  readonly group = new THREE.Group();
  /** o efeito sonoro de cada passo (a cena liga no `g.som`) */
  som: ((nome: SomNome) => void) | null = null;

  private readonly corpo = new THREE.Group();
  private readonly antena = new THREE.Group();
  private readonly gomos: THREE.Object3D[] = [];
  private readonly botaoDoVolume = new THREE.Group();
  private readonly botaoDaSintonia = new THREE.Group();
  private readonly agulha: THREE.Mesh;
  private readonly cone: THREE.Mesh;
  private readonly ledAceso: THREE.Mesh;
  private readonly ledApagado: THREE.Mesh;
  private readonly haloDoLed: THREE.Sprite;
  private readonly luzDoMostrador: THREE.Mesh;
  private readonly notas: THREE.InstancedMesh;
  private readonly vivas: Array<Nota | null>;
  private readonly cores = [P.notaRosa, P.notaAmarela, P.notaLilas, P.notaMenta].map((c) => new THREE.Color(c));
  private readonly m = new THREE.Object3D();
  private readonly animacoes: Animacao[] = [];

  private relogio = 0;
  private fase = 0;
  /** 0 parado, 1 tocando cheio: o pulso e o balanço sobem e descem por ele */
  private volume = 0;
  /**
   * Quem está mandando no rádio agora: cada `ligar`/`desligar` pega a sua
   * vez, e para no meio se outro chegou depois (o dia voltando com o rádio
   * ligando, por exemplo) — sem isso o `ligar` velho acendia o led de volta.
   */
  private vez = 0;
  private tocando = false;
  private ligando = false;
  private proximaNota = 0;
  private qualNota = 0;
  /** onde a agulha está na escala (0 a 1) */
  private sintonia = 0.12;
  private brilhoDoMostrador = 0;
  private extensao = 0;
  private levantada = 0;

  constructor() {
    this.group.userData.peca = 'radinho';
    const g = this.group;
    // ------------------------------------------------------ os pezinhos
    const borracha = toon(P.radinhoPe);
    for (const x of [-0.13, 0.13]) {
      for (const z of [-0.035, 0.035]) {
        por(g, new THREE.CylinderGeometry(0.012, 0.013, PE + 0.004, 12), borracha, x, PE / 2, z);
      }
    }

    // --------------------------------------------- o corpo (que pulsa)
    this.corpo.name = 'corpo';
    this.corpo.position.y = PE;
    g.add(this.corpo);
    const c = this.corpo;
    por(c, macia(L, A, F, 0.036, 4), toon(P.radinhoCorpo), 0, A / 2, 0);
    // a fita mais escura que dá a volta embaixo, de base de rádio antigo
    por(c, macia(L + 0.004, 0.026, F + 0.004, 0.012, 3), toon(P.radinhoCorpoEscuro), 0, 0.016, 0);
    // o painel creme na frente, saindo 2 mm do corpo
    por(c, macia(0.29, 0.152, 0.014, 0.018), toon(P.radinhoPainel), 0, 0.1, F / 2 - 0.005);
    const frente = F / 2 + 0.002;

    // o alto-falante: a grade furadinha, o aro cromado e o miolo que bate (cada
    // camada da frente 1,5 mm à frente da de trás: com meio milímetro, de longe,
    // o buffer de profundidade do celular não separa as duas)
    const centro = new THREE.Vector3(-0.068, 0.098, frente);
    por(c, new THREE.CircleGeometry(0.056, 40), toon(0xffffff, { mapa: gradeDoAltoFalante() }), centro.x, centro.y, frente + 0.0016);
    const cromo = toon(P.radinhoCromo);
    por(c, new THREE.TorusGeometry(0.058, 0.0048, 8, 40), cromo, centro.x, centro.y, frente + 0.002);
    this.cone = por(c, new THREE.SphereGeometry(0.017, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2), cromo, centro.x, centro.y, frente + 0.0018);
    this.cone.name = 'cone';
    this.cone.scale.z = 0.5;

    // o mostrador: o caixilho cromado, a escala e a luz âmbar por trás
    por(c, macia(DIAL.l + 0.012, DIAL.a + 0.012, 0.008, 0.006), cromo, DIAL.x, DIAL.y, frente - 0.001);
    por(c, new THREE.PlaneGeometry(DIAL.l, DIAL.a), toon(0xffffff, { mapa: mostrador() }), DIAL.x, DIAL.y, frente + 0.0048);
    this.luzDoMostrador = por(c, new THREE.PlaneGeometry(DIAL.l * 1.5, DIAL.a * 2.4), luzNoChao(P.radinhoMostradorAceso, 0.7), DIAL.x, DIAL.y, frente + 0.0056);
    this.luzDoMostrador.renderOrder = 4;
    this.luzDoMostrador.userData.semSombra = true;
    this.luzDoMostrador.visible = false;
    this.agulha = por(c, new THREE.BoxGeometry(0.0028, DIAL.a * 0.92, 0.0016), toon(P.radinhoAgulha), 0, DIAL.y, frente + 0.0068);
    this.agulha.name = 'agulha';

    // os dois botões serrilhados: volume e sintonia
    for (const [botao, x, nome] of [
      [this.botaoDoVolume, 0.045, 'botao-do-volume'], [this.botaoDaSintonia, 0.097, 'botao-da-sintonia'],
    ] as const) {
      botao.name = nome;
      botao.position.set(x, 0.07, frente);
      c.add(botao);
      por(botao, new THREE.CylinderGeometry(0.0155, 0.017, 0.014, 22).rotateX(Math.PI / 2), toon(P.radinhoBotao), 0, 0, 0.007);
      // a serrilha: um anel de dentinhos em volta
      const dentes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.0032, 0.0032, 0.012), cromo, 18);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        this.m.position.set(Math.cos(a) * 0.0165, Math.sin(a) * 0.0165, 0.0065);
        this.m.rotation.set(0, 0, a);
        this.m.scale.setScalar(1);
        this.m.updateMatrix();
        dentes.setMatrixAt(i, this.m.matrix);
      }
      botao.add(dentes);
      // o risquinho que diz para onde ele aponta
      por(botao, new THREE.BoxGeometry(0.0026, 0.01, 0.002), toon(P.radinhoGrade), 0, 0.0072, 0.0142);
    }

    // o ledzinho: o apagado e o aceso são duas malhas (trocar material em malha juntada não pode)
    const led = new THREE.Vector3(0.128, 0.07, frente + 0.002);
    this.ledApagado = por(c, new THREE.SphereGeometry(0.0058, 12, 8), toon(P.radinhoLedApagado), led.x, led.y, led.z);
    this.ledAceso = por(c, new THREE.SphereGeometry(0.0058, 12, 8), flat(P.radinhoLedAceso), led.x, led.y, led.z);
    this.ledApagado.name = 'led-apagado';
    this.ledAceso.name = 'led-aceso';
    this.ledAceso.visible = false;
    this.haloDoLed = new THREE.Sprite(brilhoDeLuz(P.radinhoLedAceso, 0.7));
    this.haloDoLed.position.copy(led).add(new THREE.Vector3(0, 0, 0.004));
    this.haloDoLed.scale.setScalar(0.035);
    this.haloDoLed.renderOrder = 5;
    this.haloDoLed.visible = false;
    c.add(this.haloDoLed);

    // a alça de couro em cima, com os dois suportes cromados
    const alca = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.106, A + 0.004, 0), new THREE.Vector3(-0.094, A + 0.042, 0),
      new THREE.Vector3(0, A + 0.062, 0), new THREE.Vector3(0.094, A + 0.042, 0), new THREE.Vector3(0.106, A + 0.004, 0),
    ]);
    por(c, new THREE.TubeGeometry(alca, 28, 0.0078, 8, false), toon(P.radinhoAlca));
    for (const x of [-0.106, 0.106]) por(c, new THREE.CylinderGeometry(0.0115, 0.013, 0.014, 14), cromo, x, A + 0.004, 0);

    // a antena telescópica: deitada em cima, por trás da alça
    this.antena.name = 'antena';
    this.antena.position.set(0.13, A + 0.006, -0.034);
    c.add(this.antena);
    por(this.antena, new THREE.SphereGeometry(0.0085, 12, 8), cromo);
    const raios = [0.0042, 0.0035, 0.0028, 0.0021];
    for (let i = 0; i < raios.length; i++) {
      const gomo = new THREE.Group();
      gomo.name = `gomo-${i + 1}`;
      por(gomo, new THREE.CylinderGeometry(raios[i], raios[i], 0.08, 10).translate(0, 0.04, 0), cromo);
      if (i === raios.length - 1) por(gomo, new THREE.SphereGeometry(0.0048, 10, 8), cromo, 0, 0.08, 0);
      this.antena.add(gomo);
      this.gomos.push(gomo);
    }
    this.armarAntena();

    // ------------------------------------------------------ as notinhas
    const NOTAS = 10;
    this.notas = new THREE.InstancedMesh(geometriaDaNota(), flat(0xffffff), NOTAS);
    this.notas.name = 'notas';
    this.notas.frustumCulled = false;
    this.notas.userData.semSombra = true;
    this.notas.renderOrder = 6;
    this.vivas = new Array<Nota | null>(NOTAS).fill(null);
    this.m.scale.setScalar(0);
    this.m.updateMatrix();
    for (let i = 0; i < NOTAS; i++) {
      this.notas.setMatrixAt(i, this.m.matrix);
      this.notas.setColorAt(i, this.cores[i % this.cores.length]);
    }
    g.add(this.notas);
    this.pintarSintonia();
  }

  get ligado(): boolean {
    return this.tocando || this.ligando;
  }

  /** o que o teste lê */
  get estado(): { ligado: boolean; tocando: boolean; antena: number; sintonia: number; mostrador: number; notas: number; pulso: number } {
    return {
      ligado: this.ligado,
      tocando: this.tocando,
      antena: this.extensao * this.levantada,
      sintonia: this.sintonia,
      mostrador: this.brilhoDoMostrador,
      notas: this.vivas.filter((n) => n !== null).length,
      pulso: this.corpo.scale.y,
    };
  }

  /** LIGA: o volume estala, o led e o mostrador acendem, a antena sobe e estica, a agulha procura a estação */
  async ligar(): Promise<void> {
    if (this.ligado) return;
    const vez = ++this.vez;
    const valendo = (): boolean => vez === this.vez;
    this.ligando = true;
    this.tocar('radioLiga');
    await this.animar(0.3, (k) => {
      this.botaoDoVolume.rotation.z = -suave(k) * 2.2;
    });
    if (!valendo()) return;
    this.ledAceso.visible = true;
    this.ledApagado.visible = false;
    this.haloDoLed.visible = true;
    // o mostrador acende piscando, como lâmpada velha esquentando
    const acende = this.animar(0.5, (k) => {
      const pisca = k < 0.6 ? (Math.sin(k * 60) > 0 ? 1 : 0.35) : 1;
      this.brilhoDoMostrador = suave(k) * pisca;
      this.pintarMostrador();
    });
    // a antena: levanta deitada, e estica gomo por gomo
    await this.animar(0.45, (k) => {
      this.levantada = suave(k);
      this.armarAntena();
    });
    if (!valendo()) return;
    this.tocar('antena');
    await this.animar(0.42, (k) => {
      this.extensao = suave(k);
      this.armarAntena();
    });
    await acende;
    if (!valendo()) return;
    // a agulha corre a escala, passa do coraçãozinho, volta e assenta (a
    // curva de "passar do ponto": sobe além de 1 lá pelos 70% e volta)
    const de = this.sintonia;
    const c1 = 2.4;
    await this.animar(1.2, (k) => {
      const u = k - 1;
      const s = 1 + (c1 + 1) * u * u * u + c1 * u * u;
      this.sintonia = de + (ESTACAO - de) * s;
      this.pintarSintonia();
    });
    if (!valendo()) return;
    this.sintonia = ESTACAO;
    this.pintarSintonia();
    this.ligando = false;
    this.tocando = true;
  }

  /** DESLIGA: o clique, o led e o mostrador apagam, a antena encolhe e deita. A agulha fica onde estava. */
  async desligar(): Promise<void> {
    if (!this.ligado) return;
    const vez = ++this.vez;
    const valendo = (): boolean => vez === this.vez;
    this.tocando = false;
    this.ligando = true;
    this.tocar('radioDesliga');
    const volume0 = this.botaoDoVolume.rotation.z;
    await this.animar(0.25, (k) => {
      this.botaoDoVolume.rotation.z = volume0 * (1 - suave(k));
    });
    if (!valendo()) return;
    this.ledAceso.visible = false;
    this.ledApagado.visible = true;
    this.haloDoLed.visible = false;
    const brilho0 = this.brilhoDoMostrador;
    const apaga = this.animar(0.35, (k) => {
      this.brilhoDoMostrador = brilho0 * (1 - suave(k));
      this.pintarMostrador();
    });
    const extensao0 = this.extensao;
    await this.animar(0.35, (k) => {
      this.extensao = extensao0 * (1 - suave(k));
      this.armarAntena();
    });
    if (!valendo()) return;
    const levantada0 = this.levantada;
    await this.animar(0.4, (k) => {
      this.levantada = levantada0 * (1 - suave(k));
      this.armarAntena();
    });
    await apaga;
    if (!valendo()) return;
    this.ligando = false;
  }

  /** na hora, sem animação (o dia voltando com o rádio ligado) */
  desligarJa(): void {
    this.vez++;
    for (const a of this.animacoes.splice(0)) a.fim();
    this.tocando = false;
    this.ligando = false;
    this.volume = 0;
    this.botaoDoVolume.rotation.z = 0;
    this.ledAceso.visible = false;
    this.ledApagado.visible = true;
    this.haloDoLed.visible = false;
    this.brilhoDoMostrador = 0;
    this.pintarMostrador();
    this.extensao = 0;
    this.levantada = 0;
    this.armarAntena();
    for (let i = 0; i < this.vivas.length; i++) this.vivas[i] = null;
  }

  update(dt: number): void {
    this.relogio += dt;
    for (const a of [...this.animacoes]) {
      a.t = Math.min(a.dur, a.t + dt);
      a.passo(a.dur > 0 ? a.t / a.dur : 1);
      if (a.t >= a.dur) {
        const i = this.animacoes.indexOf(a);
        if (i >= 0) this.animacoes.splice(i, 1);
        a.fim();
      }
    }
    // o som entra e sai devagar: o pulso não liga num tranco
    this.volume += ((this.tocando ? 1 : 0) - this.volume) * Math.min(1, dt * 3);
    this.fase += dt * Math.PI * 2 * (BATIDA_DO_RADINHO / 60);
    /*
     * A BATIDA: um "tum" por tempo, que estica o rádio para cima e achata dos
     * lados (o volume se conserva, é o que lê como desenho animado), e o
     * miolo do alto-falante empurra para fora junto. Por cima, o balanço de
     * um lado para o outro a cada dois tempos, o mesmo vaivém de quem dança.
     */
    const tum = Math.pow(Math.max(0, Math.cos(this.fase)), 6) * this.volume;
    this.corpo.scale.set(1 - 0.018 * tum, 1 + 0.035 * tum, 1 - 0.018 * tum);
    this.corpo.rotation.z = Math.sin(this.fase / 2) * 0.035 * this.volume;
    this.cone.scale.z = 0.5 + 0.7 * tum;
    if (this.tocando) {
      this.haloDoLed.scale.setScalar(0.03 + 0.012 * tum);
      // a antena treme um tico na ponta, no tempo
      this.antena.rotation.x = -0.12 + Math.sin(this.fase) * 0.025;
    }
    this.atualizarNotas(dt);
  }

  // ------------------------------------------------------------- por dentro

  private tocar(nome: SomNome): void {
    this.som?.(nome);
  }

  private animar(dur: number, passo: (k: number) => void): Promise<void> {
    return new Promise((fim) => {
      this.animacoes.push({ t: 0, dur, passo, fim });
    });
  }

  /** a antena: deitada (apontando para `-X` em cima do corpo) até de pé, inclinada para fora, e esticada */
  private armarAntena(): void {
    const l = this.levantada;
    this.antena.rotation.set(-0.12 * l, 0, Math.PI / 2 * (1 - l) - 0.34 * l);
    for (let i = 0; i < this.gomos.length; i++) {
      this.gomos[i].position.y = i * GOMO * this.extensao;
    }
  }

  private pintarSintonia(): void {
    this.agulha.position.x = DIAL.x + (this.sintonia - 0.5) * DIAL.l * 0.9;
    // o botão da sintonia gira junto com a agulha
    this.botaoDaSintonia.rotation.z = -this.sintonia * 5;
  }

  private pintarMostrador(): void {
    this.luzDoMostrador.visible = this.brilhoDoMostrador > 0.02;
    const s = 0.6 + 0.4 * this.brilhoDoMostrador;
    this.luzDoMostrador.scale.set(s, s, 1);
  }

  /** as notinhas: nascem no alto-falante, sobem serpenteando e somem encolhendo */
  private atualizarNotas(dt: number): void {
    this.proximaNota -= dt;
    if (this.tocando && this.proximaNota <= 0) {
      const livre = this.vivas.indexOf(null);
      if (livre >= 0) {
        this.vivas[livre] = {
          vida: 0,
          dur: 2.4 + Math.random() * 0.8,
          de: new THREE.Vector3(-0.068 + (Math.random() - 0.5) * 0.05, PE + 0.13, F / 2 + 0.02),
          deriva: (Math.random() - 0.5) * 0.16,
          fase: Math.random() * Math.PI * 2,
          espelho: Math.random() < 0.3 ? -1 : 1,
        };
        this.notas.setColorAt(livre, this.cores[this.qualNota++ % this.cores.length]);
        if (this.notas.instanceColor) this.notas.instanceColor.needsUpdate = true;
      }
      // uma por tempo, mais ou menos: no ritmo da música
      this.proximaNota = (60 / BATIDA_DO_RADINHO) * (0.7 + Math.random() * 0.6);
    }
    let mexeu = false;
    for (let i = 0; i < this.vivas.length; i++) {
      const n = this.vivas[i];
      if (!n) continue;
      n.vida += dt;
      const k = n.vida / n.dur;
      if (k >= 1) {
        this.vivas[i] = null;
        this.m.scale.setScalar(0);
        this.m.updateMatrix();
        this.notas.setMatrixAt(i, this.m.matrix);
        mexeu = true;
        continue;
      }
      // sobe ~45 cm, serpenteando, e anda um tico para a frente e de lado
      this.m.position.set(
        n.de.x + n.deriva * k + Math.sin(n.fase + n.vida * 2.6) * 0.03,
        n.de.y + 0.45 * (1 - (1 - k) * (1 - k)),
        n.de.z + 0.09 * k,
      );
      this.m.rotation.set(0, Math.sin(n.fase + n.vida * 1.7) * 0.5, Math.sin(n.fase + n.vida * 3.1) * 0.3);
      // cresce rápido ao nascer e encolhe até sumir no fim
      const tamanho = Math.min(1, k * 6) * (1 - suave(Math.max(0, (k - 0.7) / 0.3)));
      this.m.scale.set(tamanho * 1.15 * n.espelho, tamanho * 1.15, tamanho * 1.15);
      this.m.updateMatrix();
      this.notas.setMatrixAt(i, this.m.matrix);
      mexeu = true;
    }
    if (mexeu) this.notas.instanceMatrix.needsUpdate = true;
  }
}
