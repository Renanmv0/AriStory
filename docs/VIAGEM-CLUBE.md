# A viagem Villa Lobos ↔ clube

Pedido do Renan (2026-11-13): reaproveitar a viagem da casa ao parque, com outra
paisagem, novos motivos para frear/acelerar e uma cena engraçada do Noel de carro.

## O percurso

O carro no parque oferece Casa do Ari ou Clube. No clube, o carro da vaga do
coração oferece a volta ao parque. Toda partida conserva a escolha de quem
dirige; a câmera do passageiro continua no outro personagem.

A mesma pista curva, direção, piloto, corações, sons, obstáculos e nota da
viagem antiga são reutilizados. Os sentidos novos são `parque-clube` e
`clube-parque`; os antigos `ida` e `volta` continuam sendo casa ↔ parque.

A rota nova tem 1000 m e passa pelo bosque do parque, hortas/estufas e pomares,
depois pela alameda de palmeiras e quadras esportivas. Na volta a paisagem se
inverte. Cenário em trechos, fundido por material; frutas e gotas em lote.

Além de lombada, travessia, obra, semáforo e poça:

- **Rega na alameda:** a Josefina aparece com o regador; água atravessa a pista.
  Passar devagar dá corações. Passar rápido dá um respingo/tranco e conta na nota.
- **Onda verde:** dois sinais coordenados. Acelerar no trecho livre permite
  aproveitar ambos; quem perde a janela para e espera o próximo verde. Não
  existe prazo que obrigue a furar sinal ou reiniciar a viagem.
- **Noel:** um trecho reservado, sem obstáculo junto da cena. O Bebito se
  alinha na direita, o Noel passa depressa pela esquerda, freia e para ao lado.
  Fala que comprou laranja e esqueceu o gelo, responde à carona e vai embora.
  A câmera mostra os dois carros, sem trocar motorista ou assentos. Quem estava
  na visão interna volta para ela depois; o controle manual também é devolvido.
  Se houver outra conversa/menu aberto, o carro espera antes do trecho da cena.

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
As memórias novas são a primeira chegada ao clube e o encontro com o Noel.

## Validar e ver

`scripts/viagemClube.mjs`: 600 rotas, ida e volta completas com os dois motoristas,
câmera interna antes do Noel, alinhamento contra o manche, diálogos, eventos,
onda aproveitada/perdida, chegada, recarga e carro sem duplicação. Inclui a
volta antiga para casa. Fotos no computador e no celular, sempre em preview
de origem diferente do site oficial, com `?bebito` e save isolado.

Atalho: `?bebito&cena=viagem-de-carro&viagem=parque-clube,ari,7` (ou
`clube-parque,renan,7`). O teste acelera apenas o relógio de depuração; restaura
a renderização normal para capturar as fotos.

Validação final (2026-11-13): as duas rotas completas passaram com zero
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
