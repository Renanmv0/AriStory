# As viagens de Bebito: casa, Villa Lobos e clube

Pedido do Renan (2026-11-13): reaproveitar a viagem da casa ao parque, com outra
paisagem, novos motivos para frear/acelerar e uma cena engraçada do Noel de carro.

## O percurso

Em casa, "Escolher destino" no menu de dentro do Bebito oferece Parque Villa
Lobos ou Clube. No parque, o carro oferece Casa do Ari ou Clube. No clube,
a vaga do coração oferece Casa do Ari ou Parque Villa Lobos. "Agora não"
cancela sem iniciar uma viagem. Toda partida conserva a escolha de quem
dirige; a câmera do passageiro continua no outro personagem.

A mesma pista curva, direção, piloto, corações, sons, obstáculos e nota da
viagem antiga são reutilizados. Os sentidos novos são `parque-clube` e
`clube-parque`, além de `casa-clube` e `clube-casa`; os antigos `ida` e
`volta` continuam sendo casa ↔ parque.

Casa ↔ clube usa os mesmos componentes do bairro e da avenida da saída de
casa e os trechos de hortas e alameda esportiva do caminho parque ↔ clube.
A volta inverte os trechos. Não há parada ou troca de cena no parque.

A rota do clube tem 1000 m e passa pelo acesso de casa ou do parque, hortas/estufas e pomares,
depois pela alameda de palmeiras e quadras esportivas. Na volta a paisagem se
inverte. Cenário em trechos, fundido por material; frutas e gotas em lote.

Além de lombada, travessia, obra, semáforo e poça:

- **Rega na alameda:** a Josefina aparece com o regador; água atravessa a pista.
  Passar devagar dá corações. Passar rápido dá um respingo/tranco e conta na nota.
- **Onda verde:** dois sinais coordenados. Acelerar no trecho livre permite
  aproveitar ambos; quem perde a janela para e espera o próximo verde. Não
  existe prazo que obrigue a furar sinal ou reiniciar a viagem.
- **Encontro sorteado:** um trecho reservado, sem obstáculo junto da cena. O Bebito se
  alinha na direita, o Noel passa depressa pela esquerda, freia e para ao lado.
  Fala que comprou laranja e esqueceu o gelo, responde à carona e vai embora.
  A câmera mostra os dois carros, sem trocar motorista ou assentos. Quem estava
  na visão interna volta para ela depois; o controle manual também é devolvido.
  Se houver outra conversa/menu aberto, o carro espera antes do trecho da cena.

## Viagens com encontros diferentes

Cada partida, em qualquer um dos seis sentidos, sorteia uma possibilidade:
30% de Noel, 30% de Josefina, 20% do Capy de moto ou 20% de nenhum encontro. É no máximo um veículo
de personagem por viagem; não há alternância obrigatória e uma repetição é
possível. O sorteio usa a semente salva do pedido, então recarregar conserva
inclusive o resultado "ninguém". Não há percentual ou controle de depuração
no fluxo do jogador.

A Josefina dirige uma caminhonete verde de jardinagem com caçamba aberta,
vasinhos, folhas, lavandas, regador e o letreiro incorporado à lateral.
Passa com mais calma, comenta sobre levar as mudinhas para um cantinho de sol
e segue viagem. Mantém o modelo e as poses originais; os carros compartilham
a coreografia, reserva de faixa, câmera e retorno da visão do passageiro.
Quando ela passa de carro, não aparece também regando a calçada.

No caminho antigo casa ↔ parque, o encontro acrescenta um corredor de
240 m antes dos obstáculos (desde 2026-11-13 TODA viagem tem um encontro na
pista — Noel, Josefina, Capy ou Walter, 25% cada —, então o corredor existe
sempre). Assim o
novo carro não disputa espaço com o ônibus ou com os bichos da travessia.
Os oito obstáculos e suas regras permanecem. Outros personagens e veículos
podem entrar no catálogo de encontros em uma próxima etapa.

O Noel usa o modelo e as poses originais, numa caminhonete de venda de sucos.
O chassi reaproveita o hatch; a cabine é aberta para enxergar o motorista e a
caçamba tem janela de atendimento de verdade, toldo listrado, letreiro "Sucos
do Noel", gomo de laranja no teto, sabores, jarras e copos do próprio bar.
A carroceria laranja/verde combina com seu avental. O balcão fecha em movimento
e abre quando ele para para conversar. Rodas giram, cabeça vira para o Bebito e
ele continua inquieto. Falas novas são texto original; áudio reutiliza o kit existente.

## Chegada e save

A coreografia da cancela do parque foi reaproveitada com o caminho do lote do
clube. O carro entra pela guia rebaixada, espera a cancela, faz a curva e
estaciona em `VAGA_NO_CLUBE`; a dupla desce perto da passagem de pedestres.
O motorista escolhido é preservado até sair do carro.

A chegada recebeu apresentação e tomadas próprias para mostrar a cancela e
a manobra inteira, com a vaga junto do carro na imagem. Detalhes em
`ESTACIONAMENTO-CLUBE.md`; o teste focado é `scripts/chegadaClube.mjs`.

A localização usa as flags compatíveis `bebito:carro-no-parque` e
`bebito:carro-no-clube`. A flag do clube tem prioridade em saves inconsistentes;
sem ambas, o carro fica na garagem. A chegada define as duas, evitando duplicar
o carro nos destinos. O ônibus do clube lembra de buscar o carro quando ele está lá.

O pedido de viagem guarda sentido, motorista e semente. Recarregar na estrada
reinicia o percurso com a mesma escolha; não troca destino nem quem dirige.
Recarregar depois de chegar encontra o carro estacionado e não repete a animação.
As memórias novas são a primeira chegada ao clube e os encontros com Noel, Josefina e Capy.

## Validar e ver

`scripts/casaClube.mjs`: 3000 rotas nos seis sentidos, distribuição dos encontros,
trechos compartilhados/invertidos e corredor livre. No navegador, menu de dentro
do carro, cancelar, viagens diretas de ida/volta, Noel, Josefina e ninguém,
motoristas, câmera interna, recarga e localização única do carro, computador e
celular. `SO=rotas` roda só a parte determinista, sem navegador.

`scripts/viagemClube.mjs`: 900 rotas, ida e volta completas com os dois motoristas,
câmera interna antes do Noel, alinhamento contra o manche, diálogos, eventos,
onda aproveitada/perdida, chegada, recarga e carro sem duplicação. Inclui a
volta antiga para casa. Fotos no computador e no celular, sempre em preview
de origem diferente do site oficial, com `?bebito` e save isolado.

Atalho: `?bebito&cena=viagem-de-carro&viagem=parque-clube,ari,7` (ou
`clube-parque,renan,3`, `casa-clube,ari,4`, `casa-clube,ari,6` ou
`clube-casa,renan,1`). O teste acelera apenas o relógio de depuração; restaura
a renderização normal para capturar as fotos.

Validação da viagem direta e dos encontros (2026-11-13): 3000 rotas passaram
nas regras de distribuição, repetição da semente, continuidade dos trechos e
corredor livre. Casa → clube com Ari/Noel, clube → casa com Renan/Josefina e
casa → clube com Renan/ninguém no celular terminaram sem tropeços ou sustos.
Menu interno, cancelar, escolha de destino/motorista, recarga da estrada,
retorno da visão interna, descida, garagem e localização única do carro
passaram. Os encontros no caminho antigo também passaram no celular.

Fotos finais conferidas em 1200×850 e 390×844. A Josefina usa assento elevado
e se vira parcialmente na conversa para o rosto aparecer; a carga e o carro
cabem na faixa. Tomada dela: 470 desenhos/195079 triângulos no computador e
413/225215 no celular. Não foi acrescentada luz real. TypeScript/build aprovados.
O verificador antes da fundição mediu oito caixas no Noel e cinco na
Josefina, com zero pares coplanares e sem erros de página.

Registro da primeira versão, antes dos encontros por chance (2026-11-13): as duas rotas completas passaram com zero
tropeços e zero sustos, todos os oito eventos vistos e as duas ondas verdes
aproveitadas. Ari e Renan chegaram dirigindo como escolhidos; as chegadas
devolveram o controle e o carro ficou apenas no destino. Recarregar a estrada
preservou a escolha; recarregar o clube não repetiu a entrada. A volta antiga
até a garagem passou. No celular, o alinhamento contrariou o manche mantido
para a esquerda, a conversa parou os dois carros e a onda verde perdida
obrigou a esperar o vermelho antes de continuar. Sem erros de página e sem
gravar o save oficial. A posição do Noel só avança, inclusive quando freia.

Fotos conferidas no computador e no celular. Tomadas finais: Noel conversando
468 desenhos/313075 triângulos no computador e 290/115531 no celular; rega
395/260843; chegada estacionada 232/69278. Nenhuma luz real nova. O verificador
do carro do Noel mediu oito caixas antes da fundição e encontrou zero pares
coplanares; a carroceria arredondada e o personagem também foram vistos nas fotos.

A tomada da conversa recebeu um ajuste final: a câmera fica sobre a pista,
evitando os postes da calçada na frente dos carros. Novas fotos conferidas no
computador e celular, sem erros e com o motorista preservado. As medições acima
registram o enquadramento da primeira validação completa.

Carro de sucos (pedido seguinte do Renan): build e fotos no computador/celular
aprovados, balcão aberto na conversa e motorista preservado. Largura medida
de 2,47 m, incluindo o toldo/balcão, dentro da faixa de 3,5 m; altura 3,29 m.
Verificador do modelo novamente sem pares coplanares ou erros de página.
