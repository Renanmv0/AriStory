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
