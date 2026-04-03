const API_URL = "[localhost](http://localhost:3000/api/incidents)";

let editingId = null;

const form = document.getElementById("incidentForm");
const list = document.getElementById("incidentList");
const emptyMessage = document.getElementById("emptyMessage");

const titleInput = document.getElementById("titleInput");
const typeSelect = document.getElementById("typeSelect");
const dateInput = document.getElementById("dateInput");
const severityInput = document.getElementById("severityInput");

const titleError = document.getElementById("titleError");
const typeError = document.getElementById("typeError");
const dateError = document.getElementById("dateError");
const severityError = document.getElementById("severityError");

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const sortSelect = document.getElementById("sortSelect");

let state = { incidents: [] };

// ЗЧИТУВАННЯ ДАНИХ З ФОРМИ
function readForm() {
    return {
        title: titleInput.value.trim(),
        type: typeSelect.value,
        date: dateInput.value,
        severity: Number(severityInput.value),
        tags: [],
        comments: []
    };
}

// ОЧИЩЕННЯ ПОМИЛОК
function clearErrors() {
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
}

// ВАЛІДАЦІЯ ДАНИХ
function validateForm(data) {
    let valid = true;
    clearErrors();

    if (!data.title) {
        titleError.textContent = "Назва обов'язкова.";
        titleInput.classList.add("error");
        valid = false;
    }

    if (!data.type) {
        typeError.textContent = "Оберіть тип.";
        typeSelect.classList.add("error");
        valid = false;
    }

    if (!data.date) {
        dateError.textContent = "Оберіть дату.";
        dateInput.classList.add("error");
        valid = false;
    }

    if (!data.severity || data.severity < 1 || data.severity > 10) {
        severityError.textContent = "Від 1 до 10.";
        severityInput.classList.add("error");
        valid = false;
    }

    return valid;
}

// ЗАВАНТАЖЕННЯ ДАНИХ З БЕКЕНДУ
async function loadIncidents() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Помилка завантаження");
        state.incidents = await res.json();
        render();
    } catch (err) {
        console.error("Помилка при завантаженні:", err);
    }
}

// ДОДАВАННЯ НОВОГО ІНЦИДЕНТУ
async function addItem(data) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Помилка валідації:", error);
            return;
        }

        const savedItem = await res.json();
        state.incidents.push(savedItem);
        render();
    } catch (err) {
        console.error("Помилка при додаванні:", err);
    }
}

// ОНОВЛЕННЯ ІСНУЮЧОГО ІНЦИДЕНТУ
async function updateItem(id, data) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Помилка валідації:", error);
            return;
        }

        const updatedItem = await res.json();
        const idx = state.incidents.findIndex(inc => inc.id === Number(id));
        if (idx !== -1) state.incidents[idx] = updatedItem;

        editingId = null;
        document.querySelector(".btn-submit").textContent = "Додати інцидент";
        render();
    } catch (err) {
        console.error("Помилка при оновленні:", err);
    }
}

// ВИДАЛЕННЯ ІНЦИДЕНТУ
async function deleteItem(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) {
            console.error("Помилка при видаленні");
            return;
        }
        state.incidents = state.incidents.filter(inc => inc.id !== Number(id));
        render();
    } catch (err) {
        console.error("Помилка при видаленні:", err);
    }
}

// ОЧИЩЕННЯ ФОРМИ
function clearForm() {
    titleInput.value = "";
    typeSelect.selectedIndex = 0;
    dateInput.value = "";
    severityInput.value = "";
    clearErrors();
}

// ПОЧАТОК РЕДАГУВАННЯ ІНЦИДЕНТУ
function startEdit(id) {
    const item = state.incidents.find(inc => inc.id === Number(id));
    if (!item) return;

    titleInput.value = item.title;
    typeSelect.value = item.type;
    dateInput.value = item.date;
    severityInput.value = item.severity;

    editingId = id;
    document.querySelector(".btn-submit").textContent = "Зберегти зміни";
}

// ВІДОБРАЖЕННЯ СПИСКУ ІНЦИДЕНТІВ
function render() {
    list.innerHTML = "";

    let items = [...state.incidents];

    // Фільтрація за назвою
    const query = searchInput.value.toLowerCase();
    if (query) {
        items = items.filter(inc => inc.title.toLowerCase().includes(query));
    }

    // Фільтрація за типом
    const typeValue = filterType.value;
    if (typeValue) {
        items = items.filter(inc => inc.type === typeValue);
    }

    // Сортування
    const sortValue = sortSelect.value;
    if (sortValue === "dateAsc") items.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortValue === "dateDesc") items.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortValue === "severityAsc") items.sort((a, b) => a.severity - b.severity);
    else if (sortValue === "severityDesc") items.sort((a, b) => b.severity - a.severity);

    // Повідомлення про відсутність
    if (items.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }
    emptyMessage.style.display = "none";

    // Відображення кожного інциденту
    items.forEach(inc => {
        const li = document.createElement("li");
        li.className = "list-item";

        li.innerHTML = `
            <div class="item-info">
                <strong>${inc.title}</strong><br>
                Тип: ${inc.type}<br>
                Дата: ${inc.date}<br>
                Критичність: ${inc.severity}
            </div>
            <div class="item-actions">
                <button class="edit-btn" data-id="${inc.id}">Редагувати</button>
                <button class="delete-btn" data-id="${inc.id}">Видалити</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ОБРОБКА КЛІКІВ НА СПИСОК
list.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit-btn")) {
        startEdit(id);
        return;
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteItem(Number(id));
    }
});

// ОБРОБКА ВІДПРАВКИ ФОРМИ
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = readForm();
    if (!validateForm(data)) return;

    if (editingId) {
        await updateItem(editingId, data);
    } else {
        await addItem(data);
    }

    clearForm();
});

// ДИНАМІЧНЕ ОНОВЛЕННЯ СПИСКУ
searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);

// ІНІЦІАЛІЗАЦІЯ
loadIncidents();
