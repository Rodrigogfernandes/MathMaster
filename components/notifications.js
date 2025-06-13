// Função para exibir uma notificação simples na tela
function showNotification(message, type = 'info') {
    // Cria o elemento da notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerText = message;

    // Estiliza a notificação (básico)
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.background = type === 'error' ? '#f44336' : '#2196f3';
    notification.style.color = '#fff';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = 1000;

    // Adiciona ao body
    document.body.appendChild(notification);

    // Remove após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Exemplo de uso:
// showNotification('Bem-vindo ao MathMaster!', 'info');
// showNotification('Erro ao salvar!', 'error');