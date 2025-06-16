// Estado global da aplicação
let selectedLevel = null;
let selectedSubjects = [];
let userCoins = 350;

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    updateCoinsDisplay();
});

// Inicializa a página com eventos e estados
function initializePage() {
    // Verifica se há dados salvos no sessionStorage
    loadUserData();
}

// Função para selecionar nível
function selectLevel(element, level) {
    // Remove seleção anterior
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adiciona seleção ao card clicado
    element.classList.add('selected');
    selectedLevel = level;
    
    // Adiciona animação de feedback
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
    
    updateLearningPath();
    saveUserData();
}

// Função para selecionar matérias
function selectSubject(element, subject) {
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // Remove seleção
        element.classList.remove('selected');
        selectedSubjects = selectedSubjects.filter(s => s !== subject);
    } else {
        // Adiciona seleção
        element.classList.add('selected');
        selectedSubjects.push(subject);
    }
    
    // Animação de feedback
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
    
    updateLearningPath();
    saveUserData();
}

// Atualiza o plano de estudos baseado nas seleções
function updateLearningPath() {
    const learningPath = document.getElementById('learningPath');
    const selectedLevelSpan = document.getElementById('selectedLevel');
    
    if (selectedLevel && selectedSubjects.length > 0) {
        learningPath.style.display = 'block';
        
        // Atualiza o texto do nível selecionado
        const levelNames = {
            'iniciante': 'Nível Iniciante',
            'intermediario': 'Nível Intermediário',
            'avancado': 'Nível Avançado',
            'especialista': 'Nível Especialista'
        };
        selectedLevelSpan.textContent = levelNames[selectedLevel];
        
        // Mostra apenas os tópicos das matérias selecionadas
        hideAllTopics();
        selectedSubjects.forEach(subject => {
            const topicsDiv = document.getElementById(subject + 'Topics');
            if (topicsDiv) {
                topicsDiv.style.display = 'block';
                animateTopics(topicsDiv);
            }
        });
        
        // Scroll suave para o plano de estudos
        setTimeout(() => {
            learningPath.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    } else {
        learningPath.style.display = 'none';
    }
}

// Esconde todos os tópicos
function hideAllTopics() {
    const topicDivs = ['algebraTopics', 'geometriaTopics', 'calculoTopics', 'estatisticaTopics'];
    topicDivs.forEach(id => {
        const div = document.getElementById(id);
        if (div) {
            div.style.display = 'none';
        }
    });
}

// Anima a entrada dos tópicos
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
        showNotification('Por favor, selecione um nível e pelo menos uma matéria!', 'warning');
        return;
    }
    
    // Animação do botão
    const startBtn = document.querySelector('.start-btn');
    startBtn.style.transform = 'scale(0.95)';
    startBtn.textContent = 'Iniciando...';
    
    setTimeout(() => {
        startBtn.style.transform = 'scale(1)';
        
        // Simula início dos estudos
        showNotification('Plano de estudos criado com sucesso! 🎉', 'success');
        awardCoins(50, 'Plano de estudos criado');
        
        // Redireciona para a primeira lição após um breve delay
        setTimeout(() => {
            startFirstLesson();
        }, 2000);
    }, 300);
}

// Inicia a primeira lição baseada na seleção
function startFirstLesson() {
    const firstSubject = selectedSubjects[0];
    const lessons = {
        'algebra': 'Vamos começar com Equações de Primeiro Grau!',
        'geometria': 'Vamos começar com Geometria Plana!',
        'calculo': 'Vamos começar com Limites e Continuidade!',
        'estatistica': 'Vamos começar com Estatística Descritiva!'
    };
    
    showNotification(lessons[firstSubject] || 'Vamos começar a estudar!', 'info');
    
    // Aqui você redirecionaria para a página da lição
    window.location.href = `modulo.html?subject=${firstSubject}&level=${selectedLevel}`;
}

// Sistema de moedas
function awardCoins(amount, reason) {
    userCoins += amount;
    updateCoinsDisplay();
    showCoinAnimation(amount);
    saveUserData();
    
    // Log da conquista
    console.log(`Moedas ganhas: +${amount} - ${reason}`);
}

function updateCoinsDisplay() {
    const coinsElement = document.querySelector('.coins span:last-child');
    if (coinsElement) {
        coinsElement.textContent = userCoins;
    }
}

function showCoinAnimation(amount) {
    const coinsContainer = document.querySelector('.coins');
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
    
    // Adiciona animação CSS se não existir
    if (!document.getElementById('coinAnimation')) {
        const style = document.createElement('style');
        style.id = 'coinAnimation';
        style.textContent = `
            @keyframes coinFloat {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-30px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    coinsContainer.style.position = 'relative';
    coinsContainer.appendChild(animation);
    
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);
}



// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Adiciona estilos das notificações se não existirem
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1001;
                animation: notificationSlideIn 0.3s ease;
            }
            
            .notification.success { background-color: #28a745; }
            .notification.warning { background-color: #ffc107; color: #333; }
            .notification.error { background-color: #dc3545; }
            .notification.info { background-color: #17a2b8; }
            
            @keyframes notificationSlideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'notificationSlideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Salvar e carregar dados do usuário
function saveUserData() {
    const userData = {
        selectedLevel,
        selectedSubjects,
        userCoins,
        timestamp: Date.now()
    };
    
    try {
        sessionStorage.setItem('mathMasterData', JSON.stringify(userData));
    } catch (error) {
        console.warn('Não foi possível salvar os dados:', error);
    }
}

function loadUserData() {
    try {
        const savedData = sessionStorage.getItem('mathMasterData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            
            // Verifica se os dados não são muito antigos (24 horas)
            const isDataFresh = (Date.now() - userData.timestamp) < 24 * 60 * 60 * 1000;
            
            if (isDataFresh) {
                selectedLevel = userData.selectedLevel;
                selectedSubjects = userData.selectedSubjects || [];
                userCoins = userData.userCoins || 350;
                
                // Restaura seleções na interface
                restoreSelections();
            }
        }
    } catch (error) {
        console.warn('Não foi possível carregar os dados salvos:', error);
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
    selectedSubjects.forEach(subject => {
        const subjectCard = document.querySelector(`[onclick*="${subject}"]`);
        if (subjectCard) {
            subjectCard.classList.add('selected');
        }
    });
    
    // Atualiza o plano de estudos se houver seleções
    if (selectedLevel && selectedSubjects.length > 0) {
        updateLearningPath();
    }
}

// Adiciona estilos CSS para estados selecionados
if (!document.getElementById('selectionStyles')) {
    const style = document.createElement('style');
    style.id = 'selectionStyles';
    style.textContent = `
        .level-card.selected,
        .subject-card.selected {
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
            border: 2px solid #4a90e2;
        }
        
        .level-card,
        .subject-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .level-card:hover,
        .subject-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        
        .start-btn {
            transition: all 0.3s ease;
        }
        
        .start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Adiciona listeners para teclas de atalho
document.addEventListener('keydown', function(event) {
    // Enter para começar estudos se tudo estiver selecionado
    if (event.key === 'Enter' && selectedLevel && selectedSubjects.length > 0) {
        startLearning();
    }
});

console.log('MathMaster Dashboard JavaScript carregado com sucesso! 🚀');