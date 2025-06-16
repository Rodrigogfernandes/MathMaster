// File: components/menu.js
// MathMaster - Menu de Perfil com Modal de Confirmação

class ProfileMenu {
    constructor() {
        this.isOpen = false;
        this.userData = {
            name: 'Aluno',
            email: 'aluno@mathmaster.com',
            level: 'Iniciante',
            coins: 350,
            lessonsCompleted: 0,
            achievements: 0,
            joinDate: new Date().toLocaleDateString('pt-BR')
        };
        
        this.init();
    }

    init() {
        this.createStyles();
        this.setupEventListeners();
    }

    // Cria estilos CSS do menu
    createStyles() {
        if (document.getElementById('profileMenuStyles')) return;

        const style = document.createElement('style');
        style.id = 'profileMenuStyles';
        style.textContent = `
            .profile-menu {
                position: absolute;
                top: 70px;
                right: 20px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07);
                padding: 0;
                min-width: 320px;
                max-width: 380px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .profile-menu.show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .profile-menu::before {
                content: '';
                position: absolute;
                top: -8px;
                right: 25px;
                width: 16px;
                height: 16px;
                background: white;
                border: 1px solid rgba(0,0,0,0.1);
                border-bottom: none;
                border-right: none;
                transform: rotate(45deg);
                z-index: -1;
            }
            
            .profile-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 25px;
                border-radius: 15px 15px 0 0;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .profile-header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                transform: rotate(45deg);
            }
            
            .profile-user-info {
                display: flex;
                align-items: center;
                gap: 15px;
                position: relative;
                z-index: 1;
            }
            
            .profile-avatar {
                width: 60px;
                height: 60px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 24px;
                border: 3px solid rgba(255,255,255,0.3);
                backdrop-filter: blur(10px);
            }
            
            .profile-details h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            }
            
            .profile-details p {
                margin: 5px 0 0 0;
                opacity: 0.9;
                font-size: 14px;
            }
            
            .profile-level {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                margin-top: 8px;
                backdrop-filter: blur(10px);
            }
            
           
            
             .stat:last-child {
                 border-right: none;
             }
            
             .stat:hover {
                 background:rgba(233, 236, 239, 0.24);
             }
            
            .stat-icon {
                display: block;
                font-size: 28px;
                margin-bottom: 5px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }
            
            .stat-value {
                display: block;
                font-weight: bold;
                font-size: 20px;
                color: #333;
                margin-bottom: 4px;
            }
            
            .stat-label {
                display: block;
                font-size: 12px;
                color: #666;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .profile-actions {
                padding: 20px;
                background: white;
                border-radius: 0 0 15px 15px;
            }
            
            .profile-section {
                margin-bottom: 20px;
            }
            
            .profile-section:last-child {
                margin-bottom: 0;
            }
            
           
            
            .profile-btn {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 12px 15px;
                border: none;
                border-radius: 10px;
                background: transparent;
                color: #333;
                text-align: left;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                width: 100%;
                // margin-bottom: 5px;
                position: relative;
                overflow: hidden;
            }
            
            .profile-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.5s ease;
            }
            
            .profile-btn:hover::before {
                left: 100%;
            }
            
            .profile-btn:hover {
                background: #f8f9fa;
                transform: translateX(5px);
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .profile-btn:last-child {
                margin-bottom: 0;
            }
            
            .profile-btn.danger {
                color: #dc3545;
            }
            
            .profile-btn.danger:hover {
                background: #fff5f5;
                color: #c82333;
            }
            
            .profile-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .profile-btn.primary:hover {
                transform: translateX(5px) translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            }
            
            .profile-btn-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
            }
            
            .profile-menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.1);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .profile-menu-overlay.show {
                opacity: 1;
                pointer-events: all;
            }
            
            /* Modal de Confirmação */
            .confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .confirmation-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                padding: 0;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            
            .confirmation-modal.show .modal-content {
                transform: scale(1) translateY(0);
            }
            
            .modal-header {
                padding: 30px 30px 20px;
                text-align: center;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .modal-header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                transform: rotate(45deg);
            }
            
            .modal-icon {
                font-size: 48px;
                margin-bottom: 15px;
                display: block;
                position: relative;
                z-index: 1;
            }
            
            .modal-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0;
                position: relative;
                z-index: 1;
            }
            
            .modal-body {
                padding: 30px;
                text-align: center;
            }
            
            .modal-message {
                font-size: 16px;
                color: #666;
                line-height: 1.5;
                margin: 0 0 30px 0;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 20px;
            }
            
            .modal-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 100px;
                position: relative;
                overflow: hidden;
            }
            
            .modal-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s ease;
            }
            
            .modal-btn:hover::before {
                left: 100%;
            }
            
            .modal-btn.cancel {
                background: #f8f9fa;
                color: #666;
                border: 2px solid #e9ecef;
            }
            
            .modal-btn.cancel:hover {
                background: #e9ecef;
                color: #333;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .modal-btn.confirm {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                color: white;
            }
            
            .modal-btn.confirm:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            }
            
            @media (max-width: 768px) {
                .profile-menu {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
                
                .modal-content {
                    margin: 20px;
                    width: auto;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .modal-btn {
                    width: 100%;
                }
            }
            
            .profile-quick-stats {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .quick-stat {
                flex: 1;
                background: rgba(255,255,255,0.2);
                padding: 5px;
                border-radius: 8px;
                text-align: center;
                backdrop-filter: blur(10px);
            }
            
            .quick-stat-value {
                font-weight: bold;
                font-size: 16px;
                display: block;
            }
            
            .quick-stat-label {
                font-size: 11px;
                opacity: 0.8;
                margin-top: 2px;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configura event listeners
    setupEventListeners() {
        // Fechar menu ao clicar fora
        document.addEventListener('click', (event) => {
            const avatar = document.querySelector('.avatar');
            const profileMenu = document.getElementById('profileMenu');
            const overlay = document.getElementById('profileMenuOverlay');
            
            if (this.isOpen && avatar && !avatar.contains(event.target) && 
                profileMenu && !profileMenu.contains(event.target)) {
                this.close();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Fechar ao clicar no overlay
        document.addEventListener('click', (event) => {
            if (event.target.id === 'profileMenuOverlay') {
                this.close();
            }
        });

        // Atualizar posição do menu no scroll
        window.addEventListener('scroll', () => {
            this.updateMenuPosition();
        });

        // Atualizar posição no resize
        window.addEventListener('resize', () => {
            this.updateMenuPosition();
        });
    }

    // Atualiza posição do menu baseado no scroll
    updateMenuPosition() {
        const profileMenu = document.getElementById('profileMenu');
        if (!profileMenu || !this.isOpen) return;

        const avatar = document.querySelector('.avatar');
        if (!avatar) return;

        const avatarRect = avatar.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Posiciona o menu relativo ao avatar
        profileMenu.style.top = (avatarRect.bottom + scrollTop + 10) + 'px';
        profileMenu.style.right = '20px';
    }

    // Abre o menu
    open() {
        if (this.isOpen) {
            this.close();
            return;
        }

        let profileMenu = document.getElementById('profileMenu');
        let overlay = document.getElementById('profileMenuOverlay');
        
        if (!profileMenu) {
            profileMenu = this.createMenu();
            document.body.appendChild(profileMenu);
        }
        
        if (!overlay) {
            overlay = this.createOverlay();
            document.body.appendChild(overlay);
        }
        
        this.updateMenuData();
        this.updateMenuPosition();
        
        // Mostra overlay
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('show'), 10);
        
        // Mostra menu
        profileMenu.style.display = 'block';
        setTimeout(() => {
            profileMenu.classList.add('show');
        }, 10);
        
        this.isOpen = true;
    }

    // Fecha o menu
    close() {
        const profileMenu = document.getElementById('profileMenu');
        const overlay = document.getElementById('profileMenuOverlay');
        
        if (profileMenu) {
            profileMenu.classList.remove('show');
            setTimeout(() => {
                profileMenu.style.display = 'none';
            }, 300);
        }
        
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
        
        this.isOpen = false;
    }

    // Cria overlay
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'profileMenuOverlay';
        overlay.className = 'profile-menu-overlay';
        return overlay;
    }

    // Cria o menu
    createMenu() {
        const menu = document.createElement('div');
        menu.id = 'profileMenu';
        menu.className = 'profile-menu';
        menu.innerHTML = this.getMenuHTML();
        return menu;
    }

    // HTML do menu
    getMenuHTML() {
        return `
            <div class="profile-header">
                <div class="profile-user-info">
                    <div class="profile-avatar">${this.userData.name.charAt(0).toUpperCase()}</div>
                    <div class="profile-details">
                        <h3>${this.userData.name}</h3>
                        <p>${this.userData.email}</p>
                        <span class="profile-level">${this.userData.level}</span>
                    </div>
                </div>
                <div class="profile-quick-stats">
                    <div class="quick-stat">
                         <span class="stat-icon">🪙</span>
                        <span class="quick-stat-value">${this.userData.coins}</span>
                        <span class="quick-stat-label">Moedas</span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-icon">🏆</span>
                        <span class="quick-stat-value">${this.userData.coins}</span>
                        <span class="quick-stat-label">Moedas</span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-icon">📚</span>
                        <span class="quick-stat-value">${this.userData.lessonsCompleted}</span>
                        <span class="quick-stat-label">Lições</span>
                    </div>
                </div>
            </div>
            
            <div class="profile-stats">
                
               
               
            </div>
            
            <div class="profile-actions">
                <div class="profile-section">
                    
                    <button onclick="profileMenu.editProfile()" class="profile-btn">
                        <span class="profile-btn-icon">👤</span>
                        <span>Meu Perfil</span>
                    </button>
                    <button onclick="profileMenu.viewProgress()" class="profile-btn">
                        <span class="profile-btn-icon">📊</span>
                        <span>Meu Progresso</span>
                    </button>
                    <button onclick="profileMenu.achievements()" class="profile-btn">
                        <span class="profile-btn-icon">🏆</span>
                        <span>Minhas Conquistas</span>
                    </button>
                    <button onclick="profileMenu.settings()" class="profile-btn">
                        <span class="profile-btn-icon">⚙️</span>
                        <span>Configurações</span>
                    </button>                  
                    <button onclick="profileMenu.logout()" class="profile-btn danger">
                        <span class="profile-btn-icon">🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Cria modal de confirmação
    createConfirmationModal() {
        const modal = document.createElement('div');
        modal.id = 'confirmationModal';
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-icon">🚪</span>
                    <h3 class="modal-title">Confirmar Saída</h3>
                </div>
                <div class="modal-body">
                    <p class="modal-message">
                        Tem certeza que deseja sair da sua conta?<br>
                        Você precisará fazer login novamente para acessar o MathMaster.
                    </p>
                    <div class="modal-actions">
                        <button onclick="profileMenu.cancelLogout()" class="modal-btn cancel">
                            Cancelar
                        </button>
                        <button onclick="profileMenu.confirmLogout()" class="modal-btn confirm">
                            Sim, Sair
                        </button>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // Mostra modal de confirmação
    showConfirmationModal() {
        let modal = document.getElementById('confirmationModal');
        
        if (!modal) {
            modal = this.createConfirmationModal();
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Fechar modal com ESC
        const escHandler = (event) => {
            if (event.key === 'Escape') {
                this.hideConfirmationModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Fechar modal clicando fora
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideConfirmationModal();
            }
        });
    }

    // Esconde modal de confirmação
    hideConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // Atualiza dados do menu
    updateMenuData() {
        const profileMenu = document.getElementById('profileMenu');
        if (!profileMenu) return;

        // Atualiza valores
        const coinElements = profileMenu.querySelectorAll('.stat-value, .quick-stat-value');
        coinElements[0].textContent = this.userData.coins; // stat
        if (coinElements[2]) coinElements[2].textContent = this.userData.coins; // quick-stat
        
        const lessonElements = profileMenu.querySelectorAll('.stat-value');
        if (lessonElements[1]) lessonElements[1].textContent = this.userData.lessonsCompleted;
        
        const achievementElements = profileMenu.querySelectorAll('.stat-value');
        if (achievementElements[2]) achievementElements[2].textContent = this.userData.achievements;
    }

    // Atualiza dados do usuário
    updateUserData(data) {
        this.userData = { ...this.userData, ...data };
        this.updateMenuData();
    }

    // Ações do menu
    editProfile() {
        this.close();
        
         // Adiciona efeito de loading
         setTimeout(() => {
            this.showNotification('Até logo! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);
        }, 1500);
    }

    viewProgress() {
        this.close();
        this.showNotification('Relatório de progresso em desenvolvimento!', 'info');
    }

    achievements() {
        this.close();
      

         // Adiciona efeito de loading
        setTimeout(() => {
            this.showNotification('Até logo! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'conquistas.html';
            }, 1000);
        }, 1500);
    }

    settings() {
        this.close();
        this.showNotification('Configurações em desenvolvimento!', 'info');
    }

    help() {
        this.close();
        this.showNotification('Central de ajuda em desenvolvimento!', 'info');
    }

    // Inicia processo de logout
    logout() {
        this.close();
        this.showConfirmationModal();
    }

    // Cancela logout
    cancelLogout() {
        this.hideConfirmationModal();
    }

    // Confirma logout
    confirmLogout() {
        this.hideConfirmationModal();
        this.showNotification('Saindo da sua conta...', 'info');
        
        // Adiciona efeito de loading
        setTimeout(() => {
            this.showNotification('Até logo! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }, 1500);
    }

    // Sistema de notificações integrado
    showNotification(message, type = 'info', duration = 3000) {
        // Verifica se existe sistema de notificações global
        if (typeof showNotification === 'function') {
            showNotification(message, type, duration);
            return;
        }

        // Fallback simples
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            z-index: 2001;
            max-width: 300px;
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove notificação
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
}

// Instância global do menu de perfil
const profileMenu = new ProfileMenu();

// Função global para abrir o menu (compatibilidade com o HTML)
function openProfileMenu() {
    profileMenu.open();
}