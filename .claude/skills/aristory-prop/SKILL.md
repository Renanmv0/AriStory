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
   Use `textSign('Clube!')` sempre que uma placa precisar ser legível.
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

## Depois de criar

Use a peça em pelo menos uma cena e rode o smoke test para ver como ela fica de
verdade (`.claude/skills/aristory-testar`). Peça que ninguém usa não entra no kit.
