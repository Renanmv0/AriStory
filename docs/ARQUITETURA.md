# Arquitetura

Regra geral: **uma cena não sabe que existe um renderer.** Ela recebe um
`WorldBuilder` e monta o mundo com ele. Tudo o que é global (câmera, luz, loop,
save, HUD) vive em `core/` e é acessado pela interface `GameAPI`.

```
main.ts  →  Game  ──┬── IsoCamera      câmera ortográfica isométrica
                    ├── Input          teclado + joystick virtual
                    ├── SaveState      localStorage: flags, contadores, memórias
                    ├── Ui             HUD, diálogo, diário, transição
                    ├── Player         física XZ + CharacterRig (quem você guia)
                    ├── Companion      segue o Player, mesmo rig trocável
                    └── WorldBuilder   a cena atual
```

## `core/`

| arquivo | responsabilidade |
|---|---|
| `Game.ts` | monta o renderer e as luzes, roda o loop, troca de cena, implementa `GameAPI` |
| `IsoCamera.ts` | ortográfica a 34° de elevação; gira em passos de 45°, zoom com viés vertical |
| `Input.ts` | única fonte de entrada; `move()` devolve vetor de tela |
| `SaveState.ts` | persistência; nada mais escreve em `localStorage` |
| `materials.ts` | `toon()` / `flat()` / `line()`, todos cacheados por cor |
| `types.ts` | `SceneDef`, `InteractableDef`, `GameAPI`, colisores |

### Detalhes que custaram caro

- **Névoa**: a câmera fica fixa a 60 unidades do alvo. `fogNear` menor que isso
  embaça a cena inteira. Padrão: `near 95`, `far 200`.
- **Sombras**: o *span* da câmera de sombra acompanha o zoom, e o `normalBias`
  escala junto (`0.04 × span/22`). Sem isso aparecem triângulos de *shadow acne*
  em volta do jogador quando a câmera abre.
- **Viés vertical da câmera**: ao afastar o zoom a mira sobe
  (`(viewSize − 14) × 0.38`), senão coisas altas como a roda gigante saem
  cortadas no topo.

### A dupla

`Player` e `Companion` guardam a POSIÇÃO num grupo externo e o corpo
(`CharacterRig`) como filho. Trocar de personagem (tecla `T`) é só trocar os
filhos entre os dois — ninguém sai do lugar, e por isso a rotação mora no rig,
nunca no grupo externo.

### O beijo

`entities/Beijo.ts` é uma mecânica do motor, não de cena: quando o jogador e o
parceiro são duas fichas com `casal: true`, estão a menos de 1,5 e de frente um
para o outro, o prompt **💋 Beijar** aparece e o `E` inclina os dois, com um
coração subindo de cada lado. O prompt só aparece quando não há interativo por
perto — cenário ganha do carinho.

Duas coisas que a câmera isométrica impõe: o par gira em torno do próprio meio
até ficar de perfil (alinhado com o eixo da câmera, um esconde o outro), e os
corações sobem pelo eixo do par, não pela perpendicular — pela perpendicular
eles vêm na direção da câmera e passam por cima dos corpos.

### Escolha no diálogo

`g.ask(pergunta, opções)` devolve o índice escolhido. Os botões respondem a
clique, a ← → e à própria tecla de ação, que durante a pergunta confirma em vez
de avançar a fala.

### Água

`submersion` (0 a 1) abaixa o corpo 72 cm, corta a velocidade quase pela metade,
troca a animação para braçada e apaga a sombra do chão. A cena decide quem está
molhado; o motor só aplica. O piso precisa de buraco de verdade
(`w.groundWithHoles`), senão o corpo submerso some por baixo do plano.

## `world/`

- `WorldBuilder.ts` — a API que as cenas usam. Ver a skill `aristory-cenario`.
- `collision.ts` — círculo (jogador) contra círculos e caixas giradas, no plano XZ.
- `Interactable.ts` — ponto de interação: prompt, destaque pulsante, `enabled`,
  `priority`, `moveTo()` para objetos que andam.
- `props.ts` / `furniture.ts` — kits de peças. Ver a skill `aristory-prop`.
- `memoriasData.ts` — o acervo do quadro de memórias: cada memória é uma função
  que pinta uma foto em Canvas 2D. Ver a skill `aristory-memoria`.
- `ferrisWheel.ts` — peça animada com classe própria. As cabines ficam **fora**
  do grupo que gira e são reposicionadas por frame, para nunca virarem de cabeça
  para baixo.

## `characters/`

`spec.ts` define a ficha; `CharacterRig.ts` monta o corpo chibi (cabeça grande,
membros em cápsula) e anima a caminhada por seno. Nenhum arquivo de modelo.
Ver a skill `aristory-personagem`.

### Decalques de chão

`patch()` e `disc()` pintam sobre o chão. Superfícies coplanares brigam pelo
mesmo pixel (z-fighting) e piscam em manchas. Cada decalque recebe do
`WorldBuilder` um `polygonOffset` crescente e próprio (via `toon({ offset })`,
que entra na chave do cache de material), o que torna o empilhamento
determinístico independentemente da altura. As cenas ainda declaram alturas
distintas por camada, por legibilidade.

### Sentar e deitar: a âncora faz o trabalho

Duas poses de "estar apoiado em algo" e o mesmo truque nas duas: quem posiciona
(e no caso do deitar, quem **vira**) é uma âncora da cena, um `Object3D` passado
ao `ridePlayer`/`rideCompanion`. O rig vira filho dela e continua animando em
espaço local exatamente como em pé.

Deitar é o caso que mostra por que isso vale: a âncora tem `rotation.x = -π/2`,
e com isso o `+Y` local do rig passa a apontar para a cabeceira e o `+Z` local
para o teto. Nenhuma pose precisou ser reescrita membro a membro — `setLying`
no `CharacterRig` só troca a **animação** (pernas retas, corpo parado, o balanço
lento dos braços). O contra-exemplo está no próprio bloco: `poeAltura()` não
serve deitado, porque o Y local ali empurra a pessoa para o travesseiro em vez
de fazer o peito subir.

A cutscene da cama também troca a câmera por `setCameraOmbro`, e não pelo
`focusCamera` isométrico: deitados, os dois apontam para o fundo da cena, e é
justamente essa direção que a isométrica encurta — os corpos viravam dois tocos
ao lado das cabeças.

### Zonas de mecânica

Uma mecânica pode valer só num pedaço do cenário. A quadra de frisbee é o
exemplo: o disco só aparece na mão dentro dela, o parceiro sai do modo "seguir"
e vai se postar do lado oposto (`commandCompanion`), e a câmera abre. Sair da
zona desfaz tudo. O motor não sabe o que é uma quadra — quem guarda o retângulo
e o estado é a cena.

### O passe de volta do frisbee

O parceiro segue três passos, nessa ordem, e é isso que faz a mecânica ler:
**para** (`holdCompanion`, que zera a velocidade e planta ele no lugar),
**mira** (o passe só sai quando `companionFacing()` fecha com o ângulo do
jogador) e **lança**. Antes ele arremessava correndo, e o disco saía torto.

O alvo do passe não são os pés de quem recebe: é um ponto ~3,5 unidades ALÉM,
na mesma linha, com arco mais alto (`throwToward(..., arco)`). Assim o disco
cruza o jogador ainda voando, a uns 2,3 de altura, em vez de aterrissar em cima
dele — a janela de interceptação medida na física dobra (~0,3 s → ~0,6 s), e o
teto da pegada subiu para 3,0 porque agora o disco passa por cima da cabeça.
Quem não intercepta corre atrás: o disco cai atrás dele, de propósito.

`node scripts/frisbee.mjs /tmp/fr` mede isso de verdade — lê a posição do disco
quadro a quadro e reprova se ele voltar rente ao chão ou se o parceiro andar com
o disco na mão.

### Minigame de ping pong

`entities/PingPong.ts` guarda a partida inteira, e a decisão que a faz caber
numa cabeça só é **viver em coordenada LOCAL da mesa**: o grupo do minigame
entra como filho do `Object3D` da mesa, então o giro dela sai de graça e
nenhuma conta usa seno ou cosseno. Dentro da mesa, `x` é o comprimento (a
direção da bolinha), `y` a altura e `z` a largura; o jogador fica em `x`
negativo e o parceiro em positivo.

Três amarrações com o motor: `setCameraOmbro(de, para)` troca a isométrica por
uma **perspectiva** parada (perspectiva de propósito — é a convergência das
linhas que diz se a bolinha está perto ou longe, coisa que ortográfica não
mostra); `pointer()` entrega a posição do mouse ou do dedo em -1..1, e é ela
que move a raquete; e `showPlacar()` põe o placar no alto da tela.

O parceiro persegue o `z` da bolinha com atraso e com um erro sorteado a cada
troca — é o atraso que o faz errar, perseguição instantânea seria uma parede.
O prêmio é o chapéu de campeão, que vive no **rig** (viaja junto quando o `T`
troca os corpos) e é ligado por `aplicarPremios()` a partir da flag
`chapeu-ping-pong:<id>`.

Três coisas que a foto cobrou: câmera na altura dos olhos deixa a juba do Ari
tapando a mesa inteira (a câmera subiu e o corpo de quem joga fica invisível
durante a partida); mirar no parceiro em vez de no meio da mesa joga a mesa
para fora do quadro; e girar a raquete em `z` só roda o cabo e deixa o disco
de perfil — quem vira a face para o eixo da bolinha é `rotation.y`.

### Roupa

`rig.setOutfit('banho')` troca materiais registrados no construtor (camiseta e
calça viram pele, tênis vira pé descalço), esconde os acessórios de roupa e
mostra o calção. A cena pede pelo campo `outfit` do `SceneDef`; o motor volta
para `'normal'` a cada troca de cena e reaplica o traje quando você troca de
personagem.

## `audio/`

Som 100% sintetizado — nenhum arquivo de áudio no repositório, mesma regra dos
modelos. `nucleo.ts` tem os tijolos (`tom`, `chiado`), `efeitos.ts` guarda uma
receita por ação, `musica.ts` é um sequenciador que escreve a trilha compasso a
compasso (acordes maj7/m7, marimba na pentatônica, suingue) com um clima por
cenário, e `Som.ts` é a fachada com mudo e volume.

Duas coisas mandam no desenho: o navegador só libera áudio depois que a pessoa
encosta na página (o `AudioContext` nasce no primeiro clique, e antes disso
tocar som é um no-op), e todo agendamento usa o relógio do próprio
`AudioContext` — som marcado por `requestAnimationFrame` engasga a cada quadro
perdido. Detalhes e como criar som novo: `.claude/skills/aristory-som`.

## `ui/`

DOM sobre o canvas, dentro de `#ui` com `pointer-events: none`. `Ui.ts` é a
única coisa que cria elemento de tela. Diálogo com efeito de máquina de escrever;
primeiro clique completa a linha, o segundo avança.

**Quem quiser receber clique liga `pointer-events: auto`** — e a regra que
desliga todo mundo é `:where(#ui) > *`, com especificidade zerada de propósito.
Escrita como `#ui > *` ela ganhava de qualquer regra de classe e os botões
dentro dos painéis ficavam mortos.

### Celular

`matchMedia('(hover: none)')` põe `touch-device` no `body`, e é isso que liga os
três botões redondos. Eles são **pequenos e translúcidos de propósito**: em tela
de celular ficam por cima do balão de fala, e botão grande e opaco esconde
justamente o texto que a pessoa está tentando ler. Além disso o balão ganha um
corredor livre de 76px na direita (`padding-right`), e com menu ou diário
abertos os botões somem — eles vêm depois no DOM, então dava para apertar o ✨
por trás do painel.

`node scripts/celular.mjs /tmp/cel` mede isso: reprova se qualquer botão cobrir
um pixel do prompt, da fala ou dos botões de escolha.

### Quadro de memórias

Duas coisas parecidas com nomes parecidos, e não são a mesma:

- **Diário** (`J`): a lista de texto do que já aconteceu, alimentada por
  `g.unlock()`. Persiste no `SaveState`.
- **Quadro** (o mural no quarto do Ari): fotos da vida real deles, **pintadas
  em Canvas 2D** na hora em que o painel abre. Não persiste nada — o acervo é
  fixo, em `world/memoriasData.ts`.

O painel é DOM com um `<canvas>` dentro, e a pintura roda numa volta de
`requestAnimationFrame` que **só vive enquanto o painel está aberto** (o
desenho é vivo: as luzinhas piscam, as bandeirinhas balançam). `Ui` recebe a
lista inteira e o índice, não uma memória só — é o que deixa folhear sem
fechar e reabrir; com uma peça só, setas e pontinhos somem.

Duas pegadinhas de CSS que já morderam e o `#ui .memorias .quadro` guarda:
o seletor precisa do `#ui` porque `#app canvas { width:100%; height:100% }`
— a regra que estica o canvas do jogo — pega neste canvas e ganha por ter um
id; e o canvas é `inline-block`, porque num bloco `width: auto` significa
"toda a largura do pai" e a `proporcao` da memória passaria a sair da largura
da folha em vez da altura.

### Menu e recomeçar

O botão de três barrinhas no canto superior direito abre o menu. A única opção
tem três opções: ligar/desligar o **som**, ver os **controles** (teclado e
celular, no mesmo painel) e **recomeçar o jogo**, esta em dois passos (o segundo
clique confirma), porque ela apaga o diário. `Game.restart()` zera o `SaveState`, devolve o controle ao
primeiro da `DUPLA`, mostra as teclas de novo e volta para a cena inicial — que
o `Game` recebe no construtor (`CENA_INICIAL`, a casa do Ari). Enquanto o menu
está aberto o jogo não recebe entrada, igual ao diário.

## Ciclo de um frame

1. lê a entrada (bloqueada se há diálogo, diário ou transição aberta)
2. resolve a tecla de ação: diálogo primeiro, depois o interativo mais próximo,
   e por último o beijo
3. roda o beijo (é ele que segura os dois no lugar enquanto dura)
4. move o jogador e resolve colisão
5. recalcula qual interativo está "quente" (prioridade, depois distância) e,
   se não houver nenhum, se o beijo está ao alcance
6. roda os `w.onUpdate` da cena
7. move a câmera e a luz, renderiza
