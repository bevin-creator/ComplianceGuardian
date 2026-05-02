package com.guard.service;

import com.guard.client.OrchestrateClient;
import com.guard.client.OrchestrateResponse;
import com.guard.client.ViolationDetail;
import com.guard.client.WorkflowPayload;
import com.guard.config.SecretsConfig;
import com.guard.model.ScanResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;

/**
 * Service for triggering IBM watsonx Orchestrate workflows.
 * Sends HIGH risk compliance events to workflow automation platform.
 */
@ApplicationScoped
public class OrchestrateWorkflowService {

    private static final Logger LOG = Logger.getLogger(OrchestrateWorkflowService.class);

    @Inject
    @RestClient
    OrchestrateClient orchestrateClient;

    @Inject
    SecretsConfig secrets;

    /**
     * Triggers watsonx Orchestrate workflow for HIGH risk compliance events.
     * 
     * Retry strategy:
     * - 3 attempts with 2-second delay
     * - Exponential backoff (2s, 4s, 8s)
     * - 15-second timeout per attempt
     * 
     * @param result The scan result containing compliance violation details
     */
    @Retry(
        maxRetries = 3,
        delay = 2000,
        delayUnit = java.time.temporal.ChronoUnit.MILLIS,
        jitter = 500,
        retryOn = {jakarta.ws.rs.ProcessingException.class, jakarta.ws.rs.WebApplicationException.class}
    )
    @Timeout(15000) // 15 seconds
    public void notifyWebhook(ScanResult result) {
        // Only trigger for HIGH risk events
        if (!"HIGH".equals(result.riskLevel)) {
            LOG.debugf("Skipping Orchestrate notification for non-HIGH risk: traceId=%s, riskLevel=%s",
                       result.traceId, result.riskLevel);
            return;
        }

        try {
            // Build workflow payload
            WorkflowPayload payload = buildPayload(result);
            
            // Generate unique request ID for traceability
            String requestId = UUID.randomUUID().toString();
            
            // Authenticate with Bearer token
            String authToken = "Bearer " + secrets.orchestrateApiKey();
            
            LOG.infof("🔔 Triggering Orchestrate workflow: traceId=%s, requestId=%s", 
                result.traceId, requestId);
            
            // Call watsonx Orchestrate API
            OrchestrateResponse response = orchestrateClient.triggerWorkflow(
                authToken,
                requestId,
                payload
            );
            
            // Log successful workflow trigger
            LOG.infof("✅ Workflow triggered successfully: traceId=%s, workflowId=%s, executionId=%s, caseId=%s, status=%s",
                result.traceId, 
                response.workflowId(), 
                response.executionId(),
                response.caseId(),
                response.status()
            );
            
            // Store workflow execution ID for audit trail
            // TODO: Persist to database for case tracking
            
        } catch (jakarta.ws.rs.WebApplicationException e) {
            // HTTP error (4xx, 5xx)
            int statusCode = e.getResponse() != null ? e.getResponse().getStatus() : 0;
            LOG.errorf(e, "❌ Workflow trigger failed (HTTP %d): traceId=%s, message=%s",
                statusCode, result.traceId, e.getMessage());
            
            // Don't retry on 4xx client errors (bad request, unauthorized)
            if (statusCode >= 400 && statusCode < 500) {
                LOG.warnf("Client error - not retrying: traceId=%s", result.traceId);
                return; // Exit without retry
            }
            
            throw e; // Retry on 5xx server errors
            
        } catch (jakarta.ws.rs.ProcessingException e) {
            // Network error (timeout, connection refused)
            LOG.errorf(e, "❌ Workflow trigger failed (network): traceId=%s", result.traceId);
            throw e; // Retry
            
        } catch (Exception e) {
            // Unexpected error
            LOG.errorf(e, "❌ Workflow trigger failed (unexpected): traceId=%s", result.traceId);
            // Don't retry on unexpected errors
        }
    }

    /**
     * Builds structured workflow payload from scan result.
     */
    private WorkflowPayload buildPayload(ScanResult result) {
        List<ViolationDetail> violations = result.violations.stream()
            .map(v -> new ViolationDetail(
                v.type.toString(),
                v.description,
                determineSeverity(v.type.toString())
            ))
            .toList();
        
        return new WorkflowPayload(
            result.traceId,
            result.eventId,
            result.riskScore,
            result.riskLevel,
            result.violations.size(),
            "COMPLIANCE_BREACH",
            String.format("HIGH risk compliance breach detected - %d violations", result.violations.size()),
            violations
        );
    }
    
    /**
     * Maps violation type to severity level for workflow routing.
     */
    private String determineSeverity(String violationType) {
        return switch (violationType) {
            case "SANCTION_VIOLATION" -> "CRITICAL";
            case "HIGH_RISK_COUNTRY" -> "HIGH";
            case "AMOUNT_THRESHOLD" -> "MEDIUM";
            default -> "LOW";
        };
    }
}

// Made with Bob
