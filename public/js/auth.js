document.addEventListener('DOMContentLoaded', () => {
    // FUNÇÃO PRINCIPAL: Renderiza a navegação com base no estado de login
    function renderNavigation() {
        // Simulação: Checa a existência de um token de usuário no armazenamento local
        const token = localStorage.getItem('userToken');
        const mainNavUl = document.querySelector('.main-nav ul');
        const authControls = document.getElementById('auth-controls');

        // Limpa a navegação e controles existentes
        if (mainNavUl) mainNavUl.innerHTML = '';
        if (authControls) authControls.innerHTML = '';

        const currentPath = window.location.pathname;

        // Links de navegação principais
        const baseLinks = [
            { href: "/public/pages/index.html", text: "Início" },
            { href: "/public/pages/sobre.html", text: "Sobre" },
            { href: "/public/pages/instrumentos.html", text: "Instrumentos" },
            { href: "/public/pages/depoimentos.html", text: "Depoimentos" }
        ];

        let links;

        if (token) {
            // USUÁRIO LOGADO
            links = [
                ...baseLinks,
                { href: "/public/pages/progresso.html", text: "Progresso" },
                { href: "/public/pages/perfil.html", text: "Perfil" }
            ];

            // Botão de Logout
            const logoutButton = document.createElement('a');
            logoutButton.classList.add('login-btn');
            logoutButton.textContent = 'Logout';
            logoutButton.href = '#';
            logoutButton.addEventListener('click', handleLogout);
            if (authControls) authControls.appendChild(logoutButton);

        } else {
            // USUÁRIO DESLOGADO
            links = baseLinks;

            // Botão de Login/Cadastro
            const loginButton = document.createElement('a');
            loginButton.classList.add('login-btn');
            loginButton.textContent = 'Login / Cadastro';
            loginButton.href = '/public/pages/entry.html';
            if (authControls) authControls.appendChild(loginButton);
        }

        // Constrói a lista de links na navegação
        if (mainNavUl) {
            links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.text;

                // Define o link ativo (aria-current)
                if (currentPath.endsWith(link.href)) {
                    a.setAttribute('aria-current', 'page');
                }
                
                li.appendChild(a);
                mainNavUl.appendChild(li);
            });
        }
    }

    // FUNÇÃO DE LOGOUT
    function handleLogout(event) {
        event.preventDefault();
        // Remove o token de simulação
        localStorage.removeItem('userToken');
        // Redireciona para a página inicial
        window.location.href = '/public/pages/index.html';
    }

    // SIMULAÇÃO DE LOGIN/CADASTRO (A ser usado nas páginas login.html e cadastro.html)
    window.simulateLogin = (username) => {
        // Simula a criação de um token
        localStorage.setItem('userToken', `token-${new Date().getTime()}`);
        // Simula o armazenamento de dados básicos do usuário
        localStorage.setItem('userData', JSON.stringify({
            username: username || 'Júlia Moraes',
            email: 'julia.moraes@instrumusic.com',
            instrument: 'Piano Clássico',
            level: 'Intermediário',
            memberSince: '14 de junho de 2024'
        }));
        // Redireciona para o Dashboard (Progresso)
        window.location.href = '/public/pages/progresso.html';
    };
    
    // Executa a função de renderização da navegação ao carregar a página
    renderNavigation();
});