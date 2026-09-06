import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { GameAPI, SceneDef } from '../core/types';
import { flat, toon } from '../core/materials';
import {
  bin, bleachers, bus, busStop, bush, cadeiraDeSalvaVidas, canteiro, canteiroComPalmeira,
  canteiroDeHorta, planta, regador, terraRemexida, vasoDePlanta,
  cloud, divingBoard,
  floatRing, floodlight, flowers, kiosk, lamp, mesinhaDeDeque, parasol, pergolado, poolLadder,
  guarita, meioFio, mesaDePatio, muroDoClube, poolShell, poolWater, portaoDoClube, restaurante, sebe,
  showerPost, sunLounger, textSign,
  tree, vestiario as predioDoVestiario, waterFountain,
  dogWaiter, pratoServido,
} from '../world/props';
import { interiorDoor } from '../world/furniture';
import { Gina } from '../entities/bichos/Gina';
import { Capy } from '../entities/bichos/Capy';
import { Noel } from '../entities/bichos/Noel';
import { Josefina } from '../entities/bichos/Josefina';
import { ARI, RENAN } from '../characters/cast';
import { ITENS, MODA_PRAIA } from '../world/itens';
import { pratoPorId } from '../world/cardapioData';
import { asfalto, calcadaDePedrinha, pisoDePlacas, tapeteDeGrama } from '../world/texturasDeChao';

/**
 * Clube — a piscina.
 *
 * Cenário do que ainda não aconteceu: a gente ainda não foi, então o jogo vai
 * na frente. A piscina é um buraco de verdade no piso (`w.groundWithHoles`),
 * e quem entra na água afunda e passa a nadar.
 */

const PISCINA = { x: 0, z: -3, largura: 16, profundidade: 10, fundo: 1.6 };

/**
 * O que o Capy diz nas conversas seguintes. A primeira e a apresentacao dele, e
 * so acontece uma vez — funcionario que repete o mesmo texto de boas-vindas
 * toda vez deixa de ser gente e vira placa.
 */
/** o que a Josefina conta nas visitas seguintes: uma historinha por vez */
const HISTORIAS_DA_JOSEFINA = [
  'A lavanda foi a primeira. Plantei ela sozinha, num copo, antes de existir canteiro aqui.',
  'O girassol não olha pro sol, sabia? Ele olha pro lado que dá menos trabalho. Eu respeito.',
  'Já tive um tomateiro que deu um tomate só. Um. A gente comemorou igual.',
  'A samambaia é a mais dramática. Se eu esqueço um dia, ela finge que morreu.',
  'Alface a gente colhe de fora pra dentro. Assim ela continua crescendo pelo meio.',
  'Quando chove forte eu fico aqui, olhando. Não tem por que correr, já tá tudo regado.',
  'Essa daqui no meu casco eu levo comigo. É que ela ainda é pequenininha.',
];

const FALAS_DO_NOEL = [
  'Suco gelado com esse sol? É quase obrigatório.',
  'Hoje o abacaxi tá doce sem precisar de açúcar. SEM AÇÚCAR!',
  'Provaram o de maracujá? Não? Ai. Ai, ai, ai.',
  'Eu tomo uns seis por dia. Seis! É trabalho de campo.',
  'A laranja de hoje veio da feira de sábado. Eu escolhi uma por uma.',
  'Fruta boa não precisa de truque, viu? Só de gelo.',
];

const FALAS_DO_CAPY = [
  'Tá tudo tranquilo. Do jeito que eu gosto.',
  'Se afundarem, eu desço. Mas prefiro que não afundem.',
  'Já contei vocês dois. Podem ir.',
  'O sol vira nessa hora. Daqui a pouco a sombra chega na espreguiçadeira.',
  'Bebam água. Piscina engana, viu?',
];

/**
 * O piso do clube. Ele já foi 34×26 e 48×38; agora é 56×46, e ANDOU PARA O
 * LESTE (`x = 4`) em vez de crescer para os dois lados.
 *
 * O motivo é que o oeste está cheio: o muro fica em `-25`, e logo depois dele
 * vêm a calçada, a guia e a rua. Crescendo simétrico, o piso nasceria embaixo
 * do asfalto. Empurrando o centro, a beirada oeste fica onde sempre esteve
 * (`-24`, colada na faixa de grama do muro) e todo o espaço novo aparece do
 * outro lado, que é justamente o canto vazio.
 *
 * A PISCINA NÃO SE MEXE. O furo que o `groundWithHoles` abre no piso é o que
 * deixa quem afunda continuar visível; ele sai de `PISCINA`, não daqui, então
 * mexer no deck nunca arrasta o buraco junto — mas o furo é LOCAL à malha, e
 * agora o deck está deslocado nos DOIS eixos: quem não descontar o `x` também
 * abre o buraco no lugar errado.
 */
const DECK = { x: 4, z: -3, largura: 56, profundidade: 46 };

/**
 * Onde o ônibus encosta: canto de baixo à ESQUERDA, deitado ao longo do Z.
 *
 * Ele tem 3,2 de altura, e a câmera isométrica vem de `+X/+Z` — o que estiver
 * com x ou z maior que o jogador é desenhado NA FRENTE dele. Na borda de baixo
 * (`+Z`, onde estava a cerca) um ônibus taparia quem fosse embarcar; na borda
 * da esquerda ele fica ATRÁS de quem chega, e ainda mostra a porta, que é o
 * lado interessante.
 */
const PARADA = { x: -31.9, z: 9 };

/**
 * A rua do clube, do mesmo jeito que a do Villa-Lobos: calçada, asfalto com
 * tracejado no meio e a guia entre os dois.
 *
 * Ela vive FORA do clube, e com FOLGA: entre a beirada do piso de placas
 * (`x = -24`) e a calçada (que começa em `-26`) sobram 2 m de grama. É onde um
 * dia entra o que fecha o clube — cerca, muro, sebe —, e é o que impede a rua
 * de encostar no restaurante.
 *
 * O comprimento é o do cenário inteiro (80 contra os 44 de área jogável): rua
 * que começa e acaba dentro da tela vira pátio. Como ela passa por fora do
 * deck, não esbarra mais no restaurante (`x = -17, z = -14`) e pode atravessar
 * de ponta a ponta.
 */
const RUA = {
  calcada: -27.4, larguraCalcada: 2.8,
  asfalto: -33.2, larguraAsfalto: 8.8,
  guia: -28.8,
  z: 0, comprimento: 80,
};

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
    // quem volta do Mania de Churrasco sai pela porta de serviço, atrás do
    // prédio: um passo para fora dela, já de costas para a parede
    'dos-fundos-do-restaurante': { x: -14.6, z: -18.9, facing: Math.PI },
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
      x: DECK.x,
      z: DECK.z,
      holes: [{ ...buraco, x: buraco.x - DECK.x, z: buraco.z - DECK.z }],
      // placa de 2 m, que é o tamanho de piso de borda de piscina de verdade
      textura: pisoDePlacas(2),
    });

    /**
     * O GRAMADO DO FUNDO LESTE. O piso novo é grande, e piso grande e vazio lê
     * como estacionamento — esta mancha de grama por cima dele quebra o campo de
     * concreto e já marca onde as próximas atrações vão morar. É decalque: entra
     * DEPOIS do deck, então aparece por cima dele sem brigar por profundidade.
     */
    w.patch(23, -14, 12, 20, P.grass, 0, 0.018, tapeteDeGrama(9));
    // A RUA, na borda esquerda: o ônibus não podia continuar estacionado em
    // cima do piso do clube. Vem por cima do deck e da grama, na mesma ordem do
    // Villa-Lobos — calçada, guia, asfalto — para os dois lados da viagem
    // parecerem o mesmo lugar.
    w.patch(RUA.calcada, RUA.z, RUA.larguraCalcada, RUA.comprimento, P.concrete, 0, 0.02, calcadaDePedrinha());
    w.patch(RUA.asfalto, RUA.z, RUA.larguraAsfalto, RUA.comprimento, P.asphalt, 0, 0.024, asfalto());
    for (let z = RUA.z - RUA.comprimento / 2 + 2; z <= RUA.z + RUA.comprimento / 2 - 2; z += 5) {
      w.patch(RUA.asfalto, z, 0.22, 2, P.metalWhite, 0, 0.028);
    }
    w.add(w.place(meioFio(RUA.comprimento), RUA.guia, 0, RUA.z));

    // A GUIA NÃO TEM COLISÃO. Ela já foi parede com um vão na frente da parada,
    // e na prática só atrapalhava: um degrau de 14 cm parando a dupla no meio
    // do caminho do ônibus. Ela continua desenhada, e se atravessa por cima
    // dela em qualquer ponto.

    /**
     * A SEBE, e o limite de caminhada COLADO NELA.
     *
     * Este é o conserto da reclamação: o limite estava dois metros antes da
     * beirada do piso, e invisível — a dupla batia numa parede no meio do
     * concreto. Agora a cerca viva fica em cima da beirada, o limite para 90 cm
     * antes dela (o corpo tem 42 cm de raio), e quem para, para porque tem uma
     * moita na frente.
     *
     * Ela fecha os TRÊS lados abertos; o oeste é o muro, que já fecha.
     */
    const BORDA = {
      leste: DECK.x + DECK.largura / 2,
      fundo: DECK.z - DECK.profundidade / 2,
      frente: DECK.z + DECK.profundidade / 2,
      oeste: DECK.x - DECK.largura / 2,
    };
    for (const [x, z, comprimento, rot] of [
      [BORDA.leste, DECK.z, DECK.profundidade, Math.PI / 2],
      [(BORDA.oeste + BORDA.leste) / 2, BORDA.fundo, DECK.largura, 0],
      [(BORDA.oeste + BORDA.leste) / 2, BORDA.frente, DECK.largura, 0],
    ] as const) {
      w.add(w.place(sebe(comprimento), x, 0, z, rot));
      const meia = comprimento / 2;
      w.blockBox(x, z, rot ? 0.55 : meia, rot ? meia : 0.55);
    }

    /**
     * O LIMITE DE CAMINHADA ACOMPANHA O PISO NOVO.
     *
     * Ele estava em `22 / -19 / 16` enquanto o deck ia até `24 / -21 / 17`: a
     * dupla batia numa parede invisível dois metros antes da beirada, nos três
     * lados. Agora ele para na sebe, e a área jogável passa de 52×35 para
     * 62×45.
     *
     * Na esquerda ele continua indo até a beira do asfalto (`-30`), senão
     * ninguém alcança a porta do ônibus, que para do lado de fora do clube.
     */
    w.setBounds(-30, BORDA.fundo + 0.9, BORDA.leste - 0.9, BORDA.frente - 0.9);

    // --------------------------------------------------- o muro e o portão
    /**
     * O MURO FICA EM CIMA DA FAIXA DE GRAMA que a rua deixou entre a calçada
     * (`-26`) e a beirada do piso (`-24`) — os 2 m que estavam reservados
     * exatamente para "o que fecha o clube". Ele fecha SÓ ESTE LADO, o da rua;
     * os outros três continuam no limite invisível, como sempre foram.
     *
     * A entrada não é uma porta: são 7 m de vão entre duas pilastras de 3,3
     * com luminária em cima, e as duas folhas de ferro abertas para dentro. Sete
     * metros é o que faz a dupla entrar lado a lado sem se espremer — e é o que
     * separa um portão de clube de um portãozinho de quintal.
     */
    const MURO = { x: -25, z: 7, vao: 7 };
    /** as pilastras ficam meio metro para fora do vão, e têm 1,24 de base */
    const PILAR = MURO.vao / 2 + 0.5;
    const MEIA_PILASTRA = 0.62;

    // A SOLEIRA: a grama não chega até o portão. Quem entra pisa em pedrinha
    // desde a calçada, que é o que amarra a rua na entrada do clube.
    w.patch(MURO.x, MURO.z, 2, MURO.vao + 1.4, P.concrete, 0, 0.026, calcadaDePedrinha());

    w.add(w.place(portaoDoClube(MURO.vao), MURO.x, 0, MURO.z, Math.PI / 2));
    for (const dz of [-PILAR, PILAR]) {
      w.blockBox(MURO.x, MURO.z + dz, MEIA_PILASTRA, MEIA_PILASTRA);
    }
    /**
     * As folhas abertas são 3,4 m de ferro deitados para dentro do clube, e
     * precisam de colisão própria: sem ela dá para atravessar o portão aberto
     * como se fosse fumaça. Elas abrem 90° cheios justamente para a caixa sair
     * reta — folha em 100° pediria colisor girado.
     */
    const FOLHA = MURO.vao / 2 - 0.08;
    for (const dz of [-MURO.vao / 2, MURO.vao / 2]) {
      w.blockBox(MURO.x + FOLHA / 2 + 0.07, MURO.z + dz, FOLHA / 2, 0.1);
    }

    /**
     * Os dois trechos de muro, um de cada lado do portão. Eles passam do limite
     * de caminhada (`z` de -24 a 18) e vão até -27 e 21: muro que acaba antes do
     * limite não fecha nada — sobra um vão por onde se sai andando pela grama —,
     * e muro que acaba EXATAMENTE nele fica com cara de cenário de teatro,
     * parando no ar no meio da grama. Passando das quinas do piso, ele sai do
     * enquadramento em vez de terminar.
     */
    for (const [z0, z1] of [
      [-27, MURO.z - PILAR - MEIA_PILASTRA],
      [MURO.z + PILAR + MEIA_PILASTRA, 21],
    ] as const) {
      const comprimento = z1 - z0;
      const meio = (z0 + z1) / 2;
      w.add(w.place(muroDoClube(comprimento), MURO.x, 0, meio, Math.PI / 2));
      w.blockBox(MURO.x, meio, 0.31, comprimento / 2);
    }

    // ----------------------------------------------------- a portaria
    /**
     * A GUARITA fica do lado de DENTRO e ao SUL do portão. A janela olha para o
     * `+Z`, que é ao mesmo tempo o lado por onde a dupla chega e o lado de onde
     * a câmera vem — as duas coisas que uma peça de balcão precisa acertar.
     *
     * ELA NÃO PODE ENCOSTAR NO MURO, e a primeira versão encostava. A folha
     * aberta do portão é 3,4 m de grade a 2,3 de altura em `z = 3,5`: numa
     * câmera de 34° ela joga uma faixa listrada por cima de tudo que estiver
     * até 3,4 atrás dela, e a guarita apanhava a faixa inteira na cara. Aqui,
     * quatro metros para dentro e com a frente em `z = 3,7`, a guarita fica NA
     * FRENTE da folha em vez de atrás — quem passa a ser tapado é a grade, que
     * é fundo de cena.
     */
    const GUARITA = { x: -20.6, z: 2.6, largura: 2.6, profundidade: 2.2 };
    w.add(w.place(guarita(GUARITA.largura, GUARITA.profundidade), GUARITA.x, 0, GUARITA.z));
    // a caixa engole o balcão, que avança 0,37 além da parede da frente
    w.blockBox(GUARITA.x, GUARITA.z + 0.2, GUARITA.largura / 2 + 0.2, GUARITA.profundidade / 2 + 0.25);

    /**
     * A GIRAFA PORTEIRA.
     *
     * A área dela é MENOR que os 70 cm de deslocamento mínimo que o cérebro do
     * `Bicho` exige de um destino — é assim que ela fica no posto sem uma linha
     * de código nova: as doze tentativas de destino falham e ele a devolve para
     * `parado`, respirando e olhando a rua. Nada de `enabled = false`.
     *
     * Ela nasce ADIANTADA em `z` dentro da guarita, e não no meio dela: o
     * pescoço se debruça 0,93 para a frente, e é essa soma que põe a cabeça em
     * cima do balcão — do lado de fora da parede E do lado de fora da sombra do
     * telhado, que a 34° come tudo que fica mais de meio metro para dentro. Com
     * o corpo no meio da casinha, a cabeça aparecia escura por uma fresta.
     */
    const gina = new Gina({
      minX: GUARITA.x - 0.15, maxX: GUARITA.x + 0.15,
      minZ: GUARITA.z + 0.2, maxZ: GUARITA.z + 0.5,
    });
    w.add(gina.group);
    gina.aoSoar = () => g.som('apito');

    const falarComOPorteiro = w.interact({
      id: 'clube:portaria',
      x: GUARITA.x, z: GUARITA.z + 1.9, radius: 2.2,
      label: 'Falar com a Gina', icon: '🦒',
      highlight: gina.group,
      onInteract: async (api) => {
        gina.receberCarinho();
        api.som('apito');
        // O NOME É DO ARI, e as falas são as mesmas de antes: o Renan pediu
        // para batizá-la sem mexer nelas. O nome entra por uma linha nova, dela
        // mesma se apresentando — trocar as falas por causa de um nome seria
        // reescrever a coisa fofa para caber a etiqueta.
        const G = 'Gina';
        await api.say(['Bom diaaa! Carteirinha na mão? …Brincadeira, pode entrar.'], G);
        await api.say(['Sou a Gina, viu? Qualquer coisa é comigo.'], G);
        await conversa([
          [R, 'Ela é bem mais alta de perto.'],
          [A, 'Ela é bem mais simpática de perto.'],
        ]);
        await api.say([
          'Aproveitem o dia, viu? A piscina tá uma delícia, o sol tá de graça e o almoço sai até as três.',
        ], G);
        await api.say(['E se molharem o cabelo, sequem antes de sentar no restaurante. Ordem da casa.'], G);
        await conversa([
          [A, 'Pode deixar.'],
          [R, 'Ela é a melhor coisa deste clube.'],
        ]);
        api.unlock({
          id: 'girafa-da-portaria',
          title: 'A Gina da portaria',
          place: 'Clube',
          note: 'A porteira do clube: quepe, pescoço de três metros e apito no peito, mandando a gente aproveitar o dia.',
          icon: '🦒',
        });
      },
    });

    // sem isto o balão fica onde ela nasceu — e ela se mexe, mesmo no posto
    w.onUpdate((dt) => {
      gina.update(dt);
      falarComOPorteiro.moveTo(gina.x, gina.z + 1.9);
    });

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

    /**
     * O CAPY, o salva-vidas da piscina, e o segundo funcionário do clube depois
     * da Gina. A piscina é o centro deste cenário e não tinha ninguém tomando
     * conta dela — clube com piscina cheia e nenhum salva-vidas é a coisa que
     * mais denuncia que o lugar é cenário e não lugar.
     *
     * ONDE ELA FICA, e por que aqui — foi a segunda tentativa. A primeira punha
     * a cadeira em `(-9,5, -8,5)`, que na planta parece a quina da piscina e na
     * foto era o DEQUE DE MADEIRA DO RESTAURANTE: o salva-vidas ficava sentado
     * entre as cadeiras de pátio, de costas para a água.
     *
     * Agora ele fica na borda do FUNDO (`z = -9,8`), olhando a piscina de
     * frente para a câmera. O `x = 4,6` é o vão entre as duas arquibancadas
     * (que ocupam `x -8..-2` e `4..10` em `z ≈ -13`): a cadeira tem 2,3 e a 34°
     * esconde 3,5 m atrás de si, e é nesse vão que essa faixa cai sem comer
     * nada. E longe do trampolim, que mora em `x = 0`.
     *
     * ELE SOBE NA CADEIRA de um jeito que não custou nada ao motor: o cérebro
     * do `Bicho` só mexe em `x` e `z`, então o `y` que a cena escreve uma vez
     * fica. A área minúscula é a coleira, como na Gina.
     */
    const GUARDA = { x: 4.6, z: -9.8 };
    w.add(w.place(cadeiraDeSalvaVidas(1.7), GUARDA.x, 0, GUARDA.z));
    w.blockCircle(GUARDA.x, GUARDA.z, 0.95);

    const capy = new Capy({
      minX: GUARDA.x - 0.12, maxX: GUARDA.x + 0.12,
      minZ: GUARDA.z - 0.12, maxZ: GUARDA.z + 0.12,
    });
    // o estrado está em 1,7 e a capivara tem o corpo em 0,27: sentado no
    // estrado, e não flutuando acima dele
    capy.group.position.y = 1.75;
    // ele olha para `+Z`: a piscina E a câmera estão do mesmo lado dele, que é
    // o único jeito de a cara dele aparecer sem ele virar as costas para a água
    capy.group.rotation.y = 0;
    w.add(capy.group);
    capy.aoSoar = () => g.som('apito');

    const falarComOGuarda = w.interact({
      id: 'clube:salva-vidas',
      // o ponto fica no PÉ da cadeira, do lado da piscina: é de onde se fala
      // com quem está lá em cima
      x: GUARDA.x + 1.4, z: GUARDA.z + 0.9, radius: 2.0,
      label: 'Falar com o Capy', icon: '🛟',
      highlight: capy.group,
      onInteract: async (api) => {
        capy.receberCarinho();
        api.som('apito');
        const S = 'Capy';
        if (!api.flag('capy-conhecido')) {
          api.setFlag('capy-conhecido');
          await api.say(['Oi! Tudo bem por aí embaixo?'], S);
          await api.say(['Capy, salva-vidas. Se afundar, grita.'], S);
          await conversa([
            [R, 'Ele é uma capivara.'],
            [A, 'Ele é uma capivara SALVA-VIDAS.'],
            [R, 'Faz sentido. Ninguém entende mais de água que ele.'],
          ]);
          await api.say([
            'Regra da casa: nada de correr na borda molhada, e nada de mergulhar na parte rasa.',
          ], S);
          await api.say(['Fora isso, fiquem o tempo que quiserem. Eu não saio daqui mesmo.'], S);
          await conversa([
            [A, 'Ele tirou o óculos pra falar com a gente.'],
            [R, 'Isso é praticamente um abraço.'],
          ]);
          api.unlock({
            id: 'salva-vidas-do-clube',
            title: 'O Capy da piscina',
            place: 'Clube',
            note: 'O salva-vidas: uma capivara de regata vermelha e apito, na cadeira alta, varrendo a piscina de um lado ao outro o dia inteiro.',
            icon: '🛟',
          });
          return;
        }
        await api.say([w.pick(FALAS_DO_CAPY)], S);
      },
    });

    w.onUpdate((dt) => {
      capy.update(dt);
      falarComOGuarda.moveTo(GUARDA.x + 1.4, GUARDA.z + 0.9);
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

    /**
     * A PORTA DE SERVIÇO, na parede DOS FUNDOS — que é onde o Renan quis, e é
     * o lugar certo para uma entrada escondida: essa parede não tem janela, não
     * tem toldo e não dá para lugar nenhum. Só se chega nela dando a volta.
     *
     * O PONTO CEGO AQUI NÃO É DEFEITO, É A GRAÇA. O prédio tem 5,5 de altura, e
     * a 34° de câmera ele engole quase 4 m da faixa de trás: do ângulo padrão a
     * porta não aparece. Chegou a existir aqui um prédio que ficava translúcido
     * quando a dupla passava atrás — o Renan cortou, e com razão: **a câmera
     * gira**, e a porta é para ser DESCOBERTA jogando. Quem der a volta pelo
     * fundo ou girar com Q/E acha; quem nunca girar, nunca acha. Não ponha nada
     * aqui que o jogo exija para andar para a frente.
     */
    const FUNDO_DO_RESTAURANTE = {
      x: RESTAURANTE.x + 2.4,
      z: RESTAURANTE.z - RESTAURANTE.profundidade / 2,
    };
    const portaDeServico = w.add(w.place(
      interiorDoor(P.restauranteEsquadria, 1.0, 2.15),
      FUNDO_DO_RESTAURANTE.x, 0, FUNDO_DO_RESTAURANTE.z - 0.06, Math.PI,
    ));
    // duas caixas e uma lixeira: é o que faz uma porta no fundo virar "entrada
    // de serviço" em vez de porta esquecida
    for (const [dx, larg, alt] of [[-1.9, 0.6, 0.5], [-1.55, 0.45, 0.36]] as const) {
      const caixa = new THREE.Mesh(
        new THREE.BoxGeometry(larg, alt, larg * 0.8), toon(P.restauranteDeck),
      );
      caixa.position.set(FUNDO_DO_RESTAURANTE.x + dx, alt / 2, FUNDO_DO_RESTAURANTE.z - 0.4);
      w.add(caixa);
    }
    w.blockBox(FUNDO_DO_RESTAURANTE.x - 1.7, FUNDO_DO_RESTAURANTE.z - 0.4, 0.55, 0.35);
    w.add(w.place(bin(), FUNDO_DO_RESTAURANTE.x + 2.2, 0, FUNDO_DO_RESTAURANTE.z - 0.5));
    w.blockCircle(FUNDO_DO_RESTAURANTE.x + 2.2, FUNDO_DO_RESTAURANTE.z - 0.5, 0.3);

    w.interact({
      id: 'clube:porta-de-servico',
      x: FUNDO_DO_RESTAURANTE.x, z: FUNDO_DO_RESTAURANTE.z - 1.1, radius: 1.9,
      label: 'Entrar pela porta dos fundos', icon: '🚪',
      highlight: portaDeServico,
      onInteract: async (api) => {
        if (!api.flag('achou-a-porta-do-mania')) {
          await conversa([
            [R, 'Peraí. Essa porta dá pra dentro do restaurante.'],
            [A, 'A gente pode entrar?'],
            [R, 'A Gina mandou a gente aproveitar o dia. Isso conta.'],
          ]);
          api.setFlag('achou-a-porta-do-mania');
          api.unlock({
            id: 'porta-dos-fundos',
            title: 'A porta dos fundos',
            place: 'Clube',
            note: 'Deram a volta no restaurante sem motivo nenhum e acharam uma porta que ninguém tinha aberto.',
            icon: '🚪',
          });
        }
        api.goTo('mania-de-churrasco', 'dos-fundos');
      },
    });

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

    // O PONTO DE ÔNIBUS, na calçada, do lado do ônibus. O abrigo abre para o
    // `+Z` da peça, e `-PI/2` leva essa boca para o `-X` do mundo — virada para
    // a rua, com o fundo de vidro de costas para o clube. O colisor pega só o
    // fundo e o banco: por baixo do teto se anda.
    //
    // ELE SUBIU 3,8 EM `z` QUANDO O PORTÃO CHEGOU. O abrigo estava bem na
    // frente do vão: o fundo dele barrava a caminhada da porta do ônibus até a
    // entrada do clube, e o teste do muro pegou a dupla parando em `-25,88`, que
    // é exatamente a face do colisor do abrigo. Em `z = 12,8` ele continua
    // encostado no ônibus (que vai de 4,5 a 13,5) e libera o caminho.
    const ABRIGO = PARADA.z + 3.8;
    w.add(w.place(busStop(), RUA.calcada, 0, ABRIGO, -Math.PI / 2));
    w.blockBox(RUA.calcada + 0.7, ABRIGO, 0.4, 2.4);
    w.blockCircle(RUA.calcada - 0.5, ABRIGO - 2.65, 0.25); // o totem da parada

    /**
     * PLACAS. É o que mais faz um lugar parecer clube de verdade: o texto sai
     * de um canvas em tempo de execução, que é a única "textura" que o projeto
     * permite.
     *
     * A PLACA "SUCOS" SAIU, e ela ficava em `(-15,5 / 10,2)` — bem no meio da
     * faixa em que o Noel passeia. O poste atravessava o peru, e o Renan viu na
     * primeira foto que tirou dele. Também não fazia falta: o próprio quiosque
     * já tem "Sucos" escrito no letreiro dele, então a placa de poste repetia a
     * mesma informação a dois metros de distância.
     */
    for (const [texto, cor, x, z] of [
      ['Piscina', P.fabricBlue, 3, 9.6],
    ] as const) {
      w.add(w.place(textSign(texto, cor), x, 0, z));
      w.blockCircle(x, z, 0.25);
    }

    /**
     * ======================= O JARDIM DA JOSEFINA, no gramado do fundo leste
     *
     * O gramado era uma mancha verde vazia com duas mesas de piquenique em
     * cima. Vira um jardim ORGANIZADO, que é o que o Renan pediu — e organizado
     * aqui quer dizer três coisas concretas: canteiros retangulares alinhados
     * em duas colunas, um caminho de pedrinha entre elas, e UM tipo de planta
     * por canteiro.
     *
     * ONDE ELE COUBE. O gramado vai de `x 17` a `29`; as mesas de piquenique
     * ocupam até `x 22,4` e a jardineira com palmeira até `20,4`. Sobra a faixa
     * de `22,6` a `29`, e é exatamente nela que o jardim entra — sem mexer em
     * nada do que já estava lá.
     */
    const JARDIM = { xEsq: 23.7, xDir: 27.5, caminho: 25.6 };

    // o caminho de pedrinha entre as duas colunas de canteiros. Decalque, então
    // entra por cima da grama sem brigar por profundidade.
    w.patch(JARDIM.caminho, -13.8, 1.3, 15, P.concrete, 0, 0.022, calcadaDePedrinha(0.4, 5));

    /**
     * OS CANTEIROS, quatro fileiras em duas colunas. Cada um com uma espécie
     * só: misturar tudo em todo lugar desfaz a leitura de "alguém plantou isto
     * aqui" — passa a parecer mato bonito.
     */
    for (const [z, esquerda, direita] of [
      [-19, 'alface', 'tomate'],
      [-15.5, 'lavanda', 'suculenta'],
      [-12, 'girassol', 'samambaia'],
      [-8.5, 'tomate', 'alface'],
    ] as const) {
      for (const [x, tipo] of [[JARDIM.xEsq, esquerda], [JARDIM.xDir, direita]] as const) {
        w.add(w.place(canteiroDeHorta(tipo, 2.2, 1.3, (x + z) / 11 % 1), x, 0, z));
        w.blockBox(x, z, 1.1, 0.65);
      }
    }

    /**
     * AS PLANTAS DIRETO NA TERRA, no fundo do jardim — o Renan pediu que
     * algumas fossem plantadas no chão, e não em canteiro. Uma fileira de
     * lavanda alinhada em `z = -21,2`, sem mureta e sem colisor: são 30 cm de
     * altura, e cercar isso faria o jardim virar um labirinto.
     */
    for (let i = 0; i < 5; i++) {
      const x = 22.8 + i * 1.4;
      w.add(w.place(planta('lavanda', 1.15, (i * 0.27) % 1), x, 0, -21.2));
    }
    // e uma fileira de suculentas na frente, que é a borda baixa do jardim
    for (let i = 0; i < 6; i++) {
      const x = 22.9 + i * 1.15;
      w.add(w.place(planta('suculenta', 1.1, (i * 0.41) % 1), x, 0, -6.6));
    }

    /**
     * OS VASOS ladeando a boca do caminho. Eles existem porque um jardim só de
     * canteiros no chão fica TODO na mesma altura, e a câmera isométrica achata
     * isso — os vasos levantam parte das plantas e dão relevo à área.
     */
    for (const [x, z, tipo, alto] of [
      [JARDIM.caminho - 1.15, -6.4, 'samambaia', 0.34],
      [JARDIM.caminho + 1.15, -6.4, 'girassol', 0.3],
      [JARDIM.caminho - 1.15, -21.2, 'alface', 0.3],
      [JARDIM.caminho + 1.15, -21.2, 'tomate', 0.34],
    ] as const) {
      w.add(w.place(vasoDePlanta(tipo, alto, (x * z) / 13 % 1), x, 0, z));
      w.blockCircle(x, z, 0.24);
    }

    // o regador largado no meio do caminho: é o que diz que alguém TRABALHA
    // aqui, e não que o jardim se cuida sozinho
    w.add(w.place(regador(), JARDIM.caminho + 0.4, 0, -17.6, 0.6));

    /**
     * ============================================ O OSSO ENTERRADO NO JARDIM
     *
     * ONDE ELE ESTÁ, e por quê exatamente aqui. O montinho fica em
     * `(27,5; -17,25)`: na coluna DIREITA de canteiros, no vão entre o de
     * `z = -19` e o de `z = -15,5` — 1,1 de folga para cada um, então ninguém
     * esbarra nele sem querer. E, sobretudo, ele fica FORA do caminho de
     * pedrinha (que vai até `x = 26,15`): quem acha o osso achou porque saiu do
     * caminho e foi olhar o fundo do jardim. Era o pedido do Renan — uma coisa
     * que se descobre jogando, e não uma que o jogo aponta.
     *
     * O RAIO É PEQUENO (1,0 contra os 1,6 da Josefina) pelo mesmo motivo: o
     * prompt não pode acender de longe e entregar o segredo. Tem que chegar em
     * cima.
     *
     * A Josefina nunca pisa aqui — ela passeia no corredor entre as colunas —,
     * então o montinho não precisa de colisor: ele tem 12 cm, e cercar isso
     * transformaria o jardim num labirinto (a mesma conta das lavandas).
     */
    const CAVA = { x: JARDIM.xDir, z: -17.25 };
    const montinho = w.add(w.place(terraRemexida(0.37), CAVA.x, 0, CAVA.z));
    const monte = montinho.userData.monte as THREE.Object3D;
    const cova = montinho.userData.buraco as THREE.Object3D;

    /**
     * QUEM JÁ CAVOU CHEGA E ENCONTRA O BURACO. A cena é remontada do zero a
     * cada visita, então sem esta linha o montinho voltaria inteiro toda vez
     * que a dupla saísse e entrasse no clube — e o osso viraria uma fonte
     * infinita. A `flag` é o que atravessa a reconstrução.
     */
    const jaCavou = g.flag('osso-cavado');
    monte.visible = !jaCavou;
    cova.visible = jaCavou;

    const cavar = w.interact({
      id: 'clube:cavar',
      x: CAVA.x, z: CAVA.z, radius: 1.0,
      // o rótulo não entrega o que tem embaixo: entrega que ALGUÉM cavou aqui
      label: 'Cavar a terra remexida', icon: '🐾',
      highlight: montinho,
      onInteract: async (api) => {
        await conversa([
          [A, 'A terra aqui tá remexida. E tem risco de unha.'],
          [R, 'Isso não foi a Josefina. Isso foi bicho.'],
        ]);
        api.som('cavar');
        await api.wait(0.5);

        /**
         * A MOCHILA CHEIA NÃO PODE PERDER O OSSO. Ele é a chave do turno do
         * Mania: se `addItem` recusasse e o montinho já tivesse virado buraco,
         * o jogo trancaria a porta com a chave do lado de fora. Por isso o
         * buraco só aparece DEPOIS de o osso entrar de verdade na mochila — e
         * por isso a interação não é `once`: quem chegou de mochila cheia
         * arruma a mochila e volta a cavar.
         */
        if (api.addItem(ITENS.osso) === 'cheio') {
          await conversa([
            [A, 'Tem alguma coisa aí embaixo, mas eu não tenho onde pôr.'],
            [R, 'Guarda alguma coisa e volta aqui.'],
          ]);
          return;
        }

        // o monte vira buraco: os dois estados já nasceram montados na peça
        monte.visible = false;
        cova.visible = true;
        cavar.enabled = false;
        api.setFlag('osso-cavado');

        await conversa([
          [R, 'Um osso. Um osso inteiro, enterrado no jardim do clube.'],
          [A, 'Quem enterra osso? Cachorro enterra osso.'],
          [R, 'A gente conhece um cachorro.'],
          [A, 'A gente conhece o cachorro.'],
        ]);
        api.toast('Osso', '🦴');
      },
    });
    cavar.enabled = !jaCavou;

    /**
     * A JOSEFINA, a jardineira. Ela passeia PELO CAMINHO, e não pelo gramado
     * inteiro: a faixa é o corredor entre as duas colunas de canteiros, então
     * ela nunca pisa numa horta — sem precisar de uma lista de obstáculos, que
     * é o mesmo truque da coleira dos outros bichos, usado ao contrário.
     *
     * Ela é a MAIS LENTA do jogo (0,3 contra 0,85 do Noel) e descansa de 3 a
     * 7 s. É a personalidade que o Renan pediu, e ela mora inteira nesses dois
     * números.
     */
    const josefina = new Josefina({
      minX: JARDIM.caminho - 0.55, maxX: JARDIM.caminho + 0.55,
      minZ: -20, maxZ: -7.4,
    });
    w.add(josefina.group);
    josefina.aoSoar = () => g.som('cantarolar');

    const falarComAJosefina = w.interact({
      id: 'clube:josefina',
      x: josefina.x, z: josefina.z, radius: 1.6,
      label: 'Falar com a Josefina', icon: '🐢',
      highlight: josefina.group,
      onInteract: async (api) => {
        josefina.receberCarinho();
        api.som('cantarolar');
        const J = 'Josefina';
        if (!api.flag('josefina-conhecida')) {
          api.setFlag('josefina-conhecida');
          await api.say(['Ah, oi. Podem chegar, só não pisem na lavanda.'], J);
          await conversa([
            [A, 'Ela tem um vasinho nas costas.'],
            [R, 'Ela tem um laço rosa e um vasinho nas costas.'],
          ]);
          await api.say(['Josefina. Eu cuido daqui.'], J);
          await api.say([
            'Esse jardim tem sete anos. Começou com um pé de lavanda num copo de requeijão.',
          ], J);
          await conversa([
            [A, 'Sete anos?'],
          ]);
          await api.say([
            'Eu sou devagar, meu bem. Mas eu chego. Planta também é assim: ninguém consegue apressar.',
          ], J);
          await conversa([
            [R, 'Acho que ela acabou de dar um conselho pra gente.'],
            [A, 'Acho que sim.'],
          ]);
          api.unlock({
            id: 'josefina-do-jardim',
            title: 'A Josefina do jardim',
            place: 'Clube',
            note: 'Uma tartaruga de laço rosa e vasinho nas costas, que cuida do jardim do clube e conta história enquanto rega.',
            icon: '🐢',
          });
          return;
        }
        /**
         * A DICA DO OSSO É A PRIMEIRA HISTÓRIA DA SEGUNDA VISITA, e não uma
         * das sorteadas. Sorteada, ela poderia não sair nunca — e uma pista que
         * o jogo pode esconder para sempre não é pista, é loteria. Ela sai uma
         * vez, na primeira volta ao jardim, e some assim que o osso é
         * desenterrado (quem já achou não precisa de dica).
         */
        if (!api.flag('osso-cavado') && !api.flag('josefina-dica-osso')) {
          api.setFlag('josefina-dica-osso');
          await api.say([
            'Ah, antes que eu esqueça. Anda aparecendo terra remexida lá no fundo, na fileira da direita.',
          ], J);
          await conversa([
            [A, 'Alguém andou mexendo no seu jardim?'],
          ]);
          await api.say([
            'Sete anos cuidando daqui e eu nunca descobri o quê. Se vocês olharem, me contem.',
          ], J);
          return;
        }

        // toda visita seguinte rende uma historinha dela — é o que ela mais
        // gosta de fazer, e o que faz valer a pena voltar no jardim
        await api.say([w.pick(HISTORIAS_DA_JOSEFINA)], J);
      },
    });

    w.onUpdate((dt) => {
      josefina.update(dt);
      falarComAJosefina.moveTo(josefina.x, josefina.z);
    });

    // REFLETORES nos dois cantos do fundo — clube que fecha tarde tem. Eles
    // seguem a beirada do piso: com o deck maior, o `z = -19` de antes ficou no
    // meio da área jogável, e refletor no meio do pátio não ilumina, atrapalha.
    const fundoDoDeck = DECK.z - DECK.profundidade / 2 + 1.4;
    for (const x of [-20, 12, 29]) {
      w.add(w.place(floodlight(), x, 0, fundoDoDeck));
      w.blockCircle(x, fundoDoDeck, 0.35);
    }

    // ------------------------------------------------------------ jardim
    // A vegetação seguiu o deck para fora: com o piso em 48×38, as palmeiras
    // que estavam em `±18` nasceriam no meio do concreto. Elas voltam a ser a
    // moldura verde da cena, agora na beirada do piso novo.
    w.setSeed(90210);
    const bordaX = DECK.x + DECK.largura / 2 + 1.5;
    const bordaZ = DECK.profundidade / 2 + 1.5;
    for (const [x, z] of [
      // as duas da esquerda atravessaram a rua: em `-25,5` elas nasciam dentro
      // da calçada, e do outro lado do asfalto viram o fundo verde da parada
      [-41, -8], [-41, 4],
      [bordaX, 4], [bordaX, -8], [bordaX, -20],
      [-9, -bordaZ + DECK.z], [11, -bordaZ + DECK.z], [26, -bordaZ + DECK.z],
      [-4, bordaZ + DECK.z], [18, bordaZ + DECK.z],
    ] as const) {
      w.add(w.place(tree('palmeira', w.range(0.95, 1.2), w.rng()), x, 0, z));
      w.blockCircle(x, z, 0.5);
    }
    for (let i = 0; i < 32; i++) {
      const x = w.range(-42, 44);
      const z = w.range(-40, 34);
      // nada de arbusto brotando no deck
      if (Math.abs(x - DECK.x) < DECK.largura / 2 + 1 &&
        Math.abs(z - DECK.z) < DECK.profundidade / 2 + 1) continue;
      // nem na rua: ela atravessa o cenário inteiro, do outro lado do asfalto
      // até a faixa de grama que separa a calçada do piso do clube
      if (x > -38 && x < -23.5) continue;
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
    const onibus = w.add(w.place(bus(P.onibusAzul, 'Parque'), PARADA.x, 0, PARADA.z, Math.PI / 2));
    w.blockBox(PARADA.x, PARADA.z, 1.4, 4.5);

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

    /**
     * O NOEL, o peru do bar de sucos — o terceiro funcionário do clube.
     *
     * ELE É O PRIMEIRO QUE NÃO FICA PARADO. A Gina e o Capy têm posto, e o que
     * os segura é uma área menor que o passo mínimo do cérebro. O Noel ganha
     * uma FAIXA de 1,6 × 1 na frente do quiosque, que é maior que esse mínimo:
     * ele anda de um lado para o outro sem sair da frente do bar. É a
     * personalidade que o Renan pediu — um entusiasta não fica quieto.
     *
     * ONDE A FAIXA FICA, e ela mudou de lugar depois da primeira foto. Ela
     * começou ao LADO do quiosque (`z ≈ 8,4`), e de longe o quiosque comia o
     * Noel: ele tem `z` maior que o balcão mas `x` bem menor, e nessa diagonal
     * a peça de 2,4 de altura passa na frente dele. Agora a faixa está na
     * FRENTE do quiosque (`z ≈ 9,9`), no concreto aberto, onde nada o tapa.
     *
     * E A FAIXA É COMPRIDA (2,4), porque curta ele não anda. O `novoDestino` do
     * cérebro só aceita um destino a mais de 0,7 de onde o bicho está: numa
     * faixa de 1,4 quase todo sorteio caía perto demais, as doze tentativas
     * falhavam e o peru mais elétrico do clube passava o dia parado. Medido:
     * 0,9 de caminhada em 17 s, contra 3,5 com a faixa deste tamanho.
     *
     * ELA CRESCEU PARA LONGE DO BALCÃO, e não para perto. O ponto de pedir
     * suco fica em `(-12,2 / 9,2)`; a ponta mais próxima da faixa está a 2,6
     * dele, mais que o raio de 1,4 do Noel. Assim ele nunca chega perto o
     * bastante para cobrir aquela interação — um ponto que anda pode encobrir
     * um ponto parado sem quebrar nada, e aí o balcão simplesmente para de
     * responder sem ninguém entender por quê.
     */
    const noel = new Noel({
      minX: -17.2, maxX: -14.8,
      minZ: 9.4, maxZ: 10.4,
    });
    w.add(noel.group);
    noel.aoSoar = () => g.som('gluglu');

    const falarComONoel = w.interact({
      id: 'clube:noel',
      x: noel.x, z: noel.z, radius: 1.4,
      label: 'Falar com o Noel', icon: '🦃',
      highlight: noel.group,
      onInteract: async (api) => {
        noel.receberCarinho();
        api.som('gluglu');
        const N = 'Noel';
        if (!api.flag('noel-conhecido')) {
          api.setFlag('noel-conhecido');
          await api.say(['BOM DIA! Vocês vieram pro suco, né? Claro que vieram.'], N);
          await api.say(['Noel, prazer. Eu cuido dos sucos daqui. Eu AMO os sucos daqui.'], N);
          await conversa([
            [R, 'Ele é um peru.'],
            [A, 'Ele é um peru muito feliz.'],
          ]);
          await api.say([
            'Olha, laranja é clássico, ninguém discute. Mas o de maracujá com hortelã… gente. GENTE.',
          ], N);
          await api.say(['E o de morango a gente bate na hora. Na HORA. Não é polpa.'], N);
          await conversa([
            [R, 'Ele fala de suco desse jeito o dia inteiro?'],
          ]);
          await api.say(['O dia inteiro! Por quê, tem coisa melhor?'], N);
          await conversa([
            [A, 'Não tem, não.'],
          ]);
          api.unlock({
            id: 'noel-do-bar',
            title: 'O Noel do bar de sucos',
            place: 'Clube',
            note: 'Um peru de avental e viseira que abre o leque de tanta felicidade quando fala do suco de maracujá.',
            icon: '🦃',
          });
          return;
        }
        await api.say([w.pick(FALAS_DO_NOEL)], N);
      },
    });

    // ele passeia, então o balão passeia junto
    w.onUpdate((dt) => {
      noel.update(dt);
      falarComONoel.moveTo(noel.x, noel.z);
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
