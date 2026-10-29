import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import type { Estella } from '../../entities/bichos/Estella';
import { Pelusa } from '../../entities/bichos/Pelusa';
import { PALETTE as P } from '../../palette';
import { ARI, RENAN } from '../../characters/cast';
import { fundir } from '../../world/fundir';
import { haloDeLampada, pocaDeLuz } from '../../world/furniture';
import { ITENS, FANTASIA_DE_MORCEGUINHO, FANTASIA_DE_VAMPIRO } from '../../world/itens';
import { LoteDeAboboras } from '../../world/halloween/abobora';
import { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import { chapeuDeBruxa } from '../../world/halloween/pecas';
import { repintar, trocaDeCores } from '../../world/halloween/repintar';
import {
  balancarBexigas, cachoDeBexigas, caixaDePresente, caldeiraoDeBalas, mantinhaDobrada, meiaQueVoa,
  placaDoProvador, poteDeBiscoitos,
} from '../../world/halloween/boutique';
import { fantasiarEstellaDeAranha, pelusaMorceguinho } from '../../world/halloween/fantasiasDosBichos';
import { FLAG_DO_PRESENTE, avancarFase, faseDoHalloween, parqueEnfeitado } from './fase';

/*
 * A BOUTIQUE DE HALLOWEEN — a etapa 3 do especial (`docs/HALLOWEEN.md`,
 * §2.3.1). É CAMADA, como o parque: a `lojinha.ts` monta a loja de sempre e,
 * no fim, chama esta função, que só ACRESCENTA por cima — os enfeites nos dois
 * andares, a Estella de aranha, o Pelusa morceguinho dormindo no pufe vinho e
 * a cena do presente. Sem o `?halloween`, ou fora do evento, nada muda.
 *
 * A CENA DO PRESENTE (decisões do Renan): a Estella recebe os dois no
 * personagem da aranha; tira de trás do balcão duas caixas com o nome de cada
 * um e NÃO conta o que tem dentro; cada um leva a sua para um provador e sai
 * de lá inteiro fantasiado — o Ari de vampiro, o Renan de morceguinho. Ela
 * aprova, dá a cestinha de abóbora e o mapinha, e só aí a loja volta a
 * funcionar. As fantasias ficam no guarda-roupa dos dois para sempre.
 */

/** a flag de quando a cena do presente já aconteceu (mora na `fase.ts`: é ela que abre a noite da festa) */
export { FLAG_DO_PRESENTE };

interface Ponto {
  x: number;
  z: number;
}

export interface PecasDaBoutique {
  terreo: THREE.Group;
  superior: THREE.Group;
  estella: Estella;
  /** o que a loja liga (as araras, a escada, o espelho, a Estella): a cena desliga antes do presente */
  interacoes: Interactable[];
  /** segura (ou devolve) a ronda e as falas soltas da Estella */
  pausarEstella(sim: boolean): void;
  /** a conversa do evento, que fala no lugar das de sempre (`true` = falou) */
  conversar(fn: ((api: GameAPI) => Promise<boolean>) | null): void;
  andar(): 0 | 1;
  planta: {
    W: number; D: number; x0: number; z0: number; H: number; ALTURA: number; INTERNA: number;
    porta: Ponto; centro: Ponto;
    araras: ReadonlyArray<Ponto & { rot: number }>;
    premium: readonly Ponto[];
    caixa: Ponto; provadores: Ponto; cabineAberta: Ponto; podio: Ponto;
    espelho: Ponto; joias: Ponto; chapeus: Ponto; tingimento: Ponto;
    escada: Ponto & { corrida: number };
    pufe: Ponto; namoradeira: Ponto;
  };
}

/** a caixa (no mundo) de uma peça do andar, pela etiqueta `userData.peca` */
function caixaDaPeca(raiz: THREE.Object3D, peca: string): THREE.Box3[] {
  const caixas: THREE.Box3[] = [];
  raiz.updateMatrixWorld(true);
  raiz.traverse((o) => {
    if (o.userData.peca === peca) caixas.push(new THREE.Box3().setFromObject(o));
  });
  return caixas;
}

export function montarHalloweenNaBoutique(w: WorldBuilder, pecas: PecasDaBoutique): void {
  const g0 = w.game;
  if (!parqueEnfeitado(g0)) return;
  const { terreo, superior, estella, planta } = pecas;
  const { x0, z0, W, D, H, ALTURA } = planta;
  const A = ARI.name;
  const R = RENAN.name;
  const E = 'Estella';

  // ============================================================ o TÉRREO
  const enfeite = new THREE.Group();
  enfeite.name = 'halloween-na-boutique';
  terreo.add(enfeite);
  const aboboras = new LoteDeAboboras();
  const pendurados = new EnfeitesDePendurar();

  // as TEIAS DE LÃ nos cantos altos (a Estella tece), com a aranhinha de feltro
  pendurados.teia(x0 + 0.2, H - 0.62, z0 + 0.2, Math.PI / 4, 0.65, { inclina: 0.1 });
  pendurados.teia(x0 + 0.17, H - 0.5, 4.2, Math.PI / 2, 0.45, { aranha: false });
  pendurados.teia(W / 2 - 0.5, H - 0.55, z0 + 0.17, 0, 0.5);
  // as BANDEIROLAS de morceguinho, do lustre às duas paredes altas
  const lustre = new THREE.Vector3(planta.centro.x, 2.55, planta.centro.z);
  pendurados.varal(lustre, new THREE.Vector3(planta.centro.x, H - 0.25, z0 + 0.17), { barriga: 0.28, passo: 0.4 });
  pendurados.varal(lustre, new THREE.Vector3(x0 + 0.17, H - 0.25, planta.centro.z), { barriga: 0.25, passo: 0.4 });
  pendurados.varal(lustre, new THREE.Vector3(3.2, H - 0.25, z0 + 0.17), { barriga: 0.3, passo: 0.4 });
  // o LUSTRE vira o lampião da loja: um halo de vela em volta dos globos e a
  // poça larga no tapete (luz pintada, por cima da que ele já tem)
  const haloDoLustre = haloDeLampada(2.6, P.luzDeAbobora, 0.3);
  haloDoLustre.position.copy(lustre);
  enfeite.add(haloDoLustre);
  enfeite.add(w.place(pocaDeLuz(2.3, P.luzDeAbobora, 0.22), lustre.x, 0.03, lustre.z));
  // morceguinhos de papel pendurados do aro do lustre
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.3;
    pendurados.morcego(lustre.x + Math.cos(a) * 0.62, 2.45, lustre.z + Math.sin(a) * 0.62, -a, 0.8);
  }

  // as ABÓBORAS aos pés das araras (uma numa ponta de cada), e as da porta
  planta.araras.forEach((a, i) => {
    const lado = i % 2 ? -1 : 1;
    const ao = a.rot === 0 ? { x: a.x + lado * 1.12, z: a.z } : { x: a.x, z: a.z + lado * 1.12 };
    aboboras.por({ x: ao.x, z: ao.z, tamanho: 'pequena', cara: (['sorriso', 'piscando', 'dentinho', 'susto'] as const)[i], giro: 0.8 });
  });
  aboboras.por({ x: planta.porta.x - 0.95, z: D / 2 - 0.45, tamanho: 'media', cara: 'sorriso', giro: 0.3 });
  aboboras.por({ x: planta.porta.x + 0.95, z: D / 2 - 0.45, tamanho: 'media', cara: 'piscando', giro: 0.6 });
  aboboras.por({ x: planta.porta.x + 1.25, z: D / 2 - 0.55, tamanho: 'pequena', giro: 0.4 });

  // o BALCÃO do caixa: as abóboras em cima e o pote de biscoitos de fantasminha
  const [balcao] = caixaDaPeca(terreo, 'balcao-da-loja');
  const topoDoBalcao = balcao ? balcao.max.y : 0.95;
  aboboras.por({ x: planta.caixa.x - 0.85, y: topoDoBalcao, z: planta.caixa.z + 0.05, tamanho: 'pequena', cara: 'sorriso', giro: 0.5 });
  aboboras.por({ x: planta.caixa.x - 0.6, y: topoDoBalcao, z: planta.caixa.z + 0.12, tamanho: 'pequena', giro: 0.7, cor: P.aboboraClara });
  enfeite.add(fundir(w.place(poteDeBiscoitos(), planta.caixa.x + 0.85, topoDoBalcao, planta.caixa.z + 0.05, 0)));

  // o CALDEIRÃO DE BALAS na ponta da mesa de mármore do pátio
  const [mesa] = caixaDaPeca(terreo, 'mesa-de-dobrar');
  const caldeirao = caldeiraoDeBalas();
  caldeirao.scale.setScalar(0.55);
  w.place(caldeirao, planta.centro.x + 0.62, mesa ? mesa.max.y - 0.01 : 0.8, planta.centro.z, 0.4);
  enfeite.add(caldeirao);

  // os BUSTOS do pódio: um de chapéu de bruxa, o outro de cabeça de abóbora
  const bustos = caixaDaPeca(terreo, 'manequim-de-loja');
  if (bustos[0]) {
    const chapeu = fundir(chapeuDeBruxa());
    chapeu.scale.setScalar(0.62);
    const c = bustos[0].getCenter(new THREE.Vector3());
    chapeu.position.set(c.x, bustos[0].max.y - 0.03, c.z);
    chapeu.rotation.y = 0.5;
    enfeite.add(chapeu);
  }
  if (bustos[1]) {
    const c = bustos[1].getCenter(new THREE.Vector3());
    aboboras.por({ x: c.x, y: bustos[1].max.y - 0.04, z: c.z, tamanho: 'pequena', cara: 'sorriso', giro: 0.9 });
  }

  // os PROVADORES: a cortina vinho fica roxa, e a plaquinha em cima
  const provador = terreo.children.find((o) => o.userData.peca === 'provadores');
  if (provador) repintar(provador, trocaDeCores([[P.boutiqueVinho, P.halloweenRoxo]], 0.12));
  const placa = placaDoProvador();
  placa.position.set(planta.provadores.x + 0.45, 2.95, planta.provadores.z);
  placa.rotation.y = Math.PI / 2;
  enfeite.add(placa);

  // o CANTINHO: a mantinha laranja dobrada no braço da namoradeira
  const manta = mantinhaDobrada();
  manta.position.set(planta.namoradeira.x + 0.05, 0.6, planta.namoradeira.z + 0.66);
  manta.rotation.y = Math.PI / 2;
  enfeite.add(manta);

  // as BEXIGAS DE CAVEIRA do térreo: no canto do caixa e no canto da escada
  const bexigas: THREE.Object3D[] = [];
  const bexiga = (pai: THREE.Group, x: number, y: number, z: number, n: number, alto: number, semente: number): void => {
    const cacho = cachoDeBexigas(n, alto, semente);
    cacho.position.set(x, y, z);
    pai.add(cacho);
    bexigas.push(cacho);
    w.blockCircle(x, z, 0.28);
  };
  bexiga(enfeite, W / 2 - 0.5, 0, -2.75, 5, 1.95, 1);
  bexiga(enfeite, x0 + 0.55, 0, -3.3, 4, 1.8, 2);

  enfeite.add(aboboras.montar({ acesas: true }), pendurados.montar());

  // ========================================================= o MEZANINO
  const deCima = new THREE.Group();
  deCima.name = 'halloween-no-mezanino';
  superior.add(deCima);
  const aboborasDeCima = new LoteDeAboboras();
  const penduradosDeCima = new EnfeitesDePendurar();
  // as bandeirolas no corrimão da frente e no da direita
  const yCorrimao = ALTURA + 0.95;
  penduradosDeCima.varal(new THREE.Vector3(x0 + 0.3, yCorrimao, D / 2 - 0.12), new THREE.Vector3(W / 2 - 0.3, yCorrimao, D / 2 - 0.12), { barriga: 0.12, passo: 0.45 });
  penduradosDeCima.varal(new THREE.Vector3(W / 2 - 0.12, yCorrimao, z0 + 0.4), new THREE.Vector3(W / 2 - 0.12, yCorrimao, D / 2 - 0.3), { barriga: 0.12, passo: 0.45 });
  // e o varal de LANTERNAS DE PAPEL nas duas paredes (as de cima têm 2,3 m),
  // com três fantasminhas de pano pendurados nele
  const yVaral = ALTURA + 2.1;
  penduradosDeCima.varal(new THREE.Vector3(x0 + 0.4, yVaral, z0 + 0.2), new THREE.Vector3(planta.espelho.x - 1.45, yVaral, z0 + 0.2), { barriga: 0.3, passo: 0.42, lanternaACada: 3 });
  penduradosDeCima.varal(new THREE.Vector3(x0 + 0.2, yVaral, z0 + 0.4), new THREE.Vector3(x0 + 0.2, yVaral, D / 2 - 0.6), { barriga: 0.35, passo: 0.42, lanternaACada: 3 });
  for (const z of [-1.4, 1.2]) penduradosDeCima.fantasminha(x0 + 0.24, yVaral - 0.32, z, Math.PI / 2, 0.85);
  penduradosDeCima.fantasminha(-1.2, yVaral - 0.3, z0 + 0.25, 0, 0.85);
  // a teia de lã no canto do espelho, e as das paredes altas
  penduradosDeCima.teia(planta.espelho.x + 1.15, ALTURA + 2.2, planta.espelho.z + 0.06, 0, 0.42);
  penduradosDeCima.teia(x0 + 0.2, ALTURA + 1.8, z0 + 0.2, Math.PI / 4, 0.5, { aranha: false });
  penduradosDeCima.teia(x0 + 0.17, ALTURA + 1.75, 2.6, Math.PI / 2, 0.42);
  // as abóboras nos pódios das araras premium
  for (const [i, a] of planta.premium.entries()) {
    aboborasDeCima.por({ x: a.x + 0.62, y: ALTURA + 0.08, z: a.z + (i - 1) * 0.3, tamanho: i === 1 ? 'media' : 'pequena', cara: (['susto', 'sorriso', 'dentinho'] as const)[i], giro: 0.7 });
  }
  // o chapéu de bruxa na beira da mesa de chapéus
  const [mesaDeChapeus] = caixaDaPeca(superior, 'mesa-de-chapeus');
  {
    const chapeu = fundir(chapeuDeBruxa());
    chapeu.scale.setScalar(0.5);
    chapeu.position.set(planta.chapeus.x + 0.32, mesaDeChapeus ? mesaDeChapeus.min.y + 0.74 : ALTURA + 0.74, planta.chapeus.z + 0.28);
    chapeu.rotation.y = 0.9;
    deCima.add(chapeu);
  }
  // as lanterninhas de abóbora no balcão do ateliê de tinta
  const [atelie] = caixaDaPeca(superior, 'balcao-de-tingimento');
  const topoDoAtelie = atelie ? atelie.max.y : ALTURA + 0.92;
  aboborasDeCima.por({ x: planta.tingimento.x + 0.05, y: Math.min(topoDoAtelie, ALTURA + 1.0), z: planta.tingimento.z + 0.85, tamanho: 'pequena', cara: 'sorriso', giro: Math.PI / 2 });
  aboborasDeCima.por({ x: planta.tingimento.x + 0.05, y: Math.min(topoDoAtelie, ALTURA + 1.0), z: planta.tingimento.z - 0.85, tamanho: 'pequena', cara: 'piscando', giro: Math.PI / 2 });
  // AS BEXIGAS DE CAVEIRA de cima (pedido do Renan): ao lado do espelho, no
  // canto da direita e no cantinho do ateliê
  bexiga(deCima, planta.espelho.x - 1.75, ALTURA, z0 + 0.5, 5, 2.0, 3);
  bexiga(deCima, W / 2 - 0.65, ALTURA, 1.9, 5, 1.9, 4);
  bexiga(deCima, x0 + 0.6, ALTURA, 3.05, 4, 1.8, 5);
  deCima.add(aboborasDeCima.montar({ acesas: true }), penduradosDeCima.montar());
  const lanternasAcesas = penduradosDeCima.luzDasLanternas(0.6, ALTURA + 0.03);
  if (lanternasAcesas) deCima.add(lanternasAcesas);

  // ================================================ a ESTELLA e o PELUSA
  fantasiarEstellaDeAranha(estella);
  const pelusa = new Pelusa({ minX: planta.pufe.x, maxX: planta.pufe.x, minZ: planta.pufe.z, maxZ: planta.pufe.z });
  pelusa.group.position.set(planta.pufe.x, 0.47, planta.pufe.z);
  // de lado para a câmera: as asinhas (no lombo) e as orelhinhas aparecem juntas
  pelusa.group.rotation.y = -0.85;
  const dormir = pelusaMorceguinho(pelusa);
  terreo.add(pelusa.group);
  // dormindo, ele não mia: nem barulho, nem conversa (decisão do Renan)
  pelusa.aoSoar = null;

  // ================================================ o relógio
  let relogio = 0;
  let luzPosta = false;
  w.onUpdate((dt) => {
    // A LUZ DE HALLOWEEN (pedido do Renan: "está muito claro"): a loja de
    // sempre é clara de propósito; no evento, ela fica no lusco-fusco, com o
    // ambiente lilás meio apagado e a luz principal de vela — quem ilumina são
    // as abóboras, o lustre e as arandelas. No primeiro quadro: o céu que a
    // cena pede no `build` é o motor que põe, depois dele.
    if (!luzPosta) {
      luzPosta = true;
      g0.luzDoCeu({
        sky: P.boutiqueNoEscuroFundo,
        ambientColor: P.boutiqueNoEscuroAmbiente,
        ambientIntensity: 0.8,
        sunColor: P.boutiqueNoEscuroLuz,
        sunIntensity: 0.5,
      });
    }
    relogio += dt;
    if (pecas.andar() === 0) {
      pelusa.update(dt);
      pelusa.group.position.y = 0.47;
      dormir(dt);
      pendurados.update(dt);
      aboboras.tremer(relogio);
    } else {
      penduradosDeCima.update(dt);
      aboborasDeCima.tremer(relogio);
    }
    for (const b of bexigas) balancarBexigas(b, relogio);
  });

  // ================================== a conversa da Estella de aranha
  const FALAS_DE_ARANHA = [
    'Bem-vindos à minha teia… quer dizer, à minha boutique!',
    'Eu teço as minhas teias com fio de lã… e as minhas fantasias com fio de amor. Hihi.',
    'Os meus amigos estão guardando as outras fantasias. É só pedir doces ou travessuras!',
    'A primeira pista tá no mapinha, meus queridos. Lembram?',
    'Ficaram tão lindos que eu quase coloco vocês na vitrine. Quase.',
  ];
  let ultimaDeAranha = -1;
  pecas.conversar(async (api) => {
    if (!api.flag(FLAG_DO_PRESENTE)) return false;
    let i = Math.floor(w.rng() * FALAS_DE_ARANHA.length);
    if (i === ultimaDeAranha) i = (i + 1) % FALAS_DE_ARANHA.length;
    ultimaDeAranha = i;
    await api.say([FALAS_DE_ARANHA[i]], E);
    return true;
  });

  // ================================================= a CENA DO PRESENTE
  if (faseDoHalloween(g0) !== 'convite' || g0.flag(FLAG_DO_PRESENTE)) return;
  let comecou = false;
  w.onUpdate(() => {
    if (comecou) return;
    comecou = true;
    void cenaDoPresente();
  });

  const cenaDoPresente = async (): Promise<void> => {
    const g = g0;
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    // a loja fica quieta até o fim (decisão do Renan)
    const ligadas = pecas.interacoes.map((it) => it.enabled);
    for (const it of pecas.interacoes) it.enabled = false;
    pecas.pausarEstella(true);
    g.lockPlayer(true);
    g.bloquearTroca(true);
    try {
      // 1. ELA ESTÁ NO SALÃO, de costas para a porta, e vira devagar
      const chegada = { x: planta.porta.x, z: D / 2 - 1.5 };
      estella.group.position.set(chegada.x - 1.2, 0, chegada.z - 1.5);
      estella.group.rotation.y = -Math.PI / 2 - 0.4;
      void estella.irPara(estella.x, estella.z, 0.4);
      g.holdCompanion(estella.x, estella.z);
      await g.wait(0.9);
      estella.encarar(chegada.x, chegada.z);
      await g.wait(0.7);
      await conversa([[E, 'Ora, ora… quem caiu na minha teia?']]);
      await g.wait(0.6);
      g.som('balido');
      await conversa([
        [E, 'Brincadeira! Entrem, entrem, que a aranha aqui só morde biscoitinho.'],
        [A, 'Estella! Você tá de aranha!'],
        [R, 'A aranha mais fofa do parque inteiro.'],
        [E, 'Vem, vem, meus queridos. Eu tenho uma coisa pra vocês.'],
      ]);

      // 2. AS DUAS CAIXAS saem de trás do balcão
      await g.escurecerTela(true);
      estella.pararDeEncarar();
      estella.group.position.set(planta.caixa.x, 0, planta.caixa.z - 0.85);
      void estella.irPara(estella.x, estella.z);
      estella.encarar(planta.caixa.x, planta.caixa.z + 2);
      const frente = planta.caixa.z + 1.05;
      g.releasePlayer(planta.caixa.x - 0.45, frente, Math.PI);
      g.releaseCompanion(planta.caixa.x + 0.45, frente, Math.PI);
      g.holdCompanion(planta.caixa.x + 0.45, planta.caixa.z);
      const caixaDoAri = caixaDePresente(A, P.vampiroForro, P.vampiroCapa, P.halloweenLaranja);
      const caixaDoRenan = caixaDePresente(R, P.morceguinhoBarriga, P.morceguinhoFeltro, P.halloweenLaranja);
      const noBalcao = [caixaDoAri, caixaDoRenan];
      noBalcao.forEach((cx, i) => {
        cx.position.set(planta.caixa.x + (i ? 0.38 : -0.38), topoDoBalcao, planta.caixa.z + 0.05);
        cx.rotation.y = i ? -0.25 : 0.25;
        cx.scale.setScalar(0.001);
        terreo.add(cx);
      });
      await g.escurecerTela(false);
      estella.oferecerBiscoito(1.6);
      await g.wait(0.6);
      g.som('caixa');
      await crescer(noBalcao, 0.45);
      await conversa([
        [E, 'Oito patinhas, e todas costurando a semana inteira só pra vocês.'],
        [E, 'Uma pra cada um. O nome tá na etiqueta, ó.'],
        [R, 'O que será que tem dentro?'],
        [E, 'Nada de espiar! Abram só lá no provador.'],
      ]);

      // 3. CADA UM LEVA A SUA para um provador (a do Ari, a do Renan)
      const quemEhAri = g.playerId() === 'ari' ? g.playerId() : g.companionId();
      const quemEhRenan = quemEhAri === g.playerId() ? g.companionId() : g.playerId();
      for (const cx of noBalcao) cx.removeFromParent();
      g.segurarNaCena(quemEhAri, caixaDePresente(A, P.vampiroForro, P.vampiroCapa, P.halloweenLaranja), 'upright');
      g.segurarNaCena(quemEhRenan, caixaDePresente(R, P.morceguinhoBarriga, P.morceguinhoFeltro, P.halloweenLaranja), 'upright');
      g.som('pegar');
      await g.wait(0.9);
      await g.escurecerTela(true);
      // as duas cabines fechadas (a aberta é a do canto): cada um entra numa,
      // e a cortina esconde quem está lá dentro
      // os dois vão numa ÂNCORA dentro de cada cabine (a física não empurra
      // ninguém para fora do provador, e a cortina esconde)
      const fundoDaCabine = planta.provadores.x - 0.7;
      const cabines = [planta.provadores.z, planta.provadores.z - 1.2];
      const dentro = cabines.map((z) => {
        const a = new THREE.Object3D();
        a.position.set(fundoDaCabine, 0, z);
        terreo.add(a);
        return a;
      });
      g.ridePlayer(dentro[0], new THREE.Vector3(), 1, -Math.PI / 2);
      g.rideCompanion(dentro[1], new THREE.Vector3(), 1, -Math.PI / 2);
      estella.group.position.set(-2.75, 0, 2.3);
      void estella.irPara(estella.x, estella.z);
      estella.encarar(planta.provadores.x, planta.provadores.z - 0.6);
      const foco = new THREE.Object3D();
      foco.position.set(planta.provadores.x + 1.1, 1.2, planta.provadores.z + 0.2);
      terreo.add(foco);
      g.focusCamera(foco);
      g.setZoom(7.5);
      await g.escurecerTela(false);
      await g.wait(0.6);
      g.som('caixa');
      await g.wait(0.5);
      g.som('folhear');
      await g.wait(0.4);
      // A MEIA VOA por cima da cortina
      const meia = meiaQueVoa();
      terreo.add(meia);
      g.som('lancar');
      await voar(meia, new THREE.Vector3(planta.provadores.x - 0.1, 2.35, cabines[0]), new THREE.Vector3(planta.provadores.x + 0.85, 0.04, cabines[0] + 0.55), 1.1);
      await conversa([
        [R, 'Ops… a meia!'],
        [E, 'Quem jogou meia por cima da minha cortina?!'],
        [A, 'Foi sem querer! Tá quase!'],
      ]);
      g.som('folhear');
      await g.wait(0.6);

      // 4. SAEM INTEIROS FANTASIADOS — a surpresa é agora
      await g.escurecerTela(true);
      g.segurarNaCena(quemEhAri, null);
      g.segurarNaCena(quemEhRenan, null);
      for (const peca of [...FANTASIA_DE_VAMPIRO, ...FANTASIA_DE_MORCEGUINHO]) g.ganharPeca(peca);
      for (const peca of FANTASIA_DE_VAMPIRO) g.equipWearable(peca, 'ari');
      for (const peca of FANTASIA_DE_MORCEGUINHO) g.equipWearable(peca, 'renan');
      meia.removeFromParent();
      // saem no vão entre a ponta da arara e o cantinho, de frente para a câmera
      // (no corredor dos provadores a arara de frio taparia os dois)
      // lado a lado na tela (x − z diferentes): um não fica atrás do outro
      g.releasePlayer(-4.55, 2.65, Math.PI / 4);
      g.releaseCompanion(-3.65, 2.35, Math.PI / 4);
      g.holdCompanion(estella.x, estella.z);
      for (const a of dentro) a.removeFromParent();
      estella.encarar(-4.1, 2.5);
      foco.position.set(-3.6, 0.9, 2.4);
      await g.escurecerTela(false);
      g.som('coracao');
      g.soltarCoracoes(6);
      await g.wait(0.6);
      await conversa([
        [A, 'Eu sou um vampiro!'],
        [R, 'E eu sou um morceguinho!'],
      ]);
      estella.receberCarinho();
      g.som('balido');
      await conversa([
        [E, 'Muahaha! Ficaram perfeitos! Tão perfeitos que dá vontade de enrolar vocês num casulo e guardar na vitrine.'],
      ]);
      await g.wait(0.6);
      await conversa([
        [E, '…de mentirinha, tá?'],
        [E, 'Nenhuma fantasia sai daqui sem a minha aprovação… e estas eu APROVO!'],
      ]);

      // 5. A CESTINHA e o MAPINHA
      estella.oferecerBiscoito(1.8);
      await g.wait(0.8);
      g.addItem(ITENS.cestaDeAbobora);
      g.addItem(ITENS.mapinhaDaEstella);
      g.som('pegar');
      await conversa([
        [E, 'Tomem: uma cestinha de abóbora pra encher de balas. Quanto mais cheia, mais perto da surpresa…'],
        [E, 'E esse mapinha, com a primeira pista. É só segurar e ler.'],
        [E, 'E essas fantasias não são as únicas: os meus amigos estão guardando as outras. É só pedir doces ou travessuras!'],
        [E, 'Agora vão, que a noite é das aranhas… e dos amigos delas!'],
      ]);
      g.setFlag(FLAG_DO_PRESENTE);
      // e lá fora já é a noite da festa: o ônibus chega quando eles saírem
      avancarFase(g, 'festa');
      g.unlock({
        id: 'halloween-presente-da-estella',
        title: 'O presente da Estella',
        place: 'Boutique da Estella',
        note: 'A Estella de aranha costurou uma fantasia pra cada um e não contou nada: a gente abriu as caixas no provador e saiu de lá vampiro e morceguinho. Uma meia voou por cima da cortina.',
        icon: '🧛',
      });
      foco.removeFromParent();
    } finally {
      g.focusCamera(null);
      g.setZoom(10);
      g.freeCompanion();
      g.bloquearTroca(false);
      g.lockPlayer(false);
      estella.pararDeEncarar();
      pecas.interacoes.forEach((it, i) => { it.enabled = ligadas[i]; });
      // ela volta para a RONDA por um caminho livre: do lado do pátio, pela
      // ponta da arara das calças, até a parada "na frente da arara das
      // calças" (0; 4,3) — em linha reta ela atravessaria a arara
      void (async () => {
        await estella.irPara(-2.85, 4.3);
        await estella.irPara(0, 4.3);
        pecas.pausarEstella(false);
      })();
    }
  };

  /** as caixas aparecem em cima do balcão, crescendo com um pulinho */
  const crescer = (objs: THREE.Object3D[], dur: number): Promise<void> => new Promise((pronto) => {
    let t = 0;
    const tique = (dt: number): void => {
      if (t >= dur) return;
      t = Math.min(dur, t + dt);
      const k = t / dur;
      const pulo = 1 + Math.sin(k * Math.PI) * 0.25;
      for (const o of objs) o.scale.setScalar(Math.max(0.001, k * pulo));
      if (t >= dur) pronto();
    };
    w.onUpdate(tique);
  });

  /** a meia num arco por cima da cortina, girando, até cair no chão */
  const voar = (obj: THREE.Object3D, de: THREE.Vector3, ate: THREE.Vector3, dur: number): Promise<void> => new Promise((pronto) => {
    let t = 0;
    obj.position.copy(de);
    const tique = (dt: number): void => {
      if (t >= dur) return;
      t = Math.min(dur, t + dt);
      const k = t / dur;
      obj.position.lerpVectors(de, ate, k);
      obj.position.y += Math.sin(k * Math.PI) * 0.7;
      obj.rotation.set(k * 7, k * 3, k * 5);
      if (t >= dur) {
        obj.rotation.set(Math.PI / 2, 0.4, 0);
        pronto();
      }
    };
    w.onUpdate(tique);
  });
}

