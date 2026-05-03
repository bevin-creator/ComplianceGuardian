package com.guard.repository;

import com.guard.entity.CaseEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CaseRepository implements PanacheRepositoryBase<CaseEntity, String> {

    public List<CaseEntity> findByStatus(String status, Page page) {
        return find("status", status).page(page).list();
    }

    public List<CaseEntity> findBySeverity(String severity, Page page) {
        return find("severity", severity).page(page).list();
    }

    public List<CaseEntity> findByAssignedTo(Long userId, Page page) {
        return find("assignedTo", userId).page(page).list();
    }

    public long countByStatus(String status) {
        return count("status", status);
    }

    public long countBySeverity(String severity) {
        return count("severity", severity);
    }
}

// Made with Bob
