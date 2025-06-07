import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMessageCircle,
  FiHeart,
  FiShare2,
} from 'react-icons/fi';
import { FaHeart, FaRegUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PerfilVisitante = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Estados para dados do perfil
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [posts, setPosts] = useState([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [likedPosts, setLikedPosts] = useState({});

  // Busca dados do perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Buscando usuário com ID:', userId);

        const userResponse = await fetch(
          `http://localhost:8081/profile/visitante/${userId}`,
          {
            credentials: 'include',
          }
        );

        const contentType = userResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const html = await userResponse.text();
          console.error('Resposta não é JSON, conteúdo recebido:', html);
          throw new Error('A resposta da API não está em formato JSON.');
        }

        const userData = await userResponse.json();

        if (!userData.user || !userData.user.ID_USUARIO) {
          throw new Error('Estrutura de dados do usuário inválida');
        }

        // Carrega imagem de perfil se existir
        if (userData.user.IMAGE) {
          try {
            const imgResponse = await fetch(
              `http://localhost:8081/pictures/${userData.user.IMAGE}`,
              {
                credentials: 'include',
              }
            );

            if (imgResponse.ok) {
              const imgData = await imgResponse.json();
              if (imgData.url) {
                const dropboxUrl = imgData.url.replace('dl=0', 'raw=1');
                setUserImage(dropboxUrl);
              }
            } else {
              console.warn(`Imagem não encontrada: ${imgResponse.status}`);
            }
          } catch (imgError) {
            console.warn('Erro ao carregar imagem:', imgError);
          }
        }

        // Carrega posts do usuário
        const postsResponse = await fetch(
          `http://localhost:8081/posts/user/${userId}`
        );
        const postsData = await postsResponse.json();

        const processedPosts = postsData.map((post) => ({
          ...post,
          imageUrl: post.imageUrl?.includes('dropbox.com')
            ? post.imageUrl.replace(
                'www.dropbox.com',
                'dl.dropboxusercontent.com'
              )
            : post.imageUrl,
          videoUrl: post.videoUrl?.includes('dropbox.com')
            ? post.videoUrl.replace(
                'www.dropbox.com',
                'dl.dropboxusercontent.com'
              )
            : post.videoUrl,
        }));

        setUserData(userData);
        setPosts(processedPosts);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const toggleProfileImageModal = () => {
    setIsProfileImageOpen(!isProfileImageOpen);
  };

  const togglePostModal = (post) => {
    setSelectedPost(post);
  };

  const handleLike = async (postId) => {
    try {
      // Atualização otimista
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      const response = await fetch(
        `http://localhost:8081/posts/${postId}/like`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Erro ao curtir post');

      const updatedPost = await response.json();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error('Erro ao curtir:', error);
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    }
  };

  // Renderização condicional
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ECD182]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
        <h2 className="text-xl mb-4">{error}</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#ECD182] text-black rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
        <h2 className="text-xl mb-4">Perfil não encontrado</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#ECD182] text-black rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Modal da foto de perfil */}
      <AnimatePresence>
        {isProfileImageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer"
            onClick={toggleProfileImageModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={userImage || '/imagens/usuario.png'}
                alt="Imagem do Perfil"
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal do post expandido */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ECD182]">
                      <img
                        src={userImage || '/imagens/usuario.png'}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{userData.user.NOME}</h3>
                      <p className="text-gray-400 text-xs">
                        @{userData.user.NOME.toLowerCase().replace(/\s/g, '')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  {selectedPost.imageUrl ? (
                    <img
                      src={selectedPost.imageUrl}
                      alt="Post"
                      className="w-full max-h-[60vh] object-contain rounded"
                    />
                  ) : selectedPost.videoUrl ? (
                    <video
                      controls
                      className="w-full max-h-[60vh] object-contain rounded"
                    >
                      <source src={selectedPost.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-60 bg-gray-800 flex items-center justify-center rounded">
                      <p>Sem mídia</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 mb-4">
                  <button
                    className="flex items-center space-x-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(selectedPost._id);
                    }}
                  >
                    {likedPosts[selectedPost._id] ? (
                      <FaHeart className="text-red-500" size={20} />
                    ) : (
                      <FiHeart size={20} />
                    )}
                    <span>{selectedPost.likes?.length || 0}</span>
                  </button>

                  <button className="flex items-center space-x-1">
                    <FiMessageCircle size={20} />
                    <span>{selectedPost.comments?.length || 0}</span>
                  </button>

                  <button className="flex items-center space-x-1">
                    <FiShare2 size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm">
                    {selectedPost.description || 'Sem descrição'}
                  </p>
                </div>

                <p className="text-gray-400 text-xs">
                  {new Date(selectedPost.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-[#ECD182]">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#ECD182]">Icaros</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Conteúdo do perfil */}
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
                src={userImage || '/imagens/usuario.png'}
                alt="Imagem do Perfil"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">{userData.user.NOME}</h2>
              <p className="text-gray-400 text-sm">
                @{userData.user.NOME.toLowerCase().replace(/\s/g, '')}
              </p>
            </div>
          </div>

          <button className="px-4 py-2 bg-[#ECD182] hover:bg-[#f8e4a8] text-black rounded-lg text-sm font-medium transition">
            Seguir
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
          {userData.musician?.COMENTARIO ? (
            <p className="text-sm whitespace-pre-line">
              {userData.musician.COMENTARIO}
            </p>
          ) : (
            <p className="text-sm">Nenhuma descrição fornecida.</p>
          )}
          <p className="text-sm text-gray-400 mt-1">
            {userData.user.GENERO_MUSICAL || 'Gênero musical não especificado'}
          </p>
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
            disabled
          >
            Salvos
          </button>
        </div>

        {/* Grid de postagens */}
        <div className="grid grid-cols-3 gap-1">
          {posts.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 rounded-full border-2 border-[#ECD182] flex items-center justify-center mb-4">
                <FaRegUser size={24} className="text-[#ECD182]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sem publicações ainda</h3>
              <p className="text-gray-400 text-center max-w-md">
                Quando este usuário compartilhar fotos e vídeos, eles aparecerão
                aqui.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="relative group aspect-square bg-gray-900 overflow-hidden cursor-pointer"
                onClick={() => togglePostModal(post)}
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                  />
                ) : post.videoUrl ? (
                  <video
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                    muted
                  >
                    <source src={post.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">Sem mídia</p>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <FaHeart size={20} />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMessageCircle size={20} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilVisitante;
