# ComplianceGuard - Quick Start Guide

## ✅ Current Status
- ✅ Database: PostgreSQL running on port 5432
- 🔄 Backend: Starting on port 8080
- ⏳ Frontend: Ready to start on port 3000

## Start the Application

### 1. Database (Already Running)
```bash
cd ComplianceGuardian
docker-compose up -d
```

### 2. Backend (Currently Starting)
```bash
cd ComplianceGuardian/backend
.\mvnw.cmd quarkus:dev
```

Wait for this message:
```
Listening on: http://localhost:8080
```

### 3. Frontend (Next Step)
Open a NEW terminal:
```bash
cd ComplianceGuardian/frontend
npm install  # First time only
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## Test the Backend

### Health Check
```bash
curl http://localhost:8080/q/health
```

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"fullName\":\"Admin User\",\"role\":\"admin\"}"
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Get Dashboard Metrics
```bash
curl http://localhost:8080/api/metrics
```

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/metrics` - Dashboard statistics

### Transactions
- `GET /api/transactions` - List transactions (with pagination)
- `GET /api/transactions/{id}` - Get single transaction
- `POST /api/transactions/upload` - Bulk upload

### Alerts
- `GET /api/alerts` - List alerts
- `GET /api/alerts/{id}` - Get single alert
- `PUT /api/alerts/{id}/status` - Update status
- `PUT /api/alerts/{id}/assign` - Assign to user
- `PUT /api/alerts/{id}/resolve` - Resolve alert

### Cases
- `GET /api/cases` - List cases
- `GET /api/cases/{id}` - Get single case
- `POST /api/cases` - Create case
- `PUT /api/cases/{id}` - Update case
- `PUT /api/cases/{id}/assign` - Assign case
- `POST /api/cases/{id}/notes` - Add note
- `PUT /api/cases/{id}/close` - Close case

### Activity Feed
- `GET /api/activity` - Activity feed
- `GET /api/activity/recent` - Recent activities
- `POST /api/activity` - Log activity

### Compliance Rules
- `GET /api/rules` - List rules
- `GET /api/rules/{id}` - Get single rule
- `POST /api/rules` - Create rule
- `PUT /api/rules/{id}` - Update rule
- `PUT /api/rules/{id}/toggle` - Enable/disable
- `DELETE /api/rules/{id}` - Delete rule

### Reports
- `GET /api/reports/summary` - Summary report
- `GET /api/reports/compliance` - Compliance report
- `GET /api/reports/risk-analysis` - Risk analysis
- `GET /api/reports/activity` - Activity report

## Troubleshooting

### Backend won't start
1. Check if PostgreSQL is running: `docker ps`
2. Check database connection in `application.properties`
3. Check logs for errors

### Frontend won't connect
1. Verify backend is running on port 8080
2. Check CORS configuration in `application.properties`
3. Verify proxy in `vite.config.ts`

### Database connection errors
1. Ensure Docker Desktop is running
2. Check PostgreSQL container: `docker logs complianceguard-db`
3. Verify credentials match in docker-compose.yml and application.properties

## Development Tips

### Hot Reload
- **Backend**: Quarkus dev mode auto-reloads on code changes
- **Frontend**: Vite auto-reloads on file changes

### Database Console
Access PostgreSQL:
```bash
docker exec -it complianceguard-db psql -U complianceguard -d complianceguard
```

### View Logs
```bash
# Backend logs: In the terminal where mvnw is running
# Database logs: docker logs complianceguard-db
# Frontend logs: In the terminal where npm run dev is running
```

## Next Steps

1. ✅ Wait for backend to fully start
2. ⏳ Start frontend in a new terminal
3. ⏳ Open http://localhost:3000 in browser
4. ⏳ Register/login and test the application
5. ⏳ Create sample data (transactions, alerts, cases)
6. ⏳ Test all features

## Architecture

```
Frontend (React)          Backend (Quarkus)        Database (PostgreSQL)
Port 3000                 Port 8080                Port 5432
    |                          |                         |
    |-- HTTP/REST API -------->|                         |
    |                          |-- JDBC Connection ----->|
    |<----- JSON Response -----|                         |
```

## Support

For issues, check:
- `BACKEND_FRONTEND_INTEGRATION.md` - Full integration details
- `DATABASE_SETUP.md` - Database setup options
- Backend logs in terminal
- Browser console for frontend errors