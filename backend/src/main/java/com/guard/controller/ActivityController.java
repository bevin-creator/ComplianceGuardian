package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.ActivityEntity;
import com.guard.repository.ActivityRepository;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.Instant;
import java.util.List;

@Path("/api/activity")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ActivityController {

    @Inject
    ActivityRepository activityRepository;

    @GET
    public ApiResponse<PaginatedResponse<ActivityEntity>> getActivities(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("50") int pageSize,
            @QueryParam("type") String type,
            @QueryParam("userId") Long userId) {
        
        Page pageRequest = Page.of(page, pageSize);
        List<ActivityEntity> activities;
        long total;

        if (type != null && !type.isEmpty()) {
            activities = activityRepository.findByType(type, pageRequest);
            total = activityRepository.count("type", type);
        } else if (userId != null) {
            activities = activityRepository.findByUserId(userId, pageRequest);
            total = activityRepository.count("userId", userId);
        } else {
            activities = activityRepository.findRecent(pageRequest);
            total = activityRepository.count();
        }

        PaginatedResponse<ActivityEntity> response = 
            new PaginatedResponse<>(activities, total, page, pageSize);
        
        return ApiResponse.success(response);
    }

    @GET
    @Path("/recent")
    public ApiResponse<List<ActivityEntity>> getRecentActivities(
            @QueryParam("limit") @DefaultValue("20") int limit) {
        
        Page pageRequest = Page.of(0, limit);
        List<ActivityEntity> activities = activityRepository.findRecent(pageRequest);
        return ApiResponse.success(activities);
    }

    @POST
    @Transactional
    public ApiResponse<ActivityEntity> createActivity(CreateActivityRequest request) {
        ActivityEntity activity = new ActivityEntity();
        activity.type = request.type;
        activity.message = request.message;
        activity.description = request.description;
        activity.userId = request.userId;
        activity.userName = request.userName;
        activity.entityType = request.entityType;
        activity.entityId = request.entityId;
        activity.severity = request.severity != null ? request.severity : "INFO";
        activity.metadata = request.metadata;
        activity.createdAt = Instant.now();
        
        activityRepository.persist(activity);
        return ApiResponse.success(activity, "Activity logged successfully");
    }

    @GET
    @Path("/types")
    public ApiResponse<List<String>> getActivityTypes() {
        List<String> types = List.of(
            "TRANSACTION_FLAGGED",
            "ALERT_CREATED",
            "ALERT_ASSIGNED",
            "ALERT_RESOLVED",
            "CASE_OPENED",
            "CASE_ASSIGNED",
            "CASE_UPDATED",
            "CASE_CLOSED",
            "RULE_TRIGGERED",
            "USER_LOGIN",
            "USER_LOGOUT",
            "REPORT_GENERATED",
            "SCAN_COMPLETED"
        );
        return ApiResponse.success(types);
    }

    public static class CreateActivityRequest {
        public String type;
        public String message;
        public String description;
        public Long userId;
        public String userName;
        public String entityType;
        public String entityId;
        public String severity;
        public String metadata;
    }
}

// Made with Bob
