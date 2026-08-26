---
name: aristory-personagem
description: Ajustar ou criar um personagem do AriStory (o Ari, o Renan, qualquer NPC) — cabelo, pele, roupa, óculos, altura, corpo. Use quando a tarefa for "deixar o personagem mais parecido", "mudar o cabelo/roupa", "criar meu personagem" ou "adicionar um NPC".
---

# Mexer nos personagens do AriStory

Personagem é **ficha declarativa**, não modelo 3D. Para mudar alguém você edita
`src/characters/cast.ts` e mais nada. A geometria é montada em
`src/characters/CharacterRig.ts` a partir da ficha.

## A ficha (`CharacterSpec`, em `src/characters/spec.ts`)

```ts
export const ARI: CharacterSpec = {
  id: 'ari',
  name: 'Ari',            // nome que aparece nos diálogos
  height: 1.74,           // altura total em unidades (1.75 ≈ adulto)
  build: 'medio',         // 'magro' | 'medio' | 'forte'
  skin: 0xe8b48c,
  blush: 0xff9aa8,        // bochecha
  eyes: 0x3a2b26,
  hair: { color: 0x3b2418, style: 'cacheado' },
  shirt: 0x5fb0d6,
  shirtAccent: 0xffffff,  // faixa/gola; omita para camiseta lisa
  pants: 0x3f4a63,
  shoes: 0xf4f4f2,
  accessories: ['oculos'],
  accessoryColor: 0x2f3440,
};
```

### Cabelos (`hair.style`)
`raspado` · `curto` · `franja` · `ondulado` · `coque` · `cacheado`

### Acessórios (`accessories[]`)
`oculos` · `bone` · `barba` · `relogio` · `mochila` · `corrente` · `fone`

`accessoryColor` vale para óculos, boné, fone, mochila e corrente.

## Como iterar de verdade

Ajustar aparência é ida e volta com foto. O ciclo curto:

1. edite `cast.ts`
2. `npm run build && node scripts/smoke.mjs /tmp/ari`
3. olhe `/tmp/ari-casa.png` e ajuste

**Pergunte antes de chutar.** Cor de pele, tipo de cabelo e formato de rosto são
a pessoa real — quando faltar informação, pergunte (ou peça uma foto de
referência) em vez de inventar. Os valores em `cast.ts` são um rascunho
declarado como tal.

## Criar um personagem novo

```ts
// src/characters/cast.ts
export const AVO: CharacterSpec = { /* … */ };
export const CAST = { ari: ARI, renan: RENAN, avo: AVO };
```

Para um NPC parado numa cena:

```ts
import { CharacterRig } from '../characters/CharacterRig';
import { RENAN } from '../characters/cast';

const renan = new CharacterRig(RENAN);
w.add(w.place(renan.group, 6, 0, -2, Math.PI));
w.blockCircle(6, -2, 0.45);
w.onUpdate((dt) => renan.update(dt, 0));   // 0 = parado; > 0 anima a caminhada
```

`rig.setFacing(angulo)` gira suave. `rig.cheer()` dá um pulinho de alegria.

## Trocar quem o jogador controla

`src/main.ts`: `new Game(root, SCENES, ARI)`. Passe outra ficha para jogar com
outro personagem.

## Limites conhecidos (candidatos a evoluir)

- Sem expressões faciais além do sorriso fixo.
- Sem troca de roupa em tempo de jogo.
- Um jogador por vez: um segundo personagem hoje só existe como NPC.
