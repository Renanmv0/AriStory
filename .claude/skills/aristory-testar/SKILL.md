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
| `?carro=38.4,-9` | estaciona o Bebito Mobile nesse ponto da cena (o carro só chega ao jogo pela quest); `&semTeto` tira o teto e `&farois` acende as luzes |
| `?bebito` | liga o Bebito Mobile (a frente da casa, a quest do presente) num SAVE À PARTE — a chave dele está desligada no jogo (`eventos/BebitoMobile.ts`). `?semBebito` força desligado. A quest pede a lição 10: `jogo.save.concluirLicao('partiu-praia', 3)` no console e recarregar |
| `?viagem=ida,renan,7` | com `&cena=viagem-de-carro`: abre a estrada do Bebito Mobile direto, com o sentido (`ida`/`volta`), quem dirige e a semente da rota. No console, `aristoryBebitoMobile.viagem` tem o estado, a rota, o piloto automático (`piloto = 'bom'`) e a pressa (`vezes`) |

## Ambiente

Chromium já vem instalado — **não rode `playwright install`**. O binário fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` e o smoke test já aponta
para lá (`CHROME_PATH` sobrescreve). Renderização é por software (swiftshader):
o FPS medido aqui não diz nada sobre a máquina de verdade, ignore.

A fonte do Google não carrega em ambiente sem rede — o smoke test já filtra esse
ruído. Qualquer outro erro de console é erro de verdade.

## Lições de teste que já custaram tempo

- **Mudança de desempenho se prova com foto igual.** A comparação pixel a
  pixel de duas cargas da página tem RUÍDO de fundo (textura granulada, como a
  do tapete, varia entre a primeira e a segunda carga): compare antes a página
  com ela mesma (`?semFundir` contra `?semFundir`) para saber o ruído, e só
  depois a de antes com a de depois.
- **O caçador de z-fighting mede ANTES da junção.** Depois da `fundir()` os
  pedaços de mesmo material viram uma malha só e o `scripts/zfighting.mjs`
  (que mede caixa por caixa) não acha mais caixa nenhuma — passa sem medir.
  Rode com `SEM_FUNDIR=1` (ele carrega a cena com `?semFundir`). Ele mede só
  `BoxGeometry` sem giro: peça torneada, extrudada ou `RoundedBoxGeometry`
  se confere na foto de perto.
- **Teste que olha uma janela fixa de tempo oscila.** O balanço dos braços
  deitados (`cama.mjs`) tem ciclo de ~11 s de jogo, e 1,4 s de espera às vezes
  caía no topo da onda; agora espera o braço sair do lugar, com teto.

- **O Chromium daqui não é o Safari do iPhone.** Gesto do sistema (toque
  longo, lupa, arrastar imagem) só existe lá, e cancela o toque do jogo com
  `pointercancel`. Bug de toque que "não reproduz" aqui: IMITE o navegador
  (`scripts/joystick.mjs` dispara o `pointercancel` e engole os `pointermove`
  seguintes) e prove que o teste falha no código antigo antes de consertar.

- **Um Chromium de cada vez.** Dois scripts rodando juntos deixam a máquina
  lenta, e testes de tempo (`postos.mjs`, `estufa.mjs`, `livro.mjs`) falham
  de mentira. Rode em fila: `for t in a b c; do node scripts/$t.mjs …; done`.
- **O Chromium sem tela anda a ~1/5 do relógio.** Espere por EVENTO (uma
  condição, com teto), nunca por tempo fixo. A rodada do jardim tem
  `escalaDoTempo` para acelerar; os bichos do clube (Noel, Capy) andam no
  relógio do jogo, e não no da rodada.
- **Cena mais bonita anda mais devagar AQUI.** O passo do jogo é limitado a
  1/20 s, e a quadros por segundo do Chromium sem placa caem com a cena
  (o Mania reformado e a boutique rodam a ~2 q/s; o Mania antigo, a 3,7).
  O `mania.mjs` empurrava a dupla 4 s e 9 s cravados e passou a reprovar —
  pior: o "o balcão segura" passava SEM ela ter chegado ao balcão. Empurrar
  é andar ATÉ PARAR (esbarrou ou atravessou), e conferir que ela encostou.
- **`pkill -f` com o nome do script mata o seu próprio shell** (a linha de
  comando contém o nome). Deixe o teste acabar ou use o id do processo.
- **`page.evaluate` que devolve uma promessa de painel** (livro, fim, fala)
  trava até o painel fechar: use `void` dentro do evaluate.
- **O servidor de preview serve o `dist/`**: mudou código, `npm run build`
  antes de testar, senão o teste roda a versão velha.
- **`locator(...).textContent()` ESPERA o elemento aparecer** (30 s por
  padrão). Para perguntar "qual é o prompt agora?", num laço, isso vira 30 s
  por volta quando não há prompt — o `aula.mjs` ficou doze minutos parado
  assim. Leia com `page.evaluate(() => document.querySelector(sel)?.textContent)`.

- **Cutscene que reposiciona o jogador destrava o `E`** (`releasePlayer`
  solta a trava): o teste que avança fala apertando `E` abria a porta da casa
  no meio da cena e trocava de cena — o sintoma era "o objeto sumiu"
  (`getObjectByName` dando `undefined`). Ver a skill de cenário.
- **Cutscene longa no Chromium sem placa**: o relógio anda a um quinto. A
  cutscene expõe um multiplicador de ritmo (`ritmoDoPresente.vezes`), e o
  teste espera por ESTADO (a flag, a posição do carro), nunca por tempo.
- **`Som.contagem` é um `Map`**: `jogo.audio.contagem.get('buzinaDoBebito')`,
  e não `.contagem.buzinaDoBebito`.
- **Peso de cena nova**: `window.jogo.renderer.info.render` na vista de
  entrada, e a conta por peça (percorrer `jogo.current.world.root.children`
  somando malhas e triângulos por `userData.peca`) diz de onde vem. A frente
  da casa do Ari tinha 1.341 malhas em peças sem nome — eram os canteiros.

- **Jogo de dirigir se testa com um PILOTO na cena**, e não com teclas no
  tempo: o Chromium sem placa roda a poucos quadros, e segurar uma seta por
  meio segundo vira um metro ou dez. O `scripts/viagem.mjs` liga o piloto
  automático da viagem (que segue os corações e para nas faixas) e espera
  por ESTADO; as teclas de verdade são conferidas à parte, cada uma até o
  efeito acontecer (`waitForFunction`).

- **Medir peça de enfeite instanciada**: a pegada lida da geometria pura
  sai errada no lote de planta (`InstancedMesh`): cada cópia vale pela
  matriz dela (`getMatrixAt` e depois a `matrixWorld`). O `quintal.mjs` faz
  assim; a primeira versão mediu a hortênsia com 1 m e o agave com 10 cm.
- **A regra de ouro, medida**: a mesma vista com e sem `?semFundir`,
  fotografada e comparada pixel a pixel NO navegador (`createImageBitmap` e
  `getImageData` sobre os dois PNG) — ver a parte `colocar` do `quintal.mjs`.
  Só no computador: no celular o joystick e as dicas mudam de uma carga para
  outra.
- **Painel de HTML com texto digitado** (a fala, a pergunta): o texto vem
  letra a letra; espere ~2 s ou espere pelo texto inteiro antes de ler.

## Checklist antes de fechar

- [ ] `npm run typecheck` limpo
- [ ] smoke test sem erro de console
- [ ] olhei as fotos: nada flutuando, nada atravessando parede, nada cortado
- [ ] andei pela cena: não trava em colisor, não nasce dentro de móvel
- [ ] os prompts de interação aparecem na distância certa
- [ ] o parceiro consegue seguir sem ficar preso em colisor
- [ ] no celular (janela estreita) o HUD não cobre o personagem
