# AriStory

Jogo isométrico em TypeScript + Three.js + Vite. Um presente: o jogador anda por
cenários que existem de verdade na vida do casal e interage com as coisas.

**Idioma do projeto é português.** Diálogos, nomes de cena, commits, comentários
e documentação em pt-BR. Código (identificadores) em português também, sem
acento — é o padrão do repositório, siga o que já está lá.

## Antes de mexer, leia a skill certa

| tarefa | skill |
|---|---|
| criar/editar um cenário | `.claude/skills/aristory-cenario/SKILL.md` |
| aparência de um personagem | `.claude/skills/aristory-personagem/SKILL.md` |
| criar uma peça de cenário | `.claude/skills/aristory-prop/SKILL.md` |
| criar um bicho (gato, cachorro, passarinho) | `.claude/skills/aristory-bicho/SKILL.md` |
| criar/ajustar uma praga do minigame do jardim | `.claude/skills/aristory-praga/SKILL.md` |
| criar/ajustar uma carta (habilidade) do minigame do jardim | `.claude/skills/aristory-habilidade/SKILL.md` |
| pintar uma memória para o quadro (a partir de uma foto) | `.claude/skills/aristory-memoria/SKILL.md` |
| adicionar/ajustar roupa do guarda-roupa (e o ateliê de tingimento) | `.claude/skills/aristory-roupa/SKILL.md` |
| criar/ajustar um enfeite (decoração) da lojinha da estufa | `.claude/skills/aristory-enfeite/SKILL.md` |
| pôr um prato novo no cardápio do restaurante | `.claude/skills/aristory-prato/SKILL.md` |
| escrever/ajustar uma lição da apostila de português do Gatito | `.claude/skills/aristory-apostila/SKILL.md` |
| som, música ou efeito sonoro | `.claude/skills/aristory-som/SKILL.md` |
| rodar, ver e validar | `.claude/skills/aristory-testar/SKILL.md` |

Elas existem para você **não precisar varrer o código** a cada tarefa. Comece
por elas.

### REGRA DE TODA TAREFA: as duas camadas de skill

Pedido de cenário, personagem, modelo, peça, móvel, bicho, enfeite, roupa,
efeito, luz, interação — **qualquer coisa que se vê ou se toca no jogo** —
começa carregando (com a ferramenta `Skill`) as DUAS camadas, antes de
escrever código:

1. **a skill `aristory-*` da tarefa** (tabela acima): as regras e o kit do
   jogo — o que já existe, onde mora, o que já custou foto;
2. **as skills `threejs-*` que a tarefa pede** (tabela abaixo): a técnica para
   o modelo sair bonito e leve. Foram elas que fizeram a casa e o quarto do
   Ari: textura de canvas, quina arredondada, vaso torneado, folha
   instanciada, luz pintada, abajur de clicar.

Não é opcional e não é "se der tempo": peça nova feita só de caixa e cilindro
liso, sem passar pelas `threejs-*`, é o jeito antigo — o Renan pediu
explicitamente que as novas sejam usadas sempre. Quando uma delas discordar do
AriStory, valem as regras daqui (ver abaixo), mas a técnica entra.

| o pedido | `aristory-*` | `threejs-*` a carregar |
|---|---|---|
| cenário novo ou mexer num cenário | `cenario` (+ `prop` para as peças) | `geometry`, `textures`, `lighting`; `interaction` se tiver coisa de tocar |
| móvel, peça, objeto, modelo | `prop` | `geometry`, `textures`; `lighting` se acende |
| personagem ou NPC | `personagem` | `geometry`, `animation` |
| bicho | `bicho` | `geometry`, `animation` |
| roupa | `roupa` | `geometry` |
| enfeite da estufa | `enfeite` | `geometry`, `textures`, `lighting` |
| praga do jardim | `praga` | `geometry`, `animation` |
| prato do cardápio | `prato` | `geometry`, `textures` |
| efeito (vento, água, brilho, tela) | a do lugar onde ele entra | `shaders`; `postprocessing` medindo no celular |
| clique, toque, arrastar no mundo | a do lugar | `interaction` |
| cutscene, coreografia, movimento | a do lugar | `animation` |
| noite, abajur, poste, sombra | `cenario` | `lighting` |

E sempre, no fim: `aristory-testar` (foto olhada, testes, e o
`scripts/zfighting.mjs` com `SO=` nas peças novas).

### Qualidade é bonito E leve — e leveza nunca custa beleza

As `threejs-*` deixam as peças bonitas com muitos pedaços pequenos (livro,
ripa, puxador, almofada), e cada pedaço é um desenho a mais por quadro. Medido
em outubro: a sala do Ari sozinha desenhava 436 objetos por quadro e 62 mil
triângulos — perto do parque inteiro (547) e quase o dobro de triângulos dele.
Por isso toda peça nova passa também por esta regra. **Não há teto de
objetos nem de triângulos**: o que vale é o princípio abaixo.

**A regra de ouro: só entra mudança de desempenho que NÃO perde nada de
qualidade.** Nenhum detalhe some, nenhuma cor muda, nenhum segmento a menos
numa curva que aparece, nenhuma textura mais pobre, nenhuma sombra a menos. A
foto de antes e a de depois têm que ser a mesma imagem. Se a otimização muda
o que se vê, ela não entra.

O que pode (e deve) ser feito, porque não muda a imagem:

- **Juntar os pedaços de mesmo material numa malha só** — já existe a
  ferramenta: `fundir(peca)` (`world/fundir.ts`, por cima do `mergeGeometries`
  do three; ver `threejs-geometry`). Ela já respeita sozinha os cuidados
  abaixo. No quarto e na casa do Ari ela cortou os desenhos por quadro quase
  pela metade (308 → 158 e 279 → 143, na vista de entrada) com a MESMA imagem:
  comparadas pixel a pixel, as fotos de antes e depois só diferem em 1 a 6
  pixels de quina, por arredondamento. `?semFundir` na URL desliga, para
  comparar. Vale para o que está parado E para o que SE MEXE: o
  que se mexe junto vira uma malha só DENTRO do grupo que se mexe. A folha da
  porta, as almofadas dela, a maçaneta e o olho mágico são uma malha só dentro
  da `dobradica`, e a porta continua abrindo; o tambor da máquina e as roupas
  dentro dele são uma malha só dentro do `tambor`, e ele continua girando. O
  que se mexe SEPARADO continua em grupos separados — o pivô é o que decide.
- **Repetição vira `InstancedMesh`** (teclas, fios de franja, folhas, livros
  iguais): uma malha, centenas de cópias, cor por instância se precisar.
- **Material e textura compartilhados** — já é o padrão do `toon()` (cacheado)
  e das texturas de canvas (desenhadas uma vez). Nunca uma cópia por peça.
- **Luz pintada em vez de luz de verdade** (`pocaDeLuz`, `claridadeDaJanela`,
  `haloDeLampada`): o efeito na tela é o mesmo, e luz nova recompila o shader
  da cena inteira.

Cuidados ao juntar, para não quebrar nada:

- O que a cena ACHA PELO NOME (`tela`, `cupula`, `tambor`, `dobradica`,
  `floreira`, o `userData.livro` da estante que o `quarto.mjs` mede) continua
  existindo com o mesmo nome — junta-se em volta, não por cima.
- A peça que é `highlight` de uma interação ou alvo de `w.clicavel` continua
  sendo o mesmo grupo.
- Quem troca material em tempo de jogo (o abajur que apaga, a TV que liga)
  fica numa malha própria.
- Depois de juntar: foto de antes e depois lado a lado, os testes da peça, e
  o `scripts/zfighting.mjs` (malha juntada não pode criar face coplanar nova).

**O que é só FUNDO** (casas vizinhas, canteiros, sebes, moitas e flores que
ninguém procura pelo nome, ninguém mexe e ninguém toca) usa
`fundirComoFundo(grupo)`: ela apaga os nomes de dentro e junta o grupo
INTEIRO por material — dez canteiros de mesmas cores viram os desenhos de
um. A frente da casa do Ari caiu de 933 para 339 desenhos por quadro assim.
Agrupe por vizinhança (um grupo por pedaço do mapa), para o que está fora da
tela não ser desenhado.

**Efeitos pesados** (filtros de tela do `threejs-postprocessing`, shader
animado, sombra extra, luz de verdade): entram quando melhoram o que se vê, e
sempre medidos no celular — o laboratório, que usa todos ao mesmo tempo, é o
que mais trava. Se um efeito pesa, a saída é deixá-lo mais esperto (desenhar
em resolução menor só o que não se nota, ligar só quando está na tela), e
nunca trocar por uma versão mais feia.

Para medir, no console do jogo: `window.jogo.renderer.info.render` (`calls` é
quantos objetos foram desenhados no quadro, `triangles` os triângulos). Anote
o antes e o depois no commit.

### As skills genéricas de Three.js

Além das `aristory-*`, a conta tem dez skills genéricas de Three.js
(`threejs-*`). São manuais de técnica, não do jogo: ensinam o que o motor ainda
não usa, mas **não sabem das regras daqui**. Quando uma delas discordar das
`aristory-*` ou das invariantes abaixo, valem as do AriStory: a cor sai da
paleta, o material sai de `toon()`/`flat()` (e efeito novo de material entra
no kit, em `core/materials.ts`, nunca dentro de uma cena).

| skill | vale? | para quê, aqui |
|---|---|---|
| `threejs-shaders` | **sim** | `onBeforeCompile` em cima do `MeshToonMaterial` sem perder o degrau do toon: vento em árvore e grama, água ondulando, brilho pulsando. O kit já existe (`core/shaders.ts`, nascido no laboratório); o jogo de sempre ainda não usa |
| `threejs-postprocessing` | **sim, medindo no celular** | contorno de desenho, bloom suave nas luzes, tom de cor por cenário. Código do próprio Three (`three/addons`), sem asset — mas pesa no celular: só entra com foto e medição nos dois |
| `threejs-geometry` | **sim** | `mergeGeometries` e `InstancedMesh` para aliviar o celular, e `BufferGeometry` própria (folha, tecido, curva) |
| `threejs-lighting` | sim | cena de noite, abajur e poste, ajuste de sombra. **Ignore a parte de IBL/HDR**: pede arquivo externo |
| `threejs-interaction` | em parte | `Raycaster` para tocar no mundo (pôr enfeite, peça do xadrez, NPC no celular) — já está no motor (`w.clicavel`). **OrbitControls e afins, só no drone do laboratório**: no jogo a câmera é isométrica fixa (`core/IsoCamera.ts`) |
| `threejs-animation` | em parte | os padrões de animação procedural e easing, e trilhas de keyframe para cutscene (a travessia do computador já é assim). Ossos e morph **feitos em código** servem (a cobrinha e o coração do laboratório); **GLTF e modelo carregado, não**: o corpo é o `CharacterRig`, animado em código |
| `threejs-textures` | **sim, só canvas** | textura procedural em `<canvas>` (o veio, o tecido, o matelassê, o tapete e o assoalho da casa — `world/texturasDeCasa.ts`, `world/texturasDeChao.ts`) e render target (o espelho). Carregar imagem, cubemap ou HDR é proibido |
| `threejs-fundamentals` | pouco | consulta de transformação e de `dispose`; o motor já está montado |
| `threejs-materials` | pouco | quase tudo é PBR, que não é a cara do jogo. Serve a seção de toon e as propriedades comuns — e nunca para instanciar material numa cena |
| `threejs-loaders` | **não vale** | é toda sobre carregar `.glb`, imagem e HDR, o que a primeira invariante proíbe. Não use neste projeto |

**O quarto e a casa do Ari são o exemplo inteiro, no jogo de verdade**
(textures, geometry, lighting e interaction): o acabamento dos móveis
(`world/acabamento.ts`), o edredom dobrado e a franja instanciada, o armário
oco, a espada-de-são-jorge torneada, os móveis fofos da sala e da cozinha
(`world/moveisDaCasa.ts`), a porta da rua, a luz pintada do abajur e da
janela, e o abajur que apaga num clique — ver "Textura em móvel" e "Luz que
se vê" na skill de cenário, e as seções do quarto e da casa na skill de peça.
Antes de criar peça nova, olhe como essas foram feitas. Para PRÉDIO por fora,
o exemplo é a lojinha da Estella (`world/lojaDeRoupas.ts`): parede com furo
de verdade, moldura com perfil (`world/molduras.ts`), reboco, friso e
tijolinho em canvas (`world/texturasDeFachada.ts`) — ver "Prédio de rua" na
skill de peça. Para prédio de TELHADO, o Mania de Churrasco do clube
(`world/restauranteDoClube.ts`): telha colonial em geometria, toldo por
janela, chaminé com fumaça e eólico girando numa peça fundida, e a mesa com
toalha xadrez — ver "Prédio de telhado" na skill de peça. Para LOJA por
dentro, a boutique da Estella (`world/moveisDaBoutique.ts`): a arara que
pendura o catálogo de verdade em instância (`world/roupasNaArara.ts`), a
boiserie com perfil, o balcão canelado, o pufe capitonê e a escada rolante
que anda
(`world/escadaRolante.ts`) — ver "A boutique da Estella por dentro" na skill
de peça. Para COZINHA E SALÃO de restaurante, o Mania por dentro
(`world/moveisDoMania.ts`): a churrasqueira de tijolinho com os nichos de
lenha em arco e a brasa acesa em lote, o inox escovado em canvas, a pia de
duas cubas abertas com a ducha de mola, o balcão de moldura e almofada com
tampo de granito, a estante do bar de garrafas torneadas em lote, a mesa com
a toalha xadrez caindo nas pontas e o pendente de esmalte — ver "O Mania de
Churrasco por dentro" na skill de peça. Para QUIOSQUE com tema, a sorveteria
do Mano (`world/sorveteriaDoMano.ts`): telhado de escama de chocolate com a
neve escorrendo em casca própria, lambrequim recortado com luzinhas, vitrine
de gelato em cubas abertas e a cadeirinha de coração, e os enfeites da
praça (`world/pracaDeGelo.ts`: cristal lapidado com a borda acesa, poste de
estrela torcida, boneco de neve amassado, a borda como um banco de neve
só) — e o gelo do rinque é o
exemplo de CHÃO que parece matéria (`GeloDoRinque`: fundura por paralaxe,
cintilar e os riscos que os patins deixam) — ver as seções na skill de peça
e na de cenário. Para VEÍCULO, o ônibus da cidade (`world/onibusDaCidade.ts`):
a carroceria é o perfil de lado extrudado com bisel (as caixas de roda
recortadas), as faixas dão a volta e param nas portas, o letreiro de LED em
canvas, as rodas num lote que gira, e a porta, o farol e o pisca com comando
para a cena — ver "O ônibus da cidade" na skill de peça. Para BICHO QUE
NÃO É GENTE, a Valentina (`entities/bichos/Valentina.ts`): flamingo de
verdade, com o pescoço vivo (um tubo refeito a cada quadro) e a ROUPA POR
FICHA num kit à parte (`world/looksDaValentina.ts`) — look novo é uma
ficha nova; ver "Bicho com guarda-roupa" na skill de bicho. Para CARRO (veículo
OCO, com cabine de verdade e montado por FICHA DE DADOS), o Bebito Mobile
(`world/bebitoMobile/`): a lataria é uma pele de fatias (planta de
superelipse, perfil de lado, a grade alinhada às janelas), os vidros são
transparentes com a borracha em filete (`friso`, e não tubo), o teto sai, os
encostos da frente deitam e viram cama com o banco de trás, e a pintura, a
placa e o que vai em cada vaga
(painel, retrovisor, chave, teto, porta-malas, banco de trás, vidro,
para-choque, rodas) saem da ficha do save — ver "O Bebito Mobile" na skill
de peça. Para PLANTA DE JARDIM, o kit das plantas do quintal do Ari
(`world/plantasDeJardim.ts`; hoje é o Papita Delivery que as vende, uma a
uma, para o quintal decorado): cada espécie é um lote para o jardim inteiro
(hortênsia, lavanda, capim de pluma, agave, margarida, costela-de-adão, hera
no muro), a folha é uma fita dobrada na nervura, a haste e a flor dividem a
geometria pela cor do vértice, e o que é fino balança no `Vento` — ver "As
plantas do jardim" na skill de peça. Para CENA QUE SE DIRIGE, a estrada do Bebito Mobile
(`scenes/viagemDeCarro.ts`, peças em `world/estrada.ts`): o mundo posto por
uma conta (`naPista(s, l)`) numa pista curva sorteada por semente, a câmera
de perseguição, o freio que nunca deixa atropelar e o piloto automático do
teste — ver "Uma cena que se DIRIGE" na skill de cenário.

**O laboratório é a vitrine viva delas.** O computador do quarto do Ari abre
a pasta `AriStory_teste`, um mundo de teste (`scenes/laboratorio.ts`, peças em
`world/laboratorio/`) com uma estação por skill: o sistema solar em
hierarquia, o palco com luz de verdade e o ciclo do dia, a vitrine dos
materiais, o holograma/presente/lago/grama de vento, o telão/TV ao vivo/
quadros de pixel/bola espelhada, o coração extrudado/cidade fundida/tornado
instanciado, os cristais de clicar/bola de arrastar/drone, e o robô de
keyframes/cobrinha de ossos/coração de morph — mais a mesa dos dez filtros de
tela. Antes de trazer uma técnica para o jogo de verdade, veja como ela já
roda lá dentro. O motor ganhou para ele: `core/posProcessamento.ts`
(`g.telaComEfeitos`), `core/Apontador.ts` (`w.clicavel`), `core/shaders.ts`,
`g.luzDoCeu`, `g.cameraLivre` e o véu `'digital'` do `goTo`.

Três pontos em que as skills estão **desatualizadas** para o three 0.180 do
jogo (o laboratório já usa o certo): o fim da fila de pós-processamento é o
`OutputPass`, e não o `GammaCorrectionShader`; o `FilmPass` é
`new FilmPass(intensidade, cinza)`; e o `HalftonePass` recebe só os parâmetros
(`new HalftonePass({ shape, radius, … })`), sem largura e altura. E um
defeito do próprio three 0.180: o `GlitchPass` guarda o mapa em `_heightMap` e
lê `heightMap` — o `dispose()` estoura e travava a troca de cena; use o
`glitchConsertado()` de `core/posProcessamento.ts`.

Fora do código, tem mais três documentos em `docs/`: `PERSONAGENS.md` diz
como o Ari e o Renan são de verdade (cabelo, roupa de referência, os NPCs já
mencionados mas nunca modelados) — leia antes de perguntar ao Renan algo que
já está respondido ali. `ARQUITETURA.md` é o motor por dentro.
`CONTEXTO-INTEGRAL.md` e `ROADMAP.md` são um retrato do projeto e do que
falta — **úteis para se situar rápido, mas podem estar desatualizados**; o
`git log` é a fonte da verdade para o que mudou por último.
**O Halloween está FORA DO JOGO desde 2026-11-08 (o Renan mandou tirar),
guardado inteiro para usar outra vez.** A chave e o mapa do que fica guardado
(o parque enfeitado, a festa, a boutique, a casa, as fantasias) moram em
`src/eventos/Halloween.ts`: `HALLOWEEN_NO_JOGO = false` hoje; para religar é
`true` (e trocar `EDICAO_DO_HALLOWEEN` se for jogar a história de novo noutro
ano) — nada foi apagado. As fantasias e coroas já ganhas ficam no guarda-roupa
e as memórias no quadro. O plano e as falas estão em `docs/HALLOWEEN.md`. Os
testes: `?halloween` liga o evento num save à parte; `?semHalloween` mostra o
jogo sem ele. O `SO=aberto` do `scripts/halloween.mjs` pressupõe a chave
ligada (`true`); os demais usam `?halloween` e continuam valendo.
`BEBITO-MOBILE.md` é o plano do carro do casal e das viagens de carro (o
presente do Renan para o Ari, a ficha e as vagas do carro, e as etapas: o
modelo, a quest, a primeira viagem e as demais rotas), também aberto por um
"COMECE AQUI" e com as perguntas ao Renan da próxima etapa.
**O Bebito Mobile está NO JOGO desde 2026-11-12** (o Renan mandou ligar, para o
Ari já ver no link principal: "coloque o que já temos no jogo mesmo"):
`BEBITO_MOBILE_NO_JOGO = true` em `src/eventos/BebitoMobile.ts`. Antes ele
ficou escondido atrás dessa chave desde 2026-11-11, e as etapas novas continuam
entrando atrás dela, por `bebitoMobileNestaPagina()`. Toda etapa
nova do carro (cena, quest, viagem) fica atrás de `bebitoMobileNestaPagina()`;
`?bebito` usa um save à parte para os testes (e `?bebito&licoes=10` já com as
lições 1 a 10 concluídas, só nesse save), e `?semBebito` força o jogo de antes
do carro (é o que os testes do "escondido" usam). A frente da casa do Ari (`frente-da-casa`: o
jardim, a garagem e a rua de casinhas) e a quest do presente já existem,
no jogo desde 2026-11-12 (a frente da casa já está na segunda versão: casa funda, muro
com hera, portão de correr na garagem e plantas novas), e a VIAGEM DE CARRO
também (`viagem-de-carro`: a estrada até o Villa Lobos, dirigida por quem
joga, com bichos na faixa de pedestres, obra, semáforo, buracos, lombada,
poça, ônibus e corações), com o ESTACIONAMENTO do Villa Lobos do outro
lado da rua do ônibus, onde o carro para (a área de andar do parque só
passa da rua com a chave ligada).
`BEBITO-MOBILE-DENTRO.md` é o plano (e o mapa do que foi feito) da etapa D, parte 1:
o carro POR DENTRO — entrar na garagem pela porta que gira, descansar com os bancos
deitados e a visão do passageiro na viagem com o piloto automático. Está FEITO e NO JOGO
(chave PRÓPRIA `CARRO_POR_DENTRO_NO_JOGO = true`, ligada em 2026-11-12 a pedido do Renan):
`?semCarroPorDentro` desliga para comparar; `?carroPorDentro` liga na marra.
A atualização de câmeras e chegada foi implementada e validada em preview: carinho com os dois
vistos de frente, descanso visto de cima (sob o pergolado, com corte visual do teto)
e a entrada animada pela cancela até a vaga do coração. O documento do interior
abre com os resultados da validação. O site oficial e seu save são
`https://renanmv0.github.io/AriStory/`: testes e fotos só em preview de outra
origem, antes de publicar em `main`.
`ESTACIONAMENTO.md` continua guardando o plano do futuro fiscal e das recompensas.
Só a chegada animada foi autorizada nesta etapa. O piloto automático também
conta para a nota e para os futuros desbloqueios por boa direção (decisão do Renan).
Depois da validação do interior, a prioridade é criar as rotas parque ↔ clube
e clube ↔ escola, antes do fiscal. Não implementar essas próximas etapas junto.
`ESCOLA-PATIO.md` é o plano do PÁTIO DA FRENTE da escola (o prédio de tijolinho por fora, da
foto do Renan, e o pátio), o primeiro passo da rota de carro até a escola: a etapa 1 está pronta
como cena à parte (`?cena=escola-patio`), esperando o Renan olhar, e o ônibus ainda leva direto ao saguão.
`QUINTAL.md` é o plano de DECORAR o quintal da casa do Ari — o decorador da
estufa ensinado a pôr enfeite no chão, no piso, na parede, em cima, pendurado
e de ponta a ponta —, aberto por um "COMECE AQUI" com as decisões do Renan.
A etapa 1 está no jogo, atrás da mesma chave do Bebito Mobile (ligada em
2026-11-12): com a chave, o computador do
quarto abre uma ÁREA DE TRABALHO (`ui/painelDoQuintal.ts`) com a pasta do
laboratório e o **Papita Delivery**, o app que vende as plantas e os móveis
do quintal em reais (`world/decoracoesDoQuintal.ts`); o pedido chega numa
caixa no portão, e se põe no chão pelas ferramentas da garagem
(`eventos/quintal.ts`, a cena `frente-da-casa`). Sem a chave, o computador é
o de sempre.
`MINIGAME-RESTAURANTE.md` e `MINIGAME-JARDIM.md` são planos de minigame — o
turno do Mania de Churrasco e o roguelite da estufa da Josefina. **O do jardim
abre com um "COMECE AQUI" de uma página** (estado, mapa do código, números,
decisões do Renan, o que falta): para trabalhar no jardim, leia só ele e a
skill da tarefa; o resto do arquivo é detalhe por seção. `ESCOLA.md` é o
plano de um cenário inteiro — a escola de cursos com o Gatito, o gato de
pelúcia professor —, também aberto por um "COMECE AQUI", e com as perguntas
ao Renan que ainda estão em aberto. `HALLOWEEN.md` é o plano do especial de
Halloween no Villa Lobos (o presente da Estella, o parque enfeitado, os
convidados fantasiados, a caça de doces ou travessuras e o final), também
aberto por um "COMECE AQUI" e com as perguntas ao Renan. São projeto,
não código: nada deles está no jogo até o `git log` dizer que está, e cada um
marca no próprio texto o que já foi construído. Ajuste do minigame começa no
arquivo dele, não no código.

## Invariantes

- **Nada de asset externo.** Todo modelo é geometria procedural, e todo som é
  sintetizado na hora. Não adicione `.glb`, `.png`, `.mp3`, `.wav`, textura,
  biblioteca de modelo nem de áudio. A única textura permitida é a desenhada em
  tempo de execução num `<canvas>` — o texto das placas, as memórias do quadro,
  as miniaturas do cardápio e o chão do clube (`world/texturasDeChao.ts`).
  **Biblioteca de LÓGICA é outra coisa e pode**: a `chess.js` entrou para as
  regras do xadrez da Estella (nenhum byte de arte ou som vem dela, e escrever
  roque, en passant e peça cravada à mão era bug garantido). Ela é conhecida
  por um arquivo só, `entities/ChessEngine.ts`.
- **Cor sai de `src/palette.ts`; material sai de `toon()`/`flat()`.** Nunca
  instancie material dentro de uma cena.
- **Cena não conhece o motor.** Ela só usa `WorldBuilder` e `GameAPI`.
- **Peça reutilizável vai para o kit** (`world/props.ts`, `world/furniture.ts`),
  não para dentro da cena.
- Parâmetro com cor da paleta precisa de anotação: `cor: number = P.wood`.
- **São sempre dois em cena.** Cutscene que carrega um tem que carregar o outro,
  e diálogo que cita nome usa `g.companionName()` — o jogador troca com `T`.
- **Nada de rato no jogo.** O Ari tem fobia de rato de verdade: nenhum
  rato, camundongo ou ratazana — nem bicho, nem praga, nem fantasia, nem
  enfeite, nem desenho. (Golfinho e barata também não entram, decisão do
  Renan; ver a skill de praga.)
- **Fala escrita pelo Renan vai literal.** Se ele deu o texto de uma interação,
  use exatamente aquele texto.
- **Perna e braço esquerdos nascem em `x` negativo**: `rotation.z` positivo
  neles empurra para DENTRO do corpo, não para fora. Já causou bug real
  quatro vezes (frisbee, sentado, patinação, manga de quimono) — ver a skill
  de roupa para o padrão certo.

## Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/smoke.mjs   /tmp/aristory  # fotos das cenas + erros de console
node scripts/ride.mjs    /tmp/ride      # roda gigante: bilhete, primeira pessoa na cabine e olhar em volta
node scripts/retrato.mjs /tmp/ari       # camera colada no personagem
node scripts/mecanicas.mjs /tmp/mec     # escolha, cena do sofa e frisbee
node scripts/beijo.mjs   /tmp/beijo # o beijo da dupla e os coracoes
node scripts/quiosque.mjs /tmp/q    # de perto: sorveteria, bilheteria e bar
node scripts/frisbee.mjs /tmp/fr    # o passe de volta do parceiro, medido
node scripts/forca.mjs   /tmp/fo    # a barra de forca: mais tempo, mais longe
node scripts/menu.mjs    /tmp/menu  # o menu e o recomecar do zero
node scripts/pausa.mjs   /tmp/pa    # o menu pausa de verdade: no meio da rodada do jardim, relogio, bichos e parceiro param, e voltam de onde pararam
node scripts/audio.mjs             # o som acorda e cada acao dispara o seu efeito
node scripts/musica.mjs  /tmp/som   # rende a musica e os efeitos em .wav para ouvir, e reprova o estalo de uma amostra no comeco de um efeito
node scripts/celular.mjs /tmp/cel   # tela de celular: nenhum botao pode tapar texto
node scripts/joystick.mjs          # o joystick do celular: parar com o dedo encostado e voltar a andar, ate com o Safari cancelando o toque
node scripts/parque.mjs  /tmp/pq    # praca da roda, o canto do tapume e a margem do lago
node scripts/lago.mjs    /tmp/lg    # o lago de cara nova: a margem torta (o Jean-Luc dentro d'agua, trilha e arena fora da areia), a beira inteira sem ponto pisavel fora das tabuas, o relevo do trapiche, os patos nadando (patinhos atras da mae, o mergulho de cabeca, o rastro), a garca (o bote com o bico na agua, voa quando a dupla chega e pousa em outro ponto), os tigres-d'agua (pulam com a dupla perto e voltam ao tronco), quicar pedrinha (carga certa, tibum, segurar F, a vez do outro, o recorde), sentar na ponta com o pe na agua, a moedinha do desejo, o mouse na agua e a placa. SO=agua|beira|patos|garca|tigres|pedrinha|ponta|moeda|clique roda uma parte
node scripts/lojaDePatins.mjs /tmp/lp # a loja de patins nova: nada da loja na altura do corpo fora do colisor, o "Alugar patins" no balcão, as fotos de longe (girando), da fachada e do aluguel, e o peso da vista
node scripts/clareira.mjs /tmp/cl   # a clareira atras do lago: aberta sem mexer no sorteio, a janela da camera, a trilha andavel, a chegada com memoria, entrar na barraca (deitados, o teto sai, o "Agora é só a gente bebito", o beijinho virando de frente um pro outro com os olhos fechando e os coracoes na barraca, abracadinhos, sair), a canga e o fogareiro
node scripts/noite.mjs   /tmp/no    # a noite na clareira: passar a noite (o ceu escurecendo, o varal, a lanterna, os vaga-lumes, os grilos e a musica), sair da clareira volta o dia, e dormir (a barraca fechando com o ziper, a conchinha com o Renan atras, o boa noite, o sono, a aurora e o sol nascendo atras do lago, na tela e sem arvore na frente); CEL=1 roda no celular em pe
node scripts/bebitoBook.mjs /tmp/bb # o Bebito book na barraca: as regras de escrever na linha (sem navegador), os dois de frente, a capa fechada, abrir, folhear, escrever com a letra do Ari e a do Renan (Caveat e Kalam carregadas), a palavra descendo de linha, a data, as teclas do jogo quietas, a linha do outro so de leitura, fechar, a memoria, o save e reabrir na fitinha; CEL=1 no celular
node scripts/acampamento.mjs /tmp/ac # a etapa D na clareira: o fogareiro acendendo (manopla, faisca, chama abafando embaixo da panela, tremor), o cafe coado no coador de pano, as mini arepas virando no budare, o chocolate com marshmallow e o miojo, comidos na canga; o radinho (de dia sem prompt; de noite a antena, a agulha, as notinhas) e a danca lenta (cintura e ombros, o balanco junto, a voltinha); os vaga-lumes no pote (pegar tres, soltar onde quiser, o save, recarregar e eles la) e olhar as estrelas (o coracao no quadro, a estrela cadente, o beijo deitado). SO=cozinha|radinho|vagalumes|estrelas roda uma parte; PRATOS=cafe,miojo escolhe os pratos
node scripts/pingpong.mjs /tmp/pp   # a partida de ping pong ate o quinto ponto
node scripts/chapeu.mjs  /tmp/chp   # ganhar de gorro: o chapeu de campeao vai pro guarda-roupa, e volta sempre que descartado
node scripts/arena.mjs   /tmp/ar    # a arena do ping pong: tablado, clareira sem arvore e as pecas em volta
node scripts/jeanluc.mjs /tmp/jl    # o pato frances: submerso ate as 5 vitorias, emerge, atravessa e fica de vez
node scripts/duelo.mjs   /tmp/dl    # a partida contra o Jean-Luc: o caixote, a raquete dele, e o premio
node scripts/balanco.mjs           # simula partidas contra cada adversario e mede se a dificuldade esta justa
node scripts/quadro.mjs  /tmp/qi    # o quadro: vagas abertas, retratos pintados, o convidado vindo a mesa e o premio de cada um
node scripts/maos.mjs    /tmp/mao   # de maos dadas: emparelhados e o coracao
node scripts/suco.mjs    /tmp/su    # os sucos do clube: cada sabor com o seu dono
node scripts/mochila.mjs /tmp/mo    # as 10 vagas, o slot principal e o F5
node scripts/itens.mjs   /tmp/it    # posse por pessoa, auto-stash, arrastar e poses
node scripts/patins.mjs  /tmp/pat   # patins no corpo, 1,3x de velocidade e o parceiro
node scripts/banco.mjs   /tmp/bn    # sentar nos bancos: de maos dadas e pernas balancando
node scripts/roupas.mjs  /tmp/rp    # guarda-roupa: as vagas sem mexer na animacao
node scripts/vagas.mjs   /tmp/vg    # as 6 vagas (maos e acessorio no pai certo), a bermuda vestida no parque, o banho no clube, a mochila e o armario com 6, e save antigo de 4 vagas
node scripts/vestimenta.mjs /tmp/vt # onde cada roupa pode morar, e o armario por parte
node scripts/rolagemDoArmario.mjs   # vestir, tirar e provar uma peca no meio da lista nao manda a lista pro topo (guarda-roupa, vestiario e arara da Estella, no celular)
node scripts/tinta.mjs   /tmp/ti    # o ateliê de tingimento: toda peça oferecida muda de cor (principal e detalhe), prêmio e uniforme fora, os acessórios (pins, óculos, pulseiras, colar, tiara e as duas mochilas — a do Renan e a de casco —, que são acessórios, escondem o capuz e ficam por fora do moletom), o principal sem mexer no detalhe, por pessoa, os R$ 50 uma vez só, o menu (pintar, detalhes, cor original, vestir, sem pular a rolagem), o F5, o balcão no mezanino com a Estella, e o celular
node scripts/roupasDoJardim.mjs /tmp/rj # a segunda leva da lojinha da Josefina: luvas, pins, pulseiras, vestidos, camisetas e calças largas nos dois (de frente, costas, andando e sentados) e o chapeu joaninha no cabelo do Renan
node scripts/falas.mjs   /tmp/fl    # as falas de premio: cada dono reparando na roupa que ele deu
node scripts/campeao.mjs /tmp/cp    # o premio do campeao: a meta em duas etapas, a festa na mesa de piquenique, a vaquinha e a raquete dourada
node scripts/vestiario.mjs /tmp/vs  # o vestiario do clube: o guarda-roupa com as duas abas, a vitrine de piscina (provar, faltar dinheiro, desbloquear e vestir), o T, o save antigo e o celular
node scripts/modaPraia.mjs /tmp/mp  # as roupas de piscina nos dois: bermudas estampadas, oculos, chinelos, boia, colar, chapeu, touca, tiara e camisas, no clube e no parque
node scripts/quarto.mjs  /tmp/qt    # quarto do Ari: porta nos dois sentidos e o armario
node scripts/memorias.mjs /tmp/me   # o quadro de memorias: pintado, vivo e travando o jogo
node scripts/cardapio.mjs /tmp/cd   # a mesa do restaurante: sentar, pedir, o garcom entregar e comer
node scripts/cama.mjs    /tmp/cm    # deitar junto: lado a lado, e os bracos balancando
node scripts/pelusa.mjs  /tmp/pe    # o gato: passeia sem entrar em movel, mia e recebe carinho
node scripts/casaDoAri.mjs /tmp/ca # o acabamento da casa e do quarto: assoalho, veio nos moveis, sofa de tecido, granito, tapete com franja e capacho, a cama nova na altura antiga, a claridade da janela e os abajures apagando num clique
node scripts/deque.mjs   /tmp/dq    # o deque de descanso: deitar nas espreguicadeiras a beira da piscina
node scripts/muro.mjs    /tmp/mu    # o muro da rua do clube fecha, e o portao grande deixa passar
node scripts/guarita.mjs /tmp/gu    # a portaria: a Gina fica no posto, apita e manda aproveitar o dia
node scripts/salvavidas.mjs /tmp/sv # o Capy salva-vidas: fica na cadeira, varre a piscina e tira o oculos
node scripts/noel.mjs    /tmp/no    # o Noel do bar de sucos: passeia, abre o leque e nao rouba o prompt do balcao
node scripts/jardim.mjs  /tmp/ja    # o jardim organizado e a Josefina: canteiros alinhados, e ela nao pisa na horta
node scripts/mania.mjs   /tmp/mn    # a porta dos fundos e o Mania de Churrasco: cozinha e salao separados
node scripts/garcom.mjs  /tmp/gc    # o cao garcom passeando pelo salao, e a porta de servico sem movel na frente
node scripts/mesas.mjs   /tmp/ms    # sentar em qualquer mesa do Mania, pedir, e o Walter buscar na cozinha
node scripts/onibus.mjs  /tmp/ob    # o onibus e o ponto de perto, nas duas ruas (parque e clube)
node scripts/osso.mjs    /tmp/os    # o osso: cavar no jardim, dar ao Walter e ele convidar pro turno
node scripts/turno.mjs   /tmp/tn    # o turno do Mania: levar a mesa, anotar, servir, receber e a louca (TURNO=2 joga outro turno da escala)
node scripts/escala.mjs  /tmp/el    # a escala do Walter: o menu dos turnos, a trava das 3 estrelas, os petiscos, o premio de cada turno uma vez so, o save antigo e o celular
node scripts/sobremesa.mjs /tmp/sb  # o Mano no turno 2: come, pede a sobremesa na mesma mesa, danca e paga as duas
node scripts/melhorias.mjs /tmp/mh  # as melhorias do Mania: comprar com petiscos na escala, cada efeito medido sem e com (bandeja, tenis, bloquinho, chapa, fila, radio, carrinho), as pecas no salao e a bandeja carregada na mao
node scripts/avental.mjs /tmp/av   # o avental do Mania e acessorio: veste junto com o colete, a camisa e o vestido (abrindo por cima da saia rodada), e o save antigo com ele no tronco muda de vaga
node scripts/turnos34.mjs /tmp/t34 # os turnos 3 e 4 do Mania: o Cookie fechando a mesa do lado (o cartao de reservado) e tomando suco, o prato esfriando com o vapor, o Jean-Luc quente e frio, a Estella reparando no uniforme e o biscoitinho, e os premios (lapis, bloquinho e colete)
node scripts/turnos56.mjs /tmp/t56 # os turnos 5 e 6 do Mania: a mesa grande das tres coelhinhas (tres pedidos, o prato que chega antes esfria esperando as irmas, a conta dos tres), o Flynn torcendo, o Gatito comendo devagar e o six seven, o Pelusa (deita na mesa suja e a vizinha drena em dobro, o psiu, rouba o prato parado e o Walter refaz), a bandana, o dolma e o chapeu de cozinheiro nos dois, e a plaquinha de funcionarios do mes na parede
node scripts/premio.mjs  /tmp/pr    # a carteira do casal (uma so para os dois) e a gravatinha das 3 estrelas
node scripts/mano.mjs    /tmp/pg    # o Mano no quiosque: fica no posto, aparece inteiro, fala, danca e entrega
node scripts/cookie.mjs  /tmp/ck    # o Cookie: patrulha ao lado da cabine, vira nas pontas, e vende o bilhete
node scripts/lojinha.mjs /tmp/lj    # a boutique inteira: as pecas do salao (e as roupas do catalogo nas araras), a ronda da Estella, a escada rolante, o espelho refletindo, a arara vendendo (provar, faltar dinheiro, comprar e ir pro guarda-roupa), e a vitrine de joias e a mesa de chapeus do mezanino vendendo
node scripts/roupasDaBoutique.mjs /tmp/rb # a colecao nova da Estella: as 26 pecas a venda (uma fila cada, preco do andar), o pai certo, a pele da saia e do decote, a saia viva medida vertice a vertice (andando e sentada), e fotos nos dois e no painel
node scripts/xadrez.mjs  /tmp/xa    # o xadrez da Estella: 14 posicoes de regra, 300 partidas de fuzz e o tabuleiro na tela
node scripts/estella.mjs /tmp/es    # a Estella: fica no posto, aparece inteira fora do toldo, da o biscoitinho pros dois e tem o xadrez montado
node scripts/estufa.mjs  /tmp/ef    # a estufa da Josefina: a porta nos dois sentidos, o terreiro vazio e as quatro bocas livres
node scripts/adubo.mjs   /tmp/ad    # a quest que abre a estufa: sementes no banco, o Noel troca por adubo, a Josefina destranca
node scripts/regador.mjs /tmp/rg    # o regador: os 3 estagios, cada melhoria mudando a peca, e pegar-regar-a Josefina chegar
node scripts/pragas.mjs  /tmp/pg    # as treze pragas do jardim: retrato de cada uma, a silhueta dizendo o tier e a dupla do lado para o tamanho
node scripts/jeitos.mjs  /tmp/jt    # o jeito de cada praga na rodada: o pulo, o voo, o portão trocado, a bolinha, a fila, as gotas aspiradas, o tonel bebido, a concha, a esponja, o filhote e o camelo bravo
node scripts/gelo.mjs    /tmp/ge    # a praca de gelo: a arena (a sorveteria do Mano, as mesinhas e as cadeirinhas de coracao), a mesinha servida pelo Mano, o deslize, a patinacao e os riscos que os patins deixam no gelo (descalco nao risca)
node scripts/cartas.mjs            # as cartas do jardim: nenhuma repete em mil rodadas, a curva de nivel e as ondas (sem navegador)
node scripts/gotas.mjs   /tmp/gt    # as gotas no chao e a tela das tres cartas: pisar pega, sobe de nivel, escolhe em dois tempos, e uma mesa de cada raridade no computador e no celular
node scripts/premioDeNivel.mjs /tmp/pn # as telas de prêmio do nível 5 e do 10 com o dedo nervoso (dois "pegar" em cada tela): nenhuma some, e a rodada volta a andar
node scripts/postos.mjs  /tmp/pt    # a Josefina entra junto na estufa, passeia, pede confirmacao e leva o parceiro pro posto de tras
node scripts/chamados.mjs /tmp/ch   # as cartas de chamado: Capy, Gina, Walter e Noel entram pela porta da estufa, falam e ficam no posto
node scripts/rodada.mjs  /tmp/rd    # a rodada do jardim: a onda 1 inteira, o regador atirando sozinho, o tonel, as cartas congelando e o fim com a Josefina
node scripts/retomada.mjs /tmp/rt   # o ponto de retorno: a pagina recarrega no meio da rodada e a Josefina oferece continuar da onda certa, com a mesma ficha, as mesmas cartas no chao e a mesma conta; acabar ou comecar do zero apaga
node scripts/jato.mjs    /tmp/jt    # o jato de cada carta: a vitrine mede o efeito que a carta descreve (poça, gelo, arco, três fios…) e fotografa
node scripts/cartasNaRodada.mjs /tmp/cr # as outras 41 cartas agindo (cada uma numa estufa de laboratorio, efeito medido no mundo e foto), a ajuda do par e o bicho comendo visto pela quina
node scripts/livro.mjs   /tmp/lv    # o livro das cartas na bancada (vagas cinzas, cada carta no seu lugar, a lupa, o F5) e a tela do fim da rodada
node scripts/oclusao.mjs /tmp/oc    # na rodada, a parede que tapa gota ou bicho fica translucida e volta; e a fala esconde o botao da ajuda no celular
node scripts/decorar.mjs /tmp/dc    # a lojinha da Josefina: enfeite em girassol, a banca destrancando pelo recorde, as roupas separadas por parte do corpo, comprar roupa e enfeite, colocar o enfeite no chao (terreiro e patio de fora podem; vao do portao e canteiro nao), o modo de edicao pela lojinha (mexer, girar, guardar), sem colisor na rodada, a visita nova; todo enfeite com retrato, a rodinha girando e as luzinhas acesas
node scripts/enfeite.mjs /tmp/en [id] # um enfeite (ou todos) posto pelo modo de colocar: a pegada medida, o cartao, e fotos de perto dos dois lados
node scripts/marcos.mjs  /tmp/mc    # os premios da estufa: reais e girassois de toda rodada pelos bichos espantados, o premio unico de cada marco resgatado no livro, e a aba de pragas
node scripts/armas.mjs  /tmp/ar    # as ferramentas da estufa: a parede, o painel por ferramenta (meta e cartas de cada uma), destrancar com 15 ondas somadas, a rodada de mangueira (esguicho, mangueira no chao, agua infinita, presa na estufa e as cartas dela) e a de pistola (pistola na mao, tiro de bolinhas, coice, Rajada e Balao d'agua), cada uma com o seu som (jorro e piu), e as cartas so do regador agindo (a espuma na alca, as petalas do Crivo de flor, a Chuveirada, o Transbordou e o Regador gigante crescendo na mao)
node scripts/borrifador.mjs /tmp/bf # o borrifador: destranca pela pistola, o frasco pelo gargalo, o gatilho, o "psst", a nevoa molhando o bando inteiro, e as 14 cartas so dele agindo
node scripts/fantasias.mjs /tmp/fa  # as cinco fantasias da caça do Halloween (abóbora, pirata, gato preto, espantalho, bruxinho) nos dois: cada peça no pai certo, o pé sumindo no calçado, nada abaixo do chão, de frente, costas, lado, andando, sentados e de perto, o rabo, o papagaio e o corvinho mexendo, e o boneco e o filtro 🎃 do guarda-roupa. FANTASIA=pirata roda uma
node scripts/bebitoMobile.mjs /tmp/bm # o Bebito Mobile (docs/BEBITO-MOBILE.md), estacionado pelo atalho ?carro=x,z: o modelo medido (a base, o tamanho, as malhas e os triângulos), a ficha e as vagas (cada encaixe com nome, cada detalhe da ficha no carro, todo id do catálogo com modelo, outra ficha dando outro carro), o save (ficha torta consertada, save antigo com a de fábrica, gravar e recarregar), os comandos (rodas, volante, teto, faróis, freio, pisca, solavanco, penduricalhos), as faces coplanares das caixas de quina redonda, os lugares (a dupla sentada na frente — cabe sob o teto e entre as portas —, sentada no banco de trás, e deitada na cama com os encostos da frente deitados) e as fotos de todos os lados, das janelas de perto, por dentro e sem teto. SO=modelo|ficha|comandos|peso|fotos|coplanar|lugares roda uma parte; SEM_FUNDIR=1 mede antes da junção
node scripts/presente.mjs /tmp/pr  # a quest do presente do Bebito Mobile e a frente da casa do Ari (docs/BEBITO-MOBILE.md), com ?bebito (save de teste): ESCONDIDO (com ?semBebito a porta da casa sai no parque, a cama é a de sempre e o save não ganha flag), o JARDIM (a porta sai no jardim, a garagem vazia, da porta ao portão sem esbarrar, o parque voltando pela calçada, fotos) e a QUEST (dormir depois da lição 10, a pergunta da surpresa, o Renan saindo pela porta da sala, o Ari atrás, a buzina, o carro vindo pela rua com o Renan dirigindo e o laço no teto, a ré para dentro da garagem, a conversa, a memória, o save de verdade intacto, e depois o carro morando na garagem). SO=escondido|jardim|quest roda uma parte; CEL=1 roda no celular em pé
node scripts/viagem.mjs  /tmp/vg    # a viagem de carro do Bebito Mobile (docs/BEBITO-MOBILE.md §6), só com ?bebito: a ROTA (300 rotas sorteadas obedecem as regras: oito eventos, as duas travessias nunca seguidas, os vãos, os corações na faixa livre, a curva mansa, a semente), a PARTIDA (o "Sair de carro" na garagem, "Quem dirige dessa vez?" e quem foi escolhido ao volante nos dois casos), a viagem INTEIRA com o piloto de teste (parar para os bichos e no sinal, desviar da obra e dos buracos, a lombada devagar, ultrapassar o ônibus, três estrelas, a memória, e o carro estacionado na rua do ônibus do parque), o DISTRAÍDO (sem frear, o carro para sozinho antes da faixa e ninguém é atropelado), o MANCHE de verdade (virar, frear, acelerar, buzinar), a VOLTA (o portão vira lembrete, o carro leva para casa e volta à garagem), o ESTACIONAMENTO (escondido sem a chave; com ela o lote do outro lado da rua, o carro na vaga do coração, o caminho a pé da vaga ao portão do parque sem nada no meio, a cerca viva fechando o lote, a cancela subindo, fotos e o peso) e as fotos de PERTO dos bichos e das peças. SO=rota|partida|bom|distraido|manche|volta|estacionamento|perto roda uma parte; CEL=1 no celular em pé; SEMENTE=7 escolhe a rota
node scripts/quintal.mjs /tmp/qt    # o quintal decorado, etapa 1 (docs/QUINTAL.md), com ?bebito (save de teste): ESCONDIDO (com ?semBebito, o computador de sempre), o COMPUTADOR (a área de trabalho, o Papita Delivery com as duas prateleiras e o retrato de cada peça, pedir paga da carteira e vai para o correio, sem dinheiro não compra, a pasta do laboratório levando ao laboratório), a ENCOMENDA (a caixa no portão, abrir põe no baú), COLOCAR (as ferramentas da garagem, as regras do quintal, as 14 peças e o fundo da garagem, a pegada e a altura medidas, o peso, a mesma imagem com e sem ?semFundir), ARRUMAR (recarregar, o modo de edição, guardar, a estufa sem nada do quintal) e o CHÃO da etapa 2 (num save limpo: a prateleira Chão, o caminho que se pede uma vez, a árvore virando peça, os cinco caminhos com foto, tirar e pôr a hera, a árvore em outro canto, os pisos com a mesinha e a hortênsia em cima e o último por cima, recarregar) e o SAVE (sem cena é estufa, o a caminho sobrevive). SO=escondido|computador|encomenda|colocar|arrumar|chao|alto|moveis|brincar|save roda uma parte (brincar: a piscininha e o fogo de chão — postos, as duas peças fundidas mesmo mexendo, o fogo tremendo e o patinho passeando, apagar e acender o fogo, sentados em volta, o pé na água com as marolinhas, e levantar; moveis: a etapa 4 — o balanço, a rede, a mesinha, a espreguiçadeira e a casinha no quintal, sentar à mesinha e deitar na rede com a pergunta de ficar e o levantar, o balanço embalando, o Pelusa na casinha com o carinho, e o regador regando a hortênsia; alto: a etapa 3 — a prateleira No alto, a parede com a porta recusada e o ▲ subindo, a treliça alta demais para o muro, as 11 de parede, em cima e pendurado, as três de ponta a ponta com o X desfazendo a primeira ponta, fotos, o peso, recarregar, o sino balançando e o Mexer no chão) (computador→encomenda→colocar→arrumar em fila); CEL=1 no celular em pé
node scripts/carroPorDentro.mjs /tmp/cd # o carro por dentro (docs/BEBITO-MOBILE-DENTRO.md), com ?bebito&carroPorDentro: ESCONDIDO (sem a chave a porta da garagem e "Sair de carro"), ENTRAR (a porta gira, quem joga senta e a camera chega aos olhos dele, a cabeca some, o menu), DESCANSAR (os encostos deitam, os dois deitados olhando o teto fechado, a conversa, a memoria, o cochilo com ronco) e DESCER (tudo desfeito: pose, cabeca, porta, encostos, camera, fora dos colisores), PASSAGEIRO (o 👀, o piloto automatico, a troca de banco, o menu de cada um, encostar no ombro, o celular) e PILOTO (a viagem inteira sozinho, sem tropeco nem susto, e a chegada). SO=escondido|entrar|descansar|descer|passageiro|piloto roda uma parte; CEL=1 no celular em pe
node scripts/nuvens.mjs /tmp/nv      # as nuvens da frente da casa do Ari nunca entram no quadro da isometrica (8 giros, zoom fechado e aberto, varios pontos do jardim e da rua) e as fotos dos 8 giros; CEL=1 no celular em pe
node scripts/patio.mjs  /tmp/pt      # o patio da frente da Escola do Gatito (docs/ESCOLA-PATIO.md, ?cena=escola-patio): o caminho livre da rua ate a porta e do portao, pela faixa, ate o estacionamento, o predio, o portao, a grade e a guarita na altura do corpo dentro dos colisores, a cancela abrindo, a porta levando ao saguao, as tres bandeiras balancando, os 8 giros, o cartao-postal, o portal e o alto, e o peso; CEL=1 no celular em pe
node scripts/zfighting.mjs         # caca faces coplanares nas pecas do kit (o que serrilha); SO=armario,estante roda so essas (peca de evento, como o carrinho-de-pocoes, abre a cena na fase dela); SEM_FUNDIR=1 mede antes da juncao (depois dela nao sobra caixa para medir)
node scripts/matriz.mjs  /tmp/mt    # a matriz so e refeita quando mexe: compara com o calculo do zero, andando
node scripts/escola.mjs  /tmp/es    # a Escola do Gatito: as seis cenas, as portas nos dois sentidos, a cara do Gatito medida, o six seven e o arremesso
node scripts/lanche.mjs  /tmp/la    # a maquina de lanches da escola: pagar, o lanche cair na gaveta, pegar pra mochila e comer; e sentar a mesa do refeitorio de frente um pro outro
node scripts/luna.mjs    /tmp/lu    # a Luna e a porta da escola: some antes do quadro encher, aparece no piquenique, torce e fica timida, o onibus passa a ir pra escola, o tour da chegada e o treino no ginasio
node scripts/apostila.mjs          # as licoes da apostila do Gatito e as regras (nota, trava, digitado, livro), sem navegador
node scripts/modulo3.mjs /tmp/m3    # o Modulo 3 da apostila (licoes 13 a 18): a aula da 13, as seis licoes folheadas no computador e no celular, o sumario com os outros dois modulos e o fim do livro. SO=aula|livro|fim|celular roda uma parte
node scripts/modulo2.mjs /tmp/m2    # o Modulo 2 da apostila: o ginasio chama a licao 7 depois do Modulo 1, o Gatito abre o livro do 2, as seis licoes folheadas (sem vazar, no computador e no celular), trocar de apostila pelo sumario e o fim de cada livro
node scripts/paginas.mjs /tmp/pag   # o livro flexivel: licao com quantas paginas de explicacao e de exercicio o tema pedir, e a pagina de anotacoes quando da impar
node scripts/anotacoes.mjs /tmp/an  # a pagina de anotacoes da licao 15: escrever (as teclas do jogo quietas), o texto ficar ao virar, fechar, reabrir e recarregar, o limite de tamanho, o save antigo e o celular
node scripts/irmas.mjs   /tmp/ir    # a Luna, a Sol e a Estrella: as três no piquenique, quem treina no ginasio antes de cada aula, o salto da Sol, a estrelinha da Estrella e as tres sentadas na Sala 1
node scripts/uniforme.mjs /tmp/un   # o uniforme dos Gatitos: as sete pecas nos dois (frente, costas, andando, sentados e de perto), o tenis no lugar do pe, o boneco do painel, o Gatito entregando no fim da licao 3, o save antigo, e o vestiario do ginasio (a aba dos uniformes: trancada, vestir e tirar num clique, no computador e no celular)
node scripts/aula.mjs    /tmp/au    # a aula inteira: a Luna chama no ginasio, o Gatito na mesa da Sala 1, a apostila respondida pela tela (com erro de proposito), o fim da aula, e o livro no celular
node scripts/flynn.mjs   /tmp/fl    # o Flynn no refeitorio: o passeio entre as mesas (o ponto de conversa e o colisor junto), os pes no chao, a altura, os acessorios, o aceno e a comemoracao medidos, a apresentacao com o apito e a memoria, e fotos de perto de todos os lados
node scripts/valentina.mjs /tmp/va  # a Valentina, flamingo do marketing: o modelo (pés no chão, cada peça do look no pai certo, num pé só, posar, examinar, encantar, fotos de perto), trocar de look, o desfile no canto do saguão, a conversa com o juízo da roupa de verdade (nada, Gatitos, peça pelo nome) e a trava do Módulo 3 com ela sentada na Sala 1. SO=modelo|look|passeio|conversa|aula|rosto roda uma parte
node scripts/tiaLiz.mjs /tmp/tl    # a Tia Liz, a ursa venezuelana da cantina da escola: o modelo (pés no chão, a concha, a trança e as molinhas, os gestos de mexer, servir, mãos na cintura e acenar, fotos de perto), o posto na cozinha da Lanchonete dos Gatitos, atrás da janela de servir (a concha dentro do caldeirão, ninguém entra na cozinha), os cinco pratos (sopita, pasta, pabellón, fororo, tres leches), a conversa (ela larga o que fazia e ACENA, apresentação, cardápio, ela preparando, as duas bandejas com o prato montado, sentar e comer, os cinco provados e o "Agora não"), a COZINHA VIVA (a rotina alternando fogão com o fogo aceso e a frigideira sacudida, tábua picando rodela por rodela, caldeirão e passeio) e os PREPAROS (a coreografia de cada prato, uma foto por passo, os dois pratos montados na bandeja e a cozinha de volta ao lugar). SO=modelo|posto|pratos|conversa|cozinha|preparos roda uma parte; PRATOS=sopita,pasta escolhe os preparos
node scripts/treino.mjs  /tmp/tr    # o Flynn no ginasio do Modulo 2 em diante: sai do refeitorio, corre de ponta a ponta mais rapido que a dupla, pega a bola, arremessa e ela volta pro lugar, espera a dupla sair da raia, conversa e volta a treinar; as coelhinhas na lateral
node scripts/laboratorio.mjs /tmp/lab # o mundo dentro do computador do Ari: entrar pela tela do quarto (sugados), a chegada no pouso, os dez filtros de tela (passes conferidos), o mouse no cristal (dica e som), arrastar a bola, clicar na agua, o presente, o arame, o holofote, o dia passando, o drone e sair pelo portal de volta pra frente da escrivaninha
node scripts/festa.mjs   /tmp/fe    # a festa da torcida no fim do modulo: o convite na licao 6, a danca medida (o salto da Sol, as duas estrelinhas da Estrella, o giro da Luna, o confete), as tres cabendo no celular, a roupa de cheerleader nos dois (frente, costas, andando, sentados e de perto) e no vestiario  (SO=danca, SO=roupa… roda uma parte)
node scripts/halloween.mjs /tmp/hw   # o especial de Halloween (docs/HALLOWEEN.md), só com ?halloween: o filme de terror no sofá, a carta da Estella deslizando por baixo da porta, pegar e ler, a fase do evento; o parque no pôr do sol enfeitado e vazio (abóboras, varais, fantasminhas, lápides, o Nessie passeando, quem foi se arrumar e as plaquinhas de recado, os comentários da dupla uma vez só, e o clube, o Mania, a estufa, a escola e o quarto sem ninguém); a boutique (os dois andares enfeitados, as bexigas de caveira, a Estella de aranha, o Pelusa morceguinho dormindo no pufe, a cena do presente — as caixas, o provador, os dois saindo de vampiro e de morceguinho, a cestinha e o mapinha, a loja quieta até o fim e a Estella voltando para a ronda — e o mapinha lido pela mão); e a VOLTA (com ?semHalloween, a casa, o parque, o clube, a escola, a estufa, o Mania, o quarto e a boutique com as mesmas malhas de antes do evento); e a NOITE da festa (o céu, as abóboras, lanternas e luzinhas acesas, a chama tremendo, os morcegos voando na roda, o Nessie e os postes, e as fantasias do parque: o Mano de vampiro e a fala dele, o Cookie de lençol, o Jean-Luc da ópera e os patos de diabinho); e as FANTASIAS de quem veio do clube e da escola, no parque (a Gina noiva, o Capy tubarão, o Noel cientista, a Josefina dragãozinho, o Gatito de Walter, o Flynn lobisomem, a Luna coruja, a Sol catrina e a Estrella fadinha); e os POSTOS da festa (a Gina no ponto, o Capy e a bacia de maçãs, o Noel e o carrinho de poções, a Josefina e o canteiro de abóboras, o Gatito no piquenique, o Flynn no campinho, a Estella na boutique e os desafios suspensos; a barraquinha de cachorro-quente do Walter aberta, com as salsichas rolando e o recado dele, e fechada no convite; as bolhas, o vapor, a gota e as maçãs mexendo; e a CONVERSA COM ZOOM de cada um: a câmera de perto, ele no meio do quadro virado para ela, a dupla de lado, a fala da fantasia e a isométrica de volta), e o clube, o Mania, a estufa e a escola vazios na festa; o WALTER na barraquinha (no caixote, o "volto já" quando ele sai para trás da roda, e a conversa dele); e a CHEGADA DO ÔNIBUS (o ônibus detalhado no lugar do de sempre, a dupla na boutique, a buzina, o voo da câmera por cima do parque, o ônibus freando com as rodas girando, a porta e o pisca, cada um descendo e falando no jeito da fantasia, todos nos postos no fim, a memória, e não repete).; e a CAÇA de doces ou travessuras (as dez paradas com o doce e a travessura — a agulha da hora certa e a pergunta —, as balas na cesta do canto, a pista indo para o mapinha, quem chega cedo, a abóbora acesa em cima da próxima parada, a pista do final com a conta da porta, e as abóboras escondidas que somem de vez). ; e a CASINHA DA ABÓBORA (a 6a: o portão laranja na ponta do tapume — trancado, a conta da porta, a fechadura acendendo e o Walter sumindo por ele —, a clareira com a abóbora gigante e a casinha torta, o comentário e voltar pro parque; e a 6b por dentro: a porta abrindo sozinha, os olhos dos quadros seguindo, o BONG do relógio, os morceguinhos balançando, a porta que range, o susto do fantasminha de mola, sair e entrar de novo; e a 6c, o SALÃO por dentro da abóbora: a porta grande abrindo, o salão escuro com os catorze lá dentro e fantasiados, a surpresa — "Tem alguém aí?", a porta fechando, as luzes acendendo, o "SURPRESA!" com o confete e a Estella explicando —, a memória, a festa com cada um dançando a sua (medida), a conversa de festa com zoom, o Walter vindo servir o doce e os dois comendo ali, voltar pra cozinha e entrar de novo sem a surpresa; e a 6d: o palquinho, a Estella perguntando a hora do concurso ("Daqui a pouco" não começa), as treze plaquinhas de voto, a coroação no palco com a fala reparando na fantasia, a coroa de rainha no Ari e a de rei no Renan e as duas no guarda-roupa, a foto de todos com o "Xiiis!" e o flash, a memória, a fase depois, e o parque depois: de noite, enfeitado e vazio, a barraquinha fechada e o portão aberto). ; e a NOITE DE SONO, a etapa 7 (a casa e o quarto de madrugada, o "Dormir depois da festa" na cama, deitados fantasiados e coroados, o abajur apagando, o sono, a fase fim, a manhã com a roupa de antes e as fantasias e as coroas no guarda-roupa, o Pelusa de volta, a memória "O dia seguinte", e no fim cada cena com as mesmas malhas de antes do evento). ; e o evento ABERTO no link de sempre (o aviso do sofá uma vez, o filme no sofá e o save de verdade com a marca da edição); e a VOLTA medida com ?semHalloween. SO=aberto|filme|parque|boutique|noite|fantasias|festa|onibus|caca|casinha|dormir|volta roda uma parte
```

Mudança visual **precisa** de foto olhada antes de ser dada como pronta, e
mudança de som precisa do `.wav` ouvido. O Chromium já está instalado; não rode
`playwright install`.

## Git e publicação

`main` publica sozinho no GitHub Pages a cada push
(`.github/workflows/deploy.yml`). Termine o pedaço na branch de
desenvolvimento da tarefa, valide, e **funda para `main`** — sem isso a
mudança nunca aparece pro Renan, mesmo commitada. `ci.yml` roda
typecheck+build em toda branch; o deploy real só dispara em `main`.

## Trabalhando junto

Este jogo está sendo construído aos poucos, de propósito. Ao terminar um pedaço,
diga o que dá para fazer em seguida e deixe a escolha com o Renan — não emende
três cenários de uma vez. Quando faltar informação sobre uma pessoa ou um lugar
real (como alguém é, como é a casa), **pergunte** em vez de inventar: o valor
deste projeto está em ser parecido com a vida real deles.
