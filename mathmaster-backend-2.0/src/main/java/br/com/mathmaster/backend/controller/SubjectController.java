package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Subject;
import br.com.mathmaster.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Anotação que diz: "Esta classe é a porta de entrada da API"
@RequestMapping("/api/modules") // Todas as requisições para /api/modules (como no api.js) virão para cá
public class SubjectController {

    @Autowired // Pede ao Spring pelo nosso "cérebro", o SubjectService
    private SubjectService subjectService;

    @PostMapping // Mapeia requisições do tipo POST para este método
    public Subject createSubject(@RequestBody Subject subject) {
        // @RequestBody significa que os dados da matéria virão no corpo da requisição
        return subjectService.createSubject(subject);
    }

    @GetMapping // Mapeia requisições do tipo GET para este método
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // Adicionar estes métodos dentro da classe SubjectController

    @GetMapping("/{id}") // Mapeia requisições GET para /api/modules/{algum_numero}
    public Subject getSubjectById(@PathVariable Long id) {
        // @PathVariable diz ao Spring para pegar o número da URL e usá-lo como o parâmetro "id"
        return subjectService.getSubjectById(id);
    }

    @PutMapping("/{id}") // Mapeia requisições PUT (para atualização)
    public Subject updateSubject(@PathVariable Long id, @RequestBody Subject subjectDetails) {
        return subjectService.updateSubject(id, subjectDetails);
    }

    @DeleteMapping("/{id}") // Mapeia requisições DELETE
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }

}