package com.guard.config;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;

/**
 * CORS (Cross-Origin Resource Sharing) configuration for frontend integration.
 * 
 * Allows the React frontend (running on port 3000) to communicate with the
 * Quarkus backend (running on port 8081).
 * 
 * SECURITY NOTES:
 * - In production, replace "*" with specific allowed origins
 * - Consider using quarkus.http.cors.* properties in application.properties
 * - This filter applies to all endpoints
 */
@Provider
@RegisterForReflection
public class CorsConfig implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, 
                      ContainerResponseContext responseContext) throws IOException {
        
        // Allow requests from frontend development server
        // In production, replace with actual frontend domain
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
        
        // Allow common HTTP methods
        responseContext.getHeaders().add("Access-Control-Allow-Methods", 
            "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        
        // Allow common headers including Authorization for JWT tokens
        responseContext.getHeaders().add("Access-Control-Allow-Headers", 
            "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        
        // Allow credentials (cookies, authorization headers)
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
        
        // Cache preflight requests for 1 hour
        responseContext.getHeaders().add("Access-Control-Max-Age", "3600");
    }
}

// Made with Bob
