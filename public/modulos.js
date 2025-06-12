// Inicialização do script quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Inicializar dados do usuário e módulos
        const [userData, userStats, topics, allTopics, progress] = await Promise.all([
            MathMasterAPI.User.getUserData(),
            MathMasterAPI.User.getUserStats(),
            MathMasterAPI.Topics.getUserTopics(),
            MathMasterAPI.Topics.getAllTopics(),
            MathMasterAPI.Progress.getOverallProgress(),
        ]);

        // Atualizar interface com dados reais
        updateUserInterface(userData);
        updateUserStats(userStats);
        renderTopics(topics);
        renderAllTopics(allTopics);
        updateProgress(progress);

        // Configurar eventos de interação
        setupInteractions();

        // Atualizar progresso periodicamente
        let progressInterval = setInterval(async () => {
            try {
                const newProgress = await MathMasterAPI.Progress.getOverallProgress();
                updateProgress(newProgress);
            } catch (error) {
                console.error('Erro ao atualizar progresso:', error);
                showNotification('Não foi possível atualizar o progresso.', 'error');
            }
        }, 30000);

        // Limpar intervalo ao sair da página
        window.addEventListener('beforeunload', () => clearInterval(progressInterval));

    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showNotification('Não foi possível carregar os dados. Tente novamente mais tarde.', 'error');
    }
});

// Função para configurar interações
function setupInteractions() {
    // Delegação de eventos para cliques nos módulos
    document.body.addEventListener('click', async (e) => {
        const moduleCard = e.target.closest('.module-card');
        if (moduleCard) {
            const moduleId = moduleCard.dataset.moduleId;
            if (!moduleId) return;

            try {
                const moduleProgress = await MathMasterAPI.Progress.getProgress(moduleId);
                showModuleDetails(moduleId, moduleProgress);
            } catch (error) {
                console.error('Erro ao carregar detalhes do módulo:', error);
                showNotification('Erro ao carregar detalhes do módulo.', 'error');
            }
        }

        // Delegação de eventos para filtros
        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
            const filter = filterBtn.dataset.filter;
            if (!filter) return;

            try {
                const filteredTopics = await MathMasterAPI.Topics.getFilteredTopics(filter);
                renderAllTopics(filteredTopics);
            } catch (error) {
                console.error('Erro ao filtrar tópicos:', error);
                showNotification('Erro ao filtrar tópicos.', 'error');
            }
        }

        // Delegação de eventos para botões de início
        const startBtn = e.target.closest('.start-btn');
        if (startBtn && !startBtn.disabled) {
            const topicId = startBtn.closest('.topic-card')?.dataset.topicId;
            if (topicId) {
                startTopic(topicId);
            }
        }
    });

    // Configurar pesquisa
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.trim();

            searchTimeout = setTimeout(async () => {
                try {
                    if (searchTerm) {
                        const searchResults = await MathMasterAPI.Topics.searchTopics(searchTerm);
                        renderAllTopics(searchResults);
                    } else {
                        const allTopics = await MathMasterAPI.Topics.getAllTopics();
                        renderAllTopics(allTopics);
                    }
                } catch (error) {
                    console.error('Erro na pesquisa:', error);
                    showNotification('Erro ao buscar tópicos.', 'error');
                }
            }, 300);
        });
    }
}

// Função para renderizar tópicos do usuário
function renderTopics(topics) {
    const topicsContainer = document.querySelector('.user-topics');
    if (!topicsContainer) return;

    const html = topics.map((topic) => `
        <div class="topic-card ${topic.isActive ? 'active' : ''}" data-topic-id="${topic.id}">
            <div class="topic-icon">${topic.icon}</div>
            <div class="topic-info">
                <h3>${escapeHTML(topic.name)}</h3>
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

// Função para renderizar todos os tópicos
function renderAllTopics(topics) {
    const allTopicsContainer = document.querySelector('.all-topics');
    if (!allTopicsContainer) return;

    const html = topics.map((topic) => `
        <div class="topic-card ${topic.isLocked ? 'locked' : ''}" data-topic-id="${topic.id}">
            <div class="topic-header">
                <div class="topic-icon">${topic.icon}</div>
                <div class="topic-status">
                    ${topic.isLocked ? '<i class="fas fa-lock"></i>' :
                      topic.isCompleted ? '<i class="fas fa-check-circle"></i>' : ''}
                </div>
            </div>
            <div class="topic-content">
                <h3>${escapeHTML(topic.name)}</h3>
                <p>${escapeHTML(topic.description)}</p>
                <div class="topic-meta">
                    <span><i class="fas fa-book"></i> ${topic.totalLessons} aulas</span>
                    <span><i class="fas fa-clock"></i> ${topic.estimatedTime}</span>
                </div>
            </div>
            <div class="topic-footer">
                <div class="difficulty-level">
                    ${Array(topic.difficulty).fill('<i class="fas fa-star"></i>').join('')}
                </div>
                <button class="start-btn" ${topic.isLocked ? 'disabled' : ''}>
                    ${topic.isLocked ? 'Bloqueado' : topic.isStarted ? 'Continuar' : 'Começar'}
                </button>
            </div>
        </div>
    `).join('');

    allTopicsContainer.innerHTML = html;
}

// Função para iniciar um tópico
async function startTopic(topicId) {
    if (!topicId || typeof topicId !== 'string') {
        console.error('ID de tópico inválido:', topicId);
        return;
    }

    const button = document.querySelector(`.topic-card[data-topic-id="${topicId}"] .start-btn`);
    if (!button) return;

    button.disabled = true;
    button.textContent = 'Carregando...';

    try {
        const response = await MathMasterAPI.Topics.startTopic(topicId);
        if (response.success) {
            window.location.href = `/topic.html?id=${topicId}`;
        } else {
            throw new Error('Resposta inválida da API.');
        }
    } catch (error) {
        console.error('Erro ao iniciar tópico:', error);
        showNotification('Erro ao iniciar tópico. Tente novamente.', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Começar';
    }
}

// Função para mostrar detalhes do módulo
function showModuleDetails(moduleId, progress) {
    console.log('Detalhes do módulo:', moduleId, progress);
    // Implementar modal ou navegação para detalhes do módulo
}

// Função para atualizar o progresso geral
function updateProgress(progress) {
    const progressBar = document.querySelector('.overall-progress .progress-bar');
    const progressText = document.querySelector('.overall-progress .progress-text');
    const stats = document.querySelector('.progress-stats');

    if (progressBar && progressText) {
        progressBar.style.width = `${progress.percentage}%`;
        progressText.textContent = `${progress.percentage}%`;
    }

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
        showNotification('Erro ao fazer logout. Tente novamente.', 'error');
    }
}

// Função auxiliar para escapar HTML (proteção contra XSS)
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '<',
        '>': '>',
        '"': '&quot;',
        "'": '&#39;',
    }[match]));
}