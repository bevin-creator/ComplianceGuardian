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

@Path("/ingest")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IngestorResource {

    @Inject
    ComplianceScanService scanService;

    @POST
    @Path("/transaction")
    public Response ingestTransaction(Transaction transaction) {
        // TODO: validate, normalize, scanService.fireEvent(event), return 202
        return null;
    }

    @POST
    @Path("/contract")
    public Response ingestContract(Contract contract) {
        // TODO: validate, normalize, scanService.fireEvent(event), return 202
        return null;
    }

    @POST
    @Path("/kyc")
    public Response ingestKyc(Object kycPayload) {
        // TODO: define KYC model, validate, normalize, fire event, return 202
        return null;
    }

    @POST
    @Path("/report")
    public Response ingestReport(Object reportPayload) {
        // TODO: define Report model, validate, normalize, fire event, return 202
        return null;
    }

    private ComplianceEvent normalize(Object payload, ComplianceEvent.EventType eventType) {
        // TODO: create ComplianceEvent with traceId, eventId, receivedAt, payload
        return null;
    }
}
