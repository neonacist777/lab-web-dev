const incidentsService = require("../services/incidentsService"); // Імпорт сервісу для інцидентів, який містить бізнес-логіку для роботи з даними інцидентів, таких як отримання, створення, оновлення та видалення інцидентів

class IncidentsController { // Клас контролера для інцидентів, який містить методи для обробки HTTP запитів, пов'язаних з інцидентами, таких як отримання всіх інцидентів, отримання інцидента за ID, створення нового інцидента, оновлення існуючого інцидента та видалення інцидента
    getAll(req, res) {
        const items = incidentsService.getAll(); // Виклик методу getAll з сервісу для інцидентів для отримання списку всіх інцидентів, який повертає масив інцидентів, і відправка його у відповіді у форматі JSON з HTTP статусом 200 (OK)
        res.json(items);
    }

    getById(req, res) { // Отримання інцидента за ID, викликає метод getById з сервісу для інцидентів і повертає результат у форматі JSON з статусом 200, або помилку, якщо інцидента не знайдено
        const id = Number(req.params.id); // Отримання ID інцидента з параметрів запиту та перетворення його в число для подальшого використання в сервісі для інцидентів
        const item = incidentsService.getById(id);

        if (!item) return res.status(404).json({ message: "Not found" }); // Якщо метод getById повертає undefined, це означає, що інцидента з таким ID не знайдено, тому відправляємо відповідь з HTTP статусом 404 (Not Found) та повідомленням "Not found"

        res.json(item);
    }

    create(req, res) {
    const { title, type, date, severity, url } = req.body;
    const created = incidentsService.create({ title, type, date, severity, url });
    res.status(201).json(created);
}


    update(req, res) {
    const id = Number(req.params.id);
    const { title, type, date, severity, url } = req.body;

    const updated = incidentsService.update(id, { title, type, date, severity, url });
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
}



    delete(req, res) {
        const id = Number(req.params.id); // Отримання ID інцидента з параметрів запиту та перетворення його в число для подальшого використання в сервісі для інцидентів
        const ok = incidentsService.delete(id); // Виклик методу delete з сервісу для інцидентів для видалення інцидента з вказаним ID, який повертає true, якщо видалення було успішним, або false, якщо інцидента з таким ID не знайдено

        if (!ok) return res.status(404).json({ message: "Not found" }); // Якщо метод delete повертає false, це означає, що інцидента з таким ID не знайдено, тому відправляємо відповідь з HTTP статусом 404 (Not Found) та повідомленням "Not found"

        res.status(204).send(); // Відправка відповіді з HTTP статусом 204 (No Content) без тіла відповіді, що означає успішне видалення інцидента
    }
}

module.exports = new IncidentsController(); // Експорт екземпляра класу IncidentsController для використання в інших частинах програми, таких як маршрути, де він буде підключений до відповідних маршрутів для обробки запитів, пов'язаних з інцидентами, таких як отримання, створення, оновлення та видалення інцидентів
