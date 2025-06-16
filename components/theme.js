// Função para alternar entre tema claro e escuro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        // Aplicar variáveis de estilo do tema escuro
        document.documentElement.style.setProperty('--light-bg', '#1f2937');
        document.documentElement.style.setProperty('--white', '#374151');
        document.documentElement.style.setProperty('--text', '#e5e7eb');
        document.documentElement.style.setProperty('--primary', '#60a5fa');
        document.documentElement.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
    } else {
        // Restaurar variáveis do tema claro
        document.documentElement.style.setProperty('--light-bg', '#f5f7fa');
        document.documentElement.style.setProperty('--white', '#ffffff');
        document.documentElement.style.setProperty('--text', '#333333');
        document.documentElement.style.setProperty('--primary', '#4a6fa5');
        document.documentElement.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    }
}

// Função para criar o botão de alternância de tema
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

// Inicializar o tema quando o documento for carregado
document.addEventListener('DOMContentLoaded', () => {
    createThemeToggle();
});