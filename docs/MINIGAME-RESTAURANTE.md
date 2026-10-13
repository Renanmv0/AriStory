# Turno no Mania de Churrasco — plano do minigame

> Documento de PROJETO. As etapas 1 e 2 já estão no jogo (§11). A
> **reformulação em turnos** (§13) está sendo construída por etapas (§13.9),
> com as decisões do Renan já tomadas (§13.10). Quando uma etapa for construída, marque-a aqui — e deixe o
> `git log` ser a fonte da verdade do que de fato existe.

## COMECE AQUI

**O que existe no jogo hoje** (etapas 1 e 2, e as **etapas A, B e C** da
temporada): o osso no jardim, o Walter convidando, e a escala na parede
abrindo **a escala do Walter** — o menu dos turnos (`src/ui/escalaDoWalter.ts`)
com a aba das **melhorias**, compradas com petiscos e cada uma aparecendo no
salão (§13.6). Jogáveis: o **turno 1** (o de
antes, igualzinho: 2:45, quatro clientes, gravatinha nas três estrelas) e o
**turno 2, "Sobremesa de pinguim"** (3:00, o Mano estreia pedindo
sobremesa, avental de garçom nas três estrelas). Os turnos 3 a 6 aparecem
na escala (trancados, ou "em preparo" quando abertos). No fim de todo turno
o Walter dá **petiscos**, um por estrela. Os dados moram em
`src/minigames/turnosDoMania.ts`; o motor, em `turnoDoMania.ts`.

Os **turnos 3 e 4** também são jogáveis (etapa C): o Cookie fechando a mesa
do lado e tomando suco, o prato esfriando com o vapor sumindo, o Jean-Luc só
de prato quente e a Estella reparando no uniforme e dando o biscoitinho.

O que o plano antigo previa e **ainda não entrou**: o Pelusa e as três levas
(etapa D, com os turnos 5 e 6).

**O pedido novo do Renan** (outubro de 2026), que é o que está sendo feito:

- manter as mecânicas e o funcionamento de hoje, mas com VARIAÇÃO — não pode
  ser sempre a mesma coisa;
- a escala da parede abre um **menu de turnos** (não "noites": **turnos**),
  pelo menos **seis**, cada um com dificuldade e clientes diferentes;
- o turno seguinte **só abre com três estrelas** no anterior;
- **melhorias permanentes** ("upgrades ou recursos do tipo");
- **cada turno tem um prêmio**: roupa de garçom, de cozinheiro e afins.

O desenho disso está no §13: a escala vira menu (§13.1), os seis turnos
(§13.2), o elenco novo — todos os bichos do jogo entram (§13.3), as estrelas e
a trava (§13.4), os prêmios (§13.5), as melhorias (§13.6), as notas técnicas
(§13.8) e a ordem de construção (§13.9). **As perguntas do §13.10 já foram
respondidas pelo Renan** — a principal: as melhorias se compram com
**Petiscos**, uma moeda que o Walter dá no fim de cada turno, um por estrela
(§13.6). Veja no §13.9 que etapa já está no jogo.

Regras que não mudam com a reformulação: **não dá para perder** (§10), o
jogo é **só das mesas** (a cozinha é do Walter), o elenco é **uma tabela**
(bicho novo = uma linha), a chegada é **fixa** por turno (dá para aprender o
turno) e o restaurante fora do turno continua igual.

---

## O pedido original

O pedido do Renan: um minigame de servir clientes no Mania de Churrasco,
**100% focado em cuidar das mesas** — levar à mesa, anotar o pedido, entregar o
prato e **recolher a louça suja** depois que o cliente come. **Sem cozinha**:
nada de cozinhar, grelhar, montar prato. A cozinha existe, mas é de onde o
prato aparece pronto — não é lugar de jogar.

Os clientes são os bichinhos já construídos, o Pelusa incluído. E **quanto mais
bichos o jogo ganhar, mais dinâmico o minigame fica**: o elenco é uma lista, e
cada bicho novo é uma linha nova nela (§5).

O restaurante continua funcionando **exatamente como funciona hoje** — sentar em
qualquer mesa, abrir o cardápio, o Walter buscar o prato na cozinha, o Walter
passeando pelo salão. O minigame não substitui nada disso; ele é um modo que se
destranca por dentro do jogo, com **o osso** (§2).

---

## 1. A ideia em uma frase

**Você é dois garçons, e só pode ser um de cada vez.**

A tecla `T` troca quem você controla, e **o corpo que você larga fica parado
exatamente onde você o deixou**. Não é co-op de um jogador só — é um jogo de
*onde eu estaciono a minha outra metade*.

O salão do Mania tem **11 mesas** espalhadas em três fileiras desencontradas, e
o **balcão de passagem** num canto: é dali que sai todo prato pronto e é para lá
que volta toda louça suja. Toda viagem que você faz é entre esses dois polos.

> Deixar o outro corpo plantado no balcão significa que o prato que ficar pronto
> sai de lá na hora — mas significa também que a mesa do fundo está a uma
> travessia inteira de distância de quem quer pedir. Onde você larga o outro é a
> jogada, e ela se refaz a cada dez segundos.

O **Walter** trabalha na cozinha durante o turno: é ele que põe os pratos
prontos no balcão. Você nunca entra na cozinha — o balcão é a fronteira do
minigame.

---

## 2. Como o minigame começa: o osso

O Renan pediu uma mecânica de descoberta, e ela liga dois cenários que hoje não
se falam.

1. **O osso está enterrado no jardim da Josefina**, no clube. Ele não fica à
   vista: entre os oito canteiros existe **uma terra remexida** — um montinho
   discreto, uma peça pequena, sem prompt piscando de longe. Chegando perto, o
   prompt aparece: **"Cavar"**.
2. Quem dá a dica é a **Josefina**. Numa das histórias dela (ela já tem um
   repertório de histórias, `HISTORIAS_DA_JOSEFINA`) entra uma nova: *alguém
   andou cavando nos canteiros dela e ela nunca descobriu o quê*. A dica é
   opcional — dá para achar sozinho —, mas ela é o empurrão para quem passou
   direto.
3. Cavar dá o **osso** (`ITENS.osso`, `tipo: 'mao'`, ícone 🦴), um item de
   mochila como qualquer outro. Ele fica na mão, e o personagem o carrega
   à vista pelo mundo inteiro — inclusive na entrada do restaurante.
4. **Levar o osso ao Walter.** Com o osso na mão, o carinho no Walter ganha uma
   opção nova: **"Dar o osso"**. Ele enlouquece (rabo, latido, a volta olímpica
   pelo salão), enterra o osso ao lado do balcão — e então **pergunta**:

   > *"Ele quer saber se a gente topa dar uma mão no próximo dia de trabalho
   > dele."*

   Um `g.ask` com duas opções. **"Topo"** destrava o turno; **"Hoje não"**
   deixa a pergunta em pé — dá para voltar e aceitar depois, e o Walter
   pergunta de novo, sem ressentimento.
5. Aceitando, aparece a **escala de trabalho** pregada ao lado da registradora,
   vizinha do quadro do Empregado do Mês. Ela é o botão do turno dali em
   diante: interagir e o turno começa. *(O avental do Mania, peça de roupa
   nova, ficou para depois — não entrou na etapa 2.)*

Uma memória entra no diário no momento em que o Walter aceita o osso.

---

## 3. O ciclo de vida do cliente

Cada cliente é uma máquina de estados. **Sete fases**, e o jogador tem um verbo
para empurrar o cliente de uma para a próxima. Sem cozinha, os quatro verbos do
meio são o jogo inteiro:

| # | fase | o que o cliente faz | verbo do jogador |
|---|---|---|---|
| 1 | `na-porta` | espera em pé na entrada, em fila | **Levar à mesa** |
| 2 | `lendo` | senta e lê o cardápio | (nenhum — é a sua folga) |
| 3 | `quer-pedir` | levanta a mão, balão com "!" | **Anotar o pedido** |
| 4 | `esperando` | balão vira a miniatura do prato pedido | **Entregar o prato** |
| 5 | `comendo` | come; o balão some | (nenhum) |
| 6 | `quer-pagar` | balão vira uma moedinha | **Receber** |
| 7 | `foi-embora` | anda até a porta e some; **a mesa fica com a louça suja** | **Recolher a louça** |

E o oitavo passo, que fecha o círculo e é o que o Renan pediu explicitamente:

8. **Devolver a louça suja no balcão de passagem.** A louça não some na sua
   mão. Ela ocupa a **bandeja** até você voltar ao balcão e largar lá. Só então
   a mesa está livre para o próximo cliente.

### Por que a louça suja é meia mecânica sozinha

Ela é a razão de o salão engasgar, e é o que faz o minigame ter um ritmo em vez
de uma corrida:

- **ela ocupa a bandeja.** A bandeja tem 2 vagas (3 com melhoria), e uma vaga
  com prato sujo é uma vaga que não leva prato limpo. O erro clássico é sair do
  balcão com a bandeja cheia de comida e ter que voltar vazio para poder
  recolher;
- **ela é sempre a coisa menos urgente e a mais cara de adiar.** Nenhum cliente
  reclama de louça suja — mas mesa suja **não recebe ninguém**, e com quatro
  mesas sujas o salão para de funcionar mesmo com você correndo;
- **ela é o que o Pelusa quer** (§5).

A viagem ideal é a viagem cheia nos dois sentidos: sai do balcão com pratos
limpos, volta com os sujos. Aprender isso **é** aprender a jogar.

---

## 4. Paciência: um dreno por FASE, não um por cliente

Esta é a decisão que separa o minigame de um clone de *Diner Dash*.

Um cliente não tem "uma barra". Ele tem um **dreno diferente em cada fase**, e é
por isso que dá para planejar em vez de só correr:

| fase | dreno | leitura |
|---|---|---|
| `na-porta` | **rápido** | ninguém gosta de ficar de pé na porta |
| `lendo` | **zero** | esse tempo é do cliente, não seu — é a sua folga |
| `quer-pedir` | **muito rápido** | o pior lugar do mundo pra deixar alguém |
| `esperando` | **lento** | dá pra postergar… |
| `comendo` | **zero** | |
| `quer-pagar` | **médio** | e ainda conta pra gorjeta |

A consequência prática: **o que mata você não é a entrega, é a mão levantada**.
Um prato que demora custa pouco; um cliente com a mão levantada enquanto você
atravessa o salão custa caro. O jogo ensina a **largar o que está fazendo**.

A paciência aparece como um **arco por cima do balão**, encolhendo do verde ao
âmbar ao vermelho. Ele acabou saindo pintado no mesmo canvas do balão, e não
como toro de geometria: o balão já é um sprite (para não virar lâmina quando a
câmera gira), e um anel de geometria em volta de um sprite brigaria com ele a
cada volta de câmera.

No fim da visita a paciência restante vira **coração**: 💛 dourado, 🤍 prateado
ou 🩶 apagado. O dinheiro é o preço do prato × o multiplicador do coração, e a
gorjeta só existe no dourado.

---

## 5. O elenco: uma lista que cresce com o jogo

Regra que vale para todos: o traço **não** é "esse é mais rápido". O traço
**muda o que você decide fazer**, e sempre tem um lado bom e um ruim.

E o mais importante para o futuro: **o elenco é uma tabela**, não código
espalhado. Um bicho novo no jogo = uma linha nova em `CLIENTES` (um id, um
construtor, um traço). Foi o que o Renan pediu — quanto mais personagens o jogo
tiver, mais dinâmico o turno fica, sem reescrever nada.

### Gina — a girafa da portaria
Alta: **lê o cardápio de qualquer lugar do salão**. Ela pula a fase `lendo`
inteira — senta e **já** está com a mão levantada. Zero folga. Em compensação
pede **porção dupla**: dois pratos iguais que têm que chegar juntos, e dois
pratos iguais é a coisa mais fácil de carregar numa bandeja só. Ela é ótima se
você a viu chegando, e um desastre se você a sentou e saiu andando.

### Capy — o salva-vidas
Sereno. A paciência dele drena pela metade e — o que importa — ele **acalma as
mesas vizinhas**: qualquer mesa adjacente à dele drena 25% mais devagar. É o
bicho que ensina que **onde você senta cada um importa**: o Capy no meio do
salão vale muito mais que o Capy no canto.

### Noel — o peru do bar de sucos
Paciência curtíssima, elétrico, feliz demais. Mas o pedido dele **sempre tem uma
bebida**, e a bebida é uma entrega separada: quando o suco chega, **a paciência
dele volta ao topo** e ele espera a comida numa boa. Noel é uma entrega em dois
tempos — e sempre dá **gorjeta dobrada**. A jarra pronta (melhoria) transforma o
cliente mais difícil do jogo no mais fácil, e é a melhor compra do quadro.

### Josefina — a tartaruga jardineira
Paciência enorme; ela praticamente não se irrita. O preço é outro: **anotar o
pedido dela demora 3×**, porque ela conta uma história — e o garçom fica
**preso** ali o tempo todo. Ela não é uma corrida contra o tempo, é um **custo
fixo que você escolhe quando pagar**: anotar o pedido da Josefina no meio da
leva 3 é um erro; anotar no vão entre duas levas é de graça.

Quando ela vai embora, **não deixa louça**: deixa um vasinho, e a mesa dela já
sai limpa. É a recompensa por ter aguentado a história.

### Pelusa — o gato, e o agente do caos
O Pelusa **não entra pela porta e não senta em mesa nenhuma**. Ele se enfia no
salão no meio do turno e faz duas coisas:

1. **rouba prato parado** — no balcão de passagem ou na sua bandeja largada;
2. **vai direto para a mesa com louça suja** e faz a festa lá: enquanto ele
   estiver numa mesa suja, ela **não pode ser recolhida**, e as mesas vizinhas
   drenam em dobro.

Espantar custa uma viagem ("psiu, Pelusa") e ele sai trotando com o rabo em pé,
sem drama nenhum — não dá pra ficar bravo com ele. Mecanicamente ele é a
**punição por deixar louça acumulada**, que é exatamente o vício que todo
jogador desenvolve e que estragaria o jogo se saísse de graça.

### Walter — não é cliente, é a cozinha
Durante o turno ele fica na cozinha e **põe os pratos prontos no balcão de
passagem**, com o número da mesa. Você o vê pelo vão de serviço, indo e vindo. É
o dia de trabalho dele que você aceitou ajudar — ele não podia ficar de fora.

Um detalhe que vale o carinho: se uma mesa está esperando há tempo demais, ele
**late do balcão** para chamar sua atenção. Nunca é ranzinza; é um cachorro
ansioso para que dê tudo certo.

---

## 6. O balcão de passagem é o coração do salão

A cena já diz, no comentário do próprio arquivo, que essa é a peça mais
importante do restaurante. No minigame ela vira a mecânica central.

O balcão tem **duas prateleiras**:

- **a de saída**, com **3 vagas**, onde o Walter põe os pratos prontos;
- **a de louça suja**, onde você larga o que recolheu.

E as regras que fazem a pressão:

- **prato pronto esfria** (um anel se fechando em volta). Prato frio entregue
  custa um coração — não estraga a partida, mas cobra;
- **saída cheia trava o Walter**: sem vaga, o próximo prato não sai. A cozinha
  para porque VOCÊ não buscou;
- **o Pelusa rouba da saída**;
- a prateleira de suja não tem limite — **largar louça nunca é bloqueado**. O
  custo dela é a viagem, não a vaga.

---

## 7. A bandeja

Duas vagas (3 com melhoria), e **prato limpo e prato sujo dividem as mesmas
vagas**. É a regra que amarra tudo: cada viagem é um pequeno problema de
arrumação.

Largar a bandeja no chão não existe — o que existe é **largar o outro corpo com
a bandeja dele**. Cada um dos dois tem a sua, e é mais uma razão para pensar
onde estacionar quem: um corpo parado no balcão com a bandeja cheia de sujo é
um corpo que já resolveu meia viagem antes de você trocar para ele.

---

## 8. A estrutura do turno

> **Superado pelo §13.** O turno que entrou no jogo tem 2:45 e chegadas fixas,
> sem levas; na reformulação, cada um dos seis turnos tem a SUA escala de
> chegada (§13.2). A mesa grande e o "último cliente" abaixo continuam valendo
> — o último cliente já está no jogo; a mesa grande entra no turno 5.

Um turno = **6 minutos de tempo de jogo**, em três levas:

| leva | janela | o que entra |
|---|---|---|
| 1 | 0–2 min | no máximo 2 mesas ocupadas, sem Pelusa. É o tutorial disfarçado |
| 2 | 2–4 min | até 4 mesas; entra a porção dupla da Gina e o primeiro assalto do Pelusa |
| 3 | 4–6 min | até 6 mesas, todo mundo junto, e a **mesa grande**: três bichos numa mesa só, três pratos diferentes, e ou os três chegam juntos ou ninguém fica feliz |

A **fila da porta** tem 3 lugares; o quarto bicho vai embora antes de entrar —
perda seca, sem drama e sem barulho, só uma notinha na conta do dia.

E o **último cliente**: quando o cronômetro zera, ninguém novo entra, mas quem
está dentro tem que ser servido **e a louça tem que voltar toda para o balcão**.
O turno acaba com o salão vazio e limpo — o que transforma um final abrupto num
final com respiração.

Fecha com os dois sentados numa mesa do salão vazio, as luminárias baixas, e a
conta do dia: dinheiro, corações, estrelas (1 a 3) e as perdas (quem foi embora
da porta, quantos pratos esfriaram, quantos o Pelusa levou).

---

## 8.1 O que as três estrelas dão

**A gravatinha do Walter.** Fechar um turno com três estrelas faz ele dar três
(quatro) voltas em volta da mesa, parar, mexer na gravata e tirá-la do próprio
pescoço para dar de presente — e sacar outra igual da gaveta no quadro
seguinte, porque tirar a gravata do Walter para sempre seria tirar o que faz
ele ser o Walter.

Ela é a **única peça do guarda-roupa que se ganha jogando**: entra na vaga de
cabeça dos dois personagens, e o armário do quarto do Ari só passa a repô-la
depois da flag. Uma vez só — da segunda vez em diante ele comemora sem repetir
o presente.

## 8.2 A carteira

O dinheiro do turno **cai na carteira do casal na hora de cada pagamento**, e
não no fim: `dinheiro` é o caixa do dia (é dele que saem as estrelas), a
carteira é o saldo que atravessa turnos e cenários.

**É uma carteira só para os dois.** Ela mora no nível de cima do save
(`SaveState.carteira`), e não dentro de `inventarios` — a regra escrita na
estrutura, e não num comentário: não existe "a carteira do Ari" para ficar
fora de sincronia com "a do Renan". A mochila dos dois mostra o mesmo número.

As únicas portas são `g.ganhar(n)` e `g.gastar(n)`. `gastar` devolve `false` e
não tira nada quando falta, para uma loja futura poder perguntar e pagar na
mesma chamada em vez de ler o saldo e debitar em dois passos que podem
discordar. É o cofre de todo minigame que pagar daqui para a frente.

## 9. Progressão: o quadro de melhorias

> **Superado pelo §13.6**, que refaz esta lista para os seis turnos (com
> níveis, preços e a melhoria aparecendo no salão). Fica aqui o desenho
> original, para referência.

Entre turnos, o dinheiro compra melhorias num quadro ao lado da escala:

| melhoria | efeito |
|---|---|
| bandeja maior | 2 → 3 vagas |
| carrinho de louça | recolher a mesa sem ir até ela |
| jarra de suco pronta | a bebida sai instantânea (desmonta o Noel) |
| bloquinho de comandas | anotar o pedido leva metade do tempo (e encurta a história da Josefina) |
| plaquinha de reserva | quem está na porta espera 30% mais |
| tigela do Walter | ele avisa a mesa mais impaciente com um latido dirigido |

A progressão é o que deixa a curva justa: **o turno 3 é impossível sem
melhorias, e possível com elas**. Sem esse eixo, "difícil" vira "injusto".

---

## 10. Não dá para perder — decidido pelo Renan

**Nenhum turno é perdido.** O turno sempre vai até o fim, sempre chega na conta
do dia; o que muda é **quanto você pontua e quanto ganha**. Turno ruim paga
menos e dá menos estrela, e dá pra refazer quantas vezes quiser.

Isso é uma regra de implementação, não uma intenção: **não existe estado de
derrota em lugar nenhum da máquina de estados**. Cliente irritado vai embora
com o coração apagado e leva o dinheiro dele junto — e é só. Não existe contador
de "irritados" que encerre nada, não existe tela de "você perdeu", e nenhuma
mecânica nova pode introduzir uma.

O jogo é um presente: a graça é querer tirar as três estrelas, não ter medo de
perder. O turno ruim ganha só um fecho gentil — o Ari diz alguma coisa boa e a
escala continua ali para amanhã.

---

## 11. Entrega em etapas

Cada etapa é jogável sozinha e vai para `main` antes da próxima. Nada de
construir seis semanas de máquina de estados antes de a primeira pessoa sentar
numa mesa.

| # | etapa | o que fica em pé no fim |
|---|---|---|
| 1 ✅ | **O osso** | o montinho de terra no jardim, a dica da Josefina, o item, o Walter aceitando o osso, a pergunta dele e a escala aparecendo. Nada de turno ainda — mas a descoberta inteira já se joga. **Feito** — `scripts/osso.mjs` |
| 2 ✅ | **O turno jogável** | as etapas 2 e 3 do plano original saíram juntas, a pedido do Renan ("foque em deixar o minigame divertido e dinâmico"): o laço inteiro, os drenos por fase, os balões com o arco de paciência, o HUD e quatro clientes com traço. **Feito** — `scripts/turno.mjs` |
| 3 ✅ | (fundida na etapa 2) | |
| 4 | **O balcão e a bandeja** | as 3 vagas de saída, o prato esfriando, a bandeja dividida entre limpo e sujo, o Walter na cozinha |
| 5 | **O elenco** | o Pelusa, a porção dupla da Gina e a bebida em dois tempos do Noel — o que ficou de fora da etapa 2 para a dificuldade subir aos poucos |
| 6 | **Levas, estrelas e melhorias** | as três levas, o último cliente, a conta do dia, o quadro de melhorias e a memória no diário |

> **As etapas 4 a 6 viraram a reformulação em turnos** — ver a ordem nova no
> §13.9. O que delas sobrevive (o prato esfriando, o Pelusa, a mesa grande,
> as melhorias) foi distribuído pelos seis turnos.

---

## 12. Notas técnicas (o que é novo de verdade)

**O turno NÃO pode ser uma cutscene.** Tudo que o Mania tem hoje é `await`:
`servir()` congela o mundo e conduz. Um turno é o contrário — roda em
`w.onUpdate(dt)` como máquina de estados, com o jogador livre o tempo todo.
É a maior diferença arquitetural em relação a tudo que já foi construído neste
repositório, e é onde o trabalho de verdade está. Arquivo novo
(`src/minigames/turnoDoMania.ts`), com a cena só instanciando e ligando.

**O restaurante de hoje não muda.** Sentar em qualquer mesa, o cardápio, a
cutscene do Walter indo à cozinha, o passeio dele pelo salão: tudo continua
igual, e continua sendo o que acontece **fora** do turno. O minigame liga e
desliga por cima disso — durante o turno o Walter sai do passeio
(`entrarEmServico()`) e as 11 interações de "Sentar e ver o cardápio"
ficam suspensas, porque as mesas agora são dos clientes.

**Bicho precisa saber sentar.** `irPara()` já leva o bicho a qualquer ponto;
falta um `sentar(x, z, facing)` em `Bicho.ts` que estacione o corpo e troque
para uma pose sentada. É a única mudança necessária na classe base.

**O balão é o cardápio.** `PratoDoCardapio.pintar(ctx, s)` já desenha a
miniatura de qualquer prato em qualquer tamanho, em canvas. O balão de pedido
usa **a mesma função**: o cliente literalmente pensa na miniatura do cardápio.
Zero asset externo, e é a leitura mais rápida possível de "o que ele quer".

**Louça suja é uma peça do kit.** Uma `loucaSuja()` em `world/props.ts` — pilha
de pratos com um guardanapo amassado —, do mesmo jeito que `pratoServido()` já
monta o prato limpo.

**HUD novo.** `showPlacar` é "eu × ele" e não serve. Entra um
`showTurno({ tempo, dinheiro, coracoes, leva })` no `Ui.ts`. `showCharge` não é
usado (era da cozinha).

**Sons.** Já existem e servem: `latido` (o Walter chamando), `miado` (Pelusa),
`sino`/`sorvete` (prato pronto no balcão), `gluglu` (suco), `porta` (cliente
chegando), `confirma`, `escolha`, `pegar`. Faltam duas receitas novas em
`audio/efeitos.ts`: **registradora** (o pagamento) e **louça** (a pilha de
pratos batendo no balcão). Mais uma terceira, **cavar**, para o osso.

**Teste.** `scripts/turno.mjs` e `scripts/osso.mjs`, medindo e não só
fotografando. O Chromium sem tela roda a ~10fps com dt travado, então **o tempo
de jogo corre a ~1/3 do relógio**: os scripts esperam por EVENTO, nunca por
tempo. Asserções mínimas: o osso sai do jardim e entra na mochila; o Walter só
pergunta com o osso na mão; um cliente entra e senta; a paciência de quem está
`lendo` **não** cai; mesa com louça suja recusa cliente novo; o Pelusa rouba
prato deixado no balcão; o turno fecha com o salão vazio e limpo. Mais fotos do
salão cheio, olhadas antes de dar qualquer etapa como pronta.

---

## 13. A reformulação: a temporada de turnos

O pedido do Renan, de outubro de 2026: as mesmas mecânicas e o mesmo
funcionamento de hoje, mas **com variação** — um menu de turnos na escala,
pelo menos seis, cada um com dificuldade e clientes diferentes, o próximo
abrindo só com três estrelas no anterior, melhorias permanentes e um prêmio
por turno (roupa de garçom, de cozinheiro e afins). E sempre **turno**, nunca
"noite".

O princípio que segura tudo: **cada turno ensina UMA coisa nova**. É como
fase de jogo de plataforma — o turno 3 não é "o turno 2 mais rápido", é o
turno em que entra o Cookie e o jeito dele de ocupar o salão. A dificuldade
sobe porque as novidades se ACUMULAM (o turno 6 tem tudo junto), e não
porque alguém girou um botão de velocidade.

### 13.1 A escala vira o menu

A interação da escala ("Ler a escala de amanhã") deixa de perguntar
"Começar o turno?" e abre **a escala do Walter**: uma folha de papel pregada,
desenhada como a do quadro de inscrições da arena, com duas abas.

**Aba "Turnos"** — uma linha por turno, de cima para baixo:

```
 ┌──────────────────────────────────────────────────────────────┐
 │ ESCALA DO WALTER                                 🍢 7 petiscos │
 │──────────────────────────────────────────────────────────────│
 │ 1  O primeiro turno        ⭐⭐⭐   🎀 gravatinha ✓           │
 │    Josefina · Capy · Noel · Gina          recorde R$ 268      │
 │ 2  Sobremesa de pinguim    ⭐⭐☆   🧑‍🍳 avental de garçom       │
 │    + Mano: pede sobremesa                 meta ⭐⭐⭐: R$ 250    │
 │ 3  O grandão da bilheteria 🔒 3 estrelas no turno 2           │
 │ 4  …                                                          │
 │──────────────────────────────────────────────────────────────│
 │          [ Começar o turno 2 ]        [ Agora não ]          │
 └──────────────────────────────────────────────────────────────┘
```

- cada linha mostra o número, o nome, quem entra (o retrato pintado do bicho
  novo, como os retratos do quadro da arena), as estrelas já tiradas, o
  recorde, a meta das três estrelas e o PRÊMIO — com ✓ quando já foi ganho;
- o turno trancado aparece em cinza com o cadeado e a frase de como abrir
  ("3 estrelas no turno 2"). Dá para VER o que vem, e é isso que dá vontade
  de jogar;
- marcar uma linha aberta e apertar "Começar" fecha o painel e o turno
  começa; turno já vencido pode ser jogado de novo quantas vezes quiser
  (para bater o recorde ou juntar dinheiro).

**Aba "Melhorias"** — o quadro de melhorias do §13.6, no mesmo painel: uma
carta por melhoria, com o nível, o efeito e o botão de comprar com a carteira.
Um painel só, e não um segundo quadro na parede: a escala já é o lugar aonde
a dupla vai entre um turno e outro.

As falas de primeira vez (o "Escala de amanhã: Walter. E os nossos dois
nomes embaixo", a explicação do primeiro turno) continuam, antes do painel
abrir.

### 13.2 Os seis turnos

| # | nome | dura | chegadas | quem entra (a novidade) | a regra nova do salão | prêmio |
|---|---|---|---|---|---|---|
| 1 | **O primeiro turno** | 2:45 | 10 | Josefina, Capy, Noel, Gina | — (é o turno de hoje, igualzinho) | gravatinha do Walter *(já existe)* |
| 2 | **Sobremesa de pinguim** | 3:00 | 12 | **Mano** 🐧 | a sobremesa: um segundo pedido na mesma mesa | avental de garçom do Mania |
| 3 | **O grandão da bilheteria** | 3:15 | 13 | **Cookie** 🐘 | uma mesa que ocupa duas | bloquinho e lápis na orelha |
| 4 | **Canard à la Mania** | 3:15 | 14 | **Jean-Luc** 🦆 e **Estella** 🐑 | o **prato esfria** no balcão | colete de garçom (costurado pela Estella) |
| 5 | **Dia de jogo** | 3:30 | 16 | **Luna, Sol e Estrella** 🐰 e **Flynn** 🦊 | a **mesa grande**: três numa mesa, três pratos juntos | bandana de churrasqueiro |
| 6 | **Casa cheia** | 4:00 | 20 | **Gatito** 🐱 e o **Pelusa** 😼 | o Pelusa solto no salão | dólmã e chapéu de cozinheiro + o retrato |

Cada turno tem a SUA escala de chegada, fixa (a mesma toda vez que se joga),
misturando os bichos que já entraram com os novos. O bicho novo do turno
chega cedo e sozinho na primeira vez — o salão quase vazio é o tutorial dele —
e depois aparece no meio dos outros.

A regra nova de um turno **continua valendo nos seguintes**: o prato esfria
do turno 4 em diante, a mesa grande pode voltar no 6, e o 6 tem todo mundo.

### 13.3 O elenco novo — todos os bichos do jogo

Hoje são 4 clientes; o jogo tem **13 bichos**, e só o Walter não pode ser
cliente (ele é a cozinha). A regra do §5 continua: o traço nunca é "esse é
mais rápido", ele muda o que você DECIDE, e sempre tem um lado bom e um ruim.
E cada traço nasce do jeito do bicho no resto do jogo.

**Mano** 🐧 — *o pinguim do quiosque de sorvete.* **Pede sobremesa.** Depois
de comer, em vez de pedir a conta ele levanta a mão de novo: é um segundo
"anotar" e uma segunda entrega (o sorvete) na mesma mesa, e ele paga as duas.
A mesa dele fica ocupada o dobro do tempo — ótimo dinheiro, péssimo para o
giro do salão. Ensina a **pensar na mesa como recurso**.

**Cookie** 🐘 — *o elefante da bilheteria, grande e manso, louco por doce
pequenininho.* **Ocupa duas mesas**: ele senta numa, e a mesa mais próxima
fica fechada enquanto ele estiver (a cadeira não cabe do lado dele). Em
compensação **só pede docinho**: o Walter faz em um instante e ele come
rápido. Onde você senta o Cookie decide se ele fecha uma mesa vazia ou uma
mesa que ia render — é o Capy ao contrário.

**Jean-Luc** 🦆 — *o pato francês, exigente.* **Só aceita prato quente.** Do
turno 4 em diante todo prato pronto esfria (o anel em volta dele no balcão,
como o plano antigo previa no §6), e prato frio entregue custa um coração de
qualquer cliente; o Jean-Luc é o que mais sente: frio, ele paga com o coração
apagado; quente, diz "Magnifique!" e paga em dobro. Ensina a **não deixar
prato parado no balcão**.

**Estella** 🐑 — *a ovelha costureira, orgulhosa das roupas que faz.*
**Repara no uniforme.** Se quem anota o pedido dela estiver vestindo uma peça
do Mania (os prêmios do §13.5), ela dá gorjeta dobrada; e ela sempre dá um
**biscoitinho** a quem entrega o prato — por 20 segundos, aquele garçom anda
mais rápido. É o traço que liga os PRÊMIOS ao jogo: a roupa ganha num turno
ajuda no seguinte.

**Luna, Sol e Estrella** 🐰 — *as coelhinhas da torcida.* **Chegam juntas e
sentam juntas**: a mesa grande do §8. Três pedidos, três pratos, e a mesa só
paga quando as três comeram — prato que chega sozinho esfria esperando as
irmãs. Ensina a **encher a bandeja com um propósito**.

**Flynn** 🦊 — *a raposa capitã da atlética, que anima todo mundo.*
**Torce.** Cada prato entregue no salão — em qualquer mesa — faz o Flynn
comemorar (a comemoração dele já existe) e devolve um pouco de paciência às
mesas perto dele. Sentar o Flynn no MEIO do salão vale ouro; é o Capy de
quem tem pressa.

**Gatito** 🐱 — *o professor.* **Six seven.** Quando ele paga, faz o six
seven (o gesto já existe) e o salão inteiro ri: todo mundo recupera um
pouco de paciência. Mas ele come devagar, conversando — a mesa dele demora a
liberar. Guardar a conta do Gatito para a hora do aperto é a jogada.

**Pelusa** 😼 — *o gato do Ari, o agente do caos* (o desenho do §5 vale
inteiro). Ele **não é cliente**: entra no meio do turno 6, **rouba prato
parado** no balcão ou na bandeja de quem ficou largado, e **deita na mesa
suja** — ela não pode ser recolhida enquanto ele estiver lá, e as vizinhas
drenam em dobro. Espantar custa uma viagem ("psiu, Pelusa"). É a punição
pelo vício de deixar louça acumulada.

Os quatro de hoje (Josefina, Capy, Noel e Gina) ficam como estão.

### 13.4 As estrelas e a trava

**As estrelas continuam saindo do dinheiro do dia**, como hoje: uma estrela
por terminar (sempre), duas e três por metas. Só que **cada turno tem as suas
metas**, porque cada um tem outro tamanho:

| turno | ⭐⭐ | ⭐⭐⭐ | máximo possível (aprox.) |
|---|---|---|---|
| 1 | R$ 140 | R$ 220 | ~R$ 440 |
| 2 | R$ 160 | R$ 250 | ~R$ 520 |
| 3 | R$ 180 | R$ 280 | ~R$ 560 |
| 4 | R$ 200 | R$ 320 | ~R$ 640 |
| 5 | R$ 230 | R$ 360 | ~R$ 720 |
| 6 | R$ 270 | R$ 420 | ~R$ 880 |

Os números são PROVISÓRIOS: o turno 1 é o de hoje (as metas dele não mudam),
e os outros saem de uma conta — o máximo possível de cada escala de chegada,
com todos de coração dourado — e da regra de que as três estrelas pedem um
pouco mais da metade desse máximo nos primeiros turnos e quase dois terços no
último. Quem acerta os números é o `scripts/balancoDoTurno.mjs` (§13.8), e não
o olho.

**A trava é a do Renan: o turno seguinte só abre com três estrelas no
anterior.** E ela não fere o "não dá para perder" (§10), porque **todo turno
paga**: mesmo o turno de uma estrela põe dinheiro na carteira e um
**petisco** no bolso, e os petiscos compram melhorias (§13.6). Quem empacou num turno sempre tem o que fazer —
rejogar o anterior, juntar, melhorar o salão e voltar. A curva é desenhada
assim de propósito:

- turnos **1 e 2**: três estrelas sem melhoria nenhuma;
- turnos **3 e 4**: pedem umas duas ou três melhorias;
- turnos **5 e 6**: pedem o salão quase todo melhorado.

**Quem já jogou não perde nada.** Save antigo com a gravatinha do Walter
(`gravata-do-walter`) já tirou três estrelas no turno de hoje: o turno 1
nasce vencido e o 2 aberto. O recorde (`turno-recorde`) vira o recorde do
turno 1.

### 13.5 Os prêmios

Uma peça (ou duas) por turno, dada pelo Walter na primeira vez das três
estrelas, do jeito que a gravatinha já é dada hoje — ele dá voltas em volta
da mesa, tira de algum lugar e entrega. Todas vão para o guarda-roupa dos
dois e voltam sempre (`g.ganharPeca`, como os prêmios da arena e da apostila).

| turno | prêmio | vaga | ideia |
|---|---|---|---|
| 1 | gravatinha do Walter | — | *já existe* |
| 2 | **avental de garçom do Mania** | acessório, no corpo (vai por cima de qualquer roupa) | comprido, preto, com o "Mania" bordado em dourado |
| 3 | **bloquinho e lápis na orelha** | acessório, na cabeça | o lápis atrás da orelha e o bloquinho no bolso |
| 4 | **colete de garçom** | tronco | colete escuro com camisa branca — e a Estella diz que foi ela que costurou |
| 5 | **bandana de churrasqueiro** | cabeça | no molde da bandana do Flynn, nas cores do Mania |
| 6 | **dólmã e chapéu de cozinheiro** | tronco e cabeça | o uniforme branco de chef, com o chapéu alto |

**E o prêmio da temporada** (decisão do Renan): fechar os seis turnos com
três estrelas libera **a plaquinha de funcionários do mês** — pendurada ao
lado do quadro do Walter, **"Funcionários do mês: Ari e Renan"**, pintada em
canvas como a dele, os dois de uniforme. Com memória no diário. O Walter
continua sendo o empregado do mês; os dois só ganharam a parede do lado.

### 13.6 As melhorias permanentes

Compradas na aba "Melhorias" da escala com **Petiscos** — a moeda do Mania,
decisão do Renan. No fim de cada turno o Walter dá **um petisco por
estrela** (de 1 a 3, toda vez que se joga, inclusive turno já vencido). O
dinheiro do turno continua indo para a carteira do casal (§8.2) e
comprando roupa na Estella; os petiscos só servem aqui.
Valem para todos os turnos, inclusive os já vencidos, e **aparecem no
salão** — o mesmo princípio do regador da estufa: a melhoria não é um ícone,
é uma coisa que dá para ver.

| melhoria | efeito | níveis (🍢 petiscos) | onde se vê |
|---|---|---|---|
| **Bandeja grande** | 2 → 3 vagas na bandeja de cada um | 5 | a bandeja maior na mão |
| **Tênis de garçom** | anda 10% / 20% mais rápido durante o turno | 2 / 5 | o tênis nos pés durante o turno |
| **Bloquinho de comandas** | anotar leva metade do tempo (a história da Josefina também encurta) | 3 | o bloquinho na mão ao anotar |
| **Chapa nova** | o Walter faz o prato em 5 s em vez de 7 / dois pratos de cada vez | 3 / 6 | a chapa nova na cozinha |
| **Plaquinha de reserva** | a fila espera 30% mais, e ganha o quarto lugar | 3 | a plaquinha na entrada |
| **Rádio do salão** | a paciência de todo mundo cai 10% mais devagar | 5 | o rádio no balcão do bar, tocando |
| **Carrinho de louça** | um segundo lugar de largar a louça, no meio do salão | 4 | o carrinho entre as mesas |

São 36 petiscos no total. Os seis turnos vencidos dão 18 (no mínimo); o
resto vem de rejogar — umas seis ou sete partidas a mais para o salão
inteiro, o que casa com a curva do §13.4 (turnos 3 e 4 com duas ou três
melhorias, 5 e 6 com quase todas). Os preços são PROVISÓRIOS, acertados na
etapa B.

**Quem já jogou não perde nada aqui também**: o save antigo com a gravatinha
(três estrelas no turno 1) já ganha os 3 petiscos dessas estrelas.

**Como ficou no jogo (etapa B):**

- a aba "Melhorias" da escala tem um botão no PRÓXIMO nível de cada uma
  ("comprar · 🍢 5", ou "faltam 🍢 3" quando o pote não dá); comprar desconta
  na hora, o cartão pisca e a escala continua aberta. O nível mora no
  contador `mania:<id>` (`comprarMelhoria`, em `turnosDoMania.ts`);
- **a bandeja agora existe sempre**: durante o turno os dois seguram uma
  bandeja de inox, e o que carregam (o prato, a louça) aparece EM CIMA dela.
  A melhoria troca pela oval grande, de três vagas. O motor ganhou
  `g.segurarNaCena` para isso (por cima do item da mochila, sem mexer no save);
- **o tênis de garçom** é o tênis de time dos Gatitos (`montarTenis`) no preto
  do avental, com as listras douradas; ele calça os dois só durante o turno
  (`g.vestirNaCena`), e a velocidade é do comando (10% por nível);
- **o bloquinho** aparece na mão de quem anota, no lugar da bandeja, só
  enquanto anota (e anotar leva metade);
- **a chapa nova** fica na ilha da cozinha (a dupla, de duas zonas, no nível
  2), com comida e as chamas acesas; **o cavalete de giz** ("Fila — aguarde
  aqui, que o Walter já vem!") fica na frente da fila; **o rádio** de capela
  toca no bar, com as notas subindo; **o carrinho de louça** fica no vão entre
  as duas mesas do meio da fileira da frente;
- **o carrinho mudou de efeito**: o plano dizia "guarda uma pilha sem ocupar a
  bandeja", mas parado na copa ele não ajudaria em nada. Ele é um SEGUNDO
  LUGAR DE LARGAR A LOUÇA, no meio do salão — meia viagem a menos;
- teste: `scripts/melhorias.mjs` (a compra, cada efeito medido sem e com, as
  peças no salão, a bandeja carregada e o fim do turno tirando tudo).

### 13.7 Ideias para depois (fora da primeira leva)

- **O pedido do Walter**: um desafio opcional por turno ("ninguém vai embora
  da fila", "nenhum prato esfria"), que paga um bônus. Dá o que fazer em turno
  já vencido.
- **O turno surpresa**: depois do sexto, um turno que sorteia a chegada entre
  todo o elenco, só pelo recorde.
- **A bebida em dois tempos do Noel** e a **porção dupla da Gina** (§5): os
  dois traços previstos que nunca entraram; cabem como variação num turno
  extra.

### 13.8 Notas técnicas

- **Os turnos são DADOS.** Um arquivo novo, `src/minigames/turnosDoMania.ts`,
  com a tabela `TURNOS` (id, número, nome, duração, a escala de chegada, as
  metas, o prêmio, a frase da novidade para o menu) e a tabela `MELHORIAS`
  (id, nome, efeito, preços por nível). Ajuste de turno começa ali — o mesmo
  papel do `adversariosData.ts` da arena e do `cardapioData.ts`.
- **`TurnoDoMania` recebe o turno e as melhorias** no `comecar(turno,
  melhorias)`: as constantes de hoje (`DURACAO`, `CHEGADAS`, `BANDEJA`,
  `COZINHA`) viram campos do turno ou efeito de melhoria. A máquina de
  estados não muda de forma.
- **O elenco cresce como tabela** (`ELENCO`, já é assim): cada traço novo é
  um campo opcional na ficha (`sobremesa`, `ocupaVizinha`, `exigeQuente`,
  `repara`, `grupo`, `torce`, `sixSeven`) e um ponto no laço que o lê. O
  Pelusa é um "evento" do turno, e não uma ficha.
- **O painel**: `ui/escalaDoWalter.ts`, no molde do quadro de inscrições da
  arena (`abrirQuadro`) e do arsenal da estufa (abas), chamado por um
  `g.abrirEscalaDoWalter()` que resolve com o id do turno escolhido ou `null`.
- **O save**: as estrelas e o recorde de cada turno e o nível de cada
  melhoria em contadores (`g.stat`/`g.bump`, como o `turno-recorde` de hoje:
  `turno:2:estrelas`, `turno:2:recorde`, `mania:bandeja`). Nada de campo
  novo no `SaveState`; a migração do save antigo é ler a flag da gravatinha.
- **Os prêmios**: `PREMIOS_DO_MANIA` em `world/itens.ts` (turno → peças), no
  molde de `PREMIOS_DA_ARENA`; a geometria nova em `world/roupas.ts` pela
  skill `aristory-roupa`.
- **Bicho sentado à mesa**: todo bicho novo precisa de foto sentado na
  cadeira da frente (a altura do `sentarEm` muda com o tamanho — o Cookie tem
  2 m). A mesa grande usa as DUAS cadeiras da frente (`x = ±0,55, z = +0,95`)
  e uma de trás; a de trás fica atrás do tampo, então é para a coelhinha mais
  alta.
- **Testes**: `scripts/escala.mjs` (o painel, a trava, abrir o próximo com as
  três estrelas, o prêmio entregue uma vez só, o save antigo), o
  `scripts/turno.mjs` rodando qualquer turno (`TURNO=4`), um teste por traço
  novo medindo o efeito, e o `scripts/balancoDoTurno.mjs`, sem navegador, que
  calcula o máximo de cada escala e confere as metas do §13.4. No Chromium
  sem placa o jogo anda devagar: os testes esperam por EVENTO e encurtam por
  dentro o que é só espera (a leitura, a refeição), como o `turno.mjs` já faz.

### 13.9 A ordem de construção

Cada etapa é jogável sozinha e vai para `main` antes da próxima, como no §11.

| # | etapa | o que fica em pé no fim |
|---|---|---|
| A ✅ | **A escala e os dois primeiros turnos** *(no jogo)* | o painel com as duas abas (a das melhorias ainda vazia), a tabela de turnos, as estrelas e o recorde por turno, a trava das três estrelas, o save antigo; o turno 1 (o de hoje) e o turno 2 com o Mano e o avental |
| B ✅ | **As melhorias** *(no jogo)* | a aba de melhorias com as sete, a compra com petiscos e cada uma aparecendo no salão |
| C ✅ | **Turnos 3 e 4** *(no jogo)* | o Cookie, o Jean-Luc, a Estella, o prato esfriando, o bloquinho e o colete |
| D | **Turnos 5 e 6** | as coelhinhas e a mesa grande, o Flynn, o Gatito, o Pelusa, a bandana, o uniforme de chef e o retrato dos empregados do mês |

**O que a etapa A decidiu pelo caminho** (para o Renan conferir):

- **a sobremesa do Mano é o smoothie de manga com banana** do cardápio: o
  Mania não vende sorvete, e inventar um doce no cardápio de um restaurante
  de verdade seria inventar. Se o Mania tiver sobremesa, ela entra pela
  skill `aristory-prato` e a ficha do Mano passa a pedir ela (`sobremesa`,
  em `turnoDoMania.ts`). O primeiro pedido dele é sempre de comer;
- quando a sobremesa chega, **o Mano dança** (a dança do quiosque);
- os **petiscos** moram no contador `mania:petiscos`, as estrelas e o recorde
  em `turno:N:estrelas` / `turno:N:recorde`, e as vezes jogadas em
  `turno:N:vezes`. A migração do save antigo é `migrarOTurnoAntigo` (a flag
  `turnos-migrados` garante uma vez só);
- o prêmio de cada turno mora em `PREMIOS_DO_MANIA` (`world/itens.ts`), e a
  geometria em `world/roupasDoMania.ts`;
- testes: `scripts/escala.mjs` (o painel, a trava, os petiscos, o prêmio uma
  vez só, o save antigo e o celular), `scripts/sobremesa.mjs` (o Mano
  inteiro, do salão à conta) e `TURNO=2 node scripts/turno.mjs`.

**O que a etapa C decidiu pelo caminho** (para o Renan conferir):

- **o Cookie só toma o suco de morango** do cardápio (pelo mesmo motivo da
  sobremesa do Mano: o Mania não tem doce no cardápio). O Walter faz em 3 s
  e ele toma em 5. Ele não cabe na cadeira: fica DE PÉ no lugar dela, um
  passo para fora da mesa, e a mesa livre mais perto ganha o cartão
  "Reservado pro Cookie" até ele ir embora;
- **o prato esfria em 24 s** (no balcão e na bandeja), do turno 4 em diante.
  O vapor que sobe dele encolhe junto e some quando esfria; na bandeja do
  HUD o prato frio vira 🥶. Prato frio não dá coração dourado a ninguém;
- **o Jean-Luc**: quente, comemora ("Magnifique!") e paga em dobro; frio,
  paga a metade;
- **a Estella**: a peça do Mania que ela reconhece é qualquer prêmio da
  temporada ou a gravatinha (`ehPecaDoMania`), vestida por quem ANOTA o
  pedido dela; o biscoitinho vai para quem ENTREGA, e é 25% de passo por
  20 s (soma com o tênis);
- **o prêmio do turno 3 são duas peças** que vestem juntas: o lápis atrás da
  orelha (acessório) e o bloquinho na mão esquerda (mãos);
- falas: as das apresentações dos turnos 3 e 4 e as dos clientes novos são
  provisórias, minhas;
- teste: `scripts/turnos34.mjs`.

### 13.10 As decisões do Renan

As cinco perguntas do plano, respondidas em outubro de 2026:

1. **Os traços dos bichos novos** (§13.3): "cada personagem tem suas próprias
   características" — valem os do §13.3.
2. **Os prêmios** (§13.5): "estão bons" — avental, bloquinho com lápis,
   colete, bandana e o uniforme de chef.
3. **Os nomes dos turnos**: os do §13.2, trocando só o do turno 4 por um
   trocadilho em francês — virou **"Canard à la Mania"** (o *canard à
   l'orange*, com o pato francês no lugar da laranja).
4. **A moeda das melhorias**: "crie uma moeda chamada **Petiscos** que o
   Walter dá pra gente ao final dos turnos de acordo com o número de estrelas
   que conseguirmos" — um petisco por estrela (§13.6).
5. **O prêmio da temporada**: "após terminar todos os 6 turnos, liberamos a
   plaquinha como funcionários do mês" (§13.5).
