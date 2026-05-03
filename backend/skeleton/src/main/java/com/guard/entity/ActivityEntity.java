package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "activities")
public class ActivityEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank
    @Column(nullable = false)
    public String type; // TRANSACTION_FLAGGED, ALERT_CREATED, CASE_OPENED, CASE_ASSIGNED, etc.

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    public String message;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "user_id")
    public Long userId;

    @Column(name = "user_name")
    public String userName;

    @Column(name = "entity_id")
    public String entityId; // Related transaction/alert/case ID

    @Column(name = "entity_type")
    public String entityType; // TRANSACTION, ALERT, CASE

    @Column(nullable = false)
    public String severity; // INFO, WARNING, ERROR, CRITICAL

    @Column(columnDefinition = "TEXT")
    public String metadata; // JSON metadata

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();
}

// Made with Bob
