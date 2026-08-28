# AriStory — Documento de Contexto Integral

> Gerado para consulta externa (brainstorming de novas mecânicas com outra IA).
> Reflete o estado do código na branch `claude/aristory-continuous-dev-cgl6b5`
> após a rodada de melhorias de frisbee, som, UI mobile e ambientação do
> Villa Lobos. ~8.150 linhas de TypeScript próprio.

---

## 1. Visão Geral e Regras de Ouro

**Conceito.** AriStory é um presente: um jogo isométrico onde dois
personagens — **Ari** e **Renan**, um casal real — andam juntos por cenários
que existem de verdade na vida deles (a casa do Ari, o Parque Villa Lobos, um
clube com piscina que "ainda não foi visitado") e interagem com objetos do
dia a dia. Não há inimigos, pontuação de derrota, nem falha: é um simulador de
lugar e afeto, construído incrementalmente sessão a sessão, sempre com
aprovação do usuário (Renan) antes de emendar mecânica nova.

**Stack.** TypeScript + Three.js (r180) + Vite. Sem framework de UI — a
interface é DOM puro sobreposto ao `<canvas>`. Sem motor de física de terceiros
— colisão é um sistema caseiro de círculos/caixas em 2D (plano XZ). Sem
biblioteca de áudio — a trilha e os efeitos são sintetizados em tempo real com
a Web Audio API nativa.

**Restrição absoluta: zero assets externos.** Nenhum `.glb`, `.png`, `.jpg`,
`.mp3`, `.wav`, fonte customizada ou biblioteca de modelo/áudio entra no
repositório. Toda a geometria é procedural — primitivas do Three.js
(`SphereGeometry`, `CapsuleGeometry`, `CylinderGeometry`, `IcosahedronGeometry`
etc.) montadas em código. A única "textura" do jogo é texto desenhado num
`<canvas>` 2D em tempo de execução e aplicado como `CanvasTexture` (usado nas
placas de rua e nos letreiros dos quiosques) — ainda assim é código, nunca um
arquivo. Essa regra está em `CLAUDE.md` como invariante de projeto e é
repetida em todas as skills internas (`.claude/skills/aristory-*`).

**Papéis centrais — `Player` e `Companion`.** O jogo sempre carrega **dois**
personagens em cena: quem o jogador controla (`Player`) e quem o acompanha
(`Companion`, que segue a ~2 unidades e para de frente para quem controla). A
tecla `T` troca os dois — na prática troca o `CharacterRig` (o corpo 3D) entre
os dois objetos de posição; ninguém "sai do lugar", só troca de corpo. Essa é
a decisão arquitetural mais estrutural do projeto: quase toda mecânica nova
precisa pensar em "o que o outro faz enquanto isso" (ver seção 5).

**Regra de trabalho declarada em `CLAUDE.md`:** nunca emendar cenário ou
mecânica nova sem perguntar antes ao usuário; ao terminar algo, sugerir o
próximo passo e deixar a escolha com ele. Quando falta informação sobre uma
pessoa ou lugar real, perguntar em vez de inventar.

---

## 2. Arquitetura de Pastas e Componentes

```
src/
  core/        Orquestração do jogo e infraestrutura genérica
  world/       API de construção de cenário + kits de peças reutilizáveis
  characters/  Ficha declarativa de personagem + montador procedural do corpo
  entities/    Atores com física própria (Player, Companion, Frisbee, Beijo)
  scenes/      Um arquivo por cenário (casa, parque, clube), cada um um SceneDef
  audio/       Motor de som 100% sintetizado (núcleo, efeitos, música, fachada)
  ui/          Toda a interface DOM (diálogo, prompts, menu, diário, HUD)
  main.ts      Bootstrap: lê a URL, instancia Game, expõe hooks de debug
```

### `core/` — o motor

- **`Game.ts`** (~600 linhas) é o orquestrador central e implementa a
  interface `GameAPI` (definida em `types.ts`), que é a **única** superfície
  que cenas e objetos interativos podem usar para falar com o motor. Contém:
  o `THREE.Scene`, o renderer, as luzes (`HemisphereLight` + `DirectionalLight`
  com sombra ajustada dinamicamente ao zoom via `setShadowSpan`), o
  `AnimationLoop` (`tick`), a lógica de troca de cena (`build`/`goTo`, com
  fade), o estado da dupla (`Player`/`Companion`/`Beijo`), a integração com
  `Som` (áudio) e com `Ui`. Também guarda `SaveState` (persistência) e decide,
  a cada frame, qual `Interactable` está "quente" (mais próximo, maior
  prioridade) para mostrar o prompt certo.
- **`IsoCamera.ts`** — câmera ortográfica isométrica a 34° de elevação. Gira
  em passos de 45° (`Q`/`R`), faz zoom com a roda do mouse e aplica um viés
  vertical automático quando o zoom se afasta (para caber objetos altos como
  a roda gigante sem cortar o topo).
- **`Input.ts`** — única fonte de entrada: teclado, mouse/roda e um "joystick"
  virtual de toque para celular. Expõe `move()` (vetor de tela), `justPressed`,
  `isDown`. Fica "bloqueado" durante diálogo/menu/diário/transição.
- **`SaveState.ts`** — persistência em `localStorage` (`aristory.save.v1`):
  cena atual, flags booleanas (`setFlag`/`flag`), contadores numéricos
  (`bump`/`stat`) e memórias do diário. `reset()` apaga tudo — é o que o
  "Recomeçar o jogo" do menu chama.
- **`materials.ts`** — fábrica cacheada de `MeshToonMaterial` (`toon()`, com
  gradiente de 4 degraus — a cara "desenho fofo" do jogo), `MeshBasicMaterial`
  chapado (`flat()`, para céu/silhuetas/decalques) e `LineBasicMaterial`
  (`line()`). Regra de ouro do projeto: **nunca instanciar material dentro de
  uma cena**; sempre passar pela cor central `src/palette.ts`.
- **`types.ts`** — todos os contratos: `SceneDef` (o formato que toda cena
  exporta), `InteractableDef`, `Collider`, `SceneAmbient`, `Memory`, e a
  grande interface `GameAPI` com dezenas de métodos (diálogo, câmera, flags,
  a dupla, água, som).

### `world/` — construção de cenário

- **`WorldBuilder.ts`** (a API `w` que toda cena recebe em `build(w)`):
  - Chão: `ground()`, `groundWithHoles()` (usado para a piscina — corta um
    buraco de verdade no piso para o corpo submerso não "flutuar" por cima),
    `patch()` (mancha retangular — caminho, quadra) e `disc()` (mancha
    circular — lago, canteiro). Ambos os decalques recebem automaticamente um
    `polygonOffset` crescente e único (`++this.decalque`), o mecanismo que
    resolve z-fighting entre camadas de chão empilhadas.
  - Colisão: `blockBox`/`blockCircle` registram colisores 2D que
    `Player`/`Companion` resolvem a cada frame (`world/collision.ts`).
  - Objetos: `place()` (posição + rotação em uma linha) e `add()` (adiciona à
    cena e liga sombra em toda malha filha automaticamente).
  - Interações: `interact()` cria um `Interactable` (ver abaixo) — a única
    forma de tornar algo clicável/aproximável no jogo.
  - Utilitários determinísticos: `range()`, `pick()`, `rng()` com seed por
    cena (`setSeed`), para vegetação/decoração aleatória mas reprodutível.
- **`Interactable.ts`** — um objeto de raio de ativação, label, ícone,
  prioridade (para desempate quando dois prompts se sobrepõem) e callback
  `onInteract(g: GameAPI)`. Pode ser desabilitado (`enabled`), reposicionado
  em runtime (`moveTo`) e "destacado" com leve balanço quando o jogador chega
  perto.
- **`collision.ts`** — resolução simples de círculo-contra-lista-de-colisores
  e clamp aos limites do mundo (`Bounds`).
- **`props.ts`** (kit **externo**, ~1.260 linhas) — árvores (4 tipos), arbustos,
  flores, pedras (agora com semente para variar forma), bancos, postes de luz,
  lixeiras, mesa de piquenique, cercas, placas, nuvens, quiosques (com
  vitrine que muda por tipo: sorvete/suco/simples), frisbee físico, coração
  flutuante, patos, cone, piscina (casco + água), espreguiçadeira, guarda-sol,
  escada de piscina, boia, chuveiro, trampolim, casquinha de sorvete, cesta de
  disc golf, placar, arquibancada, bebedouro, bolsa de discos, refletor,
  biruta, letreiro de texto (canvas), ônibus, ponto de ônibus, e — da última
  rodada — canteiro de flores, capim, junco, vitória-régia e o domo de vidro
  geodésico.
- **`furniture.ts`** (kit **interno**) — sofá, cama, geladeira, fogão, pia,
  mesa de jantar, porta, TV, planta em vaso, máquina de lavar etc.
- **`ferrisWheel.ts`** — a roda gigante: classe `FerrisWheel` com `update(dt)`
  próprio (rotação do aro), cabines posicionadas fora do grupo que gira (para
  nunca ficarem de cabeça para baixo), trama de vigas/cabos desenhada como
  `LineSegments` (barata), pernas, base de concreto, contrapesos e cabine de
  embarque com toldo. Expõe `boardingCabin()` (cabine mais próxima do
  embarque) e `turnsSince(angle)` (quantas voltas desde um ângulo de
  referência) — é o que a cutscene de passeio usa para saber quando parar.

### `characters/` — o personagem procedural

- **`spec.ts`** — `CharacterSpec`: ficha 100% declarativa (altura, `build`
  magro/médio/forte, cor de pele, `blush` **opcional**, olhos, cabelo com
  estilo/volume/mechas, roupa, calção de banho, jaqueta opcional, lista de
  acessórios, flag `casal: true` que habilita a mecânica de beijo).
- **`CharacterRig.ts`** (~820 linhas) — monta o corpo chibi (cabeça grande,
  corpo pequeno) inteiramente por código a partir da ficha: pernas, torso,
  jaqueta com capuz opcional, calção escondido até entrar na água, braços,
  cabeça com 6 estilos de cabelo (cada um com "régua" documentada para não
  tapar os olhos nem parecer careca sob a câmera de 34°), sobrancelhas,
  blush condicional, 7 acessórios combináveis. Anima caminhada, natação,
  sentado e a inclinação do beijo (`setKiss`), todos como funções de `update`
  chaveadas por estado. `setOutfit('banho')` troca materiais registrados no
  construtor (camiseta/calça viram pele) sem remontar nada.
- **`cast.ts`** — instâncias `ARI` e `RENAN` (ambos `casal: true`) e a
  constante `DUPLA = [ARI, RENAN]` que define quem começa jogável.

### `entities/` — atores com física própria

- **`Player.ts`** / **`Companion.ts`** — cada um é um `Group` externo (guarda
  a posição) + um `CharacterRig` filho (guarda a rotação). `swapRig()` troca
  o filho entre os dois na troca de personagem. `Companion` tem um modo
  "seguir" (persegue o jogador, para a uma folga) e um modo "ordem"
  (`goTo`/`commandCompanion`, usado pelo frisbee) e — desde a última correção
  — um modo **`hold`** que o planta parado encarando um ponto (usado para
  corrigir o passe de frisbee, ver seção 3).
- **`Frisbee.ts`** — o disco físico: voo com sustentação (`lift`) que segura a
  queda enquanto sobe/plana, gravidade, atrito, e uma busca binária
  (`powerFor`) que calibra a força de lançamento para acertar uma distância
  alvo, considerando a física simulada internamente. Aceita um parâmetro
  `arco` que multiplica a subida — usado no passe de volta para desenhar uma
  parábola mais alta.
- **`Beijo.ts`** — mecânica de motor (não de cena): dois personagens com
  `casal: true`, perto e de frente, ganham o prompt "💋 Beijar". Ao ativar,
  gira o par em torno do próprio meio até ficarem de perfil para a câmera
  (senão um esconde o outro na isométrica), anima a inclinação via
  `rig.setKiss()` e sobe um coraçãozinho de cada lado pelo eixo do par.

### `scenes/` — um `SceneDef` por lugar

Cada arquivo exporta `{ id, name, ambient, spawn, entries, outfit?, build(w) }`.
`build` é a única função que efetivamente monta o mundo, chamando a API do
`WorldBuilder`. `scenes/index.ts` registra os três cenários e define
`CENA_INICIAL = casa.id`.

### `audio/` — som 100% sintetizado

- **`nucleo.ts`** — os dois tijolos: `tom()` (oscilador com envelope
  ADSR simplificado) e `chiado()` (ruído branco filtrado, para texturas como
  passo/água/papel). Mais `nota()` (MIDI → Hz) e `dado()` (RNG determinístico).
- **`efeitos.ts`** — tabela `EFEITOS: Record<SomNome, Receita>` com 25
  efeitos (um por ação relevante: passo, prompt, interagir, letra de diálogo,
  escolha, confirma, porta, memória, toast, trocar de personagem, beijo,
  coração, lançar/pegar/quicar do frisbee, água, nadar, sorvete, pato, TV,
  sino da roda gigante, sentar, menu, diário, recomeçar).
- **`musica.ts`** — sequenciador (não um loop gravado): escreve compasso a
  compasso com acordes de sétima, melodia de marimba que **caminha** pela
  pentatônica (passo curto + puxão de volta ao centro, para não ficar
  pendurada numa nota) e suingue no contratempo. Um `Clima` por cenário
  (`CLIMAS`), com troca que espera o compasso fechar.
- **`Som.ts`** — fachada única: cria o `AudioContext` só no primeiro
  clique/tecla (política de autoplay dos navegadores), gerencia mudo
  (persistido em `localStorage`), canais separados de música/efeitos, e o
  contador `contagem` que os scripts de teste usam para verificar som sem
  ouvir.

### `ui/` — interface DOM

`Ui.ts` é a única classe que cria elemento de tela, dentro de `#ui` com
`pointer-events: none` (só quem precisa liga `auto` — regra corrigida
recentemente para usar `:where(#ui) > *`, evitando que especificidade de CSS
quebrasse cliques em botões dentro de painéis). Contém: cartão de entrada de
cena, prompt de interação, diálogo com efeito de máquina de escrever
(`say`/`ask` com botões de escolha), toasts, diário de memórias (grid de
cards), barra de carga do frisbee, HUD de dicas (teclado ou toque, conforme
`matchMedia('(hover: none)')`), botões de toque para celular (pequenos e
translúcidos por design, para não cobrir texto) e o menu (som, controles,
recomeçar).

---

## 3. Cenários e Mecânicas Implementadas — Raio-X Técnico

### `casa.ts` (393 linhas) — a casa do Ari

Layout: sala (sofá + TV) → cozinha → quarto (fechado, com teto — dividido
com a Rubina, a roommate, mencionada mas nunca vista) → banheiro (fechado;
menção ao Guillermo, amigo que "já tem horário lá"). Regra de interior:
paredes inteiras só em -X/-Z; nos lados abertos, mureta baixa (0,45) para não
tapar a câmera.

Interações ativas: `casa:sofa` (cutscene — `g.ask` Sim/Não; se sim, os dois
sentam via `setSitting(true)` e a TV liga sozinha, "Está passando Bo
Burnham"), `casa:tv` (liga/desliga, toca som `tv`), `casa:geladeira`,
`casa:pia`, `casa:mesa`, `casa:maquina` (lavar roupa), `casa:banheiro` (porta
fechada, menciona o Guillermo), `casa:quarto` (porta fechada, música vindo de
dentro, desbloqueia memória `quarto-manha`), `casa:planta` (regar, com
coraçãozinho condicional a uma flag), `casa:cafe`, `casa:janela` (memória
`ceu-laranja`). Porta para a rua leva ao Villa Lobos.

### `villaLobos.ts` (1.044 linhas) — o cenário grande

O maior e mais denso. Estrutura macro: praça da roda gigante (Z negativo),
caminho principal central, quadra de frisbee dedicada, sorveteria, lago,
mesa de piquenique, ponto de ônibus (leva ao clube), e um mar de vegetação
sorteada (260 tentativas de árvore + 90 de arbusto/flor/pedra, com lista
`proibido` de círculos que protegem as áreas construídas).

**Roda gigante e cutscene de passeio.** `FerrisWheel` instanciada e
posicionada; interação `parque:roda-gigante` dispara: `ridePlayer`/
`rideCompanion` prendem os dois corpos na cabine de embarque
(`boardingCabin()`), a câmera foca (`focusCamera`) e abre o zoom perto da
roda, e uma `Promise` (`esperarVoltas`) resolve quando `wheel.turnsSince()`
atinge a fração pedida — a volta é dividida em três trechos com falas
diferentes entre eles. Ao final, `releasePlayer`/`releaseCompanion` devolvem
o controle e desbloqueia a memória `roda-gigante`.

**Praça e cúpula (última rodada).** A cúpula, antes solta na cena, virou
peça reutilizável `domoDeVidro()` em `props.ts`: 8 meridianos cruzando 3
paralelos, nó no ápice, rodapé de concreto, aro de base partido (entrada), 6
pilares internos e um banco+vaso vistos através do vidro — resolvendo o
problema de "bolha vazia" do toon shading sem estrutura. Em volta: 4
canteiros de flores, 4 postes, 3 bancos, 2 lixeiras, e uma faixa de
mato/capim/pedra rente à borda da praça, tudo posicionado manualmente porque
a regra `proibido` (raio 20 ao redor da roda) continua vetando o
espalhador automático ali — decisão deliberada do usuário para preservar
controle sobre essa área.

**Sistema de frisbee — o mais sofisticado do jogo, com correções recentes de
"IA do NPC".** Máquina de estados (`FaseDisco`): `fora → comigo →
voando-pra-ele → buscando → com-ele → voando-pra-mim → no-chao → comigo…`.
O disco só existe fisicamente dentro do retângulo da quadra (`QUADRA`,
com `LIMITES_QUADRA` que rebate o disco na grade). Lançamento do jogador é
carregado (segurar `F`, até `CARGA_CHEIA` = 1,3s, mapeado para uma distância
entre `DIST_MIN`=6 e `DIST_MAX`=30, som e barra de carga sonora crescente).

O **passe de volta do parceiro** foi inteiramente reescrito nesta sessão para
corrigir um comportamento "torto": antes ele lançava enquanto ainda se
movia, mirando os pés do jogador — o disco caía rasteiro e quase nunca dava
para pegar no ar. A correção, no bloco `RETORNO`:
1. **Para**: ao pegar o disco, `g.holdCompanion(eu.x, eu.z)` zera a
   velocidade do `Companion` e o planta no lugar (novo método `hold()` em
   `Companion.ts`, exposto na `GameAPI` como `holdCompanion`).
2. **Mira**: ele gira para encarar a posição atual do jogador, e o lançamento
   só dispara quando `g.companionFacing()` fecha com esse ângulo (tolerância
   0,12 rad; timeout de segurança de 1s para nunca travar a partida).
3. **Alvo além do jogador**: o ponto mirado não são os pés de quem recebe,
   mas um ponto ~3,5 unidades **além**, na mesma linha, com desvio lateral
   aleatório pequeno. `Frisbee.throwToward` ganhou o parâmetro `arco`
   (multiplica a velocidade vertical inicial), fazendo o disco subir mais e
   chegar mais devagar.
4. **Captura por interceptação**: como o disco passa *através* da área do
   jogador ainda voando (teto de altura da pegada subiu de 2,3 para 3,0,
   raio de 1,9 para 2,1), a janela de tempo para pegar no ar dobrou
   (medida na física: de ~0,3s para ~0,6s). Quem não intercepta corre atrás,
   de propósito — o disco cai *atrás* dele.

Validado por `scripts/frisbee.mjs`, que **não confia em screenshot**: lança,
fica parado, e lê a posição do disco quadro a quadro para medir altura de
cruzamento e se o parceiro realmente ficou parado ao segurar o disco.

**Outras interações do parque:** `parque:sorveteria` (sabores fixos por
personagem — morango pro Ari, maracujá pro Renan, permanecem corretos mesmo
trocando de corpo), `parque:lago` (patos, conversa roteirizada, memória
`lago-pular`), `parque:bilheteria`, `parque:placa-quadra`,
`parque:ponto-onibus` (portal para o clube), `parque:placar`,
`parque:arquibancada`, `parque:bebedouro`, `parque:biruta`,
`parque:piquenique`.

**Margem do lago (última rodada).** O antigo anel perfeitamente regular de
10 arbustos virou espalhamento sorteado (34 posições, misturando arbusto,
capim, pedra e flor, com raio e ângulo variando) mais 4 pedras grandes
"meio dentro d'água", 4 moitas de junco com taboa e 6 vitórias-régias (como
calotas curvas acima do plano da água — nunca coplanares, então sem risco de
z-fighting).

### `clube.ts` (329 linhas) — a piscina "que ainda não aconteceu"

Cenário deliberadamente especulativo (nota no comentário do arquivo: "a
gente ainda não foi, então o jogo vai na frente"). A piscina é um buraco de
verdade no piso via `w.groundWithHoles` — necessário porque a natação depende
disso: `submergePlayer`/`submergeCompanion` (0..1) abaixam o corpo 72cm,
cortam a velocidade quase pela metade, trocam a animação para braçada e
apagam a sombra de chão; sem o buraco físico, o corpo submerso "flutuaria"
sobre um piso sólido. `outfit: 'banho'` no `SceneDef` despe os dois
automaticamente ao entrar (tênis viram pé descalço, camiseta/calça viram
pele, calção aparece) — o motor restaura `'normal'` sozinho ao trocar de
cena.

Interações: `clube:trampolim` (mergulho com respingo — sistema de partículas
simples via `Respingo[]`), `clube:espreguicadeira`, `clube:bar` (quiosque
tipo `suco`, som `sorvete` reaproveitado como "toma, é seu"),
`clube:chuveiro` (respingo + som `agua`), `clube:vestiario`. Memória
`piscina-clube` desbloqueada ao molhar pela primeira vez.

---

## 4. Últimas Modificações (estado exato do código)

Sessão mais recente, em ordem cronológica real:

1. **Beijo da dupla** — mecânica nova de motor (`entities/Beijo.ts`),
   restrita a personagens com `casal: true` na ficha (só Ari/Renan hoje,
   NPCs futuros nascem sem a flag e portanto sem beijo).
2. **Blush opcional** — `CharacterSpec.blush?: number`; sem o campo a
   bochecha nem é montada (era um bug do Renan estar "sem blush" apenas por
   cor igual à pele).
3. **Quiosques redesenhados** — `kiosk()` em `props.ts` ganhou toldo
   listrado, letreiro em canvas, e vitrines por `tipo` (`'sorvete' | 'suco' |
   'simples'`); duas peças que estavam de costas para a câmera padrão
   (bilheteria, bar) foram giradas.
4. **Frisbee: correção do passe de retorno do parceiro** (detalhada na
   seção 3) — `Companion.hold()`, `GameAPI.holdCompanion`/`companionFacing`,
   `Frisbee.throwToward(..., arco)`.
5. **Menu com "Recomeçar o jogo"** — botão de 3 barras no canto superior
   direito; confirmação em dois passos; `Game.restart()` zera `SaveState`,
   devolve o controle ao primeiro da `DUPLA` (Ari) e volta para
   `CENA_INICIAL`. Bug de CSS corrigido junto (`#ui > *` → `:where(#ui) > *`).
6. **Sistema de áudio completo** — os quatro arquivos de `audio/`, 25
   efeitos, música proceduralcom clima por cenário, botão de mudo no menu.
7. **UI de celular** — botões de toque menores (60/46/40px) e translúcidos
   (58% opacidade + blur), corredor reservado no balão de diálogo, botões
   somem com painel aberto.
8. **Tela de "Controles" no menu** — lista teclado + gestos de toque no
   mesmo painel.
9. **Villa Lobos: cúpula e ambientação (a mudança mais recente)** —
   `domoDeVidro()` virou peça do kit com estrutura geodésica completa; praça
   da roda gigante povoada manualmente (canteiros, postes, bancos, lixeiras,
   vegetação rasteira); margem do lago com pedras de forma variável (via
   semente, evitando o bug de "amassar por índice" em geometria não
   indexada — o ruído é aplicado por posição arredondada do vértice, não por
   índice, para não rasgar cantos compartilhados), capim, junco e
   vitórias-régias. Nenhum decalque de chão novo — tudo geometria de pé,
   portanto fora do sistema de `polygonOffset`.

Todas as mudanças foram fundidas em `main` (que publica automaticamente via
GitHub Pages, branch `gh-pages`, workflow `deploy.yml`).

---

## 5. Ganchos Abertos para Expansão

Sistemas já estruturados no código que suportam mecânica nova sem refatoração
de base:

- **`GameAPI` como contrato único.** Qualquer mecânica nova em uma cena só
  precisa dos métodos já expostos (`say`, `ask`, `toast`, flags, `bump`/
  `stat`, `unlock`, `som`, câmera, a dupla). Isso significa que uma mecânica
  nova quase sempre pode ser implementada **só na cena**, sem tocar no motor
  — o padrão que o frisbee e o beijo já seguem.
- **`Companion.hold()` é reutilizável para qualquer NPC que precise "parar e
  mirar" antes de agir** — não ficou específico do frisbee. Serve de base
  para qualquer mecânica de troca de objeto/interação sincronizada entre os
  dois personagens.
- **Diário de memórias (`unlock`/`Memory`)** é um sistema de conquistas sem
  UI de progresso agregado — hoje só lista cards. Não há "porcentagem
  completa", "categoria de memória" nem memórias com fotos/ilustração
  própria (usa só `icon` emoji). Espaço aberto para curadoria/filtro/álbum.
- **NPCs mencionados, nunca modelados:** Rubina (roommate do Ari, gosta de
  k-pop, quarto sempre fechado) e Guillermo (amigo que "tem horário no
  banheiro"). O código já teria onde colocá-los (`CharacterSpec` sem
  `casal: true`, parado como NPC estático — ver exemplo documentado na skill
  `aristory-personagem`), mas a decisão de virarem personagem navegável
  está deliberadamente em aberto, pendente de decisão do usuário.
- **Móveis não interativos.** Vários itens de `furniture.ts`/`props.ts`
  existem só como cenário (ex.: cadeiras da mesa de jantar, alguns bancos da
  praça, o vaso e o banco dentro da cúpula de vidro) sem `w.interact()`
  associado — candidatos naturais a ganhar diálogo ou pequena mecânica sem
  exigir modelagem nova.
- **`outfit` do `SceneDef`** hoje só tem dois estados (`'normal' | 'banho'`).
  A skill de personagem já lista "mais roupas por cenário (casaco no frio,
  pijama em casa)" como próximo passo natural — a infraestrutura de troca de
  material (`rig.setOutfit`) é genérica o bastante para um terceiro estado.
- **Clima musical por cenário (`CLIMAS` em `musica.ts`)** é indexado por
  `id` de cena com fallback `'padrao'` — qualquer cenário novo herda um som
  coerente sem trabalho extra, e o sistema já suporta variar `bpm`, tonalidade,
  progressão de acordes e presença de percussão por lugar (ex.: um clima de
  "noite" ou "chuva" é só uma nova entrada no dicionário).
- **`Frisbee.throwToward(..., arco)`** já existe como primitiva de "passe com
  parábola configurável" — reutilizável para qualquer objeto arremessado
  futuro (bola de praia, embrulho de presente) sem nova física.
- **Regra `proibido`/`livre()` de espalhamento de vegetação** em
  `villaLobos.ts` é o padrão para "zona de exclusão editorial" ao redor de
  qualquer construção nova — já testado em duas áreas (quadra de frisbee,
  praça da roda).
- **Scripts de validação como spec executável.** Cada mecânica nova ganhou
  seu script Playwright (`ride.mjs`, `mecanicas.mjs`, `frisbee.mjs`,
  `beijo.mjs`, `quiosque.mjs`, `celular.mjs`, `audio.mjs`, `musica.mjs`,
  `parque.mjs`) que mede estado real do jogo (posição, som disparado,
  contagem de malhas) em vez de só tirar screenshot — um padrão fácil de
  estender para qualquer mecânica nova proposta no brainstorming.
