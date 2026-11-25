// ===== Дані (ті самі, що й були) =====

const books = [
    { id: 1, title: "Кобзар", author: "Тарас Шевченко", year: 1840,
      genre: "Поезія", isbn: "978-966-01-0001-1", pages: 320, available: true },
    { id: 2, title: "Місто", author: "Валер'ян Підмогильний", year: 1928,
      genre: "Роман", isbn: "978-966-01-0002-2", pages: 280, available: false },
    { id: 3, title: "Тигролови", author: "Іван Багряний", year: 1944,
      genre: "Пригодницький роман", isbn: "978-966-01-0003-3", pages: 350, available: true },
    { id: 4, title: "Захар Беркут", author: "Іван Франко", year: 1883,
      genre: "Історична повість", isbn: "978-966-01-0004-4", pages: 210, available: true }
];

const readers = [
    { id: 1, fullName: "Шевченко Олена Петрівна", birthDate: "1995-03-12",
      phone: "+380501112233", email: "olena@example.com",
      address: "м. Київ, вул. Хрещатик, 1", ticket: "R-1001", regDate: "2021-09-01" },
    { id: 2, fullName: "Коваль Андрій Іванович", birthDate: "1988-07-25",
      phone: "+380672223344", email: "andrii@example.com",
      address: "м. Львів, вул. Свободи, 5", ticket: "R-1002", regDate: "2020-02-15" },
    { id: 3, fullName: "Мельник Ірина Сергіївна", birthDate: "2001-11-03",
      phone: "+380933334455", email: "iryna@example.com",
      address: "м. Одеса, вул. Дерибасівська, 10", ticket: "R-1003", regDate: "2023-05-20" }
];

const loans = [
    { id: 1, readerId: 1, bookId: 2, issueDate: "2024-05-01",
      dueDate: "2024-05-15", returnDate: null, status: "Активна" },
    { id: 2, readerId: 2, bookId: 1, issueDate: "2024-04-10",
      dueDate: "2024-04-24", returnDate: "2024-04-22", status: "Повернено" },
    { id: 3, readerId: 3, bookId: 3, issueDate: "2024-05-10",
      dueDate: "2024-05-24", returnDate: null, status: "Прострочена" }
];

// ===== Конфіг форми додавання (з минулої лаби) =====

const formConfigs = {
    books: {
        title: "Додати книгу",
        array: books,
        fields: [
            { name: "title",    label: "Назва",              type: "text" },
            { name: "author",   label: "Автор",              type: "text" },
            { name: "year",     label: "Рік видання",        type: "number" },
            { name: "genre",    label: "Жанр",               type: "text" },
            { name: "isbn",     label: "ISBN",               type: "text" },
            { name: "pages",    label: "Кількість сторінок", type: "number" },
            { name: "available",label: "У наявності",        type: "checkbox" }
        ]
    },
    readers: {
        title: "Додати читача",
        array: readers,
        fields: [
            { name: "fullName",  label: "ПІБ",              type: "text" },
            { name: "birthDate", label: "Дата народження",  type: "date" },
            { name: "phone",     label: "Телефон",          type: "tel" },
            { name: "email",     label: "Email",            type: "email" },
            { name: "address",   label: "Адреса",           type: "text" },
            { name: "ticket",    label: "Номер квитка",     type: "text" },
            { name: "regDate",   label: "Дата реєстрації",  type: "date" }
        ]
    },
    loans: {
        title: "Додати видачу",
        array: loans,
        fields: [
            { name: "readerId",   label: "Читач",                  type: "select-reader" },
            { name: "bookId",     label: "Книга",                  type: "select-book" },
            { name: "issueDate",  label: "Дата видачі",            type: "date" },
            { name: "dueDate",    label: "Дата повернення (план)", type: "date" },
            { name: "returnDate", label: "Дата повернення (факт)", type: "date", optional: true },
            { name: "status",     label: "Статус",                 type: "select-status" }
        ]
    }
};

// ===== Допоміжне =====

function findReaderById(id) {
    for (let i = 0; i < readers.length; i++) {
        if (readers[i].id === id) return readers[i];
    }
    return null;
}

function findBookById(id) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) return books[i];
    }
    return null;
}

function nextId(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id > max) max = arr[i].id;
    }
    return max + 1;
}

// Знайти індекс запису в масиві за id
function findIndexById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return i;
    }
    return -1;
}

// ===== Попап-помилка =====

function showAlert(text) {
    document.getElementById("alert-text").textContent = text;
    document.getElementById("alert-overlay").classList.add("active");
}

function closeAlert() {
    document.getElementById("alert-overlay").classList.remove("active");
}

// ===== Перевірка, чи запис використовується в іншій таблиці =====

function isUsedInOtherTable(entity, id) {
    // Книга використовується, якщо є видача з таким bookId
    if (entity === "books") {
        for (let i = 0; i < loans.length; i++) {
            if (loans[i].bookId === id) return true;
        }
    }
    // Читач використовується, якщо є видача з таким readerId
    if (entity === "readers") {
        for (let i = 0; i < loans.length; i++) {
            if (loans[i].readerId === id) return true;
        }
    }
    // Видачі ні від чого не залежать — їх можна видаляти вільно
    return false;
}

// ===== Створення звичайної комірки (без редагування) =====

function makeTextCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

// ===== Створення редагованої комірки =====
// entity - "books"/"readers"/"loans", id - id запису,
// field - назва поля в об'єкті, displayText - що показувати,
// type - "text"/"number"/"date"/"checkbox"

function makeEditableCell(entity, id, field, displayText, type) {
    const td = document.createElement("td");
    td.className = "editable";
    td.textContent = displayText;
    td.addEventListener("click", function () {
        startEdit(td, entity, id, field, type);
    });
    return td;
}

// ===== Комірка з хрестиком видалення =====

function makeDeleteCell(entity, id) {
    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "delete-x";
    btn.innerHTML = "&times;";
    btn.title = "Видалити";
    btn.addEventListener("click", function () {
        deleteRow(entity, id);
    });
    td.appendChild(btn);
    return td;
}

// ===== Видалення рядка =====

function deleteRow(entity, id) {
    // спочатку перевіряємо зв'язки
    if (isUsedInOtherTable(entity, id)) {
        let message = "";
        if (entity === "books") {
            message = "Ця книга використовується у таблиці «Видачі книг». " +
                      "Спочатку видаліть відповідні видачі.";
        } else if (entity === "readers") {
            message = "Цей читач має записи у таблиці «Видачі книг». " +
                      "Спочатку видаліть відповідні видачі.";
        }
        showAlert(message);
        return;
    }

    // підтвердження (просте, браузерне — ок для лаби)
    if (!confirm("Видалити цей запис?")) return;

    const config = formConfigs[entity];
    const index = findIndexById(config.array, id);
    if (index !== -1) {
        config.array.splice(index, 1);
    }

    renderAll();
}

// ===== Редагування комірки =====

function startEdit(td, entity, id, field, type) {
    // якщо вже відкрито редагування — не відкриваємо ще одне
    if (td.querySelector("input") || td.querySelector("select")) return;

    const config = formConfigs[entity];
    const index = findIndexById(config.array, id);
    if (index === -1) return;

    const record = config.array[index];
    const oldValue = record[field];

    // зберігаємо початковий текст, щоб відновити при скасуванні
    const oldText = td.textContent;
    td.innerHTML = "";

    let input;

    // для зв'язків (readerId/bookId) та статусу — робимо select
    if (field === "readerId") {
        input = document.createElement("select");
        input.className = "edit-select";
        for (let i = 0; i < readers.length; i++) {
            const opt = document.createElement("option");
            opt.value = readers[i].id;
            opt.textContent = readers[i].fullName;
            if (readers[i].id === oldValue) opt.selected = true;
            input.appendChild(opt);
        }
    } else if (field === "bookId") {
        input = document.createElement("select");
        input.className = "edit-select";
        for (let i = 0; i < books.length; i++) {
            const opt = document.createElement("option");
            opt.value = books[i].id;
            opt.textContent = books[i].title;
            if (books[i].id === oldValue) opt.selected = true;
            input.appendChild(opt);
        }
    } else if (field === "status") {
        input = document.createElement("select");
        input.className = "edit-select";
        const statuses = ["Активна", "Повернено", "Прострочена"];
        for (let i = 0; i < statuses.length; i++) {
            const opt = document.createElement("option");
            opt.value = statuses[i];
            opt.textContent = statuses[i];
            if (statuses[i] === oldValue) opt.selected = true;
            input.appendChild(opt);
        }
    } else if (type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = oldValue === true;
    } else {
        input = document.createElement("input");
        input.type = type || "text";
        input.value = oldValue === null ? "" : oldValue;
    }

    input.className = input.className || "edit-input";
    td.appendChild(input);
    input.focus();
    if (input.select) input.select();

    let finished = false;

    // збереження
    function save() {
        if (finished) return;
        finished = true;

        let newValue;
        if (type === "checkbox") {
            newValue = input.checked;
        } else if (type === "number") {
            newValue = input.value === "" ? 0 : Number(input.value);
        } else if (field === "readerId" || field === "bookId") {
            newValue = Number(input.value);
        } else {
            newValue = input.value === "" ? null : input.value;
        }

        record[field] = newValue;
        renderAll();
    }

    // скасування
    function cancel() {
        if (finished) return;
        finished = true;
        td.textContent = oldText;
    }

    // Enter — зберегти, Escape — скасувати
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            save();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
        }
    });

    // blur — зберегти (клік в іншому місці)
    input.addEventListener("blur", function () {
        // невелика затримка, щоб Enter встиг спрацювати
        setTimeout(function () {
            if (!finished) save();
        }, 100);
    });
}

// ===== Рендер таблиць =====

function renderBooks() {
    const tbody = document.getElementById("books-body");
    tbody.innerHTML = "";

    for (let i = 0; i < books.length; i++) {
        const b = books[i];
        const tr = document.createElement("tr");

        tr.appendChild(makeTextCell(b.id));
        tr.appendChild(makeEditableCell("books", b.id, "title", b.title, "text"));
        tr.appendChild(makeEditableCell("books", b.id, "author", b.author, "text"));
        tr.appendChild(makeEditableCell("books", b.id, "year", b.year, "number"));
        tr.appendChild(makeEditableCell("books", b.id, "genre", b.genre, "text"));
        tr.appendChild(makeEditableCell("books", b.id, "isbn", b.isbn, "text"));
        tr.appendChild(makeEditableCell("books", b.id, "pages", b.pages, "number"));
        tr.appendChild(makeEditableCell("books", b.id, "available", b.available ? "Так" : "Ні", "checkbox"));
        tr.appendChild(makeDeleteCell("books", b.id));

        tbody.appendChild(tr);
    }
}

function renderReaders() {
    const tbody = document.getElementById("readers-body");
    tbody.innerHTML = "";

    for (let i = 0; i < readers.length; i++) {
        const r = readers[i];
        const tr = document.createElement("tr");

        tr.appendChild(makeTextCell(r.id));
        tr.appendChild(makeEditableCell("readers", r.id, "fullName", r.fullName, "text"));
        tr.appendChild(makeEditableCell("readers", r.id, "birthDate", r.birthDate, "date"));
        tr.appendChild(makeEditableCell("readers", r.id, "phone", r.phone, "text"));
        tr.appendChild(makeEditableCell("readers", r.id, "email", r.email, "email"));
        tr.appendChild(makeEditableCell("readers", r.id, "address", r.address, "text"));
        tr.appendChild(makeEditableCell("readers", r.id, "ticket", r.ticket, "text"));
        tr.appendChild(makeEditableCell("readers", r.id, "regDate", r.regDate, "date"));
        tr.appendChild(makeDeleteCell("readers", r.id));

        tbody.appendChild(tr);
    }
}

function renderLoans() {
    const tbody = document.getElementById("loans-body");
    tbody.innerHTML = "";

    for (let i = 0; i < loans.length; i++) {
        const l = loans[i];
        const reader = findReaderById(l.readerId);
        const book = findBookById(l.bookId);
        const tr = document.createElement("tr");

        tr.appendChild(makeTextCell(l.id));

        // Читач і книга редагуються через select — показуємо ім'я/назву
        tr.appendChild(makeEditableCell(
            "loans", l.id, "readerId",
            reader ? reader.fullName : "—",
            "text"
        ));
        tr.appendChild(makeEditableCell(
            "loans", l.id, "bookId",
            book ? book.title : "—",
            "text"
        ));

        tr.appendChild(makeEditableCell("loans", l.id, "issueDate", l.issueDate, "date"));
        tr.appendChild(makeEditableCell("loans", l.id, "dueDate", l.dueDate, "date"));
        tr.appendChild(makeEditableCell(
            "loans", l.id, "returnDate",
            l.returnDate ? l.returnDate : "—",
            "date"
        ));
        tr.appendChild(makeEditableCell("loans", l.id, "status", l.status, "text"));
        tr.appendChild(makeDeleteCell("loans", l.id));

        tbody.appendChild(tr);
    }
}

function renderAll() {
    renderBooks();
    renderReaders();
    renderLoans();
}

// ===== Таби =====

function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            const target = this.getAttribute("data-tab");
            for (let j = 0; j < buttons.length; j++) buttons[j].classList.remove("active");
            for (let j = 0; j < contents.length; j++) contents[j].classList.remove("active");
            this.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    }
}

// ===== Форма додавання (з минулої лаби) =====

function buildField(fieldDef) {
    const row = document.createElement("div");
    row.className = "form-row";

    const label = document.createElement("label");
    label.textContent = fieldDef.label;
    label.setAttribute("for", "f-" + fieldDef.name);
    row.appendChild(label);

    let input;

    if (fieldDef.type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.id = "f-" + fieldDef.name;
        input.name = fieldDef.name;
    } else if (fieldDef.type === "select-reader") {
        input = document.createElement("select");
        input.id = "f-" + fieldDef.name;
        input.name = fieldDef.name;
        input.required = true;
        for (let i = 0; i < readers.length; i++) {
            const opt = document.createElement("option");
            opt.value = readers[i].id;
            opt.textContent = readers[i].fullName;
            input.appendChild(opt);
        }
    } else if (fieldDef.type === "select-book") {
        input = document.createElement("select");
        input.id = "f-" + fieldDef.name;
        input.name = fieldDef.name;
        input.required = true;
        for (let i = 0; i < books.length; i++) {
            const opt = document.createElement("option");
            opt.value = books[i].id;
            opt.textContent = books[i].title;
            input.appendChild(opt);
        }
    } else if (fieldDef.type === "select-status") {
        input = document.createElement("select");
        input.id = "f-" + fieldDef.name;
        input.name = fieldDef.name;
        const statuses = ["Активна", "Повернено", "Прострочена"];
        for (let i = 0; i < statuses.length; i++) {
            const opt = document.createElement("option");
            opt.value = statuses[i];
            opt.textContent = statuses[i];
            input.appendChild(opt);
        }
    } else {
        input = document.createElement("input");
        input.type = fieldDef.type;
        input.id = "f-" + fieldDef.name;
        input.name = fieldDef.name;
        if (!fieldDef.optional) input.required = true;
    }

    row.appendChild(input);
    return row;
}

let currentEntity = null;

function openModal(entity) {
    currentEntity = entity;
    const config = formConfigs[entity];
    document.getElementById("modal-title").textContent = config.title;

    const fieldsContainer = document.getElementById("form-fields");
    fieldsContainer.innerHTML = "";
    for (let i = 0; i < config.fields.length; i++) {
        fieldsContainer.appendChild(buildField(config.fields[i]));
    }

    document.getElementById("modal-overlay").classList.add("active");
}

function closeModal() {
    document.getElementById("modal-overlay").classList.remove("active");
    document.getElementById("add-form").reset();
    document.getElementById("form-fields").innerHTML = "";
    currentEntity = null;
}

function readFieldValue(fieldDef) {
    const el = document.getElementById("f-" + fieldDef.name);
    if (!el) return null;
    if (fieldDef.type === "checkbox") return el.checked;
    if (fieldDef.type === "number") return el.value === "" ? 0 : Number(el.value);
    if (fieldDef.type === "select-reader" || fieldDef.type === "select-book") {
        return Number(el.value);
    }
    return el.value === "" ? null : el.value;
}

function handleSubmit(event) {
    event.preventDefault();
    if (!currentEntity) return;

    const config = formConfigs[currentEntity];
    const newItem = { id: nextId(config.array) };

    for (let i = 0; i < config.fields.length; i++) {
        const f = config.fields[i];
        newItem[f.name] = readFieldValue(f);
    }

    config.array.push(newItem);
    renderAll();
    closeModal();
}

// ===== Ініціалізація =====

function init() {
    renderAll();
    initTabs();

    const addButtons = document.querySelectorAll(".add-btn");
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener("click", function () {
            openModal(this.getAttribute("data-entity"));
        });
    }

    // модалка додавання
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("btn-cancel").addEventListener("click", closeModal);
    document.getElementById("modal-overlay").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });
    document.getElementById("add-form").addEventListener("submit", handleSubmit);

    // попап-помилка
    document.getElementById("alert-close").addEventListener("click", closeAlert);
    document.getElementById("alert-ok").addEventListener("click", closeAlert);
    document.getElementById("alert-overlay").addEventListener("click", function (e) {
        if (e.target === this) closeAlert();
    });
}

init();