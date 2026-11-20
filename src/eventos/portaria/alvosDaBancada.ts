import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Clicavel } from '../../core/types';
import type { Carimbo, ItemDaSacola, TipoDeDocumento } from '../../minigames/portaria';
import type { MesaDaPortaria } from '../../world/mesaDaPortaria';
import type { SacolaDaPortaria } from '../../world/sacolaDaPortaria';
import { PALETTE as P } from '../../palette';

/** Alvos locais à cena: o jogador permanece sentado; os outros painéis mantêm a trava do motor. */
export function alvosDaBancada(w: WorldBuilder, mesa: MesaDaPortaria, sacola: SacolaDaPortaria, a: {
  livre(): boolean; chamar(): void; folha(tipo: TipoDeDocumento | 'manual' | 'lista' | 'hoje'): void;
  lupa(): void; carimbar(c: Carimbo): void; rosto(): void; item(i: ItemDaSacola): void;
  temVisitante(): boolean; podeChamar(): boolean; podeLupa(): boolean; podeSoClube(): boolean; podeLista(): boolean;
}) {
  const alvos: Array<{ alvo: Clicavel; pode: () => boolean }> = [];
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
  material.visible = false;
  const contorno = new THREE.LineBasicMaterial({ color: P.gold, transparent: true, opacity: .85, depthTest: false });
  const registrar = (obj: THREE.Object3D, nome: string, clicar: () => void, pode = () => true, ampliar = true): Clicavel => {
    obj.updateWorldMatrix(true, true);
    let borda: THREE.LineSegments | null = null;
    if (ampliar) {
      const caixa = new THREE.Box3().setFromObject(obj);
      const centro = obj.worldToLocal(caixa.getCenter(new THREE.Vector3()));
      const tam = caixa.getSize(new THREE.Vector3());
      const geo = new THREE.BoxGeometry(Math.max(.115, tam.x + .02), Math.max(.055, tam.y + .015), Math.max(.14, tam.z + .025));
      const area = new THREE.Mesh(geo, material); area.name = 'area-de-toque'; area.userData.semSombra = true; area.position.copy(centro); obj.add(area);
      borda = new THREE.LineSegments(new THREE.EdgesGeometry(geo), contorno); borda.position.copy(centro); borda.name = 'realce-de-toque'; borda.visible = false; borda.renderOrder = 9; obj.add(borda);
    }
    const alvo = w.clicavel(obj, { dica: nome, alturaDaDica: .12, duranteTrava: true,
      aoPassar: sim => { if (borda) borda.visible = sim && a.livre() && pode(); },
      aoClicar: () => { if (a.livre() && pode()) clicar(); },
    });
    alvos.push({ alvo, pode }); return alvo;
  };
  registrar(mesa.campainha, 'Chamar o próximo', a.chamar, () => !a.temVisitante() && a.podeChamar());
  registrar(mesa.manual, 'Consultar o manual', () => a.folha('manual'));
  registrar(mesa.prancheta, 'Consultar a lista', () => a.folha('lista'), a.podeLista);
  registrar(mesa.calendario, 'Consultar a data de hoje', () => a.folha('hoje'));
  registrar(mesa.lupa, 'Comparar duas pistas', a.lupa, () => a.temVisitante() && a.podeLupa());
  for (const tipo of ['carteirinha', 'convite', 'conviteColetivo', 'cracha', 'ordem', 'exame'] as const) {
    const obj = mesa.papelDe(tipo);
    registrar(obj, 'Ler documento', () => a.folha(tipo), () => mesa.naMesa.some(p => p.tipo === tipo));
  }
  for (const c of ['entra', 'soClube', 'hojeNao'] as const) registrar(mesa.carimbos[c], c === 'entra' ? 'Carimbar ENTRA' : c === 'soClube' ? 'Carimbar SÓ O CLUBE' : 'Carimbar HOJE NÃO', () => a.carimbar(c), () => a.temVisitante() && (c !== 'soClube' || a.podeSoClube()));
  const vistos = new WeakSet<THREE.Object3D>();
  let pessoa: Clicavel | null = null;
  w.onUpdate(() => {
    for (const { alvo, pode } of alvos) alvo.ligado = a.livre() && pode();
    for (const [item, obj] of sacola.itens) if (!vistos.has(obj)) { vistos.add(obj); registrar(obj, 'Examinar item da sacola', () => a.item(item), () => obj.visible && !obj.userData.confiscado); }
  });
  w.aoDesmontar(() => { material.dispose(); contorno.dispose(); });
  return {
    visitante(obj: THREE.Group | null): void {
      if (pessoa?.obj === obj) return;
      if (pessoa) pessoa.ligado = false;
      pessoa = obj ? registrar(obj, 'Observar o visitante · lupa: selecionar rosto', a.rosto, () => pessoa?.obj === obj && a.temVisitante(), false) : null;
    },
  };
}
