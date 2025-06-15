-- =========== USUÁRIOS ===========
-- Senha para admin@mathmaster.com é "adminpass"
INSERT INTO users (name, email, password) VALUES ('Admin MathMaster', 'admin@mathmaster.com', '$2a$10$8.4I4gqWd05161A72u492.eAXl3B9h3E6cgzAS2j6O5k5yY3jfpjC');
-- Senha para rodrigo@amigo.com é "userpass"
INSERT INTO users (name, email, password) VALUES ('Rodrigo Fernandes', 'rodrigo@amigo.com', '$2a$10$UaFq5sT6h2pA8b2.z1nC5uJ2bK1aI8aJ4eP2s3O5b7Y9g1V3oE5a');


-- =========== MATÉRIAS (SUBJECTS) ===========
INSERT INTO subject (name, description) VALUES ('Álgebra Básica', 'Domine os fundamentos da álgebra e resolva equações com confiança.');
INSERT INTO subject (name, description) VALUES ('Geometria', 'Explore as formas, o espaço e as propriedades que definem o mundo ao nosso redor.');
INSERT INTO subject (name, description) VALUES ('Cálculo', 'Aprenda sobre limites, derivadas, integrais e séries.');
INSERT INTO subject (name, description) VALUES ('Estatística', 'Interprete dados e tome decisões baseadas em evidências.');


-- =========== CONQUISTAS (ACHIEVEMENTS) ===========
INSERT INTO achievement (title, description, points) VALUES ('Mestre das Derivadas', 'Complete 10 exercícios de cálculo diferencial sem erros.', 50);
INSERT INTO achievement (title, description, points) VALUES ('Sequência de Fogo', 'Estude matemática por 5 dias consecutivos.', 30);
INSERT INTO achievement (title, description, points) VALUES ('Velocista Matemático', 'Resolva 5 problemas em menos de 3 minutos.', 40);
INSERT INTO achievement (title, description, points) VALUES ('Mestre da Trigonometria', 'Complete 5 lições de trigonometria.', 20);


-- =========== CONTEÚDOS (CONTENTS) PARA A MATÉRIA DE ID=1 (Álgebra Básica) ===========
INSERT INTO content (title, theory, subject_id) VALUES ('Introdução à Álgebra', 'Texto explicando o que são variáveis, constantes e expressões algébricas.', 1);
INSERT INTO content (title, theory, subject_id) VALUES ('Equações de 1º Grau', 'Aprenda a resolver equações lineares com uma variável e suas aplicações.', 1);


-- =========== QUESTÕES (QUESTIONS) PARA O CONTEÚDO DE ID=2 (Equações de 1º Grau) ===========
INSERT INTO question (question_text, correct_answer, type, content_id) VALUES ('Se 5x - 10 = 15, qual o valor de x?', 'C) 5', 'MULTIPLE_CHOICE', 2);
-- Opções para a questão de ID=1
INSERT INTO question_options (question_id, option_text) VALUES (1, 'A) 3');
INSERT INTO question_options (question_id, option_text) VALUES (1, 'B) 4');
INSERT INTO question_options (question_id, option_text) VALUES (1, 'C) 5');