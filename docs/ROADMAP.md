# Roadmap

Ordem sugerida, não contrato. A graça é ir escolhendo o próximo pedaço junto.

## Feito

- [x] Motor isométrico: câmera ortográfica, movimento, colisão, troca de cena
- [x] Personagem procedural por ficha (Ari)
- [x] Sistema de interação com prompt, diálogo e destaque
- [x] Diário de memórias persistente
- [x] **Casa do Ari**
- [x] **Parque Villa Lobos** com roda gigante (com passeio) e frisbee jogável
- [x] Controles de celular (arrasta para andar, botão para interagir)

## Próximos passos naturais

### Personagens
- [ ] Ajustar o Ari com referência de verdade (cabelo, tom de pele, roupa)
- [ ] Trazer o Renan para dentro do jogo — primeiro como NPC no parque
- [ ] Os dois andando juntos: o segundo segue o primeiro
- [ ] Expressões simples (feliz, surpreso, dormindo)

### Cenários
- [ ] Casa do Renan
- [ ] O restaurante/bar de sempre
- [ ] A praia daquela viagem
- [ ] O caminho entre as casas (rua, ônibus, metrô)
- [ ] Um cenário de data especial (primeiro encontro?)

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
