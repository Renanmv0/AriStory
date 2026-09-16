import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { PALETTE as P } from '../../palette';
import { Frisbee } from '../../entities/Frisbee';
import { QUADRA, naQuadra, qx0, qx1, qz0, qz1 } from './comum';

/**
 * Frisbee de dois, dentro da quadra.
 *
 * O disco so existe na mao enquanto voce esta na quadra — fora dela some, e o
 * parceiro volta a andar do seu lado. Dentro, ele se posiciona do lado oposto e
 * o lancamento e carregado: quanto mais tempo segurando F, mais longe o disco
 * vai. A mira e para onde voce esta olhando, entao errar o passe faz parte —
 * ele corre atras.
 */
export function ligarFrisbeeJogo(w: WorldBuilder): void {
  const g = w.game;

  const disco = new Frisbee(P.frisbee);
  disco.mesh.visible = false;
  w.root.add(disco.mesh);

  /**
   * Frisbee de dois, dentro da quadra.
   *
   * O disco só existe na mão enquanto você está na quadra — fora dela some, e
   * o Renan volta a andar do seu lado. Dentro, ele se posiciona do lado oposto
   * e o lançamento é carregado: quanto mais tempo segurando F, mais longe o
   * disco vai. A mira é para onde você está olhando, então errar o passe faz
   * parte — ele corre atrás.
   */
  type FaseDisco =
    | 'fora'
    | 'comigo'
    | 'voando-pra-ele'
    | 'buscando'
    | 'com-ele'
    | 'voando-pra-mim'
    | 'no-chao';

  const CARGA_CHEIA = 1.3; // segundos até a força total
  const DIST_MIN = 6;
  const DIST_MAX = 30;

  // O disco não passa da grade: sem isso ele cai do lado de fora e o
  // parceiro fica batendo no alambrado tentando alcançar.
  const LIMITES_QUADRA = {
    minX: qx0 + 0.7,
    minZ: qz0 + 0.7,
    maxX: qx1 - 0.7,
    maxZ: qz1 - 0.7,
  };

  let fase: FaseDisco = 'fora';
  let esperaDele = 0;
  let carga = 0;
  let carregando = false;
  let trocasNaSessao = 0;
  let ultimoPosto: { x: number; z: number } | null = null;

  const contarTroca = (api: typeof g, noAr: boolean): void => {
    trocasNaSessao += 1;
    const total = api.bump('frisbee.trocas');

    const recorde = api.stat('frisbee.recorde');
    if (trocasNaSessao > recorde) api.bump('frisbee.recorde', trocasNaSessao - recorde);

    if (noAr) api.toast('Pegou no ar!', '🥏');
    else if (trocasNaSessao % 5 === 0) api.toast(`${trocasNaSessao} trocas seguidas!`, '🥏');

    if (total >= 10 && !api.flag('memoria-frisbee')) {
      api.setFlag('memoria-frisbee');
      api.unlock({
        id: 'frisbee-villa',
        title: 'Frisbee no Villa',
        place: 'Parque Villa Lobos',
        note: 'Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.',
        icon: '🥏',
      });
    }
  };

  const limitar = (v: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, v));

  /** Onde o parceiro se planta para receber: lado oposto, dentro das linhas. */
  const postoDoParceiro = (eu: THREE.Vector3): { x: number; z: number } => {
    const lado = eu.x < QUADRA.x ? 1 : -1;
    return {
      x: limitar(eu.x + lado * 11, qx0 + 2, qx1 - 2),
      z: limitar(eu.z, qz0 + 2, qz1 - 2),
    };
  };

  const soltarCarga = (): void => {
    carregando = false;
    carga = 0;
    g.showCharge(null);
  };

  const entrarNaQuadra = (): void => {
    fase = 'comigo';
    disco.pickUp();
    trocasNaSessao = 0;
    ultimoPosto = null;
    g.setZoom(19); // abre o enquadramento: dá pra ver o parceiro e mirar
    g.toast('Segure F para lançar mais longe', '🥏');
  };

  const sairDaQuadra = (): void => {
    fase = 'fora';
    disco.mesh.visible = false;
    soltarCarga();
    g.freeCompanion();
    g.setZoom(14);
    ultimoPosto = null;
  };

  const lancar = (forca: number): void => {
    if (fase !== 'comigo') return;
    const dist = DIST_MIN + (DIST_MAX - DIST_MIN) * limitar(forca, 0, 1);
    disco.throwAt(g.playerPosition(), g.playerFacing(), dist);
    fase = 'voando-pra-ele';
  };

  const jogar = w.interact({
    id: 'parque:frisbee-jogar',
    x: QUADRA.x, z: QUADRA.z, radius: 3,
    priority: -1, // segue o jogador: nunca deve roubar o prompt de outra coisa
    label: 'Lançar o frisbee  (segure F)', icon: '🥏',
    onInteract: () => lancar(0.55),
  });

  const pegar = w.interact({
    id: 'parque:frisbee-pegar',
    x: QUADRA.x, z: QUADRA.z, radius: 1.8,
    label: 'Pegar o frisbee', icon: '🥏',
    onInteract: (api) => {
      disco.pickUp();
      fase = 'comigo';
      contarTroca(api, false);
    },
  });

  w.onUpdate((dt) => {
    disco.update(dt, LIMITES_QUADRA);

    const eu = g.playerPosition();
    const ele = g.companionPosition();
    const dentro = naQuadra(eu.x, eu.z, 0.4);

    if (dentro && fase === 'fora') entrarNaQuadra();
    else if (!dentro && fase !== 'fora') sairDaQuadra();

    if (fase === 'fora') {
      jogar.enabled = false;
      pegar.enabled = false;
      return;
    }

    // ---------------------------------------------------------- a carga
    if (fase === 'comigo') {
      if (g.keyDown('KeyF')) {
        carregando = true;
        carga = Math.min(1, carga + dt / CARGA_CHEIA);
        g.showCharge(carga);
      } else if (carregando) {
        const forca = carga;
        soltarCarga();
        lancar(forca);
      }
    } else if (carregando) {
      soltarCarga();
    }

    // ------------------------------------------------ o parceiro se posta
    if (fase === 'comigo' || fase === 'no-chao') {
      const posto = postoDoParceiro(eu);
      if (!ultimoPosto || Math.hypot(posto.x - ultimoPosto.x, posto.z - ultimoPosto.z) > 2.5) {
        g.commandCompanion(posto.x, posto.z);
        ultimoPosto = posto;
      }
    }

    // ------------------------------------------------------ o vai e volta
    switch (fase) {
      case 'comigo':
        disco.holdAt(eu, g.playerFacing());
        break;

      case 'com-ele':
        disco.holdAt(ele, Math.atan2(eu.x - ele.x, eu.z - ele.z));
        esperaDele -= dt;
        if (esperaDele <= 0) {
          // Ele erra de propósito, mas pouco: o desvio tem que caber no raio
          // da pegada no ar (1.9), senão o disco sempre cai longe e nunca dá
          // para pegar voando — vira só corrida atrás do disco.
          const alvo = eu.clone();
          alvo.x += (Math.random() - 0.5) * 2.2;
          alvo.z += (Math.random() - 0.5) * 2.2;
          disco.throwToward(ele, alvo, 0.09);
          fase = 'voando-pra-mim';
        }
        break;

      case 'voando-pra-ele': {
        // pegada no ar: passou perto dele na altura certa, ele agarra
        const noAr =
          disco.state === 'voando' &&
          disco.position.y < 2.3 &&
          Math.hypot(disco.position.x - ele.x, disco.position.z - ele.z) < 1.5;
        if (noAr) {
          g.freeCompanion();
          ultimoPosto = null;
          disco.pickUp();
          esperaDele = 0.7;
          fase = 'com-ele';
          g.toast('Ele pegou no ar!', '🙌');
          break;
        }
        if (disco.state === 'chao') {
          if (disco.position.distanceTo(ele) < 1.6) {
            disco.pickUp();
            esperaDele = 0.8;
            fase = 'com-ele';
          } else {
            g.commandCompanion(disco.position.x, disco.position.z);
            ultimoPosto = null;
            fase = 'buscando';
          }
        }
        break;
      }

      case 'buscando':
        if (disco.position.distanceTo(ele) < 1.1) {
          g.freeCompanion();
          disco.pickUp();
          esperaDele = 0.9;
          fase = 'com-ele';
        }
        break;

      case 'voando-pra-mim': {
        const noAr =
          disco.state === 'voando' &&
          disco.position.y < 2.3 &&
          Math.hypot(disco.position.x - eu.x, disco.position.z - eu.z) < 1.9;
        if (noAr) {
          disco.pickUp();
          fase = 'comigo';
          contarTroca(g, true);
          break;
        }
        if (disco.state === 'chao') {
          fase = 'no-chao';
          if (disco.position.distanceTo(eu) < 1.9) {
            disco.pickUp();
            fase = 'comigo';
            contarTroca(g, false);
          }
        }
        break;
      }

      case 'no-chao':
        if (disco.position.distanceTo(eu) < 1.2) {
          disco.pickUp();
          fase = 'comigo';
          contarTroca(g, false);
        }
        break;
    }

    jogar.enabled = fase === 'comigo';
    pegar.enabled = fase === 'no-chao';
    if (fase === 'comigo') jogar.moveTo(eu.x, eu.z);
    else pegar.moveTo(disco.position.x, disco.position.z);
  });
}
