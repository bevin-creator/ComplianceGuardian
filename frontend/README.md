# ComplianceGuard Frontend

React + TypeScript + Vite + Tailwind CSS frontend for the ComplianceGuard compliance management system.

## Features

- 🚀 **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- 🔌 **Full Backend Integration**: All API endpoints connected
- 📊 **Dashboard**: System status and quick actions
- 📝 **Data Ingestion**: Forms for transactions, contracts, KYC, and reports
- 📋 **Audit Logs**: View and filter compliance scan results
- 🎨 **Professional UI**: Clean, responsive design with Tailwind
- ⚡ **Fast Development**: Hot module replacement with Vite
- 🔒 **Type Safety**: Full TypeScript coverage

## Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8081

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Development

```bash
# Start development server (http://localhost:5173)
npm run dev
```

The dev server includes:
- Hot module replacement
- Proxy to backend API (`/api` → `http://localhost:8081`)
- TypeScript type checking
- Tailwind CSS compilation

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── client.ts          # HTTP client with error handling
│   │   ├── endpoints.ts       # All backend endpoint functions
│   │   └── types.ts           # TypeScript interfaces
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── Layout.tsx
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx
│   │   ├── TransactionPage.tsx
│   │   ├── ContractPage.tsx
│   │   ├── KYCPage.tsx
│   │   ├── ReportPage.tsx
│   │   └── AuditLogsPage.tsx
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles + Tailwind
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## API Integration

### Backend Endpoints

All API calls are proxied through `/api`:

**Ingestion Endpoints** (POST):
- `/api/ingest/transaction` - Submit transaction data
- `/api/ingest/contract` - Submit contract data
- `/api/ingest/kyc` - Submit KYC records
- `/api/ingest/report` - Submit compliance reports

**Query Endpoints** (GET):
- `/api/audit/logs?traceId=&limit=&offset=` - Retrieve audit logs
- `/api/health` - System health check

### Usage Example

```typescript
import { ingestTransaction, getAuditLogs } from './api/endpoints';

// Submit a transaction
const response = await ingestTransaction({
  transactionId: 'TXN-123',
  amount: 10000,
  currency: 'USD',
  originCountry: 'US',
  destinationCountry: 'GB',
  customerId: 'CUST-456'
});

console.log(response.traceId); // Use for tracking

// Fetch audit logs
const logs = await getAuditLogs({ 
  traceId: response.traceId,
  limit: 50 
});
```

## Pages

### Dashboard (`/`)
- System status overview
- Quick action cards
- Recent audit logs count
- Navigation to all features

### Transaction (`/transaction`)
- Submit financial transactions
- Form validation
- Success/error feedback with traceId

### Contract (`/contract`)
- Submit contracts for review
- Date validation
- Jurisdiction compliance check

### KYC (`/kyc`)
- Submit customer verification data
- Flexible JSON payload support
- Customer ID validation

### Report (`/report`)
- Submit compliance reports
- JSON data input
- Anomaly detection trigger

### Audit Logs (`/audit-logs`)
- View all compliance scan results
- Filter by traceId
- Expandable violation details
- Risk level badges
- Pagination support

## Styling

### Tailwind CSS

Custom utility classes defined in `src/index.css`:

```css
/* Buttons */
.btn-primary    /* Primary action button */
.btn-secondary  /* Secondary button */
.btn-danger     /* Destructive action */

/* Form elements */
.input          /* Text input field */
.label          /* Form label */

/* Layout */
.card           /* Content card */

/* Badges */
.badge-success  /* Green badge */
.badge-warning  /* Yellow badge */
.badge-danger   /* Red badge */
.badge-info     /* Blue badge */
```

### Color Scheme

Primary colors (blue):
- 50-900 scale for various UI elements
- Defined in `tailwind.config.js`

## Error Handling

All API calls include:
- Network error handling
- HTTP error status handling
- User-friendly error messages
- Loading states
- Success confirmations

## Development Tips

1. **Backend Must Be Running**: Ensure Quarkus backend is running on port 8081
2. **CORS**: Backend has CORS enabled for localhost:5173
3. **Hot Reload**: Changes auto-reload in browser
4. **TypeScript**: Use strict type checking for safety
5. **Console Logs**: Check browser console for API request/response logs

## Testing the Integration

1. Start backend: `cd skeleton && mvn quarkus:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Submit a transaction
5. Check audit logs for the result
6. Verify traceId matches

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts
server: { port: 3000 }
```

### API Connection Failed
- Verify backend is running on port 8081
- Check browser console for CORS errors
- Ensure proxy configuration is correct

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

```bash
# Build optimized bundle
npm run build

# Output in dist/ directory
# Serve with any static file server
```

## Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS
- **React Router**: Client-side routing

## License

Part of the ComplianceGuard project.