package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Question; //
import br.com.mathmaster.backend.service.QuestionService; //
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents/{contentId}/questions") //
public class QuestionController {

    @Autowired
    private QuestionService questionService; //

    @PostMapping
    public Question createQuestion(@PathVariable Long contentId, @RequestBody Question question) {
        return questionService.createQuestion(contentId, question);
    }

    /**
     * Retorna uma Questão específica pelo seu ID (aninhado sob Content).
     * Ex: GET /api/contents/{contentId}/questions/{questionId}
     * @param contentId O ID do Conteúdo pai.
     * @param questionId O ID da Questão.
     * @return O objeto Question.
     */
    @GetMapping("/{questionId}") // NOVO ENDPOINT
    public Question getQuestionById(@PathVariable Long contentId, @PathVariable Long questionId) {
        // O contentId no path é para consistência de URL, mas a busca é pelo ID único da Question.
        return questionService.getQuestionById(questionId);
    }

    // Listar todas as questões de um conteúdo (já existia no seu arquivo, apenas mantendo)
    @GetMapping // JÁ EXISTIA
    public List<Question> getQuestionsByContentId(@PathVariable Long contentId) {
        return questionService.getQuestionsByContentId(contentId);
    }

    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable Long contentId, @PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
    }

    @PutMapping("/{questionId}")
    public Question updateQuestion(@PathVariable Long contentId,
                                   @PathVariable Long questionId,
                                   @RequestBody Question questionDetails) {
        return questionService.updateQuestion(contentId, questionId, questionDetails);
    }
}