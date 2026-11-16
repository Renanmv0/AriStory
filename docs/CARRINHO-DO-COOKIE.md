# O carrinho do Cookie

## COMECE AQUI

**O pedido** (Renan, 2026-11-16): "Faça o carro do Cookie pequenininho e fofo,
com as orelhas para fora, faça a interação e o carrinho dele no estacionamento
depois do primeiro encontro. (…) faça algo bem feito e detalhado e divertido."
Era a primeira ideia da lista de carros do Cookie: o maior bicho do jogo no
menor carro da estrada.

**O estado:** feito e no jogo, atrás da chave do Bebito Mobile como toda a
viagem. É o terceiro veículo dos personagens do PARQUE, depois da lambreta da
Estella (`docs/LAMBRETA-DA-ESTELLA.md`) e da Kombi do Mano
(`docs/KOMBI-DO-MANO.md`). O Cookie passou a morar no parque na regra de quem
aparece (`MORADORES`, em `eventos/bebitoMobile/rota.ts`): nas rotas do parque,
um dos três, sorteado por igual.

## O carrinho (`world/carrinhoDoCookie.ts`)

Um microcarro conversível em forma de BOLHA, rosa-bebê, de 2,7 m (o Bebito tem
mais de 4). As medidas moram em `CARRINHO`; a base em `y = 0`, a frente no
`+Z`, o lado do Bebito é o `−X`.

- **A lataria é uma pele de fatias** (o molde do Bebito Mobile, miúdo): a
  planta é uma superelipse, a tampa de cima é o perfil de lado, e cada fatia
  sobe da soleira, engorda até a cintura, fecha no ombro e deita na tampa. Onde
  tem cabine, a tampa para na beira do buraco; onde tem roda, a soleira sobe
  pelo arco. Por dentro, o forro creme (dá grossura à porta), o debrum na beira
  da cabine, o fundo e as caixas de roda (que acompanham a planta).
- **A cara**: os faróis de sapinho no ombro do capô (a cúpula, o aro cromado, a
  lente acesa, o brilho e a PÁLPEBRA caída, o olhar manso do dono), o blush, o
  sorriso cromado dando a volta no nariz, o para-choque com as garras e a placa
  "COOKIE".
- **O para-brisa de bolha, com o FURO DA TROMBA**: um anel gordo de borracha no
  meio do vidro, com filete cromado. O carrinho foi adaptado para ele. Vazio,
  no estacionamento, o furo fica lá, sem explicação — até ele passar dirigindo.
- **As portas**: o corte, a maçaneta, o friso na cintura, a almofadinha em cima
  de cada porta (onde a orelha pousa) e um adesivo assentado na curva da lata —
  a RODA GIGANTE com um coração do lado do Bebito (o sonho dele) e o "ELEFANTE
  A BORDO", amarelo de aviso, do outro.
- **A cestinha de docinhos** pendurada na porta do lado do Bebito.
- **No capô**, a CORNETA de latão com a pera de borracha, que a ponta da tromba
  aperta.
- **Atrás**: a capota enrolada (com ele dentro, ela nem fecha), as lanternas
  redondas, o escapamento, o CATAVENTO nas cores da bilheteria (gira com o
  vento) e a CHAVE DE CORDA (o carrinho é quase de brinquedo; gira enquanto
  anda).
- **As rodinhas** de faixa branca, com a calota de BISCOITO com gotas de
  chocolate (o nome dele).

### O Cookie lá dentro (`PoseNoCarrinho`, em `entities/bichos/Cookie.ts`)

Ele vai do tamanho de sempre (o tamanho é a história dele), com a barriga no
piso e ESPREMIDO:

- as **patas somem** dentro da lataria;
- as **orelhas abrem para fora**, por cima das portas, com a ponta caindo; na
  estrada o vento as leva para trás e elas tremulam, cada uma no seu tempo.
  Elas ESTICAM no comprimento (1,7×): no tamanho de sempre a ponta parava em
  cima da porta, e de cima não saía do carro. Medido: passam 23 cm da lataria,
  de cada lado;
- a **tromba sai pelo furo do para-brisa** e deita no capô, com a pontinha
  enrolada para cima na frente do nariz. Para estender a caixinha, ela levanta
  e vai para o lado do Bebito;
- o lombo, a manta e o quepe aparecem por cima; a cabeça vira um pouco para
  quem parou do lado.

A pose mora DENTRO do `animar` dele (um campo que nasce desligado,
`noCarrinho`): o `animar` reescreve as orelhas e a tromba a cada quadro, e o
que o veículo mexesse por fora seria desfeito.

### A mola

Com ele dentro, a traseira AFUNDA (o nariz sobe), as rodas abrem com o peso
(mais as de trás) e a lataria quica na estrada. Quando ele para para
conversar, o carrinho TOMBA para o lado do Bebito (uma mola que passa do ponto
e volta). Vazio, no estacionamento, ele fica nivelado, de rodinha em pé.

Medido: 108 malhas e ~37 mil triângulos com o Cookie (ele é articulado, e não
se junta); 2,7 × 1,7 m de lataria, 1,94 m até o alto do quepe.

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

1. **A chegada**: "Um carrinho cor-de-rosa com duas orelhas pra fora… é o
   Cookie!", e a CORNETA no lugar da buzina (`cornetaDoCookie`: "fon-FON", duas
   notas de pera de borracha) — a tromba aperta a pera.
2. **A ultrapassagem**: as orelhas no vento, o catavento e a chave de corda
   girando, a fumacinha do escapamento ("puf, puf", do esforço).
3. **A conversa** (falas minhas, provisórias, esperando as do Renan), com a
   câmera mais perto que a dos outros (o carrinho é miúdo):
   - Cookie: "Oi, bebitos… Não se assustem, sou só eu. E o meu carrinho."
   - quem vai de carona: "Cookie! Como é que você coube aí dentro?!"
   - Cookie: "Cabendo. As orelhas vão pra fora, a tromba sai pelo furinho… Só
     não posso suspirar, que a porta abre."
   - (ele estende a CAIXINHA de docinhos com a tromba) Cookie: "Eu trouxe uma
     coisa pra vocês. É pequenininha, que é o melhor tamanho que existe."
   - os dois BRIGADEIRINHOS saem da caixinha e voam num arco até a janela do
     Bebito; um para cada um, na mochila (`ITENS.docinhoDoCookie`, de comer), e
     sobem coraçõezinhos: "Um brigadeirinho do Cookie pra cada um, na
     mochila!" (ou o aviso de mochila cheia, ou o de quem ainda tem o de antes);
   - Cookie: "Agora eu vou devagarinho. Na lombada eu até prendo a respiração."
4. **A saída**: a corneta de novo, e "O carrinho foi embora quicando, com as
   orelhas dando tchau."
5. **A memória** "O carrinho que serve certinho" (`cookie-na-estrada`).

**Um Cookie só por viagem**: o parque já tinha o Cookie na calçada soprando
bolhas (`bolhasDoCookie`, em 35% das rotas do parque). Na viagem em que ele vem
de carrinho, as bolhas não aparecem (`decorarCaminhoDoParque`); o teste confere
em 2400 rotas.

## Estacionado no Villa Lobos (`eventos/bebitoMobile/noParque.ts`)

Depois da memória do encontro, o carrinho fica no estacionamento
(`CARRINHO_NO_PARQUE`): na vaga do OUTRO lado da passagem de pedestres (de
−0,75 a 2), de ré como a Kombi, com a carinha para o corredor (é de lá que a
câmera olha). Vazio — o dono está na bilheteria da roda —, nivelado, com o
banco rosa, a almofadinha de coração e a cestinha na porta. Ele é tão pequeno
que sobra vaga dos dois lados. A fila agora é: carrinho, passagem, Bebito,
lambreta, Kombi.

## O que foi testado (2026-11-16)

- `carrinho.mjs` inteiro: o modelo (nada abaixo do chão, pequenininho, as
  orelhas para fora medidas, as patas escondidas, fotos de todos os lados, da
  câmera do encontro, andando, oferecendo e vazio), o estacionamento (só
  depois da memória, a passagem livre) e a estrada (a corneta na chegada e na
  saída, a caixinha, os docinhos voando, os dois no save de teste, a memória, o
  save de verdade intacto, sem bolhas na mesma viagem).
- O brigadeirinho na mão (foto de perto) e comido: sai da mochila.
- `musica.mjs`: a corneta sem estalo.
- Regressão: `cookie.mjs` (o Cookie da bilheteria não muda: fora do carrinho a
  pose não toca em nada dele), `kombi.mjs`, `lambreta.mjs` (o pano passou a
  procurar a semente da Estella, que mudou com o terceiro morador),
  `casaClube.mjs` inteiro, `itens.mjs`, `parque.mjs`, `viagemEscola.mjs SO=ida`
  e `viagem.mjs SO=bom` na rota 3 (o Mano) e na 5 (o Cookie), as duas sem
  tropeço nem susto.
- **O peso**: na conversa da estrada, 512 desenhos e ~346 mil triângulos (com
  a Kombi, 485 e ~343 mil). No estacionamento, com os três veículos dos
  vizinhos: 346 → 365 desenhos e ~260 → ~290 mil triângulos com o carrinho.
- As peças do carrinho são de pele, esfera, toro e tubo: o `zfighting.mjs` só
  mede caixa reta. Os adesivos ficam 8 mm fora da lata, assentados na curva.

## Ideias que ficam para depois

- **O Cookie entrando e saindo**: ele indo da bilheteria até o carrinho, e a
  mola afundando quando ele senta.
- **O Jean-Luc**, o que falta do parque, e os carros da turma da escola.

## Validar

```bash
node scripts/carrinho.mjs /tmp/cc     # o modelo (?carrinho=x,z,giro[&conversando][&oferecendo][&andando=7][&vazio]), ESTACIONADO depois do encontro e o encontro na estrada; SO=modelo|parque|estrada
SO=rotas node scripts/casaClube.mjs   # quem aparece em cada rota (sem navegador)
```
