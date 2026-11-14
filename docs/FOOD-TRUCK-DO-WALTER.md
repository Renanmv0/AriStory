# O food truck do Walter

Pedido do Renan (2026-11-13): "um modelo detalhado, bonito e grande, para o food
truck do Walter, todo estilizado e fofo", e cruzar com ele na estrada indo para o
clube. Decisões do Renan: vende **cachorro-quente** (a mesma identidade da
barraquinha do Halloween), **o Walter não fala — só late, em "au" de jeitos
diferentes**, **toda viagem tem um encontro na pista** (25% para cada um: Noel,
Josefina, Capy e Walter) e, depois do primeiro encontro, ele **fica estacionado
no clube**, como a moto do Capy.

## O modelo (`src/world/foodTruckDoWalter.ts`)

- **A silhueta** é a van de entrega antiga, de nariz redondo e caixa alta: o perfil
  de lado extrudado com bisel (o molde do ônibus da cidade), em duas peças — a
  saia vermelha com as caixas de roda e a caixa creme —, com o friso mostarda no
  vinco e três costelas de lata na saia. 5,5 × 2,24 m, 2,8 de teto (3,6 com o
  gigante).
- **A cabine é um recorte no perfil**: as janelas dos lados ficam abertas (o
  Walter, a 1,75×, dirige com o focinho perto do para-brisa) e o para-brisa é
  um vidro entre duas colunas. Painel, banco, volante e retrovisores redondos.
- **A janela de venda** fica no lado `−X` (o lado que dá para o Bebito e o que a
  câmera do encontro vê). Andando, o toldo está fechado com o painel pintado
  "Cachorro-quente do Walter" (o da barraquinha); parado para conversar, ele sobe
  listrado, com a franja de meias-luas sempre pendendo de pé (grupo que gira ao
  contrário), e a bancada desce com dois cachorros-quentes prontos, as bisnagas,
  o porta-guardanapo e o sininho. O interior é PINTADO em canvas (azulejo, chapa
  com as salsichas e o vapor, pães na prateleira, a lousa do cardápio, a lâmpada
  e o cartaz "Quentinho!").
- **A carinha**: o cachorro-quente gigante do teto sorri (os olhos, o brilho, as
  bochechas e o sorriso colados na casca da ponta da salsicha, pela normal), e a
  frente faz outra com os faróis redondos acesos de leve e a grade de cromo. O
  ossinho mostarda no capô, a placa "WALTER", luzinhas coloridas na beira do teto,
  escadinha, lanternas redondas e a pata pintada na porta de trás.
- **Rodas** de faixa branca e calota creme de miolo vermelho, que giram pela
  distância. `estacionado = true` monta a versão vazia (sem o Walter, toldo
  fechado, bancada vazia) e fundida como fundo, para a vaga.

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

O mesmo roteiro dos outros: o truck passa pela esquerda, freia adiante e para do
lado do Bebito. Na conversa, o Walter vira para a janela do lado do Bebito (o
focinho sai pela janela) e a janela de venda abre. **Ele só late** (cada fala dele
é "au" de um jeito, com o som do latido); quem está de carona entende o recado.
As falas da carona são provisórias, do Claude (a do Renan entra literal):

- toast: "Cheirinho de cachorro-quente no retrovisor… é o Walter!"
- Walter: "Au! Au au! Auuu!"
- carona: "Walter?! Um food truck de cachorro-quente? E o Mania?"
- Walter: "Au au… Au! Au, au au!"
- carona: "Acho que de dia é churrasco e de tarde é cachorro-quente. Ele não
  desliga a bandeja nunca."
- Walter: "Auuuu! Au! 🐾"
- saída: "Garçom de verdade não desliga a bandeja."

A memória é `walter-na-estrada` ("Cachorro-quente sobre rodas"); com ela, o truck
aparece na vaga `x = −70,2, z = −1` do estacionamento do clube (a frente sobre o
batente).

## O sorteio

TODA viagem tem encontro (o Renan: "não quero que tenha chance de não cruzar com
ninguém, sempre deve ter um encontro na pista"). `sortearEncontro` (`rota.ts`)
dá 25% a cada um, em faixas que vieram em camadas para as sementes antigas não
trocarem de personagem: Noel até 0,2, Walter de 0,2 a 0,3, Josefina de 0,3 a
0,5, Walter de 0,5 a 0,6, Capy de 0,6 a 0,8, e o pedaço que era "sem encontro"
(0,8 a 1) repartido em quatro de 5% (Noel, Josefina, Capy, Walter). Só as
sementes que não tinham encontro ganharam um. Das usadas nos testes, mudaram
`ida,…,1` (era Noel), `ida,…,3` e `clube-casa,…,1` (eram Josefina), que agora são
o Walter, e `ida,…,6` e `ida,…,7`, que não tinham encontro. O teste do carro
distraído (`viagem.mjs`, `SO=distraido`) agora tira o encontro de cena antes de
começar, porque ele mede a faixa de pedestres.

## Validação

`SO=encontros node scripts/casaClube.mjs` (o encontro do Walter de ponta a ponta,
a largura do truck aberto na faixa) e as fotos de perto (andando, aberto, janela,
frente, trás, de cima, o gigante e a vaga).

## O peso

O truck tem ~24 mil triângulos e 27 malhas sem o Walter (60 antes da
`juntarPorCor` na lataria, nas rodas e na bancada, com a mesma foto); o Walter,
articulado, soma 30. O toldo e a bancada são grupos com nome fundidos por dentro,
e continuam abrindo.
