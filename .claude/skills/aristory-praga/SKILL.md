---
name: aristory-praga
description: Criar ou ajustar uma praga do minigame do jardim do AriStory — os bichos-quimera que invadem a estufa da Josefina (lagarta com pinça de caranguejo, tucano com corpo de canguru). Use quando pedirem "cria um inimigo novo pro minigame", "mais um bicho pra estufa", "muda a cor/o tamanho/a cara de uma praga", ou para balancear encharque e tier.
---

# Criar uma praga do jardim

Praga é **inimigo do minigame da estufa**, e não bicho de cenário. Se o pedido
for um gato que passeia pela casa e aceita carinho, a skill é a
`aristory-bicho` — outro arquivo, outra classe, outro contrato.

Tudo o que é praga mora em **um arquivo só**: `src/world/bichosDoJardim.ts`.
Uma função por bicho, mais o catálogo `PRAGAS` no fim. O plano do minigame está
em `docs/MINIGAME-JARDIM.md` §5; o teste é `scripts/pragas.mjs`.

```
src/world/bichosDoJardim.ts   a geometria de cada praga + o catálogo PRAGAS
src/palette.ts                a cor de cada uma (bloco `praga*`)
scripts/pragas.mjs            enfileira as seis, fotografa e MEDE
docs/MINIGAME-JARDIM.md §5    o elenco, o que cada uma faz, e por quê
```

Aqui é **só geometria**: a praga não sabe que existe uma rodada. Quem faz ela
andar, comer e fugir é `minigames/jardim/rodada.ts` — a velocidade, a mordida e
o raio de cada uma estão na tabela `JEITO` do topo dele, e em qual onda cada
uma entra está em `ONDAS` (`progressao.ts`). **Praga nova no jogo = a ficha
aqui + uma linha em `JEITO` + entrar numa onda.** Hoje as seis andam do mesmo
jeito; o comportamento próprio de cada uma (§5 do plano) ainda não existe.

---

## 1. Por que elas são quimeras, e não bichos

Esta é a decisão de design mais importante do minigame, e ela é do Renan com o
Ari: **bicho normal levando jato de água dá dó**, e jogar com pena de quem está
do outro lado estraga a rodada. Um coelho comum na mira do regador vira um
problema moral no meio de um jogo leve.

A saída foi anomalia sem terror: **animal com parte de outro animal**. Um bicho
que é metade lagarta e metade caranguejo não é ninguém — é uma praga, e enxotar
praga do canteiro dos outros é uma coisa boa de fazer.

**Três regras que saem daí, e nenhuma é negociável:**

1. **Nenhum bicho com nome entra na receita.** O Capy é capivara, a Josefina é
   tartaruga, o Noel é peru, o Jean-Luc é pato, o Walter é cachorro, o Pelusa é
   gato, o Cookie, a Gina, a Estella, o Mano. Eles são **gente**, e gente não
   vira alvo — usar qualquer um como metade de uma praga faria o jogador regar
   uma caricatura de alguém de quem ele gosta.
2. **A mistura tem que ser lida em dois segundos.** "Lagarta + caranguejo" só
   funciona porque as duas metades ocupam partes DIFERENTES da silhueta: o corpo
   segmentado é a massa, as pinças são o recorte. Duas metades disputando a
   mesma parte (corpo de urso com corpo de javali) não lê como quimera, lê como
   desenho errado.
3. **Malvado, mas não assustador.** Eles são malvados pelo que **fazem** — vêm
   comer a horta —, pela garra laranja e pelo jeito de andar. Não precisa estar
   na cara. Ver §4.

As dez metades já usadas: lagarta, caranguejo, gafanhoto, sapo, coelho, tatu,
tucano, canguru, preguiça e polvo. Nenhuma pertence a ninguém.

---

## 2. O contrato de toda praga

Copie a mais parecida com o que você vai fazer, e mantenha o contrato:

```ts
export function gafanhopo(escala = 1, semente = 0.5): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'gafanhopo';        // a etiqueta, para os testes acharem
  const e = escala;                      // TUDO é multiplicado por `e`
  // ele nasce olhando um tico de lado, para uma fila deles nao virar um pente
  g.rotation.y = (semente - 0.5) * 0.14;
  // ...
  g.userData.partes = { corpo, pernas }; // o que o minigame vai animar
  return g;
}
```

- **Base em `y = 0`, centrada em `x = 0, z = 0`, olhando para `+Z`.** É o
  contrato do kit inteiro. Bicho que nasce enterrado só aparece quando já está
  andando numa onda, e aí é tarde — o teste mede isso.
- **`escala` multiplica tudo.** Nunca escale o `Group` por fora: o minigame
  precisa que a peça nasça no tamanho certo.
- **`semente` desalinha.** Um giro pequenininho (`(semente - 0.5) * 0.14`) faz
  cinco iguais na tela pararem de parecer um pente.
- **`userData.partes`** publica o que se mexe (pernas, pinças, braços, cabeça),
  para o minigame animar sem varrer a árvore.
- **Cor só de `src/palette.ts`, material só de `toon()`.** Como em todo o resto
  do jogo.

---

## 3. O tamanho conta o tier; a barra de vida conta o número

Com cinco na tela, ninguém lê "preguiça com braço de polvo" — lê **tamanho**.

```ts
const ESCALA_DO_TIER = { fraco: 0.72, medio: 1, tanque: 1, chefe: 1 } as const;
```

**Bicho fraco é um bicho pequeno**: a mesma peça, encolhida. Um Lagartejo de
38 cm ao lado de um Coelhatu de 1 m dispensa explicação. A régua completa, que
o teste cobra:

| tier | como ele é | referência de hoje |
|---|---|---|
| **fraco** | baixo e rasteiro, **abaixo de 2/3 do médio mais baixo** | 0,38 e 0,44 de altura |
| **médio** | altura de joelho, com uma saliência única (orelha, bico) | 1,01 e 1,23 |
| **tanque** | o mais **LARGO** da turma — largura lê como peso | 2,1 de envergadura |
| **chefe** | o mais **ALTO** e o mais comprido | 1,36 de altura |

Quanta água ainda falta quem diz é a **barra de vida em cima da cabeça**, que o
minigame desenha. Por isso cada ficha traz `alturaDaBarra`, em metros do chão:
abaixo do topo a barra atravessa o bicho, alto demais ela desgruda e vira
legenda solta. A folga útil é de **8 a 45 cm acima da peça**, e o teste confere.

**Teto de malhas, porque o jogo roda em celular com vários deles na tela:**
45 para fraco e médio, 70 para tanque, 90 para chefe. Já custou uma rodada de
conserto: o Preguipolvo nasceu com 73 malhas porque tinha 4 ventosas por braço
vezes 6 braços. Foram para 3.

---

## 4. A CARA — leia isto antes de desenhar qualquer olho

A primeira leva tinha **sobrancelha em cunha** por cima de cada olho, para dizer
"bravo" sem rosto. Na tela ela não leu como sobrancelha: leu como uma **faixa
preta atravessando o olho**, e os bichos ficaram assustadores — que é o oposto
do que este minigame quer ser. O Renan mandou tirar.

Hoje é `olhoRedondo(raio)`: globo claro, pupila redonda, e mais nada.

```ts
const pupila = new THREE.Mesh(new THREE.SphereGeometry(raio * 0.5, 8, 6), PUPILA());
pupila.position.z = raio * 0.86;   // o polo dela vai a 1,08 — SOBRA do globo
pupila.scale.z = 0.45;
olhar.add(pupila);                 // `olhar` é um grupo com rotation.x = -0.45
```

**Duas contas, e as duas já foram bug real:**

- **A pupila tem que SOBRAR do globo.** A primeira era raio 0,56 achatada a
  0,31 em `z = 0,6`: o polo parava em `0,91` contra `1,0` do globo, ou seja,
  ficava **inteira por dentro**. O que aparecia era um pontinho escuro vazando
  por uma faceta, e os bichos tinham dois olhos de bola de gude. E a folga
  precisa ser generosa, porque uma esfera de 10 gomos é um poliedro: a face do
  meio fica em `0,95`, e não em `1,0`.
- **A pupila sobe 0,45 rad.** A câmera olha de 34° de cima e vê a calota
  SUPERIOR do olho; no equador a pupila some atrás da própria testa do globo.
  Levantada, ela cai bem no meio do que a câmera enxerga.

**E ela nunca vira para DENTRO.** Pupila convergindo deixa o bicho vesgo de
qualquer ângulo, e vesgo lê como bobo — não como ameaça.

---

## 5. A cor: uma por praga, e brigando com o chão

Não existe família única de cor, e isso foi uma correção do Renan olhando a
primeira leva: **seis tons do mesmo roxo viram uma mancha escura só** com cinco
na tela, e aí o jogador sabe que vem praga mas não sabe QUAL.

| praga | cor | entrada na paleta |
|---|---|---|
| Lagartejo | roxo | `pragaLagartejo` / `…Escuro` |
| Gafanhopo | turquesa | `pragaGafanhopo` / `…Escuro` |
| Coelhatu | ferrugem, placas creme | `pragaCoelhatu` + `pragaCoelhatuCasco` |
| Tucanguru | azul, bico amarelo | `pragaTucanguru` + `pragaTucanguruBico` |
| Preguipolvo | musgo | `pragaMusgo` / `…Escuro` |
| Mãe-Lagartejo | vinho | `pragaMae` / `…Escura` / `…Crosta` |

**As três regras de cor:**

1. **Cada praga com a SUA.** O teste reprova duas com a mesma cor principal (a
   que pinta mais malhas). Praga nova precisa de tom novo, não de uma variação
   de um que já existe.
2. **Nenhuma cor de praga existe num canteiro.** O verde tem que ser sujo ou
   azulado (a folha é limpa), o roxo acinzentado (a lavanda é clara e saturada).
   Praga não pode nunca se confundir com planta.
3. **Ela também briga com o CHÃO.** O primeiro terracota do Coelhatu
   (`0xb5774c`) era quase o piso do terreiro, e na foto o bicho sumia no chão.
   Desceu para um ferrugem escuro e as placas subiram para um creme mais claro
   que o piso.

O que as seis dividem é só três coisas: `pragaOlho` e `pragaPupila`,
`pragaBarriga` (o claro do papo, do focinho, da ventosa) e **`pragaGarra`**, o
laranja de aviso que diz "isto machuca a planta" — pinça, unha, dente, bico.

---

## 6. A ficha, no catálogo

```ts
{
  id: 'gafanhopo', nome: 'Gafanhopo', tier: 'fraco',
  mistura: 'gafanhoto + sapo', encharque: 2, alturaDaBarra: 0.74, gotas: 1,
  monta: (e = 1, s) => gafanhopo(ESCALA_DO_TIER.fraco * e, s),
},
```

- **`encharque`** é quantos jatos do regador BÁSICO ele aguenta. Ele **tem que
  subir junto com o tier** — o teste reprova um fraco que aguente tanto quanto
  um médio, porque aí a ficha mente para o jogador.
- **`gotas`** é a experiência que ele solta ao ser espantado, e **sobe com o
  tier** junto com o encharque (fraco 1, médio 2–3, tanque 8, chefe 25). O
  `scripts/cartas.mjs` reprova um tier que pague menos que o de baixo, e mede
  se a rodada inteira ainda termina perto do nível 10 — praga nova numa onda
  mexe nessa conta (a curva mora na skill `aristory-habilidade`).
- **`monta` já aplica a escala do tier.** O argumento multiplica por cima, para
  quem quiser uma variação grande de um bicho pequeno.
- O elenco cresce como o do Mania: **cada praga é uma linha nesta lista**. Praga
  nova é uma entrada nova, não uma mexida no motor.

---

## 7. Erros que já custaram uma rodada de foto

Todos foram achados **olhando**, e nenhum por medição — por isso a foto não é
opcional (§8).

- **Peça enterrada.** O Tucanguru nascia 8,7 cm no chão porque a altura do
  quadril era um chute. Ela tem que sair da CONTA do pé: se o pé é uma cápsula
  de raio 0,06 centrada 0,31 abaixo do quadril, a sola fica em `quadril - 0,37`.
- **Metade da quimera invisível.** As placas do Coelhatu tinham o topo em 0,57
  contra 0,62 do dorso: ficavam DENTRO da barriga, e a metade "tatu"
  simplesmente não existia na tela. Peça de casco tem que passar do dorso **e**
  do contorno lateral — é um anel por fora do corpo, não um adesivo.
- **Só uma orelha.** Com 0,3 rad de queda para trás, a orelha de trás sumia
  atrás do crânio na vista de cima. Quase na vertical e abertas em V, as duas
  sobram de qualquer ângulo.
- **A pegadinha do sinal** (a mesma do `CLAUDE.md`): as orelhas do Coelhatu
  cruzavam em X, porque `rotation.z = s * 0.34` empurra a peça do lado NEGATIVO
  para DENTRO. Qualquer peça que se abra para os lados usa `s * -0.34`.
- **Perna escondida dentro do corpo.** A coxa do Gafanhopo tinha o topo em 0,43
  contra 0,47 do dorso e sumia na barriga. Gafanhoto tem o fêmur espetado acima
  das costas, e é essa saliência que promete o salto — o joelho precisa **passar
  do dorso**, e a perna sair mais para fora (0,3 contra 0,22 de meia-largura).
- **Antena que vira orelha.** As primeiras tinham 30 cm e liam como orelha de
  morcego. Finas (0,009) e curtas (0,22).
- **Boca que some de perfil.** Uma fenda na cara da frente fica de perfil na
  câmera de 34° e desaparece. Deitada `-0.55` ela mostra a face de cima.
- **Tentáculo tracejado.** Os braços do Preguipolvo eram bolinhas soltas: o
  passo entre gomos (0,175) era maior que o diâmetro deles na ponta (0,09). A
  ponta afina menos, o braço encurta, e o passo passa a caber no diâmetro.
- **Calota chapada lendo como tampa.** Uma crosta muito clara nas costas parece
  um objeto de outro material pousado ali. Ela tem que ficar na família de cor
  do bicho.

---

## 8. Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/pragas.mjs /tmp/pg
```

Nenhuma praga está numa cena: **sem este script não haveria como olhar para
elas**, e praga que não se consegue olhar não se consegue ajustar. Ele enfileira
as seis no terreiro da estufa, tira um retrato de cada uma, uma foto da fila e
uma da fila girada.

Ele **mede pela geometria desenhada** — os oito cantos da caixa de cada malha
levados para o mundo —, e não por raio inventado. Isso não é preciosismo: já
passaram verde dois defeitos que estavam na tela porque o teste media colisor.

O que ele cobra: base em `y = 0` e centrada; nenhuma grande demais para o
terreiro; o teto de malhas do tier; a régua de tamanho do §3; **nenhuma
repetindo a cor principal de outra**; a barra de vida cabendo em cima da cabeça;
o encharque subindo com o tier; e nenhuma encostando na outra na fila.

**A foto é obrigatória antes de dar a praga como pronta** (regra do
`CLAUDE.md`), e a lista do §7 é a prova: todos aqueles defeitos passaram pela
medição e só apareceram no olho. Olhe o retrato **e** a foto girada — bicho que
só funciona de frente não existe num jogo onde a câmera roda com `Q`/`R`.

Se a praga tiver caixa (`BoxGeometry` sem rotação), rode também
`node scripts/zfighting.mjs`. As seis de hoje são quase todas esfera e cápsula,
então o detector não tem o que medir nelas — por isso elas não estão na lista
dele.

---

## 9. Depois de criar

Atualize **§5 do `docs/MINIGAME-JARDIM.md`**: a tabela do elenco (mistura, cor,
tier, altura, encharque, o que o bicho faz de diferente) é o que o Renan lê para
decidir o balanceamento, e o plano desencontrado do código é pior que plano
nenhum. E lembre que, enquanto o minigame não existir, a praga nova é **só um
modelo** — diga isso ao entregar.
