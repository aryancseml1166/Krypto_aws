import sqlite3
from werkzeug.security import generate_password_hash

DB_NAME = "database.db"

def init_db():
    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        blocked INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        coin_id TEXT,
        UNIQUE(user_id, coin_id)
    )
    """)

    cursor.execute(
        "INSERT OR IGNORE INTO users (email, password, role, blocked) VALUES (?,?,?,?)",
        (
            "admin@crypto.com",
            generate_password_hash("admin123"),
            "admin",
            0
        )
    )

    db.commit()
    db.close()

    print("Database initialized successfully")
