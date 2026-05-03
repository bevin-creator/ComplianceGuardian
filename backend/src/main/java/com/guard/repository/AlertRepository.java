package com.guard.repository;

import com.guard.entity.AlertEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class AlertRepository implements PanacheRepositoryBase<AlertEntity, String> {

    public List<AlertEntity> findByStatus(String status, Page page) {
        return find("status", status).page(page).list();
    }

    public List<AlertEntity> findBySeverity(String severity, Page page) {
        return find("severity", severity).page(page).list();
    }

    public List<AlertEntity> findByTransactionId(String transactionId) {
        return find("transactionId", transactionId).list();
    }

    public long countByStatus(String status) {
        return count("status", status);
    }

    public long countBySeverity(String severity) {
        return count("severity", severity);
    }

    public List<AlertEntity> findByAssignedTo(Long userId, Page page) {
        return find("assignedTo", userId).page(page).list();
    }
}

// Made with Bob
