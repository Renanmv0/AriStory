import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';

/**
 * O REGADOR — a arma do minigame do jardim, e a peca mais importante do kit.
 *
 * Ela tem arquivo proprio, e nao uma funcao perdida em `props.ts`, por um
 * motivo que e de projeto: **o regador MUDA DE CARA enquanto se joga**. Cada
 * carta que mexe nele (`docs/MINIGAME-JARDIM.md` §6) mexe tambem na peca que
 * esta na mao — o bico estica de verdade, o crivo alarga, o corpo engorda.
 * Nada de icone de buff no canto da tela: neste projeto todo modelo e
 * geometria procedural, entao o upgrade aparece no objeto.
 *
 * Por isso ela nao e uma peca, e sim uma RECEITA: `regadorDeJardim(estilo)`
 * recebe o que a rodada acumulou e devolve o regador daquele momento.
 *
 * ======================================================== COMO ELE E DESENHADO
 *
 * O que faz uma lata de agua ler como regador, na ordem que importa:
 *
 * 1. **O BICO SAI DE BAIXO E SOBE.** Regador de verdade puxa a agua do FUNDO —
 *    e por isso que ele despeja inclinando de leve, e nao virando de cabeca
 *    para baixo. Bico saindo do meio do corpo lê como bule.
 * 2. **O CRIVO E UM DISCO COM FUROS**, e nao uma pontinha. Os furos sao
 *    desenhados (discos escuros na face), porque e o detalhe que diz "isto
 *    espalha agua" em vez de "isto e um cano".
 * 3. **DUAS ALCAS, e elas fazem coisas diferentes.** A de cima e por onde se
 *    CARREGA, e e o arco que da a silhueta; a de tras e por onde se INCLINA. Um
 *    regador com uma alca so parece um balde com cano.
 * 4. **A BOCA E ABERTA, e da para ver a agua.** Uma tampa fechada economizaria
 *    duas malhas e tiraria a unica cor fria da peca.
 *
 * Tudo nasce com a base em `y = 0` e o BICO APONTANDO PARA `+Z`, que e o
 * contrato do kit e tambem o que faz a agua sair na direcao em que a pessoa
 * esta olhando quando ela segura a peca.
 */

/**
 * O QUE A RODADA FEZ COM O REGADOR.
 *
 * Os tres primeiros campos sao CONTINUOS (0 a 1) porque as comuns vem em
 * SERIE: "Bico mais longo", "II" e "III" tem que esticar tres vezes, e nao
 * ligar um interruptor (`minigames/jardim/cartas.ts`). Os outros sao cartas
 * unicas, e por isso sao booleanos.
 */
export interface EstiloDeRegador {
  /**
   * 0 = a lata galvanizada que a Josefina empresta, 1 = a reforcada de latao,
   * 2 = a de competicao. Quem escolhe e o numero de cartas de REGADOR pegadas
   * (0-2, 3-5, 6+), e nao uma carta especifica.
   */
  estagio: 0 | 1 | 2;
  /** "Bico mais longo": 0 a 1 */
  bico: number;
  /** "Leque aberto": 0 a 1 — o crivo alarga e ganha mais furos */
  crivo: number;
  /** "Tanque maior": 0 a 1 — o corpo engorda e a alca sobe junto */
  tanque: number;
  /** "Jato firme": uma ponteira de latao antes do crivo */
  ponteira: boolean;
  /** "Braco solto": a alca de cima vira um cabo de madeira lixado */
  caboDeMadeira: boolean;
  /** "Segundo bico": nasce um bico atras, virado para tras */
  segundoBico: boolean;
  /** "Mangueira": uma mangueira enrolada pendurada no corpo */
  mangueira: boolean;
  /** "Orvalho": um respiro de cobre no topo */
  respiro: boolean;
  /** "Chuva": uma nuvenzinha flutuando um palmo acima da peca */
  nuvem: boolean;
  /** "Crivo de flor" (so do regador): 0 a 1 — petalas cor-de-rosa em volta do crivo */
  crivoDeFlor: number;
  /** "Alca acolchoada" (so do regador): uma luva de espuma na alca de cima */
  alcaAcolchoada: boolean;
  /** "Nevoa larga" (so do borrifador): 0 a 1 — a boca do bico vira uma flor de furos */
  nevoaLarga: number;
  /** "Concentrado" (so do borrifador): 0 a 1 — a agua do frasco sobe e fica mais azul */
  concentrado: number;
  /** "Cordinha de pulso" (so do borrifador): um laco amarelo com uma conta rosa na rosca */
  cordinha: boolean;
  /**
   * A ARMA da rodada (`minigames/jardim/armas.ts`): sem isto, ou `regador`, a
   * mao carrega o regador; `mangueira` troca pelo esguicho, `pistola` pela
   * pistola d'agua e `borrifador` pelo borrifador.
   */
  arma?: string;
}

const PADRAO: EstiloDeRegador = {
  estagio: 0,
  bico: 0,
  crivo: 0,
  tanque: 0,
  ponteira: false,
  caboDeMadeira: false,
  segundoBico: false,
  mangueira: false,
  respiro: false,
  nuvem: false,
  crivoDeFlor: 0,
  alcaAcolchoada: false,
  nevoaLarga: 0,
  concentrado: 0,
  cordinha: false,
};

/**
 * AS CORES DE CADA ESTAGIO.
 *
 * O `metal` e a ferragem — aro, alca, bico e crivo —, e e ele que conta a
 * evolucao: a lata emprestada e cinza inteira, a reforcada ganha latao nas
 * ferragens e a de competicao troca tambem o corpo, por esmalte verde. Trocar
 * so o corpo faria os tres parecerem tres objetos diferentes; trocar so a
 * ferragem nao daria salto nenhum no ultimo.
 */
const ESTAGIOS = [
  { corpo: P.regadorLata, escuro: P.regadorLataEscura, metal: P.regadorLataEscura },
  { corpo: P.regadorLata, escuro: P.regadorLataEscura, metal: P.regadorLatao },
  { corpo: P.regadorEsmalte, escuro: P.regadorEsmalteEscuro, metal: P.regadorLatao },
] as const;

/** Um cano reto ao longo de `+Z`, que e como todo pedaco de bico e feito. */
function cano(raio: number, comprimento: number, material: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio * 1.06, comprimento, 8), material);
  // a CylinderGeometry nasce ao longo de +Y; esta e a unica conta que a deita
  m.rotation.x = Math.PI / 2;
  m.position.z = comprimento / 2;
  return m;
}

/**
 * O REGADOR de um dado momento da rodada.
 *
 * @param estilo o que a rodada acumulou; o que faltar vem do `PADRAO`
 * @param escala 1 e o tamanho de mao — 42 cm de altura com a alca
 */
export function regadorDeJardim(
  estilo: Partial<EstiloDeRegador> = {}, escala = 1,
): THREE.Group {
  const e = { ...PADRAO, ...estilo };
  const s = escala;
  const cores = ESTAGIOS[Math.max(0, Math.min(2, e.estagio))];

  const g = new THREE.Group();
  g.userData.peca = 'regador';
  g.userData.estilo = { ...e };

  const chapa = toon(cores.corpo);
  const chapaEscura = toon(cores.escuro);
  const metal = toon(cores.metal);

  /* ------------------------------------------------------------- o corpo
   * Um tronco de cone com a BASE MAIS LARGA que a boca: e o que faz a lata
   * parecer que fica de pe sozinha, e e o formato de todo regador de jardim.
   * "Tanque maior" engorda o raio e sobe a altura junto — so engordar deixaria
   * a peca com cara de panela.
   */
  const raioBase = (0.135 + e.tanque * 0.035) * s;
  const raioBoca = (0.112 + e.tanque * 0.03) * s;
  const alturaCorpo = (0.24 + e.tanque * 0.05) * s;

  const corpo = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBoca, raioBase, alturaCorpo, 14), chapa,
  );
  corpo.position.y = alturaCorpo / 2 + 0.012 * s;
  g.add(corpo);

  // o pe: um anel baixo e um tico mais largo que a base. Sem ele a lata parece
  // afundada no chao, e e a peca que some primeiro numa camera de cima
  const pe = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBase * 1.04, raioBase * 1.02, 0.026 * s, 14), chapaEscura,
  );
  pe.position.y = 0.013 * s;
  g.add(pe);

  /**
   * A COSTURA, na barriga. Ela e o unico detalhe horizontal da peca, e e o que
   * impede o corpo de ler como um copo liso: lata de verdade e duas chapas
   * rebitadas uma na outra.
   */
  const alturaCostura = alturaCorpo * 0.52;
  const raioNaCostura = raioBase + (raioBoca - raioBase) * (alturaCostura / alturaCorpo);
  const costura = new THREE.Mesh(
    new THREE.CylinderGeometry(raioNaCostura * 1.035, raioNaCostura * 1.045, 0.022 * s, 14),
    chapaEscura,
  );
  costura.position.y = alturaCostura;
  g.add(costura);

  // quatro rebites na costura, e nao oito: a esta distancia de camera o quinto
  // rebite nao aparece, e cada um e uma malha a mais numa peca que fica na mao
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const rebite = new THREE.Mesh(new THREE.SphereGeometry(0.011 * s, 5, 4), metal);
    rebite.position.set(
      Math.sin(a) * raioNaCostura * 1.05, alturaCostura, Math.cos(a) * raioNaCostura * 1.05,
    );
    g.add(rebite);
  }

  /**
   * A BOCA ABERTA. O aro de cima e um toro (a borda dobrada da chapa) e, um
   * dedo abaixo dele, o disco de AGUA — a unica cor fria da peca, e a que faz
   * o regador parecer cheio numa camera que olha de cima.
   */
  const alturaBoca = alturaCorpo + 0.012 * s;
  const aro = new THREE.Mesh(
    new THREE.TorusGeometry(raioBoca, 0.014 * s, 5, 16), metal,
  );
  aro.position.y = alturaBoca;
  aro.rotation.x = Math.PI / 2;
  g.add(aro);

  const agua = new THREE.Mesh(
    new THREE.CircleGeometry(raioBoca * 0.94, 14), toon(P.regadorAgua),
  );
  agua.position.y = alturaBoca - 0.03 * s;
  agua.rotation.x = -Math.PI / 2;
  g.add(agua);

  /* --------------------------------------------------------------- o bico
   * ELE SAI DE BAIXO. Regador de verdade puxa a agua do fundo do tanque, e e
   * por isso que se rega inclinando de leve em vez de virar a lata. Bico
   * saindo do meio do corpo lê como bule.
   */
  const bico = new THREE.Group();
  bico.position.set(0, 0.05 * s, raioBase * 0.78);
  // NEGATIVO levanta: girando em X, o vetor +Z vai para (0, -sen, cos)
  bico.rotation.x = -0.62;
  g.add(bico);

  const comprimentoBico = (0.3 + e.bico * 0.22) * s;
  bico.add(cano(0.034 * s, comprimentoBico * 0.55, metal));
  const segundo = cano(0.029 * s, comprimentoBico * 0.5, metal);
  segundo.position.z = comprimentoBico * 0.53;
  bico.add(segundo);

  const pontaDoBico = comprimentoBico * 1.02;

  // "Jato firme": uma ponteira de latao logo antes do crivo. Ela e curta e
  // GROSSA — anel fino ali vira uma linha e some
  if (e.ponteira) {
    const ponteira = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042 * s, 0.036 * s, 0.045 * s, 8), toon(P.regadorLatao),
    );
    ponteira.rotation.x = Math.PI / 2;
    ponteira.position.z = pontaDoBico - 0.02 * s;
    bico.add(ponteira);
  }

  /**
   * O CRIVO: um disco chato na ponta, com os furos DESENHADOS na face.
   *
   * Os furos sao o detalhe que diz "isto espalha agua"; sem eles a peca termina
   * num cano e lê como mangueira. Eles ficam num anel so, e nao espalhados: a
   * esta distancia de camera um anel lê como padrao e um punhado lê como
   * sujeira.
   */
  const raioCrivo = (0.058 + e.crivo * 0.03) * s;
  const crivo = new THREE.Mesh(
    new THREE.CylinderGeometry(raioCrivo, raioCrivo * 0.8, 0.036 * s, 12), metal,
  );
  crivo.rotation.x = Math.PI / 2;
  crivo.position.z = pontaDoBico + 0.018 * s;
  bico.add(crivo);

  /**
   * A FACE DO CRIVO NAO SEGUE A COR DO ESTAGIO, e isso foi conserto de foto.
   *
   * Ela era `cores.escuro`, entao no estagio de competicao ficava verde escuro
   * com os furos em cinza escuro por cima: na tela os furos sumiam e a ponta
   * do bico virava um disco liso. O par cinza-medio / quase-preto e o unico
   * que garante contraste nos tres estagios, e o crivo furado e justamente o
   * detalhe que diz "isto espalha agua".
   */
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(raioCrivo * 0.92, 12), toon(P.regadorLataEscura),
  );
  face.position.z = pontaDoBico + 0.037 * s;
  bico.add(face);

  const furos = e.crivo > 0.5 ? 8 : 6;
  const furo = toon(P.regadorFuro);
  for (let i = 0; i < furos; i++) {
    const a = (i / furos) * Math.PI * 2;
    const f = new THREE.Mesh(new THREE.CircleGeometry(0.009 * s, 5), furo);
    f.position.set(
      Math.cos(a) * raioCrivo * 0.52, Math.sin(a) * raioCrivo * 0.52, pontaDoBico + 0.039 * s,
    );
    bico.add(f);
  }

  /**
   * "CRIVO DE FLOR" (so do regador): cinco petalas cor-de-rosa abrem em volta
   * do crivo, e o crivo furado vira o miolo da flor. Elas crescem com o degrau
   * da serie (I e II), e ficam no plano do crivo — de frente para onde a agua
   * sai, que e o lado que a camera ve quando o regador rega.
   */
  if (e.crivoDeFlor > 0) {
    const petala = toon(P.regadorPetala);
    const tamanho = (0.028 + e.crivoDeFlor * 0.016) * s;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      const p = new THREE.Mesh(new THREE.SphereGeometry(tamanho, 8, 6), petala);
      p.scale.set(1.45, 0.62, 0.3);
      p.rotation.z = a;
      const r = raioCrivo + tamanho * 0.95;
      p.position.set(Math.cos(a) * r, Math.sin(a) * r, pontaDoBico + 0.03 * s);
      bico.add(p);
    }
  }

  /**
   * "SEGUNDO BICO": o mesmo desenho virado para tras, e mais curto.
   *
   * Ele e curto de proposito — dois bicos do mesmo tamanho fazem a peca virar
   * um haltere, e o de tras e o que o jogador NAO esta olhando.
   */
  if (e.segundoBico) {
    const tras = new THREE.Group();
    tras.position.set(0, 0.055 * s, -raioBase * 0.78);
    tras.rotation.set(0.62, Math.PI, 0);
    g.add(tras);
    tras.add(cano(0.03 * s, 0.2 * s, metal));
    const crivoTras = new THREE.Mesh(
      new THREE.CylinderGeometry(raioCrivo * 0.82, raioCrivo * 0.66, 0.03 * s, 10), metal,
    );
    crivoTras.rotation.x = Math.PI / 2;
    crivoTras.position.z = 0.215 * s;
    tras.add(crivoTras);
  }

  /**
   * A ALCA DE CIMA, o arco que da a silhueta. Ela vai de um lado ao outro da
   * BOCA (e nao do corpo): e por ali que a lata se equilibra cheia.
   *
   * "Braco solto" troca ela por um cabo de madeira lixado, com dois suportes —
   * a madeira nao se dobra em arco, entao a peca muda de FORMA e nao so de cor.
   */
  /**
   * ONDE A MAO PEGA — e isso e uma medida, nao um enfeite.
   *
   * O regador e CARREGADO PENDURADO pela alca de cima (pedido do Renan, e e
   * como se carrega um de verdade), entao quem for pendurar precisa saber a que
   * altura fica a barra que a mao segura. Ela muda com a carta "Braco solto",
   * que troca o arco por um cabo reto mais alto — e sem este numero publicado a
   * peca do cabo de madeira ficaria pendurada pelo ar.
   */
  let alturaDaAlca: number;

  if (e.caboDeMadeira) {
    const madeira = toon(P.regadorMadeira);
    const cabo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.021 * s, 0.021 * s, raioBoca * 1.75, 8), madeira,
    );
    cabo.rotation.z = Math.PI / 2;
    cabo.position.y = alturaBoca + 0.105 * s;
    alturaDaAlca = cabo.position.y;
    g.add(cabo);
    // "Alca acolchoada": a luva de espuma no meio do cabo, onde a mao fecha
    if (e.alcaAcolchoada) {
      const espuma = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036 * s, 0.036 * s, raioBoca * 0.95, 10), toon(P.regadorEspuma),
      );
      espuma.rotation.z = Math.PI / 2;
      espuma.position.y = cabo.position.y;
      espuma.name = 'espuma';
      g.add(espuma);
    }
    for (const lado of [-1, 1] as const) {
      const suporte = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012 * s, 0.012 * s, 0.11 * s, 6), metal,
      );
      suporte.position.set(lado * raioBoca * 0.8, alturaBoca + 0.052 * s, 0);
      g.add(suporte);
    }
  } else {
    const alca = new THREE.Mesh(
      new THREE.TorusGeometry(raioBoca * 0.92, 0.017 * s, 6, 14, Math.PI), metal,
    );
    alca.position.y = alturaBoca;
    alca.rotation.y = Math.PI / 2;
    g.add(alca);
    /*
     * "ALCA ACOLCHOADA": um pedaco de espuma no alto do arco, onde a mao pega.
     * E um toro mais grosso que o arco, so no trecho de cima (0,9 rad),
     * girado para ficar centrado no topo.
     */
    if (e.alcaAcolchoada) {
      const trecho = 0.9;
      const suporte = new THREE.Group();
      suporte.position.y = alturaBoca;
      suporte.rotation.y = Math.PI / 2;
      g.add(suporte);
      const espuma = new THREE.Mesh(
        new THREE.TorusGeometry(raioBoca * 0.92, 0.034 * s, 6, 8, trecho), toon(P.regadorEspuma),
      );
      espuma.rotation.z = Math.PI / 2 - trecho / 2;
      espuma.name = 'espuma';
      suporte.add(espuma);
    }
    // o alto do arco, que e por onde a mao passa
    alturaDaAlca = alturaBoca + raioBoca * 0.92;
  }

  /**
   * A ALCA DE TRAS, a de inclinar. Ela e um meio-arco vertical colado na parte
   * de tras do corpo, e e o que separa o regador de um balde com cano: as duas
   * maos de quem rega ficam em lugares diferentes.
   */
  const alcaDeTras = new THREE.Mesh(
    new THREE.TorusGeometry(0.058 * s, 0.015 * s, 6, 12, Math.PI * 1.1), metal,
  );
  alcaDeTras.position.set(0, alturaCorpo * 0.72, -raioNaCostura - 0.018 * s);
  alcaDeTras.rotation.set(0, Math.PI / 2, Math.PI / 2 + 0.2);
  g.add(alcaDeTras);

  // "Orvalho": o respiro de cobre no topo, que e por onde entra o ar enquanto
  // o tanque se enche sozinho
  if (e.respiro) {
    const cobre = toon(P.regadorCobre);
    const tubo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016 * s, 0.019 * s, 0.07 * s, 8), cobre,
    );
    tubo.position.set(-raioBoca * 0.52, alturaBoca + 0.035 * s, -raioBoca * 0.3);
    g.add(tubo);
    const chapeu = new THREE.Mesh(new THREE.SphereGeometry(0.023 * s, 8, 5), cobre);
    chapeu.scale.y = 0.6;
    chapeu.position.set(-raioBoca * 0.52, alturaBoca + 0.072 * s, -raioBoca * 0.3);
    g.add(chapeu);
  }

  /**
   * "MANGUEIRA": tres voltas penduradas na lateral, e nao um toro so. Uma
   * volta unica lê como argola; tres, empilhadas e deslocadas, leem como
   * mangueira enrolada.
   */
  if (e.mangueira) {
    const borracha = toon(P.regadorEsmalteEscuro);
    for (let i = 0; i < 3; i++) {
      const volta = new THREE.Mesh(
        new THREE.TorusGeometry((0.072 - i * 0.008) * s, 0.015 * s, 5, 12), borracha,
      );
      /**
       * ELA PENDURA NO LADO `+X`, que e o lado de CA na camera isometrica.
       *
       * Pendurada em `-X` ela ficava atras do corpo em toda vista padrao: na
       * foto do regador completo simplesmente nao havia mangueira nenhuma.
       * Uma peca de 15 cm num objeto de 40 nao tapa nada vindo para a frente,
       * e do outro lado ela nao existe.
       */
      volta.position.set(raioBase + 0.02 * s, (0.13 + i * 0.012) * s, -0.01 * s);
      volta.rotation.set(0.25, Math.PI / 2, -0.18 - i * 0.1);
      g.add(volta);
    }
  }

  /**
   * "CHUVA": a nuvenzinha que flutua um palmo acima da peca. Ela e o unico
   * enfeite que NAO toca o regador, e e de proposito: a carta lendaria tem que
   * se anunciar de longe.
   */
  if (e.nuvem) {
    const nuvem = new THREE.Group();
    nuvem.position.y = alturaBoca + 0.3 * s;
    nuvem.userData.parte = 'nuvem';
    g.add(nuvem);
    for (const [dx, dy, r] of [
      [-0.055, 0, 0.05], [0, 0.018, 0.065], [0.058, -0.004, 0.046],
    ] as const) {
      const bolha = new THREE.Mesh(
        new THREE.SphereGeometry(r * s, 8, 6), toon(P.regadorLata),
      );
      bolha.scale.y = 0.72;
      bolha.position.set(dx * s, dy * s, 0);
      nuvem.add(bolha);
    }
  }

  /**
   * As partes que se mexem, publicadas para quem for animar: o `bico` e de
   * onde a agua sai (a ponta dele, em espaco local, e `pontaDoBico`), e a
   * `nuvem` boia sozinha.
   */
  g.userData.partes = { corpo, bico, pontaDoBico, alturaBoca, alturaDaAlca };
  return g;
}

/**
 * O ESGUICHO DA MANGUEIRA — a peca da mao quando a arma da rodada e a
 * mangueira (`minigames/jardim/armas.ts`). O esguicho de pistola de todo
 * quintal, em versao de brinquedo (pedido do Renan: "mais fofos… falta cor"):
 * cabo turquesa gordinho com gomos, gatilho amarelo, o ANEL CORAL do bocal com
 * as bolinhas de escolher o jato, um coracaozinho de adesivo em cada lado e a
 * borracha verde com a listra amarela saindo por baixo. A mangueira comprida,
 * do tonel ate a mao, quem desenha e a rodada.
 *
 * Publica as MESMAS `partes` do regador (`bico`, `pontaDoBico`,
 * `alturaDaAlca`), entao a mao pendura e o jato sai da ponta sem saber qual
 * peca e. `alturaDaAlca` aqui e o alto do cabo, onde a mao fecha.
 *
 * O estagio muda a ferragem como no regador (lata → latao), e o ultimo doura o
 * anel; `bico` alonga o cano — o "Esguicho de latao".
 */
export function esguichoDeMangueira(
  estilo: Partial<EstiloDeRegador> = {}, escala = 1,
): THREE.Group {
  const e = { ...PADRAO, ...estilo };
  const s = escala;
  const g = new THREE.Group();
  g.userData.peca = 'esguicho';
  g.userData.estilo = { ...e };

  const corpo = toon(P.esguichoCorpo);
  const corpoEscuro = toon(P.esguichoCorpoEscuro);
  const metal = toon(e.estagio === 0 ? P.regadorLata : P.regadorLatao);
  const amarelo = toon(P.mangueiraGatilho);
  const anelCor = toon(e.estagio === 2 ? P.regadorLatao : P.esguichoAnel, e.estagio === 2 ? { glow: 0.2 } : {});
  const borracha = toon(P.mangueiraBorracha);
  const listra = toon(P.mangueiraListra);

  // o cabo: uma capsula gordinha inclinada para tras, com tres gomos de pegada
  const cabo = new THREE.Mesh(new THREE.CapsuleGeometry(0.032 * s, 0.1 * s, 4, 10), corpo);
  cabo.position.set(0, 0.1 * s, -0.025 * s);
  cabo.rotation.x = 0.3;
  g.add(cabo);
  for (let k = 0; k < 3; k++) {
    const gomo = new THREE.Mesh(new THREE.TorusGeometry(0.032 * s, 0.007 * s, 5, 14), corpoEscuro);
    gomo.rotation.x = Math.PI / 2;
    gomo.position.y = (-0.035 + k * 0.03) * s;
    cabo.add(gomo);
  }

  // o corpo de cima, deitado para a frente: e dele que sai o cano
  const topo = new THREE.Mesh(new THREE.CapsuleGeometry(0.04 * s, 0.09 * s, 4, 12), corpo);
  topo.rotation.x = Math.PI / 2;
  topo.position.set(0, 0.19 * s, 0.015 * s);
  g.add(topo);
  // um coracaozinho de adesivo em cada lado do corpo
  for (const lado of [-1, 1] as const) {
    for (const dx of [-1, 1] as const) {
      const bolha = new THREE.Mesh(new THREE.SphereGeometry(0.011 * s, 8, 6), toon(P.flowerPink));
      bolha.scale.set(0.35, 1, 1);
      bolha.position.set(lado * 0.04 * s, 0.195 * s, (0.015 + dx * 0.008) * s);
      g.add(bolha);
    }
    const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.014 * s, 0.016 * s, 8), toon(P.flowerPink));
    ponta.rotation.x = Math.PI;
    ponta.scale.set(0.35, 1, 1);
    ponta.position.set(lado * 0.04 * s, 0.184 * s, 0.015 * s);
    g.add(ponta);
  }

  // o gatilho amarelo e o arco que protege ele
  const gatilho = new THREE.Mesh(new THREE.CapsuleGeometry(0.013 * s, 0.05 * s, 3, 8), amarelo);
  gatilho.position.set(0, 0.13 * s, 0.045 * s);
  gatilho.rotation.x = 0.4;
  g.add(gatilho);
  const guarda = new THREE.Mesh(new THREE.TorusGeometry(0.045 * s, 0.008 * s, 5, 12, Math.PI), corpoEscuro);
  guarda.rotation.set(0, -Math.PI / 2, Math.PI);
  guarda.position.set(0, 0.155 * s, 0.03 * s);
  g.add(guarda);

  // o cano, para a frente (+Z): e dele que o jato sai
  const bico = new THREE.Group();
  bico.position.set(0, 0.19 * s, 0.07 * s);
  g.add(bico);
  const comprimento = (0.1 + e.bico * 0.1) * s;
  bico.add(cano(0.019 * s, comprimento, metal));
  // o ANEL de escolher o jato, coral, com as bolinhas das posicoes
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(0.043 * s, 0.043 * s, 0.032 * s, 16), anelCor);
  anel.rotation.x = Math.PI / 2;
  anel.position.z = comprimento * 0.45;
  bico.add(anel);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(0.008 * s, 6, 5), amarelo);
    bolinha.position.set(Math.cos(a) * 0.043 * s, Math.sin(a) * 0.043 * s, comprimento * 0.45);
    bico.add(bolinha);
  }
  const bocal = new THREE.Mesh(new THREE.CylinderGeometry(0.024 * s, 0.03 * s, 0.045 * s, 12), metal);
  bocal.rotation.x = Math.PI / 2;
  bocal.position.z = comprimento + 0.02 * s;
  bico.add(bocal);
  const furo = new THREE.Mesh(new THREE.CircleGeometry(0.012 * s, 10), toon(P.regadorFuro));
  furo.position.z = comprimento + 0.043 * s;
  bico.add(furo);
  const pontaDoBico = comprimento + 0.045 * s;

  // a borracha saindo por baixo do cabo, com o engate e a listra amarela
  const engate = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * s, 0.03 * s, 0.035 * s, 12), metal);
  engate.position.set(0, 0.035 * s, -0.045 * s);
  engate.rotation.x = 0.3;
  g.add(engate);
  const rabo = new THREE.Mesh(new THREE.CylinderGeometry(0.024 * s, 0.024 * s, 0.16 * s, 10), borracha);
  rabo.position.set(0, -0.03 * s, -0.08 * s);
  rabo.rotation.x = -0.5;
  g.add(rabo);
  for (let k = 0; k < 2; k++) {
    const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.024 * s, 0.006 * s, 4, 12), listra);
    faixa.rotation.x = Math.PI / 2;
    faixa.position.y = (-0.03 + k * 0.05) * s;
    rabo.add(faixa);
  }

  const alturaDaAlca = 0.18 * s;
  g.userData.partes = { corpo: topo, bico, pontaDoBico, alturaBoca: 0.19 * s, alturaDaAlca };
  return g;
}

/**
 * O ESTAGIO pelo numero de cartas de REGADOR que a rodada pegou.
 *
 * Mora aqui, e nao no minigame, porque e uma decisao de DESENHO: quantas
 * melhorias precisam entrar para a peca valer a pena ser redesenhada. Se um dia
 * os cortes mudarem, mudam num lugar so.
 */
export function estagioDoRegador(cartasDeRegador: number): 0 | 1 | 2 {
  if (cartasDeRegador >= 6) return 2;
  if (cartasDeRegador >= 3) return 1;
  return 0;
}

/**
 * A PISTOLA D'ÁGUA — a terceira arma da estufa. Por enquanto ela so mora na
 * parede das armas (`scenes/estufa.ts`): a rodada dela ainda nao existe.
 * Brinquedo de piscina: corpo lilas gordinho, o tanque laranja em cima com a
 * tampinha amarela, o gatilho rosa, a bomba laranja embaixo do cano, a janela
 * azul da agua e tres bolhas de adesivo. Aponta para `+Z`, cabo para baixo.
 */
export function pistolaDagua(escala = 1): THREE.Group {
  const s = escala;
  const g = new THREE.Group();
  g.userData.peca = 'pistola-dagua';
  const lilas = toon(P.pistolaDagua);
  const lilasEscuro = toon(P.pistolaDaguaEscura);
  const laranja = toon(P.pistolaDaguaTanque);
  const rosa = toon(P.pistolaGatilho);
  const amarelo = toon(P.mangueiraListra);

  const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.05 * s, 0.14 * s, 4, 12), lilas);
  corpo.rotation.x = Math.PI / 2;
  corpo.position.set(0, 0.17 * s, 0);
  g.add(corpo);
  // a janela da agua: uma faixa azul no meio do corpo
  const janela = new THREE.Mesh(new THREE.CylinderGeometry(0.052 * s, 0.052 * s, 0.05 * s, 14), toon(P.regadorAgua));
  janela.rotation.x = Math.PI / 2;
  janela.position.set(0, 0.17 * s, -0.02 * s);
  g.add(janela);

  const cabo = new THREE.Mesh(new THREE.CapsuleGeometry(0.03 * s, 0.07 * s, 4, 10), lilasEscuro);
  cabo.position.set(0, 0.085 * s, -0.06 * s);
  cabo.rotation.x = 0.3;
  g.add(cabo);
  const gatilho = new THREE.Mesh(new THREE.CapsuleGeometry(0.012 * s, 0.035 * s, 3, 8), rosa);
  gatilho.position.set(0, 0.11 * s, -0.005 * s);
  gatilho.rotation.x = 0.3;
  g.add(gatilho);
  const guarda = new THREE.Mesh(new THREE.TorusGeometry(0.035 * s, 0.007 * s, 5, 12, Math.PI), lilasEscuro);
  guarda.rotation.set(0, -Math.PI / 2, Math.PI);
  guarda.position.set(0, 0.125 * s, -0.015 * s);
  g.add(guarda);

  // o cano e a ponta amarela, num grupo: é dele que o tiro sai (`partes.bico`)
  const bico = new THREE.Group();
  bico.position.set(0, 0.18 * s, 0.1 * s);
  g.add(bico);
  bico.add(cano(0.022 * s, 0.1 * s, lilasEscuro));
  const ponta = new THREE.Mesh(new THREE.CylinderGeometry(0.018 * s, 0.03 * s, 0.035 * s, 12), amarelo);
  ponta.rotation.x = Math.PI / 2;
  ponta.position.z = 0.115 * s;
  bico.add(ponta);
  const furo = new THREE.Mesh(new THREE.CircleGeometry(0.01 * s, 8), toon(P.regadorFuro));
  furo.position.z = 0.133 * s;
  bico.add(furo);
  // a bomba de puxar, embaixo do cano
  const bomba = new THREE.Mesh(new THREE.CapsuleGeometry(0.024 * s, 0.06 * s, 4, 10), laranja);
  bomba.rotation.x = Math.PI / 2;
  bomba.position.set(0, 0.13 * s, 0.13 * s);
  g.add(bomba);

  // o tanque em cima, com a tampinha
  const tanque = new THREE.Mesh(new THREE.CapsuleGeometry(0.045 * s, 0.07 * s, 4, 12), laranja);
  tanque.rotation.x = Math.PI / 2;
  tanque.position.set(0, 0.245 * s, -0.02 * s);
  g.add(tanque);
  const tampa = new THREE.Mesh(new THREE.CylinderGeometry(0.018 * s, 0.02 * s, 0.025 * s, 10), amarelo);
  tampa.position.set(0, 0.295 * s, -0.035 * s);
  g.add(tampa);

  // as bolhas de adesivo
  for (const [y, z, r] of [[0.175, 0.04, 0.012], [0.16, 0.065, 0.008], [0.19, 0.075, 0.007]] as const) {
    for (const lado of [-1, 1] as const) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(r * s, 8, 6), toon(P.metalWhite));
      b.scale.set(0.4, 1, 1);
      b.position.set(lado * 0.05 * s, y * s, z * s);
      g.add(b);
    }
  }
  /*
   * As MESMAS `partes` do regador e do esguicho: a mão pendura pelo cabo
   * (`alturaDaAlca`, o alto do cabo, logo abaixo do corpo) e o tiro sai da
   * ponta do cano (`bico` + `pontaDoBico`).
   */
  g.userData.partes = { corpo, bico, pontaDoBico: 0.135 * s, alturaBoca: 0.17 * s, alturaDaAlca: 0.12 * s };
  return g;
}

/**
 * O BORRIFADOR — a quarta arma da estufa, a da NÉVOA (`minigames/jardim/armas.ts`):
 * o frasco de borrifar planta, de ombro redondo (um torno, e nao um cilindro
 * reto), com a agua azul no fundo, o rotulo rosa com uma florzinha e duas
 * folhas, e a cabeca de gatilho menta. De pe, com a boca para `+Z`.
 *
 * NA MAO ele e segurado PELO GARGALO, que e como se segura um borrifador de
 * verdade: a mao fecha na rosca, o frasco pende embaixo do punho e a cabeca
 * fica em cima, com o bico apontando para a frente — e o dedo no gatilho
 * (`partes.gatilho`, que a rodada puxa a cada borrifada). Por isso a
 * `alturaDaAlca` aqui e a da rosca, e nao o alto de uma alca.
 *
 * As cartas SO DO BORRIFADOR mudam a peca, como as do regador mudam a lata:
 * - `nevoaLarga` (Nevoa larga, 0 a 1): o bico vira uma florzinha de furos, larga;
 * - `concentrado` (Concentrado, 0 a 1): a agua do frasco sobe e fica mais azul;
 * - `cordinha` (Cordinha de pulso): uma cordinha amarela com uma conta rosa;
 * - `tanque` (o Tanque maior generico): o frasco engorda;
 * - o `estagio` doura a rosca (latao) e, no ultimo, o gatilho tambem.
 */
export function borrifadorDeJardim(
  estilo: Partial<EstiloDeRegador> = {}, escala = 1,
): THREE.Group {
  const e = { ...PADRAO, ...estilo };
  const s = escala;
  const g = new THREE.Group();
  g.userData.peca = 'borrifador';
  g.userData.estilo = { ...e };
  // o Tanque maior engorda o frasco (mais largo do que alto: continua baixinho)
  const gordo = 1 + e.tanque * 0.18;
  const alto = 1 + e.tanque * 0.1;
  const perfil = [
    [0, 0], [0.055, 0], [0.066, 0.012], [0.068, 0.03], [0.068, 0.15],
    [0.058, 0.19], [0.03, 0.212], [0.026, 0.225], [0, 0.225],
  ].map(([x, y]) => new THREE.Vector2(x * s * (y > 0.2 ? 1 : gordo), y * s * alto));
  const frasco = new THREE.Mesh(new THREE.LatheGeometry(perfil, 16), toon(P.borrifadorFrasco));
  g.add(frasco);
  const topo = 0.225 * s * alto;
  const r = 0.07 * s * gordo;
  // a agua no fundo e o rotulo, cada um um anel um tico mais largo que o frasco.
  // O Concentrado sobe a agua e puxa ela para um azul mais fundo
  const corDaAgua = new THREE.Color(P.regadorAgua).lerp(new THREE.Color(P.borrifadorConcentrado), e.concentrado);
  const nivel = (0.045 + e.concentrado * 0.03) * s * alto;
  const agua = new THREE.Mesh(new THREE.CylinderGeometry(r, r, nivel, 16), toon(corDaAgua.getHex()));
  agua.position.y = 0.018 * s * alto + nivel / 2;
  g.add(agua);
  const rotulo = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.015, r * 1.015, 0.065 * s * alto, 16), toon(P.borrifadorRotulo));
  rotulo.position.y = 0.105 * s * alto + (e.concentrado * 0.012 * s);
  g.add(rotulo);
  // a florzinha e as folhas no rotulo, na frente (+Z)
  const flor = new THREE.Group();
  flor.position.set(0, rotulo.position.y, r * 1.015);
  g.add(flor);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const petala = new THREE.Mesh(new THREE.SphereGeometry(0.009 * s, 6, 5), toon(P.metalWhite));
    petala.scale.set(1, 1, 0.4);
    petala.position.set(Math.cos(a) * 0.011 * s, Math.sin(a) * 0.011 * s, 0);
    flor.add(petala);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(0.007 * s, 6, 5), toon(P.flowerYellow));
  miolo.position.z = 0.003 * s;
  flor.add(miolo);
  for (const lado of [-1, 1] as const) {
    const folha = new THREE.Mesh(new THREE.SphereGeometry(0.01 * s, 6, 5), toon(P.leafLight));
    folha.scale.set(1.6, 0.7, 0.4);
    folha.position.set(lado * 0.028 * s, -0.012 * s, -0.002 * s);
    folha.rotation.z = lado * 0.5;
    flor.add(folha);
  }

  // a cabeca de gatilho: a rosca (dourada a partir do latao), a cabeca e o bico
  const menta = toon(P.borrifadorGatilho);
  const mentaEscura = toon(P.borrifadorGatilhoEscuro);
  const latao = toon(P.regadorLatao, e.estagio === 2 ? { glow: 0.15 } : {});
  const yRosca = topo + 0.01 * s;
  const rosca = new THREE.Mesh(new THREE.CylinderGeometry(0.032 * s, 0.034 * s, 0.03 * s, 12),
    e.estagio >= 1 ? latao : mentaEscura);
  rosca.position.y = yRosca;
  g.add(rosca);
  const yCabeca = topo + 0.045 * s;
  const cabeca = new THREE.Mesh(new THREE.CapsuleGeometry(0.028 * s, 0.07 * s, 4, 10), menta);
  cabeca.rotation.x = Math.PI / 2;
  cabeca.position.set(0, yCabeca, 0.015 * s);
  g.add(cabeca);
  // o gatilho: pendurado na frente da rosca, e e ELE que o dedo puxa
  const gatilho = new THREE.Mesh(new THREE.CapsuleGeometry(0.012 * s, 0.05 * s, 3, 8),
    e.estagio === 2 ? latao : mentaEscura);
  gatilho.position.set(0, topo, 0.065 * s);
  gatilho.rotation.x = -0.3;
  gatilho.userData.repouso = -0.3;
  g.add(gatilho);

  // o bico, num grupo virado para +Z: e dele que a nevoa sai (`partes.bico`)
  const bico = new THREE.Group();
  bico.position.set(0, yCabeca, 0.062 * s);
  g.add(bico);
  const ponteira = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * s, 0.016 * s, 0.025 * s, 10), toon(P.metalWhite));
  ponteira.rotation.x = Math.PI / 2;
  ponteira.position.z = 0.013 * s;
  bico.add(ponteira);
  // a Nevoa larga: a boca do bico vira uma florzinha de furos, cada vez maior
  const boca = (0.016 + e.nevoaLarga * 0.014) * s;
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(boca, boca, 0.008 * s, 14), e.nevoaLarga > 0 ? toon(P.borrifadorRotulo) : toon(P.metalWhite));
  disco.rotation.x = Math.PI / 2;
  disco.position.z = 0.027 * s;
  bico.add(disco);
  const furos = e.nevoaLarga > 0 ? 6 : 1;
  for (let k = 0; k < furos; k++) {
    const a = (k / furos) * Math.PI * 2;
    const d = furos > 1 ? boca * 0.55 : 0;
    const furo = new THREE.Mesh(new THREE.CircleGeometry(0.0045 * s, 8), toon(P.regadorFuro));
    furo.position.set(Math.cos(a) * d, Math.sin(a) * d, 0.0315 * s);
    bico.add(furo);
  }
  const pontaDoBico = 0.035 * s;

  // a Cordinha de pulso: um laço amarelo em volta da rosca, com uma conta rosa
  if (e.cordinha) {
    const corda = toon(P.mangueiraListra);
    const volta = new THREE.Mesh(new THREE.TorusGeometry(0.037 * s, 0.005 * s, 5, 16), corda);
    volta.rotation.x = Math.PI / 2;
    volta.position.y = yRosca;
    g.add(volta);
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.05 * s, 0.005 * s, 5, 16), corda);
    alca.position.set(-0.055 * s, yRosca - 0.05 * s, 0);
    alca.rotation.y = Math.PI / 2;
    g.add(alca);
    const conta = new THREE.Mesh(new THREE.SphereGeometry(0.012 * s, 8, 6), toon(P.flowerPink));
    conta.position.set(-0.04 * s, yRosca - 0.012 * s, 0);
    conta.name = 'cordinha';
    g.add(conta);
  }

  /*
   * As MESMAS `partes` do regador, do esguicho e da pistola: a mao fecha na
   * ROSCA (`alturaDaAlca`) e a nevoa sai da ponta do bico. O `gatilho` e o
   * que a rodada puxa a cada borrifada.
   */
  g.userData.partes = { corpo: frasco, bico, pontaDoBico, alturaBoca: yCabeca, alturaDaAlca: yRosca, gatilho };
  return g;
}
