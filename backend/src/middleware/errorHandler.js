module.exports = (err, req, res, next) => { // Централізований обробник помилок для всіх маршрутів

    if (err.type === "VALIDATION_ERROR") { // Обробка помилок валідації даних
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Помилка валідації даних",
                details: err.details
            }
        });
    }

    if (err.type === "NOT_FOUND") { // Обробка помилок, коли ресурс не знайдено
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: err.message
            }
        });
    }

    res.status(500).json({ // Обробка всіх інших помилок як внутрішніх помилок сервера
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Внутрішня помилка сервера"
        }
    });
};