package com.guard.model;

import java.time.Instant;

public class Contract {

    public String contractId;
    public String partyA;
    public String partyB;
    public String jurisdiction;
    public String contractType;
    public Instant effectiveDate;
    public Instant expiryDate;

    public Contract() {}
}
