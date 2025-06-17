// Estado global da aplicação para o Dashboard
let selectedLevel = null;
let selectedSubjects = [];
// As moedas e dados do usuário virão do backend
let currentUserData = {
    coins: 0,
    name: 'Convidado'
};

// Instância do sistema de notificações (garante que esteja disponível)
// Assumimos que window.showNotification está disponível via components/notifications.js

// Inicialização da página
document.addEventListener('DOMContentLoaded', async function() {
    await initializePage();
    setupEventListeners();
});

// Inicializa a página com eventos e estados
async function initializePage() {
    console.log('Dashboard iniciado! Carregando dados do usuário e matérias...');
    await loadUserDataForDashboard(); // Carrega usuário logado para o cabeçalho
    await loadSubjectsFromBackend(); // Carrega as matérias do backend
    loadUserDataFromSession(); // Carrega seleções anteriores do sessionStorage
    restoreSelections(); // Restaura seleções na UI
    updateCoinsDisplay(); // Atualiza a exibição de moedas
}

// NOVO: Função para carregar dados do usuário logado para o cabeçalho do dashboard
async function loadUserDataForDashboard() {
    try {
        const userResponse = await window.MathMasterAPI.User.getCurrentUser(); // GET /api/users/me
        if (userResponse && userResponse.id) {
            currentUserData.name = userResponse.name;
            currentUserData.coins = userResponse.coins || 0; // Assume coins se o User tiver, senão 0

            // Atualiza o avatar no header
            const avatarElement = document.querySelector('header .user-profile .avatar');
            if (avatarElement) {
                avatarElement.textContent = currentUserData.name.charAt(0).toUpperCase();
            }
            updateCoinsDisplay(); // Atualiza moedas após carregar
        } else {
            console.warn('Nenhum usuário logado. Redirecionando para login.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário para o dashboard:', error);
        if (typeof showNotification === 'function') {
            showNotification('Não foi possível carregar seu perfil no dashboard. Tente novamente.', 'error');
        }
        if (error.status === 401 || error.status === 403) {
             window.location.href = 'login.html';
        }
    }
}

// NOVO: Função para carregar matérias (Subjects) do backend
let availableSubjects = []; // Armazena as matérias disponíveis do backend
async function loadSubjectsFromBackend() {
    try {
        const subjects = await window.MathMasterAPI.Modules.getAllSubjects(); // GET /api/modules
        console.log('Matérias recebidas do backend para o dashboard:', subjects);

        availableSubjects = subjects.map(subject => ({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            symbol: getSubjectSymbol(subject.name), // Função auxiliar para ícones
            color: getSubjectColor(subject.name)    // Função auxiliar para cores
            // Poderíamos adicionar dificuldade, tempo estimado se o backend retornasse
        }));
        renderSubjectsGrid(); // Renderiza os cards de matérias
    } catch (error) {
        console.error('Erro ao carregar matérias para o dashboard:', error);
        if (typeof showNotification === 'function') {
            showNotification('Não foi possível carregar os módulos de estudo.', 'error');
        }
    }
}

// NOVO: Renderiza os cards de matérias dinamicamente
function renderSubjectsGrid() {
    const subjectsGridContainer = document.querySelector('.subjects-grid');
    if (!subjectsGridContainer) return;

    subjectsGridContainer.innerHTML = ''; // Limpa os cards estáticos existentes

    availableSubjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.dataset.subjectId = subject.id; // Armazena o ID real do backend
        subjectCard.onclick = () => selectSubject(subjectCard, subject.id); // Passa o ID

        subjectCard.innerHTML = `
            <div class="subject-img" style="background-color: ${subject.color};">
                ${subject.symbol}
            </div>
            <div class="subject-content">
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
            </div>
        `;
        subjectsGridContainer.appendChild(subjectCard);
    });
}

// Função para selecionar nível (sem mudanças, continua no frontend)
function selectLevel(element, level) {
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedLevel = level;
    element.style.transform = 'scale(0.95)';
    setTimeout(() => { element.style.transform = 'scale(1)'; }, 150);
    updateLearningPath();
    saveUserDataToSession(); // Salva seleções
}

// Função para selecionar matérias (agora usando IDs do backend)
function selectSubject(element, subjectId) { // subjectId é o ID real do backend
    const isSelected = element.classList.contains('selected');

    if (isSelected) {
        element.classList.remove('selected');
        selectedSubjects = selectedSubjects.filter(id => id !== subjectId); // Filtra pelo ID
    } else {
        element.classList.add('selected');
        selectedSubjects.push(subjectId); // Adiciona o ID
    }

    element.style.transform = 'scale(0.95)';
    setTimeout(() => { element.style.transform = 'scale(1)'; }, 150);

    updateLearningPath();
    saveUserDataToSession(); // Salva seleções
}

// Atualiza o plano de estudos baseado nas seleções
// Esta função ainda pode usar dados mockados para tópicos de exemplo,
// pois o backend não retorna os tópicos aninhados diretamente em getAllSubjects
// e a lógica de "plano personalizado" é complexa para o MVP.
function updateLearningPath() {
    const learningPath = document.getElementById('learningPath');
    const selectedLevelSpan = document.getElementById('selectedLevel');

    if (selectedLevel && selectedSubjects.length > 0) {
        learningPath.style.display = 'block';

        const levelNames = {
            'iniciante': 'Nível Iniciante',
            'intermediario': 'Nível Intermediário',
            'avancado': 'Nível Avançado',
            'especialista': 'Nível Especialista'
        };
        selectedLevelSpan.textContent = levelNames[selectedLevel];

        hideAllTopics(); // Esconde todos os mockados
        selectedSubjects.forEach(subjectId => {
            // Encontra a matéria pelo ID para pegar o nome
            const subject = availableSubjects.find(s => s.id === subjectId);
            if (subject) {
                // AQUI: A lógica para exibir tópicos DEVE ser mockada por enquanto,
                // ou seríamos muito dependentes da estrutura complexa de tópicos aninhados do backend
                // para cada matéria. Para o MVP, manter o mock aqui é mais rápido.
                const mockTopicsDivId = getSubjectMockTopicsDivId(subject.name); // Mapeia nome da matéria para o ID do div mockado
                const topicsDiv = document.getElementById(mockTopicsDivId);
                if (topicsDiv) {
                    topicsDiv.style.display = 'block';
                    animateTopics(topicsDiv);
                }
            }
        });

        setTimeout(() => {
            learningPath.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    } else {
        learningPath.style.display = 'none';
    }
}

// NOVO: Função auxiliar para mapear nome da matéria para o ID do div de tópicos mockados
function getSubjectMockTopicsDivId(subjectName) {
    switch (subjectName) {
        case 'Álgebra Básica': return 'algebraTopics';
        case 'Geometria': return 'geometriaTopics';
        case 'Cálculo': return 'calculoTopics';
        case 'Estatística': return 'estatisticaTopics';
        default: return '';
    }
}


// Esconde todos os tópicos mockados
function hideAllTopics() {
    const topicDivs = ['algebraTopics', 'geometriaTopics', 'calculoTopics', 'estatisticaTopics'];
    topicDivs.forEach(id => {
        const div = document.getElementById(id);
        if (div) {
            div.style.display = 'none';
        }
    });
}

// Anima a entrada dos tópicos (sem mudanças)
function animateTopics(container) {
    const topics = container.querySelectorAll('.path-topic');
    topics.forEach((topic, index) => {
        topic.style.opacity = '0';
        topic.style.transform = 'translateY(20px)';

        setTimeout(() => {
            topic.style.transition = 'all 0.4s ease';
            topic.style.opacity = '1';
            topic.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Função para começar os estudos
function startLearning() {
    if (!selectedLevel || selectedSubjects.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Por favor, selecione um nível e pelo menos uma matéria!', 'warning');
        }
        return;
    }

    const startBtn = document.querySelector('.start-btn');
    startBtn.style.transform = 'scale(0.95)';
    startBtn.textContent = 'Iniciando...';

    setTimeout(() => {
        startBtn.style.transform = 'scale(1)';

        if (typeof showNotification === 'function') {
            showNotification('Plano de estudos criado com sucesso! 🎉', 'success');
        }
        awardCoins(50, 'Plano de estudos criado'); // Simulado

        // Redireciona para a primeira lição após um breve delay
        setTimeout(() => {
            // Pega o ID da primeira matéria selecionada
            const firstSubjectId = selectedSubjects[0];
            window.location.href = `modulo.html?subjectId=${firstSubjectId}&level=${selectedLevel}`;
        }, 2000);
    }, 300);
}

// Sistema de moedas (simulado, não conectado ao backend User ainda)
function awardCoins(amount, reason) {
    currentUserData.coins += amount;
    updateCoinsDisplay();
    showCoinAnimation(amount);
    saveUserDataToSession(); // Salva moedas no sessionStorage
    console.log(`Moedas ganhas: +${amount} - ${reason}`);
}

function updateCoinsDisplay() {
    const coinsElement = document.querySelector('.coins span:last-child');
    if (coinsElement) {
        coinsElement.textContent = currentUserData.coins;
    }
}

function showCoinAnimation(amount) {
    const coinsContainer = document.querySelector('.coins');
    if (!coinsContainer) return;

    const animation = document.createElement('div');
    animation.textContent = `+${amount}`;
    animation.style.cssText = `
        position: absolute;
        color: #f39c12;
        font-weight: bold;
        font-size: 14px;
        pointer-events: none;
        animation: coinFloat 2s ease-out forwards;
        z-index: 1000;
    `;

    const rect = coinsContainer.getBoundingClientRect();
    animation.style.left = `${rect.left + rect.width / 2}px`;
    animation.style.top = `${rect.top + window.scrollY}px`;

    document.body.appendChild(animation);

    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);
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

// Salvar e carregar dados do usuário (seleções de nível/matéria e moedas) no sessionStorage
function saveUserDataToSession() {
    const userData = {
        selectedLevel,
        selectedSubjects,
        userCoins: currentUserData.coins, // Salva as moedas atuais do usuário
        timestamp: Date.now()
    };

    try {
        sessionStorage.setItem('mathMasterDashboardData', JSON.stringify(userData));
        console.log('Dados do dashboard salvos na sessão.');
    } catch (error) {
        console.warn('Não foi possível salvar os dados do dashboard:', error);
    }
}

function loadUserDataFromSession() {
    try {
        const savedData = sessionStorage.getItem('mathMasterDashboardData');
        if (savedData) {
            const userData = JSON.parse(savedData);

            const isDataFresh = (Date.now() - userData.timestamp) < 24 * 60 * 60 * 1000; // Dados válidos por 24h

            if (isDataFresh) {
                selectedLevel = userData.selectedLevel;
                selectedSubjects = userData.selectedSubjects || [];
                // Se as moedas vierem do backend, esta linha pode ser ajustada.
                // Por enquanto, o valor salvo aqui é o que foi acumulado na sessão.
                currentUserData.coins = userData.userCoins || currentUserData.coins;
                console.log('Dados do dashboard carregados da sessão.');
            } else {
                console.log('Dados da sessão expirados ou muito antigos, recarregando.');
                sessionStorage.removeItem('mathMasterDashboardData'); // Limpa dados antigos
            }
        }
    } catch (error) {
        console.warn('Não foi possível carregar os dados salvos do dashboard:', error);
    }
}

function restoreSelections() {
    // Restaura seleção de nível
    if (selectedLevel) {
        const levelCard = document.querySelector(`[onclick*="${selectedLevel}"]`);
        if (levelCard) {
            levelCard.classList.add('selected');
        }
    }

    // Restaura seleções de matérias
    selectedSubjects.forEach(subjectId => { // Agora itera por IDs
        // Encontra o card da matéria pelo data-subject-id
        const subjectCard = document.querySelector(`.subject-card[data-subject-id="${subjectId}"]`);
        if (subjectCard) {
            subjectCard.classList.add('selected');
        }
    });

    // Atualiza o plano de estudos se houver seleções
    if (selectedLevel && selectedSubjects.length > 0) {
        updateLearningPath();
    }
}

// Adiciona listeners para teclas de atalho
function setupEventListeners() { // Funções de setupEventListeners consolidadas aqui
    // Enter para começar estudos se tudo estiver selecionado
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && selectedLevel && selectedSubjects.length > 0) {
            startLearning();
        }
    });

    // Event listener para abrir o menu de perfil (no clique no avatar)
    const avatar = document.querySelector('header .user-profile .avatar');
    if (avatar) {
        avatar.addEventListener('click', openProfileMenu); // openProfileMenu está em components/menu.js
    }
}

console.log('MathMaster Dashboard JavaScript carregado com sucesso! 🚀');