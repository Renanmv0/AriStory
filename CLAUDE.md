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
| pintar uma memória para o quadro (a partir de uma foto) | `.claude/skills/aristory-memoria/SKILL.md` |
| adicionar/ajustar roupa do guarda-roupa | `.claude/skills/aristory-roupa/SKILL.md` |
| pôr um prato novo no cardápio do restaurante | `.claude/skills/aristory-prato/SKILL.md` |
| som, música ou efeito sonoro | `.claude/skills/aristory-som/SKILL.md` |
| rodar, ver e validar | `.claude/skills/aristory-testar/SKILL.md` |

Elas existem para você **não precisar varrer o código** a cada tarefa. Comece
por elas.

Fora do código, tem mais três documentos em `docs/`: `PERSONAGENS.md` diz
como o Ari e o Renan são de verdade (cabelo, roupa de referência, os NPCs já
mencionados mas nunca modelados) — leia antes de perguntar ao Renan algo que
já está respondido ali. `ARQUITETURA.md` é o motor por dentro.
`CONTEXTO-INTEGRAL.md` e `ROADMAP.md` são um retrato do projeto e do que
falta — **úteis para se situar rápido, mas podem estar desatualizados**; o
`git log` é a fonte da verdade para o que mudou por último.

## Invariantes

- **Nada de asset externo.** Todo modelo é geometria procedural, e todo som é
  sintetizado na hora. Não adicione `.glb`, `.png`, `.mp3`, `.wav`, textura,
  biblioteca de modelo nem de áudio. A única textura permitida é a desenhada em
  tempo de execução num `<canvas>` — o texto das placas, as memórias do quadro,
  as miniaturas do cardápio e o chão do clube (`world/texturasDeChao.ts`).
- **Cor sai de `src/palette.ts`; material sai de `toon()`/`flat()`.** Nunca
  instancie material dentro de uma cena.
- **Cena não conhece o motor.** Ela só usa `WorldBuilder` e `GameAPI`.
- **Peça reutilizável vai para o kit** (`world/props.ts`, `world/furniture.ts`),
  não para dentro da cena.
- Parâmetro com cor da paleta precisa de anotação: `cor: number = P.wood`.
- **São sempre dois em cena.** Cutscene que carrega um tem que carregar o outro,
  e diálogo que cita nome usa `g.companionName()` — o jogador troca com `T`.
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
node scripts/ride.mjs    /tmp/ride      # cutscene da roda gigante ponta a ponta
node scripts/retrato.mjs /tmp/ari       # camera colada no personagem
node scripts/mecanicas.mjs /tmp/mec     # escolha, cena do sofa e frisbee
node scripts/beijo.mjs   /tmp/beijo # o beijo da dupla e os coracoes
node scripts/quiosque.mjs /tmp/q    # de perto: sorveteria, bilheteria e bar
node scripts/frisbee.mjs /tmp/fr    # o passe de volta do parceiro, medido
node scripts/forca.mjs   /tmp/fo    # a barra de forca: mais tempo, mais longe
node scripts/menu.mjs    /tmp/menu  # o menu e o recomecar do zero
node scripts/audio.mjs             # o som acorda e cada acao dispara o seu efeito
node scripts/musica.mjs  /tmp/som   # rende a musica e os efeitos em .wav para ouvir
node scripts/celular.mjs /tmp/cel   # tela de celular: nenhum botao pode tapar texto
node scripts/parque.mjs  /tmp/pq    # praca da roda, cupula e margem do lago
node scripts/pingpong.mjs /tmp/pp   # a partida de ping pong ate o quinto ponto
node scripts/maos.mjs    /tmp/mao   # de maos dadas: emparelhados e o coracao
node scripts/suco.mjs    /tmp/su    # os sucos do clube: cada sabor com o seu dono
node scripts/mochila.mjs /tmp/mo    # as 10 vagas, o slot principal e o F5
node scripts/itens.mjs   /tmp/it    # posse por pessoa, auto-stash, arrastar e poses
node scripts/patins.mjs  /tmp/pat   # patins no corpo, 1,3x de velocidade e o parceiro
node scripts/banco.mjs   /tmp/bn    # sentar nos bancos: de maos dadas e pernas balancando
node scripts/roupas.mjs  /tmp/rp    # guarda-roupa: 4 slots sem mexer na animacao
node scripts/vestimenta.mjs /tmp/vt # onde cada roupa pode morar, e o armario por parte
node scripts/vestiario.mjs /tmp/vs  # o vestiario do clube: oculos, cor da bermuda e um estilo por pessoa
node scripts/quarto.mjs  /tmp/qt    # quarto do Ari: porta nos dois sentidos e o armario
node scripts/memorias.mjs /tmp/me   # o quadro de memorias: pintado, vivo e travando o jogo
node scripts/cardapio.mjs /tmp/cd   # a mesa do restaurante: sentar, pedir, o garcom entregar e comer
node scripts/cama.mjs    /tmp/cm    # deitar junto: lado a lado, e os bracos balancando
node scripts/pelusa.mjs  /tmp/pe    # o gato: passeia sem entrar em movel, mia e recebe carinho
node scripts/deque.mjs   /tmp/dq    # o deque de descanso: deitar nas espreguicadeiras a beira da piscina
node scripts/muro.mjs    /tmp/mu    # o muro da rua do clube fecha, e o portao grande deixa passar
node scripts/guarita.mjs /tmp/gu    # a portaria: a girafa fica no posto, apita e manda aproveitar o dia
node scripts/mania.mjs   /tmp/mn    # a porta dos fundos e o Mania de Churrasco: cozinha e salao separados
node scripts/garcom.mjs  /tmp/gc    # o cao garcom passeando pelo salao, e a porta de servico sem movel na frente
node scripts/onibus.mjs  /tmp/ob    # o onibus e o ponto de perto, nas duas ruas (parque e clube)
node scripts/zfighting.mjs         # caca faces coplanares nas pecas do kit (o que serrilha)
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
