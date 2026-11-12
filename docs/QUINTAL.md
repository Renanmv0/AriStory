# Decorar o quintal da casa do Ari

> Plano em construção. Cada etapa marca aqui o que entrou no jogo; o `git log`
> é a fonte da verdade do que mudou por último.

## COMECE AQUI

**O pedido do Renan (2026-11-12)**: "No quintal da casa, o Ari vai adorar poder
decorar, então tire os canteiros do chão e monte somente o plano de um sistema
para decorar o quintal, parecido com o da estufa da Josefina, mas com mais
opções de lugares para colocar."

**As respostas dele ao plano (2026-11-12)** — valem acima de qualquer proposta
mais abaixo:

| pergunta | a decisão do Renan |
|---|---|
| quando entra | "O quintal entra só quando o carro ficar pronto" — tudo atrás da chave do Bebito Mobile (`bebitoMobileNestaPagina()`); `?bebito` para ver |
| a loja | "um catálogo de itens pelo correio": no COMPUTADOR do quarto do Ari, que "ao invés de ir direto para o laboratório de testes, abriria um tipo de área de trabalho onde escolheríamos onde abrir", e um dos ícones é o serviço **"Papita Delivery"**, "onde poderíamos comprar itens para casa e para o quintal (inicialmente só para o quintal)" |
| a moeda | "usa o dinheiro nosso mesmo" — os reais da carteira do casal |
| os lugares | "Vale decorar tudo na parte de fora!" (o jardim, a garagem, as paredes e os muros) |
| o que é fixo | "Podemos comprar novos tipos de caminhos de lajes também! E se quisermos podemos tirar a árvore e a hera." |
| por onde se decora | "pelas ferramentas na garagem para editar as decorações" |
| parede | "O Ari escolhe a altura no muro." |
| planta | "Plantas não PRECISAM ser regadas, mas podem." |
| móveis | "Coloque alguns móveis, vamos adicionando mais com o tempo." |

**A ideia em uma frase**: o MESMO decorador da estufa (`world/decorador.ts`),
ensinado a pôr enfeite em mais tipos de lugar — no chão, no piso (cobrindo o
chão), na parede (na altura que o Ari escolher), em cima (do muro, da janela,
da prateleira) e pendurado (no pergolado, no beiral, no galho) —, mais os que
se amarram de um ponto a outro (varal de luzinhas, bandeirinhas, rede). O que
se põe é COMPRADO no Papita Delivery, pelo computador do quarto, chega numa
caixa no portão, e se põe e se arruma pelas ferramentas da garagem.

| etapa | o quê | estado |
|---|---|---|
| **0** | limpar o jardim | ✅ feita (2026-11-12) |
| **1** | o primeiro ciclo inteiro, no CHÃO: a área de trabalho do computador (o laboratório e o **Papita Delivery**), o catálogo em reais (as plantas do kit e alguns móveis), a encomenda chegando no portão, as ferramentas da garagem (pôr e arrumar), e o save sabendo EM QUE LUGAR está cada enfeite | ✅ feita (2026-11-12) |
| **2** | os PISOS e os CAMINHOS de lajes novos (deck, pedras, pedrisco, canteiro de desenhar); tirar e pôr de volta a ÁRVORE e a HERA | ✅ feita (2026-11-12) |
| **3** | PAREDE (o Ari escolhe a altura), EM CIMA, PENDURADO e de PONTA A PONTA | ✅ feita (2026-11-12) |
| **4** | os MÓVEIS que fazem alguma coisa (sentar no banco, balanço, rede, mesa, piscininha, casinha do Pelusa) e REGAR (opcional) | ✅ feita (2026-11-12), e a piscininha e o fogo de chão no mesmo dia (4b) |
| **5** | a aba "Para casa" do Papita Delivery (decorar a casa por dentro) | ⬜ só quando o Renan pedir |

Uma etapa por vez, parando ao fim de cada uma para o Renan escolher (como o
projeto faz).

---

## O que a etapa 1 pôs no jogo (com `?bebito`)

- **A área de trabalho** (`ui/computadorDoAri.ts`): "Usar o computador" no
  quarto abre a tela do computador por cima do jogo, com os ícones. A pasta
  `AriStory_teste` leva ao laboratório pelo caminho de sempre (a câmera, o
  redemoinho, sugados); o **Papita Delivery** abre o app de compras. Sem a
  chave do Bebito, o computador é o de antes (direto na pergunta da pasta).
- **O Papita Delivery**: o catálogo do quintal (`world/decoracoesDoQuintal.ts`)
  em duas prateleiras, 🌿 Plantas e 🪑 Móveis (a aba 🏠 "Para casa" aparece
  como "em breve"); o preço em reais, da carteira do casal; o botão "Pedir"
  paga e põe uma unidade A CAMINHO; o cartão conta o que está a caminho, no
  baú e no quintal.
- **A encomenda**: chegando no quintal com algo a caminho, uma caixa de
  papelão do Papita (fita adesiva e a etiqueta da batatinha) espera no chão,
  ao lado do caminho de lajes, logo depois do portão — ao pé do pilar o muro
  a escondia da câmera. "Abrir a encomenda" põe tudo no baú.
- **As ferramentas da garagem**: o painel de ferramentas de jardim na parede
  do fundo da garagem. "Decorar o quintal" abre o baú (o que está guardado, com
  "Colocar"), e "Arrumar o quintal" liga o modo de edição do decorador (mudar
  de lugar, girar, guardar).
- **O chão do quintal**: as regras de onde pode (`RegrasDoQuintal`, na cena):
  o jardim e o fundo da garagem; o caminho de lajes, a frente da porta, o arco
  do portão, a vaga e a manobra do carro ficam livres; o que é ALTO (mais de
  1,45 m desde a etapa 4) fica longe do muro da frente e do da direita, que
  são os do lado da câmera.
- **O save**: `posta.cena` (`'estufa'` quando falta: save antigo) e
  `aCaminho` (comprado, ainda no correio). O baú é um só: o que a Josefina
  vende também pode ir para o quintal (é enfeite de jardim: a ficha sem
  `cenas` vai aos dois lugares), e o do Papita só vai para o quintal
  (`cenas: ['quintal']`).
- **Leve**: o decorador agora passa todo enfeite PARADO pela `fundir()` (na
  estufa também; o que tem `anima` fica inteiro). O quintal cheio (as 14
  peças) custa 298 → 337 desenhos por quadro e 127 mil → 156 mil triângulos
  na vista de sempre; a mesma vista com e sem `?semFundir` difere em 17
  pixels (sem juntar seriam ~600 desenhos a mais na cena toda).
- **O catálogo** (`world/decoracoesDoQuintal.ts`): as plantas do kit, cada uma
  num canteirinho de casca de beira torta (hortênsia azul, rosa e lilás,
  lavanda, margaridas, capim de pluma, agave, costela-de-adão, buxinho no vaso
  e a espada-de-são-jorge do quarto), de R$ 18 a R$ 32; e os móveis — o banco
  de praça do kit (R$ 120) e três peças novas: a mesinha bistrô de ferro com
  as duas cadeirinhas (R$ 140), a espreguiçadeira de ripas com rodinhas e
  colchonete (R$ 110) e o guarda-sol de gomos com babado (R$ 90). Por
  enquanto os móveis são de olhar; sentar e deitar neles é a etapa 4.
- **O teste**: `scripts/quintal.mjs` (ver §8).

## O que a etapa 2 pôs no jogo (com `?bebito`)

- **A prateleira 🪨 Chão do Papita**: seis PISOS e quatro CAMINHOS.
- **Os pisos** (`world/pisosDoQuintal.ts`, ficha com `piso: true`): o deck de
  madeira (tábuas com veio e o vão escuro, emendas desencontradas), o
  canteiro de casca redondo com a borda de seixos, o canteiro de terra oval
  com a serrilha de tijolinho, o pedrisco branco com a guia de cimento, o
  tapete de área externa listrado com franja, e o gramado de florzinhas (um
  lote de 150). O chão deles é decalque; o decorador não dá colisor ao piso,
  deixa enfeite EM CIMA (a mesinha no deck, a hortênsia no canteiro) e piso
  cruzando piso — o posto por último pinta por cima (`renderOrder` por peça).
  Piso também respeita o caminho, o portão e as paredes.
- **Os caminhos** (`world/caminhosDoQuintal.ts`): o caminho da casa (da porta
  ao portão e o ramal da garagem) em cinco jeitos — as lajes de sempre, as
  pedras de passar (tortas, de bisel macio, aos pares), o tijolinho em fiadas
  com a guia de tijolo em pé, os dormentes de madeira no pedrisco, e a pedra
  portuguesa com a guia escura. O caminho se compra UMA vez (o cartão vira
  "✓ é de vocês"); o baú das ferramentas tem a linha "🛤️ O caminho da casa"
  para trocar. O traçado é sempre o mesmo. Save: as flags
  `quintal:caminho:<jeito>`.
- **A árvore** virou peça do quintal: na primeira visita ela entra no save no
  lugar de sempre (`plantarAArvoreDaCasa`), e daí em diante se guarda e se
  planta onde quiser, como enfeite (a pegada é o tronco).
- **A hera**: "Tirar a hera" / "Pôr a hera de volta" no baú
  (`quintal:sem-hera`).
- **A regra do alto** ficou mais justa: o muro da direita só tapa da metade
  do jardim para a frente; no fundo, encostado na casa, coisa alta pode (é
  onde a árvore nasceu).
- Peso: o quintal com a árvore mudada, os seis pisos, a mesinha e a
  hortênsia, 312 desenhos por quadro e 150 mil triângulos na vista de sempre.

## O que a etapa 3 pôs no jogo (com `?bebito`)

- **A prateleira 🖼️ No alto do Papita**, com 15 peças
  (`world/decoracoesDeParede.ts`):
  - na PAREDE: a arandela acesa (com o leque de luz na parede), o vaso de
    parede com a samambaia caindo, a casinha de passarinho azul-céu, o
    espelho de jardim em arco e a treliça com a trepadeira florida;
  - EM CIMA do muro e da mureta: o vasinho de suculentas, o gatinho de
    cerâmica, a lanterninha solar acesa e o trio de vasinhos de barro;
  - PENDURADO na viga do pergolado e no beiral: o vaso de macramê, o sino de
    vento (que balança; o som fica para depois) e a lanterna de papel acesa;
  - de PONTA A PONTA: o varal de luzinhas, as bandeirinhas e o cordão de
    lanternas, pela catenária entre os dois pontos.
- **O decorador** ganhou os encaixes (`Superficie` e `amarras` nas
  `RegrasDoLugar`): o fantasma GRUDA na parede (só de frente para ela), no
  tampo ou na viga mais perto à frente de quem joga; na parede, **▲ ▼ (ou + e
  −) escolhem a altura** — "O Ari escolhe a altura no muro" —, e a barra
  mostra os metros; a peça não tapa porta, janela, lampião, as ferramentas e
  a prateleira, não passa da ponta, não fica em cima de outra, e a mais alta
  que a parede não entra ("alto demais para o muro"). De ponta a ponta: o
  primeiro E marca a primeira ponta, o X desfaz, o segundo E põe; as pontas
  são o alto dos pilares, os postes do pergolado e quatro ganchos do beiral,
  de 1,2 a 9,5 m.
- **As superfícies do quintal** (`scenes/frenteDaCasa.ts`): a fachada, as
  duas paredes da garagem por dentro, a face de fora do muro (a da rua e a
  do lado), a mureta; o alto do muro e da mureta; a viga do pergolado e o
  beiral. Só as que a câmera vê.
- **O save**: `posta.encaixe`, `y`, `sup` e `ate` (a segunda ponta). Peça
  presa numa superfície que a cena não tem mais volta ao baú.
- **No modo de edição** o "Mexer no…" de cada peça fica no chão, na frente
  dela; a da parede e a de ponta a ponta não giram ("Esse fica sempre de
  frente").
- Peso: as 15 peças no alto, a vista de sempre com 393 desenhos e 151 mil
  triângulos (os halos das luzinhas são um desenho cada).

## O que a etapa 4 pôs no jogo (com `?bebito`)

- **O móvel de usar** (`uso` na ficha, `world/moveisDeUsar.ts`): o decorador
  põe o ponto de usar junto da peça (descansa nos modos de colocar e de
  editar). Os dois sempre juntos, e no fim "Ficar mais um pouco?":
  - **Banco de jardim** — "Sentar no banco", lado a lado (as falas de
    sempre do banco de praça: "Senta aqui um pouco." / "Só um pouquinho.");
  - **Mesinha bistrô** — "Sentar à mesinha", de frente um para o outro;
  - **Espreguiçadeira** — "Deitar ao sol" (o momento curto, como a do clube);
  - **Balanço de jardim** (novo, R$ 180) — estrutura em A de madeira, o
    banco de dois lugares nas correntes; os dois sentam e ele EMBALA
    enquanto ficam, e para devagar;
  - **Rede com suporte** (nova, R$ 160) — o suporte de madeira em arco e a
    rede listrada; os dois deitam juntos, a câmera vai para cima (como a
    cama do quarto), e a rede embala de leve.
- **A casinha do Pelusa** (nova, R$ 70): rosinha, de telhadinho, a
  plaquinha com o nome, a almofada e a tigelinha. Com ela no quintal, o
  Pelusa vem morar aqui fora também: cochila na porta dela e aceita carinho.
- **O regador**: "Pegar o regador" no baú das ferramentas; ele vai na mão de
  quem joga, e perto de cada planta (e das peças com planta: o vaso de
  parede, o macramê, as suculentas, a treliça, o gramado de flores e os
  canteiros) aparece "Regar a …": o arco de gotas do bico até a planta, ela
  balança de contente e agradece. "Plantas não PRECISAM ser regadas, mas
  podem": nada murcha sem ele. O save conta as regadas (`quintal:regadas`).
- **A piscininha e o fogo de chão (4b)** — o Renan pediu os dois que tinham
  ficado de fora (`world/moveisDeUsar.ts`, os dois com `fundirComAnima`):
  - **Piscininha** (R$ 75): dois anéis infláveis em gomos (azul e creme,
    terracota e creme, pela cor do vértice), o fundo, a água translúcida com a
    luz correndo (o `offset` da textura) e um **patinho de borracha** que boia
    e passeia. "Pôr o pé na água": os dois sentam na beirada (o mesmo
    `setSitting(true, 'beirada')` do trapiche do lago), o pé dentro d'água, e
    **cada chute faz uma marolinha** (um lote de oito anéis que crescem e somem)
    com o `respingo`. As marolinhas e o patinho são da `anima`, então seguem
    vivos com a pergunta "Ficar mais um pouco?" na tela.
  - **Fogo de chão** (R$ 120): o anel de pedras em dois andares (um lote, três
    tons), a cinza, cinco toras encostadas, e dois toquinhos para sentar
    frente a frente. O fogo é o grupo `fogo`: nove línguas (um lote, cor por
    cópia: brasa, laranja e a clarinha) que tremem, dez faíscas que sobem e
    somem, o halo e a poça de luz pintados — **nenhuma luz de verdade**.
    "Chegar perto do fogo" pergunta: sentar em volta, **apagar** ou **acender**
    (usa os sons `chamaApaga` e `chamaAcende` que já existiam). Ele nasce
    ACESO (é o que o retrato e o fantasma mostram); apagar não é guardado no
    save, e recarregar o acende de novo.
  - **Leves apesar de se mexerem**: a ficha ganhou `fundirComAnima`. A regra: o
    que a `anima` mexe é malha de água, lote (`InstancedMesh`) ou grupo com
    NOME (`patinho`, `fogo`), todos guardados em `userData` da raiz — a
    `fundir()` os deixa quietos e junta o resto (cada peça ficou com 6
    malhas). Na vista de sempre, as duas juntas custam 298 → 313 desenhos.
  - As falas novas são minhas ([provisório], para o Renan aprovar): na
    piscininha "Cabe só o pé, mas o pé já tá feliz." / "O patinho tá olhando
    pra gente."; no fogo "Tá quentinho aqui." / "É o fogo ou é você?".
  - Ainda não tem som de estalo de lenha; fica para quando o Renan pedir (o
    jogo tem as regras de som na skill `aristory-som`).
- A régua do ALTO perto do muro passou a 1,45 m (a rede, de 1,35, cabe no
  canto da direita; o balanço e o guarda-sol continuam longe dos muros).
- **As falas novas são minhas, para o Renan aprovar ou trocar** (fala dele
  vai literal): na mesinha "Um café aqui fora?" / "Com você, sempre."; no
  balanço "Segura firme." / "Tô segurando você."; na rede "Cabe nós dois?" /
  "Sempre cabe."; ao sol "Sol na cara e ninguém com pressa." / "Mais dez
  minutinhos, …"; no Pelusa "Ele gostou da casinha." / "Ele gostou foi da
  almofada.".
- Peso: o quintal com os seis móveis e a hortênsia, 347 desenhos e 140 mil
  triângulos na vista de sempre.

## 1. O que já existe (e se reaproveita inteiro)

O sistema da estufa (skill `aristory-enfeite`) foi feito para ser de qualquer
cena — ele só fala com o `WorldBuilder` e a `GameAPI`:

| peça | o que faz | no quintal |
|---|---|---|
| `world/decorador.ts` (`Decorador`) | monta os enfeites do save, o modo de colocar (o fantasma translúcido na frente de quem anda, o anel verde/vermelho, a barra girar/colocar/cancelar), o modo de edição ("Mexer no…", mudar, girar, guardar), o colisor e o desvio de quem passeia | o MESMO; ganha os tipos de lugar (§3) |
| `RegrasDoLugar` | a cena diz onde NÃO pode (parede, canteiro, vão de passagem) | o quintal escreve as dele (§3.1) |
| `Cofre` | de onde sai o pagamento (na estufa, os girassóis) | o quintal escolhe a moeda (§7) |
| `world/decoracoes.ts` | o catálogo: uma função e uma ficha por enfeite | cresce (§4); cada ficha diz ONDE pode ir |
| `world/retrato.ts` | a foto do cartão da loja, tirada do `monta()` | igual |
| `scripts/enfeite.mjs`, `scripts/decorar.mjs` | medem a pegada e a altura e fotografam; a lojinha e os modos inteiros | ganham o quintal (§8) |

E o que falta, que é o pedido: hoje todo enfeite é um CÍRCULO NO CHÃO.

---

## 2. Por que mais lugares

Quintal de verdade se decora em tudo: vaso no muro, quadrinho na parede, varal
de luzinha no pergolado, balanço no galho, deck no chão. E a câmera ajuda: a
fachada da casa, a lateral direita e as paredes da garagem ficam VIRADAS para
ela (`+Z` e `+X`) — são as paredes mais à vista do jogo, e hoje estão vazias.

---

## 3. Os lugares de pôr

Cada ficha do catálogo diz em que TIPO de lugar ela vai (`lugares: [...]`), e a
cena do quintal declara as SUPERFÍCIES que tem de cada tipo. O decorador junta
as duas coisas: o fantasma só "gruda" onde aquele enfeite cabe.

### 3.1 CHÃO — como na estufa

Na grama do jardim, andando, com a pegada redonda (`raio`). As regras do
quintal (`RegrasDoLugar`), a conferir na foto:

- **o caminho de lajes fica livre** (a regra da casa: "passagem tem eixo, e o
  eixo fica vazio") — da porta ao portão, e o ramal até a passagem da mureta;
- a frente da porta (o degrau e os dois buxinhos), a passagem da mureta, e o
  arco que a folha do portão social varre quando abre (ela abre para dentro);
- a garagem: a vaga e a manobra do carro ficam livres; o fundo da garagem,
  atrás do carro, pode (vaso, bicicleta…) — a ver na foto;
- o pé da árvore (o tronco e as raízes);
- **a altura conta**: o muro da frente e o da direita estão do lado da câmera.
  Perto deles, só enfeite baixo (até ~1,2 m, a régua do `enfeite.mjs`); o que é
  alto (guarda-sol, balanço, árvore de enfeite) vai da metade do jardim para
  trás, perto da casa. Quem decide é a altura da ficha, medida (`alto`).

### 3.2 PISO — o que cobre o chão

Deck de madeira, caminho de pedras, pedrisco, canteiro de terra ou de casca,
gramado de flores, tapete de área externa. **É o "canteiro" que saiu, devolvido
às mãos do Ari**: ele desenha onde quer canteiro. O piso:

- é um DECALQUE (não tem altura), em formas prontas — retângulo de quina
  redonda, redondo, oval e "caminho" em S —, em três tamanhos, e gira;
- NÃO colide, e outro enfeite pode ficar EM CIMA dele (é o ponto do piso: a
  mesa no deck, a hortênsia no canteiro); dois pisos podem se cruzar, e o que
  foi posto por último fica por cima (a ordem de pintura do chão, skill de
  cenário);
- o caminho de lajes da casa é um piso também, e o Ari pode trocar: o
  Papita vende caminhos de lajes de outros tipos (decisão do Renan).

### 3.3 PAREDE — o que se pendura na parede

As paredes que a câmera VÊ: a fachada (dos dois lados da porta, entre as
janelas e abaixo do beiral), a lateral direita da casa, o fundo e o lado da
garagem, e a face de fora do muro (a da rua). **A face de dentro do muro da
frente e do da direita não**: ela olha para longe da câmera e ninguém a veria.

- cada parede é um RETÂNGULO declarado pela cena (onde começa, onde acaba, de
  que altura a que altura, para onde olha), com os buracos dela (porta,
  janelas, lampião, interfone);
- o fantasma anda grudado na parede mais perto à frente de quem joga: andar ao
  longo dela move o enfeite de lado; para cima e para baixo, dois botões na
  barra — **o Ari escolhe a altura** (decisão do Renan);
- a pegada é um retângulo na parede, e o anel vira uma moldura verde/vermelha.

Peças: vaso de parede, arandela, quadrinho, a plaquinha com o nome da casa,
o número da casa, o sino de vento, a casinha de passarinho, a treliça com
trepadeira, o relógio de parede de jardim, o espelho de jardim.

### 3.4 EM CIMA — o que se apoia num tampo

O topo do muro e da mureta, o peitoril das janelas (a floreira), o degrau da
porta e a prateleira do fundo da garagem. São LINHAS (o muro) ou RETÂNGULOS
pequenos (o peitoril, a prateleira), e o enfeite anda nelas como no chão,
grudado na altura do tampo. Peças miúdas: vasinho, suculenta, gatinho de
cerâmica, lanterninha de mesa, regador pequeno, abajurzinho solar.

### 3.5 PENDURADO — o que desce de cima

As vigas do pergolado (a garagem), o beiral da casa e o galho da árvore. São
pontos ou linhas no alto; o enfeite pende deles (corda ou corrente até a
peça). Peças: vaso pendente com samambaia, sino de vento, lanterna de papel,
gaiolinha de enfeite, filtro dos sonhos — e o **balanço no galho da árvore**
(que é móvel: §4.4).

### 3.6 DE PONTA A PONTA — o que se amarra em dois pontos

Varal de luzinhas, bandeirinhas, cordão de lanternas e a **rede**. Põe-se em
dois toques: a primeira ponta (num ponto de amarrar — pilar, viga, beiral,
galho, poste do muro) e a segunda; a peça faz a curva (catenária) entre os
dois. Os pontos de amarrar são da cena, como os de pendurar.

### 3.7 Como fica o modo de colocar

O de sempre — anda-se para escolher, a barra de baixo tem girar, colocar e
cancelar (G, E e X no teclado; botões no celular) — e:

- o fantasma GRUDA na superfície que serve àquele enfeite e está mais perto à
  frente de quem joga; se não houver nenhuma por perto, ele fica vermelho no
  chão com a dica ("chegue perto de uma parede");
- ao entrar no modo, a câmera abre um pouco (mais quintal na tela) e o Q/R
  continua girando — enfeite de parede se põe melhor de frente para ela;
- ponta a ponta: o primeiro E marca a ponta A, o segundo a B; X desfaz.

---

## 4. O catálogo do quintal (proposta — o Renan escolhe)

Os enfeites de hoje da estufa (o anão, o flamingo, a lanterninha, a
capivara…) servem ao quintal também: a ficha deles ganha `lugares: ['chao']` e
`cenas: ['estufa', 'quintal']`. E entram:

### 4.1 Plantas (do kit `world/plantasDeJardim.ts`)

Hortênsia (três cores), lavanda, capim de pluma, agave, costela-de-adão,
margaridas, buxinho no vaso — e novas: roseira, girassol (o da Josefina!),
samambaia, espada-de-são-jorge (a do quarto do Ari), suculentas, uma hortinha
(alface, tomate, temperos). As plantas de cada espécie seguem num LOTE para o
quintal inteiro (é assim que foram feitas), então cem margaridas pesam como
uma.

**Decidido**: "Plantas não PRECISAM ser regadas, mas podem." Regar é um
carinho, não uma obrigação — a planta nunca murcha; regada, ela brilha um
pouco, solta umas gotinhas e quem sabe abre mais flor (etapa 4).

### 4.2 Pisos

Deck de madeira, caminho de pedras redondas, pedrisco branco, canteiro de
terra, canteiro de casca, tapete de área externa, gramado de flores miúdas.

### 4.3 Luz

Lanterninha (a da estufa), luminária solar de espeto, arandela de parede,
varal de luzinhas (ponta a ponta), lanterna de papel pendurada, luz no pé da
árvore. Luz pintada, como manda a skill (halo e poça, nenhuma luz de verdade).
De noite (quando a casa tiver noite) elas fazem o quintal.

### 4.4 Móveis (os que FAZEM alguma coisa — etapa 4)

| móvel | o que se faz |
|---|---|
| banco de jardim | sentar os dois (o `w.banco` de sempre) |
| balanço no galho | um senta e balança; o outro empurra |
| rede | ponta a ponta; deitar os dois (`g.setLying`) e balançar |
| mesa com guarda-sol | sentar de frente um para o outro; quem sabe um lanche |
| espreguiçadeira | deitar ao sol |
| piscininha de plástico | os pés na água (o "sentar na beirada" do lago) |
| fogueira de quintal / fire pit | sentar em volta (de noite) |
| casinha do Pelusa | **o Pelusa passa a vir para o quintal** e dorme nela |
| comedouro de passarinho | passarinhos pousam (o `bebedouro` da estufa já existe) |

### 4.5 Da vida deles (pergunta 8)

A plaquinha com o nome da casa, o número, um capacho, a bicicleta encostada,
o quadrinho de uma memória do quadro do quarto pendurado na parede de fora…
— o que o Renan quiser que esteja lá. Pede foto ou descrição, não se inventa.

---

## 5. O save

`DecoracaoNoSave` (`core/types.ts`), desde a etapa 1:

```ts
{
  uid, id,
  posta: null | { x, z, giro, cena: 'estufa' | 'quintal' },  // sem `cena` → 'estufa'
  aCaminho?: true,                                            // comprado, no correio
}
```

Nas etapas 3 em diante a `posta` ganha o resto: `encaixe` ('chao' | 'piso' |
'parede' | 'emCima' | 'pendurado' | 'pontaAPonta'), `y` (parede e pendurado:
a altura), `superficie` (o id da parede, do tampo, da viga) e `ate` (ponta a
ponta: a segunda ponta). `normalizarDecoracoes` conserta na leitura, como
sempre: o que não tiver encaixe é chão, e superfície que não existe mais
devolve o enfeite ao baú (nunca some). O **baú é um só** para o casal: o que
está guardado aparece nos dois lugares, e cada ficha diz onde pode ir.

---

## 6. O motor (o que muda no código)

- **`Decorador`**: ganha as SUPERFÍCIES da cena (`RegrasDoLugar.superficies`:
  as paredes, os tampos, as vigas, os pontos de amarrar) e o "grudar" do
  fantasma; o anel vira moldura na parede; o ponta a ponta em dois toques. A
  estufa continua igual (só chão), e o `decorar.mjs` prova isso.
- **A ficha** (`FichaDeDecoracao`) ganha `lugares` (os encaixes que aceita),
  `cenas`, e `alto` (medido, para a regra da câmera). Piso ganha `forma` e
  `tamanho`.
- **A cena do quintal** declara as regras e as superfícies, monta o
  `Decorador` e o ponto de entrada: **"Decorar o quintal"** — proposta: uma
  caixa de ferramentas de jardinagem na prateleira da garagem, que abre o baú
  (o que tem guardado, e "Arrumar o quintal" para o modo de edição) — feito
  assim na etapa 1, como o Renan escolheu.
- **Leveza** (a regra de ouro do projeto): cada enfeite passa pela `fundir()`;
  enfeite repetido (dez vasinhos iguais) e planta viram LOTE; piso é decalque
  com a geometria juntada por material. Medir a vista do quintal cheio (umas
  50 peças) no commit, antes e depois.

---

## 7. A loja e a moeda — DECIDIDO

O **Papita Delivery**, no computador do quarto, em reais da carteira do casal
(a resposta do Renan, no COMECE AQUI). O que se compra chega pelo correio: uma
caixa no portão, que se abre e vai para o baú. Começa só com o quintal; a aba
"Para casa" fica para quando ele pedir.

---

## 8. Como testar

`scripts/quintal.mjs` (com `?bebito`, num save à parte):

- **escondido**: sem a chave, o computador é o de sempre (a pergunta da pasta);
- **computador**: a área de trabalho, o Papita (as duas prateleiras com
  retrato, pedir paga e põe no correio, sem dinheiro não compra e o botão
  apaga, "Para casa" em breve), voltar, e a pasta do laboratório levando ao
  laboratório;
- **encomenda**: a caixa no portão, abrir põe tudo no baú, e ela sai;
- **colocar**: o baú pelas ferramentas, as regras (o caminho, o ramal, o
  portão, o trilho do portão de correr, fora do quintal, o alto perto do
  muro), as 14 peças no quintal e uma no fundo da garagem, a pegada e a altura
  de cada uma medidas no mundo, o peso antes e depois, a mesma imagem com e
  sem `?semFundir`, e fotos;
- **arrumar**: recarregar e tudo no lugar, o "Arrumar o quintal", guardar, o
  X, e a estufa sem nada do quintal;
- **save**: enfeite sem `cena` é da estufa, e o `aCaminho` sobrevive.

`CEL=1` roda no celular em pé. O `scripts/decorar.mjs` e o
`scripts/enfeite.mjs` (a estufa) continuam passando, e o
`scripts/zfighting.mjs` mede o `painel-de-ferramentas`.

---

## 9. Perguntas ao Renan

As nove da primeira versão do plano foram respondidas (a tabela do COMECE
AQUI). Abertas para as próximas etapas:

1. **O que é DELES** (§4.5): tem alguma coisa do quintal ou da vida dos dois
   que tem que estar lá (o nome da casa, um objeto, uma planta que o Ari
   ama)? E as plantas e os enfeites que o Ari mais gosta, para o catálogo.
2. **Os móveis da §4.4** que fazem alguma coisa: quais entram primeiro (o
   balanço e a rede são cutscene de casal: eu escrevo as falas e mando para
   aprovar)?

(Respondida: "Papita é um jeito fofo que nos chamamos, e significa batatinha
mesmo" — a etiqueta da batatinha fica.)
