function switchTab(element, tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            element.classList.add('active');
            
            // Here you would typically load content based on the selected tab
            // For demonstration, just log the tab change
            console.log(`Switched to ${tabName} tab`);
        }
        
        function createNewPost() {
            const textarea = document.querySelector('.new-post-form textarea');
            const topicsInput = document.querySelector('.new-post-form input');
            
            if (textarea.value.trim() === '') {
                alert('Por favor, escreva algo para publicar.');
                return;
            }
            
            const content = textarea.value;
            const topics = topicsInput.value ? topicsInput.value.split(',').map(topic => topic.trim()) : [];
            
            console.log('Nova publicação:', { content, topics });
            
            // Aqui você adicionaria o código para enviar a publicação para o servidor
            // E atualizar a interface para mostrar a nova publicação
            
            // Limpar os campos após publicar
            textarea.value = '';
            topicsInput.value = '';
            
            // Feedback para o usuário
            alert('Publicação criada com sucesso!');
        }
        
        function openProfileMenu() {
            // Simular abertura de menu de perfil
            const hasLoginPage = true; // Definir como true se a página de login existir
            
            if (hasLoginPage) {
                // Redirecionar para a página de login
                window.location.href = 'login.html';
            } else {
                alert('Menu de perfil (em desenvolvimento)');
            }
        }

        // Adiciona funcionalidade aos botões de ação das postagens
        document.addEventListener('DOMContentLoaded', function() {
            const likeButtons = document.querySelectorAll('.post-action:first-child');
            
            likeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const countElement = this.querySelector('span:last-child');
                    let count = parseInt(countElement.textContent);
                    
                    // Toggle like
                    if (this.classList.contains('liked')) {
                        count--;
                        this.classList.remove('liked');
                    } else {
                        count++;
                        this.classList.add('liked');
                    }
                    
                    countElement.textContent = count;
                });
            });
        });
        
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
        document.addEventListener('DOMContentLoaded', function() {
            createThemeToggle();
        });

