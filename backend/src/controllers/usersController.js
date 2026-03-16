const usersService = require("../services/usersService"); // Імпорт сервісу користувачів, який містить бізнес-логіку для роботи з даними користувачів, таких як отримання, створення, оновлення та видалення користувачів
const validateUser = require("../validation/validateUser"); // Імпорт функції validateUser для валідації даних користувача перед їх обробкою в контролері, що допомагає забезпечити коректність та цілісність даних, які надходять до сервера

exports.getAll = (req, res) => { // Контролер для отримання всіх користувачів, викликає метод getAll з сервісу користувачів і повертає результат у форматі JSON з статусом 200
    res.status(200).json(usersService.getAll()); // Виклик методу getAll з сервісу користувачів для отримання списку всіх користувачів і відправка його у відповіді у форматі JSON з HTTP статусом 200 (OK)
};

exports.getById = (req, res, next) => { // Контролер для отримання користувача за ID

    const id = Number(req.params.id);
    const user = usersService.getById(id);

    if (!user) {
        const err = new Error("Користувача не знайдено"); // Створення нового об'єкта помилки
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(200).json(user);
};

exports.create = (req, res, next) => { // Створення нового користувача

    try {
        validateUser(req.body); // Виклик функції validateUser

        const user = usersService.create(req.body.name, req.body.email); // Виклик методу create з сервісу користувачів
        res.status(201).json(user);

    } catch (err) {
        next(err);
    }
};

exports.update = (req, res, next) => { // Оновлення існуючого користувача за ID, викликає метод update з сервісу користувачів і повертає оновленого користувача у форматі JSON з статусом 200, або помилку, якщо користувача не знайдено

    try {

        const id = Number(req.params.id); // Отримання ID користувача з параметрів запиту та перетворення його в число для подальшого використання в сервісі користувачів

        validateUser(req.body);

        const user = usersService.update(id, req.body.name, req.body.email); // Виклик методу update з сервісу користувачів для оновлення даних користувача з вказаним ID, передаючи нові значення name та email з тіла запиту

        if (!user) { // Якщо метод update повертає null, це означає, що користувача з вказаним ID не знайдено, тому створюємо об'єкт помилки з типом NOT_FOUND і передаємо його в наступний middleware для обробки
            const err = new Error("Користувача не знайдено");
            err.type = "NOT_FOUND";
            throw err;
        }

        res.status(200).json(user);

    } catch (err) {
        next(err);
    }
};

exports.remove = (req, res, next) => { // Видалення користувача за ID, викликає метод remove з сервісу користувачів і повертає статус 204, якщо видалення успішне, або помилку, якщо користувача не знайдено

    const id = Number(req.params.id); // Отримання ID користувача з параметрів запиту та перетворення його в число для подальшого використання в сервісі користувачів

    const ok = usersService.remove(id); // Виклик методу remove з сервісу користувачів для видалення користувача з вказаним ID, метод повертає true, якщо видалення було успішним, або false, якщо користувача не знайдено

    if (!ok) {
        const err = new Error("Користувача не знайдено"); // Якщо метод remove повертає false, це означає, що користувача з вказаним ID не знайдено, тому створюємо об'єкт помилки з типом NOT_FOUND і передаємо його в наступний middleware для обробки
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(204).send(); // Якщо видалення було успішним, відправляємо відповідь з HTTP статусом 204 (No Content), що означає, що запит був успішним, але в тілі відповіді немає даних
};