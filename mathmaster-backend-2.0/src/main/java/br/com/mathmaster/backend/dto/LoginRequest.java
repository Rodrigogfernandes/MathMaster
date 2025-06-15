// src/main/java/br/com/mathmaster/backend/dto/LoginRequest.java
package br.com.mathmaster.backend.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Construtor padrão: É MUITO importante ter um construtor vazio (sem argumentos)
    // O Spring e bibliotecas como Jackson (usada para converter JSON em objetos Java)
    // precisam dele para criar uma instância da classe antes de preencher os campos.
    public LoginRequest() {
    }

    // Construtor com todos os campos: Útil para criar objetos LoginRequest de forma mais fácil no código.
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters: Permitem que outras partes do seu código LEIAM os valores dos campos.
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters: Permitem que outras partes do seu código MODIFIQUEM os valores dos campos.
    // O Jackson usa esses setters para preencher o objeto com os dados do JSON.
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}