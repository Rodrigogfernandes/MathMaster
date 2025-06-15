// src/main/java/br/com/mathmaster/backend/service/AuthService.java
package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.User; // Importa a classe User, que representa nosso usuário no banco de dados
import br.com.mathmaster.backend.repository.UserRepository; // Importa o repositório para interagir com o banco de dados
import br.com.mathmaster.backend.config.security.JpaUserDetailsService; // Importa nosso serviço que carrega os detalhes do usuário para o Spring Security
import br.com.mathmaster.backend.util.JwtUtil; // Importa a classe que criamos para gerar e validar JWTs
import org.springframework.beans.factory.annotation.Autowired; // Anotação para injeção de dependência automática pelo Spring
import org.springframework.security.authentication.AuthenticationManager; // Componente central do Spring Security para autenticar usuários
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Objeto que carrega as credenciais de login
import org.springframework.security.core.Authentication; // Objeto que representa uma autenticação bem-sucedida
import org.springframework.security.core.context.SecurityContextHolder; // Usado para armazenar a autenticação do usuário na sessão atual
import org.springframework.security.core.userdetails.UserDetails; // Interface padrão do Spring Security para representar um usuário
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Exceção lançada quando um usuário não é encontrado
import org.springframework.security.crypto.password.PasswordEncoder; // Interface para criptografar e verificar senhas
import org.springframework.stereotype.Service; // Marca esta classe como um serviço gerenciado pelo Spring

@Service // Indica ao Spring que esta é uma classe de serviço, contendo lógica de negócio
public class AuthService {

    // Injeção de dependências: O Spring vai "dar" a essas variáveis as instâncias corretas.
    @Autowired
    private UserRepository userRepository; // Para salvar e buscar usuários no banco

    @Autowired
    private PasswordEncoder passwordEncoder; // Para criptografar senhas

    @Autowired
    private AuthenticationManager authenticationManager; // Para realizar a autenticação em si

    @Autowired
    private JpaUserDetailsService userDetailsService; // Para carregar os detalhes do usuário do banco

    @Autowired
    private JwtUtil jwtUtil; // Para gerar o token JWT

    /**
     * Método para registrar um novo usuário no sistema.
     * Antes de salvar, a senha fornecida pelo usuário é criptografada.
     * @param user Objeto User contendo os dados do novo usuário (nome, email, senha).
     * @return O objeto User salvo no banco de dados, com a senha criptografada.
     */
    public User registerUser(User user) {
        // Criptografa a senha: MUITO IMPORTANTE para a segurança!
        // Nunca armazene senhas em texto puro no banco de dados.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Salva o usuário no banco de dados através do UserRepository.
        return userRepository.save(user);
    }

    /**
     * Método para realizar o login de um usuário.
     * Ele tenta autenticar as credenciais e, se bem-sucedido, gera um token JWT.
     * @param email O email do usuário que está tentando logar.
     * @param password A senha do usuário.
     * @return O token JWT gerado como uma String.
     * @throws org.springframework.security.core.AuthenticationException Se as credenciais forem inválidas.
     */
    public String loginUser(String email, String password) {
        // 1. Prepara o token de autenticação com as credenciais fornecidas.
        // UsernamePasswordAuthenticationToken é o objeto que o Spring Security usa para
        // representar um pedido de autenticação (usuário e senha).
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(email, password);

        // 2. Tenta autenticar o usuário.
        // O AuthenticationManager é quem orquestra o processo. Ele vai chamar
        // o JpaUserDetailsService para buscar o usuário e
        // o PasswordEncoder para comparar as senhas.
        // Se a senha estiver errada ou o usuário não existir, uma AuthenticationException é lançada.
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 3. Define a autenticação no contexto de segurança do Spring.
        // Isso faz com que o Spring Security "saiba" quem é o usuário logado nesta requisição.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 4. Carrega os detalhes completos do usuário (UserDetails).
        // Precisamos do UserDetails para gerar o JWT, pois ele contém o nome de usuário (email).
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // 5. Gera o token JWT.
        // Usa nosso utilitário JwtUtil para criar o token com base nos detalhes do usuário.
        String jwt = jwtUtil.generateToken(userDetails);

        // Retorna o token JWT.
        return jwt;
    }

    /**
     * Método auxiliar para encontrar o objeto User completo (não apenas UserDetails)
     * pelo email. Útil para obter o ID e nome do usuário para a resposta do login.
     * @param email O email do usuário a ser buscado.
     * @return O objeto User encontrado.
     * @throws UsernameNotFoundException Se o usuário com o email especificado não for encontrado.
     */
    public User findUserByEmail(String email) {
        // Busca o usuário no banco de dados. Optional é uma forma segura de lidar com
        // valores que podem não existir (se o usuário não for encontrado).
        // .orElseThrow() lança uma exceção se o Optional estiver vazio.
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));
    }
}