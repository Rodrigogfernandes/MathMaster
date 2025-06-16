package br.com.mathmaster.backend.controller;

import br.com.mathmaster.backend.model.Achievement;
import br.com.mathmaster.backend.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements") //
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @PostMapping // Mapeia requisições do tipo POST para este método
    public Achievement createAchievement(@RequestBody Achievement achievement) {
        // @RequestBody significa que os dados da conquista virão no corpo da requisição
        return achievementService.createAchievement(achievement);
    }

    @GetMapping // Mapeia requisições do tipo GET para este método
    public List<Achievement> getAllAchievements() {
        return achievementService.getAllAchievements();
    }

    @GetMapping("/{id}") // Mapeia requisições GET para /api/achievements/{id}
    public Achievement getAchievementById(@PathVariable Long id) {
        return achievementService.getAchievementById(id);
    }

    @PutMapping("/{id}") // Mapeia requisições PUT (para atualização)
    public Achievement updateAchievement(@PathVariable Long id, @RequestBody Achievement achievementDetails) {
        return achievementService.updateAchievement(id, achievementDetails);
    }

    @DeleteMapping("/{id}") // Mapeia requisições DELETE
    public void deleteAchievement(@PathVariable Long id) {
        achievementService.deleteAchievement(id);
    }
}