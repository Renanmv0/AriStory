---
name: aristory-habilidade
description: Criar ou ajustar uma carta (habilidade) do minigame do jardim do AriStory — as melhorias que aparecem de três em três quando a rodada da estufa sobe de nível (bico mais longo, poça, chuva, os dois na frente). Use quando pedirem "cria uma carta nova", "mais uma habilidade pro jardim", "uma lendária que faz X", "essa carta está forte/fraca demais", ou para mexer no sorteio, nas raridades, na curva de nível ou no registro das cartas já pegas.
---

# Criar uma carta do jardim

Carta é **melhoria da rodada da estufa**: a cada nível o jogo para, mostra
três, e o jogador fica com uma. Tudo o que é carta mora em **três arquivos de
lógica pura** — nenhum deles conhece cena, motor ou malha:

```
src/minigames/jardim/cartas.ts      o catálogo CARTAS, a FichaDaRodada e as regras
src/minigames/jardim/baralho.ts     a MaoDeCartas: o registro do que já foi pego, e o sorteio
src/minigames/jardim/progressao.ts  a curva de nível, as gotas de cada praga e as ondas
scripts/cartas.mjs                  mil rodadas simuladas, no Node, em menos de um segundo
docs/MINIGAME-JARDIM.md §6 e §7     o plano: as tabelas, e o PORQUÊ de cada carta
```

Se o pedido for um **bicho** novo para a estufa, a skill é a `aristory-praga`.

---

## 1. A regra que não se discute: carta nenhuma se repete

Pedido do Renan. Carta que já está na mão **não aparece de novo** — nem na
oferta seguinte, nem na mesma mesa de três.

Quem garante isso é a `MaoDeCartas`, e não quem escreve a carta:

```ts
const mao = new MaoDeCartas();      // nasce vazia a cada rodada (nível 0)
mao.oferta(nivel, rng);             // as 3 da tela — nunca uma que a mão já tem
mao.pegar('bico-1', nivel);         // false se já tem, se falta a série, se exclui
mao.ficha();                        // os números de AGORA, derivados do zero
mao.estiloDoRegador();              // o regador da mão, pronto para regadorDeJardim()
```

- **A mão guarda ID, e só.** Ficha, estilo do regador e estágio são
  *derivados* da lista toda vez. Não existe número acumulado que escorregue.
- **Uma rodada, uma mão.** A rodada começa sempre do nível 0 (é o gênero); a
  mão NÃO vai para o `SaveState`.
- **O dado vem de fora** (`rng`): mesmo dado, mesma oferta, e o teste repete.

### "Mas eu quero empilhar alcance" → SÉRIE

O que o plano antigo chamava de "comum que repete" virou **série**: `Bico mais
longo`, `Bico mais longo II` e `III` são três cartas, e a II só sorteia com a I
na mão (`requer`). Use o ajudante `serie(...)`:

```ts
...serie('bico', 3, {
  familia: 'regador', raridade: 'comum', icone: '📏',
  nome: 'Bico mais longo', texto: 'O regador alcança 18% mais longe',
}, (f, degrau, total) => {
  f.alcance *= 1.18;
  f.estilo.bico = degrau / total;    // o bico da peça estica um terço por degrau
}),
```

Os ids saem `bico-1`, `bico-2`, `bico-3`; o nome ganha " II", " III".

---

## 2. O contrato de uma carta

```ts
{
  id: 'poca',                       // único no baralho; é o que a mão guarda
  nome: 'Poça',                     // o título da carta
  familia: 'jardim',                // regador | jardineiro | jardim
  raridade: 'incomum',              // comum | incomum | raro | lendario
  icone: '🫗',                      // um emoji: é o desenho da carta
  texto: 'Onde o jato cai fica escorregadio por 4 s, e o bicho anda devagar',
  requer: ['...'],                  // opcional: só sorteia com estas na mão
  exclui: ['...'],                  // opcional: nunca junto destas (DE MÃO DUPLA)
  nivelMinimo: 6,                   // opcional: senão vale o piso da raridade
  aplicar: (f) => f.regras.add('poca'),
},
```

- **`aplicar` só escreve na `FichaDaRodada`.** Nunca guarda estado fora dela,
  nunca toca em cena. A mão chama `aplicar` de todas as cartas, em ordem, toda
  vez que alguém pede a ficha.
- **`texto` em até 70 letras**, começando com maiúscula. Ele cabe numa carta
  de celular; o teste mede.
- **`exclui` é de mão dupla**: se A exclui B, B exclui A. O teste reprova o
  contrário (senão pegar B primeiro deixaria A sair).

### Número ou regra?

A `FichaDaRodada` tem os números (`alcance`, `dano`, `cadencia`, `largura`,
`tanque`, `recarga`, `velocidade`, `coleta`, `vidaDoCanteiro`) e um conjunto
de `regras`. **Regra nova é DUAS coisas**: uma linha no tipo `RegraDoJardim`
(com o comentário do que ela faz) e o código no minigame que a obedece. Sem a
segunda, a carta existe, é escolhida e não faz nada — o pior bug possível
numa tela de escolha.

> **Toda regra que existe hoje é obedecida** pela rodada
> (`minigames/jardim/rodada.ts`). Regra nova de jato = a linha no tipo, o
> código na rodada e a animação em `jato.ts` (§5). Regra nova de jardineiro,
> jardim ou clube = a linha no tipo e o código num destes lugares da rodada:
>
> | a carta age… | onde mora |
> |---|---|
> | a cada quadro, no corpo de quem rega (Pique, Assobio, Grito) | `cartasDoJardineiro` |
> | a cada quadro, no campo (Aspersor, Espantalho, trancas) | `cartasDoJardim` |
> | quando um bicho começa a comer | `aoMorder` |
> | no começo / no fim de cada onda | `comecoDaOnda` / `fimDeUmaOnda` |
> | pondo uma peça na estufa | `montarCartas` (e `recolidir`, se a peça bloqueia) |
> | perguntando um canteiro | `cartaNova` + `escolherCanteiro` |
> | chamando alguém do clube | `chamadosAgindo`, pelo `ElencoDaEstufa` da cena |
>
> **E toda uma se vê** — a regra do jato vale para as outras: o que não é água
> se desenha com os efeitos de `jato.ts` (`poeira`, `notinhas`, `ondaDeSom`,
> `broto`, `ardido`, `adubo`), e a peça nova vai para o kit (`world/props.ts`).
> Quando a carta agir, chame `this.contar(id)`: é o que o teste lê.
>
> "Uma vez por onda" é `usadoNaOnda` (a onda seguinte limpa). Peça que a carta
> põe na estufa entra por `pecaNaEstufa` (nasce crescendo e sai sozinha no fim
> da rodada).

---

## 3. A raridade: comum mexe em número, rara mexe em regra

| raridade | o que ela faz | piso | peso nv 1 → nv 10 |
|---|---|---|---|
| **comum** | +X% num número (série, se empilha) | 1 | 70 → 35 |
| **incomum** | um número forte, ou uma regra pequena | 1 | 25 → 35 |
| **raro** | uma regra que muda o jeito de jogar | 2 | 5 → 22 |
| **lendário** | muda a rodada inteira | **4** | 0 → 8 |

Se uma ideia só sabe dar +X%, ela é **comum**, por melhor que pareça. O teste
cobra: carta comum que liga regra reprova (as exceções declaradas são
`bota`, `segundo-tonel` e `sino-da-porta`, que são conforto e não jogada).

**Lendária não sai antes do nível 4.** Roguelite em que a primeira carta decide
a rodada não tem rodada.

---

## 4. As três famílias têm que estar na mesa

| família | mexe em | como se sente |
|---|---|---|
| **regador** | os números do jato e as regras dele | "eu bato mais forte" |
| **jardineiro** | você: velocidade, coleta, o corpo, o parceiro | "eu me viro melhor" |
| **jardim** | a estufa: canteiro, tonel, portas, a Josefina | "o campo joga a meu favor" |

O sorteio escolhe a raridade pelo peso e, dentro dela, **prefere uma família que
ainda não está na mesa** — e sorteia a família antes da carta, senão o regador
(que tem 21 comuns) ganharia sempre. Resultado medido: as três famílias juntas
em quase toda mesa do começo.

**Consequência para quem cria carta:** família com poucas comuns aparece pouco
no começo. Se o `jardim` ou o `jardineiro` ficar sem comum disponível cedo, a
mesa vira dois regadores — prefira dar comum à família mais magra.

---

## 5. O regador muda de cara

Carta de REGADOR que mexe num número **mexe também na peça da mão** (§6 do
plano). Ela escreve em `f.estilo`, com os campos de `EstiloDeRegador`
(`world/regador.ts`): `bico`, `crivo`, `tanque` (0 a 1), `ponteira`,
`caboDeMadeira`, `segundoBico`, `mangueira`, `respiro`, `nuvem`.

O `estagio` (lata → latão → competição) **não é escrito por carta**: sai de
quantas cartas de regador a mão tem (0–2, 3–5, 6+). Carta nova de regador que
precisa de um desenho que não existe → a peça é da skill `aristory-prop`, e o
`scripts/regador.mjs` mede que ela mudou mesmo.

---

### E o JATO muda de cara também — regra do Renan

> "Cada carta que muda os jatos do regador precisa mudar algo visualmente na
> animação de ataque."

Carta que mexe no jato (alcance, dano, cadência, abertura, forma, gelo, sabão…)
**tem que mudar alguma coisa que se vê no ataque**. Não existe buff invisível.
O desenho do jato tem quatro camadas — **forma**, **tinta**, **impacto** e
**chão** — e a carta escreve numa delas; camadas diferentes somam sem brigar. A
tabela carta por carta, com o som de cada uma, está no §6 do plano ("O jato
também muda de cara"). Carta nova de jato entra nessa tabela no mesmo commit.

**Como se faz** (está pronto para todas as cartas de hoje):

1. no `aplicar`, escreva no `f.jato` (`EstiloDoJato`, em `cartas.ts`) — o
   `scripts/cartas.mjs` reprova carta de jato que não escreve;
2. em `minigames/jardim/jato.ts` (`DesenhoDoJato`), desenhe: forma e tinta
   saem de `disparar()`, impacto de `respingo()` e vizinhos, chão de
   `poca()`/`garoa()`. Some um contador em `contagem` para o efeito novo;
3. em `minigames/jardim/rodada.ts`, ligue a mecânica que a carta descreve;
4. em `scripts/jato.mjs`, um caso novo com o que tem que aparecer, e olhe a
   foto (`?cena=estufa&jato=<id>` mostra ao vivo).

## 6. Os consolos: quando o baralho acaba

Rodada boa pode chegar num nível com menos de três cartas novas. Tela com uma
carta não é escolha, tela vazia é travamento: os buracos se enchem com
`CONSOLOS` (`Gole d’água`, `Muda de reserva`, `Susto`). Eles são `repetivel`,
**não entram na mão**, não contam para o estágio, e fazem uma coisa NA HORA
(`naHora`), que o minigame executa. **Consolo nunca aparece enquanto houver três
cartas de verdade** — o teste cobra. São três de propósito: com o baralho vazio,
a mesa é só consolo.

---

## 7. A curva e as gotas (progressao.ts)

- **Nível**: o primeiro custa 5 gotas e o degrau cresce 1 a cada 2 níveis
  (5, 7, 10, 13, 17, 21, 26, 31, 37, 43). Escrito como degrau, não potência:
  a potência arredondada fazia o degrau ENCOLHER no meio.
- **Gotas por praga** ficam na ficha da praga (`FichaDePraga.gotas`, em
  `world/bichosDoJardim.ts`), e sobem com o tier: fraco 1, médio 2–3, tanque 8,
  chefe 25.
- **Ondas**: `ONDAS` é a tabela do §3; `planoDaOnda(n, rng)` devolve quem entra,
  quando e por qual porta. Cada onda estreia um bicho em ordem de tier, e ele
  entra **sozinho, por uma porta só, nos primeiros 10 s**. Tanque e chefe
  entram só como `anunciados`, numa hora marcada.
- **O alvo**: uma rodada inteira, sem ninguém escapar, termina perto do
  **nível 10**. Carta nova não muda isso; bicho novo ou onda nova muda — rode o
  teste.

---

## 8. A tela das três cartas — ela desenha a carta sozinha

Carta nova **aparece bonita na tela sem uma linha de CSS**. A tela
(`src/ui/telaDeCartas.ts`, desenho no bloco "TELA DAS TRÊS CARTAS" do
`style.css`) recebe uma `CartaNaTela`, e tudo nela é DERIVADO da carta em
`minigames/jardim/tela.ts`:

- a **moldura** vem da `raridade` e a **fita** da `familia`;
- as **bolinhas da série** vêm do id (`bico-2` é o degrau 2 da série `bico`);
- o selo **"muda o regador"** vem de aplicar a carta numa ficha zerada e ver
  se ela escreveu no `estilo`. Ele nunca mente: carta que deixa de mexer na
  peça perde o selo sozinha.

O que isso cobra de quem escreve a carta: **`texto` curto** (até 70 letras — é
ele que decide a altura da carta no celular) e um **`icone` que se entenda
sozinho num círculo de 86 px**: é o desenho da carta.

Para ver a carta nova na tela sem rodada: `?cena=estufa&treino=gotas` liga um
treino em que as gotas caem e a tela abre com o sorteio de verdade. Para ver
uma carta ESPECÍFICA, o `scripts/gotas.mjs` monta a mesa à mão
(`window.jogo.escolherCartaDoJardim(...)` com `window.aristoryCartas`) — é o
jeito de fotografar uma lendária, que o sorteio raramente mostra.

## 9. Validar

```bash
npm run typecheck
node scripts/cartas.mjs          # baralho, mão, sorteio, mil rodadas, curva e ondas
```

Carta que mexe no desenho do regador também pede `node scripts/regador.mjs`;
carta que mexe no jato pede `node scripts/jato.mjs /tmp/jt` (e olhar a foto
dela), e mexer na rodada pede `node scripts/rodada.mjs /tmp/rd`.

Carta de jardineiro, jardim ou clube ganha **um caso** em
`scripts/cartasNaRodada.mjs`: uma `laboratorio([...])` com a carta na mão, o
que ela precisa para agir (`soltarBicho`, `ferirCanteiro`, `forcarFimDeOnda`,
`soltarGotasAqui`…), e um `confere` que exige o efeito NO MUNDO — o bicho
recuou, o canteiro sarou —, não só o contador. Ponha um enquadramento na tabela
`FOTO` e olhe a foto: `node scripts/cartasNaRodada.mjs /tmp/cr <id>`.

Depois, **escreva a carta na tabela da família no §6 do
`docs/MINIGAME-JARDIM.md`** — com raridade e efeito. É lá que o Renan ajusta o
minigame, e carta que só existe no código ninguém balanceia.

## 10. O banco de ideias virou baralho

As 46 ideias numeradas que o §6 do plano guardava **viraram carta de uma vez**,
a pedido do Renan (ele ajusta depois de testar). Hoje são 93 cartas: as 88 de antes e mais os cinco
*chamados* (Capy, Gina, Walter, Noel e o Mutirão do clube), que o Renan pediu
depois — raros e uma lendária que trazem alguém do clube PARA DENTRO da estufa
por um tempo. Cada chamado exclui a carta do mesmo bicho que já agia de longe.

**Chamado é carta com `chama: ['capy']`** (os ids em `AjudanteDoClube`). Pegar
uma carta dessas dispara a cutscene de entrada em `scenes/estufa.ts` ("OS
CHAMADOS"): a porta abre, o bicho entra, fala, e vai para o posto. Chamado novo
de um bicho que já existe = a carta com `chama` + uma entrada em
`FALAS_DO_CHAMADO`. Bicho do clube novo = também uma entrada em `AJUDANTES`
(classe, nome de quem fala, posto e som). `scripts/chamados.mjs` confere que
ele vem de fora da porta, fala, e para no posto — e que a Gina passa abaixada. Ideia nova
que surgir numa conversa vai para o §6 como proposta, e só vira carta quando ele
escolher — a escolha é dele.

O que ficou devendo, e quem pegar a etapa 3 precisa saber:

- **Quase todas ligam regra** (as ⚙ das tabelas). Cada `RegraDoJardim` tem um
  comentário dizendo o que ela faz: é a especificação para o código da rodada.
- **Seis números novos na ficha** para as que só mexem em número:
  `empurraoDoJato` (Gota pesada), `contraOGrandao` (Água morna), `refil`
  (Refil rápido), `gastoPorJato` (Chapéu de palha), `recargaParado` (Descanso
  na sombra) e `compostagem` (Compostagem).
- **As novas de regador não mudam a peça ainda** — sem desenho, sem selo.
- Pares que se excluem: *Mira no grandão* × *Mira em quem come*, *Refil
  rápido* (a série inteira) × *O Jean-Luc no tonel*, *Troca de turno* × *Os
  dois na frente*. *Pé na poça* `requer` a *Poça*.

## 11. Cartas que já existem e as que foram cortadas

- **Mãos dadas** e **Regador do Renan** saíram quando o Renan decidiu que, na
  rodada, quem não é controlado fica LÁ ATRÁS com a Josefina. As duas só faziam
  sentido com os dois na frente desde o começo. No lugar delas entraram
  **Lá de trás** (incomum: quem ficou atrás rega o canteiro mais perto dele) e
  **Os dois na frente** (lendária: o parceiro pega o outro regador e vem). Elas
  se excluem.
- Nada de golfinho e nada de rato — nem como carta, nem de piada (§ topo do
  plano).
