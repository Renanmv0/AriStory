import type { Bounds, Collider } from '../core/types';

/**
 * Colisao 2D no plano XZ: o jogador e um circulo, o cenario sao circulos e caixas.
 * Empurra o circulo para fora de cada colisor, uma passada por frame.
 */
export function resolveCollisions(
  pos: { x: number; z: number },
  radius: number,
  colliders: readonly Collider[],
): void {
  for (const c of colliders) {
    if (c.kind === 'circle') {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const min = radius + c.r;
      const d2 = dx * dx + dz * dz;
      if (d2 >= min * min || d2 === 0) continue;
      const d = Math.sqrt(d2);
      const push = (min - d) / d;
      pos.x += dx * push;
      pos.z += dz * push;
    } else {
      // leva o jogador para o espaco local da caixa
      const cos = Math.cos(-c.rot);
      const sin = Math.sin(-c.rot);
      const rx = pos.x - c.x;
      const rz = pos.z - c.z;
      const lx = rx * cos - rz * sin;
      const lz = rx * sin + rz * cos;

      const cx = Math.max(-c.hw, Math.min(c.hw, lx));
      const cz = Math.max(-c.hd, Math.min(c.hd, lz));
      let dx = lx - cx;
      let dz = lz - cz;
      let d2 = dx * dx + dz * dz;

      if (d2 > radius * radius) continue;

      if (d2 === 0) {
        // centro do jogador dentro da caixa: sai pela face mais proxima
        const toX = c.hw - Math.abs(lx);
        const toZ = c.hd - Math.abs(lz);
        if (toX < toZ) {
          dx = Math.sign(lx) || 1;
          dz = 0;
          d2 = 0;
        } else {
          dx = 0;
          dz = Math.sign(lz) || 1;
        }
        const nlx = dx !== 0 ? Math.sign(dx) * (c.hw + radius) : lx;
        const nlz = dz !== 0 ? Math.sign(dz) * (c.hd + radius) : lz;
        pos.x = c.x + (nlx * Math.cos(c.rot) - nlz * Math.sin(c.rot));
        pos.z = c.z + (nlx * Math.sin(c.rot) + nlz * Math.cos(c.rot));
        continue;
      }

      const d = Math.sqrt(d2);
      const nlx = cx + (dx / d) * radius;
      const nlz = cz + (dz / d) * radius;
      pos.x = c.x + (nlx * Math.cos(c.rot) - nlz * Math.sin(c.rot));
      pos.z = c.z + (nlx * Math.sin(c.rot) + nlz * Math.cos(c.rot));
    }
  }
}

export function clampToBounds(pos: { x: number; z: number }, radius: number, b: Bounds): void {
  pos.x = Math.max(b.minX + radius, Math.min(b.maxX - radius, pos.x));
  pos.z = Math.max(b.minZ + radius, Math.min(b.maxZ - radius, pos.z));
}
