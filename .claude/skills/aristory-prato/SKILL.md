---
name: aristory-prato
description: Adicionar um prato novo ao cardápio do restaurante do clube — a ficha, a miniatura em Canvas 2D e o modelo 3D que o garçom leva até a mesa. Use quando pedirem "põe X no cardápio", "adiciona uma sobremesa", "cria o prato favorito de alguém", ou para ajustar um prato que já existe (desenho, preço, descrição).
---

# Adicionar um prato ao cardápio

Um prato vive em **três lugares**. Esquecer um deles é o defeito clássico
daqui, e cada um falha de um jeito diferente:

| onde | o quê | se faltar |
|---|---|---|
| `src/world/cardapioData.ts` | a ficha (id, nome, preço, descrição, selo) e a função que PINTA a miniatura | o prato não aparece no cardápio |
| `src/world/props.ts` | a peça 3D que vai para a mesa | erro de compilação, ou nada chega |
| `pratoServido()`, no mesmo `props.ts` | o `switch` que liga o **id** da ficha à peça 3D | o prato aparece, o pedido é falado, e **o cachorro chega na mesa de costas vazias** |

## 1. Rode o gerador — ele abre os três buracos

```bash
node scripts/novo-prato.mjs --secao Sobremesas \
  --id torta-de-limao --nome "Torta de limão" --preco "R$ 16" \
  --descricao "Massa crocante, creme azedinho e merengue queimado por cima." \
  --selo "o favorito do Renan"
```

Ele escreve os três esqueletos no lugar certo, casando pelo id, com `TODO`
marcando exatamente o que é desenho. `--secao` aceita uma seção que já existe
(o prato entra no fim dela) ou um nome novo (cria a seção). O `--selo` é
opcional: quando existe, o prato vira o **destaque** da seção, com fundo âmbar
e a fitinha dourada.

O gerador **não desenha nada** de propósito. Ele garante que os três blocos
existam, casem e compilem — o resto é olho.

## 2. A miniatura, em `cardapioData.ts`

Um quadrado de lado `s`, e **tudo em fração de `s`** (assim a mesma função
serve a 64 px e a qualquer tamanho depois). A receita, sempre de trás para a
frente:

1. `prato(ctx, s)` — a louça, que ocupa o quadrado inteiro (quem faz o recorte
   redondo é o `border-radius` do CSS);
2. `sombra(ctx, cx, cy, r)` — a elipse chapada embaixo da comida;
3. a comida em **camadas**, cada uma tapando a de baixo no lugar certo;
4. os brilhos por último.

**O que faz ler a 64 px não é detalhe, é SILHUETA.** Cada prato precisa de uma
forma que ninguém confunde de longe, e as quatro que já existem estão tomadas:
a arepa é um círculo gordo, o hambúrguer é uma pilha, o perro é uma diagonal
comprida, a bebida é um copo vertical. Ache uma nova antes de desenhar.

Pincéis prontos no arquivo: `pilula()` (retângulo de cantos redondos),
`molho()` (traço em zigue-zague) e `copo()` (o copo inteiro, que as bebidas
dividem — passe as cores). As cores ficam no objeto `C`, em string CSS, e
**não** em `palette.ts`: são a paleta de uma ilustração 2D, e nenhum material
do mundo 3D usa nenhuma delas.

Dois erros que já custaram uma rodada de foto:

- **comida pequena demais.** A louça é o fundo cheio justamente para a comida
  poder crescer até quase a borda. A UI ainda amplia 1,22 em torno do centro na
  hora de pintar; conte com isso.
- **creme sobre creme.** Massa dourada em louça creme some. Se as duas cores
  forem parentes, contorne a comida com um fio de `C.contorno` a 35% de alpha —
  foi o que salvou a arepa.

## 3. O modelo 3D, em `props.ts`

Contrato de peça, igual a todas: base em `y = 0`, olhando para `+Z`, centrada
na origem, cor da paleta, material por `toon()`, e **base pequena** — o prato
fica em cima de uma mesa de 0,74 e é visto de longe. Comece por
`pratoDeLouca()`, o disco que todos os pratos servidos dividem.

Bebida é o caso barato: `copoDeSuco(sabor)` já existe no kit e serve inteiro —
só troque a cor. Foi assim que o suco de morango entrou sem geometria nova.

Etiquete a peça com `g.userData.peca = '<id>'` (o gerador já faz) e rode
`node scripts/zfighting.mjs` depois: ele mede sozinho as faces coplanares.

## 4. Valide

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/cardapio.mjs /tmp/cd
node scripts/zfighting.mjs
```

`cardapio.mjs` mede, não só fotografa: confere que cada miniatura tem pixel
pintado de verdade dentro (canvas em branco passa despercebido no HTML), que
todo prato tem preço e descrição, que o destaque é o certo, e que o fluxo
inteiro — sentar, escolher, pedir, o cachorro entregar, comer, levantar —
chega ao fim sem prender a dupla na cadeira.

**Olhe as fotos** (`/tmp/cd-cardapio.png` e `/tmp/cd-mesa.png`) antes de dar o
prato como pronto: é regra do `CLAUDE.md` para qualquer mudança visual.

## Como o prato chega na mesa

Vale conhecer o caminho antes de mexer nele, em `src/scenes/clube.ts`:

1. o cardápio abre e **devolve o id escolhido** (`abrirCardapio()` resolve com
   `string | null` — `null` é sair sem pedir);
2. quem está sendo controlado fala `"Um(a) <nome>, por favor!"`;
3. `dogWaiter()` nasce na porta do restaurante com a peça de `pratoServido(id)`
   ancorada no `userData.bandeja` das costas dele;
4. ele anda até a mesa, o prato **troca de pai** para a mesa, ele dá meia-volta
   e some — a instância é destruída ao sair de cena;
5. alguns segundos comendo, o prato some, os dois elogiam e levantam.

Prato novo não precisa tocar em nada disso: o `switch` do `pratoServido()` é a
única ponta solta, e o gerador já a amarra.
