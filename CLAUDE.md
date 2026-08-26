# AriStory

Jogo isométrico em TypeScript + Three.js + Vite. Um presente: o jogador anda por
cenários que existem de verdade na vida do casal e interage com as coisas.

**Idioma do projeto é português.** Diálogos, nomes de cena, commits, comentários
e documentação em pt-BR. Código (identificadores) em português também, sem
acento — é o padrão do repositório, siga o que já está lá.

## Antes de mexer, leia a skill certa

| tarefa | skill |
|---|---|
| criar/editar um cenário | `.claude/skills/aristory-cenario/SKILL.md` |
| aparência de um personagem | `.claude/skills/aristory-personagem/SKILL.md` |
| criar uma peça de cenário | `.claude/skills/aristory-prop/SKILL.md` |
| rodar, ver e validar | `.claude/skills/aristory-testar/SKILL.md` |

Elas existem para você **não precisar varrer o código** a cada tarefa. Comece por
elas; `docs/ARQUITETURA.md` só quando o assunto for o motor em si.

## Invariantes

- **Nada de asset externo.** Todo modelo é geometria procedural. Não adicione
  `.glb`, `.png`, textura ou biblioteca de modelo.
- **Cor sai de `src/palette.ts`; material sai de `toon()`/`flat()`.** Nunca
  instancie material dentro de uma cena.
- **Cena não conhece o motor.** Ela só usa `WorldBuilder` e `GameAPI`.
- **Peça reutilizável vai para o kit** (`world/props.ts`, `world/furniture.ts`),
  não para dentro da cena.
- Parâmetro com cor da paleta precisa de anotação: `cor: number = P.wood`.

## Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/smoke.mjs /tmp/aristory   # fotos das cenas + erros de console
node scripts/ride.mjs   /tmp/ride      # cutscene da roda gigante ponta a ponta
```

Mudança visual **precisa** de foto olhada antes de ser dada como pronta.
O Chromium já está instalado; não rode `playwright install`.

## Trabalhando junto

Este jogo está sendo construído aos poucos, de propósito. Ao terminar um pedaço,
diga o que dá para fazer em seguida e deixe a escolha com o Renan — não emende
três cenários de uma vez. Quando faltar informação sobre uma pessoa ou um lugar
real (como alguém é, como é a casa), **pergunte** em vez de inventar: o valor
deste projeto está em ser parecido com a vida real deles.
