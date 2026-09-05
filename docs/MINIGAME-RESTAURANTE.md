# Turno no Mania de Churrasco — plano do minigame

> Documento de PROJETO, não de implementação. Nada disto está no jogo ainda.
> Quando uma etapa for construída, marque-a aqui e deixe o `git log` ser a
> fonte da verdade do que de fato existe.

O pedido do Renan: um minigame de servir clientes no restaurante, complicado,
divertido, com nível de desafio real, **focado em servir as mesas**, e com os
clientes sendo os bichinhos já construídos — **incluindo o Pelusa**.

Referências que ele mesmo citou lá atrás: *Diner Dash*, *Overcooked*,
*Penguin Diner*.

---

## 1. A ideia em uma frase

**Você é dois, e só pode ser um de cada vez.**

O Mania já nasceu partido em dois cômodos separados pelo balcão de passagem: a
COZINHA no fundo/esquerda e o SALÃO na frente/direita, com um vão de serviço
único ligando os dois. O minigame inteiro sai dessa planta.

Um dos dois é o **garçom** (salão) e o outro é o **cozinheiro** (cozinha). A
tecla `T` troca quem você controla — e **o corpo que você larga não faz nada
sozinho**. Ele fica exatamente onde você o deixou. Não é um co-op de um
jogador só; é um jogo de *onde eu estaciono a outra metade de mim*.

Daí sai a decisão que se repete o turno inteiro e que é o coração da coisa:

> deixar o cozinheiro parado ao lado da chapa custa zero passo para voltar a
> cozinhar, mas custa uma travessia inteira toda vez que a cozinha precisa de
> alguém na porta. Onde você larga o outro corpo é a jogada.

O balcão de passagem é a eclusa entre os dois mundos: o cozinheiro **põe o
prato no balcão**, o garçom **pega do balcão**. Os dois nunca precisam estar no
mesmo cômodo. A cena já tem essa peça, e o comentário dela já diz que é a mais
importante do arquivo — agora ela vira mecânica.

E o **Walter** é o terceiro par de mãos: um cachorro que obedece **uma tarefa
por vez**.

---

## 2. O ciclo de vida do cliente

Cada cliente é uma máquina de estados. Sete fases, e o jogador tem um verbo
para empurrar o cliente de uma para a próxima:

| # | fase | o que o cliente faz | verbo do jogador |
|---|---|---|---|
| 1 | `na-porta` | fica em pé na entrada, na fila | **Levar à mesa** |
| 2 | `lendo` | senta e lê o cardápio | (nenhum — é a folga) |
| 3 | `quer-pedir` | levanta a mão, balãozinho com "!" | **Anotar o pedido** |
| 4 | `esperando` | balão vira a miniatura do prato pedido | **Servir** (o prato certo) |
| 5 | `comendo` | come, balão some | (nenhum) |
| 6 | `quer-pagar` | balão vira uma moedinha | **Receber** |
| 7 | `saindo` | anda até a porta e some; a mesa fica **suja** | **Limpar a mesa** |

Mesa suja não recebe cliente novo. Limpar é o trabalho invisível que sempre
sobra, e é ele que faz o salão engasgar na terceira leva.

### A fila da porta

A porta de serviço dos fundos (`PORTA.z = -4.4`) é por onde o **jogador** entra,
vindo do clube. O cliente entra pela **frente** do salão. Enquanto o turno
roda, a entrada da frente vira o spawn: até 3 bichos em fila, e o quarto
**vai embora antes de entrar** (perda seca, sem drama e sem barulho — só uma
notinha no fim do turno).

---

## 3. Paciência: um dreno por FASE, não um por cliente

Esta é a decisão de design que separa o minigame de um clone de *Diner Dash*.

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

A consequência prática: **o que mata você não é a cozinha, é a mão levantada**.
Um prato demorado custa pouco; um cliente com a mão levantada enquanto você
mexe a chapa custa caro. O jogo ensina a interromper o que está fazendo.

A paciência aparece como um **arco por cima do balão** (um toro com
`thetaLength` encolhendo, cor da paleta indo do verde ao âmbar ao vermelho) —
geometria, sem textura nenhuma.

No fim da visita a paciência restante vira **coração**: 💛 dourado, 🤍 prateado
ou 🩶 apagado. O dinheiro é o preço do prato × o multiplicador do coração, e a
gorjeta só existe no dourado.

---

## 4. Os clientes são os bichos, e cada um muda o PLANO

Regra que vale para os cinco: o traço não é "esse é mais rápido". O traço
**muda o que você decide fazer**, e sempre tem um lado bom e um ruim.

### Gina — a girafa da portaria
Ela é alta: **lê o cardápio de qualquer lugar do salão**. Pula a fase `lendo`
inteira — senta e **já** está com a mão levantada. Zero folga.
Em compensação ela pede **porção dupla**: uma comanda que produz **dois pratos
iguais**, e os dois têm que chegar juntos. Cozinhar duas vezes a mesma coisa é
mais barato do que duas coisas diferentes, então ela é uma cliente boa se você
a vir chegando — e um desastre se você a sentar e sair andando.

### Capy — o salva-vidas
Sereno. A paciência **dele** drena pela metade, e — o que importa — ele
**acalma as mesas vizinhas**: qualquer mesa adjacente à dele drena 25% mais
devagar. É o primeiro bicho que ensina que **onde você senta importa**: o Capy
no meio do salão vale mais que o Capy no canto.

### Noel — o peru do bar de sucos
Paciência curtíssima, elétrico, feliz demais. Mas:
- ele **sempre dá gorjeta dobrada**;
- o pedido dele **sempre tem uma bebida**, e a bebida é uma entrega separada:
  quando o suco chega, a paciência dele **volta ao topo** e ele espera a comida
  numa boa.

Noel é uma entrega em dois tempos. A jarra de suco pronta (melhoria) transforma
o cliente mais difícil do jogo no mais fácil — e essa é a melhor compra do
quadro de melhorias.

### Josefina — a tartaruga jardineira
Paciência enorme; ela praticamente não se irrita. O preço é outro:
**anotar o pedido dela demora 3×**, porque ela conta uma história — e o garçom
fica **preso** ali o tempo todo. Ela não é uma corrida contra o tempo, é um
**custo fixo que você escolhe quando pagar**. Anotar o pedido da Josefina no
meio da leva 3 é um erro; anotar no vão entre duas levas é de graça.

Quando ela vai embora, deixa um **vasinho na mesa**. A mesa dela conta como
limpa (a plantinha "toma conta"), e o vasinho fica no salão até o fim do turno.

### Pelusa — o gato, e o agente do caos
O Pelusa **não entra pela porta e não senta em mesa nenhuma**. Ele se enfia no
salão no meio do turno e faz duas coisas:

1. **rouba prato parado no balcão de passagem** — prato que fica lá mais que
   alguns segundos vira almoço dele;
2. **dobra o dreno da mesa por onde ele passa**, até alguém espantar.

Espantar custa uma viagem ("psiu, Pelusa") e ele sai trotando com o rabo em pé,
sem drama — não dá pra ficar bravo com ele. Mecanicamente ele é a **punição por
cozinhar adiantado sem servir**, que é exatamente a estratégia que todo jogador
descobre sozinho e que estragaria o jogo se funcionasse.

---

## 5. A cozinha

Cada prato do `CARDAPIO` (`world/cardapioData.ts`) vira uma receita de **2 a 4
etapas**, em postos que já existem nas bancadas:

| posto | como se joga | dá pra largar no meio? |
|---|---|---|
| **chapa** | a barra do frisbee (`showCharge`) enche sozinha; você aperta pra tirar. Antes da zona = cru (o cliente devolve). Dentro = perfeito. Depois = **queimou**, joga fora e recomeça o prato | **sim** — e é isso que faz você sair da cozinha |
| **bancada** | 3 toques no ritmo pra empilhar as camadas; cada toque tem sua janela | não, exige você ali |
| **torneira de suco** | segura a tecla, o copo enche, solta na linha | não |
| **fritadeira** | põe e sai; cozinha sozinha e **queima sozinha** se esquecerem | **sim, e é uma armadilha** |

O par chapa/fritadeira contra bancada é o que dá o ritmo: **as coisas lentas
você começa e abandona; as rápidas exigem você presente**. O turno bom é o que
enfileira corretamente as duas naturezas.

O prato pronto vai para o **balcão de passagem**, que tem **3 vagas**. E o
balcão é onde toda a pressão do jogo se acumula:

- prato no balcão **esfria** (um anel se fechando em volta); prato frio custa
  um coração;
- prato no balcão é o que o **Pelusa** rouba;
- balcão cheio **trava a cozinha**: sem vaga, não dá pra terminar o próximo.

Cozinhar adiantado é a tentação, o balcão é a punição, e o garçom é a válvula.

---

## 6. Walter, o terceiro par de mãos

Ele já sabe fazer tudo o que precisa: `entrarEmServico()`, `irPara(x, z, vel)`,
`voltarAPassear()` — é assim que a cutscene atual leva o prato à mesa.

No turno ele ganha um comando: um apito (som `apito`) abre um `g.ask` com as
tarefas possíveis **agora**:

- **"Leva o prato da vaga N à mesa X"** — o caminho que já existe hoje;
- **"Vai buscar o pedido da mesa X"** — mas ele é cachorro: tem uma chance
  pequena de **trazer o pedido errado**, e aí chega o prato errado à mesa (o
  cliente perde um coração e você refaz). É falha divertida, não injusta: dá
  pra ver a comanda torta antes de cozinhar;
- **"Limpa a mesa X"**;
- **"Espanta o Pelusa"**.

Duas regras que impedem o Walter de virar o jogo inteiro:

1. **uma tarefa por vez** — enquanto ele trota, o apito não faz nada;
2. **pausa d'água** — a cada 3 tarefas ele volta ofegante e bebe por uns
   segundos. O avental dele (melhoria) sobe para 4.

---

## 7. A estrutura do turno

Um turno = **6 minutos de tempo de jogo**, em três levas:

| leva | janela | o que entra |
|---|---|---|
| 1 | 0–2 min | no máximo 2 mesas ocupadas, um prato cada, sem Pelusa. É o tutorial disfarçado |
| 2 | 2–4 min | até 4 mesas; entra a porção dupla da Gina e o primeiro assalto do Pelusa |
| 3 | 4–6 min | até 6 mesas, todo mundo junto, e a **mesa grande**: três bichos numa mesa só, três pratos diferentes, e ou os três chegam juntos ou ninguém fica feliz |

E o **último cliente**: quando o cronômetro zera, ninguém novo entra, mas quem
está dentro tem que ser servido. O turno acaba quando o salão esvazia — o que
transforma um final abrupto num final com respiração.

Fecha com os dois sentados numa mesa do salão vazio, as luminárias baixas, e a
conta do dia na tela: dinheiro, corações, estrelas (1 a 3), e as perdas
(quem foi embora da porta, quantos pratos queimaram, quantos o Pelusa levou).

### Onde o turno começa

Uma **escala de trabalho** pregada ao lado da registradora, vizinha do quadro
do Empregado do Mês. Interagir = os dois vestem o **avental do Mania** (peça
nova de `slot: 'tronco'`, seguindo a skill de roupa) e o turno começa.

---

## 8. Progressão: o quadro de melhorias

Entre turnos, o dinheiro compra melhorias num quadro na cozinha:

| melhoria | efeito |
|---|---|
| bandeja maior | o garçom carrega 2 → 3 pratos |
| segunda chapa | dois pratos na chapa ao mesmo tempo |
| avental do Walter | +1 tarefa antes da pausa d'água |
| jarra de suco pronta | bebida sai instantânea (desmonta o Noel) |
| carrinho de limpeza | limpar mesa sem ir até ela |
| plaquinha de reserva | quem está na porta espera 30% mais |

A progressão é o que deixa a curva justa: **o turno 3 é impossível sem
melhorias, e possível com elas**. Sem esse eixo, "difícil" vira "injusto".

---

## 9. A pergunta de design que precisa da resposta do Renan

**Dá pra PERDER um turno?**

Minha recomendação: **não**. Turno ruim paga menos, dá menos estrela, e dá pra
refazer quantas vezes quiser. O jogo é um presente — a graça é querer tirar as
três estrelas, não ter medo de perder. O turno ruim ganha só um fecho gentil:
o último cliente sai com o coração apagado e o Ari diz alguma coisa boa.

Se ele quiser a pressão de verdade, ela entra como **Modo domingo**, destravado
depois do primeiro 3 estrelas: lá, três clientes irritados encerram o turno na
hora.

---

## 10. Entrega em etapas

Cada etapa é jogável sozinha e vai para `main` antes da próxima. Nada de
construir seis semanas de máquina de estados antes de a primeira pessoa sentar
numa mesa.

| # | etapa | o que fica em pé no fim |
|---|---|---|
| 1 | **O esqueleto** | um cliente (a Josefina, que perdoa tudo), sentar, pedir, "cozinhar" instantâneo, servir, receber, limpar. Sem tempo e sem paciência. Prova o laço |
| 2 | **Paciência e comanda** | os drenos por fase, os balões, o arco de paciência, as comandas no balcão, o HUD do turno |
| 3 | **A cozinha de verdade** | os postos, as barras de tempo, o queimado, o prato esfriando no balcão — e o `T` passando a ter custo |
| 4 | **Os bichos** | os cinco traços, a estratégia de onde sentar cada um, e o Pelusa |
| 5 | **O Walter comandável** | o menu de tarefas, o pedido errado, a pausa d'água |
| 6 | **Levas, estrelas e melhorias** | as três levas, o último cliente, a conta do dia, o quadro de melhorias e a memória no diário |

---

## 11. Notas técnicas (o que é novo de verdade)

**O turno NÃO pode ser uma cutscene.** Tudo que o Mania tem hoje é `await`:
`servir()` congela o mundo e conduz. Um turno é o contrário — ele roda em
`w.onUpdate(dt)` como máquina de estados, com o jogador livre o tempo todo.
Essa é a maior diferença arquitetural em relação a tudo que já foi construído
neste repositório, e é onde o trabalho de verdade está. Arquivo novo
(`src/minigames/turnoDoMania.ts` ou `src/scenes/mania/turno.ts`), com a cena
só instanciando e ligando.

**Bicho precisa saber sentar.** `irPara()` já leva o bicho a qualquer ponto;
falta um `sentar(x, z, facing)` em `Bicho.ts` que estacione o corpo e troque
para uma pose sentada. É a única mudança necessária na classe base.

**O balão é o cardápio.** `PratoDoCardapio.pintar(ctx, s)` já desenha a
miniatura de qualquer prato em qualquer tamanho, em canvas. O balão de pedido
do cliente usa **a mesma função**: o cliente literalmente pensa na
miniatura do cardápio. Zero asset externo, e ainda é a leitura mais rápida
possível de "o que ele quer".

**HUD novo.** `showPlacar` é "eu × ele" e não serve. Entra um
`showTurno({ tempo, dinheiro, coracoes, leva })` no `Ui.ts`. `showCharge` é
reaproveitado tal e qual para chapa, suco e ritmo da bancada.

**Sons.** Já existem e servem: `apito` (chamar o Walter), `latido`, `miado`
(Pelusa), `sino`/`sorvete` (prato pronto), `gluglu` (suco), `porta` (cliente
chegando), `confirma`, `escolha`, `pegar`. Faltam três receitas novas em
`audio/efeitos.ts`: **chapa chiando**, **queimou** e **registradora**.

**Teste.** `scripts/turno.mjs`, medindo e não só fotografando. O Chromium sem
tela roda a ~10fps com dt travado, então **o tempo de jogo corre a ~1/3 do
relógio**: o script tem que esperar por EVENTO, nunca por tempo. Asserções
mínimas: um cliente entra e senta; a paciência de quem está `lendo` **não**
cai; a comanda aparece no balcão; prato queimado é recusado; o Pelusa rouba
prato deixado no balcão; o turno fecha com o salão vazio. Mais fotos do salão
cheio, olhadas antes de dar qualquer etapa como pronta.
