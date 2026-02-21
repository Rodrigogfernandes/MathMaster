# MathMaster

[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

**Plataforma educacional gamificada** para aprendizado de matemática: módulos de estudo, exercícios interativos, conquistas, comunidade e perfil de usuário — tudo em uma interface moderna e responsiva.

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Capturas de tela](#capturas-de-tela)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como executar](#como-executar)
- [Configuração da API](#configuração-da-api)
- [Contribuição](#contribuição)
- [Licença e contato](#licença-e-contato)

---

## Sobre o projeto

O **MathMaster** nasce da ideia de tornar o estudo de matemática mais acessível e motivador. Em vez de apenas listas de exercícios, o projeto oferece:

- **Gamificação** — moedas, conquistas e progresso visual para manter o engajamento.
- **Comunidade** — amigos, seguidores e compartilhamento de conquistas.
- **Módulos organizados** — conteúdos por tema (cálculo, trigonometria, álgebra etc.) com barra de progresso.
- **Experiência unificada** — perfil, notificações, tema claro/escuro e páginas legais (termos, privacidade, contato).

O frontend é **HTML, CSS e JavaScript** puro (sem framework), pensado para ser fácil de hospedar e integrar a um backend REST (por exemplo, Spring Boot) via `js/api.js`.

---

## Funcionalidades

### Autenticação e segurança

- **Login e registro** — acesso com e-mail e senha.
- **Recuperação de senha** — solicitação por e-mail e redefinição com token.
- **Proteção de rotas** — páginas que exigem login redirecionam para `login.html` (via `auth-guard.js`).
- **Token JWT** — armazenamento e envio do token nas requisições à API (`auth-storage.js`).

### Perfil do usuário

- Edição de dados pessoais e preferências.
- Upload de foto de perfil e imagem de capa.
- Estatísticas: seguidores, seguindo, amigos.
- Lista de conquistas desbloqueadas.
- Integração com chat entre amigos (quando o backend suportar).

### Dashboard e módulos

- **Página inicial** — boas-vindas, progresso diário e cards dos tópicos em destaque.
- **Módulos** — listagem de assuntos (ex.: Cálculo Integral, Trigonometria, Álgebra) com barra de progresso.
- **Página do módulo** — conteúdo teórico e exercícios interativos.
- Conquistas e recompensas vinculadas ao progresso.

### Conquistas

- Visualização de medalhas e conquistas.
- Filtros e estado de desbloqueio.
- Sons e feedback visual (ex.: `assets/sounds/achievement.mp3`).

### Comunidade

- Sistema de amigos, seguidores e seguindo.
- Feed de publicações e interação (curtir, comentar quando disponível no backend).
- Compartilhamento de conquistas.

### Outros

- **Contato** — formulário e informações de contato.
- **Termos de uso** e **Política de privacidade** — páginas estáticas.
- **Tema claro/escuro** — alternância via `components/theme.js`.
- **Notificações** — sistema de notificações na interface (`components/notifications.js`).

---

## Capturas de tela

*(Adicione aqui screenshots da página inicial, dashboard, perfil e conquistas. Exemplo: `![Dashboard](docs/screenshot-dashboard.png)`)*

---

## Arquitetura

- **Frontend estático**: HTML + CSS + JS. Pode ser servido por qualquer servidor web ou aberto direto no navegador (`index.html`).
- **Comunicação com backend**: centralizada em `js/api.js`. A URL base da API é definida por ambiente (ex.: `localhost:8080` em desenvolvimento, `/api` em produção).
- **Autenticação no cliente**:
  - `auth-storage.js`: leitura/gravação do token (ex.: `localStorage`).
  - `auth-guard.js`: em páginas protegidas, verifica o token e redireciona para `login.html` se não houver sessão.
- **Páginas públicas** (acessíveis sem login): login, recuperar/redefinir senha, termos de uso, privacidade, contato. As demais exigem usuário logado.

---

## Tecnologias

| Tecnologia        | Uso principal                                      |
|-------------------|----------------------------------------------------|
| **HTML5**         | Estrutura das páginas e semântica                  |
| **CSS3**          | Layout, responsividade, tema claro/escuro          |
| **JavaScript (ES6+)** | Lógica, chamadas à API, componentes reutilizáveis |
| **Font Awesome**  | Ícones na interface                                |
| **Google Fonts (Nunito)** | Tipografia principal                         |

Não há dependência de Node/npm para rodar o projeto; opcionalmente o repositório pode incluir workflows de CI (por exemplo, em `.github/workflows/`).

---

## Estrutura do projeto

```
MathMaster/
├── assets/
│   ├── images/          # Imagens, favicon
│   ├── sounds/          # Sons (notificações, conquistas)
│   └── leiame/          # Documentação interna
├── css/
│   ├── index.css
│   ├── login.css
│   ├── dashboard.css
│   ├── perfil.css
│   ├── comunidade.css
│   ├── conquistas.css
│   ├── modulo.css
│   ├── contato.css
│   ├── termos-de-uso.css
│   └── privacidade.css
├── js/
│   ├── index.js
│   ├── login.js
│   ├── dashboard.js
│   ├── perfil.js
│   ├── comunidade.js
│   ├── conquistas.js
│   ├── modulo.js
│   ├── contato.js
│   └── api.js           # Cliente HTTP e endpoints (User, Topics, Achievements, Community…)
├── components/
│   ├── menu.js          # Menu de navegação
│   ├── theme.js         # Tema claro/escuro
│   ├── auth-guard.js    # Proteção de rotas (redireciona se não autenticado)
│   ├── auth-storage.js  # Armazenamento do token de autenticação
│   └── notifications.js # Sistema de notificações
├── .github/
│   └── workflows/       # CI/CD (GitHub Actions)
├── index.html           # Página inicial
├── login.html
├── recuperar-senha.html
├── redefinir-senha.html
├── dashboard.html       # Módulos de aprendizado
├── modulo.html          # Conteúdo de um módulo
├── conquistas.html
├── comunidade.html
├── perfil.html
├── contato.html
├── termos-de-uso.html
├── privacidade.html
├── LICENSE
└── README.md
```

---

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari).
- Para uso completo (login, módulos, conquistas, comunidade): backend REST configurado e em execução (ex.: Spring Boot na porta 8080).

---

## Como executar

### Modo apenas frontend (sem backend)

1. Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/rodrigogfernandes/MathMaster.git
cd MathMaster
```

2. Abra `index.html` no navegador (duplo clique ou arrastar para o navegador).

Páginas públicas funcionarão normalmente; páginas que dependem de API podem exibir erros ou dados mock até o backend estar no ar.

### Modo frontend + backend

1. Configure a URL da API conforme a seção [Configuração da API](#configuração-da-api).
2. Inicie o backend (por exemplo, Spring Boot na porta 8080).
3. Sirva o frontend por um servidor HTTP (evita problemas de CORS ao usar `file://`). Exemplo com Python:

```bash
# Python 3
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

---

## Configuração da API

A base da API é definida em `js/api.js`:

- Em **localhost**: `http://localhost:8080/api`
- Em **produção** (mesmo domínio): `/api`

Para alterar a URL (outro host ou porta), edite a constante `API_BASE_URL` no início de `js/api.js`. O cliente usa **Bearer token** (JWT) no header `Authorization` quando o usuário está logado.

---

## Contribuição

1. Faça um **fork** do repositório.
2. Crie uma **branch** para sua alteração:  
   `git checkout -b feature/minha-melhoria`
3. Commit suas mudanças:  
   `git commit -m 'feat: descrição objetiva'`
4. Envie para o repositório remoto:  
   `git push origin feature/minha-melhoria`
5. Abra um **Pull Request** descrevendo o que foi alterado e por quê.

Sugestões de estilo: mensagens de commit em português ou em inglês; preferir nomes de branch como `feature/...`, `fix/...` ou `docs/...`.

---

## Licença e contato

Este projeto está sob a **licença MIT**. Detalhes em [LICENSE](LICENSE).

**Contato:** Rodrigo — rodrigo.guedes.f@gmail.com  

**Repositório:** [github.com/rodrigogfernandes/MathMaster](https://github.com/rodrigogfernandes/MathMaster)
