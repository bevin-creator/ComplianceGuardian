package com.guard.client;

import java.util.List;

/**
 * Workflow input payload structure for watsonx Orchestrate.
 */
public record WorkflowPayload(
    String traceId,
    String eventId,
    double riskScore,
    String riskLevel,
    int violationCount,
    String eventType,
    String summary,
    List<ViolationDetail> violations

