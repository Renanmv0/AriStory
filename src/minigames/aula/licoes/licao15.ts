import type { Licao } from '../tipos';

/**
 * LIÇÃO 15 — "Vira à esquerda, Sol!": perdidos a caminho da piscina do
 * clube.
 *
 * PEDIR E DAR DIREÇÕES. O verbo certo é VIRAR (o "girar" do espanhol, em
 * português, é rodar no mesmo lugar), o "à" de "à direita" leva CRASE (a +
 * a), os ORDINAIS concordam com a coisa (a primeira rua, o primeiro
 * quarteirão — e não existe "primer") e o "cuadra" vira QUARTEIRÃO (ou
 * "quadra", conforme a região).
 *
 * Vem depois da lição 14 de propósito: o imperativo de lá (siga, vire,
 * atravesse) é a língua das direções. A Josefina, que conhece o clube de
 * cor, é quem explica o caminho, devagar e com "meu bem".
 */
export const LICAO_15: Licao = {
  id: 'vira-a-esquerda',
  numero: 15,
  titulo: 'Vira à esquerda, Sol!',
  subtitulo: 'Perdidos a caminho da piscina do clube',
  assunto: 'direções, ordinais e o verbo virar',
  emoji: '🧭',
  cor: 'verde',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'pedir e dar direções: siga reto, vire à direita, atravesse;',
          'contar as ruas com os ordinais: a primeira, a segunda;',
          'dizer "vire" (e não "gire") e escrever "à direita" com crase;',
          'falar de distância: quarteirão, perto, longe, logo ali.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'O mapa de cabeça pra baixo',
        lugar: 'O clube, a caminho da piscina, com o mapa nas mãos',
        falas: [
          { quem: 'estrella', texto: 'Sol... o mapa está de cabeça pra baixo.' },
          { quem: 'sol', texto: '¡Não está! ...Está? ¡A piscina fica pra lá, pela esquerda!' },
          { quem: 'luna', texto: 'Panas, vamos perguntar. Josefina, como a gente chega na piscina?' },
          { quem: 'josefina', texto: 'É fácil, meu bem. Siga reto até o fim da rua.' },
          { quem: 'josefina', texto: 'Depois vire à direita, na primeira esquina, e atravesse o jardim.' },
          { quem: 'ari', texto: 'Na primeira ou na segunda?' },
          { quem: 'josefina', texto: 'Na primeira. A piscina fica bem em frente, ao lado do deque.' },
          { quem: 'valentina', texto: 'Viu, Sol? Na primeira à direita. Eu já sabia: é onde fica o deque mais bonito do clube.' },
          { quem: 'sol', texto: '¡EU FALEI! ...Mais ou menos.' },
          { quem: 'renan', texto: 'Ari, em português a gente não "gira" na esquina: a gente vira.' },
          { quem: 'estrella', texto: 'Vira à DIREITA, Sol. Não... a outra direita.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do caminho',
        itens: [
          { emoji: '⬅️', pt: 'à esquerda', es: 'a la izquierda' },
          { emoji: '➡️', pt: 'à direita', es: 'a la derecha' },
          { emoji: '⬆️', pt: 'reto · em frente', es: 'derecho · adelante' },
          { emoji: '📍', pt: 'a esquina', es: 'la esquina' },
          { emoji: '🏘️', pt: 'o quarteirão', es: 'la cuadra' },
          { emoji: '🚦', pt: 'o semáforo · o sinal', es: 'el semáforo' },
          { emoji: '🗺️', pt: 'o mapa', es: 'el mapa' },
          { emoji: '🛣️', pt: 'a rua · a avenida', es: 'la calle · la avenida' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Dando direções',
        texto: 'A língua das direções é o **imperativo** da lição 14: siga, vire, atravesse, continue. E o verbo coringa da lição 5 volta para dizer onde as coisas **ficam**.',
      },
      {
        tipo: 'tabela',
        colunas: ['Em português', 'Em espanhol'],
        linhas: [
          ['Siga reto · Vá em frente', 'Siga derecho'],
          ['Vire à direita · à esquerda', 'Doble a la derecha · a la izquierda'],
          ['Atravesse a rua', 'Cruce la calle'],
          ['Continue até o semáforo', 'Siga hasta el semáforo'],
          ['Fica ao lado do banco', 'Queda al lado del banco'],
          ['Fica em frente ao parque', 'Queda frente al parque'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Para mudar de rua, o brasileiro diz **virar**: "Vire à direita". O **girar** do espanhol (*gire a la derecha*) é, em português, rodar no mesmo lugar, como um pião. O **dobrar** até existe, mas a gente usa mais para dobrar roupa e papel.',
      },
      {
        tipo: 'texto',
        titulo: 'O acento de "à direita"',
        texto: 'Repare no **à**: "vire **à** direita", "vire **à** esquerda". É a crase — a preposição **a** mais o artigo **a**. Na conversa, é comum dizer também "vira **pra** direita" e "vira **na** direita".',
      },
      {
        tipo: 'dica',
        texto: 'Se perder, pergunte duas vezes. E se continuar perdido, siga o Walter: ele sempre acha o caminho da cozinha.',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Os ordinais',
        colunas: ['', 'Em português', 'Em espanhol'],
        linhas: [
          ['1º · 1ª', 'primeiro · primeira', 'primero · primera'],
          ['2º · 2ª', 'segundo · segunda', 'segundo · segunda'],
          ['3º · 3ª', 'terceiro · terceira', 'tercero · tercera'],
          ['4º · 4ª', 'quarto · quarta', 'cuarto · cuarta'],
          ['5º · 5ª', 'quinto · quinta', 'quinto · quinta'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Os ordinais **concordam com a coisa**: a **primeira** rua, o **primeiro** quarteirão, a **segunda** esquina. E não existe "primer" nem "tercer" (o *primer piso* do espanhol): em português é sempre **primeiro**, **terceiro**.',
      },
      {
        tipo: 'tabela',
        titulo: 'Perto e longe',
        colunas: ['Em português', 'Em espanhol'],
        linhas: [
          ['Fica a dois quarteirões daqui.', 'Queda a dos cuadras de aquí.'],
          ['É perto · É longe.', 'Está cerca · Está lejos.'],
          ['Fica a cinco minutos a pé.', 'Queda a cinco minutos caminando.'],
          ['É logo ali!', 'Está ahí mismo.'],
        ],
        nota: 'Em muitas regiões do Brasil, "quadra" também quer dizer quarteirão. "Quarteirão" é entendido em todo o país.',
      },
      {
        tipo: 'brasil',
        titulo: 'O "logo ali"',
        texto: 'Quando alguém diz "é **logo ali**", pode ser a 50 metros... ou a 3 quilômetros. O brasileiro adora dar direção por referência: "depois da padaria, na rua do posto". Se a resposta for "logo ali", pergunte: "logo ali quanto?".',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'escolha',
      enunciado: 'Escolha a melhor opção.',
      itens: [
        {
          pergunta: 'Como se diz "Doble a la izquierda" no Brasil?',
          opcoes: ['Vire à esquerda.', 'Gire à esquerda.', 'Vire em esquerda.'],
          certa: 0,
          porque: 'No Brasil se vira na esquina. Girar é rodar no mesmo lugar.',
        },
        {
          pergunta: 'A piscina fica na ___ rua à direita. (2ª)',
          opcoes: ['segunda', 'segundo', 'dois'],
          certa: 0,
          porque: 'Rua é feminina: a segunda rua.',
        },
        {
          pergunta: 'Qual está certa?',
          opcoes: ['o primeiro quarteirão', 'o primer quarteirão', 'o primeira quarteirão'],
          certa: 0,
          porque: 'Em português não existe "primer": é primeiro, e concorda com quarteirão (masculino).',
        },
        {
          pergunta: 'Como se diz "a dos cuadras de aquí"?',
          opcoes: ['a dois quarteirões daqui', 'a duas cuadras daqui', 'a dois quartos daqui'],
          certa: 0,
          porque: 'Cuadra vira quarteirão (ou quadra, em algumas regiões).',
        },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Siga, vire ou pare? Separe as instruções.',
      grupos: ['➡️ siga em frente', '↪️ vire', '🛑 chegou'],
      itens: [
        { texto: 'Siga reto até o fim da rua.', grupo: 0, porque: 'Siga reto: em frente, sem virar.' },
        { texto: 'Vire à direita na esquina.', grupo: 1, porque: 'Vire: muda de direção.' },
        { texto: 'Chegou! A piscina é aqui.', grupo: 2, porque: 'Chegou: acabou o caminho.' },
        { texto: 'Continue por dois quarteirões.', grupo: 0, porque: 'Continue: segue na mesma direção.' },
        { texto: 'Entre na primeira rua à esquerda.', grupo: 1, porque: 'Entre à esquerda: é uma virada.' },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a direção.',
      itens: [
        { pedacos: ['Siga', 'reto', 'até o', 'fim da rua.'], porque: 'Siga reto até o fim da rua.' },
        { pedacos: ['Vire', 'à direita', 'na primeira', 'esquina.'], porque: 'Vire à direita na primeira esquina.' },
        { pedacos: ['A piscina', 'fica', 'ao lado', 'do deque.'], porque: 'O coringa "ficar" para dizer onde está: fica ao lado do deque.' },
        { pedacos: ['Atravesse', 'o jardim', 'e siga', 'em frente.'], porque: 'Atravesse o jardim e siga em frente.' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva.',
      novaPagina: true,
      itens: [
        { antes: 'Vire', depois: 'direita no semáforo. (a + a)', aceitas: ['à'], porque: 'A preposição a + o artigo a = à (com crase).' },
        { antes: 'A', depois: 'rua à esquerda. (2ª)', aceitas: ['segunda'], porque: 'Rua é feminina: a segunda.' },
        { antes: 'Siga', depois: 'o fim da rua. (hasta)', aceitas: ['até'], porque: 'Hasta = até.' },
        { antes: 'Pare no', depois: '. (el semáforo)', aceitas: ['semáforo', 'sinal', 'farol'], porque: 'Semáforo, sinal ou farol, conforme a região do Brasil.' },
        { antes: '(cuadra) Fica a dois', depois: 'daqui.', aceitas: ['quarteirões', 'quadras'], porque: 'Cuadra vira quarteirão (ou quadra).' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete as direções da Josefina.',
      titulo: '🗺️ O caminho da piscina',
      texto: 'Do portão, {0} reto até a esquina. Aí, {1} à direita e {2} a rua. Pegue a {3} entrada à esquerda — a piscina {4} ao lado do deque.',
      respostas: ['siga', 'vire', 'atravesse', 'primeira', 'fica'],
      distratores: ['gire', 'primeiro', 'tem'],
      porque: [
        'Seguir: sigo → siga (o radical muda).',
        'Virar: viro → vire. O girar é rodar no lugar.',
        'Atravessar: atravesso → atravesse.',
        'Entrada é feminina: a primeira entrada.',
        'O coringa "ficar" diz onde as coisas estão.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Gire', 'à direita', 'no', 'semáforo.'],
          errada: 0,
          correcao: 'Vire',
          porque: 'No Brasil se vira na esquina. Girar é rodar no mesmo lugar.',
        },
        {
          palavras: ['Vire', 'a', 'esquerda', 'na', 'esquina.'],
          errada: 1,
          correcao: 'à',
          porque: 'À esquerda leva crase: a preposição a + o artigo a.',
        },
        {
          palavras: ['É', 'o', 'primer', 'quarteirão.'],
          errada: 2,
          correcao: 'primeiro',
          porque: 'Não existe "primer" em português: primeiro.',
        },
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'Perguntando o caminho à Josefina. Escolha a resposta do Ari.',
      novaPagina: true,
      com: 'josefina',
      turnos: [
        {
          fala: 'Boa tarde, meu bem... Posso ajudar?',
          opcoes: ['Boa tarde! Onde fica o vestiário, por favor?', 'Boa tarde! Dónde fica o vestiário, por favor?', 'Boa tarde! Onde é fica o vestiário, por favor?'],
          certa: 0,
          porque: 'Onde fica...? é a pergunta de lugar. O dónde é do espanhol.',
        },
        {
          fala: 'Siga reto até o fim do corredor, meu bem.',
          opcoes: ['Entendi. E depois eu giro onde?', 'Entendi. E depois eu viro onde?', 'Entendi. E depois eu virar onde?'],
          certa: 1,
          porque: 'Eu viro: o verbo virar, no presente.',
        },
        {
          fala: 'Vire à esquerda, na segunda porta.',
          opcoes: ['Na segunda porta à esquerda. Fica longe?', 'En segunda porta à esquerda. Fica longe?', 'Na segundo porta à esquerda. Fica longe?'],
          certa: 0,
          porque: 'Na segunda porta: porta é feminina, e em + a = na.',
        },
        {
          fala: 'Que nada, é logo ali!',
          opcoes: ['Obrigado, Josefina! Já vou.', 'Gracias, Josefina! Já vou.', 'Obrigada, Josefina! Já vou.'],
          certa: 0,
          porque: 'Quem agradece é o Ari: obrigado. E o "gracias" é do espanhol.',
        },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: '"Vire à esquerda" leva crase: é a preposição a mais o artigo a.', verdade: true, porque: 'À esquerda: a + a.' },
        { frase: 'Em português, "girar" é o verbo normal para virar na esquina.', verdade: false, porque: 'Girar é rodar no lugar. Na esquina, se vira.' },
        { frase: '"É logo ali" sempre quer dizer que é pertinho.', verdade: false, porque: 'Pode ser a 50 metros ou a 3 quilômetros. Pergunte: "logo ali quanto?".' },
        { frase: 'Quarteirão (ou quadra, em algumas regiões) é o trecho da rua entre duas esquinas.', verdade: true, porque: 'É a "cuadra" do espanhol.' },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não combina?',
      itens: [
        {
          pergunta: 'Qual NÃO é um número ordinal?',
          opcoes: ['primeira', 'segundo', 'terceira', 'três'],
          certa: 3,
          porque: 'Três é cardinal (conta); os outros dizem a ordem.',
        },
        {
          pergunta: 'Qual NÃO é uma instrução de caminho?',
          opcoes: ['siga', 'vire', 'atravesse', 'esfrie'],
          certa: 3,
          porque: 'Esfrie é da receita da lição 14.',
        },
      ],
    },
  ],
  consigo: [
    'pedir o caminho: "Onde fica…?";',
    'dar direções: siga reto, vire à direita, atravesse a rua;',
    'contar com os ordinais: a primeira, a segunda;',
    'dizer virar (e não girar) e escrever "à direita" com crase;',
    'falar de distância: quarteirão, perto, longe, logo ali.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale, o sinal! Pra Sala 1 é por onde, Sol?' },
      { quem: 'sol', texto: '¡Pra FRENTE! ...Reto! ...Por aqui! ...Por aqui?' },
      { quem: 'estrella', texto: 'Segue a Luna, Sol. Ela sabe o caminho.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje vamos passear pelo clube — de mentirinha, na apostila.' },
      { quem: 'gatito', texto: 'Alguém sabe me dizer onde fica a Sala 1?' },
      { quem: 'ari', texto: 'Reto, depois à direita... O senhor mora aqui, profe!' },
      { quem: 'valentina', texto: 'Eu nunca me perco, profe. É só seguir a passarela mais bonita.' },
      { quem: 'gatito', texto: 'Moro, mas já me perdi duas vezes esta semana. Abram na lição 15: "Vira à esquerda, Sol!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem, Ari! Agora você nunca mais se perde.' },
      { quem: 'renan', texto: 'Nunca mais é exagero.' },
      { quem: 'gatito', texto: 'Tem razão. Mas pelo menos você sabe perguntar o caminho.' },
      { quem: 'sol', texto: '¡Pra esquerda! ...Não, a outra!' },
      { quem: 'valentina', texto: 'Agora você sabe virar à direita, Ari. E com elegância, que é o mais importante.' },
    ],
  },
};
