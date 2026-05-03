package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.ComplianceRuleEntity;
import com.guard.repository.ComplianceRuleRepository;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Path("/api/rules")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RulesController {

    @Inject
    ComplianceRuleRepository ruleRepository;

    @GET
    public ApiResponse<PaginatedResponse<ComplianceRuleEntity>> getRules(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("category") String category,
            @QueryParam("severity") String severity,
            @QueryParam("enabled") Boolean enabled) {
        
        Page pageRequest = Page.of(page, pageSize);
        List<ComplianceRuleEntity> rules;
        long total;

        if (enabled != null && enabled) {
            rules = ruleRepository.findEnabled();
            // Apply pagination manually
            int start = page * pageSize;
            int end = Math.min(start + pageSize, rules.size());
            rules = rules.subList(start, Math.min(end, rules.size()));
            total = ruleRepository.count("enabled", true);
        } else if (category != null && !category.isEmpty()) {
            rules = ruleRepository.findByCategory(category);
            int start = page * pageSize;
            int end = Math.min(start + pageSize, rules.size());
            rules = rules.subList(start, Math.min(end, rules.size()));
            total = ruleRepository.count("category", category);
        } else if (severity != null && !severity.isEmpty()) {
            rules = ruleRepository.findBySeverity(severity);
            int start = page * pageSize;
            int end = Math.min(start + pageSize, rules.size());
            rules = rules.subList(start, Math.min(end, rules.size()));
            total = ruleRepository.count("severity", severity);
        } else {
            rules = ruleRepository.findAll().page(pageRequest).list();
            total = ruleRepository.count();
        }

        PaginatedResponse<ComplianceRuleEntity> response = 
            new PaginatedResponse<>(rules, total, page, pageSize);
        
        return ApiResponse.success(response);
    }

    @GET
    @Path("/{id}")
    public ApiResponse<ComplianceRuleEntity> getRule(@PathParam("id") String id) {
        ComplianceRuleEntity rule = ruleRepository.findById(id);
        if (rule == null) {
            return ApiResponse.error("Rule not found");
        }
        return ApiResponse.success(rule);
    }

    @POST
    @Transactional
    public ApiResponse<ComplianceRuleEntity> createRule(CreateRuleRequest request) {
        ComplianceRuleEntity rule = new ComplianceRuleEntity();
        rule.id = UUID.randomUUID().toString();
        rule.name = request.name;
        rule.description = request.description;
        rule.category = request.category;
        rule.severity = request.severity;
        rule.enabled = request.enabled != null ? request.enabled : true;
        rule.conditions = request.conditions;
        rule.actions = request.actions;
        rule.thresholdValue = request.thresholdValue;
        rule.thresholdOperator = request.thresholdOperator;
        rule.createdAt = Instant.now();
        rule.updatedAt = Instant.now();
        
        ruleRepository.persist(rule);
        return ApiResponse.success(rule, "Rule created successfully");
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public ApiResponse<ComplianceRuleEntity> updateRule(
            @PathParam("id") String id,
            UpdateRuleRequest request) {
        
        ComplianceRuleEntity rule = ruleRepository.findById(id);
        if (rule == null) {
            return ApiResponse.error("Rule not found");
        }

        if (request.name != null) rule.name = request.name;
        if (request.description != null) rule.description = request.description;
        if (request.category != null) rule.category = request.category;
        if (request.severity != null) rule.severity = request.severity;
        if (request.enabled != null) rule.enabled = request.enabled;
        if (request.conditions != null) rule.conditions = request.conditions;
        if (request.actions != null) rule.actions = request.actions;
        if (request.thresholdValue != null) rule.thresholdValue = request.thresholdValue;
        if (request.thresholdOperator != null) rule.thresholdOperator = request.thresholdOperator;
        
        rule.updatedAt = Instant.now();
        ruleRepository.persist(rule);
        
        return ApiResponse.success(rule, "Rule updated successfully");
    }

    @PUT
    @Path("/{id}/toggle")
    @Transactional
    public ApiResponse<ComplianceRuleEntity> toggleRule(@PathParam("id") String id) {
        ComplianceRuleEntity rule = ruleRepository.findById(id);
        if (rule == null) {
            return ApiResponse.error("Rule not found");
        }

        rule.enabled = !rule.enabled;
        rule.updatedAt = Instant.now();
        ruleRepository.persist(rule);
        
        String message = rule.enabled ? "Rule enabled successfully" : "Rule disabled successfully";
        return ApiResponse.success(rule, message);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public ApiResponse<Void> deleteRule(@PathParam("id") String id) {
        ComplianceRuleEntity rule = ruleRepository.findById(id);
        if (rule == null) {
            return ApiResponse.error("Rule not found");
        }

        ruleRepository.delete(rule);
        return ApiResponse.success(null, "Rule deleted successfully");
    }

    @GET
    @Path("/categories")
    public ApiResponse<List<String>> getCategories() {
        List<String> categories = List.of(
            "AML",
            "KYC",
            "BASEL",
            "SANCTIONS",
            "FRAUD",
            "GDPR",
            "PCI_DSS",
            "CUSTOM"
        );
        return ApiResponse.success(categories);
    }

    public static class CreateRuleRequest {
        public String name;
        public String description;
        public String category;
        public String severity;
        public Boolean enabled;
        public String conditions;
        public String actions;
        public String thresholdValue;
        public String thresholdOperator;
    }

    public static class UpdateRuleRequest {
        public String name;
        public String description;
        public String category;
        public String severity;
        public Boolean enabled;
        public String conditions;
        public String actions;
        public String thresholdValue;
        public String thresholdOperator;
    }
}

// Made with Bob
