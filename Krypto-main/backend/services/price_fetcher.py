import requests
import sqlite3
import time

DB_NAME = "database.db"

# ⭐ GLOBAL CACHE
CACHE = {
    "data": None,
    "timestamp": 0
}

CACHE_DURATION = 30   # seconds


def get_prices():

    # -------- CACHE CHECK --------
    if CACHE["data"] and time.time() - CACHE["timestamp"] < CACHE_DURATION:
        print("Returning Cached Prices")
        return CACHE["data"]

    # -------- FETCH WATCHLIST IDS --------
    db = sqlite3.connect(DB_NAME)
    cursor = db.cursor()
    cursor.execute("SELECT coin_id FROM watchlist")
    coins = [row[0] for row in cursor.fetchall()]
    db.close()

    if not coins:
        return []

    url = "https://api.coingecko.com/api/v3/coins/markets"

    params = {
        "vs_currency": "usd",
        "ids": ",".join(coins)
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()

        data = res.json()

        # ⭐ SAVE CACHE
        CACHE["data"] = data
        CACHE["timestamp"] = time.time()

        return data

    except Exception as e:
        print("Price API Error:", e)

        # ⭐ RETURN OLD CACHE IF AVAILABLE
        if CACHE["data"]:
            return CACHE["data"]

        return []
