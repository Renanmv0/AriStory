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
  `tiroPistola`, a linha da mangueira (`jato.daMangueira`) toca `mangueira`, o
  cone do regador toca `jato`. Ferramenta nova = uma receita e uma linha ali.

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
