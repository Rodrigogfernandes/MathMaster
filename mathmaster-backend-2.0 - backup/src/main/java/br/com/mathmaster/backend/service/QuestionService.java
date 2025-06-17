package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.Content;
import br.com.mathmaster.backend.model.Question;
import br.com.mathmaster.backend.repository.ContentRepository;
import br.com.mathmaster.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ContentRepository contentRepository;

    public Question createQuestion(Long contentId, Question question) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com o id: " + contentId));
        question.setContent(content);
        return questionRepository.save(question);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada com o id: " + id));
    }

    public List<Question> getQuestionsByContentId(Long contentId) {
        // ALTERADO: Chama o método com o nome corrigido no repositório.
        return questionRepository.findByContent_Id(contentId); // CORRIGIDO
    }

    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada com o id: " + questionId));
        questionRepository.delete(question);
    }

    public Question updateQuestion(Long contentId, Long questionId, Question questionDetails) {
        contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com o id: " + contentId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada com o id: " + questionId));

        question.setQuestionText(questionDetails.getQuestionText());
        question.setOptions(questionDetails.getOptions());
        question.setCorrectAnswer(questionDetails.getCorrectAnswer());
        question.setType(questionDetails.getType());

        return questionRepository.save(question);
    }
}