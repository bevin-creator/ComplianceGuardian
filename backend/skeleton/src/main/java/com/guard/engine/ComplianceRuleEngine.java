package com.guard.engine;

import com.guard.config.SecretsConfig;
import com.guard.model.ComplianceEvent;
import com.guard.model.Contract;
import com.guard.model.ScanResult;
import com.guard.model.Transaction;
import com.guard.model.Violation;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class ComplianceRuleEngine implements RuleEngine {

    private static final Logger LOG = Logger.getLogger(ComplianceRuleEngine.class);

    // Compliance rule weights
    private static final double WEIGHT_AML_THRESHOLD = 0.35;
    private static final double WEIGHT_KYC_MISSING = 0.30;
    private static final double WEIGHT_HIGH_RISK_COUNTRY = 0.45;
    private static final double WEIGHT_BASEL_III = 0.25;

    // Thresholds
    private static final BigDecimal AML_THRESHOLD = new BigDecimal("10000");
    private static final BigDecimal BASEL_III_THRESHOLD = new BigDecimal("1000000");

    @Inject
    SecretsConfig secrets;

    private Set<String> highRiskCountries;

    @Override
    public ScanResult evaluate(ComplianceEvent event) {
        // Initialize high-risk countries from config
        if (highRiskCountries == null) {
            highRiskCountries = Arrays.stream(secrets.highRiskCountries().split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .collect(Collectors.toSet());
        }

        List<Violation> violations = switch (event.eventType) {
            case TRANSACTION -> evaluateTransaction(event);
            case CONTRACT -> evaluateContract(event);
            case KYC -> evaluateKyc(event);
            case REPORT -> evaluateReport(event);
        };

        double riskScore = calculateRiskScore(violations);
        
        LOG.infof("Evaluated event %s (trace: %s): %d violations, risk score: %.2f",
                  event.eventId, event.traceId, violations.size(), riskScore);

        return new ScanResult(event.traceId, event.eventId, violations, riskScore);
    }

    private List<Violation> evaluateTransaction(ComplianceEvent event) {
        List<Violation> violations = new ArrayList<>();
        
        if (!(event.payload instanceof Transaction tx)) {
            LOG.warnf("Expected Transaction payload but got %s", event.payload.getClass().getName());
            return violations;
        }

        // Rule 1: AML_THRESHOLD - amount > 10,000
        if (tx.amount != null && tx.amount.compareTo(AML_THRESHOLD) > 0) {
            violations.add(new Violation(
                Violation.Type.AML_THRESHOLD,
                String.format("Transaction amount %s %s exceeds AML threshold of %s",
                              tx.amount, tx.currency, AML_THRESHOLD),
                event.traceId
            ));
        }

        // Rule 2: KYC_MISSING_CUSTOMER_ID - customerId null or blank
        if (tx.customerId == null || tx.customerId.isBlank()) {
            violations.add(new Violation(
                Violation.Type.KYC_MISSING_CUSTOMER_ID,
                "Transaction missing customer ID - KYC verification required",
                event.traceId
            ));
        }

        // Rule 3: HIGH_RISK_COUNTRY - origin or destination in FATF list
        if (tx.originCountry != null && highRiskCountries.contains(tx.originCountry.toUpperCase())) {
            violations.add(new Violation(
                Violation.Type.HIGH_RISK_COUNTRY,
                String.format("Transaction originates from high-risk country: %s", tx.originCountry),
                event.traceId
            ));
        }
        if (tx.destinationCountry != null && highRiskCountries.contains(tx.destinationCountry.toUpperCase())) {
            violations.add(new Violation(
                Violation.Type.HIGH_RISK_COUNTRY,
                String.format("Transaction destined for high-risk country: %s", tx.destinationCountry),
                event.traceId
            ));
        }

        // Rule 4: BASEL_III_EXPOSURE - amount > 1,000,000
        if (tx.amount != null && tx.amount.compareTo(BASEL_III_THRESHOLD) > 0) {
            violations.add(new Violation(
                Violation.Type.BASEL_III_EXPOSURE,
                String.format("Transaction amount %s %s exceeds Basel III exposure limit of %s",
                              tx.amount, tx.currency, BASEL_III_THRESHOLD),
                event.traceId
            ));
        }

        return violations;
    }

    private List<Violation> evaluateContract(ComplianceEvent event) {
        List<Violation> violations = new ArrayList<>();
        
        if (!(event.payload instanceof Contract contract)) {
            LOG.warnf("Expected Contract payload but got %s", event.payload.getClass().getName());
            return violations;
        }

        // Contract jurisdiction check - high-risk countries
        if (contract.jurisdiction != null && highRiskCountries.contains(contract.jurisdiction.toUpperCase())) {
            violations.add(new Violation(
                Violation.Type.CONTRACT_JURISDICTION,
                String.format("Contract jurisdiction in high-risk country: %s", contract.jurisdiction),
                event.traceId
            ));
        }

        return violations;
    }

    private List<Violation> evaluateKyc(ComplianceEvent event) {
        List<Violation> violations = new ArrayList<>();
        
        // KYC record evaluation - placeholder for future implementation
        // Could check for missing fields, watchlist screening, etc.
        
        return violations;
    }

    private List<Violation> evaluateReport(ComplianceEvent event) {
        List<Violation> violations = new ArrayList<>();
        
        // Report anomaly detection - placeholder for future implementation
        // Could check for suspicious patterns, threshold breaches, etc.
        
        return violations;
    }

    private double calculateRiskScore(List<Violation> violations) {
        // Calculate weighted sum of violations
        double score = 0.0;
        
        for (Violation violation : violations) {
            score += switch (violation.type) {
                case AML_THRESHOLD -> WEIGHT_AML_THRESHOLD;
                case KYC_MISSING_CUSTOMER_ID -> WEIGHT_KYC_MISSING;
                case HIGH_RISK_COUNTRY -> WEIGHT_HIGH_RISK_COUNTRY;
                case BASEL_III_EXPOSURE -> WEIGHT_BASEL_III;
                case CONTRACT_JURISDICTION -> WEIGHT_HIGH_RISK_COUNTRY; // Same weight as high-risk country
                case REPORT_ANOMALY -> 0.20; // Default weight for report anomalies
            };
        }
        
        // Cap at 1.0 as per requirements
        return Math.min(score, 1.0);
    }
}
