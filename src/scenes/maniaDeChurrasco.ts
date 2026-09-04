import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import {
  arandela, balcaoDePassagem, bancadaInox, banquetaAlta, caixaRegistradora, chair,
  churrasqueira, diningTable, estanteDeBebidas, fogaoIndustrial, fridge, interiorDoor,
  luminariaPendente, pictureFrame, piaIndustrial, pottedPlant, quadroDeGiz, quadroDoEmpregadoDoMes, rug,
  upperCabinets, wallShelf,
} from '../world/furniture';
import { letreiro, pratoServido } from '../world/props';
import { pratoPorId } from '../world/cardapioData';
import { Walter } from '../entities/bichos/Walter';
import { toon } from '../core/materials';
import { assoalhoDeMadeira, pisoDePlacas } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';

/**
 * Mania de Churrasco — o restaurante do clube POR DENTRO.
 *
 * Este é o primeiro cenário construído para receber um jogo de verdade depois.
 * Ele é, de propósito, duas salas coladas:
 *
 *   COZINHA (esquerda/fundo)      |  SALÃO (frente/direita)
 *   grelha, fogão, pia, bancadas  |  mesas, bar, caixa
 *                    ↑ o balcão de passagem separa os dois
 *
 * O BALCÃO DE PASSAGEM É A PEÇA MAIS IMPORTANTE DAQUI, e ele já nasce no lugar
 * certo: quando o minijogo entrar, é nele que o prato pronto vai esperar o
 * garçom. Um restaurante com cozinha e salão sem fronteira não teria onde
 * pendurar essa mecânica.
 *
 * PLANTA (a câmera vê `-Z` subindo à direita e `-X` subindo à esquerda):
 *
 *   parede do fundo (-Z), da esquerda para a direita:
 *     geladeira · CHURRASQUEIRA · fogão · bancada || bar com estante de bebidas
 *   parede da esquerda (-X):
 *     pia · bancada · PORTA DE SERVIÇO (é por onde se entra, vinda do clube)
 *   meio:
 *     balcão de passagem correndo no X, e outro correndo no Z, com o vão de
 *     serviço entre os dois
 *   frente (+Z) e direita (+X):
 *     mureta baixa — parede alta desses dois lados taparia o salão inteiro
 *
 * POR QUE ELE É MAIOR QUE O PRÉDIO DE FORA. A casca no clube tem 13 × 7 e aqui
 * são 24 × 18. É mentira consciente, e é o padrão do gênero: interior no
 * tamanho do exterior daria um salão de quatro mesas onde não cabe cozinha
 * nenhuma — e o que este cenário precisa é justamente caber um jogo dentro.
 */

const W = 24;
const D = 18;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 3.3;

/** a fronteira entre a cozinha e o salão */
const PASSAGEM = { z: -2, xIni: -11.5, xFim: -2 };
/** o balcão que fecha a cozinha do lado do bar */
const LATERAL = { x: 0.5, zIni: z0 + 0.2, zFim: -2 };
/**
 * A porta de serviço, na parede da esquerda: é por onde se entra.
 *
 * ELA E A PIA DISPUTAM A MESMA PAREDE, e a primeira versão perdeu a disputa: a
 * pia de 2,6 ficava centrada em `z = -6,1` e o colisor dela ia até `-4,75`,
 * bem na frente do vão da porta. Quem entrava do clube esbarrava na pia antes
 * de dar o primeiro passo. Agora a porta subiu 0,6 e a pia encurtou e recuou —
 * ver `PIA`, e a conta de folga que está lá.
 */
const PORTA = { z: -4.4 };

/** o que o Ari diz nos carinhos seguintes: o primeiro é a apresentação dele */
const FALAS_DO_WALTER = [
  'Ele fica de bandeja e tudo. Nem tira pra receber carinho.',
  'Ó o rabo. Isso é rabo de quem gosta do emprego.',
  'Walter, você é o melhor funcionário daqui.',
  'Ele já entendeu que a gente volta sempre.',
  'Se ele pudesse falar, já tinha anotado nosso pedido.',
];

export const maniaDeChurrasco: SceneDef = {
  id: 'mania-de-churrasco',
  name: 'Mania de Churrasco',
  subtitle: 'o restaurante por dentro, com a cozinha acesa',
  ambient: {
    sky: 0xf3e2c8,
    indoor: true,
    sunColor: 0xfff0d2,
    sunIntensity: 0.9,
    ambientColor: 0xfaeede,
    ambientIntensity: 1.5,
    sunDir: [12, 16, 10],
  },
  // um passo para dentro da cozinha, não colado na porta: o parceiro nasce
  // atrás e ficaria dentro da parede
  spawn: { x: x0 + 1.6, z: PORTA.z, facing: Math.PI / 2 },
  entries: {
    'dos-fundos': { x: x0 + 1.6, z: PORTA.z, facing: Math.PI / 2 },
  },

  build(w) {
    const g = w.game;

    /** Vai e volta de falas, com o nome certo em cada balão. */
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };
    const A = ARI.name;
    const R = RENAN.name;

    // ---------------------------------------------------------------- casca
    // o assoalho corre no salão inteiro; o ladrilho da cozinha vem por cima
    w.ground({ width: W, depth: D, color: P.churrascoPiso, textura: assoalhoDeMadeira(2.4) });
    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    /**
     * O PISO DA COZINHA é outro: ladrilho claro em vez da madeira do salão.
     * É o jeito mais barato de dizer "aqui é área de trabalho" sem construir
     * parede nenhuma — e a placa de 1 m dá o tamanho certo de ladrilho de
     * cozinha industrial.
     */
    w.patch(
      (x0 + LATERAL.x) / 2, (z0 + PASSAGEM.z) / 2,
      LATERAL.x - x0, PASSAGEM.z - z0,
      P.churrascoLadrilho, 0, 0.01, pisoDePlacas(1),
    );

    // Parede inteira só em -X e -Z. Nos dois lados que dão para a câmera,
    // mureta: parede alta ali taparia o salão inteiro.
    w.wall(x0, z0, W / 2, z0, H, P.churrascoParede);
    w.wall(W / 2, z0, W / 2, D / 2, 0.5, P.churrascoParede);
    w.wall(x0, D / 2, W / 2, D / 2, 0.5, P.churrascoParede);
    // a parede da esquerda vem em dois trechos, com o vão da porta no meio
    w.wall(x0, z0, x0, PORTA.z - 1.1, H, P.churrascoParede);
    w.wall(x0, PORTA.z + 1.1, x0, D / 2, H, P.churrascoParede);

    /**
     * A FAIXA DE TIJOLO do fundo, atrás da churrasqueira. Ela é o que dá o
     * cheiro do lugar antes de qualquer texto: churrascaria é tijolo aparente,
     * e o tijolo só aparece onde o fogo está.
     */
    const tijolo = new THREE.Mesh(new THREE.BoxGeometry(13, H - 0.1, 0.06), toon(P.churrascoTijolo));
    tijolo.position.set(x0 + 6.5, (H - 0.1) / 2, z0 + 0.17);
    w.add(tijolo);
    for (let i = 0; i < 7; i++) {
      const fiada = new THREE.Mesh(new THREE.BoxGeometry(13, 0.035, 0.075), toon(P.churrascoRejunte));
      fiada.position.set(x0 + 6.5, 0.4 + i * 0.42, z0 + 0.17);
      w.add(fiada);
    }

    /**
     * O lambri de madeira do salão: meia parede, da altura de uma cadeira.
     *
     * SÓ NAS PAREDES DE VERDADE. Ele nasceu também na borda `+X`, que é MURETA
     * de 0,5 — e um lambri de 1,05 numa mureta de 0,5 é uma tábua flutuando no
     * ar. Vale para tudo que se pendura: nesta cena só `-X` e `-Z` têm parede.
     */
    for (const [x, z, larg, rot] of [
      [x0 + 18.5, z0 + 0.16, 11, 0],
      [x0 + 0.16, D / 2 - 5.5, 7, Math.PI / 2],
    ] as const) {
      const lambri = new THREE.Mesh(new THREE.BoxGeometry(larg, 1.05, 0.06), toon(P.churrascoFaixa));
      lambri.position.set(x, 0.525, z);
      lambri.rotation.y = rot;
      w.add(lambri);
      const trilho = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.09, 0.12), toon(P.woodDark));
      trilho.position.set(x, 1.08, z);
      trilho.rotation.y = rot;
      w.add(trilho);
    }

    // rodapé em toda a volta: o risco escuro que tira o ar de caixa vazia
    for (const [x, z, larg, rot] of [
      [0, z0 + 0.06, W, 0],
      [x0 + 0.06, 0, D, Math.PI / 2],
    ] as const) {
      const rodape = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.14, 0.05), toon(P.woodDark));
      rodape.position.set(x, 0.07, z);
      rodape.rotation.y = rot;
      w.add(rodape);
    }

    // ------------------------------------------------------------- a porta
    const porta = w.add(w.place(
      interiorDoor(P.churrascoFaixa, 1.1, 2.2), x0 + 0.1, 0, PORTA.z, Math.PI / 2,
    ));
    w.door({
      x: x0 + 1.0, z: PORTA.z,
      to: 'clube', entry: 'dos-fundos-do-restaurante',
      label: 'Voltar pro clube', icon: '🚪',
      highlight: porta,
    });

    // ============================================================= COZINHA

    /**
     * A CHURRASQUEIRA, encostada no tijolo. Ela é a única cor saturada da cena
     * e fica no fundo à esquerda — o canto que a câmera desenha por último, e
     * portanto o que nunca tapa ninguém.
     */
    const GRELHA = { x: x0 + 3.6, z: z0 + 0.7 };
    const grelha = w.add(w.place(churrasqueira(4.4), GRELHA.x, 0, GRELHA.z));
    w.blockBox(GRELHA.x, GRELHA.z, 2.3, 0.6);

    w.add(w.place(fridge(), x0 + 0.75, 0, z0 + 0.6));
    w.blockBox(x0 + 0.75, z0 + 0.6, 0.45, 0.4);

    w.add(w.place(fogaoIndustrial(2.4), x0 + 7.4, 0, z0 + 0.55));
    w.blockBox(x0 + 7.4, z0 + 0.55, 1.25, 0.45);

    w.add(w.place(bancadaInox(3.2), x0 + 10.4, 0, z0 + 0.5));
    w.blockBox(x0 + 10.4, z0 + 0.5, 1.6, 0.4);
    w.add(w.place(upperCabinets(2.4), x0 + 10.4, 1.75, z0 + 0.2));

    /**
     * A PIA, na parede da esquerda, entre a geladeira e a porta de serviço.
     *
     * As duas folgas que ela tem que respeitar, e por isso ela é de 2,2 e não
     * de 2,6: a geladeira termina em `z = -8,0` e o vão da porta começa em
     * `PORTA.z - 1,1 = -5,5`. Sobram 2,5 de parede, e o colisor da pia ocupa
     * 2,2 deles — 0,15 de cada lado. Foi a reclamação do Renan: com a pia
     * comprida, sair da porta era esbarrar nela.
     */
    const PIA = { x: x0 + 0.5, z: z0 + 2.25 };
    const pia = w.add(w.place(piaIndustrial(2.2), PIA.x, 0, PIA.z, Math.PI / 2));
    w.blockBox(PIA.x, PIA.z, 0.42, 1.1);
    w.add(w.place(wallShelf(1.2), x0 + 0.16, 1.75, PIA.z, Math.PI / 2));

    /**
     * A ILHA DE MONTAGEM, solta no meio da cozinha. É a bancada onde o prato
     * vai ser montado quando o jogo existir — e é por isso que ela está VAZIA:
     * o que tem que aparecer nela é a comida.
     */
    const ILHA = { x: x0 + 6.2, z: z0 + 4.6 };
    const ilha = w.add(w.place(bancadaInox(3.6, false), ILHA.x, 0, ILHA.z));
    w.blockBox(ILHA.x, ILHA.z, 1.8, 0.42);

    // ==================================================== BALCÃO DE PASSAGEM
    const larguraPassagem = PASSAGEM.xFim - PASSAGEM.xIni;
    const passagem = w.add(w.place(
      balcaoDePassagem(larguraPassagem),
      (PASSAGEM.xIni + PASSAGEM.xFim) / 2, 0, PASSAGEM.z,
    ));
    w.blockBox((PASSAGEM.xIni + PASSAGEM.xFim) / 2, PASSAGEM.z, larguraPassagem / 2, 0.5);

    // o trecho que corre no Z e fecha a cozinha do lado do bar
    const comprimentoLateral = LATERAL.zFim - LATERAL.zIni;
    w.add(w.place(
      balcaoDePassagem(comprimentoLateral),
      LATERAL.x, 0, (LATERAL.zIni + LATERAL.zFim) / 2, Math.PI / 2,
    ));
    w.blockBox(LATERAL.x, (LATERAL.zIni + LATERAL.zFim) / 2, 0.5, comprimentoLateral / 2);

    // ============================================================== SALÃO

    /**
     * O BAR, no fundo à direita, com a estante de bebidas na parede e as
     * banquetas de frente para ele. As duas únicas luminárias pendentes da
     * cena moram aqui: sobre o balcão ninguém senta de frente para a câmera,
     * então elas não apagam a cabeça de ninguém.
     */
    const BAR = { x: 6.5, z: z0 + 0.9 };
    const bar = w.add(w.place(balcaoDePassagem(6.4), BAR.x, 0, BAR.z));
    w.blockBox(BAR.x, BAR.z, 3.3, 0.5);
    w.add(w.place(estanteDeBebidas(3.4, 1.7), BAR.x, 0.7, z0 + 0.2));
    w.add(w.place(caixaRegistradora(), BAR.x + 2.4, 1.16, BAR.z + 0.1));
    for (const dx of [-2.2, -0.8, 0.6, 2.0]) {
      w.add(w.place(banquetaAlta(), BAR.x + dx, 0, BAR.z + 0.95, Math.PI));
      w.blockCircle(BAR.x + dx, BAR.z + 0.95, 0.3);
    }
    for (const dx of [-1.9, 1.9]) w.add(w.place(luminariaPendente(), BAR.x + dx, 0, BAR.z + 0.2));

    /**
     * AS MESAS. Nove, em três fileiras desencontradas — enfileirar tudo em
     * grade dá cara de refeitório, e não de casa que enche no domingo.
     *
     * A toalha xadrez é um decalque fino em cima do tampo: com ela, a mesa
     * deixa de ser um disco de madeira e vira mesa posta.
     */
    const MESAS = [
      [3.6, -5.2], [9.4, -5.2],
      [-9.2, 1.2], [-4.6, 1.2], [0.2, 1.2], [5.2, 1.2], [10.0, 1.2],
      [-7.2, 5.6], [-2.4, 5.6], [2.6, 5.6], [7.6, 5.6],
    ] as const;
    /**
     * A ÂNCORA DE CADA MESA. Toda mesa do salão é uma mesa em que dá para
     * sentar — o Renan pediu "qualquer mesa que eu quiser" —, então cada uma
     * ganha o par de objetos que a cutscene usa: a âncora onde os dois montam
     * e o foco para onde a câmera olha. São 11, e é barato: `Object3D` vazio
     * não desenha nada.
     */
    const postas: Array<{ x: number; z: number; posta: THREE.Object3D; foco: THREE.Object3D }> = [];

    for (const [x, z] of MESAS) {
      w.add(w.place(diningTable(1.5, 1.0), x, 0, z));
      w.blockBox(x, z, 0.8, 0.55);
      const posta = new THREE.Object3D();
      posta.position.set(x, 0, z);
      w.root.add(posta);
      const foco = new THREE.Object3D();
      foco.position.set(x, 1.0, z);
      w.root.add(foco);
      postas.push({ x, z, posta, foco });
      /**
       * A TOALHA COBRE O TAMPO E CAI 12 CM DOS LADOS. A primeira versão era um
       * decalque de 2 cm em `y = 0,755` — dentro do tampo, que vai de 0,705 a
       * 0,795: ela existia e não aparecia. Toalha que não pendura não é toalha,
       * é adesivo.
       */
      const toalha = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.17, 1.14), toon(P.churrascoToalha));
      toalha.position.set(x, 0.73, z);
      w.add(toalha);
      // as quatro cadeiras: duas de frente para a câmera e duas de costas, e é
      // essa alternância que faz a fileira parecer ocupada por gente diferente
      for (const [dx, dz, rot] of [
        [-0.55, 0.95, Math.PI], [0.55, 0.95, Math.PI],
        [-0.55, -0.95, 0], [0.55, -0.95, 0],
      ] as const) {
        w.add(w.place(chair(P.churrascoFaixa), x + dx, 0, z + dz, rot));
        w.blockCircle(x + dx, z + dz, 0.26);
      }
    }

    /**
     * O GARÇOM CANINO, passeando pelo salão. Ele trabalha aqui — é o mesmo
     * cachorro que leva o prato à mesa lá fora, no restaurante do clube.
     *
     * A ÁREA É O SALÃO INTEIRO, e o que ele contorna vem daqui, não do colisor
     * do mundo: o bicho tem 25 cm de raio e passa em vão que gente não passa,
     * então quem decide o que é obstáculo PARA ELE é quem monta a cena.
     *
     * O raio de 1,45 em volta de cada mesa não é o tampo (0,8): é o tampo mais
     * as quatro cadeiras (que ficam a 0,95 no `z`) mais o corpo dele. Com o
     * raio do tampo ele atravessaria cadeira, que é pior do que não passear.
     * Sobram 1,7 de corredor entre uma mesa e a vizinha da mesma fileira e 1,5
     * entre as fileiras — passagem de sobra para um bicho deste tamanho.
     *
     * A ÁREA PARA NO BALCÃO DE PASSAGEM de propósito, e não porque o balcão
     * colide: ele NÃO colide para o bicho. Se a área cruzasse o `z = -2`, o
     * caminho reto até um destino do outro lado atravessaria o balcão como se
     * ele não existisse, e o garçom entraria na cozinha pela parede. A coleira
     * é a área, como na girafa da portaria.
     */
    const cachorro = new Walter({
      minX: x0 + 1.2, maxX: W / 2 - 1.2,
      // do balcão de passagem até a mureta da frente
      minZ: PASSAGEM.z + 1.1, maxZ: D / 2 - 1.2,
      proibido: MESAS.map(([x, z]) => ({ x, z, r: 1.45 })),
    });
    w.add(cachorro.group);
    cachorro.aoSoar = () => g.som('latido');

    /**
     * O CARINHO NO WALTER, e a MEMÓRIA SÓ NA PRIMEIRA VEZ.
     *
     * O padrão é o mesmo do Pelusa: a `flag` guarda que eles já se conheceram,
     * então a conversa de apresentação e o desbloqueio da memória acontecem uma
     * vez só. Da segunda em diante ele responde com uma fala sorteada — carinho
     * tem que continuar valendo a pena depois que a memória já entrou, senão o
     * bicho vira um botão que só funciona uma vez.
     */
    const carinhoNoWalter = w.interact({
      id: 'mania:walter',
      x: cachorro.x, z: cachorro.z, radius: 1.15,
      label: 'Fazer carinho no Walter', icon: '🐕',
      highlight: cachorro.group,
      onInteract: async (api) => {
        cachorro.receberCarinho();
        api.som('latido');
        if (!api.flag('walter-conhecido')) {
          api.setFlag('walter-conhecido');
          await conversa([
            [A, 'Ele trabalha aqui, não trabalha?'],
            [R, 'Gravata borboleta e bandeja nas costas. Trabalha.'],
            [A, 'Tem plaquinha na coleira? …Walter.'],
            [R, 'Prazer, Walter. A gente entrou pela porta dos fundos, mas é de paz.'],
          ]);
          api.unlock({
            id: 'walter',
            title: 'O Walter',
            place: 'Mania de Churrasco',
            note: 'O garçom do restaurante: gravata borboleta, bandeja de inox nas costas e um rabo que não para.',
            icon: '🐕',
          });
          return;
        }
        await api.say([w.pick(FALAS_DO_WALTER)], A);
      },
    });

    // SEM ISTO o balão fica onde ele nasceu e o carinho vira um ponto morto no
    // chão: ele passeia, e o ponto de interação tem que passear junto
    w.onUpdate((dt) => {
      cachorro.update(dt);
      carinhoNoWalter.moveTo(cachorro.x, cachorro.z);
    });

    // ======================================== SENTAR, PEDIR E O WALTER SERVIR
    /**
     * O CAMINHO DO WALTER ATÉ A COZINHA, em dois trechos.
     *
     * Ele não vai em linha reta, e não é firula: o balcão de passagem corre em
     * `z = -2` de `x = -11,5` a `-2`, e o único buraco nele é o VÃO DE SERVIÇO
     * entre `x = -2` e `x = 0,5`. Reto, ele atravessaria o balcão como fantasma
     * — `irPara()` ignora colisão de propósito, porque quem conhece a planta é
     * a cena, não o bicho. Então a cena o leva pelo vão, como um garçom de
     * verdade faria.
     */
    const VAO = { x: -0.8, z: -1.0 };
    const COZINHA = { x: -1.4, z: -4.2 };

    /**
     * O Walter vai à cozinha e volta com o prato.
     *
     * O PRATO VIAJA COMO FILHO DA BANDEJA, e não copiado quadro a quadro: assim
     * ele acompanha o gingado do passo de graça, sem tremer. Na entrega, o
     * `attach` do three troca o pai para a âncora da mesa MANTENDO a posição no
     * mundo — é isso que faz o prato pousar em vez de saltar.
     *
     * A CÂMERA SEGUE ELE, e não a mesa. Com o foco na mesa e o zoom de 7,4, a
     * ida à cozinha acontecia inteira fora da tela — e a ida à cozinha é
     * justamente o que o Renan pediu para ver. Ela volta para a mesa no momento
     * em que ele chega com o prato.
     */
    const servir = async (
      api: GameAPI,
      idDoPrato: string,
      alvo: { x: number; z: number; posta: THREE.Object3D; foco: THREE.Object3D },
    ): Promise<void> => {
      const comida = pratoServido(idDoPrato);
      if (!comida) return;

      // ele encosta pelo `+X` da mesa. A câmera vem de `+X/+Z` e desenha na
      // frente quem tem soma maior: parado do outro lado, ele ficaria atrás de
      // quem senta e a entrega inteira aconteceria escondida por uma cabeça.
      const CHEGADA = { x: alvo.x + 1.45, z: alvo.z };

      cachorro.entrarEmServico();
      api.focusCamera(cachorro.group);
      api.setZoom(9.5);
      api.som('latido');

      const TROTE = 2.3;   // ele TROTA em serviço; o passeio dele é 0,78
      await cachorro.irPara(VAO.x, VAO.z, TROTE);
      await cachorro.irPara(COZINHA.x, COZINHA.z, TROTE);
      // o tempo de pegar o prato na cozinha, e o prato aparece na bandeja
      await api.wait(1.1);
      cachorro.bandeja.add(comida);
      await api.wait(0.4);

      await cachorro.irPara(VAO.x, VAO.z, TROTE);
      await cachorro.irPara(CHEGADA.x, CHEGADA.z, TROTE);

      api.focusCamera(alvo.foco);
      api.setZoom(7.4);
      await api.wait(0.5);
      alvo.posta.attach(comida);
      comida.position.set(0, 0.82, 0);
      comida.rotation.set(0, 0, 0);
      api.som('sorvete');   // a mesma sineta de "toma, é seu" da sorveteria

      // meia-volta e de volta ao passeio
      await api.wait(0.5);
      void cachorro.irPara(VAO.x, VAO.z, TROTE).then(() => cachorro.voltarAPassear());

      await api.wait(4.5);
      alvo.posta.remove(comida);
      comida.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
      });
      api.toast('Estava ótimo', '😌');
    };

    /**
     * TODA MESA SENTA. São 11 interações iguais, montadas em laço a partir das
     * âncoras — repetir o bloco 11 vezes seria a mesma coisa escrita 11 vezes.
     *
     * A dupla senta nas cadeiras da ESQUERDA (`dx = -0,55`), uma de frente para
     * a outra: são as duas cadeiras que já existem alinhadas no mesmo `x`. As
     * da direita ficam vazias, como mesa de restaurante de verdade.
     */
    const ASSENTO = 0.03;   // o topo do assento da `chair()` está em 0,50
    for (let i = 0; i < postas.length; i++) {
      const alvo = postas[i];
      w.interact({
        id: `mania:mesa-${i}`,
        x: alvo.x, z: alvo.z + 1.9, radius: 1.7,
        label: 'Sentar e ver o cardápio', icon: '📖',
        onInteract: async (api) => {
          api.lockPlayer(true);
          api.ridePlayer(alvo.posta, new THREE.Vector3(-0.55, ASSENTO, 0.95), 1, Math.PI);
          api.rideCompanion(alvo.posta, new THREE.Vector3(-0.55, ASSENTO, -0.95), 1, 0);
          api.setSitting(true);
          api.focusCamera(alvo.foco);
          api.setZoom(7.4);
          await api.wait(0.6);

          if (!api.flag('comeu-no-mania')) {
            await conversa([
              [R, 'A gente pode simplesmente sentar? A casa tá aberta.'],
              [A, 'Tem cardápio na mesa e um garçom de gravata. Tá aberta.'],
            ]);
          }

          // o mesmo cardápio do restaurante de fora — é a mesma cozinha, só do
          // outro lado da parede —, mas com o nome desta casa no alto da folha
          const escolhido = await api.abrirCardapio('Mania de Churrasco');
          const prato = escolhido ? pratoPorId(escolhido) : null;

          if (prato) {
            // Quem PEDE é quem está sendo controlado. Os dois estão travados na
            // cadeira, então o T não trocou ninguém no meio do caminho.
            await api.say([`Um(a) ${prato.nome}, por favor!`], api.playerName());
            await servir(api, escolhido!, alvo);
            if (!api.flag('comeu-no-mania')) {
              api.setFlag('comeu-no-mania');
              await conversa([
                [A, 'Ele foi na cozinha e voltou com o prato. Sozinho.'],
                [R, 'Eu não sei quem cozinha aqui, e prefiro não saber.'],
              ]);
              api.unlock({
                id: 'almoco-no-mania',
                title: 'Almoço no Mania de Churrasco',
                place: 'Mania de Churrasco',
                note: 'Sentaram numa mesa de um restaurante que descobriram pela porta dos fundos, e o Walter serviu.',
                icon: '🍽️',
              });
            }
          }

          api.setSitting(false);
          api.focusCamera(null);
          api.setZoom(10);
          // cada um se levanta para trás da sua cadeira, e vira para a mesa
          api.releasePlayer(alvo.x - 0.55, alvo.z + 2.1, Math.PI);
          api.releaseCompanion(alvo.x - 0.55, alvo.z - 2.1, 0);
          api.lockPlayer(false);
        },
      });
    }

    // ------------------------------------------------------------- enfeites
    // o letreiro do nome, em cima do bar: é a primeira coisa que se lê ao entrar
    const placaFundo = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.9, 0.08), toon(P.churrascoQuadroNegro));
    placaFundo.position.set(BAR.x, 2.5, z0 + 0.2);
    w.add(placaFundo);
    const nome = letreiro('Mania de Churrasco', 5.6, 0.62, '#ffd88a');
    nome.position.set(BAR.x, 2.52, z0 + 0.26);
    w.add(nome);

    const lousa = w.add(w.place(
      quadroDeGiz(['Hoje', 'picanha na brasa', 'arepa recheada', 'suco de morango'], 1.7, 1.35),
      -8.5, 1.85, z0 + 0.18,
    ));

    /**
     * As arandelas moram nas DUAS paredes de verdade (`-Z` e `-X`). Estavam na
     * borda `+X`, que é mureta de 0,5: cinco luminárias boiando no vazio a dois
     * metros do chão.
     */
    for (const [x, z, rot] of [
      [-2.0, z0 + 0.14, 0], [1.6, z0 + 0.14, 0], [11.0, z0 + 0.14, 0],
      [x0 + 0.14, 1.5, Math.PI / 2], [x0 + 0.14, 6.0, Math.PI / 2],
    ] as const) {
      w.add(w.place(arandela(), x, 2.15, z, rot));
    }

    /**
     * O QUADRO DE EMPREGADO DO MÊS, no lugar onde antes tinha um retângulo
     * vermelho sem nada dentro. Ele fica na parede do fundo, ao lado da
     * registradora — que é onde uma churrascaria de verdade pendura o troféu
     * do funcionário: onde o cliente paga a conta e lê o nome de quem serviu.
     */
    const quadroDoWalter = w.add(w.place(quadroDoEmpregadoDoMes(), 11.4, 1.95, z0 + 0.16));
    w.interact({
      id: 'mania:empregado-do-mes',
      // o balcão do bar vai até z = -7,6; o ponto fica na frente dele
      x: 11.4, z: z0 + 1.5, radius: 1.8,
      label: 'Ler o quadro de empregado do mês', icon: '🏆',
      highlight: quadroDoWalter,
      onInteract: async (api) => {
        await conversa([
          [R, '"Empregado do mês: Walter."'],
          [A, 'Tem foto e tudo. Ele tá de gravata na foto.'],
          [R, 'Ele tá de gravata sempre.'],
          [A, 'Contra quem ele concorreu? Ele é o único funcionário daqui.'],
          [R, 'Ganhou limpo, então.'],
        ]);
        api.unlock({
          id: 'empregado-do-mes',
          title: 'Empregado do mês',
          place: 'Mania de Churrasco',
          note: 'Um quadro na parede, ao lado da registradora, com a foto do Walter de gravata e cinco estrelinhas.',
          icon: '🏆',
        });
      },
    });
    w.add(w.place(pictureFrame(0.7, 0.9, P.grassDark), -0.6, 1.95, z0 + 0.16));

    for (const [x, z] of [[W / 2 - 1.0, D / 2 - 1.2], [x0 + 1.1, D / 2 - 1.2], [11.2, -1.4]] as const) {
      w.add(w.place(pottedPlant(1.2), x, 0, z));
      w.blockCircle(x, z, 0.32);
    }

    // o capacho da entrada de serviço, para a porta não abrir no vazio
    w.add(w.place(rug(1.6, 1.1, P.churrascoTijolo), x0 + 1.5, 0, PORTA.z));

    // ========================================================= interações

    w.interact({
      id: 'mania:grelha',
      x: GRELHA.x, z: GRELHA.z + 1.5, radius: 2.2,
      label: 'Olhar a churrasqueira', icon: '🔥',
      highlight: grelha,
      onInteract: async (api) => {
        await conversa([
          [R, 'A brasa tá acesa. Tem gente que volta pra cá depois do almoço.'],
          [A, 'Tá quente mesmo. Chega a esquentar a cara.'],
          [R, 'Cheiro bom, né?'],
          [A, 'Cheiro de domingo.'],
        ]);
        api.toast('Cheiro de brasa', '🔥');
        api.unlock({
          id: 'brasa-do-mania',
          title: 'A brasa acesa',
          place: 'Mania de Churrasco',
          note: 'A cozinha vazia com a churrasqueira acesa, esperando alguém voltar.',
          icon: '🔥',
        });
      },
    });

    w.interact({
      id: 'mania:passagem',
      x: (PASSAGEM.xIni + PASSAGEM.xFim) / 2, z: PASSAGEM.z + 1.3, radius: 2.4,
      label: 'Olhar o balcão de passagem', icon: '🍽️',
      highlight: passagem,
      onInteract: async () => {
        await conversa([
          [A, 'É aqui que a comida sai da cozinha, né?'],
          [R, 'É. Um bota de um lado, o outro pega do outro.'],
          [A, 'A gente daria conta?'],
          [R, 'Você na cozinha e eu no salão? A gente daria conta.'],
          [A, 'Então um dia a gente volta e faz um turno.'],
        ]);
      },
    });

    w.interact({
      id: 'mania:bar',
      x: BAR.x, z: BAR.z + 1.9, radius: 2.4,
      label: 'Olhar o bar', icon: '🥤',
      highlight: bar,
      onInteract: async (api) => {
        await conversa([
          [R, 'Olha o tanto de garrafa.'],
          [A, 'E o caixa aberto. Confiam mesmo na gente.'],
          [R, 'Confiam na girafa, que deixou a gente entrar.'],
        ]);
        api.som('sino');
      },
    });

    w.interact({
      id: 'mania:lousa',
      x: -8.5, z: z0 + 1.5, radius: 2,
      label: 'Ler o quadro do dia', icon: '🖍️',
      highlight: lousa,
      onInteract: async () => {
        await conversa([
          [A, 'Picanha na brasa, arepa recheada e suco de morango.'],
          [R, 'Escreveram o seu almoço inteiro num quadro.'],
          [A, 'Eles me conhecem.'],
        ]);
      },
    });

    w.interact({
      id: 'mania:ilha',
      x: ILHA.x, z: ILHA.z + 1.2, radius: 2,
      label: 'Olhar a bancada', icon: '🔪',
      highlight: ilha,
      onInteract: async (api) => {
        await conversa([
          [R, 'Bancada limpa, tudo no lugar.'],
          [A, 'É aqui que monta o prato.'],
        ]);
        api.toast('Tudo no lugar, esperando', '🔪');
      },
    });

    w.interact({
      id: 'mania:pia',
      x: PIA.x + 1.0, z: PIA.z, radius: 1.6,
      label: 'Olhar a pia', icon: '🚰',
      highlight: pia,
      onInteract: async () => {
        await conversa([
          [A, 'Louça toda lavada.'],
          [R, 'Alguém saiu daqui com a consciência tranquila.'],
        ]);
      },
    });
  },
};
