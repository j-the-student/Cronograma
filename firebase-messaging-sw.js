importScripts(
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyCBpeyqgC7-fsjICctIT4o-j4mvwhfUvaA",
    authDomain: "cronograma-uni.firebaseapp.com",
    projectId: "cronograma-uni",
    storageBucket: "cronograma-uni.firebasestorage.app",
    messagingSenderId: "203072878513",
    appId: "1:203072878513:web:2a8083da511928bbebaf90"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    console.log(
        "[firebase-messaging-sw.js] Mensagem recebida:",
        payload
    );

    const notificationTitle =
        payload.notification?.title ||
        "Meu Organizador ✦";

    const notificationOptions = {
        body:
            payload.notification?.body ||
            "Você tem um novo lembrete.",
        icon: "./icon-192.png"
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );

});
