# Os carros da turma da escola — planejamento de ideias

## COMECE AQUI

**O pedido** (Renan, 2026-11-17): "monte um planejamento completo de ideias
para os carros da escola". É o próximo passo que já estava marcado em
`docs/VIAGEM-ESCOLA.md` ("os carros dos personagens da escola").

**O estado:** só ideias; nada construído. Este documento é o cardápio para o
Renan escolher, personagem por personagem: o carro, o que acontece na estrada,
o presente e o estacionado. Como nos outros, a ordem é **um de cada vez**.

**O molde já existe** (são cinco veículos feitos assim): a peça em
`world/<veiculo>.ts` com a pose do bicho num campo que nasce desligado, o
encontro em `eventos/bebitoMobile/encontroNaEstrada.ts`, a memória em
`scenes/viagemDeCarro.ts`, o estacionado depois da memória, o atalho de teste
(`?<veiculo>=x,z,giro`) e o teste `scripts/<veiculo>.mjs`. Ver a skill de peça
(da lambreta da Estella ao carrinho de golfe da Gina) e
`docs/CARRINHO-DE-GOLFE-DA-GINA.md`, o mais recente.

**Quem é a turma** (todos já no jogo):

| quem | o que é | o que já faz na estrada da escola |
|---|---|---|
| o **Gatito** | o gato professor de português, do "six seven" (67) | de colete amarelo, segura a placa de PARE na faixa para a torcida atravessar |
| a **Luna**, a **Sol** e a **Estrella** | as três coelhinhas da torcida dos Gatitos (lua, sol e estrela; a Luna tímida, a Sol que salta, a Estrella da estrelinha) | atravessam a faixa de uniforme e pompom |
| o **Flynn** | a raposa atleta, de regata, apito e bola | quica a bola na calçada, ela escapa e ele vai buscar |
| a **Valentina** | a flamingo do marketing, de look por ficha, que fala italiano ("Perfetto!") | o ensaio de fotos na beira da pista |
| a **Tia Liz** | a ursa venezuelana da cantina (sopita, pasta, pabellón, fororo, tres leches) | ainda não aparece na estrada |

## As decisões que valem para todos (perguntas ao Renan)

1. **Onde eles aparecem.** Hoje a escola não tem moradores na regra de quem
   aparece (`MORADORES.escola = []`), e casa ↔ escola fica sem encontro. Com a
   turma morando lá:
   - casa ↔ escola passa a ter encontro (um da turma);
   - parque ↔ escola e clube ↔ escola sorteiam entre os das duas pontas.
2. **Um de cada por viagem.** Quem vem de carro não pode estar também na faixa
   ou na calçada na mesma viagem. É a mesma regra do Cookie: de carrinho, ele
   não sopra bolhas. Por exemplo, o Flynn de carro tira a bola do Flynn; a
   torcida de carro tira a travessia.
3. **Estacionados.** Depois do primeiro encontro, cada carro fica no
   estacionamento da escola (`world/estacionamentoDaEscola.ts`, do outro lado
   da rua do pátio), no lugar de um dos carros genéricos do lote.
4. **Presentes que ficam no Bebito.** A Gina abriu o caminho: o selo de sócio
   colado no para-brisa entrou na ficha do carro. Para a escola, a vaga do
   painel ainda tem um lugar vazio (o canto do motorista), e dá para criar
   vagas novas como a do para-brisa.

---

## 1. O Gatito

**⭐ A. O ônibus escolar amarelinho, em miniatura** (recomendado)
- O ônibus escolar americano de filme (a escola é "chique dos Estados
  Unidos"), encolhido para o tamanho de um gato: o amarelo com a faixa preta,
  o nariz comprido, as janelinhas em fila e o "67" na lateral.
- O **braço do PARE** abre do lado quando ele para, com as luzinhas piscando,
  como os ônibus escolares de verdade. É a mesma placa que ele segura na faixa.
- Por dentro, carteiras no lugar dos bancos, a lousa no fundo com a lição do
  dia em giz e uma maçã no painel.
- Ele dirige de colete amarelo, sentado numa pilha de livros (é pelúcia
  pequena; na estrada ele já vai 1,6×).

**B. O fusquinha-lousa**: um fusca verde-lousa com as portas pintadas de
quadro-negro e a lição escrita em giz; o apagador e o giz no para-choque.

**C. A bicicleta com a cestinha de livros**: a mais simples e a mais fofa.

**Na estrada**
- **A prova surpresa** ⭐: o braço do PARE abre e ele faz UMA pergunta de
  português, das lições da apostila (`g.ask` com três respostas).
  - Acertou: "Nota dez!", e uma estrelinha dourada de professor.
  - Errou: ele explica com carinho, como na aula, e dá a resposta.
- A buzina é um "six seven!" em duas notas, e quem vai de carona responde.

**O presente**: a estrelinha dourada colada no painel do Bebito (o lugar vazio
do painel), ou um adesivo "Aluno nota 10" numa vaga nova.

**Estacionado**: o ônibus na vaga mais perto da portaria, com o braço do PARE
recolhido.

---

## 2. A Luna, a Sol e a Estrella (as três num carro só)

**⭐ A. O conversível da torcida** (recomendado)
- Um conversível azul e amarelo, as cores dos Gatitos, todo enfeitado de
  pompons, com a faixa "VAI, GATITOS!" na lateral e fitas no para-choque.
- As três em pé no banco de trás. A Luna dirige, tímida, de óculos de sol
  enormes.
- Orelhas de coelho de pelúcia em cima do para-brisa, de enfeite.

**B. O triciclo de três lugares**: uma bicicleta tripla, as três pedalando em
fila, com fitas nos guidões e uma cestinha de pompons.

**C. A minivan com orelhas**: uma minivan com duas orelhas de coelho no teto e
uma cauda de pompom atrás.

**Na estrada**
- **A coreografia do lado do Bebito** ⭐: parados lado a lado, a Sol salta, a
  Estrella dá a estrelinha em cima do capô e a Luna acena, tímida. Quem joga
  bate palma na hora certa (`g.horaCerta`, a mesma barra do ponto do
  Jean-Luc); acertando, elas soltam confete que cobre o para-brisa um
  pouquinho, como a geada do Mano.
- A buzina é um "VAI, GATITOS!" gritado pelas três.

**O presente**: um megafone de torcida na mochila, ou o pompom delas
pendurado no teto. O pompom do retrovisor já é delas.

**Estacionado**: o conversível com a faixa e os pompons, e os três pares de
tênis enfileirados ao lado.

---

## 3. O Flynn

**⭐ A. A van da atlética com a tabela de basquete no teto** (recomendado)
- Uma van esportiva laranja e branca, das cores da raposa, com o escudo dos
  Gatitos.
- Em cima, a TABELA DE BASQUETE com aro e rede. O bagageiro de trás é uma
  rede cheia de bolas, com o cone e o apito pendurados.

**B. O jipe aberto de corrida**: um jipinho com santantônio, o número da
regata dele na porta e a bola presa no capô.

**C. O skate elétrico**: ele em pé no skate, com a bola debaixo do braço.

**Na estrada**
- **O arremesso pela janela** ⭐: parados lado a lado, ele passa a bola e quem
  joga arremessa da janela do Bebito na cesta do teto da van, com a barra de
  força que já existe no frisbee e no quicar pedrinha. Cesta é apito e aceno;
  errou, ele pega o rebote e devolve.
- A buzina é o apito dele.

**O presente**: a bola dele na mochila (de quicar), ou uma rede de basquete
pendurada no retrovisor.

**Estacionado**: a van na vaga do canto, com a tabela no teto.

---

## 4. A Valentina

**⭐ A. O conversível rosa italiano** (recomendado)
- Um conversível pequeno e redondo, de linhas italianas antigas, cor-de-rosa
  flamingo.
- O pescoço dela sai por cima do para-brisa, com lenço de seda e óculos
  gatinho. Os óculos entram na ficha de looks dela, como peça de dirigir.
- Uma câmera de fotógrafo no tripé no banco do passageiro e o porta-malas
  cheio de malas de grife empilhadas.

**B. A limusine rosa curtinha**: comprida demais para ela, com o tapete
vermelho enrolado no teto, que desenrola quando para.

**C. A scooter**: descartada para não repetir a lambreta da Estella.

**Na estrada**
- **A sessão de fotos** ⭐: parada do lado, ela arma o tripé e quem joga
  escolhe a pose dos dois no carro (três opções, `g.ask`). O flash dispara (o
  `flashDaFoto` do Halloween já existe) e ela diz "Perfetto!".
- **A polaroid fica no Bebito**: a foto tirada vira uma polaroid pintada
  pendurada no painel, no lugar vazio. Como o selo da Gina, é um presente que
  muda o carro de vez.

**Estacionado**: o conversível com a capota aberta e o tapete vermelho até a
porta.

---

## 5. A Tia Liz

**⭐ A. O jipe clássico venezuelano** (recomendado, mas ver a pergunta)
- Um jipe quadradão e robusto, daqueles que na Venezuela são uma instituição,
  com o estepe na traseira.
- O caldeirão amarrado na capota, fumegando, e as estrelinhas amarelas, azuis
  e vermelhas na porta.
- Ela dirige de avental e touca, com a concha pendurada no retrovisor.

**B. A caminhonete da feira**: uma caminhonete antiga com a caçamba cheia de
sacos de farinha, cachos de banana-da-terra e a panela de sopa.

**C. Um "carrito por puesto"**: um carrão antigo de lotação, desses que levam
gente pela cidade, com a plaquinha da rota no para-brisa.

**Na estrada**
- **A merenda pela janela** ⭐: ela passa dois pratinhos embrulhados pela
  janela, um para cada um, direto para a mochila, como as casquinhas do Mano.
  Podem ser duas arepas ou tequeños, ou um dos cinco pratos dela.
- A buzina é uma corneta de feira, e ela grita "¡Mis niños!".

**O presente**: a comida na mochila (de comer), ou um ímã de arepa no painel
do Bebito.

**Estacionado**: o jipe atrás da cantina, com o caldeirão no teto.

**Pergunta específica**: o carro da Tia Liz tem que ter a cara de quem é. Você
conhece algum carro, comida ou costume venezuelano que combine mais com ela?
Prefiro perguntar a inventar.

---

## A ordem sugerida

1. **O Gatito**: o professor e a cara da escola. O ônibus amarelinho com o
   braço do PARE e a prova surpresa usam o que já existe (a placa, a apostila).
2. **As coelhinhas**: o primeiro veículo com três bichos.
3. **O Flynn**: o arremesso pela janela.
4. **A Valentina**: a polaroid no painel.
5. **A Tia Liz**: depois da resposta sobre a Venezuela.

## As perguntas, juntas

1. Qual carro de cada um (A, B ou C)? E por qual começar?
2. A turma passa a morar na escola, com encontro também em casa ↔ escola?
3. Quem vem de carro sai da faixa e da calçada na mesma viagem (como o
   Cookie)?
4. Os presentes que ficam no Bebito (a estrelinha do Gatito, a polaroid da
   Valentina) estão bons, ou preferem coisas na mochila?
5. A Tia Liz: alguma referência venezuelana de verdade para o carro dela?
