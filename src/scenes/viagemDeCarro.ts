import { BolhasDoCookie } from '../eventos/bebitoMobile/bolhasDoCookie';
import * as THREE from 'three';
import type { GameAPI, SceneDef } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { PALETTE as P } from '../palette';
import { ARI, RENAN } from '../characters/cast';
import { Vento } from '../core/shaders';
import { fence, lamp, muroDoClube, poolWater, portaoDoClube, sebe, signBoard, tree } from '../world/props';
import { bancoDePraca } from '../world/bancoDePraca';
import { tapeteDeGrama } from '../world/texturasDeChao';
import { fundir, fundirComoFundo } from '../world/fundir';
import { TARDE_DOURADA, luzDoMomento } from '../world/noite';
import { fachadaDaCasa, muroDoJardim, type CoresDaFachada } from '../world/frenteDaCasa';
import { capins, hortensias, lavandas, type PeDePlanta } from '../world/plantasDeJardim';
import { BebitoMobile } from '../world/bebitoMobile/BebitoMobile';
import { OnibusDaCidade } from '../world/onibusDaCidade';
import {
  ALTO_DA_CALCADA, Cones, Coracoes, LINHA_DE_PARADA, RAIO_DA_POCA, RAIO_DO_BURACO, Respingos, Semaforo, buraco,
  cavaleteDeObra, faixaDePedestres, lombada, placaDeDestino, placaDeTransito, poca, rodaAoLonge, trechoDeEstrada,
  type DesenhoDaPlaca, type NaPista,
} from '../world/estrada';
import { TravessiaDeBichos } from '../eventos/bebitoMobile/travessia';
import { carroEstacionado, placaDeEstacionamento } from '../world/estacionamento';
import { predioDaEscola } from '../world/escolaPorFora';
import { PORTAO_DA_ESCOLA, gradeDaEscola, portaoDaEscola } from '../world/portariaDaEscola';
import { MastroComBandeira, bicicletario } from '../world/patioDaEscola';
import { posteDoEstacionamento as posteDaEscola } from '../world/estacionamentoDaEscola';
import {
  PISTA, biomaEm, destinoDaRota, eixoDaRota, estrelasDaViagem, gerarRota, pedidoDeViagem, rotaNova, type DestinoDeCarro, type EventoDaRota, type PedidoDeViagem,
  type Rota,
} from '../eventos/bebitoMobile/rota';
import { FLAG_DO_CARRO_NA_ESCOLA, FLAG_DO_CARRO_NO_CLUBE, FLAG_DO_CARRO_NO_PARQUE, carroPorDentroNestaPagina } from '../eventos/BebitoMobile';
import { agendarChegadaNaEscola } from '../eventos/bebitoMobile/naEscola';
import { CameraDeDentro } from '../eventos/bebitoMobile/cameraDeDentro';
import { menuDoPassageiro } from '../eventos/bebitoMobile/passageiro';
import { agendarChegadaNoParque } from '../eventos/bebitoMobile/chegadaNoParque';
import { relogioDaCena } from '../eventos/bebitoMobile/presente';
import { CelularDeJogo } from '../world/celularDeJogo';
import { hortaDaAlameda, pomarDaAlameda, quadraNaAlameda } from '../world/paisagemDaRotaDoClube';
import { coberturaDoEstacionamento, jardineiraDoEstacionamento, posteDoEstacionamento } from '../world/estacionamentoDoClube';
import { EncontroNaEstrada } from '../eventos/bebitoMobile/encontroNaEstrada';
import { OndaVerde, RegaNaAlameda } from '../eventos/bebitoMobile/novidadesDoClube';
import { agendarChegadaNoClube } from '../eventos/bebitoMobile/chegadaNoClube';
import { pedidoSalvo } from '../eventos/bebitoMobile/pedidoSalvo';

/**
 * ==================================================== A VIAGEM DE CARRO
 *
 * A etapa C do Bebito Mobile (`docs/BEBITO-MOBILE.md`): a estrada entre a
 * casa do Ari e o Villa Lobos, com QUEM JOGA DIRIGINDO. O pedido do Renan:
 * "a gente podendo controlar o carro, uma mecânica intuitiva e divertida, com
 * obstáculos, faixas para pararmos para animais passarem".
 *
 * COMO SE DIRIGE (uma mão só basta):
 *  - o carro ANDA SOZINHO na velocidade de passeio;
 *  - o manche (setas, WASD ou o joystick do celular) vira para os lados;
 *    para baixo FREIA, para cima acelera;
 *  - E, espaço ou o botão de ação: a BUZINA.
 *
 * O QUE TEM NA PISTA (sorteado por viagem, `eventos/bebitoMobile/rota.ts`):
 * faixa de pedestres com os bichos do lago atravessando (tem que parar: quem
 * não freia, o carro freia sozinho, com susto), semáforo, obra com cones,
 * buracos, lombada, poça, o ônibus da cidade para ultrapassar — e corações
 * para pegar, que mostram a faixa livre antes de cada obstáculo.
 *
 * É UM PASSEIO, não uma prova: nada machuca, nada volta para o começo, e a
 * viagem sempre chega. O que muda é a nota (de uma a três estrelas) e o que
 * quem vai de carona comenta.
 *
 * A cena lê o pedido que a cena de partida deixou (`pedirViagem`): o sentido,
 * quem dirige e a semente. O relógio é o do jogo (`w.onUpdate`), e o teste o
 * acelera — e liga o piloto automático — por `depuracaoDaViagem`.
 */

/** o que o teste (e o console) mexe: a pressa do relógio e o piloto automático */
export const depuracaoDaViagem: {
  vezes: number;
  piloto: 'nenhum' | 'bom' | 'distraido';
  estado: EstadoDaViagem | null;
  rota: Rota | null;
  /** o teste põe a câmera onde quiser (de onde, para onde), para a foto de perto; `null` devolve a de sempre */
  camera: { de: [number, number, number]; para: [number, number, number] } | null;
  /** o ponto do mundo em `s` (ao longo) e `l` (para a direita): o teste acha os bichos e as peças por ele */
  naPista: ((s: number, l: number) => { x: number; z: number }) | null;
  /** a visão do passageiro: o teste liga e desliga, e olha a câmera e o celular */
  passageiro: { trocar: () => Promise<void>; camera: CameraDeDentro; celular: CelularDeJogo } | null;
} = { vezes: 1, piloto: 'nenhum', estado: null, rota: null, camera: null, naPista: null, passageiro: null };

export interface EstadoDaViagem {
  s: number;
  l: number;
  v: number;
  fase: 'partida' | 'dirigindo' | 'chegando' | 'fim';
  coracoes: number;
  tropecos: number;
  sustos: number;
  gentilezas: number;
  /** o que já aconteceu, por tipo (o teste confere) */
  vistos: Record<string, number>;
  aviso: string;
  /** a visão: de fora (a perseguição, quem joga dirige) ou de dentro (a de quem joga de carona, o carro no piloto automático) */
  visao: 'fora' | 'dentro';
  /** o piloto automático de JOGO (o carro dirige sozinho: a visão do passageiro) — o de teste é `depuracaoDaViagem.piloto` */
  piloto: boolean;
}

const V = THREE.Vector3;
const TRECHO = 40;
const CRUZEIRO = 9.5;
const MAXIMA = 14;

/** as casas de beira de estrada: o molde da vizinha, cada uma de uma cor */
const CASAS: CoresDaFachada[] = [
  { parede: P.vizinhaAmarela, telhado: P.vizinhaTelhaEscura, veneziana: P.vizinhaVenezianaAzul, porta: P.wood },
  { parede: P.vizinhaRosa, telhado: P.vizinhaTelhaCinza, veneziana: P.casaBranco, porta: P.woodDark },
  { parede: P.vizinhaAzul, telhado: P.roofTile, veneziana: P.vizinhaVenezianaMostarda, porta: P.wood },
  { parede: P.vizinhaVerde, telhado: P.vizinhaTelhaEscura, veneziana: P.casaBranco, porta: P.woodDark },
  { parede: P.vizinhaLilas, telhado: P.vizinhaTelhaCinza, veneziana: P.vizinhaVenezianaVinho, porta: P.wood },
];

/** as falas de quem vai de CARONA — escritas por mim, à espera do aval do Renan (`docs/BEBITO-MOBILE.md`) */
type Momento = 'partida' | 'patos' | 'tigres' | 'obrigado' | 'susto' | 'buzinaPatos' | 'buzinaTigres' | 'lombadaForte' | 'lombadaSuave'
  | 'poca' | 'buraco' | 'cone' | 'onibus' | 'passou' | 'sinal' | 'furou' | 'sinalOk';
const FALAS: Record<'ari' | 'renan', Record<Momento, string[]>> = {
  // o Ari de carona (o Renan dirige)
  ari: {
    partida: ['Cinto? Cinto. Partiu!', 'Vai devagar que eu quero ver a paisagem.'],
    patos: ['Olha os patinhos! Para, para, para!', 'Patinho na faixa! Freia!'],
    tigres: ['Tartaruguinhas! Deixa elas passarem.', 'Olha o tigre-d\'água atravessando!'],
    obrigado: ['Tchau, família!', 'Eles agradeceram, eu vi.'],
    susto: ['Quase! Olha a faixa, bebito!', 'Ai! Coitadinhos!'],
    buzinaPatos: ['Ela apertou o passo e ainda reclamou.'],
    buzinaTigres: ['Você buzinou e ela se escondeu…'],
    lombadaForte: ['Aaai! A lombada, bebito!', 'Minha coluna!'],
    lombadaSuave: ['Assim, devagarinho.'],
    poca: ['Splash!', 'De novo! De novo!'],
    buraco: ['Ui! Esse buraco é novo?'],
    cone: ['Os cones, amor! Os cones!'],
    onibus: ['Passa o ônibus, vai.'],
    passou: ['Tchau, ônibus!'],
    sinal: ['Tá fechando o sinal.'],
    furou: ['Tava vermelho!'],
    sinalOk: ['Bom motorista.'],
  },
  // o Renan de carona (o Ari dirige)
  renan: {
    partida: ['Cinto colocado. Pode ir, bebito.', 'Sem pressa. A gente já chega.'],
    patos: ['Patinhos na faixa. Freia, bebito.', 'Tem pato atravessando ali na frente.'],
    tigres: ['Tigre-d\'água na faixa. Vai demorar.', 'Tartaruga atravessando. Paciência.'],
    obrigado: ['Família educada.', 'Passaram todos. Pode ir.'],
    susto: ['Ufa. Foi por pouco.', 'Opa! A faixa!'],
    buzinaPatos: ['Funcionou: ela correu.'],
    buzinaTigres: ['Buzinar não ajuda: ela se escondeu.'],
    lombadaForte: ['Opa! Lombada…', 'Essa eu senti.'],
    lombadaSuave: ['Passou lisinho.'],
    poca: ['Lavou o carro de graça.', 'Molhou até a placa.'],
    buraco: ['Achou o buraco.'],
    cone: ['Um cone a menos na obra.'],
    onibus: ['Dá pra ultrapassar pela outra faixa.'],
    passou: ['Ultrapassagem limpa.'],
    sinal: ['Vai fechar. Vai parando.'],
    furou: ['Sinal vermelho, bebito!'],
    sinalOk: ['Parou certinho.'],
  },
};

export const viagemDeCarro: SceneDef = {
  id: 'viagem-de-carro',
  name: 'Na estrada',
  subtitle: 'de Bebito Mobile',
  ambient: {
    sky: P.skyDay,
    fog: 0xbfe6f7,
    fogNear: 60,
    fogFar: 165,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [14, 22, 12],
  },
  spawn: { x: 0, z: 0, facing: Math.PI },
  build(w) {
    montarAViagem(w, pedidoDeViagem() ?? pedidoSalvo(w.game) ?? { sentido: 'ida', motorista: ARI.id, semente: 1 });
  },
};

/** o ícone do destino no painel da viagem */
const ICONE_DO_DESTINO: Record<DestinoDeCarro, string> = { clube: '🏊', parque: '🌳', casa: '🏠', escola: '🏫' };

function montarAViagem(w: WorldBuilder, pedido: PedidoDeViagem): void {
  const g: GameAPI = w.game;
  const rota = gerarRota(pedido.semente, pedido.sentido);
  const L = rota.comprimento;
  const destino = destinoDaRota(rota.sentido);
  const ida = destino === 'parque';
  const paraClube = destino === 'clube';
  const paraEscola = destino === 'escola';
  // (as rotas de 1000 m, a do clube e a da escola: a primeira viagem que vira memória é a do parque)
  const novaRota = rotaNova(rota.sentido);
  const rnd = (): number => w.rng();

  // ------------------------------------------------------------ a conta da pista
  const eixo = (s: number): { x: number; inclina: number } => eixoDaRota(rota, Math.max(0, Math.min(L, s)));
  /** para onde a pista anda em `s` (ela vai para o −Z do mundo) */
  const frenteEm = (s: number, alvo = new V()): THREE.Vector3 => {
    const { inclina } = eixo(s);
    const n = 1 / Math.hypot(inclina, 1);
    return alvo.set(inclina * n, 0, -n);
  };
  const naPista: NaPista = (s, l, y = 0) => {
    const { x, inclina } = eixo(s);
    const n = 1 / Math.hypot(inclina, 1);
    // (a direita de quem dirige é `frente × cima`)
    return new V(x + l * n, y, -s + l * inclina * n);
  };
  /** o giro de uma peça de nariz no `+Z` para ela olhar para a frente da pista */
  const rumoEm = (s: number): number => {
    const f = frenteEm(s);
    return Math.atan2(f.x, f.z);
  };
  /** um ponto de beira de estrada: `afasta` metros para fora da calçada, do `lado` (−1 esquerda, 1 direita) */
  const naBeira = (s: number, lado: number, afasta: number, y = 0): THREE.Vector3 =>
    naPista(s, lado * (PISTA.meia + PISTA.calcada + afasta), y);
  /** o giro de uma peça de frente no `+Z` para ela dar a frente para a pista */
  const paraAPista = (s: number, lado: number): number => rumoEm(s) + (lado > 0 ? Math.PI / 2 : -Math.PI / 2);

  // ------------------------------------------------------------------ o chão e a luz
  w.ground({ width: 420, depth: L + 420, color: P.grass, z: -L / 2, textura: tapeteDeGrama(9) });
  w.setBounds(-200, -L - 200, 200, 200);
  if (rota.momento === 'tarde') {
    let posto = false;
    w.onUpdate(() => {
      // (o céu da cena entra depois do `build`: o da viagem vai no primeiro quadro)
      if (posto) return;
      posto = true;
      g.luzDoCeu({ ...luzDoMomento(TARDE_DOURADA), fogNear: 60, fogFar: 165 });
    });
  }

  // --------------------------------------------------------- a estrada, em trechos
  /*
   * Cada trecho de 40 m é um grupo (a pista, a calçada, a pintura e a
   * paisagem dele): o que ficou para trás e o que está longe demais some
   * (`visible`), e o resto é desenhado. A paisagem de cada trecho é juntada
   * por material (`fundirComoFundo`); as plantas de vento são lote por trecho.
   */
  const vento = new Vento({ forca: 0.07, altura: 1, direcao: [0.86, 0.5] });
  const trechos: Array<{ grupo: THREE.Group; s0: number; s1: number }> = [];
  for (let s0 = -TRECHO; s0 < L + 60; s0 += TRECHO) {
    const s1 = s0 + TRECHO;
    const grupo = new THREE.Group();
    grupo.userData.peca = 'trecho-da-viagem';
    grupo.add(trechoDeEstrada(naPista, s0, s1));
    const cenario = new THREE.Group();
    const flores: PeDePlanta[] = [];
    const moitas: PeDePlanta[] = [];
    const roxas: PeDePlanta[] = [];
    const por = (peca: THREE.Object3D, p: THREE.Vector3, giro: number): void => {
      peca.position.copy(p);
      peca.rotation.y = giro;
      cenario.add(peca);
    };
    const bioma = biomaEm(rota, Math.max(0, Math.min(L - 1, (s0 + s1) / 2)));
    const indice = Math.round(s0 / TRECHO);
    if (bioma === 'bairro') {
      // duas casas por lado, desencontradas, com a sebe na frente e uma árvore no quintal
      for (const lado of [-1, 1]) {
        for (let k = 0; k < 2; k++) {
          const s = s0 + 9 + k * 20 + (lado > 0 ? 0 : 8);
          por(fachadaDaCasa({ ...CASAS[Math.abs(indice * 2 + k + (lado > 0 ? 0 : 3)) % CASAS.length], vizinha: true }), naBeira(s, lado, 7.5 + rnd() * 2), paraAPista(s, lado));
          por(sebe(7.5, 0.95), naBeira(s + 6.5, lado, 0.75), rumoEm(s + 6.5) + Math.PI / 2);
          por(tree(w.pick(['redonda', 'florida', 'redonda'] as const), 1 + rnd() * 0.3, rnd()), naBeira(s + 9.5, lado, 4 + rnd() * 4), rnd() * 6.28);
          flores.push({ ...xz(naBeira(s - 3.4, lado, 3.2 + rnd())), escala: 0.95, semente: indice * 7 + k, cor: w.pick([P.hortensiaAzul, P.hortensiaRosa, P.hortensiaLilas]) });
        }
      }
      for (const s of [s0 + 4, s0 + 26]) por(lamp(), naPista(s, PISTA.meia + PISTA.calcada - 0.45, ALTO_DA_CALCADA), 0);
    } else if (bioma === 'avenida') {
      // a alameda: palmeiras dos dois lados, bancos, canteiros e as árvores do fundo
      for (const lado of [-1, 1]) {
        for (let s = s0 + 3; s < s1; s += 10) por(tree('palmeira', 1.25 + rnd() * 0.15, rnd()), naBeira(s + (lado > 0 ? 0 : 5), lado, 1.6), rnd() * 6.28);
        for (let k = 0; k < 4; k++) por(tree(w.pick(['redonda', 'florida', 'redonda', 'pinheiro'] as const), 1.2 + rnd() * 0.5, rnd()), naBeira(s0 + 4 + k * 10 + rnd() * 3, lado, 9 + rnd() * 9), rnd() * 6.28);
        const sBanco = s0 + 14 + (lado > 0 ? 0 : 12);
        por(bancoDePraca(), naBeira(sBanco, lado, 0.9), paraAPista(sBanco, lado));
        for (let k = 0; k < 3; k++) roxas.push({ ...xz(naBeira(sBanco + 2.2 + k * 0.6, lado, 1.2 + (k % 2) * 0.4)), escala: 1.1, semente: indice * 5 + k });
        for (let k = 0; k < 2; k++) moitas.push({ ...xz(naBeira(s0 + 6 + k * 19 + rnd() * 4, lado, 3.6 + rnd() * 2)), escala: 1 + rnd() * 0.2, semente: indice * 3 + k });
      }
      for (const s of [s0 + 8, s0 + 28]) por(lamp(), naPista(s, PISTA.meia + PISTA.calcada - 0.45, ALTO_DA_CALCADA), 0);
    } else if (bioma === 'hortas') {
      por(hortaDaAlameda(indice * 0.17), naBeira(s0 + 17, 1, 10), paraAPista(s0 + 17, 1));
      por(pomarDaAlameda(indice), naBeira(s0 + 20, -1, 5.5), rumoEm(s0 + 20));
      for (const lado of [-1, 1]) {
        por(tree('florida', 1.05, indice), naBeira(s0 + 3, lado, 4.5), 0);
        moitas.push({ ...xz(naBeira(s0 + 27, lado, 1.1)), escala: 1, semente: indice });
      }
      por(lamp(), naPista(s0 + 8, 5.5, ALTO_DA_CALCADA), 0);
    } else if (bioma === 'esportivo') {
      por(quadraNaAlameda(), naBeira(s0 + 20, 1, 11), rumoEm(s0 + 20));
      por(jardineiraDoEstacionamento(), naBeira(s0 + 9, -1, 0.9), rumoEm(s0 + 9));
      por(posteDoEstacionamento(), naBeira(s0 + 28, 1, 0.4), rumoEm(s0 + 28));
      for (const lado of [-1, 1]) for (const ds of [4, 30]) por(tree('palmeira', 1.05, indice + ds), naBeira(s0 + ds, lado, 2.1), 0);
    } else if (bioma === 'escolar') {
      /*
       * A ZONA ESCOLAR (a rota da escola): do lado direito, o muro de tijolo com
       * a grade de lanças da escola (em dois pedaços por trecho: a pista é curva,
       * e um pedaço reto de 38 m sairia da calçada), o gramado e as árvores
       * atrás; do lado esquerdo, a praça do bairro da escola — os bancos bordô,
       * o bicicletário, os canteiros de hortênsia. Os postes altos com as
       * bandeirolas dos Gatitos, dos dois lados.
       */
      for (const [a, b] of [[s0 + 1, s0 + 20], [s0 + 20.5, s1 - 0.5]] as const) {
        por(gradeDaEscola(b - a), naBeira(b, 1, 0.55), paraAPista(b, 1));
      }
      for (let k = 0; k < 4; k++) por(tree(w.pick(['redonda', 'redonda', 'florida'] as const), 1.1 + rnd() * 0.4, rnd()), naBeira(s0 + 5 + k * 10, 1, 5 + rnd() * 6), rnd() * 6.28);
      for (const lado of [-1, 1]) por(posteDaEscola(), naBeira(s0 + (lado > 0 ? 10 : 30), lado, -0.4), rumoEm(s0 + 10));
      const sBanco = s0 + 14;
      por(bancoDePraca(P.escolaBanco, P.escolaBancoFerro), naBeira(sBanco, -1, 1.1), paraAPista(sBanco, -1));
      por(bicicletario(4), naBeira(s0 + 25, -1, 1.2), paraAPista(s0 + 25, -1));
      por(tree(w.pick(['florida', 'redonda'] as const), 1.05 + rnd() * 0.3, rnd()), naBeira(s0 + 4, -1, 4 + rnd() * 3), rnd() * 6.28);
      por(tree('redonda', 1.3 + rnd() * 0.3, rnd()), naBeira(s0 + 33, -1, 7 + rnd() * 4), rnd() * 6.28);
      for (let k = 0; k < 3; k++) flores.push({ ...xz(naBeira(s0 + 17.5 + k * 0.9, -1, 1.3)), escala: 0.85, semente: indice * 9 + k, cor: w.pick([P.hortensiaAzul, P.hortensiaLilas]) });
      moitas.push({ ...xz(naBeira(s0 + 8, -1, 1.0)), escala: 1, semente: indice * 4 });
    } else {
      // a beira do parque: bosque dos dois lados, mais fechado, com capim e hortênsia na borda
      for (const lado of [-1, 1]) {
        for (let k = 0; k < 7; k++) {
          const s = s0 + 2 + k * 5.5 + rnd() * 2;
          // (nada de árvore na pista do fim da ida: é onde a roda gigante aparece)
          por(tree(w.pick(['redonda', 'pinheiro', 'florida', 'redonda', 'pinheiro'] as const), 1.15 + rnd() * 0.7, rnd()), naBeira(s, lado, 2.2 + rnd() * 16), rnd() * 6.28);
        }
        for (let k = 0; k < 3; k++) moitas.push({ ...xz(naBeira(s0 + 5 + k * 13 + rnd() * 3, lado, 0.9 + rnd() * 0.8)), escala: 0.9 + rnd() * 0.3, semente: indice * 11 + k });
        flores.push({ ...xz(naBeira(s0 + 20 + rnd() * 6, lado, 1.3)), escala: 1, semente: indice * 13, cor: w.pick([P.hortensiaAzul, P.hortensiaLilas]) });
      }
      por(lamp(), naPista(s0 + 18, PISTA.meia + PISTA.calcada - 0.45, ALTO_DA_CALCADA), 0);
    }
    grupo.add(fundirComoFundo(cenario));
    if (flores.length) grupo.add(hortensias(flores));
    if (moitas.length) grupo.add(capins(moitas, vento));
    if (roxas.length) grupo.add(lavandas(roxas, vento));
    w.add(grupo);
    trechos.push({ grupo, s0, s1 });
  }

  // a chegada: a roda gigante lá na frente (a ida) ou a casa do Ari (a volta), e a placa do destino no meio do caminho
  const chegada = new THREE.Group();
  chegada.userData.peca = 'chegada-da-viagem';
  let aro: THREE.Object3D | null = null;
  if (paraClube) {
    const s = rota.chegada + 4;
    const portal = portaoDoClube(7);
    portal.position.copy(naBeira(s, 1, 1)); portal.rotation.y = paraAPista(s, 1); chegada.add(portal);
    for (const ds of [-10, 10]) {
      const muro = muroDoClube(12); muro.position.copy(naBeira(s + ds, 1, 1)); muro.rotation.y = rumoEm(s + ds) + Math.PI / 2; chegada.add(muro);
    }
    const piscina = poolWater(10, 7); piscina.position.copy(naBeira(s + 4, 1, 16, 0.03)); chegada.add(piscina);
    const cobertura = coberturaDoEstacionamento(); cobertura.position.copy(naBeira(s + 8, -1, 6)); cobertura.rotation.y = rumoEm(s); chegada.add(cobertura);
  } else if (paraEscola) {
    /*
     * A ESCOLA NO FIM DA RUA: do lado direito, a grade de lanças com o PORTÃO
     * de ferro no meio, o calçadão até o prédio de tijolinho (a rotunda com a
     * cúpula e a lanterninha aparecem de longe) e os três mastros balançando;
     * do lado esquerdo, o estacionamento, para onde o carro vai. As peças são
     * as do pátio (`world/escolaPorFora.ts`, `portariaDaEscola.ts`,
     * `patioDaEscola.ts`), uma vez só, no grupo da chegada.
     */
    const sPortao = rota.chegada + 2;
    const predio = predioDaEscola();
    predio.position.copy(naBeira(sPortao, 1, 26));
    predio.rotation.y = paraAPista(sPortao, 1);
    w.add(fundir(predio));
    const portao = portaoDaEscola();
    portao.position.copy(naBeira(sPortao, 1, 0.55));
    portao.rotation.y = paraAPista(sPortao, 1);
    chegada.add(portao);
    // a grade nasce com o +X para trás na pista (o giro de "dar a frente para a pista" do lado direito)
    const { meiaVao, pilar } = PORTAO_DA_ESCOLA;
    for (const [inicio, comprimento] of [[sPortao - meiaVao - pilar, 34], [sPortao + meiaVao + pilar + 34, 34]] as const) {
      const grade = gradeDaEscola(comprimento);
      grade.position.copy(naBeira(inicio, 1, 0.55));
      grade.rotation.y = paraAPista(inicio, 1);
      chegada.add(grade);
    }
    // o calçadão do portão ao prédio (a pista é reta no fim: dá para pôr o retângulo deitado no mundo)
    const meioDoCalcadao = naBeira(sPortao, 1, 9);
    w.patch(meioDoCalcadao.x, meioDoCalcadao.z, 17, 6.8, P.concrete, rumoEm(sPortao) + Math.PI / 2, 0.02);
    const mastros = [
      new MastroComBandeira('gatitos', 10.5, 2.6, 0),
      new MastroComBandeira('brasil', 8.6, 2.1, 1.3),
      new MastroComBandeira('venezuela', 8.6, 2.1, 2.7),
    ];
    mastros[0].group.position.copy(naBeira(sPortao, 1, 9));
    mastros[1].group.position.copy(naBeira(sPortao - 12, 1, 15));
    mastros[2].group.position.copy(naBeira(sPortao + 12, 1, 15));
    for (const m of mastros) w.add(m.group);
    w.onUpdate((dt) => { if (estado.s > rota.chegada - 170) for (const m of mastros) m.update(dt); });
    // do outro lado, o estacionamento: o asfalto, os carros e a placa do "P"
    const meioDoLote = naBeira(sPortao + 4, -1, 9);
    w.patch(meioDoLote.x, meioDoLote.z, 14, 24, P.asphalt, rumoEm(sPortao) + Math.PI / 2, 0.02);
    const cores = [P.carroVermelho, P.carroMenta, P.carroAmarelo, P.carroLilas];
    cores.forEach((cor, k) => {
      const c = carroEstacionado(cor);
      c.position.copy(naBeira(sPortao - 6 + k * 3.4, -1, 6.5));
      c.rotation.y = paraAPista(sPortao, -1) + Math.PI;
      chegada.add(c);
    });
    const pe = placaDeEstacionamento();
    pe.position.copy(naBeira(rota.chegada - 6, -1, 0.5));
    pe.rotation.y = rumoEm(rota.chegada) + Math.PI;
    chegada.add(pe);
  } else if (ida) {
    const roda = rodaAoLonge(13);
    roda.position.copy(naPista(L + 62, 20));
    roda.rotation.y = rumoEm(L) + Math.PI + 0.5;
    aro = roda.userData.aro as THREE.Object3D;
    w.add(fundir(roda));
    // a beira do parque: o gradil ao longo da calçada, o portal de madeira e dois bancos
    for (let s = rota.chegada - 44; s < rota.chegada + 30; s += 6) {
      if (Math.abs(s - rota.chegada - 4) < 4) continue; // o vão da entrada
      const grade = fence(6, 1.15);
      grade.position.copy(naBeira(s, 1, 0.35));
      grade.rotation.y = rumoEm(s) + Math.PI / 2;
      chegada.add(grade);
    }
    // do outro lado, a placa do estacionamento: é lá que o carro para (`eventos/bebitoMobile/noParque.ts`)
    const pe = placaDeEstacionamento();
    pe.position.copy(naBeira(rota.chegada - 4, -1, 0.5));
    pe.rotation.y = rumoEm(rota.chegada) + Math.PI;
    chegada.add(pe);
    const portal = signBoard(P.wood, P.metalWhite);
    portal.position.copy(naBeira(rota.chegada + 9, 1, 0.9));
    portal.rotation.y = paraAPista(rota.chegada + 9, 1) + 0.5;
    chegada.add(portal);
    for (const ds of [-9, 14]) {
      const banco = bancoDePraca();
      banco.position.copy(naBeira(rota.chegada + ds, 1, 1.6));
      banco.rotation.y = paraAPista(rota.chegada + ds, 1);
      chegada.add(banco);
    }
  } else {
    const s = rota.chegada + 2;
    const casa = fachadaDaCasa();
    casa.position.copy(naBeira(s, 1, 8.2));
    casa.rotation.y = paraAPista(s, 1);
    chegada.add(casa);
    const muro = muroDoJardim(10);
    muro.position.copy(naBeira(s, 1, 0.5));
    muro.rotation.y = rumoEm(s) + Math.PI / 2;
    chegada.add(muro);
  }
  const NOME_NA_PLACA: Record<DestinoDeCarro, string> = { clube: 'CLUBE', parque: 'VILLA LOBOS', casa: 'CASA', escola: 'ESCOLA' };
  const placa = placaDeDestino(NOME_NA_PLACA[destino], '300 m');
  placa.position.copy(naPista(L - 300, PISTA.meia + PISTA.calcada + 0.6));
  placa.rotation.y = rumoEm(L - 300) + Math.PI;
  chegada.add(placa);
  w.add(fundir(chegada));

  // ---------------------------------------------------------------- os eventos
  const respingos = new Respingos();
  w.add(respingos.malha);
  const pontosDeCone: THREE.Vector3[] = [];
  /** cada cone, e de que obra ele é (uma obra conta UM tropeço, bata em quantos bater) */
  const donoDoCone: number[] = [];
  interface Vivo {
    e: EventoDaRota;
    indice: number;
    travessia?: TravessiaDeBichos;
    semaforo?: Semaforo;
    relogio: number;
    /** o carro freou sozinho aqui (o susto) */
    assustou: boolean;
    /** quem dirige parou a tempo */
    parou: boolean;
    contou: boolean;
    bateu: boolean;
    /** `ate`: até onde ele vai antes de encostar; `l`: o lado dele (vai para a calçada quando encosta) */
    onibus?: { peca: OnibusDaCidade; s: number; l: number; ate: number; andando: boolean; passou: boolean };
    cavaletes?: Array<{ s: number; l: number; peca: THREE.Group }>;
    passou: boolean;
    avisou: boolean;
    cookie?: BolhasDoCookie;
    rega?: RegaNaAlameda;
    onda?: OndaVerde;
    limiteOnda?: number;
  }
  const vivos: Vivo[] = [];
  const placaEm = (desenho: DesenhoDaPlaca, s: number): void => {
    const p = placaDeTransito(desenho);
    p.position.copy(naPista(s, PISTA.meia + 0.55, ALTO_DA_CALCADA));
    p.rotation.y = rumoEm(s) + Math.PI;
    w.add(fundir(p));
  };
  rota.eventos.forEach((e, indice) => {
    const vivo: Vivo = { e, indice, relogio: 0, assustou: false, parou: false, contou: false, bateu: false, passou: false, avisou: false };
    const lFaixa = PISTA.meios[e.faixa];
    if (e.bolhasDoCookie) { vivo.cookie = new BolhasDoCookie(naPista, e.s, rumoEm(e.s)); w.add(vivo.cookie.group); }
    if (e.tipo === 'travessia') {
      w.add(faixaDePedestres(naPista, e.s));
      placaEm(e.bichos === 'patos' ? 'patos' : 'tigres', e.s - 34);
      const lado = e.lado ?? 1;
      const fora = PISTA.meia + 1.5;
      const travessia = new TravessiaDeBichos(
        e.bichos ?? 'patos', e.quantos ?? 3,
        naPista(e.s, lado * fora), naPista(e.s, -lado * (fora + 0.6)),
        [fora - PISTA.meia, fora + PISTA.meia], rota.semente * 3 + indice, ALTO_DA_CALCADA,
      );
      travessia.aoSoar = (som) => g.som(som);
      w.add(travessia.group);
      vivo.travessia = travessia;
    } else if (e.tipo === 'semaforo') {
      w.add(faixaDePedestres(naPista, e.s));
      placaEm('semaforo', e.s - 38);
      const semaforo = new Semaforo(PISTA.meia + 1.2);
      semaforo.group.position.copy(naPista(e.s + 2.2, PISTA.meia + 0.6, ALTO_DA_CALCADA));
      semaforo.group.rotation.y = rumoEm(e.s) + Math.PI;
      w.add(fundir(semaforo.group));
      vivo.semaforo = semaforo;
    } else if (e.tipo === 'obra') {
      placaEm('obra', e.s - 36);
      const lado = e.faixa === 0 ? -1 : 1;
      // o funil de cones: da guia até a linha do meio, e depois acompanhando a faixa fechada
      for (let k = 0; k < 5; k++) {
        pontosDeCone.push(naPista(e.s - 10 + k * 2.5, lado * (PISTA.meia - 0.45 - k * 0.72)));
        donoDoCone.push(indice);
      }
      for (let k = 0; k < 5; k++) {
        pontosDeCone.push(naPista(e.s + 1.5 + k * 3.6, lado * 0.32));
        donoDoCone.push(indice);
      }
      vivo.cavaletes = [2.2, 12.5].map((ds) => {
        const peca = cavaleteDeObra();
        peca.position.copy(naPista(e.s + ds, lFaixa));
        peca.rotation.y = rumoEm(e.s + ds);
        w.add(fundir(peca));
        return { s: e.s + ds, l: lFaixa, peca };
      });
    } else if (e.tipo === 'buracos') {
      placaEm('buracos', e.s - 32);
      (e.buracos ?? []).forEach((b, k) => {
        const peca = buraco(indice * 3 + k);
        peca.position.copy(naPista(e.s + b.ds, b.l));
        peca.rotation.y = k * 1.3;
        w.add(peca);
      });
    } else if (e.tipo === 'lombada') {
      placaEm('lombada', e.s - 30);
      const peca = lombada();
      peca.position.copy(naPista(e.s, 0));
      peca.rotation.y = rumoEm(e.s);
      w.add(peca);
    } else if (e.tipo === 'poca') {
      const peca = poca(indice + 1);
      peca.position.copy(naPista(e.s, lFaixa));
      peca.rotation.y = rumoEm(e.s);
      w.add(peca);
    } else if (e.tipo === 'rega') {
      vivo.rega = new RegaNaAlameda(naPista, e.s, rumoEm(e.s)); w.add(vivo.rega.group);
      placaEm('rega', e.s - 30);
    } else if (e.tipo === 'onda-verde') {
      vivo.onda = new OndaVerde(e.s, naPista, rumoEm); w.add(vivo.onda.group);
    } else if (e.tipo === 'onibus') {
      const peca = new OnibusDaCidade({ destino: ida ? 'Villa Lobos' : 'Clube' });
      w.add(fundir(peca.group));
      // ele anda até um pouco antes do evento seguinte e ENCOSTA na calçada (não atravessa faixa nem obra)
      const seguinte = rota.eventos[indice + 1];
      const ate = Math.min(seguinte ? seguinte.s - 42 : rota.chegada - 80, rota.chegada - 80);
      vivo.onibus = { peca, s: e.s, l: lFaixa, ate, andando: false, passou: false };
    }
    vivos.push(vivo);
  });
  const cones = new Cones(pontosDeCone);
  w.add(cones.malha);
  const coracoes = new Coracoes(rota.coracoes.map((c) => naPista(c.s, c.l, 1.05)));
  w.add(coracoes.malha);

  // ------------------------------------------------------------------- o carro
  const carro = new BebitoMobile(g.fichaDoBebitoMobile());
  w.add(fundir(carro.group));
  const estado: EstadoDaViagem = {
    s: 6, l: PISTA.meios[1], v: 0, fase: 'partida',
    coracoes: 0, tropecos: 0, sustos: 0, gentilezas: 0, vistos: {}, aviso: '', visao: 'fora', piloto: false,
  };
  depuracaoDaViagem.estado = estado;
  depuracaoDaViagem.rota = rota;
  depuracaoDaViagem.camera = null;
  depuracaoDaViagem.naPista = (s, l) => xz(naPista(s, l));
  let vl = 0;
  let pulo = 0;
  let vPulo = 0;
  let relogio = 0;
  let ronco = 0;
  let freando = false;
  let buzinaEm = -9;
  let ultimoCoracao = -9;
  const marca = (tipo: string): void => { estado.vistos[tipo] = (estado.vistos[tipo] ?? 0) + 1; };
  /** um tropeço (nota da viagem), com o motivo guardado em `vistos` (o teste diz qual foi) */
  const tropecar = (motivo: string): void => { estado.tropecos += 1; marca(`tropeço:${motivo}`); };

  // quem dirige senta no lugar do motorista, seja quem for que o jogador controla
  // A visão do passageiro muda apenas a câmera; a escolha vale até estacionar.
  const jogadorDirige = g.playerId() === pedido.motorista;
  const acima = new V(0, -0.47, 0);
  /*
   * OS DOIS SENTAM NO PRIMEIRO QUADRO, e não aqui: o motor põe a dupla no
   * ponto de chegada DEPOIS de montar a cena (e desfaz qualquer carona), então
   * quem sentasse no `build` aparecia em pé no meio da estrada.
   */
  let sentados = false;
  const sentar = (): void => {
    sentados = true;
    g.lockPlayer(true);
    g.ridePlayer(jogadorDirige ? carro.assentos.motorista : carro.assentos.passageiro, acima, 1, 0);
    g.rideCompanion(jogadorDirige ? carro.assentos.passageiro : carro.assentos.motorista, acima, 1, 0);
    g.poseNoCarro('jogador', jogadorDirige ? 'dirigindo' : 'passageiro');
    g.poseNoCarro('parceiro', jogadorDirige ? 'passageiro' : 'dirigindo');
  };
  const carona = pedido.motorista === ARI.id ? RENAN : ARI;
  const motorista = pedido.motorista === ARI.id ? ARI : RENAN;
  const encontro = rota.encontro ? new EncontroNaEstrada(g, rota.encontro.s, naPista, rumoEm, carona.name, rota.encontro.personagem) : null;
  if (encontro) w.add(encontro.carro.group);
  w.root.userData.novidadesDaViagem = { cookie: vivos.find(v => v.cookie)?.cookie, encontro, noel: encontro?.personagem === 'noel' ? encontro : null, rega: vivos.find(v => v.rega)?.rega, onda: vivos.find(v => v.onda)?.onda };
  let visaoAntesDoEncontro = false;
  let ultimaFala = -9;
  /** a carona é sempre o outro de quem foi escolhido para dirigir */
  const caronaAgora = (): typeof ARI => carona;
  /** a carona comenta num aviso de canto, sem parar o carro (e sem atropelar o comentário anterior) */
  const comentar = (momento: Momento, sempre = false): void => {
    if (!sempre && relogio - ultimaFala < 3.2) return;
    ultimaFala = relogio;
    const c = caronaAgora();
    const opcoes = FALAS[c.id === ARI.id ? 'ari' : 'renan'][momento];
    g.toast(`${c.name}: ${opcoes[Math.floor(rnd() * opcoes.length)]}`, '💬');
  };
  if (rota.momento === 'tarde') carro.acenderFarois(true);

  // --------------------------------------------------------------- a câmera
  const olho = new V();
  const olhar = new V();
  const alvoDoOlho = new V();
  const frente = new V();
  let cameraPosta = false;
  const filmar = (dt: number, aplicar = true): void => {
    const emPe = typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.8;
    const p = carro.group.position;
    // (a câmera olha para onde a pista VAI, um pouco à frente: a curva aparece antes de chegar)
    frenteEm(estado.s + 5, frente);
    const longe = emPe ? 10.8 : 8.4;
    const alto = emPe ? 6.4 : 4.7;
    alvoDoOlho.set(p.x - frente.x * longe, alto, p.z - frente.z * longe);
    if (!cameraPosta) {
      olho.copy(alvoDoOlho);
      cameraPosta = true;
    } else olho.lerp(alvoDoOlho, 1 - Math.exp(-dt * 7));
    olhar.set(p.x + frente.x * 8, 1.1, p.z + frente.z * 8);
    if (!aplicar) return;
    const doTeste = depuracaoDaViagem.camera;
    if (doTeste) g.setCameraOmbro(new V(...doTeste.de), new V(...doTeste.para));
    else g.setCameraOmbro(olho, olhar);
  };

  // ---------------------------------------------------- a visão do passageiro (o carro por dentro)
  const comPassageiro = carroPorDentroNestaPagina();
  const quemVaiDeCarona = jogadorDirige ? 'parceiro' : 'jogador';
  const camDentro = new CameraDeDentro(g, carro, quemVaiDeCarona, false);
  const celular = new CelularDeJogo();
  if (comPassageiro) w.add(celular.group);
  const { esperar: esperarDaCena } = relogioDaCena(w);

  // ------------------------------------------------------------ o piloto do teste
  /** o manche que o piloto automático daria agora (o teste liga; `distraido` não mexe em nada) */
  const piloto = (): { x: number; y: number; buzina: boolean } => {
    const deJogo = estado.piloto && depuracaoDaViagem.piloto !== 'bom';
    if (depuracaoDaViagem.piloto !== 'bom' && !estado.piloto) return { x: 0, y: 0, buzina: false };
    /*
     * O PILOTO DE JOGO (a visão do passageiro): fica na faixa dele e NÃO persegue os corações
     * (os da viagem são de quem dirige) — e por isso olha as obras e os buracos de mais longe,
     * porque são os corações que mostram a faixa livre. A freada na faixa e no sinal é a do de
     * TESTE (`bom`), que já é provada: a primeira versão "mais suave" ficava se arrastando e
     * acelerando de novo (o manche só freia abaixo de −0,25) e furava o vermelho.
     */
    let alvoL = deJogo ? PISTA.meios[1] : estado.l;
    let y = 0;
    let melhor = 1e9;
    if (!deJogo) {
      // os corações mostram a faixa livre: segue o próximo
      rota.coracoes.forEach((c, i) => {
        const d = c.s - estado.s;
        if (!coracoes.pego(i) && d > 1 && d < 16 && d < melhor) {
          melhor = d;
          alvoL = c.l;
        }
      });
    }
    {
      /*
       * OS BURACOS: sem os corações para mostrar a faixa livre, o piloto de jogo PLANEJA (e o de
       * teste também: ele ia atrás do coração e só desviava a 11 m, tarde demais numa fileira
       * fechada — tropeçava na rota 3; aqui o coração entra só como a faixa preferida). Os buracos que
       * vêm nos próximos 24 m (os de uma fileira são vários, de lados diferentes) viram uma conta só: ele
       * escolhe a posição, de um lado a outro da pista, em que NENHUMA das duas rodas pega neles, perto
       * da faixa dele e da posição de agora. (Desviar de um de cada vez, o desvio do segundo jogava a
       * roda no primeiro.)
       */
      const ls: number[] = [];
      for (const vivo of vivos) {
        if (vivo.e.tipo !== 'buracos' || !vivo.e.buracos) continue;
        for (const b of vivo.e.buracos) {
          const db = vivo.e.s + b.ds - estado.s;
          if (db > -2 && db < 24) ls.push(b.l);
        }
      }
      if (ls.length) {
        // (com folga primeiro; se uma fileira fechada não deixa folga, a folga mínima)
        let melhorC = alvoL;
        for (const folga of [0.12, 0.02]) {
          let menor = Infinity;
          for (let c = -2.2; c <= 2.2 + 1e-6; c += 0.02) {
            let custo = Math.abs(c - alvoL) + Math.abs(c - estado.l) * 0.3;
            for (const bl of ls) if ([-0.9, 0.9].some((roda) => Math.abs(c + roda - bl) < RAIO_DO_BURACO * 0.95 + folga)) custo += 1000;
            if (custo < menor) { menor = custo; melhorC = c; }
          }
          if (menor < 1000) break;
        }
        alvoL = melhorC;
      }
    }
    for (const vivo of vivos) {
      const e = vivo.e;
      const d = e.s - estado.s;
      const outra = PISTA.meios[e.faixa === 0 ? 1 : 0];
      if (e.tipo === 'obra' && d < (deJogo ? 30 : 22) && d > -22) alvoL = outra;
      if (vivo.onibus && !vivo.onibus.passou && vivo.onibus.s - estado.s < 30 && vivo.onibus.s - estado.s > -12) alvoL = outra;
      if (e.tipo === 'lombada' && d > 0 && d < (novaRota ? 22 : 16) && estado.v > (novaRota ? 4.6 : 5)) y = -0.8;
      if (e.bolhasDoCookie && d > 0 && d < 25 && estado.v > 4.6) y = -0.8;
      if (e.tipo === 'rega' && d > 0 && d < 23 && estado.v > 4.6) y = -0.8;
      if (vivo.onda && d < 72 && d > -30) {
        if (vivo.onda.tempo < 8.3) y = 1;
        const falta = (vivo.limiteOnda ?? Infinity) - 2.9 - estado.s;
        if (falta < 30 && falta > -1) y = estado.v * estado.v / (2 * Math.max(0.5, falta)) > 4 || falta < 1.2 ? -1 : -0.4;
      }
      const parar = (vivo.travessia && vivo.travessia.estado !== 'feito') || (vivo.semaforo && vivo.semaforo.cor !== 'verde');
      const ateALinha = e.s - LINHA_DE_PARADA - 2.9 - estado.s;
      if (parar && ateALinha > -1 && ateALinha < 26) {
        const precisa = (estado.v * estado.v) / (2 * Math.max(0.5, ateALinha));
        if (precisa > 5 || ateALinha < 1.2) y = -1;
        else if (estado.v > 4) y = -0.4;
      }
    }
    const x = Math.max(-1, Math.min(1, (alvoL - estado.l) * 1.4));
    return { x, y, buzina: false };
  };

  // ------------------------------------------------ trocar de visão e o que fazer de carona
  let trocando = false;
  let menuAberto = false;
  let acaoAntes = false;
  /**
   * 👀 (ou V): liga a visão do passageiro — o carro assume o PILOTO AUTOMÁTICO e a câmera entra nos olhos
   * do passageiro de verdade, sem trocar os bancos ou o motorista escolhido.
   * De novo: volta à câmera externa e desliga o piloto automático.
   */
  const trocarDeVisao = async (): Promise<void> => {
    if (trocando || g.emDialogo() || estado.fase === 'fim' || encontro?.ativo) return;
    trocando = true;
    if (estado.visao === 'fora') {
      estado.piloto = true;
      g.toast(`Visão do passageiro: ${carona.name}`, '👀');
      estado.visao = 'dentro';
      camDentro.deitar(false);
      await camDentro.ligar(() => ({ de: olho, para: olhar }), 1.3);
    } else {
      await camDentro.desligar(() => ({ de: olho, para: olhar }), 1.0);
      estado.visao = 'fora';
      estado.piloto = false;
      g.toast('Visão externa', '🚙');
    }
    trocando = false;
  };
  depuracaoDaViagem.passageiro = { trocar: trocarDeVisao, camera: camDentro, celular };
  /** o botão sempre na tela, a tecla V, e o E (ação) que abre o menu do passageiro */
  const vigiarOPassageiro = (): void => {
    const noAr = !encontro?.ativo && (estado.fase === 'dirigindo' || estado.fase === 'chegando');
    g.botaoDaViagem(
      noAr
        ? { icone: estado.visao === 'dentro' ? '🚙' : '👀', rotulo: estado.visao === 'dentro' ? 'Voltar à visão externa' : 'Ver da janela do passageiro', ativo: estado.visao === 'dentro' }
        : null,
      () => { void trocarDeVisao(); },
    );
    if (noAr && g.keyPressed('KeyV', true)) void trocarDeVisao();
    const acao = g.acaoCrua();
    const bloqueado = g.emDialogo() || menuAberto || trocando;
    if (acao && !acaoAntes && !bloqueado && estado.visao === 'dentro' && camDentro.ativa && camDentro.dentro >= 0.99 && estado.fase === 'dirigindo') {
      menuAberto = true;
      void menuDoPassageiro({ g, quem: quemVaiDeCarona, camera: camDentro, celular, esperar: esperarDaCena, terminou: () => estado.fase === 'fim' }).finally(() => { menuAberto = false; });
    }
    // (com uma fala aberta o E avança a fala: só conta um E novo depois que ela fechar)
    acaoAntes = acao || bloqueado;
  };

  // ---------------------------------------------------------------- o quadro
  let terminou = false;
  w.onUpdate((quadro) => {
    if (!sentados) sentar();
    const dt = Math.min(0.05, quadro) * depuracaoDaViagem.vezes;
    relogio += dt;
    vento.tique(dt);
    carro.update(dt);
    cones.update(dt);
    respingos.update(dt);
    if (aro) aro.rotation.z += dt * 0.12;
    const encontroEstavaAtivo = encontro?.ativo;
    const podeReceberEncontro = estado.fase === 'dirigindo' && !g.emDialogo() && !menuAberto && !trocando;
    encontro?.update(dt, estado, podeReceberEncontro);
    if (encontro?.ativo && !encontroEstavaAtivo) {
      visaoAntesDoEncontro = estado.visao === 'dentro';
      if (visaoAntesDoEncontro) { camDentro.cortar(); estado.visao = 'fora'; }
    }
    if (encontroEstavaAtivo && encontro && !encontro.ativo) {
      marca(encontro.personagem);
      if (encontro.personagem === 'capy') g.unlock({ id: 'capy-na-estrada', title: 'Salva-vidas até no asfalto', place: 'Na estrada', icon: '🛵', note: 'O Capy apareceu de moto vermelha, capacete afivelado e um lembrete: nada de mergulhar nas curvas.' });
      else if (encontro.personagem === 'walter') g.unlock({ id: 'walter-na-estrada', title: 'Cachorro-quente sobre rodas', place: 'Na estrada', icon: '🌭', note: 'O Walter passou com o food truck vermelho, a salsicha gigante sorrindo no teto, abriu a janelinha do lado do Bebito e latiu um "au au" que, pelo jeito, queria dizer: passem no clube.' });
      else if (encontro.personagem === 'josefina') g.unlock({ id: 'josefina-na-estrada', title: 'As plantinhas também passeiam', place: 'Na estrada', icon: '🐢', note: 'A Josefina passou com o carro cheio de mudinhas, levando cada uma com todo o cuidado até seu cantinho de sol.' });
      else g.unlock({ id: 'noel-na-estrada', title: 'O suco não espera', place: 'Na estrada', icon: '🦃', note: 'O Noel passou de carro, parou do nosso lado e lembrou que tinha comprado laranja… mas esquecido o gelo.' });
      if (visaoAntesDoEncontro) { estado.visao = 'dentro'; void camDentro.ligar(() => ({ de: olho, para: olhar }), 1.1); }
    }

    // o manche: virar, acelerar e frear (com fala na tela, ou chegando, ninguém mexe). O PILOTO AUTOMÁTICO
    // dirige mesmo com uma fala ou o menu do passageiro na tela: o carro não pode parar de frear na faixa
    // só porque alguém abriu um balão
    const livre = estado.fase === 'dirigindo' && !g.emDialogo() && !encontro?.ativo;
    const automatico = depuracaoDaViagem.piloto !== 'nenhum' || estado.piloto;
    const manche = estado.fase !== 'dirigindo' ? { x: 0, y: 0 } : automatico ? piloto() : livre ? g.olharLivre() : { x: 0, y: 0 };
    const buzinou = livre && !automatico && g.acaoCrua();

    // ---- os eventos que mexem com o que o carro pode fazer
    /** o `s` que a FRENTE do carro não pode passar agora, e por quê */
    let limite = Infinity;
    if (encontro && encontro.parada !== null && (encontro.estado.fase === 'freando' || encontro.estado.fase === 'falando')) limite = encontro.parada + 2.6;
    let dono: Vivo | null = null;
    let aviso = '';
    let icone = '';
    let tom: 'atencao' | 'pare' | 'bom' = 'atencao';
    for (const vivo of vivos) {
      const e = vivo.e;
      const d = e.s - estado.s;
      if (vivo.cookie) {
        vivo.cookie.update(dt, d < 100 && d > -45);
        if (d > 0 && d < 42) { aviso = 'Bolhas do Cookie: passe devagar'; icone = '🫧'; }
        if (!vivo.avisou && d <= 0) {
          vivo.avisou = true; marca('bolhas-cookie'); const rapido = estado.v > 6.2;
          vivo.cookie.passar(rapido);
          if (rapido) g.toast('Cookie: Puf! Essa era do tamanho da roda gigante… Vou fazer outra!', '🐘');
          else { estado.coracoes += 2; estado.gentilezas++; g.som('coracao'); g.toast('Cookie: Obrigado! Olha só… nessa bolha eu até caibo!', '🐘'); }
        }
      }
      if (vivo.rega) {
        vivo.rega.update(dt, d < 110 && d > -45);
        if (d > 0 && d < 45) { aviso = 'Rega na alameda: passe devagar'; icone = '💦'; }
        if (!vivo.passou && d <= 0) {
          vivo.passou = true; marca('rega'); g.som('respingo');
          if (estado.v > 6.2) { tropecar('rega'); carro.solavanco(0.7); estado.v *= 0.75; g.toast(`${carona.name}: A Josefina regou até o Bebito!`, '💦'); }
          else { estado.coracoes += 2; estado.gentilezas += 1; g.som('coracao'); g.toast('Josefina: Obrigada por passar devagar, meus amores.', '🐢'); }
        }
      }
      if (vivo.onda) {
        vivo.limiteOnda = vivo.onda.update(dt, estado);
        limite = Math.min(limite, vivo.limiteOnda);
        if (d < 72 && d > -32) { aviso = Number.isFinite(vivo.limiteOnda) ? 'Sinal fechou: espere a próxima onda' : 'Onda verde: acelere no trecho livre'; icone = '🚦'; tom = Number.isFinite(vivo.limiteOnda) ? 'pare' : 'bom'; }
        if (!vivo.passou && d < -32) { vivo.passou = true; marca('onda-verde'); if (vivo.onda.verdeAproveitado) { marca('onda-aproveitada'); estado.coracoes += 3; g.som('coracao'); } }
      }
      if (vivo.travessia) {
        const t = vivo.travessia;
        if (t.estado === 'esperando' && d < 46 && d > 0) {
          t.comecar();
          comentar(e.bichos === 'patos' ? 'patos' : 'tigres', true);
        }
        if (d < 80 && d > -30) t.update(dt);
        if (t.estado === 'atravessando' && d > -2) {
          const linha = e.s - LINHA_DE_PARADA;
          if (t.naPista && linha < limite) {
            limite = linha;
            dono = vivo;
          }
          if (d < 46) {
            const parado = estado.v < 0.4;
            if (parado) vivo.parou = true;
            aviso = parado ? 'Esperando eles passarem…' : 'Pare na faixa!';
            icone = e.bichos === 'patos' ? '🦆' : '🐢';
            tom = parado ? 'bom' : 'pare';
          }
        }
        if (t.estado === 'feito' && !vivo.contou) {
          vivo.contou = true;
          marca('travessia');
          if (vivo.assustou) {
            estado.sustos += 1;
          } else if (vivo.parou) {
            // parou para eles: a gentileza vale três corações
            estado.gentilezas += 1;
            estado.coracoes += 3;
            g.som('coracao');
            comentar('obrigado', true);
          }
        }
      }
      if (vivo.semaforo) {
        const sinal = vivo.semaforo;
        const linha = e.s - LINHA_DE_PARADA;
        if (sinal.cor === 'verde' && !vivo.contou && d < 50 && d > 14) {
          sinal.acender('amarelo');
          vivo.relogio = 0;
          comentar('sinal');
        } else if (sinal.cor === 'amarelo') {
          vivo.relogio += dt;
          if (vivo.relogio > 1.1) {
            sinal.acender('vermelho');
            vivo.relogio = 0;
          }
        } else if (sinal.cor === 'vermelho') {
          vivo.relogio += dt;
          const naLinha = estado.s + 2.6 > linha - 9 && estado.s + 2.6 <= linha + 0.3;
          if (estado.v < 0.4 && naLinha) vivo.parou = true;
          // abre depois de um tempinho parado — ou sozinho, se ninguém chegou
          if ((vivo.parou && vivo.relogio > 3.2) || vivo.relogio > 9) {
            sinal.acender('verde');
            vivo.contou = true;
            marca('semaforo');
            if (vivo.parou && !vivo.bateu) {
              estado.gentilezas += 1;
              estado.coracoes += 2;
              g.som('coracao');
              comentar('sinalOk', true);
            }
          } else if (!vivo.bateu && estado.s + 2.6 > linha + 0.6 && estado.s < e.s + 6) {
            // furou o vermelho
            vivo.bateu = true;
            tropecar('sinal');
            marca('furou');
            comentar('furou', true);
          }
          if (d > -2 && d < 46 && sinal.cor === 'vermelho') {
            const parado = estado.v < 0.4;
            aviso = parado ? 'Esperando o sinal abrir…' : 'Sinal vermelho: pare na linha';
            icone = '🚦';
            tom = parado ? 'bom' : 'pare';
          }
        }
      }
      if (vivo.onibus) {
        const o = vivo.onibus;
        const dOnibus = o.s - estado.s;
        if (!o.andando && dOnibus < 60) o.andando = true;
        const encostando = o.s >= o.ate;
        const ladoDaCalcada = e.faixa === 0 ? -1 : 1;
        const alvoL = encostando ? ladoDaCalcada * (PISTA.meia + 1.5) : PISTA.meios[e.faixa];
        if (o.andando && (!encostando || Math.abs(o.l - alvoL) > 0.05)) {
          // (encostando, ele ainda anda uns metros enquanto sai da pista)
          const passo = (encostando ? 2.4 : 4.3) * dt;
          o.s += passo;
          o.peca.rodar(passo);
          o.l += Math.max(-1.3 * dt, Math.min(1.3 * dt, alvoL - o.l));
          if (encostando && Math.abs(o.l - alvoL) <= 0.05) o.peca.piscaAlerta(true);
        }
        const lOnibus = o.l;
        const p = naPista(o.s, lOnibus);
        o.peca.group.position.copy(p);
        const f = frenteEm(o.s);
        o.peca.group.rotation.y = Math.atan2(-f.z, f.x);
        o.peca.update(dt);
        // atrás dele, na mesma faixa: não dá para passar por dentro
        const mesmaFaixa = Math.abs(estado.l - lOnibus) < 2.35;
        if (mesmaFaixa && dOnibus > 0) {
          const traseira = o.s - 4.6 - 0.9;
          if (traseira < limite) {
            limite = traseira;
            dono = vivo;
          }
          if (dOnibus < 30 && !aviso) {
            aviso = 'Ônibus devagar: ultrapasse pela outra faixa';
            icone = '🚌';
            if (!vivo.avisou) {
              vivo.avisou = true;
              comentar('onibus');
            }
          }
        }
        // do lado dele: o carro não entra na lataria
        if (Math.abs(dOnibus) < 4.6 + 2.6 && Math.abs(estado.l - lOnibus) < 2.45) {
          estado.l = lOnibus + (estado.l >= lOnibus ? 2.45 : -2.45);
          vl = 0;
        }
        if (!o.passou && dOnibus < -9) {
          o.passou = true;
          marca('onibus');
          estado.coracoes += 2;
          g.som('coracao');
          comentar('passou');
        }
      }
      if (vivo.cavaletes) {
        for (const c of vivo.cavaletes) {
          const dc = c.s - estado.s;
          if (Math.abs(estado.l - c.l) < 0.8 + 1.1 && dc > 0 && c.s - 0.35 < limite) {
            limite = c.s - 0.35;
            dono = vivo;
          }
          // a luz âmbar piscando
          const acesa = Math.floor(relogio * 2.2 + c.s) % 2 === 0;
          const luz = c.peca.getObjectByName('luz-acesa');
          if (luz && luz.visible !== acesa) {
            luz.visible = acesa;
            const apagada = c.peca.getObjectByName('luz-apagada');
            if (apagada) apagada.visible = !acesa;
          }
        }
        if (d > 0 && d < 34 && !aviso) {
          aviso = 'Obra na pista: troque de faixa';
          icone = '🚧';
        }
        if (!vivo.passou && d < -18) {
          vivo.passou = true;
          marca('obra');
        }
      }
      if (e.tipo === 'lombada') {
        if (d > 0 && d < 30 && !aviso) {
          aviso = 'Lombada: freie';
          icone = '⚠️';
        }
        if (!vivo.passou && d <= 0) {
          vivo.passou = true;
          marca('lombada');
          if (estado.v > 6.2) {
            // rápido demais: o carro pula
            vPulo = 2.6 + estado.v * 0.12;
            carro.solavanco(1.7);
            g.som('tranco');
            tropecar('lombada');
            comentar('lombadaForte', true);
          } else {
            carro.solavanco(0.5);
            estado.coracoes += 1;
            g.som('coracao');
            comentar('lombadaSuave');
          }
        }
      }
      if (e.tipo === 'buracos' && e.buracos) {
        if (d > 0 && d < 30 && !aviso) {
          aviso = 'Buracos: desvie';
          icone = '🕳️';
        }
        e.buracos.forEach((b, k) => {
          const sb = e.s + b.ds;
          const chave = 1 << k;
          if (vivo.relogio & chave) return;
          if (estado.s >= sb) {
            vivo.relogio |= chave;
            // a roda da esquerda ou a da direita caiu nele?
            const caiu = [-0.9, 0.9].some((roda) => Math.abs(estado.l + roda - b.l) < RAIO_DO_BURACO * 0.95);
            if (caiu) {
              carro.solavanco(1.2);
              estado.v *= 0.72;
              g.som('tranco');
              respingos.espirrar(naPista(sb, b.l), P.buracoBeira, 7, 0.7);
              if (!vivo.bateu) {
                vivo.bateu = true;
                tropecar('buraco');
              }
              comentar('buraco', true);
            }
          }
        });
        if (!vivo.passou && d < -20) {
          vivo.passou = true;
          marca('buracos');
        }
      }
      if (e.tipo === 'poca' && !vivo.passou && d <= 0) {
        vivo.passou = true;
        marca('poca');
        if (Math.abs(estado.l - PISTA.meios[e.faixa]) < RAIO_DA_POCA + 0.5) {
          for (const roda of [-0.9, 0.9]) respingos.espirrar(naPista(e.s, estado.l + roda), P.aguaRasa, 9, 0.8 + estado.v * 0.06);
          g.som('respingo');
          estado.v *= 0.94;
          estado.coracoes += 1;
          comentar('poca', true);
        }
      }
    }

    // ---- a buzina
    if (buzinou && relogio - buzinaEm > 0.45) {
      buzinaEm = relogio;
      g.som('buzinaDoBebito');
      for (const vivo of vivos) {
        if (!vivo.travessia || Math.abs(vivo.e.s - estado.s) > 40) continue;
        const efeito = vivo.travessia.buzinar();
        if (efeito === 'apressou') comentar('buzinaPatos', true);
        if (efeito === 'escondeu') comentar('buzinaTigres', true);
      }
    }

    // ---- a velocidade
    const antes = estado.v;
    if (estado.fase === 'partida') {
      if (relogio > 1.1 && !g.emDialogo()) {
        estado.fase = 'dirigindo';
        if (novaRota) g.toast(`${carona.name}: Cinto colocado. Partiu ${({ clube: 'clube', parque: 'parque', casa: 'casa', escola: 'escola' } as const)[destino]}!`, '🚙');
        else comentar('partida', true);
      }
    } else if (estado.fase === 'dirigindo') {
      if (encontro?.ativo) estado.v += THREE.MathUtils.clamp(encontro.velocidade(estado.s) - estado.v, -7 * dt, 4 * dt);
      else if (manche.y < -0.25) estado.v = Math.max(0, estado.v + manche.y * 17 * dt);
      else {
        const alvo = manche.y > 0.3 ? MAXIMA : CRUZEIRO;
        estado.v += Math.max(-3.5 * dt, Math.min(5 * dt, alvo - estado.v));
      }
      if (estado.s > rota.chegada - 58) estado.fase = 'chegando';
    } else if (estado.fase === 'chegando') {
      // chegando: o carro encosta na faixa da direita e para sozinho
      const falta = Math.max(0, rota.chegada - estado.s);
      const alvo = Math.min(CRUZEIRO, Math.sqrt(2 * 3.2 * falta) + 0.25);
      estado.v += Math.max(-9 * dt, Math.min(4 * dt, alvo - estado.v));
      if (falta < 0.15) {
        estado.v = 0;
        estado.fase = 'fim';
      }
      aviso = ({ clube: 'Chegando no clube!', parque: 'Chegando no Villa Lobos!', casa: 'Chegando em casa!', escola: 'Chegando na escola!' } as const)[destino];
      icone = ICONE_DO_DESTINO[destino];
      tom = 'bom';
    } else estado.v = 0;
    if (encontro?.estado.fase === 'esperando' && !podeReceberEncontro && estado.s > encontro.s - 65) {
      estado.v = Math.min(estado.v, Math.sqrt(8 * Math.max(0, encontro.s - 55 - estado.s)));
    }

    // o que não dá para atravessar: o carro freia a tempo, sozinho, e com susto se foi em cima
    const frenteDoCarro = estado.s + 2.6;
    if (Number.isFinite(limite)) {
      const falta = limite - frenteDoCarro;
      if (falta <= 0.02) {
        if (estado.v > 2.5 && dono?.cavaletes && !dono.bateu) {
          // bateu no cavalete: tranco, e o carro para
          dono.bateu = true;
          tropecar('cavalete');
          carro.solavanco(1.3);
          g.som('tranco');
          comentar('cone', true);
        }
        estado.v = 0;
        estado.s = Math.min(estado.s, limite - 2.6);
      } else {
        const precisa = (estado.v * estado.v) / (2 * falta);
        if (precisa > 12) {
          // freada de emergência
          estado.v = Math.max(0, estado.v - Math.min(34, precisa * 1.15) * dt);
          if (dono?.travessia && !dono.assustou && estado.v > 1.5) {
            dono.assustou = true;
            marca('susto');
            dono.travessia.assustar();
            carro.empurrar(1.1);
            g.som('freadaDoBebito');
            comentar('susto', true);
          }
        } else if (dono?.onibus && estado.v > 4.3 && falta < 7) {
          // atrás do ônibus ele só acompanha
          estado.v = Math.max(4.3, estado.v - 12 * dt);
        }
      }
    }
    const aceleracao = (estado.v - antes) / Math.max(dt, 1e-4);
    const agoraFreia = aceleracao < -5 && estado.v > 0.2;
    if (agoraFreia && !freando && antes > 6 && manche.y < -0.6) g.som('freadaDoBebito');
    freando = agoraFreia || (estado.v < 0.3 && estado.fase !== 'partida');
    carro.frear(freando);

    // ---- o lado
    const querLado = encontro?.ativo ? THREE.MathUtils.clamp((PISTA.meios[1] - estado.l) * 1.8, -1, 1)
      : estado.fase === 'chegando' ? Math.max(-1, Math.min(1, (PISTA.meios[1] - estado.l) * 1.2)) : manche.x;
    const alvoVl = querLado * 4.2 * Math.max(0.2, Math.min(1, estado.v / 5));
    vl += (alvoVl - vl) * Math.min(1, dt * 9);
    estado.l = Math.max(-PISTA.limite, Math.min(PISTA.limite, estado.l + vl * dt));
    if (Math.abs(estado.l) >= PISTA.limite) vl = 0;

    // ---- andar
    const passo = estado.v * dt;
    estado.s += passo;
    carro.rodar(passo);
    carro.estercar(Math.max(-0.5, Math.min(0.5, -vl * 0.14)));
    carro.andando(Math.min(1, estado.v / MAXIMA));
    carro.empurrar(-aceleracao * 0.012 * dt * 8, vl * 0.02 * dt * 8);
    vPulo -= 13 * dt;
    pulo = Math.max(0, pulo + vPulo * dt);
    if (pulo === 0 && vPulo < -2.5) {
      carro.solavanco(0.9);
      vPulo = 0;
    }
    if (pulo === 0) vPulo = Math.max(0, vPulo);
    const p = naPista(estado.s, estado.l, pulo);
    carro.group.position.copy(p);
    // (o nariz aponta um pouco para onde ele vai de lado: mais que isso, parecia derrapar)
    carro.group.rotation.y = rumoEm(estado.s) + Math.atan2(vl, Math.max(estado.v, 5)) * -0.55;
    const giroDoVolante = Math.max(-1.3, Math.min(1.3, -vl * 0.45));
    // (depois da chegada a pose já foi desfeita: o quadro continua rodando durante a troca de cena,
    // e pôr "dirigindo" de novo aqui deixava os dois de volante na mão ao sair do carro)
    if (!terminou) g.poseNoCarro(jogadorDirige ? 'jogador' : 'parceiro', 'dirigindo', giroDoVolante);

    // ---- o motor
    ronco -= dt;
    if (estado.v > 0.5 && ronco <= 0) {
      // (mais depressa, o pó-pó-pó aperta um pouco)
      ronco = 0.38 - Math.min(0.1, estado.v * 0.007);
      g.som('motorDoBebito');
    }

    // ---- os corações e os cones
    frenteEm(estado.s, frente);
    rota.coracoes.forEach((c, i) => {
      if (coracoes.pego(i)) return;
      if (Math.abs(c.s - estado.s) < 1.9 && Math.abs(c.l - estado.l) < 1.35) {
        coracoes.pegar(i);
        estado.coracoes += 1;
        if (relogio - ultimoCoracao > 0.09) g.som('coracao');
        ultimoCoracao = relogio;
      }
    });
    coracoes.update(dt, (i) => Math.abs(rota.coracoes[i].s - estado.s) < 70);
    for (let i = 0; i < cones.quantos; i++) {
      if (cones.derrubado(i)) continue;
      const pc = cones.posicao(i);
      const dx = pc.x - p.x;
      const dz = pc.z - p.z;
      const aoLongo = dx * frente.x + dz * frente.z;
      const deLado = dx * -frente.z + dz * frente.x;
      if (Math.abs(aoLongo) < 2.7 && Math.abs(deLado) < 1.3 && estado.v > 0.8) {
        cones.derrubar(i, frente, deLado >= 0 ? 1 : -1, estado.v);
        g.som('quicar');
        estado.v *= 0.86;
        const obra = vivos[donoDoCone[i]];
        if (!obra.bateu) {
          obra.bateu = true;
          tropecar('cone');
          comentar('cone', true);
        }
      }
    }

    // ---- o que se vê: só os trechos de perto
    // A tomada do encontro olha também para trás: não cortar o asfalto no fundo.
    for (const t of trechos) t.grupo.visible = t.s1 > estado.s - (encontro?.ativo ? 200 : 22) && t.s0 < estado.s + 160;
    // a câmera: a de perseguição, ou (visão do passageiro) a de dentro do carro, que desliza de uma para a outra
    if (encontro?.ativo) {
      filmar(dt, false);
      const tomada = encontro.camera(estado); g.setCameraOmbro(tomada.de, tomada.para);
    } else if (estado.visao === 'dentro' && camDentro.ativa) {
      filmar(dt, false);
      if (camDentro.dentro >= 0.99 && !g.emDialogo()) camDentro.olhar(dt);
      camDentro.update(dt);
    } else filmar(dt);
    celular.update(dt);
    if (comPassageiro) vigiarOPassageiro();

    // ---- o painel
    if (encontro?.ativo) { aviso = encontro.estado.fase === 'falando' ? `${encontro.nome} parou para conversar…` : `Dando passagem a ${encontro.nome}`; icone = encontro.icone; }
    if (!aviso && estado.fase === 'dirigindo' && relogio < 9) {
      const toque = typeof window !== 'undefined' && 'ontouchstart' in window;
      aviso = toque ? 'Manche: vira e freia · botão: buzina' : '← → vira · ↓ freia · ↑ acelera · E buzina';
      icone = '🚙';
    }
    if (estado.piloto && aviso && !encontro?.ativo) aviso = tom === 'pare' ? 'O Bebito está parando…' : 'O Bebito está de olho na pista…';
    if (!aviso && estado.visao === 'dentro' && camDentro.dentro >= 0.99 && estado.fase === 'dirigindo') {
      const toque = typeof window !== 'undefined' && 'ontouchstart' in window;
      aviso = toque ? '✨ escolhe o que fazer · 🚙 visão externa' : 'E: o que fazer · V: visão externa';
      icone = '👀';
    }
    estado.aviso = aviso;
    g.painelDaViagem({
      coracoes: estado.coracoes, progresso: estado.s / rota.chegada, destino: ICONE_DO_DESTINO[destino],
      aviso: estado.fase === 'fim' ? '' : aviso, icone, tom,
    });

    // A fala da chegada espera a interação corrente; nunca sobrescreve um ask/say pendente.
    if (estado.fase === 'fim' && !terminou && !menuAberto && !trocando) {
      terminou = true;
      void chegar();
    }
  });

  // ----------------------------------------------------------------- a chegada
  const chegar = async (): Promise<void> => {
    const estrelas = estrelasDaViagem(estado.tropecos, estado.sustos);
    g.som('buzinaDoBebito');
    carro.pisca('alerta');
    await g.wait(0.5);
    const M = motorista.name;
    const C = carona.name;
    const falas: Array<readonly [string, string]> = estrelas === 3
      ? [[C, 'Chegamos! Viagem perfeita. Nota dez.'], [M, 'Dez? Eu queria um onze.']]
      : estrelas === 2
        ? [[C, 'Chegamos! Com um sustinho ou outro.'], [M, 'Faz parte da aventura.']]
        : [[C, 'Chegamos… inteiros, eu acho.'], [M, 'Quem sofreu foi o carro.']];
    for (const [quem, texto] of falas) await g.say([texto], quem);
    g.toast(`${'⭐'.repeat(estrelas)} · ${estado.coracoes} corações na viagem`, '🚙');
    const viagens = g.bump('bebito:viagens-feitas');
    if (estado.coracoes > g.stat('bebito:recorde-de-coracoes')) g.bump('bebito:recorde-de-coracoes', estado.coracoes - g.stat('bebito:recorde-de-coracoes'));
    if (viagens === 1 && !novaRota) {
      g.unlock({
        id: 'primeira-viagem',
        title: 'A primeira viagem',
        place: 'Na estrada',
        note: 'A primeira vez que a gente saiu de casa de Bebito Mobile. Teve bicho na faixa de pedestres, lombada, poça e um ônibus devagar na frente — e a roda gigante aparecendo lá no fim da rua. Paramos na nossa vaga, a do coração, no estacionamento em frente ao ponto.',
        icon: '🚙',
      });
    }
    g.setFlag(FLAG_DO_CARRO_NO_PARQUE, destino === 'parque');
    g.setFlag(FLAG_DO_CARRO_NO_CLUBE, destino === 'clube');
    g.setFlag(FLAG_DO_CARRO_NA_ESCOLA, destino === 'escola');
    g.setFlag('bebito:viagem-em-andamento', false);
    if (paraClube) {
      agendarChegadaNoClube(pedido.motorista);
      g.unlock({ id: 'de-bebito-ao-clube', title: 'De Bebito ao clube', place: 'Clube', icon: '🏊', note: 'De Bebito pela alameda até a nossa vaga no estacionamento do clube. Mais um lugar para visitar juntos, saindo direto de onde estivermos.' });
    }
    if (ida) agendarChegadaNoParque(pedido.motorista);
    if (paraEscola) {
      agendarChegadaNaEscola(pedido.motorista);
      g.unlock({ id: 'de-bebito-a-escola', title: 'De Bebito à escola', place: 'Escola do Gatito', icon: '🏫', note: 'De Bebito pela zona escolar até a nossa vaga do coração, do outro lado da rua da escola. No caminho, a turma do Gatito inteira na pista.' });
    }
    g.painelDaViagem(null);
    g.botaoDaViagem(null);
    camDentro.cortar();
    estado.piloto = false;
    g.poseNoCarro('jogador', null);
    g.poseNoCarro('parceiro', null);
    g.setCameraOmbro(null);
    g.lockPlayer(false);
    const CHEGADA: Record<DestinoDeCarro, [string, string]> = {
      clube: ['clube', 'do-estacionamento'], parque: ['villa-lobos', 'do-carro'], casa: ['frente-da-casa', 'do-carro'], escola: ['escola-patio', 'do-estacionamento'],
    };
    g.goTo(...CHEGADA[destino]);
  };
}

/** `{ x, z }` de um ponto do mundo (as plantas de lote pedem assim) */
function xz(p: THREE.Vector3): { x: number; z: number } {
  return { x: p.x, z: p.z };
}
