import type { Licao } from '../tipos';

/**
 * LIÇÃO 13 — "De quem é isso?": a caixa de achados e perdidos do saguão. A
 * primeira do Módulo 3.
 *
 * O "su" DO ESPANHOL, QUE VIRA QUATRO: su casa pode ser dele, dela, sua ou
 * deles — e o português, para não confundir, troca o "seu" por DELE e DELA
 * (de quem se fala) ou DE VOCÊS. Junto vêm os demonstrativos (este, esse,
 * aquele — o sistema de três distâncias que o espanhol também tem) e as
 * junções que o espanhol não faz: de + esse = DESSE, em + aquele = NAQUELE.
 *
 * A situação é a caixa onde ficam as coisas esquecidas na escola: as três
 * presilhas das irmãs (lua, sol e estrela) são o fio da cena. O Flynn só é
 * citado (dono do guarda-chuva do fundo): ele não fala na apostila.
 */
export const LICAO_13: Licao = {
  id: 'de-quem-e-isso',
  numero: 13,
  titulo: 'De quem é isso?',
  subtitulo: 'A caixa de achados e perdidos do saguão',
  assunto: 'meu, seu, dele, dela e o este/esse/aquele',
  emoji: '🎒',
  cor: 'azul',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'dizer de quem é cada coisa: meu, seu, dele, dela, nosso;',
          'trocar o "su" do espanhol pelo dono certo;',
          'apontar com este, esse e aquele;',
          'juntar as palavrinhas: neste, nisso, daquele.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'A caixa dos achados',
        lugar: 'O saguão da escola, ao lado da caixa de achados e perdidos',
        falas: [
          { quem: 'gatito', texto: 'Turma, a caixa de achados e perdidos transbordou! Vamos devolver tudo aos donos.' },
          { quem: 'ari', texto: 'Essa presilha de lua é sua, Sol?' },
          { quem: 'sol', texto: '¡NÃO! A minha é de sol! Essa é da Luna. É a presilha DELA!' },
          { quem: 'luna', texto: '¡Épale, é minha mesmo! Já procurei por todo lado.' },
          { quem: 'ari', texto: 'E este caderno? É seu, Estrella?' },
          { quem: 'estrella', texto: 'O meu é cor-de-rosa... Esse deve ser do Renan.' },
          { quem: 'renan', texto: 'É meu, sim. Olha, Ari: o "seu" é traiçoeiro. Por isso a gente diz "dele" e "dela".' },
          { quem: 'sol', texto: '¡E AQUELE guarda-chuva lá no fundo é do Flynn!' },
          { quem: 'gatito', texto: 'E aquela almofada ali? Ah, é a minha, da soneca! Achei você!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cena',
        itens: [
          { emoji: '🎒', pt: 'a mochila', es: 'la mochila' },
          { emoji: '☂️', pt: 'o guarda-chuva', es: 'el paraguas' },
          { emoji: '📓', pt: 'o caderno', es: 'el cuaderno' },
          { emoji: '🔑', pt: 'a chave', es: 'la llave' },
          { emoji: '📏', pt: 'a régua', es: 'la regla' },
          { emoji: '🧢', pt: 'o boné', es: 'la gorra' },
          { emoji: '🙋', pt: 'o dono · a dona', es: 'el dueño · la dueña' },
          { emoji: '🔎', pt: 'De quem é?', es: '¿De quién es?' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Os donos',
        texto: 'O possessivo concorda com a **coisa**, e não com o dono: o **meu** caderno, a **minha** régua, os **meus** lápis. Até aqui, igual ao espanhol (*mi cuaderno*, *mis lápices*). A diferença está no "su".',
      },
      {
        tipo: 'tabela',
        colunas: ['É de…', 'Em português', 'Em espanhol'],
        linhas: [
          ['eu', 'meu · minha · meus · minhas', 'mi · mis'],
          ['você', 'seu · sua · seus · suas', 'tu · tus'],
          ['ele', 'dele', 'su · sus'],
          ['ela', 'dela', 'su · sus'],
          ['vocês · eles · elas', 'de vocês · deles · delas', 'su · sus'],
          ['a gente · nós', 'nosso · nossa · nossos · nossas', 'nuestro…'],
        ],
        nota: 'Em algumas regiões do Brasil (e em Portugal) se diz "teu/tua". O "seu/sua" funciona no país inteiro.',
      },
      {
        tipo: 'atencao',
        texto: 'Em espanhol, *su casa* pode ser a casa **dele**, **dela**, **sua**, **de vocês** ou **deles**. Em português, "a sua casa" só é de **você**; se a casa é de outra pessoa, diz-se "a casa **dele**" ou "a casa **dela**". E **dele/dela** dependem do DONO, e não da coisa: as presilhas **dela**.',
      },
      {
        tipo: 'contraste',
        titulo: 'O mesmo "su", quatro jeitos',
        pares: [
          { es: 'Es su mochila. (de él)', pt: 'É a mochila dele.' },
          { es: 'Es su mochila. (de ella)', pt: 'É a mochila dela.' },
          { es: 'Es su mochila. (de usted)', pt: 'É a sua mochila.' },
          { es: 'Es su mochila. (de ustedes)', pt: 'É a mochila de vocês.' },
        ],
      },
      {
        tipo: 'dica',
        texto: 'Com o nome da coisa, o artigo é opcional: **meu** caderno ou **o meu** caderno. Sem o nome, ele aparece: "O **meu** é azul."',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Este, esse, aquele',
        colunas: ['Está…', 'Em português', 'Em espanhol'],
        linhas: [
          ['perto de mim', 'este · esta · isto', 'este · esta · esto'],
          ['perto de você', 'esse · essa · isso', 'ese · esa · eso'],
          ['longe dos dois', 'aquele · aquela · aquilo', 'aquel · aquella · aquello'],
        ],
        nota: 'No dia a dia, o brasileiro usa "esse/essa/isso" para quase tudo que está perto. "Este/esta/isto" ficam mais na escrita e para o que está bem na sua mão.',
      },
      {
        tipo: 'texto',
        texto: '**Isto, isso e aquilo** não têm dono nem nome: é a coisa que você não sabe o que é, ou uma ideia inteira. "O que é **isso**?" Nunca vêm antes de um nome: é "esta mochila" ou "isto", e jamais "isto mochila".',
      },
      {
        tipo: 'tabela',
        titulo: 'As junções que o espanhol não faz',
        colunas: ['', 'em → no/na…', 'de → do/da…'],
        linhas: [
          ['este · esta · isto', 'neste · nesta · nisto', 'deste · desta · disto'],
          ['esse · essa · isso', 'nesse · nessa · nisso', 'desse · dessa · disso'],
          ['aquele · aquela · aquilo', 'naquele · naquela · naquilo', 'daquele · daquela · daquilo'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Em espanhol se escreve *de ese* e *en eso*, separado. Em português, **sempre junto**: "gostei **desse** boné", "pensei **nisso**". Escrever "de esse" é erro.',
      },
      {
        tipo: 'brasil',
        titulo: 'O "seu" que não é possessivo',
        texto: 'Antes de um nome, **seu** (e **dona**) é tratamento de respeito: **Seu João**, **Dona Maria**. Vem de "senhor". No Brasil se diz "Seu João", e não "o senhor João" — e ninguém acha que o João é seu.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'Devolvendo as coisas com a Sol. Escolha a resposta do Ari.',
      com: 'sol',
      turnos: [
        {
          contexto: 'A Sol segura uma mochila roxa.',
          fala: '¡Ari! Achei uma mochila. É sua?',
          opcoes: ['Não, não é minha.', 'No, no es mía.', 'Não, não é meus.'],
          certa: 0,
          porque: 'A mochila é feminina, então o possessivo também: minha.',
        },
        {
          fala: 'Então vamos perguntar pro Gatito!',
          opcoes: ['Gatito, esta mochila é dele?', 'Gatito, esta mochila é sua?', 'Gatito, esta mochila é su?'],
          certa: 1,
          porque: 'Quem escuta é o Gatito, então é a mochila SUA. "Dele" é para falar dele com outra pessoa.',
        },
        {
          fala: 'O Gatito diz que é da Luna! Vamos devolver pra ELA!',
          opcoes: ['Então a gente devolve a mochila su.', 'Então a gente devolve a mochila de ela.', 'Então a gente devolve a mochila dela.'],
          certa: 2,
          porque: 'De + ela = dela. E o "su" do espanhol vira dela quando o dono é ela.',
        },
        {
          fala: 'E aquela almofada lá no fundo? É de alguém?',
          opcoes: ['É do Gatito. Aquela almofada é dele.', 'É do Gatito. Aquela almofada é seu.', 'É do Gatito. Aquela almofada é de ele.'],
          certa: 0,
          porque: 'Se o dono é ele, a almofada é dele. E "de ele" nunca: junta, dele.',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue o "su" do espanhol ao dono em português.',
      pares: [
        ['su cuaderno (de él)', 'o caderno dele'],
        ['su cuaderno (de ella)', 'o caderno dela'],
        ['su cuaderno (de ustedes)', 'o caderno de vocês'],
        ['su cuaderno (de usted)', 'o seu caderno'],
        ['nuestro cuaderno', 'o nosso caderno'],
      ],
      porque: 'Um "su" só, no espanhol, para cinco donos. Em português cada dono tem o seu jeito.',
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha o dono certo.',
      itens: [
        {
          pergunta: 'Falando da Luna: "Esta é a presilha ___."',
          opcoes: ['dela', 'sua', 'dele'],
          certa: 0,
          porque: 'Fala-se DA Luna (ela): a presilha dela. "Sua" seria a presilha de quem está ouvindo.',
        },
        {
          pergunta: 'Ari pergunta à Sol: "Esse boné é ___?"',
          opcoes: ['dele', 'seu', 'deles'],
          certa: 1,
          porque: 'Ele fala COM a Sol (você): o boné é seu.',
        },
        {
          pergunta: 'A Sol e a Estrella esqueceram a caixa. "A caixa é ___."',
          opcoes: ['dela', 'deles', 'delas'],
          certa: 2,
          porque: 'Duas meninas: delas.',
        },
        {
          pergunta: 'O Gatito fala da turma: "A Sala 1 é ___ sala."',
          opcoes: ['nosso', 'nossa', 'minhas'],
          certa: 1,
          porque: 'Sala é feminina: nossa sala.',
        },
      ],
    },
    {
      tipo: 'classificar',
      enunciado: 'Perto de mim, perto de você ou longe dos dois?',
      grupos: ['👉 perto de mim', '🫱 perto de você', '🔭 longe dos dois'],
      itens: [
        { texto: 'Olha esta lanterna que eu estou segurando.', grupo: 0, porque: 'Esta: está na minha mão.' },
        { texto: 'Esse aí na sua mão é o meu lápis?', grupo: 1, porque: 'Esse: está com você.' },
        { texto: 'Aquele guarda-chuva lá no fundo é do Flynn.', grupo: 2, porque: 'Aquele: longe dos dois.' },
        { texto: 'Isto aqui é um presente pra você.', grupo: 0, porque: 'Isto: aqui, comigo.' },
        { texto: 'Me passa essa caneta que está do seu lado?', grupo: 1, porque: 'Essa: perto de você.' },
        { texto: 'Aquela estrela lá longe brilha mais.', grupo: 2, porque: 'Aquela: longe de nós.' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o bilhete que alguém deixou na caixa.',
      titulo: '📋 Bilhete na caixa de achados',
      novaPagina: true,
      texto: 'Gente, o que é {0}? Ninguém sabe! Alguém esqueceu a mochila {1} mesa lá no fundo, bem longe de nós dois. O caderno não está {2} caixa aqui perto de mim. E {3} presilha de lua que estou segurando é {4}, da Luna.',
      respostas: ['isso', 'naquela', 'nesta', 'esta', 'dela'],
      distratores: ['nisso', 'sua', 'deste'],
      porque: [
        'Uma coisa sem nome: isso.',
        'Longe dos dois: aquela — e em + aquela = naquela.',
        'Perto de mim: esta — e em + esta = nesta.',
        'Está na minha mão: esta presilha.',
        'Falamos da Luna: a presilha dela.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Esse', 'caderno', 'é', 'de ela.'],
          errada: 3,
          correcao: 'dela.',
          porque: 'De + ela = dela. Em português se junta sempre.',
        },
        {
          palavras: ['Gostei', 'de esse', 'boné.'],
          errada: 1,
          correcao: 'desse',
          porque: 'De + esse = desse. As duas palavras viram uma.',
        },
        {
          palavras: ['Ari,', 'esta', 'mochila', 'é', 'su?'],
          errada: 4,
          correcao: 'sua?',
          porque: 'O "su" vira sua: falando com o Ari, é a mochila SUA.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Junte as palavrinhas.',
      itens: [
        { antes: 'em + esse =', aceitas: ['nesse'], porque: 'Em + esse = nesse.' },
        { antes: 'de + aquele =', aceitas: ['daquele'], porque: 'De + aquele = daquele.' },
        { antes: 'em + isso =', aceitas: ['nisso'], porque: 'Em + isso = nisso.' },
        { antes: 'A presilha é de ela → é a presilha', depois: '.', aceitas: ['dela'], porque: 'De + ela = dela.' },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: 'Em espanhol, "su casa" pode ser a casa dele, dela, sua ou de vocês.', verdade: true, porque: 'Um "su" só para muita gente — é por isso que o português usa dele, dela e de vocês.' },
        { frase: '"As presilhas dela": o "dela" vira "delas" porque as presilhas são várias.', verdade: false, porque: 'Dela/dele dependem do DONO, e não da coisa: uma dona, "dela" — mesmo com dez presilhas.' },
        { frase: 'Em português, "de esse" se escreve separado, como em espanhol.', verdade: false, porque: 'Sempre junto: desse.' },
        { frase: '"Seu João" é um senhor chamado João — o seu aqui é tratamento de respeito.', verdade: true, porque: 'Seu e Dona antes do nome: respeito, de "senhor".' },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não combina?',
      itens: [
        {
          pergunta: 'Qual destas NÃO é possessivo?',
          opcoes: ['nosso', 'dela', 'meus', 'aquele'],
          certa: 3,
          porque: 'Aquele aponta (é demonstrativo); os outros dizem de quem é.',
        },
        {
          pergunta: 'Qual destas junções está ERRADA?',
          opcoes: ['nisso', 'desse', 'naquele', 'de esse'],
          certa: 3,
          porque: 'Em português, de + esse = desse, sempre junto.',
        },
        {
          pergunta: 'Qual destas NÃO é para uma coisa sem nome?',
          opcoes: ['isto', 'isso', 'aquilo', 'aquela'],
          certa: 3,
          porque: 'Aquela acompanha um nome (aquela mochila); isto, isso e aquilo vão sozinhos.',
        },
      ],
    },
  ],
  consigo: [
    'dizer de quem é cada coisa: meu, seu, dele, dela, nosso;',
    'trocar o "su" do espanhol por dele, dela ou de vocês;',
    'apontar com este, esse e aquele (e isto, isso, aquilo);',
    'juntar as palavrinhas: neste, nisso, daquele.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale, o sinal! Primeira aula do Módulo 3, panas!' },
      { quem: 'sol', texto: '¡MÓDULO TRÊS! ¡E esse é O MEU módulo favorito! ...Todos são.' },
      { quem: 'estrella', texto: 'Sol, o terceiro ainda nem começou... Vamos, sem correr.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Bom dia, turma! Bem-vindos ao Módulo 3: "Soltando a língua".' },
      { quem: 'gatito', texto: 'Hoje a aula é na caixa de achados e perdidos do saguão. Todo ano ela enche de coisa sem dono.' },
      { quem: 'ari', texto: 'Esse guarda-chuva é seu, profe?' },
      { quem: 'gatito', texto: 'Meu? Não, aquele é de... bom, a lição é justamente sobre isso.' },
      { quem: 'gatito', texto: 'Abram na lição 13: "De quem é isso?".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem, Ari! Agora cada coisa volta pro seu dono.' },
      { quem: 'renan', texto: 'Pro dono DELE e pra dona DELA.' },
      { quem: 'gatito', texto: 'Isso! E a almofada da soneca é minha, claro. A mais macia do saguão.' },
      { quem: 'luna', texto: '¡Qué nota! Minha presilha voltou pra mim!' },
    ],
  },
};
