package com.guard.dto;

import java.util.List;

public class PaginatedResponse<T> {
    public List<T> items;
    public long total;
    public int page;
    public int pageSize;
    public int totalPages;

    public PaginatedResponse() {
    }

    public PaginatedResponse(List<T> items, long total, int page, int pageSize) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) total / pageSize);
    }
}

// Made with Bob
