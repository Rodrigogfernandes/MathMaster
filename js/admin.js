// MathMaster/js/admin.js

// Estado global para o painel de administração
const adminState = {
    currentEntity: 'users', // Entidade atualmente ativa (ex: 'users', 'subjects')
    currentUser: null, // Dados do admin logado
    // Mapeia nomes de entidades para suas funções de carregamento/renderização
    entityHandlers: {
        users: {
            load: async () => {
                console.log('Carregando usuários...');
                return await window.MathMasterAPI.User.getAllUsers(); // GET /api/users
            },
            render: renderUsersTable,
            formFields: getUserFormFields // Função para definir campos do formulário
        },
        subjects: {
            load: async () => {
                console.log('Carregando matérias...');
                return await window.MathMasterAPI.Modules.getAllSubjects(); // GET /api/modules
            },
            render: renderSubjectsTable,
            formFields: getSubjectFormFields
        },
        contents: {
            load: async () => {
                console.log('Carregando conteúdos...');
                // Para o MVP: Carregamos todos os conteúdos.
                // Já que Subject.java agora tem EAGER loading para contents, podemos pegar de Subject.
                const allContents = [];
                const subjects = await window.MathMasterAPI.Modules.getAllSubjects(); // GET /api/modules (com contents EAGER)
                subjects.forEach(subject => {
                    // Adiciona a referência ao subject pai para facilitar a exibição
                    subject.contents.forEach(content => {
                        // Verifica se content.subject já existe antes de sobrescrever, ou se vem com ID 0
                        // ou se o backend já está retornando ele (com EAGER loading no Content)
                        content.subject = { id: subject.id, name: subject.name }; // Simplifica o objeto subject para o frontend
                        allContents.push(content);
                    });
                });
                return allContents;
            },
            render: renderContentsTable,
            formFields: getContentFormFields
        },
        questions: {
            load: async () => {
                console.log('Carregando questões...');
                // Para o MVP: Carregamos todas as questões.
                // Já que Content.java agora tem EAGER loading para questions, podemos pegar de Contents.
                const allQuestions = [];
                // Primeiro, carrega todos os conteúdos (que agora trazem as questões EAGER)
                const allContents = await adminState.entityHandlers.contents.load(); // Reutiliza a função de carregar conteúdos

                allContents.forEach(content => {
                    content.questions.forEach(question => {
                        // Verifica se question.content já existe antes de sobrescrever, ou se vem com ID 0
                        question.content = { id: content.id, title: content.title }; // Simplifica o objeto content para o frontend
                        allQuestions.push(question);
                    });
                });
                return allQuestions;
            },
            render: renderQuestionsTable,
            formFields: getQuestionFormFields
        },
        achievements: {
            load: async () => {
                console.log('Carregando conquistas...');
                return await window.MathMasterAPI.Achievements.getAllAchievements(); // GET /api/achievements
            },
            render: renderAchievementsTable,
            formFields: getAchievementFormFields
        }
    }
};

// Elementos do Modal CRUD
const crudModal = document.getElementById('crudModal');
const modalTitle = document.getElementById('modalTitle');
const crudForm = document.getElementById('crudForm');
const formIdInput = document.getElementById('formId');
const formEntityInput = document.getElementById('formEntity');
const dynamicFormFields = document.getElementById('dynamicFormFields');

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    await initAdminPage();
    setupAdminEventListeners();
});

// Inicializa a página de administração
async function initAdminPage() {
    console.log('Painel Administrativo iniciado.');
    try {
        const userRole = localStorage.getItem('user_role'); // Pega o papel do usuário do localStorage

        if (!userRole || userRole !== 'ADMIN') { // Verifica se o papel não existe ou não é ADMIN
            if (typeof showNotification === 'function') {
                showNotification('Acesso negado. Apenas administradores podem acessar esta página.', 'error');
            } else {
                alert('Acesso negado. Apenas administradores podem acessar esta página.');
            }
            setTimeout(() => window.location.href = 'login.html', 2000); // Redireciona
            return;
        }

        // Se chegou aqui, é um ADMIN logado
        adminState.currentUser = await window.MathMasterAPI.User.getCurrentUser(); // GET /api/users/me
        if (typeof showNotification === 'function') {
            showNotification(`Bem-vindo, ${adminState.currentUser.name} (Admin)!`, 'info');
        }

        // Carrega a primeira entidade (usuários) por padrão
        await loadAndRenderEntity(adminState.currentEntity);
        // Ativa o item de menu correspondente
        document.querySelector(`.sidebar-menu .menu-item[data-entity="${adminState.currentEntity}"]`).classList.add('active');

    } catch (error) {
        console.error('Erro ao verificar permissões do admin ou carregar usuário:', error);
        if (typeof showNotification === 'function') {
            showNotification('Erro ao carregar o painel administrativo. Você está logado?', 'error');
        }
        // Em caso de erro na obtenção do usuário (ex: token expirado/inválido), redireciona
        setTimeout(() => window.location.href = 'login.html', 2000);
    }
}

// Configura os event listeners para a página do admin
function setupAdminEventListeners() {
    // Event listener para o menu lateral
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', async () => {
            // Remove 'active' de todos os itens do menu e adiciona ao clicado
            document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active')); // Esconde seções
            document.querySelectorAll('.sidebar-menu .menu-item').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            adminState.currentEntity = item.dataset.entity; // Define a entidade atual
            await loadAndRenderEntity(adminState.currentEntity); // Carrega e renderiza a nova seção
        });
    });

    // Event listener para botões "Adicionar"
    document.querySelectorAll('.btn-add').forEach(button => {
        // CORRIGIDO: Agora pega o tipo da entidade diretamente do data-entity-type
        button.addEventListener('click', () => openCrudModal('create', button.dataset.entityType)); // ALTERADO
    });

    // Event listener para botões de Editar/Excluir (usando delegação de eventos para tabelas)
    document.querySelector('.admin-main-content').addEventListener('click', async (event) => {
        const target = event.target.closest('.btn-action'); // Encontra o botão clicado ou um ancestral com a classe
        if (!target) return; // Se não clicou em um botão de ação, sai

        const action = target.dataset.action; // 'edit' ou 'delete'
        const entity = target.dataset.entity; // Qual entidade ('users', 'subjects', etc.)
        const id = target.dataset.id; // ID do item

        if (action === 'edit') {
            await openCrudModal('edit', entity, id);
        } else if (action === 'delete') {
            if (confirm(`Tem certeza que deseja excluir ${entity} com ID ${id}?`)) {
                await deleteEntity(entity, id);
            }
        }
    });

    // Event listeners do Modal CRUD
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeCrudModal);
    });
    crudModal.addEventListener('click', (e) => { // Fechar ao clicar fora do conteúdo
        if (e.target === crudModal) {
            closeCrudModal();
        }
    });
    crudForm.addEventListener('submit', handleCrudFormSubmit);
}

// Carrega dados e renderiza a tabela para a entidade selecionada
async function loadAndRenderEntity(entityName) {
    const section = document.getElementById(`${entityName}-section`);
    if (!section) {
        console.error(`Seção para ${entityName} não encontrada no HTML.`);
        return;
    }

    // Esconde todas as seções, mostra apenas a ativa
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
    section.classList.add('active');

    const handler = adminState.entityHandlers[entityName];
    if (handler && handler.load && handler.render) {
        try {
            if (typeof showNotification === 'function') {
                showNotification(`Carregando ${entityName}...`, 'info');
            }
            const data = await handler.load();
            console.log(`Dados de ${entityName} carregados:`, data); // DEBUG: Mostra os dados carregados
            handler.render(data); // Chama a função de renderização específica para a entidade
            if (typeof showNotification === 'function') {
                showNotification(`${entityName} carregados com sucesso!`, 'success');
            }
        } catch (error) {
            console.error(`Erro ao carregar ${entityName}:`, error);
            // Mensagens de erro mais detalhadas baseadas no status
            let errorMessage = `Erro ao carregar ${entityName}.`;
            if (error.status === 401 || error.status === 403) {
                errorMessage += ' Acesso negado. Verifique suas permissões.';
            } else if (error.message) {
                errorMessage += ` Detalhes: ${error.message}`;
            }
            if (typeof showNotification === 'function') {
                showNotification(errorMessage, 'error');
            }
        }
    } else {
        console.warn(`Handler para a entidade ${entityName} incompleto ou não definido.`);
    }
}

// Abre o modal de CRUD (Criação/Edição)
async function openCrudModal(mode, entity, id = null) {
    adminState.currentEntity = entity; // Garante que a entidade correta está no estado
    modalTitle.textContent = `${mode === 'create' ? 'Adicionar' : 'Editar'} ${entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, '')}`; // 'Users' -> 'User', 'Subjects' -> 'Subject'
    formIdInput.value = id || '';
    formEntityInput.value = entity;
    dynamicFormFields.innerHTML = ''; // Limpa campos anteriores

    const fields = adminState.entityHandlers[entity].formFields(mode, id);
    let itemData = {}; // Para preencher formulário no modo 'edit'

    if (mode === 'edit' && id) {
        try {
            const allItems = await adminState.entityHandlers[entity].load();
            itemData = allItems.find(item => item.id == id); // Encontra o item pelo ID

            if (!itemData) {
                console.error(`Item com ID ${id} não encontrado para ${entity}.`);
                if (typeof showNotification === 'function') {
                    showNotification(`Item com ID ${id} não encontrado para edição.`, 'error');
                }
                return; // Impede que o modal abra vazio
            }
        } catch (error) {
            console.error(`Erro ao carregar dados de ${entity} para edição:`, error);
            if (typeof showNotification === 'function') {
                showNotification(`Erro ao carregar dados para edição de ${entity}.`, 'error');
            }
            return;
        }
    }

    fields.forEach(field => {
        // Define o valor padrão para campos no modo de edição
        let fieldValue = itemData[field.name];
        // Tratamento especial para relacionamentos aninhados (ex: subject.id, content.id)
        if (field.name === 'subjectId' && itemData.subject && itemData.subject.id) {
            fieldValue = itemData.subject.id;
        } else if (field.name === 'contentId' && itemData.content && itemData.content.id) {
            fieldValue = itemData.content.id;
        } else if (field.name === 'options') { // Para array de opções da questão, exibe como texto multi-linha
            fieldValue = itemData.options ? itemData.options.join('\n') : '';
        } else if (field.name === 'password' && mode === 'edit') {
            fieldValue = ''; // Nunca pré-preenche senha em modo edição
        }

        dynamicFormFields.innerHTML += `
            <div class="form-group">
                <label for="${field.id}">${field.label}</label>
                ${field.type === 'textarea' ?
                    `<textarea id="${field.id}" name="${field.name}" ${field.required ? 'required' : ''}>${fieldValue || ''}</textarea>` :
                 field.type === 'select' ? // Se precisar de um <select>
                    `<select id="${field.id}" name="${field.name}" ${field.required ? 'required' : ''}>
                        ${field.options.map(opt => `<option value="${opt.value}" ${fieldValue == opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                    </select>` :
                 // Para input de senha em modo edição, não pré-preenche o valor
                 (field.name === 'password' && mode === 'edit') ?
                    `<input type="${field.type}" id="${field.id}" name="${field.name}" placeholder="Deixe em branco para manter a senha atual" ${field.required ? 'required' : ''}>` :
                 `<input type="${field.type}" id="${field.id}" name="${field.name}" value="${fieldValue || ''}" ${field.required ? 'required' : ''}>`
                }
            </div>
        `;
    });

    // Adicionar campo de confirmação de senha APENAS se for usuário e modo de criação
    if (entity === 'users' && mode === 'create') {
        dynamicFormFields.innerHTML += `
            <div class="form-group">
                <label for="passwordConfirm">Confirmar Senha</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" required>
            </div>
        `;
    }

    crudModal.style.display = 'flex';
}

// Fecha o modal de CRUD
function closeCrudModal() {
    crudModal.style.display = 'none';
    crudForm.reset();
}

// Lida com o envio do formulário CRUD
async function handleCrudFormSubmit(event) {
    event.preventDefault();

    const mode = formIdInput.value ? 'edit' : 'create';
    const entity = formEntityInput.value;
    const id = formIdInput.value;

    const formData = new FormData(crudForm);
    let data = {};
    for (let [key, value] of formData.entries()) {
        if (key === 'options') { // Trata o campo 'options' como array, dividindo por linha
            data[key] = value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        } else if (key === 'points' || key === 'subjectId' || key === 'contentId') { // Converte para número se for ID ou Pontos
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    }

    // Remove a confirmação de senha do payload final
    delete data.passwordConfirm;

    try {
        let response;
        if (mode === 'create') {
            // Lógica para criação
            switch (entity) {
                case 'users':
                    // Validação de senhas para criação de usuário
                    const userPassword = document.getElementById('userPassword').value;
                    const passwordConfirm = document.getElementById('passwordConfirm').value;
                    if (userPassword !== passwordConfirm) {
                        if (typeof showNotification === 'function') {
                            showNotification('As senhas não coincidem.', 'error');
                        }
                        return;
                    }
                    if (typeof showNotification === 'function') {
                            showNotification('Criando usuário...', 'info');
                        }
                    data.password = userPassword; // Adiciona a senha real ao objeto de dados
                    response = await window.MathMasterAPI.Auth.register(data); // POST /api/auth/register
                    break;
                case 'subjects':
                     if (typeof showNotification === 'function') {
                            showNotification('Criando matéria...', 'info');
                        }
                    response = await window.MathMasterAPI.Modules.createSubject(data); // POST /api/modules
                    break;
                case 'contents':
                    const subjectIdForContent = data.subjectId;
                    if (!subjectIdForContent) {
                        if (typeof showNotification === 'function') {
                            showNotification('É necessário informar o ID da Matéria para o Conteúdo.', 'error');
                        }
                        return;
                    }
                    if (typeof showNotification === 'function') {
                            showNotification('Criando conteúdo...', 'info');
                        }
                    response = await window.MathMasterAPI.Modules.createContent(subjectIdForContent, data); // POST /api/modules/{subjectId}/contents
                    break;
                case 'questions':
                    const contentIdForQuestion = data.contentId;
                    if (!contentIdForQuestion) {
                        if (typeof showNotification === 'function') {
                            showNotification('É necessário informar o ID do Conteúdo para a Questão.', 'error');
                        }
                        return;
                    }
                    if (typeof showNotification === 'function') {
                            showNotification('Criando questão...', 'info');
                        }
                    response = await window.MathMasterAPI.Modules.createQuestion(contentIdForQuestion, data); // POST /api/contents/{contentId}/questions
                    break;
                case 'achievements':
                    if (typeof showNotification === 'function') {
                            showNotification('Criando conquista...', 'info');
                        }
                    response = await window.MathMasterAPI.Achievements.createAchievement(data); // POST /api/achievements
                    break;
            }
            if (typeof showNotification === 'function') {
                showNotification(`${entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, '')} criado com sucesso!`, 'success'); // 'Users' -> 'User'
            }
        } else { // Modo de Edição (PUT)
            switch (entity) {
                case 'users':
                    // API de atualização de usuário não está implementada no backend ainda.
                    if (data.password === '') { // Se a senha está vazia, não a enviamos.
                        delete data.password;
                    }
                    if (typeof showNotification === 'function') {
                        showNotification('Edição de Usuários não implementada no backend ainda. (Necessita PUT /api/users/{id}).', 'warning');
                    }
                    // response = await window.MathMasterAPI.User.updateUserDetails(id, data); // Exemplo de chamada se existir
                    break;
                case 'subjects':
                    response = await window.MathMasterAPI.Modules.updateSubject(id, data); // PUT /api/modules/{id}
                    break;
                case 'contents':
                    const contentSubjectIdUpdate = data.subjectId;
                    if (!contentSubjectIdUpdate) {
                        if (typeof showNotification === 'function') {
                            showNotification('Erro: ID da Matéria ausente para atualizar Conteúdo.', 'error');
                        }
                        return;
                    }
                    response = await window.MathMasterAPI.Modules.updateContent(contentSubjectIdUpdate, id, data); // PUT /api/modules/{subjectId}/contents/{id}
                    break;
                case 'questions':
                    const questionContentIdUpdate = data.contentId;
                    if (!questionContentIdUpdate) {
                        if (typeof showNotification === 'function') {
                            showNotification('Erro: ID do Conteúdo ausente para atualizar Questão.', 'error');
                        }
                        return;
                    }
                    response = await window.MathMasterAPI.Modules.updateQuestion(contentIdForQuestionUpdate, id, data); // PUT /api/contents/{contentId}/questions/{id}
                    break;
                case 'achievements':
                    response = await window.MathMasterAPI.Achievements.updateAchievement(id, data); // PUT /api/achievements/{id}
                    break;
            }
            if (typeof showNotification === 'function') {
                showNotification(`${entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, '')} atualizado com sucesso!`, 'success');
            }
        }
        closeCrudModal();
        await loadAndRenderEntity(entity); // Recarrega a tabela para ver as mudanças
    } catch (error) {
        console.error(`Erro ao salvar ${entity}:`, error);
        let msg = `Erro ao salvar ${entity}.`;
        if (error.message && error.message.includes("Failed to fetch")) {
            msg += " Verifique se o backend está rodando e a URL da API está correta.";
        } else if (error.message) {
            msg += ` Detalhes: ${error.message}`;
        }
        if (typeof showNotification === 'function') {
            showNotification(msg, 'error');
        }
    }
}

// Lida com a exclusão de entidade
async function deleteEntity(entity, id) {
    try {
        if (typeof showNotification === 'function') {
            showNotification(`Excluindo ${entity} com ID ${id}...`, 'info');
        }
        switch (entity) {
            case 'users':
                // API de exclusão de usuário não está implementada no backend ainda.
                if (typeof showNotification === 'function') {
                    showNotification('Exclusão de Usuários não implementada no backend ainda.', 'warning');
                }
                // await window.MathMasterAPI.User.deleteUser(id); // Exemplo de chamada
                break;
            case 'subjects':
                await window.MathMasterAPI.Modules.deleteSubject(id); // DELETE /api/modules/{id}
                break;
            case 'contents':
                 // Para Conteúdos, a rota DELETE é /api/modules/{subjectId}/contents/{contentId}
                 // Precisamos do subjectId para deletar.
                 // Para o MVP, vamos buscar o Content pelo ID na lista carregada, obter o subject.id e depois deletar.
                 const allContentsToDelete = await adminState.entityHandlers.contents.load();
                 const contentToDelete = allContentsToDelete.find(c => c.id == id);
                 if (contentToDelete && contentToDelete.subject && contentToDelete.subject.id) {
                     await window.MathMasterAPI.Modules.deleteContent(contentToDelete.subject.id, id); // DELETE /api/modules/{subjectId}/contents/{id}
                 } else {
                    if (typeof showNotification === 'function') {
                        showNotification('Erro: Não foi possível determinar a matéria do conteúdo para exclusão.', 'error');
                    }
                    return;
                 }
                break;
            case 'questions':
                 // Para Questões, a rota DELETE é /api/contents/{contentId}/questions/{questionId}
                 // Similar ao Content, precisamos do contentId.
                 const allQuestionsToDelete = await adminState.entityHandlers.questions.load();
                 const questionToDelete = allQuestionsToDelete.find(q => q.id == id);
                 if (questionToDelete && questionToDelete.content && questionToDelete.content.id) {
                     await window.MathMasterAPI.Modules.deleteQuestion(questionToDelete.content.id, id); // DELETE /api/contents/{contentId}/questions/{id}
                 } else {
                    if (typeof showNotification === 'function') {
                        showNotification('Erro: Não foi possível determinar o conteúdo da questão para exclusão.', 'error');
                    }
                    return;
                 }
                break;
            case 'achievements':
                await window.MathMasterAPI.Achievements.deleteAchievement(id); // DELETE /api/achievements/{id}
                break;
        }
        if (typeof showNotification === 'function') {
            showNotification(`${entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, '')} excluído com sucesso!`, 'success');
        }
        await loadAndRenderEntity(entity); // Recarrega a tabela
    } catch (error) {
        console.error(`Erro ao excluir ${entity}:`, error);
        let msg = `Erro ao excluir ${entity}.`;
        if (error.message && error.message.includes("Failed to fetch")) {
            msg += " Verifique se o backend está rodando e a URL da API está correta.";
        } else if (error.message) {
            msg += ` Detalhes: ${error.message}`;
        }
        if (typeof showNotification === 'function') {
            showNotification(msg, 'error');
        }
    }
}


// --- Funções para Definir Campos do Formulário CRUD por Entidade ---

function getUserFormFields(mode, id) {
    const fields = [
        { id: 'userName', label: 'Nome', name: 'name', type: 'text', required: true },
        { id: 'userEmail', label: 'Email', name: 'email', type: 'email', required: true },
        // Role será setado no backend para criação. Para edição, não é alterável via esse form.
    ];
    if (mode === 'create') {
        fields.push({ id: 'userPassword', label: 'Senha', name: 'password', type: 'password', required: true });
        // passwordConfirm é adicionado separadamente no openCrudModal
    } else if (mode === 'edit') {
        // Campo para nova senha. Se preenchido, o backend precisaria de lógica para atualizar a senha.
        // Para MVP, assumimos que o PUT de usuário não atualiza a senha, ou que esta é uma feature separada.
        // Mas podemos deixar o campo para simular que o admin "pensa" que pode mudar.
        fields.push({ id: 'userPassword', label: 'Nova Senha (opcional)', name: 'password', type: 'password', required: false, placeholder: 'Deixe em branco para manter a senha atual' });
    }
    return fields;
}

function getSubjectFormFields(mode, id) {
    return [
        { id: 'subjectName', label: 'Nome da Matéria', name: 'name', type: 'text', required: true },
        { id: 'subjectDescription', label: 'Descrição', name: 'description', type: 'textarea', required: false }
    ];
}

function getContentFormFields(mode, id) {
    const fields = [
        { id: 'contentTitle', label: 'Título do Conteúdo', name: 'title', type: 'text', required: true },
        { id: 'contentTheory', label: 'Teoria', name: 'theory', type: 'textarea', required: false }
    ];
    // Se for criação, precisa selecionar a matéria. Se for edição, assume que já está associado.
    // O ID da Matéria é essencial para a rota de criação/edição de Content.
    fields.push({ id: 'contentSubjectId', label: 'ID da Matéria (Subject ID)', name: 'subjectId', type: 'number', required: true });
    return fields;
}

function getQuestionFormFields(mode, id) {
    const fields = [
        { id: 'questionText', label: 'Texto da Questão', name: 'questionText', type: 'textarea', required: true },
        // Para as opções, vamos usar um textarea onde cada linha é uma opção
        { id: 'questionOptions', label: 'Opções (uma por linha)', name: 'options', type: 'textarea', required: true },
        { id: 'questionCorrectAnswer', label: 'Resposta Correta (Ex: A, B, C ou D)', name: 'correctAnswer', type: 'text', required: true },
        { id: 'questionType', label: 'Tipo da Questão (Ex: MULTIPLE_CHOICE)', name: 'type', type: 'text', required: true }
    ];
    // O ID do Conteúdo é essencial para a rota de criação/edição de Question.
    fields.push({ id: 'questionContentId', label: 'ID do Conteúdo (Content ID)', name: 'contentId', type: 'number', required: true });
    return fields;
}

function getAchievementFormFields(mode, id) {
    return [
        { id: 'achievementTitle', label: 'Título', name: 'title', type: 'text', required: true },
        { id: 'achievementDescription', label: 'Descrição', name: 'description', type: 'textarea', required: false },
        { id: 'achievementPoints', label: 'Pontos (Recompensa)', name: 'points', type: 'number', required: true }
    ];
}


// --- Funções para Renderizar Tabelas por Entidade ---

function renderUsersTable(users) {
    const tbody = document.querySelector('.admin-table[data-entity="users"] tbody');
    if (!tbody) return; // Garante que o tbody existe
    tbody.innerHTML = '';
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum usuário cadastrado.</td></tr>';
        return;
    }
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-secondary btn-action" data-action="edit" data-entity="users" data-id="${user.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-action" data-action="delete" data-entity="users" data-id="${user.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
}

function renderSubjectsTable(subjects) {
    const tbody = document.querySelector('.admin-table[data-entity="subjects"] tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (subjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhuma matéria cadastrada.</td></tr>';
        return;
    }
    subjects.forEach(subject => {
        tbody.innerHTML += `
            <tr>
                <td>${subject.id}</td>
                <td>${subject.name}</td>
                <td>${subject.description}</td>
                <td>
                    <button class="btn btn-secondary btn-action" data-action="edit" data-entity="subjects" data-id="${subject.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-action" data-action="delete" data-entity="subjects" data-id="${subject.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
}

function renderContentsTable(contents) {
    const tbody = document.querySelector('.admin-table[data-entity="contents"] tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (contents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum conteúdo cadastrado.</td></tr>';
        return;
    }
    contents.forEach(content => {
        // content.subject agora deve vir com o objeto Subject completo por causa do FetchType.EAGER
        // então content.subject.id é seguro de acessar.
        tbody.innerHTML += `
            <tr>
                <td>${content.id}</td>
                <td>${content.title}</td>
                <td>${content.subject ? content.subject.id : 'N/A'}</td> <td>
                    <button class="btn btn-secondary btn-action" data-action="edit" data-entity="contents" data-id="${content.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-action" data-action="delete" data-entity="contents" data-id="${content.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
}

function renderQuestionsTable(questions) {
    const tbody = document.querySelector('.admin-table[data-entity="questions"] tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (questions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhuma questão cadastrada.</td></tr>';
        return;
    }
    questions.forEach(question => {
        // question.content agora deve vir com o objeto Content completo por causa do FetchType.EAGER
        // então question.content.id é seguro de acessar.
        tbody.innerHTML += `
            <tr>
                <td>${question.id}</td>
                <td>${question.questionText ? question.questionText.substring(0, 50) + '...' : ''}</td>
                <td>${question.content ? question.content.id : 'N/A'}</td> <td>
                    <button class="btn btn-secondary btn-action" data-action="edit" data-entity="questions" data-id="${question.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-action" data-action="delete" data-entity="questions" data-id="${question.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
}

function renderAchievementsTable(achievements) {
    const tbody = document.querySelector('.admin-table[data-entity="achievements"] tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (achievements.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhuma conquista cadastrada.</td></tr>';
        return;
    }
    achievements.forEach(achievement => {
        tbody.innerHTML += `
            <tr>
                <td>${achievement.id}</td>
                <td>${achievement.title}</td>
                <td>${achievement.description}</td>
                <td>${achievement.points}</td>
                <td>
                    <button class="btn btn-secondary btn-action" data-action="edit" data-entity="achievements" data-id="${achievement.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-action" data-action="delete" data-entity="achievements" data-id="${achievement.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
}