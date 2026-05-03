package com.guard.service;

import com.guard.model.ComplianceEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class ComplianceScanService {

    private static final Logger LOG = Logger.getLogger(ComplianceScanService.class);

    @Inject
    Event<ComplianceEvent> complianceEventBus;

    /**
     * Fires a compliance event asynchronously to the CDI event bus.
     * The event will be processed by ScanAgent via @ObservesAsync.
     *
     * @param event The compliance event to process
     * @return CompletionStage that completes when event is fired (not when processed)
     */
    public CompletionStage<ComplianceEvent> fireEvent(ComplianceEvent event) {
        LOG.debugf("Firing async compliance event: eventId=%s, traceId=%s, type=%s",
                   event.eventId, event.traceId, event.eventType);
        
        return complianceEventBus.fireAsync(event);
    }
}
