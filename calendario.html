import { auth, db } from "./firebase-init.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const grid = document.getElementById("calendarGrid");
const title = document.getElementById("monthTitle");
const selectedTitle = document.getElementById("selectedDateTitle");
const selectedBox = document.getElementById("selectedEvents");
const empty = document.getElementById("emptySelected");
const modal = document.getElementById("modal");
const form = document.getElementById("eventForm");

let user = null;
let current = new Date();
let selected = iso(new Date());

let calendarItems = [];


const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


function iso(date) {

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

}


function br(date) {

    const [year, month, day] =
        date.split("-");

    return `${day}/${month}/${year}`;

}


function esc(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*
=================================
CARREGAR TUDO
=================================
*/

async function load() {

    try {

        const base =
            ["users", user.uid];


        const [
            eventSnapshot,
            taskSnapshot,
            examSnapshot,
            studySnapshot,
            projectSnapshot
        ] = await Promise.all([

            getDocs(
                collection(
                    db,
                    ...base,
                    "events"
                )
            ),

            getDocs(
                collection(
                    db,
                    ...base,
                    "tasks"
                )
            ),

            getDocs(
                collection(
                    db,
                    ...base,
                    "exams"
                )
            ),

            getDocs(
                collection(
                    db,
                    ...base,
                    "studySessions"
                )
            ),

            getDocs(
                collection(
                    db,
                    ...base,
                    "projects"
                )
            )

        ]);


        calendarItems = [];


        /*
        EVENTOS
        */

        eventSnapshot.forEach(snapshot => {

            const item = snapshot.data();

            calendarItems.push({

                id: snapshot.id,

                type: "event",

                date: item.date,

                time: item.time || "",

                title: item.title,

                category:
                    item.category || "Outro",

                notes:
                    item.notes || ""

            });

        });


        /*
        TAREFAS
        */

        taskSnapshot.forEach(snapshot => {

            const item = snapshot.data();

            calendarItems.push({

                id: snapshot.id,

                type: "task",

                date: item.date,

                time: item.time || "",

                title: item.title,

                category:
                    item.category || "Outro",

                done:
                    item.done || false

            });

        });


        /*
        PROVAS
        */

        examSnapshot.forEach(snapshot => {

            const item = snapshot.data();

            calendarItems.push({

                id: snapshot.id,

                type: "exam",

                date: item.date,

                time: "",

                title:
                    `Prova — ${item.subject}`,

                category:
                    "Faculdade",

                notes:
                    item.topics || ""

            });

        });


        /*
        SESSÕES DE ESTUDO
        */

        studySnapshot.forEach(snapshot => {

            const item = snapshot.data();

            calendarItems.push({

                id: snapshot.id,

                type: "study",

                date: item.date,

                time:
                    item.time || "",

                title:
                    item.subject,

                category:
                    "Estudo",

                phase:
                    item.phase || "",

                topic:
                    item.topic || "",

                done:
                    item.done || false

            });

        });


        /*
        PROJETOS COM PRAZO
        */

        projectSnapshot.forEach(snapshot => {

            const item = snapshot.data();

            if (!item.deadline) {
                return;
            }

            calendarItems.push({

                id: snapshot.id,

                type: "project",

                date:
                    item.deadline,

                time: "",

                title:
                    item.name,

                category:
                    "Projeto",

                notes:
                    item.description || ""

            });

        });


        /*
        Ordenação local.

        Assim não precisamos criar
        índice composto só para
        mostrar o calendário.
        */

        calendarItems.sort(
            (a, b) => {

                const dateCompare =
                    (a.date || "")
                    .localeCompare(
                        b.date || ""
                    );

                if (dateCompare !== 0) {
                    return dateCompare;
                }

                return (
                    a.time || ""
                ).localeCompare(
                    b.time || ""
                );

            }
        );


        render();

        renderSelected();


    } catch (error) {

        console.error(
            "Erro ao carregar calendário:",
            error
        );

    }

}


/*
=================================
CONFIGURAÇÃO DOS TIPOS
=================================
*/

function itemConfig(type) {

    const configs = {

        event: {
            icon: "📅",
            label: "Compromisso"
        },

        task: {
            icon: "✓",
            label: "Tarefa"
        },

        exam: {
            icon: "📝",
            label: "Prova"
        },

        study: {
            icon: "📚",
            label: "Estudo"
        },

        project: {
            icon: "💼",
            label: "Prazo de projeto"
        }

    };


    return (
        configs[type] ||
        {
            icon: "•",
            label: "Item"
        }
    );

}


/*
=================================
DESENHAR CALENDÁRIO
=================================
*/

function render() {

    const year =
        current.getFullYear();

    const month =
        current.getMonth();


    const first =
        new Date(
            year,
            month,
            1
        ).getDay();


    const last =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const prev =
        new Date(
            year,
            month,
            0
        ).getDate();


    title.textContent =
        `${months[month]} ${year}`;


    grid.innerHTML = "";


    /*
    Dias do mês anterior
    */

    for (
        let i = first - 1;
        i >= 0;
        i--
    ) {

        cell(
            new Date(
                year,
                month - 1,
                prev - i
            ),
            true
        );

    }


    /*
    Mês atual
    */

    for (
        let day = 1;
        day <= last;
        day++
    ) {

        cell(
            new Date(
                year,
                month,
                day
            ),
            false
        );

    }


    /*
    Próximo mês
    */

    const total =
        first + last;


    const remaining =
        total % 7
            ? 7 - (total % 7)
            : 0;


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        cell(
            new Date(
                year,
                month + 1,
                day
            ),
            true
        );

    }

}


/*
=================================
CÉLULA
=================================
*/

function cell(date, muted) {

    const key =
        iso(date);


    const element =
        document.createElement("div");


    element.className =
        `calendar-cell${
            muted
                ? " muted"
                : ""
        }${
            key === selected
                ? " selected"
                : ""
        }`;


    const today =
        iso(new Date());


    element.innerHTML = `

        <div class="day-number">

            ${
                key === today

                ? `
                    <span class="today-dot">
                        ${date.getDate()}
                    </span>
                `

                : date.getDate()
            }

        </div>

    `;


    const items =
        calendarItems.filter(
            item =>
                item.date === key
        );


    /*
    Mostrar até 4 itens
    dentro do quadrinho.
    */

    items
        .slice(0, 4)
        .forEach(item => {

            const config =
                itemConfig(
                    item.type
                );


            const line =
                document.createElement(
                    "span"
                );


            line.className =
                `event-dot calendar-${item.type}`;


            line.textContent =
                `${config.icon} ${
                    item.time
                        ? item.time + " "
                        : ""
                }${item.title}`;


            element.appendChild(
                line
            );

        });


    if (items.length > 4) {

        const more =
            document.createElement(
                "span"
            );


        more.className =
            "event-dot";


        more.textContent =
            `+ ${items.length - 4} item(ns)`;


        element.appendChild(
            more
        );

    }


    element.onclick = () => {

        selected = key;


        const eventDate =
            document.getElementById(
                "eventDate"
            );


        if (eventDate) {
            eventDate.value =
                selected;
        }


        render();

        renderSelected();

    };


    grid.appendChild(
        element
    );

}


/*
=================================
DIA SELECIONADO
=================================
*/

function renderSelected() {

    selectedTitle.textContent =
        br(selected);


    selectedBox.innerHTML = "";


    const items =
        calendarItems

            .filter(
                item =>
                    item.date === selected
            )

            .sort(
                (a, b) =>
                    (
                        a.time || ""
                    ).localeCompare(
                        b.time || ""
                    )
            );


    empty.style.display =
        items.length
            ? "none"
            : "block";


    items.forEach(item => {

        const config =
            itemConfig(
                item.type
            );


        const element =
            document.createElement(
                "div"
            );


        element.className =
            `event-item calendar-item-${item.type}`;


        let extra = "";


        if (
            item.type === "study"
        ) {

            extra = `

                <div class="task-meta">

                    ${esc(
                        item.phase || ""
                    )}

                    ${
                        item.topic
                            ? " — " +
                              esc(item.topic)
                            : ""
                    }

                </div>

            `;

        }


        if (
            item.notes
        ) {

            extra += `

                <div class="task-meta">

                    ${esc(
                        item.notes
                    )}

                </div>

            `;

        }


        element.innerHTML = `

            <div class="event-time">

                ${config.icon}

                ${config.label}

                ${
                    item.time
                        ? " • " +
                          esc(item.time)
                        : ""
                }

            </div>


            <div class="event-title">

                ${
                    item.done
                        ? "✓ "
                        : ""
                }

                ${esc(item.title)}

            </div>


            ${extra}

        `;


        /*
        Só compromissos criados
        na página Calendário
        terão botão excluir aqui.
        */

        if (
            item.type === "event"
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "delete-btn";


            button.textContent =
                "Excluir";


            button.onclick =
                async () => {

                    if (
                        !confirm(
                            "Excluir este compromisso?"
                        )
                    ) {
                        return;
                    }


                    await deleteDoc(

                        doc(
                            db,
                            "users",
                            user.uid,
                            "events",
                            item.id
                        )

                    );


                    await load();

                };


            element.appendChild(
                button
            );

        }


        selectedBox.appendChild(
            element
        );

    });

}


/*
=================================
NAVEGAÇÃO
=================================
*/

document
    .getElementById(
        "prevMonth"
    )
    ?.addEventListener(
        "click",
        () => {

            current.setMonth(
                current.getMonth() - 1
            );

            render();

        }
    );


document
    .getElementById(
        "nextMonth"
    )
    ?.addEventListener(
        "click",
        () => {

            current.setMonth(
                current.getMonth() + 1
            );

            render();

        }
    );


document
    .getElementById(
        "goToday"
    )
    ?.addEventListener(
        "click",
        () => {

            current =
                new Date();

            selected =
                iso(new Date());

            render();

            renderSelected();

        }
    );


document
    .getElementById(
        "addEventBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            const eventDate =
                document.getElementById(
                    "eventDate"
                );


            eventDate.value =
                selected;


            modal.classList.remove(
                "hidden"
            );

        }
    );


/*
=================================
CRIAR COMPROMISSO
=================================
*/

form?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const data = {

            title:
                document
                    .getElementById(
                        "eventTitle"
                    )
                    .value
                    .trim(),

            date:
                document
                    .getElementById(
                        "eventDate"
                    )
                    .value,

            time:
                document
                    .getElementById(
                        "eventTime"
                    )
                    .value || "",

            category:
                document
                    .getElementById(
                        "eventCategory"
                    )
                    .value,

            notes:
                document
                    .getElementById(
                        "eventNotes"
                    )
                    .value
                    .trim(),

            createdAt:
                serverTimestamp()

        };


        if (
            !data.title ||
            !data.date
        ) {
            return;
        }


        await addDoc(

            collection(
                db,
                "users",
                user.uid,
                "events"
            ),

            data

        );


        selected =
            data.date;


        form.reset();


        modal.classList.add(
            "hidden"
        );


        await load();

    }
);


/*
=================================
LOGIN
=================================
*/

onAuthStateChanged(
    auth,
    currentUser => {

        if (!currentUser) {
            return;
        }


        user =
            currentUser;


        const dateInput =
            document.getElementById(
                "eventDate"
            );


        if (dateInput) {
            dateInput.value =
                selected;
        }


        load();

    }
);
