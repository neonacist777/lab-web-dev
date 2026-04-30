function validateUser(body) {
    const errors = [];

    if (!body.name) {
        errors.push({ field: 'name', message: "Ім'я є обов'язковим" });
    } else if (typeof body.name !== 'string') {
        errors.push({ field: 'name', message: "Ім'я має бути рядком" });
    } else if (body.name.length < 2 || body.name.length > 50) {
        errors.push({ field: 'name', message: "Ім'я має бути від 2 до 50 символів" });
    }

    if (!body.email) {
        errors.push({ field: 'email', message: "Email є обов'язковим" });
    } else if (typeof body.email !== 'string') {
        errors.push({ field: 'email', message: 'Email має бути рядком' });
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            errors.push({ field: 'email', message: 'Некоректний формат email' });
        }
    }

    return errors;
}

module.exports = { validateUser };
