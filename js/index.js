
        // Play/Pause button
        const playPauseButton = document.querySelector('.play-btn');
        let isPlaying = false;

        playPauseButton.addEventListener('click', () => {
            if (isPlaying) {
                playPauseButton.textContent = '▶';
            } else {
                playPauseButton.textContent = '⏸';
            }
            isPlaying = !isPlaying;
        });

        // Volume control
        const volumeControl = document.querySelector('.volume-control');
        const volumeBar = document.querySelector('.volume-bar');
        const volumeLevel = document.querySelector('.volume-level');

        volumeControl.addEventListener('input', () => {
            volumeLevel.style.width = `${volumeControl.value}%`;
        });

        volumeControl.addEventListener('change', () => {
            volumeLevel.style.width = `${volumeControl.value}%`;
        });

        // Modals
        const lessonModal = document.getElementById('lessonModal');
        const rewardAnimation = document.getElementById('rewardAnimation');
        const correctFeedback = document.getElementById('correctFeedback');
        const wrongFeedback = document.getElementById('wrongFeedback');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const loginModal = document.getElementById('loginModal');

        lessonModal.style.display = 'none';
        rewardAnimation.style.display = 'none';
        correctFeedback.style.display = 'none';
        wrongFeedback.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        loginModal.style.display = 'none';

        // Open login modal when clicking login button
        document.getElementById('loginButton').addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'flex';
            document.getElementById('loginEmail').focus();
            document.getElementById('loginEmail').select();
            document.getElementById('loginPassword').focus();
            document.getElementById('loginPassword').select();
            document.getElementById('loginEmailError').style.display = 'none';
            document.getElementById('loginPasswordError').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
            
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('lessonModal')) {
                closeLesson();
            } else if (event.target === document.getElementById('rewardAnimation')) {
                document.getElementById('rewardAnimation').style.display = 'none';
            }else if (event.target === document.getElementById('correctFeedback')) {
                document.getElementById('correctFeedback').style.display = 'none';
            }else if (event.target === document.getElementById('wrongFeedback')) {
                document.getElementById('wrongFeedback').style.display = 'none';
            }else if (event.target === document.getElementById('successMessage')) {
                document.getElementById('successMessage').style.display = 'none';
            }else if (event.target === document.getElementById('errorMessage')) {
                document.getElementById('errorMessage').style.display = 'none';
            }else if (event.target === document.getElementById('loginModal')) {
                document.getElementById('loginModal').style.display = 'none';
            }
        });

        // Open lesson modal
        function openLesson() {
            document.getElementById('lessonModal').style.display = 'flex';
        }

        function closeLesson() {
            document.getElementById('lessonModal').style.display = 'none';
        }

         // Close modal when clicking outside
         window.onclick = function(event) {
            const modal = document.getElementById('lessonModal');
            if (event.target == modal) {
                closeLesson();
            }
        }

        function showCorrectAnswer() {
            document.getElementById('correctFeedback').style.display = 'block';
            
            // Show reward animation
            const rewardAnim = document.getElementById('rewardAnimation');
            rewardAnim.style.display = 'block';
            
            setTimeout(() => {
                rewardAnim.style.display = 'none';
            }, 2000);
            
            // Update coins
            const coinsElement = document.querySelector('.coins span:last-child');
            const currentCoins = parseInt(coinsElement.textContent);
            coinsElement.textContent = currentCoins + 15;
            
            // Update progress bar
            const progressBar = document.querySelector('.progress-bar');
            progressBar.style.width = '75%';
            document.querySelector('.progress-info span:first-child').textContent = '75% da meta diária';
            document.querySelector('.progress-info span:last-child').textContent = '25 minutos restantes';
        }

        // Verificar tema salvo no localStorage
        function checkSavedTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                updateThemeVars(true);
            }
        }

        // Atualizar variáveis de tema
        function updateThemeVars(isDark) {
            if (isDark) {
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

        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            
            const isDarkTheme = document.body.classList.contains('dark-theme');
            updateThemeVars(isDarkTheme);
            
            // Salvar preferência no localStorage
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        }

        function openProfileMenu() {
            document.getElementById('loginModal').style.display = 'flex';
        }

        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
        }

        function quickLogin() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Por favor, preencha todos os campos');
                return;
            }

            // Aqui você implementaria a lógica real de login
            // Por enquanto, apenas redirecionamos para o dashboard
            window.location.href = 'index.html';
        }

        // Inicialização do script quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // Verificar autenticação
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login.html';
                    return;
                }
                
                // Inicializar dados do usuário
                const userData = await MathMasterAPI.User.getUserData();
                const userStats = await MathMasterAPI.User.getUserStats();
                const topics = await MathMasterAPI.Topics.getUserTopics();
                const progress = await MathMasterAPI.Progress.getOverallProgress();
                const notifications = await MathMasterAPI.Notifications.getNotifications();
                
                // Atualizar interface com dados reais
                updateUserInterface(userData);
                updateUserStats(userStats);
                renderTopics(topics);
                updateProgress(progress);
                renderNotifications(notifications);
                
                // Configurar eventos de interação
                setupInteractions();
                
                // Atualizar dados periodicamente
                setInterval(async () => {
                    const newStats = await MathMasterAPI.User.getUserStats();
                    const newProgress = await MathMasterAPI.Progress.getOverallProgress();
                    const newNotifications = await MathMasterAPI.Notifications.getNotifications();
                    
                    updateUserStats(newStats);
                    updateProgress(newProgress);
                    renderNotifications(newNotifications);
                }, 30000);
                
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                // Tratar erro apropriadamente
                if (error.message === 'Token inválido' || error.message === 'Token expirado') {
                    window.location.href = '/login.html';
                }
            }
        });

        // Função para configurar interações
        function setupInteractions() {
            // Configurar botões de ação rápida
            document.querySelectorAll('.quick-action').forEach(button => {
                button.addEventListener('click', async () => {
                    const action = button.dataset.action;
                    try {
                        switch (action) {
                            case 'continue':
                                const lastTopic = await MathMasterAPI.Topics.getLastTopic();
                                if (lastTopic) {
                                    window.location.href = `/topic.html?id=${lastTopic.id}`;
                                }
                                break;
                            case 'practice':
                                const practiceSession = await MathMasterAPI.Topics.startPractice();
                                window.location.href = `/practice.html?session=${practiceSession.id}`;
                                break;
                            case 'challenge':
                                const dailyChallenge = await MathMasterAPI.Topics.getDailyChallenge();
                                window.location.href = `/challenge.html?id=${dailyChallenge.id}`;
                                break;
                        }
                    } catch (error) {
                        console.error('Erro na ação rápida:', error);
                        showNotification('Erro ao executar ação. Tente novamente.', 'error');
                    }
                });
            });
            
            // Configurar notificações
            document.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const notificationId = item.dataset.notificationId;
                    try {
                        await MathMasterAPI.Notifications.markAsRead(notificationId);
                        item.classList.add('read');
                    } catch (error) {
                        console.error('Erro ao marcar notificação como lida:', error);
                    }
                });
            });
            
            // Configurar pesquisa
            const searchInput = document.querySelector('#search-input');
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(async () => {
                        const searchTerm = e.target.value.trim();
                        if (searchTerm) {
                            try {
                                const searchResults = await MathMasterAPI.Topics.searchTopics(searchTerm);
                                renderSearchResults(searchResults);
                            } catch (error) {
                                console.error('Erro na pesquisa:', error);
                            }
                        } else {
                            hideSearchResults();
                        }
                    }, 300);
                });
            }
        }

        // Função para renderizar tópicos do usuário
        function renderTopics(topics) {
            const topicsContainer = document.querySelector('.topics-container');
            if (!topicsContainer) return;
            
            const html = topics.map(topic => `
                <div class="topic-card ${topic.isActive ? 'active' : ''}" data-topic-id="${topic.id}">
                    <div class="topic-icon">${topic.icon}</div>
                    <div class="topic-info">
                        <h3>${topic.name}</h3>
                        <div class="topic-progress">
                            <div class="progress-bar" style="width: ${topic.progress}%"></div>
                            <span>${topic.progress}%</span>
                        </div>
                    </div>
                    <div class="topic-stats">
                        <span>${topic.completedLessons}/${topic.totalLessons} aulas</span>
                        <span>${topic.xp} XP</span>
                    </div>
                </div>
            `).join('');
            
            topicsContainer.innerHTML = html;
            
            // Adicionar eventos de clique nos tópicos
            document.querySelectorAll('.topic-card').forEach(card => {
                card.addEventListener('click', () => {
                    const topicId = card.dataset.topicId;
                    window.location.href = `/topic.html?id=${topicId}`;
                });
            });
        }

        // Função para renderizar notificações
        function renderNotifications(notifications) {
            const notificationsContainer = document.querySelector('.notifications-container');
            if (!notificationsContainer) return;
            
            const html = notifications.map(notification => `
                <div class="notification-item ${notification.read ? 'read' : ''}" data-notification-id="${notification.id}">
                    <div class="notification-icon">
                        <i class="fas ${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${formatTimeAgo(notification.createdAt)}</div>
                    </div>
                </div>
            `).join('');
            
            notificationsContainer.innerHTML = html;
        }

        // Função para obter ícone da notificação
        function getNotificationIcon(type) {
            switch (type) {
                case 'achievement':
                    return 'fa-trophy';
                case 'level-up':
                    return 'fa-star';
                case 'reminder':
                    return 'fa-bell';
                case 'challenge':
                    return 'fa-flag';
                default:
                    return 'fa-info-circle';
            }
        }

        // Função para formatar tempo relativo
        function formatTimeAgo(date) {
            const now = new Date();
            const past = new Date(date);
            const diff = Math.floor((now - past) / 1000);
            
            if (diff < 60) return 'agora mesmo';
            if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
            if (diff < 2592000) return `${Math.floor(diff / 86400)} dias atrás`;
            return past.toLocaleDateString();
        }

        // Função para renderizar resultados da pesquisa
        function renderSearchResults(results) {
            const searchResults = document.querySelector('.search-results');
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
                searchResults.style.display = 'block';
                return;
            }
            
            const html = results.map(result => `
                <div class="search-result" onclick="window.location.href='/topic.html?id=${result.id}'">
                    <div class="result-icon">${result.icon}</div>
                    <div class="result-info">
                        <div class="result-title">${result.name}</div>
                        <div class="result-description">${result.description}</div>
                    </div>
                </div>
            `).join('');
            
            searchResults.innerHTML = html;
            searchResults.style.display = 'block';
        }

        // Função para esconder resultados da pesquisa
        function hideSearchResults() {
            const searchResults = document.querySelector('.search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }

        // Função para atualizar o progresso geral
        function updateProgress(progress) {
            // Atualizar barra de progresso geral
            const progressBar = document.querySelector('.overall-progress .progress-bar');
            const progressText = document.querySelector('.overall-progress .progress-text');
            
            if (progressBar && progressText) {
                progressBar.style.width = `${progress.percentage}%`;
                progressText.textContent = `${progress.percentage}%`;
            }
            
            // Atualizar estatísticas
            const stats = document.querySelector('.progress-stats');
            if (stats) {
                stats.innerHTML = `
                    <div class="stat">
                        <span class="stat-value">${progress.completedTopics}</span>
                        <span class="stat-label">Tópicos Concluídos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${progress.totalXP}</span>
                        <span class="stat-label">XP Total</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${progress.streak}</span>
                        <span class="stat-label">Dias Seguidos</span>
                    </div>
                `;
            }
        }

        // Função para mostrar notificações
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Função para fazer logout
        async function logout() {
            try {
                await MathMasterAPI.User.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
            }
        }

         // Verificar autenticação
        document.addEventListener('DOMContentLoaded', function () {
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
                        } else {
                            // Token inválido, redirecionar para login em páginas protegidas
                            if (false) { // A página index não requer login
                                window.location.href = '/login.html?redirect=index.html';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao verificar autenticação:', error);
                        // Redirecionar para login em caso de erro (para páginas protegidas)
                        if (false) { // A página index não requer login
                            window.location.href = '/login.html?redirect=index.html';
                        }
                    });
            } else {
                // Sem token, redirecionar para login em páginas protegidas
                if (false) { // A página index não requer login
                    window.location.href = '/login.html?redirect=index.html';
                }
            }
        });
    