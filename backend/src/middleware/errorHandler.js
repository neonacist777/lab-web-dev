module.exports = (err, req, res, next) => {
    console.error(`[ERROR] ${err.type || 'UNKNOWN'}: ${err.message}`);

    if (err.type === 'VALIDATION_ERROR') {
        return res.status(400).json({
            status: 400,
            title: 'Помилка валідації',
            detail: 'Перевірте правильність введених даних',
            errors: err.details || []
        });
    }

    if (err.type === 'NOT_FOUND') {
        return res.status(404).json({
            status: 404,
            title: 'Не знайдено',
            detail: err.message || 'Ресурс не знайдено'
        });
    }

    if (err.type === 'CONFLICT') {
        return res.status(409).json({
            status: 409,
            title: 'Конфлікт',
            detail: err.message || 'Ресурс вже існує'
        });
    }

    res.status(500).json({
        status: 500,
        title: 'Внутрішня помилка сервера',
        detail: 'Спробуйте пізніше або зверніться до адміністратора'
    });
};