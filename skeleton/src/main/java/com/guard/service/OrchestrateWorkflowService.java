package com.guard.service;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class OrchestrateWorkflowService {

    public void triggerWorkflow(Object payload) {
        // TODO: authenticate with watsonx Orchestrate
        // TODO: POST payload to workflow endpoint
        // TODO: log workflow reference ID
    }
}
