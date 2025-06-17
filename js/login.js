/**
 * js/login.js - Lógica para a página de autenticação
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Adiciona o "ouvinte" para o evento de submissão do formulário de LOGIN
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o recarregamento da página
        const email = document.getElementById('loginEmail').value; // Pega o email digitado
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('login-error');
        errorElement.style.display = 'none';

        try {
            // Chama a função de login da nossa API unificada
            const response = await window.MathMasterAPI.Auth.login(email, password); // POST /api/auth/login

            // Salva os dados do token e do usuário no navegador (localStorage)
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('user_name', response.userName); //
            localStorage.setItem('user_id', response.userId); //
            localStorage.setItem('user_role', response.role); //
            localStorage.setItem('user_email', email); // NOVO: Salva o email do usuário no localStorage

            // Redirecionamento condicional baseado no papel do usuário
            if (response.role === 'ADMIN') {
                if (confirm('Você é um administrador! Deseja ir para o Painel Administrativo?')) {
                    window.location.href = 'admin.html'; //
                } else {
                    window.location.href = 'index.html'; //
                }
            } else {
                window.location.href = 'index.html'; //
            }

        } catch (error) {
            console.error("Erro no login:", error);
            errorElement.textContent = error.message || 'Erro no login. Tente novamente.';
            errorElement.style.display = 'block';
        }
    });

    // Adiciona o "ouvinte" para o evento de submissão do formulário de REGISTRO
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorElement = document.getElementById('register-email-error');
        errorElement.style.display = 'none';

        const userData = { name, email, password };

        try {
            await window.MathMasterAPI.Auth.register(userData); // POST /api/auth/register

            alert('Cadastro realizado com sucesso! Você será redirecionado para a aba de login.');
            window.location.reload();

        } catch (error) {
            console.error("Erro no registro:", error);
            errorElement.textContent = error.message || 'Erro no registro. Tente novamente.';
            errorElement.style.display = 'block';
        }
    });
});