package com.guard.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.Map;

/**
 * Custom health endpoint for application status.
 *
 * Note: Quarkus also provides:
 * - /q/health/live - Kubernetes liveness probe
 * - /q/health/ready - Kubernetes readiness probe
 * - /q/metrics - Prometheus metrics scraping
 */
@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthController {

    @GET
    public Response health() {
        return Response.ok(Map.of(
            "status", "UP",
            "service", "Compliance Guard",
            "version", "2.0.0",
            "timestamp", Instant.now().toString()
        )).build();
    }
}
