/**
 * Arquivo: public/js/login.js
 * Descrição: Lógica de submissão do formulário de Login.
 * URL da API: http://localhost:3000/api/login
 * Envia: { email, password }
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Função para exibir feedback (assumindo que o HTML tem um div id="messageDisplay")
    function displayMessage(message, isSuccess = false) {
        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) return;

        messageDisplay.textContent = message;
        messageDisplay.className = isSuccess ? 'message success' : 'message error'; 
        messageDisplay.style.display = 'block';
    }

    function clearMessage() {
        const messageDisplay = document.getElementById('messageDisplay');
        if (messageDisplay) messageDisplay.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage();
            
            // Obtém os valores dos campos
            const email = document.getElementById('email')?.value.trim();
            const passwordValue = document.getElementById('password')?.value.trim();
            
            if (!email || !passwordValue) {
                displayMessage('Por favor, preencha o e-mail e a senha.', false);
                return;
            }

            const submitButton = loginForm.querySelector('.btnn');
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            try {
                const response = await fetch('http://localhost:3000/api/login', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: passwordValue }) 
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // 1. Armazena o Token JWT e dados do usuário
                    localStorage.setItem('userToken', data.token);
                    if (data.user) {
                        localStorage.setItem('userName', data.user.name);
                    }
                    
                    displayMessage(`Bem-vindo(a), ${data.user?.name || 'Usuário'}! Redirecionando...`, true); 

                    // 2. Redireciona
                    setTimeout(() => {
                        window.location.href = data.redirect || '/public/pages/index.html';
                    }, 1000); 

                } else {
                    displayMessage(`Erro no login: ${data.message || 'Credenciais inválidas.'}`, false);
                }

            } catch (error) {
                console.error('Erro na requisição de login:', error);
                displayMessage('Erro de comunicação com o servidor. (Verifique o Node)', false);
                
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            }
        });
    }

    // Lógica do Toggle de Senha (se necessário)
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            togglePassword.classList.toggle("ri-eye-fill");
            togglePassword.classList.toggle("ri-eye-off-fill");
        });
    }
});