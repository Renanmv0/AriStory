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

**Estado (2026-11-11).**

| etapa | o quê | estado |
|---|---|---|
| **A** | o modelo do Bebito Mobile no kit, por ficha de dados, com fotos de todos os lados | ✅ **feita** |
| **B** | a frente da casa do Ari (o jardim e a garagem) e a quest do presente | ✅ **feita, ESCONDIDA** — faltam o aval do Renan nas falas e a escolha da fala do Ari (§5) |
| **C** | uma viagem completa: Casa do Ari → Villa Lobos, com "quem dirige?" e o cenário procedural | ⬜ a próxima |
| **D** | as demais rotas (parque ↔ clube ↔ escola) e o acabamento | ⬜ |
| no fim | LIGAR A CHAVE: `BEBITO_MOBILE_NO_JOGO = true` | ⬜ só quando tudo estiver pronto |
| depois | a EDIÇÃO do carro pelos dois (a ficha já está pronta para ela, §3) | ⬜ não fazer ainda |

### 🔑 A chave: nada disso aparece no jogo até tudo estar pronto

Pedido do Renan (2026-11-11): o carro, a quest, as viagens e tudo o que vem
junto **só aparecem no jogo quando tudo estiver pronto**. Por isso existe uma
chave, em `src/eventos/BebitoMobile.ts`:

```ts
export const BEBITO_MOBILE_NO_JOGO = false;   // ligar é trocar para true. Só isso.
```

Com ela em `false`, quem joga pelo link de sempre encontra o jogo exatamente
como era: a porta da casa sai direto no parque, a cama do quarto é a de
sempre, e o save não ganha flag nenhuma do carro (o `scripts/presente.mjs`
confere isso). **Toda etapa nova fica atrás desta chave**
(`bebitoMobileNestaPagina()`).

**Para ver antes da hora** (os testes e o Renan): `?bebito` no endereço liga
tudo NUM SAVE À PARTE (`aristory.save.v1.bebito`, que nasce como cópia do de
verdade), então dá para jogar a quest sem gastar a surpresa. `?semBebito`
força desligado, para quando a chave estiver ligada.

```
…/?bebito                              # o jogo com o carro, no save de teste
…/?bebito&cena=frente-da-casa          # direto no jardim
…/?cena=villa-lobos&carro=38.4,-9&em=41,-6          # só o modelo, na rua do parque
…/?cena=villa-lobos&carro=38.4,-9&em=41,-6&semTeto  # a casinha de boneca
```

(A quest pede a lição 10 da apostila concluída; no save de teste, pelo
console: `jogo.save.concluirLicao('partiu-praia', 3)` e recarregar.)

**Mapa do código** (`src/world/bebitoMobile/`):

| arquivo | o que mora ali |
|---|---|
| `ficha.ts` | a FICHA (pintura, placa, vagas), o catálogo dos detalhes e a leitura do save. Só dado, sem three |
| `pele.ts` | a conta da lataria: a planta, o perfil, a fatia, a grade e os ajudantes de pregar coisa na lataria |
| `BebitoMobile.ts` | a classe do carro: monta tudo lendo a ficha, e tem os comandos que a cena usa |
| `acessorios.ts` | o modelo 3D de cada detalhe (um por id do catálogo) |
| `impressos.ts` | o que é desenho em canvas: placa, adesivos, rádio e relógios, num atlas só |

E o que a etapa B trouxe:

| arquivo | o que mora ali |
|---|---|
| `src/eventos/BebitoMobile.ts` | A CHAVE, a lição que libera a quest e as fases (flags) dela |
| `src/eventos/bebitoMobile/presente.ts` | a quest: o sono no quarto, a cena da sala e a chegada do carro (as quatro tomadas) |
| `src/scenes/frenteDaCasa.ts` | a cena `frente-da-casa`: o jardim, a garagem, a rua e a vizinhança |
| `src/world/frenteDaCasa.ts` | as peças: a casa por fora (e a vizinha, do mesmo molde), o pergolado, a cerquinha, o portãozinho e a caixa de correio |

O save: `SaveState.fichaDoBebitoMobile()` / `salvarFichaDoBebitoMobile()`
(na cena, `g.fichaDoBebitoMobile()`). Os testes: `scripts/bebitoMobile.mjs`
(o modelo) e `scripts/presente.mjs` (a chave, o jardim e a quest).

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

E em 2026-11-11, o roteiro da etapa B (palavras do Renan):

- **Só aparece no jogo quando tudo estiver pronto** (a chave, acima).
- **A casa**: "ao sair tem um jardinzinho e ao lado uma garagem onde fica o
  carro; o jardim é florido e fechado dos dois lados".
- **Quando**: a quest aparece depois de terminar a **aula 10** da apostila do
  Gatito, e **começa quando os dois dormem na cama** do quarto do Ari.
- **O roteiro**: ao acordar, o Renan pergunta se o Ari quer ver uma surpresa;
  na sala, o Renan diz que já volta e sai pela porta; logo depois sai o Ari,
  ainda confuso; do lado de fora o Renan não está mais; passados uns
  segundos, ele chega dirigindo o carro e estaciona na garagem.

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

## 5. Etapa B — a frente da casa e a quest do presente (feita, escondida)

### A frente da casa (`frente-da-casa`)

Com a chave ligada, a porta da rua da casa ("Sair pro jardim") sai AQUI, e é
a calçada que leva ao parque ("Ir pro parque"); o "Voltar pra casa" do
parque chega pela calçada.

- **A casa por fora**: as cores da casa por dentro (a parede creme da sala,
  a porta de madeira escura — a MESMA peça da porta de dentro), duas
  janelas com veneziana verde e floreira, o lampião, o degrau com o capacho
  e o telhado de duas águas de telha (canvas) com chaminé.
- **O jardim**, florido e fechado dos dois lados: de um lado a **mureta**
  com moitas floridas em cima (e uma passagem para a garagem); do outro, a
  **cerquinha branca**, que continua na frente com o **portãozinho** (abre
  sozinho quando alguém chega) e a caixa de correio. Dentro: quatro
  canteiros, moitas floridas encostadas na casa, flores soltas, o caminho de
  pedrinha e uma árvore florida.
- **A garagem**, ao lado: o piso de placas, as paredes do fundo e do lado, e
  um **pergolado** de madeira com trepadeira florida (a câmera olha de cima:
  telhado fechado esconderia o carro), com uma prateleira e o regador. O
  carro mora ali de nariz para a rua.
- **A rua**: calçada de pedrinha, guia, asfalto com faixa — e a
  **vizinhança**: oito casinhas do mesmo molde, cada uma de uma cor (quatro
  deste lado, quatro do outro, de frente para cá), sebe na frente dos
  quintais, árvores atrás e nas pontas, e nuvens. Sem ela a casa ficava num
  gramado sem fim, e a chegada do carro (que é filmada de perto, com
  horizonte) mostrava o vazio.

**Inventado por mim, a conferir com o Renan**: como é a casa por fora (cor,
telhado, janelas), a cerca branca, o pergolado e a vizinhança. O pedido dizia
só "jardinzinho florido, fechado dos dois lados, e uma garagem ao lado"; o
resto é proposta — se a casa de verdade for diferente, é só dizer.

**O peso** (a vista de entrada, medido com `renderer.info.render`): a
primeira versão desenhava **933 objetos por quadro**; ficou em **339** (o
parque faz 425) com a mesma imagem. O que cortou: o jardim e cada pedaço da
vizinhança viraram grupos juntados por material (`fundirComoFundo`, em
`world/fundir.ts` — cada canteiro eram cem bolinhas soltas), a casa vizinha
é o mesmo molde com porta lisa e sem lampião (5,7 mil triângulos contra 15
mil), e a faixa tracejada da rua virou uma malha só. Triângulos: 189 mil
(o parque: 152 mil; a estufa: 190 mil).

### A quest

| passo | onde | o que acontece |
|---|---|---|
| 0 | — | a lição 10 da apostila do Gatito (`partiu-praia`) concluída libera a quest. Nada avisa: é surpresa |
| 1 | quarto | "Deitar um pouco?" na cama vira DORMIR: os dois deitam, o Ari pega no sono, a tela escurece, amanhece; o Renan pergunta **"Quer ver uma surpresa?"** (flag `bebito:surpresa`) |
| 2 | sala | cutscene: os dois na sala; o Renan diz que já volta, anda até a porta da rua e sai (flag `bebito:renan-saiu`); o Ari, confuso, vai atrás |
| 3 | frente da casa | cutscene em quatro tomadas: (A) o Ari na porta procura o Renan; a buzina; (B) por cima do ombro dele, o carro vem pela rua, de laço no teto, com o Renan dirigindo; (C) da rua, o carro engata a ré e entra na garagem; (D) de perto, os dois na frente do carro. Corações, a memória "O Bebito Mobile" no diário (flag `bebito:ganhou`) |
| depois | frente da casa | o carro mora na garagem (o laço sai), com o "Olhar o Bebito Mobile" (três conversas que se revezam) |

- **Na quest quem se controla é o Ari** (o presente é para ele): se quem
  joga estava com o Renan, os dois trocam antes de dormir.
- **Se a página recarregar no meio**, a quest retoma do passo em que parou
  (cada passo é uma flag).
- **O laço** é um detalhe do catálogo (`laco-de-presente`, na vaga `teto`):
  a cena põe na ficha só na chegada, e ele não vai para o save.
- **As poses** novas do `CharacterRig`: `setNoCarro('dirigindo' | 'passageiro', volante)`
  (na cena, `g.poseNoCarro(quem, pose, volante)`) — as mãos no volante
  acompanham o giro. E `g.setCompanionVisible(false)` para o parceiro "sair
  pela porta".
- **Os sons** novos: `buzinaDoBebito` (o bi-bi), `motorDoBebito` (o pó-pó-pó,
  em fila enquanto anda) e `portaDoBebito`.

### As falas — PARA O RENAN APROVAR

O roteiro é do Renan; **as palavras abaixo fui eu que escrevi**. Fala que ele
reescrever entra literal.

**No quarto**
> **Ari**: Me deu um sono…
> **Renan**: Dorme um pouco. Eu fico aqui.
> *(a tela escurece e amanhece)*
> **Renan**: Bom dia, bebito.
> **Ari**: Bom dia… Eu dormi muito?
> **Renan**: Quer ver uma surpresa? — *[Quero!] [Que surpresa?]*
> **Ari**: Quero! O que é? *(ou "Que surpresa?")*
> **Renan**: Se eu contar, não é surpresa. Vem pra sala.

**Na sala**
> **Ari**: Pronto, tô na sala. Cadê a surpresa?
> **Renan**: Fica aqui. Eu já volto.
> **Ari**: Como assim, já volta? Renan!
> *(ele sai pela porta)*
> **Ari**: …Ele saiu mesmo.
> **Ari**: Eu vou lá ver.

**Na frente da casa**
> **Ari**: Renan?
> **Ari**: Ué. Cadê ele?
> *(a buzina)*
> **Ari**: Isso foi uma buzina?
> *(o carro chega e estaciona)*
> **Renan**: Surpresa!
> **Ari**: *(a fala a escolher, abaixo)*
> **Renan**: É nosso. O Bebito Mobile.
> **Ari**: Bebito Mobile… Tá escrito na placa!
> **Renan**: E tem a sua estrela no retrovisor, o Pelusa no chaveiro e o Jean-Luc no painel.
> **Ari**: Então a gente não precisa mais correr atrás de ônibus?
> **Renan**: Só se você quiser. E cada viagem a gente decide quem dirige.

**A fala do Ari ao ver o carro** — três propostas (hoje está a 1; ela mora em
`FALA_DO_ARI_AO_VER_O_CARRO`):

1. "Mentira… Isso é pra gente? Você é doido. Eu amei."
2. "Para. Para tudo. Esse carro é nosso?!"
3. "Ai, bebito… é a coisa mais fofa que eu já vi."

**A memória do diário** ("O Bebito Mobile", escrita na voz do Renan): "Eu
disse que já voltava e saí pela porta. Você veio atrás, sem entender nada, e
eu cheguei buzinando: um carrinho azul de teto creme, com um laço no teto e
o nosso nome na placa, estacionado de ré na garagem."

### Perguntas em aberto, para o Renan

1. **As falas**: aprova como estão, ou reescreve? E qual das três do Ari (ou
   uma dele)?
2. **A casa por fora** parece com a de verdade? (cor, telhado, cerca, a
   garagem de pergolado.)
3. **Um aviso de que a quest existe?** Hoje nada avisa depois da lição 10 — o
   Ari só descobre quando for deitar. Dá para o Gatito soltar uma dica no fim
   da aula, ou o Renan dizer "tô com sono" ao entrar no quarto.
4. **O laço fica onde?** Hoje some depois da entrega. Ele pode virar um
   enfeite guardado (pendurado na garagem, ou no retrovisor).

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

```bash
node scripts/presente.mjs /tmp/pr             # a chave, o jardim e a quest inteira
SO=quest CEL=1 node scripts/presente.mjs /tmp/pr   # a quest no celular em pé
```

`SO=escondido|jardim|quest` roda uma parte. O teste joga a quest pelo
`?bebito` (save à parte), acelera o relógio das cutscenes por
`aristoryBebitoMobile.ritmoDoPresente.vezes` e fotografa cada passo.
