import { avisoDaCantina } from './semanaDaCantina';
import { FICHAS } from './personagens';
import { NOME_DO_CLUBE, data, type Data, type Documento } from './tipos';

/** Exemplos separados da fila: ensinar nunca atende alguém nem revela um caso real. */
export interface RecadoDaGina {
  titulo: string;
  boasVindas: string;
  exemplo: string;
  lembrete: string;
  papeis: readonly Documento[];
  apoio: 'calendario' | 'prancheta' | 'manual' | 'soClube';
}

export function recadoDaGina(n: number, hoje: Data): RecadoDaGina {
  const carteirinha: Documento = { tipo: 'carteirinha', nome: 'Noel', numero: '0007',
    validade: data(31, 12, 2027), foto: { ...FICHAS.noel.retrato }, clube: NOME_DO_CLUBE };
  const convite: Documento = { tipo: 'convite', convidado: 'Estella', socio: 'Noel', numeroDoSocio: '0007', data: { ...hoje } };
  const recados: RecadoDaGina[] = [
    {
      titulo: 'Validade e foto',
      boasVindas: 'Bom diaaa, bebitos! Hoje a gente começa devagar: carteirinha, validade e foto. Sem relógio pra aprender com calma!',
      exemplo: 'Olha o exemplo: compare a validade com o calendário e a foto com quem está na janela. Não bateu? Use a lupa nas duas pistas.',
      lembrete: 'Papel certinho: verde. Documento irregular: vermelho. Toque na campainha quando estiverem prontos!',
      papeis: [carteirinha], apoio: 'calendario',
    },
    {
      titulo: 'A lista de sócios',
      boasVindas: 'Bom dia, porteiros! Hoje chegou a lista de sócios. E agora dá pra perguntar: as respostas ficam anotadas.',
      exemplo: 'Noel, número 0007: tem que bater com a lista. Nome riscado é sócio suspenso — hoje não entra.',
      lembrete: 'Validade e foto continuam valendo, viu? A lista é mais uma conferência. Bora abrir o guichê!',
      papeis: [carteirinha], apoio: 'prancheta',
    },
    {
      titulo: 'Também chegam convidados',
      boasVindas: 'Bom dia, bebitos! Hoje também chegam convidados. Sócio mostra carteirinha; convidado traz convite.',
      exemplo: 'Este convite é da Estella: precisa valer hoje. Confira também se o sócio que convidou está na lista, sem suspensão.',
      lembrete: 'Continuem conferindo validade, foto e lista dos sócios. A novidade se soma ao que vocês já sabem!',
      papeis: [convite], apoio: 'prancheta',
    },
    {
      titulo: 'As entregas do clube',
      boasVindas: 'Bom diaaa! Hoje tem entrega também. Correria não dispensa documento: crachá e ordem na bancada!',
      exemplo: 'A empresa do crachá e da ordem precisa bater. O destino tem que existir no manual. E confiram a foto do entregador!',
      lembrete: 'Sócios e convidados continuam vindo, com as mesmas regras. Se tiver dúvida sobre a entrega, perguntem!',
      papeis: [
        { tipo: 'cracha', nome: 'Tatá', empresa: 'Papita Delivery', funcao: 'Entregador', foto: { ...FICHAS.tata.retrato } },
        { tipo: 'ordem', empresa: 'Papita Delivery', destino: 'Estufa da Josefina', itens: ['adubo'] },
      ], apoio: 'manual',
    },
    {
      titulo: 'Piscina e sacolas',
      boasVindas: 'Bom dia! O Capy pediu reforço: quem quer piscina precisa de exame válido. E vamos conferir as sacolas!',
      exemplo: 'Este exame está vencido. Se o resto estiver certo, é amarelo: só o clube, sem piscina. Item proibido da sacola vai pros achados.',
      lembrete: 'Não esqueçam os documentos de sócios, convidados e entregadores. O manual lembra quais objetos não entram!',
      papeis: [{ tipo: 'exame', nome: 'Capy', validade: data(1, 1, 2026) }], apoio: 'soClube',
    },
    {
      titulo: 'Uma turma, um convite',
      boasVindas: 'Sábado, bebitos! Hoje também tem turma com convite coletivo. Um papel só, mas olho em cada pessoa!',
      exemplo: 'Neste exemplo são três nomes. Compare com quem chegou: os nomes e a quantidade precisam bater. Olhem atrás também!',
      lembrete: 'Valem todas as conferências anteriores, inclusive piscina e sacolas. Respira, um documento de cada vez. Vocês conseguem!',
      papeis: [{ tipo: 'conviteColetivo', socio: 'Noel', numeroDoSocio: '0007', data: { ...hoje }, nomes: ['Estella', 'Josefina', 'Capy'] }], apoio: 'prancheta',
    },
  ];
  const cantina = avisoDaCantina(n);
  if (cantina) return { titulo:cantina[0], boasVindas:cantina[1],
    exemplo:n === 9 ? 'Na ordem da muda diz Estufa da Josefina. Na janela, pergunte “Qual é o destino?”. As duas pistas devem combinar.'
      : n === 7 ? 'Olhem a data do convite e o calendário. Depois vamos ao jardim testar a mangueira com meu patinho.' : 'Este convite vale para hoje. Confiram também quem convidou e o número na lista.',
    lembrete:n === 12 ? 'Ouçam a música! A primeira fornada já está no forno.' : 'Quando vocês estiverem prontos, toquem a campainha.',
    papeis:n === 9 ? [{ tipo:'ordem', empresa:'Estufa da Josefina', destino:'Estufa da Josefina', itens:['lavanda'] }] : [convite],
    apoio:n === 9 ? 'manual' : 'calendario' };
  const recado = recados[n - 1];
  if (!recado) throw new Error(`não existe abertura para o dia ${n}`);
  return recado;
}
