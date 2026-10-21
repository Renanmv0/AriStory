/**
 * O BANCO DE PRAÇA: ferro fundido e ripa de madeira.
 *
 * O banco antigo (`bench()`, em `props.ts`) era uma tábua, um encosto e dois
 * blocos cinza. Este é o banco clássico de parque:
 *
 * - as cabeceiras de FERRO são tubos que correm por curvas (`TubeGeometry`
 *   numa `CatmullRomCurve3`): a perna da frente que termina numa voluta no
 *   pé, a de trás que sobe e vira o encosto inclinado, o trilho do assento
 *   com a barriguinha e o braço que acaba enrolado na frente — é a curva que
 *   faz ler "ferro fundido", e não a grossura;
 * - um terceiro apoio no meio (sem braço), porque banco de 1,9 m de ripa
 *   cede no meio sem ele;
 * - as ripas de madeira com veio (`veioDeMadeira`, UV em metros) e quina
 *   macia: quatro no assento (a da frente dobrada para baixo, a "cascata"
 *   onde a perna passa), três no encosto inclinado;
 * - a cabeça dos parafusos nas pontas das ripas e a plaquinha de latão no
 *   meio do encosto.
 *
 * AS MEDIDAS DO BANCO ANTIGO FICAM, porque o sentar depende delas: o assento
 * em 0,53 (a ancoragem do `w.banco` desconta a altura do quadril dali), 1,9
 * de comprimento (os dois sentam a ±0,46), o encosto atrás em `-z`, e tudo
 * dentro do colisor de 0,95 × 0,35. Olha para `+Z` (para onde quem senta
 * olha), base em `y = 0`.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { uvEmMetrosPorTriangulo } from './acabamento';
import { veioDeMadeira } from './texturasDeCasa';

/** as alturas que a cena de sentar usa */
export const BANCO_DE_PRACA = { assento: 0.53, comprimento: 1.9 } as const;

const v = (z: number, y: number): THREE.Vector3 => new THREE.Vector3(0, y, z);

/** um tubo de ferro pela curva (`z`, `y`) da cabeceira, no plano `x = 0` */
function barra(pontos: Array<[number, number]>, raio: number, gomos: number): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pontos.map(([z, y]) => v(z, y)), false, 'centripetal');
  return new THREE.TubeGeometry(curva, gomos, raio, 6, false);
}

/** a tampa redonda de uma ponta de barra (o tubo nasce aberto) */
function ponta(z: number, y: number, raio: number): THREE.BufferGeometry {
  return new THREE.SphereGeometry(raio, 6, 4).translate(0, y, z);
}

/**
 * A CABECEIRA de ferro, no plano `x = 0`: as barras numa geometria só (a
 * `fundir()` da cena junta as três cabeceiras do banco depois).
 */
function cabeceira(comBraco: boolean): THREE.BufferGeometry[] {
  const R = 0.024;
  const partes: THREE.BufferGeometry[] = [
    // a perna da frente: a voluta no pé, e sobe até debaixo da ripa da frente
    barra([[0.335, 0.075], [0.345, 0.03], [0.31, 0.012], [0.27, 0.03], [0.255, 0.12], [0.25, 0.3], [0.235, 0.47]], R, 18),
    // a perna de trás, que vira o encosto inclinado para trás
    barra([[-0.33, 0.012], [-0.27, 0.16], [-0.215, 0.42], [-0.225, 0.56], [-0.27, 0.78], [-0.33, 0.97], [-0.36, 1.02]], R, 22),
    // o trilho do assento, com a barriguinha onde se senta
    barra([[-0.23, 0.47], [-0.1, 0.455], [0.08, 0.458], [0.24, 0.475]], R * 0.9, 10),
    // o reforço em arco entre as duas pernas, embaixo
    barra([[-0.29, 0.13], [-0.05, 0.2], [0.18, 0.18], [0.255, 0.13]], R * 0.7, 10),
    ponta(-0.36, 1.02, R),
    // o pé: a sapatinha de cada perna no chão
    new THREE.CylinderGeometry(0.035, 0.04, 0.02, 8).translate(0, 0.01, -0.33),
  ];
  if (comBraco) {
    // o braço: sai do encosto, corre para a frente e enrola na ponta
    partes.push(
      barra([[-0.235, 0.6], [-0.12, 0.67], [0.1, 0.675], [0.25, 0.655], [0.305, 0.61], [0.3, 0.56], [0.262, 0.548], [0.245, 0.575], [0.268, 0.595]], R * 1.05, 26),
      // o pilarzinho que segura o braço na perna da frente
      barra([[0.25, 0.48], [0.255, 0.555]], R * 0.75, 2),
      ponta(0.268, 0.595, R * 1.05),
    );
  }
  return partes.map((g) => (g.index ? g.toNonIndexed() : g));
}

export function bancoDePraca(corMadeira: number = P.wood, corFerro: number = P.bancoFerro): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'banco-de-praca';
  const ferro = toon(corFerro);
  const madeira = toon(corMadeira, { mapa: veioDeMadeira() });
  const latao = toon(P.gold);
  const C = BANCO_DE_PRACA.comprimento;

  // ---------------------------------------------------------- as cabeceiras
  // duas com braço nas pontas e uma sem braço no meio
  for (const [x, braco] of [[-0.86, true], [0, false], [0.86, true]] as const) {
    for (const geo of cabeceira(braco)) {
      const m = new THREE.Mesh(geo, ferro);
      m.position.x = x;
      g.add(m);
    }
  }

  // ------------------------------------------------------------- as ripas
  const ripa = (y: number, z: number, alto: number, fundo: number, giro: number): THREE.Mesh => {
    const geo = uvEmMetrosPorTriangulo(new RoundedBoxGeometry(C - 0.04, alto, fundo, 1, Math.min(alto, fundo) * 0.32));
    const m = new THREE.Mesh(geo, madeira);
    m.position.set(0, y, z);
    m.rotation.x = giro;
    g.add(m);
    return m;
  };
  /*
   * O ASSENTO: o alto das três de trás em 0,53 (o do banco antigo), e a da
   * frente um tico mais baixa e girada para a frente — a "cascata", que é
   * por onde a perna de quem senta dobra e balança.
   */
  const ESPESSURA = 0.045;
  for (const z of [-0.175, -0.05, 0.075]) ripa(BANCO_DE_PRACA.assento - ESPESSURA / 2, z, ESPESSURA, 0.11, 0);
  ripa(BANCO_DE_PRACA.assento - ESPESSURA / 2 - 0.012, 0.2, ESPESSURA, 0.11, 0.32);
  /*
   * O ENCOSTO: três ripas deitadas na inclinação da perna de trás. O `z` da
   * lista é o do miolo do ferro naquela altura; a ripa senta 4 cm à frente
   * dele (o raio do tubo mais meia ripa, menos o encaixe).
   */
  const encosto: Array<[number, number]> = [[0.64, -0.241], [0.78, -0.27], [0.92, -0.314]];
  const NA_FRENTE = 0.04;
  for (const [y, z] of encosto) ripa(y, z + NA_FRENTE, 0.105, 0.04, -0.28);

  // ----------------------------------------------- os parafusos e a plaquinha
  const cabeca = new THREE.CylinderGeometry(0.012, 0.012, 0.01, 6);
  for (const x of [-0.86, 0, 0.86]) {
    // no assento, por cima de cada ripa onde ela passa sobre a cabeceira
    for (const z of [-0.175, -0.05, 0.075]) {
      const p = new THREE.Mesh(cabeca, ferro);
      p.position.set(x, BANCO_DE_PRACA.assento + 0.003, z);
      g.add(p);
    }
    // no encosto, na frente de cada ripa
    for (const [y, z] of encosto) {
      const p = new THREE.Mesh(cabeca, ferro);
      p.rotation.x = Math.PI / 2 - 0.28;
      p.position.set(x, y, z + NA_FRENTE + 0.022);
      g.add(p);
    }
  }
  // a plaquinha de latão no meio da ripa do meio do encosto
  const [yP, zP] = encosto[1];
  const plaquinha = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.055, 0.008, 1, 0.003), latao);
  plaquinha.rotation.x = -0.28;
  plaquinha.position.set(0.42, yP, zP + NA_FRENTE + 0.025);
  g.add(plaquinha);

  return g;
}
