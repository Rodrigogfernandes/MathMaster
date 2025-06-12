// JavaScript básico para funcionalidade dos botões de filtro
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // Lógica de filtro real seria implementada aqui
            });
        });

        // JavaScript para funcionalidade das abas de ranking
        document.querySelectorAll('.ranking-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.ranking-tab').forEach(t => {
                    t.classList.remove('active');
                });
                tab.classList.add('active');

                // Lógica de troca de dados de ranking seria implementada aqui
            });
        });

        // Dados simulados para uso nas funcionalidades
const achievementData = {
    all: [
        {
            id: 1,
            title: "Mestre das Derivadas",
            icon: "🔢",
            tier: "gold-tier",
            tierName: "Ouro",
            description: "Complete 10 exercícios de cálculo diferencial sem erros.",
            current: 10,
            total: 10,
            reward: 50,
            locked: false
        },
        {
            id: 2,
            title: "Sequência de Fogo",
            icon: "🔥",
            tier: "silver-tier",
            tierName: "Prata",
            description: "Estude matemática por 5 dias consecutivos.",
            current: 5,
            total: 5,
            reward: 30,
            locked: false
        },
        {
            id: 3,
            title: "Velocista Matemático",
            icon: "⚡",
            tier: "gold-tier",
            tierName: "Ouro",
            description: "Resolva 5 problemas em menos de 3 minutos.",
            current: 5,
            total: 5,
            reward: 40,
            locked: false
        },
        {
            id: 4,
            title: "Mestre da Trigonometria",
            icon: "π",
            tier: "bronze-tier",
            tierName: "Bronze",
            description: "Complete 5 lições de trigonometria.",
            current: 5,
            total: 5,
            reward: 20,
            locked: false
        },
        {
            id: 5,
            title: "Integrador",
            icon: "∫",
            tier: "silver-tier",
            tierName: "Prata",
            description: "Resolva 15 problemas de cálculo integral.",
            current: 9,
            total: 15,
            reward: 35,
            locked: false
        },
        {
            id: 6,
            title: "Estatístico Mestre",
            icon: "📊",
            tier: "platinum-tier",
            tierName: "Platina",
            description: "Complete todas as lições do módulo de estatística.",
            current: 3,
            total: 20,
            reward: 100,
            locked: true
        },
        {
            id: 7,
            title: "Solucionador de Quebra-Cabeças",
            icon: "🧩",
            tier: "bronze-tier",
            tierName: "Bronze",
            description: "Resolva 5 problemas lógico-matemáticos.",
            current: 4,
            total: 5,
            reward: 15,
            locked: false
        },
        {
            id: 8,
            title: "Estudante Dedicado",
            icon: "📚",
            tier: "bronze-tier",
            tierName: "Bronze",
            description: "Complete 3 horas de estudo em um único dia.",
            current: 3,
            total: 3,
            reward: 25,
            locked: false
        },
        {
            id: 9,
            title: "Explorador Geométrico",
            icon: "🌐",
            tier: "gold-tier",
            tierName: "Ouro",
            description: "Resolva 20 problemas de geometria analítica.",
            current: 5,
            total: 20,
            reward: 45,
            locked: true
        }
    ]
};

const rankingData = {
    global: [
        { position: 1, avatar: "M", name: "MathWizard", points: 2450, completion: 95 },
        { position: 2, avatar: "C", name: "CalcMaster", points: 2180, completion: 88 },
        { position: 3, avatar: "P", name: "ProblemSolver", points: 1920, completion: 82 },
        { position: 7, avatar: "A", name: "Você", points: 1250, completion: 65, currentUser: true },
        { position: 8, avatar: "G", name: "GeoGenius", points: 1180, completion: 60 },
        { position: 9, avatar: "T", name: "TrigonometryTitan", points: 1050, completion: 55 },
        { position: 10, avatar: "S", name: "StatStudent", points: 980, completion: 52 }
    ],
    friends: [
        { position: 1, avatar: "A", name: "Você", points: 1250, completion: 65, currentUser: true },
        { position: 2, avatar: "J", name: "JuliaFriend", points: 1120, completion: 58 },
        { position: 3, avatar: "B", name: "BrunoMath", points: 980, completion: 50 },
        { position: 4, avatar: "L", name: "LucasCoding", points: 920, completion: 48 },
        { position: 5, avatar: "F", name: "FernandaStats", points: 880, completion: 45 }
    ],
    weekly: [
        { position: 1, avatar: "T", name: "TrigonometryTitan", points: 350, completion: 15 },
        { position: 2, avatar: "M", name: "MathWizard", points: 320, completion: 12 },
        { position: 3, avatar: "A", name: "Você", points: 290, completion: 10, currentUser: true },
        { position: 4, avatar: "C", name: "CalcMaster", points: 280, completion: 9 },
        { position: 5, avatar: "S", name: "StatStudent", points: 240, completion: 8 }
    ]
};

const milestoneData = [
    {
        date: { day: "10", month: "Mar" },
        title: "Primeiros Passos",
        status: "Concluído",
        description: "Você completou seu primeiro módulo de matemática!",
        badges: [
            { icon: "🔢", locked: false },
            { icon: "π", locked: false }
        ]
    },
    {
        date: { day: "15", month: "Mar" },
        title: "Superando Desafios",
        status: "Concluído",
        description: "Você resolveu 50 exercícios em uma semana!",
        badges: [
            { icon: "⚡", locked: false },
            { icon: "🔥", locked: false },
            { icon: "📚", locked: false }
        ]
    },
    {
        date: { day: "18", month: "Mar" },
        title: "Cálculo Avançado",
        status: "Em Progresso",
        description: "Complete o módulo de cálculo diferencial e integral.",
        badges: [
            { icon: "∫", locked: false },
            { icon: "📊", locked: true }
        ]
    },
    {
        date: { day: "25", month: "Mar", future: true },
        title: "Estatística e Probabilidade",
        status: "Futuro",
        description: "Domine os conceitos de estatística descritiva e probabilidade.",
        badges: [
            { icon: "📊", locked: true },
            { icon: "🎲", locked: true }
        ]
    }
];

// Função para criar elemento de conquista
function createAchievementCard(achievement) {
    const progress = Math.floor((achievement.current / achievement.total) * 100);
    const isComplete = achievement.current >= achievement.total;
    
    return `
        <div class="achievement-card ${achievement.locked ? 'locked' : ''}">
            ${achievement.locked ? '<div class="locked-overlay"><span>🔒</span><span>Bloqueado</span></div>' : ''}
            <div class="achievement-header">
                <div class="achievement-icon ${achievement.tier}">${achievement.icon}</div>
                <div class="achievement-title">
                    <h3>${achievement.title}</h3>
                    <span class="achievement-tier">${achievement.tierName}</span>
                </div>
            </div>
            <div class="achievement-content">
                <div class="achievement-description">
                    ${achievement.description}
                </div>
                <div class="achievement-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>Progresso: ${achievement.current}/${achievement.total}</span>
                        <span>${isComplete ? 'Completo!' : progress + '%'}</span>
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

// Função para renderizar a lista de conquistas com base no filtro
function renderAchievements(filter = 'all') {
    const achievementsGrid = document.querySelector('.achievements-grid');
    let filteredAchievements;
    
    switch(filter) {
        case 'unlocked':
            filteredAchievements = achievementData.all.filter(a => !a.locked);
            break;
        case 'locked':
            filteredAchievements = achievementData.all.filter(a => a.locked);
            break;
        default:
            filteredAchievements = achievementData.all;
    }
    
    achievementsGrid.innerHTML = '';
    filteredAchievements.forEach(achievement => {
        achievementsGrid.innerHTML += createAchievementCard(achievement);
    });
}

// Função para renderizar o ranking com base na categoria selecionada
function renderRanking(category = 'global') {
    const rankingList = document.querySelector('.ranking-list');
    const data = rankingData[category];
    
    let html = `
        <div class="ranking-item ranking-header">
            <div>Rank</div>
            <div>Usuário</div>
            <div>Pontos</div>
            <div class="completion-header">Conclusão</div>
        </div>
    `;
    
    data.forEach(user => {
        html += `
            <div class="ranking-item ${user.currentUser ? 'current-user' : ''}">
                <div class="ranking-position ${user.position <= 3 ? 'top-position' : ''}">${user.position}</div>
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div>${user.name}</div>
                </div>
                <div class="achievement-points">${user.points}</div>
                <div class="completion-rate">${user.completion}%</div>
            </div>
        `;
    });
    
    rankingList.innerHTML = html;
}

// Função para mostrar detalhes de milestone ao clicar
function setupMilestoneInteractions() {
    const milestoneItems = document.querySelectorAll('.milestone-item');
    
    milestoneItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const milestone = milestoneData[index];
            
            // Criar e mostrar modal com detalhes expandidos
            showMilestoneModal(milestone);
        });
    });
}

// Função para exibir modal de detalhes do marco de progresso
function showMilestoneModal(milestone) {
    // Remover modal anterior se existir
    const oldModal = document.querySelector('.milestone-modal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Criar o elemento modal
    const modal = document.createElement('div');
    modal.className = 'milestone-modal';
    
    // Estilo para o modal
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'var(--white)';
    modal.style.padding = '30px';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    modal.style.zIndex = '100';
    modal.style.maxWidth = '600px';
    modal.style.width = '90%';
    
    // Criar overlay de fundo
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '99';
    
    let badgesHtml = '';
    milestone.badges.forEach(badge => {
        badgesHtml += `
            <div class="badge-item ${badge.locked ? 'locked' : ''}" 
                 style="width: 50px; height: 50px; font-size: 24px;">
                ${badge.icon}
            </div>
        `;
    });
    
    // Conteúdo do modal
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <h2 style="color: var(--primary); font-size: 24px;">${milestone.title}</h2>
            <span class="close-modal" style="cursor: pointer; font-size: 24px;">×</span>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
            <div style="background-color: ${milestone.date.future ? 'var(--light-bg)' : 'var(--primary)'}; 
                        color: ${milestone.date.future ? '#999' : 'var(--white)'};
                        border-radius: 50%; width: 60px; height: 60px; 
                        display: flex; flex-direction: column; align-items: center; 
                        justify-content: center; font-weight: bold;">
                <span>${milestone.date.day}</span>
                <span>${milestone.date.month}</span>
            </div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">Status: 
                    <span style="background-color: var(--accent); padding: 3px 8px; 
                           border-radius: 15px; color: var(--primary); font-size: 12px;">
                        ${milestone.status}
                    </span>
                </div>
                <p style="margin-bottom: 15px;">${milestone.description}</p>
            </div>
        </div>
        <div>
            <h3 style="margin-bottom: 10px; color: var(--primary);">Conquistas Relacionadas</h3>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                ${badgesHtml}
            </div>
        </div>
        <div style="margin-top: 20px; text-align: right;">
            <button class="close-button" style="background-color: var(--primary); color: var(--white); 
                    border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer;">
                Fechar
            </button>
        </div>
    `;
    
    // Adicionar modal e overlay ao corpo da página
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // Configurar eventos para fechar o modal
    const closeModal = () => {
        modal.remove();
        overlay.remove();
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-button').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

// Função para atualizar estatísticas do usuário
function updateUserStats(data) {
    document.querySelector('.stat-value:nth-child(1)').textContent = data.unlockedAchievements;
    document.querySelector('.stat-value:nth-child(3)').textContent = data.completionRate + '%';
    document.querySelector('.stat-value:nth-child(5)').textContent = data.achievementPoints;
    document.querySelector('.stat-value:nth-child(7)').textContent = data.daysActive;
    
    // Atualizar moedas no cabeçalho
    document.querySelector('.coins span:nth-child(2)').textContent = data.coins;
}

// Função para simular progresso em tempo real para conquistas em andamento
function simulateProgress() {
    // Selecionar uma conquista não completa aleatoriamente
    const incompletedAchievements = achievementData.all.filter(a => !a.locked && a.current < a.total);
    
    if (incompletedAchievements.length > 0) {
        const randomIndex = Math.floor(Math.random() * incompletedAchievements.length);
        const achievement = incompletedAchievements[randomIndex];
        
        // Incrementar progresso
        if (achievement.current < achievement.total) {
            achievement.current += 1;
            
            // Atualizar interface
            renderAchievements(document.querySelector('.filter-btn.active').textContent.toLowerCase());
            
            // Se completou, atualizar estatísticas
            if (achievement.current === achievement.total) {
                const userStatsData = {
                    unlockedAchievements: parseInt(document.querySelector('.stat-value:nth-child(1)').textContent) + 1,
                    completionRate: Math.floor((parseInt(document.querySelector('.stat-value:nth-child(1)').textContent) + 1) / achievementData.all.length * 100),
                    achievementPoints: parseInt(document.querySelector('.stat-value:nth-child(5)').textContent) + achievement.reward,
                    daysActive: parseInt(document.querySelector('.stat-value:nth-child(7)').textContent),
                    coins: parseInt(document.querySelector('.coins span:nth-child(2)').textContent) + achievement.reward
                };
                
                updateUserStats(userStatsData);
                
                // Mostrar notificação de conclusão
                showAchievementNotification(achievement);
            }
        }
    }
}

// Função para mostrar notificação de conquista concluída
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    
    // Estilo para a notificação
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary)';
    notification.style.color = 'var(--white)';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '15px';
    notification.style.zIndex = '999';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    notification.innerHTML = `
        <div style="background-color: var(--accent); color: var(--primary); width: 40px; 
                    height: 40px; border-radius: 50%; display: flex; align-items: center; 
                    justify-content: center; font-size: 20px;">
            ${achievement.icon}
        </div>
        <div>
            <h4 style="margin-bottom: 5px;">Conquista Desbloqueada!</h4>
            <p>${achievement.title}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remover após alguns segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Inicialização do script quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar filtros de conquistas
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Aplicar filtro com base no texto do botão
            const filter = button.textContent.toLowerCase();
            renderAchievements(filter === 'todas' ? 'all' : filter === 'desbloqueadas' ? 'unlocked' : 'locked');
        });
    });
    
    // Inicializar abas de ranking
    document.querySelectorAll('.ranking-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ranking-tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            // Atualizar dados do ranking com base na aba selecionada
            const category = tab.textContent.toLowerCase();
            renderRanking(category === 'global' ? 'global' : category === 'amigos' ? 'friends' : 'weekly');
        });
    });
    
    // Configurar interações de marcos de progresso
    setupMilestoneInteractions();
    
    // Inicializar dados
    renderAchievements('all');
    renderRanking('global');
    
    // Estatísticas iniciais do usuário
    const initialUserStats = {
        unlockedAchievements: 27,
        completionRate: 65,
        achievementPoints: 1250,
        daysActive: 12,
        coins: 350
    };
    updateUserStats(initialUserStats);
    
    // Adicionar interação ao avatar do usuário
    document.querySelector('.avatar').addEventListener('click', () => {
        openProfileMenu();
    });
    
    // Simular progresso aleatório em conquistas a cada 30 segundos
    setInterval(simulateProgress, 30000);
});

// Função para habilitar o modo de tema escuro/claro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        // Aplicar variáveis de estilo do tema escuro
        document.documentElement.style.setProperty('--light-bg', '#1f2937');
        document.documentElement.style.setProperty('--white', '#374151');
        document.documentElement.style.setProperty('--text', '#e5e7eb');
        document.documentElement.style.setProperty('--primary', '#60a5fa');
    } else {
        // Restaurar variáveis do tema claro
        document.documentElement.style.setProperty('--light-bg', '#f5f7fa');
        document.documentElement.style.setProperty('--white', '#ffffff');
        document.documentElement.style.setProperty('--text', '#333333');
        document.documentElement.style.setProperty('--primary', '#4a6fa5');
    }
}

function openProfileMenu() {
    // Simular abertura de menu de perfil
    const hasLoginPage = true; // Definir como true se a página de login existir
    
    if (hasLoginPage) {
        // Redirecionar para a página de login
        window.location.href = 'login.html';
    } else {
        alert('Menu de perfil (em desenvolvimento)');
    }
}

