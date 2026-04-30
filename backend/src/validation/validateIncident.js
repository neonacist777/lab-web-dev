const ALLOWED_TYPES = ['DDoS', 'Malware', 'Phishing', 'Data Leak'];

function validateIncident(body) {
    const errors = [];

    if (!body.title) {
        errors.push({ field: 'title', message: "Назва є обов'язковою" });
    } else if (typeof body.title !== 'string') {
        errors.push({ field: 'title', message: 'Назва має бути рядком' });
    } else if (body.title.length < 3 || body.title.length > 100) {
        errors.push({ field: 'title', message: 'Назва має бути від 3 до 100 символів' });
    }

    if (!body.type) {
        errors.push({ field: 'type', message: "Тип є обов'язковим" });
    } else if (!ALLOWED_TYPES.includes(body.type)) {
        errors.push({ field: 'type', message: `Тип має бути одним з: ${ALLOWED_TYPES.join(', ')}` });
    }

    if (!body.date) {
        errors.push({ field: 'date', message: "Дата є обов'язковою" });
    } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(body.date)) {
            errors.push({ field: 'date', message: 'Дата має бути у форматі YYYY-MM-DD' });
        }
    }

    if (body.severity === undefined || body.severity === null) {
        errors.push({ field: 'severity', message: "Критичність є обов'язковою" });
    } else {
        const sev = Number(body.severity);
        if (isNaN(sev) || sev < 1 || sev > 10) {
            errors.push({ field: 'severity', message: 'Критичність має бути від 1 до 10' });
        }
    }

    return errors;
}

module.exports = { validateIncident, ALLOWED_TYPES };
