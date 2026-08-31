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
function mangaDeQuimono(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const armLen = h * 0.3;
  // Para FORA, e nao centrada no braco.
  //
  // O ombro esta a `h*0.1*w` do eixo e o torso tem raio `h*0.105*w`: uma boca
  // larga centrada no braco cobre o corpo inteiro, e foi o que a primeira
  // versao fez — a manga virou uma capa e engoliu a roupa toda. Deslocada para
  // fora, a borda de dentro passa RENTE ao tronco e a silhueta fica ao lado.
  const paraFora = h * 0.052 * w;
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
 * Gargantilha de laco, a que aparece no pescoco da vitrine.
 *
 * REFERENCIAL: a cabeca, y = 0 no centro do cranio — por isso os numeros sao
 * negativos. O pescoco do rig esta em `-headR * 0.85`, e o acessorio de
 * corrente da ficha ja mora nessa mesma altura.
 */
function gargantilhaDeLaco(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  // na BASE do pescoco, e nao no meio: mais acima o cabelo do Ari, que cai ate
  // o ombro, engole a gargantilha inteira. E a mesma altura do acessorio de
  // corrente da ficha.
  const y = -r * 0.98;

  const fita = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.043, m.h * 0.045, m.h * 0.026, 14, 1, true),
    toon(P.vestidoRenda, { doubleSide: true }),
  );
  fita.position.y = y;
  g.add(fita);

  const l = laco(m.h * 0.026, P.vestidoFita, P.vestidoRenda);
  l.position.set(0, y, m.h * 0.044);
  g.add(l);

  return g;
}

// As FICHAS das pecas moram em `itens.ts`, junto com o resto do acervo: peca de
// roupa e item como qualquer outro, e mora numa vaga de vestimenta do
// inventario. Aqui fica so o corpo delas.
export {
  gorroDeLa, canoDaBota, vestidoRosa, gargantilhaDeLaco,
  vestidoMarinheiro, vestidoGatinho, maidJapones, mangaDeQuimono, meiaDeCoxa,
};
