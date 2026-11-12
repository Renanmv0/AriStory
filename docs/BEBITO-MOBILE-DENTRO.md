# O Bebito Mobile por dentro — plano da etapa D (parte 1)

> Documento de PROJETO. Cada etapa marca aqui, na tabela de etapas, quando entra no jogo, e o
> `git log` é a fonte da verdade do que de fato existe. Continua o
> `docs/BEBITO-MOBILE.md` (o carro, a quest e a viagem); **as próximas rotas
> (parque ↔ clube ↔ escola) ficam para o plano seguinte, de propósito.**

## COMECE AQUI

**O pedido** (Renan, 2026-11-12): duas coisas, e só elas por enquanto.

1. **Entrar no carro, na garagem, com uma animação na visão de um dos
   personagens**, para a gente ver o carro POR DENTRO. Dali dá para escolher
   **descansar no carro**: os bancos deitam, e os dois ficam lá um pouco.
2. **Na viagem, trocar para a visão do passageiro**: uma coisa fofa, com
   **interações fofas**, olhando de um lado para o outro **enquanto o carro
   dirige sozinho**.

**Estado (2026-11-12): D1 a D5 FEITAS, atrás de uma chave PRÓPRIA, DESLIGADA.**

A chave do carro está ligada desde 2026-11-12 (o Ari já joga com ele), então o
carro por dentro NÃO entra de surpresa no save de verdade: tem a própria chave,
`CARRO_POR_DENTRO_NO_JOGO = false` em `src/eventos/BebitoMobile.ts`. Para ver:
**`?bebito&carroPorDentro`** (o save de teste do carro: ele já tem o carro na garagem se a quest do presente foi jogada ali; num save de teste novo, `&licoes=10` conclui as lições e é só dormir na cama para começar a quest).
Para pôr no jogo do Ari: trocar a chave para `true` — só com o aval do Renan.

O que a porta nova mudou NO MODELO vale para todos (a porta do motorista é um
grupo à parte), mas fechada é a mesma imagem de antes: conferido por foto de
antes e depois, e o teste do carro (`scripts/bebitoMobile.mjs`, parte `porta`).

**A ideia numa frase:** o Bebito Mobile deixa de ser só uma coisa que se
dirige e vira um LUGAR dos dois — onde se entra, se deita para conversar e se
vai de carona olhando a paisagem passar.

### As etapas

| etapa | o quê | depende de |
|---|---|---|
| **D1** | a câmera de DENTRO (perspectiva, pescoço que gira) e a porta que abre | ✅ feita |
| **D2** | **entrar no carro** na garagem: a animação, o interior visto de dentro e o menu "o que a gente faz?" | ✅ feita |
| **D3** | **descansar no carro**: os bancos deitam, os dois deitam, a conversa, o cochilo, levantar | ✅ feita |
| **D4** | o **piloto automático** de verdade (gentil, de jogo), que roda até com fala ou menu na tela | ✅ feita |
| **D5** | a **visão do passageiro** na viagem: o 👀, olhar em volta e as interações do Ari e do Renan | ✅ feita |
| **D6** | acabamento: o que ficou de fora (§6.1), o celular em pé, e a decisão de ligar a chave | ⬜ falta o Renan olhar |

Ordem que recomendo: **D1 → D2 → D3** (a entrada e o descanso, que são o
primeiro pedido) e depois **D4 → D5 → D6**. A D4 pode vir antes se o Renan
preferir começar pela viagem.

---

## 1. O que já existe (conferido no código, 2026-11-12)

Boa parte do que o pedido precisa já foi construída pensando nele — o modelo
nasceu com a frase "a cabine tem que caber uma cena, para um dia a viagem poder
ser vista de dentro" (`world/bebitoMobile/BebitoMobile.ts`).

| peça | onde | o que dá |
|---|---|---|
| **a cabine por dentro** | `BebitoMobile.ts` (`CABINE`) | assoalho, forro das portas, painel com o rádio, bancos inteiriços de matelassê, tampão do porta-malas, caixas de roda por dentro |
| **seis lugares de sentar** | `carro.assentos` | motorista, passageiro, o do meio da frente (bicho pequeno) e três atrás; a dupla já senta na frente e atrás (testado em `scripts/bebitoMobile.mjs`, parte `lugares`) |
| **a cama** | `carro.deitarEncostos(1)` e `carro.cama` | os encostos da frente deitam e, com os dois assentos, viram um colchão só; a âncora de deitar segue o padrão da cama do quarto (`g.ridePlayer(carro.cama, …)` + `g.setLying(true)`); a dupla deitada já é testada |
| **o teto sai** | `carro.mostrarTeto(false)` | o grupo `teto` (capota e colunas) some e a pestana das portas segura a grossura |
| **comandos do carro** | `rodar`, `estercar`, `frear`, `pisca`, `acenderFarois`, `solavanco`, `andando`… | tudo o que a viagem já usa |
| **o que pendura** | vagas da ficha (painel, retrovisor, chaveiro, teto, banco de trás…) | o Jean-Luc do painel, o chaveiro e os adesivos já são coisa de olhar de perto |
| **pose de carro** | `g.poseNoCarro('jogador'|'parceiro', 'dirigindo'|'passageiro')` | mãos no volante / mãos no colo, pernas para a frente |
| **câmera em perspectiva** | `g.setCameraOmbro(de, para)` + `g.olharLivre()` | o molde é a **cabine da roda gigante** (`scenes/villaLobos.ts`, `olharNaCabine`): a câmera é recolocada do zero a cada quadro a partir da matriz de mundo da cabine, o olhar é um ângulo acumulado com limite de pescoço |
| **a saída de carro** | `eventos/bebitoMobile/partida.ts` (`sairDeCarro`) | as perguntas "Ir de carro pro Villa Lobos?" e "Quem dirige dessa vez?" e a ida à cena `viagem-de-carro`; a porta do motorista na garagem é a interação `frente:sair-de-carro` |
| **o piloto automático… de TESTE** | `scenes/viagemDeCarro.ts`, função `piloto()` | segue a faixa livre, desvia da obra, dos buracos e do ônibus, desacelera na lombada e **para antes da faixa e no sinal**. Só roda com `depuracaoDaViagem.piloto = 'bom'` |
| **o céu e as estrelas** | clareira (`scenes/villaLobos.ts`, "olhar as estrelas") | o céu escurecendo, as estrelas, a estrela cadente, o coração no quadro, o beijo deitado |
| **o rádio** | o radinho da clareira (`'danca-lenta'`, `radioLiga`, `antena`) | a música de dançar agarradinho e os sons de sintonia |
| **o beijo e as mãos dadas** | `entities/Beijo.ts`, `maos` | só entre fichas `casal: true` |

## 2. O que NÃO existe (o trabalho de verdade)

1. **Uma câmera de dentro do carro.** A viagem usa a câmera de perseguição por
   fora. Dentro, aparecem os problemas de sempre da primeira pessoa: o plano
   `near` cortando o painel, a cabeça e os braços de quem olha atravessando a
   tela, o teto e as colunas tapando a vista, e o balanço da carroceria
   chacoalhando a imagem.
2. **A porta que abre.** O carro tem o corte das portas desenhado, mas a porta
   não é uma peça que gira. (Ver a decisão D2 na §4.)
3. **O piloto automático como mecânica de jogo.** Hoje ele é uma função de
   teste, presa a uma variável de depuração. Para o jogador, ele tem que ser
   uma regra com cara: devagar, gentil, que respeita a faixa e o sinal e que
   se desliga com um toque.
4. **Trocar de visão no meio da viagem**, com o painel (corações, progresso,
   aviso) e os botões adaptados.
5. **Gente sentada olhando em volta.** A cabeça do rig gira, mas a pose de
   carro (`poseNoCarro`) nunca precisou virar o rosto para a janela ou para o
   outro.
6. **O que fazer dentro**: as interações (o §3.2 lista as ideias).

---

## 3. O que cada parte é

### 3.1 Entrar no carro (D1, D2) e descansar (D3)

**O fluxo** (a garagem, com o carro em casa):

1. A porta do motorista continua sendo o ponto de interação, mas o rótulo
   vira **"Entrar no Bebito Mobile"** (hoje é "Sair de carro", e a pergunta
   da viagem passa a ser uma das escolhas lá dentro).
2. **A animação**: a tela passa para a visão de um dos dois. A câmera sai da
   isométrica e vai até a porta do carro — a porta abre — e ENTRA, terminando
   na altura dos olhos de quem sentou. Dura uns 3 a 4 segundos, sem pular
   (mas com um toque para acelerar).
3. **Dentro**, parados, a câmera olha o interior: o painel e o rádio, o
   Jean-Luc, o chaveiro, o banco de trás, o outro ao lado. Dá para girar o
   olhar (o mesmo pescoço da roda gigante). É o momento "uau, olha por
   dentro".
4. **O menu "O que a gente faz?"**:
   - **Ir de carro pro Villa Lobos** — segue o fluxo de hoje ("Quem dirige
     dessa vez?"), agora saindo de dentro do carro;
   - **Descansar no carro** — a D3;
   - **Descer** — a câmera volta e a porta fecha.

**Descansar no carro (D3):**

- os dois encostos da frente deitam (`deitarEncostos`) e viram a cama de
  verdade; os dois deitam lado a lado (o padrão da cama do quarto), de
  barriga para cima, com a câmera na visão de um deles;
- **o teto fica FECHADO** (a garagem é coberta: não há céu para ver — decisão
  do Renan). O que se faz lá é só o **bate-papo** (uma conversa curta sobre
  aonde viajar com o Bebito Mobile) e o **rádio baixinho** de fundo;
- depois da conversa, o menu: **Sair do carro** ou **Cochilar** (um fade, o
  ronco baixinho e acordar no mesmo lugar);
- **levantar**: os encostos voltam e a câmera desce para a visão de sentado;
- **a memória**: a primeira vez que descansam ganha uma memória no diário,
  como o resto ("Descansamos no Bebito Mobile").

### 3.2 A visão do passageiro (D5)

**Como se troca:** durante a viagem, um botão **sempre na tela** (**👀**; no
computador também uma tecla — a decidir) passa para a visão de dentro, do banco do passageiro.
Ao trocar, o carro **assume o piloto automático** (a D4): ele continua pela
estrada, para nas faixas e no sinal e desvia sozinho. O mesmo botão (ou "pegar
o volante") devolve o manche, com o carro soltando o controle suave, sem
trancos. Quem estava dirigindo continua no volante — com as mãos no volante e
o carro se mexendo "sozinho" (é o Bebito: ele dirige).

**Olhar de um lado para o outro:** o joystick/arrasto gira o olhar (como na
roda gigante), com limite de pescoço: dá para olhar a janela da direita, a
paisagem à frente, e o motorista à esquerda. O balanço do carro entra na
imagem de leve (a câmera vai presa à carroceria, filtrando o solavanco).

**As interações fofas** (as ideias; o Renan escolhe quais entram, §7):

| ideia | o que é | custo |
|---|---|---|
| **Acenar para os bichos** | na faixa de pedestres, tocar nos bichos acena para eles; eles respondem (a pata grasna, o patinho pia, a tartaruga põe a cabeça para fora) | pequeno: já existe a `TravessiaDeBichos` |
| **A carona comenta** | falas curtas do que passa (a roda gigante aparecendo, o ônibus, uma poça), como as de hoje, mas na primeira pessoa | pequeno (falas minhas, provisórias) |
| **Mexer no rádio** | trocar a música (2 ou 3 estações: a do parque, a de dançar, uma nova de estrada) | médio: a música é sintetizada, uma estação nova é um `CLIMA` |
| **Passar a mão no Jean-Luc do painel** | ele balança, ela/ele fala | pequeno |
| **O vidro embaçado** | soprar e desenhar um coração com o dedo na janela (canvas), que some devagar | médio |
| **Beijinho no motorista** | um beijo na bochecha com o motorista segurando o riso e o carro dando uma balançadinha | médio: reusa o beijo |
| **Cabeça no ombro** | encostar no motorista e olhar a paisagem passar (a câmera inclina) | pequeno |
| **Foto da paisagem** | tirar uma foto da estrada, que vira uma memória pequena | médio |
| **Contar corações / nuvens** | mini-brincadeira que vale um prêmio pequeno | pequeno |

**O que o piloto automático ganha e perde** (a decidir, §7): se ele pega os
corações da viagem (hoje o recorde é de quem dirige), ou se os corações só
valem dirigindo e a carona ganha **outro** tipo de recompensa (as interações
dão "corações de carona").

---

## 4. As decisões técnicas (propostas)

### D1 — a câmera de dentro e a porta

- **A câmera.** Uma classe única, `eventos/bebitoMobile/cameraDeDentro.ts`, no
  molde do `olharNaCabine` da roda gigante: o olho e a mira vêm da matriz de
  mundo da carroceria (o olhar acompanha o carro), o olhar é um ângulo
  acumulado com limite de pescoço e `g.olharLivre()` na entrada. Em cima disso,
  três coisas novas:
  - **o balanço filtrado**: o solavanco da carroceria entra na imagem, mas
    suavizado (para não enjoar);
  - **o corpo de quem olha some** (a cabeça e o cabelo ficam invisíveis na
    visão dele; as mãos ficam) — senão a câmera nasce DENTRO da própria cabeça;
  - **o `near`** da perspectiva menor só enquanto essa câmera está ligada
    (para o painel de perto não ser cortado), devolvendo o padrão ao sair.
- **A porta.** A decisão que preciso do Renan (§7): a opção simples é a
  câmera **atravessar o vidro** com um fade rápido (sem peça nova); a opção
  bonita é uma **porta que gira** (`carro.abrirPorta(lado, k)`, um grupo novo
  com o pivô na dobradiça dianteira, no estilo da porta da casa, e o corte já
  desenhado serve de referência). Recomendo a segunda: é o gesto que faz a
  entrada ser "de verdade", e é uma peça pequena. A porta de correr de trás
  (o trilho já está desenhado) pode entrar depois.

### D2 — a entrada

- O `partida.ts` ganha um passo antes da pergunta: a **cena de entrada**
  (câmera + porta + o personagem sentando), e a pergunta "Quem dirige dessa
  vez?" passa a vir do menu de dentro. O fluxo de `sairDeCarro` continua o
  mesmo para quem escolher viajar, então a viagem não muda.
- **A visão de quem?** A de quem o jogador controla agora (`g.playerId()`), e
  o outro senta do lado. Não precisa de escolha extra.
- O menu usa o `g.ask` de sempre; "Descer" devolve a câmera isométrica e a
  dupla em pé ao lado do carro.

### D3 — descansar

- A dupla sentada vira a dupla deitada na âncora `carro.cama` (os dois
  padrões já existem e são testados: `scripts/bebitoMobile.mjs`, `lugares`).
- Sem céu: o teto fica fechado. O rádio baixinho é um fundo musical suave (uma
  música que já existe, em volume baixo, ligada enquanto dura o descanso); a
  conversa usa o `g.say` de sempre.
- **Sair do descanso desfaz tudo** (encostos, teto, pose, câmera) — a lição
  do bug de hoje (a pose de carro que ficou grudada ao sair): a pose de
  carro agora é desfeita em toda troca de cena, mas o descanso tem que
  limpar o próprio estado também, e o teste confere.

### D4 — o piloto automático

- Tirar a função `piloto()` de dentro do `viagemDeCarro.ts` para um módulo
  (`eventos/bebitoMobile/pilotoAutomatico.ts`) e ligar a uma **regra de
  jogo**: `estado.piloto: 'ninguem' | 'automatico'`. O manche do jogador
  volta a mandar assim que ele mexe (ou toca o botão), com uma passagem
  suave.
- O que ele já faz (para, desvia, desacelera) é o que o teste de hoje prova;
  o que falta é **gentileza**: velocidade de passeio fixa, curvas largas, uma
  distância maior para parar. É uma regra de "motorista que quer que a
  carona aproveite".
- O piloto de teste vira um caso dele (`depuracaoDaViagem.piloto = 'bom'`
  continua existindo para os testes).

### D5 — a visão do passageiro

- **O estado `visao`**: `'fora'` (a perseguição de hoje) ou `'dentro'`. A
  troca liga a D1 e a D4. O painel da viagem (corações, progresso, aviso)
  continua em cima, e o botão de trocar fica junto dos do celular.
- As interações são cada uma um `w.interact`/toque (`w.clicavel`) na cabine,
  ativas só na visão de dentro.
- O balão do que o piloto automático está fazendo ("parando para a pata",
  "esperando o sinal") entra no aviso: quem está de carona vê POR QUE o
  carro parou.

### D6 — acabamento

- O save: `bebito:descansos` (contador), a memória do descanso, e o estado
  da visão **não** é salvo (cada viagem começa pela visão de fora, a de
  dirigir).
- Sons novos (cada um medido em `.wav`, como a skill de som pede): a porta
  do carro abrindo e fechando (`portaDoBebito` já existe, é o fechar), o ronco
  baixinho de quem cochila, a chuva no teto (se entrar), o vidro embaçado.
- O celular em pé, o peso e a atualização dos docs.

---

## 5. Ideias que cabem depois (não fazem parte deste plano)

- A viagem **de noite**, com os postes acesos.
- **A chuvinha no teto** (som + gotas no vidro) como parte do descanso.
- O **banco de trás** (a dupla ou convidados), que já tem os três lugares.
- **Passeio sem destino**: ficar rodando de piloto automático só pelo prazer
  de olhar.

## 6. Testes, fotos e peso (o que cada etapa precisa provar)

`scripts/carroPorDentro.mjs` (novo), uma parte por etapa:

- **câmera**: o olho está a alguns cm do assento certo; o pescoço respeita o
  limite; sair devolve a isométrica e o `near` de sempre; a cabeça de quem
  olha some e volta (e as mãos ficam);
- **entrar**: da garagem, a porta abre, a câmera termina dentro, o menu tem as
  quatro escolhas, "Descer" devolve a dupla em pé ao lado do carro (e nenhum
  dos dois fica com pose de carro, a medida do bug de hoje), e a viagem que sai
  dali é a mesma de antes;
- **descansar**: os encostos chegam a `1`, os dois deitam na cama (a posição
  medida), o teto abre e fecha, levantar desfaz tudo, e a memória é gravada
  uma vez só;
- **piloto**: o carro dirige a viagem inteira sozinho (parando nas duas
  faixas e no sinal) e devolve o manche; os bichos nunca são tocados;
- **passageiro**: trocar de visão no meio da viagem não muda a rota nem o
  estado do carro; olhar em volta; cada interação faz o seu efeito medido.

Fotos de cada passo, no computador e no celular em pé (`CEL=1`), **olhadas** —
o interior pede foto de perto de tudo (painel, rádio, banco, o outro de
lado). O peso medido por `renderer.info.render`, antes e depois, no commit.
O `scripts/zfighting.mjs` na porta nova.

## 6.1 O que ficou feito (o mapa do código) e as escolhas minhas

| peça | onde |
|---|---|
| a PORTA do motorista (grupo `porta-do-motorista`, pivô na dobradiça da frente; `carro.abrirPorta(sim)` e `portaAberta`; ~66°) | `world/bebitoMobile/BebitoMobile.ts` |
| a câmera de dentro (olho na cabeça de quem joga, pescoço, encostar no ombro, o celular na mão, desliza de e para uma tomada de fora) | `eventos/bebitoMobile/cameraDeDentro.ts` |
| entrar, o menu de dentro, descansar, cochilar e descer | `eventos/bebitoMobile/entradaNoCarro.ts` (a garagem: `scenes/frenteDaCasa.ts`) |
| o 👀 (botão) e o piloto automático de jogo, a troca de assento | `scenes/viagemDeCarro.ts`, `ui/Ui.ts` (`botaoDaViagem`) |
| o menu do passageiro (cantarolar, celular, elogiar, ombro) | `eventos/bebitoMobile/passageiro.ts`, `world/celularDeJogo.ts` |
| a chave própria | `eventos/BebitoMobile.ts` (`carroPorDentroNestaPagina`) |
| o teste | `scripts/carroPorDentro.mjs` (e a parte `porta` de `scripts/bebitoMobile.mjs`) |

**As escolhas que o Renan não fez e que eu fiz** (dizer se quer diferente):

- **Quem joga na entrada é quem está sentado no banco do MOTORISTA**, e o outro
  no do passageiro. A pergunta "Quem dirige dessa vez?" vem depois, ao escolher
  "Viajar", como sempre: se o outro for dirigir, eles trocam de banco na estrada.
- **Descansar**: os dois deitam lado a lado (quem joga do lado do motorista), de
  barriga para cima; o rádio baixinho é a música de dançar da clareira
  (`'danca-lenta'`, o rádio de verdade fica para depois); a conversa curta e o
  cochilo (fade, três roncos, acordar) têm falas minhas, provisórias. A primeira
  vez vira a memória "Descansamos no Bebito Mobile".
- **A visão do passageiro**: o 👀 liga o piloto automático e a câmera nos olhos
  de quem joga, que vai para o banco da carona — se dirigia, o outro assume o
  volante ("Deixa que eu dirijo um pouco") e na volta cada um ao seu banco.
  A tecla é **V**; o **E** (ou o ✨ no celular) abre o menu "O que fazer?".
- **O piloto de jogo** fica na faixa da direita, NÃO persegue os corações (os da
  viagem são de quem dirige), olha mais longe e freia mais cedo que o de teste, e
  roda mesmo com uma fala ou o menu na tela.
- **O Ari cantarola Dança Kuduro** com um "lá-lá-lá" sintetizado no ritmo da
  música (nada de áudio gravado nem letra); **o Renan joga Brawl Stars** num
  celular com uma arena desenhada por mim, sem arte nem logotipo do jogo.
- **Aberto**: o piloto automático conta para a NOTA da viagem (as 3 estrelas)?
  Hoje conta: ele nunca bate. Se o Renan quiser que "dirigir bem" seja só de
  quem dirige, é uma linha.

## 7. As decisões do Renan (2026-11-12) e o que ainda está aberto

O Renan respondeu o plano. **O que ficou decidido** (e já ajustei no texto
acima onde mudou):

| pergunta | decisão |
|---|---|
| 1. A porta | **gira de verdade** |
| 2. A visão de quem | **de quem o jogador controla** na hora |
| 3. Descansar | **deitados, com uma curta conversa sobre aonde viajar com o Bebito Mobile**; depois dá para escolher **sair do carro** ou **cochilar** |
| 4. O céu | **sem céu**: a garagem é coberta, então o teto NÃO abre para ver estrelas ou nuvens. Só o **bate-papo e o rádio baixinho** |
| 5. O botão da visão do passageiro | **sempre na tela** durante a viagem |
| 6. Os corações no piloto automático | **vão sempre para o motorista** (a carona não ganha corações; ver a pergunta aberta sobre a recompensa) |
| 7. As interações do passageiro | **a escolha é do jogador, num menu** (ver §7.1) |
| 8. O rádio | **fica para depois** (a parte do rádio da etapa D) |
| 9. As falas | as do primeiro encontro com o carro estão no jogo (o grito do Ari é do Renan, literal); **de resto, as minhas ficam como estão** |

**O que isso muda no plano:**

- **D3 (descansar)**: o teto fica fechado e o descanso é só a conversa e o
  rádio baixinho. A conversa é curta, sobre **onde viajar com o Bebito Mobile**
  (as falas são minhas, e provisórias); ao terminar, o menu pergunta **"Sair do
  carro"** ou **"Cochilar"**. O céu e as estrelas saem do plano, e o rádio
  baixinho é só um fundo (uma música suave, não a tela de escolher estação,
  que é a parte do rádio, depois).
- **D5**: o botão **👀** fica sempre na tela durante a viagem (a bússola da
  troca de visão), e os corações continuam sendo só do motorista — quem está de
  carona vê a viagem, escolhe o que fazer, mas não pega corações.
- **O rádio** sai das etapas D1 a D6. A ideia "mexer no rádio" do menu da
  entrada fica fora até a parte do rádio.

### 7.1 O que cada um faz de carona (a escolha é do jogador)

Quem está no banco do passageiro abre um **menu "O que fazer?"** e escolhe.
O Renan descreveu o que cada um faz — e agora está tudo decidido:

**O Ari de passageiro:**
- **cantarolar "Dança Kuduro"** (a música é a escolhida pelo Renan). O
  cantarolar é um **"lá-lá-lá" sintetizado** no ritmo da música, em sons do
  jogo (nada de áudio gravado e nenhuma letra escrita: o Ari só cantarola,
  como a música soa na cabeça de quem canta baixinho no carro). Vale a regra
  do som do jogo: a receita nova entra em `src/audio/efeitos.ts` e é ouvida em
  `.wav` antes de ser dada como pronta;
- **elogiar o Renan** (falas curtas, minhas, provisórias);
- **encostar no ombro dele**.

**O Renan de passageiro:**
- **jogar Brawl Stars no celular** (decidido pelo Renan: "fica jogando Brawl
  Stars"). Ele fica de cabeça baixa com o celular na mão, os dedões mexendo, e
  a tela do celular mostra uma **arenazinha estilizada** desenhada em canvas
  (uma silhueta de personagem andando e tiros de bolinha), sem copiar arte,
  personagem nem logotipo do jogo: o nome só aparece nas falas ("Calma, deixa
  eu terminar essa partida…"). Ele para quando o Ari chama;
- **elogiar o Ari**;
- **encostar no ombro dele**.

**O Cochilar** (decidido): **só um fade, o ronco baixinho e acordar** no mesmo
lugar — um cochilo mesmo, sem passar tempo e sem dia e noite. O ronco é um som
sintetizado novo (baixinho, medido em `.wav`).

(A lista de ideias da §3.2 que não entrou na escolha do Renan — acenar para os
bichos, passar a mão no Jean-Luc, o vidro embaçado, o beijinho… — fica de
reserva, para entrar depois se ele quiser.)

### 7.2 O que ainda está aberto

1. **A recompensa dos corações** (continua aberta): hoje os corações da viagem
   **não dão nada além de pontos** (a pontuação da viagem e o recorde de
   corações). **Novidade do Renan (2026-11-12): vai haver um guarda do
   estacionamento que dá recompensas por dirigir bem, que custam corações**
   (plano separado, só anotado: `docs/ESTACIONAMENTO.md`). Isso responde ao
   "o que os corações dão" — eles viram a moeda dessas recompensas —, mas só
   quando aquele plano for feito; até lá, nada muda aqui.

**O que eu proponho como primeiro passo:** a **D1 + D2** (a porta que gira, a
câmera de dentro e a entrada, com o interior visto de dentro e o menu), com
fotos para o Renan olhar antes de seguir para o descanso (D3).
