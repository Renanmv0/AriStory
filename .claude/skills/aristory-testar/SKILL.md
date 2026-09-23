---
name: aristory-testar
description: Rodar, ver e validar o AriStory — build, servidor de preview, capturas de tela das cenas no Chromium headless e checagem de erros de console. Use sempre antes de dizer que uma mudança de cenário, personagem ou peça está pronta.
---

# Ver o AriStory rodando

O jogo é visual: mudança de cenário ou de personagem **não se valida lendo o
diff**. Tire foto e olhe.

## Ciclo completo

```bash
npm run typecheck          # rápido, roda sempre primeiro
npm run build
npx vite preview --port 4173 --host 127.0.0.1 &   # deixa rodando
node scripts/smoke.mjs /tmp/aristory
```

`scripts/smoke.mjs` abre cada cena, espera assentar, salva os PNGs e devolve
código 1 se houve erro de console. As imagens saem como
`/tmp/aristory-casa.png`, `/tmp/aristory-villa-lobos-portao.png`,
`/tmp/aristory-clube-beira.png`, etc.
**Abra as imagens** — o script não julga composição, só erro de runtime.

Os outros dois:

| script | o que faz |
|---|---|
| `scripts/ride.mjs` | a cutscene da roda gigante ponta a ponta, com os dois na cabine |
| `scripts/retrato.mjs` | câmera colada no personagem, para conferir cabelo e roupa |
| `scripts/mecanicas.mjs` | a escolha Sim/Não, a cena do sofá e o frisbee de ida e volta |

## Ir direto a um ponto da cena

A URL aceita `?cena=` e `?entrada=`:

```
http://127.0.0.1:4173/?cena=villa-lobos&entrada=roda
```

Use os nomes de `entries` do `SceneDef`. Cena nova? Adicione uma entrada e
inclua a cena na lista de `scripts/smoke.mjs`.

Outros parâmetros de depuração:

| parâmetro | efeito |
|---|---|
| `?zoom=4.5` | aproxima a câmera |
| `?em=12,20.8` | põe a dupla nesse ponto do mundo |
| `?olhar=3.14` | ângulo que eles encaram |

## Ambiente

Chromium já vem instalado — **não rode `playwright install`**. O binário fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` e o smoke test já aponta
para lá (`CHROME_PATH` sobrescreve). Renderização é por software (swiftshader):
o FPS medido aqui não diz nada sobre a máquina de verdade, ignore.

A fonte do Google não carrega em ambiente sem rede — o smoke test já filtra esse
ruído. Qualquer outro erro de console é erro de verdade.

## Lições de teste que já custaram tempo

- **Um Chromium de cada vez.** Dois scripts rodando juntos deixam a máquina
  lenta, e testes de tempo (`postos.mjs`, `estufa.mjs`, `livro.mjs`) falham
  de mentira. Rode em fila: `for t in a b c; do node scripts/$t.mjs …; done`.
- **O Chromium sem tela anda a ~1/5 do relógio.** Espere por EVENTO (uma
  condição, com teto), nunca por tempo fixo. A rodada do jardim tem
  `escalaDoTempo` para acelerar; os bichos do clube (Noel, Capy) andam no
  relógio do jogo, e não no da rodada.
- **`pkill -f` com o nome do script mata o seu próprio shell** (a linha de
  comando contém o nome). Deixe o teste acabar ou use o id do processo.
- **`page.evaluate` que devolve uma promessa de painel** (livro, fim, fala)
  trava até o painel fechar: use `void` dentro do evaluate.
- **O servidor de preview serve o `dist/`**: mudou código, `npm run build`
  antes de testar, senão o teste roda a versão velha.

## Checklist antes de fechar

- [ ] `npm run typecheck` limpo
- [ ] smoke test sem erro de console
- [ ] olhei as fotos: nada flutuando, nada atravessando parede, nada cortado
- [ ] andei pela cena: não trava em colisor, não nasce dentro de móvel
- [ ] os prompts de interação aparecem na distância certa
- [ ] o parceiro consegue seguir sem ficar preso em colisor
- [ ] no celular (janela estreita) o HUD não cobre o personagem
