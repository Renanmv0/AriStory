import * as THREE from 'three';
import type { GameAPI, SceneDef } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { PALETTE as P } from '../palette';
import { diaDaPortariaPedido, portariaNestaPagina } from '../eventos/portariaDoClube';
import {
  Expediente, FICHAS, NOME_DO_ITEM, PERGUNTA, carimboCerto, diferencas, falaDaSaida, fatosAntesDoDia, fichaDe, proibidosNaSacola, registrarODia, rotuloDaPista,
  type Assunto, type Carimbo, type ItemDaSacola, type Pista, type Retrato, type Visitante,
} from '../minigames/portaria';
import type { EstadoDaMesa, VistaDaPortaria } from '../ui/mesaDaPortaria';
import { fundir, fundirComoFundo } from '../world/fundir';
import { GUARITA_DO_CLUBE, GuaritaDoClube } from '../world/guaritaDoClube';
import { Gina } from '../entities/bichos/Gina';
import { SacolaDaPortaria } from '../world/sacolaDaPortaria';
import { alvosDaBancada } from '../eventos/portaria/alvosDaBancada';
import { apresentacaoDoVisitante } from '../eventos/portaria/apresentacaoDoVisitante';
import { MESA_DA_PORTARIA, MesaDaPortaria } from '../world/mesaDaPortaria';
import { alturaDoElevador, ElevadorDoBalcao, modeloDoVisitante, type ModeloDeVisitante } from '../world/visitantesDaPortaria';
import { arvore } from '../world/arvores';
import { lamp, muroDoClube, portaoDoClube, sebe } from '../world/props';
import { Cancela } from '../world/estacionamento';
import { asfalto, calcadaDePedrinha, tapeteDeGrama } from '../world/texturasDeChao';

/**
 * ============================================ A PORTARIA DO CLUBE (a cena)
 *
 * O minigame da guarita da Gina (`docs/PORTARIA-DO-CLUBE.md`), em PRIMEIRA
 * PESSOA: quem joga senta na mesa do meio da guarita nova, de frente para o
 * guichê; o parceiro senta na bancada do lado (a do fichário) e a Gina fica
 * na outra, a do monitor e do painel do portão.
 *
 * O QUADRO É O DA GUARITA: ela mora na origem, com o guichê para o `+Z`. Quem
 * olha para o `+Z` tem a DIREITA DA TELA no `−X` — e é lá que está o portão
 * do clube (o muro corre em `x = −5,65`, como no clube de verdade), por onde
 * os visitantes chegam e por onde os barrados vão embora; quem entra segue
 * para a ESQUERDA DA TELA, pela cancela, para dentro do clube.
 *
 * Quem SABE do dia é o `Expediente` (`minigames/portaria/expediente.ts`); a
 * cena só anima o que ele diz e leva o clique da mesa até ele.
 */

/** o olho de quem joga, sentado no banco do meio (a câmera de primeira pessoa) */
const OLHO = { de: new THREE.Vector3(0, 1.7, 0.44), para: new THREE.Vector3(1.3, 0.95, 2.9), lente: 62 };
/** no celular em pé a mesa de papel cobre a metade de baixo: o olho sobe para o guichê */
const OLHO_EM_PE = { de: new THREE.Vector3(0, 1.7, 0.44), para: new THREE.Vector3(0, 0.92, 2.9), lente: 74 };

/** a tomada de abertura do dia: de fora do guichê, um tico à esquerda da tela, os três lá dentro */
const ABERTURA = { de: new THREE.Vector3(1.1, 2.05, 4.9), para: new THREE.Vector3(-0.15, 1.5, 0.6), lente: 44, lenteEmPe: 70 };

/** o muro e o portão do clube, no quadro da guarita (no clube: `x = −25`, `z = 7`) */
const PORTAO = { x: -5.65, z: 5.05, vao: 7 };

/** a fila: do balcão em direção ao portão, à direita da tela */
export const LUGARES_DA_FILA: ReadonlyArray<readonly [number, number]> = [
  [MESA_DA_PORTARIA.janela.x, MESA_DA_PORTARIA.janela.z],
  [-1.35, 3.35],
  [-2.35, 3.75],
  [-3.35, 4.15],
  [-4.35, 4.55],
  [-6.6, 5.0],
];

export const portaria: SceneDef = {
  id: 'portaria',
  name: 'A portaria do clube',
  subtitle: 'Carteirinha, por favor!',
  ambient: {
    sky: 0x9fdcff,
    fog: 0xd6f0ff,
    fogNear: 40,
    fogFar: 110,
    sunColor: 0xfff6e0,
    sunIntensity: 1.7,
    // o sol vem da esquerda da tela e um tico de trás de quem trabalha: o visitante no balcão fica de rosto aceso
    sunDir: [16, 22, -7],
    ambientColor: 0xdcf2ff,
    ambientIntensity: 1.12,
  },
  spawn: { x: MESA_DA_PORTARIA.banco.x, z: MESA_DA_PORTARIA.banco.z, facing: 0 },
  build(w) {
    montarAPortaria(w);
  },
};

function montarAPortaria(w: WorldBuilder): void {
  const g: GameAPI = w.game;
  // fora da chave a cena não existe: quem cair aqui volta para o clube
  if (!portariaNestaPagina()) {
    w.onUpdate(() => g.goTo('clube'));
    return;
  }
  const busca = new URLSearchParams(location.search);

  // ------------------------------------------------------------ o chão e o fundo
  montarOFundo(w);

  // ------------------------------------------------------------ a guarita e a mesa
  const guarita = new GuaritaDoClube();
  w.add(fundir(guarita.group));
  w.onUpdate((dt) => guarita.update(dt));
  const mesa = new MesaDaPortaria();
  w.add(mesa.group);
  w.onUpdate((dt) => mesa.update(dt));
  w.aoDesmontar(() => mesa.dispose());
  w.setBounds(-2.2, -1.5, 2.2, 1.5);

  const cancela = new Cancela(3.2);
  w.add(w.place(cancela.group, 3.05, 0, 2.3, -Math.PI / 2));
  let abrirCancela = false;
  w.onUpdate((dt) => cancela.update(dt, abrirCancela));

  // ------------------------------------------------------------ a Gina, na bancada do monitor e do painel do portão
  // (a área menor que o passo mínimo do cérebro do bicho a segura no posto, como no clube; o pescoço meio
  // abaixado, que o forro da guarita fica a 3,4)
  const POSTO_DA_GINA = { x: 1.42, z: 0.5 };
  const gina = new Gina({ minX: POSTO_DA_GINA.x - 0.1, maxX: POSTO_DA_GINA.x + 0.1, minZ: POSTO_DA_GINA.z - 0.1, maxZ: POSTO_DA_GINA.z + 0.1 });
  gina.group.position.set(POSTO_DA_GINA.x, GUARITA_DO_CLUBE.piso, POSTO_DA_GINA.z);
  gina.group.rotation.y = -0.35;
  gina.abaixarDeUmaVez(0.35);
  gina.aoSoar = () => g.som('apito');
  w.add(gina.group);
  w.onUpdate((dt) => gina.update(dt));

  // ------------------------------------------------------------ os dois sentados
  const M = MESA_DA_PORTARIA;
  const ancora = new THREE.Object3D();
  // (a âncora de quem senta fica embaixo do assento: o quadril do rig sentado mora 0,55 acima dela)
  const QUADRIL = 0.55;
  ancora.position.set(M.banco.x, M.banco.assento - QUADRIL, M.banco.z);
  w.add(ancora);
  const ancoraDoParceiro = new THREE.Object3D();
  ancoraDoParceiro.position.set(M.bancoDoParceiro.x, M.bancoDoParceiro.assento - QUADRIL, M.bancoDoParceiro.z);
  w.add(ancoraDoParceiro);
  g.lockPlayer(true);
  // (a chegada na cena põe os dois no `spawn` depois da montagem: sentar fica para o primeiro quadro)
  const sentarOsDois = (): void => {
    g.ridePlayer(ancora, new THREE.Vector3(), 1, Number(busca.get('giro') ?? 0));
    g.rideCompanion(ancoraDoParceiro, new THREE.Vector3(), 1, 0.25);
    g.setSitting(true);
    g.mostrarCabeca('jogador', false);
  };

  // ------------------------------------------------------------ o olho
  const emPe = (): boolean => innerHeight > innerWidth;
  const v3 = (s: string | null, d: THREE.Vector3): THREE.Vector3 => {
    if (!s) return d;
    const [x, y, z] = s.split(',').map(Number);
    return new THREE.Vector3(x, y, z);
  };
  let vista: VistaDaPortaria = 'bancada';
  let temTurmaNaJanela = false;
  const olhoAtual = new THREE.Vector3(), alvoAtual = new THREE.Vector3();
  let cameraPronta = false;
  let lenteAtual = 66;
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const olhar = (dt = 1): void => {
    const o = vista === 'visitante'
      ? { de: new THREE.Vector3(0, 1.72, .45), para: new THREE.Vector3(0, 1.74, 2.72), lente: emPe() ? (temTurmaNaJanela ? 90 : 52) : (temTurmaNaJanela ? 60 : 42) }
      : vista === 'bancada'
        ? { de: new THREE.Vector3(0, emPe() ? 2.8 : 1.85, emPe() ? .5 : .2), para: new THREE.Vector3(0, emPe() ? 1.02 : 1.1, emPe() ? 1.45 : 1.65), lente: emPe() ? 90 : 66 }
        : emPe() ? OLHO_EM_PE : OLHO;
    const de = v3(busca.get('olho'), o.de), para = v3(busca.get('alvo'), o.para);
    if (!cameraPronta) { olhoAtual.copy(de); alvoAtual.copy(para); cameraPronta = true; lenteAtual = o.lente; }
    const k = reduzirMovimento ? 1 : 1 - Math.exp(-7 * dt); olhoAtual.lerp(de, k); alvoAtual.lerp(para, k); lenteAtual += (o.lente - lenteAtual) * k;
    g.setCameraOmbro(olhoAtual, alvoAtual, Number(busca.get('lente') ?? lenteAtual));
  };
  // (no quadro da montagem o motor ainda põe a isométrica de chegada: o olho entra no primeiro quadro da cena)
  let eraEmPe: boolean | null = null;
  /** a primeira pessoa liga depois da tomada de abertura (o bloco de medida liga na hora) */
  let primeiraPessoa = !!busca.get('bloco');
  w.onUpdate((dt) => {
    if (eraEmPe === null) {
      sentarOsDois();
      if (!primeiraPessoa) {
        // A TOMADA DE ABERTURA: de fora, pelo guichê, os três lá dentro — a Gina, quem joga e o parceiro
        g.mostrarCabeca('jogador', true);
        g.setCameraOmbro(ABERTURA.de, ABERTURA.para, emPe() ? ABERTURA.lenteEmPe : ABERTURA.lente);
      }
    }
    if (primeiraPessoa) { eraEmPe = emPe(); olhar(dt); }
    else if (eraEmPe === null) eraEmPe = emPe();
  });
  const entrarNaPrimeiraPessoa = (): void => {
    primeiraPessoa = true;
    eraEmPe = null;
    g.mostrarCabeca('jogador', false);
    g.setPlayerVisible(false);
    cameraPronta = false; olhar();
  };
  w.aoDesmontar(() => {
    g.setCameraOmbro(null);
    g.mostrarCabeca('jogador', true);
    g.setPlayerVisible(true);
    g.setSitting(false);
  });

  // ------------------------------------------------------------ o bloco de medida (?bloco=noel,gatito,…)
  const bloco = busca.get('bloco');
  const elevador = new ElevadorDoBalcao();
  w.add(w.place(elevador.group, M.janela.x, 0, M.janela.z, Math.PI));
  if (bloco) {
    const quem = bloco.split(',').filter((id) => FICHAS[id]);
    const modelos: ModeloDeVisitante[] = [];
    quem.forEach((id, i) => {
      const m = modeloDoVisitante(id, FICHAS[id].retrato);
      const [x, z] = LUGARES_DA_FILA[Math.min(i, LUGARES_DA_FILA.length - 1)];
      m.group.position.set(x, 0, z);
      m.group.rotation.y = Math.PI;
      m.encarar(M.janela.x, 0.6);
      w.add(m.group);
      modelos.push(m);
    });
    if (modelos[0]) void elevador.irPara(alturaDoElevador(modelos[0].group));
    w.onUpdate((dt) => {
      elevador.update(dt);
      if (modelos[0]) modelos[0].group.position.y = elevador.altura;
      modelos.forEach((m) => m.update(dt));
    });
    w.aoDesmontar(() => modelos.forEach((m) => m.dispose()));
    (window as unknown as { portaria?: unknown }).portaria = {
      modelos, mesa, cancela: (s: boolean) => { abrirCancela = s; },
      cabeca: () => g.cabecaDe('jogador').toArray(), parceiro: () => g.cabecaDe('parceiro').toArray(),
    };
    return;
  }

  // ================================================================ O DIA
  // (`?depressa` é dos testes: a fila, o elevador e a mesa andam quatro vezes mais rápido; o relógio não)
  const pressa = busca.has('depressa') ? 4 : 1;
  const n = diaDaPortariaPedido(g, busca);
  const semente = Number(busca.get('semente') ?? Math.floor(Math.random() * 1e6));
  const ex = new Expediente(n, semente, fatosAntesDoDia(g, n));
  const painel = g.mesaDaPortaria();
  const sacola = new SacolaDaPortaria(); w.add(sacola.group);
  w.onUpdate(dt => sacola.update(dt * pressa));
  let ativa = true;
  w.aoDesmontar(() => { ativa = false; sacola.dispose(); });
  mesa.mostrarLista(ex.contexto.lista);
  mesa.mostrarHoje(ex.contexto.hoje);
  w.onUpdate((dt) => {
    elevador.update(dt * pressa);
    if (pressa > 1) mesa.update(dt * (pressa - 1));
  });

  /** a mesa está animando (o papel, o carimbo, a fila): as ferramentas esperam */
  let ocupado = true;
  let comecou = false;
  let acabou = false;

  // ---- os visitantes em 3D: a fila na rua, um por lugar
  const modelos = new Map<string, ModeloDeVisitante>();
  /** quem está em cima do elevador (o `y` dele segue o disco) */
  let noElevador: ModeloDeVisitante | null = null;
  const indo: ModeloDeVisitante[] = [];
  const apresentacoes = new Map<string, ReturnType<typeof apresentacaoDoVisitante>>();
  w.onUpdate((dt) => {
    for (const m of modelos.values()) m.update(dt * pressa);
    for (const m of indo) m.update(dt * pressa);
    if (noElevador) noElevador.group.position.y = elevador.altura;
    for (const a of apresentacoes.values()) a.update(dt * pressa);
  });
  w.aoDesmontar(() => {
    for (const a of apresentacoes.values()) a.dispose();
    for (const m of modelos.values()) m.dispose();
    for (const m of indo) m.dispose();
  });
  const PORTAO_DE_FORA: readonly [number, number] = [-10, 5.6];
  const modeloDe = (v: Visitante): ModeloDeVisitante => {
    let m = modelos.get(v.id);
    if (!m) {
      m = modeloDoVisitante(v.ficha, v.rosto, v.grupo ?? []);
      m.group.position.set(PORTAO_DE_FORA[0], 0, PORTAO_DE_FORA[1]);
      w.add(m.group);
      modelos.set(v.id, m);
      apresentacoes.set(v.id, apresentacaoDoVisitante(m, v));
    }
    return m;
  };
  /** quantos ficam de pé na fila (o resto ainda não chegou ao portão) */
  const NA_FILA = LUGARES_DA_FILA.length - 2;
  /** cada um dos próximos anda até o lugar dele na fila */
  const andarAFila = (jaFormada = false): void => {
    const proximos = ex.fila.slice(ex.indice + 1, ex.indice + 1 + NA_FILA);
    proximos.forEach((v, i) => {
      const m = modeloDe(v);
      const [x, z] = LUGARES_DA_FILA[i + 1];
      // às nove a fila já está formada; depois, cada um anda um lugar (e quem chega vem do portão)
      if (jaFormada) {
        m.group.position.set(x, 0, z);
        m.group.rotation.y = Math.atan2(M.janela.x - x, M.janela.z - z);
        m.encarar(M.janela.x, M.janela.z);
      } else void m.irPara(x, z, 1.4).then(() => m.encarar(M.janela.x, M.janela.z));
    });
  };

  // ---- a mesa em tela: o estado inteiro, sempre a partir do expediente
  const estado = (): EstadoDaMesa => {
    const j = ex.janela;
    const v = j?.visitante;
    temTurmaNaJanela = !!v?.escondido || !!v?.grupo?.some(id => id !== 'netinho');
    return {
      dia: { numero: ex.dia.numero, nome: ex.dia.nome },
      hora: ex.hora,
      semRelogio: ex.semRelogio,
      esperando: ex.esperando,
      ajudas: ex.ajudas,
      ferramentas: [...ex.contexto.ferramentas],
      regras: [...ex.dia.regras],
      hoje: ex.contexto.hoje,
      lista: ex.contexto.lista,
      janela: j && v ? {
        rosto: v.rosto,
        tapado: v.tapado && !j.corrigidas.has('rostoTapado') ? v.tapado : undefined,
        grupo: (v.grupo ?? []).map((f) => FICHAS[f]?.retrato).filter((r): r is Retrato => !!r),
        escondido: v.escondido ? FICHAS[v.escondido]?.retrato ?? null : null,
        escondidoAchado: j.corrigidas.has('alguemEscondido'),
        docs: v.docs,
        sacola: v.sacola ?? [],
        confiscados: j.confiscados,
        transcricao: j.transcricao,
        assuntos: ex.assuntos(),
        oferta: v.oferta && j.aceitouOferta === undefined ? `${v.nome} estende ${v.oferta.item} pela fresta do guichê.` : null,
      } : null,
      ocupado,
      podeChamar: !ex.fechou && ex.indice + 1 < ex.fila.length,
      podeTerminar: true,
      fechou: ex.fechou,
    };
  };
  const desenhar = (): void => {
    if (!acabou && ativa) painel.desenhar(estado());
  };

  // ---- o relógio: anda com quem está na janela, e para com o balão aberto
  let horaMostrada = '';
  w.onUpdate((dt) => {
    if (!comecou || acabou || !ex.janela || ocupado || painel.falando) return;
    ex.passar(dt);
    if (ex.hora !== horaMostrada) {
      horaMostrada = ex.hora;
      painel.atualizarHora(ex.hora, ex.fechou, ex.semRelogio);
    }
  });

  // ---- as ações da mesa
  const nomeNaJanela = (): string => ex.janela?.visitante.nome ?? '';
  const chamar = async (): Promise<void> => {
    if (ocupado || ex.janela) return;
    mesa.tocarCampainha();
    g.som('sino');
    const v = ex.proximo();
    if (!v) {
      desenhar();
      return;
    }
    ocupado = true;
    painel.mudarVista('bancada');
    desenhar();
    const m = modeloDe(v);
    andarAFila();
    await elevador.irPara(0);
    await m.irPara(M.janela.x, M.janela.z, 1.5);
    noElevador = m;
    m.encarar(M.janela.x, 0.3);
    await elevador.irPara(alturaDoElevador(m.group));
    const ficha = fichaDe(v);
    await painel.falar(v.nome, v.chegada ?? ficha.chegada, ficha.icone);
    if (!ativa) return;
    m.gesticular(1.65 + v.docs.length * .24);
    await mesa.receber(v.docs, () => m.pontoDaEntrega());
    if (!ativa) return;
    g.som('folhear');
    painel.mudarVista('bancada');
    if (v.oferta) await painel.falar(v.nome, v.oferta.fala, ficha.icone);
    ocupado = false;
    desenhar();
  };

  const perguntar = async (a: Assunto): Promise<void> => {
    if (ocupado || !ex.janela) return;
    const ficha = fichaDe(ex.janela.visitante);
    const r = ex.perguntar(a);
    // (com a resposta no balão, o carimbo espera: carimbar no meio da fala embaralhava as falas)
    ocupado = true;
    desenhar();
    await painel.falar(g.playerName(), [PERGUNTA[a]]);
    await painel.falar(nomeNaJanela(), r.falas, ficha.icone);
    ocupado = false;
    desenhar();
  };

  const apontar = async (a: Pista, b: Pista): Promise<void> => {
    if (ocupado || !ex.janela) return;
    const ficha = fichaDe(ex.janela.visitante);
    const r = ex.apontar(a, b);
    apresentacoes.get(ex.janela.visitante.id)?.corrigir(ex.janela.corrigidas);
    ocupado = true;
    desenhar();
    if (r.diferenca) {
      g.som('acertou');
      painel.avisar(`🔍 Não bate: ${rotuloDaPista(a)} × ${rotuloDaPista(b)}`);
    } else painel.avisar('🔍 Isso bate. Nada de errado aí.');
    await painel.falar(nomeNaJanela(), r.falas, ficha.icone);
    ocupado = false;
    desenhar();
  };

  const confiscar = async (item: ItemDaSacola): Promise<void> => {
    if (ocupado || !ex.janela) return;
    ocupado = true; painel.mudarVista('bancada'); desenhar();
    const foi = ex.confiscar(item);
    await sacola.retirar(item, foi);
    if (!ativa) return;
    ocupado = false;
    g.som(foi ? 'caixa' : 'pegar');
    painel.avisar(foi ? `🎒 ${NOME_DO_ITEM[item]} foi para os achados.` : `🎒 ${NOME_DO_ITEM[item]} pode entrar — volta para a sacola.`);
    desenhar();
  };

  const ajuda = async (): Promise<void> => {
    if (ocupado || !ex.janela) return;
    const dica = ex.ajuda();
    if (!dica) {
      painel.avisar('💡 Acabaram as dicas de hoje.');
      return;
    }
    ocupado = true;
    desenhar();
    await painel.falar(g.companionName(), [dica]);
    ocupado = false;
    desenhar();
  };

  const responderOferta = async (aceitou: boolean): Promise<void> => {
    if (!ex.janela) return;
    ex.responderOferta(aceitou);
    desenhar();
    painel.avisar(aceitou ? '🤲 Agrado aceito.' : '🙅 Agrado recusado, com educação.');
  };

  const carimbar = async (c: Carimbo): Promise<void> => {
    const j = ex.janela;
    if (ocupado || !j || painel.falando || j.visitante.oferta && j.aceitouOferta === undefined || c === 'soClube' && !ex.dia.regras.includes('exame')) return;
    ocupado = true;
    desenhar();
    painel.mudarVista('bancada');
    const v = j.visitante;
    const m = modeloDe(v);
    const ficha = fichaDe(v);
    if (mesa.naLeitura) await mesa.carimbar(c);
    g.som('tranco');
    const { chamado } = ex.carimbar(c);
    if (!ativa) return;
    m.gesticular(1.4);
    await mesa.devolver(() => m.pontoDaEntrega());
    await sacola.devolver(m.pontoDaEntrega());
    if (!ativa) return;
    await painel.falar(v.nome, falaDaSaida(v, c), ficha.icone);
    await elevador.irPara(0);
    noElevador = null;
    m.group.position.y = 0;
    modelos.delete(v.id);
    indo.push(m);
    // quem entra segue pela cancela para dentro do clube; o barrado volta pelo portão
    const saida: Array<readonly [number, number]> = c === 'hojeNao'
      ? [[-1.2, 2.95], [-4.9, 3.1], [-6.8, 3.6], [-11, 4.2]]
      : [[1.6, 3.0], [3.1, 3.55], [6.5, 3.9], [12, 6]];
    void (async () => {
      for (const [x, z] of saida) {
        if (c !== 'hojeNao' && x > 2.5) abrirCancela = true;
        await m.irPara(x, z, 1.5);
        if (c !== 'hojeNao' && x > 5) abrirCancela = false;
      }
      // chegou longe: sai da cena de vez
      apresentacoes.get(v.id)?.dispose(); apresentacoes.delete(v.id);
      m.group.removeFromParent();
      m.dispose();
      indo.splice(indo.indexOf(m), 1);
    })();
    if (chamado) modeloDe(chamado);
    andarAFila();
    ocupado = false;
    desenhar();
    if (ex.fechou) await painel.falar('Gina', ['Cinco da tarde! O portão fecha. Quem ficou na fila volta amanhã.'], '🦒');
    else if (ex.indice + 1 >= ex.fila.length) await painel.falar('Gina', ['A fila acabou! Pode fechar o dia quando quiser.'], '🦒');
  };

  const terminar = async (): Promise<void> => {
    if (ocupado || ex.janela || acabou) return;
    ocupado = true;
    const fim = ex.terminar();
    const reg = registrarODia(g, n, fim);
    if (fim.total > 0) g.ganhar(fim.total);
    desenhar();
    await painel.falar('Gina', fim.falaDaGina, '🦒');
    await painel.envelope(fim, { abriu: reg.abriu, recorde: reg.recorde });
    acabou = true;
    voltarAoClube();
  };

  /** solta os dois dos bancos, devolve a câmera e o controle, e volta ao clube na frente da guarita */
  const voltarAoClube = (): void => {
    painel.fechar();
    g.setPlayerVisible(true);
    g.setSitting(false);
    g.mostrarCabeca('jogador', true);
    g.setCameraOmbro(null);
    g.releasePlayer(-19.35, 5.1, Math.PI);
    g.releaseCompanion(-18.6, 5.3, Math.PI);
    g.lockPlayer(false);
    g.goTo('clube', 'da-guarita');
  };

  /** largar o dia no meio: nada se grava, nada se paga */
  const sair = async (): Promise<void> => {
    if (acabou) return;
    acabou = true;
    ocupado = true;
    await painel.falar('Gina', ['Já vai? Tudo bem, eu seguro a guarita. O dia de hoje fica para outra vez.'], '🦒');
    voltarAoClube();
  };

  const trazerPapel = async (tipo: Parameters<MesaDaPortaria['trazerParaLeitura']>[0]): Promise<void> => {
    if (ocupado || !ativa || mesa.naLeitura === tipo) return;
    ocupado = true; desenhar();
    await mesa.trazerParaLeitura(tipo);
    if (!ativa) return;
    ocupado = false; desenhar();
  };
  const abrirSacola = async (): Promise<void> => {
    const j = ex.janela;
    if (!j || ocupado || !ativa || sacola.sacola.visible) return;
    ocupado = true; painel.mudarVista('bancada'); desenhar();
    const m = modeloDe(j.visitante); m.gesticular(1.7);
    await sacola.apresentar(j.visitante.sacola ?? [], m.pontoDaEntrega());
    if (!ativa) return;
    ocupado = false; desenhar();
  };
  const alvos = alvosDaBancada(w, mesa, sacola, {
    livre: () => ativa && comecou && !acabou && !ocupado && !painel.falando && painel.vista !== 'documento',
    chamar: () => void chamar(),
    folha: tipo => { if (!ocupado) painel.abrirFolha(tipo); },
    lupa: () => painel.lupa(!painel.usandoLupa),
    carimbar: c => void carimbar(c),
    rosto: () => painel.usandoLupa ? painel.selecionarPista('rosto') : painel.mudarVista('visitante'),
    item: i => painel.examinarItem(i),
    temVisitante: () => !!ex.janela,
    podeChamar: () => !ex.fechou && ex.indice + 1 < ex.fila.length,
    podeLupa: () => ex.contexto.ferramentas.has('apontar'),
    podeLista: () => ex.contexto.ferramentas.has('lista'),
    podeSoClube: () => ex.dia.regras.includes('exame'),
  });
  w.onUpdate(() => alvos.visitante(noElevador?.group ?? null));

  // ---- o começo do dia: a mesa abre, a Gina dá o recado e a fila se forma
  const abrirAMesa = (): void => painel.abrir({
    vistaMudou: v => { vista = v; },
    sacolaMudou: aberta => { if (aberta) void abrirSacola(); },
    chamar: () => void chamar(),
    perguntar: (a) => void perguntar(a),
    apontar: (a, b) => void apontar(a, b),
    carimbar: (c) => void carimbar(c),
    confiscar,
    ajuda: () => void ajuda(),
    responderOferta: (s) => void responderOferta(s),
    terminar: () => void terminar(),
    sair: () => void sair(),
    lupaMudou: (sim) => mesa.erguerLupa(sim),
    abriuPapel: (tipo) => void trazerPapel(tipo),
  });
  w.aoDesmontar(() => painel.fechar());
  andarAFila(true);
  void (async () => {
    // o recado da Gina na tomada de abertura, com a caixa de fala de sempre; depois, a mesa e a primeira pessoa
    await g.wait(0.8);
    g.som('apito');
    await g.say([`Bom dia, porteiros! Dia ${ex.dia.numero}: ${ex.dia.nome}.`, ex.dia.novidade], 'Gina');
    await g.say(['Quando estiverem prontos, é só tocar a campainha.'], 'Gina');
    entrarNaPrimeiraPessoa();
    abrirAMesa();
    desenhar();
    comecou = true;
    ocupado = false;
    desenhar();
  })();
  // o que o teste (`scripts/portariaCena.mjs`) lê: o expediente, a conferência e uma cópia limpa para jogar sem cena
  (window as unknown as { portaria?: unknown }).portaria = {
    ex, mesa, painel, elevador, modelos, sacola, alvos, n, semente, ocupado: () => ocupado, comecou: () => comecou, acabou: () => acabou,
    conferir: () => {
      const j = ex.janela;
      if (!j) return null;
      return { diferencas: diferencas(j.visitante, ex.contexto), carimbo: carimboCerto(j.visitante, ex.contexto), proibidos: proibidosNaSacola(j.visitante, ex.contexto), id: j.visitante.id };
    },
    expedienteLimpo: () => new Expediente(n, semente, fatosAntesDoDia(g, n)),
    diferencas, carimboCerto, proibidosNaSacola,
  };
}

/**
 * O FUNDO: o que se vê pelo guichê. O gramado do clube com o caminho de
 * pedrinha do portão até a cancela, o muro e o portão à direita da tela, a
 * calçada e a rua lá fora, as árvores e as sebes. Tudo é FUNDO (ninguém
 * procura pelo nome, ninguém toca): `fundirComoFundo` por vizinhança.
 */
function montarOFundo(w: WorldBuilder): void {
  w.ground({ width: 90, depth: 90, color: P.grass, z: 10, textura: tapeteDeGrama(9) });
  // o caminho de pedrinha: do portão até o balcão e do balcão até a cancela (e a soleira do portão)
  w.patch(-2.6, 3.9, 6.6, 2.4, P.concrete, 0, 0.026, calcadaDePedrinha());
  w.patch(2.6, 3.4, 3.2, 2.0, P.concrete, 0, 0.026, calcadaDePedrinha());
  w.patch(7.5, 4.0, 7.0, 2.2, P.concrete, 0, 0.026, calcadaDePedrinha());
  w.patch(PORTAO.x, PORTAO.z, 2.0, PORTAO.vao + 1.4, P.concrete, 0, 0.026, calcadaDePedrinha());
  // lá fora: a calçada e a rua
  w.patch(PORTAO.x - 3.2, 10, 4.4, 80, P.concrete, 0, 0.03, calcadaDePedrinha());
  w.patch(PORTAO.x - 10, 10, 9.4, 80, P.asphalt, 0, 0.02, asfalto());

  // o muro e o portão (o portão aberto, as folhas para dentro)
  const muro = new THREE.Group();
  muro.add(w.place(portaoDoClube(PORTAO.vao), PORTAO.x, 0, PORTAO.z, Math.PI / 2));
  const PILAR = PORTAO.vao / 2 + 0.5 + 0.62;
  for (const [z0, z1] of [[-20, PORTAO.z - PILAR], [PORTAO.z + PILAR, 34]] as const) {
    muro.add(w.place(muroDoClube(z1 - z0), PORTAO.x, 0, (z0 + z1) / 2, Math.PI / 2));
  }
  w.add(muro);

  // as árvores e as sebes de dentro do clube (à esquerda da tela e ao fundo)
  const dentro = new THREE.Group();
  const arvores: ReadonlyArray<readonly [number, number, number, number]> = [
    [5.5, 9.5, 1.15, 0.2], [-1.5, 12.5, 1.25, 0.6], [10.5, 3.5, 1.0, 0.8], [13, 11, 1.3, 0.35], [2.5, 16, 1.1, 0.9], [-4, 18, 1.2, 0.1],
  ];
  for (const [x, z, s, sem] of arvores) dentro.add(w.place(arvore('redonda', s, sem), x, 0, z));
  dentro.add(w.place(arvore('florida', 0.9, 0.4), 7.5, 0, 7.4));
  dentro.add(w.place(sebe(6, 1.0), 1.0, 0, 8.2));
  dentro.add(w.place(sebe(5, 1.0), 8.8, 0, 6.5, Math.PI / 2));
  dentro.add(w.place(lamp(), 1.6, 0, 4.9));
  dentro.add(w.place(lamp(), -3.6, 0, 5.6));
  w.add(fundirComoFundo(dentro));
  // e lá fora, do outro lado da rua
  const fora = new THREE.Group();
  for (const [z, s, sem] of [[-2, 1.1, 0.3], [6, 1.2, 0.7], [13, 1.0, 0.5], [20, 1.25, 0.9]] as const) {
    fora.add(w.place(arvore('redonda', s, sem), PORTAO.x - 16, 0, z));
  }
  w.add(fundirComoFundo(fora));
}
