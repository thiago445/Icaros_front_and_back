// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProfileDinamico.css';

function Profile_Dinamico() {
  const { userId } = useParams(); // Captura o ID do usuário na URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Função para buscar dados do usuário na API
    async function fetchUserData() {
      try {
        const response = await fetch(`https://api.seuservidor.com/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
    fetchUserData();
  }, [userId]);

  if (!userData) return <p>Carregando...</p>; // Carregamento enquanto espera os dados

  return (
    <div className="profile-page">
      {/* Informações do Perfil, sem Header adicional */}
      <div className="profile-info">
        <div className="profile-background"></div>
        <div className="profile-details">
          <img
            className="profile-photo"
            src={userData.photo || "https://via.placeholder.com/150"} // Imagem do usuário
            alt="User Profile"
          />
          <div className="profile-meta">
            <h1>{userData.name}</h1>
            <p className="profile-title">{userData.title} | {userData.company}</p>
            <p className="profile-location">{userData.location}</p>
          </div>
          <button className="profile-button">Conectar</button>
        </div>
      </div>

      {/* Seção de Resumo */}
      <div className="profile-summary">
        <h2>Sobre</h2>
        <p>{userData.summary}</p>
      </div>

      {/* Seção de Experiência */}
      <div className="profile-experience">
        <h2>Experiência</h2>
        {userData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <h3>{exp.title}</h3>
            <p>{exp.company} - {exp.period}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile_Dinamico;
