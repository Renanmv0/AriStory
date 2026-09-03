import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import { flat } from '../core/materials';
import {
  bin, bleachers, bus, busStop, bush, canteiro, canteiroComPalmeira,
  cloud, divingBoard,
  floatRing, floodlight, flowers, kiosk, lamp, mesinhaDeDeque, parasol, pergolado, poolLadder,
  mesaDePatio, poolShell, poolWater, restaurante, showerPost, sunLounger, textSign,
  tree, vestiario as predioDoVestiario, waterFountain,
  dogWaiter, pratoServido,
} from '../world/props';
import { ARI, RENAN } from '../characters/cast';
import { ITENS, MODA_PRAIA } from '../world/itens';
import { pratoPorId } from '../world/cardapioData';
import { pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';

/**
 * Clube — a piscina.
 *
 * Cenário do que ainda não aconteceu: a gente ainda não foi, então o jogo vai
 * na frente. A piscina é um buraco de verdade no piso (`w.groundWithHoles`),
 * e quem entra na água afunda e passa a nadar.
 */

const PISCINA = { x: 0, z: -3, largura: 16, profundidade: 10, fundo: 1.6 };

/**
 * O piso do clube. Ele cresceu de 34×26 para 48×38 — a grama virou uma moldura
 * fina em volta em vez de metade da tela, e sobrou deck para as atrações que
 * ainda vão entrar.
 *
 * A PISCINA NÃO SE MEXE. O furo que o `groundWithHoles` abre no piso é o que
 * deixa quem afunda continuar visível; ele sai de `PISCINA`, não daqui, então
 * mexer no deck nunca arrasta o buraco junto.
 */
const DECK = { z: -2, largura: 48, profundidade: 38 };

/**
 * Onde o ônibus encosta: canto de baixo à ESQUERDA, deitado ao longo do Z.
 *
 * Ele tem 2,9 de altura, e a câmera isométrica vem de `+X/+Z` — o que estiver
 * com x ou z maior que o jogador é desenhado NA FRENTE dele. Na borda de baixo
 * (`+Z`, onde estava a cerca) um ônibus taparia quem fosse embarcar; na borda
 * da esquerda ele fica ATRÁS de quem chega, e ainda mostra a porta, que é o
 * lado interessante.
 */
const PARADA = { x: -21, z: 9 };

/**
 * O ponto de embarque, na frente da porta do ônibus.
 *
 * Depois do giro de `PI/2` a porta (local `x = 2,6`, `z = 1,25`) cai em
 * `(+1,25, -2,6)` do centro da peça. O `+2,4` em X é ela mais a folga do corpo,
 * senão quem nasce aqui já nasce dentro do colisor.
 */
const EMBARQUE = { x: PARADA.x + 2.4, z: PARADA.z - 2.6 };

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
  // Quem chega, chega DE ÔNIBUS: o ponto de entrada é a porta dele, virado
  // para dentro do clube (+X). Antes era o portão da cerca, no meio da borda
  // de baixo — a cerca saiu e o ônibus tomou o lugar dela.
  spawn: { x: EMBARQUE.x, z: EMBARQUE.z, facing: Math.PI / 2 },
  entries: {
    portaria: { x: EMBARQUE.x, z: EMBARQUE.z, facing: Math.PI / 2 },
    beira: { x: 0, z: 3.5, facing: Math.PI },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;
    const buraco = {
      x: PISCINA.x,
      z: PISCINA.z,
      width: PISCINA.largura,
      depth: PISCINA.profundidade,
    };

    // -------------------------------------------------------------- terreno
    // grama e deck precisam do MESMO furo, senao a grama aparece no fundo da piscina
    // As texturas são desenhadas em canvas na hora (`world/texturasDeChao.ts`)
    // e MULTIPLICAM a cor: elas dão junta de placa e tufo de grama sem trocar o
    // tom nem custar uma malha a mais. Antes o clube era duas cores chapadas,
    // e de longe parecia papel colorido.
    w.groundWithHoles({
      width: 160, depth: 160, color: P.grass, holes: [buraco],
      textura: tapeteDeGrama(9),
    });
    // O furo do `groundWithHoles` é LOCAL à malha: ele acaba em
    // `opts.z + hole.z` no mundo. A grama nasce em `z = 0`, então para ela o
    // furo já cai no lugar; o deck nasce deslocado, e o furo dele precisa
    // descontar esse deslocamento.
    //
    // Isso já estava errado por 1 unidade antes desta mudança (deck em `-1`,
    // piscina em `-3`) — é a faixa de grama que aparecia colada na borda de
    // trás da piscina, com o trampolim em cima dela. Com o deck maior o erro
    // ia dobrar, então ele morre aqui.
    w.groundWithHoles({
      width: DECK.largura,
      depth: DECK.profundidade,
      color: 0xe4e0d6,
      y: 0.015,
      z: DECK.z,
      holes: [{ ...buraco, z: buraco.z - DECK.z }],
      // placa de 2 m, que é o tamanho de piso de borda de piscina de verdade
      textura: pisoDePlacas(2),
    });
    // o limite de caminhada fica DENTRO do deck: assim ninguém pisa na grama,
    // que agora é só a moldura de fora
    w.setBounds(-22, -19, 22, 16);

    // ------------------------------------------------------------- piscina
    w.add(w.place(poolShell(PISCINA.largura, PISCINA.profundidade, PISCINA.fundo), PISCINA.x, 0, PISCINA.z));
    const agua = poolWater(PISCINA.largura, PISCINA.profundidade);
    agua.position.set(PISCINA.x, -0.12, PISCINA.z);
    w.root.add(agua);

    // linhas de raia pintadas no fundo — decalque: colada no piso da piscina,
    // ela so nao briga com ele porque nao grava profundidade
    for (const x of [-5.2, -1.8, 1.8, 5.2]) {
      const raia = new THREE.Mesh(
        new THREE.PlaneGeometry(0.24, PISCINA.profundidade - 1.4),
        flat(0x3f8ab0, 1, true),
      );
      raia.rotation.x = -Math.PI / 2;
      raia.position.set(PISCINA.x + x, -PISCINA.fundo + 0.08, PISCINA.z);
      raia.renderOrder = 1;
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

    // O vestiário foi para o FUNDO do deck (era `13, -9`), encostado no limite
    // novo: no meio do cenário ele tapava a piscina, e lá atrás a câmera pega a
    // fachada dele de frente sem esconder nada. A peça genérica `building()`
    // deu lugar ao `vestiario()`, que tem a meia parede de azulejo, o cobogó, a
    // marquise sobre as portas e a caixa d'água.
    const vestiario = w.add(w.place(predioDoVestiario(8, 5), 15, 0, -18));
    w.blockBox(15, -18, 4.2, 2.7);
    // O banco saiu de perto da piscina e foi para a lateral direita, virado
    // para a água (`-X`). Ele já tinha saído da frente da porta do vestiário
    // uma vez — quem chegasse na porta só via "Sentar no banco" — e agora que a
    // porta mudou de lugar ele continua longe dela.
    w.banco(14, -3, -Math.PI / 2);

    // ------------------------------------------- deque de descanso da piscina
    /**
     * O lado LESTE da piscina era o pedaço mais vazio do deck: só o banco e uma
     * espreguiçadeira solta num campo de concreto. Ele virou o deque de
     * descanso — tábua corrida, pergolado no fundo, duas espreguiçadeiras de
     * frente para a água e uma mesinha com os sucos.
     *
     * O CHÃO É DECALQUE, e não um estrado levantado. O jogo não tem altura de
     * caminhada: um deque de 18 cm de verdade deixaria a dupla andando no ar em
     * cima dele. Tábua pintada no chão resolve a leitura e não quebra nada — é
     * o mesmo caminho do deque do restaurante.
     */
    const DESCANSO = { x: 14.5, z: -2.1, largura: 9, profundidade: 10.4 };
    w.patch(DESCANSO.x, DESCANSO.z, DESCANSO.largura, DESCANSO.profundidade, P.dequeTabua, 0, 0.02);
    for (let i = 0; i < 12; i++) {
      const z = DESCANSO.z - DESCANSO.profundidade / 2 + 0.5 + i * 0.85;
      w.patch(DESCANSO.x, z, DESCANSO.largura - 0.4, 0.1, P.dequeRipa, 0, 0.024);
    }

    /**
     * O PERGOLADO vai no fundo (`z` menor), com as espreguiçadeiras à frente.
     * A cobertura fica a 2,91 e a câmera olha em 34°: ela esconderia qualquer
     * coisa até 4,3 à frente dela. Atrás não esconde nada — por isso ele é
     * fundo de cena, e não teto de quem está deitado.
     */
    const PERGOLA = { x: 14.5, z: -5.6, largura: 8, profundidade: 3.2 };
    w.add(w.place(pergolado(PERGOLA.largura, PERGOLA.profundidade), PERGOLA.x, 0, PERGOLA.z));
    for (const dx of [-3.75, 0, 3.75]) {
      for (const dz of [-1.35, 1.35]) {
        w.blockCircle(PERGOLA.x + dx, PERGOLA.z + dz, 0.26);
      }
    }

    /**
     * As duas espreguiçadeiras, lado a lado e com a cabeceira no `+X` — de pé
     * para a piscina, que é a única coisa que faz sentido olhar daqui.
     */
    const DEITAR = { x: 13.8, z: -0.2, vao: 0.7 };
    for (const dz of [-DEITAR.vao, DEITAR.vao]) {
      w.add(w.place(sunLounger(dz < 0 ? P.fabricBlue : 0xff8fb1), DEITAR.x, 0, DEITAR.z + dz, -Math.PI / 2));
      w.blockBox(DEITAR.x, DEITAR.z + dz, 0.85, 0.36);
    }
    w.add(w.place(mesinhaDeDeque(), 15.5, 0, DEITAR.z));
    w.blockCircle(15.5, DEITAR.z, 0.42);

    /**
     * A âncora de deitar, em DOIS objetos encaixados de propósito.
     *
     * O rig deitado é o rig em pé girado: `rotation.x = -PI/2` leva o `+Y` local
     * (a cabeça) para o `-Z` do mundo, e é assim que a cama do quarto funciona.
     * Aqui a cabeceira aponta para o `+X`, então falta um giro a mais — e
     * escrever os dois numa Euler só depende da ordem em que o three aplica os
     * eixos. Dois objetos aninhados não deixam dúvida: o de fora vira, o de
     * dentro deita.
     *
     * Depois dos dois giros, no referencial de dentro:
     *   `+Y` → `+X` (a cabeceira)   `+Z` → `+Y` (eles olham para o céu)
     *   `+X` → `+Z` (é ele que separa um do outro)
     *
     * O `y` é o pano da espreguiçadeira (0,45) mais a folga de meio corpo.
     * A folga da cama (0,25) deixava os dois BOIANDO um palmo acima da lona —
     * um colchão é fofo e afunda, uma lona esticada não. Com 0,17 as costas
     * encostam no pano.
     */
    const viradaDoDeque = new THREE.Object3D();
    viradaDoDeque.position.set(DEITAR.x, 0.62, DEITAR.z);
    viradaDoDeque.rotation.y = -Math.PI / 2;
    w.root.add(viradaDoDeque);
    const deitadosNoDeque = new THREE.Object3D();
    deitadosNoDeque.rotation.x = -Math.PI / 2;
    viradaDoDeque.add(deitadosNoDeque);

    w.interact({
      id: 'clube:deque',
      x: DEITAR.x, z: DEITAR.z, radius: 2.4,
      label: 'Descansar no deque', icon: '🌴',
      onInteract: async (g) => {
        const quer = await g.ask('Deitar um pouco ao sol?', ['Deitar', 'Agora não']);
        if (quer !== 0) {
          await conversa([
            [R, 'Se eu deitar agora eu durmo.'],
            [A, 'É esse o plano.'],
          ]);
          return;
        }

        g.lockPlayer(true);
        // O `-0,65` no `y` local (que é o eixo do corpo) EMPURRA OS DOIS PARA
        // OS PÉS DA ESPREGUIÇADEIRA. O rig deitado nasce quase todo à frente da
        // âncora — a cabeça fica a 1,28 dela e os pés a 0,26 atrás —, então
        // ancorar no meio do móvel deixava a cabeça para fora do móvel, boiando
        // sobre o deque. É o mesmo recuo que a cama do quarto faz na posição da
        // âncora; aqui ele mora no offset porque a âncora é a mesma para os dois.
        g.ridePlayer(deitadosNoDeque, new THREE.Vector3(-DEITAR.vao, -0.65, 0), 1, 0);
        g.rideCompanion(deitadosNoDeque, new THREE.Vector3(DEITAR.vao, -0.65, 0), 1, 0);
        g.setLying(true);
        // Câmera quase de cima, e não a isométrica: deitados, os dois ficam
        // deitados NA direção que a isométrica encurta, e viram dois tocos ao
        // lado das cabeças. De cima aparecem inteiros, lado a lado.
        g.setCameraOmbro(
          new THREE.Vector3(DEITAR.x - 1.4, 4.6, DEITAR.z + 2.6),
          new THREE.Vector3(DEITAR.x + 0.3, 0.5, DEITAR.z),
        );
        await g.wait(1.1);

        await conversa([
          [R, 'O sol tá bom demais.'],
          [A, 'A gente veio pra nadar.'],
          [R, 'A gente veio pra ficar. Nadar foi ideia sua.'],
        ]);

        const ficar = await g.ask('Ficar mais um pouco?', ['Fica', 'Levantar']);
        if (ficar === 0) {
          await conversa([
            [A, 'Nem precisa falar nada.'],
            [R, 'Tô só ouvindo a água.'],
          ]);
          await g.wait(2.4);
        }

        g.setLying(false);
        g.setCameraOmbro(null);
        g.releasePlayer(DEITAR.x, DEITAR.z + 2.4, 0);
        g.releaseCompanion(DEITAR.x + 1.2, DEITAR.z + 2.4, 0);
        g.lockPlayer(false);

        g.unlock({
          id: 'deque-do-clube',
          title: 'A tarde no deque',
          place: 'Clube',
          note: 'Duas espreguiçadeiras, dois sucos e a sombra do pergolado chegando devagar.',
          icon: '🌴',
        });
      },
    });

    // -------------------------------------------------------- restaurante
    // Ele fica no fundo à ESQUERDA, o canto mais vazio do deck. Com `x` e `z`
    // menores que os da piscina, a câmera (que vem de `+X/+Z`) o desenha ATRÁS
    // de tudo: um prédio de 5,5 de altura no meio do cenário taparia a água.
    const RESTAURANTE = { x: -17, z: -14, largura: 13, profundidade: 7 };
    const fachadaZ = RESTAURANTE.z + RESTAURANTE.profundidade / 2;

    const predio = w.add(w.place(
      restaurante(RESTAURANTE.largura, RESTAURANTE.profundidade),
      RESTAURANTE.x, 0, RESTAURANTE.z,
    ));
    // a caixa vai um pouco além da parede para engolir os dois degraus da
    // entrada — sem isso o jogador sobe neles e fica com o pé no ar
    w.blockBox(RESTAURANTE.x, RESTAURANTE.z, RESTAURANTE.largura / 2 + 0.3, RESTAURANTE.profundidade / 2 + 0.9);

    // O DEQUE da área externa, em ripas. Decalque não briga com decalque, e a
    // ordem de criação é que manda: o deque primeiro, as ripas por cima.
    const DEQUE = { x: -16.5, z: -6.8, largura: 12.4, profundidade: 7 };
    w.patch(DEQUE.x, DEQUE.z, DEQUE.largura, DEQUE.profundidade, P.restauranteDeck, 0, 0.02);
    for (let i = 0; i < 9; i++) {
      const z = DEQUE.z - DEQUE.profundidade / 2 + 0.5 + i * 0.78;
      w.patch(DEQUE.x, z, DEQUE.largura - 0.3, 0.1, P.restauranteDeckRipa, 0, 0.024);
    }

    // As mesas, em duas fileiras desencontradas — enfileirar tudo em grade
    // deixa com cara de refeitório, e não de área externa.
    /** a mesa em que a dupla senta; as outras quatro são cenário */
    const MESA = { x: -16.5, z: -6.6 };
    for (const [x, z] of [
      [-20.6, -8.6], [MESA.x, MESA.z], [-12.4, -8.6], [-18.6, -4.2], [-13.6, -4.2],
    ] as const) {
      w.add(w.place(mesaDePatio(), x, 0, z));
      // o raio pega a mesa mais as quatro cadeiras; sobra 1,4 de vão entre uma
      // mesa e a vizinha, e o jogador tem 0,42 de raio
      w.blockCircle(x, z, 1.25);
    }

    // ---------------------------------------------- a mesa em que se senta
    /**
     * A âncora carrega os dois durante a cena. A rotação dela é `0`, e quem
     * decide para onde cada um olha é o `facing` do `ride*`: `PI` para quem
     * senta na cadeira do `+Z` e `0` para quem senta na do `-Z`. Uma âncora só
     * não pode olhar para dois lados — é a mesma solução da mesa de piquenique.
     */
    const mesaPosta = new THREE.Object3D();
    mesaPosta.position.set(MESA.x, 0, MESA.z);
    w.root.add(mesaPosta);
    const foco = new THREE.Object3D();
    foco.position.set(MESA.x, 1.0, MESA.z);
    w.root.add(foco);
    /** as cadeiras nascem a 1,02 do centro, e o assento tem o topo em 0,485 */
    const CADEIRA = 1.02;
    const ALTURA = 0.02;

    /**
     * O GARÇOM CANINO leva o prato da porta do restaurante até a mesa.
     *
     * O prato viaja como FILHO da bandeja nas costas do cachorro, e não copiado
     * frame a frame: assim ele acompanha o passo de graça, sem tremer. Na
     * entrega, o `attach` do three troca o pai para a âncora da mesa MANTENDO a
     * posição no mundo — é isso que faz o prato pousar em vez de saltar.
     *
     * Tudo nasce e morre dentro desta função. O cachorro é criado no pedido e
     * `dispose`ado ao sair de cena: peça de cutscene que fica pendurada no
     * mundo depois vira lixo que ninguém lembra de limpar.
     */
    /** o passo do garçom no frame atual; o loop do mundo empurra ele */
    let passoDoGarcom: ((dt: number) => void) | null = null;
    w.onUpdate((dt) => passoDoGarcom?.(dt));

    const servir = async (api: GameAPI, idDoPrato: string): Promise<void> => {
      const comida = pratoServido(idDoPrato);
      if (!comida) return;

      const cachorro = dogWaiter();
      const bandeja = cachorro.userData.bandeja as THREE.Object3D;
      bandeja.add(comida);

      // A porta do restaurante, que é de onde ele sai, e o lado da mesa em que
      // ele para.
      //
      // Ele encosta pelo `+X` da mesa, e não pelo `-X`. A câmera vem de
      // `+X/+Z` e desenha na frente o que tem soma maior: parado do lado de lá,
      // o cachorro ficava atrás de quem senta na cadeira de perto e a entrega
      // inteira acontecia escondida por uma cabeça.
      const PORTA = { x: RESTAURANTE.x, z: fachadaZ + 0.9 };
      const CHEGADA = { x: MESA.x + 1.5, z: MESA.z };
      cachorro.position.set(PORTA.x, 0, PORTA.z);
      w.add(cachorro);
      api.som('latido');

      /**
       * Anda de um ponto ao outro, virado para onde vai, e balançando.
       *
       * A caminhada mora no LOOP DE FRAMES (`passoDoGarcom`), e não numa fila de
       * `await wait(1/60)`. A primeira versão era a fila, e ela derrete: cada
       * `wait` é um `setTimeout`, e navegador com a aba fora de foco trava
       * timer curto em 1 por segundo — os 2,2 s de caminhada viravam mais de
       * dois minutos, com o cachorro se arrastando pelo deque. `dt` de frame
       * não tem esse problema, e ainda dá um passo suave em qualquer taxa.
       */
      const caminhar = (
        de: { x: number; z: number },
        para: { x: number; z: number },
        segundos: number,
      ): Promise<void> => new Promise<void>((pronto) => {
        cachorro.rotation.y = Math.atan2(para.x - de.x, para.z - de.z);
        let t = 0;
        passoDoGarcom = (dt) => {
          t = Math.min(segundos, t + dt);
          const k = t / segundos;
          cachorro.position.x = de.x + (para.x - de.x) * k;
          cachorro.position.z = de.z + (para.z - de.z) * k;
          // o gingado: um sobe-e-desce curto no passo, que é o que separa
          // "cachorro andando" de "caixa deslizando pelo chão"
          cachorro.position.y = Math.abs(Math.sin(t * 11)) * 0.045;
          cachorro.rotation.z = Math.sin(t * 11) * 0.05;
          if (t >= segundos) {
            passoDoGarcom = null;
            cachorro.position.set(para.x, 0, para.z);
            cachorro.rotation.z = 0;
            pronto();
          }
        };
      });

      await caminhar(PORTA, CHEGADA, 2.2);
      api.som('latido');

      // A ENTREGA: o prato troca de pai sem sair do lugar, e só então é posto
      // na mesa. `attach` preserva a posição no mundo; `add` a jogaria para a
      // origem da mesa e o prato pularia na tela.
      mesaPosta.attach(comida);
      comida.position.set(0, 0.78, 0);
      comida.rotation.set(0, 0, 0);
      api.som('sorvete'); // a mesma sineta de "toma, é seu" da sorveteria

      // meia-volta e embora, e aí a instância morre
      await api.wait(0.4);
      await caminhar(CHEGADA, PORTA, 2.0);
      w.root.remove(cachorro);
      cachorro.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
      });

      // o tempo comendo
      await api.wait(4.5);
      mesaPosta.remove(comida);
      comida.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
      });
      api.toast('Estava ótimo', '😌');
    };

    w.interact({
      id: 'clube:mesa-do-restaurante',
      x: MESA.x, z: MESA.z, radius: 2.2,
      label: 'Sentar e ver o cardápio', icon: '📖',
      onInteract: async (api) => {
        api.lockPlayer(true);
        api.ridePlayer(mesaPosta, new THREE.Vector3(0, ALTURA, CADEIRA), 1, Math.PI);
        api.rideCompanion(mesaPosta, new THREE.Vector3(0, ALTURA, -CADEIRA), 1, 0);
        api.setSitting(true);
        api.focusCamera(foco);
        api.setZoom(7.4);
        await api.wait(0.6);

        await conversa([
          [R, 'Tá bom, deixa eu ver o que tem.'],
          [A, 'Você já sabe o que vai pedir.'],
          [R, 'Sei. Mas eu gosto de ler tudo antes.'],
          [A, 'Se tiver arepa, acabou a leitura pra mim.'],
        ]);

        // o cardápio abre e a cena PARA aqui até ele fechar. Ele devolve o id
        // do prato escolhido, ou `null` se a pessoa saiu sem pedir.
        const escolhido = await api.abrirCardapio();
        const prato = escolhido ? pratoPorId(escolhido) : null;

        if (prato) {
          // Quem PEDE é quem está sendo controlado. Os dois estão travados na
          // cadeira, então o T não trocou ninguém no meio do caminho: o dono da
          // voz aqui é o mesmo que sentou.
          await api.say([`Um(a) ${prato.nome}, por favor!`], api.playerName());
          await servir(api, escolhido!);
          await conversa([
            [R, 'Isso aqui salvou o meu dia.'],
            [A, 'A gente volta semana que vem?'],
            [R, 'A gente volta amanhã.'],
          ]);
        }

        api.setSitting(false);
        api.focusCamera(null);
        api.setZoom(10);
        // cada um se levanta para trás da sua cadeira, e vira para a mesa
        api.releasePlayer(MESA.x, MESA.z + 2, Math.PI);
        api.releaseCompanion(MESA.x, MESA.z - 2, 0);
        api.lockPlayer(false);
        if (prato) {
          api.unlock({
            id: 'cardapio-do-clube',
            title: 'O almoço no clube',
            place: 'Clube',
            note: 'Você leu o cardápio inteiro, de cabo a rabo. E um cachorrinho de gravata trouxe a comida.',
            icon: '🍽️',
          });
        }
      },
    });
    for (const x of [-20.6, -12.4]) {
      w.add(w.place(parasol(P.restauranteToldo), x, 0, -4.8));
      w.blockCircle(x, -4.8, 0.3);
    }

    w.interact({
      id: 'clube:restaurante',
      x: RESTAURANTE.x, z: fachadaZ + 1.3, radius: 2.4,
      label: 'Restaurante', icon: '🍽️',
      highlight: predio,
      onInteract: async (api) => {
        await conversa([
          [R, 'Eu tô com fome desde que a gente entrou na água.'],
          [A, 'Você tava com fome ANTES de entrar na água.'],
          [R, 'E continuo. É consistência.'],
        ]);
        api.toast('Cheiro de comida boa', '🍽️');
        api.unlock({
          id: 'restaurante-clube',
          title: 'O restaurante do clube',
          place: 'Clube',
          note: 'Mesa na área externa, o cabelo dos dois ainda molhado, e ninguém com pressa de voltar pra piscina.',
          icon: '🍽️',
        });
      },
    });

    // ------------------------------------------------- ocupando o deck novo
    // Nada aqui é atração: é o mobiliário que faz um pátio de concreto parecer
    // um clube. Tudo sai do kit, e a única regra é a de sempre — peça com
    // frente olha para `+Z`, senão a câmera pega só o fundo liso dela.

    // A ARQUIBANCADA da piscina, uma de cada lado do trampolim. Os degraus
    // sobem para `-Z` e o assento olha para `+Z`, ou seja, para a água.
    for (const x of [-5, 7]) {
      w.add(w.place(bleachers(6), x, 0, -12.5));
      w.blockBox(x, -13.2, 3, 1);
    }

    // As mesas de piquenique saíram do fundo à esquerda — aquele canto virou o
    // restaurante. Elas foram para o fundo à direita, ao lado do vestiário.
    //
    // SEM GUARDA-SOL EM CIMA DELAS. A lona tem 1,15 de raio e fica a 2,35 do
    // chão, e a câmera isométrica sobe o que é alto na tela: um guarda-sol ao
    // lado da mesa aparece POR CIMA de quem está sentado. E como a câmera gira
    // de 45 em 45, não existe deslocamento que resolva nos quatro ângulos —
    // ele sempre tapa em algum. Quem faz sombra aqui são as palmeiras.
    for (const [x, z] of [[12, -13], [20, -11], [21, -16]] as const) {
      // `mesaDePiquenique` já traz peça, colisor e o sentar de frente um para o
      // outro — do mesmo jeito que todo `banco()` já dá para sentar
      w.mesaDePiquenique(x, z);
    }
    w.add(w.place(bin(), -9, 0, -5));
    w.blockCircle(-9, -5, 0.3);

    // CANTEIROS quebrando o concreto. Eles têm borda elevada de propósito:
    // mancha pintada no chão brigaria com o deck, calota com volume não briga
    // com nada.
    // O que ficava em (-20, -3) caiu dentro do deque do restaurante e saiu.
    for (const [x, z, r] of [[12, 6, 1.2], [8, 12, 1.1]] as const) {
      w.add(w.place(canteiro(r), x, 0, z));
      w.blockCircle(x, z, r);
    }
    // Os dois de palmeira ficam nos FUNDOS (`z` e `x` que a câmera desenha
    // atrás): palmeira tem 3,5 de altura, e na frente ela taparia a piscina.
    for (const [x, z, r, esc] of [[-4, -17, 1.3, 1.05], [19, -8, 1.4, 0.95]] as const) {
      w.add(w.place(canteiroComPalmeira(r, esc, x), x, 0, z));
      w.blockCircle(x, z, r);
    }

    // O CALÇADÃO da frente: postes em fila, bebedouro e lixeira. É a faixa por
    // onde todo mundo entra, e era só concreto liso.
    for (const x of [-9, -2, 5, 12]) {
      w.add(w.place(lamp(), x, 0, 12));
      w.blockCircle(x, 12, 0.25);
    }
    w.add(w.place(waterFountain(), 11.5, 0, 3.4));
    w.blockBox(11.5, 3.4, 0.3, 0.25);
    w.add(w.place(bin(), 6.5, 0, 11.4));
    w.blockCircle(6.5, 11.4, 0.3);

    // O PONTO DE ÔNIBUS, ao lado de quem já está parado ali. A cobertura abre
    // para `+Z`; a fila fica de frente para a câmera.
    w.add(w.place(busStop(), -17, 0, 12.5));
    w.blockBox(-17, 11.9, 1.9, 1);

    // PLACAS. É o que mais faz um lugar parecer clube de verdade: o texto sai
    // de um canvas em tempo de execução, que é a única "textura" que o projeto
    // permite.
    for (const [texto, cor, x, z] of [
      ['Piscina', P.fabricBlue, 3, 9.6],
      ['Sucos', 0x4ec1a8, -15.5, 10.2],
    ] as const) {
      w.add(w.place(textSign(texto, cor), x, 0, z));
      w.blockCircle(x, z, 0.25);
    }

    // REFLETORES nos dois cantos do fundo — clube que fecha tarde tem.
    for (const x of [-20, 21]) {
      w.add(w.place(floodlight(), x, 0, -19));
      w.blockCircle(x, -19, 0.35);
    }

    // ------------------------------------------------------------ jardim
    // A vegetação seguiu o deck para fora: com o piso em 48×38, as palmeiras
    // que estavam em `±18` nasceriam no meio do concreto. Elas voltam a ser a
    // moldura verde da cena, agora na beirada do piso novo.
    w.setSeed(90210);
    const bordaX = DECK.largura / 2 + 1.5;
    const bordaZ = DECK.profundidade / 2 + 1.5;
    for (const [x, z] of [
      [-bordaX, -8], [-bordaX, 4], [bordaX, 2], [bordaX, -10],
      [-9, -bordaZ + DECK.z], [11, -bordaZ + DECK.z], [-4, bordaZ + DECK.z],
    ] as const) {
      w.add(w.place(tree('palmeira', w.range(0.95, 1.2), w.rng()), x, 0, z));
      w.blockCircle(x, z, 0.5);
    }
    for (let i = 0; i < 26; i++) {
      const x = w.range(-34, 34);
      const z = w.range(-32, 28);
      // nada de arbusto brotando no deck
      if (Math.abs(x) < DECK.largura / 2 + 1 &&
        Math.abs(z - DECK.z) < DECK.profundidade / 2 + 1) continue;
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

    // ------------------------------------------------------------ a saida
    // A cerca da borda de baixo saiu inteira (as duas brancas e o portão
    // dourado): quem fecha o clube agora é o limite invisível, e quem leva
    // embora é o ônibus.
    //
    // `rotation.y = PI/2` deita o ônibus ao longo do Z e leva a porta dele (que
    // nasce no `+Z` local) para o `+X` do mundo — virada para dentro do clube,
    // que é de onde a dupla chega.
    const onibus = w.add(w.place(bus(), PARADA.x, 0, PARADA.z, Math.PI / 2));
    w.blockBox(PARADA.x, PARADA.z, 1.3, 4.3);

    w.door({
      x: EMBARQUE.x, z: EMBARQUE.z,
      to: 'villa-lobos', entry: 'clube',
      label: 'Pegar o ônibus pro parque', icon: '🚌',
      highlight: onibus,
      radius: 2.4,
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

    // ---------------------------------------------------------------- sucos
    // Morango do Renan, pêssego do Ari — cada um na mochila do seu dono. Quem
    // põe o copo na mão é o motor, e o T não muda nada: a malha é filha do rig.
    let sucoRestante = 0;

    w.onUpdate((dt) => {
      if (sucoRestante <= 0) return;
      sucoRestante -= dt;
      if (sucoRestante <= 0) {
        g.removeItem(ITENS.sucoMorango.id, RENAN.id);
        g.removeItem(ITENS.sucoPessego.id, ARI.id);
        g.toast('Acabou o suco', '🍹');
      }
    });

    w.interact({
      id: 'clube:bar',
      x: -12.2, z: 9.2, radius: 2.2,
      label: 'Pedir alguma coisa gelada', icon: '🍹',
      highlight: bar,
      onInteract: async (api) => {
        await conversa([
          [R, 'Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito.'],
          [A, 'Awnn gracias amorzito'],
        ]);
        sucoRestante = 50;
        api.addItem(ITENS.sucoMorango, RENAN.id);
        api.addItem(ITENS.sucoPessego, ARI.id);
        api.som('sorvete'); // a mesma sineta de "toma, é seu" da sorveteria
        api.toast('Morango e pêssego', '🍹');
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
      x: 15, z: -14.2, radius: 2.2, priority: 1,
      label: 'Vestiário', icon: '🩳',
      highlight: vestiario,
      onInteract: async (api) => {
        // Abastece os DOIS a cada abertura, como o armário do quarto: as peças
        // são de cada pessoa, e o `storeItem` recusa o que ela já tem, então
        // repor sai de graça e o vestiário também repõe o que foi descartado.
        for (const quem of [api.playerId(), api.companionId()]) {
          api.storeItem(ITENS.oculosEscuros, quem);
          for (const peca of MODA_PRAIA) api.storeItem(peca, quem);
        }

        if (!api.flag('vestiario-clube')) {
          api.setFlag('vestiario-clube');
          await conversa([
            [A, 'Cinco minutos pra trocar de roupa. Você demora quinze.'],
            [R, 'Eu demoro porque escolho. Você só pega a primeira que vê.'],
          ]);
        }
        api.abrirVestiario();
      },
    });
  },
};
