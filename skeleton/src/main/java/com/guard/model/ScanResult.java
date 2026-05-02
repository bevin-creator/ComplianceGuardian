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
        // TODO: set fields, derive riskLevel from riskScore
    }

    private String resolveRiskLevel(double score) {
        // TODO: implementation
        return null;
    }
}
