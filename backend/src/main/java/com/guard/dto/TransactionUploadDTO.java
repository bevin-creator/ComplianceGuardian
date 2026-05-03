package com.guard.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionUploadDTO {
    public String transactionId;
    public String entityId;
    public String type;
    public BigDecimal amount;
    public String currency;
    public String fromAccount;
    public String toAccount;
    public String fromCountry;
    public String toCountry;
    public String customerId;
    public Instant timestamp;
    public String description;
    
    // Validation tracking
    public transient String validationError;
    public transient int rowNumber;
    
    public TransactionUploadDTO() {}
}

// Made with Bob
