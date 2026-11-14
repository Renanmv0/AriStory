import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { cloud, lamp, meioFio, tree } from '../world/props';
import { Vento } from '../core/shaders';
import { toon } from '../core/materials';
import { cascaDePinus, hortensias, margaridas, type MoitaDeMargaridas, type PeDePlanta } from '../world/plantasDeJardim';
import {
  MastroComBandeira, arbustosAparados, bicicletario, placaDaEscola, plaquinhaNoPoste, type PeDeArbusto,
} from '../world/patioDaEscola';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';
import { fundir, fundirComoFundo } from '../world/fundir';
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
/** a pracinha redonda do mastro do meio, no calçadão (o eixo da porta dá a volta nela) */
const PRACINHA = { x: 0, z: 4, raio: 5.6, ilha: 1.7 };
/** os mastros do lado, nos gramados da frente das alas */
const MASTROS_DO_LADO = [{ x: -12.5, z: -11.6 }, { x: 12.5, z: -11.6 }];
const PLACA = { x: -10.5, z: 15.2 };

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
    // (o limite do fundo é a frente das alas: os colisores do prédio e dos canteiros é que param a dupla —
    // com o limite na linha da porta, sobrava uma parede invisível no meio do gramado da frente de cada ala)
    w.setBounds(-34, PREDIO.z + PREDIO_DA_ESCOLA.ala.z1 - 0.3, 34, CALCADA.z1 - 0.3);
    // a calçada da rua e a rua (de ponta a ponta: some nas duas pontas)
    w.patch(0, (CALCADA.z0 + CALCADA.z1) / 2, RUA.comprimento, CALCADA.z1 - CALCADA.z0, P.concrete, 0, 0.014, calcadaDePedrinha());
    w.patch(0, (RUA.z0 + RUA.z1) / 2, RUA.comprimento, RUA.z1 - RUA.z0, P.asphalt, 0, 0.018, asfalto());
    const tracos: THREE.BufferGeometry[] = [];
    for (let x = -RUA.comprimento / 2 + 2; x <= RUA.comprimento / 2 - 2; x += 5) if (Math.abs(x) > 5) tracos.push(new THREE.PlaneGeometry(2, 0.22).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 2, 0.22, P.metalWhite, 0, 0.022).geometry = mergeGeometries(tracos);
    w.add(w.place(meioFio(RUA.comprimento), 0, 0, RUA.z0, Math.PI / 2));
    // o concreto: a praça na frente do portal, o calçadão e a travessa (placas de 1,5 m)
    const placas = pisoDePlacas(1.5);
    w.patch(0, (PORTA.z - 0.6 + TRAVESSA.z) / 2, 18, TRAVESSA.z - PORTA.z + 0.6, P.concrete, 0, 0.016, placas);
    w.patch(0, (TRAVESSA.z + CALCADAO.z1) / 2, CALCADAO.meia * 2, CALCADAO.z1 - TRAVESSA.z, P.concrete, 0, 0.016, placas);
    w.patch(0, TRAVESSA.z, TRAVESSA.x1 - TRAVESSA.x0, TRAVESSA.meia * 2, P.concrete, 0, 0.016, placas);
    w.disc(PRACINHA.x, PRACINHA.z, PRACINHA.raio, P.concrete, 0.016, placas);
    // a faixa de pedestres na frente do calçadão
    const zebra: THREE.BufferGeometry[] = [];
    for (let x = -3; x <= 3.01; x += 0.75) zebra.push(new THREE.PlaneGeometry(0.42, RUA.z1 - RUA.z0 - 1.2).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 1, 1, P.metalWhite, 0, 0.024).geometry = mergeGeometries(zebra);

    // ---------------------------------------------------------------- o prédio
    w.add(fundir(w.place(predioDaEscola(), PREDIO.x, 0, PREDIO.z)));
    const A = PREDIO_DA_ESCOLA.ala;
    for (const lado of [-1, 1]) {
      w.blockBox(PREDIO.x + lado * (A.x0 + A.x1) / 2, PREDIO.z + (A.z0 + A.z1) / 2, (A.x1 - A.x0) / 2 + 0.25, (A.z1 - A.z0) / 2 + 0.25);
    }
    // a rotunda é um OCTÓGONO: um círculo deixava as quinas do plinto de fora. Uma caixa por face
    // (do lado de dentro até 40 cm fora da parede: o puxador da porta avança até ali), e o giro do colisor tem o sinal contrário ao do rotation.y
    const FACE = 2 * PREDIO_DA_ESCOLA.raio * Math.sin(Math.PI / 8);
    for (let k = 0; k < 8; k++) {
      const ang = (k * Math.PI) / 4;
      const meio = PREDIO_DA_ESCOLA.apotema - 0.5;
      w.blockBox(PREDIO.x + Math.sin(ang) * meio, PREDIO.z + Math.cos(ang) * meio, FACE / 2 + 0.25, 0.9, -ang);
    }
    w.blockCircle(PREDIO.x, PREDIO.z, PREDIO_DA_ESCOLA.apotema - 0.6);
    // o portal: o colisor vai até a frente dele, e a porta fica no fundo do arco
    for (const lado of [-1, 1]) {
      // (do vão do arco até a quina, e do fundo até o plinto, que avança 12 cm da frente)
      w.blockBox(PORTA.x + lado * 2.19, PORTA.z - 0.635, 0.46, 0.815);
    }

    // a porta: por dentro é o saguão (a porta da rua dele fica no mesmo eixo)
    w.door({
      x: PORTA.x, z: PORTA.z + 0.4, radius: 1.6,
      to: ESCOLA.saguao, entry: 'da-rua',
      label: 'Entrar na escola', icon: '🏫',
    });

    // ------------------------------------------------------------- os canteiros
    /*
     * OS CANTEIROS: a casca de pinus com uma guia baixa de concreto, e os
     * arbustos aparados (bola e almofada) e as hortênsias em cima. Os do pé
     * das alas correm a fachada inteira; os dos mastros são redondos; e o da
     * ilha do mastro do meio fecha a pracinha. Tudo de enfeite parado vai
     * para dois grupos de FUNDO (um de cada lado), e as plantas viram lotes.
     */
    const vento = new Vento({ forca: 0.08, altura: 0.5 });
    w.onUpdate((dt) => vento.tique(dt));
    const casca = cascaDePinus();
    const guia = toon(P.escolaPedraSombra);
    const arbustos: PeDeArbusto[] = [];
    const flores: PeDePlanta[] = [];
    const moitas: MoitaDeMargaridas[] = [];
    const fundos = [new THREE.Group(), new THREE.Group()];
    const fundoDe = (x: number): THREE.Group => fundos[x < 0 ? 0 : 1];
    const canteiro = (x: number, z: number, largura: number, fundo: number): void => {
      w.patch(x, z, largura, fundo, P.cascaDePinus, 0, 0.017, casca);
      // a guia: quatro réguas baixas em volta (as do comprido passam por cima das pontas: nenhuma face no plano da outra)
      const f = fundoDe(x);
      for (const s of [-1, 1]) {
        const comp = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.24, 0.1, 0.12), guia);
        comp.position.set(x, 0.05, z + s * (fundo / 2 + 0.06));
        f.add(comp);
        const ponta = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, fundo), guia);
        ponta.position.set(x + s * (largura / 2 + 0.06), 0.045, z);
        f.add(ponta);
      }
    };
    const canteiroRedondo = (x: number, z: number, raio: number): void => {
      w.disc(x, z, raio, P.cascaDePinus, 0.017, casca);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(raio + 0.04, 0.07, 6, 40), guia);
      aro.rotation.x = Math.PI / 2;
      aro.scale.z = 0.7;
      aro.position.set(x, 0.03, z);
      fundoDe(x).add(aro);
    };
    // o pé das alas: a faixa inteira, com bola, almofada e hortênsia se revezando
    for (const lado of [-1, 1]) {
      const x0 = 8.4;
      const x1 = 32.6;
      const zc = PREDIO.z + A.z1 + 0.95;
      canteiro(lado * (x0 + x1) / 2, zc, x1 - x0, 1.5);
      w.blockBox(lado * (x0 + x1) / 2, zc, (x1 - x0) / 2, 0.75);
      for (let x = x0 + 0.8, i = 0; x < x1 - 0.5; x += 1.55, i++) {
        if (i % 3 === 1) flores.push({ x: lado * x, z: zc + 0.1, escala: 0.95, semente: i + (lado > 0 ? 50 : 0) });
        else arbustos.push({ x: lado * x, z: zc, escala: i % 3 === 0 ? 1.15 : 1.0, semente: i * 3 + lado, forma: i % 3 === 0 ? 'bola' : 'almofada' });
      }
      // o canteiro da quina, entre a rotunda e a ala, e o pé da face diagonal
      canteiro(lado * 6.1, PREDIO.z + A.z1 + 1.6, 4.6, 2.8);
      w.blockBox(lado * 6.1, PREDIO.z + A.z1 + 1.6, 2.3, 1.4);
      arbustos.push({ x: lado * 7.3, z: PREDIO.z + A.z1 + 1.2, escala: 1.5, semente: 90 + lado, forma: 'bola' });
      arbustos.push({ x: lado * 5.4, z: PREDIO.z + A.z1 + 2.4, escala: 1.1, semente: 95 + lado, forma: 'almofada' });
      flores.push({ x: lado * 4.4, z: PREDIO.z + A.z1 + 1.9, escala: 1.1, semente: 70 + lado });
      // o canteiro redondo do mastro do lado
      const m = MASTROS_DO_LADO[lado < 0 ? 0 : 1];
      canteiroRedondo(m.x, m.z, 1.7);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.4;
        if (k % 2) arbustos.push({ x: m.x + Math.sin(a) * 1.15, z: m.z + Math.cos(a) * 1.15, escala: 0.75, semente: 200 + k + lado, forma: 'bola' });
        else flores.push({ x: m.x + Math.sin(a) * 1.15, z: m.z + Math.cos(a) * 1.15, escala: 0.7, semente: 210 + k + lado });
      }
    }
    // a ilha do mastro do meio
    canteiroRedondo(PRACINHA.x, PRACINHA.z, PRACINHA.ilha);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      if (k % 2) flores.push({ x: PRACINHA.x + Math.sin(a) * 1.2, z: PRACINHA.z + Math.cos(a) * 1.2, escala: 0.7, semente: 300 + k });
      else arbustos.push({ x: PRACINHA.x + Math.sin(a) * 1.2, z: PRACINHA.z + Math.cos(a) * 1.2, escala: 0.7, semente: 310 + k, forma: 'almofada' });
    }
    w.blockCircle(PRACINHA.x, PRACINHA.z, PRACINHA.ilha + 0.1);
    // o canteiro da placa da entrada, e as margaridas soltas nos gramados
    canteiro(PLACA.x, PLACA.z + 0.2, 6.6, 2.0);
    for (const dx of [-2.75, -1.0, 1.0, 2.75]) flores.push({ x: PLACA.x + dx, z: PLACA.z + 0.85, escala: 0.62, semente: 400 + dx * 10 });
    // (as margaridas só no canteiro da placa: a grama da foto é limpa, e moita solta no gramado lia como mato)
    moitas.push({ x: PLACA.x - 1.9, z: PLACA.z + 0.75, raio: 0.5, quantas: 9, semente: 7, cores: [P.margaridaBranca, P.escolaArmarioAmarelo] });
    moitas.push({ x: PLACA.x + 1.9, z: PLACA.z + 0.75, raio: 0.5, quantas: 9, semente: 8, cores: [P.margaridaBranca, P.escolaArmarioAmarelo] });
    w.add(arbustosAparados(arbustos));
    w.add(hortensias(flores));
    w.add(margaridas(moitas, vento));

    // --------------------------------------------------------------- os mastros
    // o dos Gatitos no meio (o mais alto), e o do Brasil e o da Venezuela dos lados
    const mastros = [
      new MastroComBandeira('gatitos', 10.5, 2.6, 0),
      new MastroComBandeira('brasil', 8.6, 2.1, 1.3),
      new MastroComBandeira('venezuela', 8.6, 2.1, 2.7),
    ];
    w.add(w.place(mastros[0].group, PRACINHA.x, 0, PRACINHA.z));
    w.add(w.place(mastros[1].group, MASTROS_DO_LADO[0].x, 0, MASTROS_DO_LADO[0].z));
    w.add(w.place(mastros[2].group, MASTROS_DO_LADO[1].x, 0, MASTROS_DO_LADO[1].z));
    for (const m of MASTROS_DO_LADO) w.blockCircle(m.x, m.z, 1.8);
    w.onUpdate((dt) => { for (const m of mastros) m.update(dt); });

    // -------------------------------------------------- os bancos, os postes, a placa
    // os bancos bordô da foto, dos dois lados da travessa, olhando para ela
    for (const x of [-24, -16, 16, 24]) {
      w.banco(x, TRAVESSA.z - TRAVESSA.meia - 0.55, 0, P.escolaBanco, 'praca', P.escolaBancoFerro);
      w.banco(x, TRAVESSA.z + TRAVESSA.meia + 0.55, Math.PI, P.escolaBanco, 'praca', P.escolaBancoFerro);
    }
    // e dois na beira do calçadão, perto da rua, olhando para o mastro
    for (const lado of [-1, 1]) w.banco(lado * (CALCADAO.meia + 0.6), 11.5, -lado * Math.PI / 2, P.escolaBanco, 'praca', P.escolaBancoFerro);
    // os postes: no calçadão e nas pontas da travessa
    for (const [x, z] of [[-4.1, -2], [4.1, -2], [-4.1, 16.5], [4.1, 16.5], [-10, -9.3], [10, -9.3], [-30, -9.3], [30, -9.3]] as const) {
      w.add(w.place(lamp(), x, 0, z));
      w.blockCircle(x, z, 0.28);
    }
    w.add(fundir(w.place(placaDaEscola(), PLACA.x, 0, PLACA.z)));
    w.blockBox(PLACA.x, PLACA.z, 3.05, 0.5);
    // as plaquinhas no poste (as da foto, na beira do caminho)
    const aviso = w.add(w.place(plaquinhaNoPoste(['DEVAGAR', 'GATITOS', 'ATRAVESSANDO'], 'pata'), 4.5, 0, CALCADA.z0 - 0.4));
    fundir(aviso);
    const visita = w.add(w.place(plaquinhaNoPoste(['VISITANTES:', 'PASSEM NA', 'SECRETARIA'], undefined), -9.6, 0, TRAVESSA.z - TRAVESSA.meia - 0.5));
    fundir(visita);
    for (const [x, z] of [[4.5, CALCADA.z0 - 0.4], [-9.6, TRAVESSA.z - TRAVESSA.meia - 0.5]] as const) w.blockCircle(x, z, 0.15);
    // o bicicletário, numa laje de concreto ao lado do calçadão
    w.patch(9.2, 13.4, 5.2, 1.8, P.concrete, 0, 0.016, placas);
    w.add(fundir(w.place(bicicletario(6), 9.2, 0, 13.4)));
    w.blockBox(9.2, 13.4, 1.95, 0.2);
    // (sem a plaquinha "BICICLETAS": placa que só diz o que o lugar é o Renan tirou do jogo inteiro)

    // ---------------------------------------------------------------- as árvores
    // grandes, nos gramados das pontas (e nunca entre a câmera e o caminho)
    for (const [x, z, tipo, tam] of [
      [-28, -1, 'redonda', 1.7], [28, 1, 'redonda', 1.8], [-17, 8.5, 'redonda', 1.5], [18, 8, 'redonda', 1.6],
      [-29, 13, 'pinheiro', 1.5], [29, 14, 'redonda', 1.5], [-9.5, -15.6, 'florida', 0.85], [9.5, -15.6, 'florida', 0.85],
    ] as const) {
      fundoDe(x).add(w.place(tree(tipo, tam, w.rng()), x, 0, z, w.range(0, 6.28)));
      w.blockCircle(x, z, 0.5);
    }
    for (const f of fundos) w.add(fundirComoFundo(f));

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
