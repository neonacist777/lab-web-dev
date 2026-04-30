const db = require('./db');
const fs = require('fs');
const path = require('path');

function initializeDatabase() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    db.exec(schema);
    console.log('[DB] Схема ініціалізована');
}

module.exports = { initializeDatabase };
