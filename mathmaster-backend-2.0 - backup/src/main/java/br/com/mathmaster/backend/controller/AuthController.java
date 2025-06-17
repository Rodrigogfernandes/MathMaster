// src/main/java/br/com/mathmaster/backend/controller/AuthController.java
package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.User;
import br.com.mathmaster.backend.service.AuthService;
import br.com.mathmaster.backend.dto.LoginRequest;
import br.com.mathmaster.backend.dto.AuthResponse;
import br.com.mathmaster.backend.dto.MessageResponse; // NOVO IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = authService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            User authenticatedUser = authService.findUserByEmail(loginRequest.getEmail());

            AuthResponse response = new AuthResponse(
                    jwt,
                    "Login bem-sucedido!",
                    authenticatedUser.getId(),
                    authenticatedUser.getName(),
                    authenticatedUser.getRole()
            );
            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            AuthResponse errorResponse = new AuthResponse(null, "Credenciais inválidas. Verifique seu email e senha.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            System.err.println("Erro inesperado durante o login: " + e.getMessage());
            AuthResponse errorResponse = new AuthResponse(null, "Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Endpoint de logout. Retorna uma mensagem de sucesso em formato JSON.
     * @return ResponseEntity com MessageResponse e status 200 OK.
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() { // ALTERADO: Retorna ResponseEntity<MessageResponse>
        // Em uma API stateless, o logout do lado do servidor geralmente não precisa fazer nada.
        // A invalidação do token é feita pelo seu tempo de expiração.
        // No futuro, poderíamos adicionar o token a uma "lista negra" aqui se necessário.
        return ResponseEntity.ok(new MessageResponse("Logout realizado com sucesso.")); // ALTERADO: Retorna MessageResponse
    }
}