package com.guard.agent;

import com.guard.engine.AlertEngine;
import com.guard.engine.RuleEngine;
import com.guard.entity.TransactionEntity;
import com.guard.metrics.MetricsService;
import com.guard.model.AuditLog;
import com.guard.model.ComplianceEvent;
import com.guard.model.ScanResult;
import com.guard.model.Transaction;
import com.guard.repository.AuditLogRepository;
import com.guard.repository.TransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.ObservesAsync;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.stream.Collectors;

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
    
    @Inject
    TransactionRepository transactionRepository;

    public void onComplianceEvent(@ObservesAsync ComplianceEvent event) {
        try {
            LOG.infof("Processing compliance event: eventId=%s, traceId=%s, type=%s",
                      event.eventId, event.traceId, event.eventType);

            // Step 1: Evaluate compliance rules
            ScanResult result = ruleEngine.evaluate(event);

            // Step 2: Update transaction entity with results
            if (event.eventType == ComplianceEvent.EventType.TRANSACTION) {
                updateTransactionEntity(event, result);
            }

            // Step 3: Process alerts based on risk level
            alertEngine.processResult(result);

            // Step 4: Create and save audit log
            AuditLog auditLog = new AuditLog(event.traceId, result);
            auditLogRepository.save(auditLog);

            // Step 5: Record metrics
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
    
    @Transactional
    public void updateTransactionEntity(ComplianceEvent event, ScanResult result) {
        if (!(event.payload instanceof Transaction tx)) {
            return;
        }
        
        TransactionEntity entity = transactionRepository.findById(tx.transactionId);
        if (entity != null) {
            entity.status = result.violations.isEmpty() ? "APPROVED" : "FLAGGED";
            entity.riskLevel = result.riskLevel;
            entity.riskScore = BigDecimal.valueOf(result.riskScore);
            entity.flaggedRules = result.violations.stream()
                .map(v -> v.type.toString())
                .collect(Collectors.joining(","));
            entity.updatedAt = Instant.now();
            
            transactionRepository.persist(entity);
            LOG.debugf("Updated transaction entity: id=%s, status=%s, riskLevel=%s",
                      entity.id, entity.status, entity.riskLevel);
        }
    }
}
