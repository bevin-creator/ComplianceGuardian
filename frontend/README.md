# ComplianceGuard Frontend

AI-Powered Compliance Platform - React Frontend Application

## 🚀 Features

### Core Functionality
- ✅ **Authentication System** - Secure login with protected routes
- ✅ **Dashboard** - Real-time compliance metrics and health monitoring
- ✅ **Transaction Management** - Search, filter, and review transactions
- ✅ **Case Management** - Track and manage compliance cases
- ✅ **AI Compliance Analyst** - AI-powered insights and assistance
- ✅ **Reporting** - Generate compliance reports (AML, KYC, Basel III, SAR)
- ✅ **Multi-Module Monitoring** - AML, KYC, and Basel III dedicated views

### Technical Features
- ⚡ **React 18** with TypeScript
- 🎨 **Tailwind CSS** - Custom dark theme
- 🔄 **React Query** - Efficient data fetching and caching
- 🗂️ **Zustand** - Lightweight state management
- 🛣️ **React Router v6** - Client-side routing with protected routes
- 📊 **Recharts** - Data visualization (ready to integrate)
- 🎯 **Lucide React** - Beautiful icon system
- 📱 **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── dashboard/       # Dashboard-specific components
│   │       ├── MetricsCard.tsx
│   │       ├── AlertItem.tsx
│   │       └── ActivityFeed.tsx
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── TransactionDetail.tsx
│   │   ├── Cases.tsx
│   │   ├── CaseDetail.tsx
│   │   ├── AIAnalyst.tsx
│   │   ├── AMLMonitor.tsx
│   │   ├── KYCReview.tsx
│   │   ├── BaselMonitor.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── store/               # State management
│   │   └── authStore.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── format.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### Backend Integration
The frontend is configured to proxy API requests to `http://localhost:8080` in development mode. Update `vite.config.ts` if your backend runs on a different port.

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Dark Background**: #0f172a, #1e293b, #334155
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Components
All UI components follow a consistent design pattern:
- Dark theme optimized
- Hover states
- Loading states
- Error states
- Responsive design

## 📊 Key Pages

### Dashboard
- Compliance Health Index (CHI)
- Key metrics (transactions, violations, cases)
- Critical alerts feed
- Recent activity timeline
- Violation breakdown by type

### Transactions
- Searchable transaction table
- Advanced filtering
- Risk score visualization
- Status badges
- Detailed transaction view

### AI Analyst
- Chat interface for compliance queries
- Quick action buttons
- AI-powered insights
- Report generation

### Case Management
- Case status tracking
- Assignment management
- Timeline view
- SAR filing status

## 🔐 Authentication

The app uses JWT-based authentication:
1. Login with credentials
2. Token stored in localStorage
3. Protected routes check authentication
4. Auto-redirect to login if unauthorized

**Demo Credentials:**
- Email: `demo@complianceguard.com`
- Password: `demo123`

## 🚦 API Integration

All API calls are centralized in `src/services/api.ts`:

```typescript
// Example usage
import apiService from '@/services/api';

// Fetch metrics
const metrics = await apiService.getMetrics();

// Get transactions
const transactions = await apiService.getTransactions({ page: 1, pageSize: 20 });

// Upload file
await apiService.uploadTransactions(file);
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layout, collapsible sidebar
- **Tablet**: 2-column grid for cards
- **Desktop**: Full multi-column layout with fixed sidebar

## 🎯 State Management

### Zustand Store (Auth)
```typescript
const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### React Query (Data Fetching)
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['metrics'],
  queryFn: () => apiService.getMetrics(),
});
```

## 🧪 Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent component structure
- Proper type definitions

### Best Practices
- Component composition
- Custom hooks for reusable logic
- Proper error handling
- Loading states for all async operations
- Optimistic UI updates where appropriate

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 📝 TODO / Future Enhancements

- [ ] Add comprehensive unit tests
- [ ] Implement E2E tests with Playwright
- [ ] Add data visualization charts (Recharts integration)
- [ ] Implement real-time updates with WebSockets
- [ ] Add export functionality for reports
- [ ] Implement advanced filtering UI
- [ ] Add user role-based views
- [ ] Implement dark/light theme toggle
- [ ] Add keyboard shortcuts
- [ ] Implement offline mode with service workers

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Follow the component naming conventions
4. Add proper type definitions
5. Test responsive design
6. Ensure accessibility standards

## 📄 License

Copyright © 2024 ComplianceGuard. All rights reserved.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**