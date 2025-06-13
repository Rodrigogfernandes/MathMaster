let selectedLevel = '';
        let selectedSubjects = [];

        function selectLevel(element, level) {
            // Remove selection from all level cards
            document.querySelectorAll('.level-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selection to clicked card
            element.classList.add('selected');
            selectedLevel = level;
            
            // Update selected level display
            document.getElementById('selectedLevel').textContent = `Nível: ${capitalizeFirstLetter(level)}`;
            
            // Show learning path if subjects are also selected
            updateLearningPath();
        }

        function selectSubject(element, subject) {
            // Toggle selection
            if (element.classList.contains('selected')) {
                element.classList.remove('selected');
                selectedSubjects = selectedSubjects.filter(item => item !== subject);
            } else {
                element.classList.add('selected');
                selectedSubjects.push(subject);
            }
            
            // Update learning path
            updateLearningPath();
        }

        function updateLearningPath() {
            // Only show learning path if both level and at least one subject are selected
            if (selectedLevel && selectedSubjects.length > 0) {
                document.getElementById('learningPath').style.display = 'block';
                
                // Show topics for selected subjects
                document.getElementById('algebraTopics').style.display = selectedSubjects.includes('algebra') ? 'block' : 'none';
                document.getElementById('geometriaTopics').style.display = selectedSubjects.includes('geometria') ? 'block' : 'none';
                document.getElementById('calculoTopics').style.display = selectedSubjects.includes('calculo') ? 'block' : 'none';
                document.getElementById('estatisticaTopics').style.display = selectedSubjects.includes('estatistica') ? 'block' : 'none';
            } else {
                document.getElementById('learningPath').style.display = 'none';
            }
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function startLearning() {
            if (selectedLevel && selectedSubjects.length > 0) {
                // Redirecionar para a página de módulo
                window.location.href = 'modulo.html';
            } else {
                alert('Por favor, selecione um nível e pelo menos uma matéria antes de começar.');
            }
        }

        function openProfileMenu() {
            // Simular abertura de menu de perfil
            const hasLoginPage = true; // Definir como true se a página de login existir
            
            if (hasLoginPage) {
                // Redirecionar para a página de login
                window.location.href = 'login.html';
            } else {
                alert('Menu de perfil (em desenvolvimento)');
            }
        }

        // Tema escuro
        function createThemeToggle() {
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '🌓';
            themeToggle.style.position = 'fixed';
            themeToggle.style.bottom = '20px';
            themeToggle.style.left = '20px';
            themeToggle.style.backgroundColor = 'var(--primary)';
            themeToggle.style.color = 'var(--white)';
            themeToggle.style.width = '40px';
            themeToggle.style.height = '40px';
            themeToggle.style.borderRadius = '50%';
            themeToggle.style.display = 'flex';
            themeToggle.style.alignItems = 'center';
            themeToggle.style.justifyContent = 'center';
            themeToggle.style.cursor = 'pointer';
            themeToggle.style.boxShadow = 'var(--shadow)';
            themeToggle.style.zIndex = '50';
            
            themeToggle.addEventListener('click', toggleTheme);
            
            document.body.appendChild(themeToggle);
        }
        
        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                document.documentElement.style.setProperty('--light-bg', '#1f2937');
                document.documentElement.style.setProperty('--white', '#374151');
                document.documentElement.style.setProperty('--text', '#e5e7eb');
                document.documentElement.style.setProperty('--primary', '#60a5fa');
            } else {
                document.documentElement.style.setProperty('--light-bg', '#f5f7fa');
                document.documentElement.style.setProperty('--white', '#ffffff');
                document.documentElement.style.setProperty('--text', '#333333');
                document.documentElement.style.setProperty('--primary', '#4a6fa5');
            }
        }
        
        // Criar o botão de alternância de tema quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            createThemeToggle();
        });

