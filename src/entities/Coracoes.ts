import * as THREE from 'three';
import { heart } from '../world/props';

interface Coracaozinho {
  obj: THREE.Group;
  vida: number;
  giro: number;
  /** direcao em que ele se afasta, no plano do chao */
  fx: number;
  fz: number;
}

/** quanto tempo cada coracao fica no ar */
const VIDA = 1.7;

/**
 * Os coracaozinhos que sobem quando a dupla se gosta.
 *
 * Nasceram no beijo e hoje servem tambem para as maos dadas, entao moram aqui
 * em vez de dentro de uma mecanica so. Quem usa manda soltar e chamar o
 * `update`; o resto (subir, gingar, sumir encolhendo) e por conta da classe.
 */
export class Coracoes {
  private readonly grupo = new THREE.Group();
  private readonly vivos: Coracaozinho[] = [];

  constructor(cena: THREE.Scene) {
    cena.add(this.grupo);
  }

  /**
   * @param onde de onde ele sai (o y do vetor e ignorado; a altura e fixa)
   * @param fx direcao horizontal em que ele se afasta
   * @param fz idem
   * @param altura y de nascimento
   */
  soltar(onde: THREE.Vector3, fx: number, fz: number, altura = 1.62): void {
    const c = heart(0.6);
    // etiqueta para o teste conseguir contar quantos estao no ar
    c.userData.coracao = true;
    c.position.set(onde.x + fx, altura, onde.z + fz);
    this.grupo.add(c);
    this.vivos.push({ obj: c, vida: 0, giro: Math.random() * Math.PI, fx, fz });
  }

  /** Some com todos na hora (troca de cena, cutscene). */
  limpar(): void {
    for (const c of this.vivos) this.grupo.remove(c.obj);
    this.vivos.length = 0;
  }

  update(dt: number): void {
    for (let i = this.vivos.length - 1; i >= 0; i--) {
      const c = this.vivos[i];
      c.vida += dt;
      const p = c.vida / VIDA;
      if (p >= 1) {
        this.grupo.remove(c.obj);
        this.vivos.splice(i, 1);
        continue;
      }
      c.obj.position.y += dt * 0.72;
      // sobe afastando do par, com um gingado leve: assim nenhum coracao fica
      // preso atras da cabeca de ninguem
      const deriva = (0.7 + Math.sin(c.vida * 3 + c.giro) * 0.25) * dt;
      c.obj.position.x += c.fx * deriva;
      c.obj.position.z += c.fz * deriva;
      c.obj.rotation.y = c.giro + c.vida * 1.4;
      // aparece num pop e some encolhendo, sem mexer no material compartilhado
      const escala = p < 0.18 ? p / 0.18 : Math.min(1, (1 - p) / 0.35);
      c.obj.scale.setScalar(0.25 + escala * 0.9);
    }
  }
}
