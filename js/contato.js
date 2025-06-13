  // Função para enviar o formulário de contato (simulação)
        function submitContactForm(event) {
            event.preventDefault();
            
            // Simulação de envio - em um ambiente real, você enviaria para o servidor
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            console.log('Formulário enviado:', { name, email, subject, message });
            
            // Mostrar mensagem de sucesso
            document.getElementById('contactSuccessMessage').classList.add('show');
            
            // Limpar o formulário
            document.getElementById('contactForm').reset();
            
            // Esconder a mensagem após alguns segundos
            setTimeout(() => {
                document.getElementById('contactSuccessMessage').classList.remove('show');
            }, 5000);
        }
        
        // Verificar autenticação
        document.addEventListener('DOMContentLoaded', function() {
            // Criar o botão de tema
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

            // Verificar se há um token no localStorage
            const token = localStorage.getItem('token');
            if (token) {
                // Fazer requisição para verificar o token
                fetch('/api/auth/me', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Usuário autenticado, atualizar UI
                        updateUserInterface(data.data);
                        
                        // Inicializar o sistema de notificações
                        if (window.NotificationSystem) {
                            window.NotificationSystem.init();
                        }
                    }
                })
                .catch(error => {
                    console.error('Erro ao verificar autenticação:', error);
                });
            }
        });

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