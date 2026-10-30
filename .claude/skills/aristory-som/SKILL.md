---
name: aristory-som
description: Mexer no som do AriStory — música de fundo, efeito sonoro de uma ação, volume, mudo. Use quando a tarefa for "criar um som para X", "a música está alta/repetitiva", "mudar o clima musical de um cenário" ou "ligar som numa mecânica nova".
---

# O som do AriStory

**Nada de arquivo de áudio.** Mesma regra dos modelos: não entra `.mp3`, `.wav`
nem biblioteca de som. Tudo é desenhado na hora com osciladores e ruído da Web
Audio API. Os `.wav` que os scripts geram são só para você ouvir — eles ficam
em `/tmp`, nunca no repositório.

| arquivo | o que é |
|---|---|
| `src/audio/nucleo.ts` | `tom()`, `chiado()`, `nota()` — os tijolos |
| `src/audio/efeitos.ts` | a tabela `EFEITOS`: um som por ação |
| `src/audio/musica.ts` | o sequenciador e os `CLIMAS` (um por cenário) |
| `src/audio/Som.ts` | a fachada: mudo, volume, clima, `play()` |

## Criar um som novo

1. Acrescente o nome em `SomNome` e a receita em `EFEITOS`
   (`src/audio/efeitos.ts`):

```ts
pulo: ({ ctx, destino, t }) => {
  tom(ctx, destino, { freq: nota(72), glide: nota(84), quando: t, dur: 0.14, vol: 0.1, tipo: 'triangle' });
  chiado(ctx, destino, { quando: t, dur: 0.12, vol: 0.05, freq: 900, glide: 2600 });
},
```

2. Toque de dentro da cena com `g.som('pulo')`, ou do motor com
   `this.audio.play('pulo')`.
3. Ouça: `node scripts/musica.mjs /tmp/som` gera `/tmp/som-efeitos.wav` com
   **todos** os efeitos em fila, um por segundo.

### O que faz um som ficar fofo aqui

- **Afinação pentatônica** (0, 2, 4, 7, 9 semitons a partir do dó). Som solto
  em frequência qualquer briga com a música; na pentatônica tudo combina.
- **Curto**: 60 a 300 ms. Só memória e recomeço passam disso.
- **Volume baixo**: 0.05 a 0.15. O que toca muito (passo, letra de diálogo)
  fica em 0.035–0.05, senão cansa em um minuto.
- **Duas camadas**: um `tom` afinado + um `chiado` filtrado. É o chiado que dá
  a textura (pano, água, papel) e o tom que dá o humor.
- **Variação**: a receita recebe `n`, um contador. Use `n % 2` para alternar
  timbres — repetir idêntico vira metrônomo (é o que o `passo` faz).
- **Som que se repete rápido e tem que soar contínuo** (a mangueira atira três
  vezes por segundo): `chiado({ …, sustenta: 0.6 })` segura o volume por 60% do
  `dur` antes de cair, e com `dur` maior que o intervalo um sopro emenda no
  outro — um jorro, e não uma fila de "fsh". Sem isso o som pulsa.
- **Cada ferramenta do jardim tem o seu jato**: o som é escolhido em
  `disparar()` (`minigames/jardim/jato.ts`) pela forma do jato — `tiro` toca
  `tiroPistola`, a linha da mangueira (`jato.daMangueira`) toca `mangueira`, a
  `nevoa` do borrifador toca `borrifada`, o cone do regador toca `jato`.
  Ferramenta nova = uma receita e uma linha ali.

## Música

Ela não é um loop gravado: um sequenciador escreve compasso a compasso, com
acordes maj7/m7, melodia de marimba presa à pentatônica e suingue nas colcheias.
Cada cenário tem um clima em `CLIMAS`, escolhido pelo **id da cena**:

```ts
'villa-lobos': { bpm: 100, tonica: 36, giro: [maj7(0), maj7(5), m7(9), dom7(7)],
                 melodia: 0.8, chocalho: true, escala: PENTA },
```

Cena nova sem clima cai no `padrao`. Para dar um clima próprio, acrescente uma
entrada com o `id` da cena.

**Clima que não é de cena** — um minigame pode trocar a música enquanto dura,
com `g.trocarMusica('id')`, e devolver a da cena com `g.trocarMusica(null)`. É
o que a defesa da estufa faz (`'rodada-do-jardim'`, ligada e desligada pela
`RodadaDoJardim`).

**Festa** (`'festa-da-torcida'`, a dança das coelhinhas no fim do módulo):
120 bpm, reto, bumbo, chocalho e a chave `palmas` — três chiados curtinhos
colados (o "clap" de várias mãos) no contratempo, nos tempos 2 e 4. O pico
dela fica abaixo do da rodada do jardim.

**A noite na clareira** (`'noite-na-clareira'`): canção de ninar de caixinha,
66 bpm em fá, marimba rara e sem chocalho; a cena liga quando anoitece e
devolve quando o dia volta. Os sons dela: `ziper` (os dentinhos passando
por cima de um "zzzz" que sobe; `n` par sobe, ímpar desce — fechar e abrir),
`grilo` (três trinadinhos a ~4,4 kHz, bem baixo: é fundo, tocado pela cena a
cada 1,4–4 s de noite) e `passarinho` (dois piados na pentatônica, de manhã).
O **Bebito book** (o caderninho da barraca) tem dois: `rabisco` (a caneta no
papel, uma letra — um risquinho de chiado agudo de ~50 ms a 0,032, que o
caderno toca no máximo a cada 45 ms; o `n` muda o filtro) e `caneta` (o
clique duplo da esferográfica quando a caneta troca de mão e quando o
elástico sai e volta).

**A etapa D da clareira** tem a música de dançar e uma família de sons:

- **`'danca-lenta'`** (o radinho): a balada de baile — 66 bpm em sol, o giro
  I–vi–ii–V das músicas de dançar agarradinho, e a chave `arpejo` no
  `Clima`: as notas do acorde uma por colcheia, subindo e descendo, num
  "plim" de caixinha (seno com um harmônico curtinho), e o acorde vira um
  fundo comprido no primeiro tempo em vez do comping. O suingue de sempre
  deixa tudo num 12/8 preguiçoso. A batida do radinho (`BATIDA_DO_RADINHO`)
  e o balanço da dança (`entities/DancaLenta.ts`) usam os mesmos 66.
- **o fogareiro**: `faisca` (o piezo), `chamaAcende` (o "fum" do gás
  pegando), `chamaApaga` (o "puf"), `gasDoFogareiro` (o chiado contínuo,
  emendado como a mangueira, ~0,016 — é fundo), `tampaTremendo`, `despejar`,
  `fritar` (a manteiga e as arepas no budare), `colherNaCaneca` e `virar`
  (o "tuc" da espátula);
- **o radinho**: `radioLiga` (o clique e a estática varrendo a sintonia),
  `radioDesliga` e `antena` (os gomos estalando, subindo);
- **o pote**: `vagaLume` (o "plim" de vidro de quando ele entra, a nota sobe
  com o `n`, e a tampa de lata fechando) e `soltarVagaLumes` (a tampa
  estalando e um arpejo brilhante subindo);
- **as estrelas**: `constelacao` (um carrilhão de vidro descendo, quando eles
  acham o coração) e `estrelaCadente` (um "fiiu" agudo descendo e um
  brilhinho no fim).

**O lago do Villa Lobos** (`scenes/villaLobos.ts`, `montarOLago`):

- `quique`: o "tic" seco da pedrinha na água e um plim por cima, subindo na
  pentatônica com o `n` — os quiques de uma pedra vêm em fila, então a
  sequência inteira vira uma escadinha acelerando;
- `ploft` (a pedra afundando: o "plop" redondo e a bolhinha depois) e `tibum`
  (forte demais: entra de bico e espirra);
- `peixePula` (o "tchup" de sair e o de voltar, alternando pelo `n`), `ploc`
  (o tigre-d'água caindo do tronco), `gota` (o mouse tocando a água) e
  `moeda` (o "tlin" da moedinha girando no ar);
- `garca`: garça não canta, GRASNA — um "kraac" rouco em duas sílabas
  (dente-de-serra grave e abafado, um quadrado uma quinta acima e chiado
  áspero por baixo, senão vira buzina); `asas`: três sopros graves, um por
  batida;
- `piado`: o "piu" do patinho, agudinho e subindo (às vezes dois).

Picos medidos no `.wav`: `tibum` 0,20 (o mais alto, de propósito), `garca`
0,14, `ploft` 0,12, `peixePula` 0,09, `ploc` 0,09, `quique` 0,07, `gota`
0,06, `moeda` 0,05, `piado` 0,03 e `asas` 0,02 (é fundo: toca junto do
grasnado, quando a garça levanta voo).

**O ônibus da festa de Halloween** (`eventos/halloween/chegadaDoOnibus.ts`):

- `buzina`: o "fon-fon" simpático de ônibus de bairro, não sirene — duas
  notas de terça graves (mi e sol da pentatônica) juntas, em dente-de-serra
  abafado (a corneta) com um quadrado baixinho uma oitava acima (o metal),
  em duas buzinadas (a segunda mais comprida);
- `motorDoOnibus`: um "brum" grave descendo com o ronco do escapamento
  (chiado passa-baixa); a cena toca em fila enquanto ele anda, mais
  espaçado quando ele freia;
- `freioDoOnibus`: o tranco grave e o "pssshh" do freio de ar;
- `portaDoOnibus`: o sopro da porta pneumática e o "clac" das folhas no
  fim (`n` par abre, ímpar fecha).

Picos no `.wav`: `buzina` 0,11, `motorDoOnibus` 0,08, `freioDoOnibus`
0,08 e `portaDoOnibus` 0,08.

**O salão da abóbora** (a festa surpresa, `eventos/halloween/noSalao.ts`):
dois climas e dois sons. `'abobora-no-escuro'` é o suspense de desenho de
antes da surpresa (58 bpm em mi menor, o acorde comprido, a marimba
raríssima e o tique-taque); a cena liga no primeiro quadro e devolve a da
cena (`g.trocarMusica(null)`) no "SURPRESA!". O clima da cena,
`'casinha-da-abobora-salao'`, é a festa de Halloween fofa: 112 bpm em ré
menor com o suingue de sempre, o pizzicato correndo, bumbo, chocalho e as
palmas. `luzesAcendendo` é o "tec" do interruptor e um arpejo de vidro
subindo (uma nota por fio de luzinha que pega); `surpresa` são três
línguas de sogra desenrolando (dente-de-serra abafado subindo um tico, cada
uma fora do tempo da outra, com o chiado de papel) e o estouro do confete.

**As balas na cesta** (`balas`, a caça de doces ou travessuras,
`eventos/halloween/caca.ts`): seis toquinhos secos de triângulo, cada um
descendo de tom (o plástico oco da cestinha), mais fracos e mais juntos, e
um "plim" de duas notas no fim. Toca em todo lugar que dá bala (o doce, a
travessura, a abóbora escondida). Pico 0,08 no `.wav` — a primeira versão
saiu com 0,03 e sumia perto do `pegar` (0,095).

Medidos no `.wav`: o clique do radinho e o "puf" da chama saíam baixos
demais (~0,03) — o filtro estreito do `chiado` come quase todo o ruído, e o
volume dele precisa compensar.

**Tensão sem perder o fofo** (o pedido do Renan para a defesa da estufa): a
marimba e os acordes com sétima continuam, e entram chaves opcionais no
`Clima` — `reto` (sem suingue), `ostinato` (pizzicato em colcheias), `bumbo`
(macio, no 1 e no 3) e `tique` (bloco de madeira, relógio de cozinha). O resto
da tensão é harmonia: tom menor, e um dominante no fim do giro que pede
resolução. Nada de metal, nada de percussão pesada. Cuidado com o pico: o
bumbo cai junto com o baixo no primeiro tempo, e os dois somados estouravam o
nível dos outros climas.

Coisas que já custaram foto (ou melhor: ouvido):

- **A melodia tem que caminhar**, não sortear nota solta: passo curto na escala
  com puxão de volta no meio. Sorteio puro soa pentatônica aleatória, agradável
  e sem memória.
- **Registro**: a marimba vive em `tonica + 31` (uma oitava e meia acima dos
  acordes). Mais agudo que isso apita e cansa.
- **O relógio é o do `AudioContext`**, nunca o do jogo: agendar por
  `requestAnimationFrame` engasga a cada quadro perdido.

## Regras que não dá para esquecer

- **Autoplay**: navegador nenhum toca som antes de a pessoa encostar na página.
  O `Som` só monta o `AudioContext` no primeiro clique/tecla; até lá `play()` é
  um no-op. Nunca assuma que há áudio no primeiro quadro.
- **Mudo** mora em `localStorage` (`aristory.som`) e tem botão no menu.
- **O ganho nasce em quase zero.** O padrão do `GainNode` é 1, e o envelope
  só vale a partir de `quando`. Quando `quando` cai um fio acima de uma
  amostra inteira (o `currentTime` do jogo mais 10 ou 20 ms faz isso), o
  Chromium liga a fonte uma amostra antes do envelope: uma amostra de ruído
  passava com volume cheio, um estalo de até 0,9 nos chiados passa-alta (o
  jato do regador estalava em ~1 de cada 8 jatos). `tom()` e `chiado()` já
  fazem `ganho.gain.value = 0.0001`; nó novo montado à mão faz igual. O
  `scripts/musica.mjs` toca cada efeito nesses instantes e reprova o estalo.
- `Som.contagem` conta quantas vezes cada efeito tocou — é como os testes
  verificam som sem ouvir.

## Validar

```bash
npm run build && npx vite preview --port 4173 &
node scripts/audio.mjs             # o áudio acorda, a música toca, cada ação dispara o seu som
node scripts/musica.mjs /tmp/som   # rende os .wav e mede nível, silêncio e passeio da melodia
```

Mudança de som **precisa** de arquivo ouvido antes de ser dada como pronta —
o equivalente sonoro da foto conferida.
