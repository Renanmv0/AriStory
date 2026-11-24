import * as THREE from 'three';

// A primeira carteirinha do jogo aberto recebe a dica, mesmo se o dia começou com convidados.
let jaMostrou = false;

export function setaDaCarteirinha(mesa: THREE.Group, cartao: THREE.Object3D) {
  let seta: THREE.Sprite | undefined;
  let tempo = 0;
  const duracao = 1.75;
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)');

  function recolher() {
    if (!seta) return;
    seta.removeFromParent();
    seta.material.map?.dispose();
    seta.material.dispose();
    seta = undefined;
  }
  return {
    mostrar() {
      if (jaMostrou) return;
      jaMostrou = true;
      const tela = document.createElement('canvas');
      tela.width = tela.height = 96;
      const c = tela.getContext('2d')!;
      const esmalte = c.createLinearGradient(0, 8, 0, 83);
      esmalte.addColorStop(0, '#fff4bc');
      esmalte.addColorStop(.55, '#ffd16e');
      esmalte.addColorStop(1, '#efaa41');
      c.lineJoin = c.lineCap = 'round';
      c.beginPath();
      c.moveTo(36, 12); c.lineTo(60, 12); c.lineTo(60, 44);
      c.lineTo(77, 44); c.lineTo(48, 81); c.lineTo(19, 44); c.lineTo(36, 44); c.closePath();
      c.lineWidth = 12; c.strokeStyle = '#795630'; c.stroke();
      c.lineWidth = 6; c.strokeStyle = '#fff6d9'; c.stroke();
      c.fillStyle = esmalte; c.fill();
      c.beginPath(); c.moveTo(42, 21); c.lineTo(42, 39);
      c.lineWidth = 4; c.strokeStyle = '#fff8db'; c.stroke();
      const mapa = new THREE.CanvasTexture(tela);
      mapa.colorSpace = THREE.SRGBColorSpace;
      seta = new THREE.Sprite(new THREE.SpriteMaterial({map: mapa, transparent: true, depthWrite: false, toneMapped: false}));
      seta.name = 'dica-da-carteirinha';
      seta.scale.setScalar(.128);
      seta.center.set(.5, 0);
      seta.material.opacity = 0;
      mesa.add(seta);
      tempo = 0;
    },
    update(dt: number, visivel: boolean) {
      if (!seta) return;
      tempo += dt;
      if (!visivel || tempo >= duracao) { recolher(); return; }
      seta.position.set(-.087, .006, .025);
      cartao.localToWorld(seta.position);
      mesa.worldToLocal(seta.position);
      // O segundo salto é menor; ambos chegam com velocidade zero à borda do cartão.
      let salto = 0;
      if (!reduzir.matches) {
        const segundo = tempo >= .78;
        const t = THREE.MathUtils.clamp((tempo - (segundo ? .78 : .12)) / (segundo ? .5 : .66), 0, 1);
        salto = (segundo ? .21 : .38) * Math.sin(t * Math.PI) ** 2;
      }
      seta.center.y = -salto;
      seta.material.opacity = Math.min(THREE.MathUtils.smoothstep(tempo, 0, .16), 1 - THREE.MathUtils.smoothstep(tempo, 1.45, duracao));
    },
    recolher,
  };
}
