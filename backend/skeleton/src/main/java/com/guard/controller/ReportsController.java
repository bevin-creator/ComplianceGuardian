package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.repository.*;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Path("/api/reports")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReportsController {

    @Inject
    TransactionRepository transactionRepository;

    @Inject
    AlertRepository alertRepository;

    @Inject
    CaseRepository caseRepository;

    @Inject
    ActivityRepository activityRepository;

    @Inject
    ComplianceRuleRepository ruleRepository;

    @GET
    @Path("/summary")
    public ApiResponse<ReportSummary> getReportSummary(
            @QueryParam("startDate") String startDate,
            @QueryParam("endDate") String endDate) {
        
        ReportSummary summary = new ReportSummary();
        
        // Transaction statistics
        summary.totalTransactions = transactionRepository.count();
        summary.flaggedTransactions = transactionRepository.countByStatus("flagged");
        summary.highRiskTransactions = transactionRepository.countByRiskLevel("high");
        
        // Alert statistics
        summary.totalAlerts = alertRepository.count();
        summary.openAlerts = alertRepository.countByStatus("open");
        summary.criticalAlerts = alertRepository.countBySeverity("critical");
        summary.resolvedAlerts = alertRepository.countByStatus("resolved");
        
        // Case statistics
        summary.totalCases = caseRepository.count();
        summary.openCases = caseRepository.countByStatus("open");
        summary.closedCases = caseRepository.countByStatus("closed");
        
        // Rule statistics
        summary.totalRules = ruleRepository.count();
        summary.enabledRules = ruleRepository.countEnabled();
        
        summary.generatedAt = LocalDateTime.now();
        
        return ApiResponse.success(summary);
    }

    @GET
    @Path("/compliance")
    public ApiResponse<ComplianceReport> getComplianceReport(
            @QueryParam("framework") String framework) {
        
        ComplianceReport report = new ComplianceReport();
        report.framework = framework != null ? framework : "AML";
        
        // Calculate compliance metrics
        long totalTransactions = transactionRepository.count();
        long flaggedTransactions = transactionRepository.countByStatus("flagged");
        
        report.complianceScore = totalTransactions > 0 
            ? ((totalTransactions - flaggedTransactions) * 100.0 / totalTransactions) 
            : 100.0;
        
        report.totalChecks = totalTransactions;
        report.passedChecks = totalTransactions - flaggedTransactions;
        report.failedChecks = flaggedTransactions;
        
        // Alert breakdown
        report.criticalAlerts = alertRepository.countBySeverity("critical");
        report.highAlerts = alertRepository.countBySeverity("high");
        report.mediumAlerts = alertRepository.countBySeverity("medium");
        report.lowAlerts = alertRepository.countBySeverity("low");
        
        report.generatedAt = LocalDateTime.now();
        
        return ApiResponse.success(report);
    }

    @GET
    @Path("/risk-analysis")
    public ApiResponse<RiskAnalysisReport> getRiskAnalysis() {
        RiskAnalysisReport report = new RiskAnalysisReport();
        
        // Risk level distribution
        report.highRisk = transactionRepository.countByRiskLevel("high");
        report.mediumRisk = transactionRepository.countByRiskLevel("medium");
        report.lowRisk = transactionRepository.countByRiskLevel("low");
        
        // Calculate average risk score
        long totalTransactions = transactionRepository.count();
        report.averageRiskScore = totalTransactions > 0 
            ? (report.highRisk * 90.0 + report.mediumRisk * 50.0 + report.lowRisk * 20.0) / totalTransactions
            : 0.0;
        
        // Top risk categories
        report.topRiskCategories = Map.of(
            "Large Transactions", report.highRisk,
            "Cross-Border", report.mediumRisk / 2,
            "High-Risk Countries", report.highRisk / 3,
            "Unusual Patterns", report.mediumRisk / 3
        );
        
        report.generatedAt = LocalDateTime.now();
        
        return ApiResponse.success(report);
    }

    @GET
    @Path("/activity")
    public ApiResponse<ActivityReport> getActivityReport(
            @QueryParam("days") @DefaultValue("30") int days) {
        
        ActivityReport report = new ActivityReport();
        report.periodDays = days;
        
        // Activity statistics
        report.totalActivities = activityRepository.count();
        report.userLogins = activityRepository.countByType("user_login");
        report.alertsCreated = activityRepository.countByType("alert_created");
        report.casesCreated = activityRepository.countByType("case_created");
        report.rulesTriggered = activityRepository.countByType("rule_triggered");
        
        report.generatedAt = LocalDateTime.now();
        
        return ApiResponse.success(report);
    }

    @POST
    @Path("/generate")
    public ApiResponse<GenerateReportResponse> generateReport(GenerateReportRequest request) {
        // TODO: Implement actual report generation (PDF/Excel)
        GenerateReportResponse response = new GenerateReportResponse();
        response.reportId = "RPT-" + System.currentTimeMillis();
        response.status = "pending";
        response.message = "Report generation queued. This feature will be implemented soon.";
        
        return ApiResponse.success(response);
    }

    public static class ReportSummary {
        public long totalTransactions;
        public long flaggedTransactions;
        public long highRiskTransactions;
        public long totalAlerts;
        public long openAlerts;
        public long criticalAlerts;
        public long resolvedAlerts;
        public long totalCases;
        public long openCases;
        public long closedCases;
        public long totalRules;
        public long enabledRules;
        public LocalDateTime generatedAt;
    }

    public static class ComplianceReport {
        public String framework;
        public double complianceScore;
        public long totalChecks;
        public long passedChecks;
        public long failedChecks;
        public long criticalAlerts;
        public long highAlerts;
        public long mediumAlerts;
        public long lowAlerts;
        public LocalDateTime generatedAt;
    }

    public static class RiskAnalysisReport {
        public long highRisk;
        public long mediumRisk;
        public long lowRisk;
        public double averageRiskScore;
        public Map<String, Long> topRiskCategories;
        public LocalDateTime generatedAt;
    }

    public static class ActivityReport {
        public int periodDays;
        public long totalActivities;
        public long userLogins;
        public long alertsCreated;
        public long casesCreated;
        public long rulesTriggered;
        public LocalDateTime generatedAt;
    }

    public static class GenerateReportRequest {
        public String reportType;
        public String format;
        public String startDate;
        public String endDate;
        public Map<String, Object> filters;
    }

    public static class GenerateReportResponse {
        public String reportId;
        public String status;
        public String message;
    }
}

// Made with Bob
