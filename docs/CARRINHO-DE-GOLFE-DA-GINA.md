# O carrinho de golfe da Gina

## COMECE AQUI

**O pedido** (Renan, 2026-11-17): "vamos criar o [carro] da Gina", e da lista de
ideias ele escolheu o **carrinho de golfe do clube** e a interação da
**carteirinha com o adesivo** — "SÓCIO DO CLUBE" colado de vez no vidro do
Bebito.

**O estado:** feito e no jogo, atrás da chave do Bebito Mobile como toda a
viagem. É o quinto veículo dos moradores do CLUBE (o Noel, a Josefina, o Capy e
o Walter já tinham o deles; o Renan gosta dos carros do Noel e da Josefina como
estão). A Gina passou a morar no clube na regra de quem aparece (`MORADORES`,
em `eventos/bebitoMobile/rota.ts`): nas rotas do clube, um dos cinco, por igual.

## O carrinho (`world/carrinhoDeGolfeDaGina.ts`)

As medidas moram em `CARRINHO_DE_GOLFE`; a base em `y = 0`, a frente no `+Z`, o
lado do Bebito é o `−X`.

- **Creme e verde**, as cores da guarita do clube: o nariz é o perfil de lado
  extrudado com bisel (com o arco da roda da frente recortado), a faixa verde
  dando a volta, a caixa debaixo do banco, os para-lamas de trás em meio cano,
  os estribos e os para-choques de borracha.
- **A cara**: os faróis redondos com TRÊS CÍLIOS cada, como os da Gina; o
  escudo do clube no nariz (a girafinha de quepe); a placa "PORTARIA".
- **O toldo listrado** verde e creme, com o lambrequim recortado no vermelho do
  telhado da guarita, e o **RECORTE**: uma meia-elipse aberta na beira do lado
  do Bebito, com a gola de lona, por onde o pescoço sai. Primeiro foi um furo
  no meio do toldo; fechado, o pescoço não tinha por onde descer até a janela.
- **O giroflex** laranja em cima do toldo (atrás: na frente, ficava na cara
  dela), girando sempre — é carro de serviço.
- **O painel**: o volante, o rádio comunicador com a antena, a garrafa térmica
  de café do porteiro e a **prancheta com a lista de sócios** (os dois nomes já
  ticados).
- **Atrás**: a grade com os dois cones e a cancelinha dobrável listrada.
- **As rodas** miúdas de calota creme.

### A Gina no carrinho (`PoseDaGinaNoCarrinho`, em `entities/bichos/Gina.ts`)

Ela vai do tamanho de sempre, deitada no banco comprido (um tico para o lado do
Bebito), as pernas sumidas embaixo do corpo, e o pescoço sai pelo recorte do
toldo, com a cabeça e o quepe lá em cima.

- **Esticar até a janela** (`esticarAteAJanela`): o gomo de baixo DEITA o
  pescoço para o lado, por baixo do toldo e pelo recorte, e os outros descem de
  leve — a cabeça sai pela lateral aberta do carrinho, na altura da janela do
  Bebito, com o **carimbo** na boca. A cabeça usa a ordem de giro `ZYX` só ali
  (levanta o nariz, vira para a janela e desfaz o tombo do pescoço).
- A pose mora DENTRO do `animar` dela, num campo que nasce desligado
  (`noCarrinho`), com toda escrita dentro do `if`: a Gina da guarita não muda.

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

1. **A chegada**: "Um apito, um giroflex e um pescoço saindo pelo toldo… é a
   Gina de carrinho de golfe!", e o APITO dela no lugar da buzina.
2. **A parada**: o carrinho para um tico À FRENTE do Bebito e ENCOSTA nele
   devagar (sai da faixa dele até perto da do Bebito), para o pescoço alcançar
   o para-brisa; antes de ir embora, ele se afasta.
3. **A conversa** (falas minhas, provisórias, esperando as do Renan):
   - Gina: "Priii! Encosta aí, bebitos. Fiscalização do clube!"
   - quem vai de carona: "Gina?! Fiscalização na estrada?"
   - Gina: "Na estrada não tem guarita, então eu trouxe a portaria comigo. Carteirinha, por favor."
   - quem vai de carona: "Carteirinha? A gente nunca teve carteirinha…"
   - Gina: "Agora vai ter."
   - (o pescoço até o para-brisa, o CARIMBO — `carimbo`: o "tum" da borracha e
     um plim de aprovado —, o selo colado e os coraçõezinhos) "O selo de SÓCIO
     DO CLUBE ficou colado no para-brisa do Bebito!"
   - Gina: "Pronto: sócios. Com o selo no vidro, a cancela do clube nem pergunta. Ordem da casa."
   - Gina: "Agora eu volto pra guarita, que portaria não fica sozinha muito tempo. Aproveitem o dia, viu?"
4. **Já sócios** (as viagens seguintes com ela): "A gente já é sócio, olha o
   selo no vidro!", ela confere com o pescoço até o vidro, e "Conferido. Selo
   em dia, cabelo seco: podem seguir." — sem carimbo novo.
5. **A saída**: o apito, e "Lá vai a Gina de volta pra guarita, apitando, com o
   pescoço acima de todo mundo."
6. **A memória** "A portaria sobre rodas" (`gina-na-estrada`).

A câmera, enquanto ela carimba, chega perto, de frente para o vão entre os dois
carros.

## O selo no Bebito (`world/bebitoMobile/`)

- A ficha ganhou a vaga **`paraBrisa`** (um lugar, adesivo): no canto de baixo
  do para-brisa, do lado do motorista — onde selo de clube vai de verdade, e o
  lado em que a Gina para. De fábrica ela vem vazia; o save antigo, sem a vaga,
  recebe a de fábrica (`normalizarFicha`).
- O selo (`selo-socio-do-clube`, `impressos.ts`): o verde da guarita, a
  girafinha de quepe, "SÓCIO DO CLUBE" e o carimbo vermelho "APROVADO" torto
  por cima.
- O ponto sai do `porCima` da pele (o vidro é a superfície de cima entre o teto
  e o capô); o `naPonta`, que procura a cara em pé, punha o selo no capô.
- **Colado na hora** (`colarAdesivo`): gravar a ficha não remonta o carro da
  cena, então a cena cola a plaquinha no encaixe na hora do carimbo. Nas
  viagens seguintes, o carro já nasce com ele, da ficha.

## Estacionado no clube (`eventos/bebitoMobile/noClube.ts`)

Depois da memória do encontro, o carrinho fica no lote do clube, na vaga livre
da fileira da Josefina (`x = −46,2`, `z = −1`), vazio (a dona está na guarita),
com o quepe reserva esquecido no banco. A cobertura do lote fica nas vagas do
fundo, e o toldo dele não caberia embaixo dela.

## O que foi testado

(preenchido depois da validação)

## Ideias que ficam para depois

- **Por baixo do semáforo**: ela abaixando o pescoço para passar por baixo do
  braço do semáforo na estrada.
- **A cancela do clube** reconhecendo o selo na chegada (hoje ela abre igual).

## Validar

```bash
npm run build && npx vite preview --port 4177 &
node scripts/carrinhoDeGolfe.mjs /tmp/gf   # SO=modelo|parque|estrada; CEL=1 a estrada no celular em pé
node scripts/guarita.mjs /tmp/gu           # a Gina da guarita, sem mudança
SO=ficha node scripts/bebitoMobile.mjs /tmp/bm  # a vaga nova na ficha
```
