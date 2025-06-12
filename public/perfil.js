// Inicialização do script quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Inicializar dados do usuário
        const userData = await MathMasterAPI.User.getUserData();
        const userStats = await MathMasterAPI.User.getUserStats();
        const topics = await MathMasterAPI.Topics.getUserTopics();
        const achievements = await MathMasterAPI.Achievements.getUserAchievements();
        const progress = await MathMasterAPI.Progress.getOverallProgress();
        
        // Atualizar interface com dados reais
        updateUserInterface(userData);
        updateUserStats(userStats);
        renderTopics(topics);
        renderAchievements(achievements);
        updateProgress(progress);
        
        // Configurar eventos de interação
        setupInteractions();
        
        // Atualizar dados periodicamente
        setInterval(async () => {
            const newStats = await MathMasterAPI.User.getUserStats();
            const newProgress = await MathMasterAPI.Progress.getOverallProgress();
            updateUserStats(newStats);
            updateProgress(newProgress);
        }, 30000);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Tratar erro apropriadamente
    }
});

// Função para configurar interações
function setupInteractions() {
    // Configurar formulário de edição de perfil
    const profileForm = document.querySelector('#profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(profileForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                bio: formData.get('bio'),
                notifications: formData.get('notifications') === 'on'
            };
            
            try {
                await MathMasterAPI.User.updateUserData(userData);
                showNotification('Perfil atualizado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao atualizar perfil:', error);
                showNotification('Erro ao atualizar perfil. Tente novamente.', 'error');
            }
        });
    }
    
    // Configurar upload de avatar
    const avatarInput = document.querySelector('#avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('avatar', file);
                    
                    const response = await fetch('/api/user/avatar', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        showNotification('Avatar atualizado com sucesso!', 'success');
                        // Atualizar preview do avatar
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.querySelector('.avatar-preview').src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        throw new Error('Erro ao fazer upload do avatar');
                    }
                } catch (error) {
                    console.error('Erro ao atualizar avatar:', error);
                    showNotification('Erro ao atualizar avatar. Tente novamente.', 'error');
                }
            }
        });
    }
    
    // Configurar alteração de senha
    const passwordForm = document.querySelector('#password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(passwordForm);
            const currentPassword = formData.get('current-password');
            const newPassword = formData.get('new-password');
            const confirmPassword = formData.get('confirm-password');
            
            if (newPassword !== confirmPassword) {
                showNotification('As senhas não coincidem', 'error');
                return;
            }
            
            try {
                await MathMasterAPI.User.updatePassword(currentPassword, newPassword);
                passwordForm.reset();
                showNotification('Senha atualizada com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao atualizar senha:', error);
                showNotification('Erro ao atualizar senha. Tente novamente.', 'error');
            }
        });
    }
}

// Função para renderizar tópicos do usuário
function renderTopics(topics) {
    const topicsContainer = document.querySelector('.user-topics');
    if (!topicsContainer) return;
    
    const html = topics.map(topic => `
        <div class="topic-card ${topic.isActive ? 'active' : ''}" data-topic-id="${topic.id}">
            <div class="topic-icon">${topic.icon}</div>
            <div class="topic-info">
                <h3>${topic.name}</h3>
                <div class="topic-progress">
                    <div class="progress-bar" style="width: ${topic.progress}%"></div>
                    <span>${topic.progress}%</span>
                </div>
            </div>
            <div class="topic-stats">
                <span>${topic.completedLessons}/${topic.totalLessons} aulas</span>
                <span>${topic.xp} XP</span>
            </div>
        </div>
    `).join('');
    
    topicsContainer.innerHTML = html;
}

// Função para renderizar conquistas
function renderAchievements(achievements) {
    const achievementsContainer = document.querySelector('.achievements-grid');
    if (!achievementsContainer) return;
    
    const html = achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? 'unlocked' : ''}" data-achievement-id="${achievement.id}">
            <div class="achievement-icon">
                ${achievement.unlocked ? achievement.icon : '<i class="fas fa-lock"></i>'}
            </div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? `
                    <div class="achievement-date">
                        Desbloqueado em ${new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                ` : `
                    <div class="achievement-progress">
                        <div class="progress-bar" style="width: ${achievement.progress}%"></div>
                        <span>${achievement.progress}%</span>
                    </div>
                `}
            </div>
            <div class="achievement-reward">
                <i class="fas fa-coins"></i> ${achievement.reward}
            </div>
        </div>
    `).join('');
    
    achievementsContainer.innerHTML = html;
}

// Função para atualizar o progresso geral
function updateProgress(progress) {
    // Atualizar barra de progresso geral
    const progressBar = document.querySelector('.overall-progress .progress-bar');
    const progressText = document.querySelector('.overall-progress .progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress.percentage}%`;
        progressText.textContent = `${progress.percentage}%`;
    }
    
    // Atualizar estatísticas
    const stats = document.querySelector('.progress-stats');
    if (stats) {
        stats.innerHTML = `
            <div class="stat">
                <span class="stat-value">${progress.completedTopics}</span>
                <span class="stat-label">Tópicos Concluídos</span>
            </div>
            <div class="stat">
                <span class="stat-value">${progress.totalXP}</span>
                <span class="stat-label">XP Total</span>
            </div>
            <div class="stat">
                <span class="stat-value">${progress.streak}</span>
                <span class="stat-label">Dias Seguidos</span>
            </div>
        `;
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para fazer logout
async function logout() {
    try {
        await MathMasterAPI.User.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
} 