@echo off
echo Starting AbuseIPDB Threat Monitor...

start "ThreatMonitor Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8001"
start "ThreatMonitor Frontend" cmd /k "cd frontend && npm run dev"

echo Services started in separate windows.
echo Backend: http://localhost:8001/docs
echo Frontend: http://localhost:5173
pause
