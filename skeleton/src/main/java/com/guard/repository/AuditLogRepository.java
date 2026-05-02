package com.guard.repository;

import com.guard.model.AuditLog;

import java.util.List;

public interface AuditLogRepository {

    AuditLog save(AuditLog log);

    List<AuditLog> findAll();
}
