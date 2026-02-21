# Banco de dados e testes – MathMaster Backend

## JAVA_HOME (Git Bash)

Se aparecer *"JAVA_HOME is not defined correctly"*, defina antes de rodar o Maven:

```bash
export JAVA_HOME="/c/Program Files/Java/jdk-17"
./mvnw spring-boot:run
```

Ou use o script que tenta detectar o Java: `./scripts/run-backend.sh`

---

## 1. Opção A: MySQL

### 1.1 Criar o banco

- **MySQL instalado e em execução** (serviço MySQL na porta 3306).

Crie o banco manualmente (opcional; a URL já usa `createDatabaseIfNotExist=true`):

```bash
mysql -u root -p < scripts/create-database.sql
```

Ou no MySQL Workbench / DBeaver: abra `scripts/create-database.sql` e execute.

### 1.2 Configurar usuário e senha

Edite `src/main/resources/application.properties`:

- `spring.datasource.username=root`
- `spring.datasource.password=SUA_SENHA` (vazio se for o padrão)

### 1.3 Subir o backend

Defina `JAVA_HOME` (JDK 17) e execute:

```bash
# Git Bash (defina JAVA_HOME antes; caminho no formato Git Bash)
export JAVA_HOME="/c/Program Files/Java/jdk-17"
./mvnw spring-boot:run

# Windows (CMD/PowerShell)
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvnw.cmd spring-boot:run

# Ou apenas (se Java e Maven estiverem no PATH)
mvn spring-boot:run
```

Na primeira execução o Hibernate cria as tabelas e o `data.sql` insere os dados iniciais.

---

## 2. Opção B: Testar sem MySQL (H2 em memória)

Use o perfil **h2** (não precisa instalar MySQL):

```bash
# Git Bash / Linux / Mac
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# Windows (CMD/PowerShell)
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
```

O banco é criado em memória ao iniciar; ao parar a aplicação os dados são perdidos.

---

## 3. Testar a API

Com o backend em execução (porta 8080):

### 3.1 Health

```bash
curl http://localhost:8080/hello
```

Resposta esperada: `Olá, a autenticação com o banco de dados funcionou!`

### 3.2 Login (usuário do data.sql)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@mathmaster.com\",\"password\":\"adminpass\"}"
```

Resposta esperada: JSON com `token`, `message`, `userId`, `userName`.

### 3.3 Usuário logado (substitua TOKEN pelo token recebido no login)

```bash
curl http://localhost:8080/api/users/me -H "Authorization: Bearer TOKEN"
```

### 3.4 Módulos (matérias)

```bash
curl http://localhost:8080/api/modules -H "Authorization: Bearer TOKEN"
```

---

## 4. Usuários iniciais (data.sql)

| Email                 | Senha     |
|-----------------------|-----------|
| admin@mathmaster.com  | adminpass |
| rodrigo@amigo.com     | userpass  |

---

## 5. Requisitos

- **JDK 17** (recomendado para o projeto)
- **Maven 3.6+** ou uso do `mvnw` do projeto
- **MySQL 8** (ou 5.7) – só para Opção A
