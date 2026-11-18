# Os carros da turma da escola — planejamento de ideias

## COMECE AQUI

**O pedido** (Renan, 2026-11-17): "monte um planejamento completo de ideias
para os carros da escola". É o próximo passo que já estava marcado em
`docs/VIAGEM-ESCOLA.md` ("os carros dos personagens da escola").

**O estado:** o **conversível da Tia Liz e das irmãs** (§2) está FEITO e no
jogo (2026-11-17): o carro, a interação na estrada e o estacionado na escola.
A **limusine da Valentina** (§4) está no jogo (2026-11-18), com o Pietro, o pavão motorista: a sessão de fotos na
estrada, a polaroid no painel, o desfile do tapete vermelho na escola e a limusine estacionada no lote. O **Flynn** (§3) também está no jogo (2026-11-18), sem carro: a
escolha do Renan foi ele vir A PÉ, na corrida matinal, mais rápido que o Bebito, e um toca aqui pela janela. O
Gatito mora na escola: no lugar do carro, o ÔNIBUS ESCOLAR dos Gatitos fica estacionado no lote (§1). Os carros da
escola estão completos. Este documento é o cardápio para o
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
| a **Tia Liz** | a ursa venezuelana da cantina (sopita, pasta, pabellón, fororo, tres leches) | ainda não aparece na estrada; vai dirigir o carro das três irmãs (§2) |

## As decisões que valem para todos (perguntas ao Renan)

1. **Onde eles aparecem** (decidido pelo Renan em 2026-11-17): a turma mora na
   escola (`MORADORES.escola`, hoje com a Tia Liz e as irmãs):
   - casa ↔ escola tem encontro (um da turma);
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

**FEITO (2026-11-18), na decisão do Renan: "o Gatito mora na escola! Mas deixe estacionado um ônibus escolar dos
Gatitos".** O Gatito NÃO aparece na estrada (continua de guarda na faixa da torcida). O ÔNIBUS ESCOLAR DOS GATITOS
(`world/onibusEscolarDosGatitos.ts`) fica sempre estacionado no lote da escola, DE LADO, atravessado em quatro vagas
da fila de trás (do outro lado, a limusine da Valentina): o ônibus americano de nariz comprido (a carroceria e o
capô em perfil extrudado com bisel), amarelo de ônibus escolar com os três frisos pretos, a fila de janelas na faixa
preta, "ESCOLA DO GATITO" no alto, o emblema dos Gatitos, a porta sanfonada do lado da calçada, o braço de PARE
dobrado do lado do motorista, as luzes de alerta, a placa da linha "67 ESCOLA" (o six seven) e as duas ORELHINHAS DE
GATO no teto. Parado: entra junto com o fundo do lote.

**A segunda versão (2026-11-18, pedido do Renan: "mais bonito, com mais detalhes, melhore as texturas")** manteve tudo
e caprichou no acabamento: a CHAPA da lataria em canvas (as emendas entre as janelas com os rebites, as emendas
atravessando o teto, a poeira no pé), os vidros pintados (o céu refletido, os encostos azuis dos bancos, o risco de
brilho), o caixilho de alumínio, o letreiro em letra de ônibus escolar, o número 67, os para-lamas pretos, a grade de
cromo entre os faróis de aro, as venezianas do capô, os espelhos de capô e os retrovisores, o para-brisa com os
limpadores, as caixas das luzes de alerta com as palas (o "67 ESCOLA" na frente, o "ESCOLAR" atrás), as escotilhas do
teto, a placa do Mercosul, o braço de travessia listrado no para-choque, a porta de emergência com o aviso, as
lanternas de aro, o para-choque de trás listrado, as rodas com aro, furos, calota e porcas, o tanque e os para-barros
com a pata dos Gatitos. Tudo o que é impresso mora num atlas só: o peso caiu (vista do lote, 280 → 268 desenhos;
+15 mil triângulos). Textos novos, provisórios: a placa "GAT6A67", o "ESCOLAR" de trás e o "SAÍDA DE EMERGÊNCIA".

**O Gatito lavando o ônibus (2026-11-18, pedido do Renan: "de vez em quando o Gatito aparece ao lado do ônibus dizendo
que está limpando ele")** — `eventos/gatitoLavaOOnibus.ts`: em algumas visitas ao pátio (35%, só depois de conhecer o
Gatito e nunca com a aula chamada), ele está do lado da porta do ônibus, em pé em DOIS CAIXOTES empilhados, de esponja
na pata, esfregando a lataria em roda (a pose `esfregar` do `Gatito`); o balde azul de espuma com a esponja reserva, a
poça, a espuma grudada no amarelo, as bolhas subindo e o "fsh-fsh" baixinho (`esfrega`) com a dupla perto. Falar com ele:
ele larga a esponja, vira para a dupla e conta que está dando banho no ônibus (a primeira vez rende a memória "O ônibus
brilhando" e um six seven); depois, uma fala curta sorteada, e ele volta a esfregar. As falas são PROVISÓRIAS (minhas).
`?gatitoLavando` força, `?semGatitoLavando` tira; o teste é o `scripts/gatitoLavando.mjs`.

**O MUTIRÃO DA LAVAGEM (2026-11-18, pedido do Renan: "a gente pode ajudar, um pega a esponja e o outro a mangueira,
uma animação de nós três lavando — divertida, muito bem feita e polida")** — `eventos/mutiraoDaLavagem.ts`, peças em
`world/lavagemDoOnibus.ts`. Toda conversa com o Gatito lavando termina no convite; aceitando, quem joga escolhe quem
fica com a MANGUEIRA (o outro pega a esponja reserva do balde) e a tela pisca com os três no lugar, numa câmera de três
quartos pelo lado da traseira: o da esponja ESFREGANDO em roda colado na lataria (pose nova `lavarNaCena` do corpo da
dupla) e a espuma crescendo; o da mangueira ENXAGUANDO — a mangueira verde esticada do carrinho até a pistola, o jato
(o fio, as gotas e o respingo na lataria), a espuma sumindo e a lataria piscando de limpa; a PEGADINHA: o jato
escorrega e pega o Gatito em cheio ("MIAU! Ei! Eu sou gato, não ônibus!"), ele dá a SACUDIDA de gato molhado em cima de
quem está do lado e os dois riem; e o FINAL: mangueira para o céu, a chuva fininha e um ARCO-ÍRIS desenhando-se por
cima do ônibus, o six seven, os pulinhos, a RECOMPENSA do Gatito (R$ 200 na carteira do casal, TODA vez que ajudam — pedido
do Renan: "o Gatito dá 200 moedas cada vez que lavarmos") e a memória "Banho de mangueira" (só na primeira). Depois tudo volta (a esponja no balde, a
mangueira enrolada no chão, o Gatito esfregando). Dá para repetir quando quiser. As falas são PROVISÓRIAS (minhas).

**As ideias de antes** (ficam para referência):

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

## 2. A Tia Liz e as três irmãs: o conversível que veio da Venezuela

**A ideia do Renan** (2026-11-17): "e se a Tia Liz levasse as três irmãs no
conversível? Daí o conversível seria da cor dos Gatitos, mas com alguns
detalhes da Venezuela, e na história elas quatro vieram juntas da Venezuela."

Junta duas entradas da lista (o conversível da torcida e o carro da Tia Liz)
num carro só, e dá a elas uma história em comum. Fica um veículo a menos para
fazer e um encontro mais cheio.

### O que foi feito (o carro, 2026-11-17)

`world/conversivelDaTiaLiz.ts` (`ConversivelDaTiaLiz`, medidas em
`CONVERSIVEL`), no molde de pele de fatias do 2CV do Jean-Luc:

- **A lata**: um carrão dos anos 50, de 4,7 m, comprido e baixo, azul dos
  Gatitos, com a **lança amarela** dos dois lados entre dois **filetes
  vermelhos** (as três cores da bandeira), o friso de cromo na cintura e os
  **rabos de peixe** atrás com as lanternas de foguete acesas.
- **A cara**: a grade oval de cromo com as lâminas, os faróis grandões de
  viseira, o para-choque de cromo com as duas "balas", a estrela de cromo no
  nariz e a placa "GATITOS".
- **O ARCO DAS OITO ESTRELAS** brancas no capô, como na bandeira, de frente para
  quem olha o carro.
- **A cabine aberta**: o para-brisa panorâmico baixinho, os dois bancos
  inteiriços creme de rolinhos com o vivo azul, o volante grandão de três raios
  e a **concha** da Tia Liz pendurada no retrovisor.
- **A viagem**: a **mala antiga** de couro no bagageiro de cromo, com as
  quinas de latão, as cintas e os adesivos "VENEZUELA" e "BRASIL" ligados por
  um aviãozinho, amarrada com cordão vermelho; a **bandeirinha** da Venezuela
  na antena, tremulando; o **cuatro** de través no banco de trás; a **cesta**
  de arepinhas e a garrafa de café no banco da frente.
- **A torcida**: a faixa de pano "VAI, GATITOS!" amarrada nas portas, com os
  pompons pintados.
- **As quatro dentro**:
  - a **Tia Liz** ao volante, sentada, as patas no aro (a pose de sentar,
    `sentadaNoCarro`, nasce desligada: na cantina ela não muda);
  - a **Luna** do outro lado, sentada numa almofadinha amarela, com os
    **óculos de sol enormes** de aro amarelo;
  - a **Sol** e a **Estrella** em pé no banco de trás, de pompom, torcendo de
    tempos em tempos.
- **Vazio** (`new ConversivelDaTiaLiz(true)`, a versão estacionada): o carro
  com a mala, o cuatro, a cesta e os bancos, juntado como fundo.
- **O peso**: com as quatro, 371 malhas e ~109 mil triângulos (elas são
  articuladas e não se juntam; a Tia Liz sozinha tem os cachos); vazio, 19
  malhas e ~41 mil.
- Atalho de teste `?conversivel=x,z,giro` (`&conversando`, `&andando=7`,
  `&vazio`); teste `scripts/conversivel.mjs`.

### A estrada e o estacionado (2026-11-17)

**As decisões do Renan:**
- elas aparecem nas viagens casa ↔ escola, e como mais uma opção em qualquer
  viagem que vai à escola: de clube ↔ escola e parque ↔ escola, o sorteio é
  entre quem mora nas duas pontas (`MORADORES.escola = ['tializ']`). Em casa ↔
  escola elas são as únicas, então aparecem em toda viagem;
- **a história**: a Tia Liz trabalhava numa escola na Venezuela quando elas eram
  pequenas; o sonho das quatro era se mudar do país; vieram para o Brasil, e a
  Tia Liz cuida delas aqui. Ela é DITA na conversa (só na primeira vez);
- na viagem em que elas vêm de carro, **a torcida não atravessa a faixa** (as
  mesmas três não estão em dois lugares; o Gatito com a placa sai junto, nessa
  viagem).

**A trava**: o conversível só passa depois de a Tia Liz ser conhecida na
cantina (`tia-liz-conhecida`); antes, a viagem segue sem encontro e com a
torcida, como sempre (o sorteio da rota não muda; quem decide é a cena).

**O encontro** (`eventos/bebitoMobile/encontroNaEstrada.ts`), falas minhas e
provisórias, esperando as do Renan:
1. a chegada: "Um conversível azul e amarelo cheio de pompom… é a Tia Liz com
   as meninas!", e a buzina de carrão antigo (`buzinaDaTiaLiz`, dó-mi-sol);
2. Tia Liz: "¡Mis niños! Encostem aí, que eu trouxe merenda." — Sol: "OI,
   BEBITOS! A GENTE TÁ INDO PRA ESCOLA!";
3. **só na primeira vez, a história**: quem vai de carona: "Tia Liz! As três
   juntas no carro com você?" — Tia Liz: "Sempre juntas. Lá na Venezuela eu
   trabalhava numa escola, e elas eram pequenininhas." — Estrella: "E o sonho
   de nós quatro era se mudar. A gente falava disso todo dia." — Tia Liz:
   "Então a gente fez a mala e veio. E aqui eu cuido delas." — (as três ficam
   tímidas) Luna: "…e ela cuida muito bem."; **nas outras**, Estrella: "Vocês de
   novo! A estrada da escola é nossa!";
4. **as palmas**: Sol: "AGORA A TORCIDA! BATE PALMA COM A GENTE!", e a hora
   certa ("Bater palma na hora certa!"); de qualquer jeito o CONFETE sobe do
   banco de trás (90 papeizinhos nas cores dos Gatitos e da Venezuela), a Sol
   salta, a Estrella torce, a Luna fica tímida e a Tia Liz acena; acertando,
   sobem corações — "ISSO! NO TEMPO CERTINHO! VAI, BEBITOS!" (ou "QUASE! MAS
   VALEU A PALMA! VAI, BEBITOS!");
5. **a merenda**: Tia Liz: "E pra viagem, uma arepita pra cada um. Feita hoje
   cedo.", e as duas arepitas voam da cesta até a janela: uma para cada um, na
   mochila (`ITENS.arepitaDaTiaLiz`, de comer — "Comer a arepita da Tia Liz");
6. Tia Liz: "Juízo na estrada, ¿oíste? Nos vemos na escola.", a buzina, e "Lá
   se vai o conversível, com os pompons balançando e a bandeirinha no vento.";
7. a memória "As quatro que vieram juntas" (`tializ-na-estrada`).

**Estacionado**: depois da memória, o conversível fica vazio no lote da escola,
na vaga da fila 1 a 7,8 (depois da reservada da descida do Bebito), de ré, com o
arco das estrelas para o corredor.

### O que foi testado (2026-11-17)

- `conversivel.mjs` inteiro: o modelo; a estrada (antes de conhecer a Tia Liz,
  nada de conversível e a torcida atravessa; depois, a buzina na chegada, na
  conversa e na saída, a história só na primeira vez, as palmas na hora certa,
  o confete, as duas arepitas voando e na mochila, a memória, nenhuma torcida
  na mesma viagem, o save de verdade intacto; e a segunda viagem com o oi),
  com a tela deitada e no celular em pé; o estacionado no lote da escola; e a
  arepita na mão ("Comer a arepita da Tia Liz", com o artigo novo do item) e
  comida.
- Regressão: `casaClube.mjs SO=rotas` (as rotas da escola com a Tia Liz por
  igual), `viagemEscola.mjs` inteiro, `patio.mjs`, `tiaLiz.mjs SO=modelo,posto`,
  `irmas.mjs` e `musica.mjs` (a buzina sem estalo; medida no `.wav`, não
  ouvida).
- **O peso**: na conversa da estrada, ~710 desenhos e ~475 mil triângulos (o
  carrinho do Cookie dava ~512 e ~346 mil): são quatro bichos articulados, e a
  Tia Liz sozinha tem os cachos e as molinhas; no celular em pé, ~630 e ~350
  mil. No pátio da escola, com o conversível estacionado: 321 → 321 desenhos e
  332 → 370 mil triângulos.

### O plano original (como foi pensado)

**O carro**
- Um conversível grande e antigo, de banco inteiriço, com o **azul e o amarelo
  dos Gatitos**. Já são duas das três cores da bandeira da Venezuela, então os
  detalhes venezuelanos encaixam sem brigar.
- **Os detalhes da Venezuela**:
  - o arco das **oito estrelinhas brancas** no capô, como na bandeira;
  - um **filete vermelho** dando a volta na cintura (a terceira cor);
  - a **mala antiga** amarrada no porta-malas, com adesivos de viagem, que é o
    que conta "a gente veio de longe";
  - um **cuatro** (o violãozinho venezuelano) no banco, para uma das irmãs
    tocar;
  - a cesta de comida da Tia Liz no colo de alguém.
- **Quem vai onde**: a Tia Liz dirige, de avental e com a concha pendurada no
  retrovisor. A Luna vai do lado dela, tímida, de óculos de sol enormes. A Sol
  e a Estrella vão em pé no banco de trás, de pompom, com as orelhas e os
  cachos da Tia Liz voando no vento.
- Os pompons e a faixa "VAI, GATITOS!" na lateral continuam: é o carro da
  torcida também.

**Na estrada** (juntando as duas interações)
1. **A coreografia**: parados do lado do Bebito, a Sol salta, a Estrella faz a
   estrelinha no capô e a Luna acena. Quem joga bate palma na hora certa, e
   acertando cai confete no para-brisa.
2. **A merenda**: a Tia Liz passa dois pratinhos embrulhados pela janela, um
   para cada um, direto para a mochila. Podem ser arepas ou um dos pratos dela.
3. A buzina é uma corneta de feira, e as três gritam "VAI, GATITOS!".

**O presente**: a comida na mochila. Se quiser algo que fique no Bebito, uma
bandeirinha de antena com as oito estrelas.

**Estacionado**: o conversível no lote da escola, com a mala no porta-malas, o
cuatro no banco e os pompons em cima do painel.

**O que muda numa regra que já existe**: hoje está escrito (ESCOLA.md §14 e
§15) que a origem venezuelana das irmãs e da Luna é **contexto, não assunto**:
ninguém fala disso no jogo. A história "vieram juntas" mudaria isso, ou
continuaria só mostrada (a mala, as estrelas, o cuatro), sem ninguém dizer em
voz alta. **É decisão do Renan** (ver as perguntas).

**As versões de antes** (se o Renan preferir separar): o conversível só da
torcida (A), o triciclo de três lugares (B) ou a minivan com orelhas (C) para
as irmãs; e o jipe venezuelano, a caminhonete da feira ou o "carrito por
puesto" para a Tia Liz.

---

## 3. O Flynn

**FEITO (2026-11-18): a corrida matinal, a pé.** O Renan escolheu: "seria engraçado ele correndo na calçada mais
rápido que o carro, e uma interação com um toca aqui, e ele falando que está fazendo a corrida matinal dele, ele não
pode ficar atrás dos seus rivais (quero adicionar um personagem lobo para disputar com o Flynn depois)".

- **Onde:** o Flynn mora na escola (`MORADORES.escola` em `rota.ts`): casa ↔ escola sorteia entre ele e a Tia Liz;
  parque ↔ escola e clube ↔ escola, entre as duas pontas. Só depois de `flynn-conhecido` (o refeitório); antes, a
  viagem segue sem encontro. Na viagem em que ele vem correndo, **a bola dele não escapa** na calçada.
- **A corrida** (`eventos/bebitoMobile/corridaDoFlynn.ts`, o "veículo" dele no contrato de sempre): ele vem pela
  calçada da direita, no meio dela (as placas ficam na beira e os postes no fundo), e passa o Bebito a uns 3,5 vezes
  a velocidade do carro, com a passada acelerando junto (`Flynn.naEstrada`). Chega com o apito.
- **A conversa:** parado um palmo à frente da janela de quem vai de carona, ele TROTA NO LUGAR. A corrida matinal e
  os rivais ("Ele também acorda cedo…": o lobo que vem depois, sem nome ainda).
- **O toca aqui:** ele desce da calçada até a beira do asfalto, vira meio para o carro e ergue a pata; o VIDRO DO
  PASSAGEIRO do Bebito desce (`baixarVidroDoPassageiro`, a janela virou uma malha própria) e o braço de quem vai de
  carona sai pela janela (`CharacterRig.bracoPelaJanela`). A hora certa: acertando, as duas mãos se encontram (medido:
  a 13–17 cm, contando o tamanho delas), o "pá!" (`tocaAqui`), corações e ele comemora; errando, a pata dele já
  desceu e a mão passa no vento. A tomada é quase de cima: da calçada a cabeça dele tapava a pata, e da pista o
  retrovisor tapava a janela.
- **A saída:** ele dispara e some na frente. A memória: "A corrida matinal".
- **Estacionado:** não tem (ele não tem carro). Uma ideia para depois: ele alongando na calçada da escola.
- **Testado:** `scripts/corridaDoFlynn.mjs` (rotas, sem conhecer, acertando, errando; `CEL=1` no celular em pé).
  Peso na conversa: ~486 desenhos e ~403 mil triângulos (com a tela deitada), ~300 no celular — mais leve que o
  conversível (710). O som `tocaAqui`: pico 0,10 no `.wav`, 0,24 s.

**As ideias de antes** (ficam para referência):

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

**O CARRO ESTÁ FEITO (2026-11-18): a limusine conversível rosa, com o Pietro ao volante.** O Renan: "quero uma
limusine conversível! Rosa bem estilosa igual a ela", e "seria legal ela ter alguém que dirigisse pra ela?" — um
personagem novo. A interação na estrada é a próxima etapa (a sessão de fotos e a polaroid, abaixo, para o Renan
confirmar).

- **O Pietro** (`entities/bichos/Pavao.ts`, nome PROVISÓRIO): um PAVÃO motorista, sério e educado, de quepe de chofer
  (o topete escapando por trás), colarinho com gravata-borboleta, botões dourados e LUVAS BRANCAS nas pontas das asas.
  Em serviço a cauda vai DOBRADA (um lote de 23 penas com os ocelos); `abrirLeque(true)` abre o leque em pé — guardado
  para a sessão de fotos (o fundo da foto). Ao volante (`aoVolante`, nasce desligado) ele senta, as asas vão às dez e
  dez e a cauda, que não cabe no carro, PENDE PELA PORTA do lado do Bebito.
- **A limusine** (`world/limusineDaValentina.ts`): 6,3 m (ocupa duas vagas), a pele de fatias do conversível da Tia
  Liz esticada, sem teto; rosa fundo com a lança perolada e o duas cores dos anos 50, cromo, rabos de peixe com as
  lanternas de foguete, quatro faróis, a grade de barras e o FLAMINGO DOURADO num pé só no capô; a placa "Valentina —
  Milano · Italia". Na frente, o Pietro num BANCO ALTO (para ver por cima do capô comprido) e a CÂMERA de fotógrafo
  antiga no banco do lado; a DIVISÓRIA com o minibar e duas taças de suco de morango; atrás, a sala: o tapete
  vermelho de friso dourado, o SOFÁ CAPITONÊ branco-pérola do lado de lá, as CHAPELEIRAS listradas no banco de trás;
  e o TAPETE VERMELHO enrolado no porta-malas.
- **A Valentina** vai no sofá, VIRADA PARA O BEBITO (a cabine é aberta: nada entre ela e a câmera do encontro), com
  as perninhas dobradas em cima de um PUFE capitonê (sentada, o flamingo estica a coxa para a frente na altura do
  assento: sem o pufe, os joelhos ficavam no ar), num look novo (`LOOK_DE_LIMUSINE`, em `world/looksDaValentina.ts`): o
  uniforme chique de sempre — o azul do blazer separa ela do rosa do carro — com os ÓCULOS GATINHO NO ROSTO
  (`oculosNoRosto`).
- **Testado:** `scripts/limusine.mjs` (SO=modelo|pietro): nada abaixo do chão, a largura na faixa (1,97), o
  comprimento, o Pietro do lado do Bebito com a cabeça por cima do para-brisa e as luvas no aro, a cauda por cima da
  porta e fora da lataria, a Valentina dentro da cabine, virada para o Bebito, de óculos na frente dos olhos; o pavão
  sozinho com os pés no chão e o leque abrindo. Peso: 133 malhas e ~98 mil triângulos com os dois (o Pietro passa
  pela `fundir()`: 32 malhas; a Valentina, 74), e a vista do parque com ela parada: ~405 desenhos por quadro; o carro
  vazio, de fundo, 20 malhas e ~51 mil.
- **Na estrada (FEITO, 2026-11-18; o Renan aprovou o Pietro e escolheu a sessão de fotos):** a Valentina mora na
  escola (`MORADORES.escola`), só depois de conhecida no marketing (`valentina-conhecida`), e na viagem dela o ensaio
  de fotos da calçada não acontece. A limusine chega com a buzina chique (`buzinaDaLimusine`), para do lado, o Pietro
  se apresenta e ERGUE A CÂMERA antiga pela janela; quem joga escolhe a POSE (coraçãozinho com as mãos, beijinho na
  bochecha, cara de modelo), o flash dispara e a POLAROID voa até o PAINEL do Bebito — fica de vez, no primeiro lugar
  livre do painel (`colocarPeca`, gravada na ficha), com a foto PINTADA na pose escolhida (`acessorios.ts`:
  `polaroid`, os rostinhos com a pele e o cabelo das fichas do Ari e do Renan, e "Perfetto! ♥ V." à mão). Uma vez só:
  com a polaroid no painel, nas outras viagens é só o oi. A memória: "Perfetto!".
- **O TAPETE VERMELHO na escola (FEITO, o pedido do Renan: "faça a animação dela descendo e o Pietro colocando o
  tapete vermelho quando chegarmos à escola"):** a primeira chegada de carro à escola depois da foto termina com o
  desfile (`eventos/bebitoMobile/desfileDaValentina.ts`, chamado pela chegada animada quando ela acaba): a limusine
  vem pela faixa da escola e para com a Valentina na frente do PORTÃO; o Pietro pula do banco alto, pega o ROLO do
  porta-malas, põe no chão e o tapete se desenrola até o portão; ele fica do lado com o LEQUE aberto; ela DESCE por
  cima da porta, desfila, posa, se despede e entra; ele enrola o tapete, sobe e a limusine vai embora. A memória: "O
  tapete vermelho"; a flag `valentina-desfilou`.
- **Estacionada:** depois do desfile, a limusine fica no lote da escola, vazia e DE LADO, atravessada em três vagas da
  fila de trás (de nariz numa vaga ela não cabe).

**As ideias de antes** (ficam para referência):

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

## Guardado para depois: o lobo rival do Flynn

Ideia do Renan (2026-11-18): um personagem LOBO para disputar com o Flynn. Ficou guardada de propósito ("deixa a ideia
do lobo guardada para fazermos depois, mas vamos terminar os carros"). Hoje ele só existe na fala do Flynn na estrada
("Vocês vão conhecer. Ele também acorda cedo…"), sem nome nem modelo. Quando chegar a vez: perguntar ao Renan quem ele
é, como é, de onde vem e como é a disputa.

## A ordem sugerida

1. **O Gatito**: o professor e a cara da escola. O ônibus amarelinho com o
   braço do PARE e a prova surpresa usam o que já existe (a placa, a apostila).
2. **A Tia Liz e as três irmãs**: o primeiro veículo com quatro bichos, e o da
   história da Venezuela (ideia do Renan). Pode vir primeiro, se o Renan
   preferir.
3. **O Flynn**: o arremesso pela janela.
4. **A Valentina**: a polaroid no painel.

## As perguntas, juntas

1. Qual carro de cada um (A, B ou C)? E por qual começar?
2. A turma passa a morar na escola, com encontro também em casa ↔ escola?
3. Quem vem de carro sai da faixa e da calçada na mesma viagem (como o
   Cookie)?
4. Os presentes que ficam no Bebito (a estrelinha do Gatito, a polaroid da
   Valentina) estão bons, ou preferem coisas na mochila?
5. A Tia Liz e as irmãs: a história de que vieram juntas da Venezuela é dita
   na conversa, ou fica só mostrada pelos detalhes (até hoje, ninguém da escola
   fala disso)? E o que a Tia Liz é delas: tia de verdade, ou a "tia" da
   cantina que veio junto?
