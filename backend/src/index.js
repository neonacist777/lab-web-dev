const express = require("express");
const app = express();

const cors = require("cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/usersRoutes");
const incidentsRoutes = require("./routes/incidentsRoutes");

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/users", usersRoutes);
app.use("/api/incidents", incidentsRoutes);

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Обробка неіснуючих маршрутів
app.use((req, res, next) => {
    const err = new Error("Маршрут не знайдено");
    err.type = "NOT_FOUND";
    next(err);
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`API started on http://localhost:${PORT}`));
