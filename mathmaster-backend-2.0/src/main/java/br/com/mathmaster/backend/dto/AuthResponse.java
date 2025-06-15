// src/main/java/br/com/mathmaster/backend/dto/AuthResponse.java
package br.com.mathmaster.backend.dto;

public class AuthResponse {
    private String token; // O token JWT que será enviado ao cliente
    private String message; // Uma mensagem de sucesso ou erro
    private Long userId; // Opcional: ID do usuário logado, útil para o frontend
    private String userName; // Opcional: Nome do usuário logado, útil para o frontend

    // Construtor padrão (sempre bom ter)
    public AuthResponse() {
    }

    // Construtor para casos mais simples (apenas token e mensagem)
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Construtor completo: Inclui todas as informações que o frontend pode precisar.
    public AuthResponse(String token, String message, Long userId, String userName) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.userName = userName;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    // Setters
    public void setToken(String token) {
        this.token = token;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}