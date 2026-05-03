package com.guard.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

/**
 * Alert entity for compliance violations and suspicious activities.
 */
@Entity
@Table(name = "alerts", indexes = {
    @Index(name = "idx_alert_status", columnList = "status"),
    @Index(name = "idx_alert_severity", columnList = "severity"),
    @Index(name = "idx_alert_timestamp", columnList = "timestamp")
})
public class Alert extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column(nullable = false)
    public String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Type type;

    @Column(nullable = false, length = 500)
    public String title;

    @Column(nullable = false, length = 2000)
    public String description;

    @Column(nullable = false)
    public Instant timestamp = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Status status = Status.OPEN;

    @Column
    public String assignedTo;

    @Column(nullable = false)
    public Instant createdAt = Instant.now();

    @Column(nullable = false)
    public Instant updatedAt = Instant.now();

    public enum Severity {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public enum Type {
        AML,
        KYC,
        BASEL,
        SANCTIONS
    }

    public enum Status {
        OPEN,
        INVESTIGATING,
        RESOLVED
    }

    // Panache finder methods
    public static List<Alert> findByStatus(Status status) {
        return list("status", status);
    }

    public static List<Alert> findBySeverity(Severity severity) {
        return list("severity", severity);
    }

    public static List<Alert> findByStatusAndSeverity(Status status, Severity severity) {
        return list("status = ?1 and severity = ?2", status, severity);
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
}

// Made with Bob
