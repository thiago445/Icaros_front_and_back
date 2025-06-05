// src/Trends.js
import React from 'react';
import { BsGraphUp } from 'react-icons/bs'; // Ícone para tendências
import { BsBarChart } from 'react-icons/bs'; // Ícone para gráfico
import "./Trends.css"

const Trends = () => {
  return (
    <div className="trending">
      <h2><BsBarChart style={{ marginRight: '8px' }} />Tendências</h2>
      <ul>
        <li><BsGraphUp style={{ marginRight: '8px' }} />#Tecnologia (1200)</li>
        <li><BsGraphUp style={{ marginRight: '8px' }} />#Desenvolvimento Pessoal (900)</li>
        <li><BsGraphUp style={{ marginRight: '8px' }} />#Design Gráfico (850)</li>
        <li><BsGraphUp style={{ marginRight: '8px' }} />#Marketing Digital (750)</li>
      </ul>
    </div>
  );
};

export default Trends;
