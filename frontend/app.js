const state = {
    incidents: []
}

let editingId = null;

const form = document.getElementById("incidentForm")
const list = document.getElementById("incidentList")
const emptyMessage = document.getElementById("emptyMessage")

const titleInput = document.getElementById("titleInput")
const typeSelect = document.getElementById("typeSelect")
const dateInput = document.getElementById("dateInput")
const severityInput = document.getElementById("severityInput")
const urlInput = document.getElementById("urlInput")

const titleError = document.getElementById("titleError")
const typeError = document.getElementById("typeError")
const dateError = document.getElementById("dateError")
const severityError = document.getElementById("severityError")
const urlError = document.getElementById("urlError")

const searchInput = document.getElementById("searchInput")
const filterType = document.getElementById("filterType")
const sortSelect = document.getElementById("sortSelect")

// ЗЧИТУВАННЯ ДАНИХ З ФОРМИ
function readForm() {
    return {
        id: editingId? editingId : crypto.randomUUID(), // Генеруємо унікальний ID для нового інциденту
        title: titleInput.value.trim(), 
        type: typeSelect.value,
        date: dateInput.value,
        severity: severityInput.value,
        url: urlInput.value.trim()
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

    const sev = Number(data.severity);
    if (!data.severity || sev < 1 || sev > 10) {
        severityError.textContent = "Від 1 до 10.";
        severityInput.classList.add("error");
        valid = false;
    }

    if (data.url) {
        try {
            new URL(data.url);
        } catch {
            urlError.textContent = "Некоректний URL.";
            urlInput.classList.add("error");
            valid = false;
        }

    }

    return valid;
}

// ДОДАВАННЯ НОВОГО ІНЦИДЕНТУ
function addItem(data) {
    state.incidents.push(data);
    saveToStorage();
}

// ОНОВЛЕННЯ ІСНУЮЧОГО ІНЦИДЕНТУ
function updateItem(id, data) {
    const idx = state.incidents.findIndex(inc => inc.id === id); // Знаходимо індекс інциденту за ID
    if (idx === -1) return;
    state.incidents[idx] = { ...state.incidents[idx], ...data }; // Оновлюємо дані інциденту, зберігаючи незмінні поля
    editingId = null;
    document.querySelector(".btn-submit").textContent = "Додати інцидент"; 
    saveToStorage();
}

// ОЧИЩЕННЯ ФОРМИ
function clearForm() {
    titleInput.value = "";
    typeSelect.selectedIndex = 0;
    dateInput.value = "";
    severityInput.value = "";
    urlInput.value = "";
}

// ПОЧАТОК РЕДАГУВАННЯ ІНЦИДЕНТУ
function startEdit(id) {
    const item = state.incidents.find(inc => inc.id === id);
    if (!item) return;

    // Заповнюємо форму даними інциденту для редагування
    titleInput.value = item.title;
    typeSelect.value = item.type;
    dateInput.value = item.date;
    severityInput.value = item.severity;
    urlInput.value = item.url;

    editingId = id; // Зберігаємо ID редагованого інциденту
    document.querySelector(".btn-submit").textContent = "Зберегти зміни";
}   

// ЗБЕРЕЖЕННЯ ДАНИХ В LOCAL STORAGE
function saveToStorage() {
    localStorage.setItem("incidents", JSON.stringify(state.incidents));
}

// ЗАВАНТАЖЕННЯ ДАНИХ З LOCAL STORAGE
function loadFromStorage() {
    const saved = localStorage.getItem("incidents"); 
    if (saved) {
        state.incidents = JSON.parse(saved);
    }
}


// ВІДОБРАЖЕННЯ СПИСКУ ІНЦИДЕНТІВ
function render() {
    list.innerHTML = "";

    let items = [...state.incidents];

    // ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ
    const query = searchInput.value.toLowerCase();
    if (query) {
        items = items.filter(inc => inc.title.toLowerCase().includes(query));
    }

    // ФІЛЬТРАЦІЯ ЗА ТИПОМ
    const typeValue = filterType.value;
    if (typeValue) {
        items = items.filter(inc => inc.type === typeValue);
    }

    // СОРТУВАННЯ
    const sortValue = sortSelect.value;
    if (sortValue === "dateAsc") items.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortValue === "dateDesc") items.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortValue === "severityAsc") items.sort((a, b) => Number(a.severity) - Number(b.severity));
    else if (sortValue === "severityDesc") items.sort((a, b) => Number(b.severity) - Number(a.severity));

    // ПОВІДОМЛЕННЯ ПРО ВІДСУТНІСТЬ ІНЦИДЕНТІВ
    if (items.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";
    
    // ВІДОБРАЖЕННЯ КОЖНОГО ІНЦИДЕНТУ
    items.forEach((inc, index) => {
        const li = document.createElement("li");
        li.className = "list-item";

        li.innerHTML = `
            <div>
                <strong>${inc.title}</strong><br>
                Тип: ${inc.type}<br>
                Дата: ${inc.date}<br>
                Критичність: ${inc.severity}<br>
                ${inc.url ? `<a href="${inc.url}" target="_blank">Посилання</a>` : ""}
            </div>
                <div class="item-actions">
                <button class="edit-btn" data-id="${inc.id}">Редагувати</button>
                <button class="delete-btn" data-id="${inc.id}">Видалити</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ОБРОБКА КЛІКІВ НА КНОПКИ РЕДАГУВАННЯ ТА ВИДАЛЕННЯ
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) { // Видалення
        const id = e.target.dataset.id;
        state.incidents = state.incidents.filter(inc => inc.id !== id);
        saveToStorage();
        render();
    }

    if (e.target.classList.contains("edit-btn")) { // Редагування
        const id = e.target.dataset.id;
        startEdit(id);
    }
});

// ОБРОБКА ВІДПРАВКИ ФОРМИ
form.addEventListener("submit", event => {
    event.preventDefault();
    
    const data = readForm();

    if (!validateForm(data)) return;
    if (editingId) {
        updateItem(editingId, data);
    } else {
        addItem(data);
    }

    clearForm();
    render();
});

// ІНІЦІАЛІЗАЦІЯ
loadFromStorage();
render();
// ДИНАМІЧНЕ ОНОВЛЕННЯ СПИСКУ
searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);