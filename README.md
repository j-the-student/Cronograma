# Meu Organizador ✦

Um organizador pessoal estático feito com HTML, CSS e JavaScript, pronto para GitHub Pages.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos mantendo as pastas `css`, `js` e `assets`.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha `main` e a pasta `/ (root)`.
6. Salve e aguarde a publicação.

## Importante sobre os dados

A versão atual salva tarefas, compromissos, provas e projetos no `localStorage` do navegador. Isso significa que os dados ficam neste navegador/dispositivo e não sincronizam automaticamente entre aparelhos.

## Notificações

O botão de notificações pede permissão ao navegador e demonstra uma notificação. Para lembretes automáticos mesmo quando o site estiver fechado, a próxima versão pode usar Service Worker + Push API.

## Cronograma de estudos

Ao cadastrar uma prova, o sistema começa automaticamente entre 15 e 25 dias antes, dependendo da dificuldade, e distribui sessões pelos dias úteis.
