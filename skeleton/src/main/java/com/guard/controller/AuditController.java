package com.guard.controller;

import com.guard.repository.AuditLogRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/audit")
@Produces(MediaType.APPLICATION_JSON)
public class AuditController {

    @Inject
    AuditLogRepository auditLogRepository;

    @GET
    @Path("/logs")
    public Response getLogs(@QueryParam("traceId") String traceId) {
        // TODO: filter by traceId if provided, return auditLogRepository.findAll()
        return null;
    }
}
