/**
 * MathMaster - Página de Login e Cadastro
 * Revisado e corrigido
 */

// ==================== Funções de UI ====================

const ERROR_DEFAULTS = {
    'register-name-error': 'Por favor, informe seu nome completo',
    'register-email-error': 'Email inválido ou já cadastrado',
    'register-password-error': 'A senha deve ter pelo menos 8 caracteres',
    'register-confirm-password-error': 'As senhas não coincidem'
};

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));

    const tabEl = document.getElementById(tab + '-tab');
    const formEl = document.getElementById(tab + '-form');
    if (tabEl) tabEl.classList.add('active');
    if (formEl) formEl.classList.add('active');

    const successMsg = document.getElementById('successMessage');
    if (successMsg) successMsg.classList.remove('show');

    if (tab === 'register') {
        Object.entries(ERROR_DEFAULTS).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });
    }
}

function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    if (!passwordInput) return;

    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const button = passwordInput.nextElementSibling;
    if (button && button.classList.contains('toggle-password')) {
        button.textContent = type === 'password' ? '👁️' : '🙈';
    }
}

function checkPasswordStrength() {
    const passwordField = document.getElementById('register-password');
    const strengthBar = document.getElementById('password-strength-bar');
    if (!passwordField || !strengthBar) return;

    const password = passwordField.value;
    strengthBar.classList.remove('weak', 'medium', 'strong');
    strengthBar.style.width = '0';

    if (password.length === 0) return;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    let score = 0;
    if (hasLowerCase) score++;
    if (hasUpperCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    if (isLongEnough) score++;

    if (score <= 1) strengthBar.classList.add('weak');
    else if (score <= 3) strengthBar.classList.add('medium');
    else strengthBar.classList.add('strong');

    strengthBar.style.width = `${(score / 5) * 100}%`;
}

// ==================== API ====================

function getApiBase() {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '' || h === 'null') {
        return 'http://localhost:8080/api';
    }
    return (window.location.origin || 'http://localhost:8080') + '/api';
}

function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

// ==================== Login ====================

async function login(event) {
    event.preventDefault();

    const emailEl = document.getElementById('loginEmail');
    const passwordEl = document.getElementById('loginPassword');
    const pwdErr = document.getElementById('login-password-error');
    const emailErr = document.getElementById('login-email-error');

    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';

    if (emailErr) emailErr.classList.remove('show');
    if (pwdErr) {
        pwdErr.classList.remove('show');
        if (pwdErr.dataset.originalText) pwdErr.textContent = pwdErr.dataset.originalText;
    }

    let isValid = true;
    if (!validateEmail(email)) {
        if (emailErr) emailErr.classList.add('show');
        isValid = false;
    }
    if (password.length < 6) {
        if (pwdErr) pwdErr.classList.add('show');
        isValid = false;
    }
    if (!isValid) return;

    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Entrar';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
    }

    try {
        const response = await fetch(getApiBase() + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let data = {};
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};
        } catch (_) {}

        if (!response.ok) {
            if (response.status === 401 && pwdErr) {
                pwdErr.classList.add('show');
            } else if (emailErr) {
                emailErr.classList.add('show');
            }
            return;
        }

        if (data.token && typeof AuthStorage !== 'undefined') {
            const rememberMe = document.getElementById('remember-me')?.checked ?? true;
            AuthStorage.setAuth(data.token, data.userName, data.userId, rememberMe);
        } else if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.userName) localStorage.setItem('userName', data.userName);
            if (data.userId != null) localStorage.setItem('userId', String(data.userId));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');
        const target = redirectPage && !redirectPage.toLowerCase().includes('login')
            ? redirectPage
            : 'dashboard.html';
        window.location.href = target;
    } catch (err) {
        console.error('Erro no login:', err);
        if (pwdErr) {
            pwdErr.dataset.originalText = pwdErr.textContent;
            pwdErr.textContent = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
            pwdErr.classList.add('show');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

// ==================== Cadastro ====================

async function registerUser(event) {
    event.preventDefault();

    const nameEl = document.getElementById('register-name');
    const emailEl = document.getElementById('register-email');
    const passwordEl = document.getElementById('register-password');
    const confirmEl = document.getElementById('register-confirm-password');
    const termsEl = document.getElementById('terms-and-conditions');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const confirmPassword = confirmEl ? confirmEl.value : '';
    const termsAccepted = termsEl ? termsEl.checked : false;

    const nameErr = document.getElementById('register-name-error');
    const emailErr = document.getElementById('register-email-error');
    const pwdErr = document.getElementById('register-password-error');
    const confirmErr = document.getElementById('register-confirm-password-error');

    [nameErr, emailErr, pwdErr, confirmErr].forEach(el => {
        if (el) {
            el.classList.remove('show');
            const id = el.id;
            if (id && ERROR_DEFAULTS[id]) el.textContent = ERROR_DEFAULTS[id];
        }
    });

    let isValid = true;
    if (name.length < 3 || !name.includes(' ')) {
        if (nameErr) nameErr.classList.add('show');
        isValid = false;
    }
    if (!validateEmail(email)) {
        if (emailErr) emailErr.classList.add('show');
        isValid = false;
    }
    if (password.length < 8) {
        if (pwdErr) pwdErr.classList.add('show');
        isValid = false;
    }
    if (password !== confirmPassword) {
        if (confirmErr) confirmErr.classList.add('show');
        isValid = false;
    }
    if (!termsAccepted) {
        alert('Por favor, aceite os termos e condições para continuar.');
        isValid = false;
    }
    if (!isValid) return;

    const submitBtn = document.querySelector('#register-form button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Cadastrar';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cadastrando...';
    }

    try {
        const response = await fetch(getApiBase() + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        let data = {};
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};
        } catch (_) {}

        if (!response.ok) {
            const msg = data.message || (response.status === 400 ? 'Email já cadastrado ou dados inválidos.' : 'Erro ao cadastrar.');
            if (msg.toLowerCase().includes('email') && emailErr) {
                emailErr.textContent = msg;
                emailErr.classList.add('show');
            } else if (nameErr) {
                nameErr.textContent = msg;
                nameErr.classList.add('show');
            }
            return;
        }

        const successMsg = document.getElementById('successMessage');
        if (successMsg) successMsg.classList.add('show');

        const registerForm = document.querySelector('#register-form form');
        if (registerForm) registerForm.reset();

        const strengthBar = document.getElementById('password-strength-bar');
        if (strengthBar) strengthBar.style.width = '0';

        setTimeout(() => switchTab('login'), 3000);
    } catch (err) {
        console.error('Erro no cadastro:', err);
        if (emailErr) {
            emailErr.textContent = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
            emailErr.classList.add('show');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

// ==================== Inicialização ====================

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    switchTab(tabParam === 'register' ? 'register' : 'login');

    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function () {
            const parent = this.closest('.form-group');
            if (parent) parent.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            const parent = this.closest('.form-group');
            if (parent) parent.classList.remove('focused');
        });
    });

    const passwordField = document.getElementById('register-password');
    if (passwordField) {
        passwordField.addEventListener('input', checkPasswordStrength);
    }

    const confirmPassword = document.getElementById('register-confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function () {
            const password = document.getElementById('register-password')?.value || '';
            const confirmErr = document.getElementById('register-confirm-password-error');
            if (confirmErr) {
                if (this.value && this.value !== password) {
                    confirmErr.classList.add('show');
                } else {
                    confirmErr.classList.remove('show');
                }
            }
        });
    }

    const token = (typeof AuthStorage !== 'undefined' ? AuthStorage.getToken() : localStorage.getItem('token')) || '';
    const path = window.location.pathname || '';
    const isLoginPage = path.endsWith('login.html') || path.endsWith('login') || path.includes('login.html');

    if (token && isLoginPage) {
        fetch(getApiBase() + '/users/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'dashboard.html';
                }
            })
            .catch(() => {});
    }
});
