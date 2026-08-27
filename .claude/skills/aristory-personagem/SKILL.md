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
  swim: 0x5fb0d6,         // cor do calção de banho
  jacket: undefined,      // moletom/jaqueta aberta por cima, com capuz
  accessories: ['presilha', 'laco', 'cinto'],
  accessoryColor: 0x24222a,
};
```

### Cabelos (`hair.style`)
`raspado` · `curto` · `franja` · `ondulado` · `coque` · `cacheado` ·
`cachos-curtos`

`cacheado` (Ari) e `cachos-curtos` (Renan) são de propósito silhuetas opostas:
o primeiro é juba redonda e volumosa, o segundo tem volume só no topo com as
laterais rentes e um topete na frente. **Dois personagens não devem usar o mesmo
estilo só trocando a cor** — de longe eles viram a mesma pessoa.

### Acessórios (`accessories[]`)
`oculos` · `bone` · `barba` · `relogio` · `mochila` · `corrente` · `fone` ·
`presilha` (estrela no cabelo) · `laco` (fita no decote) · `cinto` (com
correntinha de estrela)

`accessoryColor` vale para óculos, boné, fone, mochila, corrente, laço e cinto.
A presilha é sempre creme.

### Cabelo: a régua da câmera isométrica

A câmera olha de cima em 34°, então **cacho adiantado projeta para BAIXO na
tela**. Isso cria duas falhas opostas, e as duas já aconteceram neste projeto:

| falha | causa | conserto |
|---|---|---|
| tapa os olhos | franja/cachos muito à frente ou muito baixos | subir o `y`, recuar o `z` |
| **parece careca** | janela da calota larga demais e nada preenchendo a testa | estreitar a `abertura` e **acrescentar franja** |

Números que funcionam (use como ponto de partida, em múltiplos de `headR`):

- **abertura da calota**: entre `1.15` e `1.3`. Menos que ~`0.9` a borda corta o
  canto dos olhos, que ficam a ~21° do eixo da frente. Mais que `1.4` deixa
  testa nua.
- **franja**: `y ≈ 0.62`, `z ≈ 0.62`, raio `≈ 0.20`. É ela que fecha a linha do
  cabelo — a calota sozinha não fecha.
- **corte dos cachos frontais**: descartar quando `y < 0.72 && z > 0.24`. Repare
  que o corte olha a **altura**, não o ângulo polar.
- o volume cresce para trás (`frente ≈ 0.78–0.9` multiplicando o `z`), nunca
  para cima do rosto.

**Sempre confira de vários ângulos.** `scripts/retrato.mjs` fotografa de frente
e girando; uma falha no topo ou na nuca só aparece girando a câmera.

Toda mudança de cabelo **precisa** de uma foto de retrato antes de ser dada
como pronta: `node scripts/retrato.mjs /tmp/ari` e olhe `/tmp/ari-frente.png`.

## Como iterar de verdade

Ajustar aparência é ida e volta com foto. O ciclo curto:

1. edite `cast.ts`
2. `npm run build && node scripts/retrato.mjs /tmp/ari`
3. olhe `/tmp/ari-frente.png` e ajuste

Parâmetros de URL que ajudam:

| parâmetro | efeito |
|---|---|
| `?zoom=4.5` | aproxima a câmera |
| `?em=-1.6,3.2` | põe a dupla nesse ponto (fugir de parede que corta o corpo) |
| `?olhar=0.785` | ângulo que eles encaram; `0.785` = de frente para a câmera |

`scripts/retrato.mjs` já usa os três e fotografa os dois (ele aperta `T`).

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

## Jaqueta

`jacket: 0x191a1f` põe um moletom aberto por cima da camiseta: as mangas ganham
a cor da jaqueta, um cilindro vazado com fresta na frente envolve o torso (é
pela fresta que a camiseta aparece — se a camiseta for escura demais, some) e um
capuz cai nas costas. É o que o Renan usa.

## Traje de banho

`rig.setOutfit('banho')` deixa a pessoa sem camisa e de calção: camiseta, calça
e tênis viram pele, os acessórios de roupa somem e o calção aparece. É quase
tudo troca de material, então não custa nada.

Quem pede isso é a **cena**, com `outfit: 'banho'` no `SceneDef` — é assim que
o clube funciona. Ao trocar de cena o motor volta para `'normal'` sozinho.

## Sentar

`rig.setSitting(true)` dobra as pernas para a frente e apoia os braços. Use
sempre pelo `g.setSitting(true)`, que aplica nos dois de uma vez.

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
