const multer = require('multer');
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Configuração do Multer
const storage = multer.memoryStorage(); // Usando memória para armazenamento temporário
const upload = multer({
    storage: storage,
    limits: { fileSize: Infinity } 
}).fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

// criar postagem
router.post('/create', authMiddleware, upload, postController.createPost);

// Rota pra buscar todas as postagens do usuário autenticado
router.get('/user-posts', authMiddleware, postController.getUserPosts);

//apagar postagem
router.delete('/:id', authMiddleware, postController.deletePost);
//buscar todas as postagens

router.get('/', postController.getAllPosts);

router.get('/user/:userId', postController.getPostsByUserId);

module.exports = router;
