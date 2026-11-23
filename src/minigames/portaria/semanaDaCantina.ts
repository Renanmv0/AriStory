import type { DiaDaPortaria, Entrada, Quadro } from './semana';
import { FICHAS } from './personagens';
import type { Visitante } from './conferencia';
import { data, NOME_DO_CLUBE, type Documento } from './tipos';

const cantina = 'Mania de Churrasco', jardim = 'Estufa da Josefina';
const naFila = (montar: (q: Quadro) => Visitante): Entrada => ({ tipo: 'roteiro', montar });
const figurante = (papel: 'socio' | 'convidado' | 'entregador'): Entrada => ({ tipo: 'figurante', papel, defeito: 'sorteio' });
const convidar = (nome: string, q: Quadro): Documento => ({ tipo: 'convite', convidado: nome,
  socio: 'Noel', numeroDoSocio: '0007', data: q.hoje });
function visitante(ficha: string, nome: string, docs: Documento[], ...chegada: string[]): Visitante {
  return { ficha, nome, id: ficha, rosto: { ...FICHAS[ficha].retrato }, espera: 'entra', docs, chegada };
}
function entrega(ficha: string, nome: string, empresa: string, destino: string, item: string): Documento[] {
  return [{ tipo: 'cracha', nome, empresa, funcao: 'Entregador', foto: { ...FICHAS[ficha].retrato } },
    { tipo: 'ordem', empresa, destino, itens: [item] }];
}
const novidades = [
  ['O fiscal de crocância', 'A vistoria está marcada para amanhã. Quem vem hoje traz o convite de hoje.'],
  ['Retrato de bigode', 'Confiram a foto do crachá. A fantasia muda, o rosto continua sendo de quem veio.'],
  ['Flores para a festa', 'Perguntem o destino e comparem a resposta com a ordem de entrega.'],
  ['Um suco com carimbo', 'Chegaram as encomendas da festa. Noel trouxe os papéis… em alguma ordem.'],
  ['Ensaio na cantina', 'O maestro vem ensaiar. Confiram o convite de quem chega, até o de um velho conhecido.'],
  ['O primeiro biscoito', 'A festa chegou! Cada pessoa traz os papéis da sua visita.'],
] as const;
export function avisoDaCantina(n: number) { return novidades[n - 7]; }

function jean(q: Quadro): Visitante {
  const nome = 'Jean-Luc';
  const v = visitante('jeanluc', nome, [convidar(nome, q)]);
  v.id = 'jeanluc-cantina-' + q.n;
  v.bordao = '';
  if (q.n === 7) {
    v.rosto.enfeite = 'fiscalDeCrocancia';
    v.docs = [{ tipo: 'convite', convidado: nome, socio: 'Noel', numeroDoSocio: '0007', data: data(1, 12, 2026) }];
    v.chegada = ['Fiscal de Crocância. É favor apresentar uma amostra. Talvez seis, dependendo da gravidade.'];
    v.barrado = ['Quero isso por escrito. Tenho uma divisória só para reclamações crocantes.'];
    v.entra = ['Merci. Um excelente expediente para vocês.'];
    v.pego = ['Amanhã?! Mas a fornada é HOJE.'];
    v.fatos = { entrou: ['fiscal-entrou'], barrado: ['fiscal-barrado'] };
    v.espera = 'hojeNao';
  } else if (q.n === 8) {
    v.rosto.enfeite = q.tem('fiscal-molhado') ? 'fotografoDeTouca' : 'fotografoDaFesta';
    v.docs = entrega('jeanluc', nome, 'Retratos Instantâneos', cantina, 'fotografias da festa');
    // A fantasia é a piada. A irregularidade é a espécie diferente na foto.
    v.docs = v.docs.map(d => d.tipo === 'cracha' ? { ...d, funcao: 'Fotógrafo', foto: { ...FICHAS.noel.retrato, enfeite: 'retratoDoFotografo' } } : d);
    v.chegada = [q.tem('fiscal-molhado') ? 'A câmera usa touca. Previsão de mangueira, segundo fontes confiáveis.'
      : q.tem('fiscal-barrado') ? 'Trouxe o carimbo de ontem emoldurado. Querem uma foto com ele?' : 'Sorriam! E evitem olhar diretamente para o meu bigode.'];
    v.pego = ['Um peru na foto? A câmera estava… virada para o outro lado!'];
    v.barrado = ['O negativo eu guardo. A decisão também, pelo visto.'];
    v.espera = 'hojeNao';
  } else if (q.n === 9) {
    v.rosto.enfeite = 'floristaGastronomico';
    v.docs = entrega('jeanluc', nome, 'Flor de Sal', jardim, 'vaso de manjericão').map(d =>
      d.tipo === 'cracha' ? { ...d, foto: { ...v.rosto } } : d);
    v.respostas = { destino: cantina, motivo: 'Vim entregar o manjericão na cantina. Ele sente saudade da manteiga.' };
    v.chegada = ['O lado bonito do manjericão é este. Os garfinhos são as estacas dele.'];
    v.pego = ['Estufa? Eu estava só acenando para a cozinheira.'];
    v.espera = 'hojeNao';
  } else if (q.n === 11) {
    v.rosto.enfeite = 'maestroDaCantina';
    v.chegada = ['Uma, duas… ouviram? É o Tutu ensaiando lá dentro. Meu convite está aqui.'];
    v.entra = ['Merci. Hoje a colher é para reger, prometo.'];
    v.barrado = ['Posso ao menos dar o compasso pela janela? O Tutu está esperando.'];
    v.respostas = { motivo: 'Vou reger o ensaio do Tutu. O Noel providenciou meu convite.' };
    v.fatos = { entrou: ['maestro-regeu'] };
  } else {
    v.chegada = [q.tem('maestro-regeu') ? 'Ontem eu trouxe a batuta. Hoje, só o convite mesmo.' : 'Vim em meu próprio nome. Estranho, né?'];
    v.entra = ['O primeiro biscoito é nosso. Metade pra quem ficou na guarita.'];
  }
  return v;
}

export function semanaDaCantina(base: DiaDaPortaria): DiaDaPortaria[] {
  return novidades.map(([nome, novidade], i) => {
    const n = i + 7;
    const festa: Entrada[] = [];
    if (n === 9) festa.push(naFila(() => ({ ...visitante('josefina', 'Josefina',
      entrega('josefina', 'Josefina', 'Estufa da Josefina', jardim, 'mudas de lavanda'),
      'As flores vão pro jardim. Olha aqui na ordem: Estufa da Josefina. Pode perguntar o destino e comparar!'), fatos:{entrou:['flores-entregues']} })));
    if (n === 10) festa.push(naFila(() => ({ ...visitante('noel', 'Noel', entrega('noel', 'Noel', 'Bar do Noel', cantina, 'copos de suco'),
      'Suco, polpa, gelo… carimba aqui! Opa. Esse é o CARDÁPIO! Então eu cobrei oito reais do Capy pela nota de entrega?!',
      'Aqui a ordem certa. E aquele pato atrás de mim quer pagar o suco com um vale-degustação!'), grupo: ['jeanluc'], fatos:{entrou:['sucos-entregues']} })));
    if (n === 11) festa.push(naFila(q => visitante('coala', 'Tutu', [convidar('Tutu', q)], 'Hoje eu toco duas notas. O maestro prometeu trazer a colher.')));
    if (n !== 10) festa.push(naFila(jean));
    const capy = naFila(() => ({ ...visitante('capy', 'Capy', [
      { tipo: 'carteirinha', nome: 'Capy', numero: '0011', validade: data(31,12,2027), clube: NOME_DO_CLUBE, foto: FICHAS.capy.retrato },
      { tipo: 'exame', nome: 'Capy', validade: data(31,12,2027) }], 'Piscina primeiro. Biscoito depois. Farelo na raia dá trabalho!'), querPiscina: true }));
    const socio = naFila(() => visitante('bento','Bento',[{ tipo:'carteirinha', nome:'Bento', numero:'0215', validade:data(31,12,2027), clube:NOME_DO_CLUBE, foto:FICHAS.bento.retrato }], 'Guardei uma mesa perto da música.'));
    return { numero:n, nome, novidade, regras:base.regras, ferramentas:base.ferramentas, segundos:base.segundos,
      roteiro:[...festa, figurante('convidado'), socio, figurante('entregador'), capy, { tipo:'figurante', papel:'convidado', defeito:'conviteDeAmanha' }, figurante('socio'), { tipo:'figurante', papel:'entregador', defeito:'empresaTrocada' }], figurantesExtras:1, defeitos:base.defeitos,
      gina:{ abertura:[novidade], ensina:[novidade], fimBom:[n === 12 ? 'A festa ficou linda. Guardaram um lugar pra nós!' : 'A cantina agradece o cuidado de vocês!'],
        fimRuim:['Vamos conferir juntos o envelope antes da próxima fornada.'] },
      fatos:[...(n === 7 ? ['fiscal-entrou','fiscal-barrado','fiscal-molhado'] : n === 11 ? ['maestro-regeu'] : n === 9 ? ['flores-entregues'] : n === 10 ? ['sucos-entregues'] : []), 'copo-quebrado','som-alto-na-piscina','bola-na-piscina','espuma-na-piscina'] };
  });
}
