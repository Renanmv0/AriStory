---
name: aristory-cenario
description: Criar ou editar um cenário do AriStory (casa, parque, praia, restaurante, viagem…). Use sempre que a tarefa for "adicionar um ambiente novo", "mexer no parque", "criar a cena X", posicionar objetos, colisões, interações ou diálogos dentro de uma cena. Contém a API completa do WorldBuilder — leia isto em vez de explorar o código.
---

# Criar um cenário no AriStory

Um cenário é **um arquivo só**: `src/scenes/<nome>.ts`, exportando um `SceneDef`.
Nunca mexa no renderer, na câmera, nas luzes ou no loop — a cena só fala com o
`WorldBuilder` (`w`) e com o `GameAPI` (`w.game`, ou o `g` que chega em cada interação).

## Esqueleto

```ts
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { bench, tree, lamp } from '../world/props';

export const praia: SceneDef = {
  id: 'praia',
  name: 'Praia Grande',            // cartão que aparece ao entrar
  subtitle: 'aquele feriado de novembro',
  ambient: { sky: P.skyDusk, fog: 0xffd9b0 },
  spawn: { x: 0, z: 10, facing: Math.PI },   // facing 0 = olhando para +Z
  entries: { 'do-estacionamento': { x: -8, z: 12, facing: Math.PI } },
  build(w) { /* … */ },
};
```

Depois registre em `src/scenes/index.ts` e ligue as duas pontas com `w.door()`
nas duas cenas (ida e volta).

## Eixos e câmera

- Câmera isométrica ortográfica, ângulo padrão 45°. `-Z` sobe para a **direita**,
  `-X` sobe para a **esquerda**, `+X` desce para a direita, `+Z` desce para a esquerda.
- Uma pessoa tem ~1,75 unidade de altura. Use isso como régua para tudo.
- O jogador olha para `+Z` quando `facing === 0`; `facing = Math.atan2(dx, dz)`.

## API do WorldBuilder (`w`)

### Chão e manchas
| chamada | para quê |
|---|---|
| `w.ground({ width, depth, color, x?, z?, y? })` | o piso da cena |
| `w.patch(x, z, w, d, cor, rotY?, y?)` | retângulo pintado: calçada, quadra, tapete |
| `w.disc(x, z, raio, cor, y?)` | círculo pintado: lago, praça, canteiro |
| `w.setBounds(minX, minZ, maxX, maxZ)` | limite invisível de caminhada |
| `w.groundWithHoles({ …, holes: [{x,z,width,depth}] })` | piso com buraco (piscina, poço) |

Buraco é para quem afunda: sem ele o personagem submerso some por baixo do
piso. Grama e deck precisam do **mesmo** furo — ver `src/scenes/clube.ts`.

### Objetos
| chamada | para quê |
|---|---|
| `w.add(obj)` | põe no mundo e liga sombra (devolve o objeto) |
| `w.place(obj, x, y, z, rotY?)` | posiciona/gira (devolve o objeto) |
| `w.wall(x1, z1, x2, z2, altura?, cor?, espessura?)` | parede com colisão junto |

Padrão: `w.add(w.place(bench(), 4, 0, -2, Math.PI))`.

### Colisão (o cenário não colide sozinho)
| chamada | para quê |
|---|---|
| `w.blockBox(x, z, meiaLargura, meiaProfundidade, rot?)` | móveis, prédios |
| `w.blockCircle(x, z, raio)` | árvores, postes, lago |
| `w.blockFrom(obj, encolher?)` | deriva a caixa da bounding box |

O jogador tem raio 0,42. Deixe pelo menos ~1,2 de vão entre colisores para passar.

### Interações
```ts
w.interact({
  x, z,
  radius: 2,               // distância em que o prompt aparece
  label: 'Sentar no banco',
  icon: '🪑',
  highlight: objeto,       // balança de leve quando você chega perto
  once: false,
  priority: 0,             // maior ganha quando dois prompts se sobrepõem
  onInteract: async (g) => { /* … */ },
});

w.door({ x, z, to: 'casa', entry: 'da-rua', label: 'Voltar pra casa', icon: '🏠' });
```
Um `Interactable` devolvido pode ser ligado/desligado (`it.enabled = false`) e
movido (`it.moveTo(x, z)`) — é assim que o frisbee funciona.

### Animação e aleatório
```ts
w.onUpdate((dt, tempo) => { /* roda todo frame */ });
w.rng() / w.range(min, max) / w.pick([...])   // determinístico: a mesma cena sempre igual
```

## API do jogo (`g` / `w.game`)

```ts
await g.say(['linha 1', 'linha 2']);      // diálogo, resolve ao fechar
const i = await g.ask('Sentar?', ['Sim', 'Não']);   // devolve o índice
g.toast('Água de coco gelada', '🥥');
g.goTo('villa-lobos', 'portao');
g.flag('regou') / g.setFlag('regou')       // persistente
g.bump('frisbee.pegadas') / g.stat(...)    // contador persistente
g.unlock({ id, title, place, note, icon }) // memória no diário (J)
g.lockPlayer(true) / g.setPlayerVisible(false)
g.focusCamera(objeto | null) / g.setZoom(30)
g.ridePlayer(cabine, new THREE.Vector3(0, -0.34, 0), 0.6)
g.releasePlayer(x, z, facing)
g.playerPosition() / g.playerFacing() / await g.wait(1.5)

// a dupla
g.playerName() / g.companionName() / g.companionPosition()
g.rideCompanion(cabine, local, escala, facing) / g.releaseCompanion(x, z, facing)
g.commandCompanion(x, z)   // manda ele buscar algo; freeCompanion() devolve o "seguir"
g.setSitting(true)         // os dois sentam
g.swapCharacters()

// teclas próprias da cena (o frisbee usa F)
if (g.keyPressed('KeyF')) { /* … */ }

// água
g.submergePlayer(0..1) / g.submergeCompanion(0..1)   // 1 = nadando
```

Roupa da cena: `outfit: 'banho'` no `SceneDef` deixa os dois sem camisa e de
calção (é o que o clube usa). O motor volta para `'normal'` ao trocar de cena.

**Sempre há dois personagens em cena**: quem você controla e quem acompanha.
Cutscene que carrega um tem que carregar o outro (a roda gigante leva os dois
na mesma cabine). Diálogo que cita um nome usa `g.companionName()`, nunca o
nome cravado — o jogador pode ter trocado com a tecla T.

Para uma zona de água, compare a posição no `w.onUpdate` e interpole a
submersão (sem interpolar, o corpo pula 70 cm de uma vez na borda):

```ts
molhado += ((dentro ? 1 : 0) - molhado) * Math.min(1, dt * 5);
g.submergePlayer(molhado);
```

## Cutscene com os dois

O padrão é sempre o mesmo: um `THREE.Object3D` vazio serve de âncora, os dois
entram nele e saem no fim. A rotação mora na âncora, então o rig entra com
`facing: 0`.

```ts
const assento = new THREE.Object3D();
assento.position.set(-0.52, 0, 0.6);
assento.rotation.y = -Math.PI / 2;      // virado para a TV
w.root.add(assento);

g.lockPlayer(true);
g.ridePlayer(assento, new THREE.Vector3(-0.52, 0.02, 0), 1, 0);
g.rideCompanion(assento, new THREE.Vector3(0.52, 0.02, 0), 1, 0);
g.setSitting(true);
g.focusCamera(foco); g.setZoom(7.2);
await g.say([…]);
g.setSitting(false); g.focusCamera(null); g.setZoom(10);
g.releasePlayer(x, z, facing); g.releaseCompanion(x, z, facing);
g.lockPlayer(false);
```

Cuidado com móvel na frente: numa câmera isométrica o encosto do sofá tapa quem
senta colado nele. Sente **à frente** do encosto e confira com foto.

## Regras da casa

1. **Cor sempre da paleta** (`src/palette.ts`). Se falta uma cor, adicione lá.
2. **Material sempre por `toon()`/`flat()`** (`src/core/materials.ts`), que são
   cacheados. Nunca `new THREE.Mesh*Material` solto dentro de uma cena.
3. **Reaproveite os kits**: `src/world/props.ts` (externo) e
   `src/world/furniture.ts` (interno). Peça nova e reutilizável vai para o kit,
   não para dentro da cena.
4. **Interiores**: paredes inteiras só em `-X` e `-Z`; nos dois lados abertos use
   mureta (`altura 0.45`), senão a parede tapa a câmera.
5. **Ponto de nascimento livre**: confira que o `spawn`/`entries` não cai dentro
   de um colisor — o jogador fica preso.
6. **Nada de arquivo de modelo 3D.** Tudo é primitiva, de propósito: o repositório
   fica leve e dá para ajustar qualquer coisa mudando número.
7. **Diálogo em português, curto, específico.** Duas ou três linhas por interação.
   Cada cenário deve render pelo menos uma memória (`g.unlock`).
8. **Fala que o Renan escreveu vai literal.** Quando ele der o texto de uma
   interação, use exatamente aquilo — não reescreva nem "melhore".

## Antes de dizer que terminou

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/smoke.mjs /tmp/aristory   # tira as fotos e checa erros de console
```
Olhe as imagens. Confira: dá pra andar sem travar, os prompts aparecem, nada
flutuando no ar, nada atravessando parede. Veja `.claude/skills/aristory-testar`.
