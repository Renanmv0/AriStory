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
//   cabeca -> nasce dentro da cabeca, y = 0 no centro do cranio
//   pes    -> nasce no pivo da perna, y = 0 no quadril
//   tronco -> nasce no corpo, y = 0 no CHAO
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
    const alca = new THREE.Mesh(
      new THREE.SphereGeometry(escala * 0.62, 8, 6),
      toon(cor),
    );
    alca.position.x = lado * escala * 0.72;
    alca.scale.set(1, 0.78, 0.5);
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
export { gorroDeLa, canoDaBota, vestidoRosa, gargantilhaDeLaco };
