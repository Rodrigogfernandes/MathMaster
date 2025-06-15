package br.com.mathmaster.backend.repository;

import br.com.mathmaster.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Método para encontrar todas as questões de um conteúdo específico
    List<Question> findByContentId(Long contentId);
}