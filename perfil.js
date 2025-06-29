// Estado global do perfil
const profileState = {
    isEditing: false,
    currentUser: null,
    friends: [],
    followers: [],
    following: [],
    achievements: [],
    activeChat: null,
    uploadType: null // 'avatar' ou 'cover'
};

// Função utilitária para verificar se elemento existe
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Elemento não encontrado: ${selector}`);
    }
    return element;
}

// Função utilitária para definir conteúdo com segurança
function safeSetContent(selector, content) {
    const element = safeQuerySelector(selector);
    if (element) {
        element.textContent = content;
    }
}

// Função utilitária para definir atributo com segurança
function safeSetAttribute(selector, attribute, value) {
    const element = safeQuerySelector(selector);
    if (element) {
        element[attribute] = value;
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Função para carregar os dados do usuário
async function loadUserProfile() {
    try {
        // Simulação de carregamento de dados do usuário
        profileState.currentUser = {
            name: 'Aluno',
            username: '@aluno',
            bio: 'Estudante apaixonado por matemática e programação.',
            avatar: 'assets/images/avatar.jpg',
            cover: 'assets/images/cover.jpg',
            followers: 150,
            following: 75,
            friends: 45
        };

        // Atualizar a interface com os dados do usuário
        updateProfileUI();
        
        // Carregar listas de amigos, seguidores e seguindo
        await loadUserLists();
        
        // Carregar conquistas
        await loadAchievements();
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showNotification('Erro ao carregar perfil', 'error');
    }
}

// Função para atualizar a interface com os dados do usuário
function updateProfileUI() {
    const user = profileState.currentUser;
    if (!user) {
        console.warn('Usuário não encontrado no estado');
        return;
    }
    
    // Atualizar informações básicas
    safeSetContent('.profile-details h1', user.name);
    safeSetContent('.profile-details p:first-of-type', user.username);
    safeSetContent('.profile-details p:nth-of-type(2)', user.bio);
    
    // Atualizar avatar e capa
    const avatarImg = safeQuerySelector('.profile-avatar img');
    const headerAvatarImg = safeQuerySelector('.avatar img');
    const coverDiv = safeQuerySelector('.profile-cover');
    
    if (avatarImg) avatarImg.src = user.avatar;
    if (headerAvatarImg) headerAvatarImg.src = user.avatar;
    if (coverDiv) coverDiv.style.backgroundImage = `url(${user.cover})`;
    
    // Atualizar estatísticas
    const stats = document.querySelectorAll('.stat');
    if (stats.length >= 3) {
        stats[0].querySelector('.stat-value').textContent = user.followers;
        stats[1].querySelector('.stat-value').textContent = user.following;
        stats[2].querySelector('.stat-value').textContent = user.friends;
    }
}

// Função para carregar listas de usuários
async function loadUserLists() {
    try {
        // Simulação de carregamento de dados
        profileState.friends = [
            { id: 1, name: 'Maria Santos', username: '@mariasantos', avatar: 'assets/images/avatar.jpg' },
            { id: 2, name: 'Pedro Oliveira', username: '@pedrooliveira', avatar: 'assets/images/avatar.jpg' },
            { id: 3, name: 'Ana Costa', username: '@anacosta', avatar: 'assets/images/avatar.jpg' }
        ];
        
        profileState.followers = [
            { id: 4, name: 'Carlos Silva', username: '@carlossilva', avatar: 'assets/images/avatar.jpg' },
            { id: 5, name: 'Julia Lima', username: '@julialima', avatar: 'assets/images/avatar.jpg' }
        ];
        
        profileState.following = [
            { id: 6, name: 'Lucas Santos', username: '@lucassantos', avatar: 'assets/images/avatar.jpg' },
            { id: 7, name: 'Mariana Costa', username: '@marianacosta', avatar: 'assets/images/avatar.jpg' }
        ];
        
        // Atualizar as listas na interface
        updateUserLists();
    } catch (error) {
        console.error('Erro ao carregar listas:', error);
        showNotification('Erro ao carregar listas', 'error');
    }
}

// Função para criar HTML de item de usuário
function createUserItemHTML(user, showChatButton = false) {
    const chatButton = showChatButton ? 
        `<button class="btn-chat" onclick="openChat('${user.username}')" title="Enviar mensagem">
            <i class="fas fa-comment"></i>
        </button>` : '';
    
    return `
        <div class="user-item" data-user-id="${user.id}">
            <img src="${user.avatar}" alt="${user.name}" onerror="this.src='assets/images/avatar.jpg'">
            <div class="user-item-info">
                <h4>${user.name}</h4>
                <p>${user.username}</p>
            </div>
            ${chatButton}
        </div>
    `;
}

// Função para atualizar as listas de usuários na interface
function updateUserLists() {
    // Atualizar lista de amigos
    const friendsList = safeQuerySelector('.friends-list');
    if (friendsList) {
        friendsList.innerHTML = profileState.friends.map(friend => 
            createUserItemHTML(friend, true)
        ).join('');
    }
    
    // Atualizar lista de seguidores
    const followersList = safeQuerySelector('.followers-list');
    if (followersList) {
        followersList.innerHTML = profileState.followers.map(follower => 
            createUserItemHTML(follower)
        ).join('');
    }
    
    // Atualizar lista de seguindo
    const followingList = safeQuerySelector('.following-list');
    if (followingList) {
        followingList.innerHTML = profileState.following.map(following => 
            createUserItemHTML(following)
        ).join('');
    }
}

// Função para carregar conquistas
async function loadAchievements() {
    try {
        // Simulação de carregamento de conquistas
        profileState.achievements = [
            { id: 1, icon: 'fa-trophy', title: 'Primeiro Exercício', description: 'Completou seu primeiro exercício' },
            { id: 2, icon: 'fa-star', title: 'Estrela em Ascensão', description: 'Completou 10 exercícios' },
            { id: 3, icon: 'fa-medal', title: 'Mestre da Matemática', description: 'Completou 50 exercícios' },
            { id: 4, icon: 'fa-graduation-cap', title: 'Estudante Dedicado', description: 'Completou 100 exercícios' }
        ];
        
        // Atualizar conquistas na interface
        updateAchievements();
    } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        showNotification('Erro ao carregar conquistas', 'error');
    }
}

// Função para atualizar conquistas na interface
function updateAchievements() {
    const achievementsGrid = safeQuerySelector('.achievements-grid');
    if (achievementsGrid) {
        achievementsGrid.innerHTML = profileState.achievements.map(achievement => `
            <div class="achievement" data-achievement-id="${achievement.id}">
                <div class="achievement-icon">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
            </div>
        `).join('');
    }
}

// Função para alternar modo de edição
function toggleEditMode() {
    profileState.isEditing = !profileState.isEditing;
    
    const form = safeQuerySelector('.edit-profile-form');
    const editBtn = safeQuerySelector('.edit-profile-btn');
    
    if (!form || !editBtn) {
        console.error('Elementos de edição não encontrados');
        return;
    }
    
    if (profileState.isEditing) {
        form.style.display = 'block';
        editBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar Edição';
        
        // Preencher formulário com dados atuais
        const user = profileState.currentUser;
        safeSetAttribute('#name', 'value', user.name);
        safeSetAttribute('#username', 'value', user.username);
        safeSetAttribute('#bio', 'value', user.bio);
    } else {
        form.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
    }
}

// Função para salvar alterações do perfil
async function saveProfileChanges(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const nameInput = form.querySelector('#name');
        const usernameInput = form.querySelector('#username');
        const bioInput = form.querySelector('#bio');
        
        if (!nameInput || !usernameInput || !bioInput) {
            throw new Error('Campos do formulário não encontrados');
        }
        
        const name = nameInput.value.trim();
        const username = usernameInput.value.trim();
        const bio = bioInput.value.trim();
        
        // Validação básica
        if (!name || !username) {
            showNotification('Nome e username são obrigatórios', 'error');
            return;
        }
        
        // Simulação de salvamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        profileState.currentUser = { 
            ...profileState.currentUser, 
            name, 
            username, 
            bio 
        };
        
        // Atualizar interface
        updateProfileUI();
        toggleEditMode();
        
        showNotification('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        showNotification('Erro ao salvar alterações', 'error');
    }
}

// Função para abrir chat (simulação)
function openChat(username) {
    // Encontrar usuário em todas as listas
    const allUsers = [...profileState.friends, ...profileState.followers, ...profileState.following];
    const user = allUsers.find(u => u.username === username);
    
    if (!user) {
        showNotification('Usuário não encontrado', 'error');
        return;
    }
    
    profileState.activeChat = user;
    showNotification(`Abrindo chat com ${user.name}`, 'info');
}

// Função utilitária para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Função para abrir modal de upload
function openUploadModal(type) {
    if (!['avatar', 'cover'].includes(type)) {
        console.error('Tipo de upload inválido:', type);
        return;
    }
    
    profileState.uploadType = type;
    const modal = safeQuerySelector('.upload-modal');
    
    if (!modal) {
        console.error('Modal de upload não encontrado');
        return;
    }
    
    const title = modal.querySelector('h2');
    const preview = modal.querySelector('.upload-preview');
    
    // Limpar preview anterior
    if (preview) preview.innerHTML = '';
    
    // Atualizar título
    if (title) {
        title.textContent = type === 'avatar' ? 'Alterar Foto de Perfil' : 'Alterar Foto de Capa';
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Função para fechar modal de upload
function closeUploadModal() {
    const modal = safeQuerySelector('.upload-modal');
    if (modal) {
        modal.style.display = 'none';
        profileState.uploadType = null;
        
        // Limpar inputs
        const avatarInput = safeQuerySelector('#avatar-upload');
        const coverInput = safeQuerySelector('#cover-upload');
        const preview = safeQuerySelector('.upload-preview');
        
        if (avatarInput) avatarInput.value = '';
        if (coverInput) coverInput.value = '';
        if (preview) preview.innerHTML = '';
    }
}

// Função para validar arquivo de imagem
function validateImageFile(file) {
    if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem válida');
    }
    
    // Verificar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB');
    }
    
    return true;
}

// Função para salvar upload
function saveUpload() {
    const avatarInput = safeQuerySelector('#avatar-upload');
    const coverInput = safeQuerySelector('#cover-upload');
    
    try {
        if (profileState.uploadType === 'avatar' && avatarInput?.files.length > 0) {
            const file = avatarInput.files[0];
            validateImageFile(file);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profileState.currentUser.avatar = e.target.result;
                updateProfileUI();
                showNotification('Foto de perfil atualizada!', 'success');
                closeUploadModal();
            };
            reader.onerror = function() {
                showNotification('Erro ao ler arquivo', 'error');
            };
            reader.readAsDataURL(file);
            
        } else if (profileState.uploadType === 'cover' && coverInput?.files.length > 0) {
            const file = coverInput.files[0];
            validateImageFile(file);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profileState.currentUser.cover = e.target.result;
                updateProfileUI();
                showNotification('Foto de capa atualizada!', 'success');
                closeUploadModal();
            };
            reader.onerror = function() {
                showNotification('Erro ao ler arquivo', 'error');
            };
            reader.readAsDataURL(file);
            
        } else {
            showNotification('Selecione uma imagem para upload', 'error');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Função para alterar senha
async function changePassword(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const currentPasswordInput = form.querySelector('#current-password');
        const newPasswordInput = form.querySelector('#new-password');
        const confirmPasswordInput = form.querySelector('#confirm-password');
        
        if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
            throw new Error('Campos de senha não encontrados');
        }
        
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validações
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Todos os campos são obrigatórios', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('A nova senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }
        
        // Simulação de alteração de senha
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Limpar formulário
        form.reset();
        
        // Fechar modal
        closePasswordModal();
        
        showNotification('Senha alterada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        showNotification(error.message || 'Erro ao alterar senha', 'error');
    }
}

// Função para abrir modal de senha
function openPasswordModal() {
    const modal = safeQuerySelector('.password-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Função para fechar modal de senha
function closePasswordModal() {
    const modal = safeQuerySelector('.password-modal');
    if (modal) {
        modal.style.display = 'none';
        const form = safeQuerySelector('.password-form');
        if (form) form.reset();
    }
}

// Função para configurar preview de imagem
function setupImagePreview(inputSelector) {
    const input = safeQuerySelector(inputSelector);
    if (input) {
        input.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                try {
                    validateImageFile(file);
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = safeQuerySelector('.upload-preview');
                        if (preview) {
                            preview.innerHTML = `
                                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">
                            `;
                        }
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    showNotification(error.message, 'error');
                    e.target.value = '';
                }
            }
        });
    }
}

// Função para configurar event listener com segurança
function safeAddEventListener(selector, event, handler) {
    const element = safeQuerySelector(selector);
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.warn(`Não foi possível adicionar event listener para: ${selector}`);
    }
}

// Event Listeners principais
document.addEventListener('DOMContentLoaded', () => {
    // Carregar perfil
    loadUserProfile();
    
    // Configurar botões principais
    safeAddEventListener('.edit-profile-btn', 'click', toggleEditMode);
    safeAddEventListener('.edit-profile-form', 'submit', saveProfileChanges);
    safeAddEventListener('.change-password-btn', 'click', openPasswordModal);
    
    // Configurar botões de cancelar no formulário de edição
    safeAddEventListener('.edit-profile-form .btn-cancel', 'click', (e) => {
        e.preventDefault();
        toggleEditMode();
    });
    
    // Configurar modais de senha
    safeAddEventListener('.password-modal .btn-cancel', 'click', closePasswordModal);
    safeAddEventListener('.password-form', 'submit', changePassword);
    
    // Configurar modais de upload
    safeAddEventListener('.upload-modal .btn-cancel', 'click', closeUploadModal);
    safeAddEventListener('.upload-modal .btn-save', 'click', saveUpload);
    
    // Configurar preview de imagens
    setupImagePreview('#avatar-upload');
    setupImagePreview('#cover-upload');
    
    // Fechar modais ao clicar fora deles
    document.addEventListener('click', function(e) {
        const modals = ['.upload-modal', '.password-modal'];
        modals.forEach(modalSelector => {
            const modal = safeQuerySelector(modalSelector);
            if (modal && e.target === modal) {
                if (modalSelector === '.upload-modal') {
                    closeUploadModal();
                } else if (modalSelector === '.password-modal') {
                    closePasswordModal();
                }
            }
        });
    });
    
    // Configurar tecla ESC para fechar modais
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeUploadModal();
            closePasswordModal();
        }
    });
});

// Torna as funções globais disponíveis para onclick no HTML
window.openUploadModal = openUploadModal;
window.openChat = openChat;