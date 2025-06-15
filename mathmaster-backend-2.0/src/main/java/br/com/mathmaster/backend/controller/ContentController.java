package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Content;
import br.com.mathmaster.backend.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modules/{subjectId}/contents") // A rota base agora inclui o ID da matéria
public class ContentController {

    @Autowired
    private ContentService contentService;

    @PostMapping
    public Content createContent(@PathVariable Long subjectId, @RequestBody Content content) {
        // @PathVariable pega o "subjectId" da URL
        // @RequestBody pega os dados do conteúdo (título e teoria) do corpo da requisição
        return contentService.createContent(subjectId, content);
    }
}