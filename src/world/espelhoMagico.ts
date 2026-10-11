import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { brilhoDeLuz, toon } from '../core/materials';
import { acabar } from './acabamento';
import { contorno } from './molduras';
import { marmore } from './texturasDeCasa';
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
 *     em `Y`, que é o que a faz olhar para a sala em vez de para o fundo;
 *  3. o frustum sai do retângulo do vidro visto DALI: a `RECUO` de distância,
 *     o vidro ocupa de `−larg/2` a `+larg/2` — e é isso que entra no
 *     `makePerspective`;
 *  4. e o `u` da textura entra INVERTIDO no plano, que é o que troca a imagem
 *     de lado — ver `espelhar()`, logo abaixo, que é o conserto de um espelho
 *     que refletia para o lado errado.
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

/**
 * ================== O ÚLTIMO MEIO-GIRO: o `u` da textura nasce ao contrário
 *
 * A câmera virtual, girada meia volta em `Y`, olha para a sala com o `+X` DELA
 * apontando para o `−X` do espelho. Quem está à direita de quem se olha no
 * vidro cai, portanto, na METADE ESQUERDA da textura — e o `PlaneGeometry`
 * mapeia a metade esquerda da textura na metade ESQUERDA do vidro. Resultado:
 * a sala aparece trocada de lado. É exatamente o que o Renan viu na foto do
 * mezanino: o espelho funcionava, refletia ao vivo, e espelhava para o lado
 * errado.
 *
 * (O `Reflector` dos exemplos do three não tem esse defeito por um motivo que
 * não se vê de imediato: ele não usa o `uv` do plano, e sim a PROJEÇÃO da
 * câmera virtual como coordenada de textura — que já embute este meio-giro.)
 *
 * A correção é de um atributo: inverter o `u` da geometria (`u → 1 − u`). Sai
 * de graça (não custa um pixel em tempo de execução, ao contrário de mexer no
 * `repeat` da textura ou de espelhar o frustum, que ainda inverteria o sentido
 * das faces e sumiria com a sala inteira por trás do culling).
 */
function espelhar(geo: THREE.PlaneGeometry): THREE.PlaneGeometry {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
  uv.needsUpdate = true;
  return geo;
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
      espelhar(new THREE.PlaneGeometry(largura, altura)),
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
     * com a orientação do espelho girada meia volta em `Y`, que é o que a faz
     * olhar para a SALA e não para o fundo. (A troca de lado da imagem não vem
     * daqui: vem do `u` invertido do plano — ver `espelhar()`.)
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
 * O espelho inteiro: o vidro que reflete, a moldura dourada e a base.
 *
 * A MOLDURA TEM PERFIL (o `contorno()` das molduras de fachada, de pé): o
 * filete de fora, a meia-cana e o friso que cobre a borda do vidro — a luz do
 * toon em cada inclinação é o que desenha o "dourado entalhado" sem uma
 * textura. Em cima, o BRASÃO em leque (a concha de espelho de época); em
 * baixo, a base de mármore em degrau; e dos dois lados os braços de latão com
 * os globinhos acesos e o halo.
 *
 * Ele nasce virado para `+Z`, como toda peça do kit, com a base em `y = 0`.
 */
export function espelhoMagico(opts: EspelhoOpts = {}): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'espelho-magico';
  const largura = opts.largura ?? 2.2;
  const altura = opts.altura ?? 2.6;
  const ouro = toon(opts.corAro ?? P.boutiqueOuro);
  const BASE = 0.2;
  const cy = altura / 2 + BASE;

  const vidro = new VidroDeEspelho(largura, altura, opts.resolucao ?? 512);
  vidro.name = 'vidro-do-espelho';
  vidro.position.set(0, cy, 0.05);
  g.add(vidro);

  // o fundo: a tábua escura atrás do vidro (a moldura cobre a borda dele)
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.08, altura + 0.08, 0.05), toon(P.boutiqueOuroEscuro));
  fundo.position.set(0, cy, 0.0);
  g.add(fundo);

  // a moldura com perfil, de fora para dentro por cima (o vão é o vidro)
  const perfil: ReadonlyArray<readonly [number, number]> = [
    [0.15, 0], [0.15, 0.02], [0.135, 0.04], [0.11, 0.05], [0.085, 0.038], [0.06, 0.048],
    [0.035, 0.06], [0.015, 0.05], [0.004, 0.035], [0, 0.02], [0, 0],
  ];
  const moldura = contorno(perfil, largura / 2 - 0.025, altura / 2 - 0.025);
  moldura.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(moldura, ouro);
  m.position.set(0, cy, 0.035);
  g.add(m);

  // o brasão em leque no alto: meio-disco de gomos recortados, em relevo
  const leque = new THREE.Shape();
  const R = 0.36;
  leque.moveTo(-R, 0);
  const gomos = 9;
  for (let i = 0; i < gomos; i++) {
    const a0 = Math.PI - (i / gomos) * Math.PI;
    const a1 = Math.PI - ((i + 1) / gomos) * Math.PI;
    const am = (a0 + a1) / 2;
    leque.quadraticCurveTo(Math.cos(am) * R * 1.16, Math.sin(am) * R * 1.16, Math.cos(a1) * R, Math.sin(a1) * R);
  }
  leque.lineTo(0.09, 0);
  leque.absarc(0, 0, 0.09, 0, Math.PI, false);
  leque.closePath();
  const geoLeque = new THREE.ExtrudeGeometry(leque, {
    depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2, curveSegments: 6,
  });
  const brasao = new THREE.Mesh(geoLeque, ouro);
  brasao.position.set(0, altura + BASE + 0.1, 0.03);
  g.add(brasao);
  // os raios do leque, um fio em relevo do miolo até cada gomo
  for (let i = 1; i < gomos; i++) {
    const a = Math.PI - (i / gomos) * Math.PI;
    const raio = new THREE.Mesh(new THREE.BoxGeometry(0.012, R - 0.1, 0.012), toon(P.boutiqueOuroEscuro));
    raio.position.set(Math.cos(a) * (0.09 + (R - 0.1) / 2), altura + BASE + 0.1 + Math.sin(a) * (0.09 + (R - 0.1) / 2), 0.083);
    raio.rotation.z = a - Math.PI / 2;
    g.add(raio);
  }

  // a base de mármore em degrau, com o friso de latão
  const pedra = toon(P.boutiqueMarmore);
  for (const [l, a, p, y] of [[largura + 0.6, 0.1, 0.5, 0.05], [largura + 0.36, 0.1, 0.38, 0.15]] as const) {
    const degrau = new THREE.Mesh(new RoundedBoxGeometry(l, a, p, 2, 0.02), pedra);
    degrau.position.set(0, y, 0.0);
    g.add(degrau);
  }
  const friso = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.62, 0.02, 0.52), ouro);
  friso.position.set(0, 0.1, 0.0);
  g.add(friso);

  // os braços de luz dos lados: braço curvo de latão e o globinho aceso
  for (const lado of [-1, 1] as const) {
    const x = lado * (largura / 2 + 0.24);
    const braco = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(lado * (largura / 2 + 0.1), altura * 0.6, 0.06),
      new THREE.Vector3(x, altura * 0.6 + 0.02, 0.12),
      new THREE.Vector3(x, altura * 0.6 + 0.2, 0.14),
    ]), 12, 0.014, 6, false), ouro);
    g.add(braco);
    const globo = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), toon(P.boutiqueLuz, { glow: 0.8 }));
    globo.position.set(x, altura * 0.6 + 0.3, 0.14);
    g.add(globo);
    const halo = new THREE.Sprite(brilhoDeLuz(P.luzDeAbajur, 0.45));
    halo.scale.set(0.7, 0.7, 1);
    halo.position.copy(globo.position);
    halo.renderOrder = 3;
    g.add(halo);
  }
  return acabar(g, [[P.boutiqueMarmore, marmore()]]);
}
