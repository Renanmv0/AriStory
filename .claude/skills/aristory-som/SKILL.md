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
