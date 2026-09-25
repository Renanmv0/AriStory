---
name: aristory-prop
description: Adicionar uma peça nova ao kit de cenário do AriStory — árvore, banco, poste, móvel, veículo, brinquedo. Use quando faltar um objeto para montar uma cena, ou quando pedirem "cria um X" (bicicleta, churrasqueira, pedalinho, guarda-sol…).
---

# Criar uma peça nova para o kit

Duas caixas de peças:

- `src/world/props.ts` — externo: natureza, parque, rua, praia.
- `src/world/furniture.ts` — interno: móveis, eletrodomésticos, decoração.

Peça grande e animada ganha arquivo próprio (ver `src/world/ferrisWheel.ts`).

## Contrato

Toda peça é uma função que devolve um `THREE.Group` com **a base em `y = 0`**,
**olhando para `+Z`**, centrada em `x = 0, z = 0`. Quem posiciona é a cena, com
`w.place()`. A função nunca adiciona nada ao mundo e nunca cria colisor.

```ts
export function guardaSol(cor: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();

  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), toon(P.wood));
  haste.position.y = 1.1;
  g.add(haste);

  const lona = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.5, 12), toon(cor));
  lona.position.y = 2.2;
  g.add(lona);

  return g;
}
```

## Regras

1. **`toon(cor)` e `flat(cor)`** de `src/core/materials.ts`. Materiais são
   cacheados por cor — criar material solto estoura a memória e quebra o estilo.
2. **Cores da paleta** (`src/palette.ts`). Falta uma? Adicione lá, com nome.
3. **Parâmetro de cor com anotação explícita**: `cor: number = P.wood`. Sem o
   `: number` o TypeScript infere o literal da paleta e a função só aceita
   aquela cor exata.
4. **Poucos polígonos.** `SphereGeometry(r, 10, 8)`, `CylinderGeometry(…, 8)`,
   `IcosahedronGeometry(r, 1)`. O jogo roda em celular.
5. **Estilo fofo**: cantos arredondados (cápsula e esfera antes de caixa),
   proporções exageradas, poucos detalhes e bem legíveis de longe.
6. **Nada de arquivo externo** — o repositório é 100% procedural. A única
   textura permitida é a desenhada em tempo de execução num `<canvas>`, como
   em `textSign()`: continua sendo código, nenhum `.png` entra no repositório.
   Use `textSign('Clube!')` sempre que uma placa precisar ser legível.
7. Escala: uma pessoa tem 1,75 unidade. Banco 0,48 de assento, porta 2,1 de altura.

## Peça com balcão

Quiosque, banca, bar: a câmera olha de cima em 34°, então **toldo ou telhado
avançado passa na frente do que está no balcão e esconde tudo**. A regra que
funcionou no `kiosk()`: o toldo para *antes* da metade da frente do balcão, e a
vitrine (as cubas de sorvete, as jarras de suco) fica na borda da frente, do
lado de fora da sombra do toldo. Depois de mexer, confira com
`node scripts/quiosque.mjs /tmp/q`.

Vidro fechado por cima de comida é armadilha: some no toon shading e ainda
tapa o que está dentro. Cuba aberta lê muito melhor de longe.

## Z-fighting: nunca encoste face com face

Duas superfícies opacas no MESMO plano, com área em comum, brigam pelo mesmo
pixel: a GPU não tem como desempatar e a peça serrilha e pisca conforme a
câmera gira. É o defeito visual mais comum do kit, e ele **não aparece de
longe** — só com a câmera colada.

O par perigoso é o que aponta para o MESMO lado (as duas faces `min`, ou as
duas `max`). Face contra face oposta — uma caixa terminando onde a outra
começa — é empilhamento normal e não serrilha.

A correção é sempre a mesma família: **sobrepor de leve em vez de encostar.**

- peça de dentro (detalhe, letreiro, listra): avance ou recue 1–2 cm da face
  que ela decora;
- peça em cima (laje, tampo): desça um pouco para dentro do que ela cobre;
- peças com a mesma dimensão (moldura e parede, degrau e apoio): dê 4–5 cm de
  diferença, para fora ou para dentro, em vez de casar o número.

Já mordeu em: livros na estante, listras do quadro de preços do quiosque,
moldura de madeira contra a parede do quiosque, laje contra o topo da parede,
degrau contra apoio na arquibancada, e fundo contra laterais da estante.

**`node scripts/zfighting.mjs` acha isso sozinho.** Ele mede as caixas de cada
peça etiquetada (`g.userData.peca = 'nome'`) em espaço local e lista os pares
coplanares com a área compartilhada. Etiquete a peça nova e rode: é mais
barato que caçar na foto.

Decalque de chão é o caso em que coplanar é o mecanismo, e não o bug — ali o
`polygonOffset` do `WorldBuilder` resolve, e o detector ignora quem o tem.

## Peça amassada (pedra, terreno)

Geometria de sólido do three (`DodecahedronGeometry` e companhia) **não é
indexada**: cada triângulo tem os próprios vértices. Amassar vértice por
**índice** rasga os cantos que deviam ser compartilhados e a pedra vira caco de
vidro. Sorteie o ruído pela **posição** arredondada — assim o mesmo canto recebe
o mesmo empurrão em todos os triângulos que o usam. É o que `rock()` faz.

## Peça animada

Devolva uma classe com `group` e `update(dt)`, como a `FerrisWheel`. A cena
chama `w.onUpdate((dt) => peca.update(dt))`.

## Peça que MUDA com o jogo: receita, e não peça

Quando a mesma coisa precisa existir em várias versões que o jogador destranca
jogando, ela sai de `props.ts` e ganha **arquivo próprio**, com uma função que
recebe um `estilo` e devolve aquela versão. Hoje é o caso de um só, e ele é o
modelo a copiar: `src/world/regador.ts`.

O regador é a arma do minigame do jardim, e cada carta que melhora ele **mexe
na peça da mão** — o bico estica de verdade, o crivo alarga, o corpo engorda,
a mangueira aparece enrolada. Nada de ícone de buff no canto da tela: neste
projeto todo modelo é geometria procedural, então o upgrade aparece no objeto.

As regras que valeram ali, e que valem para a próxima:

- **Números contínuos para o que repete, booleano para o que é único.** Cartas
  comuns repetem (pegar "Bico mais longo" três vezes tem que esticar três
  vezes), então elas são `0 a 1`; carta única é `true/false`.
- **Estágios visíveis**, e a cor é o que os separa de longe. Mude a FERRAGEM
  antes do corpo: trocar só o corpo faz os estágios parecerem objetos
  diferentes, e trocar só a ferragem não dá salto no último.
- **`props.ts` continua exportando o atalho** (`regador()` devolve o de
  fábrica), para quem só quer a peça largada num canto não precisar saber que
  existe uma receita.
- **O teste monta as versões lado a lado e mede**, porque é fácil escrever uma
  carta que não muda nada e impossível notar isso olhando uma foto só. Ver
  `scripts/regador.mjs`.

## Depois de criar

Use a peça em pelo menos uma cena e rode o smoke test para ver como ela fica de
verdade (`.claude/skills/aristory-testar`). Peça que ninguém usa não entra no kit.
