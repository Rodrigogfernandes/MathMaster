/**
 * API.js - Módulo para comunicação com a API do servidor
 * 
 * Este módulo fornece funções para interagir com os endpoints da API,
 * gerenciando autenticação, requisições e manipulação de respostas.
 */

// URL base da API
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/api' 
  : '/api';

// Configurações padrão para requisições fetch
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' // Para permitir o envio de cookies
};

/**
 * Realiza uma requisição à API
 * @param {string} endpoint - Endpoint da API
 * @param {Object} options - Opções da requisição
 * @returns {Promise<Object>} - Resposta da API
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Mesclar opções padrão com as fornecidas
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    // Se a resposta não for bem-sucedida, lançar erro
    if (!response.ok) {
      const error = new Error(data.error || 'Erro na requisição');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Funções de autenticação

/**
 * Registrar um novo usuário
 * @param {Object} userData - Dados do usuário
 * @returns {Promise<Object>} - Token e dados do usuário
 */
async function register(userData) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * Autenticar usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} - Token e dados do usuário
 */
async function login(email, password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/**
 * Realizar logout do usuário
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function logout() {
  return fetchAPI('/auth/logout');
}

/**
 * Obter dados do usuário atual
 * @returns {Promise<Object>} - Dados do usuário
 */
async function getCurrentUser() {
  return fetchAPI('/auth/me');
}

/**
 * Atualizar dados do usuário
 * @param {Object} userData - Novos dados do usuário
 * @returns {Promise<Object>} - Dados atualizados
 */
async function updateUserDetails(userData) {
  return fetchAPI('/auth/updatedetails', {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
}

/**
 * Atualizar senha do usuário
 * @param {string} currentPassword - Senha atual
 * @param {string} newPassword - Nova senha
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function updatePassword(currentPassword, newPassword) {
  return fetchAPI('/auth/updatepassword', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

/**
 * Solicitar recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function forgotPassword(email) {
  return fetchAPI('/auth/forgotpassword', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/**
 * Resetar senha com token
 * @param {string} token - Token de recuperação
 * @param {string} password - Nova senha
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function resetPassword(token, password) {
  return fetchAPI(`/auth/resetpassword/${token}`, {
    method: 'PUT',
    body: JSON.stringify({ password })
  });
}

// Funções de módulos

/**
 * Obter lista de módulos
 * @param {Object} query - Filtros e paginação
 * @returns {Promise<Object>} - Lista de módulos
 */
async function getModules(query = {}) {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchAPI(`/modules${queryString}`);
}

/**
 * Obter um módulo específico
 * @param {string} id - ID do módulo
 * @returns {Promise<Object>} - Detalhes do módulo
 */
async function getModule(id) {
  return fetchAPI(`/modules/${id}`);
}

/**
 * Iniciar um módulo
 * @param {string} id - ID do módulo
 * @returns {Promise<Object>} - Status e dados de progresso
 */
async function startModule(id) {
  return fetchAPI(`/modules/${id}/start`, {
    method: 'POST'
  });
}
/**
 * Verificar resposta de exercício
 * @param {string} moduleId - ID do módulo
 * @param {string} topicId - ID do tópico
 * @param {number} exerciseId - ID do exercício
 * @param {*} answer - Resposta do usuário
 * @returns {Promise<Object>} - Resultado da verificação
 */
async function checkAnswer(moduleId, topicId, exerciseId, answer) {
  return fetchAPI(`/modules/${moduleId}/check`, {
    method: 'POST',
    body: JSON.stringify({
      topicId,
      exerciseId,
      answer
    })
  });
}

/**
 * Obter progresso do usuário em um módulo
 * @param {string} moduleId - ID do módulo
 * @returns {Promise<Object>} - Dados de progresso
 */
async function getModuleProgress(moduleId) {
  return fetchAPI(`/modules/${moduleId}/progress`);
}

/**
 * Obter estatísticas de um módulo
 * @param {string} moduleId - ID do módulo
 * @returns {Promise<Object>} - Estatísticas do módulo
 */
async function getModuleStats(moduleId) {
  return fetchAPI(`/modules/${moduleId}/stats`);
}

/**
 * Obter exercícios de um módulo
 * @param {string} moduleId - ID do módulo
 * @returns {Promise<Object>} - Lista de exercícios
 */
async function getModuleExercises(moduleId) {
  return fetchAPI(`/modules/${moduleId}/exercises`);
}

// Funções de administrador de módulos

/**
 * Criar um novo módulo
 * @param {Object} moduleData - Dados do módulo
 * @returns {Promise<Object>} - Módulo criado
 */
async function createModule(moduleData) {
  return fetchAPI('/modules', {
    method: 'POST',
    body: JSON.stringify(moduleData)
  });
}

/**
 * Atualizar um módulo
 * @param {string} id - ID do módulo
 * @param {Object} moduleData - Novos dados do módulo
 * @returns {Promise<Object>} - Módulo atualizado
 */
async function updateModule(id, moduleData) {
  return fetchAPI(`/modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(moduleData)
  });
}

/**
 * Excluir um módulo
 * @param {string} id - ID do módulo
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function deleteModule(id) {
  return fetchAPI(`/modules/${id}`, {
    method: 'DELETE'
  });
}

// Funções de progresso

/**
 * Obter progresso geral do usuário
 * @returns {Promise<Object>} - Estatísticas de progresso
 */
async function getOverallProgress() {
  return fetchAPI('/progress/me/overall');
}

/**
 * Obter progresso detalhado do usuário em um módulo
 * @param {string} moduleId - ID do módulo
 * @returns {Promise<Object>} - Progresso detalhado
 */
async function getDetailedModuleProgress(moduleId) {
  return fetchAPI(`/progress/me/module/${moduleId}`);
}

/**
 * Obter estatísticas de progresso
 * @returns {Promise<Object>} - Estatísticas gerais de progresso
 */
async function getProgressStats() {
  return fetchAPI('/progress/stats');
}

/**
 * Completar um exercício
 * @param {string} moduleId - ID do módulo
 * @param {number} topicIndex - Índice do tópico
 * @param {number} exerciseIndex - Índice do exercício
 * @param {boolean} correct - Resposta correta
 * @param {number} attempts - Número de tentativas
 * @returns {Promise<Object>} - Status atualizado
 */
async function completeExercise(moduleId, topicIndex, exerciseIndex, correct, attempts = 1) {
  return fetchAPI(`/progress/${moduleId}/topic/${topicIndex}/exercise/${exerciseIndex}`, {
    method: 'PUT',
    body: JSON.stringify({ correct, attempts })
  });
}

/**
 * Atualizar progresso de um tópico
 * @param {string} moduleId - ID do módulo
 * @param {number} topicIndex - Índice do tópico
 * @param {number} score - Pontuação (0-100)
 * @returns {Promise<Object>} - Status atualizado
 */
async function updateTopicProgress(moduleId, topicIndex, score) {
  return fetchAPI(`/progress/${moduleId}/topic/${topicIndex}`, {
    method: 'PUT',
    body: JSON.stringify({ score })
  });
}

// Funções de conquistas

/**
 * Obter lista de conquistas
 * @param {Object} query - Filtros e paginação
 * @returns {Promise<Object>} - Lista de conquistas
 */
async function getAchievements(query = {}) {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchAPI(`/achievements${queryString}`);
}

/**
 * Obter uma conquista específica
 * @param {string} id - ID da conquista
 * @returns {Promise<Object>} - Detalhes da conquista
 */
async function getAchievement(id) {
  return fetchAPI(`/achievements/${id}`);
}

/**
 * Obter conquistas do usuário
 * @param {string} userId - ID do usuário (opcional, usa o atual por padrão)
 * @returns {Promise<Object>} - Conquistas do usuário
 */
async function getUserAchievements(userId = 'me') {
  const endpoint = userId === 'me' 
    ? '/achievements/user/me'
    : `/achievements/user/${userId}`;
  return fetchAPI(endpoint);
}

/**
 * Verificar conquistas disponíveis para o usuário
 * @returns {Promise<Object>} - Novas conquistas alcançadas
 */
async function checkAchievements() {
  return fetchAPI('/achievements/check/me', {
    method: 'POST'
  });
}

// Funções de administração de conquistas

/**
 * Criar nova conquista
 * @param {Object} achievementData - Dados da conquista
 * @returns {Promise<Object>} - Conquista criada
 */
async function createAchievement(achievementData) {
  return fetchAPI('/achievements', {
    method: 'POST',
    body: JSON.stringify(achievementData)
  });
}

/**
 * Atualizar conquista
 * @param {string} id - ID da conquista
 * @param {Object} achievementData - Novos dados da conquista
 * @returns {Promise<Object>} - Conquista atualizada
 */
async function updateAchievement(id, achievementData) {
  return fetchAPI(`/achievements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(achievementData)
  });
}

/**
 * Excluir conquista
 * @param {string} id - ID da conquista
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function deleteAchievement(id) {
  return fetchAPI(`/achievements/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Conceder conquista a um usuário
 * @param {string} achievementId - ID da conquista
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} - Dados atualizados do usuário
 */
async function awardAchievement(achievementId, userId) {
  return fetchAPI(`/achievements/${achievementId}/award/${userId}`, {
    method: 'POST'
  });
}

// Funções da comunidade

/**
 * Obter lista de posts
 * @param {Object} query - Filtros e paginação
 * @returns {Promise<Object>} - Lista de posts
 */
async function getPosts(query = {}) {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchAPI(`/community${queryString}`);
}

/**
 * Obter posts fixados
 * @returns {Promise<Object>} - Lista de posts fixados
 */
async function getPinnedPosts() {
  return fetchAPI('/community/pinned');
}

/**
 * Obter um post específico
 * @param {string} id - ID do post
 * @returns {Promise<Object>} - Detalhes do post
 */
async function getPost(id) {
  return fetchAPI(`/community/${id}`);
}

/**
 * Criar um novo post
 * @param {Object} postData - Dados do post
 * @returns {Promise<Object>} - Post criado
 */
async function createPost(postData) {
  return fetchAPI('/community', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
}

/**
 * Atualizar um post
 * @param {string} id - ID do post
 * @param {Object} postData - Novos dados do post
 * @returns {Promise<Object>} - Post atualizado
 */
async function updatePost(id, postData) {
  return fetchAPI(`/community/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData)
  });
}

/**
 * Excluir um post
 * @param {string} id - ID do post
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function deletePost(id) {
  return fetchAPI(`/community/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Adicionar comentário a um post
 * @param {string} postId - ID do post
 * @param {string} content - Conteúdo do comentário
 * @returns {Promise<Object>} - Post atualizado
 */
async function addComment(postId, content) {
  return fetchAPI(`/community/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  });
}

/**
 * Atualizar um comentário
 * @param {string} postId - ID do post
 * @param {string} commentId - ID do comentário
 * @param {string} content - Novo conteúdo do comentário
 * @returns {Promise<Object>} - Post atualizado
 */
async function updateComment(postId, commentId, content) {
  return fetchAPI(`/community/${postId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content })
  });
}

/**
 * Excluir um comentário
 * @param {string} postId - ID do post
 * @param {string} commentId - ID do comentário
 * @returns {Promise<Object>} - Mensagem de sucesso
 */
async function deleteComment(postId, commentId) {
  return fetchAPI(`/community/${postId}/comments/${commentId}`, {
    method: 'DELETE'
  });
}

/**
 * Curtir um post
 * @param {string} postId - ID do post
 * @returns {Promise<Object>} - Contagem de curtidas
 */
async function likePost(postId) {
  return fetchAPI(`/community/${postId}/like`, {
    method: 'POST'
  });
}

/**
 * Remover curtida de um post
 * @param {string} postId - ID do post
 * @returns {Promise<Object>} - Contagem de curtidas
 */
async function unlikePost(postId) {
  return fetchAPI(`/community/${postId}/like`, {
    method: 'DELETE'
  });
}

/**
 * Curtir um comentário
 * @param {string} postId - ID do post
 * @param {string} commentId - ID do comentário
 * @returns {Promise<Object>} - Contagem de curtidas
 */
async function likeComment(postId, commentId) {
  return fetchAPI(`/community/${postId}/comments/${commentId}/like`, {
    method: 'POST'
  });
}

/**
 * Remover curtida de um comentário
 * @param {string} postId - ID do post
 * @param {string} commentId - ID do comentário
 * @returns {Promise<Object>} - Contagem de curtidas
 */
async function unlikeComment(postId, commentId) {
  return fetchAPI(`/community/${postId}/comments/${commentId}/like`, {
    method: 'DELETE'
  });
}

/**
 * Marcar um comentário como solução
 * @param {string} postId - ID do post
 * @param {string} commentId - ID do comentário
 * @returns {Promise<Object>} - Post atualizado
 */
async function markSolved(postId, commentId) {
  return fetchAPI(`/community/${postId}/solve/${commentId}`, {
    method: 'PUT'
  });
}

// Funções de usuários - Admin

/**
 * Obter lista de usuários (apenas admin)
 * @param {Object} query - Filtros e paginação
 * @returns {Promise<Object>} - Lista de usuários
 */
async function getUsers(query = {}) {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return fetchAPI(`/users${queryString}`);
}

/**
 * Obter leaderboard de usuários
 * @param {number} limit - Limite de resultados
 * @returns {Promise<Object>} - Lista de usuários ordenados por XP
 */
async function getLeaderboard(limit = 10) {
  return fetchAPI(`/users/leaderboard?limit=${limit}`);
}

/**
 * Obter estatísticas de usuários (apenas admin)
 * @returns {Promise<Object>} - Estatísticas de usuários
 */
async function getUserStats() {
  return fetchAPI('/users/stats');
}

// Funções de notificações

/**
 * Obter notificações do usuário
 * @param {number} limit - Limite de notificações (opcional)
 * @returns {Promise<Object>} - Lista de notificações
 */
async function getUserNotifications(limit = 30) {
  return fetchAPI(`/users/notifications?limit=${limit}`);
}

/**
 * Marcar uma notificação como lida
 * @param {string} notificationId - ID da notificação
 * @returns {Promise<Object>} - Notificação atualizada
 */
async function markNotificationAsRead(notificationId) {
  return fetchAPI(`/users/notifications/${notificationId}/read`, {
    method: 'PUT'
  });
}

/**
 * Marcar todas as notificações como lidas
 * @returns {Promise<Object>} - Resultado da operação
 */
async function markAllNotificationsAsRead() {
  return fetchAPI('/users/notifications/read-all', {
    method: 'PUT'
  });
}

/**
 * Excluir uma notificação
 * @param {string} notificationId - ID da notificação
 * @returns {Promise<Object>} - Resultado da operação
 */
async function deleteNotification(notificationId) {
  return fetchAPI(`/users/notifications/${notificationId}`, {
    method: 'DELETE'
  });
}

/**
 * Excluir todas as notificações do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
async function clearAllNotifications() {
  return fetchAPI('/users/notifications', {
    method: 'DELETE'
  });
}

/**
 * Módulo para comunicação em tempo real com o servidor via Socket.io
 */
(function() {
  let socket = null;
  let isConnected = false;
  let userId = null;
  const eventCallbacks = {};

  /**
   * Inicializa a conexão Socket.io
   * @returns {Promise} Resolves quando a conexão é estabelecida
   */
  async function init() {
    if (isConnected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        // Verificar se o script socket.io está carregado
        if (typeof io === 'undefined') {
          // Carregar o script do socket.io dinamicamente
          const script = document.createElement('script');
          script.src = window.location.hostname === 'localhost' 
            ? 'http://localhost:8080/socket.io/socket.io.js'
            : '/socket.io/socket.io.js';
          script.async = true;
          
          script.onload = () => {
            connectSocket().then(resolve).catch(reject);
          };
          
          script.onerror = () => {
            console.error('Erro ao carregar o script do Socket.io');
            reject(new Error('Erro ao carregar o script do Socket.io'));
          };
          
          document.head.appendChild(script);
        } else {
          connectSocket().then(resolve).catch(reject);
        }
      } catch (error) {
        console.error('Erro ao inicializar Socket.io:', error);
        reject(error);
      }
    });
  }

  /**
   * Estabelece a conexão com o servidor Socket.io
   * @returns {Promise} Resolves quando a conexão é estabelecida
   */
  function connectSocket() {
    return new Promise((resolve, reject) => {
      const serverUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : window.location.origin;
      
      try {
        socket = io(serverUrl, {
          withCredentials: true,
          transports: ['websocket', 'polling']
        });
        
        socket.on('connect', () => {
          console.log('Conectado ao servidor via Socket.io');
          isConnected = true;
          resolve();
          
          // Tentar autenticar o usuário se possível
          authenticateCurrentUser();
        });
        
        socket.on('connect_error', (error) => {
          console.error('Erro de conexão Socket.io:', error);
          isConnected = false;
          reject(error);
        });
        
        socket.on('disconnect', (reason) => {
          console.log(`Desconectado do servidor: ${reason}`);
          isConnected = false;
        });
        
        // Configurar manipuladores de eventos padrão
        setupDefaultEventHandlers();
        
      } catch (error) {
        console.error('Erro ao conectar ao servidor Socket.io:', error);
        reject(error);
      }
    });
  }

  /**
   * Autenticar o usuário atual no Socket.io
   */
  async function authenticateCurrentUser() {
    if (!isConnected || !socket) return;
    
    try {
      // Obter usuário atual
      const userResponse = await window.api.getCurrentUser();
      
      if (userResponse.success && userResponse.data) {
        userId = userResponse.data._id;
        socket.emit('authenticate', userId);
      }
    } catch (error) {
      console.log('Usuário não autenticado para Socket.io');
    }
  }

  /**
   * Configurar manipuladores de eventos padrão
   */
  function setupDefaultEventHandlers() {
    if (!socket) return;
    
    // Evento para notificações
    socket.on('notification', (data) => {
      console.log('Nova notificação:', data);
      
      // Executar callbacks registrados
      triggerEvent('notification', data);
      
      // Mostrar notificação na UI se suportado pelo navegador
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('MathMaster', {
          body: data.message,
          icon: '/assets/images/logo.png'
        });
      }
    });
    
    // Evento para atualizações de progresso
    socket.on('progressUpdate', (data) => {
      console.log('Atualização de progresso:', data);
      triggerEvent('progressUpdate', data);
    });
    
    // Evento para conquistas
    socket.on('achievementUnlocked', (data) => {
      console.log('Nova conquista desbloqueada:', data);
      triggerEvent('achievementUnlocked', data);
      
      // Mostrar notificação na UI se suportado pelo navegador
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Nova Conquista Desbloqueada!', {
          body: `Você desbloqueou: ${data.title}`,
          icon: '/assets/images/achievements/trophy.png'
        });
      }
    });
    
    // Evento para quando um usuário entrar em uma discussão
    socket.on('userJoined', (data) => {
      console.log('Notificação de usuário:', data);
      triggerEvent('userJoined', data);
    });
    
    // Evento para novos comentários em tempo real
    socket.on('newComment', (data) => {
      console.log('Novo comentário:', data);
      triggerEvent('newComment', data);
    });
  }

  /**
   * Entrar em uma sala de módulo para atualizações em tempo real
   * @param {string} moduleId - ID do módulo
   */
  function joinModule(moduleId) {
    if (!isConnected || !socket) return;
    socket.emit('joinModule', moduleId);
  }

  /**
   * Sair de uma sala de módulo
   * @param {string} moduleId - ID do módulo
   */
  function leaveModule(moduleId) {
    if (!isConnected || !socket) return;
    socket.emit('leaveModule', moduleId);
  }

  /**
   * Entrar em uma sala de discussão para atualizações em tempo real
   * @param {string} postId - ID do post
   */
  function joinDiscussion(postId) {
    if (!isConnected || !socket) return;
    socket.emit('joinDiscussion', postId);
  }

  /**
   * Sair de uma sala de discussão
   * @param {string} postId - ID do post
   */
  function leaveDiscussion(postId) {
    if (!isConnected || !socket) return;
    socket.emit('leaveDiscussion', postId);
  }

  /**
   * Enviar progresso de exercício para o servidor
   * @param {Object} data - Dados de progresso
   */
  function sendExerciseProgress(data) {
    if (!isConnected || !socket) return;
    socket.emit('exerciseProgress', data);
  }

  /**
   * Registrar um callback para um evento específico
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função de callback
   */
  function on(event, callback) {
    if (!eventCallbacks[event]) {
      eventCallbacks[event] = [];
    }
    eventCallbacks[event].push(callback);
  }

  /**
   * Remover um callback para um evento específico
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função de callback a remover
   */
  function off(event, callback) {
    if (!eventCallbacks[event]) return;
    
    if (callback) {
      eventCallbacks[event] = eventCallbacks[event].filter(cb => cb !== callback);
    } else {
      // Se nenhum callback específico for fornecido, remover todos
      eventCallbacks[event] = [];
    }
  }

  /**
   * Acionar callbacks para um evento específico
   * @param {string} event - Nome do evento
   * @param {*} data - Dados do evento
   * @private
   */
  function triggerEvent(event, data) {
    if (!eventCallbacks[event]) return;
    
    for (const callback of eventCallbacks[event]) {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erro ao executar callback para evento ${event}:`, error);
      }
    }
  }

  /**
   * Solicitar permissão para notificações do navegador
   */
  function requestNotificationPermission() {
    if (!window.Notification) {
      return Promise.reject(new Error('Este navegador não suporta notificações'));
    }
    
    if (Notification.permission === 'granted') {
      return Promise.resolve();
    }
    
    if (Notification.permission !== 'denied') {
      return Notification.requestPermission();
    }
    
    return Promise.reject(new Error('Permissão de notificação negada'));
  }

  /**
   * Obter a instância do socket
   * @returns {Object|null} - Instância do socket ou null se não estiver conectado
   */
  function getSocket() {
    return isConnected ? socket : null;
  }

  // Exportar o módulo para uso global
  window.api.realtime = {
    init,
    joinModule,
    leaveModule,
    joinDiscussion,
    leaveDiscussion,
    sendExerciseProgress,
    on,
    off,
    requestNotificationPermission,
    getSocket
  };
})();

// Expor funções para uso global
window.api = {
  // Autenticação
  register,
  login,
  logout,
  getCurrentUser,
  updateUserDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  
  // Módulos
  getModules,
  getModule,
  startModule,
  checkAnswer,
  getModuleProgress,
  getModuleStats,
  getModuleExercises,
  
  // Administração de módulos
  createModule,
  updateModule,
  deleteModule,
  
  // Progresso
  getOverallProgress,
  getDetailedModuleProgress,
  getProgressStats,
  completeExercise,
  updateTopicProgress,
  
  // Conquistas
  getAchievements,
  getAchievement,
  getUserAchievements,
  checkAchievements,
  
  // Administração de conquistas
  createAchievement,
  updateAchievement,
  deleteAchievement,
  awardAchievement,
  
  // Comunidade
  getPosts,
  getPinnedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  markSolved,
  
  // Notificações
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  
  // Administração de usuários
  getUsers,
  getLeaderboard,
  getUserStats
}; 