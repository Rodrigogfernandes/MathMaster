// conquistas.js - Sistema de Conquistas MathMaster

class ConquistasManager {
    constructor() {
        this.userData = this.loadUserData();
        this.achievements = this.initializeAchievements();
        this.milestones = this.initializeMilestones();
        this.ranking = this.initializeRanking();
        this.currentFilter = 'all';
        this.currentRankingTab = 'global';
        
        this.init();
    }

    init() {
        this.updateUserStats();
        this.renderAchievements();
        this.renderMilestones();
        this.renderRanking();
        this.setupEventListeners();
        this.startProgressSimulation();
    }

    loadUserData() {
        // Simula dados do usuário - em produção viria de uma API
        return {
            userId: 'user123',
            name: 'Você',
            avatar: 'R',
            coins: 245,
            totalAchievements: 9,
            unlockedAchievements: 3,
            achievementPoints: 1250,
            daysOnPlatform: 12,
            completionRate: 65,
            studyStreak: 2,
            totalStudyTime: 180, // minutos
            problemsSolved: 47,
            modulesCompleted: 2,
            lastLoginDate: new Date().toISOString().split('T')[0]
        };
    }

    initializeAchievements() {
        return [
            {
                id: 'derivatives_master',
                title: 'Mestre das Derivadas',
                description: 'Complete 10 exercícios de cálculo diferencial sem erros.',
                icon: '🔢',
                tier: 'gold',
                reward: 50,
                progress: 7,
                maxProgress: 10,
                unlocked: false,
                category: 'calculus'
            },
            {
                id: 'fire_streak',
                title: 'Sequência de Fogo',
                description: 'Estude matemática por 5 dias consecutivos.',
                icon: '🔥',
                tier: 'silver',
                reward: 30,
                progress: 2,
                maxProgress: 5,
                unlocked: false,
                category: 'habit'
            },
            {
                id: 'math_speedster',
                title: 'Velocista Matemático',
                description: 'Resolva 5 problemas em menos de 3 minutos.',
                icon: '⚡',
                tier: 'gold',
                reward: 40,
                progress: 1,
                maxProgress: 5,
                unlocked: false,
                category: 'speed'
            },
            {
                id: 'trigonometry_master',
                title: 'Mestre da Trigonometria',
                description: 'Complete 5 lições de trigonometria.',
                icon: 'π',
                tier: 'bronze',
                reward: 20,
                progress: 5,
                maxProgress: 5,
                unlocked: true,
                category: 'trigonometry'
            },
            {
                id: 'integrator',
                title: 'Integrador',
                description: 'Resolva 15 problemas de cálculo integral.',
                icon: '∫',
                tier: 'silver',
                reward: 35,
                progress: 9,
                maxProgress: 15,
                unlocked: false,
                category: 'calculus'
            },
            {
                id: 'statistics_master',
                title: 'Estatístico Mestre',
                description: 'Complete todas as lições do módulo de estatística.',
                icon: '📊',
                tier: 'platinum',
                reward: 100,
                progress: 3,
                maxProgress: 20,
                unlocked: false,
                locked: true,
                category: 'statistics'
            },
            {
                id: 'puzzle_solver',
                title: 'Solucionador de Quebra-Cabeças',
                description: 'Resolva 5 problemas lógico-matemáticos.',
                icon: '🧩',
                tier: 'bronze',
                reward: 15,
                progress: 4,
                maxProgress: 5,
                unlocked: false,
                category: 'logic'
            },
            {
                id: 'dedicated_student',
                title: 'Estudante Dedicado',
                description: 'Complete 3 horas de estudo em um único dia.',
                icon: '📚',
                tier: 'bronze',
                reward: 25,
                progress: 3,
                maxProgress: 3,
                unlocked: true,
                category: 'habit'
            },
            {
                id: 'geometric_explorer',
                title: 'Explorador Geométrico',
                description: 'Resolva 20 problemas de geometria analítica.',
                icon: '🌐',
                tier: 'gold',
                reward: 45,
                progress: 5,
                maxProgress: 20,
                unlocked: false,
                locked: true,
                category: 'geometry'
            }
        ];
    }

    initializeMilestones() {
        return [
            {
                id: 'first_steps',
                title: 'Primeiros Passos',
                description: 'Você completou seu primeiro módulo de matemática!',
                date: '2024-03-10',
                status: 'completed',
                badges: ['🔢', 'π']
            },
            {
                id: 'overcoming_challenges',
                title: 'Superando Desafios',
                description: 'Você resolveu 50 exercícios em uma semana!',
                date: '2024-03-15',
                status: 'completed',
                badges: ['⚡', '🔥', '📚']
            },
            {
                id: 'advanced_calculus',
                title: 'Cálculo Avançado',
                description: 'Complete o módulo de cálculo diferencial e integral.',
                date: '2024-03-18',
                status: 'in_progress',
                badges: ['∫', '📊']
            },
            {
                id: 'statistics_probability',
                title: 'Estatística e Probabilidade',
                description: 'Domine os conceitos de estatística descritiva e probabilidade.',
                date: '2024-03-25',
                status: 'future',
                badges: ['📊', '🎲']
            }
        ];
    }

    initializeRanking() {
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
        const completionRate = Math.round((unlockedCount / this.achievements.length) * 100);
        const totalPoints = this.achievements
            .filter(a => a.unlocked)
            .reduce((sum, a) => sum + a.reward, 0);

        // Atualizar stats na interface
        const statCards = document.querySelectorAll('.stat-card .stat-value');
        if (statCards.length >= 4) {
            statCards[0].textContent = unlockedCount;
            statCards[1].textContent = `${completionRate}%`;
            statCards[2].textContent = totalPoints;
            statCards[3].textContent = this.userData.daysOnPlatform;
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

        // Adicionar event listeners para os cards
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
        const progressPercentage = Math.round((achievement.progress / achievement.maxProgress) * 100);
        const isCompleted = achievement.progress >= achievement.maxProgress;
        const isLocked = achievement.locked || false;

        return `
            <div class="achievement-card ${isLocked ? 'locked' : ''}" data-achievement-id="${achievement.id}">
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
        
        // Animate modal in
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

        // Add close functionality
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

        // Manter a linha do timeline
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
    }

    showMilestoneDetails(milestoneId) {
        const milestone = this.milestones.find(m => m.id === milestoneId);
        if (!milestone) return;

        // Criar modal de detalhes do marco
        this.showNotification(`Detalhes do marco: ${milestone.title}`, 'info');
    }

    startProgressSimulation() {
        // Simular progresso em tempo real
        setInterval(() => {
            this.simulateProgress();
        }, 30000); // A cada 30 segundos

        // Simular conquistas sendo desbloqueadas
        setTimeout(() => {
            this.unlockAchievement('puzzle_solver');
        }, 10000);

        setTimeout(() => {
            this.unlockAchievement('derivatives_master');
        }, 20000);
    }

    simulateProgress() {
        // Simular pequenos aumentos de progresso
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && !achievement.locked && achievement.progress < achievement.maxProgress) {
                if (Math.random() < 0.1) { // 10% de chance
                    achievement.progress = Math.min(achievement.progress + 1, achievement.maxProgress);
                    
                    // Verificar se a conquista foi completada
                    if (achievement.progress >= achievement.maxProgress) {
                        this.unlockAchievement(achievement.id);
                    }
                }
            }
        });

        this.renderAchievements();
        this.updateUserStats();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;
        
        // Adicionar moedas ao usuário
        this.userData.coins += achievement.reward;
        
        // Mostrar notificação de conquista desbloqueada
        this.showAchievementUnlocked(achievement);
        
        // Atualizar interface
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

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Adicionar som de conquista (opcional)
        this.playAchievementSound();
    }

    playAchievementSound() {
        // Criar um som simples usando Web Audio API
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

    showNotification(message, type = 'info') {
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

// Funções globais para compatibilidade com HTML
function openProfileMenu() {
    console.log('Abrindo menu do perfil...');
    // Implementar menu do perfil
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function quickLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Simular login
    console.log('Fazendo login com:', email);
    closeLoginModal();
    
    // Mostrar notificação de sucesso
    if (window.conquistasManager) {
        window.conquistasManager.showNotification('Login realizado com sucesso!', 'success');
    }
}

// CSS adicional para as funcionalidades JavaScript
const additionalCSS = `
/* Estilos para modal de conquista */
.achievement-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.achievement-modal.active {
    opacity: 1;
}

.achievement-modal .modal-content {
    background: var(--card-background, #fff);
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.achievement-modal.active .modal-content {
    transform: scale(1);
}

.achievement-modal .modal-header {
    text-align: center;
    margin-bottom: 1.5rem;
    position: relative;
}

.achievement-icon-large {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.achievement-modal .close-modal {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f0f0f0;
}

.achievement-modal .close-modal:hover {
    background: #e0e0e0;
}

.achievement-details {
    margin: 1.5rem 0;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.detail-label {
    font-weight: 600;
    color: #555;
}

.detail-value {
    font-weight: 500;
}

.progress-section {
    margin: 1.5rem 0;
}

.achievement-status {
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
}

.achievement-status.unlocked {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    color: #155724;
    border: 1px solid #c3e6cb;
}

.tips-section {
    margin-top: 1.5rem;
}

.tips-section h4 {
    margin-bottom: 1rem;
    color: #333;
}

.tips-section ul {
    list-style: none;
    padding: 0;
}

.tips-section li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
}

.tips-section li:before {
    content: "💡";
    position: absolute;
    left: 0;
    top: 0.5rem;
}

/* Notificação de conquista desbloqueada */
.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 1001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 350px;
    backdrop-filter: blur(10px);
}

.achievement-notification.show {
    transform: translateX(0);
}

.achievement-unlock-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.achievement-icon-notification {
    font-size: 2.5rem;
    flex-shrink: 0;
}

.achievement-text h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.achievement-text p {
    margin: 0 0 0.5rem 0;
    opacity: 0.9;
}

.reward-text {
    font-weight: 600;
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Notificações gerais */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    background: linear-gradient(135deg, #28a745, #20c997);
}

.notification.info {
    background: linear-gradient(135deg, #007bff, #6f42c1);
}

.notification.warning {
    background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.notification.error {
    background: linear-gradient(135deg, #dc3545, #e83e8c);
}

/* Animações para cards de conquista */
.achievement-card {
    cursor: pointer;
    transition: all 0.3s ease;
}

.achievement-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.achievement-card.locked:hover {
    transform: none;
}

/* Efeitos de tier */
.gold-tier {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #b8860b;
    animation: goldGlow 2s ease-in-out infinite alternate;
}

.silver-tier {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
    color: #696969;
    animation: silverGlow 2s ease-in-out infinite alternate;
}

.bronze-tier {
    background: linear-gradient(135deg, #cd7f32, #daa520);
    color: #8b4513;
    animation: bronzeGlow 2s ease-in-out infinite alternate;
}

.platinum-tier {
    background: linear-gradient(135deg, #e5e4e2, #ffffff);
    color: #71797e;
    animation: platinumGlow 2s ease-in-out infinite alternate;
}

@keyframes goldGlow {
    0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
    100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.8); }
}

@keyframes silverGlow {
    0% { box-shadow: 0 0 5px rgba(192, 192, 192, 0.5); }
    100% { box-shadow: 0 0 15px rgba(192, 192, 192, 0.8); }
}

@keyframes bronzeGlow {
    0% { box-shadow: 0 0 5px rgba(205, 127, 50, 0.5); }
    100% { box-shadow: 0 0 15px rgba(205, 127, 50, 0.8); }
}

@keyframes platinumGlow {
    0% { box-shadow: 0 0 5px rgba(229, 228, 226, 0.5); }
    100% { box-shadow: 0 0 15px rgba(229, 228, 226, 0.8); }
}

/* Responsividade */
@media (max-width: 768px) {
    .achievement-modal .modal-content {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .achievement-notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .achievement-unlock-content {
        flex-direction: column;
        text-align: center;
    }
}

/* Estilos para milestone interativo */
.milestone-item {
    cursor: pointer;
    transition: all 0.3s ease;
}

.milestone-item:hover {
    transform: translateY(-2px);
}

.milestone-item:hover .milestone-content {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 1rem;
    margin: -1rem;
}

/* Loading states */
.loading {
    opacity: 0.6;
    pointer-events: none;
}

.progress-bar {
    transition: width 0.5s ease;
}

/* Badges animados */
.badge-item {
    transition: all 0.3s ease;
}

.badge-item:hover {
    transform: scale(1.1);
}

.badge-item.locked {
    filter: grayscale(100%);
    opacity: 0.5;
}

/* Ranking highlights */
.ranking-item.current-user {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-left: 4px solid #667eea;
}

.ranking-position.top-position {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #b8860b;
    font-weight: bold;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Filtros ativos */
.filter-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ranking-tab.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
`;

// Adicionar CSS ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.conquistasManager = new ConquistasManager();
    
    // Exemplo de como integrar com outras partes do sistema
    window.updateAchievementProgress = (achievementId, progress) => {
        if (window.conquistasManager) {
            const achievement = window.conquistasManager.achievements.find(a => a.id === achievementId);
            if (achievement) {
                achievement.progress = Math.min(progress, achievement.maxProgress);
                if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
                    window.conquistasManager.unlockAchievement(achievementId);
                } else {
                    window.conquistasManager.renderAchievements();
                    window.conquistasManager.updateUserStats();
                }
            }
        }
    };
    
    // Função para adicionar XP/pontos de conquista
    window.addAchievementPoints = (points) => {
        if (window.conquistasManager) {
            window.conquistasManager.userData.coins += points;
            window.conquistasManager.updateUserStats();
            window.conquistasManager.showNotification(`+${points} moedas ganhas!`, 'success');
        }
    };
    
    // Função para simular atividade do usuário (para testes)
    window.simulateUserActivity = () => {
        if (window.conquistasManager) {
            // Simular resolução de problema
            window.updateAchievementProgress('derivatives_master', 8);
            window.updateAchievementProgress('fire_streak', 3);
            window.updateAchievementProgress('math_speedster', 2);
            window.updateAchievementProgress('integrator', 12);
            
            window.conquistasManager.showNotification('Atividade simulada!', 'info');
        }
    };
    
    // Easter egg: Konami Code para desbloquear conquista especial
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            if (window.conquistasManager) {
                // Adicionar conquista especial
                const easterEggAchievement = {
                    id: 'konami_master',
                    title: 'Mestre dos Códigos',
                    description: 'Descobriu o código secreto! 🎮',
                    icon: '🎮',
                    tier: 'platinum',
                    reward: 500,
                    progress: 1,
                    maxProgress: 1,
                    unlocked: false,
                    category: 'special'
                };
                
                window.conquistasManager.achievements.push(easterEggAchievement);
                window.conquistasManager.unlockAchievement('konami_master');
                window.conquistasManager.showNotification('Código Konami ativado! 🎮', 'success');
            }
            konamiCode = [];
        }
    });
    
    console.log('🏆 Sistema de Conquistas MathMaster inicializado!');
    console.log('💡 Dica: Experimente digitar o código Konami (↑↑↓↓←→←→BA) para uma surpresa!');
    console.log('🔧 Use window.simulateUserActivity() para testar o sistema');
});

  
