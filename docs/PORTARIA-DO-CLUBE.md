# A Portaria do Clube — o minigame da guarita da Gina

> Documento de PROJETO. O minigame é o terceiro "grande" do jogo (depois do
> roguelite da estufa, inspirado em Vampire Survivors, e dos turnos do Mania,
> inspirados em Diner Dash): a portaria do clube no molde de **Papers,
> Please**, na versão fofa — a dupla trabalha na guarita com a Gina, confere
> carteirinha, lista de sócios e as regras do dia, e carimba quem entra.
> O `git log` é a fonte da verdade do que existe.

## COMECE AQUI

**Feito (2026-11-20), a etapa 0: a guarita nova e o desbloqueio.**

- **A guarita nova** (`src/world/guaritaDoClube.ts`, `GuaritaDoClube`, medidas em
  `GUARITA_DO_CLUBE`): de 2,6 × 2,2 para 4,8 × 3,5, no mesmo lugar (a frente
  continua em `z = 3,7` e o lado do portão onde estava; ela cresceu para os
  fundos e para o lado da piscina). Reboco creme com furo de verdade, rodapé
  verde, pilastras de frisos, guichê largo com folhas de vidro de correr e o
  balcão de madeira nas mãos-francesas (livro de visitas, plaquinha da
  carteirinha, carimbo, campainha, vasinho), telhado de quatro águas com o
  lambrequim, a placa "PORTARIA" com o escudo e o catavento de girafa, relógio,
  câmera de segurança, arandela, floreira, ar-condicionado e a PORTA no lado
  `+X`. Por dentro: ladrilho hidráulico, duas bancadas de cada lado do lugar da
  Gina (o monitor com as quatro câmeras do clube, o painel do portão, o
  telefone, o rádio; o fichário das carteirinhas, os carimbos, a garrafa
  térmica), o quadro de chaves, o mural de cortiça, o arquivo de aço, o
  garrafão, o cabideiro com o quepe reserva e o banquinho alto.
- **Pronto para o trabalho lá dentro**: tudo acima da parede mora no grupo
  `teto` (`guarita.mostrarTeto(false)`), a folha da porta no grupo
  `dobradica`, e o meio entre as bancadas é livre (a Gina e mais dois).
  ATENÇÃO: tirar o teto não basta para a isométrica de sempre — as paredes de
  3,4 m do lado da câmera escondem ~3 m do piso. Sem o teto, quem vê a sala é
  uma câmera de cena por cima (`setCameraOmbro`); a foto de cima está na
  pergunta 1 abaixo.
- **O desbloqueio** (`src/eventos/portariaDoClube.ts`, ideia de manter atrás de chave
  é do Claude, para o Renan decidir): a PRIMEIRA conversa com
  a Gina na guarita nova é a da reforma — ela mostra a guarita e convida a dupla
  para a portaria; grava `portaria:liberada`, a memória "A guarita nova" e o
  aviso "Minigame desbloqueado". Quem ainda não conhecia a Gina ouve a
  apresentação de sempre antes. Depois disso, a conversa volta a ser a de
  sempre. **As falas são provisórias** (o Renan ainda não escreveu as dele).
- **A chave**: `PORTARIA_NO_JOGO = false`. Desligada, a conversa com a Gina é a
  de sempre e o save não ganha flag — para a "primeira vez" do Ari não ser
  gasta antes de o minigame existir. `?portaria` liga para testar, num save à parte
  (`aristory.save.v1.portaria`, cópia do de verdade);
  `?semPortaria` força desligado. Ligar é decisão do Renan.
- **O teste**: `node scripts/guarita.mjs` (o posto, a cabeça contra a frente e o
  balcão que a peça declara, o `teto` e a `dobradica`, e o desbloqueio sem e
  com a chave, de quem já conhecia a Gina e num save do zero).
- **O peso**: a guarita tem 39 malhas e ~25 mil triângulos depois da `fundir()`
  e da `juntarPorCor`; na vista de perto da portaria, 533 → 546 desenhos por
  quadro.

**Falta**: o minigame inteiro. As perguntas abaixo vêm antes de qualquer código.

## Perguntas ao Renan (próxima etapa)

1. Onde se joga: **dentro da guarita** (o teto sai e uma câmera de cena fica
   por cima — a isométrica de sempre não enxerga o piso por cima das paredes —,
   a fila de bichos chegando pelo portão) ou numa **tela própria** de balcão (o
   documento na mesa, como no jogo de inspiração)?
2. Quem entra na fila: só os bichos que já existem (Noel, Josefina, Capy,
   Walter, Mano, Cookie, Jean-Luc, Estella, a turma da escola…) ou também
   sócios inventados para o minigame?
3. A progressão: uma semana de turnos com uma regra nova por dia (o molde da
   escala do Walter)? E o prêmio de cada turno (roupa, enfeite, selo para o
   Bebito)?
4. O tom das "fraudes": a carteirinha vencida, a foto que não bate, o Jean-Luc
   disfarçado, o Cookie com a tromba na frente da foto… quais piadas internas
   de vocês podem entrar?
5. O que se faz com as mãos: carimbar (aceitar/recusar), apitar, abrir a
   cancela no painel, olhar a câmera, consultar a lista de sócios?
