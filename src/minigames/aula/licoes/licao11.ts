import type { Licao } from '../tipos';

/**
 * LIÇÃO 11 — "Um cartão-postal do Rio": as férias do Gatito, contadas.
 *
 * O PASSADO (pretérito perfeito): os regulares em -ar, -er e -ir (viajei,
 * comi, dormi), os irregulares que mais aparecem (fui, tive, fiz, vi,
 * estive) — com o "fue" que vira "foi" —, e a pegadinha de gente grande do
 * hispanofalante: o "he ido" NÃO se traduz por "tenho ido". Em português, o
 * que já aconteceu é o passado simples ("já fui"); o "tenho ido" é o que vem
 * se repetindo até agora. É o tema que mais tropeça nos cursos para quem fala
 * espanhol.
 *
 * O Gatito voltou de férias e trouxe o cartão-postal que ele manda todo ano…
 * para ele mesmo.
 */
export const LICAO_11: Licao = {
  id: 'cartao-postal-do-rio',
  numero: 11,
  titulo: 'Um cartão-postal do Rio',
  subtitulo: 'As férias do Gatito, contadas no refeitório',
  assunto: 'o passado: fui, comi, vi — e o "tenho feito"',
  emoji: '💌',
  cor: 'mostarda',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'contar o que aconteceu: viajei, comi, dormi;',
          'usar os passados que mais aparecem: fui, tive, fiz, vi;',
          'trocar o "he ido" do espanhol pelo "já fui" do português.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'O cartão-postal',
        lugar: 'Refeitório da escola, depois das férias',
        falas: [
          { quem: 'luna', texto: 'Profe, chegou um cartão-postal... seu. Pra você mesmo?' },
          { quem: 'gatito', texto: 'Eu sempre mando um pra mim. Pra lembrar da viagem.' },
          { quem: 'sol', texto: '¡LÉELO! ...Lê! Lê alto, Ari!' },
          { quem: 'ari', texto: '"Querido Gatito: ontem eu fui ao Pão de Açúcar de bondinho..."' },
          { quem: 'estrella', texto: 'De bondinho? Você teve medo, profe?' },
          { quem: 'gatito', texto: 'Medo, não. Eu só fechei os olhos o caminho todo.' },
          { quem: 'ari', texto: '"...Comi um peixe na praia, vi o Cristo Redentor e dormi na areia."' },
          { quem: 'renan', texto: 'Que férias boas!' },
          { quem: 'luna', texto: 'Eu nunca fui ao Rio. Um dia eu vou!' },
          { quem: 'gatito', texto: 'Vai, sim. Mas leva protetor solar. Pro bigode.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do cartão',
        itens: [
          { emoji: '💌', pt: 'o cartão-postal', es: 'la postal' },
          { emoji: '🚡', pt: 'o bondinho', es: 'el teleférico' },
          { emoji: '🏖️', pt: 'a areia', es: 'la arena' },
          { emoji: '🌅', pt: 'o pôr do sol', es: 'la puesta de sol · el atardecer' },
          { emoji: '🗓️', pt: 'ontem', es: 'ayer' },
          { emoji: '✅', pt: 'já · ainda não', es: 'ya · todavía no' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O passado que já acabou',
        texto: 'Para contar o que aconteceu e terminou, o português usa o **pretérito perfeito**. Os regulares seguem três modelos — repare no fim do "ele": **-ou, -eu, -iu**, e nunca o "-ó" do espanhol.',
      },
      {
        tipo: 'tabela',
        colunas: ['', 'viajar', 'comer', 'dormir'],
        linhas: [
          ['eu', 'viajei', 'comi', 'dormi'],
          ['você · ele · ela · a gente', 'viajou', 'comeu', 'dormiu'],
          ['nós', 'viajamos', 'comemos', 'dormimos'],
          ['vocês · eles · elas', 'viajaram', 'comeram', 'dormiram'],
        ],
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'Viajé al Rio.', pt: 'Viajei para o Rio.' },
          { es: 'Comió pescado.', pt: 'Comeu peixe.' },
          { es: 'Durmió en la arena.', pt: 'Dormiu na areia.' },
          { es: 'Fue increíble.', pt: 'Foi incrível.' },
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Os irregulares de todo dia',
        colunas: ['', 'eu · ele', 'nós · eles'],
        linhas: [
          ['ir · ser', 'fui · foi', 'fomos · foram'],
          ['ter', 'tive · teve', 'tivemos · tiveram'],
          ['fazer', 'fiz · fez', 'fizemos · fizeram'],
          ['ver', 'vi · viu', 'vimos · viram'],
          ['estar', 'estive · esteve', 'estivemos · estiveram'],
        ],
        nota: 'Como no espanhol, ir e ser têm o mesmo passado: "fui ao Rio" e "foi incrível". Só que o "fue" vira "foi".',
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O "he ido" não se traduz',
        texto: 'Em espanhol, *he ido, he comido* contam o que já aconteceu. Em português, isso é o passado simples: **fui, comi**. O "tenho ido" existe, mas quer dizer OUTRA coisa: algo que **vem se repetindo** até agora.',
      },
      {
        tipo: 'contraste',
        pares: [
          { es: 'He ido al Rio.', pt: 'Já fui ao Rio.' },
          { es: 'Hoy he comido pescado.', pt: 'Hoje comi peixe.' },
          { es: '¿Has visto el Cristo?', pt: 'Você já viu o Cristo?' },
          { es: 'Todavía no he ido.', pt: 'Ainda não fui.' },
          { es: 'Últimamente he ido mucho a la playa.', pt: 'Tenho ido muito à praia.' },
        ],
      },
      {
        tipo: 'atencao',
        texto: '"Tenho comido peixe" não é "he comido pescado": é "ando comiendo pescado", toda semana, até hoje. Para uma vez só, é **comi**.',
      },
      {
        tipo: 'dica',
        texto: '"Já" e "ainda não" são os melhores amigos do passado: "Já comi", "Ainda não comi". Eu, por exemplo, ainda não comi o lanche da tarde. Alguém?',
      },
      {
        tipo: 'brasil',
        titulo: 'A Cidade Maravilhosa',
        texto: 'O cartão-postal mais famoso do Brasil é do Rio de Janeiro: o Pão de Açúcar com o bondinho, o Cristo Redentor no alto do Corcovado e a praia de Copacabana. Por isso o Rio é chamado de "Cidade Maravilhosa".',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'lacunas',
      enunciado: 'Complete o cartão-postal do Gatito.',
      titulo: '💌 Querida turma,',
      texto: 'ontem eu {0} ao Pão de Açúcar de bondinho. Depois {1} um peixe na praia e {2} o pôr do sol. À noite, {3} na areia (gato dorme em qualquer lugar). Vocês {4} muita falta! Beijinhos, Gatito.',
      respostas: ['fui', 'comi', 'vi', 'dormi', 'fizeram'],
      distratores: ['fue', 'comió', 'he visto'],
      porque: [
        'Ir, no passado, com "eu": fui.',
        'Comer, eu: comi.',
        'Ver, eu: vi (e não "he visto").',
        'Dormir, eu: dormi.',
        'Fazer falta, vocês: fizeram falta.',
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue o verbo ao passado com "eu".',
      pares: [
        ['ir', 'fui'],
        ['ter', 'tive'],
        ['fazer', 'fiz'],
        ['ver', 'vi'],
        ['estar', 'estive'],
        ['viajar', 'viajei'],
      ],
      porque: 'Os irregulares mudam inteiros (tive, fiz, estive); os regulares em -ar terminam em -ei (viajei).',
    },
    {
      tipo: 'classificar',
      enunciado: 'Aconteceu uma vez, ou vem se repetindo até agora?',
      grupos: ['🎯 aconteceu (já foi)', '🔁 vem se repetindo até agora'],
      itens: [
        { texto: 'Ontem eu fui à praia.', grupo: 0, porque: 'Uma vez, ontem: passado simples.' },
        { texto: 'Ultimamente tenho dormido pouco.', grupo: 1, porque: '"Tenho dormido": vem acontecendo até hoje.' },
        { texto: 'Já vi o Cristo Redentor.', grupo: 0, porque: '"Já vi" = he visto: uma experiência, passado simples.' },
        { texto: 'Tenho estudado muito este mês.', grupo: 1, porque: 'O mês todo, até agora: tenho estudado.' },
        { texto: 'Você já comeu?', grupo: 0, porque: '"¿Ya comiste?" / "¿Has comido?": já comeu.' },
        { texto: 'Tenho ido ao ginásio toda semana.', grupo: 1, porque: 'Toda semana, até hoje: tenho ido.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é a tradução certa?',
      itens: [
        {
          pergunta: '"He ido al Rio."',
          opcoes: ['Tenho ido ao Rio.', 'Já fui ao Rio.', 'He ido ao Rio.'],
          certa: 1,
          porque: 'Uma experiência que já aconteceu: já fui. "Tenho ido" seria ir sempre, até agora.',
        },
        {
          pergunta: '"Fue increíble."',
          opcoes: ['Foi incrível.', 'Fue incrível.', 'Fui incrível.'],
          certa: 0,
          porque: 'Ser, no passado, com "ele/isso": foi. ("Fui" é com "eu".)',
        },
        {
          pergunta: '"Todavía no he comido."',
          opcoes: ['Ainda não tenho comido.', 'Todavia não comi.', 'Ainda não comi.'],
          certa: 2,
          porque: 'Todavía no = ainda não; he comido = comi.',
        },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['O Gatito', 'fue', 'ao Rio', 'nas férias.'],
          errada: 1,
          correcao: 'foi',
          porque: 'O "fue" do espanhol vira "foi".',
        },
        {
          palavras: ['Eu', 'he visto', 'o Cristo', 'ontem.'],
          errada: 1,
          correcao: 'vi',
          porque: 'Passado de uma vez: eu vi.',
        },
        {
          palavras: ['A Luna', 'viajó', 'de ônibus.'],
          errada: 1,
          correcao: 'viajou',
          porque: 'Em português o "ele/ela" termina em -ou: viajou.',
        },
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'A Luna quer saber das férias. Escolha a resposta do Ari.',
      com: 'luna',
      novaPagina: true,
      turnos: [
        {
          fala: 'Ari, você já foi à praia este ano?',
          opcoes: ['Tenho ido, sim!', 'He ido, sí!', 'Já fui, sim!'],
          certa: 2,
          porque: 'Uma experiência: já fui. "Tenho ido" seria ir toda semana.',
        },
        {
          fala: '¡Qué nota! E o que você fez lá?',
          opcoes: ['Comi pastel e tomei água de coco.', 'Comí pastel y tomé agua de coco.', 'Tenho comido pastel.'],
          certa: 0,
          porque: 'Contar o que aconteceu: comi, tomei.',
        },
        {
          fala: 'E a Sol já te contou da viagem dela?',
          opcoes: ['Todavía no, ela não contou.', 'Ainda não, ela não me contou nada.', 'Ainda não, ela não me ha contado.'],
          certa: 1,
          porque: 'Todavía no = ainda não; no me ha contado = não me contou.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva o verbo no passado.',
      itens: [
        { antes: '(viajar) Ontem a gente', depois: 'para a praia.', aceitas: ['viajou'], porque: '"A gente" é como "ele": viajou.' },
        { antes: '(comer) Nós', depois: 'peixe no almoço.', aceitas: ['comemos'], porque: 'Nós → comemos.' },
        { antes: '(ir) Eles', depois: 'ao Rio de ônibus.', aceitas: ['foram'], porque: 'Ir, eles: foram.' },
        { antes: '(fazer) Eu', depois: 'a mala na última hora.', aceitas: ['fiz'], porque: 'Fazer, eu: fiz.' },
      ],
    },
  ],
  consigo: [
    'contar o que aconteceu com os regulares: viajei, comi, dormi;',
    'usar fui, tive, fiz, vi e estive;',
    'dizer "já fui" e "ainda não fui" no lugar do "he ido";',
    'entender que "tenho ido" é o que vem se repetindo.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale! O sinal! E o Gatito voltou de férias!' },
      { quem: 'sol', texto: '¡VOLVIÓ! ...Voltou! ¡Bronzeado!' },
      { quem: 'estrella', texto: 'Gato não fica bronzeado, Sol. ...Fica?' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Voltei. Senti saudade.' },
      { quem: 'gatito', texto: 'Hoje vocês vão ler o cartão-postal que eu mandei... pra mim mesmo.' },
      { quem: 'renan', texto: 'Ele faz isso todo ano.' },
      { quem: 'gatito', texto: 'Lição 11: "Um cartão-postal do Rio".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem! Você contou tudo no passado, Ari.' },
      { quem: 'luna', texto: 'Profe, e o que você trouxe de presente?' },
      { quem: 'gatito', texto: 'Areia. No pelo. Muita.' },
    ],
  },
};
