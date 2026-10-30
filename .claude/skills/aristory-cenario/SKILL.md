---
name: aristory-cenario
description: Criar ou editar um cenário do AriStory (casa, parque, praia, restaurante, viagem…). Use sempre que a tarefa for "adicionar um ambiente novo", "mexer no parque", "criar a cena X", posicionar objetos, colisões, interações ou diálogos dentro de uma cena. Contém a API completa do WorldBuilder — leia isto em vez de explorar o código.
---

# Criar um cenário no AriStory

> **Junto desta skill, carregue as `threejs-*` da tabela "REGRA DE TODA
> TAREFA" do `CLAUDE.md`** (`geometry`, `textures`, `lighting`, e `interaction` se tiver coisa de tocar). Elas são a técnica; esta é a regra do
> jogo. Peça feita só de caixa lisa é o jeito antigo.

Um cenário é **um arquivo só**: `src/scenes/<nome>.ts`, exportando um `SceneDef`.
Nunca mexa no renderer, na câmera, nas luzes ou no loop — a cena só fala com o
`WorldBuilder` (`w`) e com o `GameAPI` (`w.game`, ou o `g` que chega em cada interação).

## Esqueleto

```ts
import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { bench, tree, lamp } from '../world/props';

export const praia: SceneDef = {
  id: 'praia',
  name: 'Praia Grande',            // cartão que aparece ao entrar
  subtitle: 'aquele feriado de novembro',
  ambient: { sky: P.skyDusk, fog: 0xffd9b0 },
  spawn: { x: 0, z: 10, facing: Math.PI },   // facing 0 = olhando para +Z
  entries: { 'do-estacionamento': { x: -8, z: 12, facing: Math.PI } },
  build(w) { /* … */ },
};
```

Depois registre em `src/scenes/index.ts` e ligue as duas pontas com `w.door()`
nas duas cenas (ida e volta).

## Eixos e câmera

- Câmera isométrica ortográfica, ângulo padrão 45°. `-Z` sobe para a **direita**,
  `-X` sobe para a **esquerda**, `+X` desce para a direita, `+Z` desce para a esquerda.
- Uma pessoa tem ~1,75 unidade de altura. Use isso como régua para tudo.
- O jogador olha para `+Z` quando `facing === 0`; `facing = Math.atan2(dx, dz)`.
- **Peça com frente (quiosque, banca, bar) tem que olhar para `+Z`**, girada no
  máximo meia volta de rádio para cada lado. A câmera padrão vem de `+X/+Z`:
  virada para o outro lado, a peça mostra só o fundo liso e quem compra fica
  escondido atrás dela. O ponto do `w.interact` vai na frente dela.

### O ponto cego atrás de um prédio

A câmera olha em **34°** de inclinação. A conta que decide tudo: uma peça de
altura `h` esconde **`h / tan(34°) ≈ 1,5 · h`** de chão atrás dela, na direção
da câmera — que é a diagonal `(sen giro, cos giro)`, e o giro muda quando o
jogador aperta `Q`/`R` (o `E` é interagir). Um prédio de 5,5 come quase 8 m.

Duas saídas, e **nenhuma delas é fazer a peça sumir**:

1. **Não ponha nada atrás de peça alta** — é a regra normal, e vale para
   qualquer coisa que o jogo espere que o jogador ache sem procurar.
2. **Ponha ali de propósito, como segredo.** É o caso da porta de serviço do
   restaurante do clube: o ponto cego é o esconderijo. Quem gira a câmera ou dá
   a volta acha; quem não gira, não acha. Só nunca deixe o caminho principal do
   jogo depender de uma coisa escondida assim.

**Roda gigante também tapa, e o aro "vazado" não salva**: o portão laranja
do Halloween nasceu bem atrás da roda do Villa Lobos (onde o Walter sumia) e
sumiu atrás das gôndolas de baixo; mais à esquerda, os pinheiros do
piquenique tapavam. Ele foi para a ponta do tapume, VIRADO para a diagonal
da câmera (de lado, era uma risca). Para achar o lugar: foto da câmera de
sempre com a dupla no ponto (`debugPlace`), e não a planta vista de cima.

**Cena NOVA de evento** (a clareira da Casinha da Abóbora,
`scenes/casinhaDaAbobora.ts`): a cena só chama `montarAClareira(w)` de
`eventos/halloween/naCasinha.ts`, e o céu da festa entra no primeiro quadro
(`g.luzDoCeu(luzDoMomento(NOITE_DA_FESTA))`, `eventos/halloween/ceu.ts`).
Sem `fogNear` curto no `ambient`: a câmera fica a 60 m do alvo, e névoa a
30 m deixava tudo lilás. Árvore só nas beiras do FUNDO (`−X`, `−Z`); na
beira do lado da câmera, mato baixo — árvore ali tapa quem anda na beira.

**Peça translúcida está descartada** — chegou a existir aqui um prédio que
desbotava quando a dupla passava atrás, e o Renan cortou: a câmera gira, e o
que é para ser descoberto tem que ser descoberto jogando, não entregue por um
efeito. Não reintroduza.

## API do WorldBuilder (`w`)

### Chão e manchas
| chamada | para quê |
|---|---|
| `w.ground({ width, depth, color, x?, z?, y? })` | o piso da cena |
| `w.patch(x, z, w, d, cor, rotY?, y?)` | retângulo pintado: calçada, quadra, tapete |
| `w.disc(x, z, raio, cor, y?)` | círculo pintado: lago, praça, canteiro |
| `w.ring(x, z, raio, largura, cor, y?)` | anel pintado: círculo central da quadra, marca no chão |
| `w.setBounds(minX, minZ, maxX, maxZ)` | limite invisível de caminhada |
| `w.groundWithHoles({ …, holes: [{x,z,width,depth}] })` | piso com buraco (piscina, poço) |

Buraco é para quem afunda: sem ele o personagem submerso some por baixo do
piso. Grama e deck precisam do **mesmo** furo — ver `src/scenes/clube.ts`.

### Objetos
| chamada | para quê |
|---|---|
| `w.add(obj)` | põe no mundo e liga sombra (devolve o objeto) |
| `w.place(obj, x, y, z, rotY?)` | posiciona/gira (devolve o objeto) |
| `w.wall(x1, z1, x2, z2, altura?, cor?, espessura?)` | parede com colisão junto |

Padrão: `w.add(w.place(bench(), 4, 0, -2, Math.PI))`.

### Colisão (o cenário não colide sozinho)
| chamada | para quê |
|---|---|
| `w.blockBox(x, z, meiaLargura, meiaProfundidade, rot?)` | móveis, prédios |
| `w.blockCircle(x, z, raio)` | árvores, postes, lago |
| `w.blockFrom(obj, encolher?)` | deriva a caixa da bounding box |

O jogador tem raio 0,42. Deixe pelo menos ~1,2 de vão entre colisores para passar.

### Interações
```ts
w.interact({
  x, z,
  radius: 2,               // distância em que o prompt aparece
  label: 'Sentar no banco',
  icon: '🪑',
  highlight: objeto,       // a que objeto a interação se refere (não anima)
  once: false,
  priority: 0,             // maior ganha quando dois prompts se sobrepõem
  onInteract: async (g) => { /* … */ },
});

w.door({ x, z, to: 'casa', entry: 'da-rua', label: 'Voltar pra casa', icon: '🏠' });
```
Um `Interactable` devolvido pode ser ligado/desligado (`it.enabled = false`) e
movido (`it.moveTo(x, z)`) — é assim que o frisbee funciona.

### Animação e aleatório
```ts
w.onUpdate((dt, tempo) => { /* roda todo frame */ });
w.rng() / w.range(min, max) / w.pick([...])   // determinístico: a mesma cena sempre igual
```

### Mouse e dedo no mundo (o `Raycaster`)
```ts
w.clicavel(peca, {
  dica: 'Cristal: o sino',          // flutua em cima da peça com o mouse por cima
  alturaDaDica: 1.75,
  aoPassar: (dentro) => { /* acende */ },
  aoClicar: (g, ponto) => { /* ponto = onde o raio acertou, no mundo */ },
  // ou, para ARRASTAR num plano horizontal:
  arrastar: { altura: 0.4, aoArrastar: (p) => { /* a cena limita a área */ }, aoSoltar: () => {} },
});
```
O raio testa só o que foi registrado (registre o GRUPO da peça). Toque num
clicável não vira joystick. Hoje só o laboratório usa — é o jeito "apontar e
clicar", ao lado do "chegar perto e apertar E" do `w.interact`.

### Efeito de tela, luz do céu e câmera livre
```ts
g.telaComEfeitos({ brilho: { forca: 0.8, raio: 0.42, limiar: 0.92 } }); // null desliga
g.telaComEfeitos({ pixel: 4 });  // contorno, filme, glitch, rastro, quadrinho, monitor, lente
g.luzDoCeu({ sky, sunColor, sunIntensity, sunDir: [x, y, z] });           // null volta
g.cameraLivre(new THREE.Vector3(0, 0.5, 0));                               // null devolve a isométrica
g.goTo('quarto', 'do-computador', 'digital');                              // o véu de tela de computador
```
Os três morrem na troca de cena. O brilho pega só o que passa de ~1: cor de
neon vem de `neon()` (`core/shaders.ts`), e luz de verdade forte demais estoura
superfície branca — o palco do laboratório já estourou assim.

## API do jogo (`g` / `w.game`)

```ts
await g.say(['linha 1', 'linha 2']);      // diálogo, resolve ao fechar
const i = await g.ask('Sentar?', ['Sim', 'Não']);   // devolve o índice
g.toast('Água de coco gelada', '🥥');
g.goTo('villa-lobos', 'portao');
g.flag('regou') / g.setFlag('regou')       // persistente
g.bump('frisbee.pegadas') / g.stat(...)    // contador persistente
g.unlock({ id, title, place, note, icon }) // memória no diário (J)
g.lockPlayer(true) / g.setPlayerVisible(false)
g.focusCamera(objeto | null) / g.setZoom(30)
g.ridePlayer(cabine, new THREE.Vector3(0, -0.34, 0), 0.6)
g.releasePlayer(x, z, facing)
g.playerPosition() / g.playerFacing() / await g.wait(1.5)

// a dupla
g.playerName() / g.companionName() / g.companionPosition() / g.companionFacing()
g.rideCompanion(cabine, local, escala, facing) / g.releaseCompanion(x, z, facing)
g.commandCompanion(x, z)   // manda ele buscar algo; freeCompanion() devolve o "seguir"
g.holdCompanion(x, z)      // planta ele onde está, encarando esse ponto
g.setSitting(true)         // os dois sentam
g.swapCharacters()

// teclas próprias da cena (o frisbee usa F)
if (g.keyPressed('KeyF')) { /* … */ }   // só no frame em que desceu
if (g.keyDown('KeyF')) { /* … */ }      // enquanto estiver segurada
g.showCharge(0.7);                      // barra de força no HUD; null esconde
g.mostrarCesta({ balas: 7, meta: 25 });  // a cesta de balas no canto (o Halloween); null esconde
const acerto = await g.horaCerta('Pegar o frisbee!', undefined, { periodo: 1.2, zona: 0.08 });
// ↑ a agulha que vai e volta embaixo da fala: E para parar; 1 no meio da faixa, 0 longe
g.emDialogo()                           // tem balão aberto? (não abra um `say` em cima de outro)

// água
g.submergePlayer(0..1) / g.submergeCompanion(0..1)   // 1 = nadando
```

Roupa da cena: `outfit: 'banho'` no `SceneDef` deixa os dois sem camisa e de
calção (é o que o clube usa). O motor volta para `'normal'` ao trocar de cena.

**Sempre há dois personagens em cena**: quem você controla e quem acompanha.
Cutscene que carrega um tem que carregar o outro (a roda gigante leva os dois
na mesma cabine). Diálogo que cita um nome usa `g.companionName()`, nunca o
nome cravado — o jogador pode ter trocado com a tecla T.

Para uma zona de água, compare a posição no `w.onUpdate` e interpole a
submersão (sem interpolar, o corpo pula 70 cm de uma vez na borda):

```ts
molhado += ((dentro ? 1 : 0) - molhado) * Math.min(1, dt * 5);
g.submergePlayer(molhado);
```

## Zona que liga uma mecânica

**Parceiro que age (buscar, mirar, jogar) faz uma coisa de cada vez.** Enquanto
ele corre, `commandCompanion`; ao chegar, `holdCompanion(alvo)` para ele parar e
virar; e só lançar quando `g.companionFacing()` já tiver fechado com o ângulo do
alvo. Sem isso ele executa andando, e o resultado sai torto — foi o bug do passe
de volta do frisbee.

Quando uma mecânica só faz sentido num pedaço do cenário (a quadra de frisbee),
defina o retângulo e ligue/desligue tudo na entrada e na saída — não deixe o
objeto na mão do jogador pelo parque inteiro:

```ts
const QUADRA = { x: 18, z: -4.5, largura: 26, profundidade: 19 };
const naQuadra = (x, z, margem = 0) =>
  Math.abs(x - QUADRA.x) < QUADRA.largura / 2 - margem &&
  Math.abs(z - QUADRA.z) < QUADRA.profundidade / 2 - margem;
```

Objeto que voa dentro da zona deve ser limitado à zona, não ao mundo: passe os
limites da quadra para o `update` do projétil, senão ele cai do lado de fora da
grade e o parceiro fica preso tentando alcançar.

No `w.onUpdate`, compare com o estado anterior para disparar entrada/saída uma
vez só. Na entrada vale abrir a câmera (`g.setZoom`) e mandar o parceiro se
posicionar (`g.commandCompanion`); na saída, desfazer os dois.

## Cutscene com os dois

O padrão é sempre o mesmo: um `THREE.Object3D` vazio serve de âncora, os dois
entram nele e saem no fim. A rotação mora na âncora, então o rig entra com
`facing: 0`.

```ts
const assento = new THREE.Object3D();
assento.position.set(-0.52, 0, 0.6);
assento.rotation.y = -Math.PI / 2;      // virado para a TV
w.root.add(assento);

g.lockPlayer(true);
g.ridePlayer(assento, new THREE.Vector3(-0.52, 0.02, 0), 1, 0);
g.rideCompanion(assento, new THREE.Vector3(0.52, 0.02, 0), 1, 0);
g.setSitting(true);
g.focusCamera(foco); g.setZoom(7.2);
await g.say([…]);
g.setSitting(false); g.focusCamera(null); g.setZoom(10);
g.releasePlayer(x, z, facing); g.releaseCompanion(x, z, facing);
g.lockPlayer(false);
```

Cuidado com móvel na frente: numa câmera isométrica o encosto do sofá tapa quem
senta colado nele. Sente **à frente** do encosto e confira com foto.

### Deitados: a cama e a barraca

Deitar é a mesma âncora girada `-π/2` em X (os dois lado a lado no X dela,
os pés no `+Z`), `g.setLying(true)` e a câmera de cima por `g.setCameraOmbro`
— a isométrica encurta os corpos. Deitados na mesma âncora, os dois também
**viram de lado, um de frente para o outro** e se beijam:

```ts
await g.beijarDeitados();      // viram de lado, chegam perto, fecham os olhos, beijo e corações
await conversa([...]);         // a conversa DE FRENTE
await g.virarDeitados(false);  // de barriga para cima, no lugar de antes
```

Quem anima é o motor (`entities/BeijoDeitado.ts`, no relógio do jogo); a cena
só escolhe a câmera. De lado, o perfil dos dois só se vê **de cima** — pelo
lado dos pés o braço e o queixo tapam o rosto. A barraca da clareira desliza a
câmera até quase em cima das cabeças durante a virada e volta depois
(`CAMERA_DO_BEIJO` em `scenes/villaLobos.ts`): sem corte seco, num
`w.onUpdate` que aplica a curva suave ao que falta.

`g.soltarCoracoes()` solta em cima da CABEÇA de quem joga, no mundo — vale
montado numa âncora (a posição do corpo ali é local a ela).

**De conchinha** é o mesmo motor: `await g.deitarDeConchinha(RENAN.name)`
vira os dois para o MESMO lado, com quem foi nomeado atrás, abraçando (a
escolha do Renan na barraca). Trocar de jeito (beijo ↔ conchinha) passa
sozinho por barriga para cima.

## A noite (a clareira atrás do lago)

Um pedaço do cenário pode ANOITECER sem luz nova no motor: a noite é o mesmo
sol e o mesmo céu, com outras cores, pelo `g.luzDoCeu` a cada quadro. O kit é
o `world/noite.ts`:

- **os momentos** (`TARDE_DOURADA`, `POR_DO_SOL`, `CREPUSCULO`, `NOITE`,
  `AURORA`, e o dia do próprio cenário por `momentoDoDia(cena.ambient)`) e
  `momentoNaFila(fila, t, alvo)` para passar de um ao outro; `luzDoMomento`
  dá o que o `g.luzDoCeu` pede. O horizonte do momento é também a névoa;
- **a cúpula** (`CeuDaClareira`): só para as tomadas de câmera de cena (a
  isométrica olha o chão e nunca vê o céu) — o degradê, o clarão em volta do
  sol baixo, as estrelas em lote, a lua e o disco do sol. Ligue só na tomada
  (`ceu.visivel`): de dentro da isométrica ela é desenho jogado fora;
- **os vaga-lumes** (`VagaLumes`): dois lotes para todos, cada um piscando
  no seu tempo.

As luzes acompanham o céu num lugar só (`pintarMomento` na clareira): o
varal acende pela força das estrelas, a lanterna liga passando de 0,3. E a
noite é LOCAL: sair da clareira devolve o dia (o resto do parque não
anoitece). A cena tem um relógio de animações próprio no `w.onUpdate`
(`animar`, o deslize de câmera, a porta) — não `g.wait`, que é de parede: num
celular lento o céu e a câmera chegariam em tempos diferentes. O teste o
acelera pelo gancho (`ritmo.vezes`).

Para dormir, `g.escurecerTela(true, 'sono')` (a cortina azul devagar, com a
luazinha) — é por baixo dela que a cena troca a noite pela aurora.

### A etapa D: cozinhar, dançar, o pote e as estrelas

- **Montado numa âncora, a câmera agora segue o MUNDO**: o `chest` do
  jogador lê a posição de mundo quando ele está montado (antes lia a local,
  e a isométrica ficava perto da origem do parque durante a tomada de cena e
  voltava de lá quando ela acabava — o "foi parar no lago").
- **A tomada de cena de uma mesa vem do lado LIVRE dela**: com um sentado
  no `−X` e outro no `+Z`, a câmera pelo `+Z` via a nuca do ajudante na
  frente do fogareiro.
- **A dança** (`g.dancaLenta(RENAN.name)`, `g.voltinhaNaDanca()`): os dois
  montados na MESMA âncora; o motor põe os dois de frente no X dela, à
  distância das cabeças, e dá a mesma fase do balanço com meia volta de
  diferença (de frente um para o outro, o `+X` de um é o `−X` do outro). A
  cena gira a âncora num vaivém e a câmera ACOMPANHA, balançando ~30° de
  cada lado do perfil: na régua chibi o rosto é a frente de uma bola e o
  cabelo dá a volta — de perfil puro só se vê cabelo, e com a âncora girando
  sem parar o par se alinhava com a câmera.
- **Prompt que persegue** (o vaga-lume mais perto): `it.moveTo` todo quadro
  e `enabled` quando há alvo; e o prompt que anda com quem joga ("Soltar os
  vaga-lumes aqui") tem a menor prioridade de todas. Os dois não podem
  brigar pelo E: o de pegar só vale PERTINHO (70 cm).
- **Deitar na canga olhando o céu** é a âncora de deitar girada também em
  Y (`rotation.set(-π/2, π/2, 0, 'YXZ')`: o corpo no X do pano, que é o lado
  comprido); o `BeijoDeitado` vale nela igual. A constelação e a estrela
  cadente moram no `CeuDaClareira` (`coracaoEm`, `acharCoracao`,
  `estrelaCadente`), e o coração fica a 70° de altura — mais baixo, as copas
  da borda da clareira tapavam.
- **Dado da cena no save durante o `build`**: o `g.vagaLumesSoltos()` lê a
  cena que está SUBINDO (o `current` do motor só muda no fim do `build`; antes
  dele, ler pelo `current` devolvia a cena velha e os soltos sumiam ao
  recarregar).

## O lago do Villa Lobos: água em shader, margem torta e trapiche

O lago (`montarOLago` em `scenes/villaLobos.ts`, peças em
`world/lagoDoParque.ts`, vida miúda em `world/vidaDoLago.ts`) é o molde para
qualquer água nova:

- **Água e areia são UM decalque** com o material `AguaDoLago`
  (`core/shaders.ts`, toon estendido): o `w.disc` dá o lugar na fila de
  pintura do chão e o material troca por cima (`lagoMalha.material =
  agua.material`). A margem torta é CONTA (`FormaDoLago`: raio + ondas de
  seno com número inteiro de voltas), feita no shader e no TS
  (`agua.fundura(x, z)`, `agua.naBeira(ângulo, recuo)`) — tudo que pergunta
  "é água?" (colisor, seixo, junco, pato, peixe, pedrinha) usa a mesma conta.
  A borda com a grama é `alphaTest` + `alphaToCoverage`: continua opaca e na
  fila dos decalques. Derivada (`fwidth`) dentro de laço com `continue` é
  indefinida: o tamanho do pixel é medido UMA vez no topo e passado adiante.
- **O que mexe na água vem da cena**: `agua.marola(x, z, força)` (pedrinha,
  peixe, bico da garça, pé, mouse), `agua.rastro(i, …)` (o V de quem nada, uma
  vaga por bicho), `agua.peixe(i, …)` (sombra do cardume), `agua.furos(lista)`
  (espuma em volta do que fura a água) e `agua.moedas`/`moedaCaiu`. A faísca
  do sol entra pelo `RE_Direct` do toon: vem na cor da luz e some na sombra.
- **A margem torta não cabe num `blockCircle`**: o lago é um ANEL de 72
  círculos seguindo a margem (30 cm além da água), aberto onde passa o
  trapiche — que é cercado pelos lados, na ponta e com uma caixa de cada lado
  da raiz (o vão entre a cerca e o primeiro círculo era um corredor para
  dentro do lago). O meio do anel nunca é alcançado. `scripts/lago.mjs` prova
  isso varrendo a beira inteira atrás de ponto pisável, em vez de andar (o
  navegador do teste roda a poucos quadros).
- **Chão que se pisa acima do zero, um de cada vez**: `g.relevo((x, z) =>
  altura)` — o trapiche com a rampinha. Diferente do `elevarDupla`, cada um
  fica no piso do lugar dele (um na tábua, o outro na areia).
- **O sorteio do parque não pode andar**: a margem de arbustos e os juncos
  antigos consumiam `w.range()` ali, e continuam consumindo na mesma ordem
  (a peça que cai na entrada do trapiche é sorteada e só não entra no mundo;
  os quatro juncos viraram a altura de quatro tufos). Tudo que é novo tem
  semente própria.
- **Tocar a água com o mouse** é um `w.clicavel(lagoMalha, { soMouse: true })`:
  no celular o dedo que encosta num clicável não vira joystick, e um lago
  inteiro clicável roubaria o manche.
- **Brincadeira livre na beira** (quicar pedrinha): o prompt anda com o
  jogador (`moveTo` no `onUpdate`, prioridade baixa) e só liga perto da água;
  segurar F carrega a barra (`showCharge` com alvo e faixa), e a pedra sai da
  mão no meio do `g.arremessar` — por relógio do quadro, nunca `setTimeout`.
- **Sentar com o pé na água**: `g.setSitting(true, 'beirada')` com a âncora no
  chão e a altura descontada como no banco (`deque - 0,53 + 0,06`); a perna
  passa da linha d'água e o chão do mundo esconde o pé. O "chute" faz marola
  pelo `onUpdate` da cena.

## Caminho de parque: uma mancha de borda viva (`world/caminhos.ts`)

Caminho feito de `w.patch` colados dá junção em "T" de quina viva e beira de
régua com a grama — o Renan reparou no parque inteiro. O Villa Lobos agora
desenha a rede de asfalto como UMA conta de distância:

```ts
const caminho = beiraTorta(uniaoSuave(2.4,
  capsula(0, -16.5, 0, 30.6, 2.75),     // um trecho: de a até b, meia largura
  largo(0, 31.2, 3.2),                   // um largo redondo (a ponta não acaba a régua)
  caixaRedonda(28.8, 13, 4.8, 3, 0.8),   // um largo de quina redonda
), 2610);                                // ruído: a beira torta e a largura respirando
pintarCom(w.patch(0, 0, 1, 1, P.beiraDoCaminho, 0, 0.01, cascalho()), mancha(comCascalho, CAIXA));
pintarCom(w.patch(0, 0, 1, 1, P.asphalt, 0, 0.012, asfalto()), mancha(caminho, CAIXA));
```

- **A união SUAVE é que faz a curva** da junção (o "smooth min" de raio
  `k`), sem desenhar curva nenhuma. Os trechos ficam na MESMA linha dos
  retângulos de antes: banco, poste e interação não andam.
- **`mancha()` é marching squares**: os quadradinhos de 25 cm inteiros
  viram um retângulo por linha, e a beira é o corte interpolado onde a
  conta passa por zero (lisa, sem degrau). ~2,6 mil triângulos o parque
  todo. O `w.patch` de 1 × 1 dá o lugar na fila de pintura e a textura em
  metros; a geometria troca por cima (`pintarCom`).
- **A ordem**: o cascalho (a mesma conta, 30 cm para fora e com outro
  ruído), o asfalto, e o que pinta por cima depois (a praça entra na conta
  como um largo, para a boca do caminho alargar na chegada, e a pedrinha
  dela cobre o resto).
- **A beira viva** (`BeiraDoCaminho`): tufos de capim (lote com o `Vento`) e
  pedrinhas (lote, sem sombra) pela linha do cascalho, fora do que a cena
  proíbe (`livre`: praça, calçada de prédio, vão da cerca).
- **O espalhador do parque respeita a mancha** sem andar o sorteio: árvore,
  moita e pedra que caem no caminho são sorteadas e contadas, e só não
  entram no mundo (`caminho(x, z) < folga`). Antes ele só conhecia o
  principal, e plantava árvore no meio do transversal e da boca do vão.
- Calçada em volta de prédio é `retanguloRedondo(meiaX, meiaZ, raio)`, no
  lugar do retângulo do `patch`.

## O gelo da praça do Mano: pista pintada, fundura e os riscos da dupla

O rinque (`scenes/villaLobos.ts`, texturas em `world/texturasDeGelo.ts`,
material `GeloDoRinque` em `core/shaders.ts`) é o molde para chão que tem que
parecer MATÉRIA (gelo, vidro, água parada), e não tinta:

- **Um decalque por camada, com a forma de quina redonda**: `w.patch` de
  1 × 1 para o lugar na fila e `retanguloRedondo` no lugar da geometria (eram
  doze `patch`/`disc` por camada). A neve pisada da beira usa `neveBatida()`.
- **A pista é UM canvas do rinque inteiro** (`geloDaPista`), sem azulejo: os
  riscos de patim dando a VOLTA (uma superelipse, mais densos na faixa onde se
  patina), as voltinhas de quem girou, as freadas com o pó, a geada encostada
  na borda e as lagoas de gelo limpo no meio. O fundo é um degrau ABAIXO do
  branco: o material multiplica, e só assim a geada consegue ser mais clara
  que o gelo. O `filter: blur` do canvas não existe em todo navegador — o
  degradê da geada é feito de traços concêntricos cada vez mais finos.
- **O azulejo miúdo** (`geloDetalhe`, 2 m) entra no shader em coordenada de
  mundo, por cima da pista: sozinho, o canvas de 1024 px para 13 m borra de
  perto.
- **A fundura é paralaxe**: o desenho de DENTRO (`geloPorDentro`: nuvem funda
  no vermelho, bolha e brilho no verde, a sombra da trinca no azul — é DADO,
  sem espaço de cor) é lido no ponto onde o raio da câmera chega 12 cm (e 30
  cm, na segunda camada) abaixo da superfície. A direção da câmera no
  fragmento é `-vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])` —
  vale para a ortográfica. Girando a câmera, as trincas andam por baixo dos
  riscos. Poucas trincas: com seis por azulejo o rinque lia como vidro
  quebrado.
- **O cintilar** é a faísca do lago, mais rara (um azulejo em doze), somada
  no `RE_Direct`: vem na cor do sol e some na sombra.
- **Os riscos da dupla**: o shader lê uma tela própria (canvas de dado,
  ~39 px por metro) e a cena risca nela (`geloDaPraca.riscar`) por onde cada
  um passa DE PATINS — um arco por passada, de um pé e do outro (o zigue-zague
  de quem patina), mais branco quanto mais rápido. A tela sobe para a placa no
  máximo quatro vezes por segundo, e só quando mudou. Descalço ninguém risca:
  o `gelo.mjs` mede os dois.

## Andar de cima (o mezanino da boutique)

O motor não tem "andar": a física de caminhada escreve só `x` e `z`, e a
altura da dupla é o `y` que a cena pôs (`g.elevarDupla`). Por isso **toda
mecânica que mexe no corpo tem que preservar o `y`**: nada de mirar
`Vector3(x, 0, z)` num `lerp`, nem `teleport` sem a altura. O beijo fazia isso
(o deslize até o perfil mirava `y = 0`) e, no mezanino, levava a dupla para o
chão do térreo, debaixo do piso — o Renan viu no celular. O mesmo valia para
o parceiro que reaparece perto quando fica longe. O `scripts/lojinha.mjs` dá
as mãos e beija lá em cima e mede a altura dos dois.

## Abrir uma clareira no meio do sorteio (a clareira atrás do lago)

O Villa Lobos planta o bosque por sorteio (`w.range`). Para abrir um lugar no
meio dele **sem mexer no resto do parque**, o sorteio continua sorteando e
CONTANDO a árvore que cai lá dentro — ela só não entra no mundo (nem malha,
nem colisor). Tirar com o `livre()` pularia chamadas de sorte e todo o
parque depois dela andaria. Ver `naClareira` em `scenes/villaLobos.ts`.

- **A janela da câmera**: além do círculo, a faixa da diagonal `+X/+Z` (até
  9 m, 3,4 de cada lado) fica sem árvore alta. O bosque fecha o lugar pelo
  fundo e pelos lados; na frente, só samambaia e moita.
- **O giro do colisor tem o sinal contrário ao do `rotation.y`**
  (`world/collision.ts`): caixa comprida girada pede `-giro` no `blockBox`,
  senão fica atravessada.
- **Mancha de chão feita de muitos círculos é UM decalque**: o primeiro
  entra pelo `w.disc` (para ter o lugar na fila de pintura) e a geometria
  dele vira a união dos círculos (`mergeGeometries`). A trilha da clareira
  eram 23 desenhos por quadro.

## Decoração que não é decalque

Canteiro, vitória-régia, pedra na beira d'água: sempre que der, faça a peça ter
**volume** em vez de pintar o chão. Canteiro com borda elevada e vitória-régia
em calota nunca brigam com a grama nem com a água, porque não são coplanares com
nada — some com o risco de z-fighting antes de ele existir.

## A pilha do chão mora ABAIXO de zero

Toda peça do kit nasce com a base em `y = 0` — é o contrato do kit. Por isso o
`WorldBuilder` põe o chão e todos os decalques dele **abaixo** de zero: o chão
de base no fundo (`-0,006`), os decalques numa faixa fina acima dele, e `y = 0`
livre para as peças. A cena continua escrevendo o `y` que quiser em
`patch()`/`disc()` — ele só serve para a pilha ficar legível no código, e o
`WorldBuilder` reescreve.

Dois defeitos moravam aí, e os dois só ficaram visíveis quando o chão ganhou
textura:

1. **O chão de base ficava no MESMO plano da base de cada árvore, poste, banco
   e cerca.** Dois planos iguais é a definição de z-fighting. Enquanto os dois
   eram verde chapado, a briga dava verde e ninguém via.
2. **O decalque é desenhado DEPOIS do mundo sólido e ficava ACIMA da base das
   peças** — a calçada em `y = 0,012` pintava por cima dos 12 mm de baixo de
   todo poste plantado nela. Com a calçada texturizada, essa faixa passou a ter
   desenho e virou chiado no pé da peça.

Se um dia precisar de um chão acima de zero, lembre que ele vai comer o pé de
tudo que estiver plantado nele.

## Chão empilhado: quem manda é a ORDEM DE CRIAÇÃO

`w.patch()`, `w.disc()` e `w.ring()` desenham no chão. Eles são **decalques**:
não gravam profundidade e são pintados depois do mundo sólido, na ordem em que a
cena os criou. Duas consequências:

1. **Decalque nunca briga com decalque.** Pode empilhar quantas camadas quiser
   na mesma altura sem piscar. Milímetros de `y` não resolviam nada — o buffer de
   profundidade do celular é bem mais pobre que o do desktop e engolia a folga.
   Foi assim que a linha do meio da quadra e as manchas da praça piscaram.
2. **Quem é criado por último fica por cima.** Monte o chão de baixo para cima:
   grama, mancha de terra, calçada, linha pintada.

```ts
w.disc(x, z, r, P.grassDark, 0.004);   // manchas de grama
w.disc(0, -16.5, 8.6, P.sand, 0.008);  // borda
w.disc(0, -16.5, 8, P.concrete, 0.012);// praça
w.patch(0, 4, 5.5, 56, P.asphalt, 0, 0.016); // caminho, por cima de tudo
```

O `y` continua sendo escrito porque deixa a pilha legível no código; ele já não
decide nada. Suba `0.004` por camada e mantenha a ordem coerente com a leitura.

Anel pintado (círculo central da quadra, poça, marca no chão) é `w.ring()`, e
não dois discos concêntricos: com dois discos a borda de um cai exatamente em
cima da borda do outro, e aí a briga volta — agora entre as *bordas*, que é uma
coisa que ordem de pintura não conserta.

Fora do chão, superfícies coladas (foto na parede, bochecha no rosto, linha no
fundo da piscina) pedem o mesmo tratamento à mão: material com `{ decal: true }`
(ou `flat(cor, opacidade, true)`) **mais** um `mesh.renderOrder` que a ponha
depois da base. Ver `ToonOptions.decal` em `src/core/materials.ts`.

O mesmo vale **em pé**: porta encaixada num vão não pode ter a face do batente
na mesma altura da face da parede. `w.wall()` usa espessura `0.3`; o batente da
`interiorDoor` usa `0.24` e a porta vai **centrada na linha da parede**
(`z = zParede`, não `zParede + algo`). Faces coplanares piscam igual, seja no
chão ou na vertical.

## Texturar o chão sem trazer imagem

Decalque resolve MANCHA (um caminho de terra, uma quadra). Ele não resolve
TEXTURA: um piso de placas de 2 m num deque de 48 × 38 daria mais de 400 malhas
só para desenhar as juntas. Para isso existe `src/world/texturasDeChao.ts` —
`pisoDePlacas(lado)`, `calcadaDePedrinha(lado, porLinha)`, `asfalto(lado)`,
`tapeteDeGrama(lado)` e `dequeDeMadeira(lado, reguas)` (o deque do restaurante do
clube: fresta, fila de parafusos e uma moldura de régua atravessada em volta), desenhadas em `<canvas>` na hora em que o jogo sobe e
passadas em `textura:` para `ground()`, `groundWithHoles()`, `patch()` e
`disc()`:

```ts
w.groundWithHoles({
  width: 160, depth: 160, color: P.grass, holes: [buraco],
  textura: tapeteDeGrama(9),
});
```

Isso continua sendo zero asset: nenhum arquivo de imagem entra no repositório,
o desenho é código — o mesmo princípio do texto das placas e das memórias.

Três coisas que essa parte cobra:

- **O desenho tem que ser quase branco.** O material toon MULTIPLICA a cor
  base pela textura. Qualquer coisa escura ali vira uma segunda demão de tinta
  e o chão perde o tom da paleta. Trabalhe entre 0,88 e 1,0 de luminosidade.
- **O tamanho do azulejo é em unidades de MUNDO.** `ShapeGeometry` (o do
  `groundWithHoles`) gera UV a partir da posição do vértice, em metros — por
  isso `repeat = 1/lado` basta. `PlaneGeometry` (o do `ground`) dá UV de 0 a 1,
  e o `WorldBuilder` corrige sozinho multiplicando pelo tamanho do chão.
- **Grama repete e vira xadrez.** Azulejo grande (9 unidades), nenhuma borda
  desenhada, e as manchas largas pintadas em 3 × 3 cópias para atravessarem a
  emenda. Com 6 unidades dava para pegar a grade na vista de longe do clube.
- **A unidade tem que LER, não medir certo.** A pedra portuguesa de verdade
  tem 18 cm, e nessa medida a calçada do parque virou chiado cinza — a esta
  distância de câmera não dá para separar uma pedra da outra. Com 40 cm o
  assentamento aparece. O jogo é estilizado: ler ganha de medir.
- **A MESMA grama nos dois cenários**, para o clube e o parque serem o mesmo
  mundo. Já o piso claro é DIFERENTE de propósito: placa grande de borda de
  piscina no clube, pedrinha miúda de praça no parque. O que separa os dois é a
  escala da unidade, e é ela que diz de que lugar você está falando.
- **O grão tem que sobreviver ao mipmap.** O agregado do asfalto nasceu com um
  pixel e sumia no jogo: a esta distância de câmera o mipmap come qualquer
  coisa desse tamanho, e sobrava asfalto liso. Grão de 2 a 3 px aguenta um
  nível e continua lendo de longe.
- **Chão texturizado ao lado de chão liso denuncia os dois.** A quadra de
  frisbee era um `patch` de grama sem textura no meio de um gramado com — o
  retângulo liso saltava. Se um pedaço do chão ganhou textura, os vizinhos da
  mesma matéria precisam ganhar também.

## Textura em móvel: o acabamento

O kit de interiores nasce liso, e continua liso para quem não pediu nada (a
escola usa as mesmas peças; a casa, a boutique e o Mania ganharam as suas).
Quem quer madeira com veio, sofá de
tecido ou bancada de granito passa a peça por `acabar()`
(`world/acabamento.ts`) com as cores que devem ganhar desenho:

```ts
const veio = veioDeMadeira();
const envernizar = <T extends THREE.Object3D>(obj: T): T =>
  acabar(obj, [[P.wood, veio], [P.woodDark, veio]]);
w.add(envernizar(w.place(desk(), x, 0, z, rot)));
w.add(acabar(w.place(counter(3.6), x, 0, z), [[P.concrete, granito()]]));
```

Ela troca só a malha cujo material É `toon(cor)` (o objeto do cache) por
`toon(cor, { mapa })`, e reescreve o UV da malha **em metros**
(`uvEmMetros`, projeção de caixa): o veio sai do mesmo tamanho na tampa de
1,6 m e no pé de 6 cm, e corre sempre no lado mais comprido da peça. As
texturas moram em `world/texturasDeCasa.ts` (veio, tecido mesclado,
matelassê, granito, o desenho do tapete). O quarto e a casa do Ari são o
exemplo inteiro.

Parede levantada com `w.wall` também se texturiza: `revestir(parede,
'reboco' | 'tijolo')` (`world/moveisDoMania.ts`) troca o material da malha
que o `w.wall` devolve e põe o UV de parede (o `v` na altura, do chão). O
colisor não muda. Pano colado na parede (o tijolinho atrás da grelha, o
azulejo de metrô atrás da pia) é `panoDeParede(comprimento, altura, tipo)`.

O que já custou foto:

- **Nada de padrão fino.** A trama de 6 mm do tecido virava moiré (manchas
  de 5 cm) — nada menor que uns 2 cm sobrevive a esta câmera.
- **Nada de grade.** Soma de senos e ruído de grade deixam a treliça à mostra
  (o sofá saiu quadriculado, como capitonê). Mescla boa é mancha solta em
  lugar sorteado mais granulado de 2 px.
- **Branco não aguenta mescla.** Lençol e fronha com 4% de variação já liam
  como sujeira cinza; ficaram lisos, e o matelassê do edredom ao lado faz o
  trabalho.
- **Peça arredondada (`RoundedBoxGeometry`) decide o UV por TRIÂNGULO**
  (`uvEmMetrosPorTriangulo`): na quina a normal gira de vértice para vértice,
  e decidir por vértice espreme o desenho dentro do triângulo.

## Luz que se vê (sem luz de verdade)

`PointLight` nova faz o three recompilar o shader da cena inteira e pesa no
celular. Abajur e janela são LUZ PINTADA, somada ao que está embaixo
(`AdditiveBlending`), e nenhuma faz sombra (`userData.semSombra`, que o
`w.add` respeita):

| peça (kit) | o que é |
|---|---|
| `haloDeLampada(tam)` | o brilho macio em volta da cúpula (sprite) |
| `pocaDeLuz(raio, cor, forca, emPe?)` | o degradê redondo no chão — ou em pé, o leque na parede atrás do abajur |
| `claridadeDaJanela(larg, alt, centro)` | o retângulo de luz do dia que a janela joga no chão, mais o feixe fraquinho; pendure no pé da parede com o mesmo giro da janela |

Duas lições da boutique (segunda reforma):

- **Globo pendurado num fio não serve em interior sem teto.** A câmera olha
  de cima, e uma bolinha acesa a 2,3 m cai, na projeção, dois metros atrás do
  móvel que ela ilumina — os globos do caixa apareciam boiando na frente da
  escada rolante. Lustre grande, de braços, passa (lê como lustre de qualquer
  ângulo); para o resto, arandela na parede (com o leque pintado) ou só o
  FOCO — a `pocaDeLuz` no chão ou em cima do pedestal, sem lâmpada à vista.
- **Poça em cima de tampo: 2 cm, não 6 mm.** A poça não grava profundidade,
  mas TESTA; a 6 mm do tampo de um pedestal torneado (`LatheGeometry`, os
  triângulos todos convergindo no meio) ela brigou com ele e saiu em raios.

Três do Mania por dentro (`world/moveisDoMania.ts`):

- **Pendente em cima de BALCÃO, nunca de mesa**, e sem sombra: o pendente é a
  luz, e a sombra dele (o sol da cena é que faz sombra) caía bem em cima da
  poça que ele pinta no tampo — as peças dele levam `semSombra`.
- **Luz de brasa é laranja pintado em três lugares**: o halo sobre o carvão,
  o leque no tijolo entre a grelha e a coifa, e uma poça fraca no chão da
  frente. Uma só não lê como fogo aceso.
- **Antes de pendurar na parede, olhe o que fica NA FRENTE dela** naquela
  altura. A lousa do prato do dia morou anos atrás da coifa e da chaminé da
  churrasqueira (de 1,94 a 3,5, bem na frente dela): existia e ninguém via.
  Foi para o salão, e o ponto de ler foi junto.

O abajur do quarto e o de pé da sala **apagam num clique** (`w.clicavel`,
não `w.interact`: o criado-mudo é colado no quadro de memórias, e um segundo
balão disputaria o E). A cúpula de `nightstand()`/`floorLamp()` tem o nome
`cupula` para a cena achar e trocar o material.

## Evento por cima de um cenário: a CAMADA (o Halloween)

Um evento (o especial de Halloween, `docs/HALLOWEEN.md`) muda o jogo por um
tempo e depois TUDO volta ao normal — e o original não pode se perder. Por
isso o evento nunca edita uma cena nem uma peça: ele é uma camada.

- **Mora fora das cenas**: as regras e as fases em `src/eventos/<evento>/`
  (`fase.ts`: as fases são flags do save; `faseDoHalloween(g)`), as peças em
  `src/world/<evento>/`. A cena ganha UMA chamada (`montarHalloweenNaCasa(w,
  { … })`), que devolve o que ela precisa perguntar (`temFilme()`) — e a
  cena empresta as âncoras dela (o assento do sofá, a TV) em vez de o evento
  procurar.
- **Escondido até ficar pronto**: `eventoLiberado()` só é verdade com
  `?halloween` na URL. Sem ele o módulo não monta NADA, e
  `scripts/halloween.mjs` (`SO=volta`) confere que a cena tem as mesmas
  malhas do commit de antes do evento.
- **O ponto de volta** é um commit da `main` anotado no plano (o proxy do
  git daqui não aceita tag).
- **Carta, bilhete, convite**: `g.lerCarta(pintura)` abre uma pintura em
  canvas no painel do quadro de memórias (sem entrar no quadro) e resolve
  quando ele fecha.
- **Coisa do caminho principal tem que estar à vista**: a carta parou primeiro
  a 1,6 m da porta e a parede alta (2,6 m) escondia ela na câmera de sempre.
  Ela entra numa tomada de câmera de dentro da sala (`g.setCameraOmbro`) e
  para a ~3 m, fora da sombra da parede.

O parque enfeitado (a etapa 2, `eventos/halloween/noParque.ts`) é o molde
de camada GRANDE, que enfeita uma cena inteira:

- **A chamada vai no FIM do `build`**, com o parque pronto: a camada acha
  as peças pela etiqueta (`userData.peca`: `arvore`, `poste`,
  `mesa-de-sorveteria`, `boneco-de-neve`, `bilheteria`…) e lê a posição e a
  caixa delas — uma abóbora no pé de cada poste, um fantasminha no galho de
  cada árvore. O que não tem etiqueta (o lago, a roda, os postos) a cena
  empresta na chamada.
- **Tudo em lote para a cena inteira**: as abóboras do parque são UM
  `LoteDeAboboras`, o que se pendura é UM `EnfeitesDePendurar`, as lápides
  UM `LapidesFofas` — umas vinte malhas para mais de trezentas peças.
- **O céu de um evento vai no primeiro quadro** (`w.onUpdate` uma vez), e
  não no `build`: o motor põe o céu da cena DEPOIS de montá-la, e o
  `g.luzDoCeu` do `build` some.
- **Quem não está** (`eventos/halloween/ausentes.ts`, `ausentarNaCena(w, {
  bichos, etiquetas, interacoes, recados })`): o personagem continua sendo
  montado do jeito de sempre; a camada o esconde, o cala (`aoSoar = null`) e
  desliga as conversas dele A CADA QUADRO, num `onUpdate` registrado por
  último (a cena liga e desliga as dela sozinha). `prefixo*` pega as
  interações de nome repetido (`mania:mesa-*`). Quem a cena monta dentro de
  uma função é achado pela etiqueta: todo bicho guarda a referência dele em
  `group.userData.bicho`. O que a cena faria SOZINHA com quem não está (o
  tour da Luna, o treino das irmãs) ganha uma linha de guarda
  (`quemFoiSeArrumar(g)`) — esconder não basta, a cutscene rodaria.
- **Mudar a COR de um lugar durante o evento** é repintar a peça pronta
  (`world/halloween/repintar.ts`), e não mexer na fábrica dela; a água do lago
  troca de cor pelos uniformes (`agua.trocarCores`, sem recompilar nada).
  Interação do evento que substitui uma de sempre (a gelatina no lugar do
  "Olhar o lago") desliga a de sempre pelo `id` no fim do `build`.
- **Fala que dispara ao passar perto** (os comentários da dupla): uma vez
  por save (`flag`), e só com quem joga ANDANDO — parado, ele pode estar
  numa conversa, e um balão não pode cair por cima de outro.
- **Quem vem de outro cenário para o evento** (a festa: a Gina, o Capy, o
  Noel, a Josefina, o Gatito e o Flynn no parque) é montado pela camada com
  a classe de sempre, numa área de posto (`eventos/halloween/naFesta.ts`), e
  o cenário de origem fica vazio pela MESMA chamada do convite
  (`quemFoiSeArrumar` vale do convite até a noite de sono). Quem já mora no
  cenário e só aparece destravado (o Jean-Luc, as coelhinhas) ganha uma
  linha na cena (`|| festaNoParque(g)`) — esconder dá para fazer de fora,
  fazer aparecer não.
- **A conversa com zoom** (a festa, pedido do Renan: ver as fantasias de
  perto enquanto conversa): a isométrica dá lugar ao `setCameraOmbro`, que
  NASCE no enquadramento dela (a perspectiva de 58° a ~11,7 m na direção da
  isométrica enquadra o mesmo que o `setZoom(13)`) e desliza até um
  três-quartos de frente de quem fala, pelo relógio do jogo
  (`w.onUpdate`). Três regras que a foto ensinou: **quem fala vira para a
  câmera**, e não para a dupla (virado para a dupla, a câmera via o leque do
  Noel por trás); **a dupla é posta DE LADO** (`releasePlayer`/
  `releaseCompanion`, cada um olhando para ele) — onde ela estava, o
  parceiro tapava o Noel; e a **distância sai da altura medida** (a caixa do
  bicho com a fantasia: a Gina de longe, a Josefina de perto, a câmera um
  pouco mais alta para os pequenos não ficarem atrás das flores). Quem a
  cena leva de um lado para o outro (o Cookie) não sai do serviço: a
  conversa só o segura parado (`seguir` para onde ele parou, num `onUpdate`
  registrado depois do da cena). E a conversa de sempre pode EMENDAR ainda de
  perto (`interactable.trigger(g)`: o bilhete do Cookie). Quem fala atrás
  de um BALCÃO (o Walter na barraca) passa a `frente` do balcão, a `dupla`
  (onde os dois ficam: na frente do tampo) e a `distancia` na ficha do
  convidado — a frente da câmera de sempre gira com o Q/R e levaria a
  câmera para trás da barraca.
- **A cutscene grande: o voo e a chegada** (o ônibus da festa,
  `eventos/halloween/chegadaDoOnibus.ts`). Tudo num relógio só, o do jogo:
  `esperar(s)` é uma promessa que um `w.onUpdate` resolve, e o que anima
  (o ônibus, a porta, os pulos) é um `aCadaQuadro(f)` que roda até `f`
  devolver `true`. O VOO é duas `CatmullRomCurve3` — onde a câmera está e
  para onde ela olha — percorridas pela mesma curva de tempo (sai devagar,
  cruza, chega devagar); depois dele a câmera fica PARADA e só o olhar
  acompanha o ônibus chegando. Três coisas que a foto ensinou: a câmera
  que voa baixo entra em árvore (o fim do voo era dentro de uma copa: ele
  chega agora pelo corredor do vão, longe da fileira de árvores); a tomada
  de perto não pode vir do lado de uma peça de vidro (a Gina falou atrás
  do abrigo do ponto — agora vem do parque, com o ônibus no fundo); e quem
  desce de um veículo aparece DENTRO do vão da porta, em cima do degrau
  (`y` do degrau), e pula para o chão. Os passageiros são os bichos dos
  postos: guardados (onde e virados para onde), escondidos durante a
  cena, e devolvidos aos postos por baixo da tela escura no fim.
- **O teste da volta mede cena por cena** contra o ponto de volta: com o
  commit de antes do evento num `git worktree`, as mesmas cenas com o save
  zerado dão as mesmas malhas (`MALHAS_ANTES` no `halloween.mjs`).

## Regras da casa

1. **Cor sempre da paleta** (`src/palette.ts`). Se falta uma cor, adicione lá.
2. **Material sempre por `toon()`/`flat()`** (`src/core/materials.ts`), que são
   cacheados. Nunca `new THREE.Mesh*Material` solto dentro de uma cena.
3. **Reaproveite os kits**: `src/world/props.ts` (externo) e
   `src/world/furniture.ts` (interno). Peça nova e reutilizável vai para o kit,
   não para dentro da cena.
4. **Interiores**: paredes inteiras só em `-X` e `-Z`; nos dois lados abertos use
   mureta (`altura 0.45`), senão a parede tapa a câmera.
5. **Ponto de nascimento livre**: confira que o `spawn`/`entries` não cai dentro
   de um colisor — o jogador fica preso.
6. **Nada de arquivo de modelo 3D.** Tudo é primitiva, de propósito: o repositório
   fica leve e dá para ajustar qualquer coisa mudando número.
7. **Diálogo em português, curto, específico.** Duas ou três linhas por interação.
   Cada cenário deve render pelo menos uma memória (`g.unlock`).
8. **Falante certo no diálogo.** `g.say(linhas, NOME)` escolhe quem fala. Para
   uma conversa entre os dois, importe `ARI` e `RENAN` de `characters/cast` e
   passe `ARI.name` / `RENAN.name` — assim a fala não troca de dono quando o
   jogador aperta T.
9. **Toda interação é conversa entre os dois.** Uma fala solta é exceção, não
   regra. Use um helper local e os nomes de `ARI`/`RENAN`:

   ```ts
   const conversa = async (falas: Array<readonly [string, string]>) => {
     for (const [quem, texto] of falas) await g.say([texto], quem);
   };
   await conversa([[R, 'Que lago bonito…'], [A, 'Então vamos!'], [R, 'NÃAAOOO']]);
   ```
10. **Fala que o Renan escreveu vai literal.** Quando ele der o texto de uma
   interação, use exatamente aquilo — não reescreva nem "melhore".
11. **Passagem tem eixo, e o eixo fica vazio.** Portão, vão de cerca, ponto de
   embarque: escolha a linha reta que vai da entrada até o destino (um `z` ou um
   `x` fixo) e **não ponha nada em cima dela** — nem cobertura, nem placa, nem
   canteiro, nem colisor. Enfeite vai para as beiradas. Vale para a peça *e*
   para o `blockBox` dela: dá para a peça parecer fora do caminho e o colisor
   não estar.

   Quando o destino tem um ponto de entrada próprio, é o **ponto** que se alinha
   ao eixo, não o centro da peça. A porta de embarque do ônibus da cidade
   (`world/onibusDaCidade.ts`) fica 2,6 à frente do centro: para ela cair num `z`, o ônibus
   inteiro anda 2,6 para trás. Mexer na porta dentro do prop move onde a dupla
   desembarca nas duas cenas.

12. **Porta em mureta: o vão vai até o chão, e a parede fecha em cima.** A
   porta da rua da casa do Ari ficou com a mureta baixa da frente correndo
   POR BAIXO dela (um degrau de 45 cm atravessando a soleira, visto girando a
   câmera) e sem nada acima do batente. O certo: a mureta em dois trechos, dois
   pedaços de parede alta ladeando o vão, e um bloco só de malha (sem colisor)
   em cima da porta. Ver a porta da rua em `scenes/casa.ts`.

## Depurar posição

`?em=x,z`, `?olhar=<rad>` e `?zoom=<n>` na URL põem a dupla onde você quiser —
é o jeito rápido de conferir uma interação sem atravessar o cenário andando.
(O parque só força o zoom perto da roda gigante; no resto a URL manda.)

`zoom` é o **tamanho do quadro**, não a aproximação: quanto **maior**, mais
longe a câmera parece. `zoom=6` é retrato, `zoom=13` enquadra um canto,
`zoom=30` mostra um pedaço grande do cenário.

Para testar um corredor andando: na câmera padrão nenhuma tecla anda em `+X`
sozinha — segure **D e S juntos** para `+X` — e leia
`window.jogo.player.position` entre um passo e outro. Se o `z` não muda ao longo
do trajeto, o caminho está limpo; se muda, alguma coisa está empurrando.

## Antes de dizer que terminou

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/smoke.mjs /tmp/aristory   # tira as fotos e checa erros de console
```
Olhe as imagens. Confira: dá pra andar sem travar, os prompts aparecem, nada
flutuando no ar, nada atravessando parede. Veja `.claude/skills/aristory-testar`.
