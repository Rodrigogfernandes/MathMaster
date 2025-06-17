package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.User;
import br.com.mathmaster.backend.repository.UserRepository; //
import br.com.mathmaster.backend.config.security.JpaUserDetailsService;
import br.com.mathmaster.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JpaUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registra um novo usuário no sistema.
     * A senha é criptografada. O papel é definido: ADMIN se for o primeiro usuário, senão USER.
     * @param user O objeto User com os dados a serem registrados.
     * @return O objeto User salvo no banco de dados.
     */
    public User registerUser(User user) {
        // Criptografa a senha
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Lógica para definir o papel:
        // Se não houver nenhum usuário no banco, este é o primeiro -> ADMIN
        // Caso contrário, é um usuário comum -> USER
        if (userRepository.count() == 0) { // count() retorna o número de registros na tabela
            user.setRole("ADMIN"); //
        } else {
            user.setRole("USER"); //
        }

        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(email, password);

        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        String jwt = jwtUtil.generateToken(userDetails);

        return jwt;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));
    }
}