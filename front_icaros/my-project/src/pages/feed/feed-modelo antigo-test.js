import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiHeart, FiMessageSquare, FiShare2, FiMoreHorizontal } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Feed = ({ posts = [], userProfile, imageProfile }) => {
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        image: null,
        previewImage: null
    });
    const [localPosts, setLocalPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    // Inicializa os posts locais quando o componente monta ou quando posts mudam
    useEffect(() => {
        if (posts && Array.isArray(posts)) {
            setLocalPosts(posts);
        }
    }, [posts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPost(prev => ({
                    ...prev,
                    image: file,
                    previewImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitPost = (e) => {
        e.preventDefault();

        // Cria um novo post (simulação - você deve substituir pela sua API)
        const newPostObj = {
            id: Date.now(),
            title: newPost.title,
            description: newPost.description,
            imageUrl: newPost.previewImage,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: []
        };

        // Adiciona o novo post no início da lista
        setLocalPosts(prev => [newPostObj, ...prev]);
        setNewPost({ title: '', description: '', image: null, previewImage: null });
    };

    const handleLike = (postId) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleAddComment = (postId) => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            author: userProfile?.user?.NOME || 'Usuário',
            authorImage: imageProfile,
            text: newComment,
            timestamp: new Date().toISOString()
        };

        setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), comment]
        }));

        setNewComment('');
    };

    if (!userProfile) {
        return <div className="loading">Carregando perfil...</div>;
    }

    return (
        <div className="feed-container">
            {/* Seção de Criação de Postagem */}
            <div className="create-post-section">
                <h2 className="section-title">Criar Postagem</h2>

                <form className="create-post-form" onSubmit={handleSubmitPost}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            className="post-input"
                            placeholder="Título da postagem"
                            value={newPost.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="description"
                            className="post-textarea"
                            placeholder="O que você está pensando?"
                            rows="3"
                            value={newPost.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    {newPost.previewImage && (
                        <div className="image-preview">
                            <img src={newPost.previewImage} alt="Preview" />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => setNewPost(prev => ({ ...prev, previewImage: null, image: null }))}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="form-actions">
                        <label className="file-upload-btn">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                hidden
                            />
                            <span className="icon">📷</span> Foto
                        </label>

                        <div className="submit-buttons">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setNewPost({ title: '', description: '', image: null, previewImage: null })}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={!newPost.description.trim()}
                            >
                                Publicar
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Lista de Postagens */}
            <div className="posts-list">
                {posts.length === 0 ? (
                    <p>Nenhuma postagem encontrada.</p>
                ) : (
                    posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            userProfile={userProfile}
                            imageProfile={imageUrl}
                        />
                    ))
                )}
            </div>
            {/* ate aqui */}

        </div>

    );
};

const PostCard = ({
    post,
    userProfile,
    imageProfile,
    isLiked,
    onLike,
    showComments,
    onToggleComments,
    comments,
    newComment,
    onCommentChange,
    onAddComment
}) => {
    const postDate = new Date(post.createdAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Corrige a URL da imagem se for do Dropbox
    let postImageUrl = post.imageUrl;
    if (postImageUrl && postImageUrl.includes('dropbox.com')) {
        postImageUrl = postImageUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }

    return (
        <div className="post-card">
            {/* Cabeçalho do Post */}
            <div className="post-header">
                <div className="author-info">
                    <img
                        src={imageProfile || '/imagens/usuario.png'}
                        alt="Autor"
                        className="author-avatar"
                    />
                    <div>
                        <h3 className="author-name">{userProfile?.user?.NOME || 'Usuário'}</h3>
                        <p className="post-time">{postDate}</p>
                    </div>
                </div>
                <button className="more-options">
                    <FiMoreHorizontal />
                </button>
            </div>

            {/* Conteúdo do Post */}
            <div className="post-content">
                {post.title && <h4 className="post-title">{post.title}</h4>}
                <p className="post-text">{post.description}</p>
                {postImageUrl && (
                    <div className="post-media">
                        <img src={postImageUrl} alt="Mídia do post" />
                    </div>
                )}
            </div>

            {/* Status do Post */}
            <div className="post-stats">
                <span>{post.likes || 0} curtidas</span>
                <span>{comments.length} comentários</span>
            </div>

            {/* Ações do Post */}
            <div className="post-actions">
                <button
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={onLike}
                >
                    {isLiked ? <FaHeart className="icon liked" /> : <FiHeart className="icon" />}
                    Curtir
                </button>
                <button
                    className="action-btn"
                    onClick={onToggleComments}
                >
                    <FiMessageSquare className="icon" />
                    Comentar
                </button>
                <button className="action-btn">
                    <FiShare2 className="icon" />
                    Compartilhar
                </button>
            </div>

            {/* Seção de Comentários */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <img
                                        src={comment.authorImage || '/imagens/usuario.png'}
                                        alt="Autor"
                                        className="comment-avatar"
                                    />
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.author}</span>
                                            <span className="comment-time">
                                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">Nenhum comentário ainda</p>
                        )}
                    </div>

                    <div className="add-comment">
                        <img
                            src={imageProfile || '/imagens/usuario.png'}
                            alt="Você"
                            className="comment-avatar"
                        />
                        <input
                            type="text"
                            placeholder="Adicione um comentário..."
                            value={newComment}
                            onChange={onCommentChange}
                            className="comment-input"
                        />
                        <button
                            onClick={onAddComment}
                            disabled={!newComment.trim()}
                            className="comment-submit"
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;