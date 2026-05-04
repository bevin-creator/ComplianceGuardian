package com.guard.engine;

import com.guard.model.ComplianceEvent;
import com.guard.model.ScanResult;
import com.guard.model.Transaction;
import com.guard.model.Violation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ComplianceRuleEngine.
 * 
 * Tests the core compliance rules without CDI or external dependencies.
 * Uses plain JUnit 5 for fast, isolated testing.
 */
class ComplianceRuleEngineTest {

    private ComplianceRuleEngine ruleEngine;

    @BeforeEach
    void setUp() {
        // Create a standalone instance for unit testing
        // Note: This won't have @Inject dependencies, so we need to test
        // the evaluate() method with mock SecretsConfig behavior
        ruleEngine = new ComplianceRuleEngine();
        
        // Initialize the secrets config manually for testing
        // In real usage, this would be injected by CDI
        ruleEngine.secrets = new TestSecretsConfig();
    }

    // ==================== AML THRESHOLD TESTS ====================

    @Test
    @DisplayName("Transaction above $10,000 should trigger AML_THRESHOLD violation")
    void testAmlThresholdViolation() {
        // Given: Transaction with amount > $10,000
        Transaction tx = createTransaction("TX-001", new BigDecimal("15000.00"), "USD");
        tx.customerId = "CUST-123"; // Valid customer ID to isolate AML test
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have AML_THRESHOLD violation
        assertNotNull(result);
        assertFalse(result.violations.isEmpty(), "Expected violations but found none");
        
        boolean hasAmlViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.AML_THRESHOLD);
        assertTrue(hasAmlViolation, "Expected AML_THRESHOLD violation");
        
        // Risk score should include AML weight (0.35)
        assertTrue(result.riskScore >= 0.35, 
                "Risk score should be at least 0.35 for AML violation");
    }

    @Test
    @DisplayName("Transaction below $10,000 should NOT trigger AML_THRESHOLD violation")
    void testAmlThresholdNoViolation() {
        // Given: Transaction with amount < $10,000
        Transaction tx = createTransaction("TX-002", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123"; // Valid customer ID
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should NOT have AML_THRESHOLD violation
        assertNotNull(result);
        
        boolean hasAmlViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.AML_THRESHOLD);
        assertFalse(hasAmlViolation, "Should not have AML_THRESHOLD violation for amount < $10,000");
    }

    @Test
    @DisplayName("Transaction exactly at $10,000 should NOT trigger AML_THRESHOLD violation")
    void testAmlThresholdBoundary() {
        // Given: Transaction with amount exactly $10,000
        Transaction tx = createTransaction("TX-003", new BigDecimal("10000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should NOT trigger (threshold is > 10000, not >=)
        boolean hasAmlViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.AML_THRESHOLD);
        assertFalse(hasAmlViolation, "Boundary case: $10,000 should not trigger violation");
    }

    // ==================== KYC MISSING CUSTOMER ID TESTS ====================

    @Test
    @DisplayName("Transaction with null customerId should trigger KYC_MISSING_CUSTOMER_ID violation")
    void testKycMissingCustomerIdNull() {
        // Given: Transaction with null customerId
        Transaction tx = createTransaction("TX-004", new BigDecimal("5000.00"), "USD");
        tx.customerId = null; // Missing customer ID
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have KYC_MISSING_CUSTOMER_ID violation
        assertNotNull(result);
        assertFalse(result.violations.isEmpty());
        
        boolean hasKycViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.KYC_MISSING_CUSTOMER_ID);
        assertTrue(hasKycViolation, "Expected KYC_MISSING_CUSTOMER_ID violation for null customerId");
        
        // Risk score should include KYC weight (0.30)
        assertTrue(result.riskScore >= 0.30, 
                "Risk score should be at least 0.30 for KYC violation");
    }

    @Test
    @DisplayName("Transaction with blank customerId should trigger KYC_MISSING_CUSTOMER_ID violation")
    void testKycMissingCustomerIdBlank() {
        // Given: Transaction with blank customerId
        Transaction tx = createTransaction("TX-005", new BigDecimal("5000.00"), "USD");
        tx.customerId = "   "; // Blank customer ID
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have KYC_MISSING_CUSTOMER_ID violation
        boolean hasKycViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.KYC_MISSING_CUSTOMER_ID);
        assertTrue(hasKycViolation, "Expected KYC_MISSING_CUSTOMER_ID violation for blank customerId");
    }

    @Test
    @DisplayName("Transaction with valid customerId should NOT trigger KYC violation")
    void testKycValidCustomerId() {
        // Given: Transaction with valid customerId
        Transaction tx = createTransaction("TX-006", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123"; // Valid customer ID
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should NOT have KYC_MISSING_CUSTOMER_ID violation
        boolean hasKycViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.KYC_MISSING_CUSTOMER_ID);
        assertFalse(hasKycViolation, "Should not have KYC violation with valid customerId");
    }

    // ==================== HIGH RISK COUNTRY TESTS ====================

    @Test
    @DisplayName("Transaction from high-risk origin country should trigger HIGH_RISK_COUNTRY violation")
    void testHighRiskCountryOrigin() {
        // Given: Transaction from Iran (high-risk country)
        Transaction tx = createTransaction("TX-007", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "IR"; // Iran - high risk
        tx.destinationCountry = "US";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have HIGH_RISK_COUNTRY violation
        assertNotNull(result);
        assertFalse(result.violations.isEmpty());
        
        boolean hasHighRiskViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY);
        assertTrue(hasHighRiskViolation, "Expected HIGH_RISK_COUNTRY violation for Iran origin");
        
        // Verify violation description mentions origin
        Violation violation = result.violations.stream()
                .filter(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY)
                .findFirst()
                .orElseThrow();
        assertTrue(violation.description.toLowerCase().contains("origin"),
                "Violation description should mention origin country");
        
        // Risk score should include high-risk country weight (0.45)
        assertTrue(result.riskScore >= 0.45, 
                "Risk score should be at least 0.45 for high-risk country violation");
    }

    @Test
    @DisplayName("Transaction to high-risk destination country should trigger HIGH_RISK_COUNTRY violation")
    void testHighRiskCountryDestination() {
        // Given: Transaction to North Korea (high-risk country)
        Transaction tx = createTransaction("TX-008", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "KP"; // North Korea - high risk
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have HIGH_RISK_COUNTRY violation
        boolean hasHighRiskViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY);
        assertTrue(hasHighRiskViolation, "Expected HIGH_RISK_COUNTRY violation for North Korea destination");
        
        // Verify violation description mentions destination
        Violation violation = result.violations.stream()
                .filter(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY)
                .findFirst()
                .orElseThrow();
        assertTrue(violation.description.toLowerCase().contains("destin"),
                "Violation description should mention destination country");
    }

    @Test
    @DisplayName("Transaction between safe countries should NOT trigger HIGH_RISK_COUNTRY violation")
    void testSafeCountries() {
        // Given: Transaction between US and Canada (safe countries)
        Transaction tx = createTransaction("TX-009", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should NOT have HIGH_RISK_COUNTRY violation
        boolean hasHighRiskViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY);
        assertFalse(hasHighRiskViolation, "Should not have HIGH_RISK_COUNTRY violation for safe countries");
    }

    @Test
    @DisplayName("Case-insensitive country code matching should work")
    void testCountryCodeCaseInsensitive() {
        // Given: Transaction with lowercase country code
        Transaction tx = createTransaction("TX-010", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "ir"; // lowercase - should still match
        tx.destinationCountry = "US";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should still trigger HIGH_RISK_COUNTRY violation
        boolean hasHighRiskViolation = result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY);
        assertTrue(hasHighRiskViolation, "Country code matching should be case-insensitive");
    }

    // ==================== MULTIPLE VIOLATIONS TESTS ====================

    @Test
    @DisplayName("Transaction with multiple violations should accumulate risk score")
    void testMultipleViolations() {
        // Given: Transaction with AML + KYC + High-risk country violations
        Transaction tx = createTransaction("TX-011", new BigDecimal("15000.00"), "USD");
        tx.customerId = null; // Missing customer ID
        tx.originCountry = "IR"; // High-risk country
        tx.destinationCountry = "US";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have all three violations
        assertNotNull(result);
        assertEquals(3, result.violations.size(), "Expected 3 violations");
        
        // Verify each violation type is present
        assertTrue(result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.AML_THRESHOLD));
        assertTrue(result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.KYC_MISSING_CUSTOMER_ID));
        assertTrue(result.violations.stream()
                .anyMatch(v -> v.type == Violation.Type.HIGH_RISK_COUNTRY));
        
        // Risk score should be sum of weights: 0.35 + 0.30 + 0.45 = 1.10, capped at 1.0
        assertEquals(1.0, result.riskScore, 0.001, 
                "Risk score should be capped at 1.0 for multiple violations");
    }

    // ==================== RISK SCORE CALCULATION TESTS ====================

    @Test
    @DisplayName("Risk score should be calculated correctly for single violation")
    void testRiskScoreCalculationSingle() {
        // Given: Transaction with only AML violation (weight 0.35)
        Transaction tx = createTransaction("TX-012", new BigDecimal("15000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Risk score should be 0.35
        assertEquals(0.35, result.riskScore, 0.001, 
                "Risk score should match AML weight");
    }

    @Test
    @DisplayName("Risk score should be capped at 1.0")
    void testRiskScoreCapping() {
        // Given: Transaction with violations that would exceed 1.0
        Transaction tx = createTransaction("TX-013", new BigDecimal("15000.00"), "USD");
        tx.customerId = null;
        tx.originCountry = "IR";
        tx.destinationCountry = "KP"; // Two high-risk countries
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Risk score should be capped at 1.0
        assertTrue(result.riskScore <= 1.0, "Risk score should never exceed 1.0");
        assertEquals(1.0, result.riskScore, 0.001, 
                "Risk score should be capped at 1.0");
    }

    // ==================== RISK LEVEL CLASSIFICATION TESTS ====================

    @Test
    @DisplayName("Risk score >= 0.75 should be classified as HIGH")
    void testRiskLevelHigh() {
        // Given: Transaction with high risk score
        Transaction tx = createTransaction("TX-014", new BigDecimal("15000.00"), "USD");
        tx.customerId = null;
        tx.originCountry = "IR";
        tx.destinationCountry = "US";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Risk level should be HIGH
        assertEquals("HIGH", result.riskLevel, "Risk level should be HIGH for score >= 0.75");
    }

    @Test
    @DisplayName("Risk score >= 0.40 and < 0.75 should be classified as MEDIUM")
    void testRiskLevelMedium() {
        // Given: Transaction with medium risk score (only high-risk country = 0.45)
        Transaction tx = createTransaction("TX-015", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123"; // Valid customer ID (no KYC violation)
        tx.originCountry = "US";
        tx.destinationCountry = "IR"; // High-risk country (0.45)
        // Total: 0.45 (MEDIUM range: 0.40 - 0.74)
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Risk level should be MEDIUM
        assertEquals("MEDIUM", result.riskLevel, "Risk level should be MEDIUM for score >= 0.40");
        assertEquals(0.45, result.riskScore, 0.001, "Risk score should be 0.45");
    }

    @Test
    @DisplayName("Risk score < 0.40 should be classified as LOW")
    void testRiskLevelLow() {
        // Given: Transaction with low risk score
        Transaction tx = createTransaction("TX-016", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Risk level should be LOW (no violations = 0.0 score)
        assertEquals("LOW", result.riskLevel, "Risk level should be LOW for score < 0.40");
        assertEquals(0.0, result.riskScore, 0.001, "Clean transaction should have 0.0 risk score");
    }

    @Test
    @DisplayName("Clean transaction should have no violations and LOW risk")
    void testCleanTransaction() {
        // Given: Completely clean transaction
        Transaction tx = createTransaction("TX-017", new BigDecimal("5000.00"), "USD");
        tx.customerId = "CUST-123";
        tx.originCountry = "US";
        tx.destinationCountry = "CA";
        
        ComplianceEvent event = createEvent(tx);

        // When: Evaluate the transaction
        ScanResult result = ruleEngine.evaluate(event);

        // Then: Should have no violations
        assertNotNull(result);
        assertTrue(result.violations.isEmpty(), "Clean transaction should have no violations");
        assertEquals(0.0, result.riskScore, 0.001, "Clean transaction should have 0.0 risk score");
        assertEquals("LOW", result.riskLevel, "Clean transaction should have LOW risk level");
    }

    // ==================== HELPER METHODS ====================

    private Transaction createTransaction(String txId, BigDecimal amount, String currency) {
        Transaction tx = new Transaction();
        tx.transactionId = txId;
        tx.amount = amount;
        tx.currency = currency;
        tx.timestamp = Instant.now();
        return tx;
    }

    private ComplianceEvent createEvent(Transaction transaction) {
        return new ComplianceEvent(
                ComplianceEvent.EventType.TRANSACTION,
                transaction.transactionId,
                transaction
        );
    }

    /**
     * Test implementation of SecretsConfig for unit testing.
     * Provides high-risk countries list without requiring CDI.
     */
    private static class TestSecretsConfig implements com.guard.config.SecretsConfig {
        @Override
        public String aiApiKey() {
            return "TEST_KEY";
        }
        
        @Override
        public String aiEndpoint() {
            return "https://test.endpoint";
        }
        
        @Override
        public String highRiskCountries() {
            // FATF high-risk countries for testing
            return "IR,KP,SY,CU";
        }
    }
}


