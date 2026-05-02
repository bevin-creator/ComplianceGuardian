package com.guard.repository;

import com.guard.model.AuditLog;

import java.util.List;

public interface AuditLogRepository {

    AuditLog save(AuditLog log);

    List<AuditLog> findAll();

    List<AuditLog> findAll(int limit, int offset);

    List<AuditLog> findByTraceId(String traceId);

    List<AuditLog> findByTraceId(String traceId, int limit, int offset);
}
