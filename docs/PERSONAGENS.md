# Personagens

Os personagens são **fichas**, não modelos. Para mudar alguém, edite
`src/characters/cast.ts`. A geometria se remonta sozinha.

> Os valores que estão lá hoje são um **primeiro rascunho**, feitos sem
> referência. A ideia é ajustar juntos, olhando: muda a ficha, roda o smoke test,
> compara com a foto, muda de novo.

## Campos

| campo | o que é | dica |
|---|---|---|
| `name` | nome nos diálogos | |
| `height` | altura total | 1,75 ≈ adulto. 1,60 = baixinho, 1,90 = alto |
| `build` | `magro` · `medio` · `forte` | mexe na largura de ombro, tronco e membros |
| `skin` | tom de pele | |
| `blush` | bochecha | rosado suave; é o que deixa fofo |
| `eyes` | olhos (e boca) | |
| `hair.color` | cabelo (e barba) | |
| `hair.style` | ver abaixo | |
| `shirt` / `shirtAccent` | camiseta e faixa | omita `shirtAccent` para lisa |
| `pants` / `shoes` | calça e tênis | |
| `accessories` | ver abaixo | |
| `accessoryColor` | armação, aba, fone, mochila | |

## Cabelos

| estilo | como fica |
|---|---|
| `raspado` | rente, colado no crânio |
| `curto` | touca curta + franja reta |
| `franja` | touca + franja na testa |
| `ondulado` | touca + volume nas laterais |
| `coque` | touca + coque atrás |
| `cacheado` | aglomerado de cachos por cima — bem volumoso |

## Acessórios

`oculos` · `bone` · `barba` · `relogio` · `mochila` · `corrente` · `fone`

Podem ser combinados: `accessories: ['oculos', 'relogio']`.

## Como ajustar olhando

```bash
npm run build
npx vite preview --port 4173 &
node scripts/smoke.mjs /tmp/ari
# olhe /tmp/ari-casa.png
```

## Ideias que ainda não existem

- expressões (surpreso, rindo, dormindo)
- troca de roupa por cenário (casaco no frio, sunga na praia)
- segundo personagem jogável, alternando com uma tecla
- os dois andando juntos, um seguindo o outro
