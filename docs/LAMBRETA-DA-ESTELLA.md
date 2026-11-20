# A lambreta da Estella e quem aparece em cada rota

## COMECE AQUI

**O pedido** (Renan, 2026-11-15): "Vamos começar com a lambreta com sidecar da
Estella, quero ela com aquele capacete com óculos grande enquanto ela dirige, no
sidecar quero que tenha uma pilha comicamente grande de roupas, bastante mesmo.
E outra mudança: os personagens só aparecem nas interações de carro nas rotas
que vão para o lugar que eles ficam. Então a Estella só apareceria nas rotas que
vão ao Parque Villa Lobos, e os personagens do clube só nas rotas que vão ao
clube. Rotas que têm personagens nos dois pontos, tanto na ida quanto na volta,
ficam aleatórias entre todos os personagens."

E a resposta dele sobre as rotas que vão a um lugar sem personagem (a casa e a
escola): **vale quem mora no lugar de onde a viagem sai**.

**O estado:** feita e no jogo (o Renan autorizou subir sem esperar). É o
primeiro veículo dos personagens do PARQUE; os outros (o Mano, o Cookie e o
Jean-Luc) vieram depois, cada um com o seu documento.

## Quem aparece em cada rota (`candidatosAoEncontro`, em `eventos/bebitoMobile/rota.ts`)

Cada personagem mora num lugar (`MORADORES`): a Estella, o Mano (a Kombi de
sorvete, `docs/KOMBI-DO-MANO.md`), o Cookie (o carrinho,
`docs/CARRINHO-DO-COOKIE.md`) e o Jean-Luc (o 2CV, `docs/DOIS-CAVALOS-DO-JEAN-LUC.md`) no parque; o Noel, a
Josefina, o Capy, o Walter e a Gina (o carrinho de golfe, `docs/CARRINHO-DE-GOLFE-DA-GINA.md`) no clube; a Tia Liz e as
irmãs (o conversível, `docs/CARROS-DA-ESCOLA.md`) e o Flynn (a pé, na corrida matinal) na escola; ninguém na casa.

- Vale o **destino**: indo ao parque, a Estella, o Mano, o Cookie ou o Jean-Luc; indo ao clube, o pessoal do clube.
- Se o destino não tem ninguém (a casa), vale a **origem**: do clube
  para casa, o pessoal do clube; do parque para a escola, um dos quatro do parque.
- Se as **duas pontas** têm gente (parque ↔ clube, nos dois sentidos), sorteia
  entre **todos** os nove.
- Casa ↔ escola: a Tia Liz e as irmãs, ou o Flynn correndo (desde 2026-11-17; antes, sem encontro). Cada um só
  depois de conhecido na escola (a Tia Liz na cantina, o Flynn no refeitório); sorteado e ainda não conhecido, a
  viagem segue sem encontro. A turma da escola continua na zona escolar.
- O sorteio é por igual entre os candidatos, pela semente da viagem: recarregar
  conserva o mesmo encontro.

| rota | quem pode aparecer |
|---|---|
| casa ↔ parque | Estella, Mano, Cookie, Jean-Luc |
| parque ↔ escola | Estella, Mano, Cookie, Jean-Luc, Tia Liz e as irmãs, Flynn |
| casa ↔ clube | Noel, Josefina, Capy, Walter, Gina |
| clube ↔ escola | Noel, Josefina, Capy, Walter, Gina, Tia Liz e as irmãs, Flynn |
| parque ↔ clube | os nove |
| casa ↔ escola | Tia Liz e as irmãs, Flynn |

Isso substitui o "25% para cada um em toda viagem" de 2026-11-13
(`docs/FOOD-TRUCK-DO-WALTER.md`).

## A lambreta (`world/lambretaDaEstella.ts`)

- **A lambreta italiana**, em menta pastel e creme:
  - a barriga redonda atrás, com as bochechas, o friso cromado e as grelhas;
  - o assoalho de ripas de borracha e o escudo curvo com o emblema da tesoura;
  - a cabeça do guidão com o farol redondo, os retrovisores redondos de haste
    e as lanterninhas de pisca;
  - as rodinhas de aro creme e o banco de couro caramelo com a costura;
  - o bagageiro cromado com a frasqueira de chapéu.
- **O sidecar** é um torpedo menta com a beira creme, o farolete na proa, o
  chassi cromado e a plaquinha "ATELIÊ ESTELLA". Ele vai do lado de **fora da
  pista**, à esquerda dela. Assim, parada ao lado do Bebito para conversar, ela
  fica na frente da pilha e não atrás dela.
- **A pilha de roupas** tem quase 4 m, bem mais alta que o Bebito. São 23 peças
  dobradas em cinco blocos encadeados, e cada bloco balança um tico depois do
  de baixo. Ela já nasce torta e chacoalha com o vento, a aceleração e a
  freada.
  - As peças são almofadinhas de pano (a beira fofa), nas cores do catálogo da
    boutique.
  - Em todo bloco caem pontas pelas beiradas: perna de calça, manga, saia e
    toalha.
  - No alto vão o chapéu de aba larga com a meia equilibrada e o lenço voando.
    Pela pilha ficam o vestido lilás pendurado atrás, o cabide com uma blusa,
    a manga escapando e as duas cordas que claramente não seguram nada.
- **A Estella pilotando**:
  - sentada no banco, de peito em pé, com as patas da frente nas manoplas e as
    de trás no assoalho;
  - o **capacete** é um coquinho rosa, com a faixa creme e a beira de couro;
    as orelhas saem por baixo, abanando no vento;
  - os **óculos grandes de aviador** têm o aro de couro e o cromo, a lente
    clara e a tira;
  - os óculos de costureira e o laço saem enquanto ela pilota, e voltam depois;
  - na conversa, ela vira a cabeça para o Bebito.
- O grupo cresce 1,55 vez no fim, como os outros veículos: no tamanho de
  verdade ela sumia na câmera de perseguição.

## O encontro (`eventos/bebitoMobile/encontroNaEstrada.ts`)

O mesmo roteiro dos outros: ela passa pela esquerda, freia adiante, para do
lado, conversa e segue. As falas são **minhas, provisórias**:

- entrada: "Uma TORRE de roupas no retrovisor… é a Estella!"
- Estella: "Bebitos! A coleção nova ficou pronta, e eu resolvi levar TUDO pra
  loja de uma vez só!"
- carona: "Estella… isso tudo cabe na loja?"
- Estella: "Caber, não cabe. Mas está tudo alinhavado, querida, não cai nem um botão."
- Estella: "Passem na loja depois, que eu separo uma peça com a cara de vocês!"
- saída: "A pilha balançou… mas não caiu nem um pé de meia."
- memória: "A torre de roupas" (`estella-na-estrada`).

## A lambreta estacionada no Villa Lobos (2026-11-15)

Pedido do Renan: "faça agora que a lambreta fica no estacionamento do Villa Lobos
depois do primeiro encontro". Ela mora na vaga da fila A logo depois da vaga do
coração do Bebito (`LAMBRETA_NO_PARQUE`, em `eventos/bebitoMobile/noParque.ts`):
de nariz para a rua, como ele, vazia (a dona está na boutique) e com a pilha
ainda no sidecar, já torta. Só aparece com a memória `estella-na-estrada`. É uma
peça de fundo, juntada com o estacionamento (`fundirComoFundo`), com colisor na
pegada da lambreta e do sidecar. A torre de 4 m fica do lado da câmera, mas não
tapa a vaga do Bebito nem a descida da dupla (conferido na foto).

## O pano no para-brisa (2026-11-15)

Pedido do Renan: "quando a Estella acelera, um dos panos sai voando e cai no nosso
para-brisa. Depois ele sai aos pouquinhos." (`eventos/bebitoMobile/panoNoParaBrisa.ts`)

- Uns 0,25 s depois de ela arrancar, o **lenço do alto da pilha** some da pilha
  (`soltarPano()`) e um pano rosa de bolinhas, com a barra dourada, sai voando
  dali: um arco por cima, dando cambalhota e ondulando.
- Ele **gruda no para-brisa**. Cada ponto do pano vai para a pele do carro pela
  mesma conta da carroceria (`secao(z)`, os nós de cima da fatia, e `deformar`),
  medido pelo comprimento do perfil, para não esticar no vidro em pé. As pontas
  tremulam no vento. A carona: "Ei! Um pano no para-brisa!"
- **Escorrega aos pouquinhos**: o vento o empurra pelo vidro e pelo teto, por
  cima do bagageiro, e um tico para o lado (3 s).
- **Descola** na traseira e voa para trás, rodando, até sumir. "…e lá se foi o
  pano. A Estella nem percebeu."
- A câmera da conversa (de frente) ainda está valendo quando ele gruda; quando
  ela some, a de perseguição (de trás e de cima) vê ele escorregar pelo teto e
  sair voando na direção dela.
- As falas são minhas, provisórias.

## O peso

A lambreta inteira tem 68 malhas e ~44 mil triângulos (a carroceria e as rodas
pela `fundir()`, cada bloco da pilha num lote de peças). A Estella tem 104
malhas, as mesmas da boutique e do parque: bicho é articulado, e a `fundir()`
passaria por cima das patas. No encontro, com a câmera da conversa: ~590
desenhos e ~350 mil triângulos (o do Walter, noutra rota, ~390 desenhos).

## Ideias que ficam para depois

- **Os outros do parque**: o Mano já veio, de Kombi de sorvete
  (`docs/KOMBI-DO-MANO.md`); o Cookie também, de carrinho pequenininho
  (`docs/CARRINHO-DO-COOKIE.md`); e o Jean-Luc, de 2CV
  (`docs/DOIS-CAVALOS-DO-JEAN-LUC.md`).

## O que foi testado (2026-11-15)

- **Passaram**: `lambreta.mjs`, `casaClube.mjs` inteiro (com a Estella no
  computador e no celular), `viagem.mjs SO=bom` e `SO=volta`, `viagemEscola.mjs`
  inteiro e `estella.mjs` (a classe dela ganhou a pose de pilotar).
- **Já falhava antes**: o `carroPorDentro.mjs SO=piloto` para logo no começo,
  numa fala da visão do passageiro que o teste não avança. Rodado sobre o código
  de antes da escola (f7f6a0a), ele falha igual.
- **O z-fighting**: as peças da lambreta são de esfera, toro, cilindro e plano, e
  o `zfighting.mjs` só mede caixa reta. As placas e o emblema ficam 6 a 10 mm
  fora da superfície em que estão.

### Testado (o estacionamento e o pano)

Passaram: `lambreta.mjs` inteiro (o modelo, a lambreta estacionada só depois da
memória e o pano nos cinco momentos), `viagem.mjs SO=bom` (a viagem casa → parque
com a Estella e o pano no caminho), `casaClube.mjs` e `parque.mjs`. O
`viagem.mjs SO=estacionamento` tem uma falha antiga: ele procura o botão "Voltar pra
casa de carro", que virou "Viajar de Bebito Mobile" no commit da viagem ao clube
(`497718c`), antes da lambreta.

## Validar

```bash
node scripts/lambreta.mjs /tmp/lb        # o modelo parado no parque (?lambreta=x,z,giro, medidas e fotos de perto), a lambreta ESTACIONADA depois do encontro e o PANO no para-brisa; SO=modelo|parque|pano
SO=rotas node scripts/casaClube.mjs      # quem aparece em cada rota (sem navegador)
```
