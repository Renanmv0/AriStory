import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneAmbient } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { toon } from '../core/materials';
import { interiorDoor } from '../world/furniture';

/**
 * ============================================ O QUE AS CENAS DA ESCOLA DIVIDEM
 *
 * A Escola do Gatito é UM saguão grande (`escola.ts`: saguão, corredor e
 * refeitório no mesmo cenário) e várias salas menores, cada uma um cenário
 * próprio atrás de uma porta (`escolaSalas.ts` e `escolaGinasio.ts`). O que as
 * cenas têm em comum mora aqui: os ids e as entradas (para as portas dos dois
 * lados nunca discordarem), a parede com vão de porta, a casca de uma sala, e o
 * "sentar os dois" das carteiras e do sofá.
 *
 * Tudo aqui fala só com o `WorldBuilder` e o `GameAPI`, como qualquer cena.
 * O plano da escola está em `docs/ESCOLA.md`.
 */

/** os cenários da escola, e as entradas do saguão onde cada porta devolve */
export const ESCOLA = {
  saguao: 'escola',
  sala1: 'escola-sala-1',
  sala2: 'escola-sala-2',
  descanso: 'escola-descanso',
  professores: 'escola-professores',
  ginasio: 'escola-ginasio',
} as const;

/** a luz de dentro da escola: clara, de tarde, com o fundo creme */
export const LUZ_DA_ESCOLA: SceneAmbient = {
  sky: 0xefe9dc,
  indoor: true,
  sunColor: 0xfff3dc,
  sunIntensity: 1.0,
  ambientColor: 0xfdf6e8,
  ambientIntensity: 1.4,
  sunDir: [9, 15, 11],
};

/** Vai e volta de falas, com o nome certo em cada balão. */
export async function conversa(g: GameAPI, falas: ReadonlyArray<readonly [string, string]>): Promise<void> {
  for (const [quem, texto] of falas) await g.say([texto], quem);
}

/** um vão de porta numa parede: onde fica o meio dele e a largura */
export interface Vao {
  /** a coordenada do meio do vão AO LONGO da parede (x numa parede em X, z numa em Z) */
  c: number;
  largura: number;
  /** até onde vai o vão; acima dele a parede fecha numa verga (padrão 2,2) */
  altura?: number;
  /** a folha de porta que mora nele; sem ela é só passagem */
  porta?: { cor: number; largura: number };
}

/**
 * UMA PAREDE RETA COM VÃOS DE PORTA, e o rodapé.
 *
 * A porta não pode ser largada no meio de uma parede inteira: a parede tem 0,3
 * de espessura e a folha 0,08, e a porta fica enterrada dentro dela e some (a
 * lição da casa do Ari). Então a parede é feita em trechos, com o vão livre, e
 * uma VERGA (sem colisor, está acima da cabeça) fecha o alto do vão. A porta
 * vai centrada NA LINHA da parede — batente e parede com a face no mesmo plano
 * piscam.
 *
 * `dentro` é o lado da parede que fica para dentro do cômodo (`+1` ou `-1` no
 * eixo perpendicular): é onde o rodapé encosta.
 */
export function paredeComVaos(
  w: WorldBuilder,
  eixo: 'x' | 'z', fixo: number, de: number, ate: number,
  altura: number, cor: number, vaos: readonly Vao[] = [], dentro: 1 | -1 = 1, barra?: number,
): void {
  const ordenados = [...vaos].sort((a, b) => a.c - b.c);
  const trechos: Array<[number, number]> = [];
  let inicio = de;
  for (const v of ordenados) {
    trechos.push([inicio, v.c - v.largura / 2]);
    inicio = v.c + v.largura / 2;
  }
  trechos.push([inicio, ate]);

  const ponto = (ao: number): [number, number] => (eixo === 'x' ? [ao, fixo] : [fixo, ao]);
  for (const [a, b] of trechos) {
    if (b - a < 0.01) continue;
    const [x1, z1] = ponto(a);
    const [x2, z2] = ponto(b);
    w.wall(x1, z1, x2, z2, altura, cor);
    if (altura <= 1) continue;
    const meio = (a + b) / 2;
    /** põe uma faixa colada na face de dentro da parede, a `recuo` dela */
    const faixa = (alto: number, y: number, fundo: number, cor: number, encolhe = 0): void => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(b - a - encolhe, alto, fundo), toon(cor));
      const recuo = 0.15 + fundo / 2;
      if (eixo === 'x') {
        m.position.set(meio, y, fixo + dentro * recuo);
      } else {
        m.position.set(fixo + dentro * recuo, y, meio);
        m.rotation.y = Math.PI / 2;
      }
      w.add(m);
    };
    // o rodapé: um risco azul na base da parede, na face de dentro
    faixa(0.14, 0.07, 0.05, P.escolaRodape);
    /*
     * A BARRA: a metade de baixo da parede pintada de outra cor, com um friso
     * em cima — a "barra de tinta" de corredor de escola. Cada camada é mais
     * funda que a de trás (barra 2 cm, friso 3,5, rodapé 5), então nenhuma
     * face da frente cai no plano de outra; e a barra encolhe 1 cm nas pontas
     * para a face do lado dela não casar com a do rodapé no batente.
     */
    if (barra !== undefined) {
      faixa(1.1, 0.55, 0.02, barra, 0.01);
      faixa(0.05, 1.1, 0.035, P.escolaRodape, 0.01);
    }
  }

  for (const v of ordenados) {
    const alto = v.altura ?? 2.2;
    if (altura > alto) {
      const verga = new THREE.Mesh(new THREE.BoxGeometry(v.largura, altura - alto, 0.3), toon(cor));
      const [x, z] = ponto(v.c);
      verga.position.set(x, (alto + altura) / 2, z);
      if (eixo === 'z') verga.rotation.y = Math.PI / 2;
      w.add(verga);
    }
    if (v.porta) {
      const [x, z] = ponto(v.c);
      w.add(w.place(interiorDoor(v.porta.cor, v.porta.largura, 2.1), x, 0, z, eixo === 'x' ? 0 : Math.PI / 2));
    }
  }
}

/**
 * A CASCA DE UMA SALA DA ESCOLA: o chão, parede alta em `-X` e `-Z`, mureta nos
 * dois lados da câmera, e o vão da porta de volta para o saguão na mureta da
 * frente — sem batente alto ali: pilar do lado da câmera tapa a dupla quando
 * ela entra (a lição do quarto do Ari). A folha da porta mora do lado do
 * saguão, que é de onde ela se vê.
 */
export function cascaDeSala(
  w: WorldBuilder,
  o: {
    largura: number; fundo: number; altura: number; parede: number; chao: number;
    textura?: THREE.Texture; portaX: number; barra?: number;
  },
): { x0: number; z0: number; x1: number; z1: number } {
  const x0 = -o.largura / 2;
  const z0 = -o.fundo / 2;
  const x1 = o.largura / 2;
  const z1 = o.fundo / 2;
  w.ground({ width: o.largura, depth: o.fundo, color: o.chao, textura: o.textura });
  w.setBounds(x0 + 0.45, z0 + 0.45, x1 - 0.45, z1 - 0.45);
  paredeComVaos(w, 'x', z0, x0, x1, o.altura, o.parede, [], 1, o.barra);
  paredeComVaos(w, 'z', x0, z0, z1, o.altura, o.parede, [], 1, o.barra);
  w.wall(x1, z0, x1, z1, 0.45, o.parede);
  const vao = 1.3;
  w.wall(x0, z1, o.portaX - vao / 2, z1, 0.45, o.parede);
  w.wall(o.portaX + vao / 2, z1, x1, z1, 0.45, o.parede);
  return { x0, z0, x1, z1 };
}

/**
 * SENTAR OS DOIS: cada um numa âncora (carteira, sofá, arquibancada), olhando
 * para o mesmo lado, e a câmera no foco.
 *
 * A âncora carrega a ROTAÇÃO, e o rig entra com o `facing` dado: o mundo vê
 * `rotação da âncora + facing`. Fica sentado enquanto a pessoa quiser (o
 * "Ficar mais um pouco?" do banco da praça) e levanta na `saida`.
 */
export async function sentarOsDois(
  g: GameAPI,
  o: {
    ancora: THREE.Object3D;
    jogador: THREE.Vector3;
    parceiro: THREE.Vector3;
    facing: number;
    foco: THREE.Object3D;
    falas: ReadonlyArray<readonly [string, string]>;
    saida: { jogador: [number, number]; parceiro: [number, number]; facing: number };
  },
): Promise<void> {
  g.lockPlayer(true);
  g.ridePlayer(o.ancora, o.jogador, 1, o.facing);
  g.rideCompanion(o.ancora, o.parceiro, 1, o.facing);
  g.setSitting(true);
  g.focusCamera(o.foco);
  await g.wait(0.5);
  await conversa(g, o.falas);
  let escolha = 0;
  while (escolha === 0) {
    escolha = await g.ask('Ficar mais um pouco?', ['Ficar', 'Levantar']);
    if (escolha === 0) await g.wait(4);
  }
  g.setSitting(false);
  g.focusCamera(null);
  g.releasePlayer(o.saida.jogador[0], o.saida.jogador[1], o.saida.facing);
  g.releaseCompanion(o.saida.parceiro[0], o.saida.parceiro[1], o.saida.facing);
  g.lockPlayer(false);
}

/** Um `Object3D` vazio posto no mundo: âncora de sentar ou alvo de câmera. */
export function pontoNoMundo(w: WorldBuilder, x: number, y: number, z: number, rotY = 0): THREE.Object3D {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  o.rotation.y = rotY;
  w.root.add(o);
  return o;
}
