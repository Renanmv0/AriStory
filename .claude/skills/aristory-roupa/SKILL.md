---
name: aristory-roupa
description: Adicionar uma peça nova ao guarda-roupa do AriStory a partir de uma foto, ilustração ou descrição — vestido, roupa de baixo, chapéu, bota, meia. Use quando pedirem "faz essa roupa para o armário", "adiciona essa peça" ou para ajustar algo já vestido (manga comprida demais, braço torto, cobrindo peça errada).
---

# Adicionar uma peça ao guarda-roupa

> **Junto desta skill, carregue as `threejs-*` da tabela "REGRA DE TODA
> TAREFA" do `CLAUDE.md`** (`geometry`). Elas são a técnica; esta é a regra do
> jogo. Peça feita só de caixa lisa é o jeito antigo.

Roupa é **item do inventário**, não parte fixa da ficha do personagem. O
pipeline inteiro:

1. `src/world/roupas.ts` — a GEOMETRIA da peça (uma função por peça).
2. `src/world/itens.ts` — a FICHA (`ItemDef`) que liga a geometria a um id,
   nome, ícone, cor e slot; entra no catálogo `ITENS`.
3. `src/palette.ts` — as cores novas, com nome e um comentário de onde vieram.
4. `src/scenes/quarto.ts` — `ROUPAS_DO_ARMARIO` estoca a peça; o armário
   abastece os DOIS personagens a cada abertura, então uma entrada só já
   basta para os dois poderem vestir.
   **Peça que se GANHA jogando fica fora dessa lista** — a lista é o que o Ari
   já tinha, e prêmio que aparece de graça deixa de ser prêmio. Há dois jeitos
   de repor uma peça ganha, e o segundo é o bom:

   - por `flag`, no mesmo laço do armário (a gravatinha do Walter,
     `gravata-do-walter`). Simples, mas só vale no quarto: quem abrir o
     espelho da boutique não vê a peça;
   - por `save.premios`, reposto em `Game.reporPremios()` (os quatro prêmios
     da arena de ping pong). É o gêmeo do `reporCompras` da boutique, e vale
     nos DOIS painéis, porque os dois entram por `g.abrirGuardaRoupa()`.

   **Prêmio novo: uma chamada só, `g.ganharPeca(peca)`.** Ela faz o segundo
   jeito inteiro de uma vez — anota em `save.premios` e guarda nos dois na
   hora — e é o que os marcos da estufa usam (chapéu de jardineira, avental
   da Josefina). Cuidado: numa peça de TRONCO, `cor` pinta a camiseta e
   `corDetalhe` pinta a MANGA — peça que vai POR CIMA (o avental) não leva
   nenhuma das duas, senão a primeira foto sai de manga verde.
5. `scripts/roupas.mjs` e `scripts/vestimenta.mjs` — asserções que provam que a
   roupa não quebrou a animação, não nasceu no lugar errado e não escapou das
   regras de armazenamento.

Nenhuma peça de roupa é modelada dentro de uma cena, e nenhuma tem estado
próprio: tirar e recolocar já vem de graça do sistema de inventário.

## Onde uma peça pode morar — são TRÊS lugares

| lugar | o que aceita | quem mexe |
|---|---|---|
| **mochila** (10 vagas) | item de mão e vestimenta **funcional** | o jogador, em qualquer lugar |
| **corpo** (6 vagas) | qualquer vestível, na vaga da parte dele | o painel do armário |
| **guarda-roupa** (lista) | roupa **cosmética** que não está no corpo | o painel do armário |

A regra em uma frase: **roupa cosmética nunca ocupa vaga de mão.** Ela vive no
armário ou no corpo, e só se troca no móvel. Fora do armário, a única coisa que
dá para fazer com uma roupa vestida é **descartar** — o painel da mochila marca
essas vagas com um cadeado e recusa o arrasto com um aviso.

Isso é o que resolveu os bugs de peça duplicada, de sumiço e de mochila entupida
de vestido: antes a mesma peça transitava entre as vagas de mão e o corpo, e
cada caminho de escrita tinha a sua própria ideia de onde ela estava.

### A exceção: `funcional: true`

Vestimenta que muda o JOGO, e não só a aparência, é equipamento e viaja na
mochila. Hoje são os patins (1,3x de velocidade). Na ficha:

```ts
patins: {
  id: 'patins', nome: 'Patins', icone: '🛼',
  tipo: 'vestivel', slot: 'pes',
  funcional: true,   // por isso cabe na mochila e se calça em qualquer lugar
},
```

Sem a marca, a peça nasce **cosmética** — que é o caso comum e o certo para
qualquer roupa nova vinda de foto.

### O que isso muda para quem escreve uma peça nova

Quase nada: `g.storeItem(peca, quem)` continua sendo a chamada, e é ELE quem
sabe se a peça vai para o armário ou para a mochila. Por isso `quarto.ts` não
mudou uma linha quando a regra mudou. Do lado do motor, quem lê o armário é
`g.wardrobeItems(quem)`.

## As 6 vagas SÃO as 6 partes do corpo

`SlotRoupa = 'cabeca' | 'tronco' | 'pernas' | 'pes' | 'maos' | 'acessorio'`
(`src/core/types.ts`). Cabeça e pé convivem com qualquer coisa (são vagas
diferentes); dois chapéus não convivem. Toda ficha vestível declara `slot` —
é ele que decide a vaga, não uma escolha da tela.

As duas últimas vieram depois, a pedido do Renan:

- **`maos`**: luva, pulseira, anel. Pendura no pivô de CADA braço (y = 0 no
  ombro); o pulso fica em `~0,8·m.armLen` e a mão em `0,92·m.armLen`. Peça de
  um pulso só monta no `lado === -1` e devolve grupo vazio no outro (a mão
  direita é a que segura sorvete e regador). Sai no traje de banho.
- **`acessorio`**: o que é pequeno e vai em QUALQUER parte do corpo —
  presilha, adesivo, broche. A ficha diz onde prende com `presoEm`:
  `'cabeca'` (referencial da cabeça) ou `'corpo'` (o padrão, referencial do
  tronco, y = 0 no chão). Fica no traje de banho, como o gorro.

A ordem só cresce no FIM: save antigo de 4 vagas abre com 6, e a cabeça
continua na vaga 0. Exemplos prontos: `luvasDeJardim`, `pulseiraDeMicangas`,
`presilhaDeEstrela`, `adesivoDeCoracao` (`roupas.ts`), na arara "Frio, pé e
miudezas" da Estella. Teste: `scripts/vagas.mjs`.

## A ficha (`ItemDef`, em `src/world/itens.ts`)

```ts
vestidoRosa: {
  id: 'vestido-rosa',
  nome: 'Vestido rosa de babados',
  icone: '👗',                 // emoji, sempre
  tipo: 'vestivel',
  slot: 'tronco',
  cor: P.vestidoRosa,          // pinta a parte PRINCIPAL da malha do slot
  corDetalhe: P.vestidoRenda,  // pinta a manga (tronco) ou a barra (perna/pé); sem isto usa `cor`
  nota: 'da vitrine que o Renan viu',
  bracosNus: true,             // ver "Pele à mostra"
  pernasNuas: true,
  extra: vestidoRosa,          // a geometria — importada de roupas.ts
},
```

Vestível **sem** `extra` (a camisa listrada, a calça jeans) só repinta a
malha que já existe no corpo — sem geometria nova, é a coisa mais barata que
dá para fazer, e é a primeira pergunta antes de desenhar algo: "dá para
resolver só com cor?"

## O referencial muda por slot — decore esta tabela antes de desenhar

| slot do `extra`/`extraBraco` | pai | y = 0 fica em | por quê |
|---|---|---|---|
| `cabeca` | `this.head` | centro do crânio | onde o chapéu de campeão já mora |
| `pernas` / `pes` | pivô de CADA perna (2 cópias) | quadril | onde o patins e o cano da bota já moram — a peça dobra junto com a coxa |
| `tronco` | `this.body` | **o CHÃO**, não o quadril | onde a jaqueta e o calção de banho já moram |
| `maos` | pivô de CADA braço (2 cópias) | ombro, braço pendendo em `-Y` | luva e pulseira acompanham o balanço e a pose |
| `acessorio` | a cabeça ou o corpo (`presoEm`) | o da cabeça ou o do tronco | a peça pequena escolhe onde prende |
| `extraBraco` | pivô de CADA braço (2 cópias) | ombro, braço pendendo em `-Y` | acompanha o balanço da caminhada; use para manga que passa do cotovelo |

`extra`/`extraBraco` **nunca** recriam braço ou perna — a peça entra como
IRMÃ do que já existe. Recriar membro é a única coisa de fato proibida aqui:
quebraria a matemática de rotação da caminhada e da natação.

A função sempre devolve uma malha NOVA (nunca reaproveite a instância): o
slot `pernas`/`pes` pendura uma cópia em cada perna, e um `Object3D` não pode
ter dois pais.

## A pegadinha do sinal — já mordeu quatro vezes

Perna e braço **esquerdos** nascem em `x` NEGATIVO. `rotation.z` positivo
neles empurra PARA DENTRO do corpo, não para fora. Qualquer peça que se
desloque para o LADO (manga bufante, aba de quimono, cano de bota alargado)
recebe um parâmetro `lado: -1 | 1` e MULTIPLICA o deslocamento por ele:

```ts
function mangaDeQuimono(m: MedidasCorpo, lado: -1 | 1): THREE.Object3D {
  const paraFora = lado * h * 0.052 * w;   // sem o `lado`, um braço fica torto
  // ...
}
```

Sem isso a cópia da esquerda desloca para dentro em vez de para fora, e SÓ
um dos dois braços fica torto — o tipo de bug que passa direto pela foto de
frente e só aparece girando a câmera. Aconteceu no frisbee, no personagem
sentado, na patinação e na manga do quimono nesta mesma base de código.

## Moda praia: `corBanho` e `estampaBanho`

No traje de banho (`outfit: 'banho'`, hoje só o clube) o corpo inteiro vira
pele e a única peça que sobra é o **calção**. Quem manda na cor dele é a peça
da vaga `pernas` — a mesma vaga da calça, só que noutro traje:

```ts
bermudaEstampada: {
  id: 'bermuda-estampada', nome: 'Bermuda estampada', icone: '🌺',
  tipo: 'vestivel', slot: 'pernas',
  corBanho: P.bermudaEstampa,        // o calção
  estampaBanho: P.bermudaEstampaFaixa, // as duas faixas
  // repare: SEM `cor`
},
```

A ausência de `cor` é o truque, e não um esquecimento: é ela que diz ao rig
"isto é uma bermuda". No clube (traje `banho`) ela pinta o calção, sem
camiseta. FORA do clube — pedido do Renan: usar o shorts no parque e nos
outros lugares — o rig veste o MESMO calção e as mesmas pernas de shorts do
banho por cima da perna de pele, com a camiseta de sempre
(`aplicarVisual`, "a bermuda na rua"). Zero geometria nova. Peça que declara
`cor` numa vaga de pernas continua sendo calça: pinta a perna inteira.

### O que fica no corpo DENTRO do clube: `praia`

No banho, de roupa, só sobram a cabeça, o acessório e o calção — bota, luva e
camiseta são de rua. A peça feita para a beira da piscina leva **`praia: true`**
na ficha e continua no corpo lá dentro: o chinelo, a boia de braço, o colar de
flor, a estampa da bermuda. Camiseta **nunca** leva a marca: no clube é sem
camiseta e de shorts (pedido do Renan).

- **Bermuda estampada nova** = `corBanho` (o pano) + `corDetalhe` (a tinta da
  estampa) + as duas fábricas de `bermudaDe(estampa)` em
  `world/roupasDePiscina.ts`: `extraQuadril` (a estampa do CALÇÃO, pendurada no
  corpo, y = 0 no chão) e `extra` (a da perna do shorts, no pivô de cada
  perna). Os ajudantes `noCalcao`/`naPernaDoShort`/`anelNoCalcao`/`anelNaPerna`
  sabem as medidas do calção do rig — é por eles que a estampa encosta no pano.
- **Chinelo** = vaga `pes` com `pesNus: true`: o pé do rig vira PELE e a peça é
  só a sola e a tira (`chinelo(modelo)`).

## O vestiário do clube é um guarda-roupa com duas abas

Pedido do Renan: o vestiário é o MESMO painel do guarda-roupa de casa e do
espelho da Estella (`g.abrirVestiario()` → `ui.abrirArmario('vestiario')`),
com o nome "Vestiário" e duas abas:

- **Guarda-roupa**: igual ao de casa — vestir e tirar.
- **Roupas de piscina**: a vitrine de `MODA_PRAIA` (`world/itens.ts`) por
  parte do corpo, com o boneco de TRAJE DE BANHO (o botão embaixo dele troca
  para a roupa de rua) e a ficha da peça provada. **Desbloquear é comprar**
  (`comprarPeca`, a mesma da Estella e da Josefina), a até R$ 20 cada: a peça
  vai para o guarda-roupa dos dois e vira estoque de TODO guarda-roupa
  (`reporCompras`). Depois o mesmo botão veste e tira ali mesmo.

Peça de piscina nova = a ficha em `ITENS` (com `preco` até 20, e `praia` se
ela deve ficar no corpo dentro do clube) + uma entrada em `MODA_PRAIA`, na
parte do corpo dela. O painel desenha por essa lista; a cena não precisa de
nada. As cinco peças que o vestiário antigo dava de graça (`MODA_PRAIA_ANTIGA`)
continuam de quem já tinha (`herdarModaPraia`, no `Game`).

**Óculos é acessório** (`slot: 'acessorio'`, `presoEm: 'cabeca'`), para ir
junto com chapéu — pedido do Renan. Save antigo com o óculos na vaga da
cabeça muda ele de vaga sozinho; se o acessório já estava ocupado, a peça que
sobra vai para o guarda-roupa (`SaveState.normalizar`).

## O vestiário da ESCOLA: a aba dos uniformes

A porta do fundo do ginásio da escola (`scenes/escolaGinasio.ts`) abre o
MESMO painel em modo `escola` (`g.abrirVestiarioDaEscola()` →
`ui.abrirArmario('escola')`): a aba do guarda-roupa de sempre e a dos
**Uniformes** — `UNIFORMES_DA_ESCOLA` (`world/itens.ts`), que é tudo o que
`PREMIOS_DA_APOSTILA` dá, mais a roupa de cheerleader da festa do fim do
módulo (`PREMIOS_DA_FESTA`, com o `comoGanhar` "ganha ao terminar o
módulo"). Sem preço, sem traje de banho, sem carteira: a peça que ainda não
foi ganha aparece trancada dizendo onde se ganha, e a ganha se VESTE ou se
TIRA com um clique (`alternarUniforme` no `Game`). Uniforme novo = a peça
ganha como prêmio (de lição ou de festa) e uma linha na lista; a aba se
desenha sozinha.

## O boneco de prova não pode crescer sozinho

O boneco do armário e da loja é um `<canvas>` com renderer próprio
(`characters/Previa.ts`). No iPhone ele dava "zoom" sem parar ao trocar de
peça, até travar o painel: o canvas tem 2x mais pixels que o tamanho na tela
(o `pixelRatio`), o Safari usava esses pixels para medir o painel, o painel
esticava o canvas, e o quadro seguinte dobrava de novo. A primeira trava
(`contain: size` no canvas) NÃO segurou no Safari. O que segura, em
qualquer navegador:

- o canvas mora numa `.moldura` (`position: relative`, com o `min-height`, o
  `max-height` e o fundo), e ele fica `position: absolute; inset: 0` lá
  dentro — elemento absoluto não entra na medida de ninguém;
- o `Previa.desenhar` mede a MOLDURA (`canvas.parentElement`), nunca o
  próprio canvas, com teto de 2048, e compara em pixels do aparelho antes do
  `setSize`.

Forçando o canvas a medir pelo tamanho interno, ele ia de 2 mil a 33 milhões
de pixels em dois toques; com a moldura, fica parado. Canvas novo dentro de
painel segue o mesmo molde.

## O painel do guarda-roupa: o boneco nunca sai da tela

Pedido do Ari, que joga pelo celular: rolando a lista, o boneco sumia e não
dava para ver a roupa mudar. O painel (`.armario` em `Ui.ts` e no
`style.css`) tem altura FIXA e duas metades:

- a **prova**, parada: o palco do boneco no meio e as 6 vagas em volta, cada
  uma na altura da parte do corpo (cabeça/acessório no alto, tronco/mãos no
  meio, pernas/pés embaixo). As vagas continuam filhas do `.corpo`, na ordem
  de `SLOTS_ROUPA` (os testes leem assim); `display: contents` as põe na grade;
- a **lista**, a única coisa que rola: o filtro por parte do corpo
  (`.filtro`, "Tudo" + as 6 partes com a contagem) grudado no alto, e as
  seções por parte. O filtro é só CSS (`data-filtro` na `.lista`).

No computador e no celular deitado as metades ficam lado a lado; no celular
em pé, a prova em cima e a lista embaixo. O cartão da peça é a amostra na COR
dela (`corDaPeca`: `cor ?? corBanho ?? amostra`) com o ícone e o nome — a
`nota` saiu do cartão e aparece na legenda embaixo do boneco quando a peça
entra no corpo. Dentro de cada parte, as peças vêm em ordem alfabética
(`porNome`, comparação em pt-BR). Os dois nomes no alto (`.quem`) trocam de pessoa: é o T de
quem não tem teclado. A vaga vazia abre o filtro daquela parte; a cheia tira.
Peça nova não pede nada disso: o painel se desenha pela ficha.

Com a moldura alta e fina, o `Previa` recua a câmera até caber a LARGURA do
boneco (o cabelo do Ari e os braços abertos), não só a altura.

## Pele à mostra: `bracosNus` e `pernasNuas`

A peça não pode dizer "cor de pele" — a pele é do personagem
(`spec.skin`), não da roupa. Os dois campos do `ItemDef` avisam o rig para
usar o material de pele em vez da cor da peça:

- `bracosNus`: a manga (o `detalhe` do `tronco`) vira pele. Para top sem manga
  e vestido de alça.
- `pernasNuas`: a perna vira pele. Para vestido, saia e short.

**Cuidado**: `pernasNuas` mora numa peça de TRONCO mas pinta uma malha de
PERNAS — o rig resolve isso olhando o loadout inteiro (`mostraPele()`), não
o slot isolado. E uma meia vestida (`slot: 'pernas'`) sempre ganha da marca:
"perna nua" quer dizer "o vestido não cobre", não "nada pode cobrir".

**A exceção é a SAIA**: ela mora na vaga das pernas e é ela mesma quem deixa
a perna nua — o `mostraPele` aceita a marca quando a peça das pernas é a
própria dona dela (`this.roupa.pernas === peca`). Sem isso a saia achava que
"tinha uma calça vestida" (ela) e pintava a perna da cor da saia.

- `peitoNu`: o TRONCO da cápsula vira pele. Era da camiseta solta (o casco é a
  roupa); agora é também de todo vestido de DECOTE da boutique: a casca do
  corpete (`corpete()`, em `roupasDaBoutique.ts`) é a roupa, e o colo acima do
  decote é pele de verdade.

## Peças fixas da ficha que a roupa nova precisa esconder

O laço, o cinto, a listra da camiseta, o casco/capuz da jaqueta e a mochila
já existem na ficha de cada personagem e não desaparecem sozinhos quando
uma roupa nova entra. Eles moram em `sobreTronco` (`CharacterRig.ts`) — uma
lista de objetos que somem quando `this.roupa.tronco` está ocupado. **Peça
de tronco nova que deveria cobrir o corpo inteiro** (vestido, macacão) já
ganha isso de graça; se descobrir uma peça fixa que ainda vaza por cima
(aconteceu com a mochila do Renan, que cruza o peito por cima de vestido),
adicione o objeto em `sobreTronco` no construtor.

## O ateliê de tingimento: TODA peça nova tem que aceitar tinta

Pedido do Ari (pelo Renan): mais cores sem mais modelos. O balcão de tinta do
mezanino da boutique (`world/balcaoDeTingimento.ts`) abre o ATELIÊ: o painel
do guarda-roupa em modo `atelie` (`ui/atelie.ts`), com as roupas da pessoa,
a cartela de 57 tintas (`CARTELA_DE_TINTAS`, cores `P.tinta…`) e os botões
"Cor principal" e "Detalhes". As regras (`world/tintas.ts`):

- tingir é vestir uma CÓPIA da ficha com `cor` (ou o `corBanho` da
  bermuda) e/ou `corDetalhe` trocados (`fichaTingida`). O id não muda;
- a tinta é POR PESSOA (`save.tintas[quem][id]`), e o rig refaz só a vaga
  que mudou (`tintaNaVaga`, `chaveDaTinta`);
- desbloqueia uma vez, por R$ 50 (`FLAG_DO_ATELIE`);
- prêmio de personagem e uniforme não se pintam (`PECAS_SEM_TINTA`, que lê
  as listas de prêmio — prêmio novo numa delas já fica de fora sozinho), e
  nem as temáticas de cor cravada (tiara do Walter, boné da Gina);
- o botão "Detalhes" só aparece se a peça tem `corDetalhe` E o modelo pinta
  com ela (`DETALHE_FIXO` lista as que desenham o detalhe fixo).

**O que isso pede de peça nova**: a geometria LÊ a cor principal da ficha
(`peca?.cor`), e o detalhe de `peca?.corDetalhe` — exatamente a regra da
seção de baixo. Peça que crava `P.algumaCor` por dentro aparece no ateliê e
não muda: o `scripts/tinta.mjs` veste cada peça, pinta e reprova a que não
responde (a gargantilha e o chinelo slide eram assim, e foram corrigidos).
Prêmio novo entra numa lista de prêmio; peça de cor-identidade, em
`PECAS_SEM_TINTA`.

**Acessório e peça de mão também levam `cor`** (pedido do Ari: pintar pins,
óculos e pulseiras). Na vaga `acessorio` e `maos` a `cor` não pinta o corpo —
só existe malha de troca no tronco, nas pernas e nos pés —, então ela é
simplesmente a cor principal da peça, e a `amostra` sai (a das lojas é
`cor ?? corBanho ?? amostra`). Escolha como `cor` a que dá a cara da peça
(a da amostra antiga, para a loja não mudar). Peça de MUITAS cores (a
pulseira de flores, a de pedrinhas, o colar havaiano) passa pelo
`tintaDeMuitasCores(peca, padrao)` (`roupasDoJardim.ts`): na cor de sempre
ela volta `null` e a peça desenha as cores da paleta; pintada, devolve a tinta
em dois tons alternados.

**Mochila é acessório preso no corpo, com `nasCostas: true`** (pedido do Ari:
a de casco da Josefina era tronco e só ia com a camiseta padrão). A marca faz
o rig esconder o que a ficha pendura nas costas (`nasCostasDaFicha`: a
mochila preta e o capuz do Renan — o laço do casco sumia dentro do capuz),
e a geometria usa `m.porBaixo` para o casco recuar até as costas do moletom e
as alças passarem por fora no peito.

## A MESMA peça em outra cor: o jeito mais barato de ter roupa nova

A `extra` recebe a FICHA como terceiro argumento (`extra(m, lado, peca)`), e é
dali que a geometria tira a cor:

```ts
function gorroDeLa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef) {
  const la = toon(peca?.cor ?? P.roupaLa);            // a da paleta é só o PADRÃO
  const laBarra = toon(peca?.corDetalhe ?? P.roupaLaBarra);
```

**Este é o primeiro lugar onde olhar antes de desenhar qualquer coisa.** Hoje
o gorro, o cano da bota e o vestido de babados já obedecem a ficha, então um
gorro novo, uma bota nova ou um vestido novo custam UMA ENTRADA em `ITENS` e
duas cores na paleta — nenhuma geometria. Foi assim que as vinte peças da
boutique entraram.

**A armadilha, e ela já mordeu**: geometria que crava `P.algumaCor` por dentro
ignora a ficha em silêncio. Quatro vestidos de cores diferentes na arara
apareciam os quatro rosa, e o painel mostrava a amostra certa ao lado do boneco
errado — parecia bug de painel e era de geometria. Ao reaproveitar uma peça
para uma cor nova, CONFIRA se a fábrica lê `peca.cor`; se não lê, faça ela ler.

E quando uma peça tem mais cores do que as duas da ficha (o vestido usa pano,
renda e fita), a terceira sai de conta em cima da primeira —
`new THREE.Color(pano).multiplyScalar(0.74)`. Peça que veio de FOTO não entra
nessa conta: ela passa as cores exatas por um ponto de entrada próprio
(`vestidoRosa` vs `vestidoDaLoja`), senão a peça de referência muda junto com
a variação nova.

## Pôr a peça à venda na lojinha da Josefina (estufa)

Roupa de JARDIM vai para `ROUPAS_DA_JOSEFINA` (`world/itens.ts`), e não para
uma arara da Estella: é a aba de roupas da banca da estufa. Precisa de `preco`
como qualquer peça à venda. A compra é `g.comprarPeca` (o mesmo caminho da
boutique) e "provar no boneco" abre a arara da boutique com essa lista — então
peça nova ali não pede código nenhum além da ficha e da entrada na lista.

## Pôr a peça à venda na boutique

## Pôr a peça como PRÊMIO de um desafiante da arena

`world/itens.ts` tem o `PREMIOS_DA_ARENA`: um id de desafiante do quadro de
inscrições (`world/adversariosData.ts`) para a lista de peças que ele dá. Uma
entrada nova ali é tudo — o painel desenha a etiqueta sozinho, o clique grava
em `save.premios` e `reporPremios` repõe para sempre nos dois guarda-roupas.

A peça só abre quando a flag `batido-<id>` existir, e quem a grava é o fim da
partida em `scenes/villaLobos.ts`. Prêmio NÃO leva `preco`: ele não está à
venda em lugar nenhum.

O conjunto da Estella são quatro peças de uma vez (uma por vaga do corpo) e o
do Mano é um par de patins — este último é o único caso em que a ficha manda no
modelo do RIG e não num `extra`: ver `enfeite`, em `core/types.ts`.

## Pôr a peça como PRÊMIO de um turno do Mania

`PREMIOS_DO_MANIA` (`world/itens.ts`): o NÚMERO do turno para as peças. O
Walter entrega na primeira vez das três estrelas daquele turno
(`darOPremio`, em `scenes/maniaDeChurrasco.ts`, com `g.ganharPeca`), e o
`reporPremios` repõe. A geometria mora em `world/roupasDoMania.ts`. O turno 1
não está na lista: a gravatinha é de antes da temporada e volta pela flag.

Prêmio de DUAS peças que vestem juntas (o do turno 3): cada uma na sua vaga
— o lápis na orelha é `acessorio` com `presoEm: 'cabeca'` (ele pousa onde o
cabelo termina, `m.cabelo`), e o bloquinho é `maos`, montado só no braço
esquerdo (`lado === -1`). O colete (turno 4) é o `corpete` da boutique com
o decote em V e PINTA a camiseta de branco pela ficha (`cor`/`corDetalhe`):
a camisa é o corpo do rig, o colete é a geometria.

O avental de garçom (turno 2) é o molde de peça COMPRIDA por cima da roupa:
um PAINEL de `saiaViva` (`arco`, aberto atrás) para a perna não atravessar,
e o bordado na TEXTURA do pano, com o UV refeito de 0 a 1 no painel — um
"Mania" de geometria ficaria parado no ar enquanto o pano anda. E ele é
ACESSÓRIO com `presoEm: 'corpo'`, não tronco: nasceu tronco, e o Renan
reparou que aí não dava para usar com mais nada. **Peça que vai POR CIMA
da roupa (avental, faixa, capa) é acessório preso no corpo** — o
referencial é o mesmo do tronco (y = 0 no chão), então a geometria não muda,
e o save antigo muda a peça de vaga sozinho (a vaga sai do catálogo).

Por cima de vestido rodado, a peça precisa saber o que está por baixo: o
rig mede a geometria do tronco vestido (triângulo por triângulo, os enfeites
em lote também) e entrega ao acessório do corpo em `m.porBaixo(angulo, y)`.
O avental usa isso para cair como pano — cortina por cima do babado e reto da
cintura até o ponto mais largo — e o rig refaz o acessório quando a roupa de
baixo troca. Medir só os VÉRTICES não serve: o cilindro de uma saia tem
vértice só em cima e embaixo, e os laços da barra furavam o avental em
pontinhos brancos. Teste: `scripts/avental.mjs`.

Os prêmios dos turnos 5 e 6 são o molde de peça de CABEÇA que cobre o
cabelo e de UNIFORME branco:

- **a bandana de churrasqueiro** (`cabeca`) é uma calota de grade própria
  cujo raio em cada altura é o do CABELO (`m.cabelo(te)`), não o do crânio:
  ela cobre os cachos inteiros, desce pouco na frente (acima da sobrancelha)
  e mais na nuca, onde mora o nó com as duas pontas. O pano (o vinho com as
  gotas douradas) é canvas com três voltas em torno da cabeça;
- **o dólmã** (`tronco`) pinta o corpo e as mangas de branco pela ficha e
  põe o TRANSPASSE como um painel do `corpete` só de um lado (a função do
  decote devolve a barra fora do painel: coluna de altura zero), com o vivo
  preto na beira, duas fileiras de botões e a gola padre torneada;
- **o chapéu de cozinheiro** (`cabeca`) pousa por cima do cabelo pela conta
  dos chapéus da boutique (`alturaDaAba`, agora exportada) e as pregas são o
  `gomos` do torno, mais fundas onde o pano estufa. De costas, prega rasa
  some: 0,1·headR é o que lê.

Teste: `scripts/turnos56.mjs` (as fotos de frente e de costas nos dois).

## Pôr a peça como PRÊMIO de uma lição da apostila do Gatito

O mesmo molde, noutra lista: `PREMIOS_DA_APOSTILA` (`world/itens.ts`), do `id`
da lição para as peças. O Gatito entrega no fim da aula
(`entregarPremio` em `scenes/escolaAula.ts`, com falas e o `g.ganharPeca` de
cada peça) e marca a flag `premio-da-licao-<id>`; o `reporPremios` repõe — e dá
a quem já tinha concluído a lição antes de o prêmio existir. O da lição 3 é o
UNIFORME DOS GATITOS inteiro (sete peças). Teste: `scripts/uniforme.mjs`.

## Pôr a peça à venda na boutique

`preco` na ficha é o que coloca a peça numa arara — sem ele, ela não está à
venda em lugar nenhum (é o caso de tudo o que já estava no armário do Ari, da
moda praia e do prêmio do Walter; não existe "preço 0").

Depois, a peça entra numa fila de `ARARAS_DA_ESTELLA` (térreo),
`PREMIUM_DA_ESTELLA` (mezanino), ou nas duas vendas avulsas do mezanino —
`JOIAS_DA_ESTELLA` (a vitrine de joias) e `CHAPEUS_DA_ESTELLA` (a mesa de
chapéus e bolsas) —, em `world/itens.ts`. A cena LIGA por essa
lista e o painel DESENHA por ela — a `lojinha.ts` não sabe quanto custa um
vestido, sabe onde fica a arara.

Escala de preço, na mesma régua do resto do jogo (bilhete da roda = 24, prato
do Mania = 12 a 34, um turno de garçom paga ~200): peça de térreo 35–110,
premium 150–220. Quem compra veste no espelho do mezanino, que abre o mesmo
painel do guarda-roupa do quarto.

**A outra loja é a da Josefina**, na estufa: a lista é `ROUPAS_DA_JOSEFINA`
(mesmo arquivo), com roupa de jardim e peças temáticas do parque, do clube e
dos personagens (tiaras do Walter e do Pelusa, boné da Gina, camisetas do Capy,
da roda e do Noel). Preço em reais, 35–60. Mesma ficha e mesmo
`g.comprarPeca`; só muda a lista. **E a peça entra em `LOJA_ABRE`
(`minigames/jardim/premios.ts`)** com a onda em que a Josefina passa a
vendê-la: o recorde da dupla na rodada do jardim destranca a banca aos poucos
(sem entrada ali, a peça vende desde o começo).

**Amostra de peça sem `cor`.** O cartão da loja pinta a amostra com
`cor ?? corBanho ?? amostra`. Peça que é só `extra` por cima da roupa (a
mochila-casco, que não pinta nada do corpo) declara `amostra: P.algumaCor` na
ficha. Sem isso o quadradinho sai cinza.

**Refazer uma peça que já está à venda: mantenha o `id`.** O save guarda a peça
pelo id. O gorro joaninha virou chapéu com o mesmo `'gorro-joaninha'`, e quem
já tinha comprado ficou com o chapéu. Id novo deixaria a compra antiga órfã.

## Ferramentas já prontas em `roupas.ts` — reaproveite antes de desenhar do zero

- `laco(escala, cor, corNo?)` — laço de fita, usado no cabelo, na cintura e na
  gargantilha.
- `babado(raio, altura, cor, achata?)` — barra franzida (golas, barras de
  saia). **O tamanho da escama vem da ALTURA do babado, nunca da
  circunferência** — tirar da circunferência faz um anel grande ganhar
  escamas grandes e a gola vira boia de piscina.
- `cadarco(largura, altura, cor, voltas?)` — cadarço cruzado em X, peito e
  cintura dos maids.
- `mangaBufante(raio, cor)` — manga curta e estufada.
- `coracaoChato(raio, cor)` — coraçãozinho decorativo achatado (festão do
  maid japonês).
- `estampaNoPeito(m, desenho)` — prega um desenho (montado no plano XY,
  olhando para `+Z`, unidade `e`) na frente do tronco, na altura e na
  profundidade certas da cápsula. Camiseta temática = a camiseta lisa (`cor` e
  `corDetalhe`) + uma estampa. Assim entraram a salva-vidas, a da roda e a do
  bar de sucos.
- `tiara(m, cor)` — a faixa de orelha a orelha que pousa POR CIMA do cabelo;
  devolve `{ g, naFaixa(a) }` (o ponto da faixa no ângulo `a`) para quem
  pendura orelha. Ela segue `m.cabelo(angulo)`, o contorno MEDIDO do cabelo de
  quem veste (ver abaixo).

**Peça que fica por cima do cabelo sem cobri-lo: use `m.cabelo(angulo)`.**
O rig mede o cabelo montado e diz até onde ele vai, do centro do crânio, em
cada ângulo a partir do alto, no plano de orelha a orelha. O cacheado do Ari
passa de 1,5·headR; os cachos curtos do Renan ficam em ~1,3. A tiara já foi um
arco fixo de 1,32·headR: servia no Renan e sumia na juba do Ari, orelhas
inclusive. E confira a COR contra os dois cabelos: o `cachorroOrelha` é o
mesmo tom das mechas claras do Ari, e a orelha do Walter sumia até sair do
lugar certo.
- `gorroDeLa`/`canoDaBota`/`meiaDeCoxa`/`mangaDeQuimono` — exemplos completos
  de peça de cabeça, pé, perna e braço, respectivamente; comece copiando a
  mais parecida com o que você vai fazer.

## `roupasDoJardim.ts` — miudezas de natureza e roupa LARGA

A segunda leva da lojinha da Josefina mora num arquivo próprio
(`src/world/roupasDoJardim.ts`), com o kit que ela usa:

- **bichinhos e florzinhas**, prontos para estampa, pin ou bordado:
  `florzinha(raio, petala, miolo, petalas?)`, `folhinha`, `joaninha`,
  `abelhinha`, `borboleta`, `gotinha`, `girassolzinho`;
- `colar(obj, pai, x, y, z, nx, ny, nz)` — cola um desenho numa superfície
  apontando para fora pela normal; `noTronco`/`noPeito` dão o ponto certo na
  cápsula do tronco;
- `noCabelo(m, a, pin)` + `comGrampo(m, enfeite)` — pin de cabelo: pousa no
  contorno MEDIDO (`m.cabelo(a)`), com o grampinho dourado por trás. Serve à
  vaga `acessorio` com `presoEm: 'cabeca'`;
- `luvasCom(estampa)` — luva de vaga `maos`, com a estampa no DORSO da mão (o
  `lado` decide qual face é o dorso);
- **peça larga**: `camisetaLarga(estampa)` não pinta a cápsula, põe uma CASCA
  fechada por cima (1,1× o raio do tronco, abrindo para 1,2× numa barra abaixo
  do quadril, ombro caído, gola e barra), com `mangaLarga` no `extraBraco`
  (manga até o cotovelo, com a dobra). `calcaLarga(modelo)` faz o mesmo na
  perna: um tubo solto por perna (0,06·h·w em cima, alargando embaixo), com
  tampa no alto e barra dobrada. Folga menor que isso some na foto; maior que
  isso a coxa do vizinho atravessa sentado — confira sempre a foto no banco;
- `vestidoFlorido(...)` — alça, cintura com laço e saia de dois babados
  (1,04 → 1,55 → 2,0× o raio do tronco) com flor espalhada nos dois.

Uma casca esférica de raio `R` aberta até `thetaLength` termina em
`y = centro + R·cos(theta)` com raio `R·sen(theta)` — é a conta por trás de
qualquer calota (gorro, capuz): errar as duas vira sombrero.

## `uniformeDosGatitos.ts` — o kit de roupa de TIME

O uniforme dos Gatitos (prêmio da lição 3) trouxe o que faltava para roupa de
time e de atlética. Reaproveite para qualquer uniforme novo:

- `emblemaDosGatitos(e, fundo?, tinta?)` — o escudo (disco, aro, "G" de
  geometria e as orelhinhas de gato), olhando para `+Z`;
- `textoEmArco(pai, texto, arco)` — uma PALAVRA EM ARCO no peito ou nas costas,
  letra por letra colada na casca (letra de canvas com `toon` + `alphaTest`, e
  `contorno` para a letra de time com borda). **Nas costas a primeira letra
  fica no `+X`** (quem lê está atrás): a primeira versão escreveu "SOTITAG";
- `letraG`, `estrela`, `patinha` — remendos e estampas;
- **jaqueta de atlética** (`jaquetonaDosGatitos` + `mangaDaJaquetona`): o casco
  de 1,13× que FRANZE num cós de ribana, gola em pé, botões de pressão, manga
  de couro por fora; as ribanas são marinho com dois filetes (`ribana(...)`);
- **short de treino** (`corBanho` sem `cor`, como a bermuda, + `extraQuadril`
  para o cós e o cordão + `extra` com um tubo mais comprido que a perna de
  shorts do rig);
- **jogger** (`calcaDosGatitos`): tubo que AFINA até o punho de ribana no
  tornozelo, com as três listras de lado;
- **tênis** (`tenisDosGatitos`): a sola do chinelo (`formaDaSola`) extrudada e
  REBAIXADA para o bico. Ele leva `substituiPe: true` na ficha — o pé do rig é
  uma caixa, e o tênis some com ela (como o patins); no banho o pé volta.

**Nas costas, desça as estampas.** O cacheado do Ari cobre o alto das costas:
o "GATITOS" da jaquetona na altura de uma jaqueta de verdade sumia na juba.
Hoje ele fica em `0,585·torsoH` acima do quadril.

## `torcidaDosGatitos.ts` — a roupa de cheerleader

O prêmio da festa da torcida (o fim do Módulo 1): o MESMO modelo das
coelhinhas, em quatro peças. O que ela ensinou:

- **saia pregueada de verdade** (`saiaPregueada`): uma `BufferGeometry` só,
  com N gomos azuis que estreitam para baixo e, entre eles, o fundo da prega
  amarelo um degrau para dentro — em cima as pregas fecham, embaixo abrem. Um
  cone com listras não lê "prega" de longe;
- **o cós tampa o calção do rig**: `max(1,17·raioTorso, 0,122·h·w)` de raio
  e até `legH + 0,078·h` de altura, com um anel (`RingGeometry`) fechando o
  vão de cima. Mais estreito ou mais baixo, o shortinho azul vazava;
- **vivo de acabamento** (`vivo`): um `TubeGeometry` por pontos colados na
  cápsula do tronco (`naFrente`, que também faz as costas). O decote em V é
  três deles (amarelo, branco, amarelo), e as costas repetem num U raso;
- **laço no cabelo SEM o `noCabelo`**: aquele aponta o enfeite para FORA da
  cabeça, e um laço de duas abas fica com uma enterrada e a outra espetada (de
  lado parecia uma folha). O laço de torcida é posto à mão no cocuruto, no
  contorno do cabelo (`m.cabelo(a)`), com as abas tangentes à cabeça e
  deitado 0,6 rad para trás — inteiro na câmera do jogo E no boneco do
  painel, que é visto na altura dos olhos. Fica à direita de quem veste: a
  esquerda é da presilha de estrela da Ari;
- **pompom na mão** (`maos`): o mesmo das coelhinhas (bolotas em espiral de
  Fibonacci, sem sorteio) na escala de gente, com fitinhas de franja.

**Foto de perto** (`scripts/uniforme.mjs`): o zoom do jogo tem piso, então o
teste põe a câmera num ponto e RECORTA a foto em volta dele (`clip`), com
`deviceScaleFactor: 2`. No ginásio da escola — no parque, a zona da roda
gigante manda no zoom e as árvores tapam.

## `roupasDaBoutique.ts` — a coleção nova da Estella (o kit de alfaiataria)

Pedido do Renan: "vestidos detalhados, vestido mais simples porém bem feitos,
diversos acessórios", de todo tipo de peça, com as skills `threejs-*`. São 26
peças com MODELO próprio (não cor em cima de geometria pronta), e o kit que
nasceu com elas serve à próxima:

- **`corpete(m, { decote, baixo?, folga?, solto? })`** — a casca justa do
  tronco, uma `BufferGeometry` em grade (coluna = ângulo em volta do corpo) que
  sobe do fundo da cápsula até `decote(a)`. O RECORTE É A MALHA: coração,
  ombro a ombro, V de transpasse, gola alta — sem furo nem máscara. Fecha numa
  tigela no fundo da cápsula (o tronco do rig desce até entre as pernas). UV em
  metros. Com `peitoNu` na ficha, o colo acima do decote é pele.
- **`saiaViva(m, opções, material)`** — A SAIA QUE ACOMPANHA A PERNA, o que
  deixou existir vestido LONGO. Ela lê os pivôs das pernas a cada quadro
  (`MedidasCorpo.pernas`, só leitura) e o pano CAI COMO CORTINA: numa altura,
  ele cerca tudo da perna que está acima dela (a "função de apoio" de cada
  disco, `c·u + ρ`, com máximo suave). A passada levanta a barra na frente da
  perna; sentado, o pano cai do colo e o sapato sai pela frente; o pano abre
  na hora e volta devagar (amortecido). `arco` faz um PAINEL em vez da volta
  inteira (o trench e o envelope transpassam dois); `cortes` troca de material
  numa faixa (a barra, o pesponto); `camada` dá folga à camada de fora (o tule
  sobre o cetim). Malha própria, fora da `fundir()` (`userData.viva`).
- **`noTronco(geo, m, folga)`** — dobra uma forma plana (`x` = arco em volta
  do corpo, `y` = altura, `z` = quanto sai) por cima do tronco: gola Peter
  Pan, lapela, gola de camisa, peitilho, bolso, a renda VAZADA (forma com
  `holes`). Com `chapa(forma, espessura)` para dar quina macia.
- **`torneada(perfil, gomos, fundo)`** — o torno de pano com FRANZIDO (o raio
  ondula em `gomos` onde `fundo` manda) e UV em metros: manga bufante, punho,
  gola de ribana, copa de chapéu. Escreva o perfil em qualquer sentido: ela
  desvira sozinha (o torno do three vira a face para fora só quando sobe).
- **`fitaPorPontos(pontos, largura, pontaEmV, seg, normal?)`** — fita CHATA
  deitada numa superfície (alça, ponta de laço, cinto, alça da bolsa); com
  `normalDoTronco(m)` ela deita certo também na cúpula do ombro.
- **As estampas em canvas**, uma vez por combinação de cores: `estampaFloral`,
  `listras`, `poa`, `estampaDeLenco`, `mostrador` (as coloridas: material
  branco, a textura manda) e `linho`, `cetim` (o brilho é LUZ PINTADA em
  faixas), `veludo`, `malha`, `palha`, `brilhinhos` (as de trama: quase
  brancas, multiplicam a cor da ficha).
- **`MedidasCorpo.pele`**: a cor de pele de quem veste, para a peça que tem
  uma abertura por onde a pele aparece (a sapatilha mostra o peito do pé).

**SAIA NA VAGA DAS PERNAS**: o pano é o `extraQuadril` (no corpo, y = 0 no
chão, onde o calção do rig mora), a ficha leva `pernasNuas`, e o `extra` das
pernas é `nadaNaPerna` (o rig só pendura a peça se houver `extra`). O cós cobre
o calção: `max(1,17·r, 0,122·h·w)` até `quadril + 0,08·h`.

**Na loja**: a silhueta de cada peça nova na arara sai de `TIPO_POR_ID`
(`roupasNaArara.ts`) — uma saia e uma calça moram na mesma vaga, então o slot
não basta. Peça de um tipo que ainda não existe na arara pede silhueta nova
(`forma…`/`detalhe…` de pendurar, ou `geo…` de sentar). Além das araras, o
mezanino vende em mais dois móveis: a VITRINE DE JOIAS (`JOIAS_DA_ESTELLA`,
as joias sob o vidro) e a MESA DE CHAPÉUS (`CHAPEUS_DA_ESTELLA`, chapéus nas
cabecinhas, bolsas e o lenço). Teste: `scripts/roupasDaBoutique.mjs` (mede a
saia viva vértice a vértice, andando e sentada).

## De foto para peça: o que olhar

Quando o Renan mandar uma foto ou ilustração:

1. **Identifique o slot** — a peça cobre tronco, pernas ou é acessório de
   cabeça/pé? Uma peça pode precisar de mais de um slot (vestido = tronco +
   `pernasNuas`; conjunto de maid = tronco + `extraBraco` para a manga).
2. **Separe cor principal de cor de detalhe** — geralmente corpo vs. manga/
   barra/renda. Novas entradas em `src/palette.ts`, com nome e um comentário
   de onde a cor veio (ver o bloco de `vestidoRosa`/`waRosa` como exemplo).
3. **Preste atenção aos detalhes que a foto mostra** — babado, cadarço
   cruzado, gola, comprimento da manga — e não só a silhueta geral: foi
   pedido explícito do Renan nas últimas peças ("bem detalhado").
4. **Pergunte antes de aproximar demais** quando a foto for ambígua (cor
   exata, se a peça é para os dois personagens ou só um) — mesma regra do
   `CLAUDE.md` para fatos da vida real.

## Depois de montar: validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/roupas.mjs     /tmp/rp
node scripts/vestimenta.mjs /tmp/vt
node scripts/roupasDaBoutique.mjs /tmp/rb   # peça da coleção nova da Estella (a saia viva, o painel, as fotos)
node scripts/vestiario.mjs  /tmp/vs   # só se a peça mexer na moda praia (o painel do vestiário)
node scripts/modaPraia.mjs  /tmp/mp   # as peças de piscina nos dois, no clube e no parque
```

`roupas.mjs` mede, não só fotografa: confere que a geometria nasceu sob o pai
certo (nenhuma peça de tronco aparece sob a cabeça), que os slots com
`pernasNuas`/`bracosNus` realmente viram a cor de pele, e que amplitude de
braço/perna na caminhada não mudou.

`vestimenta.mjs` guarda as regras de armazenamento: que a peça cosmética não
encosta numa vaga de mão, que vestida ela só sai por descarte, que os patins
continuam sendo a exceção, e que o painel do armário separa tudo por parte do
corpo.

**Fotos obrigatórias antes de dar a peça como pronta** (regra do
`CLAUDE.md`): o boneco do painel (`Previa.ts` — canvas próprio, não é o
mundo do jogo) de frente e girado; a dupla **andando** com a peça vestida
(a coxa não pode furar uma saia); e, se a peça cobre a perna,
**sentado no banco** — a perna vai a ~90° e é o caso que mais escapa de
uma olhada rápida de frente.

## Regressão

`sobreTronco`, `porExtras` e `aplicarVisual` (`CharacterRig.ts`) são
compartilhados por todo o jogo, e `SaveState`/`Ui` são compartilhados com a
mochila inteira. Depois de mexer neles (não só ao acrescentar peça simples),
rode também: `quarto.mjs`, `vestimenta.mjs`, `mochila.mjs`, `itens.mjs`,
`patins.mjs`, `celular.mjs`, `smoke.mjs`, `mecanicas.mjs`, `banco.mjs`.
