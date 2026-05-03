package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.DashboardMetricsDTO;
import com.guard.repository.*;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Path("/api/metrics")
@Produces(MediaType.APPLICATION_JSON)
public class MetricsController {

    @Inject
    TransactionRepository transactionRepository;

    @Inject
    AlertRepository alertRepository;

    @Inject
    CaseRepository caseRepository;

    @GET
    public ApiResponse<DashboardMetricsDTO> getMetrics() {
        DashboardMetricsDTO metrics = new DashboardMetricsDTO();
        
        // Get counts
        metrics.totalTransactions = transactionRepository.count();
        metrics.flaggedTransactions = transactionRepository.countByStatus("FLAGGED");
        metrics.activeAlerts = alertRepository.countByStatus("OPEN") + 
                               alertRepository.countByStatus("IN_REVIEW");
        metrics.openCases = caseRepository.countByStatus("OPEN") + 
                           caseRepository.countByStatus("IN_PROGRESS");
        metrics.criticalAlerts = alertRepository.countBySeverity("CRITICAL");
        
        // Calculate compliance score (simplified)
        if (metrics.totalTransactions > 0) {
            double flaggedPercentage = (double) metrics.flaggedTransactions / metrics.totalTransactions;
            metrics.complianceScore = BigDecimal.valueOf((1 - flaggedPercentage) * 100)
                .setScale(2, RoundingMode.HALF_UP);
        } else {
            metrics.complianceScore = BigDecimal.valueOf(100.00);
        }
        
        // Mock trend data (in real implementation, compare with previous period)
        metrics.transactionTrend = new DashboardMetricsDTO.TrendData("UP", BigDecimal.valueOf(5.2));
        metrics.alertTrend = new DashboardMetricsDTO.TrendData("DOWN", BigDecimal.valueOf(2.1));
        
        return ApiResponse.success(metrics);
    }
}

// Made with Bob
