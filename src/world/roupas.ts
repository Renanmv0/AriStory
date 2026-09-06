import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { MedidasCorpo } from '../core/types';

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
 * Gorro de la: calota que cobre o cabelo, com a barra dobrada na borda.
 *
 * A barra tem que cair EXATAMENTE na borda de baixo da calota, e nao mais
 * larga que ela. Uma casca esferica de raio R aberta ate `thetaLength` termina
 * em `y = centro + R·cos(theta)` com raio `R·sen(theta)` — errar essas duas
 * contas poe um anel largo no meio da cupula, e o gorro vira sombrero.
 */
function gorroDeLa(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;

  // Este gorro pede `cobreCabelo`, entao ele pode ser JUSTO: sem a juba por
  // baixo, basta folgar um pouco do cranio. Um chapeu que so pousa por cima
  // (bone, o chapeu de campeao) e que precisa medir pelo cabelo.
  const RAIO = r * 1.07;
  const ABRE = Math.PI * 0.54;
  const CENTRO = r * 0.06;
  const calota = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 18, 12, 0, Math.PI * 2, 0, ABRE),
    toon(P.roupaLa),
  );
  calota.position.y = CENTRO;
  calota.scale.y = 1.16; // um pouco alto: gorro achatado lembra boina
  g.add(calota);

  // onde a casca de fato termina — ver o comentario do cabecalho
  const borda = CENTRO + RAIO * Math.cos(ABRE) * 1.16;
  const raioNaBorda = RAIO * Math.sin(ABRE);
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(raioNaBorda * 1.03, raioNaBorda * 1.03, r * 0.26, 18),
    toon(P.roupaLaBarra),
  );
  barra.position.y = borda;
  g.add(barra);

  const pompom = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.2, 10, 8),
    toon(P.roupaLaBarra),
  );
  pompom.position.y = CENTRO + RAIO * 1.16;
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
function canoDaBota(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const cano = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.05 * m.w, m.h * 0.055 * m.w, m.h * 0.08, 12),
    toon(P.roupaBotaCano),
  );
  cano.position.y = -m.legH + m.h * 0.075;
  g.add(cano);

  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.058 * m.w, m.h * 0.058 * m.w, m.h * 0.018, 12),
    toon(P.roupaBota),
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
function vestidoRosa(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const hipY = m.legH;
  const raioTorso = h * 0.105 * w;
  const ACHATA = 0.85;

  const rosa = toon(P.vestidoRosa);
  const renda = toon(P.vestidoRenda, { doubleSide: true });
  const fita = toon(P.vestidoFita);

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
  const lacoPeito = laco(h * 0.04, P.vestidoFita, P.vestidoRenda);
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

  const lacoCintura = laco(h * 0.036, P.vestidoRosa, P.vestidoFita);
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
    const l = laco(h * 0.022, P.vestidoFita, P.vestidoRenda);
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

// As FICHAS das pecas moram em `itens.ts`, junto com o resto do acervo: peca de
// roupa e item como qualquer outro, e mora numa vaga de vestimenta do
// inventario. Aqui fica so o corpo delas.
export {
  gorroDeLa, canoDaBota, vestidoRosa, gargantilhaDeLaco, gravataDoWalter,
  vestidoMarinheiro, vestidoGatinho, maidJapones, mangaDeQuimono, meiaDeCoxa,
  moletomComCapuz, mangaDeMoletom, oculosDeSol,
};
