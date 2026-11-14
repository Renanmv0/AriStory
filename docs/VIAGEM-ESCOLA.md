# A viagem de Bebito até a Escola do Gatito

## COMECE AQUI

**O pedido** (Renan, 2026-11-14): "Crie a viagem para a escola! com a animação
de estacionar, faça tudo bem detalhado e bonito. e crie novas interações no
meio do caminho com os personagens da escola, o próximo passo serão os carros
dos personagens da escola".

**O estado:** feita, **esperando o Renan olhar**, na branch de
desenvolvimento. Ela entra no jogo pela mesma chave do Bebito Mobile (que já
está ligada), então subir para `main` põe a viagem no link do Ari.

| o quê | estado |
|---|---|
| as seis rotas (casa, parque e clube ↔ escola) | ✅ |
| a escola no menu do carro, depois do convite da Luna (`escola-aberta`) | ✅ |
| a zona escolar: o muro de tijolo com a grade da escola de um lado, a praça do outro, os postes com as bandeirolas dos Gatitos | ✅ |
| os quatro encontros com a turma da escola na estrada | ✅ |
| a chegada animada no estacionamento da escola, até a vaga do coração | ✅ |
| o carro morando na escola (a volta para casa, o parque ou o clube) | ✅ |
| **os carros dos personagens da escola** | ⬜ **o próximo passo** (pedido do Renan; não fazer junto) |

## O percurso

- **O menu**: "Pra onde vamos de Bebito?" ganha a **Escola do Gatito** na casa,
  no parque e no clube, mas só depois que a escola abre (o convite da Luna, a
  flag `escola-aberta`) — o mesmo momento em que o ônibus passa a ir para lá.
  Da escola, o carro oferece **Casa do Ari**, **Parque Villa Lobos** e
  **Clube**.
- **A rota** (`gerarRotaDaEscola`, em `eventos/bebitoMobile/rota.ts`) tem
  1000 m. O primeiro trecho é o acesso de quem sai: de casa são o bairro e a
  avenida; do clube, a alameda esportiva e as hortas; do parque, o bosque.
  Depois vem a avenida, até os 600 m, e por último a **zona escolar**, de 600
  a 1000 m. A volta é a mesma rota espelhada.
- **O encontro sorteado** de sempre (Noel, Josefina, Capy, Walter) fica no
  meio, por volta dos 430 m, com o corredor livre em volta.
- **Na chegada**, o prédio da escola aparece no fim da estrada: a rotunda, a
  cúpula, o portão com a grade, os três mastros, o calçadão, e à esquerda o
  estacionamento com os carros dos outros.

## Os encontros com a turma da escola (todos na zona escolar)

| na ida | o quê | o que conta |
|---|---|---|
| ~665 m | **o radar da zona escolar**: a placa amarela "ZONA ESCOLAR / SUA VELOCIDADE" com o painel de LED que mostra a velocidade do carro e um rostinho (verde sorrindo, ou âmbar sério com "DEVAGAR") | passar a até 22 km/h dá corações e o "O radar sorriu pra gente!"; mais rápido é um tropeço |
| ~738 m | **a torcida atravessando**: a Luna, a Sol e a Estrella de uniforme e pompom, em fila na faixa. O **Gatito** (de colete amarelo e com a placa de PARE) pula até o meio da faixa da direita e levanta a placa para o carro, e só aí a fila sai. Do outro lado, a Luna torce e a Sol salta | parar dá a gentileza, 3 corações, a fala da Sol e a memória "A torcida atravessa"; buzinar faz a Luna torcer |
| ~812 m | **o ensaio da Valentina**: na praça, com o fundo infinito menta, o tripé, o aro de luz e o rebatedor dourado. Ela posa de tempos em tempos | passar devagar: o flash dispara, ela posa encantada, 2 corações; rápido: "saiu tremida", sem castigo |
| ~886 m | **a bola do Flynn**: ele quica a bola na calçada. Ela escapa e atravessa a pista quicando. Ele corre até a guia e para, olha para um lado e para o outro, atravessa para buscar e agradece com o apito e o aceno | o carro espera até ele voltar com a bola; parar dá a gentileza e 3 corações |

Na volta, a ordem se inverte: a bola, o ensaio, a torcida e o radar ficam no
começo, logo na saída da escola.

**Quem aparece depende do jogo.** A torcida e o radar aparecem sempre. O Gatito
entra na torcida só depois de conhecido (`gatito-conhecido`), e sem ele as três
atravessam sozinhas. O Flynn e a Valentina entram só depois de apresentados
(`flynn-conhecido` e `valentina-conhecida`).

**O piloto automático** (e o piloto do teste) para na faixa para a torcida e a
bola, e passa a até 22 km/h pelo radar e pelo ensaio. Ele conta para a nota,
como nas outras rotas.

## A chegada animada (`eventos/bebitoMobile/naEscola.ts`)

O mesmo motor da chegada do parque e do clube (`chegadaNoParque.ts`), com o
caminho e as tomadas da escola:

1. **apresentando**: o lote inteiro de cima, com o carro vindo pela rua;
2. o carro na faixa de lá da rua faz a curva para a pista de entrada e para
   antes da cancela; **abrindo**: a câmera vai para o lado, e o braço sobe na
   frente do nariz;
3. **entrando**: ele sobe até o corredor e vira à direita;
4. ele anda pelo corredor e vira à direita, para dentro da **vaga do coração**,
   de nariz para a rua;
5. **descendo**: a dupla desce na faixa de pedestres pintada, do lado do
   motorista, e dali é atravessar a rua até o portão.

Recarregar a página no pátio não repete a chegada: o carro já está na vaga. Com
o carro na escola, o ponto de ônibus vira um lembrete: "A gente veio de Bebito.
Ele está na nossa vaga, no estacionamento do outro lado da rua."

## O peso

Com a câmera de perseguição na zona escolar, o pior ponto é a torcida: ~820
desenhos e ~520 mil triângulos. No Villa Lobos o pior ponto fica em ~500
desenhos. O que pesa são os quatro personagens da torcida, cerca de 300 malhas,
porque as juntas deles mexem cada uma por conta própria; nas cenas da escola é
igual.

O que deu para cortar sem mudar a imagem foi feito. A turma só é desenhada
entre 165 m à frente (onde a névoa já apagou tudo) e 40 m atrás da câmera, e
isso tirou ~150 desenhos. A paisagem de cada trecho é fundida por material, e
o radar, o tripé, o aro e o fundo infinito saem da `fundir()`.

Na chegada, o pior ponto são ~510 desenhos e ~450 mil triângulos, contando o
Bebito Mobile inteiro.

## O que é provisório (decidido por mim, para o Renan trocar)

1. **As falas** são minhas:
   - Sol: "VALEU, BEBITOS! VAI, GATITOS!"
   - Gatito: "Parou certinho. Nota dez em trânsito."
   - Flynn: "Valeu por parar! Foi mal pela bola."
   - Valentina: "Perfetto! O carro mais fotogênico da zona escolar." e
     "Mamma mia, saiu tremida! Na próxima, mais devagar, cara mia."
   - quem vai de carona: "O radar sorriu pra gente!" e "Zona escolar, devagar!
     O radar ficou sério."
   - o ponto de ônibus, com o carro na escola.
2. **O limite do radar**: 22 km/h. É o mesmo "passe devagar" da rega da
   Josefina e do ensaio.
3. **Quem aparece**: o Gatito, o Flynn e a Valentina só depois de apresentados.
4. **O tamanho na estrada**: o Gatito com 1,6× o da escola e a Valentina com
   1,3×. No tamanho de pelúcia, de dentro do carro, eles somem.
5. **As memórias**: "A torcida atravessa" e "De Bebito à escola".

## Perguntas ao Renan

- As falas da turma: ficam, ou você quer escrever as suas?
- O radar a 22 km/h está bom?
- Os carros dos personagens da escola (o próximo passo): de quem primeiro?
  Que carro tem a cara de cada um? E eles aparecem na estrada como os carros
  do Noel e da Josefina, ou ficam estacionados no lote da escola?

## Validar

```bash
node scripts/viagemEscola.mjs /tmp/ve   # as rotas, o menu, a ida com fotos de cada encontro, a chegada, recarregar e a volta
SO=rotas node scripts/viagemEscola.mjs   # só as 1800 rotas, sem navegador
node scripts/patio.mjs /tmp/pt          # o pátio continua de pé
```
