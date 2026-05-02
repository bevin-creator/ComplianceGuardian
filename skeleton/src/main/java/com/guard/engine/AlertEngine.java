package com.guard.engine;

import com.guard.model.ScanResult;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AlertEngine {

    public void processResult(ScanResult result) {
        // TODO: route by result.riskLevel → HIGH / MEDIUM / LOW
    }

    private void triggerHighRiskAlert(ScanResult result) {
        // TODO: webhook + case management notification
    }

    private void triggerMediumRiskAlert(ScanResult result) {
        // TODO: structured warning log + review queue
    }
}
