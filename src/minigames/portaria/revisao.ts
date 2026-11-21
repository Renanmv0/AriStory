import { diferencas, fichaDe, valorDaResposta, type ContextoDoDia, type Diferenca, type Problema, type Visitante } from './conferencia';
import type { Atendimento, AvaliacaoDoAtendimento } from './consequencias';
import { rotuloDaPista } from './campos';
import { FICHAS } from './personagens';
import { escrever, NOME_DO_ITEM, PERGUNTA, PROIBIDOS, type Assunto, type Carimbo } from './tipos';

export interface RevisaoDaGina {
  visitante: string;
  feito: string;
  esperado: string;
  motivo: string;
  conferir: string;
}

/** O nome verdadeiro, incluindo o nome falso usado naquele atendimento. */
export function quemNoEnvelope(v: Visitante): string {
  const ficha = fichaDe(v);
  if (ficha.nome === ficha.nome.toLowerCase()) return v.nome;
  return ficha.nome === v.nome ? ficha.nome : `${ficha.nome} (dizendo ser ${v.nome})`;
}

const CARIMBO: Record<Carimbo, string> = { entra: 'ENTRA', soClube: 'SÓ O CLUBE', hojeNao: 'HOJE NÃO' };

function motivoDaDiferenca(at: Atendimento, d: Diferenca, ctx: ContextoDoDia): string {
  const v = at.visitante;
  const c = v.docs.find(p => p.tipo === 'carteirinha');
  const convite = v.docs.find(p => p.tipo === 'convite' || p.tipo === 'conviteColetivo');
  const cr = v.docs.find(p => p.tipo === 'cracha'), ordem = v.docs.find(p => p.tipo === 'ordem');
  const exame = v.docs.find(p => p.tipo === 'exame');
  const esperado = ctx.lista.find(l => l.nome === c?.nome);
  const foto = c?.foto ?? cr?.foto;
  const coletivo = v.docs.find(p => p.tipo === 'conviteColetivo');
  const fora = coletivo ? [v.nome, ...(v.grupo ?? []).map(f => FICHAS[f]?.nome ?? f), ...(v.escondido ? [FICHAS[v.escondido]?.nome ?? v.escondido] : [])]
    .filter(nome => !coletivo.nomes.includes(nome)) : [];
  const motivos: Record<Problema, string> = {
    vencida: `A carteirinha venceu em ${c ? escrever(c.validade) : 'outra data'}; o dia do atendimento era ${escrever(ctx.hoje)}.`,
    fotoNaoBate: `${foto?.especie !== v.rosto.especie ? 'A espécie' : foto.cor !== v.rosto.cor ? 'A cor do rosto' : 'A marca do rosto'} não batia com a foto do documento. Penteado e acessórios, sozinhos, não mudam a identidade.`,
    outroClube: `A carteirinha era de outro clube${c ? ` (${c.clube})` : ''}. Esse documento não vale na nossa portaria.`,
    foraDaLista: `O número ${c?.numero ?? ''} não estava na lista de sócios do dia.`,
    numeroTrocado: esperado ? `A carteirinha trazia ${c?.numero}, mas o cadastro de ${c?.nome} era ${esperado.numero}.`
      : 'O nome e o número da carteirinha não correspondiam à mesma pessoa na lista.',
    suspenso: `O cadastro de ${c?.nome ?? v.nome} estava riscado na lista: sócio suspenso não entra.`,
    conviteDeOutroDia: `O convite valia para ${convite ? escrever(convite.data) : 'outro dia'}; o atendimento foi em ${escrever(ctx.hoje)}.`,
    conviteDeSiMesmo: 'O convidado e o sócio responsável eram a mesma pessoa. Não vale convidar a si mesmo para contornar a carteirinha.',
    socioDoConviteSuspenso: `O sócio responsável pelo convite${convite ? `, ${convite.socio},` : ''} estava suspenso na lista.`,
    socioDoConviteInexistente: `O convite indicava ${convite?.socio} (${convite?.numeroDoSocio}), mas esse nome e número não batiam com um cadastro na lista.`,
    naoEstaNoConvite: `Fora da relação do convite: ${fora.join(', ')}. Um convite coletivo não libera pessoas cujos nomes não estão na relação.`,
    empresaTrocada: `O crachá dizia “${cr?.empresa}”, mas a ordem era de “${ordem?.empresa}”. A empresa precisa ser a mesma nos dois.`,
    destinoInexistente: `O destino “${ordem?.destino}” não existe entre os locais de entrega do manual.`,
    semDocumento: 'Não havia carteirinha, convite ou crachá que autorizasse a entrada. A bancada vazia também precisa ser conferida.',
    exameVencido: `O exame venceu em ${exame ? escrever(exame.validade) : 'outra data'}; o atendimento foi em ${escrever(ctx.hoje)}. Isso restringe a piscina, sem barrar o clube quando o restante está certo.`,
    rostoTapado: 'O capacete precisava ser retirado para comparar a foto; ele não é motivo, por si só, para barrar.',
    alguemEscondido: 'Havia uma pessoa atrás do grupo. Era preciso contar todos e conferir os nomes do convite.',
    respostaNaoBate: 'Uma resposta não batia com o documento.',
  };
  if (d.problema === 'respostaNaoBate') {
    const pista = d.pistas.find(p => p.startsWith('transcricao:'))!;
    const assunto = pista.slice(12) as Assunto;
    const papel = d.pistas.find(p => p.startsWith('doc:'))?.split(':');
    const doc = v.docs.find(p => p.tipo === papel?.[1]);
    const valor = doc && Object.entries(doc).find(([k]) => k === papel?.[2])?.[1];
    if (typeof valor === 'string') return `${at.perguntas.includes(assunto) ? 'Na resposta registrada' : 'Uma pergunta permitiria conferir'}, o valor era “${valorDaResposta(v, assunto)}”; no documento estava “${valor}”.`;
  }
  return motivos[d.problema];
}

function entradaValida(at: Atendimento, ctx: ContextoDoDia): { motivo: string; conferir: string; tema: string } {
  const v = at.visitante, ds = diferencas(v, ctx);
  if (ds.some(d => d.problema === 'rostoTapado')) return {
    motivo: 'O capacete não era uma irregularidade de identidade. Com o rosto descoberto, os documentos permitiam a entrada.',
    conferir: 'Peçam para tirar o capacete e comparem o rosto com a foto antes de decidir.', tema: 'rostoTapado',
  };
  if (ds.some(d => d.problema === 'alguemEscondido')) return {
    motivo: 'A pessoa escondida também estava no convite. A presença atrás do grupo precisava ser revelada, mas não tornava os documentos inválidos.',
    conferir: 'Contem todos, revelem quem está atrás e comparem com os nomes do convite.', tema: 'alguemEscondido',
  };
  if (v.ficha === 'alpacina') return {
    motivo: 'O penteado mudou, mas espécie, cor e marca do rosto batiam com a foto. Os documentos estavam em ordem.',
    conferir: 'Comparem a identidade do rosto, sem barrar apenas por cabelo ou acessórios.', tema: 'penteado',
  };
  if (v.docs.some(d => d.tipo === 'convite' || d.tipo === 'conviteColetivo')) return {
    motivo: 'O convite valia para o dia, o responsável estava ativo na lista e as pessoas estavam autorizadas. Convidado não precisa apresentar carteirinha de sócio.',
    conferir: 'Confiram data, responsável e nomes no convite e na lista.', tema: 'conviteValido',
  };
  if (v.docs.some(d => d.tipo === 'cracha')) return {
    motivo: 'Os documentos da entrega não tinham irregularidade pelas regras do dia. Entregador usa crachá, sem precisar ser sócio do clube.',
    conferir: 'Comparem a foto do crachá, a empresa nos papéis e o destino no manual.', tema: 'entregaValida',
  };
  return { motivo: `A carteirinha estava válida e a foto batia${ctx.regras.has('lista') ? '; o cadastro também estava ativo na lista' : ''}. Não havia motivo para barrar.`,
    conferir: 'Comparem validade e foto, junto das outras conferências disponíveis no dia.', tema: 'entradaValida' };
}

/** Usa a avaliação existente: explicar nunca muda a nota, o dinheiro ou os fatos. */
export function revisoesDaGina(atendimentos: readonly Atendimento[], avaliacoes: readonly AvaliacaoDoAtendimento[], ctx: ContextoDoDia): RevisaoDaGina[] {
  const candidatos: Array<{ revisao: RevisaoDaGina; tema: string; caro: boolean }> = [];
  atendimentos.forEach((at, i) => {
    const av = avaliacoes[i];
    if (at.carimbo === null || !av?.erros.length) return;
    const v = at.visitante;
    let motivo: string, conferir: string, tema: string, feito: string, esperado: string;
    if (at.carimbo !== av.carimboCerto) {
      feito = `Vocês carimbaram ${CARIMBO[at.carimbo]}.`;
      esperado = `O carimbo correto era ${CARIMBO[av.carimboCerto]}.`;
      const d = diferencas(v, ctx).find(d => !d.aparente && (av.carimboCerto !== 'hojeNao' || d.problema !== 'exameVencido'));
      if (d) {
        motivo = motivoDaDiferenca(at, d, ctx);
        conferir = `Comparem ${rotuloDaPista(d.pistas[0])} com ${rotuloDaPista(d.pistas[1])}.`;
        const resposta = d.pistas.find(p => p.startsWith('transcricao:'))?.slice(12) as Assunto | undefined;
        if (resposta && !at.perguntas.includes(resposta)) conferir = `Perguntem “${PERGUNTA[resposta]}” e comparem a resposta com o documento.`;
        tema = d.problema;
      } else if (av.carimboCerto === 'entra' && at.carimbo === 'soClube') {
        const exame = v.docs.find(d => d.tipo === 'exame');
        motivo = v.querPiscina && exame ? `O exame valia até ${escrever(exame.validade)}, e o atendimento foi em ${escrever(ctx.hoje)}. Não estava vencido.`
          : 'Não havia exame vencido restringindo a piscina neste atendimento. Os documentos permitiam o carimbo verde.';
        conferir = 'Usem o amarelo quando o exame de quem vai à piscina estiver vencido e o restante estiver certo.';
        tema = 'piscinaLiberada';
      } else ({ motivo, conferir, tema } = entradaValida(at, ctx));
    } else if (av.erros.includes('itemPassou')) {
      const itens = (v.sacola ?? []).filter(item => PROIBIDOS[item] && !at.confiscados.includes(item));
      feito = `Passou na sacola: ${itens.map(item => NOME_DO_ITEM[item]).join(', ')}.`;
      esperado = `Retirar os itens proibidos e carimbar ${CARIMBO[av.carimboCerto]}.`;
      motivo = itens.map(item => `${NOME_DO_ITEM[item]}: ${PROIBIDOS[item]}.`).join(' ');
      conferir = 'Abram a sacola e mandem o proibido para os achados antes de carimbar. A sacola não muda o carimbo dos documentos.';
      tema = 'itemPassou';
    } else {
      feito = `Vocês aceitaram o agrado: ${v.oferta?.item}.`;
      esperado = 'Recusar o agrado e decidir pelos documentos.';
      motivo = 'Aceitar esse agrado gerou desconto no expediente, mesmo que o carimbo estivesse correto.';
      conferir = 'Recusem o agrado antes de concluir a conferência. A oferta não autoriza a entrada.';
      tema = 'agrado';
    }
    candidatos.push({ revisao: { visitante: quemNoEnvelope(v), feito, esperado, motivo, conferir }, tema, caro: av.caro });
  });
  const escolhidos: typeof candidatos = [];
  for (const c of candidatos.sort((a, b) => Number(b.caro) - Number(a.caro))) {
    if (escolhidos.some(e => e.tema === c.tema || e.revisao.visitante === c.revisao.visitante)) continue;
    escolhidos.push(c);
    if (escolhidos.length === 2) break;
  }
  return escolhidos.map(c => c.revisao);
}
