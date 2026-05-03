package com.guard.dto;

import java.math.BigDecimal;

public class DashboardMetricsDTO {
    public long totalTransactions;
    public long flaggedTransactions;
    public long activeAlerts;
    public long openCases;
    public long criticalAlerts;
    public BigDecimal complianceScore;
    public TrendData transactionTrend;
    public TrendData alertTrend;
    
    // Violation breakdown
    public long amlViolations;
    public long kycDeficiencies;
    public long baselBreaches;

    public static class TrendData {
        public String direction; // UP, DOWN, STABLE
        public BigDecimal percentage;

        public TrendData() {
        }

        public TrendData(String direction, BigDecimal percentage) {
            this.direction = direction;
            this.percentage = percentage;
        }
    }
}

// Made with Bob
