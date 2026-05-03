package com.guard.service;

import com.guard.dto.TransactionUploadDTO;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class TransactionValidationService {
    
    private static final Set<String> VALID_TYPES = new HashSet<>(Arrays.asList(
        "WIRE_TRANSFER", "ACH", "CARD", "CHECK", "CASH", "CRYPTO"
    ));
    
    private static final Set<String> VALID_CURRENCIES = new HashSet<>(Arrays.asList(
        "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY"
    ));
    
    public List<String> validate(TransactionUploadDTO dto) {
        List<String> errors = new ArrayList<>();
        
        if (dto.transactionId == null || dto.transactionId.isBlank()) {
            errors.add("Transaction ID is required");
        }
        
        if (dto.entityId == null || dto.entityId.isBlank()) {
            errors.add("Entity ID is required");
        }
        
        if (dto.type == null || dto.type.isBlank()) {
            errors.add("Transaction type is required");
        } else if (!VALID_TYPES.contains(dto.type)) {
            errors.add("Invalid transaction type: " + dto.type);
        }
        
        if (dto.amount == null || dto.amount.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Amount must be greater than zero");
        }
        
        if (dto.currency == null || dto.currency.length() != 3) {
            errors.add("Currency must be a valid 3-letter code");
        } else if (!VALID_CURRENCIES.contains(dto.currency)) {
            errors.add("Unsupported currency: " + dto.currency);
        }
        
        if (dto.fromCountry != null && dto.fromCountry.length() != 2) {
            errors.add("From country must be a 2-letter code");
        }
        
        if (dto.toCountry != null && dto.toCountry.length() != 2) {
            errors.add("To country must be a 2-letter code");
        }
        
        return errors;
    }
}

// Made with Bob
