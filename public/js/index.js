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
            window.location.href = 'dashboard.html';
        }

        // Inicializar quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            checkSavedTheme();
            
            // Fechar o modal ao clicar fora dele
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('loginModal');
                if (event.target === modal) {
                    closeLoginModal();
                }
            });
            
            // Inicializar dados simulados
            updateActivityStats();
            
            // Verificar notificações a cada 30 segundos (simulação)
            setInterval(function() {
                document.querySelector('.notifications-count').textContent = 
                    Math.floor(Math.random() * 5) + 1;
            }, 30000);
        });

