# Database Setup Guide

## Issue: Docker Desktop Not Running

The error you encountered indicates Docker Desktop is not running on your Windows machine.

## Solutions (Choose One)

### Option 1: Start Docker Desktop (Recommended)
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray should be steady)
3. Run the command again:
```bash
docker-compose up -d
```

### Option 2: Use H2 In-Memory Database (Quick Development)
If you want to skip Docker setup for now, use H2 database instead:

1. **Update `pom.xml`** - Add H2 dependency:
```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-jdbc-h2</artifactId>
</dependency>
```

2. **Update `application.properties`**:
```properties
# Comment out PostgreSQL config
#quarkus.datasource.db-kind=postgresql
#quarkus.datasource.username=complianceguard
#quarkus.datasource.password=complianceguard123
#quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/complianceguard

# Add H2 config
quarkus.datasource.db-kind=h2
quarkus.datasource.jdbc.url=jdbc:h2:mem:complianceguard;DB_CLOSE_DELAY=-1
quarkus.hibernate-orm.database.generation=drop-and-create
quarkus.hibernate-orm.log.sql=true
```

3. Start backend directly:
```bash
cd backend
mvn quarkus:dev
```

### Option 3: Install PostgreSQL Locally (Without Docker)

1. **Download PostgreSQL 15** from: https://www.postgresql.org/download/windows/

2. **Install with these settings:**
   - Port: 5432
   - Username: postgres
   - Password: (choose your own)

3. **Create database:**
```sql
CREATE DATABASE complianceguard;
CREATE USER complianceguard WITH PASSWORD 'complianceguard123';
GRANT ALL PRIVILEGES ON DATABASE complianceguard TO complianceguard;
```

4. **Update `application.properties`** (if needed):
```properties
quarkus.datasource.username=complianceguard
quarkus.datasource.password=complianceguard123
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/complianceguard
```

## Verify Database Connection

After choosing one option, test the connection:

### For Docker/PostgreSQL:
```bash
# Test PostgreSQL connection
psql -h localhost -U complianceguard -d complianceguard
# Password: complianceguard123
```

### For H2:
```bash
# H2 console will be available at:
# http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:complianceguard
```

## Start the Backend

Once database is ready:

```bash
cd ComplianceGuardian/backend
mvn quarkus:dev
```

You should see:
```
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
INFO  [io.quarkus] (Quarkus Main Thread) complianceguard 1.0.0-SNAPSHOT on JVM started in 3.456s. Listening on: http://localhost:8080
```

## Test Backend Endpoints

```bash
# Health check
curl http://localhost:8080/api/health

# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@test.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "admin"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Get metrics
curl http://localhost:8080/api/metrics
```

## Recommended: Use H2 for Development

For quick development and testing, **Option 2 (H2)** is the fastest:
- No Docker required
- No PostgreSQL installation
- Automatic schema creation
- Built-in web console
- Perfect for development

Switch to PostgreSQL later for production deployment.

## Next Steps

After database is running:
1. ✅ Start backend: `cd backend && mvn quarkus:dev`
2. ✅ Start frontend: `cd frontend && npm run dev`
3. ✅ Open browser: http://localhost:3000
4. ✅ Login and test the application

## Troubleshooting

### "Port 5432 already in use"
Another PostgreSQL instance is running. Either:
- Stop the other instance
- Change port in docker-compose.yml and application.properties

### "Connection refused"
- Check if database is running: `docker ps` or `pg_isready`
- Verify credentials in application.properties
- Check firewall settings

### "Schema not found"
Quarkus will auto-create tables on first run if:
```properties
quarkus.hibernate-orm.database.generation=drop-and-create
```
is set in application.properties (already configured).