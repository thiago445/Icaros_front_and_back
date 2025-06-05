import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';


/**
 * Página de atualização das informações do perfil
 * Segue o mesmo visual do componente PerfilMusico
 */
const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    musicalGenre: "",
    comment: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // === Carrega dados do usuário ===
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8081/profile/info`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao buscar perfil");

        const data = await res.json();
        setFormData({
          name: data.user.NOME || "",
          musicalGenre: data.user.GENERO_MUSICAL || "",
          comment: data.musician.COMENTARIO || "",
        });

        if (data.user.IMAGE) {
          setHasImage(true);
          const imgRes = await fetch(`http://localhost:8081/pictures/${data.user.IMAGE}`, {
            credentials: "include",
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            const finalUrl = imgData.url.replace("dl=0", "raw=1");
            setImagePreview(finalUrl);
          }
        }
      } catch (err) {
        console.error(err);
        setErrors(["Não foi possível carregar seus dados. Tente novamente mais tarde."]);
      }
    };

    fetchUserProfile();
  }, []);

  // [BASE_URL]
  // === Handlers ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = [];
    if (!formData.name) newErrors.push("Nome é obrigatório");
    if (!formData.musicalGenre) newErrors.push("Gênero musical é obrigatório");
    if (!formData.comment) newErrors.push("Descrição é obrigatória");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. Atualiza dados textuais
      const res = await fetch(`http://localhost:8081/profile/update_user`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMusician: { comment: formData.comment },
          user: {
            name: formData.name,
            musicalGenre: formData.musicalGenre,
          },
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      // 2. Se houver imagem, faz upload
      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);
        const method = hasImage ? "PUT" : "POST";

        const imgRes = await fetch(`http://localhost:8081/pictures`, {
          method,
          credentials: "include",
          body: form,
        });
        if (!imgRes.ok) throw new Error("Erro ao enviar imagem");
      }

      // 🧹 Limpa o cache da imagem de perfil após atualização
      if (hasImage) {
        const resProfile = await fetch("http://localhost:8081/profile/info", {
          credentials: "include",
        });
        if (resProfile.ok) {
          const data = await resProfile.json();
          const imageId = data.user?.IMAGE;
          if (imageId) {
            const cacheKey = `image:${imageId}`;
            localStorage.removeItem(cacheKey);
            console.log('🧹 Cache da imagem removido após atualização');
          }
        }
      }

      // ✅ Sucesso -> volta para perfil
      navigate(-1);
    } catch (err) {
      console.error(err);
      setErrors([err.message || "Erro inesperado"]);
    } finally {
      setLoading(false);
    }
  };

  // === Render ===
  const musicalGenreOptions = [
    "Rock",
    "Sertanejo",
    "Pop",
    "Hip_Hop",
    "Jazz",
    "Blues",
    "Classical",
    "Electronic_Dance_Music",
    "Country",
    "Reggae",
    "Funk",
    "Disco",
    "Gospel",
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center max-w-4xl w-full mx-auto">
        <button onClick={() => navigate(-1)} className="text-[#ECD182] mr-4">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#ECD182]">Editar Perfil</h1>
      </header>

      {/* Formulário */}
      <main className="flex-1 flex justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
          {errors.length > 0 && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}

          {/* Foto de perfil */}
          <div className="flex flex-col items-center gap-4">
            <label className="w-32 h-32 rounded-full border-2 border-[#ECD182] overflow-hidden flex items-center justify-center cursor-pointer group">
              {imagePreview ? (
                <img src={imagePreview} alt="Pré‑visualização" className="object-cover w-full h-full" />
              ) : (
                <span className="text-sm text-[#ECD182] group-hover:opacity-80">
                  Selecionar foto
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm text-[#ECD182] mb-1">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
              required
            />
          </div>

          {/* Gênero musical */}
          <div>
            <label htmlFor="musicalGenre" className="block text-sm text-[#ECD182] mb-1">Gênero musical</label>
            <select
              id="musicalGenre"
              name="musicalGenre"
              value={formData.musicalGenre}
              onChange={handleChange}
              className="w-full p-3 bg-[#2f2f2f] text-white rounded border border-[#ECD182]"
              required
            >
              <option value="">Selecione...</option>
              {musicalGenreOptions.map((opt) => (
                <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="comment" className="block text-sm text-[#ECD182] mb-1">Descrição</label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              className="w-full p-3 bg-transparent text-white border border-[#ECD182] rounded outline-none"
              required
            />
          </div>

          {/* Botão enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ECD182] text-black py-3 rounded-full font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f5d78f]'}`}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
