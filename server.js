// Importa o framework Express, usado para criar o servidor e as rotas HTTP
const express = require('express');

// Módulo nativo do Node para lidar com caminhos de arquivos (join, resolve, etc.)
const path = require('path');

// Módulo nativo do Node para manipulação de arquivos (ler, verificar se existe, etc.)
const fs = require('fs');

// Middleware usado para liberar o acesso de outros domínios (Cross-Origin Resource Sharing)
const cors = require('cors');

// Driver MySQL com suporte a Promises (permite usar async/await)
const mysql = require('mysql2/promise');

// Biblioteca para criptografar senhas antes de salvar no banco de dados
const bcrypt = require('bcrypt');

// Biblioteca para gerar e validar JWT (tokens de autenticação)
const jwt = require('jsonwebtoken');

// Cria a aplicação Express
const app = express();

// Define a porta onde o servidor vai rodar
const port = 3000; // Porta local fixa

// Chave secreta usada para assinar tokens JWT (ideal usar variável de ambiente)
const JWT_SECRET = "super_secret_key"; // Chave fixa local


const db = mysql.createPool({
    host: 'localhost',      // Servidor do banco (localhost)
    user: 'root',           // Usuário do MySQL
    password: 'senai',      // Senha do MySQL
    database: 'instrumusic_db', // Nome do banco de dados
});


// Middleware que permite requisições de outros domínios
app.use(cors());

// Middleware que interpreta JSON enviado no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta "/public"
app.use('/public', express.static(path.join(__dirname, 'public')));


// Função para enviar arquivos HTML ao cliente
const sendHTML = (res, file) => {
    // Monta o caminho absoluto do arquivo
    const filePath = path.join(__dirname, file);

    // Se o arquivo existe, envia; se não, manda erro 404
    fs.existsSync(filePath) ? res.sendFile(filePath) : res.status(404).send("404");
};


// ROTA PRINCIPAL (Página inicial)
app.get("/", (req, res) => 
    sendHTML(res, "public/pages/index.html")
);


// ROTA para páginas dentro da pasta "instrumentos"
app.get("/instrumentos/:file", (req, res) => {
    // Remove eventual ".html" da URL e depois recoloca
    const f = req.params.file.replace(".html", "") + ".html";

    // Envia o arquivo correspondente na pasta instrumentos
    sendHTML(res,` public/instrumentos/${f}`); // (Correção: agora é string válida)
});


// ROTA geral para páginas na pasta "/public/pages"
app.get("/:page", (req, res) => {
    // Remove ".html" se existir e coloca novamente
    const f = req.params.page.replace(".html", "") + ".html";

    // Envia o arquivo dentro de public/pages
    sendHTML(res,` public/pages/${f}`); // (Correção: agora é string válida)
});


//  ROTA DE CADASTRO
app.post("/api/register", async (req, res) => {

    // Dados enviados pelo front-end (como JSON)
    const { name, email, password } = req.body;

    // Verifica se todos os campos foram enviados
    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: "Dados incompletos." });

    try {  
        // Cria um hash seguro da senha com bcrypt
        const hash = await bcrypt.hash(password, 10);

        // Insere o novo usuário no banco de dados
        await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hash]
        );

        res.status(201).json({ success: true, message: "Usuário registrado!" });

    } catch (err) {  
        // Se o e-mail já existe no banco (erro de duplicidade)
        if (err.code === "ER_DUP_ENTRY")
            return res.status(409).json({ success: false, message: "E-mail já cadastrado." });

        // Outros erros (servidor, banco, etc.)
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno." });
    }

});


//  ROTA DE LOGIN
app.post("/api/login", async (req, res) => {

    // Dados enviados pelo usuário
    const { email, password } = req.body;

    // Verificação simples de campos preenchidos
    if (!email || !password)
        return res.status(400).json({ success: false, message: "Preencha todos os campos." });

    try {  
        // Busca o usuário no banco pelo e-mail
        const [rows] = await db.execute(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0]; // Primeiro registro encontrado

        // Se não achar o usuário → e-mail inválido
        if (!user) 
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });

        // Compara a senha enviada com a senha salva (hash)
        const match = await bcrypt.compare(password, user.password);

        // Se a senha não bater → credenciais inválidas
        if (!match)
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });

        // Se deu tudo certo → cria um token JWT
        const token = jwt.sign(
            { id: user.id },     // Dados armazenados no token
            JWT_SECRET,          // Chave secreta
            { expiresIn: "2h" }  // Tempo de validade do token
        );

        // Resposta com o token e dados do usuário
        res.json({
            success: true,
            message: "Login realizado!",
            token,
            redirect: "/progresso.html", // Rota para onde o usuário deve ir
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            }
        });

    } catch (err) {  
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno." });
    }

});


// Inicia o servidor e mostra no console
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});