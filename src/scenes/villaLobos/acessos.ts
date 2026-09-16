import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { bus, busStop, fence, signBoard, textSign } from '../../world/props';
import { A, R, type Conversa } from './comum';

/**
 * Como se entra e como se sai: o portao do parque, o ponto de onibus para o
 * clube, e as duas portas para outras cenas.
 */

export function portaoEntrada(w: WorldBuilder): THREE.Object3D {
  const portao = w.add(w.place(signBoard(P.wood, P.metalWhite), 2.6, 0, 27.5, Math.PI));
  w.add(w.place(fence(16, 1.4), -10, 0, 28));
  w.add(w.place(fence(16, 1.4), 10, 0, 28));
  w.blockBox(-10, 28, 8, 0.2);
  w.blockBox(10, 28, 8, 0.2);

  return portao;
}

export interface Ponto {
  onibus: THREE.Object3D;
  parada: THREE.Object3D;
  placaClube: THREE.Object3D;
}

export function pontoDeOnibus(w: WorldBuilder): Ponto {
  // a cerca do parque tem um vão aqui; do outro lado é a rua, com o ônibus
  // parado esperando. A placa escrita deixa claro para onde ele vai.
  w.add(w.place(fence(11, 1.4), 35, 0, 3.5, Math.PI / 2));
  w.add(w.place(fence(11, 1.4), 35, 0, 22.5, Math.PI / 2));
  w.blockBox(35, 3.5, 0.2, 5.5);
  w.blockBox(35, 22.5, 0.2, 5.5);

  w.patch(30, 13, 12, 5, P.asphalt); // caminho do parque até o vão
  w.patch(40, 13, 12, 34, P.asphalt); // a rua
  w.patch(35.6, 13, 1.6, 34, P.concrete, 0, 0.012); // calçada

  const onibus = w.add(w.place(bus(0x3f7fd6), 39.5, 0, 13, -Math.PI / 2));
  w.blockBox(39.5, 13, 1.5, 4.3);

  const parada = w.add(w.place(busStop(), 36.4, 0, 13, -Math.PI / 2));
  w.blockBox(35.9, 13, 0.3, 1.8);

  const placaClube = w.add(w.place(textSign('Clube!', 0x4ec1a8), 36.4, 0, 8.6, Math.PI * 0.25));
  w.blockCircle(36.4, 8.6, 0.3);

  return { onibus, parada, placaClube };
}

export function portas(w: WorldBuilder, portao: THREE.Object3D, onibus: THREE.Object3D): void {
  w.door({
    x: 37.6, z: 13,
    to: 'clube', entry: 'portaria',
    label: 'Pegar o ônibus pro clube', icon: '🚌',
    highlight: onibus,
    radius: 2.6,
  });

  w.door({
    x: 0, z: 27,
    to: 'casa', entry: 'da-rua',
    label: 'Voltar pra casa', icon: '🏠',
    highlight: portao,
    radius: 2.2,
  });
}

export function interacoesDoPonto(w: WorldBuilder, conversa: Conversa, p: Ponto): void {
  const { parada, placaClube } = p;

  w.interact({
    id: 'parque:ponto-onibus',
    x: 36.4, z: 15.4, radius: 2.2,
    label: 'Esperar no ponto', icon: '🚏',
    highlight: parada,
    onInteract: () =>
      conversa([
        [A, 'Esse é o que passa no clube?'],
        [R, 'É esse. Já tá parado, é só subir.'],
      ]),
  });

  w.interact({
    id: 'parque:placa-clube',
    x: 36.4, z: 7.0, radius: 2.2,
    label: 'Ler a placa', icon: '🪧',
    highlight: placaClube,
    onInteract: () =>
      conversa([
        [R, '"Clube!" — com exclamação e tudo.'],
        [A, 'Quem escreveu isso tava animado.'],
      ]),
  });
}
