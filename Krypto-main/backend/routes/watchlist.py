from flask import Blueprint, request, jsonify
import sqlite3

watchlist_bp = Blueprint("watchlist", __name__)

DB_NAME = "database.db"

# ⭐ ADD COIN
@watchlist_bp.route("/add", methods=["POST"])
def add_to_watchlist():
    coin_id = request.json.get("coin_id")

    try:
        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        cursor.execute(
            "INSERT OR IGNORE INTO watchlist (coin_id) VALUES (?)",
            (coin_id,)
        )

        db.commit()
        return jsonify({"message": "Coin added"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()


# ⭐ REMOVE COIN
@watchlist_bp.route("/remove", methods=["POST"])
def remove_from_watchlist():
    coin_id = request.json.get("coin_id")

    try:
        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        cursor.execute(
            "DELETE FROM watchlist WHERE coin_id=?",
            (coin_id,)
        )

        db.commit()
        return jsonify({"message": "Coin removed"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()


# ⭐ GET WATCHLIST
@watchlist_bp.route("/all", methods=["GET"])
def get_watchlist():

    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()

    cursor.execute("SELECT coin_id FROM watchlist")
    rows = cursor.fetchall()

    db.close()

    coins = [row[0] for row in rows]

    return jsonify(coins)
