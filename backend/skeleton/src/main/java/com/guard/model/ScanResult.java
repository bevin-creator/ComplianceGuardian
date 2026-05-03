package com.guard.model;

import java.util.List;

public class ScanResult {

    public String traceId;
    public String eventId;
    public List<Violation> violations;
    public double riskScore;
    public String riskLevel;

    public ScanResult() {}

    public ScanResult(String traceId, String eventId, List<Violation> violations, double riskScore) {
        this.traceId = traceId;
        this.eventId = eventId;
        this.violations = violations;
        this.riskScore = riskScore;
        this.riskLevel = resolveRiskLevel(riskScore);
    }

    private String resolveRiskLevel(double score) {
        // Risk levels based on compliance requirements:
        // >= 0.75 → HIGH
        // >= 0.40 → MEDIUM
        // < 0.40 → LOW
        if (score >= 0.75) {
            return "HIGH";
        } else if (score >= 0.40) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
}
