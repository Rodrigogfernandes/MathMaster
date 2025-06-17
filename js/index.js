// Estado global da aplicação (dados iniciais mockados serão substituídos pelo backend)
let gameState = {
    coins: 0,
    dailyProgress: 0, // Mockado, pois o backend não tem essa lógica ainda
    timeRemaining: 0, // Mockado
    currentTheme: 'light',
    user: {
        name: 'Convidado', // Será substituído pelo nome do usuário do backend
        id: null,
        streak: 0, // Mockado
        completedGoals: 0 // Mockado
    },
    achievements: [], // Virão do backend
    topics: [] // Virão do backend (Subjects)
};

// Instância do sistema de notificações (garante que esteja disponível)
// Certifique-se que notifications.js é carregado antes deste script.
// A linha 'const notifications = new NotificationSystem();' já está no notifications.js.
// Podemos usar window.showNotification diretamente ou acessar window.notifications.
// Se window.notifications já existe, não precisa criar de novo aqui.
// Para evitar duplicidade, vamos assumir que showNotification está disponível globalmente.
// const notifications = new NotificationSystem(); // Remova esta linha se já está em notifications.js

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    // updateProgressBars(); // Desativar por enquanto, pois os tópicos virão do backend
    // startDailyTimer();    // Desativar por enquanto, pois é lógica de progresso
});

// Inicializar aplicação
async function initializeApp() {
    console.log('MathMaster iniciado! Carregando dados do backend...');
    await loadUserDataFromBackend(); // Carrega usuário logado
    await loadSubjectsAndContents(); // Carrega módulos/matérias e seus conteúdos
    await loadAchievements(); // Carrega conquistas
    updateCoins(); // Atualiza moedas no header (que virão do backend)
    // As outras funções (progresso diário, metas) serão implementadas em etapas futuras.
}

// Função para carregar dados do usuário logado do backend
async function loadUserDataFromBackend() {
    try {
        const userResponse = await window.MathMasterAPI.User.getCurrentUser(); // Chama o endpoint /api/users/me
        console.log('Resposta do backend para getCurrentUser:', userResponse); // Mantido para depuração

        if (userResponse && userResponse.id) {
            gameState.user.name = userResponse.name;
            gameState.user.id = userResponse.id;
            // O backend ainda não tem o campo 'coins' na entidade User.
            // Vamos mockar um valor inicial ou pegar do local storage se o Rodrigo já tiver.
            // Para o MVP, vamos assumir 0 ou que o userResponse.coins virá se o backend tiver.
            gameState.coins = userResponse.coins || 0; // Se backend retornar coins, usa, senão 0.

            // Atualiza o nome de usuário na mensagem de boas-vindas
            const welcomeMessageHeading = document.getElementById('welcomeMessageHeading'); // Usando o novo ID
            if (welcomeMessageHeading) {
                welcomeMessageHeading.textContent = `Bem-vindo de volta, ${gameState.user.name.split(' ')[0]}!`; // Pega só o primeiro nome
            } else {
                console.warn('Elemento H1 com ID "welcomeMessageHeading" não encontrado!');
            }

            // Atualiza o avatar no header
            const avatarElement = document.querySelector('header .user-profile .avatar');
            if (avatarElement) {
                avatarElement.textContent = gameState.user.name.charAt(0).toUpperCase();
            } else {
                console.warn('Elemento ".user-profile .avatar" não encontrado no DOM!');
            }
        } else {
            console.warn('Nenhum usuário logado ou resposta inválida. Redirecionando para login.');
            window.location.href = 'login.html'; // Redireciona para login
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário logado:', error);
        // Usando a função global showNotification
        if (typeof showNotification === 'function') {
            showNotification('Não foi possível carregar seu perfil. Tente novamente.', 'error');
        } else {
            console.error('showNotification não está definida.');
        }

        // Se der erro de autenticação (ex: token expirado), redireciona para login
        if (error.status === 401 || error.status === 403) {
             window.location.href = 'login.html';
        }
    }
}

// Função para carregar matérias (Subjects) e seus conteúdos do backend
async function loadSubjectsAndContents() {
    try {
        const subjects = await window.MathMasterAPI.Modules.getAllSubjects(); // GET /api/modules
        console.log('Matérias recebidas do backend:', subjects); // Mantido para depuração

        gameState.topics = subjects.map(subject => ({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            symbol: getSubjectSymbol(subject.name), // Função auxiliar para ícones
            progress: 0, // Mockado por enquanto, pois o backend não tem essa lógica ainda para o Subject
            color: getSubjectColor(subject.name) // Função auxiliar para cores
        }));
        renderTopicsGrid(); // Renderiza os cards de tópicos/matérias
    } catch (error) {
        console.error('Erro ao carregar matérias:', error);
        if (typeof showNotification === 'function') {
            showNotification('Não foi possível carregar os módulos de estudo.', 'error');
        } else {
            console.error('showNotification não está definida.');
        }
    }
}

// Função para carregar conquistas do backend
async function loadAchievements() {
    try {
        const achievements = await window.MathMasterAPI.Achievements.getAllAchievements(); // GET /api/achievements
        console.log('Conquistas recebidas do backend:', achievements); // Mantido para depuração

        gameState.achievements = achievements.map(ach => ({
            // Importante: a entidade Achievement não tem campo 'icon' no backend.
            // Para o MVP, vamos usar um ícone genérico ou mapear com base no título.
            icon: '🏆', // Ícone genérico
            title: ach.title,
            description: ach.description,
            unlocked: false // No MVP, assumimos que todas vêm como bloqueadas. A lógica de desbloqueio virá depois.
        }));
        renderAchievementsList(); // Renderiza a lista de conquistas
    } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        if (typeof showNotification === 'function') {
            showNotification('Não foi possível carregar as conquistas.', 'error');
        } else {
            console.error('showNotification não está definida.');
        }
    }
}


// Funções existentes (com pequenos ajustes para usar gameState.topics/achievements)

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Event listeners para metas diárias (ainda mockados)
    document.querySelectorAll('.goal-item').forEach(goal => {
        if (!goal.classList.contains('completed')) {
            goal.addEventListener('click', completeGoal);
        }
    });

    // Event listeners para modal de lição (se houver na página)
    document.addEventListener('keydown', handleKeyDown);
}

// Navegação (mantida, pois é para navegação do frontend)
function handleNavigation(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    const targetPage = event.target.getAttribute('href');

    // Remove active class de todos os links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Adiciona active class ao link clicado
    event.target.classList.add('active');

    window.location.href = targetPage; // Redireciona de fato
}

// Atualizar moedas
function updateCoins() {
    const userCoinsDisplay = document.getElementById('userCoinsDisplay'); // Usando o novo ID
    if (userCoinsDisplay) {
        userCoinsDisplay.textContent = gameState.coins;
    }
}

// Adicionar moedas (simulado, pois não temos XP/Moedas no backend User ainda)
function addCoins(amount) {
    gameState.coins += amount;
    updateCoins();
    showCoinAnimation(amount);
}

// Animação de moedas (simulado)
function showCoinAnimation(amount) {
    const coinsContainer = document.querySelector('.coins');
    if (!coinsContainer) return;

    const animation = document.createElement('div');
    animation.className = 'coin-float';
    animation.textContent = `+${amount}`;

    // Posiciona a animação perto do elemento de moedas
    const rect = coinsContainer.getBoundingClientRect();
    animation.style.left = `${rect.left + rect.width / 2}px`;
    animation.style.top = `${rect.top + window.scrollY}px`;

    document.body.appendChild(animation);

    setTimeout(() => {
        animation.remove();
    }, 2000); // Duração da animação
}

// Atualizar progresso diário (ainda mockado)
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

// Timer diário (ainda mockado)
function startDailyTimer() {
    setInterval(() => {
        if (gameState.timeRemaining > 0) {
            gameState.timeRemaining--;
            updateDailyProgress();
        }
    }, 60000); // Atualiza a cada minuto
}

// Renderizar os cards de tópicos/matérias (Subjects)
function renderTopicsGrid() {
    const topicsGridContainer = document.querySelector('.topics-grid');
    if (!topicsGridContainer) return;

    topicsGridContainer.innerHTML = ''; // Limpa os cards mockados no HTML

    gameState.topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        // Adiciona um data-id para identificar o módulo (Subject) no backend
        topicCard.dataset.moduleId = topic.id;

        // Use a cor e o símbolo dinamicamente
        topicCard.innerHTML = `
            <div class="topic-img" style="background-color: ${topic.color};">
                ${topic.symbol}
            </div>
            <div class="topic-content">
                <h3>${topic.name}</h3>
                <p>${topic.description}</p>
                <div class="topic-progress">
                    <div class="topic-progress-bar" style="width: ${topic.progress}%"></div>
                </div>
            </div>
        `;
        // Adiciona o evento de clique diretamente no card renderizado
        topicCard.addEventListener('click', () => handleTopicClick(topic.id, topic.name));
        topicsGridContainer.appendChild(topicCard);
    });
}


// Manipular clique em tópicos (agora com ID real)
function handleTopicClick(moduleId, topicName) {
    // Redireciona para a página do módulo, passando o ID do módulo real.
    // A página modulo.html precisará ser adaptada para usar este ID.
    window.location.href = `modulo.html?moduleId=${moduleId}`;
    // showNotification(`Abrindo ${topicName}...`, 'info'); // Pode ser removido
}


// Renderizar a lista de conquistas (Achievements)
function renderAchievementsList() {
    const achievementListContainer = document.querySelector('.achievement-list');
    if (!achievementListContainer) return;

    achievementListContainer.innerHTML = ''; // Limpa as conquistas mockadas no HTML

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
        achievementListContainer.appendChild(achievementEl);
    });
}


// Completar meta diária (ainda mockado)
function completeGoal(event) {
    const goalItem = event.currentTarget;
    if (goalItem.classList.contains('completed')) return; // Evita completar de novo

    const rewardText = goalItem.querySelector('.goal-reward').textContent;
    const coinAmount = parseInt(rewardText.match(/\d+/)[0]);

    goalItem.classList.add('completed');
    goalItem.querySelector('.goal-checkbox').textContent = '✓';

    addCoins(coinAmount);
    gameState.user.completedGoals++;

    gameState.dailyProgress = Math.min(100, gameState.dailyProgress + 10);
    updateDailyProgress();

    if (typeof showNotification === 'function') {
        showNotification('Meta completada! 🎉', 'success');
    } else {
        console.warn('showNotification não está definida, não é possível exibir notificação.');
    }
}


// Mapeamento de símbolo e cor para matérias (pode vir do backend futuramente)
function getSubjectSymbol(subjectName) {
    switch (subjectName) {
        case 'Álgebra Básica': return 'x²';
        case 'Geometria': return '△';
        case 'Cálculo': return '∫';
        case 'Estatística': return '📊';
        default: return '📚';
    }
}

function getSubjectColor(subjectName) {
    switch (subjectName) {
        case 'Álgebra Básica': return '#ef5350';
        case 'Geometria': return '#66bb6a';
        case 'Cálculo': return '#6290c8';
        case 'Estatística': return '#7e57c2';
        default: return '#cccccc';
    }
}

// Funções para controle de lição (modal) - como está no HTML
function openLesson() {
    const modal = document.getElementById('lessonModal');
    if(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeLesson() {
    const modal = document.getElementById('lessonModal');
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function showCorrectAnswer(event) {
    if (typeof showNotification === 'function') {
        showNotification('Correto! 🎉 Você ganhou 15 moedas!', 'success');
    } else {
        console.warn('showNotification não está definida.');
    }
    addCoins(15);
    // Lógica de feedback visual no HTML
}

function showWrongAnswer(event) {
    if (typeof showNotification === 'function') {
        showNotification('Incorreto. Tente novamente!', 'error');
    } else {
        console.warn('showNotification não está definida.');
    }
    // Lógica de feedback visual no HTML
}

// Animação de recompensa (simulada)
function showRewardAnimation() {
    const rewardAnimation = document.getElementById('rewardAnimation');
    if (rewardAnimation) {
        rewardAnimation.style.display = 'flex';
        setTimeout(() => rewardAnimation.classList.add('show'), 10);
        setTimeout(() => {
            rewardAnimation.classList.remove('show');
            setTimeout(() => rewardAnimation.style.display = 'none', 300);
        }, 3000);
    }
}

// Manipulação de teclado (para fechar modais)
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeLesson();
    }
}

// Funções de tema e notificações que estão em components/
// Não precisam ser repetidas aqui se já estão sendo importadas via <script src>
// showNotification é exposta globalmente pelo notifications.js