from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import boto3
import time
import uuid
from botocore.exceptions import ClientError

from routes.crypto import crypto_bp
from routes.watchlist import watchlist_bp
from routes.auth import auth_bp
from routes.admin import admin_bp
from init_db import init_db


# =========================
# AWS CONFIGURATION
# =========================
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

DYNAMODB_ALERTS_TABLE = os.getenv(
    "DYNAMODB_ALERTS_TABLE", "CryptoPriceAlerts"
)

DYNAMODB_AUDIT_TABLE = os.getenv(
    "DYNAMODB_AUDIT_TABLE", "AdminAuditLogs"
)

SNS_TOPIC_ARN = os.getenv(
    "SNS_TOPIC_ARN",
    "arn:aws:sns:us-east-1:440744249462:crypto-alerts"
)

# =========================
# AWS CLIENTS
# =========================
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
sns = boto3.client("sns", region_name=AWS_REGION)

alerts_table = dynamodb.Table(DYNAMODB_ALERTS_TABLE)
audit_table = dynamodb.Table(DYNAMODB_AUDIT_TABLE)

# =========================
# FLASK APP
# =========================
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY", "super-secret-key"
)

jwt = JWTManager(app)
init_db()

SERVER_START_TIME = time.time()

# =========================
# BASIC HEALTH CHECK
# =========================
@app.route("/")
def home():
    return {
        "message": "AWS Flask backend running",
        "uptime_seconds": int(time.time() - SERVER_START_TIME)
    }

# =========================
# REGISTER ROUTES (UNCHANGED)
# =========================
app.register_blueprint(crypto_bp, url_prefix="/crypto")
app.register_blueprint(watchlist_bp, url_prefix="/watchlist")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin")

# =========================
# AWS-SPECIFIC ADMIN METRICS
# =========================
@app.route("/admin/aws-metrics")
def aws_metrics():
    try:
        total_alerts = alerts_table.scan().get("Count", 0)
        total_audits = audit_table.scan().get("Count", 0)

        return {
            "aws_region": AWS_REGION,
            "total_price_alerts": total_alerts,
            "admin_audit_logs": total_audits,
            "server_uptime_seconds": int(time.time() - SERVER_START_TIME)
        }

    except ClientError as e:
        return {"error": str(e)}, 500

# =========================
# SNS TEST ENDPOINT
# =========================
@app.route("/admin/test-sns")
def test_sns():
    try:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="AWS Crypto Tracker Test",
            Message="SNS is working correctly 🚀"
        )
        return {"message": "SNS notification sent"}

    except ClientError as e:
        return {"error": str(e)}, 500

# =========================
# AWS ENTRY POINT
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
