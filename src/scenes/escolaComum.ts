import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneAmbient } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { toon } from '../core/materials';
import { interiorDoor } from '../world/furniture';
import { LANCHES_DA_MAQUINA, modeloDoItem } from '../world/itens';

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
    /** portas na parede do FUNDO (a de `-Z`), como a do vestiário do ginásio */
    vaosDoFundo?: readonly Vao[];
  },
): { x0: number; z0: number; x1: number; z1: number } {
  const x0 = -o.largura / 2;
  const z0 = -o.fundo / 2;
  const x1 = o.largura / 2;
  const z1 = o.fundo / 2;
  w.ground({ width: o.largura, depth: o.fundo, color: o.chao, textura: o.textura });
  w.setBounds(x0 + 0.45, z0 + 0.45, x1 - 0.45, z1 - 0.45);
  paredeComVaos(w, 'x', z0, x0, x1, o.altura, o.parede, o.vaosDoFundo ?? [], 1, o.barra);
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
    /**
     * Para onde o PARCEIRO olha, quando não é o mesmo lado do jogador. Na
     * carteira e no sofá os dois olham para a mesma frente; na mesa do
     * refeitório cada um senta num banco, e com um ângulo só o do banco de
     * trás ficava de costas para a mesa (a foto do Renan).
     */
    facingParceiro?: number;
    foco: THREE.Object3D;
    falas: ReadonlyArray<readonly [string, string]>;
    saida: { jogador: [number, number]; parceiro: [number, number]; facing: number };
  },
): Promise<void> {
  const olharDoParceiro = o.facingParceiro ?? o.facing;
  g.lockPlayer(true);
  g.ridePlayer(o.ancora, o.jogador, 1, o.facing);
  g.rideCompanion(o.ancora, o.parceiro, 1, olharDoParceiro);
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
  g.releaseCompanion(o.saida.parceiro[0], o.saida.parceiro[1], olharDoParceiro);
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

/**
 * PÕE A DUPLA NA DIAGONAL DE QUEM FALA, fora da linha da câmera.
 *
 * A câmera olha de `+X/+Z`, e quem chega para conversar tende a parar
 * exatamente entre o bicho e a tela — a Luna sumiu inteira atrás dos dois na
 * primeira foto do piquenique. Aqui os dois vão para a frente-direita da tela
 * dele (`lado` para a direita, `frente` para a câmera), olhando para ele, e o
 * parceiro fica segurado. Quem chama devolve com `soltarDaConversa`.
 */
export function posicionarParaConversar(
  g: GameAPI,
  alvo: { x: number; z: number },
  lado = 1.3,
  frente = 0.9,
): { x: number; z: number } {
  const c = Math.SQRT1_2;
  const ponto = (l: number, f: number): { x: number; z: number } => ({
    x: alvo.x + c * l + c * f,
    z: alvo.z - c * l + c * f,
  });
  const olhar = (p: { x: number; z: number }): number => Math.atan2(alvo.x - p.x, alvo.z - p.z);
  const eu = ponto(lado, frente);
  const par = ponto(lado + 0.7, frente - 0.2);
  g.lockPlayer(true);
  g.releasePlayer(eu.x, eu.z, olhar(eu));
  g.releaseCompanion(par.x, par.z, olhar(par));
  g.holdCompanion(alvo.x, alvo.z);
  // o meio dos dois: é para lá que quem fala se vira
  return { x: (eu.x + par.x) / 2, z: (eu.z + par.z) / 2 };
}

/** Devolve a dupla depois de `posicionarParaConversar`. */
export function soltarDaConversa(g: GameAPI): void {
  g.freeCompanion();
  g.lockPlayer(false);
}

/**
 * A MÁQUINA DE LANCHES QUE ENTREGA DE VERDADE.
 *
 * Antes ela cobrava e só avisava "caiu da máquina!" — e nada caía. Agora a
 * compra é uma pequena cena, toda dentro da peça (filha do grupo da máquina,
 * então vale em qualquer máquina, girada como estiver):
 *
 * 1. a mola empurra: o pacote da prateleira some e uma cópia dele — o MESMO
 *    modelo que vai para a mão — anda para a frente e tomba;
 * 2. ele cai até a gaveta de retirada, quica uma vez e deita;
 * 3. o prompt vira "Pegar o …": pegar põe na mochila de quem joga (ou do
 *    parceiro, se a de quem joga já tem um igual ou está cheia), e a
 *    prateleira repõe o pacote.
 *
 * A mochila não guarda dois itens iguais na mesma pessoa, então a máquina só
 * sorteia lanche que algum dos dois ainda não tem — e, se os dois já têm os
 * quatro, ela nem cobra.
 */
export function maquinaQueEntrega(
  w: WorldBuilder,
  o: { id: string; maquina: THREE.Object3D; x: number; z: number; radius?: number },
): void {
  const PRECO = 3;
  const ROTULO = `Comprar um lanchinho (R$ ${PRECO})`;
  /** a gaveta de retirada, no espaço da peça (ver `maquinaDeLanches`) */
  const GAVETA = { x: -0.1, y: 0.18, z: 0.43 };
  /** deitado de costas, um pouco inclinado para a câmera */
  const DEITADO = -Math.PI / 2 + 0.3;

  let estado: 'pronta' | 'caindo' | 'na-gaveta' = 'pronta';
  let lanche: (typeof LANCHES_DA_MAQUINA)[number] | null = null;
  let peca: THREE.Object3D | null = null;
  let pacote: THREE.Object3D | null = null;
  let t = 0;
  let vy = 0;
  let quicou = false;
  let origemZ = 0;

  const nomeMiudo = (nome: string): string => nome.charAt(0).toLowerCase() + nome.slice(1);

  const comprar = async (g: GameAPI): Promise<void> => {
    const donos = [g.playerId(), g.companionId()];
    const cabem = LANCHES_DA_MAQUINA.filter((l) => donos.some((q) => !g.hasItem(l.item.id, q)));
    if (!cabem.length) {
      await conversa(g, [
        [g.companionName(), 'A gente já tem um de cada lanche.'],
        [g.playerName(), 'Então primeiro a gente come um. Depois compra outro.'],
      ]);
      return;
    }
    if (!g.gastar(PRECO)) {
      await conversa(g, [
        [g.companionName(), 'Tá sem moeda?'],
        [g.playerName(), 'A carteira tá vazia. Depois a gente volta.'],
      ]);
      return;
    }
    g.som('caixa');
    lanche = cabem[Math.floor(w.rng() * cabem.length)];
    pacote = o.maquina.getObjectByName(`pacote-${Math.floor(w.rng() * 4)}-${Math.floor(w.rng() * 4)}`) ?? null;
    const origem = pacote ? pacote.position.clone() : new THREE.Vector3(-0.1, 1.2, 0.41);
    if (pacote) pacote.visible = false;
    peca = modeloDoItem(lanche.item.id);
    if (!peca) return;
    // o pacote da prateleira tem o CENTRO na posição; a peça do lanche tem a base
    peca.position.set(origem.x, origem.y - 0.08, origem.z + 0.012);
    origemZ = peca.position.z;
    o.maquina.add(peca);
    estado = 'caindo';
    t = 0;
    vy = 0;
    quicou = false;
    ponto.enabled = false;
  };

  const pegar = (g: GameAPI): void => {
    if (!lanche || !peca) return;
    let ficou: string | null = null;
    for (const quem of [g.playerId(), g.companionId()]) {
      const r = g.addItem(lanche.item, quem);
      if (r === 'mao' || r === 'guardado') {
        ficou = quem === g.playerId() ? g.playerName() : g.companionName();
        break;
      }
    }
    if (!ficou) {
      g.toast('As duas mochilas estão cheias', '🎒');
      return;
    }
    g.som('pegar');
    g.toast(`${ficou} pegou o ${nomeMiudo(lanche.item.nome)}`, lanche.item.icone);
    o.maquina.remove(peca);
    if (pacote) pacote.visible = true; // a mola traz o próximo
    peca = null;
    pacote = null;
    lanche = null;
    estado = 'pronta';
    ponto.label = ROTULO;
    ponto.icon = '🍫';
  };

  const ponto = w.interact({
    id: o.id,
    x: o.x, z: o.z, radius: o.radius ?? 1.2,
    label: ROTULO, icon: '🍫',
    highlight: o.maquina,
    onInteract: async (g) => {
      if (estado === 'na-gaveta') pegar(g);
      else if (estado === 'pronta') await comprar(g);
    },
  });

  w.onUpdate((dt) => {
    if (estado !== 'caindo' || !peca || !lanche) return;
    t += dt;
    // 1. a mola empurra o lanche para a frente e ele tomba na beira
    if (t < 0.7) {
      const k = t / 0.7;
      peca.position.z = origemZ + 0.06 * k;
      peca.rotation.x = 0.5 * k * k;
      return;
    }
    // 2. a queda, indo para a frente da gaveta e girando para deitar
    vy -= 9.8 * dt;
    peca.position.y += vy * dt;
    peca.position.x += (GAVETA.x - peca.position.x) * Math.min(1, dt * 4);
    peca.position.z += (GAVETA.z - peca.position.z) * Math.min(1, dt * 4);
    peca.rotation.x += (DEITADO - peca.rotation.x) * Math.min(1, dt * 5);
    if (peca.position.y > GAVETA.y) return;
    peca.position.y = GAVETA.y;
    if (!quicou) {
      quicou = true;
      vy = Math.abs(vy) * 0.25;
      w.game.som('quicar');
      return;
    }
    // 3. deitou na gaveta: agora é pegar
    peca.rotation.x = DEITADO;
    estado = 'na-gaveta';
    ponto.enabled = true;
    ponto.label = `Pegar o ${nomeMiudo(lanche.item.nome)}`;
    ponto.icon = lanche.item.icone;
  });
}
