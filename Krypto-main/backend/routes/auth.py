from flask import Blueprint, request, jsonify
import sqlite3
import time


from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)

SERVER_START_TIME = time.time()


auth_bp = Blueprint("auth", __name__)
DB_NAME = "database.db"

# =========================
# REGISTER
# =========================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    hashed = generate_password_hash(password)

    try:
        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        cursor.execute(
            "INSERT INTO users (email, password, role, blocked) VALUES (?,?,?,?)",
            (email, hashed, "user", 0)
        )

        db.commit()
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


# =========================
# LOGIN
# =========================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute(
        "SELECT id, password, role, blocked FROM users WHERE email=?",
        (email,)
    )
    user = cursor.fetchone()
    db.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if user[3] == 1:
        return jsonify({"error": "Account blocked by admin"}), 403

    if check_password_hash(user[1], password):
        token = create_access_token(
            identity=str(user[0]),   # ✅ MUST be string
            additional_claims={
                "role": user[2]
            }
        )
        return jsonify(access_token=token, role=user[2])

    return jsonify({"error": "Invalid credentials"}), 401


# =========================
# ADMIN: GET ALL USERS
# =========================
@auth_bp.route("/admin/users", methods=["GET"])
@jwt_required()
def admin_get_users():
    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute("SELECT id, email, role, blocked FROM users")
    users = cursor.fetchall()
    db.close()

    return jsonify([
        {
            "id": u[0],
            "email": u[1],
            "role": u[2],
            "blocked": bool(u[3])
        }
        for u in users
    ])


# =========================
# ADMIN: BLOCK / UNBLOCK USER
# =========================
@auth_bp.route("/admin/block-user", methods=["POST"])
@jwt_required()
def admin_block_user():
    claims = get_jwt()
    admin_id = int(get_jwt_identity())
    data = request.json

    if claims["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    user_id = data.get("user_id")
    block = data.get("block")

    if admin_id == user_id:
        return jsonify({"error": "Admin cannot block himself"}), 400

    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute(
        "UPDATE users SET blocked=? WHERE id=?",
        (1 if block else 0, user_id)
    )

    db.commit()
    db.close()

    return jsonify({"message": "User status updated"})

@auth_bp.route("/admin/metrics", methods=["GET"])
@jwt_required()
def admin_metrics():
    claims = get_jwt()

    # Admin check
    if claims.get("role") != "admin":
        return {"error": "Admin access required"}, 403

    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    # Total users
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    # Active users
    cursor.execute("SELECT COUNT(*) FROM users WHERE blocked=0")
    active_users = cursor.fetchone()[0]

    # Blocked users
    cursor.execute("SELECT COUNT(*) FROM users WHERE blocked=1")
    blocked_users = cursor.fetchone()[0]

    # Watchlist count (if table exists)
    try:
        cursor.execute("SELECT COUNT(*) FROM watchlist")
        watchlist_items = cursor.fetchone()[0]
    except:
        watchlist_items = 0

    db.close()

    uptime_seconds = int(time.time() - SERVER_START_TIME)

    return {
        "total_users": total_users,
        "active_users": active_users,
        "blocked_users": blocked_users,
        "watchlist_items": watchlist_items,
        "server_uptime_seconds": uptime_seconds
    }
