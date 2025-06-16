// Estado global da aplicação
let gameState = {
    coins: 0,
    dailyProgress: 0,
    timeRemaining: 0,
    currentTheme: 'light',
    user: {
        name: 'Rodrigo',
        streak: 5,
        completedGoals: 2
    },
    achievements: [
        {
            icon: '🏆',
            title: 'Mestre das Derivadas',
            description: 'Completou 10 exercícios sem erros',
            unlocked: true
        },
        {
            icon: '🔥',
            title: 'Sequência de 5 dias',
            description: 'Estudou por 5 dias consecutivos',
            unlocked: false
        },
        {
            icon: '⚡',
            title: 'Velocista',
            description: 'Resolveu 5 problemas em menos de 3 minutos',
            unlocked: true
        }
    ],
    topics: [
        { name: 'Cálculo Integral', progress: 0, symbol: '∫', color: '#42a5f5' },
        { name: 'Trigonometria', progress: 0, symbol: 'π', color: '#7e57c2' },
        { name: 'Álgebra Avançada', progress: 0, symbol: 'x²', color: '#ef5350' },
        { name: 'Estatística Aplicada', progress: 0, symbol: '📊', color: '#66bb6a' }
    ]
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateProgressBars();
    startDailyTimer();
});

// Inicializar aplicação
function initializeApp() {
    console.log('MathMaster iniciado!');
    updateCoins();
    updateDailyProgress();
    loadAchievements();
    loadTopics();
}

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Event listeners para cards de tópicos
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', handleTopicClick);
        card.addEventListener('mouseenter', handleTopicHover);
        card.addEventListener('mouseleave', handleTopicLeave);
    });

    // Event listeners para metas diárias
    document.querySelectorAll('.goal-item').forEach(goal => {
        if (!goal.classList.contains('completed')) {
            goal.addEventListener('click', completeGoal);
        }
    });

    // Event listeners para modal de lição
    document.addEventListener('keydown', handleKeyDown);
}

// Navegação
function handleNavigation(event) {
    event.preventDefault();
    const targetPage = event.target.getAttribute('href');
    
    // Remove active class de todos os links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adiciona active class ao link clicado
    event.target.classList.add('active');
    
    // Simula navegação (em uma aplicação real, seria roteamento)
    showNotification(`Navegando para ${targetPage}`, 'info');
}

// Atualizar moedas
function updateCoins() {
    const coinElement = document.querySelector('.coins span:last-child');
    if (coinElement) {
        coinElement.textContent = gameState.coins;
    }
}

// Adicionar moedas
function addCoins(amount) {
    gameState.coins += amount;
    updateCoins();
    showCoinAnimation(amount);
}

// Animação de moedas
function showCoinAnimation(amount) {
    const coinElement = document.querySelector('.coins');
    const animation = document.createElement('div');
    animation.className = 'coin-float';
    animation.textContent = `+${amount}`;
    animation.style.cssText = `
        position: absolute;
        color: #ffd700;
        font-weight: bold;
        font-size: 18px;
        animation: floatUp 2s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
    `;
    
    coinElement.appendChild(animation);
    
    setTimeout(() => {
        animation.remove();
    }, 2000);
}

// Atualizar progresso diário
function updateDailyProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressInfo = document.querySelectorAll('.progress-info span');
    
    if (progressBar) {
        progressBar.style.width = `${gameState.dailyProgress}%`;
    }
    
    if (progressInfo.length >= 2) {
        progressInfo[0].textContent = `${gameState.dailyProgress}% da meta diária`;
        progressInfo[1].textContent = `${gameState.timeRemaining} minutos restantes`;
    }
}

// Timer diário
function startDailyTimer() {
    setInterval(() => {
        if (gameState.timeRemaining > 0) {
            gameState.timeRemaining--;
            updateDailyProgress();
        }
    }, 60000); // Atualiza a cada minuto
}

// Atualizar barras de progresso dos tópicos
function updateProgressBars() {
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
        const progressBar = card.querySelector('.topic-progress-bar');
        if (progressBar && gameState.topics[index]) {
            progressBar.style.width = `${gameState.topics[index].progress}%`;
        }
    });
}

// Manipular clique em tópicos
function handleTopicClick(event) {
    const card = event.currentTarget;
    const topicTitle = card.querySelector('h3').textContent;
    
    // Adiciona efeito visual
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 150);
    
    // Abre lição se for Cálculo Integral
    if (topicTitle === 'Cálculo Integral') {
        openLesson();
    } else {
        showNotification(`Abrindo ${topicTitle}...`, 'info');
    }
}

// Hover effects para tópicos
function handleTopicHover(event) {
    const card = event.currentTarget;
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
}

function handleTopicLeave(event) {
    const card = event.currentTarget;
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
}

// Completar meta diária
function completeGoal(event) {
    const goalItem = event.currentTarget;
    const rewardText = goalItem.querySelector('.goal-reward').textContent;
    const coinAmount = parseInt(rewardText.match(/\d+/)[0]);
    
    goalItem.classList.add('completed');
    goalItem.querySelector('.goal-checkbox').textContent = '✓';
    
    addCoins(coinAmount);
    gameState.user.completedGoals++;
    
    // Atualiza progresso diário
    gameState.dailyProgress = Math.min(100, gameState.dailyProgress + 10);
    updateDailyProgress();
    
    showNotification('Meta completada! 🎉', 'success');
}

// Abrir lição
function openLesson() {
    const modal = document.getElementById('lessonModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Anima a abertura
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Fechar lição
function closeLesson() {
    const modal = document.getElementById('lessonModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Mostrar resposta correta
function showCorrectAnswer(event) {
    const correctFeedback = document.getElementById('correctFeedback');
    const wrongFeedback = document.getElementById('wrongFeedback');
    const optionBtns = document.querySelectorAll('.option-btn');

    // Destaca a resposta correta
    event.target.classList.add('correct');

    // Desabilita todos os botões
    optionBtns.forEach(btn => {
        btn.disabled = true;
        if (btn !== event.target) {
            btn.classList.add('disabled');
        }
    });

    // Mostra feedback
    if (correctFeedback) correctFeedback.style.display = 'block';
    if (wrongFeedback) wrongFeedback.style.display = 'none';

    // Adiciona moedas
    addCoins(15);

    // Mostra animação de recompensa
    setTimeout(() => {
        showRewardAnimation();
    }, 1000);
}

// Mostrar resposta incorreta
function showWrongAnswer(event) {
    const wrongFeedback = document.getElementById('wrongFeedback');
    const correctFeedback = document.getElementById('correctFeedback');
    
    event.target.classList.add('wrong');
    wrongFeedback.style.display = 'block';
    correctFeedback.style.display = 'none';
    
    setTimeout(() => {
        event.target.classList.remove('wrong');
        wrongFeedback.style.display = 'none';
    }, 3000);
}

// Configurar opções de resposta
function setupAnswerOptions() {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(event) {
            if (index === 2) { // Resposta correta (14)
                showCorrectAnswer(event);
            } else {
                showWrongAnswer(event);
            }
        });
    });
}

// Animação de recompensa
function showRewardAnimation() {
    const rewardAnimation = document.getElementById('rewardAnimation');
    rewardAnimation.style.display = 'flex';
    
    setTimeout(() => {
        rewardAnimation.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        rewardAnimation.classList.remove('show');
        setTimeout(() => {
            rewardAnimation.style.display = 'none';
        }, 300);
    }, 3000);
}

// Manipulação de teclado
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeLesson();
    }
}

// Controles de áudio da lição
function setupAudioControls() {
    const playBtn = document.querySelector('.play-btn');
    const volumeControl = document.querySelector('.volume-control');
    const volumeBar = document.querySelector('.volume-bar');
    const volumeLevel = document.querySelector('.volume-level');
    
    let isPlaying = false;
    let volume = 50;
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            this.textContent = isPlaying ? '⏸' : '▶';
            showNotification(isPlaying ? 'Reproduzindo...' : 'Pausado', 'info');
        });
    }
    
    if (volumeBar) {
        volumeBar.addEventListener('click', function(event) {
            const rect = this.getBoundingClientRect();
            const percent = ((event.clientX - rect.left) / rect.width) * 100;
            volume = Math.max(0, Math.min(100, percent));
            volumeLevel.style.width = `${volume}%`;
        });
    }
}

// Carregamento de conquistas
function loadAchievements() {
    const achievementList = document.querySelector('.achievement-list');
    if (!achievementList) return;
    
    achievementList.innerHTML = '';
    
    gameState.achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement';
        achievementEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        achievementList.appendChild(achievementEl);
    });
}

// Carregamento de tópicos
function loadTopics() {
    const topicsGrid = document.querySelector('.topics-grid');
    if (!topicsGrid) return;
    
    const topicCards = topicsGrid.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
        if (gameState.topics[index]) {
            const topic = gameState.topics[index];
            const progressBar = card.querySelector('.topic-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${topic.progress}%`;
            }
        }
    });
}

// Animações CSS dinâmicas
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-30px); opacity: 0; }
        }
        
        .option-btn.correct {
            background-color: #4caf50 !important;
            color: white !important;
        }
        
        .option-btn.wrong {
            background-color: #f44336 !important;
            color: white !important;
        }
        
        .option-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .lesson-modal.active .modal-content2 {
            transform: scale(1);
            opacity: 1;
        }
        
        .reward-animation.show {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar controles de áudio e estilos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setupAudioControls();
    setupAnswerOptions();
    addAnimationStyles();
});

// Função para salvar progresso (simulado)
function saveProgress() {
    const progressData = {
        coins: gameState.coins,
        dailyProgress: gameState.dailyProgress,
        completedGoals: gameState.user.completedGoals,
        topics: gameState.topics
    };
    
    localStorage.setItem('mathmaster_progress', JSON.stringify(progressData));
    showNotification('Progresso salvo!', 'success');
}

// Função para carregar progresso
function loadProgress() {
    const savedProgress = localStorage.getItem('mathmaster_progress');
    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        gameState.coins = progressData.coins || gameState.coins;
        gameState.dailyProgress = progressData.dailyProgress || gameState.dailyProgress;
        gameState.user.completedGoals = progressData.completedGoals || gameState.user.completedGoals;
        if (progressData.topics) {
            gameState.topics = progressData.topics;
        }
    }
}

// Salvar progresso automaticamente a cada 30 segundos
setInterval(saveProgress, 30000);

// Carregar progresso ao inicializar
document.addEventListener('DOMContentLoaded', loadProgress);

