/**
 * js/api.js - Módulo ÚNICO para comunicação com a API do MathMaster
 */

// URL base da API (ajustada para a porta do backend)
const API_URL = 'http://localhost:8080/api'; // Seu backend está na 8080

// Função auxiliar para fazer chamadas HTTP à API
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('jwt_token'); // Pega o token do localStorage

    // Headers padrão, incluindo o Content-Type
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers // Mescla com headers personalizados da requisição
    };

    // Se houver um token, adiciona o cabeçalho Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Mescla as opções padrão com as opções específicas da requisição
    const fetchOptions = {
        ...options,
        headers,
        credentials: 'include' // Importante para o CORS e JWT (como configuramos no backend)
    };

    try {
        const response = await fetch(url, fetchOptions);

        // Se a resposta não for OK (status 2xx), lança um erro
        if (!response.ok) {
            let errorData;
            try {
                // Tenta parsear o corpo da resposta como JSON para obter detalhes do erro
                errorData = await response.json();
            } catch (jsonError) {
                // Se não conseguir parsear como JSON, usa uma mensagem genérica
                errorData = { message: `Erro HTTP ${response.status} - ${response.statusText}` };
            }
            const error = new Error(errorData.message || `Erro na requisição: ${response.status}`);
            error.status = response.status;
            error.data = errorData; // Inclui os dados de erro do servidor
            throw error;
        }
        // Se o status for 204 No Content, retorna um objeto vazio para evitar erro de parse JSON
        if (response.status === 204) {
            return {};
        }
        // Retorna o corpo da resposta como JSON
        return response.json();
    } catch (error) {
        console.error(`Erro em fetchAPI para ${url}:`, error);
        throw error; // Relança o erro para quem chamou fetchAPI
    }
}

// === DEFININDO OS OBJETOS DA API (MAPEANDO PARA OS ENDPOINTS DO BACKEND) ===

const AuthAPI = {
    // POST /api/auth/register
    register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    // POST /api/auth/login
    login: (email, password) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    // POST /api/auth/logout (No Spring Security, logout é stateless, mas o frontend chama)
    logout: () => fetchAPI('/auth/logout', { method: 'POST' }), // Endpoint de logout no backend não faz muito além de retornar sucesso para API stateless

    // GET /api/users/me (O frontend chama /auth/me, mas no backend mapeamos para /users/me)
    getCurrentUser: () => fetchAPI('/users/me'),

    // Futuramente, atualizar detalhes do usuário
    // updateUserDetails: (userData) => fetchAPI('/auth/updatedetails', { method: 'PUT', body: JSON.stringify(userData) }),
    // updatePassword: (currentPassword, newPassword) => fetchAPI('/auth/updatepassword', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
    // forgotPassword: (email) => fetchAPI('/auth/forgotpassword', { method: 'POST', body: JSON.stringify({ email }) }),
    // resetPassword: (token, password) => fetchAPI(`/auth/resetpassword/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
};

const ModulesAPI = {
    // GET /api/modules
    getAllSubjects: () => fetchAPI('/modules'), // Equivalente a getModules do api.js antigo

    // GET /api/modules/{id}
    getSubjectById: (id) => fetchAPI(`/modules/${id}`), // Equivalente a getModule do api.js antigo

    // GET /api/modules/{subjectId}/contents
    getContentsBySubjectId: (subjectId) => fetchAPI(`/modules/${subjectId}/contents`),

    // GET /api/modules/{subjectId}/contents/{contentId}
    getContentById: (subjectId, contentId) => fetchAPI(`/modules/${subjectId}/contents/${contentId}`),

    // GET /api/contents/{contentId}/questions
    getQuestionsByContentId: (contentId) => fetchAPI(`/contents/${contentId}/questions`),

    // GET /api/contents/{contentId}/questions/{questionId}
    getQuestionById: (contentId, questionId) => fetchAPI(`/contents/${contentId}/questions/${questionId}`),

    // As outras funções (startModule, checkAnswer, etc.) virão em etapas futuras.
};

const AchievementsAPI = {
    // GET /api/achievements
    getAllAchievements: () => fetchAPI('/achievements'),

    // GET /api/achievements/{id}
    getAchievementById: (id) => fetchAPI(`/achievements/${id}`),

    // Futuramente, user achievements e check achievements.
    // getUserAchievements: (userId = 'me') => fetchAPI(`/achievements/user/${userId}`),
    // checkAchievements: () => fetchAPI('/achievements/check/me', { method: 'POST' }),
};

const UserAPI = {
    // GET /api/users
    getAllUsers: () => fetchAPI('/users'), // Para o leaderboard

    // GET /api/users/me
    getCurrentUser: () => fetchAPI('/users/me'),
};

// EXPORTANDO TUDO EM UM ÚNICO OBJETO GLOBAL PARA O FRONTEND
// MathMasterAPI.Auth.login(), MathMasterAPI.Modules.getAllSubjects(), etc.
window.MathMasterAPI = {
    Auth: AuthAPI,
    Modules: ModulesAPI,
    Achievements: AchievementsAPI,
    User: UserAPI, // Adicionado para acessar getCurrentUser e getAllUsers
};

// Se o Rodrigo usa window.api (do arquivo original), podemos manter uma compatibilidade
// ou pedir para ele mudar para window.MathMasterAPI
window.api = window.MathMasterAPI;