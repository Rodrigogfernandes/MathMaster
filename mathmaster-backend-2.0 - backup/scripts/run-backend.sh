#!/usr/bin/env bash
# Inicia o backend (Git Bash / Linux / Mac). Define JAVA_HOME se não estiver definido.

BACKEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BACKEND_DIR"

if [ -z "$JAVA_HOME" ]; then
  # Tenta caminhos comuns no Windows (Git Bash)
  for path in "/c/Program Files/Java/jdk-17" "/c/Program Files/Java/jdk-21" "/usr/lib/jvm/java-17-openjdk"; do
    if [ -d "$path" ] && [ -x "$path/bin/java" ]; then
      export JAVA_HOME="$path"
      echo "JAVA_HOME definido: $JAVA_HOME"
      break
    fi
  done
fi

if [ -z "$JAVA_HOME" ] || ! [ -x "$JAVA_HOME/bin/java" ]; then
  echo "Erro: defina JAVA_HOME (ex.: export JAVA_HOME=\"/c/Program Files/Java/jdk-17\")"
  exit 1
fi

echo "Iniciando backend (perfil: ${SPRING_PROFILES_ACTIVE:-default})..."
echo "Com H2 (sem MySQL): SPRING_PROFILES_ACTIVE=h2 ./scripts/run-backend.sh"
echo ""

if [ "$SPRING_PROFILES_ACTIVE" = "h2" ]; then
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
else
  ./mvnw spring-boot:run
fi
