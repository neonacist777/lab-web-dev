module.exports = (err, req, res, next) => {
    console.error(`[ERROR] ${err.type || "UNKNOWN"}: ${err.message}`);

    if (err.type === "VALIDATION_ERROR") {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Помилка валідації даних",
                details: err.details || []
            }
        });
    }

    if (err.type === "NOT_FOUND") {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: err.message || "Ресурс не знайдено"
            }
        });
    }

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Внутрішня помилка сервера"
        }
    });
};
