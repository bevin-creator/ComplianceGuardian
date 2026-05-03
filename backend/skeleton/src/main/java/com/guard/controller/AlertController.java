package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.AlertEntity;
import com.guard.repository.AlertRepository;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.util.List;

@Path("/api/alerts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlertController {

    @Inject
    AlertRepository alertRepository;

    @GET
    public ApiResponse<PaginatedResponse<AlertEntity>> getAlerts(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("status") String status,
            @QueryParam("severity") String severity,
            @QueryParam("assignedTo") String assignedTo) {
        
        Page pageRequest = Page.of(page, pageSize);
        List<AlertEntity> alerts;
        long total;

        if (status != null && !status.isEmpty()) {
            alerts = alertRepository.findByStatus(status, pageRequest);
            total = alertRepository.countByStatus(status);
        } else if (severity != null && !severity.isEmpty()) {
            alerts = alertRepository.findBySeverity(severity, pageRequest);
            total = alertRepository.countBySeverity(severity);
        } else if (assignedTo != null && !assignedTo.isEmpty()) {
            alerts = alertRepository.findByAssignedTo(assignedTo, pageRequest);
            total = alertRepository.countByAssignedTo(assignedTo);
        } else {
            alerts = alertRepository.findAll().page(pageRequest).list();
            total = alertRepository.count();
        }

        PaginatedResponse<AlertEntity> response = 
            new PaginatedResponse<>(alerts, total, page, pageSize);
        
        return ApiResponse.success(response);
    }

    @GET
    @Path("/{id}")
    public ApiResponse<AlertEntity> getAlert(@PathParam("id") String id) {
        AlertEntity alert = alertRepository.findById(id);
        if (alert == null) {
            return ApiResponse.error("Alert not found");
        }
        return ApiResponse.success(alert);
    }

    @PUT
    @Path("/{id}/status")
    @Transactional
    public ApiResponse<AlertEntity> updateAlertStatus(
            @PathParam("id") String id,
            StatusUpdateRequest request) {
        
        AlertEntity alert = alertRepository.findById(id);
        if (alert == null) {
            return ApiResponse.error("Alert not found");
        }

        alert.status = request.status;
        alert.updatedAt = LocalDateTime.now();
        alertRepository.persist(alert);
        
        return ApiResponse.success(alert, "Alert status updated successfully");
    }

    @PUT
    @Path("/{id}/assign")
    @Transactional
    public ApiResponse<AlertEntity> assignAlert(
            @PathParam("id") String id,
            AssignmentRequest request) {
        
        AlertEntity alert = alertRepository.findById(id);
        if (alert == null) {
            return ApiResponse.error("Alert not found");
        }

        alert.assignedTo = request.assignedTo;
        alert.updatedAt = LocalDateTime.now();
        alertRepository.persist(alert);
        
        return ApiResponse.success(alert, "Alert assigned successfully");
    }

    @PUT
    @Path("/{id}/resolve")
    @Transactional
    public ApiResponse<AlertEntity> resolveAlert(
            @PathParam("id") String id,
            ResolutionRequest request) {
        
        AlertEntity alert = alertRepository.findById(id);
        if (alert == null) {
            return ApiResponse.error("Alert not found");
        }

        alert.status = "resolved";
        alert.resolution = request.resolution;
        alert.resolvedAt = LocalDateTime.now();
        alert.resolvedBy = request.resolvedBy;
        alert.updatedAt = LocalDateTime.now();
        alertRepository.persist(alert);
        
        return ApiResponse.success(alert, "Alert resolved successfully");
    }

    public static class StatusUpdateRequest {
        public String status;
    }

    public static class AssignmentRequest {
        public String assignedTo;
    }

    public static class ResolutionRequest {
        public String resolution;
        public String resolvedBy;
    }
}

// Made with Bob
