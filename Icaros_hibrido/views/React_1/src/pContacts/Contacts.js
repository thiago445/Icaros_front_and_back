// src/Contacts.js
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs'; // Ícone de perfil
import { BsPeople } from 'react-icons/bs'; // Ícone para contatos
import "./Contacts.css"

const Contacts = () => {
  return (
    <div className="sidebar">
      <h2><BsPeople style={{ marginRight: '8px' }} />Contatos</h2>
      <ul>
        <li><BsPersonCircle style={{ marginRight: '8px' }} /><strong>Maria Silva</strong> - Desenvolvedora Frontend</li>
        <li><BsPersonCircle style={{ marginRight: '8px' }} /><strong>João Souza</strong> - Gerente de Projetos</li>
        <li><BsPersonCircle style={{ marginRight: '8px' }} /><strong>Ana Costa</strong> - Designer Gráfico</li>
        <li><BsPersonCircle style={{ marginRight: '8px' }} /><strong>Pedro Lima</strong> - Analista de Sistemas</li>
        <li><BsPersonCircle style={{ marginRight: '8px' }} /><strong>Lucia Martins</strong> - Especialista em Marketing</li>
      </ul>
    </div>
  );
};

export default Contacts;
