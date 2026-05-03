# ComplianceGuard Frontend - Complete Setup Guide

## 🔧 How to Fix All Errors

### Step 1: Install Dependencies

The TypeScript errors you're seeing are because the dependencies haven't been installed yet. Run:

```bash
cd frontend
npm install
```

This will install all required packages:
- React & React DOM
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Zustand
- Axios
- Lucide React (icons)
- date-fns
- clsx
- And all dev dependencies

**Wait for installation to complete** (may take 2-5 minutes depending on your internet speed).

### Step 2: Verify Installation

After installation completes, verify by checking:

```bash
# Check if node_modules exists
ls node_modules

# Verify package.json dependencies are installed
npm list --depth=0
```

### Step 3: All Errors Should Be Gone

Once `npm install` completes:
- ✅ All "Cannot find module" errors will disappear
- ✅ TypeScript will recognize all imports
- ✅ Your IDE will show proper autocomplete
- ✅ The app will be ready to run

---

## 🔗 How to Link Frontend to Backend

### Option 1: Using the Built-in Proxy (Recommended for Development)

The frontend is already configured to proxy API requests to your backend!

**In `vite.config.ts`, we have:**
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

**This means:**
- Frontend runs on: `http://localhost:3000`
- Backend should run on: `http://localhost:8080`
- All API calls to `/api/*` are automatically forwarded to backend

**Steps:**
1. Start your backend on port 8080:
   ```bash
   # In your backend directory
   mvn spring-boot:run
   # OR
   java -jar target/your-backend.jar
   ```

2. Start your frontend:
   ```bash
   # In frontend directory
   npm run dev
   ```

3. Open browser: `http://localhost:3000`

**That's it!** The frontend will automatically communicate with the backend.

### Option 2: Change Backend Port (If Backend Runs on Different Port)

If your backend runs on a different port (e.g., 8081), update `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8081',  // Change this
      changeOrigin: true,
    },
  },
}
```

### Option 3: Using Environment Variables (Production)

For production or different environments:

1. Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:8080/api
```

2. Update `src/services/api.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ... rest of config
});
```

3. For production, set the actual backend URL:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🚀 Complete Startup Guide

### 1. First Time Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Wait for completion...
```

### 2. Start Development

```bash
# Terminal 1 - Start Backend (in backend directory)
cd ../backend  # or wherever your backend is
mvn spring-boot:run

# Terminal 2 - Start Frontend (in frontend directory)
cd frontend
npm run dev
```

### 3. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the login page!

---

## 🔍 Troubleshooting Common Issues

### Issue 1: "npm: command not found"

**Solution:** Install Node.js
```bash
# Download from: https://nodejs.org/
# Or use nvm:
nvm install 18
nvm use 18
```

### Issue 2: Port 3000 Already in Use

**Solution:** Kill the process or use a different port
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.ts
server: {
  port: 3001,  // Use different port
}
```

### Issue 3: Backend Connection Refused

**Symptoms:** API calls fail with "ERR_CONNECTION_REFUSED"

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:8080/api/health
   ```

2. Check backend port in `vite.config.ts` matches your backend

3. Ensure backend has CORS enabled:
   ```java
   @CrossOrigin(origins = "http://localhost:3000")
   ```

### Issue 4: TypeScript Errors After Installation

**Solution:** Restart your IDE/editor
```bash
# VS Code: Press Ctrl+Shift+P
# Type: "Reload Window"
# Or close and reopen VS Code
```

### Issue 5: Tailwind Styles Not Working

**Solution:** Ensure you have the CSS import in `main.tsx`:
```typescript
import './index.css'  // This line must be present
```

---

## 📡 Backend API Requirements

Your backend needs to expose these endpoints for the frontend to work:

### Authentication
- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/logout` - Logout endpoint

### Dashboard
- `GET /api/metrics` - Dashboard metrics

### Transactions
- `GET /api/transactions` - List transactions (with pagination)
- `GET /api/transactions/{id}` - Get single transaction
- `POST /api/upload` - Upload transaction file

### Alerts
- `GET /api/alerts` - List alerts

### Cases
- `GET /api/cases` - List cases
- `GET /api/cases/{id}` - Get single case

### Activity
- `GET /api/activity` - Recent activity

### AI
- `POST /api/ai/query` - AI chat query

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports/generate` - Generate report

**Example Response Format:**
```json
{
  "success": true,
  "data": {
    // Your data here
  },
  "error": null
}
```

---

## 🔐 CORS Configuration (Backend)

Your backend MUST allow requests from the frontend. Add this to your Spring Boot backend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## 📦 Build for Production

```bash
# Build the frontend
npm run build

# Output will be in 'dist' folder
# Deploy the 'dist' folder to your hosting service
```

---

## ✅ Quick Checklist

Before running the app, ensure:

- [ ] Node.js installed (v18 or higher)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Backend running on port 8080
- [ ] Backend has CORS enabled
- [ ] Backend API endpoints match frontend expectations
- [ ] No port conflicts (3000 for frontend, 8080 for backend)

---

## 🎯 Testing the Connection

Once both frontend and backend are running:

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Login to the app**
4. **Check Network tab** - you should see:
   - `POST /api/auth/login` - Status 200
   - `GET /api/metrics` - Status 200
   - `GET /api/alerts` - Status 200

If you see these requests succeeding, **your frontend and backend are properly connected!** 🎉

---

## 🆘 Still Having Issues?

1. **Check browser console** for JavaScript errors
2. **Check Network tab** for failed API calls
3. **Check backend logs** for errors
4. **Verify all ports** are correct
5. **Restart both frontend and backend**

---

## 📞 Need Help?

Common commands:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

**Your frontend is now ready to connect to your backend!** 🚀