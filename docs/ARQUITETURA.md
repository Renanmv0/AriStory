# Arquitetura

Regra geral: **uma cena não sabe que existe um renderer.** Ela recebe um
`WorldBuilder` e monta o mundo com ele. Tudo o que é global (câmera, luz, loop,
save, HUD) vive em `core/` e é acessado pela interface `GameAPI`.

```
main.ts  →  Game  ──┬── IsoCamera      câmera ortográfica isométrica
                    ├── Input          teclado + joystick virtual
                    ├── SaveState      localStorage: flags, contadores, memórias
                    ├── Ui             HUD, diálogo, diário, transição
                    ├── Player         física XZ + CharacterRig (quem você guia)
                    ├── Companion      segue o Player, mesmo rig trocável
                    └── WorldBuilder   a cena atual
```

## `core/`

| arquivo | responsabilidade |
|---|---|
| `Game.ts` | monta o renderer e as luzes, roda o loop, troca de cena, implementa `GameAPI` |
| `IsoCamera.ts` | ortográfica a 34° de elevação; gira em passos de 45°, zoom com viés vertical |
| `Input.ts` | única fonte de entrada; `move()` devolve vetor de tela |
| `SaveState.ts` | persistência; nada mais escreve em `localStorage` |
| `materials.ts` | `toon()` / `flat()` / `line()`, todos cacheados por cor |
| `types.ts` | `SceneDef`, `InteractableDef`, `GameAPI`, colisores |

### Detalhes que custaram caro

- **Névoa**: a câmera fica fixa a 60 unidades do alvo. `fogNear` menor que isso
  embaça a cena inteira. Padrão: `near 95`, `far 200`.
- **Sombras**: o *span* da câmera de sombra acompanha o zoom, e o `normalBias`
  escala junto (`0.04 × span/22`). Sem isso aparecem triângulos de *shadow acne*
  em volta do jogador quando a câmera abre.
- **Viés vertical da câmera**: ao afastar o zoom a mira sobe
  (`(viewSize − 14) × 0.38`), senão coisas altas como a roda gigante saem
  cortadas no topo.

### A dupla

`Player` e `Companion` guardam a POSIÇÃO num grupo externo e o corpo
(`CharacterRig`) como filho. Trocar de personagem (tecla `T`) é só trocar os
filhos entre os dois — ninguém sai do lugar, e por isso a rotação mora no rig,
nunca no grupo externo.

### Escolha no diálogo

`g.ask(pergunta, opções)` devolve o índice escolhido. Os botões respondem a
clique, a ← → e à própria tecla de ação, que durante a pergunta confirma em vez
de avançar a fala.

### Água

`submersion` (0 a 1) abaixa o corpo 72 cm, corta a velocidade quase pela metade,
troca a animação para braçada e apaga a sombra do chão. A cena decide quem está
molhado; o motor só aplica. O piso precisa de buraco de verdade
(`w.groundWithHoles`), senão o corpo submerso some por baixo do plano.

## `world/`

- `WorldBuilder.ts` — a API que as cenas usam. Ver a skill `aristory-cenario`.
- `collision.ts` — círculo (jogador) contra círculos e caixas giradas, no plano XZ.
- `Interactable.ts` — ponto de interação: prompt, destaque pulsante, `enabled`,
  `priority`, `moveTo()` para objetos que andam.
- `props.ts` / `furniture.ts` — kits de peças. Ver a skill `aristory-prop`.
- `ferrisWheel.ts` — peça animada com classe própria. As cabines ficam **fora**
  do grupo que gira e são reposicionadas por frame, para nunca virarem de cabeça
  para baixo.

## `characters/`

`spec.ts` define a ficha; `CharacterRig.ts` monta o corpo chibi (cabeça grande,
membros em cápsula) e anima a caminhada por seno. Nenhum arquivo de modelo.
Ver a skill `aristory-personagem`.

### Roupa

`rig.setOutfit('banho')` troca materiais registrados no construtor (camiseta e
calça viram pele, tênis vira pé descalço), esconde os acessórios de roupa e
mostra o calção. A cena pede pelo campo `outfit` do `SceneDef`; o motor volta
para `'normal'` a cada troca de cena e reaplica o traje quando você troca de
personagem.

## `ui/`

DOM sobre o canvas, dentro de `#ui` com `pointer-events: none`. `Ui.ts` é a
única coisa que cria elemento de tela. Diálogo com efeito de máquina de escrever;
primeiro clique completa a linha, o segundo avança.

## Ciclo de um frame

1. lê a entrada (bloqueada se há diálogo, diário ou transição aberta)
2. resolve a tecla de ação: diálogo primeiro, senão o interativo mais próximo
3. move o jogador e resolve colisão
4. recalcula qual interativo está "quente" (prioridade, depois distância)
5. roda os `w.onUpdate` da cena
6. move a câmera e a luz, renderiza
