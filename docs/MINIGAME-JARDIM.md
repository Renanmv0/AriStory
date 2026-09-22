# A Estufa da Josefina — plano do minigame do jardim

> Documento de PROJETO. **Só a etapa 0 está no jogo** (§10) — a área existe e
> dá para andar nela. Da quest para a frente ainda é plano. Quando uma etapa
> for construída, marque-a aqui, e deixe o `git log` ser a fonte da verdade do
> que de fato existe.
>
> Este arquivo é o lugar de ajustar o minigame. Ele vai mudar MUITO: número de
> inimigo, dano de regador, curva de experiência, raridade de melhoria. Mexa
> aqui primeiro, no código depois.

O pedido do Renan, nas palavras dele: um minigame que começa numa **quest de
achar alguma coisa pelo mundo** — um adubo, uma substância — para as plantas da
Josefina. Ela acha bonito da nossa parte e **convida a dupla para uma área
nova**: a estufa dela, um jardim grande. Lá dentro o jogo vira um
**roguelite-survivor**: a gente começa com um **regador** que espanta os
inimigos com água, melhora o regador em si (alcance, dano, velocidade), e
depois vai pegando **melhorias aleatórias de raridades diferentes** — a cada
tanto de experiência, escolhe uma entre três.

Duas coisas ele cortou antes de começarem a existir, e elas ficam registradas
aqui para ninguém propor de novo:

- **Nada de golfinho.** Foi ideia descartada por ficar fora do escopo.
- **Nada de rato.** Em nenhuma forma, em nenhuma raridade, nem de piada. O Ari
  odeia rato de verdade, e este jogo é um presente para ele.

---

## 1. A ideia em uma frase

**Você rega, e é isso que machuca.**

O regador dispara sozinho — estilo survivor: você só anda, ele mira no inimigo
mais perto do alcance e molha. Toda a jogada está em **onde você anda**, porque
o que você está defendendo não é você: são **os canteiros**. Bicho que chega num
canteiro para de te perseguir e começa a comer, e canteiro comido não volta.

> É o inverso do survivor comum, onde a única coisa que importa é a sua vida. Aqui
> dá para terminar a onda com vida cheia e ter perdido: se os oito canteiros
> foram comidos, a Josefina não tem mais horta.

**São dois regadores.** A dupla está em cena como sempre, e o parceiro também
rega — ele segue você, com o mesmo alcance, disparando sozinho. A tecla `T`
troca quem você controla, e quem você larga continua regando de onde estava. É a
mesma tensão do turno do Mania (`MINIGAME-RESTAURANTE.md` §1): **onde eu
estaciono a minha outra metade**.

---

## 2. A quest que destranca: o adubo

A área já existe e já dá para entrar (§10). A quest é o que vai fazer ela
**significar** alguma coisa — hoje a porta da estufa está simplesmente aberta.

1. **Achar o produto pelo mundo.** Um item de mochila, `tipo: 'mao'`, como o
   osso do Walter já é. As opções, em ordem de preferência:
   - **o Noel, do bar de sucos**, tem a borra das frutas do dia — um balde de
     casca de laranja e abacaxi que ele ia jogar fora. Composto de graça, e é
     conversa de duas falas com um personagem que já existe;
   - **a Gina, na portaria**, guarda um saco de adubo que chegou por engano e
     ninguém foi buscar;
   - **cavar de novo no jardim**, num segundo montinho — funciona, mas repete a
     mecânica do osso, e repetir é o pior dos três.

   A primeira é a que ganha: liga dois personagens que hoje não se falam e não
   inventa mecânica nenhuma.

2. **Levar à Josefina.** Com o balde na mão, a conversa com ela ganha uma opção
   nova: **"Dar o adubo"**. Ela reage como ela é — devagar, sem alarde, reparando
   no detalhe — e então convida:

   > *"Isso aqui é bom demais pra horta de fora. Vem comigo, que eu quero te
   > mostrar onde é que eu guardo as coisas sérias."*

3. **A estufa deixa de ser um galpão e vira um lugar.** Antes da quest: porta
   aberta, ninguém dentro, nada para fazer além de olhar. Depois: a Josefina
   está lá dentro, e o cartaz de "Cuidar da horta" acende.

**A flag é `adubo-entregue`.** Tudo o que muda dentro da estufa lê essa flag na
hora de montar a cena. (Cuidado conhecido: estado lido na construção da cena
não acorda sozinho — ver `CLAUDE.md`; quem entrega o adubo está no clube, e
entra na estufa depois, então a cena é montada de novo de qualquer jeito.)

---

## 3. A rodada, do começo ao fim

Uma rodada é curta de propósito: **algo entre 4 e 6 minutos**. Roguelite é jogo
de repetir, e repetir só é gostoso se recomeçar é barato.

| fase | o que acontece |
|---|---|
| **preparo** | a Josefina entrega os dois regadores e diz quantas ondas vêm |
| **onda** (×5) | bichos entram pelas beiradas, andam para o canteiro mais perto, você rega |
| **escolha** | a cada nível, o jogo para e mostra **três** melhorias; você pega uma |
| **fim** | conta quantos canteiros sobraram e paga por canteiro vivo |

**O placar é canteiro, não inimigo.** Inimigo derrotado dá experiência (que é o
que faz a rodada evoluir); **canteiro vivo no fim é o que dá dinheiro**. Assim
matar tudo não é a estratégia ótima por definição — segurar a linha é.

**Nem todo bicho morre.** "Derrotar" aqui é **espantar**: o bicho encharca,
sacode, e vai embora pela beirada por onde entrou. Nada morre nesta estufa. É
regra, não detalhe de texto.

---

## 4. O regador

A arma inicial, e a única que não é escolhida — ela já está na mão.
`regador()` já existe em `world/props.ts` e já está largado no jardim do clube.

Os quatro números que definem ela, e que as primeiras melhorias mexem:

| número | começo | o que ele faz |
|---|---|---|
| `alcance` | 2,6 | raio em que o regador acha alvo |
| `dano` | 1,0 | quanto tira de encharque por jato |
| `cadencia` | 1,1 s | intervalo entre um jato e o outro |
| `largura` | 35° | abertura do leque de água (pega mais de um bicho) |

O jato é um **cone de partículas** reaproveitando os respingos que a piscina do
clube já tem (`espirrar()` em `clube.ts`) — nenhum sistema novo de partícula.

**O regador tem água, e a água acaba.** Um tanque de 12 jatos que enche sozinho
devagar, ou de uma vez encostando no **tonel** que fica no canto da estufa. É o
que impede o jogo de virar "segure para a frente e ande em círculo": de vez em
quando você TEM que voltar ao canto, e é nessa viagem que os canteiros ficam
sozinhos.

---

## 5. Os bichos que comem planta

**Esta lista é uma PROPOSTA nova, e precisa do aval do Renan** — a conversa
original em que ela apareceu se perdeu, e o que sobrou dela é: capivara sim,
golfinho não, rato nunca.

Nenhum deles é bicho nomeado do jogo. Os bichos com nome (Pelusa, Walter,
Cookie, Gina, Noel, Capy, Estella, Mano, Jean-Luc, Josefina) são **gente**, e
gente não vira alvo. Os invasores são anônimos de propósito.

| bicho | velocidade | encharque | o que ele faz de diferente |
|---|---|---|---|
| **lagarta** | muito devagar | 2 | o básico. Vai reto no canteiro mais perto e come |
| **caracol** | devagaríssimo | 6 | casca. Os dois primeiros jatos escorregam |
| **pulgão** | rápido | 1 | nunca vem sozinho: entra em nuvem de seis |
| **gafanhoto** | médio, aos pulos | 2 | pula 2 m de cada vez — o jato passa por baixo no ar |
| **coelho** | muito rápido | 3 | corre até o canteiro, dá uma mordida e volta correndo |
| **tatu** | médio | 4 | anda por BAIXO: some do chão e ressurge do outro lado |
| **pombo** | rápido | 2 | voa. Ignora canteiro e vai direto no que estiver em vaso |
| **formiga cortadeira** | média | 1 | corta uma folha e tenta LEVAR. Se ela sair com a folha, o canteiro perde um ponto mesmo sem ser comido |
| **bode** | médio | 8 | come canteiro, come vaso, come a placa. Elite: um por rodada |
| **capivara** | devagar | 12 | **adora água.** O jato praticamente não incomoda: ela só sai empurrada, a jato queima-roupa. A chefe da quinta onda |

A capivara é a piada da fase e a lição de design ao mesmo tempo: existe um
inimigo contra o qual a sua arma inteira não serve, e a resposta é posicionar,
não atirar. (E ela não é o **Capy**, o salva-vidas — são capivaras diferentes, e
alguém tem que dizer isso em voz alta numa fala.)

O elenco cresce como o do Mania: **cada bicho é uma linha numa lista**. Bicho
novo é uma entrada nova, não uma mexida no motor.

---

## 6. As melhorias, e as raridades

A cada nível o jogo para e oferece **três** cartas. A raridade sai de um sorteio
com peso, e o peso muda com o nível — nível alto tira mais raro:

| raridade | cor | peso no nível 1 | peso no nível 10 |
|---|---|---|---|
| comum | verde | 70 | 35 |
| incomum | azul | 25 | 35 |
| raro | roxo | 5 | 22 |
| lendário | dourado | 0 | 8 |

**Lendária não sai antes do nível 4.** Roguelite em que a primeira carta decide
a rodada é roguelite que não tem rodada.

### As primeiras são o regador mesmo

O Renan foi explícito: **começa melhorando o regador**. As quatro comuns são as
quatro linhas da tabela do §4, e elas repetem — pegar "mais alcance" três vezes
é jogada válida.

| carta | raridade | efeito |
|---|---|---|
| Bico mais longo | comum | +18% alcance |
| Jato firme | comum | +20% dano |
| Braço solto | comum | −12% cadência |
| Leque aberto | comum | +10° de abertura |
| Tanque maior | comum | +4 de água |

### As de baixo mudam como se joga

| carta | raridade | efeito |
|---|---|---|
| Segundo bico | incomum | o jato sai também para trás |
| Poça | incomum | onde o jato cai fica escorregadio por 4 s: quem passa anda devagar |
| Orvalho | incomum | o tanque enche sozinho 50% mais rápido |
| Mangueira | raro | o alcance dobra, mas a cadência piora 40% |
| Espantalho | raro | um espantalho plantado onde você escolher puxa o alvo dos bichos por 20 s |
| Josefina ajuda | raro | ela sai do canto e rega um canteiro por conta dela, uma vez por onda |
| Chuva | lendário | a estufa inteira leva um jato, de uma vez, a cada 30 s |
| Cerca viva | lendário | um canteiro à sua escolha fica intocável pelo resto da rodada |
| Regador do Renan | lendário | o parceiro dispara na sua cadência, e não na dele |

A regra que guia carta nova: **carta comum mexe em número, carta rara mexe em
regra**. Se uma ideia de carta só sabe dar +X%, ela é comum, por melhor que
pareça.

Para criar carta nova sem reabrir este documento inteiro existe uma skill:
`.claude/skills/aristory-habilidade/SKILL.md` — **ainda não escrita** (§9).

---

## 7. A experiência

Bicho espantado solta uma **gota** no chão. A gota não vai sozinha para você:
você tem que passar por cima. É o que puxa o jogador para fora da posição
confortável, e é a mecânica mais barata de tensão que o gênero tem.

- `nivel 1 → 2`: 8 gotas
- cada nível seguinte: `8 + nivel * 5` gotas

Gota que fica no chão mais de 20 s some. Gota de bicho elite vale 5.

---

## 8. O que a estufa precisa ter (e já tem)

A área foi construída antes de tudo, de propósito — foi o pedido do Renan: *"comece
a criar a nova área primeiro, antes de ter a quest, antes de ter qualquer coisa"*.
Ela já nasceu com a planta do minigame desenhada no chão:

- **o meio é vazio.** Um terreiro de saibro de uns 14 × 10 no centro, sem nada
  em cima. É a arena, e ela precisa estar limpa para caber a corrida;
- **os canteiros estão na beirada, virados para dentro.** São eles que se
  defende, e estar na beirada é o que obriga o jogador a escolher um lado;
- **quatro bocas**, uma em cada canto da estufa: é por onde os bichos vão
  entrar. Hoje são só vãos entre os canteiros;
- **o tonel de água no canto**, que é onde o regador vai reabastecer;
- **a bancada de trabalho**, que é onde a Josefina vai ficar durante a rodada e
  de onde ela entrega os regadores.

Nada disso tem lógica ainda. É cenário — mas é cenário com a medida do jogo
já tomada.

---

## 9. A ordem de construção

| # | etapa | estado |
|---|---|---|
| 0 | **a área**: a estufa, a porta no jardim do clube, o caminho | **pronto** (§10) |
| 1 | a skill `aristory-habilidade`, para carta nova sair barato | a fazer |
| 2 | a quest do adubo (Noel → Josefina → convite) | a fazer |
| 3 | o esqueleto do minigame: onda, regador automático, um bicho só (a lagarta) | a fazer |
| 4 | os canteiros como alvo, e o placar por canteiro vivo | a fazer |
| 5 | gota, nível e a tela de três cartas | a fazer |
| 6 | as cartas comuns (as do regador) | a fazer |
| 7 | o resto do elenco de bichos, um por vez | a fazer |
| 8 | as cartas incomuns, raras e lendárias | a fazer |
| 9 | o pagamento, a memória e a fala de despedida da Josefina | a fazer |

A etapa 3 é a que decide se o resto vale: um regador que atira sozinho num
bicho que anda devagar já é jogo ou não é. **Não construa 5 antes de jogar 3.**

---

## 10. O que já está no jogo

**A estufa** (`src/scenes/estufa.ts`), ligada ao jardim do clube pelos dois
lados. A casca de fora é a peça `estufa()` do kit, plantada no fundo do jardim,
no eixo do caminho de pedrinha; por dentro é um galpão de vidro de 32 × 24 com o
terreiro no meio, oito canteiros na beirada, a bancada de trabalho, o tonel e as
prateleiras de muda.

**As peças novas do kit** (`src/world/props.ts`): `estufa()` (a casca),
`bancadaDeJardinagem()` e `tonelDeAgua()`.

**O teste**: `node scripts/estufa.mjs /tmp/es2` — prova que a porta abre nos dois
sentidos, que o terreiro do meio está mesmo vazio (nenhum colisor dentro dele),
que os oito canteiros existem e que as quatro bocas estão desobstruídas.

---

## 11. Notas de implementação, para quando chegar a hora

**O minigame mora em `src/minigames/`**, como o `turnoDoMania.ts`. Ele recebe
uma planta (`PlantaDoJardim`: onde é o terreiro, onde estão os canteiros, onde
são as bocas, onde é o tonel) e **não sabe que existe uma estufa** — quem conhece
o cenário é a cena.

**Os bichos invasores não são `Bicho.ts`.** Aquela classe é para personagem com
nome, rotina de passeio e conversa. Invasor é um enxame descartável: uma malha
simples, uma posição, um alvo e um encharque. Cuidado real — vinte instâncias de
`Bicho` por onda derrubariam o celular.

**Som.** Já existem e servem: `gluglu` (o tanque enchendo), `sino` (subir de
nível), `pegar` (a gota). Faltam receitas novas em `audio/efeitos.ts`: **jato**
(o chiado do regador) e **sacudida** (o bicho encharcado indo embora). Sintetizadas,
como todo o resto — nenhum `.wav` entra no repositório.

**HUD.** Nem `showPlacar` nem `showTurno` servem. Entra um
`showJardim({ onda, agua, nivel, gotas, canteiros })`, e a tela de escolha é um
painel novo de três cartas no `Ui.ts` — o mesmo formato do painel de inscrições
da arena, que já sabe desenhar carta com moldura por raridade.

**Teste.** O Chromium sem tela roda o tempo de jogo a ~1/5 do relógio: o script
espera por EVENTO, nunca por tempo. Asserções mínimas quando existir: o regador
dispara sozinho sem tecla; bicho parado em canteiro para de perseguir; canteiro
comido não volta; a tela de três cartas aparece no nível certo e some ao
escolher; lendária não sai antes do nível 4; e a rodada fecha pagando por
canteiro vivo.
