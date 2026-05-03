# 🎨 View Frontend Without Backend - Development Mode Guide

## 🚀 Quick Start (No Backend Needed!)

You can view and test all frontend pages without setting up the backend. Here's how:

### Method 1: Auto-Login (Recommended)

**Step 1:** Modify the auth store to auto-login in development

Open `frontend/src/store/authStore.ts` and add this at the bottom:

```typescript
// Development mode: Auto-login
if (import.meta.env.DEV) {
  useAuthStore.getState().setUser({
    id: 'dev-user-1',
    email: 'demo@complianceguard.com',
    name: 'Demo User',
    role: 'analyst',
  });
  useAuthStore.getState().setToken('dev-token-123');
}
```

**Step 2:** Start the app

```bash
cd frontend
npm install  # First time only
npm run dev
```

**Step 3:** Open browser

```
http://localhost:3000
```

You'll be automatically logged in and can navigate to all pages!

---

### Method 2: Manual Login Bypass

**Option A: Click Through Login**

1. Start the app: `npm run dev`
2. Go to `http://localhost:3000`
3. On login page, enter ANY email/password
4. The login will fail, but you can manually set auth in browser console:

```javascript
// Open browser console (F12) and paste:
localStorage.setItem('auth-storage', JSON.stringify({
  state: {
    user: {
      id: 'dev-1',
      email: 'demo@complianceguard.com',
      name: 'Demo User',
      role: 'analyst'
    },
    token: 'dev-token',
    isAuthenticated: true
  },
  version: 0
}));
// Then refresh the page
location.reload();
```

**Option B: Direct URL Access**

After setting auth in console, you can directly visit any page:
- `http://localhost:3000/dashboard`
- `http://localhost:3000/transactions`
- `http://localhost:3000/cases`
- `http://localhost:3000/ai-analyst`
- etc.

---

### Method 3: Mock API Responses

**Step 1:** Create a development API service

Create `frontend/src/services/mockApi.ts`:

```typescript
import { mockMetrics, mockAlerts, mockActivities, mockTransactions } from '@/utils/mockData';

export const mockApiService = {
  getMetrics: async () => ({ success: true, data: mockMetrics }),
  getAlerts: async () => ({ success: true, data: { data: mockAlerts, total: mockAlerts.length, page: 1, pageSize: 10, totalPages: 1 } }),
  getActivity: async () => ({ success: true, data: { data: mockActivities, total: mockActivities.length, page: 1, pageSize: 10, totalPages: 1 } }),
  getTransactions: async () => ({ success: true, data: { data: mockTransactions, total: mockTransactions.length, page: 1, pageSize: 20, totalPages: 1 } }),
  // Add more as needed
};
```

**Step 2:** Use mock API in development

In your pages, conditionally use mock data:

```typescript
// In Dashboard.tsx or any page
const isDev = import.meta.env.DEV;

const { data: metricsData } = useQuery({
  queryKey: ['metrics'],
  queryFn: isDev 
    ? () => Promise.resolve({ success: true, data: mockMetrics })
    : () => apiService.getMetrics(),
});
```

---

## 📱 Pages You Can View

Once logged in (using any method above), you can access:

### ✅ Main Pages
1. **Dashboard** - `/dashboard`
   - Compliance Health Index
   - Metrics cards
   - Alerts feed
   - Activity timeline

2. **Transactions** - `/transactions`
   - Transaction table
   - Search and filters
   - Click any row for details

3. **Transaction Detail** - `/transactions/tx-001`
   - Full transaction information
   - Risk score
   - Triggered rules

4. **Cases** - `/cases`
   - Case management overview
   - Status cards

5. **Case Detail** - `/cases/case-001`
   - Individual case view

6. **AI Analyst** - `/ai-analyst`
   - Chat interface
   - Quick actions

7. **AML Monitor** - `/aml-monitor`
   - AML compliance view

8. **KYC Review** - `/kyc-review`
   - KYC compliance view

9. **Basel Monitor** - `/basel-monitor`
   - Basel III compliance view

10. **Reports** - `/reports`
    - Report generation interface

11. **Settings** - `/settings`
    - User settings

---

## 🎯 Testing Features Without Backend

### Test Navigation
- Click sidebar items to navigate
- All routes work without backend
- Protected routes work with auto-login

### Test UI Components
- All buttons are clickable
- Forms are interactive
- Modals and dropdowns work
- Loading states can be simulated

### Test Responsive Design
- Resize browser window
- Test mobile view (F12 → Toggle device toolbar)
- All layouts are responsive

### Test Dark Theme
- The entire app uses dark theme
- All colors and contrasts work

---

## 🔧 Development Tips

### 1. Hot Reload
Changes to code automatically refresh the browser. No need to restart!

### 2. View Component Isolation
Test individual components by creating a test page:

```typescript
// Create frontend/src/pages/ComponentTest.tsx
import MetricsCard from '@/components/dashboard/MetricsCard';
import { TrendingUp } from 'lucide-react';

export default function ComponentTest() {
  return (
    <div className="p-6 space-y-6">
      <MetricsCard
        title="Test Metric"
        value="1,234"
        change={5.2}
        trend="up"
        icon={TrendingUp}
      />
    </div>
  );
}
```

### 3. Mock Different States
Test loading, error, and empty states:

```typescript
// Simulate loading
const [isLoading, setIsLoading] = useState(true);
setTimeout(() => setIsLoading(false), 2000);

// Simulate error
const [error, setError] = useState('API Error');

// Simulate empty data
const [data, setData] = useState([]);
```

### 4. Browser DevTools
- **F12** - Open DevTools
- **Console** - View logs and errors
- **Network** - See API calls (will fail without backend)
- **Elements** - Inspect HTML/CSS
- **Responsive** - Test mobile views

---

## 🎨 Customization

### Change Mock Data
Edit `frontend/src/utils/mockData.ts` to customize:
- Metrics values
- Alert messages
- Transaction amounts
- User names
- Dates and times

### Add New Mock Data
```typescript
export const mockNewFeature = {
  // Your mock data here
};
```

### Test Different User Roles
Change the user role in auth setup:
```typescript
role: 'executive'  // or 'compliance_officer'
```

---

## 🚀 Quick Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 What You Can Demo

**Without any backend, you can demonstrate:**

✅ **Complete UI/UX** - All pages, navigation, responsive design
✅ **Component Library** - Buttons, cards, forms, tables
✅ **Dark Theme** - Professional FinTech appearance
✅ **Routing** - All page navigation works
✅ **Authentication Flow** - Login page and protected routes
✅ **Dashboard** - Metrics, charts, activity feeds
✅ **Data Tables** - Transaction and case listings
✅ **Forms** - Settings, search, filters
✅ **AI Interface** - Chat UI for compliance assistant
✅ **Responsive Design** - Mobile, tablet, desktop views

**Perfect for:**
- Client presentations
- UI/UX reviews
- Frontend development
- Design feedback
- Hackathon demos

---

## 🆘 Troubleshooting

### "Cannot access before initialization"
- Make sure you've run `npm install`
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Module not found"
- Check file paths are correct
- Restart your IDE
- Clear cache: `rm -rf node_modules && npm install`

### Pages show loading forever
- API calls are failing (expected without backend)
- Use mock data methods above
- Check browser console for errors

### Styles not loading
- Make sure `npm run dev` is running
- Check `src/index.css` is imported in `main.tsx`
- Clear browser cache (Ctrl+Shift+R)

---

**You now have a fully functional frontend that works without any backend!** 🎉

Perfect for development, testing, and demonstrations.