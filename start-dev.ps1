# ComplianceGuard Development Startup Script
# This script starts both backend and frontend in development mode

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ComplianceGuard Development Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Maven is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$mvnVersion = & mvn --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven from https://maven.apache.org/" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
$nodeVersion = & node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Maven installed: $($mvnVersion[0])" -ForegroundColor Green
Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend (Quarkus)..." -ForegroundColor Yellow
Write-Host "Backend will run on: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd skeleton; ./mvnw quarkus:dev" -WindowStyle Normal

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test backend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Backend is running!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠ Backend may still be starting up..." -ForegroundColor Yellow
    Write-Host "Check the backend terminal window for status" -ForegroundColor Yellow
    Write-Host ""
}

# Start Frontend
Write-Host "Starting Frontend (React + Vite)..." -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev" -WindowStyle Normal

Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Development Environment Ready!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8081" -ForegroundColor Cyan
Write-Host "Health:   http://localhost:8081/health" -ForegroundColor Cyan
Write-Host "Metrics:  http://localhost:8081/q/metrics" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Setup complete! Check the terminal windows for logs." -ForegroundColor Green

# Made with Bob
