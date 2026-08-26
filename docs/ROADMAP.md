# Roadmap

Ordem sugerida, não contrato. A graça é ir escolhendo o próximo pedaço junto.

## Feito

- [x] Motor isométrico: câmera ortográfica, movimento, colisão, troca de cena
- [x] Personagem procedural por ficha (Ari)
- [x] Sistema de interação com prompt, diálogo e destaque
- [x] Diário de memórias persistente
- [x] **Casa do Ari**, seguindo o esboço da casa de verdade
- [x] **Parque Villa Lobos** com roda gigante (com passeio) e frisbee jogável
- [x] **Clube**: piscina com natação, trampolim e respingos
- [x] A dupla: Ari e Renan juntos em cena, com troca pela tecla T
- [x] Ari com referência de verdade (cachos, presilha de estrela, laço, cinto)
- [x] Controles de celular (arrasta para andar, botão para interagir)

## Próximos passos naturais

### Personagens
- [ ] Conferir o Renan com uma referência dele (hoje é dedução da ilustração)
- [ ] Expressões simples (feliz, surpreso, dormindo)
- [ ] Roupa por cenário: sunga na piscina, casaco no frio
- [ ] O parceiro reagir ao que você faz (comentar, aplaudir, entrar na água junto)

### Cenários
- [ ] Casa do Renan
- [ ] O restaurante/bar de sempre
- [ ] A praia daquela viagem
- [ ] O caminho entre as casas (rua, ônibus, metrô)
- [ ] Um cenário de data especial (primeiro encontro?)

Cenário de lugar onde vocês **ainda não foram** também vale: o clube foi o
primeiro. A memória que ele desbloqueia assume isso na hora de escrever.

### Jogabilidade
- [ ] Frisbee de verdade: o outro personagem pega e devolve
- [ ] Ciclo dia/noite por cenário (o parque ao pôr do sol)
- [ ] Mapa mundo para escolher para onde ir
- [ ] Itens colecionáveis além das memórias (fotos, bilhetes)
- [ ] Som: passos, ambiente do parque, uma musiquinha

### Acabamento
- [ ] Tela de início com o nome do jogo
- [ ] Créditos/dedicatória no fim do diário
- [ ] Publicar no GitHub Pages para abrir por link no celular

## Como adicionar um cenário

Leia `.claude/skills/aristory-cenario/SKILL.md`. Resumo: um arquivo em
`src/scenes/`, registrar em `src/scenes/index.ts`, ligar as portas nos dois
sentidos, rodar o smoke test e olhar as fotos.
