package com.guard.controller;

import com.guard.model.ComplianceEvent;
import com.guard.model.Contract;
import com.guard.model.Transaction;
import com.guard.service.ComplianceScanService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.Map;

/**
 * REST API for ingesting compliance events.
 * All endpoints return 202 Accepted for non-blocking async processing.
 */
@Path("/ingest")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IngestorResource {

    private static final Logger LOG = Logger.getLogger(IngestorResource.class);

    @Inject
    ComplianceScanService scanService;

    @POST
    @Path("/transaction")
    public Response ingestTransaction(Transaction transaction) {
        // Validate required fields
        if (transaction == null || transaction.transactionId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Transaction ID is required"))
                    .build();
        }

        // Normalize to ComplianceEvent
        ComplianceEvent event = normalize(transaction, ComplianceEvent.EventType.TRANSACTION, transaction.transactionId);
        
        // Fire async event (non-blocking)
        scanService.fireEvent(event);
        
        LOG.infof("Transaction ingested: transactionId=%s, traceId=%s", transaction.transactionId, event.traceId);
        
        // Return 202 Accepted immediately
        return Response.status(Response.Status.ACCEPTED)
                .entity(Map.of(
                    "status", "accepted",
                    "traceId", event.traceId,
                    "eventId", event.eventId
                ))
                .build();
    }

    @POST
    @Path("/contract")
    public Response ingestContract(Contract contract) {
        // Validate required fields
        if (contract == null || contract.contractId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Contract ID is required"))
                    .build();
        }

        // Normalize to ComplianceEvent
        ComplianceEvent event = normalize(contract, ComplianceEvent.EventType.CONTRACT, contract.contractId);
        
        // Fire async event (non-blocking)
        scanService.fireEvent(event);
        
        LOG.infof("Contract ingested: contractId=%s, traceId=%s", contract.contractId, event.traceId);
        
        // Return 202 Accepted immediately
        return Response.status(Response.Status.ACCEPTED)
                .entity(Map.of(
                    "status", "accepted",
                    "traceId", event.traceId,
                    "eventId", event.eventId
                ))
                .build();
    }

    @POST
    @Path("/kyc")
    public Response ingestKyc(Map<String, Object> kycPayload) {
        // Validate payload
        if (kycPayload == null || kycPayload.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "KYC payload is required"))
                    .build();
        }

        String customerId = (String) kycPayload.getOrDefault("customerId", "unknown");
        
        // Normalize to ComplianceEvent
        ComplianceEvent event = normalize(kycPayload, ComplianceEvent.EventType.KYC, customerId);
        
        // Fire async event (non-blocking)
        scanService.fireEvent(event);
        
        LOG.infof("KYC record ingested: customerId=%s, traceId=%s", customerId, event.traceId);
        
        // Return 202 Accepted immediately
        return Response.status(Response.Status.ACCEPTED)
                .entity(Map.of(
                    "status", "accepted",
                    "traceId", event.traceId,
                    "eventId", event.eventId
                ))
                .build();
    }

    @POST
    @Path("/report")
    public Response ingestReport(Map<String, Object> reportPayload) {
        // Validate payload
        if (reportPayload == null || reportPayload.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Report payload is required"))
                    .build();
        }

        String reportId = (String) reportPayload.getOrDefault("reportId", "unknown");
        
        // Normalize to ComplianceEvent
        ComplianceEvent event = normalize(reportPayload, ComplianceEvent.EventType.REPORT, reportId);
        
        // Fire async event (non-blocking)
        scanService.fireEvent(event);
        
        LOG.infof("Report ingested: reportId=%s, traceId=%s", reportId, event.traceId);
        
        // Return 202 Accepted immediately
        return Response.status(Response.Status.ACCEPTED)
                .entity(Map.of(
                    "status", "accepted",
                    "traceId", event.traceId,
                    "eventId", event.eventId
                ))
                .build();
    }

    /**
     * Normalizes any payload into a ComplianceEvent with generated traceId and eventId.
     */
    private ComplianceEvent normalize(Object payload, ComplianceEvent.EventType eventType, String sourceId) {
        return new ComplianceEvent(eventType, sourceId, payload);
    }
}
