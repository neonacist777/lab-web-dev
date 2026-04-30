const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Створюємо папку data якщо не існує
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// Вмикаємо foreign keys
db.pragma('foreign_keys = ON');

console.log(`[DB] Підключено до ${dbPath}`);

module.exports = db;
