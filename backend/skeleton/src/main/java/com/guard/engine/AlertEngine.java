package com.guard.engine;

import com.guard.model.ScanResult;
import com.guard.service.OrchestrateWorkflowService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

@ApplicationScoped
public class AlertEngine {

    private static final Logger LOG = Logger.getLogger(AlertEngine.class);

    @Inject
    OrchestrateWorkflowService orchestrateService;

    public void processResult(ScanResult result) {
        // Route by risk level
        switch (result.riskLevel) {
            case "HIGH" -> triggerHighRiskAlert(result);
            case "MEDIUM" -> triggerMediumRiskAlert(result);
            case "LOW" -> triggerLowRiskAlert(result);
            default -> LOG.warnf("Unknown risk level: %s for trace %s", result.riskLevel, result.traceId);
        }
    }

    private void triggerHighRiskAlert(ScanResult result) {
        // HIGH risk: webhook notification + case management
        LOG.errorf("🚨 HIGH RISK ALERT - Trace: %s, Score: %.2f, Violations: %d",
                   result.traceId, result.riskScore, result.violations.size());
        
        // Trigger webhook via orchestration service
        orchestrateService.notifyWebhook(result);
        
        // Log structured alert for case management system
        LOG.infof("HIGH_RISK_CASE_CREATED: traceId=%s, eventId=%s, riskScore=%.2f, violationCount=%d",
                  result.traceId, result.eventId, result.riskScore, result.violations.size());
    }

    private void triggerMediumRiskAlert(ScanResult result) {
        // MEDIUM risk: structured warning + review queue
        LOG.warnf("⚠️ MEDIUM RISK ALERT - Trace: %s, Score: %.2f, Violations: %d",
                  result.traceId, result.riskScore, result.violations.size());
        
        // Log for review queue processing
        LOG.infof("MEDIUM_RISK_REVIEW_QUEUED: traceId=%s, eventId=%s, riskScore=%.2f, violationCount=%d",
                  result.traceId, result.eventId, result.riskScore, result.violations.size());
    }

    private void triggerLowRiskAlert(ScanResult result) {
        // LOW risk: info log only
        if (!result.violations.isEmpty()) {
            LOG.infof("ℹ️ LOW RISK - Trace: %s, Score: %.2f, Violations: %d",
                      result.traceId, result.riskScore, result.violations.size());
        }
    }
}
