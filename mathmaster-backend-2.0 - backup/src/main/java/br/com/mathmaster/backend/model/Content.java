package br.com.mathmaster.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String theory;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnore // Mantém o objeto Subject ignorado para evitar loops
    private Subject subject;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Question> questions = new ArrayList<>();


    // GETTERS E SETTERS MANUAIS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTheory() {
        return theory;
    }

    public void setTheory(String theory) {
        this.theory = theory;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    /**
     * NOVO: Getter para expor apenas o ID da matéria (Subject) pai.
     * Isso é útil para o frontend sem serializar o objeto Subject completo.
     * @return O ID do Subject pai, ou null se não houver Subject.
     */
    public Long getSubjectId() { // NOVO GETTER
        return subject != null ? subject.getId() : null;
    }
}