package com.guard.agent;

import com.guard.engine.AlertEngine;
import com.guard.engine.RuleEngine;
import com.guard.metrics.MetricsService;
import com.guard.model.ComplianceEvent;
import com.guard.repository.AuditLogRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.ObservesAsync;
import jakarta.inject.Inject;

@ApplicationScoped
public class ScanAgent {

    @Inject
    RuleEngine ruleEngine;

    @Inject
    AlertEngine alertEngine;

    @Inject
    AuditLogRepository auditLogRepository;

    @Inject
    MetricsService metricsService;

    public void onComplianceEvent(@ObservesAsync ComplianceEvent event) {
        // TODO: ruleEngine.evaluate(event)
        // TODO: alertEngine.processResult(result)
        // TODO: build AuditLog, auditLogRepository.save(log)
        // TODO: metricsService.recordScan(result)
    }
}
