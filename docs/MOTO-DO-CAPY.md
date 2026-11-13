# A moto do Capy

Esportiva vermelha inspirada na referência do Renan: carenagem curva,
tanque arredondado, banco preto em dois níveis, aros dourados, discos de freio,
garfo, retrovisores e para-brisa. As rodas giram pela distância percorrida.
Geometria procedural, materiais compartilhados e peças estáticas fundidas.

O próprio Capy pilota: pose específica com patas dianteiras no guidão, traseiras
abertas junto aos apoios e capacete vermelho preso à cabeça, com faixa clara
e tiras. A pose não altera o Capy salva-vidas que continua no clube.

Ele entra no mesmo sistema de encontro seguro: Bebito dá passagem, os dois
param, conversam e seguem. O humor é sobre segurança: nada de mergulhar nas
curvas, vermelho combina com o apito e o seguro não cobre capivara voadora.
Há 20% de chance por partida; Noel e Josefina mantêm 30% cada, e 20% ficam
sem encontro. Cada viagem continua com no máximo um personagem de veículo.

Concluir o encontro guarda a memória `capy-na-estrada`; só depois disso a moto
vazia aparece em uma vaga do clube. A liberação persiste ao recarregar.

Validação: build, `SO=rotas node scripts/casaClube.mjs`,
`node scripts/motoCapy.mjs` (computador/celular, encontro, condutor, memória,
vaga e fotos de perto) e `SO=moto-do-capy SEM_FUNDIR=1 node scripts/zfighting.mjs`.
