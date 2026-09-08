import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { SceneDef } from '../core/types';
import {
  araraDeRoupas, balcaoDaLoja, caixaRegistradora, espelho, luminariaPendente, manequimDeLoja,
  mesaDeDobrar, pottedPlant, prateleiraDaLoja, provadores, pufeDeLoja, rug,
} from '../world/furniture';
import { assoalhoDeMadeira } from '../world/texturasDeChao';
import { toon } from '../core/materials';
import { ARI, RENAN } from '../characters/cast';
import { Estella } from '../entities/bichos/Estella';

/**
 * ============================== A LOJINHA DE ROUPAS POR DENTRO
 *
 * O salão da loja da Estella. Por enquanto é um lugar para ANDAR — comprar roupa
 * vem depois —, e por isso o cenário é o conteúdo: se não houver o que olhar,
 * não há o que fazer aqui.
 *
 * A PLANTA (a câmera vê `-Z` subindo à direita e `-X` subindo à esquerda):
 *
 *     parede do fundo (-Z) ....... os três provadores e a prateleira alta
 *     parede da esquerda (-X) .... espelho de corpo inteiro e prateleira
 *     meio do salão .............. quatro araras e a mesa de dobrar
 *     perto da entrada (+X/+Z) ... o balcão do caixa e os dois manequins
 *     frente (+Z) ................ a mureta com a porta de volta pra calçada
 *
 * O CAIXA FICA PERTO DA PORTA e OLHANDO PARA `+Z`, que é de onde a câmera vem:
 * balcão virado para dentro mostraria o fundo liso, e quem atende sumiria atrás
 * dele. É a mesma regra do quiosque do Mano.
 *
 * AS PAREDES ALTAS SÃO SÓ AS DE `-X` E `-Z`. Nos dois lados que dão para a
 * câmera vai mureta de 0,45: parede inteira ali tapa a loja inteira. É a regra
 * de interior do projeto, e ela é o motivo de a loja ser vista "de cima do
 * ombro" em vez de por dentro de uma caixa fechada.
 *
 * A ESTELLA ENTRA JUNTO. Ela nasce na porta e sai passeando pelas paradas que a
 * cena marcou — nunca por sorteio livre, para não haver a chance de ela escolher
 * um ponto dentro de uma arara.
 */

/** o salão: 13 × 10, que é o miolo do prédio de fora (11,6 × 9,5) mais folga */
const W = 13;
const D = 10;
const x0 = -W / 2;
const z0 = -D / 2;
const H = 3.1;

/** o vão da porta, na mureta da frente */
const PORTA = { x: 4.1, vao: 1.5 };

/**
 * A RONDA DA ESTELLA — e ela e uma FILA, nao um saco de pontos.
 *
 * O pedido era "ela escolhe um ponto e anda ate la". O problema e o COMO ela
 * anda: `irPara()` vai em LINHA RETA e ignora movel (de proposito — quem conhece
 * a planta e a cena). Com seis pontos soltos, metade das retas entre eles
 * atravessava uma arara pelo meio, e ela ia passar por dentro da mercadoria.
 *
 * Entao os pontos estao em ORDEM, e ela so anda para o VIZINHO na fila — para a
 * frente ate o fim, depois para tras, como quem faz a ronda da loja. Assim os
 * unicos trajetos possiveis sao os sete trechos desta lista, todos correndo por
 * corredor livre, e o `scripts/lojinha.mjs` mede um por um contra os colisores
 * da cena (o ponto E o caminho).
 *
 * A variacao vem do TEMPO, e nao do destino: a pausa em cada parada e sorteada
 * entre 3,5 e 7,5 s, e de vez em quando ela fica parada mais um turno. Ronda de
 * lojista e repetitiva mesmo — o que nao pode e ser cronometrada.
 */
const RONDA: ReadonlyArray<{ x: number; z: number; onde: string }> = [
  { x: 4.0, z: -2.1, onde: 'atras do balcao do caixa' },
  { x: 0.6, z: -3.2, onde: 'na boca dos provadores' },
  { x: -2.4, z: -3.2, onde: 'no fim do corredor do meio' },
  { x: -5.4, z: -3.0, onde: 'na prateleira alta do fundo' },
  { x: -5.4, z: 1.6, onde: 'no espelho de corpo inteiro' },
  { x: -2.4, z: 1.9, onde: 'na entrada do corredor do meio' },
  { x: -0.4, z: 3.4, onde: 'na mesa de dobrar' },
  { x: 2.6, z: 3.6, onde: 'na porta, recebendo quem chega' },
];

/**
 * O QUE ELA SOLTA ENQUANTO PASSEIA.
 *
 * As três primeiras são do Renan e vão literais. Elas saem em TOAST (o aviso do
 * canto), e não em caixa de diálogo: passar por uma loja e ser parado por um
 * balão a cada doze segundos é o que transforma "explorar" em "clicar E". É a
 * mesma decisão que os gritos do Mano já pagaram — quem quiser conversa de
 * verdade fala com ela, e aí sim é diálogo.
 */
const FALAS_DE_LOJA = [
  'Bééé... essa coleção de outono está um arraso!',
  'Não repare a bagunça, chegaram peças novas hoje!',
  'Acho que aquele tom de azul destacaria muito a sua... lã. Digo, sua pele!',
  'Prova, prova! Provar não custa nada.',
  'Essa arara do meio é a minha favorita. Eu costurei tudo.',
  'Se apertar no ombro eu ajusto na hora, viu.',
  'O provador do fundo é o melhor, tem o espelho maior.',
  'Cuidado com o alfinete no chão. Sempre cai um.',
];

export const lojinha: SceneDef = {
  id: 'lojinha',
  name: 'Lojinha da Estella',
  subtitle: 'cheirinho de roupa nova',
  ambient: {
    sky: 0xf6e9e6,
    indoor: true,
    sunColor: 0xfff4e6,
    sunIntensity: 0.9,
    ambientColor: 0xfdf1ea,
    // loja de roupa é iluminada demais de propósito: é assim que se enxerga cor
    // de tecido, e é o que separa a sala de dentro do parque lá fora
    ambientIntensity: 1.6,
    sunDir: [9, 16, 11],
  },
  spawn: { x: PORTA.x, z: D / 2 - 1.5, facing: Math.PI },
  entries: {
    'da-calcada': { x: PORTA.x, z: D / 2 - 1.5, facing: Math.PI },
  },

  build(w) {
    const g = w.game;
    const A = ARI.name;
    const R = RENAN.name;
    const E = 'Estella';
    const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
      for (const [quem, texto] of falas) await g.say([texto], quem);
    };

    // ------------------------------------------------------------- a casca
    w.ground({ width: W, depth: D, color: P.lojaChaoTabua, textura: assoalhoDeMadeira(2.6, 7) });
    w.setBounds(x0 + 0.5, z0 + 0.5, W / 2 - 0.5, D / 2 - 0.5);

    w.wall(x0, z0, W / 2, z0, H, P.lojaParedeDentro);
    w.wall(x0, z0, x0, D / 2, H, P.lojaParedeDentro);
    w.wall(W / 2, z0, W / 2, D / 2, 0.45, P.lojaParedeDentro);
    // a mureta da frente, com o vão da porta
    w.wall(x0, D / 2, PORTA.x - PORTA.vao / 2, D / 2, 0.45, P.lojaParedeDentro);
    w.wall(PORTA.x + PORTA.vao / 2, D / 2, W / 2, D / 2, 0.45, P.lojaParedeDentro);

    /*
     * O FRISO E O RODAPÉ. Uma parede lisa de 13 metros é uma parede de galpão;
     * o que faz ela virar loja é a linha horizontal na altura do peito (o friso
     * de boiserie) mais o rodapé escuro embaixo. Duas caixas finas, e a sala
     * inteira muda de categoria.
     */
    for (const [x, z, larg, rot] of [
      [0, z0 + 0.09, W, 0],
      [x0 + 0.09, 0, D, Math.PI / 2],
    ] as const) {
      const rodape = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.16, 0.06), toon(P.lojaRodape));
      rodape.position.set(x, 0.08, z);
      rodape.rotation.y = rot;
      w.add(rodape);

      const friso = new THREE.Mesh(new THREE.BoxGeometry(larg, 0.07, 0.05), toon(P.lojaFriso));
      friso.position.set(x, 1.12, z);
      friso.rotation.y = rot;
      w.add(friso);
      // e a faixa de papel de parede acima do friso, um degrau mais quente
      const faixa = new THREE.Mesh(new THREE.BoxGeometry(larg, H - 1.16, 0.03), toon(P.lojaFriso));
      faixa.position.set(x, 1.16 + (H - 1.16) / 2, z);
      faixa.rotation.y = rot;
      w.add(faixa);
    }

    // ------------------------------------------------- os provadores (fundo)
    const PROVADORES = { x: -0.6, z: z0 + 1.16 };
    w.add(w.place(provadores(3), PROVADORES.x, 0, PROVADORES.z));
    // o colisor cobre as três cabines: 3 × 1,15 de largura por 1,05 de fundo
    w.blockBox(PROVADORES.x, PROVADORES.z - 0.52, 1.78, 0.58);

    // a prateleira alta do fundo, no trecho de parede que sobra em -X
    w.add(w.place(prateleiraDaLoja(2.2, 11), -4.4, 0, z0 + 0.18));
    w.blockBox(-4.4, z0 + 0.3, 1.15, 0.22);

    // ---------------------------------------------- a parede da esquerda (-X)
    w.add(w.place(espelho(P.lojaBalcao, 1.9), x0 + 0.14, 0, 1.6, Math.PI / 2));
    w.add(w.place(prateleiraDaLoja(2.0, 23), x0 + 0.16, 0, -1.4, Math.PI / 2));
    w.blockBox(x0 + 0.3, -1.4, 0.22, 1.05);

    // ------------------------------------------------------------- as araras
    /*
     * QUATRO ARARAS EM DUAS COLUNAS, e o que decide as coordenadas sao os
     * CORREDORES, nao as araras.
     *
     * Cada arara tem 1,9 de comprimento (colisor de 0,95 de meia-largura) e
     * 0,35 de meia-profundidade. Com as colunas em `x = −3,9` e `x = −0,9`
     * sobra 1,1 de corredor entre elas, e o jogador e um circulo de 0,42: passa
     * com 0,13 de folga de cada lado. Menos que isso e a dupla anda de lado, e
     * o parceiro fica preso atras.
     *
     * O mesmo vale no `z`: as filas em −2,1 e 0,6 deixam 2,0 de corredor no
     * meio do salao, que e por onde a Estella faz a ronda inteira.
     *
     * Cada uma leva uma COLECAO e uma semente diferentes: e assim que quatro
     * pecas da mesma funcao viram quatro objetos distintos na tela.
     */
    const ARARAS = [
      { x: -3.9, z: -2.1, colecao: 0, semente: 101 },
      { x: -3.9, z: 0.6, colecao: 2, semente: 202 },
      { x: -0.9, z: -2.1, colecao: 1, semente: 303, tipos: ['vestido', 'vestido', 'camisa'] as const },
      { x: -0.9, z: 0.6, colecao: 3, semente: 404 },
    ];
    for (const a of ARARAS) {
      w.add(w.place(
        araraDeRoupas({ largura: 1.9, colecao: a.colecao, semente: a.semente, tipos: a.tipos }),
        a.x, 0, a.z,
      ));
      w.blockBox(a.x, a.z, 0.95, 0.35);
    }

    // a mesa de dobrar, entre as araras e a entrada
    w.add(w.place(mesaDeDobrar(1.7, 77), 1.2, 0, 2.1, 0.25));
    w.blockBox(1.2, 2.1, 0.9, 0.5, 0.25);

    // ---------------------------------------------------- o caixa e a entrada
    const CAIXA = { x: 4.0, z: -1.2 };
    w.add(w.place(balcaoDaLoja(2.4), CAIXA.x, 0, CAIXA.z));
    w.blockBox(CAIXA.x, CAIXA.z, 1.25, 0.4);
    // a registradora em cima do tampo — a mesma do Mania de Churrasco, virada
    // para quem atende (ela fica de costas para o cliente, como toda caixa)
    w.add(w.place(caixaRegistradora(), CAIXA.x - 0.75, 1.02, CAIXA.z, Math.PI));
    // e o novelo com a tesoura, do lado dela: a Estella costura no balcao
    for (const [dx, cor] of [[-0.1, P.tecidoCoral], [0.12, P.tecidoCeu]] as const) {
      const novelo = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), toon(cor));
      novelo.position.set(CAIXA.x + dx, 1.09, CAIXA.z - 0.12);
      w.add(novelo);
    }

    // os dois manequins, o primeiro de tudo que se vê ao entrar
    w.add(w.place(manequimDeLoja(P.tecidoRosa, 'vestido'), 5.1, 0, 1.9, -0.5));
    w.blockCircle(5.1, 1.9, 0.42);
    w.add(w.place(manequimDeLoja(P.tecidoPetroleo, 'casaco'), 5.2, 0, 3.4, -1.1));
    w.blockCircle(5.2, 3.4, 0.42);

    // o pufe de provar sapato, no vazio entre a porta e o caixa
    w.add(w.place(pufeDeLoja(), 4.5, 0, 2.4));
    w.blockCircle(4.5, 2.4, 0.42);

    // ------------------------------------------------------------- enfeites
    w.add(w.place(rug(3.6, 2.4, P.lojaChaoTapete), -1.6, 0, 3.4));
    for (const [x, z] of [[x0 + 0.9, D / 2 - 1.0], [W / 2 - 0.9, z0 + 0.9]] as const) {
      w.add(w.place(pottedPlant(1.25), x, 0, z));
      w.blockCircle(x, z, 0.32);
    }
    // as três pendentes do salão
    for (const x of [-3.4, 0, 3.4]) {
      w.add(w.place(luminariaPendente(P.lojaCortinaProvador, 2.5), x, 0, -0.3));
    }

    // ------------------------------------------------------- a porta de volta
    w.door({
      x: PORTA.x, z: D / 2 - 0.85,
      to: 'villa-lobos', entry: 'da-lojinha',
      label: 'Voltar pra calçada', icon: '🚪',
    });

    /* =====================================================================
     *                        A ESTELLA DENTRO DA LOJA
     *
     * Ela nasce NA PORTA e entra andando — a dupla entra e ela vem atrás, que é
     * o pedido do Renan. `entrarEmServico()` tira o passeio sorteado do cérebro
     * dela; daí em diante quem manda é a lista de paradas.
     * ===================================================================== */
    const estella = new Estella({
      minX: PORTA.x - 0.1, maxX: PORTA.x + 0.1,
      minZ: D / 2 - 1.0, maxZ: D / 2 - 0.8,
    });
    estella.group.rotation.y = Math.PI;
    estella.entrarEmServico();
    w.add(estella.group);
    estella.aoSoar = () => g.som('balido');

    /**
     * O PASSEIO: uma máquina de estados de três linhas.
     *
     * `andando` diz se ela está a caminho; `espera` é quanto falta para escolher
     * a próxima parada. `irPara()` devolve uma promessa que resolve QUANDO ELA
     * CHEGA — é isso que dispensa qualquer conta de distância aqui.
     *
     * A parada seguinte nunca é a atual (`(atual + 1 + sorte) % n`): sorteando
     * livre, ela repetia o mesmo ponto duas ou três vezes seguidas e parecia
     * travada.
     */
    let atual = 0;
    let passo = 1;
    let andando = false;
    let espera = 1.2;
    let ateFalar = 6;

    w.onUpdate((dt) => {
      estella.update(dt);
      pontoDaConversa.moveTo(estella.x, estella.z);

      // a fala solta, a cada 10-15 s, em toast
      ateFalar -= dt;
      if (ateFalar <= 0) {
        ateFalar = 10 + w.rng() * 5;
        if (!conversando) g.toast(`Estella: ${w.pick(FALAS_DE_LOJA)}`, '🐑');
      }

      if (andando || conversando) return;
      espera -= dt;
      if (espera > 0) return;

      /*
       * O VIZINHO NA FILA, e nao um ponto sorteado: e o que garante que o
       * trajeto seja um dos sete trechos medidos. No fim da fila ela da meia
       * volta.
       */
      if (atual + passo >= RONDA.length || atual + passo < 0) passo = -passo;
      atual += passo;
      const parada = RONDA[atual];
      andando = true;
      void estella.irPara(parada.x, parada.z, 0.5).then(() => {
        andando = false;
        // parada longa: ela é uma lojista, não uma ronda de segurança
        espera = 3.5 + w.rng() * 4;
      });
    });

    /*
     * FALAR COM ELA PARA A RONDA. Sem isto ela responde a conversa de costas,
     * andando para o outro lado do salão — e o `finally` devolve o passeio
     * aconteça o que acontecer.
     */
    let conversando = false;
    const DENTRO_DA_LOJA = [
      'Essa arara chegou hoje. Hoje mesmo, ainda tá quentinha.',
      'Prova o que quiser. Provar é de graça.',
      'Eu costuro tudo aqui atrás. Tudo.',
      'Se quiser, eu meço vocês dois direitinho.',
      'Um dia desses eu faço um par de roupa igual pros dois. Combinando.',
    ];
    const pontoDaConversa = w.interact({
      id: 'lojinha:estella',
      x: estella.x, z: estella.z, radius: 1.4,
      label: 'Falar com a Estella', icon: '🐑',
      highlight: estella.group,
      onInteract: async (api) => {
        conversando = true;
        const eu = api.playerPosition();
        estella.encarar(eu.x, eu.z);
        estella.receberCarinho();
        api.som('balido');
        try {
          if (!api.flag('lojinha-visitada')) {
            api.setFlag('lojinha-visitada');
            await conversa([
              [E, 'Entraram! Entraram mesmo!'],
              [A, 'A loja é linda, Estella.'],
              [E, 'É minha. Cada arara, cada bainha, cada botão.'],
              [E, 'Ainda não tô vendendo, tá? Falta acertar o preço de umas peças.'],
              [E, 'Mas olha à vontade. Olhar é de graça, e provar também.'],
            ]);
            api.unlock({
              id: 'lojinha-por-dentro',
              title: 'A lojinha por dentro',
              place: 'Lojinha da Estella',
              note: 'A loja de roupas do parque por dentro: quatro araras no meio do salão, três provadores de cortina no fundo, o balcão do caixa na entrada e a Estella circulando entre tudo, falando sozinha sobre a coleção de outono.',
              icon: '👗',
            });
          } else {
            await api.say([w.pick(DENTRO_DA_LOJA)], E);
          }
        } finally {
          conversando = false;
        }
      },
    });

    // ------------------------------------------------------- as vitrines por dentro
    /*
     * O QUE SE VÊ DA JANELA. A parede de `+X` é a fachada por fora, e ela é
     * mureta aqui dentro — então o parque aparece por cima dela sozinho. O que
     * falta é o PEITORIL, que é o que diz que ali tem vitrine e não um buraco.
     */
    for (const z of [0.6, 3.0]) {
      const peitoril = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 1.9), toon(P.lojaEsquadria));
      peitoril.position.set(W / 2 - 0.08, 0.5, z);
      w.add(peitoril);
    }

    // ------------------------------------------------------------ o provador
    w.interact({
      id: 'lojinha:provador',
      x: PROVADORES.x, z: PROVADORES.z + 0.9, radius: 1.5,
      label: 'Espiar o provador', icon: '🪞',
      onInteract: async () => {
        await conversa([
          [R, 'A cabine do canto tá aberta.'],
          [A, 'Tem um banquinho, um espelho e um gancho. É maior do que parece.'],
          [R, 'Quando ela abrir a loja a gente prova tudo.'],
          [A, 'TUDO.'],
        ]);
      },
    });

    // ---------------------------------------------------------------- o caixa
    w.interact({
      id: 'lojinha:caixa',
      x: CAIXA.x, z: CAIXA.z + 1.1, radius: 1.4,
      label: 'Olhar o balcão', icon: '🧾',
      onInteract: async () => {
        await conversa([
          [A, 'Tem uma vitrininha de bijuteria aqui no canto do balcão.'],
          [R, 'E as sacolinhas da loja embaixo, todas dobradas.'],
          [A, 'Ela pensou em tudo.'],
        ]);
      },
    });
  },
};
