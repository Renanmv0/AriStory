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

**Falta**: o minigame inteiro. O DESENHO está abaixo (§1 a §12, rascunho de
2026-11-20, com as decisões do Renan já tomadas marcadas como tal); as
perguntas em aberto estão no §13. Nada dele é código ainda.

---

# O DESENHO DO MINIGAME (rascunho)

## §1 A ideia em uma frase

Uma SEMANA trabalhando na portaria do clube com a Gina: em PRIMEIRA PESSOA,
atrás da bancada do guichê, a dupla recebe os documentos de quem quer entrar,
confere com as regras do dia e CARIMBA — "ENTRA" ou "HOJE NÃO". Cada dia traz
UMA regra nova e um pedacinho de história com os bichos do jogo.

**Decisões do Renan (2026-11-20):** na linha de Papers, Please; visão de
primeira pessoa; a bancada do lado de dentro, onde chegam os documentos;
complexo o bastante para ser divertido, sem confundir; aparecem os personagens
que já existem E personagens novos, genéricos, só deste minigame. E a ordem do
jogo: a guarita nova (e o minigame) só depois da última noite do Mania.

## §2 A regra de ouro do desenho: divertido sem confundir

- **Uma novidade por dia.** O dia 1 tem um documento e duas coisas para
  conferir; cada dia acrescenta UMA (um documento novo ou uma regra nova), e a
  Gina ensina a novidade com o primeiro visitante do dia, devagar.
- **No máximo três documentos por visitante**, e no máximo uma coisa errada.
- **Errado se VÊ, quase não se lê.** A foto de outro bicho, a data riscada em
  vermelho no calendário, o número que não está na lista: o jogo é comparar
  desenho com desenho e número com número, não ler parágrafo.
- **O manual da Gina está sempre na bancada**, com o desenho de um documento
  certo ao lado de cada regra.
- **Errar não trava**: a Gina dá uma advertência e o dia segue. Passeio, não
  punição (o mesmo espírito do Bebito, que nunca deixa atropelar).

## §3 Como se entra

1. Depois do desbloqueio, a conversa com a Gina ganha a escolha
   **"Trabalhar na portaria"**.
2. Abre a **escala da portaria**: os seis dias da semana, o mesmo molde da
   escala do Walter (`ui/escalaDoWalter.ts`) — o nome do dia, a novidade, as
   estrelas já tiradas e o prêmio.
3. Escolhido o dia, a dupla entra pela porta da guarita (a `dobradica` já
   existe) e a câmera desliza até os olhos de quem joga, atrás da bancada
   (o molde da câmera de dentro do Bebito, `cameraDeDentro.ts`).
4. No fim do expediente, a Gina dá o **relatório do dia** (acertos, erros, as
   estrelas, os reais) e a câmera volta para fora.

## §4 A tela, em primeira pessoa

```
┌────────────────────────────────────────────┐
│  🕘 09:40        [relógio do expediente]   │
│                                            │
│      ┌──────── o guichê ────────┐          │
│      │   o visitante, de busto  │  a fila  │
│      │  (fala num balão curto)  │ no portão│
│      └──────────────────────────┘          │
│ ─────────────── a bancada ──────────────── │
│ [📕 manual] [📋 lista]   📄 📄 📄   [🔴🟢 carimbo] │
│ (o parceiro de lado, no banquinho)  [🔔 Próximo!] │
└────────────────────────────────────────────┘
```

- **Em cima, o guichê**: quem está sendo atendido aparece de busto na janela,
  e atrás dele a FILA no portão (até quatro bichos, cada um com o seu jeito
  de esperar). O relógio corre das 9h às 17h, comprimido em ~3 minutos.
- **Embaixo, a bancada**: os documentos chegam pela fresta do guichê e se
  espalham no tampo. Toca num documento para ver de perto (no celular ele
  abre grande no meio da tela); arrasta para comparar dois lado a lado.
- **As ferramentas** (fixas na bancada): o MANUAL da Gina, a PRANCHETA com a
  lista de sócios, o CARIMBO de duas cores e a CAMPAINHA de "Próximo!".
- **O parceiro** fica no banquinho, ao lado do monitor; a **Gina** fica de pé
  atrás, e se debruça para explicar a novidade do dia.

## §5 O ciclo de um visitante

1. **Campainha** — o próximo da fila chega à janela e diz uma frase curta.
2. **Documentos** — ele passa os papéis pela fresta.
3. **Conferir** — com o manual, a lista e o rosto de quem está na janela.
4. **Apontar** (opcional, o "interrogatório" fofo) — a LUPA: toca numa coisa
   de um documento e na coisa que não bate (outro documento, a lista ou o
   rosto). Se a diferença é de verdade, o visitante reage: confessa, inventa
   uma desculpa, ou mostra o documento certo que estava no bolso. Apontar não
   é obrigatório para recusar, mas rende um bônus e as falas mais engraçadas.
5. **Carimbar** o documento principal: 🟢 ENTRA ou 🔴 HOJE NÃO.
6. **Devolver** pela fresta. Se entrou, o parceiro aperta o botão verde e a
   cancela sobe; se não, a Gina dá um apitinho educado e ele vai embora (cada
   um com a sua reação).

## §6 Os documentos

| documento | o que tem | aparece no dia |
|---|---|---|
| **Carteirinha de sócio** | foto, nome, número, validade | 1 |
| **Lista de sócios** (fica na prancheta) | nome, número, os suspensos riscados | 2 |
| **Convite de convidado** | o nome do convidado, o sócio que convidou (com o número) e a data | 3 |
| **Crachá + ordem de entrega** | a empresa, quem entrega, para onde no clube (Mania, Bar do Noel, Estufa), o que leva | 4 |
| **Exame da piscina** | a validade do exame (o de verdade dos clubes brasileiros) | 5 |
| **A sacola** (inspeção) | o que a pessoa leva — o proibido do dia vai para a caixa de achados | 5 |

## §7 O que pode estar errado (sempre no máximo uma coisa por visitante)

- **Vencida**: a validade é antes de hoje (o calendário da parede mostra hoje).
- **A foto não bate**: outro bicho, outra cor, sem a pinta, sem o chifre.
  Penteado, óculos e chapéu NÃO contam (o manual diz) — é a pegadinha da
  Dona Alpacina, que muda de penteado toda semana.
- **Não está na lista**, o número é outro, ou está **riscado** (suspenso: o
  motivo vem escrito, e é sempre bobo — "correu na borda da piscina").
- **Convite**: data de outro dia, ou o sócio que convidou não está na lista.
- **Entrega**: o destino não existe no clube ("Sala de Boliche"), ou a ordem
  é de outra empresa que o crachá.
- **Piscina**: o exame vencido não barra o clube — barra a PISCINA. Esse é o
  único caso de um terceiro carimbo, 🟡 SÓ O CLUBE (pulseira amarela), e ele só
  aparece no dia 5.
- **Sacola**: o proibido do dia (copo de vidro, caixa de som, bola de futebol)
  — tira e põe na caixa de achados; o resto do visitante pode estar certo.

## §8 A semana na portaria (seis dias, como as seis noites do Mania)

| dia | nome | a novidade | quem aparece (história) |
|---|---|---|---|
| 1 · seg | **O primeiro dia** | a carteirinha: validade e foto | a Gina ensina com o Noel e a Josefina; o Seu Hipólito com a carteirinha vencida (o tutorial do 🔴); o Capy de capacete — a foto só bate depois de apontar e ele tirar |
| 2 · ter | **A lista de sócios** | a prancheta: número e suspensos | o Jean-Luc com a carteirinha do "Club de Ping-Pong de Paris"; os gêmeos porquinhos trocando a carteirinha |
| 3 · qua | **Dia de convidado** | o convite | a Estella, convidada do Noel; o Mano sem convite, oferecendo uma casquinha por fora (aceitar dá a casquinha e uma advertência da Gina) |
| 4 · qui | **Dia de entrega** | o crachá e a ordem de entrega | o Tatá do Papita Delivery; a carne do Mania (o Walter esperando do lado de dentro); o adubo da Josefina; um entregador para a "Sala de Boliche" |
| 5 · sex | **Dia de piscina** | o exame da piscina, o 🟡 e a sacola | o Capy pede rigor; o Seu Hipólito com uma boia gigante e uma caixa de som na sacola |
| 6 · sáb | **O sábado cheio** | tudo junto, e a fila maior | a turma da escola (a Tia Liz e as irmãs convidadas, o Flynn, o Rocco tentando trazer os Dogões sem convite, a Valentina com o Pietro de crachá de motorista); e o final: o Jean-Luc DISFARÇADO de bigode, com a carteirinha do Noel |

Cada dia tem ~10 visitantes (o 6 tem ~14), um terço deles com algo errado.

## §9 Placar, erros e estrelas

- Cada atendimento certo paga reais para a CARTEIRA DO CASAL (a mesma de
  sempre) e cada "apontar" certo dá um bônus.
- Errar (deixar entrar quem não podia, ou barrar quem podia) é uma
  **advertência** da Gina: o visitante comenta, ela apita, e o dia segue. As
  duas primeiras do dia são de graça; da terceira em diante, desconta.
- **Estrelas** pelo dia: quantos certos, quantas advertências e quanto da fila
  foi atendido antes das 17h. (A trava para o dia seguinte é pergunta, §13.)
- O relatório do fim do dia é a Gina com a prancheta, falando dos números e
  de quem passou por ali.

## §10 O parceiro e a Gina

- **Quem fica na bancada é quem joga** (o `T` troca antes de começar o dia).
- **O parceiro é o olho extra**: três AJUDAS por dia (o molde da ajuda do par
  na estufa) — ele aponta uma coisa suspeita, ou diz "acho que tá tudo
  certo". E é ele quem abre a cancela e comenta os visitantes.
- **A Gina é a supervisora**: ensina a novidade do dia, apita quando a dupla
  erra, e no fim dá o relatório. São sempre dois em cena — e aqui são três.

## §11 Os personagens

**Os que já existem** entram com a ficha deles (a classe de sempre, de busto na
janela) e um retrato pintado para a foto da carteirinha.

**Os novos, genéricos, só do minigame**: um bicho genérico montado por FICHA
(espécie, cor, pinta, acessório), para a fila ter variedade e a foto ser
sorteada junto com ele — a foto "errada" é a mesma ficha com uma coisa
trocada. Espécies que ainda não existem no jogo: hipopótamo, alpaca, coala,
panda-vermelho, lontra, porquinho, bode, tamanduá, preguiça, texugo. (Nada de
rato, golfinho ou barata.)

E alguns com nome, que voltam durante a semana (o "personagem recorrente"
que é a alma da inspiração):
- **Seu Hipólito**, o hipopótamo: a carteirinha sempre vencida e uma desculpa
  nova por dia; no sábado ele aparece com ela renovada, orgulhoso.
- **Dona Alpacina**, a alpaca vaidosa: um penteado novo por dia (e a foto
  continua valendo — é a lição de que penteado não conta).
- **Bento e Beto**, os gêmeos porquinhos: só um é sócio, e eles revezam a
  carteirinha.
- **Tatá**, o tamanduá do Papita Delivery: o entregador apressado.
- **Dona Preguiça**: tão devagar na janela que a fila inteira suspira.

## §12 Prêmios (proposta)

- **Reais** todo dia, na carteira do casal.
- **Três estrelas em cada dia**, uma peça para os dois, como no Mania: o
  crachá da portaria (1), o apito dourado (2), o quepe de porteiro (3), o
  colete refletivo (4), a pulseira VIP (5) e o uniforme completo (6).
- **A semana fechada**: o selo "Equipe do clube" no Bebito (a vaga do
  para-brisa já existe) e a plaquinha de "Porteiros do mês" na guarita.
- Uma memória no quadro por história (o primeiro dia, o disfarce do
  Jean-Luc…).

### Como montar (para quem for construir)

- **As regras sem three** (`minigames/portariaDoClube.ts`): os dias, os
  documentos, a geração dos visitantes por SEMENTE com a garantia de quantos
  erros e de qual tipo, e a conta das estrelas — testável sem navegador,
  como a rota do Bebito e os turnos do Mania.
- **Uma cena própria** (o interior da guarita, a janela, o portão e a fila),
  com a câmera de primeira pessoa fixa nos olhos de quem joga.
- **Os documentos são canvas** (como as memórias e os impressos do Bebito):
  em cima da bancada, em 3D, arrastáveis pelo `w.clicavel`; ampliados num
  painel legível no celular.
- **O bicho genérico** é uma classe nova de `Bicho` montada por ficha, e o
  retrato da carteirinha é pintado da mesma ficha.

## §13 Perguntas em aberto ao Renan

1. **A trava**: o dia seguinte abre com três estrelas no anterior (como no
   Mania), ou basta terminar o dia?
2. **O erro**: só estrelas e advertência, ou desconta da carteira a partir
   da terceira?
3. **A lupa (apontar)** entra já na primeira versão? É o que mais dá graça,
   e o que mais dá trabalho.
4. **Os recorrentes**: os nomes e as espécies servem? Tem alguma piada interna
   de vocês, ou alguém da vida real, para virar visitante?
5. **Os prêmios** do §12 servem, ou algum deles tem que ser outra coisa?
6. **O Mano e a casquinha** (o "suborno" fofo): entra, ou é melhor sem?
