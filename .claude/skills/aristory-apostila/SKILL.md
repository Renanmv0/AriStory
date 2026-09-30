---
name: aristory-apostila
description: Escrever ou ajustar uma lição da apostila de português do Gatito (a aula da Sala 1 da escola) — a situação, a explicação, os exercícios, as falas da aula — ou mexer no livro que desenha as lições. Use quando a tarefa for "lição nova", "mais exercícios", "mudar a explicação de X", "o Ari erra Y, põe na aula", "Módulo 2".
---

# A apostila do Gatito

A aula de português da Escola do Gatito é uma **apostila de verdade**, no molde
dos livros de curso de idioma (pedido do Renan: "igual uma escola de inglês").
Quem joga é o Ari de verdade, que é venezuelano e já entende português: a
apostila é escrita **em português**, com o espanhol do lado **só para
contrastar**.

| arquivo | o que é |
|---|---|
| `src/minigames/aula/tipos.ts` | os tipos: `Licao`, `Bloco`, `Exercicio`, `Fala` — leia os comentários |
| `src/minigames/aula/licoes/licaoN.ts` | **uma lição por arquivo**: todo o conteúdo |
| `src/minigames/aula/apostila.ts` | o `MODULO_1` (a lista das lições), a nota, a trava, o conferidor |
| `src/ui/apostila.ts` + `style.css` (fim do arquivo) | o livro: páginas, espiral, exercícios, folhear |
| `src/scenes/escolaAula.ts` | a aula na Sala 1: o Gatito na mesa, as três irmãs nas carteiras, abrir o livro |
| `src/scenes/escolaGinasio.ts` (`montarAsIrmas`) | o ginásio: quem treina, quem chama a aula, o salto e a estrelinha |
| `docs/ESCOLA.md` §6 | o plano e o que já foi decidido |

## O molde de uma lição

**O número de páginas é LIVRE** (pedido do Renan: "as aulas só precisam ser
dinâmicas e únicas, cada uma com desenhos e exercícios que fazem sentido com
o tópico"). O que não muda é a ORDEM:

1. **💬 Para começar** — a primeira página de `explicacao`: o título (número,
   emoji, situação, assunto) sai sozinho em cima; depois os **objetivos**
   ("Nesta lição você vai…"), a **cena** (um diálogo em quadrinho, com o
   rosto de cada um) e as **palavras da cena**;
2. **📐 Como funciona** — as outras páginas de `explicacao`, UMA OU MAIS: a
   regra, com texto curto, **tabela**, o **contraste** 🇻🇪 × 🇧🇷, **exemplos**,
   e as caixas **⚠️ Fique de olho!** (a pegadinha), **🐾 Dica do Gatito** e
   **🇧🇷 Cantinho do Brasil** (a cultura). Tema grande ganha mais páginas;
   tema pequeno pode caber numa só (aí a lição tem só a "Para começar");
3. **✏️ Mãos à obra!** — os exercícios, numa página ou em várias:
   `novaPagina: true` num exercício faz ele começar a página seguinte (bom
   para separar "reconhecer" de "produzir", ou quando a página fica longa);
4. **✅ Agora eu consigo…** — sai sozinha do `consigo` da lição, com as
   estrelas e o bilhete do Gatito;
5. **📝 Anotações** — o livro põe sozinho quando a conta dá ímpar, para a
   lição seguinte começar na página da esquerda da dupla. Não escreva.

As seis lições do Módulo 1 têm duas de explicação e uma de exercícios (quatro
páginas). O que faz uma lição ser BOA não é o tamanho: é a cena, os desenhos
(`figura`, emoji das palavras) e os exercícios terem a ver com o tema dela, e
cada uma ter a sua cara — não copiar o formato da anterior.

Isso é o que os livros de curso fazem (Interchange, English File): situação
antes da regra, a regra com exemplo, prática variada, e a autoavaliação em
"can do" no fim. E o que os livros de português para hispanofalantes fazem
(Mano a Mano): tudo **contrastivo** — o erro de quem fala espanhol é previsível.

## Escrever uma lição nova

1. Copie `licoes/licao1.ts` para `licoes/licaoN.ts`, troque `id` (texto
   curto, sem acento, **nunca mais muda**: é a chave do save), `numero`,
   `titulo`, `subtitulo` (a SITUAÇÃO criativa), `assunto` (a língua), `emoji`,
   `cor` (`coral · mostarda · rosa · verde · azul · lilas`).
2. Registre em `MODULO_1.licoes` (`apostila.ts`), na ordem.
3. `node scripts/apostila.mjs` — o conferidor diz o que está errado.
4. Olhe o livro (abaixo) e as falas da aula no jogo.

### O tema

Cada lição tem uma **situação própria e um lugar do jogo**: o primeiro dia na
Sala 1, o jantar no Mania, a caça ao novelo pela escola, a horta da Josefina,
um domingo no Villa Lobos, o cafezinho na sala dos professores. Não repita
lugar nem formato de cena, e ligue com o que o Ari já viu no jogo (o
"esquisito" da Luna no ginásio, o cartaz "C de cafuné" da Sala 1).

### Os blocos (`Bloco`)

`objetivos`, `cena`, `palavras`, `texto`, `tabela`, `contraste`, `exemplos`,
`dica`, `atencao`, `brasil`. Texto corrido aceita **só** `**negrito**` e
`*itálico*` — nada de HTML (o livro escapa tudo). Toda linha de tabela tem o
número de colunas da tabela (o conferidor cobra).

### Os dez exercícios (`Exercicio`)

| tipo | o que é | detalhe |
|---|---|---|
| `escolha` | múltipla escolha | `figura` opcional: o "onde está?" (caixa ou mesa) |
| `conversa` | bate-papo de celular | `com` fala, o Ari escolhe; a conversa anda turno a turno |
| `vf` | verdadeiro ou falso | |
| `ligar` | ligar as colunas | a direita sai embaralhada; um `porque` para o exercício |
| `lacunas` | texto com `{0}`, `{1}` e banco de palavras | `distratores` NUNCA iguais a uma resposta; um `porque` por lacuna |
| `ordenar` | montar a frase | `pedacos` na ordem certa, 3 ou mais; o livro embaralha |
| `digitar` | escrever | `antes` [campo] `depois`; acento esquecido vale, com aviso |
| `classificar` | separar em grupos | todo grupo tem que ter alguém |
| `erro` | ache o erro | `errada` é o índice da palavra; `correcao` é o que aparece no lugar |
| `intruso` | qual não combina | igual à `escolha`, com outra cara |

**A regra de variedade** (pedido do Renan: "exercícios bastante variados"):
pelo menos **cinco exercícios de cinco tipos diferentes** por lição — as seis
do Módulo 1 têm sete de sete.

**Todo item tem `porque`**: é o que o Gatito diz quando a resposta sai
errada. Escreva curto, explicando a regra, não só "a certa é X".

### Errar não pune

Cada item é conferido **uma vez**: errou, o livro mostra a certa e o porquê, e
segue (§6.3 do plano). A nota é quanto saiu certo DE PRIMEIRA: terminar vale
uma estrela, 65% duas, 90% três; o save guarda a **melhor** vez, e o
"Refazer" recomeça a lição. Não invente vida, tempo ou reprovação.

### As vozes

- **Gatito**: professor carinhoso, diretor da escola, gato de verdade (nunca
  pelúcia). Chama a turma de "turma", faz o six seven.
- **Luna**: coelha venezuelana, fala português com expressões da Venezuela —
  ¡Épale!, panas, chamo, ¡Qué nota!, ¡Qué vaina!, ¡Ya va!, Naguará, burda de…
  Nunca fala da Venezuela em si. A do meio: carinhosa, animada sem gritar.
- **Sol**: a irmã laranja. Animada, FALA ALTO (caixa alta e ¡!), sempre
  feliz, exagera ("dois metros, no mínimo!"). Começa em espanhol e se corrige.
- **Estrella**: a irmã marrom. Calma, na dela, fala baixinho com reticências —
  e sempre preocupada com as duas ("Beberam água?", "Sem correr, Sol.").
- **Walter**: o cachorro garçom **só late** ("Au!", "Au?!").
- **Josefina**: a tartaruga jardineira, devagar e carinhosa ("meu bem").
- **Ari** erra do jeito de quem fala espanhol; **Renan** já sabe português e
  ajuda, sem apelido de casal inventado (isso é do Renan).
- Fala que o Renan escrever entra **literal**.

### As falas da aula (`aula`)

`chama` diz **quem chama a aula** no ginásio — é com ela que a dupla tem de
falar. O Renan pediu: a 1 é da Luna, a 2 da Sol (depois do salto dela), a 3
da Estrella (depois da estrelinha); da 4 em diante é `'qualquer'` — falar com
qualquer uma das três chama, até a escola ganhar mais personagens. Numa aula
de `'qualquer'`, a `chamada` é a turma reagindo ao sinal (vale seja quem for
que a dupla escolheu), e as três têm de estar no ginásio. Quem treina
no ginásio depende de quantas lições já têm estrela (`irmasNoGinasio`): antes
da 1ª só a Luna, antes da 2ª a Luna e a Sol, daí em diante as três — e
`scripts/apostila.mjs` reprova uma lição chamada por quem ainda não está lá.
Na Sala 1, as três estão SEMPRE sentadas.

`chamada` é quem chama, no ginásio, avisando (a missão: ela diz a fala de
sempre, o sinal toca, e vem a `chamada` — por isso ela começa como quem foi
interrompida, "¡Ya va! Ouviram o sinal?", e é ela quem fala primeiro), `abertura` é o Gatito na
Sala 1 antes de abrir o livro (termina mandando abrir na lição), e
`encerramento` vem depois da lição concluída. O Gatito fala das estrelas
sozinho (`escolaAula.ts`).

### O prêmio de uma lição

Lição pode dar roupa: `PREMIOS_DA_APOSTILA` (`world/itens.ts`), do `id` da
lição para as peças. O Gatito entrega no fim da aula, depois do
`encerramento` (`entregarPremio` em `scenes/escolaAula.ts` — as falas de lá
são as da lição 3, a do uniforme dos Gatitos; lição nova com prêmio pede falas
próprias ali). A peça em si é da skill `aristory-roupa`.

## A trava

Uma lição só abre quando **o Gatito a deu numa aula** (`abertas` no save) **e
a anterior está concluída**. A aula da vez é a primeira lição sem estrela: a
irmã da vez (`aula.chama`) chama (`aula-chamada`), e a dupla senta na Sala 1. Fora da aula, a
carteira vira "Estudar a apostila" (rever e refazer o que já foi dado).

## Coisas que já custaram foto

- **A classe `rosto`** é o retrato redondo de quem fala. A folha de rosto do
  livro é `folha-de-rosto` — com o mesmo nome, a página inteira virou um
  círculo de 38 px.
- **A cor da lição** mora em `.cor-*`, e o padrão lilás mora no
  `.livro-apostila`, não no `.pagina`: com o padrão na página, ele ganhava da
  cor da lição (mesma especificidade, regra depois).
- **O retrato de rosto** enquadra só o que APARECE (`caixaVisivel` em
  `world/retrato.ts`): o boneco carrega o chapéu de campeão escondido na
  cabeça, e o `Box3.setFromObject` contava ele.
- **Tecla em campo de texto** é do campo: o `Input` do jogo ignora keydown
  vindo de `<input>` (menos o Escape). Antes, o "e", o "t", o "j" e o
  espaço não chegavam no exercício de escrever — e o "j" abria o diário.
- O campo de texto precisa de `user-select: text`: o jogo inteiro é
  `user-select: none`, e o Safari do iPhone não deixa digitar sem isso.

## Validar

```bash
node scripts/apostila.mjs            # as lições e as regras, sem navegador
npm run build && npx vite preview --port 4173 &
node scripts/aula.mjs /tmp/au        # a aula inteira e o livro, no computador e no celular
node scripts/paginas.mjs /tmp/pag    # o livro flexível: lição com mais páginas de explicação e de exercício, e a de anotações
node scripts/irmas.mjs /tmp/ir       # as três no piquenique, quem treina e quem chama cada aula, o salto e a estrelinha
```

Para só OLHAR uma lição no livro, com o jogo aberto no console do navegador:
`jogo.abrirApostila({ licao: 'id-da-licao' })` (isso marca a lição como dada no
save — use um save de teste).
