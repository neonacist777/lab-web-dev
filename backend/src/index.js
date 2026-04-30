const express = require('express');
const cors = require('cors');

const { initializeDatabase } = require('./database/initDb');
const { seedDatabase } = require('./database/seed');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRoutes = require('./routes/usersRoutes');
const incidentsRoutes = require('./routes/incidentsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

// Ініціалізація бази даних
initializeDatabase();
seedDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Маршрути
app.use('/api/users', usersRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// Обробка неіснуючих маршрутів
app.use((req, res, next) => {
    const err = new Error('Маршрут не знайдено');
    err.type = 'NOT_FOUND';
    next(err);
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`API started on http://localhost:${PORT}`));
