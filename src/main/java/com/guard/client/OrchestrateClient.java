package com.guard.client;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

/**
 * REST client for IBM watsonx Orchestrate API.
 * Triggers compliance breach workflows for HIGH risk events.
 */
@RegisterRestClient(configKey = "orchestrate")
@Path("/api/v1")
public interface OrchestrateClient {
    
    /**
     * Triggers a compliance breach workflow.
     * 
     * @param authToken Bearer token for authentication
     * @param requestId Unique request ID for traceability
     * @param payload Workflow input data
     * @return Workflow execution response
     */
    @POST
    @Path("/workflows/compliance-breach/trigger")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    OrchestrateResponse triggerWorkflow(
        @HeaderParam("Authorization") String authToken,
        @HeaderParam("X-Request-ID") String requestId,
        WorkflowPayload payload
    );
}
