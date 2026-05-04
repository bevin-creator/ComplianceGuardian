# ComplianceGuard

A cloud-native regulatory compliance scanning platform for banking systems.
Built with Java 21 + Quarkus 3.15, event-driven architecture, and IBM watsonx Orchestrate integration.

## Architecture

```
REST Ingestion → ComplianceEvent (traceId)
      ↓
CDI Async Event Pipeline
      ↓
Rule Engine → ScanResult (violations + risk score)
      ↓
Alert Engine → IBM watsonx Orchestrate (HIGH risk webhook)
      ↓
Audit Log → Prometheus Metrics
```

## Prerequisites

- Java 21+
- Maven 3.9+ (or use the included `mvnw` wrapper)
- Node.js 18+ (for the frontend)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/bevin-creator/ComplianceGuardian.git
cd ComplianceGuardian
```

### 2. Configure environment variables (optional)

Copy the example env file and set your values:

```bash
cp .env.example .env
```

Key variables:

```
COMPLIANCE_AI_API_KEY=your-key          # defaults to MOCK
COMPLIANCE_AI_ENDPOINT=https://...      # defaults to mock endpoint
COMPLIANCE_HIGH_RISK_COUNTRIES=IR,KP,SY # defaults to full FATF list
COMPLIANCE_ORCHESTRATE_API_KEY=your-key # watsonx Orchestrate key
COMPLIANCE_ORCHESTRATE_ENDPOINT=https://... # watsonx endpoint
```

> If no env vars are set, the system runs in mock mode — all features work with simulated responses.

### 3. Run the backend

```bash
./mvnw quarkus:dev
```

Backend starts at `http://localhost:8081`

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ingest/transaction` | Submit transaction for compliance scan |
| POST | `/ingest/contract` | Submit contract for review |
| POST | `/ingest/kyc` | Submit KYC record |
| POST | `/ingest/report` | Submit compliance report |
| GET | `/audit/logs` | Retrieve audit logs (paginated) |
| GET | `/health` | Service health check |
| GET | `/q/health` | Full SmallRye health report |
| GET | `/q/metrics` | Prometheus metrics |

## Sample Request

```bash
curl -X POST http://localhost:8081/ingest/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN-001",
    "amount": 15000,
    "currency": "USD",
    "originCountry": "US",
    "destinationCountry": "IR",
    "customerId": "",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

Response:
```json
{
  "status": "accepted",
  "traceId": "a1b2c3d4-...",
  "eventId": "b2c3d4e5-..."
}
```

Then retrieve the scan result:
```bash
curl "http://localhost:8081/audit/logs?traceId=a1b2c3d4-..."
```

## Compliance Rules

| Rule | Trigger | Risk Weight |
|---|---|---|
| AML_THRESHOLD | Amount > $10,000 | 0.35 |
| KYC_MISSING_CUSTOMER_ID | customerId null or blank | 0.30 |
| HIGH_RISK_COUNTRY | FATF jurisdiction | 0.45 |
| BASEL_III_EXPOSURE | Amount > $1,000,000 | 0.25 |
| CONTRACT_JURISDICTION | Contract in sanctioned country | 0.45 |

Risk scores are summed and capped at 1.0.
`>= 0.75` → HIGH | `>= 0.40` → MEDIUM | `< 0.40` → LOW

## Running Tests

```bash
./mvnw test
```

17 unit tests covering all compliance rules.

## Production Build

```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

## Docker

```bash
./mvnw package
docker build -f src/main/docker/Dockerfile.jvm -t complianceguard .
docker run -p 8081:8081 complianceguard
```
