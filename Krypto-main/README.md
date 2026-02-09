# 🚀 Crypto Price Tracker (AWS Full Stack Project)

A full-stack cryptocurrency tracking web application with authentication, personalized watchlists, admin monitoring, and AWS cloud integration.

---

## 🌐 Tech Stack

Frontend: React  
Backend: Flask  
Database: SQLite + AWS DynamoDB  
Cloud Services: AWS EC2, SNS  
Authentication: JWT  
Process Manager: PM2  

---

## ✨ Features

- 🔐 User Signup / Login (JWT Authentication)
- ⭐ User-specific Watchlist
- 📊 Live Cryptocurrency Price Tracking
- 🧑‍💼 Admin Dashboard & Monitoring
- ☁️ AWS Integration (DynamoDB + SNS Notifications)
- 📱 Responsive UI (Grid & List Views)

---

## 📂 Project Structure



frontend/ → React Application
backend/ → Flask API & Dynamo DB
aws_app.py → AWS Integrated Backend


---

## ⚙️ Local Setup

### Backend

cd backend

pip install -r requirements.txt

python app.py


### Frontend

cd frontend

npm install

npm start


---

## ☁️ AWS Deployment

### Backend

python aws_app.py


### Frontend

npm run build

serve -s build -l 3000


### Run Using PM2

pm2 start aws_app.py --name backend --interpreter python3

pm2 start "serve -s build -l 3000" --name frontend

pm2 save


---

## 🗄️ Databases

SQLite → Users & Watchlist  
DynamoDB → Alerts & Admin Logs  

---

