# Estacionamento do clube

Atualização: a viagem ao clube e a chegada de carro foram construídas depois
do estacionamento. Ver `VIAGEM-CLUBE.md`; o texto abaixo registra a construção
inicial do lote, quando ainda era visitável apenas a pé.

## Chegada animada — apresentação e manobra

A chegada tem uma tomada própria do clube: apresenta o lote, acompanha o carro
na rua, espera a cancela abrir, entra, percorre o corredor e faz a curva até a
vaga do coração. A última manobra é mais lenta e a câmera enquadra carro e vaga
juntos, inclusive no celular. Só depois ele abre a porta, a dupla desce e o
controle volta. O motorista escolhido na viagem permanece ao volante.

O motor de animação é compartilhado com o Villa Lobos; apresentação, duração
dos trechos e tomadas são parâmetros específicos do clube. Recarregar depois
da chegada mantém o carro estacionado sem reproduzir a entrada.

Personagem do estacionamento e sua relação com o outro responsável ficam
anotados para depois, conforme pedido do Renan. Esta etapa é só a animação.

Validação focada: `scripts/chegadaClube.mjs` percorre a chegada pelo fluxo da
viagem, com Ari/Renan ao volante no computador e celular. Confere fases,
abertura antes de atravessar a cancela, manobra sem atravessar carros/muros,
descida, retorno do controle, recarga e a chegada original do parque.

Resultado no preview (2026-11-13): as quatro combinações de tela/motorista
passaram, sem colisões ou erros de página. A cancela abriu antes da passagem,
o controle voltou após a descida e recarregar não repetiu a chegada. A chegada
do Villa Lobos também passou. Fotos conferidas no computador e no celular;
nenhuma geometria, material ou luz foi acrescentada nesta etapa.

Pedido do Renan (2026-11-13): construir primeiro o estacionamento, do outro lado
da rua do clube, com uma aparência mais moderna que o estacionamento do Villa
Lobos. A viagem até ele fica para a próxima etapa.

## O lugar

- Lote a oeste da rua, em `x = -63…-40,4`, `z = -12…18`.
- Oito vagas em duas fileiras, com corredor central de aproximadamente seis
  metros. Quatro carros de fundo, uma vaga acessível e a vaga do Bebito livre.
- Piso cinza, vagas em concreto claro, detalhes no verde do portão do clube,
  cobertura metálica vazada nas vagas do fundo, jardineiras de capins e luminárias
  lineares. Tudo procedural, com materiais compartilhados e partes repetidas em lote.
- Cancela na entrada em `(-41,6; 12,5)`, com bloqueio físico que acompanha a
  abertura. A entrada atravessa a calçada com a guia rebaixada.
- Passagem de pedestres em `z = 7`; pela calçada do estacionamento se chega à
  faixa em `z = 1,8`, longe do ônibus (`z = 4,5…13,5`). Do outro lado, a calçada
  existente leva ao portão do clube. A faixa também tem guias rebaixadas.
- O limite oeste acompanha o lote; a grama de fundo foi ampliada para a nova
  área não mostrar a borda do mundo. Palmeiras e vegetação não ocupam as vagas.

## Para a próxima etapa

A montagem está em `eventos/bebitoMobile/noClube.ts`; as peças novas ficam em
`world/estacionamentoDoClube.ts`. A cena chama a montagem uma vez. O lugar pode
ser visitado a pé mesmo sem a quest do carro.

`VAGA_NO_CLUBE` e `DESCIDA_NO_CLUBE` já indicam a futura chegada do carro.
A entrada de cena `do-estacionamento` permite conferir o acesso no preview.
Não há rota nova, carro do casal nesta cena, mudança de localização do carro
no save, guarda ou loja de recompensas nesta etapa.

## Validação

`scripts/estacionamentoClube.mjs`: fotos no computador e no celular, caminhada
da vaga à portaria e de volta com as colisões reais, abertura/fechamento da
cancela e seu bloqueio, ônibus e saída preservados, save de teste separado.
`scripts/zfighting.mjs` inclui as quatro peças novas; medir com `SEM_FUNDIR=1`.
As peças arredondadas e as folhas em lote também precisam da foto de perto.

Resultado do preview (2026-11-13): ida e volta a pé passaram, a dupla chegou
à portaria, cancela e bloqueio acompanharam a abertura e não houve erro de
página. Fotos conferidas em 1200×900 e 390×844. Peso nas tomadas finais:
visão geral com a entrada do clube 768 desenhos/162365 triângulos; vagas
384/78705; celular na vaga 177/32805 e no acesso 205/62597. São enquadramentos
diferentes, sem luz real nova e com a cobertura e os capins instanciados.
