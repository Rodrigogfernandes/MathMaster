package br.com.mathmaster.backend.repository;

import br.com.mathmaster.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    // ALTERADO: A barra baixa "_" indica para o Spring Data JPA que ele deve "navegar"
    // para a propriedade 'subject' (o objeto relacionado) e então acessar o 'id' desse objeto.
    List<Content> findBySubject_Id(Long subjectId); // CORRIGIDO
}