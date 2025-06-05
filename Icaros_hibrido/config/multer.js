const multer = require('multer');
const path = require('path');

// Configuração do armazenamento local temporário
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Diretório temporário
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
    },
});

const upload = multer({ storage });

module.exports = upload;
