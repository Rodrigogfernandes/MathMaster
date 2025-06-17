// conquistas.js - Sistema de Conquistas MathMaster

class ConquistasManager {
    constructor() {
        this.userData = {}; // Dados do usuário virão do backend
        this.achievements = []; // Conquistas virão do backend
        this.milestones = this.initializeMilestones(); // Marcos ainda são mockados
        this.ranking = this.initializeRanking(); // Ranking ainda é mockado
        this.currentFilter = 'all';
        this.currentRankingTab = 'global';

        this.init();
    }

    async init() { // Tornar init assíncrono para esperar as chamadas de API
        console.log('Sistema de Conquistas inicializado! Carregando dados do backend...');
        await this.loadUserDataFromBackend(); // Carrega dados do usuário
        await this.loadAchievementsFromBackend(); // Carrega conquistas
        this.updateUserStats();
        this.renderAchievements();
        this.renderMilestones(); // Renderiza marcos mockados
        this.renderRanking(); // Renderiza ranking mockado
        this.setupEventListeners();
        // this.startProgressSimulation(); // Desativar simulação de progresso, pois buscaremos dados reais
    }

    // NOVO: Carrega dados do usuário do backend (para estatísticas e moedas)
    async loadUserDataFromBackend() {
        try {
            const userResponse = await window.MathMasterAPI.User.getCurrentUser(); // GET /api/users/me
            if (userResponse && userResponse.id) {
                // Preenche this.userData com dados reais do usuário.
                // Assumimos que o backend pode retornar XP ou moedas.
                this.userData = {
                    userId: userResponse.id,
                    name: userResponse.name,
                    avatar: userResponse.name.charAt(0).toUpperCase(),
                    coins: userResponse.coins || 0, // Se User tiver coins, usa, senão 0
                    totalAchievements: 0, // Será atualizado com base no que o backend retornar
                    unlockedAchievements: 0, // Será atualizado
                    achievementPoints: 0, // Será atualizado (XP ou pontos de conquista do user)
                    daysOnPlatform: 0, // Mockado ou adicionado ao User no backend
                    completionRate: 0, // Calculado no frontend ou adicionado ao User no backend
                    studyStreak: 0, // Mockado
                    problemsSolved: 0, // Mockado
                    modulesCompleted: 0, // Mockado
                    lastLoginDate: new Date().toLocaleDateString('pt-BR')
                };
                console.log('Dados do usuário carregados para conquistas:', this.userData);
                // Atualiza o avatar e moedas no header (se houver elementos)
                const avatarElement = document.querySelector('header .user-profile .avatar');
                if (avatarElement) avatarElement.textContent = this.userData.avatar;
                const coinsElement = document.querySelector('header .coins span:last-child');
                if (coinsElement) coinsElement.textContent = this.userData.coins;

            } else {
                console.warn('Nenhum usuário logado. Redirecionando para login.');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário para conquistas:', error);
            if (typeof showNotification === 'function') {
                showNotification('Não foi possível carregar seu perfil de conquistas.', 'error');
            }
            if (error.status === 401 || error.status === 403) {
                window.location.href = 'login.html';
            }
        }
    }

    // NOVO: Carrega conquistas do backend
    async loadAchievementsFromBackend() {
        try {
            const achievementsData = await window.MathMasterAPI.Achievements.getAllAchievements(); // GET /api/achievements
            console.log('Conquistas recebidas do backend:', achievementsData);

            // Mapeia os dados do backend para o formato que o frontend espera
            this.achievements = achievementsData.map(ach => ({
                id: ach.id, // O ID do backend
                title: ach.title,
                description: ach.description,
                icon: this.getAchievementIcon(ach.title), // Função auxiliar para ícones, pois o backend não tem campo icon
                tier: this.getAchievementTier(ach.points), // Determina o nível com base nos pontos do backend
                reward: ach.points, // Pontos do backend são a recompensa
                progress: 0, // Mockado, pois a lógica de progresso do usuário em conquistas não está no backend ainda
                maxProgress: 1, // Mockado, para que possa ser "desbloqueada"
                unlocked: false, // Assume todas como bloqueadas inicialmente no frontend, até ter lógica de UserAchievement
                category: 'Geral', // Mockado
                locked: false // No MVP, nenhuma vem "hard locked", apenas não desbloqueada
            }));

            // Atualiza estatísticas do usuário com base nas conquistas carregadas
            this.userData.totalAchievements = this.achievements.length;
            this.userData.unlockedAchievements = this.achievements.filter(a => a.unlocked).length;
            this.userData.achievementPoints = this.achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0);

        } catch (error) {
            console.error('Erro ao carregar conquistas do backend:', error);
            if (typeof showNotification === 'function') {
                showNotification('Não foi possível carregar as conquistas do sistema.', 'error');
            }
        }
    }

    // AUXILIAR: Função para mapear título da conquista para ícone (se o backend não retornar)
    getAchievementIcon(title) {
        if (title.includes('Derivadas')) return '🔢';
        if (title.includes('Fogo')) return '🔥';
        if (title.includes('Velocista')) return '⚡';
        if (title.includes('Trigonometria')) return 'π';
        if (title.includes('Integrador')) return '∫';
        if (title.includes('Estatístico')) return '📊';
        if (title.includes('Quebra-Cabeças')) return '🧩';
        if (title.includes('Dedicado')) return '📚';
        if (title.includes('Geométrico')) return '🌐';
        return '🏆'; // Ícone padrão
    }

    // AUXILIAR: Função para determinar o nível da conquista com base nos pontos (mockada)
    getAchievementTier(points) {
        if (points >= 100) return 'platinum';
        if (points >= 50) return 'gold';
        if (points >= 30) return 'silver';
        return 'bronze';
    }

    initializeMilestones() {
        // Dados de marcos (milestones) ainda são mockados, pois não há backend para isso no MVP
        return [
            { id: 'first_steps', title: 'Primeiros Passos', description: 'Você completou seu primeiro módulo de matemática!', date: '2024-03-10', status: 'completed', badges: ['🔢', 'π'] },
            { id: 'overcoming_challenges', title: 'Superando Desafios', description: 'Você resolveu 50 exercícios em uma semana!', date: '2024-03-15', status: 'completed', badges: ['⚡', '🔥', '📚'] },
            { id: 'advanced_calculus', title: 'Cálculo Avançado', description: 'Complete o módulo de cálculo diferencial e integral.', date: '2024-03-18', status: 'in_progress', badges: ['∫', '📊'] },
            { id: 'statistics_probability', title: 'Estatística e Probabilidade', description: 'Domine os conceitos de estatística descritiva e probabilidade.', date: '2024-03-25', status: 'future', badges: ['📊', '🎲'] }
        ];
    }

    initializeRanking() {
        // Dados de ranking ainda são mockados
        return {
            global: [
                { position: 1, name: 'MathWizard', avatar: 'M', points: 2450, completion: 95 },
                { position: 2, name: 'CalcMaster', avatar: 'C', points: 2180, completion: 88 },
                { position: 3, name: 'ProblemSolver', avatar: 'P', points: 1920, completion: 82 },
                { position: 4, name: 'AlgebraAce', avatar: 'A', points: 1650, completion: 78 },
                { position: 5, name: 'GeometryGuru', avatar: 'G', points: 1480, completion: 72 },
                { position: 6, name: 'StatisticStar', avatar: 'S', points: 1320, completion: 68 },
                { position: 7, name: 'Você', avatar: 'R', points: 1250, completion: 65, isCurrentUser: true },
                { position: 8, name: 'GeoGenius', avatar: 'G', points: 1180, completion: 60 },
                { position: 9, name: 'TrigonometryTitan', avatar: 'T', points: 1050, completion: 55 },
                { position: 10, name: 'StatStudent', avatar: 'S', points: 980, completion: 52 }
            ],
            friends: [
                { position: 1, name: 'Você', avatar: 'R', points: 1250, completion: 65, isCurrentUser: true },
                { position: 2, name: 'João Silva', avatar: 'J', points: 980, completion: 52 },
                { position: 3, name: 'Maria Santos', avatar: 'M', points: 750, completion: 45 },
                { position: 4, name: 'Pedro Costa', avatar: 'P', points: 620, completion: 38 },
                { position: 5, name: 'Ana Oliveira', avatar: 'A', points: 480, completion: 32 }
            ],
            weekly: [
                { position: 1, name: 'CalcMaster', avatar: 'C', points: 680, completion: 88 },
                { position: 2, name: 'Você', avatar: 'R', points: 520, completion: 65, isCurrentUser: true },
                { position: 3, name: 'MathWizard', avatar: 'M', points: 450, completion: 95 },
                { position: 4, name: 'ProblemSolver', avatar: 'P', points: 380, completion: 82 },
                { position: 5, name: 'GeometryGuru', avatar: 'G', points: 320, completion: 72 }
            ]
        };
    }

    updateUserStats() {
        const unlockedCount = this.achievements.filter(a => a.unlocked).length;
        const totalAchievements = this.achievements.length;
        const completionRate = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;
        const totalPoints = this.achievements
            .filter(a => a.unlocked)
            .reduce((sum, a) => sum + a.reward, 0);

        // Atualizar stats na interface
        const statCards = document.querySelectorAll('.stat-card .stat-value');
        if (statCards.length >= 4) {
            statCards[0].textContent = unlockedCount;
            statCards[1].textContent = `${completionRate}%`;
            statCards[2].textContent = totalPoints;
            statCards[3].textContent = this.userData.daysOnPlatform; // Ainda mockado
        }

        // Atualizar moedas no header
        const coinsElement = document.querySelector('.coins span:last-child');
        if (coinsElement) {
            coinsElement.textContent = this.userData.coins;
        }
    }

    renderAchievements() {
        const grid = document.querySelector('.achievements-grid');
        if (!grid) return;

        const filteredAchievements = this.filterAchievements();

        grid.innerHTML = filteredAchievements.map(achievement =>
            this.createAchievementCard(achievement)
        ).join('');

        this.addAchievementCardListeners();
    }

    filterAchievements() {
        switch (this.currentFilter) {
            case 'unlocked':
                return this.achievements.filter(a => a.unlocked);
            case 'locked':
                return this.achievements.filter(a => !a.unlocked);
            default:
                return this.achievements;
        }
    }

    createAchievementCard(achievement) {
        // Cálculo de progresso e status de desbloqueio ainda são mockados no frontend
        const progressPercentage = Math.round((achievement.progress / achievement.maxProgress) * 100);
        const isCompleted = achievement.progress >= achievement.maxProgress;
        const isLocked = achievement.locked || false;

        return `
            <div class="achievement-card ${isLocked ? 'locked' : ''} ${achievement.unlocked ? 'unlocked' : ''}" data-achievement-id="${achievement.id}">
                ${isLocked ? `
                    <div class="locked-overlay">
                        <span>🔒</span>
                        <span>Bloqueado</span>
                    </div>
                ` : ''}
                <div class="achievement-header">
                    <div class="achievement-icon ${achievement.tier}-tier">${achievement.icon}</div>
                    <div class="achievement-title">
                        <h3>${achievement.title}</h3>
                        <span class="achievement-tier">${this.getTierLabel(achievement.tier)}</span>
                    </div>
                </div>
                <div class="achievement-content">
                    <div class="achievement-description">
                        ${achievement.description}
                    </div>
                    <div class="achievement-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-text">
                            <span>Progresso: ${achievement.progress}/${achievement.maxProgress}</span>
                            <span>${isCompleted ? 'Completo!' : `${progressPercentage}%`}</span>
                        </div>
                    </div>
                    <div class="achievement-reward">
                        <span>🪙</span>
                        <span>${achievement.reward} moedas</span>
                    </div>
                </div>
            </div>
        `;
    }

    getTierLabel(tier) {
        const labels = {
            bronze: 'Bronze',
            silver: 'Prata',
            gold: 'Ouro',
            platinum: 'Platina'
        };
        return labels[tier] || tier;
    }

    addAchievementCardListeners() {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const achievementId = card.dataset.achievementId;
                this.showAchievementDetails(achievementId);
            });
        });
    }

    showAchievementDetails(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const modal = this.createAchievementModal(achievement);
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('active'), 10);
    }

    createAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="achievement-icon-large ${achievement.tier}-tier">${achievement.icon}</div>
                    <h2>${achievement.title}</h2>
                    <span class="close-modal">×</span>
                </div>
                <div class="modal-body">
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-details">
                        <div class="detail-item">
                            <span class="detail-label">Categoria:</span>
                            <span class="detail-value">${this.getCategoryLabel(achievement.category)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Nível:</span>
                            <span class="detail-value ${achievement.tier}-tier">${this.getTierLabel(achievement.tier)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Recompensa:</span>
                            <span class="detail-value">🪙 ${achievement.reward} moedas</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Progresso:</span>
                            <span class="detail-value">${achievement.progress}/${achievement.maxProgress}</span>
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${(achievement.progress / achievement.maxProgress) * 100}%"></div>
                        </div>
                    </div>
                    ${achievement.unlocked ? `
                        <div class="achievement-status unlocked">
                            <span>✅</span>
                            <span>Conquista Desbloqueada!</span>
                        </div>
                    ` : `
                        <div class="tips-section">
                            <h4>Dicas para desbloquear:</h4>
                            <ul>
                                ${this.getAchievementTips(achievement.id).map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    `}
                </div>
            </div>
        `;

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });

        return modal;
    }

    getCategoryLabel(category) {
        const labels = {
            calculus: 'Cálculo',
            trigonometry: 'Trigonometria',
            geometry: 'Geometria',
            statistics: 'Estatística',
            algebra: 'Álgebra',
            logic: 'Lógica',
            habit: 'Hábitos de Estudo',
            speed: 'Velocidade'
        };
        return labels[category] || category;
    }

    getAchievementTips(achievementId) {
        const tips = {
            derivatives_master: [
                'Pratique exercícios de derivadas diariamente',
                'Revise as regras de derivação',
                'Use a calculadora para verificar suas respostas'
            ],
            fire_streak: [
                'Estabeleça um horário fixo de estudo',
                'Comece com sessões curtas de 15-30 minutos',
                'Use lembretes para não esquecer'
            ],
            math_speedster: [
                'Pratique exercícios cronometrados',
                'Memorize fórmulas básicas',
                'Use técnicas de cálculo mental'
            ],
            // Adicione mais dicas conforme necessário
        };
        return tips[achievementId] || ['Continue praticando!', 'Não desista!'];
    }

    renderMilestones() {
        const timeline = document.querySelector('.milestone-timeline');
        if (!timeline) return;

        const milestonesHTML = this.milestones.map((milestone, index) =>
            this.createMilestoneItem(milestone, index)
        ).join('');

        timeline.innerHTML = `
            <div class="timeline-line"></div>
            ${milestonesHTML}
        `;
    }

    createMilestoneItem(milestone, index) {
        const date = new Date(milestone.date);
        const day = date.getDate();
        const month = date.toLocaleDateString('pt-BR', { month: 'short' });

        return `
            <div class="milestone-item" data-milestone-id="${milestone.id}">
                <div class="milestone-date ${milestone.status === 'future' ? 'future' : ''}">
                    <span>${day}</span>
                    <span>${month}</span>
                </div>
                <div class="milestone-content">
                    <div class="milestone-title">
                        <h3>${milestone.title}</h3>
                        <span class="milestone-badge ${milestone.status === 'completed' ? 'completed' : milestone.status === 'in_progress' ? 'in-progress' : 'future'}">
                            ${this.getMilestoneStatusLabel(milestone.status)}
                        </span>
                    </div>
                    <p>${milestone.description}</p>
                    <div class="achievement-badges">
                        ${milestone.badges.map(badge => `
                            <div class="badge-item ${milestone.status === 'future' ? 'locked' : ''}">${badge}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getMilestoneStatusLabel(status) {
        const labels = {
            completed: 'Concluído',
            in_progress: 'Em Progresso',
            future: 'Futuro'
        };
        return labels[status] || status;
    }

    renderRanking() {
        const rankingList = document.querySelector('.ranking-list');
        if (!rankingList) return;

        const currentRankingData = this.ranking[this.currentRankingTab];

        const rankingHTML = `
            <div class="ranking-item ranking-header">
                <div>Rank</div>
                <div>Usuário</div>
                <div>Pontos</div>
                <div class="completion-header">Conclusão</div>
            </div>
            ${currentRankingData.map(user => this.createRankingItem(user)).join('')}
        `;

        rankingList.innerHTML = rankingHTML;
    }

    createRankingItem(user) {
        const topPosition = user.position <= 3 ? 'top-position' : '';
        const currentUser = user.isCurrentUser ? 'current-user' : '';

        return `
            <div class="ranking-item ${topPosition} ${currentUser}">
                <div class="ranking-position ${topPosition}">${user.position}</div>
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div>${user.name}</div>
                </div>
                <div class="achievement-points">${user.points}</div>
                <div class="completion-rate">${user.completion}%</div>
            </div>
        `;
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterText = btn.textContent.toLowerCase();
                this.currentFilter = filterText === 'todas' ? 'all' :
                                   filterText === 'desbloqueadas' ? 'unlocked' : 'locked';

                this.renderAchievements();
            });
        });

        // Ranking tabs
        const rankingTabs = document.querySelectorAll('.ranking-tab');
        rankingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                rankingTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabText = tab.textContent.toLowerCase();
                this.currentRankingTab = tabText === 'global' ? 'global' :
                                       tabText === 'amigos' ? 'friends' : 'weekly';

                this.renderRanking();
            });
        });

        // Milestone items click
        document.addEventListener('click', (e) => {
            const milestoneItem = e.target.closest('.milestone-item');
            if (milestoneItem) {
                const milestoneId = milestoneItem.dataset.milestoneId;
                this.showMilestoneDetails(milestoneId);
            }
        });

        // Event listener para abrir o menu de perfil (no clique no avatar)
        const avatar = document.querySelector('header .user-profile .avatar');
        if (avatar) {
            avatar.addEventListener('click', openProfileMenu); // openProfileMenu está em components/menu.js
        }
    }

    showMilestoneDetails(milestoneId) {
        const milestone = this.milestones.find(m => m.id === milestoneId);
        if (!milestone) return;

        this.showNotification(`Detalhes do marco: ${milestone.title}`, 'info');
    }

    // startProgressSimulation() { // Removida ou comentada para MVP com dados reais
    //     setInterval(() => {
    //         this.simulateProgress();
    //     }, 30000); // A cada 30 segundos
    //     setTimeout(() => { this.unlockAchievement('puzzle_solver'); }, 10000);
    //     setTimeout(() => { this.unlockAchievement('derivatives_master'); }, 20000);
    // }

    simulateProgress() {
        // Lógica de simulação de progresso desativada para MVP com backend
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;

        this.userData.coins += achievement.reward;

        this.showAchievementUnlocked(achievement);

        this.renderAchievements();
        this.updateUserStats();
    }

    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-unlock-content">
                <div class="achievement-icon-notification ${achievement.tier}-tier">${achievement.icon}</div>
                <div class="achievement-text">
                    <h3>Conquista Desbloqueada!</h3>
                    <p>${achievement.title}</p>
                    <div class="reward-text">+${achievement.reward} 🪙</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        this.playAchievementSound();
    }

    playAchievementSound() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    // Função de notificação (apenas um fallback se a global showNotification não estiver disponível)
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') { // Usa a função global
            window.showNotification(message, type);
            return;
        }
        // Fallback se global showNotification não existe
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Funções globais para compatibilidade com HTML (se necessário)
// openProfileMenu está em components/menu.js
// closeLoginModal e quickLogin são para o modal de login rápido, que não está mais no conquistas.html

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Cria uma instância global do ConquistasManager
    window.conquistasManager = new ConquistasManager();

    // As funções window.updateAchievementProgress, window.addAchievementPoints,
    // window.simulateUserActivity e o Konami Code continuam a existir,
    // mas agora operam sobre os dados reais carregados pelo ConquistasManager.
    // A simulação de progresso principal (startProgressSimulation) foi desativada,
    // pois o objetivo é o backend.

    console.log('🏆 Sistema de Conquistas MathMaster inicializado!');
});