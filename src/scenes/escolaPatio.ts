import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { busStop, cloud, lamp, meioFio, sebe, tree } from '../world/props';
import { OnibusDaCidade } from '../world/onibusDaCidade';
import { Vento } from '../core/shaders';
import { toon } from '../core/materials';
import { cascaDePinus, hortensias, margaridas, type MoitaDeMargaridas, type PeDePlanta } from '../world/plantasDeJardim';
import {
  MastroComBandeira, arbustosAparados, bicicletario, placaDaEscola, plaquinhaNoPoste, type PeDeArbusto,
} from '../world/patioDaEscola';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';
import { fundir, fundirComoFundo } from '../world/fundir';
import { BeiraDoCaminho, caixaRedonda, capsula, disco, mancha, uniaoSuave, type Caixa } from '../world/caminhos';
import { PORTAO_DA_ESCOLA, GUARITA_DA_ESCOLA, balizadores, gradeDaEscola, guaritaDaEscola, portaoDaEscola } from '../world/portariaDaEscola';
import {
  PLANTA_DO_ESTACIONAMENTO, batentesDeRoda, geoSeta, ilhaDoEstacionamento, posteDoEstacionamento, simboloDeAcessivel,
} from '../world/estacionamentoDaEscola';
import { CARRO_ESTACIONADO, Cancela, carroEstacionado, geoCoracaoNoChao, placaDeEstacionamento, plaquinhaDaVaga } from '../world/estacionamento';
import { sorteio } from '../world/texturasDeChao';
import { montarBebitoNaEscola } from '../eventos/bebitoMobile/naEscola';
import { ritmoDoPresente } from '../eventos/bebitoMobile/presente';
import type { ComandoDaCancela } from '../eventos/bebitoMobile/chegadaNoParque';
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
 *       ╪══ grade ══╪══ grade ══╡ PORTÃO ╞ guarita ╪══ grade ══╪══ grade ══╪
 *   +Z  ══════════════════════ a calçada da rua ════════════════════════════
 *       ═══════════════════════ a rua ═══ (faixa) ═══════════════════════════
 *       ════════════════════ a calçada de lá · a sebe ══════════════════════
 *       │ ESTACIONAMENTO: fila 1 · corredor · fila 2 (ilhas, postes, cancela) │
 *
 * DESDE 2026-11-14 o ônibus do parque e do clube para AQUI, na rua da
 * portaria (o ponto à esquerda do portão), e a porta da rua do saguão sai no
 * pátio. O "Pegar o ônibus" do ponto leva de volta ao parque ou ao clube.
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
/** a linha da grade da frente (a face da rua da mureta), e a guarita ao lado do portão */
const GRADE_Z = 18.55;
const GUARITA = { x: 7.7, z: 17.9 };
/** a calçada de lá, o estacionamento, as filas e a pista de entrada: a planta do kit (a chegada do carro lê a mesma) */
const { calcadaDeLa: CALCADA_DE_LA, lote: LOTE, fila1: FILA_1, fila2: FILA_2, vaga: VAGA, entrada: ENTRADA } = PLANTA_DO_ESTACIONAMENTO;
/*
 * O PONTO DO ÔNIBUS, na faixa da calçada da escola, à esquerda do portão: o
 * ônibus vai para o −X (o nariz no −X, as portas no −Z, para a calçada). A
 * câmera vem do +X/+Z, do lado da rua: quem desce ATRÁS do ônibus some atrás
 * dele (o parque é assim). Por isso a dupla desce na frente do NARIZ, e o
 * abrigo fica do lado de lá dela.
 */
const ONIBUS = { x: -13, z: RUA.z0 + 0.3 + 1.28 };
const DESCIDA = { x: ONIBUS.x - 4.5 - 1.6, z: CALCADA.z0 + 1.55 };

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
    // descendo do Bebito Mobile, na vaga do coração do estacionamento de lá
    'do-estacionamento': { x: PLANTA_DO_ESTACIONAMENTO.descida.x, z: PLANTA_DO_ESTACIONAMENTO.descida.z, facing: PLANTA_DO_ESTACIONAMENTO.descida.facing },
    // descendo do ônibus, na calçada, olhando para o portão
    'do-onibus': { x: DESCIDA.x, z: DESCIDA.z, facing: Math.atan2(-DESCIDA.x, GRADE_Z - DESCIDA.z) },
  },

  build(w) {
    const g = w.game;

    // ------------------------------------------------------------------ o chão
    // (o chão vai bem além do estacionamento: visto de cima, a cena não pode acabar atrás dele)
    w.ground({ width: 170, depth: 170, z: 10, color: P.grass, textura: tapeteDeGrama(9) });
    // (o limite do fundo é a frente das alas: os colisores do prédio e dos canteiros é que param a dupla —
    // com o limite na linha da porta, sobrava uma parede invisível no meio do gramado da frente de cada ala)
    w.setBounds(-34, PREDIO.z + PREDIO_DA_ESCOLA.ala.z1 - 0.3, 34, LOTE.z1 + 2.2);
    // a calçada da rua e a rua (de ponta a ponta: some nas duas pontas)
    w.patch(0, (CALCADA.z0 + CALCADA.z1) / 2, RUA.comprimento, CALCADA.z1 - CALCADA.z0, P.concrete, 0, 0.014, calcadaDePedrinha());
    w.patch(0, (RUA.z0 + RUA.z1) / 2, RUA.comprimento, RUA.z1 - RUA.z0, P.asphalt, 0, 0.018, asfalto());
    const tracos: THREE.BufferGeometry[] = [];
    for (let x = -RUA.comprimento / 2 + 2; x <= RUA.comprimento / 2 - 2; x += 5) if (Math.abs(x) > 5) tracos.push(new THREE.PlaneGeometry(2, 0.22).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 2, 0.22, P.metalWhite, 0, 0.022).geometry = mergeGeometries(tracos);
    w.add(w.place(meioFio(RUA.comprimento), 0, 0, RUA.z0, Math.PI / 2));
    // a calçada de lá, a guia do outro lado da rua (com a boca da entrada do estacionamento) e a rampa da entrada
    w.patch(0, (CALCADA_DE_LA.z0 + CALCADA_DE_LA.z1) / 2, RUA.comprimento, CALCADA_DE_LA.z1 - CALCADA_DE_LA.z0, P.concrete, 0, 0.014, calcadaDePedrinha());
    for (const [x0, x1] of [[-RUA.comprimento / 2, ENTRADA.x0 - 0.3], [ENTRADA.x1 + 0.3, RUA.comprimento / 2]] as const) {
      w.add(w.place(meioFio(x1 - x0), (x0 + x1) / 2, 0, RUA.z1, Math.PI / 2));
    }
    /*
     * O CONCRETO DO PÁTIO É UMA CONTA (`world/caminhos.ts`): a praça do portal, o
     * calçadão, a travessa de pontas redondas, a pracinha do mastro, a laje do
     * bicicletário e o caminhozinho da guarita, numa UNIÃO SUAVE — as junções saem
     * com a quina arredondada, sem o "T" de régua. Em volta dele corre a GUIA DE
     * GRANITO (a mesma conta, 16 cm para fora, em blocos de 60 cm) e, na beira da
     * grama, os tufos e as pedrinhas (`BeiraDoCaminho`). É a junção da pedra com a
     * grama que o Renan pediu com mais detalhe.
     */
    const PAVIMENTO = uniaoSuave(0.9,
      caixaRedonda(0, (PORTA.z - 0.6 + TRAVESSA.z) / 2, 9, (TRAVESSA.z - PORTA.z + 0.6) / 2, 0.4),
      caixaRedonda(0, (TRAVESSA.z + CALCADA.z0) / 2, CALCADAO.meia, (CALCADA.z0 - TRAVESSA.z) / 2, 0.05),
      caixaRedonda(0, TRAVESSA.z, (TRAVESSA.x1 - TRAVESSA.x0) / 2, TRAVESSA.meia, TRAVESSA.meia),
      disco(PRACINHA.x, PRACINHA.z, PRACINHA.raio),
      capsula(CALCADAO.meia, 15.6, GUARITA.x - 1.25, GUARITA.z - 1.3, 0.62),
    );
    const LAJE_DA_BICI = caixaRedonda(9.2, 13.4, 2.6, 0.9, 0.3);
    const CAIXA_DO_PATIO: Caixa = { x0: -33, z0: PORTA.z - 1.2, x1: 33, z1: CALCADA.z0 + 0.4 };
    const pintarCom = (decal: THREE.Mesh, geo: THREE.BufferGeometry): void => {
      decal.geometry.dispose();
      decal.geometry = geo;
    };
    const placas = pisoDePlacas(1.5);
    const granito = pisoDePlacas(0.6);
    const comGuia = (x: number, z: number): number => Math.min(PAVIMENTO(x, z), LAJE_DA_BICI(x, z)) - 0.16;
    pintarCom(w.patch(0, 0, 1, 1, P.escolaGranito, 0, 0.015, granito), mancha(comGuia, CAIXA_DO_PATIO, 0.2));
    pintarCom(w.patch(0, 0, 1, 1, P.concrete, 0, 0.016, placas), mancha((x, z) => Math.min(PAVIMENTO(x, z), LAJE_DA_BICI(x, z)), CAIXA_DO_PATIO, 0.2));
    // a faixa de pedestres na frente do calçadão
    const zebra: THREE.BufferGeometry[] = [];
    for (let x = -3; x <= 3.01; x += 0.75) zebra.push(new THREE.PlaneGeometry(0.42, RUA.z1 - RUA.z0 - 1.2).translate(x, 0, 0));
    w.patch(0, (RUA.z0 + RUA.z1) / 2, 1, 1, P.metalWhite, 0, 0.024).geometry = mergeGeometries(zebra);
    // a soleira de granito do portão
    w.patch(0, GRADE_Z, PORTAO_DA_ESCOLA.meiaVao * 2 + 0.1, 0.8, P.escolaGranito, 0, 0.025, granito);

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
    const aviso = w.add(w.place(plaquinhaNoPoste(['DEVAGAR', 'GATITOS', 'ATRAVESSANDO'], 'pata'), 4.9, 0, CALCADA.z1 - 0.45));
    fundir(aviso);
    const visita = w.add(w.place(plaquinhaNoPoste(['VISITANTES:', 'PASSEM NA', 'SECRETARIA'], undefined), -9.6, 0, TRAVESSA.z - TRAVESSA.meia - 0.5));
    fundir(visita);
    for (const [x, z] of [[4.9, CALCADA.z1 - 0.45], [-9.6, TRAVESSA.z - TRAVESSA.meia - 0.5]] as const) w.blockCircle(x, z, 0.15);
    // o bicicletário, na laje de concreto ao lado do calçadão (a laje é do pavimento, lá em cima)
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

    // --------------------------------------------- a beira do concreto e os balizadores
    // (fora dos canteiros, do prédio, da grade e da guarita: ali o chão já tem dono)
    const livre = (x: number, z: number): boolean => {
      if (z < PREDIO.z + A.z1 + 3.1 && Math.abs(x) > 7.8) return false; // os canteiros do pé das alas
      if (Math.hypot(x - PREDIO.x, z - PREDIO.z) < PREDIO_DA_ESCOLA.raio + 0.9) return false;
      if (Math.abs(Math.abs(x) - 6.1) < 2.5 && Math.abs(z - (PREDIO.z + A.z1 + 1.6)) < 1.6) return false;
      if (MASTROS_DO_LADO.some((m) => Math.hypot(x - m.x, z - m.z) < 2.0)) return false;
      if (Math.abs(x - PLACA.x) < 3.6 && Math.abs(z - PLACA.z - 0.2) < 1.3) return false;
      if (z > GRADE_Z - 0.6) return false;
      if (Math.hypot(x - GUARITA.x, z - GUARITA.z) < GUARITA_DA_ESCOLA.raio + 0.5) return false;
      return true;
    };
    // (duas passadas, com sementes diferentes: uma só deixava a beira rala)
    for (const semente of [2211, 2297]) w.add(new BeiraDoCaminho(comGuia, CAIXA_DO_PATIO, vento, livre, semente).grupo);
    // os balizadores de luz: em volta da pracinha (fora da boca do calçadão) e na beira da travessa, entre os bancos
    const pontosDeLuz: Array<[number, number]> = [];
    for (const graus of [-28, 0, 28, 152, 180, 208]) {
      const a = (graus * Math.PI) / 180;
      pontosDeLuz.push([PRACINHA.x + Math.cos(a) * (PRACINHA.raio + 0.45), PRACINHA.z + Math.sin(a) * (PRACINHA.raio + 0.45)]);
    }
    for (const x of [12, 20, 28]) {
      for (const lado of [-1, 1]) {
        for (const z of [TRAVESSA.z - TRAVESSA.meia - 0.45, TRAVESSA.z + TRAVESSA.meia + 0.45]) pontosDeLuz.push([lado * x, z]);
      }
    }
    for (const z of [12.9, 14.6]) for (const lado of [-1, 1]) pontosDeLuz.push([lado * (CALCADAO.meia + 0.45), z]);
    w.add(balizadores(pontosDeLuz));
    for (const [x, z] of pontosDeLuz) w.blockCircle(x, z, 0.14);

    // -------------------------------------------------------------- a portaria
    /*
     * A PORTARIA (`world/portariaDaEscola.ts`): o portão de ferro batido no eixo
     * do calçadão (as folhas abertas para dentro, na beira dele), a grade de
     * lanças com a mureta de tijolo de ponta a ponta, e a guarita octogonal do
     * lado direito, com o guichê virado para o portão. A grade fecha o pátio: a
     * rua só se alcança pelo portão.
     */
    const { meiaVao: MV, pilar: PL, folha: FOLHA } = PORTAO_DA_ESCOLA;
    w.add(fundir(w.place(portaoDaEscola(), 0, 0, GRADE_Z)));
    for (const lado of [-1, 1]) {
      w.blockBox(lado * (MV + PL / 2), GRADE_Z, PL / 2 + 0.1, PL / 2 + 0.1);
      // a folha aberta, encostada na beira do calçadão
      // (aberta 92°, a ponta da folha passa 10 cm para fora da dobradiça)
      w.blockBox(lado * (MV + 0.05), GRADE_Z - FOLHA / 2 - 0.05, 0.13, FOLHA / 2 + 0.08);
    }
    const guarita = w.add(fundir(w.place(guaritaDaEscola(), GUARITA.x, 0, GUARITA.z)));
    void guarita;
    // (até a ponta do balcão do guichê, que avança 40 cm da parede)
    w.blockCircle(GUARITA.x, GUARITA.z, GUARITA_DA_ESCOLA.raio + 0.35);
    // a grade: da ponta esquerda ao portão, do portão à guarita, e da guarita à ponta direita
    const apGuarita = GUARITA_DA_ESCOLA.raio * Math.cos(Math.PI / 8);
    for (const [x0, x1] of [[-34, -(MV + PL)], [MV + PL, GUARITA.x - apGuarita + 0.08], [GUARITA.x + apGuarita - 0.08, 34]] as const) {
      w.add(fundir(w.place(gradeDaEscola(x1 - x0), x0, 0, GRADE_Z)));
      w.blockBox((x0 + x1) / 2, GRADE_Z, (x1 - x0) / 2, 0.32);
    }

    // ---------------------------------------------------------- o ponto do ônibus
    const onibus = w.add(fundir(w.place(new OnibusDaCidade({ destino: 'Parque' }).group, ONIBUS.x, 0, ONIBUS.z, Math.PI)));
    w.blockBox(ONIBUS.x, ONIBUS.z, 4.5, 1.35);
    // o abrigo, com a boca para a rua, do lado de lá de onde a dupla desce
    w.add(fundir(w.place(busStop(), DESCIDA.x - 3.6, 0, CALCADA.z0 + 1.3)));
    w.blockBox(DESCIDA.x - 3.6, CALCADA.z0 + 0.65, 2.35, 0.3);
    // o mesmo "Pegar o ônibus" do parque e do clube: daqui ele volta para um dos dois
    const pegarOOnibus = w.interact({
      id: 'door:villa-lobos:clube',
      x: DESCIDA.x + 0.6, z: DESCIDA.z + 0.4, radius: 2.4,
      label: 'Pegar o ônibus', icon: '🚌',
      highlight: onibus,
      onInteract: async (api) => {
        const destino = await api.ask('Pra onde a gente vai?', ['Parque', 'Clube', 'Ficar na escola']);
        if (destino === 0) api.goTo('villa-lobos', 'clube');
        else if (destino === 1) api.goTo('clube', 'portaria');
      },
    });

    let entradaDoLote: ComandoDaCancela | null = null;
    // ---------------------------------------------------------- o estacionamento
    /*
     * O ESTACIONAMENTO, do outro lado da rua (`world/estacionamentoDaEscola.ts`):
     * o asfalto com a guia de concreto em volta e a boca da entrada, duas filas de
     * vagas de 2,6 × 5,2 com o corredor no meio, a pista de entrada com a
     * cancela, as ilhas de grama nas pontas e no meio com os postes altos (e as
     * bandeirolas dos Gatitos), a sebe baixa do lado da calçada, a passagem de
     * pedestres pintada no eixo do portão, as duas vagas de cadeira de rodas, a
     * VAGA DO CORAÇÃO do Bebito Mobile (para quando o carro chegar aqui) e os
     * carros dos outros.
     */
    const CENTRO_DO_LOTE = { x: (LOTE.x0 + LOTE.x1) / 2, z: (LOTE.z0 + LOTE.z1) / 2 };
    const ASFALTO = uniaoSuave(0.8,
      caixaRedonda(CENTRO_DO_LOTE.x, CENTRO_DO_LOTE.z, (LOTE.x1 - LOTE.x0) / 2, (LOTE.z1 - LOTE.z0) / 2, 1.6),
      caixaRedonda((ENTRADA.x0 + ENTRADA.x1) / 2, (CALCADA_DE_LA.z0 + LOTE.z0) / 2 + 0.6, (ENTRADA.x1 - ENTRADA.x0) / 2, (LOTE.z0 - CALCADA_DE_LA.z0) / 2 + 0.6, 0.1),
    );
    const CAIXA_DO_LOTE: Caixa = { x0: LOTE.x0 - 1.5, z0: CALCADA_DE_LA.z0 - 0.2, x1: LOTE.x1 + 1.5, z1: LOTE.z1 + 1.5 };
    pintarCom(w.patch(0, 0, 1, 1, P.concrete, 0, 0.02, granito), mancha((x, z) => ASFALTO(x, z) - 0.22, CAIXA_DO_LOTE, 0.2));
    pintarCom(w.patch(0, 0, 1, 1, P.asphalt, 0, 0.021, asfalto()), mancha(ASFALTO, CAIXA_DO_LOTE, 0.2));
    // a pintura: os riscos das vagas, as setas e a passagem de pedestres, num decalque só
    const risco = (x0: number, z0: number, x1: number, z1: number): THREE.BufferGeometry =>
      new THREE.PlaneGeometry(Math.abs(x1 - x0), Math.abs(z1 - z0)).translate((x0 + x1) / 2, -(z0 + z1) / 2, 0);
    const riscos: THREE.BufferGeometry[] = [];
    /** as vagas de uma fila: `[x0, x1]` de cada uma, sem o meio (a passagem) nem a pista de entrada */
    const vagas = (semEntrada: boolean): Array<[number, number]> => {
      const lista: Array<[number, number]> = [];
      for (const lado of [-1, 1]) {
        for (let i = 0; i < 10; i++) {
          const a = lado * (1.3 + i * VAGA);
          const b = lado * (1.3 + (i + 1) * VAGA);
          const [x0, x1] = a < b ? [a, b] : [b, a];
          if (semEntrada && x0 > ENTRADA.x0 - 0.05 && x1 < ENTRADA.x1 + 0.05) continue;
          lista.push([x0, x1]);
        }
      }
      return lista;
    };
    const VAGAS_1 = vagas(true);
    const VAGAS_2 = vagas(false);
    for (const [lista, fila, cabeca] of [[VAGAS_1, FILA_1, FILA_1.z0], [VAGAS_2, FILA_2, FILA_2.z1]] as const) {
      for (const [x0, x1] of lista) {
        for (const x of [x0, x1]) riscos.push(risco(x - 0.06, fila.z0, x + 0.06, fila.z1));
        riscos.push(risco(x0 - 0.06, cabeca - 0.06, x1 + 0.06, cabeca + 0.06));
      }
    }
    riscos.push(geoSeta(-9, 43.1, -1), geoSeta(9, 43.1, -1), geoSeta(-21, 43.1, -1), geoSeta(21, 43.1, -1));
    riscos.push(geoSeta(0, 0, 1).rotateZ(Math.PI / 2).translate((ENTRADA.x0 + ENTRADA.x1) / 2, -36.6, 0));
    // a passagem de pedestres: da calçada de lá, pelo meio da fila 1, atravessando o corredor
    for (let z = LOTE.z0 + 0.3; z < FILA_2.z0 - 0.3; z += 0.75) riscos.push(risco(-1.15, z, 1.15, z + 0.42));
    w.patch(0, 0, 1, 1, P.metalWhite, 0, 0.026).geometry = mergeGeometries(riscos.map((r) => (r.index ? r.toNonIndexed() : r)));
    // as vagas de cadeira de rodas (as duas primeiras da esquerda na fila 1) e a vaga do coração (a primeira da direita)
    const acessivel = simboloDeAcessivel();
    for (const xc of [-2.6, -5.2]) {
      w.patch(xc, (FILA_1.z0 + FILA_1.z1) / 2, VAGA - 0.2, FILA_1.z1 - FILA_1.z0 - 0.25, P.vagaAcessivel, 0, 0.025);
      w.patch(xc, FILA_1.z0 + 1.6, 1.4, 1.4, P.metalWhite, 0, 0.027, acessivel);
    }
    const VAGA_DO_CORACAO = PLANTA_DO_ESTACIONAMENTO.vagaDoCoracao;
    const coracao = w.patch(VAGA_DO_CORACAO.x, VAGA_DO_CORACAO.z, 1, 1, P.vagaRosa, 0, 0.027);
    coracao.geometry.dispose();
    coracao.geometry = geoCoracaoNoChao(1.7).rotateX(Math.PI / 2).rotateZ(Math.PI);
    // os batentes de roda: na cabeça de cada vaga
    const batentes: Array<[number, number, number]> = [];
    for (const [x0, x1] of VAGAS_1) batentes.push([(x0 + x1) / 2, FILA_1.z0 + 0.42, 0]);
    for (const [x0, x1] of VAGAS_2) batentes.push([(x0 + x1) / 2, FILA_2.z1 - 0.42, 0]);
    w.add(batentesDeRoda(batentes));

    // as peças paradas do estacionamento: um grupo de fundo de cada lado
    const fundosDoLote = [new THREE.Group(), new THREE.Group()];
    const doLote = (x: number): THREE.Group => fundosDoLote[x < 0 ? 0 : 1];
    // a sebe baixa entre a calçada de lá e o asfalto, com as bocas da passagem e da entrada
    for (const [x0, x1] of [[LOTE.x0 + 0.6, -1.7], [1.7, ENTRADA.x0 - 0.7], [ENTRADA.x1 + 0.7, LOTE.x1 - 0.6]] as const) {
      doLote((x0 + x1) / 2).add(w.place(sebe(x1 - x0, 0.75), (x0 + x1) / 2, 0, CALCADA_DE_LA.z1 + 0.62));
      w.blockBox((x0 + x1) / 2, CALCADA_DE_LA.z1 + 0.62, (x1 - x0) / 2, 0.5);
    }
    // as ilhas: nas pontas das duas filas e no meio da fila 2, com os postes
    const ilhas: Array<[number, number, number, number]> = [
      [LOTE.x0 + 0.85 + 0.05, (FILA_1.z0 + FILA_1.z1) / 2, 1.5, FILA_1.z1 - FILA_1.z0],
      [LOTE.x1 - 0.85 - 0.05, (FILA_1.z0 + FILA_1.z1) / 2, 1.5, FILA_1.z1 - FILA_1.z0],
      [LOTE.x0 + 0.85 + 0.05, (FILA_2.z0 + FILA_2.z1) / 2, 1.5, FILA_2.z1 - FILA_2.z0],
      [LOTE.x1 - 0.85 - 0.05, (FILA_2.z0 + FILA_2.z1) / 2, 1.5, FILA_2.z1 - FILA_2.z0],
      [0, (FILA_2.z0 + FILA_2.z1) / 2, 2.4, FILA_2.z1 - FILA_2.z0],
    ];
    const arbustosDoLote: PeDeArbusto[] = [];
    ilhas.forEach(([x, z, larg, fundo], i) => {
      doLote(x).add(w.place(ilhaDoEstacionamento(larg, fundo), x, 0, z));
      w.blockBox(x, z, larg / 2, fundo / 2);
      w.add(fundir(w.place(posteDoEstacionamento(), x, 0.12, z)));
      for (const dz of [-1.6, 1.6]) arbustosDoLote.push({ x, z: z + dz, escala: 0.7, semente: 500 + i * 3 + dz, forma: 'almofada' });
    });
    // atrás do estacionamento, um gramado com arbustos e duas árvores floridas nas pontas (baixas: o lote fica do lado da câmera)
    for (let x = LOTE.x0 + 2; x <= LOTE.x1 - 2; x += 3.2) arbustosDoLote.push({ x, z: LOTE.z1 + 1.3, escala: 0.95, semente: 600 + x, forma: x % 2 ? 'bola' : 'almofada' });
    w.add(arbustosAparados(arbustosDoLote));
    for (const x of [LOTE.x0 - 1.5, LOTE.x1 + 1.5]) {
      doLote(x).add(w.place(tree('florida', 0.95, w.rng()), x, 0, LOTE.z1 + 0.5));
      w.blockCircle(x, LOTE.z1 + 0.5, 0.5);
    }
    // a placa do "P" na boca da entrada, a cancela e a plaquinha da vaga do Bebito
    doLote(ENTRADA.x0).add(w.place(placaDeEstacionamento(), ENTRADA.x0 - 0.9, 0, CALCADA_DE_LA.z1 + 0.3));
    w.blockCircle(ENTRADA.x0 - 0.9, CALCADA_DE_LA.z1 + 0.3, 0.15);
    const cancela = new Cancela(ENTRADA.x1 - ENTRADA.x0 - 0.35);
    w.add(w.place(cancela.group, ENTRADA.x1 + 0.05, 0, LOTE.z0 + 0.4, Math.PI));
    w.blockBox(ENTRADA.x1 + 0.05, LOTE.z0 + 0.4, 0.22, 0.22);
    // a cancela abre para quem chega perto (a pé), ou quando a chegada do carro manda (`comando`); anda no
    // relógio do presente, que o teste acelera
    let comandoDaCancela: boolean | null = null;
    w.onUpdate((dt) => {
      const perto = [g.playerPosition(), g.companionPosition()].some((p) => Math.abs(p.x - (ENTRADA.x0 + ENTRADA.x1) / 2) < 4 && Math.abs(p.z - LOTE.z0) < 4);
      cancela.update(dt * ritmoDoPresente.vezes, comandoDaCancela ?? perto);
    });
    entradaDoLote = { cancela, comandar: (aberta) => { comandoDaCancela = aberta; } };
    doLote(VAGA_DO_CORACAO.x).add(w.place(plaquinhaDaVaga(), VAGA_DO_CORACAO.x, 0, LOTE.z0 + 0.25));
    w.blockCircle(VAGA_DO_CORACAO.x, LOTE.z0 + 0.25, 0.15);
    // os carros dos outros: sorteados nas vagas livres (nem a do coração, nem as de cadeira de rodas)
    const sorte = sorteio(4242);
    const cores = [P.carroVermelho, P.carroAmarelo, P.carroMenta, P.carroLilas, P.escolaCaixilho, P.escolaFerro];
    // (a vizinha da vaga do coração também fica livre: com um carro ali, a câmera de sempre via o coração pela metade)
    const reservadas = (xc: number, fila: number): boolean => fila === 1 && [2.6, 5.2, -2.6, -5.2].some((r) => Math.abs(xc - r) < 0.1);
    for (const [lista, fila, giro, n] of [[VAGAS_1, 1, Math.PI, 7], [VAGAS_2, 2, 0, 9]] as const) {
      const livres = lista.map(([x0, x1]) => (x0 + x1) / 2).filter((xc) => !reservadas(xc, fila));
      for (let k = 0; k < n && livres.length; k++) {
        const xc = livres.splice(Math.floor(sorte() * livres.length), 1)[0];
        const zc = fila === 1 ? (FILA_1.z0 + FILA_1.z1) / 2 + 0.1 : (FILA_2.z0 + FILA_2.z1) / 2 - 0.1;
        doLote(xc).add(w.place(carroEstacionado(cores[Math.floor(sorte() * cores.length)]), xc, 0, zc, giro));
        w.blockBox(xc, zc, CARRO_ESTACIONADO.largura / 2 + 0.05, CARRO_ESTACIONADO.comprimento / 2 + 0.05);
      }
    }
    // o fundo de lá do estacionamento: uma fileira de árvores LONGE (perto, elas tapariam as vagas — o lote fica do lado da câmera)
    for (let x = -60; x <= 60; x += 7.5) {
      const z = LOTE.z1 + 10 + w.range(0, 5);
      doLote(x).add(w.place(tree(w.pick(['redonda', 'redonda', 'pinheiro', 'florida'] as const), w.range(1.3, 1.8), w.rng()), x + w.range(-1.5, 1.5), 0, z, w.range(0, 6.28)));
    }
    for (const f of fundosDoLote) w.add(fundirComoFundo(f));
    // o Bebito Mobile, se ele estiver aqui (e a chegada animada, se a viagem acabou de chegar)
    if (entradaDoLote) montarBebitoNaEscola(w, entradaDoLote, pegarOOnibus);

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
