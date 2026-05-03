package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
public class TransactionEntity extends PanacheEntityBase {

    @Id
    @Column(length = 50)
    public String id;

    @NotBlank
    @Column(name = "entity_id", nullable = false)
    public String entityId;

    @NotBlank
    @Column(nullable = false)
    public String type; // WIRE_TRANSFER, ACH, CARD, etc.

    @NotNull
    @Column(nullable = false, precision = 19, scale = 4)
    public BigDecimal amount;

    @NotBlank
    @Column(nullable = false, length = 3)
    public String currency;

    @Column(name = "from_account")
    public String fromAccount;

    @Column(name = "to_account")
    public String toAccount;

    @Column(name = "from_country", length = 2)
    public String fromCountry;

    @Column(name = "to_country", length = 2)
    public String toCountry;

    @NotBlank
    @Column(nullable = false)
    public String status; // PENDING, APPROVED, FLAGGED, REJECTED

    @Column(name = "risk_level")
    public String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "risk_score", precision = 5, scale = 2)
    public BigDecimal riskScore;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "flagged_rules", columnDefinition = "TEXT")
    public String flaggedRules; // JSON array of rule IDs

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    public Instant updatedAt = Instant.now();

    @Column(name = "reviewed_by")
    public Long reviewedBy;

    @Column(name = "reviewed_at")
    public Instant reviewedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

// Made with Bob
