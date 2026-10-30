import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { tapete } from '../../world/furniture';
import { portaDaRua } from '../../world/moveisDaCasa';
import { assoalhoDeMadeira } from '../../world/texturasDeChao';
import { uvDeParede } from '../../world/acabamento';
import { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import { tabuasRoxas } from '../../world/halloween/casinhaDaAbobora';
import { CENA_DO_SALAO, FLAG_DA_SURPRESA } from './noSalao';
import {
  FantasminhaDeMola, FogaoALenha, MESA_DA_BRUXA, MorceguinhosNoFio, QuadroComOlhos, RelogioDePendulo,
  arandela, janelaComLua, mesaDaBruxa, papelListrado, parede, portaDoSalao, prateleiraDePocoes,
  restiaDeAboboras, vassourasEncostadas, type TemaDoQuadro,
} from '../../world/halloween/casinhaPorDentro';

/*
 * A CASINHA DA ABÓBORA POR DENTRO (`docs/HALLOWEEN.md`, §7.1, C e D — a
 * parte 6b): o CORREDOR e a COZINHA DA BRUXA, numa cena só
 * (`casinha-da-abobora-dentro`). As paredes do fundo (`−X`, `−Z`) são
 * altas, as do lado da câmera são baixas — o jeito de toda sala do jogo.
 *
 * - O CORREDOR (de `x = 9`, a porta da rua, até `x = 2`): o papel listrado
 *   roxo em cima do lambri, o tapete comprido, os quatro QUADROS DE OLHOS QUE
 *   SEGUEM (o fantasminha, a senhora abóbora, o gato na lua e a casa
 *   assombrada), as arandelas de vela, o RELÓGIO DE PÊNDULO que dá o BONG
 *   quando a dupla passa (o susto pequeno), os MORCEGUINHOS no fio que
 *   balançam quando ela passa embaixo, as teias, e a PORTA DO FIM que range e
 *   abre sozinha.
 * - A COZINHA (de `x = 2` a `x = −4,8`): o fogão a lenha com o caldeirão
 *   borbulhando, a prateleira de poções acesas, a janela redonda com a lua,
 *   as vassouras, a réstia de abóboras, a mesa com o livro de feitiço e o
 *   CHAPÉU DE BRUXA: chegando perto, ele treme, pula, e sai o FANTASMINHA DE
 *   MOLA rindo. E a PORTA GRANDE do salão (a abóbora), que a 6c abre: por
 *   enquanto, do outro lado, só um "shhh".
 */

export const CENA_DE_DENTRO = 'casinha-da-abobora-dentro';

/** as entradas de dentro (a cena registra) */
export const ENTRADAS_DE_DENTRO = {
  'da-clareira': { x: 8.25, z: 0, facing: -Math.PI / 2 },
  // de volta do salão: na frente da porta grande, olhando para a cozinha
  'do-salao': { x: -3.85, z: -0.6, facing: Math.PI / 2 },
} as const;

/** o susto do fantasminha já aconteceu (quem volta encontra ele fora do chapéu) */
export const FLAG_FANTASMINHA = 'halloween:casinha:fantasminha';
const FLAG_VIU_O_RELOGIO = 'halloween:viu:relogio';
const FLAG_VIU_A_COZINHA = 'halloween:viu:cozinha';

const H = 2.9;
const CORREDOR = { x0: 2, x1: 9, z0: -1.1, z1: 1.1 } as const;
const COZINHA = { x0: -4.8, x1: 2, z0: -3.4, z1: 2.8 } as const;
/** a porta grande do salão, na parede da esquerda da cozinha */
const SALAO = { z: -0.6 } as const;
/** a mesa da bruxa, e onde o chapéu está nela */
const MESA = { x: -1.1, z: 0.25, giro: 0.12 } as const;
const CHAPEU_NA_MESA = { x: 0.35, z: 0.05 } as const;

/** quem joga diz `@eu`, quem acompanha diz `@par` */
async function conversa(api: GameAPI, falas: ReadonlyArray<readonly ['@eu' | '@par', string]>): Promise<void> {
  for (const [quem, texto] of falas) await api.say([texto], quem === '@eu' ? api.playerName() : api.companionName());
}

/**
 * uma parede de `a` até `b` (no chão): a face de dentro fica na linha, para a
 * DIREITA de quem anda de `a` para `b` (vista de cima, com o `+Z` para baixo)
 */
function paredeEntre(w: WorldBuilder, a: [number, number], b: [number, number], alto: number, estilo: 'corredor' | 'cozinha'): void {
  const comp = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const giro = Math.atan2(-(b[1] - a[1]), b[0] - a[0]);
  const p = parede(comp, alto, estilo);
  // a face (+Z da peça) fica 8 cm à frente da linha: a linha é a face da sala
  const nx = Math.sin(giro);
  const nz = Math.cos(giro);
  w.add(w.place(p, a[0] - nx * 0.08, 0, a[1] - nz * 0.08, giro));
  w.blockBox((a[0] + b[0]) / 2 - nx * 0.08, (a[1] + b[1]) / 2 - nz * 0.08, comp / 2, 0.1, -giro);
}

export function montarODentro(w: WorldBuilder): void {
  const g0 = w.game;
  const C = CORREDOR;
  const K = COZINHA;

  // ------------------------------------------------------------ o chão e os limites
  w.ground({ width: 40, depth: 40, color: P.dentroFundo });
  const tabuas = assoalhoDeMadeira(1.8, 9);
  w.patch((C.x0 + C.x1) / 2, 0, C.x1 - C.x0, C.z1 - C.z0, P.assoalhoDaCasinha, 0, 0.01, tabuas);
  w.patch((K.x0 + K.x1) / 2, (K.z0 + K.z1) / 2, K.x1 - K.x0, K.z1 - K.z0, P.assoalhoDaCasinha, 0, 0.01, tabuas);
  w.setBounds(K.x0 + 0.25, K.z0 + 0.25, C.x1 - 0.2, K.z1 - 0.25);
  // fora do corredor (o vazio dos dois lados dele) não se anda
  w.blockBox((C.x0 + C.x1) / 2 + 0.2, (C.z1 + K.z1) / 2 + 0.1, (C.x1 - C.x0) / 2, (K.z1 - C.z1) / 2);
  w.blockBox((C.x0 + C.x1) / 2 + 0.2, (C.z0 + K.z0) / 2 - 0.1, (C.x1 - C.x0) / 2, (C.z0 - K.z0) / 2);

  // ------------------------------------------------------------ as paredes
  // o corredor: o fundo alto (a face para +Z), a frente baixa (a face para −Z)
  paredeEntre(w, [C.x0, C.z0], [C.x1, C.z0], H, 'corredor');
  paredeEntre(w, [C.x1, C.z1], [C.x0, C.z1], 0.6, 'corredor');
  // a ponta da rua (x = 9), baixa, com o vão da porta no meio
  paredeEntre(w, [C.x1, C.z0], [C.x1, -0.6], 0.6, 'corredor');
  paredeEntre(w, [C.x1, 0.6], [C.x1, C.z1], 0.6, 'corredor');
  // a divisa corredor-cozinha (x = 2), alta, com a porta que range no meio
  paredeEntre(w, [C.x0, C.z1], [C.x0, 0.6], H, 'corredor');
  paredeEntre(w, [C.x0, -0.6], [C.x0, C.z0], H, 'corredor');
  const papel = toon(0xffffff, { mapa: papelListrado() });
  const verga = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(0.16, H - 2.3, 1.2), C.x0 - 0.08, 2.3 + (H - 2.3) / 2, 0), papel);
  verga.position.set(C.x0 - 0.08, 2.3 + (H - 2.3) / 2, 0);
  w.add(verga);
  // a cozinha: o fundo e a esquerda altas (a da esquerda com o vão da porta do salão), a frente e a direita baixas
  paredeEntre(w, [K.x0, K.z0], [K.x1, K.z0], H, 'cozinha');
  paredeEntre(w, [K.x0, K.z1], [K.x0, SALAO.z + 0.72], H, 'cozinha');
  paredeEntre(w, [K.x0, SALAO.z - 0.72], [K.x0, K.z0], H, 'cozinha');
  const verga2 = new THREE.Mesh(uvDeParede(new THREE.BoxGeometry(0.16, H - 2.45, 1.44), K.x0 - 0.08, 2.45 + (H - 2.45) / 2, SALAO.z), toon(0xffffff, { mapa: tabuasRoxas() }));
  verga2.position.set(K.x0 - 0.08, 2.45 + (H - 2.45) / 2, SALAO.z);
  w.add(verga2);
  paredeEntre(w, [K.x1, K.z1], [K.x0, K.z1], 0.6, 'cozinha');
  paredeEntre(w, [K.x1, K.z0], [K.x1, C.z0], 0.6, 'cozinha');
  paredeEntre(w, [K.x1, C.z1], [K.x1, K.z1], 0.6, 'cozinha');

  // ------------------------------------------------------------ as portas
  // a da rua (sair), na ponta do corredor
  const daRua = portaDaRua(P.casinhaPorta, 0.95, 2.1);
  w.add(w.place(daRua, C.x1 + 0.08, 0, 0, -Math.PI / 2));
  w.blockBox(C.x1 + 0.05, 0, 0.12, 0.6);
  w.interact({
    id: 'halloween:casinha:sair',
    x: C.x1 - 0.65, z: 0, radius: 1.0,
    label: 'Sair da casinha', icon: '🚪',
    highlight: daRua,
    onInteract: (api) => api.goTo('casinha-da-abobora', 'da-casinha'),
  });
  // a do fim do corredor: range e abre sozinha quando a dupla chega perto
  const doFim = portaDaRua(P.casinhaPorta, 0.95, 2.1);
  w.add(w.place(doFim, C.x0 - 0.08, 0, 0, Math.PI / 2));
  const dobradica = doFim.getObjectByName('dobradica');
  let abertura = 0;
  let rangeu = false;

  // ------------------------------------------------------------ o corredor
  w.add(w.place(tapete(5.8, 1.1, P.halloweenRoxoEscuro, 'felpudo'), 5.5, 0.012, 0));
  const temas: Array<[TemaDoQuadro, number]> = [['fantasma', 3.2], ['abobora', 4.5], ['gato', 7.2], ['casa', 8.35]];
  const quadros = temas.map(([tema, x]) => {
    const q = new QuadroComOlhos(tema);
    w.add(w.place(q.group, x, 1.75, C.z0 + 0.02));
    return q;
  });
  const chamas: THREE.Object3D[] = [];
  for (const x of [3.85, 5.15, 6.55, 7.8]) {
    const a = arandela();
    w.add(w.place(a.group, x, 1.72, C.z0 + 0.02));
    chamas.push(a.chama);
  }
  const relogio = new RelogioDePendulo();
  w.add(w.place(relogio.group, 5.85, 0, C.z0 + 0.22));
  w.blockBox(5.85, C.z0 + 0.22, 0.34, 0.24);
  // (o fio rente à cornija: mais baixo, os morceguinhos ficavam na frente dos quadros)
  const morcegos = new MorceguinhosNoFio(new THREE.Vector3(2.4, 2.78, C.z0 + 0.12), new THREE.Vector3(8.7, 2.78, C.z0 + 0.12), 7, new THREE.Vector3(0, 0, 1), 2);
  w.add(morcegos.group);

  // ------------------------------------------------------------ a cozinha
  const fogao = new FogaoALenha();
  w.add(w.place(fogao.group, -2.75, 0, K.z0 + 0.42));
  w.blockBox(-2.45, K.z0 + 0.42, 1.0, 0.45);
  w.add(w.place(janelaComLua(), -0.55, 1.7, K.z0 + 0.04));
  w.add(w.place(prateleiraDePocoes(1.5), 1.05, 1.25, K.z0 + 0.02));
  w.add(w.place(vassourasEncostadas(), K.x0 + 0.02, 0, 1.75, Math.PI / 2));
  w.blockBox(K.x0 + 0.25, 1.75, 0.2, 0.55);
  w.add(w.place(restiaDeAboboras(), K.x0 + 0.02, 2.2, -2.5, Math.PI / 2));
  w.add(w.place(tapete(2.8, 2.0, P.halloweenRoxo, 'felpudo'), MESA.x, 0.012, MESA.z, MESA.giro));
  const mesa = mesaDaBruxa();
  w.add(w.place(mesa.group, MESA.x, 0, MESA.z, MESA.giro));
  chamas.push(mesa.chama);
  w.blockBox(MESA.x, MESA.z, MESA_DA_BRUXA.largura / 2 + 0.05, MESA_DA_BRUXA.fundo / 2 + 0.05, -MESA.giro);
  // o chapéu de bruxa (e o fantasminha dentro dele), no canto direito do tampo
  const fantasminha = new FantasminhaDeMola();
  const c = MESA.giro;
  const xChapeu = MESA.x + CHAPEU_NA_MESA.x * Math.cos(c) + CHAPEU_NA_MESA.z * Math.sin(c);
  const zChapeu = MESA.z - CHAPEU_NA_MESA.x * Math.sin(c) + CHAPEU_NA_MESA.z * Math.cos(c);
  w.add(w.place(fantasminha.group, xChapeu, MESA_DA_BRUXA.tampo, zChapeu, MESA.giro));
  if (g0.flag(FLAG_FANTASMINHA)) fantasminha.jaSaiu();
  // a porta grande do salão
  const salao = portaDoSalao();
  w.add(w.place(salao, K.x0 + 0.02, 0, SALAO.z, Math.PI / 2));
  w.blockBox(K.x0 + 0.1, SALAO.z, 0.15, 0.72);

  // as teias nos cantos e uns morceguinhos de papel na cozinha
  const pendurados = new EnfeitesDePendurar();
  pendurados.teia(C.x0 + 0.25, H - 0.5, C.z0 + 0.12, 0, 0.45, { aranha: true });
  pendurados.teia(C.x1 - 0.3, H - 0.55, C.z0 + 0.12, 0, 0.4, {});
  pendurados.teia(K.x0 + 0.2, H - 0.6, K.z0 + 0.2, Math.PI / 4, 0.6, { inclina: 0.1, aranha: true });
  pendurados.teia(K.x1 - 0.25, H - 0.5, K.z0 + 0.12, 0, 0.45, {});
  pendurados.teia(K.x0 + 0.12, H - 0.5, 2.3, Math.PI / 2, 0.45, {});
  w.add(pendurados.montar());

  // ------------------------------------------------------------ o que acontece
  // o comentário de quem entra na cozinha, uma vez
  let falando = false;
  const dizer = (falas: ReadonlyArray<readonly ['@eu' | '@par', string]>, flag: string | null): void => {
    falando = true;
    if (flag) g0.setFlag(flag);
    void (async () => {
      await conversa(g0, falas);
      falando = false;
    })();
  };

  // o caldeirão: chegar perto e olhar
  w.interact({
    id: 'halloween:casinha:caldeirao',
    x: -2.45, z: K.z0 + 1.35, radius: 1.0,
    label: 'Olhar o caldeirão', icon: '🧪',
    highlight: fogao.group,
    onInteract: (api) => conversa(api, [
      ['@eu', 'Tá borbulhando… e é verde.'],
      ['@par', 'Cheira a chocolate quente. Que bruxa mais boazinha.'],
    ]),
  });
  // o livro de feitiço, aberto na mesa
  w.interact({
    id: 'halloween:casinha:livro',
    x: MESA.x - 0.45, z: MESA.z + 0.85, radius: 0.9,
    label: 'Ler o livro de feitiço', icon: '📖',
    highlight: mesa.group,
    onInteract: (api) => conversa(api, [
      ['@eu', '"Feitiço do susto fofo: uma pitada de abóbora, duas risadas e um BU bem baixinho."'],
      ['@par', 'Duas risadas… Já tô na primeira.'],
    ]),
  });
  // o fantasminha, depois do susto: cutucar
  const cutucar = w.interact({
    id: 'halloween:casinha:fantasminha',
    x: xChapeu + 0.3, z: zChapeu + 0.75, radius: 0.9,
    label: 'Cutucar o fantasminha', icon: '👻',
    highlight: fantasminha.group,
    onInteract: (api) => {
      fantasminha.cutucar();
      api.som('estouro');
    },
  });
  cutucar.enabled = fantasminha.saiu;
  /*
   * A PORTA DO SALÃO (a 6c): ela abre para dentro do salão (a abóbora). A
   * primeira vez, a dupla comenta o escuro do outro lado e a folha abre
   * devagar; depois da surpresa, é só a porta da festa.
   */
  const folhaDoSalao = salao.getObjectByName('dobradica');
  let abrindoOSalao = -1;
  w.interact({
    id: 'halloween:casinha:salao',
    x: K.x0 + 0.95, z: SALAO.z, radius: 1.1,
    label: g0.flag(FLAG_DA_SURPRESA) ? 'Voltar pra festa' : 'Abrir a porta grande', icon: '🎃',
    highlight: salao,
    onInteract: async (api) => {
      if (abrindoOSalao >= 0) return;
      api.lockPlayer(true);
      try {
        if (!api.flag(FLAG_DA_SURPRESA)) {
          api.som('clique');
          await conversa(api, [
            ['@eu', 'Destrancou…'],
            ['@par', 'E do outro lado tá tudo escuro. Vamos juntos.'],
          ]);
        }
        api.som('porta');
        abrindoOSalao = 0;
        while (abrindoOSalao >= 0 && abrindoOSalao < 1) await api.wait(0.1);
      } finally {
        api.lockPlayer(false);
      }
      api.goTo(CENA_DO_SALAO, 'da-cozinha');
    },
  });

  // ------------------------------------------------------------ o relógio do mundo
  let tempo = 0;
  let bongou = false;
  let assustou = fantasminha.saiu;
  let antes = { x: NaN, z: NaN };
  const peito = new THREE.Vector3();
  w.onUpdate((dt) => {
    tempo += dt;
    const p = g0.playerPosition();
    const andou = Math.hypot(p.x - antes.x, p.z - antes.z) > 0.004;
    antes = { x: p.x, z: p.z };
    // os olhos dos quadros seguem quem joga
    peito.set(p.x, 1.2, p.z);
    for (const q of quadros) q.olhar(peito);
    // as chamas
    chamas.forEach((ch, i) => ch.scale.set(0.8, 1.5 + Math.sin(tempo * (11 + i)) * 0.2 + Math.sin(tempo * 6.1 + i) * 0.1, 0.8));
    relogio.update(dt);
    fogao.update(dt);
    fantasminha.update(dt);
    // os morceguinhos balançam quando a dupla passa embaixo
    if (andou) {
      morcegos.passou(p.x, p.z, 0.25);
      const q = g0.companionPosition();
      morcegos.passou(q.x, q.z, 0.15);
    }
    morcegos.update(dt);
    // o BONG do relógio: uma vez por visita, quando quem joga passa na frente dele
    if (!bongou && Math.abs(p.x - 5.85) < 0.9 && p.z < 0.9) {
      bongou = true;
      relogio.bater();
      g0.som('sino');
      if (!falando && !g0.flag(FLAG_VIU_O_RELOGIO) && !g0.emDialogo()) {
        dizer([['@par', 'AI! …'], ['@eu', 'É só o relógio. Meia-noite em ponto.'], ['@par', 'Meu coração tá no pé.']], FLAG_VIU_O_RELOGIO);
      }
    }
    // a porta do fim do corredor range e abre sozinha
    if (dobradica) {
      const perto = Math.hypot(p.x - C.x0, p.z) < 2.3;
      if (perto && !rangeu) {
        rangeu = true;
        g0.som('porta');
      }
      if (rangeu) abertura = Math.min(1, abertura + dt * 0.9);
      const k = abertura * abertura * (3 - 2 * abertura);
      dobradica.rotation.y = 1.45 * k;
    }
    // a cozinha: o comentário de quem entra, uma vez
    if (!falando && p.x < C.x0 - 0.6 && !g0.flag(FLAG_VIU_A_COZINHA) && !g0.emDialogo()) {
      dizer([['@eu', 'Uma cozinha de bruxa!'], ['@par', 'Com caldeirão e tudo. E um chapéu esquecido na mesa…']], FLAG_VIU_A_COZINHA);
    }
    // o chapéu da mesa: chegando perto, o susto do fantasminha
    // (uma vez: enquanto o chapéu treme o fantasminha ainda não "saiu", e o susto se repetia a cada quadro)
    if (!assustou && !fantasminha.saiu && Math.hypot(p.x - xChapeu, p.z - zChapeu) < 1.45) {
      assustou = true;
      fantasminha.disparar();
      g0.som('estouro');
      g0.setFlag(FLAG_FANTASMINHA);
      void (async () => {
        while (falando || g0.emDialogo()) await g0.wait(0.2);
        falando = true;
        await g0.wait(0.9);
        g0.som('bolha');
        await conversa(g0, [['@eu', 'AAAH!'], ['@par', '…É de mola! Um fantasminha de mola!'], ['@eu', 'Que susto fofo. Olha ele rindo da gente.']]);
        falando = false;
      })();
    }
    cutucar.enabled = fantasminha.saiu;
    // a porta do salão abrindo (empurrada para lá)
    if (abrindoOSalao >= 0 && folhaDoSalao) {
      abrindoOSalao = Math.min(1, abrindoOSalao + dt * 1.2);
      const k = abrindoOSalao * abrindoOSalao * (3 - 2 * abrindoOSalao);
      folhaDoSalao.rotation.y = 1.3 * k;
    }
  });
}
