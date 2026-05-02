package com.guard.metrics;

import com.guard.model.ScanResult;
import com.guard.model.Violation;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MetricsService {

    @Inject
    MeterRegistry meterRegistry;

    public void recordScan(ScanResult result) {
        // TODO: increment compliance.scans.total
        // TODO: stop scan duration timer
        // TODO: if HIGH risk, increment compliance.risk.high.total
    }

    public void recordViolation(Violation violation, String eventType) {
        // TODO: increment compliance.violations.total tagged by eventType
        // TODO: increment compliance.violations.by_type tagged by violation.type
    }

    public Timer.Sample startScanTimer() {
        // TODO: return Timer.start(meterRegistry)
        return null;
    }
}
