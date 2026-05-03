package com.guard.repository;

import com.guard.model.AuditLog;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@ApplicationScoped
public class InMemoryAuditLogRepository implements AuditLogRepository {

    private final CopyOnWriteArrayList<AuditLog> store = new CopyOnWriteArrayList<>();

    @Override
    public AuditLog save(AuditLog log) {
        // AuditLog already has id and timestamp set in constructor
        // Just add to thread-safe store and return
        store.add(log);
        return log;
    }

    @Override
    public List<AuditLog> findAll() {
        // Return unmodifiable view of the store for read-only access
        // CopyOnWriteArrayList is already thread-safe for iteration
        return Collections.unmodifiableList(store);
    }

    @Override
    public List<AuditLog> findAll(int limit, int offset) {
        // Paginated retrieval to prevent memory issues
        return store.stream()
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<AuditLog> findByTraceId(String traceId) {
        // Filter by traceId - no pagination
        return store.stream()
                .filter(log -> traceId.equals(log.traceId))
                .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<AuditLog> findByTraceId(String traceId, int limit, int offset) {
        // Filter by traceId with pagination
        return store.stream()
                .filter(log -> traceId.equals(log.traceId))
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toUnmodifiableList());
    }
}
