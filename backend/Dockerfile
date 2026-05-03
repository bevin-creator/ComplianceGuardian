# Multi-stage build for minimal image size
# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and pom.xml first for better layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN ./mvnw clean package -DskipTests -Dquarkus.package.jar.type=uber-jar

# Stage 2: Create minimal runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 quarkus && \
    adduser -u 1001 -G quarkus -s /bin/sh -D quarkus

WORKDIR /app

# Copy the uber jar from builder
COPY --from=builder /build/target/*-runner.jar /app/app.jar
COPY --from=builder /build/src/main/resources/publicKey.pem /app/publicKey.pem

# Set ownership
RUN chown -R quarkus:quarkus /app

# Switch to non-root user
USER quarkus

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/q/health/live || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# Made with Bob
