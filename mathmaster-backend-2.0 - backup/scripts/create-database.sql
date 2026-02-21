-- Cria o banco de dados do MathMaster (execute como usuário com permissão CREATE DATABASE).
-- No MySQL: mysql -u root -p < create-database.sql
-- Ou abra no MySQL Workbench e execute.

CREATE DATABASE IF NOT EXISTS mathmaster
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mathmaster;

-- As tabelas são criadas automaticamente pelo Hibernate (JPA) na primeira execução do backend.
-- Os dados iniciais são inseridos pelo arquivo data.sql na pasta src/main/resources.
