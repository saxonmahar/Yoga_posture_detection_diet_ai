@echo off
echo Starting Yoga AI Application...
echo.

echo Starting Backend Server (Port 5001)...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Photo Server (Port 5010)...
start "Photo Server" cmd /k "cd backend && node photo-server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Port 3002)...
start "Frontend" cmd /k "cd frontend && npm run dev -- --port 3002"

timeout /t 3 /nobreak >nul

echo Starting ML API (Port 5000)...
start "ML API" cmd /k "cd backend/Ml && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Diet API (Port 8080)...
start "Diet API" cmd /k "cd backend/Diet_Recommendation_System && python app.py"

echo.
echo All servers are starting...
echo - Backend: http://localhost:5001
echo - Photo Server: http://localhost:5010
echo - Frontend: http://localhost:3002
echo - ML API: http://localhost:5000
echo - Diet API: http://localhost:8080
echo.
pause