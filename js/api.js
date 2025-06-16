// Configuração base da API
const API_BASE_URL = '/api';

// Função genérica para fazer requisições à API
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}

// API de Usuários
const UserAPI = {
    // Autenticação
    login: async (email, password) => {
        return fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    register: async (userData) => {
        return fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    logout: async () => {
        return fetchAPI('/auth/logout', {
            method: 'POST'
        });
    },

    // Recuperação de senha
    requestPasswordReset: async (email) => {
        return fetchAPI('/auth/password/reset-request', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    resetPassword: async (token, newPassword) => {
        return fetchAPI('/auth/password/reset', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
    },

    // Dados do usuário
    getUserData: async () => {
        return fetchAPI('/user/profile');
    },

    updateUserData: async (userData) => {
        return fetchAPI('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    getUserStats: async () => {
        return fetchAPI('/user/stats');
    }
};

// API de Tópicos
const TopicsAPI = {
    getUserTopics: async () => {
        return fetchAPI('/topics/user');
    },

    getAllTopics: async () => {
        return fetchAPI('/topics');
    },

    getTopicDetails: async (topicId) => {
        return fetchAPI(`/topics/${topicId}`);
    },

    updateTopicProgress: async (topicId, progress) => {
        return fetchAPI(`/topics/${topicId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ progress })
        });
    }
};

// API de Conquistas
const AchievementsAPI = {
    getUserAchievements: async () => {
        return fetchAPI('/achievements/user');
    },

    getFilteredAchievements: async (filter) => {
        return fetchAPI(`/achievements?filter=${filter}`);
    },

    unlockAchievement: async (achievementId) => {
        return fetchAPI(`/achievements/${achievementId}/unlock`, {
            method: 'POST'
        });
    },

    getAchievementProgress: async (achievementId) => {
        return fetchAPI(`/achievements/${achievementId}/progress`);
    }
};

// API do perfil do usuário
const UserProfileAPI = {
    getUserProfile: async (userId) => {
        return fetchAPI(`/user/${userId}`);
    },

    updateUserProfile: async (userId, profileData) => {
        return fetchAPI(`/user/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    getUserAchievements: async (userId) => {
        return fetchAPI(`/user/${userId}/achievements`);
    },

    getUserTopics: async (userId) => {
        return fetchAPI(`/user/${userId}/topics`);
    }
};

// API da Comunidade
const CommunityAPI = {
    getPosts: async () => {
        return fetchAPI('/community/posts');
    },

    getFilteredPosts: async (filter) => {
        return fetchAPI(`/community/posts?filter=${filter}`);
    },

    createPost: async (postData) => {
        return fetchAPI('/community/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    },

    getTopicPosts: async (topicId) => {
        return fetchAPI(`/community/topics/${topicId}/posts`);
    },

    likePost: async (postId) => {
        return fetchAPI(`/community/posts/${postId}/like`, {
            method: 'POST'
        });
    },

    commentPost: async (postId, comment) => {
        return fetchAPI(`/community/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content: comment })
        });
    },

    getTrendingTopics: async () => {
        return fetchAPI('/community/trending');
    },

    searchPosts: async (query) => {
        return fetchAPI(`/community/search?q=${encodeURIComponent(query)}`);
    }
};

// API de Ranking
const RankingAPI = {
    getGlobalRanking: async () => {
        return fetchAPI('/ranking/global');
    },

    getFriendsRanking: async () => {
        return fetchAPI('/ranking/friends');
    },

    getWeeklyRanking: async () => {
        return fetchAPI('/ranking/weekly');
    },

    getTopicRanking: async (topicId) => {
        return fetchAPI(`/ranking/topics/${topicId}`);
    }
};

// API de Notificações
const NotificationsAPI = {
    getNotifications: async () => {
        return fetchAPI('/notifications');
    },

    markAsRead: async (notificationId) => {
        return fetchAPI(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    },

    getUnreadCount: async () => {
        return fetchAPI('/notifications/unread/count');
    },

    updatePreferences: async (preferences) => {
        return fetchAPI('/notifications/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }
};

// API de Progresso
const ProgressAPI = {
    saveProgress: async (moduleId, progress) => {
        return fetchAPI(`/progress/${moduleId}`, {
            method: 'POST',
            body: JSON.stringify(progress)
        });
    },

    getProgress: async (moduleId) => {
        return fetchAPI(`/progress/${moduleId}`);
    },

    getOverallProgress: async () => {
        return fetchAPI('/progress/overall');
    },

    syncProgress: async () => {
        return fetchAPI('/progress/sync', {
            method: 'POST'
        });
    }
};

// Exportar todas as APIs como um objeto único
const MathMasterAPI = {
    User: UserAPI,
    Topics: TopicsAPI,
    Achievements: AchievementsAPI,
    Community: CommunityAPI,
    Ranking: RankingAPI,
    Notifications: NotificationsAPI,
    Progress: ProgressAPI
};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathMasterAPI;
} else {
    window.MathMasterAPI = MathMasterAPI;
}
