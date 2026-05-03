package com.guard.controller;

import com.guard.model.AuditLog;
import com.guard.repository.AuditLogRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Map;

/**
 * Audit log controller - READ ONLY for integrity.
 *
 * DESIGN PRINCIPLES:
 * - No POST/PUT/DELETE endpoints to prevent tampering with audit trail
 * - Pagination support to prevent memory issues with large datasets
 * - Filtering logic delegated to repository layer (clean separation)
 * - Instana-compatible structured logging with traceId
 * - Scalable for enterprise audit requirements
 */
@Path("/audit")
@Produces(MediaType.APPLICATION_JSON)
public class AuditController {

    private static final Logger LOG = Logger.getLogger(AuditController.class);
    private static final int DEFAULT_LIMIT = 100;
    private static final int MAX_LIMIT = 1000;

    @Inject
    AuditLogRepository auditLogRepository;

    /**
     * Retrieves audit logs with optional filtering and pagination.
     *
     * Query Parameters:
     * - traceId: Filter by specific trace ID (optional)
     * - limit: Maximum number of records to return (default: 100, max: 1000)
     * - offset: Number of records to skip (default: 0)
     *
     * Examples:
     * - GET /audit/logs
     * - GET /audit/logs?limit=50&offset=0
     * - GET /audit/logs?traceId=abc-123
     * - GET /audit/logs?traceId=abc-123&limit=10
     *
     * @param traceId Optional trace ID to filter logs
     * @param limit Maximum number of records (default 100, max 1000)
     * @param offset Number of records to skip (default 0)
     * @return Paginated list of audit logs with metadata
     */
    @GET
    @Path("/logs")
    public Response getLogs(
            @QueryParam("traceId") String traceId,
            @QueryParam("limit") @DefaultValue("100") int limit,
            @QueryParam("offset") @DefaultValue("0") int offset) {
        
        // Validate and cap limit to prevent abuse
        if (limit <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "limit must be greater than 0"))
                    .build();
        }
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        
        // Validate offset
        if (offset < 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "offset must be non-negative"))
                    .build();
        }

        // Delegate filtering to repository layer (clean separation)
        List<AuditLog> logs;
        if (traceId != null && !traceId.isBlank()) {
            logs = auditLogRepository.findByTraceId(traceId, limit, offset);
            LOG.infof("Audit logs retrieved: traceId=%s, limit=%d, offset=%d, count=%d",
                      traceId, limit, offset, logs.size());
        } else {
            logs = auditLogRepository.findAll(limit, offset);
            LOG.debugf("Audit logs retrieved: limit=%d, offset=%d, count=%d",
                       limit, offset, logs.size());
        }
        
        // Return with pagination metadata
        return Response.ok(Map.of(
            "data", logs,
            "pagination", Map.of(
                "limit", limit,
                "offset", offset,
                "count", logs.size()
            )
        )).build();
    }
}
