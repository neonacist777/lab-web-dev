const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "..", "data", "app.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

function loadSchema() {
    return fs.readFileSync(SCHEMA_PATH, "utf8");
}

let db = null;

function initDb() {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log(`[DB] Initializing database at: ${DB_PATH}`);
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    const schema = loadSchema();
    db.exec(schema);
    console.log("[DB] Schema loaded from schema.sql");
    
    runMigrations();
    console.log("[DB] Schema initialized successfully");
    
    return db;
}

function runMigrations() {
    const stmt = db.prepare("SELECT MAX(version) as version FROM schema_migrations");
    const row = stmt.get();
    const currentVersion = row?.version || 0;
    
    console.log(`[DB] Current migration version: ${currentVersion}`);
    
    if (currentVersion < 1) {
        db.prepare("INSERT INTO schema_migrations (version) VALUES (1)").run();
        console.log("[DB] Migration v1 applied");
    }
}

function getDb() {
    if (!db) {
        db = initDb();
    }
    return db;
}

function closeDb() {
    if (db) {
        db.close();
        db = null;
        console.log("[DB] Database connection closed");
    }
}

module.exports = { initDb, getDb, closeDb, DB_PATH };