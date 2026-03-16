const API_URL = "http://localhost:3000/api/incidents"; // Базовий URL бекендy

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

let state = { incidents: [] }; // Локальний стан для зберігання списку інцидентів, який буде використовуватися для відображення та маніпуляції даними на клієнтській стороні, дозволяючи зберігати отримані з бекенду інциденти та оновлювати їх при додаванні, редагуванні або видаленні інцидентів, а також для фільтрації та сортування списку інцидентів перед відображенням на сторінці

// ЗЧИТУВАННЯ ДАНИХ З ФОРМИ
function readForm() {
    return {
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
async function addItem(data) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
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
        const res = await fetch(`${API_URL}/${id}`, { // Виконуємо PUT-запит на бекенд для оновлення інцидента з вказаним ID, передаючи нові дані інцидента у форматі JSON в тілі запиту, і отримуємо оновлений об'єкт інцидента у відповіді
            method: "PUT",
            headers: { "Content-Type": "application/json" }, // Вказуємо, що тіло запиту містить дані у форматі JSON
            body: JSON.stringify(data) // Перетворюємо об'єкт data у JSON-рядок для відправки на сервер
        });
        const updatedItem = await res.json();
        const idx = state.incidents.findIndex(inc => inc.id === Number(id)); // Знаходимо індекс оновленого інцидента в локальному стані за його ID, щоб замінити його на оновлений об'єкт, отриманий з відповіді сервера
        if (idx !== -1) state.incidents[idx] = updatedItem;
        editingId = null;
        document.querySelector(".btn-submit").textContent = "Додати інцидент"; // Після оновлення інцидента скидаємо режим редагування, встановлюючи editingId в null, і змінюємо текст кнопки на "Додати інцидент", щоб користувач розумів, що тепер він може додавати нові інциденти замість редагування існуючих
        render();
    } catch (err) {
        console.error("Помилка при оновленні:", err); // Якщо під час оновлення інцидента виникла помилка, вона буде перехоплена в цьому блоці catch, і ми виведемо повідомлення про помилку в консоль для налагодження та інформування розробника про проблему, яка сталася під час взаємодії з бекендом
    }
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
    const item = state.incidents.find(inc => inc.id === Number(id));
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
async function loadFromStorage() {
    try {
        const res = await fetch(API_URL);      // GET-запит на бекенд
        const data = await res.json();
        state.incidents = data;
        render();
    } catch (err) {
        console.error("Помилка при завантаженні:", err);
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
list.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    // РЕДАГУВАННЯ
    if (e.target.classList.contains("edit-btn")) {
        startEdit(id);
        return;
    }

    // ВИДАЛЕННЯ
    if (e.target.classList.contains("delete-btn")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            state.incidents = state.incidents.filter(inc => inc.id !== Number(id));
            render();
        } catch (err) {
            console.error("Помилка при видаленні:", err);
        }
    }
});

// ОБРОБКА ВІДПРАВКИ ФОРМИ
form.addEventListener("submit", async event => { // Додаємо обробник події submit на форму, який буде викликатися при спробі відправити форму, і виконує асинхронну функцію для обробки даних форми та взаємодії з бекендом
    event.preventDefault(); // Запобігаємо стандартній поведінці браузера при відправці форми, яка полягає в перезавантаженні сторінки, щоб ми могли обробити дані форми за допомогою JavaScript і виконати асинхронні запити до бекенду без перезавантаження сторінки
    const data = readForm(); // Зчитуємо дані з форми за допомогою функції readForm, яка збирає значення з полів форми і повертає об'єкт з даними інцидента, які ми будемо використовувати для створення нового інцидента або оновлення існуючого на бекенді
    if (!validateForm(data)) return; // Якщо дані форми не пройшли валідацію, ми припиняємо подальшу обробку, щоб користувач міг виправити помилки в формі, і не відправляємо некоректні дані на сервер
    if (editingId) await updateItem(editingId, data); // Якщо ми зараз редагуємо існуючий інцидент (editingId не null), виконуємо оновлення інцидента на бекенді за допомогою функції updateItem, передаючи ID редагованого інцидента та нові дані, і чекаємо завершення цього процесу, перш ніж продовжити, щоб переконатися, що дані на сервері оновлені перед тим, як ми очистимо форму та скинемо режим редагування
    else await addItem(data); // Якщо ми не редагуємо інцидент (editingId null), виконуємо додавання нового інцидента на бекенді за допомогою функції addItem, передаючи дані нового інцидента, і чекаємо завершення цього процесу, перш ніж очистити форму, щоб переконатися, що новий інцидент успішно доданий на сервері перед тим, як ми очистимо форму для наступного введення
    clearForm(); // Після успішного додавання або оновлення інцидента очищаємо форму, щоб підготувати її для введення нового інцидента або редагування іншого інцидента, і скидаємо всі поля форми до їх початкового стану, щоб користувач міг почати з чистого аркуша
});

// ІНІЦІАЛІЗАЦІЯ
loadFromStorage();
render();
// ДИНАМІЧНЕ ОНОВЛЕННЯ СПИСКУ
searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);