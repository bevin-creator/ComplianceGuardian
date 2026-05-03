# ComplianceGuard Quick Start Guide

## Launch the App (No Database Required)

The app can run with mock data initially, so you don't need PostgreSQL to get started.

### Step 1: Start the Backend

Open a terminal in the project root and run:

```powershell
# Windows PowerShell
cd skeleton
..\mvnw.cmd quarkus:dev
```

Or if you're using Git Bash or WSL:
```bash
cd skeleton
../mvnw quarkus:dev
```

**What to expect:**
- Maven will download dependencies (first time only, takes 2-3 minutes)
- Quarkus will start on port 8081
- You'll see: `Listening on: http://localhost:8081`
- Press `Ctrl+C` to stop

**Note:** You may see database connection errors - that's OK! The API will still work with mock data.

### Step 2: Start the Frontend

Open a **NEW** terminal (keep backend running) and run:

```powershell
# Windows PowerShell
cd frontend
npm install
npm run dev
```

**What to expect:**
- npm will install dependencies (first time only, takes 1-2 minutes)
- Vite will start on port 3000
- You'll see: `Local: http://localhost:3000/`
- Browser should open automatically
- Press `Ctrl+C` to stop

### Step 3: Use the App

1. **Open Browser:** http://localhost:3000
2. **Login:** Use any email/password (mock authentication)
   - Example: `test@example.com` / `password`
3. **Explore:** Navigate through dashboard, transactions, alerts, cases

## Troubleshooting

### Backend won't start

**Error: "mvnw.cmd is not recognized"**
```powershell
# Make sure you're in the skeleton directory
cd skeleton
# Then run from parent directory
..\mvnw.cmd quarkus:dev
```

**Error: "Java not found"**
- Install Java 17 or higher from https://adoptium.net/
- Verify: `java -version`

### Frontend won't start

**Error: "npm is not recognized"**
- Install Node.js from https://nodejs.org/
- Verify: `node -version` and `npm -version`

**Error: "Port 3000 already in use"**
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Can't access the app

**Backend not responding:**
- Check backend terminal for errors
- Verify it says "Listening on: http://localhost:8081"
- Test: http://localhost:8081/health

**Frontend not loading:**
- Check frontend terminal for errors
- Verify it says "Local: http://localhost:3000"
- Clear browser cache and reload

## What Works Without Database

✅ **Working Features (Mock Data):**
- Login/Logout
- Dashboard with metrics
- Transaction list and details
- Alert list and details
- Case list and details
- Activity feed
- AI assistant queries
- Report generation

❌ **Not Working Without Database:**
- Data persistence (changes won't save)
- Real user authentication
- Case timeline history
- Audit logs

## Next: Add Database (Optional)

To enable full features with data persistence:

1. **Install PostgreSQL** from https://www.postgresql.org/download/
2. **Create Database:**
   ```sql
   CREATE DATABASE complianceguard;
   CREATE USER complianceguard WITH PASSWORD 'complianceguard';
   GRANT ALL PRIVILEGES ON DATABASE complianceguard TO complianceguard;
   ```
3. **Restart Backend** - It will auto-create tables and load sample data
4. **Login with Demo User:**
   - Email: `analyst@complianceguard.com`
   - Password: `password`

See `DATABASE_SETUP.md` for detailed instructions.

## Common Commands

### Backend
```powershell
# Start backend
cd skeleton
..\mvnw.cmd quarkus:dev

# Stop backend
# Press Ctrl+C in terminal

# Clean and rebuild
..\mvnw.cmd clean compile
```

### Frontend
```powershell
# Start frontend
cd frontend
npm run dev

# Stop frontend
# Press Ctrl+C in terminal

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Development Tips

1. **Hot Reload:** Both backend and frontend auto-reload on file changes
2. **API Testing:** Use browser DevTools Network tab to see API calls
3. **Backend Logs:** Check backend terminal for request logs
4. **Frontend Logs:** Check browser console for errors

## Need Help?

- **API Documentation:** See `API_INTEGRATION.md`
- **Database Setup:** See `DATABASE_SETUP.md`
- **Integration Details:** See `INTEGRATION_COMPLETE.md`

---

**Made with Bob**