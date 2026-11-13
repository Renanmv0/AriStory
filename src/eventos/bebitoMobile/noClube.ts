import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Collider } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import type { ComandoDaCancela } from './chegadaNoParque';
import { ritmoDoPresente, temBebitoMobile } from './presente';
import { localDoBebito } from '../BebitoMobile';
import { BebitoMobile, BEBITO_MOBILE } from '../../world/bebitoMobile/BebitoMobile';
import { consumirChegadaNoClube, animarChegadaNoClube } from './chegadaNoClube';
import { escolherDestinoDeCarro } from './partida';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { fundir, fundirComoFundo } from '../../world/fundir';
import { quina } from '../../world/lojaDeRoupas';
import { asfalto, pisoDePlacas } from '../../world/texturasDeChao';
import { meioFio } from '../../world/props';
import { Cancela, carroEstacionado, geoCoracaoNoChao } from '../../world/estacionamento';
import { CarroDoNoel } from '../../world/carroDoNoel';
import { CarroDaJosefina } from '../../world/carroDaJosefina';
import { MotoDoCapy } from '../../world/motoDoCapy';
import { FoodTruckDoWalter, FOOD_TRUCK } from '../../world/foodTruckDoWalter';
import {
  coberturaDoEstacionamento, jardineiraDoEstacionamento, posteDoEstacionamento, totemDoEstacionamentoDoClube,
} from '../../world/estacionamentoDoClube';

/** A rua fica no +X do lote; o clube está do outro lado dela. */
export const LOTE_DO_CLUBE = { x0: -75, x1: -40.4, z0: -12, z1: 18 } as const;
const FILEIRAS = [-70.2, -58.2, -46.2];
export const CARROS_DOS_PERSONAGENS = [
  { personagem: 'noel', x: -70.2, z: 3, giro: Math.PI / 2 },
  { personagem: 'josefina', x: -46.2, z: -5, giro: -Math.PI / 2 },
  { personagem: 'capy', x: -70.2, z: -5, giro: Math.PI / 2 },
  // o food truck é grande: 5,5 m na vaga de 5,6, com a frente sobre o batente
  { personagem: 'walter', x: -70.2, z: -1, giro: Math.PI / 2 },
] as const;
export const FAIXA_DO_CLUBE = { z: 1.8, largura: 2.4 } as const;
export const ENTRADA_DO_ESTACIONAMENTO_DO_CLUBE = { x: -41.6, z: 12.5, largura: 5.2 } as const;
/** Reservada para a futura viagem; construir o estacionamento não desloca o carro do save. */
export const VAGA_NO_CLUBE = { x: -58.2, z: 3, giro: -Math.PI / 2 } as const;
export const DESCIDA_NO_CLUBE = { x: -57.4, z: 6.3, facing: Math.PI / 2 } as const;

/** Paisagismo e limites usam a mesma planta: nada pode nascer dentro do lote. */
export function naAreaDoEstacionamentoDoClube(x: number, z: number): boolean {
  return x < -37.5 && x > LOTE_DO_CLUBE.x0 - 1 && z > LOTE_DO_CLUBE.z0 - 1 && z < LOTE_DO_CLUBE.z1 + 1;
}

/** Construção já visitável a pé. A rota e o carro neste destino entram depois. */
export function montarEstacionamentoDoClube(w: WorldBuilder, rua: { beira: number; comprimento: number }): ComandoDaCancela {
  const { x0, x1, z0, z1 } = LOTE_DO_CLUBE;
  w.setBounds(x0 + 0.65, w.bounds.minZ, w.bounds.maxX, w.bounds.maxZ);
  const meioX = (x0 + x1) / 2, meioZ = (z0 + z1) / 2;
  const cal = (x1 + rua.beira) / 2;
  w.patch(cal, 0, rua.beira - x1, rua.comprimento, P.clubeEstacionamentoConcreto, 0, 0.02, pisoDePlacas(1));
  w.patch(meioX, meioZ, x1 - x0, z1 - z0, P.clubeEstacionamentoPiso, 0, 0.024, asfalto());
  const entrada = ENTRADA_DO_ESTACIONAMENTO_DO_CLUBE;
  // Rebaixo para o carro e para a faixa de pedestres; o ônibus fica em z=4,5…13,5.
  for (const [a, b] of [[-rua.comprimento / 2, 0.6], [3, entrada.z - entrada.largura / 2], [entrada.z + entrada.largura / 2, rua.comprimento / 2]]) {
    w.add(fundir(w.place(meioFio(b - a), rua.beira, 0, (a + b) / 2)));
  }
  w.patch(cal - 0.2, entrada.z, rua.beira - x1 + 0.4, entrada.largura, P.clubeEstacionamentoPiso, 0, 0.026, asfalto());
  // Faixa calma de pedestres no lote, separada da entrada dos carros.
  w.patch(meioX, 7, x1 - x0 - 0.4, 2.2, P.clubeEstacionamentoConcreto, 0, 0.028, pisoDePlacas(1));
  w.patch(cal, 4.4, 1.7, 5.3, P.clubeEstacionamentoConcreto, 0, 0.029, pisoDePlacas(1));

  const vagas = [-9, -5, -1, 3];
  for (const x of FILEIRAS) {
    w.patch(x, -3, 5.6, 16, P.clubeEstacionamentoConcreto, 0, 0.03, pisoDePlacas(2));
  }
  w.patch(VAGA_NO_CLUBE.x, VAGA_NO_CLUBE.z, 5.45, 3.25, P.carroMenta, 0, 0.032, pisoDePlacas(2));
  w.patch(-46.2, 3, 5.45, 3.25, P.portaoMetal, 0, 0.032);
  // A pintura branca inteira é um desenho: vagas, faixa e setas do corredor.
  const tinta: THREE.BufferGeometry[] = [];
  const ret = (a: number, b: number, l: number, p: number): void => {
    tinta.push(new THREE.PlaneGeometry(l, p).translate(a, -b, 0).toNonIndexed());
  };
  for (const x of FILEIRAS) {
    for (const z of [-11, -7, -3, 1, 5]) ret(x, z, 5.6, 0.12);
    ret(x + (x === -46.2 ? 2.75 : -2.75), -3, 0.1, 16);
  }
  for (let x = rua.beira + 0.15; x < -28.8; x += 0.95) ret(x + 0.25, FAIXA_DO_CLUBE.z, 0.5, FAIXA_DO_CLUBE.largura);
  for (const x of [-64.2, -52.2]) for (const z of [-7, 0, 12.5]) {
    // Seta para o fundo do corredor (-Z); pintura no quadro XY do decalque.
    const forma = new THREE.Shape();
    forma.moveTo(-0.15, -0.8); forma.lineTo(0.15, -0.8); forma.lineTo(0.15, 0.2);
    forma.lineTo(0.55, 0.2); forma.lineTo(0, 0.85); forma.lineTo(-0.55, 0.2); forma.lineTo(-0.15, 0.2); forma.closePath();
    tinta.push(new THREE.ShapeGeometry(forma).translate(x, -z, 0).toNonIndexed());
  }
  const pintura = w.patch(0, 0, 1, 1, P.metalWhite, 0, 0.034);
  pintura.geometry.dispose(); pintura.geometry = mergeGeometries(tinta);
  for (const geo of tinta) geo.dispose();
  const coracao = w.patch(VAGA_NO_CLUBE.x, VAGA_NO_CLUBE.z, 1, 1, P.vagaRosa, 0, 0.035);
  coracao.geometry.dispose(); coracao.geometry = geoCoracaoNoChao(1.25).rotateX(Math.PI / 2);
  // Símbolo de acessibilidade pintado: uma única textura procedural.
  const acessivel = document.createElement('canvas'); acessivel.width = acessivel.height = 128;
  const ctx = acessivel.getContext('2d');
  if (ctx) {
    ctx.fillStyle = `#${P.portaoMetal.toString(16)}`; ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = ctx.fillStyle = `#${P.metalWhite.toString(16)}`; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(66, 22, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(63, 39); ctx.lineTo(63, 70); ctx.lineTo(89, 70); ctx.lineTo(103, 99); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(65, 45); ctx.lineTo(86, 45); ctx.stroke();
    ctx.beginPath(); ctx.arc(49, 80, 27, -0.4, Math.PI * 1.5); ctx.stroke();
  }
  const mapa = new THREE.CanvasTexture(acessivel); mapa.colorSpace = THREE.SRGBColorSpace;
  const simbolo = w.patch(-46.2, 3, 1.45, 1.45, P.metalWhite, 0, 0.036);
  simbolo.material = toon(P.metalWhite, { mapa, decal: true });

  const fundo = new THREE.Group(); fundo.userData.peca = 'estacionamento-do-clube';
  const por = (o: THREE.Object3D, x: number, z: number, giro = 0): void => { o.position.set(x, 0, z); o.rotation.y = giro; fundo.add(o); };
  // Peças novas mantêm a etiqueta para a inspeção de geometria antes da fundição.
  const peca = (o: THREE.Object3D, x: number, z: number, giro = 0): void => { w.add(fundir(w.place(o, x, 0, z, giro))); };
  const mureta = (x: number, z: number, l: number, p: number): void => {
    const m = new THREE.Mesh(quina(l, 0.38, p, 0.06), toon(P.clubeEstacionamentoConcreto));
    m.position.set(x, 0.19, z); fundo.add(m); w.blockBox(x, z, l / 2, p / 2);
  };
  mureta(x0 - 0.15, meioZ, 0.3, z1 - z0 + 0.8);
  for (const z of [z0 - 0.25, z1 + 0.25]) mureta(meioX, z, x1 - x0 + 0.3, 0.3);
  for (const [a, b] of [[z0, 5.8], [8.2, 9.7], [15.3, z1]]) mureta(x1 - 0.15, (a + b) / 2, 0.3, b - a);
  // Batentes baixos: não invadem os seis metros livres de corredor.
  const batente = quina(0.22, 0.13, 1.65, 0.035);
  for (const x of [-67.7, -55.7, -48.7]) for (const z of vagas) {
    const bx = x === -55.7 && z === VAGA_NO_CLUBE.z ? -60.6 : x;
    const m = new THREE.Mesh(batente, toon(P.clubeEstacionamentoMetal)); m.position.set(bx, 0.065, z); fundo.add(m);
    w.blockBox(bx, z, 0.11, 0.825);
  }
  for (const [x, z, giro, cor] of [
    [-58.2, -9, Math.PI / 2, P.carroLilas], [-58.2, -1, Math.PI / 2, P.carroAmarelo],
    [-46.2, -9, -Math.PI / 2, P.carroMenta], [-70.2, -9, Math.PI / 2, P.metalWhite],
  ]) { por(carroEstacionado(cor), x, z, giro); w.blockBox(x, z, 2.2, 1); }
  // Os donos já estão no clube: carros vazios, sem duplicar os personagens.
  const carros = CARROS_DOS_PERSONAGENS.filter(vaga => w.game.temMemoria(`${vaga.personagem}-na-estrada`));
  for (const vaga of carros) {
    const carro = vaga.personagem === 'noel' ? new CarroDoNoel(true) : vaga.personagem === 'capy' ? new MotoDoCapy(true)
      : vaga.personagem === 'walter' ? new FoodTruckDoWalter(true) : new CarroDaJosefina(true);
    w.add(fundirComoFundo(w.place(carro.group, vaga.x, 0, vaga.z, vaga.giro)));
    if (vaga.personagem === 'walter') w.blockBox(vaga.x, vaga.z, FOOD_TRUCK.frente, FOOD_TRUCK.meiaLargura + 0.05);
    else w.blockBox(vaga.x, vaga.z, vaga.personagem === 'capy' ? 1.6 : 2.4, vaga.personagem === 'capy' ? .6 : 1.5);
  }
  // A cobertura é só sobre as vagas do fundo; a vaga do Bebito e a passagem ficam a céu aberto.
  peca(coberturaDoEstacionamento(), -58.2, -7);
  for (const z of [-10.3, -3.7]) w.blockBox(-60.8, z, 0.15, 0.15);
  for (const [x, z] of [[-70, 16.5], [-58.5, 16.5], [-45.3, 17], [-45.5, -11.2]]) {
    peca(jardineiraDoEstacionamento(), x, z); w.blockBox(x, z, 1.7, 0.5);
  }
  for (const [x, z] of [[-65.7, -11], [-53.7, -11], [-43, 16.8]]) { peca(posteDoEstacionamento(), x, z); w.blockCircle(x, z, 0.2); }
  peca(totemDoEstacionamentoDoClube(), -41.1, 16, Math.PI / 2); w.blockBox(-41.1, 16, 0.25, 0.43);
  for (const z of [5.8, 8.2]) {
    const b = new THREE.Mesh(quina(0.14, 0.8, 0.14, 0.03), toon(P.portaoMetal)); b.position.set(-40.7, 0.4, z); fundo.add(b);
    w.blockCircle(-40.7, z, 0.12);
  }
  w.add(fundirComoFundo(fundo));

  const cancela = new Cancela(entrada.largura - 0.25);
  w.add(fundir(w.place(cancela.group, entrada.x, 0, entrada.z - entrada.largura / 2, -Math.PI / 2)));
  const barreira: Collider = { kind: 'box', x: entrada.x, z: entrada.z, hw: 0.15, hd: entrada.largura / 2, rot: 0 };
  w.colliders.push(barreira);
  w.blockBox(entrada.x, entrada.z - entrada.largura / 2, 0.22, 0.22);
  w.blockCircle(entrada.x, entrada.z + entrada.largura / 2 - 0.4, 0.1);
  let comando: boolean | null = null;
  w.onUpdate((dt) => {
    const p = w.game.playerPosition(), c = w.game.companionPosition();
    const perto = [p, c].some(k => Math.abs(k.x - entrada.x) < 5 && Math.abs(k.z - entrada.z) < 4.2);
    cancela.update(dt * ritmoDoPresente.vezes, comando ?? perto);
    const indice = w.colliders.indexOf(barreira);
    if (cancela.abertura > 0.8 && indice >= 0) w.colliders.splice(indice, 1);
    else if (cancela.abertura <= 0.8 && indice < 0) w.colliders.push(barreira);
  });
  // Só geometria/estado transitório: nenhum destino de viagem ou flag persistente novo.
  w.root.userData.estacionamentoDoClube = { cancela, barreira, vaga: VAGA_NO_CLUBE, descida: DESCIDA_NO_CLUBE, carros };
  return { cancela, comandar: aberta => { comando = aberta; } };
}

/** Um único carro no destino salvo; recarregar não repete a chegada. */
export function montarBebitoNoClube(w: WorldBuilder, entrada: ComandoDaCancela, onibus: Interactable): void {
  const g = w.game;
  if (!temBebitoMobile(g) || localDoBebito(g) !== 'clube') return;
  const carro = new BebitoMobile(g.fichaDoBebitoMobile());
  w.add(fundir(w.place(carro.group, VAGA_NO_CLUBE.x, 0, VAGA_NO_CLUBE.z, VAGA_NO_CLUBE.giro)));
  w.onUpdate(dt => carro.update(dt * ritmoDoPresente.vezes));
  w.blockBox(VAGA_NO_CLUBE.x, VAGA_NO_CLUBE.z, BEBITO_MOBILE.comprimento / 2 - 0.1, BEBITO_MOBILE.largura / 2 - 0.08);
  const viajar = w.interact({ id: 'clube:bebito-mobile', x: DESCIDA_NO_CLUBE.x, z: DESCIDA_NO_CLUBE.z, radius: 2,
    label: 'Viajar de Bebito Mobile', icon: '🚙', highlight: carro.group, priority: 2,
    onInteract: async () => { await escolherDestinoDeCarro(g, 'clube'); },
  });
  const motorista = consumirChegadaNoClube();
  if (motorista) {
    viajar.enabled = false;
    animarChegadaNoClube(w, { carro, motorista, entrada, descida: DESCIDA_NO_CLUBE, aoEstacionar: () => { viajar.enabled = true; } });
  }
  onibus.enabled = false;
  w.interact({ id: 'clube:buscar-carro', x: onibus.x, z: onibus.z, radius: 2.4,
    label: 'Buscar o Bebito no estacionamento', icon: '🚙',
    onInteract: async () => { await g.say(['A gente veio de Bebito. Ele está na nossa vaga do outro lado da rua.'], g.companionName()); },
  });
}
