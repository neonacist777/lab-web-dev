const db = require('../database/db');

function getAll(filters = {}) {
    let sql = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];

    // Фільтрація
    if (filters.type) {
        sql += ' AND type = ?';
        params.push(filters.type);
    }

    if (filters.userId) {
        sql += ' AND user_id = ?';
        params.push(filters.userId);
    }

    if (filters.minSeverity) {
        sql += ' AND severity >= ?';
        params.push(filters.minSeverity);
    }

    // Сортування
    const sortField = filters.sort || 'created_at';
    const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';
    const allowedFields = ['id', 'title', 'type', 'date', 'severity', 'created_at'];
    
    if (allowedFields.includes(sortField)) {
        sql += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // Ліміт
    if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(parseInt(filters.limit));
    }

    return db.prepare(sql).all(...params);
}

function getById(id) {
    return db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
}

function create(data) {
    const stmt = db.prepare(`
        INSERT INTO incidents (title, type, date, severity, user_id) 
        VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(data.title, data.type, data.date, data.severity, data.userId || null);
    return getById(result.lastInsertRowid);
}

function update(id, data) {
    const stmt = db.prepare(`
        UPDATE incidents 
        SET title = ?, type = ?, date = ?, severity = ?, user_id = ?
        WHERE id = ?
    `);
    const result = stmt.run(data.title, data.type, data.date, data.severity, data.userId || null, id);
    if (result.changes === 0) return null;
    return getById(id);
}

function remove(id) {
    const stmt = db.prepare('DELETE FROM incidents WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };
