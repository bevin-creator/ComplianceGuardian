package com.guard.agent;

import com.guard.engine.AlertEngine;
import com.guard.engine.RuleEngine;
import com.guard.metrics.MetricsService;
import com.guard.model.AuditLog;
import com.guard.model.ComplianceEvent;
import com.guard.model.ScanResult;
import com.guard.repository.AuditLogRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.ObservesAsync;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

@ApplicationScoped
public class ScanAgent {

    private static final Logger LOG = Logger.getLogger(ScanAgent.class);

    @Inject
    RuleEngine ruleEngine;

    @Inject
    AlertEngine alertEngine;

    @Inject
    AuditLogRepository auditLogRepository;

    @Inject
    MetricsService metricsService;

    public void onComplianceEvent(@ObservesAsync ComplianceEvent event) {
        try {
            LOG.infof("Processing compliance event: eventId=%s, traceId=%s, type=%s",
                      event.eventId, event.traceId, event.eventType);

            // Step 1: Evaluate compliance rules
            ScanResult result = ruleEngine.evaluate(event);

            // Step 2: Process alerts based on risk level
            alertEngine.processResult(result);

            // Step 3: Create and save audit log
            AuditLog auditLog = new AuditLog(event.traceId, result);
            auditLogRepository.save(auditLog);

            // Step 4: Record metrics
            metricsService.recordScan(result);

            // Structured log for observability
            LOG.infof("Scan completed: traceId=%s, riskScore=%.2f, riskLevel=%s, violations=%d",
                      result.traceId, result.riskScore, result.riskLevel, result.violations.size());

        } catch (Exception e) {
            LOG.errorf(e, "Error processing compliance event: eventId=%s, traceId=%s",
                       event.eventId, event.traceId);
            // Don't rethrow - we want to continue processing other events
        }
    }
}
