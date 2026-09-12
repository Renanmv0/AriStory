---
name: aristory-memoria
description: Transformar uma foto ou lembrança do casal numa memória pintada do quadro do quarto do Ari — o desenho em Canvas 2D e a entrada no acervo. Use quando o Renan mandar uma foto pedindo "faz uma memória disso", "põe no quadro de memórias", ou pedir para ajustar uma memória que já existe (o desenho, o título, a legenda).
---

# Pintar uma memória para o quadro

Uma memória **não é uma imagem**: é uma função que pinta a cena com a API Canvas
2D na hora em que o painel abre. Mesmo princípio do resto do jogo — zero asset
externo — só que em 2D, porque uma lembrança se olha de frente, como foto, e não
se anda dentro dela.

O pipeline inteiro cabe em dois arquivos, e só o primeiro muda quando a memória
é mais uma no acervo:

1. `src/world/memoriasData.ts` — a FICHA e a função que PINTA. Uma memória nova
   é uma função nova + uma entrada no array `MEMORIAS`, e mais nada.
2. `scripts/memorias.mjs` — as asserções. Já cobrem "o desenho aconteceu",
   "o desenho está vivo" e "dá para folhear"; uma peça a mais não pede teste
   novo, mas **pede a foto olhada**.

O quadro na parede (`muralDeMemorias` em `world/furniture.ts`), a interação
(`quarto:memorias` em `scenes/quarto.ts`) e o painel (`Ui.ts` + `style.css`) já
existem e **não mudam** para acrescentar memória.

## A ficha

```ts
{
  id: 'arraia',                         // o que a cena chama em g.abrirMemoria()
  titulo: 'O arraiá da Hello Kitty',
  lugar: 'Parque Villa-Lobos, em junho', // o subtítulo
  legenda: '…',                          // a frase embaixo do quadro
  proporcao: 3 / 4,                      // largura / altura
  pintar: arraiaDaHelloKitty,
}
```

`pintar(ctx, w, h, t)` recebe o tamanho em pixels e `t` em segundos desde que o
painel abriu. **Desenhe sempre em frações de `w` e `h`**, nunca em pixels
fixos: o mesmo quadro é pintado em 312×416 no desktop e menor no celular.

## Primeiro passo: qual estrutura a foto pede?

É a decisão que decide se o desenho vai parecer a foto ou um cenário de teatro.
As duas memórias existentes usam estruturas **diferentes**, e é por isso que a
pintura é uma função por memória e não um motor só.

### A. A foto tem profundidade (corredor, rua, ponte, fila de postes)

Tudo sai de **um ponto de fuga só**. As funções já estão prontas no arquivo:

```ts
const FUGA = { x: 0.5, y: 0.44 };
const encolhe = (d) => 1 / (1 + 8.5 * d);   // d=0 é a boca, d=1 é o fundo
const projetar = (x, y, d, w, h) => {        // x,y medidos DO PONTO DE FUGA
  const f = encolhe(d);
  return { x: (FUGA.x + x * f) * w, y: (FUGA.y + y * f) * h };
};
```

Duas coisas fazem isso funcionar:

- **`x` e `y` são medidos a partir do ponto de fuga.** Então `(0, 0)` é o fundo
  em qualquer profundidade, e a convergência sai de graça, sem nenhuma conta a
  mais.
- **A hipérbole, não uma reta.** Como `encolhe` é `1/(1+kd)`, um `d`
  *igualmente espaçado* já sai igualmente espaçado no mundo. Por isso as vigas
  são `d = i * 0.052` numa progressão simples e o adensamento ao longe — que é
  o que o olho reconhece na foto — aparece sozinho.

Depois é só declarar o plano da frente (`CHAO`, `TETO`, `LADO`) e derivar tudo:
uma viga é `projetar(-LADO, TETO, d)` até `projetar(+LADO, TETO, d)`, um pilar
vai de `CHAO` a `TOPO_PILAR` no mesmo `d`, as juntas do chão saem do ponto de
fuga como raios.

### B. A foto é frontal e chapada (um palco, uma fachada, um campo)

Aí são **faixas horizontais empilhadas**: céu, fundo distante, o assunto, chão.
Forçar um ponto de fuga numa cena que na foto é reta só a torce. É o caso do
arraiá: céu, mata, brinquedos, grama — com os varais de bandeirinha cruzando
por cima de tudo.

## Ordem: sempre de trás para a frente

As duas estruturas compartilham isto. Pinte como quem monta um cenário — céu,
fundo, meio, frente, e por último o acabamento. Cada camada tapa a anterior no
lugar certo, e é o que **dispensa qualquer recorte** (`clip`). Se você precisou
de `clip`, provavelmente a ordem está errada.

O acabamento no fim custa duas linhas e costura o desenho:

```ts
ctx.fillStyle = 'rgba(255, 176, 96, 0.07)';   // um banho na luz da cena
ctx.fillRect(0, 0, w, h);
// + uma vinheta radial escurecendo os cantos
```

Sem eles o desenho fica com cara de recorte colado.

## São sempre dois

A regra do `CLAUDE.md` vale aqui: a memória mostra **os dois**. Use
`silhueta(ctx, x, base, altura, roupa, cabelo, passo, pele?)`, com as cores de
`CORES_DUPLA` — o Ari é o claro (camisa creme), o Renan é o escuro (moletom
preto). Passe `pele` só de dia e de perto: no contraluz eles são recorte, e um
braço cor de pele ali seria uma mancha clara sem explicação.

## Peças prontas — reaproveite antes de desenhar do zero

| função | serve para |
|---|---|
| `silhueta` | o Ari ou o Renan, de costas |
| `palmeira` | vegetação em silhueta, tronco + folhas em leque |
| `lampada` | luz com halo, para varal de luzinha e poste |
| `varalDeBandeiras` | bandeirinha de festa junina, com o balanço |
| `gatinha` | rosto de gato fofo (cabeça, orelhas, laço, bigodes) |
| `inflavel` | brinquedo inflável: bloco arredondado com gomos |

## As cores

**Um bloco por memória**, no próprio `memoriasData.ts` — `CORREDOR`, `ARRAIA` —
mais `CORES_DUPLA`, que vale para todas. Elas **não** vão para `src/palette.ts`:
são a paleta de uma foto específica, em string CSS, e nenhum material do mundo
3D usa nenhuma delas. Misturar as duas coisas só encheria a paleta do jogo de
tons que nenhuma cena pede.

## As armadilhas — todas já custaram uma foto olhada

1. **Nada de `Math.random()`.** Espalhamento tem que ser determinístico (seno do
   índice, ângulo áureo, tabela fixa). Com sorteio, a foto do teste muda a cada
   build e você não consegue comparar antes/depois.
2. **A peça de `d` pequeno nasce fora da borda.** No corredor, a viga da frente
   fica em `FUGA.y + TETO`; com `TETO` fundo demais ela nasce acima do quadro e
   o desenho perde justamente as vigas grossas de perto. Confira as contas dos
   extremos antes de renderizar.
3. **Elemento plantado a meia altura flutua.** A palmeira nasceu com o pé em
   `CHAO * 0.55` e virou um arbusto pendurado na linha das vigas. Pé no chão,
   altura suficiente para a copa passar por cima do que ela deveria passar.
4. **Brilho radial com raio grande vira muro.** O amontoado de luz no fundo do
   corredor lavava o quadro inteiro e virava uma parede cinza atrás dos dois.
   Pequeno e concentrado.
5. **Sombra rendilhada não é N manchas iguais.** Espalhar 90 elipses do mesmo
   tamanho dá uma *textura de bolhas*, uniforme demais para ler como sombra.
   Uma massa difusa (gradiente radial) com meia dúzia de recortes por cima.
6. **Detalhe escuro no meio de uma peça clara vira bolso.** A boca do
   escorregador a meia altura da torre parecia um bolso cinza. Rente ao chão,
   onde ela fica de verdade.
7. **Peça grande e clara sem sombreamento vira recorte de papel.** Um degrau
   mais escuro no lado que apanha menos sol resolve.
8. **Traço fino some.** Folha de palmeira e gomo de inflável precisam de
   `lineWidth` proporcional à peça, não 1px.
9. **Halo radial é caro.** `createRadialGradient` por lâmpada, vezes 60, pesa.
   Dê halo só ao que está perto (`if (raio > 1.4)`); o resto é um ponto.

## O painel folheia sozinho

Com duas ou mais memórias, as setas ‹ ›, os pontinhos e as teclas ← → aparecem
sozinhos (`Ui.abrirMemorias` recebe a lista inteira e o índice). Com uma só,
some tudo. **Não mexa no `Ui.ts` para adicionar memória** — a única coisa que
cresce é o array.

Se a memória nova entrar com uma `proporcao` diferente, a moldura se ajusta: o
canvas é `inline-block` com `aspect-ratio`, e é a ALTURA que manda.

### Sobre o CSS do canvas, se um dia precisar mexer

Duas coisas não óbvias, ambas já corrigidas e fáceis de reintroduzir:

- O seletor **precisa** do `#ui` (`#ui .memorias .quadro`). A UI mora dentro do
  `#app`, e a regra `#app canvas { width:100%; height:100% }` — a que estica o
  canvas do jogo — pega neste canvas também e **ganha por ter um id**.
- `display` tem que ser `inline-block`. Num bloco, `width: auto` quer dizer
  "toda a largura do pai", e a proporção passa a sair da largura da folha: o
  quadro nasceu com 688px de altura e jogou a legenda para fora da tela.

## Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/memorias.mjs /tmp/me
```

O script **mede, não só fotografa**: conta cores distintas (um canvas chapado
reprova), mede a fração de pixel aceso, compara dois instantes para provar que
o desenho está *vivo*, e confere que folhear troca o desenho e não só o título.

Se acrescentar uma memória, o `acervo` esperado sobe sozinho — o script lê
`window.aristoryMemorias`.

**A asserção de luz é por FRAÇÃO do quadro, nunca por contagem de pixels.** Com
contagem absoluta, mudar o tamanho da folha reprovava um desenho correto.

### Foto obrigatória

Regra do `CLAUDE.md`: mudança visual precisa de foto **olhada** antes de ser
dada como pronta. Aqui isso não é formalidade — as nove armadilhas acima só
apareceram na imagem renderizada, nenhuma no código. Olhe
`/tmp/me-quadro.png` e `/tmp/me-segunda.png`, compare com a foto do Renan, e
espere achar duas ou três coisas erradas na primeira rodada.

## O que perguntar ao Renan, e nunca inventar

Mesma regra do `CLAUDE.md`: o valor do projeto está em ser parecido com a vida
real deles.

- **A legenda e o título** são dele. Escreva um provisório para o desenho não
  ficar sem texto, **diga que é seu** e peça o dele — vai literal quando vier.
- **O nome do lugar e o que aconteceu ali.** "O pedido" só existe porque ele
  contou que foi onde começaram a namorar; a foto não dizia isso.
- **Se a foto tem gente que não são eles**, não tente retratar ninguém: na cena
  eles são silhuetas ou não estão.

## Marca e personagem de terceiro

Foto de evento comercial (o arraiá é de uma marca) se resolve com a **forma
genérica**, não com decalque: a `gatinha` é cabeça oval, orelhas, laço e
bigodes — a linguagem de "gatinho fofo", que é o que se lê num quadro desse
tamanho. Texto do banner pode ir literal (`fillText`), que é fato do lugar.
Se o Renan preferir tirar, é uma linha.
