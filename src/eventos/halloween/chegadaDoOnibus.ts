import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Bicho } from '../../entities/bichos/Bicho';
import type { Gina } from '../../entities/bichos/Gina';
import type { Walter } from '../../entities/bichos/Walter';
import type { Flynn } from '../../entities/bichos/Flynn';
import type { CoelhaDaTorcida } from '../../entities/bichos/CoelhaDaTorcida';
import type { OnibusDaCidade } from '../../world/onibusDaCidade';
import { ARI, RENAN } from '../../characters/cast';
import { FLAG_DO_ONIBUS } from './fase';

/*
 * A CHEGADA DO ÔNIBUS DA FESTA (`docs/HALLOWEEN.md`, §2.4.1, B): a primeira
 * vez que a dupla pisa no parque na noite da festa (saindo da boutique,
 * vestidos de vampiro e de morceguinho), a turma do clube e da escola chega
 * de ônibus — todos fantasiados, cada um descendo do jeito dele.
 *
 * A cena, em tomadas (o relógio é o do JOGO, num `w.onUpdate`: nunca o
 * `g.wait`, que é de parede — num celular lento a câmera e o ônibus
 * chegariam em tempos diferentes):
 *
 *  1. a dupla na calçada da boutique, de noite ("Já anoiteceu?!");
 *  2. a BUZINA ao longe, e a câmera VOA por cima do parque aceso — a
 *     barraquinha, a roda, a alameda — até o ponto de ônibus (são uns 75 m;
 *     a dupla fica esperando, como na tomada de cena da clareira);
 *  3. o ônibus chega pela rua com o farol aceso e a poça de luz andando na
 *     frente dele, freia (o nariz mergulha e volta, amortecendo), o
 *     pisca-alerta pisca e a porta abre com o sopro de ar;
 *  4. descem um por um, e cada um para na calçada, fala no jeito da fantasia
 *     dele (a câmera chega perto) e sai pelo vão da cerca para o parque: a
 *     Gina abaixando o pescoço na porta (e o véu enganchando), o Capy
 *     apitando, o Noel correndo, o Walter de bandeja, o Gatito latindo para o
 *     Walter, o Flynn pulando o degrau inteiro, as três coelhinhas juntas e,
 *     por último, a Josefina, devagarinho, agradecendo o motorista;
 *  5. a porta fecha, a tela escurece um instante, e a câmera volta para a
 *     dupla — com todo mundo já nos postos da festa;
 *  6. vira memória ("A noite da festa").
 *
 * O ÔNIBUS é o detalhado (`world/onibusDaCidade.ts`), que os postos da
 * festa põem no lugar do de sempre do ponto: a cena só usa os comandos dele
 * (a porta, as rodas, o farol e o pisca-alerta). As falas são RASCUNHOS (o
 * Renan troca).
 */

/** quem desce do ônibus (os postos da festa montam, a chegada só empresta) */
export interface ElencoDoOnibus {
  gina: Gina;
  capy: Bicho;
  noel: Bicho;
  walter: Walter;
  gatito: Bicho & { sixSeven(): void };
  flynn: Flynn;
  josefina: Bicho;
  /** a Luna, a Sol e a Estrella (do piquenique), se estão no parque */
  coelhinhas: CoelhaDaTorcida[];
  /** põe o Walter no caixote da barraca (o posto dele) */
  walterNaBarraca: () => void;
  /** o ônibus do ponto na noite da festa (o detalhado, `world/onibusDaCidade.ts`) */
  onibus: OnibusDaCidade;
}

/** onde o ônibus para (o de sempre do ponto: `scenes/villaLobos.ts`) e de onde ele vem */
const ONIBUS = { x: 39.5, z: 10.4, deLonge: -30 };
/** a porta da frente: o vão no mundo, o degrau e o chão da rua embaixo dela */
const PORTA = { x: 38.3, z: 13.0, degrau: 0.56, beira: 38.02, rua: 37.3 };
/** onde quem desce para e fala, na calçada, e o vão da cerca por onde sai para o parque */
const CALCADA = { x: 35.55, z: 13.0 };
const VAO = [new THREE.Vector3(33.2, 0, 13.0), new THREE.Vector3(31.2, 0, 13.0)];
/** a entrada da boutique (`da-lojinha`): de onde a dupla vê a noite */
const BOUTIQUE = { x: -33.6, z: -16.5 };

/** a tomada da porta do ônibus, de dentro da calçada: a porta, o degrau e a calçada */
const TOMADA_DA_PORTA = { de: new THREE.Vector3(34.85, 2.0, 16.25), para: new THREE.Vector3(37.5, 1.2, 12.5) };
/**
 * onde o voo termina: na calçada, logo ao sul do abrigo (que vai de `z`
 * 16,7 a 21,3), olhando a rua para trás, de onde o ônibus vem. O voo chega
 * pelo corredor do vão da cerca (`z ≈ 12`): a fileira de árvores de `z`
 * 18 a 20 fica de lado — a primeira versão terminava dentro de uma delas
 */
const FIM_DO_VOO = { de: new THREE.Vector3(35.3, 3.3, 15.9), para: new THREE.Vector3(38.8, 1.5, -4) };

interface Tomada {
  de: THREE.Vector3;
  para: THREE.Vector3;
}

/** uma câmera andando: de onde e para onde ela olha em cada ponto do caminho (0 a 1) */
interface Voo {
  de: (k: number) => THREE.Vector3;
  para: (k: number) => THREE.Vector3;
  dura: number;
  t: number;
  curva: (t: number) => number;
  fim: () => void;
}

const suave = (t: number): number => t * t * (3 - 2 * t);
/** sai devagar, cruza ligeiro e chega devagar (o voo por cima do parque) */
const suaveDeVoo = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function chegadaDoOnibus(w: WorldBuilder, elenco: ElencoDoOnibus): void {
  const g0 = w.game;
  if (g0.flag(FLAG_DO_ONIBUS)) return;
  const A = ARI.name;
  const R = RENAN.name;

  // ---------------------------------------------------------------- o ônibus
  const onibus = elenco.onibus;
  const bus = onibus.group;

  // ------------------------------------------- quem desce, guardado e escondido
  interface Guardado { b: Bicho; pos: THREE.Vector3; giro: number; sentado: boolean }
  const passageiros: Bicho[] = [elenco.gina, elenco.capy, elenco.noel, elenco.walter, elenco.gatito, elenco.flynn, ...elenco.coelhinhas, elenco.josefina];
  const guardados: Guardado[] = passageiros.map((b) => ({
    b, pos: b.group.position.clone(), giro: b.group.rotation.y, sentado: elenco.coelhinhas.includes(b as CoelhaDaTorcida),
  }));
  /**
   * quem ainda está dentro do ônibus: escondido A CADA QUADRO, e não uma vez
   * — o piquenique do parque acende as coelhinhas no primeiro quadro dele
   */
  const noOnibus = new Set<Bicho>(passageiros);
  for (const b of passageiros) {
    b.entrarEmServico();
    b.group.visible = false;
  }
  // o ônibus começa lá longe, na rua (a cena o traz)
  bus.position.z = ONIBUS.deLonge;

  // --------------------------------------------------- o relógio da cena
  const esperas: Array<{ falta: number; pronto: () => void }> = [];
  const esperar = (s: number): Promise<void> => new Promise((pronto) => { esperas.push({ falta: s, pronto }); });
  const tiques: Array<(dt: number) => boolean> = [];
  /** roda `f` todo quadro até ela devolver `true` */
  const aCadaQuadro = (f: (dt: number) => boolean): void => { tiques.push(f); };

  // ------------------------------------------------------------- a câmera
  const camera: Tomada = { de: new THREE.Vector3(), para: new THREE.Vector3() };
  let voo: Voo | null = null;
  /** quando o voo acaba, a câmera fica olhando para isto (o ônibus chegando) */
  let olharPara: (() => THREE.Vector3) | null = null;
  const voar = (de: (k: number) => THREE.Vector3, para: (k: number) => THREE.Vector3, dura: number, curva = suave): Promise<void> =>
    new Promise((fim) => {
      voo?.fim();
      voo = { de, para, dura, t: 0, curva, fim };
    });
  /** desliza em linha reta da tomada de agora até `ate` */
  const deslizar = (ate: Tomada, dura: number): Promise<void> => {
    const de0 = camera.de.clone();
    const para0 = camera.para.clone();
    olharPara = null;
    return voar((k) => de0.clone().lerp(ate.de, k), (k) => para0.clone().lerp(ate.para, k), dura);
  };

  /** onde a isométrica está agora (a de perspectiva nasce no mesmo enquadramento) */
  const tomadaDaIsometrica = (api: GameAPI): Tomada => {
    const p = api.playerPosition();
    const giro = api.anguloDaCamera();
    const inclina = THREE.MathUtils.degToRad(34);
    const d = 11.7;
    return {
      para: new THREE.Vector3(p.x, 1.0, p.z),
      de: new THREE.Vector3(p.x + Math.sin(giro) * Math.cos(inclina) * d, 1.0 + Math.sin(inclina) * d, p.z + Math.cos(giro) * Math.cos(inclina) * d),
    };
  };

  /**
   * A TOMADA DE PERTO de quem fala na calçada (a mesma régua da conversa da
   * festa): do lado do PARQUE, pelo vão da cerca, com o ônibus de porta
   * aberta no fundo do quadro — na altura do peito e na distância que a
   * altura pede. Quem é mais alto que a dupla (a Gina) é filmado na altura
   * do olho, para a altura aparecer. (A primeira versão vinha do lado do
   * abrigo do ponto, e a Gina falou atrás do vidro dele.)
   */
  const deFrente = (bichos: Bicho[], afasta = 0): Tomada => {
    const caixa = new THREE.Box3();
    for (const b of bichos) caixa.expandByObject(b.group);
    const meio = caixa.getCenter(new THREE.Vector3());
    const alto = Math.max(0.6, caixa.max.y - Math.max(0, caixa.min.y));
    const largo = Math.max(caixa.max.x - caixa.min.x, caixa.max.z - caixa.min.z);
    const d = THREE.MathUtils.clamp(alto * 1.1 + 0.9, 1.9, 5.2) + Math.max(0, largo - 0.8) * 0.9 + afasta;
    // o olhar um pouco abaixo do meio do corpo: quem fala sobe no quadro, por cima da caixa de fala
    const para = new THREE.Vector3(meio.x, Math.max(0, caixa.min.y) + alto * 0.42, meio.z);
    // do vão da cerca, um tico para o norte: a porta do ônibus fica no fundo, à direita
    const dir = new THREE.Vector2(-1, 0.32).normalize();
    // e de pouco acima (de cima demais, os pequenos viravam um chapéu na calçada)
    const altura = alto > 1.9 ? Math.min(1.6, para.y + d * 0.1) : para.y + d * 0.16 + 0.12;
    return { para, de: new THREE.Vector3(meio.x + dir.x * d, altura, meio.z + dir.y * d) };
  };

  // --------------------------------------------------------------- a porta
  /** a porta da frente abrindo (1) ou fechando (0), com o sopro de ar */
  let aberta = 0;
  const porta = (abrir: boolean): Promise<void> => {
    g0.som('portaDoOnibus');
    return new Promise((pronto) => aCadaQuadro((dt) => {
      aberta = THREE.MathUtils.clamp(aberta + (abrir ? dt : -dt) / 0.55, 0, 1);
      onibus.porta(suave(aberta));
      const fim = abrir ? aberta >= 1 : aberta <= 0;
      if (fim) pronto();
      return fim;
    }));
  };

  // ------------------------------------------------------------ a chegada
  /*
   * O ÔNIBUS CHEGA desacelerando (sai rápido e para devagar), e no fim o
   * nariz MERGULHA e volta, amortecendo — o tranco de ônibus parando. O
   * mergulho é o `rotation.z` da peça (o nariz dela é o `+X`): negativo
   * leva o nariz para baixo. O motor ronca em fila no caminho, e o freio de
   * ar solta o "pssshh" na parada.
   */
  const CHEGADA = 9;
  const chegar = (): Promise<void> => new Promise((pronto) => {
    let t = 0;
    let ateRoncar = 0;
    let freou = false;
    let parado = -1;
    aCadaQuadro((dt) => {
      t += dt;
      const k = Math.min(1, t / CHEGADA);
      // o freio entra mais forte no fim: quadrática pela metade, cúbica no resto
      const anda = 1 - Math.pow(1 - k, 2.4);
      const antes = bus.position.z;
      bus.position.z = ONIBUS.deLonge + (ONIBUS.z - ONIBUS.deLonge) * anda;
      // as rodas giram o que ele andou (o nariz dele, o `+X`, é o `+Z` do mundo)
      onibus.rodar(bus.position.z - antes);
      if (k < 1) {
        ateRoncar -= dt;
        if (ateRoncar <= 0) {
          g0.som('motorDoOnibus');
          ateRoncar = 0.55 + k * 0.35;
        }
        // freando, o nariz já começa a descer
        bus.rotation.z = -0.014 * THREE.MathUtils.smoothstep(k, 0.7, 1);
        if (!freou && k > 0.9) {
          freou = true;
          g0.som('freioDoOnibus');
        }
        return false;
      }
      if (parado < 0) {
        parado = 0;
        pronto();
      }
      parado += dt;
      // a mola: mergulha mais um tico, volta e passa, e assenta
      bus.rotation.z = -0.022 * Math.exp(-2.6 * parado) * Math.cos(6.5 * parado + 0.5);
      if (parado > 2.2) {
        bus.rotation.z = 0;
        return true;
      }
      return false;
    });
  });

  // ---------------------------------------------------------- os passageiros
  /** um pulo com o corpo num arco (o Walter faz a pose; os outros vão no pulo) */
  const pular = (b: Bicho, ate: THREE.Vector3, dura: number, arco: number): Promise<void> => new Promise((pronto) => {
    const de = b.group.position.clone();
    b.group.rotation.y = Math.atan2(ate.x - de.x, ate.z - de.z);
    let t = 0;
    aCadaQuadro((dt) => {
      t = Math.min(1, t + dt / dura);
      b.group.position.lerpVectors(de, ate, t);
      b.group.position.y += arco * 4 * t * (1 - t);
      if (b === elenco.walter) elenco.walter.salto = t >= 1 ? 0 : Math.max(0.001, t);
      if (t >= 1) {
        b.group.position.copy(ate);
        pronto();
        return true;
      }
      return false;
    });
  });
  /** ele aparece no vão da porta, no degrau, olhando para a calçada */
  const naPorta = (b: Bicho, z = PORTA.z): void => {
    noOnibus.delete(b);
    b.entrarEmServico();
    b.group.visible = true;
    b.group.position.set(PORTA.x, PORTA.degrau, z);
    b.group.rotation.y = -Math.PI / 2;
  };
  /** desce do jeito de sempre: um passo até a beira do degrau, o pulinho para a rua e a calçada */
  const descer = async (b: Bicho, ate: { x: number; z: number }, jeito: { vel?: number; pulo?: number; arco?: number } = {}): Promise<void> => {
    const z = b.group.position.z;
    await b.irPara(PORTA.beira, z, jeito.vel ?? 0.9);
    await pular(b, new THREE.Vector3(PORTA.rua, 0, z), jeito.pulo ?? 0.42, jeito.arco ?? 0.22);
    await b.irPara(ate.x, ate.z, jeito.vel ?? 0.9);
  };
  /** a cena acabou (todo mundo já foi posto no posto da festa) */
  let acabou = false;
  /** sai pelo vão da cerca e some (os postos o recebem no fim da cena) */
  const irEmbora = (b: Bicho, vel = 1.0): void => {
    void (async () => {
      b.pararDeEncarar();
      for (const p of VAO) {
        await b.irPara(p.x, p.z, vel);
        if (acabou) return;
      }
      b.group.visible = false;
    })();
  };
  /** quem fala olha para a câmera */
  const olharACamera = (b: Bicho): void => b.encarar(camera.de.x, camera.de.z);
  const conversa = async (falas: ReadonlyArray<readonly [string, string]>): Promise<void> => {
    for (const [quem, texto] of falas) await g0.say([texto], quem);
  };

  // --------------------------------------------------------------- a cena
  const cena = async (api: GameAPI): Promise<void> => {
    api.lockPlayer(true);
    api.bloquearTroca(true);
    const eu = api.playerPosition();
    api.holdCompanion(eu.x + 1, eu.z);
    const naBoutique = Math.hypot(eu.x - BOUTIQUE.x, eu.z - BOUTIQUE.z) < 7;
    const iso = tomadaDaIsometrica(api);
    camera.de.copy(iso.de);
    camera.para.copy(iso.para);
    api.setCameraOmbro(camera.de, camera.para);
    try {
      // 1. a dupla na calçada da boutique, de noite
      // na boutique, os dois um passo para o lado da porta, e a câmera vem do
      // outro lado, rente à fachada: de frente para a porta, a guirlanda
      // pendurada nela ficava em cima da cabeça de quem estivesse na frente
      if (naBoutique) {
        api.releasePlayer(BOUTIQUE.x + 0.35, BOUTIQUE.z + 0.9, Math.PI / 2);
        api.releaseCompanion(BOUTIQUE.x + 0.3, BOUTIQUE.z + 1.7, Math.PI / 2);
        api.holdCompanion(BOUTIQUE.x + 4, BOUTIQUE.z + 1.3);
      }
      const daDupla: Tomada = naBoutique
        ? { de: new THREE.Vector3(BOUTIQUE.x + 2.9, 1.3, BOUTIQUE.z - 1.9), para: new THREE.Vector3(BOUTIQUE.x + 0.3, 1.25, BOUTIQUE.z + 1.3) }
        : (() => {
          const giro = api.anguloDaCamera();
          return {
            de: new THREE.Vector3(eu.x + Math.sin(giro) * 3.6, 1.6, eu.z + Math.cos(giro) * 3.6),
            para: new THREE.Vector3(eu.x, 1.15, eu.z),
          };
        })();
      await deslizar(daDupla, 1.4);
      if (naBoutique) {
        await conversa([
          [R, 'Já anoiteceu?! A gente ficou quanto tempo lá dentro?'],
          [A, 'O suficiente pra ficar lindo.'],
        ]);
      }
      await esperar(0.5);

      // 2. a buzina ao longe, e o voo por cima do parque até o ponto
      api.som('buzina');
      await esperar(0.9);
      await conversa([
        [A, 'Ouviu isso? Uma buzina!'],
        [R, 'Lá do ponto de ônibus. Deve ser a turma chegando pra festa!'],
      ]);
      const caminho = new THREE.CatmullRomCurve3([
        daDupla.de.clone(),
        new THREE.Vector3(daDupla.de.x + 4, 6.5, daDupla.de.z + 5),
        new THREE.Vector3(-12, 13, -1),
        new THREE.Vector3(6, 14, 7),
        new THREE.Vector3(21, 9.5, 11),
        new THREE.Vector3(29, 5.2, 12.4),
        FIM_DO_VOO.de.clone(),
      ]);
      const olhar = new THREE.CatmullRomCurve3([
        daDupla.para.clone(),
        new THREE.Vector3(-22, 2, -16),
        new THREE.Vector3(-6, 3, -13),
        new THREE.Vector3(14, 2, 2),
        new THREE.Vector3(30, 1.5, 9),
        new THREE.Vector3(37.5, 1.5, 4),
        FIM_DO_VOO.para.clone(),
      ]);
      // o ônibus sai lá de longe no meio do voo, para chegar logo depois dele
      let rodando = false;
      const VOO = 8.5;
      void esperar(VOO - 4.5).then(() => {
        rodando = true;
        onibus.acenderFarois(true);
        void chegar();
      });
      await voar((k) => caminho.getPointAt(k), (k) => olhar.getPointAt(k), VOO, suaveDeVoo);
      // 3. a câmera fica no ponto, acompanhando o ônibus que chega
      const fimDoVoo = camera.para.clone();
      let segue = 0;
      olharPara = () => {
        const alvo = new THREE.Vector3(bus.position.x - 1.4, 1.5, bus.position.z + 3.2);
        segue = Math.min(1, segue + 0.02);
        return fimDoVoo.clone().lerp(alvo, suave(segue));
      };
      while (!rodando || bus.position.z < ONIBUS.z - 0.01) await esperar(0.1);
      onibus.piscaAlerta(true);
      await esperar(1.2);
      // a porta abre (a câmera vai para a calçada, de frente para ela)
      await deslizar(TOMADA_DA_PORTA, 1.6);
      await porta(true);
      await esperar(0.4);

      // 4a. A GINA: a mais alta, abaixando o pescoço para caber na porta
      const { gina, capy, noel, walter, gatito, flynn, josefina, coelhinhas } = elenco;
      const G = 'Gina';
      naPorta(gina);
      gina.abaixarDeUmaVez(1);
      await esperar(0.6);
      await conversa([[G, 'Licença, licença… abaixa, Gina. Abaixa…']]);
      await gina.irPara(PORTA.beira, PORTA.z, 0.5);
      await conversa([[G, 'Ai! O véu! Enganchou no ônibus de novo!']]);
      await esperar(0.5);
      await pular(gina, new THREE.Vector3(PORTA.rua, 0, PORTA.z), 0.55, 0.12);
      gina.abaixar = 0;
      await gina.irPara(CALCADA.x, CALCADA.z - 0.3, 0.5);
      await deslizar(deFrente([gina]), 1.1);
      olharACamera(gina);
      gina.receberCarinho();
      await conversa([
        [G, 'Pronto! A noiva chegou. Atrasada, como toda noiva que se preze.'],
        [G, 'E a fantasia mais alta da festa, como eu prometi. Viu?'],
      ]);
      irEmbora(gina, 0.6);
      await deslizar(TOMADA_DA_PORTA, 1.0);

      // 4b. O CAPY: o salva-vidas de tubarão, organizando a descida no apito
      const CP = 'Capy';
      naPorta(capy);
      api.som('apito');
      await esperar(0.5);
      await descer(capy, CALCADA, { vel: 0.8 });
      await deslizar(deFrente([capy]), 0.9);
      olharACamera(capy);
      await conversa([
        [CP, 'Tum-tum… tum-tum… tum-tum-tum-tum…'],
        [CP, 'Todo mundo descendo com calma, um de cada vez! Tubarão também respeita a fila.'],
      ]);
      api.som('apito');
      irEmbora(capy, 0.8);
      await deslizar(TOMADA_DA_PORTA, 0.9);

      // 4c. O NOEL: cientista, CORRENDO, que o experimento não espera
      const N = 'Noel';
      naPorta(noel);
      await esperar(0.15);
      await descer(noel, CALCADA, { vel: 2.6, pulo: 0.3, arco: 0.3 });
      await deslizar(deFrente([noel]), 0.6);
      olharACamera(noel);
      await conversa([
        [N, 'CHEGUEI! Licença, licença! Tem uma poção no fogo desde a hora do almoço!'],
        [N, 'Se ela borbulhar sem mim, o experimento não vale! CORRENDO!'],
      ]);
      irEmbora(noel, 3.0);
      await deslizar(TOMADA_DA_PORTA, 0.8);

      // 4d. O WALTER: de múmia, de bandeja, e com a barraca esperando por ele
      const W = 'Walter';
      naPorta(walter);
      await esperar(0.4);
      await walter.irPara(PORTA.beira, PORTA.z, 0.7);
      await pular(walter, new THREE.Vector3(PORTA.rua, 0, PORTA.z), 0.45, 0.22);
      await walter.irPara(CALCADA.x, CALCADA.z - 0.5, 0.8);
      await deslizar(deFrente([walter], 0.3), 0.9);
      olharACamera(walter);
      api.som('latido');
      await conversa([
        [W, 'Au! Au!'],
        [N, 'Ele disse que a barraca de cachorro-quente abre em cinco minutos! CORRE, WALTER!'],
        [W, 'Au!'],
      ]);
      // ele vai indo… e para, quando escuta um latido atrás dele
      const ESPERA_DO_WALTER = { x: 34.35, z: 12.4 };
      void walter.irPara(ESPERA_DO_WALTER.x, ESPERA_DO_WALTER.z, 0.7);
      await deslizar(TOMADA_DA_PORTA, 0.9);

      // 4e. O GATITO: veio DE WALTER (a fantasia engraçada), e late para o original
      const GT = 'Gatito';
      naPorta(gatito);
      await esperar(0.4);
      await descer(gatito, { x: CALCADA.x, z: CALCADA.z + 0.35 }, { vel: 0.8 });
      gatito.encarar(walter.x, walter.z);
      await conversa([[GT, 'Au.']]);
      walter.encarar(gatito.x, gatito.z);
      await deslizar(deFrente([gatito, walter], 0.2), 1.0);
      api.som('latido');
      await conversa([
        [W, 'Au?'],
        [GT, '… Au.'],
      ]);
      walter.receberCarinho();
      api.som('latido');
      await conversa([
        [W, 'Au! Au!'],
        [GT, 'Eu vim de Walter. Acho que ele aprovou.'],
      ]);
      gatito.sixSeven();
      await esperar(1.2);
      walter.levantar();
      irEmbora(walter, 0.9);
      irEmbora(gatito, 0.8);
      await deslizar(TOMADA_DA_PORTA, 0.9);

      // 4f. O FLYNN: lobisomem e atleta — pula o degrau inteiro
      const F = 'Flynn';
      naPorta(flynn);
      await esperar(0.35);
      await pular(flynn, new THREE.Vector3(36.6, 0, PORTA.z), 0.8, 0.9);
      flynn.comemorar(1.8);
      await flynn.irPara(CALCADA.x, CALCADA.z, 1.1);
      await deslizar(deFrente([flynn]), 0.8);
      olharACamera(flynn);
      await conversa([
        [F, 'AUUUUUUUUU!'],
        [F, 'Pulei o degrau inteiro! Lobisomem não desce escada. Vão, Gatitos!'],
      ]);
      flynn.correr(true);
      irEmbora(flynn, 2.2);
      await deslizar(TOMADA_DA_PORTA, 0.8);

      // 4g. AS TRÊS COELHINHAS, juntas: a coruja, a catrina e a fadinha
      if (coelhinhas.length) {
        const lugares = [{ x: CALCADA.x + 0.1, z: CALCADA.z - 0.7 }, { x: CALCADA.x - 0.15, z: CALCADA.z }, { x: CALCADA.x + 0.1, z: CALCADA.z + 0.7 }];
        const descendo = coelhinhas.map(async (c, i) => {
          c.levantar();
          await esperar(i * 0.7);
          naPorta(c);
          await esperar(0.3);
          await descer(c, lugares[i], { vel: 0.85, pulo: 0.36, arco: 0.26 });
        });
        await Promise.all(descendo);
        await deslizar(deFrente(coelhinhas, 0.3), 1.0);
        for (const c of coelhinhas) olharACamera(c);
        const [luna, sol, estrella] = coelhinhas;
        if (luna) {
          luna.torcer(1.6);
          await conversa([['Luna', '¡Uh-uh! ¡Llegamos, panas! A coruja chegou acordadíssima!']]);
        }
        if (sol) {
          sol.saltar();
          await conversa([['Sol', '¡Épale! ¡Miren el parque, todo prendido! ¡Qué fino!']]);
        }
        if (estrella) {
          await conversa([
            ['Estrella', 'Ninguém esqueceu nada no ônibus? As penas, a coroa, a varinha…'],
            ['Sol', '¡Todo bien, hermanita!'],
            ['Estrella', 'Então tá. Agora sim: estrelinha de fada!'],
          ]);
          estrella.estrelinha(1);
          await esperar(1.8);
        }
        for (const c of coelhinhas) irEmbora(c, 0.9);
        await deslizar(TOMADA_DA_PORTA, 0.9);
      }

      // 4h. A JOSEFINA, por último e devagarinho — o motorista espera
      const JS = 'Josefina';
      await esperar(1.2);
      naPorta(josefina);
      await esperar(0.9);
      // ainda no degrau, ela vira para dentro e agradece o motorista
      await josefina.irPara(PORTA.beira + 0.06, PORTA.z, 0.42);
      josefina.encarar(PORTA.x + 3, PORTA.z - 2.4);
      await esperar(0.7);
      await conversa([[JS, 'Obrigada, motorista. Pode ir com calma, que a noite é longa.']]);
      josefina.pararDeEncarar();
      await descer(josefina, CALCADA, { vel: 0.42, pulo: 0.8, arco: 0.08 });
      await deslizar(deFrente([josefina]), 1.1);
      olharACamera(josefina);
      await conversa([[JS, 'Ah… o parque de noite. Valeu cada abóbora que eu plantei.']]);
      irEmbora(josefina, 0.45);

      // 5. a porta fecha, o pisca apaga
      await deslizar(TOMADA_DA_PORTA, 1.0);
      await porta(false);
      await esperar(0.6);
      onibus.piscaAlerta(false);
      onibus.acenderFarois(false);
      await esperar(0.5);

      // a tela escurece, todo mundo já está nos postos, e a câmera volta para a dupla
      await api.escurecerTela(true);
      acabou = true;
      noOnibus.clear();
      for (const gd of guardados) {
        const b = gd.b;
        b.group.visible = true;
        b.group.position.copy(gd.pos);
        b.group.rotation.y = gd.giro;
        if (gd.sentado) b.sentarEm(gd.pos.x, gd.pos.z, gd.giro, gd.pos.y);
        else if (b !== elenco.walter) b.voltarAPassear();
      }
      gina.abaixar = 0;
      flynn.correr(false);
      elenco.walterNaBarraca();
      camera.de.copy(daDupla.de);
      camera.para.copy(daDupla.para);
      voo = null;
      olharPara = null;
      api.setCameraOmbro(camera.de, camera.para);
      api.setFlag(FLAG_DO_ONIBUS);
      await esperar(0.3);
      await api.escurecerTela(false);
      await conversa([
        [R, 'Era o ônibus da festa! Chegou todo mundo.'],
        [api.playerName(), 'Vamos atrás da primeira pista?'],
      ]);
      api.unlock({
        id: 'halloween-a-noite-da-festa',
        title: 'A noite da festa',
        place: 'Parque Villa Lobos',
        note: 'A gente saiu da boutique e já era noite. Aí o ônibus buzinou, e desceu todo mundo fantasiado: a Gina enganchou o véu na porta, o Gatito latiu pro Walter, e a Josefina agradeceu o motorista.',
        icon: '🚌',
      });
      await deslizar(tomadaDaIsometrica(api), 1.0);
    } finally {
      // se algo der errado no meio, ninguém fica preso: tudo no lugar da festa
      if (!api.flag(FLAG_DO_ONIBUS)) {
        acabou = true;
        noOnibus.clear();
        for (const gd of guardados) {
          gd.b.group.visible = true;
          gd.b.group.position.copy(gd.pos);
          gd.b.group.rotation.y = gd.giro;
          if (gd.sentado) gd.b.sentarEm(gd.pos.x, gd.pos.z, gd.giro, gd.pos.y);
          else if (gd.b !== elenco.walter) gd.b.voltarAPassear();
        }
        elenco.walterNaBarraca();
        onibus.piscaAlerta(false);
        onibus.acenderFarois(false);
        api.setFlag(FLAG_DO_ONIBUS);
        void api.escurecerTela(false);
      }
      bus.position.z = ONIBUS.z;
      bus.rotation.z = 0;
      onibus.porta(0);
      voo = null;
      api.setCameraOmbro(null);
      api.freeCompanion();
      api.bloquearTroca(false);
      api.lockPlayer(false);
    }
  };

  // ------------------------------------------------------------ o relógio
  let comecou = false;
  w.onUpdate((dt) => {
    if (!comecou) {
      comecou = true;
      void cena(g0);
    }
    for (let i = esperas.length - 1; i >= 0; i--) {
      esperas[i].falta -= dt;
      if (esperas[i].falta <= 0) {
        const e = esperas.splice(i, 1)[0];
        e.pronto();
      }
    }
    for (let i = tiques.length - 1; i >= 0; i--) if (tiques[i](dt)) tiques.splice(i, 1);
    for (const b of noOnibus) b.group.visible = false;
    const v = voo;
    if (v) {
      v.t = Math.min(1, v.t + dt / v.dura);
      const k = v.curva(v.t);
      camera.de.copy(v.de(k));
      camera.para.copy(v.para(k));
      if (v.t >= 1) {
        voo = null;
        v.fim();
      }
    } else if (olharPara) {
      camera.para.copy(olharPara());
    }
    if (comecou && (voo || olharPara)) g0.setCameraOmbro(camera.de, camera.para);
  });
}
