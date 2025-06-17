// src/main/java/br/com/mathmaster/backend/dto/MessageResponse.java
package br.com.mathmaster.backend.dto;

public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message; // CORRIGIDO: Atribui o valor do parâmetro à variável da classe
    }
}