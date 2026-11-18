import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { Gatito } from '../entities/bichos/Gatito';
import { ARI, RENAN } from '../characters/cast';
import {
  ArcoIrisNaNevoa, BrilhosDeLimpo, GotasSoltas, JatoDeMangueira, MangueiraSolta, esponjaDeMao, manchaDeEspuma, pistolaDeMangueira,
} from '../world/lavagemDoOnibus';

/**
 * ===================================== O MUTIRÃO DA LAVAGEM
 *
 * Pedido do Renan (2026-11-18): "ao falar com o Gatito lavando o ônibus, a gente pode ajudar: um pega a esponja e o
 * outro a mangueira, e tem uma animação de nós três lavando — divertida, muito bem feita e polida".
 *
 * A CENA, no relógio do jogo (o `relogioDaCena`: o teste acelera pelo `ritmoDoPresente`):
 *  1. quem joga escolhe quem fica com a MANGUEIRA; o outro pega a esponja reserva do balde;
 *  2. a tela pisca e os três estão no lugar: o da esponja colado na lataria, o da mangueira de trás (a mangueira
 *     verde esticada do carrinho até a mão), o Gatito nos caixotes; a câmera de três quartos pega os três e o ônibus;
 *  3. ESFREGANDO: a esponja faz roda na lataria e a espuma cresce na frente dela, com as bolhas subindo;
 *  4. ENXAGUANDO: a mangueira liga, o jato varre a espuma (ela some por onde a água passa) e o amarelo brilha;
 *  5. A PEGADINHA: o jato escorrega e acerta o Gatito em cheio — ele mia, reclama, e dá a SACUDIDA de gato molhado,
 *     que respinga em quem está do lado; os dois riem;
 *  6. O FINAL: o Gatito pede a mangueira para o céu, a água cai em chuva fininha e um ARCO-ÍRIS se desenha por cima
 *     do ônibus; o six seven, os pulinhos, a lataria piscando de limpa e a memória "Banho de mangueira";
 *  7. a tela pisca de novo e tudo volta: a esponja no balde, a mangueira no chão, o Gatito esfregando.
 *
 * As falas são PROVISÓRIAS (minhas): quando o Renan mandar as dele, entram aqui literais.
 */
export const MEMORIA_DO_MUTIRAO = 'mutirao-da-lavagem';

const G = 'Gatito';
const A = ARI.name;
const R = RENAN.name;

/** o que a lavagem empresta ao mutirão: o Gatito, o lugar e as peças que já estão no chão */
export interface CenaDaLavagem {
  gatito: Gatito;
  /** onde, ao longo do ônibus, o Gatito esfrega (o x do meio dos caixotes) e o plano da lataria (o z) */
  x: number;
  face: number;
  /** a ponta solta da mangueira no carrinho (no mundo) */
  saidaDaMangueira: THREE.Vector3;
  /** o que fica no chão quando ninguém está com a mangueira: some enquanto ela está na mão */
  mangueiraNoChao: THREE.Object3D;
  /** a poça em volta dos caixotes: cresce com a água */
  poca: THREE.Object3D;
  /** as esperas e os tiques no relógio do jogo */
  relogio: { esperar: (s: number) => Promise<void>; aCadaQuadro: (f: (dt: number) => boolean) => void };
  /** onde a cena põe as peças do mutirão */
  raiz: THREE.Object3D;
  /** as bolhas da lavagem: o mutirão empresta mais uma fonte (a esponja de quem ajuda) */
  fontesDeBolhas: THREE.Vector3[];
  /** o "fsh-fsh" da esponja de quem ajuda */
  som: (nome: 'esfrega' | 'mangueira' | 'respingo' | 'miado' | 'arcoIris' | 'chuvinha' | 'pegar') => void;
}

/** o gancho do teste: em que pedaço da cena está, e as peças para medir */
export const depuracaoDoMutirao: {
  fase: string;
  jato?: JatoDeMangueira;
  arco?: ArcoIrisNaNevoa;
  esponja?: THREE.Object3D;
  pistola?: THREE.Object3D;
  mancha?: THREE.Object3D;
  quemNaMangueira?: string;
} = { fase: 'parado' };

const suave = (t: number): number => t * t * (3 - 2 * t);

export async function mutiraoDaLavagem(g: GameAPI, c: CenaDaLavagem): Promise<void> {
  const { gatito, x: X, face: F, relogio } = c;
  const { esperar, aCadaQuadro } = relogio;
  const dizer = async (quem: string, texto: string): Promise<void> => g.say([texto], quem);

  // ------------------------------------------------------------ 1. quem pega o quê
  const escolha = await g.ask('Quem fica com a mangueira?', [A, R]);
  const H = escolha === 0 ? A : R;
  const S = H === A ? R : A;
  const hJoga = g.playerName() === H;
  const papelH = hJoga ? 'jogador' : 'parceiro';
  const papelS = hJoga ? 'parceiro' : 'jogador';
  const idDe = (nome: string): string => (nome === A ? ARI.id : RENAN.id);
  depuracaoDoMutirao.quemNaMangueira = H;
  depuracaoDoMutirao.fase = 'escolhido';
  await dizer(H, 'A mangueira é minha!');
  await dizer(S, 'Então eu fico com a esponja. Pode deixar que eu esfrego.');
  await dizer(G, 'Esponja reserva no balde, mangueira no carrinho. Mutirão dos Gatitos!');

  // ------------------------------------------------------------ 2. todo mundo no lugar (por baixo da tela escura)
  await g.escurecerTela(true);
  const LUGAR_S = { x: X + 1.55, z: F + 0.55 };
  const LUGAR_H = { x: X + 0.45, z: F + 2.6 };
  const lataria = (x: number): { x: number; z: number } => ({ x, z: F - 3 });
  g.lockPlayer(true);
  const por = (papel: 'jogador' | 'parceiro', p: { x: number; z: number }, olhar: { x: number; z: number }): void => {
    const giro = Math.atan2(olhar.x - p.x, olhar.z - p.z);
    if (papel === 'jogador') {
      g.releasePlayer(p.x, p.z, giro);
      g.lockPlayer(true);
    } else {
      g.releaseCompanion(p.x, p.z, giro);
      g.holdCompanion(olhar.x, olhar.z);
    }
  };
  /** vira quem está com a mangueira para um ponto (devagar: quem gira é o motor) */
  const mirarH = (p: { x: number; z: number }): void => {
    if (papelH === 'jogador') g.mirarJogador(p);
    else g.holdCompanion(p.x, p.z);
  };
  por(papelS, LUGAR_S, lataria(LUGAR_S.x));
  por(papelH, LUGAR_H, { x: X + 1.2, z: F });
  if (papelS === 'jogador') g.mirarJogador(lataria(LUGAR_S.x));

  const esponja = esponjaDeMao();
  const pistola = pistolaDeMangueira();
  g.segurarNaCena(idDe(S), esponja, 'none');
  g.segurarNaCena(idDe(H), pistola, 'none');
  g.lavarNaCena(papelS, 'esponja');
  g.lavarNaCena(papelH, 'mangueira', 0.1);
  depuracaoDoMutirao.esponja = esponja;
  depuracaoDoMutirao.pistola = pistola;

  const mangueira = new MangueiraSolta();
  const jato = new JatoDeMangueira();
  const gotas = new GotasSoltas(80);
  const arco = new ArcoIrisNaNevoa();
  arco.malha.position.set(X + 0.3, 0.15, F + 1.55);
  const brilhos = new BrilhosDeLimpo(26);
  c.raiz.add(mangueira.malha, jato.group, gotas.malha, arco.malha, brilhos.malha);
  c.mangueiraNoChao.visible = false;
  mangueira.malha.visible = true;
  depuracaoDoMutirao.jato = jato;
  depuracaoDoMutirao.arco = arco;

  // a espuma de quem ajuda: cresce na lataria onde a esponja esfrega (o lugar é lido da esponja, já na pose)
  const mancha = manchaDeEspuma(31, 0.85, 0.5);
  mancha.scale.setScalar(0.001);
  c.raiz.add(mancha);
  depuracaoDoMutirao.mancha = mancha;

  // o que anda a cada quadro enquanto o mutirão dura
  const pontaDaAgua = new THREE.Vector3();
  const praFrente = new THREE.Vector3();
  const engate = new THREE.Vector3();
  const naEsponja = new THREE.Vector3();
  let rodando = true;
  let esfregando = true;
  let somDaEsponja = 0.3;
  let somDaAgua = 0;
  c.fontesDeBolhas.push(naEsponja);
  // a poça cresce com a água que escorre (e volta ao tamanho de antes no fim)
  const pocaAntes = c.poca.scale.clone();
  const pocaMolhada = new THREE.Vector3(pocaAntes.x * 1.9, 1, pocaAntes.z * 2.1);
  aCadaQuadro((dt) => {
    if (jato.ligado) c.poca.scale.lerp(pocaMolhada, Math.min(1, dt * 0.35));
    pistola.getObjectByName('ponta')?.getWorldPosition(pontaDaAgua);
    pistola.getObjectByName('pistola-de-mangueira')?.getWorldDirection(praFrente);
    pistola.getObjectByName('engate')?.getWorldPosition(engate);
    esponja.getWorldPosition(naEsponja);
    mangueira.esticar(c.saidaDaMangueira, engate);
    jato.apontar(pontaDaAgua, praFrente);
    jato.update(dt);
    gotas.update(dt);
    brilhos.update(dt);
    somDaEsponja -= dt;
    if (esfregando && somDaEsponja <= 0) {
      somDaEsponja = 0.9;
      c.som('esfrega');
    }
    somDaAgua -= dt;
    if (jato.ligado && somDaAgua <= 0) {
      somDaAgua = 0.3;
      c.som('mangueira');
    }
    return !rodando;
  });

  // a câmera de três quartos: os três e o ônibus (no celular em pé, ela recua pela mesma linha)
  const emPe = typeof innerWidth !== 'undefined' && innerWidth / innerHeight < 0.8;
  const olho = new THREE.Vector3(X + 0.55, 1.1, F + 1.0);
  // (pelo lado da TRASEIRA do ônibus, o −X: quem esfrega leva a esponja com a mão direita, que, de frente para a
  // lataria, fica do lado −X dele — pelo lado do nariz a câmera via o corpo dele tapando a esponja e a espuma)
  const daqui = new THREE.Vector3(-4.2, 1.45, 3.5).multiplyScalar(emPe ? 1.6 : 1).add(olho);
  g.setCameraOmbro(daqui, olho);
  depuracaoDoMutirao.fase = 'esfregando';
  await esperar(0.5);
  await g.escurecerTela(false);

  // ------------------------------------------------------------ 3. esfregando
  // a mancha nasce onde a esponja está (encostada na lataria), e cresce com as voltas
  // (um palmo para o lado da câmera: no meio, a cabeça de quem esfrega tapava a espuma)
  const manchaEm = new THREE.Vector3(naEsponja.x - 0.22, naEsponja.y + 0.04, F + 0.012);
  mancha.position.copy(manchaEm);
  await new Promise<void>((pronto) => {
    let t = 0;
    aCadaQuadro((dt) => {
      t += dt;
      mancha.scale.setScalar(Math.max(0.001, suave(Math.min(1, t / 2.6))));
      if (t >= 2.8) {
        pronto();
        return true;
      }
      return false;
    });
  });
  await dizer(S, 'Olha a espuma! Tá virando nuvem.');
  await dizer(H, 'Segura que lá vai água!');

  // ------------------------------------------------------------ 4. enxaguando: o jato varre a espuma da esquerda para a direita
  depuracaoDoMutirao.fase = 'enxaguando';
  g.lavarNaCena(papelH, 'mangueira', 0.12);
  const deX = manchaEm.x + 0.55, ateX = manchaEm.x - 0.5;
  jato.normal = new THREE.Vector3(0, 0, 1);
  jato.alvo.set(deX, manchaEm.y + 0.05, F + 0.02);
  mirarH({ x: deX, z: F });
  await esperar(0.35);
  jato.ligado = true;
  await new Promise<void>((pronto) => {
    let t = 0;
    aCadaQuadro((dt) => {
      if (!jato.chegou) return false;
      t += dt;
      const k = Math.min(1, t / 3.2);
      // vai e volta uma vez em cima da espuma, um tico ondulado (a mão de quem segura não é régua)
      const vai = Math.sin(k * Math.PI);
      jato.alvo.set(deX + (ateX - deX) * vai, manchaEm.y + Math.sin(t * 5) * 0.12, F + 0.02);
      mirarH({ x: jato.alvo.x, z: F });
      // a espuma some por onde a água passou (encolhe até o enxague acabar)
      mancha.scale.setScalar(Math.max(0.001, 1 - suave(k)));
      if (k >= 1) {
        pronto();
        return true;
      }
      return false;
    });
  });
  // onde lavou, a lataria pisca de limpa
  const sorte = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(77);
  brilhos.acender(Array.from({ length: 10 }, () => new THREE.Vector3(manchaEm.x + (sorte() - 0.5) * 1.1, manchaEm.y + (sorte() - 0.5) * 0.6, F + 0.06)));
  esfregando = false;
  g.lavarNaCena(papelS, null);
  g.lockPlayer(true);

  // ------------------------------------------------------------ 5. a pegadinha: o jato escorrega e pega o Gatito
  depuracaoDoMutirao.fase = 'pegadinha';
  const noGatito = gatito.group.position.clone().add(new THREE.Vector3(0, 0.42, 0.05));
  const deOnde = jato.alvo.clone();
  await new Promise<void>((pronto) => {
    let t = 0;
    aCadaQuadro((dt) => {
      t += dt;
      const k = suave(Math.min(1, t / 0.7));
      jato.alvo.copy(deOnde).lerp(noGatito, k);
      mirarH({ x: jato.alvo.x, z: F });
      if (k >= 1) {
        pronto();
        return true;
      }
      return false;
    });
  });
  // em cheio: a água espirra no Gatito (para todo lado), ele larga a esponja e mia
  jato.normal = new THREE.Vector3(0.3, 0.2, 1).normalize();
  gatito.esfregar(false);
  c.som('miado');
  c.som('respingo');
  await esperar(0.9);
  jato.ligado = false;
  await dizer(G, 'MIAU! Ei! Eu sou gato, não ônibus!');
  await dizer(H, 'Desculpa, Gatito! Escorregou!');
  await dizer(S, 'Escorregou nada... foi de propósito.');
  await dizer(G, 'Ah, é? Então segura essa!');
  // A SACUDIDA de gato molhado: as gotas voam do Gatito para todo lado (umas em quem está do lado, com a esponja)
  depuracaoDoMutirao.fase = 'sacudida';
  gatito.sacudir();
  c.som('respingo');
  {
    let t = 0;
    const centro = noGatito.clone();
    await new Promise<void>((pronto) => {
      aCadaQuadro((dt) => {
        t += dt;
        const r = sorte;
        for (let i = 0; i < 4; i++) {
          const a = r() * Math.PI * 2;
          const v = new THREE.Vector3(Math.cos(a) * (1.4 + r() * 1.4), 0.8 + r() * 1.6, Math.abs(Math.sin(a)) * (1 + r()));
          // um terço vai para o lado de quem está com a esponja
          if (i === 0) v.set(1.8 + r(), 1.2 + r(), 0.3 + r() * 0.5);
          gotas.soltar(centro.clone().add(new THREE.Vector3((r() - 0.5) * 0.25, (r() - 0.5) * 0.3, 0)), v, 0.016 + r() * 0.02, 0.8);
        }
        if (t > 1.3) {
          pronto();
          return true;
        }
        return false;
      });
    });
  }
  await dizer(S, 'Ah! Agora quem tomou banho fui eu!');
  g.comemorar('jogador');
  g.comemorar('parceiro');
  await esperar(0.5);

  // ------------------------------------------------------------ 6. o final: mangueira para o céu e o arco-íris
  await dizer(G, 'Agora é sério: mangueira pra cima! Pro ônibus terminar brilhando.');
  depuracaoDoMutirao.fase = 'arco-iris';
  const ceu = new THREE.Vector3(X + 0.3, 4.4, F + 1.0);
  jato.normal = null;
  jato.alvo.copy(ceu);
  mirarH({ x: ceu.x, z: ceu.z });
  g.lavarNaCena(papelH, 'mangueira', 1);
  gatito.encarar(LUGAR_H.x, LUGAR_H.z);
  await esperar(0.4);
  jato.ligado = true;
  c.som('chuvinha');
  // a câmera recua um tico e sobe: o arco-íris inteiro no quadro
  const olhoDoArco = new THREE.Vector3(X + 0.3, 1.7, F + 1.2);
  const daquiDoArco = new THREE.Vector3(-5.2, 1.4, 6.6).multiplyScalar(emPe ? 1.5 : 1).add(olhoDoArco);
  await new Promise<void>((pronto) => {
    let t = 0;
    aCadaQuadro((dt) => {
      t += dt;
      const k = suave(Math.min(1, t / 1.8));
      g.setCameraOmbro(daqui.clone().lerp(daquiDoArco, k), olho.clone().lerp(olhoDoArco, k));
      if (t > 1.0) arco.mostrar((t - 1.0) / 1.6);
      if (t > 1.05 && t - dt <= 1.05) c.som('arcoIris');
      if (t >= 2.7) {
        pronto();
        return true;
      }
      return false;
    });
  });
  // a lataria inteira pisca de limpa, o six seven e os pulinhos
  brilhos.acender(Array.from({ length: 26 }, () => new THREE.Vector3(X - 2.2 + sorte() * 4.6, 0.7 + sorte() * 2.1, F + 0.06)));
  gatito.sixSeven();
  g.comemorar('jogador');
  g.comemorar('parceiro');
  await esperar(1.0);
  await dizer(S, 'Um arco-íris em cima do ônibus dos Gatitos!');
  await dizer(H, 'Agora sim: brilhando de verdade.');
  await dizer(G, 'Melhor mutirão que essa escola já teve. Obrigado, ajudantes!');
  if (!g.temMemoria(MEMORIA_DO_MUTIRAO)) {
    g.unlock({
      id: MEMORIA_DO_MUTIRAO,
      title: 'Banho de mangueira',
      place: 'Escola do Gatito',
      note: `Ajudamos o Gatito a lavar o ônibus dos Gatitos: ${S} na esponja, ${H} na mangueira. A água "escorregou" bem no Gatito, ele se sacudiu em cima da gente, e no fim a mangueira pro céu fez um arco-íris por cima do ônibus.`,
      icon: '🌈',
    });
  }
  await esperar(1.2);

  // ------------------------------------------------------------ 7. tudo de volta (por baixo da tela escura)
  depuracaoDoMutirao.fase = 'voltando';
  jato.ligado = false;
  await g.escurecerTela(true);
  rodando = false;
  c.fontesDeBolhas.splice(c.fontesDeBolhas.indexOf(naEsponja), 1);
  for (const o of [mangueira.malha, jato.group, gotas.malha, arco.malha, brilhos.malha, mancha]) o.removeFromParent();
  c.mangueiraNoChao.visible = true;
  c.poca.scale.copy(pocaAntes);
  g.segurarNaCena(idDe(S), null);
  g.segurarNaCena(idDe(H), null);
  g.lavarNaCena('jogador', null);
  g.lavarNaCena('parceiro', null);
  g.mirarJogador(null);
  g.setCameraOmbro(null);
  // a dupla fica na frente do Gatito, de onde dá para conversar de novo
  g.releasePlayer(X + 0.6, F + 1.55, Math.PI);
  g.releaseCompanion(X - 0.4, F + 1.7, Math.PI);
  g.freeCompanion();
  gatito.encarar(X, F - 3);
  gatito.esfregar(true);
  await esperar(0.3);
  await g.escurecerTela(false);
  g.lockPlayer(false);
  depuracaoDoMutirao.fase = 'fim';
}
