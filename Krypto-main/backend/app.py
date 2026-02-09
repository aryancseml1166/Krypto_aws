from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.crypto import crypto_bp
from routes.watchlist import watchlist_bp
from routes.auth import auth_bp
from routes.admin import admin_bp
from init_db import init_db





app = Flask(__name__)
CORS(app)
init_db()

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)


@app.route("/")
def home():
    return {"message": "Flask backend running"}

app.register_blueprint(crypto_bp, url_prefix="/crypto")
app.register_blueprint(watchlist_bp, url_prefix="/watchlist")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin")




if __name__ == "__main__":
    app.run(debug=True)
