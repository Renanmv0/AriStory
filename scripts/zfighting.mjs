/**
 * Caçador de z-fighting nas peças do kit.
 *
 * Z-fighting é sempre a mesma coisa: duas superfícies opacas caindo no MESMO
 * plano, com sobreposição de área. A GPU não tem como decidir qual está na
 * frente, e o pixel alterna entre as duas conforme a câmera gira — a peça
 * serrilha e pisca.
 *
 * Este teste não fotografa nem confia no olho: ele mede. Para cada peça
 * etiquetada, pega as caixas dos filhos em espaço LOCAL (onde tudo está
 * alinhado aos eixos), e procura pares de faces que caiam no mesmo plano
 * enquanto se sobrepõem nos outros dois eixos.
 *
 * A saída lista o par e a área compartilhada, para dar para consertar sem
 * adivinhar. A correção é sempre a mesma família: SOBREPOR de leve em vez de
 * encostar, ou recuar a peça de dentro para longe da face.
 *
 * Uso: node scripts/zfighting.mjs
 *      SO=armario,estante node scripts/zfighting.mjs   (só essas peças)
 *      SO=carrinho-de-pocoes …   (peça de evento: a cena abre na fase dela)
 */
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** a noite da festa de Halloween (`docs/HALLOWEEN.md`): as peças dela só existem nessa fase */
const FESTA = ['halloween:convite', 'halloween:festa', 'halloween:onibus-chegou'];

/** cada peça, e em que cena ela aparece (e, se for de evento, as flags da fase) */
const PECAS = [
  // os postos da festa de Halloween: o carrinho de poções do Noel, a lousa, o
  // canteiro de abóboras da Josefina e a bacia de maçãs do Capy. Elas são de
  // quina arredondada (`quina`), que este caçador NÃO mede (só caixa reta):
  // hoje saem "0 caixas", e as junções delas foram afastadas à mão (a quina
  // do friso 4 mm à frente das réguas, o filete do degrau 3 mm acima do
  // tampo, a ripa do lado do caixote mais baixa). Ficam na lista para medir a
  // caixa reta que entrar nelas um dia.
  ['carrinho-de-pocoes', 'villa-lobos', FESTA],
  ['cavalete-de-pocoes', 'villa-lobos', FESTA],
  ['canteiro-de-aboboras', 'villa-lobos', FESTA],
  ['bacia-de-macas', 'villa-lobos', FESTA],
  // a Casinha da Abóbora (a 6a): o portão laranja e a cerquinha no parque, e a
  // casinha torta na clareira (o mesmo save da festa)
  ['portao-laranja', 'villa-lobos', FESTA],
  ['cerquinha-torta', 'villa-lobos', FESTA],
  ['casinha-torta', 'casinha-da-abobora', FESTA],
  ['quiosque', 'clube'],
  ['sorveteria', 'villa-lobos'],
  ['bilheteria', 'villa-lobos'],
  ['loja-de-roupas', 'villa-lobos'],
  ['mesinha-de-xadrez', 'villa-lobos'],
  ['cesta-de-biscoitos', 'villa-lobos'],
  // o piquenique da Luna (nasce escondido até o quadro encher: a medida é da
  // geometria, e não da tela, então vale do mesmo jeito)
  ['cesta-de-piquenique', 'villa-lobos'],
  ['flamula', 'villa-lobos'],
  ['arquibancada', 'villa-lobos'],
  ['estante', 'quarto'],
  ['armario', 'quarto'],
  ['planta-do-quarto', 'quarto'],
  ['escrivaninha', 'quarto'],
  ['cama', 'quarto'],
  ['rack-da-tv', 'casa'],
  ['pia', 'casa'],
  ['armario-aereo', 'casa'],
  ['geladeira', 'casa'],
  ['mesa-de-jantar', 'casa'],
  ['cadeira-de-jantar', 'casa'],
  ['sofa', 'casa'],
  ['mesinha-de-centro', 'casa'],
  ['maquina-de-lavar', 'casa'],
  ['prateleira-de-parede', 'casa'],
  ['porta-da-rua', 'casa'],
  ['loja-de-patins', 'villa-lobos'],
  ['borda-de-gelo', 'villa-lobos'],
  ['cristal-de-gelo', 'villa-lobos'],
  ['poste-de-gelo', 'villa-lobos'],
  ['boneco-de-neve', 'villa-lobos'],
  ['mesa-de-sorveteria', 'villa-lobos'],
  ['borda-de-tablado', 'villa-lobos'],
  ['placar-de-ping-pong', 'villa-lobos'],
  ['cesto-de-bolinhas', 'villa-lobos'],
  ['jean-luc', 'villa-lobos'],
  ['caixote', 'villa-lobos'],
  ['quadro-de-inscricoes', 'villa-lobos'],
  ['suporte-de-raquetes', 'villa-lobos'],
  // a mesa posta da festa do campeão. Ela nasce escondida para quem não deu a
  // festa, mas o detector mede a CAIXA de cada peça, e caixa não depende de
  // `visible` — então as três entram aqui como qualquer outra
  ['toalha-de-piquenique', 'villa-lobos'],
  ['comidinhas-de-piquenique', 'villa-lobos'],
  ['porta-retrato', 'villa-lobos'],
  ['cadeirinha-de-sorveteria', 'villa-lobos'],
  // o Mania de Churrasco por fora e a área externa dele (`world/restauranteDoClube.ts`)
  ['restaurante-do-clube', 'clube'],
  ['mesa-do-restaurante', 'clube'],
  ['ombrelone', 'clube'],
  ['cavalete-de-cardapio', 'clube'],
  ['estufa', 'clube'],
  ['arco-de-estufa', 'estufa'],
  ['portao-de-jardim', 'estufa'],
  ['folhagem-alta', 'estufa'],
  ['trelica', 'estufa'],
  ['prateleira-de-mudas', 'estufa'],
  ['bancada-de-jardinagem', 'estufa'],
  ['tonel-de-agua', 'estufa'],
  ['vestiario', 'clube'],
  // a mesa de pátio antiga saiu do clube; continua no pátio da escola
  ['mesa-de-patio', 'escola'],
  ['cadeira-de-patio', 'escola'],
  ['pergolado', 'clube'],
  ['muro-do-clube', 'clube'],
  ['portao-do-clube', 'clube'],
  ['guarita', 'clube'],
  ['cadeira-de-salva-vidas', 'clube'],
  ['sebe', 'clube'],
  ['espreguicadeira', 'clube'],
  ['mesinha-de-deque', 'clube'],
  ['onibus-da-cidade', 'clube'],
  ['ponto-de-onibus', 'clube'],
  ['meio-fio', 'clube'],
  ['churrasqueira', 'mania-de-churrasco'],
  ['bancada-inox', 'mania-de-churrasco'],
  ['fogao-industrial', 'mania-de-churrasco'],
  ['pia-industrial', 'mania-de-churrasco'],
  ['balcao-de-passagem', 'mania-de-churrasco'],
  ['estante-de-bebidas', 'mania-de-churrasco'],
  ['placa-de-fachada', 'mania-de-churrasco'],
  // as melhorias do turno (montadas sempre, escondidas até a compra)
  ['chapa-nova', 'mania-de-churrasco'],
  ['chapa-dupla', 'mania-de-churrasco'],
  ['cavalete-da-fila', 'mania-de-churrasco'],
  ['radio-do-bar', 'mania-de-churrasco'],
  ['carrinho-de-louca', 'mania-de-churrasco'],
  ['plaquinha-funcionarios-do-mes', 'mania-de-churrasco'],
  ['barraca-iglu', 'villa-lobos'],
  ['interior-da-barraca', 'villa-lobos'],
  ['mesinha-dobravel', 'villa-lobos'],
  ['mochila-cargueira', 'villa-lobos'],
  ['tronco-caido', 'villa-lobos'],
  ['varal-de-luzinhas', 'villa-lobos'],
  // a etapa D da clareira: o caixote de feira da cozinha, o radinho e o pote
  ['caixote-de-feira', 'villa-lobos'],
  ['radinho', 'villa-lobos'],
  ['pote-de-vaga-lumes', 'villa-lobos'],
  // o lago de cara nova: o trapiche, a placa, o tronco e os bichos dele
  ['trapiche', 'villa-lobos'],
  ['placa-do-lago', 'villa-lobos'],
  ['tronco-do-lago', 'villa-lobos'],
  ['tigre-dagua', 'villa-lobos'],
  ['garca', 'villa-lobos'],
  ['pato-do-lago', 'villa-lobos'],
  ['patinho', 'villa-lobos'],
  ['arara-de-roupas', 'lojinha'],
  ['arara-premium', 'lojinha'],
  ['provadores', 'lojinha'],
  ['balcao-da-loja', 'lojinha'],
  // o balcão de tingimento do mezanino (o ateliê de tinta)
  ['balcao-de-tingimento', 'lojinha'],
  ['mesa-de-dobrar', 'lojinha'],
  ['prateleira-da-loja', 'lojinha'],
  ['escada-rolante', 'lojinha'],
  ['espelho-magico', 'lojinha'],
  // a segunda reforma da boutique (`world/moveisDaBoutique.ts`)
  ['boiserie', 'lojinha'],
  ['tapete-redondo', 'lojinha'],
  ['lustre', 'lojinha'],
  ['namoradeira', 'lojinha'],
  ['mesinha-lateral', 'lojinha'],
  ['pufe-de-loja', 'lojinha'],
  ['figueira', 'lojinha'],
  ['arandela', 'lojinha'],
  ['quadro-de-arte', 'lojinha'],
  ['podio', 'lojinha'],
  ['manequim-de-loja', 'lojinha'],
  ['vitrine-de-joias', 'lojinha'],
  ['mesa-de-chapeus', 'lojinha'],
  // a Escola do Gatito
  ['armarios-de-escola', 'escola'],
  ['escadaria', 'escola'],
  ['vitrine-de-trofeus', 'escola'],
  ['mesa-de-refeitorio', 'escola'],
  ['balcao-de-refeitorio', 'escola'],
  ['maquina-de-lanches', 'escola'],
  ['cartaz', 'escola'],
  ['placa-de-porta', 'escola'],
  ['logo-da-escola', 'escola'],
  ['relogio', 'escola'],
  ['lousa', 'escola-sala-1'],
  ['carteira-escolar', 'escola-sala-1'],
  ['mesa-do-professor', 'escola-sala-1'],
  ['globo', 'escola-sala-1'],
  ['bandeira-brasil', 'escola-sala-1'],
  ['oculinhos-do-gatito', 'escola-sala-1'],
  ['pufe-saco', 'escola-descanso'],
  ['escaninhos', 'escola-professores'],
  ['cafeteira', 'escola-professores'],
  ['caminha-do-gatito', 'escola-professores'],
  ['cesta-de-basquete', 'escola-ginasio'],
  ['carrinho-de-bolas', 'escola-ginasio'],
  ['placar-de-ginasio', 'escola-ginasio'],
];

/*
 * `SEM_FUNDIR=1` mede as peças ANTES da junção (`?semFundir`): depois dela
 * os pedaços de mesmo material viram uma malha só, e o detector — que mede
 * caixa por caixa — não tem mais caixa para medir.
 */
const SEM_FUNDIR = process.env.SEM_FUNDIR ? '&semFundir' : '';
// `SO=a,b` roda só essas peças: a lista inteira passa de cinco minutos
const SO = process.env.SO ? process.env.SO.split(',') : null;
if (SO) PECAS.splice(0, PECAS.length, ...PECAS.filter(([p]) => SO.includes(p)));

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
const erros = [];
page.on('pageerror', (e) => erros.push('PAGEERROR: ' + e.message));

/** procura faces coplanares dentro de uma peça, em espaço local */
const caçar = (etiqueta) =>
  page.evaluate((alvo) => {
    const achados = [];
    let peca = null;
    window.jogo.scene.traverse((o) => {
      if (!peca && o.userData?.peca === alvo) peca = o;
    });
    if (!peca) return null;

    // as caixas dos filhos, em espaço local da peça. Só malhas de caixa sem
    // rotação: com rotação a caixa deixa de ser alinhada e a conta não vale —
    // e peça girada raramente compartilha plano com a vizinha por acidente.
    const caixas = [];
    /**
     * A ROTAÇÃO DO PAI CONTA TANTO QUANTO A DA MALHA.
     *
     * A regra sempre foi "só caixa sem rotação", porque a conta é de caixa
     * ALINHADA e com giro ela não vale. Mas o teste olhava só o `rotation` da
     * própria malha e descia para os filhos sem levar o do pai — então uma
     * caixa reta pendurada num grupo girado entrava na lista como se fosse
     * reta, com a caixa envolvente errada.
     *
     * Foi assim que a arara acusou seis pares fantasmas: cada roupa mora num
     * `conjunto` com `rotation.y` sorteado, e o teste media todas as barras de
     * cabide como se estivessem no mesmo ângulo — duas cujo sorteio caiu a
     * menos de 1,5 mm uma da outra "compartilhavam" planos que, na tela, não
     * são nem paralelos.
     */
    const recolher = (obj, dx, dy, dz, giradoAcima) => {
      for (const f of obj.children) {
        const px = dx + f.position.x;
        const py = dy + f.position.y;
        const pz = dz + f.position.z;
        const girado =
          giradoAcima ||
          Math.abs(f.rotation.x) > 1e-6 ||
          Math.abs(f.rotation.y) > 1e-6 ||
          Math.abs(f.rotation.z) > 1e-6;
        const p = f.geometry?.parameters;
        if (f.isMesh && f.geometry?.type === 'BoxGeometry' && !girado && p) {
          // material transparente não briga por pixel opaco
          if (f.material?.transparent && (f.material.opacity ?? 1) < 0.95) continue;
          caixas.push({
            nome: f.name || `caixa${caixas.length}`,
            min: [px - (p.width * f.scale.x) / 2, py - (p.height * f.scale.y) / 2, pz - (p.depth * f.scale.z) / 2],
            max: [px + (p.width * f.scale.x) / 2, py + (p.height * f.scale.y) / 2, pz + (p.depth * f.scale.z) / 2],
            // decalque de chão resolve o empilhamento por polygonOffset de
            // propósito: não é bug, é o mecanismo
            offset: !!f.material?.polygonOffset,
          });
        }
        if (f.children?.length) recolher(f, px, py, pz, girado);
      }
    };
    recolher(peca, 0, 0, 0, false);

    const EIXOS = ['x', 'y', 'z'];
    for (let a = 0; a < caixas.length; a++) {
      for (let b = a + 1; b < caixas.length; b++) {
        const A = caixas[a];
        const B = caixas[b];
        if (A.offset || B.offset) continue;
        for (let eixo = 0; eixo < 3; eixo++) {
          const o1 = (eixo + 1) % 3;
          const o2 = (eixo + 2) % 3;
          // as duas caixas têm que se sobrepor de verdade nos OUTROS dois eixos,
          // senão as faces são coplanares mas nunca aparecem no mesmo pixel
          const sobre1 = Math.min(A.max[o1], B.max[o1]) - Math.max(A.min[o1], B.min[o1]);
          const sobre2 = Math.min(A.max[o2], B.max[o2]) - Math.max(A.min[o2], B.min[o2]);
          if (sobre1 <= 0.004 || sobre2 <= 0.004) continue;

          // SÓ faces que apontam para o mesmo lado (min com min, max com max).
          //
          // `max × min` é uma caixa terminando onde a outra começa — empilhamento
          // normal, e as duas faces ficam escondidas uma pela outra. Quem
          // serrilha é o par que olha para a MESMA direção: aí as duas são
          // visíveis do lado de fora e a GPU não tem como desempatar.
          for (const [fa, fb] of [['min', 'min'], ['max', 'max']]) {
            const d = Math.abs(A[fa][eixo] - B[fb][eixo]);
            if (d < 0.0015) {
              achados.push({
                eixo: EIXOS[eixo],
                plano: +A[fa][eixo].toFixed(3),
                area: +(sobre1 * sobre2).toFixed(3),
                entre: `${A.nome}.${fa} × ${B.nome}.${fb}`,
              });
            }
          }
        }
      }
    }
    return { quantas: caixas.length, achados };
  }, etiqueta);

const relatorio = [];
for (const [etiqueta, cena, flags] of PECAS) {
  if (flags) {
    // peça de evento: a cena com o `?halloween` e o save de teste já na fase pedida
    await page.goto(`${BASE}/?cena=${cena}&halloween${SEM_FUNDIR}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.jogo?.current, null, { timeout: 30000 });
    await page.evaluate((f) => { for (const x of f) window.jogo.setFlag(x); }, flags);
    await page.reload({ waitUntil: 'networkidle' });
  } else {
    await page.goto(`${BASE}/?cena=${cena}${SEM_FUNDIR}`, { waitUntil: 'networkidle' });
  }
  await page.waitForTimeout(3200);
  const r = await caçar(etiqueta);
  relatorio.push([etiqueta, r]);
}

let total = 0;
for (const [etiqueta, r] of relatorio) {
  if (!r) {
    console.log(`${etiqueta}: NÃO ENCONTRADA na cena`);
    total += 1;
    continue;
  }
  console.log(`${etiqueta}: ${r.quantas} caixas · ${r.achados.length} pares coplanares`);
  for (const a of r.achados.slice(0, 12)) {
    console.log(`   ${a.eixo} = ${a.plano} · área ${a.area} · ${a.entre}`);
  }
  total += r.achados.length;
}
console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros');

await browser.close();
if (total > 0 || erros.length) {
  console.log(`FALHOU: ${total} par(es) de faces coplanares — é isso que serrilha na tela`);
  process.exit(1);
}
process.exit(0);
