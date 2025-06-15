package br.com.mathmaster.backend.service;

import br.com.mathmaster.backend.model.Achievement;
import br.com.mathmaster.backend.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Anotação que marca esta classe como o "cérebro" (camada de serviço)
public class AchievementService {

    @Autowired // Injeção de Dependência: O Spring nos dá a "caixa de ferramentas" (Repository) pronta para uso
    private AchievementRepository achievementRepository;

    // Método para criar uma nova conquista
    public Achievement createAchievement(Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    // Método para listar todas as conquista
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    // Adicionar estes métodos dentro da classe AchievementService

    // Método para buscar uma única conquista pelo seu ID
    public Achievement getAchievementById(Long id) {
        // .orElseThrow() é uma forma elegante de lidar com casos onde o ID não existe
        return achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conquista não encontrada com o id: " + id));
    }

    // Método para atualizar uma conquista existente
    public Achievement updateAchievement(Long id, Achievement achievementDetails) {
        Achievement achievement = getAchievementById(id); // Primeiro, busca a matéria existente

        // Atualiza os campos com os novos dados
        achievement.setTitle(achievementDetails.getTitle());
        achievement.setDescription(achievementDetails.getDescription());
        achievement.setPoints(achievementDetails.getPoints());

        return achievementRepository.save(achievement); // Salva as alterações
    }

    // Método para deletar uma conquista
    public void deleteAchievement(Long id) {
        Achievement achievement = getAchievementById(id); // Busca para garantir que existe antes de deletar
        achievementRepository.delete(achievement);
    }}

