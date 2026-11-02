// Guarda das invariantes do AriStory (hook PreToolUse de Write e Edit).
//
// Recusa duas coisas que o CLAUDE.md proíbe, antes de o arquivo ser escrito:
//   1. asset externo: .png, .glb, .mp3, .wav e afins (tudo é geometria
//      procedural e som sintetizado; a única textura é a desenhada em <canvas>);
//   2. rato: o Ari tem fobia de rato de verdade. Nenhum rato, camundongo ou
//      ratazana entra no código do jogo.
//
// Lê o JSON do hook na entrada padrão. Sai com 2 (e explica no stderr) para
// bloquear; sai com 0 para deixar passar. Qualquer erro aqui deixa passar —
// um guarda quebrado não pode travar o trabalho.

import process from 'node:process'

const EXTENSOES_PROIBIDAS =
  /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|glb|gltf|fbx|obj|mtl|mp3|wav|ogg|m4a|flac|aac|hdr|exr|ktx2?|basis)$/i

// "rato" só como palavra inteira: "retrato", "aparato" e "arrato" não contam.
const RATO = /\b(rato|ratos|ratazana|ratazanas|camundongo|camundongos)\b/i

// Onde a palavra é só texto de português e não um bicho no jogo: a apostila
// do Gatito ensina que "rato" é "um tempinho" em espanhol-português.
const PODE_FALAR_DA_PALAVRA = ['src/minigames/aula/licoes/']

const IGNORAR = ['graphify-out/', 'node_modules/', '.git/']

function liga(texto) {
  return String(texto ?? '').replace(/\\/g, '/')
}

function bloquear(mensagem) {
  process.stderr.write(mensagem + '\n')
  process.exit(2)
}

async function lerEntrada() {
  let bruto = ''
  process.stdin.setEncoding('utf8')
  for await (const pedaco of process.stdin) bruto += pedaco
  return JSON.parse(bruto)
}

function relativoAoProjeto(alvo, raiz) {
  const a = liga(alvo)
  const r = liga(raiz).replace(/\/+$/, '')
  if (!r || !a.toLowerCase().startsWith(r.toLowerCase() + '/')) return null
  return a.slice(r.length + 1)
}

try {
  const dados = await lerEntrada()
  const entrada = dados.tool_input ?? {}
  const rel = relativoAoProjeto(
    entrada.file_path,
    process.env.CLAUDE_PROJECT_DIR || dados.cwd,
  )

  // Fora do projeto (memória, rascunhos, pasta temporária): não é conosco.
  if (rel === null) process.exit(0)
  if (IGNORAR.some((p) => rel.startsWith(p))) process.exit(0)

  if (EXTENSOES_PROIBIDAS.test(rel)) {
    bloquear(
      `Bloqueado: "${rel}" é um arquivo de imagem, modelo ou som.\n` +
        'O AriStory não usa asset externo: todo modelo é geometria procedural, ' +
        'todo som é sintetizado na hora, e a única textura permitida é a ' +
        'desenhada num <canvas> em tempo de execução. Veja a primeira ' +
        'invariante no CLAUDE.md e a skill aristory-prop ou aristory-som.',
    )
  }

  const emSrc = rel.startsWith('src/')
  const liberado = PODE_FALAR_DA_PALAVRA.some((p) => rel.startsWith(p))
  if (emSrc && !liberado) {
    // Write manda "content"; Edit manda "new_string".
    const texto = entrada.content ?? entrada.new_string ?? ''
    for (const linha of String(texto).split(/\r?\n/)) {
      const t = linha.trim()
      // Comentário que cita a regra ("nada de rato") não é um rato no jogo.
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue
      const achou = t.match(RATO)
      if (achou) {
        bloquear(
          `Bloqueado: "${achou[0]}" em ${rel}.\n` +
            'O Ari tem fobia de rato de verdade: nenhum rato, camundongo ou ' +
            'ratazana entra no jogo — nem bicho, nem praga, nem fantasia, nem ' +
            'enfeite, nem desenho (golfinho e barata também não, decisão do ' +
            'Renan). Escolha outro bicho. Linha: ' +
            t.slice(0, 120),
        )
      }
    }
  }
} catch {
  // Entrada inesperada: deixa passar.
}
process.exit(0)
