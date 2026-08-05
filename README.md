# Library App — versão organizada

## O que mudou

O Home foi mantido com o estilo da imagem de referência:
- Início
- área de atualizações
- Favoritos
- Livros
- Línguas
- Novidades
- Online
- barra inferior

## Estrutura

index.html
pages/
  home.html
  music.html
  library.html
  learn.html
  notes.html

css/
  variables.css
  base.css
  layout.css
  home.css
  components.css
  responsive.css

js/
  app.js
  home.js
  music.js
  library.js
  learn.js
  notes.js

## Como estudar

1. Começa por index.html.
2. Depois abre pages/home.html para entender o Home.
3. Abre css/home.css para entender o visual do Home.
4. Depois estuda js/home.js.
5. Repete o processo para Música, Biblioteca, Aprenda e Anotações.

## Importante

Como o projeto usa fetch() para carregar cada página HTML, abre-o através de um servidor local.

No VS Code:
- instala Live Server;
- abre a pasta;
- botão direito em index.html;
- Open with Live Server.

Não abras simplesmente com duplo clique em index.html.

## Próximas melhorias

- Login e contas
- Supabase / cloud
- Upload permanente de livros e músicas
- Leitor PDF interno
- leitor de Word e Excel
- pesquisa geral
- YouTube
- quizzes reais
- jogo da memória
- estatísticas de aprendizagem
- sincronização PC/telemóvel
