let users = []; // Тимчасове сховище для користувачів, замінює базу даних для простоти реалізації
let userID = 1; // Лічильник для генерації унікальних ID користувачів

function getAll() { // Повертає всі користувачі
    return users;
}

function getById(id) { // Повертає користувача за ID або undefined, якщо не знайдено
    return users.find(u => u.id === id); // Пошук користувача за ID
}

function create(name, email) { // Створює нового користувача з унікальним ID та повертає його
    const newUser = { id: userID++, name, email }; // Генерація нового користувача з унікальним ID
    users.push(newUser);
    return newUser;
}

function update(id, name, email) { // Оновлює існуючого користувача за ID, повертає оновленого користувача або null, якщо не знайдено
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { id, name, email }; // Оновлення даних користувача
    return users[index];
}

function remove(id) { // Видаляє користувача за ID, повертає true, якщо видалено, або false, якщо не знайдено
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1); // Видалення користувача з масиву
    return true;
}

module.exports = { getAll, getById, create, update, remove }; // Експорт функцій для використання в інших частинах програми, таких як маршрути або контролери