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
            strengthBar.style.width = '0';

            if (password.length === 0) {
                return;
            }

            // Critérios para verificar a força da senha
            const hasLowerCase = /[a-z]/.test(password);
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isLongEnough = password.length >= 8;

            // Calcular pontuação
            let score = 0;
            if (hasLowerCase) score++;
            if (hasUpperCase) score++;
            if (hasNumber) score++;
            if (hasSpecialChar) score++;
            if (isLongEnough) score++;

            // Definir a força com base na pontuação
            if (score <= 1) {
                strengthBar.classList.add('weak');
            } else if (score <= 3) {
                strengthBar.classList.add('medium');
            } else {
                strengthBar.classList.add('strong');
            }

            // Ajustar a largura da barra de força
            strengthBar.style.width = `${(score / 5) * 100}%`;
        }

        // Adicionar o event listener ao campo de senha
        document.addEventListener('DOMContentLoaded', () => {
            const passwordField = document.getElementById('register-password');
            if (passwordField) {
                passwordField.addEventListener('input', checkPasswordStrength);
            }
        });

        // Função para validar o formulário de login
        async function login(event) {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            let isValid = true;

            // Resetar mensagens de erro
            document.getElementById('login-email-error').classList.remove('show');
            document.getElementById('login-password-error').classList.remove('show');

            // Validar email
            if (!validateEmail(email)) {
                document.getElementById('login-email-error').classList.add('show');
                isValid = false;
            }

            // Validar senha
            if (password.length < 6) {
                document.getElementById('login-password-error').classList.add('show');
                isValid = false;
            }

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                try {
                    const response = await login(email, password);
                    
                    // Armazenar o token no localStorage
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userName', response.user.name);

                    // Verificar se há um parâmetro de redirecionamento na URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectPage = urlParams.get('redirect');

                    if (redirectPage) {
                        // Redirecionar para a página solicitada
                        window.location.href = redirectPage;
                    } else {
                        // Redirecionar para o dashboard por padrão
                        window.location.href = 'dashboard.html';
                    }
                } catch (error) {
                    console.error('Erro no login:', error);
                    if (error.status === 401) {
                        document.getElementById('login-password-error').classList.add('show');
                    } else {
                        document.getElementById('login-email-error').classList.add('show');
                    }
                }
            }
        }

        // Função para validar o formulário de cadastro
        async function registerUser(event) {
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

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                try {
                    await register({
                        name,
                        email,
                        password
                    });

                    // Mostrar mensagem de sucesso
                    document.getElementById('successMessage').classList.add('show');

                    // Limpar o formulário
                    document.getElementById('register-form').reset();

                    // Mudar para a aba de login após um breve delay
                    setTimeout(() => {
                        switchTab('login');
                    }, 3000);
                } catch (error) {
                    console.error('Erro no registro:', error);
                    if (error.status === 409) {
                        document.getElementById('register-email-error').classList.add('show');
                    } else {
                        alert('Erro ao realizar o cadastro. Por favor, tente novamente.');
                    }
                }
            }
        }

        // Função auxiliar para validar formato de email
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

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

        //--------------------------------------------------------------------
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
                            if ('login.html' !== 'index.html' && 'login.html' !== 'login.html') {
                                window.location.href = '/login.html?redirect=login.html';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao verificar autenticação:', error);
                        // Redirecionar para login em caso de erro (para páginas protegidas)
                        if ('login.html' !== 'index.html' && 'login.html' !== 'login.html') {
                            window.location.href = '/login.html?redirect=login.html';
                        }
                    });
            } else {
                // Sem token, redirecionar para login em páginas protegidas
                if ('login.html' !== 'index.html' && 'login.html' !== 'login.html') {
                    window.location.href = '/login.html?redirect=login.html';
                }
            }
        });