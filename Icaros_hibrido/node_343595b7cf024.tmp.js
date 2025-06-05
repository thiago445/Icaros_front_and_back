const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const hbs = require('./config/handlebars');
const session = require('express-session'); 7
const path = require('path');
require('dotenv').config();
require('./models/mongo/mongoDb');

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3000', // Ajuste para a porta correta do frontend
    credentials: true
}));



// Configuração da sessão
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Deve ser false para localhost
}));

app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../front_icaros/my-project/build')));

// Configuração do Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servindo arquivos estáticos
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));
app.use('/script', express.static(path.join(__dirname, 'public', 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importa e usa as rotas
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const profileRoutes = require('./routes/protectedRoutes/profilesRoutes');
const PictureRoutes = require('./routes/protectedRoutes/pictureRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/posts', postRoutes);
app.use('/prot', protectedRoutes);
app.use('/profile', profileRoutes);
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/pictures', PictureRoutes);

// Fallback para React Router
// ROTA Fallback para React (somente se não for rota de API)
app.get('*', (req, res, next) => {
    const isApiRequest = req.originalUrl.startsWith('/profile') ||
        req.originalUrl.startsWith('/auth') ||
        req.originalUrl.startsWith('/posts') ||
        req.originalUrl.startsWith('/pictures') ||
        req.originalUrl.startsWith('/prot');

    if (isApiRequest) {
        return res.status(404).json({ success: false, message: 'Rota da API não encontrada.' });
    }

    // Se não for API, cai no React
    res.sendFile(path.join(__dirname, '../front_icaros/my-project/build/index.html'));
});


// Definição da porta
// const PORT = process.env.PORT || 8081;
// app.listen(PORT, () => {
//     console.log(`Servidor rodando em http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 8081;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

