import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMoreHorizontal, FiMessageCircle, FiBookmark, FiHeart, FiShare2, FiX } from 'react-icons/fi';
import { FaHeart, FaRegUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PerfilMusico = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState('posts');
    const [likedPosts, setLikedPosts] = useState({});
    const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:8081/profile/info', {
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("Dados do perfil:", data);
                setUserProfile(data);

                if (data.user.IMAGE) {
                    const cacheKey = `image:${data.user.IMAGE}`;
                    const cached = localStorage.getItem(cacheKey);

                    if (cached) {
                        const parsed = JSON.parse(cached);
                        const now = Date.now();

                        // 5 minutos = 5 * 60 * 1000 = 300000
                        if (now - parsed.timestamp < 300000) {
                            console.log("🔁 Usando imagem do cache local");
                            setImageUrl(parsed.url);
                            return;
                        } else {
                            localStorage.removeItem(cacheKey); // Expirado, remove
                        }
                    }

                    console.log("📦 Buscando imagem do servidor");
                    const imageResponse = await fetch(`http://localhost:8081/pictures/${data.user.IMAGE}`, {
                        credentials: 'include'
                    });
                    const imageData = await imageResponse.json();
                    const finalUrl = imageData.url.replace('dl=0', 'raw=1');

                    localStorage.setItem(cacheKey, JSON.stringify({
                        url: finalUrl,
                        timestamp: Date.now()
                    }));

                    setImageUrl(finalUrl);
                }

            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await fetch('http://localhost:8081/posts/user-posts', {
                    credentials: 'include'
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Erro ao carregar posts:', error);
            }
        };

        fetchUserProfile();
        fetchUserPosts();
    }, []);

    // Adicione este useEffect no componente PerfilMusico
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectedPost && !e.target.closest('.post-menu-container')) {
                setShowDeleteMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedPost]);

    const handleLike = (postId) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const deletePost = async (postId) => {

        try {
            await axios.delete(`http://localhost:8081/posts/${postId}`, {
                withCredentials: true          // garante envio do cookie
            });
            setPosts(prev => prev.filter(p => p._id !== postId));
            setSelectedPost(null);
        } catch (err) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || 'Não foi possível deletar');
        }
    };

    const toggleProfileImageModal = () => {
        setIsProfileImageOpen(!isProfileImageOpen);
    };

    const togglePostModal = (post = null) => {
        setSelectedPost(post);
    };

    const onPostClick = (post) => {
        togglePostModal(post);
    };

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-[#ECD182]">
                Carregando perfil...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Modal animado para a foto de perfil ampliada */}
            <AnimatePresence>
                {isProfileImageOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer"
                        onClick={toggleProfileImageModal} // Fecha ao clicar em qualquer lugar do modal
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()} // Impede que o clique na imagem feche o modal
                        >
                            <img
                                src={imageUrl || '/imagens/usuario.png'}
                                alt="Imagem do Perfil"
                                className="max-w-[90vw] max-h-[90vh] object-cover"
                                style={{ maxWidth: 'none' }} // Remove qualquer limitação de tamanho
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Modal para post expandido */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer"
                        onClick={() => togglePostModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-4">
                                {/* Cabeçalho com botão de deletar */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex justify-between items-center mb-4 post-menu-container"
                                >
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="w-10 h-10 rounded-full overflow-hidden border border-[#ECD182]"
                                        >
                                            <img
                                                src={imageUrl || '/imagens/usuario.png'}
                                                alt="Perfil"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-bold">{userProfile.user.NOME}</h3>
                                            <p className="text-gray-400 text-xs">@{userProfile.user.NOME.toLowerCase().replace(/\s/g, '')}</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteMenu(!showDeleteMenu);
                                            }}
                                            aria-label="Opções"
                                        >
                                            <FiMoreHorizontal size={20} />
                                        </button>

                                        <AnimatePresence>
                                            {showDeleteMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
                                                >
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowDeleteMenu(false);
                                                            if (window.confirm('Tem certeza que deseja deletar esta postagem?')) {
                                                                console.log('ID sendo enviado:', selectedPost._id); // Verifique no console
                                                                deletePost(selectedPost._id);  // Alterado para _id
                                                            }
                                                        }}
                                                        className="block px-4 py-3 text-sm text-red-500 hover:bg-gray-700 w-full text-left transition-colors"
                                                    >
                                                        Deletar Postagem
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Conteúdo do post */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-4"
                                >
                                    <img
                                        src={selectedPost.imageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com')}
                                        alt="Post"
                                        className="w-full max-h-[60vh] object-contain rounded"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex space-x-4 mb-4"
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center space-x-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLike(selectedPost.id);
                                        }}
                                    >
                                        {likedPosts[selectedPost.id] ? (
                                            <FaHeart className="text-red-500" size={20} />
                                        ) : (
                                            <FiHeart size={20} />
                                        )}
                                        <span>{selectedPost.likes || 0}</span>
                                    </motion.button>

                                    <motion.button whileTap={{ scale: 0.9 }} className="flex items-center space-x-1">
                                        <FiMessageCircle size={20} />
                                        <span>{selectedPost.comments || 0}</span>
                                    </motion.button>

                                    <motion.button whileTap={{ scale: 0.9 }} className="flex items-center space-x-1">
                                        <FiShare2 size={20} />
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-4"
                                >
                                    <p className="text-sm">{selectedPost.description || 'Sem descrição'}</p>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-gray-400 text-xs"
                                >
                                    {new Date(selectedPost.createdAt).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cabeçalho */}
            <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800 p-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#ECD182]"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-[#ECD182]">Icaros</h1>

                    <button className="text-white">
                        <FiMoreHorizontal size={24} />
                    </button>
                </div>
            </header>

            {/* Seção de Informações do Perfil */}
            <button
                onClick={() => navigate('/Feed', {
                    state: {
                        posts,
                        userProfile,
                        imageUrl
                    }
                })}
            >
                ver postagens
            </button>
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <motion.div
                            className="w-20 h-20 rounded-full border-2 border-[#ECD182] overflow-hidden cursor-pointer"
                            onClick={toggleProfileImageModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={imageUrl || '/imagens/usuario.png'}
                                alt="Imagem do Perfil"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-bold">{userProfile.user.NOME}</h2>
                            <p className="text-gray-400 text-sm">@{userProfile.user.NOME.toLowerCase().replace(/\s/g, '')}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/att_musico')}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition"
                    >
                        Editar Perfil
                    </button>
                </div>

                {/* Estatísticas */}
                <div className="flex justify-around py-4 border-y border-gray-800 mb-6">
                    <div className="text-center">
                        <p className="font-bold">{posts.length}</p>
                        <p className="text-gray-400 text-sm">Publicações</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">0</p>
                        <p className="text-gray-400 text-sm">Seguidores</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">0</p>
                        <p className="text-gray-400 text-sm">Seguindo</p>
                    </div>
                </div>

                {/* Biografia */}
                <div className="mb-6">
                    <h3 className="font-bold text-[#ECD182] mb-1">Sobre</h3>
                    <p className="text-sm">{userProfile.musician.COMENTARIO || 'Nenhuma descrição fornecida.'}</p>
                    <p className="text-sm text-gray-400 mt-1">{userProfile.user.GENERO_MUSICAL}</p>
                </div>

                {/* Abas */}
                <div className="flex border-b border-gray-800 mb-4">
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'posts' ? 'text-[#ECD182] border-b-2 border-[#ECD182]' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Publicações
                    </button>
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'saved' ? 'text-[#ECD182] border-b-2 border-[#ECD182]' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Salvos
                    </button>
                </div>

                {/* Lista de Postagens */}
                <div className="grid grid-cols-3 gap-1">
                    {posts.length === 0 ? (
                        <div className="col-span-3 flex flex-col items-center justify-center py-10">
                            <div className="w-16 h-16 rounded-full border-2 border-[#ECD182] flex items-center justify-center mb-4">
                                <FaRegUser size={24} className="text-[#ECD182]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Sem publicações ainda</h3>
                            <p className="text-gray-400 text-center max-w-md">
                                Quando você compartilhar fotos e vídeos, eles aparecerão aqui.
                            </p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                userProfile={userProfile}
                                imageProfile={imageUrl}
                                isLiked={likedPosts[post.id]}
                                onLike={() => handleLike(post.id)}
                                onPostClick={onPostClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const PostCard = ({ post, userProfile, imageProfile, isLiked, onLike, onPostClick }) => {
    const postDate = new Date(post.createdAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let postImageUrl = post.imageUrl;
    if (postImageUrl && postImageUrl.includes('dropbox.com')) {
        postImageUrl = postImageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }

    return (
        <div className="relative group aspect-square bg-gray-900 overflow-hidden post-menu-container"
            onClick={() => onPostClick(post)}
        >

            {postImageUrl && (
                <img
                    src={postImageUrl}
                    alt="Imagem do Post"
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                />
            )}

            {/* Overlay com interações */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                <div className="flex items-center space-x-4 text-white">
                    <button className="flex items-center space-x-1" onClick={onLike}>
                        {isLiked ? (
                            <FaHeart className="text-red-500" size={20} />
                        ) : (
                            <FiHeart size={20} />
                        )}
                        <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                        <FiMessageCircle size={20} />
                        <span>{post.comments || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerfilMusico;