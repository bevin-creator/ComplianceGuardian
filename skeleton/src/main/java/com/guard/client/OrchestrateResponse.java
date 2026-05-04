package com.guard.client;

/**
 * Workflow execution response from watsonx Orchestrate.
 */
public record OrchestrateResponse(
    String workflowId,
    String executionId,
    String status,
    String caseId,
    String message
) {}


