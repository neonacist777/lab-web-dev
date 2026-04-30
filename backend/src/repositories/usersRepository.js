const db = require('../database/db');

function getAll() {
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
}

function getById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function create(data) {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const result = stmt.run(data.name, data.email);
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    const result = stmt.run(data.name, data.email, id);
    if (result.changes === 0) return null;
    return getById(id);
}

function remove(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };
