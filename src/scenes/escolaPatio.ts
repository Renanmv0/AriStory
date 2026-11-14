import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { cloud, meioFio } from '../world/props';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';
import { fundir } from '../world/fundir';
import { PREDIO_DA_ESCOLA, predioDaEscola } from '../world/escolaPorFora';
import { ESCOLA } from './escolaComum';

/**
 * ============================================= A ESCOLA DO GATITO — O PÁTIO DA FRENTE
 *
 * O lado de fora da escola, da foto que o Renan mandou: "uma escola chique
 * dos Estados Unidos, uma de filme mesmo, com alguns bancos, algumas partes
 * com grama, outras não". O prédio de tijolinho (a rotunda com a cúpula e as
 * duas alas, `world/escolaPorFora.ts`) no fundo, o calçadão de concreto até a
 * rua, os gramados dos dois lados com os canteiros, os bancos bordô e os
 * três mastros. É daqui que, depois, sai o estacionamento da escola e a rota
 * de carro Clube ↔ Escola (`docs/ESCOLA-PATIO.md`).
 *
 * A PLANTA (a câmera vem do `+X/+Z`; o prédio, que é alto, fica no `−Z`):
 *
 *   −Z  ┌───── ala esquerda ─────┐ ( rotunda ) ┌───── ala direita ─────┐
 *       │ canteiro               ╲  portal  ╱               canteiro │
 *       │   gramado    mastro    ┌──────────┐    mastro    gramado    │
 *       │══════ calçada que atravessa (os bancos) ══════════════════ │
 *       │   gramado              │ mastro do │              gramado   │
 *       │            árvore      │   meio    │      árvore            │
 *       │                        │ calçadão  │                        │
 *   +Z  └═════════════ a calçada da rua ═════════════════════════════┘
 *       ═══════════════════════ a rua ═══════════════════════════════
 *
 * POR ENQUANTO ela é uma cena à parte (`?cena=escola-patio`): o ônibus e a
 * porta da rua do saguão continuam como sempre até o Renan aprovar o pátio.
 */

/** o prédio no mundo: o meio da rotunda */
const PREDIO = { x: 0, z: -20 };
const PORTA = { x: 0, z: PREDIO.z + PREDIO_DA_ESCOLA.portal.frente };
const CALCADA = { z0: 19, z1: 22 };
const RUA = { z0: 22, z1: 30, comprimento: 140 };
/** o calçadão do meio, da porta até a calçada da rua */
const CALCADAO = { meia: 3.4, z0: PORTA.z, z1: CALCADA.z0 };
/** a calçada que atravessa o pátio na frente do prédio, de ponta a ponta */
const TRAVESSA = { z: -6.5, meia: 2.2, x0: -31, x1: 31 };

export const escolaPatio: SceneDef = {
  id: ESCOLA.patio,
  name: 'Escola do Gatito',
  subtitle: 'o pátio da frente',
  ambient: {
    sky: P.skyDay,
    fog: 0xbfe6f7,
    fogNear: 95,
    fogFar: 200,
    sunColor: 0xfff4da,
    sunIntensity: 1.7,
    ambientColor: 0xd8f0ff,
    ambientIntensity: 1.0,
    sunDir: [14, 22, 12],
  },
  spawn: { x: 0, z: CALCADA.z0 - 1.2, facing: Math.PI },
  entries: {
    'da-rua': { x: 0, z: CALCADA.z0 - 1.2, facing: Math.PI },
    'do-saguao': { x: PORTA.x, z: PORTA.z + 1.6, facing: 0 },
  },

  build(w) {
    const g = w.game;

    // ------------------------------------------------------------------ o chão
    w.ground({ width: 150, depth: 110, color: P.grass, textura: tapeteDeGrama(9) });
    w.setBounds(-34, PORTA.z - 1, 34, CALCADA.z1 - 0.3);
    // a calçada da rua e a rua (de ponta a ponta: some nas duas pontas)
    w.patch(0, (CALCADA.z0 + CALCADA.z1) / 2, RUA.comprimento, CALCADA.z1 - CALCADA.z0, P.concrete, 0, 0.014, calcadaDePedrinha());
    w.patch(0, (RUA.z0 + RUA.z1) / 2, RUA.comprimento, RUA.z1 - RUA.z0, P.asphalt, 0, 0.018, asfalto());
    const tracos: THREE.BufferGeometry[] = [];
    for (let x = -RUA.comprimento / 2 + 2; x <= RUA.comprimento / 2 - 2; x += 5) tracos.push(new THREE.PlaneGeometry(2, 0.22).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 2, 0.22, P.metalWhite, 0, 0.022).geometry = mergeGeometries(tracos);
    w.add(w.place(meioFio(RUA.comprimento), 0, 0, RUA.z0, Math.PI / 2));
    // o concreto: a praça na frente do portal, o calçadão e a travessa (placas de 1,5 m)
    const placas = pisoDePlacas(1.5);
    w.patch(0, (PORTA.z - 0.6 + TRAVESSA.z) / 2, 18, TRAVESSA.z - PORTA.z + 0.6, P.concrete, 0, 0.016, placas);
    w.patch(0, (TRAVESSA.z + CALCADAO.z1) / 2, CALCADAO.meia * 2, CALCADAO.z1 - TRAVESSA.z, P.concrete, 0, 0.016, placas);
    w.patch(0, TRAVESSA.z, TRAVESSA.x1 - TRAVESSA.x0, TRAVESSA.meia * 2, P.concrete, 0, 0.016, placas);

    // ---------------------------------------------------------------- o prédio
    w.add(fundir(w.place(predioDaEscola(), PREDIO.x, 0, PREDIO.z)));
    const A = PREDIO_DA_ESCOLA.ala;
    for (const lado of [-1, 1]) {
      w.blockBox(PREDIO.x + lado * (A.x0 + A.x1) / 2, PREDIO.z + (A.z0 + A.z1) / 2, (A.x1 - A.x0) / 2 + 0.25, (A.z1 - A.z0) / 2 + 0.25);
    }
    w.blockCircle(PREDIO.x, PREDIO.z, PREDIO_DA_ESCOLA.apotema + 0.35);
    // o portal: o colisor vai até a frente dele, e a porta fica no fundo do arco
    for (const lado of [-1, 1]) {
      w.blockBox(PORTA.x + lado * (PREDIO_DA_ESCOLA.portal.meia - 0.35), PORTA.z - 0.7, 0.42, 0.75);
    }

    // a porta: por dentro é o saguão (a porta da rua dele fica no mesmo eixo)
    w.door({
      x: PORTA.x, z: PORTA.z + 0.4, radius: 1.6,
      to: ESCOLA.saguao, entry: 'da-rua',
      label: 'Entrar na escola', icon: '🏫',
    });

    // o céu: nuvens bem altas, acima da câmera (a lição da frente da casa)
    for (let i = 0; i < 6; i++) {
      const c = cloud(w.range(1.8, 3));
      c.name = 'nuvem';
      c.position.set(w.range(-60, 60), w.range(56, 64), w.range(-50, 40));
      w.root.add(c);
      const vento = w.range(0.2, 0.5);
      w.onUpdate((dt) => {
        c.position.x += vento * dt;
        if (c.position.x > 62) c.position.x = -62;
      });
    }

    // o enquadramento: o prédio é grande, e a câmera abre um tanto (só no primeiro quadro: antes dele o motor ainda põe o de sempre)
    let primeiro = true;
    w.onUpdate(() => {
      if (!primeiro) return;
      primeiro = false;
      g.setZoom(18);
    });
  },
};
