// Sistema de notificações
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        // Criar container de notificações se não existir
        if (!document.querySelector('.notifications-container')) {
            const container = document.createElement('div');
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.querySelector('.notifications-container');
        container.appendChild(notification);
        
        // Forçar reflow
        notification.offsetHeight;
        
        // Adicionar classe para animação
        notification.classList.add('show');
        
        // Adicionar à lista de notificações ativas
        this.notifications.push(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            this.remove(notification);
        }, 3000);
    }

    remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
            // Remover da lista de notificações ativas
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// Criar instância global
const notifications = new NotificationSystem();

// Exportar para uso global
window.showNotification = (message, type) => notifications.show(message, type);

// Adicionar estilos de animação para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.error {
        background: #e74c3c;
    }
`;

document.head.appendChild(notificationStyles);
// Exportar função para mostrar notificações
 


// Exemplo de uso:
// showNotification('Bem-vindo ao MathMaster!', 'info');
// showNotification('Erro ao salvar!', 'error');