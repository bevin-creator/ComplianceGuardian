package com.guard.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class BatchIngestionResult {
    public String batchId;
    public int totalRecords;
    public int successfulRecords;
    public int failedRecords;
    public List<String> errors = new ArrayList<>();
    public Instant startTime;
    public Instant endTime;
    
    public BatchIngestionResult() {}
    
    public BatchIngestionResult(String batchId) {
        this.batchId = batchId;
        this.startTime = Instant.now();
    }
}

// Made with Bob
