// Executa o código somente quando TODO o HTML estiver carregado
document.addEventListener('DOMContentLoaded', () => {

    // Apenas log no console informando que o JavaScript foi carregado
    console.log('InstruMusic: Frontend JavaScript carregado.');


    // FUNÇÃO showMessage(): exibe mensagens de sucesso ou erro
    function showMessage(container, message, type = 'success') {
        container.innerText = message;                    // Define o texto da mensagem
        container.className = `message ${type}`;          // Aplica classes CSS (ex: message success)
        container.style.display = 'block';                // Torna a mensagem visível
        setTimeout(() => container.style.display = 'none', 4000); // Some após 4s
    }


    // FORMULÁRIO DE LOGIN

    // Obtém o formulário com ID 'loginForm' (se existir na página)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {

        // Cria um espaço para mensagens dentro do formulário
        const loginMsg = document.createElement('div');
        loginMsg.className = 'message';
        loginForm.appendChild(loginMsg);

        // Evento de submit (quando o usuário tenta logar)
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede a página de recarregar

            // Coleta valores dos inputs
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                // Envia requisição ao backend para fazer login
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json(); // Converte a resposta em JSON

                // Se deu tudo certo → login bem-sucedido
                if (data.success) {
                    showMessage(loginMsg, `Bem-vindo(a), ${data.user.name}!`, 'success');

                    // Aguarda 1s e redireciona para a página definida no backend
                    setTimeout(() => window.location.href = data.redirect, 1000);

                } else {
                    // Caso o backend diga que falhou
                    showMessage(loginMsg, `Erro no login: ${data.message}`, 'error');
                }

            } catch (error) {
                // Erro de conexão, servidor offline, etc.
                console.error('Erro na requisição de login:', error);
                showMessage(loginMsg, 'Erro de comunicação com o servidor.', 'error');
            }
        });
    }


    // FORMULÁRIO DE CADASTRO

    const registerForm = document.getElementById('registerForm');

    if (registerForm) {

        // Cria div para mensagens no formulário
        const registerMsg = document.createElement('div');
        registerMsg.className = 'message';
        registerForm.appendChild(registerMsg);

        // Evento de envio do formulário de registro
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita recarregar a página

            // Coleta dados dos inputs
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;

            // Verifica se as senhas coincidem antes de enviar ao backend
            if (password !== confirmPassword) {
                showMessage(registerMsg, 'As senhas não coincidem!', 'error');
                return; // Para a execução aqui
            }

            try {
                // Envia dados para criar novo usuário
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Cadastro concluído com sucesso
                    showMessage(registerMsg, 'Cadastro realizado com sucesso! Redirecionando para login...', 'success');

                    // Vai para login após 1.5s
                    setTimeout(() => window.location.href = 'login.html', 1500);

                } else {
                    // Backend retornou erro
                    showMessage(registerMsg, `Erro no cadastro: ${data.message}`, 'error');
                }

            } catch (error) {
                // Problemas com servidor ou internet
                console.error('Erro na requisição de cadastro:', error);
                showMessage(registerMsg, 'Erro ao conectar com o servidor.', 'error');
            }
        });
    }


    // BOTÃO DE LOGOUT

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Mostra mensagem de saída
            showMessage(document.body, 'Você saiu da conta.', 'success');

            // Redireciona após 1 segundo
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

});