# Especial de Halloween no Villa Lobos — plano do evento

> Documento de PROJETO. **Nada disto está no jogo ainda**: é o plano que o
> Renan pediu antes de construir. Quando uma etapa (§9) entrar, marque-a
> aqui, e deixe o `git log` ser a fonte da verdade do que de fato existe.
> Tudo que está marcado como **proposta** espera a resposta do Renan (§10).

## ⭐ COMECE AQUI — o plano em uma página

**O pedido.** Um especial de Halloween no parque Villa Lobos: todos os
personagens do clube vão a uma **festa de Halloween no parque**, as lojas
ganham **decoração temática**, os personagens usam **fantasias fofas e bem
detalhadas**, e o parque inteiro fica enfeitado com o mesmo capricho. A festa
é uma **historinha de caça ao tesouro**: a dupla vai pedindo **doces ou
travessuras** de personagem em personagem, cada um dá uma pista, e a última
leva a **outro lugar**, onde a história tem um **final divertido**. Dá para
**ganhar fantasias** para os dois vestirem. E a história **começa com a
Estella**, que costurou fantasias de presente para a dupla — assim eles já
entram na festa fantasiados.

**A ideia que amarra tudo.** A Estella é a costureira do parque e é obcecada
pelas roupinhas que cria (`entities/bichos/Estella.ts`). Então a festa é
**dela**: foi ela que fez a fantasia de todo mundo, e cada personagem que a
dupla visita está usando uma peça que ela costurou. A caça ao tesouro é o
jeito que os amigos acharam de levar os dois até a **surpresa** do final.

**O caminho, em uma linha:**
**"Assistir um filme de terror"** no sofá de casa → a carta da Estella
desliza por baixo da porta → o parque **no pôr do sol, já enfeitado e vazio**
(todo mundo "se arrumando"), com os comentários da dupla no caminho → o
presente da Estella na boutique (**o vampiro e o morceguinho**) → a dupla
sai da boutique e **já é noite**: o **ônibus do clube** chega com todo mundo
→ **doces ou travessuras** em 10 paradas, juntando **balas** na cesta e
ganhando as **outras cinco fantasias** → com balas suficientes, o **portão
escondido** atrás da praça da roda abre → a festa surpresa na **Casinha da
Abóbora** (§7).

**Estado: etapas 1 e 2 construídas, escondidas.** O filme no sofá e a carta
da Estella (§2.1) e o parque no pôr do sol, enfeitado e vazio (§4.1) estão
no jogo, mas só aparecem com `?halloween` na URL (`src/eventos/halloween/`,
`src/world/halloween/`, `scripts/halloween.mjs`). A **parte 1** inteira
(§2.1 a §2.4) está fechada com o Renan; a próxima a construir é a **etapa
3** (o presente da Estella na boutique).

**Onde mora a etapa 2 no código:** o kit em `world/halloween/` (`abobora.ts`,
`pendurados.ts`, `pecas.ts`, `nessie.ts`; `kit.ts` é a vitrine dos testes);
a camada do parque em `eventos/halloween/noParque.ts` (uma chamada no fim
do `villaLobos.ts`); quem foi se arrumar em `eventos/halloween/ausentes.ts`
(uma chamada no fim do clube, do Mania, da estufa, da escola e do ginásio);
os recados em `eventos/halloween/recados.ts`.

**Decisões do Renan** (as que já valem):

- **nada aparece no jogo até TUDO estar pronto.** Cada etapa é construída,
  testada e publicada na `main`, mas fica ESCONDIDA atrás do `?halloween` na
  URL (só quem testa vê). O evento só abre para quem joga na última etapa
  (§9, etapa 8), quando todas as outras estiverem aprovadas;
- **parte por parte**: cada etapa é planejada com o Renan (os ajustes dele
  entram neste documento) antes de ser construída, e só se passa para a
  próxima depois de ela estar bem feita;
- **quem começa o evento é a dupla**, no sofá de casa ("Assistir um filme de
  terror"), e não um convite que aparece sozinho (§2.1);
- **o convite é uma carta de Halloween que desliza por baixo da porta** no
  meio do filme (§2.1);
- **o parque é visto primeiro NO PÔR DO SOL** (era "de manhã"; o Renan
  trocou, para casar com o tempo do evento), já todo enfeitado, e **sem os
  personagens**: estão todos "se arrumando" para a festa. No caminho até a
  Estella, a dupla vai comentando as decorações (§2.2);
- **as fantasias vão sendo GANHAS**: a Estella dá **só duas** no começo —
  o **vampiro** e o **morceguinho**, uma para cada um —, e as outras **cinco**
  (bruxinho, gato preto, abóbora, espantalho e **pirata**) se ganham pedindo
  doces ou travessuras: **uma fantasia inteira a cada duas paradas** (§5.2);
- **as fantasias têm que sair MUITO bem feitas, fofas e detalhadas** (§5.4);
- **a cesta de abóbora junta BALAS** a cada parada, e a festa na **Casinha da
  Abóbora** só destranca com uma certa quantidade (§5.3) — **o final é a
  Casinha da Abóbora** (§7, opção A);
- **a Estella está de aranha fofa**, do jeito bonitinho dela, e **faz o
  personagem da aranha** com frases de Halloween (§2.3);
- **o Pelusa vai de morceguinho e fica dormindo num pufe da boutique** — sem
  interação, só lá, deitado (§2.3);
- **o Ari é o vampiro e o Renan é o morceguinho** (as caixas da Estella).
  Depois do evento as fantasias **continuam no jogo**, e qualquer um pode
  vestir qualquer uma (§5.1);
- **as falas são simples e fofas**, que façam sentido com a cena — os
  rascunhos daqui valem;
- **é um EVENTO: depois, tudo volta ao normal.** O fim é a dupla **deitar e
  dormir na cama do quarto do Ari**, o que só se pode fazer **depois da
  festa**. Aí o parque, o clube e a escola voltam a ser os de sempre (§1);
- **os modelos originais dos personagens e do parque ficam guardados** para
  voltar depois: o evento é uma CAMADA por cima, que nunca mexe no original
  (§8.3);
- **a dupla se arruma tanto na boutique que, quando sai, já é NOITE**, e o
  **ônibus do clube chega** trazendo todos os personagens de lá **e os da
  escola do Gatito** (§2.4);
- **o clube e a escola ficam normais durante o evento, mas sem os
  personagens** — estão todos no parque (§1).

**O que este plano propõe** (tudo provisório até o Renan aprovar):

- **o parque à noite só durante a festa**, com luz PINTADA (abóboras com
  vela, lanternas de papel, varais de luzinha). Nenhuma luz de verdade a
  mais: luz nova recompila o shader da cena inteira, e o parque já é a cena
  mais pesada no celular (§8);
- **15 personagens fantasiados** (o Pelusa, de morceguinho, só dormindo num
  pufe da boutique): os 5 do clube (Gina, Capy, Noel, Josefina,
  Walter), os 4 do parque (Estella, Mano, Cookie, Jean-Luc), os 5 da escola
  (Gatito, Flynn, Luna, Sol, Estrella), o Pelusa e os patinhos do lago (§3);
- **6 lojas e quiosques decorados**: a lojinha da Estella, a loja de
  patins, a sorveteria do Mano, a bilheteria do Cookie, a roda gigante e o
  ponto de ônibus (§4);
- **sete fantasias completas para a dupla**: o vampiro e o morceguinho de
  presente da Estella no começo, e as outras cinco ganhas na caça (§5);
- **10 paradas de doces ou travessuras**, cada uma com uma escolha: pedir
  **doce** (balas certas) ou **travessura** (uma brincadeira, e as balas
  dependem dela) — a pista vem nos dois casos (§6);
- **o final: a Casinha da Abóbora**, um cenário pequeno novo atrás do
  portão da praça da roda, com a festa surpresa de todos os personagens lá
  dentro, destrancado pelas balas da cesta (§7);
- **9 etapas** (da 0 à 8), uma por vez, todas escondidas atrás do
  `?halloween` até a última abrir o evento (§9).

As perguntas que faltam estão no §10.

---

## 1. Como o evento aparece no jogo

**Proposta: pelo calendário de verdade, e depois por lembrança.**

- De **15 de outubro a 2 de novembro** (data do aparelho), o jogo considera
  que é época de Halloween: o sofá de casa ganha a opção **"Assistir um filme
  de terror"**, que é o que começa o evento (§2.1).
- Fora dessa janela o parque é o de sempre. Quem já terminou a festa pode
  **revivê-la** pela Estella ("Reviver a festa de Halloween"), que monta tudo
  de novo — assim o Ari pode voltar quando quiser, e o evento não some.
- Para testar a qualquer hora: `?halloween` na URL liga a época, como o
  `?cena=` já faz para as cenas.

**O save de teste.** Com `?halloween` o jogo usa um save à parte
(`aristory.save.v1.halloween`), que nasce como cópia do save de verdade na
primeira vez: dá para testar o evento com o progresso de sempre, e nada do
que acontece ali (fases, memórias, fantasias) vai para o jogo do link de
sempre. Quando o evento abrir (etapa 8), ele é jogado no save de verdade, e
a limpeza que tira do save de verdade o rastro do teste (`SaveState`,
`limparRastroDoTeste`) sai.

**Enquanto o evento não está pronto, SÓ o `?halloween` liga a festa.** O
calendário (e o filme no sofá) só passa a valer na etapa 8, quando o Renan
aprovar tudo. Até lá, sem o `?halloween`, o jogo é exatamente o de hoje — e
os testes do evento rodam sempre com ele.

Tudo isso mora numa função só, `epocaDeHalloween(g)` (em
`src/eventos/halloween/`), que as cenas consultam. Nenhuma cena lê a data.

**O evento anda por FASES**, guardadas no save — é a fase, e não a hora do
relógio, que diz como o parque está:

| fase | começa quando | o parque |
|---|---|---|
| `antes` | — | o de sempre |
| `convite` | a carta é lida (§2.1) | **no pôr do sol**, enfeitado, **sem os personagens** (estão se arrumando) |
| `festa` | a dupla sai da boutique fantasiada (§2.4) | **de noite**, as luzes acesas, o ônibus do clube chegando, todo mundo fantasiado |
| `depois` | a festa na Casinha acaba (§7) | ainda de noite e enfeitado; a dupla volta para casa |
| `fim` | a dupla **deita e dorme na cama do quarto do Ari** — só existe depois da festa | **o de sempre**: sem enfeite, de dia, cada personagem de volta ao clube, à escola e ao parque, o Pelusa de volta em casa. Ficam as fantasias no guarda-roupa e as memórias |

**O fim do evento é dormir.** Depois da festa (fase `depois`), a cama do
quarto do Ari ganha a opção **"Dormir depois da festa"** — a cena de deitar
junto que já existe (`scripts/cama.mjs`), com a tela escurecendo no estilo
`'sono'` e uma fala de boa noite. Eles acordam de manhã, e o evento acabou:
a fase vira `fim`, e tudo volta ao normal. Antes da festa acabar, a cama é a
de sempre.

**O clube e a escola durante o evento** (da fase `convite` até o fim):
ficam **normais**, mas **sem os personagens** — a Gina, o Capy, o Noel, a
Josefina e o Walter não estão no clube, e o Gatito, o Flynn e as coelhinhas
não estão na escola, porque foram todos para o parque. Os lugares funcionam
(dá para andar, sentar, usar o que não depende de ninguém); o que depende de
um personagem (pedir suco ao Noel, a aula do Gatito, o turno do Walter)
simplesmente não aparece até o evento acabar — no posto de cada um fica uma
plaquinha de recado (§4.1).

**A festa é de NOITE.** Ao entrar no parque durante a festa, o céu vai para o
crepúsculo e depois para a noite com a fila de momentos que a clareira já usa
(`world/noite.ts`: `TARDE_DOURADA`, `POR_DO_SOL`, `CREPUSCULO`, `NOITE`) e o
`g.luzDoCeu`. Hoje "o resto do parque não anoitece" — na festa ele anoitece
inteiro, e volta ao dia quando a dupla vai embora.

---

## 2. A história, cena a cena

### 2.1 O filme de terror e a carta (casa do Ari)

**Quem começa é a dupla.** O sofá da sala, que hoje pergunta "Parece muito
confortável, sentar?", ganha na época uma segunda opção: **🎃 Assistir um
filme de terror**. (`scenes/casa.ts`, a interação `casa:sofa`.)

1. os dois sentam como na cena de sempre (`g.ridePlayer`/`rideCompanion`, a
   câmera no sofá), e a TV liga com o **filme de terror** — desenhado em
   canvas como o show de hoje (`telaDeTvLigada`): uma casinha torta, a lua e
   um fantasminha que é mais fofo do que assustador;
2. **poucas falas**, os dois combinando de comemorar o Halloween juntos
   vendo filme (rascunho abaixo);
3. **alguns segundos de filme** sem fala nenhuma — só a TV e a música;
4. **o som de papel arrastando** e uma **carta de Halloween desliza por
   baixo da porta da rua** — numa tomada de câmera de DENTRO da sala,
   olhando a porta: a carta entra girando e escorrega até uns 3 m da porta.
   Longe assim de propósito: a parede alta da porta esconde o chão logo
   atrás dela na câmera de sempre, e a carta é o caminho principal;
5. os dois se olham; levantam; a carta fica no chão com o prompt
   **"Pegar a carta"** (✉️);
6. ao pegar, a carta **abre na tela** (um painel em canvas: o papel laranja,
   o selo de morceguinho e a letra da Estella) — e fica no diário como a
   memória "O convite da Estella".

> **Rascunho de falas** (o Renan reescreve; o que ele escrever vai literal.
> Cada fala é de UMA pessoa — Ari ou Renan —, não de quem está jogando):
>
> — *(narração)* Luz apagada, pipoca no colo, filme de terror na TV.
> — **Ari:** Feliz Halloween, bebito. Esse ano a gente comemora junto.
> — **Renan:** Junto e embaixo da coberta, que esse filme dá medo.
> *(alguns segundos de filme… e um "shhhk" vindo da porta)*
> — **Ari:** …Você ouviu isso?
> — **Renan:** Veio da porta. Tem uma carta no chão.
>
> **A carta:**
> "Feliz Halloween, queridos! Hoje à noite tem festa no Villa Lobos — e
> ninguém entra sem fantasia. Passem na minha boutique antes: tenho uma
> surpresa costurada só para vocês. — Estella 🐑🕷️"

### 2.2 O parque no pôr do sol: enfeitado, e vazio

Lida a carta, a fase vira `convite`. O parque está **no pôr do sol**, e já
está **todo decorado** (§4) — ainda claro, com as velas das abóboras apagadas e
as lanternas paradas; elas só acendem na festa.

O detalhe da etapa 2 — o kit de enfeites, onde vai cada um, o que fecha e
o que continua, as plaquinhas do clube e da escola e o céu do pôr do sol — está
no **§4.1**.

**Os personagens não estão lá: estão se arrumando.** No lugar de cada um,
uma **plaquinha** no posto dele, com um recado bem do jeito dele, e a dupla
vai **comentando as decorações** no caminho até a Estella. Os recados e os
comentários estão no §4.1.

### 2.3 O presente da Estella (a boutique)

A boutique decorada por dentro (§4). A Estella está de **aranha fofa** (as
oito patinhas de feltro, a tiara de olhinhos e o novelo de lã virando teia —
ela tece, ela costura) e recebe os dois.

**O Pelusa está lá**, de **morceguinho** (as asinhas e as orelhinhas de
morcego), **dormindo enroladinho num dos pufes capitonê** da boutique
(`world/moveisDaBoutique.ts`). Não tem interação nenhuma: ele só fica ali,
respirando devagar. Durante o evento ele não está em casa.

**A Estella faz o PERSONAGEM da aranha** — sem deixar de ser ela: orgulhosa
das roupinhas, carinhosa, dando docinho. Ela exagera o "vilã de mentirinha"
e depois ri dela mesma. Cutscene:

1. ela conta que passou a semana costurando e tira de trás do balcão
   **duas caixas** com laço, uma com o nome de cada um;
2. as caixas abrem, e cada fantasia aparece completa no manequim ao lado
   do balcão — o **vampiro** na caixa do **Ari**, e o **morceguinho** na do
   **Renan**;
3. as duas vão para o **guarda-roupa dos dois** (`g.ganharPeca`): cada um
   veste a sua, e depois podem trocar se quiserem;
4. os dois vão para o provador e **saem fantasiados**; a Estella aprova, e
   conta que tem **mais fantasias** espalhadas com os amigos — é só pedir
   doces ou travessuras (§5.2);
5. ela dá a **cestinha de abóbora** (o balde dos doces) e o **mapinha** com a
   primeira pista.

> **Rascunho de falas da Estella, no personagem da aranha** (o Renan
> reescreve; o que ele escrever vai literal):
>
> *(a dupla entra)*
> "Ora, ora… quem caiu na minha teia?" *(pausa)* "Brincadeira! Entrem,
> entrem, que a aranha aqui só morde biscoitinho."
> "Bem-vindos à minha teia… quer dizer, à minha boutique!"
>
> *(as caixas)*
> "Oito patinhas, e todas costurando a semana inteira só pra vocês."
> "Eu teço as minhas teias com fio de lã… e as minhas fantasias com fio de
> amor. Hihi."
> "Nenhuma fantasia sai daqui sem a minha aprovação… e estas eu APROVO!"
>
> *(saindo do provador)*
> "Muahaha! Ficaram perfeitos! Tão perfeitos que dá vontade de enrolar
> vocês num casulo e guardar na vitrine." *(pausa)* "…de mentirinha, tá?"
>
> *(a cesta e o mapinha)*
> "Tomem: uma cestinha de abóbora pra encher de balas. Quanto mais cheia,
> mais perto da surpresa…"
> "E essas fantasias não são as únicas: os meus amigos estão guardando as
> outras. É só pedir doces ou travessuras!"
> "Agora vão, que a noite é das aranhas… e dos amigos delas!"

### 2.4 Já é noite: o ônibus do clube chega

**A dupla demorou tanto se arrumando que, quando sai da boutique, já é
noite.** A fase vira `festa`:

1. a porta da boutique abre para o parque **à noite** — o céu escuro, as
   abóboras acesas, as lanternas e os varais de luzinha ligados (§4);
2. uma fala dos dois sobre o tempo que passou (rascunho):
   — **Renan:** "Já anoiteceu?! A gente ficou quanto tempo lá dentro?"
   — **Ari:** "O suficiente pra ficar lindo."
3. a buzina do **ônibus do clube**, que para no ponto do parque e desce a
   turma toda **fantasiada** (§3): a Gina (abaixando a cabeça para caber na
   porta), o Capy, o Noel, a Josefina e o Walter — e, do mesmo ônibus, o
   Gatito, o Flynn e as três coelhinhas da escola. Cada um acena e vai para
   o seu lugar da festa;
4. o Mano, o Cookie e o Jean-Luc já estão nos postos deles, fantasiados;
5. a câmera volta para a dupla, e a caça começa (§6).

O ônibus é o mesmo do ponto de hoje (`scripts/onibus.mjs`): a cena dele
chegando já existe.

### 2.5 Doces ou travessuras (§6)

Nove paradas, na ordem do mapa do parque, cada uma com uma pista para a
próxima.

### 2.6 O final (§7)

A última pista abre o portão escondido da praça da roda e leva à surpresa.

---

## 3. Os convidados e as fantasias deles

A regra: **fantasia que conversa com quem o personagem é** — o nome, o
bicho, o trabalho, a história que o Renan já contou. E fofa, nunca
assustadora de verdade: o "susto" do Halloween daqui é sempre de mentirinha.

| quem | onde fica na festa | fantasia (proposta) | por quê |
|---|---|---|---|
| **Estella** (ovelha) | a lojinha | **aranha tecelã**: 8 patinhas de feltro com costura aparente, tiara de olhinhos, o novelo virando teia | ela tece e costura; fez a fantasia de todo mundo |
| **Mano** (pinguim) | a sorveteria | **vampirinho**: capa de gola alta, presinhas, gel no topete | o pinguim já é de "smoking" — o Drácula mais natural do parque |
| **Cookie** (elefante) | a bilheteria | **fantasma de lençol gigante**, com dois furinhos e um laço na tromba | "assusta as pessoas só pelo tamanho" — agora de propósito |
| **Jean-Luc** (pato) | o lago | **o Fantasma da Ópera**: meia-máscara branca e capa — ele é francês, e a ópera é de Paris | — |
| **Capy** (capivara) | a beira do lago | **abóbora**: macacão redondo laranja, cabinho na cabeça, o apito de sempre | a capivara já é redonda; ele continua salva-vidas |
| **Gina** (girafa) | o ponto de ônibus | **bruxa**: chapéu pontudo (a bruxa mais alta do mundo) e vassoura | ela vê tudo de cima — é ela quem dá a pista do final |
| **Noel** (peru) | um carrinho de "poções" | **espantalho**: chapéu de palha, remendos, palha saindo das mangas | um peru vestido do que espanta passarinho — ele acha hilário |
| **Josefina** (tartaruga) | um canteiro de abóboras | **fantasminha de lençol** por cima do casco | "o fantasma mais devagar do mundo" — e ela adora contar história |
| **Walter** (cão garçom) | o final | **múmia garçom**: ataduras, a gravatinha por cima, a bandeja de doces | — |
| **Gatito** (gato) | o piquenique | **mago**: chapéu de estrelas e varinha — o professor | — |
| **Flynn** (raposa) | o campinho de frisbee | **lobisomem** com a bandana dos Gatitos | o atleta, uivando de animação |
| **Luna, Sol, Estrella** | o piquenique | **trio**: gatinha preta, abóbora e fantasminha (uma cada, mesmo time) | — |
| **Pelusa** (gato) | a boutique, **dormindo num pufe** (sem interação) | **morceguinho**: asinhas e orelhinhas de morcego | decisão do Renan |
| **patinhos do lago** | o lago | **chapeuzinho de bruxa** na mãe e nos filhotes | — |

Técnica (§8.2): cada fantasia de bicho é uma peça pendurada nos pontos do
corpo que a classe já tem (a cabeça, o tronco, as patas), ligada por
`fantasia: 'halloween'` — a classe não muda de cérebro.

**Quem vem do clube chega de ônibus** — e a turma da escola vem junto, no
mesmo ônibus — na cutscene de quando a dupla sai da boutique (§2.4).

---

## 4. O parque enfeitado

O capricho das peças é o da sorveteria do Mano e da lojinha da Estella:
nada de caixa lisa. Tudo o que se repete vai em lote (`InstancedMesh`), e o
que é fixo passa por `fundir()`.

**Pelo parque inteiro**

- **abóboras esculpidas** (jack-o'-lanterns) de três tamanhos e quatro caras
  (sorriso, susto, piscando, dentinho), torneadas em gomos, com o cabinho e a
  folhinha, e a vela dentro **acesa e tremendo** (luz pintada: a poça de luz
  no chão e o brilho nos furos, num shader de chama do `core/shaders.ts`);
- **lanternas de papel** laranja e roxas nos varais entre os postes do
  caminho principal, balançando de leve;
- **fantasminhas de pano** pendurados nos galhos, balançando com o vento;
- **morceguinhos** voando em bando em volta da roda gigante (lote, asas
  batendo no shader);
- **teias** nos cantos das lojas e entre os bancos, com uma aranhinha de
  feltro;
- **névoa baixa** rolando sobre o lago e a grama (planos com textura de canvas
  e um shader de deslizar; medir no celular);
- **caldeirão** borbulhando no carrinho do Noel, com a fumacinha verde;
- **a trilha de abóboras**: pequenas abóboras acesas marcando o caminho da
  caça, uma a uma.

**As lojas e quiosques**

| lugar | decoração |
|---|---|
| lojinha da Estella | guirlanda de folhas secas e abóboras na porta, teia de lã na vitrine, manequim de vitrine fantasiado, bandeirolas de morcego |
| loja de patins | patins pendurados com fitas laranja e roxas, abóbora no balcão, placa "Patins assombrados" |
| sorveteria do Mano | telhado de chocolate com "gotas" de calda laranja, sorvete de abóbora e de "poção" na vitrine, morceguinhos no lambrequim |
| bilheteria do Cookie | lençol de fantasma no toldo, bilhetes laranja, a abóbora maior do parque ao lado |
| roda gigante | as cabines com lanternas de abóbora, luzinhas laranja nos raios |
| ponto de ônibus | placa "Ponto Assombrado", chapéu de bruxa no topo do poste |

### 4.1 A etapa 2 em detalhe: o parque no pôr do sol (fechada com o Renan)

> As respostas do Renan já estão aqui dentro. Falta construir (§9).

**O que a etapa 2 entrega.** Lida a carta (fase `convite`), a dupla sai de
casa pelo portão de sempre e encontra o parque **no pôr do sol, enfeitado e
vazio** (decisão do Renan: o pôr do sol faz mais sentido com o tempo do
evento — a carta chega à tarde, e quando eles saem da boutique já é noite).
Ela anda até a boutique comentando o que vê. A etapa termina na porta da
Estella — o que tem lá dentro é a etapa 3. Até lá, a porta abre a boutique
de sempre (só quem testa com `?halloween` vê).

O que entra **agora** é o enfeite **ainda apagado**: as abóboras com a vela
sem acender, as lanternas paradas. As mesmas peças acendem na etapa 4 (a
noite) e **as lanternas de abóbora iluminam o parque** (pedido do Renan) —
com luz PINTADA (a poça no chão e o brilho nos furos), nunca luz de verdade.
Então elas já nascem com a parte que acende numa malha própria (a cara da
abóbora, o papel da lanterna), para a noite só trocar o material dela.

> **Construída** (escondida atrás do `?halloween`). O que mudou na
> construção, em relação ao plano abaixo: o arco de balões fica À FRENTE de
> quem chega (`z ≈ 22,6`), e não no vão da cerca — atrás, o alto do arco
> caía na frente da cabeça dos dois; a abóbora da roda vai pendurada na
> FRENTE de cada gôndola (embaixo, a de baixo não cabia); o sol do pôr do
> sol vem do lado da câmera (o de verdade, do oeste, deixava o parque
> inteiro de frente na sombra); e o recado do quadro de inscrições fica
> pregado na frente dos papéis. Medido (desenhos por quadro, sem -> com
> enfeite): portão 477 -> 542, alameda 405 -> 452, praça da roda
> 832 -> 884, sorveteria 570 -> 624, boutique 548 -> 592, lago 752 -> 805.

> **O segundo ajuste do Renan** (depois de ver o parque): "alguns lugares
> ainda não passam a vibe Halloween, como a pista de gelo e a barraca de
> sorvete do Mano". Entrou:
>
> - **as cores do Halloween nos lugares** — roxo e laranja no lugar do rosa,
>   do coral e do vermelho: a sorveteria laranja e roxa com a neve do
>   telhado virando calda de abóbora, os guarda-sóis listrados de roxo e
>   laranja e as cadeirinhas roxas, a loja de patins roxa com o toldo laranja
>   (e o amarelo virando verde de poção), o vermelho da roda e da bilheteria
>   virando roxo, o toldo da boutique roxo, o gelo da praça, os cristais e a
>   borda de neve em lilás ("gelo de uva"), e a luz dos postes laranja de
>   vela. É uma REPINTURA por cima da peça pronta (`world/halloween/repintar.ts`):
>   a fábrica de cada lugar não muda;
> - **onze infláveis gigantes** (`world/halloween/inflaveis.ts`), cinco
>   bonecos — o fantasma de braços para cima, o gato preto sentado, a abóbora
>   de chapéu de bruxa, a aranha roxa de pernas de salsicha e o morcego de
>   asas abertas — balançando devagar no vento, com o ventilador e as cordas.
>   Primeiro vieram três (a pista de patins e a praça de gelo); no segundo
>   ajuste o Renan pediu "pelo menos 1 ou 2 por área", e ficou um ou dois em
>   cada canto: a chegada (morcego e aranha ladeando o portão), a roda
>   (fantasma e abóbora), o campinho de frisbee (morcego), a boutique (gato),
>   atrás da arena (aranha) e o caminho do ponto (fantasma). Sempre em
>   gramado livre, fora das árvores e longe da diagonal da câmera do vizinho;
> - **abóboras grandes** (de 0,4 a 0,7 de raio) nos cantos da praça de gelo
>   e em volta da pista;
> - **o lago roxo** — gelatina de uva — e, no lugar do "Olhar o lago", a
>   conversa da gelatina ("Olhar o lago roxo"): os dois acham que o lago
>   virou gelatina, o Renan prova com o dedo e — pedido dele — diz que acha
>   que é **suco de uva** ("Acho que é suco de uva!"); o Ari promete trazer
>   o canudo. Vira a memória "O lago de gelatina".

#### O kit do Halloween (`world/halloween/*.ts`)

Peça nova, com o capricho da sorveteria do Mano e da boutique: nada de caixa
lisa. Tudo que se repete vai em lote; o que é fixo passa por `fundir()`.

| peça | como ela é | a técnica |
|---|---|---|
| **abóbora esculpida** | três tamanhos e quatro caras (sorriso, susto, piscando, dentinho); gomos torneados, o cabinho torcido, a gavinha em espiral e a folhinha; a cara é um recorte fundo, escuro antes da noite. **De noite ela ilumina o chão em volta** (etapa 4) | torneado com os gomos na conta do raio, gavinha em tubo; um lote por tamanho, e a cara num lote à parte (é ela que acende) |
| **fardo de feno** | o fardo de quina arredondada, os dois barbantes e fiapos soltos, com as abóboras empilhadas em cima | palha em textura de canvas, fiapos em lote |
| **espantalho de boas-vindas** | de saco, a cara costurada sorrindo, chapéu de palha, camisa xadrez com remendo, segurando a placa "Feliz Halloween!" | canvas no xadrez e na placa; fundido |
| **arco de balões** | balões laranja, roxos e creme em arco por cima da boca do caminho, cada um com o nózinho e o brilho, e um balão de fantasminha no topo | um lote, cor por cópia |
| **varal de bandeirolas** | morceguinho, abóbora e fantasma recortados, num cordão que faz a curva da corda e balança no vento | recorte em `Shape`, o vento do `core/shaders.ts` (o mesmo do capim); um lote por desenho |
| **lanterna de papel** | sanfonada, laranja e roxa, com o aro e a alça; pendurada nos postes | torneado com as pregas; um lote |
| **fantasminha de pano** | o pano caindo com a bainha ondulada e dois olhinhos, pendurado nos galhos, balançando | malha própria do pano + o vento; um lote |
| **teia de lã + aranhinha** | os raios e a espiral de lã nos cantos das lojas, entre os bancos e **nas árvores** (pedido do Renan), com uma aranhinha de pompom de olhinhos | tubo fino fundido por teia; as aranhinhas em lote |
| **morceguinho de papel** | recortado, pendurado no fio — nos raios da roda, no lambrequim da sorveteria e **nos galhos das árvores** (pedido do Renan); de noite os da roda voam (etapa 4) | `Shape` extrudado fino; um lote |
| **lápide fofa** | simples e bonitinha (pedido do Renan): de isopor, de topo redondo, com musgo de feltro, uma florzinha e uma frase de brincadeira ("Aqui jaz o medo", "R.I.P. dieta") — **espalhadas pelo parque inteiro**, de duas em duas ou de três em três | canvas compartilhado; um lote |
| **o monstrinho do lago** | **um Nessie de plástico** (pedido do Renan), de boia inflável: o pescoço comprido em gomos, as corcovas saindo da água, a carinha sorridente, as costuras do plástico e o brilho do vinil; **passeia pelo lago devagar** e, de noite, **ilumina o lago** (a barriga acesa e uma poça de luz na água em volta dele) | torneado e tubo, canvas nas costuras; anda pela conta da margem do lago (`agua.naBeira`), sem atravessar o trapiche nem a ilha do tronco; a luz é pintada |
| **caldeirão** | torneado, os pezinhos e a alça; antes da festa vazio, na festa cheio de doces | fundido |
| **guirlanda de porta** | o anel de folhas secas, as mini abóboras e o laço | folhas em lote; fundida |
| **chapéu de bruxa** | o cone torto com a dobra, a aba, a fita e a fivela — no poste do ponto de ônibus e no boneco de neve da praça de gelo | fundido |
| **lençol de fantasma** | o pano por cima do toldo da bilheteria, com os dois furinhos | malha própria do pano |
| **plaquinha de recado** | a tabuinha de moldura pendurada no barbante (ou num cavalete), com o recado na letra de cada um e o desenho do bicho do lado da assinatura | o texto em canvas (as letras do Bebito book, Caveat e Kalam, já são carregadas) |
| **folhas secas** | folhas laranja e marrons espalhadas na beira dos caminhos | o `folhasSecas` da clareira, em lote |

As cores entram na seção "Halloween" da paleta (laranja-abóbora,
roxo-noite, creme-fantasma, palha, verde-poção, o verde do Nessie).

#### Onde vai cada coisa — o parque inteiro

**Capricho no parque inteiro** (decisão do Renan), e não só no caminho. A
dupla chega pelo **portão** (`0; 26`), desce a **alameda** até a **praça da
roda** (`0; −16,5`) e vira à direita até a **boutique** (`−34; −16,5`) — esse
é o caminho dos comentários, mas o enfeite vai a todo canto do parque:

| lugar | o enfeite |
|---|---|
| **o portão** | o arco de balões na boca do caminho, dois fardos de feno com abóboras empilhadas, um de cada lado, e o espantalho de boas-vindas com a placa |
| **a alameda** | o varal de bandeirolas de poste a poste, uma lanterna de papel em cada poste, uma abóbora no pé de cada um (as caras alternando), fantasminhas nos galhos |
| **as árvores do parque todo** | teias de lã e morceguinhos pendurados nos galhos, alternando com os fantasminhas, para nenhuma árvore ficar igual à vizinha |
| **o caminho transversal e a beira do lago** | lanternas de papel nos postes, abóboras nos pés, folhas secas na beira |
| **a sorveteria e a praça de gelo** | o pano de "fechado" por cima da vitrine e a plaquinha do Mano; morceguinhos de papel no lambrequim; gotas de calda laranja escorrendo no telhado de chocolate; uma abóbora em cada mesinha; o **chapéu de bruxa no boneco de neve** |
| **a loja de patins e a pista** | os patins pendurados com fitas laranja e roxas, a abóbora no balcão, a placa "Patins assombrados"; abóboras e um fardo na volta da pista |
| **a arena e o piquenique** | uma teia no suporte de raquetes, abóbora no placar e na mesa de piquenique; a plaquinha no quadro de inscrições |
| **o campinho de frisbee** | um fantasminha em cada cesta de disco, abóboras na arquibancada |
| **o lago** | **o Nessie de plástico passeando**, duas abóboras na ponta do trapiche e uma teia no taboal; os bichos do lago ficam como sempre |
| **a praça da roda** | uma lanterna de abóbora embaixo de cada cabine e morceguinhos nos raios (girando junto com a roda); o lençol de fantasma e a abóbora gigante na bilheteria, com a plaquinha do Cookie; o caldeirão vazio no meio da praça |
| **o gramado** | **lápides fofas** espalhadas pelo parque, de duas e três, em cantos de grama sem caminho |
| **a calçada da boutique** | a guirlanda na porta, a teia de lã na vitrine, bandeirolas de morcego no toldo, abóboras nos vasos da calçada; na mesinha de xadrez, a plaquinha da Estella e uma aranhinha de feltro em cima do tabuleiro |
| **o piquenique das coelhinhas** | a plaquinha delas e os pompons laranja e pretos esquecidos na toalha |
| **o ponto de ônibus** | a placa "Ponto Assombrado" e o chapéu de bruxa no topo do poste |
| **a clareira** | **nada**: é o cantinho dos dois, fica como é |

Cuidado de câmera (já mordeu na etapa 1): nesta câmera, cada metro de altura
esconde ~1,5 m de chão atrás. O arco de balões e as lanternas ficam **fora
da linha** onde a dupla anda, e cada lugar ganha uma foto de longe na vista
de sempre antes de ser dado como pronto.

#### Quem não está, e o que isso fecha

**Personagem ausente é personagem não montado** (§8.3): na fase `convite`,
cada um ganha uma linha de guarda na cena dele, e no posto aparece a
plaquinha. **Na caminhada até a boutique nada do que depende de alguém
funciona** (decisão do Renan) — e o que é da dupla continua.

Os recados são **bem dentro da personalidade de cada um** (pedido do Renan),
cada um na própria letra:

| no parque | o recado | o que fecha |
|---|---|---|
| Mano, na sorveteria | "FECHADO. Fui fazer minha fantasia. Ela é SURPRESA. Volto à noite com sorvete! — Mano 🐧 / P.S.: o de abóbora não derreteu. Eu acho." | a sorveteria e a mesinha servida |
| Cookie, na bilheteria | "Bilheteria fechada. Desculpa. Fui me arrumar devagarinho, pra não fazer barulho. A roda tá girando sozinha. — Cookie 🐘" | o bilhete e o passeio na roda |
| Estella, na mesinha de xadrez | "Estou na boutique, terminando a última bainha. Ninguém mexe no tabuleiro: a aranhinha está de guarda. — Estella 🐑" | o xadrez |
| Luna, Sol e Estrella, no piquenique | uma plaquinha só, com três letras: "Fomos nos arrumar!!! É surpresa (mas é LINDA). — Luna" / "¡Volvemos de noche, panas! — Sol" / "Deixamos a toalha. Não fiquem no sol forte. — Estrella" | a conversa e o treino delas |
| os desafiantes, no quadro da arena | "Desafios suspensos: os desafiantes foram se fantasiar!" | as partidas contra eles |
| Jean-Luc, no lago | — (ele simplesmente não aparece) | o duelo |

| no clube e na escola | o recado | o que fecha |
|---|---|---|
| Gina, na portaria | "Portão aberto hoje, viu? SÓ hoje. Fui me arrumar: minha fantasia vai ser a mais alta da festa. — Gina 🦒" | a conversa dela (o portão abre) |
| Capy, na cadeira do salva-vidas | "Salva-vidas de folga. Água é comigo, mas hoje não: nada de pular sem mim! — Capy" | a conversa dele (a piscina funciona) |
| Noel, no bar de sucos | "FECHADO! Fui correndo me arrumar. CORRENDO! Amanhã tem suco. — Noel 🦃" | os sucos e a troca do adubo |
| Walter, no Mania | "Au! Au! 🐾" e, embaixo, noutra letra: "(o garçom foi pra festa — cozinha fechada)" | pedir na mesa e o turno |
| Josefina, na estufa | "Fui me arrumar com calma, que fantasia boa leva tempo. Reguei tudo antes de sair. — Josefina 🐢" | a rodada do jardim e a lojinha da estufa |
| Gatito, na Sala 1 | "Turma: hoje não tem aula! Lição de casa: se divertir na festa. — Prof. Gatito 🐱" | a aula e a apostila |
| Flynn, no ginásio | "Treino cancelado: hoje o time inteiro vai pra festa! Bebam água e caprichem na fantasia. Vão, Gatitos! — Flynn 🦊" | o treino e a conversa |

Continua tudo o que é da dupla: andar, sentar, os bancos, de mãos dadas, o
frisbee, o lago (patos, garça, tigres-d'água, pedrinha, trapiche, moedinha),
a loja de patins e a patinação no gelo, a mochila, o guarda-roupa e o
vestiário, a piscina, a máquina de lanches, o ônibus. As plaquinhas somem na
fase `festa` (os personagens chegam) e o fechamento inteiro acaba na fase
`fim`.

**O Pelusa** (decisão do Renan): some da casa quando a carta é lida e
aparece na boutique (etapa 3) dormindo no pufe, **sem interação nenhuma**.

**A clareira** (decisão do Renan): continua aberta, mas sem o "Passar a
noite aqui" durante o evento — a noite do evento é a que cai enquanto eles
se arrumam na boutique.

#### Os comentários no caminho

Valem os rascunhos (decisão do Renan). Cada um **uma vez por save**
(`halloween:viu:<lugar>`), quando o jogador passa a menos de ~4 m do ponto e
não há outra conversa aberta. Quem fala é sempre a mesma pessoa (o Ari ou o
Renan, não o "jogador"). O primeiro, no portão, também diz para onde ir:

| onde | quem | a fala |
|---|---|---|
| o portão | Renan | "Olha isso! Tem abóbora no portão inteiro." |
| o portão | Ari | "Alguém passou o dia enfeitando. A Estella disse pra gente ir na boutique." |
| a alameda | Ari | "Tem fantasminha pendurado nas árvores!" |
| a sorveteria | Ari | "O Mano fechou a sorveteria? Isso nunca acontece." |
| a sorveteria | Renan | "Diz que tá se arrumando. Imagina a fantasia dele." |
| a praça de gelo | Renan | "Até o boneco de neve tá de bruxa." |
| a roda gigante | Renan | "As cabines viraram abóbora." |
| a bilheteria | Ari | "Até o Cookie sumiu… e ele nem cabe em lugar nenhum pra se esconder." |
| o lago | Renan | "Nem o Jean-Luc tá aqui. O parque tá vazio só pra gente." |
| o lago (vendo o Nessie) | Ari | "Bebito… tem um monstro do lago Ness ali. De plástico. Mas tem." |
| uma lápide | Ari | "'Aqui jaz o medo.' Que cemitério mais fofo." |
| a calçada da boutique | Ari | "A lojinha da Estella tá toda de teia!" |
| a calçada da boutique | Renan | "Então é aqui. Vamos?" |

#### A luz do pôr do sol

Decisão do Renan: a caminhada é **no pôr do sol**. Ao entrar no parque na
fase `convite`, o céu é o `POR_DO_SOL` (ou o `TARDE_DOURADA`, o que ficar
mais bonito na foto) da fila de momentos da clareira (`world/noite.ts`),
por `g.luzDoCeu` — o mesmo céu laranja que a clareira já usa, sem luz nova.
Folhas secas na beira dos caminhos completam a cara de outono. Na etapa 3, a
dupla sai da boutique e a fila anda até a `NOITE`.

#### A camada e o desempenho

- uma chamada só no `villaLobos.ts` (`montarHalloweenNoParque(w, pecas)`,
  como a da casa), e uma linha de guarda em cada personagem ausente (parque,
  clube e escola). Sem `?halloween`, nada disso monta;
- **medir antes e depois** (`renderer.info.render`) na vista do portão, da
  praça da roda, do lago e da boutique, no computador e no celular, e anotar
  no commit. Um lote por tipo de peça: com o parque inteiro enfeitado, o
  esperado é algumas dezenas de desenhos a mais, e não centenas;
- os testes: `scripts/halloween.mjs SO=parque` (cada enfeite no lugar, as
  plaquinhas, quem não está, o que fecha e o que continua, o Nessie
  passeando sem sair da água, os comentários uma vez só, o céu do pôr do sol,
  fotos de cada lugar) e o `SO=volta` (sem `?halloween`, o parque, o clube e
  a escola com os mesmos objetos e desenhos de antes); o `zfighting.mjs` com
  `SO=` em cada peça nova.

#### A ordem de construir (dentro da etapa 2)

1. o kit de peças, uma a uma, com foto de perto de cada;
2. o parque enfeitado (inteiro) e as medidas;
3. o Nessie passeando no lago;
4. quem não está e as plaquinhas (parque, clube, escola), e o Pelusa saindo
   de casa;
5. os comentários e o céu do pôr do sol;
6. os testes, as fotos no computador e no celular, e o Renan olha.

---

## 5. As fantasias da dupla

### 5.1 As sete fantasias

**Decisão do Renan: são sete fantasias, completas** — todas as partes e os
acessórios —, e **vão sendo ganhas**: a Estella dá o **vampiro** e o
**morceguinho** no começo (§2.3), e as **outras cinco** vêm da caça (§5.2).
Toda fantasia ganha vai para o guarda-roupa **dos dois**: qualquer um pode
vestir qualquer uma, e dá para combinar como quiser.

**As peças de cada fantasia** (proposta; uma por vaga do corpo — a vaga de
acessório é uma só, então cada fantasia tem um acessório):

| fantasia | cabeça | tronco | pernas | pés | mãos | acessório |
|---|---|---|---|---|---|---|
| 🧛 **vampiro** | as presinhas e o topete penteado para trás | o colete vinho com a camisa de babado e a gola alta | a calça social preta | o sapato de verniz com fivela | as luvas brancas | a **capa** preta de forro vermelho e gola em pé |
| 🦇 **morceguinho** | a tiara de orelhas de morcego | o moletom de morcego com a barriguinha clara | a calça listrada preta e roxa | as pantufas de morcego | as luvinhas com unhinha | as **asinhas** de morcego nas costas |
| 🧙 **bruxinho** | o chapéu pontudo com fivela, torto na ponta, com estrelinha | a túnica roxa de mangas largas | a meia listrada | a botinha de bico curvo | a **vassoura** na mão esquerda | a **capa de estrelinhas** |
| 🐈‍⬛ **gato preto** | as orelhinhas de gato | o moletom preto com o babador branco | a legging preta | as patinhas (pantufas) | as luvas de patinha com almofadinha rosa | o **rabo** de gato com laço |
| 🎃 **abóbora** | o chapeuzinho de cabinho com folha e gavinha | o macacão redondo de gomos com a cara de abóbora | a meia-calça verde | a botinha verde | as luvinhas verdes | a **gola de folhas** |
| 🌾 **espantalho** | o chapéu de palha amassado com o corvinho | a camisa xadrez de remendos com palha saindo das mangas | a calça de remendo com a corda de cinto | as botas gastas | as luvas com palha | a **bandana** no pescoço |
| 🏴‍☠️ **pirata** *(pedido do Renan)* | o chapéu tricórnio com a caveirinha sorridente bordada e a pena | a camisa listrada branca e vermelha, o colete curto azul-marinho e a faixa na cintura | a calça bufante até o joelho | as botas de cano dobrado com fivela | a **espadinha de madeira** na mão esquerda, com a luva de punho largo | o **papagaio** no ombro |

Cada peça segue a skill de roupa (geometria em `world/fantasias.ts`, ficha
em `ITENS`). São **presente da Estella**: pela regra do Renan, presente de
personagem **não se pinta no ateliê** (`PECAS_SEM_TINTA`). Entram no
guarda-roupa normal, por parte do corpo — proposta: com um filtro novo
**🎃 Fantasias** nas abas de cima, para achar as fantasias rápido.

### 5.2 As fantasias ganhas na caça

**Decisão do Renan: uma fantasia INTEIRA a cada duas paradas.** São cinco
para ganhar, então a caça tem **dez paradas** (§6) — o Flynn virou parada —,
e as paradas 2, 4, 6, 8 e 10 dão uma fantasia completa cada. Proposta de
quem dá qual, casando com a fantasia de quem entrega (§3):

| parada | quem entrega | a fantasia | por quê |
|---|---|---|---|
| 2 | o Cookie | 🎃 **abóbora** | ele fica ao lado da maior abóbora do parque |
| 4 | o Jean-Luc | 🏴‍☠️ **pirata** | um pirata de lago, para quem mora na água |
| 6 | as coelhinhas | 🐈‍⬛ **gato preto** | uma delas está de gatinha preta |
| 8 | o Noel | 🌾 **espantalho** | ele também está de espantalho |
| 10 | a Gina | 🧙 **bruxinho** | ela está de bruxa |

Doce ou travessura, a fantasia vem do mesmo jeito: as duas escolhas são
boas. O que muda entre elas são as **balas** (§5.3).

E o **prêmio do final** (§7): uma peça especial (proposta: a **coroa de
abóbora** do "rei e rainha da festa", ou o que combinar com o final escolhido).

### 5.3 As balas na cesta de abóbora

**Decisão do Renan: a cesta junta balas, e a Casinha da Abóbora só abre com
uma certa quantidade.** Proposta dos números (o Renan ajusta):

- **🍬 Doces!** — o personagem dá **3 balas**, sempre;
- **🎃 Travessura!** — ele apronta a brincadeira dele, e as balas dependem
  de como foi: **de 1 a 5** (ganhou o ponto de ping pong do Jean-Luc,
  pescou a maçã do Capy de primeira, acertou a palavra do Gatito…). Arriscar
  pode render mais que o doce — ou menos;
- **🎃 abóboras escondidas**: dez abóborinhas brilhando pelo parque, fora do
  caminho da caça, com **1 bala** cada — é o que garante que ninguém fica
  preso na porta;
- **a porta da Casinha abre com 25 balas.** Com as dez paradas no doce dá
  30; chegando lá com menos, a porta conta quantas faltam e a Gina lembra
  das abóboras escondidas.

A cesta aparece na mão de quem joga, **enchendo de verdade** — as balas
coloridas subindo dentro dela —, e o número fica num canto da tela durante a
festa (🍬 18/25). Cada personagem dá a **sua** bala (o pirulito de olho do
Jean-Luc, a bala de abóbora do Mano, o docinho minúsculo do Cookie…), e elas
aparecem desenhadas num painelzinho da cesta.

### 5.4 O capricho das fantasias (pedido do Renan)

As fantasias são o centro do evento e têm que sair **muito bem feitas, fofas
e detalhadas** — o padrão das melhores peças do jogo (a coleção da boutique,
o uniforme dos Gatitos, a roupa de torcida), e não peça de caixa lisa:

- **tecido que parece tecido**: textura de canvas para o veludo da capa, as
  listras da meia, o xadrez do espantalho, o tricô, os gomos da abóbora
  (`threejs-textures`);
- **as costuras e os miúdos**: botões, fivelas, pesponto, remendos com o
  ponto aparente, a palha saindo em fios, a pena do chapéu, a caveirinha
  bordada — os miúdos em lote (`InstancedMesh`) e tudo junto por `fundir()`;
- **pano que cai como pano**: a capa e as asinhas balançando com a
  caminhada (o `saiaViva` e o molde do avental), nunca uma placa rígida;
- **fofo antes de assustador**: proporções gordinhas, cantos redondos, as
  carinhas sorrindo (a caveirinha do pirata, a abóbora, o corvinho);
- **o teste de cada uma**: nos dois, de frente, costas, lado, andando,
  sentados e de perto, e no boneco do guarda-roupa, no computador e no
  celular (`scripts/fantasias.mjs`).

---

## 6. Doces ou travessuras — as dez paradas

Em cada parada, o personagem pergunta e a dupla escolhe:

- **🍬 Doces!** — ele dá a bala dele (**3 balas** na cesta) e a pista;
- **🎃 Travessura!** — ele apronta uma brincadeira fofa, e as balas
  dependem de como foi (**1 a 5**, §5.3); a pista vem do mesmo jeito.

Cada parada lembra o que foi escolhido (o diário mostra "doces: 6 ·
travessuras: 4"). A **pista** é um versinho que aponta o próximo personagem
sem dizer o nome. As paradas **pares** entregam também uma **fantasia
inteira** (§5.2).

| # | quem | onde | a bala | a travessura (e as balas) | 🎁 | pista para a próxima (rascunho) |
|---|---|---|---|---|---|---|
| 1 | Mano | sorveteria | bala de abóbora | espirra granulado de morcego nos dois | — | "Quem vende o bilhete para o céu e nunca coube lá em cima?" (Cookie) |
| 2 | Cookie | bilheteria | o docinho minúsculo (o favorito dele) | levanta o lençol e diz "BU!" — e quem se assusta é ele | 🎃 abóbora | "Logo ali, no campinho, alguém uiva de animação." (Flynn) |
| 3 | Flynn | campinho de frisbee | bala de goma de lua | um passe de frisbee: quanto mais perto pegar, mais balas | — | "Na água vive um francês que joga como ninguém." (Jean-Luc) |
| 4 | Jean-Luc | lago | pirulito de olho | um ponto de ping pong: ganhou, 5 balas; perdeu, 1 | 🏴‍☠️ pirata | "Do lado do lago, alguém de laranja não sai do posto." (Capy) |
| 5 | Capy | beira do lago | maçã do amor | **pescar maçã com a boca** na bacia (minijogo de tempo, curtinho) | — | "Três irmãs fazem festa no piquenique." (coelhinhas) |
| 6 | Luna, Sol, Estrella | piquenique | pipoca de caramelo | a dupla dança com elas (a dança da festa da torcida) | 🐈‍⬛ gato preto | "Quem ensina português de chapéu de estrela?" (Gatito) |
| 7 | Gatito | piquenique | biscoito de gato preto | uma pergunta de português de Halloween ("como se diz *bruja*?") | — | "Um bicho de palha mexe um caldeirão." (Noel) |
| 8 | Noel | carrinho de poções | bala-poção que muda de cor | a poção borbulha e solta uma fumacinha colorida | 🌾 espantalho | "A mais devagar de todas conta histórias no canteiro." (Josefina) |
| 9 | Josefina | canteiro de abóboras | bombom de bolo de abóbora | conta uma "história de fantasma" que termina numa piada | — | "A mais alta vê tudo lá de cima." (Gina) |
| 10 | Gina | ponto de ônibus | bala de goma de aranha | apita como no clube | 🧙 bruxinho | a pista do final: "Atrás da roda, onde a cerca fecha o mato, uma porta laranja só abre para quem trouxe a cesta cheia." |

O **Walter** e o **Pelusa** não são paradas: o Walter está no final (é ele
quem serve as balas na festa), e o Pelusa dorme no pufe da boutique.

**Mapa e diário.** O mapinha da Estella vira um item de mão: abrir mostra as
pistas já recebidas (um pergaminho com os versinhos), e a próxima parada
fica marcada com uma abóbora acesa no caminho. Ninguém fica perdido.

---

## 7. O final — a Casinha da Abóbora

**Decisão do Renan: o final é a A**, e a festa na Casinha **só destranca com
balas suficientes na cesta** (§5.3). As outras três opções ficam abaixo só
como registro.

### ⭐ A. A Casinha da Abóbora (a escolhida)

Atrás da cerca que fecha a praça da roda contra o mato (`villaLobos.ts`, a
cerca de `x = −11`) aparece, só na festa, um **portão laranja** com uma
fechadura em forma de abóbora: ele **só abre com 25 balas** na cesta. Ele leva a
um **cenário novo e pequeno**: uma casinha torta em forma de abóbora, no
meio de uma clareira de abóboras gigantes, com luzinhas.

Lá dentro, três salas curtas, cada uma com um "susto" fofo:

1. **o corredor dos retratos** — quadros que piscam (as memórias do casal
   no quadro do quarto, pintadas de Halloween);
2. **a cozinha da bruxa** — o caldeirão, e o Pelusa saltando de dentro de um
   chapéu de bruxa;
3. **o salão** — escuro… as luzes acendem e **todos os personagens gritam
   "SURPRESA!"**. A festa era para os dois.

A festa: o Walter-múmia servindo os doces, música, todos dançando, e o
**concurso de fantasias** — os convidados "votam" e o casal ganha a **coroa
de rei e rainha da festa** (o prêmio do final). Fecha com a foto de todos
juntos, que vira **memória no quadro** do quarto.

**Por que esta:** é um lugar novo de verdade ("outra parte", como o Renan
pediu), a caça inteira faz sentido (os amigos estavam distraindo a dupla
enquanto arrumavam a surpresa), e o final junta **todos** os personagens no
mesmo lugar. **Custo:** é a etapa mais cara — um cenário novo, pequeno
(do tamanho da lojinha).

### B. A roda gigante à meia-noite (não escolhida)

A última pista leva à roda gigante: as cabines viram abóboras, o Cookie
consegue — enfim — andar nela (numa cabine especial grande, a história dele),
e o casal sobe junto e vê o parque inteiro enfeitado lá de cima, com fogos de
artifício. Os personagens acenam lá embaixo. **Mais barata** (a roda, a
cabine e a primeira pessoa já existem — `scripts/ride.mjs`) e muito
romântica, mas não é um lugar novo.

### C. A fogueira de histórias (não escolhida)

A pista leva a uma roda de troncos com uma fogueira no campinho de frisbee:
todos sentados em volta, a Josefina conta uma história de fantasma fofa,
marshmallows no espeto. Aconchegante e barata. (Não usa a clareira de
propósito: a clareira é o lugar só dos dois.)

### D. O baile à fantasia na praça de gelo (não escolhida)

O rinque vira pista de dança: patinação à fantasia, a dança lenta
(`entities/DancaLenta.ts`) no meio do gelo e o concurso de fantasias.

**Dá para combinar A + B**: a festa surpresa na Casinha da Abóbora, e no fim a
dupla sai para a roda gigante ver os fogos. É o final mais completo — e o
mais longo de construir.

---

## 8. Técnica e desempenho

### 8.1 Onde cada coisa mora

| o quê | onde |
|---|---|
| a época, o estado da festa, as paradas e as pistas | `src/eventos/halloween/` (dados e regras, sem navegador — testável como o `apostila.mjs`) |
| as peças do parque (abóbora, lanterna, fantasminha, teia, caldeirão, morcegos, névoa) | `world/halloween/*.ts` (kit; nada dentro da cena) |
| as fantasias da dupla | `world/fantasias.ts` + fichas em `world/itens.ts` |
| as fantasias dos bichos | `world/fantasiasDosBichos.ts`, penduradas pela classe de cada bicho |
| a Casinha da Abóbora (se for o final) | `scenes/casinhaDaAbobora.ts`, peças em `world/casinhaDaAbobora.ts` |
| as cores | `palette.ts`, seção "Halloween" (laranja-abóbora, roxo-noite, verde-poção, creme-fantasma) |
| a cesta e o mapinha | `world/props.ts` (itens de mão) |
| os testes | `scripts/halloween.mjs` (com `SO=` por parte) e `scripts/fantasias.mjs` |

O `villaLobos.ts` já tem quase 8 mil linhas: a festa entra nele por **uma
chamada só** (`montarFestaDeHalloween(w, g)`), que monta e desmonta tudo.

### 8.2 As regras do jogo que valem aqui

- nada de asset externo: abóbora, lanterna, névoa e os rostos das abóboras
  são geometria e canvas;
- cor da paleta, material de `toon()`;
- **sempre dois em cena**, e falas com `g.companionName()`;
- **fala que o Renan escrever vai literal** — as falas deste documento são
  rascunho;
- fantasia de bicho é peça pendurada no corpo que a classe já monta; o
  cérebro do `Bicho` não muda.

### 8.3 O evento é uma CAMADA: o original fica guardado

Pedido do Renan: depois do evento o parque volta ao normal, e os modelos
originais dos personagens e dos objetos do parque **não podem se perder**.
Por isso o evento nunca edita o original — ele só **acrescenta e esconde
por cima**, e para de fazer isso quando a fase vira `fim`:

- **nenhuma fábrica do jogo de sempre muda**: a sorveteria do Mano, a
  bilheteria, a boutique, a roda gigante e os bichos continuam montados pelas
  mesmas funções de hoje, com o mesmo código. A decoração é **outra peça**,
  posta ao lado ou em cima (`world/halloween/*.ts`), num grupo próprio que a
  cena só monta na fase certa;
- **a fantasia de um bicho é uma peça pendurada** no corpo dele, nunca um
  corpo novo: sem a fase, ela simplesmente não é pendurada, e o bicho é o de
  hoje;
- **personagem ausente é personagem não montado** naquela cena durante a
  fase (o Mano fora da sorveteria antes da festa, a Gina fora do clube) — o
  código dele não muda;
- **as cenas ganham um gancho só**: uma linha que pergunta a fase
  (`faseDoHalloween(g)`) e chama o módulo do evento
  (`src/eventos/halloween/`). Tirar o evento inteiro do jogo é apagar essa
  pasta e essas linhas;
- **o ponto de volta no git**: o commit **`9760601974`** da `main`
  (`976060197456697b094805ba9286ebb75056dcac`) é o jogo exatamente como estava antes de qualquer código do
  evento — qualquer modelo original sai dali com
  `git show 9760601974:caminho/do/arquivo.ts`;
- **o teste da volta** (`scripts/halloween.mjs`, `SO=volta`): sem o
  `?halloween`, e depois na fase `fim`, o parque, o clube e a escola têm
  que ter **os mesmos objetos, os mesmos desenhos por quadro e a mesma foto**
  que tinham antes do evento (a medida de antes fica anotada no próprio
  teste).

### 8.4 Desempenho (a parte delicada)

O parque é a cena mais pesada do jogo e a festa põe mais de uma dúzia de
personagens nele, mais as decorações, à noite. O plano para não travar o
celular **sem perder beleza**:

- tudo o que se repete em **lote** (abóboras, lanternas, morcegos, velas,
  fantasminhas, teias): uma malha por tipo, centenas de cópias;
- tudo o que é fixo em **`fundir()`**;
- **luz pintada**, nunca luz nova: poça de luz no chão, halo nas lanternas,
  brilho nos furos da abóbora;
- os personagens do clube e da escola **saem** das cenas deles durante o
  evento e **entram** no parque só na fase `festa`: em cada cena, só quem
  está lá é montado;
- medir `window.jogo.renderer.info.render` antes e depois de cada etapa, no
  computador e no celular, e anotar no commit.

---

## 9. As etapas

Cada etapa é um pedaço jogável, testado e publicado, para o Renan ver e
aprovar antes da próxima.

| # | etapa | o que entra | skills |
|---|---|---|---|
| **0** | **decisões** | as respostas do §10 | — |
| **1** ✅ | **o filme e a carta** *(construída, escondida)* | a fase do evento no save e o `?halloween`; no sofá, "Assistir um filme de terror", o filme na TV, as falas, a carta deslizando por baixo da porta, "Pegar a carta" e o painel da carta (§2.1) | `cenario`, `prop` + `geometry`, `textures`, `animation` |
| **2** ✅ | **o parque enfeitado, no pôr do sol e vazio** *(construída, escondida)* | as decorações do parque inteiro e das lojas, ainda apagadas (§4.1), o Nessie de plástico no lago, os personagens fora do parque, do clube e da escola, as plaquinhas, os comentários da dupla no caminho (§2.2) | `cenario`, `prop` + `geometry`, `textures`, `lighting` |
| **3** | **o presente da Estella** | a boutique decorada, a Estella de aranha e as falas dela, o Pelusa morceguinho dormindo no pufe, **o vampiro e o morceguinho** (§5.1, com o capricho do §5.4), as duas caixas, o provador, a cesta de abóbora e o mapinha (§2.3) | `roupa`, `bicho`, `prop` + `geometry`, `textures`, `animation` |
| **4** | **a noite e o ônibus** | o parque à noite com as luzes acesas (§4), as fantasias dos personagens (§3), o ônibus do clube chegando com o clube e a escola (§2.4) | `cenario`, `bicho` + `lighting`, `shaders`, `animation` |
| **5** | **doces ou travessuras** | as dez paradas (§6), as balas na cesta e as abóboras escondidas (§5.3), e **as outras cinco fantasias** (§5.2) | `cenario`, `roupa` + `geometry`, `textures`, `interaction`, `animation` |
| **6** | **a Casinha da Abóbora** | o portão das 25 balas, o cenário novo e a festa surpresa (§7) | `cenario`, `prop`, `bicho` + `geometry`, `textures`, `lighting`, `animation` |
| **7** | **o fechamento** | a memória no quadro, o prêmio do final, **dormir na cama do quarto do Ari** encerrando o evento, a **volta ao normal** medida (§8.3), o teste completo no celular | `memoria`, `cenario`, `testar` |
| **8** | **abrir o evento** | ligar o calendário para quem joga (até aqui, só o `?halloween` mostra o evento), e tirar a limpeza do rastro de teste do save de verdade | `testar` |

**Uma por vez, e escondida.** Cada etapa começa com uma conversa com o Renan
sobre os ajustes dela (registrados aqui), depois é construída e testada com
`?halloween`, e só então vem a próxima. Ninguém vê nada no jogo até a etapa 8.

---

## 10. Perguntas para o Renan

### A parte 1 está fechada

Todas respondidas (ver abaixo). Próximo passo: construir a etapa 1.

### A etapa 2 está fechada

Respondidas (§4.1): o kit (gostou, mais teias e morcegos nas árvores,
lápides simples pelo parque, o Nessie de plástico no lago e as lanternas de
abóbora iluminando a noite); capricho no parque inteiro; os recados dentro
da personalidade de cada um; na caminhada nada do que depende de alguém
funciona; a clareira sem o "Passar a noite aqui"; o Pelusa dormindo na
boutique, sem interação; os comentários valem; e a caminhada no pôr do sol.

### Para as próximas partes

1. **As balas** (§5.3): 3 no doce, 1 a 5 na travessura, 10 abóboras
   escondidas, e a porta abrindo com 25 — estão bons?
2. **Quem dá qual fantasia** na caça (§5.2): a divisão proposta está boa?
3. **As fantasias dos personagens** (§3): alguma que você imagina diferente?
4. **Quando aparece**: só de 15/10 a 2/11 pelo calendário, depois "Reviver a
   festa" — ou o ano todo?
5. **As dez paradas** (§6): as travessuras e as pistas estão boas?

**Respondidas:** o prazo (sem pressa, nada aparece até tudo estar pronto);
quem começa o evento (a dupla, no sofá); o convite (a carta por baixo da
porta); o parque antes da festa (no pôr do sol, enfeitado, sem os personagens); as
fantasias da dupla (o vampiro e o morceguinho da Estella, mais cinco ganhas
na caça, uma inteira a cada duas paradas, e a de pirata nova); o capricho
(muito bem feitas, fofas e detalhadas); a Estella (aranha fofa, fazendo o
personagem); o Pelusa (de morceguinho, dormindo num pufe da boutique, sem
interação); a noite (cai enquanto eles se arrumam na boutique); os
convidados (o clube e a escola chegam de ônibus); o clube e a escola durante
o evento (normais, sem os personagens); o final (a Casinha da Abóbora,
destrancada pelas balas); quem veste qual (o Ari de vampiro, o Renan de
morceguinho); as falas (simples, fofas, os rascunhos valem); as peças das
sete fantasias (as do §5.1); o fim do evento (dormir na cama do quarto do
Ari, depois da festa); a volta ao normal (o evento é uma camada, e o
original fica guardado).
