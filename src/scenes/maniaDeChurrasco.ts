import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import { plantaDeEspada, tapete } from '../world/furniture';
import { figueiraLira } from '../world/moveisDaBoutique';
import { jiboiaEmVaso } from '../world/moveisDaCasa';
import {
  balcaoDoMania, bancadaDoMania, banquetaDoBar, caixaRegistradoraAntiga, capaDeMureta, cartazDosCortes,
  churrasqueiraDoMania, estanteDoBar, fogaoDoMania, geladeiraDoMania, lambriDoSalao, lampiaoDeParede,
  lousaDoMania, mesaDoSalao, panoDeParede, pendenteDeEsmalte, piaDoMania, pilarete, placaDoSalao,
  portaDeServico, prateleiraDaCozinha, quadroDoWalter, revestir,
  RadioDoBar, carrinhoDeLouca, cavaleteDaFila, chapaDoWalter,
} from '../world/moveisDoMania';
import { fundir } from '../world/fundir';
import { osso, pratoServido } from '../world/props';
import { pratoPorId } from '../world/cardapioData';
import { Walter } from '../entities/bichos/Walter';
import { assoalhoDeMadeira, pisoDePlacas } from '../world/texturasDeChao';
import { ARI, RENAN } from '../characters/cast';
import { ITENS, PREMIOS_DO_MANIA } from '../world/itens';
import { TurnoDoMania, type MesaDoTurno, type PlantaDoTurno } from '../minigames/turnoDoMania';
import {
  CHAVE, migrarOTurnoAntigo, niveisDasMelhorias, registrarOTurno, turnoPorNumero, type ResultadoDoTurno,
} from '../minigames/turnosDoMania';

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
/**
 * Onde o Walter guarda o osso: em cima do balcão de passagem, do lado do salão.
 *
 * O `y` é o tampo do balcão (1,06 de corpo + 0,09 de pedra) mais o raio do nó
 * do osso, para ele POUSAR e não afundar meio centímetro na pedra.
 */
const GUARDADO = { x: -3.4, y: 1.193, z: -2 };

/**
 * A PLANTA DO TURNO — onde cada coisa do minigame acontece no salão.
 *
 * Ela mora aqui, e não dentro do minigame, pela mesma razão de sempre: quem
 * conhece o cenário é a cena. O `turnoDoMania` recebe pontos e não sabe que
 * existe um balcão de passagem.
 *
 * As contas que amarram cada número:
 * - a ENTRADA é o canto da frente à direita, fora das fileiras de mesa (a
 *   última vai até `z = 6,15` com o colisor), e é por onde entra e sai todo
 *   cliente;
 * - a FILA corre na faixa livre da frente, entre as mesas e a mureta;
 * - as SAÍDAS são três vagas em cima do balcão de passagem, e o `tampo` é a
 *   altura dele (1,06 de corpo + 0,09 de pedra);
 * - a COPA fica na outra ponta do mesmo balcão: é de propósito que largar a
 *   louça e pegar o prato sejam duas viagens diferentes;
 * - a COZINHA é onde o Walter fica durante o turno, e a JANELA é onde ele
 *   encosta para deixar o prato. Os dois do lado de lá do balcão.
 */
const ENTRADA = { x: 10.15 };
/**
 * O CARRINHO DE LOUÇA (a melhoria) mora no vão entre as duas mesas do meio da
 * fileira da frente — longe da copa, que é o ponto dele: meia viagem a menos
 * para quem recolhe do lado de cá do salão. O ponto de largar fica na frente
 * dele, do lado da câmera.
 */
const CARRINHO = { x: 0.1, z: 5.6 };

const TURNO: PlantaDoTurno = {
  entrada: { x: ENTRADA.x, z: 9.4 },
  // o quarto lugar só existe com a "Plaquinha de reserva" (o motor decide)
  fila: [{ x: ENTRADA.x, z: 7.2 }, { x: ENTRADA.x - 1.8, z: 7.9 }, { x: ENTRADA.x + 1.5, z: 7.9 }, { x: ENTRADA.x - 1.25, z: 8.6 }],
  recepcao: { x: ENTRADA.x, z: 6.5 },
  saidas: [{ x: -2.6, z: -2 }, { x: -3.6, z: -2 }, { x: -4.6, z: -2 }],
  balcao: { x: -3.6, z: -1.0 },
  carrinho: {
    x: CARRINHO.x, z: CARRINHO.z,
    ponto: { x: CARRINHO.x, z: CARRINHO.z + 1.0 },
    pilha: [{ x: CARRINHO.x + 0.2, z: CARRINHO.z - 0.1 }, { x: CARRINHO.x + 0.2, z: CARRINHO.z + 0.12 }],
    tampo: 0.812,
  },
  pilha: [{ x: -6.2, z: -2 }, { x: -7.0, z: -2 }, { x: -7.8, z: -2 }, { x: -8.6, z: -2 }],
  copa: { x: -7.0, z: -1.0 },
  tampo: 1.15,
  cozinha: { x: -1.6, z: -3.9 },
  janela: { x: -3.6, z: -2.9 },
};

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
    // quem jogou o turno de antes da temporada já entra com o turno 1 contado
    migrarOTurnoAntigo(g);

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
    //
    // A parede alta é de REBOCO e a mureta é de TIJOLINHO com a capa de
    // madeira — o mesmo tijolo de churrascaria do prédio por fora e da grelha.
    revestir(w.wall(x0, z0, W / 2, z0, H, P.churrascoParede), 'reboco');
    revestir(w.wall(W / 2, z0, W / 2, D / 2, 0.5, P.churrascoParede), 'tijolo');
    /**
     * A MURETA DA FRENTE VEM EM DOIS TRECHOS, com o VÃO DA ENTRADA entre eles.
     *
     * É por ali que o cliente do turno entra e sai. Sem o vão, os bichos
     * apareciam do nada num canto do salão — e "apareceu do nada" é a coisa que
     * mais rápido desfaz a ilusão de que aquele lugar existe.
     */
    revestir(w.wall(x0, D / 2, ENTRADA.x - 0.85, D / 2, 0.5, P.churrascoParede), 'tijolo');
    revestir(w.wall(ENTRADA.x + 0.85, D / 2, W / 2, D / 2, 0.5, P.churrascoParede), 'tijolo');
    // a parede da esquerda vem em dois trechos, com o vão da porta no meio
    revestir(w.wall(x0, z0, x0, PORTA.z - 1.1, H, P.churrascoParede), 'reboco');
    revestir(w.wall(x0, PORTA.z + 1.1, x0, D / 2, H, P.churrascoParede), 'reboco');

    /**
     * A CAPA DE MADEIRA das muretas. As pontas se ENCONTRAM, não se cruzam: a
     * da direita para onde começa a da frente (que cobre a quina inteira) —
     * duas tábuas sobrepostas teriam o tampo no mesmo plano, e serrilhariam.
     */
    const PAREDE = 0.15;
    const CAPA = 0.19;
    const capaDireita = D / 2 - CAPA - (z0 + PAREDE);
    w.add(fundir(w.place(capaDeMureta(capaDireita), W / 2, 0.5, z0 + PAREDE + capaDireita / 2, Math.PI / 2)));
    for (const [de, ate] of [[x0 + PAREDE, ENTRADA.x - 0.85], [ENTRADA.x + 0.85, W / 2 + CAPA]] as const) {
      w.add(fundir(w.place(capaDeMureta(ate - de), (de + ate) / 2, 0.5, D / 2)));
    }

    /**
     * O TIJOLINHO do fundo da cozinha, atrás da churrasqueira e do fogão. Ele
     * é o que dá o cheiro do lugar antes de qualquer texto: churrascaria é
     * tijolo aparente, e o tijolo só aparece onde o fogo está. Na parede da
     * pia, o AZULEJO DE METRÔ até 1,65 — é onde se lava, e lá é azulejo.
     */
    w.add(fundir(w.place(panoDeParede(13, H - 0.1, 'tijolo'), x0 + 6.5, 0, z0 + PAREDE)));
    const azulejoAte = PORTA.z - 1.1;
    const azulejoDe = z0 + PAREDE + 0.04;
    w.add(fundir(w.place(
      panoDeParede(azulejoAte - azulejoDe, 1.65, 'azulejo'), x0 + PAREDE, 0, (azulejoDe + azulejoAte) / 2, Math.PI / 2,
    )));

    /**
     * O LAMBRI de tábuas do salão, com rodapé e cimalha: meia parede, da
     * altura de uma cadeira.
     *
     * SÓ NAS PAREDES DE VERDADE. Ele nasceu também na borda `+X`, que é MURETA
     * de 0,5 — e um lambri de 1,05 numa mureta de 0,5 é uma tábua flutuando no
     * ar. Vale para tudo que se pendura: nesta cena só `-X` e `-Z` têm parede.
     * No fundo, ele PULA a estante do bar (que desce até 0,7 na parede) e
     * começa depois do balcão lateral; na esquerda, começa depois da ponta do
     * balcão de passagem.
     */
    for (const [de, ate] of [[1.05, 4.7], [8.3, W / 2 - PAREDE]] as const) {
      w.add(fundir(w.place(lambriDoSalao(ate - de), (de + ate) / 2, 0, z0 + PAREDE)));
    }
    w.add(fundir(w.place(lambriDoSalao(D / 2 - PAREDE + 1.45), x0 + PAREDE, 0, (D / 2 - PAREDE - 1.45) / 2, Math.PI / 2)));

    // ------------------------------------------------------------- a porta
    // a porta de serviço, vai e vem, com a escotilha; ela fecha também o
    // resto do vão da parede (2,2) em volta da folha (1,1)
    const porta = w.add(fundir(w.place(
      portaDeServico(P.churrascoFaixa, 1.1, 2.2, 2.2, H, -0.1), x0 + 0.1, 0, PORTA.z, Math.PI / 2,
    )));
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
    const grelha = w.add(fundir(w.place(churrasqueiraDoMania(4.4), GRELHA.x, 0, GRELHA.z)));
    w.blockBox(GRELHA.x, GRELHA.z, 2.3, 0.6);

    w.add(fundir(w.place(geladeiraDoMania(), x0 + 0.75, 0, z0 + 0.6)));
    w.blockBox(x0 + 0.75, z0 + 0.6, 0.45, 0.4);

    w.add(fundir(w.place(fogaoDoMania(2.4), x0 + 7.4, 0, z0 + 0.55)));
    w.blockBox(x0 + 7.4, z0 + 0.55, 1.25, 0.45);

    w.add(fundir(w.place(bancadaDoMania(3.2, true, 'panelas', true), x0 + 10.4, 0, z0 + 0.5)));
    w.blockBox(x0 + 10.4, z0 + 0.5, 1.6, 0.4);
    // a prateleira de parede com os potes e os utensílios: 20 cm à esquerda
    // do meio da bancada, para o cartaz dos cortes caber ao lado dela
    w.add(fundir(w.place(prateleiraDaCozinha(1.6, true), x0 + 10.2, 1.62, z0 + 0.19)));

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
    const pia = w.add(fundir(w.place(piaDoMania(2.2), PIA.x, 0, PIA.z, Math.PI / 2)));
    w.blockBox(PIA.x, PIA.z, 0.42, 1.1);
    w.add(fundir(w.place(prateleiraDaCozinha(1.2, false), x0 + 0.19, 1.75, PIA.z, Math.PI / 2)));

    /**
     * A ILHA DE MONTAGEM, solta no meio da cozinha. É a bancada onde o prato
     * vai ser montado quando o jogo existir — e é por isso que ela está VAZIA:
     * o que tem que aparecer nela é a comida.
     */
    const ILHA = { x: x0 + 6.2, z: z0 + 4.6 };
    const ilha = w.add(fundir(w.place(bancadaDoMania(3.6, false, 'cubas', false), ILHA.x, 0, ILHA.z)));
    w.blockBox(ILHA.x, ILHA.z, 1.8, 0.42);

    // ==================================================== BALCÃO DE PASSAGEM
    const larguraPassagem = PASSAGEM.xFim - PASSAGEM.xIni;
    /*
     * A campainha e o trilho das comandas moram na ponta da ESQUERDA (`x`
     * local negativo, perto da parede): as vagas do prato pronto ficam na da
     * direita, a pilha da louça no meio, e o osso do Walter perto do vão.
     */
    const passagem = w.add(fundir(w.place(
      balcaoDoMania(larguraPassagem, { cozinha: true, sino: -3.9, comandas: [-4.5, -2.2] }),
      (PASSAGEM.xIni + PASSAGEM.xFim) / 2, 0, PASSAGEM.z,
    )));
    w.blockBox((PASSAGEM.xIni + PASSAGEM.xFim) / 2, PASSAGEM.z, larguraPassagem / 2, 0.5);

    // O OSSO GUARDADO fica no balcão para sempre, depois de entregue: é o
    // rastro visível de uma coisa que a dupla fez, e ele volta a cada visita
    // porque a cena é remontada do zero (a `flag` é o que atravessa).
    if (g.flag('osso-entregue')) {
      w.add(w.place(osso(), GUARDADO.x, GUARDADO.y, GUARDADO.z, 0.4));
    }

    // o trecho que corre no Z e fecha a cozinha do lado do bar
    const comprimentoLateral = LATERAL.zFim - LATERAL.zIni;
    w.add(fundir(w.place(
      balcaoDoMania(comprimentoLateral, { cozinha: true }),
      LATERAL.x, 0, (LATERAL.zIni + LATERAL.zFim) / 2, Math.PI / 2,
    )));
    w.blockBox(LATERAL.x, (LATERAL.zIni + LATERAL.zFim) / 2, 0.5, comprimentoLateral / 2);

    // ============================================================== SALÃO

    /**
     * O BAR, no fundo à direita, com a estante de bebidas na parede e as
     * banquetas de frente para ele. As duas únicas luminárias pendentes da
     * cena moram aqui: sobre o balcão ninguém senta de frente para a câmera,
     * então elas não apagam a cabeça de ninguém.
     */
    const BAR = { x: 6.5, z: z0 + 0.9 };
    const bar = w.add(fundir(w.place(balcaoDoMania(6.4, { bar: true }), BAR.x, 0, BAR.z)));
    w.blockBox(BAR.x, BAR.z, 3.3, 0.5);
    w.add(fundir(w.place(estanteDoBar(3.4, 1.3), BAR.x, 0.7, z0 + 0.2)));
    w.add(fundir(w.place(caixaRegistradoraAntiga(), BAR.x + 2.4, 1.15, BAR.z + 0.1)));
    for (const dx of [-2.2, -0.8, 0.6, 2.0]) {
      w.add(fundir(w.place(banquetaDoBar(), BAR.x + dx, 0, BAR.z + 0.95, Math.PI)));
      w.blockCircle(BAR.x + dx, BAR.z + 0.95, 0.3);
    }
    // os pendentes jogam a poça de luz no tampo do bar (1,15), 2 cm acima dele
    for (const dx of [-1.9, 1.9]) w.add(fundir(w.place(pendenteDeEsmalte(2.35, H, 1.17), BAR.x + dx, 0, BAR.z + 0.2)));

    /**
     * AS MESAS. Onze, em três fileiras desencontradas — enfileirar tudo em
     * grade dá cara de refeitório, e não de casa que enche no domingo.
     *
     * Cada mesa é UMA peça (`mesaDoSalao`): o tampo de pés torneados, a
     * toalha xadrez caindo, o porta-temperos, o vasinho na `floreira` e as
     * quatro cadeiras de bistrô nos mesmos lugares das antigas — e a
     * `fundir()` junta a madeira das cinco numa malha só.
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
    const postas: Array<{
      x: number; z: number;
      posta: THREE.Object3D; foco: THREE.Object3D; floreira: THREE.Object3D;
    }> = [];

    for (const [x, z] of MESAS) {
      const mesa = w.add(fundir(w.place(mesaDoSalao(), x, 0, z)));
      w.blockBox(x, z, 0.8, 0.55);
      const posta = new THREE.Object3D();
      posta.position.set(x, 0, z);
      w.root.add(posta);
      const foco = new THREE.Object3D();
      foco.position.set(x, 1.0, z);
      w.root.add(foco);
      postas.push({ x, z, posta, foco, floreira: mesa.userData.floreira as THREE.Object3D });
      /**
       * A TOALHA COBRE O TAMPO E CAI DOS LADOS (mais nas quatro pontas). A
       * primeira versão era um decalque de 2 cm dentro do tampo: ela existia e
       * não aparecia. Toalha que não pendura não é toalha, é adesivo.
       *
       * As quatro cadeiras moram dentro da mesa, duas de frente para a câmera
       * e duas de costas — é essa alternância que faz a fileira parecer
       * ocupada por gente diferente. O colisor de cada uma continua aqui.
       */
      for (const [dx, dz] of [[-0.55, 0.95], [0.55, 0.95], [-0.55, -0.95], [0.55, -0.95]] as const) {
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
     * é a área, como na Gina da portaria.
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
      /**
       * O WALTER GANHA DA MESA. O ponto dele tem 1,15 de raio e o de sentar
       * tem 1,7: quando ele passeia perto de uma mesa, o prompt que aparece é
       * o da mesa, e o cachorro em pé na sua frente vira cenário. O alvo mais
       * específico ganha — e o mesmo vale para a entrega do osso, logo abaixo.
       */
      priority: 1,
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
        /**
         * O CONVITE RECUSADO NÃO SOME. Quem disse "hoje não" encontra o Walter
         * perguntando de novo no carinho seguinte — recusar é adiar, não fechar
         * a porta. Sem isto, um toque em "Hoje não" trancaria o minigame
         * inteiro para sempre.
         */
        if (api.flag('osso-entregue') && !api.flag('turno-aceito')) {
          await convidar(api);
          return;
        }
        await api.say([w.pick(FALAS_DO_WALTER)], A);
      },
    });

    /**
     * ======================================= O OSSO, E O CONVITE PARA O TURNO
     *
     * Esta é a porta de entrada do minigame de servir as mesas
     * (`docs/MINIGAME-RESTAURANTE.md`). O caminho inteiro é:
     * terra remexida no jardim da Josefina → cavar → osso na mochila → dar o
     * osso ao Walter → ele convida a dupla para o próximo turno dele.
     *
     * SÃO DUAS INTERAÇÕES NO MESMO PONTO, e não uma com dois caminhos por
     * dentro: `Interactable.label` é fixo, e o rótulo aqui é metade da graça —
     * quem chega com o osso lê "Dar o osso para o Walter" no HUD e entende
     * sozinho que as duas coisas se ligam. Só uma das duas fica ligada por vez
     * (`enabled`), então elas nunca disputam o prompt.
     *
     * O OSSO PODE ESTAR COM QUALQUER UM DOS DOIS. `hasItem` olha a mochila de
     * quem está sendo controlado, e o `T` troca isso a qualquer momento — quem
     * cavou pode não ser quem entrou no restaurante.
     */
    const quemTemOsso = (api: GameAPI): string | null => {
      if (api.hasItem('osso')) return api.playerId();
      if (api.hasItem('osso', api.companionId())) return api.companionId();
      return null;
    };

    /** O convite dele, feito duas vezes se preciso: recusar não fecha porta. */
    const convidar = async (api: GameAPI): Promise<void> => {
      await conversa([
        [A, 'Ele tá olhando pra gente e olhando pro salão. Alternado.'],
        [R, 'Acho que ele quer perguntar alguma coisa.'],
      ]);
      const topa = await api.ask(
        'Ajudar o Walter no próximo dia de trabalho dele?',
        ['Topo', 'Hoje não'],
        A,
      );
      if (topa !== 0) {
        await conversa([
          [A, 'Hoje não, Walter. Mas a gente volta.'],
          [R, 'Ele abanou mesmo assim.'],
        ]);
        return;
      }
      api.setFlag('turno-aceito');
      api.som('confirma');
      escala.visible = true;
      lerAEscala.enabled = true;
      await conversa([
        [R, 'Topamos. A gente vem no seu próximo turno.'],
        [A, 'Ele foi na parede e voltou. Acho que ele já anotou a gente na escala.'],
      ]);
      api.toast('Escala de amanhã: vocês dois', '📋');
    };

    const darOOsso = w.interact({
      id: 'mania:dar-o-osso',
      x: cachorro.x, z: cachorro.z, radius: 1.15,
      label: 'Dar o osso para o Walter', icon: '🦴',
      highlight: cachorro.group,
      priority: 1,
      onInteract: async (api) => {
        const dono = quemTemOsso(api);
        if (!dono) return;
        api.removeItem('osso', dono);
        api.som('latido');
        cachorro.receberCarinho();

        await conversa([
          [R, 'Walter. Olha o que a gente achou no jardim.'],
          [A, 'Ele congelou.'],
        ]);

        /**
         * A VOLTA OLÍMPICA. Ele entra em serviço (para de passear sozinho), dá
         * uma volta pelo salão com o osso na bandeja e guarda no balcão de
         * passagem — que é onde ele guarda o que importa. O prato da cutscene
         * de servir já viaja assim: filho da bandeja, e `attach` na chegada,
         * que troca o pai mantendo a posição no mundo.
         */
        const premio = osso();
        cachorro.entrarEmServico();
        api.focusCamera(cachorro.group);
        api.setZoom(9.5);
        cachorro.bandeja.add(premio);
        api.som('latido');
        await cachorro.irPara(4.5, 3.4, 3.0);
        await cachorro.irPara(-5.0, 3.0, 3.0);
        await cachorro.irPara(GUARDADO.x, GUARDADO.z + 1.1, 2.6);

        w.root.attach(premio);
        premio.position.set(GUARDADO.x, GUARDADO.y, GUARDADO.z);
        premio.rotation.set(0, 0.4, 0);
        api.som('sino');
        await api.wait(0.6);

        /**
         * ELE VOLTA PARA PERTO ANTES DE PERGUNTAR. A primeira versão mandava o
         * Walter embora e só então fazia a pergunta — e o convite acontecia com
         * o cachorro fora da tela, o que é o mesmo que ninguém perguntar nada.
         * Ele guarda o osso, volta, e é aí que a pergunta aparece.
         */
        const eu = api.playerPosition();
        await cachorro.irPara(eu.x + 1.4, eu.z + 1.3, 2.6);
        /**
         * A CÂMERA FICA NELE ATÉ A PERGUNTA SER RESPONDIDA. Encostar o Walter
         * na dupla não basta: ele tem meio metro de altura e os dois têm 1,7 —
         * numa câmera que desenha na frente quem tem `x + z` maior, ele some
         * atrás de um ombro na primeira parada infeliz. Com o foco nele, quem
         * pergunta está sempre no meio da tela.
         */
        api.setZoom(7.6);

        api.setFlag('osso-entregue');
        darOOsso.enabled = false;
        carinhoNoWalter.enabled = true;
        api.unlock({
          id: 'osso-do-walter',
          title: 'O osso do Walter',
          place: 'Mania de Churrasco',
          note: 'Um osso enterrado no jardim do clube, devolvido ao dono. Ele guardou no balcão, que é onde ele guarda o que importa.',
          icon: '🦴',
        });
        await convidar(api);
        api.focusCamera(null);
        api.setZoom(9.5);
        cachorro.voltarAPassear();
      },
    });

    /**
     * Quem já cavou e ainda não entregou chega com a interação certa acesa. As
     * duas trocam de lugar a cada quadro, porque o osso pode entrar e sair da
     * mochila a qualquer momento (o painel move item, e o `T` troca de dono).
     */
    const podeEntregar = (): boolean => !g.flag('osso-entregue') && quemTemOsso(g) !== null;

    // SEM ISTO o balão fica onde ele nasceu e o carinho vira um ponto morto no
    // chão: ele passeia, e o ponto de interação tem que passear junto
    w.onUpdate((dt) => {
      cachorro.update(dt);
      carinhoNoWalter.moveTo(cachorro.x, cachorro.z);
      darOOsso.moveTo(cachorro.x, cachorro.z);
      const entrega = podeEntregar();
      // durante o turno quem manda nos pontos e o minigame: o carinho e a
      // entrega do osso ficam suspensos junto com o resto do salao
      if (!turno.rodando) {
        darOOsso.enabled = entrega;
        carinhoNoWalter.enabled = !entrega;
      }
      turno.atualizar(dt);
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
      alvo: { x: number; z: number; posta: THREE.Object3D; foco: THREE.Object3D; floreira: THREE.Object3D },
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
      /**
       * O VASO SAI DA MESA ANTES DO PRATO ENTRAR. Os dois ocupam o mesmo ponto
       * — o centro do tampo — e sem isto a comida atravessa as flores. Foi o
       * Renan quem viu. É o mesmo problema que a mesa de pátio do clube
       * resolveu tirando o vasinho de vez; aqui ele só se retira enquanto dura
       * a refeição, e volta no fim.
       */
      alvo.floreira.visible = false;
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
      // a mesa volta a ser mesa posta: prato fora, flores de volta
      alvo.floreira.visible = true;
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
    const ASSENTO = 0.03;   // o topo do assento da `cadeiraDoSalao()` está em 0,50
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

    /**
     * ================================================= O TURNO (o minigame)
     *
     * Ele é montado sempre, e fica desligado até a escala mandar começar. As
     * mesas dele são as MESMAS 11 em que a dupla senta fora do turno — o salão
     * não tem dois conjuntos de mesa, um para cada modo.
     */
    const paraOTurno: MesaDoTurno[] = postas.map((p) => ({
      x: p.x, z: p.z, posta: p.posta, floreira: p.floreira,
    }));
    const turno = new TurnoDoMania(w, g, paraOTurno, TURNO, cachorro);
    // o `scripts/turno.mjs` precisa olhar por dentro do turno para provar
    // coisas que não aparecem na tela (prato órfão, vaga de bandeja presa).
    // É o mesmo caminho do `debugPlace`: gancho de teste, não de jogo.
    w.root.userData.turno = turno;

    /**
     * A CONTA DO DIA. Ela vem depois de o salão esvaziar, e não quando o
     * relógio zera: quem está dentro tem que ser servido, e é isso que
     * transforma um corte seco num fim com respiração.
     */
    turno.aoAcabar = async () => {
      const { dinheiro, coracoes, turno: jogado } = turno.conta;
      // o save primeiro: se a dupla fechar o jogo no meio das falas, o turno já contou
      const r = registrarOTurno(g, jogado, dinheiro);
      await conversa([
        [R, `Fechou. R$ ${dinheiro} no caixa.`],
        [A, coracoes >= 4
          ? `E ${coracoes} clientes saíram daqui felizes. Eu sou bom nisso.`
          : coracoes > 0
            ? `${coracoes} saíram felizes. Dá pra melhorar.`
            : 'Ninguém saiu pulando de alegria. Mas ninguém passou fome.'],
      ]);
      await g.say([`${'⭐'.repeat(r.estrelas)}  — ${r.estrelas} de 3`], 'Walter');
      if (r.recorde && g.stat(CHAVE.vezes(jogado.numero)) > 1) {
        g.toast(`Recorde do turno ${jogado.numero}: R$ ${dinheiro}`, '🏆');
      }
      await darOsPetiscos(r);

      /**
       * AS TRÊS ESTRELAS TÊM PRÊMIO, um por turno, na primeira vez delas
       * (§13.5 do plano). Da segunda vez em diante ele comemora sem repetir o
       * presente, senão o gesto vira máquina de roupa.
       */
      if (r.primeiraVezTres) await darOPremio(jogado.numero);

      if (r.abriu) {
        g.toast(`Turno ${r.abriu.numero} liberado na escala`, '🔓');
        await conversa([
          [R, 'Ele foi na parede e escreveu mais uma linha na escala.'],
          [A, `"Turno ${r.abriu.numero}: ${r.abriu.nome}."`],
          ...(r.abriu.pronto ? [] : [[R, 'Do lado tá escrito "em preparo". Ele ainda tá montando esse.'] as const]),
        ]);
      }

      await conversa([
        [R, 'Ele tá abanando. Acho que a gente pode voltar amanhã.'],
        [A, 'A escala tá ali na parede.'],
      ]);
      if (!g.flag('primeiro-turno-feito')) {
        g.setFlag('primeiro-turno-feito');
        g.unlock({
          id: 'turno-no-mania',
          title: 'O primeiro turno',
          place: 'Mania de Churrasco',
          note: 'Os dois de garçom no Mania de Churrasco, revezando o salão enquanto o Walter dava conta da cozinha.',
          icon: '📋',
        });
      }
    };

    /**
     * OS PETISCOS: a moeda do Mania, ideia do Renan. O Walter dá um por
     * estrela no fim de TODO turno (inclusive turno já vencido), e eles
     * compram as melhorias do salão na escala. Na primeira vez ele explica.
     */
    const darOsPetiscos = async (r: ResultadoDoTurno): Promise<void> => {
      const total = g.stat(CHAVE.petiscos);
      if (!g.flag('petiscos-explicados')) {
        g.setFlag('petiscos-explicados');
        g.som('latido');
        await conversa([
          [A, 'Ele voltou da cozinha com um potinho na boca.'],
          [R, `Petiscos! ${r.petiscos === 1 ? 'Um' : r.petiscos === 2 ? 'Dois' : 'Três'}. Um pra cada estrela.`],
          [A, 'Ele guarda o resto num pote com os nossos nomes.'],
          [R, 'E diz que dá pra trocar por melhoria pro salão. Tá na escala.'],
        ]);
      }
      g.som('pegar');
      g.toast(`+${r.petiscos} ${r.petiscos === 1 ? 'petisco' : 'petiscos'} · ${total} no pote`, '🍢');
    };

    const darOPremio = async (numero: number): Promise<void> => {
      if (numero === 1) {
        /**
         * A GRAVATINHA DELE, o prêmio de antes da temporada: ele tira do
         * próprio pescoço — e saca outra igual da gaveta no quadro seguinte,
         * porque tirar a gravata do Walter para sempre seria tirar o que faz
         * ele ser o Walter.
         */
        if (g.flag('gravata-do-walter')) return;
        g.setFlag('gravata-do-walter');
        g.som('latido');
        cachorro.receberCarinho();
        await conversa([
          [A, 'Ele tá dando três voltas em volta da mesa.'],
          [R, 'Quatro. Ele deu quatro.'],
        ]);
        await g.say(['Ele parou. Tá mexendo na gravata.'], A);
        await conversa([
          [R, 'Walter, não precisa.'],
          [A, 'Renan. Ele quer dar.'],
        ]);
        g.som('memoria');
        for (const quem of [g.playerId(), g.companionId()]) {
          g.storeItem(ITENS.gravataDoWalter, quem);
        }
        await conversa([
          [R, 'Obrigado, Walter.'],
          [A, '…ele tirou outra igual da gaveta e já botou.'],
          [R, 'Claro que ele tem mais de uma.'],
        ]);
        g.toast('Gravatinha do Walter — no guarda-roupa', '🎀');
        g.unlock({
          id: 'gravata-do-walter',
          title: 'A gravatinha do Walter',
          place: 'Mania de Churrasco',
          note: 'Três estrelas no turno, e ele tirou a própria gravata do pescoço para dar de presente. Tinha outra igual na gaveta.',
          icon: '🎀',
        });
        return;
      }
      const pecas = PREMIOS_DO_MANIA[numero] ?? [];
      if (!pecas.length) return;
      if (numero === 2) {
        // O AVENTAL: ele some na cozinha e volta arrastando dois, um de cada
        // dupla de mãos — uniforme oficial da casa
        g.som('latido');
        cachorro.receberCarinho();
        await conversa([
          [A, 'Ele saiu correndo pra cozinha.'],
          [R, 'Voltou arrastando um pano preto pela boca.'],
          [A, 'Dois! São dois aventais. Com "Mania" bordado em dourado.'],
        ]);
        g.som('memoria');
        for (const p of pecas) g.ganharPeca(p);
        await conversa([
          [R, 'Uniforme oficial. Agora a gente é da casa.'],
          [A, 'Eu vou usar com a gravatinha. Combina.'],
        ]);
        g.toast('Avental de garçom do Mania — no guarda-roupa', '🍽️');
        g.unlock({
          id: 'avental-do-mania',
          title: 'O avental do Mania',
          place: 'Mania de Churrasco',
          note: 'Três estrelas no turno da sobremesa, e o Walter trouxe da cozinha dois aventais pretos com o nome do restaurante bordado em dourado.',
          icon: '🍽️',
        });
        return;
      }
      if (numero === 3) {
        // O BLOQUINHO E O LÁPIS: o Walter traz da gaveta do bar o mesmo
        // bloquinho de comandas da casa, um para cada um
        g.som('latido');
        cachorro.receberCarinho();
        await conversa([
          [R, 'Ele foi na gaveta do bar e voltou com a boca cheia.'],
          [A, 'Bloquinho de comanda! E um lápis pra cada um.'],
        ]);
        g.som('memoria');
        for (const p of pecas) g.ganharPeca(p);
        await conversa([
          [R, 'Lápis atrás da orelha. Agora sim eu pareço garçom.'],
          [A, 'E o bloquinho na outra mão. Profissional.'],
        ]);
        g.toast('Bloquinho e lápis na orelha — no guarda-roupa', '✏️');
        g.unlock({
          id: 'lapis-na-orelha',
          title: 'O lápis na orelha',
          place: 'Mania de Churrasco',
          note: 'Três estrelas no turno do Cookie, e o Walter tirou da gaveta do bar um bloquinho de comandas e um lápis para cada um.',
          icon: '✏️',
        });
        return;
      }
      if (numero === 4) {
        // O COLETE: o Walter traz dois, e a Estella já tinha contado que foi
        // ela que costurou
        g.som('latido');
        cachorro.receberCarinho();
        await conversa([
          [A, 'Ele trouxe dois cabides da cozinha. Com colete!'],
          [R, 'A Estella falou que foi ela que costurou. Pra gente.'],
        ]);
        g.som('memoria');
        for (const p of pecas) g.ganharPeca(p);
        await conversa([
          [A, 'Colete de garçom com camisa branca. Isso é nível restaurante francês.'],
          [R, 'O Jean-Luc vai aprovar.'],
        ]);
        g.toast('Colete de garçom — no guarda-roupa', '🦺');
        g.unlock({
          id: 'colete-de-garcom',
          title: 'O colete da Estella',
          place: 'Mania de Churrasco',
          note: 'Três estrelas no turno do Jean-Luc, e o Walter entregou dois coletes de garçom — costurados pela Estella.',
          icon: '🦺',
        });
        return;
      }
      for (const p of pecas) g.ganharPeca(p);
      g.toast(`${pecas.map((p) => p.nome).join(', ')} — no guarda-roupa`, pecas[0].icone);
    };

    /**
     * =========================================== AS MELHORIAS, NO SALÃO
     *
     * Cada melhoria comprada na escala aparece no lugar: a chapa nova (ou a
     * dupla) na ilha da cozinha, o cavalete da fila na entrada, o rádio
     * tocando no bar e o carrinho de louça entre as mesas. As peças são
     * montadas sempre e ficam escondidas até a compra — a compra acontece com
     * a escala aberta, e a peça tem que aparecer quando ela fecha, sem
     * remontar a cena. A bandeja, o tênis e o bloquinho vão no corpo da
     * dupla, e quem os põe é o turno.
     */
    const ILHA_DA_CHAPA = { x: x0 + 7.25, z: z0 + 4.6 };
    const chapaNova = w.add(fundir(w.place(chapaDoWalter(false), ILHA_DA_CHAPA.x, 0.92, ILHA_DA_CHAPA.z)));
    const chapaDupla = w.add(fundir(w.place(chapaDoWalter(true), ILHA_DA_CHAPA.x - 0.2, 0.92, ILHA_DA_CHAPA.z)));
    // o cavalete fica NA FRENTE da fila, do lado de dentro: colado na mureta da
    // direita (onde ele nasceu) a mureta engolia metade dele na câmera
    const CAVALETE = { x: 8.95, z: 7.05 };
    const cavalete = w.add(fundir(w.place(cavaleteDaFila(), CAVALETE.x, 0, CAVALETE.z, 0.6)));
    const radio = new RadioDoBar();
    w.add(fundir(w.place(radio.group, 4.05, 1.15, z0 + 0.85, 0.15)));
    const carrinho = w.add(fundir(w.place(carrinhoDeLouca(), CARRINHO.x, 0, CARRINHO.z)));
    const colisor = { cavalete: false, carrinho: false };
    const mostrarMelhorias = (): void => {
      const n = niveisDasMelhorias(g);
      chapaNova.visible = n.chapa === 1;
      chapaDupla.visible = n.chapa >= 2;
      cavalete.visible = n.reserva > 0;
      radio.group.visible = n.radio > 0;
      carrinho.visible = n.carrinho > 0;
      // o cavalete e o carrinho estão no chão do salão: ganham colisor quando
      // aparecem (uma vez só — comprado, não sai mais)
      if (n.reserva > 0 && !colisor.cavalete) {
        colisor.cavalete = true;
        w.blockCircle(CAVALETE.x, CAVALETE.z, 0.32);
      }
      if (n.carrinho > 0 && !colisor.carrinho) {
        colisor.carrinho = true;
        w.blockBox(CARRINHO.x, CARRINHO.z, 0.5, 0.3);
      }
    };
    mostrarMelhorias();
    // o rádio toca: as notas sobem enquanto ele está à vista
    w.onUpdate((dt) => {
      if (radio.group.visible) radio.update(dt);
    });

    // ------------------------------------------------------------- enfeites
    // a placa do nome, em cima do bar: é a primeira coisa que se lê ao entrar
    w.add(fundir(w.place(placaDoSalao('Mania de Churrasco', 6.2, 0.9), BAR.x, 2.5, z0 + PAREDE)));

    /**
     * A LOUSA DO DIA, na parede da esquerda do SALÃO, entre os dois lampiões.
     *
     * Ela morava no fundo da cozinha, em `x = -8,5` — exatamente atrás da
     * coifa e da chaminé da churrasqueira, que vão de 1,94 a 3,5 bem na
     * frente dela: a lousa existia e ninguém via (as fotos da reforma
     * mostraram). Prato do dia é para quem vem comer, então ela passou para
     * o salão, e o ponto de ler foi junto.
     */
    const LOUSA = { x: x0 + PAREDE, z: 3.75 };
    const lousa = w.add(fundir(w.place(
      lousaDoMania(['Hoje', 'picanha na brasa', 'arepa recheada', 'suco de morango'], 1.7, 1.35),
      LOUSA.x, 1.85, LOUSA.z, Math.PI / 2,
    )));

    /**
     * Os LAMPIÕES moram nas DUAS paredes de verdade (`-Z` e `-X`). Estavam na
     * borda `+X`, que é mureta de 0,5: cinco luminárias boiando no vazio a dois
     * metros do chão. O do fundo à direita foi para `x = 10,35`: em 11,0 ele
     * entrava 8 cm na moldura do quadro do Walter.
     */
    for (const [x, z, rot] of [
      [-2.0, z0 + PAREDE + 0.04, 0], [1.6, z0 + PAREDE, 0], [10.35, z0 + PAREDE, 0],
      [x0 + PAREDE, 1.5, Math.PI / 2], [x0 + PAREDE, 6.0, Math.PI / 2],
    ] as const) {
      w.add(fundir(w.place(lampiaoDeParede(), x, 2.15, z, rot)));
    }

    /**
     * O QUADRO DE EMPREGADO DO MÊS, no lugar onde antes tinha um retângulo
     * vermelho sem nada dentro. Ele fica na parede do fundo, ao lado da
     * registradora — que é onde uma churrascaria de verdade pendura o troféu
     * do funcionário: onde o cliente paga a conta e lê o nome de quem serviu.
     */
    const quadroDoEmpregado = w.add(fundir(w.place(quadroDoWalter(), 11.4, 1.95, z0 + PAREDE)));
    w.interact({
      id: 'mania:empregado-do-mes',
      // o balcão do bar vai até z = -7,6; o ponto fica na frente dele
      x: 11.4, z: z0 + 1.5, radius: 1.8,
      label: 'Ler o quadro de empregado do mês', icon: '🏆',
      highlight: quadroDoEmpregado,
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
    // o cartaz dos cortes do boi, no tijolinho entre a prateleira e o balcão lateral
    w.add(fundir(w.place(cartazDosCortes(0.62, 0.82), -0.6, 1.9, z0 + PAREDE + 0.04)));

    /**
     * A ESCALA DE TRABALHO, ao lado do quadro do Empregado do Mês.
     *
     * Ela só EXISTE depois que a dupla aceita o convite do Walter — antes
     * disso é uma parede vazia, e é isso que faz o convite valer alguma coisa:
     * a resposta muda o cenário. Como a cena é remontada a cada visita, quem
     * decide se ela nasce visível é a `flag`, não o que aconteceu nesta sessão.
     *
     * É um quadro de giz, como o do cardápio do dia do outro lado do salão: a
     * casa escreve as coisas a giz, e isso é do lugar.
     *
     * ONDE ELA FICA: à ESQUERDA da placa do nome, a pedido do Renan. Ela
     * estava em `x = 9,6`, e ali a placa passava POR CIMA dela — as duas se
     * cruzavam entre `y 2,05` e `2,25`, e no celular a escala aparecia meio
     * comida. A placa ocupa de 3,3 a 9,7 com as pilastras, então a escala vai
     * para `x = 2,4` (1,9 a 2,9): 0,4 de folga para a placa, e a arandela de
     * `x = 1,6` fica do outro lado sem encostar.
     */
    const escala = w.add(fundir(w.place(
      lousaDoMania(['Escala de amanhã', 'Walter', ARI.name, RENAN.name], 1.2, 1.05),
      2.4, 1.7, z0 + PAREDE,
    )));
    escala.visible = g.flag('turno-aceito');

    const lerAEscala = w.interact({
      id: 'mania:escala',
      x: 2.4, z: z0 + 1.5, radius: 1.6,
      label: 'Ler a escala de amanhã', icon: '📋',
      highlight: escala,
      onInteract: async (api) => {
        if (turno.rodando) return;
        if (!api.flag('primeiro-turno')) {
          await conversa([
            [A, '"Escala de amanhã: Walter." E os nossos dois nomes embaixo.'],
            [R, 'Ele escreveu com giz. Com a boca, imagino.'],
            [A, 'Então é sério mesmo. A gente vai trabalhar.'],
            [R, 'A gente serve as mesas e ele cuida da cozinha.'],
            [A, 'Eu vou ser o melhor garçom que esse salão já viu.'],
          ]);
        }
        // A ESCALA DO WALTER: o menu dos turnos (`ui/escalaDoWalter.ts`)
        const numero = await api.abrirEscalaDoWalter();
        // o que foi comprado com a escala aberta aparece agora no salão
        mostrarMelhorias();
        const escolhido = numero === null ? null : turnoPorNumero(numero);
        if (!escolhido || turno.rodando) return;

        if (!api.flag('primeiro-turno')) {
          api.setFlag('primeiro-turno');
          await conversa([
            [R, 'Como é que funciona?'],
            [A, 'A gente leva quem chega até uma mesa, anota o pedido e leva pro Walter.'],
            [R, 'E quando eles acabam de comer?'],
            [A, 'A gente recebe e leva a louça de volta pro balcão. Mesa suja não recebe ninguém.'],
            [R, 'A gente é dois. Aperta T e você vira o outro.'],
            [A, 'Mas o que você largar fica parado onde estava. Pensa em onde larga.'],
          ]);
        }
        // o bicho novo do turno, apresentado na primeira vez
        if (escolhido.numero === 2 && !api.flag('turno-2-explicado')) {
          api.setFlag('turno-2-explicado');
          await conversa([
            [A, 'Turno dois. Diz aqui que o Mano vem jantar.'],
            [R, 'O Mano do sorvete? Aposto que ele pede sobremesa.'],
            [A, 'Então a mesa dele demora o dobro. Senta ele onde não atrapalha.'],
          ]);
        }
        if (escolhido.numero === 3 && !api.flag('turno-3-explicado')) {
          api.setFlag('turno-3-explicado');
          await conversa([
            [A, 'Turno três. O Cookie vem tomar um suco.'],
            [R, 'O Cookie não cabe numa mesa só. A do lado vai ficar fechada pra ele.'],
            [A, 'Mas ele só toma suco, e rápido. Escolhe bem onde ele senta.'],
          ]);
        }
        if (escolhido.numero === 4 && !api.flag('turno-4-explicado')) {
          api.setFlag('turno-4-explicado');
          await conversa([
            [A, '"Canard à la Mania." O Jean-Luc vem jantar.'],
            [R, 'E hoje o prato esfria no balcão. O vapor some quando ele esfria.'],
            [A, 'O Jean-Luc só come quente. E a Estella vem também.'],
            [R, 'Ela vai reparar na nossa roupa. Melhor vir de uniforme.'],
          ]);
        }
        await turno.comecar(escolhido, niveisDasMelhorias(api));
      },
    });
    lerAEscala.enabled = g.flag('turno-aceito');

    // o vaso que estava em `(11; 7,8)` saiu do caminho: ele nasceu antes do vão
    // da entrada, e depois passou a ficar plantado bem na soleira.
    //
    // As três plantas são do kit, cada uma no canto que combina com ela: a
    // jiboia baixa perto da mureta (alta ali, ela taparia a mesa de trás), a
    // figueira no canto da parede, e a espada-de-são-jorge no fim do bar.
    w.add(fundir(w.place(jiboiaEmVaso(1.4, P.plantPot), W / 2 - 1.0, 0, 3.2)));
    w.add(fundir(w.place(figueiraLira(1.0), x0 + 1.1, 0, D / 2 - 1.2)));
    w.add(fundir(w.place(plantaDeEspada(1.3), 11.2, 0, -1.4)));
    for (const [x, z] of [[W / 2 - 1.0, 3.2], [x0 + 1.1, D / 2 - 1.2], [11.2, -1.4]] as const) {
      w.blockCircle(x, z, 0.32);
    }

    // o capacho da entrada de serviço, para a porta não abrir no vazio
    w.add(w.place(tapete(1.6, 1.1, P.churrascoTijolo, 'capacho'), x0 + 1.5, 0, PORTA.z));
    // e o capacho da ENTRADA DA FRENTE, no vão da mureta: é por onde entra
    // quem vem comer, e ele marca a soleira sem construir porta nenhuma
    w.add(w.place(tapete(1.5, 1.0, P.churrascoToalha, 'capacho'), ENTRADA.x, 0, D / 2 - 0.62));
    // os pilaretes torneados arrematam as duas pontas da mureta na entrada
    for (const dx of [-0.85, 0.85]) w.add(fundir(w.place(pilarete(0.82), ENTRADA.x + dx, 0, D / 2)));

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
          [R, 'Confiam na Gina, que deixou a gente entrar.'],
        ]);
        api.som('sino');
      },
    });

    w.interact({
      id: 'mania:lousa',
      x: LOUSA.x + 1.35, z: LOUSA.z, radius: 2,
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
