# A bancada interativa da portaria

A mesa 3D passa a ser a vista inicial do expediente. A campainha chama o
visitante, a mão/pata/asa apresenta os papéis pela calha e cada documento
pode ser tocado para abrir a leitura. Manual, data, lista, lupa e os carimbos
usam as mesmas ações do painel e respeitam as ferramentas disponíveis do dia.
A mesa tem mais espaço na frente, bandeja de feltro, sacola e caixa de achados.

## As três vistas

- Bancada: documentos e ferramentas no mundo, com realce e dica no mouse,
  áreas de toque ampliadas e atalhos para leitura e sacola.
- Documento: o painel original para ler, perguntar e comparar evidências.
- Visitante: câmera frontal com enquadramento mais largo para grupos e uma
  miniatura do documento apresentado, sem corrigir sua foto. O clique no
  visitante seleciona rosto com a lupa ou abre esta vista normalmente.

Recolher conserva a folha, a rolagem e a primeira seleção da lupa. Não chama
`fechar()`, que encerra o painel e seus balões. As mudanças de câmera têm
interpolação e respeitam a preferência por movimento reduzido.

## Coreografia e regras

O membro de entrega é uma referência pública opcional em `Bicho`, implementada
por cada anatomia. O adaptador da portaria restaura a pose base antes de
atualizar o bicho e só depois aplica o gesto. Os documentos seguem a mão,
a calha e a área de leitura; a devolução percorre o caminho inverso.

Ao pedir a sacola, a bolsa chega, os itens reais do atendimento saem para
inspeção, e o clique abre a escolha correspondente. O permitido volta à
bolsa, e o proibido permanece na caixa de achados até o fim da cena.

As ferramentas esperam o fim de entregas, movimentos e carimbadas. O relógio
não cobra essas animações; observar e ler mantêm as regras de tempo do
expediente. Decisões, pagamento, estrelas e fatos continuam no `Expediente`.

A comparação visual inclui os disfarces do Jean-Luc, o capacete removível do
Capy e os acompanhantes. O elevador conserva a altura do rosto principal,
sem usar a altura dos acessórios ou do grupo. A Luna escondida fica atrás,
com as orelhas acima do responsável, e aparece ao apontar a diferença.

`ClicavelDef.duranteTrava` só permite os alvos que a cena declarou. Falas,
menus, transições e outros painéis ainda bloqueiam o apontador. A cena também
protege suas ações contra reentrada e limpa seus estados ao desmontar.

## Publicação e validação

`PORTARIA_NO_JOGO` continua **false**. O acesso permanece por `?portaria`,
com save separado; não se liga o minigame no fluxo normal do jogo.

- `npm run build`
- `node scripts/portaria.mjs`: regras e consequências sem navegador.
- `node scripts/portariaBancada.mjs /tmp/bancada`: cliques no canvas,
  computador/celular, entrega, leitura, comparação, carimbo e save isolado.
- `SACOLA=1 DIA=5 node scripts/portariaBancada.mjs /tmp/sacola`: inspeção física.
- `SACOLA=1 PROIBIDO=1 DIA=5 node scripts/portariaBancada.mjs /tmp/achados`:
  o item proibido permanece fisicamente nos achados.
- `GRUPO=1 DIA=6 node scripts/portariaBancada.mjs /tmp/grupo`: comparação com
  convite coletivo, lupa no visitante e a Luna saindo de trás da responsável.
- `SO=dia DIA=1 node scripts/portariaCena.mjs /tmp/dia1` e
  `SO=dia DIA=6 CEL=1 node scripts/portariaCena.mjs /tmp/dia6`: dia completo,
  envelope igual ao expediente sem cena e volta liberando os dois bancos.
- `SO=mesa-da-portaria,sacola-da-portaria SEM_FUNDIR=1 node scripts/zfighting.mjs`.

Os testes de navegador usam o preview local (`SMOKE_URL`) e Chromium já
instalado (`CHROME_PATH`). As fotos devem ser abertas antes da publicação.
