@echo off
echo Starting Cyber Threat Intelligence Monitoring System...

echo Starting Backend...
start "Threat Monitor Backend" cmd /k "cd backend && npm start"

echo Starting Frontend...
start "Threat Monitor Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
