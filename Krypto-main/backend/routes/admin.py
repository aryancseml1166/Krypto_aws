from flask import Blueprint, jsonify
import sqlite3

admin_bp = Blueprint("admin", __name__)

DB_NAME = "database.db"

# -------------------------------
# GET ALL USERS
# -------------------------------
@admin_bp.route("/users", methods=["GET"])
def get_users():
    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute("SELECT id, email, role FROM users")
    users = cursor.fetchall()
    db.close()

    data = []
    for u in users:
        data.append({
            "id": u[0],
            "email": u[1],
            "role": u[2]
        })

    return jsonify(data)


# -------------------------------
# SYSTEM METRICS
# -------------------------------
@admin_bp.route("/metrics", methods=["GET"])
def system_metrics():
    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM watchlist")
    total_watchlist = cursor.fetchone()[0]

    db.close()

    return jsonify({
        "total_users": total_users,
        "watchlist_items": total_watchlist,
        "status": "healthy"
    })
