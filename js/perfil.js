/**
 * MathMaster - Página de Perfil
 * Carrega dados do usuário da API e permite edição
 */

(function () {
    const profileState = {
        isEditing: false,
        currentUser: null,
        achievements: [],
        uploadType: null,
        stats: { coins: 0, lessons: 0, achievements: 0, streak: 0 }
    };

    function getApiBase() {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1' || host === '') {
            return 'http://localhost:8080/api';
        }
        return (window.location.origin || '') + '/api';
    }

    function getToken() {
        if (typeof AuthStorage !== 'undefined') return AuthStorage.getToken();
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    function safeQuerySelector(selector) {
        return document.querySelector(selector);
    }

    function showNotification(msg, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(msg, type);
        } else {
            alert(msg);
        }
    }

    async function loadUserProfile() {
        const nameEl = safeQuerySelector('#profile-name');
        const emailEl = safeQuerySelector('#profile-email');
        const avatarEl = safeQuerySelector('#profile-avatar');
        const headerAvatar = safeQuerySelector('#header-avatar');

        if (nameEl) nameEl.textContent = 'Carregando...';

        // Fallback do storage
        let fallbackName = '';
        if (typeof AuthStorage !== 'undefined') {
            fallbackName = AuthStorage.getUserName();
        } else {
            fallbackName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || '';
        }

        try {
            const token = getToken();
            if (!token) {
                profileState.currentUser = { name: fallbackName || 'Usuário', email: '', bio: '' };
                updateProfileUI();
                loadStatsFromStorage();
                return;
            }

            const res = await fetch(getApiBase() + '/users/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (res.ok) {
                try {
                    const user = await res.json();
                    profileState.currentUser = {
                        id: user.id,
                        name: user.name || fallbackName || 'Usuário',
                        email: user.email || '',
                        bio: user.bio || 'Estudante apaixonado por matemática.',
                        avatarUrl: user.avatarUrl || null,
                        coverUrl: user.coverUrl || null
                    };
                } catch (_) {
                    profileState.currentUser = { name: fallbackName || 'Usuário', email: '', bio: '' };
                }
            } else {
                if (res.status === 401) {
                    if (typeof AuthStorage !== 'undefined') AuthStorage.clearAuth();
                    else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userId');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('userName');
                        sessionStorage.removeItem('userId');
                    }
                    showNotification('Sessão expirada. Faça login novamente.', 'info');
                }
                profileState.currentUser = {
                    name: fallbackName || 'Usuário',
                    email: '',
                    bio: 'Estudante apaixonado por matemática.'
                };
            }
        } catch (err) {
            profileState.currentUser = {
                name: fallbackName || 'Usuário',
                email: '',
                bio: 'Estudante apaixonado por matemática.'
            };
        }

        updateProfileUI();
        loadStatsFromStorage();
    }

    function loadStatsFromStorage() {
        try {
            const coins = parseInt(localStorage.getItem('userCoins') || '0', 10);
            const lessons = parseInt(localStorage.getItem('userLessonsCompleted') || '0', 10);
            const achievements = parseInt(localStorage.getItem('userAchievements') || '0', 10);
            profileState.stats = {
                coins,
                lessons,
                achievements,
                streak: parseInt(localStorage.getItem('userStreak') || '0', 10)
            };
        } catch (e) {
            profileState.stats = { coins: 0, lessons: 0, achievements: 0, streak: 0 };
        }
        updateStatsUI();
    }

    function updateProfileUI() {
        const user = profileState.currentUser;
        if (!user) return;

        const initial = (user.name || 'U').charAt(0).toUpperCase();

        const nameEl = safeQuerySelector('#profile-name');
        const emailEl = safeQuerySelector('#profile-email');
        const bioEl = safeQuerySelector('#profile-bio');
        const avatarEl = safeQuerySelector('#profile-avatar');
        const headerAvatar = safeQuerySelector('#header-avatar');
        const coverEl = safeQuerySelector('.profile-cover');

        if (nameEl) nameEl.textContent = user.name || 'Usuário';
        if (emailEl) {
            emailEl.textContent = user.email || '';
            emailEl.style.display = user.email ? 'block' : 'none';
        }
        if (bioEl) bioEl.textContent = user.bio || 'Estudante apaixonado por matemática.';

        if (avatarEl) {
            if (user.avatarUrl) {
                avatarEl.innerHTML = '<img src="' + user.avatarUrl + '" alt="">';
            } else {
                avatarEl.textContent = initial;
            }
        }
        if (headerAvatar) {
            if (user.avatarUrl) {
                headerAvatar.innerHTML = '<img src="' + user.avatarUrl + '" alt="">';
            } else {
                headerAvatar.textContent = initial;
            }
        }
        if (coverEl && user.coverUrl) {
            coverEl.style.backgroundImage = 'url(' + user.coverUrl + ')';
        }
    }

    function updateStatsUI() {
        const s = profileState.stats;

        const els = [
            { sel: '[data-stat="coins"]', val: s.coins },
            { sel: '[data-stat="lessons"]', val: s.lessons },
            { sel: '[data-stat="achievements"]', val: s.achievements }
        ];
        els.forEach(function (item) {
            const el = safeQuerySelector(item.sel);
            if (el) el.textContent = item.val;
        });

        const headerCoins = safeQuerySelector('#header-coins');
        if (headerCoins) headerCoins.textContent = s.coins;

        const sidebarLessons = safeQuerySelector('#sidebar-lessons');
        const sidebarStreak = safeQuerySelector('#sidebar-streak');
        if (sidebarLessons) sidebarLessons.textContent = s.lessons;
        if (sidebarStreak) sidebarStreak.textContent = s.streak;
    }

    function toggleEditMode() {
        profileState.isEditing = !profileState.isEditing;
        const form = safeQuerySelector('#edit-profile-form');
        const btn = safeQuerySelector('#edit-profile-btn');

        if (!form || !btn) return;

        if (profileState.isEditing) {
            form.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-times"></i> Cancelar Edição';
            const user = profileState.currentUser;
            const nameInput = form.querySelector('#name');
            const emailInput = form.querySelector('#email');
            const bioInput = form.querySelector('#bio');
            if (nameInput) nameInput.value = user.name || '';
            if (emailInput) emailInput.value = user.email || '';
            if (bioInput) bioInput.value = user.bio || '';
        } else {
            form.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
        }
    }

    async function saveProfileChanges(event) {
        event.preventDefault();
        const form = event.target;
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const bioInput = form.querySelector('#bio');

        if (!nameInput || !emailInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const bio = (bioInput && bioInput.value) ? bioInput.value.trim() : '';

        if (!name) {
            showNotification('Nome é obrigatório', 'error');
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                profileState.currentUser = { ...profileState.currentUser, name, email, bio };
                updateProfileUI();
                toggleEditMode();
                showNotification('Perfil atualizado (modo offline)', 'success');
                return;
            }

            const res = await fetch(getApiBase() + '/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ name, email })
            });

            if (res.ok) {
                const updated = await res.json();
                profileState.currentUser = {
                    ...profileState.currentUser,
                    name: updated.name || name,
                    email: updated.email || email,
                    bio: bio || profileState.currentUser.bio
                };
                updateProfileUI();
                toggleEditMode();
                showNotification('Perfil atualizado com sucesso!', 'success');
            } else {
                const err = await res.json().catch(function () { return {}; });
                showNotification(err.message || 'Erro ao atualizar perfil', 'error');
            }
        } catch (err) {
            showNotification('Erro de conexão. Tente novamente.', 'error');
        }
    }

    function openUploadModal(type) {
        if (type !== 'avatar' && type !== 'cover') return;
        profileState.uploadType = type;
        const modal = safeQuerySelector('#upload-modal');
        const preview = safeQuerySelector('#upload-preview');
        const avatarOpt = safeQuerySelector('#avatar-upload');
        const coverOpt = safeQuerySelector('#cover-upload');

        if (preview) preview.innerHTML = '';
        if (avatarOpt) avatarOpt.value = '';
        if (coverOpt) coverOpt.value = '';

        var wraps = document.querySelectorAll('.upload-option-wrap');
        wraps.forEach(function (el) {
            el.style.display = el.getAttribute('data-type') === type ? 'flex' : 'none';
        });

        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    function closeUploadModal() {
        const modal = safeQuerySelector('#upload-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
        profileState.uploadType = null;
        const preview = safeQuerySelector('#upload-preview');
        const avatarOpt = safeQuerySelector('#avatar-upload');
        const coverOpt = safeQuerySelector('#cover-upload');
        if (preview) preview.innerHTML = '';
        if (avatarOpt) avatarOpt.value = '';
        if (coverOpt) coverOpt.value = '';
    }

    function validateImageFile(file) {
        if (!file.type.startsWith('image/')) throw new Error('Selecione uma imagem válida');
        if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5MB');
    }

    function compressImage(dataUrl, maxSize, quality, callback) {
        var img = new Image();
        img.onload = function () {
            var w = img.width;
            var h = img.height;
            if (w > maxSize || h > maxSize) {
                if (w > h) {
                    h = Math.round(h * maxSize / w);
                    w = maxSize;
                } else {
                    w = Math.round(w * maxSize / h);
                    h = maxSize;
                }
            }
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            try {
                var out = canvas.toDataURL('image/jpeg', quality);
                callback(out);
            } catch (e) {
                callback(dataUrl);
            }
        };
        img.onerror = function () { callback(dataUrl); };
        img.src = dataUrl;
    }

    function saveUpload() {
        const type = profileState.uploadType;
        const avatarInput = safeQuerySelector('#avatar-upload');
        const coverInput = safeQuerySelector('#cover-upload');
        const input = type === 'avatar' ? avatarInput : coverInput;

        if (!input || !input.files || !input.files[0]) {
            showNotification('Selecione uma imagem', 'error');
            return;
        }

        try {
            const file = input.files[0];
            validateImageFile(file);
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result;
                var maxSize = type === 'avatar' ? 400 : 1200;
                compressImage(dataUrl, maxSize, 0.85, function (finalDataUrl) {
                    profileState.currentUser = profileState.currentUser || {};

                    if (type === 'avatar') {
                        profileState.currentUser.avatarUrl = finalDataUrl;
                        const avatarEl = safeQuerySelector('#profile-avatar');
                        const headerAvatar = safeQuerySelector('#header-avatar');
                        if (avatarEl) avatarEl.innerHTML = '<img src="' + finalDataUrl + '" alt="">';
                        if (headerAvatar) headerAvatar.innerHTML = '<img src="' + finalDataUrl + '" alt="">';
                    } else {
                        profileState.currentUser.coverUrl = finalDataUrl;
                        const cover = safeQuerySelector('.profile-cover');
                        if (cover) cover.style.backgroundImage = 'url(' + finalDataUrl + ')';
                    }

                    saveAvatarOrCoverToApi(type, finalDataUrl);
                    closeUploadModal();
                });
            };
            reader.onerror = function () { showNotification('Erro ao ler arquivo', 'error'); };
            reader.readAsDataURL(file);
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }

    function saveAvatarOrCoverToApi(type, dataUrl) {
        const token = getToken();
        if (!token) {
            showNotification('Foto atualizada só nesta sessão. Faça login para salvar no cadastro.', 'info');
            return;
        }
        const body = type === 'avatar' ? { avatarUrl: dataUrl } : { coverUrl: dataUrl };
        fetch(getApiBase() + '/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        })
            .then(function (res) {
                if (res.ok) {
                    showNotification('Foto salva no seu cadastro!', 'success');
                } else {
                    var msg = 'Não foi possível salvar no servidor.';
                    if (res.status === 413) msg = 'Imagem muito grande. Tente uma foto menor.';
                    else if (res.status === 401) msg = 'Sessão expirada. Faça login novamente.';
                    showNotification(msg, 'error');
                }
            })
            .catch(function (err) {
                showNotification('Erro de conexão. Verifique se o servidor está rodando.', 'error');
            });
    }

    function openPasswordModal() {
        const modal = safeQuerySelector('#password-modal');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    function closePasswordModal() {
        const modal = safeQuerySelector('#password-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
        const form = safeQuerySelector('#password-form');
        if (form) form.reset();
    }

    async function changePassword(event) {
        event.preventDefault();
        const form = event.target;
        const current = form.querySelector('#current-password');
        const newPass = form.querySelector('#new-password');
        const confirm = form.querySelector('#confirm-password');

        if (!current || !newPass || !confirm) return;

        const curVal = current.value;
        const newVal = newPass.value;
        const confVal = confirm.value;

        if (!curVal || !newVal || !confVal) {
            showNotification('Preencha todos os campos', 'error');
            return;
        }
        if (newVal.length < 6) {
            showNotification('A nova senha deve ter no mínimo 6 caracteres', 'error');
            return;
        }
        if (newVal !== confVal) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }

        try {
            const token = getToken();
            const res = await fetch(getApiBase() + '/auth/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ currentPassword: curVal, newPassword: newVal })
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Alteração de senha ainda não disponível nesta versão.');
                }
                const err = await res.json().catch(function () { return {}; });
                throw new Error(err.message || 'Erro ao alterar senha');
            }
            form.reset();
            closePasswordModal();
            showNotification('Senha alterada com sucesso!', 'success');
        } catch (err) {
            showNotification(err.message || 'Erro ao alterar senha', 'error');
        }
    }

    function setupImagePreview() {
        const avatarInput = safeQuerySelector('#avatar-upload');
        const coverInput = safeQuerySelector('#cover-upload');
        const preview = safeQuerySelector('#upload-preview');

        function handleChange(input, type) {
            if (!input || !input.files || !input.files[0]) return;
            try {
                validateImageFile(input.files[0]);
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (preview) {
                        preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
                    }
                };
                reader.readAsDataURL(input.files[0]);
            } catch (err) {
                showNotification(err.message, 'error');
                input.value = '';
            }
        }

        if (avatarInput) avatarInput.addEventListener('change', function () { handleChange(avatarInput, 'avatar'); });
        if (coverInput) coverInput.addEventListener('change', function () { handleChange(coverInput, 'cover'); });
    }

    function init() {
        loadUserProfile();

        const editBtn = safeQuerySelector('#edit-profile-btn');
        const form = safeQuerySelector('#edit-profile-form');
        const cancelBtn = safeQuerySelector('#cancel-edit-btn');
        const pwdBtn = safeQuerySelector('#change-password-btn');
        const pwdForm = safeQuerySelector('#password-form');

        if (editBtn) editBtn.addEventListener('click', toggleEditMode);
        if (form) form.addEventListener('submit', saveProfileChanges);
        if (cancelBtn) cancelBtn.addEventListener('click', toggleEditMode);
        if (pwdBtn) pwdBtn.addEventListener('click', openPasswordModal);
        if (pwdForm) pwdForm.addEventListener('submit', changePassword);

        setupImagePreview();

        document.addEventListener('click', function (e) {
            if (e.target.id === 'upload-modal') closeUploadModal();
            if (e.target.id === 'password-modal') closePasswordModal();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.openUploadModal = openUploadModal;
    window.closeUploadModal = closeUploadModal;
    window.closePasswordModal = closePasswordModal;
    window.saveUpload = saveUpload;
})();
