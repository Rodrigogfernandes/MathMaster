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
    private ContentRepository contentRepository; // Para encontrar o conteúdo "pai"

    // Criar uma nova questão dentro de um conteúdo
    public Question createQuestion(Long contentId, Question question) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com o id: " + contentId));
        question.setContent(content);
        return questionRepository.save(question);
    }

    // Listar todas as questões de um conteúdo
    public List<Question> getQuestionsByContentId(Long contentId) {
        return questionRepository.findByContentId(contentId);
    }

    // Deletar uma questão
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada com o id: " + questionId));
        questionRepository.delete(question);
    }

    // Adicionar este método DENTRO da classe QuestionService

    // Método para atualizar uma questão existente
    public Question updateQuestion(Long contentId, Long questionId, Question questionDetails) {
        // Garante que o conteúdo "pai" existe
        contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado com o id: " + contentId));

        // Busca a questão que queremos atualizar
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada com o id: " + questionId));

        // Atualiza todos os campos com os novos dados vindos da requisição
        question.setQuestionText(questionDetails.getQuestionText());
        question.setOptions(questionDetails.getOptions());
        question.setCorrectAnswer(questionDetails.getCorrectAnswer());
        question.setType(questionDetails.getType());

        // Salva e retorna a questão com os dados atualizados
        return questionRepository.save(question);
    }
}