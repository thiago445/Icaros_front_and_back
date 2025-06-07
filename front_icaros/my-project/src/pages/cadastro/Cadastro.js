import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    csenha: '',
    birthDate: '',
    gender: '',
    flagUserType: 1,
    telephone: '',
    musicalGenre: '',
    cpf: '',
    cnpj: '',
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Máscaras de formatação
  const applyMask = (value, pattern) => {
    let i = 0;
    const v = value.toString().replace(/\D/g, '');
    return pattern.replace(/#/g, () => v[i++] || '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Aplica máscaras conforme o campo
    let formattedValue = value;
    if (name === 'telephone') {
      formattedValue = applyMask(value, '(##) #####-####');
    } else if (name === 'cpf') {
      formattedValue = applyMask(value, '###.###.###-##');
    } else if (name === 'cnpj') {
      formattedValue = applyMask(value, '##.###.###/####-##');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleUserTypeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({
      ...prev,
      flagUserType: value,
      cpf: value !== 3 ? prev.cpf : '',
      cnpj: value === 3 ? prev.cnpj : '',
      musicalGenre: value === 2 ? prev.musicalGenre : '',
    }));
  };

  const obterNomeEmpresa = async (cnpj) => {
    const cnpjFormatado = cnpj.replace(/[^\d]+/g, '');
    if (cnpjFormatado.length !== 14) return null;

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpjFormatado}`
      );
      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();
      return data.razao_social;
    } catch (error) {
      console.error('Erro ao obter nome da empresa:', error);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = [];

    // Validações básicas
    if (!formData.name) newErrors.push('Nome é obrigatório');
    if (!formData.email) newErrors.push('Email é obrigatório');
    if (!formData.password) newErrors.push('Senha é obrigatória');
    if (formData.password !== formData.csenha) {
      newErrors.push('As senhas não coincidem');
    }

    // Validações específicas por tipo de usuário
    if ([1, 2].includes(formData.flagUserType)) {
      if (!formData.cpf || formData.cpf.length < 14) {
        newErrors.push('CPF inválido');
      }
      if (formData.flagUserType === 2 && !formData.musicalGenre) {
        newErrors.push('Gênero musical é obrigatório para amantes de música');
      }
    } else if (formData.flagUserType === 3) {
      if (!formData.cnpj || formData.cnpj.length < 18) {
        newErrors.push('CNPJ inválido');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const user = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
        gender: formData.gender,
        flagUserType: formData.flagUserType,
        telephone: formData.telephone.replace(/\D/g, ''),
        musicalGenre: formData.musicalGenre,
      };

      let payload = { user };

      // Dados específicos por tipo de usuário
      if ([1, 2].includes(formData.flagUserType)) {
        const userKey =
          formData.flagUserType === 2 ? 'userLover' : 'userMusician';
        payload[userKey] = { cpf: formData.cpf.replace(/\D/g, '') };
      } else if (formData.flagUserType === 3) {
        const fantasyName = await obterNomeEmpresa(formData.cnpj);
        payload.producerUser = {
          cnpj: formData.cnpj.replace(/\D/g, ''),
          fantasyName: fantasyName || '',
        };
      }

      // Envio dos dados
      const response = await fetch(`http://localhost:8081/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro no cadastro');

      // Redirecionar após cadastro
      navigate('/autenticacao');
    } catch (error) {
      console.error('Erro:', error);
      setErrors(['Erro ao realizar cadastro. Tente novamente.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-start pt-10 p-5">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 bg-[#ECD182] rounded-full flex items-center justify-center mb-8 hover:bg-[#f5d78f] transition"
        >
          <FiArrowLeft className="text-black text-2xl" />
        </button>

        <h1 className="text-3xl font-bold text-white font-sans mb-8">
          Cadastro
        </h1>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.map((error, index) => (
              <p key={index} className="mb-1 last:mb-0">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="border  border-[#ECD182] rounded-lg p-4 space-y-6 ">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="csenha"
                placeholder="Confirmar Senha"
                value={formData.csenha}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                required
              />
            </div>

            <div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none"
              />
            </div>

            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3  bg-[#2f2f2f] text-white rounded border border-[#ECD182]"
              >
                <option value="">Selecione o gênero</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                name="telephone"
                placeholder="Telefone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                required
              />
            </div>
          </div>
          {/* Tipo de Usuário */}
          <div className="mb-4">
            <label className="block text-white mb-2">Tipo de Usuário</label>
            <select
              name="flagUserType"
              value={formData.flagUserType}
              onChange={handleUserTypeChange}
              className="w-full p-3 bg-[#2f2f2f] text-white rounded border border-[#ECD182]"
            >
              <option value={1}>Músico</option>
              <option value={2}>Amante de Música</option>
              <option value={3}>Produtor</option>
            </select>
          </div>

          {/* Campos específicos por tipo de usuário */}
          {[1, 2].includes(formData.flagUserType) && (
            <div className="border border-[#ECD182] rounded-lg p-4 space-y-4">
              <div>
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                  required
                />
              </div>

              <div>
                <label htmlFor="musicalGenre" className="text-white block mb-1">
                  Estilo musical favorito
                </label>
                <select
                  name="musicalGenre"
                  value={formData.musicalGenre}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#2f2f2f] text-white rounded border border-[#ECD182]"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Rock">Rock</option>
                  <option value="Sertanejo">Sertanejo</option>
                  <option value="Pop">Pop</option>
                  <option value="Hip_Hop">Hip Hop</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Blues">Blues</option>
                  <option value="Classical">Classical</option>
                  <option value="Electronic_Dance_Music">
                    Electronic Dance Music
                  </option>
                  <option value="Country">Country</option>
                  <option value="Reggae">Reggae</option>
                  <option value="Funk">Funk</option>
                  <option value="Disco">Disco</option>
                  <option value="Gospel">Gospel</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>
            </div>
          )}

          {formData.flagUserType === 3 && (
            <div className="border border-[#ECD182] rounded-lg p-4">
              <div>
                <input
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={handleChange}
                  className="w-full p-3 bg-transparent text-white border-b border-[#ECD182] outline-none placeholder-white/70"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ECD182] text-black py-3 rounded-full font-medium text-lg mt-6 hover:bg-[#f5d78f] transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center text-white mt-6">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#ECD182] hover:underline"
          >
            Faça login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroForm;
