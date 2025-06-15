package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.User; // Importa a entidade User
import br.com.mathmaster.backend.service.UserService; // Importa o UserService
import org.springframework.beans.factory.annotation.Autowired; // Injeção de dependência
import org.springframework.http.HttpStatus; // Status HTTP
import org.springframework.http.ResponseEntity; // Respostas HTTP
import org.springframework.security.core.Authentication; // Informações de autenticação do Spring Security
import org.springframework.security.core.context.SecurityContextHolder; // Para acessar o contexto de segurança
import org.springframework.security.core.userdetails.UserDetails; // Detalhes do usuário no Spring Security
import org.springframework.web.bind.annotation.GetMapping; // Mapeia requisições GET
import org.springframework.web.bind.annotation.RequestMapping; // Mapeia o caminho base
import org.springframework.web.bind.annotation.RestController; // Controlador REST

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
        // Se não houver usuário autenticado ou se algo der errado, retorna 404 Not Found.
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
}