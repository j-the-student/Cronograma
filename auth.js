import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import "./firebase-init.js";

async function initAuth() {
  await window.firebaseReady;
  if (location.pathname.endsWith("login.html")) {
    onAuthStateChanged(window.firebaseAuth, user => {
      if (user) location.href = "index.html";
    });
    loginForm?.addEventListener("submit", async e => {
      e.preventDefault();
      authMessage.textContent = "Entrando...";
      try {
        await signInWithEmailAndPassword(window.firebaseAuth, email.value, password.value);
        location.href = "index.html";
      } catch (err) { authMessage.textContent = traduzFirebaseErro(err); }
    });
    signupBtn?.addEventListener("click", async () => {
      authMessage.textContent = "Criando conta...";
      try {
        await createUserWithEmailAndPassword(window.firebaseAuth, email.value, password.value);
        authMessage.textContent = "Conta criada! Você já pode usar o organizador.";
      } catch (err) { authMessage.textContent = traduzFirebaseErro(err); }
    });
    return;
  }
  onAuthStateChanged(window.firebaseAuth, user => {
    if (!user) { location.href = "login.html"; return; }
    document.querySelectorAll("#userEmail").forEach(x => x.textContent = user.email || "");
  });
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut(window.firebaseAuth);
    location.href = "login.html";
  });
}
function traduzFirebaseErro(err) {
  const map = {
    "auth/invalid-credential":"E-mail ou senha incorretos.",
    "auth/email-already-in-use":"Este e-mail já possui uma conta.",
    "auth/invalid-email":"Digite um e-mail válido.",
    "auth/weak-password":"A senha precisa ter pelo menos 6 caracteres.",
    "auth/missing-password":"Digite sua senha."
  };
  return map[err.code] || err.message;
}
initAuth();
