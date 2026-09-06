---
name: aristory-roupa
description: Adicionar uma peça nova ao guarda-roupa do AriStory a partir de uma foto, ilustração ou descrição — vestido, roupa de baixo, chapéu, bota, meia. Use quando pedirem "faz essa roupa para o armário", "adiciona essa peça" ou para ajustar algo já vestido (manga comprida demais, braço torto, cobrindo peça errada).
---

# Adicionar uma peça ao guarda-roupa

Roupa é **item do inventário**, não parte fixa da ficha do personagem. O
pipeline inteiro:

1. `src/world/roupas.ts` — a GEOMETRIA da peça (uma função por peça).
2. `src/world/itens.ts` — a FICHA (`ItemDef`) que liga a geometria a um id,
   nome, ícone, cor e slot; entra no catálogo `ITENS`.
3. `src/palette.ts` — as cores novas, com nome e um comentário de onde vieram.
4. `src/scenes/quarto.ts` — `ROUPAS_DO_ARMARIO` estoca a peça; o armário
   abastece os DOIS personagens a cada abertura, então uma entrada só já
   basta para os dois poderem vestir.
   **Peça que se GANHA jogando fica fora dessa lista** e entra por `flag` no
   mesmo laço (a gravatinha do Walter, `gravata-do-walter`): a lista é o que o
   Ari já tinha, e prêmio que aparece de graça deixa de ser prêmio. Quem dá o
   prêmio chama `g.storeItem(peca, quem)` para os dois na hora, para a peça
   não sumir até a próxima visita ao quarto.
5. `scripts/roupas.mjs` e `scripts/vestimenta.mjs` — asserções que provam que a
   roupa não quebrou a animação, não nasceu no lugar errado e não escapou das
   regras de armazenamento.

Nenhuma peça de roupa é modelada dentro de uma cena, e nenhuma tem estado
próprio: tirar e recolocar já vem de graça do sistema de inventário.

## Onde uma peça pode morar — são TRÊS lugares

| lugar | o que aceita | quem mexe |
|---|---|---|
| **mochila** (10 vagas) | item de mão e vestimenta **funcional** | o jogador, em qualquer lugar |
| **corpo** (4 vagas) | qualquer vestível, na vaga da parte dele | o painel do armário |
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

## As 4 vagas SÃO as 4 partes do corpo

`SlotRoupa = 'cabeca' | 'tronco' | 'pernas' | 'pes'` (`src/core/types.ts`).
Cabeça e pé convivem com qualquer coisa (são vagas diferentes); dois chapéus
não convivem. Toda ficha vestível declara `slot` — é ele que decide a vaga,
não uma escolha da tela.

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

A ausência de `cor` é o truque, e não um esquecimento: sem ela o resolvedor
deixa a perna com a calça da ficha fora d'água, então a bermuda simplesmente
não aparece na rua. É o que dispensou um segundo sistema de roupa para a
praia — zero estado novo, zero geometria nova, e o guarda-roupa do quarto
continua listando a peça em "Pernas" como qualquer outra.

O painel que troca isso é o **vestiário do clube** (`clube:vestiario` →
`g.abrirVestiario()`): o guarda-roupa encolhido em duas perguntas, óculos e
cor. Ele mexe nas MESMAS vagas, pelos mesmos `vestirPeca`/`tirarPeca` do
`Game`, então cada pessoa guarda o seu traje de praia de graça. Cor nova de
bermuda é uma entrada em `ITENS` e outra em `MODA_PRAIA` (`world/itens.ts`) —
a cena abastece por essa lista e o painel desenha por ela.

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

## Peças fixas da ficha que a roupa nova precisa esconder

O laço, o cinto, a listra da camiseta, o casco/capuz da jaqueta e a mochila
já existem na ficha de cada personagem e não desaparecem sozinhos quando
uma roupa nova entra. Eles moram em `sobreTronco` (`CharacterRig.ts`) — uma
lista de objetos que somem quando `this.roupa.tronco` está ocupado. **Peça
de tronco nova que deveria cobrir o corpo inteiro** (vestido, macacão) já
ganha isso de graça; se descobrir uma peça fixa que ainda vaza por cima
(aconteceu com a mochila do Renan, que cruza o peito por cima de vestido),
adicione o objeto em `sobreTronco` no construtor.

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
- `gorroDeLa`/`canoDaBota`/`meiaDeCoxa`/`mangaDeQuimono` — exemplos completos
  de peça de cabeça, pé, perna e braço, respectivamente; comece copiando a
  mais parecida com o que você vai fazer.

Uma casca esférica de raio `R` aberta até `thetaLength` termina em
`y = centro + R·cos(theta)` com raio `R·sen(theta)` — é a conta por trás de
qualquer calota (gorro, capuz): errar as duas vira sombrero.

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
node scripts/vestiario.mjs  /tmp/vs   # só se a peça mexer na moda praia
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
