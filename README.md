# ComplianceGuard - AI-Powered Compliance Management System

Enterprise-grade compliance monitoring with IBM watsonx Orchestrate integration and Instana observability.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm

### Backend Setup
```bash
cd skeleton
mvn quarkus:dev -DskipTests
# Backend runs on http://localhost:8081
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Access Application
Open browser to: **http://localhost:5173**

---

## 📋 Features

### ✅ Implemented
- **Transaction Ingestion** - Submit financial transactions for compliance scanning
- **Contract Review** - Analyze contracts for jurisdiction compliance
- **KYC Verification** - Process Know Your Customer data
- **Report Analysis** - Submit compliance reports for anomaly detection
- **Audit Logs** - View and filter compliance scan results with risk scores
- **Real-time Monitoring** - Instana observability integration
- **AI-Powered Analysis** - IBM watsonx Orchestrate workflow integration

### 🎯 Tech Stack
- **Backend**: Quarkus 3.x, Java 17, RESTful API
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **AI/ML**: IBM watsonx Orchestrate
- **Observability**: IBM Instana, OpenTelemetry
- **Architecture**: Event-driven, microservices-ready

---

## 📊 API Endpoints

### Ingestion Endpoints (POST)
- `/api/ingest/transaction` - Submit transaction data
- `/api/ingest/contract` - Submit contract data
- `/api/ingest/kyc` - Submit KYC records
- `/api/ingest/report` - Submit compliance reports

### Query Endpoints (GET)
- `/api/audit/logs?traceId=&limit=&offset=` - Retrieve audit logs
- `/api/health` - System health check

All ingestion endpoints return **202 Accepted** with traceId for tracking.

---

## 🧪 Test Data Examples

### High-Risk Transaction (Triggers Violations)
```
Transaction ID: TXN-TEST-001
Amount: 50000
Currency: USD
Origin Country: US
Destination Country: IR  (High-risk country)
Customer ID: CUST-12345
```

**Expected**: HIGH risk level, violations for HIGH_RISK_COUNTRY and AML_THRESHOLD

### Normal Transaction (Clean)
```
Transaction ID: TXN-TEST-002
Amount: 5000
Currency: USD
Origin Country: US
Destination Country: CA
Customer ID: CUST-67890
```

**Expected**: LOW risk level, no violations

### High-Risk Countries
IR (Iran), KP (North Korea), SY (Syria), CU (Cuba), SD (Sudan), MM (Myanmar), LY (Libya), SO (Somalia), YE (Yemen), AF (Afghanistan)

---

## 🏗️ Project Structure

```
ComplianceGuardian/
├── skeleton/                    # Backend (Quarkus)
│   ├── src/main/java/com/guard/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── engine/             # Compliance rules
│   │   ├── model/              # Data models
│   │   ├── repository/         # Data access
│   │   └── client/             # External integrations
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── api/                # Backend integration
│   │   ├── components/         # UI components
│   │   ├── pages/              # Application pages
│   │   ├── App.tsx             # Main app
│   │   └── main.tsx            # Entry point
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS
│   └── package.json
│
└── README.md                    # This file
```

---

## 🔧 Configuration

### Backend (application.properties)

**Instana Integration**:
```properties
quarkus.opentelemetry.enabled=true
quarkus.opentelemetry.tracer.exporter.otlp.endpoint=https://ingress-blue-saas.instana.io:443/traces
instana.agent.key=nUMoydJTSF2BSbwtIL4iQw
```

**watsonx Orchestrate**:
```properties
orchestrate/mp-rest/url=https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/3b166c41-87bb-4af3-af7d-6f04eadb798b
compliance.orchestrate.api-key=eSPUgXDmVjpwb0-DSbMJmKPgJYfPslisn5aQ3TsEtTz4
```

### Frontend (vite.config.ts)

**API Proxy**:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

---

## 🎬 Demo Workflow

1. **Start Services** (2 terminals)
   - Terminal 1: `cd skeleton && mvn quarkus:dev -DskipTests`
   - Terminal 2: `cd frontend && npm run dev`

2. **Access Dashboard** - http://localhost:5173
   - View system status
   - See quick action cards

3. **Submit High-Risk Transaction**
   - Navigate to Transaction page
   - Use test data above (Iran destination)
   - Note the traceId

4. **View Audit Logs**
   - Navigate to Audit Logs page
   - Filter by traceId
   - Expand to see violations
   - Observe HIGH risk level

5. **Monitor in Instana**
   - Access Instana dashboard
   - Search for traceId
   - View distributed trace
   - Check performance metrics

---

## 🔍 Compliance Rules

### Implemented Rules
1. **AML_THRESHOLD** - Transactions ≥ $10,000
2. **HIGH_RISK_COUNTRY** - Sanctioned countries (IR, KP, SY, etc.)
3. **BASEL_III_EXPOSURE** - Large exposure limits
4. **CONTRACT_JURISDICTION** - Problematic jurisdictions
5. **KYC_MISSING_CUSTOMER_ID** - Missing customer identification
6. **REPORT_ANOMALY** - Statistical anomalies in reports

### Risk Levels
- **LOW** (0-30): Normal operations
- **MEDIUM** (31-70): Requires review
- **HIGH** (71-100): Immediate attention required

---

## 📈 Monitoring & Observability

### Instana Dashboard
- **Service**: compliance-guard
- **Traces**: All API requests with traceId
- **Metrics**: Request rate, latency, error rate
- **Alerts**: Configurable thresholds

### Logging
All logs include traceId and spanId for correlation:
```
2024-01-15 10:30:00,123 INFO [com.guard.service] [traceId=abc-123 spanId=456] Transaction processed
```

---

## 🚀 Production Deployment

### Backend
```bash
cd skeleton
mvn clean package -DskipTests
java -jar target/quarkus-app/quarkus-run.jar
```

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ directory to static hosting
```

### Docker (Optional)
```bash
# Backend
cd skeleton
mvn package -DskipTests
docker build -f src/main/docker/Dockerfile.jvm -t compliance-guard-backend .

# Frontend
cd frontend
npm run build
docker build -t compliance-guard-frontend .
```

---

## 🧪 Testing

### Backend Tests
```bash
cd skeleton
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Testing
1. Start both services
2. Submit test transactions
3. Verify in audit logs
4. Check Instana traces

---

## 📚 Additional Documentation

- **Frontend README**: `frontend/README.md` - Detailed frontend setup
- **API Spec**: OpenAPI/Swagger available at `/q/swagger-ui` (when backend running)
- **Instana**: https://ingress-blue-saas.instana.io
- **watsonx Orchestrate**: IBM Cloud console

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

Part of the ComplianceGuard project.

---

## 🎯 Key Achievements

✅ Full-stack compliance management system
✅ AI-powered risk analysis with watsonx Orchestrate
✅ Real-time observability with Instana
✅ Modern React + TypeScript frontend
✅ Enterprise-ready Quarkus backend
✅ Complete API integration
✅ Professional UI/UX
✅ Comprehensive audit trails
✅ Distributed tracing
✅ Production-ready architecture

---

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review API endpoints
3. Check Instana for traces
4. Verify configuration

**System Status**: ✅ Fully Operational
**Frontend**: http://localhost:5173
**Backend**: http://localhost:8081
**Instana**: https://ingress-blue-saas.instana.io

---

**Built with ❤️ for enterprise compliance management**
