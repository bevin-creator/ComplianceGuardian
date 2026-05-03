package com.guard.model;

import java.time.Instant;
import java.util.UUID;

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
        this.eventId = UUID.randomUUID().toString();
        this.traceId = UUID.randomUUID().toString();
        this.eventType = eventType;
        this.sourceId = sourceId;
        this.payload = payload;
        this.receivedAt = Instant.now();
    }
}
