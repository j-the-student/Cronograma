# Meu Organizador V2 — Firebase + GitHub Pages

Esta é a V2 migrada do Supabase para **Firebase Authentication + Cloud Firestore**. O site continua podendo ser hospedado no GitHub Pages.

## 1. Criar projeto no Firebase

No Firebase Console:
1. Crie um projeto.
2. Adicione um app **Web**.
3. Copie o objeto `firebaseConfig`.
4. Em Authentication > Sign-in method, ative **Email/Password**.
5. Crie o Cloud Firestore.

A documentação oficial explica o cadastro do app Web e o uso do SDK Firebase. 

## 2. Configurar

Abra `js/config.js` e substitua os placeholders pelo objeto de configuração do seu app Web.

Não coloque credenciais privadas/service-account no front-end.

## 3. Regras do Firestore

Abra Firestore > Rules e use o conteúdo de `firebase.rules`.

As regras fazem cada usuário acessar somente documentos cujo `user_id` seja o próprio UID.

## 4. Publicar no GitHub

Envie todos os arquivos ao repositório e ative GitHub Pages em Settings > Pages > Deploy from branch > main > root.

## 5. Login

Abra o site e use `login.html`. O sistema usa Firebase Authentication com e-mail e senha.

## 6. Notificações

A estrutura já inclui `firebase-messaging-sw.js` para a próxima etapa de Web Push. Para FCM Web, o site precisa estar em HTTPS e o navegador precisa suportar Push API. GitHub Pages atende ao requisito de HTTPS.

As notificações automáticas em horários específicos ainda exigem um mecanismo de envio no backend (por exemplo, Cloud Functions/Cloud Scheduler ou outro servidor), porque o navegador não deve ser responsável por disparar sozinho um lembrete enquanto o site está fechado.

## 7. Coleções usadas

- `tasks`
- `events`
- `exams`
- `projects`

Todos os documentos carregam `user_id`, permitindo isolamento por conta.

## Observação

A V2 mantém a mesma interface e funcionalidades principais da versão anterior, mas a persistência e autenticação foram reescritas para Firebase/Firestore.
