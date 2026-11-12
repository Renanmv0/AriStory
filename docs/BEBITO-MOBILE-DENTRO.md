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

**Estado:** ⬜ só o plano. Nada disto está no jogo, e tudo fica atrás da chave
`BEBITO_MOBILE_NO_JOGO` (`?bebito` para testar), como o resto do carro.

**A ideia numa frase:** o Bebito Mobile deixa de ser só uma coisa que se
dirige e vira um LUGAR dos dois — onde se entra, se mexe no rádio, se deita
para olhar o céu e se vai de carona olhando a paisagem passar.

### As etapas

| etapa | o quê | depende de |
|---|---|---|
| **D1** | a câmera de DENTRO (perspectiva, pescoço que gira) e a porta que abre | — |
| **D2** | **entrar no carro** na garagem: a animação, o interior visto de dentro e o menu "o que a gente faz?" | D1 |
| **D3** | **descansar no carro**: os bancos deitam, os dois deitam, o que se faz lá, levantar | D2 |
| **D4** | o **piloto automático** de verdade (hoje só existe como piloto de TESTE) | — (pode ir em paralelo à D1) |
| **D5** | a **visão do passageiro** na viagem: trocar de visão, olhar em volta, as interações fofas | D1 + D4 |
| **D6** | acabamento: memória, save, sons, celular, peso, testes e docs | todas |

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
   - **Mexer no rádio** — ver §3.2 (ideia);
   - **Descer** — a câmera volta e a porta fecha.

**Descansar no carro (D3):**

- os dois encostos da frente deitam (`deitarEncostos`) e viram a cama de
  verdade; os dois deitam lado a lado (o padrão da cama do quarto), de
  barriga para cima, com a câmera na visão de um deles olhando para cima;
- **dá para abrir o teto** (`mostrarTeto(false)`) e ver o céu: de dia,
  nuvens passando; de noite, as estrelas da clareira (o céu e a estrela
  cadente já existem). Com o teto fechado: a chuvinha no teto como ideia (§5);
- o que dá para fazer lá (a escolher, ver as perguntas): papo de
  travesseiro (o que o Bebito book é na barraca), o rádio baixinho, olhar o
  céu, **cochilar** (um fade, o ronco, acordar com o sol mais baixo);
- **levantar**: os encostos voltam e a câmera desce para a visão de sentado;
- **a memória**: a primeira vez que descansam ganha uma memória no diário,
  como o resto ("Descansamos no Bebito Mobile").

### 3.2 A visão do passageiro (D5)

**Como se troca:** durante a viagem, um botão (**👀** no celular, uma tecla no
computador — a decidir) passa para a visão de dentro, do banco do passageiro.
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
- O céu pelo teto aberto e as estrelas reusam o que a clareira já pintou (a
  noite, a estrela cadente). Atenção ao peso: a câmera de dentro vê pouco
  mundo, então dá para mostrar menos.
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

- A viagem **de noite**, com os postes acesos e o descanso sob as estrelas na
  estrada (liga o descanso com a noite da clareira).
- **A chuvinha no teto** (som + gotas no vidro, só quando chove) como parte do
  descanso.
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

## 7. As perguntas para o Renan

Escolhas que mudam o que eu construo (as minhas sugestões vão primeiro):

1. **A porta**: uma porta que **gira de verdade** (recomendo) ou a câmera só
   **atravessa o vidro** com um fade?
2. **Quem é o "personagem da visão"**: o que o jogador controla na hora
   (recomendo), ou sempre o Ari (ou sempre o Renan)?
3. **Descansar**: teto **aberto para ver o céu** (de dia, nuvens; de noite,
   estrelas) ou fechado? E queremos **cochilar de verdade** (fade, ronco,
   acordar com a luz do fim de tarde) ou só ficar deitados conversando?
4. **O que se faz deitado**, entre: o rádio baixinho, o papo de travesseiro
   (o Bebito book, que já existe na barraca, poderia vir junto), olhar o céu,
   brincar de achar formas nas nuvens, uma conversa da dupla. Quais?
5. **Como se troca para a visão do passageiro**: um botão **👀** sempre na
   tela durante a viagem, ou só quando a viagem está tranquila (sem bicho na
   faixa)?
6. **Os corações no piloto automático**: o carro pega os corações sozinho
   (e a carona ganha também) ou os corações são só de quem dirige, e a
   carona tem **outra recompensa** pelas interações?
7. **As interações fofas do passageiro**: da lista da §3.2, quais entram
   primeiro? (Minha escolha para começar: acenar para os bichos, passar a mão
   no Jean-Luc, mexer no rádio e a cabeça no ombro.) Tem alguma que só vocês
   dois conhecem — uma piada, um gesto, uma música — que tem que estar?
8. **O rádio**: queremos mexer no rádio já aqui (três estações) ou deixar para
   a parte do rádio da etapa D?
9. **As falas**: as da carona e as do descanso são minhas e provisórias — a
   fala que o Renan escrever vai literal.

**O que eu proponho como primeiro passo, se for tudo certo:** a **D1 + D2** (a
porta e a entrada, com o interior visto de dentro e o menu), com fotos para
o Renan olhar antes de seguir para o descanso.
