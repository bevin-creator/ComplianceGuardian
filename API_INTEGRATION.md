# ComplianceGuard API Integration Guide

## Overview

This document describes the integration between the ComplianceGuard React frontend and Quarkus backend.

## Architecture

```
Frontend (React + Vite)     Backend (Quarkus)
Port: 3000                  Port: 8081
├─ Vite Dev Server         ├─ REST API (/api/*)
├─ Proxy: /api → :8081     ├─ Health Check (/health)
└─ API Service Layer       ├─ Audit Logs (/audit/*)
                           ├─ Ingest (/ingest/*)
                           └─ Metrics (/q/metrics)
```

## Configuration

### Backend Configuration

**File:** `skeleton/src/main/resources/application.properties`

```properties
quarkus.http.port=8081
quarkus.application.name=Compliance Guard
quarkus.application.version=2.0.0
```

### Frontend Configuration

**File:** `frontend/vite.config.ts`

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    },
  },
}
```

**File:** `frontend/.env` (optional)

```bash
# Override API URL if needed
VITE_API_URL=http://localhost:8081/api
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "analyst",
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true
}
```

### Dashboard Metrics

#### GET /api/metrics
Get dashboard metrics summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 15847,
    "flaggedTransactions": 234,
    "complianceScore": 94.5,
    "openCases": 12,
    "resolvedCases": 156,
    "criticalAlerts": 3,
    "amlViolations": 45,
    "kycDeficiencies": 23,
    "baselBreaches": 8
  }
}
```

### Transactions

#### GET /api/transactions
Get paginated list of transactions.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20)
- `search` (optional)
- `status` (optional): pending, flagged, cleared, escalated
- `riskLevel` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 234,
    "page": 1,
    "pageSize": 20,
    "totalPages": 12
  }
}
```

#### GET /api/transactions/{id}
Get single transaction details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "TXN-12345",
    "customerId": "CUST-001",
    "customerName": "John Doe",
    "amount": 125000.00,
    "currency": "USD",
    "country": "US",
    "jurisdiction": "New York",
    "timestamp": "2026-05-02T17:00:00Z",
    "riskScore": 75,
    "status": "flagged",
    "violationType": "AML",
    "rulesTriggered": ["AML-001", "AML-003"]
  }
}
```

#### POST /api/upload
Upload transaction file for batch processing.

**Content-Type:** `multipart/form-data`

**Response:**
```json
{
  "success": true,
  "data": {
    "processed": 150
  }
}
```

### Alerts

#### GET /api/alerts
Get paginated list of alerts.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20)
- `severity` (optional): critical, high, medium, low
- `status` (optional): open, investigating, resolved

#### GET /api/alerts/{id}
Get single alert details.

#### PATCH /api/alerts/{id}/status
Update alert status.

**Request:**
```json
{
  "status": "investigating"
}
```

### Cases

#### GET /api/cases
Get paginated list of cases.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20)
- `status` (optional): open, under_review, escalated, resolved
- `severity` (optional): critical, high, medium, low

#### GET /api/cases/{id}
Get single case details with timeline.

#### POST /api/cases
Create new case.

**Request:**
```json
{
  "transactionId": "TXN-12345",
  "title": "AML Investigation",
  "severity": "high",
  "description": "Suspicious transaction pattern"
}
```

#### PATCH /api/cases/{id}
Update case details.

#### POST /api/cases/{id}/assign
Assign case to user.

**Request:**
```json
{
  "userId": "analyst-001"
}
```

### Activity Feed

#### GET /api/activity
Get paginated activity feed.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20)
- `type` (optional): transaction, alert, case, report

### Compliance Rules

#### GET /api/rules
Get all compliance rules.

#### PATCH /api/rules/{id}
Update compliance rule.

**Request:**
```json
{
  "enabled": false
}
```

### AI Assistant

#### POST /api/ai/query
Query AI assistant.

**Request:**
```json
{
  "query": "What are the top compliance risks?",
  "context": {}
}
```

#### POST /api/ai/explain
Get AI explanation for transaction.

**Request:**
```json
{
  "transactionId": "TXN-12345"
}
```

#### POST /api/ai/generate-sar
Generate Suspicious Activity Report.

**Request:**
```json
{
  "caseId": "CASE-12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "SUSPICIOUS ACTIVITY REPORT\n\n..."
  }
}
```

#### GET /api/ai/compliance-summary
Get AI-generated compliance summary.

### Reports

#### GET /api/reports
Get all reports.

#### POST /api/reports/generate
Generate new report.

**Request:**
```json
{
  "type": "AML",
  "params": {}
}
```

#### GET /api/reports/{id}/download
Download report file.

**Response:** Binary file (PDF)

### Health & Monitoring

#### GET /health
Custom health check endpoint.

**Response:**
```json
{
  "status": "UP",
  "service": "Compliance Guard",
  "version": "2.0.0",
  "timestamp": "2026-05-02T17:00:00Z"
}
```

#### GET /q/health/live
Kubernetes liveness probe.

#### GET /q/health/ready
Kubernetes readiness probe.

#### GET /q/metrics
Prometheus metrics endpoint.

### Audit Logs

#### GET /audit/logs
Get audit logs (read-only).

**Query Parameters:**
- `traceId` (optional): Filter by trace ID
- `limit` (default: 100, max: 1000)
- `offset` (default: 0)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "count": 50
  }
}
```

### Data Ingestion

#### POST /ingest/transaction
Ingest transaction for compliance scanning.

**Request:**
```json
{
  "transactionId": "TXN-12345",
  "amount": 50000,
  "currency": "USD",
  "country": "US"
}
```

**Response:** 202 Accepted
```json
{
  "status": "accepted",
  "traceId": "trace-123",
  "eventId": "event-456"
}
```

#### POST /ingest/contract
Ingest contract for compliance scanning.

#### POST /ingest/kyc
Ingest KYC record for compliance scanning.

#### POST /ingest/report
Ingest report for compliance scanning.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `202 Accepted` - Async processing started
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Authentication

The frontend uses JWT tokens for authentication:

1. User logs in via `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in all requests: `Authorization: Bearer <token>`
5. Backend validates token on protected endpoints

## CORS Configuration

CORS is configured in `skeleton/src/main/java/com/guard/config/CorsConfig.java`:

- Allows all origins (development mode)
- Allows credentials
- Supports common HTTP methods
- Caches preflight requests

**Production Note:** Update CORS configuration to allow only specific origins.

## Running the Application

### Start Backend

```bash
cd skeleton
./mvnw quarkus:dev
```

Backend will run on: http://localhost:8081

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:3000

### Access Application

Open browser to: http://localhost:3000

The frontend will automatically proxy API requests to the backend.

## Development Workflow

1. **Backend Changes:**
   - Edit Java files in `skeleton/src/main/java/`
   - Quarkus hot-reload will automatically restart
   - Test endpoints using curl or Postman

2. **Frontend Changes:**
   - Edit React files in `frontend/src/`
   - Vite hot-reload will automatically update browser
   - API calls go through proxy to backend

3. **Testing Integration:**
   - Start both backend and frontend
   - Login at http://localhost:3000
   - Navigate through the application
   - Check browser console for API errors
   - Check backend logs for request processing

## Troubleshooting

### Frontend can't connect to backend

1. Check backend is running on port 8081
2. Check frontend proxy configuration in `vite.config.ts`
3. Check CORS configuration in backend
4. Check browser console for errors

### 401 Unauthorized errors

1. Check JWT token is stored in localStorage
2. Check token is included in request headers
3. Check token hasn't expired

### CORS errors

1. Check `CorsConfig.java` is properly configured
2. Check backend logs for CORS-related errors
3. Verify `Access-Control-Allow-Origin` header in response

### Port conflicts

1. Backend: Change `quarkus.http.port` in `application.properties`
2. Frontend: Change `server.port` in `vite.config.ts`
3. Update proxy configuration to match new backend port

## Next Steps

1. **Implement Real Authentication:**
   - Replace mock login with real JWT generation
   - Add user management and role-based access control
   - Integrate with enterprise SSO/LDAP

2. **Connect to Real Data:**
   - Replace mock data with database queries
   - Implement repository layer for transactions, alerts, cases
   - Add data persistence

3. **Add Real AI Integration:**
   - Connect to actual AI/ML services
   - Implement real transaction analysis
   - Add natural language processing

4. **Production Hardening:**
   - Update CORS to allow specific origins only
   - Add rate limiting
   - Implement proper error handling
   - Add request validation
   - Set up monitoring and logging

## Support

For issues or questions:
- Check backend logs: `skeleton/target/quarkus.log`
- Check frontend console: Browser DevTools
- Review API documentation above
- Test endpoints with curl or Postman

---

**Made with Bob**