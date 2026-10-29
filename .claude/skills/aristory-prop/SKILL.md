---
name: aristory-prop
description: Adicionar uma peça nova ao kit de cenário do AriStory — árvore, banco, poste, móvel, veículo, brinquedo. Use quando faltar um objeto para montar uma cena, ou quando pedirem "cria um X" (bicicleta, churrasqueira, pedalinho, guarda-sol…).
---

# Criar uma peça nova para o kit

> **Junto desta skill, carregue as `threejs-*` da tabela "REGRA DE TODA
> TAREFA" do `CLAUDE.md`** (`geometry`, `textures`, e `lighting` se a peça acende). Elas são a técnica; esta é a regra do
> jogo. Peça feita só de caixa lisa é o jeito antigo.
>
> E bonito **e leve**: na cena, passe a peça por `fundir()` (`world/fundir.ts`)
> depois do acabamento — `w.add(fundir(acabar(w.place(peca(), …), …)))` — e
> use `InstancedMesh` no que se repete. Sem perder nenhum detalhe. Ver
> "Qualidade é bonito E leve" no `CLAUDE.md`.
>
> Para a `fundir` saber o que NÃO juntar: dê NOME ao grupo que se mexe
> (`dobradica`, `tambor`) e à malha que a cena procura ou troca (`tela`,
> `cupula`), e ponha em `userData` o que um teste mede (`livro`). Malha
> transparente e decalque ficam de fora sozinhos.

Duas caixas de peças:

- `src/world/props.ts` — externo: natureza, parque, rua, praia.
- `src/world/furniture.ts` — interno: móveis, eletrodomésticos, decoração.

Peça grande e animada ganha arquivo próprio (ver `src/world/ferrisWheel.ts`).

## Contrato

Toda peça é uma função que devolve um `THREE.Group` com **a base em `y = 0`**,
**olhando para `+Z`**, centrada em `x = 0, z = 0`. Quem posiciona é a cena, com
`w.place()`. A função nunca adiciona nada ao mundo e nunca cria colisor.

```ts
export function guardaSol(cor: number = P.fabricRed): THREE.Group {
  const g = new THREE.Group();

  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), toon(P.wood));
  haste.position.y = 1.1;
  g.add(haste);

  const lona = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.5, 12), toon(cor));
  lona.position.y = 2.2;
  g.add(lona);

  return g;
}
```

## Regras

1. **`toon(cor)` e `flat(cor)`** de `src/core/materials.ts`. Materiais são
   cacheados por cor — criar material solto estoura a memória e quebra o estilo.
2. **Cores da paleta** (`src/palette.ts`). Falta uma? Adicione lá, com nome.
3. **Parâmetro de cor com anotação explícita**: `cor: number = P.wood`. Sem o
   `: number` o TypeScript infere o literal da paleta e a função só aceita
   aquela cor exata.
4. **Poucos polígonos.** `SphereGeometry(r, 10, 8)`, `CylinderGeometry(…, 8)`,
   `IcosahedronGeometry(r, 1)`. O jogo roda em celular.
5. **Estilo fofo**: cantos arredondados (cápsula e esfera antes de caixa),
   proporções exageradas, poucos detalhes e bem legíveis de longe.
6. **Nada de arquivo externo** — o repositório é 100% procedural. A única
   textura permitida é a desenhada em tempo de execução num `<canvas>`, como
   em `textSign()`: continua sendo código, nenhum `.png` entra no repositório.
   **Mas placa de poste com o nome do lugar NÃO entra**: o Renan tirou todas
   ("Pista de gelo", "Frisbee!", "Clube!", "Piscina", e antes a "Sucos") por
   redundantes — o lugar bem feito já diz o que é. Texto legível mora na peça
   (o letreiro do quiosque, o painel do ônibus); placa só quando ela mesma é a
   graça (a "Proibido nadar" do lago, que tem conversa).
7. Escala: uma pessoa tem 1,75 unidade. Banco 0,48 de assento, porta 2,1 de altura.

## Peça com balcão

Quiosque, banca, bar: a câmera olha de cima em 34°, então **toldo ou telhado
avançado passa na frente do que está no balcão e esconde tudo**. A regra que
funcionou no `kiosk()`: o toldo para *antes* da metade da frente do balcão, e a
vitrine (as cubas de sorvete, as jarras de suco) fica na borda da frente, do
lado de fora da sombra do toldo. Depois de mexer, confira com
`node scripts/quiosque.mjs /tmp/q`.

Vidro fechado por cima de comida é armadilha: some no toon shading e ainda
tapa o que está dentro. Cuba aberta lê muito melhor de longe.

## Z-fighting: nunca encoste face com face

Duas superfícies opacas no MESMO plano, com área em comum, brigam pelo mesmo
pixel: a GPU não tem como desempatar e a peça serrilha e pisca conforme a
câmera gira. É o defeito visual mais comum do kit, e ele **não aparece de
longe** — só com a câmera colada.

O par perigoso é o que aponta para o MESMO lado (as duas faces `min`, ou as
duas `max`). Face contra face oposta — uma caixa terminando onde a outra
começa — é empilhamento normal e não serrilha.

A correção é sempre a mesma família: **sobrepor de leve em vez de encostar.**

- peça de dentro (detalhe, letreiro, listra): avance ou recue 1–2 cm da face
  que ela decora;
- peça em cima (laje, tampo): desça um pouco para dentro do que ela cobre;
- peças com a mesma dimensão (moldura e parede, degrau e apoio): dê 4–5 cm de
  diferença, para fora ou para dentro, em vez de casar o número.

Já mordeu em: livros na estante, listras do quadro de preços do quiosque,
moldura de madeira contra a parede do quiosque, laje contra o topo da parede,
degrau contra apoio na arquibancada, e fundo contra laterais da estante.

**`node scripts/zfighting.mjs` acha isso sozinho.** Ele mede as caixas de cada
peça etiquetada (`g.userData.peca = 'nome'`) em espaço local e lista os pares
coplanares com a área compartilhada. Etiquete a peça nova e rode: é mais
barato que caçar na foto.

Decalque de chão é o caso em que coplanar é o mecanismo, e não o bug — ali o
`polygonOffset` do `WorldBuilder` resolve, e o detector ignora quem o tem.

## Peça amassada (pedra, terreno)

Geometria de sólido do three (`DodecahedronGeometry` e companhia) **não é
indexada**: cada triângulo tem os próprios vértices. Amassar vértice por
**índice** rasga os cantos que deviam ser compartilhados e a pedra vira caco de
vidro. Sorteie o ruído pela **posição** arredondada — assim o mesmo canto recebe
o mesmo empurrão em todos os triângulos que o usam. É o que `rock()` faz.

## Peça animada

Devolva uma classe com `group` e `update(dt)`, como a `FerrisWheel`. A cena
chama `w.onUpdate((dt) => peca.update(dt))`.

## Peça que MUDA com o jogo: receita, e não peça

Quando a mesma coisa precisa existir em várias versões que o jogador destranca
jogando, ela sai de `props.ts` e ganha **arquivo próprio**, com uma função que
recebe um `estilo` e devolve aquela versão. Hoje é o caso de um só, e ele é o
modelo a copiar: `src/world/regador.ts`.

O regador é a arma do minigame do jardim, e cada carta que melhora ele **mexe
na peça da mão** — o bico estica de verdade, o crivo alarga, o corpo engorda,
a mangueira aparece enrolada. Nada de ícone de buff no canto da tela: neste
projeto todo modelo é geometria procedural, então o upgrade aparece no objeto.

As regras que valeram ali, e que valem para a próxima:

- **Números contínuos para o que repete, booleano para o que é único.** Cartas
  comuns repetem (pegar "Bico mais longo" três vezes tem que esticar três
  vezes), então elas são `0 a 1`; carta única é `true/false`.
- **Estágios visíveis**, e a cor é o que os separa de longe. Mude a FERRAGEM
  antes do corpo: trocar só o corpo faz os estágios parecerem objetos
  diferentes, e trocar só a ferragem não dá salto no último.
- **`props.ts` continua exportando o atalho** (`regador()` devolve o de
  fábrica), para quem só quer a peça largada num canto não precisar saber que
  existe uma receita.
- **O teste monta as versões lado a lado e mede**, porque é fácil escrever uma
  carta que não muda nada e impossível notar isso olhando uma foto só. Ver
  `scripts/regador.mjs`.

## Pano que dobra (edredom) e tapete com franja

Tecido não é caixa sobre caixa. O `edredom()` (`furniture.ts`) é uma folha
plana medida em metros que é DOBRADA em volta do colchão: o que passa da
largura faz um quarto de volta na quina e cai reto, e o UV é o comprimento do
pano — o matelassê segue a dobra sem esticar. Nas quinas do pé a dobra maior
manda e a menor só puxa um pouco (somadas inteiras, a ponta furava o chão).

O `tapete()` é uma forma de canto arredondado extrudada, com o desenho inteiro
pintado em canvas na proporção dele (borda e losango só existem uma vez,
então nada de azulejo), e a franja é um `InstancedMesh`: ~100 fiozinhos numa
malha só, cada um com giro e comprimento sorteados. O `rug()` antigo continua
para quem só quer mancha de cor.

A cama (`bed()`) manteve as alturas da antiga de propósito: a cena de deitar
do quarto conta com o topo do edredom perto de 0,68.

## Móvel oco, vaso torneado e folha instanciada (o quarto do Ari)

- **Armário que abre tem que ser OCO** (`armario()`): laterais, fundo, rodapé,
  cornija e prateleiras, e não um bloco — porta entreaberta num bloco mostra a
  própria madeira. Pela fresta aparecem o varão, as roupas nos cabides e a
  roupa dobrada. Moldura de porta: as réguas em pé ficam ENTRE as deitadas e
  são mais grossas, senão as faces da frente coincidem nas quinas.
- **Vaso é `LatheGeometry`**: meia dúzia de pontos de perfil (pé, barriga,
  borda virada) girados no eixo (`plantaDeEspada()`).
- **Folha é geometria própria** (`folhaDeEspada()`): a silhueta de lança
  dobrada em calha e curvada para fora, e as nove folhas são UM
  `InstancedMesh` com cor por instância (`setColorAt`, material
  `toon(0xffffff)`).
- **Estante com enfeite** (`estanteDeLivros()`): o contrato do `quarto.mjs`
  continua — carcaça como malha filha direta, livro num pivô com
  `userData.livro` —, e os enfeites moram num GRUPO, fora da conta.

`SO=armario,estante node scripts/zfighting.mjs` caça faces coplanares só
nessas peças (a lista inteira passa de cinco minutos).

## Os móveis da casa do Ari (`world/moveisDaCasa.ts`)

A sala e a cozinha têm peças PRÓPRIAS (`rackComTv`, `pia`, `armarioAereo`,
`geladeira`, `mesaDeJantar`, `cadeiraDeJantar`, `sofaFofo`, `mesinhaDeCentro`,
`abajurDePe`, `maquinaDeLavar`, `prateleiraDeParede`, `jiboiaEmVaso`), e não as
do `furniture.ts` reescritas: a escola usa as antigas (o Mania ganhou as
dele, em `world/moveisDoMania.ts`). O tamanho
por fora é o das antigas, para colisor e interação não mudarem. O que deixa
fofo: quina arredondada em tudo (`macia()`), pé palito, puxador, e um sinal de
gente morando (ímãs na geladeira, chaleira no fogão, almofada torta).

- **Pé que gira nasce com a origem na PONTA DE BAIXO** (`pePalito`: a
  geometria é transladada `alto/2` para cima). Com a origem no meio, o
  `pe.position.set(x, 0, z)` de quem usa enterrava metade do pé e a mesa, as
  cadeiras, a mesinha e o sofá flutuaram; e o giro de abrir o pé levantava a
  ponta do chão. Vale para toda perna, pé e haste que a peça posiciona e gira.
- A porta da rua (`portaDaRua`) segue o contrato da `interiorDoor` (folha na
  `dobradica`, centrada na linha da parede) e pede um vão de `largura + 0.2`.
- A TV tem a malha `tela`, e `telaDeTvLigada()` é o show desenhado em canvas.
- A máquina tem o grupo `tambor`, que a cena gira enquanto lava.
- A jiboia é um `InstancedMesh` de folhas de coração (`ShapeGeometry`
  dobrada): as de dentro sobem quase em pé, as de fora abrem, e um terço cai
  pela borda. Folha nascida na borda do vaso vira roseta rente à terra.
- `acabar()` agora decide o UV por triângulo em peça curva (tudo que não é
  `BoxGeometry`), então dá veio e tecido nas peças de quina macia também.

## Prédio de rua: a fachada da lojinha (`world/lojaDeRoupas.ts`)

A loja da Estella no Villa Lobos é o exemplo de PRÉDIO por fora (a casa do
Ari é o de móvel). O kit que nasceu com ela serve a qualquer fachada:

- **Parede é forma com furo**, e não caixa com desenho: `THREE.Shape` com
  `holes` (vitrine, porta com bandeira em arco, janela de arco), extrudada na
  espessura (`ExtrudeGeometry`). O vão ganha o "batente" de reboco por dentro
  de graça, e não há emenda de caixa na fachada. O caixilho mora DENTRO do vão
  e entra 1 cm no reboco (casado com o furo, as faces de dentro brigam).
- **Moldura com perfil** (`world/molduras.ts`): `contorno(perfil, hx, hz,
  vaos)` dá a volta no prédio com um perfil `[saída, y]` (plinto, rodapé,
  faixa entre andares, cornija com `cavetinho()`, capeamento da platibanda
  com saída negativa para descer por dentro). A quina sai em meia-esquadria
  sozinha, a normal segue a curva, e `vaos` corta a frente ou o fundo na porta.
- **Parede com textura** (`world/texturasDeFachada.ts`): `reboco()`,
  `rebocoComFrisos()` (o térreo) e `tijolinho()` (o rodapé — pinta o tijolo
  com `P.lojaTijolo` sobre branco, com o material creme: rejunte é claro, e
  multiplicar só escurece). O UV é `uvDeParede(geo, x, y, z)`
  (`world/acabamento.ts`): `v` SEMPRE na altura (o friso não fica em pé no
  montante estreito) e lido na posição da peça (o friso do montante continua
  na linha do da parede ao lado). `BoxGeometry` continua `BoxGeometry`.
- **Quadro por parede**: um grupo sem nome por face (`FRENTE`, `DIREITA`,
  `FUNDOS`, `ESQUERDA`) com a face de fora em `z = 0`. A janela é montada uma
  vez e serve às quatro; a `fundir()` atravessa grupo sem nome.
- **O que se repete é um lote** (`Lote`: flor, folha, lâmpada do letreiro,
  palheta de veneziana) — um `InstancedMesh` para o prédio inteiro, cor por
  cópia, a matriz levada do quadro da parede para o da peça.
- **O vidro do prédio é UMA malha** (juntado à mão: transparente não entra na
  `fundir()`), com `renderOrder` acima da luz pintada da vitrine — o vidro grava
  profundidade, e pintado antes ele apagaria a poça de luz atrás dele.
- **Toldo de lona**: gomos que embarrigam entre as varetas, aba recortada em
  meia-lua, e o mesmo avanço de 1,05 (a conta da câmera da Estella).
- O tamanho por fora e o plano da fachada são os de antes: colisor, porta,
  posto da Estella e `scripts/estella.mjs` continuam valendo.

`?semFundir` + uma caixa envolvente por malha (no quadro da peça) acha face
coplanar também em peça arredondada e extrudada — o `zfighting.mjs` só mede
`BoxGeometry`, e depois da `fundir()` sobram poucas.

## Prédio de telhado: o Mania de Churrasco por fora (`world/restauranteDoClube.ts`)

O restaurante do clube é o exemplo de prédio de TELHADO (a lojinha da Estella
é de platibanda). Usa o mesmo kit dela — `Lote`, `extrudar`, `retangulo`,
`moldeEmArco`, `moldeReto`, `quina`, `geoFlor` e `geoFolha` são exportados de
`lojaDeRoupas.ts` — e acrescenta:

- **A conta da fachada é 0,95 por metro, e não 0,67.** A câmera padrão vem
  pela DIAGONAL: para avançar 1 m em `z`, o raio anda √2 no chão, e cai
  `tan(34°) · √2 ≈ 0,95`. O 0,67 só vale com a câmera girada de frente. É a
  conta de tudo que avança da fachada (beiral, toldo, marquise): com a
  testeira do beiral em 4,82 e 62 cm para fora, a fachada some acima de
  ~4,25, e o letreiro mora abaixo disso; o toldo da janela (ponta em 3,0, 86
  cm para fora) tapa a janela acima de ~2,2; e o lampião da direita da porta,
  a 2,4, caía inteiro na sombra do toldo vizinho — desceu para 2,05.
- **Telha colonial em geometria** (`aguaDeTelhas`): cada água é uma malha de
  fiadas que sobem um pouco de cima para baixo e se sobrepõem, com o LÁBIO em
  pé fechando a boca entre uma fiada e a de baixo — é o lábio, na sombra do
  toon, que desenha a linha da fiada; a canaleta é um cosseno (cava nas
  pontas, onde a testeira cobre). A cumeeira é uma fila de troncos de cone que
  se engolem. ~14 mil triângulos as duas águas: a parte mais pesada do
  prédio, e a que mais mudou a cara dele.
- **Peça animada e fundida ao mesmo tempo**: a cabeça do exaustor eólico é um
  grupo com NOME (`eolico`, a `fundir()` junta as aletas lá dentro e ele
  continua girando) e a fumaça da chaminé é um `InstancedMesh` com
  `semSombra` e `frustumCulled = false` (as bolotas andam). A classe devolve
  `group` e `update(dt)`, e a cena faz `w.add(fundir(w.place(mania.group, …)))`.
- **Tijolo de churrascaria**: `tijolinho(lado, cor)` recebe o barro; o
  restaurante usa o `P.churrascoTijolo` da parede da grelha lá dentro, para
  o prédio e o salão serem a mesma casa.
- **Janelas vizinhas não se tocam**: peitoril e caixa de toldo param antes do
  meio do vão entre duas janelas. Passando disso, o peitoril de uma encostava
  no da outra, face com face (achado medindo a caixa envolvente de cada malha
  no quadro da parede — o `zfighting.mjs` não mede quadro girado).
- **A mesa da área externa** (`mesaDoRestaurante`) guarda as três medidas que
  a cena da mesa usa (`MESA_DO_RESTAURANTE`): tampo em 0,775 (o prato pousa em
  0,78), cadeira a 1,02 do centro e assento em 0,485 (a pose de sentado). A
  TOALHA XADREZ (`toalhaXadrez()`, a cor vem pintada na textura) são duas
  malhas — o tampo com o UV no chão, a saia com o UV desenrolado —, cai pouco
  do lado das cadeiras (senão engole o joelho de quem senta) e desce nas
  quatro pontas, nas diagonais. As cadeiras perdem a etiqueta dentro da mesa,
  para a `fundir()` juntar a madeira das quatro com a da mesa.
- **O porta-temperos é lote**: três frascos e três bicos, cor por cópia.

## A boutique da Estella por dentro (`world/moveisDaBoutique.ts`)

A segunda reforma da loja ("chique, mas confortável, bem organizada") é o
exemplo de INTERIOR de comércio. O que serve para a próxima loja:

- **A arara pendura o CATÁLOGO, e não cores soltas** (`world/roupasNaArara.ts`).
  `araraDaBoutique(fila)` recebe a fila de `world/itens.ts` e pendura as peças
  dela: a cor e o detalhe saem da ficha (`ItemDef.cor`/`corDetalhe`), e o tipo
  sai do `slot` (`tipoNaArara`: vestido é tronco com `pernasNuas`, regata é
  tronco com `bracosNus`…). Quem abre a arara de vestidos vê no painel os
  vestidos pendurados nela. O que não pendura (gorro, bota, pulseira, cartela)
  vai para duas prateleiras de carvalho entre os montantes. As peças da
  coleção nova têm silhueta por id (`TIPO_POR_ID`: saia, casaco, vestido
  longo, jardineira, sapatilha, bota alta…), e o mezanino vende também em
  dois móveis que mostram o que vendem do mesmo jeito: a VITRINE DE JOIAS
  (`vitrineDeJoias(largura, pecas)` — o colar, a tiara e o relógio sob o
  vidro) e a MESA DE CHAPÉUS (`mesaDeChapeus(pecas)`, redonda de dois andares:
  chapéus nas cabecinhas de mármore, bolsas no tampo, lenço em cima).
- **Roupa é silhueta estofada, em instância.** Cada peça é a forma dela
  (`Shape`) extrudada com bisel e as normais alisadas (`mergeVertices` sem UV);
  o detalhe (gola, punho, renda, cós) é uma segunda silhueta um fio mais
  GROSSA, que atravessa o pano. Doze camisas são um `InstancedMesh` (a classe
  `Vitrine`), e a arara anota em `userData.roupas` quantas peças mostra — é o
  que o `scripts/lojinha.mjs` conta.
- **Organizado é**: três tamanhos de cada peça (dois quando a fila passa de
  seis), em bloco de cor, todas no mesmo cabide de madeira, de lado; na
  premium, uma peça de cada, DE FRENTE (o gancho é giratório) — e de lado
  quando o arco tem mais de duas. E a plaquinha da seção em cima de cada arara —
  DUAS faces de costas uma para a outra: o plano `DoubleSide` mostra o verso
  espelhado.
- **Boiserie** (`boiserie(comprimento, altura)`): rodapé, friso e cornija com
  perfil (`frisoReto`, uma extrusão do perfil com a ponta em meia-esquadria
  nos cantos de dentro) e os quadros de moldura (o `contorno()` de pé). Branca
  na parede rosa-claro. `semQuadro` tira os quadros atrás de móvel alto.
- **Furo de arco extrudado** para o que tem vão: os provadores (a fachada é o
  contorno com as portas recortadas até o chão — porta que toca a borda é
  recorte no contorno, não `hole`) e a estante de nichos (aí é `hole`: o nicho
  não toca a borda). A parede do vão sai do próprio furo.
- **Canelado sem ripa**: a frente do balcão é uma forma com a borda em
  meias-luas, extrudada para cima — o toon desenha cada canelura.
- **Capitonê de verdade**: o pufe é torneado e cada botão afunda o tampo em
  volta dele (um sino nos vértices); o toon desenha a covinha.
- **A escada rolante ANDA** (`world/escadaRolante.ts`, classe com `update`): os
  degraus são três `InstancedMesh` (piso, espelho, quina) reposicionados a
  cada quadro; no plano das pontas o espelho encolhe a zero e o degrau some
  debaixo da placa pente. O corrimão é UM tubo com a volta nas duas pontas. A
  esfera envolvente dos degraus é a do lance inteiro (eles andam).

## O Mania de Churrasco por dentro (`world/moveisDoMania.ts`)

A reforma da cozinha e do salão ("melhore todos os objetos, os móveis, a
iluminação — mantenha as funcionalidades") é o exemplo de RESTAURANTE por
dentro. Cada peça nova ocupa o lugar da antiga, com o mesmo tamanho por fora
e a MESMA etiqueta (`churrasqueira`, `fogao-industrial`, `pia-industrial`,
`bancada-inox`, `balcao-de-passagem`, `estante-de-bebidas`,
`placa-de-fachada`, `quadro-empregado-do-mes`) — o `mania.mjs`, o
`mesas.mjs`, o turno e os colisores da cena continuam valendo. As medidas
que a cena e o turno usam moram em comentário e constante:

- o BALCÃO tem o tampo em 1,15 (1,06 de corpo + 0,09 de granito), que é
  onde o prato pronto espera, a louça é largada e o osso do Walter fica;
- a MESA (`mesaDoSalao`, `MESA_DO_SALAO`) tem a toalha em 0,812 — entre a
  louça suja (pousa em 0,8) e o prato servido (0,82) —, as cadeiras em
  `x = ±0,55, z = ±0,95` com o assento em 0,50 (a pose de sentado), e o
  vasinho no grupo `floreira` com o atalho em `userData.floreira`.

O que deu a cara nova, e serve para o próximo restaurante:

- **Churrasqueira de alvenaria com NICHO EM ARCO**: a frente é uma forma com
  os dois furos (`arco` de `lojaDeRoupas.ts`) extrudada na profundidade do
  nicho, e o miolo de trás é uma caixa — o fundo do nicho é a face dele, com
  a fuligem por cima. A lenha é casca (cilindro aberto) e corte (disco na
  ponta) em dois lotes; a brasa é três lotes (apagada, acesa, viva), porque
  o `glow` é do material, e a cor por cópia não acende.
- **Inox escovado é textura** (`inoxEscovado`): faixa deitada larga e fraca,
  no lado mais comprido da chapa (o `uvEmMetros` acerta sozinho).
- **Cuba de verdade**: o tampo da pia é uma forma com os furos, deitada; a
  cuba é uma caixa ABERTA com a normal para dentro (`cubaAberta`), 3 mm por
  fora do furo — de cima se vê o fundo e o ralo.
- **Moldura e almofada** no balcão: montante mais grosso que a travessa, e
  a almofada é um retângulo extrudado com BISEL largo (o chanfro é o
  degrau de luz do toon).
- **Garrafa, tecla, pote, botão, comanda, tempero: tudo lote**, a cor por
  cópia. O rótulo é um cilindro dos mesmos gomos da garrafa, e por isso a
  garrafa NÃO gira (girada, ela fura o rótulo pelas arestas).
- **`torneado()` acerta o sentido do perfil sozinho** (pela área): o
  `LatheGeometry` só vira a face para fora com o perfil anti-horário, e
  escrito de cima para baixo a peça nasce do avesso. Foi assim que a cúpula
  do pendente saiu BRANCA (via-se o forro, e o teal de fora sumia). O forro
  pede `avesso = true`.
- **Toalha de mesa retangular** (`toalhaRetangular`): o contorno de quina
  redonda amostrado com o comprimento acumulado; a saia cai pouco no meio de
  cada lado e mais nas quatro pontas, com a dobra só embaixo. A ordem dos
  índices é a do pano redondo do clube — invertida, a toalha some (só
  sobravam os riscos das pontas) e o tampo de madeira aparece.
- **Quina de até 2 cm em um degrau só** (`macia`): 108 triângulos em vez de
  300 por caixa, e a mesma imagem. Cilindro cuja tampa encosta em outra
  coisa (pé de cadeira, travessa, barra de grelha) nasce sem tampa.
- **A porta de serviço fecha o resto do vão** (`portaDeServico`): o vão da
  parede tem 2,2 e a porta 1,1, e sobrava um buraco dos dois lados. Os dois
  panos e o alto de reboco moram na peça, sem colisor novo. A folha continua
  na `dobradica`.

### As melhorias do turno (mesmo arquivo)

As peças que a escala do Walter vende (§13.6 de `docs/MINIGAME-RESTAURANTE.md`)
seguem o princípio do regador: a melhoria é uma coisa que se VÊ. A cena monta
todas e mostra só as compradas (`mostrarMelhorias`), sem remontar a cena.

- **A bandeja na mão** (`bandejaDeGarcom`): a origem é a MÃO, o prato fica um
  dedo acima e um tico à frente. O que a dupla carrega pousa no grupo
  `carga`, nas vagas de `VAGAS_DA_BANDEJA`, a 0,46 do tamanho de mesa (o
  prato de mesa não cabe dois numa bandeja). Quem põe na mão é o motor do
  turno, por `g.segurarNaCena` — nada de item de mochila.
- **Coisa de mão no corpo chibi é maior que a de verdade**: o bloquinho de
  comandas do tamanho real virou um risquinho na cintura; com 1,7× ele lê.
- **Lousa de giz: linha CURTA.** `escreverAGiz` tira o tamanho da letra da
  altura da linha; "Aguarde aqui" numa linha estourou a lousa do cavalete.
  Mais linhas = letra menor.
- **Peça de chão nunca colada na mureta**: o cavalete nasceu no canto da
  direita e a mureta (do lado da câmera) engolia metade dele.
- **Coisa que toca anima por `InstancedMesh`**: as notas do rádio são um lote
  de quatro, refeito no `update` (a cena só chama enquanto ele está à vista).
- **Carrinho, tubo e borda**: o tubo que atravessa a bandeja para 3 mm
  abaixo do tampo (rente, as tampas brigam), e as bordas compridas param
  antes das curtas.
- **O peso**: 904 → ~500 desenhos por quadro na vista de longe, e os
  triângulos de ~35 mil para ~170–195 mil — a mesma régua da boutique
  (~170 mil). No Chromium sem placa as duas rodam igual (~2 q/s).

- **A plaquinha de funcionários do mês** (`plaquinhaDosFuncionarios`): a
  mesma família do quadro do Walter (moldura dourada de bisel, a arte em
  canvas sob o vidro), deitada e menor — o do patrão continua o maior da
  parede. Os rostinhos são pintados com a pele e o cabelo das fichas
  (`characters/cast.ts`), então mudar o Ari muda a plaquinha. Em cima do
  quadro ela ficava espremida no teto e a câmera cortava; embaixo do
  lampião, entre ele e o quadro, a luz dele cai nela.

As faces coplanares de peça arredondada não aparecem no `zfighting.mjs`
(ele mede só `BoxGeometry`). Aqui elas foram caçadas com a caixa envolvente
de cada malha no quadro da peça, com `?semFundir` — e eram as de sempre:
espelho de bancada com a ponta no plano da do tampo, o alto do batente no
plano do alto da verga, a pilastra da estante com o topo no da tábua de
cima, a ponta das tábuas do lambri na do rodapé.

## A barraca da clareira (`world/acampamento.ts`)

O acampamento atrás do lago do Villa Lobos (`docs/ACAMPAMENTO.md`) é o
molde de peça que se ENTRA sem virar cena nova:

- **Domo de geometria própria** (`cascaDoDomo`): planta de superelipse
  (`|x/a|⁴ + |z/b|⁴`, retângulo de quina redonda), perfil de quarto de elipse
  e o pano CEDENDO entre as varetas (`entreVaretas`) — é o que faz ler barraca
  e não meia bola. No polo os vértices coincidem: a normal deles é posta à
  mão para cima, senão o topo fica com um ponto preto.
- **A porta é furo de verdade**: o quadradinho cujo meio cai dentro do D
  não entra no índice; o sobreteto tem o furo 5 cm maior e a beira creme da
  barraca de dentro aparece em volta. A porta, a aba e os rolos são
  desenhados no plano e assentados na lona por `naFrente` (busca do ângulo).
- **O TETO SAI.** Tudo acima de 42 cm mora no grupo `teto`; a costura entre o
  laranja e o cinza passa exatamente ali, então o corte cai numa emenda que a
  barraca já tem. A cena esconde o grupo, deita os dois na âncora (a da cama
  do quarto) e olha de cima com `setCameraOmbro`: casinha de boneca.
- **A casca cresce, o recheio não.** A barraca é desenhada em metros de
  barraca de verdade e um grupo interno a cresce 10% (perto do corpo chibi
  ela parecia de criança); os colchões e a âncora são filhos da raiz e
  ficam do tamanho de quem deita.
- **Miudeza de cima da mesa se junta com a mesa**: tirando a etiqueta de
  peça do fogareiro, da panelinha e das canecas, a `fundir()` junta material
  por material com a mesinha (o alumínio, o esmalte).
- Samambaias de um lugar inteiro são UM lote (`samambaias([...])`).
- **Arbusto florido** (`arbustoFlorido(escala, semente, cores)`), ~1 m: sete
  bolotas amassadas pela POSIÇÃO em dois verdes (um domo, as de fora mais
  baixas), folhinhas em lote escapando do contorno e flores (`geoFlor`, de
  `lojaDeRoupas.ts`) deitadas na copa pela normal, com o miolo — os três em
  lote, as flores com a cor sorteada de `cores`. Nasceu no lugar das duas
  árvores que tapavam o sol nascendo da porta da barraca: onde a câmera de
  cena precisa olhar por cima, arbusto, e não árvore.
- **A porta FECHA** (`fecharPortaDaBarraca(raiz, k)`): o pano do sobreteto
  é a casca do domo dentro do D, em COLUNAS da direita (o lado do rolo) para
  a esquerda — fechar é mostrar colunas (`setDrawRange`), atrás do puxador
  que corre pelo contorno do D, com o zíper (um tubo) se desenhando junto. O
  pano é cortado no corte do teto, como a barraca, e fica 1,2% para fora da
  lona (a sobra não é coplanar).
- **A barraca ACENDE** (`acenderBarraca(raiz, acesa)`): a lona troca pelo
  mesmo pano com `glow` (os pares ficam em `userData.lonas`), o globo da
  lanterna acende, o halo e a poça quente lá dentro aparecem — a poça na
  altura de cima dos sacos de dormir, senão os colchões a escondem — e o
  leque de luz vaza pela porta enquanto ela está aberta. O **varal**
  (`acenderVaral(varal, k)`) acende lâmpada por lâmpada pela cor do halo de
  cada uma.
- **Muitas luzes num desenho** é o `brilhoEmLote` (`core/materials.ts`): um
  `InstancedMesh` de quadradinhos que o vertex shader vira para a câmera; o
  tamanho é a escala da cópia e a força é a cor dela (somada: preto é
  apagado). O `Sprite` não se instancia. Os halos do varal, os vaga-lumes e
  as estrelas (`world/noite.ts`) usam ele, sempre com `semSombra`.

## A etapa D da clareira: o fogareiro, o radinho e o pote

Três peças que SE MEXEM o tempo todo, e o molde de cada uma:

- **A cozinha do fogareiro** (`world/cozinhaDeAcampamento.ts`, a classe
  `CozinhaDoFogareiro`): a cena só chama `preparar(prato)` e `update(dt)`; a
  cozinha faz o prato inteiro no relógio dela. O que voa do caixote para a
  mesa e volta é um grupo com nome (fronteira da `fundir()`), registrado com
  a casa dele (pai, posição e giro) e devolvido EXATAMENTE para lá. A chama é
  o shader `ChamaDeGas` (`core/shaders.ts`: aditivo, a base presa e a ponta
  dançando, a fase de cada linguinha pela posição no mundo) e ABAFA com
  panela em cima — o cone encolhe e as linguinhas deitam para fora; alta, a
  ponta furava o budare. Sprite novo nasce VISÍVEL e do tamanho de um metro
  (a faísca do acendedor era um clarão branco em cima da mesa, de dia e de
  noite): esconda no construtor o que só aparece num momento. O coador de
  pano senta 3,4 cm ACIMA da boca da caneca (rente, só se via o arame). O
  que vai para a mão na canga (a arepa, o garfo) sai na escala da cozinha
  (`ESCALA_DA_COZINHA`), senão vira um pontinho.
- **O radinho de pilha** (`world/radinho.ts`, `Radinho`): ligar é uma
  COREOGRAFIA de promessas (o botão, o led, o mostrador piscando, a antena
  que levanta e estica gomo por gomo, a agulha que passa do ponto e volta —
  a curva de "voltar" é a `easeOutBack`), e cada `ligar`/`desligar` pega uma
  VEZ e para no meio se outro chegou depois (sem isso, o `ligar` velho
  acendia o led de volta). O led aceso e o apagado são DUAS malhas com nome
  (trocar material em malha juntada não pode); o mostrador aceso é luz
  pintada. Tocando, o corpo (`corpo`, com nome) pulsa no tempo da música
  (estica e achata: o volume se conserva) e as notinhas são UM lote (colcheia
  extrudada com bisel, cor por cópia, encolhendo até sumir).
- **O pote de vaga-lumes** (`world/poteDeVagaLumes.ts`): o vidro torneado
  transparente fica fora da `fundir()` sozinho; a tampa é um grupo com nome
  e dobradiça (`tampa`). Na mão, vai PELA ALÇA (um grupo em volta com o pote
  pendurado embaixo): segurado pelo fundo, a mão atravessava o vidro. Os
  soltos (`VagaLumesSoltos`) de TODOS os pontos são três lotes — os pontos,
  os halos (`brilhoEmLote`) e as poças de luz no chão (`luzNoChao` com cor
  por cópia).

## O lago do Villa Lobos (`world/lagoDoParque.ts`)

- **O trapiche** (`trapiche()`, constantes em `TRAPICHE`): tábua por tábua
  atravessada, com fresta, cada uma num de três tons e um tico mais comprida
  ou curta que a vizinha (a mão de quem pregou); as vigas entram 4 mm nas
  tábuas (encostar seria face coplanar); as estacas saem da água e as duas da
  ponta sobem como cabeço, uma com o rolo de corda; guarda-corpo só na metade
  de terra (a ponta é aberta, é de onde se senta); a boia salva-vidas com
  faixas que são arcos de toro um tico mais grossos que o anel. Veio pelo
  `acabar` e tudo pela `fundir()`: ~120 peças, meia dúzia de desenhos.
  `alturaNoTrapiche(lz)` é o relevo da rampinha (a cena passa para o
  `g.relevo`).
- **As ninféias** (`Ninfeias`, `coloniaDeNinfeias`): quatro lotes (folha,
  flor, miolo, botão). A folha tem a FENDA (disco com um gomo faltando) e a
  borda virada para cima, e o veio é canvas; rosa e branca são a MESMA flor
  com cor por cópia. Pétala de flor miúda é esfera 6×4 (a flor tem 23): 8×6
  dobrava os triângulos da cena sem ninguém ver diferença. Flor e botão não
  fazem sombra (`userData.semSombra`), a folha faz. Elas boiam, e
  `balancar(x, z)` sacode as de perto quando passa uma marola.
- **O taboal** (`taboal(tufos, vento)`): folha, haste e espiga em lote com o
  material do `Vento` (`core/shaders.ts`). A espiga já NASCE na altura da
  ponta da haste (em vez de ser filha dela) e divide a matriz da haste: as
  duas balançam juntas sem conta nenhuma.
- **Os seixos** (`seixosDaBeira`): um lote de icosaedro achatado com cor por
  cópia, na linha d'água; os de dentro d'água afundam até só a corcova
  aparecer. Sem sombra (5 cm não fazem sombra que se veja).
- **O tronco dos tigres-d'água** (`troncoDoLago`, `TRONCO`, `topoDoTronco`):
  deitado com o fundo abaixo da água (o chão do mundo esconde), corte claro
  com anéis 2 mm à frente da tampa, toco de galho e musgo.
- **As peças que voam**: `pedrinhaDeQuicar`, `moedinha`, `peixeQuePula`,
  `libelula` (do tamanho de verdade não se vê: a cena usa 2,4×).

## A loja de patins do Villa Lobos (`world/lojaDePatins.ts`)

O segundo prédio de rua feito com o kit da lojinha da Estella, e o molde de
loja PEQUENA de um andar só (platibanda, sem telhado à vista):

- **As medidas que a cena usa moram na peça** (`LOJA_DE_PATINS`: o prédio,
  até onde vão a floreira e o degrau, e o balcão do aluguel). A cena monta os
  colisores e o ponto do "Alugar patins" lendo dali, e o
  `scripts/lojaDePatins.mjs` confere que todo vértice da loja na altura do
  corpo (25 cm a 1,9 m) cabe nos colisores — a primeira loja tinha os números
  copiados à mão, e dava para atravessar o balcão.
- **Porta que toca o rodapé é recorte no contorno da parede de cima**, e não
  furo: o tijolinho vai dos dois lados dela, e embaixo fica a soleira de pedra.
- **Toldo raso e alto** (0,95 por metro, a câmera da diagonal): a saia em
  meia-lua tem uma meia-lua por listra, e o `x` em metros é o `u` da lona e
  da saia — a listra continua de uma para a outra. O braço do toldo corre
  por baixo da lona: descendo da parede, ele pousava no vidro.
- **O que se vê pelo vidro está perto dele**: a câmera de cima enxerga só
  ~1,2 m para dentro da vitrine e ~0,5 m da janela do aluguel (o tablado, a
  parede de exposição e o escaninho moram aí). O fundo da loja fica vazio.
- **`patinsRetro()`** é o patins de vitrine (bota de cano alto com quina
  macia, biqueira, lingueta, cadarço cruzado, raia, placa, eixos, rodas com
  cubo e freio). O `patins()` do kit continua sendo o do pé da dupla. O
  gigante do telhado é o mesmo, a 4,1×, numa travessa de dois pés.
- A luz pintada lá dentro é do tamanho da loja: maior, a poça saía pela
  parede e acendia a calçada.

## O banco de praça (`world/bancoDePraca.ts`)

O banco do parque e do clube (`w.banco` usa ele por padrão; o reto antigo,
`bench()`, fica para o vestiário da escola, com `modelo: 'reto'`):

- **Ferro fundido é CURVA, não grossura**: cada barra da cabeceira é um
  `TubeGeometry` numa `CatmullRomCurve3` (`'centripetal'`): a perna da frente
  com a voluta no pé, a de trás que vira o encosto inclinado, o trilho do
  assento com a barriguinha, o reforço em arco e o braço que enrola na
  ponta. Seis gomos de volta bastam a esta câmera.
- **Três cabeceiras**: as duas das pontas com braço e uma no meio, sem.
- **As medidas do banco antigo ficam** (`BANCO_DE_PRACA`): o assento em
  0,53 (o `w.banco` desconta a altura do quadril dali), 1,9 de comprido (os
  dois sentam a ±0,46) e tudo dentro do colisor de 0,95 × 0,35 — o
  `scripts/banco.mjs` continua valendo sem mudar uma linha.
- **A ripa do encosto senta no FERRO, não no ar**: a lista do encosto guarda
  o `z` do miolo do tubo em cada altura, e a ripa vai 4 cm à frente (raio do
  tubo + meia ripa − o encaixe). Na primeira versão elas boiavam 3 cm à
  frente do ferro.
- A ripa da frente do assento é a "cascata" (mais baixa e girada para a
  frente): é por ali que a perna de quem senta dobra e balança.
- O `w.banco` passa a peça pela `fundir()`: o ferro, a madeira e o latão
  viram três malhas por banco.
- **O peso mora nos gomos do ferro** (80% do banco): trecho quase reto leva
  poucos gomos, e as volutas, que são as curvas que se veem, ficam com os
  delas; a cabeça do parafuso (1 cm) é um octaedro achatado; o reforço da
  cabeceira do meio, escondido debaixo do assento, não existe. 4,4 mil →
  3,1 mil triângulos por banco, com a mesma foto de perto.

## As árvores (`world/arvores.ts`)

O `tree(tipo, escala, semente)` de sempre chama `arvore()`. As quatro
espécies (redonda, florida, pinheiro, palmeira) são **uma malha e um
material cada** — o `toon(0xffffff, { corPorVertice: true })`, com a cor
pintada nos vértices:

- **o detalhe é FOLHA, não bola**: a copa é de sete tufos amassados (ruído
  pela posição, normal da esfera de antes de amassar) cobertos de folhinhas
  — losangos dobrados na nervura, espalhados pela espiral de Fibonacci, com
  a ponta levantando. São elas que recortam a borda da copa e pegam a luz
  uma a uma. Uma primeira versão só com tufos e um mosaico de cor por face
  (mais leve) ficou com cara de cristal, e o Renan pediu mais detalhe;
- **a cor por vértice faz o resto**: o degradê da copa (escura embaixo,
  clara em cima), o tom de cada folha (sorteado pelo número da face: os
  três cantos iguais), a folha nova mais clara, os anéis da palmeira;
- **florida**: metade das folhinhas vira florzinha de cinco pétalas com o
  miolo amarelo, e caem pétalas em volta do pé;
- **raiz é curta, grossa e afunda na terra** — fina e comprida por cima do
  chão, liava como espinho;
- **pinheiro**: cinco saias de nove pontas, a borda em estrela caída e a
  barriga funda escura (faceta é o estilo);
- **palmeira**: tubo curvo em degraus (cada anel um tico mais gordo ou mais
  magro, reescalado em volta do centro da curva), dez folhas de FOLÍOLOS
  pendendo dos dois lados da nervura (o pente é que lê "palmeira"), duas
  folhas secas penduradas, cocos redondos — material dos dois lados;
- o tamanho por fora é o das antigas: o ponto cego da câmera, a clareira e o
  sol nascendo da barraca foram medidos com elas.

Peso (as 93 árvores do parque): 467 malhas → 93; 28,8 mil → 80,8 mil
triângulos (redonda ~1 mil, florida ~1,2 mil, pinheiro ~0,4 mil, palmeira
~1 mil).

## O poste e a lixeira (`world/mobiliarioDoParque.ts`)

A família do banco de praça (ferro verde-garrafa, madeira com veio, um fio
de dourado). `lamp()` e `bin()` do `props.ts` chamam `poste()` e
`lixeira()`, então toda cena que já tinha poste e lixeira trocou junto.

- **Coluna canelada sem textura**: cilindro de 16 gomos com um sim, um não
  recolhido, SEM índice — cada face com a sua normal, e o toon pinta cada
  canelura de um tom.
- **A lanterna sextavada** é o vidro aceso (`toon` com `glow`, malha com nome
  `vidro-aceso`), e as quinas dele casam com as da bandeja e do telhadinho
  porque o `LatheGeometry` e o `CylinderGeometry` começam o giro no mesmo
  ângulo (6 gomos nos três).
- **LUZ DE VERDADE, com conta**: `LuzesDosPostes` são QUATRO `PointLight`
  para a cena inteira, que vão para os postes mais perto da dupla (a cena
  chama `update(dt, g.playerPosition())`). Número fixo de luzes: o shader é
  compilado uma vez e o peso não cresce com os postes. A força cai com a
  distância (some a 16 m), e a luz só troca de poste quando já apagou (ela
  estava longe) — nada de estalo. `noite` (0 a 1) é da cena: a clareira sobe
  ao anoitecer. Os postes longe brilham só com o vidro, o halo e a poça
  pintada. De dia, com força 5, a luz sumia no sol: ficou 11.
- **A lixeira**: ripas em roda com dois aros abertos por fora, o saco escuro
  dobrado na borda, o chapéu de chuva fechado embaixo (o lixo entra pelo
  vão dos três pezinhos) e a plaquinha de reciclagem em canvas (o material
  é um só, guardado no módulo).
- Tamanho dos antigos (poste com 0,25 de raio de pé, lixeira 0,27): os
  colisores das cenas continuam valendo.

## A sorveteria do Mano e a mobília da praça de gelo (`world/sorveteriaDoMano.ts`)

O quiosque do Mano no Villa Lobos virou um CHALEZINHO DE GELATERIA (era o
`kiosk()` com cubas em cima; o `kiosk()` ficou só para o bar de sucos do
clube). O molde de quiosque "com tema":

- **O tema mora no telhado**: duas águas de ESCAMAS DE CHOCOLATE (canvas
  `escamas()`, a ponta da escama apontando água abaixo) com a NEVE escorrendo
  por cima feito cobertura — uma casca de geometria própria por água, beira
  ondulada e dedos largos que descem (fino, o dedo virava dente de serra). A
  grossura cai em raiz na beira e a casca termina 6 mm DENTRO da telha: a
  beira é o cruzamento das duas, não uma faixa rente. A água do `−X` é a do
  `+X` GIRADA meia volta em torno do meio do telhado (espelhar viraria do
  avesso, e a `fundir()` não junta espelhada).
- **Empena para a praça**: o lambrequim recortado (meia-lua e furinho; o lado
  de lá é a forma refeita com `x` negativo — o `ExtrudeGeometry` acerta a
  volta sozinho), o cordão de luzinhas pendurado nele, a placa em ARCO
  (`formaDeArco`, a pintura com UV no retângulo) e a casquinha gigante
  (`casquinhaGigante()`, bola com a saia ondulada da colher).
- **A conta da empena**: lambrequim e luzinhas descem ~14 cm abaixo do
  telhado, e a placa tem que caber DENTRO disso (meia largura 0,6, topo 2,43).
  Mais larga, o lambrequim passava na frente dos ombros do arco.
- **Balcão de gelateria**: frente CANELADA (planta com a borda em meias-luas
  extrudada para cima), tampo de madeira avançando 32 cm, e a VITRINE DE
  GELATO na borda da frente — oito cubas abertas (uma chapa de inox com oito
  FUROS; o montinho de cada sabor nasce dentro do furo, 1 cm abaixo da chapa),
  cada sabor com o seu enfeite (fruta, raspa, semente, rodela) e a paletinha.
  Os sabores e a faixa dos nomes saem de `SABORES_DO_MANO`, a mesma lista da
  lousa da lateral.
- **O que a janela deixa ver é o que está a meio metro dela**: a câmera de
  34° pela janela só alcança o tampo de dentro perto do vidro — a máquina de
  sorvete expresso e a chapa de casquinha moram ali, e não no fundo.
- **As medidas de antes ficam** (`SORVETERIA_DO_MANO`): o deque de 2,8 × 1,9
  é o colisor, o tampo avança até 1,32, e o Mano continua do lado de FORA do
  balcão, sem nada acima nem à frente dele.
- **A mesinha** (`mesaDeSorveteria`): tampo de mármore com aro rosa, coluna de
  balaústre torneada, pé de três patas de tubo com voluta, guarda-sol de gomos
  que cedem entre as varetas — a beira corre RETA de vareta a vareta (a corda),
  que é onde a saia em meia-lua pendura, e o alto da saia acompanha a barriga
  da lona —, a taça de sundae (vidro torneado, chantilly de anéis) e o
  porta-guardanapo. As medidas da cena ficam: cadeiras a ±0,78, tampo em
  0,755, borda da lona em 2,25.
- **A cadeirinha de coração** (`cadeirinhaDeSorveteria`): o encosto é a curva
  do coração (`16 sen³t`, `13 cos t − 5 cos 2t − …`) num tubo fechado, com um
  coração menor dentro; quatro pernas de arame, o aro do meio com as
  voltinhas e a almofada torneada com covinha e botão. Assento em 0,44.
  Dentro da mesa ela entra SEM etiqueta (a `fundir()` junta o ferro das duas
  com o da mesa) e com `userData.cadeirinha`, que é o que o `gelo.mjs` conta.
- **O peso**: arame de 1 cm com cinco lados de volta, furinho de lambrequim
  sextavado, enfeite miúdo em esfera 6×4. O quiosque tem ~16,7 mil
  triângulos e a mesinha ~7,6 mil; na vista da praça inteira, 644 → 472
  desenhos por quadro (as peças agora passam pela `fundir()`) e 81 mil →
  114 mil triângulos.

## Os enfeites da praça de gelo (`world/pracaDeGelo.ts`)

O tufo de cristal, o poste de gelo, o boneco de neve e a borda do rinque da
praça do Mano, na família da sorveteria. O que serve para qualquer peça de gelo ou neve:

- **Gelo é LAPIDADO, não translúcido liso**: o `cristalino()`
  (`core/shaders.ts`) é o toon com cor POR VÉRTICE (a peça pinta o degradê —
  `degrade(geo, y0, y1)`: fundo azul embaixo, quase branco na ponta), um tico
  translúcido e com a BORDA ACESA (fresnel: a faceta que vira de lado para a
  câmera clareia). Com as faces chatas (`lapidar()`: sem índice, normal de
  face), cada faceta acende de um jeito — é isso que lê cristal. A geometria
  precisa do atributo `color` (sem ele o three lê preto).
- **Lasca de cristal** (`lasca()`): prisma de seis faces afinando, com a ponta
  de pirâmide fora do eixo e o anel de cima ondulado. O tufo junta a lasca
  alta do meio, quatro a seis abrindo para fora (`inclinar(a, ângulo)`) e as
  lasquinhas caídas numa malha só (transparente não entra na `fundir()`), em
  cima de um `montinho()` de neve amassada, com um brilho frio pintado
  (`pocaDeLuz`) em volta.
- **Poste de gelo**: coluna de ESTRELA TORCIDA (12 pontos por anel, girando
  1,3 volta de baixo a cima, sem índice — as facetas viram faixas em espiral),
  bloco de gelo no pé, lanterna sextavada (bandeja e telhadinho torneados de
  seis gomos, seis varetas, o miolo aceso, os pingentes e a lasca na ponta),
  colarinhos de neve, halo e poça pintados. Continua baixo (2,4) e com o pé
  dentro do colisor de 0,3.
- **Neve amassada**: o ruído vai pela POSIÇÃO e a cor pelos vértices — o pé
  de cada bola do boneco azulado (`P.neveFunda`), na sombra dela mesma —, e
  as bolas, o montinho e as bolinhas de reserva são UMA malha
  (`toon(0xffffff, { corPorVertice: true })`, o material das árvores).
- **Rosto em cima da bola**: `naBola(i, dx, dy)` devolve o ponto da
  superfície e a normal; pedrinha de carvão achatada deitada na normal, o
  brilho do olho, a bochecha (disco 4 mm para fora) e a cenoura torneada com
  os aneizinhos, apontada pela normal.
- **Braço de galho é TUBO EM CURVA**, com os dedinhos. Um braço que acena tem
  que subir QUASE EM PÉ: aberto para o lado ele apontava para a câmera (que
  fica do lado `+x` do boneco virado), e a subida sumia no escorço — lia como
  braço caído. A outra mão segura uma casquinha (`geoBolaDeSorvete` e
  `waffle` vêm da sorveteria).
- **O cachecol de tricô** (`trico()`, canvas: listras e ponto em V): a volta
  é um toro, e as pontas são tiras dobradas sobre a barriga (cada vértice
  posto na superfície da bola do meio) com o UV correndo no comprimento, e a
  franjinha. Tira já dobrada na geometria vira `BufferGeometry` (caixa
  deformada, o `zfighting.mjs` mede as duas pontas como a mesma caixa).
- **Para onde ele olha**: a cena vira o boneco para a BISSETRIZ entre a
  entrada da praça e a câmera — de frente para a porta, a câmera de sempre
  via a nuca.
- **A borda do rinque é UM banco de neve** (`bordaDeGelo(meiaX, meiaZ,
  raio, meiaPorta)`), e não nove tubos brancos: uma varredura em fatias de
  16 cm pelo contorno de quina redonda (`naVolta(hx, hz, r, s)` devolve o
  ponto e a normal para fora a uma distância `s` da frente, dando a volta),
  cada fatia um perfil de corcova ASSIMÉTRICA — o pico puxado para o lado
  do gelo, a encosta de fora mais comprida — com ruído na largura, na
  altura e uns caroços, afundada 3 cm no chão, e a cor pelos vértices
  (`neveFunda` embaixo, `neveFofa` no alto). A entrada é um vão de 3 m na
  frente, e as duas pontas crescem num montinho de portal (0,44 de alto)
  com um tufo de lascas em cima. As pedras de gelo encostadas (pares de
  lascas ou um bloco lapidado, a cada 1,3–2,5 m) e os dois tufos são UMA
  malha de `cristalino()`. A orientação das faces se acerta sozinha
  (soma do `normal.y`): fatia montada à mão erra o sentido fácil. Sem
  colisor — o `noGelo` da cena continua decidindo quem patina.
- **O peso**: boneco ~5,8 mil triângulos (bolinha de 10 cm com 12 gomos,
  pedrinha 7×5), poste ~1,7 mil, tufo ~0,4 mil, borda ~5,9 mil (duas
  malhas, no lugar de nove); todos pela `fundir()` na cena. Na vista da
  praça inteira, 472 → 441 desenhos e 113,9 mil → 122,2 mil triângulos
  com os enfeites, e 441 → 403 e 122,2 mil → 127,3 mil com a borda.

## O balcão de tingimento (`world/balcaoDeTingimento.ts`)

O cantinho do mezanino da boutique (no lugar da namoradeira e da mesinha)
virou o ATELIÊ DE TINTA da Estella — é ele que abre o ateliê de tingimento
(ver a skill de roupa). O molde de BANCADA DE OFÍCIO, que diz o que se faz
ali só de olhar:

- **a estante de pigmentos na parede**: duas prateleiras de potes em
  arco-íris com as cores da CARTELA de verdade (`TODAS_AS_TINTAS`, um a cada
  três), em quatro lotes (a tinta com cor por cópia, o pescoço de vidro, a
  tampa de latão, a etiqueta); o fundo é um painel perfurado em canvas com o
  UV repetido a cada 25 cm; em cima, carretéis (lote) e rolos de tecido;
- **o tampo conta a história**: carvalho em tábuas com o veio e os
  respingos, pingos e marcas de fundo de pote nas cores da cartela, tudo
  num canvas na proporção do tampo (caixa com o UV de 0 a 1 em cima);
- **o que se mexe tem nome e fica fora da `fundir()`**: a tinta da tina de
  cobre (`tinta-da-tina`, um disco com o redemoinho em canvas, gira) e as
  BANDEIROLAS de tecido tingido num cordão em catenária (um lote de 11, com a
  matriz refeita no `update` — uma brisa que passa de ponta a ponta);
- a cartela EM LEQUE na bancada são sete tiras (uma por família, pintadas
  com as cores dela) em pivôs no mesmo rebite, cada uma 4,5 mm acima da
  outra; o caderno de receitas aberto, a caneca de pincéis, os potinhos de
  amostra, a pilha de tecidos dobrados e o balde de zinco com a tinta
  escorrida no chão completam;
- gavetas de pigmento na frente (almofada com friso de latão, puxador em
  concha e a etiqueta da cor, em lote). As TRAVESSAS de dentro entram no
  fundo e param em profundidades diferentes — com a mesma medida, as pontas
  caíam no plano do fundo (`zfighting.mjs`, 14 pares);
- luz pintada: o filete aceso embaixo da estante e duas poças na bancada.

As medidas que a cena usa ficam em `BALCAO_DE_TINGIMENTO` (o colisor e o
balde). A cena chama `update` só com o mezanino à vista.

**O peso, e as duas juntas que o devolveram sem mudar a imagem:**

- a cartela em leque nasceu com uma textura por tira e um material por
  FACE (~40 desenhos por quadro só ela). Virou UMA textura com as sete
  colunas e o UV de cada tira apontando para a sua (`uvSoNaTampa`: a tampa
  mostra a coluna, as outras faces um pixel liso do papel) — um material,
  uma malha na `fundir()`. O caderno, igual;
- as dezenas de miudezas de cor lisa (tecidos, potinhos, pincéis, tina,
  balde, latão) eram um desenho por cor: `juntarPorCor` (hoje em `world/fundir.ts`, para qualquer peça) as junta numa malha
  de `toon(branco, corPorVertice)` (o material das árvores — o toon
  multiplica a cor do material pela do vértice). Fica de fora o que tem
  textura, brilho, transparência, dois lados, lote ou nome. `?semFundir`
  desliga as duas (é assim que o `zfighting.mjs` mede);
- medido no canto do mezanino, de perto: 235 → 238 desenhos por quadro e
  56,8 → 73,0 mil triângulos (sem as juntas, eram 316 desenhos); com o
  mezanino inteiro, 288 → 286. A foto antes e depois da `juntarPorCor`
  difere só no que se mexe sozinho (bandeirolas, tinta da tina, respiração).

## A roda gigante e a bilheteria (`world/ferrisWheel.ts`, `world/bilheteriaDaRoda.ts`)

A reforma de outubro da área da roda do Villa Lobos ("mais detalhado e mais
bonito"), na família de parque de diversão: branco de treliça, vermelho de
circo (`P.rodaVermelho`) e dourado. As gôndolas são BRANCAS: o Renan pediu,
porque no parque de verdade elas são — uma primeira versão em cinco tons de
algodão-doce saiu.

- **O aro é treliça fundida à mão** (`juntar()` no arquivo: extrusão sem
  índice e cilindro com índice numa malha só): dois anéis por lado com o
  zigue-zague entre eles, os raios CRUZADOS (cada um sai do miolo adiantado ou
  atrasado — o desenho de roda de bicicleta), a coroa vermelha no meio dos
  raios e a roseta de pétalas com a cúpula dourada. São três malhas e um lote
  de luzinhas (`lampadas()`), todos no grupo `aro` — o nome que o
  `scripts/ride.mjs` procura para conferir que a estrutura INTEIRA vira vidro
  no passeio.
- **A gôndola PENDE do eixo** (`CAIDA`, 1,35): a âncora de cada cabine
  (`cabins[i]`) continua sendo o ponto do aro, e o corpo mora abaixo dele; o
  cubo subiu 30 cm para a de baixo passar acima da laje. O interior desce
  junto (`PISO` = piso da casca − `CAIDA`; a cena lê `FerrisWheel.PISO`).
- **32 gôndolas em QUATRO lotes** (corpo, acabamento, vidro e forquilha),
  com a matriz refeita no `layout()`: o corpo é branco; o acabamento (aros da janela,
  caixilho, coração na barriga, bolinhas douradas) tem a cor nos vértices. A
  cabine com gente perde a forquilha e o caixilho (matriz de escala zero): de
  dentro eles tapavam a vista. `frustumCulled = false`, porque elas andam.
- **Os cavaletes**: pernas que afinam até o mancal dourado, travessas e X
  entre elas, sapata vermelha no pé — os pés são os de antes (blocos de
  fundação, colisor de 7,2).
- **A base**: a laje é lateral aberta + disco com o PISO DE MOSAICO em raios
  (`pisoDeMosaico()`, canvas mapeado no `CircleGeometry`: o UV dele é o
  quadrado inteiro, então o desenho redondo cabe certinho); a casa de
  máquinas ganhou duas águas vermelhas, oitão e escotilha; a fila virou
  pedestais de latão com corda de veludo (`corda()`, uma curva que cede); o
  pórtico ganhou o arco de luzinhas com o coração dourado; a cerca, corrente
  de verdade (tubo) e bolinha dourada nos postes.
- **A bilheteria é uma casinha de circo oval**: saia de listras (canvas no
  `u` do cilindro), parede creme com frisos dourados, telhado cônico de lona
  em gomos (o mesmo canvas, no cone), lambrequim de meias-luas com cor por
  vértice, luzinhas na beira, bandeirinha, e a placa "BILHETES" de marquise
  EM PÉ NA BEIRA do telhado (na parede, debaixo do beiral, a câmera não via).
  O guichê é janela SALTADA: a moldura funda cobre a curva da parede, e o
  interior é PINTADO (lampião, rolo de bilhetes, cartaz de coração) sob o
  vidro. O tamanho por fora é o da cabine antiga (colisor 1,53 × 1,08) e o
  beiral da frente avança só 24 cm.
- **O peso** (vista da praça inteira): 1653 → 1538 desenhos; os triângulos
  subiram de 315 mil para 396 mil (a treliça e as gôndolas). A bilheteria de
  perto: 530 → 311 desenhos (ela passa pela `fundir()`).

## O ônibus da cidade (`world/onibusDaCidade.ts`)

O ônibus urbano detalhado (pedido do Renan: as mesmas cores do `bus()` de
antes, mais caprichado). Ele nasceu para a chegada da festa de Halloween e
virou o PADRÃO: é o ônibus do ponto do parque ("Clube") e do clube
("Parque"), e o `bus()` saiu do kit. Na noite da festa a camada só troca o
letreiro (`trocarDestino`). O molde de VEÍCULO:

- **A carroceria é o perfil de lado extrudado na largura, com bisel**: o
  teto com a quina redonda na frente e atrás, o para-brisa deitado e as
  CAIXAS DE RODA recortadas embaixo (`absarc` no contorno). A forma é
  desenhada recolhida do tamanho do bisel, e o bisel a engorda de volta —
  todas as quinas saem arredondadas com uma malha só. Por dentro de cada
  caixa, um meio cilindro escuro de dois lados (sem ele via-se a lataria
  azul por dentro da boca).
- **Faixa que dá a volta** (`faixaEmVolta`): a cintura branca, o friso e a
  saia são a planta do contorno (o retângulo de quina redonda do bisel)
  engrossada para fora e para dentro, em pé — elas contornam a frente e a
  traseira, e PARAM nas portas e nas caixas de roda (`pular(x, z)`).
- **Placa pregada no lado ou na frente** (`noLado`, `deFrente`): a forma de
  quina redonda extrudada, girada para a face; a borracha da janela é a
  mesma forma maior e mais funda. A frente de cima deita para trás num grupo
  girado, e o para-brisa, o letreiro e os limpadores moram nele.
- **Letreiro de LED**: o texto num canvas de rascunho, e cada "LED" do
  painel acende se o pixel dele tiver letra — os pontinhos âmbar em fundo
  escuro. Material chapado (`MeshBasicMaterial` com o mapa, guardado por
  texto, como a TV da casa): é luz própria.
- **As rodas são UM lote**: pneu torneado (banda arredondada), aro, calota,
  rasgos e porcas pintados nos vértices numa geometria só, oito cópias (a
  dupla de trás tem a de dentro). O lado da rua é a mesma roda girada meia
  volta; `rodar(distancia)` gira todas — é o rasgo e a porca que mostram o
  giro.
- **O que a cena mexe tem comando**: `porta(k)` (as folhas, grupos com
  nome, saem um dedo e correm para os lados; a luzinha de dentro acende),
  `acenderFarois` (o halo e a poça na rua), `piscaAlerta` (o `update`
  pisca) e `rodar`. O resto passa pela `juntarPorCor` e pela `fundir()`.
- **O contrato do `bus()` antigo** (9 × 2,55, nariz no `+X`, portas no `+Z`, a
  porta da frente em `x = 2,6`, o degrau em 0,56) — por isso a troca não
  mexe em colisor nem no ponto de "Pegar o ônibus". Os eixos mudaram: a
  roda da frente fica ATRÁS da porta da frente, como em ônibus urbano (no
  `bus()` a porta caía em cima da roda).
- **Coplanar em peça arredondada**: a caixa envolvente de cada malha no
  quadro da peça, com `?semFundir`, achou três (a saia no plano do fundo da
  lataria, o para-choque de trás no plano da saia, a borracha da folha no
  plano da beirada da moldura).
- **O peso**: no ponto, 711 → 689 desenhos por quadro com o novo no lugar do
  velho, e 469 mil → 502 mil triângulos (~34 mil o ônibus); as cenas do
  parque e do clube têm 33 malhas a menos (66 soltas do velho, 33 do novo).

## O kit do Halloween (`world/halloween/`)

As peças do parque enfeitado (`docs/HALLOWEEN.md`, §4.1). Moram fora do
kit de sempre porque são de um evento, e o evento é uma camada; a vitrine
dos testes é `window.aristoryHalloween` (`world/halloween/kit.ts`).

- **A abóbora esculpida** (`abobora.ts`, `LoteDeAboboras`): a esfera levada
  à superfície dos gomos (o vinco é uma POTÊNCIA do cosseno: costela gorda,
  sulco estreito), a cova em volta do cabinho, o vinco escurecido nos
  vértices, e a cor por cópia. A volta da casca é sempre múltipla de 16 (o
  dobro dos gomos): cai vértice no fundo de cada vinco. **A cara é colada
  na casca FACETADA**, e não na curva de verdade: dentro do vinco o
  triângulo passa por FORA da curva (é côncavo), e o olho que caía num
  vinco sumia debaixo dele. O ponto vem da grade da `SphereGeometry` (os
  quatro cantos do quadradinho), por isso há uma cara por tamanho. A beira
  clara da polpa e o furo escuro são a mesma malha, com a cor nos vértices
  (é ela que acende de noite). **Acesa** é `montar({ acesas: true })`: a cara
  troca para a geometria com o furo da cor da chama e o material
  `acesoPorVertice()` (chapado, sem luz), e o lote ganha o halo
  (`brilhoEmLote`) e a poça no chão à frente de cada cara — três lotes, a
  chama tremendo pela cor de cada cópia em `tremer(tempo)`. A boutique de
  Halloween já usa; o parque da noite (etapa 4) é o mesmo chamado. As
  lanternas de papel acendem com `luzDasLanternas()` (um halo da cor do
  papel em cada uma).
- **As luzinhas da festa** (`EnfeitesDePendurar.luzinhas(a, b)`): o fio e
  uma lampadinha em gota a cada 38 cm, alternando laranja, roxo e creme —
  a lâmpada é chapada (`acesoPorVertice()`, branca nos vértices e a cor da
  cópia), em dois lotes (soquete e lâmpada), e o halo de cada uma vem de
  `luzDasLuzinhas()`. De noite elas vão POR CIMA dos varais de bandeirola,
  ao lado do caminho (nunca atravessadas por cima dele).
  As duas luzes (`luzDasLanternas(forca, chao)` e `luzDasLuzinhas`) devolvem
  um grupo com o lote de halos e, com `chao`, o lote de POÇAS no chão
  embaixo (cor por cópia). Poça embaixo de TODA lampadinha somava num
  lençol de luz: a das luzinhas é uma a cada três.
- **Os morcegos voando** (`morcegos.ts`, `BandoDeMorcegos`): corpinho com
  orelhas num lote e as asas noutro, DUAS cópias por morcego (a esquerda é
  a direita espelhada na matriz, com material de dois lados); cada um num
  anel em volta do eixo, subindo e descendo, a asa batendo na raiz. Menor
  que 2,6× não se vê voando em volta da roda.
- **O Nessie aceso** (`NessieNoLago.acender()`): o vinil com um brilho
  fraco (0,16 — mais que isso ele desbota e perde o verde) e a poça verde
  na água, filha dele, com `renderOrder` acima da água.
- **O que se pendura** (`pendurados.ts`, `EnfeitesDePendurar`): balança no
  `Vento` do `core/shaders.ts` com a ALTURA NEGATIVA (o peso cresce para
  baixo da raiz, e a ponta de baixo é que voa). O papel recortado é um
  quadradinho com o desenho em canvas e `alphaTest`
  (`vento.material(cor, { mapa, recorte })`): a beirinha do papel, os
  olhinhos e o sorriso saem no desenho. O fantasminha, a lanterna e a
  aranhinha juntam as partes numa malha com a cor nos vértices.
- **As peças únicas** (`pecas.ts`): o fardo (palha em canvas com o UV por
  triângulo, fiapos em lote), o espantalho (a cara no `u = 0,25` da
  `SphereGeometry`, que é a frente), o arco de balões (lote com cor por
  cópia e um lote de brilho), as lápides em lote (a frente com a frase é um
  plano cuja textura tem a COR DO ISOPOR de fundo: o branco do material
  multiplica e a frente some na pedra), o lençol que cobre o telhado cônico
  da bilheteria, a plaquinha de recado (o texto é redesenhado quando as
  letras de mão do Bebito book terminam de carregar) e o pano de "FECHADO".
- **O Nessie de plástico** (`nessie.ts`): boia inflável — tubo de raio
  constante com costura em anel, corcovas de meio toro, válvula amarela,
  reflexo do vinil — numa malha `vinil` (é ela que acende de noite).
  `NessieNoLago` anda num ARCO do lago pela `naBeira` da água (pula o lado
  do trapiche) e deixa o rastro dos patos numa vaga própria.
- **Os infláveis gigantes** (`inflaveis.ts`): o que lê "inflável" é o
  GORDO sem quina, o reflexo do vinil (manchas acesas), a costura em anel e
  o pé (a saia no chão, o ventilador atrás e as quatro cordas até as
  estacas). Cada um junta as partes numa malha de cor por vértice dentro do
  grupo `corpo`, que balança a partir do pé (`InflaveisNoVento`). Cara colada
  em corpo torneado vai na superfície DELE (o raio do lençol na altura), e
  não numa esfera: abaixo do meio da cabeça o lençol é mais largo, e a boca e
  a gravata do fantasma sumiam dentro dele.
  São cinco: fantasma, gato, abóbora, aranha (pernas de `salsicha` dobradas
  no joelho) e morcego (a asa é um `Shape` de morcego extrudado com bisel
  gordo; a asa espelhada precisa da ordem dos triângulos invertida, senão
  sai do avesso). Para pôr no mundo, ache um gramado livre de verdade: as
  árvores do parque são sorteadas e têm `userData.peca = 'arvore'`, e um
  inflável a menos de ~3 m de uma delas sai com o tronco atravessado.
- **Repintar um lugar pronto** (`repintar.ts`): troca, por cópias, o material
  (com o `onBeforeCompile` junto — o `clone` não leva), a textura de canvas
  (pixel a pixel, mantendo a claridade relativa: a trama da lona continua), a
  cor por vértice e a cor por cópia dos lotes. Duas receitas: `trocaDeCores`
  (cor da paleta por cor da paleta) e `giroDeMatiz` (o gelo azul vira lilás).
  O original não é tocado — o material do cache do `toon()` é de todo mundo.
- **Cuidado com o `Math.pow` de número negativo**: `y / ALTO` de um vértice
  em `y = 0` sai `-1e-17`, e `pow(-1e-17, 2.4)` é `NaN` — a copa do chapéu
  de bruxa nasceu com a caixa envolvente quebrada. Prenda com `clamp`.

- **A boutique do Halloween** (`boutique.ts`): o cacho de BEXIGAS DE
  CAVEIRA (a cara pintada em canvas no UV da esfera — a frente `+Z` é
  `u = 0,25` —, o grupo `bexigas` balança com `balancarBexigas`), o caldeirão
  de balas (as balas em lote, cor por cópia), a caixa de presente (a tampa
  num grupo `tampa`, a etiqueta com o nome em canvas), a cestinha de abóbora
  e o mapinha enrolado (os modelos de mão), a meia, o pote de biscoitos, a
  placa do provador e a mantinha. Alturas de móvel (o balcão, a mesa, o
  busto) a camada MEDE pela caixa da peça (`userData.peca`), em vez de
  cravar número.

- **O carrinho de poções do Noel** (`carrinhoDePocoes.ts`, a peça mais
  detalhada do kit — o Renan pediu, e ela é vista de perto na conversa com
  zoom): o molde de **carrinho de feira**. A caixa de tábua PINTADA traz a
  cor no canvas (as estrelinhas são mais claras que o roxo; textura
  multiplicada só escureceria), o painel da frente e a placa são canvas com
  a letra de mão redesenhada quando a fonte carrega (`canvasComLetra`). As
  RODAS ficam nas pontas (o eixo em `X`), e não na frente: assim o balcão e o
  painel ficam inteiros para a câmera. O toldo é um plano em ARCO (a altura
  sai de `alturaDoToldo(x)`) com o lambrequim de ondas seguindo o arco e um
  pompom no fundo de cada onda. **Quem trabalha nele fica DO LADO, fora do
  toldo** (`ladoDoNoel`): a regra do posto, "nada acima e à frente". A
  altura do toldo foi conferida contra a câmera de 34°: com a beira a 2,3 m,
  as garrafas do fundo aparecem por baixo do lambrequim.
- **Vidro em lote, à mão**: a `fundir()` não junta transparente (a ordem de
  pintura importa), então 30 garrafas seriam 30 desenhos. Dentro de um lote
  de vidros iguais a ordem não aparece: a classe `Juntar` junta o vidro de
  todas numa malha, e a bebida noutra — acesa por dentro com
  `acesoPorVertice()` e a cor por vértice (mais escura no fundo), cinco
  cores num desenho só. Cada feitio é um perfil torneado (`FEITIOS`); a
  bebida é o mesmo perfil um tico menor, cortado na altura de "cheio".
- **O que mexe é lote ou malha com nome**: as bolhas subindo no balão, o
  vapor (halos do `brilhoEmLote`, a força na cor por cópia — a soma é
  aditiva, então "apagar" é pintar de preto), a chama da lamparina
  (`chama-da-lamparina`, escala tremendo) e a gota que pinga da serpentina.
  `PocaoBorbulhando` é a mesma ideia para encher um caldeirão qualquer: o
  disco aceso (miolo claro, beira escura), as bolhas que estufam e estouram
  e a luz verde no chão.
- **A barraquinha de cachorro-quente do Walter** (`barracaDoWalter.ts`):
  o molde de **barraca com balcão onde alguém trabalha ATRÁS** (o carrinho
  do Noel é o de quem fica do lado). O toldo de duas águas é alto (beira
  em 2,35) e o beiral da frente é curto (15 cm além do tampo): a regra do
  posto pela conta da câmera. O que se lê de longe é o CACHORRO-QUENTE
  GIGANTE na cumeeira (pão, salsicha, molhos em zigue-zague como tubos em
  `CatmullRom`, carinha e faixa de múmia) e o painel pintado; o que se lê
  de perto é o balcão inteiro — e de cima ele tem que caber por baixo do
  toldo: chapa e cubas no fundo do tampo, bisnagas e prontos na beira. As
  salsichas da chapa são um lote que ROLA (um quarto de volta de cada vez,
  como alguém virando com a espátula); os grãos das cubas e a batata palha
  são lotes com cor por cópia; o vidro do pote fica numa malha com nome.
  `aberta = false` monta o balcão vazio (o convite), e a cena põe o pano de
  "FECHADO" (`panoDeFechado`) só na BEIRA do tampo — puxado para trás, ele
  atravessava a chapa. As tábuas pintadas trazem a cor no canvas
  (`tabuasVermelhas`), como as do carrinho do Noel. O halo da lâmpada
  embaixo do toldo fica pequeno (0,75): somado com as luzinhas da beira,
  o maior estourava o toldo em branco. As miudezas de cor lisa passam pela
  `juntarPorCor` (`world/fundir.ts`, a mesma do balcão de tingimento): 56 →
  25 malhas, a mesma imagem. Para o gigante do telhado entrar nela, ele NÃO
  tem nome (nome é fronteira): o teste o acha por `userData.gigante`. E o
  lugar dela na praça foi escolhido de cima (`setCameraOmbro` a 20–30 m,
  olhando para baixo): no meio do calçamento ela tapava a bilheteria do
  Cookie, e no primeiro canto o cordão de luzinhas entre dois postes
  passava por cima dela.
- **O canteiro de abóboras e a bacia de maçãs** (`pecasDaFesta.ts`): o
  canteiro diz ONDE as abóboras crescem (`aboboras`, no referencial dele) e
  a cena as põe no lote do parque — acesas e tremendo com as outras, sem
  desenho a mais. A folha de abóbora é uma forma de cinco lobos em concha; a
  rama é um tubo pelo caminho de uma abóbora a outra, com as folhas e as
  gavinhas (tubo em mola) ao longo dela. A tina tem as frestas das aduelas
  como fios que SEGUEM a barriga (uma caixa reta afundava no meio e boiava
  nas pontas); as maçãs boiam num lote (cor por cópia), com o caixote ao
  lado no mesmo lote e a marolinha em volta de cada uma.

## Depois de criar

Use a peça em pelo menos uma cena e rode o smoke test para ver como ela fica de
verdade (`.claude/skills/aristory-testar`). Peça que ninguém usa não entra no kit.
