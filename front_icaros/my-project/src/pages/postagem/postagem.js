import { useState } from 'react';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    image: null,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'video' || e.target.name === 'image') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.video && !formData.image) {
      setError('Por favor, envie pelo menos um vídeo ou uma imagem.');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.video) data.append('video', formData.video);
    if (formData.image) data.append('image', formData.image);

    try {
      await axios.post('http://localhost:8081/posts/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // <-- Aqui é o correto!
      });

      setFormData({
        title: '',
        description: '',
        video: null,
        image: null,
      });
      setError('');
      alert('Postagem criada com sucesso!');
      navigate('/Feed');
    } catch (err) {
      setError(
        'Ocorreu um erro ao criar a postagem. Por favor, tente novamente.'
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-[#ECD182]">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#ECD182]">
          Criar Nova Postagem
        </h1>
      </header>

      {/* Formulário */}
      <div className="max-w-xl mx-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 text-red-300 rounded-md border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#ECD182] mb-2"
            >
              Título
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ECD182] text-white"
              required
              placeholder="Dê um título à sua postagem"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#ECD182] mb-2"
            >
              Descrição
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ECD182] text-white"
              placeholder="Escreva algo sobre sua postagem..."
            ></textarea>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="video"
                className="block text-sm font-medium text-[#ECD182] mb-2"
              >
                Vídeo (opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="video"
                  id="video"
                  accept="video/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">
                    {formData.video
                      ? formData.video.name
                      : 'Selecione um vídeo'}
                  </span>
                  <span className="text-[#ECD182]">Procurar</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-[#ECD182] mb-2"
              >
                Imagem (opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-between">
                  <span className="text-gray-300">
                    {formData.image
                      ? formData.image.name
                      : 'Selecione uma imagem'}
                  </span>
                  <span className="text-[#ECD182]">Procurar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 bg-[#ECD182] hover:bg-[#d9b96a] text-black font-medium rounded-lg transition duration-200 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
