package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cases")
public class CaseEntity extends PanacheEntityBase {

    @Id
    @Column(length = 50)
    public String id;

    @NotBlank
    @Column(nullable = false)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String description;

    @NotBlank
    @Column(nullable = false)
    public String type; // AML, KYC, SANCTIONS, FRAUD, etc.

    @NotBlank
    @Column(nullable = false)
    public String status; // OPEN, IN_PROGRESS, UNDER_REVIEW, CLOSED, ESCALATED

    @NotBlank
    @Column(nullable = false)
    public String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @NotBlank
    @Column(nullable = false)
    public String priority; // LOW, MEDIUM, HIGH, URGENT

    @Column(name = "entity_id")
    public String entityId;

    @Column(name = "entity_name")
    public String entityName;

    @ElementCollection
    @CollectionTable(name = "case_alert_ids", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "alert_id")
    public List<String> alertIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "case_transaction_ids", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "transaction_id")
    public List<String> transactionIds = new ArrayList<>();

    @Column(name = "assigned_to")
    public Long assignedTo;

    @Column(name = "assigned_to_name")
    public String assignedToName;

    @Column(name = "created_by", nullable = false)
    public Long createdBy;

    @Column(name = "created_by_name")
    public String createdByName;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    public Instant updatedAt = Instant.now();

    @Column(name = "due_date")
    public Instant dueDate;

    @Column(name = "closed_at")
    public Instant closedAt;

    @Column(name = "closed_by")
    public Long closedBy;

    @Column(columnDefinition = "TEXT")
    public String notes;

    @Column(columnDefinition = "TEXT")
    public String resolution;

    @ElementCollection
    @CollectionTable(name = "case_tags", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "tag")
    public List<String> tags = new ArrayList<>();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

// Made with Bob
