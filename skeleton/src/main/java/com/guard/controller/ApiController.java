package com.guard.controller;

import com.guard.model.Transaction;
import com.guard.service.ComplianceScanService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Main REST API controller for ComplianceGuard frontend integration.
 * Provides endpoints for transactions, alerts, cases, metrics, and dashboard data.
 */
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApiController {

    private static final Logger LOG = Logger.getLogger(ApiController.class);

    @Inject
    ComplianceScanService scanService;

    // ==================== Authentication ====================

    @POST
    @Path("/auth/login")
    public Response login(Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Mock authentication - replace with real auth service
        if (email != null && password != null) {
            Map<String, Object> user = Map.of(
                "id", UUID.randomUUID().toString(),
                "email", email,
                "name", "Demo User",
                "role", "analyst",
                "token", "mock-jwt-token-" + UUID.randomUUID()
            );
            
            return Response.ok(Map.of(
                "success", true,
                "data", user
            )).build();
        }

        return Response.status(Response.Status.UNAUTHORIZED)
            .entity(Map.of("success", false, "error", "Invalid credentials"))
            .build();
    }

    @POST
    @Path("/auth/logout")
    public Response logout() {
        return Response.ok(Map.of("success", true)).build();
    }

    // ==================== Dashboard Metrics ====================

    @GET
    @Path("/metrics")
    public Response getMetrics() {
        // Mock metrics - replace with real data from MetricsService
        Map<String, Object> metrics = Map.of(
            "totalTransactions", 15847,
            "flaggedTransactions", 234,
            "complianceScore", 94.5,
            "openCases", 12,
            "resolvedCases", 156,
            "criticalAlerts", 3,
            "amlViolations", 45,
            "kycDeficiencies", 23,
            "baselBreaches", 8
        );

        return Response.ok(Map.of(
            "success", true,
            "data", metrics
        )).build();
    }

    // ==================== Transactions ====================

    @GET
    @Path("/transactions")
    public Response getTransactions(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("search") String search,
            @QueryParam("status") String status,
            @QueryParam("riskLevel") String riskLevel) {

        // Mock transaction data - replace with real repository query
        List<Map<String, Object>> transactions = generateMockTransactions(pageSize);

        Map<String, Object> paginatedResponse = Map.of(
            "data", transactions,
            "total", 234,
            "page", page,
            "pageSize", pageSize,
            "totalPages", (234 + pageSize - 1) / pageSize
        );

        return Response.ok(Map.of(
            "success", true,
            "data", paginatedResponse
        )).build();
    }

    @GET
    @Path("/transactions/{id}")
    public Response getTransaction(@PathParam("id") String id) {
        Map<String, Object> transaction = Map.of(
            "id", id,
            "customerId", "CUST-" + id.substring(0, 8),
            "customerName", "John Doe",
            "amount", 125000.00,
            "currency", "USD",
            "country", "US",
            "jurisdiction", "New York",
            "timestamp", Instant.now().toString(),
            "riskScore", 75,
            "status", "flagged",
            "violationType", "AML",
            "rulesTriggered", List.of("AML-001", "AML-003")
        );

        return Response.ok(Map.of(
            "success", true,
            "data", transaction
        )).build();
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadTransactions() {
        // Mock file upload - implement actual file processing
        return Response.ok(Map.of(
            "success", true,
            "data", Map.of("processed", 150)
        )).build();
    }

    // ==================== Alerts ====================

    @GET
    @Path("/alerts")
    public Response getAlerts(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("severity") String severity,
            @QueryParam("status") String status) {

        List<Map<String, Object>> alerts = generateMockAlerts(pageSize);

        Map<String, Object> paginatedResponse = Map.of(
            "data", alerts,
            "total", 89,
            "page", page,
            "pageSize", pageSize,
            "totalPages", (89 + pageSize - 1) / pageSize
        );

        return Response.ok(Map.of(
            "success", true,
            "data", paginatedResponse
        )).build();
    }

    @GET
    @Path("/alerts/{id}")
    public Response getAlert(@PathParam("id") String id) {
        Map<String, Object> alert = Map.of(
            "id", id,
            "transactionId", "TXN-" + UUID.randomUUID().toString().substring(0, 8),
            "severity", "high",
            "type", "AML",
            "title", "High-Risk Transaction Detected",
            "description", "Transaction exceeds threshold for high-risk jurisdiction",
            "timestamp", Instant.now().toString(),
            "status", "open",
            "assignedTo", "analyst-001"
        );

        return Response.ok(Map.of(
            "success", true,
            "data", alert
        )).build();
    }

    @PATCH
    @Path("/alerts/{id}/status")
    public Response updateAlertStatus(@PathParam("id") String id, Map<String, String> body) {
        String newStatus = body.get("status");
        
        Map<String, Object> alert = Map.of(
            "id", id,
            "status", newStatus,
            "updatedAt", Instant.now().toString()
        );

        return Response.ok(Map.of(
            "success", true,
            "data", alert
        )).build();
    }

    // ==================== Cases ====================

    @GET
    @Path("/cases")
    public Response getCases(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("status") String status,
            @QueryParam("severity") String severity) {

        List<Map<String, Object>> cases = generateMockCases(pageSize);

        Map<String, Object> paginatedResponse = Map.of(
            "data", cases,
            "total", 45,
            "page", page,
            "pageSize", pageSize,
            "totalPages", (45 + pageSize - 1) / pageSize
        );

        return Response.ok(Map.of(
            "success", true,
            "data", paginatedResponse
        )).build();
    }

    @GET
    @Path("/cases/{id}")
    public Response getCase(@PathParam("id") String id) {
        Map<String, Object> caseData = Map.of(
            "id", id,
            "transactionId", "TXN-" + UUID.randomUUID().toString().substring(0, 8),
            "title", "AML Investigation - High Value Transfer",
            "severity", "high",
            "status", "under_review",
            "assignedTo", "analyst-001",
            "createdAt", Instant.now().minusSeconds(86400).toString(),
            "updatedAt", Instant.now().toString(),
            "sarStatus", "pending",
            "description", "Investigating suspicious high-value transaction pattern",
            "timeline", generateMockTimeline()
        );

        return Response.ok(Map.of(
            "success", true,
            "data", caseData
        )).build();
    }

    @POST
    @Path("/cases")
    public Response createCase(Map<String, Object> caseData) {
        String caseId = "CASE-" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> newCase = new HashMap<>(caseData);
        newCase.put("id", caseId);
        newCase.put("createdAt", Instant.now().toString());
        newCase.put("status", "open");

        return Response.status(Response.Status.CREATED)
            .entity(Map.of("success", true, "data", newCase))
            .build();
    }

    @PATCH
    @Path("/cases/{id}")
    public Response updateCase(@PathParam("id") String id, Map<String, Object> updates) {
        Map<String, Object> updatedCase = new HashMap<>(updates);
        updatedCase.put("id", id);
        updatedCase.put("updatedAt", Instant.now().toString());

        return Response.ok(Map.of(
            "success", true,
            "data", updatedCase
        )).build();
    }

    @POST
    @Path("/cases/{id}/assign")
    public Response assignCase(@PathParam("id") String id, Map<String, String> body) {
        String userId = body.get("userId");
        
        Map<String, Object> caseData = Map.of(
            "id", id,
            "assignedTo", userId,
            "updatedAt", Instant.now().toString()
        );

        return Response.ok(Map.of(
            "success", true,
            "data", caseData
        )).build();
    }

    // ==================== Activity Feed ====================

    @GET
    @Path("/activity")
    public Response getActivity(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("type") String type) {

        List<Map<String, Object>> activities = generateMockActivities(pageSize);

        Map<String, Object> paginatedResponse = Map.of(
            "data", activities,
            "total", 500,
            "page", page,
            "pageSize", pageSize,
            "totalPages", (500 + pageSize - 1) / pageSize
        );

        return Response.ok(Map.of(
            "success", true,
            "data", paginatedResponse
        )).build();
    }

    // ==================== Compliance Rules ====================

    @GET
    @Path("/rules")
    public Response getRules() {
        List<Map<String, Object>> rules = List.of(
            Map.of(
                "id", "RULE-001",
                "code", "AML-001",
                "name", "High-Value Transaction Threshold",
                "category", "AML",
                "description", "Flags transactions exceeding $10,000",
                "severity", "high",
                "enabled", true
            ),
            Map.of(
                "id", "RULE-002",
                "code", "KYC-001",
                "name", "Customer Due Diligence",
                "category", "KYC",
                "description", "Requires enhanced due diligence for high-risk customers",
                "severity", "critical",
                "enabled", true
            )
        );

        return Response.ok(Map.of(
            "success", true,
            "data", rules
        )).build();
    }

    @PATCH
    @Path("/rules/{id}")
    public Response updateRule(@PathParam("id") String id, Map<String, Object> updates) {
        Map<String, Object> rule = new HashMap<>(updates);
        rule.put("id", id);
        rule.put("updatedAt", Instant.now().toString());

        return Response.ok(Map.of(
            "success", true,
            "data", rule
        )).build();
    }

    // ==================== AI Assistant ====================

    @POST
    @Path("/ai/query")
    public Response queryAI(Map<String, Object> request) {
        String query = (String) request.get("query");
        
        Map<String, Object> response = Map.of(
            "id", UUID.randomUUID().toString(),
            "role", "assistant",
            "content", "Based on the compliance data, I can help you with: " + query,
            "timestamp", Instant.now().toString(),
            "confidence", 0.85
        );

        return Response.ok(Map.of(
            "success", true,
            "data", response
        )).build();
    }

    @POST
    @Path("/ai/explain")
    public Response explainTransaction(Map<String, String> request) {
        String transactionId = request.get("transactionId");
        
        Map<String, Object> explanation = Map.of(
            "id", UUID.randomUUID().toString(),
            "role", "assistant",
            "content", "Transaction " + transactionId + " was flagged due to high-risk jurisdiction and amount threshold breach.",
            "timestamp", Instant.now().toString(),
            "confidence", 0.92
        );

        return Response.ok(Map.of(
            "success", true,
            "data", explanation
        )).build();
    }

    @POST
    @Path("/ai/generate-sar")
    public Response generateSAR(Map<String, String> request) {
        String caseId = request.get("caseId");
        
        String sarContent = "SUSPICIOUS ACTIVITY REPORT\n\n" +
            "Case ID: " + caseId + "\n" +
            "Generated: " + Instant.now() + "\n\n" +
            "Summary: Suspicious transaction pattern detected...";

        return Response.ok(Map.of(
            "success", true,
            "data", Map.of("content", sarContent)
        )).build();
    }

    @GET
    @Path("/ai/compliance-summary")
    public Response getComplianceSummary() {
        String summary = "Overall compliance status is good. 94.5% compliance score with 3 critical alerts requiring attention.";
        
        return Response.ok(Map.of(
            "success", true,
            "data", Map.of("summary", summary)
        )).build();
    }

    // ==================== Reports ====================

    @GET
    @Path("/reports")
    public Response getReports() {
        List<Map<String, Object>> reports = List.of(
            Map.of(
                "id", "RPT-001",
                "type", "AML",
                "title", "Monthly AML Compliance Report",
                "generatedAt", Instant.now().toString(),
                "generatedBy", "system",
                "status", "final"
            )
        );

        return Response.ok(Map.of(
            "success", true,
            "data", reports
        )).build();
    }

    @POST
    @Path("/reports/generate")
    public Response generateReport(Map<String, Object> request) {
        String type = (String) request.get("type");
        
        Map<String, Object> report = Map.of(
            "id", "RPT-" + UUID.randomUUID().toString().substring(0, 8),
            "type", type,
            "title", type + " Compliance Report",
            "generatedAt", Instant.now().toString(),
            "generatedBy", "system",
            "status", "draft"
        );

        return Response.ok(Map.of(
            "success", true,
            "data", report
        )).build();
    }

    @GET
    @Path("/reports/{id}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadReport(@PathParam("id") String id) {
        // Mock PDF download
        byte[] pdfContent = ("Mock PDF Report Content for " + id).getBytes();
        
        return Response.ok(pdfContent)
            .header("Content-Disposition", "attachment; filename=report-" + id + ".pdf")
            .build();
    }

    // ==================== Helper Methods ====================

    private List<Map<String, Object>> generateMockTransactions(int count) {
        List<Map<String, Object>> transactions = new ArrayList<>();
        String[] statuses = {"pending", "flagged", "cleared", "escalated"};
        String[] countries = {"US", "UK", "DE", "FR", "JP"};
        
        for (int i = 0; i < count; i++) {
            transactions.add(Map.of(
                "id", "TXN-" + UUID.randomUUID().toString().substring(0, 8),
                "customerId", "CUST-" + (1000 + i),
                "customerName", "Customer " + i,
                "amount", 10000 + (i * 1000),
                "currency", "USD",
                "country", countries[i % countries.length],
                "jurisdiction", "New York",
                "timestamp", Instant.now().minusSeconds(i * 3600).toString(),
                "riskScore", 50 + (i % 50),
                "status", statuses[i % statuses.length]
            ));
        }
        return transactions;
    }

    private List<Map<String, Object>> generateMockAlerts(int count) {
        List<Map<String, Object>> alerts = new ArrayList<>();
        String[] severities = {"critical", "high", "medium", "low"};
        String[] types = {"AML", "KYC", "Basel", "Sanctions"};
        String[] statuses = {"open", "investigating", "resolved"};
        
        for (int i = 0; i < count; i++) {
            alerts.add(Map.of(
                "id", "ALT-" + UUID.randomUUID().toString().substring(0, 8),
                "transactionId", "TXN-" + UUID.randomUUID().toString().substring(0, 8),
                "severity", severities[i % severities.length],
                "type", types[i % types.length],
                "title", "Alert " + i,
                "description", "Alert description " + i,
                "timestamp", Instant.now().minusSeconds(i * 1800).toString(),
                "status", statuses[i % statuses.length]
            ));
        }
        return alerts;
    }

    private List<Map<String, Object>> generateMockCases(int count) {
        List<Map<String, Object>> cases = new ArrayList<>();
        String[] severities = {"critical", "high", "medium", "low"};
        String[] statuses = {"open", "under_review", "escalated", "resolved"};
        
        for (int i = 0; i < count; i++) {
            cases.add(Map.of(
                "id", "CASE-" + UUID.randomUUID().toString().substring(0, 8),
                "transactionId", "TXN-" + UUID.randomUUID().toString().substring(0, 8),
                "title", "Case " + i,
                "severity", severities[i % severities.length],
                "status", statuses[i % statuses.length],
                "createdAt", Instant.now().minusSeconds(i * 7200).toString(),
                "updatedAt", Instant.now().minusSeconds(i * 3600).toString(),
                "description", "Case description " + i
            ));
        }
        return cases;
    }

    private List<Map<String, Object>> generateMockActivities(int count) {
        List<Map<String, Object>> activities = new ArrayList<>();
        String[] types = {"transaction", "alert", "case", "report"};
        
        for (int i = 0; i < count; i++) {
            activities.add(Map.of(
                "id", "ACT-" + UUID.randomUUID().toString().substring(0, 8),
                "type", types[i % types.length],
                "title", "Activity " + i,
                "description", "Activity description " + i,
                "timestamp", Instant.now().minusSeconds(i * 600).toString(),
                "user", "user-" + (i % 5)
            ));
        }
        return activities;
    }

    private List<Map<String, Object>> generateMockTimeline() {
        return List.of(
            Map.of(
                "id", "TL-001",
                "type", "detected",
                "description", "Case created from high-risk alert",
                "timestamp", Instant.now().minusSeconds(86400).toString()
            ),
            Map.of(
                "id", "TL-002",
                "type", "assigned",
                "description", "Assigned to analyst-001",
                "timestamp", Instant.now().minusSeconds(43200).toString(),
                "user", "supervisor-001"
            )
        );
    }
}

// Made with Bob
