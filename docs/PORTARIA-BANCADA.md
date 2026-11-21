# A bancada interativa da portaria

A mesa 3D passa a ser a vista inicial do expediente. A campainha chama o
visitante, a mão/pata/asa apresenta os papéis pela calha e cada documento
pode ser tocado para abrir a leitura. Manual, data, lista, lupa e os carimbos
usam as mesmas ações do painel e respeitam as ferramentas disponíveis do dia.
A mesa tem mais espaço na frente, bandeja de feltro, sacola e caixa de achados.

## As três vistas

- Bancada: documentos e ferramentas no mundo, com realce e dica no mouse,
  áreas de toque ampliadas e atalhos para leitura e sacola.
- Documento: o painel original para ler, perguntar e comparar evidências.
- Visitante: câmera frontal com enquadramento mais largo para grupos e uma
  miniatura do documento apresentado, sem corrigir sua foto. O clique no
  visitante seleciona rosto com a lupa ou abre esta vista normalmente.

Recolher conserva a folha, a rolagem e a primeira seleção da lupa. Não chama
`fechar()`, que encerra o painel e seus balões. As mudanças de câmera têm
interpolação e respeitam a preferência por movimento reduzido.

A lista de sócios tem **Ampliar lista**, controles de **+ / −** e **Ajustar**.
Ampliada, permite rolagem por toque ou mouse e mantém a comparação com a lupa.
O canvas é redesenhado na resolução do zoom, e a rolagem sobrevive às atualizações.

## Coreografia e regras

O membro de entrega é uma referência pública opcional em `Bicho`, implementada
por cada anatomia. O adaptador da portaria restaura a pose base antes de
atualizar o bicho e só depois aplica o gesto. Os documentos seguem a mão,
a calha e a área de leitura; a devolução percorre o caminho inverso.

Ao pedir a sacola, a bolsa chega, os itens reais do atendimento saem para
inspeção, e o clique abre a escolha correspondente. O permitido volta à
bolsa, e o proibido permanece na caixa de achados até o fim da cena.

As ferramentas esperam o fim de entregas, movimentos e carimbadas. O relógio
não cobra essas animações; observar e ler mantêm as regras de tempo do
expediente. Decisões, pagamento, estrelas e fatos continuam no `Expediente`.

O dia 1 mostra **Sem limite**: leitura e ferramentas não avançam o relógio,
e a fila só termina por atendimento ou encerramento escolhido. Nos dias 2 a 6,
os limites são 10, 12, 12, 15 e 20 minutos de atendimento. Não é preciso esperar
o prazo: ao acabar a fila, o expediente pode ser fechado normalmente.

A comparação visual inclui os disfarces do Jean-Luc, o capacete removível do
Capy e os acompanhantes. O elevador conserva a altura do rosto principal,
sem usar a altura dos acessórios ou do grupo. A Luna escondida fica atrás,
com as orelhas acima do responsável, e aparece ao apontar a diferença.

`ClicavelDef.duranteTrava` só permite os alvos que a cena declarou. Falas,
menus, transições e outros painéis ainda bloqueiam o apontador. A cena também
protege suas ações contra reentrada e limpa seus estados ao desmontar.

## Filas e motivos da visita

As mecânicas se acumulam: o dia 3 mistura sócios e convidados; a partir do
dia 4 continuam chegando os dois, além das entregas. Nos dias 5 e 6 há também
quem usa a piscina e quem veio só ao clube; o sábado acrescenta o convite
coletivo. A mistura usa lugares existentes no roteiro, mantendo as cenas
da carne, do adubo, do gelo e os desfechos da semana.

O motivo de um entregador vem dos itens e do destino da ordem daquele
atendimento, passando pelo jeito de falar do personagem. Uma resposta
específica do roteiro tem prioridade. Mesmo sem ordem, o crachá dá a empresa
da entrega. Os figurantes dos últimos dias esclarecem se pretendem usar a piscina.

## Lembranças entre dias

Ao fechar o expediente, os atendimentos concluídos dos personagens novos
ficam guardados em `portaria:encontros:v1`, no armazenamento já existente do
save de teste. Quem não foi atendido não ganha uma lembrança inventada.
O próximo dia usa somente visitas anteriores: entrou, ficou só no clube ou
foi barrado. A saudação segue a personalidade, junto das falas do roteiro.

Barrados sem presença prevista ganham prioridade nas vagas dos figurantes,
com documentos válidos para tentar novamente. Mantêm identidade, aparência
e matrícula; entregadores preservam empresa e carga. Os retornos respeitam
as regras disponíveis, a mistura da fila e o espaço existente; quem não couber
pode voltar nos dias seguintes. Personagens já previstos não são duplicados.

O histórico distingue o Beto do Bento mesmo quando um usa o nome do irmão.
Refazer um dia substitui apenas os registros daquele dia, e não faz uma fase
anterior lembrar de encontros futuros. Saves antigos continuam funcionando;
as novas lembranças são registradas a partir dos expedientes concluídos com
esta atualização. Os fatos de história anteriores continuam valendo.

Os personagens que já existiam no jogo partem do vínculo que já têm com a
dupla. O Jean-Luc conserva seu roteiro de seis disfarces e sua memória de
quando foi pego; esta camada não acrescenta falas de apresentação a ele.

## Abertura com a Gina

Antes de cada um dos seis dias, a câmera já está no banco de quem joga.
A Gina vira para a dupla e apresenta a novidade em três recados curtos:
boas-vindas, demonstração e lembrete das conferências anteriores.
Quem joga avança no próprio ritmo ou usa **Pular explicação** (Escape no
computador). O relógio e os atendimentos só começam depois da abertura.

Os exemplos usam papéis 3D separados dos visitantes: deslizam da bancada da
Gina e se erguem para leitura com o calendário ou a lista quando necessário.
No dia 5, o exemplo de exame vencido recebe o carimbo amarelo. Os papéis e
as ferramentas voltam ao lugar antes do primeiro atendimento, inclusive se
a abertura for pulada no meio da animação. O exemplo não altera decisões,
memória, pagamento nem a fila. Movimento reduzido remove os acenos e a
interpolação dos enquadramentos.

## Retorno dos erros no envelope

O envelope traz até dois casos concretos, escolhidos entre os atendimentos
com erro: decisão da dupla, decisão correta, motivo e quais pistas comparar
na próxima vez. Casos caros têm prioridade, sem repetir o mesmo assunto ou
o mesmo visitante. Os valores e as manchetes continuam visíveis abaixo.

As explicações usam a conferência e a avaliação do dia, sem alterar nota,
pagamento, memória ou fatos. Exame vencido restringe a piscina, item proibido
vai para os achados e não muda o carimbo, e aparências corrigíveis não viram
irregularidade de identidade. Perguntas não feitas são descritas como uma
conferência possível, sem afirmar que a dupla ouviu a resposta.

Sem erros, o recado elogia somente os atendimentos feitos. Sem atendimentos,
não inventa um acerto ou um caso para revisar.

## Presentes pelas três estrelas

Cada dia tem um presente de roupa permanente para **Ari e Renan**:

| Dia | Presente | Acabamento |
| --- | --- | --- |
| 1 | Crachá da portaria | Cordão costurado, moldura dourada, girafinha e coração |
| 2 | Apito dourado | Cordão menta, tambor de latão e pingente de coração |
| 3 | Quepe de porteiro | Copa creme, aba curva verde, escudo e botões de coração |
| 4 | Colete refletivo | Gola creme, bolsos, faixas refletivas e bordado |
| 5 | Pulseira VIP | Três estrelinhas douradas, contas e coração no pulso esquerdo |
| 6 | Uniforme completo | Camisa, calça com filetes e tênis de sola em camadas; três peças por pessoa |

A Gina apresenta os presentes depois do seu recado de fim do dia e antes do
envelope. A prova 3D permite alternar entre os dois, girar e aproximar o
detalhe. O uniforme tem girafinha no peito, gola e mangas creme, botões
dourados e três estrelas com um coração nas costas.

As peças vão diretamente para os dois guarda-roupas, sem vestir automaticamente
nem ocupar a mochila. Crachá e apito são alternativas na vaga de acessório;
colete e camisa, na de tronco. A pulseira também pode ser usada na piscina.
As cores dos prêmios não entram no tingimento.

A entrega usa a **melhor nota salva** e é registrada antes da apresentação.
Quem já tinha três estrelas recebe ao voltar à guarita, sem precisar refazer
o dia. Abrir um guarda-roupa também repõe essas peças para marcas antigas;
a apresentação da Gina continua disponível uma vez. Recarregar não perde
nem duplica presentes. O uniforme completo acrescenta uma entrada no diário.

O selo do Bebito e a placa da semana inteira continuam como próximos passos.

## Agradecimento pela primeira semana

Depois do envelope do último dos **seis primeiros dias concluídos**, a Gina
se aproxima da dupla na guarita. A câmera permanece no banco de quem joga:
acompanha a chegada, o cartão na boca, a entrega na bancada, o agradecimento
e uma resposta de quem está no banco ao lado. No fim, ela volta caminhando
ao posto. A homenagem celebra a companhia e o aprendizado, sem exigir três
estrelas e sem dizer que o minigame terminou.

O cartão tem papel dobrado que se abre e se sustenta no tampo, escudo do
clube, margem dourada, coração e uma dedicatória para Ari e Renan. A Gina
abaixa o pescoço, faz acenos e olha para a dupla; as orelhas e o sorriso
acompanham a conversa. Uma luz de apoio sem sombras extras ilumina o rosto,
como na abertura do expediente. Cada recado avança no ritmo de quem joga;
**Pular cena** e Escape encerram a apresentação com limpeza dos objetos.

A flag `portaria:homenagem:primeira-semana` só é gravada ao assistir ou pular.
Interromper a cena antes disso permite vê-la depois, sem repetir pagamento.
Saves com os seis dias já concluídos recebem a conversa na próxima visita à
portaria. O marco é fixo nos dias 1–6, para continuar correto quando a escala
ganhar dias novos. Notas, prêmios e histórico dos visitantes são preservados.

Preview direto: `?portaria&cena=portaria&dia=6&homenagem`. Esse atalho mostra a
cena sem concluir dias ou consumir a flag da homenagem. A portaria permanece
no modo de teste. Selo, plaquinha e memória da semana continuam planejados.

## Publicação e validação

`PORTARIA_NO_JOGO` continua **false**. O acesso permanece por `?portaria`,
com save separado; não se liga o minigame no fluxo normal do jogo.

- `npm run build`
- `node scripts/portaria.mjs`: regras e consequências sem navegador.
- `node scripts/portariaMemoria.mjs`: persistência, replays, retornos e seis
  dias em 40 sementes, nas políticas de atender certo, barrar e deixar entrar.
- `node scripts/portariaRevisao.mjs`: explicações dos erros dos seis dias,
  identidade, perguntas não feitas e casos que não geram erro.
- `node scripts/portariaPremios.mjs`: seis presentes, nota mínima, entrega
  para os dois, peças cosméticas, marcas antigas e entrega única.
- `node scripts/portariaPremiosCena.mjs /tmp/premio`: prova dos seis modelos
  nos dois personagens, frente/costas/detalhe, celular, toque cancelado,
  persistência e ausência de prêmio abaixo de três estrelas.
- `node scripts/portariaPremiosRoupas.mjs /tmp/premios-roupas`: guarda-roupa
  real, pais das peças no rig, caminhada, calças sentadas no banco e reload.
- `node scripts/portariaHomenagem.mjs`: seis dias concluídos, notas variadas,
  apresentação única e marco fixo da primeira semana.
- `node scripts/portariaHomenagemCena.mjs /tmp/homenagem`: computador,
  celular, câmera em primeira pessoa, cartão físico, parceiro correto,
  persistência, pulo, movimento reduzido e cancelamento sem consumir a cena.
- `SO=dia DIA=6 CEL=1 SEMANA=1 node scripts/portariaCena.mjs /tmp/semana`:
  dia seis completo, entrega do prêmio, envelope, homenagem e volta ao clube.
- `SO=cartao-de-agradecimento-da-gina SEM_FUNDIR=1 node scripts/zfighting.mjs`:
  a peça é arredondada e não contém caixas retas mensuráveis pelo detector;
  a dobra, as faces e a colocação no tampo também são conferidas nas fotos.
- `node scripts/portariaRevisaoCena.mjs /tmp/revisao`: erros pela interface,
  leitura do envelope em computador/celular, valores e estados sem revisão.
- `node scripts/portariaAbertura.mjs /tmp/abertura`: os seis recados,
  exemplos 3D, câmera do banco, celular, movimento reduzido e pulo durante
  voos/carimbadas, sem cobrar tempo ou deixar exemplos na mesa.
- `node scripts/portariaBancada.mjs /tmp/bancada`: cliques no canvas,
  computador/celular, entrega, leitura, comparação, carimbo e save isolado.
- `SACOLA=1 DIA=5 node scripts/portariaBancada.mjs /tmp/sacola`: inspeção física.
- `SACOLA=1 PROIBIDO=1 DIA=5 node scripts/portariaBancada.mjs /tmp/achados`:
  o item proibido permanece fisicamente nos achados.
- `GRUPO=1 DIA=6 node scripts/portariaBancada.mjs /tmp/grupo`: comparação com
  convite coletivo, lupa no visitante e a Luna saindo de trás da responsável.
- `SO=dia DIA=1 node scripts/portariaCena.mjs /tmp/dia1` e
  `SO=dia DIA=6 CEL=1 node scripts/portariaCena.mjs /tmp/dia6`: dia completo,
  envelope igual ao expediente sem cena e volta liberando os dois bancos.
- `SO=mesa-da-portaria,sacola-da-portaria SEM_FUNDIR=1 node scripts/zfighting.mjs`.

Os testes de navegador usam o preview local (`SMOKE_URL`) e Chromium já
instalado (`CHROME_PATH`). As fotos devem ser abertas antes da publicação.
