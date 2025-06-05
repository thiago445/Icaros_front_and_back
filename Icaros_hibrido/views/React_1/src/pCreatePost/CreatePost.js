import React, { useState } from 'react';
import './CreatePost.css';

function CreatePost() {
  const [content, setContent] = useState('');
  const [textareaBorderColor, setTextareaBorderColor] = useState('#ccc'); // Cor padrão

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === '') {
      setTextareaBorderColor('red'); // Altera a borda para vermelho
      alert('Por favor, escreva algo antes de postar!');
    } else {
      // Aqui você pode adicionar a lógica para enviar a postagem
      console.log('Post enviado:', content);
      setContent('');
      setTextareaBorderColor('#ccc'); // Reseta a borda
    }
  };

  return (
    <div className="create-post">
      <textarea
        style={{ borderColor: textareaBorderColor }} // Aplica a cor da borda
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="4"
        placeholder="O que você está pensando?"
        className="textarea"
      />
      <div className="post-actions">
        <button onClick={handleSubmit}>Postar</button>
      </div>
    </div>
  );
}

export default CreatePost;
