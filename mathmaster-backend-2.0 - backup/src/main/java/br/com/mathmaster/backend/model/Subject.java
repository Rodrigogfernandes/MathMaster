package br.com.mathmaster.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    // --- Início do Relacionamento ---

    // Uma Matéria para Muitos Conteúdos
    // mappedBy: Diz ao JPA "A gestão deste relacionamento já está sendo feita pelo campo 'subject' na classe Content".
    // cascade: Se salvarmos/deletarmos uma Matéria, seus Conteúdos também serão salvos/deletados em cascata.
    // orphanRemoval: Se um conteúdo for removido desta lista, ele será deletado do banco.
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Content> contents = new ArrayList<>();

    // --- Fim do Relacionamento ---


    // GETTERS E SETTERS MANUAIS

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}