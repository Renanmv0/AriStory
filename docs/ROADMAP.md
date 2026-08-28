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
- [x] Diálogo com escolha (Sim/Não) e cutscene dos dois sentados no sofá
- [x] Frisbee de dois: você joga, ele busca e devolve, com contador de trocas
- [x] Traje de banho por cenário
- [x] Renan com referência de verdade (cachos escuros, moletom preto, mochila)
- [x] Sobrancelhas e jaqueta com capuz no rig
- [x] Sorveteria no parque, com os sorvetes na mão dos dois
- [x] Quadra de frisbee dedicada, com lançamento carregado e pegada no ar
- [x] Ponto de ônibus com placa escrita levando pro clube
- [x] Renan com silhueta de cabelo própria
- [x] Publicado no GitHub Pages
- [x] Beijo rápido da dupla, com coraçãozinho de cada lado
- [x] Quiosques de verdade: toldo listrado, letreiro escrito e vitrine (sorvete e sucos)
- [x] Passe de volta do frisbee: ele para, mira e joga além, para dar pra pegar no ar
- [x] Menu no canto com "recomeçar o jogo", que zera o diário e volta pra casa do Ari
- [x] Som: música procedural com clima por cenário e um efeito para cada ação
- [x] Interface de celular sem tapar texto, e tela de controles no menu
- [x] Praça da roda gigante povoada, cúpula com estrutura e margem do lago viva

## Próximos passos naturais

### Personagens
- [ ] Expressões simples (feliz, surpreso, dormindo)
- [ ] Mais roupas por cenário (casaco no frio, pijama em casa)
- [ ] O parceiro reagir ao que você faz (comentar, aplaudir, entrar na água junto)
- [ ] Mais carinho além do beijo (dar a mão andando, abraço)

### Cenários
- [ ] Casa do Renan
- [ ] O restaurante/bar de sempre
- [ ] A praia daquela viagem
- [ ] O caminho entre as casas (rua, ônibus, metrô)
- [ ] Um cenário de data especial (primeiro encontro?)

Cenário de lugar onde vocês **ainda não foram** também vale: o clube foi o
primeiro. A memória que ele desbloqueia assume isso na hora de escrever.

### Jogabilidade
- [ ] Frisbee: disputar o mesmo disco, vento afetando o voo, modo cronometrado
- [ ] Ciclo dia/noite por cenário (o parque ao pôr do sol)
- [ ] Mapa mundo para escolher para onde ir
- [ ] Itens colecionáveis além das memórias (fotos, bilhetes)
- [ ] Som: mais camadas de ambiente (pássaros no parque, água na piscina)

### Acabamento
- [ ] Tela de início com o nome do jogo
- [ ] Créditos/dedicatória no fim do diário

## Como adicionar um cenário

Leia `.claude/skills/aristory-cenario/SKILL.md`. Resumo: um arquivo em
`src/scenes/`, registrar em `src/scenes/index.ts`, ligar as portas nos dois
sentidos, rodar o smoke test e olhar as fotos.
