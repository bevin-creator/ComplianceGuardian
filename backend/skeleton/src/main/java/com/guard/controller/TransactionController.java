package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.dto.PaginatedResponse;
import com.guard.entity.TransactionEntity;
import com.guard.repository.TransactionRepository;
import io.quarkus.panache.common.Page;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransactionController {

    @Inject
    TransactionRepository transactionRepository;

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
    public ApiResponse<UploadResult> uploadTransactions() {
        // TODO: Implement bulk transaction upload from CSV/Excel
        // For now, return mock response
        UploadResult result = new UploadResult();
        result.processed = 0;
        return ApiResponse.success(result, "Upload endpoint not yet implemented");
    }

    public static class UploadResult {
        public int processed;
    }
}

// Made with Bob
