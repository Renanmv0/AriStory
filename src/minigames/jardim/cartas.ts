import type { EstiloDeRegador } from '../../world/regador';
import type { ArmaId } from './armas';

/**
 * AS CARTAS DO MINIGAME DO JARDIM — o catálogo.
 *
 * O plano está em `docs/MINIGAME-JARDIM.md` §6, e a receita para criar carta
 * nova está na skill `.claude/skills/aristory-habilidade/SKILL.md`. Comece por
 * ela: carta nova é UMA ENTRADA nesta lista, e não uma mexida no minigame.
 *
 * ESTE ARQUIVO NÃO SABE QUE EXISTE UMA ESTUFA. Ele não importa cena, não
 * importa motor e não mexe em malha: uma carta só escreve numa `FichaDaRodada`,
 * que é o conjunto de números e regras que o minigame lê a cada quadro. É isso
 * que deixa o baralho inteiro testável sem abrir o navegador
 * (`scripts/cartas.mjs`).
 *
 * =============================================== A REGRA QUE DECIDE A RARIDADE
 *
 * **Carta comum mexe em número; carta rara mexe em regra.** Se uma ideia só
 * sabe dar +X%, ela é comum, por melhor que pareça. Uma lendária muda o jeito
 * de jogar a rodada inteira.
 *
 * =============================================== CARTA NENHUMA SE REPETE
 *
 * Pedido do Renan: carta que você já tem não aparece de novo. Quem guarda isso
 * é a `MaoDeCartas` (`baralho.ts`), e não esta lista.
 *
 * O que antes eram "comuns que repetem" (pegar mais alcance três vezes) virou
 * uma SÉRIE: "Bico mais longo", "Bico mais longo II" e "III" são três cartas
 * diferentes, e a II só entra no sorteio depois de a I estar na mão (`requer`).
 * O jogador continua podendo empilhar alcance, e nenhuma carta aparece duas
 * vezes — é o desenho do Vampire Survivors, que foi a referência dele.
 *
 * =============================================== CARTA DE JATO MUDA O JATO
 *
 * Regra do Renan: toda carta que mexe no jato muda alguma coisa VISÍVEL na
 * animação de ataque — forma, tinta, impacto ou chão. A tabela carta por carta
 * está no §6 do plano ("O jato também muda de cara"); quando o jato existir
 * (etapa 3), a ficha ganha um `jato` e a carta escreve nele como já escreve
 * no `estilo` do regador.
 */

export type Raridade = 'comum' | 'incomum' | 'raro' | 'lendario';

/**
 * AS TRÊS FAMÍLIAS, e as três precisam estar na mesa: três cartas que só
 * sabem dar +% ao regador não é uma escolha, é um clique.
 */
export type Familia = 'regador' | 'jardineiro' | 'jardim';

/**
 * AS REGRAS que uma carta pode ligar. Cada uma é um interruptor que o minigame
 * consulta com `ficha.regras.has(...)`.
 *
 * Lista fechada de propósito: regra nova é uma linha aqui MAIS o código no
 * minigame que a obedece. Uma string solta, digitada numa carta e que ninguém
 * lê, seria uma carta que não faz nada — e o compilador pega isso aqui.
 */
export type RegraDoJardim =
  | 'segundo-bico'      // o jato sai também para trás
  | 'atravessa'         // o jato passa do primeiro bicho e acerta o de trás
  | 'bota'              // terra de canteiro não segura mais quem anda
  | 'enche-andando'     // o tanque enche enquanto você anda, não só no tonel
  | 'empurrao'          // encostar num bicho joga ele 2 m para trás
  | 'grito'             // uma vez por onda, tudo num raio de 4 m recua
  | 'dedo-verde'        // canteiro machucado recupera 1 ponto entre ondas
  | 'segundo-tonel'     // nasce um tonel do outro lado da estufa
  | 'poca'              // onde o jato cai fica escorregadio por 4 s
  | 'espantalho'        // um espantalho puxa o alvo dos bichos por 20 s
  | 'josefina-ajuda'    // ela rega um canteiro por conta dela, uma vez por onda
  | 'portao-emperrado'  // uma das três portas fecha pelo resto da rodada
  | 'la-de-tras'        // quem ficou com a Josefina rega o canteiro mais perto dele
  | 'os-dois-na-frente' // o parceiro sai de trás e rega do seu lado
  | 'cerca-viva'        // um canteiro à sua escolha ganha uma cerca que aguenta uma vida inteira por onda
  | 'chuva'             // a estufa inteira leva um jato a cada 30 s
  // --- as do banco de ideias que o Renan mandou virar carta de uma vez
  // regador
  | 'gota-gelada'       // bicho molhado anda 30% mais devagar por 2 s
  | 'jato-em-arco'      // o jato passa por cima do canteiro e cai do outro lado
  | 'borrifador'        // cada jato sai em três gotinhas, cada uma com 40% do dano
  | 'crivo-giratorio'   // a cada 4 s um jato em volta, 360°
  | 'agua-com-sabao'    // bicho espantado solta uma bolha que molha quem está perto
  | 'jato-carregado'    // parado 1,5 s, o próximo jato atravessa a fila inteira
  | 'mira-no-grandao'   // o alvo é o bicho com mais vida no alcance, e não o mais perto
  | 'mira-em-quem-come' // o alvo é quem já está comendo um canteiro
  | 'garoa'             // andando, fica um rastro que dá meio jato em quem pisa
  | 'balde'             // segurar E derrama o tanque inteiro num círculo de 2 m
  | 'pressao-acumulada' // o primeiro jato com o tanque cheio encharca o triplo
  | 'geiser'            // a cada 20 s o bicho mais forte é jogado pela porta
  | 'arco-iris'         // 1 jato em 10 atravessa tudo e dobra as gotas de quem espanta
  // as ARMAS (`armas.ts`): o que a arma liga na base, e as cartas só dela
  | 'agua-infinita'     // a água nunca acaba (a mangueira, presa no tonel)
  | 'presa-na-estufa'   // quem joga não passa dos portões (a mangueira não chega lá fora)
  | 'jato-continuo'     // molhando o mesmo bicho sem parar, cada jato encharca mais (até o dobro)
  | 'chicote'           // bicho que atravessa a mangueira no chão leva um tranco e se molha
  | 'vazamento'         // a mangueira vaza: quem cruza ela anda devagar por 2 s
  | 'enchente'          // a cada 25 s, 3 s de jatão que atravessa a fila inteira
  | 'bifurcacao'        // um segundo fio sai de lado (25°), com metade da força
  | 'laco'              // bicho que pisa na mangueira fica enrolado (tonto) 1,5 s
  | 'mangueira-rega'    // canteiro que a mangueira no chão encosta sara devagar
  | 'rajada'            // (pistola) todo 4º tiro sai em rajada de três no mesmo bicho
  | 'rega-de-verdade'   // (regador) o jato que passa por um canteiro machucado rega ele: +1 de vida
  | 'respingo'          // (regador) bicho molhado respinga: quem está a 1 m dele leva 30% do jato
  | 'chuveirada'        // (regador) a cada três jatos, o leque abre o dobro
  | 'transbordou'       // (regador) encher a lata até a boca no tonel transborda: molha tudo em 2 m
  | 'regador-gigante'   // (regador) a cada 30 s, 5 s de regador gigante: leque e força dobrados
  | 'balao-dagua'       // (pistola) um tiro em cinco é um balão que estoura e molha em 1,2 m
  | 'ricochete'         // (pistola) o tiro que acerta pula no bicho mais perto (até 2,5 m), com metade da força
  | 'esguicho-no-olho'  // (pistola) um tiro em quatro deixa o bicho tonto 1 s
  | 'tiro-de-longe'     // (pistola) bicho a mais de 3,5 m de quem atira leva 40% mais
  | 'pistola-dupla'     // (pistola) um segundo tiro sai junto, no outro bicho mais perto, com 70% da força
  | 'super-molhador'    // (pistola) a cada 20 s, 4 s de tiros no dobro da velocidade que não gastam água
  | 'nevoa-que-fica'    // (borrifador) a névoa fica 2 s no ar, e quem entra nela leva meio borrifo
  | 'encharcado'        // (borrifador) névoa seguida no mesmo bicho molha 10% mais a cada vez, até +50%
  | 'pontaria-no-bando' // (borrifador) a névoa mira onde tem mais bichos juntos, e não no mais perto
  | 'folha-orvalhada'   // (borrifador) canteiro que a névoa toca fica orvalhado 2 s: a mordida tira metade
  | 'nuvem-teimosa'     // (borrifador) um aperto em cinco vira nuvem que segue o bicho mais forte por 4 s
  | 'redemoinho'        // (borrifador) de seis em seis apertos, a névoa gira e puxa os bichos para o meio
  | 'nevoa-que-se-espalha' // (borrifador) bicho espantado pela névoa vira uma nuvem nova, com metade da força
  // jardineiro
  | 'pique'             // andar 2 s sem parar dá +30% de velocidade, até parar
  | 'assobio'           // a cada 12 s o bicho mais perto anda 2 s para o lado errado
  | 'pe-na-poca'        // pisar numa poça (da carta Poça) dá um impulso de velocidade
  | 'ima-de-gota'       // ao subir de nível, todas as gotas do chão voam até você
  | 'sorte-de-principiante' // a próxima tela de cartas vem uma raridade acima
  | 'olho-de-jardineira'    // uma linha mostra para qual canteiro cada bicho vai
  | 'pulinho'           // encostar num bicho fraco é pular por cima dele
  | 'bis'               // a próxima carta de série que sair pula um degrau
  | 'troca-de-turno'    // o T troca quem joga e quem fica atrás; quem entra vem cheio
  | 'coracaozinho'      // a cada 20 gotas sobe um coração e os bichos perto param 1 s
  | 'danca-da-chuva'    // parado 3 s, chove 5 s em volta de você
  // jardim
  | 'sino-da-porta'     // um sininho toca quando um bicho passa por um portão
  | 'girassol-vigia'    // os girassóis viram para o portão do próximo bicho
  | 'cerquinha'         // nasce uma cerca baixa no terreiro que os bichos contornam
  | 'toldo'             // um canteiro à sua escolha aguenta 50% mais
  | 'canteiro-de-pimenta' // quem morde o canteiro escolhido foge e solta 2 gotas
  | 'aspersor'          // um aspersor no meio molha num raio de 2,5 m a cada 3 s
  | 'sementeira'        // canteiro comido até o fim volta com meia vida na onda seguinte
  | 'planta-carnivora'  // um canteiro morde o primeiro bicho que encostar, a cada 15 s
  | 'estufa-trancada'   // os portões seguram os bichos 10 s no começo de cada onda
  // os do clube: ajudantes, nunca alvo
  | 'apito-da-gina'     // uma vez por onda, todo bicho congela 1,5 s
  | 'picole-do-mano'    // no fim da onda cai um picolé: tanque cheio e velocidade 10 s
  | 'noel-avisa'        // o Noel grita qual portão abre na próxima onda
  | 'jean-luc-no-tonel' // encher no tonel é na hora
  | 'capy-salva-vidas'  // uma vez por onda, um jato longo pelo corredor do meio
  | 'walter-de-plantao' // o bicho mais perto de um canteiro recua até a porta
  | 'adubo-do-noel'     // canteiro regado fica mais forte até o fim da onda
  // os CHAMADOS: o bicho do clube entra na estufa e ajuda por um tempo
  | 'chama-capy'        // ATACANTE: na 1ª mordida da onda num canteiro, corre lá e rega 20 s
  | 'chama-gina'        // BARREIRA: no começo da onda, tranca 20 s o portão que vai vir mais cheio
  | 'chama-walter'      // PROTETOR: canteiro na metade da vida, corre lá latindo e todos ali fogem
  | 'chama-noel'        // CATADOR: com 8 gotas no chão, passa 20 s catando e trazendo pra você
  | 'mutirao-do-clube'; // na onda da chefe, os quatro entram juntos por 30 s

/**
 * COMO O JATO ESTÁ DESENHADO — a regra do Renan: carta que mexe no jato muda
 * alguma coisa que se VÊ na animação de ataque (§6 do plano, "O jato também
 * muda de cara"). As quatro camadas: **forma** (por onde a água vai),
 * **tinta** (a cor e a textura dela), **impacto** (o que acontece no bicho) e
 * **chão** (o que fica depois). Quem desenha é `minigames/jardim/jato.ts`.
 *
 * Os números (`alcance`, `largura`, `cadencia`) já mudam o jato sozinhos — o
 * cone vai mais longe, abre mais, sai mais seguido. Os degraus `longo`,
 * `aberto`, `rapido` e `grosso` estão aqui para o desenho caprichar em cima
 * disso (mais gotas na borda do leque, gota mais grossa) e para a tela saber
 * pôr o selo "muda o jato".
 */
export interface EstiloDoJato {
  // ---- forma
  /** degraus do Bico mais longo: o cone vai mais longe */
  longo?: number;
  /** degraus do Leque aberto: o cone abre, com mais gotas na borda */
  aberto?: number;
  /** degraus do Braço solto: os jatos saem mais seguidos */
  rapido?: number;
  /** um segundo cone sai para trás */
  segundoBico?: boolean;
  /** a Mangueira (a carta do regador, e a arma): linha comprida e fina */
  mangueira?: boolean;
  /** o Jato contínuo: o fio engrossa enquanto molha o mesmo bicho */
  continuo?: boolean;
  /** a Enchente: de 25 em 25 s, a mangueira abre tudo por 3 s */
  enchente?: boolean;
  /** a Bifurcação: um segundo fio, mais fino, sai de lado a cada jato */
  bifurcacao?: boolean;
  /** a PISTOLA D'ÁGUA (a arma): o tiro é uma fileira reta de bolinhas grandes */
  pistola?: boolean;
  /**
   * a MANGUEIRA (a arma, e não a carta Bico de mangueira do regador): o mesmo
   * fio comprido, com o som de jorro dela
   */
  daMangueira?: boolean;
  /**
   * o BORRIFADOR (a arma): o aperto solta uma NÉVOA que vira nuvem em cima do
   * bicho e molha todo mundo dentro dela — a forma `nevoa` de `jato.ts`
   */
  nevoa?: boolean;
  /** degraus da Névoa larga: a nuvem fica maior */
  nevoaLarga?: number;
  /** degraus do Concentrado: a névoa sai mais azul e cai mais chuvisco */
  concentrado?: number;
  /** a Névoa que fica: a nuvem demora a desmanchar */
  nevoaQueFica?: boolean;
  /** o Encharcado: o bicho encharcado pinga */
  encharcado?: boolean;
  /** a Pontaria no bando: um anel rosa no chão mostra onde a névoa vai cair */
  bando?: boolean;
  /** a Nuvem teimosa: uma nuvenzinha chove em cima do bicho mais forte */
  teimosa?: boolean;
  /** o Redemoinho: a névoa gira em espiral e puxa os bichos */
  redemoinho?: boolean;
  /** a Névoa que se espalha: o bicho espantado estoura numa nuvem nova */
  espalha?: boolean;
  /** a Rajada: de quatro em quatro tiros, saem três seguidos */
  rajada?: boolean;
  /** o Balão d'água: um tiro em cinco é um balão que estoura em volta */
  balao?: boolean;
  /** o Ricochete: do bicho acertado sai um tiro menor até o vizinho */
  ricochete?: boolean;
  /** o Esguicho no olho: o bicho acertado sacode, tonto */
  olho?: boolean;
  /** o Tiro de longe: o alvinho aparece em quem está longe, e o tiro pesa mais */
  longe?: boolean;
  /** a Pistola dupla: um segundo tiro, noutro bicho */
  dupla?: boolean;
  /** o Super molhador: de 20 em 20 s, a pistola dispara no dobro */
  superMolhador?: boolean;
  /** o Crivo de flor (regador): pétalas cor-de-rosa voam no meio do leque */
  petalas?: boolean;
  /** a Lata cheia (regador): com a lata mais da metade cheia, o jato sai mais grosso */
  lataCheia?: boolean;
  /** a Regada caprichada (regador): o primeiro jato em cada bicho dá um respingo grande */
  caprichada?: boolean;
  /** o Respingo (regador): o bicho molhado espirra água em volta */
  respingo?: boolean;
  /** a Chuveirada (regador): de três em três jatos, o leque abre o dobro */
  chuveirada?: boolean;
  /** o Transbordou (regador): a lata cheia no tonel derrama num anel em volta */
  transbordou?: boolean;
  /** o Regador gigante: de 30 em 30 s a peça da mão cresce e o leque dobra */
  gigante?: boolean;
  /** o Regador de pressão: jato reto que atravessa o primeiro bicho */
  reto?: boolean;
  /** o jato sobe em parábola por cima do canteiro */
  arco?: boolean;
  /** três fiozinhos em leque no lugar do cone */
  borrifador?: boolean;
  /** a cada 4 s o regador gira e solta um anel de água */
  crivoGiratorio?: boolean;
  /** parado 1,5 s, o regador treme, brilha e solta um jatão */
  carregado?: boolean;
  /** segurar E vira o regador de ponta-cabeça: uma onda em círculo */
  balde?: boolean;
  /** a nuvem da Chuva despeja na estufa inteira */
  chuva?: boolean;
  /** parado 3 s, uma nuvem pequena chove em volta */
  dancaDaChuva?: boolean;
  // ---- tinta
  /** o Orvalho: vapor fininho no caminho do jato */
  vapor?: boolean;
  /** água azul-gelo e cristaizinhos no bicho molhado */
  gelo?: boolean;
  /** bolhas no jato, e a bolha grande que estoura */
  sabao?: boolean;
  /** um jato em dez sai em arco-íris */
  arcoIris?: boolean;
  /** vapor sobe do bicho grande quando leva jato */
  morna?: boolean;
  // ---- impacto
  /** degraus do Jato firme: gota mais grossa, respingo maior */
  grosso?: number;
  /** degraus da Gota pesada: o bicho dá um tranco para trás */
  tranco?: number;
  /** um alvinho em cima de quem o regador escolheu */
  mira?: 'grandao' | 'come';
  /** o primeiro jato de tanque cheio sai grosso, com um anel de respingo */
  pressaoAcumulada?: boolean;
  /** o chão racha e sobe uma coluna d'água embaixo do bicho mais forte */
  geiser?: boolean;
  // ---- chão
  /** onde o jato cai fica uma mancha molhada e brilhante */
  poca?: boolean;
  /** um rastro de gotinhas fica atrás de você */
  garoa?: boolean;
  /** a mangueira no chão dá um tranco em quem pisa nela (ela sacode) */
  chicote?: boolean;
  /** a mangueira no chão vaza: gotinhas e poças ao longo dela */
  vazamento?: boolean;
  /** o Laço: a mangueira se enrola em quem pisa nela (ela sacode e o bicho fica tonto) */
  laco?: boolean;
}

/**
 * OS NÚMEROS E AS REGRAS DA RODADA — tudo o que uma carta pode mexer.
 *
 * Ela nunca é acumulada à mão: a `MaoDeCartas` a DERIVA do zero, partindo de
 * `fichaInicial()` e aplicando as cartas na ordem em que foram pegas. Assim
 * não existe número que "escorregou" de uma carta desfeita, e a ficha de
 * qualquer momento é reproduzível só com a lista de ids.
 */
export interface FichaDaRodada {
  /** raio em que o regador acha alvo, em metros */
  alcance: number;
  /** quanto tira de encharque por jato */
  dano: number;
  /** segundos entre um jato e o outro (MENOR é melhor) */
  cadencia: number;
  /** abertura do leque de água, em graus */
  largura: number;
  /** quantos jatos cabem no tanque */
  tanque: number;
  /** jatos por segundo que o tanque recupera sozinho */
  recarga: number;
  /** multiplicador da velocidade de andar */
  velocidade: number;
  /** raio em que as gotas são puxadas; abaixo de 1,3 m vale o `ATRAI` das gotas */
  coleta: number;
  /** multiplicador de quanto cada canteiro aguenta ser comido */
  vidaDoCanteiro: number;
  /** metros que cada jato empurra o bicho para trás */
  empurraoDoJato: number;
  /** multiplicador do encharque em tanque e chefe */
  contraOGrandao: number;
  /** multiplicador da velocidade de encher no tonel */
  refil: number;
  /** quanta água cada jato gasta, em jatos (MENOR é melhor) */
  gastoPorJato: number;
  /** multiplicador da `recarga` enquanto você está parado */
  recargaParado: number;
  /** fração da vida que um bicho espantado devolve ao canteiro mais perto */
  compostagem: number;
  /**
   * A LATA CHEIA (regador): quanto o jato molha a MAIS enquanto a lata está
   * mais da metade cheia (0 = sem a carta; 0,15 por degrau)
   */
  lataCheia: number;
  /**
   * A REGADA CAPRICHADA (regador): quanto o PRIMEIRO jato em cada bicho molha
   * a mais (0 = sem a carta; 0,25 por degrau)
   */
  primeiraRegada: number;
  /**
   * O TAMANHO DA NÉVOA (borrifador): multiplica o raio da nuvem, que sai da
   * `largura` (1 = sem carta; a Névoa larga dá +15% por degrau)
   */
  raioDaNevoa: number;
  /** os interruptores ligados */
  regras: Set<RegraDoJardim>;
  /**
   * COMO O REGADOR ESTÁ DESENHADO. Carta que mexe no regador mexe na peça da
   * mão (§6 do plano) — e é aqui que ela escreve isso. O `estagio` não entra:
   * ele sai de QUANTAS cartas de regador foram pegas, e quem conta é a mão.
   */
  estilo: Omit<Partial<EstiloDeRegador>, 'estagio'>;
  /** COMO O JATO ESTÁ DESENHADO — ver `EstiloDoJato` */
  jato: EstiloDoJato;
}

/** Os quatro números do §4 do plano, e o resto no zero. */
export function fichaInicial(): FichaDaRodada {
  return {
    // 3,0 (era 2,6): a rodada estava difícil, e o regador que alcança um
    // passo a mais é o que menos muda o jeito de jogar — pedido do Renan
    alcance: 3.0,
    dano: 1,
    cadencia: 1.1,
    largura: 35,
    tanque: 12,
    recarga: 0.25,
    velocidade: 1,
    coleta: 0,
    vidaDoCanteiro: 1,
    empurraoDoJato: 0,
    contraOGrandao: 1,
    refil: 1,
    gastoPorJato: 1,
    recargaParado: 1,
    compostagem: 0,
    lataCheia: 0,
    primeiraRegada: 0,
    raioDaNevoa: 1,
    regras: new Set(),
    estilo: {},
    jato: {},
  };
}

/**
 * O que acontece NA HORA em que a carta é escolhida, e não depois.
 *
 * Só as cartas de consolo usam (ver `CONSOLOS`): elas não mudam a ficha, elas
 * dão uma coisa agora. O minigame lê e executa.
 */
export type EfeitoNaHora = 'encher-tanque' | 'curar-canteiro' | 'susto';

/**
 * Quem do clube uma carta de CHAMADO traz para dentro da estufa. Pedido do
 * Renan: pegar a carta é uma cutscene do bicho entrando pela porta principal,
 * com as falas dele (`scenes/estufa.ts`, "OS CHAMADOS").
 */
export type AjudanteDoClube = 'capy' | 'gina' | 'walter' | 'noel';

export interface CartaDoJardim {
  /** único no baralho inteiro; é ele que a mão guarda */
  readonly id: string;
  /** o que aparece em cima da carta */
  readonly nome: string;
  readonly familia: Familia;
  readonly raridade: Raridade;
  readonly icone: string;
  /** uma frase, o que ela faz — cabe na carta de um celular */
  readonly texto: string;
  /**
   * Só entra no sorteio depois de TODAS estas estarem na mão. É o que faz uma
   * série (I → II → III) andar em ordem.
   */
  readonly requer?: readonly string[];
  /**
   * Não entra no sorteio se QUALQUER uma destas estiver na mão. Para duas
   * cartas que brigam pela mesma coisa e não podem conviver.
   */
  readonly exclui?: readonly string[];
  /**
   * Nível mínimo para ela aparecer. Sem ele vale o piso da raridade
   * (`NIVEL_MINIMO`): lendária não sai antes do 4.
   */
  readonly nivelMinimo?: number;
  /**
   * Carta de consolo: pode sair quantas vezes for, e NÃO entra na mão. Só
   * aparece quando o baralho de verdade não tem mais três cartas para mostrar.
   */
  readonly repetivel?: boolean;
  readonly naHora?: EfeitoNaHora;
  /** carta de chamado: quem entra pela porta, na cutscene, quando ela é pega */
  readonly chama?: readonly AjudanteDoClube[];
  /**
   * SÓ SAI COM ESTAS ARMAS (`armas.ts`): a carta que é de uma arma só — as da
   * mangueira. Sem isto, ela serve para qualquer arma.
   */
  readonly soPara?: readonly ArmaId[];
  /**
   * NÃO SAI COM ESTAS ARMAS: a genérica que não faz sentido nelas. A mangueira
   * tem água infinita, então nada de tanque, refil, tonel ou gasto de água.
   */
  readonly naoServe?: readonly ArmaId[];
  /** o que ela faz com a rodada; nunca guarda estado fora da ficha */
  aplicar(f: FichaDaRodada): void;
}

/**
 * O PISO DE CADA RARIDADE. "Lendária não sai antes do nível 4": roguelite em
 * que a primeira carta decide a rodada é roguelite que não tem rodada.
 */
export const NIVEL_MINIMO: Record<Raridade, number> = {
  comum: 1,
  incomum: 1,
  raro: 2,
  lendario: 4,
};

// ------------------------------------------------------------------ séries

const ROMANO = ['', ' II', ' III', ' IV', ' V'] as const;

/**
 * UMA SÉRIE: a mesma melhoria em degraus, cada degrau uma carta.
 *
 * `aplicar(f, degrau)` recebe 1, 2, 3… — é o que deixa o degrau desenhar a
 * peça (o bico estica `degrau / total`) sem cada carta repetir a conta.
 */
function serie(
  base: string,
  degraus: number,
  ficha: Omit<CartaDoJardim, 'id' | 'requer' | 'aplicar'>,
  aplicar: (f: FichaDaRodada, degrau: number, total: number) => void,
): CartaDoJardim[] {
  const cartas: CartaDoJardim[] = [];
  for (let d = 1; d <= degraus; d++) {
    cartas.push({
      ...ficha,
      id: `${base}-${d}`,
      nome: `${ficha.nome}${ROMANO[d - 1]}`,
      requer: d > 1 ? [`${base}-${d - 1}`] : undefined,
      aplicar: (f) => aplicar(f, d, degraus),
    });
  }
  return cartas;
}

// ================================================================= REGADOR
// "eu bato mais forte" — os números do §4 e as regras do jato

const REGADOR: CartaDoJardim[] = [
  ...serie('bico', 3, {
    familia: 'regador', raridade: 'comum', icone: '📏',
    nome: 'Bico mais longo', texto: 'O jato alcança 18% mais longe',
  }, (f, d, n) => {
    f.alcance *= 1.18;
    f.estilo.bico = d / n;
    f.jato.longo = d;
  }),
  ...serie('jato', 3, {
    familia: 'regador', raridade: 'comum', icone: '💦',
    nome: 'Jato firme', texto: 'Cada jato encharca 20% mais',
  }, (f, d) => {
    f.dano *= 1.2;
    f.estilo.ponteira = true;
    f.jato.grosso = Math.max(f.jato.grosso ?? 0, d);
  }),
  ...serie('braco', 3, {
    familia: 'regador', raridade: 'comum', icone: '💪',
    nome: 'Braço solto', texto: 'O jato sai 12% mais rápido',
  }, (f, d) => {
    f.cadencia *= 0.88;
    f.estilo.caboDeMadeira = true;
    f.jato.rapido = d;
  }),
  ...serie('leque', 3, {
    familia: 'regador', raridade: 'comum', icone: '🌬️',
    nome: 'Leque aberto', texto: 'O leque de água abre mais 10°',
  }, (f, d, n) => {
    f.largura += 10;
    f.estilo.crivo = d / n;
    f.jato.aberto = d;
  }),
  ...serie('tanque', 3, {
    familia: 'regador', raridade: 'comum', icone: '🪣',
    nome: 'Tanque maior', texto: 'Cabem mais 4 jatos no tanque',
    naoServe: ['mangueira'],
  }, (f, d, n) => {
    f.tanque += 4;
    f.estilo.tanque = d / n;
  }),
  {
    id: 'segundo-bico', nome: 'Segundo bico', familia: 'regador', raridade: 'incomum',
    icone: '↔️', texto: 'O jato sai também para trás, com 60% da força',
    aplicar: (f) => {
      f.regras.add('segundo-bico');
      f.estilo.segundoBico = true;
      f.jato.segundoBico = true;
    },
  },
  {
    id: 'orvalho', nome: 'Orvalho', familia: 'regador', raridade: 'incomum', naoServe: ['mangueira'],
    icone: '🌫️', texto: 'O tanque enche sozinho 50% mais rápido',
    aplicar: (f) => {
      f.recarga *= 1.5;
      f.estilo.respiro = true;
      f.jato.vapor = true;
    },
  },
  {
    // era "Mangueira": o nome mudou quando a mangueira virou ARMA (o id ficou, é o do livro)
    id: 'mangueira', nome: 'Bico de mangueira', familia: 'regador', raridade: 'raro', soPara: ['regador'],
    icone: '🐍', texto: 'O alcance dobra, mas o jato demora 40% mais',
    aplicar: (f) => {
      f.alcance *= 2;
      f.cadencia *= 1.4;
      f.estilo.mangueira = true;
      f.jato.mangueira = true;
    },
  },
  {
    id: 'pressao', nome: 'Regador de pressão', familia: 'regador', raridade: 'raro',
    icone: '🎯', texto: 'O jato atravessa o primeiro bicho e acerta o de trás',
    aplicar: (f) => {
      f.regras.add('atravessa');
      f.jato.reto = true;
    },
  },
  // --- do banco de ideias (§6 do plano)
  ...serie('gota-pesada', 3, {
    familia: 'regador', raridade: 'comum', icone: '🪨',
    nome: 'Gota pesada', texto: 'Cada jato empurra o bicho 30 cm para trás (os grandes, menos)',
  }, (f, d) => {
    f.empurraoDoJato += 0.3;
    f.jato.tranco = d;
  }),
  ...serie('refil', 2, {
    familia: 'regador', raridade: 'comum', icone: '⏩',
    nome: 'Refil rápido', texto: 'Encher no tonel fica 40% mais rápido',
    exclui: ['jean-luc-no-tonel'], naoServe: ['mangueira'],
  }, (f) => {
    f.refil *= 1.4;
  }),
  {
    id: 'agua-morna', nome: 'Água morna', familia: 'regador', raridade: 'comum',
    icone: '♨️', texto: 'O jato encharca 25% mais os bichos grandes e a chefe',
    aplicar: (f) => {
      f.contraOGrandao *= 1.25;
      f.jato.morna = true;
    },
  },
  {
    id: 'gota-gelada', nome: 'Gota gelada', familia: 'regador', raridade: 'incomum',
    icone: '🧊', texto: 'Bicho molhado anda 30% mais devagar por 2 s',
    aplicar: (f) => {
      f.regras.add('gota-gelada');
      f.jato.gelo = true;
    },
  },
  {
    id: 'jato-em-arco', nome: 'Jato em arco', familia: 'regador', raridade: 'incomum',
    icone: '⤴️', texto: 'O jato passa por cima do canteiro e acerta quem come do outro lado',
    aplicar: (f) => {
      f.regras.add('jato-em-arco');
      f.jato.arco = true;
    },
  },
  {
    // era "Borrifador": o nome mudou quando o borrifador virou ARMA (o id ficou)
    id: 'borrifador', nome: 'Crivo de três furos', familia: 'regador', raridade: 'incomum',
    icone: '💧', texto: 'Cada jato sai em três gotinhas: acerta mais bichos, mais fraco',
    aplicar: (f) => {
      f.regras.add('borrifador');
      f.jato.borrifador = true;
    },
  },
  {
    id: 'mira-no-grandao', nome: 'Mira no grandão', familia: 'regador', raridade: 'incomum',
    icone: '🏋️', texto: 'O jato mira no bicho com mais vida, e não no mais perto',
    exclui: ['mira-em-quem-come', 'pontaria-no-bando'],
    aplicar: (f) => {
      f.regras.add('mira-no-grandao');
      f.jato.mira = 'grandao';
    },
  },
  {
    id: 'mira-em-quem-come', nome: 'Mira em quem come', familia: 'regador', raridade: 'incomum',
    icone: '🍽️', texto: 'O jato mira primeiro em quem já está num canteiro',
    exclui: ['mira-no-grandao', 'pontaria-no-bando'],
    aplicar: (f) => {
      f.regras.add('mira-em-quem-come');
      f.jato.mira = 'come';
    },
  },
  {
    id: 'garoa', nome: 'Garoa', familia: 'regador', raridade: 'incomum',
    icone: '🌦️', texto: 'Você deixa um rastro de gotinhas: quem pisa leva meio jato',
    aplicar: (f) => {
      f.regras.add('garoa');
      f.jato.garoa = true;
    },
  },
  {
    id: 'pressao-acumulada', nome: 'Pressão acumulada', familia: 'regador', raridade: 'incomum', naoServe: ['mangueira'],
    icone: '🧯', texto: 'O primeiro jato depois de encher o tanque encharca o triplo',
    aplicar: (f) => {
      f.regras.add('pressao-acumulada');
      f.jato.pressaoAcumulada = true;
    },
  },
  {
    id: 'crivo-giratorio', nome: 'Crivo giratório', familia: 'regador', raridade: 'raro',
    icone: '🌀', texto: 'A cada 4 s você gira o jato e molha tudo em volta',
    aplicar: (f) => {
      f.regras.add('crivo-giratorio');
      f.jato.crivoGiratorio = true;
    },
  },
  {
    id: 'agua-com-sabao', nome: 'Água com sabão', familia: 'regador', raridade: 'raro',
    icone: '🧼', texto: 'Bicho espantado solta uma bolha que estoura e molha quem está perto',
    aplicar: (f) => {
      f.regras.add('agua-com-sabao');
      f.jato.sabao = true;
    },
  },
  {
    id: 'jato-carregado', nome: 'Jato carregado', familia: 'regador', raridade: 'raro',
    icone: '⚡', texto: 'Parado 1,5 s, o próximo jato atravessa a fila inteira',
    aplicar: (f) => {
      f.regras.add('jato-carregado');
      f.jato.carregado = true;
    },
  },
  {
    id: 'balde', nome: 'Balde', familia: 'regador', raridade: 'raro', soPara: ['regador'],
    icone: '🌊', texto: 'Segurar E derrama o tanque inteiro num círculo de 2 m',
    aplicar: (f) => {
      f.regras.add('balde');
      f.jato.balde = true;
    },
  },
  {
    id: 'geiser', nome: 'Gêiser', familia: 'regador', raridade: 'lendario',
    icone: '⛲', texto: 'A cada 20 s um gêiser joga o mais forte pela porta (a chefe perde 1/3)',
    aplicar: (f) => {
      f.regras.add('geiser');
      f.jato.geiser = true;
    },
  },
  {
    id: 'arco-iris', nome: 'Arco-íris', familia: 'regador', raridade: 'lendario',
    icone: '🌈', texto: 'Um jato em dez atravessa tudo e dobra as gotas de quem espanta',
    aplicar: (f) => {
      f.regras.add('arco-iris');
      f.jato.arcoIris = true;
    },
  },
  // ======================================================= só do REGADOR
  // (a lata de sempre, `armas.ts`): o que só um regador faz — a lata que pesa
  // cheia, o crivo que abre em leque, e regar de verdade, que é o nome dele
  ...serie('lata-cheia', 2, {
    familia: 'regador', raridade: 'comum', icone: '⚖️', soPara: ['regador'],
    nome: 'Lata cheia', texto: 'Com a lata mais da metade cheia, o jato molha 15% mais',
  }, (f) => {
    f.lataCheia += 0.15;
    f.jato.lataCheia = true;
  }),
  ...serie('crivo-de-flor', 2, {
    familia: 'regador', raridade: 'comum', icone: '🌸', soPara: ['regador'],
    nome: 'Crivo de flor', texto: 'O crivo vira uma flor: o leque abre 5° e molha 6% mais',
  }, (f, d, total) => {
    f.largura += 5;
    f.dano *= 1.06;
    f.estilo.crivoDeFlor = d / total;
    f.jato.aberto = Math.max(f.jato.aberto ?? 0, d);
    f.jato.petalas = true;
  }),
  ...serie('regada-caprichada', 2, {
    familia: 'regador', raridade: 'comum', icone: '✨', soPara: ['regador'],
    nome: 'Regada caprichada', texto: 'O primeiro jato em cada bicho molha 25% mais',
  }, (f) => {
    f.primeiraRegada += 0.25;
    f.jato.caprichada = true;
  }),
  {
    id: 'respingo', nome: 'Respingo', familia: 'regador', raridade: 'incomum', soPara: ['regador'],
    icone: '💨', texto: 'Bicho molhado respinga: quem está a 1 m dele leva 30% do jato',
    aplicar: (f) => {
      f.regras.add('respingo');
      f.jato.respingo = true;
    },
  },
  {
    id: 'chuveirada', nome: 'Chuveirada', familia: 'regador', raridade: 'incomum', soPara: ['regador'],
    icone: '☔', texto: 'A cada três jatos, o leque abre o dobro e molha todo mundo nele',
    aplicar: (f) => {
      f.regras.add('chuveirada');
      f.jato.chuveirada = true;
    },
  },
  {
    id: 'transbordou', nome: 'Transbordou', familia: 'regador', raridade: 'incomum', soPara: ['regador'],
    icone: '🫙', texto: 'Encher a lata até a boca no tonel transborda: molha tudo em 2 m',
    aplicar: (f) => {
      f.regras.add('transbordou');
      f.jato.transbordou = true;
    },
  },
  {
    id: 'regador-gigante', nome: 'Regador gigante', familia: 'regador', raridade: 'lendario', soPara: ['regador'],
    icone: '🏺', texto: 'A cada 30 s o regador fica gigante por 5 s: o leque e a força dobram',
    aplicar: (f) => {
      f.regras.add('regador-gigante');
      f.jato.gigante = true;
    },
  },
  // ======================================================= só da PISTOLA
  // (`armas.ts`): o tiro de longe, um bicho por vez — as cartas dela brincam
  // com o que um brinquedo de piscina faz: cano comprido, rajada, balão
  ...serie('cano-longo', 2, {
    familia: 'regador', raridade: 'comum', icone: '🔭', soPara: ['pistola'],
    nome: 'Cano comprido', texto: 'O tiro vai 12% mais longe e acerta 6% mais forte',
  }, (f, d) => {
    f.alcance *= 1.12;
    f.dano *= 1.06;
    f.jato.longo = Math.max(f.jato.longo ?? 0, d);
  }),
  {
    id: 'balao-dagua', nome: "Balão d'água", familia: 'regador', raridade: 'incomum', soPara: ['pistola'],
    icone: '🎈', texto: 'Um tiro em cinco é um balão que estoura e molha tudo em 1,2 m',
    aplicar: (f) => {
      f.regras.add('balao-dagua');
      f.jato.balao = true;
    },
  },
  ...serie('gatilho', 2, {
    familia: 'regador', raridade: 'comum', icone: '👆', soPara: ['pistola'],
    nome: 'Gatilho leve', texto: 'O gatilho amacia: a pistola atira 10% mais seguido',
  }, (f, d) => {
    f.cadencia *= 0.9;
    f.jato.rapido = Math.max(f.jato.rapido ?? 0, d);
  }),
  ...serie('bolinha', 2, {
    familia: 'regador', raridade: 'comum', icone: '💠', soPara: ['pistola'],
    nome: 'Bolinha gorda', texto: 'A bolinha engrossa: cada tiro molha 12% mais',
  }, (f, d) => {
    f.dano *= 1.12;
    f.jato.grosso = Math.max(f.jato.grosso ?? 0, d);
  }),
  {
    id: 'ricochete', nome: 'Ricochete', familia: 'regador', raridade: 'incomum', soPara: ['pistola'],
    icone: '↪️', texto: 'O tiro que acerta pula no bicho mais perto, com metade da força',
    aplicar: (f) => {
      f.regras.add('ricochete');
      f.jato.ricochete = true;
    },
  },
  {
    id: 'esguicho-no-olho', nome: 'Esguicho no olho', familia: 'regador', raridade: 'incomum', soPara: ['pistola'],
    icone: '😵', texto: 'Um tiro em quatro acerta o olho: o bicho fica tonto 1 s',
    aplicar: (f) => {
      f.regras.add('esguicho-no-olho');
      f.jato.olho = true;
    },
  },
  {
    id: 'tiro-de-longe', nome: 'Tiro de longe', familia: 'regador', raridade: 'incomum', soPara: ['pistola'],
    icone: '🏹', texto: 'Bicho a mais de 3,5 m de você leva 40% mais',
    aplicar: (f) => {
      f.regras.add('tiro-de-longe');
      f.jato.longe = true;
    },
  },
  {
    id: 'pistola-dupla', nome: 'Pistola dupla', familia: 'regador', raridade: 'raro', soPara: ['pistola'],
    icone: '🔫', texto: 'Uma em cada mão: sai um segundo tiro no outro bicho mais perto',
    aplicar: (f) => {
      f.regras.add('pistola-dupla');
      f.jato.dupla = true;
    },
  },
  {
    id: 'super-molhador', nome: 'Super molhador', familia: 'regador', raridade: 'lendario', soPara: ['pistola'],
    icone: '🌟', texto: 'A cada 20 s, 4 s de tiros dobrados que não gastam água',
    aplicar: (f) => {
      f.regras.add('super-molhador');
      f.jato.superMolhador = true;
    },
  },
  {
    id: 'rajada', nome: 'Rajada', familia: 'regador', raridade: 'raro', soPara: ['pistola'],
    icone: '🎇', texto: 'De quatro em quatro tiros, saem três seguidos no mesmo bicho',
    aplicar: (f) => {
      f.regras.add('rajada');
      f.jato.rajada = true;
    },
  },
  // ======================================================= só do BORRIFADOR
  // (`armas.ts`): a névoa que molha um bando inteiro. As cartas dele fazem
  // duas coisas, a pedido do Renan: deixam a área ainda maior e mais viva, e
  // dão a ele como vencer os bichos grandes, que é onde a névoa é fraca
  ...serie('dedo-ligeiro', 2, {
    familia: 'regador', raridade: 'comum', icone: '🤏', soPara: ['borrifador'],
    nome: 'Dedo ligeiro', texto: 'O dedo pega o jeito: o borrifador borrifa 10% mais seguido',
  }, (f, d) => {
    f.cadencia *= 0.9;
    f.jato.rapido = Math.max(f.jato.rapido ?? 0, d);
  }),
  ...serie('nevoa-larga', 2, {
    familia: 'regador', raridade: 'comum', icone: '☁️', soPara: ['borrifador'],
    nome: 'Névoa larga', texto: 'O bico abre em flor: a nuvem de névoa fica 15% maior',
  }, (f, d, total) => {
    f.raioDaNevoa *= 1.15;
    f.estilo.nevoaLarga = d / total;
    f.jato.nevoaLarga = d;
  }),
  ...serie('concentrado', 2, {
    familia: 'regador', raridade: 'comum', icone: '🧪', soPara: ['borrifador'],
    nome: 'Concentrado', texto: 'A névoa molha 8% mais, e os bichos grandes 20% mais',
  }, (f, d, total) => {
    f.dano *= 1.08;
    f.contraOGrandao *= 1.2;
    f.estilo.concentrado = d / total;
    f.jato.concentrado = d;
  }),
  {
    id: 'nevoa-que-fica', nome: 'Névoa que fica', familia: 'regador', raridade: 'incomum', soPara: ['borrifador'],
    icone: '🌁', texto: 'A névoa fica 2 s no ar, e quem entra nela leva meio borrifo',
    aplicar: (f) => {
      f.regras.add('nevoa-que-fica');
      f.jato.nevoaQueFica = true;
    },
  },
  {
    id: 'encharcado', nome: 'Encharcado', familia: 'regador', raridade: 'incomum', soPara: ['borrifador'],
    icone: '🛁', texto: 'Cada névoa seguida no mesmo bicho molha 10% mais, até +50%',
    aplicar: (f) => {
      f.regras.add('encharcado');
      f.jato.encharcado = true;
    },
  },
  {
    id: 'pontaria-no-bando', nome: 'Pontaria no bando', familia: 'regador', raridade: 'incomum', soPara: ['borrifador'],
    icone: '🎳', texto: 'A névoa mira onde tem mais bichos juntos, e não no mais perto',
    exclui: ['mira-no-grandao', 'mira-em-quem-come'],
    aplicar: (f) => {
      f.regras.add('pontaria-no-bando');
      f.jato.bando = true;
    },
  },
  {
    id: 'nuvem-teimosa', nome: 'Nuvem teimosa', familia: 'regador', raridade: 'raro', soPara: ['borrifador'],
    icone: '⛅', texto: 'Um aperto em cinco vira nuvem que chove no bicho mais forte por 4 s',
    aplicar: (f) => {
      f.regras.add('nuvem-teimosa');
      f.jato.teimosa = true;
    },
  },
  {
    id: 'redemoinho', nome: 'Redemoinho', familia: 'regador', raridade: 'raro', soPara: ['borrifador'],
    icone: '🌪️', texto: 'De seis em seis apertos, a névoa gira e puxa os bichos para o meio',
    aplicar: (f) => {
      f.regras.add('redemoinho');
      f.jato.redemoinho = true;
    },
  },
  {
    id: 'nevoa-que-se-espalha', nome: 'Névoa que se espalha', familia: 'regador', raridade: 'lendario', soPara: ['borrifador'],
    icone: '🎆', texto: 'Bicho espantado pela névoa vira uma nuvem nova, com metade da força',
    aplicar: (f) => {
      f.regras.add('nevoa-que-se-espalha');
      f.jato.espalha = true;
    },
  },
  // ======================================================= só da MANGUEIRA
  // (a arma presa no tonel, `armas.ts`): o que só uma mangueira faz — a linha
  // dela no chão vira arma, e o fio que não para de sair vira pressão
  ...serie('esguicho', 3, {
    familia: 'regador', raridade: 'comum', icone: '🔩', soPara: ['mangueira'],
    nome: 'Esguicho de latão', texto: 'O esguicho aperta: o jato encharca 12% mais e vai 8% mais longe',
  }, (f, d) => {
    f.dano *= 1.12;
    f.alcance *= 1.08;
    f.jato.grosso = Math.max(f.jato.grosso ?? 0, d);
  }),
  ...serie('torneira', 2, {
    familia: 'regador', raridade: 'comum', icone: '🚰', soPara: ['mangueira'],
    nome: 'Torneira aberta', texto: 'A torneira abre mais: o jato sai 10% mais seguido',
  }, (f, d) => {
    f.cadencia *= 0.9;
    f.jato.rapido = Math.max(f.jato.rapido ?? 0, d);
  }),
  {
    id: 'vedacao', nome: 'Vedação nova', familia: 'regador', raridade: 'comum', soPara: ['mangueira'],
    icone: '🔧', texto: 'Nada vaza no engate: o jato vai 12% mais longe',
    aplicar: (f) => {
      f.alcance *= 1.12;
      f.jato.longo = Math.max(f.jato.longo ?? 0, 1);
    },
  },
  {
    id: 'bifurcacao', nome: 'Bifurcação', familia: 'regador', raridade: 'incomum', soPara: ['mangueira'],
    icone: '🔱', texto: 'Um Y no esguicho: sai um segundo fio de lado, com metade da força',
    aplicar: (f) => {
      f.regras.add('bifurcacao');
      f.jato.bifurcacao = true;
    },
  },
  {
    id: 'laco', nome: 'Laço', familia: 'regador', raridade: 'raro', soPara: ['mangueira'],
    icone: '➰', texto: 'Bicho que pisa na mangueira fica enrolado 1,5 s',
    aplicar: (f) => {
      f.regras.add('laco');
      f.jato.laco = true;
    },
  },
  {
    id: 'jato-continuo', nome: 'Jato contínuo', familia: 'regador', raridade: 'raro', soPara: ['mangueira'],
    icone: '〰️', texto: 'No mesmo bicho sem parar, o jato engrossa até encharcar o dobro',
    aplicar: (f) => {
      f.regras.add('jato-continuo');
      f.jato.continuo = true;
    },
  },
  {
    id: 'chicote', nome: 'Chicote', familia: 'regador', raridade: 'incomum', soPara: ['mangueira'],
    icone: '🪢', texto: 'Bicho que atravessa a mangueira no chão leva um tranco e se molha',
    aplicar: (f) => {
      f.regras.add('chicote');
      f.jato.chicote = true;
    },
  },
  {
    id: 'vazamento', nome: 'Vazamento', familia: 'regador', raridade: 'incomum', soPara: ['mangueira'],
    icone: '🕳️', texto: 'A mangueira vaza no chão: quem cruza ela anda devagar por 2 s',
    aplicar: (f) => {
      f.regras.add('vazamento');
      f.jato.vazamento = true;
    },
  },
  {
    id: 'enchente', nome: 'Enchente', familia: 'regador', raridade: 'lendario', soPara: ['mangueira'],
    icone: '🚒', texto: 'A cada 25 s, 3 s de jatão que atravessa a fila inteira',
    aplicar: (f) => {
      f.regras.add('enchente');
      f.jato.enchente = true;
    },
  },
];

// ============================================================== JARDINEIRO
// "eu me viro melhor" — você: velocidade, coleta, o corpo

const JARDINEIRO: CartaDoJardim[] = [
  ...serie('passo', 2, {
    familia: 'jardineiro', raridade: 'comum', icone: '👟',
    nome: 'Passo leve', texto: 'Você anda 12% mais rápido',
  }, (f) => {
    f.velocidade *= 1.12;
  }),
  {
    id: 'bolso-furado', nome: 'Bolso furado', familia: 'jardineiro', raridade: 'comum',
    icone: '🫧', texto: 'As gotas vêm até você de 2,5 m de distância',
    aplicar: (f) => {
      f.coleta = Math.max(f.coleta, 2.5);
    },
  },
  {
    id: 'bota', nome: 'Bota de jardim', familia: 'jardineiro', raridade: 'comum',
    icone: '🥾', texto: 'Terra de canteiro não te segura mais',
    aplicar: (f) => f.regras.add('bota'),
  },
  {
    id: 'folego', nome: 'Fôlego', familia: 'jardineiro', raridade: 'incomum', naoServe: ['mangueira'],
    icone: '🫁', texto: 'O tanque enche enquanto você anda, e não só no tonel',
    aplicar: (f) => f.regras.add('enche-andando'),
  },
  {
    id: 'chinelada', nome: 'Chinelada', familia: 'jardineiro', raridade: 'incomum',
    icone: '🩴', texto: 'Encostar num bicho empurra ele 2 m para trás',
    aplicar: (f) => f.regras.add('empurrao'),
  },
  {
    id: 'grito', nome: 'Grito', familia: 'jardineiro', raridade: 'raro',
    icone: '📣', texto: 'Uma vez por onda, tudo num raio de 4 m recua até a porta',
    aplicar: (f) => f.regras.add('grito'),
  },
  {
    id: 'dedo-verde', nome: 'Dedo verde', familia: 'jardineiro', raridade: 'raro',
    icone: '🌱', texto: 'Canteiro machucado se recupera um pouco entre as ondas',
    aplicar: (f) => f.regras.add('dedo-verde'),
  },
  /**
   * OS DOIS NA FRENTE — a lendária da dupla.
   *
   * Na rodada, quem você não controla fica LÁ ATRÁS com a Josefina (pedido do
   * Renan). Esta carta é a exceção que se ganha: o parceiro pega o segundo
   * regador e vem regar do seu lado pelo resto da rodada. Ela substitui as
   * duas cartas do plano antigo que só faziam sentido com os dois na frente
   * desde o começo ("Mãos dadas" e "Regador do Renan").
   */
  {
    id: 'os-dois-na-frente', nome: 'Os dois na frente', familia: 'jardineiro',
    raridade: 'lendario', icone: '💞',
    texto: 'Quem ficou lá atrás pega o outro regador e vem regar do seu lado',
    exclui: ['la-de-tras', 'troca-de-turno'],
    aplicar: (f) => f.regras.add('os-dois-na-frente'),
  },
  // --- do banco de ideias (§6 do plano)
  {
    id: 'chapeu-de-palha', nome: 'Chapéu de palha', familia: 'jardineiro', raridade: 'comum', naoServe: ['mangueira'],
    icone: '👒', texto: 'Cada jato gasta 15% menos água',
    aplicar: (f) => {
      f.gastoPorJato *= 0.85;
    },
  },
  {
    id: 'descanso', nome: 'Descanso na sombra', familia: 'jardineiro', raridade: 'comum', naoServe: ['mangueira'],
    icone: '⛱️', texto: 'Parado, o tanque enche 50% mais rápido',
    aplicar: (f) => {
      f.recargaParado *= 1.5;
    },
  },
  {
    id: 'pique', nome: 'Pique', familia: 'jardineiro', raridade: 'incomum',
    icone: '🏃', texto: 'Andar 2 s sem parar dá +30% de velocidade, até você parar',
    aplicar: (f) => f.regras.add('pique'),
  },
  {
    id: 'assobio', nome: 'Assobio', familia: 'jardineiro', raridade: 'incomum',
    icone: '🎶', texto: 'A cada 12 s o bicho mais perto vira e anda 2 s para o outro lado',
    aplicar: (f) => f.regras.add('assobio'),
  },
  /*
   * PÉ NA POÇA só sorteia com a Poça na mão: sem ela não existe poça nenhuma
   * no chão, e a carta seria escolhida para não fazer nada.
   */
  {
    id: 'pe-na-poca', nome: 'Pé na poça', familia: 'jardineiro', raridade: 'incomum',
    icone: '🦶', texto: 'Pisar numa poça te dá um impulso de velocidade',
    requer: ['poca'],
    aplicar: (f) => f.regras.add('pe-na-poca'),
  },
  {
    id: 'olho-de-jardineira', nome: 'Olho de jardineira', familia: 'jardineiro', raridade: 'incomum',
    icone: '👀', texto: 'Você vê para qual canteiro cada bicho está indo',
    aplicar: (f) => f.regras.add('olho-de-jardineira'),
  },
  /*
   * TROCA DE TURNO não convive com Os dois na frente: com os dois regando lá
   * na frente, não sobra ninguém lá atrás para trocar.
   */
  {
    id: 'troca-de-turno', nome: 'Troca de turno', familia: 'jardineiro', raridade: 'incomum',
    icone: '🔄', texto: 'O T troca quem rega e quem fica atrás; quem entra vem de tanque cheio',
    exclui: ['os-dois-na-frente'],
    aplicar: (f) => f.regras.add('troca-de-turno'),
  },
  {
    id: 'coracaozinho', nome: 'Coraçãozinho', familia: 'jardineiro', raridade: 'incomum',
    icone: '💗', texto: 'A cada 20 gotas sobe um coração, e os bichos perto param 1 s',
    aplicar: (f) => f.regras.add('coracaozinho'),
  },
  {
    id: 'ima-de-gota', nome: 'Ímã de gota', familia: 'jardineiro', raridade: 'raro',
    icone: '🧲', texto: 'Ao subir de nível, todas as gotas do chão voam até você',
    aplicar: (f) => f.regras.add('ima-de-gota'),
  },
  {
    id: 'sorte-de-principiante', nome: 'Sorte de principiante', familia: 'jardineiro', raridade: 'raro',
    icone: '🍀', texto: 'A próxima tela de cartas vem com tudo uma raridade acima',
    aplicar: (f) => f.regras.add('sorte-de-principiante'),
  },
  {
    id: 'pulinho', nome: 'Pulinho', familia: 'jardineiro', raridade: 'raro',
    icone: '🤸', texto: 'Encostar num bicho pequeno te faz pular por cima dele',
    aplicar: (f) => f.regras.add('pulinho'),
  },
  {
    id: 'bis', nome: 'Bis', familia: 'jardineiro', raridade: 'raro',
    icone: '🔁', texto: 'A próxima carta de série que sair já vem um degrau acima',
    aplicar: (f) => f.regras.add('bis'),
  },
  {
    id: 'danca-da-chuva', nome: 'Dança da chuva', familia: 'jardineiro', raridade: 'lendario',
    icone: '💃', texto: 'Ficar parado 3 s faz chover 5 s em volta de você',
    aplicar: (f) => {
      f.regras.add('danca-da-chuva');
      f.jato.dancaDaChuva = true;
    },
  },
  // só da MANGUEIRA: o carretel que desenrola sozinho
  {
    id: 'carretel', nome: 'Carretel', familia: 'jardineiro', raridade: 'comum', soPara: ['mangueira'],
    icone: '🧵', texto: 'A mangueira desenrola sozinha: você anda 10% mais rápido',
    aplicar: (f) => {
      f.velocidade *= 1.1;
    },
  },
  // só da PISTOLA: a pistola no coldre deixa as mãos livres para correr
  {
    id: 'coldre', nome: 'Coldre', familia: 'jardineiro', raridade: 'comum', soPara: ['pistola'],
    icone: '🤠', texto: 'A pistola vai no coldre: você anda 10% mais rápido',
    aplicar: (f) => {
      f.velocidade *= 1.1;
    },
  },
  // só do BORRIFADOR: o frasco numa cordinha de pulso, que não escorrega da mão
  {
    id: 'cordinha-de-pulso', nome: 'Cordinha de pulso', familia: 'jardineiro', raridade: 'comum', soPara: ['borrifador'],
    icone: '🎀', texto: 'O borrifador vai numa cordinha: você anda 10% mais rápido',
    aplicar: (f) => {
      f.velocidade *= 1.1;
      f.estilo.cordinha = true;
    },
  },
  // só do REGADOR: a alça com espuma, que a mão não sente o peso da lata
  {
    id: 'alca-acolchoada', nome: 'Alça acolchoada', familia: 'jardineiro', raridade: 'comum', soPara: ['regador'],
    icone: '🧽', texto: 'A alça ganha espuma: carregando a lata você anda 10% mais rápido',
    aplicar: (f) => {
      f.velocidade *= 1.1;
      f.estilo.alcaAcolchoada = true;
    },
  },
];

// ================================================================== JARDIM
// "o campo joga a meu favor" — a estufa: canteiro, tonel, portas, a Josefina

const JARDIM: CartaDoJardim[] = [
  ...serie('terra', 2, {
    familia: 'jardim', raridade: 'comum', icone: '🟫',
    nome: 'Terra adubada', texto: 'Os canteiros aguentam 25% mais mordida',
  }, (f) => {
    f.vidaDoCanteiro *= 1.25;
  }),
  {
    id: 'segundo-tonel', nome: 'Segundo tonel', familia: 'jardim', raridade: 'comum', naoServe: ['mangueira'],
    icone: '🛢️', texto: 'Nasce um tonel do outro lado: a viagem pela água encurta',
    aplicar: (f) => f.regras.add('segundo-tonel'),
  },
  {
    id: 'poca', nome: 'Poça', familia: 'jardim', raridade: 'incomum',
    icone: '🫗', texto: 'Onde o jato cai fica escorregadio por 4 s, e o bicho anda devagar',
    aplicar: (f) => {
      f.regras.add('poca');
      f.jato.poca = true;
    },
  },
  {
    id: 'la-de-tras', nome: 'Lá de trás', familia: 'jardim', raridade: 'incomum',
    icone: '🧑‍🌾', texto: 'Quem ficou com a Josefina rega o canteiro mais perto dele',
    exclui: ['os-dois-na-frente'],
    aplicar: (f) => f.regras.add('la-de-tras'),
  },
  {
    id: 'espantalho', nome: 'Espantalho', familia: 'jardim', raridade: 'raro',
    icone: '🧍', texto: 'Um espantalho puxa a atenção dos bichos por 20 s',
    aplicar: (f) => f.regras.add('espantalho'),
  },
  {
    id: 'josefina-ajuda', nome: 'A Josefina ajuda', familia: 'jardim', raridade: 'raro',
    icone: '🐢', texto: 'Uma vez por onda ela molha um canteiro por conta dela',
    aplicar: (f) => f.regras.add('josefina-ajuda'),
  },
  {
    id: 'portao-emperrado', nome: 'Portão emperrado', familia: 'jardim', raridade: 'raro',
    icone: '🚧', texto: 'Uma das três portas fecha pelo resto da rodada',
    aplicar: (f) => f.regras.add('portao-emperrado'),
  },
  {
    id: 'cerca-viva', nome: 'Cerca viva', familia: 'jardim', raridade: 'lendario',
    icone: '🌳', texto: 'Um canteiro ganha uma cerca que leva as mordidas e brota a cada onda',
    aplicar: (f) => f.regras.add('cerca-viva'),
  },
  {
    id: 'chuva', nome: 'Chuva', familia: 'jardim', raridade: 'lendario',
    icone: '🌧️', texto: 'A estufa inteira leva um jato, de uma vez, a cada 30 s',
    aplicar: (f) => {
      f.regras.add('chuva');
      f.estilo.nuvem = true;
      f.jato.chuva = true;
    },
  },
  // --- do banco de ideias (§6 do plano)
  ...serie('compostagem', 2, {
    familia: 'jardim', raridade: 'comum', icone: '♻️',
    nome: 'Compostagem', texto: 'Bicho espantado devolve 2% de vida ao canteiro mais perto',
  }, (f) => {
    // era 5%: somada às ondas de 100 bichos, curava tudo (teto na rodada.ts)
    f.compostagem += 0.02;
  }),
  {
    id: 'sino-da-porta', nome: 'Sino da porta', familia: 'jardim', raridade: 'comum',
    icone: '🔔', texto: 'Um sininho toca quando um bicho passa por um portão',
    aplicar: (f) => f.regras.add('sino-da-porta'),
  },
  {
    id: 'girassol-vigia', nome: 'Girassol vigia', familia: 'jardim', raridade: 'incomum',
    icone: '🌻', texto: 'Os girassóis viram para o portão de onde vem o próximo bicho',
    aplicar: (f) => f.regras.add('girassol-vigia'),
  },
  {
    id: 'cerquinha', nome: 'Cerquinha', familia: 'jardim', raridade: 'incomum',
    icone: '🪵', texto: 'Nasce uma cerca baixa no terreiro que os bichos têm que contornar',
    aplicar: (f) => f.regras.add('cerquinha'),
  },
  {
    id: 'toldo', nome: 'Toldo', familia: 'jardim', raridade: 'incomum',
    icone: '⛺', texto: 'Um canteiro à sua escolha aguenta 50% mais',
    aplicar: (f) => f.regras.add('toldo'),
  },
  {
    id: 'canteiro-de-pimenta', nome: 'Canteiro de pimenta', familia: 'jardim', raridade: 'raro',
    icone: '🌶️', texto: 'Quem morde o canteiro escolhido sai correndo e solta 2 gotas',
    aplicar: (f) => f.regras.add('canteiro-de-pimenta'),
  },
  {
    id: 'aspersor', nome: 'Aspersor', familia: 'jardim', raridade: 'raro',
    icone: '🚿', texto: 'Um aspersor no meio do terreiro molha num raio de 2,5 m a cada 3 s',
    aplicar: (f) => f.regras.add('aspersor'),
  },
  {
    id: 'sementeira', nome: 'Sementeira', familia: 'jardim', raridade: 'raro',
    icone: '🌾', texto: 'Canteiro comido até o fim volta com meia vida na onda seguinte',
    aplicar: (f) => f.regras.add('sementeira'),
  },
  {
    id: 'planta-carnivora', nome: 'Planta carnívora', familia: 'jardim', raridade: 'lendario',
    icone: '🌺', texto: 'Um canteiro vira dioneia: morde quem encostar, e recarrega em 15 s',
    aplicar: (f) => f.regras.add('planta-carnivora'),
  },
  {
    id: 'estufa-trancada', nome: 'Estufa trancada', familia: 'jardim', raridade: 'lendario',
    icone: '🔒', texto: 'Os portões seguram os bichos 10 s no começo de cada onda',
    aplicar: (f) => f.regras.add('estufa-trancada'),
  },
  // --- os do clube vêm ajudar: AJUDANTES, nunca alvo (gente não leva jato)
  {
    id: 'apito-da-gina', nome: 'Apito da Gina', familia: 'jardim', raridade: 'incomum',
    icone: '📯', texto: 'Uma vez por onda a Gina apita da porta e todo bicho congela 1,5 s',
    exclui: ['chama-gina'],
    aplicar: (f) => f.regras.add('apito-da-gina'),
  },
  {
    id: 'picole-do-mano', nome: 'Picolé do Mano', familia: 'jardim', raridade: 'incomum',
    icone: '🍦', texto: 'No fim da onda cai um picolé: enche o tanque e acelera por 10 s',
    aplicar: (f) => f.regras.add('picole-do-mano'),
  },
  {
    id: 'noel-avisa', nome: 'O Noel avisa', familia: 'jardim', raridade: 'incomum',
    icone: '🗣️', texto: 'O Noel sobe no muro e grita qual portão abre na próxima onda',
    aplicar: (f) => f.regras.add('noel-avisa'),
  },
  /*
   * O JEAN-LUC NO TONEL deixa o refil instantâneo, e aí o Refil rápido vira
   * carta morta: as duas se excluem (e a série inteira do refil some junto,
   * porque a II e a III pedem a I).
   */
  {
    id: 'jean-luc-no-tonel', nome: 'O Jean-Luc no tonel', familia: 'jardim', raridade: 'incomum', naoServe: ['mangueira'],
    icone: '🦆', texto: 'O pato fica no tonel, e encher o tanque ali é na hora',
    exclui: ['refil-1', 'refil-2'],
    aplicar: (f) => f.regras.add('jean-luc-no-tonel'),
  },
  {
    id: 'capy-salva-vidas', nome: 'O Capy salva-vidas', familia: 'jardim', raridade: 'raro',
    icone: '🛟', texto: 'Uma vez por onda o Capy dá um jato longo pelo corredor do meio',
    exclui: ['chama-capy'],
    aplicar: (f) => f.regras.add('capy-salva-vidas'),
  },
  {
    id: 'walter-de-plantao', nome: 'O Walter de plantão', familia: 'jardim', raridade: 'raro',
    icone: '🐕', texto: 'O Walter entra e, a cada 12 s, corre latindo pro bicho perto da horta',
    exclui: ['chama-walter'],
    // ele entra pela porta como os chamados: carta com o nome dele traz ele
    chama: ['walter'],
    aplicar: (f) => f.regras.add('walter-de-plantao'),
  },
  {
    id: 'adubo-do-noel', nome: 'Adubo do Noel', familia: 'jardim', raridade: 'raro',
    icone: '🍂', texto: 'Canteiro que você rega fica mais forte até o fim da onda',
    aplicar: (f) => f.regras.add('adubo-do-noel'),
  },
  /*
   * OS CHAMADOS — pedido do Renan: cartas de raridade alta que CHAMAM alguém
   * do clube para dentro da estufa, e ele ajuda por um tempo. Diferente das
   * de cima (um efeito de longe, sem ninguém entrar), aqui o bicho aparece no
   * terreiro. Cada chamado exclui a carta do mesmo bicho que já fazia algo
   * na porta ou no corredor: ele não está em dois lugares ao mesmo tempo.
   *
   * CADA UM TEM UMA FUNÇÃO, e age SOZINHO (decisão do Renan): ninguém aperta
   * botão para chamar. O gatilho de cada um é a situação em que ele é bom —
   * o Capy ATACA (rega onde mordem), a Gina BARRA (tranca um portão), o
   * Walter PROTEGE (espanta quem está num canteiro machucado, sem molhar e
   * sem gota) e o Noel CATA (as gotas do chão). Uma vez por onda cada um.
   */
  {
    id: 'chama-capy', nome: 'Chamar o Capy', familia: 'jardim', raridade: 'raro',
    icone: '🕶️', texto: 'Mordeu um canteiro? O Capy corre até lá e rega junto por 20 s',
    exclui: ['capy-salva-vidas'],
    chama: ['capy'],
    aplicar: (f) => f.regras.add('chama-capy'),
  },
  {
    id: 'chama-gina', nome: 'Chamar a Gina', familia: 'jardim', raridade: 'raro',
    icone: '🦒', texto: 'No começo da onda a Gina tranca 20 s o portão que vem mais cheio',
    exclui: ['apito-da-gina'],
    chama: ['gina'],
    aplicar: (f) => f.regras.add('chama-gina'),
  },
  {
    id: 'chama-walter', nome: 'Chamar o Walter', familia: 'jardim', raridade: 'raro',
    icone: '🐶', texto: 'Canteiro pela metade? O Walter corre latindo e espanta quem está ali',
    exclui: ['walter-de-plantao'],
    chama: ['walter'],
    aplicar: (f) => f.regras.add('chama-walter'),
  },
  {
    id: 'chama-noel', nome: 'Chamar o Noel', familia: 'jardim', raridade: 'raro',
    icone: '🦃', texto: 'Com 8 gotas no chão, o Noel passa 20 s catando e trazendo pra você',
    chama: ['noel'],
    aplicar: (f) => f.regras.add('chama-noel'),
  },
  {
    id: 'mutirao-do-clube', nome: 'Mutirão do clube', familia: 'jardim', raridade: 'lendario',
    icone: '🎉', texto: 'Quando a chefe chega, Capy, Gina, Walter e Noel ajudam por 30 s',
    chama: ['gina', 'capy', 'noel', 'walter'],
    aplicar: (f) => f.regras.add('mutirao-do-clube'),
  },
  // só do BORRIFADOR: névoa é o que se põe em folha — a planta orvalhada aguenta
  {
    id: 'folha-orvalhada', nome: 'Folha orvalhada', familia: 'jardim', raridade: 'incomum', soPara: ['borrifador'],
    icone: '🍃', texto: 'Canteiro que a névoa toca fica orvalhado 2 s: a mordida tira metade',
    aplicar: (f) => {
      f.regras.add('folha-orvalhada');
    },
  },
  // só do REGADOR: é regador, e rega — o jato que passa pela horta cuida dela
  {
    id: 'rega-de-verdade', nome: 'Rega de verdade', familia: 'jardim', raridade: 'incomum', soPara: ['regador'],
    icone: '🌷', texto: 'O jato que passa por um canteiro machucado rega ele também',
    aplicar: (f) => {
      f.regras.add('rega-de-verdade');
    },
  },
  // só da MANGUEIRA: a mangueira deitada rega o que encosta
  {
    id: 'mangueira-rega', nome: 'Mangueira que rega', familia: 'jardim', raridade: 'incomum', soPara: ['mangueira'],
    icone: '🌿', texto: 'Canteiro por onde a mangueira passa sara devagar',
    aplicar: (f) => {
      f.regras.add('mangueira-rega');
    },
  },
];

/** O baralho inteiro, na ordem das famílias. */
export const CARTAS: readonly CartaDoJardim[] = [...REGADOR, ...JARDINEIRO, ...JARDIM];

/**
 * AS CARTAS DE CONSOLO — o que aparece quando o baralho acaba.
 *
 * Uma rodada boa pode chegar num nível em que sobram menos de três cartas que
 * você ainda não tem. Tela de escolha com uma carta só não é escolha, e tela
 * vazia é um travamento: então os buracos se enchem com isto. Elas podem sair
 * quantas vezes for, NÃO entram na mão e não contam para o estágio do regador.
 */
/*
 * SÃO TRÊS, e não menos: com o baralho vazio a tela é SÓ consolo, e ela
 * sempre mostra três cartas.
 */
export const CONSOLOS: readonly CartaDoJardim[] = [
  {
    id: 'gole-de-agua', nome: 'Gole d’água', familia: 'regador', raridade: 'comum',
    icone: '🥤', texto: 'Enche o tanque agora', repetivel: true, naHora: 'encher-tanque',
    aplicar: () => {},
  },
  {
    id: 'muda-de-reserva', nome: 'Muda de reserva', familia: 'jardim', raridade: 'comum',
    icone: '🪴', texto: 'O canteiro mais comido ganha uma muda nova', repetivel: true,
    naHora: 'curar-canteiro',
    aplicar: () => {},
  },
  {
    id: 'susto', nome: 'Susto', familia: 'jardineiro', raridade: 'comum',
    icone: '💥', texto: 'Todo bicho perto de você recua uns passos', repetivel: true,
    naHora: 'susto',
    aplicar: () => {},
  },
];

/** Acha uma carta pelo id, no baralho ou nos consolos. */
export function cartaPorId(id: string): CartaDoJardim | undefined {
  return CARTAS.find((c) => c.id === id) ?? CONSOLOS.find((c) => c.id === id);
}
