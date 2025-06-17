package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Content;
import br.com.mathmaster.backend.service.ContentService; //
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Novo import

@RestController
@RequestMapping("/api/modules/{subjectId}/contents") // A rota base agora inclui o ID da matéria
public class ContentController {

    @Autowired
    private ContentService contentService; //

    @PostMapping
    public Content createContent(@PathVariable Long subjectId, @RequestBody Content content) {
        return contentService.createContent(subjectId, content);
    }

    /**
     * Retorna um Conteúdo específico pelo seu ID (aninhado sob Subject).
     * Ex: GET /api/modules/{subjectId}/contents/{id}
     * @param subjectId O ID da Matéria (Subject) pai.
     * @param id O ID do Conteúdo.
     * @return O objeto Content.
     */
    @GetMapping("/{id}") // NOVO ENDPOINT
    public Content getContentById(@PathVariable Long subjectId, @PathVariable Long id) {
        // O subjectId no path é mais para consistência de URL, mas a busca é pelo ID único do Content.
        return contentService.getContentById(id);
    }

    /**
     * Lista todos os Conteúdos de uma Matéria específica.
     * Ex: GET /api/modules/{subjectId}/contents
     * @param subjectId O ID da Matéria (Subject).
     * @return Uma lista de objetos Content.
     */
    @GetMapping // NOVO ENDPOINT (Já existia um @GetMapping, mas este agora pega a lista)
    // Se você já tinha um @GetMapping sem parâmetros para listar todos os conteúdos, pode renomear para evitar conflito
    // Ex: @GetMapping("/all") ou garantir que este método de busca por subjectId seja único.
    // Para nosso caso, o @GetMapping na raiz da RequestMapping já é para listar por subjectId se não houver ID específico.
    public List<Content> getContentsBySubjectId(@PathVariable Long subjectId) { // NOVO ENDPOINT
        return contentService.getContentsBySubjectId(subjectId);
    }
}