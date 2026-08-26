# AriStory 🎡

Um jogo isométrico fofo sobre os lugares que a gente visitou de verdade.

Você controla o **Ari** e anda por cenários reais da nossa vida — a casa dele, o
Parque Villa Lobos com a roda gigante, e tudo o que vier depois. Cada coisa com
que dá pra interagir guarda um pedaço de memória, e as memórias vão parar num
diário dentro do jogo.

A ideia é construir isso **aos poucos, juntos**: um cenário de cada vez, um
detalhe de cada vez.

## Jogando

| tecla | o que faz |
|---|---|
| `W A S D` / setas | andar |
| `E` ou `espaço` | interagir · avançar diálogo |
| `Q` / `R` | girar a câmera 45° |
| `J` | abrir o diário de memórias |
| roda do mouse | zoom |
| celular | arraste em qualquer lugar da tela para andar; botão ✨ para interagir |

O progresso fica salvo no navegador.

## Rodando na sua máquina

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run typecheck  # checagem de tipos
npm run build      # gera dist/
npm run preview    # serve o dist/
```

Para pular direto num cenário: `?cena=villa-lobos&entrada=roda`.

## O que já tem

- **Casa do Ari** — sala, cozinha, cantinho de dormir. Café, TV, plantinha,
  porta-retrato, estante.
- **Parque Villa Lobos** — a roda gigante (com passeio de verdade: você entra na
  cabine e a câmera sobe junto), campinho de frisbee jogável, lago com patos,
  quiosque de água de coco, mesa de piquenique.
- **Diário de memórias** — sete memórias para desbloquear até agora.
- **Ari** — personagem procedural, ajustável por ficha.

## Como isso é feito

Sem nenhum arquivo de modelo 3D: **tudo é geometria procedural** (esferas,
cápsulas, caixas) com sombreado *toon*. Isso mantém o repositório leve e, mais
importante, permite mudar qualquer coisa — o cabelo do Ari, o tamanho da roda
gigante — trocando um número.

```
src/
  core/        renderer, câmera isométrica, entrada, save, loop  (Game.ts)
  world/       WorldBuilder (API das cenas), colisão, kits de peças
  characters/  ficha declarativa + rig procedural chibi
  entities/    jogador, frisbee
  scenes/      um arquivo por cenário
  ui/          HUD, diálogo, diário (DOM sobre o canvas)
```

Detalhes em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## Ajudando a construir

O repositório vem com **skills** em `.claude/skills/` que explicam cada tarefa
comum sem precisar ler o código todo:

| skill | para |
|---|---|
| `aristory-cenario` | criar/editar um cenário |
| `aristory-personagem` | mexer na aparência de alguém |
| `aristory-prop` | criar uma peça nova para o kit |
| `aristory-testar` | rodar, tirar foto e validar |

O que vem por aí está em [`docs/ROADMAP.md`](docs/ROADMAP.md).
