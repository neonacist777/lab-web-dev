const { ALLOWED_TYPES } = require("../services/incidentsService");
function validateIncident(body) {
    const errors = [];

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const type = body.type;
    const date = body.date;
    const severity = body.severity;
    const tags = body.tags;
    const comments = body.comments;

    // TITLE
    if (!title) {
        errors.push({ field: "title", message: "Назва є обов'язковою" });
    } else if (title.length < 3 || title.length > 100) {
        errors.push({ field: "title", message: "Назва має бути від 3 до 100 символів" });
    }

    // TYPE
    if (!type) {
        errors.push({ field: "type", message: "Тип є обов'язковим" });
    } else if (!ALLOWED_TYPES.includes(type)) {
        errors.push({ field: "type", message: `Тип має бути одним з: ${ALLOWED_TYPES.join(", ")}` });
    }

    // DATE
    if (!date) {
        errors.push({ field: "date", message: "Дата є обов'язковою" });
    } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            errors.push({ field: "date", message: "Дата має бути у форматі YYYY-MM-DD" });
        } else if (isNaN(Date.parse(date))) {
            errors.push({ field: "date", message: "Некоректна дата" });
        }
    }

    // SEVERITY
    if (severity === undefined || severity === null) {
        errors.push({ field: "severity", message: "Критичність є обов'язковою" });
    } else {
        const sev = Number(severity);
        if (isNaN(sev)) {
            errors.push({ field: "severity", message: "Критичність має бути числом" });
        } else if (!Number.isInteger(sev)) {
            errors.push({ field: "severity", message: "Критичність має бути цілим числом" });
        } else if (sev < 1 || sev > 10) {
            errors.push({ field: "severity", message: "Критичність має бути від 1 до 10" });
        }
    }

    // TAGS
    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            errors.push({ field: "tags", message: "Tags має бути масивом" });
        } else if (!tags.every(tag => typeof tag === "string")) {
            errors.push({ field: "tags", message: "Кожен tag має бути рядком" });
        }
    }

    // COMMENTS
    if (comments !== undefined) {
        if (!Array.isArray(comments)) {
            errors.push({ field: "comments", message: "Comments має бути масивом" });
        } else if (!comments.every(c => typeof c === "string")) {
            errors.push({ field: "comments", message: "Кожен comment має бути рядком" });
        }
    }


    return errors;
}

module.exports = { validateIncident };
