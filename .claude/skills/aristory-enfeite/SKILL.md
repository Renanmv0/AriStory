---
name: aristory-enfeite
description: Criar ou ajustar um enfeite (decoração) da estufa do AriStory — o que a lojinha da Josefina vende na aba de decorações e a dupla põe onde quiser, dentro da estufa ou no pátio de fora. Use quando pedirem "cria uma decoração nova", "mais um enfeite pra lojinha", "um enfeite do personagem X", "uma luminária que acende", "um enfeite que gira", ou para mexer num que já existe (preço, tamanho, cor, a pegada no chão, a luz).
---

# Criar um enfeite da estufa

Um enfeite custa **UMA função e UMA entrada de catálogo**, as duas em
`src/world/decoracoes.ts`, e as cores dele em `src/palette.ts`. Todo o resto sai
de graça, porque lê o catálogo:

| o quê | quem faz | você mexe? |
|---|---|---|
| o cartão da loja (nome, descrição, preço) | `ui/lojaDaJosefina.ts` pelo `DECORACOES` | não |
| a foto do cartão | `retratoDaDecoracao` → `world/retrato.ts` fotografa o `monta()` | não |
| comprar, guardar, pôr, girar, mudar de lugar, guardar de novo | `world/decorador.ts` | não |
| o fantasma translúcido e o anel verde/vermelho | `world/decorador.ts` | não |
| onde pode e onde não pode | `regrasDoLugar` em `scenes/estufa.ts` | só se a PLANTA mudar |
| o save | `SaveState.decoracoes` (`{ uid, id, posta }`) | não |
| a Josefina e os ajudantes desviarem | `decorador.circulos()` → `obstaculosDoPasseio` | não |

Se a tarefa parecer pedir mexer em alguma coisa da coluna "não", pare e
releia: provavelmente não pede.

## Os três passos

### 1. As cores — `src/palette.ts`, no bloco "OS ENFEITES DA ESTUFA"

```ts
  // o sapo de jardim: verde-limão de gesso pintado, a boca e a coroa
  enfeiteSapo: 0x7cc04f,
  enfeiteSapoBarriga: 0xe9f2b8,
```

Nome começando por `enfeite…` e um comentário dizendo de onde a cor veio.
Enfeite de PERSONAGEM reaproveita a cor que o bicho já tem na paleta
(`P.cachorroPelo`, `P.pelusaCinza`, `P.girafaPelo`, `P.tartarugaCasco`…): o
Walter de cerâmica e o Walter do Mania têm que ser o mesmo caramelo.
**Cuidado com o cabelo do Ari**: `#a9713f` (as mechas claras) é quase o
`cachorroOrelha`. Enfeite de tom caramelo no chão não tem esse problema, mas
na roupa já sumiu uma orelha inteira por isso.

### 2. A geometria — uma função em `decoracoes.ts`, na seção "as peças"

```ts
/** O sapo de jardim: sentado, boca larga e uma coroinha dourada. */
function sapoDeJardim(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'enfeite-sapo';          // o teste e a oclusão acham a peça por aqui
  const verde = toon(P.enfeiteSapo);
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), verde);
  corpo.scale.set(1.1, 0.8, 1);
  corpo.position.y = 0.13;                    // a BASE em y = 0: nada abaixo do chão
  g.add(corpo);
  // …olhos, boca, patas; a FRENTE olha para +Z
  return g;
}
```

**O contrato** (o mesmo do kit de `props.ts`):

- **Base em `y = 0`, centrado na origem, frente para `+Z`.** O giro do modo de
  colocar gira em volta do centro: peça descentrada gira "orbitando".
- **Devolve um grupo NOVO a cada chamada.** `monta()` roda para a peça do
  chão, para o fantasma na mão e para o retrato — um `Object3D` não tem dois
  pais.
- **Material só por `toon()`/`flat()`** com cor da paleta. Parte que brilha
  (lâmpada, janela acesa): `toon(cor, { glow: 0.85 })`.
- **Sem colisor e sem tocar no mundo.** Quem põe colisor, ponto de interação e
  save é o decorador.
- **`userData.peca = 'enfeite-<algo>'`.** É por esse nome que os testes acham a
  peça na cena.
- **Nada de face coplanar**: duas faces no mesmo plano serrilham (z-fighting).
  Tampa sobre corpo, olho sobre cabeça, tudo com 2–5 mm de folga. O
  `zfighting.mjs` NÃO varre `decoracoes.ts`, então isso é olho seu.
- **Baixo é melhor.** A câmera olha de cima e de `+X/+Z`: até ~1,2 m está bom
  (a lanterninha tem 1,16, o flamingo 1,09). Acima de 1,4 o `enfeite.mjs` avisa
  — o enfeite tapa a dupla quando ela passa atrás dele.
- **Tamanho de enfeite, não de móvel.** A régua: anão 0,71 m, Walter de
  cerâmica 0,5, banquinho 0,85. A dupla tem ~1,7.

### 3. A ficha — uma entrada em `DECORACOES`

```ts
  {
    id: 'sapo', nome: 'Sapo de jardim', icone: '🐸', preco: 32, artigo: 'o', raio: 0.24,
    descricao: 'Sentado de boca aberta, com uma coroinha. Esperando o beijo.',
    monta: sapoDeJardim,
  },
```

| campo | regra |
|---|---|
| `id` | kebab-case e **PARA SEMPRE**: o save guarda o enfeite pelo id. Renomear deixa órfão o que a dupla já comprou e pôs. Quer mudar o nome? Mude o `nome`, nunca o `id`. |
| `nome` | como aparece na loja e no "Mexer no…". Com o nome do personagem quando for dele ("Girafinha da Gina"). |
| `icone` | um emoji; aparece no toast e na barra de colocar. |
| `preco` | em reais, a carteira do casal. Régua de hoje: simples 20–35, com personagem 30–55, com luz ou movimento 40–90. (Bilhete da roda = 24; um turno do Walter paga ~200; uma rodada do jardim paga 3 por onda.) |
| `artigo` | `'o'` ou `'a'`: monta "Mexer **no** anão", "guardad**a**". Siga o NOME, não o bicho: "o Pelusa de pelúcia" (o Pelusa é macho), "a capivara". |
| `raio` | **a pegada no chão, em metros** — ver abaixo. |
| `descricao` | UMA frase para o cartão. Se o Renan deu o texto, vai literal. |
| `monta` | a função do passo 2. |
| `anima` | opcional: ver "enfeite que mexe". |

A lista é ordenada por preço no fim (`.sort`), então a posição da entrada no
arquivo é só de leitura: jardim, simples, de personagem.

## A pegada (`raio`) — o número que mais erra

`raio` é o círculo que o enfeite ocupa no chão. Com ele o decorador decide se
cabe (não encosta em canteiro, parede, árvore nem em outro enfeite), desenha o
anel verde, e dá o colisor da dupla (`0,75 · raio`, para ela chegar perto).

**Meça a peça, não chute.** O `enfeite.mjs` imprime "vai até X m" — o vértice
mais longe do centro, sem contar a luz — e reprova se a peça passa da pegada
mais do que um palmo (`raio · 1,35 + 8 cm`). Já pegou um erro real: a tromba do
elefantinho ia a 0,51 m com `raio: 0.28`, e outro enfeite podia nascer em cima
dela. Tromba, rabo, asa, cabo, varal: é a ponta que manda.

E o outro lado: raio GRANDE demais faz o enfeite recusar lugar que visivelmente
cabe. Mira em "vai até" entre `1,0` e `1,3 × raio`.

## Enfeite que ACENDE (luz sem luz)

Nada de `PointLight`: cada luz nova recompila o shader da cena inteira e pesa
no celular. A luz aqui é falsa e barata, com dois ajudantes que já estão em
`decoracoes.ts`:

```ts
  const halo = haloDeLuz(0.75);   // o brilho em volta da lâmpada, sempre de frente para a câmera
  halo.position.y = 0.88;         // na altura da parte acesa
  g.add(halo);
  g.add(pocaDeLuz(1.1));          // a poça quente no chão; pocaDeLuz(raio, alonga) estica em x
```

A parte acesa leva `toon(cor, { glow: 0.85 })`. Referências: `lanternaDeJardim`
(um halo e uma poça) e `varalDeLuzinhas` (sete halos pequenos e uma poça
alongada). A poça **não conta na pegada** (o `enfeite.mjs` pula), então um
enfeite pequeno pode clarear um chão grande.

## Enfeite que MEXE (`anima`)

```ts
  const helice = new THREE.Group();
  g.add(helice);
  g.userData.helice = helice;              // a peça marca o que gira…

function girarHelice(peca: THREE.Object3D, t: number): void {
  const h = peca.userData.helice as THREE.Object3D | undefined;
  if (h) h.rotation.z = t * 3;             // …e a anima acha por lá
}
// na ficha: anima: girarHelice,
```

- O decorador chama `anima(peca, t)` todo quadro, para cada enfeite no chão
  **e para o fantasma na mão**. `t` é em segundos.
- Escreva em função de `t` (`rotation = t · velocidade`), nunca acumulando
  (`rotation += …`): o fantasma e o posto têm que girar igual.
- Chame a própria anima no fim do `monta` com `t = 0` se a posição inicial
  depender dela (a roda gigante faz isso).
- **Coisa pendurada não vira de cabeça para baixo**: as cabines da
  `rodaGiganteMini` ficam FORA do grupo que gira e só são reposicionadas. O
  mesmo truque da roda gigante de verdade (`ferrisWheel.ts`).
- Referências: `cataVento` (a anima dele vem escrita na própria ficha, é uma
  linha) e `rodaGiganteMini`/`girarRoda` (a anima numa função própria, porque
  é maior).

## Enfeite de personagem ou de lugar real

Os de hoje: tartaruguinha da Josefina, Pelusa de pelúcia, copão do Noel,
casquinha do Mano, Walter de cerâmica, elefantinho do Cookie, capivara (o Capy),
girafinha da Gina, laguinho do Jean-Luc, rodinha gigante (o Villa Lobos).

- **Pegue o traço que faz o personagem ser ELE** (a gravatinha do Walter, o
  óculos escuro do Capy, a boina do Jean-Luc, o quepe do Cookie) e deixe o
  resto simples. Enfeite é miniatura: dois detalhes certos valem mais que dez.
- Cor da paleta do próprio bicho (ver o passo 1).
- Fato sobre gente ou lugar REAL que você não sabe (a cor de alguma coisa na
  casa deles, como é um lugar): **pergunte ao Renan**, não invente
  (`docs/PERSONAGENS.md` responde parte disso antes).

## Onde ele pode ir (e por que você quase nunca mexe nisso)

`regrasDoLugar` em `scenes/estufa.ts` já cobre a estufa inteira e o pátio de
fora. Os bichos da rodada atravessam enfeite (nunca leram colisor), e da hora
dos postos ao fim da rodada o enfeite perde o colisor da dupla também
(`decorador.intangivel`). Então enfeite novo não precisa de regra nova. Só mexa
em `regrasDoLugar` se a estufa ganhar uma peça fixa nova que precise de espaço
livre na frente (um balcão, um posto de NPC).

Os PRÊMIOS da estufa (a plaquinha das 5 ondas, o regador de ouro das 30) não
são enfeites de loja: são peças do kit (`props.ts`) que a cena monta por
flag. Enfeite de loja se compra, se põe e se guarda; prêmio fica no lugar dele.

## Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/enfeite.mjs /tmp/en sapo    # o seu: pegada, altura, cartão e duas fotos
node scripts/enfeite.mjs /tmp/en         # o catálogo inteiro em fila (depois de mexer no que é comum)
node scripts/decorar.mjs /tmp/dc         # a lojinha e o modo de colocar/editar inteiros
```

O `enfeite.mjs` compra e põe o enfeite pelo modo de colocar DE VERDADE (a mesma
barra da dupla) e confere que ele ficou no chão, que o cartão tem retrato, e a
pegada. **Olhe as três fotos antes de dar como pronto**:

- `-perto.png` — de perto, com a dupla do lado: a escala está certa? Lê como o
  que é?
- `-girado.png` — do outro lado: enfeite tem costas, e é lá que aparece o
  buraco, a peça solta, a face serrilhando.
- `-cartao.png` — o retrato do cartão: centralizado, inteiro e reconhecível
  num quadradinho de 90 px? Enfeite cinza e baixo lê como pedra (o Pelusa de
  pelúcia teve que ganhar cabeça grande e patas brancas por isso).

Enfeite com luz: confira a poça e o halo na foto. Enfeite que mexe: tire duas
fotos com um segundo de diferença, ou meça a rotação como a seção 7b do
`decorar.mjs` faz com a roda.
