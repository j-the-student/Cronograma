// Cole aqui o objeto de configuração do seu app Web do Firebase.
// Firebase Console > Project settings > Your apps > Web app.
// A configuração web pode ficar no front-end. NUNCA coloque chaves
// privadas/service-account aqui.
window.FIREBASE_CONFIG = {
  apiKey: "COLE_AQUI",
  authDomain: "SEU-PROJETO.firebaseapp.com",
  projectId: "SEU-PROJETO",
  storageBucket: "SEU-PROJETO.firebasestorage.app",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

// Para ativar FCM depois, coloque a Web Push certificate key (VAPID)
// aqui. O recurso é opcional nesta versão.
window.FIREBASE_VAPID_KEY = "COLE_AQUI";
