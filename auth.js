import { auth, db } from "./firebase-init.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const signupBtn = document.getElementById("signupBtn");
const authMessage = document.getElementById("authMessage");

function message(text, error=false){
  if(!authMessage) return;
  authMessage.textContent=text;
  authMessage.style.color=error ? "#d9536f" : "";
}

function friendly(error){
  const map={
    "auth/invalid-email":"Digite um e-mail válido.",
    "auth/invalid-credential":"E-mail ou senha incorretos.",
    "auth/email-already-in-use":"Esse e-mail já possui uma conta.",
    "auth/weak-password":"A senha precisa ter pelo menos 6 caracteres.",
    "auth/missing-password":"Digite sua senha.",
    "auth/too-many-requests":"Muitas tentativas. Tente novamente mais tarde."
  };
  return map[error?.code] || "Não foi possível concluir. Tente novamente.";
}

loginForm?.addEventListener("submit", async e=>{
  e.preventDefault();
  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value;
  try{
    message("Entrando...");
    await signInWithEmailAndPassword(auth,email,password);
    location.href="index.html";
  }catch(err){ console.error(err); message(friendly(err),true); }
});

signupBtn?.addEventListener("click", async ()=>{
  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value;
  if(!email||!password){ message("Preencha e-mail e senha para criar a conta.",true); return; }
  try{
    message("Criando sua conta...");
    const cred=await createUserWithEmailAndPassword(auth,email,password);
    await setDoc(doc(db,"users",cred.user.uid),{email:cred.user.email,createdAt:serverTimestamp()},{merge:true});
    location.href="index.html";
  }catch(err){ console.error(err); message(friendly(err),true); }
});

onAuthStateChanged(auth,user=>{
  if(user && location.pathname.endsWith("login.html")) location.href="index.html";
});
