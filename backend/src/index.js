const express = require('express');
const cors = require('cors');

const { initializeDatabase } = require('./database/initDb');
const { seedDatabase } = require('./database/seed');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRoutes = require('./routes/usersRoutes');
const incidentsRoutes = require('./routes/incidentsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

initializeDatabase();
seedDatabase();

const app = express();

// CORS — без *, лише конкретний origin фронтенду
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // порт Live Server у VS Code
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(logger);

// Маршрути з версією /api/v1
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/incidents', incidentsRoutes);
app.use('/api/v1/comments', commentsRoutes);

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.use((req, res, next) => {
    const err = new Error('Маршрут не знайдено');
    err.type = 'NOT_FOUND';
    next(err);
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`API started on http://localhost:${PORT}`));