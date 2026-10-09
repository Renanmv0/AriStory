import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import type { EfeitosDeTela } from '../core/posProcessamento';
import { ARI, RENAN } from '../characters/cast';
import { ajustarSombras, aroNoChao, placaDoLab } from '../world/laboratorio/comum';
import { sistemaSolar } from '../world/laboratorio/fundamentos';
import { cicloDoDia, palco, relogioDeSol } from '../world/laboratorio/luz';
import { vitrineDeMateriais } from '../world/laboratorio/materiais';
import { estacaoDeShaders } from '../world/laboratorio/estacaoShaders';
import { bolaEspelhada, quadrosDePixel, telao, tvAoVivo } from '../world/laboratorio/estacaoTexturas';
import { ceuDeEstrelas, estacaoDeGeometria, galaxia } from '../world/laboratorio/geometria';
import { bolaDePraia, consoleDoDrone, xilofone } from '../world/laboratorio/estacaoInteracao';
import { cobrinha, coracaoQueBate, robo } from '../world/laboratorio/estacaoAnimacao';
import { blocosNoVazio, chaoDoLaboratorio, mesaDeControle, portalDeSaida, pousoDeChegada } from '../world/laboratorio/plataforma';
import { Travessia } from '../world/laboratorio/travessia';

/**
 * ============================================================ O LABORATÓRIO
 *
 * O mundo DENTRO do computador do Ari: a pasta `AriStory_teste`, que a dupla
 * abre na escrivaninha do quarto e pela qual é sugada (ver `quarto.ts`). É uma
 * área de teste, de propósito: cada plataforma mostra o que uma das skills de
 * Three.js sabe fazer, com as coisas que o resto do jogo ainda não usa —
 * shader, efeito de tela, luz de verdade, clique com o mouse, ossos, morph,
 * textura ao vivo, PBR.
 *
 * A PLANTA é uma grade de 3 × 3 estações de 11 m, numa ilha de 34 m flutuando
 * no escuro (a câmera vê -Z subindo à direita e -X subindo à esquerda):
 *
 *            -X ←                                → +X
 *   -Z   fundamentos (sistema solar)   luz (palco)   materiais (vitrine)
 *        shaders (holograma, lago)     PRAÇA         texturas (telão, TV)
 *   +Z   geometria (coração, cidade)   interação     animação (robô, cobra)
 *
 * A PRAÇA do meio tem o pouso de chegada, o portal de saída, a bola espelhada
 * e a mesa de controle dos efeitos de tela (o pós-processamento).
 *
 * Cada estação tem a placa com o nome da skill, e cada experimento tem um
 * ponto de E com a conversa dos dois na primeira vez (e só a ação depois).
 * A skill de LOADERS não tem estação: carregar arquivo é justamente o que o
 * jogo não faz (ver o CLAUDE.md).
 *
 * As peças moram em `world/laboratorio/` — uma por skill. Esta cena só monta,
 * posiciona, põe colisor e liga as conversas.
 */

const LADO = 34;
const LIMITE = LADO / 2 - 0.7;

/** o centro de cada estação, no mundo */
const E = {
  fundamentos: { x: -11, z: -11 },
  luz: { x: 0, z: -11 },
  materiais: { x: 11, z: -11 },
  shaders: { x: -11, z: 0 },
  praca: { x: 0, z: 0 },
  texturas: { x: 11, z: 0 },
  geometria: { x: -11, z: 11 },
  interacao: { x: 0, z: 11 },
  animacao: { x: 11, z: 11 },
} as const;

/** onde a dupla pousa ao chegar (e o `spawn` da cena) */
const CHEGADA = { x: 0, z: 1.6 };
/** olhando para a câmera de sempre */
const OLHAR_PARA_CAMERA = Math.PI / 4;
/** de frente para a câmera de sempre: o giro que toda placa e tela usa */
const DE_FRENTE = Math.PI / 4;

/** a luz da noite do laboratório (o `ambient` da cena e o fim do ciclo do dia) */
const NOITE = {
  sky: P.labCeu,
  ambientColor: P.labLuzAmbiente,
  ambientIntensity: 0.95,
  sunColor: P.labLuar,
  sunIntensity: 0.8,
};

interface Filtro {
  nome: string;
  /** a peça do three que faz o efeito — vai na telinha da mesa */
  peca: string;
  efeitos: EfeitosDeTela | null;
}

export const laboratorio: SceneDef = {
  id: 'laboratorio',
  name: 'Dentro do computador',
  subtitle: 'a pasta AriStory_teste',
  ambient: { ...NOITE, fog: P.labCeu, fogNear: 110, fogFar: 220 },
  spawn: { x: CHEGADA.x, z: CHEGADA.z, facing: OLHAR_PARA_CAMERA },
  entries: {
    chegada: { x: CHEGADA.x, z: CHEGADA.z, facing: OLHAR_PARA_CAMERA },
  },

  build(w) {
    const g0 = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const conversa = async (g: GameAPI, falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    /** a conversa de um experimento só na primeira vez; depois, direto à ação */
    const primeiraVez = async (g: GameAPI, chave: string, falas: Array<readonly [string, string]>): Promise<void> => {
      if (g.flag(`lab:${chave}`)) return;
      g.setFlag(`lab:${chave}`);
      await conversa(g, falas);
    };
    const em = (estacao: { x: number; z: number }, x: number, z: number): THREE.Vector3 =>
      new THREE.Vector3(estacao.x + x, 0, estacao.z + z);
    const tiques: Array<(dt: number) => void> = [];

    // ================================================================ a ilha
    w.setBounds(-LIMITE, -LIMITE, LIMITE, LIMITE);
    const chao = chaoDoLaboratorio(LADO);
    w.add(chao.grupo);
    tiques.push(chao.tique);
    const estrelas = ceuDeEstrelas(() => w.rng());
    w.root.add(estrelas);
    const ceuGalactico = galaxia(() => w.rng());
    ceuGalactico.position.set(-26, -14, -26);
    ceuGalactico.rotation.set(0.5, 0, 0.3);
    w.root.add(ceuGalactico);
    tiques.push((dt) => (ceuGalactico.rotation.y += dt * 0.03));
    const vazio = blocosNoVazio(() => w.rng(), LADO);
    w.root.add(vazio.grupo);
    tiques.push(vazio.tique);

    // as placas: uma por estação, no canto de trás-direita da célula (de lá
    // ela não tapa o experimento para a câmera, que olha de +X/+Z)
    const placa = (estacao: { x: number; z: number }, titulo: string, linhas: string[], cor: number): void => {
      const p = em(estacao, 3.5, -3.6);
      w.add(w.place(placaDoLab(titulo, linhas, cor), p.x, 0, p.z, DE_FRENTE));
      w.blockBox(p.x, p.z, 1.15, 0.2, DE_FRENTE);
    };

    // ================================================================ a praça
    const pouso = pousoDeChegada();
    w.add(w.place(pouso.grupo, CHEGADA.x, 0, CHEGADA.z));
    tiques.push(pouso.tique);

    const portal = portalDeSaida();
    const PORTAL = em(E.praca, -3.0, -3.0);
    w.add(w.place(portal.grupo, PORTAL.x, 0, PORTAL.z, DE_FRENTE));
    w.blockCircle(PORTAL.x, PORTAL.z, 1.45);
    tiques.push(portal.tique);

    const bola = bolaEspelhada();
    const BOLA = em(E.praca, 3.0, -3.0);
    w.add(w.place(bola.grupo, BOLA.x, 0, BOLA.z));
    w.blockCircle(BOLA.x, BOLA.z, 0.5);
    tiques.push(bola.tique);

    const mesa = mesaDeControle();
    const MESA = em(E.praca, 3.0, 2.6);
    w.add(w.place(mesa.grupo, MESA.x, 0, MESA.z, DE_FRENTE));
    w.blockBox(MESA.x, MESA.z, 1.0, 0.42, DE_FRENTE);
    tiques.push(mesa.tique);

    const pracaPlaca = em(E.praca, -3.6, 3.4);
    w.add(w.place(
      placaDoLab('AriStory_teste', ['uma plataforma para cada skill', 'o portal leva de volta pro quarto'], P.labAmarelo),
      pracaPlaca.x, 0, pracaPlaca.z, DE_FRENTE,
    ));
    w.blockBox(pracaPlaca.x, pracaPlaca.z, 1.15, 0.2, DE_FRENTE);

    // ========================================================== fundamentos
    const solar = sistemaSolar();
    w.add(w.place(solar.grupo, E.fundamentos.x, 0, E.fundamentos.z));
    w.blockCircle(E.fundamentos.x, E.fundamentos.z, 0.6);
    tiques.push(solar.tique);
    placa(E.fundamentos, 'fundamentos', ['Object3D: pai, filho, órbita', 'cada um só gira o que carrega'], P.labSol);

    // ================================================================== luz
    const show = palco();
    w.add(w.place(show.grupo, E.luz.x, 0, E.luz.z));
    w.blockCircle(E.luz.x, E.luz.z - 1.9, 0.6);
    w.blockCircle(E.luz.x - 2.75, E.luz.z - 2.65, 0.2);
    const relogio = relogioDeSol();
    const RELOGIO = em(E.luz, 3.9, 2.0);
    w.add(w.place(relogio, RELOGIO.x, 0, RELOGIO.z, DE_FRENTE));
    w.blockCircle(RELOGIO.x, RELOGIO.z, 0.6);
    placa(E.luz, 'luz', ['PointLight, SpotLight e sombra', 'e o dia inteiro num relógio'], P.labLaranja);

    // ============================================================ materiais
    const vitrine = vitrineDeMateriais();
    w.add(w.place(vitrine.grupo, E.materiais.x, 0, E.materiais.z));
    for (const a of vitrine.amostras) {
      w.blockCircle(E.materiais.x + a.malha.position.x, E.materiais.z + a.malha.position.z, 0.38);
    }
    tiques.push(vitrine.tique);
    placa(E.materiais, 'materiais', ['dez materiais, a mesma forma', 'o toon é o do jogo'], P.labRosa);

    // ============================================================== shaders
    const shaders = estacaoDeShaders(E.shaders, () => w.rng());
    w.add(w.place(shaders.grupo, E.shaders.x, 0, E.shaders.z));
    w.blockCircle(E.shaders.x - 1.6, E.shaders.z - 2.0, 0.75);
    w.blockCircle(E.shaders.x + 1.8, E.shaders.z - 1.8, 0.6);
    w.blockCircle(shaders.lago.x, shaders.lago.z, shaders.lago.raio + 0.2);
    w.blockCircle(E.shaders.x - 4.3, E.shaders.z - 0.4, 0.4);
    tiques.push(shaders.tique);
    placa(E.shaders, 'shaders', ['holograma, dissolver, água', 'e grama de vento'], P.labHolograma);

    // ============================================================= texturas
    const tela = telao();
    const TELAO = em(E.texturas, -0.4, -3.0);
    w.add(w.place(tela.grupo, TELAO.x, 0, TELAO.z, DE_FRENTE));
    w.blockBox(TELAO.x, TELAO.z, 1.85, 0.25, DE_FRENTE);
    tiques.push(tela.tique);
    const tv = tvAoVivo(new THREE.Vector3(E.texturas.x, 0, E.texturas.z));
    const TV = em(E.texturas, 2.7, 0.3);
    w.add(w.place(tv.grupo, TV.x, 0, TV.z, DE_FRENTE));
    w.blockCircle(TV.x, TV.z, 0.72);
    const CAMERA_DE_SEGURANCA = em(E.texturas, -3.4, 2.7);
    w.add(w.place(
      tv.cameraDeSeguranca, CAMERA_DE_SEGURANCA.x, 0, CAMERA_DE_SEGURANCA.z,
      Math.atan2(E.texturas.x - CAMERA_DE_SEGURANCA.x, E.texturas.z - CAMERA_DE_SEGURANCA.z),
    ));
    w.blockCircle(CAMERA_DE_SEGURANCA.x, CAMERA_DE_SEGURANCA.z, 0.15);
    tiques.push(tv.tique);
    const quadros = quadrosDePixel();
    const QUADROS = em(E.texturas, -2.5, -0.3);
    w.add(w.place(quadros.grupo, QUADROS.x, 0, QUADROS.z, DE_FRENTE));
    w.blockBox(QUADROS.x, QUADROS.z, 1.2, 0.35, DE_FRENTE);
    tiques.push(quadros.tique);
    placa(E.texturas, 'texturas', ['canvas, câmera ao vivo, pixels', 'e a bola espelhada da praça'], P.labCiano);

    // ============================================================ geometria
    const geo = estacaoDeGeometria(() => w.rng());
    w.add(w.place(geo.grupo, E.geometria.x, 0, E.geometria.z));
    w.blockCircle(E.geometria.x - 1.4, E.geometria.z - 1.5, 0.6);
    w.blockCircle(E.geometria.x + 2.3, E.geometria.z - 1.6, 0.45);
    w.blockBox(E.geometria.x + 1.9, E.geometria.z + 1.7, 1.1, 1.1);
    w.blockCircle(E.geometria.x - 2.1, E.geometria.z + 1.7, 0.45);
    tiques.push(geo.tique);
    placa(E.geometria, 'geometria', ['extrudar, tornear, fundir', 'instanciar e só pontos'], P.labVerde);

    // ============================================================ interação
    const xilo = xilofone();
    w.add(w.place(xilo.grupo, E.interacao.x, 0, E.interacao.z));
    for (const c of xilo.cristais) w.blockCircle(E.interacao.x + c.obj.position.x, E.interacao.z + c.obj.position.z, 0.3);
    tiques.push(xilo.tique);
    const praia = bolaDePraia();
    const BOLA_DE_PRAIA = em(E.interacao, 1.9, 2.0);
    w.add(w.place(praia.grupo, BOLA_DE_PRAIA.x, 0, BOLA_DE_PRAIA.z));
    tiques.push(praia.tique);
    const drone = consoleDoDrone();
    const DRONE = em(E.interacao, -3.3, 2.3);
    w.add(w.place(drone.grupo, DRONE.x, 0, DRONE.z, DE_FRENTE));
    w.blockCircle(DRONE.x, DRONE.z, 0.62);
    tiques.push(drone.tique);
    placa(E.interacao, 'interação', ['aponte, clique e arraste', 'e pegue a câmera do drone'], P.labAzul);

    // ============================================================= animação
    const bit = robo();
    const ROBO = em(E.animacao, -0.4, -2.0);
    w.add(w.place(bit.grupo, ROBO.x, 0, ROBO.z, DE_FRENTE));
    w.blockCircle(ROBO.x, ROBO.z, 0.8);
    tiques.push(bit.tique);
    const coracao = coracaoQueBate();
    const CORACAO = em(E.animacao, 2.6, -0.5);
    w.add(w.place(coracao.grupo, CORACAO.x, 0, CORACAO.z, DE_FRENTE));
    w.blockCircle(CORACAO.x, CORACAO.z, 0.55);
    tiques.push(coracao.tique);
    const VOLTA_DA_COBRA = { x: -1.9, z: 1.7 };
    const cobra = cobrinha(VOLTA_DA_COBRA);
    w.add(w.place(cobra.grupo, E.animacao.x, 0, E.animacao.z));
    const trilho = aroNoChao(1.45, P.labVerde, 0.02);
    trilho.position.set(E.animacao.x + VOLTA_DA_COBRA.x, 0.02, E.animacao.z + VOLTA_DA_COBRA.z);
    w.add(trilho);
    tiques.push(cobra.tique);
    placa(E.animacao, 'animação', ['keyframes, ossos e morph', 'o mixer faz o meio do caminho'], P.labVermelho);

    // sem sombra para o que é luz (neon, holograma, rótulo): marcados no kit
    ajustarSombras(w.root);
    // o que é pesado e só daqui sai junto com a cena: alvos de render, o
    // reflexo da vitrine e as telas de canvas
    w.aoDesmontar(() => {
      for (const peca of [tela, tv, quadros, bola, vitrine, mesa]) peca.descartar();
    });

    // GANCHO DE TESTE (`scripts/laboratorio.mjs`): as estações, para o teste
    // perguntar o estado de cada experimento em vez de adivinhar pela foto
    w.root.userData.laboratorio = {
      solar, show, vitrine, shaders, tela, tv, quadros, geo, xilo, praia, bit, coracao, cobra, bola, portal,
      get dia() {
        return dia;
      },
      /** pula o relógio de sol para `t` (0..1): o teste não espera um dia inteiro */
      pularDiaPara(t: number) {
        if (dia !== null) dia = t;
      },
    };

    // ======================================================= a tela inteira
    /*
     * OS FILTROS DA MESA DE CONTROLE: a mesma ilha, olhada por outro filtro
     * de tela. O brilho neon é o filtro de sempre aqui dentro (é o que faz a
     * grade e os aros acenderem); a mesa troca para os outros, na ordem.
     */
    const BRILHO = { forca: 0.8, raio: 0.42, limiar: 0.92 } as const;
    const contornaveis = [
      ...xilo.cristais.map((c) => c.obj), praia.grupo, portal.grupo, shaders.presente, bit.grupo,
    ];
    const FILTROS: readonly Filtro[] = [
      { nome: 'Neon', peca: 'UnrealBloomPass', efeitos: { brilho: BRILHO } },
      { nome: 'Pixel art', peca: 'RenderPixelatedPass', efeitos: { pixel: 4, brilho: { ...BRILHO, forca: 0.5 } } },
      { nome: 'Contorno', peca: 'OutlinePass', efeitos: { contorno: { objetos: contornaveis }, brilho: BRILHO } },
      { nome: 'Rastro', peca: 'AfterimagePass', efeitos: { rastro: 0.9, brilho: BRILHO } },
      { nome: 'Filme antigo', peca: 'FilmPass + sépia', efeitos: { filme: { grao: 0.6, sepia: 0.85 } } },
      { nome: 'Quadrinho', peca: 'HalftonePass', efeitos: { quadrinho: { raio: 5 } } },
      { nome: 'Monitor de tubo', peca: 'ShaderPass próprio', efeitos: { monitor: true, brilho: BRILHO } },
      { nome: 'Lente', peca: 'ShaderPass próprio', efeitos: { lente: 0.02, brilho: BRILHO } },
      { nome: 'Glitch', peca: 'GlitchPass', efeitos: { glitch: true, brilho: BRILHO } },
      { nome: 'Sem filtro', peca: 'renderer.render()', efeitos: null },
    ];
    let filtro = 0;
    g0.telaComEfeitos(FILTROS[0].efeitos);

    // ======================================================== a travessia
    const travessia = new Travessia(w);
    const centroDoPortal = new THREE.Vector3();
    portal.grupo.updateMatrixWorld(true);
    portal.grupo.localToWorld(centroDoPortal.copy(portal.centro));

    /** a chegada: os dois caem do céu dentro do feixe do pouso */
    const chegar = async (g: GameAPI): Promise<void> => {
      pouso.acender();
      g.som('arcoIris');
      g.focusCamera(travessia.foco);
      const lado = new THREE.Vector3(Math.cos(OLHAR_PARA_CAMERA), 0, -Math.sin(OLHAR_PARA_CAMERA)).multiplyScalar(0.48);
      const meio = new THREE.Vector3(CHEGADA.x, 0, CHEGADA.z);
      await travessia.cuspir(
        g,
        new THREE.Vector3(CHEGADA.x, 6.5, CHEGADA.z),
        [meio.clone().sub(lado), meio.clone().add(lado)],
        OLHAR_PARA_CAMERA,
        1.4,
      );
      g.focusCamera(null);
      if (g.flag('lab:chegou')) return;
      g.setFlag('lab:chegou');
      await conversa(g, [
        [R, 'A gente tá… dentro do computador?'],
        [A, 'Dentro da pasta. AriStory_teste.'],
        [R, 'Cada plataforma dessas é um experimento.'],
        [A, 'Então vamos ver todos.'],
      ]);
      g.unlock({
        id: 'dentro-do-computador',
        title: 'Dentro do computador',
        place: 'AriStory_teste',
        note: 'A pasta nova da área de trabalho dele era um mundo inteiro. A gente entrou pela tela.',
        icon: '💾',
      });
    };

    // =========================================================== o tempo
    let primeiroQuadro = true;
    let dia: number | null = null;
    const ondeEstou = new THREE.Vector3();
    w.onUpdate((dt) => {
      // chegou agora pelo pouso (do computador do quarto, ou recarregando aqui)
      if (primeiroQuadro) {
        primeiroQuadro = false;
        const p = g0.playerPosition();
        if (Math.hypot(p.x - CHEGADA.x, p.z - CHEGADA.z) < 0.05) void chegar(g0);
      }
      for (const t of tiques) t(dt);

      // o holofote persegue quem está no palco
      ondeEstou.copy(g0.playerPosition());
      const noPalco = Math.hypot(ondeEstou.x - E.luz.x, ondeEstou.z - E.luz.z) < 3.6;
      show.tique(dt, noPalco ? ondeEstou : null);

      // o dia passando no relógio de sol: dezesseis segundos, e volta a noite
      if (dia !== null) {
        dia += dt / 16;
        if (dia >= 1) {
          dia = null;
          g0.luzDoCeu(null);
        } else {
          g0.luzDoCeu(cicloDoDia(dia, NOITE));
        }
      }
    });

    // ====================================================== as interações

    // ------------------------------------------------------------ a praça
    w.interact({
      id: 'lab:portal',
      x: PORTAL.x + 1.15, z: PORTAL.z + 1.15, radius: 1.7,
      label: 'Sair do computador', icon: '🌀',
      highlight: portal.grupo,
      onInteract: async (g) => {
        const sair = await g.ask('Voltar pro quarto?', ['Voltar', 'Ficar mais']);
        if (sair !== 0) return;
        portal.puxar(3);
        g.som('anel');
        g.focusCamera(travessia.foco);
        await travessia.sugar(g, centroDoPortal, 1.6);
        g.goTo('quarto', 'do-computador', 'digital');
      },
    });

    w.interact({
      id: 'lab:mesa',
      x: MESA.x + 0.95, z: MESA.z + 0.95, radius: 1.7,
      label: 'Trocar o filtro da tela', icon: '🎛️',
      highlight: mesa.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'mesa', [
          [A, 'Essa mesa muda o filtro da tela inteira.'],
          [R, 'O mundo continua igual. Só muda o jeito de olhar pra ele.'],
        ]);
        filtro = (filtro + 1) % FILTROS.length;
        const f = FILTROS[filtro];
        g.telaComEfeitos(f.efeitos);
        mesa.mostrar(f.nome, f.peca);
        g.som('clique');
        g.toast(`Filtro: ${f.nome}`, '🎛️');
      },
    });

    w.interact({
      id: 'lab:bola-espelhada',
      x: BOLA.x + 0.9, z: BOLA.z + 0.9, radius: 1.5,
      label: 'Olhar a bola espelhada', icon: '🪩',
      highlight: bola.grupo,
      onInteract: (g) => conversa(g, [
        [R, 'Ela reflete tudo. Até a gente.'],
        [A, 'Ela tira seis fotos do mundo, uma pra cada lado, e se veste com elas.'],
      ]),
    });

    // ----------------------------------------------------- fundamentos
    w.interact({
      id: 'lab:sistema-solar',
      x: E.fundamentos.x + 1.4, z: E.fundamentos.z + 1.4, radius: 1.9,
      label: 'Mexer no sistema solar', icon: '☀️',
      highlight: solar.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'solar', [
          [A, 'O planeta Ari, o planeta Renan e a lua Pelusa.'],
          [R, 'A lua gira em volta de mim, e eu giro em volta do sol.'],
          [A, 'Ninguém faz conta. Cada um só gira o que carrega, e o resto vai junto.'],
        ]);
        const ligar = !solar.eixosVisiveis;
        solar.mostrarEixos(ligar);
        solar.velocidade = ligar ? 2.5 : 1;
        g.som('escolha');
        g.toast(ligar ? 'Eixos: vermelho X, verde Y, azul Z' : 'Eixos desligados', '🧭');
      },
    });

    // ------------------------------------------------------------- luz
    w.interact({
      id: 'lab:palco',
      x: E.luz.x + 0.9, z: E.luz.z + 1.4, radius: 1.7,
      label: 'Trocar as luzes do palco', icon: '💡',
      highlight: show.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'palco', [
          [R, 'Vermelho com verde dá amarelo?'],
          [A, 'Em luz, dá. As três juntas dão branco.'],
        ]);
        const modo = show.trocarModo();
        g.som('clique');
        g.toast(
          modo === 'holofote' ? 'Palco: o holofote segue vocês' : modo === 'cores' ? 'Palco: só as três cores' : 'Palco: o show inteiro',
          '💡',
        );
      },
    });

    w.interact({
      id: 'lab:relogio-de-sol',
      x: RELOGIO.x + 0.9, z: RELOGIO.z + 0.9, radius: 1.5,
      label: 'Passar um dia inteiro', icon: '🌗',
      highlight: relogio,
      onInteract: async (g) => {
        if (dia !== null) return;
        await primeiraVez(g, 'relogio', [
          [A, 'Quer ver um dia inteiro passar em dezesseis segundos?'],
          [R, 'Olha a nossa sombra girando.'],
        ]);
        dia = 0;
        g.som('arcoIris');
        g.toast('Amanhecendo…', '🌅');
      },
    });

    // -------------------------------------------------------- materiais
    w.interact({
      id: 'lab:vitrine',
      x: E.materiais.x + 0.6, z: E.materiais.z + 2.4, radius: 1.9,
      label: 'Trocar a forma das amostras', icon: '🔮',
      highlight: vitrine.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'vitrine', [
          [R, 'Por que tudo no jogo parece desenho?'],
          [A, 'Por causa daquela amarela do meio, a toon.'],
          [A, 'As outras brilham, refletem, entortam a luz. Ela só pinta em degraus.'],
        ]);
        const forma = vitrine.trocarForma();
        g.som('escolha');
        g.toast(`Forma: ${forma}`, '🔮');
      },
    });

    // ---------------------------------------------------------- shaders
    w.interact({
      id: 'lab:holograma',
      x: E.shaders.x - 0.6, z: E.shaders.z - 1.0, radius: 1.5,
      label: 'Ver o holograma', icon: '👥',
      highlight: shaders.holograma,
      onInteract: (g) => conversa(g, [
        [R, 'Somos nós. Feitos de luz.'],
        [A, 'Um shader desenha a gente pixel por pixel. Olha a borda acendendo.'],
      ]),
    });

    w.interact({
      id: 'lab:presente',
      x: E.shaders.x + 2.6, z: E.shaders.z - 1.0, radius: 1.5,
      label: 'Abrir o presente', icon: '🎁',
      highlight: shaders.presente,
      onInteract: async (g) => {
        await primeiraVez(g, 'presente', [
          [R, 'Um presente? Pra mim?'],
          [A, 'Abre e vê.'],
        ]);
        if (!shaders.abrirPresente()) return;
        g.som('brotar');
        await g.wait(1.4);
        g.soltarCoracoes(2);
      },
    });

    w.interact({
      id: 'lab:lago',
      x: shaders.lago.x + 2.0, z: shaders.lago.z + 0.6, radius: 1.5,
      label: 'Jogar uma pedrinha', icon: '🪨',
      highlight: shaders.lagoMalha,
      onInteract: async (g) => {
        const a = w.rng() * Math.PI * 2;
        const r = w.rng() * shaders.lago.raio * 0.7;
        shaders.agua.pedrinha(shaders.lago.x + Math.cos(a) * r, shaders.lago.z + Math.sin(a) * r);
        g.som('pingo');
        await primeiraVez(g, 'lago', [[A, 'Dá pra clicar direto na água também. Ela ondula onde o clique cai.']]);
      },
    });
    w.clicavel(shaders.lagoMalha, {
      dica: 'Clique para jogar uma pedrinha',
      alturaDaDica: 0.5,
      aoClicar: (g, ponto) => {
        shaders.agua.pedrinha(ponto.x, ponto.z);
        g.som('pingo');
      },
    });

    w.interact({
      id: 'lab:ventilador',
      x: E.shaders.x - 3.3, z: E.shaders.z + 0.5, radius: 1.5,
      label: 'Ligar o ventilador', icon: '🌬️',
      highlight: shaders.ventilador,
      onInteract: async (g) => {
        shaders.ligarVentilador();
        g.som('anel');
        await primeiraVez(g, 'vento', [
          [R, 'Mil e seiscentas folhas, e o computador mexe uma por uma?'],
          [A, 'Todas de uma vez. Quem dobra cada folha é a placa de vídeo.'],
        ]);
      },
    });

    // --------------------------------------------------------- texturas
    w.interact({
      id: 'lab:telao',
      x: TELAO.x + 1.1, z: TELAO.z + 1.1, radius: 1.7,
      label: 'Trocar o programa do telão', icon: '📺',
      highlight: tela.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'telao', [
          [A, 'Isso é um desenho 2D, pintado doze vezes por segundo e colado na tela.'],
        ]);
        const programa = tela.trocarPrograma();
        g.som('tv');
        g.toast(programa === 'plasma' ? 'Telão: plasma' : programa === 'relogio' ? 'Telão: relógio' : 'Telão: letreiro', '📺');
      },
    });

    w.interact({
      id: 'lab:tv',
      x: TV.x + 0.85, z: TV.z + 0.85, radius: 1.5,
      label: 'Trocar o canal da TV', icon: '📡',
      highlight: tv.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'tv', [
          [R, 'Câmera de segurança? Quem colocou isso aqui?'],
          [A, 'É outra câmera do próprio jogo. O que ela vê vira textura na TV.'],
        ]);
        const canal = tv.trocarCanal();
        g.som('tv');
        g.toast(canal === 'seguranca' ? 'Canal 1: câmera de segurança' : canal === 'de-cima' ? 'Canal 2: vista de cima' : 'Canal 3: chuvisco', '📡');
      },
    });

    w.interact({
      id: 'lab:quadros',
      x: QUADROS.x + 0.9, z: QUADROS.z + 0.9, radius: 1.5,
      label: 'Olhar os quadros de pixel', icon: '🖼️',
      highlight: quadros.grupo,
      onInteract: (g) => conversa(g, [
        [R, 'É o mesmo coração duas vezes.'],
        [A, 'Dezesseis por dezesseis pixels. Num, cada pixel vira um quadradinho.'],
        [A, 'No outro, o computador borra pra esconder os quadradinhos.'],
      ]),
    });

    // -------------------------------------------------------- geometria
    w.interact({
      id: 'lab:triangulos',
      x: E.geometria.x + 0.4, z: E.geometria.z + 0.3, radius: 1.9,
      label: 'Ver os triângulos', icon: '🔺',
      highlight: geo.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'triangulos', [
          [A, 'Tudo aqui é feito de triângulo.'],
          [R, `São ${geo.triangulos.toLocaleString('pt-BR')} só nessa plataforma.`],
        ]);
        const ligar = !geo.triangulosVisiveis;
        geo.mostrarTriangulos(ligar);
        g.som('escolha');
        g.toast(ligar ? 'Arame ligado' : 'Arame desligado', '🔺');
      },
    });

    // -------------------------------------------------------- interação
    for (const cristal of xilo.cristais) {
      w.clicavel(cristal.obj, {
        dica: `Cristal: ${cristal.nome}`,
        alturaDaDica: 1.75,
        aoPassar: (dentro) => cristal.acender(dentro),
        aoClicar: (g) => {
          cristal.tocar();
          g.som(cristal.som);
        },
      });
    }
    w.interact({
      id: 'lab:xilofone',
      x: E.interacao.x, z: E.interacao.z + 0.8, radius: 1.7,
      label: 'Tocar os cristais', icon: '🎹',
      highlight: xilo.grupo,
      onInteract: async (g) => {
        // de um em um, da ponta à outra: a escala do teclado e do dedo
        for (const cristal of xilo.cristais) {
          cristal.tocar();
          g.som(cristal.som);
          await g.wait(0.16);
        }
        await primeiraVez(g, 'cristais', [
          [R, 'Dá pra tocar com o mouse também. Passa em cima e clica.'],
        ]);
      },
    });

    const AREA_DA_BOLA = { minX: E.interacao.x - 4.6, maxX: E.interacao.x + 4.6, minZ: E.interacao.z - 0.2, maxZ: E.interacao.z + 4.6 };
    w.clicavel(praia.grupo, {
      dica: 'Arraste a bola',
      alturaDaDica: 1.2,
      arrastar: {
        altura: praia.raio,
        aoArrastar: (ponto) => {
          praia.rolarAte(
            THREE.MathUtils.clamp(ponto.x, AREA_DA_BOLA.minX, AREA_DA_BOLA.maxX),
            THREE.MathUtils.clamp(ponto.z, AREA_DA_BOLA.minZ, AREA_DA_BOLA.maxZ),
          );
        },
        aoSoltar: () => {
          praia.soltar();
          g0.som('quicar');
        },
      },
    });

    w.interact({
      id: 'lab:drone',
      x: DRONE.x + 0.95, z: DRONE.z + 0.95, radius: 1.5,
      label: 'Pilotar o drone', icon: '🚁',
      highlight: drone.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'drone', [
          [A, 'Arrasta pra girar a câmera, e a rodinha aproxima. No celular, é com o dedo.'],
        ]);
        g.lockPlayer(true);
        g.cameraLivre(new THREE.Vector3(0, 0.5, 0));
        g.som('menu');
        await g.ask('Câmera do drone no ar.', ['Voltar']);
        g.cameraLivre(null);
        g.lockPlayer(false);
      },
    });

    // --------------------------------------------------------- animação
    w.interact({
      id: 'lab:robo',
      x: ROBO.x + 0.95, z: ROBO.z + 0.95, radius: 1.6,
      label: 'Trocar a dança do Bit', icon: '🤖',
      highlight: bit.grupo,
      onInteract: async (g) => {
        await primeiraVez(g, 'robo', [
          [R, 'Ele tem nome?'],
          [A, 'Bit. Cada dança dele é uma lista de poses, e o computador inventa o meio do caminho.'],
        ]);
        const danca = bit.trocarDanca();
        g.som('escolha');
        g.toast(`Bit: ${danca === 'parado' ? 'descansando' : danca === 'acenar' ? 'acenando' : danca === 'pular' ? 'pulando' : 'dançando'}`, '🤖');
      },
    });

    w.interact({
      id: 'lab:coracao',
      x: CORACAO.x + 0.85, z: CORACAO.z + 0.85, radius: 1.5,
      label: 'Fazer o coração bater', icon: '💓',
      highlight: coracao.grupo,
      onInteract: async (g) => {
        coracao.animar();
        g.som('coracao');
        g.soltarCoracoes(1);
        await primeiraVez(g, 'coracao', [
          [A, 'Ele começa bola e vira coração.'],
          [R, 'Clichê.'],
          [A, 'Funciona.'],
        ]);
      },
    });

    w.interact({
      id: 'lab:cobrinha',
      x: E.animacao.x + VOLTA_DA_COBRA.x + 1.6, z: E.animacao.z + VOLTA_DA_COBRA.z + 1.6, radius: 1.6,
      label: 'Olhar a cobrinha', icon: '🐍',
      highlight: cobra.grupo,
      onInteract: (g) => conversa(g, [
        [R, 'Ela é uma peça só?'],
        [A, 'Uma só, com quinze ossos dentro. Mexe os ossos, e o corpo vai junto.'],
      ]),
    });
  },
};
