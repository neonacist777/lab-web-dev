const db = require('./db');

function seedDatabase() {
    // Перевіряємо чи є дані
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    
    if (usersCount > 0) {
        console.log('[DB] Дані вже існують, seed пропущено');
        return;
    }

    // Додаємо користувачів
    const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    insertUser.run('Іван Петренко', 'ivan@example.com');
    insertUser.run('Марія Коваленко', 'maria@example.com');
    insertUser.run('Олексій Шевченко', 'oleksiy@example.com');

    // Додаємо інциденти
    const insertIncident = db.prepare(`
        INSERT INTO incidents (title, type, date, severity, user_id) 
        VALUES (?, ?, ?, ?, ?)
    `);
    insertIncident.run('DDoS атака на головний сервер', 'DDoS', '2025-01-10', 8, 1);
    insertIncident.run('Виявлено шкідливе ПЗ', 'Malware', '2025-01-12', 6, 2);
    insertIncident.run('Фішингова атака на співробітників', 'Phishing', '2025-01-14', 7, 1);
    insertIncident.run('Витік даних клієнтів', 'Data Leak', '2025-01-15', 9, 3);
    insertIncident.run('Повторна DDoS атака', 'DDoS', '2025-01-16', 5, 2);

    // Додаємо коментарі
    const insertComment = db.prepare(`
        INSERT INTO comments (incident_id, text, author) 
        VALUES (?, ?, ?)
    `);
    insertComment.run(1, 'Атаку заблоковано через 30 хвилин', 'Іван Петренко');
    insertComment.run(1, 'Джерело атаки ідентифіковано', 'Олексій Шевченко');
    insertComment.run(2, 'Вірус видалено, систему просканувано', 'Марія Коваленко');
    insertComment.run(3, 'Співробітників повідомлено про загрозу', 'Іван Петренко');
    insertComment.run(4, 'Розпочато розслідування', 'Олексій Шевченко');

    console.log('[DB] Тестові дані додано (seed)');
}

module.exports = { seedDatabase };
