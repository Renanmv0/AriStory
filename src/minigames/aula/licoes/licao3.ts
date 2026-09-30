import type { Licao } from '../tipos';

/**
 * LIÇÃO 3 — "Cadê o novelo?": uma caça ao tesouro pela escola.
 *
 * As preposições de lugar (em cima de, embaixo de, dentro de…) e as
 * CONTRAÇÕES: em espanhol "en el" anda separado, em português vira "no" — e a
 * contração é obrigatória. De brinde, o "cadê?" e o falso amigo "cerca".
 *
 * O novelo cor-de-rosa e a caminha da sala dos professores existem no jogo
 * (`escolaSalas.ts`): a lição passeia pela escola que o Ari já conhece.
 */
export const LICAO_3: Licao = {
  id: 'cade-o-novelo',
  numero: 3,
  titulo: 'Cadê o novelo?',
  subtitulo: 'Uma caça ao tesouro na escola',
  assunto: 'onde as coisas estão: preposições e contrações',
  emoji: '🧶',
  cor: 'rosa',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'dizer onde as coisas estão: em cima, embaixo, dentro, atrás…;',
          'juntar as palavrinhas: em + o = no, de + a = da;',
          'perguntar "cadê?" como um brasileiro.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'O sumiço do novelo',
        lugar: 'Sala 1, cinco minutos antes da aula',
        falas: [
          { quem: 'gatito', texto: 'Cadê o meu novelo cor-de-rosa? Ele estava em cima da mesa!' },
          { quem: 'ari', texto: 'Será que caiu? Embaixo da mesa não está.' },
          { quem: 'luna', texto: '¡Ya va! Vou olhar dentro da minha mochila... Não, só tem pompom.' },
          { quem: 'renan', texto: 'Atrás da lousa também não. Nem na frente da porta.' },
          { quem: 'ari', texto: 'E na sala dos professores? Perto da caminha do Gatito?' },
          { quem: 'gatito', texto: 'Na minha caminha? ...Ah. Está embaixo da almofada. Fui eu que escondi.' },
          { quem: 'luna', texto: '¡Profe!' },
          { quem: 'gatito', texto: 'É que ele é muito precioso. E olha: vocês acabaram de usar a lição inteira!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cena',
        itens: [
          { emoji: '⬆️', pt: 'em cima de', es: 'encima de' },
          { emoji: '⬇️', pt: 'embaixo de', es: 'debajo de' },
          { emoji: '📦', pt: 'dentro de', es: 'dentro de' },
          { emoji: '🔙', pt: 'atrás de', es: 'detrás de' },
          { emoji: '🔜', pt: 'na frente de', es: 'delante de' },
          { emoji: '↔️', pt: 'ao lado de', es: 'al lado de' },
          { emoji: '📍', pt: 'perto de', es: 'cerca de' },
          { emoji: '❓', pt: 'Cadê…?', es: '¿Dónde está…?' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'As palavrinhas que se juntam',
        texto: 'Em espanhol, "en" e "el" andam separados: *en el suelo*. Em português, eles se juntam numa palavra só: **no chão**. É a **contração** — e ela é obrigatória.',
      },
      {
        tipo: 'tabela',
        colunas: ['', '+ o', '+ a', '+ os', '+ as'],
        linhas: [
          ['em', 'no', 'na', 'nos', 'nas'],
          ['de', 'do', 'da', 'dos', 'das'],
          ['por', 'pelo', 'pela', 'pelos', 'pelas'],
          ['a', 'ao', 'à', 'aos', 'às'],
        ],
        nota: 'Com "um" e "uma" também: em + um = num, em + uma = numa. E o acento de "à" tem nome: crase.',
      },
      {
        tipo: 'exemplos',
        itens: [
          'O novelo está **no** chão. *(en el suelo)*',
          'A caminha **do** Gatito é macia. *(del gato)*',
          'O Gatito passeia **pelo** saguão. *(por el vestíbulo)*',
          'A Luna treina **na** quadra. *(en la cancha)*',
          'Vamos **à** sala dos professores! *(a la sala)*',
        ],
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'en el suelo', pt: 'no chão' },
          { es: 'de la escuela', pt: 'da escola' },
          { es: 'por el pasillo', pt: 'pelo corredor' },
          { es: 'encima de', pt: 'em cima de' },
          { es: 'debajo de', pt: 'embaixo de' },
          { es: 'cerca de', pt: 'perto de' },
        ],
      },
      {
        tipo: 'atencao',
        texto: '**"Cerca"**, em português, é a grade em volta de um terreno! "Cerca de" existe, mas quer dizer *mais ou menos*: cerca de dez alunos. Para "cerca de" do espanhol, diga **perto de**.',
      },
      {
        tipo: 'dica',
        texto: '"Em cima" são duas palavras; "embaixo" é uma só. E "cadê?" é o jeito brasileiro de perguntar onde está: "Cadê o meu novelo?".',
      },
      {
        tipo: 'brasil',
        titulo: 'De onde vem o "cadê"',
        texto: '"Cadê" nasceu de *"que é de…?"*, que a fala foi encurtando: quede… **cadê**! É informal, e todo mundo usa — do Gatito ao presidente.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'escolha',
      enunciado: 'Onde está o novelo? Olhe o desenho.',
      itens: [
        {
          pergunta: 'O novelo está…',
          figura: { objeto: '🧶', lugar: 'em-cima', base: 'caixa' },
          opcoes: ['embaixo da caixa', 'em cima da caixa', 'dentro da caixa'],
          certa: 1,
          porque: 'Ele está por cima, apoiado na tampa: em cima da caixa.',
        },
        {
          pergunta: 'E agora?',
          figura: { objeto: '🧶', lugar: 'embaixo', base: 'mesa' },
          opcoes: ['embaixo da mesa', 'em cima da mesa', 'atrás da mesa'],
          certa: 0,
          porque: 'No chão, entre as pernas da mesa: embaixo da mesa (debajo de la mesa).',
        },
        {
          pergunta: 'E agora?',
          figura: { objeto: '🧶', lugar: 'dentro', base: 'caixa' },
          opcoes: ['ao lado da caixa', 'longe da caixa', 'dentro da caixa'],
          certa: 2,
          porque: 'Ele está lá dentro, espiando: dentro da caixa.',
        },
        {
          pergunta: 'E agora?',
          figura: { objeto: '🧶', lugar: 'atras', base: 'caixa' },
          opcoes: ['na frente da caixa', 'atrás da caixa', 'embaixo da caixa'],
          certa: 1,
          porque: 'A caixa tapa um pedaço dele: o novelo está atrás da caixa (detrás de la caja).',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Junte as peças: cada soma vira uma palavra só.',
      pares: [
        ['em + o', 'no'],
        ['em + a', 'na'],
        ['de + o', 'do'],
        ['por + o', 'pelo'],
        ['a + a', 'à'],
        ['em + uma', 'numa'],
      ],
      porque: 'As contrações: em vira n-, de vira d-, por vira pel-, e a + a vira à, com crase.',
    },
    {
      tipo: 'lacunas',
      enunciado: 'O Gatito deixou pistas na lousa. Complete com as contrações do banco.',
      titulo: 'Caça ao tesouro 🐾',
      texto: 'Pista 1: o tesouro não está {0} Sala 1. Pista 2: passe {1} corredor até a sala {2} professores. Pista 3: olhe {3} caminha, embaixo {4} almofada.',
      respostas: ['na', 'pelo', 'dos', 'na', 'da'],
      distratores: ['no', 'pela', 'das'],
      porque: [
        'em + a (a Sala 1) = na.',
        'por + o (o corredor) = pelo.',
        'de + os (os professores) = dos.',
        'em + a (a caminha) = na.',
        'de + a (a almofada) = da.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['O', 'novelo', 'está', 'en el', 'chão.'],
          errada: 3,
          correcao: 'no',
          porque: 'Em português, "en el" vira uma palavra só: no chão.',
        },
        {
          palavras: ['A', 'escola', 'fica', 'cerca', 'do', 'clube.'],
          errada: 3,
          correcao: 'perto',
          porque: '"Cerca", em português, é grade! O "cerca de" do espanhol é "perto de".',
        },
        {
          palavras: ['O', 'Gatito', 'passeia', 'por o', 'saguão.'],
          errada: 3,
          correcao: 'pelo',
          porque: 'por + o = pelo: o Gatito passeia pelo saguão.',
        },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Pense na Sala 1 do jogo. Verdadeiro ou falso?',
      itens: [
        {
          frase: 'A lousa fica atrás da mesa do professor.',
          verdade: true,
          porque: 'Olhando das carteiras, a mesa fica na frente da lousa — e a lousa, atrás da mesa.',
        },
        {
          frase: 'As bandeiras ficam embaixo das carteiras.',
          verdade: false,
          porque: 'Elas ficam na parede, uma de cada lado da lousa.',
        },
        {
          frase: 'Antes da aula, os oculinhos do Gatito ficam em cima da mesa dele.',
          verdade: true,
          porque: 'Em cima da mesa, esperando a hora da aula.',
        },
        {
          frase: 'O ginásio fica dentro da Sala 1.',
          verdade: false,
          porque: 'O ginásio tem porta própria, no saguão — é a casa dos Gatitos.',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['Cadê', 'o', 'novelo', 'do', 'Gatito?'], porque: '"Cadê" abre a pergunta, e de + o = do: "Cadê o novelo do Gatito?"' },
        { pedacos: ['O', 'pompom', 'está', 'dentro', 'da', 'mochila.'], porque: '"Dentro de" + a mochila = dentro da mochila.' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva a palavra que falta.',
      itens: [
        { antes: 'em + a mesa → O novelo está', depois: 'mesa.', aceitas: ['na'], porque: 'em + a = na: na mesa.' },
        { antes: 'de + o Gatito → A caminha', depois: 'Gatito.', aceitas: ['do'], porque: 'de + o = do: a caminha do Gatito.' },
        { antes: 'debajo de → O novelo está', depois: 'da almofada.', aceitas: ['embaixo'], porque: '"Embaixo" é uma palavra só, tudo junto: embaixo da almofada.' },
      ],
    },
  ],
  consigo: [
    'dizer onde as coisas estão: em cima, embaixo, dentro, atrás, ao lado;',
    'juntar em + o = no, de + a = da, por + o = pelo;',
    'perguntar "cadê?";',
    'lembrar que "cerca", em português, é grade.',
  ],
  aula: {
    chama: 'estrella',
    chamada: [
      { quem: 'estrella', texto: 'Ouviram? É o sinal. A aula do Gatito.' },
      { quem: 'estrella', texto: 'Ele passou a manhã inteira procurando alguma coisa pela escola... Tomara que ache antes da aula, coitadinho.' },
      { quem: 'estrella', texto: 'Vamos sem correr, tá? ...Sol. Sem correr.' },
      { quem: 'sol', texto: '¡YA VOY, YA VOY! ¡Sem correr! ...Rapidinho!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Turma, antes da aula... alguém viu o meu novelo?' },
      { quem: 'renan', texto: 'De novo, professor?' },
      { quem: 'gatito', texto: 'É o assunto de hoje: onde as coisas estão. Lição 3: "Cadê o novelo?".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Agora vocês acham qualquer coisa nesta escola.' },
      { quem: 'ari', texto: 'Até o novelo?' },
      { quem: 'gatito', texto: 'Principalmente o novelo. Ele está embaixo da almofada. Não contem pra ninguém.' },
    ],
  },
};
