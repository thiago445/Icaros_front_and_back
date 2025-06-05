const Post = require('../models/mongo/Post');
const { Dropbox } = require('dropbox');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const { checkAndRefreshToken } = require('../config/dropboxconfig');
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/tb_usuario');

const getDropboxClient = async () => {
    await checkAndRefreshToken();
    console.log("Token atualizado:", process.env.DROPBOX_ACCESS_TOKEN);
    return new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
};

const uploadToDropbox = async (fileBuffer, dropboxPath) => {
    try {
        const dbx = await getDropboxClient(); // Usa o cliente atualizado do Dropbox

        const uploadResponse = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileBuffer,
        });
        return uploadResponse.result.path_display;
    } catch (error) {
        console.error('Erro ao enviar para o Dropbox:', error);
        throw error;
    }
};

function compressVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        execFile(ffmpegPath, ['-i', inputPath, '-codec:v', 'libx264', '-crf', '28', '-preset', 'fast', outputPath], (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao compactar o vídeo:', error);
                reject(error);
            } else {
                console.log('Compressão concluída');
                resolve();
            }
        });
    });
}

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        const videoFile = req.files && req.files.video ? req.files.video[0] : null;
        const imageFile = req.files && req.files.image ? req.files.image[0] : null;

        let videoPath = null;
        let imagePath = null;

        // Criar diretório de uploads se não existir
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (videoFile) {
            const tempFilePath = path.join(uploadDir, videoFile.originalname);
            const compressedFilePath = path.join(uploadDir, `compressed_${videoFile.originalname}`);

            // Salva o arquivo temporariamente e compactar
            try {
                fs.writeFileSync(tempFilePath, videoFile.buffer);
            } catch (err) {
                console.error('Erro ao salvar o arquivo temporário:', err);
                return res.status(500).json({ error: 'Erro ao salvar o vídeo temporário' });
            }

            await compressVideo(tempFilePath, compressedFilePath);

            // Le o arquivo compactado como buffer para enviar ao Dropbox
            const compressedBuffer = fs.readFileSync(compressedFilePath);
            const dropboxVideoPath = `/posts/videos/${videoFile.originalname}`;
            videoPath = await uploadToDropbox(compressedBuffer, dropboxVideoPath);

            // Remove os arquivos temporários após o upload
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(compressedFilePath);
        }

        if (imageFile) {
            const dropboxImagePath = `/posts/images/${imageFile.originalname}`;
            imagePath = await uploadToDropbox(imageFile.buffer, dropboxImagePath);
        }

        const post = new Post({
            title,
            description,
            videoUrl: videoPath || "",
            imageUrl: imagePath || "",
            userId,
        });
        await post.save();

        res.status(200).send();
    } catch (error) {
        console.error("Erro ao criar a postagem:", error);
        res.status(500).json({ error: 'Erro ao criar a postagem', details: error.message });
    }
};


// Função para gerar link público do Dropbox
const getDropboxPublicLink = async (filePath) => {
    try {
        const dbx = await getDropboxClient();

        // Verifica se já existe um link de compartilhamento
        let sharedLinkResponse = await dbx.sharingListSharedLinks({
            path: filePath,
            direct_only: true,
        });

        if (sharedLinkResponse.result.links.length > 0) {
            sharedLinkResponse = sharedLinkResponse.result.links[0];
        } else {
            sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                path: filePath,
            });
        }

        return sharedLinkResponse.url.replace('dl=0', 'raw=1'); // Transforma em link direto
    } catch (error) {
        console.error('Erro ao obter link público do Dropbox:', error);
        return null;
    }
};


exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Post.find({ userId }).sort({ createdAt: -1 });

        // Converte os links das imagens e vídeos no Dropbox para links públicos
        const updatedPosts = await Promise.all(
            posts.map(async (post) => {
                let updatedImageUrl = post.imageUrl;
                let updatedVideoUrl = post.videoUrl;

                if (post.imageUrl && post.imageUrl.startsWith('/')) {
                    updatedImageUrl = await getDropboxPublicLink(post.imageUrl) || post.imageUrl;
                }

                if (post.videoUrl && post.videoUrl.startsWith('/')) {
                    updatedVideoUrl = await getDropboxPublicLink(post.videoUrl) || post.videoUrl;
                }

                return {
                    ...post.toObject(),
                    imageUrl: updatedImageUrl,
                    videoUrl: updatedVideoUrl,
                };
            })
        );

        res.json(updatedPosts);
    } catch (error) {
        console.error("Erro ao buscar postagens do usuário:", error);
        res.status(500).json({ error: "Erro ao buscar postagens", details: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        // 1. Busca todos os posts ordenados pelos mais recentes
        const posts = await Post.find().sort({ createdAt: -1 }).lean();


        // 2. Extrai todos os IDs de usuários únicos
        const userIds = [...new Set(posts.map(post => post.userId).filter(id => id))];


        // 3. Busca informações básicas dos usuários no MySQL
        const usuarios = await Usuario.findAll({
            where: {
                ID_USUARIO: userIds
            },
            attributes: ['ID_USUARIO', 'NOME', 'IMAGE'], // Campos que você quer
            raw: true // Retorna objetos simples
        });


        // 4. Cria um mapa de usuários para acesso rápido
        const userMap = {};
        usuarios.forEach(user => {
            userMap[user.ID_USUARIO] = {
                nome: user.NOME,
                img: user.IMAGE
            };
        });



        // 5. Processa os posts com as URLs do Dropbox e informações do usuário
        const updatedPosts = await Promise.all(
            posts.map(async (post) => {
                let updatedImageUrl = post.imageUrl;
                let updatedVideoUrl = post.videoUrl;

                if (post.imageUrl && post.imageUrl.startsWith('/')) {
                    updatedImageUrl = await getDropboxPublicLink(post.imageUrl) || post.imageUrl;
                }

                if (post.videoUrl && post.videoUrl.startsWith('/')) {
                    updatedVideoUrl = await getDropboxPublicLink(post.videoUrl) || post.videoUrl;
                }

                return {
                    ...post,
                    imageUrl: updatedImageUrl,
                    videoUrl: updatedVideoUrl,
                    user: userMap[post.userId] || { // Informações do usuário
                        nome: 'Usuário Desconhecido',
                        img: null
                    }
                };
            })
        );

        res.json(updatedPosts);
    } catch (error) {
        console.error("Erro ao buscar postagens:", error);
        res.status(500).json({
            error: "Erro interno ao buscar postagens",
            details: error.message
        });
    }
};
exports.deletePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user.id;
        if (!userId) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Validação do ID
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'ID da postagem inválido' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }

        // Verificação de permissão
        if (Number(post.userId) !== Number(userId)) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar esta postagem' });
        }

        // Resto do código de deleção...
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Postagem deletada com sucesso' });

    } catch (error) {
        console.error("Erro ao deletar postagem:", error);
        res.status(500).json({
            error: 'Erro ao deletar postagem',
            details: error.message
        });
    }
};
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;


        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: 'Ação de curtida atualizada', post });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao curtir a postagem', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }

        post.comments.push({
            userId: req.user.id,
            comment,
        });

        await post.save();
        res.json({ message: 'Comentário adicionado', post });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar comentário', details: error.message });
    }
};

exports.getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId; // pega o userId da URL (ex: /posts/user/:userId)

        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        // Busca os posts deste usuário
        const posts = await Post.find({ userId }).sort({ createdAt: -1 });

        // Converte os links Dropbox para links públicos
        const updatedPosts = await Promise.all(
            posts.map(async (post) => {
                let updatedImageUrl = post.imageUrl;
                let updatedVideoUrl = post.videoUrl;

                if (post.imageUrl && post.imageUrl.startsWith('/')) {
                    updatedImageUrl = await getDropboxPublicLink(post.imageUrl) || post.imageUrl;
                }

                if (post.videoUrl && post.videoUrl.startsWith('/')) {
                    updatedVideoUrl = await getDropboxPublicLink(post.videoUrl) || post.videoUrl;
                }

                return {
                    ...post.toObject(),
                    imageUrl: updatedImageUrl,
                    videoUrl: updatedVideoUrl,
                };
            })
        );

        res.json(updatedPosts);
    } catch (error) {
        console.error("Erro ao buscar posts do usuário por ID:", error);
        res.status(500).json({ error: "Erro ao buscar posts", details: error.message });
    }
};

