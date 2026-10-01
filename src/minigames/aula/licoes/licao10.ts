import type { Licao } from '../tipos';

/**
 * LIÇÃO 10 — "Partiu, praia!": planejando a viagem no ponto de ônibus.
 *
 * O FUTURO DE CONVERSA: ir + verbo, igualzinho ao espanhol… menos o "a". O
 * "vou a viajar" é o erro número um do hispanofalante, e o "a" só volta
 * quando o que vem é LUGAR ("vou à praia"). Junto, o vocabulário de viagem
 * (mala, passagem, rodoviária, pousada), o "pegar" o ônibus no lugar do
 * "tomar", e as palavras de quando: amanhã, semana que vem, nas férias.
 *
 * A viagem planejada aqui é a que vira cartão-postal na lição 11.
 */
export const LICAO_10: Licao = {
  id: 'partiu-praia',
  numero: 10,
  titulo: 'Partiu, praia!',
  subtitulo: 'Planejando a viagem no ponto de ônibus',
  assunto: 'o futuro com ir + verbo (sem o "a")',
  emoji: '🧳',
  cor: 'azul',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'falar de planos com ir + verbo — sem o "a" do espanhol;',
          'dizer quando: amanhã, semana que vem, nas férias;',
          'arrumar uma viagem: a mala, a passagem, o ônibus.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Feriado!',
        lugar: 'O ponto de ônibus da escola',
        falas: [
          { quem: 'luna', texto: 'Panas! Semana que vem é feriado. Vamos pra praia?' },
          { quem: 'ari', texto: 'Vamos a ir! ...Quer dizer: vamos!' },
          { quem: 'renan', texto: 'Partiu! A gente vai pegar o ônibus na sexta de manhã.' },
          { quem: 'sol', texto: '¡Yo voy a llevar la pelota! ...Eu vou levar a bola!' },
          { quem: 'estrella', texto: 'Eu vou levar o protetor solar. Pra todo mundo. E chapéu.' },
          { quem: 'ari', texto: 'E onde a gente vai ficar?' },
          { quem: 'luna', texto: 'Numa pousadinha pertinho da praia!' },
          { quem: 'renan', texto: 'Eu vou comprar as passagens hoje.' },
          { quem: 'ari', texto: 'E eu vou fazer a mala... amanhã.' },
          { quem: 'sol', texto: '¡PARTIU, PRAIA!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras de viagem',
        itens: [
          { emoji: '🧳', pt: 'a mala', es: 'la maleta' },
          { emoji: '🎫', pt: 'a passagem', es: 'el pasaje · el boleto' },
          { emoji: '🚌', pt: 'pegar o ônibus', es: 'tomar el autobús' },
          { emoji: '🚏', pt: 'a rodoviária', es: 'la terminal de autobuses' },
          { emoji: '🏡', pt: 'a pousada', es: 'la posada · el hostal' },
          { emoji: '🧴', pt: 'o protetor solar', es: 'el protector solar' },
          { emoji: '🩴', pt: 'o chinelo', es: 'la chancla' },
          { emoji: '🚀', pt: 'Partiu!', es: '¡Vámonos!', nota: 'gíria: "vamos agora!"' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O futuro do dia a dia',
        texto: 'Na conversa, o brasileiro fala do futuro com **ir + verbo**: *vou viajar, vamos pegar o ônibus*. É igual ao espanhol… **menos o "a"** do meio.',
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'Voy a viajar.', pt: 'Vou viajar.' },
          { es: 'Vamos a comer.', pt: 'Vamos comer.' },
          { es: 'Va a llover.', pt: 'Vai chover.' },
          { es: '¿Vas a venir?', pt: 'Você vai vir?' },
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'O verbo ir',
        colunas: ['', 'ir', 'Exemplo'],
        linhas: [
          ['eu', 'vou', 'Eu vou fazer a mala.'],
          ['você · ele · ela · a gente', 'vai', 'A gente vai pegar o ônibus.'],
          ['nós', 'vamos', 'Nós vamos ficar numa pousada.'],
          ['vocês · eles · elas', 'vão', 'Elas vão levar a bola.'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Sem o "a"! **"Vou a viajar" é o erro número um** de quem fala espanhol. O "a" só aparece quando o que vem é um LUGAR: vou **à** praia, vamos **ao** parque.',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Quando?',
        colunas: ['', 'Em espanhol'],
        linhas: [
          ['amanhã', 'mañana'],
          ['depois de amanhã', 'pasado mañana'],
          ['semana que vem', 'la semana que viene'],
          ['mês que vem', 'el mes que viene'],
          ['no fim de semana', 'el fin de semana'],
          ['nas férias', 'en vacaciones'],
        ],
      },
      {
        tipo: 'texto',
        titulo: 'E o "viajarei"?',
        texto: 'O futuro com -ei (*viajarei, comprarei*) existe, mas soa formal: é de jornal, de discurso, de promessa solene. Na conversa, é **vou viajar**.',
      },
      {
        tipo: 'dica',
        texto: 'Em português a gente PEGA o ônibus, o avião, o táxi... e até um resfriado. Para "tomar el autobús", é "pegar o ônibus". Eu prefiro pegar no sono.',
      },
      {
        tipo: 'brasil',
        titulo: 'Feriadão',
        texto: 'Quando o feriado cai numa quinta ou numa terça, o brasileiro "emenda" com o fim de semana — é o feriadão. A rodoviária lota, a estrada enche, e metade da cidade vai pra praia.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Eu', 'vou', 'a', 'viajar', 'amanhã.'],
          errada: 2,
          correcao: '(sem o "a")',
          porque: 'Ir + verbo, sem nada no meio: vou viajar.',
        },
        {
          palavras: ['A gente', 'vai', 'tomar', 'o ônibus', 'na sexta.'],
          errada: 2,
          correcao: 'pegar',
          porque: 'Ônibus se pega: vai pegar o ônibus.',
        },
        {
          palavras: ['Amanhã', 'vai a', 'chover', 'na praia.'],
          errada: 1,
          correcao: 'vai',
          porque: 'Va a llover = vai chover.',
        },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Com "a" ou sem "a"? Pense no que vem depois do ir.',
      grupos: ['📍 com "a" (é lugar)', '🏃 sem "a" (é verbo)'],
      itens: [
        { texto: 'Vou … praia.', grupo: 0, porque: 'Praia é lugar: vou à praia.' },
        { texto: 'Vou … comprar as passagens.', grupo: 1, porque: 'Comprar é verbo: vou comprar.' },
        { texto: 'Vamos … rodoviária.', grupo: 0, porque: 'Rodoviária é lugar: vamos à rodoviária.' },
        { texto: 'Vamos … fazer a mala.', grupo: 1, porque: 'Fazer é verbo: vamos fazer.' },
        { texto: 'A Sol vai … levar a bola.', grupo: 1, porque: 'Levar é verbo: vai levar.' },
        { texto: 'Eles vão … parque.', grupo: 0, porque: 'Parque é lugar: vão ao parque.' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a lista de planos que a Luna escreveu.',
      titulo: '🏖️ Viagem dos Gatitos',
      texto: 'Sexta de manhã a gente {0} pegar o ônibus. Eu {1} levar o chinelo e a toalha. A Estrella vai levar o {2}, e a Sol, a bola. Nós {3} ficar numa {4} pertinho da praia. Partiu!',
      respostas: ['vai', 'vou', 'protetor solar', 'vamos', 'pousada'],
      distratores: ['va', 'voy', 'maleta'],
      porque: [
        '"A gente" pede a 3ª pessoa: a gente vai.',
        'Eu → vou.',
        'O que protege do sol: o protetor solar.',
        'Nós → vamos.',
        'O hotelzinho simples: a pousada.',
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'O Renan está organizando tudo. Escolha a resposta do Ari.',
      com: 'renan',
      turnos: [
        {
          fala: 'Já comprou as passagens?',
          opcoes: ['Ainda não, voy a comprar hoy.', 'Ainda não, vou comprar hoje.', 'Ainda não, vou a comprar hoje.'],
          certa: 1,
          porque: 'Futuro de conversa: vou comprar, sem o "a".',
        },
        {
          fala: 'E como a gente vai pra rodoviária?',
          opcoes: ['Vamos pegar um táxi.', 'Vamos a pegar um táxi.', 'Vamos coger un táxi.'],
          certa: 0,
          porque: 'Vamos + verbo, sem "a": vamos pegar um táxi.',
        },
        {
          fala: 'Será que vai chover na sexta?',
          opcoes: ['Acho que no va a llover.', 'Acho que não vai a chover.', 'Acho que não vai chover.'],
          certa: 2,
          porque: 'Va a llover = vai chover; e com o "não" na frente: não vai chover.',
        },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Quando é?',
      itens: [
        {
          pergunta: 'Hoje é segunda. A viagem é na terça. A viagem é…',
          opcoes: ['amanhã.', 'depois de amanhã.', 'semana que vem.'],
          certa: 0,
          porque: 'O dia seguinte é amanhã.',
        },
        {
          pergunta: 'Hoje é segunda. A viagem é na quarta. A viagem é…',
          opcoes: ['amanhã.', 'depois de amanhã.', 'no fim de semana.'],
          certa: 1,
          porque: 'Dois dias depois: depois de amanhã (pasado mañana).',
        },
        {
          pergunta: '"La semana que viene" é…',
          opcoes: ['a semana que vai.', 'a semana passada.', 'a semana que vem.'],
          certa: 2,
          porque: 'A semana que vem: igual ao espanhol, com "vem".',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['Nós', 'vamos', 'pegar', 'o ônibus', 'na sexta.'], porque: 'Vamos + verbo + o resto: vamos pegar o ônibus.' },
        { pedacos: ['Eu', 'vou', 'fazer', 'a mala', 'amanhã.'], porque: 'Vou + verbo, e o "quando" no fim.' },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: '"Vou viajar" é o futuro mais usado na conversa.', verdade: true, porque: 'Ir + verbo é o futuro do dia a dia.' },
        { frase: '"Vou a comprar o chinelo" está certo.', verdade: false, porque: 'Antes de verbo, sem "a": vou comprar.' },
        { frase: 'Em "vou à praia" o "à" está certo, porque praia é lugar.', verdade: true, porque: 'Lugar pede o "a": à praia, ao parque.' },
        { frase: '"Viajarei amanhã" é o jeito mais comum de falar com os amigos.', verdade: false, porque: 'Soa formal. Com os amigos: vou viajar amanhã.' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Complete com o verbo ir.',
      novaPagina: true,
      itens: [
        { antes: 'Amanhã eu', depois: 'viajar.', aceitas: ['vou'], porque: 'Eu → vou.' },
        { antes: 'Vocês', depois: 'pegar o ônibus com a gente?', aceitas: ['vão', 'vao'], porque: 'Vocês → vão.' },
        { antes: 'A Estrella', depois: 'levar o protetor solar.', aceitas: ['vai'], porque: 'Ela → vai.' },
      ],
    },
  ],
  consigo: [
    'falar dos meus planos: vou viajar, vamos pegar o ônibus;',
    'usar o "a" só antes de lugar: vou à praia;',
    'dizer quando: amanhã, depois de amanhã, semana que vem;',
    'arrumar a mala, comprar a passagem e gritar "partiu!".',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale, o sinal! Hoje o Gatito vai falar de viagem!' },
      { quem: 'sol', texto: '¡VIAJE! ¡PLAYA! ...Quer dizer: viagem! Praia!' },
      { quem: 'estrella', texto: 'Ainda é só a aula, Sol. A praia é depois.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Quem aqui gosta de viajar?' },
      { quem: 'sol', texto: '¡YO! ...Eu!' },
      { quem: 'gatito', texto: 'Então hoje a gente vai planejar uma viagem. Sem o "a", hein. Lição 10: "Partiu, praia!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem! Agora vocês sabem tudo o que vão fazer amanhã.' },
      { quem: 'ari', texto: 'Eu vou fazer a mala!' },
      { quem: 'renan', texto: '...Amanhã. Como sempre.' },
    ],
  },
};
