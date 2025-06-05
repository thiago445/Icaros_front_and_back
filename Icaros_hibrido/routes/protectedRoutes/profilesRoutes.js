const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const Usuario = require('../../models/tb_usuario');
const UsuarioMusico = require('../../models/tb_usuario_musico');
const UsuarioProdutor = require('../../models/tb_usuario_produtor');
const UsuarioAmanteMusica = require('../../models/tb_usuario_am');


const { findById } = require('../../models/mongo/picture');

// router.get('/info', authenticateToken, async (req, res) => {
//     try {
//         const user = await Usuario.findByPk(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: 'Usuário não encontrado' });
//         }
//         const userType = user.flag_tipo_usuario;

//         switch (userType) {
//             case 1:
//                 const musician = await UsuarioMusico.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
//                 res.json({
//                     user,
//                     musician,
//                 })

//                 break;
//             case 2:
//                 const am = await UsuarioAmanteMusica.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
//                 res.json({
//                     user,
//                     am,
//                 })
//                 break;
//             case 3:
//                 const producer = await UsuarioProdutor.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
//                 res.json({
//                     user,
//                     producer,
//                 })

//                 break;
//             default:
//                 console.log('Tipo de usuário desconhecido');
//         }


//     } catch (error) {
//         res.status(500).json({ message: 'Erro ao buscar usuário', error });
//     }
// });


const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); //5 minutos (300 segundos)

// Sua rota com cache:
router.get('/info', authenticateToken, async (req, res) => {
    try {
        const cacheKey = `userInfo:${req.user.id}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userType = user.flag_tipo_usuario;
        let result;

        switch (userType) {
            case 1:
                const musician = await UsuarioMusico.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                result = { user, musician };
                break;
            case 2:
                const am = await UsuarioAmanteMusica.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                result = { user, am };
                break;
            case 3:
                const producer = await UsuarioProdutor.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                result = { user, producer };
                break;
            default:
                console.log('Tipo de usuário desconhecido');
                return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        // Salva no cache por 5 minutos
        cache.set(cacheKey, result);
        console.log(result);

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
});


router.put('/update_user', authenticateToken, async (req, res) => {
    try {
        const { musicalGenre, name } = req.body.user;
        const { comment } = req.body.userMusician;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        user.NOME = name || user.NOME; // faz a  atualização se um novo nome for fornecido
        user.GENERO_MUSICAL = musicalGenre || user.GENERO_MUSICAL; // faz a atualização se um novo gênero musical for fornecido
        user.NovoUsuario = false;
        await user.save();

        const cacheKey = `userInfo:${req.user.id}`;
        cache.del(cacheKey);
        console.log('🧹 Cache da imagem antigo limpo:', cacheKey);

        const musician = await UsuarioMusico.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });

        if (!musician) {
            return res.status(404).json({ message: 'Músico não encontrado' });
        }

        // Atualiza os dados do músico
        musician.COMENTARIO = comment || musician.COMENTARIO; //faz a atualização se um novo comentário for fornecido

        await musician.save();

        return res.json({ message: 'Dados atualizados com sucesso', user, musician });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar os dados', error });
    }

});
router.get('/visitante/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário inválido'
            });
        }

        const user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        const { SENHA, confirmationToken, ...safeUser } = user.get({ plain: true });

        let result = {
            success: true,
            user: safeUser,
            musician: null // padrão, caso não seja músico
        };

        if (user.flag_tipo_usuario === 1) {
            const musician = await UsuarioMusico.findOne({
                where: { ID_USUARIO: userId },
                attributes: { exclude: ['senha'] }
            });

            result.musician = musician ? musician.get({ plain: true }) : null;
        }

        console.log("Enviando resposta JSON:", result);
        res.json(result);

    } catch (error) {
        console.error('Erro na rota visitante:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});




module.exports = router;