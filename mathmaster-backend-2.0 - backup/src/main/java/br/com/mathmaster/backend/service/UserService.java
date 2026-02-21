package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.dto.UpdateUserRequest;
import br.com.mathmaster.backend.model.User;
import br.com.mathmaster.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // Injeta o UserRepository

    /**
     * Retorna todos os usuários registrados.
     * @return Lista de objetos User.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Busca um objeto User completo pelo seu email.
     * Este método é usado para obter todos os detalhes de um usuário
     * a partir do seu email, o que é necessário para o endpoint /api/users/me.
     * @param email O email do usuário a ser buscado.
     * @return O objeto User encontrado.
     * @throws UsernameNotFoundException se nenhum usuário for encontrado com o email fornecido.
     */
    public User findUserByEmail(String email) { // NOVO MÉTODO
        // Usa o UserRepository para buscar o usuário pelo email.
        // O método findByEmail retorna um Optional<User>,
        // que é uma forma segura de lidar com a possibilidade de o usuário não existir.
        // .orElseThrow() é usado para, se o Optional estiver vazio (usuário não encontrado),
        // lançar a exceção UsernameNotFoundException com uma mensagem descritiva.
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));
    }

    /**
     * Atualiza nome e/ou email do usuário identificado pelo email atual.
     * O email só pode ser alterado se o novo valor não estiver em uso por outro usuário.
     */
    public User updateUser(String currentEmail, UpdateUserRequest request) {
        User user = findUserByEmail(currentEmail);
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(currentEmail) && userRepository.existsByEmailAndIdNot(newEmail, user.getId())) {
                throw new IllegalArgumentException("Email já está em uso por outro usuário.");
            }
            user.setEmail(newEmail);
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getCoverUrl() != null) {
            user.setCoverUrl(request.getCoverUrl());
        }
        return userRepository.save(user);
    }
}