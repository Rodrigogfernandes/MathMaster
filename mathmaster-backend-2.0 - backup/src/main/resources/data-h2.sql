-- Dados iniciais para perfil H2 (sintaxe compatível; schema recriado a cada subida)
-- Usuários: admin@mathmaster.com / adminpass  |  rodrigo@amigo.com / userpass

INSERT INTO users (id, name, email, password) VALUES (1, 'Admin MathMaster', 'admin@mathmaster.com', '$2a$10$8.4I4gqWd05161A72u492.eAXl3B9h3E6cgzAS2j6O5k5yY3jfpjC');
INSERT INTO users (id, name, email, password) VALUES (2, 'Rodrigo Fernandes', 'rodrigo@amigo.com', '$2a$10$UaFq5sT6h2pA8b2.z1nC5uJ2bK1aI8aJ4eP2s3O5b7Y9g1V3oE5a');

INSERT INTO subject (id, name, description) VALUES (1, 'Álgebra Básica', 'Domine os fundamentos da álgebra e resolva equações com confiança.');
INSERT INTO subject (id, name, description) VALUES (2, 'Geometria', 'Explore as formas, o espaço e as propriedades que definem o mundo ao nosso redor.');
INSERT INTO subject (id, name, description) VALUES (3, 'Cálculo', 'Aprenda sobre limites, derivadas, integrais e séries.');
INSERT INTO subject (id, name, description) VALUES (4, 'Estatística', 'Interprete dados e tome decisões baseadas em evidências.');

INSERT INTO achievement (id, title, description, points) VALUES (1, 'Mestre das Derivadas', 'Complete 10 exercícios de cálculo diferencial sem erros.', 50);
INSERT INTO achievement (id, title, description, points) VALUES (2, 'Sequência de Fogo', 'Estude matemática por 5 dias consecutivos.', 30);
INSERT INTO achievement (id, title, description, points) VALUES (3, 'Velocista Matemático', 'Resolva 5 problemas em menos de 3 minutos.', 40);
INSERT INTO achievement (id, title, description, points) VALUES (4, 'Mestre da Trigonometria', 'Complete 5 lições de trigonometria.', 20);

INSERT INTO content (id, title, theory, subject_id) VALUES (1, 'Introdução à Álgebra', 'Texto explicando o que são variáveis, constantes e expressões algébricas.', 1);
INSERT INTO content (id, title, theory, subject_id) VALUES (2, 'Equações de 1º Grau', 'Aprenda a resolver equações lineares com uma variável e suas aplicações.', 1);

INSERT INTO question (id, question_text, correct_answer, type, content_id) VALUES (1, 'Se 5x - 10 = 15, qual o valor de x?', 'C) 5', 'MULTIPLE_CHOICE', 2);
INSERT INTO question_options (question_id, option_text) VALUES (1, 'A) 3');
INSERT INTO question_options (question_id, option_text) VALUES (1, 'B) 4');
INSERT INTO question_options (question_id, option_text) VALUES (1, 'C) 5');
