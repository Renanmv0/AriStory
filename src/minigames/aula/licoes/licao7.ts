import type { Licao } from '../tipos';

/**
 * LIÇÃO 7 — "Um dia de Gatito": a primeira do Módulo 2.
 *
 * A ROTINA e AS HORAS — a unidade "É rotina todo santo dia!" dos livros para
 * hispanofalantes. A pegadinha previsível: a rotina em espanhol é cheia de
 * pronome ("me despierto, me levanto, me ducho"), e no português do Brasil
 * quase todos esses verbos andam soltos ("acordo, levanto, tomo banho"). E a
 * hora sem artigo na resposta: "são sete", e não "são as sete".
 *
 * O dia é o do Gatito, que dorme dezesseis horas e acorda "às sete e
 * cinquenta e nove" para dar aula às oito.
 */
export const LICAO_7: Licao = {
  id: 'um-dia-de-gatito',
  numero: 7,
  titulo: 'Um dia de Gatito',
  subtitulo: 'A rotina do diretor da escola',
  assunto: 'as horas, a rotina e os verbos sem o "me"',
  emoji: '⏰',
  cor: 'coral',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'perguntar e dizer as horas;',
          'contar a sua rotina, da manhã até a noite;',
          'usar acordar, levantar e tomar banho sem o "me" do espanhol.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Que horas são?',
        lugar: 'Sala de descanso, ao lado da caminha do Gatito',
        falas: [
          { quem: 'ari', texto: 'Que horas são?' },
          { quem: 'renan', texto: 'São sete e meia. A aula é às oito.' },
          { quem: 'luna', texto: '¡Ya va! E o Gatito ainda tá dormindo!' },
          { quem: 'gatito', texto: 'Hmm... eu acordo às oito, turma...' },
          { quem: 'estrella', texto: 'Profe... a aula é às oito.' },
          { quem: 'gatito', texto: 'Então eu levanto às sete e cinquenta e nove.' },
          { quem: 'ari', texto: 'E dá tempo de se duchar?' },
          { quem: 'renan', texto: 'De "tomar banho", Ari. E ele toma banho de língua.' },
          { quem: 'gatito', texto: 'Banho de língua, escovo os bigodes, tomo café da manhã... e pronto.' },
          { quem: 'sol', texto: '¡Y DUERME DIECISÉIS HORAS! ...Quer dizer: e dorme dezesseis horas!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'A rotina',
        itens: [
          { emoji: '⏰', pt: 'acordar', es: 'despertarse' },
          { emoji: '🛏️', pt: 'levantar', es: 'levantarse' },
          { emoji: '🚿', pt: 'tomar banho', es: 'ducharse · bañarse' },
          { emoji: '🪥', pt: 'escovar os dentes', es: 'cepillarse los dientes' },
          { emoji: '☕', pt: 'tomar café da manhã', es: 'desayunar' },
          { emoji: '🍽️', pt: 'almoçar', es: 'almorzar' },
          { emoji: '🌙', pt: 'jantar', es: 'cenar' },
          { emoji: '😴', pt: 'ir dormir', es: 'acostarse' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Que horas são?',
        texto: 'Para perguntar: **Que horas são?** (ou, no dia a dia, *Que horas são agora?*). A resposta começa com **é** para uma hora, meio-dia e meia-noite, e com **são** para o resto.',
      },
      {
        tipo: 'tabela',
        colunas: ['🕐', 'Em português', 'Em espanhol'],
        linhas: [
          ['1:00', 'É uma hora.', 'Es la una.'],
          ['7:00', 'São sete horas. · São sete.', 'Son las siete.'],
          ['7:15', 'São sete e quinze.', 'Son las siete y cuarto.'],
          ['7:30', 'São sete e meia.', 'Son las siete y media.'],
          ['8:45', 'São quinze para as nove. · São oito e quarenta e cinco.', 'Son las nueve menos cuarto.'],
          ['12:00', 'É meio-dia.', 'Es mediodía.'],
          ['0:00', 'É meia-noite.', 'Es medianoche.'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Na resposta, a hora **não leva artigo**: "são sete", e não "são as sete". Mas na pergunta "a que horas?", ele aparece junto com o "a": **às** oito, **à** uma, **ao** meio-dia.',
      },
      {
        tipo: 'tabela',
        titulo: 'As partes do dia',
        colunas: ['', 'Em espanhol'],
        linhas: [
          ['de manhã · 🌅', 'por la mañana'],
          ['à tarde · ☀️', 'por la tarde'],
          ['à noite · 🌙', 'por la noche'],
          ['de madrugada · 🦉', 'de madrugada'],
        ],
        nota: '"Bom dia" vale até o almoço; "boa tarde", até escurecer; "boa noite", na chegada e na despedida.',
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'A rotina sem o "me"',
        texto: 'Em espanhol a rotina é cheia de pronome: *me despierto, me levanto, me ducho*. No português do Brasil, **quase todos esses verbos andam soltos** — é o erro mais previsível de quem fala espanhol.',
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'Me despierto a las siete.', pt: 'Acordo às sete.' },
          { es: 'Me levanto temprano.', pt: 'Levanto cedo.' },
          { es: 'Me ducho por la mañana.', pt: 'Tomo banho de manhã.' },
          { es: 'Me cepillo los dientes.', pt: 'Escovo os dentes.' },
          { es: 'Me acuesto tarde.', pt: 'Vou dormir tarde.' },
        ],
      },
      {
        tipo: 'dica',
        texto: 'Alguns verbos continuam com o "me", como "me chamo Gatito" e "me visto". Mas acordo, levanto e tomo banho andam soltinhos. Que nem eu quando acordo: bem soltinho, no sofá.',
      },
      {
        tipo: 'exemplos',
        titulo: 'O dia do Ari',
        itens: [
          'De manhã eu **acordo** às sete e **tomo banho**.',
          'Ao meio-dia eu **almoço** no refeitório da escola.',
          'À tarde eu **estudo** com o Gatito.',
          'À noite eu **janto** e **vou dormir** às onze.',
        ],
      },
      {
        tipo: 'brasil',
        titulo: 'Banho todo dia',
        texto: 'O brasileiro toma banho todo dia — muita gente toma dois, um de manhã e outro à noite, por causa do calor. E o café da manhã é rapidinho: pão na chapa, café com leite… e pronto.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'escolha',
      enunciado: 'Que horas são? Escolha a resposta certa.',
      itens: [
        {
          pergunta: '🕢 7:30',
          opcoes: ['São as sete e meia.', 'São sete e meia.', 'É sete e meia.'],
          certa: 1,
          porque: 'Mais de uma hora pede "são", e a resposta não leva artigo: são sete e meia.',
        },
        {
          pergunta: '🕐 1:00',
          opcoes: ['São uma hora.', 'É a uma.', 'É uma hora.'],
          certa: 2,
          porque: 'Uma hora só: é uma hora (sem o "a" do espanhol "es la una").',
        },
        {
          pergunta: '🕛 12:00, na hora do almoço',
          opcoes: ['É meio-dia.', 'É meia-dia.', 'São doze e meia.'],
          certa: 0,
          porque: 'O dia é masculino: é meio-dia. A noite é feminina: é meia-noite.',
        },
        {
          pergunta: '🕘 8:45',
          opcoes: ['São nove menos quinze.', 'São quinze para as nove.', 'São as nove menos quarto.'],
          certa: 1,
          porque: 'Em português se conta o que FALTA: quinze para as nove (ou oito e quarenta e cinco).',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue a rotina em espanhol ao jeito brasileiro.',
      pares: [
        ['Me despierto.', 'Acordo.'],
        ['Me ducho.', 'Tomo banho.'],
        ['Desayuno.', 'Tomo café da manhã.'],
        ['Me cepillo los dientes.', 'Escovo os dentes.'],
        ['Me acuesto.', 'Vou dormir.'],
      ],
      porque: 'Os verbos da rotina perdem o "me" no Brasil: acordo, tomo banho, escovo os dentes.',
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Eu', 'me', 'acordo', 'às', 'sete.'],
          errada: 1,
          correcao: '(sem o "me")',
          porque: 'Acordar anda sozinho: "eu acordo às sete".',
        },
        {
          palavras: ['Agora', 'são', 'as', 'oito', 'horas.'],
          errada: 2,
          correcao: '(sem o "as")',
          porque: 'Na resposta a hora não tem artigo: "são oito horas".',
        },
        {
          palavras: ['O Gatito', 'se ducha', 'de manhã.'],
          errada: 1,
          correcao: 'toma banho',
          porque: '"Ducharse" é "tomar banho" (e o dele é de língua).',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o dia do Gatito com o banco de palavras.',
      novaPagina: true,
      titulo: 'Um dia de Gatito',
      texto: 'O Gatito {0} às sete e cinquenta e nove. Primeiro ele {1} banho de língua, depois {2} os bigodes. A aula começa {3} oito, e {4} noite ele dorme de novo — e de madrugada também.',
      respostas: ['acorda', 'toma', 'escova', 'às', 'à'],
      distratores: ['se acorda', 'se ducha', 'as'],
      porque: [
        'Acordar sem o "me": ele acorda.',
        'Banho se "toma": toma banho.',
        'Escovar os bigodes (ou os dentes), sem "se".',
        'A que horas? Às oito (a + as).',
        'À noite (a + a).',
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Em que parte do dia o Gatito faz cada coisa?',
      grupos: ['🌅 de manhã', '☀️ à tarde', '🌙 à noite'],
      itens: [
        { texto: 'toma café da manhã', grupo: 0, porque: 'O café da manhã é, claro, de manhã.' },
        { texto: 'dá aula depois do almoço', grupo: 1, porque: 'Depois do almoço já é à tarde.' },
        { texto: 'janta e olha a lua', grupo: 2, porque: 'Jantar e lua: à noite.' },
        { texto: 'acorda às sete e cinquenta e nove', grupo: 0, porque: 'Acordar, para ele, é de manhã (por pouco).' },
        { texto: 'come o lanche das quatro', grupo: 1, porque: 'Quatro da tarde: à tarde.' },
        { texto: 'deita na caminha às dez', grupo: 2, porque: 'Dez da noite: à noite.' },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['Eu', 'acordo', 'às', 'sete', 'horas.'], porque: 'Sujeito, verbo sem "me", e a hora com "às".' },
        { pedacos: ['À noite', 'eu', 'janto', 'com', 'o Renan.'], porque: 'A parte do dia pode abrir a frase: À noite eu janto…' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva.',
      itens: [
        { antes: '🕣 8:30 → São oito e', depois: '.', aceitas: ['meia'], porque: 'Trinta minutos é "e meia": oito e meia.' },
        { antes: '🕛 12:00 → É', depois: '.', aceitas: ['meio-dia', 'meio dia'], porque: 'Doze horas do dia: meio-dia.' },
        { antes: '(me levanto) Eu', depois: 'cedo.', aceitas: ['levanto'], porque: 'Levantar anda sem o "me": eu levanto.' },
        { antes: '(me ducho) Eu', depois: 'banho à noite.', aceitas: ['tomo'], porque: 'Ducharse = tomar banho: eu tomo banho.' },
      ],
    },
  ],
  consigo: [
    'perguntar e dizer as horas;',
    'contar a minha rotina de manhã, à tarde e à noite;',
    'usar acordo, levanto e tomo banho sem o "me";',
    'responder "são sete", sem o artigo.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale! O sinal! Primeira aula do Módulo 2, panas!' },
      { quem: 'sol', texto: '¡MÓDULO DOS! ...Quer dizer: DOIS! ¡VAMOS!' },
      { quem: 'estrella', texto: 'Que horas são? ...Ainda dá tempo. Sem correr, Sol.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Bom dia, turma! Bem-vindos ao Módulo 2: "Indo mais longe".' },
      { quem: 'gatito', texto: 'E para ir longe, primeiro é preciso acordar. Eu sei: é difícil.' },
      { quem: 'renan', texto: 'Pra ele é mesmo.' },
      { quem: 'gatito', texto: 'Abram na lição 7: "Um dia de Gatito".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem! Agora você sabe a hora de tudo, Ari.' },
      { quem: 'ari', texto: 'E a que horas é a sua soneca, profe?' },
      { quem: 'gatito', texto: 'Às duas. E às três. E às quatro...' },
    ],
  },
};
