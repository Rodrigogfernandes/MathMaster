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

## Arquitetura e Estrutura do Backend

Este backend foi construído seguindo uma arquitetura em camadas para garantir a separação de responsabilidades, manutenibilidade e escalabilidade.

### Tecnologias Utilizadas

* **Java 17:** Versão LTS do Java, garantindo estabilidade e acesso a recursos modernos da linguagem.
* **Spring Boot 3.x:** Framework principal que acelera e simplifica o desenvolvimento de aplicações Java.
* **Spring Web:** Para a construção de endpoints RESTful (API).
* **Spring Data JPA (com Hibernate):** Para a persistência de dados e mapeamento objeto-relacional (ORM), facilitando a comunicação com o banco de dados.
* **Spring Security:** Para a implementação de um sistema de autenticação e autorização robusto e seguro.
* **MySQL:** Banco de dados relacional escolhido para armazenar os dados da aplicação.
* **Maven:** Ferramenta de gerenciamento de dependências e build do projeto.
* **JWT (JSON Web Token):** Utilizado para a autenticação stateless, garantindo que a API seja escalável e segura.

### Estrutura dos Pacotes

O código-fonte está organizado em uma arquitetura em camadas, refletida na seguinte estrutura de pacotes:

* **`config`**: Contém classes de configuração do Spring, como o `SecurityConfig`, que define as regras de segurança e autenticação da aplicação.
* **`controller`**: A camada de entrada da API. Os controllers são responsáveis por receber as requisições HTTP, validar os dados de entrada e chamar os serviços apropriados.
* **`dto`**: (Data Transfer Objects) Classes simples usadas para transferir dados entre o cliente e o servidor de forma segura e estruturada, como `LoginRequest` e `AuthResponse`.
* **`model`**: Contém as entidades JPA (`User`, `Subject`, `Content`, etc.), que são as representações das tabelas do nosso banco de dados.
* **`repository`**: A camada de acesso a dados. As interfaces de repositório (que estendem `JpaRepository`) são responsáveis por todas as operações de banco de dados (CRUD).
* **`service`**: Onde reside a lógica de negócio da aplicação. Os serviços orquestram as operações, chamando os repositórios e aplicando as regras de negócio.
* **`util`**: Classes utilitárias, como o `JwtUtil`, que fornecem funcionalidades reaproveitáveis (neste caso, geração e validação de tokens).

### Visão Geral da API

A API foi projetada seguindo os princípios RESTful, com os seguintes recursos principais:

* **`/api/auth`**: Endpoints públicos para registro (`/register`) e login (`/login`) de usuários.
* **`/api/users`**: Endpoints para operações relacionadas a usuários, como listar todos (`GET`) ou obter o usuário logado (`GET /me`).
* **`/api/modules`**: CRUD completo para as Matérias (Subjects).
* **`/api/achievements`**: CRUD completo para as Conquistas (Achievements).
* **`/api/contents`**: CRUD aninhado para os Conteúdos, acessados através de uma matéria (ex: `/api/modules/{moduleId}/contents`).
* **`/api/questions`**: CRUD aninhado para as Questões, acessados através de um conteúdo (ex: `/api/contents/{contentId}/questions`).

### Segurança

A segurança da API é **stateless** (sem estado) e baseada em **JSON Web Tokens (JWT)**.

1.  O endpoint `/api/auth/login` emite um token JWT após a autenticação bem-sucedida.
2.  Todas as outras rotas protegidas exigem que este token seja enviado no cabeçalho `Authorization` da requisição, no formato `Bearer <token>`.
3.  Um filtro customizado (`JwtAuthFilter`) intercepta cada requisição, valida o token e, se for válido, autentica o usuário para aquela requisição específica.