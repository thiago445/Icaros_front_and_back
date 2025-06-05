const express = require('express');
const authenticateToken = require('../middleware/auth');
const Usuario = require('../models/tb_usuario');
const {redirect} =require('../controllers/authController');
const router = express.Router();

 // buscar e retornar os dados do perfil do usuário
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;

   
    res.json({ message: 'Aqui estão seus dados de perfil', userId });
});

router.get('/tipeUser', authenticateToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id); 
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ userType: usuario.flag_tipo_usuario, newUser: usuario.NovoUsuario});
    } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do usuário' });
    }
});

router.get('/redirect',authenticateToken, redirect);




module.exports = router;