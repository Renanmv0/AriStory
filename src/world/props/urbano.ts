import * as THREE from 'three';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';

/**
 * Mobiliario urbano e construcao: banco, poste, lixeira, mesa de piquenique,
 * cerca, placa, placa com texto, quiosque, predio.
 */

export function bench(color: number = P.wood): THREE.Group {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.55), toon(color));
  seat.position.y = 0.48;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.09), toon(color));
  back.position.set(0, 0.76, -0.25);
  back.rotation.x = -0.16;
  g.add(back);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.48, 0.5), toon(P.metalGrey));
    leg.position.set(side * 0.78, 0.24, 0);
    g.add(leg);
  }
  return g;
}

export function lamp(lit = false): THREE.Group {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.4, 8), toon(P.metalGrey));
  pole.position.y = 1.7;
  g.add(pole);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
    toon(P.metalWhite),
  );
  head.position.y = 3.45;
  head.rotation.x = Math.PI;
  g.add(head);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 10, 8),
    toon(lit ? P.gold : 0xe8e8e0, { glow: lit ? 0.9 : 0 }),
  );
  bulb.position.y = 3.32;
  g.add(bulb);
  return g;
}

export function bin(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.75, 10), toon(0x4f7a4a));
  body.position.y = 0.38;
  g.add(body);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.04, 6, 14), toon(P.metalGrey));
  rim.position.y = 0.76;
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  return g;
}

export function picnicTable(): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 1.0), toon(P.wood));
  top.position.y = 0.76;
  g.add(top);
  for (const side of [-1, 1]) {
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.9), toon(P.woodDark));
    legs.position.set(side * 0.75, 0.38, 0);
    g.add(legs);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.34), toon(P.wood));
    seat.position.set(0, 0.45, side * 0.78);
    g.add(seat);
    const seatLeg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.08), toon(P.woodDark));
    seatLeg.position.set(0, 0.22, side * 0.78);
    g.add(seatLeg);
  }
  return g;
}

export function fence(length = 4, height = 1.1, color: number = P.metalGrey): THREE.Group {
  const g = new THREE.Group();
  const posts = Math.max(2, Math.round(length / 1.2));
  for (let i = 0; i <= posts; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, height, 6), toon(color));
    post.position.set(-length / 2 + (i / posts) * length, height / 2, 0);
    g.add(post);
  }
  for (const y of [height * 0.35, height * 0.8]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.06), toon(color));
    rail.position.y = y;
    g.add(rail);
  }
  return g;
}

export function signBoard(color: number = P.wood, accent: number = P.metalWhite): THREE.Group {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), toon(P.woodDark));
  post.position.y = 0.8;
  g.add(post);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.08), toon(color));
  board.position.y = 1.5;
  g.add(board);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.02), toon(accent));
  stripe.position.set(0, 1.62, 0.05);
  g.add(stripe);
  return g;
}

/**
 * Placa com texto de verdade. A textura é desenhada num canvas em tempo de
 * execução — continua sendo tudo procedural, nenhum arquivo de imagem entra
 * no repositório.
 */
export function textSign(texto: string, corPlaca: number = P.fabricBlue, corTexto = '#ffffff'): THREE.Group {
  const g = new THREE.Group();
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), toon(P.metalGrey));
  poste.position.y = 1.2;
  g.add(poste);

  const largura = 2.1;
  const altura = 0.9;
  const placa = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.1), toon(corPlaca));
  placa.position.y = 2.45;
  g.add(placa);

  const moldura = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.12, altura + 0.12, 0.06), toon(P.metalWhite));
  moldura.position.set(0, 2.45, -0.03);
  g.add(moldura);

  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = corTexto;
    ctx.font = 'bold 96px ui-rounded, "Nunito", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2 + 4);
  }
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const letreiro = new THREE.Mesh(
    new THREE.PlaneGeometry(largura * 0.86, altura * 0.68),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true }),
  );
  letreiro.position.set(0, 2.45, 0.06);
  g.add(letreiro);
  return g;
}

export function kiosk(color: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 1.6), toon(P.wallCream));
  body.position.y = 0.85;
  g.add(body);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.5), toon(P.wood));
  counter.position.set(0, 1.25, 0.95);
  g.add(counter);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.9, 14, 1, false, 0, Math.PI), toon(color));
  roof.position.set(0, 1.75, 0.35);
  roof.rotation.set(Math.PI / 2, 0, 0);
  roof.scale.set(1, 1, 0.55);
  g.add(roof);
  return g;
}

/** Predio simples de fundo, com janelinhas. */
export function building(
  width = 4,
  height = 6,
  depth = 4,
  wall: number = P.wallCream,
  roof: number = P.roofTile,
  windowColor: number = P.glass,
): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), toon(wall));
  body.position.y = height / 2;
  g.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.35, depth + 0.3), toon(roof));
  top.position.y = height + 0.17;
  g.add(top);

  const cols = Math.max(1, Math.floor(width / 1.4));
  const rows = Math.max(1, Math.floor(height / 1.6));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.06), toon(windowColor, { glow: 0.15 }));
      const x = -width / 2 + (width / cols) * (c + 0.5);
      const y = 0.9 + (height / rows) * r;
      win.position.set(x, y, depth / 2 + 0.02);
      g.add(win);
      const back = win.clone();
      back.position.z = -depth / 2 - 0.02;
      g.add(back);
    }
  }
  return g;
}
