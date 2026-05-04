package com.guard.client;

/**
 * Violation detail for workflow context.
 */
public record ViolationDetail(
    String type,
    String description,
    String severity
) {}

// Made with Bob
