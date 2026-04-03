const usersService = require("../services/usersService");
const { validateUser } = require("../validation/validateUser");

exports.getAll = (req, res) => {
    const users = usersService.getAll();
    res.status(200).json(users);
};

exports.getById = (req, res, next) => {
    const id = Number(req.params.id);
    const user = usersService.getById(id);

    if (!user) {
        const err = new Error("Користувача не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(200).json(user);
};

exports.create = (req, res, next) => {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        const err = new Error("Помилка валідації");
        err.type = "VALIDATION_ERROR";
        err.details = errors;
        return next(err);
    }

    const user = usersService.create(req.body);
    res.status(201).json(user);
};

exports.update = (req, res, next) => {
    const id = Number(req.params.id);
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        const err = new Error("Помилка валідації");
        err.type = "VALIDATION_ERROR";
        err.details = errors;
        return next(err);
    }

    const user = usersService.update(id, req.body);

    if (!user) {
        const err = new Error("Користувача не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(200).json(user);
};

exports.remove = (req, res, next) => {
    const id = Number(req.params.id);
    const deleted = usersService.remove(id);

    if (!deleted) {
        const err = new Error("Користувача не знайдено");
        err.type = "NOT_FOUND";
        return next(err);
    }

    res.status(204).send();
};
