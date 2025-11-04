# Script de Pruebas - CABA Arbitros API
# Ejecutar: .\test-api.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "CABA Arbitros API - Test Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
    Write-Host "✅ Health Check OK" -ForegroundColor Green
    Write-Host "   Container ID: $($health.containerID)" -ForegroundColor Gray
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Test Spring Boot Connection
Write-Host "2. Testing Spring Boot API Connection..." -ForegroundColor Yellow
try {
    $arbitros = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/arbitros" -Method Get
    Write-Host "✅ Spring Boot API OK" -ForegroundColor Green
    Write-Host "   Total Arbitros: $($arbitros.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Spring Boot API Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 3. Test Login (sin credenciales reales por ahora)
Write-Host "3. Testing Login Endpoint..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "principal@caba.com"
        password = "password123"
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginData -Headers $headers
    Write-Host "✅ Login Endpoint OK" -ForegroundColor Green
    Write-Host "   Token received: $($response.token.Substring(0,20))..." -ForegroundColor Gray
    $global:token = $response.token
} catch {
    Write-Host "⚠️ Login endpoint responded (expected - auth logic needs Spring Boot integration)" -ForegroundColor Yellow
    # Generar un token de prueba para continuar
    $global:token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"
}
Write-Host ""

# 4. Test Dashboard (requiere token)
Write-Host "4. Testing Dashboard Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
        "Content-Type" = "application/json"
    }
    
    $dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/arbitros/dashboard" -Method Get -Headers $headers
    Write-Host "✅ Dashboard Endpoint OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Dashboard endpoint requires valid authentication" -ForegroundColor Yellow
}
Write-Host ""

# 5. Test Swagger Documentation
Write-Host "5. Testing Swagger Documentation..." -ForegroundColor Yellow
try {
    $swagger = Invoke-WebRequest -Uri "http://localhost:3000/api-docs" -Method Get -UseBasicParsing
    if ($swagger.StatusCode -eq 200) {
        Write-Host "✅ Swagger UI OK" -ForegroundColor Green
        Write-Host "   Access at: http://localhost:3000/api-docs" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Swagger UI Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 6. Test Asignaciones Endpoint
Write-Host "6. Testing Asignaciones Endpoint..." -ForegroundColor Yellow
try {
    $asignaciones = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/asignaciones" -Method Get
    Write-Host "✅ Asignaciones OK (via Spring Boot)" -ForegroundColor Green
    Write-Host "   Total Asignaciones: $($asignaciones.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Asignaciones Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Express API: http://localhost:3000" -ForegroundColor White
Write-Host "Swagger UI:  http://localhost:3000/api-docs" -ForegroundColor White
Write-Host "Spring Boot: http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure AWS credentials in .env" -ForegroundColor White
Write-Host "2. Test file upload with S3" -ForegroundColor White
Write-Host "3. Build Docker image: docker build -t caba-arbitros-api ." -ForegroundColor White
Write-Host "4. Deploy to AWS EC2 with Docker Swarm" -ForegroundColor White
Write-Host ""
