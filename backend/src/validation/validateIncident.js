function validateIncident(req, res, next) { // Middleware для валідації даних інцидента, який перевіряє наявність та коректність полів title, type, date, severity та url у тілі запиту при створенні або оновленні інцидента, і якщо дані є некоректними, відправляє відповідь з HTTP статусом 400 (Bad Request) та повідомленням про помилку, або викликає next() для передачі управління наступному middleware або контролеру, якщо дані є коректними
    const { title, type, date, severity, url } = req.body; // Отримання полів title, type, date, severity та url з тіла запиту для подальшої валідації їх значень, які повинні відповідати певним критеріям для коректного створення або оновлення інцидента

    if (!title || typeof title !== "string") { 
        return res.status(400).json({ message: "Invalid title" });  // Якщо поле title відсутнє або не є рядком, це означає, що дані для створення або оновлення інцидента є некоректними, тому відправляємо відповідь з HTTP статусом 400 (Bad Request) та повідомленням "Invalid title"
    }

    if (!type || typeof type !== "string") {
        return res.status(400).json({ message: "Invalid type" }); // Якщо поле type відсутнє або не є рядком, это означает, что данные для создания или обновления инцидента являются некорректными, поэтому отправляем ответ с HTTP статусом 400 (Bad Request) и сообщением "Invalid type"
    }

    if (!date || typeof date !== "string") {
        return res.status(400).json({ message: "Invalid date" }); // якщо поле date відсутнє або не є рядком, це означає, що дані для створення або оновлення інцидента є некоректними, тому відправляємо відповідь з HTTP статусом 400 (Bad Request) та повідомленням "Invalid date"
    }

    const sev = Number(severity);
    if (!severity || isNaN(sev) || sev < 1 || sev > 10) {
        return res.status(400).json({ message: "Invalid severity" }); // якщо поле severity відсутнє, не є числом, або його значення менше 1 або більше 10, це означает, что данные для создания или обновления инцидента являются некорректными, поэтому отправляем ответ с HTTP статусом 400 (Bad Request) и сообщением "Invalid severity"
    }

    if (url && typeof url !== "string") {
        return res.status(400).json({ message: "Invalid url" }); // якщо поле url присутнє, але не є рядком, це означает, что данные для создания или обновления инцидента являются некорректными, поэтому отправляем ответ с HTTP статусом 400 (Bad Request) и сообщением "Invalid url"
    }

    next(); // Якщо всі поля є коректними, викликаємо next() для передачі управління наступному middleware або контролеру, який буде обробляти запит для створення або оновлення інцидента з валідними даними
}

module.exports = validateIncident;
