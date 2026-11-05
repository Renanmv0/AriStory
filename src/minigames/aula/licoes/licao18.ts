import type { Licao } from '../tipos';

/**
 * LIÇÃO 18 — "Maior, melhor, lindíssimo!": o campeonato de pedrinhas no lago.
 * A última do Módulo 3.
 *
 * COMPARAR E EXAGERAR. O comparativo (mais... do que, menos... do que, tão...
 * quanto) é quase igual ao espanhol, e por isso as armadilhas são poucas e
 * certeiras: o "mejor / peor" que NÃO é "mais bom / mais mau" (é MELHOR e
 * PIOR), o "más de diez" que continua "mais de dez", e o -ísimo que vira
 * -ÍSSIMO (dois s!) — com o buenísimo virando ÓTIMO e o malísimo, PÉSSIMO.
 *
 * A Sol é a estrela da lição: ela exagera tudo (gigantíssima, rapidíssima),
 * e a Estrella é a que mede de verdade. O lago é o das pedrinhas do Villa
 * Lobos (quicar pedrinha); a cena é "de mentirinha, na apostila".
 */
export const LICAO_18: Licao = {
  id: 'maior-melhor-lindissimo',
  numero: 18,
  titulo: 'Maior, melhor, lindíssimo!',
  subtitulo: 'O campeonato de pedrinhas no lago',
  assunto: 'comparar e exagerar: mais que, melhor, -íssimo',
  emoji: '🏆',
  cor: 'lilas',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'comparar: mais… do que, menos… do que, tão… quanto;',
          'usar melhor, pior, maior e menor (e nunca "mais bom");',
          'exagerar com o -íssimo: lindíssimo, rapidíssimo;',
          'dizer ótimo e péssimo no lugar do "buenísimo" e do "malísimo".',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Pedrinhas no lago',
        lugar: 'A beira do lago, no campeonato de pedrinhas',
        falas: [
          { quem: 'luna', texto: '¡Campeonato de pedrinhas! Quem quicar mais vezes no lago ganha!' },
          { quem: 'sol', texto: '¡A MINHA pedra é a maior do lago! É gigantíssima!' },
          { quem: 'estrella', texto: 'Sol, a maior não é a melhor. A boa é a mais lisa e a mais achatada.' },
          { quem: 'ari', texto: 'Esta daqui é mais leve do que a sua, Sol.' },
          { quem: 'luna', texto: 'E tão lisa quanto a da Estrella, pana!' },
          { quem: 'valentina', texto: 'A minha pedrinha é a mais elegante do lago. Não quica tanto quanto a sua, Luna... mas é muito mais bonita.' },
          { quem: 'renan', texto: 'Ari, repara: em português a gente não diz "mais bom". Diz "melhor".' },
          { quem: 'sol', texto: '¡Meu arremesso foi o melhor! ...O pior? ...Foi o mais barulhento!' },
          { quem: 'estrella', texto: 'A pedra da Sol afundou rapidíssimo.' },
          { quem: 'ari', texto: 'A minha quicou mais de quatro vezes!' },
          { quem: 'luna', texto: 'Foi o melhor lance do dia! E a tarde está lindíssima.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do campeonato',
        itens: [
          { emoji: '🪨', pt: 'a pedrinha', es: 'la piedrita' },
          { emoji: '🌊', pt: 'o lago', es: 'el lago' },
          { emoji: '🏆', pt: 'o campeonato', es: 'el campeonato' },
          { emoji: '💦', pt: 'quicar', es: 'rebotar' },
          { emoji: '⬇️', pt: 'afundar', es: 'hundirse' },
          { emoji: '🪶', pt: 'leve', es: 'liviano' },
          { emoji: '🧊', pt: 'liso · achatado', es: 'liso · plano' },
          { emoji: '🌟', pt: 'lindíssimo', es: 'lindísimo' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Comparando',
        texto: 'Para comparar, o português usa as mesmas ideias do espanhol: **mais**, **menos** e **tão… quanto**. A única novidade é o "**do que**" no fim.',
      },
      {
        tipo: 'tabela',
        colunas: ['É…', 'Em português', 'Em espanhol'],
        linhas: [
          ['mais', 'mais leve do que a sua', 'más liviana que la tuya'],
          ['menos', 'menos pesada do que a sua', 'menos pesada que la tuya'],
          ['igual', 'tão lisa quanto a minha', 'tan lisa como la mía'],
          ['mais (número)', 'mais de quatro vezes', 'más de cuatro veces'],
        ],
        nota: 'O "que" sozinho (mais leve que a sua) também se ouve no Brasil. "Do que" é o jeito mais seguro, na fala e na escrita.',
      },
      {
        tipo: 'tabela',
        titulo: 'Os que fogem da regra',
        colunas: ['É…', 'Em português', 'Em espanhol'],
        linhas: [
          ['bom · bem', 'melhor', 'mejor'],
          ['ruim · mal', 'pior', 'peor'],
          ['grande', 'maior', 'mayor'],
          ['pequeno', 'menor', 'menor'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Nunca "mais bom" nem "mais mau": o comparativo de bom é **melhor**, e o de mau é **pior**. A pedra da Luna é **melhor do que** a minha — e a minha é **pior do que** a da Sol hoje.',
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O maior de todos, e o lindíssimo',
        texto: 'Para dizer "**o mais** isso **de** todos", use o artigo e o **mais**: "A pedra **mais** lisa **do** lago", "a **mais** forte **da** turma" (de + a = **da**). E para exagerar de verdade, é o **-íssimo**.',
      },
      {
        tipo: 'tabela',
        colunas: ['É…', 'Superlativo', 'Em espanhol'],
        linhas: [
          ['lindo', 'lindíssimo', 'lindísimo'],
          ['rápido', 'rapidíssimo', 'rapidísimo'],
          ['feliz', 'felicíssimo', 'felicísimo'],
          ['forte', 'fortíssimo', 'fortísimo'],
          ['bom', 'ótimo', 'buenísimo'],
          ['mau · ruim', 'péssimo', 'malísimo'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'O **-íssimo** tem **dois s**: lindíssimo, e não "lindísimo". O z vira c (feliz → felicíssimo) e o acento do adjetivo some (rápido → rapidíssimo). E para o **bom**, o comum é **ótimo** (o "boníssimo" existe, mas quase ninguém usa).',
      },
      {
        tipo: 'dica',
        texto: 'Quando faltar adjetivo forte, cole um **super** ou **mega** na frente: super legal, mega gostoso. Só na conversa, tá? Na prova, prefira o -íssimo.',
      },
      {
        tipo: 'brasil',
        titulo: 'Exagero de carinho',
        texto: 'O brasileiro exagera com amor: "tô **morrendo** de fome", "faz **mil anos** que a gente não se vê", "é o **maior** barato", "um calor de **rachar**". Ninguém acha mentira — é carinho.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'A Sol exagera. Escolha o que o Ari responde.',
      com: 'sol',
      turnos: [
        {
          fala: '¡A MINHA pedra é a maior do lago! É gigantíssima!',
          opcoes: ['Mas a minha é mais leve do que a sua.', 'Mas a minha é mais levo do que a sua.', 'Mas a minha é más leve do que a sua.'],
          certa: 0,
          porque: 'Mais leve do que: leve é masculino e feminino ao mesmo tempo, e o "más" é do espanhol.',
        },
        {
          fala: 'Mas a minha é MELHOR, né?',
          opcoes: ['Não sei se é melhor. Mas é a maior!', 'Não sei se é mais boa. Mas é a maior!', 'Não sei se é mais bom. Mas é a maior!'],
          certa: 0,
          porque: 'O comparativo de bom é melhor. Nada de "mais bom" nem "mais boa".',
        },
        {
          fala: 'E a sua quicou quantas vezes?',
          opcoes: ['Quicou mais de quatro vezes!', 'Quicou más de quatro vezes!', 'Quicou mais quatro vezes!'],
          certa: 0,
          porque: 'Com número, é "mais de": mais de quatro.',
        },
        {
          fala: 'Olha esse lago! Não é lindo?',
          opcoes: ['É lindíssimo!', 'É lindísimo!', 'É lindíssima!'],
          certa: 0,
          porque: 'Lago é masculino: lindíssimo. E o -íssimo tem dois s.',
        },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Mais, menos ou igual?',
      grupos: ['➕ mais', '➖ menos', '🟰 igual'],
      itens: [
        { texto: 'A minha pedra é mais leve do que a sua.', grupo: 0, porque: 'Mais leve: ganha na leveza.' },
        { texto: 'Ela é menos pesada do que a da Sol.', grupo: 1, porque: 'Menos pesada: perde no peso.' },
        { texto: 'A pedra da Luna é tão lisa quanto a minha.', grupo: 2, porque: 'Tão… quanto: empate.' },
        { texto: 'O lago está mais calmo hoje.', grupo: 0, porque: 'Mais calmo.' },
        { texto: 'Ele joga tão bem quanto ela.', grupo: 2, porque: 'Tão bem quanto: igual.' },
        { texto: 'O meu lance foi menos forte do que o seu.', grupo: 1, porque: 'Menos forte.' },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue ao comparativo.',
      pares: [
        ['bom', 'melhor'],
        ['ruim', 'pior'],
        ['grande', 'maior'],
        ['pequeno', 'menor'],
        ['alto', 'mais alto'],
      ],
      porque: 'Quatro fogem da regra (melhor, pior, maior, menor); todos os outros usam "mais".',
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha a melhor opção.',
      itens: [
        {
          pergunta: 'A pedra da Luna é ___ do que a minha. (bom)',
          opcoes: ['melhor', 'mais boa', 'mais bom'],
          certa: 0,
          porque: 'Bom → melhor. Nunca "mais bom".',
        },
        {
          pergunta: 'Como se diz "tan lisa como la mía"?',
          opcoes: ['tão lisa quanto a minha', 'tan lisa como a minha', 'mais lisa quanto a minha'],
          certa: 0,
          porque: 'Tan… como = tão… quanto.',
        },
        {
          pergunta: 'Como se diz "más de diez veces"?',
          opcoes: ['mais de dez vezes', 'más de dez vezes', 'mais dez vezes'],
          certa: 0,
          porque: 'Com número: mais de. O "más" é espanhol.',
        },
        {
          pergunta: 'Como se diz "el peor lance"?',
          opcoes: ['o pior lance', 'o mais mau lance', 'o peor lance'],
          certa: 0,
          porque: 'Peor vira pior. E nunca "mais mau".',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva o superlativo (-íssimo).',
      novaPagina: true,
      itens: [
        { antes: 'lindo →', aceitas: ['lindíssimo'], porque: 'Lindo → lindíssimo (dois s).' },
        { antes: 'rápido →', aceitas: ['rapidíssimo'], porque: 'Rápido → rapidíssimo: o acento do adjetivo some.' },
        { antes: 'feliz →', aceitas: ['felicíssimo'], porque: 'Feliz → felicíssimo: o z vira c.' },
        { antes: 'bom, no superlativo →', aceitas: ['ótimo', 'boníssimo'], porque: 'Bom → ótimo (o "boníssimo" também existe, mas é raro).' },
        { antes: 'mau, no superlativo →', aceitas: ['péssimo', 'malíssimo'], porque: 'Mau → péssimo (o "malíssimo" também existe, mas é raro).' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o relato do campeonato.',
      titulo: '🏆 Diário do campeonato',
      texto: 'A tarde no lago estava {0}! A pedra da Sol era a {1} pesada de todas, mas a da Luna era {2} lisa {3} a da Estrella. No fim, a minha foi a {4} jogada do dia!',
      respostas: ['lindíssima', 'mais', 'tão', 'quanto', 'melhor'],
      distratores: ['lindísima', 'do que', 'mais boa'],
      porque: [
        'Tarde é feminina: lindíssima, com dois s.',
        'A mais pesada de todas: o superlativo usa mais.',
        'Tão… quanto: igual.',
        'Tão lisa quanto: a dupla do tão.',
        'Bom → melhor: a melhor jogada do dia.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['A', 'minha', 'pedra', 'é', 'mais bom', 'do que', 'a sua.'],
          errada: 4,
          correcao: 'melhor',
          porque: 'Bom → melhor. Nunca "mais bom".',
        },
        {
          palavras: ['Foi', 'o', 'lance', 'lindisimo', 'do dia.'],
          errada: 3,
          correcao: 'lindíssimo',
          porque: 'O -íssimo tem dois s e acento no primeiro i.',
        },
        {
          palavras: ['Tem', 'mais', 'que', 'dez', 'pedras', 'no', 'lago.'],
          errada: 2,
          correcao: 'de',
          porque: 'Com número, é "mais de": mais de dez.',
        },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não combina?',
      itens: [
        {
          pergunta: 'Qual destas NÃO existe em português?',
          opcoes: ['melhor', 'pior', 'maior', 'mais bom'],
          certa: 3,
          porque: 'O comparativo de bom é melhor. "Mais bom" não existe.',
        },
        {
          pergunta: 'Qual destas NÃO é um superlativo absoluto?',
          opcoes: ['lindíssimo', 'ótimo', 'péssimo', 'mais lindo'],
          certa: 3,
          porque: '"Mais lindo" é um comparativo; os outros são superlativos absolutos.',
        },
      ],
    },
  ],
  consigo: [
    'comparar com mais… do que, menos… do que, tão… quanto;',
    'usar melhor, pior, maior e menor, e nunca "mais bom";',
    'dizer "mais de dez" quando tem número;',
    'exagerar com o -íssimo e dizer ótimo e péssimo.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'sol', texto: '¡O SINAL! ¡Eu sou a mais rápida da escola! ...Rapidíssima!' },
      { quem: 'estrella', texto: 'Rápida e barulhenta, Sol.' },
      { quem: 'luna', texto: '¡Ya va! Quem chegar primeiro na Sala 1 é a campeã!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Última lição do Módulo 3. Hoje a aula é à beira do lago — de mentirinha, na apostila.' },
      { quem: 'gatito', texto: 'Vamos comparar tudo: a maior pedra, a pedra mais lisa, o melhor arremesso.' },
      { quem: 'sol', texto: '¡O MELHOR É O MEU!' },
      { quem: 'valentina', texto: 'Comparar é facílimo, profe: eu sou a mais estilosa da escola. Pronto, acabou a aula.' },
      { quem: 'gatito', texto: 'Veremos. Abram na lição 18: "Maior, melhor, lindíssimo!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Parabéns, Ari! O Módulo 3 está completinho!' },
      { quem: 'luna', texto: '¡Qué nota! Dezoito lições, pana!' },
      { quem: 'renan', texto: 'Seu português está cada dia melhor.' },
      { quem: 'sol', texto: '¡LINDÍSSIMO! ¡O MAIOR MÓDULO DO MUNDO!' },
      { quem: 'valentina', texto: 'Você foi o melhor hoje, Ari. Quase tão bom quanto eu... Tá bom: melhor que eu.' },
      { quem: 'gatito', texto: 'E o professor mais orgulhoso do universo.' },
    ],
  },
};
