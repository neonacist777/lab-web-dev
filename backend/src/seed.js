const db = require("./db");

function seed() {
    console.log("[SEED] Starting database seeding...");
    
    db.getDb().exec("DELETE FROM comments");
    db.getDb().exec("DELETE FROM incidents");
    db.getDb().exec("DELETE FROM users");

    const users = [
        { name: "Олександр Коваленко", email: "alex.k@example.com" },
        { name: "Марія Шевченко", email: "maria.s@example.com" },
        { name: "Іван Бондаренко", email: "ivan.b@example.com" },
        { name: "Анна Козак", email: "anna.k@example.com" },
        { name: "Дмитро Осипенко", email: "dmitro.o@example.com" }
    ];

    const insertUser = db.getDb().prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    const userIds = [];
    for (const user of users) {
        const result = insertUser.run(user.name, user.email);
        userIds.push(result.lastInsertRowid);
    }
    console.log(`[SEED] Created ${users.length} users`);

    const incidents = [
        { title: "DDoS атака на сервер", type: "DDoS", date: "2024-01-15", severity: 8, userId: userIds[0] },
        { title: "Виявлено шкідливе ПЗ", type: "Malware", date: "2024-01-16", severity: 6, userId: userIds[1] },
        { title: "Фішинговий email", type: "Phishing", date: "2024-01-17", severity: 5, userId: userIds[0] },
        { title: "Витік даних клієнтів", type: "Data Leak", date: "2024-01-18", severity: 9, userId: userIds[2] },
        { title: "Новий вірус-троян", type: "Malware", date: "2024-01-19", severity: 7, userId: userIds[1] },
        { title: "Атака на DNS", type: "DDoS", date: "2024-01-20", severity: 7, userId: userIds[3] },
        { title: "Підозрілий лист від CEO", type: "Phishing", date: "2024-01-21", severity: 4, userId: userIds[4] },
        { title: "Втрата резервних копій", type: "Data Leak", date: "2024-01-22", severity: 10, userId: userIds[0] }
    ];

    const insertIncident = db.getDb().prepare(
        "INSERT INTO incidents (title, type, date, severity, user_id) VALUES (?, ?, ?, ?, ?)"
    );
    const incidentIds = [];
    for (const inc of incidents) {
        const result = insertIncident.run(inc.title, inc.type, inc.date, inc.severity, inc.userId);
        incidentIds.push(result.lastInsertRowid);
    }
    console.log(`[SEED] Created ${incidents.length} incidents`);

    const comments = [
        { content: "Потрібно терміново заблокувати IP", incidentId: incidentIds[0], authorId: userIds[1] },
        { content: "Вже запустили сканер", incidentId: incidentIds[0], authorId: userIds[2] },
        { content: "Додано до чорного списку", incidentId: incidentIds[1], authorId: userIds[0] },
        { content: "Перевірю логи сервера", incidentId: incidentIds[2], authorId: userIds[3] },
        { content: "Потрібно повідомити юридичний відділ", incidentId: incidentIds[3], authorId: userIds[4] },
        { content: "Оновлено антивірусні бази", incidentId: incidentIds[4], authorId: userIds[1] },
        { content: "Звернення до провайдера", incidentId: incidentIds[5], authorId: userIds[0] },
        { content: "Попереджено всіх користувачів", incidentId: incidentIds[6], authorId: userIds[2] },
        { content: "Почато розслідування", incidentId: incidentIds[7], authorId: userIds[3] }
    ];

    const insertComment = db.getDb().prepare(
        "INSERT INTO comments (content, incident_id, author_id) VALUES (?, ?, ?)"
    );
    for (const comm of comments) {
        insertComment.run(comm.content, comm.incidentId, comm.authorId);
    }
    console.log(`[SEED] Created ${comments.length} comments`);

    console.log("[SEED] Database seeding completed successfully!");
}

if (require.main === module) {
    seed();
}

module.exports = { seed };