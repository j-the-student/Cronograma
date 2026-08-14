import { auth, db } from "./firebase-init.js";

import {
    getMessaging,
    getToken,
    onMessage,
    isSupported
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

async function activateNotifications(user) {
    try {
        const supported = await isSupported();

        if (!supported) {
            alert("Este navegador não oferece suporte ao Firebase Cloud Messaging.");
            return;
        }

        if (!("Notification" in window)) {
            alert("Este navegador não oferece notificações.");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            alert("Você precisa permitir as notificações.");
            return;
        }

        const registration = await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js"
        );

        const messaging = getMessaging();

        const token = await getToken(messaging, {
            vapidKey: window.FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            alert("Não foi possível gerar o token de notificações.");
            return;
        }

        await setDoc(
            doc(
                db,
                "users",
                user.uid,
                "notificationTokens",
                token
            ),
            {
                token: token,
                userAgent: navigator.userAgent,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            },
            {
                merge: true
            }
        );

        alert("Notificações ativadas com sucesso! 🔔");

        console.log("FCM TOKEN:", token);

    } catch (error) {
        console.error("Erro ao ativar notificações:", error);

        alert(
            "Não foi possível ativar as notificações. Veja o console do navegador."
        );
    }
}

async function listenForegroundMessages() {
    const supported = await isSupported();

    if (!supported) return;

    const messaging = getMessaging();

    onMessage(messaging, (payload) => {
        console.log("Mensagem recebida:", payload);

        const title =
            payload.notification?.title ||
            "Meu Organizador ✦";

        const body =
            payload.notification?.body ||
            "Você tem um novo lembrete.";

        new Notification(title, {
            body
        });
    });
}

onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const button = document.getElementById("notificationBtn");

    button?.addEventListener("click", () => {
        activateNotifications(user);
    });

    listenForegroundMessages();
});
