# 🚀 KARA — Deployment & Local Setup Guide

This guide provides simple, step-by-step instructions to set up and run **KARA** locally from a **ZIP download** or **Git clone**, as well as cloud deployment on **Render**.

---

## 📦 How to Setup & Run Locally (ZIP Download on Laptop/PC)

If you downloaded this repository as a **ZIP file** from GitHub (`KARA-main.zip`):

### 1. Extract the ZIP File
1. Right-click `KARA-main.zip` and select **Extract All...** (or unzip).
2. Open the extracted folder `KARA-main` in **VS Code** (or your Terminal / Command Prompt).

---

### 2. Prerequisites Check
Make sure your laptop has:
- **Node.js (v18+)** — [Download Node.js](https://nodejs.org/)
- **Python (v3.11+)** — [Download Python](https://www.python.org/)

---

### 3. Step 1: Start the Backend (FastAPI)

Open your first Terminal tab in the project root folder (`KARA-main`):

```bash
# 1. Move into the backend folder
cd backend

# 2. Create the environment file
# On Windows Command Prompt / PowerShell:
copy .env.example .env

# On Mac / Linux:
cp .env.example .env
```

Open `backend/.env` in VS Code and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

Install Python dependencies and start the backend server:
```bash
# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
> 🟢 **Backend Live:** `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)

---

### 4. Step 2: Start the Frontend (Next.js)

Open a **second Terminal tab** in the project root folder (`KARA-main`):

```bash
# 1. Move into the frontend folder
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Next.js development server
npm run dev
```
> 🟢 **Frontend Live:** `http://localhost:3000`

---

### 5. Step 3: Open in Laptop Browser
Open your Web Browser (Chrome, Edge, Brave, Safari) and go to:
👉 **`http://localhost:3000`**

---

## 💻 Local Git Setup (Alternative)

If you are cloning via Git:

```bash
git clone https://github.com/jaymore4501/KARA.git
cd KARA
```
Then follow the same Backend (`cd backend`) and Frontend (`cd frontend`) steps above.

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
