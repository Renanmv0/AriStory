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
| adicionar/ajustar roupa do guarda-roupa | `.claude/skills/aristory-roupa/SKILL.md` |
| criar/ajustar um enfeite (decoração) da lojinha da estufa | `.claude/skills/aristory-enfeite/SKILL.md` |
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
`MINIGAME-RESTAURANTE.md` e `MINIGAME-JARDIM.md` são planos de minigame — o
turno do Mania de Churrasco e o roguelite da estufa da Josefina. **O do jardim
abre com um "COMECE AQUI" de uma página** (estado, mapa do código, números,
decisões do Renan, o que falta): para trabalhar no jardim, leia só ele e a
skill da tarefa; o resto do arquivo é detalhe por seção. São projeto,
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
node scripts/parque.mjs  /tmp/pq    # praca da roda, cupula e margem do lago
node scripts/pingpong.mjs /tmp/pp   # a partida de ping pong ate o quinto ponto
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
node scripts/turno.mjs   /tmp/tn    # o turno do Mania: levar a mesa, anotar, servir, receber e a louca
node scripts/premio.mjs  /tmp/pr    # a carteira do casal (uma so para os dois) e a gravatinha das 3 estrelas
node scripts/mano.mjs    /tmp/pg    # o Mano no quiosque: fica no posto, aparece inteiro, fala, danca e entrega
node scripts/cookie.mjs  /tmp/ck    # o Cookie: patrulha ao lado da cabine, vira nas pontas, e vende o bilhete
node scripts/lojinha.mjs /tmp/lj    # a boutique inteira: a ronda da Estella, a escada rolante, o espelho refletindo, e a arara vendendo (provar, faltar dinheiro, comprar e ir pro guarda-roupa)
node scripts/xadrez.mjs  /tmp/xa    # o xadrez da Estella: 14 posicoes de regra, 300 partidas de fuzz e o tabuleiro na tela
node scripts/estella.mjs /tmp/es    # a Estella: fica no posto, aparece inteira fora do toldo, da o biscoitinho pros dois e tem o xadrez montado
node scripts/estufa.mjs  /tmp/ef    # a estufa da Josefina: a porta nos dois sentidos, o terreiro vazio e as quatro bocas livres
node scripts/adubo.mjs   /tmp/ad    # a quest que abre a estufa: sementes no banco, o Noel troca por adubo, a Josefina destranca
node scripts/regador.mjs /tmp/rg    # o regador: os 3 estagios, cada melhoria mudando a peca, e pegar-regar-a Josefina chegar
node scripts/pragas.mjs  /tmp/pg    # as treze pragas do jardim: retrato de cada uma, a silhueta dizendo o tier e a dupla do lado para o tamanho
node scripts/jeitos.mjs  /tmp/jt    # o jeito de cada praga na rodada: o pulo, o voo, o portão trocado, a bolinha, a fila, as gotas aspiradas, o tonel bebido, a concha, a esponja, o filhote e o camelo bravo
node scripts/gelo.mjs    /tmp/ge    # a praca de gelo: a arena, a mesinha servida pelo Mano, o deslize e a patinacao
node scripts/cartas.mjs            # as cartas do jardim: nenhuma repete em mil rodadas, a curva de nivel e as ondas (sem navegador)
node scripts/gotas.mjs   /tmp/gt    # as gotas no chao e a tela das tres cartas: pisar pega, sobe de nivel, escolhe em dois tempos, e uma mesa de cada raridade no computador e no celular
node scripts/postos.mjs  /tmp/pt    # a Josefina entra junto na estufa, passeia, pede confirmacao e leva o parceiro pro posto de tras
node scripts/chamados.mjs /tmp/ch   # as cartas de chamado: Capy, Gina, Walter e Noel entram pela porta da estufa, falam e ficam no posto
node scripts/rodada.mjs  /tmp/rd    # a rodada do jardim: a onda 1 inteira, o regador atirando sozinho, o tonel, as cartas congelando e o fim com a Josefina
node scripts/jato.mjs    /tmp/jt    # o jato de cada carta: a vitrine mede o efeito que a carta descreve (poça, gelo, arco, três fios…) e fotografa
node scripts/cartasNaRodada.mjs /tmp/cr # as outras 41 cartas agindo (cada uma numa estufa de laboratorio, efeito medido no mundo e foto), a ajuda do par e o bicho comendo visto pela quina
node scripts/livro.mjs   /tmp/lv    # o livro das cartas na bancada (vagas cinzas, cada carta no seu lugar, a lupa, o F5) e a tela do fim da rodada
node scripts/oclusao.mjs /tmp/oc    # na rodada, a parede que tapa gota ou bicho fica translucida e volta; e a fala esconde o botao da ajuda no celular
node scripts/decorar.mjs /tmp/dc    # a lojinha da Josefina: enfeite em girassol, a banca destrancando pelo recorde, as roupas separadas por parte do corpo, comprar roupa e enfeite, colocar o enfeite no chao (terreiro e patio de fora podem; vao do portao e canteiro nao), o modo de edicao pela lojinha (mexer, girar, guardar), sem colisor na rodada, a visita nova; todo enfeite com retrato, a rodinha girando e as luzinhas acesas
node scripts/enfeite.mjs /tmp/en [id] # um enfeite (ou todos) posto pelo modo de colocar: a pegada medida, o cartao, e fotos de perto dos dois lados
node scripts/marcos.mjs  /tmp/mc    # os premios da estufa: reais e girassois de toda rodada pelos bichos espantados, o premio unico de cada marco resgatado no livro, e a aba de pragas
node scripts/armas.mjs  /tmp/ar    # as ferramentas da estufa: a parede, o painel por ferramenta (meta e cartas de cada uma), destrancar com 15 ondas somadas, a rodada de mangueira (esguicho, mangueira no chao, agua infinita, presa na estufa e as cartas dela) e a de pistola (pistola na mao, tiro de bolinhas, coice, Rajada e Balao d'agua), cada uma com o seu som (jorro e piu), e as cartas so do regador agindo (a espuma na alca, as petalas do Crivo de flor, a Chuveirada, o Transbordou e o Regador gigante crescendo na mao)
node scripts/borrifador.mjs /tmp/bf # o borrifador: destranca pela pistola, o frasco pelo gargalo, o gatilho, o "psst", a nevoa molhando o bando inteiro, e as 14 cartas so dele agindo
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
