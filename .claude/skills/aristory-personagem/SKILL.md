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
  height: 1.72,           // altura total em unidades (1.75 ≈ adulto)
  build: 'magro',         // 'magro' | 'medio' | 'forte'
  skin: 0xf2cfb2,
  blush: 0xff8fa0,        // bochecha
  eyes: 0x4a3328,
  hair: {
    color: 0x8f5c33,
    style: 'cacheado',
    volume: 1.28,      // 0.7 colado, 1.3 juba
    tips: 0xa9713f,    // mechas mais claras (opcional)
  },
  shirt: 0xf8f5f0,
  shirtAccent: undefined, // faixa/gola; omita para camiseta lisa
  pants: 0x5b7ba8,
  shoes: 0xf4f4f2,
  accessories: ['presilha', 'laco', 'cinto'],
  accessoryColor: 0x24222a,
};
```

### Cabelos (`hair.style`)
`raspado` · `curto` · `franja` · `ondulado` · `coque` · `cacheado`

### Acessórios (`accessories[]`)
`oculos` · `bone` · `barba` · `relogio` · `mochila` · `corrente` · `fone` ·
`presilha` (estrela no cabelo) · `laco` (fita no decote) · `cinto` (com
correntinha de estrela)

`accessoryColor` vale para óculos, boné, fone, mochila, corrente, laço e cinto.
A presilha é sempre creme.

### Cuidado com cabelo volumoso

A câmera olha de cima: cabelo grande tapa o rosto com facilidade. Duas defesas
já embutidas no rig, mexa nelas se criar um estilo novo:

- a calota base tem uma **janela na frente** (`cap(escala, y, desce, abertura)`);
  sem abertura ela é uma esfera inteira e cobre os olhos;
- os cachos com `theta > 0.72` e `z > 0.22` são pulados, e o volume cresce
  para trás (`frente = 0.78`), não para cima da cara.

Toda mudança de cabelo **precisa** de uma foto de retrato antes de ser dada
como pronta: `node scripts/retrato.mjs /tmp/ari` e olhe `/tmp/ari-frente.png`.

## Como iterar de verdade

Ajustar aparência é ida e volta com foto. O ciclo curto:

1. edite `cast.ts`
2. `npm run build && node scripts/retrato.mjs /tmp/ari`
3. olhe `/tmp/ari-frente.png` e ajuste

`?zoom=4` na URL aproxima a câmera em qualquer cena.

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

## A dupla

Os dois andam juntos o tempo todo: quem você controla é o `Player`, o outro é o
`Companion`, que segue a ~2 unidades e para de frente para você. A tecla **T**
(ou o botão 🔁 no celular) troca quem é quem — na prática os dois corpos trocam
de lugar, ninguém sai da posição.

Quem entra em cena vem de `DUPLA` em `src/characters/cast.ts`:

```ts
export const DUPLA = [ARI, RENAN] as const;   // [controlado, acompanhante]
```

Trocar a ordem troca quem começa jogável. Passar só uma ficha esconde o parceiro.

## Limites conhecidos (candidatos a evoluir)

- Sem expressões faciais além do sorriso fixo.
- Sem troca de roupa por cenário (sunga na piscina, casaco no frio).
- O parceiro só segue: não interage com objetos nem responde no diálogo.
