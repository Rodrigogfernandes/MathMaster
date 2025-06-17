// src/main/java/br/com/mathmaster/backend/dto/AuthResponse.java
package br.com.mathmaster.backend.dto;

public class AuthResponse {
    private String token;
    private String message;
    private Long userId;
    private String userName;
    private String role; // NOVO CAMPO: Para retornar o papel do usuário no login

    // Construtor padrão
    public AuthResponse() {
    }

    // Construtor para casos mais simples (apenas token e mensagem)
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Construtor completo: Inclui todas as informações que o frontend pode precisar.
    public AuthResponse(String token, String message, Long userId, String userName, String role) { // ALTERADO: Adicionado 'role'
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.userName = userName;
        this.role = role; // Atribui o papel
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

    public String getRole() { // NOVO GETTER
        return role;
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

    public void setRole(String role) { // NOVO SETTER
        this.role = role;
    }
}