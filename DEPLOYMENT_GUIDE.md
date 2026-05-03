# Compliance Guard - Deployment Guide

## Overview
This guide covers deploying Compliance Guard to OpenShift with optimized containers for minimal overhead.

## Architecture
- **Frontend**: React + Vite served by Nginx (Alpine-based, ~50MB)
- **Backend**: Quarkus JVM (Alpine-based, ~200MB)
- **Database**: PostgreSQL 16 (Alpine-based)

## Prerequisites
- Docker or Podman
- OpenShift CLI (`oc`)
- Access to OpenShift cluster
- Container registry access (Docker Hub, Quay.io, or OpenShift internal registry)

---

## Local Development with Docker Compose

### 1. Build and Run Locally
```bash
cd ComplianceGuardian

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Backend Health**: http://localhost:8080/q/health
- **Backend Metrics**: http://localhost:8080/q/metrics
- **PostgreSQL**: localhost:5432

### 3. Database Connection
```
Host: localhost
Port: 5432
Database: compliancedb
Username: complianceuser
Password: compliancepass
```

---

## OpenShift Deployment

### Step 1: Build Container Images

#### Option A: Build Locally and Push to Registry
```bash
# Login to your container registry
docker login quay.io  # or docker.io

# Build backend
cd backend
docker build -t quay.io/your-org/compliance-guard-backend:latest .
docker push quay.io/your-org/compliance-guard-backend:latest

# Build frontend
cd ../frontend
docker build -t quay.io/your-org/compliance-guard-frontend:latest .
docker push quay.io/your-org/compliance-guard-frontend:latest
```

#### Option B: Build on OpenShift (Recommended)
```bash
# Login to OpenShift
oc login --token=<your-token> --server=<your-server>

# Create project
oc new-project compliance-guard

# Create BuildConfigs
oc new-build --name=backend \
  --binary \
  --strategy=docker \
  --to=backend:latest

oc new-build --name=frontend \
  --binary \
  --strategy=docker \
  --to=frontend:latest

# Start builds
cd backend
oc start-build backend --from-dir=. --follow

cd ../frontend
oc start-build frontend --from-dir=. --follow
```

### Step 2: Update Deployment Manifest
Edit `openshift/deployment.yaml` and update image references:

```yaml
# For backend deployment
image: image-registry.openshift-image-registry.svc:5000/compliance-guard/backend:latest

# For frontend deployment
image: image-registry.openshift-image-registry.svc:5000/compliance-guard/frontend:latest
```

### Step 3: Deploy to OpenShift
```bash
# Apply all manifests
oc apply -f openshift/deployment.yaml

# Verify deployments
oc get pods -n compliance-guard
oc get services -n compliance-guard
oc get routes -n compliance-guard

# Check pod status
oc describe pod <pod-name> -n compliance-guard

# View logs
oc logs -f deployment/backend -n compliance-guard
oc logs -f deployment/frontend -n compliance-guard
oc logs -f deployment/postgres -n compliance-guard
```

### Step 4: Access the Application
```bash
# Get the route URL
oc get route compliance-guard -n compliance-guard -o jsonpath='{.spec.host}'

# Access the application
# https://<route-url>
```

---

## Configuration

### Environment Variables

#### Backend (application.properties or environment)
```properties
# Database
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://postgres:5432/compliancedb
QUARKUS_DATASOURCE_USERNAME=complianceuser
QUARKUS_DATASOURCE_PASSWORD=<secure-password>

# HTTP
QUARKUS_HTTP_PORT=8080
QUARKUS_HTTP_CORS=true
QUARKUS_HTTP_CORS_ORIGINS=https://your-frontend-url

# Logging
QUARKUS_LOG_LEVEL=INFO
```

#### Frontend (Nginx proxy configuration)
The frontend Dockerfile includes an nginx configuration that proxies `/api/*` requests to the backend service.

### Secrets Management

#### Update PostgreSQL Password
```bash
# Create or update secret
oc create secret generic postgres-secret \
  --from-literal=POSTGRES_DB=compliancedb \
  --from-literal=POSTGRES_USER=complianceuser \
  --from-literal=POSTGRES_PASSWORD=<your-secure-password> \
  --dry-run=client -o yaml | oc apply -f -

# Restart deployments to pick up new secret
oc rollout restart deployment/postgres -n compliance-guard
oc rollout restart deployment/backend -n compliance-guard
```

---

## Scaling

### Manual Scaling
```bash
# Scale backend
oc scale deployment/backend --replicas=3 -n compliance-guard

# Scale frontend
oc scale deployment/frontend --replicas=3 -n compliance-guard
```

### Horizontal Pod Autoscaler (HPA)
```bash
# Create HPA for backend
oc autoscale deployment/backend \
  --min=2 \
  --max=10 \
  --cpu-percent=70 \
  -n compliance-guard

# Create HPA for frontend
oc autoscale deployment/frontend \
  --min=2 \
  --max=5 \
  --cpu-percent=80 \
  -n compliance-guard
```

---

## Monitoring

### Health Checks
```bash
# Backend health
curl https://<backend-route>/q/health/live
curl https://<backend-route>/q/health/ready

# Frontend health
curl https://<frontend-route>/
```

### Metrics
```bash
# Backend metrics (Prometheus format)
curl https://<backend-route>/q/metrics
```

### Logs
```bash
# Stream logs
oc logs -f deployment/backend -n compliance-guard
oc logs -f deployment/frontend -n compliance-guard

# Get recent logs
oc logs --tail=100 deployment/backend -n compliance-guard
```

---

## Troubleshooting

### Pod Not Starting
```bash
# Check pod events
oc describe pod <pod-name> -n compliance-guard

# Check logs
oc logs <pod-name> -n compliance-guard

# Check resource limits
oc get pod <pod-name> -n compliance-guard -o yaml | grep -A 10 resources
```

### Database Connection Issues
```bash
# Test database connectivity from backend pod
oc exec -it deployment/backend -n compliance-guard -- \
  curl postgres:5432

# Check database logs
oc logs deployment/postgres -n compliance-guard
```

### Image Pull Errors
```bash
# Check image pull secrets
oc get secrets -n compliance-guard

# Verify image exists
oc get imagestream -n compliance-guard
```

---

## Backup and Restore

### Database Backup
```bash
# Create backup
oc exec deployment/postgres -n compliance-guard -- \
  pg_dump -U complianceuser compliancedb > backup.sql

# Restore backup
cat backup.sql | oc exec -i deployment/postgres -n compliance-guard -- \
  psql -U complianceuser compliancedb
```

---

## Performance Optimization

### Resource Limits
Current configuration:
- **Backend**: 512Mi-1Gi RAM, 500m-1000m CPU
- **Frontend**: 128Mi-256Mi RAM, 100m-200m CPU
- **PostgreSQL**: 256Mi-512Mi RAM, 250m-500m CPU

Adjust based on your workload in `openshift/deployment.yaml`.

### Image Optimization
- Multi-stage builds reduce image size
- Alpine Linux base images (~5MB base)
- Non-root users for security
- Health checks for reliability

---

## Security Best Practices

1. **Change default passwords** in production
2. **Use TLS/SSL** for all communications (enabled by default in OpenShift routes)
3. **Implement RBAC** for OpenShift resources
4. **Regular security updates** for base images
5. **Scan images** for vulnerabilities
6. **Use secrets** for sensitive data
7. **Enable network policies** to restrict pod communication

---

## CI/CD Integration

### Example GitHub Actions Workflow
```yaml
name: Deploy to OpenShift

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to OpenShift
        run: |
          oc login --token=${{ secrets.OPENSHIFT_TOKEN }} \
            --server=${{ secrets.OPENSHIFT_SERVER }}
      
      - name: Build and Deploy Backend
        run: |
          cd backend
          oc start-build backend --from-dir=. --follow
      
      - name: Build and Deploy Frontend
        run: |
          cd frontend
          oc start-build frontend --from-dir=. --follow
      
      - name: Verify Deployment
        run: |
          oc rollout status deployment/backend -n compliance-guard
          oc rollout status deployment/frontend -n compliance-guard
```

---

## Support

For issues or questions:
1. Check logs: `oc logs -f deployment/<service> -n compliance-guard`
2. Review pod events: `oc describe pod <pod-name> -n compliance-guard`
3. Check resource usage: `oc top pods -n compliance-guard`
4. Verify network connectivity between services

---

## Quick Reference

```bash
# Deploy everything
oc apply -f openshift/deployment.yaml

# Check status
oc get all -n compliance-guard

# Get route URL
oc get route compliance-guard -n compliance-guard

# Scale services
oc scale deployment/backend --replicas=3 -n compliance-guard

# Update image
oc set image deployment/backend backend=new-image:tag -n compliance-guard

# Rollback deployment
oc rollout undo deployment/backend -n compliance-guard

# Delete everything
oc delete namespace compliance-guard