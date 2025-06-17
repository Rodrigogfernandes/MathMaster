package br.com.mathmaster.backend.config.security;

import br.com.mathmaster.backend.model.User; // Importa a entidade User
import br.com.mathmaster.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public JpaUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscamos nosso próprio objeto User do banco de dados
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));

        // Construímos e retornamos o objeto UserDetails que o Spring Security entende
        // Agora, usamos user.getRole() para definir os papéis do usuário dinamicamente.
        // O papel deve ser prefixado com "ROLE_" pelo Spring Security internamente,
        // mas aqui basta passar o nome do papel (ex: "ADMIN", "USER").
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole()) // ALTERADO: Agora pega o papel da entidade User
                .build();
    }
}