package com.guard.repository;

import com.guard.entity.ActivityEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ActivityRepository implements PanacheRepositoryBase<ActivityEntity, Long> {

    public List<ActivityEntity> findRecent(Page page) {
        return findAll(Sort.descending("createdAt")).page(page).list();
    }

    public List<ActivityEntity> findByType(String type, Page page) {
        return find("type", Sort.descending("createdAt"), type).page(page).list();
    }

    public List<ActivityEntity> findByUserId(Long userId, Page page) {
        return find("userId", Sort.descending("createdAt"), userId).page(page).list();
    }

    public List<ActivityEntity> findByEntityId(String entityId) {
        return find("entityId", Sort.descending("createdAt"), entityId).list();
    }
}

// Made with Bob
