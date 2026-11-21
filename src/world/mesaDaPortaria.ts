/**
 * A MESA DA PORTARIA — o lugar de quem trabalha no meio da guarita nova
 * (`world/guaritaDoClube.ts`), entre as duas bancadas, de frente para o
 * guichê. Peça da cena `portaria` (o minigame da Portaria do Clube,
 * `docs/PORTARIA-DO-CLUBE.md`); no clube, o meio da guarita é o lugar da Gina
 * e fica vazio.
 *
 * O que mora nela (no quadro da guarita: o guichê olha para o `+Z`, e quem
 * senta olha para ele — então a DIREITA DA TELA é o `−X`):
 *
 *  - o TAMPO de madeira com veio, na altura das bancadas, com a gaveta e o
 *    vão das pernas;
 *  - a CALHA de inox que atravessa o guichê: o papel entra deslizando por ela;
 *  - os PAPÉIS do visitante (um `PapelPintado` por TIPO de papel, a cena
 *    inteira — redesenhado a cada visitante, nunca uma textura nova);
 *  - os TRÊS CARIMBOS no porta-carimbos (ENTRA, SÓ O CLUBE, HOJE NÃO) e a
 *    almofada de tinta; o carimbo desce de verdade no papel;
 *  - a CAMPAINHA de balcão (chama o próximo), a LUPA de latão, a PRANCHETA com
 *    a lista de sócios, o CALENDÁRIO de mesa, o MANUAL de argola e a
 *    LUMINÁRIA de braço com a poça de luz pintada.
 *
 * Os papéis em cima da mesa são `pinturaAcesa` (sem luz): o miolo da guarita
 * mora na sombra do telhado, e papel de ler não pode escurecer.
 */
import * as THREE from 'three';
import { flat, pinturaAcesa, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import type { Carimbo, Data, Documento, LinhaDaLista, TipoDeDocumento } from '../minigames/portaria/tipos';
import { acabar } from './acabamento';
import { haloDeLampada, pocaDeLuz } from './furniture';
import { GUARITA_DO_CLUBE as G } from './guaritaDoClube';
import { macia, por, torneado, tubo } from './moveisDaBoutique';
import { PapelPintado, pintarCalendario, pintarLista, pintarManual, pintarPapel, tamanhoDoPapel } from './papeisDaPortaria';
import { veioDeMadeira } from './texturasDeCasa';
import { novaTextura } from './texturasDeChao';

/** as medidas da mesa no quadro da guarita (a cena e o teste usam) */
export const MESA_DA_PORTARIA = {
  /** o tampo, na altura das bancadas da guarita */
  topo: G.piso + 0.89,
  x0: -0.77,
  x1: 0.77,
  z0: 0.35,
  /** encostada na parede da frente por dentro (1,55), sem tocar */
  z1: 1.54,
  /** o banco alto de quem trabalha (o assento) */
  banco: { x: 0, z: 0.36, assento: G.piso + 0.74 },
  /** o banco do parceiro, na bancada da direita da tela (o `−X`) */
  bancoDoParceiro: { x: -1.38, z: 0.42, assento: G.piso + 0.74 },
  /** onde o papel principal se deita para ser lido */
  leitura: { x: 0.02, z: 1.16 },
  /** onde o visitante fica do lado de fora, no balcão */
  janela: { x: 0, z: 2.72 },
} as const;

const M = MESA_DA_PORTARIA;

/** o tamanho de cada papel em cima da mesa, em metros (o lado maior) */
const LADO_NA_MESA: Readonly<Record<TipoDeDocumento, number>> = {
  carteirinha: 0.22, convite: 0.24, conviteColetivo: 0.26, cracha: 0.17, ordem: 0.25, exame: 0.24,
};

/** onde cada papel deita (o primeiro é o da leitura), e o giro dele */
const VAGAS: ReadonlyArray<{ x: number; z: number; giro: number }> = [
  { x: M.leitura.x, z: M.leitura.z, giro: 0.04 },
  { x: 0.28, z: 1.3, giro: -0.16 },
  { x: -0.22, z: 1.34, giro: 0.2 },
  { x: 0.3, z: 1.02, giro: 0.1 },
  { x: -0.2, z: 1.02, giro: -0.08 },
];

/** a ordem dos carimbos no porta-carimbos, da esquerda da tela para a direita */
export const CARIMBOS: readonly Carimbo[] = ['entra', 'soClube', 'hojeNao'];
const COR_DO_CARIMBO: Readonly<Record<Carimbo, number>> = {
  entra: P.carimboEntra, soClube: P.carimboSoClube, hojeNao: P.carimboHojeNao,
};

/** a curva macia (sobe devagar, desce devagar) */
const suave = (t: number): number => {
  const k = Math.max(0, Math.min(1, t));
  return k * k * (3 - 2 * k);
};

/** a altura da pintura de um papel deitado numa vaga: o cartão inteiro acima do tampo, e um papel por cima do outro */
const alturaNaVaga = (p: { folha: THREE.Object3D }, vaga: number): number =>
  M.topo + (p.folha.userData.grosso as number) + 0.0015 + 0.001 + vaga * 0.0045;

/** um papel deitado na mesa: o grupo que anda, a malha e o desenho */
interface PapelNaMesa {
  tipo: TipoDeDocumento;
  pintado: PapelPintado;
  folha: THREE.Group;
  malha: THREE.Mesh;
  /** a vaga dele agora (−1: fora da mesa) */
  vaga: number;
  doc: Documento | null;
  carimbo: Carimbo | null;
  /** o voo em curso (da calha à vaga, ou de volta) */
  voo: { de: THREE.Vector3; meio?: THREE.Vector3; para: THREE.Vector3; giroDe: number; giroPara: number; t: number; dur: number; pronto?: () => void; origem?: () => THREE.Vector3; voltando?: boolean } | null;
}

export class MesaDaPortaria {
  readonly group = new THREE.Group();
  /** os alvos de clique, pelo nome (a cena liga cada um a uma ferramenta) */
  readonly campainha = new THREE.Group();
  readonly lupa = new THREE.Group();
  readonly prancheta = new THREE.Group();
  readonly manual = new THREE.Group();
  readonly calendario = new THREE.Group();
  readonly carimbos: Record<Carimbo, THREE.Group> = { entra: new THREE.Group(), soClube: new THREE.Group(), hojeNao: new THREE.Group() };
  /** um papel por TIPO, a cena inteira */
  private readonly papeis = new Map<TipoDeDocumento, PapelNaMesa>();
  private readonly lista: PapelPintado;
  private readonly folhaDoCalendario: PapelPintado;
  private readonly capaDoManual: PapelPintado;
  /** o carimbo descendo: qual, em que papel, e o relógio */
  private batida: { qual: Carimbo; papel: PapelNaMesa; t: number; carimbou: boolean; pronto: () => void } | null = null;
  private toque = 0;
  /** a lupa erguida (o modo de apontar) */
  private lupaErguida = 0;
  private lupaAlvo = 0;
  private readonly casaDosCarimbos = new Map<Carimbo, THREE.Vector3>();
  private fase = 0;

  constructor() {
    const g = this.group;
    g.name = 'mesa-da-portaria';
    g.userData.peca = 'mesa-da-portaria';
    const madeira = toon(P.guaritaBalcao, { mapa: veioDeMadeira() });
    const madeiraEscura = toon(P.woodDark, { mapa: veioDeMadeira() });
    const creme = toon(P.guaritaParede);
    const verde = toon(P.guaritaFaixa);
    const dourado = toon(P.gold);
    const latao = toon(P.churrascoLatao);
    const inox = toon(P.inox);
    const inoxEscuro = toon(P.inoxEscuro);
    const ferro = toon(P.portaoFerro);
    const tinta = toon(P.tintaDaPortaria);
    const T = M.topo;
    const L = M.x1 - M.x0;
    const cx = (M.x0 + M.x1) / 2;
    const cz = (M.z0 + M.z1) / 2;
    const P_ = M.z1 - M.z0;

    // ------------------------------------------------------------ o móvel
    // o tampo (a mesma madeira das bancadas, um tico mais grosso na borda de quem senta)
    por(g, macia(L, 0.05, P_ + 0.03, 0.014), madeira, cx, T - 0.025, cz - 0.015);
    // o gaveteiro da direita da tela (o `−X`): o corpo creme e três gavetas verdes de puxador dourado
    const GX = M.x0 + 0.21;
    por(g, macia(0.4, T - G.piso - 0.06, P_ - 0.04, 0.015), creme, GX, (T + G.piso - 0.05) / 2, cz);
    for (let i = 0; i < 3; i++) {
      const y = T - 0.2 - i * 0.26;
      por(g, macia(0.36, 0.22, 0.02, 0.008), verde, GX, y, M.z0 + 0.012);
      por(g, torneado([[0, 0], [0.012, 0], [0.018, 0.01], [0.012, 0.022], [0, 0.024]], 10), dourado, GX, y + 0.04, M.z0 + 0.003)
        .rotation.x = -Math.PI / 2;
    }
    // a perna do lado de lá e o painel de fundo (o vão das pernas fica livre)
    por(g, macia(0.05, T - G.piso - 0.06, P_ - 0.04, 0.012), creme, M.x1 - 0.04, (T + G.piso - 0.05) / 2, cz);
    por(g, macia(L - 0.5, 0.5, 0.025, 0.01), creme, cx + 0.2, T - 0.32, M.z1 - 0.03);
    // o apoio de pé: a barra de ferro baixa, para o banco alto
    g.add(new THREE.Mesh(tubo([[M.x0 + 0.42, G.piso + 0.22, M.z0 + 0.12], [M.x1 - 0.06, G.piso + 0.22, M.z0 + 0.12]], 0.014, 4, 8), ferro));

    // ------------------------------------------------------------ a bandejinha do guichê
    // inox em cima do balcão, no vão do meio: o papel do visitante escorrega por ela até a mesa
    {
      const z0 = 1.49;
      const z1 = 2.02;
      const meia = 0.21;
      const y = G.balcao.topo;
      por(g, macia(meia * 2, 0.01, z1 - z0, 0.004), inox, 0, y + 0.005, (z0 + z1) / 2);
      for (const lado of [-1, 1]) por(g, macia(0.012, 0.03, z1 - z0, 0.004), inoxEscuro, lado * meia, y + 0.015, (z0 + z1) / 2);
      por(g, macia(meia * 2 + 0.012, 0.03, 0.012, 0.004), inoxEscuro, 0, y + 0.015, z1);
    }

    // ------------------------------------------------------------ o porta-carimbos e a almofada
    {
      const base = new THREE.Vector3(-0.5, T, 1.33);
      por(g, macia(0.32, 0.03, 0.1, 0.008), madeiraEscura, base.x, base.y + 0.015, base.z);
      por(g, macia(0.32, 0.07, 0.016, 0.006), madeiraEscura, base.x, base.y + 0.05, base.z + 0.042);
      CARIMBOS.forEach((qual, i) => {
        const c = this.carimbos[qual];
        c.name = `carimbo:${qual}`;
        const casa = new THREE.Vector3(base.x + 0.1 - i * 0.1, base.y + 0.03, base.z);
        this.casaDosCarimbos.set(qual, casa);
        c.position.copy(casa);
        // a borracha (a cor do que ele diz), o bloco de madeira e o cabo torneado
        por(c, macia(0.07, 0.012, 0.05, 0.004), toon(COR_DO_CARIMBO[qual]), 0, 0.006, 0);
        por(c, macia(0.074, 0.03, 0.054, 0.006), madeira, 0, 0.027, 0);
        por(c, torneado([[0, 0], [0.014, 0], [0.012, 0.03], [0.018, 0.055], [0.028, 0.075], [0.022, 0.095], [0, 0.1]], 16), madeiraEscura, 0, 0.042, 0);
        const rotulo = novaTextura(`rotulo-carimbo:${qual}`, 1, (ctx, lado) => {
          ctx.fillStyle = '#fff7df'; ctx.fillRect(0, 0, lado, lado);
          ctx.fillStyle = `#${COR_DO_CARIMBO[qual].toString(16).padStart(6, '0')}`;
          ctx.fillRect(0, 0, lado, lado * .12);
          ctx.font = `900 ${lado * .19}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(qual === 'entra' ? 'ENTRA' : qual === 'soClube' ? 'SÓ CLUBE' : 'HOJE NÃO', lado / 2, lado * .53);
        });
        const etiqueta = new THREE.Mesh(new THREE.PlaneGeometry(.072, .024), pinturaAcesa(rotulo));
        etiqueta.position.set(0, .028, -.030); etiqueta.rotation.y = Math.PI; c.add(etiqueta);
        // a plaquinha de cor no topo do cabo
        por(c, new THREE.CylinderGeometry(0.016, 0.016, 0.006, 14), toon(COR_DO_CARIMBO[qual]), 0, 0.143, 0);
        g.add(c);
      });
      // a almofada de tinta: a latinha e o feltro
      const a = new THREE.Vector3(-0.47, T, 1.16);
      por(g, macia(0.17, 0.022, 0.11, 0.008), inoxEscuro, a.x, a.y + 0.011, a.z);
      por(g, macia(0.15, 0.006, 0.09, 0.003), tinta, a.x, a.y + 0.024, a.z);
      const tampa = por(g, macia(0.17, 0.008, 0.11, 0.006), inox, a.x + 0.005, a.y + 0.065, a.z + 0.06);
      tampa.rotation.x = -1.35;
    }

    // ------------------------------------------------------------ a campainha de balcão
    {
      const c = this.campainha;
      c.name = 'campainha';
      c.position.set(-0.64, T, 1.0);
      por(c, torneado([[0, 0], [0.05, 0], [0.052, 0.006], [0.046, 0.02], [0, 0.022]], 22), madeiraEscura, 0, 0, 0);
      por(c, torneado([[0, 0], [0.042, 0], [0.04, 0.012], [0.032, 0.03], [0.018, 0.042], [0, 0.046]], 24), dourado, 0, 0.022, 0);
      const botao = por(c, torneado([[0, 0], [0.004, 0], [0.004, 0.012], [0.009, 0.014], [0.008, 0.02], [0, 0.021]], 12), inox, 0, 0.066, 0);
      botao.name = 'botao';
      g.add(c);
    }

    // ------------------------------------------------------------ a lupa de latão
    {
      const l = this.lupa;
      l.name = 'lupa';
      l.position.set(-0.3, T + 0.012, 0.99);
      l.rotation.y = 0.5;
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.006, 8, 28), latao);
      aro.rotation.x = Math.PI / 2;
      l.add(aro);
      const lente = new THREE.Mesh(new THREE.CircleGeometry(0.044, 28), flat(P.glass, 0.35));
      lente.rotation.x = -Math.PI / 2;
      lente.position.y = 0.001;
      l.add(lente);
      // o brilho da lente: um risquinho claro
      const brilho = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.006), flat(P.metalWhite, 0.8));
      brilho.rotation.set(-Math.PI / 2, 0, 0.7);
      brilho.position.set(-0.012, 0.002, -0.012);
      l.add(brilho);
      por(l, macia(0.012, 0.012, 0.03, 0.004), latao, 0, 0, 0.058);
      const cabo = por(l, torneado([[0, 0], [0.008, 0], [0.011, 0.02], [0.01, 0.07], [0.007, 0.085], [0, 0.088]], 12), madeiraEscura, 0, 0, 0.07);
      cabo.rotation.x = Math.PI / 2;
      g.add(l);
    }

    // ------------------------------------------------------------ a prancheta com a lista
    {
      this.lista = new PapelPintado(480, 720, (c) => pintarLista(c, 480, 720, []));
      const p = this.prancheta;
      p.name = 'prancheta';
      p.position.set(0.5, T, 1.2);
      p.rotation.y = -0.14;
      por(p, macia(0.22, 0.008, 0.32, 0.01), toon(P.corticaEscura), 0, 0.004, 0);
      const folha = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), pinturaAcesa(this.lista.textura));
      folha.rotation.set(-Math.PI / 2, 0, Math.PI);
      folha.position.set(0, 0.0095, -0.005);
      p.add(folha);
      // o prendedor de metal no alto (o alto da folha fica para o lado do guichê, o `+Z`)
      por(p, macia(0.1, 0.014, 0.035, 0.006), inox, 0, 0.014, 0.14);
      por(p, new THREE.TorusGeometry(0.012, 0.003, 6, 14), inoxEscuro, 0, 0.02, 0.165).rotation.x = Math.PI / 2;
      g.add(p);
    }

    // ------------------------------------------------------------ o calendário de mesa
    {
      this.folhaDoCalendario = new PapelPintado(240, 240, (c) => pintarCalendario(c, 240, 240, { d: 23, m: 11, a: 2026 }));
      const c = this.calendario;
      c.name = 'calendario';
      c.position.set(0.62, T, 1.33);
      c.rotation.y = Math.PI - 0.35;
      // a tenda: o verso de papelão e a frente com a folha do dia, virada para quem senta
      const frente = new THREE.Group();
      frente.rotation.x = -0.28;
      c.add(frente);
      por(frente, macia(0.15, 0.15, 0.006, 0.004), toon(P.papelao), 0, 0.075, 0);
      const folha = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), pinturaAcesa(this.folhaDoCalendario.textura));
      folha.position.set(0, 0.075, 0.0045);
      frente.add(folha);
      // as argolinhas no alto
      for (const x of [-0.04, 0, 0.04]) por(frente, new THREE.TorusGeometry(0.008, 0.002, 6, 12), inoxEscuro, x, 0.15, 0).rotation.y = Math.PI / 2;
      const verso = por(c, macia(0.15, 0.15, 0.006, 0.004), toon(P.papelaoEscuro), 0, 0.072, -0.04);
      verso.rotation.x = 0.3;
      g.add(c);
    }

    // ------------------------------------------------------------ o manual de argola
    {
      this.capaDoManual = new PapelPintado(256, 340, (c) => pintarManual(c, 256, 340));
      const m = this.manual;
      m.name = 'manual';
      m.position.set(0.55, T, 0.98);
      m.rotation.y = 0.12;
      por(m, macia(0.17, 0.035, 0.22, 0.006), verde, 0, 0.0175, 0);
      // as folhas aparecendo na borda
      por(m, macia(0.155, 0.026, 0.205, 0.003), toon(P.papelDaPortaria), 0.006, 0.0175, 0);
      const capa = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.2), pinturaAcesa(this.capaDoManual.textura));
      capa.rotation.set(-Math.PI / 2, 0, Math.PI);
      capa.position.set(0.004, 0.0365, 0);
      m.add(capa);
      // as argolas na lombada (o lado de quem senta é o `−Z`, a lombada fica à esquerda da tela, o `+X`)
      for (const z of [-0.06, 0.06]) por(m, new THREE.TorusGeometry(0.014, 0.003, 6, 14), inox, 0.085, 0.018, z).rotation.x = 0;
      g.add(m);
    }

    // ------------------------------------------------------------ a luminária de braço
    {
      const base = new THREE.Vector3(-0.69, T, 1.36);
      por(g, torneado([[0, 0], [0.06, 0], [0.062, 0.008], [0.05, 0.02], [0.012, 0.024], [0, 0.024]], 20), verde, base.x, base.y, base.z);
      const cotovelo = new THREE.Vector3(base.x + 0.02, T + 0.36, base.z - 0.06);
      const cabeca = new THREE.Vector3(-0.44, T + 0.42, 1.12);
      g.add(new THREE.Mesh(tubo([[base.x, T + 0.02, base.z], [cotovelo.x, cotovelo.y, cotovelo.z]], 0.008, 4, 8), verde));
      g.add(new THREE.Mesh(tubo([[cotovelo.x, cotovelo.y, cotovelo.z], [cabeca.x, cabeca.y, cabeca.z]], 0.008, 4, 8), verde));
      por(g, new THREE.SphereGeometry(0.014, 10, 8), dourado, cotovelo.x, cotovelo.y, cotovelo.z);
      // a cúpula: um cone aberto para baixo, com a lâmpada acesa dentro
      const cupula = por(g, torneado([[0.012, 0.09], [0.02, 0.085], [0.045, 0.04], [0.068, 0], [0.064, -0.004]], 22), verde, cabeca.x, cabeca.y - 0.09, cabeca.z);
      cupula.material = toon(P.guaritaFaixa, { doubleSide: true });
      por(g, new THREE.SphereGeometry(0.022, 12, 10), toon(P.luzDeAbajur, { glow: 1 }), cabeca.x, cabeca.y - 0.085, cabeca.z);
      const halo = haloDeLampada(0.22, P.luzDeAbajur, 0.4);
      halo.position.set(cabeca.x, cabeca.y - 0.1, cabeca.z);
      g.add(halo);
      const poca = pocaDeLuz(0.32, P.luzDeAbajur, 0.32);
      poca.position.set(cabeca.x + 0.04, T + 0.002, cabeca.z - 0.02);
      g.add(poca);
    }

    // ------------------------------------------------------------ os bancos altos
    for (const b of [M.banco, M.bancoDoParceiro]) {
      por(g, torneado([[0, 0], [0.19, 0], [0.2, 0.02], [0.19, 0.04], [0, 0.042]], 24), madeira, b.x, b.assento - 0.042, b.z);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        g.add(new THREE.Mesh(tubo([[b.x + Math.cos(a) * 0.12, b.assento - 0.04, b.z + Math.sin(a) * 0.12],
          [b.x + Math.cos(a) * 0.19, G.piso, b.z + Math.sin(a) * 0.19]], 0.014, 2, 6), ferro));
      }
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.01, 6, 24), ferro);
      aro.rotation.x = Math.PI / 2;
      aro.position.set(b.x, G.piso + 0.28, b.z);
      g.add(aro);
    }

    // a madeira com veio (o UV em metros)
    acabar(g, [[P.guaritaBalcao, veioDeMadeira()], [P.woodDark, veioDeMadeira()]]);
  }

  // ================================================================ os papéis

  /** o papel de um tipo (o mesmo a cena inteira) */
  private papelDo(tipo: TipoDeDocumento): PapelNaMesa {
    const ja = this.papeis.get(tipo);
    if (ja) return ja;
    const { l, a } = tamanhoDoPapel(tipo);
    const pintado = new PapelPintado(l, a, () => {});
    const lado = LADO_NA_MESA[tipo];
    const largura = l >= a ? lado : (lado * l) / a;
    const altura = a >= l ? lado : (lado * a) / l;
    const folha = new THREE.Group();
    folha.name = `papel:${tipo}`;
    folha.visible = false;
    const malha = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), pinturaAcesa(pintado.textura));
    // deitado, com o alto do papel para o guichê e a esquerda do papel na esquerda da tela
    malha.rotation.set(-Math.PI / 2, 0, Math.PI);
    folha.add(malha);
    // a espessura: um cartão por baixo (a carteirinha e o crachá são de plástico, o resto é papel)
    const grosso = tipo === 'carteirinha' || tipo === 'cracha' ? 0.003 : 0.0012;
    const base = new THREE.Mesh(macia(largura, grosso, altura, Math.min(0.012, grosso / 2)), toon(P.papelDaPortaria));
    // (1,5 mm entre a pintura e o cartão: menos que isso pisca no celular)
    base.position.y = -grosso / 2 - 0.0015;
    folha.userData.grosso = grosso;
    folha.add(base);
    this.group.add(folha);
    const p: PapelNaMesa = { tipo, pintado, folha, malha, vaga: -1, doc: null, carimbo: null, voo: null };
    this.papeis.set(tipo, p);
    return p;
  }

  /** o grupo do papel de um tipo (a cena faz dele um clicável; ele só aparece quando um visitante traz) */
  papelDe(tipo: TipoDeDocumento): THREE.Group {
    return this.papelDo(tipo).folha;
  }

  /** os papéis que estão na mesa agora, na ordem das vagas */
  get naMesa(): Array<{ tipo: TipoDeDocumento; grupo: THREE.Group }> {
    return [...this.papeis.values()].filter((p) => p.vaga >= 0).sort((a, b) => a.vaga - b.vaga).map((p) => ({ tipo: p.tipo, grupo: p.folha }));
  }

  /** o ponto da bandejinha, do lado de fora, de onde o papel entra; e a beira dela, por onde ele cai na mesa */
  private static readonly NA_CALHA = new THREE.Vector3(0, G.balcao.topo + 0.014, 1.96);
  private static readonly NA_BEIRA = new THREE.Vector3(0, G.balcao.topo + 0.014, 1.47);

  /**
   * O VISITANTE PASSA OS PAPÉIS pela calha: cada um entra deslizando e deita
   * na vaga dele. Resolve quando o último deitou.
   */
  receber(docs: readonly Documento[], origem?: () => THREE.Vector3): Promise<void> {
    const promessas: Promise<void>[] = [];
    docs.slice(0, VAGAS.length).forEach((d, i) => {
      const p = this.papelDo(d.tipo);
      p.doc = d;
      p.carimbo = null;
      p.pintado.redesenhar((c) => pintarPapel(c, d));
      p.vaga = i;
      p.folha.visible = !origem;
      const vaga = VAGAS[i];
      const para = new THREE.Vector3(vaga.x, alturaNaVaga(p, i), vaga.z);
      p.folha.position.copy(MesaDaPortaria.NA_CALHA);
      p.folha.rotation.y = 0;
      promessas.push(new Promise<void>((pronto) => {
        p.voo = { de: MesaDaPortaria.NA_CALHA.clone(), meio: MesaDaPortaria.NA_BEIRA.clone().setX(vaga.x * 0.4), para, giroDe: 0, giroPara: vaga.giro, t: -i * 0.24, dur: origem ? 1.45 : .75, pronto, origem };
      }));
    });
    return Promise.all(promessas).then(() => undefined);
  }

  /** traz um papel para a vaga da leitura (e manda o que estava lá para a vaga dele) */
  async trazerParaLeitura(tipo: TipoDeDocumento): Promise<void> {
    const p = this.papeis.get(tipo);
    if (!p || p.vaga < 0 || p.vaga === 0) return;
    const ocupante = [...this.papeis.values()].find((x) => x.vaga === 0);
    const vagaDele = p.vaga;
    await Promise.all([ocupante ? this.mover(ocupante, vagaDele) : Promise.resolve(), this.mover(p, 0)]);
  }

  private mover(p: PapelNaMesa, vaga: number): Promise<void> {
    p.vaga = vaga;
    const v = VAGAS[vaga];
    return new Promise(pronto => { p.voo = {
      de: p.folha.position.clone(), para: new THREE.Vector3(v.x, alturaNaVaga(p, vaga), v.z),
      giroDe: p.folha.rotation.y, giroPara: v.giro, t: 0, dur: 0.3, pronto,
    }; });
  }

  /** o papel que está na leitura */
  get naLeitura(): TipoDeDocumento | null {
    return [...this.papeis.values()].find((p) => p.vaga === 0)?.tipo ?? null;
  }

  /**
   * O CARIMBO: o carimbo escolhido sai do porta-carimbos, molha na almofada,
   * desce no papel da leitura (e a tinta fica nele) e volta. Resolve quando ele
   * já voltou para a casa.
   */
  carimbar(qual: Carimbo): Promise<void> {
    const papel = [...this.papeis.values()].find((p) => p.vaga === 0);
    if (!papel) return Promise.resolve();
    return new Promise<void>((pronto) => {
      this.batida = { qual, papel, t: 0, carimbou: false, pronto };
    });
  }

  /** os papéis voltam pela calha para o visitante; resolve quando sumiram */
  devolver(destino?: () => THREE.Vector3): Promise<void> {
    const promessas: Promise<void>[] = [];
    let i = 0;
    for (const p of this.papeis.values()) {
      if (p.vaga < 0) continue;
      const atraso = i++ * 0.12;
      p.vaga = -1;
      promessas.push(new Promise<void>((pronto) => {
        p.voo = {
          de: p.folha.position.clone(), meio: MesaDaPortaria.NA_BEIRA.clone().setX(p.folha.position.x * 0.4), para: MesaDaPortaria.NA_CALHA.clone(), giroDe: p.folha.rotation.y, giroPara: 0,
          t: -atraso, dur: destino ? 1.1 : .45, origem: destino, voltando: true, pronto: () => { p.folha.visible = false; p.doc = null; pronto(); },
        };
      }));
    }
    return Promise.all(promessas).then(() => undefined);
  }

  /** Encerra a demonstração sem deixar papel ou carimbada no primeiro atendimento. */
  limparDemonstracao(): void {
    const b = this.batida;
    this.batida = null;
    if (b) { this.carimbos[b.qual].position.copy(this.casaDosCarimbos.get(b.qual)!); b.pronto(); }
    for (const p of this.papeis.values()) {
      const voo = p.voo;
      p.voo = null; p.vaga = -1; p.doc = null; p.carimbo = null;
      p.folha.visible = false; p.folha.rotation.set(0, 0, 0); p.folha.scale.setScalar(1);
      voo?.pronto?.();
    }
  }

  // ================================================================ o resto da mesa

  tocarCampainha(): void {
    this.toque = 1;
  }

  /** a lupa sobe da mesa (o modo de apontar) ou volta a deitar */
  erguerLupa(sim: boolean): void {
    this.lupaAlvo = sim ? 1 : 0;
  }

  /** a lista de sócios do dia na prancheta */
  mostrarLista(lista: readonly LinhaDaLista[]): void {
    this.lista.redesenhar((c) => pintarLista(c, 480, 720, lista));
  }

  /** o dia no calendário de mesa */
  mostrarHoje(hoje: Data): void {
    this.folhaDoCalendario.redesenhar((c) => pintarCalendario(c, 240, 240, hoje));
  }

  update(dt: number): void {
    this.fase += dt;
    // ---- os papéis voando
    for (const p of this.papeis.values()) {
      const v = p.voo;
      if (!v) continue;
      v.t += dt;
      const k = suave(v.t / v.dur);
      if (v.t < 0) continue;
      p.folha.visible = true;
      if (v.origem) {
        const t = Math.max(0, Math.min(1, v.t / v.dur));
        const mao = v.origem();
        if (!v.voltando) {
          if (t < .22) { v.de.copy(mao); p.folha.position.copy(mao); }
          else if (t < .5) p.folha.position.lerpVectors(v.de, MesaDaPortaria.NA_CALHA, suave((t - .22) / .28));
          else if (t < .72) p.folha.position.lerpVectors(MesaDaPortaria.NA_CALHA, MesaDaPortaria.NA_BEIRA, suave((t - .5) / .22));
          else p.folha.position.lerpVectors(MesaDaPortaria.NA_BEIRA, v.para, suave((t - .72) / .28));
          p.folha.rotation.x = -.48 * (1 - suave(Math.min(1, t / .5)));
        } else {
          if (t < .4) p.folha.position.lerpVectors(v.de, MesaDaPortaria.NA_BEIRA, suave(t / .4));
          else if (t < .7) p.folha.position.lerpVectors(MesaDaPortaria.NA_BEIRA, MesaDaPortaria.NA_CALHA, suave((t - .4) / .3));
          else p.folha.position.lerpVectors(MesaDaPortaria.NA_CALHA, mao, suave((t - .7) / .3));
          p.folha.rotation.x = -.48 * suave(Math.max(0, (t - .7) / .3));
        }
        p.folha.position.y += Math.sin(t * Math.PI) * .012;
      } else if (v.meio) {
        // pela beira da bandejinha: o pedaço reto no balcão e a caída na mesa (o balcão é mais alto que o tampo)
        const entrando = v.de.z > v.para.z;
        const corte = 0.5;
        if (k < corte) p.folha.position.lerpVectors(v.de, v.meio, k / corte);
        else p.folha.position.lerpVectors(v.meio, v.para, (k - corte) / (1 - corte));
        p.folha.position.y += Math.sin(((k < corte ? k / corte : (k - corte) / (1 - corte))) * Math.PI) * (entrando ? 0.012 : 0.02);
      } else {
        p.folha.position.lerpVectors(v.de, v.para, k);
        // um arquinho: o papel levanta um tico no meio do caminho
        p.folha.position.y += Math.sin(k * Math.PI) * 0.03;
      }
      p.folha.rotation.y = v.giroDe + (v.giroPara - v.giroDe) * k;
      if (v.t >= v.dur) {
        p.folha.position.copy(v.para);
        p.folha.rotation.x = 0;
        p.voo = null;
        v.pronto?.();
      }
    }
    // ---- o carimbo
    const b = this.batida;
    if (b) {
      b.t += dt;
      const c = this.carimbos[b.qual];
      const casa = this.casaDosCarimbos.get(b.qual)!;
      const almofada = new THREE.Vector3(-0.47, M.topo + 0.03, 1.16);
      const papel = b.papel.folha.position;
      const acima = (p: THREE.Vector3, h: number): THREE.Vector3 => new THREE.Vector3(p.x, p.y + h, p.z);
      // as etapas: sobe da casa (0,2), molha na almofada (0,2), vai ao papel (0,25), bate (0,12), volta (0,4)
      const etapas: Array<[number, THREE.Vector3]> = [
        [0, casa.clone()], [0.18, acima(casa, 0.12)], [0.34, acima(almofada, 0.06)], [0.44, almofada.clone().setY(M.topo + 0.027)],
        [0.54, acima(almofada, 0.08)], [0.78, acima(papel, 0.1)], [0.88, acima(papel, 0.004)], [1.0, acima(papel, 0.004)],
        [1.12, acima(papel, 0.12)], [1.42, acima(casa, 0.1)], [1.56, casa.clone()],
      ];
      let i = 0;
      while (i < etapas.length - 2 && b.t > etapas[i + 1][0]) i++;
      const [t0, p0] = etapas[i];
      const [t1, p1] = etapas[i + 1];
      c.position.lerpVectors(p0, p1, suave((b.t - t0) / (t1 - t0)));
      if (!b.carimbou && b.t >= 0.88) {
        b.carimbou = true;
        b.papel.carimbo = b.qual;
        const doc = b.papel.doc;
        if (doc) b.papel.pintado.redesenhar((ctx) => pintarPapel(ctx, doc, b.qual));
      }
      if (b.t >= etapas[etapas.length - 1][0]) {
        c.position.copy(casa);
        this.batida = null;
        b.pronto();
      }
    }
    // ---- a campainha (o botão afunda e volta)
    if (this.toque > 0) {
      this.toque = Math.max(0, this.toque - dt * 5);
      const botao = this.campainha.getObjectByName('botao');
      if (botao) botao.position.y = 0.066 - Math.sin(this.toque * Math.PI) * 0.008;
    }
    // ---- a lupa (deitada ou erguida, pairando em cima da leitura)
    this.lupaErguida += (this.lupaAlvo - this.lupaErguida) * Math.min(1, dt * 6);
    const k = this.lupaErguida;
    this.lupa.position.set(-0.3 + (M.leitura.x - 0.12 + 0.3) * k, M.topo + 0.012 + k * (0.1 + Math.sin(this.fase * 2) * 0.006), 0.99 + (M.leitura.z - 0.04 - 0.99) * k);
    this.lupa.rotation.x = -k * 0.5;
  }

  dispose(): void {
    for (const p of this.papeis.values()) { p.voo?.pronto?.(); p.voo = null; p.pintado.dispose(); }
    this.batida?.pronto(); this.batida = null;
    this.lista.dispose();
    this.folhaDoCalendario.dispose();
    this.capaDoManual.dispose();
  }
}
