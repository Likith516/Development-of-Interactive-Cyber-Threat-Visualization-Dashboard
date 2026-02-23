# Running the Project Locally

This guide provides step-by-step instructions to set up and run the Cyber Threat Intelligence Monitoring System on your local machine.

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm**: Installed automatically with Node.js.
- **Git**: (Optional) For cloning the repository.
- **API Keys**: You will need keys for:
  - [AbuseIPDB](https://www.abuseipdb.com/)
  - [AlienVault OTX](https://otx.alienvault.com/)
  - [IPinfo](https://ipinfo.io/)

---

## 🚀 Quick Start (Windows)

If you are on Windows, you can simply run the provided startup script:

1.  Navigate to the project root directory.
2.  Double-click `start-app.bat`.

This will launch both the backend (port 5000) and frontend (port 5173) in separate command windows.

---

## 🛠️ Manual Setup

If you prefer to run the components manually or are on a different OS, follow these steps.

### 1. Backend Setup

The backend runs on Node.js/Express and handles data collection and the API.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    - Create a file named `.env` in the `backend/` folder.
    - Add the following content (replace with your actual API keys):
    ```env
    PORT=5000
    ABUSEIPDB_API_KEY=your_abuseipdb_key_here
    OTX_API_KEY=your_otx_key_here
    IPINFO_TOKEN=your_ipinfo_token_here
    REFRESH_INTERVAL=60
    ```

4.  **Start the Server:**
    ```bash
    npm start
    ```
    - The server will run at `http://localhost:5000`.
    - It will automatically create the SQLite database file (`database.sqlite`).

### 2. Frontend Setup

The frontend is a React application built with Vite.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    - The application will be accessible at `http://localhost:5173`.

---

## ✅ Verification

Once both servers are running:

1.  Open your browser and search `http://localhost:5173`.
2.  You should see the dashboard loading with system statistics.
3.  Navigate to the **IP Reputation** page and try checking an IP (e.g., `8.8.8.8`) to verify the backend connection.
