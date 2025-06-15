package br.com.mathmaster.backend.repository;

import br.com.mathmaster.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Anotação que indica que esta é uma camada de acesso a dados.
// Estamos dizendo: "Spring, crie uma caixa de ferramentas para a entidade User,
// cuja chave primária (@Id) é do tipo Long".
public interface UserRepository extends JpaRepository<User, Long> {
    // A mágica acontece aqui. Não precisamos escrever NADA.
    // Já ganhamos métodos como save(), findById(), findAll(), deleteById(), etc.
    // Adicionar este método DENTRO da interface UserRepository
    Optional<User> findByEmail(String email);
}