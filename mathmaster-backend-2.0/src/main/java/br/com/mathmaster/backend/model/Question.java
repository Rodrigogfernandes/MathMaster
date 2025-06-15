package br.com.mathmaster.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String questionText; // O enunciado da questão

    // Esta é uma forma inteligente do JPA de armazenar uma lista de Strings.
    // Ele criará uma tabela separada (question_options) para guardar as alternativas.
    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>(); // As alternativas (ex: "A) 2", "B) 4", "C) 6")

    private String correctAnswer; // A resposta correta (ex: "B) 4")

    private String type = "MULTIPLE_CHOICE"; // Tipo da questão, conforme seu checklist

    // --- Relacionamento com Content ---
    @ManyToOne
    @JoinColumn(name = "content_id")
    @JsonIgnore
    private Content content;


    // --- GETTERS E SETTERS MANUAIS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }
}