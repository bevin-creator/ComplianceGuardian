package com.guard.filter;

import io.vertx.core.http.HttpServerRequest;
import org.jboss.logging.Logger;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * HTTP Request/Response Logging Filter
 * Logs all incoming requests and outgoing responses with detailed information
 */
@Provider
public class RequestLoggingFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final Logger LOG = Logger.getLogger(RequestLoggingFilter.class);
    private static final String REQUEST_START_TIME = "REQUEST_START_TIME";

    @Context
    UriInfo uriInfo;

    @Context
    HttpServerRequest request;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Store request start time for response time calculation
        requestContext.setProperty(REQUEST_START_TIME, System.currentTimeMillis());

        String method = requestContext.getMethod();
        String path = requestContext.getUriInfo().getPath();
        String clientIp = getClientIp();

        // Log incoming request
        LOG.infof("📥 INCOMING REQUEST | %s %s | Client: %s", method, path, clientIp);
        
        // Log headers in debug mode
        if (LOG.isDebugEnabled()) {
            LOG.debugf("   Headers: %s", requestContext.getHeaders());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        Long startTime = (Long) requestContext.getProperty(REQUEST_START_TIME);
        long duration = startTime != null ? System.currentTimeMillis() - startTime : 0;

        String method = requestContext.getMethod();
        String path = requestContext.getUriInfo().getPath();
        int status = responseContext.getStatus();
        String statusEmoji = getStatusEmoji(status);

        // Log response with color-coded status
        LOG.infof("📤 RESPONSE | %s %s | Status: %s %d | Duration: %dms", 
                  method, path, statusEmoji, status, duration);

        // Log response body in debug mode (for errors)
        if (LOG.isDebugEnabled() && status >= 400) {
            LOG.debugf("   Response Body: %s", responseContext.getEntity());
        }
    }

    private String getClientIp() {
        if (request != null) {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            if (forwardedFor != null && !forwardedFor.isEmpty()) {
                return forwardedFor.split(",")[0].trim();
            }
            return request.remoteAddress().host();
        }
        return "unknown";
    }

    private String getStatusEmoji(int status) {
        if (status >= 200 && status < 300) {
            return "✅"; // Success
        } else if (status >= 300 && status < 400) {
            return "↪️"; // Redirect
        } else if (status >= 400 && status < 500) {
            return "⚠️"; // Client Error
        } else if (status >= 500) {
            return "❌"; // Server Error
        }
        return "ℹ️"; // Info
    }
}

// Made with Bob