package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.CaseEntity;
import com.guard.repository.CaseRepository;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Path("/api/cases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CaseController {

    @Inject
    CaseRepository caseRepository;

    @GET
    public ApiResponse<PaginatedResponse<CaseEntity>> getCases(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("status") String status,
            @QueryParam("severity") String severity,
            @QueryParam("assignedTo") Long assignedTo) {
        
        Page pageRequest = Page.of(page, pageSize);
        List<CaseEntity> cases;
        long total;

        if (status != null && !status.isEmpty()) {
            cases = caseRepository.findByStatus(status, pageRequest);
            total = caseRepository.countByStatus(status);
        } else if (severity != null && !severity.isEmpty()) {
            cases = caseRepository.findBySeverity(severity, pageRequest);
            total = caseRepository.countBySeverity(severity);
        } else if (assignedTo != null) {
            cases = caseRepository.findByAssignedTo(assignedTo, pageRequest);
            total = caseRepository.count("assignedTo", assignedTo);
        } else {
            cases = caseRepository.findAll().page(pageRequest).list();
            total = caseRepository.count();
        }

        PaginatedResponse<CaseEntity> response = 
            new PaginatedResponse<>(cases, total, page, pageSize);
        
        return ApiResponse.success(response);
    }

    @GET
    @Path("/{id}")
    public ApiResponse<CaseEntity> getCase(@PathParam("id") String id) {
        CaseEntity caseEntity = caseRepository.findById(id);
        if (caseEntity == null) {
            return ApiResponse.error("Case not found");
        }
        return ApiResponse.success(caseEntity);
    }

    @POST
    @Transactional
    public ApiResponse<CaseEntity> createCase(CreateCaseRequest request) {
        CaseEntity caseEntity = new CaseEntity();
        caseEntity.id = UUID.randomUUID().toString();
        caseEntity.title = request.title;
        caseEntity.description = request.description;
        caseEntity.type = request.type;
        caseEntity.severity = request.severity;
        caseEntity.priority = request.priority != null ? request.priority : "MEDIUM";
        caseEntity.status = "OPEN";
        caseEntity.alertIds = request.alertIds;
        caseEntity.transactionIds = request.transactionIds;
        caseEntity.assignedTo = request.assignedTo;
        caseEntity.createdBy = request.createdBy;
        caseEntity.createdAt = Instant.now();
        caseEntity.updatedAt = Instant.now();
        
        caseRepository.persist(caseEntity);
        return ApiResponse.success(caseEntity, "Case created successfully");
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public ApiResponse<CaseEntity> updateCase(
            @PathParam("id") String id,
            UpdateCaseRequest request) {
        
        CaseEntity caseEntity = caseRepository.findById(id);
        if (caseEntity == null) {
            return ApiResponse.error("Case not found");
        }

        if (request.title != null) caseEntity.title = request.title;
        if (request.description != null) caseEntity.description = request.description;
        if (request.severity != null) caseEntity.severity = request.severity;
        if (request.priority != null) caseEntity.priority = request.priority;
        if (request.status != null) caseEntity.status = request.status;
        if (request.tags != null) caseEntity.tags = request.tags;
        
        caseEntity.updatedAt = Instant.now();
        caseRepository.persist(caseEntity);
        
        return ApiResponse.success(caseEntity, "Case updated successfully");
    }

    @PUT
    @Path("/{id}/assign")
    @Transactional
    public ApiResponse<CaseEntity> assignCase(
            @PathParam("id") String id,
            AssignmentRequest request) {
        
        CaseEntity caseEntity = caseRepository.findById(id);
        if (caseEntity == null) {
            return ApiResponse.error("Case not found");
        }

        caseEntity.assignedTo = request.assignedTo;
        caseEntity.assignedToName = request.assignedToName;
        caseEntity.updatedAt = Instant.now();
        caseRepository.persist(caseEntity);
        
        return ApiResponse.success(caseEntity, "Case assigned successfully");
    }

    @POST
    @Path("/{id}/notes")
    @Transactional
    public ApiResponse<CaseEntity> addNote(
            @PathParam("id") String id,
            NoteRequest request) {
        
        CaseEntity caseEntity = caseRepository.findById(id);
        if (caseEntity == null) {
            return ApiResponse.error("Case not found");
        }

        if (caseEntity.notes == null) {
            caseEntity.notes = "";
        }
        
        String timestamp = Instant.now().toString();
        String newNote = String.format("[%s] %s: %s\n", timestamp, request.author, request.note);
        caseEntity.notes = caseEntity.notes + newNote;
        caseEntity.updatedAt = Instant.now();
        caseRepository.persist(caseEntity);
        
        return ApiResponse.success(caseEntity, "Note added successfully");
    }

    @PUT
    @Path("/{id}/close")
    @Transactional
    public ApiResponse<CaseEntity> closeCase(
            @PathParam("id") String id,
            CloseCaseRequest request) {
        
        CaseEntity caseEntity = caseRepository.findById(id);
        if (caseEntity == null) {
            return ApiResponse.error("Case not found");
        }

        caseEntity.status = "CLOSED";
        caseEntity.resolution = request.resolution;
        caseEntity.closedAt = Instant.now();
        caseEntity.closedBy = request.closedBy;
        caseEntity.updatedAt = Instant.now();
        caseRepository.persist(caseEntity);
        
        return ApiResponse.success(caseEntity, "Case closed successfully");
    }

    public static class CreateCaseRequest {
        public String title;
        public String description;
        public String type;
        public String severity;
        public String priority;
        public List<String> alertIds;
        public List<String> transactionIds;
        public Long assignedTo;
        public Long createdBy;
    }

    public static class UpdateCaseRequest {
        public String title;
        public String description;
        public String severity;
        public String priority;
        public String status;
        public List<String> tags;
    }

    public static class AssignmentRequest {
        public Long assignedTo;
        public String assignedToName;
    }

    public static class NoteRequest {
        public String note;
        public String author;
    }

    public static class CloseCaseRequest {
        public String resolution;
        public Long closedBy;
    }
}

// Made with Bob
