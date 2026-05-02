package com.guard.model;

import java.time.Instant;
import java.util.List;

public class AuditLog {

    public String id;
    public String traceId;
    public Instant timestamp;
    public String eventType;
    public List<Violation> violations;
    public double riskScore;
    public String riskLevel;

    public AuditLog() {}

    public AuditLog(String id, String traceId, Instant timestamp, ScanResult result) {
        // TODO: implementation
    }
}
