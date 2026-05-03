package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "alerts")
public class AlertEntity extends PanacheEntityBase {

    @Id
    @Column(length = 50)
    public String id;

    @NotBlank
    @Column(name = "transaction_id", nullable = false)
    public String transactionId;

    @NotBlank
    @Column(nullable = false)
    public String type; // AML, KYC, BASEL, SANCTIONS, etc.

    @NotBlank
    @Column(nullable = false)
    public String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @NotBlank
    @Column(nullable = false)
    public String status; // OPEN, IN_REVIEW, RESOLVED, FALSE_POSITIVE

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    public String message;

    @Column(columnDefinition = "TEXT")
    public String description;

    @NotBlank
    @Column(name = "rule_id", nullable = false)
    public String ruleId;

    @Column(name = "rule_name")
    public String ruleName;

    @Column(name = "risk_score", precision = 5, scale = 2)
    public BigDecimal riskScore;

    @Column(name = "entity_id")
    public String entityId;

    @Column(name = "entity_name")
    public String entityName;

    @Column(columnDefinition = "TEXT")
    public String metadata; // JSON metadata

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    public Instant updatedAt = Instant.now();

    @Column(name = "assigned_to")
    public Long assignedTo;

    @Column(name = "resolved_at")
    public Instant resolvedAt;

    @Column(name = "resolved_by")
    public Long resolvedBy;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    public String resolutionNotes;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

// Made with Bob
