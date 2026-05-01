# Cybersecurity Incident Tracker API

REST API для трекінгу кіберінцидентів, реалізоване на Node.js + Express + SQLite.  
Проєкт містить CRUD для трьох сутностей (users, incidents, comments), підтримує фільтрацію, сортування, зв’язки 1–M та централізовану обробку помилок.

#  Як запустити

1. Перейти в папку проєкту:
   cd backend

2. Встановити залежності:
   npm install

3. Запустити сервер:
   node src/index.js

4. API буде доступне за адресою:
   http://localhost:3000

# 🗄 Де створюється база даних

При першому запуску автоматично створюється файл:
backend/data/app.db

Це робиться у модулях:
- src/database/db.js — створення файлу та підключення
- src/database/initDb.js — виконання schema.sql
- src/database/schema.sql — таблиці
- src/database/seed.js — тестові дані

#  Приклади запитів (curl)

1. Створити користувача:
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Іван","email":"ivan@example.com"}'

2. Отримати список інцидентів (WHERE + ORDER + LIMIT):
curl "http://localhost:3000/api/incidents?type=DDoS&sort=severity&order=desc&limit=3"

3. Отримати всі коментарі інциденту:
curl "http://localhost:3000/api/comments?incidentId=1"

4. Створити інцидент:
curl -X POST http://localhost:3000/api/incidents \
-H "Content-Type: application/json" \
-d '{"title":"DDoS атака","type":"DDoS","date":"2025-01-10","severity":8,"userId":1}'

5. Видалити користувача:
curl -X DELETE http://localhost:3000/api/users/1

#  Запит з WHERE + ORDER BY + LIMIT

Реалізовано в src/repositories/incidentsRepository.js

Приклад:
GET /api/incidents?type=DDoS&sort=severity&order=desc&limit=5

#  Зв’язки в БД (1–M)

Users (1) → (M) Incidents:
user_id INTEGER REFERENCES users(id) ON DELETE SET NULL

Incidents (1) → (M) Comments:
incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE

Увімкнено:
PRAGMA foreign_keys = ON;

#  CRUD для сутностей

Реалізовано повний CRUD для:
- /api/users
- /api/incidents
- /api/comments

Структура:
- routes/ — маршрути
- controllers/ — логіка HTTP
- repositories/ — SQL‑запити
- validation/ — валідація

#  HTTP‑коди стану

- 201 — створення
- 200 — успішно
- 204 — видалено
- 400 — помилка валідації
- 404 — ресурс не знайдено
- 409 — конфлікт (унікальність email)

Централізована обробка:
src/middleware/errorHandler.js

#  Seed — тестові дані

При першому запуску додаються:
- 3 користувачі
- 5 інцидентів
- 5 коментарів

Файл: src/database/seed.js

#  Структура проєкту

src/
 ├── controllers/
 ├── database/
 ├── middleware/
 ├── repositories/
 ├── routes/
 ├── validation/
 └── index.js
