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
- **Só depois do Mania** (pedido do Renan, para a sequência do jogo fazer
  sentido): até a dupla jogar a ÚLTIMA noite da escala do Walter (o turno 6, que
  só abre com as três estrelas no 5, e assim para trás), o clube tem a guarita de
  antes (`guarita()` em `world/props.ts`, guardada). Depois, a nova toma o lugar
  dela, e só a nova desbloqueia a portaria (`guaritaNovaNoClube` em
  `eventos/portariaDoClube.ts`; `?guaritaNova` mostra antes da hora, `?semGuaritaNova`
  força a de antes). A troca é silenciosa: a dupla volta ao clube e ela já está lá.
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

**Feito (2026-11-20), a etapa 1 do §14: AS REGRAS, sem three** (`src/minigames/portaria/`):
- `tipos.ts` — os papéis, o retrato (a foto bate por espécie, cor e marca; penteado e enfeite não contam),
  os assuntos do 💬, as pistas da 🔍, o relógio do expediente e os valores do envelope (um dia bem jogado
  rende R$ 150 a 230, a faixa do turno do Mania);
- `personagens.ts` — a FICHA de cada um (30: os recorrentes, os cinco figurantes por espécie e os bichos do
  jogo): a personalidade em uma linha, o bordão, o JEITO de responder (a Dona Preguiça cochila no meio), as
  falas de cada momento e os NOMES das cinco animações (a cena implementa cada uma);
- `conferencia.ts` — o certo e o errado tirados dos PAPÉIS: as diferenças com o par de pistas que as revela,
  as aparentes que se corrigem (o capacete do Capy, a Luna), o perguntar, o apontar e o carimbo certo;
- `semana.ts` — os seis dias (o roteiro de cada um, como no §13, que muda com os fatos da semana), a lista
  de sócios, os figurantes sorteados por semente e os chamados da fila (o Noel de verdade, o Bento sem
  carteirinha);
- `consequencias.ts` — o envelope linha por linha, as estrelas, o Boletim do Clube (as manchetes com peso:
  a maior consequência na frente), os efeitos na hora, as dicas do parceiro, o save da semana (o dia
  seguinte abre por terminar; refazer um dia troca os fatos dele) e os prêmios.
- O teste: `node scripts/portaria.mjs` (sem navegador): em 150 sementes por dia e nos três caminhos da
  semana (sem fatos, jogando certo, jogando tudo errado), o que o roteiro espera é o que os papéis dizem,
  todo visitante errado é pegável com as ferramentas do dia, e as consequências chegam.
- Um ajuste no arco do Hipólito: barrado na segunda, ele já chega RENOVADO na sexta (com a caixa de som na
  sacola) e de novo no sábado; deixado entrar, continua vencido a semana inteira.

**Falta**: a cena (etapas 3 a 8 do §14). O DESENHO está abaixo, com as decisões do
Renan de 2026-11-20 já incorporadas (§1). Nada dele é código ainda. Para
construir, comece pelo §14 (a ordem das etapas) e leia a seção do pedaço.

---

# O DESENHO DO MINIGAME

## §1 A ideia, e o que o Renan já decidiu

Uma SEMANA trabalhando na portaria do clube com a Gina: em PRIMEIRA PESSOA,
atrás da bancada do guichê, a dupla recebe os documentos de quem quer entrar,
PERGUNTA, APONTA as diferenças e CARIMBA — "ENTRA" ou "HOJE NÃO". Cada dia traz
UMA regra nova e um pedaço de história; o que a dupla decide volta no fim do
dia, no relatório da Gina e no Boletim do Clube, e às vezes nos dias seguintes.

**Decisões do Renan (2026-11-20):**
- na linha de Papers, Please; visão de primeira pessoa; a bancada do lado de
  dentro, onde chegam os documentos; complexo o bastante para ser divertido,
  sem confundir;
- personagens que já existem E personagens novos, genéricos, só deste
  minigame — os recorrentes do §11, cada um com uma personalidade BEM
  distinta (para a gente lembrar de quem aparece muitas vezes) e uma
  ANIMAÇÃO própria;
- o dia seguinte abre só por TERMINAR o anterior (sem trava de estrelas);
- errar faz ganhar MENOS DINHEIRO no fim do turno;
- tem o APONTAR A DIFERENÇA e o PERGUNTAR (questionar os personagens sobre os
  dados, como no jogo de inspiração);
- as ações têm CONSEQUÊNCIA depois, no feedback do fim do dia (§9);
- a casquinha do Mano fica;
- os prêmios são os do §12;
- a ordem do jogo: a guarita nova (e o minigame) só depois da última noite do
  Mania.

## §2 A regra de ouro: divertido sem confundir

- **Uma novidade por dia.** O dia 1 tem um documento e duas coisas para
  conferir; cada dia acrescenta UMA ferramenta ou regra, e a Gina ensina com o
  primeiro visitante do dia, devagar, com a mão em cima da coisa nova.
- **No máximo três documentos e uma coisa errada por visitante.**
- **Errado se VÊ, quase não se lê.** A foto de outro bicho, a data riscada no
  calendário, o número que não está na lista, a resposta que não bate com o
  papel. Comparar desenho com desenho e número com número.
- **O manual da Gina está sempre na bancada**, com o desenho do documento
  certo ao lado de cada regra.
- **Errar não trava**: o dia segue, e quem paga é o envelope do fim do dia e
  a manchete do Boletim. Passeio, não punição.
- **Personagem que volta é personagem que se reconhece de longe**: silhueta,
  cor, jeito de chegar e bordão próprios (§11).

## §3 Como se entra

1. Depois do desbloqueio, a conversa com a Gina ganha a escolha
   **"Trabalhar na portaria"**.
2. Abre a **escala da portaria**: os seis dias da semana, o molde da escala do
   Walter (`ui/escalaDoWalter.ts`) — o nome do dia, a novidade, as estrelas já
   tiradas e o prêmio das três. O dia seguinte abre quando o anterior termina;
   qualquer dia já aberto pode ser rejogado.
3. Escolhido o dia, a dupla entra pela porta da guarita (a `dobradica`) e a
   câmera desliza até os olhos de quem joga, atrás da bancada (o molde da
   câmera de dentro do Bebito, `cameraDeDentro.ts`).
4. No fim do expediente, o fim do dia (§9): o envelope da Gina, o Boletim, e a
   câmera volta para fora.

## §4 A tela, em primeira pessoa

```
┌────────────────────────────────────────────────┐
│ 🕘 10:40   fila: 4   💰 R$ 35      [⏸]         │
│        ┌────────── o guichê ──────────┐         │
│        │  o visitante, de busto,      │ a fila  │
│        │  com o balão da fala         │ no      │
│        └──────────────────────────────┘ portão  │
│ ─────────────────── a bancada ───────────────── │
│ 📕manual 📋lista 📅calendário  📄 📄 📄  🧾transcrição │
│ 💬 Perguntar   🔍 Apontar   [🟢 ENTRA | 🔴 HOJE NÃO]  │
│ (o parceiro no banquinho)            🔔 Próximo!  │
└────────────────────────────────────────────────┘
```

- **Em cima, o guichê**: quem está sendo atendido aparece de busto na janela,
  e atrás dele a FILA no portão (até quatro bichos, cada um esperando do seu
  jeito — a fila também é personagem: quem está bufando, quem dorme em pé).
  O relógio corre das 9h às 17h, comprimido em ~3 minutos e meio.
- **Embaixo, a bancada**: os documentos chegam pela fresta do guichê e se
  espalham no tampo. Toca num documento para ver de perto (no celular ele
  abre grande no meio da tela); arrasta para pôr dois lado a lado.
- **As ferramentas** (fixas): o MANUAL, a PRANCHETA com a lista de sócios
  (a partir do dia 2), o CALENDÁRIO da parede (o "hoje"), a TRANSCRIÇÃO (a
  tirinha do caderninho onde vai tudo o que o visitante responde), o CARIMBO,
  a CAMPAINHA.
- **O parceiro** fica no banquinho, ao lado do monitor; a **Gina** fica de pé
  atrás e se debruça na hora de ensinar.

## §5 O ciclo de um visitante

1. **🔔 Próximo!** — o da frente da fila vem até a janela com a ANIMAÇÃO DE
   CHEGADA dele (§11) e diz o bordão.
2. **Documentos** — ele passa os papéis pela fresta, do jeito dele (a tromba do
   Cookie, a língua do Tatá, a carteirinha tirada de dentro do casco da
   Josefina).
3. **Conferir** — com o manual, a lista, o calendário e o rosto na janela.
4. **💬 Perguntar** — §6. Cada pergunta gasta uns minutos do relógio.
5. **🔍 Apontar** — §7. A diferença marcada é o que faz o visitante confessar
   ou se corrigir.
6. **Carimbar** o documento principal: 🟢 ENTRA, 🔴 HOJE NÃO (e, do dia 5 em
   diante, 🟡 SÓ O CLUBE).
7. **Devolver** pela fresta. ENTRA: o parceiro aperta o botão verde, a cancela
   sobe e o visitante passa com a ANIMAÇÃO DE ENTRAR dele. HOJE NÃO: a Gina dá
   um apitinho educado e ele vai embora com a ANIMAÇÃO DE SAIR BARRADO dele.

Enquanto o visitante espera, ele tem o seu TIQUE (§11) — o Hipólito apoia a
papada no balcão e o balcão range; a Alpacina ajeita o cabelo no reflexo do
vidro. Se a dupla demora muito, ele reage (a fila também).

## §6 Perguntar (o questionamento)

O botão 💬 abre os ASSUNTOS que fazem sentido com os papéis daquele visitante:

| assunto | aparece quando há… |
|---|---|
| "Qual o seu nome?" | sempre |
| "Qual o seu número de sócio?" | carteirinha |
| "Veio fazer o quê?" | sempre |
| "Quem te convidou?" | convite |
| "Pra onde é a entrega?" / "O que é a entrega?" | ordem de entrega |
| "Quando fez o exame?" | exame da piscina |
| "O que tem na sacola?" | sacola |
| "Quantos vocês são?" | convite coletivo (dia 6) |

- **A resposta vai para a TRANSCRIÇÃO** (uma linha nova na tirinha, com o
  rostinho de quem falou). Ela é EVIDÊNCIA: pode ser apontada contra um
  documento (§7).
- **Cada um responde do seu jeito** (§11): o sincero responde certo e rápido;
  o mentiroso responde algo que NÃO bate com o papel (o Beto não sabe o número
  do Bento de cor; o Tatá diz "boliche"); o enrolado responde com uma desculpa
  que é um gancho (o Hipólito: "deixei a nova no outro calção"); a Dona
  Preguiça dorme no meio da resposta e continua de onde parou.
- **Algumas diferenças só aparecem perguntando** — é o que faz a ferramenta
  valer: os documentos do Beto estão perfeitos, quem entrega é a resposta.
- **Perguntar custa tempo** (uns minutos do relógio cada uma): perguntar tudo
  para todo mundo deixa a fila sem atender. A pressão é a fila, não um erro.
- **Perguntar de novo** a mesma coisa irrita (cada um do seu jeito), mas não
  muda a resposta.

## §7 Apontar a diferença

O 🔍 liga a LUPA: toca numa coisa e depois na coisa que não bate com ela.
Valem: um campo de documento, uma linha da transcrição, o rosto na janela, uma
linha da lista de sócios, o dia no calendário, uma regra do manual, um item
da sacola.

- **Se a diferença é de verdade**, as duas coisas ganham um círculo de lápis
  vermelho ligado por um risco, e o visitante reage. Cada diferença tem UM de
  três desfechos, escrito na ficha do dia:
  - **se corrige** — era engano honesto e agora vale: o Capy tira o capacete
    e a foto bate; a Luna sai de trás da Tia Liz e a conta do convite fecha.
    O certo, aí, é 🟢;
  - **confessa** — "tá bom, tá bom…": o certo é 🔴, e a confissão rende bônus;
  - **se enrola** — inventa outra coisa (vai para a transcrição) e continua
    errado: o certo é 🔴, e ninguém precisa acreditar.
- **Se não tem diferença**, aparece "Hm… isso bate", o visitante reage (o
  Seu Hipólito se ofende, a Alpacina acha que é elogio) e foi-se um tempinho.
  Não desconta dinheiro.
- **Apontar não é obrigatório para barrar** — mas quem barra SEM apontar o
  motivo não sabe se acertou até o fim do dia, e perde o bônus.

## §8 Os documentos, e o que pode estar errado

| documento | o que tem | a partir do dia |
|---|---|---|
| **Carteirinha de sócio** | foto, nome, número, validade, o escudo do clube | 1 |
| **Lista de sócios** (prancheta) | nome, número; os suspensos riscados com o motivo | 2 |
| **Convite** | o convidado, o sócio que convidou (com o número), a data | 3 |
| **Crachá + ordem de entrega** | a empresa (nos dois), quem entrega, o destino no clube, o que leva | 4 |
| **Exame da piscina** | a validade (o exame de verdade dos clubes) | 5 |
| **A sacola** (inspeção) | o que a pessoa leva; o proibido do dia vai para a caixa de achados | 5 |
| **Convite coletivo** | a lista de nomes de uma turma | 6 |

O que pode estar errado (no máximo UMA coisa por visitante):
- **Vencida**: a validade é antes do dia do calendário.
- **A foto não bate**: outro bicho, outra cor, sem a pinta, o chifre do outro
  lado. Penteado, óculos, chapéu e capacete NÃO contam (o manual diz) — mas
  capacete na cara impede de ver, e aí se aponta e ele tira.
- **Não está na lista**, o número é outro, ou está **riscado** (suspenso, com o
  motivo bobo escrito: "comeu o sanduíche do salva-vidas").
- **Convite**: data de outro dia; o sócio que convidou não está na lista, ou
  está riscado; o convidado é outro.
- **Entrega**: o destino não existe no clube ("Sala de Boliche"); a empresa do
  crachá é outra que a da ordem; a resposta não bate com a ordem.
- **A resposta não bate com o papel** (§6).
- **Piscina**: o exame vencido não barra o clube — barra a PISCINA: 🟡 SÓ O
  CLUBE (a pulseira amarela).
- **Sacola**: o proibido do dia (caixa de som, copo de vidro, sabão de bolha)
  — toca no item e ele vai para a caixa de achados; o resto do visitante pode
  estar certo e ele entra.

## §9 As consequências (o feedback que volta)

O que a dupla decide volta em TRÊS lugares. Os acertos também voltam — a
semana não pode ser só bronca.

**1. Na hora, no mundo.** Algumas decisões aparecem antes de o dia acabar,
pela janela e pelo som:
- a caixa de som que entrou: a música alta vem da piscina pelo resto do dia
  (e o apito do Capy, irritado, de vez em quando);
- o sabão do Cookie: bolhas subindo atrás do muro da piscina;
- o Tatá que entrou para a "Sala de Boliche": ele passa de novo atrás da fila,
  perdido, perguntando pelo boliche;
- o Jean-Luc disfarçado que entrou: dois visitantes depois, chega o NOEL DE
  VERDADE — "MAS EU SOU O NOEL!";
- o Beto que entrou no lugar do Bento: o Bento aparece no fim da fila, sem
  carteirinha e sem entender nada.

**2. No fim do dia: o envelope e o Boletim.**
- **O envelope da Gina** (o pagamento): uma linha por coisa, com o valor —
  "+R$ 5 · Josefina, tudo certo", "+R$ 3 · a confissão do Jean-Luc",
  "−R$ 8 · o Beto entrou com a carteirinha do Bento", "−R$ 6 · a Alpacina foi
  barrada pelo penteado". O total vai para a carteira do casal. Errar é
  receber menos; o envelope nunca fica negativo.
- **O BOLETIM DO CLUBE** (o jornalzinho de uma folha, pintado em canvas, que a
  Gina prega no mural): duas ou três manchetes do dia, escolhidas pelo que
  aconteceu — primeiro as consequências dos erros, depois as boas. Exemplos:
  "BAILE DO HIPOPÓTAMO NA PISCINA: vizinhos reclamam do pagode"; "MANIA SERVE
  SÓ SALADA: a carne não passou da portaria"; "SUCO QUENTE! Bar do Noel fica
  sem gelo"; "PISCINA VIRA BANHEIRA DE ESPUMA"; "ENTREGADOR PROCURA BOLICHE HÁ
  CINCO HORAS"; e as boas: "PORTARIA EXEMPLAR: nenhum penetra hoje", "CAPY
  ELOGIA A DUPLA: 'olho de salva-vidas'".
- **A Gina comenta** o dia em duas falas, puxando a pior e a melhor coisa.

**3. Nos dias seguintes (o estado da semana).** Os erros (e os acertos)
mudam quem volta e como:
- o Seu Hipólito barrado na segunda RENOVA a carteirinha até sábado; deixado
  entrar vencido, ele nunca renova ("segunda deixaram!") e no sábado o Capy
  conta que o pegou dormindo na espreguiçadeira dos outros;
- a Alpacina barrada pelo penteado volta no dia seguinte com uma FOTO NOVA
  impressa — e ofendida;
- o Jean-Luc que entrou com a carteirinha de Paris monta uma mesa de ping
  pong clandestina no deque (Boletim) e volta no sábado mais confiante; o
  barrado volta no sábado disfarçado, para "se vingar";
- o Beto que entrou errado na terça deixa o Bento sem carteirinha na quarta
  ("o Beto não devolveu!") — e aí o Bento só entra pela lista e perguntando;
- o Mano: aceitar a casquinha na quarta faz ele voltar no sábado com
  casquinha para a fila inteira (e a Gina de cara fechada);
- a carne barrada na quinta: o Walter aparece na sexta, triste, com um prato
  de salada, latindo baixinho;
- a Josefina barrada sem motivo: as hortênsias do jardim murcham (Boletim) e
  ela volta com uma mudinha "para a guarita ficar mais alegre", sem rancor.

**O fim da semana** junta tudo: o BOLETIM DA SEMANA (as melhores e as piores
manchetes), a fala final da Gina (que muda com o total de erros: "olho de
águia" ou "a gente aprende, né?") e a memória no quadro.

## §10 O parceiro e a Gina

- **Quem fica na bancada é quem joga** (o `T` troca antes de começar o dia).
- **O parceiro é o olho extra**: três AJUDAS por dia (o molde da ajuda do par
  na estufa) — ele cutuca e aponta uma coisa suspeita, ou diz "acho que tá
  tudo certo"; e uma vez por dia ele faz uma pergunta sozinho, a mais útil.
  É ele quem aperta o botão da cancela, e comenta os visitantes (as falas
  dele mudam com quem é: o Renan e o Ari reparam em coisas diferentes).
- **A Gina é a supervisora**: ensina a novidade do dia, se debruça por cima
  do ombro em visitante difícil, apita quando a dupla erra (só depois do
  carimbo: ela não entrega a resposta) e faz o envelope.

## §11 Os personagens

Cada um tem: a PERSONALIDADE (em uma linha que dá para lembrar), o JEITO DE
FALAR com o BORDÃO, como RESPONDE às perguntas, a ANIMAÇÃO de chegar, de
esperar (o tique), de entrar, de sair barrado, e de ser apontado — e o ARCO
da semana. Os bichos do jogo continuam sendo eles mesmos: a voz é a que já
têm (todos chamam a dupla de "bebitos").

### Os recorrentes novos (só da portaria)

**SEU HIPÓLITO, o hipopótamo** — o sócio mais antigo do clube, folgado e
encantador; acha que a antiguidade vale mais que qualquer carteirinha.
- *Fala*: alto, devagar, chamando todo mundo de "meu filho" e "minha filha".
  Bordão: **"Meu filho, eu sou sócio desde quando isso aqui era brejo!"**
- *Perguntado*: nunca mente — enrola. Toda resposta vira uma DESCULPA nova:
  "A nova tá no outro calção", "A foto molhou, por isso parece vencida",
  "Vencida? Ela tá é madura!".
- *Chega*: de chinelo, toalha no ombro e a boia de patinho na cintura, se
  abanando com a carteirinha.
- *Tique*: apoia a papada no balcão — o tampo RANGE e verga um pouco.
- *Apontado*: revira os bolsos do calção e vai tirando coisa (o pato de
  borracha, os óculos de natação, um sanduíche) até achar… a mesma
  carteirinha vencida.
- *Entra*: "AÊ!", gira a toalha no ar e passa rebolando.
- *Barrado*: um suspiro tão grande que EMBAÇA o vidro do guichê; vai embora
  devagar, olhando para trás.
- *Arco*: seg vencida · ter vencida, desculpa nova · qua tenta entrar
  "convidado de mim mesmo" · sex caixa de som na sacola com a boia gigante —
  e, se a dupla foi firme na segunda, já RENOVADO · sáb a carteirinha erguida
  como troféu (renovado) ou "segunda deixaram!" (vencido e indignado).

**DONA ALPACINA, a alpaca** — a vaidosa do clube; cada dia um penteado, e
cada penteado é um evento.
- *Fala*: dramática, alongando as vogais, chamando a dupla de "amores".
  Bordão: **"Repara não, amores: penteado novo!"**
- *Perguntado*: responde certo, mas sempre volta ao cabelo ("Veio fazer o
  quê?" — "Mostrar ESTE cabelo, amor").
- *Chega*: jogando a franja (a cabeleira é uma nuvem que balança atrasada).
- *Tique*: se olha no reflexo da folha de vidro e ajeita um fio.
- *Apontada* (foto × rosto): "É o CABELO, amor, o rosto é o mesmo!" — e
  levanta a franja para mostrar a pinta do focinho.
- *Entra*: manda um beijinho e faz uma selfie com a cancela subindo.
- *Barrada*: o penteado MURCHA de uma vez; sai fungando.
- *Arco*: seg coque alto (a foto é de franja: ENTRA) · ter tranças · qua black
  power · qui empresta a carteirinha para a PRIMA, a Alpacona — mesmo
  penteado, mas sem a pinta no focinho (o teste do rosto de verdade) · sex
  exame da piscina vencido: 🟡 ("o cabelo nem molha, amor") · sáb um penteado
  em forma de troféu.

**BENTO E BETO, os gêmeos porquinhos** — idênticos por fora, opostos por
dentro; só o Bento é sócio.
- **Bento**: certinho e nervoso, de gravatinha-borboleta, sabe o próprio
  número de cor. Fala rápido e confere o relógio. Bordão: **"Tudo nos
  conformes, tudo nos conformes."**
- **Beto**: desencanado, boné para trás, chiclete. Bordão: **"Relaxa, é
  rapidinho."** Perguntado o número, chuta ("Um… dois… sete?") e faz bola de
  chiclete. A pinta: o Bento tem uma na orelha ESQUERDA; o Beto, nenhuma.
- *Chegam*: o Bento ajeitando a gravata; o Beto deslizando, mão no bolso.
- *Tique*: o Bento bate o pé; o Beto faz bola de chiclete — que estoura.
- *Apontados*: o Beto fica vermelho (o rosto rosa escurece de verdade) e
  confessa rindo; o Bento, apontado sem motivo, sua.
- *Entram*: o Bento passa na ponta dos pés; o Beto faz "toca aqui" com o ar.
- *Barrados*: o Beto dá de ombros e vai; o Bento fica revoltado, mas educado.
- *Arco*: ter o Beto com a carteirinha do Bento (perguntar o número pega) ·
  qua o Bento CONVIDA o Beto, com convite certinho — os dois ENTRAM (a lição
  de que o mesmo Beto, hoje, está certo) · sáb o Beto aparece com a própria
  carteirinha, novinha: virou sócio.

**TATÁ, o tamanduá do Papita Delivery** — o entregador mais apressado da
cidade; vive no celular e fala por mensagem.
- *Fala*: frases curtas, sem verbo. Bordão: **"Entrega! Assina! Rapidinho!"**
- *Perguntado*: responde lendo o celular, sem olhar — e às vezes lê a entrega
  de OUTRO pedido.
- *Chega*: de patinete, freando com o pé e derrapando até a janela.
- *Tique*: bate o pé, confere o relógio, a mochila térmica do Papita apita.
- *Entrega os papéis*: a LÍNGUA comprida pega a caneta da bancada e já
  assina sozinha.
- *Apontado*: rola a tela do celular… "Ih. Clube errado."
- *Entra*: sai de patinete numa curva fechada, buzininha.
- *Barrado*: "Avaliação: uma estrela!" — e vai, digitando.
- *Arco*: qui o adubo da Josefina (certo) e, à tarde, uma entrega para a
  "Sala de Boliche" · sex os picolés do lanche da piscina · sáb o bolo do Dia
  da Escola.

**DONA PREGUIÇA, a preguiça** — a vovó mais doce do clube, a mais lenta do
mundo, e sempre com uma história de "no meu tempo".
- *Fala*: com reticências, carinhosa, chamando a dupla de "meu bem". Bordão:
  **"Ah, meu bem… no meu tempo…"** — e cochila.
- *Perguntada*: responde em DUAS partes: começa, dorme (zZ), acorda e termina
  a frase. O relógio corre enquanto ela dorme. Nunca mente.
- *Chega*: devagar, de bengala, a bolsa de tricô pendurada; leva tanto tempo
  que a fila inteira suspira junto.
- *Tique*: um bocejo longuíssimo.
- *Apontada*: "Hmm?" — e coloca os óculos devagar, em três tempos.
- *Entra*: acena com a pata… e continua acenando até sumir.
- *Barrada*: os olhos marejam devagarinho — ninguém aguenta (barrá-la sem
  motivo é o erro mais caro do Boletim: "VOVÓ BARRADA NA PORTARIA").
- *Arco*: ter (válida, a lição da paciência) · qua traz o netinho, convidado
  · sex o exame da piscina em dia ("faço hidroginástica, meu bem") · sáb traz
  um cachecol de tricô para a Gina.

### Os figurantes (os genéricos sem nome)

Também não podem ser "qualquer um": cada ESPÉCIE é um TIPO, com um jeito
próprio que se reconhece na fila — o bicho é sorteado da ficha (cor, pinta,
acessório), o jeito vem com a espécie.
- **A lontra brincalhona**: chega boiando de costas numa boia, faz piada;
  tique: equilibra uma pedrinha no nariz.
- **O bode teimoso**: discute tudo; perguntado, responde com outra pergunta;
  barrado, dá uma cabeçada (leve) no balcão.
- **O coala sonolento**: abraça o próprio documento; tique: cochila em pé
  (diferente da Dona Preguiça: ele dorme CALADO e acorda assustado).
- **O panda-vermelho tímido**: fala baixinho e some atrás do balcão quando
  apontado; entrando, dá um pulinho.
- **O texugo resmungão**: reclama do calor, da fila, do clube; tique: bufa e
  cruza os braços; barrado, "eu sabia".

### Os bichos do jogo, na portaria

- **Noel (peru, o bar de sucos)**: chega ATRASADO com caixas de fruta que
  tapam a cara ("BEBITOS! ESQUECI O GELO!"); só depois de pôr as caixas no
  chão a foto bate. Tique: gluglu nervoso. Entra abrindo o leque. Sáb: o
  "Noel" que é o Jean-Luc, e o Noel de verdade logo depois.
- **Josefina (tartaruga, o jardim)**: "Bom dia, meus amores!" — tira a
  carteirinha de DENTRO do casco, devagar. Sempre traz uma mudinha. Barrada,
  some no casco por um tempinho. Qui pergunta se o adubo dela chegou.
- **Capy (capivara salva-vidas)**: chega de moto e de capacete (a foto só
  bate depois de apontar e ele tirar). Tique: alonga o pescoço, confere o
  apito. Na sexta ele pede RIGOR: "Portaria é a primeira linha de segurança!".
- **Jean-Luc (pato francês)**: sobe no caixote para alcançar a janela e
  ajeita os óculos escuros. Dramático: "C'est une catastrophe!". Ter: a
  carteirinha do "Club de Ping-Pong de Paris" ("C'est la même chose!").
  Apontado, desmaia de mentira no caixote. Sáb: o DISFARCE de bigode com a
  carteirinha do Noel — apontado, o bigode cai devagar.
- **Estella (ovelha costureira)**: qua, convidada do Noel. Tira a fita métrica
  e mede a janela do guichê ("Bonita, querida, mas a cortina está curta").
  Entra elogiando o uniforme da dupla.
- **Mano (pinguim sorveteiro)**: qua, SEM convite. Dancinha na janela e a
  CASQUINHA oferecida pela fresta. Aceitar: a casquinha vai para a mochila,
  a Gina pigarreia (−R$ no envelope, e o Boletim: "PORTEIRO FLAGRADO DE
  BIGODE DE SORVETE"). Recusar: "EU RESPEITO." — e sai dançando assim mesmo.
- **Cookie (elefante da bilheteria)**: sex. A tromba passa os documentos pela
  fresta e sopra uma bolhinha; a sacola tem SABÃO DE BOLHA (proibido na
  piscina). Barrado, as orelhas murcham.
- **Walter (o cão garçom, só late)**: qui, do lado de DENTRO do portão,
  esperando a carne do Mania: um "au?" esperançoso a cada entregador. Se a
  carne passa, "AU AU!" e o rabo vira hélice; se não, na sexta ele aparece com
  um prato de salada e um "au…" baixinho.
- **Sábado, o Dia da Escola no Clube** (o convite coletivo, assinado pelo
  GATITO, que é sócio):
  - **Gatito** abre a fila com o "six seven" e a carteirinha de professor;
  - **Tia Liz** com o convite coletivo e uma arepita pela fresta ("¡Mis
    niños!" — aceitar presente de quem está certo NÃO é suborno, a Gina
    deixa); a **Sol** pula para aparecer na janela (só as orelhas), a
    **Estrella** faz estrelinha atrás, e a **Luna** se esconde atrás da Tia
    Liz — o convite tem quatro nomes e só três aparecem: perguntar "Quantos
    vocês são?" ou apontar, e ela sai, tímida;
  - **Flynn** trota no lugar; a sacola tem uma bola de BASQUETE (o proibido é
    a de futebol: entra);
  - **Rocco** com os Dogões, que NÃO estão no convite: marrento ("A gente é
    da escola. Outra escola, mas escola."), uiva quando barrado — e, se
    entra, o Boletim: "GATITOS × DOGÕES TERMINA NA PISCINA";
  - **Valentina** convidada, posa para a "foto da carteirinha"; o **Pietro**
    com o crachá de motorista, e abre o leque quando a cancela sobe.

## §12 Prêmios

- **Reais** todo dia, no envelope (a carteira do casal).
- **Três estrelas em cada dia**, uma peça para os dois: o crachá da portaria
  (1), o apito dourado (2), o quepe de porteiro (3), o colete refletivo (4), a
  pulseira VIP (5) e o uniforme completo (6).
- **A semana terminada**: o selo "Equipe do clube" no Bebito (a vaga do
  para-brisa já existe) e a plaquinha de "Porteiros do mês" na guarita.
- **Memórias** nas histórias: o primeiro dia, a semana inteira, e o disfarce
  do Jean-Luc.

As ESTRELAS do dia: quantos atendimentos certos (o principal), quanto da fila
foi atendido antes das 17h, e se não houve erro "caro" (a Dona Preguiça, a
carne do Mania).

## §13 A semana, visitante por visitante

Os dias têm ROTEIRO (os da história, na ordem) e FIGURANTES sorteados por
semente entre eles. "Pega com" diz a ferramenta que resolve.

**Dia 1 · segunda · O primeiro dia** (a carteirinha; a Gina ensina o 🔍)
| quem | o que tem | o certo | pega com |
|---|---|---|---|
| Noel | as caixas na cara; tudo em dia | 🟢 | esperar ele baixar as caixas |
| Josefina | tudo certo | 🟢 | — |
| Seu Hipólito | vencida | 🔴 | o calendário |
| lontra | tudo certo | 🟢 | — |
| Capy | capacete na cara | 🟢 (depois de apontar) | 🔍 rosto × foto: ele tira |
| coala | a foto é de outro coala (sem a mancha) | 🔴 | 🔍 rosto × foto |
| Dona Alpacina | coque (a foto é de franja) | 🟢 | o manual: penteado não conta |
| bode | vencida | 🔴 | o calendário |

**Dia 2 · terça · A lista de sócios** (a prancheta; a Gina ensina o 💬)
Bento (🟢) · Jean-Luc, carteirinha de Paris (🔴: 🔍 o escudo / a lista) · Beto
com a carteirinha do Bento (🔴: 💬 o número) · Dona Preguiça (🟢: paciência) ·
texugo riscado na lista (🔴) · panda-vermelho com número que não existe (🔴) ·
Seu Hipólito, ainda vencido (🔴) · Alpacina de tranças (🟢) · dois figurantes.

**Dia 3 · quarta · Dia de convidado** (o convite)
Estella, convidada do Noel (🟢) · Mano sem convite, com a casquinha (🔴) ·
Bento convida Beto (🟢 os dois) · Hipólito "convidado de mim mesmo" (🔴) · bode
com o convite de amanhã (🔴) · convidado de um sócio riscado (🔴) · Dona
Preguiça e o netinho convidado (🟢) · Alpacina black power (🟢) · figurantes.

**Dia 4 · quinta · Dia de entrega** (o crachá e a ordem)
Tatá com o adubo da Josefina (🟢) · a carne do Mania (🟢, o Walter esperando) ·
o gelo do Bar do Noel (🟢) · crachá de uma empresa e ordem de outra (🔴) · a
Josefina perguntando do adubo (🟢) · a Alpacona com a carteirinha da Alpacina
(🔴: 🔍 a pinta) · Tatá para a "Sala de Boliche" (🔴: 💬 o destino) · figurantes.

**Dia 5 · sexta · Dia de piscina** (o exame, o 🟡 e a sacola; o Capy olha)
Seu Hipólito com a caixa de som (tirar o som, 🟢) · Cookie com o sabão (tirar,
🟢) · Alpacina com o exame vencido (🟡) · lontra com copo de vidro (tirar, 🟢)
· Dona Preguiça (🟢) · bode com exame vencido querendo piscina (🟡) · Tatá com
os picolés (🟢) · o Walter com a salada, se a carne não passou · figurantes.

**Dia 6 · sábado · O sábado cheio** (tudo junto, o convite coletivo, a fila
maior — ~14)
Gatito (🟢) · Tia Liz e as irmãs (🟢 depois de achar a Luna) · Flynn com a bola
de basquete (🟢) · Rocco e os Dogões (🔴) · Valentina (🟢) e o Pietro (🟢,
crachá) · Seu Hipólito renovado (🟢) ou ainda vencido (🔴) · Bento e Beto, cada
um com a sua (🟢) · Alpacina (🟢) · Tatá com o bolo (🟢) · Dona Preguiça com o
cachecol (🟢) · o Mano, se a casquinha foi aceita · e por último o "Noel"
(o Jean-Luc de bigode, 🔴: 🔍 rosto × foto) — e o Noel de verdade, se o
falso passou.

## §14 Como montar (a ordem das etapas)

1. **As regras, sem three** (`minigames/portariaDoClube.ts`): os dias, os
   documentos, as fichas dos visitantes (o que diz cada papel, o que ele
   responde a cada pergunta, a diferença e o desfecho dela), os FATOS que cada
   decisão grava, as manchetes do Boletim escolhidas pelos fatos, o envelope e
   as estrelas. Testável sem navegador (o molde da rota do Bebito e dos turnos
   do Mania): cada dia tem que ter um certo e um errado alcançáveis, e todo
   visitante "errado" tem que poder ser pego por alguma ferramenta.
2. **O estado da semana no save**: os fatos de cada dia (o que mudou para os
   próximos) e o melhor de estrelas por dia.
3. **A cena** (o interior da guarita, a janela, o portão e a fila), com a
   câmera de primeira pessoa fixa nos olhos de quem joga.
4. **A bancada**: os documentos em canvas (como as memórias e os impressos do
   Bebito), arrastáveis pelo `w.clicavel`; ampliados num painel legível no
   celular; a transcrição; o 💬 e o 🔍.
5. **O bicho genérico** (`entities/bichos/`) montado por ficha, com o retrato
   da carteirinha pintado da mesma ficha; e as cinco espécies figurantes.
6. **Os recorrentes** com as animações deles (chegar, tique, entrar, sair,
   apontado) — o molde de pose e gesto dos bichos do jogo.
7. **O fim do dia**: o envelope, o Boletim e as consequências no dia seguinte.
8. **Os prêmios** e a escala da portaria.
