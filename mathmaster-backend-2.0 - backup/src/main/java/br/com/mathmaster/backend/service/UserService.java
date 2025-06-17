package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.User;
import br.com.mathmaster.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));
    }

    /**
     * Busca um usuário pelo seu ID.
     * Necessário para a edição no painel administrativo.
     * @param id O ID do usuário.
     * @return O objeto User.
     * @throws RuntimeException se o usuário não for encontrado.
     */
    public User getUserById(Long id) { // NOVO MÉTODO
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
    }
}