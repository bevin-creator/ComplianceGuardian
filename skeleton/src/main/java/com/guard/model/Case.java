package com.guard.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Case entity for compliance investigations.
 */
@Entity
@Table(name = "cases", indexes = {
    @Index(name = "idx_case_status", columnList = "status"),
    @Index(name = "idx_case_severity", columnList = "severity"),
    @Index(name = "idx_case_assigned", columnList = "assignedTo")
})
public class Case extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column(nullable = false)
    public String transactionId;

    @Column(nullable = false, length = 500)
    public String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Status status = Status.OPEN;

    @Column
    public String assignedTo;

    @Column(nullable = false)
    public Instant createdAt = Instant.now();

    @Column(nullable = false)
    public Instant updatedAt = Instant.now();

    @Column
    public Instant dueDate;

    @Enumerated(EnumType.STRING)
    @Column
    public SarStatus sarStatus;

    @Column(nullable = false, length = 2000)
    public String description;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("timestamp ASC")
    public List<TimelineEvent> timeline = new ArrayList<>();

    public enum Severity {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public enum Status {
        OPEN,
        UNDER_REVIEW,
        ESCALATED,
        RESOLVED
    }

    public enum SarStatus {
        PENDING,
        FILED,
        NOT_REQUIRED
    }

    // Panache finder methods
    public static List<Case> findByStatus(Status status) {
        return list("status", status);
    }

    public static List<Case> findBySeverity(Severity severity) {
        return list("severity", severity);
    }

    public static List<Case> findByAssignedTo(String userId) {
        return list("assignedTo", userId);
    }

    public static long countByStatus(Status status) {
        return count("status", status);
    }

    public static long countBySeverity(Severity severity) {
        return count("severity", severity);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    /**
     * Timeline event for case history.
     */
    @Entity
    @Table(name = "timeline_events")
    public static class TimelineEvent extends PanacheEntityBase {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        public String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "case_id", nullable = false)
        public Case caseEntity;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        public Type type;

        @Column(nullable = false, length = 1000)
        public String description;

        @Column(nullable = false)
        public Instant timestamp = Instant.now();

        @Column
        public String user;

        public enum Type {
            DETECTED,
            AI_REVIEWED,
            ASSIGNED,
            EDD_STARTED,
            SAR_FILED,
            CLOSED
        }
    }
}

// Made with Bob
