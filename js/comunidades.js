// Dados mockados para demonstração
let currentUser = {
    name: "Usuário Atual",
    avatar: "R",
    coins: 10,
    level: 15
};

let posts = [
    {
        id: 1,
        author: "Maria Silva",
        avatar: "M",
        content: "Alguém pode me ajudar a entender melhor a fatoração de polinômios? Estou tendo dificuldades especialmente com casos em que há múltiplas variáveis.",
        time: "Há 2 horas",
        category: "Álgebra",
        topics: ["Álgebra", "Polinômios"],
        likes: 12,
        replies: 8,
        saved: false
    },
    {
        id: 2,
        author: "João Costa",
        avatar: "J",
        content: "Compartilhando um método que me ajudou muito a memorizar as principais regras de derivação. Achei esse método visual super eficaz!\n\nBasicamente, eu crio cartões mentais associando cada regra com uma imagem...",
        time: "Ontem",
        category: "Cálculo",
        topics: ["Cálculo", "Derivadas", "Dicas de Estudo"],
        likes: 24,
        replies: 5,
        saved: false
    },
    {
        id: 3,
        author: "Prof. Carlos",
        avatar: "P",
        content: "DESAFIO DA SEMANA: Provar que a soma dos ângulos internos de um triângulo é sempre 180°, usando apenas os axiomas de Euclides. Quem consegue?",
        time: "Há 3 dias",
        category: "Geometria",
        topics: ["Geometria", "Desafio"],
        likes: 45,
        replies: 17,
        saved: false
    }
];

let currentTab = 'discussions';

// Inicialização da página
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    updateUserStats();
    renderPosts();
});

function initializePage() {
    // Atualizar avatar do usuário
    const userAvatar = document.querySelector('.user-profile .avatar');
    if (userAvatar) {
        userAvatar.textContent = currentUser.avatar;
    }

    // Configurar event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Event listeners para ações dos posts
    document.addEventListener('click', function (e) {
        if (e.target.closest('.post-action')) {
            handlePostAction(e);
        }
    });

    // Event listener para o formulário de nova publicação
    const textarea = document.querySelector('.new-post-form textarea');
    if (textarea) {
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                createNewPost();
            }
        });
    }

    // Event listeners para tópicos em alta
    document.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', function () {
            const topicName = this.querySelector('.topic-info div').textContent;
            filterPostsByTopic(topicName);
        });
    });

    // Event listeners para usuários ativos
    document.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', function () {
            const userName = this.querySelector('.user-name').textContent;
            showUserProfile(userName);
        });
    });

    // Event listeners para eventos da comunidade
    document.querySelectorAll('.event-item').forEach(item => {
        item.addEventListener('click', function () {
            const eventTitle = this.querySelector('.event-title').textContent;
            showEventDetails(eventTitle);
        });
    });
}

function updateUserStats() {
    const coinsElement = document.querySelector('.coins span:last-child');
    if (coinsElement) {
        coinsElement.textContent = currentUser.coins;
    }
}

function switchTab(tabElement, tabName) {
    // Remover classe active de todas as tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Adicionar classe active na tab clicada
    tabElement.classList.add('active');

    currentTab = tabName;

    // Filtrar posts baseado na tab selecionada
    filterPostsByTab(tabName);
}

function filterPostsByTab(tabName) {
    let filteredPosts = posts;

    switch (tabName) {
        case 'discussions':
            filteredPosts = posts.filter(post =>
                !post.content.includes('?') &&
                !post.content.includes('DESAFIO')
            );
            break;
        case 'questions':
            filteredPosts = posts.filter(post =>
                post.content.includes('?')
            );
            break;
        case 'challenges':
            filteredPosts = posts.filter(post =>
                post.content.includes('DESAFIO') ||
                post.topics.includes('Desafio')
            );
            break;
    }

    renderPosts(filteredPosts);
}

function filterPostsByTopic(topicName) {
    const filteredPosts = posts.filter(post =>
        post.topics.some(topic =>
            topic.toLowerCase().includes(topicName.toLowerCase())
        )
    );

    renderPosts(filteredPosts);

    // Mostrar feedback visual
    showNotification(`Mostrando posts sobre: ${topicName}`);
}

function renderPosts(postsToRender = posts) {
    const container = document.querySelector('.posts-container');
    if (!container) return;

    container.innerHTML = '';

    postsToRender.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });

    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="no-posts">Nenhum post encontrado para esta categoria.</div>';
    }
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-author-avatar">${post.avatar}</div>
            <div class="post-info">
                <div class="post-author">${post.author}</div>
                <div class="post-meta">
                    <span>${post.time}</span>
                    <span>${post.category}</span>
                </div>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content.replace(/\n/g, '</p><p>')}</p>
            <div class="post-topics">
                ${post.topics.map(topic => `<span class="post-topic">${topic}</span>`).join('')}
            </div>
        </div>
        <div class="post-actions">
            <div class="post-action" data-action="like" data-post-id="${post.id}">
                <span>👍</span>
                <span>${post.likes}</span>
            </div>
            <div class="post-action" data-action="reply" data-post-id="${post.id}">
                <span>💬</span>
                <span>${post.replies} respostas</span>
            </div>
            <div class="post-action" data-action="save" data-post-id="${post.id}">
                <span>🔖</span>
                <span>${post.saved ? 'Salvo' : 'Salvar'}</span>
            </div>
        </div>
    `;

    return postDiv;
}

function handlePostAction(e) {
    const actionElement = e.target.closest('.post-action');
    const action = actionElement.dataset.action;
    const postId = parseInt(actionElement.dataset.postId);

    switch (action) {
        case 'like':
            toggleLike(postId, actionElement);
            break;
        case 'reply':
            openReplyModal(postId);
            break;
        case 'save':
            toggleSave(postId, actionElement);
            break;
    }
}

function toggleLike(postId, element) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.likes += 1;
    const likesSpan = element.querySelector('span:last-child');
    likesSpan.textContent = post.likes;

    // Animação visual
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);

    // Ganhar moedas por interação
    earnCoins(2);
}

function toggleSave(postId, element) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.saved = !post.saved;
    const saveSpan = element.querySelector('span:last-child');
    saveSpan.textContent = post.saved ? 'Salvo' : 'Salvar';

    const message = post.saved ? 'Post salvo!' : 'Post removido dos salvos';
    showNotification(message);
}

function openReplyModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.createElement('div');
    modal.className = 'reply-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Responder ao post de ${post.author}</h3>
                <span class="close-modal" onclick="closeReplyModal()">×</span>
            </div>
            <div class="original-post">
                <p><strong>${post.author}:</strong> ${post.content.substring(0, 100)}...</p>
            </div>
            <div class="form-group">
                <textarea id="replyText" placeholder="Escreva sua resposta..."></textarea>
            </div>
            <div class="form-actions">
                <button class="btn btn-outline" onclick="closeReplyModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="submitReply(${postId})">Responder</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Focar no textarea
    setTimeout(() => {
        document.getElementById('replyText').focus();
    }, 100);
}

function closeReplyModal() {
    const modal = document.querySelector('.reply-modal');
    if (modal) {
        modal.remove();
    }
}

function submitReply(postId) {
    const replyText = document.getElementById('replyText').value.trim();
    if (!replyText) {
        showNotification('Por favor, escreva uma resposta!', 'error');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.replies += 1;
        renderPosts();
        earnCoins(5);
        showNotification('Resposta enviada com sucesso!');
    }

    closeReplyModal();
}

function createNewPost() {
    const textarea = document.querySelector('.new-post-form textarea');
    const topicsInput = document.querySelector('.new-post-form input[type="text"]');

    const content = textarea.value.trim();
    const topicsText = topicsInput.value.trim();

    if (!content) {
        showNotification('Por favor, escreva algo para publicar!', 'error');
        return;
    }

    const topics = topicsText ? topicsText.split(',').map(t => t.trim()) : ['Geral'];

    const newPost = {
        id: posts.length + 1,
        author: currentUser.name,
        avatar: currentUser.avatar,
        content: content,
        time: 'Agora',
        category: topics[0],
        topics: topics,
        likes: 0,
        replies: 0,
        saved: false
    };

    posts.unshift(newPost);
    renderPosts();

    // Limpar formulário
    textarea.value = '';
    topicsInput.value = '';

    // Ganhar moedas por criar post
    earnCoins(10);
    showNotification('Post criado com sucesso!');
}

function showUserProfile(userName) {
    const modal = document.createElement('div');
    modal.className = 'user-profile-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Perfil de ${userName}</h3>
                <span class="close-modal" onclick="closeUserProfileModal()">×</span>
            </div>
            <div class="user-profile-info">
                <div class="user-avatar-large">${userName[0]}</div>
                <h4>${userName}</h4>
                <p>Especialista em Matemática</p>
                <div class="user-stats-grid">
                    <div class="stat">
                        <div class="stat-value">156</div>
                        <div class="stat-label">Posts</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">2.3k</div>
                        <div class="stat-label">Curtidas</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">45</div>
                        <div class="stat-label">Seguidores</div>
                    </div>
                </div>
                <button class="btn btn-primary">Seguir</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeUserProfileModal() {
    const modal = document.querySelector('.user-profile-modal');
    if (modal) {
        modal.remove();
    }
}

function showEventDetails(eventTitle) {
    const modal = document.createElement('div');
    modal.className = 'event-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${eventTitle}</h3>
                <span class="close-modal" onclick="closeEventDetailsModal()">×</span>
            </div>
            <div class="event-details">
                <p><strong>Data:</strong> 15 de Maio, 2024</p>
                <p><strong>Horário:</strong> 19:00 - 21:00</p>
                <p><strong>Descrição:</strong> Evento especial da comunidade MathMaster com desafios matemáticos e prêmios incríveis!</p>
                <p><strong>Prêmios:</strong> Medalhas digitais e moedas extras</p>
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="joinEvent('${eventTitle}')">Participar</button>
                    <button class="btn btn-outline" onclick="closeEventDetailsModal()">Fechar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeEventDetailsModal() {
    const modal = document.querySelector('.event-details-modal');
    if (modal) {
        modal.remove();
    }
}

function joinEvent(eventTitle) {
    showNotification(`Você se inscreveu no evento: ${eventTitle}!`);
    closeEventDetailsModal();
    earnCoins(20);
}

function openProfileMenu() {
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="viewProfile()">Ver Perfil</div>
        <div class="menu-item" onclick="viewSettings()">Configurações</div>
        <div class="menu-item" onclick="viewSavedPosts()">Posts Salvos</div>
        <div class="menu-item" onclick="logout()">Sair</div>
    `;

    const existingMenu = document.querySelector('.profile-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    document.body.appendChild(menu);

    // Posicionar o menu
    const avatar = document.querySelector('.user-profile .avatar');
    const rect = avatar.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 10 + 'px';
    menu.style.right = '20px';

    // Fechar menu ao clicar fora
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !avatar.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function viewProfile() {
    showNotification('Abrindo perfil...');
    document.querySelector('.profile-menu')?.remove();
}

function viewSettings() {
    showNotification('Abrindo configurações...');
    document.querySelector('.profile-menu')?.remove();
}

function viewSavedPosts() {
    const savedPosts = posts.filter(post => post.saved);
    renderPosts(savedPosts);
    showNotification(`Mostrando ${savedPosts.length} posts salvos`);
    document.querySelector('.profile-menu')?.remove();
}

//------------------------confirmação de saída------------------------
function logout() {
    showModal('Sair', 'Tem certeza que deseja sair?', [
        { text: 'Cancelar', onClick: () => { } },
        { text: 'Confirmar', onClick: () => confirmLogout() }
    ]);
}
function showModal(title, message, buttons) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <style>
        .modal { 
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        }
        .modal-content {
        background: white;
        padding: 20px;
        border-radius:
        8px; max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        }
        .close-modal {
        cursor: pointer;
        font-size: 24px;
        color: #666;
        }
        .modal-title {
        font-size: 20px;
        font-weight: bold;
        }
        .modal-message {
        font-size: 16px;
        margin-bottom: 15px;
        }
        .modal-body {
        margin-bottom: 15px;
        }
        .modal-buttons {
        display: flex;
        justify-content: flex-end;
        }
        .modal-buttons button {
        margin-left: 10px;
        padding: 10px 15px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        }
        .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        }
        .btn-primary {
        background: white;
        color: var(--primary);
        border: 1px solid var(--primary);
        
        }
        .btn-outline {
        background: white;
        color: var(--primary);
        border: 1px solid var(--primary);
        }
        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }
        .btn-primary:hover {
             background: var(--primary);
            color: white;
        }
        
        </style>

        <div class="modal-content">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="modal-buttons">
                ${buttons.map(button => `
                    <button class="btn ${button.text === 'Cancelar' ? 'btn-outline' : 'btn-primary'}">
                        ${button.text}
                    </button>
                `).join('')}
                
                
                
                
            </div>
        </div>
    `;


    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Fechar modal ao clicar fora
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    // Fechar modal ao pressionar Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });

    // Fechar modal ao clicar no botão de cancelar
    const cancelButton = modal.querySelector('.btn.btn-outline');
    cancelButton.addEventListener('click', function () {
        modal.remove();
    });

    // Confirmar ação ao clicar no botão de confirmar
    const confirmButton = modal.querySelector('.btn.btn-primary');
    confirmButton.addEventListener('click', function () {
        buttons.find(button => button.text === 'Confirmar').onClick();
        modal.remove();
    });


}
function confirmLogout() {
    showNotification('Saindo... Você será redirecionado para a página de login.', 'success');

    // Simular logout
    currentUser = {
        name: "Visitante",
        avatar: "V",
        coins: 0,
        level: 1
    };
    updateUserStats();
    // Redirecionar para a página de login
    // Simular redirecionamento para a página de login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
    // Aqui você redirecionaria para a página de login

}





//---------------------------final da confirmação-------------------
function earnCoins(amount) {
    currentUser.coins += amount;
    updateUserStats();

    // Animação de ganho de moedas
    const coinsElement = document.querySelector('.coins');
    coinsElement.style.transform = 'scale(1.2)';
    coinsElement.style.color = '#f39c12';

    setTimeout(() => {
        coinsElement.style.transform = 'scale(1)';
        coinsElement.style.color = '';
    }, 300);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Funções para o modal de login rápido
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function quickLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }

    // Simular login
    showNotification('Login realizado com sucesso!');
    closeLoginModal();

    // Atualizar dados do usuário
    currentUser.name = email.split('@')[0];
    currentUser.coins = 250;
    updateUserStats();
}

// Event listeners para o modal de login
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeReplyModal();
        closeUserProfileModal();
        closeEventDetailsModal();
    }
});

// Adicionar estilos para modais e notificações
const styles = `
<style>
.reply-modal, .user-profile-modal, .event-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.close-modal {
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.close-modal:hover {
    color: #333;
}

.original-post {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid var(--primary);
}

.user-profile-info {
    text-align: center;
}

.user-avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin: 0 auto 20px;
}

.user-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.stat {
    text-align: center;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary);
}

.stat-label {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.profile-menu {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    overflow: hidden;
    min-width: 150px;
    z-index: 1000;
}

.menu-item {
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.menu-item:hover {
    background: #f8f9fa;
}

.menu-item:last-child {
    border-bottom: none;
}

.no-posts {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-style: italic;
}

.event-details p {
    margin-bottom: 10px;
}

.quick-login-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-outline {
    background: transparent;
    border: 1px solid #ddd;
    color: #666;
}

.btn-outline:hover {
    background: #f8f9fa;
}

@media (max-width: 768px) {
    .modal-content {
        margin: 20px;
        width: calc(100% - 40px);
    }
    
    .user-stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 15px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', styles);


//----------------------------------------------------------------------------       
// Tema escuro
function createThemeToggle() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.left = '20px';
    themeToggle.style.backgroundColor = 'var(--primary)';
    themeToggle.style.color = 'var(--white)';
    themeToggle.style.width = '40px';
    themeToggle.style.height = '40px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.boxShadow = 'var(--shadow)';
    themeToggle.style.zIndex = '50';

    themeToggle.addEventListener('click', toggleTheme);

    document.body.appendChild(themeToggle);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        document.documentElement.style.setProperty('--light-bg', '#1f2937');
        document.documentElement.style.setProperty('--white', '#374151');
        document.documentElement.style.setProperty('--text', '#e5e7eb');
        document.documentElement.style.setProperty('--primary', '#60a5fa');
    } else {
        document.documentElement.style.setProperty('--light-bg', '#f5f7fa');
        document.documentElement.style.setProperty('--white', '#ffffff');
        document.documentElement.style.setProperty('--text', '#333333');
        document.documentElement.style.setProperty('--primary', '#4a6fa5');
    }
}

// Criar o botão de alternância de tema quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    createThemeToggle();
});
