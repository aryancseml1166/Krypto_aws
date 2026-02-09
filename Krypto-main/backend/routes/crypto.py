from flask import Blueprint, jsonify
from services.price_fetcher import get_prices

crypto_bp = Blueprint("crypto", __name__)

@crypto_bp.route("/prices")
def prices():
    return jsonify(get_prices())

