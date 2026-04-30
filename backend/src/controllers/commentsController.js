const commentsRepository = require('../repositories/commentsRepository');
const incidentsRepository = require('../repositories/incidentsRepository');
const { validateComment } = require('../validation/validateComment');

exports.getAll = (req, res) => {
    const filters = {
        incidentId: req.query.incidentId,
        limit: req.query.limit
    };

    const comments = commentsRepository.getAll(filters);
    res.status(200).json(comments);
};

exports.getById = (req, res, next) => {
    const id = Number(req.params.id);
    const comment = commentsRepository.getById(id);

    if (!comment) {
        const err = new Error('Коментар не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(200).json(comment);
};

exports.create = (req, res, next) => {
    const errors = validateComment(req.body);

    if (errors.length > 0) {
        const err = new Error('Помилка валідації');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    // Перевіряємо чи існує інцидент
    const incident = incidentsRepository.getById(req.body.incidentId);
    if (!incident) {
        const err = new Error('Інцидент не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    const comment = commentsRepository.create(req.body);
    res.status(201).json(comment);
};

exports.update = (req, res, next) => {
    const id = Number(req.params.id);
    
    if (!req.body.text || !req.body.author) {
        const err = new Error('Помилка валідації');
        err.type = 'VALIDATION_ERROR';
        err.details = [{ field: 'text/author', message: "Текст та автор є обов'язковими" }];
        return next(err);
    }

    const comment = commentsRepository.update(id, req.body);

    if (!comment) {
        const err = new Error('Коментар не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(200).json(comment);
};

exports.remove = (req, res, next) => {
    const id = Number(req.params.id);
    const deleted = commentsRepository.remove(id);

    if (!deleted) {
        const err = new Error('Коментар не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(204).send();
};
