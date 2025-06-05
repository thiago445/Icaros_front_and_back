// src/pages/Profile.js
import React, { useState, useEffect, useCallback } from 'react';
import { BsFillPersonPlusFill, BsPersonCircle, BsPencil, BsShare, BsNewspaper, BsFillGeoFill, BsFillInfoCircleFill } from 'react-icons/bs';
import ProfileVideo from '../pProfileVideo/ProfileVideo';
import Trends from '../pTrends/Trends';
import Contacts from '../pContacts/Contacts';
import './Profile.css';

const Profile = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Nome do Usuário",
    title: "Perfil | Estilo Musical",
    location: "Localização",
    summary: "Este é o resumo do perfil...",
    musicStyle: "Estilo de Música",
    profileType: "Tipo de Perfil",
    experience: {
      role: "Cargo",
      companyPeriod: "Empresa - Período",
      description: "Descrição das atividades..."
    }
  });

  const handleConnect = () => {
    setIsConnected(true);
    alert("Solicitação de conexão enviada!");
  };

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newPosts = Array.from({ length: 5 }, (_, index) => `Postagem ${index + 1 + (page - 1) * 5}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setLoading(false);

    if (newPosts.length === 0) {
      setHasMore(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      experience: {
        ...prevData.experience,
        [name]: value
      }
    }));
  };

  return (
    <div className="body-container">
      <div className="trends"><Trends /></div>
      <div className="profile-page" onScroll={handleScroll}>
        <div className="profile-info">
          <div className="profile-details">
            <img
              className="profile-photo"
              src="https://via.placeholder.com/150"
              alt="User Profile"
            />
            <div className="profile-meta">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <h1 className="profile-name">{profileData.name}</h1>
              )}
              {editMode ? (
                <input
                  type="text"
                  name="title"
                  value={profileData.title}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p className="profile-title">{profileData.title}</p>
              )}
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p className="profile-location">
                  <BsFillGeoFill style={{ marginRight: '8px' }} />
                  {profileData.location}
                </p>
              )}
              <div className="profile-actions">
                <button className="profile-button" onClick={handleConnect}>
                  <BsFillPersonPlusFill size={16} style={{ marginRight: '8px', alignItems: 'center' }}/>{isConnected ? "Conectado" : "Conectar"}
                </button>
                <button className="profile-button share-button">
                  <BsShare size={16} style={{ marginRight: '8px', alignItems: 'center' }}/>
                  Compartilhar
                </button>
                <button className="profile-button edit-button" onClick={handleEditToggle}>
                  <BsPencil size={16} style={{ marginRight: '8px', alignItems: 'center' }}/>{editMode ? "Salvar" : "Editar Perfil"}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-summary">
            <h2>
              <BsFillInfoCircleFill style={{ marginRight: '8px' }} />
              Sobre
            </h2>
            {editMode ? (
              <textarea
                name="summary"
                value={profileData.summary}
                onChange={handleInputChange}
                className="profile-textarea"
              />
            ) : (
              <p>{profileData.summary}</p>
            )}
          </div>

          <div className="profile-experience">
            <h2>Experiência</h2>
            <div className="experience-item">
              {editMode ? (
                <input
                  type="text"
                  name="role"
                  value={profileData.experience.role}
                  onChange={handleExperienceChange}
                  className="profile-input"
                />
              ) : (
                <h3>{profileData.experience.role}</h3>
              )}
              {editMode ? (
                <input
                  type="text"
                  name="companyPeriod"
                  value={profileData.experience.companyPeriod}
                  onChange={handleExperienceChange}
                  className="profile-input"
                />
              ) : (
                <p>{profileData.experience.companyPeriod}</p>
              )}
              {editMode ? (
                <textarea
                  name="description"
                  value={profileData.experience.description}
                  onChange={handleExperienceChange}
                  className="profile-textarea"
                />
              ) : (
                <p>{profileData.experience.description}</p>
              )}
            </div>
          </div>
        </div>

        <ProfileVideo videoId="tFoNvW_UI7k?si=bluz3ycwaW5-uPzX" />

        <div className="feed">
          <h2><BsNewspaper style={{ marginRight: '8px' }} />Postagens</h2>
          {posts.map((post, index) => (
            <div className="post" key={index}>
              <BsPersonCircle style={{ marginRight: '8px' }} />
              <p>{post}</p>
            </div>
          ))}
          {loading && <p>Carregando mais postagens...</p>}
          {!hasMore && <p>Você chegou ao fim das postagens.</p>}
        </div>
      </div>
      <div className="contacts"><Contacts /></div>
    </div>
  );
};

export default Profile;
