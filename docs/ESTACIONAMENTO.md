# O guarda do estacionamento do Villa Lobos — plano

> Documento de PROJETO: **o guarda e a loja continuam para depois**. Renan
> antecipou apenas a chegada animada em 2026-11-12 (ver atualização abaixo).
> O `git log` é a fonte da verdade para o que foi publicado. Continua o
> `docs/BEBITO-MOBILE.md` (o estacionamento já existe, §6) e vem DEPOIS do
> `docs/BEBITO-MOBILE-DENTRO.md`.

## Atualização da chegada (2026-11-12)

Renan pediu antecipar **só a animação de chegada**, sem o guarda: aproximar,
parar, abrir a cancela, entrar e estacionar. Em implementação/validação em
`eventos/bebitoMobile/chegadaNoParque.ts`; a viagem agenda a animação apenas em
memória, sem criar uma flag persistente que a repetiria ao recarregar.
O personagem, a avaliação e a loja continuam para depois das novas rotas.
**Viagens com piloto automático também valem para desbloquear recompensas.**

## COMECE AQUI

**O pedido** (Renan, 2026-11-12): "criar um personagem que vai cuidar do
estacionamento do parque, então vai ter uma **cancela**, e uma **animação
quando formos entrar lá**, e um personagem que **se preocupa muito se as
pessoas são bom motoristas ou não**, então ele dará **recompensas por dirigir
bem, que custarão corações**."

**Estado:** guarda e recompensas ainda em planejamento, com as perguntas da §7.
A entrada animada foi separada da E2 e antecipada, sem personagem, nesta atualização.

**A ideia numa frase:** quem toma conta do estacionamento é um fiscal
preocupadíssimo com o jeito que a gente dirige — ele recebe o carro na
cancela, comenta a viagem que a gente acabou de fazer (ele sabe se a gente
parou na faixa, se bateu, se levou susto) e **troca corações por recompensas
para o carro** de quem dirige bem.

### As etapas (propostas)

| etapa | o quê | depende de |
|---|---|---|
| **E1** | o personagem (modelo, jeito, a guarita) e as falas de apresentação | as respostas da §7 (espécie, nome, jeito) |
| **E2** | entrada automática antecipada, sem guarda; a recepção pelo personagem e a saída ficam para depois | E1 apenas para a recepção pelo guarda |
| **E3** | **o julgamento**: ele comenta a viagem que acabou, pelo que ela de fato teve (§3.3) | E1 |
| **E4** | **os corações viram moeda** (carteira de corações) e a **loja de recompensas** dele | E3 + decisões da §7 |
| **E5** | acabamento: sons, celular, memória, save, peso e testes | todas |

---

## 1. O que já existe (conferido no código, 2026-11-12)

| peça | onde | o que dá |
|---|---|---|
| **o estacionamento** | `eventos/bebitoMobile/noParque.ts`, `world/estacionamento.ts` | o lote do outro lado da rua do ônibus, as duas filas de vagas, a vaga rosa com o coração e a plaquinha "BEBITO MOBILE", o **totem de pagamento**, a placa azul do "P", quatro carros dos outros |
| **a cancela** | `Cancela` (`world/estacionamento.ts`), ligada em `noParque.ts` | a barra que **sobe quando alguém chega perto** (a pé ou de carro), na entrada dos carros, na ponta de baixo (`−Z`) do lote. Hoje é automática: não tem ninguém por trás dela |
| **a chegada de carro** | `scenes/viagemDeCarro.ts` e `eventos/bebitoMobile/chegadaNoParque.ts` | avaliação da viagem, chegada à cancela, abertura, entrada e manobra até a vaga; ao recarregar, o carro já está estacionado |
| **a nota da viagem** | `estrelasDaViagem(tropecos, sustos)` (`rota.ts`) | 3 estrelas se ninguém tropeçou nem levou susto, 2 até 3 pontos, 1 depois disso (susto vale 2) |
| **o que a viagem conta** | `estado` da cena: `tropecos`, `sustos`, `gentilezas` (parou na faixa e no sinal), `coracoes`, `vistos` | é o material de que o julgamento (§3.3) fala |
| **os corações** | `estado.coracoes` + `bebito:recorde-de-coracoes` | **hoje só são pontos**: aparecem na tela, fecham a viagem e viram o recorde. **Não dão nada** e **não acumulam** (cada viagem recomeça do zero) |
| **a peça de recompensa** | `world/bebitoMobile/ficha.ts` (o catálogo) | cada peça do carro é um item com `nome`, `vaga` e uma **`origem`** (de onde ela vem na vida dos dois): Jean-Luc de painel, Estrela do Ari, Chaveiro do Pelusa, Laço de presente, Emblema dos Gatitos, Six seven, adesivos da Roda gigante, do Mania e do Sorvete do Mano, Calota clássica… |
| **bicho de posto, dentro de peça de balcão** | skill `aristory-bicho` | a girafa da portaria do clube (Gina) é o molde: ele fica no posto, a cabeça do lado de fora da parede da frente, nada acima e à frente dele |
| **a carteira do casal** | `g.carteira()`, `g.ganhar()`, `g.gastar()` | uma só para os dois, em reais — o molde da carteira de corações |

## 2. O personagem

**Quem é.** Eu NÃO invento quem ele é: espécie, nome, cara e voz são da vida
dos dois e pedem a resposta do Renan (§7, perguntas 1 a 4). O que o pedido já
diz do jeito dele:

- **cuida do estacionamento** — tem posto, uniforme e uma cancela para
  controlar;
- **se preocupa MUITO com como as pessoas dirigem** — é o traço dele. Ele
  repara em tudo, tem opinião sobre a faixa de pedestres, a lombada e o
  susto, e fala do carro com carinho e do motorista com um olho meio
  desconfiado;
- **recompensa quem dirige bem**, e a moeda dele são **corações**.

**Como ele se monta** (o molde de sempre, skill `aristory-bicho` +
`threejs-geometry` e `threejs-animation`): um bicho de posto
(`entities/bichos/`), com `voz` (a cor da fala dele em `characters/vozes.ts` e
na paleta) e o rosto "colado" da régua do jogo. **A guarita** é uma peça do kit
(`world/`), no molde da portaria do clube: rasa, com o vão da janela grande e
a cabeça dele do lado de FORA da parede da frente — a mesma regra do "bicho
dentro de peça de balcão" (o telhado e a sombra dele tapam; a câmera olha de
`+X/+Z`). Os acessórios que combinam com o cargo (apito, prancheta, colete
refletivo, boné, um cone de trânsito de companhia) são ideias, e o Renan
escolhe.

**Onde ele fica:** na entrada dos carros, ao lado da cancela
(`ENTRADA`/`X_DA_SEBE` em `noParque.ts`). A guarita não pode tapar nem a
cancela nem o ônibus (a regra que o estacionamento já segue).

## 3. O que cada parte é

### 3.1 A cancela e a animação de entrada (E2)

Hoje a cancela sobe sozinha quando alguém chega perto. Com ele, ela passa a
ser **dele**:

1. **A chegada.** Ao fim da viagem (a fase `chegando`, em que o carro encosta
   e para sozinho), o carro para **na cancela**, e uma cena curta mostra: o
   guarda sai da guarita, **dá a volta no carro olhando** (a prancheta, o
   apito), se debruça na janela de quem dirige e **comenta a viagem** (§3.3);
   então **aperta o botão e a cancela sobe**, e o carro entra e estaciona na
   vaga do coração (o que a `chegada` já faz hoje, só que mais devagar e com
   ele acenando).
2. **A saída** ("Voltar pra casa de carro"): o carro sai da vaga, vai à
   cancela, ele se despede (uma fala curta de quem se preocupa: "dirija com
   cuidado!") e ela sobe.
3. **A pé**: quem chega a pé pela passagem de pedestres não precisa da cancela
   (ela continua sendo só para carros); ele só fala quando se conversa com
   ele.

A cancela ganha um comando de cena (`abrir`/`fechar` explícitos, ao lado do
automático de hoje, que continua para quem entra a pé), e o som dela (o motor
da barra, o "clac" no fim) entra na lista dos sons novos.

### 3.2 A conversa dele (E1)

Falar com ele no posto, quando não é a chegada: a apresentação dele (uma vez),
o que ele acha de motorista, o **"Como eu estou dirigindo?"** (a nota de
carreira, §3.3) e o **balcão das recompensas** (§3.4). **As palavras são do
Renan:** as minhas são rascunho, provisórias, e a fala que ele escrever entra
literal.

### 3.3 O julgamento: ele sabe como a gente dirigiu (E3)

O que faz o personagem funcionar é ele falar **da viagem que de fato
aconteceu**, e os dados já estão no `estado` da cena (§1). Em vez de uma fala
fixa, o guarda escolhe a reação pelo que a viagem teve:

| o que aconteceu | a reação dele (ideias) |
|---|---|
| 3 estrelas, parou nas duas faixas e no sinal | aliviado, quase emocionado; é o "motorista que eu sonhava" |
| parou, mas bateu num cone ou numa obra (`tropecos`) | aponta o amassadinho que NÃO existe e pergunta se foi de propósito |
| levou susto (`sustos`: o carro freou sozinho em cima da linha) | a preocupação em pessoa; reclama pela patinha da tartaruga |
| muitos corações (a viagem cheia) | "essa estrada tava bonita, hein?" |
| **quem dirigiu**: o Ari ou o Renan | cada um ouve o seu jeito (o Renan é o "motorista" da quest) |

A **carreira de motorista** (um número que cresce com as viagens) pode ficar de
uma vez em estrelas médias: quantas viagens, quantas de 3 estrelas, quantas
gentilezas. Ele fala dela no balcão e ela **destrava as recompensas** (§3.4).

### 3.4 Os corações viram moeda e a loja de recompensas (E4)

**O que muda no jogo:** hoje os corações da viagem não somam. Para eles
custarem alguma coisa, passam a **acumular** numa **carteira de corações**
(`bebito:coracoes`, uma só para os dois, no molde da carteira do casal em
reais), enquanto o **recorde** continua sendo a medida da melhor viagem. Os
corações da viagem **vão para quem dirige** (decisão do Renan em
`docs/BEBITO-MOBILE-DENTRO.md`, §7): o que se discute aqui é só se a
carteira é uma por pessoa ou uma do casal (pergunta 7).

**O que ele vende: "recompensas por dirigir bem".** A leitura que fiz do
pedido: duas travas, e o preço em corações é a segunda.

- **dirigir bem abre a porta**: a recompensa só aparece depois de a carreira
  (§3.3) chegar a um marco — por exemplo, "3 viagens de 3 estrelas" ou "10
  gentilezas";
- **e custa corações**: cada recompensa tem um preço, e a carteira paga.

**O que são as recompensas:** as **peças do catálogo do carro** (§1), que já
nascem ligadas a um lugar real da vida dos dois (a `origem`): o jeito mais
fiel ao projeto é **cada recompensa ser uma peça nova do catálogo** (um
adesivo, um penduricalho, uma calota, um detalhe do painel). As ideias que
cabem no que o carro já tem de vaga (painel, retrovisor, chave, teto,
porta-malas, banco de trás, vidro traseiro, para-choque, rodas) estão na
pergunta 6 — e é o Renan quem diz quais são, porque a `origem` de cada uma é
um pedaço da história dos dois.

**Pendência de projeto:** a **edição do carro pelos dois** (trocar as peças
da ficha) está marcada como "só depois" (`docs/BEBITO-MOBILE.md` §3). Enquanto
ela não existe, uma recompensa comprada pode **entrar no carro sozinha** (na
vaga dela) em vez de ficar numa lista para escolher — pergunta 5.

### 3.5 O que isto pede ao motor

- `Cancela` com `abrir`/`fechar` por comando e a posição da barra animável;
- o bicho do guarda (`entities/bichos/`) e a guarita (kit), com a cor da fala;
- a **carteira de corações** no save (`SaveState`) e o `g.corações()`/
  `g.gastarCoracoes()` no `GameAPI`, no molde de `carteira`/`gastar`;
- uma **cutscene de chegada ao estacionamento** (a câmera de cena já existe,
  como a da quest do presente), cancelável como as outras;
- sons novos (cada um medido em `.wav`): o apito, o motor da cancela, o "clac"
  da barra, um "tchan" de recompensa.

## 4. O que NÃO é deste plano

- A edição do carro pelos dois (já está marcada como "depois").
- As demais rotas (parque ↔ clube ↔ escola). Se outra rota tiver estacionamento,
  o guarda pode ter um irmão lá — é decisão futura.
- O carro por dentro e o passageiro (`docs/BEBITO-MOBILE-DENTRO.md`), que vem
  antes.

## 5. Testes, fotos e peso (o que cada etapa precisa provar)

`scripts/guardaDoEstacionamento.mjs` (novo), uma parte por etapa:

- **o personagem**: fica no posto, aparece inteiro, a cabeça fora da parede da
  frente da guarita, os pés no chão, fala e tem a cor da fala dele;
- **a cancela**: o carro chega, a cancela só sobe **depois** do guarda; o carro
  entra e estaciona na vaga (a posição medida, como o teste do estacionamento);
  na saída, o mesmo; a pé continua automática; a cancela nunca desce em cima de
  ninguém;
- **o julgamento**: para cada viagem (3 estrelas; com tropeço; com susto; muitos
  corações), a fala certa; e o carro do teste (`depuracaoDaViagem`) já produz
  essas viagens;
- **a carteira**: os corações da viagem somam, gastar tira, sem saldo não
  compra, o recorde continua certo, recarregar a página guarda tudo, e um save
  antigo sem a carteira abre bem;
- **as recompensas**: cada uma só aparece com a carreira no marco, comprar
  paga, e a peça vai para o carro na vaga dela (foto);
- **o peso**: o estacionamento hoje desenha pouco; o antes e o depois no
  commit, e o `scripts/zfighting.mjs` na guarita.

Fotos de cada passo, no computador e no celular em pé (`CEL=1`), olhadas.

## 6. Ordem acordada

Primeiro, validar o interior e a chegada automática. Depois, novas rotas
Villa Lobos ↔ clube e clube ↔ escola. Só então o guarda: E1 → complemento
da E2 (recepção e saída) → E3 → E4 → E5. A carteira e a loja mexem no save
e dependem das respostas sobre as recompensas.

## 7. As perguntas para o Renan (para quando formos fazer)

**Quem é ele** (a vida real dos dois não se inventa):

1. **Que bicho ele é?** (Os do jogo já são: pato, girafa, capivara, cachorros,
   gato, flamingo, ursa, ovelha, coelhas… Algum que ainda não apareceu?)
2. **Qual o nome dele?**
3. **Como ele é por fora**: o uniforme, os acessórios (apito, prancheta,
   colete, boné, cone), a cor.
4. **Como ele fala e se comporta**: nervoso, mandão, fofo, dramático? E o que
   ele diz quando está preocupado de verdade?

**As recompensas:**

5. **A recompensa entra no carro sozinha, ou vira uma lista** para a dupla
   escolher (que depende da edição do carro, que está marcada como "depois")?
6. **Quais são as recompensas?** Eu proponho que cada uma seja uma peça nova do
   catálogo do carro, com a origem na vida dos dois. Quais lugares, pessoas ou
   coisas viram peça? (O Renan escolhe e escreve a `origem`.)
7. **Os corações são uma carteira por pessoa (quem dirigiu ganha) ou uma só do
   casal?** (Ele já disse que os corações vão para o motorista; falta saber se
   somam num cofre único.)
8. **Quanto custa cada recompensa**, e **qual é o marco de "dirigir bem"** que
   abre cada uma? (Se ele não disser, eu proponho uma escala: as primeiras
   baratas, e as de 3 estrelas seguidas caras.)

**A cena:**

9. **A animação de entrada** é só com o carro (como no plano) ou ele também
   recebe quem chega a pé?
10. **Ele também aparece na garagem de casa ou em outras rotas** quando elas
    existirem? (Eu proponho que não: ele é só do Villa Lobos.)
