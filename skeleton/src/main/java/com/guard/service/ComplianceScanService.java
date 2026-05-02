package com.guard.service;

import com.guard.model.ComplianceEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;

import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class ComplianceScanService {

    @Inject
    Event<ComplianceEvent> complianceEventBus;

    public CompletionStage<Void> fireEvent(ComplianceEvent event) {
        // TODO: complianceEventBus.fireAsync(event)
        return null;
    }
}
