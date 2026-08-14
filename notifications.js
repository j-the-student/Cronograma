import { auth, db } from "./firebase-init.js";

import {
    getMessaging,
    getToken,
    onMessage,
    isSupported
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


async function activateNotifications(user) {

    try {

        const supported = await isSupported();

        if (!supported) {
            alert(
                "Este navegador não oferece suporte às notificações push."
            );
            return;
        }


        if (!("serviceWorker" in navigator)) {
            alert(
                "Service Worker não é suportado neste navegador."
            );
            return;
        }


        if (!("Notification" in window)) {
            alert(
                "Este navegador não oferece notificações."
            );
            return;
        }


        /*
        ============================
        1. PEDIR PERMISSÃO
        ============================
        */

        const permission =
            await Notification.requestPermission();


        if (permission !== "granted") {

            alert(
                "Você precisa permitir as notificações."
            );

            return;
        }


        /*
        ============================
        2. REGISTRAR SERVICE WORKER
        ============================
        */

        const registration =
            await navigator.serviceWorker.register(
                "./firebase-messaging-sw.js"
            );


        console.log(
            "Service Worker registrado:",
            registration
        );


        await navigator.serviceWorker.ready;


        /*
        ============================
        3. INICIAR FIREBASE MESSAGING
        ============================
        */

        const messaging = getMessaging();


        /*
        ============================
        4. GERAR TOKEN FCM
        ============================
        */

        const token = await getToken(
            messaging,
            {

                vapidKey:
                    window.FIREBASE_VAPID_KEY,

                serviceWorkerRegistration:
                    registration

            }
        );


        if (!token) {

            alert(
                "O Firebase não conseguiu gerar um token."
            );

            return;
        }


        console.log(
            "TOKEN FCM:",
            token
        );


        /*
        ============================
        5. SALVAR TOKEN NO FIRESTORE
        ============================
        */

        const tokensRef =
            collection(
                db,
                "users",
                user.uid,
                "notificationTokens"
            );


        /*
        Evita cadastrar o mesmo navegador
        várias vezes.
        */

        const existingQuery =
            query(
                tokensRef,
                where(
                    "token",
                    "==",
                    token
                )
            );


        const existing =
            await getDocs(existingQuery);


        if (existing.empty) {

            await addDoc(
                tokensRef,
                {

                    token: token,

                    userAgent:
                        navigator.userAgent,

                    enabled: true,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }
            );

        } else {

            for (const tokenDocument of existing.docs) {

                await updateDoc(
                    tokenDocument.ref,
                    {

                        enabled: true,

                        updatedAt:
                            serverTimestamp()

                    }
                );

            }

        }


        /*
        ============================
        6. SUCESSO
        ============================
        */

        const button =
            document.getElementById(
                "notificationBtn"
            );


        if (button) {

            button.textContent =
                "🔔 Notificações ativadas";

        }


        alert(
            "Notificações ativadas! 🔔"
        );


    } catch (error) {

        console.error(
            "ERRO AO ATIVAR NOTIFICAÇÕES:",
            error
        );


        alert(
            "Não foi possível ativar as notificações. Abra o console com F12 para ver o erro."
        );

    }

}


/*
====================================
NOTIFICAÇÃO COM SITE ABERTO
====================================
*/

async function listenForegroundMessages() {

    try {

        const supported =
            await isSupported();

        if (!supported) {
            return;
        }


        const messaging =
            getMessaging();


        onMessage(
            messaging,
            (payload) => {

                console.log(
                    "Notificação recebida com o site aberto:",
                    payload
                );


                const title =
                    payload.notification?.title ||
                    "Meu Organizador ✦";


                const body =
                    payload.notification?.body ||
                    "Você tem um novo lembrete.";


                if (
                    Notification.permission
                    ===
                    "granted"
                ) {

                    new Notification(
                        title,
                        {
                            body: body
                        }
                    );

                }

            }
        );


    } catch (error) {

        console.error(
            "Erro ao ouvir notificações:",
            error
        );

    }

}


/*
====================================
USUÁRIO FIREBASE
====================================
*/

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {
            return;
        }


        const button =
            document.getElementById(
                "notificationBtn"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    activateNotifications(
                        user
                    );

                }
            );

        }


        listenForegroundMessages();

    }
);
