import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getMessaging, isSupported } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging.js";
import "./config.js";

if (window.FIREBASE_CONFIG.apiKey === "COLE_AQUI") {
  console.warn("Configure js/config.js com os dados do Firebase.");
}
const firebaseApp = initializeApp(window.FIREBASE_CONFIG);
window.firebaseApp = firebaseApp;
window.firebaseAuth = getAuth(firebaseApp);
window.firebaseDB = getFirestore(firebaseApp);
window.firebaseMessagingSupported = () => isSupported();
window.firebaseGetMessaging = () => getMessaging(firebaseApp);
window.firebaseReady = Promise.resolve(firebaseApp);
