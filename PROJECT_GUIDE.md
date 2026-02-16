# Cloud-Based Cyber Threat Monitoring System
**Academic Project Submission / Developer Guide**

## 1. Project Overview
This system is a real-time cyber threat monitoring dashboard that integrates with **AlienVault OTX**, **AbuseIPDB**, and **IPinfo** to visualize global cyber attacks. It features a live interactive "Cyber Map" with pulsing indicators, real-time threat feeds, and comprehensive statistics.

---

## 2. Prerequisites
Before you begin, ensure you have the following installed:
*   **Python 3.9+**: For the backend server.
*   **Node.js 16+ & npm**: For the frontend application.
*   **Git**: (Optional) For version control.
*   **Modern Browser**: Chrome, Firefox, or Edge.
*   **Internet Access**: Required to fetch data from OTX, AbuseIPDB, and IPinfo APIs.

---

## 3. Installation & Setup

### Step 1: Extract the Project
1.  Download the `threat-monitor-dist.zip` file.
2.  Right-click and select **"Extract All..."**.
3.  You will see a folder named `threat-monitor` containing `backend`, `frontend`, and other files.

### Step 2: Configure API Keys
The system requires API keys to function correctly.
1.  Navigate to the `backend/` folder.
2.  Open the `.env` file with a text editor (Notepad, VS Code).
3.  Ensure the following keys are set (replace with your own if needed):
    ```env
    OTX_API_KEY=your_otx_key_here
    IPINFO_TOKEN=your_ipinfo_token_here
    ABUSEIPDB_API_KEY=your_abuseipdb_key_here
    ```
    *Note: The keys provided above are pre-configured for this project.*

### Step 3: Backend Setup
1.  Open High-Level Command Prompt or Terminal.
2.  Navigate to the `backend` folder:
    ```bash
    cd path/to/threat-monitor/backend
    ```
3.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    # source venv/bin/activate
    ```
4.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Step 4: Frontend Setup
1.  Open a **new** Command Prompt/Terminal window.
2.  Navigate to the `frontend` folder:
    ```bash
    cd path/to/threat-monitor/frontend
    ```
3.  Install Node dependencies:
    ```bash
    npm install
    ```

---

## 4. Running the Application

### Start the Backend
In your **Backend** terminal:
```bash
# Verify you are in the 'backend' folder
uvicorn main:app --reload --port 8001
```
You should see: `Uvicorn running on http://127.0.0.1:8001`

### Start the Frontend
In your **Frontend** terminal:
```bash
# Verify you are in the 'frontend' folder
npm run dev
```
You should see: `Local: http://localhost:3001`

### Access the Dashboard
Open your browser and go to:
**[http://localhost:3001](http://localhost:3001)**

---

## 5. Usage Guide
1.  **Dashboard Load**: The map might be empty initially.
2.  **Fetch Data**: Click the **"Refresh Feed"** button in the top right.
    *   This triggers the backend to fetch fresh data from AlienVault OTX and AbuseIPDB.
    *   It also performs background geolocation enrichment via IPinfo.
3.  **View Map**: Red/Orange pulsing markers will appear on the map representing live threats.
    *   **Cluster**: Click colored circles to zoom into a region.
    *   **Popup**: Click a pulsing dot to see IP, ISP, and Country details.

---

## 6. Project Structure
```
threat-monitor/
├── backend/                # Python FastAPI Server
│   ├── main.py             # App Entry Point & API Routes
│   ├── models.py           # Database Models (SQLAlchemy)
│   ├── database.py         # DB Connection Config
│   ├── services/           # External APIs (OTX, AbuseIPDB, IPinfo)
│   ├── threat_monitor.db   # SQLite Database
│   └── requirements.txt    # Python Deps
├── frontend/               # React Vite Client
│   ├── src/
│   │   ├── components/     # CyberMap.jsx, StatsPanel.jsx, etc.
│   │   ├── App.jsx         # Main Layout
│   │   └── index.css       # Styling & Dark Mode
│   └── package.json        # Node Deps
└── PROJECT_GUIDE.md        # This Documentation
```

---

## 7. Dependencies

**Backend (Python):**
*   `fastapi`: Web framework.
*   `uvicorn`: ASGI server.
*   `sqlalchemy`: Database ORM.
*   `requests`: HTTP client for APIs.
*   `python-dotenv`: Environment variable management.
*   `pydantic`: Data validation.

**Frontend (JavaScript):**
*   `react`: UI Library.
*   `leaflet` & `react-leaflet`: Maps.
*   `react-leaflet-markercluster`: Map Clustering.
*   `lucide-react`: Icons.
*   `axios`: HTTP Client.
*   `date-fns`: Date formatting.

---

## 8. Common Errors & Fixes
*   **"Blank Screen" on Dashboard**: Ensure the backend is running on port **8001**. If it's on 8000, modify `frontend/src/App.jsx` to match.
*   **"No Threats Found"**: Click "Refresh Feed". If OTX returns 0 results (limit reached), the system will generate 32 mock indicators for demonstration.
*   **"Port Already in Use"**: If `uvicorn` fails to start, kill the process using Task Manager or change the port in the command (e.g., `--port 8002`).

---

## 9. Deployment (Cloud)
For detailed instructions on deploying this application to **Render (Backend)** and **Vercel (Frontend)**, please refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) file included in this package.
