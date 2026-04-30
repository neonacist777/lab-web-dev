const db = require('../database/db');

function getAll(filters = {}) {
    let sql = 'SELECT * FROM comments WHERE 1=1';
    const params = [];

    if (filters.incidentId) {
        sql += ' AND incident_id = ?';
        params.push(filters.incidentId);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(parseInt(filters.limit));
    }

    return db.prepare(sql).all(...params);
}

function getById(id) {
    return db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
}

function create(data) {
    const stmt = db.prepare(`
        INSERT INTO comments (incident_id, text, author) 
        VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.incidentId, data.text, data.author);
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    const stmt = db.prepare('UPDATE comments SET text = ?, author = ? WHERE id = ?');
    const result = stmt.run(data.text, data.author, id);
    if (result.changes === 0) return null;
    return getById(id);
}

function remove(id) {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };
