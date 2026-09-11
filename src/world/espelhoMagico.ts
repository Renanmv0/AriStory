import * as THREE from 'three';
import { toon } from '../core/materials';
import { PALETTE as P } from '../palette';

/**
 * ======================= O ESPELHO QUE REFLETE DE VERDADE
 *
 * Todo "espelho" do jogo até aqui é um plano azul-claro: da distância de câmera
 * do quarto e do provador, isso basta. O espelho do mezanino é outra coisa — a
 * dupla para na frente dele para se ver vestida, e um plano chapado não mostra
 * roupa nenhuma. Este aqui renderiza a cena de verdade, com uma segunda câmera,
 * num `WebGLRenderTarget`.
 *
 * ========================= A CONTA, E POR QUE ELA NÃO PRECISA DE SHADER
 *
 * A implementação clássica (o `Reflector` dos exemplos do three) renderiza com
 * a câmera refletida e depois **projeta** a textura na tela com um shader
 * próprio, porque o alvo contém a tela inteira e não o retângulo do espelho.
 *
 * Aqui o caminho é outro, e sai mais simples E mais barato: em vez de corrigir
 * a projeção depois, a câmera virtual é montada com um frustum que enquadra
 * EXATAMENTE o retângulo do vidro. Aí o alvo já é a imagem do espelho, ponto a
 * ponto, e o plano mapeia a textura com o UV comum de um `PlaneGeometry` —
 * nenhum shader, nenhuma matriz de textura.
 *
 * ============ POR QUE O OLHO NÃO É A CÂMERA DO JOGO (a conta que NÃO serve)
 *
 * O reflexo de manual reflete o OLHO: pega a câmera, espelha a posição dela no
 * plano do vidro e monta um frustum assimétrico dali. Essa conta foi escrita e
 * medida — e ela está CERTA e não serve, por um motivo só: a câmera do jogo é
 * ORTOGRÁFICA.
 *
 * Câmera ortográfica não tem olho. Os raios dela são paralelos; a "posição"
 * dela é um ponto qualquer lá atrás no eixo de visão — neste jogo, a trinta e
 * sete metros de distância e TRINTA E CINCO DE LADO. Refletir esse ponto monta
 * um frustum tão oblíquo que quem está parado na frente do vidro sai de quadro:
 * medido, o jogador no centro exato do espelho projetava em `x = −1,33` (fora
 * de `[−1, 1]`), e quem aparecia no reflexo era o PARCEIRO, um metro e pouco ao
 * lado. Um espelho que reflete todo mundo menos quem se olha nele.
 *
 * =================== A CONTA QUE SERVE: um observador na frente do vidro
 *
 * Então o olho aqui não é a câmera: é um observador FIXO, parado na frente do
 * espelho, na altura do centro do vidro e a `RECUO` metros dele — que é,
 * literalmente, a definição de espelho de provador. Em espaço local do espelho
 * (o vidro é o plano `z = 0`, virado para `+Z`):
 *
 *  1. o olho é `(0, 0, RECUO)` e o olho refletido, `(0, 0, −RECUO)`;
 *  2. a câmera virtual vai ali, com a orientação do espelho girada meia volta
 *     em `Y`. Esse giro é o que ESPELHA a imagem da esquerda para a direita, em
 *     vez de só mostrar "a sala vista de trás";
 *  3. e o frustum sai do retângulo do vidro visto DALI: a `RECUO` de distância,
 *     o vidro ocupa de `−larg/2` a `+larg/2` — e é isso que entra no
 *     `makePerspective`.
 *
 * O reflexo continua VIVO: ele não desliza com a câmera (não tem por onde — a
 * câmera é ortográfica), mas mostra em tempo real quem está na frente, com a
 * roupa que a pessoa está vestindo, e desliza quando a dupla anda de lado,
 * porque quem se move é o refletido.
 *
 * =============================== AS TRÊS TRAVAS DE CUSTO
 *
 * Um espelho é uma cena inteira desenhada duas vezes, e o jogo roda no celular
 * do Renan. Três travas, e nenhuma delas é opcional:
 *
 *  - **só reflete quando está na tela**: o `onBeforeRender` só é chamado quando
 *    a malha vai ser DESENHADA, então com o mezanino escondido (o estado normal
 *    da loja) o espelho não custa um pixel;
 *  - **alvo pequeno** (512 de lado por padrão, não a resolução da tela), e
 *    recalculado em um quadro sim, um não;
 *  - **nada de recursão**: a peça se apaga antes de renderizar a si mesma.
 *    Sem isso o espelho tenta refletir o próprio reflexo e trava o navegador.
 */

/**
 * A que distância o observador virtual fica do vidro, em metros.
 *
 * É o único número de gosto do arquivo, e ele regula o ENQUADRAMENTO. Quanto
 * mais perto, mais grande-angular: a dupla sai pequena no meio de um reflexo
 * cheio de sala. Quanto mais longe, mais teleobjetiva: a dupla enche o vidro,
 * mas o reflexo deixa de mostrar o entorno.
 *
 * Seis metros é o meio-termo medido: quem para na frente do espelho aparece de
 * corpo inteiro — do cabelo aos pés, com folga embaixo — e ainda sobra a arara
 * premium atrás para o reflexo parecer um pedaço de loja, e não um retrato.
 */
const RECUO = 6;

export interface EspelhoOpts {
  largura?: number;
  altura?: number;
  /** lado da textura de reflexo, em pixels */
  resolucao?: number;
  corAro?: number;
}

class VidroDeEspelho extends THREE.Mesh {
  private readonly alvo: THREE.WebGLRenderTarget;
  private readonly camera = new THREE.PerspectiveCamera();
  /** alterna a cada quadro: o reflexo é recalculado em um sim, um não */
  private pulaQuadro = false;
  /** reaproveitada a cada quadro: alocar em `onBeforeRender` é lixo */
  private readonly meiaVolta = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

  constructor(largura: number, altura: number, resolucao: number) {
    const alvo = new THREE.WebGLRenderTarget(resolucao, Math.round((resolucao * altura) / largura), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    /*
     * O MATERIAL É `MeshBasicMaterial`, e tem que ser: a textura já É uma
     * imagem iluminada (ela saiu de um render da cena). Passar ela por um
     * material que recebe luz aplicaria a iluminação DUAS vezes, e o reflexo
     * sairia mais escuro que a sala que ele reflete.
     */
    super(
      new THREE.PlaneGeometry(largura, altura),
      new THREE.MeshBasicMaterial({ map: alvo.texture }),
    );
    this.alvo = alvo;

    /**
     * O FRUSTUM, e ele é montado UMA VEZ: o olho é fixo, então a projeção
     * também é. Com o observador em `(0, 0, RECUO)`, o vidro visto dali ocupa
     * de `−larg/2` a `+larg/2` e de `−alt/2` a `+alt/2`, a `RECUO` metros — e é
     * isso, em metros de mundo, que entra no `makePerspective`.
     *
     * O `near` É A DISTÂNCIA ATÉ O VIDRO, e isso não é detalhe de precisão: é o
     * que RECORTA o que está ATRÁS do espelho. Com `near` curto, a parede do
     * mezanino e a moldura vista por trás entram no quadro — o reflexo já saiu
     * um retângulo dourado liso por causa disso, que era a própria moldura de
     * costas enchendo a tela.
     *
     * A solução clássica para esse recorte é um plano oblíquo. Aqui ele não é
     * preciso: a câmera virtual olha PERPENDICULAR ao espelho, então o plano do
     * vidro é paralelo ao `near` — e basta pôr o `near` em cima dele.
     */
    this.camera.projectionMatrix.makePerspective(
      -largura / 2,
      largura / 2,
      altura / 2,
      -altura / 2,
      RECUO,
      // a sala inteira cabe nos trinta metros seguintes ao vidro; o resto do
      // parque não interessa a um espelho de provador
      RECUO + 34,
    );
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
  }

  /**
   * Chamado pelo three a cada quadro, ANTES de desenhar esta malha — é o gancho
   * que deixa a peça funcionar sem o motor saber que ela existe. O `Game` nunca
   * ouviu falar em espelho; ele só chama `renderer.render(scene, camera)`.
   */
  override onBeforeRender = (renderer: THREE.WebGLRenderer, cena: THREE.Scene): void => {
    // reflexo a cada dois quadros ninguém vê, e custa metade
    this.pulaQuadro = !this.pulaQuadro;
    if (this.pulaQuadro) return;

    this.updateMatrixWorld();

    /*
     * A CÂMERA VIRTUAL: no olho refletido — `(0, 0, −RECUO)` em espaço local —
     * com a orientação do espelho girada meia volta em `Y`. Esse giro é o que
     * ESPELHA a imagem da esquerda para a direita, em vez de mostrar só "a sala
     * vista de trás".
     *
     * Ela é recolocada a cada quadro (e não uma vez só) porque o espelho é uma
     * peça do kit: nada impede uma cena futura de pendurar ele num elevador.
     */
    this.getWorldQuaternion(this.camera.quaternion);
    this.camera.quaternion.multiply(this.meiaVolta);
    this.localToWorld(this.camera.position.set(0, 0, -RECUO));

    // o render do reflexo. A peça se apaga primeiro: sem isto ela apareceria
    // dentro do próprio reflexo, refletindo o reflexo
    this.visible = false;
    const alvoAnterior = renderer.getRenderTarget();
    const sombraAnterior = renderer.shadowMap.autoUpdate;
    renderer.shadowMap.autoUpdate = false;   // as sombras do quadro já estão prontas
    renderer.setRenderTarget(this.alvo);
    renderer.clear();
    renderer.render(cena, this.camera);
    renderer.setRenderTarget(alvoAnterior);
    renderer.shadowMap.autoUpdate = sombraAnterior;
    this.visible = true;
  };
}

/**
 * O espelho inteiro: o vidro que reflete, o aro dourado e a base.
 *
 * Ele nasce virado para `+Z`, como toda peça do kit, com a base em `y = 0`.
 */
export function espelhoMagico(opts: EspelhoOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'espelho-magico';
  const largura = opts.largura ?? 2.2;
  const altura = opts.altura ?? 2.6;
  const aro = toon(opts.corAro ?? P.boutiqueOuro);

  const vidro = new VidroDeEspelho(largura, altura, opts.resolucao ?? 512);
  vidro.name = 'vidro-do-espelho';
  vidro.position.set(0, altura / 2 + 0.16, 0.05);
  g.add(vidro);

  // o aro: quatro barras em volta do vidro, e um friso interno um degrau mais
  // escuro — moldura de uma barra só lê como quadro de escola
  const grossura = 0.14;
  for (const [x, y, larg, altu] of [
    [0, altura + 0.16 + grossura / 2, largura + grossura * 2, grossura],
    [0, 0.16 - grossura / 2, largura + grossura * 2, grossura],
    [-largura / 2 - grossura / 2, altura / 2 + 0.16, grossura, altura],
    [largura / 2 + grossura / 2, altura / 2 + 0.16, grossura, altura],
  ] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(larg, altu, 0.12), aro);
    barra.position.set(x, y, 0.02);
    g.add(barra);
  }
  const friso = new THREE.Mesh(
    new THREE.BoxGeometry(largura + 0.04, altura + 0.04, 0.06),
    toon(P.boutiqueOuroEscuro),
  );
  friso.position.set(0, altura / 2 + 0.16, -0.02);
  g.add(friso);

  /*
   * O pedestal, que é o que impede o espelho de nascer flutuando. Ele é 2 cm
   * MAIS BAIXO que a barra de baixo do aro de propósito: com os dois topos em
   * `y = 0,16` sobravam 0,32 m² de faces coplanares olhando para cima, e é
   * exatamente isso que serrilha na tela (`scripts/zfighting.mjs` pegou).
   */
  const base = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.5, 0.14, 0.42), aro);
  base.position.set(0, 0.07, 0);
  g.add(base);

  // e dois castiçais de luz nas laterais, como todo espelho de provador chique
  for (const lado of [-1, 1] as const) {
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), aro);
    haste.position.set(lado * (largura / 2 + 0.3), altura * 0.62, 0.1);
    g.add(haste);
    const globo = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), toon(P.boutiqueLuz, { glow: 0.7 }));
    globo.position.set(lado * (largura / 2 + 0.3), altura * 0.62 + 0.32, 0.1);
    g.add(globo);
  }
  return g;
}
