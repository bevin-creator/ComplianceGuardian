# ComplianceGuard Installation Guide

## Prerequisites Installation

You need to install Java and Node.js to run ComplianceGuard.

### 1. Install Java (Required for Backend)

#### Option A: Using Chocolatey (Recommended for Windows)

```powershell
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java 17
choco install openjdk17 -y

# Verify installation
java -version
```

#### Option B: Manual Installation

1. Download Java 17 from: https://adoptium.net/temurin/releases/
2. Choose:
   - Version: 17 (LTS)
   - Operating System: Windows
   - Architecture: x64
   - Package Type: JDK
3. Run the installer
4. Verify installation:
   ```powershell
   java -version
   ```

### 2. Install Node.js (Required for Frontend)

#### Option A: Using Chocolatey

```powershell
choco install nodejs-lts -y

# Verify installation
node -version
npm -version
```

#### Option B: Manual Installation

1. Download from: https://nodejs.org/
2. Choose LTS version (18.x or higher)
3. Run the installer
4. Verify installation:
   ```powershell
   node -version
   npm -version
   ```

### 3. Install PostgreSQL (Optional - for database features)

#### Option A: Using Chocolatey

```powershell
choco install postgresql -y

# Start PostgreSQL service
net start postgresql-x64-14
```

#### Option B: Manual Installation

1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for postgres user
4. Verify installation:
   ```powershell
   psql --version
   ```

## Quick Start After Installation

### Step 1: Start Backend

```powershell
# Open terminal in project root
cd skeleton
..\mvnw.cmd quarkus:dev
```

Wait for: `Listening on: http://localhost:8081`

### Step 2: Start Frontend (New Terminal)

```powershell
# Open NEW terminal in project root
cd frontend
npm install
npm run dev
```

Wait for: `Local: http://localhost:3000/`

### Step 3: Open Browser

Navigate to: http://localhost:3000

Login with any email/password (mock authentication works without database)

## Verify Installation

### Check Java

```powershell
java -version
# Should show: openjdk version "17.x.x"
```

### Check Node.js

```powershell
node -version
# Should show: v18.x.x or higher

npm -version
# Should show: 9.x.x or higher
```

### Check PostgreSQL (Optional)

```powershell
psql --version
# Should show: psql (PostgreSQL) 14.x
```

## Troubleshooting

### Java Installation Issues

**"JAVA_HOME not set"**
```powershell
# Set JAVA_HOME manually
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify
java -version
```

**"java command not found"**
- Restart your terminal after installation
- Check if Java is in PATH: `$env:PATH`
- Reinstall Java and ensure "Add to PATH" is checked

### Node.js Installation Issues

**"npm command not found"**
- Restart your terminal after installation
- Reinstall Node.js
- Check if Node.js is in PATH

**"Permission denied" errors**
```powershell
# Run as Administrator or use:
npm install --global --production windows-build-tools
```

### PostgreSQL Installation Issues

**"psql command not found"**
- Add PostgreSQL to PATH:
  ```powershell
  $env:PATH = "C:\Program Files\PostgreSQL\14\bin;$env:PATH"
  ```

**"Connection refused"**
- Start PostgreSQL service:
  ```powershell
  net start postgresql-x64-14
  ```

## Alternative: Docker Setup (Advanced)

If you prefer Docker:

```powershell
# Install Docker Desktop
choco install docker-desktop -y

# Start PostgreSQL in Docker
docker run -d `
  --name complianceguard-db `
  -e POSTGRES_DB=complianceguard `
  -e POSTGRES_USER=complianceguard `
  -e POSTGRES_PASSWORD=complianceguard `
  -p 5432:5432 `
  postgres:14

# Verify
docker ps
```

## System Requirements

### Minimum
- **OS:** Windows 10/11, macOS 10.15+, Linux
- **RAM:** 4 GB
- **Disk:** 2 GB free space
- **CPU:** Dual-core processor

### Recommended
- **OS:** Windows 11, macOS 12+, Linux (Ubuntu 20.04+)
- **RAM:** 8 GB or more
- **Disk:** 5 GB free space
- **CPU:** Quad-core processor

## Next Steps

After installation:

1. ✅ **Verify Prerequisites:**
   ```powershell
   java -version
   node -version
   npm -version
   ```

2. ✅ **Start Backend:**
   ```powershell
   cd skeleton
   ..\mvnw.cmd quarkus:dev
   ```

3. ✅ **Start Frontend:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. ✅ **Access App:**
   - Open: http://localhost:3000
   - Login: any email/password

5. ✅ **Optional - Setup Database:**
   - See `DATABASE_SETUP.md`
   - Enables data persistence and real authentication

## Getting Help

- **Installation Issues:** Check this guide's troubleshooting section
- **App Issues:** See `QUICK_START.md`
- **API Reference:** See `API_INTEGRATION.md`
- **Database Setup:** See `DATABASE_SETUP.md`

---

**Made with Bob**