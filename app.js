const DB_KEY="meuOrganizador_v1";
const defaultDB={tasks:[],events:[],exams:[],projects:[],studyDone:{},theme:"light"};
function getDB(){try{return JSON.parse(localStorage.getItem(DB_KEY))||defaultDB}catch{return defaultDB}}
function saveDB(db){localStorage.setItem(DB_KEY,JSON.stringify(db))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function pad(n){return String(n).padStart(2,"0")}
function dateKey(d){const x=new Date(d);return `${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`}
function parseDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
function formatDate(s,opts={day:"2-digit",month:"long",year:"numeric"}){return parseDate(s).toLocaleDateString("pt-BR",opts)}
function todayKey(){return dateKey(new Date())}
function escapeHTML(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function setupCommon(){
 const db=getDB(); document.body.classList.toggle("dark",db.theme==="dark");
 document.getElementById("themeBtn")?.addEventListener("click",()=>{const d=getDB();d.theme=d.theme==="dark"?"light":"dark";saveDB(d);document.body.classList.toggle("dark",d.theme==="dark")});
 document.getElementById("mobileMenu")?.addEventListener("click",()=>document.querySelector(".sidebar")?.classList.toggle("open"));
 document.getElementById("notificationBtn")?.addEventListener("click",requestNotifications);
 document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest(".modal").classList.add("hidden")));
 document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
}
async function requestNotifications(){if(!("Notification"in window)){alert("Seu navegador não oferece notificações.");return}const p=await Notification.requestPermission();if(p==="granted")new Notification("Meu Organizador ✨",{body:"Notificações ativadas!"});else alert("Você pode permitir notificações nas configurações do navegador.")}
function renderHome(){
 const db=getDB(), today=todayKey(), tasks=db.tasks.filter(x=>x.date===today), events=db.events.filter(x=>x.date===today).sort((a,b)=>(a.time||"99").localeCompare(b.time||"99"));
 const done=tasks.filter(x=>x.done).length, progress=tasks.length?Math.round(done/tasks.length*100):0;
 document.getElementById("todayLabel").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
 document.getElementById("heroDate").textContent=formatDate(today,{weekday:"long",day:"numeric",month:"long"});
 document.getElementById("totalTasks").textContent=tasks.length;document.getElementById("doneTasks").textContent=done;document.getElementById("eventCount").textContent=events.length;
 document.getElementById("progressValue").textContent=progress+"%";document.querySelector(".progress-ring").style.transform=`rotate(${progress*3.6}deg)`;document.getElementById("progressValue").style.transform=`rotate(${-progress*3.6}deg)`;
 const list=document.getElementById("taskList");list.innerHTML=tasks.sort((a,b)=>(a.time||"99").localeCompare(b.time||"99")).map(t=>`<div class="task-item"><input class="task-check" type="checkbox" ${t.done?"checked":""} data-task="${t.id}"><div class="task-info"><div class="task-title ${t.done?"done":""}">${escapeHTML(t.title)}</div><div class="task-meta">${t.time||"Sem horário"} · ${escapeHTML(t.category)}</div></div><span class="priority ${t.priority}">${t.priority}</span><button class="delete-btn" data-delete-task="${t.id}">×</button></div>`).join("");
 document.getElementById("emptyTasks").style.display=tasks.length?"none":"block";
 list.querySelectorAll("[data-task]").forEach(c=>c.addEventListener("change",()=>{const d=getDB(),t=d.tasks.find(x=>x.id===c.dataset.task);if(t)t.done=c.checked;saveDB(d);renderHome()}));
 list.querySelectorAll("[data-delete-task]").forEach(b=>b.addEventListener("click",()=>{const d=getDB();d.tasks=d.tasks.filter(x=>x.id!==b.dataset.deleteTask);saveDB(d);renderHome()}));
 const ev=document.getElementById("todayEvents");ev.innerHTML=events.map(e=>`<div class="event-item"><div class="event-time">${e.time||"Sem horário"} · ${escapeHTML(e.category)}</div><div class="event-title">${escapeHTML(e.title)}</div></div>`).join("");document.getElementById("emptyEvents").style.display=events.length?"none":"block";
 const exams=db.exams.filter(x=>parseDate(x.date)>=new Date(new Date().setHours(0,0,0,0))).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);document.getElementById("upcomingExams").innerHTML=exams.length?exams.map(e=>`<div class="exam-mini"><div class="exam-date"><strong>${parseDate(e.date).getDate()}</strong><small>${parseDate(e.date).toLocaleDateString("pt-BR",{month:"short"})}</small></div><div class="exam-mini-info"><strong>${escapeHTML(e.subject)}</strong><small>Prova · ${e.difficulty}</small></div></div>`).join(""):`<div class="empty-state">Cadastre uma prova na aba Estudos para aparecer aqui.</div>`;
 document.getElementById("studyCount").textContent=db.studyDone?Object.keys(db.studyDone).filter(k=>k.endsWith("_"+today)).length:0;
}
function initHome(){
 setupCommon();renderHome();
 const modal=document.getElementById("modal");document.getElementById("addTaskBtn")?.addEventListener("click",()=>{document.getElementById("taskForm").reset();modal.classList.remove("hidden")});
 document.getElementById("taskForm")?.addEventListener("submit",e=>{e.preventDefault();const d=getDB();d.tasks.push({id:uid(),title:taskTitle.value,time:taskTime.value,priority:taskPriority.value,category:taskCategory.value,notes:taskNotes.value,date:todayKey(),done:false});saveDB(d);modal.classList.add("hidden");renderHome()});
 document.getElementById("clearDataBtn")?.addEventListener("click",()=>{if(confirm("Isso apagará tarefas, eventos, provas e projetos deste navegador. Continuar?")){localStorage.removeItem(DB_KEY);location.reload()}});
}
if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/"))initHome();
