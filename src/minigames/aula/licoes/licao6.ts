import type { Licao } from '../tipos';

/**
 * LIÇÃO 6 — "Tudo acaba em -inho": o português do coração.
 *
 * O DIMINUTIVO (como se forma e o que ele diz de verdade: tamanho, carinho,
 * pressa, intensidade, ironia) e as palavras que não se traduzem — saudade,
 * cafuné, xodó, chamego. É a última lição do Módulo 1, e a mais fofa.
 *
 * Ela paga duas promessas do jogo: o cartaz da Sala 1 ("C de cafuné?" —
 * "Depois eu te mostro o que é", diz o Renan) e o nome do professor, que já é
 * um diminutivo… em espanhol.
 */
export const LICAO_6: Licao = {
  id: 'tudo-acaba-em-inho',
  numero: 6,
  titulo: 'Tudo acaba em -inho',
  subtitulo: 'O cafezinho da sala dos professores',
  assunto: 'diminutivos e palavras do coração',
  emoji: '💛',
  cor: 'lilas',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'formar diminutivos com -inho e -zinho;',
          'entender o que o -inho diz de verdade: tamanho, carinho, pressa…;',
          'usar as palavras do coração: saudade, cafuné, xodó e chamego.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Um minutinho',
        lugar: 'Sala dos professores, no intervalo',
        falas: [
          { quem: 'gatito', texto: 'Turma, antes da aula: um cafezinho?' },
          { quem: 'luna', texto: 'Um cafezinho? Mas essa xícara é enorme, profe!' },
          { quem: 'renan', texto: 'No Brasil, "cafezinho" não é sobre o tamanho. É sobre o carinho.' },
          { quem: 'gatito', texto: 'Esperem só um minutinho, que eu já volto.' },
          { quem: 'ari', texto: '...Faz vinte minutos. Quanto dura um minutinho brasileiro?' },
          { quem: 'renan', texto: 'Depende. Às vezes, uma horinha.' },
          { quem: 'luna', texto: 'Na Venezuela é "un momentico". É a mesma mentirinha!' },
          { quem: 'gatito', texto: 'Voltei! Agora... quem me faz um cafuné?' },
          { quem: 'ari', texto: 'Cafuné? A palavra do cartaz da sala!' },
          { quem: 'renan', texto: 'Eu falei que te mostrava. Olha: é assim, nos cabelos. Ou atrás da orelha, no caso dele.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cena',
        itens: [
          { emoji: '☕', pt: 'cafezinho', es: 'cafecito' },
          { emoji: '⏱️', pt: 'um minutinho', es: 'un momentico' },
          { emoji: '⚡', pt: 'rapidinho', es: 'rapidito' },
          { emoji: '💭', pt: 'saudade', es: 'extrañar · echar de menos', nota: 'não tem tradução exata' },
          { emoji: '🤲', pt: 'cafuné', es: 'caricia en el pelo' },
          { emoji: '💛', pt: 'xodó', es: 'el consentido' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O -inho',
        texto: 'O diminutivo é um dos jeitos mais brasileiros de falar. Ele diz que a coisa é pequena… mas quase sempre diz **outra coisa junto**: carinho, pressa, educação.',
      },
      {
        tipo: 'tabela',
        titulo: 'Como se forma',
        colunas: ['Quando a palavra…', 'Exemplos'],
        linhas: [
          ['termina em -o ou -a sem acento: tira a vogal, põe -inho / -inha', 'gato → gatinho · casa → casinha · beijo → beijinho'],
          ['termina em vogal com acento, em som nasal, em -r ou em -l: põe -zinho / -zinha', 'café → cafezinho · pão → pãozinho · mãe → mãezinha · flor → florzinha · papel → papelzinho'],
          ['termina em -co / -ca ou -go / -ga: a letra muda para manter o som', 'pouco → pouquinho · boneca → bonequinha · amigo → amiguinho'],
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'O que o -inho quer dizer',
        colunas: ['', 'Exemplo'],
        linhas: [
          ['🤏 tamanho', 'uma casinha, um gatinho'],
          ['💛 carinho', 'mãezinha, amorzinho, meu xodozinho'],
          ['⚡ pressa', '"É rapidinho!" · "Só um minutinho."'],
          ['🎯 intensidade', 'cedinho (bem cedo), pertinho (bem perto), devagarinho'],
          ['😏 ironia', '"Tivemos um probleminha" (que é um problemão)'],
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do coração',
        itens: [
          { emoji: '💭', pt: 'saudade', nota: 'a falta boa de alguém ou de algo querido: "Estou com saudade de casa."' },
          { emoji: '🤲', pt: 'cafuné', nota: 'carinho nos cabelos de alguém: "Me faz um cafuné?"' },
          { emoji: '💛', pt: 'xodó', nota: 'a pessoa (ou o bicho) mais querido: "O Gatito é o xodó da escola."' },
          { emoji: '🤗', pt: 'chamego', nota: 'carinho, grude, dengo: "Hoje eu tô de chamego."' },
        ],
      },
      {
        tipo: 'dica',
        texto: 'O meu nome já é um diminutivo… em espanhol! Em português eu seria o Gatinho. Mas Gatito é mais charmoso, né?',
      },
      {
        tipo: 'brasil',
        titulo: 'Saudade',
        texto: 'Dizem que "saudade" é uma das palavras mais difíceis de traduzir do mundo. Em espanhol dá para dizer "te extraño", mas saudade é um sentimento com nome próprio: a falta que faz quem a gente ama.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'digitar',
      enunciado: 'Transforme em diminutivo.',
      itens: [
        { antes: 'café →', aceitas: ['cafezinho'], porque: 'Termina em vogal com acento: café + -zinho = cafezinho.' },
        { antes: 'casa →', aceitas: ['casinha'], porque: 'Termina em -a sem acento: cas(a) + -inha = casinha.' },
        { antes: 'pouco →', aceitas: ['pouquinho'], porque: '-co vira -qu- para manter o som: pouquinho.' },
        { antes: 'pão →', aceitas: ['pãozinho'], porque: 'Termina em som nasal: pão + -zinho = pãozinho.' },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: '-inho ou -zinho?',
      grupos: ['-inho / -inha', '-zinho / -zinha'],
      itens: [
        { texto: 'gato', grupo: 0, porque: 'Gat(o) + -inho = gatinho.' },
        { texto: 'flor', grupo: 1, porque: 'Termina em -r: florzinha.' },
        { texto: 'beijo', grupo: 0, porque: 'Beij(o) + -inho = beijinho.' },
        { texto: 'mãe', grupo: 1, porque: 'Som nasal: mãezinha.' },
        { texto: 'bola', grupo: 0, porque: 'Bol(a) + -inha = bolinha.' },
        { texto: 'papel', grupo: 1, porque: 'Termina em -l: papelzinho.' },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue a palavra ao que ela quer dizer.',
      pares: [
        ['saudade', 'a falta de alguém querido'],
        ['cafuné', 'carinho nos cabelos'],
        ['xodó', 'o mais querido de todos'],
        ['chamego', 'grude, dengo'],
        ['rapidinho', 'bem depressa'],
      ],
      porque: 'Palavras do coração: nenhuma tem tradução exata — por isso vale aprender cada uma.',
    },
    {
      tipo: 'escolha',
      enunciado: 'O que o -inho quer dizer aqui?',
      itens: [
        {
          pergunta: 'O Gatito disse: "Esperem só um minutinho". Quanto tempo ele vai demorar?',
          opcoes: ['Exatamente um minuto.', 'Meio minuto, porque é pequeno.', 'Pouco tempo... em teoria.'],
          certa: 2,
          porque: 'O -inho do "minutinho" é de pressa e de educação, não de relógio. Pode ser um minuto... ou vinte.',
        },
        {
          pergunta: 'O Ari está longe da família e sente falta dela. Ele está com…',
          opcoes: ['cafuné', 'saudade', 'chamego'],
          certa: 1,
          porque: 'Sentir falta de quem a gente ama é saudade: "Estou com saudade da minha família".',
        },
        {
          pergunta: '"A Luna mora pertinho da escola" quer dizer que ela mora…',
          opcoes: ['bem perto', 'um pouco longe', 'numa casa pequena'],
          certa: 0,
          porque: 'Aqui o -inho intensifica: pertinho = bem perto.',
        },
        {
          pergunta: '"Tivemos um probleminha", disse o Renan, com a cozinha toda alagada. O -inho aqui é de…',
          opcoes: ['tamanho', 'carinho', 'ironia'],
          certa: 2,
          porque: 'Cozinha alagada não é problema pequeno: o -inho é ironia.',
        },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Me', 'dá', 'um', 'cafecito,', 'por', 'favor?'],
          errada: 3,
          correcao: 'cafezinho,',
          porque: 'Em português o diminutivo é -inho: cafezinho.',
        },
        {
          palavras: ['O', 'Gatito', 'é', 'o', 'chodó', 'da', 'escola.'],
          errada: 4,
          correcao: 'xodó',
          porque: 'Xodó se escreve com X — o som de "ch" do português também é escrito com x.',
        },
        {
          palavras: ['Espera', 'un momentico,', 'já', 'volto!'],
          errada: 1,
          correcao: 'um minutinho,',
          porque: '"Un momentico" é venezuelano. No Brasil: "um minutinho" ou "um instantinho".',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o bilhetinho que o Gatito deixou na porta.',
      titulo: 'Turma,',
      texto: 'fui buscar meu novelo {0} (bem rápido). Deixei um {1} quentinho na mesa. Se eu demorar, não fiquem com {2} de mim! Na volta, aceito um {3} atrás da orelha. Vocês são o meu {4}. 🐾',
      respostas: ['rapidinho', 'cafezinho', 'saudade', 'cafuné', 'xodó'],
      distratores: ['cafecito', 'chamego'],
      porque: [
        'Bem rápido = rapidinho.',
        'O café pequeno e carinhoso é o cafezinho ("cafecito" é espanhol).',
        'Ficar com saudade = sentir falta.',
        'Carinho atrás da orelha (ou nos cabelos) é cafuné.',
        'Os mais queridos de todos: o xodó dele.',
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['Estou', 'com', 'saudade', 'de', 'casa.'], porque: 'Estar com saudade de + o que faz falta.' },
        { pedacos: ['O Gatito', 'é', 'o', 'xodó', 'da', 'escola.'], porque: 'Ser o xodó de alguém (ou de um lugar) = ser o queridinho.' },
      ],
    },
  ],
  consigo: [
    'formar diminutivos com -inho e -zinho;',
    'entender o que o -inho quer dizer em cada frase;',
    'usar saudade, cafuné, xodó e chamego;',
    'pedir um cafezinho (e esperar um "minutinho").',
  ],
  aula: {
    chama: 'estrella',
    chamada: [
      { quem: 'estrella', texto: 'O sinal. É a última aula do módulo, panas.' },
      { quem: 'estrella', texto: 'Eu já tô com... como é que o Gatito diz... saudade. Saudade das aulas.' },
      { quem: 'luna', texto: '¡Ay, Estrella! Não fala assim que eu choro.' },
      { quem: 'estrella', texto: 'Vamos. Com calma, que ainda dá tempo.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Última lição do Módulo 1.' },
      { quem: 'gatito', texto: 'Hoje é a aula mais fofinha de todas: o diminutivo. E umas palavrinhas que não existem em espanhol.' },
      { quem: 'ari', texto: 'Tipo cafuné?' },
      { quem: 'gatito', texto: 'Tipo cafuné. Lição 6: "Tudo acaba em -inho".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Parabéns, Ari! O Módulo 1 está completinho.' },
      { quem: 'luna', texto: '¡Qué nota! ¡Felicidades, pana!' },
      { quem: 'renan', texto: 'Tô orgulhoso de você.' },
      { quem: 'gatito', texto: 'Vocês são o meu xodó. Agora... quem me faz um cafuné?' },
    ],
  },
};
