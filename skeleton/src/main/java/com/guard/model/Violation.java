package com.guard.model;

public class Violation {

    public enum Type {
        AML_THRESHOLD,
        KYC_MISSING_CUSTOMER_ID,
        HIGH_RISK_COUNTRY,
        BASEL_III_EXPOSURE,
        CONTRACT_JURISDICTION,
        REPORT_ANOMALY
    }

    public Type type;
    public String description;
    public String explanation;
    public String traceId;

    public Violation() {}

    public Violation(Type type, String description, String traceId) {
        // TODO: implementation
    }
}
