import { auth, db } from "./firebase-init.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


let currentUser = null;


/* =========================================
   FUNÇÕES GERAIS
========================================= */

export const getCurrentUser = () => currentUser;


export function localDateString(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


export function formatDateBR(dateString) {

    if (!dateString) {
        return "";
    }

    const [
        year,
        month,
        day
    ] = dateString.split("-");

    return `${day}/${month}/${year}`;
}


export function escapeHTML(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   TEMA
========================================= */

function setupTheme() {

    if (
        localStorage.getItem(
            "organizador-theme"
        ) === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    document
        .getElementById("themeBtn")
        ?.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );


                localStorage.setItem(

                    "organizador-theme",

                    document.body.classList.contains(
                        "dark"
                    )
                        ? "dark"
                        : "light"

                );

            }
        );

}


/* =========================================
   MENU MOBILE
========================================= */

function setupMenu() {

    document
        .getElementById("mobileMenu")
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector(".sidebar")
                    ?.classList.toggle(
                        "open"
                    );

            }
        );

}


/* =========================================
   MODAIS
========================================= */

function setupModals() {

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    button
                        .closest(".modal")
                        ?.classList.add(
                            "hidden"
                        );

                };

            }
        );


    document
        .querySelectorAll(".modal")
        .forEach(
            modal => {

                modal.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target === modal
                        ) {

                            modal.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    document
        .getElementById("logoutBtn")
        ?.addEventListener(
            "click",
            async () => {

                await signOut(auth);

                location.href =
                    "login.html";

            }
        );

}


/* =========================================
   CARREGAR HOME
========================================= */

async function loadHome(user) {

    const taskList =
        document.getElementById(
            "taskList"
        );


    if (!taskList) {
        return;
    }


    const today =
        localDateString();


    try {

        /*
        =====================================
        BUSCAR DADOS

        Sem query(), where() ou orderBy().
        Assim não precisa de índice composto.
        =====================================
        */

        const [
            taskSnapshot,
            eventSnapshot,
            examSnapshot
        ] = await Promise.all([

            getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "tasks"
                )
            ),

            getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "events"
                )
            ),

            getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "exams"
                )
            )

        ]);


        /* =====================================
           TAREFAS DE HOJE
        ===================================== */

        const tasks =
            taskSnapshot.docs

                .map(
                    snapshot => ({
                        id: snapshot.id,
                        ...snapshot.data()
                    })
                )

                .filter(
                    task =>
                        task.date === today
                )

                .sort(
                    (a, b) =>
                        (
                            a.time || ""
                        ).localeCompare(
                            b.time || ""
                        )
                );


        /* =====================================
           EVENTOS DE HOJE
        ===================================== */

        const events =
            eventSnapshot.docs

                .map(
                    snapshot => ({
                        id: snapshot.id,
                        ...snapshot.data()
                    })
                )

                .filter(
                    event =>
                        event.date === today
                )

                .sort(
                    (a, b) =>
                        (
                            a.time || ""
                        ).localeCompare(
                            b.time || ""
                        )
                );


        /* =====================================
           PRÓXIMAS PROVAS
        ===================================== */

        const exams =
            examSnapshot.docs

                .map(
                    snapshot => ({
                        id: snapshot.id,
                        ...snapshot.data()
                    })
                )

                .filter(
                    exam =>
                        exam.date &&
                        exam.date >= today
                )

                .sort(
                    (a, b) =>
                        a.date.localeCompare(
                            b.date
                        )
                );


        /* =====================================
           MOSTRAR TAREFAS
        ===================================== */

        taskList.innerHTML =
            tasks
                .map(
                    task => `

                        <div class="task-item">

                            <input
                                class="task-check"
                                data-task-id="${task.id}"
                                type="checkbox"
                                ${
                                    task.done
                                        ? "checked"
                                        : ""
                                }
                            >


                            <div class="task-info">

                                <div
                                    class="task-title ${
                                        task.done
                                            ? "done"
                                            : ""
                                    }"
                                >

                                    ${
                                        escapeHTML(
                                            task.title
                                        )
                                    }

                                </div>


                                <div class="task-meta">

                                    ${
                                        escapeHTML(
                                            task.time ||
                                            "Sem horário"
                                        )
                                    }

                                    •

                                    ${
                                        escapeHTML(
                                            task.category ||
                                            "Outro"
                                        )
                                    }

                                </div>

                            </div>


                            <span
                                class="priority ${
                                    escapeHTML(
                                        task.priority ||
                                        "media"
                                    )
                                }"
                            >

                                ${
                                    escapeHTML(
                                        task.priority ||
                                        "media"
                                    )
                                }

                            </span>


                            <button
                                class="delete-btn"
                                data-delete-task="${task.id}"
                            >

                                ×

                            </button>

                        </div>

                    `
                )
                .join("");


        const emptyTasks =
            document.getElementById(
                "emptyTasks"
            );


        if (emptyTasks) {

            emptyTasks.style.display =
                tasks.length
                    ? "none"
                    : "block";

        }


        /* =====================================
           MOSTRAR EVENTOS
        ===================================== */

        const eventBox =
            document.getElementById(
                "todayEvents"
            );


        if (eventBox) {

            eventBox.innerHTML =
                events
                    .map(
                        event => `

                            <div class="event-item">

                                <div class="event-time">

                                    📅

                                    ${
                                        escapeHTML(
                                            event.time ||
                                            "Sem horário"
                                        )
                                    }

                                    •

                                    ${
                                        escapeHTML(
                                            event.category ||
                                            "Outro"
                                        )
                                    }

                                </div>


                                <div class="event-title">

                                    ${
                                        escapeHTML(
                                            event.title
                                        )
                                    }

                                </div>

                            </div>

                        `
                    )
                    .join("");

        }


        const emptyEvents =
            document.getElementById(
                "emptyEvents"
            );


        if (emptyEvents) {

            emptyEvents.style.display =
                events.length
                    ? "none"
                    : "block";

        }


        /* =====================================
           MOSTRAR PRÓXIMAS PROVAS
        ===================================== */

        const upcomingExams =
            document.getElementById(
                "upcomingExams"
            );


        if (upcomingExams) {

            if (
                exams.length === 0
            ) {

                upcomingExams.innerHTML = `

                    <div class="empty-state">

                        Nenhuma prova futura
                        cadastrada. 📚

                    </div>

                `;

            }

            else {

                upcomingExams.innerHTML =
                    exams
                        .slice(0, 5)
                        .map(
                            exam => {

                                const [
                                    year,
                                    month,
                                    day
                                ] =
                                    exam.date.split(
                                        "-"
                                    );


                                const examDate =
                                    new Date(

                                        Number(year),

                                        Number(month) - 1,

                                        Number(day)

                                    );


                                const monthName =
                                    examDate
                                        .toLocaleDateString(
                                            "pt-BR",
                                            {
                                                month:
                                                    "short"
                                            }
                                        );


                                let difficulty =
                                    "Média";


                                if (
                                    exam.difficulty ===
                                    "dificil"
                                ) {

                                    difficulty =
                                        "Difícil";

                                }


                                if (
                                    exam.difficulty ===
                                    "facil"
                                ) {

                                    difficulty =
                                        "Tranquila";

                                }


                                return `

                                    <div class="exam-mini">

                                        <div class="exam-date">

                                            <strong>
                                                ${day}
                                            </strong>

                                            <small>
                                                ${monthName}
                                            </small>

                                        </div>


                                        <div class="exam-mini-info">

                                            <strong>

                                                📝 ${
                                                    escapeHTML(
                                                        exam.subject ||
                                                        "Prova"
                                                    )
                                                }

                                            </strong>


                                            <small>

                                                ${difficulty}

                                                •

                                                ${
                                                    formatDateBR(
                                                        exam.date
                                                    )
                                                }

                                            </small>

                                        </div>

                                    </div>

                                `;

                            }
                        )
                        .join("");

            }

        }


        /* =====================================
           ESTATÍSTICAS
        ===================================== */

        const done =
            tasks.filter(
                task =>
                    task.done
            ).length;


        const percentage =
            tasks.length

                ? Math.round(
                    done /
                    tasks.length *
                    100
                )

                : 0;


        const totalTasks =
            document.getElementById(
                "totalTasks"
            );


        const doneTasks =
            document.getElementById(
                "doneTasks"
            );


        const eventCount =
            document.getElementById(
                "eventCount"
            );


        const progressValue =
            document.getElementById(
                "progressValue"
            );


        if (totalTasks) {

            totalTasks.textContent =
                tasks.length;

        }


        if (doneTasks) {

            doneTasks.textContent =
                done;

        }


        if (eventCount) {

            eventCount.textContent =
                events.length;

        }


        if (progressValue) {

            progressValue.textContent =
                percentage + "%";

        }


        /* =====================================
           MARCAR TAREFA COMO CONCLUÍDA
        ===================================== */

        document
            .querySelectorAll(
                "[data-task-id]"
            )
            .forEach(
                checkbox => {

                    checkbox.onchange =
                        async () => {

                            try {

                                await updateDoc(

                                    doc(
                                        db,
                                        "users",
                                        user.uid,
                                        "tasks",
                                        checkbox.dataset
                                            .taskId
                                    ),

                                    {

                                        done:
                                            checkbox.checked,

                                        updatedAt:
                                            serverTimestamp()

                                    }

                                );


                                await loadHome(
                                    user
                                );


                            } catch (error) {

                                console.error(
                                    "Erro ao atualizar tarefa:",
                                    error
                                );

                            }

                        };

                }
            );


        /* =====================================
           EXCLUIR TAREFA
        ===================================== */

        document
            .querySelectorAll(
                "[data-delete-task]"
            )
            .forEach(
                button => {

                    button.onclick =
                        async () => {

                            try {

                                await deleteDoc(

                                    doc(
                                        db,
                                        "users",
                                        user.uid,
                                        "tasks",
                                        button.dataset
                                            .deleteTask
                                    )

                                );


                                await loadHome(
                                    user
                                );


                            } catch (error) {

                                console.error(
                                    "Erro ao excluir tarefa:",
                                    error
                                );

                            }

                        };

                }
            );


    } catch (error) {

        console.error(
            "Erro ao carregar a página inicial:",
            error
        );

    }

}


/* =========================================
   CRIAR NOVA TAREFA
========================================= */

function setupHomeForm(user) {

    const modal =
        document.getElementById(
            "modal"
        );


    const form =
        document.getElementById(
            "taskForm"
        );


    const addButton =
        document.getElementById(
            "addTaskBtn"
        );


    if (
        !modal ||
        !form ||
        !addButton
    ) {

        return;

    }


    addButton.addEventListener(
        "click",
        () => {

            form.reset();

            modal.classList.remove(
                "hidden"
            );

        }
    );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const title =
                document
                    .getElementById(
                        "taskTitle"
                    )
                    .value
                    .trim();


            if (!title) {

                return;

            }


            try {

                await addDoc(

                    collection(
                        db,
                        "users",
                        user.uid,
                        "tasks"
                    ),

                    {

                        title:
                            title,

                        date:
                            localDateString(),

                        time:
                            document
                                .getElementById(
                                    "taskTime"
                                )
                                .value || "",

                        priority:
                            document
                                .getElementById(
                                    "taskPriority"
                                )
                                .value,

                        category:
                            document
                                .getElementById(
                                    "taskCategory"
                                )
                                .value,

                        notes:
                            document
                                .getElementById(
                                    "taskNotes"
                                )
                                .value
                                .trim(),

                        done:
                            false,

                        createdAt:
                            serverTimestamp()

                    }

                );


                form.reset();


                modal.classList.add(
                    "hidden"
                );


                await loadHome(
                    user
                );


            } catch (error) {

                console.error(
                    "Erro ao criar tarefa:",
                    error
                );


                alert(
                    "Não foi possível salvar a tarefa."
                );

            }

        }
    );

}


/* =========================================
   AUTENTICAÇÃO
========================================= */

onAuthStateChanged(

    auth,

    async user => {

        if (!user) {

            currentUser =
                null;


            if (
                !location.pathname.endsWith(
                    "login.html"
                )
            ) {

                location.href =
                    "login.html";

            }


            return;

        }


        currentUser =
            user;


        const email =
            document.getElementById(
                "userEmail"
            );


        if (email) {

            email.textContent =
                user.email || "";

        }


        setupTheme();

        setupMenu();

        setupModals();

        setupLogout();


        if (
            location.pathname.endsWith(
                "index.html"
            ) ||
            location.pathname.endsWith(
                "/"
            )
        ) {

            setupHomeForm(
                user
            );


            await loadHome(
                user
            );

        }

    }

);
