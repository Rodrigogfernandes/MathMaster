# Testa a API do backend (backend deve estar rodando em http://localhost:8080)
$Base = "http://localhost:8080"

Write-Host "===== 1. Health =====" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$Base/hello" -Method Get

Write-Host "`n===== 2. Login =====" -ForegroundColor Cyan
$body = @{ email = "admin@mathmaster.com"; password = "adminpass" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$Base/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$login | ConvertTo-Json

if ($login.token) {
    Write-Host "`n===== 3. Usuario logado (GET /api/users/me) =====" -ForegroundColor Cyan
    $headers = @{ Authorization = "Bearer $($login.token)" }
    Invoke-RestMethod -Uri "$Base/api/users/me" -Method Get -Headers $headers | ConvertTo-Json

    Write-Host "`n===== 4. Modulos (GET /api/modules) =====" -ForegroundColor Cyan
    Invoke-RestMethod -Uri "$Base/api/modules" -Method Get -Headers $headers | ConvertTo-Json
}

Write-Host "`nConcluido." -ForegroundColor Green
