# A Escola do Gatito — plano do cenário

> Documento de PROJETO. **Nada disto está no jogo ainda**: é o plano que o
> Renan pediu antes de construir. Quando uma etapa (§12) entrar, marque-a
> aqui, e deixe o `git log` ser a fonte da verdade do que de fato existe.
>
> "Escola do Gatito" é nome **provisório** — o nome de verdade é a primeira
> pergunta do §13.

## ⭐ COMECE AQUI — o plano em uma página

**O pedido.** O Ari é da Venezuela, mora no Brasil perto do Renan, fala
espanhol e inglês perfeitamente e está aprendendo português. Às vezes o Renan
dá aula para ele **fingindo ser o Gatito**, um gato de pelúcia que eles têm em
casa. A próxima área do jogo é uma **escola de cursos**: grande, espaçosa, com
várias salas — **sala de descanso, cafeteria, salas de aula e sala dos
professores** — e o Gatito é um professor da escola, engraçadinho e
bonitinho.

**A ideia que amarra tudo.** Quem joga o AriStory é o Ari de verdade. Então a
aula do Gatito no jogo **é uma aula de português de verdade**: o conteúdo sai
do que o Renan ensina em casa (§6). A escola é o cenário; a aula é o presente.

**Estado: construída e aberta, ainda sem aula.** O saguão com o corredor e o
refeitório, as cinco salas atrás das portas (Sala 1 de português, Sala 2 de
espanhol, descanso, professores e ginásio) e o Gatito já estão no jogo
(`scenes/escola*.ts`, `entities/bichos/Gatito.ts`). Chega-se de ônibus,
depois de conhecer a **Luna** no Villa Lobos (§10, §14). A aula (§6), as
etiquetas (§5) e a formatura (§7) ainda não existem. Para testar sem jogar a
missão, `?cena=escola` continua valendo.

**O que este plano propõe** (tudo provisório até o Renan aprovar):

- **um andar só, grande**: 36 × 24, o dobro do Mania de Churrasco, com um
  corredor atravessando o prédio e as salas dos dois lados (§3);
- as divisórias de dentro são **meias-paredes** de ~1,1 m, o "corte de casa
  de bonecas" — é o que deixa a câmera isométrica ver todas as salas ao mesmo
  tempo (§3.2);
- **oito áreas**: recepção, corredor, cafeteria, sala de descanso, Sala 1
  (português, a do Gatito), Sala 2, sala de conversação e sala dos
  professores (§4);
- **placas bilíngues**: o nome da sala em português, grande, e em espanhol
  embaixo, pequeno — a escola já ensina só de andar por ela (§4);
- o Gatito é um **bicho** (`entities/bichos/Gatito.ts`), do tamanho de uma
  pelúcia grande. Ele **não anda: pula**, como pelúcia carregada; e na aula
  fica **em cima da mesa do professor** (§2);
- **etiquetas** com o nome em português coladas nos objetos da escola, que
  viram palavras num **caderno** (§5);
- a **Aula do Gatito**: lições curtas de perguntas, com estrelinhas, e errar
  nunca pune — o Gatito corrige com carinho (§6);
- no fim do curso, a **formatura**, com diploma pendurado no quarto do Ari
  (§7).

**O que falta saber do Renan** está no §13 — o nome da escola, a voz do
Gatito, o que ele ensina de verdade, quem trabalha na cafeteria e como se
chega lá.

---

## 1. A ideia

Não é escola de prova e nota vermelha: é um **curso livre aconchegante**, com
cheiro de café, onde errar é engraçado. A regra do jogo continua a mesma —
nada de derrota.

Três coisas separam este cenário dos outros:

1. **ele é o primeiro lugar que ensina alguma coisa a quem joga.** O parque, o
   clube e a estufa são lugares de passear e brincar; a escola tem uma
   atividade que muda a pessoa do outro lado da tela;
2. **ele é o primeiro interior com muitas salas.** A casa do Ari tem três
   cômodos, o Mania tem dois (cozinha e salão). Aqui são oito áreas, e a
   planta inteira precisa caber na câmera isométrica sem uma sala tapar a
   outra (§3.2);
3. **o professor já existe na vida real.** O Gatito é uma pelúcia de verdade,
   da casa deles, e a voz dele é a do Renan quando dá aula. O modelo sai das
   fotos; o jeito de falar tem que sair do Renan (§13).

---

## 2. O Gatito

### 2.1 Como ele é (das três fotos que o Renan mandou)

As fotos **não entram no repositório** (invariante de zero asset). A descrição
abaixo é a referência — quem for modelar lê isto, e não precisa das fotos.

Uma pelúcia **deitada de barriga**, comprida como travesseiro de abraçar:
cabeça grande e redonda na frente, corpo de pão de forma atrás, as quatro
patas esticadas (as da frente para a frente, as de trás para trás).

| parte | como é |
|---|---|
| **corpo** | creme-branco, comprido, macio, sem pescoço — a cabeça encosta direto no corpo |
| **cabeça** | redonda e um pouco achatada, quase da largura do corpo. **Duas cores divididas por uma costura vertical**: um lado todo creme, o outro todo **caramelo**, da orelha até a bochecha |
| **orelhas** | pequenas, de ponta arredondada, bem separadas. **Uma de cada cor**: a do lado caramelo é caramelo, a do lado creme é **chocolate** |
| **olhos** | dois pontinhos pretos bordados, pequenos e bem afastados |
| **nariz** | pretinho, pequeno, em triângulo de ponta redonda |
| **boca** | um "w" bordado em preto, largo, sorrindo |
| **a linguinha** | **rosa, para fora** — é a marca dele. Se só um detalhe do rosto ficar bom, que seja este |
| **bigodes** | três riscos pretos de cada lado, na bochecha (os do lado caramelo, em cima do caramelo) |
| **manchas do corpo** | cada lado tem a sua cor: o lado da **cara caramelo** tem uma **mancha caramelo no ombro**; o lado da **orelha chocolate** tem uma **mancha chocolate no lombo, perto do quadril** |
| **rabo** | caramelo, fino, saindo do alto do traseiro e subindo em gancho |
| **patas** | quatro tocos brancos, sem dedo nenhum |
| **tecido** | veludo liso (não é pelo de bolotas como a Estella) |

**Os lados, dito do jeito que não erra:** olhando o Gatito **de frente**, a
metade caramelo da cara e a orelha caramelo ficam **à direita de quem olha**;
a orelha chocolate, à esquerda. Esquerda e direita já custaram quatro bugs a
este projeto (ver `CLAUDE.md`) — por isso o teste do §12 mede de que lado a
mancha ficou, em vez de só fotografar.

Cores de partida para a paleta (conferir na foto do jogo, porque o toon
clareia): creme `0xefe8da`, caramelo `0xc98a5c`, chocolate `0x5e4a3f`,
língua `0xe07a8e`, bordado `0x1e1a1c`.

### 2.2 Tamanho

Pelas fotos, a pelúcia de verdade deve ter uns 60–70 cm (chute meu). No jogo ela cresce um pouco para ser
lida pela câmera: **~0,9 de comprimento e ~0,45 de altura** (com a orelha),
batendo no joelho da dupla. Na aula ele fica **em cima da mesa do professor**
(0,76), e aí a cabeça dele chega na altura do peito de quem está sentado —
que é a altura de um professor olhando a turma.

Um Gatito gigante (do tamanho da dupla) também seria engraçado, mas deixa de
ser a pelúcia da casa deles. Recomendo o tamanho de pelúcia; a decisão é do
Renan (§13).

### 2.3 Como modelar — o que o projeto já pagou para aprender

- **A costura da cara é uma costura de verdade.** A cabeça são **duas calotas
  de esfera** (`SphereGeometry` com `phiStart`/`phiLength`) que se encontram
  num meridiano, uma creme e uma caramelo. Nenhuma sobrepõe a outra, então
  não há z-fighting — e é exatamente como a pelúcia é costurada.
- **Bordado é decalque, não bolinha.** Olho, nariz, boca, bigode e língua são
  planos, colados na cabeça: material com `{ decal: true }` mais
  `renderOrder` (ver `ToonOptions.decal` em `core/materials.ts`). Olho de
  esfera saltada vira olho de bicho de verdade, e o Gatito é bordado.
- **Mancha de corpo é faixa baixa, não segundo corpo** (lição do Pelusa, na
  skill `aristory-bicho`).
- **Elipsoide, não cápsula girada** — a mesma lição do Pelusa: o corpo é
  `SphereGeometry(1)` com `scale`.
- **Rabo em gomos encadeados**, com a curva em gancho.
- **Não pode parecer o Pelusa.** O Pelusa também é creme de gato. O que separa
  os dois de longe: a meia cara caramelo, as orelhas de duas cores, a silhueta
  de pão deitado (o Pelusa anda de pé) e o pulinho (§2.4).

A casa já tem uma pelúcia modelada — o enfeite "Pelusa de pelúcia" em
`world/decoracoes.ts` — e vale olhar antes de começar.

### 2.4 O jeito: pelúcia não anda, pula

O Gatito usa o cérebro pronto de `entities/bichos/Bicho.ts` (passear,
contornar móvel, fazer barulho, receber carinho) e só troca a pose:

- **andar é uma fila de pulinhos**: o corpo inteiro amassa antes de cada pulo
  (`scale.y` desce, `scale.x` abre), estica no ar, e amassa de novo ao cair.
  As patas não dão passo — pelúcia não tem junta;
- **parado**, ele "respira" com um amassa-e-solta bem lento;
- **o carinho é APERTAR**: o prompt diz **"Apertar o Gatito"** 🤗, e ele
  achata e volta, com a língua e o rabo balançando. Carinho em pelúcia é
  abraço, não cafuné;
- **ele não fecha o olho** (é bordado). Cochilo é a cabeça tombando de lado
  e um "zzz" subindo;
- quando ele **fala**, a cabeça dá um pulinho a cada frase. A boca não mexe —
  é bordada.

Uma piada que o modelo entrega de graça: pata de pelúcia não tem dedo, então
**ninguém sabe como ele escreve na lousa** — a letra aparece sozinha enquanto
ele pula na mesa. Proposta minha, para o Renan aprovar.

### 2.5 Onde ele fica

- **Posto na Sala 1**, em cima da mesa do professor, de frente para a turma
  e para a câmera. É onde a aula começa.
- **Fora da aula ele faz ronda**, do jeito da Estella: uma **fila** de pontos
  por corredor livre (Sala 1 → corredor → sala dos professores → corredor →
  recepção → cafeteria), andando só para o vizinho na fila, com pausa
  sorteada em cada ponto. `irPara()` anda em linha reta e ignora móvel, e a
  fila é o que garante que nenhum trecho atravessa uma carteira.
- **Na sala dos professores ele tem uma almofada**, e às vezes para ali para
  cochilar.
- **A sineta da recepção chama o Gatito**: tocou, ele vem pulando pela fila
  até o balcão, de onde estiver.

### 2.6 A voz

Tudo o que o Gatito fala é a voz do Renan quando finge ser ele — e por isso
**as falas dele são do Renan** (§13). Enquanto elas não chegam, qualquer fala
escrita por mim é rascunho declarado, para trocar literal quando ele mandar.
Só para dar o tom do rascunho:

> *"Bom dia, turma! Hoje a aula vai ser miaravilhosa."*
> *"Quase! Mas foi o erro mais fofo da semana."*
> *"Pode apertar. Professor também precisa de carinho."*

Uma piscadela possível, se o Renan quiser: o Ari reparar que o Gatito tem a
voz igualzinha à do Renan — e o Renan fingir que não sabe do que ele está
falando.

### 2.7 O som dele

Efeito novo em `audio/efeitos.ts` (skill `aristory-som`): um **miado de
pelúcia**, mais curto e mais agudo que o do Pelusa, com um sopro de ar por
baixo; e um **"fuf" abafado** a cada pulinho, que é o som de pelúcia caindo
em cima de alguma coisa.

---

## 3. A planta

### 3.1 O mapa

Vista de cima, **sem escala**. Na câmera do jogo o desenho aparece girado 45°:
o fundo (`-Z`) sobe para a direita e a esquerda (`-X`) sobe para a esquerda.

```
                FUNDO (-Z): parede alta — as lousas e o balcão do café moram nela
      x=-18          x=-9           x=0          x=8             x=18
  P    +--------------+--------------+------------+---------------+  z=-12
  A    |  SALA DOS    |   SALA 1     |   SALA 2   |   CAFETERIA   |
  R    |  PROFESSORES |  Português   |  (a        |  balcão,      |
  E    |  escaninhos, |  lousa, mesa |  decidir)  |  máquina de   |
  D    |  mesa grande,|  do Gatito,  |  lousa,    |  café, lousa  |
  E    |  almofada    |  carteiras   |  carteiras |  do cardápio; |
       |  do Gatito   |              |            |  mesinhas     |
  A    +--[portinha]--+----[vão]-----+---[vão]----+ . floreiras . +  z=-2
  L    |                     C O R R E D O R                      |
  T    |  armários   · · · · eixo z = 0, sempre vazio · · · · · · |
  A    +------[vão]-------+--------[vão]--------+                 +  z=+2
       |  SALA DE         |   SALA DE           |    RECEPÇÃO     |
 (-X)  |  DESCANSO        |   CONVERSAÇÃO       |  balcão, sineta,|
       |  sofá, pufes,    |   roda de pufes,    |  cadeiras de    |
       |  estante, janela |   cavalete          |  espera         |
       +------------------+---------------------+----[porta]------+  z=+12
                     FRENTE (+Z): mureta de 0,45 — a câmera vem daqui
```

| área | x | z | medida |
|---|---|---|---|
| sala dos professores | −18 a −9 | −12 a −2 | 9 × 10 |
| Sala 1 — Português | −9 a 0 | −12 a −2 | 9 × 10 |
| Sala 2 | 0 a 8 | −12 a −2 | 8 × 10 |
| cafeteria | 8 a 18 | −12 a −2 | 10 × 10 |
| corredor | −18 a 18 | −2 a 2 | 36 × 4 |
| sala de descanso | −18 a −6 | 2 a 12 | 12 × 10 |
| sala de conversação | −6 a 6 | 2 a 12 | 12 × 10 |
| recepção | 6 a 18 | 2 a 12 | 12 × 10 |

Para comparar: o Mania tem 24 × 18 e a estufa 30 × 22. A escola, com 36 × 24,
é o maior interior do jogo — o "bem espaçoso, muito grande" do pedido.

**Os dois eixos de passagem ficam vazios** (regra 11 da skill de cenário): o
**corredor em `z = 0`**, de ponta a ponta, e a **entrada em `x = 12`**, da
porta até o corredor. Nada em cima deles — nem peça, nem colisor.

### 3.2 Por que meia-parede — a conta da câmera

A câmera olha de cima em 34°, e uma peça de altura `h` esconde `1,5 · h` de
chão atrás dela. Uma parede interna de altura cheia (3,2) comeria **4,8 m** da
sala de trás — praticamente uma sala inteira sumida atrás de cada divisória.

Por isso o plano é o de casa de bonecas:

- **parede alta só por fora, em `-X` e `-Z`** (a convenção de interior do
  projeto), com as lousas, o balcão do café, a janela e os armários altos
  todos pendurados nelas — de frente para a câmera;
- **mureta de 0,45 por fora em `+Z` e `+X`**, como em todo interior;
- **divisórias de dentro em meia-parede de ~1,1**, com um arremate de
  madeira em cima para ler como "parede cortada". Ela esconde só ~1,6 m atrás
  de si, e a regra para montar cada sala é não pôr nada importante nessa
  faixa.

Isso decide onde vai cada sala, e não é gosto: **sala que precisa de parede
alta vai para a fileira do fundo** (as de aula, pela lousa; a cafeteria, pelo
balcão com prateleira; a dos professores, pelos escaninhos). **Sala que só tem
peça baixa vai para a frente** (descanso, conversação, recepção).

Alternativas descartadas:

- **dois andares, um de cada vez na tela** (o jeito da boutique da Estella):
  funciona, mas esconde metade da escola e pede escada. Fica guardado para
  uma ampliação (biblioteca? auditório para a formatura?);
- **uma cena por sala**, ligadas por porta: cada sala ficaria bonita, mas a
  escola perderia justamente o "grande e espaçoso" — seria uma fila de salas
  pequenas com tela preta entre elas;
- **parede de vidro**: prédio translúcido já foi cortado pelo Renan (skill de
  cenário), e vidro é o mesmo efeito com outro nome.

Meia-parede encostando em parede alta não pode ter face coplanar com ela —
espessura diferente, a mesma regra do batente da `interiorDoor`.

### 3.3 O chão de cada sala

Chão diferente é o que diz "outra sala" antes de qualquer placa. Todos em
`world/texturasDeChao.ts`, desenho quase branco (a regra de 0,88–1,0 de
luminosidade):

| área | piso |
|---|---|
| corredor e recepção | **granilite** — o piso de escola brasileira, cinza-claro com pedrinhas coloridas. Textura nova, `granilite(lado)` |
| salas de aula e dos professores | `assoalhoDeMadeira` (já existe) |
| cafeteria | `pisoDePlacas` (já existe), numa placa menor, de ladrilho |
| sala de descanso | carpete liso, com um tapete grande por cima |
| sala de conversação | madeira, com um tapete redondo no meio da roda |

**Cores da escola** — uma proposta com história: o **amarelo e o azul estão
nas duas bandeiras**, do Brasil e da Venezuela. A escola pode ser pintada
nesses dois (parede amarelo-manteiga, rodapé e arremate azuis), e o verde e o
vermelho entram só nos detalhes. O Renan decide.

---

## 4. Sala por sala

Toda sala tem uma **placa bilíngue** em cima do vão: português grande,
espanhol pequeno embaixo (*Cafeteria / Cafetería*, *Sala dos Professores /
Sala de Profesores*). É texto em `<canvas>`, o mesmo das placas do parque.

### Recepção

Por onde se entra (porta na mureta da frente, em `x = 12`).

- **balcão da secretaria** à direita do eixo da entrada, de frente para a
  porta (peça com frente olha para `+Z`), com a **sineta** em cima —
  "Tocar a sineta" 🛎️ chama o Gatito;
- **cadeiras de espera** encostadas na meia-parede da sala de conversação;
- um **bebedouro** e um vaso de planta;
- o **nome da escola** num capacho na porta e num totem baixo ao lado dela
  (fora do eixo), com o **logo sendo a cara do Gatito** — um círculo metade
  creme, metade caramelo, com a linguinha;
- é aqui que a primeira visita começa (§6.1, a matrícula).

### Corredor

O eixo da escola. Na ponta da esquerda, encostado na parede alta (`-X`, de
frente para a câmera):

- **armários de aluno** coloridos;
- o **mural de avisos** de cortiça, com a **"Palavra do dia"** — uma palavra
  sorteada a cada visita, dessas que o caderno guarda (§5);
- um relógio de parede.

### Sala 1 — Português (a sala do Gatito)

A sala mais caprichada, porque é onde o presente acontece.

- a **lousa** na parede do fundo, com o tema da aula escrito — uma lousa
  **que se redesenha** durante a aula (a `quadroDeGiz` de hoje escreve uma
  vez só; §8);
- a **mesa do professor** na frente da lousa, e o **Gatito em cima dela**,
  de frente para a turma e para a câmera. Nada alto entre ele e a câmera: as
  carteiras são baixas;
- **carteiras universitárias** (cadeira com prancheta, o móvel de curso
  livre), em duas ou três fileiras, viradas para a lousa. A dupla senta lado
  a lado na primeira fila;
- nas paredes: um **cartaz do alfabeto** ("A de abacaxi… G de Gato"), um
  mapa do Brasil, e **as bandeirinhas do Brasil e da Venezuela** penduradas
  lado a lado;
- um **varal de post-its** com palavras.

### Sala 2 — a decidir

Montada como sala de aula (lousa, mesa, carteiras), mas o que se aprende nela
é pergunta para o Renan (§13). A ideia de que eu mais gosto: **aula de
espanhol, com o Ari de professor**. A virada de papel — o Renan de aluno,
errando o espanhol, e o Ari de verdade, fluente, corrigindo. Outras: inglês,
ou uma sala de artes.

### Sala de conversação

Curso de idioma costuma ter uma, e ela é a sala de peça baixa perfeita para a
fileira da frente:

- uma **roda de pufes** num tapete redondo;
- um **cavalete fininho** com um bloco de papel (o flip chart), no fundo da
  sala;
- é o lugar natural da **formatura** (§7).

### Cafeteria

No canto do fundo à direita, **aberta para o corredor** — em vez de parede,
floreiras baixas com vão no meio. Café de escola que se vê passando.

- **balcão com vitrine de doces** encostado na parede do fundo, a **máquina de
  café** atrás e o **cardápio escrito na lousa de giz** (`quadroDeGiz`, que já
  existe) pendurado acima;
- **quatro ou cinco mesinhas redondas** de duas cadeiras;
- o **cardápio** é pergunta (§13), mas a proposta é misturar os dois países:
  cafezinho, pão de queijo, bolo de cenoura, brigadeiro — e, do lado
  venezuelano, o que o Ari gostar (arepa? tequeños?);
- pedir segue o jeito da sorveteria do parque — pede no balcão e a comida
  vai para a mão dos dois —, pagando com a **carteira do casal**
  (`g.gastar`); depois é sentar numa mesinha e comer juntos;
- quem atende o balcão é pergunta (§13).

### Sala de descanso

Na frente, à esquerda, a mais aconchegante.

- **sofá encostado na parede alta** (`-X`), de frente para a sala — e uma
  **janela** nessa parede;
- uma **estante alta** também na parede `-X`, com livros e jogos;
- **pufes**, um tapete grande, mesinha de centro, luminária de pé, plantas;
- uma **máquina de lanchinhos** (peça nova);
- ações: **sentar juntos no sofá** (a cena de sofá da casa), **deitar no
  pufe gigante** (`g.setLying`), e talvez um **cochilo de cinco minutinhos**
  que termina com o Gatito cutucando os dois.

### Sala dos professores

No canto do fundo à esquerda, o mais escondido — de propósito.

- **portinha de vaivém** na meia-parede, com uma plaquinha: *"Só professores
  (e gatinhos)"*. Ela fica **trancada até a primeira aula**; depois dela, o
  Gatito convida os dois para conhecer a sala;
- **escaninhos** na parede `-X`, um com o nome de cada professor;
- **mesa grande de reunião**, garrafa de café e canecas — a caneca do Gatito
  do tamanho dele;
- a **almofada do Gatito**, onde ele cochila;
- uma pilha de "provas para corrigir" e um mural com o plano das aulas;
- **o boletim do Ari**: um caderninho em cima da mesa, com o que o Gatito
  anotou sobre o aluno dele. É o lugar certo para um **recado do Renan** — o
  texto é dele.

---

## 5. As etiquetas e o caderno de palavras

Quem aprende idioma cola papelzinho nas coisas da casa. A escola faz isso:
**etiquetas amarelas com o nome em português** coladas nos objetos de todas
as salas — *porta, janela, cadeira, mesa, lixeira, relógio, geladeira,
xícara, sofá, almofada…*

- chegando perto, "Ler a etiqueta" 🏷️: o Ari lê em voz alta e o Renan comenta
  (uma linha de cada, a regra de conversa entre os dois);
- cada etiqueta lida entra no **caderno de palavras**, com a palavra, o
  espanhol e onde ela foi achada. É um colecionável de explorar, como as
  memórias do diário;
- o caderno abre na mochila ou na carteira da Sala 1, e as mesmas palavras
  caem nas perguntas da aula (§6).

A etiqueta é um decalque pequeno com texto em canvas (a mesma técnica da
placa), com o cuidado de sempre com face colada: `decal: true` e
`renderOrder`.

---

## 6. A Aula do Gatito

### 6.1 Como uma aula corre

A primeira visita tem uma **matrícula**: na recepção, tocar a sineta traz o
Gatito, que se apresenta e matricula o Ari no curso de português. Daí em
diante:

1. na Sala 1, o prompt **"Assistir à aula do Gatito"** 📚 nas carteiras;
2. os **dois sentam lado a lado** na primeira fila (âncora + `ridePlayer` /
   `rideCompanion` + `setSitting` — o padrão de cutscene com os dois); a
   câmera foca a mesa do professor;
3. toca o **sinal**, o Gatito dá bom dia com um pulinho, e o tema aparece na
   lousa;
4. **cinco perguntas**: a pergunta vai para a lousa e para a escolha na tela;
5. acertou → estrelinha na lousa, miado feliz, o parceiro comemora;
   errou → o Gatito corrige com carinho, numa linha, e explica o porquê;
6. no fim, as **estrelinhas da lição** (0 a 5), as palavras novas vão para o
   caderno, e a dupla levanta.

Uma lição tem **dois a três minutos** — dá para fazer uma de cada vez, e
repetir para melhorar a nota.

**Quem é o aluno é o Ari**, e a aula fala com ele pelo nome (`ARI.name`),
seja quem estiver no controle — porque quem está aprendendo português é ele
(a pessoa de verdade que joga). É a exceção consciente ao
`g.companionName()`. O Renan do jogo fica de colega do lado, torcendo e
soprando a resposta de vez em quando.

### 6.2 Tipos de pergunta

Três opções cada, pela escolha que o jogo já tem (`g.ask`):

| tipo | exemplo |
|---|---|
| **como se diz** | *"Como se diz 'ventana' em português?"* — janela · ventana · venda |
| **falso amigo** | *"Em português, 'esquisito' quer dizer…"* — estranho · delicioso · caro |
| **complete** | *"Eu ___ com fome."* — estou · sou · tenho |
| **qual está certo** | acento e grafia: avó · avô, *"você" ou "voce"* |
| **o que o Gatito aponta** | ele pula até um objeto da sala que tem etiqueta, e pergunta o nome |

Pergunta de **ouvir** fica de fora: não há voz gravada (zero asset), e a voz
sintética do navegador muda de aparelho para aparelho.

### 6.3 Errar não pune

Não tem vida, não tem reprovação, não tem "tente de novo". Errar mostra a
certa, o Gatito explica, e a aula segue. A nota da lição guarda a **melhor**
vez, nunca a última.

### 6.4 As lições — rascunho meu, o conteúdo é do Renan

**Esta é a parte mais importante de perguntar** (§13): o conteúdo que vale é
o que o Renan ensina ao Ari de verdade, as palavras em que ele tropeça e os
erros engraçados que já aconteceram. Como ponto de partida:

1. **Oi, tudo bem?** — cumprimentos e apresentação;
2. **No Mania** — comida e restaurante (picanha, farofa, guardanapo, a conta),
   ligando com o que já existe no jogo;
3. **Pelo mapa** — os lugares do jogo (parque, clube, piscina, roda gigante,
   estufa);
4. **Falsos amigos** — a lição mais engraçada para quem fala espanhol:
   *exquisito* (delicioso) × *esquisito* (estranho); *embarazada* (grávida) ×
   *embaraçada*; *polvo* (pó) × *polvo* (o bicho); *borracha* (bêbada) ×
   *borracha* (de apagar); *apellido* (sobrenome) × *apelido*; *rojo* ×
   *roxo*; *taza* (xícara) × *taça*; *cachorro* (filhote) × *cachorro* (o
   Walter!); *largo* (comprido) × *largo*;
5. **Palavras que não se traduzem** — saudade, cafuné, xodó;
6. **Do nosso jeito** — as expressões de carinho que os dois usam (só o
   Renan sabe quais são).

---

## 7. Prêmios e a formatura

- **Estrelinhas somadas destravam roupa** no guarda-roupa dos dois
  (`g.ganharPeca`), no molde do chapéu de campeão. Propostas: a **tiara de
  orelhinhas do Gatito** (uma chocolate, uma caramelo), a **mochila da
  escola** e um **crachá de aluno**. Cada peça pela skill `aristory-roupa`.
- **Memória no diário** na primeira aula (*"A primeira aula do Gatito"*).
- **A formatura**, ao terminar todas as lições com pelo menos três estrelas:
  cerimônia na sala de conversação, os dois de **capelo** (chapéu de
  formatura, peça nova), o Gatito entregando o **diploma** — e o diploma vai
  **pendurado na parede do quarto do Ari** (peça nova: um quadro no molde do
  `pictureFrame`, com o texto em canvas). O discurso do Gatito e o texto do
  diploma são do Renan.
- Se o Renan mandar uma foto de uma aula de verdade com o Gatito, ela vira
  uma **memória pintada** do quadro do quarto (skill `aristory-memoria`).

---

## 8. Peças novas do kit

Tudo em `world/furniture.ts` (é interior), cada uma pela skill
`aristory-prop`:

| peça | observação |
|---|---|
| `meiaParede` | a divisória de ~1,1 com arremate — ou um ajuste no `w.wall` |
| `carteiraUniversitaria` | cadeira com prancheta; dá para sentar |
| `mesaDoProfessor` | com tampo firme para o Gatito ficar em cima |
| `lousaEscrevivel` | lousa que devolve `escrever(linhas)` para redesenhar o canvas durante a aula |
| `cartazDeParede` | canvas: alfabeto, mapa, "Palavra do dia" |
| `bandeirinha` | Brasil e Venezuela, em geometria simples |
| `etiqueta` | o post-it amarelo com texto (§5) |
| `placaDeSala` | bilíngue; talvez só um uso do `textSign`/`letreiro` que já existem |
| `balcaoDeCafeteria` | balcão com vitrine de doces |
| `maquinaDeCafe` | espresso com o bico e a xícara |
| `mesinhaDeCafe` | redonda, de duas cadeiras |
| `maquinaDeLanches` | a de moedinha, da sala de descanso |
| `armarioDeAluno` e `escaninhos` | corredor e sala dos professores |
| `mesaDeReuniao` | sala dos professores |
| `almofadaDoGatito` | a caminha dele |
| `sineta` | de balcão |
| `cavalete` | o flip chart da conversação |
| `relogioDeParede` | corredor |
| `diploma` | o quadro da formatura, com o texto em canvas, para o quarto do Ari |

**Reaproveitadas do kit:** `sofa`, `pufeDeLoja`, `bookshelf`, `coffeeTable`,
`floorLamp`, `pottedPlant`, `windowFrame`, `rug`, `chair`, `quadroDeGiz` (o
cardápio do café), `luminariaPendente`, `muralDeMemorias` (a cortiça do
mural), `caixaRegistradora`, `pictureFrame`, `wallShelf`, `interiorDoor`.

**Textura nova:** `granilite(lado)` em `world/texturasDeChao.ts`.

---

## 9. Som e música

Pela skill `aristory-som`:

- **clima de música `'escola'`**: tarde de estudo — andamento calmo, marimba
  macia, acordes de sétima maior;
- **efeitos novos**: o miado de pelúcia e o "fuf" do pulinho (§2.7), a
  **sineta** (ding de balcão), o **sinal** de começo de aula, o **chiado do
  giz**, a **estrelinha** do acerto, o "ops" gentil do erro (duas notas
  descendo), e o **vapor da máquina de café**.

Cada um com o `.wav` ouvido antes de dar por pronto (`scripts/musica.mjs`).

---

## 10. Como se chega — decidido: de ônibus, depois da Luna

O Renan escolheu o ônibus, e amarrou a abertura numa missão:

1. **o quadro de inscrições da arena de ping pong enche** (a flag
   `jean-luc-batido`, quando se ganha do Jean-Luc pela primeira vez);
2. a **Luna** aparece fazendo piquenique no gramado do lado da roda gigante,
   no lugar das florzinhas que o Renan apontou numa foto (§14);
3. **conversar com ela** abre a escola: flag `escola-aberta`, o aviso "Nova
   parada no ônibus: Escola do Gatito" e a memória "A torcedora dos Gatitos"
   no diário;
4. daí em diante **os dois ônibus perguntam o destino**: o do parque oferece
   clube ou escola, o do clube oferece parque ou escola, e a porta da rua da
   escola é o ponto de volta (parque ou clube). Antes da Luna, os ônibus são
   exatamente o que eram — mesma porta, mesmo rótulo, sem pergunta.

`scripts/luna.mjs` joga isso de ponta a ponta. `?cena=escola` continua valendo
para testar sem a missão.

---

## 11. Onde cada coisa vai morar no código

| arquivo | o que mora lá |
|---|---|
| `src/scenes/escola.ts` | a cena (`id: 'escola'`), a planta do §3, as falas do lugar, a ronda do Gatito |
| `src/scenes/index.ts` | o registro da cena |
| `src/entities/bichos/Gatito.ts` | o corpo e a pose do Gatito (o cérebro é o `Bicho.ts`) |
| `src/world/licoesDoGatito.ts` | o acervo das lições e das etiquetas, no molde de `cardapioData.ts` |
| `src/minigames/aulaDoGatito.ts` | a aula: perguntas, estrelinhas, fim. Recebe pontos da cena, não conhece a planta |
| `src/world/furniture.ts`, `src/world/texturasDeChao.ts` | as peças e o granilite (§8) |
| `src/palette.ts` | as cores do Gatito e da escola |
| `src/audio/efeitos.ts`, `src/audio/musica.ts` | os sons e o clima (§9) |
| `scripts/escola.mjs`, `scripts/gatito.mjs`, `scripts/aula.mjs` | os testes de cada etapa |

---

## 12. Etapas

Uma de cada vez, com o Renan olhando e escolhendo a próxima — nunca três
emendadas.

1. **O prédio.** A cena com a planta, as meias-paredes, os pisos, os móveis e
   as placas; colisão; só por `?cena=escola`. Sem Gatito e sem mecânica.
   `scripts/escola.mjs`: foto de cada sala, o corredor percorrido de ponta a
   ponta sem esbarrar, os dois eixos livres, e nenhuma sala tapada pela
   divisória da frente. **O Renan olha as fotos e acerta a planta antes de
   qualquer mecânica.**
2. **O Gatito.** Modelo, pulinho, som, "Apertar o Gatito", o posto na mesa e
   a ronda. `scripts/gatito.mjs`: fotos de perto dos quatro lados para
   comparar com as fotos de verdade, o lado da mancha medido, a trilha somando
   distância, e ele nunca dentro de um móvel.
3. **A escola viva.** A cafeteria (pedir, pagar, sentar e comer), a sala de
   descanso (sofá, pufe), as etiquetas e o caderno, a sineta.
4. **A Aula do Gatito.** A lousa escrevível, a matrícula, as primeiras
   lições com o conteúdo do Renan, as estrelinhas. `scripts/aula.mjs`.
5. **A sala dos professores e o fim.** O convite, o boletim, os prêmios de
   roupa e a formatura com o diploma no quarto.

**Abrir a porta no mapa** (§10) pode entrar depois de qualquer etapa — é só
uma ligação, e o Renan decide quando a escola está pronta para o Ari ver.
Minha sugestão: depois da 2, para o Ari já conhecer o Gatito; ou guardar para
depois da 4, e a escola chegar inteira, de surpresa.

---

## 13. Perguntas para o Renan

O plano não inventa nada do que é da vida de vocês. O que falta, por etapa:

**Para começar (etapa 1)**
1. **O nome da escola.** "Escola do Gatito" é provisório. Tem algum nome de
   que vocês dois riam?
2. É **inspirada num lugar real** (um curso que um de vocês fez)? Se for, uma
   foto ou uma descrição muda a planta toda.
3. **Um andar grande** (o que eu recomendo) ou **dois andares**?
4. As **cores**: o amarelo e azul das duas bandeiras, ou outra ideia?
5. **A Sala 2** ensina o quê? Espanhol com o Ari de professor, inglês,
   outra coisa?

**Para o Gatito (etapa 2)**
6. Ele fica **exatamente como a pelúcia**, ou ganha um detalhe de professor —
   oculinhos redondos, gravatinha, crachá?
7. **Tamanho de pelúcia** (em cima da mesa) ou **gigante**?
8. **Como o Gatito fala** quando você é ele? Mia no meio das frases? Tem
   bordão? Fala devagar? Manda umas falas de verdade dele — elas entram
   literais.

**Para a escola viva (etapa 3)**
9. **Quem atende a cafeteria e a recepção?** Pode ser gente nova, um bicho
   que já existe fazendo bico (a Estella, que fala "cariños"? o Jean-Luc,
   que é francês e bem que podia dar aula também?), ou ninguém — só a sineta
   e o Gatito.
10. **O cardápio**: o que tem de Venezuela que o Ari ama? E o café dele, como
    é?

**Para a aula (etapa 4)**
11. **O que você ensina ao Ari de verdade?** Em que nível ele está, em que
    palavras tropeça, que erros engraçados ele já cometeu, que falsos amigos
    já pegaram ele?
12. As explicações do Gatito são **só em português**, ou com uma ajudinha em
    espanhol (ou inglês) quando aperta?

**Para o fim (etapa 5)**
13. Quer escrever o **boletim do Ari**, o **discurso da formatura** e o
    **texto do diploma**? São os lugares que pedem a sua voz.

**E para abrir**
14. ~~Como se chega~~ — respondido: de ônibus, depois de conhecer a Luna
    (§10, §14).

**Sobre a Luna (§14)**
15. ~~A aparência dela~~ — aprovada pelo Renan: pelo cinza-pérola, uniforme
    no azul e amarelo da escola, laço amarelo na orelha e a ponta de uma
    orelha dobrada.
16. ~~As falas~~ — o Renan manteve as do rascunho, sem ler: são surpresa
    para o Ari.
17. ~~Onde ela fica depois~~ — respondido: no ginásio, treinando a
    coreografia com os pompons (§14).

---

## 14. A Luna — a primeira personagem da escola

A coelhinha **cheerleader dos Gatitos**, a atlética da Escola do Gatito. O
nome, o time e o jeito são do Renan:

- **super fã dos Gatitos**, se anima quando fala deles — e, quando percebe
  que está falando demais, **fica tímida**;
- faz **aula de português** na escola, com o Gatito, há bastante tempo. A
  língua dela é o espanhol, e ela é da Venezuela — **mas ela não fala sobre
  isso**: é contexto, não assunto. Ela fala português, e o que escapa são as
  **expressões venezuelanas**;
- ela é a **primeira** personagem da escola; outras virão.

**Onde ela mora no código.** O corpo e os gestos em
`entities/bichos/Luna.ts` (um bicho, como o Mano: em pé, com posto). O
piquenique, a conversa e a abertura da escola no `scenes/villaLobos.ts`
(procure "A LUNA E O PIQUENIQUE"). A toalha é a `toalhaDePiquenique` do kit,
nas cores dos Gatitos; a cesta (`cestaDePiquenique`) e a flâmula "GATITOS"
(`flamula`) são peças novas do kit.

**Os três jeitos dela**, que a conversa aciona entre uma fala e outra:
`torcer()` (pula e sacode os pompons no alto, em V), `ficarTimida()` (as
patas com os pompons na altura da boca, os olhos espiando por cima, as
orelhas caídas para trás e a bochecha mais corada) e sentada no piquenique.

**A câmera na conversa.** O piquenique fica dentro da zona da roda gigante,
que abre o enquadramento; durante a conversa a zona solta a câmera, que mira
nela em zoom 8, e devolve tudo no fim. Em toda conversa com ela (parque,
saguão, ginásio) a dupla é posta na DIAGONAL dela, fora da linha da câmera
(`posicionarParaConversar` em `escolaComum.ts`): quem chega para falar tende
a parar bem na frente, tapando a coelha.

**Onde ela mora, na ordem da história** (decisão do Renan):

1. **no piquenique do Villa Lobos**, depois do quadro encher, até o convite.
   Ela fica lá o resto daquela visita; na próxima vez que a dupla vier ao
   parque, a toalha foi recolhida e as florzinhas voltaram;
2. **na entrada da escola**, na primeira chegada depois do convite: ela
   espera onde a dupla desce do ônibus e dá o **resumo do lugar** — saguão,
   troféus, a escada do segundo andar fechado, Sala 1 (português, do
   Gatito), Sala 2 (espanhol), sala de descanso, sala dos professores,
   refeitório e ginásio —, fica tímida por ter falado tudo de uma vez, diz
   para procurá-la no ginásio e vai andando até lá (`luna-na-escola`);
3. **no ginásio**, de vez: treinando a coreografia (`treinar()`, quatro
   passos de dois segundos em loop — alto-e-baixo, V alto e V baixo, o giro
   e os chutes). Conversar para o treino; as falas se revezam, uma por
   conversa, e no fim ela volta a treinar.

A aparência e as falas estão aprovadas (§13, 15–17).
