package com.guard.model;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class AuditLog {

    public String id;
    public String traceId;
    public Instant timestamp;
    public String eventType;
    public List<Violation> violations;
    public double riskScore;
    public String riskLevel;

    public AuditLog() {}

    public AuditLog(String traceId, ScanResult result) {
        this.id = UUID.randomUUID().toString();
        this.traceId = traceId;
        this.timestamp = Instant.now();
        this.eventType = result.violations.isEmpty() ? "CLEAN" : "VIOLATION_DETECTED";
        this.violations = result.violations;
        this.riskScore = result.riskScore;
        this.riskLevel = result.riskLevel;
    }

    public AuditLog(String id, String traceId, Instant timestamp, ScanResult result) {
        this.id = id;
        this.traceId = traceId;
        this.timestamp = timestamp;
        this.eventType = result.violations.isEmpty() ? "CLEAN" : "VIOLATION_DETECTED";
        this.violations = result.violations;
        this.riskScore = result.riskScore;
        this.riskLevel = result.riskLevel;
    }
}
