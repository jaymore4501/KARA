# 🚀 KARA — Deployment Guide

This guide provides simple, step-by-step instructions to deploy the **KARA** Multi-Agent Platform **locally** or on **Render** (Cloud).

---

## 💻 Option 1: Local Deployment

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.11+)
- **uv** (Recommended Python manager) or `pip`

---

### 2. Backend Deployment (FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
uv sync   # or pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
```

Add your Gemini API Key in `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:3000
PORT=8000
```

Start the FastAPI backend server:
```bash
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
> 🟢 Backend API running at: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)

---

### 3. Frontend Deployment (Next.js)

In a new terminal:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Next.js development server
npm run dev
```
> 🟢 Frontend app running at: `http://localhost:3000`

---

## ☁️ Option 2: Deploying to Render (Cloud)

### Step 1: Deploy Backend (Web Service)

1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/jaymore4501/KARA`.
3. Configure Backend Service settings:
   - **Name:** `kara-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   - `GEMINI_API_KEY` = `your_actual_gemini_key`
   - `CORS_ORIGINS` = `https://kara-frontend.onrender.com` (your frontend Render URL)
5. Click **Create Web Service**. Copy your backend URL (e.g. `https://kara-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Web Service)

1. Click **New +** → **Web Service** on Render.
2. Select your repository `https://github.com/jaymore4501/KARA`.
3. Configure Frontend Service settings:
   - **Name:** `kara-frontend`
   - **Root Directory:** `frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://kara-backend.onrender.com`
5. Click **Create Web Service**.

---

## 🐳 Option 3: Docker Deployment (Single Command)

If you have Docker & Docker Compose installed:

```bash
# Build and run backend + frontend together
docker-compose up --build -d
```
> 🟢 Access Frontend at `http://localhost:3000` & Backend at `http://localhost:8000`.

---

## ✅ Deployment Checklist

- [x] Gemini API key configured in backend `.env`
- [x] Backend CORS origin set to frontend URL
- [x] Next.js production build verified (`npm run build`)
- [x] Security headers & strict CORS active
