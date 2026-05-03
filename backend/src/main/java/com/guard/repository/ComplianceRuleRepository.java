package com.guard.repository;

import com.guard.entity.ComplianceRuleEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ComplianceRuleRepository implements PanacheRepositoryBase<ComplianceRuleEntity, String> {

    public List<ComplianceRuleEntity> findEnabled() {
        return find("enabled", true).list();
    }

    public List<ComplianceRuleEntity> findByCategory(String category) {
        return find("category", category).list();
    }

    public List<ComplianceRuleEntity> findBySeverity(String severity) {
        return find("severity", severity).list();
    }
}

// Made with Bob
