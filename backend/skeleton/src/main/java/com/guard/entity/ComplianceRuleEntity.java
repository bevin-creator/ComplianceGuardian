package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "compliance_rules")
public class ComplianceRuleEntity extends PanacheEntityBase {

    @Id
    @Column(length = 50)
    public String id;

    @NotBlank
    @Column(nullable = false)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @NotBlank
    @Column(nullable = false)
    public String category; // AML, KYC, BASEL, SANCTIONS, etc.

    @NotBlank
    @Column(nullable = false)
    public String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false)
    public Boolean enabled = true;

    @Column(columnDefinition = "TEXT")
    public String conditions; // JSON conditions

    @Column(columnDefinition = "TEXT")
    public String actions; // JSON actions

    @Column(name = "threshold_value")
    public String thresholdValue;

    @Column(name = "threshold_operator")
    public String thresholdOperator; // GT, LT, EQ, etc.

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    public Instant updatedAt = Instant.now();

    @Column(name = "created_by")
    public Long createdBy;

    @Column(name = "updated_by")
    public Long updatedBy;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

// Made with Bob
