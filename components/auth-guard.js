/**
 * Auth Guard - Redireciona para login se o usuário não estiver autenticado.
 * Inclua auth-storage.js antes deste script.
 */
(function () {
    var publicPages = [
        'login.html',
        'recuperar-senha.html',
        'redefinir-senha.html',
        'termos-de-uso.html',
        'privacidade.html',
        'contato.html'
    ];

    function getCurrentPage() {
        var path = window.location.pathname || '';
        var filename = path.split('/').pop();
        if (!filename || filename === '' || path === '/' || path.endsWith('/')) {
            filename = 'index.html';
        }
        return filename;
    }

    function isPublicPage(page) {
        return publicPages.some(function (p) {
            return page === p || page.endsWith('/' + p);
        });
    }

    var currentPage = getCurrentPage();
    if (isPublicPage(currentPage)) return;

    var token = (typeof AuthStorage !== 'undefined' ? AuthStorage.getToken() : localStorage.getItem('token')) || '';
    if (!token.trim()) {
        var redirect = 'login.html?redirect=' + encodeURIComponent(currentPage);
        window.location.replace(redirect);
    }
})();
