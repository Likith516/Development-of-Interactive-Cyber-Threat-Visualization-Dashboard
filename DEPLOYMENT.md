# Deployment Guide

This guide explains how to deploy the Cyber Threat Intelligence Monitoring System to the cloud.

## 📦 Backend Deployment (Render)

We recommend using **Render** for the backend as it supports Node.js services and persistent storage (for SQLite) or can easily connect to a managed database.

### Steps:
1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Create a New Web Service** on [Render](https://render.com/).
3.  **Connect your Repository**.
4.  **Configure Settings**:
    - **Root Directory**: `backend`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables**:
    Add the following variables in the Render dashboard:
    - `ABUSEIPDB_API_KEY`: Your key
    - `OTX_API_KEY`: Your key
    - `IPINFO_TOKEN`: Your token
    - `PORT`: `10000` (or leave default, Render sets this automatically)
6.  **Deploy**: Click "Create Web Service".

> **Note**: Since this project uses SQLite by default, data will not persist across re-deployments on Render's free tier (ephemeral filesystem). For production, configure the `server.js` to use a cloud hosted PostgreSQL or MongoDB instance.

---

## 🌐 Frontend Deployment (Vercel)

We recommend **Vercel** for the React frontend.

### Steps:
1.  **Push to GitHub**: Ensure your project is on GitHub.
2.  **Import Project** on [Vercel](https://vercel.com/).
3.  **Configure Project**:
    - **Root Directory**: `frontend`
    - **Framework Preset**: Vite
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4.  **Environment Variables**:
    - If you deployed the backend, you need to point the frontend to it.
    - Update `frontend/src/api.js` to use an environment variable for the base URL, or hardcode your Render URL.
    - Add `VITE_API_URL` to Vercel environment variables if you updated the code to use `import.meta.env.VITE_API_URL`.
5.  **Deploy**: Click "Deploy".

### Connecting Frontend to Backend
By default, the frontend expects the backend at `http://localhost:5000`. Before deploying to Vercel, you should update `frontend/src/api.js`:

```javascript
/* frontend/src/api.js */
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default api;
```

Then in Vercel, set `VITE_API_URL` to your Render backend URL (e.g., `https://your-app.onrender.com/api`).
