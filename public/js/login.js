// Função para alternar entre as abas de login e cadastro
            function switchTab(tab) {
                // Remove a classe active de todas as abas e formulários
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));

                // Adiciona a classe active à aba selecionada e ao formulário correspondente
                document.getElementById(`${tab}-tab`).classList.add('active');
                document.getElementById(`${tab}-form`).classList.add('active');

                // Esconde a mensagem de sucesso ao mudar de aba
                document.getElementById('successMessage').classList.remove('show');
            }

            // Função para alternar a visibilidade da senha
            function togglePasswordVisibility(inputId) {
                const passwordInput = document.getElementById(inputId);
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Altera o ícone do botão (opcional)
                const button = passwordInput.nextElementSibling;
                button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            }

            // Função para verificar a força da senha
            function checkPasswordStrength() {
                const password = document.getElementById('register-password').value;
                const strengthBar = document.getElementById('password-strength-bar');

                // Remove todas as classes anteriores
                strengthBar.classList.remove('weak', 'medium', 'strong');

                if (password.length === 0) {
                    strengthBar.style.width = '0';
                    return;
                }

                // Critérios para verificar a força da senha
                const hasLowerCase = /[a-z]/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
                const isLongEnough = password.length >= 8;

                // Calcular pontuação
                let score = 0;
                if (hasLowerCase) score++;
                if (hasUpperCase) score++;
                if (hasNumber) score++;
                if (hasSpecialChar) score++;
                if (isLongEnough) score++;

                // Definir a força com base na pontuação
                if (score <= 2) {
                    strengthBar.classList.add('weak');
                } else if (score <= 4) {
                    strengthBar.classList.add('medium');
                } else {
                    strengthBar.classList.add('strong');
                }
            }

            // Função para validar o formulário de login
            function loginUser(event) {
                event.preventDefault();

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                let isValid = true;

                // Resetar mensagens de erro
                document.getElementById('login-email-error').classList.remove('show');
                document.getElementById('login-password-error').classList.remove('show');

                // Validar email (simples validação de formato)
                if (!validateEmail(email)) {
                    document.getElementById('login-email-error').classList.add('show');
                    isValid = false;
                }

                // Validar senha (simulação - em produção, isso seria verificado no servidor)
                if (password.length < 6) {
                    document.getElementById('login-password-error').classList.add('show');
                    isValid = false;
                }

                // Se tudo estiver válido, enviar o formulário (simulação)
                if (isValid) {
                    console.log('Login bem-sucedido!');
                    // Aqui você adicionaria o código para enviar os dados ao servidor
                    // E redirecionar o usuário para a página principal após autenticação
                    alert('Login bem-sucedido! Redirecionando...');
                }
            }

            // Função para validar o formulário de cadastro
            function registerUser(event) {
                event.preventDefault();

                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                const termsAccepted = document.getElementById('terms-and-conditions').checked;

                let isValid = true;

                // Resetar mensagens de erro
                document.getElementById('register-name-error').classList.remove('show');
                document.getElementById('register-email-error').classList.remove('show');
                document.getElementById('register-password-error').classList.remove('show');
                document.getElementById('register-confirm-password-error').classList.remove('show');

                // Validar nome
                if (name.trim().length < 3 || !name.includes(' ')) {
                    document.getElementById('register-name-error').classList.add('show');
                    isValid = false;
                }

                // Validar email
                if (!validateEmail(email)) {
                    document.getElementById('register-email-error').classList.add('show');
                    isValid = false;
                }

                // Validar senha
                if (password.length < 8) {
                    document.getElementById('register-password-error').classList.add('show');
                    isValid = false;
                }

                // Validar confirmação de senha
                if (password !== confirmPassword) {
                    document.getElementById('register-confirm-password-error').classList.add('show');
                    isValid = false;
                }

                // Verificar termos e condições
                if (!termsAccepted) {
                    alert('Por favor, aceite os termos e condições para continuar.');
                    isValid = false;
                }

                // Se tudo estiver válido, enviar o formulário (simulação)
                if (isValid) {
                    console.log('Cadastro bem-sucedido!');
                    // Aqui você adicionaria o código para enviar os dados ao servidor

                    // Mostrar mensagem de sucesso
                    document.getElementById('successMessage').classList.add('show');

                    // Limpar o formulário
                    document.getElementById('register-form').reset();

                    // Mudar para a aba de login após um breve delay
                    setTimeout(() => {
                        switchTab('login');
                    }, 3000);
                }
            }

            // Função auxiliar para validar formato de email
            function validateEmail(email) {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }

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

            // Inicialização quando o DOM estiver completamente carregado
            document.addEventListener('DOMContentLoaded', function () {
                // Verificar se há parâmetros na URL para determinar qual aba mostrar inicialmente
                const urlParams = new URLSearchParams(window.location.search);
                const tabParam = urlParams.get('tab');

                if (tabParam === 'register') {
                    switchTab('register');
                } else {
                    switchTab('login');
                }

                // Adicionar listeners para animações de foco nos campos de formulário (opcional)
                document.querySelectorAll('.form-control').forEach(input => {
                    input.addEventListener('focus', function () {
                        this.parentElement.classList.add('focused');
                    });

                    input.addEventListener('blur', function () {
                        this.parentElement.classList.remove('focused');
                    });
                });
            });

            // Adiciona validação em tempo real para a confirmação de senha
            document.addEventListener('DOMContentLoaded', function () {
                const confirmPassword = document.getElementById('register-confirm-password');
                confirmPassword.addEventListener('keyup', function () {
                    const password = document.getElementById('register-password').value;

                    if (this.value !== password) {
                        document.getElementById('register-confirm-password-error').classList.add('show');
                    } else {
                        document.getElementById('register-confirm-password-error').classList.remove('show');
                    }
                });
            });

