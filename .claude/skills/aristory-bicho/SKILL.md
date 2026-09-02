---
name: aristory-bicho
description: Criar ou ajustar um bicho do AriStory — gato, cachorro, passarinho, peixe, qualquer entidade viva que habita um cenário, anda sozinha, faz barulho e aceita carinho. Use quando pedirem "adiciona um bichinho", "põe um cachorro na casa", "cria o pet de alguém", ou para mexer no jeito de um que já existe (anda demais, mia pouco, não deixa fazer carinho).
---

# Adicionar um bicho ao jogo

Bicho é a terceira categoria de coisa que aparece em cena, e ela existe porque
as outras duas não servem:

| categoria | o que é | onde mora |
|---|---|---|
| **peça** (prop, móvel) | geometria PARADA que a cena posiciona | `world/props.ts`, `world/furniture.ts` |
| **personagem** | gente, montada por ficha no `CharacterRig` | `characters/` |
| **bicho** | ator vivo com estado próprio: decide para onde vai e muda sozinho de um quadro para o outro | `entities/bichos/` |

Bicho vai para `entities/` porque `entities/` é a pasta dos **atores** — o
Frisbee e o PingPong já moram lá pela mesma razão. E ele **não** usa o
`CharacterRig`: aquele monta gente em pé (cabeça grande, dois braços, duas
pernas em cápsula), e nada ali serve para quatro patas.

## O cérebro já está pronto — não escreva outro

`entities/bichos/Bicho.ts` é a classe base, e ela já resolve tudo o que é
comum:

- passear por uma área, escolhendo destinos e **contornando móveis**;
- parar, sentar e voltar a andar, com tempos sorteados;
- virar para onde anda, sem estalo;
- fazer barulho sozinho, espaçado;
- receber carinho (para, senta, fica contente, e o contentamento decai sozinho);
- sorteio com semente — mesmo build, mesmo passeio, então a foto do teste não
  muda sozinha.

Um bicho novo é **um arquivo de aparência**, não um cérebro novo.

## O contrato

```ts
export class Pelusa extends Bicho {
  constructor(area: AreaDoBicho) {
    super(area, { velocidade: 0.62, chanceDeSentar: 0.35, somCadaMin: 9, somCadaMax: 20 });
    this.montar();                    // o corpo, num método privado seu
    this.prontoParaAparecer('pelusa'); // etiqueta + sombra em toda malha
  }

  protected animar(dt: number, { andando, sentado, carinho, fase }: PoseDoBicho): void {
    // a pose do quadro, toda por seno
  }
}
```

**`montar()` é chamado pela SUBCLASSE, nunca pela base.** Um método abstrato
chamado do construtor da base roda antes de os campos da subclasse existirem, e
as listas de malha sairiam vazias.

Os parâmetros de `JeitoDoBicho` são o que separa um gato preguiçoso de um
cachorro elétrico: `velocidade`, `descansoMin`/`descansoMax`,
`chanceDeSentar`, `somCadaMin`/`somCadaMax`, `duracaoDoCarinho`, `semente`.
Nenhum é obrigatório.

## Como a cena liga

```ts
const pelusa = new Pelusa({
  minX: x0 + 0.8, maxX: W / 2 - 0.8,
  minZ: z0 + 0.9, maxZ: D / 2 - 0.8,
  proibido: [
    { x: -2.2, z: -1.75, r: 1.05 },   // a cama
    { x: 0.15, z: z0 + 0.22, r: 0.7 }, // a estante
  ],
});
w.add(pelusa.group);
pelusa.aoSoar = () => g0.som('miado');

const carinho = w.interact({
  id: 'quarto:pelusa',
  x: pelusa.x, z: pelusa.z, radius: 1.15,
  label: 'Fazer carinho no Pelusa', icon: '🐈',
  highlight: pelusa.group,
  onInteract: async (g) => { pelusa.receberCarinho(); /* … */ },
});

// SEM ISTO o balão fica onde ele nasceu e o carinho vira um ponto morto no chão
w.onUpdate((dt) => {
  pelusa.update(dt);
  carinho.moveTo(pelusa.x, pelusa.z);
});
```

Três coisas que a cena declara e o bicho não adivinha:

1. **A área e os obstáculos.** Repita aqui os móveis que já bloqueiam a dupla,
   em vez de o bicho ler o colisor do mundo: ele é menor e passa em vão que
   gente não passa, então quem decide o que é obstáculo *para ele* é quem monta
   a cena.
2. **O som.** O bicho sabe QUANDO fazer barulho, mas não conhece o motor de
   áudio — a cena liga `aoSoar` no `g.som(...)`.
3. **O `moveTo` no `onUpdate`.** É o que faz o prompt andar junto.

## Modelar o corpo — o que o Pelusa já pagou em foto olhada

1. **Elipsoide, não cápsula girada.** `CapsuleGeometry` com
   `rotation.z = PI/2` põe o comprimento no eixo **X** — mas a cabeça e o rabo
   moram no **Z**, então o corpo sai atravessado em relação à própria cabeça, e
   de perto o bicho parece amassado de lado. `SphereGeometry(1)` com
   `scale.set(largura, altura, comprimento)` não tem eixo escondido.
2. **Cabeça grande.** Mesma régua chibi do resto do jogo. No tamanho que um
   bicho ocupa na tela, é a cabeça que faz ele ser lido como gato ou cachorro.
3. **Marca de cor é uma FAIXA, não um segundo corpo.** A mancha do lombo do
   Pelusa começou como uma cápsula do tamanho do corpo por cima, e lia como
   cobertor mal posto. Baixa e estreita.
4. **Rabo em gomos ENCADEADOS** (cada um filho do anterior), com velocidade e
   amplitude crescendo da base para a ponta. É a defasagem que faz a ponta
   chegar depois e a curva chicotear; gomo único balança uma barra rígida.
5. **Curva em S**: o primeiro gomo tomba para trás e os de cima voltam para a
   frente. Todos no mesmo ângulo dão uma antena reta.
6. **Pata encosta no chão.** `CapsuleGeometry(r, comp)` tem altura total
   `comp + 2r` — o centro vai em metade disso, senão o bicho flutua.
7. **Pegadinha de sinal**, a mesma do resto do projeto: peça da esquerda nasce
   em `x` negativo, então `rotation.z` **negativo** nela é que abre para fora.
   Vale para orelha, pata e perna.

## A pose

Tudo por seno, como o resto do jogo. A base entrega `andando`, `sentado`,
`carinho` (0 a 1) e `fase` (o relógio dele). Três coisas que valem em qualquer
bicho:

- **andando**: patas em diagonal (dianteira esquerda com traseira direita), o
  corpo subindo de leve a cada passo;
- **parado**: as patas voltam ao lugar por interpolação (`Math.min(1, dt * 8)`),
  nunca por estalo, e a respiração é um seno lento;
- **carinho**: é aqui que o bicho fica fofo — olhos fechando (`scale.y`),
  orelhas abrindo, cabeça subindo para encostar na mão, rabo mexendo mais.

## O som

Efeito novo em `src/audio/efeitos.ts` — ver a skill `aristory-som`. O que o
miado ensinou: **um tom plano sai como apito de brinquedo; é a CURVA que faz
virar bicho.** O miado são duas sílabas coladas, a primeira subindo
(600 → 900 Hz) e a segunda descendo (1000 → 700 Hz), com um chiado por baixo
para tirar o ar de sintetizador.

Cuidado com o decaimento exponencial: `dur: 0.3` rendeu só 0,13 s de áudio
audível e virou um pio. Meça o `.wav` antes de dar por pronto.

## Validar

```bash
npm run typecheck
npm run build && npx vite preview --port 4173 &
node scripts/pelusa.mjs /tmp/pe     # o modelo do teste de bicho
node scripts/musica.mjs /tmp/som    # rende o som novo para ouvir
```

`scripts/pelusa.mjs` é o molde para o teste do próximo bicho. Ele mede, e não
só fotografa:

- a **trilha** soma distância de verdade (pega o bicho congelado);
- ele nunca sai da área nem entra num móvel;
- o ponto de interação está **em cima** dele (prova o `moveTo` — comparar
  posições, e não "o balão apareceu aqui": o bicho passeia, e qualquer canto
  pode ter ele em cima na hora do teste);
- ele faz barulho sozinho (pelo `Som.contagem`);
- o carinho funciona e ele fica quieto durante.

**Foto obrigatória**, e de PERTO: use `focusCamera` no grupo dele e
`setZoom(3)`. Os sete erros de modelagem acima só apareceram com a câmera
colada — de longe qualquer bolota parece um gato.

## Perguntar ao Renan

O bicho é de alguém de verdade. Não invente: **peça a foto**, o nome, de quem
ele é e o jeito dele (agitado, dorminhoco, medroso). As falas do carinho também
são dele — escreva um provisório, diga que é seu, e troque quando ele mandar.
