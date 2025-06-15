// src/main/java/br/com/mathmaster/backend/controller/AuthController.java
package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.User; // Importa a classe User
import br.com.mathmaster.backend.service.AuthService; // Importa o AuthService
import br.com.mathmaster.backend.dto.LoginRequest; // Importa o DTO para o corpo da requisição de login
import br.com.mathmaster.backend.dto.AuthResponse; // Importa o DTO para a resposta do login
import org.springframework.beans.factory.annotation.Autowired; // Anotação para injeção de dependência
import org.springframework.http.ResponseEntity; // Usado para construir respostas HTTP personalizadas (com status, corpo, etc.)
import org.springframework.http.HttpStatus; // Usado para definir o código de status HTTP (ex: 200, 201, 401, 500)
import org.springframework.security.core.AuthenticationException; // Exceção específica do Spring Security para falhas de autenticação
import org.springframework.web.bind.annotation.PostMapping; // Mapeia requisições HTTP POST
import org.springframework.web.bind.annotation.RequestBody; // Indica que o método deve ler o corpo da requisição HTTP
import org.springframework.web.bind.annotation.RequestMapping; // Mapeia requisições HTTP para métodos de um controlador
import org.springframework.web.bind.annotation.RestController; // Combina @Controller e @ResponseBody para APIs REST

@RestController // Indica que esta classe é um controlador REST e que seus métodos retornarão dados (normalmente JSON)
@RequestMapping("/api/auth") // Define o caminho base para todos os endpoints neste controlador. Ex: /api/auth/register
public class AuthController {

    @Autowired // O Spring injeta automaticamente uma instância de AuthService aqui
    private AuthService authService;

    /**
     * Endpoint para registrar um novo usuário no sistema.
     * Recebe os dados do usuário no corpo da requisição (JSON) e retorna o usuário salvo.
     * @param user Objeto User contendo nome, email e senha para registro.
     * @return ResponseEntity contendo o User registrado e o status HTTP 201 CREATED.
     */
    @PostMapping("/register") // Mapeia este método para requisições POST em /api/auth/register
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Chama o serviço para registrar o usuário.
        User registeredUser = authService.registerUser(user);
        // Retorna a resposta HTTP: o usuário criado e o status 201 (Created).
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    /**
     * Endpoint para autenticar um usuário e emitir um token JWT.
     * Recebe as credenciais de login (email e senha) e, se válidas, retorna o JWT.
     * @param loginRequest Objeto LoginRequest contendo o email e a senha.
     * @return ResponseEntity contendo AuthResponse com o token JWT,
     * ou uma mensagem de erro em caso de falha na autenticação.
     */
    @PostMapping("/login") // Mapeia este método para requisições POST em /api/auth/login
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Tenta logar o usuário usando o AuthService.
            // Se as credenciais estiverem incorretas, o AuthService lançará uma AuthenticationException.
            String jwt = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

            // Se o login foi bem-sucedido, buscamos o objeto User completo no banco de dados.
            // Isso nos permite pegar o ID e o nome do usuário para a resposta, que o frontend Rodrigo precisa.
            User authenticatedUser = authService.findUserByEmail(loginRequest.getEmail());

            // Constrói a resposta que será enviada de volta ao frontend.
            // Inclui o JWT, uma mensagem de sucesso, o ID do usuário e o nome do usuário.
            AuthResponse response = new AuthResponse(
                    jwt, // O token JWT gerado
                    "Login bem-sucedido!",
                    authenticatedUser.getId(), // ID do usuário logado
                    authenticatedUser.getName() // Nome do usuário logado
            );
            // Retorna a resposta com status HTTP 200 OK.
            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            // Se uma AuthenticationException ocorrer (credenciais inválidas),
            // criamos uma resposta de erro específica.
            AuthResponse errorResponse = new AuthResponse(null, "Credenciais inválidas. Verifique seu email e senha.");
            // Retorna a resposta com status HTTP 401 UNAUTHORIZED (Não Autorizado).
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);

        } catch (Exception e) {
            // Captura qualquer outra exceção inesperada que possa acontecer.
            // É importante logar (imprimir no console, por exemplo) esses erros para depuração.
            System.err.println("Erro inesperado durante o login: " + e.getMessage());
            // Retorna uma resposta de erro genérica com status HTTP 500 INTERNAL_SERVER_ERROR.
            AuthResponse errorResponse = new AuthResponse(null, "Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}