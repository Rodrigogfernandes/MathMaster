package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Question;
import br.com.mathmaster.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents/{contentId}/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public Question createQuestion(@PathVariable Long contentId, @RequestBody Question question) {
        return questionService.createQuestion(contentId, question);
    }

    @GetMapping
    public List<Question> getQuestionsByContentId(@PathVariable Long contentId) {
        return questionService.getQuestionsByContentId(contentId);
    }

    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable Long contentId, @PathVariable Long questionId) {
        // O contentId é usado no path para manter a consistência da API,
        // mas a lógica de delete no service só precisa do questionId.
        questionService.deleteQuestion(questionId);
    }

    // Adicionar este método DENTRO da classe QuestionController

    @PutMapping("/{questionId}")
    public Question updateQuestion(@PathVariable Long contentId,
                                   @PathVariable Long questionId,
                                   @RequestBody Question questionDetails) {
        return questionService.updateQuestion(contentId, questionId, questionDetails);
    }
}