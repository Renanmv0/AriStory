import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import { BebitoMobile, BEBITO_MOBILE } from '../../world/bebitoMobile/BebitoMobile';
import { PLANTA_DO_ESTACIONAMENTO } from '../../world/estacionamentoDaEscola';
import { fundir } from '../../world/fundir';
import { animarChegadaNoParque, type ComandoDaCancela } from './chegadaNoParque';
import { escolherDestinoDeCarro } from './partida';
import { ritmoDoPresente, temBebitoMobile } from './presente';
import { localDoBebito } from '../BebitoMobile';

/**
 * ===================================================== O BEBITO MOBILE NA ESCOLA
 *
 * A chegada de carro na Escola do Gatito (`docs/VIAGEM-ESCOLA.md`): o carro
 * mora na VAGA DO CORAÇÃO do estacionamento do outro lado da rua do pátio
 * (`scenes/escolaPatio.ts`), e a viagem que termina aqui faz a CHEGADA
 * ANIMADA — o mesmo motor do parque e do clube (`chegadaNoParque.ts`), com o
 * caminho e as tomadas daqui:
 *
 *   a faixa da rua do lado do lote (o carro vem do −X) → a curva à direita na
 *   pista de entrada → espera a cancela → sobe até o corredor → a curva à
 *   direita → o corredor → a curva à direita para dentro da vaga, de nariz
 *   para a rua.
 *
 * A dupla desce na vaga vazia do lado da câmera (a do lado do motorista
 * ficava atrás do carro), e dali é a passagem de pedestres pintada e a rua
 * até o portão da escola.
 */

let motoristaDaChegada: string | null = null;
export function agendarChegadaNaEscola(motorista: string): void { motoristaDaChegada = motorista; }
export function consumirChegadaNaEscola(): string | null {
  const motorista = motoristaDaChegada;
  motoristaDaChegada = null;
  return motorista;
}

const { entrada: ENTRADA, corredor: CORREDOR, vagaDoCoracao: VAGA, descida: DESCIDA, lote: LOTE } = PLANTA_DO_ESTACIONAMENTO;
const MEIO_DA_ENTRADA = (ENTRADA.x0 + ENTRADA.x1) / 2;
/** a faixa da rua do lado do lote (a rua vai de 22 a 30; a faixa de lá é a de 26 a 30) */
const FAIXA_DE_LA = 27.9;
/** onde o nariz para antes da cancela: ela fica a 40 cm da boca do lote */
const ANTES_DA_CANCELA = LOTE.z0 + 0.4 - BEBITO_MOBILE.comprimento / 2 - 0.55;

const v = (x: number, z: number): THREE.Vector3 => new THREE.Vector3(x, 0, z);
/** o caminho do carro: o primeiro trecho termina na cancela (é ali que o motor espera ela abrir) */
export const CAMINHO_DA_CHEGADA_NA_ESCOLA = [
  new THREE.CubicBezierCurve3(v(-26, FAIXA_DE_LA), v(6, FAIXA_DE_LA), v(MEIO_DA_ENTRADA, FAIXA_DE_LA), v(MEIO_DA_ENTRADA, ANTES_DA_CANCELA)),
  new THREE.LineCurve3(v(MEIO_DA_ENTRADA, ANTES_DA_CANCELA), v(MEIO_DA_ENTRADA, CORREDOR - 3.5)),
  new THREE.CubicBezierCurve3(v(MEIO_DA_ENTRADA, CORREDOR - 3.5), v(MEIO_DA_ENTRADA, CORREDOR), v(MEIO_DA_ENTRADA - 1.9, CORREDOR), v(MEIO_DA_ENTRADA - 4.9, CORREDOR)),
  new THREE.LineCurve3(v(MEIO_DA_ENTRADA - 4.9, CORREDOR), v(VAGA.x + 5.4, CORREDOR)),
  new THREE.CubicBezierCurve3(v(VAGA.x + 5.4, CORREDOR), v(VAGA.x, CORREDOR), v(VAGA.x, CORREDOR - 2.1), v(VAGA.x, VAGA.z)),
];

/** A cancela e a descida são as do motor do parque; aqui ficam as tomadas e o caminho da escola. */
function animarChegadaNaEscola(w: WorldBuilder, p: Omit<Parameters<typeof animarChegadaNoParque>[1], 'trajeto' | 'tomada' | 'duracoes' | 'apresentacao'>): void {
  animarChegadaNoParque(w, {
    ...p,
    apresentacao: 2.2,
    duracoes: [6.2, 3.4, 3.4, 2.4, 4.6],
    trajeto: CAMINHO_DA_CHEGADA_NA_ESCOLA,
    tomada: (posicao, fase, trecho, emPe) => {
      if (fase === 'apresentando') {
        // a apresentação: o lote inteiro, com a cancela e a vaga do coração, e o carro chegando pela rua
        const para = new THREE.Vector3(6, 0.9, 36);
        return { para, de: para.clone().add(new THREE.Vector3(14, 15, 17).multiplyScalar(emPe ? 2.4 : 1)) };
      }
      if (trecho >= 3) {
        // o carro e a vaga na mesma imagem: a curva não some atrás dele
        const para = posicao.clone().lerp(new THREE.Vector3(VAGA.x, 0, VAGA.z), 0.4);
        para.y = 0.8;
        return { para, de: para.clone().add(new THREE.Vector3(8, 8.5, 10).multiplyScalar(emPe ? 1.6 : 1)) };
      }
      if (fase === 'abrindo') {
        // esperando a cancela: a câmera vai para o lado, e o braço subindo fica NA FRENTE do nariz, sem cruzar o carro
        const para = posicao.clone().add(new THREE.Vector3(0, 0.9, 1.2));
        return { para, de: para.clone().add(new THREE.Vector3(9, 6.2, 3).multiplyScalar(emPe ? 1.5 : 1)) };
      }
      // a perseguição vem do lado do lote (o +Z): a câmera não olha pelo meio dos carros parados
      const para = posicao.clone().add(new THREE.Vector3(0, 0.7, 0));
      return { para, de: para.clone().add(new THREE.Vector3(6.5, 7.6, 10).multiplyScalar(emPe ? 1.5 : 1)) };
    },
  });
}

/**
 * O CARRO NA ESCOLA: com o Bebito Mobile no save e estacionado aqui, ele mora
 * na vaga do coração, com o "Viajar de Bebito Mobile" na porta do motorista;
 * se a viagem acabou de chegar, a chegada animada roda. Como no clube, o
 * ponto de ônibus vira lembrete (o carro não fica esquecido na escola).
 */
export function montarBebitoNaEscola(w: WorldBuilder, entrada: ComandoDaCancela, onibus: Interactable): void {
  const g = w.game;
  if (!temBebitoMobile(g) || localDoBebito(g) !== 'escola') return;
  const carro = new BebitoMobile(g.fichaDoBebitoMobile());
  w.add(fundir(w.place(carro.group, VAGA.x, 0, VAGA.z, VAGA.giro)));
  w.onUpdate((dt) => carro.update(dt * ritmoDoPresente.vezes));
  // (de nariz para a rua, ao longo do z: o comprimento vai no `hd`)
  w.blockBox(VAGA.x, VAGA.z, BEBITO_MOBILE.largura / 2 - 0.08, BEBITO_MOBILE.comprimento / 2 - 0.1);
  const viajar = w.interact({
    id: 'escola:bebito-mobile',
    x: DESCIDA.x, z: DESCIDA.z, radius: 1.9,
    label: 'Viajar de Bebito Mobile', icon: '🚙',
    highlight: carro.group,
    priority: 2,
    onInteract: async () => { await escolherDestinoDeCarro(g, 'escola'); },
  });
  const motorista = consumirChegadaNaEscola();
  if (motorista) {
    viajar.enabled = false;
    // (o parceiro desce do lado, ainda na vaga vazia: nem dentro do carro, nem na vaga dos outros)
    animarChegadaNaEscola(w, { carro, motorista, entrada, descida: DESCIDA, parceiro: { solto: [1.2, -0.4], espera: [1.1, -0.6] }, aoEstacionar: () => { viajar.enabled = true; } });
  }
  onibus.enabled = false;
  w.interact({
    id: 'escola:buscar-carro', x: onibus.x, z: onibus.z, radius: 2.4,
    label: 'Pegar o ônibus', icon: '🚌',
    onInteract: async () => { await g.say(['A gente veio de Bebito. Ele está na nossa vaga, no estacionamento do outro lado da rua.'], g.companionName()); },
  });
}
