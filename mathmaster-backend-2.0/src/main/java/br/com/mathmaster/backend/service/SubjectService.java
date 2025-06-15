package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.Subject;
import br.com.mathmaster.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Anotação que marca esta classe como o "cérebro" (camada de serviço)
public class SubjectService {

    @Autowired // Injeção de Dependência: O Spring nos dá a "caixa de ferramentas" (Repository) pronta para uso
    private SubjectRepository subjectRepository;

    // Método para criar uma nova matéria
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    // Método para listar todas as matérias
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Adicionar estes métodos dentro da classe SubjectService

    // Método para buscar uma única matéria pelo seu ID
    public Subject getSubjectById(Long id) {
        // .orElseThrow() é uma forma elegante de lidar com casos onde o ID não existe
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com o id: " + id));
    }

    // Método para atualizar uma matéria existente
    public Subject updateSubject(Long id, Subject subjectDetails) {
        Subject subject = getSubjectById(id); // Primeiro, busca a matéria existente

        // Atualiza os campos com os novos dados
        subject.setName(subjectDetails.getName());
        subject.setDescription(subjectDetails.getDescription());

        return subjectRepository.save(subject); // Salva as alterações
    }

    // Método para deletar uma matéria
    public void deleteSubject(Long id) {
        Subject subject = getSubjectById(id); // Busca para garantir que existe antes de deletar
        subjectRepository.delete(subject);
    }

}