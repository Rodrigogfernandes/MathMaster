// Respostas corretas para cada exercício
const correctAnswers = {
    1: 'C', // x = 4,    a = 3
    2: 'B', // x = 4
    3: 'D'  // x = 5,    a = 4
};

// Armazenar respostas do usuário
const userAnswers = {};
let answersChecked = false;

function selectOption(option, questionNumber, selectedOption) {
    // Se as respostas já foram verificadas, não permitir novas seleções
    if (answersChecked) return;

    // Remover seleção anterior
    const options = option.parentElement.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));

    // Selecionar a opção clicada
    option.classList.add('selected');

    // Armazenar resposta do usuário
    userAnswers[questionNumber] = selectedOption;
}

function checkAllAnswers() {
    if (answersChecked) return;

    let correctCount = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    // Verificar cada resposta
    for (let questionNumber in correctAnswers) {
        const userAnswer = userAnswers[questionNumber];
        const isCorrect = userAnswer === correctAnswers[questionNumber];

        // Mostrar feedback
        const feedbackElement = document.getElementById(`feedback-${questionNumber}`);

        if (!userAnswer) {
            feedbackElement.textContent = "Você não respondeu esta questão.";
            feedbackElement.className = "feedback wrong";
            continue;
        }

        if (isCorrect) {
            feedbackElement.textContent = "Correto! Excelente trabalho!";
            feedbackElement.className = "feedback correct";
            correctCount++;
        } else {
            feedbackElement.textContent = `Incorreto. A resposta correta é ${correctAnswers[questionNumber]}.`;
            feedbackElement.className = "feedback wrong";
        }

        // Destacar as opções corretas e incorretas
        const options = document.querySelectorAll(`.exercise:nth-child(${questionNumber}) .option`);
        options.forEach(option => {
            const optionLetter = option.querySelector('.option-letter').textContent;

            if (optionLetter === correctAnswers[questionNumber]) {
                option.classList.add('correct');
            } else if (optionLetter === userAnswer && userAnswer !== correctAnswers[questionNumber]) {
                option.classList.add('wrong');
            }
        });
    }

    // Marcar como verificado
    answersChecked = true;

    // Se o usuário acertou alguma questão, dar recompensa
    if (correctCount > 0) {
        const rewardPoints = correctCount * 15; // 15 moedas por questão correta
        document.getElementById('rewardCoins').textContent = rewardPoints;
        showReward();

        // Atualizar moedas do usuário
        const currentCoins = parseInt(document.getElementById('userCoins').textContent);
        document.getElementById('userCoins').textContent = currentCoins + rewardPoints;

        // Atualizar progresso do módulo
        updateModuleProgress();
    }
}

function showReward() {
    const rewardAnimation = document.getElementById('rewardAnimation');
    rewardAnimation.style.display = 'block';

    // Esconder após 3 segundos
    setTimeout(() => {
        rewardAnimation.style.display = 'none';
    }, 3000);
}

function updateModuleProgress() {
    // Simular atualização de progresso
    const progressBar = document.getElementById('moduleProgress');
    const currentProgress = 35;
    const newProgress = 40; // Aumentar progresso em 5%

    progressBar.style.width = `${newProgress}%`;
    document.querySelector('.progress-text span:first-child').textContent = `Progresso: ${newProgress}%`;

    // Animar a transição
    progressBar.style.transition = 'width 1s ease';
}

function changeTopic(topicNumber) {
    alert(`Navegando para o tópico ${topicNumber}`);
    // Aqui você implementaria a navegação real para o tópico selecionado
}

function goToModule() {
    window.location.href = 'dashboard.html';
}


// ---------------------------------------------------
function openProfileMenu() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function quickLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Aqui você implementaria a lógica real de login
    // Por enquanto, apenas redirecionamos para o dashboard
    window.location.href = 'dashboard.html';
}

