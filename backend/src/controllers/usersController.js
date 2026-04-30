const usersRepository = require('../repositories/usersRepository');
const { validateUser } = require('../validation/validateUser');

exports.getAll = (req, res) => {
    const users = usersRepository.getAll();
    res.status(200).json(users);
};

exports.getById = (req, res, next) => {
    const id = Number(req.params.id);
    const user = usersRepository.getById(id);

    if (!user) {
        const err = new Error('Користувача не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(200).json(user);
};

exports.create = (req, res, next) => {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        const err = new Error('Помилка валідації');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    try {
        const user = usersRepository.create(req.body);
        res.status(201).json(user);
    } catch (dbError) {
        if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            const err = new Error('Email вже існує');
            err.type = 'VALIDATION_ERROR';
            err.details = [{ field: 'email', message: 'Цей email вже зареєстровано' }];
            return next(err);
        }
        next(dbError);
    }
};

exports.update = (req, res, next) => {
    const id = Number(req.params.id);
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        const err = new Error('Помилка валідації');
        err.type = 'VALIDATION_ERROR';
        err.details = errors;
        return next(err);
    }

    try {
        const user = usersRepository.update(id, req.body);

        if (!user) {
            const err = new Error('Користувача не знайдено');
            err.type = 'NOT_FOUND';
            return next(err);
        }

        res.status(200).json(user);
    } catch (dbError) {
        if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            const err = new Error('Email вже існує');
            err.type = 'VALIDATION_ERROR';
            err.details = [{ field: 'email', message: 'Цей email вже зареєстровано' }];
            return next(err);
        }
        next(dbError);
    }
};

exports.remove = (req, res, next) => {
    const id = Number(req.params.id);
    const deleted = usersRepository.remove(id);

    if (!deleted) {
        const err = new Error('Користувача не знайдено');
        err.type = 'NOT_FOUND';
        return next(err);
    }

    res.status(204).send();
};
