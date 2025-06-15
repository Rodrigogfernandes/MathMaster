package br.com.mathmaster.backend.repository;

import br.com.mathmaster.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    // Adicione este método. O Spring Data JPA cria a consulta automaticamente
    // apenas lendo o nome do método. "Encontre Por Id Da Matéria"
    List<Content> findBySubjectId(Long subjectId);

}