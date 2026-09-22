# A Estufa da Josefina — plano do minigame do jardim

> Documento de PROJETO. **As etapas 0 e 2 estão no jogo** (§10): a área existe,
> e a quest que a destranca também. O minigame em si ainda é plano. Quando uma etapa
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

**São dois regadores.** A dupla está em cena como sempre, e o parceiro também
rega — ele segue você, com o mesmo alcance, disparando sozinho. A tecla `T`
troca quem você controla, e quem você larga continua regando de onde estava. É a
mesma tensão do turno do Mania (`MINIGAME-RESTAURANTE.md` §1): **onde eu
estaciono a minha outra metade**.

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

Uma rodada é curta de propósito: **algo entre 4 e 6 minutos**. Roguelite é jogo
de repetir, e repetir só é gostoso se recomeçar é barato.

| fase | o que acontece |
|---|---|
| **preparo** | a Josefina entrega os dois regadores e diz quantas ondas vêm |
| **onda** (×5) | bichos entram pelas beiradas, andam para o canteiro mais perto, você rega |
| **escolha** | a cada nível, o jogo para e mostra **três** melhorias; você pega uma |
| **fim** | conta quantos canteiros sobraram e paga por canteiro vivo |

**O placar é canteiro, não inimigo.** Inimigo derrotado dá experiência (que é o
que faz a rodada evoluir); **canteiro vivo no fim é o que dá dinheiro**. Assim
matar tudo não é a estratégia ótima por definição — segurar a linha é.

**Nem todo bicho morre.** "Derrotar" aqui é **espantar**: o bicho encharca,
sacode, e vai embora pela beirada por onde entrou. Nada morre nesta estufa. É
regra, não detalhe de texto.

---

## 4. O regador

A arma inicial, e a única que não é escolhida — ela já está na mão.
`regador()` já existe em `world/props.ts` e já está largado no jardim do clube.

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

## 5. Os bichos que comem planta

**Esta lista é uma PROPOSTA nova, e precisa do aval do Renan** — a conversa
original em que ela apareceu se perdeu, e o que sobrou dela é: capivara sim,
golfinho não, rato nunca.

Nenhum deles é bicho nomeado do jogo. Os bichos com nome (Pelusa, Walter,
Cookie, Gina, Noel, Capy, Estella, Mano, Jean-Luc, Josefina) são **gente**, e
gente não vira alvo. Os invasores são anônimos de propósito.

| bicho | velocidade | encharque | o que ele faz de diferente |
|---|---|---|---|
| **lagarta** | muito devagar | 2 | o básico. Vai reto no canteiro mais perto e come |
| **caracol** | devagaríssimo | 6 | casca. Os dois primeiros jatos escorregam |
| **pulgão** | rápido | 1 | nunca vem sozinho: entra em nuvem de seis |
| **gafanhoto** | médio, aos pulos | 2 | pula 2 m de cada vez — o jato passa por baixo no ar |
| **coelho** | muito rápido | 3 | corre até o canteiro, dá uma mordida e volta correndo |
| **tatu** | médio | 4 | anda por BAIXO: some do chão e ressurge do outro lado |
| **pombo** | rápido | 2 | voa. Ignora canteiro e vai direto no que estiver em vaso |
| **formiga cortadeira** | média | 1 | corta uma folha e tenta LEVAR. Se ela sair com a folha, o canteiro perde um ponto mesmo sem ser comido |
| **bode** | médio | 8 | come canteiro, come vaso, come a placa. Elite: um por rodada |
| **capivara** | devagar | 12 | **adora água.** O jato praticamente não incomoda: ela só sai empurrada, a jato queima-roupa. A chefe da quinta onda |

A capivara é a piada da fase e a lição de design ao mesmo tempo: existe um
inimigo contra o qual a sua arma inteira não serve, e a resposta é posicionar,
não atirar. (E ela não é o **Capy**, o salva-vidas — são capivaras diferentes, e
alguém tem que dizer isso em voz alta numa fala.)

O elenco cresce como o do Mania: **cada bicho é uma linha numa lista**. Bicho
novo é uma entrada nova, não uma mexida no motor.

---

## 6. As melhorias, e as raridades

A cada nível o jogo para e oferece **três** cartas. A raridade sai de um sorteio
com peso, e o peso muda com o nível — nível alto tira mais raro:

| raridade | cor | peso no nível 1 | peso no nível 10 |
|---|---|---|---|
| comum | verde | 70 | 35 |
| incomum | azul | 25 | 35 |
| raro | roxo | 5 | 22 |
| lendário | dourado | 0 | 8 |

**Lendária não sai antes do nível 4.** Roguelite em que a primeira carta decide
a rodada é roguelite que não tem rodada.

### As primeiras são o regador mesmo

O Renan foi explícito: **começa melhorando o regador**. As quatro comuns são as
quatro linhas da tabela do §4, e elas repetem — pegar "mais alcance" três vezes
é jogada válida.

| carta | raridade | efeito |
|---|---|---|
| Bico mais longo | comum | +18% alcance |
| Jato firme | comum | +20% dano |
| Braço solto | comum | −12% cadência |
| Leque aberto | comum | +10° de abertura |
| Tanque maior | comum | +4 de água |

### As de baixo mudam como se joga

| carta | raridade | efeito |
|---|---|---|
| Segundo bico | incomum | o jato sai também para trás |
| Poça | incomum | onde o jato cai fica escorregadio por 4 s: quem passa anda devagar |
| Orvalho | incomum | o tanque enche sozinho 50% mais rápido |
| Mangueira | raro | o alcance dobra, mas a cadência piora 40% |
| Espantalho | raro | um espantalho plantado onde você escolher puxa o alvo dos bichos por 20 s |
| Josefina ajuda | raro | ela sai do canto e rega um canteiro por conta dela, uma vez por onda |
| Chuva | lendário | a estufa inteira leva um jato, de uma vez, a cada 30 s |
| Cerca viva | lendário | um canteiro à sua escolha fica intocável pelo resto da rodada |
| Regador do Renan | lendário | o parceiro dispara na sua cadência, e não na dele |

A regra que guia carta nova: **carta comum mexe em número, carta rara mexe em
regra**. Se uma ideia de carta só sabe dar +X%, ela é comum, por melhor que
pareça.

Para criar carta nova sem reabrir este documento inteiro existe uma skill:
`.claude/skills/aristory-habilidade/SKILL.md` — **ainda não escrita** (§9).

---

## 7. A experiência

Bicho espantado solta uma **gota** no chão. A gota não vai sozinha para você:
você tem que passar por cima. É o que puxa o jogador para fora da posição
confortável, e é a mecânica mais barata de tensão que o gênero tem.

- `nivel 1 → 2`: 8 gotas
- cada nível seguinte: `8 + nivel * 5` gotas

Gota que fica no chão mais de 20 s some. Gota de bicho elite vale 5.

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

**A cena publica `entradas`** — um ponto no fundo do pátio alinhado com cada
portão. É de lá que o bicho deve aparecer, e a distância até o vão é exatamente
o tempo que a dupla tem para interceptar. Esse número é o que vai regular a
dificuldade de "segurar fora" contra "segurar dentro".

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
| 1 | a skill `aristory-habilidade`, para carta nova sair barato | a fazer |
| 2 | a quest do adubo (banco → Noel → Josefina → convite) | **pronto** (§2) |
| 2.5 | as três portas na parede do fundo, e os canteiros puxados para lá | **pronto** (§8) |
| 3 | o esqueleto do minigame: onda, regador automático, um bicho só (a lagarta) | a fazer |
| 4 | os canteiros como alvo, e o placar por canteiro vivo | a fazer |
| 5 | gota, nível e a tela de três cartas | a fazer |
| 6 | as cartas comuns (as do regador) | a fazer |
| 7 | o resto do elenco de bichos, um por vez | a fazer |
| 8 | as cartas incomuns, raras e lendárias | a fazer |
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

**Os testes**: `node scripts/estufa.mjs /tmp/ef` prova que a porta abre nos dois
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
