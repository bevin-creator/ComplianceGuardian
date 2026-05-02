package com.guard.model;

import java.time.Instant;

public class ComplianceEvent {

    public enum EventType {
        TRANSACTION,
        CONTRACT,
        KYC,
        REPORT
    }

    public String eventId;
    public EventType eventType;
    public String sourceId;
    public String traceId;
    public Instant receivedAt;
    public Object payload;

    public ComplianceEvent() {}

    public ComplianceEvent(EventType eventType, String sourceId, Object payload) {
        // TODO: generate eventId, traceId, set receivedAt
    }
}
