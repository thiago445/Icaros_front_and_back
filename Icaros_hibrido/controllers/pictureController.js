const Picture = require('../models/mongo/picture');
const Usuario = require('../models/tb_usuario');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const { checkAndRefreshToken } = require('../config/dropboxconfig'); // Importe a função de verificação
require('dotenv').config();
//sistema de cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // TTL de 5 minutos


// Função para obter o cliente do Dropbox com o token atualizado
const getDropboxClient = async () => {
    await checkAndRefreshToken(); // Verifica e atualiza o token, se necessário
    return new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
};

// Função para fazer upload para o Dropbox
const uploadToDropbox = async (localFilePath, dropboxPath) => {
    try {
        const dbx = await getDropboxClient();
        const fileContent = fs.readFileSync(localFilePath); // faz a leitura do conteúdo do arquivo

        // Faz o upload para o Dropbox
        const uploadResponse = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
        });

        console.log('Arquivo enviado para o Dropbox:', uploadResponse);

        // armazena temporariamente no servidor
        return uploadResponse.result.path_display;
    } catch (error) {
        console.error('Erro ao enviar para o Dropbox:', error);
        throw error;
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo foi enviado" });
        }

        // Upload para o Dropbox
        const dropboxPath = `/uploads/${file.filename}`;
        const dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

        const picture = new Picture({
            name,
            src: dropboxFilePath, // Salva a URL do Dropbox
        });
        await picture.save();

        user.IMAGE = picture._id.toString();
        await user.save();

        // Remove o arquivo local após o upload
        fs.unlinkSync(file.path);

        res.json({ picture, msg: "Imagem salva com sucesso" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao salvar a imagem", error });
    }
};

exports.getImage = async (req, res) => {
    const cacheKey = `imageLink:${req.params.id}`;
    const cachedUrl = cache.get(cacheKey);

    if (cachedUrl) {
        console.log('🔁 Cache HIT - usando link da memória');
        return res.json({ url: cachedUrl });
    }

    console.log('🧵 Cache MISS - buscando link no Dropbox');

    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            console.error('Imagem não encontrada para o ID:', req.params.id);
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }

        const dbx = await getDropboxClient();

        let sharedLinkResponse;

        try {
            sharedLinkResponse = await dbx.sharingListSharedLinks({
                path: picture.src,
                direct_only: true
            });

            if (sharedLinkResponse.result.links.length > 0) {
                sharedLinkResponse = { result: sharedLinkResponse.result.links[0] };
            } else {
                sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                    path: picture.src,
                });
            }
        } catch (error) {
            console.error('Erro ao listar/criar link de compartilhamento:', error);
            return res.status(500).json({ error: 'Erro ao criar link de compartilhamento' });
        }

        const directImageUrl = sharedLinkResponse.result.url.replace('dl=0', 'raw=1');

        // Salva no cache por 5 minutos
        cache.set(cacheKey, directImageUrl);

        return res.json({ url: directImageUrl });
    } catch (error) {
        console.error('Erro ao buscar a imagem:', error);
        res.status(500).json({ error: 'Erro ao buscar a imagem' });
    }
};



// Função para deletar um arquivo do Dropbox
const deleteFromDropbox = async (filePath) => {
    try {
        const dbx = await getDropboxClient();
        await dbx.filesDeleteV2({ path: filePath });
    } catch (error) {
        console.error("Erro ao deletar a imagem do Dropbox:", error);
        throw new Error("Não foi possível deletar a imagem antiga do Dropbox.");
    }
};

exports.updateImage = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const existingPicture = await Picture.findById(user.IMAGE);

        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo foi enviado" });
        }

        let dropboxFilePath;
        const dropboxPath = `/uploads/${file.filename}`;

        if (existingPicture) {
            // Apaga do Dropbox
            await deleteFromDropbox(existingPicture.src);

            // 🧹 Limpa o cache da imagem antiga
            const cacheKey = `imageLink:${existingPicture._id}`;
            cache.del(cacheKey);
            console.log('🧹 Cache da imagem antigo limpo:', cacheKey);

            // Atualiza no Dropbox
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            // Atualiza dados no banco
            existingPicture.name = name;
            existingPicture.src = dropboxFilePath;
            await existingPicture.save();
        } else {
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            const newPicture = new Picture({
                name,
                src: dropboxFilePath,
            });
            await newPicture.save();

            user.IMAGE = newPicture._id.toString();
        }

        await user.save();

        fs.unlinkSync(file.path);

        res.json({ picture: existingPicture || newPicture, msg: "Imagem atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao atualizar a imagem", error });
    }
};


exports.remove = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        // Remove o arquivo do sistema de arquivos
        await deleteFromDropbox(picture.src); // Deleta do Dropbox também
        await Picture.findByIdAndDelete(req.params.id);

        res.json({ message: "Imagem removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar imagem" });
    }
};
