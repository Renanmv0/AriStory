# O pátio da frente da Escola do Gatito

## COMECE AQUI

**O pedido** (Renan, 2026-11-14): "Eu quero fazer a rota do clube para a escola
do Gatito, que também será qualquer lugar para a escola do Gatito. Mas para
isso eu preciso de um estacionamento na escola. E antes do estacionamento eu
queria criar um cenário novo, que é o pátio da escola do lado de fora. […]
quero que seja como uma escola chique dos Estados Unidos, uma de filme assim
mesmo, com alguns bancos, algumas partes com grama, outras não, mas quero que
use as skills de three.js para deixar os modelos de tudo e da escola que será
grande! Então comece e vamos ajustando, mas quero uma área grande e bem feita."
Ele mandou uma foto de referência: prédio de tijolinho vermelho com a rotunda
octogonal no meio, a cúpula baixa de metal, a lanterninha branca no alto, o
arco da entrada com o letreiro, as alas de dois andares, o calçadão de
concreto, os gramados com os canteiros, os bancos bordô e três mastros.

**As etapas:**

| etapa | o quê | estado |
|---|---|---|
| **1** | o pátio da frente (o prédio por fora e o pátio), cena à parte | ✅ feita, **para o Renan olhar** (`?cena=escola-patio`) |
| **2** | ligar o pátio no jogo: o ônibus e o carro chegam na rua do pátio, a porta leva ao saguão e a porta da rua do saguão sai no pátio | ⬜ depois da aprovação das fotos |
| **3** | o estacionamento da escola (com a vaga do coração e a chegada animada) | ⬜ |
| **4** | as rotas de carro de qualquer lugar até a escola (`docs/VIAGEM-CLUBE.md`) | ⬜ |

**Hoje o pátio não está no caminho do jogo**: o ônibus (`villaLobos.ts`,
`clube.ts`) continua levando direto para o saguão (`goTo('escola', 'da-rua')`),
e a porta da rua do saguão continua sendo o ponto do ônibus
(`door:villa-lobos:clube`). A porta do pátio já leva ao saguão, e o pátio já
tem a entrada `do-saguao` para a volta.

## O que foi feito (etapa 1)

- **O prédio** (`world/escolaPorFora.ts`, `predioDaEscola()`): a rotunda de
  oito faces com o raio de 7,6 m, as duas alas de 33 m, dois andares de
  janelas e 21 m até a ponta do pináculo. A frente é `+Z` e a origem é o meio
  da rotunda. As medidas que a cena usa ficam em `PREDIO_DA_ESCOLA`.
  - **Paredes**: cada parede é um quadro com os furos de verdade, extrudado,
    em tijolinho vermelho (`P.escolaTijoloFora`) com o rejunte creme.
  - **Janelas**: caixilho branco de seis vidraças, recuado, com peitoril de
    pedra e lintel com pedra-chave. Os caixilhos e as pedras são dois lotes, e
    o vidro de tudo é uma malha só, com o reflexo pintado nos vértices.
  - **Molduras**: as pilastras, o plinto, a faixa entre os andares, a cornija
    com cavetinho e o capeamento. As da rotunda usam o novo
    `contornoPoligonal()` (`world/molduras.ts`), o `contorno()` para qualquer
    polígono.
  - **Rotunda**: óculos no friso e o portal saltado com o arco de verdade, a
    porta de vidro com a bandeira em leque, o letreiro "ESCOLA DO GATITO"
    gravado na pedra e as arandelas acesas.
  - **Cúpula e lanterninha**: a cúpula de oito gomos de metal com as costuras
    em pé, em lote. A lanterninha é aberta, com oito colunas e o sino da
    escola pendurado lá dentro.
  - **Telhado das alas**: a manta com a costura, as máquinas de ar e as
    clarabóias. A câmera olha de cima e vê o telhado tanto quanto a fachada.
- **O pátio** (`scenes/escolaPatio.ts`, peças em `world/patioDaEscola.ts`):
  - **Chão**: o calçadão de placas de concreto da porta até a rua, com a
    pracinha redonda do mastro do meio (o eixo da porta dá a volta na ilha) e
    a calçada que atravessa o pátio na frente do prédio. Do outro lado da
    calçada, a rua com a faixa de pedestres.
  - **Mastros**: três, com as bandeiras balançando (o pano é refeito a cada
    quadro).
  - **Canteiros**: os de casca de pinus com guia de concreto, no pé das alas,
    nas quinas da rotunda, em volta dos mastros e na ilha. Levam os arbustos
    aparados (bola e almofada, um lote para o pátio inteiro) e as hortênsias.
  - **Mobília**: dez bancos bordô (ferro e ripa) que dão para sentar, os
    postes, as árvores nos gramados das pontas e o bicicletário de tubo
    ondulado.
  - **Placas**: a placa de tijolo da entrada, com o painel dos Gatitos e o
    quadro de recados de letrinhas, e as plaquinhas no poste ("Devagar,
    Gatitos atravessando" e "Visitantes: passem na secretaria").
- **O peso**: no pior giro da câmera, 263 desenhos e ~148 mil triângulos
  (225 e ~133 mil no celular em pé). O prédio sai da `fundir()`, e o que é só
  fundo (guias, árvores) sai da `fundirComoFundo()`, um grupo de cada lado.

## O que é provisório (decidido por mim, para o Renan trocar)

1. **As bandeiras**: a dos Gatitos no mastro do meio e as do **Brasil** e da
   **Venezuela** dos lados (as duas casas dos dois; a paleta da escola já é o
   amarelo e o azul que as duas bandeiras dividem). Na foto, a do meio era a
   dos Estados Unidos.
2. **Os textos**: o letreiro do arco ("ESCOLA DO GATITO"), o painel da placa
   ("ESCOLA DO GATITO", "LAR DOS GATITOS"), o quadro de recados
   ("BEM-VINDOS, GATITOS!", "AULA DE PORTUGUÊS · SALA 1") e as plaquinhas.
3. **A chegada** (etapa 2): o ônibus e o carro param na rua da frente, e a
   dupla anda pelo calçadão até a porta. O estacionamento fica para a etapa 3,
   de um dos lados do pátio.
4. **Ninguém mora no pátio ainda.** Dá para pôr alguém depois (a Valentina
   desfilando, uma das coelhinhas, o Flynn de passagem).

## O que a câmera faz aqui (para o Renan saber antes de jogar)

- **Girando a câmera para trás do prédio** (3 dos 8 giros, quando ela vem do
  lado da escola), o prédio de 21 m tapa quem está na porta, na praça e na
  calçada que atravessa o pátio. É o ponto cego de qualquer prédio alto (a
  regra do jogo é não deixá-lo translúcido): nos outros 5 giros, e no de
  sempre, tudo aparece.
- **O enquadramento** é 18 (o de sempre lá fora é 14). Chegando pela
  calçada da rua, o prédio fica fora da tela até a dupla andar um pouco; as
  fotos de "cartão-postal" (a câmera na altura de quem chega, como a foto do
  Renan) são de uma câmera que o jogo ainda não tem. Para a etapa 2: uma
  tomada de chegada mostrando a escola, ou o zoom abrindo perto da rua.
- **O peso**: com a `fundir()`, a mesma vista cai de 746 para 267 desenhos
  por quadro, com a mesma imagem (com a câmera parada, só 0,17% dos pixels
  mudam, e são as bandeiras balançando).

## Perguntas ao Renan

- O prédio e o pátio estão no rumo? (tamanho, cor do tijolo, a cúpula, a lanterninha)
- As plaquinhas no poste ("Devagar, Gatitos atravessando" e "Visitantes: passem na secretaria") ficam? Estão lá porque a foto tem; a de "Bicicletas" saiu, como as outras de nome de lugar.
- A chegada: uma tomada mostrando a escola, ou o zoom abrindo perto da rua?
- As bandeiras: Gatitos, Brasil e Venezuela, ou outras?
- Os textos das placas e do quadro de recados.
- A chegada da etapa 2: na rua da frente, a pé até a porta?
- O estacionamento: de que lado do pátio (direita, esquerda, do outro lado da rua)?
- Alguém fica no pátio?

## Validar

```bash
node scripts/patio.mjs /tmp/pt    # o caminho até a porta, o prédio nos colisores, a porta, as bandeiras, as fotos e o peso; CEL=1 no celular
SEM_FUNDIR=1 SO=predio-da-escola,placa-da-escola,mastro,plaquinha-no-poste,bicicletario node scripts/zfighting.mjs
```
