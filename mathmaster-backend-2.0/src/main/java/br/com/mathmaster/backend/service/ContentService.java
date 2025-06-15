package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.Content;
import br.com.mathmaster.backend.model.Subject;
import br.com.mathmaster.backend.repository.ContentRepository;
import br.com.mathmaster.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContentService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private SubjectRepository subjectRepository; // Precisamos dele para encontrar a matéria

    public Content createContent(Long subjectId, Content content) {
        // 1. Encontra a matéria no banco de dados pelo ID
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com o id: " + subjectId));

        // 2. Associa a matéria encontrada ao novo conteúdo
        content.setSubject(subject);

        // 3. Salva o novo conteúdo (que agora sabe a qual matéria pertence)
        return contentRepository.save(content);
    }
}