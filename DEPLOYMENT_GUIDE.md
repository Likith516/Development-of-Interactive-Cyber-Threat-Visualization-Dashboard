# Deployment Guide: Threat Monitor

This guide explains how to deploy the **Threat Monitor** application to the cloud for free using **Vercel** (Frontend) and **Render** (Backend).

---

## Part 1: Backend Deployment (Render)

We will deploy the Python FastAPI backend first because you need its URL to configure the frontend.

### 1. Prepare for Deployment
Ensure your project is in a GitHub (or GitLab/Bitbucket) repository.
- The `backend/` folder should be in the root or a subdirectory.
- `requirements.txt` must exist in `backend/`.

### 2. Create Service on Render
1.  Sign up/Log in to [Render.com](https://render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Name**: `threat-monitor-api` (or similar)
    - **Region**: Choose one close to you (e.g., Ohio, Frankfurt).
    - **Branch**: `main` (or your working branch).
    - **Root Directory**: `backend` (Important! This tells Render where the python code is).
    - **Runtime**: `Python 3`.
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    - **Instance Type**: `Free`.

### 3. Environment Variables
Scroll down to "Environment Variables" and add these keys (values from your `.env`):
- `OTX_API_KEY`: Your AlienVault OTX Key.
- `IPINFO_TOKEN`: Your IPinfo.io Token.
- `ABUSEIPDB_API_KEY`: Your AbuseIPDB API value.
- `PYTHON_VERSION`: `3.9.13` (Optional, good for stability).

### 4. Deploy
Click **"Create Web Service"**.
- Wait for the build to finish.
- Once live, copy the **Service URL** (e.g., `https://threat-monitor-api.onrender.com`).
- **Save this URL**, you need it for the frontend!

---

## Part 2: Frontend Deployment (Vercel)

Now we deploy the React/Vite frontend.

### 1. Create Project on Vercel
1.  Sign up/Log in to [Vercel.com](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.

### 2. Configure Project
- **Framework Preset**: `Vite` (Should be detected automatically).
- **Root Directory**: Click "Edit" and select `frontend`.

### 3. Environment Variables
Expand the **"Environment Variables"** section and add:

| Key | Value |
| --- | --- |
| `VITE_API_BASE` | Your Render Backend URL (e.g., `https://threat-monitor-api.onrender.com`) |

**Important**: Do not add a trailing slash `/` to the URL.

### 4. Deploy
1.  Click **"Deploy"**.
2.  Vercel will build the project.
3.  Once complete, you will see a screenshot of your app. Click it to visit your live site!

---

## Troubleshooting

### "Network Error" or Data not loading
- Open the browser Developer Tools (F12) -> Console.
- If you see `Mixed Content` errors (loading HTTP from HTTPS), ensure your Backend URL uses `https://`. Render provides HTTPS by default.
- Check if the Backend is awake. On the free tier, Render spins down servers after inactivity. It might take 50 seconds to wake up on the first request.

### Maps not showing
- Ensure your `leaflet` CSS is loading correctly (it's imported in `main.jsx` or `index.html`).
