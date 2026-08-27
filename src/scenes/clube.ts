import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import { flat } from '../core/materials';
import {
  bench, building, bush, cloud, divingBoard, fence, floatRing, flowers, kiosk,
  parasol, poolLadder, poolShell, poolWater, showerPost, sunLounger, tree,
} from '../world/props';

/**
 * Clube — a piscina.
 *
 * Cenário do que ainda não aconteceu: a gente ainda não foi, então o jogo vai
 * na frente. A piscina é um buraco de verdade no piso (`w.groundWithHoles`),
 * e quem entra na água afunda e passa a nadar.
 */

const PISCINA = { x: 0, z: -3, largura: 16, profundidade: 10, fundo: 1.6 };

function dentroDaPiscina(x: number, z: number, margem = 0): boolean {
  return (
    Math.abs(x - PISCINA.x) < PISCINA.largura / 2 - margem &&
    Math.abs(z - PISCINA.z) < PISCINA.profundidade / 2 - margem
  );
}

export const clube: SceneDef = {
  id: 'clube',
  name: 'Clube',
  subtitle: 'a piscina que a gente ainda não conhece',
  // chegou no clube, já está de calção
  outfit: 'banho',
  ambient: {
    sky: 0x9fdcff,
    fog: 0xd6f0ff,
    fogNear: 100,
    fogFar: 210,
    sunColor: 0xfff6e0,
    sunIntensity: 1.75,
    ambientColor: 0xdcf2ff,
    ambientIntensity: 1.05,
    sunDir: [15, 22, 11],
  },
  spawn: { x: 0, z: 12, facing: Math.PI },
  entries: {
    portaria: { x: 0, z: 12, facing: Math.PI },
    beira: { x: 0, z: 3.5, facing: Math.PI },
  },

  build(w) {
    const g = w.game;
    const buraco = {
      x: PISCINA.x,
      z: PISCINA.z,
      width: PISCINA.largura,
      depth: PISCINA.profundidade,
    };

    // -------------------------------------------------------------- terreno
    // grama e deck precisam do MESMO furo, senao a grama aparece no fundo da piscina
    w.groundWithHoles({ width: 160, depth: 160, color: P.grass, holes: [buraco] });
    w.groundWithHoles({
      width: 34,
      depth: 26,
      color: 0xe4e0d6,
      y: 0.015,
      z: -1,
      holes: [buraco],
    });
    w.setBounds(-22, -18, 22, 16);

    // ------------------------------------------------------------- piscina
    w.add(w.place(poolShell(PISCINA.largura, PISCINA.profundidade, PISCINA.fundo), PISCINA.x, 0, PISCINA.z));
    const agua = poolWater(PISCINA.largura, PISCINA.profundidade);
    agua.position.set(PISCINA.x, -0.12, PISCINA.z);
    w.root.add(agua);

    // linhas de raia pintadas no fundo
    for (const x of [-5.2, -1.8, 1.8, 5.2]) {
      const raia = new THREE.Mesh(new THREE.PlaneGeometry(0.24, PISCINA.profundidade - 1.4), flat(0x3f8ab0));
      raia.rotation.x = -Math.PI / 2;
      raia.position.set(PISCINA.x + x, -PISCINA.fundo + 0.08, PISCINA.z);
      w.root.add(raia);
    }

    for (const x of [-5, 5]) {
      w.add(w.place(poolLadder(), x, 0, PISCINA.z + PISCINA.profundidade / 2));
    }
    const trampolim = w.add(
      w.place(divingBoard(), 0, 0, PISCINA.z - PISCINA.profundidade / 2 - 1.6),
    );
    w.blockBox(0, PISCINA.z - PISCINA.profundidade / 2 - 1.9, 0.4, 0.4);

    // boias na agua
    const boias = [floatRing(P.frisbee), floatRing(0xffd85e), floatRing(0x6fd3f0)];
    boias.forEach((b, i) => {
      w.place(b, -4.5 + i * 4.6, -0.05, PISCINA.z - 1.6 + (i % 2) * 2.6);
      w.root.add(b);
    });

    // ----------------------------------------------------------- espreguicadeiras
    const cores = [P.fabricBlue, P.fabricRed, 0x5cb04f, 0xffc94d];
    for (let i = 0; i < 6; i++) {
      const x = -7.5 + i * 3;
      w.add(w.place(sunLounger(cores[i % cores.length]), x, 0, 5.4, Math.PI));
      w.blockBox(x, 5.4, 0.36, 0.85);
      if (i % 2 === 0) {
        w.add(w.place(parasol(i % 4 === 0 ? P.fabricRed : 0x4a7fe0), x + 1.5, 0, 6.9));
        w.blockCircle(x + 1.5, 6.9, 0.3);
      }
    }
    const espreguicadeira = w.add(w.place(sunLounger(P.rug), 10.5, 0, 2.2, -Math.PI / 2));
    w.blockBox(10.5, 2.2, 0.85, 0.36);
    w.add(w.place(parasol(0xff8fb1), 11.6, 0, 3.6));
    w.blockCircle(11.6, 3.6, 0.3);

    // ------------------------------------------------------ apoio do clube
    const chuveiro = w.add(w.place(showerPost(), -11, 0, 2.5, -Math.PI / 2));
    w.blockCircle(-11, 2.5, 0.3);

    // balcão virado para +Z: de costas para a câmera ninguém via o bar
    const bar = w.add(w.place(kiosk(0x4ec1a8, { tipo: 'suco' }), -12.5, 0, 7.2, 0.35));
    w.blockBox(-12.5, 7.2, 1.4, 1, 0.35);

    const vestiario = w.add(w.place(building(6, 3.2, 4, P.wallCream, 0x7aa6c4), 13, 0, -9));
    w.blockBox(13, -9, 3, 2);
    w.add(w.place(bench(), 13, 0, -6.6));
    w.blockBox(13, -6.6, 1, 0.35);

    // ------------------------------------------------------------ jardim
    w.setSeed(90210);
    for (const [x, z] of [[-18, -8], [-17, 1], [18, 2], [19, -6], [-19, 10], [18, 11]] as const) {
      w.add(w.place(tree('palmeira', w.range(0.95, 1.2), w.rng()), x, 0, z));
      w.blockCircle(x, z, 0.5);
    }
    for (let i = 0; i < 26; i++) {
      const x = w.range(-20, 20);
      const z = w.range(-16, 14);
      if (Math.abs(x) < 18 && z > -14 && z < 12) continue;
      w.add(w.place(i % 2 ? bush(w.range(0.7, 1.1)) : flowers(6, 1.1), x, 0, z));
    }
    for (let i = 0; i < 6; i++) {
      const c = cloud(w.range(1.8, 3));
      c.position.set(w.range(-60, 60), w.range(40, 52), w.range(-50, 30));
      w.root.add(c);
      const deriva = w.range(0.2, 0.5);
      w.onUpdate((dt) => {
        c.position.x += deriva * dt;
        if (c.position.x > 62) c.position.x = -62;
      });
    }

    // --------------------------------------------------------- cerca e saida
    w.add(w.place(fence(30, 1.4, P.metalWhite), -6, 0, 14));
    w.add(w.place(fence(14, 1.4, P.metalWhite), 12, 0, 14));
    w.blockBox(-6, 14, 15, 0.2);
    w.blockBox(12, 14, 7, 0.2);

    const portao = w.add(w.place(fence(4, 1.6, P.gold), 3.5, 0, 14));

    w.door({
      x: 3.5, z: 13,
      to: 'villa-lobos', entry: 'clube',
      label: 'Voltar pro parque', icon: '🌳',
      highlight: portao,
      radius: 2.2,
    });

    // -------------------------------------------------------------- respingos
    interface Respingo {
      mesh: THREE.Mesh;
      vy: number;
      vida: number;
    }
    const respingos: Respingo[] = [];
    const espirrar = (x: number, z: number, quantos = 12): void => {
      g.som('agua'); // todo respingo faz barulho: piscina, trampolim e chuveiro
      for (let i = 0; i < quantos; i++) {
        const gota = new THREE.Mesh(
          new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 5),
          flat(0xdff4ff, 0.9),
        );
        const a = (i / quantos) * Math.PI * 2;
        const r = 0.2 + Math.random() * 0.5;
        gota.position.set(x + Math.cos(a) * r, -0.1, z + Math.sin(a) * r);
        w.root.add(gota);
        respingos.push({ mesh: gota, vy: 2.2 + Math.random() * 2.4, vida: 1 });
      }
    };

    // -------------------------------------------------------------- a agua
    let molhadoJog = 0;
    let molhadoPar = 0;
    let jaNadou = false;

    w.onUpdate((dt, t) => {
      // ondulacao de superficie
      agua.position.y = -0.12 + Math.sin(t * 1.4) * 0.015;

      boias.forEach((b, i) => {
        b.position.y = -0.05 + Math.sin(t * 1.1 + i * 1.7) * 0.05;
        b.rotation.y = Math.sin(t * 0.4 + i) * 0.4;
      });

      const pj = g.playerPosition();
      const pp = g.companionPosition();
      const alvoJog = dentroDaPiscina(pj.x, pj.z, 0.2) ? 1 : 0;
      const alvoPar = dentroDaPiscina(pp.x, pp.z, 0.2) ? 1 : 0;

      // transicao suave: sem isso o corpo pula 90cm de uma vez na borda
      molhadoJog += (alvoJog - molhadoJog) * Math.min(1, dt * 5);
      molhadoPar += (alvoPar - molhadoPar) * Math.min(1, dt * 5);
      g.submergePlayer(molhadoJog);
      g.submergeCompanion(molhadoPar);

      if (alvoJog === 1 && !jaNadou) {
        jaNadou = true;
        espirrar(pj.x, pj.z, 10);
        g.toast('Água morninha', '💦');
        g.unlock({
          id: 'piscina-clube',
          title: 'A piscina do clube',
          place: 'Clube',
          note: 'A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.',
          icon: '🏊',
        });
      }

      for (let i = respingos.length - 1; i >= 0; i--) {
        const r = respingos[i];
        r.vy -= 9 * dt;
        r.mesh.position.y += r.vy * dt;
        r.vida -= dt * 0.9;
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, r.vida);
        if (r.vida <= 0 || r.mesh.position.y < -0.6) {
          w.root.remove(r.mesh);
          r.mesh.geometry.dispose();
          respingos.splice(i, 1);
        }
      }
    });

    // ----------------------------------------------------------- interacoes
    // objeto invisivel que carrega o personagem durante o pulo
    const salto = new THREE.Object3D();
    w.root.add(salto);

    w.interact({
      id: 'clube:trampolim',
      x: 0, z: PISCINA.z - PISCINA.profundidade / 2 - 0.6, radius: 2.2,
      label: 'Pular do trampolim', icon: '🤿',
      highlight: trampolim,
      onInteract: async (api) => {
        api.lockPlayer(true);
        await api.say(['Do trampolim?', 'Do trampolim.']);

        const partida = new THREE.Vector3(0, 0.95, PISCINA.z - PISCINA.profundidade / 2 - 0.4);
        const chegada = new THREE.Vector3(0, -0.6, PISCINA.z + 1.2);
        salto.position.copy(partida);
        api.ridePlayer(salto, new THREE.Vector3(0, 0, 0), 1);

        const duracao = 1.15;
        for (let tempo = 0; tempo < duracao; tempo += 1 / 60) {
          const k = tempo / duracao;
          salto.position.lerpVectors(partida, chegada, k);
          salto.position.y += Math.sin(k * Math.PI) * 2.6; // o arco do pulo
          await api.wait(1 / 60);
        }

        espirrar(chegada.x, chegada.z, 18);
        api.releasePlayer(chegada.x, chegada.z, Math.PI);
        api.lockPlayer(false);
        api.toast('Splash!', '💦');
        api.unlock({
          id: 'trampolim',
          title: 'O pulo do trampolim',
          place: 'Clube',
          note: 'Você jurou que não ia pular. Pulou primeiro.',
          icon: '🤿',
        });
      },
    });

    w.interact({
      id: 'clube:espreguicadeira',
      x: 9.4, z: 2.2, radius: 1.8,
      label: 'Deitar na espreguiçadeira', icon: '🌞',
      highlight: espreguicadeira,
      onInteract: async (api) => {
        await api.say([
          'Sol na cara, barulho de água, ninguém com pressa.',
          `${api.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`,
        ]);
        api.toast('+1 preguiça boa', '🌞');
      },
    });

    w.interact({
      id: 'clube:bar',
      x: -12.2, z: 9.2, radius: 2.2,
      label: 'Pedir alguma coisa gelada', icon: '🍹',
      highlight: bar,
      onInteract: async (api) => {
        api.som('sorvete'); // a mesma sineta de "toma, é seu" da sorveteria
        await api.say(['Dois sucos. Um sem gelo, que é como você gosta.']);
        api.toast('Suco gelado', '🍹');
      },
    });

    w.interact({
      id: 'clube:chuveiro',
      x: -9.8, z: 2.5, radius: 1.8,
      label: 'Tomar uma chuveirada', icon: '🚿',
      highlight: chuveiro,
      onInteract: async (api) => {
        espirrar(-10.6, 2.5, 8);
        await api.say(['Gelada. Sempre gelada.']);
      },
    });

    w.interact({
      id: 'clube:vestiario',
      x: 13, z: -6.6, radius: 2.2,
      label: 'Vestiário', icon: '🩳',
      highlight: vestiario,
      onInteract: (api) => api.say(['Cinco minutos pra trocar de roupa. Você demora quinze.']),
    });
  },
};
