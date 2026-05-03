package com.guard.repository;

import com.guard.entity.TransactionEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class TransactionRepository implements PanacheRepositoryBase<TransactionEntity, String> {

    public List<TransactionEntity> findByStatus(String status, Page page) {
        return find("status", status).page(page).list();
    }

    public List<TransactionEntity> findByRiskLevel(String riskLevel, Page page) {
        return find("riskLevel", riskLevel).page(page).list();
    }

    public List<TransactionEntity> findByEntityId(String entityId) {
        return find("entityId", entityId).list();
    }

    public long countByStatus(String status) {
        return count("status", status);
    }

    public long countByRiskLevel(String riskLevel) {
        return count("riskLevel", riskLevel);
    }

    public List<TransactionEntity> searchTransactions(String searchTerm, Page page) {
        return find("entityId like ?1 or fromAccount like ?1 or toAccount like ?1", 
                    "%" + searchTerm + "%")
                .page(page)
                .list();
    }
}

// Made with Bob
