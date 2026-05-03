package com.guard.exception;

import com.guard.dto.ApiResponse;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        // Handle WebApplicationException (JAX-RS exceptions)
        if (exception instanceof WebApplicationException) {
            WebApplicationException webEx = (WebApplicationException) exception;
            return Response
                    .status(webEx.getResponse().getStatus())
                    .entity(ApiResponse.error(exception.getMessage()))
                    .build();
        }

        // Handle validation exceptions
        if (exception instanceof IllegalArgumentException) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(ApiResponse.error(exception.getMessage()))
                    .build();
        }

        // Handle all other exceptions
        return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(ApiResponse.error("An unexpected error occurred: " + exception.getMessage()))
                .build();
    }
}

// Made with Bob
