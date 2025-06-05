import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FiHeart, FiMessageSquare, FiShare2, FiMoreHorizontal,
  FiHome, FiSearch, FiCompass, FiFilm, FiSend,
  FiPlusSquare, FiUser, FiMenu, FiX, FiBookmark
} from 'react-icons/fi';
import { FaHeart, FaRegCompass, FaRegUser } from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';

const Feed = () => {
  const location = useLocation();
  const { posts = [] } = location.state || {};

  // Estados para posts e interações
  const [localPosts, setLocalPosts] = useState(posts);
  const [likedPosts, setLikedPosts] = useState({});

  // Estados para o perfil do usuário logado
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);

  // Estados para UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica o tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Busca informações do perfil do usuário logado
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch('http://localhost:8081/profile/info', {
          credentials: 'include'
        });
        const data = await response.json();
        setUserProfile(data.user);

        if (data.user.IMAGE) {
          const imgResponse = await fetch(`http://localhost:8081/pictures/${data.user.IMAGE}`, {
            credentials: 'include'
          });
          const imgData = await imgResponse.json();
          setUserProfileImage(imgData.url.replace('dl=0', 'raw=1'));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil de usuario:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Busca posts da API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8081/posts');

        if (!response.ok) throw new Error('Erro ao carregar posts');

        const data = await response.json();
        console.log('Dados recebidos da API:', data); // Log para debug

        const processedPosts = await Promise.all(
          data.map(async post => {
            // Processa URLs do Dropbox
            const imageUrl = post.imageUrl?.includes('dropbox.com')
              ? post.imageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
              : post.imageUrl;

            const videoUrl = post.videoUrl?.includes('dropbox.com')
              ? post.videoUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
              : post.videoUrl;

            // Busca a imagem de perfil do autor do post
            let userImageUrl = null;
            if (post.user?.img) {
              try {
                const imgRes = await fetch(`http://localhost:8081/pictures/${post.user.img}`, {
                  credentials: "include",
                });

                if (imgRes.ok) {
                  const imgData = await imgRes.json();
                  userImageUrl = imgData.url.replace("dl=0", "raw=1");
                }
              } catch (error) {
                console.error('Erro ao buscar imagem de perfil:', error);
              }
            }

            // Padroniza a estrutura do usuário
            const userData = {
              _id: post.userId || post.user?._id, // Pega o ID de userId ou user._id
              nome: post.user?.nome || 'Usuário',
              img: userImageUrl || post.user?.img
            };

            return {
              ...post,
              imageUrl,
              videoUrl,
              user: userData
            };
          })
        );

        setLocalPosts(processedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!location.state?.posts || location.state.posts.length === 0) {
      fetchPosts();
    } else {
      // Garante que os posts recebidos via state também tenham a estrutura correta
      const processedPosts = location.state.posts.map(post => ({
        ...post,
        user: {
          _id: post.userId || post.user?._id,
          nome: post.user?.nome || 'Usuário',
          img: post.user?.img
        }
      }));
      setLocalPosts(processedPosts);
      setLoading(false);
    }
  }, [location.state]);

  const handleLike = async (postId) => {
    try {
      // Atualização otimista
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));

      const response = await fetch(`http://localhost:8081/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao curtir post');
      }

      const updatedPost = await response.json();

      setLocalPosts(prev => prev.map(post =>
        post._id === postId ? { ...post, likes: updatedPost.likes } : post
      ));

    } catch (error) {
      console.error("Erro ao curtir:", error);
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Menu Lateral (Desktop) */}
      {!isMobile && (
        <div className="w-64 border-r border-gray-800 p-4 hidden md:block fixed h-full">
          <div className="flex flex-col h-full">
            <div className="mb-10 mt-4 px-4 pb-4 border-b border-gray-700">
              <Link
                to="/"
                className="flex items-center space-x-3 text-[#ECD182] group"
              >
                <div className="w-10 h-10 rounded-full bg-[#ECD182] flex items-center justify-center group-hover:bg-[#f8e4a8] transition-colors">
                  <img
                    src="/imagens/logo-icaros.png"
                    alt="Logo Icaros"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-2xl font-bold group-hover:text-[#f8e4a8] transition-colors">Icaros</span>
              </Link>
            </div>

            <nav className="flex-1">
              <ul className="space-y-4">
                <div className="mb-6 p-3">
                  <Link
                    to="/perfilMusico"
                    className="flex items-center space-x-3 hover:bg-gray-900 rounded-lg p-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={userProfileImage || '/imagens/usuario.png'}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{userProfile?.NOME || 'Usuário'}</p>
                      <p className="text-gray-400 text-xs">@{userProfile?.USERNAME?.toLowerCase() || 'usuario'}</p>
                    </div>
                  </Link>
                </div>

                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-900">
                    <FiSearch size={24} className="text-white" />
                    <span className="font-medium">Pesquisar</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-900">
                    <FaRegCompass size={24} className="text-white" />
                    <span className="font-medium">Explorar</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-900">
                    <FiFilm size={24} className="text-white" />
                    <span className="font-medium">Reels</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-900">
                    <FiSend size={24} className="text-white" />
                    <span className="font-medium">Mensagens</span>
                  </a>
                </li>
                <li>
                  <Link to="/CreatePost" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-900">
                    <FiPlusSquare size={24} className="text-white" />
                    <span className="font-medium">Criar</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Botão do Menu Mobile */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 bg-black bg-opacity-70 p-2 rounded-full md:hidden"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Menu Mobile */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <Link
                to="/"
                className="flex items-center space-x-3 text-[#ECD182] group"
              >
                <div className="w-10 h-10 rounded-full bg-[#ECD182] flex items-center justify-center group-hover:bg-[#f8e4a8] transition-colors">
                  <img
                    src="/imagens/logo-icaros.png"
                    alt="Logo Icaros"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-2xl font-bold group-hover:text-[#f8e4a8] transition-colors">Icaros</span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX size={28} />
              </button>
            </div>
            <nav className="flex-1">
              <ul className="space-y-6">
                <div className="mt-auto pt-6 border-t border-gray-800">
                  <Link
                    to="/perfilMusico"
                    className="flex items-center space-x-4 p-3 hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={userProfileImage || '/imagens/usuario.png'}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{userProfile?.NOME || 'Usuário'}</p>
                      <p className="text-gray-400 text-sm">@{userProfile?.USERNAME?.toLowerCase() || 'usuario'}</p>
                    </div>
                  </Link>
                </div>

                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 text-xl">
                    <FiSearch size={28} className="text-white" />
                    <span className="font-medium">Pesquisar</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 text-xl">
                    <FaRegCompass size={28} className="text-white" />
                    <span className="font-medium">Explorar</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 text-xl">
                    <FiFilm size={28} className="text-white" />
                    <span className="font-medium">Reels</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-4 p-3 text-xl">
                    <FiSend size={28} className="text-white" />
                    <span className="font-medium">Mensagens</span>
                  </a>
                </li>
                <li>
                  <Link to="/CreatePost" className="flex items-center space-x-4 p-3 text-xl">
                    <FiPlusSquare size={28} className="text-white" />
                    <span className="font-medium">Criar</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className={`flex-1 overflow-y-auto ${!isMobile ? 'ml-64 ml-2 mr-4' : ''}`}>
        <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800 p-4 md:hidden">
          <h1 className="text-xl font-bold text-[#ECD182]">Música Connect</h1>
        </header>

        {/* Feed de postagens */}
        <div className="max-w-xl mx-auto pb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ECD182]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#ECD182] text-black rounded-md"
              >
                Tentar novamente
              </button>
            </div>
          ) : localPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 mb-2">Nenhuma postagem encontrada</p>
              <p className="text-[#ECD182]">Seja o primeiro a compartilhar algo!</p>
            </div>
          ) : (
            localPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                userProfile={post.user || {}}
                imageProfile={post.user?.img}
                isLiked={likedPosts[post._id]}
                onLike={() => handleLike(post._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, userProfile, imageProfile, isLiked, onLike }) => {
  const postDate = new Date(post.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Verifica se temos um ID válido para o usuário
  const userId = post.user?._id;
  if (!userId) {
    console.error('ID do usuário não encontrado no post:', post);
    return null;
  }

  // Tratamento para URLs do Dropbox
  let postImageUrl = post.imageUrl;
  let postVideoUrl = post.videoUrl;

  if (postImageUrl && postImageUrl.includes('dropbox.com')) {
    postImageUrl = postImageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  if (postVideoUrl && postVideoUrl.includes('dropbox.com')) {
    postVideoUrl = postVideoUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  return (
    <div className="bg-black border-b border-gray-800 mb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Link
            to={`/perfil/${userId}`}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full border border-[#ECD182] p-0.5">
              <img
                src={imageProfile || '/imagens/usuario.png'}
                alt="Perfil"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm hover:underline">
                {userProfile?.nome || userProfile?.NOME || 'Usuário'}
              </p>
              <p className="text-gray-400 text-xs">{postDate}</p>
            </div>
          </Link>
        </div>
        <button className="text-gray-400 hover:text-white">
          <IoMdMore size={20} />
        </button>
      </div>

      <div className="aspect-square bg-gray-900">
        {postImageUrl ? (
          <img
            src={postImageUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : postVideoUrl ? (
          <video
            controls
            className="w-full h-full object-cover"
          >
            <source src={postVideoUrl} type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem mídia
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button
              onClick={onLike}
              className="focus:outline-none"
            >
              {isLiked ? (
                <FaHeart className="text-red-500" size={24} />
              ) : (
                <FiHeart className="text-white" size={24} />
              )}
            </button>
            <button className="text-white">
              <FiMessageSquare size={24} />
            </button>
            <button className="text-white">
              <FiShare2 size={24} />
            </button>
          </div>
          <button className="text-white">
            <FiBookmark size={24} />
          </button>
        </div>

        <p className="font-semibold text-sm mb-1">
          {post.likes?.length || 0} curtidas
        </p>

        <div className="mb-1">
          <span className="font-semibold text-sm mr-2">
            {userProfile?.nome || userProfile?.NOME || 'Usuário'}
          </span>
          <span className="text-sm">{post.description}</span>
        </div>

        <button className="text-gray-400 text-sm mb-1">
          Ver todos os {post.comments?.length || 0} comentários
        </button>

        <p className="text-gray-400 text-xs uppercase">{postDate}</p>
      </div>
    </div>
  );
};

export default Feed;