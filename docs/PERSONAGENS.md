# Personagens

Os personagens são **fichas**, não modelos. Para mudar alguém, edite
`src/characters/cast.ts`. A geometria se remonta sozinha.

> O **Ari** já foi montado a partir de foto e da ilustração de referência:
> cachos castanho-acobreado volumosos com franja, presilha de estrela, blusa
> branca com laço preto, jeans largo, tênis branco.
>
> O **Renan** também veio de foto: cachos escuros e volumosos no topo, pele
> clara, camiseta cinza por baixo de um moletom preto aberto, calça e tênis
> pretos, mochila.

## Campos

| campo | o que é | dica |
|---|---|---|
| `name` | nome nos diálogos | |
| `height` | altura total | 1,75 ≈ adulto. 1,60 = baixinho, 1,90 = alto |
| `build` | `magro` · `medio` · `forte` | mexe na largura de ombro, tronco e membros |
| `skin` | tom de pele | |
| `blush` | bochecha | rosado suave; opcional — sem ele o rosto fica sem bochecha (é o caso do Renan) |
| `eyes` | olhos (e boca) | |
| `hair.color` | cabelo (e barba) | |
| `hair.style` | ver abaixo | |
| `hair.volume` | quanto o cabelo arma | 0.7 colado · 1 normal · 1.3 juba |
| `hair.tips` | cor das mechas mais claras | opcional |
| `shirt` / `shirtAccent` | camiseta e faixa | omita `shirtAccent` para lisa |
| `pants` / `shoes` | calça e tênis | |
| `accessories` | ver abaixo | |
| `accessoryColor` | armação, aba, fone, mochila | |
| `jacket` | moletom/jaqueta aberta com capuz | mostra a camiseta pela fresta |
| `swim` | cor do calção de banho | padrão: a cor da calça |
| `casal` | faz parte do casal | só entre dois marcados assim rola o beijo |

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

## Cabelo e a câmera de cima

A câmera olha de cima, então cabelo adiantado projeta para baixo na tela. Dá
para errar para os dois lados: cachos muito à frente **tapam os olhos**, e uma
janela larga demais na calota deixa a testa nua — o personagem fica com cara de
**careca**. O equilíbrio está em três peças:

1. a `abertura` da calota entre 1,15 e 1,3 (larga o bastante para os olhos);
2. uma **franja** em `y ≈ 0.62`, `z ≈ 0.62` fechando a linha do cabelo;
3. os cachos frontais descartados quando `y < 0.72 && z > 0.24`.

Confira sempre girando a câmera, não só de frente.

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
