package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.Content;
import br.com.mathmaster.backend.model.Subject;
import br.com.mathmaster.backend.repository.ContentRepository;
import br.com.mathmaster.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public Content createContent(Long subjectId, Content content) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com o id: " + subjectId));
        content.setSubject(subject);
        return contentRepository.save(content);
    }

    public Content getContentById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com o id: " + id));
    }

    public List<Content> getContentsBySubjectId(Long subjectId) {
        // ALTERADO: Chama o método com o nome corrigido no repositório.
        return contentRepository.findBySubject_Id(subjectId); // CORRIGIDO
    }
}