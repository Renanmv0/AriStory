import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { LimusineDaValentina, LIMUSINE } from '../../world/limusineDaValentina';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { ritmoDoPresente } from './presente';

/**
 * ============================================= O TAPETE VERMELHO NA ESCOLA
 *
 * O pedido do Renan (2026-11-18): "da primeira vez que encontramos eles na
 * estrada, faça a animação dela descendo e o Pietro colocando o tapete
 * vermelho quando chegarmos à escola". Depois da sessão de fotos na estrada
 * (a memória `valentina-na-estrada`), a PRIMEIRA chegada de carro à escola
 * termina com o desfile, visto de onde a dupla desceu do Bebito:
 *
 *  1. a limusine vem pela faixa da escola (do +X para o −X, a porta dela do
 *     lado da calçada) e para com a Valentina na altura do PORTÃO;
 *  2. o Pietro pula do banco alto para a calçada, vai ao porta-malas e pega o
 *     ROLO do tapete vermelho;
 *  3. põe o rolo no chão, na porta dela, e dá um empurrão: o TAPETE se
 *     desenrola até o portão (o rolo afinando enquanto corre);
 *  4. ele para do lado, com o LEQUE aberto (a honra da casa), e a Valentina
 *     DESCE da limusine por cima da porta;
 *  5. ela DESFILA pelo tapete até o portão, posa, fala com a dupla e entra;
 *  6. o Pietro enrola o tapete de volta, sobe e a limusine vai embora.
 *
 * Uma vez só (a flag `valentina-desfilou`). A cena (`naEscola.ts`) chama isto
 * quando a chegada animada do Bebito termina.
 */
export const DESFILOU = 'valentina-desfilou';

/** a faixa da escola (a rua vai de 22 a 30; a calçada da escola, de 19 a 22) e o portão (a grade em 18,55) */
const Z_DA_LIMUSINE = 22 + LIMUSINE.meiaLargura + 0.32;
/** a limusine para com a Valentina (no −0,86 dela, que vira +0,86 em `x`) na frente do portão */
const PARADA = -0.86;
const INICIO_DO_TAPETE = 21.85;
const FIM_DO_TAPETE = 18.75;
const ALTO_DO_TAPETE = 0.03;
const V = THREE.Vector3;
const suave = (x: number): number => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };

/** o tapete estendido: o vermelho e os dois frisos dourados, de comprimento 1 no −Z (a cena estica) */
function tapeteEstendido(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'tapete-vermelho';
  const vermelho = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1).rotateX(-Math.PI / 2).translate(0, 0, -0.5), toon(P.limusineTapete));
  g.add(vermelho);
  for (const x of [-0.44, 0.44]) {
    const friso = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1).rotateX(-Math.PI / 2).translate(x, 0.002, -0.5), toon(P.limusineDourado));
    g.add(friso);
  }
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.receiveShadow = true; });
  g.userData.semSombra = true;
  return g;
}

export function desfileDaValentina(w: WorldBuilder, aoAcabar: () => void): void {
  const g = w.game;
  const limusine = new LimusineDaValentina();
  limusine.group.userData.desfile = true;
  w.add(limusine.group);
  const pietro = limusine.pietro!, valentina = limusine.valentina!, rolo = limusine.rolo!;
  limusine.group.position.set(48, 0, Z_DA_LIMUSINE);
  limusine.group.rotation.y = -Math.PI / 2;
  const tapete = tapeteEstendido();
  tapete.position.set(0, ALTO_DO_TAPETE, INICIO_DO_TAPETE);
  tapete.scale.z = 0.0001;
  tapete.visible = false;
  w.add(tapete);
  const estado = { fase: 'chegando', tapete: 0 };
  w.root.userData.desfileDaValentina = { limusine, estado, tapete };

  // ------------------------------------------------------------------ o relógio do desfile
  const tarefas: Array<{ t: number; dur: number; f: (k: number) => void; pronto: () => void }> = [];
  const animar = (dur: number, f: (k: number) => void): Promise<void> => new Promise((pronto) => { tarefas.push({ t: 0, dur, f, pronto }); });
  const esperar = (s: number): Promise<void> => animar(s, () => {});
  let andou = 0;
  let tomada: { de: THREE.Vector3; para: THREE.Vector3 } | null = null;
  const olho = new V(), mira = new V();
  let cameraPosta = false;
  const filmar = (de: THREE.Vector3, para: THREE.Vector3): void => { tomada = { de, para }; };
  w.onUpdate((quadro) => {
    if (estado.fase === 'fim') return;
    const dt = quadro * ritmoDoPresente.vezes;
    for (let i = tarefas.length - 1; i >= 0; i--) {
      const t = tarefas[i];
      t.t += dt;
      t.f(Math.min(1, t.t / t.dur));
      if (t.t >= t.dur) { tarefas.splice(i, 1); t.pronto(); }
    }
    // (a limusine atualiza o Pietro e a Valentina, dentro ou fora dela)
    limusine.update(dt, andou, false);
    andou = 0;
    if (tomada) {
      const emPe = window.innerWidth / window.innerHeight < 0.8;
      const de = emPe ? tomada.para.clone().add(tomada.de.clone().sub(tomada.para).multiplyScalar(1.55)) : tomada.de;
      if (!cameraPosta) { olho.copy(de); mira.copy(tomada.para); cameraPosta = true; }
      olho.lerp(de, 1 - Math.exp(-2.6 * dt));
      mira.lerp(tomada.para, 1 - Math.exp(-2.6 * dt));
      g.setCameraOmbro(olho, mira);
    }
  });

  /** um pulo em arco, de onde o bicho está até `para` (no mundo), passando por cima de `alto` */
  const pular = (obj: THREE.Object3D, para: THREE.Vector3, alto: number, dur: number): Promise<void> => {
    const de = obj.position.clone();
    return animar(dur, (k) => {
      obj.position.lerpVectors(de, para, k);
      obj.position.y = THREE.MathUtils.lerp(de.y, para.y, k) + Math.sin(k * Math.PI) * (alto - Math.max(de.y, para.y) + 0.2);
    });
  };
  /** um ponto da limusine (no referencial dela) no mundo */
  const naLimusine = (x: number, y: number, z: number): THREE.Vector3 => {
    limusine.group.updateMatrixWorld(true);
    return limusine.group.localToWorld(new V(x, y, z));
  };

  void (async () => {
    g.lockPlayer(true);
    g.holdCompanion(0, 20);
    // 1. a limusine chega pela faixa da escola, devagar, e para com a Valentina na frente do portão
    filmar(new V(9, 7.2, 35), new V(4, 0.8, 23));
    g.som('buzinaDaLimusine');
    g.toast('Uma buzina chique na rua da escola… é a limusine da Valentina!', '🦩');
    const x0 = limusine.group.position.x;
    let anterior = x0;
    await animar(6.5, (k) => {
      const x = THREE.MathUtils.lerp(x0, PARADA, 1 - Math.pow(1 - k, 2.4));
      andou += Math.abs(anterior - x);
      anterior = x;
      limusine.group.position.x = x;
    });
    estado.fase = 'parada';
    await esperar(0.6);

    // 2. o Pietro pula do banco alto para a calçada e vai ao porta-malas buscar o rolo
    filmar(new V(5.5, 3.6, 28.5), new V(0.6, 0.7, 21.6));
    w.root.attach(pietro.group);
    pietro.aoVolante = null;
    pietro.group.rotation.set(0, Math.PI, 0);
    estado.fase = 'pietro';
    g.som('virar');
    await pular(pietro.group, new V(naLimusine(-1.2, 0, 0.6).x, 0, INICIO_DO_TAPETE - 0.15), 1.15, 0.8);
    const porta = naLimusine(-1.1, 0, -2.55);
    await pietro.irPara(porta.x, INICIO_DO_TAPETE - 0.1, 1.1);
    pietro.encarar(porta.x, Z_DA_LIMUSINE);
    await esperar(0.4);
    // ele pega o rolo de cima do porta-malas e o carrega na frente do peito, de lado
    pietro.group.attach(rolo);
    g.som('pegar');
    const doRolo = rolo.position.clone();
    await animar(0.7, (k) => {
      rolo.position.lerpVectors(doRolo, new V(0, 0.7, 0.32), suave(k));
      rolo.rotation.set(0, 0, 0);
    });
    // 3. leva o rolo até a porta dela e o põe no chão, atravessado, na beira da calçada
    await pietro.irPara(0.75, INICIO_DO_TAPETE + 0.05, 1.0);
    pietro.encarar(0, FIM_DO_TAPETE);
    await esperar(0.3);
    w.root.attach(rolo);
    const noAr = rolo.position.clone();
    await animar(0.5, (k) => {
      rolo.position.lerpVectors(noAr, new V(0, 0.115, INICIO_DO_TAPETE), suave(k));
      rolo.rotation.set(0, 0, 0);
    });
    // o empurrão: o tapete corre até o portão, e o rolo vai afinando
    estado.fase = 'tapete';
    filmar(new V(4.6, 3.2, 26.2), new V(0, 0.4, 20.3));
    tapete.visible = true;
    g.som('lancar');
    const comprimento = INICIO_DO_TAPETE - FIM_DO_TAPETE;
    await animar(1.9, (k) => {
      const e = suave(k);
      estado.tapete = e;
      tapete.scale.z = Math.max(0.0001, comprimento * e);
      rolo.position.z = INICIO_DO_TAPETE - comprimento * e;
      rolo.scale.set(1, 1 - 0.7 * e, 1 - 0.7 * e);
      rolo.position.y = 0.115 * (1 - 0.7 * e);
      rolo.rotation.x = -e * comprimento / 0.08;
    });
    rolo.visible = false;
    g.som('surpresa');

    // 4. o Pietro do lado do tapete, com o LEQUE aberto, e a Valentina desce por cima da porta
    await pietro.irPara(1.05, INICIO_DO_TAPETE - 0.35, 1.0);
    pietro.encarar(0, INICIO_DO_TAPETE);
    pietro.abrirLeque(true);
    await g.say(['Signorina, o seu tapete.'], 'Pietro');
    estado.fase = 'descendo';
    filmar(new V(4.2, 2.6, 25.6), new V(0, 1.0, 21.4));
    w.root.attach(valentina.group);
    valentina.levantar();
    valentina.group.rotation.set(0, Math.PI, 0);
    await pular(valentina.group, new V(0, ALTO_DO_TAPETE, INICIO_DO_TAPETE - 0.25), 1.25, 0.9);
    valentina.posar(2.2);
    await g.say(['Grazie, Pietro. Uma estrela não chega na escola: ela ESTREIA na escola.'], 'Valentina');

    // 5. o desfile até o portão
    estado.fase = 'desfilando';
    const acompanhar = animar(30, () => { filmar(new V(3.4, 2.5, valentina.group.position.z + 4.2), valentina.group.position.clone().add(new V(0, 1.05, 0))); });
    void acompanhar;
    await valentina.irPara(0, FIM_DO_TAPETE + 0.25, 0.62);
    tarefas.splice(0, tarefas.length);
    valentina.encarar(4.55, 38);
    valentina.posar(2.4);
    g.som('fotoFlash');
    await g.say(['Bebitos! Gostaram da minha entrada? Vejo vocês lá dentro. Ciao, ciao!'], 'Valentina');
    await valentina.irPara(0, 15.2, 0.62);
    valentina.group.visible = false;

    // 6. o Pietro enrola o tapete de volta, sobe, e a limusine vai embora
    estado.fase = 'indo';
    pietro.abrirLeque(false);
    filmar(new V(6.5, 4.6, 31), new V(0, 0.8, 22.5));
    await pietro.irPara(0.55, FIM_DO_TAPETE + 0.2, 1.1);
    rolo.visible = true;
    const voltar = pietro.irPara(0.55, INICIO_DO_TAPETE, 0.75);
    await animar(2.3, (k) => {
      const e = 1 - suave(k);
      tapete.scale.z = Math.max(0.0001, comprimento * e);
      rolo.position.z = INICIO_DO_TAPETE - comprimento * e;
      rolo.scale.set(1, 1 - 0.7 * e, 1 - 0.7 * e);
      rolo.position.y = 0.115 * (1 - 0.7 * e);
    });
    await voltar;
    tapete.visible = false;
    rolo.visible = false;
    await pular(pietro.group, naLimusine(LIMUSINE.pietro.x, LIMUSINE.pietro.banco - 0.38, LIMUSINE.pietro.z - 0.02), 1.4, 0.8);
    limusine.lata.attach(pietro.group);
    pietro.group.position.set(LIMUSINE.pietro.x, LIMUSINE.pietro.banco - 0.38, LIMUSINE.pietro.z - 0.02);
    pietro.group.rotation.set(0, 0, 0);
    pietro.aoVolante = { volante: 0, olhar: 0 };
    g.som('buzinaDaLimusine');
    const xi = limusine.group.position.x;
    let antes = xi;
    await animar(4.5, (k) => {
      const x = xi - 55 * k * k;
      andou += Math.abs(antes - x);
      antes = x;
      limusine.group.position.x = x;
    });
    limusine.group.visible = false;

    // fim: a memória, a flag, e a dupla de volta
    g.setFlag(DESFILOU);
    g.unlock({ id: 'valentina-na-escola', title: 'O tapete vermelho', place: 'Escola do Gatito', icon: '🦩', note: 'Na primeira vez que a gente chegou na escola depois da foto na estrada, a limusine rosa parou na frente do portão. O Pietro pegou o rolo do porta-malas, desenrolou o tapete vermelho até a entrada e abriu o leque do lado, e a Valentina desceu e desfilou até o portão como estrela de cinema.' });
    estado.fase = 'fim';
    tomada = null;
    g.setCameraOmbro(null);
    g.freeCompanion();
    g.lockPlayer(false);
    aoAcabar();
  })();
}
