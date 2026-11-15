# A Kombi de sorvete do Mano

## COMECE AQUI

**O pedido** (Renan, 2026-11-15): "Faça a kombi de sorvete! deixe bem
detalhada, bonita e fofa." Era a ideia escolhida da lista de carros do Mano:

- a Kombi creme e chocolate, com a casquinha gigante de três bolas no teto e a
  neve escorrendo do teto;
- a musiquinha de sorveteiro;
- o ar gelado do freezer, que embaça o para-brisa do Bebito por uns segundos;
- e, parados lado a lado, ele passa duas casquinhas pela janela, que vão para a
  mochila.

**O estado:** feita e no jogo, atrás da chave do Bebito Mobile como toda a
viagem. É o segundo veículo dos personagens do PARQUE, depois da lambreta da
Estella (`docs/LAMBRETA-DA-ESTELLA.md`). O Mano passou a morar no parque
(`MORADORES` em `eventos/bebitoMobile/rota.ts`): aparece nas rotas que vão ao
parque (ou que saem dele para a casa ou a escola) junto com a Estella, sorteado
por igual.

## A Kombi (`world/kombiDoMano.ts`)

As medidas moram em `KOMBI` (base em `y = 0`, frente em `+Z`, o lado da janela
de venda em `−X`, que é o lado do Bebito no encontro).

- **A carroceria em duas cores**, como Kombi antiga: a saia de CHOCOLATE COM
  GRANULADO (textura de canvas, o granulado colorido salpicado), a parte de
  cima CREME, e o V creme descendo no nariz.
- **A cara**: os faróis redondos são os olhos, o blush rosa embaixo deles, o
  emblema da casquinha no meio, o para-choque cromado e a placa "MANO".
- **O para-brisa dividido** com a barra do meio, os limpadores, o painel, o
  banco rosa, o volante e uma casquinha pequena de enfeite no painel.
- **O lado da janela de venda** (−X): a janela grande com o interior pintado,
  o toldo listrado rosa e creme com franja, a bancada com as duas casquinhas, o
  pote de granulado e o sininho, e a grade do freezer com o floco de neve. A
  janela ABRE quando ele para para conversar (o toldo sobe e a bancada desce).
- **O outro lado** (+X): as janelinhas de passageiro.
- **A traseira**: as grelhas do motor e as lanternas.
- **O teto**: a NEVE escorrendo (uma capa e as gotas num lote,
  `InstancedMesh`) e a CASQUINHA DE TRÊS BOLAS (chocolate, morango e creme,
  com a cereja) num suporte cromado, girando devagar.
- **As rodas** de faixa branca.
- **O Mano ao volante**: pose `dirigindo` (as asas no volante, mexendo), em pé
  no lado do Bebito, com a cabeça no meio do para-brisa. O chapéu de casquinha
  não cabe na cabine (são 45 cm acima da cabeça): ao volante ele vai de QUEPE
  DE PAPEL de sorveteiro, creme com a faixa rosa e o emblema (`mostrarChapeu`
  e `apoioDoChapeu` no `Mano.ts`).

Medido: 96 malhas e ~36 mil triângulos (com o Mano). 2,57 m de largura com os
retrovisores, 4,59 m de altura até a cereja.

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

1. **A chegada**: no lugar da buzina, toca a `musiquinhaDoSorvete` (uma frase
   de caixinha de música na pentatônica de sol, 14 notas) e o aviso "Uma
   musiquinha de sorveteiro chegando… é o Mano de Kombi!".
2. **O sopro**: quando a Kombi passa do lado do Bebito, sai um sopro de flocos
   de neve da grade do freezer, em redemoinho, até o para-brisa
   (`eventos/bebitoMobile/geadaNoParaBrisa.ts`).
3. **A geada**: o para-brisa EMBAÇA de coluna a coluna (uma camada de geada
   com cristais de samambaia, assentada na curva do vidro pela mesma conta do
   pano da Estella, `naPele`), e quem vai de carona diz "Brrr! O Mano embaçou
   nosso para-brisa!". Fica uns 2 s e desembaça aos poucos (soprando 1,1 s,
   embaçado 2,2 s, desembaçando 2,8 s).
4. **A conversa** (falas minhas, provisórias, esperando as do Renan):
   - Mano: "Bebitooos! Sentiram o friozinho? É o ar do freezer, sai de presente!"
   - quem vai de carona: "Mano, você embaçou nosso para-brisa inteirinho!"
   - Mano: "Desembaça rapidinho, prometo! Pra compensar… uma casquinha pra cada um!"
   - as duas casquinhas saem da bancada e vão para a MOCHILA: a de morango
     para o Ari e a de maracujá para o Renan ("Uma casquinha de morango pro Ari
     e uma de maracujá pro Renan, na mochila!", ou o aviso de mochila cheia);
   - Mano: "E a dancinha de despedida, que sorvete sem dancinha não vale!" — e
     ele dança.
5. **A saída**: a musiquinha toca de novo, "E lá vai a Kombi, tocando a
   musiquinha até sumir."
6. **A memória** "A Kombi gelada" (`mano-na-estrada`).

## O que foi testado (2026-11-15)

- `kombi.mjs` inteiro: o modelo (nada abaixo do chão, a largura na faixa, as
  fotos de todos os lados, o Mano ao volante, a janela aberta e as casquinhas
  na bancada) e a estrada (a geada passando pelos quatro momentos, a
  musiquinha na chegada e na saída, a conversa, a dancinha, as duas casquinhas
  no save de teste, a memória e o save de verdade intacto).
- `musica.mjs`: a musiquinha sem estalo no começo, ~0,06 de pico por nota.
- `casaClube.mjs` inteiro (o Mano entrou na contagem por igual), `mano.mjs`,
  `lambreta.mjs`, `viagemEscola.mjs SO=ida` e `viagem.mjs SO=bom` (duas vezes).
  O `SO=bom` pegou um defeito do PILOTO AUTOMÁTICO, que o Mano só revelou: com
  ele na rota 3, o piloto caía no terceiro buraco da fileira. Ele escolhia uma
  posição livre e, para chegar lá, arrastava a roda por cima de um buraco logo à
  frente; cair ou não dependia do quadro. Agora, com um buraco a menos de 6 m, ele
  não cruza (`viagemDeCarro.ts`, os buracos do `piloto`). Vale também para o
  piloto de jogo, o da visão do passageiro.
- Peso na conversa com a Kombi: ~500 desenhos e ~345 mil triângulos (com a
  lambreta, ~590 desenhos e ~350 mil).
- O z-fighting: as peças da Kombi são de perfil extrudado, esfera, toro e
  cilindro, e o `zfighting.mjs` só mede caixa reta.

## Ideias que ficam para depois

- **A Kombi estacionada no Villa Lobos** depois do primeiro encontro, como a
  lambreta (com a janela aberta vendendo?).
- **Os outros do parque**: o Cookie e o Jean-Luc.

## Validar

```bash
node scripts/kombi.mjs /tmp/km        # o modelo parado no parque (?kombi=x,z,giro[&conversando]) e o encontro na estrada; SO=modelo|estrada
```
