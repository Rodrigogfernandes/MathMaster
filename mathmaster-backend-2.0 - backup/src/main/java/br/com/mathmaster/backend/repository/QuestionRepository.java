package br.com.mathmaster.backend.repository;

import br.com.mathmaster.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // ALTERADO: A barra baixa "_" indica para o Spring Data JPA que ele deve "navegar"
    // para a propriedade 'content' (o objeto relacionado) e então acessar o 'id' desse objeto.
    List<Question> findByContent_Id(Long contentId); // CORRIGIDO
}