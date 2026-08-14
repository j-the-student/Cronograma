// Cole aqui o objeto de configuração do seu app Web do Firebase.
// Firebase Console > Project settings > Your apps > Web app.
// A configuração web pode ficar no front-end. NUNCA coloque chaves
// privadas/service-account aqui.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBpeyqgC7-fsjICctIT4o-j4mvwhfUvaA",
  authDomain: "cronograma-uni.firebaseapp.com",
  projectId: "cronograma-uni",
  storageBucket: "cronograma-uni.firebasestorage.app",
  messagingSenderId: "203072878513",
  appId: "1:203072878513:web:2a8083da511928bbebaf90",
  measurementId: "G-DHYHS572GJ"
};

// Para ativar FCM depois, coloque a Web Push certificate key (VAPID)
// aqui. O recurso é opcional nesta versão.
window.FIREBASE_VAPID_KEY = "COLE_AQUI";
