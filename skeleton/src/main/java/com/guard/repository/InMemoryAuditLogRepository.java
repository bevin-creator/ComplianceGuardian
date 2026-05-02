package com.guard.repository;

import com.guard.model.AuditLog;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@ApplicationScoped
public class InMemoryAuditLogRepository implements AuditLogRepository {

    private final CopyOnWriteArrayList<AuditLog> store = new CopyOnWriteArrayList<>();

    @Override
    public AuditLog save(AuditLog log) {
        // TODO: generate UUID, set timestamp, add to store, return saved log
        return null;
    }

    @Override
    public List<AuditLog> findAll() {
        // TODO: return unmodifiable snapshot of store
        return null;
    }
}
