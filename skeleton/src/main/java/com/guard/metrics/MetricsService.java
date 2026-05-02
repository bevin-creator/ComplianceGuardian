package com.guard.metrics;

import com.guard.model.ScanResult;
import com.guard.model.Violation;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Production-grade metrics service for compliance scanning.
 *
 * DESIGN PRINCIPLES:
 * - Caches all metric objects to avoid recreation overhead
 * - Prometheus-compatible naming: compliance.<domain>.<metric>
 * - Low cardinality tags to prevent metric explosion
 * - Thread-safe via ConcurrentHashMap for dynamic metrics
 * - IBM Instana compatible with structured logging
 * - No metric duplication - single source of truth per metric
 *
 * METRICS EXPOSED:
 * - compliance.scans.total (counter, tagged by risk_level)
 * - compliance.violations.total (counter, tagged by violation_type)
 * - compliance.scan.duration (timer with p50, p95, p99 percentiles)
 *
 * CARDINALITY ANALYSIS:
 * - compliance.scans.total: 3 time series (HIGH, MEDIUM, LOW)
 * - compliance.violations.total: 6 time series (6 violation types)
 * - compliance.scan.duration: 1 time series + percentile gauges
 * Total: ~10 time series (safe for Prometheus/Instana)
 */
@ApplicationScoped
public class MetricsService {

    private static final Logger LOG = Logger.getLogger(MetricsService.class);

    @Inject
    MeterRegistry meterRegistry;

    // Cached timer with percentile tracking for latency analysis
    private Timer scanDurationTimer;

    // Dynamic counters cached by tags (thread-safe, low cardinality)
    // Scans by risk level: bounded to 3 values (HIGH, MEDIUM, LOW)
    private final Map<String, Counter> scanCountersByRiskLevel = new ConcurrentHashMap<>();
    
    // Violations by type: bounded to 6 values (Violation.Type enum)
    private final Map<String, Counter> violationCountersByType = new ConcurrentHashMap<>();

    @PostConstruct
    void initializeMetrics() {
        // Initialize timer with percentile tracking for SLA monitoring
        // Percentiles (p50, p95, p99) are critical for Instana dashboards
        scanDurationTimer = Timer.builder("compliance.scan.duration")
                .description("Duration of compliance scan processing")
                .publishPercentiles(0.50, 0.95, 0.99) // p50, p95, p99
                .publishPercentileHistogram() // Histogram buckets for Prometheus
                .minimumExpectedValue(Duration.ofMillis(10))
                .maximumExpectedValue(Duration.ofSeconds(10))
                .register(meterRegistry);

        LOG.info("MetricsService initialized - metrics cached and ready for Prometheus/Instana");
    }

    /**
     * Records metrics for a completed compliance scan.
     * Pure metrics recording - no business logic.
     *
     * @param result The scan result containing violations and risk assessment
     */
    public void recordScan(ScanResult result) {
        // Increment scan counter with risk level tag (single source of truth)
        getScanCounterByRiskLevel(result.riskLevel).increment();

        // Record violations by type (one counter per violation type)
        for (Violation violation : result.violations) {
            getViolationCounter(violation.type.toString()).increment();
        }

        // Structured log with traceId for Instana correlation
        LOG.debugf("Metrics recorded: traceId=%s, riskLevel=%s, violations=%d",
                   result.traceId, result.riskLevel, result.violations.size());
    }

    /**
     * Records the duration of a compliance scan.
     * Pure metrics recording - SLA evaluation should be done in monitoring layer.
     *
     * @param sample The timer sample started with startScanTimer()
     * @param result The scan result for structured logging context
     */
    public void recordScanDuration(Timer.Sample sample, ScanResult result) {
        // Stop timer and record duration (percentiles auto-calculated)
        long durationNanos = sample.stop(scanDurationTimer);
        
        // Structured log with traceId for Instana trace correlation
        LOG.debugf("Scan duration recorded: traceId=%s, duration=%dms, riskLevel=%s",
                   result.traceId, Duration.ofNanos(durationNanos).toMillis(), result.riskLevel);
    }

    /**
     * Starts a timer for measuring scan duration.
     *
     * @return Timer sample to be stopped with recordScanDuration()
     */
    public Timer.Sample startScanTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Gets or creates a cached scan counter for the given risk level.
     * Thread-safe via ConcurrentHashMap.
     * Low cardinality: bounded to 3 values (HIGH, MEDIUM, LOW)
     */
    private Counter getScanCounterByRiskLevel(String riskLevel) {
        return scanCountersByRiskLevel.computeIfAbsent(riskLevel, k ->
                Counter.builder("compliance.scans.total")
                        .description("Total compliance scans grouped by risk level")
                        .tag("risk_level", riskLevel)
                        .register(meterRegistry)
        );
    }

    /**
     * Gets or creates a cached violation counter for the given type.
     * Thread-safe via ConcurrentHashMap.
     * Low cardinality: bounded by Violation.Type enum (6 values)
     */
    private Counter getViolationCounter(String violationType) {
        return violationCountersByType.computeIfAbsent(violationType, k ->
                Counter.builder("compliance.violations.total")
                        .description("Total compliance violations grouped by type")
                        .tag("violation_type", violationType)
                        .register(meterRegistry)
        );
    }
}
