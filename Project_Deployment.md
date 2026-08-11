# 🚀 KARA AI - Deployment Guide

This guide provides concise, professional instructions for deploying **KARA** (Autonomous Multi-Agent Startup Engine) locally on your laptop, as well as production deployments on **Render** (Backend API) and **Vercel** (Frontend App).

---

## 💻 1. Local Laptop Setup

### Prerequisites
- **Node.js**: v18+ & npm
- **Python**: v3.11+
- **Git**

### Step-by-Step Setup

#### 1. Backend Setup (FastAPI Engine)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate  |  Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
APP_NAME="KARA"
APP_VERSION="1.0.0"
API_PREFIX="/api/v1"
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
JWT_SECRET_KEY="replace-with-a-strong-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
```

Launch the Backend Server:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API documentation available at:* `http://localhost:8000/docs`

#### 2. Frontend Setup (Next.js 16)
```bash
cd ../frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
```

Launch the Frontend Dev Server:
```bash
npm run dev -- -p 3001
```
*Web application accessible at:* `http://localhost:3001`

---

## 🌐 2. Render Deployment (Backend API)

Render hosts the Python FastAPI multi-agent backend engine.

### Step-by-Step Deployment

1. Sign in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository (`jaymore4501/KARA`).
3. Configure service settings:
   - **Name:** `kara-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables** under Render settings:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `JWT_SECRET_KEY`: A secure secret key for token authentication
   - `CORS_ORIGINS`: `["https://your-vercel-app.vercel.app"]`
5. Click **Create Web Service**.
6. Copy your deployed Render backend URL (e.g. `https://kara-backend.onrender.com`).

---

## ⚡ 3. Vercel Deployment (Frontend Web App)

Vercel hosts the Next.js dark-mode parallax dashboard interface.

### Step-by-Step Deployment

1. Sign in to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Import your GitHub repository (`jaymore4501/KARA`).
3. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** Edit and select `frontend`
   - **Build Command:** `npm run build`
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://kara-backend.onrender.com/api/v1` *(Replace with your Render backend URL)*
5. Click **Deploy**.

Vercel will compile and issue your live production URL (e.g., `https://kara-ai.vercel.app`).

---

## 🛠️ Verification & Troubleshooting

- **CORS Configuration:** Ensure your production Vercel domain is whitelisted in `CORS_ORIGINS` on Render.
- **Backend Health Check:** Visit `https://kara-backend.onrender.com/health` to confirm `{"status":"healthy"}`.
- **Render Cold Starts:** Free tier services sleep after inactivity; initial requests take ~30 seconds to warm up.

---

<p align="center">Made with ❤️ for <b>KARA AI Platform</b></p>
