# MeroGhar - Nepal's Trusted Household Movers

A logistics platform connecting customers with verified household movers across all 7 provinces of Nepal.

## Tech Stack

- **Frontend:** Vite + Tailwind CSS + vanilla JS
- **Backend:** Express + MySQL (deployed on Railway)
- **Android:** Capacitor (wraps web app into native Android APK)
- **Database:** MySQL (Railway free tier)

## Project Structure

```
├── index.html              # Landing page
├── src/
│   ├── main.js             # Navbar, mobile menu, FAQ logic
│   ├── style.css           # Tailwind + custom styles
│   ├── config.js           # API URL auto-detect
│   ├── pages/              # login, signup, user, vendor, admin
│   ├── js/                 # auth, guard, user, vendor, admin logic
│   └── styles/             # admin.css, vendor.css
├── backend/
│   ├── server.js           # Express app entry
│   ├── config/db.js        # MySQL connection pool
│   ├── schema.sql          # Database table definitions
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handlers
│   ├── models/             # Database queries
│   └── services/           # Payment service
├── android/                # Capacitor Android project
├── capacitor.config.json   # Capacitor configuration
└── railway.json            # Railway deployment config
```

## Installation

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
git clone https://github.com/SubodhShah-Dev/Mero-Ghar-Logistics-Website.git
cd Mero-Ghar-Logistics-Website
npm install
```

### 2. Database Setup (Local)

```bash
# Start MySQL, then create the database
mysql -u root -e "CREATE DATABASE meroghar_db"
mysql -u root meroghar_db < backend/schema.sql
```

### 3. Configure Environment

Edit `backend/.env` with your local MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=meroghar_db
```

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd backend && node server.js

# Terminal 2 — Frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Build Android APK

### Prerequisites
- Java JDK 21+
- Android SDK (command-line tools)

### Steps

```bash
# 1. Build web app
npm run build

# 2. Sync with Capacitor
npx cap sync android

# 3. Build APK
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Install on Device
Transfer the APK to your Android phone (via USB, Google Drive, etc.) and tap to install. Enable **"Install from unknown apps"** when prompted.

> **Note:** The APK is configured to connect to the production backend at `https://backend-production-d51a3.up.railway.app`. To change this, edit `src/js/config.js` and rebuild.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/auth/users` | GET | List users (admin) |
| `/api/shipment/create` | POST | Create shipment |
| `/api/shipment/all` | GET | All shipments (admin) |
| `/api/shipment/user/:userId` | GET | User's shipments |
| `/api/shipment/:id` | GET | Single shipment |
| `/api/payment/*` | - | Payment endpoints |

## Deployment

The backend is deployed on **Railway** at `https://backend-production-d51a3.up.railway.app`.

### Redeploy

```bash
cd backend
railway up --service backend
```

## License

Private
