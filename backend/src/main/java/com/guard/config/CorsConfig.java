package com.guard.config;

import io.vertx.core.http.HttpServerRequest;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.io.IOException;

@Provider
public class CorsConfig implements ContainerResponseFilter {

    private static final Logger LOG = Logger.getLogger(CorsConfig.class);

    @Context
    HttpServerRequest request;

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        
        String origin = requestContext.getHeaderString("Origin");
        
        LOG.infof("CORS Filter - Origin: %s, Method: %s, Path: %s", 
                  origin, requestContext.getMethod(), requestContext.getUriInfo().getPath());
        
        // Set CORS headers for all responses
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        responseContext.getHeaders().add("Access-Control-Allow-Headers", 
            "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        responseContext.getHeaders().add("Access-Control-Max-Age", "3600");
        
        LOG.infof("CORS headers added to response");
    }
}

// Made with Bob
