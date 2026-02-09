# Krypto 💰  
**Crypto-Price Tracker Web App (Local + AWS Deployment Ready)**

Krypto is a full-stack cryptocurrency price tracking application built using **React (Frontend)** and **Flask (Backend)**.  
It supports **local development using SQLite** and is **AWS-deployment ready** with support for **DynamoDB**, **SNS alerts**, and **EC2 hosting**.

The application allows users to view live crypto prices, manage a personal watchlist, securely register/login, and provides an admin dashboard for user management and system metrics.

---

## 🚀 Features

- 🪙 Live crypto price data from **CoinGecko API**  
- ⭐ Add & manage personal crypto watchlist  
- 🔐 Secure user authentication using JWT  
- 👤 Role-based access (User / Admin)  
- 🚫 Admin controls to block/unblock users  
- 📊 Admin dashboard with metrics  
- 🗄 Local database using SQLite  
- ☁️ AWS-ready architecture (DynamoDB + SNS)  
- ⚙️ Clean REST API design  

---

## 📂 Repository Structure
crypto-price-tracker/
├── backend/
│ ├── app.py
│ ├── init_db.py
│ ├── routes/
│ │ ├── auth.py
│ │ ├── crypto.py
│ │ ├── watchlist.py
│ │ └── admin.py
│ ├── database.db
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── .gitignore
└── README.md


---

## 🛠 Technologies Used

| Layer | Technology |
|------|-----------|
| Frontend | React, Axios, Material UI |
| Backend | Python, Flask |
| Authentication | JWT |
| Database (Local) | SQLite |
| Database (Cloud) | AWS DynamoDB |
| Notifications | AWS SNS |
| Hosting | AWS EC2 |
| API Provider | CoinGecko |

---

## 📥 Getting Started (Local Development)

### 🧾 Clone the Repository

```bash
git clone https://github.com/aryandevtyagi10/crypto-price-tracker.git
cd crypto-price-tracker
```

## 🧰 Backend Setup
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Backend will run at:
```
http://127.0.0.1:5000
```

## 🌐 Frontend Setup
```
cd frontend
npm install
npm start
```
## Frontend will run at:
```
http://localhost:3000
```

## 🔐 Default Admin Credentials
Email: admin@crypto.com
Password: admin123

## 🗄 Database

Local SQLite database:
```
backend/database.db
```
## Tables:
```
users
watchlist
```

## ⚙️ Environment Configuration

Frontend API base URL:
```
baseURL: "http://localhost:5000"
```
