const incidentsService = require("../services/incidentsService");
const { validateIncident } = require("../validation/validateIncident");

exports.getAll = (req, res) => {
    const incidents = incidentsService.getAll();
    res.status(200).json(incidents);
};

exports.getById = (req, res, next) => {
    const id = Number(req.params.id);
    const incident = incidentsService.getById(id);

    if (!incident) {
        const err = new Error("Інцидент не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(200).json(incident);
};

exports.create = (req, res, next) => {
    const errors = validateIncident(req.body);

    if (errors.length > 0) {
        const err = new Error("Помилка валідації");
        err.type = "VALIDATION_ERROR";
        err.details = errors;
        return next(err);
    }

    const incident = incidentsService.create(req.body);
    res.status(201).json(incident);
};

exports.update = (req, res, next) => {
    const id = Number(req.params.id);
    const errors = validateIncident(req.body);

    if (errors.length > 0) {
        const err = new Error("Помилка валідації");
        err.type = "VALIDATION_ERROR";
        err.details = errors;
        return next(err);
    }

    const incident = incidentsService.update(id, req.body);

    if (!incident) {
        const err = new Error("Інцидент не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(200).json(incident);
};

exports.remove = (req, res, next) => {
    const id = Number(req.params.id);
    const deleted = incidentsService.remove(id);

    if (!deleted) {
        const err = new Error("Інцидент не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(204).send();
};
