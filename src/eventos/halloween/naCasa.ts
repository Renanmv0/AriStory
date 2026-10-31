import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { pocaDeLuz } from '../../world/furniture';
import { fundir } from '../../world/fundir';
import { FilmeDeTerror } from '../../world/halloween/filmeDeTerror';
import { CARTA_DA_ESTELLA, envelopeDeHalloween } from '../../world/halloween/cartaDaEstella';
import { baldeDePipoca } from '../../world/halloween/baldeDePipoca';
import { ARI, RENAN } from '../../characters/cast';
import { FLAG_CARTA_NO_CHAO, avancarFase, eventoLiberado, faseDoHalloween } from './fase';
import { anoitecerEmCasa } from './casaDeNoite';

/*
 * O COMEÇO DO ESPECIAL DE HALLOWEEN, na casa do Ari (`docs/HALLOWEEN.md`,
 * §2.1, a etapa 1).
 *
 * Quem começa é a dupla: o sofá ganha a opção "Assistir um filme de terror".
 * Os dois sentam, a luz da sala apaga, o balde de pipoca aparece entre eles
 * e a TV passa o filme (fofo); umas falas, uns segundos só de filme… e um
 * barulho de papel: a carta da Estella desliza por baixo da porta da rua.
 * Ela fica no chão com o "Pegar a carta" e, lida, leva o evento para a fase
 * `convite`.
 *
 * O EVENTO É UMA CAMADA (§8.3): sem o `?halloween`, este módulo não monta
 * NADA — nem o envelope, nem o balde, nem a luz da TV — e o sofá pergunta o
 * de sempre. A casa só ganha uma chamada para ele.
 */

/** o que a casa empresta para o evento (as âncoras e a TV dela) */
export interface PecasDaCasa {
  /** a âncora da cena do sofá (a rotação mora nela) */
  assento: THREE.Object3D;
  /** para onde a câmera olha com os dois sentados */
  focoSofa: THREE.Object3D;
  /** a malha `tela` da TV */
  tela: THREE.Mesh;
  /** a TV de sempre: o evento devolve a tela para ela no fim */
  ligarTv: (ligada: boolean) => void;
  /** onde a TV está (a luz azulada dela cai no chão à frente) */
  tv: { x: number; z: number };
  /** a porta da rua: o `x` do vão e o `z` da linha da parede */
  porta: { x: number; z: number };
  /** a janela da sala (com o vidro) e a claridade dela no chão: de madrugada, depois da festa, viram noite */
  janelas: readonly THREE.Object3D[];
  claridades: readonly THREE.Object3D[];
  /** onde se para para "Olhar pela janela" (de madrugada, a fala é outra) */
  olharPelaJanela: { x: number; z: number };
}

export interface HalloweenNaCasa {
  /** o sofá oferece o filme de terror agora? */
  temFilme(): boolean;
  /** a cena inteira do filme, até a carta parar no chão */
  assistirFilme(g: GameAPI): Promise<void>;
}

const SEM_EVENTO: HalloweenNaCasa = { temFilme: () => false, assistirFilme: async () => {} };

/**
 * A sala de madrugada, voltando da festa (a etapa 7): a penumbra azul, a
 * janela escura com o luar no chão, o abajur aceso (ele já nasce aceso) — e o
 * "Olhar pela janela", que de dia fala do sol, troca de fala: a de sempre
 * desliga (no primeiro quadro, quando a cena já a criou) e uma de noite entra
 * no mesmo lugar, empurrando os dois para a cama.
 */
function madrugadaNaSala(w: WorldBuilder, pecas: PecasDaCasa): void {
  anoitecerEmCasa(w, pecas);
  let trocou = false;
  w.onUpdate(() => {
    if (trocou) return;
    trocou = true;
    const deDia = w.interactables.find((i) => i.id === 'casa:janela');
    if (deDia) deDia.enabled = false;
  });
  w.interact({
    id: 'halloween:janela-de-noite',
    x: pecas.olharPelaJanela.x, z: pecas.olharPelaJanela.z, radius: 1.5,
    label: 'Olhar pela janela', icon: '🌙',
    onInteract: async (g) => {
      await g.say(['A rua inteira já tá dormindo.', 'E a cama lá do quarto tá chamando a gente também.']);
    },
  });
}

/**
 * Onde a carta para, dentro da sala. LONGE da porta de propósito: a parede
 * alta em volta dela (2,6 m) esconde ~3,9 m de chão atrás dela na câmera de
 * sempre, e a carta é o caminho principal — tem que ser vista sem girar a
 * câmera. Aqui, a 3 m da porta e meio de lado, ela fica à vista.
 */
const PARADA = { recuo: 2.95, desvio: -1.2, giro: Math.PI + 0.5 };
/** a tomada da câmera durante o deslize: de dentro da sala, olhando a porta */
const TOMADA = { de: new THREE.Vector3(1.55, 1.3, 0.85), para: new THREE.Vector3(3.15, 0.1, 3.7) };

export function montarHalloweenNaCasa(w: WorldBuilder, pecas: PecasDaCasa): HalloweenNaCasa {
  if (!eventoLiberado()) return SEM_EVENTO;
  const g0 = w.game;
  // de madrugada, voltando da festa (etapa 7): a sala na penumbra, a janela
  // escura com o luar no chão, e o abajur aceso (ele já nasce aceso)
  if (faseDoHalloween(g0) === 'depois') madrugadaNaSala(w, pecas);
  // o filme, o balde e a carta só existem ANTES da carta lida: depois dela a
  // casa não monta nada do começo do evento (e, no fim, é a casa de sempre)
  if (faseDoHalloween(g0) !== 'antes') return SEM_EVENTO;
  const A = ARI.name;
  const R = RENAN.name;
  const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
    for (const [quem, texto] of falas) await g0.say([texto], quem);
  };

  // ------------------------------------------------------------- as peças
  const filme = new FilmeDeTerror();

  // a carta no chão (ou a caminho dele)
  const envelope = w.add(fundir(envelopeDeHalloween()));
  const parada = new THREE.Vector3(pecas.porta.x + PARADA.desvio, 0.004, pecas.porta.z - PARADA.recuo);
  envelope.position.copy(parada);
  envelope.rotation.y = PARADA.giro;
  const cartaNoChao = (): boolean => faseDoHalloween(g0) === 'antes' && g0.flag(FLAG_CARTA_NO_CHAO);
  envelope.visible = cartaNoChao();

  // o balde de pipoca no sofá, entre os dois
  const balde = w.add(fundir(baldeDePipoca()));
  balde.position.set(pecas.assento.position.x + 0.1, 0.46, pecas.assento.position.z);
  balde.rotation.y = 0.6;
  balde.visible = false;

  // a luz azulada da TV no chão da sala, só com o filme passando
  const luzDaTv = w.add(w.place(pocaDeLuz(1.25, P.luzDaTv, 0.4), pecas.tv.x + 1.2, 0.006, pecas.tv.z));
  luzDaTv.visible = false;

  // ------------------------------------------------------- o relógio dela
  // a luz da sala apagando e voltando, o filme e a carta deslizando: tudo no
  // relógio do jogo (e não no `g.wait`), para chegarem juntos num celular lento
  let escuro = 0;
  let alvoEscuro = 0;
  let assistindo = false;
  let tempoDeFilme = 0;
  let deslize: { t: number; fim: () => void } | null = null;
  const claro = { sky: new THREE.Color(0xefe4d4), amb: new THREE.Color(0xfdf3e3) };
  const noEscuro = { sky: new THREE.Color(0x2b2440), amb: new THREE.Color(0x9ba3dc) };
  const ceu = new THREE.Color();
  const ambiente = new THREE.Color();
  const inicioDoDeslize = new THREE.Vector3(pecas.porta.x + 0.05, 0.004, pecas.porta.z + 0.2);
  const DURACAO_DO_DESLIZE = 2.1;

  w.onUpdate((dt) => {
    if (assistindo) {
      tempoDeFilme += dt;
      filme.update(tempoDeFilme);
    }
    if (escuro !== alvoEscuro) {
      escuro += Math.sign(alvoEscuro - escuro) * Math.min(Math.abs(alvoEscuro - escuro), dt / 1.2);
      if (escuro <= 0) g0.luzDoCeu(null);
      else {
        ceu.copy(claro.sky).lerp(noEscuro.sky, escuro);
        ambiente.copy(claro.amb).lerp(noEscuro.amb, escuro);
        g0.luzDoCeu({
          sky: ceu.getHex(),
          ambientColor: ambiente.getHex(),
          ambientIntensity: 1.4 - 1.0 * escuro,
          sunIntensity: 1.0 - 0.82 * escuro,
        });
      }
    }
    if (deslize) {
      deslize.t += dt;
      // escorrega rápido por baixo da porta e vai parando, girando um pouco
      const k = Math.min(1, deslize.t / DURACAO_DO_DESLIZE);
      const freio = 1 - Math.pow(1 - k, 3);
      envelope.position.lerpVectors(inicioDoDeslize, parada, freio);
      // por cima do capacho ela passa um fio mais alta
      const noCapacho = Math.abs(envelope.position.z - (pecas.porta.z - 1.0)) < 0.42;
      envelope.position.y = noCapacho ? 0.024 : 0.004;
      envelope.rotation.y = PARADA.giro * freio + (1 - freio) * 0.05;
      if (k >= 1) {
        const fim = deslize.fim;
        deslize = null;
        fim();
      }
    }
  });

  // --------------------------------------------------- pegar e ler a carta
  const pegar = w.interact({
    id: 'halloween:carta',
    x: parada.x, z: parada.z, radius: 1.3,
    label: 'Pegar a carta', icon: '✉️',
    highlight: envelope,
    priority: 2,
    onInteract: async (g) => {
      if (!cartaNoChao()) return;
      envelope.visible = false;
      pegar.enabled = false;
      g.som('pegar');
      await g.lerCarta(CARTA_DA_ESTELLA);
      await conversa([
        [R, 'Uma surpresa costurada… isso é a cara da Estella.'],
        [A, 'Então bora pro parque!'],
      ]);
      g.setFlag(FLAG_CARTA_NO_CHAO, false);
      avancarFase(g, 'convite');
      g.unlock({
        id: 'halloween-convite',
        title: 'O convite da Estella',
        place: 'Casa do Ari',
        note: 'Um filme de terror no sofá, e uma carta de Halloween por baixo da porta.',
        icon: '🎃',
      });
    },
  });
  pegar.enabled = cartaNoChao();

  return {
    temFilme: () => faseDoHalloween(g0) === 'antes' && !g0.flag(FLAG_CARTA_NO_CHAO),

    async assistirFilme(g) {
      const { assento, focoSofa } = pecas;
      g.lockPlayer(true);
      g.ridePlayer(assento, new THREE.Vector3(-0.52, 0.02, 0), 1, 0);
      g.rideCompanion(assento, new THREE.Vector3(0.52, 0.02, 0), 1, 0);
      g.setSitting(true);
      balde.visible = true;
      g.focusCamera(focoSofa);
      g.setZoom(7.2);

      // a luz apaga e o filme começa
      alvoEscuro = 1;
      await g.wait(0.6);
      pecas.tela.material = filme.material;
      tempoDeFilme = 0;
      assistindo = true;
      luzDaTv.visible = true;
      g.som('tv');
      await g.wait(1.0);

      await g.say([
        'Luz apagada, pipoca no colo e um filme de terror na TV.',
        'Feliz Halloween, bebito. Esse ano a gente comemora junto.',
      ], A);
      await conversa([[R, 'Junto e embaixo da coberta, que esse filme dá medo.']]);

      // uns segundos só de filme
      await g.wait(3.6);

      // o barulho de papel na porta… e a carta deslizando para dentro
      g.som('folhear');
      await conversa([[A, '…Você ouviu isso?']]);
      envelope.position.copy(inicioDoDeslize);
      envelope.visible = true;
      // a tomada de dentro da sala: a carta entra por baixo da porta e vem
      // escorregando na direção da câmera
      g.setCameraOmbro(TOMADA.de, TOMADA.para);
      await g.wait(0.3);
      await new Promise<void>((chegou) => {
        deslize = { t: 0, fim: chegou };
      });
      g.setFlag(FLAG_CARTA_NO_CHAO);
      await g.wait(0.6);
      g.setCameraOmbro(null);
      await conversa([[R, 'Veio da porta. Tem uma carta no chão.']]);

      // levantam; a sala acende; a TV volta a ser a de sempre (desligada)
      assistindo = false;
      luzDaTv.visible = false;
      pecas.ligarTv(false);
      alvoEscuro = 0;
      g.setSitting(false);
      g.focusCamera(null);
      g.setZoom(10);
      // onde a cena de sempre do sofá solta os dois, virados para a porta
      g.releasePlayer(-1.6, 0.4, Math.PI / 2);
      g.releaseCompanion(-1.6, 1.5, Math.PI / 2);
      g.lockPlayer(false);
      pegar.enabled = true;
    },
  };
}
