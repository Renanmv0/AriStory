# Turno no Mania de Churrasco — plano do minigame

> Documento de PROJETO. As etapas 1 e 2 já estão no jogo (§11); daí para a
> frente ainda é plano. Quando uma etapa for construída, marque-a aqui — e
> deixe o `git log` ser a fonte da verdade do que de fato existe.

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

## 9. Progressão: o quadro de melhorias

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
