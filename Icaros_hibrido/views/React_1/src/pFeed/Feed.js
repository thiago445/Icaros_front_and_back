// src/Body.js
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs'; // Ícone de perfil
import { BsNewspaper } from 'react-icons/bs'; // Ícone para feed de notícias
import CreatePost from '../pCreatePost/CreatePost';
import Contacts from '../pContacts/Contacts';
import Trends from '../pTrends/Trends';
import './Feed.css';

const Feed = () => {
  return (
    <div className="body-container">
      <Trends />
      <div className="feed">
        <h2><BsNewspaper style={{ marginRight: '8px' }} />Feed de Posts</h2>
        <CreatePost />
        {/* Posts existentes */}
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Maria Silva</strong> compartilhou uma atualização.</p>
          <p>Feliz em anunciar que estou trabalhando em um novo projeto incrível!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>João Souza</strong> fez uma postagem.</p>
          <p>Participando de uma conferência sobre gestão de projetos. Muito aprendizado!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Ana Costa</strong> comentou sobre uma nova tendência em design.</p>
          <p>Acredito que o design inclusivo será fundamental para o futuro.</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Pedro Lima</strong> está em busca de novas oportunidades.</p>
          <p>Se alguém souber de vagas, estou aberto a propostas!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Lucia Martins</strong> compartilhou dicas de marketing.</p>
          <p>Não subestime o poder do marketing digital em 2024!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Fernanda Oliveira</strong> publicou uma nova ilustração.</p>
          <p>Confira minha nova arte inspirada na natureza!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Ricardo Almeida</strong> está fazendo um curso novo.</p>
          <p>Empolgado para aprender mais sobre Inteligência Artificial!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Mariana Costa</strong> compartilhou sua experiência.</p>
          <p>Recentemente participei de um workshop incrível sobre liderança!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Lucas Ferreira</strong> anunciou um novo projeto.</p>
          <p>Estou desenvolvendo uma aplicação que conecta freelancers e empresas!</p>
        </div>
        <div className="post">
          <BsPersonCircle style={{ marginRight: '8px' }} />
          <p><strong>Julia Santos</strong> está lendo um livro interessante.</p>
          <p>Acabei de terminar "O Poder do Hábito". Recomendo!</p>
        </div>
      </div>
      <Contacts />
    </div>

  );
};

export default Feed;
