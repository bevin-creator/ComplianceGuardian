# ComplianceGuard Database Setup Guide

## Overview

This guide covers setting up PostgreSQL database for ComplianceGuard with real data persistence, JWT authentication, and enhanced features.

## Prerequisites

- PostgreSQL 14+ installed
- Java 17+ (for Quarkus)
- Maven 3.8+
- Node.js 18+ (for frontend)

## Quick Start

### 1. Install PostgreSQL

**Windows:**
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE complianceguard;
CREATE USER complianceguard WITH ENCRYPTED PASSWORD 'complianceguard';
GRANT ALL PRIVILEGES ON DATABASE complianceguard TO complianceguard;

# Exit psql
\q
```

### 3. Configure Application

The application is pre-configured with default database settings in `skeleton/src/main/resources/application.properties`:

```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=complianceguard
quarkus.datasource.password=complianceguard
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/complianceguard
```

**For custom configuration**, set environment variables:

```bash
# Windows PowerShell
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"
$env:DB_URL="jdbc:postgresql://localhost:5432/your_database"

# Linux/macOS
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export DB_URL=jdbc:postgresql://localhost:5432/your_database
```

### 4. Start the Application

```bash
cd skeleton
mvn quarkus:dev
```

Quarkus will automatically:
- Create database tables from entities
- Run `import.sql` to populate sample data
- Start the application on port 8081

## Database Schema

### Tables Created

#### users
Stores user accounts for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | Unique email address |
| password_hash | VARCHAR | PBKDF2 hashed password |
| name | VARCHAR | User's full name |
| role | VARCHAR | ADMIN, ANALYST, COMPLIANCE_OFFICER, EXECUTIVE |
| active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

#### alerts
Stores compliance alerts and violations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| transaction_id | VARCHAR | Related transaction ID |
| severity | VARCHAR | CRITICAL, HIGH, MEDIUM, LOW |
| type | VARCHAR | AML, KYC, BASEL, SANCTIONS |
| title | VARCHAR(500) | Alert title |
| description | VARCHAR(2000) | Alert description |
| timestamp | TIMESTAMP | Alert creation time |
| status | VARCHAR | OPEN, INVESTIGATING, RESOLVED |
| assigned_to | VARCHAR | Assigned user ID |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### cases
Stores compliance investigation cases.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| transaction_id | VARCHAR | Related transaction ID |
| title | VARCHAR(500) | Case title |
| severity | VARCHAR | CRITICAL, HIGH, MEDIUM, LOW |
| status | VARCHAR | OPEN, UNDER_REVIEW, ESCALATED, RESOLVED |
| assigned_to | VARCHAR | Assigned user ID |
| created_at | TIMESTAMP | Case creation time |
| updated_at | TIMESTAMP | Last update time |
| due_date | TIMESTAMP | Case due date |
| sar_status | VARCHAR | PENDING, FILED, NOT_REQUIRED |
| description | VARCHAR(2000) | Case description |

#### timeline_events
Stores case history and timeline.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| case_id | UUID | Foreign key to cases |
| type | VARCHAR | DETECTED, AI_REVIEWED, ASSIGNED, EDD_STARTED, SAR_FILED, CLOSED |
| description | VARCHAR(1000) | Event description |
| timestamp | TIMESTAMP | Event time |
| user | VARCHAR | User who triggered event |

### Indexes

Performance indexes are automatically created:
- `idx_alert_status` on alerts(status)
- `idx_alert_severity` on alerts(severity)
- `idx_alert_timestamp` on alerts(timestamp)
- `idx_case_status` on cases(status)
- `idx_case_severity` on cases(severity)
- `idx_case_assigned` on cases(assigned_to)

## Sample Data

The `import.sql` script creates:

### Demo Users

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@complianceguard.com | password | ADMIN | System administrator |
| analyst@complianceguard.com | password | ANALYST | Compliance analyst |
| officer@complianceguard.com | password | COMPLIANCE_OFFICER | Compliance officer |
| executive@complianceguard.com | password | EXECUTIVE | Executive viewer |

### Sample Alerts (5)
- Critical AML alert for high-value transaction
- High KYC alert requiring due diligence
- Medium Basel capital adequacy alert
- High sanctions violation alert
- Low AML unusual pattern alert

### Sample Cases (4)
- Critical AML investigation (under review)
- High KYC review for PEP (open)
- High suspicious activity with SAR filed (escalated)
- Medium Basel III review (resolved)

### Timeline Events (10)
Complete case history for all sample cases

## JWT Authentication

### Configuration

JWT is configured in `application.properties`:

```properties
mp.jwt.verify.publickey.location=META-INF/resources/publicKey.pem
mp.jwt.verify.issuer=compliance-guard
smallrye.jwt.sign.key.location=META-INF/resources/privateKey.pem
```

### Generate RSA Keys

For production, generate your own RSA key pair:

```bash
# Generate private key
openssl genrsa -out privateKey.pem 2048

# Generate public key
openssl rsa -in privateKey.pem -pubout -out publicKey.pem

# Copy to resources
cp privateKey.pem skeleton/src/main/resources/META-INF/resources/
cp publicKey.pem skeleton/src/main/resources/META-INF/resources/
```

### Password Hashing

Passwords are hashed using PBKDF2WithHmacSHA256:
- 10,000 iterations
- 256-bit key length
- Random 16-byte salt per password
- Base64 encoded output

### Login Flow

1. User submits email/password to `/api/auth/login`
2. `AuthService` verifies credentials
3. JWT token generated with 8-hour expiration
4. Token includes: userId, email, name, role
5. Frontend stores token in localStorage
6. Token sent in `Authorization: Bearer <token>` header

## API Endpoints with Database

### Authentication

```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@complianceguard.com","password":"password"}'

# Response includes JWT token
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "analyst@complianceguard.com",
    "name": "John Analyst",
    "role": "ANALYST",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints

All API endpoints require valid JWT token:

```bash
# Get alerts (requires authentication)
curl http://localhost:8081/api/alerts \
  -H "Authorization: Bearer <your-token>"
```

## Database Operations

### View Data

```sql
-- Connect to database
psql -U complianceguard -d complianceguard

-- View users
SELECT id, email, name, role, active FROM users;

-- View alerts
SELECT id, severity, type, title, status FROM alerts;

-- View cases
SELECT id, title, severity, status, assigned_to FROM cases;

-- View case timeline
SELECT c.title, te.type, te.description, te.timestamp 
FROM cases c 
JOIN timeline_events te ON c.id = te.case_id 
ORDER BY te.timestamp;
```

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE complianceguard;"
psql -U postgres -c "CREATE DATABASE complianceguard;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE complianceguard TO complianceguard;"

# Restart application to recreate schema and data
cd skeleton
mvn quarkus:dev
```

## Development vs Production

### Development Mode

Current configuration uses:
- `quarkus.hibernate-orm.database.generation=update` - Auto-update schema
- `quarkus.hibernate-orm.sql-load-script=import.sql` - Load sample data
- Local PostgreSQL database
- Simple passwords for demo users

### Production Configuration

For production, update `application.properties`:

```properties
# Use environment variables for sensitive data
quarkus.datasource.username=${DB_USERNAME}
quarkus.datasource.password=${DB_PASSWORD}
quarkus.datasource.jdbc.url=${DB_URL}

# Disable auto-schema generation
quarkus.hibernate-orm.database.generation=none

# Disable sample data loading
# quarkus.hibernate-orm.sql-load-script=import.sql

# Use Flyway or Liquibase for migrations
quarkus.flyway.migrate-at-start=true
```

## Troubleshooting

### Connection Refused

```
Error: Connection refused
```

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check port 5432 is not blocked
- Verify connection string in application.properties

### Authentication Failed

```
Error: FATAL: password authentication failed
```

**Solution:**
- Verify username/password in application.properties
- Check PostgreSQL pg_hba.conf for authentication method
- Ensure user has database privileges

### Schema Not Created

```
Error: relation "users" does not exist
```

**Solution:**
- Verify `quarkus.hibernate-orm.database.generation=update`
- Check application logs for schema creation errors
- Manually create tables if needed

### Sample Data Not Loaded

```
Error: No users found
```

**Solution:**
- Verify `import.sql` exists in `src/main/resources/`
- Check application logs for SQL errors
- Manually run import.sql if needed

## Next Steps

1. **Integrate with Frontend:**
   - Update ApiController to use database entities
   - Replace mock data with real queries
   - Test authentication flow

2. **Add More Features:**
   - Transaction entity and repository
   - Activity feed from audit logs
   - Real-time metrics from database

3. **Production Hardening:**
   - Use environment variables for secrets
   - Implement database migrations (Flyway/Liquibase)
   - Add connection pooling configuration
   - Set up database backups
   - Implement audit logging

4. **Performance Optimization:**
   - Add database indexes
   - Implement caching (Redis)
   - Use database connection pooling
   - Optimize queries with pagination

## Support

For issues:
- Check PostgreSQL logs: `/var/log/postgresql/`
- Check application logs in terminal
- Verify database connection: `psql -U complianceguard -d complianceguard`
- Review Quarkus documentation: https://quarkus.io/guides/

---

**Made with Bob**