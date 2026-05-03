package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.ActivityEntity;
import com.guard.repository.ActivityRepository;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
            @QueryParam("userId") String userId) {
        
        Page pageRequest = Page.of(page, pageSize);
        Sort sort = Sort.by("timestamp").descending();
        List<ActivityEntity> activities;
        long total;

        if (type != null && !type.isEmpty()) {
            activities = activityRepository.findByType(type, sort, pageRequest);
            total = activityRepository.countByType(type);
        } else if (userId != null && !userId.isEmpty()) {
            activities = activityRepository.findByUserId(userId, sort, pageRequest);
            total = activityRepository.countByUserId(userId);
        } else {
            activities = activityRepository.findRecent(pageRequest.size, sort);
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
        
        Sort sort = Sort.by("timestamp").descending();
        List<ActivityEntity> activities = activityRepository.findRecent(limit, sort);
        return ApiResponse.success(activities);
    }

    @POST
    @Transactional
    public ApiResponse<ActivityEntity> createActivity(CreateActivityRequest request) {
        ActivityEntity activity = new ActivityEntity();
        activity.id = UUID.randomUUID().toString();
        activity.type = request.type;
        activity.message = request.message;
        activity.userId = request.userId;
        activity.userName = request.userName;
        activity.entityType = request.entityType;
        activity.entityId = request.entityId;
        activity.metadata = request.metadata;
        activity.timestamp = LocalDateTime.now();
        
        activityRepository.persist(activity);
        return ApiResponse.success(activity, "Activity logged successfully");
    }

    @GET
    @Path("/types")
    public ApiResponse<List<String>> getActivityTypes() {
        List<String> types = List.of(
            "transaction_created",
            "transaction_flagged",
            "alert_created",
            "alert_assigned",
            "alert_resolved",
            "case_created",
            "case_assigned",
            "case_updated",
            "case_closed",
            "rule_triggered",
            "user_login",
            "user_logout",
            "report_generated",
            "scan_completed"
        );
        return ApiResponse.success(types);
    }

    public static class CreateActivityRequest {
        public String type;
        public String message;
        public String userId;
        public String userName;
        public String entityType;
        public String entityId;
        public String metadata;
    }
}

// Made with Bob
