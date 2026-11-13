# Carros no clube e chegada com opção de pular

O estacionamento do clube ganhou 12 metros para oeste, uma terceira fileira
com quatro vagas, corredor, setas, poste e jardineira. A vaga do Bebito,
a entrada, a faixa e o trajeto da manobra continuam nos mesmos pontos.

Noel estaciona na fileira nova, e Josefina na fileira próxima da rua. São os
mesmos modelos da estrada, vazios: os personagens continuam nos seus postos.
Os carros parados são fundidos como fundo e têm colisores próprios.
Cada um só aparece após concluir seu primeiro encontro na estrada, usando a
memória já existente no diário. Encontros anteriores à atualização também contam.

O botão Pular aparece durante a chegada no clube e no Villa Lobos. Ele conclui
a manobra, fecha a porta, desce os dois e devolve câmera e controle. A mesma
finalização atende à animação normal e ao salto; a liberação da vaga acontece
uma única vez. O botão é removido ao concluir ou trocar de cena.

Validação focada no preview local:
- `SO=pular node scripts/chegadaClube.mjs`: clique em etapas diferentes,
  computador/celular, dois destinos, posição final, controle e recarga.
- `SO=natural node scripts/chegadaClube.mjs`: chegada normal nos dois destinos.
- `node scripts/estacionamentoClube.mjs`: fotos, carros, cancela e caminhada
  da vaga ao clube e de volta.
- `scripts/zfighting.mjs` nas peças do estacionamento, antes da fundição.
