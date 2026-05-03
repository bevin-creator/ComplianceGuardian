package com.guard.model;

import java.math.BigDecimal;
import java.time.Instant;

public class Transaction {

    public String transactionId;
    public BigDecimal amount;
    public String currency;
    public String originCountry;
    public String destinationCountry;
    public String customerId;
    public Instant timestamp;

    public Transaction() {}
}
