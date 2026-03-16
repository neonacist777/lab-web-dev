function validateUser(body) { // Функція для валідації даних користувача, приймає об'єкт body з полями name та email

    const errors = []; // Масив для зберігання помилок валідації

    if (!body.name) errors.push({ field: "name", message: "Ім'я є обов'язковим" }); // Перевірка наявності поля name, якщо відсутнє - додаємо помилку до масиву
    if (body.name && typeof body.name !== "string") errors.push({ field: "name", message: "Ім'я має бути рядком" });

    if (!body.email) errors.push({ field: "email", message: "Email є обов'язковим" }); // Перевірка наявності поля email, якщо відсутнє - додаємо помилку до масиву
    if (body.email && typeof body.email !== "string") errors.push({ field: "email", message: "Email має бути рядком" });

    if (errors.length) { // Якщо є помилки валідації, створюємо об'єкт помилки з типом VALIDATION_ERROR
        const err = new Error("Некоректні дані користувача"); // Створення нового об'єкта помилки з повідомленням про некоректні дані користувача
        err.type = "VALIDATION_ERROR";
        err.details = errors;
        throw err;
    }
}

module.exports = validateUser; // Експорт функції validateUser для використання в інших частинах програми, таких як контролери або маршрути, де потрібно перевірити дані користувача перед їх обробкою