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

**Estado: etapas 1 a 5 construídas, escondidas.** O filme no
sofá e a carta da Estella (§2.1), o parque no pôr do sol, enfeitado e vazio
(§4.1), o presente da Estella na boutique (§2.3.1), a noite da festa com o
ônibus chegando e todo mundo fantasiado no posto (§2.4.1), e a **caça de
doces ou travessuras** — as dez paradas, as balas, as pistas no mapinha e
as abóboras escondidas (§6, a parte 5a) — e as **cinco fantasias da caça**,
uma inteira a cada duas paradas (§5.2, a parte 5b), estão no jogo, mas só
aparecem com `?halloween` na URL (`src/eventos/halloween/`,
`src/world/halloween/`, `src/world/fantasias.ts`,
`src/world/fantasiasDaCaca.ts`, `scripts/halloween.mjs`,
`scripts/fantasias.mjs`). A próxima é a **etapa 6**: a Casinha da Abóbora
(§7).

**Onde moram as fantasias da caça (5b):** as trinta peças em
`world/fantasiasDaCaca.ts` (o kit vem do `world/fantasias.ts` e da
boutique), as fichas em `world/itens.ts` (`FANTASIAS_DA_CACA`, pelo número
da parada), e a entrega nas falas de cada parada par em
`eventos/halloween/caca.ts` (`fantasia`).

**Onde mora a caça (5a) no código:** `eventos/halloween/caca.ts` (as dez
paradas, as falas, as travessuras, a abóbora acesa em cima da próxima
parada e as dez abóboras escondidas), ligada na conversa com zoom de
`eventos/halloween/naFesta.ts`; as pistas e o pergaminho em
`world/halloween/mapinha.ts` (`PARADAS_DA_CACA`, lidas do save); a cesta no
canto (`g.mostrarCesta`) e a agulha da hora certa (`g.horaCerta`) no
`ui/Ui.ts`; o som `balas` em `audio/efeitos.ts`.

**Onde mora a etapa 2 no código:** o kit em `world/halloween/` (`abobora.ts`,
`pendurados.ts`, `pecas.ts`, `nessie.ts`; `kit.ts` é a vitrine dos testes);
a camada do parque em `eventos/halloween/noParque.ts` (uma chamada no fim
do `villaLobos.ts`); quem foi se arrumar em `eventos/halloween/ausentes.ts`
(uma chamada no fim do clube, do Mania, da estufa, da escola e do ginásio);
os recados em `eventos/halloween/recados.ts`.

**Onde mora a etapa 3 no código:** as doze peças das fantasias em
`world/fantasias.ts` (a capa viva e as asinhas que batem; as fichas em
`world/itens.ts`, `FANTASIAS_DA_ESTELLA`); a Estella de aranha e o Pelusa
morceguinho em `world/halloween/fantasiasDosBichos.ts` (por fora das
classes); as bexigas de caveira, o caldeirão de balas, as caixas, a cestinha,
a meia e o resto da loja em `world/halloween/boutique.ts`; o mapinha em
`world/halloween/mapinha.ts`; e a camada da boutique, com a cena do presente,
em `eventos/halloween/naBoutique.ts` (uma chamada no fim da `lojinha.ts`).

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

### 2.3.1 A etapa 3 em detalhe: o presente da Estella (fechada com o Renan)

> **Construída** (escondida atrás do `?halloween`). O que mudou na
> construção, em relação ao plano abaixo:
>
> - a Estella espera no salão (e não na porta: a dupla nasce a 80 cm dela),
>   e entre uma parte e outra da cena a tela escurece um instante (as caixas
>   aparecem no balcão; os dois entram nas cabines fechadas, numa âncora, e
>   a cortina esconde; saem fantasiados no vão do cantinho, onde a arara de
>   frio não tapa ninguém);
> - a dupla ganhou duas falas de reação ("Estella! Você tá de aranha!" / "A
>   aranha mais fofa do parque inteiro.", e na saída "Eu sou um vampiro!" /
>   "E eu sou um morceguinho!") e a meia rendeu três ("Ops… a meia!" /
>   "Quem jogou meia por cima da minha cortina?!" / "Foi sem querer! Tá
>   quase!") — rascunhos, o Renan reescreve;
> - o mapinha é um item de mão que se LÊ: segurando, o E vira "Ler o mapinha
>   da Estella" (`ItemDef.leitura`, no motor) e abre no painel do quadro;
> - os bustos da vitrine ganharam o chapéu de bruxa e a cabeça de abóbora
>   (as fantasias da caça ainda não existem);
> - a capa do vampiro é uma grade de pano VIVA (`capaViva`): se acomoda nos
>   braços e nas pernas, abre para trás andando, e sentado assenta no banco.
>   Para ela o rig passou a mostrar os pivôs dos braços (`MedidasCorpo.bracos`,
>   só leitura, como as pernas);
> - na volta da cena a Estella vai até a ronda por um caminho livre (em
>   linha reta ela atravessaria a arara das calças).
>
> Medido (desenhos por quadro, sem -> com o enfeite): térreo 467 -> 580,
> mezanino 297 -> 347. Sem o `?halloween`, ou antes da carta, a boutique
> tem as mesmas 629 malhas de antes do evento.
>
> **A luz de Halloween** (pedido do Renan: "está muito claro"): no evento a
> boutique fica no lusco-fusco — o `g.luzDoCeu` no primeiro quadro com o
> fundo de ameixa, o ambiente lilás a 0,8 e a luz principal de vela a 0,5
> (`P.boutiqueNoEscuro*`) — e quem ilumina são as abóboras ACESAS
> (`LoteDeAboboras.montar({ acesas: true })`: a cara chapada da cor da
> chama, o halo e a poça no chão, cada um um lote, tremendo pela cor da
> cópia), o lustre com um halo e uma poça de vela por cima dos dele, e as
> lanternas de papel do mezanino com o halo da cor delas
> (`EnfeitesDePendurar.luzDasLanternas`). Nenhuma luz de verdade: custou 4
> desenhos no térreo e 3 no mezanino. É o mesmo kit que acende o parque na
> etapa 4.

> As respostas do Renan já estão aqui dentro. Falta construir (§9).

**O que a etapa 3 entrega.** Com a fase `convite`, a porta da boutique deixa
de abrir a loja de sempre: lá dentro está a **boutique de Halloween**, a
Estella **de aranha** esperando na porta, o **Pelusa morceguinho dormindo no
pufe**, e a cutscene do presente. A etapa termina com a dupla **fantasiada**
(o Ari de vampiro, o Renan de morceguinho), com a **cestinha de abóbora** e o
**mapinha** — e a porta de saída. O que tem do lado de fora (a noite e o
ônibus) é a etapa 4; até ela existir, sair da boutique volta para o parque no
pôr do sol.

**As respostas do Renan:**

- **o mezanino também enfeitado**, "bem com cara de Halloween", e com
  **bexigas de caveira**;
- **a aranha do jeito dela** — nas cores da loja, e não preto de aranha de
  verdade;
- **sem topete**: cada um continua com o próprio cabelo, e as fantasias têm
  que sair **bem detalhadas e bem feitas**;
- **a caixa só abre** (sem manequim), e **a Estella não diz o que tem
  dentro**: a surpresa é quando eles saem do provador;
- **cada um leva a sua caixinha para o provador e sai inteiro vestido**; as
  fantasias viram **roupas permanentes** do guarda-roupa;
- **o mapinha** entra;
- **a loja volta a funcionar normal, mas só DEPOIS da cutscene**;
- **o Pelusa no pufe vinho**, e **nenhuma fala sobre ele**.

**A boutique enfeitada** (camada por cima da `lojinha.ts`, igual ao parque:
a fábrica dos móveis não muda; o que tem cor de loja ganha roxo e laranja
pela mesma repintura do parque, e o resto é peça do kit `world/halloween/`):

| onde | o quê |
|---|---|
| a porta, por dentro | a guirlanda de folhas secas (a mesma da fachada) e um capacho de abóbora |
| o teto do térreo | bandeirolas de morceguinho de feltro entre o lustre e as paredes, e **teias de lã** nos cantos (a Estella tece: as teias da loja são de LÃ, roxa e laranja, com uma aranhinha de feltro) |
| o pátio das araras | abóboras pequenas aos pés das araras, um **caldeirão de balas** na mesa de mármore do meio |
| o pódio da vitrine | os dois bustos trocam a roupa da loja por **fantasia**: um de bruxinha, outro de abóbora (são o "trailer" das fantasias da caça) |
| o caixa | abóboras esculpidas em cima do balcão, um pote de biscoito de fantasminha |
| os provadores | cortina repintada de roxo, uma placa "Provador assombrado" pendurada |
| o cantinho de esperar | o **Pelusa no pufe vinho** (abaixo), uma mantinha laranja dobrada na namoradeira |
| o mezanino (pedido do Renan: tão enfeitado quanto o térreo) | **cachos de bexigas de caveira** (bexiga branca com a caveirinha sorrindo, amarradas em fita) nos cantos e no topo da escada rolante, bandeirolas e morceguinhos no guarda-corpo, teia de lã no espelho, abóboras nos pedestais das araras premium e na mesa de chapéus, um chapéu de bruxa na mesa, e lanterninhas de abóbora no ateliê de tingimento |

As bexigas de caveira entram no kit (`world/halloween/`) para o parque e a
Casinha usarem depois. A boutique é de **pôr do sol** por dentro (a luz do
lustre e das arandelas, pintada); a noite só começa quando eles saem.

**A Estella de aranha, do jeito dela** (`fantasia: 'halloween'` na classe —
o cérebro não muda; ela continua com a fita métrica e os óculos de
meia-lua, porque continua sendo ela). As cores são as da loja dela — o rosa,
o vinho e o creme da boutique, com uma pitada de roxo do Halloween —, e não
o preto de aranha de verdade:

- **mais quatro patinhas de feltro** saindo dos lados do corpo, listradas
  de rosa e vinho, com costura aparente e a pontinha de pompom, que
  balançam quando ela anda (com as quatro patas de verdade, dá as **oito**);
- **a tiara de olhinhos** na cabeça: seis olhinhos redondos de feltro com
  brilho e cílios, em duas fileiras;
- **o novelo de lã rosa** no lombo (no lugar da alfineteira), com o fio
  saindo e virando uma teia pequena;
- **o laço** do topete vira um laço de aranha (vinho com bolinha rosa).

**O Pelusa morceguinho**: no pufe vinho do cantinho de esperar, **deitado
em pãozinho** (a pose que ele já tem do turno 6), olhos fechados, a barriga
subindo e descendo devagar, o rabinho batendo de vez em quando — com as
**asinhas de morcego** (feltro, nas costas) e as **orelhinhas de morcego**
numa tiara. Sem interação e sem fala nenhuma sobre ele (decisão do Renan):
nem prompt aparece, e ninguém comenta.

**A cutscene** (as falas são os rascunhos do §2.3, sem nenhuma que conte o
que tem nas caixas):

1. a dupla entra; a Estella está na porta, de costas, e vira devagar:
   "Ora, ora… quem caiu na minha teia?" — pausa — "Brincadeira! Entrem,
   entrem, que a aranha aqui só morde biscoitinho.";
2. ela anda até o caixa e tira **duas caixas** de trás do balcão (caixa de
   presente listrada, laço de fita, uma etiqueta com o nome de cada um):
   "Oito patinhas, e todas costurando a semana inteira só pra vocês." — e
   NÃO diz o que tem dentro: "Nada de espiar! Abram só lá no provador.";
3. **cada um pega a sua caixinha** (ela vai para a mão) e entra num
   provador; a cortina fecha, a câmera fica na frente das cabines, a tampa
   pula lá dentro, o barulhinho de roupa, e uma meia voa por cima da
   cortina (a graça da cena);
4. a cortina abre e os dois **saem inteiros fantasiados** — a surpresa é
   agora: o Ari de **vampiro**, o Renan de **morceguinho**. A Estella:
   "Muahaha! Ficaram perfeitos! Tão perfeitos que dá vontade de enrolar
   vocês num casulo e guardar na vitrine." — pausa — "…de mentirinha, tá?"
   e "Nenhuma fantasia sai daqui sem a minha aprovação… e estas eu APROVO!";
5. ela dá a **cestinha de abóbora** e o **mapinha**, conta das outras
   fantasias com os amigos, e "Agora vão, que a noite é das aranhas… e dos
   amigos delas!";
6. vira memória ("O presente da Estella"), as fantasias ficam para sempre
   no guarda-roupa dos dois (`g.ganharPeca`, as seis peças de cada), e a
   loja volta a funcionar.

**Antes e durante a cutscene a loja não funciona** (as araras, o espelho, o
ateliê e a escada ficam quietos); depois dela, tudo volta ao normal, com a
Estella de aranha fazendo a ronda dela.

**O que eles vestem.** No provador, cada um veste a fantasia INTEIRA (as
seis vagas); a roupa de antes vai para o guarda-roupa, nada se perde. Depois
dá para trocar peça por peça no espelho do mezanino, como sempre.

**A cestinha de abóbora**: item de MÃO (vai para a mochila e para a mão de
quem joga), uma abóbora de plástico com a alça e a carinha — nesta etapa
ela vem **vazia**; as balas enchendo são da etapa 5.

**O mapinha**: um painel desenhado em canvas, no estilo da carta da Estella
(papel, letra dela, carimbinho de aranha): o parque visto de cima com as
lojas desenhadas, e as pistas já recebidas escritas em pergaminho (§6).
Nesta etapa ele traz só **a primeira pista**, que leva à parada 1 (o Mano,
na sorveteria) — rascunho: *"Comecem por quem serve gelado de casaca e
não tem medo de frio."* Fica na mochila para abrir de novo.

**As duas fantasias** (as peças do §5.1, sem o topete, com o capricho do
§5.4):

- 🧛 **vampiro**: as presinhas (cabeça, com o cabelo de cada um), o colete
  vinho com camisa de babado e gola alta (tronco), a calça social preta, o
  sapato de verniz com fivela, as luvas brancas e a **capa** preta de forro
  vermelho com gola em pé (acessório, pano que balança andando — o molde do
  avental);
- 🦇 **morceguinho**: a tiara de orelhas de morcego, o moletom de morcego com
  a barriguinha clara, a calça listrada preta e roxa, as pantufas de morcego,
  as luvinhas com unhinha e as **asinhas** nas costas (acessório, batendo de
  leve ao andar).

Elas entram no guarda-roupa com um filtro novo **🎃 Fantasias** nas abas, e
não se pintam no ateliê (presente de personagem, `PECAS_SEM_TINTA`).

**A ordem de construir** (cada uma com foto e teste):
1. as duas fantasias (a peça mais cara da etapa) e o filtro 🎃;
2. a Estella de aranha e o Pelusa morceguinho no pufe;
3. a boutique enfeitada, com as bexigas de caveira;
4. as caixas, o provador, a cesta e o mapinha, e a cutscene;
5. o teste (`scripts/halloween.mjs`, `SO=boutique`) e a volta medida.

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

### 2.4.1 A etapa 4 em detalhe: a noite e o ônibus (fechada com o Renan)

> As respostas do Renan já estão aqui dentro (ver "As respostas do Renan",
> no fim desta seção). Falta construir (§9).

**O que a etapa 4 entrega.** A dupla sai da boutique fantasiada e a fase vira
`festa`: o parque está **de noite**, todo aceso; o **ônibus do clube**
chega no ponto e desce a turma inteira **fantasiada** (o clube e a escola);
cada um vai para o seu posto da festa, onde o Mano, o Cookie e o Jean-Luc já
estão. A etapa termina com o parque cheio, cada um com uma fala de Halloween,
e o mapinha apontando para o Mano. A caça (as paradas, as balas, as outras
fantasias) é a etapa 5: aqui as paradas ainda não perguntam "doces ou
travessuras".

**Ressalva do plano antigo:** o §2.4 dizia que "a cena do ônibus chegando já
existe". Não existe: o ônibus do parque fica parado na rua (`39,5; 10,4`), e
o `scripts/onibus.mjs` só fotografa ele parado. A chegada (andando pela rua,
freando, a porta abrindo) é peça nova desta etapa.

#### A. A noite no parque (luz pintada, nenhuma luz nova)

- **o céu**: a fila de momentos da clareira (`world/noite.ts`) anda do
  `POR_DO_SOL` até a `NOITE` no `g.luzDoCeu` — o parque inteiro anoitece
  (hoje só a clareira anoitece), e continua de noite enquanto a fase for
  `festa`/`depois`, mesmo saindo e voltando;
- **as abóboras acesas**: o kit já está pronto e testado na boutique
  (`LoteDeAboboras.montar({ acesas: true })`: a cara da cor da chama, o halo
  e a poça no chão, tremendo) — o parque inteiro só troca a chamada;
- **as lanternas de papel acesas** (`luzDasLanternas()`, também pronto) e
  uma poça laranja embaixo de cada poste (os postes já estão repintados de
  luz de abóbora);
- **varais de luzinha** (novo): fios de lampadinhas laranja e roxas na
  praça da roda e na calçada da boutique, cada lâmpada um halo do
  `brilhoEmLote` — um desenho para todas;
- **os morceguinhos voando em bando** em volta da roda gigante (o plano do
  §4: lote, as asas batendo no shader);
- **o Nessie de barriga acesa**, com a poça de luz na água em volta dele;
- **as janelas das lojas acesas** (a claridade da janela ao contrário: de
  dentro para a calçada);
- **névoa baixa** rolando no lago e na grama: só se a medida no celular
  deixar (é a peça mais cara da lista).

> **Construída (a parte A, escondida atrás do `?halloween`).** Na fase
> `festa` (e no `depois`) o parque é de noite: a NOITE da clareira com o
> luar do lado da câmera (`P.luarDaFesta`, ambiente 0,72, luar 0,52); as
> quatro luzes dos postes que o parque já tinha em modo noite e cor de vela;
> as abóboras acesas (as da roda também, com o halo andando junto e sem
> poça); as lanternas de papel e os **varais de luzinha** (novos no
> `EnfeitesDePendurar.luzinhas`: em cima de cada varal de bandeirolas, na
> praça da roda e na fachada da boutique, laranja, roxo e creme); os
> **morcegos voando** em volta da roda (`world/halloween/morcegos.ts`, dois
> lotes, a asa batendo na matriz); o **Nessie aceso** com a poça verde
> andando com ele; e a vitrine da boutique acesa na calçada. A névoa baixa
> ficou de fora por enquanto (a mais cara da lista). Medido na alameda:
> 391 -> 408 desenhos por quadro. **O alcance** (pedido do Renan: as luzes
> estavam fracas): a poça da abóbora no chão vai a `5r + 0,7` (a de cima
> de móvel fica no tampo), o halo a `5r + 0,3`; as lanternas e as luzinhas
> ganharam a POÇA no chão embaixo (`luzDasLanternas(forca, chao)`; nas
> luzinhas, uma a cada três lâmpadas, para o varal não virar um lençol); o
> Nessie joga 7 m de luz na água; a luz dos postes vai a 15 m de noite. A
> alameda ficou em 384 desenhos (as poças entram em lote). Teste: `scripts/halloween.mjs SO=noite`.
> A fase `festa` liga no fim da cena do presente, na boutique (a noite cai
> enquanto eles se arrumam); save que já tinha o presente é lido como festa.

#### B. A saída da boutique e o ônibus (a cutscene)

1. a porta da boutique abre para o parque de noite; a dupla para na
   calçada. Renan: "Já anoiteceu?! A gente ficou quanto tempo lá dentro?" —
   Ari: "O suficiente pra ficar lindo." (os rascunhos do §2.4);
2. **a buzina** ao longe. A câmera **desliza da boutique até o ponto de
   ônibus** (são uns 75 m: a dupla fica parada esperando, como na tomada de
   cena da clareira) — *proposta*; a outra opção é a dupla andar até lá e o
   ônibus chegar quando eles se aproximam;
3. o ônibus **chega pela rua**, freia (balança um pouco), o pisca-alerta
   pisca, a porta abre;
4. **descem um por um, cada um com o seu jeito**: a **Gina** abaixando a
   cabeça para caber na porta (e o chapéu de bruxa enroscando); o **Capy**
   apitando; o **Noel** correndo; o **Walter** de bandeja; o **Gatito**; o
   **Flynn** pulando o degrau; as **três coelhinhas** juntas; e por último a
   **Josefina**, devagarinho — o motorista espera. **Cada um, ao descer,
   para na calçada e fala alguma coisa** no jeito dele (decisão do Renan; a
   câmera chega perto de quem fala), acena e sai andando para o lado do
   posto dele;
5. a tela escurece um instante e a câmera volta para a dupla na calçada da
   boutique. Ari (ou quem joga): "Vamos atrás da primeira pista?";
6. vira memória ("A noite da festa").

Os que descem não andam o parque inteiro na tela: saem do quadro e, com a
câmera de volta, já estão nos postos (o jogo põe cada um lá).

> **Construída** (`eventos/halloween/chegadaDoOnibus.ts`, chamada pelos
> postos da festa uma vez por save — a flag `halloween:onibus-chegou`). A
> câmera de cena nasce no enquadramento da isométrica e anda no relógio do
> jogo: a dupla na calçada da boutique ("Já anoiteceu?!" / "O suficiente pra
> ficar lindo."); a **buzina**; o **voo** por cima do parque aceso (uma
> curva Catmull-Rom para onde a câmera está e outra para onde ela olha:
> sobe da boutique, passa pela barraquinha, a roda e o campinho, e desce
> pelo corredor do vão da cerca até a calçada, ao sul do abrigo); o ônibus
> **chega pela rua** com os faróis e a poça de luz andando na frente dele,
> o motor roncando em fila, freia (o freio de ar no fim, e o nariz
> mergulha e volta amortecendo), o **pisca-alerta** pisca e a **porta
> abre** com o sopro (as folhas correm para os lados e o vão escuro, com a
> luzinha de dentro, aparece). Descem um por um, e cada um para na calçada
> com a câmera chegando perto: a **Gina** de pescoço abaixado na porta
> ("abaixa, Gina…") e o véu enganchando; o **Capy** apitando ("Tubarão
> também respeita a fila"); o **Noel** correndo (a poção no fogo); o
> **Walter** de bandeja, latindo, e o Noel traduzindo de longe que a
> barraca abre em cinco minutos; o **Gatito**, que late "Au." — e o Walter
> para, vira e responde "Au?", e aprova a fantasia abanando; o **Flynn**
> pulando o degrau inteiro com um uivo; as **três coelhinhas** juntas (a
> coruja, o salto da catrina e a estrelinha da fadinha); e por último a
> **Josefina**, devagar, agradecendo o motorista. A porta fecha, o pisca
> apaga, a tela escurece, e a câmera volta para a dupla com todo mundo
> nos postos (o Walter no caixote da barraca). **O ônibus é novo** (pedido
> do Renan: as mesmas cores, mais detalhado; `world/onibusDaCidade.ts`) —
> e virou o ônibus de sempre, no parque e no clube, durante e depois do
> evento. Na noite da festa o letreiro de LED diz "Festa no Parque", e a
> cena usa os comandos dele — a porta de
> folhas que correm (o vão de dentro com o corrimão amarelo e a luzinha),
> as rodas girando o que ele anda, o farol com a poça de luz e o
> pisca-alerta. A buzina, o motor, o freio
> de ar e a porta pneumática são sons novos (`audio/efeitos.ts`). **As
> falas são rascunhos.** Teste: `scripts/halloween.mjs SO=onibus`.

#### C. Onde cada um fica na festa

| quem | posto | o que faz ali (nesta etapa) |
|---|---|---|
| Mano | a sorveteria (reabre, sem o pano de "fechado") | fica no posto, fala de Halloween |
| Cookie | a bilheteria | idem; a roda gigante funciona |
| Jean-Luc | o lago | nada perto do trapiche |
| Capy | a beira do lago, com uma bacia de maçãs (a travessura da etapa 5) | fica no posto |
| Gina | o ponto de ônibus (sobra lá depois que o ônibus sai) | idem |
| Noel | um **carrinho de poções** (peça nova) na praça da roda, com o caldeirão que já está lá borbulhando de verde | idem |
| Josefina | um **canteiro de abóboras** (peça nova) no gramado | idem |
| Gatito e as três coelhinhas | o piquenique | idem |
| Flynn | o campinho de frisbee | idem |
| Walter | **não fica**: desce com a bandeja e some atrás da praça da roda, onde fica o portão escondido da Casinha (decisão do Renan: a dupla comenta "Pra onde o Walter tá indo?" — a primeira dica do final) | — |
| os patinhos | o lago, de chapeuzinho de bruxa | como sempre |
| Estella | continua na boutique, de aranha | a ronda dela |

Cada personagem tem **uma fala de Halloween** nesta etapa (rascunhos
fofos); a pergunta "doces ou travessuras?" entra na etapa 5. As plaquinhas
de recado somem. O clube e a escola continuam vazios (decisão do Renan).

> **Construída (a parte C, escondida atrás do `?halloween`).** Na fase
> `festa` (e no `depois`) os postos são montados por cima do parque pronto
> (`eventos/halloween/naFesta.ts`, chamado pelo `noParque.ts`): a **Gina** na
> calçada do ponto de ônibus, na frente do abrigo; o **Capy** na beira do
> lago, do lado do trapiche, com a **bacia de maçãs** (a tina de aduelas
> com os dois arcos de ferro, as maçãs boiando e girando com a marolinha, a
> toalha listrada na beira e o caixote de maçãs); o **Noel** andando do lado
> do **carrinho de poções** na praça da roda, atrás do caldeirão grande, que
> agora **borbulha verde** (a bebida acesa, as bolhas estufando e estourando,
> o vapor e a luz verde no chão); a **Josefina** no **canteiro de abóboras**
> do gramado (as tábuas com veio, a terra fofa, as ramas, as folhas em
> concha, as gavinhas e a plaquinha "Abóboras da Josefina"; as abóboras dele
> entram no lote do parque, acesas e tremendo junto com as outras); o
> **Gatito** do lado do piquenique, as **três coelhinhas** no piquenique e o
> **Jean-Luc** no posto dele, mesmo sem destravar; o **Flynn** dentro do
> campinho de frisbee. A **Estella** fica na boutique (o xadrez fecha), os
> **desafios** da arena estão suspensos (o recado volta ao quadro), e a roda,
> o bilhete do Cookie e o sorvete funcionam de noite. O clube, o Mania, a
> estufa e a escola ficam vazios do convite até a noite de sono (com os
> recados de quem foi se arrumar). O Walter chega com o ônibus (parte B).
>
> **O carrinho de poções** (pedido do Renan: bem detalhado,
> `world/halloween/carrinhoDePocoes.ts`): a caixa de tábua pintada de roxo
> com estrelinhas e luas, o friso laranja, o painel da frente pintado à mão
> (as poções do amor, da risada e da coragem, "feitas na hora!"), o
> lambrequim recortado embaixo, as duas rodas de raio com o aro de ferro, os
> pés e o puxador atrás; em cima, a escadinha de três degraus com 21 poções
> em quatro feitios de vidro (a bebida acesa por dentro, a rolha ou a tampa
> de vidro, a etiqueta, um halo pequeno na cor de cada uma) e três "da casa"
> maiores no balcão, o suporte de tubos de ensaio, o livro de receitas aberto
> ("Poção do riso: 1 pena de peru, 2 risadas…"), o pilão, e o **alambique**:
> o balão borbulhando verde em cima do tripé, a lamparina de chama azul
> tremendo, a serpentina de vidro descendo até o erlenmeyer que pinga roxo e
> o vapor saindo do gargalo; por cima, o toldo listrado roxo e verde em arco,
> o lambrequim de ondas com os pompons, os postes enrolados de fita, a placa
> "Poções do Noel", os maços de erva seca e as duas lanternas de papel do
> parque penduradas nas pontas; na frente, a lousa de cavalete em giz.
>
> **A conversa com zoom** (pedido do Renan: "ao falar com cada um, a câmera
> dá um zoom, tipo uma cutscene, para ver as fantasias"): cada um tem um
> "Falar com…" que anda com ele. A isométrica dá lugar a uma câmera de cena
> que nasce no mesmo enquadramento e desliza até um três-quartos de frente
> de quem fala, na altura do peito e na distância que a altura dele pede (a
> Gina de longe, a Josefina de perto); quem fala vira para a câmera, a dupla
> fica de lado (nunca entre ele e a câmera: a primeira versão deixava o
> parceiro tapando o Noel), e no fim a câmera desliza de volta. O Cookie
> emenda, ainda de perto, a conversa do bilhete de sempre; o Mano repara em
> quem está de capa de vampiro. **As falas são rascunhos** (em `naFesta.ts`,
> a apresentação da fantasia na primeira vez e uma fala curta depois) —
> o Renan troca o que quiser. Teste: `scripts/halloween.mjs SO=festa`.
> **A barraquinha de cachorro-quente do Walter** (pedido do Renan: ela
> já está no parque durante o evento, bem detalhada e bonita, e o Walter só
> chega com o ônibus; `world/halloween/barracaDoWalter.ts`): no canto de
> baixo da praça da roda, no gramado entre o canteiro de flores, a entrada
> do caminho e a pista — colada no calçamento, a poucos passos do carrinho
> do Noel e do caldeirão, e fora de toda passagem (no lado direito, a
> primeira versão ficava na frente da bilheteria do Cookie, e o Renan pediu
> um canto; no meio do gramado, o cordão de luzinhas entre dois postes
> passava por cima dela). Uma
> barraca de madeira vermelha com o friso creme num estradinho, o painel
> pintado à mão ("Cachorro-quente do Walter", as patinhas e o "au!"), o
> toldo de duas águas listrado de vermelho e creme com o lambrequim e os
> pompons mostarda, e o **cachorro-quente gigante** na cumeeira, de
> carinha e com as faixas de múmia (o Walter vem de múmia). No balcão: a
> chapa de inox com as salsichas rolando e as **salsichas-múmia** de
> olhinhos, o vapor, a espátula; as cubas de batata palha, milho, ervilha,
> vinagrete e purê; as bisnagas; o porta-guardanapo; dois prontos na
> barquinha xadrez; o pote de ossinhos; o sininho. Atrás, a lousa do
> cardápio ("Simples, Completo, Duplo do Walter, Salsicha-múmia — só
> hoje!"), e do lado a prateleirinha com a cesta de pães. No **convite**
> ela espera fechada (o pano de "FECHADO" no balcão, a chapa vazia); na
> **festa** está aberta e acesa (a lâmpada, as luzinhas, os morceguinhos e
> a teia), com o recado dele pendurado: "Au! Au! (fui buscar a turma no
> ônibus — a chapa já tá quente, volto já!)" — até o ônibus chegar.
>
> **O Walter na barraca** (decisão do Renan: ele fica nela, e vai lá
> atrás da roda de vez em quando). Ele tem 61 cm e o tampo, 1,02 m: fica
> em cima de um **caixote** de feira atrás do balcão (o mesmo truque do
> Jean-Luc na arena), com a cabeça por cima da chapa. O balcão vai só até
> 14 cm atrás do meio e a lateral da direita para antes do fundo: é a
> **passagem** dele. De tempos em tempos (a primeira uns 25 s depois de
> chegar, depois a cada 45 a 70 s, nunca no meio de uma conversa) ele pula
> do caixote, sai pela passagem, desce do estrado e vai rente ao tapume
> da praça até **atrás da roda**, onde some; volta 12 a 20 s depois pelo
> mesmo caminho e sobe no caixote. Os pulos são da cena (o corpo num
> arco), e a pose é do Walter (`salto`: as patas da frente esticam na
> saída e as de trás na chegada). Fora da barraca, o recado pendurado é
> outro: "Au! Au! (volto já — não mexam nas salsichas!)". Na primeira
> vez que a dupla o vê indo, comenta: "Pra onde o Walter tá indo?" / "Lá
> pra trás da roda… e largou a barraca sozinha." É a primeira dica do
> final. A conversa dele é a de zoom de todo mundo, pela frente do balcão
> (ele late, a dupla traduz).
> As miudezas de cor lisa viram uma malha só com a cor nos vértices
> (`juntarPorCor`, agora no `world/fundir.ts`): 56 -> 25 malhas, a mesma
> imagem. Medido mostrando e escondendo a barraca na mesma página: na
> alameda 398 -> 402 desenhos por quadro, e de perto dela +24 a +51.
>
> Medido na alameda, de noite: 419 -> 452 desenhos por quadro com os
> postos (os bichos novos entram pelas beiradas do quadro; as peças vão
> pela `fundir()` e o vidro e a bebida das poções em lote).

#### D. As fantasias dos personagens

O plano novo está no §3 (decisão do Renan): **uma fantasia só de cada
um**, sem repetir ninguém nem as sete da dupla — o Mano de vampiro com o Ari
é a exceção de propósito, com fala própria. Cada uma pendurada nos pontos do
corpo que a classe já tem, por fora dela (o molde da aranha da Estella e do
Pelusa: `fantasiasDosBichos`), e com o capricho das da dupla: pano que
balança, costura aparente, feltro, textura de canvas onde for tecido.

> **Construída a leva do PARQUE** (escondida atrás do `?halloween`, na fase
> `festa`): `world/halloween/fantasiasDoParque.ts`, por fora das classes.
> O **Mano de vampiro** (a capa de forro vermelho com a gola em pé, que
> balança com o passo, o babado, a fita e o medalhão, as presinhas, o bico
> de viúva e os fios de gel; o chapéu de casquinha e o avental ficam
> escondidos) e a fala dele num ponto próprio, "Falar com o Mano", que cita
> quem estiver de capa de vampiro; o **Cookie de lençol** (o pano deitado
> sobre a casca do corpo e um capuz sobre a da cabeça — ela sobe quando ele
> sonha com a roda —, os furinhos dos olhos, a boquinha, as bochechas e o
> laço laranja na ponta da tromba, que sai pelo pano); o **Jean-Luc de
> Fantasma da Ópera** (a meia-máscara de PRATA com a borda e o aro do olho
> dourados — branca, num pato branco, ela sumia de longe, e o Renan pediu
> para ver melhor —, a cartola maior, a rosa no bico, a capa de ópera larga
> e a gola em pé com o forro vinho para a frente, a gravata-borboleta); e os **patos de diabinho** (a tiara de chifrinhos nos
> sete, a capinha vermelha nos três grandes). Teste: `SO=noite`.

> **Construída a leva do CLUBE** (`world/halloween/fantasiasDoClube.ts`):
> a **Gina noiva do Frankenstein**, com cara de Frankenstein (pedido do
> Renan): a pele VERDE (o pelo de girafa repintado só nela), os parafusos
> grandes e prateados logo abaixo da cabeça e um par menor no meio do
> pescoço, as costuras da testa e da bochecha, o anel de pontos em volta do
> pescoço, as olheiras, o cabelo altíssimo com as mechas de raio, o véu de
> gaze e o babado de renda; o quepe fica na guarita, o **Capy tubarão**
> (o capuz de pelúcia com a cara saindo pela boca, os dentinhos de feltro,
> os olhinhos, a barriga clara, a barbatana no lombo, as nadadeiras e o
> rabo; os óculos escuros ficam guardados, o apito continua), o **Noel
> cientista** (o jaleco com as mangas por cima das asas, as lapelas, o bolso
> com três tubos de ensaio acesos, os óculos de proteção e a crista de
> algodão; o avental e a viseira ficam guardados), a **Josefina
> dragãozinho** (os espinhos dourados pelo casco em volta do vasinho, as
> asinhas, o capuz com os chifrinhos, a flecha no rabo e a fumacinha de chá
> a cada 7 s) e o **Walter múmia garçom** (as ataduras encostadas pelo
> corpo, pela cabeça e pelas pernas, as pontas soltas balançando, a
> gravatinha e a bandeja de doces). Quem veste é uma chamada só,
> `fantasiarQuemEstaAqui(w)` (`eventos/halloween/fantasiados.ts`), pela
> etiqueta do bicho, em qualquer cena; com a parte C, eles estão nos
> postos da festa, no parque (o Walter, só com o ônibus). Teste:
> `SO=fantasias`.

> **Construída a leva da ESCOLA** (`world/halloween/fantasiasDaEscola.ts`):
> o **Gatito de Walter** (a tiara de orelhas caídas de cachorro, o focinho
> de bolinha preso com elástico, a gravatinha borboleta, a bandejinha nas
> costas com um copinho de suco e um docinho, e o rabinho de cachorro
> amarrado com fita no rabo dele, abanando) e a fala dele, "Falar com o
> Gatito" ("Au. …" / "Eu vim de Walter! O Mania de Churrasco é o meu
> restaurante favorito." / "A gravatinha é de verdade, viu?"); o **Flynn
> lobisomem** (as luvas peludas com garras, o peitoral de pelo cinza e as
> orelhas de lobo abrindo do lado das de raposa; a bandana continua); a
> **Luna coruja** (o capuz de penas com os olhões de feltro, o biquinho e
> os tufos, a capinha de penas em três camadas e a lua dourada no colar);
> a **Sol catrina** (a coroa de flores, os pontinhos coloridos em volta
> dos olhos, o nariz de coração, o sorriso costurado, as florzinhas nas
> bochechas e a saia de babados em faixas de cor); e a **Estrella fadinha**
> (as asas de tule com a borda acesa, batendo de leve, a varinha de estrela
> no lugar do pompom da direita e a saia de tule azul-noite com
> estrelinhas). **As roupas das irmãs** (pedido do Renan: mais detalhadas
> e mais a ver com cada fantasia): o uniforme de torcida fica guardado, e
> cada uma veste um corpete de tecido desenhado em canvas e uma saia do
> tema, com os pompons nas cores dela — a Luna de PENAS (o corpete de
> escamas de pena com o peito claro, a saia de penas recortada e as penas
> descendo pelos braços), a Sol de VELUDO PRETO BORDADO (flores coloridas,
> o cadarço rosa na frente, a saia longa bordada com o babado colorido na
> barra, as mangas bufantes com renda e uma rosa na cintura) e a Estrella
> de VELUDO AZUL-NOITE (estrelas douradas e pó de brilho, o cinto dourado
> com a estrela de broche, a saia de pétalas clarinhas por baixo do tule e
> as mangas de tule com o punho aceso). As falas de fantasia moram nos
> postos da festa (`eventos/halloween/naFesta.ts`). Medido na alameda: 399 -> 419 desenhos por quadro
> com tudo aceso e fantasiado.

#### E. O que funciona na festa

Decidido pelo Renan: o que é da dupla e não precisa de ninguém continua, e o que
volta com os personagens **volta a funcionar de noite** — a roda gigante à
noite (com o Cookie vendendo o bilhete), o sorvete do Mano e a patinação no
gelo. O que é aula, turno, treino e desafio continua fechado até o evento
acabar (estão todos na festa). Na fase `festa` **todos vêm**, mesmo quem o
jogador ainda não destravou (o Jean-Luc antes das cinco vitórias, a escola
antes da Luna): é a festa da Estella, e ela convidou todo mundo.

#### F. A ordem de construir (dentro da etapa 4)

1. a noite e as luzes (o céu, as abóboras, as lanternas, os postes, as
   luzinhas, os morcegos da roda, o Nessie, as janelas) e as medidas;
2. as fantasias, em três levas com foto de cada uma: o parque (Mano, Cookie,
   Jean-Luc, os patinhos), o clube (Gina, Capy, Noel, Josefina, Walter) e a
   escola (Gatito, Flynn, Luna, Sol, Estrella);
3. o carrinho de poções e o canteiro de abóboras; os postos e as falas;
4. o ônibus chegando e a cutscene;
5. o teste (`scripts/halloween.mjs SO=festa`), a volta medida, e o celular.

#### As respostas do Renan

1. **o ônibus**: a câmera vai até o ponto e mostra a cutscene de **cada
   personagem descendo e falando alguma coisa** (uma fala curta de cada um,
   no jeito dele, ao pisar na calçada);
2. **o Mano fica de vampiro**, igual ao Ari, com uma fala específica dele
   sobre isso (§3);
3. **cada personagem com uma fantasia única**; o Cookie fica com o lençol de
   fantasma; e todas **muito bem feitas, detalhadas e fofas** — o plano novo
   está no §3;
4. **o que volta a funcionar de noite**: sim — a roda gigante, o sorvete e a
   patinação. E **o Gatito vem**, com uma fantasia engraçada (§3: **de Walter**, de
   gravatinha, porque ele gosta muito do restaurante — de rato não, o Ari
   tem fobia de rato);
5. **todos vêm, independente da situação** (o Jean-Luc antes das cinco
   vitórias, a escola antes da Luna);
6. **o Walter some atrás da roda**, deixando a dica do final;
7. **as luzes**: o plano inteiro (os varais de luzinha, os morcegos da roda,
   o Nessie aceso, as janelas; a névoa baixa medida no celular).

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

**Cada um com uma fantasia SÓ DELE** (decisão do Renan, na etapa 4): nenhum
personagem repete o outro, nem as sete da dupla — a exceção de propósito é o
Mano, de vampiro igual ao Ari, com uma fala só para isso. E todas **muito bem
feitas, detalhadas e fofas**, com o capricho das da dupla (§5.4).

| quem | onde fica na festa | fantasia | os detalhes | por quê |
|---|---|---|---|---|
| **Estella** (ovelha) | a boutique | **aranha tecelã** *(construída)* | as quatro patinhas de feltro listradas, a tiara de olhinhos, o novelo virando teia | ela tece e costura; fez a fantasia de todo mundo |
| **Pelusa** (gato) | a boutique, dormindo no pufe | **morceguinho** *(construída)* | as asinhas e as orelhinhas | decisão do Renan |
| **Mano** (pinguim) | a sorveteria | **vampiro**, igual ao Ari, de propósito | a capa de gola alta com forro vermelho, as presinhas, o medalhão, o topete de gel | decisão do Renan: os dois de vampiro, e o Mano repara (a fala abaixo) |
| **Cookie** (elefante) | a bilheteria | **fantasma de lençol gigante** | o lençol caindo até o chão em dobras, dois furinhos para os olhos, a tromba saindo por um furo com um laço na ponta, as orelhas marcando o pano | "assusta as pessoas só pelo tamanho" — agora de propósito (decisão do Renan: ele fica com o lençol) |
| **Jean-Luc** (pato) | o lago | **o Fantasma da Ópera** | a meia-máscara branca, a capa curta de ópera preta e vinho, a cartolinha e uma rosa vermelha no bico | ele é francês, e a ópera é de Paris |
| **Capy** (capivara) | a beira do lago | **tubarão** | o capuz de tubarão de pelúcia (os olhinhos, a fileira de dentinhos de feltro na testa), a barbatana nas costas, o rabinho de tubarão; o apito de sempre no pescoço | o salva-vidas fantasiado justamente do que ele vigia |
| **Gina** (girafa) | o ponto de ônibus | **noiva do Frankenstein** | o cabelo altíssimo com as duas mechas de raio brancas (entre os ossicones), parafusinhos de feltro ao longo do pescoção, uma cicatriz costurada fofa, o véu de gaze | a noiva mais alta do mundo — e é ela quem dá a pista do final |
| **Noel** (peru) | o carrinho de poções | **cientista maluco** | o jaleco branco no lugar do avental, os óculos de proteção na testa, a crista arrepiada de algodão, os tubos de ensaio coloridos no bolso | ele vive misturando suco; hoje são poções — e ele não para quieto |
| **Josefina** (tartaruga) | o canteiro de abóboras | **dragãozinho** | a fileira de espinhos de feltro descendo pelo casco, as asinhas, o capuz com dois chifrinhos, o rabinho com a ponta de flecha, e uma fumacinha de chá saindo de vez em quando | "o dragão mais devagar do mundo" — e ela adora contar história de dragão |
| **Walter** (cão garçom) | some atrás da roda (o final) | **múmia garçom** | as ataduras com as pontas soltas balançando, a gravatinha por cima, a bandeja de doces | ele serve a festa do final |
| **Gatito** (gato) | o piquenique | **de Walter** — cachorro garçom, a fantasia engraçada (pedido do Renan) | a tiara de orelhas caídas de cachorro por cima das orelhas de gato, o focinho postiço de bolinha preta preso com elástico, a **gravatinha borboleta** do Walter (pedido do Renan), a bandejinha de garçom e um rabinho de cachorro amarrado no rabo dele, que balança quando ele anda; de vez em quando ele solta um "au" sem a menor convicção | ele gosta MUITO do Mania de Churrasco, então veio de Walter (era de rato; o Renan trocou — o Ari tem fobia de rato de verdade, e rato não entra no jogo) |
| **Flynn** (raposa) | o campinho de frisbee | **lobisomem** | as luvas peludas de garra, o peitoral de pelo cinza, as orelhas postiças de lobo e a bandana dos Gatitos por cima | o atleta, uivando de animação |
| **Luna** (coelha) | o piquenique | **coruja da meia-noite** | o capuz com os tufos de orelha de coruja e os olhões de feltro, a capinha de penas em camadas, a lua crescente pendurada no pescoço | Luna é lua |
| **Sol** (coelha) | o piquenique | **caveirinha catrina** | a coroa de flores coloridas, a carinha pintada de caveirinha fofa (as bochechas de flor), a saia de babado colorida | a animada, e as expressões dela são do espanhol |
| **Estrella** (coelha) | o piquenique | **fadinha das estrelas** | as asas de tule com brilho, a varinha de estrela, a saia de tule azul-noite com estrelinhas | Estrella é estrela |
| **patinhos do lago** | o lago | **diabinhos** | a mãe com a tiara de chifrinhos vermelhos e uma capinha, os filhotes só com os chifrinhos | uma família inteira de diabinhos fofos |

**A fala do Gatito** (pedido do Renan: ele conta que está de Walter, porque
gosta muito do restaurante; rascunho): "Au. … Eu vim de Walter! O Mania de
Churrasco é o meu restaurante favorito. A gravatinha é de verdade, viu?"

**A fala do Mano** (rascunho; quem estiver vestindo a capa de vampiro —
normalmente o Ari, mas o jogador pode trocar — é quem ele cita):
"Ei, ei! Outro vampiro na minha festa?! … A gente nem combinou. Ficou lindo.
Agora somos o clube da capa." Se nenhum dos dois estiver de vampiro, ele diz
uma fala de Halloween comum.

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
e as paradas 2, 4, 6, 8 e 10 dão uma fantasia completa cada. **Quem dá qual
(a proposta nova, aprovada pelo Renan)**, casando com o posto de quem
entrega:

| parada | quem entrega | a fantasia | por quê |
|---|---|---|---|
| 2 | o Cookie | 🎃 **abóbora** | ele fica ao lado da maior abóbora do parque, na bilheteria |
| 4 | o Jean-Luc | 🏴‍☠️ **pirata** | um pirata de lago, para quem mora na água |
| 6 | as coelhinhas | 🐈‍⬛ **gato preto** | as três de bicho, no piquenique |
| 8 | a Josefina | 🌾 **espantalho** | quem cuida da horta e do canteiro de abóboras |
| 10 | o Noel | 🧙 **bruxinho** | o cientista das poções: a última parada, com a pista do final |

**Construídas (a parte 5b)**: `world/fantasiasDaCaca.ts`, seis peças cada,
todas com modelo próprio. Na parada par, depois do doce ou da travessura,
quem está lá entrega a fantasia no jeito dele (o Cookie dobrou "bem devagar,
pra não amassar a folha"; o Jean-Luc avisa que o papagaio ainda não fala
francês; o Noel testou a vassoura "duas vezes") e as seis peças vão direto
para o guarda-roupa dos dois — no filtro 🎃 Fantasias, junto com o vampiro e
o morceguinho. Como todo presente, não se pintam no ateliê.

| fantasia | cabeça | tronco | pernas | pés | mãos | acessório |
|---|---|---|---|---|---|---|
| 🎃 abóbora | chapeuzinho de oito gomos, cabinho, folha e gavinha | macacão-abóbora de gomos com a carinha (e a camiseta verde) | meia-calça de tricô com a folhinha | botinha de feltro com o cálice de folhas | luvinhas verdes | gola de nove folhas |
| 🏴‍☠️ pirata | tricórnio, caveirinha sorridente e pena | camisa listrada, colete azul-marinho e faixa vermelha | calça bufante até o joelho | bota de cano dobrado com fivela | luva de punho largo e a espadinha de madeira | o papagaio no ombro, mexendo a cabeça |
| 🐈‍⬛ gato preto | orelhinhas de pelúcia com lacinho | moletom de pelúcia, babador, coleira e sininho, patinha nas costas | legging com punho branco | pantufa de patinha com as almofadinhas | luva de patinha | o rabo com laço, balançando |
| 🌾 espantalho | chapéu de palha amassado, beira rasgada e o corvinho | camisa xadrez de remendos, palha na gola e nas mangas | calça de remendo com o cinto de corda | bota gasta de cadarço | luva de couro com palha | bandana vermelha de poá |
| 🧙 bruxinho | chapéu pontudo torto, fivela e estrela | túnica de manga larga com a saia que anda, gola de pontas, lua bordada | meia listrada roxa e verde | botinha de bico que enrola | a vassoura na mão esquerda | a capa de estrelinhas |


Doce ou travessura, a fantasia vem do mesmo jeito: as duas escolhas são
boas. O que muda entre elas são as **balas** (§5.3).

E o **prêmio do final** (§7): uma peça especial (proposta: a **coroa de
abóbora** do "rei e rainha da festa", ou o que combinar com o final escolhido).

### 5.3 As balas na cesta de abóbora

**Decisão do Renan: a cesta junta balas, e a Casinha da Abóbora só abre com
uma certa quantidade.** Os números abaixo foram aprovados **assim mesmo**, e
estão construídos (a parte 5a, `eventos/halloween/caca.ts`):

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

O número fica num canto da tela durante a festa (🎃🍬 18/25, dando um
pulinho quando sobe, e laranja quando passa de 25), com o som das balas
caindo na cesta. *(Ainda não construído: a cesta na mão **enchendo de
verdade**, as balas coloridas subindo dentro dela.)* Cada personagem dá a **sua** bala (o pirulito de olho do
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

**Construída (a parte 5a)**: `eventos/halloween/caca.ts`. Na conversa com
zoom de cada convidado (`naFesta.ts`), quando é a vez dele, quem joga diz
"Doces ou travessuras! 🎃" e ele pergunta de volta:

- **🍬 Doces!** — ele dá a bala dele (**3 balas** na cesta) e a pista;
- **🎃 Travessura!** — ele apronta uma brincadeira fofa, e as balas
  dependem de como foi (**1 a 5**, §5.3); a pista vem do mesmo jeito.

**As travessuras são de dois tipos.** A **hora certa** (`g.horaCerta`): a
fala fica na caixa de sempre, e embaixo dela uma barra com uma faixa laranja
e uma agulha que vai e volta; quem joga aperta E (ou toca) para parar — no
meio da faixa são 5 balas, longe dela 1 (o Jean-Luc é tudo ou nada: ganhou o
ponto, 5; perdeu, 1). E a **pergunta**, com uma resposta de cada valor (o
Gatito, a Josefina e o Noel). Quem pegou a travessura boa comemora do jeito
dele (a dancinha do Mano, o six seven do Gatito, a torcida das coelhinhas…).

**A pista** é um versinho que aponta o próximo sem dizer o nome, e vai para
o **mapinha**: o pergaminho mostra quem já foi achado com um tique, a pista
da próxima parada por extenso (marcada de laranja) e as que faltam com "? ? ?";
a última parada dá a **pista do final** num quadrinho embaixo. A próxima
parada também fica marcada no parque com **uma abóbora acesa flutuando em
cima da cabeça** de quem é — ninguém fica perdido. Quem chega antes da vez
ouve uma fala pedindo para seguir o mapinha. O save guarda as paradas
feitas, as balas, e quantos doces e quantas travessuras.

**A ordem nova (aprovada pelo Renan)** e as pistas reescritas (rascunho, o
Renan troca):

| # | quem | onde | a bala | a travessura (e as balas) | 🎁 | a pista que ele dá (para a próxima) |
|---|---|---|---|---|---|---|
| 1 | Mano | sorveteria | bala de abóbora | o granulado de morcego voando: pegar no ar na hora certa | — | "Quem vende o bilhete para ver tudo lá de cima, de lençol na cabeça, e nunca coube na cabine?" |
| 2 | Cookie | bilheteria | o docinho minúsculo (o favorito dele) | ele dá um BU e a dupla dá um BU de volta na hora — e quem se assusta é ele | 🎃 abóbora | "No campinho, um lobo de pelúcia uiva de alegria. É só seguir o AUUU!" |
| 3 | Flynn | campinho | bala de goma de lua | um passe de frisbee no escuro: pegar na hora certa | — | "No lago, um fantasma de cartola e máscara canta em francês para os patinhos." |
| 4 | Jean-Luc | lago | pirulito de olho | um ponto de ping pong: ganhou, 5 balas; perdeu, 1 | 🏴‍☠️ pirata | "Do lado do trapiche, um tubarão de feltro guarda uma bacia de maçãs." |
| 5 | Capy | beira do lago | maçã do amor pequenininha | pescar maçã com a boca na bacia, mergulhando na hora certa | — | "Uma coruja, uma catrina e uma fadinha fazem piquenique pertinho da roda." |
| 6 | Luna, Sol e Estrella | piquenique | pipoca de caramelo | "uno, dos, tres… ¡YA!": pular junto com elas na hora | 🐈‍⬛ gato preto | "Bem do lado da toalha, um gato vestido de cachorro diz 'au' sem convicção." |
| 7 | Gatito | piquenique | biscoito de gato preto | "como se diz *bruja* em português?" (bruxa: 5; bruja ou vassoura: 2) | — | "Um dragãozinho bem calmo cuida de abóboras no gramado." |
| 8 | Josefina | canteiro de abóboras | bombom de bolo de abóbora | a história do fantasma que só tomava sorvete: o sabor? (BUnilha: 5; suspiro: 4; pé de moleque: 3) | 🌾 espantalho | "A noiva mais alta da festa espera no ponto de ônibus — de véu e tudo." |
| 9 | Gina | ponto de ônibus | bala de goma de aranha | no apito, todo mundo congela na pose de fantasma | — | "Um cientista que não para quieto mexe poções do lado da roda gigante." |
| 10 | Noel | carrinho de poções | bala-poção que muda de cor | o ingrediente da poção (pó de estrela: 5; gosma verde: 4; asa de morcego: 3) | 🧙 bruxinho | a pista do final: "Atrás da roda, onde a cerca fecha o mato, uma porta laranja só abre para quem trouxe a cesta cheia." |

A primeira pista é a da Estella, no mapinha desde a boutique: "Comecem por
quem serve gelado de casaca e não tem medo de frio." Depois da do final, a
dupla faz a conta da porta: com 25 balas ou mais, "a cesta tá cheia"; com
menos, quantas faltam — e se não tem mais abóbora escondida pelo parque.

**As dez abóboras escondidas** (1 bala cada, §5.3): pequenas e acesas, nos
cantos do parque, longe do caminho da caça (os pontos foram medidos contra
o colisor e as árvores). Só aparecem na noite da festa, depois do ônibus;
"Pegar a abóbora escondida" dá a bala, e ela some de vez (o save lembra).

O **Walter** e o **Pelusa** não são paradas: o Walter está no final (é ele
quem serve as balas na festa), e o Pelusa dorme no pufe da boutique.

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
| **3** ✅ | **o presente da Estella** *(construída, escondida)* | a boutique decorada, a Estella de aranha e as falas dela, o Pelusa morceguinho dormindo no pufe, **o vampiro e o morceguinho** (§5.1, com o capricho do §5.4), as duas caixas, o provador, a cesta de abóbora e o mapinha (§2.3) | `roupa`, `bicho`, `prop` + `geometry`, `textures`, `animation` |
| **4** ✅ | **a noite e o ônibus** *(construída, escondida)* | o parque à noite com as luzes acesas (§4), as fantasias dos personagens (§3), o ônibus do clube chegando com o clube e a escola (§2.4) | `cenario`, `bicho` + `lighting`, `shaders`, `animation` |
| **5** ✅ | **doces ou travessuras** *(construída, escondida)* | **5a**: as dez paradas (§6), as balas na cesta e as abóboras escondidas (§5.3); **5b**: as outras cinco fantasias (§5.2) | `cenario`, `roupa` + `geometry`, `textures`, `interaction`, `animation` |
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

### A etapa 3 está fechada (e construída)

Respondidas (§2.3.1): o mezanino enfeitado também, com bexigas de caveira;
a aranha do jeito dela; sem topete, cada um com o próprio cabelo; a caixa só
abre, e o que tem dentro é surpresa até sair do provador; cada um leva a
sua caixinha e sai inteiro vestido, e as fantasias ficam para sempre; o
mapinha entra; a loja só funciona depois da cutscene; o Pelusa no pufe
vinho, sem fala sobre ele.

### A etapa 4 está fechada (as partes A, B, C e D construídas)

Respondidas (§2.4.1): a câmera vai ao ônibus e cada um desce falando; o
Mano de vampiro com o Ari, com fala própria; uma fantasia única para cada
personagem (o plano novo no §3, o Cookie de lençol); a roda, o sorvete e a
patinação voltam de noite, e o Gatito vem de fantasia engraçada; todos vêm,
destravados ou não; o Walter fica na barraquinha e vai lá atrás da roda de
vez em quando (a dica do final); e as luzes inteiras.

### Para as próximas partes

1. **Quando aparece**: só de 15/10 a 2/11 pelo calendário, depois "Reviver a
   festa" — ou o ano todo?
2. **As falas e as pistas da caça** (§6) são rascunho: o Renan troca o que
   quiser.

**Respondidas na etapa 5:** as balas ficam **assim mesmo** (3 no doce, 1 a
5 na travessura, 10 abóboras escondidas, a porta com 25); quem dá qual
fantasia é a **proposta nova** (§5.2: o Cookie, o Jean-Luc, as coelhinhas, a
Josefina e o Noel, com a ordem das paradas refeita no §6); as pistas podem
ser **reescritas** (as do §6); e a etapa 5 vai em duas partes — **5a, as
paradas primeiro**, e depois a 5b, as fantasias.

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
