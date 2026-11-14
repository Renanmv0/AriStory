import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';
import type { Cancela } from '../../world/estacionamento';
import { ritmoDoPresente } from './presente';

/** Só a viagem agenda a cena. Recarregar o parque encontra o carro já estacionado. */
let motoristaDaChegada: string | null = null;
export function agendarChegadaNoParque(motorista: string): void { motoristaDaChegada = motorista; }
export function consumirChegadaNoParque(): string | null {
  const motorista = motoristaDaChegada;
  motoristaDaChegada = null;
  return motorista;
}

export interface ComandoDaCancela {
  cancela: Cancela;
  /** null devolve o comando à aproximação de quem está a pé */
  comandar: (aberta: boolean | null) => void;
}

const V = THREE.Vector3;
const suave = (t: number): number => t * t * (3 - 2 * t);
const ponto = (x: number, z: number): THREE.Vector3 => new V(x, 0, z);
/** O centro do carro cruza a entrada reto; só vira depois que a traseira passou a cancela. */
export const CAMINHO_DA_CHEGADA = [
  new THREE.CubicBezierCurve3(ponto(41.5, -21), ponto(41.5, -12), ponto(41.5, -10.4), ponto(45.1, -10.4)),
  new THREE.CubicBezierCurve3(ponto(45.1, -10.4), ponto(49, -10.4), ponto(51, -10.4), ponto(53, -10.4)),
  new THREE.CubicBezierCurve3(ponto(53, -10.4), ponto(56.5, -10.4), ponto(56.5, -8), ponto(56.5, -5.5)),
  new THREE.LineCurve3(ponto(56.5, -5.5), ponto(56.5, 2.2)),
  new THREE.CubicBezierCurve3(ponto(56.5, 2.2), ponto(56.5, 5.5), ponto(54.4, 5.5), ponto(51.9, 5.5)),
];

/** A cancela, a curva até a vaga e a descida; tudo no relógio da cena. */
export function animarChegadaNoParque(w: WorldBuilder, p: {
  carro: BebitoMobile;
  motorista: string;
  entrada: ComandoDaCancela;
  descida: { x: number; z: number; facing: number };
  aoEstacionar: () => void;
  /** Outro estacionamento pode reutilizar a entrada, as poses e a descida. */
  trajeto?: THREE.Curve<THREE.Vector3>[];
  apresentacao?: number;
  duracoes?: readonly number[];
  tomada?: (posicao: THREE.Vector3, fase: string, trecho: number, emPe: boolean) => { de: THREE.Vector3; para: THREE.Vector3 };
  /** onde o parceiro desce e espera, a partir da descida (o de sempre: 1,3 m para o +X, e espera 2 m para o −X) */
  parceiro?: { solto: readonly [number, number]; espera: readonly [number, number] };
}): void {
  const g = w.game;
  const { carro, entrada } = p;
  const estado = { fase: p.apresentacao ? 'apresentando' : 'aproximando', trecho: 0, progresso: 0, motorista: p.motorista };
  carro.group.userData.chegada = estado;
  let iniciou = false;
  let tempo = 0;
  const caminho = p.trajeto ?? CAMINHO_DA_CHEGADA;
  let anterior = caminho[0].getPoint(0);
  const olho = new V();
  const mira = new V();
  let cameraPosta = false;
  let cameraFinal: { de: THREE.Vector3; para: THREE.Vector3 } | null = null;
  const duracoes = p.duracoes ?? [4.5, 3.4, 2.8, 3.4, 3.6];
  const jogadorDirige = g.playerId() === p.motorista;
  carro.group.position.copy(anterior);
  carro.group.rotation.y = 0;
  entrada.comandar(false);

  const pular = document.createElement('button');
  pular.type = 'button'; pular.className = 'pular-estacionamento';
  pular.textContent = 'Pular'; pular.setAttribute('aria-label', 'Pular animação de estacionar');
  pular.hidden = true; document.body.append(pular);
  w.aoDesmontar(() => pular.remove());
  let desceram = false;
  const descer = (): void => {
    if (desceram) return;
    desceram = true;
    g.poseNoCarro('jogador', null); g.poseNoCarro('parceiro', null);
    g.releasePlayer(p.descida.x, p.descida.z, p.descida.facing);
    const parceiro = p.parceiro ?? { solto: [1.3, 0], espera: [-2, 0] };
    g.releaseCompanion(p.descida.x + parceiro.solto[0], p.descida.z + parceiro.solto[1], p.descida.facing);
    g.lockPlayer(true);
    g.holdCompanion(p.descida.x + parceiro.espera[0], p.descida.z + parceiro.espera[1]);
    g.mostrarCabeca('jogador', true); g.mostrarCabeca('parceiro', true);
    carro.abrirPorta(false); carro.frear(false); carro.pisca(null);
    p.aoEstacionar();
  };
  const concluir = (): void => {
    estado.fase = 'concluida';
    entrada.comandar(null);
    g.setCameraOmbro(null); g.freeCompanion(); g.lockPlayer(false);
    pular.remove();
  };
  pular.addEventListener('pointerdown', e => e.stopPropagation());
  pular.addEventListener('click', e => {
    e.stopPropagation();
    if (!iniciou || estado.fase === 'concluida') return;
    const curva = caminho[caminho.length - 1], tangente = curva.getTangentAt(1);
    carro.group.position.copy(curva.getPointAt(1));
    carro.group.rotation.y = Math.atan2(tangente.x, tangente.z);
    estado.trecho = caminho.length - 1; estado.progresso = 1;
    carro.andando(0); carro.estercar(0);
    descer(); carro.abrirPorta(false, true);
    concluir();
  });

  const filmar = (dt: number): void => {
    const emPe = window.innerWidth / window.innerHeight < 0.8;
    const tomada = p.tomada?.(carro.group.position, estado.fase, estado.trecho, emPe);
    const alvo = tomada?.para ?? carro.group.position.clone().add(new V(0, 0.7, 0));
    const de = tomada?.de ?? alvo.clone().add(new V(7.8, 7.4, 9.2).multiplyScalar(emPe ? 1.5 : 1));
    if (!cameraPosta) { olho.copy(de); mira.copy(alvo); cameraPosta = true; }
    olho.lerp(de, 1 - Math.exp(-3 * dt));
    mira.lerp(alvo, 1 - Math.exp(-3 * dt));
    g.setCameraOmbro(olho, mira);
  };

  w.onUpdate((quadro) => {
    if (estado.fase === 'concluida') return;
    const dt = quadro * ritmoDoPresente.vezes;
    if (!iniciou) {
      iniciou = true;
      g.lockPlayer(true);
      g.ridePlayer(jogadorDirige ? carro.assentos.motorista : carro.assentos.passageiro, new V(0, -0.47, 0), 1, 0);
      g.rideCompanion(jogadorDirige ? carro.assentos.passageiro : carro.assentos.motorista, new V(0, -0.47, 0), 1, 0);
      g.poseNoCarro('jogador', jogadorDirige ? 'dirigindo' : 'passageiro');
      g.poseNoCarro('parceiro', jogadorDirige ? 'passageiro' : 'dirigindo');
      carro.pisca('direita');
      pular.hidden = false;
    }
    tempo += dt;
    if (estado.fase === 'apresentando') {
      carro.andando(0); carro.frear(true);
      if (tempo >= p.apresentacao!) { estado.fase = 'aproximando'; tempo = 0; carro.frear(false); }
      filmar(dt);
      return;
    }
    if (estado.fase === 'abrindo') {
      entrada.comandar(true);
      if (entrada.cancela.abertura >= 0.99 && tempo >= 1.4) {
        estado.fase = 'entrando'; estado.trecho = 1; tempo = 0;
        carro.frear(false);
      }
    } else if (estado.fase === 'estacionado') {
      if (tempo >= 0.8) {
        carro.abrirPorta(true);
        g.som('portaDoBebito');
        estado.fase = 'descendo'; tempo = 0;
      }
    } else if (estado.fase === 'descendo') {
      if (tempo >= 1.1 && carro.portaAberta >= 0.99) {
        descer();
        g.som('portaDoBebito');
        estado.fase = 'devolvendo'; tempo = 0;
        cameraFinal = { de: olho.clone(), para: mira.clone() };
      }
    } else if (estado.fase === 'devolvendo') {
      const k = suave(Math.min(1, tempo / 1.4));
      const alvo = new V(p.descida.x, 0.8, p.descida.z);
      const giro = g.anguloDaCamera();
      const de = alvo.clone().add(new V(Math.sin(giro) * 10.5, 7.1, Math.cos(giro) * 10.5));
      g.setCameraOmbro(cameraFinal!.de.clone().lerp(de, k), cameraFinal!.para.clone().lerp(alvo, k));
      if (k >= 1 && carro.portaAberta === 0) {
        concluir();
      }
      return;
    } else {
      const curva = caminho[estado.trecho];
      const t = Math.min(1, tempo / duracoes[estado.trecho]);
      const k = estado.trecho === 0 || estado.trecho === 4 ? suave(t) : t;
      const posicao = curva.getPointAt(k);
      const tangente = curva.getTangentAt(k);
      const giro = Math.atan2(tangente.x, tangente.z);
      const mudanca = Math.atan2(Math.sin(giro - carro.group.rotation.y), Math.cos(giro - carro.group.rotation.y));
      carro.estercar(THREE.MathUtils.clamp(mudanca / Math.max(dt, 0.001) * 0.6, -0.55, 0.55));
      g.poseNoCarro(jogadorDirige ? 'jogador' : 'parceiro', 'dirigindo', mudanca * 4);
      carro.rodar(posicao.distanceTo(anterior));
      carro.andando(0.25);
      carro.group.position.copy(posicao); carro.group.rotation.y = giro;
      anterior.copy(posicao);
      estado.progresso = k;
      if (t >= 1) {
        tempo = 0;
        if (estado.trecho === 0) {
          estado.fase = 'abrindo'; carro.frear(true); carro.andando(0);
        } else if (estado.trecho === 4) {
          estado.fase = 'estacionado'; carro.frear(true); carro.andando(0); carro.estercar(0);
        } else {
          if (estado.trecho === 1) entrada.comandar(false);
          estado.trecho++;
          estado.fase = estado.trecho >= 3 ? 'estacionando' : 'entrando';
          carro.pisca(estado.trecho >= 3 ? 'esquerda' : 'direita');
        }
      }
    }
    filmar(dt);
  });
}
