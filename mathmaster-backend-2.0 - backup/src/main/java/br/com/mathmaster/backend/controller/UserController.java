package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.dto.UpdateUserRequest;
import br.com.mathmaster.backend.model.User;
import br.com.mathmaster.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users") // A rota base, conforme o api.js
public class UserController {

    @Autowired
    private UserService userService; // Injeta o UserService

    /**
     * Retorna a lista de todos os usuários.
     * Futuramente pode ser usado para leaderboard simples.
     * @return Lista de objetos User.
     */
    @GetMapping // Mapeia requisições GET para /api/users
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Retorna os dados do usuário atualmente logado.
     * Mapeia para /api/auth/me ou similar no frontend api.js (considerando rota de user)
     * @return ResponseEntity com o objeto User logado.
     */
    @GetMapping("/me") // Mapeia requisições GET para /api/users/me (para pegar o usuário logado)
    public ResponseEntity<User> getCurrentUser() {
        // Pega o objeto de autenticação do contexto de segurança do Spring.
        // É aqui que o Spring Security guarda quem é o usuário logado na requisição atual.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // authentication.getPrincipal() retorna o objeto principal do usuário autenticado.
        // No nosso caso, é um UserDetails (que no JpaUserDetailsService
        // configuramos para ser o email do usuário).
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userEmail = userDetails.getUsername(); // O username é o email

            // Busca o objeto User completo do banco de dados usando o email.
            // O UserService precisará de um método para isso (vamos adicionar já já).
            User user = userService.findUserByEmail(userEmail);

            if (user != null) {
                return ResponseEntity.ok(user); // Retorna o usuário com status 200 OK.
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Atualiza os dados do perfil do usuário logado (nome e/ou email).
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UpdateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        try {
            User updated = userService.updateUser(email, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    /**
     * Retorna uma lista de usuários para o leaderboard (ranking).
     * Por enquanto, apenas a lista de todos os usuários. Futuramente, com XP/Pontos.
     * Mapeia para /api/users/leaderboard no frontend api.js
     * @return Lista de objetos User.
     */
    @GetMapping("/leaderboard") // Mapeia requisições GET para /api/users/leaderboard
    public ResponseEntity<List<User>> getLeaderboard() {
        // Por enquanto, retorna todos os usuários.
        // No futuro, esta lógica será mais complexa (ordenar por XP, limitar, etc.).
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /** DTO simples para mensagens de erro na resposta. */
    public static class ErrorMessage {
        private final String message;
        public ErrorMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}