package com.guard.service;

import com.guard.dto.BatchIngestionResult;
import com.guard.dto.TransactionUploadDTO;
import com.guard.entity.TransactionEntity;
import com.guard.model.ComplianceEvent;
import com.guard.model.Transaction;
import com.guard.repository.TransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BatchTransactionIngestionService {
    
    private static final Logger LOG = Logger.getLogger(BatchTransactionIngestionService.class);
    
    @Inject
    TransactionRepository transactionRepository;
    
    @Inject
    TransactionValidationService validationService;
    
    @Inject
    ComplianceScanService scanService;
    
    @Transactional
    public BatchIngestionResult ingestBatch(List<TransactionUploadDTO> uploadedTransactions, String batchId) {
        BatchIngestionResult result = new BatchIngestionResult(batchId);
        result.totalRecords = uploadedTransactions.size();
        
        for (TransactionUploadDTO dto : uploadedTransactions) {
            try {
                // Check for parse errors
                if (dto.validationError != null) {
                    result.failedRecords++;
                    result.errors.add(String.format("Row %d: %s", dto.rowNumber, dto.validationError));
                    continue;
                }
                
                // Validate
                List<String> errors = validationService.validate(dto);
                if (!errors.isEmpty()) {
                    result.failedRecords++;
                    result.errors.add(String.format("Row %d: %s", dto.rowNumber, String.join(", ", errors)));
                    continue;
                }
                
                // Normalize to TransactionEntity
                TransactionEntity entity = normalizeToEntity(dto, batchId);
                
                // Persist
                transactionRepository.persist(entity);
                
                // Fire compliance event for async processing
                Transaction transaction = normalizeToTransaction(dto);
                ComplianceEvent event = new ComplianceEvent(
                    ComplianceEvent.EventType.TRANSACTION,
                    dto.transactionId,
                    transaction
                );
                scanService.fireEvent(event);
                
                result.successfulRecords++;
                
            } catch (Exception e) {
                result.failedRecords++;
                result.errors.add(String.format("Row %d: %s", dto.rowNumber, e.getMessage()));
                LOG.errorf(e, "Failed to ingest transaction at row %d", dto.rowNumber);
            }
        }
        
        result.endTime = Instant.now();
        LOG.infof("Batch ingestion completed: batchId=%s, success=%d, failed=%d", 
                  batchId, result.successfulRecords, result.failedRecords);
        
        return result;
    }
    
    private TransactionEntity normalizeToEntity(TransactionUploadDTO dto, String batchId) {
        TransactionEntity entity = new TransactionEntity();
        entity.id = dto.transactionId != null ? dto.transactionId : UUID.randomUUID().toString();
        entity.entityId = dto.entityId;
        entity.type = dto.type;
        entity.amount = dto.amount;
        entity.currency = dto.currency;
        entity.fromAccount = dto.fromAccount;
        entity.toAccount = dto.toAccount;
        entity.fromCountry = dto.fromCountry;
        entity.toCountry = dto.toCountry;
        entity.status = "PENDING";
        entity.description = (dto.description != null ? dto.description : "") + " [Batch: " + batchId + "]";
        entity.createdAt = Instant.now();
        entity.updatedAt = Instant.now();
        return entity;
    }
    
    private Transaction normalizeToTransaction(TransactionUploadDTO dto) {
        Transaction transaction = new Transaction();
        transaction.transactionId = dto.transactionId;
        transaction.amount = dto.amount;
        transaction.currency = dto.currency;
        transaction.originCountry = dto.fromCountry;
        transaction.destinationCountry = dto.toCountry;
        transaction.customerId = dto.customerId;
        transaction.timestamp = dto.timestamp != null ? dto.timestamp : Instant.now();
        return transaction;
    }
}

// Made with Bob
