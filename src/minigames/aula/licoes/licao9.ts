import type { Licao } from '../tipos';

/**
 * LIÇÃO 9 — "Ai, que dor!": um tombo na pista de gelo do Villa Lobos.
 *
 * O CORPO (com o falso amigo de sempre: "as costas" não é a praia, é la
 * espalda) e o grande "tener" que o português troca: o que a gente SENTE
 * agora vai com ESTAR COM — estou com fome, com frio, com sono, com dor de
 * cabeça. A idade continua com ter. E machucar, que com a parte do corpo
 * também perde o "me" (a ponte com a lição 7).
 *
 * Quem cai é o Ari, na patinação; quem cuida é a Estrella, que pergunta se
 * todo mundo bebeu água.
 */
export const LICAO_9: Licao = {
  id: 'ai-que-dor',
  numero: 9,
  titulo: 'Ai, que dor!',
  subtitulo: 'Um tombo na pista de gelo',
  assunto: 'o corpo e o "estar com": fome, frio, dor',
  emoji: '🩹',
  cor: 'rosa',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'dizer as partes do corpo (sem confundir costas com costa);',
          'contar o que você sente: estou com fome, com frio, com sono;',
          'dizer onde dói e desejar melhoras.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Pista de gelo',
        lugar: 'A praça de gelo do Villa Lobos',
        falas: [
          { quem: 'ari', texto: 'Olha, eu sei patinar! Olha só, Ren—' },
          { quem: 'renan', texto: 'Ari! Tudo bem?' },
          { quem: 'ari', texto: 'Ai, que dor! Machuquei o joelho... e as costas.' },
          { quem: 'sol', texto: '¡¿LA COSTA?! ...Ah, as costas. Eu já quase quebrei a perna uma vez!' },
          { quem: 'estrella', texto: 'Calma. Dói muito? Você tá com frio? Bebeu água?' },
          { quem: 'ari', texto: 'Tô com frio... e com um pouco de vergonha.' },
          { quem: 'luna', texto: 'Pana, todo mundo cai no gelo. Eu caí três vezes hoje!' },
          { quem: 'renan', texto: 'Vem, vamos sentar. Quer um chocolate quente?' },
          { quem: 'ari', texto: 'Quero! Agora eu tô com fome também.' },
          { quem: 'estrella', texto: 'Melhoras, Ari.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'O corpo da cena',
        itens: [
          { emoji: '🙆', pt: 'a cabeça', es: 'la cabeza' },
          { emoji: '🔙', pt: 'as costas', es: 'la espalda', nota: '"costa" é a beira do mar!' },
          { emoji: '🦵', pt: 'o joelho', es: 'la rodilla' },
          { emoji: '🦶', pt: 'o tornozelo', es: 'el tobillo' },
          { emoji: '💪', pt: 'o cotovelo', es: 'el codo' },
          { emoji: '🧣', pt: 'o pescoço', es: 'el cuello' },
          { emoji: '🩹', pt: 'machucar', es: 'lastimarse · hacerse daño' },
          { emoji: '💐', pt: 'Melhoras!', es: '¡Que te mejores!' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Tener ou estar com?',
        texto: 'Em espanhol, quase tudo que a gente sente é com **tener**: *tengo hambre, tengo frío*. Em português, o que você sente AGORA vai com **estar com** — e no dia a dia, "tô com".',
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'Tengo hambre.', pt: 'Estou com fome.' },
          { es: 'Tengo sed.', pt: 'Estou com sede.' },
          { es: 'Tengo frío.', pt: 'Estou com frio.' },
          { es: 'Tengo sueño.', pt: 'Estou com sono.' },
          { es: 'Tengo miedo.', pt: 'Estou com medo.' },
          { es: 'Tengo prisa.', pt: 'Estou com pressa.' },
        ],
      },
      {
        tipo: 'atencao',
        texto: 'A **idade** e o que você **possui** continuam com ter: "tenho vinte anos", "tenho um gato". Só o que se sente é que vai com "estar com".',
      },
      {
        tipo: 'tabela',
        titulo: 'Onde dói?',
        colunas: ['Jeito', 'Exemplo', 'Em espanhol'],
        linhas: [
          ['estar com dor de…', 'Estou com dor de cabeça.', 'Me duele la cabeza.'],
          ['… dói', 'Meu joelho dói.', 'Me duele la rodilla.'],
          ['… doem (mais de um)', 'Minhas costas doem.', 'Me duele la espalda.'],
          ['machucar', 'Machuquei o pé.', 'Me lastimé el pie.'],
        ],
        nota: '"Costas" é sempre plural: as costas, minhas costas doem.',
      },
    ],
    [
      {
        tipo: 'atencao',
        texto: 'Com a parte do corpo, **machucar vai sem o "me"**: "machuquei o joelho" (e não "me machuquei o joelho"). Sem a parte do corpo, o "me" volta: "caí e me machuquei".',
      },
      {
        tipo: 'exemplos',
        titulo: 'Na pista de gelo',
        itens: [
          'O Ari caiu e **machucou** o joelho.',
          'As costas dele **doem** um pouquinho.',
          'Ele **está com frio**, e agora **está com fome**.',
          'A Estrella **está com medo** de patinar. Ela prefere segurar o chocolate quente.',
        ],
      },
      {
        tipo: 'dica',
        texto: 'Quando alguém se machuca, diga "Melhoras!". E se for só um arranhãozinho, o brasileiro chama de "dodói" — palavra de criança que adulto usa com carinho. Eu uso quando piso no meu próprio rabo.',
      },
      {
        tipo: 'brasil',
        titulo: 'Cabeça, ombro, joelho e pé',
        texto: 'Toda criança brasileira aprende o corpo cantando "cabeça, ombro, joelho e pé, joelho e pé!", mexendo em cada parte. E em qualquer esquina tem uma farmácia — no Brasil a gente "toma remédio" e pede conselho ao farmacêutico.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'ligar',
      enunciado: 'Ligue o corpo em português ao espanhol.',
      pares: [
        ['as costas', 'la espalda'],
        ['o joelho', 'la rodilla'],
        ['o tornozelo', 'el tobillo'],
        ['o cotovelo', 'el codo'],
        ['o pescoço', 'el cuello'],
        ['a bochecha', 'la mejilla'],
      ],
      porque: 'Quase nenhuma dessas parece com o espanhol — e "costas" é a pegadinha: costa é a praia.',
    },
    {
      tipo: 'classificar',
      enunciado: 'Ter ou estar com?',
      grupos: ['🎒 ter (idade, o que você tem)', '🤒 estar com (o que você sente)'],
      itens: [
        { texto: '… fome', grupo: 1, porque: 'Fome se sente: estou com fome.' },
        { texto: '… vinte anos', grupo: 0, porque: 'A idade é com ter: tenho vinte anos.' },
        { texto: '… sono', grupo: 1, porque: 'Sono se sente: estou com sono.' },
        { texto: '… um gato chamado Gatito', grupo: 0, porque: 'O que você possui: tenho um gato.' },
        { texto: '… medo do escuro', grupo: 1, porque: 'Medo se sente: estou com medo.' },
        { texto: '… pressa', grupo: 1, porque: 'Pressa se sente: estou com pressa.' },
        { texto: '… duas irmãs', grupo: 0, porque: 'Família que se tem: a Luna tem duas irmãs.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é a tradução certa?',
      itens: [
        {
          pergunta: '"Tengo frío."',
          opcoes: ['Estou frio.', 'Estou com frio.', 'Sou com frio.'],
          certa: 1,
          porque: 'O que se sente vai com "estar com": estou com frio. "Estou frio" seria estar gelado!',
        },
        {
          pergunta: '"Tengo veinte años."',
          opcoes: ['Tenho vinte anos.', 'Estou com vinte anos.', 'Sou vinte anos.'],
          certa: 0,
          porque: 'A idade continua com ter: tenho vinte anos.',
        },
        {
          pergunta: '"Me duele la cabeza."',
          opcoes: ['Tenho doer de cabeça.', 'Estou com cabeça de dor.', 'Estou com dor de cabeça.'],
          certa: 2,
          porque: 'Estar com dor de + a parte do corpo: estou com dor de cabeça.',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a mensagem que o Ari mandou para a Luna.',
      novaPagina: true,
      titulo: '📱 Ari → Luna',
      texto: 'Oi, Luna! Hoje eu caí na pista de gelo e {0} o joelho. Agora as minhas {1} {2}, e eu estou com dor de {3}. A Estrella perguntou se eu estava com {4}. Estava: comi dois pães de queijo!',
      respostas: ['machuquei', 'costas', 'doem', 'cabeça', 'fome'],
      distratores: ['me lastimé', 'espalda', 'dói'],
      porque: [
        'Lastimarse com a parte do corpo: machuquei o joelho (sem "me").',
        'La espalda = as costas.',
        'As costas são plural: doem.',
        'Estar com dor de cabeça.',
        'Quem come dois pães de queijo estava com fome.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Eu', 'tenho', 'fome', 'agora.'],
          errada: 1,
          correcao: 'estou com',
          porque: 'O que se sente vai com "estar com": estou com fome.',
        },
        {
          palavras: ['Minha', 'espalda', 'dói', 'muito.'],
          errada: 1,
          correcao: 'costas (minhas costas doem)',
          porque: 'La espalda = as costas, sempre no plural: minhas costas doem.',
        },
        {
          palavras: ['Eu', 'me', 'machuquei', 'o', 'tornozelo.'],
          errada: 1,
          correcao: '(sem o "me")',
          porque: 'Com a parte do corpo, sem o "me": machuquei o tornozelo.',
        },
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'A Estrella, preocupada, manda mensagem. Escolha a resposta do Ari.',
      com: 'estrella',
      turnos: [
        {
          fala: 'Ari... onde dói?',
          opcoes: ['En la rodilla y la espalda.', 'No joelho e na costa.', 'No joelho e nas costas.'],
          certa: 2,
          porque: 'La espalda = as costas, no plural: nas costas.',
        },
        {
          fala: 'Você tá com frio? Quer meu cachecol?',
          opcoes: ['Tô com muito frio! Quero!', 'Estou muito frio! Quero!', 'Sou com frio! Quero!'],
          certa: 0,
          porque: 'Tô com frio = tengo frío. "Estou frio" seria estar gelado.',
        },
        {
          fala: 'Melhoras, tá? Amanhã você me conta.',
          opcoes: ['Gracias, Estrella!', 'Valeu, Estrella! Amanhã eu conto.', 'Melhoras pra você também!'],
          certa: 1,
          porque: '"Melhoras" se agradece: valeu, obrigado! Devolver o "melhoras" não faz sentido, ela não se machucou.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva em português.',
      itens: [
        { antes: '(tengo sueño) Estou com', depois: '.', aceitas: ['sono'], porque: 'Sueño de dormir = sono: estou com sono.' },
        { antes: '(tengo prisa) Estou com', depois: '.', aceitas: ['pressa'], porque: 'Prisa = pressa: estou com pressa.' },
        { antes: '(me duele el pie) Meu pé', depois: '.', aceitas: ['dói', 'doi'], porque: 'Uma parte só: meu pé dói.' },
        { antes: 'Alguém se machucou? Diga:', depois: '!', aceitas: ['melhoras'], porque: 'Para desejar que a pessoa fique boa: Melhoras!' },
      ],
    },
  ],
  consigo: [
    'dizer as partes do corpo, e que as costas não são a praia;',
    'contar que estou com fome, frio, sono, medo ou pressa;',
    'dizer onde dói: estou com dor de…, meu joelho dói;',
    'desejar melhoras.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'sol', texto: '¡EL SINAL! Hoje é o corpo! Cabeça, ombro, joelho e pé! ¡Joelho e pé!' },
      { quem: 'luna', texto: '¡Joelho e pé! ¡Vamos, panas!' },
      { quem: 'estrella', texto: 'Devagar na escada, tá? Ninguém precisa machucar o joelho de verdade.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma. Ouvi dizer que alguém caiu na pista de gelo.' },
      { quem: 'ari', texto: '...Fui eu.' },
      { quem: 'gatito', texto: 'Então hoje a gente aprende a dizer onde dói. Lição 9: "Ai, que dor!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem! E o joelho, Ari?' },
      { quem: 'ari', texto: 'Tá melhor. Agora eu só tô com fome.' },
      { quem: 'estrella', texto: 'Eu trouxe biscoito. Pra todo mundo.' },
    ],
  },
};
