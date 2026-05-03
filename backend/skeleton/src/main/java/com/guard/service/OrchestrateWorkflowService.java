package com.guard.service;

import com.guard.config.SecretsConfig;
import com.guard.model.ScanResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class OrchestrateWorkflowService {

    private static final Logger LOG = Logger.getLogger(OrchestrateWorkflowService.class);

    @Inject
    SecretsConfig secrets;

    /**
     * Triggers watsonx Orchestrate workflow for HIGH risk compliance events only.
     * This is a placeholder implementation - no actual HTTP calls are made.
     *
     * @param result The scan result containing compliance violation details
     */
    public void notifyWebhook(ScanResult result) {
        // Only trigger for HIGH risk events
        if (!"HIGH".equals(result.riskLevel)) {
            LOG.debugf("Skipping Orchestrate notification for non-HIGH risk: traceId=%s, riskLevel=%s",
                       result.traceId, result.riskLevel);
            return;
        }

        // Build structured JSON payload
        Map<String, Object> payload = buildPayload(result);

        // Log the webhook call (placeholder - no actual HTTP request)
        LOG.infof("🔔 ORCHESTRATE_WEBHOOK_TRIGGERED: traceId=%s, riskLevel=%s, endpoint=%s",
                  result.traceId, result.riskLevel, secrets.aiEndpoint());
        
        LOG.debugf("Orchestrate payload: %s", payload);

        // In production, this would:
        // 1. Authenticate with watsonx Orchestrate using secrets.aiApiKey()
        // 2. POST payload to secrets.aiEndpoint() (or dedicated orchestrate endpoint)
        // 3. Log workflow reference ID from response
        // 4. Handle retries and error cases
    }

    private Map<String, Object> buildPayload(ScanResult result) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("traceId", result.traceId);
        payload.put("eventId", result.eventId);
        payload.put("riskScore", result.riskScore);
        payload.put("riskLevel", result.riskLevel);
        payload.put("violationCount", result.violations.size());
        payload.put("eventType", "COMPLIANCE_BREACH");
        payload.put("summary", "Compliance breach detected - immediate review required");
        payload.put("violations", result.violations.stream()
                .map(v -> Map.of(
                    "type", v.type.toString(),
                    "description", v.description
                ))
                .toList());
        return payload;
    }
}
