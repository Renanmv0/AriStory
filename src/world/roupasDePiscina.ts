import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { corpo, florzinha, folhinha, noTronco } from './roupasDoJardim';
import { tiara } from './roupas';

/**
 * O VESTIÁRIO DO CLUBE — a geometria da moda praia.
 *
 * Pedido do Renan: o vestiário virou guarda-roupa, com uma aba de "roupas de
 * piscina" para desbloquear (a até R$ 20 cada): mais bermudas, mais óculos,
 * chinelos, e mais roupa com cara de piscina.
 *
 * A regra é a de `roupas.ts` (skill `aristory-roupa`): cada função recebe as
 * medidas e devolve um `Object3D` NOVO, e o referencial é o do slot:
 *
 * | slot                              | y = 0 fica em          |
 * |-----------------------------------|------------------------|
 * | `tronco`, `extraQuadril`          | o CHÃO                 |
 * | `pernas` (`extra`), `pes`         | o quadril (por perna)  |
 * | `maos`, `extraBraco`              | o ombro (por braço)    |
 * | `cabeca`, `acessorio` na cabeça   | o centro do crânio     |
 *
 * O QUE APARECE NO CLUBE: lá é o traje de banho — o corpo vira pele e, de
 * roupa, ficam a cabeça, o acessório e o calção. A peça que leva `praia` na
 * ficha (a estampa da bermuda, o chinelo, a boia, o colar de flor) continua
 * no corpo dentro do clube; a camiseta não leva a marca nunca (no clube é sem
 * camiseta e de shorts).
 */

/**
 * Cola um desenho numa superfície: põe em `(x, y, z)` e vira a cara dele
 * (`+Z`) para fora, na direção `(nx, ny, nz)`, com o "para cima" do desenho
 * puxado para o `+Y` — o abacaxi e a âncora ficam em pé.
 *
 * TUDO NO ESPAÇO DO PAI. O `Object3D.lookAt` do three mira em coordenada de
 * MUNDO e desconta a rotação do pai: colado dentro de um grupo girado (a
 * calota inclinada da touca) ele virava a flor para o lado errado. Aqui a
 * conta é a mesma do `lookAt`, só que local.
 */
function colar(obj: THREE.Object3D, pai: THREE.Object3D, x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
  pai.add(obj);
  obj.position.set(x, y, z);
  const giro = new THREE.Matrix4().lookAt(
    new THREE.Vector3(x + nx, y + ny, z + nz),
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(0, 1, 0),
  );
  obj.quaternion.setFromRotationMatrix(giro);
}

// ============================================================= o calção do rig

/**
 * O CALÇÃO E A PERNA DO SHORTS, medidos no rig (`CharacterRig`, "calção de
 * banho" e "A PERNA DO SHORTS"). É por cima deles que a estampa se cola: medir
 * de novo aqui é o que impede a bolinha de afundar no pano ou boiar longe dele.
 */
function short(m: MedidasCorpo) {
  const { h, w } = m;
  const altura = h * 0.105;
  const centro = m.legH + h * 0.012;
  const pernaAltura = m.legH * 0.36;
  const pernaTopo = m.legH * 0.02;
  return {
    // o calção, no CORPO (y = 0 no chão): cilindro achatado em 0,85 no z
    raioCima: h * 0.118 * w,
    raioBaixo: h * 0.112 * w,
    altura,
    baixo: centro - altura / 2,
    cima: centro + altura / 2,
    ACHATA: 0.85,
    // a perna do shorts, no PIVÔ de cada perna (y = 0 no quadril): cone aberto
    pernaCima: h * 0.052 * w,
    pernaBaixo: h * 0.064 * w,
    pernaTopo,
    pernaBarra: pernaTopo - pernaAltura,
    /**
     * Onde a perna do shorts SAI de baixo do calção, em `t` da perna (0 na
     * barra, 1 no cós). Acima disso ela está por dentro do calção, e estampa
     * lá em cima some — por isso as estampas da perna ficam abaixo disto.
     */
    tVisivel: THREE.MathUtils.clamp(
      ((centro - altura / 2 - m.legH) - (pernaTopo - pernaAltura)) / pernaAltura, 0, 1,
    ),
  };
}

type NaSuperficie = { x: number; y: number; z: number; nx: number; nz: number };

/** Um ponto no calção: `a` = 0 na frente (`+X` à direita), `t` = 0 embaixo e 1 em cima. */
function noCalcao(m: MedidasCorpo, a: number, t: number, folga = 1.03): NaSuperficie {
  const s = short(m);
  const raio = THREE.MathUtils.lerp(s.raioBaixo, s.raioCima, t) * folga;
  return {
    x: Math.sin(a) * raio,
    y: THREE.MathUtils.lerp(s.baixo, s.cima, t),
    z: Math.cos(a) * raio * s.ACHATA,
    nx: Math.sin(a),
    nz: Math.cos(a),
  };
}

/** Um ponto na perna do shorts: `a` = 0 na frente, `t` = 0 na barra e 1 no cós. */
function naPernaDoShort(m: MedidasCorpo, a: number, t: number, folga = 1.05): NaSuperficie {
  const s = short(m);
  const raio = THREE.MathUtils.lerp(s.pernaBaixo, s.pernaCima, t) * folga;
  return {
    x: Math.sin(a) * raio,
    y: THREE.MathUtils.lerp(s.pernaBarra, s.pernaTopo, t),
    z: Math.cos(a) * raio,
    nx: Math.sin(a),
    nz: Math.cos(a),
  };
}

/** Uma faixa em volta do calção (listra, cós), de `t0` a `t1`. */
function anelNoCalcao(m: MedidasCorpo, t0: number, t1: number, cor: number, folga = 1.03): THREE.Mesh {
  const s = short(m);
  const r0 = THREE.MathUtils.lerp(s.raioBaixo, s.raioCima, t0) * folga;
  const r1 = THREE.MathUtils.lerp(s.raioBaixo, s.raioCima, t1) * folga;
  const y0 = THREE.MathUtils.lerp(s.baixo, s.cima, t0);
  const y1 = THREE.MathUtils.lerp(s.baixo, s.cima, t1);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 28, 1, true), toon(cor, { doubleSide: true }));
  anel.position.y = (y0 + y1) / 2;
  anel.scale.z = s.ACHATA;
  return anel;
}

/** Uma faixa em volta da perna do shorts, de `t0` a `t1` (0 na barra). */
function anelNaPerna(m: MedidasCorpo, t0: number, t1: number, cor: number, folga = 1.05): THREE.Mesh {
  const s = short(m);
  const r0 = THREE.MathUtils.lerp(s.pernaBaixo, s.pernaCima, t0) * folga;
  const r1 = THREE.MathUtils.lerp(s.pernaBaixo, s.pernaCima, t1) * folga;
  const y0 = THREE.MathUtils.lerp(s.pernaBarra, s.pernaTopo, t0);
  const y1 = THREE.MathUtils.lerp(s.pernaBarra, s.pernaTopo, t1);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 20, 1, true), toon(cor, { doubleSide: true }));
  anel.position.y = (y0 + y1) / 2;
  return anel;
}

/** a mesma cor, um degrau mais escura — o cós e a sombra da costura */
function escuro(cor: number, quanto = 0.82): number {
  return new THREE.Color(cor).multiplyScalar(quanto).getHex();
}

// ------------------------------------------------------------ os desenhos

/**
 * UM HIBISCO: cinco pétalas largas e onduladas, o miolo escuro e o pistilo
 * comprido de ponta amarela — a flor de camisa havaiana. Olha para `+Z`.
 */
function hibisco(raio: number, petala: number, miolo: number = P.hibiscoMiolo): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(petala);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
    const p = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.5, 10, 7), mat);
    p.scale.set(0.95, 1.1, 0.26);
    p.position.set(Math.cos(a) * raio * 0.55, Math.sin(a) * raio * 0.55, 0);
    p.rotation.z = a - Math.PI / 2;
    g.add(p);
  }
  // o fundo da flor, mais escuro: é o que dá profundidade ao miolo
  const fundo = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.26, 8, 6), toon(escuro(petala, 0.62)));
  fundo.scale.z = 0.4;
  fundo.position.z = raio * 0.06;
  g.add(fundo);
  const pistilo = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.05, raio * 0.05, raio * 0.8, 5), toon(miolo));
  pistilo.rotation.x = Math.PI / 2 - 0.5;
  pistilo.position.set(0, raio * 0.18, raio * 0.3);
  g.add(pistilo);
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.11, 6, 5), toon(miolo));
  ponta.position.set(0, raio * 0.36, raio * 0.62);
  g.add(ponta);
  return g;
}

/** UM ABACAXI: o corpo amarelo com os losangos marcados e a coroa de folhas. */
function abacaxi(alto: number): THREE.Group {
  const g = new THREE.Group();
  const corpo_ = new THREE.Mesh(new THREE.SphereGeometry(alto * 0.36, 10, 8), toon(P.abacaxiAmarelo));
  corpo_.scale.set(0.78, 1, 0.42);
  g.add(corpo_);
  // os losangos: pontinhos marrons em quincôncio na frente do corpo
  const ponto = toon(P.abacaxiQuadrado);
  for (const [x, y] of [[-0.12, 0.14], [0.12, 0.14], [0, 0], [-0.13, -0.14], [0.13, -0.14], [0, 0.27], [0, -0.26]] as const) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(alto * 0.035, 5, 4), ponto);
    d.position.set(x * alto, y * alto, alto * 0.14);
    d.scale.z = 0.5;
    g.add(d);
  }
  // a coroa: três folhas pontudas abrindo em leque
  const verde = toon(P.abacaxiCoroa);
  for (const a of [-0.55, 0, 0.55]) {
    const folha = new THREE.Mesh(new THREE.ConeGeometry(alto * 0.085, alto * 0.42, 5), verde);
    folha.scale.z = 0.4;
    folha.position.set(Math.sin(a) * alto * 0.14, alto * 0.5 + Math.cos(a) * alto * 0.06, 0);
    folha.rotation.z = -a;
    g.add(folha);
  }
  return g;
}

/** UMA ONDINHA: a crista em arco com a espuma enrolando na ponta. Olha para `+Z`. */
function ondinha(largura: number, cor: number): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const arco = new THREE.Mesh(new THREE.TorusGeometry(largura * 0.5, largura * 0.1, 6, 12, Math.PI), mat);
  g.add(arco);
  // a espuma: o caracol no fim da crista
  const caracol = new THREE.Mesh(new THREE.TorusGeometry(largura * 0.18, largura * 0.08, 6, 10, Math.PI * 1.4), mat);
  caracol.position.set(largura * 0.32, largura * 0.02, 0);
  caracol.rotation.z = Math.PI * 0.2;
  g.add(caracol);
  return g;
}

/** UMA ÂNCORA de marinheiro: a haste, o cepo, o anel em cima e os braços em arco. */
function ancora(alto: number, cor: number): THREE.Group {
  const g = new THREE.Group();
  const mat = toon(cor);
  const haste = new THREE.Mesh(new THREE.BoxGeometry(alto * 0.1, alto * 0.78, alto * 0.08), mat);
  g.add(haste);
  const cepo = new THREE.Mesh(new THREE.BoxGeometry(alto * 0.46, alto * 0.08, alto * 0.08), mat);
  cepo.position.y = alto * 0.24;
  g.add(cepo);
  const anel = new THREE.Mesh(new THREE.TorusGeometry(alto * 0.1, alto * 0.035, 6, 12), mat);
  anel.position.y = alto * 0.47;
  g.add(anel);
  // os braços: meio anel de boca para cima, e as unhas nas pontas
  const bracos = new THREE.Mesh(new THREE.TorusGeometry(alto * 0.3, alto * 0.05, 6, 14, Math.PI), mat);
  bracos.rotation.z = Math.PI;
  bracos.position.y = -alto * 0.12;
  g.add(bracos);
  for (const lado of [-1, 1] as const) {
    const unha = new THREE.Mesh(new THREE.ConeGeometry(alto * 0.09, alto * 0.2, 4), mat);
    unha.scale.z = 0.5;
    unha.position.set(lado * alto * 0.3, -alto * 0.06, 0);
    unha.rotation.z = -lado * 0.5;
    g.add(unha);
  }
  return g;
}

/** Uma semente de melancia: gotinha preta achatada, com a ponta para cima. */
function semente(tam: number): THREE.Mesh {
  const s = new THREE.Mesh(new THREE.SphereGeometry(tam, 6, 5), toon(P.melanciaSemente));
  s.scale.set(0.62, 1, 0.3);
  return s;
}

/** Uma bolinha chata, colada no pano. */
function bolinha(raio: number, cor: number): THREE.Mesh {
  const b = new THREE.Mesh(new THREE.SphereGeometry(raio, 8, 6), toon(cor));
  b.scale.z = 0.32;
  return b;
}

// ============================================================ AS BERMUDAS

type EstampaDeBermuda = 'listras' | 'bolinhas' | 'hibisco' | 'abacaxi' | 'melancia' | 'ondas';

/**
 * O CÓS E O CORDÃO de toda bermuda nova: a faixa de elástico em cima do
 * calção, um tom abaixo do pano, e o cordão branco na frente — duas pontas
 * pendendo de um nozinho. É o detalhe que faz o calção liso virar bermuda.
 */
function cosComCordao(m: MedidasCorpo, pano: number, cordao: number = P.bermudaCordao): THREE.Group {
  const g = new THREE.Group();
  g.add(anelNoCalcao(m, 0.84, 1.0, escuro(pano), 1.035));
  const mat = toon(cordao);
  const no = noCalcao(m, 0, 0.9, 1.07);
  const n = new THREE.Mesh(new THREE.SphereGeometry(m.h * 0.0055, 8, 6), mat);
  n.position.set(no.x, no.y, no.z);
  g.add(n);
  // as duas pontas: tubinhos que descem abrindo, com o arremate na ponta
  for (const lado of [-1, 1] as const) {
    const de = new THREE.Vector3(no.x, no.y, no.z);
    const meio = new THREE.Vector3(no.x + lado * m.h * 0.008, no.y - m.h * 0.018, no.z + m.h * 0.003);
    const ate = new THREE.Vector3(no.x + lado * m.h * 0.012, no.y - m.h * 0.034, no.z + m.h * 0.001);
    const curva = new THREE.CatmullRomCurve3([de, meio, ate]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 8, m.h * 0.0022, 5, false), mat));
    const ponta = new THREE.Mesh(new THREE.CylinderGeometry(m.h * 0.0032, m.h * 0.0032, m.h * 0.007, 6), mat);
    ponta.position.copy(ate);
    ponta.position.y -= m.h * 0.003;
    g.add(ponta);
  }
  return g;
}

/**
 * Espalha um desenho pela superfície: uma chamada por ponto, e cada desenho
 * sai olhando para fora (a normal da superfície).
 */
function espalhar(
  pai: THREE.Object3D,
  pontos: readonly NaSuperficie[],
  desenho: (i: number) => THREE.Object3D,
  giro: (i: number) => number = () => 0,
): void {
  pontos.forEach((p, i) => {
    const obj = desenho(i);
    colar(obj, pai, p.x, p.y, p.z, p.nx, 0, p.nz);
    obj.rotateZ(giro(i));
  });
}

/** Os pontos de uma estampa no calção: `linhas` alturas, `porLinha` desenhos em volta. */
function gradeNoCalcao(m: MedidasCorpo, linhas: readonly number[], porLinha: number, folga = 1.035): NaSuperficie[] {
  const pontos: NaSuperficie[] = [];
  linhas.forEach((t, l) => {
    for (let i = 0; i < porLinha; i++) {
      // linha sim, linha não, a grade anda meio passo: quincôncio, e não xadrez
      const a = ((i + (l % 2) * 0.5) / porLinha) * Math.PI * 2;
      pontos.push(noCalcao(m, a, t, folga));
    }
  });
  return pontos;
}

/** Idem na perna do shorts, só na parte que aparece (abaixo do calção). */
function gradeNaPerna(m: MedidasCorpo, linhas: readonly number[], porLinha: number, folga = 1.06): NaSuperficie[] {
  const s = short(m);
  const pontos: NaSuperficie[] = [];
  linhas.forEach((f, l) => {
    const t = f * s.tVisivel;
    for (let i = 0; i < porLinha; i++) {
      const a = ((i + (l % 2) * 0.5) / porLinha) * Math.PI * 2;
      pontos.push(naPernaDoShort(m, a, t, folga));
    }
  });
  return pontos;
}

/**
 * AS BERMUDAS ESTAMPADAS. Cada uma devolve DUAS fábricas: a do QUADRIL
 * (`extraQuadril`, a estampa do calção, no corpo) e a da PERNA (`extra`, a
 * estampa da perna do shorts, no pivô de cada perna). O pano em si é o calção
 * do rig, pintado pela `corBanho` da ficha — aqui só entra o que vai por cima.
 *
 * A estampa aparece no clube (a ficha leva `praia`) e na rua, onde a bermuda
 * já veste o mesmo calção por cima da perna de pele.
 */
function bermudaDe(estampa: EstampaDeBermuda) {
  const quadril = (m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const pano = peca?.corBanho ?? P.bermudaAzul;
    const tinta = peca?.corDetalhe ?? P.bermudaCordao;
    const h = m.h;
    // o cós da melancia é a casca; o das outras, o próprio pano mais escuro
    g.add(cosComCordao(m, estampa === 'melancia' ? P.melanciaCasca : pano));

    if (estampa === 'listras') {
      for (const [t0, t1] of [[0.14, 0.26], [0.42, 0.54], [0.68, 0.78]] as const) {
        g.add(anelNoCalcao(m, t0, t1, tinta));
      }
      // a âncora vermelha na frente, do lado direito, por cima das listras
      const p = noCalcao(m, 0.55, 0.46, 1.045);
      colar(ancora(h * 0.04, P.ancoraVermelha), g, p.x, p.y, p.z, p.nx, 0, p.nz);
    } else if (estampa === 'bolinhas') {
      espalhar(g, gradeNoCalcao(m, [0.14, 0.42, 0.7], 11), () => bolinha(h * 0.0085, tinta));
    } else if (estampa === 'hibisco') {
      const pontos = gradeNoCalcao(m, [0.32, 0.62], 4, 1.04);
      espalhar(g, pontos, (i) => hibisco(h * 0.022, i % 2 ? P.hibiscoRosa : P.hibiscoVermelho), (i) => i * 0.7);
      // as folhas escuras entre as flores
      espalhar(g, gradeNoCalcao(m, [0.47], 8, 1.035).filter((_, i) => i % 2 === 1),
        () => folhinha(h * 0.03, P.folhaHavaiana, P.bermudaHavaiana), (i) => 0.8 + i * 0.9);
    } else if (estampa === 'abacaxi') {
      espalhar(g, gradeNoCalcao(m, [0.3, 0.62], 5, 1.04), () => abacaxi(h * 0.034), (i) => (i % 2 ? 0.25 : -0.25));
    } else if (estampa === 'melancia') {
      espalhar(g, gradeNoCalcao(m, [0.2, 0.46, 0.7], 9), () => semente(h * 0.0065), (i) => ((i * 37) % 7 - 3) * 0.12);
    } else {
      // ondas: duas fileiras de cristas brancas em volta do calção
      espalhar(g, gradeNoCalcao(m, [0.22, 0.56], 9), () => ondinha(h * 0.026, tinta));
    }
    return g;
  };

  const perna = (m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const tinta = peca?.corDetalhe ?? P.bermudaCordao;
    const h = m.h;
    const s = short(m);
    const v = s.tVisivel;

    if (estampa === 'listras') {
      for (const [t0, t1] of [[0.0, 0.07], [0.3, 0.4], [0.58, 0.68]] as const) {
        g.add(anelNaPerna(m, t0 * v, t1 * v, tinta));
      }
    } else if (estampa === 'bolinhas') {
      g.add(anelNaPerna(m, 0, 0.06 * v, tinta));
      espalhar(g, gradeNaPerna(m, [0.3, 0.68], 6), () => bolinha(h * 0.008, tinta));
    } else if (estampa === 'hibisco') {
      // uma flor grande de lado (a parte de FORA da perna) e uma na frente
      const fora = naPernaDoShort(m, lado * Math.PI / 2, v * 0.48, 1.08);
      colar(hibisco(h * 0.022, P.hibiscoVermelho), g, fora.x, fora.y, fora.z, fora.nx, 0, fora.nz);
      const frente = naPernaDoShort(m, -lado * 0.35, v * 0.35, 1.08);
      colar(hibisco(h * 0.018, P.hibiscoRosa), g, frente.x, frente.y, frente.z, frente.nx, 0, frente.nz);
      const atras = naPernaDoShort(m, Math.PI, v * 0.45, 1.07);
      const f = folhinha(h * 0.03, P.folhaHavaiana, P.bermudaHavaiana);
      colar(f, g, atras.x, atras.y, atras.z, atras.nx, 0, atras.nz);
      f.rotateZ(0.6);
    } else if (estampa === 'abacaxi') {
      espalhar(g, gradeNaPerna(m, [0.42], 3), () => abacaxi(h * 0.032), (i) => (i % 2 ? 0.3 : -0.2));
    } else if (estampa === 'melancia') {
      // a casca na barra: o branco da entrecasca e o verde por fora
      g.add(anelNaPerna(m, 0, 0.16 * v, P.melanciaBranco, 1.055));
      g.add(anelNaPerna(m, 0, 0.09 * v, P.melanciaCasca, 1.07));
      espalhar(g, gradeNaPerna(m, [0.42, 0.72], 6), () => semente(h * 0.006), (i) => ((i * 53) % 5 - 2) * 0.15);
    } else {
      g.add(anelNaPerna(m, 0, 0.07 * v, tinta));
      espalhar(g, gradeNaPerna(m, [0.36, 0.72], 5), () => ondinha(h * 0.024, tinta));
    }
    return g;
  };

  return { quadril, perna };
}

const bermudaListrada = bermudaDe('listras');
const bermudaDeBolinhas = bermudaDe('bolinhas');
const bermudaHavaiana = bermudaDe('hibisco');
const bermudaDeAbacaxi = bermudaDe('abacaxi');
const bermudaDeMelancia = bermudaDe('melancia');
const bermudaDeOndinhas = bermudaDe('ondas');

// =============================================================== OS ÓCULOS

/*
 * AS MEDIDAS DO ROSTO são as do óculos escuro de sempre (`oculosDeSol`, em
 * `roupas.ts`, onde está a conta inteira): os olhos em `x = ±0,38·headR`, um
 * fio acima do centro, e a peça a `1,07·headR` do centro do crânio — perto
 * disso a lente entra na bochecha, longe disso ela boia.
 */
const OLHO_X = 0.38;
const OLHO_Y = 0.04;
const FRENTE = 1.07;

/** As duas hastes, da dobradiça até afundar no crânio antes da orelha. */
function hastes(g: THREE.Group, r: number, mat: THREE.Material, grossura = 0.05, de = 0.6): void {
  for (const lado of [-1, 1] as const) {
    const ax = r * de;
    const az = r * FRENTE - r * 0.06;
    const bx = r * 0.8;
    const bz = r * 0.38;
    const dx = bx - ax;
    const dz = bz - az;
    const haste = new THREE.Mesh(new THREE.BoxGeometry(r * grossura, r * 0.07, Math.hypot(dx, dz)), mat);
    haste.position.set(lado * (ax + bx) / 2, r * (OLHO_Y + 0.07), (az + bz) / 2);
    haste.rotation.y = lado * Math.atan2(dx, dz);
    g.add(haste);
  }
}

/** Uma forma de lente desenhada no plano XY, e o aro dela com a lente vazada. */
function lenteDeForma(forma: THREE.Shape, escalaDoFuro: number, espessura: number, aro: THREE.Material, vidro: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  // o aro: a forma inteira com a própria forma, menor, recortada no meio
  const moldura = forma.clone();
  const furo = new THREE.Path(forma.getPoints(24).map((p) => p.clone().multiplyScalar(escalaDoFuro)));
  moldura.holes.push(furo);
  const aroMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(moldura, { depth: espessura, bevelEnabled: false, curveSegments: 16 }),
    aro,
  );
  aroMesh.position.z = -espessura / 2;
  g.add(aroMesh);
  // a lente: a forma do furo, um fio atrás da frente do aro
  const lente = new THREE.Mesh(
    new THREE.ShapeGeometry(new THREE.Shape(forma.getPoints(24).map((p) => p.clone().multiplyScalar(escalaDoFuro * 1.02))), 16),
    vidro,
  );
  lente.position.z = 0;
  g.add(lente);
  return g;
}

/** A forma de coração, do tamanho `s` (meia largura), com a ponta para baixo. */
function formaDeCoracao(s: number): THREE.Shape {
  const f = new THREE.Shape();
  f.moveTo(0, -0.95 * s);
  f.bezierCurveTo(-0.15 * s, -0.7 * s, -1.0 * s, -0.25 * s, -1.0 * s, 0.25 * s);
  f.bezierCurveTo(-1.0 * s, 0.78 * s, -0.36 * s, 0.98 * s, 0, 0.52 * s);
  f.bezierCurveTo(0.36 * s, 0.98 * s, 1.0 * s, 0.78 * s, 1.0 * s, 0.25 * s);
  f.bezierCurveTo(1.0 * s, -0.25 * s, 0.15 * s, -0.7 * s, 0, -0.95 * s);
  return f;
}

/**
 * A forma de lente GATINHO, do lado `lado` do rosto: oval achatado com o
 * canto de FORA puxado para cima em ponta — é a ponta que diz "gatinho".
 */
function formaDeGatinho(r: number, lado: -1 | 1): THREE.Shape {
  const x = (v: number) => lado * v * r;
  const f = new THREE.Shape();
  f.moveTo(x(-0.25), 0.02 * r);
  f.quadraticCurveTo(x(-0.25), -0.17 * r, x(0.0), -0.17 * r);
  f.quadraticCurveTo(x(0.24), -0.17 * r, x(0.29), 0.04 * r);
  f.quadraticCurveTo(x(0.33), 0.14 * r, x(0.38), 0.21 * r);
  f.quadraticCurveTo(x(0.12), 0.18 * r, x(-0.18), 0.14 * r);
  f.quadraticCurveTo(x(-0.26), 0.12 * r, x(-0.25), 0.02 * r);
  return f;
}

type ModeloDeOculos = 'redondo' | 'gatinho' | 'coracao' | 'espelhado' | 'natacao';

/**
 * OS ÓCULOS DO VESTIÁRIO — cinco jeitos, no mesmo rosto do óculos escuro.
 *
 * Vaga `acessorio`, presos na CABEÇA (pedido do Renan: óculos junto com
 * chapéu). Aparecem no clube como aparecem na rua: acessório vai para a água.
 */
function oculosDoVestiario(modelo: ModeloDeOculos) {
  return (m: MedidasCorpo): THREE.Object3D => {
    const g = new THREE.Group();
    const r = m.headR;
    const Y = r * OLHO_Y;
    const Z = r * FRENTE;

    if (modelo === 'redondo') {
      // redondinho de aro dourado fino, a lente âmbar, a ponte em arco e as
      // plaquetas do nariz
      const ouro = toon(P.oculosDourado);
      const ambar = toon(P.oculosAmbar, { glow: 0.12 });
      for (const lado of [-1, 1] as const) {
        const vidro = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 0.04, 22), ambar);
        vidro.rotation.x = Math.PI / 2;
        vidro.position.set(lado * r * OLHO_X, Y, Z);
        g.add(vidro);
        const aro = new THREE.Mesh(new THREE.TorusGeometry(r * 0.225, r * 0.022, 8, 24), ouro);
        aro.position.set(lado * r * OLHO_X, Y, Z + r * 0.005);
        g.add(aro);
        const plaqueta = new THREE.Mesh(new THREE.SphereGeometry(r * 0.035, 6, 5), toon(P.oculosStrass));
        plaqueta.position.set(lado * r * 0.1, Y - r * 0.1, Z - r * 0.04);
        g.add(plaqueta);
      }
      const ponte = new THREE.Mesh(new THREE.TorusGeometry(r * 0.155, r * 0.018, 6, 14, Math.PI), ouro);
      ponte.position.set(0, Y - r * 0.02, Z + r * 0.01);
      g.add(ponte);
      hastes(g, r, ouro, 0.035, 0.6);
      return g;
    }

    if (modelo === 'gatinho') {
      const rosa = toon(P.oculosGatinhoRosa);
      const lente = toon(P.oculosGatinhoLente, { doubleSide: true });
      for (const lado of [-1, 1] as const) {
        const l = lenteDeForma(formaDeGatinho(r, lado), 0.78, r * 0.07, rosa, lente);
        l.position.set(lado * r * OLHO_X, Y, Z);
        g.add(l);
        // os dois strass na ponta de fora
        for (const [dx, dy] of [[0.31, 0.15], [0.25, 0.1]] as const) {
          const strass = new THREE.Mesh(new THREE.SphereGeometry(r * 0.028, 6, 5), toon(P.oculosStrass, { glow: 0.35 }));
          strass.position.set(lado * r * (OLHO_X + dx), Y + dy * r, Z + r * 0.045);
          g.add(strass);
        }
      }
      const ponte = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.03, r * 0.03, r * 0.24, 8), rosa);
      ponte.rotation.z = Math.PI / 2;
      ponte.position.set(0, Y + r * 0.08, Z + r * 0.01);
      g.add(ponte);
      hastes(g, r, rosa, 0.055, 0.62);
      return g;
    }

    if (modelo === 'coracao') {
      const aro = toon(P.oculosCoracaoAro);
      const lente = toon(P.oculosCoracaoLente, { doubleSide: true, glow: 0.12 });
      for (const lado of [-1, 1] as const) {
        const l = lenteDeForma(formaDeCoracao(r * 0.27), 0.8, r * 0.07, aro, lente);
        l.position.set(lado * r * OLHO_X, Y + r * 0.02, Z);
        // cada coração inclina um tiquinho para fora, como no óculos de festa
        l.rotation.z = -lado * 0.12;
        g.add(l);
        // o brilho de lente: um risquinho claro no alto do coração
        const brilho = new THREE.Mesh(new THREE.SphereGeometry(r * 0.05, 6, 5), toon(P.oculosStrass, { glow: 0.4 }));
        brilho.scale.set(1.4, 0.55, 0.3);
        brilho.position.set(lado * r * OLHO_X - r * 0.1, Y + r * 0.11, Z + r * 0.04);
        g.add(brilho);
      }
      const ponte = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.032, r * 0.032, r * 0.22, 8), aro);
      ponte.rotation.z = Math.PI / 2;
      ponte.position.set(0, Y + r * 0.1, Z + r * 0.01);
      g.add(ponte);
      hastes(g, r, aro, 0.05, 0.62);
      return g;
    }

    if (modelo === 'espelhado') {
      // UMA LENTE SÓ, curva, dando a volta no rosto — o óculos esportivo. É um
      // pedaço de cilindro em volta da cabeça, e o espelhado é a lente azul
      // com um pouco de luz própria (o toon puro deixava ela fosca)
      const R = r * 1.1;
      const abre = 0.92;
      const lente = new THREE.Mesh(
        new THREE.CylinderGeometry(R, R, r * 0.26, 28, 1, true, -abre, abre * 2),
        toon(P.oculosEspelhado, { doubleSide: true, glow: 0.18 }),
      );
      lente.position.y = Y - r * 0.01;
      g.add(lente);
      // a barra branca em cima da lente, e o encosto do nariz embaixo
      const branco = toon(P.oculosEspelhadoAro);
      const barra = new THREE.Mesh(
        new THREE.CylinderGeometry(R * 1.012, R * 1.012, r * 0.055, 28, 1, true, -abre - 0.04, abre * 2 + 0.08),
        toon(P.oculosEspelhadoAro, { doubleSide: true }),
      );
      barra.position.y = Y + r * 0.125;
      g.add(barra);
      const nariz = new THREE.Mesh(new THREE.BoxGeometry(r * 0.16, r * 0.06, r * 0.08), branco);
      nariz.position.set(0, Y - r * 0.14, R - r * 0.02);
      g.add(nariz);
      // o reflexo: dois riscos claros inclinados, um em cada olho
      for (const lado of [-1, 1] as const) {
        const a = lado * 0.32;
        const reflexo = new THREE.Mesh(
          new THREE.CylinderGeometry(R * 1.004, R * 1.004, r * 0.16, 6, 1, true, a - 0.05, 0.1),
          toon(P.oculosEspelhadoReflexo, { doubleSide: true, glow: 0.45 }),
        );
        reflexo.position.y = Y + r * 0.01;
        reflexo.rotation.z = -lado * 0.08;
        g.add(reflexo);
      }
      // as hastes saem da ponta da lente, em volta da cabeça
      for (const lado of [-1, 1] as const) {
        const ax = Math.sin(abre) * R;
        const az = Math.cos(abre) * R;
        const bx = r * 0.84;
        const bz = r * 0.2;
        const haste = new THREE.Mesh(new THREE.BoxGeometry(r * 0.06, r * 0.08, Math.hypot(bx - ax, bz - az)), branco);
        haste.position.set(lado * (ax + bx) / 2, Y + r * 0.08, (az + bz) / 2);
        haste.rotation.y = lado * Math.atan2(bx - ax, bz - az);
        g.add(haste);
      }
      return g;
    }

    // ÓCULOS DE NATAÇÃO: duas conchinhas ovais de lente turquesa, o aro azul,
    // a pontezinha e a TIRA dando a volta na cabeça RENTE AO CRÂNIO. Ela já
    // seguiu o contorno do cabelo, e com a touca de natação (que esconde o
    // cabelo) virava um anel boiando em volta da cabeça. Rente, ela some por
    // dentro dos cachos quando há cabelo — como tira de verdade, por baixo — e
    // abraça a borracha quando há touca.
    const aro = toon(P.oculosNatacaoAro);
    const lente = toon(P.oculosNatacaoLente, { glow: 0.22 });
    for (const lado of [-1, 1] as const) {
      const concha = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.19, r * 0.21, r * 0.12, 18), aro);
      concha.rotation.x = Math.PI / 2;
      concha.scale.set(1.18, 1, 0.84);
      concha.position.set(lado * r * 0.36, Y, Z - r * 0.03);
      g.add(concha);
      const vidro = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.16, r * 0.16, r * 0.03, 18), lente);
      vidro.rotation.x = Math.PI / 2;
      vidro.scale.set(1.18, 1, 0.84);
      vidro.position.set(lado * r * 0.36, Y, Z + r * 0.035);
      g.add(vidro);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(r * 0.045, 6, 5), toon(P.oculosStrass, { glow: 0.5 }));
      brilho.scale.set(1.3, 0.7, 0.3);
      brilho.position.set(lado * r * 0.36 - r * 0.07, Y + r * 0.06, Z + r * 0.06);
      g.add(brilho);
    }
    const ponte = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.025, r * 0.025, r * 0.2, 6), aro);
    ponte.rotation.z = Math.PI / 2;
    ponte.position.set(0, Y, Z + r * 0.01);
    g.add(ponte);
    // a touca é uma esfera de 1,07·headR: a tira passa um fio por fora dela
    const S = r * 1.12;
    const tira = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-r * 0.6, Y, Z - r * 0.12),
      new THREE.Vector3(-S * 0.92, Y + r * 0.04, r * 0.15),
      new THREE.Vector3(-S * 0.72, Y + r * 0.08, -S * 0.66),
      new THREE.Vector3(0, Y + r * 0.1, -S * 0.96),
      new THREE.Vector3(S * 0.72, Y + r * 0.08, -S * 0.66),
      new THREE.Vector3(S * 0.92, Y + r * 0.04, r * 0.15),
      new THREE.Vector3(r * 0.6, Y, Z - r * 0.12),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(tira, 48, r * 0.035, 6, false), aro));
    return g;
  };
}

const oculosRedondo = oculosDoVestiario('redondo');
const oculosGatinho = oculosDoVestiario('gatinho');
const oculosDeCoracao = oculosDoVestiario('coracao');
const oculosEspelhado = oculosDoVestiario('espelhado');
const oculosDeNatacao = oculosDoVestiario('natacao');

// ============================================================== OS CHINELOS

type ModeloDeChinelo = 'dedo' | 'florido' | 'melancia' | 'slide';

/**
 * O PÉ DO RIG, onde o chinelo calça: a caixa do tênis (`CharacterRig`,
 * "foot"), no pivô de cada perna. A ficha do chinelo leva `pesNus`, então essa
 * caixa vira PELE — o pé descalço — e aqui só entram a sola e a tira.
 */
function pe(m: MedidasCorpo) {
  const { h, w } = m;
  return {
    chao: -m.legH,
    /** o centro do pé em z (ele avança um fio para a frente da perna) */
    z: h * 0.018,
    meiaLargura: h * 0.075 * w * 0.5,
    alto: h * 0.045,
    meioComprimento: h * 0.11 * 0.5,
  };
}

/**
 * A SOLA, vista de cima: calcanhar estreito, a "bola" do pé mais larga e o
 * bico arredondado. Desenhada no plano XY com `y = -z` do mundo (o bico em y
 * negativo), para que o `rotation.x = -PI/2` a deite com a espessura para
 * CIMA e o bico para a frente.
 */
function formaDaSola(m: MedidasCorpo, encolhe = 1): THREE.Shape {
  const p = pe(m);
  const k = encolhe;
  const larg = p.meiaLargura;
  const zC = p.z - (p.meioComprimento + m.h * 0.006) * k;
  const zB = p.z + m.h * 0.028 * k;
  const zT = p.z + (p.meioComprimento + m.h * 0.012) * k;
  const wC = larg * 1.1 * k;
  const wM = larg * 1.14 * k;
  const wB = larg * 1.28 * k;
  const pt = (x: number, z: number): [number, number] => [x, -z];
  const f = new THREE.Shape();
  f.moveTo(...pt(0, zC));
  f.quadraticCurveTo(...pt(wC, zC), ...pt(wC, zC + m.h * 0.02 * k));
  f.lineTo(...pt(wM, p.z - m.h * 0.005 * k));
  f.quadraticCurveTo(...pt(wB, zB - m.h * 0.012 * k), ...pt(wB, zB));
  f.quadraticCurveTo(...pt(wB * 0.95, zT), ...pt(0, zT));
  f.quadraticCurveTo(...pt(-wB * 0.95, zT), ...pt(-wB, zB));
  f.quadraticCurveTo(...pt(-wB, zB - m.h * 0.012 * k), ...pt(-wM, p.z - m.h * 0.005 * k));
  f.lineTo(...pt(-wC, zC + m.h * 0.02 * k));
  f.quadraticCurveTo(...pt(-wC, zC), ...pt(0, zC));
  return f;
}

/** Uma camada de sola, deitada, de `y0` com `espessura` para cima. */
function camadaDeSola(m: MedidasCorpo, y0: number, espessura: number, cor: number, encolhe = 1): THREE.Mesh {
  const geo = new THREE.ExtrudeGeometry(formaDaSola(m, encolhe), {
    depth: espessura,
    bevelEnabled: true,
    bevelThickness: m.h * 0.0012,
    bevelSize: m.h * 0.0012,
    bevelSegments: 2,
    curveSegments: 10,
  });
  const sola = new THREE.Mesh(geo, toon(cor));
  sola.rotation.x = -Math.PI / 2;
  sola.position.y = y0;
  return sola;
}

/**
 * OS CHINELOS — o de dedo de sempre (três cores), o florido, o de melancia e
 * o slide do clube.
 *
 * Vaga `pes`, com `pesNus` e `praia`: o pé de pele por cima da sola, e o
 * chinelo continua no pé dentro do clube (é para isso que ele existe).
 */
function chinelo(modelo: ModeloDeChinelo) {
  return (m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D => {
    const g = new THREE.Group();
    const h = m.h;
    const p = pe(m);
    const tiraCor = peca?.cor ?? P.chineloAzul;
    const solaCor = peca?.corDetalhe ?? P.chineloSolaBranca;

    // A SOLA EM DUAS CAMADAS: a de baixo (um tom mais escura, ou a casca da
    // melancia) um fio maior que a de cima — é a borda de duas cores que diz
    // "chinelo de borracha" de longe. O pé afunda um tiquinho na de cima.
    const baixo = modelo === 'melancia' ? P.melanciaCasca : modelo === 'slide' ? P.chineloSlide : escuro(solaCor, 0.8);
    const cima = modelo === 'melancia' ? P.bermudaMelancia : solaCor;
    const espessura = modelo === 'slide' ? h * 0.009 : h * 0.006;
    g.add(camadaDeSola(m, p.chao - h * 0.001, espessura, baixo));
    if (modelo === 'melancia') {
      // a entrecasca branca, entre o verde e o vermelho
      g.add(camadaDeSola(m, p.chao - h * 0.001 + espessura, h * 0.0022, P.melanciaBranco, 0.985));
    }
    const topoDaSola = p.chao + espessura + h * (modelo === 'melancia' ? 0.0092 : 0.007);
    g.add(camadaDeSola(m, topoDaSola - h * 0.007, h * 0.007, cima, 0.97));

    const matTira = toon(tiraCor);
    const topoDoPe = p.chao + p.alto - h * 0.0005;

    if (modelo === 'slide') {
      // A FAIXA LARGA do slide: meio cilindro deitado, de lado a lado da sola
      // por cima do pé, na metade da frente dele
      const faixa = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, h * 0.05, 18, 1, true, -Math.PI / 2, Math.PI),
        toon(P.chineloSlide, { doubleSide: true }),
      );
      faixa.rotation.x = -Math.PI / 2;
      faixa.scale.set(p.meiaLargura * 1.2, 1, topoDoPe - topoDaSola + h * 0.004);
      faixa.position.set(0, topoDaSola - h * 0.001, p.z + h * 0.018);
      g.add(faixa);
      // as duas listras brancas atravessando a faixa
      for (const dz of [-0.013, 0.013]) {
        const listra = new THREE.Mesh(
          new THREE.CylinderGeometry(1, 1, h * 0.007, 18, 1, true, -Math.PI / 2, Math.PI),
          toon(P.chineloSolaBranca, { doubleSide: true }),
        );
        listra.rotation.x = -Math.PI / 2;
        listra.scale.set(p.meiaLargura * 1.23, 1, topoDoPe - topoDaSola + h * 0.0055);
        listra.position.set(0, topoDaSola - h * 0.001, p.z + h * (0.018 + dz));
        g.add(listra);
      }
      // o emblema do clube: uma ondinha branca no alto da faixa
      const onda = ondinha(h * 0.014, P.chineloSolaBranca);
      colar(onda, g, 0, topoDoPe + h * 0.0045, p.z + h * 0.018, 0, 1, 0.15);
      return g;
    }

    // A TIRA DO CHINELO DE DEDO: do pino entre os dedos, na frente, as duas
    // metades abrem por cima do peito do pé e descem pelos lados até a sola.
    // Tubo por uma curva — a tira de borracha é redonda e macia, não uma régua.
    const pino = new THREE.Vector3(0, topoDoPe + h * 0.003, p.z + p.meioComprimento * 0.55);
    for (const lado of [-1, 1] as const) {
      const curva = new THREE.CatmullRomCurve3([
        pino,
        new THREE.Vector3(lado * p.meiaLargura * 0.55, topoDoPe + h * 0.004, p.z + p.meioComprimento * 0.25),
        new THREE.Vector3(lado * (p.meiaLargura + h * 0.003), topoDoPe - h * 0.006, p.z - p.meioComprimento * 0.05),
        new THREE.Vector3(lado * (p.meiaLargura + h * 0.004), topoDaSola + h * 0.002, p.z - p.meioComprimento * 0.15),
      ]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 14, h * 0.0048, 6, false), matTira));
    }
    // o pino: o botãozinho da junção, em cima do pé
    const botao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0065, 8, 6), matTira);
    botao.scale.y = 0.7;
    botao.position.copy(pino);
    g.add(botao);

    if (modelo === 'florido') {
      // a florzinha na junção da tira, olhando para cima e para a frente
      const flor = florzinha(h * 0.017, P.chineloSolaBranca, P.flowerYellow, 5);
      colar(flor, g, pino.x, pino.y + h * 0.003, pino.z, 0, 1, 0.7);
    } else if (modelo === 'melancia') {
      // as sementes na borda vermelha da sola, em volta do pé
      const sementes: Array<[number, number]> = [[1.17, 0.2], [-1.17, 0.15], [1.2, -0.3], [-1.2, -0.35], [0.5, 1.12], [-0.5, 1.1]];
      for (const [fx, fz] of sementes) {
        const s = semente(h * 0.0035);
        s.rotation.x = -Math.PI / 2;
        s.position.set(fx * p.meiaLargura, topoDaSola + h * 0.0006, p.z + fz * p.meioComprimento);
        g.add(s);
      }
    }
    return g;
  };
}

const chineloAzul = chinelo('dedo');
const chineloFlorido = chinelo('florido');
const chineloDeMelancia = chinelo('melancia');
const chineloSlide = chinelo('slide');

// ============================================================ A CABEÇA

/**
 * CHAPÉU DE PRAIA — o de pescador, de palha-creme: copa baixa listrada, a
 * faixa azul com o nozinho, e a aba caída com duas linhas de pesponto.
 *
 * POUSA NO CABELO DE QUEM VESTE, como o chapéu joaninha: a base é o alto
 * MEDIDO do cabelo (`m.cabelo(0)`) menos um tanto, então nos cachos do Ari ele
 * fica em cima da juba e no Renan desce até o cabelo curto dele.
 */
function chapeuDePraia(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const palha = peca?.cor ?? P.chapeuPraia;
  const listra = peca?.corDetalhe ?? P.chapeuPraiaListra;
  const BORDA = m.cabelo(0) - r * 0.24;
  const RB = r * 0.9;
  const RT = r * 0.74;
  const HC = r * 0.42;

  const chapeu = new THREE.Group();
  chapeu.rotation.x = -0.1;
  g.add(chapeu);

  const matPalha = toon(palha, { doubleSide: true });
  const copa = new THREE.Mesh(new THREE.CylinderGeometry(RT, RB, HC, 26, 1, true), matPalha);
  copa.position.y = BORDA + HC / 2;
  chapeu.add(copa);
  const tampo = new THREE.Mesh(new THREE.SphereGeometry(RT, 26, 8, 0, Math.PI * 2, 0, Math.PI / 2), matPalha);
  tampo.scale.y = 0.32;
  tampo.position.y = BORDA + HC;
  chapeu.add(tampo);

  // as listras da copa: duas faixas finas acompanhando o cone
  const raioEm = (t: number) => THREE.MathUtils.lerp(RB, RT, t) * 1.012;
  for (const [t0, t1] of [[0.5, 0.62], [0.76, 0.88]] as const) {
    const faixa = new THREE.Mesh(
      new THREE.CylinderGeometry(raioEm(t1), raioEm(t0), HC * (t1 - t0), 26, 1, true),
      toon(listra, { doubleSide: true }),
    );
    faixa.position.y = BORDA + HC * (t0 + t1) / 2;
    chapeu.add(faixa);
  }
  // a faixa larga embaixo da copa, e o nozinho dela do lado esquerdo
  const faixaLarga = new THREE.Mesh(
    new THREE.CylinderGeometry(raioEm(0.3), raioEm(0.02), HC * 0.28, 26, 1, true),
    toon(listra, { doubleSide: true }),
  );
  faixaLarga.position.y = BORDA + HC * 0.16;
  chapeu.add(faixaLarga);
  const matListra = toon(listra);
  const no = new THREE.Mesh(new THREE.SphereGeometry(r * 0.07, 8, 6), matListra);
  no.position.set(-RB * 1.02, BORDA + HC * 0.16, r * 0.1);
  chapeu.add(no);
  for (const giro of [-0.55, 0.35]) {
    const ponta = new THREE.Mesh(new THREE.BoxGeometry(r * 0.05, r * 0.2, r * 0.02), matListra);
    ponta.position.set(-RB * 1.05, BORDA + HC * 0.16 - r * 0.1, r * 0.1);
    ponta.rotation.set(0, Math.PI / 2, giro);
    chapeu.add(ponta);
  }

  // A ABA CAÍDA: um tronco de cone aberto, largo embaixo, com o pesponto em
  // dois anéis e a borda na cor da listra
  const RA = r * 1.34;
  const HA = r * 0.14;
  const aba = new THREE.Mesh(new THREE.CylinderGeometry(RB * 0.99, RA, HA, 30, 1, true), matPalha);
  aba.position.y = BORDA + r * 0.01 - HA / 2;
  chapeu.add(aba);
  for (const t of [0.35, 0.72]) {
    const raio = THREE.MathUtils.lerp(RB, RA, t) * 1.004;
    const pesponto = new THREE.Mesh(new THREE.TorusGeometry(raio, r * 0.008, 4, 36), toon(P.chapeuPraiaPesponto));
    pesponto.rotation.x = Math.PI / 2;
    pesponto.position.y = BORDA + r * 0.01 - HA * t + r * 0.004;
    chapeu.add(pesponto);
  }
  const borda = new THREE.Mesh(new THREE.TorusGeometry(RA, r * 0.02, 6, 36), matListra);
  borda.rotation.x = Math.PI / 2;
  borda.position.y = BORDA + r * 0.01 - HA;
  chapeu.add(borda);
  return g;
}

/**
 * TOUCA DE NATAÇÃO FLORIDA — a de borracha, das antigas, com as flores em
 * relevo. Ela ACHATA o cabelo (`cobreCabelo` na ficha): touca de verdade
 * prende o cabelo todo, e envolvendo a juba do Ari por fora ela viraria um
 * capacete.
 *
 * É uma calota de esfera um fio maior que o crânio, INCLINADA para trás: na
 * frente a borda fica na testa, acima da sobrancelha, e atrás desce até a
 * nuca — a forma de uma touca de verdade.
 */
function toucaDeNatacao(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const borracha = peca?.cor ?? P.toucaNatacao;
  const R = r * 1.07;
  const ABRE = Math.PI * 0.56;
  const touca = new THREE.Group();
  touca.rotation.x = -0.46;
  touca.position.y = r * 0.03;
  g.add(touca);

  touca.add(new THREE.Mesh(new THREE.SphereGeometry(R, 26, 16, 0, Math.PI * 2, 0, ABRE), toon(borracha, { doubleSide: true })));
  // o friso da borda
  const friso = new THREE.Mesh(new THREE.TorusGeometry(R * Math.sin(ABRE), r * 0.035, 6, 36), toon(escuro(borracha, 0.9)));
  friso.rotation.x = Math.PI / 2;
  friso.position.y = R * Math.cos(ABRE);
  touca.add(friso);

  // as flores de borracha: em relevo, espalhadas pela calota
  const flores: Array<[number, number, number]> = [
    // [ângulo a partir do alto, giro em volta, cor]
    [0.25, 0.4, P.toucaFlorRosa], [0.55, -0.9, P.toucaFlorAmarela], [0.6, 0.95, P.toucaFlorLilas],
    [0.95, 0.15, P.toucaFlorRosa], [1.05, -1.9, P.toucaFlorLilas], [1.0, 2.0, P.toucaFlorAmarela],
    [0.75, 3.1, P.toucaFlorRosa], [1.25, -0.55, P.toucaFlorAmarela], [1.25, 0.75, P.toucaFlorLilas],
  ];
  for (const [theta, phi, cor] of flores) {
    const n = new THREE.Vector3(Math.sin(theta) * Math.sin(phi), Math.cos(theta), Math.sin(theta) * Math.cos(phi));
    const flor = florzinha(r * 0.2, cor, cor === P.toucaFlorAmarela ? P.toucaFlorRosa : P.toucaFlorAmarela, 6);
    colar(flor, touca, n.x * R * 1.005, n.y * R * 1.005, n.z * R * 1.005, n.x, n.y, n.z);
  }
  return g;
}

/**
 * TIARA DE CONCHINHAS — a faixa cor de areia por cima do cabelo (a mesma
 * tiara das orelhinhas do Walter, que segue o contorno medido do cabelo), com
 * a estrela-do-mar, a concha-leque e as pérolas.
 */
function tiaraDeConchinhas(m: MedidasCorpo): THREE.Object3D {
  const r = m.headR;
  const { g, naFaixa } = tiara(m, P.tiaraAreia);
  // o enfeite olha para FORA da faixa e para a frente: deitado no cabelo ele
  // apareceria de lado, e é de frente que se vê uma tiara
  const pregar = (obj: THREE.Object3D, a: number, afasta = 0.04) => {
    const p = naFaixa(a);
    const radial = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
    const olha = radial.clone().multiplyScalar(0.55).add(new THREE.Vector3(0, 0, 0.85)).normalize();
    const onde = p.clone().add(radial.multiplyScalar(r * afasta));
    colar(obj, g, onde.x, onde.y, onde.z + r * 0.04, olha.x, olha.y, olha.z);
  };

  // a estrela-do-mar: cinco braços gordinhos com os pontinhos claros
  const estrela = new THREE.Group();
  const laranja = toon(P.estrelaDoMar);
  const pontinho = toon(P.estrelaDoMarPonto);
  const L = r * 0.2;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const braco = new THREE.Mesh(new THREE.SphereGeometry(L * 0.5, 8, 6), laranja);
    braco.scale.set(0.42, 1, 0.34);
    braco.position.set(Math.sin(a) * L * 0.5, Math.cos(a) * L * 0.5, 0);
    braco.rotation.z = -a;
    estrela.add(braco);
    for (const k of [0.35, 0.65]) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(L * 0.06, 5, 4), pontinho);
      d.position.set(Math.sin(a) * L * k, Math.cos(a) * L * k, L * 0.15);
      estrela.add(d);
    }
  }
  const meio = new THREE.Mesh(new THREE.SphereGeometry(L * 0.22, 8, 6), laranja);
  meio.scale.z = 0.5;
  estrela.add(meio);
  pregar(estrela, -0.5, 0.05);

  // a concha-leque: sete gomos abrindo de um bico, rosa e creme alternados, e
  // as orelhinhas da dobradiça embaixo
  const concha = new THREE.Group();
  const C = r * 0.2;
  for (let i = 0; i < 7; i++) {
    const a = -1.05 + (i / 6) * 2.1;
    const gomo = new THREE.Mesh(new THREE.SphereGeometry(C * 0.5, 8, 6), toon(i % 2 ? P.conchaCreme : P.conchaRosa));
    gomo.scale.set(0.3, 1, 0.3);
    gomo.position.set(Math.sin(a) * C * 0.45, Math.cos(a) * C * 0.45 - C * 0.1, (i % 2) * C * 0.03);
    gomo.rotation.z = -a;
    concha.add(gomo);
  }
  const dobradica = new THREE.Mesh(new THREE.BoxGeometry(C * 0.5, C * 0.14, C * 0.12), toon(P.conchaRosa));
  dobradica.position.y = -C * 0.12;
  concha.add(dobradica);
  pregar(concha, 0.45, 0.05);

  // as pérolas: bolinhas brancas entre os enfeites
  for (const a of [-1.05, -0.12, 0.12, 0.88, 1.18]) {
    const perola = new THREE.Mesh(new THREE.SphereGeometry(r * 0.05, 8, 6), toon(P.perola, { glow: 0.15 }));
    const p = naFaixa(a);
    perola.position.set(p.x, p.y, p.z + r * 0.02);
    g.add(perola);
  }
  return g;
}

// ============================================================ AS MÃOS

/**
 * BOIA DE BRAÇO DE PATINHO — as braçadeiras de criança, em dois gomos
 * laranja com a costura clara no meio, a valvulazinha branca e a cabeça de
 * patinho olhando para a frente.
 *
 * Vaga `maos`, no PIVÔ de cada braço (y = 0 no ombro), em volta do braço de
 * cima. Tem `praia`: no clube ela continua no braço, que é onde ela serve.
 */
function boiaDePatinho(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const tubo = h * 0.017;
  const R = h * 0.038 * w + tubo * 0.9;
  const y1 = -m.armLen * 0.2;
  const y2 = y1 - tubo * 1.85;
  const yMeio = (y1 + y2) / 2;
  const laranja = toon(peca?.cor ?? P.boiaLaranja);
  for (const y of [y1, y2]) {
    const gomo = new THREE.Mesh(new THREE.TorusGeometry(R, tubo, 10, 22), laranja);
    gomo.rotation.x = Math.PI / 2;
    gomo.position.y = y;
    g.add(gomo);
  }
  const costura = new THREE.Mesh(
    new THREE.TorusGeometry(R + tubo * 0.36, h * 0.0032, 5, 26),
    toon(peca?.corDetalhe ?? P.boiaCostura),
  );
  costura.rotation.x = Math.PI / 2;
  costura.position.y = yMeio;
  g.add(costura);

  // a válvula: um pininho branco no gomo de cima, na frente e para dentro
  const av = -lado * 0.5;
  const valvula = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0035, h * 0.0045, h * 0.008, 8), toon(P.boiaValvula));
  valvula.position.set(Math.sin(av) * (R + tubo * 0.7), y1 + tubo * 0.55, Math.cos(av) * (R + tubo * 0.7));
  valvula.rotation.x = 0.6;
  g.add(valvula);

  // O PATINHO, na frente e para FORA (o `lado` leva para o lado de fora de
  // cada braço): a cabeça amarela, o bico laranja e os dois olhinhos
  const ad = lado * 0.75;
  const onde = new THREE.Vector3(Math.sin(ad) * (R + tubo * 0.95), yMeio, Math.cos(ad) * (R + tubo * 0.95));
  const patinho = new THREE.Group();
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0125, 10, 8), toon(P.patinhoAmarelo));
  patinho.add(cabeca);
  const bico = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0065, 8, 6), toon(P.patinhoBico));
  bico.scale.set(1.3, 0.5, 1.0);
  bico.position.set(0, -h * 0.002, h * 0.011);
  patinho.add(bico);
  for (const o of [-1, 1] as const) {
    const olho = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0022, 6, 5), toon(P.melanciaSemente));
    olho.position.set(o * h * 0.0055, h * 0.004, h * 0.0105);
    patinho.add(olho);
  }
  // o topete: três penugens amarelas no alto da cabeça
  for (const t of [-0.4, 0, 0.4]) {
    const pena = new THREE.Mesh(new THREE.ConeGeometry(h * 0.0022, h * 0.007, 4), toon(P.patinhoAmarelo));
    pena.position.set(Math.sin(t) * h * 0.003, h * 0.0135, 0);
    pena.rotation.z = -t;
    patinho.add(pena);
  }
  colar(patinho, g, onde.x, onde.y, onde.z, Math.sin(ad), 0, Math.cos(ad));
  return g;
}

// ============================================================ O TRONCO

/**
 * COLAR HAVAIANO — o de flores: uma volta de flores coloridas em volta do
 * pescoço, alta atrás e caindo em U no peito, com folhinhas entre elas.
 *
 * Vaga `acessorio` preso no CORPO (pedido do Renan: acessório, e não
 * tronco) — y = 0 no chão, o mesmo referencial do tronco. Assim ele vai junto
 * com qualquer camiseta e não esconde a jaqueta nem a mochila da ficha, e no
 * clube fica no peito nu, que é onde colar de flor mora.
 *
 * O CAMINHO pousa na CÁPSULA do tronco do rig: atrás, na cúpula de cima (onde
 * o ombro vira pescoço); na frente, no meio do peito. A altura desce com
 * `u^1,6` (u = 1 na frente), então o colar fica quase reto nos ombros e só
 * cai de fato no peito — o jeito que um colar de verdade pendura.
 */
function colarHavaiano(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const c = corpo(m);
  const R = c.raioTorso;
  const centroDaCupula = c.quadril + m.torsoH * 0.77;
  const yAtras = centroDaCupula + R * 0.72;
  const yFrente = centroDaCupula - m.torsoH * 0.2;
  const flor = m.h * 0.021;
  const noCaminho = (theta: number) => {
    const u = (1 + Math.cos(theta)) / 2;
    const y = yAtras + (yFrente - yAtras) * Math.pow(u, 1.6);
    const acima = y - centroDaCupula;
    const raio = acima > 0 ? Math.sqrt(Math.max(0, R * R - acima * acima)) : R;
    // a normal: na cúpula ela aponta para cima e para fora; no cilindro, só para fora
    const n = new THREE.Vector3(Math.sin(theta) * raio, Math.max(0, acima), Math.cos(theta) * raio * c.ACHATA).normalize();
    const folga = flor * 0.55;
    return {
      p: new THREE.Vector3(
        Math.sin(theta) * raio + n.x * folga,
        y + n.y * folga,
        Math.cos(theta) * raio * c.ACHATA + n.z * folga,
      ),
      n,
    };
  };
  const cores = [P.colarRosa, P.colarAmarelo, P.colarBranco, P.colarLaranja, P.colarLilas];
  const N = 22;
  for (let i = 0; i < N; i++) {
    const theta = (i / N) * Math.PI * 2;
    const { p, n } = noCaminho(theta);
    const cor = cores[i % cores.length];
    const f = florzinha(flor, cor, cor === P.colarAmarelo ? P.colarLaranja : P.colarAmarelo, 5);
    colar(f, g, p.x, p.y, p.z, n.x, n.y, n.z);
    f.rotateZ(i * 0.9);
    // a folhinha entre esta flor e a próxima, deitada no sentido do colar
    const meio = noCaminho(theta + Math.PI / N);
    const folha = folhinha(flor * 1.25, P.colarFolha, P.colarFolha);
    colar(folha, g, meio.p.x, meio.p.y, meio.p.z, meio.n.x, meio.n.y, meio.n.z);
    folha.rotateZ(Math.PI / 2 + (i % 2 ? 0.35 : -0.35));
  }
  return g;
}

/**
 * CAMISA HAVAIANA — azul-fundo com hibisco branco e amarelo e folhagem, a
 * gola de acampamento aberta em V, a carreira de botões e a manga curta com
 * barra. A cor do pano é a da ficha (`cor` pinta o tronco do rig); aqui entram
 * a gola, os botões e a estampa.
 */
function camisaHavaiana(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const c = corpo(m);
  const h = m.h;
  const R = c.raioTorso;
  const pano = peca?.cor ?? P.camisaHavaiana;
  const topo = c.quadril + m.torsoH * 0.77;

  // a gola: duas lapelas deitadas no peito em V, com a borda escura por baixo
  const matGola = toon(pano, { doubleSide: true });
  for (const lado of [-1, 1] as const) {
    const lapela = new THREE.Mesh(new THREE.BoxGeometry(R * 0.36, m.torsoH * 0.3, h * 0.006), matGola);
    lapela.position.set(lado * R * 0.2, topo - m.torsoH * 0.04, R * c.ACHATA * 1.04);
    // o alto da lapela vai para FORA (o pescoço) e a ponta para o meio (o V):
    // no lado de -X isso é girar para +Z — a pegadinha do sinal, de novo
    lapela.rotation.set(-0.42, lado * 0.32, -lado * 0.42);
    g.add(lapela);
    const avesso = new THREE.Mesh(new THREE.BoxGeometry(R * 0.36, m.torsoH * 0.3, h * 0.003), toon(escuro(pano, 0.72)));
    avesso.position.copy(lapela.position);
    avesso.rotation.copy(lapela.rotation);
    avesso.translateZ(-h * 0.004);
    g.add(avesso);
  }
  // a gola atrás do pescoço: meio anel deitado
  // (na altura `topo + 0,8·R` a cúpula do tronco tem raio 0,6·R: a gola passa
  // um fio por fora dela)
  const nuca = new THREE.Mesh(new THREE.TorusGeometry(R * 0.64, h * 0.009, 6, 16, Math.PI), matGola);
  nuca.rotation.x = Math.PI / 2;
  nuca.rotation.z = Math.PI;
  nuca.position.y = topo + R * 0.8;
  nuca.scale.y = c.ACHATA;
  g.add(nuca);

  // a carreira de botões, do V da gola até a barra
  const botao = toon(P.camisaHavaianaBotao);
  for (let i = 0; i < 4; i++) {
    const y = topo - m.torsoH * 0.26 - i * m.torsoH * 0.13;
    const p = noTronco(m, 0, y, 1.02);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0055, h * 0.0055, h * 0.003, 10), botao);
    b.rotation.x = Math.PI / 2;
    b.position.set(p.x, p.y, p.z);
    g.add(b);
  }
  // a vista: a faixa da abotoadura, um tom mais escura, de cima a baixo
  const vista = new THREE.Mesh(new THREE.BoxGeometry(h * 0.012, m.torsoH * 0.52, h * 0.002), toon(escuro(pano, 0.85)));
  const pv = noTronco(m, 0, topo - m.torsoH * 0.46, 1.005);
  vista.position.set(pv.x, pv.y, pv.z);
  g.add(vista);

  // A ESTAMPA: hibiscos brancos e amarelos com folhagem, em volta do tronco
  // (frente, lados e costas), fugindo da carreira de botões
  const flores: Array<[number, number, number]> = [
    [0.62, 0.5, P.camisaHavaianaFlor], [-0.7, 0.36, P.camisaHavaianaFlor2], [-0.55, 0.62, P.camisaHavaianaFlor],
    [0.75, 0.24, P.camisaHavaianaFlor2], [1.5, 0.45, P.camisaHavaianaFlor], [-1.5, 0.55, P.camisaHavaianaFlor2],
    [2.5, 0.35, P.camisaHavaianaFlor], [-2.4, 0.3, P.camisaHavaianaFlor2], [Math.PI, 0.55, P.camisaHavaianaFlor],
    [2.2, 0.62, P.camisaHavaianaFlor2],
  ];
  flores.forEach(([a, t, cor], i) => {
    const p = noTronco(m, a, c.quadril + m.torsoH * t, 1.05);
    const f = hibisco(h * 0.026, cor, cor === P.camisaHavaianaFlor ? P.hibiscoMiolo : P.hibiscoVermelho);
    colar(f, g, p.x, p.y, p.z, p.nx, 0, p.nz);
    f.rotateZ(i * 1.3);
  });
  const folhas: Array<[number, number]> = [[0.35, 0.3], [-0.35, 0.48], [1.1, 0.6], [-1.15, 0.2], [1.9, 0.25], [-2.0, 0.58], [2.85, 0.6], [-2.85, 0.45]];
  folhas.forEach(([a, t], i) => {
    const p = noTronco(m, a, c.quadril + m.torsoH * t, 1.04);
    const f = folhinha(h * 0.036, P.folhaHavaiana, P.colarFolha);
    colar(f, g, p.x, p.y, p.z, p.nx, 0, p.nz);
    f.rotateZ(0.5 + i * 1.1);
  });
  return g;
}

/**
 * A MANGA DA CAMISA HAVAIANA: a barra larga na ponta da manga curta do rig e
 * uma flor do lado de FORA (o `lado` leva para fora em cada braço).
 */
function mangaHavaiana(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const c = corpo(m);
  const pano = peca?.cor ?? P.camisaHavaiana;
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(c.raioManga * 1.12, c.raioManga * 1.16, m.h * 0.014, 14, 1, true),
    toon(escuro(pano, 0.8), { doubleSide: true }),
  );
  barra.position.y = -m.armLen * 0.4;
  g.add(barra);
  const flor = hibisco(m.h * 0.02, P.camisaHavaianaFlor);
  colar(flor, g, lado * c.raioManga * 1.1, -m.armLen * 0.26, 0, lado, 0, 0.2);
  return g;
}

/**
 * REGATA LISTRADA — a de marinheiro: creme com listras azul-marinho e a
 * âncora vermelha no peito. `bracosNus` na ficha (a manga do rig vira pele);
 * o pano é a `cor` da ficha, e aqui entram as listras e a âncora.
 */
function regataListrada(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const c = corpo(m);
  const listra = peca?.corDetalhe ?? P.regataListra;
  for (const t of [0.3, 0.42, 0.54]) {
    const faixa = new THREE.Mesh(
      new THREE.CylinderGeometry(c.raioTorso * 1.015, c.raioTorso * 1.015, m.h * 0.017, 26, 1, true),
      toon(listra, { doubleSide: true }),
    );
    faixa.position.y = c.quadril + m.torsoH * t;
    faixa.scale.z = c.ACHATA;
    g.add(faixa);
  }
  // a cava e o decote: o friso marinho em volta do alto da regata
  const friso = new THREE.Mesh(
    new THREE.TorusGeometry(c.raioTorso * 0.62, m.h * 0.005, 5, 22),
    toon(listra),
  );
  friso.rotation.x = Math.PI / 2;
  friso.position.y = c.quadril + m.torsoH * 0.77 + c.raioTorso * 0.78;
  friso.scale.y = c.ACHATA;
  g.add(friso);
  const p = noTronco(m, -0.42, c.quadril + m.torsoH * 0.68, 1.03);
  colar(ancora(m.h * 0.045, P.ancoraVermelha), g, p.x, p.y, p.z, p.nx, 0, p.nz);
  return g;
}

// ====================================================== AS VERSÕES SOLTAS

/*
 * AS CAMISETAS SOLTAS (pedido do Renan: "camisetas com o modelo largo, não
 * coladas no modelo"). A justa continua existindo — com "justa" no nome — e a
 * solta é o casco da camiseta larga da Josefina (`camisetaLarga`, em
 * `roupasDoJardim.ts`), com as MESMAS cotas e pelo mesmo motivo: raio de
 * `1,1·raioTorso` (mais gordo, o casco engole o braço colado no corpo),
 * abrindo para `1,2·` numa barra abaixo do quadril, achatado em 0,92. A folga
 * que se vê vem da barra comprida e aberta e da manga larga.
 */

/** as cotas do casco solto, no corpo (y = 0 no chão) */
function soltura(m: MedidasCorpo) {
  const c = corpo(m);
  const ombroY = c.quadril + m.torsoH * 0.86;
  return {
    RAIO: c.raioTorso * 1.1,
    RAIO_BARRA: c.raioTorso * 1.2,
    ACHATA: 0.92,
    BARRA: c.quadril - m.h * 0.035,
    TOPO: ombroY + m.torsoH * 0.02,
  };
}

/** um ponto no casco solto: `a` = 0 na frente, `t` = 0 na barra e 1 no ombro */
function noCasco(m: MedidasCorpo, a: number, t: number, folga = 1.02): NaSuperficie {
  const s = soltura(m);
  const raio = THREE.MathUtils.lerp(s.RAIO_BARRA, s.RAIO, t) * folga;
  return {
    x: Math.sin(a) * raio,
    y: THREE.MathUtils.lerp(s.BARRA, s.TOPO, t),
    z: Math.cos(a) * raio * s.ACHATA,
    nx: Math.sin(a),
    nz: Math.cos(a),
  };
}

/** uma faixa em volta do casco solto, de `t0` a `t1` */
function anelNoCasco(m: MedidasCorpo, t0: number, t1: number, cor: number, folga = 1.012): THREE.Mesh {
  const s = soltura(m);
  const r0 = THREE.MathUtils.lerp(s.RAIO_BARRA, s.RAIO, t0) * folga;
  const r1 = THREE.MathUtils.lerp(s.RAIO_BARRA, s.RAIO, t1) * folga;
  const y0 = THREE.MathUtils.lerp(s.BARRA, s.TOPO, t0);
  const y1 = THREE.MathUtils.lerp(s.BARRA, s.TOPO, t1);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 26, 1, true), toon(cor, { doubleSide: true }));
  anel.position.y = (y0 + y1) / 2;
  anel.scale.z = s.ACHATA;
  return anel;
}

/**
 * O CASCO SOLTO: o cilindro FECHADO em volta do tronco (fechado para a câmera
 * baixa não ver o torso lá dentro), o ombro caído e a barra. `ombroLargo`
 * falso estreita o ombro — é a regata, que deixa o alto do braço de fora.
 */
function cascoSolto(m: MedidasCorpo, pano: number, barra: number, ombroLargo = true): THREE.Group {
  const g = new THREE.Group();
  const s = soltura(m);
  const mat = toon(pano);
  const casco = new THREE.Mesh(new THREE.CylinderGeometry(s.RAIO, s.RAIO_BARRA, s.TOPO - s.BARRA, 26), mat);
  casco.position.y = (s.TOPO + s.BARRA) / 2;
  casco.scale.z = s.ACHATA;
  g.add(casco);
  const ombro = new THREE.Mesh(new THREE.SphereGeometry(s.RAIO, 26, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  ombro.position.y = s.TOPO;
  ombro.scale.set(ombroLargo ? 1 : 0.8, 0.36, s.ACHATA);
  g.add(ombro);
  // a barra: faixa dobrada, um degrau mais larga
  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(s.RAIO_BARRA * 1.02, s.RAIO_BARRA * 1.03, m.h * 0.022, 26, 1, true),
    toon(barra, { doubleSide: true }),
  );
  dobra.position.y = s.BARRA + m.h * 0.011;
  dobra.scale.z = s.ACHATA;
  g.add(dobra);
  // as costuras de lado, descendo do ombro à barra: o caimento
  for (const lado of [-1, 1] as const) {
    const costura = new THREE.Mesh(new THREE.BoxGeometry(m.h * 0.004, s.TOPO - s.BARRA, m.h * 0.004), toon(escuro(pano, 0.85)));
    costura.position.set(lado * (s.RAIO + s.RAIO_BARRA) * 0.5 * 1.005, (s.TOPO + s.BARRA) / 2, 0);
    costura.rotation.z = lado * Math.atan2(s.RAIO_BARRA - s.RAIO, s.TOPO - s.BARRA);
    g.add(costura);
  }
  return g;
}

/**
 * CAMISA HAVAIANA SOLTA — a mesma camisa (azul-fundo, hibisco branco e
 * amarelo, folhagem), no casco solto: gola de acampamento aberta em V, a
 * carreira de botões com a vista, a barra reta caindo abaixo do quadril e a
 * estampa espalhada em volta, fugindo dos botões.
 */
function camisaHavaianaSolta(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const pano = peca?.cor ?? P.camisaHavaiana;
  const g = cascoSolto(m, pano, escuro(pano, 0.8));
  const s = soltura(m);
  const h = m.h;
  const frente = s.RAIO * s.ACHATA;

  // a gola: duas lapelas deitadas no peito em V, com o avesso escuro
  const matGola = toon(pano, { doubleSide: true });
  for (const lado of [-1, 1] as const) {
    const lapela = new THREE.Mesh(new THREE.BoxGeometry(s.RAIO * 0.36, m.torsoH * 0.3, h * 0.006), matGola);
    lapela.position.set(lado * s.RAIO * 0.2, s.TOPO - m.torsoH * 0.1, frente * 1.04);
    lapela.rotation.set(-0.3, lado * 0.3, -lado * 0.42);
    g.add(lapela);
    const avesso = new THREE.Mesh(new THREE.BoxGeometry(s.RAIO * 0.36, m.torsoH * 0.3, h * 0.003), toon(escuro(pano, 0.7)));
    avesso.position.copy(lapela.position);
    avesso.rotation.copy(lapela.rotation);
    avesso.translateZ(-h * 0.004);
    g.add(avesso);
  }
  // a vista e os botões, do V da gola até a barra
  const vista = new THREE.Mesh(new THREE.BoxGeometry(h * 0.013, s.TOPO - s.BARRA - m.torsoH * 0.28, h * 0.002), toon(escuro(pano, 0.85)));
  const alturaVista = (s.TOPO - m.torsoH * 0.28 + s.BARRA) / 2;
  vista.position.set(0, alturaVista, THREE.MathUtils.lerp(s.RAIO_BARRA, s.RAIO, 0.5) * s.ACHATA * 1.02);
  vista.rotation.x = -Math.atan2(s.RAIO_BARRA - s.RAIO, s.TOPO - s.BARRA) * s.ACHATA;
  g.add(vista);
  const botao = toon(P.camisaHavaianaBotao);
  for (let i = 0; i < 5; i++) {
    const t = 0.72 - i * 0.16;
    const p = noCasco(m, 0, t, 1.03);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0058, h * 0.0058, h * 0.003, 10), botao);
    b.rotation.x = Math.PI / 2;
    b.position.set(p.x, p.y, p.z);
    g.add(b);
  }

  // a estampa: hibiscos brancos e amarelos com folhagem, em volta do casco
  const flores: Array<[number, number, number]> = [
    [0.62, 0.62, P.camisaHavaianaFlor], [-0.68, 0.45, P.camisaHavaianaFlor2], [-0.55, 0.78, P.camisaHavaianaFlor],
    [0.72, 0.28, P.camisaHavaianaFlor2], [-0.4, 0.15, P.camisaHavaianaFlor], [1.5, 0.5, P.camisaHavaianaFlor],
    [-1.5, 0.62, P.camisaHavaianaFlor2], [1.45, 0.15, P.camisaHavaianaFlor2], [2.5, 0.4, P.camisaHavaianaFlor],
    [-2.4, 0.3, P.camisaHavaianaFlor2], [Math.PI, 0.62, P.camisaHavaianaFlor], [2.2, 0.75, P.camisaHavaianaFlor2],
    [-2.9, 0.12, P.camisaHavaianaFlor],
  ];
  flores.forEach(([a, t, cor], i) => {
    const p = noCasco(m, a, t, 1.03);
    const f = hibisco(h * 0.028, cor, cor === P.camisaHavaianaFlor ? P.hibiscoMiolo : P.hibiscoVermelho);
    colar(f, g, p.x, p.y, p.z, p.nx, 0, p.nz);
    f.rotateZ(i * 1.3);
  });
  const folhas: Array<[number, number]> = [
    [0.35, 0.42], [-0.3, 0.6], [1.1, 0.7], [-1.15, 0.28], [1.9, 0.3], [-2.0, 0.7], [2.85, 0.75], [-2.8, 0.5], [0.95, 0.05],
  ];
  folhas.forEach(([a, t], i) => {
    const p = noCasco(m, a, t, 1.025);
    const f = folhinha(h * 0.038, P.folhaHavaiana, P.colarFolha);
    colar(f, g, p.x, p.y, p.z, p.nx, 0, p.nz);
    f.rotateZ(0.5 + i * 1.1);
  });
  return g;
}

/**
 * A MANGA DA CAMISA HAVAIANA SOLTA: tubo folgado e curto (camisa de botão
 * não vai até o cotovelo), a barra dobrada e um hibisco do lado de FORA.
 */
function mangaHavaianaSolta(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const ATE = 0.4;
  const pano = peca?.cor ?? P.camisaHavaiana;
  const ombro = new THREE.Mesh(new THREE.SphereGeometry(h * 0.06 * w, 12, 10), toon(pano));
  ombro.position.y = -m.armLen * 0.04;
  ombro.scale.set(1, 0.9, 0.95);
  g.add(ombro);
  const tubo = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.058 * w, h * 0.068 * w, m.armLen * ATE, 16, 1, true),
    toon(pano, { doubleSide: true }),
  );
  tubo.position.y = -m.armLen * ATE * 0.5;
  g.add(tubo);
  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(h * 0.07 * w, h * 0.072 * w, h * 0.02, 16, 1, true),
    toon(escuro(pano, 0.8), { doubleSide: true }),
  );
  dobra.position.y = -m.armLen * ATE + h * 0.01;
  g.add(dobra);
  const flor = hibisco(h * 0.022, P.camisaHavaianaFlor);
  colar(flor, g, lado * h * 0.066 * w, -m.armLen * 0.22, 0, lado, 0, 0.25);
  return g;
}

/**
 * REGATA LISTRADA SOLTA — a de marinheiro no casco solto: creme com as
 * listras marinho dando a volta, o ombro estreito (a cava deixa o alto do
 * braço de fora), o friso marinho na cava e no decote, e a âncora no peito.
 * `bracosNus` na ficha, como a justa.
 */
function regataListradaSolta(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const pano = peca?.cor ?? P.regataCreme;
  const listra = peca?.corDetalhe ?? P.regataListra;
  const g = cascoSolto(m, pano, listra, false);
  const s = soltura(m);
  for (const [t0, t1] of [[0.2, 0.29], [0.4, 0.49], [0.6, 0.69]] as const) g.add(anelNoCasco(m, t0, t1, listra));
  // o friso do decote, em volta do alto do ombro
  const decote = new THREE.Mesh(new THREE.TorusGeometry(s.RAIO * 0.5, m.h * 0.005, 5, 22), toon(listra));
  decote.rotation.x = Math.PI / 2;
  decote.position.y = s.TOPO + s.RAIO * 0.36 * 0.85;
  decote.scale.y = s.ACHATA;
  g.add(decote);
  const p = noCasco(m, -0.42, 0.82, 1.03);
  colar(ancora(m.h * 0.05, P.ancoraVermelha), g, p.x, p.y, p.z, p.nx, 0, p.nz);
  return g;
}

export {
  bermudaListrada, bermudaDeBolinhas, bermudaHavaiana, bermudaDeAbacaxi, bermudaDeMelancia, bermudaDeOndinhas,
  oculosRedondo, oculosGatinho, oculosDeCoracao, oculosEspelhado, oculosDeNatacao,
  chineloAzul, chineloFlorido, chineloDeMelancia, chineloSlide,
  chapeuDePraia, toucaDeNatacao, tiaraDeConchinhas,
  boiaDePatinho, colarHavaiano, camisaHavaiana, mangaHavaiana, regataListrada,
  camisaHavaianaSolta, mangaHavaianaSolta, regataListradaSolta,
};
