function validateComment(body) {
    const errors = [];

    if (!body.incidentId) {
        errors.push({ field: 'incidentId', message: "ID інциденту є обов'язковим" });
    }

    if (!body.text) {
        errors.push({ field: 'text', message: "Текст є обов'язковим" });
    } else if (body.text.length < 1 || body.text.length > 500) {
        errors.push({ field: 'text', message: 'Текст має бути від 1 до 500 символів' });
    }

    if (!body.author) {
        errors.push({ field: 'author', message: "Автор є обов'язковим" });
    }

    return errors;
}

module.exports = { validateComment };
