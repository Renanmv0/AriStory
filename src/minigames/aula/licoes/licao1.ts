import type { Licao } from '../tipos';

/**
 * LIÇÃO 1 — "Oi, tudo bem?": o primeiro dia de aula.
 *
 * Cumprimentar do jeito brasileiro, o você/o senhor/a senhora, e o "a gente"
 * com o verbo na terceira pessoa — o que um hispanofalante estranha já no
 * primeiro "oi". A pegadinha de ortografia é a de todo espanhol: o português
 * não tem ¿ nem ¡, e o "y" vira "e".
 */
export const LICAO_1: Licao = {
  id: 'oi-tudo-bem',
  numero: 1,
  titulo: 'Oi, tudo bem?',
  subtitulo: 'O primeiro dia de aula',
  assunto: 'cumprimentos, você e "a gente"',
  emoji: '👋',
  cor: 'coral',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'cumprimentar do jeito brasileiro, de manhã, de tarde e de noite;',
          'responder "tudo bem?" sem contar a vida inteira;',
          'escolher entre você, o senhor e a senhora;',
          'falar "a gente" no lugar de "nós".',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Primeiro dia na Sala 1',
        lugar: 'Escola do Gatito, 8h da manhã',
        falas: [
          { quem: 'gatito', texto: 'Bom dia, turma!' },
          { quem: 'luna', texto: '¡Épale, profe! Quer dizer... bom dia, professor!' },
          { quem: 'gatito', texto: 'Oi, Ari! Tudo bem?' },
          { quem: 'ari', texto: 'Sí... digo, sim! Estou muito bem, obrigado. Dormi bem, tomei café, peguei o ônibus...' },
          { quem: 'renan', texto: 'Ari, é só "tudo, e você?". Ele não precisa saber do ônibus.' },
          { quem: 'gatito', texto: 'Eu adoro saber do ônibus! Mas pode responder só "tudo".' },
          { quem: 'luna', texto: 'Aqui "tudo bem?" é quase um "oi".' },
          { quem: 'ari', texto: 'Então... tudo! E você, Gatito?' },
          { quem: 'gatito', texto: 'Tudo ótimo! Muito prazer, turma. A gente começa agora.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cena',
        itens: [
          { emoji: '👋', pt: 'Oi!', es: '¡Hola!' },
          { emoji: '☀️', pt: 'Bom dia', es: 'Buenos días' },
          { emoji: '🌤️', pt: 'Boa tarde', es: 'Buenas tardes' },
          { emoji: '🌙', pt: 'Boa noite', es: 'Buenas noches', nota: 'para chegar e para ir embora' },
          { emoji: '🙂', pt: 'Tudo bem? · Tudo bom?', es: '¿Qué tal? · ¿Cómo estás?' },
          { emoji: '🤝', pt: 'Muito prazer!', es: '¡Mucho gusto!' },
          { emoji: '🚌', pt: 'Tchau! · Até amanhã!', es: '¡Chao! · ¡Hasta mañana!' },
          { emoji: '🙏', pt: 'Obrigado · Obrigada', es: 'Gracias', nota: 'muda com quem agradece' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Tudo bem? Tudo!',
        texto: 'No Brasil, **"tudo bem?"** é quase um "oi": ninguém espera um relatório do dia. A resposta curta é repetir a palavra da pergunta e devolver: **"Tudo, e você?"**.',
      },
      {
        tipo: 'tabela',
        colunas: ['A pergunta', 'A resposta mais comum'],
        linhas: [
          ['Tudo bem?', 'Tudo, e você?'],
          ['Tudo bom?', 'Tudo bom, e com você?'],
          ['Como vai?', 'Vou bem, obrigado.'],
          ['E aí? Beleza?', 'Beleza! (entre amigos)'],
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Você, o senhor, a senhora',
        colunas: ['Com quem', 'Em português', 'Em espanhol'],
        linhas: [
          ['amigo, colega, o par', 'você', 'tú'],
          ['gente mais velha, cliente, quem você não conhece', 'o senhor · a senhora', 'usted'],
          ['mais de uma pessoa', 'vocês', 'ustedes · vosotros'],
        ],
        nota: 'Com você e com o senhor, o verbo vai na 3ª pessoa: você fala, o senhor fala — igual ao "usted habla".',
      },
      {
        tipo: 'texto',
        titulo: '"A gente" = nós',
        texto: 'No dia a dia, o brasileiro troca **nós** por **a gente**. O verbo fica na 3ª pessoa do singular, como com "ele": *nós vamos* → **a gente vai**; *nós comemos* → **a gente come**.',
      },
      {
        tipo: 'contraste',
        pares: [
          { es: '¿Qué tal?', pt: 'Tudo bem?' },
          { es: 'Mucho gusto.', pt: 'Muito prazer.' },
          { es: '¿Y tú?', pt: 'E você?' },
          { es: 'Nosotros vamos.', pt: 'A gente vai.' },
          { es: 'Chao.', pt: 'Tchau.' },
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Português **não tem ¿ nem ¡**: a pergunta só leva o "?" no final. E o "y" vira **"e"**: Tudo, e você?',
      },
      {
        tipo: 'dica',
        texto: '"Tchau" se escreve com T-C-H. E quem agradece concorda com ele mesmo: o Ari diz obrigad**o**, a Luna diz obrigad**a**.',
      },
      {
        tipo: 'brasil',
        titulo: 'Beijinho no rosto',
        texto: 'Entre amigos, muita gente se cumprimenta com beijinho no rosto — e o número muda de cidade para cidade: em São Paulo costuma ser um, no Rio de Janeiro, dois. Na dúvida, deixe a outra pessoa começar.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'A Luna mandou mensagem. Escolha o que o Ari responde.',
      com: 'luna',
      turnos: [
        {
          fala: 'Oi, Ari! Tudo bem?',
          opcoes: ['Tudo, e você?', 'Sí, tudo.', 'Estoy bien, ¿y tú?'],
          certa: 0,
          porque: 'Para "tudo bem?", o brasileiro responde "tudo!" e devolve a pergunta com "e você?".',
        },
        {
          fala: 'Tudo ótimo! Prazer, eu sou a Luna.',
          opcoes: ['Mucho gusto, Luna!', 'Muito prazer, Luna!', 'Obrigado, Luna!'],
          certa: 1,
          porque: '"Mucho gusto" em português é "muito prazer" — ou só "prazer!".',
        },
        {
          fala: 'Tenho treino agora. Até amanhã, Ari!',
          opcoes: ['¡Chao! ¡Hasta mañana!', 'Prazer, Luna!', 'Tchau! Até amanhã!'],
          certa: 2,
          porque: 'Para ir embora: "tchau", "até amanhã", "até logo". E "tchau" se escreve com T-C-H.',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue cada momento ao cumprimento certo.',
      pares: [
        ['☀️ 8h da manhã, chegando na escola', 'Bom dia!'],
        ['🌤️ 3h da tarde, no ginásio', 'Boa tarde!'],
        ['🌙 9h da noite, saindo do Mania', 'Boa noite!'],
        ['🤝 conhecendo a Luna', 'Muito prazer!'],
        ['🚌 indo embora da escola', 'Tchau, até amanhã!'],
      ],
      porque: 'Bom dia até o almoço, boa tarde até escurecer, boa noite depois — e "boa noite" serve até para ir embora.',
    },
    {
      tipo: 'classificar',
      enunciado: 'Com quem se fala assim? Separe em amigo e formal.',
      grupos: ['😎 amigo', '🎩 formal'],
      itens: [
        { texto: 'E aí, beleza?', grupo: 0, porque: '"E aí" e "beleza" são de amigo para amigo.' },
        { texto: 'Bom dia, senhor. Como vai?', grupo: 1, porque: '"Senhor" é tratamento de respeito: formal.' },
        { texto: 'Oi, tudo bom?', grupo: 0, porque: '"Oi, tudo bom?" é o cumprimento do dia a dia, entre conhecidos.' },
        { texto: 'A senhora precisa de ajuda?', grupo: 1, porque: '"A senhora" é para quem a gente trata com respeito: gente mais velha, clientes.' },
        { texto: 'Falou, até mais!', grupo: 0, porque: '"Falou!" é tchau de amigo, bem informal.' },
        { texto: 'Muito prazer em conhecê-lo.', grupo: 1, porque: '"Conhecê-lo" é jeito de falar formal, de reunião ou de entrevista.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Complete com a forma certa.',
      itens: [
        {
          pergunta: 'A gente ___ de ônibus pra escola.',
          opcoes: ['vamos', 'vai', 'van'],
          certa: 1,
          porque: '"A gente" funciona como "ele": a gente vai, a gente come, a gente estuda.',
        },
        {
          pergunta: 'Ontem a gente ___ muito no piquenique da Luna.',
          opcoes: ['comeu', 'comemos', 'comeram'],
          certa: 0,
          porque: 'No passado também: "a gente comeu" (= nós comemos). "A gente comemos" é um erro comum até de brasileiro!',
        },
        {
          pergunta: 'Luna, ___ também é aluna do Gatito?',
          opcoes: ['tú', 'usted', 'você'],
          certa: 2,
          porque: '"Tú" com acento e "usted" são espanhol. Para um colega, o brasileiro usa "você" (o "tu" sem acento aparece em algumas regiões).',
        },
        {
          pergunta: '"Obrigad__!", disse a Luna.',
          opcoes: ['Obrigado', 'Obrigada'],
          certa: 1,
          porque: 'Quem agradece concorda com o próprio gênero: a Luna diz "obrigada"; o Ari e o Renan dizem "obrigado".',
        },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque na palavra que está errada.',
      itens: [
        {
          palavras: ['¿Tudo', 'bem?'],
          errada: 0,
          correcao: 'Tudo',
          porque: 'Português não usa ¿ nem ¡: só o sinal do final. "Tudo bem?"',
        },
        {
          palavras: ['Tudo', 'bem,', 'y', 'você?'],
          errada: 2,
          correcao: 'e',
          porque: 'O "y" do espanhol é "e" em português: "Tudo bem, e você?"',
        },
        {
          palavras: ['Muito', 'gusto,', 'professor!'],
          errada: 1,
          correcao: 'prazer,',
          porque: '"Mucho gusto" vira "muito prazer". Em português, "gosto" é o sabor — ou o que a gente gosta.',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase na ordem certa.',
      itens: [
        {
          pedacos: ['A gente', 'se', 'vê', 'amanhã!'],
          porque: 'No Brasil, o "se" vem antes do verbo: a gente se vê, a gente se fala.',
        },
        {
          pedacos: ['Prazer,', 'eu', 'sou', 'o', 'Ari.'],
          porque: 'Primeiro o "prazer", depois "eu sou" e o nome — e o brasileiro adora um artigo antes do nome: o Ari, a Luna.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva em português.',
      itens: [
        { antes: '¡Chao! →', depois: '!', aceitas: ['tchau'], porque: '"Tchau" se escreve com T-C-H: tchau!' },
        { antes: 'Nosotros vamos. → A', depois: 'vai.', aceitas: ['gente'], porque: '"Nós vamos" no dia a dia vira "a gente vai".' },
        { antes: 'Mucho gusto. → Muito', depois: '.', aceitas: ['prazer'], porque: '"Mucho gusto" = "muito prazer".' },
      ],
    },
  ],
  consigo: [
    'cumprimentar de manhã, de tarde e de noite;',
    'responder "tudo bem?" como um brasileiro;',
    'escolher entre você, o senhor e a senhora;',
    'usar "a gente" com o verbo certo;',
    'escrever sem ¿ nem ¡.',
  ],
  aula: {
    chama: 'luna',
    chamada: [
      { quem: 'luna', texto: '¡Ya va! Ouviram o sinal? A primeira aula do Gatito vai começar!' },
      { quem: 'luna', texto: 'Hoje é cumprimento: "oi", "tudo bem", essas coisas. Parece fácil, mas tem pegadinha.' },
      { quem: 'luna', texto: 'Vou na frente guardar lugar pra vocês. É na Sala 1!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Bom dia, turma! Bem-vindos à primeira aula de português.' },
      { quem: 'sol', texto: '¡BUENOS DÍAS, PROFE! Quer dizer... BOM DIA!' },
      { quem: 'gatito', texto: 'Bom dia, Sol. Um pouquinho mais baixo, por favor.' },
      { quem: 'estrella', texto: 'Desculpa, professor. Ela acordou assim.' },
      { quem: 'gatito', texto: 'Hoje a gente aprende a dizer oi do jeito brasileiro. Parece fácil... mas tem pegadinha.' },
      { quem: 'luna', texto: 'Tem pegadinha, Ari. Eu caí em todas.' },
      { quem: 'gatito', texto: 'Abram a apostila na lição 1: "Oi, tudo bem?".' },
    ],
    encerramento: [
      { quem: 'renan', texto: 'Tudo ótimo, professor. E você?' },
      { quem: 'gatito', texto: 'Tudo ótimo! Até a próxima aula, turma.' },
      { quem: 'luna', texto: '¡Chao, panas! Quer dizer... tchau!' },
    ],
  },
};
