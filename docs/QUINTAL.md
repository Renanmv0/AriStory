# Decorar o quintal da casa do Ari

> Plano. NADA disto está construído: só o jardim foi limpo para receber os
> enfeites. Cada etapa marca aqui o que entrou no jogo; o `git log` é a fonte
> da verdade do que mudou por último.

## COMECE AQUI

**O pedido do Renan (2026-11-12)**: "No quintal da casa, o Ari vai adorar poder
decorar, então tire os canteiros do chão e monte somente o plano de um sistema
para decorar o quintal, parecido com o da estufa da Josefina, mas com mais
opções de lugares para colocar. Não faça ainda, monte um plano disso. Os
arbustos com o chão de outra cor já pode tirar mesmo."

**Estado**: o jardim da frente da casa (`scenes/frenteDaCasa.ts`) é grama limpa
— saíram os canteiros de casca e de pedrisco e as plantas deles (hortênsias,
lavanda, agaves, capim de pluma, costela-de-adão e margaridas). Ficaram o
caminho de lajes, os dois buxinhos em vaso da porta, a árvore florida e a hera
dos muros. As plantas continuam no kit (`world/plantasDeJardim.ts`): é delas
que sai boa parte do catálogo do quintal.

**A ideia em uma frase**: o MESMO decorador da estufa (`world/decorador.ts`),
ensinado a pôr enfeite em cinco tipos de lugar em vez de um — no chão, no piso
(cobrindo o chão), na parede, em cima (do muro, da janela, da prateleira) e
pendurado (no pergolado, no beiral, no galho) —, mais os que se amarram de um
ponto a outro (varal de luzinhas, bandeirinhas, rede).

| etapa | o quê | estado |
|---|---|---|
| **0** | limpar o jardim | ✅ feita (2026-11-12) |
| **1** | o motor: o save sabe EM QUE LUGAR está cada enfeite; o quintal com o catálogo de hoje, no chão; o baú e o "Decorar o quintal" | ⬜ |
| **2** | os PISOS (deck, caminho, canteiro de desenhar) e as PLANTAS do kit como enfeite | ⬜ |
| **3** | PAREDE, EM CIMA, PENDURADO e de PONTA A PONTA | ⬜ |
| **4** | os MÓVEIS que fazem alguma coisa (banco, balanço, rede, mesa, piscininha, casinha do Pelusa) | ⬜ |
| **5** | a LOJA do quintal e a moeda | ⬜ |

Uma etapa por vez, parando ao fim de cada uma para o Renan escolher (como o
projeto faz). **As perguntas da §9 vêm antes da etapa 1** — a 1 e a 2 mudam o
desenho do motor.

O quintal mora na frente da casa, que hoje só existe com a chave do Bebito
Mobile ligada (`eventos/BebitoMobile.ts`): enquanto ela estiver desligada, o
quintal decorado também fica escondido (`?bebito` para ver). Ver a pergunta 1.

---

## 1. O que já existe (e se reaproveita inteiro)

O sistema da estufa (skill `aristory-enfeite`) foi feito para ser de qualquer
cena — ele só fala com o `WorldBuilder` e a `GameAPI`:

| peça | o que faz | no quintal |
|---|---|---|
| `world/decorador.ts` (`Decorador`) | monta os enfeites do save, o modo de colocar (o fantasma translúcido na frente de quem anda, o anel verde/vermelho, a barra girar/colocar/cancelar), o modo de edição ("Mexer no…", mudar, girar, guardar), o colisor e o desvio de quem passeia | o MESMO; ganha os tipos de lugar (§3) |
| `RegrasDoLugar` | a cena diz onde NÃO pode (parede, canteiro, vão de passagem) | o quintal escreve as dele (§3.1) |
| `Cofre` | de onde sai o pagamento (na estufa, os girassóis) | o quintal escolhe a moeda (§7) |
| `world/decoracoes.ts` | o catálogo: uma função e uma ficha por enfeite | cresce (§4); cada ficha diz ONDE pode ir |
| `world/retrato.ts` | a foto do cartão da loja, tirada do `monta()` | igual |
| `scripts/enfeite.mjs`, `scripts/decorar.mjs` | medem a pegada e a altura e fotografam; a lojinha e os modos inteiros | ganham o quintal (§8) |

E o que falta, que é o pedido: hoje todo enfeite é um CÍRCULO NO CHÃO.

---

## 2. Por que mais lugares

Quintal de verdade se decora em tudo: vaso no muro, quadrinho na parede, varal
de luzinha no pergolado, balanço no galho, deck no chão. E a câmera ajuda: a
fachada da casa, a lateral direita e as paredes da garagem ficam VIRADAS para
ela (`+Z` e `+X`) — são as paredes mais à vista do jogo, e hoje estão vazias.

---

## 3. Os lugares de pôr

Cada ficha do catálogo diz em que TIPO de lugar ela vai (`lugares: [...]`), e a
cena do quintal declara as SUPERFÍCIES que tem de cada tipo. O decorador junta
as duas coisas: o fantasma só "gruda" onde aquele enfeite cabe.

### 3.1 CHÃO — como na estufa

Na grama do jardim, andando, com a pegada redonda (`raio`). As regras do
quintal (`RegrasDoLugar`), a conferir na foto:

- **o caminho de lajes fica livre** (a regra da casa: "passagem tem eixo, e o
  eixo fica vazio") — da porta ao portão, e o ramal até a passagem da mureta;
- a frente da porta (o degrau e os dois buxinhos), a passagem da mureta, e o
  arco que a folha do portão social varre quando abre (ela abre para dentro);
- a garagem: a vaga e a manobra do carro ficam livres; o fundo da garagem,
  atrás do carro, pode (vaso, bicicleta…) — a ver na foto;
- o pé da árvore (o tronco e as raízes);
- **a altura conta**: o muro da frente e o da direita estão do lado da câmera.
  Perto deles, só enfeite baixo (até ~1,2 m, a régua do `enfeite.mjs`); o que é
  alto (guarda-sol, balanço, árvore de enfeite) vai da metade do jardim para
  trás, perto da casa. Quem decide é a altura da ficha, medida (`alto`).

### 3.2 PISO — o que cobre o chão

Deck de madeira, caminho de pedras, pedrisco, canteiro de terra ou de casca,
gramado de flores, tapete de área externa. **É o "canteiro" que saiu, devolvido
às mãos do Ari**: ele desenha onde quer canteiro. O piso:

- é um DECALQUE (não tem altura), em formas prontas — retângulo de quina
  redonda, redondo, oval e "caminho" em S —, em três tamanhos, e gira;
- NÃO colide, e outro enfeite pode ficar EM CIMA dele (é o ponto do piso: a
  mesa no deck, a hortênsia no canteiro); dois pisos podem se cruzar, e o que
  foi posto por último fica por cima (a ordem de pintura do chão, skill de
  cenário);
- o caminho de lajes da casa é um piso também — pergunta 4: fica fixo ou o Ari
  pode mexer?

### 3.3 PAREDE — o que se pendura na parede

As paredes que a câmera VÊ: a fachada (dos dois lados da porta, entre as
janelas e abaixo do beiral), a lateral direita da casa, o fundo e o lado da
garagem, e a face de fora do muro (a da rua). **A face de dentro do muro da
frente e do da direita não**: ela olha para longe da câmera e ninguém a veria.

- cada parede é um RETÂNGULO declarado pela cena (onde começa, onde acaba, de
  que altura a que altura, para onde olha), com os buracos dela (porta,
  janelas, lampião, interfone);
- o fantasma anda grudado na parede mais perto à frente de quem joga: andar ao
  longo dela move o enfeite de lado; para cima e para baixo, dois botões na
  barra (ou a altura vem pronta da ficha — mais simples; pergunta 6);
- a pegada é um retângulo na parede, e o anel vira uma moldura verde/vermelha.

Peças: vaso de parede, arandela, quadrinho, a plaquinha com o nome da casa,
o número da casa, o sino de vento, a casinha de passarinho, a treliça com
trepadeira, o relógio de parede de jardim, o espelho de jardim.

### 3.4 EM CIMA — o que se apoia num tampo

O topo do muro e da mureta, o peitoril das janelas (a floreira), o degrau da
porta e a prateleira do fundo da garagem. São LINHAS (o muro) ou RETÂNGULOS
pequenos (o peitoril, a prateleira), e o enfeite anda nelas como no chão,
grudado na altura do tampo. Peças miúdas: vasinho, suculenta, gatinho de
cerâmica, lanterninha de mesa, regador pequeno, abajurzinho solar.

### 3.5 PENDURADO — o que desce de cima

As vigas do pergolado (a garagem), o beiral da casa e o galho da árvore. São
pontos ou linhas no alto; o enfeite pende deles (corda ou corrente até a
peça). Peças: vaso pendente com samambaia, sino de vento, lanterna de papel,
gaiolinha de enfeite, filtro dos sonhos — e o **balanço no galho da árvore**
(que é móvel: §4.4).

### 3.6 DE PONTA A PONTA — o que se amarra em dois pontos

Varal de luzinhas, bandeirinhas, cordão de lanternas e a **rede**. Põe-se em
dois toques: a primeira ponta (num ponto de amarrar — pilar, viga, beiral,
galho, poste do muro) e a segunda; a peça faz a curva (catenária) entre os
dois. Os pontos de amarrar são da cena, como os de pendurar.

### 3.7 Como fica o modo de colocar

O de sempre — anda-se para escolher, a barra de baixo tem girar, colocar e
cancelar (G, E e X no teclado; botões no celular) — e:

- o fantasma GRUDA na superfície que serve àquele enfeite e está mais perto à
  frente de quem joga; se não houver nenhuma por perto, ele fica vermelho no
  chão com a dica ("chegue perto de uma parede");
- ao entrar no modo, a câmera abre um pouco (mais quintal na tela) e o Q/R
  continua girando — enfeite de parede se põe melhor de frente para ela;
- ponta a ponta: o primeiro E marca a ponta A, o segundo a B; X desfaz.

---

## 4. O catálogo do quintal (proposta — o Renan escolhe)

Os enfeites de hoje da estufa (o anão, o flamingo, a lanterninha, a
capivara…) servem ao quintal também: a ficha deles ganha `lugares: ['chao']` e
`cenas: ['estufa', 'quintal']`. E entram:

### 4.1 Plantas (do kit `world/plantasDeJardim.ts`)

Hortênsia (três cores), lavanda, capim de pluma, agave, costela-de-adão,
margaridas, buxinho no vaso — e novas: roseira, girassol (o da Josefina!),
samambaia, espada-de-são-jorge (a do quarto do Ari), suculentas, uma hortinha
(alface, tomate, temperos). As plantas de cada espécie seguem num LOTE para o
quintal inteiro (é assim que foram feitas), então cem margaridas pesam como
uma.

*Ideia a decidir* (pergunta 7): a planta posta CRESCE — muda pequena no dia em
que se põe, e grande depois de umas visitas; e o regador da prateleira da
garagem rega.

### 4.2 Pisos

Deck de madeira, caminho de pedras redondas, pedrisco branco, canteiro de
terra, canteiro de casca, tapete de área externa, gramado de flores miúdas.

### 4.3 Luz

Lanterninha (a da estufa), luminária solar de espeto, arandela de parede,
varal de luzinhas (ponta a ponta), lanterna de papel pendurada, luz no pé da
árvore. Luz pintada, como manda a skill (halo e poça, nenhuma luz de verdade).
De noite (quando a casa tiver noite) elas fazem o quintal.

### 4.4 Móveis (os que FAZEM alguma coisa — etapa 4)

| móvel | o que se faz |
|---|---|
| banco de jardim | sentar os dois (o `w.banco` de sempre) |
| balanço no galho | um senta e balança; o outro empurra |
| rede | ponta a ponta; deitar os dois (`g.setLying`) e balançar |
| mesa com guarda-sol | sentar de frente um para o outro; quem sabe um lanche |
| espreguiçadeira | deitar ao sol |
| piscininha de plástico | os pés na água (o "sentar na beirada" do lago) |
| fogueira de quintal / fire pit | sentar em volta (de noite) |
| casinha do Pelusa | **o Pelusa passa a vir para o quintal** e dorme nela |
| comedouro de passarinho | passarinhos pousam (o `bebedouro` da estufa já existe) |

### 4.5 Da vida deles (pergunta 8)

A plaquinha com o nome da casa, o número, um capacho, a bicicleta encostada,
o quadrinho de uma memória do quadro do quarto pendurado na parede de fora…
— o que o Renan quiser que esteja lá. Pede foto ou descrição, não se inventa.

---

## 5. O save

`DecoracaoNoSave` (`core/types.ts`) hoje é `{ uid, id, posta: { x, z, giro } }` —
ele não diz em que CENA o enfeite está. Passa a ser:

```ts
{
  uid, id,
  posta: null | {
    cena: 'estufa' | 'quintal',          // ausente no save de hoje → 'estufa'
    encaixe: 'chao' | 'piso' | 'parede' | 'emCima' | 'pendurado' | 'pontaAPonta',
    x, z, giro,                          // chão, piso, em cima
    y?,                                  // parede, pendurado: a altura
    superficie?,                         // o id da parede, do tampo, da viga
    ate?: { x, y, z },                   // ponta a ponta: a segunda ponta
  }
}
```

`normalizarDecoracoes` conserta na leitura, como sempre: save de antes vira
`cena: 'estufa', encaixe: 'chao'`, e superfície que não existe mais devolve o
enfeite ao baú (nunca some). O **baú é um só** para o casal: o que está
guardado aparece nos dois lugares, e cada ficha diz onde pode ir.

---

## 6. O motor (o que muda no código)

- **`Decorador`**: ganha as SUPERFÍCIES da cena (`RegrasDoLugar.superficies`:
  as paredes, os tampos, as vigas, os pontos de amarrar) e o "grudar" do
  fantasma; o anel vira moldura na parede; o ponta a ponta em dois toques. A
  estufa continua igual (só chão), e o `decorar.mjs` prova isso.
- **A ficha** (`FichaDeDecoracao`) ganha `lugares` (os encaixes que aceita),
  `cenas`, e `alto` (medido, para a regra da câmera). Piso ganha `forma` e
  `tamanho`.
- **A cena do quintal** declara as regras e as superfícies, monta o
  `Decorador` e o ponto de entrada: **"Decorar o quintal"** — proposta: uma
  caixa de ferramentas de jardinagem na prateleira da garagem, que abre o baú
  (o que tem guardado, e "Arrumar o quintal" para o modo de edição). Pergunta 5.
- **Leveza** (a regra de ouro do projeto): cada enfeite passa pela `fundir()`;
  enfeite repetido (dez vasinhos iguais) e planta viram LOTE; piso é decalque
  com a geometria juntada por material. Medir a vista do quintal cheio (umas
  50 peças) no commit, antes e depois.

---

## 7. A loja e a moeda (etapa 5 — pergunta 2)

Três caminhos, e eu recomendo o primeiro:

1. **O catálogo pelo correio**: a revista de jardim na mesinha da sala (ou no
   celular de alguém); o que se compra CHEGA numa caixa na caixa de correio do
   portão na visita seguinte, e abrir a caixa põe no baú. Paga com os **reais
   da carteira do casal** (os do Mania, do clube…). Fica tudo em casa, e a
   caixa de correio ganha um uso.
2. **Uma aba "Para casa" na lojinha da Josefina**, em girassóis — junta o
   quintal ao minigame do jardim (a Josefina é jardineira; faz sentido ela
   vender as plantas).
3. **Uma loja de jardinagem nova**, uma parada da viagem de carro (liga com a
   etapa D do Bebito Mobile).

Dá para misturar: as plantas na Josefina (girassóis) e o resto pelo catálogo
(reais).

---

## 8. Como testar (quando for feito)

- `scripts/quintal.mjs` (novo): pôr e tirar um enfeite de cada tipo de lugar
  pelo modo de verdade; as regras (o caminho, a porta, o portão e a garagem
  recusam); a altura perto dos muros; o save com o lugar e a superfície,
  recarregar e tudo no lugar; o save antigo (sem `cena`) vira estufa; a estufa
  de sempre igual; o peso do quintal cheio; o celular.
- `scripts/enfeite.mjs` e `scripts/decorar.mjs` continuam passando.

---

## 9. Perguntas ao Renan (antes da etapa 1)

1. **Quando o quintal entra no jogo?** Ele é a frente da casa, que hoje só
   existe com a chave do Bebito Mobile (escondida até o carro estar pronto).
   O quintal espera o carro, ou a frente da casa (sem o carro e sem a garagem
   em uso) entra antes, só para decorar?
2. **A moeda e a loja**: o catálogo pelo correio em reais (o que eu
   recomendo), a aba na lojinha da Josefina em girassóis, uma loja nova, ou
   misturado (§7)?
3. **Os lugares**: os cinco tipos (chão, piso, parede, em cima, pendurado) e o
   ponta a ponta — algum sobra, algum falta? Vale decorar a GARAGEM (o fundo e
   a parede) e o lado de fora do muro (a rua)?
4. **O que é fixo**: o caminho de lajes, os dois buxinhos da porta, a árvore
   florida e a hera dos muros ficam como estão, ou viram enfeites que o Ari
   também pode mexer e guardar?
5. **Por onde se decora**: a caixa de ferramentas na prateleira da garagem
   (o que eu proponho), um caderninho de ideias, ou a própria caixa de correio?
6. **Parede**: escolher a altura do enfeite na hora (dois botões a mais na
   barra) ou cada enfeite já vem na altura certa (mais simples)?
7. **Planta que cresce e que se rega** (§4.1): entra, ou planta já vem
   pronta?
8. **O que é DELES** (§4.5): tem alguma coisa do quintal ou da vida dos dois
   que tem que estar lá (o nome da casa, um objeto, uma planta que o Ari
   ama)? E as plantas e os enfeites que o Ari mais gosta, para o catálogo.
9. **Os móveis da §4.4**: quais entram (e o balanço e a rede, que são
   cutscene de casal, eu escrevo as falas e mando para aprovar)?
