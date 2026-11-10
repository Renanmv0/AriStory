# O Bebito Mobile e as viagens de carro

> Plano do carro do casal e das viagens de carro entre os lugares do AriStory.
> É projeto: cada etapa marca aqui o que já está no jogo. O `git log` é a
> fonte da verdade do que mudou por último.

## COMECE AQUI

**O que é.** Em vez do ônibus, a viagem entre os lugares passa a ser de carro
(o ônibus da cidade continua existindo). O Renan dá o **Bebito Mobile** de
presente para o Ari numa quest curta; depois disso, toda viagem pergunta
**quem vai dirigir dessa vez**, e o trajeto é um cenário procedural que passa
pela janela.

**Estado (2026-11-10).**

| etapa | o quê | estado |
|---|---|---|
| **A** | o modelo do Bebito Mobile no kit, por ficha de dados, com fotos de todos os lados | ✅ **feita** |
| **B** | a quest do presente e a entrega, na frente da casa do Ari | ⏳ a próxima (tem perguntas em aberto, §5) |
| **C** | uma viagem completa: Casa do Ari → Villa Lobos, com "quem dirige?" e o cenário procedural | ⬜ |
| **D** | as demais rotas (parque ↔ clube ↔ escola) e o acabamento | ⬜ |
| depois | a EDIÇÃO do carro pelos dois (a ficha já está pronta para ela, §3) | ⬜ não fazer ainda |

**O carro ainda NÃO aparece no jogo**: ele chega pela quest (etapa B). Para
ver o modelo antes dela, o atalho de depuração `?carro=x,z` estaciona o carro
numa cena:

```
…/?cena=villa-lobos&carro=38.4,-9&em=41,-6         # na rua do parque
…/?cena=villa-lobos&carro=38.4,-9&em=41,-6&semTeto  # a casinha de boneca
…/?cena=villa-lobos&carro=38.4,-9&em=41,-6&farois   # de farol aceso
```

**Mapa do código** (`src/world/bebitoMobile/`):

| arquivo | o que mora ali |
|---|---|
| `ficha.ts` | a FICHA (pintura, placa, vagas), o catálogo dos detalhes e a leitura do save. Só dado, sem three |
| `pele.ts` | a conta da lataria: a planta, o perfil, a fatia, a grade e os ajudantes de pregar coisa na lataria |
| `BebitoMobile.ts` | a classe do carro: monta tudo lendo a ficha, e tem os comandos que a cena usa |
| `acessorios.ts` | o modelo 3D de cada detalhe (um por id do catálogo) |
| `impressos.ts` | o que é desenho em canvas: placa, adesivos, rádio e relógios, num atlas só |

O save: `SaveState.fichaDoBebitoMobile()` / `salvarFichaDoBebitoMobile()`
(na cena, `g.fichaDoBebitoMobile()`). O teste: `scripts/bebitoMobile.mjs`.

## 1. As decisões do Renan e do Ari (2026-11-10)

- **O carro**: fofo, mas **espaçoso por dentro** — para um dia a viagem poder
  ser vista de dentro, com alguma atividade ou interação na cabine.
- **Cor**: azul-céu, com o teto creme.
- **Por dentro**: o Jean-Luc de painel, o girassol da Josefina, a estrela e o
  pompom no retrovisor, e o chaveiro do Pelusa.
- **Por fora**: o emblema dos Gatitos e o 67 no vidro de trás, os adesivos dos
  lugares (roda gigante, Mania de Churrasco, sorvete do Mano) e a placa
  `BEBITO`. (As calotas de coração ficaram de fora.)
- **A carga**: o frisbee e as raquetes, o Bebito book e os dois livros, e a
  mantinha da Estella com o pote de biscoitos. (A barraca no bagageiro ficou
  de fora: o bagageiro vai vazio.)
- **A entrega**: na frente da casa do Ari.
- **A fala do Ari ao ver o carro**: eu proponho opções na etapa B e o Renan
  escolhe (se ele escrever uma, ela entra literal).
- **A primeira viagem**: Casa do Ari → Villa Lobos.

## 2. O modelo (etapa A — feita)

Uma **vanzinha-bolha**, com jeito de kombi: alta, redonda, de nariz curto, com
os faróis redondos de olho, a grade num sorriso e um coração de emblema.
5,1 m × 2,3 m × 2,3 m — maior que um carro de verdade ao lado de uma pessoa,
porque a cabeça do corpo chibi tem 60 cm (75 com os cachos) e duas delas têm
que caber lado a lado.

- **A lataria é uma superfície própria**, de fatias (`pele.ts`), e não uma
  caixa extrudada: a planta é uma superelipse, o perfil é o desenho de lado e
  a traseira deita um pouco. Ela é OCA de verdade: os vidros são
  transparentes e a cabine existe.
- **Três janelas de cada lado**: a da porta da frente (com o quebra-vento), a
  da porta de CORRER, comprida, e a de trás. A borracha de cada vidro é um
  filete que segue a lataria, de largura constante, com as quinas todas no
  mesmo raio.
- **A cabine**: o painel de lata pintada com o tampo estofado, o rádio e os
  relógios (canvas), o volante de baquelite que gira, a alavanca de câmbio na
  coluna, **dois bancos inteiriços** de matelassê (o da frente com dois
  encostos, o de trás com um) e o tampão do porta-malas.
- **O teto sai** (`mostrarTeto(false)`), como o da barraca da clareira: é a
  casinha de boneca para uma cena de dentro.
- **O contrato**: a base em `y = 0`, o **nariz no `+Z`**, o **motorista no
  `+X`** (carro brasileiro). As medidas da cena em `BEBITO_MOBILE`.
- **Os comandos** que a cena usa: `rodar(distância)`, `estercar(ângulo)`,
  `acenderFarois`, `frear`, `pisca('esquerda' | 'direita' | 'alerta' | null)`,
  `mostrarTeto`, `andando(0..1)`, `solavanco(força)`, `empurrar(arfa, rola)`,
  `deitarEncostos(quanto, qual?, naHora?)`, `mostrarCargaDoBanco(sim)` e
  `update(dt)`.
- **Os lugares de sentar** (seis): `carro.assentos.motorista`, `.passageiro`,
  `.frenteMeio` (entre os dois: só bicho pequeno) e `.tras[0..2]` (esquerda,
  meio e direita) — âncoras na altura do assento, olhando para a frente. A
  cena monta quem senta com `g.ridePlayer(ancora, new Vector3(0, -0.47, 0), 1, 0)`
  (o quadril do rig fica 0,47 acima da origem dele: a conta do banco de praça).
- **A cama** (pedido do Renan, 2026-11-10): `deitarEncostos(1)` deita os dois
  encostos da frente para trás, e eles ficam rentes aos assentos — os dois
  bancos viram um colchão só, de **1,90 × 2,05 m**, com o encosto de trás de
  cabeceira. Quem deita usa `carro.cama`, a âncora no padrão da cama do
  quarto e da barraca (`g.ridePlayer(carro.cama, new Vector3(∓0.4, 0, 0), 1, 0)`
  e `g.setLying(true)`), com os pés para a frente do carro. O que vai em cima
  do banco de trás (o Bebito book, a mantinha) sai com
  `mostrarCargaDoBanco(false)`. O teste senta a dupla atrás, deita os
  encostos e deita os dois, e mede.
- **O peso**: 43 malhas à vista (274 antes da `fundir()`/`juntarPorCor`) e
  ~35,5 mil triângulos — a régua do ônibus da cidade (~34 mil).

### O que mudou depois da primeira foto (2026-11-10, a pedido do Renan)

- **Mais banco de trás.** O carro ganhou 40 cm no meio (4,6 → 5,1 m): o banco
  de trás agora é inteiriço, da largura da cabine (cabem três), e fica À
  FRENTE das caixas de roda de trás. O da frente também virou inteiriço (a
  alavanca foi para a coluna), para os dois deitarem numa cama só.
- **As janelas "wobbly".** A borracha era um tubo (`TubeGeometry`), que torce
  o próprio corte ao longo da curva e estufa nas quinas: o traço engrossava e
  afinava, e cada quina saía de um jeito. Virou um filete orientado pela
  normal da lataria (`friso()`), com as quinas arredondadas todas iguais. O
  friso de cromo da cintura, o corte das portas e o aro das caixas de roda
  passaram para o mesmo filete.

## 3. A ficha e as vagas (pronto para a edição futura)

O carro é montado lendo `FichaDoBebitoMobile`:

```ts
{
  pintura: { lataria, teto, estofado },   // cores (números)
  placa: 'BEBITO',                         // até 7 letras e números
  vagas: { painel: [id | null, …], retrovisor: […], … },
}
```

| vaga | lugares | o que cabe | onde fica | de fábrica |
|---|---|---|---|---|
| `painel` | 3 | peça | em cima do painel: lado do passageiro, meio, canto do motorista | girassol, Jean-Luc, — |
| `retrovisor` | 2 | peça | pendurado no espelho de dentro | estrela do Ari, pompom |
| `chave` | 1 | peça | o chaveiro, na ignição | Pelusa |
| `teto` | 1 | peça | no bagageiro | — (vazio) |
| `portaMalas` | 2 | peça | no tampão de trás | frisbee e raquetes, — |
| `bancoDeTras` | 2 | peça | em cima do banco de trás, nas duas pontas (a cena guarda com `mostrarCargaDoBanco(false)`) | Bebito book e livros, mantinha |
| `vidroTraseiro` | 2 | adesivo | nos cantos do vidro de trás | emblema dos Gatitos, 67 |
| `paraChoque` | 3 | adesivo | na tampa de trás | roda gigante, Mania, Mano |
| `rodas` | 1 | calota | as quatro rodas | calota clássica |

Mais a **pintura** (lataria, teto, estofado) e a **placa** (o texto).

- Cada lugar é um **encaixe com nome** no modelo (`vaga:painel:0`…), em
  `carro.encaixes`.
- O **catálogo** (`CATALOGO_DO_CARRO`) diz de onde vem cada referência
  (`origem`), para o painel de edição contar a história de cada enfeite.
- **Detalhe novo**: uma entrada no catálogo (`ficha.ts`) e um modelo
  (`acessorios.ts`) ou um desenho (`impressos.ts`). O teste cobra que todo id
  do catálogo monte.
- **O save**: a ficha mora em `bebitoMobile`, no save do casal (um carro só
  para os dois, como a carteira). `normalizarFicha` conserta na leitura: save
  de antes do carro recebe a de fábrica; vaga nova recebe a de fábrica dela;
  id que saiu do catálogo ou é de outra vaga vira lugar vazio; cor e placa
  tortas voltam ao padrão.
- Se os dois **já ganharam** o carro é uma flag da quest (etapa B), e não
  mora na ficha.

O que a edição futura precisa, e ainda não existe: o painel de escolher (no
molde do ateliê de tingimento), mais detalhes no catálogo, a vaga `rodas`
com mais de um jogo de calotas, e remontar o carro quando a ficha muda
(`new BebitoMobile(ficha)` no lugar do antigo).

## 4. As referências do carro (de onde vem cada uma)

| detalhe | de onde vem |
|---|---|
| Jean-Luc de painel | o pato francês do lago: a boina, a camisa de jogador com a gola vermelha, a bandeirinha e a raquete |
| girassol no vasinho | a moeda da lojinha da estufa, com o laço rosa da Josefina |
| estrela no retrovisor | a presilha de estrela do cabelo do Ari (a mesma cor) |
| pompom no retrovisor | o pompom azul e amarelo da Luna, da Sol e da Estrella |
| chaveiro do Pelusa | o gato do Ari |
| frisbee e raquetes | o frisbee de sábado e a mesa de ping pong do parque |
| Bebito book e os dois livros | o caderninho da barraca, o Aristóteles e Dante do Ari e A Toca das Raposas do Renan |
| mantinha e pote de biscoitos | a Estella, que costura tudo e não deixa ninguém ir embora sem um biscoitinho |
| emblema dos Gatitos e o 67 | a atlética da escola e o six seven do Gatito |
| adesivos | a roda gigante do Villa Lobos, o Mania de Churrasco e a casquinha do Mano (morango e maracujá) |
| placa `BEBITO` | como os dois se chamam (a placa do ônibus da cidade já era `BEB1T0`) |
| o coração da grade e da buzina | — |

Ficaram de fora de propósito: o Halloween (está fora do jogo) e a Hello Kitty
do arraiá (personagem de marca).

## 5. Etapa B — a quest do presente (a próxima)

O que já está decidido: o Renan entrega o carro **na frente da casa do Ari**;
a cutscene carrega os dois; o diálogo que cita nome usa `g.companionName()`;
e a fala do Ari ao ver o carro é escolhida pelo Renan entre as opções que eu
propuser (ou a que ele escrever, literal).

**Perguntas em aberto, para o Renan:**

1. **Como é a frente da casa do Ari de verdade?** Hoje a porta da rua da casa
   leva direto ao portão do Villa Lobos: a rua da casa não existe no jogo. É
   casa com portão, prédio, tem garagem, calçada, árvore, muro? De que cor?
   (O valor do jogo é ser parecido com a vida real: prefiro perguntar a
   inventar.)
2. **Quando a quest aparece?** Desde o começo do jogo, ou depois de alguma
   coisa (uma memória, um número de memórias, o ônibus já usado uma vez)?
3. **Como o Renan chama o Ari para ver?** Uma buzina lá fora, "fecha o olho",
   uma chave numa caixinha na mesa…
4. **A fala do Ari** (eu mando as opções junto com o roteiro da cutscene).
5. **O laço**: um laço gigante no capô, ou no teto?

## 6. Etapas C e D — as viagens

Ideias de partida (a detalhar quando a etapa chegar):

- **"Quem dirige dessa vez?"** — sempre perguntado; muda quem senta em cada
  lugar, a pose (mãos no volante × passageiro) e as falas. As poses novas
  entram no `CharacterRig` (cuidado: perna e braço esquerdos nascem em `x`
  negativo).
- **O caminho**: uma cena própria, com a estrada e a paisagem geradas em
  código (trechos que mudam: bairro, avenida, beira de parque…), variando com
  uma semente por viagem; o céu e a luz conforme o horário (`world/noite.ts`
  já tem os momentos do dia).
- **O som**: motor, buzina, pisca, e o rádio do carro (a skill `aristory-som`).
- **De dentro**: a cabine cabe uma cena (o teto sai); fica para quando houver
  uma atividade para fazer ali.
- **Levar gente para passear**: os três lugares de trás já existem
  (`assentos.tras`); falta decidir quem pode ir e como se convida.
- **Deitar na cama do carro**: o modelo já deita os encostos e tem a âncora
  (`carro.cama`); falta a cena (onde se estaciona para isso, a câmera de
  cima, o que os dois fazem deitados).
- **As rotas**: Casa ↔ Villa Lobos primeiro; depois parque ↔ clube ↔ escola,
  no lugar (ou ao lado) do ônibus.

## 7. Como testar

```bash
npm run build && npx vite preview --port 4173 --host 127.0.0.1 &
node scripts/bebitoMobile.mjs /tmp/bm        # tudo
SO=fotos node scripts/bebitoMobile.mjs /tmp/bm
```

`SO=modelo|ficha|comandos|peso|fotos|coplanar|lugares` roda uma parte;
`SEM_FUNDIR=1` mede antes da junção; `CEL=1` fotografa também no celular.
