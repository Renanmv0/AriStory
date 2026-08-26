# Personagens

Os personagens são **fichas**, não modelos. Para mudar alguém, edite
`src/characters/cast.ts`. A geometria se remonta sozinha.

> O **Ari** já foi montado a partir de foto e da ilustração de referência:
> cachos castanho-acobreado volumosos com franja, presilha de estrela, blusa
> branca com laço preto, jeans largo, tênis branco.
>
> O **Renan** ainda é dedução (o de cabelo escuro encaracolado da ilustração
> dos dois). Com uma referência dele, é uma ficha para ajustar.

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
| `hair.volume` | quanto o cabelo arma | 0.7 colado · 1 normal · 1.3 juba |
| `hair.tips` | cor das mechas mais claras | opcional |
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

`oculos` · `bone` · `barba` · `relogio` · `mochila` · `corrente` · `fone` ·
`presilha` · `laco` · `cinto`

Podem ser combinados: `accessories: ['presilha', 'laco', 'cinto']`.

## Cabelo grande e a câmera

A câmera olha de cima, então cabelo volumoso tapa o rosto num piscar de olhos.
O rig se defende de dois jeitos — mantenha os dois se mexer num estilo:

1. a calota base tem uma janela aberta na frente (parâmetro `abertura` do `cap`);
2. os cachos frontais abaixo da testa são pulados, e o volume cresce para trás.

## Como ajustar olhando

```bash
npm run build
npx vite preview --port 4173 &
node scripts/retrato.mjs /tmp/ari
# olhe /tmp/ari-frente.png
```

## A dupla

Os dois estão sempre em cena. `DUPLA` em `cast.ts` define
`[quem você controla, quem acompanha]`; a tecla `T` troca. O acompanhante segue
a uns 2 metros e para de frente para você.

## Ideias que ainda não existem

- expressões (surpreso, rindo, dormindo)
- troca de roupa por cenário (casaco no frio, sunga na piscina)
- o acompanhante reagir ao que você faz
