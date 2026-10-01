import type { Licao } from '../tipos';

/**
 * LIÇÃO 12 — "Quanto custa, Josefina?": compras na lojinha da estufa. A
 * última do Módulo 2.
 *
 * PREÇOS E NÚMEROS (o "e" que o português põe entre tudo: cento E vinte E
 * cinco) e O PLURAL QUE MUDA — justamente as terminações que o espanhol não
 * tem: -ão (limões, pães, mãos), -l (animais, papéis, girassóis) e -m
 * (jardins, bens). É a lição da moeda da estufa: um girassol, dois
 * girassóis.
 *
 * A Josefina vende devagar e chama todo mundo de "meu bem" — e, no plural,
 * de "meus bens".
 */
export const LICAO_12: Licao = {
  id: 'quanto-custa',
  numero: 12,
  titulo: 'Quanto custa, Josefina?',
  subtitulo: 'Compras na lojinha da estufa',
  assunto: 'preços, números e o plural que muda (-ão, -l, -m)',
  emoji: '🛍️',
  cor: 'lilas',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'perguntar o preço, achar caro e pedir desconto;',
          'dizer números e preços em reais;',
          'fazer o plural das palavras em -ão, -l e -m.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Na lojinha',
        lugar: 'A lojinha da Josefina, na estufa',
        falas: [
          { quem: 'josefina', texto: 'Bom dia, meus bens... Hoje tem chapéus, anéis e botões novinhos.' },
          { quem: 'ari', texto: 'Quanto custa esse chapéu?' },
          { quem: 'josefina', texto: 'Esse sai por... quinze... girassóis, meu bem.' },
          { quem: 'ari', texto: 'Quinze girassols?' },
          { quem: 'renan', texto: 'Girassóis. Um girassol, dois girassóis.' },
          { quem: 'sol', texto: '¡Eu quero os dois anéis! ¡Y los botones! ...E os botões!' },
          { quem: 'estrella', texto: 'Sol, você não tem dedo pra tanto anel.' },
          { quem: 'luna', texto: 'Josefina, faz um desconto pra gente?' },
          { quem: 'josefina', texto: 'Pra vocês, faço. E levem dois limões de brinde.' },
          { quem: 'ari', texto: 'Quanto fica tudo?' },
          { quem: 'josefina', texto: 'Trinta e oito girassóis, meu bem. Sem pressa pra contar.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras de compra',
        itens: [
          { emoji: '💰', pt: 'Quanto custa?', es: '¿Cuánto cuesta?' },
          { emoji: '💸', pt: 'caro · barato', es: 'caro · barato' },
          { emoji: '🏷️', pt: 'o desconto', es: 'el descuento' },
          { emoji: '🎁', pt: 'de brinde', es: 'de regalo · gratis' },
          { emoji: '🪙', pt: 'o troco', es: 'el vuelto · el cambio' },
          { emoji: '🤝', pt: 'Fechado!', es: '¡Trato hecho!' },
          { emoji: '🌻', pt: 'um girassol → dois girassóis', es: 'un girasol → dos girasoles' },
          { emoji: '🍋', pt: 'um limão → dois limões', es: 'un limón → dos limones' },
        ],
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Os números',
        colunas: ['', 'Em português', 'Em espanhol'],
        linhas: [
          ['16 · 17 · 19', 'dezesseis · dezessete · dezenove', 'dieciséis · diecisiete · diecinueve'],
          ['20 · 30 · 40', 'vinte · trinta · quarenta', 'veinte · treinta · cuarenta'],
          ['50 · 60 · 70', 'cinquenta · sessenta · setenta', 'cincuenta · sesenta · setenta'],
          ['80 · 90', 'oitenta · noventa', 'ochenta · noventa'],
          ['100 · 101', 'cem · cento e um', 'cien · ciento uno'],
          ['200 · 500', 'duzentos · quinhentos', 'doscientos · quinientos'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'O português põe **"e" entre tudo**: trinta **e** oito, cento **e** vinte **e** cinco (em espanhol, *ciento veinticinco*). E o 100 sozinho é **cem**; daí pra frente, **cento**.',
      },
      {
        tipo: 'tabela',
        titulo: 'Na hora de comprar',
        colunas: ['', 'Em espanhol'],
        linhas: [
          ['Quanto custa? · Quanto é?', '¿Cuánto cuesta? · ¿Cuánto es?'],
          ['Quanto fica tudo?', '¿Cuánto es todo?'],
          ['Tá caro! · Tá barato.', '¡Está caro! · Está barato.'],
          ['Faz um desconto?', '¿Me hace un descuento?'],
          ['Pode ficar com o troco.', 'Quédese con el vuelto.'],
        ],
      },
      {
        tipo: 'brasil',
        titulo: 'O real',
        texto: 'O dinheiro do Brasil é o **real** (no plural, reais), escrito R$. Os centavos vêm depois da vírgula e os milhares, depois do ponto: R$ 1.250,90. E quase tudo se paga com **Pix**, pelo celular — até o pastel da feira.',
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O plural que muda',
        texto: 'A maioria das palavras só ganha **-s**, como no espanhol: casa → casas. Mas três terminações mudam — e são justamente as que o espanhol não tem.',
      },
      {
        tipo: 'tabela',
        colunas: ['A palavra termina em…', 'O plural', 'Exemplos'],
        linhas: [
          ['-ão', '-ões, -ães ou -ãos', 'limão → limões · pão → pães · mão → mãos'],
          ['-al, -el, -ol, -ul', 'troca o -l por -is', 'animal → animais · papel → papéis · girassol → girassóis'],
          ['-m', 'troca o -m por -ns', 'jardim → jardins · bem → bens · bombom → bombons'],
          ['-r, -z', 'ganha -es', 'flor → flores · luz → luzes'],
          ['-éu', 'ganha -s', 'chapéu → chapéus'],
        ],
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'animales', pt: 'animais' },
          { es: 'papeles', pt: 'papéis' },
          { es: 'limones', pt: 'limões' },
          { es: 'panes', pt: 'pães' },
          { es: 'jardines', pt: 'jardins' },
        ],
      },
      {
        tipo: 'dica',
        texto: 'O -ão é o mais difícil: não tem regra perfeita. Mas o -ões é o mais comum de todos — na dúvida, vai de -ões. E pergunta pro Renan.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'classificar',
      enunciado: 'O plural de cada uma: -ões, -ães ou -ãos?',
      grupos: ['-ões', '-ães', '-ãos'],
      itens: [
        { texto: 'limão', grupo: 0, porque: 'Limão → limões (o mais comum).' },
        { texto: 'pão', grupo: 1, porque: 'Pão → pães.' },
        { texto: 'mão', grupo: 2, porque: 'Mão → mãos.' },
        { texto: 'botão', grupo: 0, porque: 'Botão → botões.' },
        { texto: 'cão', grupo: 1, porque: 'Cão → cães (e "cachorro" é mais comum no Brasil).' },
        { texto: 'irmão', grupo: 2, porque: 'Irmão → irmãos.' },
        { texto: 'melão', grupo: 0, porque: 'Melão → melões.' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva o plural.',
      itens: [
        { antes: 'um girassol → dois', aceitas: ['girassóis', 'girassois'], porque: '-ol troca o -l por -is: girassóis.' },
        { antes: 'um papel → dois', aceitas: ['papéis', 'papeis'], porque: '-el troca o -l por -is: papéis.' },
        { antes: 'um jardim → dois', aceitas: ['jardins'], porque: '-m vira -ns: jardins.' },
        { antes: 'um anel → dois', aceitas: ['anéis', 'aneis'], porque: '-el troca o -l por -is: anéis.' },
        { antes: 'um chapéu → dois', aceitas: ['chapéus', 'chapeus'], porque: '-éu só ganha -s: chapéus.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Como se diz o preço?',
      itens: [
        {
          pergunta: 'R$ 38,00',
          opcoes: ['trinta oito reais', 'trinta e oito reais', 'treinta y ocho reais'],
          certa: 1,
          porque: 'Entre a dezena e a unidade vai um "e": trinta e oito.',
        },
        {
          pergunta: 'R$ 125,00',
          opcoes: ['cem vinte e cinco reais', 'cento vinte e cinco reais', 'cento e vinte e cinco reais'],
          certa: 2,
          porque: 'Depois do 100 é "cento", e o "e" vai entre tudo: cento e vinte e cinco.',
        },
        {
          pergunta: 'R$ 100,00',
          opcoes: ['cem reais', 'cento reais', 'um cento de reais'],
          certa: 0,
          porque: 'O 100 sozinho é cem: cem reais.',
        },
        {
          pergunta: 'R$ 500,00',
          opcoes: ['cinco cem reais', 'quinhentos reais', 'cinquenta reais'],
          certa: 1,
          porque: '500 = quinhentos (quinientos, com "nh").',
        },
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'Na lojinha da Josefina. Escolha a resposta do Ari.',
      com: 'josefina',
      turnos: [
        {
          fala: 'Boa tarde, meu bem... O que vai ser?',
          opcoes: ['Cuánto custa esse chapéu?', 'Quanto custa esse chapéu?', 'Quanto cuesta esse chapéu?'],
          certa: 1,
          porque: '¿Cuánto cuesta? = Quanto custa?',
        },
        {
          fala: 'Esse custa quarenta girassóis.',
          opcoes: ['Nossa, tá caro! Faz um desconto?', 'Nossa, tá barato! Faz um desconto?', 'Nossa, é caro! Faz uma descontada?'],
          certa: 0,
          porque: 'Quem pede desconto acha caro: tá caro! Faz um desconto?',
        },
        {
          fala: 'Pra você, faço por trinta.',
          opcoes: ['Cerrado! Vou a levar.', 'Fechado! Vou a levar.', 'Fechado! Vou levar.'],
          certa: 2,
          porque: '¡Trato hecho! = Fechado! E o futuro sem "a": vou levar.',
        },
        {
          fala: 'Aqui está o troco, meu bem. Volte sempre.',
          opcoes: ['Obrigado, Josefina!', 'Obrigada, Josefina!', 'Gracias, Josefina!'],
          certa: 0,
          porque: 'O "obrigado" concorda com quem agradece: o Ari diz obrigado; a Luna diria obrigada.',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a plaquinha da lojinha.',
      titulo: '🌻 Lojinha da Josefina',
      texto: 'Dois {0} por um girassol. Três {1} quentinhos por dois. Os {2} de palha custam vinte, e os {3} de prata, trinta. Comprou dois? Ganha um {4}!',
      respostas: ['limões', 'pães', 'chapéus', 'anéis', 'desconto'],
      distratores: ['limãos', 'pãos', 'anels'],
      porque: [
        'Limão → limões.',
        'Pão → pães.',
        'Chapéu → chapéus (só o -s).',
        'Anel → anéis (o -l vira -is).',
        'O descuento: o desconto.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      novaPagina: true,
      itens: [
        {
          palavras: ['Comprei', 'dois', 'pãos', 'de queijo.'],
          errada: 2,
          correcao: 'pães',
          porque: 'Pão → pães.',
        },
        {
          palavras: ['Os', 'animales', 'da estufa', 'são fofos.'],
          errada: 1,
          correcao: 'animais',
          porque: 'Animal → animais: o -l vira -is.',
        },
        {
          palavras: ['Custa', 'trinta', 'y', 'oito', 'reais.'],
          errada: 2,
          correcao: 'e',
          porque: 'O "y" do espanhol é "e": trinta e oito.',
        },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: '100 sozinho é "cem"; 101 é "cento e um".', verdade: true, porque: 'Cem sozinho; cento quando vem mais coisa.' },
        { frase: 'O plural de "papel" é "papels".', verdade: false, porque: 'O -l vira -is: papéis.' },
        { frase: 'R$ 2,50 se lê "dois reais e cinquenta centavos".', verdade: true, porque: 'Os centavos vêm depois da vírgula.' },
        { frase: '"De brinde" quer dizer de presente, sem pagar.', verdade: true, porque: 'Brinde = regalo, o que vem de graça na compra.' },
        { frase: 'O plural de "mão" é "mães".', verdade: false, porque: 'Mão → mãos. "Mães" é o plural de mãe.' },
      ],
    },
  ],
  consigo: [
    'perguntar o preço, achar caro e pedir desconto;',
    'dizer números e preços: trinta e oito, cento e vinte e cinco;',
    'fazer o plural de -ão, -l e -m: limões, girassóis, jardins;',
    'agradecer, pegar o troco e voltar sempre.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'sol', texto: '¡EL SINAL! ¡ÚLTIMA AULA DEL MÓDULO DOS! ...Do Módulo DOIS!' },
      { quem: 'estrella', texto: 'Hoje é sobre compras. Sol, deixa a carteira guardada, tá?' },
      { quem: 'luna', texto: '¡Vamos, panas! A última é a melhor!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Última lição do Módulo 2.' },
      { quem: 'gatito', texto: 'Hoje a aula é na lojinha da Josefina — de mentirinha, na apostila. Quem sabe contar dinheiro?' },
      { quem: 'ari', texto: 'Eu! Um real, dois reals...' },
      { quem: 'renan', texto: 'Reais.' },
      { quem: 'gatito', texto: 'Por isso mesmo. Lição 12: "Quanto custa, Josefina?".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Parabéns, Ari! O Módulo 2 está completinho!' },
      { quem: 'luna', texto: '¡Qué nota! Doze lições, pana!' },
      { quem: 'renan', texto: 'Você já vai longe em português.' },
      { quem: 'gatito', texto: 'E quanto custa um cafuné pro professor? Esse é de brinde, né?' },
    ],
  },
};
