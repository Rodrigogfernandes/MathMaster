/**
 * Auth Storage - Gerencia token e dados do usuário em localStorage/sessionStorage.
 * Mantém o usuário logado ao navegar entre as páginas.
 */
var AuthStorage = (function () {
    var TOKEN_KEY = 'token';
    var USER_NAME_KEY = 'userName';
    var USER_ID_KEY = 'userId';
    var REMEMBER_KEY = 'authRemember';

    function getStorage(usePersistent) {
        if (usePersistent === undefined) {
            usePersistent = localStorage.getItem(REMEMBER_KEY) === 'true';
        }
        return usePersistent ? localStorage : sessionStorage;
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
    }

    function setAuth(token, userName, userId, remember) {
        remember = remember === true || remember === 'true';
        var persistent = getStorage(remember);
        var session = remember ? sessionStorage : localStorage;

        persistent.setItem(TOKEN_KEY, token || '');
        if (userName != null) persistent.setItem(USER_NAME_KEY, String(userName));
        if (userId != null) persistent.setItem(USER_ID_KEY, String(userId));
        persistent.setItem(REMEMBER_KEY, remember ? 'true' : 'false');

        session.removeItem(TOKEN_KEY);
        session.removeItem(USER_NAME_KEY);
        session.removeItem(USER_ID_KEY);
    }

    function clearAuth() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_NAME_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(REMEMBER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_NAME_KEY);
        sessionStorage.removeItem(USER_ID_KEY);
        sessionStorage.removeItem(REMEMBER_KEY);
    }

    function getUserName() {
        return localStorage.getItem(USER_NAME_KEY) || sessionStorage.getItem(USER_NAME_KEY) || '';
    }

    function getUserId() {
        return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY) || '';
    }

    function isLoggedIn() {
        var token = getToken();
        return !!(token && token.trim());
    }

    return {
        getToken: getToken,
        setAuth: setAuth,
        clearAuth: clearAuth,
        getUserName: getUserName,
        getUserId: getUserId,
        isLoggedIn: isLoggedIn
    };
})();
