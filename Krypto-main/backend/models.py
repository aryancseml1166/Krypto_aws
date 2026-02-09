import sqlite3
from werkzeug.security import generate_password_hash

DB_NAME = "database.db"

def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    db = get_db()
    cursor = db.cursor()

    # Watchlist table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin_id TEXT UNIQUE
    )
    """)

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    """)

    # Default admin user
    cursor.execute(
        "INSERT OR IGNORE INTO users (email, password, role) VALUES (?,?,?)",
        (
            "admin@crypto.com",
            generate_password_hash("admin123"),
            "admin"
        )
    )

    db.commit()
    db.close()

# Run DB initialization
init_db()

