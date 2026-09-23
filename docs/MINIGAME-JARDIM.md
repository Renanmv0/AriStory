# A Estufa da Josefina — plano do minigame do jardim

> Documento de PROJETO. **As etapas 0, 1 e 2 estão no jogo** (§10): a área existe,
> a quest que a destranca também, a Josefina já entra na estufa junto com a
> dupla e já pede confirmação para começar, e as cartas, a curva de nível e as
> ondas existem como lógica testada. A rodada em si (etapa 3) ainda é plano. Quando uma etapa
> for construída, marque-a aqui, e deixe o `git log` ser a fonte da verdade do
> que de fato existe.
>
> Este arquivo é o lugar de ajustar o minigame. Ele vai mudar MUITO: número de
> inimigo, dano de regador, curva de experiência, raridade de melhoria. Mexa
> aqui primeiro, no código depois.

O pedido do Renan, nas palavras dele: um minigame que começa numa **quest de
achar alguma coisa pelo mundo** — um adubo, uma substância — para as plantas da
Josefina. Ela acha bonito da nossa parte e **convida a dupla para uma área
nova**: a estufa dela, um jardim grande. Lá dentro o jogo vira um
**roguelite-survivor**: a gente começa com um **regador** que espanta os
inimigos com água, melhora o regador em si (alcance, dano, velocidade), e
depois vai pegando **melhorias aleatórias de raridades diferentes** — a cada
tanto de experiência, escolhe uma entre três.

Duas coisas ele cortou antes de começarem a existir, e elas ficam registradas
aqui para ninguém propor de novo:

- **Nada de golfinho.** Foi ideia descartada por ficar fora do escopo.
- **Nada de rato.** Em nenhuma forma, em nenhuma raridade, nem de piada. O Ari
  odeia rato de verdade, e este jogo é um presente para ele.

---

## 1. A ideia em uma frase

**Você rega, e é isso que machuca.**

O regador dispara sozinho — estilo survivor: você só anda, ele mira no inimigo
mais perto do alcance e molha. Toda a jogada está em **onde você anda**, porque
o que você está defendendo não é você: são **os canteiros**. Bicho que chega num
canteiro para de te perseguir e começa a comer, e canteiro comido não volta.

> É o inverso do survivor comum, onde a única coisa que importa é a sua vida. Aqui
> dá para terminar a onda com vida cheia e ter perdido: se os oito canteiros
> foram comidos, a Josefina não tem mais horta.

**Quem vai para a frente é só quem você controla.** Decisão do Renan: quem não
está sendo controlado fica **lá atrás, com a Josefina**, na linha da porta,
olhando para os portões. A dupla continua em cena, como o jogo exige — só que
dividida: um defende, o outro torce.

> O plano antigo punha os dois regando, e isso não sumiu: virou a carta
> lendária **Os dois na frente** (§6). É o prêmio de uma rodada boa, e não o
> começo de toda rodada.

---

## 2. A quest que destranca: o adubo

**Construída.** É ela que abre a estufa, e nada mais abre.

A corrente inteira, e cada elo mora num lugar diferente do mundo:

```
saco de sementes, esquecido num banco do fundo do Villa-Lobos
  → dar ao NOEL, que é peru e come semente
  → ele retribui com um saco de ADUBO (a borra das frutas do bar, curtida)
  → dar o adubo à JOSEFINA, que cuida de planta
  → ela destranca a ESTUFA
```

### As duas deduções, e por que não há seta nenhuma

O pedido do Renan foi explícito: **a gente tem que deduzir**. Então nenhum
rótulo, nenhuma nota de item e nenhum diálogo diz o nome do destinatário. O que
o jogo faz é deixar os **dois fios** soltos, um de cada lado:

| fio | onde ele aparece |
|---|---|
| *"quem é que come semente por aqui?"* | o Renan, ao pegar o saco no banco |
| *"alguém aqui passa o dia de joelho num canteiro"* | o Ari, quando o Noel entrega o adubo |
| *"sete anos plantando no mesmo lugar cansa qualquer terra"* | a Josefina, na segunda visita ao jardim |

Nenhuma das três cita um nome. A ligação continua sendo do jogador — e as três
saem **uma vez cada**, nunca sorteadas: pista que o jogo pode esconder para
sempre não é pista, é loteria. É o mesmo desenho da dica do osso.

### Onde fica o saco de sementes

No banco de `(-12; 9,5)` — o banco sozinho de frente para o lago, ao lado da
loja de patins. O Renan escolheu "o banco isolado", e este é o que de fato
cumpre isso: fora da alameda (que corre em `x = ±4,2`) e fora da praça da roda.

**O primeiro candidato não sobreviveu à foto.** Era o banco de
`(-13,2; -22,5)`, e o problema não era estético: a roda-gigante fica em
`(0; -26)` e **manda na câmera num raio de 28**, abrindo o enquadramento até 30
para ela caber na tela. Aquele banco está a 13,7 dela — um saco de 30 cm
naquele zoom tem meia dúzia de pixels, e o item da quest ficava invisível. Este
está a 37,5, fora do raio, com a câmera no zoom normal de jogo.

Deu de brinde uma quase-pista boa: o banco fica na beira do lago, **com patos
nadando a dez metros**. Quem lê "saco de sementes" ali pensa nos patos
primeiro. A resposta é o peru, do outro lado do mapa.

O raio da interação é 1,1: prompt que acende de longe entrega o segredo antes
de o jogador chegar nele.

### A estufa antes da quest

Ela **está lá, e não abre**. O prédio é visível do jardim desde a primeira
visita; a porta responde com **"Abrir a porta da estufa"** — nunca com um
cadeado no HUD, porque isso contaria a história antes de alguém encostar nela.
Quem clica é que descobre: *"Trancada. Tem cadeado por dentro."*

E **a Josefina não comenta nada sobre a estufa** até receber o adubo. Foi
pedido explícito, e é a diferença entre descobrir e ser avisado: ela fala da
terra cansada, que é assunto de jardineira, e não da porta. Depois da quest ela
ganha um repertório novo de histórias, em que a estufa finalmente existe.

### Dois detalhes de implementação que já custaram bug

- **Tirar antes de pôr.** O adubo entra na mochila na vaga que as sementes
  acabaram de deixar. Na ordem inversa, quem chegasse com as dez vagas cheias
  perderia o saco e não ganharia nada.
- **O `onUpdate` para de arbitrar quando a flag sobe.** Os prompts de "falar" e
  "entregar" moram no mesmo ponto e se revezam por `enabled`, decidido a cada
  frame — mas só enquanto a quest está aberta. Sem religar o "falar" à mão no
  momento da entrega, o bicho fica com os dois pontos desligados e emudece até
  a cena ser remontada.

**A flag é `adubo-entregue`**, e ela é a única chave da estufa.

---

## 3. A rodada, do começo ao fim

### Como ela começa — **construído**

**Não há botão de "jogar".** A estufa é um lugar onde se anda normalmente, e o
minigame começa por dentro da ficção, num ritual de três passos que o Renan
desenhou:

1. o **regador está na bancada** da Josefina, onde sempre esteve. Dá para pegar;
2. com ele na mão, cada canteiro oferece **Regar** — a terra escurece, as mudas
   dão uma esticada e a água cai em arco da altura da mão;
3. na **terceira** rega, a Josefina entra pela porta, atravessa o terreiro e
   conta das pragas: que vêm pelos três portões, que têm umas com pinça e uma
   que pula, e que a arma é água porque ela **não quer machucar nenhum bicho**.

Isso é melhor que um botão por uma razão concreta: quando a rodada começar, o
jogador já vai estar com o regador na mão, já vai ter andado de canteiro em
canteiro e já vai ter visto que a lata aponta para onde ele olha. **O tutorial
inteiro acontece sem ninguém chamar de tutorial.**

E nada disso é obrigatório — dá para entrar, olhar tudo e sair sem encostar no
regador. Quem quiser jogar, rega; quem quiser só visitar a estufa, visita.

### Depois do convite: ela entra junto, e é com ela que se joga — **construído**

O ritual acontece **uma vez na vida**. Depois dele (flag `jardim.convite`), o
desenho do Renan:

1. **Lá fora ela continua passeando** no caminho do jardim, como sempre.
2. **Toda vez que a dupla entra na estufa, ela entra junto**: nasce do lado de
   fora da porta, atrás do vidro, e atravessa a soleira um instante depois —
   "viu a gente entrando e veio atrás". Ela anda pelo lado `x = 1` da porta,
   e não pelo eixo, porque é no eixo que a dupla acabou de nascer.
3. **Lá dentro ela passeia perto das plantas** — a metade da porta
   (`z > 1`), sem nunca pisar em canteiro nem em muda. A metade dos portões é
   o caminho dos bichos, e tartaruga ali seria tartaruga no meio do enxame.
4. **Para jogar, fala-se com ela, e ela pede CONFIRMAÇÃO**: *"Vocês me ajudam a
   espantar as pragas?"* — **Vamos espantar as pragas** / **Agora não**. Quem
   só veio passear responde "agora não" e continua passeando, sem castigo.
5. **Sem o regador na mão, não começa**: ela manda buscar na bancada (ou, se
   quem está com ele é o parceiro, diz que vai para a frente quem está com o
   regador). Regador na mochila vai sozinho para a mão.
6. **Com o regador, cada um vai para o seu posto**: ela e o parceiro ANDAM até
   a linha da porta (`(-1; 6,8)` e `(1; 6,8)`) e ficam virados para os três
   portões. O jogador fica solto — é a hora de ele ir para onde quiser defender.

**O gancho da rodada está no fim do passo 6**, marcado no código
(`scenes/estufa.ts`, `assumirOsPostos`). Enquanto a etapa 3 não existe, ela
fecha o assunto dentro do mundo ("ainda tá quente demais, eles só saem quando
esfria") e desfaz os postos. `node scripts/postos.mjs /tmp/pt` percorre tudo
isso.

A rodada em si é curta de propósito: **algo entre 4 e 6 minutos**. Roguelite é
jogo de repetir, e repetir só é gostoso se recomeçar é barato.

| fase | o que acontece |
|---|---|
| **preparo** | fala-se com a Josefina, ela confirma, e ela e o parceiro vão para o posto de trás |
| **onda** (×5) | bichos entram pelas beiradas, andam para o canteiro mais perto, você rega |
| **escolha** | a cada nível, o jogo para e mostra **três** melhorias; você pega uma |
| **fim** | conta quantos canteiros sobraram e paga por canteiro vivo |

**O placar é canteiro, não inimigo.** Inimigo derrotado dá experiência (que é o
que faz a rodada evoluir); **canteiro vivo no fim é o que dá dinheiro**. Assim
matar tudo não é a estratégia ótima por definição — segurar a linha é.

**Nem todo bicho morre.** "Derrotar" aqui é **espantar**: o bicho encharca,
sacode, e vai embora pela beirada por onde entrou. Nada morre nesta estufa. É
regra, não detalhe de texto.

### Eles entram aos pouquinhos, e um bicho novo por onda

A primeira onda tem **um tipo só** — o Lagartejo —, entrando **um de cada vez**,
a cada 4 segundos. A rodada começa fácil de propósito: o jogador ainda está
descobrindo que o regador tem alcance, que a água acaba e que o canteiro é o
placar. Onda 1 é uma aula, e ela tem que parecer fácil.

| onda | quem entra | ritmo | quantos |
|---|---|---|---|
| 1 | Lagartejo | 1 a cada 4 s | ~12 |
| 2 | **+ Gafanhopo** | 2 a cada 4 s | ~20 |
| 3 | **+ Coelhatu** | 2 a cada 3 s | ~28 |
| 4 | **+ Tucanguru**, e um Preguipolvo | 3 a cada 3 s | ~36 |
| 5 | todos, e a **Mãe-Lagartejo** no fim | 3 a cada 2,5 s | ~45 |

**A regra que vale mais que a tabela: bicho novo entra SOZINHO.** Nos primeiros
10 segundos da onda em que ele estreia, só ele entra, e por uma porta só. O
jogador precisa de um momento limpo para descobrir que o Gafanhopo pula por cima
do jato, e esse momento não existe se ele estreia no meio de oito lagartejos.
Depois desses 10 segundos, o sorteio mistura tudo.

O tanque e o chefe são **anunciados**: a porta por onde eles vêm chacoalha e a
Josefina fala uma linha antes. Bicho grande que aparece sem aviso não é difícil,
é injusto.

---

## 4. O regador — **construído**

A arma inicial, e a única que não é escolhida: ela está na bancada da estufa, e
o jogador vai lá pegar (§3).

Ele **não mora mais em `world/props.ts`**: tem arquivo próprio,
`src/world/regador.ts`, porque deixou de ser uma peça e virou uma **receita**.
`regadorDeJardim(estilo)` recebe o que a rodada acumulou e devolve o regador
daquele momento — é isso que faz a regra do §6 ("carta que mexe no regador mexe
na peça da mão") ser barata em vez de ser um projeto.

Na mão ele usa a pose `regando`: **braço levantado**, pedido do Renan, e com
razão de jogo — na altura das outras poses a lata fica na frente do tronco e
some atrás de qualquer moita. Arma precisa aparecer acima da linha do canteiro.

`node scripts/regador.mjs /tmp/rg` monta os três estágios e as versões com
melhoria lado a lado e **mede**: que cada carta mudou a peça de verdade (bico
mais longo cresce, tanque maior engorda, crivo aberto alarga), que os três
estágios não renderizam iguais, e que a lata cabe na mão. Depois faz o ritual
inteiro: pegar, regar três, e a Josefina chegar.

Os quatro números que definem ela, e que as primeiras melhorias mexem:

| número | começo | o que ele faz |
|---|---|---|
| `alcance` | 2,6 | raio em que o regador acha alvo |
| `dano` | 1,0 | quanto tira de encharque por jato |
| `cadencia` | 1,1 s | intervalo entre um jato e o outro |
| `largura` | 35° | abertura do leque de água (pega mais de um bicho) |

O jato é um **cone de partículas** reaproveitando os respingos que a piscina do
clube já tem (`espirrar()` em `clube.ts`) — nenhum sistema novo de partícula.

**O regador tem água, e a água acaba.** Um tanque de 12 jatos que enche sozinho
devagar, ou de uma vez encostando no **tonel** que fica no canto da estufa. É o
que impede o jogo de virar "segure para a frente e ande em círculo": de vez em
quando você TEM que voltar ao canto, e é nessa viagem que os canteiros ficam
sozinhos.

---

## 5. Os bichos que comem planta — **os modelos estão construídos**

Eles **não são animais de verdade**, e essa foi a decisão do Renan com o Ari: um
coelho comum na mira do regador dá dó, e dó estraga o jogo. Então são
**quimeras** — bicho com parte de outro bicho, como as anomalias daqueles jogos,
mas sem nada de terror. Cada um é uma mistura que se lê em dois segundos, e o
desenho já diz que ele é malvado: olho semicerrado com sobrancelha brava, garra
laranja, andar de quem vem comer a horta.

Nenhum deles empresta bicho nomeado do jogo. Pelusa, Walter, Cookie, Gina,
Noel, Capy, Estella, Mano, Jean-Luc e Josefina são **gente**, e gente não vira
alvo. Nenhuma peça de bicho já existente foi reaproveitada: as seis são modelos
novos, em `src/world/bichosDoJardim.ts`.

| bicho | mistura | cor | tier | altura | encharque | o que ele faz de diferente |
|---|---|---|---|---|---|---|
| **Lagartejo** | lagarta + caranguejo | roxo | fraco | 0,38 | 2 | o básico. Vai reto no canteiro mais perto e come. As duas garras são só ameaça |
| **Gafanhopo** | gafanhoto + sapo | turquesa | fraco | 0,44 | 2 | pula 2 m de cada vez — o jato passa por baixo enquanto ele está no ar |
| **Coelhatu** | coelho + tatu | ferrugem e creme | médio | 1,01 | 4 | corre, dá uma mordida e volta. Se levar jato de frente, **enrola** e os placões aguentam |
| **Tucanguru** | tucano + canguru | azul de bico amarelo | médio | 1,23 | 3 | aos saltos longos, e **ignora canteiro**: vai direto no que estiver em vaso ou na prateleira de mudas |
| **Preguipolvo** | preguiça + polvo | musgo | tanque | 0,83 (e 2,1 de largura) | 10 | lentíssimo e largo. Os braços alcançam **dois canteiros ao mesmo tempo**, e ele é o que mais atrapalha a passagem |
| **Mãe-Lagartejo** | o lagartejo em tamanho de chefe | vinho | chefe | 1,36 | 18 | a chefe. Anda devagar, come um canteiro inteiro de uma vez e **solta lagartejos** pelo caminho |

A coluna `encharque` é a que está no código (`FichaDePraga.encharque`) e vale em
**jatos do regador básico**. Velocidade e comportamento ainda são projeto: os
modelos existem, a lógica não.

O elenco cresce como o do Mania: **cada bicho é uma linha numa lista**
(`PRAGAS`, no mesmo arquivo). Bicho novo é uma entrada nova, não uma mexida no
motor.

### O tamanho é o relance; a barra de vida é o número

Com cinco na tela, ninguém lê "preguiça com braço de polvo" — lê tamanho. Então
**bicho fraco é um bicho pequeno**: a peça é a mesma, encolhida a 0,72
(`ESCALA_DO_TIER`). Um Lagartejo de 38 cm ao lado de um Coelhatu de 1 m não
precisa de explicação nenhuma. O teste cobra a régua: fraco não chega a dois
terços do médio mais baixo, **o tanque é o mais LARGO** (2,1 de envergadura),
**o chefe é o mais ALTO** (1,36) e o mais comprido, e o encharque sobe junto com
o tier — senão a ficha mente para o jogador.

Quanta água ainda falta quem diz é a **barra de vida em cima da cabeça**, que o
minigame desenha. Cada ficha já traz o `alturaDaBarra`, em metros do chão, para
a barra não atravessar o bicho nem desgrudar dele; o teste confere que ela cai
de 8 a 45 cm acima do topo da peça.

### Cada uma com a sua cor

Não há família única de cor, e essa foi uma correção do Renan olhando a primeira
leva: seis tons do mesmo roxo viram **uma mancha escura só** quando há cinco na
tela, e aí o jogador sabe que vem praga mas não sabe QUAL. Agora cada uma tem a
sua (`P.pragaLagartejo`, `P.pragaGafanhopo`, …): roxo, turquesa, ferrugem, azul,
musgo e vinho. A cor também precisa brigar com o CHÃO — o primeiro terracota do
Coelhatu era quase o piso do terreiro, e ele sumia nele.

O que as seis dividem é só o olho, a barriga clara e a **garra laranja** de
aviso. E nenhuma dessas cores existe num canteiro, para praga nunca se confundir
com planta.

### A cara não é assustadora

A primeira versão punha uma sobrancelha em cunha sobre cada olho, para dizer
"bravo" sem rosto. Na tela ela não leu como sobrancelha: leu como uma **faixa
preta atravessando o olho**, e o bicho ficou assustador — que é o oposto do que
este minigame quer ser. Agora é olho redondo com pupila redonda, e mais nada.

A pupila é levantada 0,45 rad no globo, porque a câmera olha de 34° de cima e no
equador ela some atrás da própria testa do olho (o bicho fica com dois olhos de
bola de gude). E ela nunca vira para dentro: pupila convergindo deixa o bicho
vesgo, e vesgo lê como bobo, não como ameaça.

Malvados eles são pelo que **fazem** — vêm comer a horta —, pela garra laranja e
pelo jeito de andar. Não precisa estar na cara.

### Como olhar para eles

Nenhuma praga está numa cena ainda: sem um script, não haveria como VER o que
foi feito, e o que não se vê não se ajusta.

```bash
node scripts/pragas.mjs /tmp/pg   # enfileira as seis e tira retrato de cada uma
```

Ele mede cada bicho pela **geometria desenhada** (os oito cantos da caixa de
cada malha levados para o mundo), e não por raio inventado: já foi medindo
colisor que passaram verde dois defeitos que estavam na tela. Guarda o contrato
do kit (base em `y = 0`, centrada na origem), o teto de malhas por tier (o jogo
roda em celular e vão existir muitas ao mesmo tempo), a régua de tamanho acima,
que **nenhuma repete a cor principal de outra**, que a barra de vida cabe em
cima da cabeça de cada uma, e que nenhuma encosta na outra na fila.

---

## 6. As melhorias, e as raridades

A cada nível o jogo para e oferece **três** cartas. A raridade sai de um sorteio
com peso, e o peso muda com o nível — nível alto tira mais raro.

**O catálogo e o sorteio estão construídos** (`src/minigames/jardim/`), como
lógica pura, e `node scripts/cartas.mjs` joga mil rodadas até o baralho acabar
para provar as regras abaixo. Hoje são 88 cartas mais 3 de consolo.

### Carta nenhuma se repete — **construído**

Pedido do Renan: **carta que você já tem não aparece de novo**. Quem guarda
isso é a `MaoDeCartas` (`minigames/jardim/baralho.ts`): uma lista de ids, na
ordem em que foram escolhidos, que nasce vazia com a rodada e morre com ela.
Tudo o que as cartas fazem — os números, as regras, o desenho do regador, o
estágio dele — é **derivado** dessa lista toda vez que alguém pergunta, e não
acumulado; assim nenhum número "escorrega", e a rodada de qualquer momento se
reconstrói só com os ids.

O sorteio olha o baralho **menos a mão**, e também:

- **série anda em ordem.** Empilhar alcance continua valendo, mas como três
  cartas diferentes: *Bico mais longo*, *II* e *III*, e a II só sorteia com a I
  na mão. É o desenho do Vampire Survivors;
- **`exclui` é de mão dupla**: duas cartas que brigam pela mesma coisa nunca
  convivem (*Lá de trás* × *Os dois na frente*);
- **as três famílias na mesa**: dentro da raridade sorteada, o jogo prefere uma
  família que ainda não está entre as três — e sorteia a família antes da carta,
  senão o regador (15 comuns) ganharia sempre. Medido: 100% das mesas do começo
  têm as três famílias;
- **quando o baralho acaba**, os buracos se enchem de **consolos** (*Gole
  d'água*, *Muda de reserva*, *Susto*): efeito na hora, podem repetir, não
  entram na mão. Consolo nunca aparece enquanto há três cartas de verdade.

| raridade | cor | peso no nível 1 | peso no nível 10 |
|---|---|---|---|
| comum | verde | 70 | 35 |
| incomum | azul | 25 | 35 |
| raro | roxo | 5 | 22 |
| lendário | dourado | 0 | 8 |

**Lendária não sai antes do nível 4.** Roguelite em que a primeira carta decide
a rodada é roguelite que não tem rodada.

### Regador — os números

O Renan foi explícito: **começa melhorando o regador**. As comuns são as linhas
da tabela do §4, cada uma numa **série de três degraus** (I, II, III) — pegar
"mais alcance" três vezes continua sendo jogada válida, sem carta repetida.

| carta | raridade | efeito (por degrau) |
|---|---|---|
| Bico mais longo I–III | comum | +18% alcance |
| Jato firme I–III | comum | +20% dano |
| Braço solto I–III | comum | −12% cadência |
| Leque aberto I–III | comum | +10° de abertura |
| Tanque maior I–III | comum | +4 de água |

E as do mesmo baralho que mudam a regra do jato:

| carta | raridade | efeito |
|---|---|---|
| Segundo bico | incomum | o jato sai também para trás |
| Orvalho | incomum | o tanque enche sozinho 50% mais rápido |
| Mangueira | raro | o alcance dobra, mas a cadência piora 40% |
| Regador de pressão | raro | o jato atravessa o primeiro bicho e acerta o de trás |

E as que vieram do banco de ideias (⚙ = regra nova, que o minigame ainda precisa
obedecer — ver "Do banco de ideias para o baralho", no fim desta seção):

| carta | raridade | efeito |
|---|---|---|
| Gota pesada I–III | comum | cada jato empurra o bicho 30 cm para trás (por degrau) |
| Refil rápido I–II | comum | encher no tonel fica 40% mais rápido (por degrau) — exclui *O Jean-Luc no tonel* |
| Água morna | comum | +25% de encharque em tanque e chefe |
| Gota gelada ⚙ | incomum | o bicho molhado anda 30% mais devagar por 2 s |
| Jato em arco ⚙ | incomum | o jato passa por cima do canteiro e acerta quem come do outro lado |
| Borrifador ⚙ | incomum | cada jato sai em três gotinhas: acerta mais bichos, cada uma mais fraca |
| Mira no grandão ⚙ | incomum | o regador prefere o bicho com mais vida — exclui *Mira em quem come* |
| Mira em quem come ⚙ | incomum | o regador prefere quem já está num canteiro — exclui *Mira no grandão* |
| Garoa ⚙ | incomum | você deixa um rastro de gotinhas; bicho que pisa leva meio jato |
| Pressão acumulada ⚙ | incomum | o primeiro jato depois de encher o tanque encharca o triplo |
| Crivo giratório ⚙ | raro | a cada 4 s o regador gira e molha em volta, 360° |
| Água com sabão ⚙ | raro | bicho espantado solta uma bolha; ela estoura e molha quem está perto |
| Jato carregado ⚙ | raro | ficar parado 1,5 s carrega um jatão que atravessa a fila inteira |
| Balde ⚙ | raro | segurar E derrama o tanque inteiro num círculo de 2 m em volta |
| Gêiser ⚙ | lendário | a cada 20 s um gêiser brota embaixo do bicho mais forte e o joga pela porta |
| Arco-íris ⚙ | lendário | um jato a cada dez atravessa tudo e dobra as gotas de quem ele espanta |

### As três famílias de carta

O sorteio tira de três baralhos misturados, e **as três precisam estar na mesa**
para a escolha ser interessante. Três cartas que só sabem dar +% ao regador não
é uma escolha, é um clique.

| família | o que ela mexe | como ela se sente |
|---|---|---|
| **REGADOR** | os quatro números do §4, e as regras do jato | "eu bato mais forte" |
| **JARDINEIRO** | você — velocidade, alcance de coleta, o corpo | "eu me viro melhor" |
| **JARDIM** | a estufa — canteiro, tonel, portas, a Josefina | "o campo joga a meu favor" |

**A regra que guia carta nova: carta comum mexe em número, carta rara mexe em
regra.** Se uma ideia só sabe dar +X%, ela é comum, por melhor que pareça.

#### Jardineiro — o que muda em você

| carta | raridade | efeito |
|---|---|---|
| Passo leve I–II | comum | +12% de velocidade |
| Bolso furado | comum | as gotas são puxadas de 2 m em vez de pisadas |
| Bota de jardim | comum | terra de canteiro não te segura mais |
| Fôlego | incomum | o tanque enche sozinho enquanto você anda, e não só no tonel |
| Chinelada | incomum | encostar num bicho dá um empurrão que o joga 2 m para trás |
| Grito | raro | uma vez por onda, tudo num raio de 4 m recua até a porta |
| Dedo verde | raro | canteiro machucado recupera 1 ponto entre uma onda e outra |
| **Os dois na frente** | lendário | quem ficou lá atrás pega o outro regador e vem regar do seu lado |
| Chapéu de palha | comum | cada jato gasta 15% menos água |
| Descanso na sombra | comum | parado, o tanque enche 50% mais rápido |
| Pique ⚙ | incomum | andar 2 s sem parar dá +30% de velocidade, até você parar |
| Assobio ⚙ | incomum | a cada 12 s o bicho mais perto vira de costas e anda 2 s para o outro lado |
| Pé na poça ⚙ | incomum | pisar numa poça dá um impulso — **só sorteia com a Poça na mão** |
| Olho de jardineira ⚙ | incomum | você vê para qual canteiro cada bicho está indo |
| Troca de turno ⚙ | incomum | o `T` troca quem joga e quem fica atrás; quem entra chega de tanque cheio — exclui *Os dois na frente* |
| Coraçãozinho ⚙ | incomum | a cada 20 gotas sobe um coração da dupla, e os bichos perto param 1 s para olhar |
| Ímã de gota ⚙ | raro | ao subir de nível, todas as gotas do chão voam até você |
| Sorte de principiante ⚙ | raro | a próxima tela de cartas vem com tudo uma raridade acima |
| Pulinho ⚙ | raro | encostar num bicho pequeno dá um pulo por cima dele |
| Bis ⚙ | raro | a próxima carta de série que sair já vem um degrau acima |
| Dança da chuva ⚙ | lendário | ficar parado 3 s faz chover 5 s em volta de você |

*Mãos dadas* e *Regador do Renan* **saíram**: as duas supunham os dois na
frente desde o começo, e o Renan decidiu que quem não é controlado fica atrás
(§1). No lugar entraram *Lá de trás* e *Os dois na frente*, que se excluem.

#### Jardim — o que muda no campo

| carta | raridade | efeito |
|---|---|---|
| Terra adubada I–II | comum | os canteiros aguentam 25% mais mordida |
| Segundo tonel | comum | nasce um tonel do outro lado: a viagem pela água encurta |
| Poça | incomum | onde o jato cai fica escorregadio 4 s, e quem passa anda devagar |
| Lá de trás | incomum | quem ficou com a Josefina rega o canteiro mais perto dele |
| Espantalho | raro | um espantalho onde você escolher puxa o alvo dos bichos por 20 s |
| Josefina ajuda | raro | ela sai do canto e rega um canteiro por conta dela, uma vez por onda |
| Portão emperrado | raro | uma das três portas fecha pelo resto da rodada |
| Cerca viva | lendário | um canteiro à sua escolha fica intocável até o fim |
| Chuva | lendário | a estufa inteira leva um jato, de uma vez, a cada 30 s |
| Compostagem I–II | comum | cada bicho espantado devolve 5% de vida ao canteiro mais perto (por degrau) |
| Sino da porta ⚙ | comum | um sininho toca quando um bicho passa por um portão — conforto, como a Bota |
| Girassol vigia ⚙ | incomum | os girassóis viram para o portão de onde vem o próximo bicho |
| Cerquinha ⚙ | incomum | nasce uma cerca baixa no terreiro que os bichos têm que contornar |
| Toldo ⚙ | incomum | um canteiro à sua escolha aguenta 50% mais |
| Canteiro de pimenta ⚙ | raro | quem morde esse canteiro sai correndo e solta 2 gotas |
| Aspersor ⚙ | raro | um aspersor no meio do terreiro molha num raio de 2,5 m a cada 3 s |
| Sementeira ⚙ | raro | canteiro comido até o fim vira muda e volta com metade da vida na onda seguinte |
| Planta carnívora ⚙ | lendário | um canteiro vira dioneia: morde o primeiro bicho que encostar, e recarrega em 15 s |
| Estufa trancada ⚙ | lendário | os portões seguram os bichos 10 s no começo de cada onda |

**Os do clube vêm ajudar** — também família JARDIM. Usam os personagens com
nome como AJUDANTES, nunca como alvo (a regra das pragas continua valendo: gente
não leva jato).

| carta | raridade | efeito |
|---|---|---|
| Apito da Gina ⚙ | incomum | uma vez por onda a Gina apita da porta e todo bicho congela 1,5 s |
| Picolé do Mano ⚙ | incomum | no fim de cada onda cai um picolé: pegar enche o tanque e dá velocidade por 10 s |
| O Noel avisa ⚙ | incomum | o Noel sobe no muro e grita qual portão abre na próxima onda |
| O Jean-Luc no tonel ⚙ | incomum | o pato fica no tonel, e encher o tanque ali é na hora — exclui *Refil rápido* |
| O Capy salva-vidas ⚙ | raro | uma vez por onda o Capy dá um jato longo pelo corredor do meio |
| O Walter de plantão ⚙ | raro | o Walter late para o bicho mais perto de um canteiro, e ele recua até a porta |
| Adubo do Noel ⚙ | raro | canteiro que você rega fica mais forte até o fim da onda |

### O regador MUDA DE CARA quando você melhora ele

Esta é a regra que amarra as cartas ao resto do jogo, e ela é barata porque
neste projeto todo modelo é geometria procedural: **carta que mexe no regador
mexe também na peça na mão**. Nada de ícone de buff no canto da tela — o
upgrade aparece no objeto.

| carta | o que aparece na peça |
|---|---|
| Bico mais longo | o bico estica de verdade |
| Leque aberto | o crivo da ponta alarga e ganha mais furos |
| Tanque maior | o corpo engorda e a alça sobe |
| Jato firme | o bico ganha uma ponteira de latão |
| Braço solto | a alça vira um cabo de madeira lixado |
| Segundo bico | nasce um bico atrás, virado para trás |
| Mangueira | uma mangueira enrolada pendurada no corpo |
| Orvalho | um respiro de cobre no topo, soltando vapor |
| Chuva | uma nuvenzinha que flutua um palmo acima da peça |

E o regador tem **três estágios visíveis**, pelo número de cartas de REGADOR que
você pegou: `0–2` o de lata amassada que a Josefina empresta, `3–5` um
reforçado de latão, `6+` um de competição, que é o troféu de uma rodada boa. É
o que faz o jogador olhar para a própria mão no fim e ver a rodada que ele jogou.

**O parceiro carrega a mesma evolução.** São sempre dois em cena, e um regador
de competição ao lado de uma lata amassada contaria uma história errada.

Para criar carta nova sem reabrir este documento inteiro existe uma skill:
`.claude/skills/aristory-habilidade/SKILL.md`.

### A tela das três cartas — **construída**

Um pop-up por cima do mundo, em DOM (`src/ui/telaDeCartas.ts`, e o desenho no
bloco "TELA DAS TRÊS CARTAS" do `style.css`) — o pedido do Renan foi que não
fosse modelo 3D, e que as cartas fossem muito bem desenhadas. Cada carta mostra,
de cima para baixo, uma resposta para cada pergunta que o jogador faz:

| parte | responde |
|---|---|
| a **moldura**, na cor da raridade (verde, azul, roxo, dourado; barro no consolo) | "isto é raro?" — é a primeira leitura, de longe |
| a **fita** da família (azul-água, terracota, verde-folha) | "isto melhora o quê?" |
| o **medalhão** com o emoji, num halo que respira | "o que é isto?" |
| o **nome**, e as **bolinhas da série** quando é uma | "tem mais depois?" |
| o **texto**, numa tira de papel | "o que muda?" |
| o selo **"muda o regador"**, quando muda | "vou ver isso na mão?" |
| o **rodapé** com a raridade e as pedrinhas (1 a 4) | a raridade de novo, para quem não lê cor |

A rara pulsa, a lendária tem um reflexo de ouro atravessando e brilho fixo.
As três entram viradas, uma depois da outra, como cartas sendo dadas. No pé da
tela fica **a mão** — o que já foi pego, em fichinhas —, porque a escolha
depende do que você já tem.

**Ela não fecha sem escolha** (sem botão de fechar, sem Escape) e a escolha é em
**dois tempos**: o primeiro toque marca e a carta sobe, o segundo pega. No
teclado, `1` `2` `3` ou as setas marcam, e `E` pega. No celular em pé as três
cartas viram faixas deitadas, uma embaixo da outra.

**Tudo o que a tela mostra é derivado da carta** (`minigames/jardim/tela.ts`):
a série sai do id, e o selo "muda o regador" sai de aplicar a carta numa ficha
zerada e ver se ela mexeu no `estilo`. Carta nova entra na tela sem uma linha de
CSS.

**Para ver sem a rodada existir:** `?cena=estufa&treino=gotas` liga um treino na
estufa — gotas caem perto da dupla como se um bicho tivesse sido espantado ali,
a barra enche, a tela abre com o sorteio de verdade, e a carta pega entra na mão
e muda o regador. `node scripts/gotas.mjs /tmp/gt` faz isso sozinho e fotografa
uma mesa de cada raridade, no computador e no celular.

### Do banco de ideias para o baralho

As 46 ideias que estavam aqui numeradas **viraram carta de verdade**, todas de
uma vez, a pedido do Renan: "pode criar todas as cartas que você mencionou" —
ele ajusta depois de testar. Elas estão nas tabelas das famílias acima, e o
baralho foi de 38 para **88 cartas** (38 de regador, 22 de jardineiro, 28 de
jardim, contando cada degrau de série).

O que isso quer dizer hoje, com a rodada (etapa 3) ainda por construir:

- **Já funcionam de ponta a ponta** no sorteio, na mão e na tela: saem nas três
  cartas, não repetem, respeitam série, `exclui` e o piso da lendária.
- **As ⚙ ligam uma regra** (`RegraDoJardim`, em `cartas.ts`, cada uma com um
  comentário do que faz). Quem obedece a regra é o código do minigame, que entra
  junto com a rodada — como já era o caso da Poça, do Grito ou da Chuva.
- **As sem ⚙ mexem em número** da `FichaDaRodada`. Seis números novos entraram
  para elas: `empurraoDoJato`, `contraOGrandao`, `refil`, `gastoPorJato`,
  `recargaParado` e `compostagem`.
- **Nenhuma das novas de regador muda a peça da mão ainda** — por isso a tela
  não põe nelas o selo "muda o regador". Cada uma que ganhar desenho (a Gota
  gelada deixando o bico azulado, o Balde trocando a lata) passa pela skill
  `aristory-prop` e o selo aparece sozinho.

Três pares se excluem, porque um deixaria o outro morto: *Mira no grandão* ×
*Mira em quem come*, *Refil rápido* × *O Jean-Luc no tonel* e *Troca de turno*
× *Os dois na frente*. E o *Pé na poça* só sorteia com a *Poça* na mão.

---

## 7. A experiência, e o nível

**A rodada começa sempre do nível 0.** Isso é o coração do gênero (o Renan citou
o Vampire Survivors, e é exatamente isso): o que se leva de uma rodada para a
outra é o dinheiro dos canteiros vivos e o que se aprendeu jogando — **nunca
poder**. Duas rodadas seguidas com o mesmo começo e cartas diferentes têm que
dar jogos diferentes, e isso só acontece se ninguém entra na rodada já forte.

Bicho espantado solta uma **gota** no chão. A gota não vai sozinha para você:
você tem que passar por cima. É o que puxa o jogador para fora da posição
confortável, e é a mecânica mais barata de tensão que o gênero tem. Gota que
fica no chão mais de 20 s seca e some.

### Quanto cada praga solta

Bicho mais forte solta mais, e a régua é a mesma do `encharque` (§5) — quem deu
mais trabalho paga mais:

| praga | tier | gotas |
|---|---|---|
| Lagartejo | fraco | 1 |
| Gafanhopo | fraco | 1 |
| Tucanguru | médio | 2 |
| Coelhatu | médio | 3 |
| Preguipolvo | tanque | 8 |
| Mãe-Lagartejo | chefe | 25 |

O tanque e o chefe soltam as gotas **espalhadas**, e não empilhadas: oito gotas
no mesmo ponto é um clique, oito gotas num raio de 3 m é uma decisão.

### A curva: barato no começo, caro no fim — **construído**

O primeiro nível custa 5 gotas, e dali em diante **o degrau cresce 1 a cada 2
níveis** (`custoDoNivel`, em `minigames/jardim/progressao.ts`):

| nível | custo | acumulado |
|---|---|---|
| 0 → 1 | 5 | 5 |
| 1 → 2 | 7 | 12 |
| 2 → 3 | 10 | 22 |
| 3 → 4 | 13 | 35 |
| 4 → 5 | 17 | 52 |
| 5 → 6 | 21 | 73 |
| 6 → 7 | 26 | 99 |
| 7 → 8 | 31 | 130 |
| 8 → 9 | 37 | 167 |
| 9 → 10 | 43 | 210 |

A primeira versão era `4 + nível^1,6`, arredondada — e o arredondamento fazia
o degrau **encolher** no meio (22 → 26 → 32): subir de nível ficava mais barato
de repente, o contrário do pedido. Escrita como degrau, a curva só sobe, e o
teste cobra isso.

Os **três primeiros níveis saem quase de graça** — cinco lagartejos e você já
escolheu uma carta. Isso é de propósito: roguelite que demora a dar a primeira
carta é roguelite que o jogador abandona na primeira rodada. Do nível 5 para
frente cada carta custa uma onda inteira, e é aí que as escolhas passam a doer.

Uma rodada de 5 ondas solta perto de 210 gotas se nenhum bicho escapar, então
ela termina por volta do **nível 10, com 10 cartas escolhidas**. Esse é o alvo,
e o `scripts/cartas.mjs` já o confere: ele monta o roteiro das cinco ondas
trezentas vezes e mede o nível final (hoje, 10,0 em média). Quando o minigame
existir, a conta passa a ser com os bichos que de fato foram espantados.

**As gotas de cada praga estão na ficha dela** (`FichaDePraga.gotas`, em
`world/bichosDoJardim.ts`), ao lado do `encharque`: quem desenha o bicho diz
quanto ele vale.

**As ondas também já são lógica**: `ONDAS` é a tabela do §3, e
`planoDaOnda(n, rng)` devolve quem entra, quando e por qual porta — a estreia
em ordem de tier, o bicho novo sozinho por uma porta só nos primeiros 10 s, e
o tanque e o chefe só como entrada anunciada.

---

## 8. Por onde os bichos entram, e o que a estufa tem

### As três portas numa parede só — **construído**

O Renan propôs **três portas numa parede só**, na parede oposta à da saída (o
fundo do prédio, visto do clube). Substitui as quatro bocas de canto que a área
tem hoje. É o desenho melhor, e por razões concretas:

- **Bicho que pode vir de qualquer canto transforma o jogo em girar a câmera.**
  A rodada vira checar as costas em vez de decidir. Com uma frente só, você
  sempre sabe de onde vem, e o que sobra para decidir é *qual das três cobrir* —
  que é decisão de verdade. **Três, e não uma**, é o que impede de estacionar
  num ponto e resolver a fase;
- **dá sentido ao espaço.** A parede das portas vira a frente de batalha e o
  lado da saída vira o fundo que se defende. É lá que as plantas densas moram
  (§8.2), então elas passam a ser *a coisa protegida* em vez de enfeite;
- **a continuidade fecha:** o `-Z` da cena interna é o fundo do prédio visto do
  jardim do clube.

**A consequência veio junto, e era a parte cara:** com os bichos vindo de uma
parede só, os canteiros tiveram que sair de lá. A fileira do fundo ficava em
`z = -8,8`, que é exatamente onde os portões abriram — o bicho entraria e
comeria no primeiro passo. Os oito canteiros agora formam **uma ferradura
aberta para os portões**: quatro na parede da saída e dois em cada lateral,
todos na metade `+Z`. Assim todo bicho que entra precisa **atravessar o
terreiro inteiro** para chegar em qualquer horta, e essa travessia é o jogo.

**O terreiro andou para o fundo junto** (`16 × 13`, centrado em `z = -1,5`): o
campo de jogo é a faixa entre as portas e os canteiros, e o meio geométrico da
estufa deixou de ser o meio do jogo.

**A oficina e o tonel trocaram de lado**, e isso é regra de jogo disfarçada de
decoração. A bancada foi para a metade `+Z`, perto da saída — é de lá que a
Josefina entrega os regadores, e o posto dela não pode ser o lado por onde
entra bicho. **O tonel foi para a metade `-Z`**, a quatro metros do portão do
meio: o §4 diz que a água acaba e que a viagem até o tonel é o que deixa os
canteiros sozinhos. Se reabastecer fosse seguro não custaria nada; agora custa
andar **na direção das portas**.

**A faixa de chegada ficou vazia de planta**, a pedido do Renan, e ele está
certo pelas duas pontas: não faz sentido a Josefina plantar em cima de onde os
bichos passam, e não faz sentido encher de enfeite justamente a faixa que
precisa estar legível quando os três portões cospem bicho ao mesmo tempo. O que
decora ali é **estrutura**: os três portões de pedra, os caminhos que saem
deles e o jardim que continua do lado de fora.

### O pátio de trás — e ele é jogável

Começou como paisagem (grama pintada atrás do vidro, só para o portão não
parecer um buraco na parede) e virou **chão de jogo**, por dois pedidos do
Renan que mudam o que a área é:

**1. Dá para sair.** A ideia de jogo é dele: *enquanto vem pouco bicho, você
atravessa o portão e intercepta lá fora, antes que eles entrem; quando vier
muito, você recua e segura do lado de dentro.* Isso transforma os três portões
de "spawn" em **decisão** — ficar na frente ou atrás deles —, e é a melhor
mecânica que o minigame ganhou até agora sem custar uma linha de lógica.

O limite de caminhada passou a abraçar a estufa **e** o pátio. Quem segura a
dupla dentro do vidro deixou de ser o limite e passaram a ser as **paredes**: a
de `-Z` tem colisor em todo lugar menos nos três vãos, e as laterais acabam em
`z = -11`.

**2. Não dá para dar a volta.** A grama corria pelos quatro lados do prédio, e
por ela dava para contornar a estufa e voltar pela frente. O chão agora são
**dois retângulos que se encostam**, e não um gramado gigante por baixo de
tudo: a estufa é terra batida, o pátio é grama, e não existe verde em lugar
nenhum a não ser atrás das portas. O pátio é fechado por sebe nos dois lados e
no fundo — um beco, de propósito. A sebe é mais alta que a do clube (1,6 contra
1,05) porque aqui ela é **limite**, e não enfeite.

**O que cresce lá fora segue a regra do terreiro**: os três corredores dos
portões ficam limpos, e árvore e moita vão para as faixas entre um corredor e
outro, onde emolduram o vão em vez de tapá-lo.

### A corrente de entrada, e as três chances de interceptar

A sebe do fundo **abre em três brechas**, no fim de cada caminho de pedra e no
eixo de cada portão (pedido do Renan). Com elas, o caminho do bicho tem quatro
trechos:

```
nasce no gramado de fora  →  BRECHA da sebe  →  caminho de pedra
                          →  PORTÃO          →  a estufa
```

**Cada trecho é uma chance de interceptar**, e é isso que faz "segurar fora"
contra "segurar dentro" virar decisão em vez de preferência. As brechas são
mais largas que o caminho (3,2 contra 2,2) — passagem tem eixo, e o eixo fica
vazio — e duas moitas altas ladeiam cada uma, **fora do vão**: sebe cortada em
quina viva parece parede quebrada, e moita arredondada na ponta parece mato que
abriu.

**A cena publica `entradas`**: um ponto do lado de FORA da sebe, alinhado com
cada brecha. É de lá que o bicho aparece — bicho que nasce dentro do pátio não
dá tempo de ser interceptado, que é a jogada inteira. A distância dali até o
portão é o botão que regula a dificuldade das duas posturas, e é o primeiro
número a girar quando a fase estiver fácil ou impossível demais.

**Corredor limpo é regra, e ela mede a COPA.** Árvore plantada a 2,2 do eixo
tem copa de 1,2 de raio e debruça na calçada: o corredor continua andável (o
colisor é o tronco) mas parece bloqueado, e num jogo isométrico parecer
bloqueado é ser bloqueado. A folga é 3,2.

### 8.2. O que a estufa já tem

A área foi construída antes de tudo, de propósito — foi o pedido do Renan:
*"comece a criar a nova área primeiro, antes de ter a quest, antes de ter
qualquer coisa"*. Ela já nasceu com a planta do minigame desenhada no chão:

- **o meio é vazio.** Um terreiro de saibro de 15 × 11 no centro, sem nada em
  cima. É a arena, e o teste prova isso medindo os colisores;
- **os canteiros estão na beirada**, e são oito. São eles que se defende;
- **o tonel de água no canto**, que é onde o regador vai reabastecer;
- **a bancada de trabalho**, de onde a Josefina vai entregar os regadores.

### 8.3. A regra de altura, que a câmera impõe

Ela não é estética e vale para qualquer coisa que se plante aqui depois:

> **A câmera olha de `+X/+Z`.** O lado da porta de saída (`+Z`) e o lado direito
> (`+X`) são os lados *de perto*: qualquer peça com mais de um metro ali tapa o
> que está atrás, inclusive a dupla andando.

Daí o desenho do verde: o lado da porta leva **densidade, não altura** —
canteiro crescido, moita, capim, tudo abaixo do peito. Folhagem alta e treliça
só nas paredes de longe (`-X` e `-Z`). No lado direito o teto é a prateleira de
mudas (1,05), que guarda verde na **vertical** sem ocupar chão nem tapar
ninguém.

Os canteiros da estufa usam `crescimento: 1,45` — a mesma peça da horta de
fora, com as mudas maiores. É o que faz os dois lugares não parecerem o mesmo
canteiro copiado, e é a fala da própria Josefina depois da quest ("adubo bom
trabalha rápido") virando geometria.

---

## 9. A ordem de construção

| # | etapa | estado |
|---|---|---|
| 0 | **a área**: a estufa, a porta no jardim do clube, o caminho | **pronto** (§10) |
| 0.5 | **a skill `aristory-praga`**, para praga nova sair barata | **pronto** |
| 1 | a skill `aristory-habilidade`, para carta nova sair barato | **pronto** |
| 2 | a quest do adubo (banco → Noel → Josefina → convite) | **pronto** (§2) |
| 2.5 | as três portas na parede do fundo, e os canteiros puxados para lá | **pronto** (§8) |
| 2.7 | **os modelos das seis pragas**, para poder olhar e ajustar antes da lógica | **pronto** (§5) |
| 2.8 | **a entrada**: pegar o regador, regar 3 canteiros, a Josefina chegar | **pronto** (§3) |
| 2.9 | **o modelo do regador**, já pronto para as melhorias mudarem a peça | **pronto** (§4) |
| 2.95 | **a Josefina entra junto**, passeia lá dentro, pede confirmação e leva o parceiro para o posto de trás | **pronto** (§3) |
| 2.97 | **a lógica**: o baralho, a mão que não repete carta, a curva de nível, as gotas por praga e o roteiro das ondas | **pronto** (§6, §7) |
| 3 | o esqueleto do minigame: onda, regador automático, um bicho só (o Lagartejo) | a fazer |
| 4 | os canteiros como alvo, e o placar por canteiro vivo | a fazer |
| 5 | gota no chão e a tela de três cartas (a conta de nível e o sorteio já existem) | a fazer |
| 6 | as cartas comuns (as do regador), **e o regador mudando de cara** | a fazer |
| 7 | o resto do elenco de bichos, um por onda, na rampa do §3 | a fazer |
| 8 | as cartas de JARDINEIRO e de JARDIM, e as raras | a fazer |
| 9 | o pagamento, a memória e a fala de despedida da Josefina | a fazer |

A etapa 3 é a que decide se o resto vale: um regador que atira sozinho num
bicho que anda devagar já é jogo ou não é. **Não construa 5 antes de jogar 3.**

---

## 10. O que já está no jogo

**A estufa** (`src/scenes/estufa.ts`), ligada ao jardim do clube pelos dois
lados. A casca de fora é a peça `estufa()` do kit, plantada no fundo do jardim,
no eixo do caminho de pedrinha; por dentro é um galpão de vidro de 32 × 24 com o
terreiro no meio, oito canteiros na beirada, a bancada de trabalho, o tonel e as
prateleiras de muda.

**As peças novas do kit** (`src/world/props.ts`): `estufa()` (a casca),
`bancadaDeJardinagem()`, `tonelDeAgua()`, `folhagemAlta()`,
`trelicaComTrepadeira()`, `prateleiraDeMudas()` e `portaoDeJardim()`. Mais o
parâmetro `crescimento` do `canteiroDeHorta()`.

**A quest** (§2), espalhada por três arquivos: o saco no banco do fundo em
`scenes/villaLobos.ts`, a troca com o Noel e a entrega à Josefina em
`scenes/clube.ts`, e as duas fichas (`sementes`, `adubo`) em `world/itens.ts`.
A peça é uma só, `sacoDeGraos()`, em dois jogos de cor.

**O regador e a entrada do minigame.** A peça em `src/world/regador.ts`
(`regadorDeJardim(estilo)`, mais `estagioDoRegador(cartas)`), a ficha de item em
`world/itens.ts`, a pose `regando` no `CharacterRig`, e o ritual inteiro no fim
de `scenes/estufa.ts`: pegar da bancada, regar três canteiros e a cutscene da
Josefina. O **gancho da rodada** está marcado no código, no fim da cutscene —
é uma chamada só, com a dupla já de regador na mão.

**A Josefina dentro da estufa** (fim de `scenes/estufa.ts`): depois do convite
ela entra atrás da dupla, passeia na metade das plantas e, na conversa, pede
confirmação e manda cada um para o seu posto (§3).

**As cartas e a progressão** (`src/minigames/jardim/`): `cartas.ts` (o
catálogo e a `FichaDaRodada`), `baralho.ts` (a `MaoDeCartas`, o registro das
cartas pegas e o sorteio) e `progressao.ts` (curva, gotas e ondas). Lógica
pura, sem cena: a rodada vai importar isto pronto.

**As seis pragas** (`src/world/bichosDoJardim.ts`): `lagartejo()`, `gafanhopo()`,
`coelhatu()`, `tucanguru()`, `preguipolvo()` e `maeLagartejo()`, mais o catálogo
`PRAGAS` que liga cada uma ao tier e ao encharque. São só os MODELOS — nenhuma
delas anda, ataca ou aparece numa cena ainda (§5).

**Os testes**: `node scripts/cartas.mjs` (no Node, sem navegador) joga mil
rodadas de cartas e trezentas de ondas; `node scripts/postos.mjs /tmp/pt` faz a
Josefina entrar junto, passear sem pisar em canteiro e mandar cada um para o
posto. `node scripts/estufa.mjs /tmp/ef` prova que a porta abre nos dois
sentidos, que o terreiro do meio está mesmo vazio (nenhum colisor dentro dele),
que os oito canteiros existem e que as quatro bocas estão desobstruídas.
Ele também **atravessa os três portões andando**, um por um, e confere que a
dupla sai de verdade para `z < -11`: folga geométrica não prova passagem, e
uma pilastra ou uma soleira de alvenaria no vão só aparece quando alguém tenta
passar. Depois ele encosta na sebe de cada lado do pátio e exige que ela **não
deixe contornar a estufa** nem voltar pela frente por fora. `node scripts/adubo.mjs /tmp/ad` percorre a
quest inteira e guarda o que é fácil de quebrar sem perceber: a estufa trancada antes da hora, a Josefina calada
sobre ela, os rótulos que trocam sozinhos e ninguém emudecendo depois de
receber o presente.

---

## 11. Notas de implementação, para quando chegar a hora

**O minigame mora em `src/minigames/`**, como o `turnoDoMania.ts`. Ele recebe
uma planta (`PlantaDoJardim`: onde é o terreiro, onde estão os canteiros, onde
são as bocas, onde é o tonel) e **não sabe que existe uma estufa** — quem conhece
o cenário é a cena.

**Os bichos invasores não são `Bicho.ts`.** Aquela classe é para personagem com
nome, rotina de passeio e conversa. Invasor é um enxame descartável: uma malha
simples, uma posição, um alvo e um encharque. Cuidado real — vinte instâncias de
`Bicho` por onda derrubariam o celular.

**Som.** Já existem e servem: `gluglu` (o tanque enchendo), `sino` (subir de
nível), `pegar` (a gota). Faltam receitas novas em `audio/efeitos.ts`: **jato**
(o chiado do regador) e **sacudida** (o bicho encharcado indo embora). Sintetizadas,
como todo o resto — nenhum `.wav` entra no repositório.

**HUD.** Nem `showPlacar` nem `showTurno` servem. Entra um
`showJardim({ onda, agua, nivel, gotas, canteiros })`, e a tela de escolha é um
painel novo de três cartas no `Ui.ts` — o mesmo formato do painel de inscrições
da arena, que já sabe desenhar carta com moldura por raridade.

**Teste.** O Chromium sem tela roda o tempo de jogo a ~1/5 do relógio: o script
espera por EVENTO, nunca por tempo. Asserções mínimas quando existir: o regador
dispara sozinho sem tecla; bicho parado em canteiro para de perseguir; canteiro
comido não volta; a tela de três cartas aparece no nível certo e some ao
escolher; lendária não sai antes do nível 4; e a rodada fecha pagando por
canteiro vivo.

---

## 12. O que está esperando resposta do Renan

Isto fica escrito aqui, e não numa conversa, por um motivo prático: conversa
acaba. Toda vez que uma decisão deste plano depender dele, a pergunta vem para
cá — assim quem continuar o trabalho amanhã sabe o que ainda não foi decidido,
em vez de inventar uma resposta e seguir.

**Sobre as cartas (§6):**

1. **Reroll.** Vale a Josefina dar um "não gostei, mostra outras três" por
   rodada? A recomendação é que sim, e **um só** — o suficiente para salvar uma
   mão ruim sem virar uma quarta escolha grátis.
2. ~~**Carta repetida.**~~ **Respondida pelo Renan: carta não se repete.** A
   comum que empilhava virou série de três degraus (§6).
3. **A chefe.** A Mãe-Lagartejo entra na onda 5 de toda rodada, ou só a partir
   da segunda vez que se joga? A favor da segunda: a primeira rodada é a que
   ensina, e chefe na estreia é onde roguelite costuma perder gente.

**Sobre a dupla na rodada (§1):**

6. **O `T` no meio da rodada.** Com um na frente e o outro atrás, o `T` pode
   fazer duas coisas: (a) ficar **desligado** durante a rodada, ou (b) **trocar
   quem está na frente** — quem estava atrás vem com o tanque cheio, e quem
   estava na frente vai descansar ao lado da Josefina. A recomendação é (b):
   vira uma decisão de jogo (revezar para não voltar ao tonel) sem custar
   carta nenhuma.

**Sobre os modelos (§5):**

4. **A crosta do dorso da Mãe-Lagartejo** ainda lê como uma tampa chapada
   pousada nas costas, e não como parte do bicho. É a única coisa dos seis
   modelos que eu mudaria sem ele pedir — mas é ajuste de gosto, e o gosto é
   dele e do Ari.

**Sobre a pose (§4):**

5. **O braço do regador** ficou estendido para a frente (0,9 rad) para a lata
   pendurada não raspar no chão. Dá para trazer mais para o lado do corpo, ao
   preço de a lata chegar mais perto do chão — a conta está no comentário da
   pose `regando`, em `CharacterRig.ts`.
