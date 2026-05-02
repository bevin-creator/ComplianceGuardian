# ComplianceGuard — Architecture

## Flow

```
Ingress (REST)
      ↓
Normalize → ComplianceEvent (traceId)
      ↓
CDI Async Event
      ↓
ScanAgent
      ↓
RuleEngine → ScanResult
      ↓
AlertEngine
  ├── Risk scoring
  └── Webhook (Orchestrate)
      ↓
AuditLogRepository
      ↓
MetricsService
```

---

## ComplianceEvent — Universal Schema

```java
String eventId
String traceId
Type   type       // TRANSACTION | CONTRACT | KYC | REPORT
Object payload    // typed: Transaction | Contract | KycRecord | Report
Instant timestamp
```

Every inbound payload — regardless of type — is normalized into a `ComplianceEvent`
before entering the pipeline. The rest of the system only ever sees `ComplianceEvent`.

---

## Project Structure

```
src/main/java/com/guard/
├── controller/
│   ├── IngestorResource.java
│   ├── AuditController.java
│   └── HealthController.java
├── model/
│   ├── ComplianceEvent.java
│   ├── Transaction.java
│   ├── Contract.java
│   ├── Violation.java
│   ├── ScanResult.java
│   └── AuditLog.java
├── service/
│   ├── ComplianceScanService.java
│   └── OrchestrateWorkflowService.java
├── agent/
│   └── ScanAgent.java
├── engine/
│   ├── RuleEngine.java
│   ├── ComplianceRuleEngine.java
│   └── AlertEngine.java
├── repository/
│   ├── AuditLogRepository.java
│   └── InMemoryAuditLogRepository.java
├── metrics/
│   └── MetricsService.java
└── config/
    └── SecretsConfig.java
```

---

## API Endpoints

| Method | Path | Returns |
|---|---|---|
| POST | `/ingest/transaction` | 202 Accepted |
| POST | `/ingest/contract` | 202 Accepted |
| POST | `/ingest/kyc` | 202 Accepted |
| POST | `/ingest/report` | 202 Accepted |
| GET | `/audit/logs` | 200 + JSON array |
| GET | `/health` | 200 + status JSON |
| GET | `/q/health/live` | Kubernetes liveness |
| GET | `/q/health/ready` | Kubernetes readiness |
| GET | `/q/metrics` | Prometheus scrape |
