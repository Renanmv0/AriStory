import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';

/**
 * O CORPO das pecas de roupa que tem geometria propria.
 *
 * Zero asset externo, como todo o resto: primitiva do Three.js e material de
 * `toon()`. Cada funcao devolve uma malha nova a cada chamada — o slot dos pes
 * pendura uma copia em cada perna, e o mesmo Object3D nao pode ter dois pais.
 */

// ------------------------------------------------------------------ geometria
//
// O REFERENCIAL muda por slot, e e a primeira coisa a saber antes de escrever
// uma fabrica:
//   cabeca        -> dentro da cabeca, y = 0 no centro do cranio
//   pernas e pes  -> no pivo da perna, y = 0 no quadril
//   tronco        -> no corpo, y = 0 no CHAO
//   extraBraco    -> no pivo do braco, y = 0 no ombro
// Em nenhum caso a peca recria membro: ela entra como IRMA do que ja existe, e
// os pivos de rotacao da caminhada continuam intocados.

/**
 * Gorro de la: calota apoiada EM CIMA do cabelo, com a barra dobrada na borda.
 *
 * ELE POUSA, e nao engole. A primeira versao era justa: media-se pelo cranio e
 * pedia `cobreCabelo`, entao a juba sumia e sobrava uma cabeca careca de touca
 * — e, medida pelo cranio, a barra caia na linha do rosto e, na camera
 * isometrica (que olha de cima, em 34°), tapava os olhos.
 *
 * Agora ele segue as cotas do QUEPE DA BILHETERIA, que por sua vez seguem as
 * do chapeu de campeao no construtor do rig: a altura sai do CABELO (a juba do
 * Ari sobe a ~1,35·headR), e nao do cranio. O cabelo continua aparecendo por
 * baixo, que e o que um gorro de verdade faz.
 *
 * A barra tem que cair EXATAMENTE na borda de baixo da calota, e nao mais
 * larga que ela. Uma casca esferica de raio R aberta ate `thetaLength` termina
 * em `y = centro + R·cos(theta)` com raio `R·sen(theta)` — errar essas duas
 * contas poe um anel largo no meio da cupula, e o gorro vira sombrero.
 */
function gorroDeLa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  // A COR SAI DA FICHA, e a da paleta e so o padrao: este mesmo gorro veste o
  // rosa do armario do Ari, o azul e o musgo da arara da Estella e a boina de
  // veludo do mezanino. Sem isto, quatro fichas de cores diferentes apareciam
  // as quatro rosa — a geometria ganhava da ficha.
  const la = toon(peca?.cor ?? P.roupaLa);
  const laBarra = toon(peca?.corDetalhe ?? P.roupaLaBarra);

  /*
   * AS COTAS SAO AS DO QUEPE, e nao as do cranio.
   *
   * `BORDA` e onde a barra encosta no cabelo, e ela e o numero que decide
   * tudo: acima dela a peca inteira fica longe do rosto, e por baixo dela
   * continua havendo cabeca e cabelo. `RAIO` e bem menor que `headR` porque a
   * peca nao precisa mais envolver o cranio — ela so se apoia no alto dele.
   */
  const BORDA = r * 1.26;
  const RAIO = r * 0.9;
  const ALTO = 1.02; // um pouco alto: gorro achatado lembra boina
  const ABRE = Math.PI * 0.52;

  const calota = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 18, 12, 0, Math.PI * 2, 0, ABRE),
    la,
  );
  calota.position.y = BORDA;
  calota.scale.y = ALTO;
  g.add(calota);

  // onde a casca de fato termina — ver o comentario do cabecalho
  const borda = BORDA + RAIO * Math.cos(ABRE) * ALTO;
  const raioNaBorda = RAIO * Math.sin(ABRE);
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(raioNaBorda * 1.04, raioNaBorda * 1.07, r * 0.22, 18),
    laBarra,
  );
  barra.position.y = borda - r * 0.03;
  g.add(barra);

  const pompom = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.17, 10, 8),
    laBarra,
  );
  pompom.position.y = BORDA + RAIO * ALTO;
  g.add(pompom);

  return g;
}

/**
 * Cano da bota, no tornozelo.
 *
 * Nasce no referencial do PIVO da perna, igual ao patins: o pe esta em
 * `-legH + h*0.022`, entao o cano fica logo acima disso e desce um pouco para
 * cobrir a costura.
 */
function canoDaBota(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  // a cor sai da ficha (ver o gorro): a amarela do armario, a vermelha e a
  // creme da arara e a dourada do mezanino sao esta mesma bota
  const cano = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.05 * m.w, m.h * 0.055 * m.w, m.h * 0.08, 12),
    toon(peca?.corDetalhe ?? P.roupaBotaCano),
  );
  cano.position.y = -m.legH + m.h * 0.075;
  g.add(cano);

  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.058 * m.w, m.h * 0.058 * m.w, m.h * 0.018, 12),
    toon(peca?.cor ?? P.roupaBota),
  );
  dobra.position.y = -m.legH + m.h * 0.113;
  g.add(dobra);

  return g;
}

/**
 * Um laco de fita chato, de frente para +Z.
 *
 * Aparece tres vezes no vestido (peito, cintura, barra) e uma na gargantilha,
 * entao vale a funcao. `escala` e a meia-largura do laco em unidades de mundo.
 */
function laco(escala: number, cor: number, corNo = cor): THREE.Group {
  const g = new THREE.Group();
  for (const lado of [-1, 1] as const) {
    // as alcas mandam na leitura: pequenas demais e o laco vira duas barras
    // verticais, que foi como o laco vermelho do maid gatinho saiu na primeira
    // foto
    const alca = new THREE.Mesh(
      new THREE.SphereGeometry(escala * 0.86, 9, 7),
      toon(cor),
    );
    alca.position.x = lado * escala * 0.86;
    alca.scale.set(1.05, 0.72, 0.42);
    g.add(alca);

    // a fita que cai, cada uma para o seu lado
    const fita = new THREE.Mesh(
      new THREE.BoxGeometry(escala * 0.34, escala * 1.5, escala * 0.14),
      toon(cor),
    );
    fita.position.set(lado * escala * 0.42, -escala * 0.95, 0);
    fita.rotation.z = lado * 0.32;
    g.add(fita);
  }
  const no = new THREE.Mesh(
    new THREE.SphereGeometry(escala * 0.3, 8, 6),
    toon(corNo),
  );
  no.scale.z = 0.7;
  g.add(no);
  return g;
}

/**
 * Anel de babado franzido.
 *
 * Um cilindro liso le como plastico; o que faz parecer pano e a QUEBRA.
 *
 * A primeira versao usava abas RETAS inclinadas alternadamente e virou uma
 * cerca de estacas: box com espessura, inclinado, abre vao entre um e outro, e
 * o vao aparece. Agora sao escamas — meias-esferas achatadas — que se
 * SOBREPOEM, do jeito que a renda em festao das fotos de fato e. Sem vao
 * possivel, e o contorno sai ondulado em vez de serrilhado.
 */
function babado(raio: number, altura: number, cor: number, achata = 0.85): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  // O tamanho da escama vem da ALTURA do babado, nao da circunferencia.
  // Tirando da circunferencia, um anel maior ganhava escamas maiores e a gola
  // virava uma boia em volta do pescoco; tirando da altura, um babado fino e
  // fino em qualquer diametro, e quem se ajusta e a QUANTIDADE.
  const escamaR = altura * 0.6;
  const quantas = Math.max(8, Math.ceil((2 * Math.PI * raio) / (escamaR * 1.25)));
  for (let i = 0; i < quantas; i++) {
    const a = (i / quantas) * Math.PI * 2;
    const escama = new THREE.Mesh(new THREE.SphereGeometry(escamaR, 7, 6), mat);
    escama.position.set(Math.sin(a) * raio, 0, Math.cos(a) * raio * achata);
    // achatada contra o pano: esferica demais e o babado vira boia de piscina
    escama.scale.set(1, 0.88, 0.34);
    escama.rotation.y = a;
    g.add(escama);
  }
  return g;
}

/**
 * Cadarco cruzado, o vai e vem de fita que os dois maid tem no peito e na
 * cintura. `voltas` e quantos X empilhados.
 */
function cadarco(largura: number, altura: number, cor: number, voltas = 3): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const passo = altura / voltas;
  const diagonal = Math.hypot(largura, passo);
  for (let i = 0; i < voltas; i++) {
    for (const lado of [-1, 1] as const) {
      const fio = new THREE.Mesh(
        new THREE.BoxGeometry(diagonal, altura * 0.07, altura * 0.05),
        mat,
      );
      fio.position.y = -altura / 2 + passo * (i + 0.5);
      fio.rotation.z = lado * Math.atan2(passo, largura);
      g.add(fio);
    }
  }
  return g;
}

/**
 * Manga bufante: a bola de pano no ombro.
 *
 * Ela mora no CORPO, na altura do ombro, e nao no pivo do braco. Parece errado
 * e nao e: o pivo do braco nao se desloca, so gira, entao uma bola centrada
 * nele giraria em torno do proprio centro — visualmente identica. Pendurar no
 * corpo evita mexer no pivo, que e a unica coisa proibida aqui.
 */
function mangaBufante(raio: number, cor: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(raio, 12, 10), toon(cor));
  m.scale.set(1, 0.82, 0.92);
  return m;
}

/**
 * Vestido rosa de babados, do vestido que o Renan viu na vitrine.
 *
 * REFERENCIAL: o corpo, com y = 0 no CHAO — o mesmo do calcao de banho e da
 * jaqueta, que sao os vizinhos dela. Nao e o da cabeca nem o do pivo da perna.
 *
 * ## A largura da barra nao e gosto
 *
 * A coxa gira ate 0.62 rad no pico da caminhada, e um ponto a `d` abaixo do
 * quadril avanca `0.58·d`. Com a barra a `0.13·h` do quadril a perna alcanca
 * ~0.20 do centro numa pessoa de 1.72; a barra vai a 2x o raio do torso, que
 * contem a passada com folga — e por sorte e tambem a silhueta rodada da foto.
 *
 * Tudo leva `scale.z` por volta de 0.85 porque o torso do rig e achatado em Z
 * (`torso.scale.z = 0.82`); saia redonda em corpo achatado parece inflada de
 * perfil.
 */
interface CoresDeVestido { pano: number; renda: number; fita: number }

/**
 * O VESTIDO DA FOTO — as tres cores escolhidas a mao, e nao derivadas.
 *
 * Esta e a peca do armario do Ari. Ela existe separada da generica para que a
 * conta de fita dos vestidos da loja nao mexa numa peca que saiu de uma
 * referencia de verdade.
 */
const vestidoRosa: NonNullable<ItemDef['extra']> = (m) =>
  vestidoDeBabados(m, undefined, {
    pano: P.vestidoRosa,
    renda: P.vestidoRenda,
    fita: P.vestidoFita,
  });

/**
 * O MESMO VESTIDO, NA COR DA FICHA. E o que a arara da Estella vende sete
 * vezes: mesma geometria, `cor` e `corDetalhe` de cada `ItemDef`.
 */
const vestidoDaLoja: NonNullable<ItemDef['extra']> = (m, _lado, peca) =>
  vestidoDeBabados(m, peca);

function vestidoDeBabados(
  m: MedidasCorpo,
  peca?: ItemDef,
  cores?: CoresDeVestido,
): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ACHATA = 0.85;

  /*
   * TRES COLORACOES, E SO DUAS CABEM NA FICHA.
   *
   * O `ItemDef` tem `cor` e `corDetalhe`, e este vestido usa tres: o pano, a
   * renda e a FITA dos lacos. A terceira sai de uma conta em cima do pano — um
   * degrau mais escuro —, que e a mesma receita das roupas penduradas na
   * arara. Cor de fita propria por peca seria uma entrada de paleta a mais por
   * vestido para uma faixa de 3 cm.
   *
   * O VESTIDO ROSA NAO PASSA POR ESSA CONTA: ele veio de uma foto que o Renan
   * mandou, com as tres cores escolhidas uma a uma, e a conta generica muda a
   * fita dele de rosa para um malva apagado. Quem quiser as tres cores exatas
   * passa `cores`; quem so tem ficha (os sete vestidos da loja) cai na conta.
   */
  const corPano = cores?.pano ?? peca?.cor ?? P.vestidoRosa;
  const corRenda = cores?.renda ?? peca?.corDetalhe ?? P.vestidoRenda;
  const corFita = cores?.fita ?? new THREE.Color(corPano).multiplyScalar(0.74).getHex();

  const rosa = toon(corPano);
  const renda = toon(corRenda, { doubleSide: true });
  const fita = toon(corFita);

  // ------------------------------------------------------------- corpete
  // faixa de renda no decote, que e o que da a cara de lolita de longe
  const decote = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.1, raioTorso * 1.06, h * 0.035, 18, 1, true),
    renda,
  );
  decote.position.y = hipY + m.torsoH * 0.78;
  decote.scale.z = ACHATA;
  g.add(decote);

  // babado franzido em cada ombro: um anel achatado, no lugar da alca
  for (const lado of [-1, 1] as const) {
    const babado = new THREE.Mesh(
      new THREE.TorusGeometry(h * 0.042 * w, h * 0.016, 6, 14),
      renda,
    );
    babado.position.set(lado * h * 0.1 * w, hipY + m.torsoH * 0.84, 0);
    babado.rotation.set(Math.PI / 2, 0, lado * 0.3);
    babado.scale.z = 0.8;
    g.add(babado);
  }

  // o laco do peito e o que se ve primeiro na foto, entao ele e o maior de todos
  const lacoPeito = laco(h * 0.04, corFita, corRenda);
  lacoPeito.position.set(0, hipY + m.torsoH * 0.62, raioTorso * 0.9);
  g.add(lacoPeito);

  // ------------------------------------------------------------- cintura
  const cinta = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.08, raioTorso * 1.08, h * 0.03, 18, 1, true),
    fita,
  );
  cinta.position.y = hipY + m.torsoH * 0.16;
  cinta.scale.z = ACHATA;
  g.add(cinta);

  const lacoCintura = laco(h * 0.036, corPano, corFita);
  lacoCintura.position.set(0, hipY + m.torsoH * 0.14, raioTorso * 0.92);
  g.add(lacoCintura);

  // ---------------------------------------------------------------- saia
  const topoSaia = hipY + m.torsoH * 0.1;
  const barra = hipY - h * 0.13;
  const raioBarra = raioTorso * 2.0;

  // duas camadas, a de baixo mais larga: e o que faz a saia ter volume em vez
  // de parecer um cone liso
  const camadaAlta = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.02, raioBarra * 0.82, topoSaia - barra - h * 0.05, 20, 1, true),
    rosa,
  );
  camadaAlta.position.y = (topoSaia + barra + h * 0.05) / 2;
  camadaAlta.scale.z = ACHATA;
  g.add(camadaAlta);

  const camadaBaixa = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBarra * 0.78, raioBarra, h * 0.08, 20, 1, true),
    rosa,
  );
  camadaBaixa.position.y = barra + h * 0.04;
  camadaBaixa.scale.z = ACHATA;
  g.add(camadaBaixa);

  // barra de renda: um anel na boca da saia, virado para baixo
  const bainha = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBarra * 1.04, raioBarra * 1.12, h * 0.032, 20, 1, true),
    renda,
  );
  bainha.position.y = barra;
  bainha.scale.z = ACHATA;
  g.add(bainha);

  // lacos em volta da barra, como na foto — nao atras, que ninguem ve
  for (const ang of [-0.9, 0, 0.9]) {
    const l = laco(h * 0.022, corFita, corRenda);
    l.position.set(
      Math.sin(ang) * raioBarra * 0.92,
      barra + h * 0.055,
      Math.cos(ang) * raioBarra * 0.92 * ACHATA,
    );
    l.rotation.y = ang;
    g.add(l);
  }

  return g;
}

/**
 * Maid marinheiro, preto e branco, da segunda foto da vitrine.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO — igual ao vestido rosa.
 *
 * A leitura da peca, de cima para baixo: gola de marinheiro em V com debrum
 * preto, suspensorios largos e plissados descendo pelas laterais, peitilho com
 * cadarco preto cruzado, faixa de cintura com dois lacos, babado na barra do
 * avental e, por baixo de tudo, a saia preta com a renda branca larga.
 *
 * A saia repete as cotas do vestido rosa (barra a 2x o raio do torso, para a
 * coxa a 0.62 rad nao atravessar) porque a conta e a mesma; o que muda e a
 * roupa por cima.
 */
function vestidoMarinheiro(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const meioOmbro = h * 0.1 * w;
  const ACHATA = 0.85;

  const creme = toon(P.maidCreme);
  const cremeDuplo = toon(P.maidCreme, { doubleSide: true });
  const fita = toon(P.maidFita);

  // ------------------------------------------------------------------ saia
  const topoSaia = hipY + m.torsoH * 0.12;
  const barra = hipY - h * 0.14;
  const raioBarra = raioTorso * 2.0;

  const saia = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.04, raioBarra, topoSaia - barra, 20, 1, true),
    toon(P.maidPreto, { doubleSide: true }),
  );
  saia.position.y = (topoSaia + barra) / 2;
  saia.scale.z = ACHATA;
  g.add(saia);

  // a renda larga da barra, que na foto e quase uma faixa inteira
  const rendaBarra = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBarra * 1.01, raioBarra * 1.06, h * 0.038, 20, 1, true),
    cremeDuplo,
  );
  rendaBarra.position.y = barra + h * 0.016;
  rendaBarra.scale.z = ACHATA;
  g.add(rendaBarra);
  const dentinhos = babado(raioBarra * 1.04, h * 0.03, P.maidCreme, ACHATA);
  dentinhos.position.y = barra - h * 0.008;
  g.add(dentinhos);

  // --------------------------------------------------------------- avental
  // so na FRENTE: um arco de cilindro em vez de um cilindro inteiro, senao ele
  // vira uma segunda saia e come a preta
  const aventalTopo = hipY + m.torsoH * 0.16;
  const aventalBarra = hipY - h * 0.045;
  const avental = new THREE.Mesh(
    new THREE.CylinderGeometry(
      raioTorso * 1.06, raioBarra * 0.86, aventalTopo - aventalBarra, 16, 1, true,
      -1.15, 2.3,
    ),
    cremeDuplo,
  );
  avental.position.y = (aventalTopo + aventalBarra) / 2;
  avental.scale.z = ACHATA;
  g.add(avental);

  const babadoAvental = babado(raioBarra * 0.88, h * 0.034, P.maidCreme, ACHATA);
  babadoAvental.position.y = aventalBarra;
  g.add(babadoAvental);

  // ------------------------------------------------------ faixa de cintura
  const cintura = hipY + m.torsoH * 0.2;
  const faixa = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.1, raioTorso * 1.1, h * 0.055, 18, 1, true),
    cremeDuplo,
  );
  faixa.position.y = cintura;
  faixa.scale.z = ACHATA;
  g.add(faixa);

  // os dois cadarcos e os dois lacos pretos da foto, um de cada lado
  for (const lado of [-1, 1] as const) {
    const c = cadarco(h * 0.03, h * 0.045, P.maidFita, 3);
    c.position.set(lado * raioTorso * 0.5, cintura, raioTorso * 0.92);
    g.add(c);

    const l = laco(h * 0.017, P.maidFita);
    l.position.set(lado * raioTorso * 0.5, cintura - h * 0.028, raioTorso * 0.96);
    g.add(l);
  }

  // ---------------------------------------------------------- suspensorios
  // as duas tiras largas e plissadas que descem do ombro ate a cintura
  for (const lado of [-1, 1] as const) {
    const tira = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.055 * w, ombroY - cintura, h * 0.02),
      creme,
    );
    tira.position.set(lado * raioTorso * 0.62, (ombroY + cintura) / 2, raioTorso * 0.7);
    tira.rotation.y = -lado * 0.5;
    g.add(tira);

    // o babado da beirada, que e o que a foto tem de mais marcante nas laterais
    const franzido = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.022 * w, ombroY - cintura, h * 0.03),
      cremeDuplo,
    );
    franzido.position.set(lado * raioTorso * 0.98, (ombroY + cintura) / 2, raioTorso * 0.4);
    franzido.rotation.y = -lado * 0.95;
    g.add(franzido);
  }

  // -------------------------------------------------------------- peitilho
  // Baixo e estreito: ele e o fundo do cadarco, e a GOLA e que manda na parte
  // de cima do peito. Na primeira versao ele subia ate o pescoco e engolia a
  // gola inteira — tudo virava uma chapa branca so.
  const peito = new THREE.Mesh(
    new THREE.BoxGeometry(raioTorso * 0.9, m.torsoH * 0.24, h * 0.014),
    creme,
  );
  peito.position.set(0, hipY + m.torsoH * 0.4, raioTorso * 0.8);
  g.add(peito);

  const cadarcoPeito = cadarco(raioTorso * 0.55, m.torsoH * 0.2, P.maidFita, 4);
  cadarcoPeito.position.set(0, hipY + m.torsoH * 0.4, raioTorso * 0.87);
  g.add(cadarcoPeito);

  // ------------------------------------------------------ gola marinheiro
  //
  // Ela desce em V na frente E cobre o ombro — sem a parte do ombro nao le como
  // gola de marinheiro, le como babador. O debrum preto corre PARALELO a
  // beirada, um pouco para dentro, que e como a fita da foto e costurada; na
  // primeira versao ele foi para a beirada de fora e virou dois suspensorios.
  const golaY = hipY + m.torsoH * 0.68;
  for (const lado of [-1, 1] as const) {
    const aba = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.1 * w, m.torsoH * 0.46, h * 0.012),
      creme,
    );
    aba.position.set(lado * h * 0.06 * w, golaY, raioTorso * 0.82);
    aba.rotation.z = lado * 0.34;
    g.add(aba);

    // debrum inset, acompanhando a inclinacao da aba
    const debrum = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.007, m.torsoH * 0.4, h * 0.006),
      fita,
    );
    debrum.position.set(lado * h * 0.088 * w, golaY + m.torsoH * 0.02, raioTorso * 0.88);
    debrum.rotation.z = lado * 0.34;
    g.add(debrum);

    // o pedaco que pousa no ombro e fecha a volta
    const noOmbro = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.075 * w, h * 0.012, raioTorso * 1.5),
      creme,
    );
    noOmbro.position.set(lado * meioOmbro * 0.86, ombroY + h * 0.012, 0);
    noOmbro.rotation.z = lado * 0.16;
    g.add(noOmbro);
  }

  const golaCostas = new THREE.Mesh(
    new THREE.BoxGeometry(h * 0.24 * w, m.torsoH * 0.36, h * 0.014),
    creme,
  );
  golaCostas.position.set(0, hipY + m.torsoH * 0.74, -raioTorso * 0.8);
  g.add(golaCostas);
  const debrumCostas = new THREE.Mesh(
    new THREE.BoxGeometry(h * 0.24 * w, h * 0.011, h * 0.006),
    fita,
  );
  debrumCostas.position.set(0, hipY + m.torsoH * 0.57, -raioTorso * 0.87);
  g.add(debrumCostas);

  // -------------------------------------------------------- mangas bufantes
  for (const lado of [-1, 1] as const) {
    const bufante = mangaBufante(h * 0.055 * w, P.maidCreme);
    bufante.position.set(lado * meioOmbro, ombroY - h * 0.012, 0);
    g.add(bufante);
  }

  return g;
}

/**
 * Maid gatinho, da terceira foto.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO.
 *
 * O que define esta peca e a CARA DE GATO no peito do avental — orelhas, olhos,
 * bigodes e boca. Sem ela e so mais um maid preto e branco, entao ela ganha o
 * cuidado que o resto da peca nao precisa. O laco vermelho com guizo e a
 * segunda coisa que se ve na foto.
 */
function vestidoGatinho(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const meioOmbro = h * 0.1 * w;
  const ACHATA = 0.85;

  const branco = toon(P.maidCreme);
  const brancoDuplo = toon(P.maidCreme, { doubleSide: true });
  const preto = toon(P.maidFita);

  // ------------------------------------------------------------------ saia
  const topoSaia = hipY + m.torsoH * 0.12;
  const barra = hipY - h * 0.14;
  const raioBarra = raioTorso * 2.0;

  const saia = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.04, raioBarra, topoSaia - barra, 20, 1, true),
    toon(P.maidPreto, { doubleSide: true }),
  );
  saia.position.y = (topoSaia + barra) / 2;
  saia.scale.z = ACHATA;
  g.add(saia);

  // a saia da foto tem babado preto na barra, e nao renda branca
  const babadoPreto = babado(raioBarra * 1.02, h * 0.036, P.maidPreto, ACHATA);
  babadoPreto.position.y = barra + h * 0.004;
  g.add(babadoPreto);

  // --------------------------------------------------------------- avental
  const aventalTopo = hipY + m.torsoH * 0.26;
  const aventalBarra = hipY - h * 0.055;
  const avental = new THREE.Mesh(
    new THREE.CylinderGeometry(
      raioTorso * 1.04, raioBarra * 0.9, aventalTopo - aventalBarra, 16, 1, true,
      -1.2, 2.4,
    ),
    brancoDuplo,
  );
  avental.position.y = (aventalTopo + aventalBarra) / 2;
  avental.scale.z = ACHATA;
  g.add(avental);

  const babadoAvental = babado(raioBarra * 0.92, h * 0.036, P.maidCreme, ACHATA);
  babadoAvental.position.y = aventalBarra;
  g.add(babadoAvental);

  // patinha preta estampada, do lado, como na foto
  const patinha = new THREE.Group();
  const coxim = new THREE.Mesh(new THREE.SphereGeometry(h * 0.011, 8, 6), preto);
  coxim.scale.set(1, 1.15, 0.3);
  patinha.add(coxim);
  for (let i = 0; i < 3; i++) {
    const dedo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.005, 6, 5), preto);
    dedo.position.set((i - 1) * h * 0.012, h * 0.016, 0);
    dedo.scale.z = 0.3;
    patinha.add(dedo);
  }
  patinha.position.set(raioBarra * 0.42, hipY - h * 0.005, raioBarra * 0.72 * ACHATA);
  patinha.rotation.y = 0.5;
  g.add(patinha);

  // ------------------------------------------------- a CARA DE GATO do peito
  // O peitilho do avental E o rosto: a aba retangular e a cara, e as duas
  // pontas de cima sao as orelhas. E o que faz esta peca ser esta peca.
  // A cara nasce EM CIMA do avental e vai ate meio peito. A primeira versao
  // punha ela mais alta e o laco vermelho caia bem no meio do rosto; na foto os
  // dois estao bem separados — laco no pescoco, gato no avental.
  const caraA = m.torsoH * 0.3;
  const caraY = aventalTopo + caraA * 0.5;
  const caraL = raioTorso * 1.62;
  const caraZ = raioTorso * 0.84;

  const cara = new THREE.Mesh(
    new THREE.BoxGeometry(caraL, caraA, h * 0.014),
    branco,
  );
  cara.position.set(0, caraY, caraZ);
  g.add(cara);

  // orelhas: cones de 4 lados, que na silhueta viram triangulos limpos
  for (const lado of [-1, 1] as const) {
    const orelha = new THREE.Mesh(
      new THREE.ConeGeometry(h * 0.028, h * 0.045, 4),
      branco,
    );
    orelha.position.set(lado * caraL * 0.32, caraY + caraA * 0.5 + h * 0.019, caraZ);
    // NADA de girar em X: `rotation.x = PI/2` deita o cone para tras e a orelha
    // some de frente — foi o que aconteceu na primeira versao. Ela fica em pe, e
    // o achatamento em Z e que a cola no avental.
    orelha.rotation.set(0, Math.PI / 4, lado * 0.26);
    orelha.scale.set(1, 1, 0.3);
    g.add(orelha);
  }

  // olhos fechados e felizes, como na foto: duas meias-luas
  for (const lado of [-1, 1] as const) {
    const olho = new THREE.Mesh(
      new THREE.TorusGeometry(h * 0.014, h * 0.004, 5, 10, Math.PI),
      preto,
    );
    olho.position.set(lado * caraL * 0.26, caraY + caraA * 0.08, caraZ + h * 0.009);
    olho.rotation.z = Math.PI;
    g.add(olho);
  }

  // boca: o traco pequeno no meio
  const boca = new THREE.Mesh(
    new THREE.TorusGeometry(h * 0.009, h * 0.003, 5, 10, Math.PI),
    preto,
  );
  boca.position.set(0, caraY - caraA * 0.12, caraZ + h * 0.009);
  boca.rotation.z = Math.PI;
  g.add(boca);

  // bigodes: tres de cada lado
  for (const lado of [-1, 1] as const) {
    for (let i = 0; i < 3; i++) {
      const bigode = new THREE.Mesh(
        new THREE.BoxGeometry(h * 0.036, h * 0.0035, h * 0.0035),
        preto,
      );
      bigode.position.set(
        lado * caraL * 0.4,
        caraY - caraA * 0.05 + (i - 1) * h * 0.012,
        caraZ + h * 0.008,
      );
      bigode.rotation.z = lado * (i - 1) * 0.24;
      g.add(bigode);
    }
  }

  // laco branco grande, na lateral do avental
  const lacoLateral = laco(h * 0.032, P.maidCreme);
  lacoLateral.position.set(-raioTorso * 1.25, hipY + m.torsoH * 0.16, raioTorso * 0.5);
  lacoLateral.rotation.y = -0.55;
  g.add(lacoLateral);

  // ------------------------------------------------------- gola e laco vermelho
  // gola redonda dupla, larga, cobrindo o ombro inteiro
  const gola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 0.6, raioTorso * 1.3, h * 0.018, 20, 1, true),
    brancoDuplo,
  );
  gola.position.y = ombroY + h * 0.008;
  gola.scale.z = ACHATA;
  g.add(gola);
  const rendaGola = babado(raioTorso * 1.3, h * 0.02, P.maidCreme, ACHATA);
  rendaGola.position.y = ombroY - h * 0.006;
  g.add(rendaGola);

  const gravata = laco(h * 0.05, P.maidLacoVermelho);
  // a FRENTE da gola, nao dentro dela: com z menor o laco afundava no anel
  gravata.position.set(0, hipY + m.torsoH * 0.78, raioTorso * 1.12);
  g.add(gravata);

  // o guizo dourado que pendura no meio do laco
  const guizo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.016, 10, 8), toon(P.gold, { glow: 0.2 }));
  guizo.position.set(0, hipY + m.torsoH * 0.71, raioTorso * 1.16);
  g.add(guizo);

  // -------------------------------------------------------- mangas bufantes
  for (const lado of [-1, 1] as const) {
    const bufante = mangaBufante(h * 0.056 * w, P.maidPreto);
    bufante.position.set(lado * meioOmbro, ombroY - h * 0.012, 0);
    g.add(bufante);

    // o babado branco na boca da manga
    const punho = babado(h * 0.05 * w, h * 0.024, P.maidCreme, 1);
    punho.position.set(lado * meioOmbro, ombroY - h * 0.058, 0);
    g.add(punho);
  }

  return g;
}

/**
 * Coracao chato, apontando para baixo.
 *
 * O `heart` de `props.ts` nao serve aqui: ele tem material rosa com brilho
 * cravado, porque nasceu para os coracoes que sobem no beijo. Este aceita cor e
 * e achatado, para virar festao de renda na barra da saia.
 */
function coracaoChato(raio: number, cor: number): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  for (const lado of [-1, 1] as const) {
    const lobo = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.56, 8, 6), mat);
    lobo.position.set(lado * raio * 0.44, raio * 0.34, 0);
    lobo.scale.z = 0.34;
    g.add(lobo);
  }
  const bico = new THREE.Mesh(new THREE.ConeGeometry(raio * 0.78, raio * 1.2, 10), mat);
  bico.position.y = -raio * 0.34;
  bico.rotation.x = Math.PI;
  bico.scale.z = 0.34;
  g.add(bico);
  return g;
}

/**
 * Maid japones (wa-maid), rosa e preto, das duas ilustracoes de referencia.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO. A MANGA nao esta aqui — ela e
 * `mangaDeQuimono` e mora no pivo do braco, senao fica parada enquanto o braco
 * balanca.
 *
 * A leitura, de cima para baixo: quimono rosa cruzado no peito, corselete preto
 * alto com a fivela prateada, laco rosa grande com as fitas caindo, avental
 * branco, saia preta plissada e, na barra, o festao de coracoes que e o que
 * mais identifica esta roupa nas duas referencias.
 */
function maidJapones(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const ACHATA = 0.85;

  const rosa = toon(P.waRosa);
  const rosaDuplo = toon(P.waRosa, { doubleSide: true });
  const rosaForte = toon(P.waRosaForte);
  const escuro = toon(P.waEscuro);
  const escuroDuplo = toon(P.waEscuro, { doubleSide: true });
  const branco = toon(P.waBranco, { doubleSide: true });

  // ------------------------------------------------------- saia plissada
  const topoSaia = hipY + m.torsoH * 0.1;
  const barra = hipY - h * 0.135;
  const raioBarra = raioTorso * 2.0;

  const saia = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.02, raioBarra, topoSaia - barra, 22, 1, true),
    escuroDuplo,
  );
  saia.position.y = (topoSaia + barra) / 2;
  saia.scale.z = ACHATA;
  g.add(saia);

  // as PREGAS: quinas verticais em volta do cone. Sem elas a saia e um funil
  // liso, e plissado e o que as duas referencias mostram.
  // Cada prega mora num PIVO girado em Y, e a inclinacao vai dentro dele.
  //
  // A primeira versao somava um `rotation.x` e um `rotation.z` calculados com
  // seno e cosseno do angulo. Rotacao de Euler nao se compoe assim: as pregas
  // sairam da parede do cone e furaram o avental como espetos pretos. Com o
  // pivo, o giro e a inclinacao ficam em niveis separados e nao se misturam.
  const pregas = 16;
  const raioTopo = raioTorso * 1.02;
  const altura = topoSaia - barra;
  const inclinacao = -Math.atan2(raioBarra - raioTopo, altura);
  for (let i = 0; i < pregas; i++) {
    const pivo = new THREE.Group();
    pivo.rotation.y = (i / pregas) * Math.PI * 2;
    const prega = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.011, altura * 0.94, h * 0.009),
      escuro,
    );
    prega.position.set(0, (topoSaia + barra) / 2, (raioTopo + raioBarra) / 2);
    prega.rotation.x = inclinacao;
    pivo.add(prega);
    pivo.scale.z = ACHATA;
    g.add(pivo);
  }

  // festao de coracoes na barra — a marca da roupa
  const quantosCoracoes = 13;
  for (let i = 0; i < quantosCoracoes; i++) {
    const a = (i / quantosCoracoes) * Math.PI * 2;
    const c = coracaoChato(h * 0.034, P.waEscuro);
    c.position.set(
      Math.sin(a) * raioBarra * 1.03,
      barra - h * 0.016,
      Math.cos(a) * raioBarra * 1.03 * ACHATA,
    );
    c.rotation.y = a;
    g.add(c);
  }

  // --------------------------------------------------------------- avental
  const aventalTopo = hipY + m.torsoH * 0.16;
  const aventalBarra = hipY - h * 0.095;
  const avental = new THREE.Mesh(
    new THREE.CylinderGeometry(
      raioTorso * 1.02, raioBarra * 0.9, aventalTopo - aventalBarra, 16, 1, true,
      -1.25, 2.5,
    ),
    branco,
  );
  avental.position.y = (aventalTopo + aventalBarra) / 2;
  avental.scale.z = ACHATA;
  g.add(avental);
  const babadoAvental = babado(raioBarra * 0.92, h * 0.03, P.waBranco, ACHATA);
  babadoAvental.position.y = aventalBarra;
  g.add(babadoAvental);

  // ------------------------------------------------------------- corselete
  // alto e preto, cobrindo da cintura ate embaixo do peito
  const cinturaBaixo = hipY + m.torsoH * 0.14;
  const cinturaAlto = hipY + m.torsoH * 0.5;
  const corselete = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.07, raioTorso * 1.1, cinturaAlto - cinturaBaixo, 18, 1, true),
    escuroDuplo,
  );
  corselete.position.y = (cinturaAlto + cinturaBaixo) / 2;
  corselete.scale.z = ACHATA;
  g.add(corselete);

  // a tira preta que sobe pelo peito, com a fivela prateada
  const tiraPeito = new THREE.Mesh(
    new THREE.BoxGeometry(raioTorso * 0.62, m.torsoH * 0.26, h * 0.012),
    escuro,
  );
  tiraPeito.position.set(0, hipY + m.torsoH * 0.6, raioTorso * 0.82);
  g.add(tiraPeito);
  const fivela = new THREE.Mesh(
    new THREE.TorusGeometry(h * 0.019, h * 0.005, 6, 12),
    toon(P.waFivela),
  );
  fivela.position.set(0, hipY + m.torsoH * 0.56, raioTorso * 0.89);
  fivela.scale.set(1.25, 1, 1);
  g.add(fivela);

  // ------------------------------------------------------- quimono cruzado
  // duas abas rosa cruzando uma sobre a outra, que e a frente de um quimono
  for (const lado of [-1, 1] as const) {
    const aba = new THREE.Mesh(
      new THREE.BoxGeometry(raioTorso * 1.15, m.torsoH * 0.42, h * 0.013),
      rosa,
    );
    aba.position.set(lado * raioTorso * 0.24, hipY + m.torsoH * 0.68, raioTorso * 0.76);
    aba.rotation.z = lado * 0.52;
    g.add(aba);
  }
  // gola do quimono, subindo pela nuca
  const gola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 0.78, raioTorso * 0.92, m.torsoH * 0.2, 16, 1, true),
    rosaDuplo,
  );
  gola.position.y = ombroY - m.torsoH * 0.02;
  gola.scale.z = ACHATA;
  g.add(gola);

  // ----------------------------------------------------- laco e fitas rosa
  const lacoCintura = laco(h * 0.05, P.waRosaForte);
  lacoCintura.position.set(0, cinturaBaixo + h * 0.014, raioTorso * 1.12);
  g.add(lacoCintura);

  // as duas fitas COMPRIDAS, que nas referencias descem quase ate a barra
  for (const lado of [-1, 1] as const) {
    const fitaLonga = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.026, h * 0.2, h * 0.008),
      rosaForte,
    );
    fitaLonga.position.set(lado * h * 0.022, cinturaBaixo - h * 0.09, raioBarra * 0.78);
    fitaLonga.rotation.z = lado * 0.1;
    g.add(fitaLonga);
    // a ponta em bico da fita
    const ponta = new THREE.Mesh(
      new THREE.ConeGeometry(h * 0.018, h * 0.03, 4),
      rosaForte,
    );
    ponta.position.set(lado * h * 0.024, cinturaBaixo - h * 0.2, raioBarra * 0.8);
    ponta.rotation.set(Math.PI, Math.PI / 4, 0);
    ponta.scale.z = 0.3;
    g.add(ponta);
  }

  // gargantilha preta com fivelinha, que aparece nas duas referencias
  const coleira = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.043, h * 0.045, h * 0.022, 14, 1, true),
    escuroDuplo,
  );
  coleira.position.y = ombroY + m.torsoH * 0.12;
  g.add(coleira);

  return g;
}

/**
 * A manga de quimono, pendurada em CADA braco.
 *
 * REFERENCIAL: o pivo do braco, y = 0 no ombro, braco pendendo em -Y.
 *
 * Ela e o que faz esta roupa ser esta roupa nas referencias: enorme, preta por
 * fora, com o punho branco de babado, caindo bem abaixo da mao. Por isso ela
 * mora no braco e nao no corpo — desse tamanho, parada enquanto o braco
 * balanca, ela denunciaria na primeira passada.
 *
 * O deslocamento em X e para FORA: com a boca larga centrada no eixo do braco,
 * a manga entraria no tronco, que esta a menos de um raio de distancia.
 */
function mangaDeQuimono(m: MedidasCorpo, lado: -1 | 1): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const armLen = h * 0.3;
  // Para FORA, e nao centrada no braco.
  //
  // O ombro esta a `h*0.1*w` do eixo e o torso tem raio `h*0.105*w`: uma boca
  // larga centrada no braco cobre o corpo inteiro, e foi o que a primeira
  // versao fez — a manga virou uma capa e engoliu a roupa toda. Deslocada para
  // fora, a borda de dentro passa RENTE ao tronco e a silhueta fica ao lado.
  //
  // E `lado` MULTIPLICA esse deslocamento. O braco esquerdo nasce em -X: sem o
  // sinal, a copia dele empurrava a manga para +X, ou seja para dentro do
  // corpo, e um dos dois bracos ficava torto. Mesma pegadinha do frisbee.
  const paraFora = lado * h * 0.052 * w;
  const bocaR = h * 0.068 * w;

  // ATE ONDE ELA DESCE, que e a medida que mais se erra aqui.
  //
  // O ombro esta a `legH + torsoH*0.86` do chao e a mao a `armLen*0.92` abaixo
  // dele. A primeira versao levava a boca a `1.52 x armLen`, o que no Ari poe a
  // barra em y ≈ 0,13 — quase raspando o chao. Ela para em `1.2`, um palmo
  // abaixo da mao, que e a meia-coxa das referencias.
  const ATE = 1.2;

  const corpo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.045 * w, bocaR, armLen * 0.94, 14, 1, true),
    toon(P.waEscuro, { doubleSide: true }),
  );
  corpo.position.set(paraFora * 0.45, -armLen * 0.44, 0);
  corpo.scale.z = 0.78;
  g.add(corpo);

  // a aba que cai abaixo da mao, o pedaco mais marcante da silhueta
  const aba = new THREE.Mesh(
    new THREE.CylinderGeometry(bocaR, bocaR * 0.86, armLen * 0.38, 14, 1, true),
    toon(P.waEscuro, { doubleSide: true }),
  );
  aba.position.set(paraFora, -armLen * (ATE - 0.19), 0);
  aba.scale.z = 0.78;
  g.add(aba);

  // punho branco de babado na boca
  const punho = babado(bocaR * 0.9, h * 0.024, P.waBranco, 0.78);
  punho.position.set(paraFora, -armLen * ATE, 0);
  g.add(punho);

  return g;
}

/**
 * Meia branca de coxa, com a liga rosa.
 *
 * REFERENCIAL: o pivo da perna, y = 0 no quadril — o mesmo do cano da bota.
 * A meia e uma peca de PERNAS, entao a cor da propria perna ja vem da ficha; o
 * que esta aqui e so o que a cor nao da: a liga e a barra de renda.
 */
function meiaDeCoxa(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const alturaDaMeia = -m.legH * 0.28;

  // a barra da meia, um pouco mais grossa que a perna
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.047 * w, h * 0.047 * w, h * 0.022, 14, 1, true),
    toon(P.waBranco, { doubleSide: true }),
  );
  barra.position.y = alturaDaMeia;
  g.add(barra);

  // a liga rosa logo acima
  const liga = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.049 * w, h * 0.049 * w, h * 0.014, 14, 1, true),
    toon(P.waRosaForte, { doubleSide: true }),
  );
  liga.position.y = alturaDaMeia + h * 0.026;
  g.add(liga);

  const lacinho = laco(h * 0.013, P.waRosaForte);
  lacinho.position.set(0, alturaDaMeia + h * 0.026, h * 0.05 * w);
  g.add(lacinho);

  return g;
}

/**
 * Moletom preto com capuz, da foto no espelho da loja.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO — o mesmo do vestido e da jaqueta.
 *
 * O pedido era explicito: uma CASCA por cima do boneco, como o vestido, e nao
 * uma repintura do torso. Entao ela nao acompanha a silhueta — o casco e mais
 * largo que o tronco, tem ombro, gola e barra proprios. Quem so repinta o torso
 * e a camisa listrada, que nem geometria tem.
 *
 * ## Onde a barra para, e por que nao mais embaixo
 *
 * Ela para na altura da MAO, um dedo acima dela. Nao e gosto: o braco deste rig
 * e curto, e a mao pende a `0.262·h` do chao, com o quadril logo acima, a
 * `0.28·h`. Qualquer barra mais comprida que isso passa POR FORA da mao, e como
 * o braco fica colado no corpo a mao nao tem para onde escapar — ela vira um
 * calombo cor de pele no meio do pano, que foi exatamente como saiu a primeira
 * versao, com a barra a `0.085·h` abaixo do quadril. E o jeito de descer mais
 * seria alargar o casco ate engolir a mao inteira, e ai a dupla fica sem mao.
 *
 * Na foto a barra tambem bate na mao dele, entao a peca nao perde nada: e um
 * moletom que termina no quadril, com o cordao franzindo a barra.
 *
 * ## As tampas do cilindro nao sao desperdicio
 *
 * O casco e FECHADO em cima e embaixo. Aberto, a camera baixa enxerga o lado de
 * dentro dele e o torso da ficha la dentro pela boca da barra; fechado, a tampa
 * de baixo vira o forro e as pernas saem por ela.
 *
 * ## O capuz fica ATRAS
 *
 * Na foto ele esta caido, entao o que aparece na frente e so a GOLA acolchoada
 * em volta do pescoco — o volume do capuz mesmo empilha atras da nuca. Por isso
 * a calota nasce em z negativo: trazida para o meio, ela sairia pela cara.
 *
 * A MANGA nao esta aqui — ela e `mangaDeMoletom` e mora no pivo do braco, senao
 * ficaria parada enquanto o braco balanca.
 */
function moletomComCapuz(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const topoTorso = hipY + m.torsoH;
  // Quase redondo, e nao achatado como o torso (que tem `scale.z = 0.82`):
  // jaqueta acolchoada enche o peito e as costas. O volume dela vem da
  // PROFUNDIDADE, e nao da largura — ver a conta do raio logo abaixo.
  const ACHATA = 0.95;

  const preto = toon(P.moletomPreto);
  const pretoDuplo = toon(P.moletomPreto, { doubleSide: true });
  const costura = toon(P.moletomCostura);
  const ziperMat = toon(P.moletomZiper);
  const forro = toon(P.moletomForro, { doubleSide: true });

  // O RAIO NAO PODE CRESCER A VONTADE, e essa foi a primeira versao errada.
  //
  // O braco deste rig fica colado no corpo: o pivo esta a `0.086·h` do eixo e a
  // manga tem `0.048·h` de raio, entao o braco ocupa de `0.038·h` a `0.134·h`.
  // Um casco de `0.114·h` (o que da um `raioTorso * 1.26`) cobre quase tudo
  // isso, e a silhueta vira um bloco unico sem braco nenhum. Com `1.1` a manga
  // passa por FORA e o braco reaparece.
  //
  // A barra fecha um degrau (`1.04`, mais estreita que o peito) porque o cordao
  // franze ela — e a silhueta reta da foto, e nao uma capa rodada.
  const RAIO = raioTorso * 1.1;
  const RAIO_BARRA = raioTorso * 1.04;
  // um dedo acima da mao, que pende a `0.262·h` — ver o cabecalho
  const BARRA = hipY + h * 0.012;
  const TOPO = ombroY + m.torsoH * 0.03;
  const frenteZ = RAIO * ACHATA;

  // ------------------------------------------------------------------ casco
  const casco = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO, RAIO_BARRA, TOPO - BARRA, 22),
    preto,
  );
  casco.position.y = (TOPO + BARRA) / 2;
  casco.scale.z = ACHATA;
  g.add(casco);

  // ombro acolchoado: a calota que arredonda o topo do casco. Baixa de
  // proposito (`scale.y` 0.42) — uma meia-esfera inteira sobe ate o queixo e
  // engole a mandibula, que fica a `0.566·h` do chao.
  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    preto,
  );
  ombro.position.y = TOPO;
  ombro.scale.set(1, 0.42, ACHATA);
  g.add(ombro);

  // barra: o canal do cordao, um anel um degrau mais largo na boca de baixo
  const bainha = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO_BARRA * 1.03, RAIO_BARRA * 1.01, h * 0.022, 22, 1, true),
    pretoDuplo,
  );
  bainha.position.y = BARRA + h * 0.011;
  bainha.scale.z = ACHATA;
  g.add(bainha);

  // ------------------------------------------------------------------ gola
  //
  // Ela ABRE para cima, como a gola de capuz da foto, e nao e um colarinho reto.
  // A conta que manda aqui e o CRANIO, que neste rig e maior que o tronco
  // (`0.17·h` de raio contra `0.105·h`): na boca da gola, a `0.63·h` do chao, a
  // cabeca ainda tem `0.136·h` de raio. Uma gola mais estreita que isso nasce
  // INTEIRA por tras da cabeca e nao aparece de frente — foi o que aconteceu na
  // primeira versao, com `1.42`. Com `1.75` sobra um anel em volta do queixo, e
  // e ele que faz a peca ler como capuz caido em vez de casaco de gola careca.
  const golaY = topoTorso + h * 0.015;
  const gola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.75, raioTorso * 1.15, h * 0.07, 20, 1, true),
    pretoDuplo,
  );
  gola.position.y = golaY;
  gola.scale.z = 0.95;
  g.add(gola);

  // o forro cinza, um degrau para dentro: e ele que aparece na dobra da gola na
  // foto, e o que da profundidade a boca do capuz
  const forroGola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.62, raioTorso * 1.05, h * 0.066, 20, 1, true),
    forro,
  );
  forroGola.position.y = golaY - h * 0.003;
  forroGola.scale.z = 0.95;
  g.add(forroGola);

  // ------------------------------------------------------------------ capuz
  //
  // DEITADO nas costas, e nao empilhado atras da nuca: na primeira versao ele
  // era quase uma esfera e saia como uma bola presa entre as omoplatas. Achatado
  // em Z (`0.62`) e alargado em X (`1.4`) ele vira o pano dobrado que a foto
  // mostra caindo por cima das costas.
  const capuz = new THREE.Mesh(
    new THREE.SphereGeometry(raioTorso * 1.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6),
    pretoDuplo,
  );
  capuz.position.set(0, ombroY + m.torsoH * 0.14, -raioTorso * 0.72);
  capuz.rotation.x = -1.25;
  capuz.scale.set(1.4, 0.95, 0.62);
  g.add(capuz);

  // ------------------------------------------------------------------ ziper
  // Sobe do quadril ate dentro da gola, fechado — na foto ele esta fechado ate
  // em cima. E a unica linha vertical da peca, e sem ela a frente e uma parede
  // preta lisa.
  const ziperTopo = golaY + h * 0.005;
  const ziperBaixo = BARRA + h * 0.014;
  const ziper = new THREE.Mesh(
    new THREE.BoxGeometry(h * 0.014, ziperTopo - ziperBaixo, h * 0.018),
    ziperMat,
  );
  ziper.position.set(0, (ziperTopo + ziperBaixo) / 2, frenteZ * 0.99);
  g.add(ziper);

  // o cursor, na altura do peito, como na foto
  const cursor = new THREE.Mesh(
    new THREE.BoxGeometry(h * 0.02, h * 0.026, h * 0.012),
    costura,
  );
  cursor.position.set(0, hipY + m.torsoH * 0.5, frenteZ * 1.03);
  g.add(cursor);

  // ------------------------------------------------- costura do peito (canga)
  // a linha horizontal que cruza o peito na altura da axila
  const canga = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO * 1.012, RAIO * 1.012, h * 0.007, 22, 1, true),
    toon(P.moletomCostura, { doubleSide: true }),
  );
  canga.position.y = hipY + m.torsoH * 0.68;
  canga.scale.z = ACHATA;
  g.add(canga);

  // ---------------------------------------------------------------- bolsos
  // Cada bolso mora num PIVO girado em Y, e a inclinacao da boca vai DENTRO
  // dele. E o mesmo cuidado das pregas do maid japones: somar um `rotation.y`
  // com um `rotation.z` no mesmo objeto nao compoe do jeito que parece, e a
  // peca sai da parede do casco.
  for (const lado of [-1, 1] as const) {
    const pivo = new THREE.Group();
    pivo.rotation.y = lado * 0.62;
    pivo.scale.z = ACHATA;

    const boca = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.013, h * 0.062, h * 0.012),
      costura,
    );
    // acima da barra: com a barra no quadril, um bolso mais baixo sairia pela
    // boca do casco
    boca.position.set(0, hipY + m.torsoH * 0.2, RAIO * 1.0);
    // a boca do bolso e inclinada, como na foto — e o sinal segue o lado, senao
    // os dois bolsos apontam para o mesmo canto
    boca.rotation.z = lado * 0.36;
    pivo.add(boca);

    g.add(pivo);
  }

  // ------------------------------------------------- ponteiras do cordao
  // os dois cadarcos claros que pendem na barra, dos dois lados do ziper
  for (const lado of [-1, 1] as const) {
    const ponta = new THREE.Mesh(
      new THREE.CylinderGeometry(h * 0.006, h * 0.006, h * 0.016, 8),
      toon(P.moletomPonteira),
    );
    ponta.position.set(lado * h * 0.022, BARRA + h * 0.006, RAIO_BARRA * ACHATA * 0.99);
    g.add(ponta);
  }

  return g;
}

/**
 * A manga do moletom, pendurada em CADA braco.
 *
 * REFERENCIAL: o pivo do braco, y = 0 no ombro, braco pendendo em -Y.
 *
 * Ela e SIMETRICA e por isso nao pede `lado`: e um tubo centrado no eixo do
 * braco, e nao ha deslocamento lateral cujo sinal possa inverter — que e a
 * pegadinha que torceu a manga de quimono. Se um dia ela ganhar deslocamento em
 * X, o parametro volta junto.
 *
 * Ela para em `0.82 x armLen`, um dedo acima da mao (que esta em `0.92`): na
 * foto o punho fica de fora, e uma manga que passasse da mao engoliria o que a
 * pessoa estivesse segurando.
 */
function mangaDeMoletom(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const armLen = h * 0.3;
  const ATE = 0.82;

  // a bola do ombro fecha a juncao com o casco: sem ela, o braco levantado abre
  // uma fresta entre a manga e o corpo
  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.058 * w, 12, 10),
    toon(P.moletomPreto),
  );
  ombro.position.y = -armLen * 0.03;
  ombro.scale.set(1, 0.92, 0.95);
  g.add(ombro);

  const tubo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.056 * w, h * 0.046 * w, armLen * ATE, 14, 1, true),
    toon(P.moletomPreto, { doubleSide: true }),
  );
  tubo.position.y = -armLen * ATE * 0.5;
  g.add(tubo);

  // o punho fecha a boca do tubo — e a mao sai por ele
  const punho = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.047 * w, h * 0.045 * w, h * 0.022, 14),
    toon(P.moletomCostura),
  );
  punho.position.y = -armLen * ATE;
  g.add(punho);

  return g;
}

/**
 * ============================== A ALTURA E O RAIO DAS PECAS DE PESCOCO
 *
 * As duas pecas de pescoco (a gargantilha e a gravatinha do Walter) moram na
 * CABECA e sofrem do mesmo problema geometrico, entao a conta e uma so.
 *
 * ESTE RIG NAO TEM PESCOCO A MOSTRA. O cilindro de pescoco vai ate `-0,1695·h`
 * e o topo da capsula do torso chega a `-0,120·h` (em espaco de cabeca): o
 * torso literalmente encosta no queixo. Quem esta na frente de uma peca de
 * pescoco nao e o pescoco de raio `0,04·h` — e o alto do peito, de
 * `0,105·h·w`. Medir pelo pescoco foi o que fez a gravatinha nascer inteira
 * dentro do corpo, com so o bico do laco escapando.
 *
 * ALTURA (`Y_PESCOCO`): `-1,18·headR`, e nao `-0,98`. O cranio e uma esfera de
 * raio `headR` (achatada 1,04 em y), entao a `-0,98·headR` ele ainda tem
 * `0,116·h` de raio na altura do TOPO do laco — e o laco, que precisa estar a
 * `0,12·h` da frente para escapar do peito, raspava o queixo. Descendo para
 * `-1,18` o cranio ali ja tem so `0,067·h`, e a peca passa longe.
 */
const Y_PESCOCO = -1.18;

/** Onde a superficie do peito esta, na altura de uma peca de pescoco. */
function peitoNaAlturaDoPescoco(m: MedidasCorpo): number {
  const raioTorso = m.h * 0.105 * m.w;
  // a capsula do torso e cilindro ate `legH + 0,77·torsoH`; dali para cima e um
  // capuz esferico, e a superficie na altura da peca e o cateto que sobra
  const altura = m.legH + m.torsoH + m.headR * 0.92 + m.headR * Y_PESCOCO;
  const acima = Math.max(0, altura - (m.legH + m.torsoH * 0.77));
  return Math.max(
    raioTorso * 0.45, // piso: nem numa pessoa mais alta a peca encolhe ate o pescoco
    Math.sqrt(Math.max(0, raioTorso * raioTorso - acima * acima)),
  );
}

/**
 * Gargantilha de laco, a que aparece no pescoco da vitrine.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio — por isso os numeros sao
 * negativos. A altura e o raio saem de `Y_PESCOCO` e `peitoNaAlturaDoPescoco`,
 * pelo mesmo motivo que a gravatinha do Walter: medida pelo pescoco ela nascia
 * enterrada no peito e so o laco aparecia, solto no ar.
 */
function gargantilhaDeLaco(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const y = m.headR * Y_PESCOCO;
  const peito = peitoNaAlturaDoPescoco(m);

  const fita = new THREE.Mesh(
    new THREE.CylinderGeometry(peito * 1.03, peito * 1.06, m.h * 0.02, 16, 1, true),
    toon(P.vestidoRenda, { doubleSide: true }),
  );
  fita.position.y = y;
  g.add(fita);

  const l = laco(m.h * 0.026, P.vestidoFita, P.vestidoRenda);
  l.position.set(0, y, peito + m.h * 0.012);
  g.add(l);

  return g;
}

/**
 * A GRAVATINHA DO WALTER — a que ele mesmo tira do pescoco e da de presente
 * quando o turno do Mania fecha com tres estrelas.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio. E o mesmo endereco da
 * gargantilha, e pela mesma razao: o pescoco fica LOGO ABAIXO da cabeca, e a
 * peca precisa acompanhar a cabeca quando ela vira. Slot `cabeca` foi pedido
 * do Renan — o preco e que ela nao convive com chapeu, que e a outra peca dessa
 * vaga.
 *
 * O LACO DA GRAVATA NAO E O `laco()` da fita. Aquele tem as duas pontas
 * caindo, que e o laco de presente; gravata borboleta nao tem ponta solta — sao
 * duas asas em CUNHA (estreitas no no, largas na ponta) e um no no meio. Usar
 * o `laco` aqui daria uma fitinha de embrulho no pescoco.
 *
 * As cores sao as MESMAS do Walter (`P.gravataBorboleta`/`P.gravataNo`), e nao
 * um vermelho parecido: e para ser a gravata dele, e nao uma igual.
 */
function gravataDoWalter(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  // a mesma altura e a mesma medida de peito da gargantilha — as duas contas
  // moram no bloco de `Y_PESCOCO`, logo acima
  const y = m.headR * Y_PESCOCO;
  const peito = peitoNaAlturaDoPescoco(m);
  const fita = toon(P.gravataBorboleta);

  // a tira em volta do pescoco, aberta (casca de cilindro) para nao virar um
  // colar macico visto de cima
  // a tira é do MESMO vermelho das asas, e não do tom escuro do nó: escura,
  // ela virava o desenho todo e a gravata lia como uma coleira preta no boneco
  // de camisa branca. O tom escuro fica só no nó, que é onde ele diz "dobra"
  const colarinho = new THREE.Mesh(
    // baixa e justa: alta e larga ela lia como uma bandana no peito, e quem
    // tem que puxar o olho aqui e o laco, nao a tira
    new THREE.CylinderGeometry(peito * 1.04, peito * 1.07, m.h * 0.018, 16, 1, true),
    toon(P.gravataBorboleta, { doubleSide: true }),
  );
  colarinho.position.y = y;
  g.add(colarinho);

  /**
   * As duas asas, POR FORA do peito. O `lado` multiplica o deslocamento — sem
   * ele as duas caem no mesmo x e a gravata vira um nó solto.
   *
   * `frente` sai da superfície medida acima mais a metade da espessura da asa:
   * é o que garante que ela apareça inteira em vez de meio enterrada. E a asa
   * é ACHATADA em z (`scale.z`), como laço de fita de verdade — chapada, ela
   * avança menos para dentro do corpo e sobra mais para fora.
   */
  const achatamento = 0.55;
  const frente = peito + m.h * 0.032 * achatamento + m.h * 0.004;
  for (const lado of [-1, 1] as const) {
    const asa = new THREE.Mesh(
      new THREE.CylinderGeometry(m.h * 0.034, m.h * 0.009, m.h * 0.066, 4),
      fita,
    );
    // o cilindro de 4 lados nasce em pe: deitar no X e girar 90 graus em Z, e
    // o `lado` decide para que lado a ponta larga aponta
    asa.rotation.z = lado * Math.PI / 2;
    asa.rotation.y = Math.PI / 4;
    asa.scale.z = achatamento;
    asa.position.set(lado * m.h * 0.04, y + m.h * 0.004, frente);
    g.add(asa);
  }

  // o no, no meio das duas asas e um fio a frente delas
  const no = new THREE.Mesh(
    new THREE.BoxGeometry(m.h * 0.022, m.h * 0.028, m.h * 0.022),
    toon(P.gravataNo),
  );
  no.position.set(0, y + m.h * 0.004, frente + m.h * 0.008);
  g.add(no);

  return g;
}

/**
 * Oculos de sol do vestiario do clube.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio — o mesmo do gorro. Os
 * olhos do rig ficam em `(±0.35·headR, 0, 0.9·headR)`, e a lente pousa em
 * cima deles.
 *
 * A CONTA que importa e a PROFUNDIDADE, e e a que derrubou a primeira versao:
 * ela punha a lente em `z = 0.9·headR`, que parecia a frente do rosto e nao
 * era. O cranio e uma esfera de raio `headR`, entao a superficie recua com o
 * afastamento do eixo: em `x = 0.36·headR`, ela ja esta em `0.93·headR`, e a
 * lente ficou inteira DENTRO da cabeca — invisivel. Os olhos do rig chegam a
 * `0.98·headR` (esfera achatada em Z, empurrada para fora), e um oculos que os
 * cobre precisa passar disso. Daí `0.96·headR` de centro com `0.09` de
 * espessura: a face da frente sai em `1.005`, na frente do olho, e a de tras
 * afunda no cranio em vez de flutuar.
 *
 * A HASTE segue a mesma logica ao contrario: ela sai da dobradica INCLINADA
 * para fora e AFUNDA no cranio antes da orelha. Afundar e o certo — a esfera
 * cresce mais rapido que qualquer reta, e uma haste que tentasse acompanhar a
 * curva por fora ficaria boiando na frente da orelha.
 *
 * Esta peca e de cabeca e tem copia UNICA, entao o lado nao vem de fora: os
 * dois lados sao montados aqui dentro, e o espelho e `x · side` com o angulo
 * da haste negado junto — sem negar o angulo, a haste da esquerda apontaria
 * para dentro da cabeca, que e a mesma pegadinha de sinal de sempre.
 */
function oculosDeSol(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const lente = toon(P.oculosLente);
  const armacao = toon(P.oculosArmacao);

  // altura dos olhos, um fio acima: oculos escorregado no nariz e outro visual
  const Y = r * 0.04;
  /** raio da lente */
  const RL = r * 0.26;
  /**
   * O quanto a peca inteira se afasta do centro do cranio. A lente fica LONGE
   * do meio do rosto (`x = ±0.35·r`), e a esfera ja recuou ali — no eixo dela a
   * superficie passa perto de `0.94·r`, nao de `r`. Com a lente maior, a borda
   * de baixo recua ainda mais. Daí `1.07`: a peca toda flutua um fio na frente
   * do rosto em vez de cortar a bochecha.
   */
  const FRENTE = r * 1.07;

  for (const side of [-1, 1] as const) {
    // LENTE REDONDA: cilindro achatado, deitado.
    //
    // `rotation.x = PI/2` deita o cilindro — o eixo dele nasce em Y, e girar
    // 90° em X leva esse eixo para Z, que e para onde o rosto olha. So assim a
    // face CIRCULAR fica de frente; sem o giro se veria a lateral do tubo.
    //
    // As duas lentes ficam RETAS, no MESMO plano — sem giro em Y. Ja teve um
    // `rotation.y` aqui para "acompanhar a curva do rosto", e o efeito era o
    // contrario do pretendido: cada lente apontava para um lado, o oculos
    // deixava de ter uma frente unica e de perto lia como concavo.
    const vidro = new THREE.Mesh(
      new THREE.CylinderGeometry(RL, RL, r * 0.07, 20),
      lente,
    );
    vidro.rotation.x = Math.PI / 2;
    vidro.position.set(side * r * 0.38, Y, FRENTE);
    g.add(vidro);

    // o aro: um anel fino em volta da lente, um fio maior que ela. Torus e a
    // forma certa aqui — ele ja e o contorno, sem precisar de duas pecas.
    const aro = new THREE.Mesh(
      new THREE.TorusGeometry(RL, r * 0.03, 8, 20),
      armacao,
    );
    aro.position.set(side * r * 0.38, Y, FRENTE + r * 0.005);
    g.add(aro);

    // A HASTE, da dobradica ate sumir na altura da orelha — ver o cabecalho.
    const ax = r * 0.6;
    const az = FRENTE - r * 0.06;
    const bx = r * 0.78;
    const bz = r * 0.4;
    const dx = bx - ax;
    const dz = bz - az;
    const haste = new THREE.Mesh(
      new THREE.BoxGeometry(r * 0.05, r * 0.07, Math.hypot(dx, dz)),
      armacao,
    );
    haste.position.set(side * (ax + bx) / 2, Y + r * 0.07, (az + bz) / 2);
    haste.rotation.y = side * Math.atan2(dx, dz);
    g.add(haste);
  }

  // A ponte sobre o nariz: um cilindro fino DEITADO no eixo X, ligando as duas
  // lentes. Deitar no X e `rotation.z = PI/2` (o eixo do cilindro nasce em Y).
  const ponte = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.025, r * 0.025, r * 0.34, 8),
    armacao,
  );
  ponte.rotation.z = Math.PI / 2;
  ponte.position.set(0, Y + r * 0.07, FRENTE + r * 0.02);
  g.add(ponte);

  return g;
}

/* ======================================================================
 *            OS PREMIOS DA ARENA — uma peca por desafiante batido
 * ======================================================================
 *
 * Estas quatro nao estao a venda em lugar nenhum e nao estao no armario do
 * Ari: elas so entram no guarda-roupa depois de uma partida ganha no quadro de
 * inscricoes. E o mesmo precedente da gravatinha do Walter, agora com quatro
 * donos — e por isso cada uma leva a cara de quem deu.
 */

/**
 * Jaqueta azul da Franca, o premio do Jean-Luc.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO — igual ao moletom, que e a vizinha dela
 * na vaga do tronco. As cotas de raio e de barra sao as MESMAS do moletom, e
 * nao um chute novo: o braco deste rig fica colado no corpo, e um casco mais
 * gordo que `raioTorso * 1.1` engole a manga e apaga o braco da silhueta.
 *
 * A leitura, de cima para baixo: gola branca de time, ombro arredondado,
 * faixa azul-branco-vermelha atravessando o peito (a bandeira deitada, que e
 * como ela aparece na camisa que ele ja veste), o bico de pato bordado do lado
 * do coracao e a barra branca fechando embaixo.
 */
function jaquetaFrancesa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const topoTorso = hipY + m.torsoH;
  const ACHATA = 0.93;

  const azul = toon(peca?.cor ?? P.jaquetaFranca);
  const azulDuplo = toon(peca?.cor ?? P.jaquetaFranca, { doubleSide: true });
  const branco = toon(P.jaquetaFrancaGola);
  const brancoDuplo = toon(P.jaquetaFrancaGola, { doubleSide: true });
  const vermelho = toon(P.jaquetaFrancaFita, { doubleSide: true });

  const RAIO = raioTorso * 1.1;
  const RAIO_BARRA = raioTorso * 1.05;
  const BARRA = hipY + h * 0.012;
  const TOPO = ombroY + m.torsoH * 0.03;
  const frenteZ = RAIO * ACHATA;

  const casco = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO, RAIO_BARRA, TOPO - BARRA, 22),
    azul,
  );
  casco.position.y = (TOPO + BARRA) / 2;
  casco.scale.z = ACHATA;
  g.add(casco);

  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    azul,
  );
  ombro.position.y = TOPO;
  ombro.scale.set(1, 0.42, ACHATA);
  g.add(ombro);

  // a barra branca de punho: o mesmo canal do moletom, noutra cor
  const bainha = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO_BARRA * 1.03, RAIO_BARRA * 1.01, h * 0.026, 22, 1, true),
    brancoDuplo,
  );
  bainha.position.y = BARRA + h * 0.013;
  bainha.scale.z = ACHATA;
  g.add(bainha);

  /*
   * A GOLA. Mesma conta do moletom: mais estreita que `raioTorso * 1.7` ela
   * nasce inteira atras da cabeca (o cranio tem `0,17·h` de raio contra os
   * `0,105·h` do tronco) e nao aparece de frente.
   */
  const golaY = topoTorso + h * 0.012;
  const gola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.72, raioTorso * 1.14, h * 0.058, 20, 1, true),
    brancoDuplo,
  );
  gola.position.y = golaY;
  gola.scale.z = 0.95;
  g.add(gola);

  // ------------------------------------------------------- a bandeira deitada
  //
  // Tres aneis finos empilhados no peito, um por cor. Deitada e nao em pe
  // porque a bandeira em pe precisaria de tres fatias VERTICAIS no casco, e
  // fatia vertical num cilindro de 22 lados serrilha na costura.
  const peitoY = hipY + m.torsoH * 0.62;
  for (const [desloca, mat] of [[h * 0.009, brancoDuplo], [-h * 0.009, vermelho]] as const) {
    const faixa = new THREE.Mesh(
      new THREE.CylinderGeometry(RAIO * 1.012, RAIO * 1.012, h * 0.016, 22, 1, true),
      mat,
    );
    faixa.position.y = peitoY + desloca;
    faixa.scale.z = ACHATA;
    g.add(faixa);
  }

  // o ziper, a unica linha vertical da peca
  const ziperTopo = golaY;
  const ziperBaixo = BARRA + h * 0.02;
  const ziper = new THREE.Mesh(
    new THREE.BoxGeometry(h * 0.012, ziperTopo - ziperBaixo, h * 0.016),
    branco,
  );
  ziper.position.set(0, (ziperTopo + ziperBaixo) / 2, frenteZ * 0.99);
  g.add(ziper);

  // ------------------------------------------------------ o patinho do peito
  //
  // Do lado do CORACAO (x negativo, que e o esquerdo de quem veste) e acima da
  // bandeira. Ele e o detalhe que faz a jaqueta ser DELE e nao uma jaqueta de
  // selecao qualquer — bico, cabeca e um olhinho, na mesma receita chibi do
  // retrato do quadro.
  const bordado = new THREE.Group();
  bordado.position.set(-h * 0.038, peitoY + h * 0.05, frenteZ * 0.99);
  const cabecaDoPato = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.017, 12, 10),
    toon(P.jaquetaFrancaGola),
  );
  cabecaDoPato.scale.z = 0.45;
  bordado.add(cabecaDoPato);
  const bico = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.009, 10, 8),
    toon(P.jaquetaFrancaBico),
  );
  bico.scale.set(1.5, 0.6, 0.5);
  bico.position.set(h * 0.018, -h * 0.003, h * 0.004);
  bordado.add(bico);
  const olho = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.004, 8, 6),
    toon(P.moletomCostura),
  );
  olho.scale.z = 0.4;
  olho.position.set(h * 0.005, h * 0.005, h * 0.008);
  bordado.add(olho);
  g.add(bordado);

  // os dois bolsos de viés, como na jaqueta de time
  for (const lado of [-1, 1] as const) {
    const pivo = new THREE.Group();
    pivo.rotation.y = lado * 0.6;
    pivo.scale.z = ACHATA;
    const boca = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.012, h * 0.056, h * 0.012),
      brancoDuplo,
    );
    boca.position.set(0, hipY + m.torsoH * 0.2, RAIO * 1.0);
    boca.rotation.z = lado * 0.34;
    pivo.add(boca);
    g.add(pivo);
  }

  // e um arrematezinho azul no alto da gola, para ela nao ler como colarinho
  // solto de camisa
  const debrum = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.74, raioTorso * 1.7, h * 0.008, 20, 1, true),
    azulDuplo,
  );
  debrum.position.y = golaY + h * 0.028;
  debrum.scale.z = 0.95;
  g.add(debrum);

  return g;
}

/**
 * A manga da jaqueta da Franca.
 *
 * REFERENCIAL: o pivo do braco, y = 0 no ombro. Copiada da manga do moletom
 * pela mesma razao de sempre — a conta de comprimento (`0,82` do braco) ja
 * esta paga e deixa a mao de fora.
 */
function mangaDaJaquetaFrancesa(
  m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef,
): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const armLen = h * 0.3;
  const ATE = 0.82;
  const pano = peca?.corDetalhe ?? P.jaquetaFrancaManga;

  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.058 * w, 12, 10),
    toon(peca?.cor ?? P.jaquetaFranca),
  );
  ombro.position.y = -armLen * 0.03;
  ombro.scale.set(1, 0.92, 0.95);
  g.add(ombro);

  const tubo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.056 * w, h * 0.045 * w, armLen * ATE, 14, 1, true),
    toon(pano, { doubleSide: true }),
  );
  tubo.position.y = -armLen * ATE * 0.5;
  g.add(tubo);

  // a listra branca do meio do braco, a mesma da bandeira do peito
  const listra = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.052 * w, h * 0.05 * w, h * 0.012, 14, 1, true),
    toon(P.jaquetaFrancaGola, { doubleSide: true }),
  );
  listra.position.y = -armLen * ATE * 0.58;
  g.add(listra);

  // o punho branco fecha a boca do tubo — e a mao sai por ele
  const punho = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.047 * w, h * 0.045 * w, h * 0.024, 14),
    toon(P.jaquetaFrancaGola),
  );
  punho.position.y = -armLen * ATE;
  g.add(punho);

  return g;
}

/**
 * O quepe da bilheteria, o premio do Cookie.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio. E o MESMO quepe que ele
 * usa no posto (`entities/bichos/Cookie.ts`), redesenhado na escala de gente:
 * copa, faixa vermelha na base, aba avancando so para a frente e o botaozinho
 * do alto.
 *
 * Ele pede `cobreCabelo`, entao pode ser justo. A ABA PRECISA AVANCAR DE
 * VERDADE (`z` com esticada em 1,5): sem isso ela nasce dentro da copa e o
 * quepe vira touca — foi o que aconteceu no do Cookie, e a conta e a mesma.
 */
function quepeDoCookie(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const pano = toon(peca?.cor ?? P.quepeCookie);
  const fita = toon(peca?.corDetalhe ?? P.quepeCookieFita, { doubleSide: true });
  const debrum = toon(P.quepeCookieBotao);

  /*
   * ELE POUSA EM CIMA DO CABELO, e nao dentro dele.
   *
   * E a diferenca entre este e o gorro de la: o gorro e JUSTO e pede
   * `cobreCabelo`, entao ele se mede pelo cranio; um bone so pousa, e quem
   * manda na altura dele e a JUBA — a do Ari sobe a ~1,35·headR. E a mesma
   * conta do chapeu de campeao, que mora no construtor do rig e ja marca a
   * aba dele em `1,42·headR`.
   *
   * Medido pelo cranio (a versao anterior, com `cobreCabelo`), ele so servia
   * se o cabelo sumisse — e sumir com o cabelo de alguem para caber um bone e
   * o contrario do que um bone faz.
   */
  const BORDA = r * 1.3;   // onde a faixa encosta no cabelo
  const RAIO = r * 0.86;   // a copa, bem mais estreita que o cranio
  const ALTO = 0.72;       // quepe e achatado: copa alta vira touca

  // ele tomba um fio para a frente, que e como bone de trabalho fica. Aqui
  // isso e seguro: a peca inteira esta ACIMA dos olhos
  const quepe = new THREE.Group();
  quepe.rotation.x = 0.12;
  g.add(quepe);

  // a copa: meia casca, fechada em cima, apoiada na borda
  const copa = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
    pano,
  );
  copa.position.y = BORDA;
  copa.scale.y = ALTO;
  quepe.add(copa);

  // a faixa na base da copa, um fio mais gorda que ela: encostadas no mesmo
  // raio, as duas superficies brigam pelo mesmo pixel
  const faixa = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO * 1.02, RAIO * 1.05, r * 0.16, 18, 1, true),
    fita,
  );
  faixa.position.y = BORDA - r * 0.04;
  quepe.add(faixa);

  /*
   * A ABA. Meia esfera achatada — `phiLength` de meia volta girada para a
   * frente da um leque, e nao um disco inteiro.
   *
   * ELA E CURTA, e essa e a diferenca para a do Cookie. A dele avanca o dobro
   * do raio da copa, o que funciona num elefante de quatro patas visto de cima
   * com um metro de focinho na frente. Traduzida literal para este rig, a aba
   * chegava a `2,2·headR` e, na camera isometrica (que olha de cima, em 34°),
   * tapava a cara inteira.
   */
  const aba = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO * 0.92, 14, 8, 0, Math.PI, 0, Math.PI / 2),
    pano,
  );
  // ela sai NA LINHA DA FAIXA, e nao acima dela: montada em cima, a aba
  // engrossava a silhueta e o quepe lia como boina
  aba.scale.set(1.15, 0.07, 1.15);
  aba.rotation.y = -Math.PI / 2;
  aba.position.set(0, BORDA - r * 0.075, 0);
  quepe.add(aba);

  const botao = new THREE.Mesh(new THREE.SphereGeometry(r * 0.09, 8, 6), debrum);
  botao.position.y = BORDA + RAIO * ALTO;
  quepe.add(botao);

  // a estrelinha da bilheteria na frente da faixa — a mesma que o bilhete leva
  // carimbada
  const emblema = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.1, r * 0.1, r * 0.03, 5),
    debrum,
  );
  // ACIMA da aba, na testa da copa: na linha da faixa ela ficava escondida
  // por baixo da propria aba, que avanca um fio mais que ela
  emblema.rotation.x = Math.PI / 2;
  emblema.position.set(0, BORDA + r * 0.05, RAIO * 1.0);
  quepe.add(emblema);

  return g;
}

/**
 * O CHAPÉU DE JARDINEIRA — prêmio único da onda 10 da estufa
 * (`minigames/jardim/premios.ts`).
 *
 * Palha, aba larga e uma fita verde (a da família Jardim). Pousa EM CIMA do
 * cabelo, pela mesma conta do quepe do Cookie (`BORDA = 1,3·headR`): chapéu
 * medido pelo crânio só serve se o cabelo sumir.
 *
 * A ABA É LARGA, mas não tanto: na câmera isométrica, que olha de cima, aba
 * de sombreiro tapa a cara inteira. A primeira foto, com `1,75·headR`, tapava
 * meia cara; `1,5·headR` e a aba tombada para trás ainda leem "chapéu de
 * sol" sem esconder os olhos.
 */
function chapeuDeJardineira(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const palha = toon(peca?.cor ?? P.chapeuPalha, { doubleSide: true });
  const trama = toon(P.chapeuPalhaTrama, { doubleSide: true });
  const fita = toon(peca?.corDetalhe ?? P.chapeuPalhaFita, { doubleSide: true });
  const BORDA = r * 1.28;
  const RAIO = r * 0.9;
  const ABA = r * 1.5;

  const chapeu = new THREE.Group();
  // tomba para TRÁS: a câmera olha de cima, e aba tombada para a frente tapa o rosto
  chapeu.rotation.x = -0.12;
  g.add(chapeu);

  // a copa: meia casca achatada, fechada em cima
  const copa = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    palha,
  );
  copa.position.y = BORDA;
  copa.scale.y = 0.62;
  chapeu.add(copa);

  // a aba: um anel chato, com a borda um fio caída (chapéu de palha cansa)
  const aba = new THREE.Mesh(new THREE.CylinderGeometry(ABA, ABA * 1.04, r * 0.05, 26, 1, true), palha);
  aba.position.y = BORDA - r * 0.02;
  chapeu.add(aba);
  const tampa = new THREE.Mesh(new THREE.RingGeometry(RAIO * 0.98, ABA * 1.005, 26), palha);
  tampa.rotation.x = -Math.PI / 2;
  tampa.position.y = BORDA + r * 0.005;
  chapeu.add(tampa);
  // a trama: dois anéis mais escuros na aba, que é o que diz "palha" de longe
  for (const k of [1.18, 1.36]) {
    const anel = new THREE.Mesh(new THREE.RingGeometry(r * k, r * (k + 0.06), 26), trama);
    anel.rotation.x = -Math.PI / 2;
    anel.position.y = BORDA + r * 0.012;
    chapeu.add(anel);
  }

  // a fita verde na base da copa, um fio mais gorda que ela
  const faixa = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO * 1.03, RAIO * 1.04, r * 0.2, 20, 1, true),
    fita,
  );
  faixa.position.y = BORDA + r * 0.1;
  chapeu.add(faixa);
  // o laço da fita, do lado
  const lacinho = laco(r * 0.22, peca?.corDetalhe ?? P.chapeuPalhaFita);
  lacinho.position.set(RAIO * 0.98, BORDA + r * 0.1, 0);
  lacinho.rotation.y = Math.PI / 2;
  chapeu.add(lacinho);
  return g;
}

/**
 * O AVENTAL DA JOSEFINA — prêmio único da onda 20 da estufa.
 *
 * Avental de jardim por CIMA da roupa: peitilho no peito, saia até o meio da
 * coxa, alça no pescoço, laço atrás e um bolso de semente na frente. Sem
 * `cor` na ficha, a camiseta de baixo continua a da pessoa — é avental, não
 * vestido.
 *
 * REFERENCIAL: o tronco, y = 0 no CHÃO (a tabela da skill de roupa). As
 * medidas saem das mesmas contas da jaqueta francesa.
 *
 * A SAIA NÃO DESCE ALÉM DO MEIO DA COXA e abre para a frente: a perna balança
 * na caminhada, e pano comprido e rente é o que ela atravessa.
 */
function aventalDaJosefina(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ACHATA = 0.93;
  const pano = toon(peca?.cor ?? P.aventalVerde, { doubleSide: true });
  const bolso = toon(P.aventalBolso, { doubleSide: true });
  const alca = toon(P.aventalAlca, { doubleSide: true });

  // a SAIA: um pedaço de cone na frente, da cintura até o meio da coxa
  const cintura = hipY + m.torsoH * 0.18;
  const barra = hipY - h * 0.1;
  const ABRE = Math.PI * 0.62;
  const saia = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.1, raioTorso * 1.32, cintura - barra, 18, 1, true, -ABRE / 2, ABRE),
    pano,
  );
  saia.position.y = (cintura + barra) / 2;
  saia.scale.z = ACHATA;
  g.add(saia);

  // o PEITILHO: mais estreito, da cintura ao peito
  const peito = hipY + m.torsoH * 0.74;
  const ESTREITO = Math.PI * 0.4;
  const peitilho = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.07, raioTorso * 1.1, peito - cintura, 14, 1, true, -ESTREITO / 2, ESTREITO),
    pano,
  );
  peitilho.position.y = (peito + cintura) / 2;
  peitilho.scale.z = ACHATA;
  g.add(peitilho);

  // a CINTA: a volta inteira na cintura, cor de algodão cru, e o laço atrás
  const cinta = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.12, raioTorso * 1.12, h * 0.022, 22, 1, true),
    alca,
  );
  cinta.position.y = cintura;
  cinta.scale.z = ACHATA;
  g.add(cinta);
  const lacoAtras = laco(h * 0.04, P.aventalAlca);
  lacoAtras.position.set(0, cintura, -raioTorso * 1.12 * ACHATA - h * 0.004);
  lacoAtras.rotation.y = Math.PI;
  g.add(lacoAtras);

  // as ALÇAS: do canto do peitilho sobem por cima do ombro até as costas
  const cantoX = Math.sin(ESTREITO / 2) * raioTorso * 1.07;
  const cantoZ = Math.cos(ESTREITO / 2) * raioTorso * 1.07 * ACHATA;
  const topo = hipY + m.torsoH * 0.98;
  for (const lado of [-1, 1] as const) {
    const sobe = topo - peito;
    const tira = new THREE.Mesh(new THREE.BoxGeometry(h * 0.014, sobe, h * 0.006), alca);
    tira.position.set(lado * cantoX * 1.02, peito + sobe / 2, cantoZ * 0.93);
    tira.rotation.x = -0.28;
    g.add(tira);
  }

  // o BOLSO de semente, na frente da saia, com a boca mais escura
  const bolsoY = (cintura + barra) / 2 + h * 0.01;
  const raioBolso = raioTorso * 1.2;
  const LARGO = Math.PI * 0.28;
  const frente = new THREE.Mesh(
    new THREE.CylinderGeometry(raioBolso * 1.01, raioBolso * 1.04, h * 0.05, 10, 1, true, -LARGO / 2, LARGO),
    bolso,
  );
  frente.position.y = bolsoY;
  frente.scale.z = ACHATA;
  g.add(frente);
  return g;
}

/**
 * O GIRASSOL NO PEITO da camiseta de girassol (lojinha da Josefina): oito
 * pétalas achatadas em volta de um miolo, pregadas na frente do tronco.
 *
 * REFERENCIAL: o tronco, y = 0 no CHÃO. A frente do peito sai da cápsula do
 * rig (`CharacterRig`, "torso"): raio `0,105·h·w`, achatada em `0,82` no `z`
 * — a flor fica um fio à frente disso, na altura do peito.
 */
function girassolNoPeito(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const raioTorso = h * 0.105 * w;
  const y = m.legH + m.torsoH * 0.64;
  const z = raioTorso * 0.82 + h * 0.004;
  const petala = toon(P.girassolPetala);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.SphereGeometry(h * 0.011, 8, 6), petala);
    p.scale.set(1, 1.9, 0.35);
    p.position.set(raioTorso * 0.34 + Math.cos(a) * h * 0.021, y + Math.sin(a) * h * 0.021, z);
    p.rotation.z = a - Math.PI / 2;
    g.add(p);
  }
  const miolo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.013, 10, 8), toon(P.girassolMiolo));
  miolo.scale.z = 0.45;
  miolo.position.set(raioTorso * 0.34, y, z + h * 0.002);
  g.add(miolo);
  return g;
}

/**
 * O CHAPÉU JOANINHA — pedido do Renan: "um chapéuzinho estilo o de
 * jardinagem, um pouquinho menor, com o desenho de uma joaninha mesmo, com
 * vermelho e com bolinhas brancas em cima". Substituiu o gorro joaninha.
 *
 * É o chapéu de jardineira encolhido (aba de `1,32·headR` contra `1,5`), com
 * a copa mais redonda — casco de joaninha — e o que faz ler como joaninha:
 * as BOLINHAS BRANCAS na copa, a LINHA DAS ASAS de frente para trás, e a
 * CABECINHA PRETA com as duas anteninhas na frente, pousada na aba.
 *
 * Pousa em cima do cabelo pela mesma conta do chapéu de jardineira
 * (`BORDA = 1,28·headR`), tombado para trás para não tapar os olhos.
 */
function chapeuJoaninha(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const vermelho = toon(P.joaninhaVermelho, { doubleSide: true });
  const preto = toon(P.joaninhaPreto);
  const branco = toon(P.joaninhaBolinha);
  const BORDA = r * 1.28;
  const RAIO = r * 0.84;
  const ABA = r * 1.32;
  const ALTO = 0.78;

  const chapeu = new THREE.Group();
  chapeu.rotation.x = -0.12;
  g.add(chapeu);

  const copa = new THREE.Mesh(new THREE.SphereGeometry(RAIO, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), vermelho);
  copa.position.y = BORDA;
  copa.scale.y = ALTO;
  chapeu.add(copa);
  const aba = new THREE.Mesh(new THREE.RingGeometry(RAIO * 0.98, ABA, 28), vermelho);
  aba.rotation.x = -Math.PI / 2;
  aba.position.y = BORDA + r * 0.004;
  chapeu.add(aba);
  const barra = new THREE.Mesh(new THREE.CylinderGeometry(ABA, ABA * 1.03, r * 0.05, 28, 1, true), vermelho);
  barra.position.y = BORDA - r * 0.02;
  chapeu.add(barra);

  // a linha das asas: um arco fino de trás para a frente, por cima da copa
  // (o arco segue a copa achatada: é um toro escalado igual a ela)
  const linha = new THREE.Mesh(new THREE.TorusGeometry(RAIO * 1.005, r * 0.022, 6, 20, Math.PI), preto);
  linha.rotation.y = Math.PI / 2;
  linha.scale.set(1, ALTO, 1);
  linha.position.y = BORDA;
  chapeu.add(linha);

  // as bolinhas brancas, espalhadas pela copa dos dois lados da linha
  const pontos: Array<readonly [number, number]> = [
    [0.55, 0.5], [0.55, 1.35], [0.9, 0.95], [0.35, 1.0],
    [-0.55, 0.5], [-0.55, 1.35], [-0.9, 0.95], [-0.35, 1.0],
  ];
  for (const [lado, fi] of pontos) {
    // `lado` escolhe a metade (x) e a distância da linha; `fi` a altura na copa
    const theta = Math.sign(lado) * (0.45 + Math.abs(lado) * 0.9);
    const polar = 0.35 + (fi / 1.35) * 0.75;
    const x = RAIO * Math.sin(polar) * Math.sin(theta);
    const z = RAIO * Math.sin(polar) * Math.cos(theta) * (fi > 1.2 ? -1 : 1);
    const y = BORDA + RAIO * Math.cos(polar) * ALTO;
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(r * 0.1, 10, 6), branco);
    bolinha.scale.set(1, 0.4, 1);
    bolinha.position.set(x * 1.01, y + r * 0.01, z * 1.01);
    bolinha.lookAt(x * 2, BORDA + (y - BORDA) * 2 / ALTO, z * 2);
    bolinha.rotateX(Math.PI / 2);
    chapeu.add(bolinha);
  }

  // a cabecinha preta na frente, pousada na aba, e as duas anteninhas
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(r * 0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), preto);
  cabeca.position.set(0, BORDA, RAIO * 0.95);
  chapeu.add(cabeca);
  for (const lado of [-1, 1] as const) {
    const antena = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.015, r * 0.015, r * 0.3, 5), preto);
    antena.position.set(lado * r * 0.08, BORDA + r * 0.24, RAIO * 1.02);
    antena.rotation.set(0.5, 0, -lado * 0.45);
    chapeu.add(antena);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(r * 0.04, 6, 5), preto);
    ponta.position.set(lado * r * 0.15, BORDA + r * 0.36, RAIO * 1.09);
    chapeu.add(ponta);
  }
  return g;
}

/**
 * A TIARA — a base das duas de orelhinha (Walter e Pelusa): uma faixa fina de
 * orelha a orelha que pousa POR CIMA do cabelo. Devolve o grupo e `naFaixa(a)`:
 * o ponto da faixa no ângulo `a` (radianos a partir do alto, `+` para `+X`),
 * para quem pendura a orelha saber onde ela passa.
 *
 * A faixa segue o CONTORNO MEDIDO do cabelo (`m.cabelo`), não um raio fixo.
 * Ela já foi um arco de `1,32·headR`: servia para os cachos curtos do Renan
 * (~1,3), mas o cacheado do Ari passa de 1,5 — a faixa e as orelhas afundavam
 * na juba e só sobrava a ponta. Pedido do Renan: orelha APARENTE, em cima do
 * cabelo, nos dois.
 */
function tiara(m: MedidasCorpo, cor: number): { g: THREE.Group; naFaixa: (a: number) => THREE.Vector3 } {
  const g = new THREE.Group();
  const r = m.headR;
  const grossura = r * 0.05;
  const PLANO = -r * 0.05;
  // metade da grossura para dentro: a faixa ENCOSTA nos cachos mais altos
  const naFaixa = (a: number): THREE.Vector3 => {
    const raio = m.cabelo(a) + grossura * 0.5;
    return new THREE.Vector3(Math.sin(a) * raio, Math.cos(a) * raio, PLANO);
  };
  const pontos: THREE.Vector3[] = [];
  const PONTA = 1.35; // ~77°: a faixa desce até perto da orelha, sem entrar nela
  for (let i = 0; i <= 16; i++) pontos.push(naFaixa(-PONTA + (i / 16) * PONTA * 2));
  const curva = new THREE.CatmullRomCurve3(pontos);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 40, grossura, 6, false), toon(cor)));
  return { g, naFaixa };
}

/**
 * A TIARA DE ORELHINHAS DO WALTER: orelhas caídas de cachorro, caramelo por
 * fora e creme por dentro, e a gravatinha dele no alto.
 *
 * Presa na faixa a ~35° do alto, cada orelha desce ABRINDO para fora, pela
 * tangente da faixa e um pouco para baixo — é o que mantém a orelha do lado de
 * FORA da juba: caindo reto, ela voltava para dentro do cabelo do Ari. E ela
 * fica NO PLANO DA FAIXA, com a cara larga para a frente, como numa tiara de
 * verdade: deitada no cabelo, vista de cima, ela lia como uma colher.
 *
 * AS CORES não são as do Walter ao pé da letra, e é de propósito: o
 * `cachorroOrelha` é o mesmo tom das mechas claras do Ari (#a9713f), e orelha
 * e faixa sumiam no cabelo dela. O caramelo do pelo, o miolo creme e a faixa
 * creme aparecem no castanho e no preto.
 */
function tiaraDoWalter(m: MedidasCorpo): THREE.Object3D {
  const r = m.headR;
  const { g, naFaixa } = tiara(m, P.cachorroPeito);
  const pelo = toon(P.cachorroPelo);
  const dentro = toon(P.cachorroPeito);
  const LARGA = r * 0.2;
  const GROSSA = r * 0.06;
  for (const lado of [-1, 1] as const) {
    // presa na faixa a ~32° do alto, e a ponta pousada POR FORA do cabelo a
    // ~70°: a orelha é a corda entre as duas, então ela acompanha a juba em vez
    // de cair reto para dentro dela (no Ari fica mais comprida, como a juba)
    const presa = naFaixa(lado * 0.55);
    const a1 = lado * 1.2;
    const ponta = new THREE.Vector3(Math.sin(a1), Math.cos(a1), 0)
      .multiplyScalar(m.cabelo(a1) + LARGA * 0.9)
      .setZ(presa.z);
    const cai = ponta.clone().sub(presa);
    const COMPRIDA = cai.length() + LARGA * 0.3;
    cai.normalize();
    // o lado de fora da orelha (perpendicular a `cai`, virado para longe da cabeça)
    const fora = new THREE.Vector3(-cai.y, cai.x, 0).multiplyScalar(lado);
    const orelha = new THREE.Group();
    // eixo comprido (Y) no sentido em que ela cai; o X local vira o `fora`
    orelha.rotation.z = Math.atan2(-cai.x, cai.y);
    orelha.position.copy(presa).lerp(ponta, 0.5).addScaledVector(fora, LARGA * 0.45);
    const aba = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), pelo);
    aba.scale.set(LARGA, COMPRIDA / 2, GROSSA);
    orelha.add(aba);
    // o miolo creme na cara da frente, puxado para a ponta
    const miolo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), dentro);
    miolo.scale.set(LARGA * 0.6, COMPRIDA * 0.32, GROSSA * 0.5);
    miolo.position.set(0, COMPRIDA * 0.06, GROSSA * 0.75);
    orelha.add(miolo);
    g.add(orelha);
  }
  // e a gravatinha borboleta dele, pequenininha, no alto da faixa
  const topo = naFaixa(0);
  const gravata = toon(P.gravataBorboleta);
  for (const lado of [-1, 1] as const) {
    const aba = new THREE.Mesh(new THREE.ConeGeometry(r * 0.08, r * 0.16, 8), gravata);
    aba.rotation.z = lado * Math.PI / 2;
    aba.position.set(lado * r * 0.09, topo.y + r * 0.03, topo.z + r * 0.02);
    g.add(aba);
  }
  const no = new THREE.Mesh(new THREE.SphereGeometry(r * 0.05, 8, 6), gravata);
  no.position.set(0, topo.y + r * 0.03, topo.z + r * 0.02);
  g.add(no);
  return g;
}

/**
 * A TIARA DE ORELHINHAS DO PELUSA: orelhas de gato em pé, claras com o miolo
 * rosa, numa faixa BRANCA como elas (pedido do Renan: a faixa cinza-escura
 * sumia no cabelo e não combinava com as orelhas). A orelha é uma pirâmide de 4 faces com uma face virada para a frente,
 * e o miolo é a MESMA pirâmide menor, com a face da frente no mesmo plano da
 * de fora (um fio à frente) — rosa por cima, sem furar nem sobrar.
 */
function tiaraDoPelusa(m: MedidasCorpo): THREE.Object3D {
  const r = m.headR;
  const { g, naFaixa } = tiara(m, P.pelusaBranco);
  const ALTA = r * 0.52;
  const LARGA = r * 0.3;
  const MIOLO = 0.6;
  const SOBE = ALTA * 0.1;
  // a distância da face ao eixo, na base de uma pirâmide de 4 lados girada 45°
  const face = LARGA * Math.SQRT1_2;
  for (const lado of [-1, 1] as const) {
    const a = lado * 0.58;
    const presa = naFaixa(a);
    const orelha = new THREE.Group();
    // grandes e CLARAS: no cabelo escuro do Renan, orelha pequena cinza sumia
    const fora = new THREE.Mesh(new THREE.ConeGeometry(LARGA, ALTA, 4), toon(P.pelusaBranco));
    fora.rotation.y = Math.PI / 4;
    fora.position.y = ALTA / 2;
    orelha.add(fora);
    const miolo = new THREE.Mesh(new THREE.ConeGeometry(LARGA * MIOLO, ALTA * MIOLO, 4), toon(P.pelusaOrelha));
    miolo.rotation.y = Math.PI / 4;
    miolo.position.set(0, SOBE + (ALTA * MIOLO) / 2, face * (1 - MIOLO - SOBE / ALTA) + r * 0.012);
    orelha.add(miolo);
    // em pé, abrindo um pouco para fora; a base afunda um tico na faixa
    const normal = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
    const pe = new THREE.Vector3(0, 1, 0).lerp(normal, 0.55).normalize();
    orelha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pe);
    orelha.position.copy(presa).addScaledVector(pe, -r * 0.03);
    g.add(orelha);
  }
  return g;
}

/**
 * O BONÉ DA GINA: amarelo de girafa com as manchas canela, e os dois
 * chifrinhos (ossicones) em cima — a Gina da guarita do clube, na cabeça.
 * A copa e a aba saem da conta do quepe do Cookie (pousa no cabelo).
 */
function boneDaGina(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const pelo = toon(P.girafaPelo);
  const mancha = toon(P.girafaMancha);
  const BORDA = r * 1.3;
  const RAIO = r * 0.86;
  const ALTO = 0.7;
  const bone = new THREE.Group();
  bone.rotation.x = 0.1;
  g.add(bone);
  const copa = new THREE.Mesh(new THREE.SphereGeometry(RAIO, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), pelo);
  copa.position.y = BORDA;
  copa.scale.y = ALTO;
  bone.add(copa);
  const aba = new THREE.Mesh(new THREE.SphereGeometry(RAIO * 0.95, 14, 8, 0, Math.PI, 0, Math.PI / 2), toon(P.girafaCrina));
  aba.scale.set(1.15, 0.07, 1.25);
  aba.rotation.y = -Math.PI / 2;
  aba.position.set(0, BORDA - r * 0.075, 0);
  bone.add(aba);
  // as manchas: plaquinhas achatadas espalhadas pela copa (ângulo áureo)
  for (let i = 0; i < 7; i++) {
    const theta = i * 2.39996;
    const polar = 0.45 + (i % 3) * 0.28;
    const x = RAIO * Math.sin(polar) * Math.sin(theta);
    const z = RAIO * Math.sin(polar) * Math.cos(theta);
    const y = BORDA + RAIO * Math.cos(polar) * ALTO;
    const p = new THREE.Mesh(new THREE.SphereGeometry(r * 0.12, 8, 5), mancha);
    p.scale.set(1, 0.35, 0.8);
    p.position.set(x * 1.01, y, z * 1.01);
    p.lookAt(x * 2, BORDA + (y - BORDA) * 2 / ALTO, z * 2);
    p.rotateX(Math.PI / 2);
    bone.add(p);
  }
  // os dois chifrinhos: pescoço amarelo e a bolinha escura na ponta
  for (const lado of [-1, 1] as const) {
    const chifre = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.06, r * 0.08, r * 0.34, 8), pelo);
    chifre.position.set(lado * r * 0.3, BORDA + RAIO * ALTO + r * 0.08, -r * 0.05);
    chifre.rotation.z = -lado * 0.18;
    bone.add(chifre);
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(r * 0.09, 8, 6), toon(P.girafaCasco));
    ponta.position.set(lado * r * 0.33, BORDA + RAIO * ALTO + r * 0.26, -r * 0.05);
    bone.add(ponta);
  }
  return g;
}

/**
 * A MOCHILA CASCO DA JOSEFINA: o casco verde-oliva nas costas, com os
 * escudos e o laço rosa dela em cima, e as duas alças passando pelos ombros.
 * Sem `cor` na ficha: a camiseta de baixo continua a da pessoa.
 *
 * REFERENCIAL: o tronco, y = 0 no CHÃO; as costas da cápsula do rig ficam em
 * `z = -0,82 · 0,105·h·w` (a mesma conta do girassol, do outro lado).
 */
function mochilaCascoDaJosefina(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const raioTorso = h * 0.105 * w;
  const costas = -raioTorso * 0.82;
  // na altura das OMOPLATAS, e não no meio do tronco: mochila baixa, vista de
  // trás, ficava escondida atrás das mãos balançando
  const y = m.legH + m.torsoH * 0.64;
  const casco = new THREE.Mesh(new THREE.SphereGeometry(raioTorso * 1.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(P.tartarugaCasco));
  casco.rotation.x = -Math.PI / 2;
  casco.scale.set(1.15, 1.3, 0.62);
  casco.position.set(0, y, costas - h * 0.004);
  g.add(casco);
  const borda = new THREE.Mesh(new THREE.TorusGeometry(raioTorso * 1.03, h * 0.008, 6, 20), toon(P.tartarugaBarriga));
  borda.scale.set(1.15, 1.3, 1);
  borda.position.set(0, y, costas - h * 0.004);
  g.add(borda);
  // os escudos: hexágonos achatados colados no casco
  const escudo = toon(P.tartarugaEscudo);
  for (const [dx, dy] of [[0, 0], [-0.5, 0.45], [0.5, 0.45], [-0.5, -0.45], [0.5, -0.45], [0, 0.85], [0, -0.85]] as const) {
    const e = new THREE.Mesh(new THREE.CylinderGeometry(raioTorso * 0.24, raioTorso * 0.24, h * 0.006, 6), escudo);
    const ex = dx * raioTorso * 1.15;
    const ey = dy * raioTorso * 1.2;
    // a altura do casco naquele ponto (a calota achatada em z)
    const q = Math.max(0, 1 - (ex * ex) / (raioTorso * 1.21) ** 2 - (ey * ey) / (raioTorso * 1.365) ** 2);
    const fora = Math.sqrt(q) * raioTorso * 1.05 * 0.62;
    e.rotation.x = Math.PI / 2;
    e.position.set(ex, y + ey, costas - h * 0.004 - fora - h * 0.002);
    g.add(e);
  }
  // o laço rosa dela, no alto do casco
  const laco = new THREE.Group();
  for (const lado of [-1, 1] as const) {
    const aba = new THREE.Mesh(new THREE.ConeGeometry(h * 0.02, h * 0.035, 8), toon(P.lacoDaJosefina));
    aba.rotation.z = lado * Math.PI / 2;
    aba.position.x = lado * h * 0.018;
    laco.add(aba);
  }
  laco.position.set(0, y + raioTorso * 1.3, costas - raioTorso * 0.25);
  g.add(laco);
  // as alças: de cima do ombro até o peito, na frente
  const alca = toon(P.tartarugaEscudo);
  const topo = m.legH + m.torsoH * 0.98;
  const peito = m.legH + m.torsoH * 0.6;
  for (const lado of [-1, 1] as const) {
    const tira = new THREE.Mesh(new THREE.BoxGeometry(h * 0.016, topo - peito, h * 0.006), alca);
    tira.position.set(lado * raioTorso * 0.48, (topo + peito) / 2, raioTorso * 0.8);
    tira.rotation.x = -0.22;
    g.add(tira);
  }
  return g;
}

/**
 * UMA ESTAMPA NO PEITO de camiseta: o desenho (montado no plano XY, olhando
 * para `+Z`, com `e` como unidade de tamanho) pregado na frente do tronco. É
 * a mesma conta do girassol: a cápsula do rig, achatada em 0,82.
 */
function estampaNoPeito(m: MedidasCorpo, desenho: (e: number) => THREE.Object3D): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const raioTorso = h * 0.105 * w;
  const e = h * 0.022;
  const d = desenho(e);
  d.position.set(0, m.legH + m.torsoH * 0.62, raioTorso * 0.82 + h * 0.004);
  g.add(d);
  return g;
}

/** a cruz branca de salva-vidas, no peito da camiseta do Capy */
function estampaSalvaVidas(m: MedidasCorpo): THREE.Object3D {
  return estampaNoPeito(m, (e) => {
    const g = new THREE.Group();
    const branco = toon(P.estampaBranca);
    const fundo = new THREE.Mesh(new THREE.CylinderGeometry(e * 1.5, e * 1.5, e * 0.2, 20), branco);
    fundo.rotation.x = Math.PI / 2;
    g.add(fundo);
    for (const [lx, ly] of [[1.6, 0.5], [0.5, 1.6]] as const) {
      const barra = new THREE.Mesh(new THREE.BoxGeometry(e * lx, e * ly, e * 0.2), toon(P.camisetaSalvaVidas));
      barra.position.z = e * 0.12;
      g.add(barra);
    }
    return g;
  });
}

/** a rodinha gigante do Villa Lobos, estampada: aro, raios e as cabines coloridas */
function estampaRodaGigante(m: MedidasCorpo): THREE.Object3D {
  return estampaNoPeito(m, (e) => {
    const g = new THREE.Group();
    const branco = toon(P.estampaBranca);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(e * 1.3, e * 0.13, 6, 24), branco);
    g.add(aro);
    for (let i = 0; i < 4; i++) {
      const raio = new THREE.Mesh(new THREE.BoxGeometry(e * 2.6, e * 0.09, e * 0.08), branco);
      raio.rotation.z = (i / 4) * Math.PI;
      g.add(raio);
    }
    const cores = [P.fabricRed, P.lojaPacoteC, P.fabricBlue, P.lojaToldoVerde];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cabine = new THREE.Mesh(new THREE.SphereGeometry(e * 0.3, 8, 6), toon(cores[i % 4]));
      cabine.scale.z = 0.4;
      cabine.position.set(Math.cos(a) * e * 1.3, Math.sin(a) * e * 1.3 - e * 0.18, e * 0.06);
      g.add(cabine);
    }
    // as duas pernas do cavalete
    for (const lado of [-1, 1]) {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(e * 0.12, e * 1.9, e * 0.08), branco);
      perna.position.set(lado * e * 0.45, -e * 0.85, -e * 0.02);
      perna.rotation.z = lado * 0.28;
      g.add(perna);
    }
    return g;
  });
}

/** a fatia de laranja do bar de sucos do Noel, estampada */
function estampaLaranja(m: MedidasCorpo): THREE.Object3D {
  return estampaNoPeito(m, (e) => {
    const g = new THREE.Group();
    const casca = new THREE.Mesh(new THREE.CylinderGeometry(e * 1.45, e * 1.45, e * 0.2, 24), toon(P.laranjaCasca));
    casca.rotation.x = Math.PI / 2;
    g.add(casca);
    const polpa = new THREE.Mesh(new THREE.CylinderGeometry(e * 1.2, e * 1.2, e * 0.2, 24), toon(P.laranjaPolpa));
    polpa.rotation.x = Math.PI / 2;
    polpa.position.z = e * 0.05;
    g.add(polpa);
    for (let i = 0; i < 4; i++) {
      const gomo = new THREE.Mesh(new THREE.BoxGeometry(e * 2.3, e * 0.08, e * 0.1), toon(P.estampaBranca));
      gomo.rotation.z = (i / 4) * Math.PI;
      gomo.position.z = e * 0.12;
      g.add(gomo);
    }
    const folha = new THREE.Mesh(new THREE.SphereGeometry(e * 0.4, 8, 5), toon(P.leafDark));
    folha.scale.set(1.6, 0.8, 0.3);
    folha.position.set(e * 0.9, e * 1.45, e * 0.05);
    folha.rotation.z = 0.5;
    g.add(folha);
    return g;
  });
}

/**
 * As casas escuras de um xadrez em volta de um cilindro.
 *
 * Ferramenta dos dois pedacos do conjunto da Estella — o blazer e a perneira.
 * Em vez de tentar tingir uma superficie (o que pediria textura, e textura e
 * asset), o claro e a superficie que JA EXISTE e o escuro sao plaquinhas
 * finas por cima, em xadrez: casa sim, casa nao, alternando a cada fileira.
 *
 * A placa fica a `raio` do eixo e girada pelo proprio angulo, entao ela pousa
 * rente a parede. `achata` e o `scale.z` do cilindro embaixo — sem ele as
 * casas da frente flutuam e as do lado afundam num corpo achatado em Z.
 */
function casasDeXadrez(
  raio: number, deY: number, ateY: number, colunas: number, fileiras: number,
  cor: number, achata = 1, comecaEscura = true,
): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const alturaDaCasa = (ateY - deY) / fileiras;
  const larguraDaCasa = (2 * Math.PI * raio) / colunas;
  for (let f = 0; f < fileiras; f++) {
    for (let c = 0; c < colunas; c++) {
      // casa sim, casa nao — e a fileira de cima comeca do outro pe, senao
      // saem listras verticais em vez de tabuleiro
      if (((f + c) % 2 === 0) !== comecaEscura) continue;
      const a = (c / colunas) * Math.PI * 2;
      const casa = new THREE.Mesh(
        // 0,94 de folga entre uma casa e outra: coladas, a serrilha da junta
        // some e o tabuleiro vira um cilindro escuro com falhas
        new THREE.BoxGeometry(larguraDaCasa * 0.94, alturaDaCasa * 0.94, raio * 0.03),
        mat,
      );
      casa.position.set(
        Math.sin(a) * raio,
        deY + alturaDaCasa * (f + 0.5),
        Math.cos(a) * raio * achata,
      );
      casa.rotation.y = a;
      g.add(casa);
    }
  }
  return g;
}

/**
 * O blazer de xadrez, peca de tronco do conjunto da Estella.
 *
 * REFERENCIAL: o corpo, y = 0 no CHAO.
 *
 * Ela e ESTILISTA, entao a peca nao pode ser "cilindro quadriculado": o que a
 * faz ler como alfaiataria sao as lapelas em V, o forro vinho aparecendo na
 * dobra, os dois botoes dourados e o broche de DAMA na lapela — a peca de
 * xadrez que ela mais usa no tabuleiro da lojinha.
 */
function blazerXadrez(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ombroY = hipY + m.torsoH * 0.86;
  const topoTorso = hipY + m.torsoH;
  const ACHATA = 0.9;

  const claro = peca?.cor ?? P.xadrezPano;
  const escuro = peca?.corDetalhe ?? P.xadrezPanoEscuro;
  const pano = toon(claro);
  const forro = toon(P.xadrezForro, { doubleSide: true });
  const ouro = toon(P.xadrezDourado);

  const RAIO = raioTorso * 1.09;
  const BARRA = hipY - h * 0.01; // o blazer passa do quadril, como blazer longo
  const TOPO = ombroY + m.torsoH * 0.03;

  const casco = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO, RAIO * 1.02, TOPO - BARRA, 24),
    pano,
  );
  casco.position.y = (TOPO + BARRA) / 2;
  casco.scale.z = ACHATA;
  g.add(casco);

  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    pano,
  );
  ombro.position.y = TOPO;
  ombro.scale.set(1, 0.44, ACHATA);
  g.add(ombro);

  // O TABULEIRO. Quatro fileiras de doze casas sobre o casco: a casa sai com
  // `0,059·h` de largura por `0,064·h` de altura, que e quadrada o bastante
  // para ler como xadrez e nao como listra.
  const tabuleiro = casasDeXadrez(RAIO * 1.005, BARRA, TOPO, 12, 4, escuro, ACHATA);
  g.add(tabuleiro);

  // ----------------------------------------------------------- as lapelas
  //
  // Duas placas inclinadas descendo do pescoco para o peito, uma de cada lado
  // do ziper imaginario. O `lado` multiplica o deslocamento E a inclinacao:
  // sem ele as duas apontam para o mesmo canto e o V vira uma barra torta.
  for (const lado of [-1, 1] as const) {
    const lapela = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.036, h * 0.12, h * 0.012),
      toon(escuro),
    );
    lapela.position.set(lado * h * 0.026, topoTorso - h * 0.058, RAIO * ACHATA * 1.02);
    lapela.rotation.z = lado * 0.3;
    g.add(lapela);

    // o forro vinho, um dedo para dentro: e ele que da profundidade a dobra
    const dobra = new THREE.Mesh(
      new THREE.BoxGeometry(h * 0.016, h * 0.11, h * 0.008),
      forro,
    );
    dobra.position.set(lado * h * 0.014, topoTorso - h * 0.06, RAIO * ACHATA * 1.03);
    dobra.rotation.z = lado * 0.3;
    g.add(dobra);
  }

  // a gola por tras do pescoco, fechando o V — a mesma cota do moletom
  const gola = new THREE.Mesh(
    new THREE.CylinderGeometry(raioTorso * 1.7, raioTorso * 1.18, h * 0.05, 20, 1, true),
    toon(escuro, { doubleSide: true }),
  );
  gola.position.y = topoTorso + h * 0.008;
  gola.scale.z = 0.95;
  g.add(gola);

  // os dois botoes dourados, abaixo do V
  for (const i of [0, 1]) {
    const botao = new THREE.Mesh(
      new THREE.CylinderGeometry(h * 0.009, h * 0.009, h * 0.006, 12),
      ouro,
    );
    botao.rotation.x = Math.PI / 2;
    botao.position.set(0, hipY + m.torsoH * (0.46 - i * 0.16), RAIO * ACHATA * 1.02);
    g.add(botao);
  }

  // ------------------------------------------------- o broche de DAMA
  //
  // A peca do tabuleiro, em miniatura, na lapela do lado do coracao: base,
  // corpo afunilado, a coroa recortada e a bolinha do alto. E o detalhe que
  // diz "xadrez" mesmo em quem olhar de longe e so ver quadradinhos.
  const broche = new THREE.Group();
  broche.position.set(-h * 0.04, topoTorso - h * 0.042, RAIO * ACHATA * 1.06);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.012, h * 0.015, h * 0.006, 10), ouro,
  );
  broche.add(base);
  const corpo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.006, h * 0.011, h * 0.022, 10), ouro,
  );
  corpo.position.y = h * 0.014;
  broche.add(corpo);
  const coroa = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.013, h * 0.008, h * 0.008, 8), ouro,
  );
  coroa.position.y = h * 0.029;
  broche.add(coroa);
  const bolinha = new THREE.Mesh(new THREE.SphereGeometry(h * 0.006, 8, 6), ouro);
  bolinha.position.y = h * 0.037;
  broche.add(bolinha);
  // deitado na lapela, e nao em pe no ar: broche e uma peca PREGADA
  broche.rotation.x = Math.PI / 2 - 0.25;
  g.add(broche);

  return g;
}

/** A manga do blazer: escura, com o punho de xadrez e um botao dourado. */
function mangaDoBlazer(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const armLen = h * 0.3;
  const ATE = 0.84;
  const claro = peca?.cor ?? P.xadrezPano;
  const escuro = peca?.corDetalhe ?? P.xadrezPanoEscuro;

  const ombro = new THREE.Mesh(
    new THREE.SphereGeometry(h * 0.058 * w, 12, 10),
    toon(claro),
  );
  ombro.position.y = -armLen * 0.03;
  ombro.scale.set(1, 0.92, 0.95);
  g.add(ombro);

  const tubo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.055 * w, h * 0.044 * w, armLen * ATE, 14, 1, true),
    toon(claro, { doubleSide: true }),
  );
  tubo.position.y = -armLen * ATE * 0.5;
  g.add(tubo);

  // o tabuleiro tambem na manga, senao o braco vira uma faixa lisa ao lado de
  // um tronco quadriculado
  g.add(casasDeXadrez(
    h * 0.052 * w, -armLen * ATE * 0.92, -armLen * 0.06, 8, 4, escuro,
  ));

  const punho = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.046 * w, h * 0.044 * w, h * 0.026, 14),
    toon(escuro),
  );
  punho.position.y = -armLen * ATE;
  g.add(punho);

  const botao = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.007, h * 0.007, h * 0.005, 10),
    toon(P.xadrezDourado),
  );
  botao.rotation.z = Math.PI / 2;
  botao.position.set(0, -armLen * ATE, h * 0.046 * w);
  g.add(botao);

  return g;
}

/**
 * A perneira de xadrez, peca de PERNAS do conjunto.
 *
 * REFERENCIAL: o pivo da perna, y = 0 no quadril — uma copia em cada perna,
 * que e o que faz ela dobrar junto com a coxa.
 *
 * A cor clara nao esta aqui: ela e a `cor` da ficha, que repinta a perna que o
 * corpo ja tem. Esta funcao poe SO as casas escuras por cima e a barra da
 * bainha. E a peca mais barata do conjunto, e e de proposito.
 */
function perneiraXadrez(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const raio = h * 0.045 * w;
  const escuro = peca?.corDetalhe ?? P.xadrezPanoEscuro;

  // do quadril ate o tornozelo, parando antes do pe (que fica em `-legH`)
  const DE = -m.legH * 0.86;
  const ATE = -m.legH * 0.04;
  g.add(casasDeXadrez(raio, DE, ATE, 8, 6, escuro));

  // a bainha vinho fecha a barra embaixo — sem ela a calca termina no meio de
  // uma fileira de casas e parece cortada
  const bainha = new THREE.Mesh(
    new THREE.CylinderGeometry(raio * 1.04, raio * 1.06, h * 0.018, 14, 1, true),
    toon(P.xadrezForro, { doubleSide: true }),
  );
  bainha.position.y = DE;
  g.add(bainha);

  return g;
}

/**
 * A coroa de dama, peca de CABECA do conjunto.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio. Ela POUSA por cima, entao
 * nao pede `cobreCabelo` — a juba do Ari continua aparecendo por baixo, que e
 * o que faz uma coroa ler como coroa e nao como capacete.
 *
 * O recorte e o da DAMA do xadrez, e nao o de uma coroa de rei: pontas
 * arredondadas em volta e uma bolinha no meio.
 */
function coroaDeDama(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const ouro = toon(peca?.cor ?? P.xadrezDourado);
  const pedra = toon(peca?.corDetalhe ?? P.xadrezForro);

  /*
   * A ALTURA E MEDIDA PELO CABELO, e nao pelo cranio — a mesma nota do chapeu
   * de campeao, que mora dois metodos acima no rig. A juba do Ari sobe a
   * ~1,35·headR, e uma coroa apoiada no cranio (a `0,52·headR`, que foi a
   * primeira versao) some INTEIRA dentro dela: na foto de costas sobravam tres
   * pontinhos dourados no meio do cabelo.
   */
  const Y = r * 1.4;
  const RAIO = r * 0.72;

  const aro = new THREE.Mesh(
    new THREE.CylinderGeometry(RAIO, RAIO * 1.04, r * 0.24, 18, 1, true),
    toon(peca?.cor ?? P.xadrezDourado, { doubleSide: true }),
  );
  aro.position.y = Y;
  g.add(aro);

  // a faixa de pedras vinho em volta do aro: sem ela o aro e um anel liso, e
  // anel liso em cima da cabeca le como aureola
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const pedrinha = new THREE.Mesh(new THREE.SphereGeometry(r * 0.035, 8, 6), pedra);
    pedrinha.position.set(Math.sin(a) * RAIO * 1.02, Y, Math.cos(a) * RAIO * 1.02);
    pedrinha.scale.z = 0.6;
    g.add(pedrinha);
  }

  // as pontas da DAMA: bolinhas em volta, e a da frente mais alta que as outras
  const PONTAS = 7;
  for (let i = 0; i < PONTAS; i++) {
    const a = (i / PONTAS) * Math.PI * 2;
    const alta = i === 0; // a da frente
    const alturaDaHaste = r * (alta ? 0.3 : 0.18);
    const x = Math.sin(a) * RAIO * 0.98;
    const z = Math.cos(a) * RAIO * 0.98;

    const haste = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.03, r * 0.042, alturaDaHaste, 8),
      ouro,
    );
    haste.position.set(x, Y + r * 0.12 + alturaDaHaste / 2, z);
    g.add(haste);

    const ponta = new THREE.Mesh(
      new THREE.SphereGeometry(r * (alta ? 0.075 : 0.055), 10, 8),
      alta ? pedra : ouro,
    );
    ponta.position.set(x, Y + r * 0.12 + alturaDaHaste, z);
    g.add(ponta);
  }

  return g;
}

// ============================================================ MÃOS E ACESSÓRIO
// As duas vagas que vieram depois (pedido do Renan: "itens de mão, como luvas e
// braceletes" e "acessórios no geral — pins de cabelo, stickers, qualquer coisa
// pequena em qualquer parte do corpo").

/** o raio do antebraço e da mão do rig (`CharacterRig`, "bracos") */
const raioDoPulso = (m: MedidasCorpo): number => m.h * 0.032 * m.w;
const raioDaMao = (m: MedidasCorpo): number => m.h * 0.04 * m.w;

/**
 * LUVAS DE JARDIM: a mão inteira calçada e um punho dobrado de outra cor.
 *
 * REFERENCIAL: o pivô de CADA braço (slot `maos`), y = 0 no ombro e o braço
 * pendendo em -Y. A mão do rig é uma esfera em `-0,92·armLen`; a luva é a mesma
 * esfera 15% maior (casca por fora, sem brigar por pixel), e o punho é um anel
 * no pulso. Nada aqui desloca para o lado, então o `lado` não entra na conta.
 */
function luvasDeJardim(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const pano = toon(peca?.cor ?? P.luvaDeJardim);
  const punho = toon(peca?.corDetalhe ?? P.bandeirinhaVerde);
  const mao = new THREE.Mesh(new THREE.SphereGeometry(raioDaMao(m) * 1.15, 12, 10), pano);
  mao.position.y = -m.armLen * 0.92;
  mao.scale.set(1, 1.08, 1);
  g.add(mao);
  // o punho: um cilindro curto e largo, com um frisinho na borda
  const cano = new THREE.Mesh(
    new THREE.CylinderGeometry(raioDoPulso(m) * 1.45, raioDoPulso(m) * 1.3, m.h * 0.038, 14),
    punho,
  );
  cano.position.y = -m.armLen * 0.8;
  g.add(cano);
  const friso = new THREE.Mesh(new THREE.TorusGeometry(raioDoPulso(m) * 1.45, m.h * 0.005, 5, 16), pano);
  friso.rotation.x = Math.PI / 2;
  friso.position.y = -m.armLen * 0.8 + m.h * 0.019;
  g.add(friso);
  return g;
}

/**
 * PULSEIRA DE MIÇANGAS: um cordãozinho de contas coloridas no pulso ESQUERDO.
 *
 * REFERENCIAL: o pivô de cada braço (slot `maos`). A peça é chamada para os
 * dois braços; ela só monta no de `-X` (`lado === -1`), porque a mão direita é
 * a que segura o sorvete, o regador e o frisbee — pulseira ali some atrás do
 * item. No outro braço volta um grupo vazio.
 */
function pulseiraDeMicangas(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const cores = [peca?.cor ?? P.bandeirinhaRosa, P.bandeirinhaAmarela, P.bandeirinhaAzul, P.bandeirinhaLilas, P.bandeirinhaVerde];
  const raio = raioDoPulso(m) * 1.18;
  const y = -m.armLen * 0.78;
  const contas = 12;
  for (let i = 0; i < contas; i++) {
    const a = (i / contas) * Math.PI * 2;
    const conta = new THREE.Mesh(new THREE.SphereGeometry(m.h * 0.0085, 8, 6), toon(cores[i % cores.length]));
    conta.position.set(Math.cos(a) * raio, y, Math.sin(a) * raio);
    g.add(conta);
  }
  // o berloque: um coraçãozinho pendurado na frente
  const berloque = coracaoChato(m.h * 0.011, peca?.corDetalhe ?? P.cadeadoOuro);
  berloque.position.set(0, y - m.h * 0.014, raio + m.h * 0.004);
  g.add(berloque);
  return g;
}

/** Uma estrela de cinco pontas, deitada no plano XY e olhando para `+Z`. */
function estrelinha(raio: number, espessura: number, cor: number): THREE.Mesh {
  const forma = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? raio : raio * 0.46;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) forma.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else forma.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  forma.closePath();
  const geo = new THREE.ExtrudeGeometry(forma, { depth: espessura, bevelEnabled: false });
  geo.center();
  return new THREE.Mesh(geo, toon(cor));
}

/**
 * PRESILHA DE ESTRELA: uma estrela dourada presa no cabelo, do lado direito.
 *
 * REFERENCIAL: a cabeça (`acessorio` com `presoEm: 'cabeca'`), y = 0 no centro
 * do crânio. Ela pousa em cima do CONTORNO MEDIDO do cabelo (`m.cabelo`), a
 * ~55° do alto — a mesma conta da tiara: um raio fixo servia a um dos dois e
 * sumia na juba do outro. A estrela olha para fora e um tanto para a frente,
 * senão de frente ela vira um risco.
 */
function presilhaDeEstrela(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const r = m.headR;
  const a = 0.95;
  const pivo = new THREE.Group();
  // gira o eixo +X até a direção (sen a, cos a): é ali que o cabelo termina
  pivo.rotation.z = Math.PI / 2 - a;
  const estrela = estrelinha(r * 0.23, r * 0.07, peca?.cor ?? P.cadeadoOuro);
  estrela.position.x = m.cabelo(a) + r * 0.02;
  estrela.rotation.y = Math.PI / 2 - 0.55;
  pivo.add(estrela);
  // o brilhinho: uma bolinha branca no meio da estrela
  const brilho = new THREE.Mesh(new THREE.SphereGeometry(r * 0.045, 8, 6), toon(peca?.corDetalhe ?? P.metalWhite));
  brilho.position.set(m.cabelo(a) + r * 0.05, 0, r * 0.03);
  pivo.add(brilho);
  const g = new THREE.Group();
  g.position.z = -r * 0.02;
  g.add(pivo);
  return g;
}

/**
 * ADESIVO DE CORAÇÃO: um coração chato colado no peito, do lado esquerdo da
 * pessoa (o direito da camiseta de girassol já tem a flor).
 *
 * REFERENCIAL: o corpo (`acessorio` com `presoEm: 'corpo'`), y = 0 no CHÃO. A
 * superfície do tronco sai da cápsula do rig — raio `0,105·h·w`, achatada em
 * 0,82 no `z` —, e fora do meio ela recua: por isso o `z` é a conta do círculo
 * no `x` do adesivo, e não o raio cheio (colado no raio cheio ele flutuava).
 */
function adesivoDeCoracao(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const raioTorso = m.h * 0.105 * m.w;
  const x = -raioTorso * 0.38;
  const z = Math.sqrt(raioTorso * raioTorso - x * x) * 0.82 + m.h * 0.003;
  const coracao = coracaoChato(m.h * 0.025, peca?.cor ?? P.flowerPink);
  coracao.scale.z = 0.5;
  coracao.position.set(x, m.legH + m.torsoH * 0.62, z);
  // levemente torto, como adesivo colado na pressa
  coracao.rotation.z = 0.25;
  g.add(coracao);
  // a borda branca do adesivo, logo atrás
  const borda = coracaoChato(m.h * 0.031, peca?.corDetalhe ?? P.metalWhite);
  borda.scale.z = 0.3;
  borda.position.set(x, m.legH + m.torsoH * 0.62 - m.h * 0.001, z - m.h * 0.003);
  borda.rotation.z = 0.25;
  g.add(borda);
  return g;
}

// As FICHAS das pecas moram em `itens.ts`, junto com o resto do acervo: peca de
// roupa e item como qualquer outro, e mora numa vaga de vestimenta do
// inventario. Aqui fica so o corpo delas.
export {
  gorroDeLa, canoDaBota, vestidoRosa, vestidoDaLoja, gargantilhaDeLaco, gravataDoWalter,
  chapeuDeJardineira, aventalDaJosefina, girassolNoPeito,
  chapeuJoaninha, tiaraDoWalter, tiaraDoPelusa, boneDaGina, mochilaCascoDaJosefina,
  estampaSalvaVidas, estampaRodaGigante, estampaLaranja,
  vestidoMarinheiro, vestidoGatinho, maidJapones, mangaDeQuimono, meiaDeCoxa,
  moletomComCapuz, mangaDeMoletom, oculosDeSol,
  jaquetaFrancesa, mangaDaJaquetaFrancesa, quepeDoCookie,
  blazerXadrez, mangaDoBlazer, perneiraXadrez, coroaDeDama,
  luvasDeJardim, pulseiraDeMicangas, presilhaDeEstrela, adesivoDeCoracao,
};
