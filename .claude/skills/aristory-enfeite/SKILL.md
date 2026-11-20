---
name: aristory-enfeite
description: Criar ou ajustar um enfeite (decoração) da estufa do AriStory — o que a lojinha da Josefina vende na aba de decorações e a dupla põe onde quiser, dentro da estufa ou no pátio de fora. Use quando pedirem "cria uma decoração nova", "mais um enfeite pra lojinha", "um enfeite do personagem X", "uma luminária que acende", "um enfeite que gira", ou para mexer num que já existe (preço, tamanho, cor, a pegada no chão, a luz).
---

# Criar um enfeite da estufa

> **Junto desta skill, carregue as `threejs-*` da tabela "REGRA DE TODA
> TAREFA" do `CLAUDE.md`** (`geometry`, `textures`, `lighting`). Elas são a técnica; esta é a regra do
> jogo. Peça feita só de caixa lisa é o jeito antigo.

Um enfeite custa **UMA função e UMA entrada de catálogo**, as duas em
`src/world/decoracoes.ts`, e as cores dele em `src/palette.ts`. Todo o resto sai
de graça, porque lê o catálogo:

| o quê | quem faz | você mexe? |
|---|---|---|
| o cartão da loja (nome, descrição, preço em 🌻, o cadeado até a onda) | `ui/lojaDaJosefina.ts` pelo `DECORACOES` | não |
| a foto do cartão | `retratoDaDecoracao` → `world/retrato.ts` fotografa o `monta()` | não |
| comprar (dos girassóis — o `Cofre` que a estufa passa), guardar, pôr, girar, mudar de lugar | `world/decorador.ts` | não |
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
    id: 'sapo', nome: 'Sapo de jardim', icone: '🐸', girassois: 6, onda: 4, artigo: 'o', raio: 0.24,
    descricao: 'Sentado de boca aberta, com uma coroinha. Esperando o beijo.',
    monta: sapoDeJardim,
  },
```

| campo | regra |
|---|---|
| `id` | kebab-case e **PARA SEMPRE**: o save guarda o enfeite pelo id. Renomear deixa órfão o que a dupla já comprou e pôs. Quer mudar o nome? Mude o `nome`, nunca o `id`. |
| `nome` | como aparece na loja e no "Mexer no…". Com o nome do personagem quando for dele ("Girafinha da Gina"). |
| `icone` | um emoji; aparece no toast e na barra de colocar. |
| `girassois` | o preço, em **girassóis 🌻** — a moeda da estufa, que SÓ a rodada do jardim paga (1 a cada 15 bichos espantados; `minigames/jardim/premios.ts`). Enfeite nunca custa reais: é o que amarra a lojinha ao jardim. Régua: simples 4–6, de personagem 6–11, com luz ou movimento 8–18. Para calibrar: perder na 6ª onda paga ~12 🌻, a rodada inteira ~150. |
| `onda` | a onda em que a Josefina passa a VENDER: o recorde da dupla tem que chegar lá (antes disso o cartão aparece com cadeado). `0` = à venda desde o começo. Espalhe: o catálogo de hoje chega em 0, 2, 4, 6, 8, 10, 13, 16, 20 e 25 — enfeite novo entra onde a prateleira está mais vazia, e o mais caro/vistoso vai mais longe. |
| `artigo` | `'o'` ou `'a'`: monta "Mexer **no** anão", "guardad**a**". Siga o NOME, não o bicho: "o Pelusa de pelúcia" (o Pelusa é macho), "a capivara". |
| `raio` | **a pegada no chão, em metros** — ver abaixo. |
| `descricao` | UMA frase para o cartão. Se o Renan deu o texto, vai literal. |
| `monta` | a função do passo 2. |
| `anima` | opcional: ver "enfeite que mexe". |

A lista é ordenada no fim (`.sort`) pela onda de chegada e depois pelo preço,
então a posição da entrada no arquivo é só de leitura. As ROUPAS da lojinha
seguem a mesma ideia, mas em reais e com a onda em `LOJA_ABRE`
(`premios.ts`) — isso é da skill de roupa, não desta.

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

## O quintal da casa do Ari (o mesmo decorador, outro lugar)

Desde a etapa 1 do `docs/QUINTAL.md`, o decorador mora em DOIS lugares: a
estufa e o quintal (`frente-da-casa`, escondido atrás da chave do Bebito
Mobile). O que mudou, e que vale para enfeite novo:

- `new Decorador(w, regras, cofre, cena)` — o 4º argumento é o lugar
  (`'estufa'` se faltar). Ele só monta e só grava os enfeites dali; o save
  guarda `posta.cena` (sem ela, é estufa: save antigo).
- **A ficha diz onde pode ir** (`cenas`): sem o campo, vai aos dois — o que
  a Josefina vende é enfeite de jardim, e cabe no quintal também. O do
  quintal diz `cenas: ['quintal']`.
- **O que se vende para o quintal é do Papita Delivery**, em REAIS, e mora
  em `world/decoracoesDoQuintal.ts` (`DECORACOES_DO_QUINTAL`, com `reais` e
  `categoria: 'plantas' | 'moveis'`), não em `DECORACOES`. O contrato da peça
  é o mesmo daqui. `decoracaoPorId` acha nos dois catálogos. Peça nova do
  quintal: uma função e uma entrada lá; o app do computador, o baú das
  ferramentas, o retrato e o save leem tudo de lá.
- **Planta do quintal** sai do kit (`world/plantasDeJardim.ts`), num lote de
  um pé só, dentro do `canteirinho()` de casca (decalque de beira torta,
  `renderOrder` 3 — o `quintal.mjs` não conta o decalque na pegada). A que
  balança usa o `VENTO_DO_QUINTAL`, que a cena faz andar.
- **O quintal usa a pegada e os colisores**: em 2026-11-13, Renan pediu
  o balanço perto do muro e em cima do caminho. Móveis e enfeites podem ocupar
  os caminhos, e não existe mais a faixa de 2,3 m para peças altas. Permanecem
  os limites físicos e a frente da porta e do portão. Pisos continuam respeitando o
  traçado fixo do caminho (trocado pelas ferramentas). O guarda-sol usa o raio
  do pé: a lona pode cobrir a mesinha de propósito.
- **O enfeite parado passa pela `fundir()`** quando o decorador o põe no
  chão (nos dois lugares); o que tem `anima` fica inteiro, porque ela acha as
  partes pelo `userData`. Peça que se mexe e quer ser leve: marque o pivô com
  NOME (`fundir` respeita grupo com nome) — mas aí a `anima` precisa ser
  testada com a peça fundida.
- **PISO** (`piso: true`, `world/pisosDoQuintal.ts`): o decorador não dá
  colisor, deixa enfeite por cima e piso cruzando piso, e o posto por último
  pinta por cima (ele troca o `renderOrder` de tudo que for `>= 4` na peça
  para `10 + n`). O chão do piso é decalque com `renderOrder` 4; o que tem
  altura (tábua, seixo, guia) é geometria rente. Piso só esbarra no que é do
  mundo (parede, casa, muro) e nas regras da cena (o caminho).
- **Caminho** (`caminho: '<jeito>'` na ficha do Papita) não é enfeite: não se
  põe pelo decorador. Ele é de vocês ou não é, e o baú troca o caminho da
  casa (`world/caminhosDoQuintal.ts`, traçado por TRECHOS retos).
- **A árvore da casa** é uma ficha do quintal fora da loja (`naLoja: false`):
  a cena a planta no save na primeira visita.
- **ENCAIXE** (etapa 3, `encaixe` na ficha): `parede` (costas em `z = 0`, o
  MEIO da peça em `y = 0`, e `alturaPadrao` é onde ela começa na mão — o Ari
  muda com ▲ ▼), `emCima` (base em `y = 0`, pequena: o tampo do muro tem 22
  cm), `pendurado` (a origem é o GANCHO, desce para `−Y`) e `pontaAPonta`
  (`montaEntre(a, b)` no mundo, `monta()` é o retrato — `amostraEntre`). A
  cena declara as superfícies (`Superficie`: uma linha no chão, a altura, a
  normal, os buracos) e as `amarras`. A peça de parede não pode ser mais alta
  que a faixa da parede. Peça que mexe pendurada: o sino de vento
  (`balancarSino`, pelo tempo).
- **`fundirComAnima: true`** (a piscininha e o fogo de chão): enfeite que se
  mexe E passa pela `fundir()`. Sem o campo, o decorador não funde o que tem
  `anima`. Vale só quando tudo que a `anima` mexe é malha de água, lote
  (`InstancedMesh`) ou grupo com NOME, e a anima guarda as referências em
  `userData` da raiz (a água em `userData.agua`, o fogo em `userData.fogo`...).
  A `anima` recebe `t` do decorador: peça que reage a uma interação (o chute
  na água, o fogo apagado) lê um sinal em `userData` que o `uso` escreve
  (`chutando`, `aceso`) — e não depende de o `uso` estar rodando, que ele
  para enquanto a pergunta está na tela.
- **MÓVEL DE USAR** (etapa 4, `uso` na ficha: `label`, `icon` e
  `usar(u)`): o decorador cria o ponto `usar:<uid>` na peça, que descansa nos
  modos de colocar e de editar. O `usar` (`world/moveisDeUsar.ts`) monta a
  âncora DENTRO da peça (ou do grupo com nome que balança — `balanco`,
  `rede`: a `fundir()` respeita grupo com nome), senta ou deita os dois,
  pergunta "Ficar mais um pouco?" e solta os dois na frente. A cena acha as
  peças por `decorador.pecas()` (a casinha do Pelusa, o que é `regavel`).
- `RegrasDoLugar.proibido(x, z, raio, ficha)` recebe a ficha (para a
  altura), e `ondeGuardar` muda o fim do toast de guardar ("pelas
  ferramentas da garagem").

Validar o do quintal: `node scripts/quintal.mjs /tmp/qt` (a pegada e a altura
de cada peça medidas no mundo, as regras, o peso e a mesma imagem com e sem
`?semFundir`).

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
