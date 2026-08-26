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
`/tmp/aristory-casa.png`, `/tmp/aristory-villa-lobos-portao.png`, etc.
**Abra as imagens** — o script não julga composição, só erro de runtime.

## Ir direto a um ponto da cena

A URL aceita `?cena=` e `?entrada=`:

```
http://127.0.0.1:4173/?cena=villa-lobos&entrada=roda
```

Use os nomes de `entries` do `SceneDef`. Cena nova? Adicione uma entrada e
inclua a cena na lista de `scripts/smoke.mjs`.

## Ambiente

Chromium já vem instalado — **não rode `playwright install`**. O binário fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` e o smoke test já aponta
para lá (`CHROME_PATH` sobrescreve). Renderização é por software (swiftshader):
o FPS medido aqui não diz nada sobre a máquina de verdade, ignore.

A fonte do Google não carrega em ambiente sem rede — o smoke test já filtra esse
ruído. Qualquer outro erro de console é erro de verdade.

## Checklist antes de fechar

- [ ] `npm run typecheck` limpo
- [ ] smoke test sem erro de console
- [ ] olhei as fotos: nada flutuando, nada atravessando parede, nada cortado
- [ ] andei pela cena: não trava em colisor, não nasce dentro de móvel
- [ ] os prompts de interação aparecem na distância certa
- [ ] no celular (janela estreita) o HUD não cobre o personagem
