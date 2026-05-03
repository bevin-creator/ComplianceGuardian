# Install Java 17 Manually - Step by Step

## Step 1: Download Java

1. **Open your browser** and go to: https://adoptium.net/temurin/releases/

2. **Select these options:**
   - **Version:** 17 - LTS
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** JDK
   - **Image Type:** JDK

3. **Click the download button** (`.msi` file, about 160 MB)

## Step 2: Install Java

1. **Run the downloaded file** (e.g., `OpenJDK17U-jdk_x64_windows_hotspot_17.x.x.msi`)

2. **Follow the installer:**
   - Click "Next"
   - Accept the license agreement
   - **IMPORTANT:** Check these boxes:
     - ✅ "Add to PATH"
     - ✅ "Set JAVA_HOME variable"
   - Choose installation location (default is fine: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`)
   - Click "Install"
   - Click "Finish"

## Step 3: Verify Installation

1. **Close all PowerShell/Command Prompt windows** (important!)

2. **Open a NEW PowerShell window**

3. **Run this command:**
   ```powershell
   java -version
   ```

4. **You should see:**
   ```
   openjdk version "17.0.x" 2024-xx-xx
   OpenJDK Runtime Environment Temurin-17.0.x+x (build 17.0.x+x)
   OpenJDK 64-Bit Server VM Temurin-17.0.x+x (build 17.0.x+x, mixed mode, sharing)
   ```

## Step 4: If Java Command Not Found

If you get "java is not recognized", manually set the PATH:

1. **Find Java installation path:**
   - Usually: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\`

2. **Set environment variables:**
   ```powershell
   # Set JAVA_HOME
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot', 'Machine')
   
   # Add to PATH
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
   $newPath = $currentPath + ';C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\bin'
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
   ```

3. **Close and reopen PowerShell**

4. **Test again:**
   ```powershell
   java -version
   ```

## Step 5: Launch ComplianceGuard Backend

Once Java is installed:

1. **Open PowerShell in project directory**

2. **Navigate to skeleton folder:**
   ```powershell
   cd skeleton
   ```

3. **Start the backend:**
   ```powershell
   ..\mvnw.cmd quarkus:dev
   ```

4. **Wait for this message:**
   ```
   Listening on: http://localhost:8081
   ```

5. **Keep this terminal open!**

## Step 6: Launch Frontend (New Terminal)

1. **Open a NEW PowerShell window**

2. **Navigate to frontend folder:**
   ```powershell
   cd frontend
   ```

3. **Install dependencies (first time only):**
   ```powershell
   npm install
   ```

4. **Start the frontend:**
   ```powershell
   npm run dev
   ```

5. **Browser should open automatically to:** http://localhost:3000

## Troubleshooting

### "java is not recognized" after installation

**Solution 1: Restart Computer**
- Sometimes Windows needs a restart to recognize new PATH variables

**Solution 2: Manual PATH Setup**
- Follow Step 4 above to manually set environment variables

**Solution 3: Use Full Path**
```powershell
# Instead of just "java", use full path:
"C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\bin\java.exe" -version
```

### Maven wrapper fails

**Error:** `mvnw.cmd is not recognized`

**Solution:**
```powershell
# Make sure you're in the skeleton directory
cd skeleton

# Run from parent directory
..\mvnw.cmd quarkus:dev
```

### Port already in use

**Error:** `Port 8081 already in use`

**Solution:**
```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

## Quick Reference

### Check Java Installation
```powershell
java -version
javac -version
echo $env:JAVA_HOME
```

### Start Backend
```powershell
cd skeleton
..\mvnw.cmd quarkus:dev
```

### Start Frontend
```powershell
cd frontend
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- Health Check: http://localhost:8081/health

## Alternative: Portable Java (No Installation)

If you can't install Java system-wide:

1. Download the `.zip` version instead of `.msi`
2. Extract to a folder (e.g., `C:\Java\jdk-17`)
3. Set JAVA_HOME for current session:
   ```powershell
   $env:JAVA_HOME = "C:\Java\jdk-17"
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```
4. Run backend in the same PowerShell window

## Need Help?

- **Java Download:** https://adoptium.net/temurin/releases/
- **Documentation:** See START_HERE.md
- **API Reference:** See API_INTEGRATION.md

---

**Made with Bob** 🤖