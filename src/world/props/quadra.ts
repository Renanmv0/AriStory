import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Quadra de frisbee: cesta de disc golf, placar, arquibancada, bebedouro,
 * sacola de discos, refletor, biruta, cone.
 */

/**
 * Cesta de disc golf: poste, aro e as correntes penduradas.
 * É o marco visual que diz "aqui é lugar de jogar frisbee".
 */
export function discGolfBasket(cor: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 10), toon(cor));
  poste.position.y = 0.75;
  g.add(poste);

  const cesta = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.38, 0.42, 14, 1, true), toon(cor));
  cesta.position.y = 1.0;
  g.add(cesta);

  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 6, 20), toon(cor));
  aro.position.y = 1.72;
  aro.rotation.x = Math.PI / 2;
  g.add(aro);

  const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8), toon(cor));
  topo.position.y = 1.9;
  g.add(topo);

  // correntes: linhas verticais do aro até a cesta
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const corrente = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 4), toon(0xc9d0d6));
    corrente.position.set(Math.cos(a) * 0.5, 1.4, Math.sin(a) * 0.5);
    g.add(corrente);
  }
  return g;
}

/** Placar de madeira da quadra. */
export function scoreboard(): THREE.Group {
  const g = new THREE.Group();
  for (const x of [-0.8, 0.8]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.5, 0.12), toon(P.woodDark));
    pe.position.set(x, 0.75, 0);
    g.add(pe);
  }
  const painel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.12), toon(P.wood));
  painel.position.y = 2.0;
  g.add(painel);
  const faixa = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.03), toon(P.frisbee));
  faixa.position.set(0, 2.45, 0.08);
  g.add(faixa);
  // "números" do placar: blocos escuros
  for (const x of [-0.45, 0.45]) {
    const numero = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.03), toon(0x2b2f38));
    numero.position.set(x, 1.9, 0.08);
    g.add(numero);
  }
  return g;
}

/** Arquibancada de três degraus. */
export function bleachers(largura = 4): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const degrau = new THREE.Mesh(
      new THREE.BoxGeometry(largura, 0.16, 0.5),
      toon(i % 2 === 0 ? P.metalWhite : P.metalGrey),
    );
    degrau.position.set(0, 0.25 + i * 0.34, -i * 0.5);
    g.add(degrau);
    const apoio = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.25 + i * 0.34, 0.1), toon(P.metalGrey));
    apoio.position.set(0, (0.25 + i * 0.34) / 2, -i * 0.5 - 0.2);
    g.add(apoio);
  }
  return g;
}

/** Bebedouro de parque. */
export function waterFountain(): THREE.Group {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.36), toon(P.concrete));
  corpo.position.y = 0.48;
  g.add(corpo);
  const cuba = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.12, 12), toon(P.metalWhite));
  cuba.position.set(0, 1.0, 0.05);
  g.add(cuba);
  const bica = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8), toon(P.metalGrey));
  bica.position.set(0, 1.12, -0.06);
  bica.rotation.x = 0.5;
  g.add(bica);
  return g;
}

/** Sacola com discos sobressalentes, largada na beira da quadra. */
export function discBag(): THREE.Group {
  const g = new THREE.Group();
  const bolsa = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.34), toon(0x4a5568));
  bolsa.position.y = 0.2;
  g.add(bolsa);
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.028, 6, 14, Math.PI), toon(0x2f3440));
  alca.position.set(0, 0.42, 0);
  alca.rotation.y = Math.PI / 2;
  g.add(alca);
  const cores = [P.frisbee, 0x5fb0d6, 0xffd85e];
  cores.forEach((c, i) => {
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.05, 16), toon(c));
    disco.position.set(0.34 + i * 0.02, 0.06 + i * 0.06, 0.22);
    disco.rotation.z = 0.12;
    g.add(disco);
  });
  return g;
}

/** Refletor alto de quadra. */
export function floodlight(): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8), toon(P.metalGrey));
  poste.position.y = 2.75;
  g.add(poste);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.1), toon(P.metalGrey));
  braco.position.set(0.35, 5.5, 0);
  g.add(braco);
  for (const x of [0.1, 0.6]) {
    const luminaria = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.22), toon(0x3b4250));
    luminaria.position.set(x, 5.62, 0);
    luminaria.rotation.z = -0.35;
    g.add(luminaria);
    const lente = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.03), toon(0xfff0cc, { glow: 0.25 }));
    lente.position.set(x + 0.04, 5.52, 0);
    lente.rotation.z = -0.35;
    g.add(lente);
  }
  return g;
}

/** Biruta: diz de que lado o vento está indo. Anime a rotação com w.onUpdate. */
export function windsock(): THREE.Group {
  const g = new THREE.Group();
  const mastro = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.0, 8), toon(P.metalGrey));
  mastro.position.y = 1.5;
  g.add(mastro);

  const manga = new THREE.Group();
  manga.position.y = 2.9;
  const faixas = [P.frisbee, 0xffffff, P.frisbee, 0xffffff];
  faixas.forEach((cor, i) => {
    const raioA = 0.26 - i * 0.04;
    const raioB = 0.22 - i * 0.04;
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(raioA, raioB, 0.3, 12, 1, true),
      toon(cor, { doubleSide: true }),
    );
    seg.rotation.z = Math.PI / 2;
    seg.position.x = 0.2 + i * 0.3;
    manga.add(seg);
  });
  g.add(manga);
  g.userData.manga = manga;
  return g;
}

/** Cone laranja: marca o campinho, a quadra, a obra. */
export function cone(): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.34), toon(P.frisbee));
  base.position.y = 0.025;
  g.add(base);
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 10), toon(P.frisbee));
  body.position.y = 0.26;
  g.add(body);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.09, 10), toon(0xffffff));
  stripe.position.y = 0.28;
  g.add(stripe);
  return g;
}
