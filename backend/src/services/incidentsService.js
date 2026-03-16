let incidents = []; // Тимчасове сховище для інцидентів, замінює базу даних для простоти реалізації
let nextId = 1; // Лічильник для генерації унікальних ID інцидентів, починається з 1 і збільшується при кожному створенні нового інцидента

class IncidentsService { // Клас сервісу для управління інцидентами, який містить методи для отримання всіх інцидентів, отримання інцидента за ID, створення нового інцидента, оновлення існуючого інцидента та видалення інцидента
    getAll() {
        return incidents;
    }

    getById(id) {
        return incidents.find(i => i.id === id); // Пошук інцидента за ID, повертає інцидент, якщо знайдено, або undefined, якщо інцидента з таким ID не існує
    } 

    create(data) {
    const newIncident = {
        id: nextId++,
        title: data.title,
        type: data.type,
        date: data.date,
        severity: data.severity,
        url: data.url
    };

    incidents.push(newIncident);
    return newIncident;
}


    update(id, data) {
        const idx = incidents.findIndex(i => i.id === id); // Пошук індексу інцидента за ID, якщо інцидент з таким ID не знайдено, метод повертає null
        if (idx === -1) return null;

        incidents[idx] = { ...incidents[idx], ...data }; // Оновлення даних інцидента, зберігаючи існуючі поля та замінюючи їх на нові значення з об'єкта data, який може містити будь-які поля інцидента, такі як title, type, date, severity та url
        return incidents[idx];
    }

    delete(id) {
        const idx = incidents.findIndex(i => i.id === id); // Пошук індексу інцидента за ID, якщо інцидент з таким ID не знайдено, метод повертає false
        if (idx === -1) return false;

        incidents.splice(idx, 1); // Видалення інцидента з масиву incidents за допомогою методу splice, який видаляє один елемент за вказаним індексом
        return true;
    }
}

module.exports = new IncidentsService(); // Експорт екземпляра класу IncidentsService для використання в інших частинах програми, таких як контролери або маршрути, де потрібно виконувати операції над інцидентами, такі як отримання, створення, оновлення та видалення інцидентів
