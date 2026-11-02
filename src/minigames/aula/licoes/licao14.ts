import type { Licao } from '../tipos';

/**
 * LIÇÃO 14 — "Mexa, misture, prove!": o brigadeiro na cozinha do Mania.
 *
 * O IMPERATIVO, pela receita: o pedido educado de quem manda na cozinha. A
 * regra é a do "você" (pega o "eu" do presente, tira o -o e põe a vogal
 * contrária: misturo → misture, mexo → mexa) e o espanhol tem a mesma ideia —
 * mas muda de verbo (mezclar, revolver, agregar) e, no "tú", muda de forma
 * (mezcla / no mezcles), coisa que o português não faz: negar é só pôr o
 * "não". Os irregulares (ponha, faça, diga, traga, vá) seguem o "eu".
 *
 * E as pegadinhas de cozinha para quem fala espanhol: TIRAR (que lá é
 * jogar) e PRONTO (que lá é logo).
 *
 * O Walter, o chef, só late: a Josefina lê a receita "traduzindo" o que ele
 * diz. É a lição do Mania por dentro (a cozinha, não o salão da lição 2).
 */
export const LICAO_14: Licao = {
  id: 'mexa-misture-prove',
  numero: 14,
  titulo: 'Mexa, misture, prove!',
  subtitulo: 'Brigadeiro na cozinha do Mania',
  assunto: 'o imperativo e as medidas da receita',
  emoji: '🍫',
  cor: 'coral',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'dar ordens gentis na cozinha: misture, mexa, adicione;',
          'usar o imperativo que foge da regra: ponha, faça, traga;',
          'negar sem trocar de verbo: mexa → não mexa;',
          'entender as medidas da receita e fugir dos falsos amigos da cozinha.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'O brigadeiro do Walter',
        lugar: 'A cozinha do Mania de Churrasco, num sábado à tarde',
        falas: [
          { quem: 'josefina', texto: 'Bem-vindos, meu bem... Hoje o Walter ensina o brigadeiro. Eu leio a receita pra ele.' },
          { quem: 'walter', texto: 'Au! Au!' },
          { quem: 'josefina', texto: 'Ele disse: primeiro, ponha a panela no fogo baixo.' },
          { quem: 'sol', texto: '¡FOGO ALTÍSSIMO!' },
          { quem: 'estrella', texto: 'Sol... fogo baixo. Não deixe queimar.' },
          { quem: 'josefina', texto: 'Adicione uma lata de leite condensado, meu bem, e duas colheres de chocolate em pó.' },
          { quem: 'ari', texto: 'E agora eu mexo?' },
          { quem: 'josefina', texto: 'Mexa, sim. Mexa sem parar, até desgrudar do fundo.' },
          { quem: 'sol', texto: '¿Posso provar?' },
          { quem: 'josefina', texto: 'Espere esfriar, Sol. Depois, faça as bolinhas e passe no granulado.' },
          { quem: 'renan', texto: 'Pra conversar a gente diz "mexe" e "põe". Na receita é "mexa" e "ponha".' },
          { quem: 'walter', texto: 'Au!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cozinha',
        itens: [
          { emoji: '🍫', pt: 'o brigadeiro', es: 'el dulce brasileño de chocolate', nota: 'o docinho de festa' },
          { emoji: '🥛', pt: 'o leite condensado', es: 'la leche condensada' },
          { emoji: '🤎', pt: 'o chocolate em pó', es: 'el chocolate en polvo' },
          { emoji: '🧈', pt: 'a manteiga', es: 'la mantequilla' },
          { emoji: '🍳', pt: 'a panela', es: 'la olla' },
          { emoji: '🥄', pt: 'a colher de sopa', es: 'la cucharada' },
          { emoji: '🔥', pt: 'o fogo baixo', es: 'el fuego lento' },
          { emoji: '✨', pt: 'o granulado', es: 'las chispitas de chocolate' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Como se forma o imperativo',
        texto: 'É o jeito de pedir ou mandar com educação. Para o **você**, a conta é simples: pegue o **eu** do presente, **tire o -o** e ponha a **vogal contrária** — os verbos em **-ar** ganham **-e**; os em **-er** e **-ir** ganham **-a**.',
      },
      {
        tipo: 'tabela',
        colunas: ['Infinitivo', 'Eu (presente)', 'Imperativo', 'Em espanhol'],
        linhas: [
          ['misturar', 'misturo', 'misture', 'mezcle'],
          ['mexer', 'mexo', 'mexa', 'revuelva'],
          ['adicionar', 'adiciono', 'adicione', 'agregue'],
          ['abrir', 'abro', 'abra', 'abra'],
          ['colocar', 'coloco', 'coloque', 'ponga'],
        ],
        nota: 'Para o som não mudar, o c vira qu (coloque) e o g vira gu (chegue).',
      },
      {
        tipo: 'tabela',
        titulo: 'Os que fogem da regra',
        colunas: ['Infinitivo', 'Imperativo', 'Em espanhol'],
        linhas: [
          ['pôr', 'ponha', 'ponga'],
          ['fazer', 'faça', 'haga'],
          ['dizer', 'diga', 'diga'],
          ['trazer', 'traga', 'traiga'],
          ['ir', 'vá', 'vaya'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Para **negar**, em português é só pôr o **não** antes: mexa → **não mexa**. O verbo não muda! Em espanhol, o "tú" muda de forma (*mezcla* → *no mezcles*), e é daí que vêm os erros.',
      },
      {
        tipo: 'dica',
        texto: 'No dia a dia, o brasileiro usa o "mexe!", "põe!", "faz!", "vem!" (a forma do presente de ele). Na receita escrita e depois do "não", é "mexa", "ponha", "faça", "venha". As duas existem — saiba qual combina com a hora.',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'As medidas da receita',
        colunas: ['Na receita', 'Em espanhol'],
        linhas: [
          ['uma colher de sopa', 'una cucharada'],
          ['uma colher de chá', 'una cucharadita'],
          ['uma xícara', 'una taza'],
          ['uma lata', 'una lata'],
          ['uma pitada', 'una pizca'],
          ['a gosto', 'al gusto'],
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Falsos amigos da cozinha',
        colunas: ['Palavra', 'Em português é…', 'Em espanhol é…'],
        linhas: [
          ['tirar', 'retirar (tire do fogo)', 'jogar, lanzar'],
          ['pronto', 'feito, pode comer', 'rápido, logo'],
          ['copo', 'para beber', 'el vaso'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Se a receita diz "**tire** a panela do fogo", não é para jogar a panela fora: é para **retirar**. E se o brigadeiro "está **pronto**", ele já está feito — pode comer!',
      },
      {
        tipo: 'brasil',
        titulo: 'O brigadeiro',
        texto: 'Diz a história que o brigadeiro nasceu nos anos 1940, na campanha de um candidato a presidente, o Brigadeiro Eduardo Gomes — daí o nome. Hoje não falta em festa de aniversário, e **lamber a panela** no fim é sagrado.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'A Sol quer ajudar. Escolha o que o Ari diz a ela.',
      com: 'sol',
      turnos: [
        {
          fala: '¡Eu quero ajudar! O que eu faço?',
          opcoes: ['Mexo o brigadeiro, Sol!', 'Mexa o brigadeiro, Sol!', 'Mexer o brigadeiro, Sol!'],
          certa: 1,
          porque: 'Para mandar gentilmente: mexo → mexa.',
        },
        {
          fala: '¡Eu ponho a lata INTEIRA de chocolate!',
          opcoes: ['Não ponga tudo, Sol! Só duas colheres.', 'Não ponha tudo, Sol! Só duas colheres.', 'Não pôr tudo, Sol! Só duas colheres.'],
          certa: 1,
          porque: 'Pôr → ponha (com nh). O "ponga" é do espanhol.',
        },
        {
          fala: 'Ai! ¡Já está queimando!',
          opcoes: ['Calma! Jogue a panela fora.', 'Calma! Retire a panela do fogo.', 'Calma! Tire fuera a panela.'],
          certa: 1,
          porque: 'Retirar do fogo. E "jogar fora" seria perder o brigadeiro.',
        },
        {
          fala: '¿Já está listo?',
          opcoes: ['Sim, está pronto! Prove um pouquinho.', 'Sim, está listo! Prove um pouquinho.', 'Sim, logo fica pronto. Prove um pouquinho.'],
          certa: 0,
          porque: 'Listo, em português, é pronto: feito, pode comer.',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue o verbo ao imperativo (você).',
      pares: [
        ['misturar', 'misture'],
        ['mexer', 'mexa'],
        ['abrir', 'abra'],
        ['colocar', 'coloque'],
        ['fazer', 'faça'],
        ['pôr', 'ponha'],
      ],
      porque: 'Pega o "eu" (misturo, mexo, abro, coloco, faço, ponho), tira o -o e põe a vogal contrária: -e para o -ar, -a para os outros.',
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha a melhor opção.',
      itens: [
        {
          pergunta: 'Na receita: "___ o leite condensado." (adicionar)',
          opcoes: ['Adicione', 'Adiciono', 'Adicionei'],
          certa: 0,
          porque: 'Verbo em -ar: adiciono → adicione.',
        },
        {
          pergunta: 'O que quer dizer: "Tire a panela do fogo"?',
          opcoes: ['Jogue a panela fora.', 'Retire a panela do fogo.', 'Acenda o fogo da panela.'],
          certa: 1,
          porque: 'Tirar, em português, é retirar. Em espanhol, tirar é jogar — por isso a pegadinha.',
        },
        {
          pergunta: 'Na receita: "___ o brigadeiro esfriar." (deixar)',
          opcoes: ['Deixe', 'Deixo', 'Deixei'],
          certa: 0,
          porque: 'Deixo → deixe: -ar ganha -e.',
        },
        {
          pergunta: 'O brigadeiro "está pronto". O que isso quer dizer?',
          opcoes: ['Já está feito, pode comer.', 'Vai ficar pronto logo.', 'Está quase queimando.'],
          certa: 0,
          porque: 'Pronto, em português, é feito. Em espanhol, pronto quer dizer logo — outra pegadinha.',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a ordem da receita.',
      itens: [
        { pedacos: ['Ponha', 'a panela', 'no fogo', 'baixo.'], porque: 'O pedido começa pelo verbo: Ponha a panela no fogo baixo.' },
        { pedacos: ['Mexa', 'sem parar', 'até desgrudar', 'do fundo.'], porque: 'Mexa sem parar, até desgrudar do fundo.' },
        { pedacos: ['Espere', 'esfriar', 'antes de', 'enrolar.'], porque: 'Espere esfriar antes de enrolar.' },
        { pedacos: ['Não', 'deixe', 'a panela', 'queimar!'], porque: 'Para negar: não + o mesmo verbo (deixe).' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a receita do Walter.',
      titulo: '🍫 Brigadeiro do Walter',
      novaPagina: true,
      texto: 'Primeiro, {0} a panela no fogo baixo. {1} uma lata de leite condensado e duas colheres de chocolate em pó. {2} sem parar, até desgrudar do fundo. {3} a panela do fogo e deixe esfriar. Por fim, {4} bolinhas e passe no granulado.',
      respostas: ['ponha', 'Adicione', 'Mexa', 'Retire', 'faça'],
      distratores: ['Mexo', 'Adiciono', 'faço'],
      porque: [
        'Pôr é irregular: ponho → ponha.',
        'Adicionar: adiciono → adicione.',
        'Mexer: mexo → mexa.',
        'Retirar: retiro → retire (tirar vale também).',
        'Fazer: faço → faça.',
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva o imperativo (você).',
      itens: [
        { antes: '(misturar)', depois: 'tudo na tigela.', aceitas: ['misture'], porque: 'Misturo → misture.' },
        { antes: '(abrir)', depois: 'a lata de leite condensado.', aceitas: ['abra'], porque: 'Abro → abra (-ir ganha -a).' },
        { antes: '(fazer)', depois: 'bolinhas pequenas.', aceitas: ['faça'], porque: 'Faço → faça.' },
        { antes: '(trazer)', depois: 'a colher, por favor.', aceitas: ['traga'], porque: 'Trago → traga.' },
        { antes: 'Não (deixar)', depois: 'queimar!', aceitas: ['deixe'], porque: 'Para negar, o mesmo verbo: não deixe.' },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Ponga', 'a panela', 'no fogo', 'baixo.'],
          errada: 0,
          correcao: 'Ponha',
          porque: 'O "ponga" é do espanhol. Em português: ponha (com nh).',
        },
        {
          palavras: ['Cozinhe', 'o brigadeiro', 'em', 'fuego', 'baixo.'],
          errada: 3,
          correcao: 'fogo',
          porque: 'Fuego é fogo. (E o fogo baixo é o fogo lento.)',
        },
        {
          palavras: ['Espere', 'o', 'brigadeiro', 'ficar', 'listo.'],
          errada: 4,
          correcao: 'pronto.',
          porque: 'Listo vira pronto: feito, pode comer.',
        },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Receita escrita ou conversa do dia a dia?',
      grupos: ['📖 receita escrita', '🗣️ conversa do dia a dia'],
      itens: [
        { texto: 'Misture bem e leve ao fogo.', grupo: 0, porque: 'Imperativo de livro de receita: misture.' },
        { texto: 'Mexe aí, Ari!', grupo: 1, porque: 'Mexe, falado entre amigos.' },
        { texto: 'Ponha uma pitada de sal.', grupo: 0, porque: 'Ponha: o imperativo escrito.' },
        { texto: 'Põe mais chocolate!', grupo: 1, porque: 'Põe: o jeito de falar.' },
        { texto: 'Retire do fogo e deixe esfriar.', grupo: 0, porque: 'Retire e deixe: receita.' },
        { texto: 'Vem cá provar!', grupo: 1, porque: 'Vem: o chamado do dia a dia.' },
      ],
    },
  ],
  consigo: [
    'dar ordens gentis na cozinha: misture, mexa, adicione;',
    'usar o imperativo irregular: ponha, faça, diga, traga;',
    'negar com o "não" sem trocar de verbo: não queime, não mexa;',
    'entender as medidas: colher de sopa, xícara, pitada;',
    'não cair no "tirar" e no "pronto".',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'estrella', texto: 'O sinal... O Gatito disse que hoje a aula tem cheiro de chocolate.' },
      { quem: 'sol', texto: '¡CHOCOLATE! ¡Já estou correndo!' },
      { quem: 'luna', texto: '¡Ya va, Sol! Espera a gente, pana!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje a aula tem cheiro de chocolate.' },
      { quem: 'gatito', texto: 'Estamos na cozinha do Mania — de mentirinha, na apostila. O chef é o Walter.' },
      { quem: 'walter', texto: 'Au!' },
      { quem: 'gatito', texto: 'Ele disse que ninguém prova antes da hora. Abram na lição 14: "Mexa, misture, prove!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Parabéns, Ari! Agora você manda na cozinha. Com educação.' },
      { quem: 'renan', texto: 'Mexa, Ari, mexa!' },
      { quem: 'walter', texto: 'Au! Au!' },
      { quem: 'gatito', texto: 'Ele aprovou. E guardou a panela pra lamber sozinho.' },
    ],
  },
};
