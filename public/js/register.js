/**
 * Arquivo: public/js/register.js
 * Descrição: Lógica de submissão do formulário de Cadastro.
 * URL da API: http://localhost:3000/api/register
 * Envia: { nome, email, senha } (Conforme ajustado no server.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
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

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage();

            // Obtém os valores dos campos
            const nameValue = document.getElementById('name')?.value.trim();
            const emailValue = document.getElementById('email')?.value.trim();
            const passwordValue = document.getElementById('password')?.value.trim();
            const confirmPasswordValue = document.getElementById('confirmPassword')?.value.trim();

            // Validação de Frontend
            if (!nameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
                displayMessage('Preencha todos os campos do formulário.', false);
                return;
            }
            if (passwordValue !== confirmPasswordValue) {
                displayMessage('A senha e a confirmação de senha não coincidem.', false);
                return;
            }

            const submitButton = registerForm.querySelector('.btnn');
            submitButton.disabled = true;
            submitButton.textContent = 'Cadastrando...';

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // ENVIANDO CHAVES CORRETAS: { nome, email, senha } para o backend
                    body: JSON.stringify({ 
                        nome: nameValue, 
                        email: emailValue, 
                        senha: passwordValue 
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    displayMessage('Cadastro realizado com sucesso! Redirecionando para login...', true);
                    
                    setTimeout(() => {
                        window.location.href = '/public/pages/login.html'; 
                    }, 1500);

                } else {
                    displayMessage(`Erro no cadastro: ${data.message || 'Falha ao registrar.'}`, false);
                }

            } catch (error) {
                console.error('Erro na requisição de cadastro:', error);
                displayMessage('Erro ao conectar com o servidor.', false);
                
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Cadastrar';
            }
        });
    }
    
    // Lógica do Toggle de Senha para ambos os campos (se necessário)
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    function setupToggle(toggleEl, inputEl) {
        if (toggleEl && inputEl) {
            toggleEl.addEventListener("click", () => {
                inputEl.type = inputEl.type === "password" ? "text" : "password";
                toggleEl.classList.toggle("ri-eye-fill");
                toggleEl.classList.toggle("ri-eye-off-fill");
            });
        }
    }
    setupToggle(togglePassword, passwordInput);
    setupToggle(toggleConfirmPassword, confirmPasswordInput);
});