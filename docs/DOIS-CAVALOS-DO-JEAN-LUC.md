# O 2CV do Jean-Luc

## COMECE AQUI

**O pedido** (Renan, 2026-11-16): "O Citroën 2CV, faça suas sugestões sobre ele
menos o carro molhado, e enquanto ele está dirigindo quero ele com um óculos
escuro estiloso." As sugestões eram as da lista de ideias do carro do Jean-Luc
(o pato francês do lago): o 2CV azul com a faixa tricolor, a mesa de ping pong
dobrada, a baguete, ele dirigindo em pé no caixote. A trilha de gotinhas do
carro molhado ficou de fora, e nenhuma fala brinca com água.

**O estado:** feito e no jogo, atrás da chave do Bebito Mobile como toda a
viagem. É o quarto veículo dos personagens do PARQUE, depois da lambreta da
Estella, da Kombi do Mano e do carrinho do Cookie. O Jean-Luc passou a morar
no parque na regra de quem aparece (`MORADORES`, em
`eventos/bebitoMobile/rota.ts`): nas rotas do parque, um dos quatro, sorteado
por igual. (Não precisa de trava: o carro só chega ao jogo depois da lição 10,
e a escola só abre depois de o Jean-Luc ser vencido no ping pong.)

## O carro (`world/doisCavalosDoJeanLuc.ts`)

Um Citroën 2CV de desenho, 3,4 m de lata (mais o bagageiro de trás) — menor
que o Bebito. As medidas moram em `DOIS_CAVALOS`; a base em `y = 0`, a frente
no `+Z`, o lado do Bebito é o `−X`, e é desse lado que ele dirige.

- **A lata de baixo é uma pele de fatias** (o molde do carrinho do Cookie): a
  planta é uma superelipse de NARIZ CHATO (onde mora a grade), o perfil é o
  capô comprido caindo, a cintura na cabine e a traseira descendo; a cabine é
  um buraco do tamanho da cintura, com um peitoril estreito.
- **A estufa por cima**: o para-brisa, os quatro vidros de lado e o vidro de
  trás são malhas que acompanham a lata (a coluna da frente deitando um tico, a
  de trás descendo para a traseira), com as colunas, a coluna do meio entre as
  portas e as calhas em tubo da cor do carro. O TETO É ABERTO: a capota de lona
  vai ENROLADA em cima do vidro de trás, presa por duas cintas de couro.
- **Os para-lamas soltos**, o traço que mais diz "2CV": um meio cano gordo
  dando a volta em cada roda, por fora da lata; o da frente desce na frente da
  roda, o de trás tem a SAIA cobrindo meia roda.
- **A cara**: os faróis de sapo cromados num pezinho, em cima dos para-lamas;
  a grade em trapézio com as lâminas deitadas e as DUAS DIVISAS douradas em
  cima; as nervuras compridas no capô e a FAIXA TRICOLOR no meio dele (com o
  filete branco, para o azul não sumir no azul do carro); o para-choque
  fininho de tubo e a placa francesa "JEAN-LUC" (a faixa azul com o "F").
- **As portas**: os cortes, as maçanetas, o adesivo de rali do lado do Bebito
  (as duas raquetes cruzadas, a bolinha e o "5" das cinco vitórias que o
  acordaram) e a bandeirinha "J·L" do outro lado; o retrovisor redondo.
- **Atrás**: as lanternas redondinhas, o escapamento e o BAGAGEIRO com a MESA
  DE PING PONG dobrada (as duas metades com a borda branca, as pernas
  recolhidas em X, a rede enrolada), amarrada com o elástico vermelho. Ela fica
  ATRÁS do carro, e não no teto: no teto, ela tapava o Jean-Luc e os óculos.
- **Por dentro**: o painel com o câmbio de guarda-chuva, o volante de um raio
  só numa coluna comprida (até onde as asas dele alcançam), os bancos de rede
  de lona listrada, e o SAQUINHO DE PÃO com as duas baguetes no banco de trás,
  do lado do Bebito, saindo pelo teto aberto.
- **As rodas** altas e fininhas, de aro creme e calota de cúpula.

### O Jean-Luc ao volante (`PoseAoVolante`, em `entities/bichos/JeanLuc.ts`)

Ele vai 1,35× (no tamanho do parque ele sumia na cabine), EM PÉ NO CAIXOTE em
cima do banco — o caixote de sempre ("eu trago sempre; hoje eu precisei") —,
alto o bastante para a cabeça passar da testeira do para-brisa: os ÓCULOS
ESCUROS ficam no ar, e não atrás do vidro.

- **Os óculos escuros** (`oculosEscuros()`, pendurados na cabeça dele):
  armação grossa de acetato quase preto no desenho dos óculos de cinema (mais
  larga em cima), a sobrancelha gorda por cima, as lentes fumê com o risco de
  brilho na diagonal, os rebites dourados e as hastes abraçando a cabeça. O
  vão é apertado e foi medido: as lentes na frente das pupilas (que acabam em
  `z = 0,125`), acima do bico e abaixo da aba da boina.
- As duas asas no volante, sem gingado; a boina deita para trás e treme no
  vento; a cabeça vira para o Bebito na conversa.
- **A raquete muda de asa no carro** (`raqueteNaJanela`): a direita fica no
  volante, e a da esquerda (a da janela) leva a raquete. Dirigindo, ela fica
  guardada; no ponto de ping pong, a asa larga o volante e a levanta pela
  janela.

A pose mora DENTRO do `animar` dele, num campo que nasce desligado
(`aoVolante`), e todas as escritas estão dentro do `if`: fora do carro, o
Jean-Luc do lago não muda nada.

### A suspensão mole

O 2CV é famoso pela suspensão: andando, a lata adorna e balança; quando ele
para para conversar, ela tomba para o lado do Bebito e volta (uma mola que
passa do ponto).

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

1. **A chegada**: "Um 2CV azul, uma boina e um par de óculos escuros… é o
   Jean-Luc!", e a buzina `buzinaDoJeanLuc` — o "pin-pon" das sirenes
   francesas, curto e fanhoso, de lata.
2. **A conversa** (falas minhas, provisórias, esperando as do Renan):
   - Jean-Luc: "Bonjour, mes amis! Gostaram? É um deux chevaux. Dois cavalos. Eu nunca vi os cavalos."
   - quem vai de carona: "Jean-Luc… de óculos escuros?!"
   - Jean-Luc: "Pour la route. Na estrada, um pato tem que ter estilo. E o caixote, eu trago sempre: hoje eu precisei."
   - (a raquete sai pela janela) Jean-Luc: "Já que paramos… un petit point de ping pong? Pela janela. Eu saco."
3. **O ponto de ping pong**: ele saca, a bolinha voa até a janela do Bebito e
   fica no ar, em câmera lenta, enquanto a agulha da HORA CERTA corre
   ("Rebater na hora certa!", a mesma do ponto dele no Halloween). Acertou: a
   bolinha volta para a raquete dele, que bate de novo, e sobem coraçõezinhos —
   "Magnifique! De dentro do carro! Ce point est pour vous, mes amis." Errou:
   ela cai no asfalto, quica e rola — "Hon hon. A janela é difícil. Revanche na
   próxima estrada."
4. **A saída**: "Au revoir! Eu vou na frente, que o caixote escorrega na
   curva.", o pin-pon de novo, e "Lá vai o 2CV, chacoalhando, com a boina no
   vento e os óculos brilhando."
5. **A memória** "O pato de óculos escuros" (`jeanluc-na-estrada`).

## Estacionado no Villa Lobos (`eventos/bebitoMobile/noParque.ts`)

Depois da memória do encontro, o 2CV fica no estacionamento
(`DOIS_CAVALOS_NO_PARQUE`): na vaga vizinha à do carrinho do Cookie (de −3,5 a
−0,75), de ré como os outros, com a grade e os faróis para o corredor e a mesa
de ping pong do bagageiro para a sebe. Vazio (o dono está no lago), com a lona
enrolada, a baguete no banco de trás e o CAIXOTE encostado na porta do
motorista, do lado de fora. A fila agora é: 2CV, carrinho, passagem, Bebito,
lambreta, Kombi.

## O que foi testado (2026-11-16)

- `doisCavalos.mjs` inteiro: o modelo (nada abaixo do chão, 3,4 m de lata e
  1,9 m de largura nos para-lamas, a cabeça dele a 1,62 m — por cima da
  testeira do para-brisa, em 1,58 —, as lentes dos óculos na frente das
  pupilas e entre o bico e a boina, a raquete guardada dirigindo e na janela no
  ponto; fotos de todos os lados, do rosto, dos óculos de perto, da câmera do
  encontro, de perseguição e vazio), o estacionamento (só depois da memória, na
  vaga vizinha à do carrinho, a passagem livre) e a estrada (o pin-pon na
  chegada e na saída, a conversa, a raquete na janela, a bolinha no ar com a
  hora certa, a memória, o save de verdade intacto), com a tela deitada e no
  celular em pé (`CEL=1`).
- A câmera da conversa chega mais perto com a tela deitada (a mesma do Cookie):
  na de sempre, os óculos viravam um risquinho.
- `musica.mjs`: a buzina sem estalo; no `.wav`, ~0,45 s e pico de 0,061 (a
  corneta do Cookie tem 0,073, a buzina do Bebito 0,054).
- Regressão: `jeanluc.mjs` e `duelo.mjs` (o Jean-Luc do lago não muda: a pose
  do carro só vale com `aoVolante`), `casaClube.mjs` (as rotas, com o quarto
  morador por igual, e os encontros), `kombi.mjs`, `lambreta.mjs`,
  `carrinho.mjs` (as três procuram a semente, que mudou com o quarto morador),
  `viagem.mjs SO=bom` na rota 5 (a do Jean-Luc: o piloto de teste passa pela
  hora certa, sem tropeço nem susto) e `viagemEscola.mjs SO=ida`.
- **O peso**: o 2CV com ele dentro, 84 malhas e ~41 mil triângulos. Na conversa
  da estrada, ~500 desenhos e ~350 mil triângulos (com o carrinho do Cookie,
  512 e ~346 mil). No estacionamento, com os vizinhos: 365 → 381 desenhos e
  ~290 → ~325 mil triângulos com o 2CV.

## Ideias que ficam para depois

- **A moedinha do desejo**: ele dá uma moeda que pescou no fundo do lago, e ela
  vira um desejo na moedinha do trapiche ("Ninguém desejou a moeda. Eu
  perguntei.").
- **A mesa aberta no estacionamento**, do lado do 2CV, só de enfeite (ou para
  um ponto de ping pong de verdade).
- **O rally de mais de um ponto** pela janela, com placar.

## Validar

```bash
npm run build && npx vite preview --port 4177 &
node scripts/doisCavalos.mjs /tmp/dc        # SO=modelo|parque|estrada; CEL=1 a conversa no celular em pé
node scripts/jeanluc.mjs /tmp/jl             # o Jean-Luc do lago, sem mudança
node scripts/duelo.mjs /tmp/dl
```
