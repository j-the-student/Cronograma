import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

let currentUser=null;
export const getCurrentUser=()=>currentUser;
export function localDateString(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
export function escapeHTML(v=""){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}

function setupTheme(){if(localStorage.getItem("organizador-theme")==="dark")document.body.classList.add("dark");document.getElementById("themeBtn")?.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("organizador-theme",document.body.classList.contains("dark")?"dark":"light");});}
function setupMenu(){document.getElementById("mobileMenu")?.addEventListener("click",()=>document.querySelector(".sidebar")?.classList.toggle("open"));}
function setupModals(){document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest(".modal")?.classList.add("hidden"));}
function setupLogout(){document.getElementById("logoutBtn")?.addEventListener("click",async()=>{await signOut(auth);location.href="login.html";});}

async function loadHome(user){
  const list=document.getElementById("taskList"); if(!list)return;
  const today=localDateString();
  const [ts,es]=await Promise.all([
    getDocs(query(collection(db,"users",user.uid,"tasks"),where("date","==",today),orderBy("time","asc"))),
    getDocs(query(collection(db,"users",user.uid,"events"),where("date","==",today),orderBy("time","asc")))
  ]);
  const tasks=ts.docs.map(x=>({id:x.id,...x.data()}));
  const events=es.docs.map(x=>({id:x.id,...x.data()}));
  list.innerHTML=tasks.map(t=>`<div class="task-item"><input class="task-check" data-id="${t.id}" type="checkbox" ${t.done?"checked":""}><div class="task-info"><div class="task-title ${t.done?"done":""}">${escapeHTML(t.title)}</div><div class="task-meta">${escapeHTML(t.time||"Sem horário")} • ${escapeHTML(t.category||"Outro")}</div></div><span class="priority ${escapeHTML(t.priority||"media")}">${escapeHTML(t.priority||"media")}</span><button class="delete-btn" data-del="${t.id}">×</button></div>`).join("");
  document.getElementById("emptyTasks").style.display=tasks.length?"none":"block";
  const ev=document.getElementById("todayEvents"); if(ev){ev.innerHTML=events.map(e=>`<div class="event-item"><div class="event-time">${escapeHTML(e.time||"Sem horário")} • ${escapeHTML(e.category||"Outro")}</div><div class="event-title">${escapeHTML(e.title)}</div></div>`).join("");document.getElementById("emptyEvents").style.display=events.length?"none":"block";}
  const done=tasks.filter(t=>t.done).length;
  document.getElementById("totalTasks")&&(document.getElementById("totalTasks").textContent=tasks.length);
  document.getElementById("doneTasks")&&(document.getElementById("doneTasks").textContent=done);
  document.getElementById("eventCount")&&(document.getElementById("eventCount").textContent=events.length);
  document.getElementById("progressValue")&&(document.getElementById("progressValue").textContent=(tasks.length?Math.round(done/tasks.length*100):0)+"%");
  document.querySelectorAll("[data-id]").forEach(c=>c.onchange=async()=>{await updateDoc(doc(db,"users",user.uid,"tasks",c.dataset.id),{done:c.checked,updatedAt:serverTimestamp()});loadHome(user);});
  document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{await deleteDoc(doc(db,"users",user.uid,"tasks",b.dataset.del));loadHome(user);});
}

function setupHomeForm(user){const modal=document.getElementById("modal"),form=document.getElementById("taskForm");document.getElementById("addTaskBtn")?.addEventListener("click",()=>{form.reset();modal.classList.remove("hidden")});form?.addEventListener("submit",async e=>{e.preventDefault();await addDoc(collection(db,"users",user.uid,"tasks"),{title:document.getElementById("taskTitle").value.trim(),date:localDateString(),time:document.getElementById("taskTime").value||"",priority:document.getElementById("taskPriority").value,category:document.getElementById("taskCategory").value,notes:document.getElementById("taskNotes").value.trim(),done:false,createdAt:serverTimestamp()});form.reset();modal.classList.add("hidden");loadHome(user);});}

onAuthStateChanged(auth,async user=>{if(!user){if(!location.pathname.endsWith("login.html"))location.href="login.html";return;}currentUser=user;document.getElementById("userEmail")&&(document.getElementById("userEmail").textContent=user.email||"");setupTheme();setupMenu();setupModals();setupLogout();if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){setupHomeForm(user);await loadHome(user);}});
