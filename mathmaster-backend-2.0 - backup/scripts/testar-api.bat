@echo off
REM Testa a API do backend (backend deve estar rodando em http://localhost:8080)
set BASE=http://localhost:8080

echo ===== 1. Health =====
curl -s "%BASE%/hello"
echo.

echo.
echo ===== 2. Login =====
for /f "delims=" %%i in ('curl -s -X POST "%BASE%/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@mathmaster.com\",\"password\":\"adminpass\"}"') do set RESP=%%i
echo %RESP%
echo.
echo Copie o "token" do JSON acima e use em: curl -s "%BASE%/api/users/me" -H "Authorization: Bearer SEU_TOKEN"
echo.
pause
