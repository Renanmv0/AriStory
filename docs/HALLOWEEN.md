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
desliza por baixo da porta → o parque **de manhã, já enfeitado e vazio**
(todo mundo "se arrumando"), com os comentários da dupla no caminho → o
presente da Estella na boutique (**as seis fantasias**) → a festa à noite →
**doces ou travessuras** em 9 paradas → a última pista abre o **portão
escondido** atrás da praça da roda → o **final** (§7).

**Estado: só o plano.** Nada construído. A **parte 1** (o filme, o parque
de manhã e o presente da Estella — §2.1 a §2.3) já tem os ajustes do Renan;
faltam as quatro perguntas dela (§10).

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
- **o parque é visto primeiro DE MANHÃ**, já todo enfeitado, e **sem os
  personagens**: estão todos "se arrumando" para a festa. No caminho até a
  Estella, a dupla vai comentando as decorações (§2.2);
- **a Estella dá TODAS as fantasias** — os três pares (vampiro, morceguinho,
  bruxinho, gato preto, abóbora e espantalho), cada uma completa, com os
  acessórios (§5.1);
- **a Estella está de aranha fofa** (§2.3).

**O que este plano propõe** (tudo provisório até o Renan aprovar):

- **o parque à noite só durante a festa**, com luz PINTADA (abóboras com
  vela, lanternas de papel, varais de luzinha). Nenhuma luz de verdade a
  mais: luz nova recompila o shader da cena inteira, e o parque já é a cena
  mais pesada no celular (§8);
- **15 personagens fantasiados**: os 5 do clube (Gina, Capy, Noel, Josefina,
  Walter), os 4 do parque (Estella, Mano, Cookie, Jean-Luc), os 5 da escola
  (Gatito, Flynn, Luna, Sol, Estrella), o Pelusa e os patinhos do lago (§3);
- **6 lojas e quiosques decorados**: a lojinha da Estella, a loja de
  patins, a sorveteria do Mano, a bilheteria do Cookie, a roda gigante e o
  ponto de ônibus (§4);
- **as seis fantasias da dupla**, completas e para os dois, presente da
  Estella no começo (§5);
- **9 paradas de doces ou travessuras**, cada uma com uma escolha: pedir
  **doce** (o personagem dá um doce temático) ou **travessura** (ele apronta
  uma brincadeira fofa) — a pista vem nos dois casos (§6);
- **o final recomendado: a Casinha da Abóbora**, um cenário pequeno novo
  atrás do portão da praça da roda, com a festa surpresa de todos os
  personagens lá dentro (§7, com as outras três opções);
- **9 etapas** (da 0 à 8), uma por vez, todas escondidas atrás do
  `?halloween` até a última abrir o evento (§9).

**A decisão que mais falta** é o **final** (§7). As outras perguntas estão
no §10.

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
| `convite` | a carta é lida (§2.1) | **de manhã**, enfeitado, **sem os personagens** (estão se arrumando) |
| `fantasiados` | a Estella entrega as fantasias (§2.3) | ainda de manhã; a dupla já fantasiada — o que vem daqui até a noite é a próxima parte a planejar |
| `festa` | a festa começa (a planejar) | **de noite**, todo mundo fantasiado |
| `fim` | o final (§7) | — |

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
   baixo da porta da rua** (a peça anda pelo chão até parar dentro da sala);
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

### 2.2 O parque de manhã: enfeitado, e vazio

Lida a carta, a fase vira `convite`. O parque continua **de manhã**, mas já
está **todo decorado** (§4) — de dia, com as velas das abóboras apagadas e
as lanternas paradas; elas só acendem na festa.

**Os personagens não estão lá: estão se arrumando.** No lugar de cada um,
uma **plaquinha** no posto dele, na letra de cada um (proposta):

| onde | a plaquinha |
|---|---|
| sorveteria do Mano | "Volto à noite — me arrumando! 🐧" |
| bilheteria do Cookie | "Fechado pra fantasia. Cookie 🐘" |
| a mesinha do xadrez da Estella | "Estou na boutique! 🐑" |
| o piquenique das coelhinhas | "Fomos nos arrumar! 🐰🐰🐰" |
| o lago | o Jean-Luc não aparece (os patos e a garça ficam: são bichos do lago) |

**Os comentários no caminho.** A dupla vai comentando as decorações. Cada
comentário dispara **uma vez**, quando os dois passam perto daquele ponto
(como o "Olhar o lago" do ponto de ônibus), e é falado por **uma pessoa
certa** (rascunho; o Renan reescreve):

| onde | quem | o comentário |
|---|---|---|
| a entrada do parque | Renan | "Olha isso! Tem abóbora no portão inteiro." |
| a entrada do parque | Ari | "Alguém passou a madrugada enfeitando." |
| as árvores do caminho | Ari | "Tem fantasminha pendurado nas árvores!" |
| a sorveteria (fechada) | Ari | "O Mano fechou a sorveteria? Isso nunca acontece." |
| a sorveteria (fechada) | Renan | "Diz que tá se arrumando. Imagina a fantasia dele." |
| a roda gigante | Renan | "As cabines viraram abóbora." |
| a bilheteria (fechada) | Ari | "Até o Cookie sumiu… e ele nem cabe em lugar nenhum pra se esconder." |
| o lago | Renan | "Nem o Jean-Luc tá aqui. O parque tá vazio só pra gente." |
| a frente da boutique | Ari | "A lojinha da Estella tá toda de teia!" |
| a frente da boutique | Renan | "Então é aqui. Vamos?" |

### 2.3 O presente da Estella (a boutique)

A boutique decorada por dentro (§4). A Estella está de **aranha fofa** (as
oito patinhas de feltro, a tiara de olhinhos e o novelo de lã virando teia —
ela tece, ela costura) e recebe os dois. Cutscene:

1. ela conta que passou a semana costurando e tira de trás do balcão
   **seis caixas** com laço, uma por fantasia;
2. as caixas abrem uma a uma, e cada fantasia aparece completa no manequim
   ao lado do balcão (as seis do §5.1);
3. tudo vai para o **guarda-roupa dos dois** (`g.ganharPeca`) — as seis
   fantasias inteiras para o Ari e as seis para o Renan;
4. **proposta:** ela manda os dois ao provador para escolher qual vestir —
   abre o guarda-roupa já na parte das fantasias, e a cena continua quando
   ele fecha. Saem do provador fantasiados, e a Estella aprova;
5. a fase vira `fantasiados`.

> **Rascunho de falas da Estella** (o Renan reescreve):
> "Nenhuma fantasia sai daqui sem a minha aprovação… e estas eu APROVO!"
> "Seis fantasias. Uma semana inteira. Valeu cada ponto."
> "Agora vão se trocar — e não me apareçam na festa sem fantasia!"

### 2.4 Da manhã até a festa (a planejar)

O que acontece depois do presente — como a manhã vira noite, onde os
personagens reaparecem, quando a cestinha de doces e o mapinha da primeira
pista entram — é a **próxima parte a planejar** com o Renan.

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
| **Pelusa** (gato) | a lojinha, no pufe | **asinhas de morcego** | — |
| **patinhos do lago** | o lago | **chapeuzinho de bruxa** na mãe e nos filhotes | — |

Técnica (§8.2): cada fantasia de bicho é uma peça pendurada nos pontos do
corpo que a classe já tem (a cabeça, o tronco, as patas), ligada por
`fantasia: 'halloween'` — a classe não muda de cérebro.

**Quem vem do clube chega de ônibus** numa cutscene curta ao entrar no
parque pela primeira vez na festa: o ônibus para no ponto e desce a turma
fantasiada (a Gina abaixando a cabeça para caber na porta).

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

---

## 5. As fantasias da dupla

### 5.1 O presente da Estella: as seis fantasias

**Decisão do Renan: a Estella dá TODAS.** São as seis dos três pares,
**cada uma completa** — todas as partes e os acessórios —, e **os dois
ganham as seis** (o guarda-roupa é de cada um): qualquer um pode ser o
vampiro, o morceguinho, o bruxinho, o gato preto, a abóbora ou o
espantalho, e dá para combinar como quiser.

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

Cada peça segue a skill de roupa (geometria em `world/fantasias.ts`, ficha
em `ITENS`). São **presente da Estella**: pela regra do Renan, presente de
personagem **não se pinta no ateliê** (`PECAS_SEM_TINTA`). Entram no
guarda-roupa normal, por parte do corpo — proposta: com um filtro novo
**🎃 Fantasias** nas abas de cima, para achar as seis rápido.

### 5.2 O que se ganha na caça

**A rever quando a caça for planejada:** a ideia antiga era cada parada dar
uma peça do "outro par" — mas agora a Estella já dá os três pares. As
paradas podem dar outra coisa (peças de fantasia novas, enfeites de
Halloween para a estufa, ou só doces).

E o **prêmio do final** (§7): uma peça especial (proposta: a **coroa de
abóbora** do "rei e rainha da festa", ou o que combinar com o final escolhido).

### 5.3 Os doces

A cestinha de abóbora guarda os doces das paradas — nove doces diferentes,
cada um com o seu desenho (o pirulito de olho do Jean-Luc, o sorvete de
abóbora do Mano, o biscoitinho de fantasma da Estella, o docinho minúsculo do
Cookie…). Eles aparecem num painelzinho da cesta e dá para **comer**
(sentados num banco, como o lanche da máquina da escola). Juntar os nove
desbloqueia uma fala especial no final.

---

## 6. Doces ou travessuras — as nove paradas

Em cada parada, o personagem pergunta e a dupla escolhe:

- **🍬 Doces!** — ele dá o doce temático (vai para a cestinha) e a pista;
- **🎃 Travessura!** — ele apronta uma brincadeira fofa (uma cutscene de
  poucos segundos) e dá a pista do mesmo jeito.

As duas escolhas são boas, e cada parada lembra o que foi escolhido (o
diário mostra "doces: 6 · travessuras: 3"). A **pista** é um versinho que
aponta o próximo personagem sem dizer o nome.

| # | quem | onde | doce | travessura | pista para a próxima (rascunho) |
|---|---|---|---|---|---|
| 1 | Mano | sorveteria | sorvete de abóbora | espirra granulado de morcego nos dois | "Quem vende o bilhete para o céu e nunca coube lá em cima?" (Cookie) |
| 2 | Cookie | bilheteria | um docinho minúsculo (o favorito dele) | levanta o lençol e diz "BU!" — e quem se assusta é ele | "Na água vive um francês que joga como ninguém." (Jean-Luc) |
| 3 | Jean-Luc | lago | pirulito de olho | um ponto de ping pong: se ele ganhar, "travessura"; se a dupla ganhar, dois doces | "Do lado do lago, alguém de laranja não sai do posto." (Capy) |
| 4 | Capy | beira do lago | maçã do amor | **pescar maçã com a boca** na bacia (minijogo de tempo, curtinho) | "Três irmãs fazem festa no piquenique." (coelhinhas) |
| 5 | Luna, Sol, Estrella | piquenique | pipoca de caramelo | a dupla dança com elas (a dança da festa da torcida) | "Quem ensina português de chapéu de estrela?" (Gatito) |
| 6 | Gatito | piquenique | biscoito de gato preto | uma pergunta de português de Halloween ("como se diz *bruja*?") | "Um bicho de palha mexe um caldeirão." (Noel) |
| 7 | Noel | carrinho de poções | suco-poção que muda de cor | a poção borbulha e solta uma fumacinha colorida | "A mais devagar de todas conta histórias no canteiro." (Josefina) |
| 8 | Josefina | canteiro de abóboras | bolo de abóbora | conta uma "história de fantasma" que termina numa piada | "A mais alta vê tudo lá de cima." (Gina) |
| 9 | Gina | ponto de ônibus | bala de goma de aranha | apita como no clube | a pista do final: "Atrás da roda, onde a cerca fecha o mato, uma porta laranja só abre para quem trouxe a cesta cheia." |

O **Walter**, o **Flynn** e o **Pelusa** não são paradas: o Walter está no
final, o Flynn uiva no campinho de frisbee e o Pelusa dorme no pufe da
lojinha — dá para falar com eles, mas eles não têm pista.

**Mapa e diário.** O mapinha da Estella vira um item de mão: abrir mostra as
pistas já recebidas (um pergaminho com os versinhos), e a próxima parada
fica marcada com uma abóbora acesa no caminho. Ninguém fica perdido.

---

## 7. O final — quatro opções, uma recomendação

### ⭐ A. A Casinha da Abóbora (recomendada)

Atrás da cerca que fecha a praça da roda contra o mato (`villaLobos.ts`, a
cerca de `x = −11`) aparece, só na festa, um **portão laranja**. Ele leva a
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

### B. A roda gigante à meia-noite

A última pista leva à roda gigante: as cabines viram abóboras, o Cookie
consegue — enfim — andar nela (numa cabine especial grande, a história dele),
e o casal sobe junto e vê o parque inteiro enfeitado lá de cima, com fogos de
artifício. Os personagens acenam lá embaixo. **Mais barata** (a roda, a
cabine e a primeira pessoa já existem — `scripts/ride.mjs`) e muito
romântica, mas não é um lugar novo.

### C. A fogueira de histórias

A pista leva a uma roda de troncos com uma fogueira no campinho de frisbee:
todos sentados em volta, a Josefina conta uma história de fantasma fofa,
marshmallows no espeto. Aconchegante e barata. (Não usa a clareira de
propósito: a clareira é o lugar só dos dois.)

### D. O baile à fantasia na praça de gelo

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

### 8.3 Desempenho (a parte delicada)

O parque é a cena mais pesada do jogo e a festa põe mais de uma dúzia de
personagens nele, mais as decorações, à noite. O plano para não travar o
celular **sem perder beleza**:

- tudo o que se repete em **lote** (abóboras, lanternas, morcegos, velas,
  fantasminhas, teias): uma malha por tipo, centenas de cópias;
- tudo o que é fixo em **`fundir()`**;
- **luz pintada**, nunca luz nova: poça de luz no chão, halo nas lanternas,
  brilho nos furos da abóbora;
- os personagens do clube **só no parque durante a festa** (no clube, eles
  continuam lá; no parque, entram só com a época);
- medir `window.jogo.renderer.info.render` antes e depois de cada etapa, no
  computador e no celular, e anotar no commit.

---

## 9. As etapas

Cada etapa é um pedaço jogável, testado e publicado, para o Renan ver e
aprovar antes da próxima.

| # | etapa | o que entra | skills |
|---|---|---|---|
| **0** | **decisões** | as respostas do §10 | — |
| **1** | **o filme e a carta** | a fase do evento no save e o `?halloween`; no sofá, "Assistir um filme de terror", o filme na TV, as falas, a carta deslizando por baixo da porta, "Pegar a carta" e o painel da carta (§2.1) | `cenario`, `prop` + `geometry`, `textures`, `animation` |
| **2** | **o parque enfeitado, de manhã e vazio** | as decorações do parque e das lojas, de dia (§4), os personagens fora, as plaquinhas, os comentários da dupla no caminho (§2.2) | `cenario`, `prop` + `geometry`, `textures`, `lighting` |
| **3** | **o presente da Estella** | a boutique decorada, a Estella de aranha, as seis caixas, **as seis fantasias** completas para os dois (§5.1), o provador (§2.3) | `roupa`, `bicho`, `prop` + `geometry`, `textures`, `animation` |
| **4** | **da manhã à festa** | a planejar (§2.4): a noite chegando, as luzes acesas, os convidados fantasiados (§3) | `cenario`, `bicho` + `lighting`, `shaders`, `animation` |
| **5** | **doces ou travessuras** | as nove paradas (§6) | `cenario` + `interaction`, `animation` |
| **6** | **o final** | o final escolhido (§7) | conforme a escolha |
| **7** | **o fechamento** | a memória no quadro, o prêmio do final, "Reviver a festa", o teste completo no celular | `memoria`, `testar` |
| **8** | **abrir o evento** | ligar o calendário para quem joga (até aqui, só o `?halloween` mostra o evento) | `testar` |

**Uma por vez, e escondida.** Cada etapa começa com uma conversa com o Renan
sobre os ajustes dela (registrados aqui), depois é construída e testada com
`?halloween`, e só então vem a próxima. Ninguém vê nada no jogo até a etapa 8.

---

## 10. Perguntas para o Renan

### Para fechar a parte 1 (o filme, o parque de manhã e o presente)

1. **As falas** do filme (§2.1), da carta, dos comentários no caminho (§2.2)
   e da Estella (§2.3): estão boas, ou você quer escrever? Fala sua vai
   literal.
2. **O clube e a escola na fase da manhã**: se a dupla pegar o ônibus antes
   da festa, os personagens de lá também estão "se arrumando" (com
   plaquinha), ou o clube e a escola ficam normais?
3. **O provador**: vocês escolhem qual fantasia vestir (abre o
   guarda-roupa), ou a Estella escolhe uma para cada um?
4. **As peças das seis fantasias** (§5.1): alguma que você imagina
   diferente?

### Para as próximas partes

5. **O final**: A (Casinha da Abóbora), B (roda gigante à meia-noite), C
   (fogueira de histórias), D (baile no gelo) ou A + B?
6. **Os convidados**: "todos os personagens do clube" inclui também os da
   escola (Gatito, Flynn, as coelhinhas) e o Pelusa? O plano inclui todos.
7. **As fantasias dos personagens** (§3): alguma que você imagina diferente?
8. **Quando aparece**: só de 15/10 a 2/11 pelo calendário, depois "Reviver a
   festa" — ou o ano todo?
9. **Doces ou travessuras**: as nove paradas (§6) estão boas, ou tem algum
   personagem que precisa de uma parada própria (o Walter, o Flynn)?

**Respondidas:** o prazo (sem pressa, nada aparece até tudo estar pronto);
quem começa o evento (a dupla, no sofá); o convite (a carta por baixo da
porta); o parque antes da festa (de manhã, enfeitado, sem os personagens); as
fantasias da dupla (a Estella dá as seis, completas); a Estella (aranha fofa).
