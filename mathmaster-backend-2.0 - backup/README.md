# MathMaster - Backend

Este é o repositório para o serviço de backend do projeto MathMaster, desenvolvido em Java com Spring Boot.

## Pré-requisitos

Para rodar este projeto, você precisará ter as seguintes ferramentas instaladas:
-   Java (JDK) 17 ou superior
-   MySQL Server 8.0+
-   Git

## Configuração do Ambiente

Antes de iniciar a aplicação, você precisa configurar as seguintes **variáveis de ambiente** na sua máquina:

1.  `MYSQL_PASSWORD`: A senha do seu usuário do MySQL local (geralmente 'root').
2.  `JWT_SECRET`: Uma chave secreta longa e codificada em Base64 para assinar os tokens. Você pode gerar uma em [https://www.base64encode.org/](https://www.base64encode.org/).

## Como Rodar o Projeto

1.  **Configure o Banco de Dados:**
    * Certifique-se de que seu servidor MySQL está rodando.
    * Crie um schema (banco de dados) vazio com o nome: `mathmaster_db`.
        ```sql
        CREATE SCHEMA mathmaster_db;
        ```

2.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/Rodrigogfernandes/MathMaster.git](https://github.com/Rodrigogfernandes/MathMaster.git)
    cd MathMaster
    ```

3.  **Execute a Aplicação:**
    * Abra o projeto em uma IDE como o IntelliJ e importe-o como um projeto Maven.
    * Encontre a classe `BackendApplication.java` e execute-a.
    * A aplicação iniciará na porta `8080` e o `data.sql` populará o banco.

---
### **!! ATENÇÃO: Ponto de Observação Importante !!**

O arquivo `data.sql` é configurado para popular o banco de dados com dados iniciais **apenas na primeira vez** que você roda o projeto.

**Após a primeira inicialização bem-sucedida, você DEVE fazer o seguinte:**

1.  **PARE** a aplicação.
2.  Vá até o arquivo `src/main/resources/data.sql`.
3.  **APAGUE TODO O CONTEÚDO** deste arquivo, deixando-o em branco.
4.  Salve o arquivo vazio.

Se você não fizer isso, a aplicação falhará na próxima inicialização ao tentar inserir dados duplicados (como usuários com o mesmo email). A partir daí, você poderá iniciar e parar o backend quantas vezes quiser sem problemas.