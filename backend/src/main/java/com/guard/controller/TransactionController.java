package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.BatchIngestionResult;
import com.guard.dto.PaginatedResponse;
import com.guard.dto.TransactionUploadDTO;
import com.guard.entity.TransactionEntity;
import com.guard.repository.TransactionRepository;
import com.guard.service.BatchTransactionIngestionService;
import com.guard.service.TransactionFileParser;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.FileInputStream;
import java.util.List;
import java.util.UUID;

@Path("/api/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransactionController {

    private static final Logger LOG = Logger.getLogger(TransactionController.class);

    @Inject
    TransactionRepository transactionRepository;
    
    @Inject
    TransactionFileParser fileParser;
    
    @Inject
    BatchTransactionIngestionService batchIngestionService;

    @GET
    public ApiResponse<PaginatedResponse<TransactionEntity>> getTransactions(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize,
            @QueryParam("search") String search,
            @QueryParam("status") String status,
            @QueryParam("riskLevel") String riskLevel) {
        
        Page pageRequest = Page.of(page, pageSize);
        List<TransactionEntity> transactions;
        long total;

        if (search != null && !search.isEmpty()) {
            transactions = transactionRepository.searchTransactions(search, pageRequest);
            total = transactionRepository.count("entityId like ?1 or fromAccount like ?1 or toAccount like ?1", 
                                                "%" + search + "%");
        } else if (status != null && !status.isEmpty()) {
            transactions = transactionRepository.findByStatus(status, pageRequest);
            total = transactionRepository.countByStatus(status);
        } else if (riskLevel != null && !riskLevel.isEmpty()) {
            transactions = transactionRepository.findByRiskLevel(riskLevel, pageRequest);
            total = transactionRepository.countByRiskLevel(riskLevel);
        } else {
            transactions = transactionRepository.findAll().page(pageRequest).list();
            total = transactionRepository.count();
        }

        PaginatedResponse<TransactionEntity> response = 
            new PaginatedResponse<>(transactions, total, page, pageSize);
        
        return ApiResponse.success(response);
    }

    @GET
    @Path("/{id}")
    public ApiResponse<TransactionEntity> getTransaction(@PathParam("id") String id) {
        TransactionEntity transaction = transactionRepository.findById(id);
        if (transaction == null) {
            return ApiResponse.error("Transaction not found");
        }
        return ApiResponse.success(transaction);
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public ApiResponse<BatchIngestionResult> uploadTransactions(
            @FormParam("file") FileUpload file) {
        
        try {
            if (file == null) {
                return ApiResponse.error("No file provided");
            }
            
            String fileName = file.fileName();
            LOG.infof("Processing upload: %s", fileName);
            
            // Generate batch ID
            String batchId = UUID.randomUUID().toString();
            
            // Parse file based on extension
            List<TransactionUploadDTO> transactions;
            try (FileInputStream fis = new FileInputStream(file.uploadedFile().toFile())) {
                if (fileName.endsWith(".csv")) {
                    transactions = fileParser.parseCSV(fis);
                } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
                    transactions = fileParser.parseExcel(fis);
                } else {
                    return ApiResponse.error("Unsupported file format. Please upload CSV or Excel files.");
                }
            }
            
            LOG.infof("Parsed %d records from file", transactions.size());
            
            // Ingest batch
            BatchIngestionResult result = batchIngestionService.ingestBatch(transactions, batchId);
            
            return ApiResponse.success(result,
                String.format("Processed %d records: %d successful, %d failed",
                    result.totalRecords, result.successfulRecords, result.failedRecords));
            
        } catch (Exception e) {
            LOG.errorf(e, "Failed to upload transactions");
            return ApiResponse.error("Upload failed: " + e.getMessage());
        }
    }
}

// Made with Bob
