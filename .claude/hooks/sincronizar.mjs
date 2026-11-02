// Sincroniza este computador com o GitHub, sem nunca perder trabalho.
//
// Roda sozinho ao abrir uma sessão do Claude Code (hook SessionStart, com
// --hook) e também sob demanda pelo comando /sincronizar.
//
// O que faz:
//   1. busca o GitHub (git fetch);
//   2. se a `main` de lá tem commits que não temos E a nossa árvore está
//      limpa, avança para eles (git merge --ff-only): é o que o celular fez;
//   3. em qualquer outro caso NÃO mexe em nada e só avisa o que está
//      acontecendo (mudança sem commit, commits sem enviar, histórico que
//      divergiu);
//   4. conta ao Claude os últimos commits, para a sessão já saber o que mudou.
//
// Nunca usa --force, nunca descarta mudança local, nunca cria commit.
// Qualquer falha (sem internet, sem git) só vira um aviso: sai sempre com 0.

import { execFileSync } from 'node:child_process'
import process from 'node:process'

const modoHook = process.argv.includes('--hook')
const raiz = process.env.CLAUDE_PROJECT_DIR || process.cwd()

function git(...args) {
  return execFileSync('git', args, {
    cwd: raiz,
    encoding: 'utf8',
    timeout: 25000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

// Devolve o texto, ou null se o comando falhar.
function tenta(...args) {
  try {
    return git(...args)
  } catch {
    return null
  }
}

const avisos = []
let ultimos = ''

function sincronizar() {
  if (tenta('rev-parse', '--is-inside-work-tree') !== 'true') return

  const ramo = tenta('branch', '--show-current') || '(sem branch)'

  if (tenta('fetch', 'origin', '--quiet') === null) {
    avisos.push(
      'Não consegui falar com o GitHub (sem internet?). Segui com o que há aqui.',
    )
  } else if (tenta('rev-parse', '--verify', '--quiet', 'origin/main') === null) {
    avisos.push('O GitHub não tem a branch main; não há com o que comparar.')
  } else {
    const atras = Number(git('rev-list', '--count', 'HEAD..origin/main'))
    const aFrente = Number(git('rev-list', '--count', 'origin/main..HEAD'))
    const sujo = git('status', '--porcelain').length > 0

    if (atras > 0 && aFrente === 0 && !sujo) {
      const novos = git('log', '--format=%h %s', 'HEAD..origin/main')
        .split('\n')
        .slice(0, 8)
      try {
        git('merge', '--ff-only', 'origin/main')
        avisos.push(
          `Baixei ${atras} commit(s) novo(s) do GitHub para a branch ${ramo} ` +
            `(o que foi feito pelo celular ou em outro lugar):\n  - ` +
            novos.join('\n  - ') +
            (atras > novos.length ? `\n  ... e mais ${atras - novos.length}` : ''),
        )
      } catch (erro) {
        avisos.push(
          'O GitHub tem commits novos, mas não consegui avançar sozinho ' +
            `(${String(erro.message).split('\n')[0]}). Nada foi alterado.`,
        )
      }
    } else if (atras > 0 && aFrente === 0 && sujo) {
      avisos.push(
        `O GitHub tem ${atras} commit(s) novo(s) que você ainda não tem, mas há ` +
          'mudanças sem commit aqui, então não baixei nada. Rode /enviar para ' +
          'guardar o que você fez e depois /sincronizar.',
      )
    } else if (atras > 0 && aFrente > 0) {
      avisos.push(
        `ATENÇÃO: o histórico divergiu. O GitHub tem ${atras} commit(s) que você ` +
          `não tem, e você tem ${aFrente} que o GitHub não tem. Não mexi em ` +
          'nada. Peça ajuda ao Claude antes de continuar: não force nada.',
      )
    } else if (aFrente > 0) {
      avisos.push(
        `Há ${aFrente} commit(s) aqui que ainda não foram para o GitHub. ` +
          'O celular só os verá depois do /enviar.',
      )
      if (sujo) avisos.push('Também há mudanças sem commit.')
    } else if (sujo) {
      avisos.push(
        'Há mudanças aqui que ainda não foram commitadas nem enviadas. ' +
          'O celular só as verá depois do /enviar.',
      )
    } else {
      avisos.push('Tudo em dia com o GitHub.')
    }
  }

  ultimos = tenta('log', '-5', '--format=%h %ad %s', '--date=short') || ''
}

try {
  sincronizar()
} catch (erro) {
  avisos.push(`A sincronização falhou (${String(erro.message).split('\n')[0]}).`)
}

const resumo = avisos.join('\n')
const contexto =
  'Estado do repositório ao abrir a sessão:\n' +
  resumo +
  (ultimos ? `\n\nÚltimos commits:\n${ultimos}` : '')

if (modoHook) {
  process.stdout.write(
    JSON.stringify({
      systemMessage: resumo,
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: contexto,
      },
    }),
  )
} else {
  process.stdout.write(contexto + '\n')
}
process.exit(0)
