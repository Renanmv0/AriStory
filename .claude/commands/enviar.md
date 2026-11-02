---
description: Valida, commita e envia o que mudou para o GitHub (branch de desenvolvimento e main), para as sessões do celular partirem do mesmo ponto
argument-hint: [resumo opcional do que mudou]
---

Envie para o GitHub tudo o que foi feito nesta sessão, de modo que qualquer
sessão aberta depois (inclusive a do celular) comece já com estas mudanças.
O Renan chamou este comando de propósito: isso conta como autorização para
commitar, subir a branch e avançar a `main`. **Nunca use `--force`.**

Resumo dado pelo Renan (pode estar vazio): $ARGUMENTS

Siga estes passos, em ordem. Se um passo mandar parar, pare e explique em
português simples, sem seguir adiante.

## 1. Ver onde estamos

Rode `git fetch origin` e depois:

- `git branch --show-current` (a branch de desenvolvimento);
- `git status --short` (o que mudou);
- quantos commits `origin/<branch>` e `origin/main` têm que a branch local não
  tem (`git rev-list --count HEAD..origin/<ref>`), e quantos a local tem a mais.

Decisões:

- **Nada mudou e a local já é igual à `main` remota:** diga "não há nada para
  enviar" e pare.
- **O remoto está à frente** (o celular mexeu; as sessões do celular fundem na
  `main`, então compare com `origin/main`): se a árvore local estiver limpa,
  rode `node .claude/hooks/sincronizar.mjs`, que avança com segurança
  (`--ff-only`). Se houver mudança local **e** o remoto também avançou, ou se
  o histórico divergiu, **pare**: conte o que há dos dois lados e peça ao
  Renan para decidir. Não tente resolver conflito sozinho.

## 2. Conferir que o jogo continua de pé

Rode `npm run build` (ele faz o `typecheck` e monta o jogo, igual ao deploy).

- **Passou:** siga.
- **Falhou:** **não suba para a `main`.** Mostre o erro (arquivo e linha) e
  pergunte se quer corrigir primeiro. Só suba a branch de desenvolvimento, sem
  tocar na `main`, se o Renan pedir isso explicitamente.

Mudança visual ainda precisa de foto olhada (`aristory-testar`); se esta
sessão mexeu em cena, peça, personagem ou som e isso ainda não foi conferido,
avise antes de enviar.

## 3. Escolher o que entra

Adicione os arquivos **pelo nome**, nunca `git add -A` às cegas. Mostre a lista.
Não entram, e se aparecerem **pare e pergunte**:

- `graphify-out/`, `node_modules/`, `dist/` (já estão no `.gitignore`);
- imagem, modelo ou som (`.png`, `.glb`, `.mp3`, `.wav`…): é asset externo, o
  que o projeto proíbe;
- `.env`, chaves, senhas, tokens;
- qualquer arquivo com mais de 1 MB que não seja claramente código ou texto;
- `package-lock.json` alterado sem que `package.json` tenha mudado (ruído de
  instalação).

## 4. Commitar

Mensagem **em português**, no padrão do repositório: uma primeira linha curta
com o tema e o resultado (`Tema: o que mudou e por quê`), e um corpo curto que
conte o que mudou e o porquê, para quem abrir o celular entender sem ler o
diff. Veja `git log -6 --format=%s` para acompanhar o tom. Se o Renan deu um
resumo acima, parta dele.

Termine a mensagem com a linha de coautoria que o ambiente indicar
(`Co-Authored-By: ...`).

Se `git config user.name` ou `user.email` estiver vazio, use
`git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit ...`
só neste comando, sem gravar na configuração. Nunca coloque o e-mail pessoal
do Renan num commit.

## 5. Subir

1. `git push origin <branch-de-desenvolvimento>`
2. Avançar a `main` sem criar commit de fusão e sem forçar:
   `git push origin HEAD:refs/heads/main`

Se o push for recusado, **pare**: significa que o remoto mudou no meio do
caminho. Faça `git fetch`, explique a diferença e peça orientação.

## 6. Conferir e avisar

Rode `git fetch origin` e compare `git rev-parse --short HEAD`,
`origin/<branch>` e `origin/main`. Os três têm de ser iguais. Se `gh` existir,
mostre o estado do último deploy; se não existir, diga que o Pages se confere
na aba **Actions** do repositório.

Responda ao Renan, em poucas linhas:

- o que foi enviado (os arquivos e o hash do commit);
- se o build passou;
- que a `main` publica sozinha no GitHub Pages;
- que o celular já pode abrir uma sessão nova e vai partir deste commit
  (uma sessão do celular que já estava aberta antes precisa de `git pull`).
