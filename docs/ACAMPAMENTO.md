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
3. **Dentro da barraca**, as quatro: **papo de travesseiro**, **sombras na
   lona**, **dormir de conchinha** e **cócegas e guerra de travesseiro**.
4. **Na clareira**, as quatro: **cozinhar no fogareiro**, **olhar as
   estrelas**, **vaga-lumes** e **música e dança lenta**.

**O que está no jogo** (veja §5): a **etapa A** — a clareira, a barraca
com o que tem dentro, o fogareiro, entrar e deitar, e sentar na canga — e a
**etapa B**, a noite: passar a noite, fechar a barraca, a conchinha, dormir
e acordar com o sol nascendo atrás do lago.

**Onde mora o código**:

- as peças: `src/world/acampamento.ts` (a barraca, os colchões, o fogareiro…,
  e a porta que fecha, a lanterna e o varal que acendem);
- a noite: `src/world/noite.ts` (os céus de cada momento, a cúpula com as
  estrelas, a lua e o sol baixo, os vaga-lumes) e o `entities/BeijoDeitado.ts`
  (virar de lado: o beijo e a conchinha);
- a clareira: a seção "A CLAREIRA ATRÁS DO LAGO" em
  `src/scenes/villaLobos.ts` (a noite é o bloco "A NOITE (etapa B)");
- os testes: `scripts/clareira.mjs` (o lugar, de dia) e `scripts/noite.mjs`.

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
- **papo de travesseiro**: deitados, um sorteio de perguntas carinhosas e
  bobas, cada uma com a resposta dos dois (as respostas de verdade são do
  Renan e do Ari; as provisórias são marcadas como provisórias);
- **sombras na lona**: com a lanterna, bichinhos de sombra com a mão na
  parede da barraca (coelho, pato, cachorro — e o Walter);
- **cócegas e guerra de travesseiro**: travesseiros voando, risada, e
  termina num beijo.

**Na clareira (D)**:
- **cozinhar no fogareiro**: chocolate quente, miojo ou café de manhã — a
  chama azul, o vapor, e os dois tomando sentados na canga;
- **olhar as estrelas**: deitados na canga, a câmera vira para o céu, uma
  estrela cadente e um pedido;
- **vaga-lumes**: tentar pegar um no pote e soltar;
- **música e dança lenta**: o celular tocando baixinho (som sintetizado) e os
  dois dançando agarradinhos na frente da barraca.

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

## 4. Perguntas em aberto

- As respostas do **papo de travesseiro**: o Renan quer escrever as dele e as
  do Ari, ou começamos com provisórias?
- A **música** da dança: uma melodia própria, ou o Renan tem uma música do
  casal para servir de inspiração (o som é sintetizado, então seria uma
  versão "de caixinha de música")?

## 5. A ordem de construção

| # | etapa | o que fica em pé no fim |
|---|---|---|
| A ✅ | **O lugar** *(no jogo)* | a clareira e a trilha, a barraca com o teto que sai, colchões, sacos de dormir, travesseiros, lanterna, fogareiro, panelinha, canecas, mesinha, canga, mochilas, tronco, varal de luzinhas; entrar na barraca e deitar, sentar na canga; a memória da chegada |
| B ✅ | **A noite** *(no jogo)* | anoitecer e amanhecer, estrelas, vaga-lumes, luzes acesas, fechar a barraca, dormir de conchinha |
| C | **Dentro da barraca** | papo de travesseiro, sombras na lona, guerra de travesseiro |
| D | **Na clareira** | fogareiro, estrelas e estrela cadente, pegar vaga-lume, música e dança lenta |
| E | **Os amigos** | convidar quem é do parque (futuro) |
