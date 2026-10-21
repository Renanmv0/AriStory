# A clareira atrás do lago — plano do acampamento

> Documento de PROJETO. Cada etapa marca aqui quando entra no jogo (§5), e o
> `git log` é a fonte da verdade do que de fato existe.

## COMECE AQUI

**O pedido** (Renan, outubro de 2026, ideia do Ari): um lugar só dos dois no
Parque Villa Lobos para ficarem sozinhos e "dar uns beijinhos" — reservado,
com árvores em volta, **atrás do lago e um pouco afastado dele**, com uma
**barraca de camping** pequena onde caibam os dois, **colchões no chão** lá
dentro, um **mini fogareiro de montanha**, dá para **passar a noite**, e
**várias opções de conversa e coisinhas para fazer a dois**. Mais para a
frente: **convidar os amigos do parque** — por enquanto, só os dois.

**As escolhas do Renan** (as quatro perguntas, respondidas):

1. **A barraca**: **iglu laranja e cinza** — a clássica de camping, cúpula de
   duas varetas cruzadas, sobreteto laranja com a barra cinza, porta em D.
2. **A noite**: **o parque anoitece de verdade**. Ao escolher passar a noite,
   o céu vai do pôr do sol à noite: estrelas, vaga-lumes na clareira, a
   lanterna da barraca acesa. Eles dormem e acordam de manhã, com o sol
   nascendo atrás do lago. Sair da clareira antes de dormir volta o dia.
3. **Dentro da barraca**, as quatro: **papo de travesseiro** (virou o
   **Bebito book**, ver §3), **sombras na lona**, **dormir de conchinha** e
   **cócegas e guerra de travesseiro**.
4. **Na clareira**, as quatro: **cozinhar no fogareiro**, **olhar as
   estrelas**, **vaga-lumes** e **música e dança lenta**.

**O que está no jogo** (veja §5): a **etapa A** — a clareira, a barraca
com o que tem dentro, o fogareiro, entrar e deitar, e sentar na canga —, a
**etapa B**, a noite: passar a noite, fechar a barraca, a conchinha, dormir
e acordar com o sol nascendo atrás do lago —, da etapa C, o **Bebito
book**: o caderninho dos planos pro futuro, escrito deitado de frente — e a
**etapa D** inteira: **cozinhar no fogareiro** (café coado e mini arepas de
dia, chocolate quente e miojo de noite), o **radinho e a dança lenta**, os
**vaga-lumes no pote** (pegar e soltar onde quiser, guardado no save) e
**olhar as estrelas** deitados na canga (a constelação de coração, a estrela
cadente e o pedido).

**Onde mora o código**:

- as peças: `src/world/acampamento.ts` (a barraca, os colchões, o fogareiro…,
  e a porta que fecha, a lanterna e o varal que acendem);
- a noite: `src/world/noite.ts` (os céus de cada momento, a cúpula com as
  estrelas, a lua e o sol baixo, os vaga-lumes) e o `entities/BeijoDeitado.ts`
  (virar de lado: o beijo e a conchinha);
- a clareira: a seção "A CLAREIRA ATRÁS DO LAGO" em
  `src/scenes/villaLobos.ts` (a noite é o bloco "A NOITE (etapa B)");
- o Bebito book: `src/ui/bebitoBook.ts` (o caderno na tela) e
  `src/minigames/bebitoBook.ts` (as perguntas, a regra de escrever na linha
  e o save);
- a etapa D: `src/world/cozinhaDeAcampamento.ts` (a cozinha do fogareiro:
  o caixote de feira, a chama, as receitas), `src/world/radinho.ts`,
  `src/world/poteDeVagaLumes.ts` (o pote e os vaga-lumes soltos), a
  constelação e a estrela cadente no `CeuDaClareira` (`world/noite.ts`), a
  dança no `entities/DancaLenta.ts` (com a pose no `CharacterRig`) e a
  música dela no clima `'danca-lenta'` (`audio/musica.ts`);
- os testes: `scripts/clareira.mjs` (o lugar, de dia), `scripts/noite.mjs`,
  `scripts/bebitoBook.mjs` e `scripts/acampamento.mjs` (a etapa D, por
  parte: `SO=cozinha`, `SO=radinho`, `SO=vagalumes`, `SO=estrelas`).

## 1. O lugar

O lago do Villa Lobos tem o centro em `(−21, 11)` e a areia vai até 9,2 do
centro (a margem de pedra e capim, até ~11,4). Atrás dele, no `−X`, até o
calçadão do rio (o mundo caminhável acaba em `x = −44`), era um bosque do
sorteio de árvores — o canto da foto do Renan.

A **clareira** fica em `(−38,5; 12,5)`, uns 8 m da água: perto o bastante
para ver o lago entre os troncos, longe o bastante para ninguém passar por
ali. As árvores do sorteio que caíam DENTRO dela não são plantadas (o sorteio
continua sorteando igual — senão o parque inteiro se mexeria; ver o comentário
do `soltosNoGramado`), e as que caíam em volta ficam, como parede do bosque.

**A regra da câmera** (a do ponto cego, na skill de cenário): a câmera vem do
`+X/+Z`. As árvores altas fecham a clareira pelos três lados que NÃO são a
câmera (o fundo e as laterais, um arco de copas); do lado da câmera só
arbusto, samambaia e flor baixa. Assim ela é reservada para quem está lá
dentro e continua visível na tela. Árvore translúcida está descartada (o
Renan cortou isso no jogo de passeio).

**A trilha**: uma faixa de terra batida que sai da margem do lago e entra na
clareira entre duas moitas — sem placa: o lugar é deles, quem acha, acha.

## 2. A barraca e o que tem nela

- **A barraca iglu** (`barracaIglu`): o domo é geometria própria (planta de
  cantos arredondados, e o pano cede entre as duas varetas); as varetas de
  alumínio cruzam de canto a canto; o sobreteto laranja tem a barra cinza
  embaixo e a aba sobre a porta; a porta em D tem o zíper e o pano enrolado
  e preso em cima; a janela de tela atrás; os tirantes e as estacas.
  **O teto sai** (o grupo `teto`): de dentro, a câmera olha de cima e vê os
  dois deitados, como na cama do quarto.
- **Dentro**: dois **colchões** infláveis (gomos), dois **sacos de dormir**
  (abertos, com o zíper e a gola), os **travesseiros** de camping e a
  **lanterna** de LED no canto (acende na etapa B).
- **Na frente**: a **canga** listrada, a **mesinha dobrável** baixa com o
  **fogareiro de montanha** (o cartucho de gás, a válvula, os três braços que
  seguram a panela), a **panelinha** de alumínio e as duas **canecas
  esmaltadas**; as duas **mochilas cargueiras** encostadas; o **tronco
  caído** de banco; o **varal de luzinhas** entre duas árvores (apagado de dia).

## 3. Os momentos (as etapas B a D)

**A noite (B)** — "Passar a noite aqui?": o céu vai ao pôr do sol e à noite
(`g.luzDoCeu`), estrelas no céu, vaga-lumes (`InstancedMesh`) piscando na
borda da clareira, o varal de luzinhas e a lanterna acesos (luz pintada).
**Dormir de conchinha** fecha a noite: a lanterna apaga, os dois deitam
abraçadinhos, a tela escurece e eles acordam com o sol nascendo atrás do lago
— memória no diário. Sair da clareira antes disso volta o dia.

**Dentro da barraca (C)**:
- ✅ **o Bebito book** *(no jogo)* — o pedido do Renan, no lugar do papo de
  travesseiro: uma conversa sobre os **planos pro futuro**, escrita num
  caderninho. "Escrever no Bebito book" vira os dois de lado, **de frente um
  para o outro** (a pose do beijo, sem o beijo), a câmera chega perto e o
  caderno aparece **fechado** na tela:
  - **a capa**, de pano costurado (linho desenhado em canvas), com a lombada,
    a etiqueta do nome ("Bebito book — os nossos planos pro futuro — Ari &
    Renan"), adesivos (a barraca laranja, a lua, uma estrela, um coração
    "A+R"), uma **polaroid dos dois** (os modelos 3D fotografados) presa com
    fita, rabiscos de caneta de gel, o **elástico** de fechar e a **fitinha**
    de marcar página. Um toque abre: o elástico escorrega para fora e a capa
    vira em 3D na lombada (no verso, a guarda estampada de barraquinhas e o
    bilhete "se você achar este caderno, Devolver para o Ari ou para o
    Renan" — texto do Renan, literal);
  - **a folha de rosto** é a ficha de caderno de escola: Nome, Matéria (os
    nossos planos pro futuro), Começado em (o dia em que abriram pela
    primeira vez) e Onde; e as três "regras do caderno" (a primeira, pedido
    do Renan: só os dois podem escrever nele — "Só nós dois podemos
    escrever aqui.");
  - **o miolo** é caderno comum: papel creme, pauta azul, margem vermelha,
    "Data __/__/__" no alto e **uma pergunta por página**, escrita a caneta
    com marca-texto. Doze perguntas e uma página de "espaço livre"; no
    computador, duas páginas abertas, no celular uma; a folha vira em 3D;
  - **escrever**: toca na linha e digita. **Cada um escreve com a sua letra**
    e a sua tinta — **Caveat** (azul) para o Ari, **Kalam** (roxo) para o
    Renan, as duas do Google Fonts e com os acentos do português. A caneta
    troca de mão no botão (ou no `T`). A palavra que não cabe desce inteira
    para a linha de baixo, a data da página se escreve na primeira letra, e
    a linha que é da letra do outro fica só de leitura (cada um com a sua);
  - **o caderno é um só e fica**: o save guarda cada linha com o dono, a
    data e a fitinha (aberto de novo, ele abre onde pararam). Fechou (o `Esc`
    ou o ✕), a cena segue: os dois comentam, corações, e a memória "O Bebito
    book". O caderno inteiro é desenhado numa medida fixa e escalado para a
    tela — a linha cabe o mesmo tanto de letra no computador e no celular.
  - **Provisório**: as doze perguntas e as falas de antes e depois são do
    Claude, até o Renan mandar as dele (ver §4).
- **sombras na lona**: com a lanterna, bichinhos de sombra com a mão na
  parede da barraca (coelho, pato, cachorro — e o Walter);
- **cócegas e guerra de travesseiro**: travesseiros voando, risada, e
  termina num beijo. **É o Ari que faz cócegas no Renan** (pedido do Renan:
  é assim na vida real).

**Na clareira (D)** — ✅ *no jogo*, com os pedidos do Renan ("no cardápio
da manhã, mini arepas além do café; o mini fogão com animação do fogo e
dele próprio; pegar os vaga-lumes e soltar onde quisermos, que eles
iluminariam o parque; um radinho bonitinho para dançar à noite, que de
manhã não faz nada; tudo com muito detalhe e animação"):

- ✅ **cozinhar no fogareiro** ("Cozinhar no fogareiro", na mesinha). Os
  dois sentam no chão em volta da mesinha (quem joga perto do fogo, o outro
  na frente) e a câmera chega perto pelo lado livre da mesa. Do lado da
  mesinha, um **caixote de feira** com o que se usa: o pacote de café (o
  rótulo em canvas), a lata de chocolate, o miojo, o potinho das arepas, a
  manteigueira, o canequinho dos talheres, o saquinho de marshmallow, o
  coador de pano, o budare e o prato — cada coisa voa do caixote para a mesa
  e volta para o mesmo lugar.
  - **o fogareiro vive**: a manopla gira na válvula, o acendedor estala
    duas faíscas, a chama de gás azul (um shader, `ChamaDeGas`) estoura e
    assenta, as catorze linguinhas da coroa tremem cada uma no seu tempo (e
    deitam para fora quando tem panela em cima — a chama abafa), a coroa vai
    ficando em brasa, o fogareiro inteiro treme fininho enquanto queima e
    joga uma luz azul pintada no tampo (de noite é o que se vê);
  - **de dia (e no café da manhã depois de dormir)**: **café coado** (a água
    ferve com a tampa sacudindo, o coador de pano senta em cima da caneca, o
    pó cai nele e a água passa pingando — uma caneca de cada vez),
    **mini arepas** (o pedido do Renan: o budare vai para o fogo, a manteiga
    derrete chiando, as quatro arepas cruas douram, viram na espátula e
    douram do outro lado com a marca de tostado, queijinho em duas, e vão
    para o prato) ou **café com mini arepas**;
  - **de noite**: **chocolate quente** (três colheradas de pó no leite, a
    colher mexendo em roda até ficar marrom, três marshmallows em cada caneca
    — um rosinha) ou **miojo** (o tijolinho amolece e solta os fios, o
    tempero laranja tinge o caldo, e eles comem os dois da panelinha);
  - pronto, a tela pisca e eles estão **na canga com a comida na mão** (a
    caneca soltando vapor, a arepa, o garfo com o miojo enrolado), com a
    câmera de frente; a memória "Café da manhã na clareira" ou "Jantarzinho
    no fogareiro", e a louça volta limpa para a mesinha.
- ✅ **o radinho e a dança lenta**: um **radinho de pilha** verde-menta no
  chão do lado da canga — painel creme, alto-falante de grade furadinha com
  aro cromado, mostrador de FM com um coraçãozinho na estação deles, dois
  botões serrilhados, o ledzinho, a alça de couro e a antena telescópica.
  **De dia ele não faz nada** (nem prompt). **De noite**, "Ligar o radinho":
  o botão estala, o led e o mostrador acendem (piscando, como lâmpada
  velha), a antena levanta e estica gomo por gomo, a agulha corre a escala,
  passa do coraçãozinho e volta; tocando, ele pulsa no tempo, balança e solta
  notinhas coloridas. A música vira a **balada de baile** (o clima
  `'danca-lenta'`: 66 bpm, I–vi–ii–V, arpejo de caixinha). "Dança comigo?" e
  os dois dançam agarradinhos na frente da canga — **o Renan com as mãos na
  cintura e o Ari pelos ombros** (provisório: o Renan é o mais alto) —,
  balançando juntos de olhos fechados, girando devagar no lugar, com a câmera
  passeando em volta e o céu estrelado atrás. No fim de cada música, **a
  voltinha** (o Ari gira por baixo do braço do Renan) e "Mais uma música?".
  Ligado, o prompt vira "Dançar" (e "Desligar o radinho"); o dia voltando ou
  dormir desliga na hora.
- ✅ **os vaga-lumes no pote**: um **pote de vidro** de conserva no chão do
  lado das mochilas — tampa de lata furadinha, alça de arame, barbante com
  laço e a etiqueta "vaga-lumes". De noite, "Pegar o pote" (ele vai na mão,
  pela alça), e o prompt **persegue o vaga-lume mais perto**: a tampa abre,
  ele voa para dentro e a tampa fecha (cabem oito, cada um piscando lá
  dentro, e o pote brilha mais quanto mais tem). "**Soltar os vaga-lumes
  aqui**" anda junto com quem segura o pote: eles saem voando e ficam
  rodando ali, com uma poça de luz verde no chão. **Cada ponto vai para o
  save** (`vagaLumesSoltos`, os 24 mais recentes): hoje só a clareira tem
  noite, e é lá que eles brilham — a lista é o que **o parque de noite
  (futuro)** vai ler para se iluminar onde os dois soltaram. O pote volta
  para o lugar quando outra coisa começa, e quando a noite acaba os que
  estavam nele são soltos do lado das mochilas.
- ✅ **olhar as estrelas**: de noite, a canga oferece "Deitar e olhar as
  estrelas". Os dois deitam lado a lado, a câmera vê de cima e desce até as
  cabeças olhando o céu; doze estrelas fazem um **coração** e, quando eles
  acham, o risco da constelação é desenhado traço por traço. Passa uma
  **estrela cadente**, cada um faz um **pedido que não conta**, e a câmera
  volta para cima deles para o beijo deitado. Memória "A estrela cadente".
- **Provisório**: todas as falas da etapa D são do Claude, e a música da
  dança é uma melodia nossa (ver §4).

**O peso da etapa D** (vista da clareira, de dia): o caixote e as coisas
dele, o radinho e o pote entram fundidos (um desenho por material); de
noite, os soltos são três lotes (os pontos, os halos e as poças) para todos
os pontos juntos, e a constelação são dois (as estrelas e o risco). Nenhuma
luz de verdade nova: a chama, o mostrador, o pote e as poças são luz
pintada.

**Os amigos (E, futuro)**: convidar os bichos do parque para a clareira (o
Mano, o Jean-Luc, a Estella…) — fica para depois, por decisão do Renan.

**O que a etapa A decidiu pelo caminho** (para o Renan conferir):

- a clareira fica em `(−38,5; 12,5)`, a barraca no fundo dela com a porta
  virada para a câmera (e para o lago), a canga e a mesinha na frente, as
  mochilas do lado (a verde-musgo e a vinho), o tronco caído de lado e o
  varal de luzinhas atrás, entre duas árvores;
- **dentro da barraca**: colchão azul com saco marinho de um lado, colchão
  mostarda com saco vinho do outro; os dois deitam com os pés para a porta.
  "E agora?" oferece **ficar abraçadinhos**, **dar um beijinho** (três falas
  que se revezam) e sair — as brincadeiras da etapa C entram nessa lista;
- **na canga** os dois sentam no chão e ficam mais um pouco se quiserem; o
  **fogareiro** por enquanto só promete o chocolate quente (etapa D);
- todas as falas desta etapa são provisórias, minhas — **menos** a que o
  Renan escreveu depois (ver abaixo);
- o peso: na vista da clareira, 354 → 413 desenhos por quadro e 27 → 73 mil
  triângulos (a régua do Mania é ~170 mil); na entrada do parque, 765 → 733.

**Depois da etapa A, a pedido do Renan:**

- **o beijinho na barraca tem animação**: os dois viram de lado, um de
  frente para o outro (rolam na âncora de deitar), chegam perto, fecham os
  olhos e se beijam — o braço de cima de um deles passa por cima do ombro
  do outro, as mãos de baixo se encontram no meio, e um coração sobe de
  cada um. A câmera desliza até quase em cima das cabeças
  (de lado, o perfil dos dois só se vê de cima) e volta depois da conversa,
  com os dois de barriga para cima de novo. Motor:
  `entities/BeijoDeitado.ts` (`g.beijarDeitados`, `g.virarDeitados`);
- **"Agora é só a gente bebito"** — fala do Renan, literal — fecha a conversa
  de quando eles entram, na boca do Ari (o lugar foi ideia dele). **Bebito**
  é como os dois se chamam, e **bebitolito** quando é mais fofo: o primeiro
  beijinho termina com o Ari chamando o Renan de bebitolito (fala minha,
  provisória);
- de quebra, os corações dos abraçadinhos nasciam no meio do mapa (a posição
  de quem está montado numa âncora é local a ela) — agora nascem em cima da
  cabeça de quem está jogando.

**A etapa B, como ficou** (pedido do Renan: "dando a opção de dormirmos e
passar a noite lá, lembrar de fechar a cabana se formos passar a noite"):

- **de dia, lá dentro**, "E agora?" tem **Passar a noite aqui**: a câmera
  sai da barraca e olha o céu por cima dela, e o dia vira noite em ~10 s —
  a tarde dourada, o pôr do sol atrás da barraca (a oeste), o crepúsculo
  roxo com as primeiras estrelas e a noite com a lua. As luzes vêm com o céu:
  o varal acende lâmpada por lâmpada, a lanterna acende (a barraca inteira
  brilha laranja e a luz vaza pela porta), os vaga-lumes aparecem na borda
  da clareira, os grilos começam e a música vira uma de ninar;
- **de noite** dá para sair e andar pela clareira; **sair dela volta o
  dia** (o resto do parque não anoitece) — um aviso, e o céu clareia;
- **de noite, lá dentro**, a escolha vira **Dormir**: o Renan pede para
  fechar a barraca ("que de noite entra bicho"), a câmera vê de fora o
  **zíper dar a volta na porta** e o pano do sobreteto fechar o D; lá dentro,
  os dois deitam **de conchinha, o Renan atrás abraçando** (escolha dele), o
  boa noite deles — **"Boa noite, bebito" / "Boa noite, bebitolito"** (escolha
  dele) —, a lanterna apaga num clique, a tela escurece com a luazinha;
- **de manhã**: a aurora, o passarinho, o bom dia, a barraca abrindo e os
  dois na porta vendo **o sol nascer atrás do lago**; a memória "A primeira
  noite na barraca" entra no diário e o dia volta;
- falas provisórias minhas (fora o boa noite e o "Agora é só a gente
  bebito", que são do Renan): o convite para passar a noite, o "Escureceu
  de vez", o pedido de fechar a barraca, o bom dia e o nascer do sol;
- o peso, na vista da clareira: de dia, nada muda (301 desenhos por
  quadro, antes e depois); de noite, 308 (+7: um para todos os halos do
  varal, um para a faixa de luz no chão, dois para os vaga-lumes, a luz que
  vaza pela porta e o halo e a poça da lanterna) e +2,3 mil triângulos.
  Nenhuma luz nova no motor (a noite é o mesmo sol, com outra cor), e a
  cúpula do céu só existe nas tomadas de câmera de cena.

**Depois da etapa B, a pedido do Renan** (visto no celular): de manhã, quando
a câmera vira para o sol, as duas árvores do arco que ficavam bem na linha
da porta para o lago (a florida rosa e a redonda, no leste da clareira)
tapavam o sol nascendo. Viraram dois **arbustos floridos** baixinhos (~1 m:
um rosa e branco, outro branco e lilás — `arbustoFlorido`), e agora da porta
se vê o lago, o parque e o sol nascendo lá no fim. O sol da manhã sobe quase
reto antes de ir para o lugar do dia (a `MANHA_CEDO`, entre a aurora e o
dia), para não escapar do quadro estreito do celular em pé no meio da
conversa. O `scripts/noite.mjs` mede: o sol na tela e nenhuma árvore entre a
câmera e ele (`CEL=1` roda no celular).

## 4. Perguntas em aberto

- As **perguntas do Bebito book**: as doze de agora são provisórias
  (`PERGUNTAS`, em `minigames/bebitoBook.ts`) — o Renan pode mandar as dele, e
  elas entram literais (as respostas ficam presas ao `id`, então trocar o
  texto não apaga nada). E as letras: a Caveat ficou com o Ari e a Kalam com
  o Renan — dá para trocar se ele achar que é o contrário.
- A **música** da dança: hoje é uma balada nossa (o clima `'danca-lenta'`).
  O Renan tem uma música do casal para servir de inspiração (o som é
  sintetizado, então seria uma versão "de caixinha de música")?
- **Quem leva na cintura** na dança: hoje o Renan (o mais alto), com o Ari
  pelos ombros — é assim que eles dançam?
- O **recheio das mini arepas**: hoje é queijinho branco em duas (e manteiga
  no budare). Tem um jeito que eles fazem?
- O **pedido da estrela cadente** e as falas da etapa D (a cozinha, a dança,
  os vaga-lumes, as estrelas): todas provisórias, minhas.

## 5. A ordem de construção

| # | etapa | o que fica em pé no fim |
|---|---|---|
| A ✅ | **O lugar** *(no jogo)* | a clareira e a trilha, a barraca com o teto que sai, colchões, sacos de dormir, travesseiros, lanterna, fogareiro, panelinha, canecas, mesinha, canga, mochilas, tronco, varal de luzinhas; entrar na barraca e deitar, sentar na canga; a memória da chegada |
| B ✅ | **A noite** *(no jogo)* | anoitecer e amanhecer, estrelas, vaga-lumes, luzes acesas, fechar a barraca, dormir de conchinha |
| C | **Dentro da barraca** | ✅ o Bebito book *(no jogo)*; sombras na lona, cócegas (o Ari no Renan) e guerra de travesseiro |
| D ✅ | **Na clareira** *(no jogo)* | cozinhar no fogareiro (café coado, mini arepas, chocolate quente, miojo), o radinho e a dança lenta, os vaga-lumes no pote (soltos guardados no save), olhar as estrelas (a constelação de coração e a estrela cadente) |
| E | **Os amigos** | convidar quem é do parque (futuro) |
