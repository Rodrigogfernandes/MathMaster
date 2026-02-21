@echo off
REM Inicia o backend com banco H2 (sem precisar do MySQL)
REM Requer JDK 17 e Maven no PATH, ou JAVA_HOME definido.

set BACKEND_DIR=%~dp0..
cd /d "%BACKEND_DIR%"

if defined JAVA_HOME (
  echo Usando JAVA_HOME=%JAVA_HOME%
) else (
  echo AVISO: JAVA_HOME nao definido. Tentando usar 'java' do PATH...
  where java >nul 2>&1 || (
    echo Defina JAVA_HOME para o JDK 17, por exemplo:
    echo   set JAVA_HOME=C:\Program Files\Java\jdk-17
    pause
    exit /b 1
  )
)

echo.
echo Iniciando backend na porta 8080 (perfil H2 - banco em memoria)...
echo Usuarios de teste: admin@mathmaster.com / adminpass  ou  rodrigo@amigo.com / userpass
echo.
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
pause
