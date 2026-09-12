/**
 * Abre espaço para um prato novo no cardápio do restaurante.
 *
 * Um prato vive em TRÊS lugares, e esquecer um deles é o erro que este script
 * existe para impedir:
 *
 *   1. `src/world/cardapioData.ts` — a ficha (nome, preço, descrição, selo) e a
 *      função que PINTA a miniatura em Canvas 2D;
 *   2. `src/world/props.ts` — a peça 3D que o garçom entrega na mesa;
 *   3. o `switch` de `pratoServido()`, no mesmo `props.ts`, que liga o id da
 *      ficha à peça 3D. Sem esta linha o prato aparece no cardápio, o pedido é
 *      falado, e o cachorro chega na mesa com as costas vazias.
 *
 * Este script escreve os três ESQUELETOS, no lugar certo de cada arquivo, com
 * `TODO` marcando o que é desenho e precisa de mão humana (ou de Claude). Ele
 * não tenta adivinhar como uma arepa se parece — ele garante que os três blocos
 * existam, casem pelo id e compilem.
 *
 * Uso:
 *   node scripts/novo-prato.mjs --secao Sobremesas \
 *     --id torta-de-limao --nome "Torta de limão" --preco "R$ 16" \
 *     --descricao "Massa crocante, creme azedinho e merengue queimado por cima." \
 *     [--selo "o favorito do Renan"]
 *
 * `--secao` aceita uma seção que já existe (entra no fim dela) ou um nome novo
 * (cria a seção no fim do cardápio). Depois de rodar:
 *
 *   1. desenhe a miniatura, em `cardapioData.ts` (leia a receita no cabeçalho
 *      do arquivo: louça, sombra, camadas, brilhos — e SILHUETA antes de tudo);
 *   2. monte a peça 3D, em `props.ts` (base em `y = 0`, olhando para `+Z`);
 *   3. `npm run typecheck && npm run build`, e rode `node scripts/cardapio.mjs`.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CARDAPIO = 'src/world/cardapioData.ts';
const PROPS = 'src/world/props.ts';

// --------------------------------------------------------------- argumentos

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const chave = process.argv[i].replace(/^--/, '');
  args[chave] = process.argv[i + 1];
}

const faltando = ['secao', 'id', 'nome', 'preco', 'descricao'].filter((k) => !args[k]);
if (faltando.length) {
  console.error(`Faltou: ${faltando.map((f) => '--' + f).join(', ')}`);
  console.error('Veja o cabeçalho de scripts/novo-prato.mjs para um exemplo completo.');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(args.id)) {
  console.error(`O id "${args.id}" tem que ser minúsculo, sem acento, com hífen: torta-de-limao`);
  process.exit(1);
}

/** `torta-de-limao` → `tortaDeLimao`, que é o nome das funções aqui */
const camelo = args.id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const escapar = (t) => t.replace(/'/g, "\\'");

// ------------------------------------------------------------- o cardápio

let cardapio = readFileSync(CARDAPIO, 'utf8');
if (cardapio.includes(`id: '${args.id}'`)) {
  console.error(`Já existe um prato com o id "${args.id}" em ${CARDAPIO}.`);
  process.exit(1);
}

// 1) a função que pinta a miniatura, logo antes do comentário do acervo
const MARCA_ACERVO = '// ---------------------------------------------------------------- o acervo';
if (!cardapio.includes(MARCA_ACERVO)) {
  console.error(`Não achei a marca do acervo em ${CARDAPIO}. O arquivo mudou de forma?`);
  process.exit(1);
}
const pintura = `/**
 * ${escapar(args.nome).toUpperCase()}.
 *
 * TODO: desenhar. A receita está no cabeçalho do arquivo — louça, sombra da
 * comida, camadas de trás para a frente, brilhos por último. O que faz ler a
 * 64 px é SILHUETA: dê a este prato uma forma que não se confunda com a arepa
 * (círculo gordo), o hambúrguer (pilha), o perro (diagonal) nem a bebida
 * (copo vertical). Tudo em fração de \`s\`.
 */
function ${camelo}(ctx: CanvasRenderingContext2D, s: number): void {
  prato(ctx, s);
  sombra(ctx, s * 0.5, s * 0.72, s * 0.3);
  // TODO: a comida
}

`;
cardapio = cardapio.replace(MARCA_ACERVO, pintura + MARCA_ACERVO);

// 2) a ficha, na seção pedida
const ficha = `      {
        id: '${args.id}',
        nome: '${escapar(args.nome)}',
        preco: '${escapar(args.preco)}',
        descricao:
          '${escapar(args.descricao)}',${args.selo ? `\n        selo: '${escapar(args.selo)}',` : ''}
        pintar: ${camelo},
      },
`;

const secaoExiste = new RegExp(
  `(titulo: '${args.secao.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}',[\\s\\S]*?pratos: \\[)([\\s\\S]*?)(\\n    \\],)`,
);
if (secaoExiste.test(cardapio)) {
  cardapio = cardapio.replace(secaoExiste, (_, cabeca, pratos, cauda) => cabeca + pratos + ficha + cauda.slice(1));
  console.log(`· ficha adicionada à seção "${args.secao}"`);
} else {
  const secao = `  {
    titulo: '${escapar(args.secao)}',
    nota: 'TODO: a linha em itálico embaixo do título da seção',
    pratos: [
${ficha}    ],
  },
`;
  // O fecha-colchete do ARRAY, e não o do fim do arquivo. Ancorar no fim já
  // falhou uma vez: bastou nascer uma função depois do `CARDAPIO` para a
  // seção deixar de entrar — em silêncio, porque o `replace` que não casa
  // devolve o texto intacto sem reclamar.
  const abre = cardapio.indexOf('export const CARDAPIO');
  const fecha = cardapio.indexOf('\n];\n', abre);
  if (abre < 0 || fecha < 0) {
    console.error(`Não achei o array CARDAPIO em ${CARDAPIO}.`);
    process.exit(1);
  }
  cardapio = cardapio.slice(0, fecha + 1) + secao + cardapio.slice(fecha + 1);
  console.log(`· seção "${args.secao}" criada`);
}
if (!cardapio.includes(`id: '${args.id}'`)) {
  console.error('A ficha não entrou no cardápio — o arquivo mudou de forma. Nada foi salvo.');
  process.exit(1);
}
writeFileSync(CARDAPIO, cardapio);
console.log(`· ${camelo}() (miniatura em Canvas) escrita em ${CARDAPIO}`);

// ------------------------------------------------------------------ props

let props = readFileSync(PROPS, 'utf8');
const nome3d = `${camelo}Servida`;
if (props.includes(`export function ${nome3d}(`)) {
  console.error(`Já existe ${nome3d}() em ${PROPS}.`);
  process.exit(1);
}

const MARCA_SERVIDO = '/* ---- fim dos pratos servidos ---- */';
if (!props.includes(MARCA_SERVIDO)) {
  console.error(`Não achei a marca dos pratos servidos em ${PROPS}. O arquivo mudou de forma?`);
  process.exit(1);
}
const peca = `/**
 * ${escapar(args.nome).toUpperCase()}, o modelo que vai para a mesa.
 *
 * TODO: montar. Contrato de peça: base em \`y = 0\`, olhando para \`+Z\`,
 * centrada na origem, cor da paleta e material por \`toon()\`. Comece pelo
 * \`pratoDeLouca()\`, que é a louça que todos os pratos servidos dividem.
 */
export function ${nome3d}(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = '${args.id}';
  g.add(pratoDeLouca());
  // TODO: a comida em cima da louça
  return g;
}

`;
props = props.replace(MARCA_SERVIDO, peca + MARCA_SERVIDO);

// a linha do switch que liga o id à peça
const MARCA_SWITCH = "    /* ---- novos pratos entram acima ---- */";
if (!props.includes(MARCA_SWITCH)) {
  console.error(`Não achei a marca do switch em ${PROPS}.`);
  process.exit(1);
}
props = props.replace(MARCA_SWITCH, `    case '${args.id}': return ${nome3d}();\n${MARCA_SWITCH}`);
writeFileSync(PROPS, props);
console.log(`· ${nome3d}() (modelo 3D) e a linha do pratoServido() escritas em ${PROPS}`);

console.log('');
console.log('Agora falta a parte que é desenho:');
console.log(`  1. ${CARDAPIO} → ${camelo}(), a miniatura`);
console.log(`  2. ${PROPS} → ${nome3d}(), a peça 3D`);
console.log('  3. npm run typecheck && npm run build && node scripts/cardapio.mjs /tmp/cd');
