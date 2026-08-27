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

## Peça animada

Devolva uma classe com `group` e `update(dt)`, como a `FerrisWheel`. A cena
chama `w.onUpdate((dt) => peca.update(dt))`.

## Depois de criar

Use a peça em pelo menos uma cena e rode o smoke test para ver como ela fica de
verdade (`.claude/skills/aristory-testar`). Peça que ninguém usa não entra no kit.
