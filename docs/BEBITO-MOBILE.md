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

**Estado (2026-11-12).**

| etapa | o quê | estado |
|---|---|---|
| **A** | o modelo do Bebito Mobile no kit, por ficha de dados, com fotos de todos os lados | ✅ **feita** |
| **B** | a frente da casa do Ari (o jardim e a garagem) e a quest do presente | ✅ **feita, ESCONDIDA** — faltam o aval do Renan nas falas e a escolha da fala do Ari (§5) |
| **C** | a viagem de carro Casa do Ari ↔ Villa Lobos, DIRIGIDA por quem joga, com "quem dirige?", obstáculos e bichos na faixa | ✅ **feita, ESCONDIDA** — as falas da carona esperam o aval do Renan (§6) |
| **D** | as demais rotas (parque ↔ clube ↔ escola) e o acabamento | ⬜ a próxima |
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
…/?bebito&cena=viagem-de-carro&viagem=ida,renan,7  # direto na estrada: o sentido, quem dirige e a semente
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

E o que a etapa C trouxe:

| arquivo | o que mora ali |
|---|---|
| `src/eventos/bebitoMobile/rota.ts` | a ROTA de cada viagem, sorteada por semente: a curva, os trechos de paisagem, os oito eventos, os corações e a nota. Sem three |
| `src/eventos/bebitoMobile/partida.ts` | "Ir de carro?" e "Quem dirige dessa vez?", e a partida para a estrada |
| `src/eventos/bebitoMobile/travessia.ts` | os bichos do lago atravessando a faixa: a pata com os patinhos (com as patinhas, em terra) e os tigres-d'água |
| `src/eventos/bebitoMobile/noParque.ts` | o estacionamento do Villa Lobos (do outro lado da rua do ônibus), o carro na vaga dele e a volta para casa |
| `src/world/estacionamento.ts` | as peças do estacionamento: o carro dos outros, a cancela, o totem, a placa do P e a plaquinha da vaga |
| `src/scenes/viagemDeCarro.ts` | a cena `viagem-de-carro`: a estrada montada pela rota, o carro dirigido, os eventos, a câmera, o painel e a chegada |
| `src/world/estrada.ts` | as peças da estrada: o asfalto em trechos curvos, a faixa de pedestres, as placas, os cones, o cavalete, a lombada, o buraco, a poça, o semáforo, os corações e a roda gigante ao longe |

O save: `SaveState.fichaDoBebitoMobile()` / `salvarFichaDoBebitoMobile()`
(na cena, `g.fichaDoBebitoMobile()`). Os testes: `scripts/bebitoMobile.mjs`
(o modelo), `scripts/presente.mjs` (a chave, o jardim e a quest) e
`scripts/viagem.mjs` (a viagem).

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

**A segunda versão (2026-11-11, depois da primeira foto).** O Renan pediu:
a casa **maior, mais comprida para trás** ("parece minúscula, olhando de
fora"); na garagem, **um portão, mais moderno**; no lugar da cerquinha
branca, **um muro um pouco mais alto, decorado com plantas somente verdes**
("dê uma modernizada"); e **plantas novas e bem feitas** no jardim — "os
canteiros redondos são sem graça; a árvore pode deixar". É o que está aqui:

- **A casa por fora**: as cores da casa por dentro (a parede creme da sala,
  a porta de madeira escura — a MESMA peça da porta de dentro), agora com
  **8,2 m de fundo** (eram 3,6), duas janelas em cada lateral, o óculo
  redondo do sótão no oitão, a testeira branca no beiral e o telhado de
  duas águas mais deitado. Na frente continuam as duas janelas com veneziana
  verde e floreira, o lampião e o degrau com o capacho.
- **O muro**: reboco claro, faixa de pedra no pé e capeamento de grafite,
  com 1,35 m (a cerca tinha 0,92), na frente e no lado direito do jardim;
  pilares mais altos nos portões, com arandela, interfone e boca de cartas.
  Por cima dele, **hera** (só verde) em maciços, caindo pelos dois lados.
- **O portão social**: quadro de aço grafite com ripado de madeira e puxador
  de inox; abre sozinho quando alguém chega.
- **A garagem**: o **portão de correr** — o mesmo ripado, num quadro de aço,
  com trilho, motor e guia —, automático: abre quando alguém chega perto da
  boca (ou quando o carro chega, na quest), correndo por dentro do muro, e
  fecha quando todos se afastam. Não tem verga: o carro, que é mais alto
  que ele, passa de laço e tudo. Por cima, o **pergolado** de vigas de aço e
  ripas de madeira (a câmera olha de cima: telhado fechado esconderia o
  carro), e a hera descendo da parede do fundo.
- **O jardim**, fechado dos dois lados (a mureta do lado da garagem, com a
  passagem; o muro do outro): o caminho de **lajes com grama entre elas**, da
  porta ao portão e até a passagem da garagem; **hortênsias** azuis, lilases
  e rosa ao pé da casa; uma fileira de **lavanda** ao longo da mureta; uma
  ilha de pedrisco branco com **agaves** e uma pedra; uma ilha de casca de
  pínus com lavanda, capim e **margaridas**; **costela-de-adão** no canto e
  ao pé da árvore; **capim ornamental** de pluma junto aos muros; dois
  **buxinhos** em vaso de cimento ao lado da porta; e margaridas soltas na
  grama. A árvore florida ficou. O capim, a lavanda e as margaridas balançam
  no vento.
- **A rua**: calçada de pedrinha, guia, asfalto com faixa — e a
  **vizinhança**: oito casinhas do mesmo molde, cada uma de uma cor (quatro
  deste lado, quatro do outro, de frente para cá), sebe na frente dos
  quintais, árvores atrás e nas pontas, e nuvens.

**Inventado por mim, a conferir com o Renan**: como é a casa por fora (cor,
telhado, janelas), o desenho do muro e dos portões, a escolha das plantas e
a vizinhança. O pedido dava o rumo; os detalhes são proposta — se a casa de
verdade for diferente, é só dizer.

**As peças**: `world/frenteDaCasa.ts` (a casa, o pergolado, `muroDoJardim`,
`pilarDoMuro`, `portaoSocial`, `portaoDeCorrer`, `trilhoDoPortao`,
`painelDoPortao`) e `world/plantasDeJardim.ts` (`hortensias`, `lavandas`,
`capins`, `agaves`, `margaridas`, `costelasDeAdao`, `buxinhoNoVaso`,
`heraNosMuros`, e as texturas `cascaDePinus` e `pedrisco`). Cada espécie é
um lote para o jardim inteiro.

**O peso** (a vista de entrada, `renderer.info.render`): a primeira montagem
desenhava **933 objetos por quadro**; juntando o jardim e a vizinhança como
fundo (`fundirComoFundo`) ficou em 339; e a segunda versão, com a casa
maior e as plantas novas, está em **306 desenhos e 188 mil triângulos** (o
parque: 425 e 152 mil; a estufa: 1.325 e 190 mil). O jardim novo é mais leve
que o primeiro: os quatro canteiros redondos e as dez moitas somavam ~70 mil
triângulos e ~40 desenhos; as plantas novas, ~63 mil e 15.

### A quest

| passo | onde | o que acontece |
|---|---|---|
| 0 | — | a lição 10 da apostila do Gatito (`partiu-praia`) concluída libera a quest. Nada avisa: é surpresa |
| 1 | quarto | "Deitar um pouco?" na cama vira DORMIR: os dois deitam, o Ari pega no sono, a tela escurece, amanhece; o Renan pergunta **"Quer ver uma surpresa?"** (flag `bebito:surpresa`) |
| 2 | sala | cutscene: os dois na sala; o Renan diz que já volta, anda até a porta da rua e sai (flag `bebito:renan-saiu`); o Ari, confuso, vai atrás |
| 3 | frente da casa | cutscene em quatro tomadas: (A) o Ari na porta procura o Renan; a buzina; (B) por cima do ombro dele, o carro vem pela rua, de laço no teto, com o Renan dirigindo; (C) da rua, o portão da garagem abre, o carro engata a ré e entra; (D) de perto, os dois na frente do carro. Corações, a memória "O Bebito Mobile" no diário (flag `bebito:ganhou`) |
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
  em fila enquanto anda), `portaDoBebito` e `portaoEletrico` (o portão de
  correr da garagem).

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
2. **A casa por fora** está no rumo certo agora? (o tamanho, o muro com
   hera, os portões, as plantas.) Alguma planta de que o Ari gosta e que
   devia estar no jardim?
3. **Um aviso de que a quest existe?** Hoje nada avisa depois da lição 10 — o
   Ari só descobre quando for deitar. Dá para o Gatito soltar uma dica no fim
   da aula, ou o Renan dizer "tô com sono" ao entrar no quarto.
4. **O laço fica onde?** Hoje some depois da entrega. Ele pode virar um
   enfeite guardado (pendurado na garagem, ou no retrovisor).

## 6. Etapa C — a viagem de carro (feita, escondida)

O pedido do Renan (2026-11-12): "a viagem até o Villa Lobos com a gente
podendo controlar o carro; quero que deixe essa mecânica intuitiva e
divertida. Com obstáculos, ou faixas para pararmos para animais passarem, e
qualquer ideia que julgue que será boa para essa mecânica."

### Como se sai e como se chega

- **Na garagem**, com o carro em casa: "Sair de carro" (a porta do motorista)
  → "Ir de carro pro Villa Lobos?" → **"Quem dirige dessa vez?"** (Ari ou
  Renan). Quem foi escolhido senta no lugar do motorista, de mãos no volante,
  seja quem for que o jogador controla; o outro vai de carona.
- **A estrada** é uma cena própria (`viagem-de-carro`), de ~640 m.
- **No parque**, o carro fica no **estacionamento** do outro lado da rua do
  ônibus (pedido do Renan, 2026-11-12), na vaga dele — rosa, com o coração
  pintado no chão e a plaquinha "BEBITO MOBILE" —, de nariz para a rua, e a
  dupla desce na passagem de pedestres ao lado. Para chegar ao parque: a
  faixa de pedestres atrás do ônibus e o vão da cerca. O "Voltar pra casa"
  do portão vira lembrete ("A pé? A gente veio de Bebito Mobile.") e quem
  leva de volta é o carro ("Voltar pra casa de carro"). Em casa, o carro
  volta para a garagem. Enquanto ele está no parque, a garagem fica vazia —
  e com ele em casa, a vaga do coração fica vazia no estacionamento.

### O estacionamento do Villa Lobos

Uma camada do parque (`eventos/bebitoMobile/noParque.ts`, peças em
`world/estacionamento.ts`), atrás da mesma chave: sem ela, o parque acaba na
rua, como sempre. Com ela:

- a **calçada do outro lado da rua** e uma **cerca viva** correndo na linha
  dela, com duas aberturas: a **passagem de pedestres** (de frente para a
  faixa que cruza a rua atrás do ônibus) e a **entrada dos carros**, com a
  **cancela** que sobe quando alguém chega perto;
- o **lote**: duas filas de vagas de frente uma para a outra, com o corredor
  no meio (setas pintadas: mão única, de quem entra pela cancela), batentes
  de concreto na cabeça das vagas, a zebra da passagem atravessando a fila,
  dois postes, o **totem de pagamento** e a **placa azul do "P"**;
- **quatro carros dos outros** (hatches pequenos, vermelho, amarelo, menta e
  lilás — uma peça leve e de fundo) para o lugar ler como estacionamento;
- o que é alto (árvores) fica no fundo e nos canteiros da calçada longe do
  ponto: do lado da câmera, só cerca viva baixa, e nada tapa o ônibus.

**Inventado por mim, a conferir com o Renan**: o desenho do lote, os carros
dos outros, a vaga rosa com o coração e a plaquinha. Se o estacionamento de
verdade do Villa Lobos for diferente (é de terra? tem árvore no meio das
vagas? fica de outro jeito?), é só dizer.

**O peso**: a vista da chegada de carro (a passagem do estacionamento, com o
ponto do ônibus na tela) desenha ~276 objetos e ~204 mil triângulos — o
parque na entrada de sempre faz ~425 e ~152 mil. O lote inteiro (cerca viva,
carros, batentes, árvores, postes e placas) é um grupo juntado como fundo; a
pintura são três decalques.

### Como se dirige (uma mão só basta)

- **O carro anda sozinho** na velocidade de passeio — ninguém precisa segurar
  nada para ir em frente;
- **o manche** (setas, WASD ou o joystick do celular): para os lados troca de
  faixa; **para baixo freia** (segurando, ele fica parado); **para cima
  acelera** além do passeio;
- **E, espaço ou o botão de ação: a BUZINA**;
- nos primeiros segundos, o painel ensina os comandos.

### O que tem na pista (sorteado a cada viagem)

Cada viagem é uma ROTA nova (a semente é o número da viagem): a curva da
estrada, a ordem dos eventos, de que lado cada um vem. São oito por viagem:

| evento | o que pede | o que acontece |
|---|---|---|
| **faixa de pedestres com bichos** (duas por viagem: a pata com os patinhos, e os tigres-d'água) | PARAR antes da linha e esperar todos passarem | parou: +3 corações e a carona agradece. Não freou: o carro freia SOZINHO, em cima da linha — ninguém é atropelado nunca —, os bichos dão um pulinho de susto e a carona reclama. **A buzina** apressa a pata (ela reclama e corre) e faz o tigre-d'água se esconder no casco e parar — buzinar para tartaruga só atrasa |
| **semáforo** | parar no vermelho | ele fecha quando o carro chega; parado na linha, abre em ~3 s (+2 corações). Furar o vermelho é um tropeço |
| **obra** | trocar de faixa | cones e dois cavaletes com a luz piscando fecham uma faixa. Bater derruba os cones, que saem voando e rolando |
| **buracos** | desviar | três buracos espalhados; a roda que cai dá um tranco e o carro perde velocidade |
| **lombada** | passar devagar | devagar: +1. Rápido: o carro PULA, e a carona reclama |
| **poça** | (é de graça) | passar por ela espirra água das rodas (+1) |
| **ônibus da cidade** | ultrapassar pela outra faixa | ele anda devagar numa faixa; atrás dele o carro só acompanha. Passar: +2. Mais adiante ele encosta e liga o pisca |

E **corações** pela pista: uma fileira mostra a faixa livre antes de cada
obstáculo (seguir os corações é o jeito de aprender sem ler nada), e outras
fazem ondas nos trechos calmos. Placas amarelas de advertência (patos,
tartaruga, lombada, obra, semáforo, buracos) avisam ~35 m antes, e o painel
no alto diz o que fazer ("Pare na faixa!", "Obra na pista: troque de
faixa").

**É um passeio, não uma prova**: nada machuca, nada volta para o começo, a
viagem sempre chega. No fim, a nota (de uma a três estrelas: três é não ter
esbarrado em nada nem assustado ninguém) e os corações. A primeira viagem vira
a memória "A primeira viagem". O save guarda o número de viagens e o recorde
de corações (`bebito:viagens-feitas`, `bebito:recorde-de-coracoes`) — ainda
sem uso; servem para um prêmio, se o Renan quiser.

### A paisagem

Três trechos, cada um de ~210 m: o **bairro** (as casinhas do mesmo molde da
vizinhança da casa do Ari, sebes, hortênsias e postes), a **avenida**
(alameda de palmeiras, bancos de praça, lavanda e capim) e a **beira do
parque** (bosque dos dois lados). Na ida a ordem é casa → bairro → avenida →
parque, e a **roda gigante do Villa Lobos** aparece lá no fim da rua, girando;
a chegada tem o gradil e o portal do parque. Na volta a ordem se inverte e a
casa do Ari (com o muro de hera) espera no fim. Uma viagem em cada três é de
**tarde**, com a luz dourada e os faróis acesos. A música é de estrada (o
clima `viagem-de-carro`: maior, 112 bpm, bumbo e chocalho).

### As falas — PARA O RENAN APROVAR

Quem vai de **carona** comenta o que acontece, num balãozinho de canto (sem
parar o carro). As falas são minhas e estão em `FALAS`, no começo de
`scenes/viagemDeCarro.ts` — duas listas, uma para o Ari de carona e outra
para o Renan. Exemplos: o Ari, na faixa: "Olha os patinhos! Para, para,
para!"; na lombada rápida: "Aaai! A lombada, bebito!"; o Renan, na buzina
para a tartaruga: "Buzinar não ajuda: ela se escondeu.". Na partida:
"Eu dirijo!" (quem dirige) e "Então eu escolho a música." / "Então eu vou
olhando a paisagem." (a carona). Na chegada, uma conversa curta por nota.

### O que ficou para a etapa D (e ideias)

- **As outras rotas**: parque ↔ clube ↔ escola, ao lado do ônibus (a rota já
  aceita outros trechos de paisagem; falta a cena de cada ponta);
- **o rádio do carro** (trocar a música pela tela, como o radinho da
  clareira);
- **levar alguém no banco de trás** (os três lugares já existem) e **deitar
  na cama do carro** (os encostos já deitam);
- um **prêmio pelo recorde de corações** (um detalhe novo para o carro?);
- **de noite**, com os postes acesos.

**O peso** (`renderer.info.render`, a câmera de dirigir): no bairro, o
trecho mais cheio, ~520 desenhos e ~340 mil triângulos; na avenida ~340 e
~280 mil — a régua da clareira (~430–480 e ~355–380 mil). Deles, ~190
desenhos são o carro com a dupla dentro (o mesmo em qualquer cena). A estrada
é feita em trechos de 40 m, cada um um grupo juntado como fundo
(`fundirComoFundo`), e só os trechos de 22 m para trás a 160 m para a frente
são desenhados; cones, corações e respingos são um lote cada.

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

```bash
node scripts/viagem.mjs /tmp/vg               # a viagem inteira
SO=bom CEL=1 node scripts/viagem.mjs /tmp/vg  # a viagem no celular em pé
```

`SO=rota|partida|bom|distraido|manche|volta|estacionamento|perto` roda uma parte; `SEMENTE=7`
escolhe a rota. O teste confere as regras em trezentas rotas sorteadas, sai
de carro pela garagem (os dois casos do "quem dirige"), dirige a viagem
inteira com um piloto de teste (`aristoryBebitoMobile.viagem.piloto = 'bom'`,
o relógio acelerado por `.vezes`), solta o manche para ver o carro frear
sozinho na faixa, aperta as teclas de verdade, faz a volta e fotografa os
bichos e as peças de perto (`.camera`).
