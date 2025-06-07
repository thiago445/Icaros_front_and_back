import { Routes, Route } from 'react-router-dom';
import Home from './pages/Hero/home.js';
import Login from './pages/login/login.js';
import Cadastro from './pages/cadastro/Cadastro.js';
import PerfilMusico from './pages/perfils/usuario_musico.js';
import Feed from './pages/feed/feed.js';
import CreatePost from './pages/postagem/postagem.js';
import Autenticacao from './pages/cadastro/autenticacao_email/autenticacao_email.js';
import Att_musico from './pages/perfils/atualizar_perfil/att_musico.js';
import EmailConfirmado from './pages/cadastro/Confirmacao_email/confirm_email.js';
import PerfilVisitante from './pages/perfils/perfil_estrangeiro_musico/PerfilVisitante.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/redirecionamento" element={<EmailConfirmado />} />
      <Route path="/perfilMusico" element={<PerfilMusico />} />
      <Route path="/att_musico" element={<Att_musico />} />
      <Route path="/Feed" element={<Feed />} />
      <Route path="/Postagem" element={<Feed />} />
      <Route path="/autenticacao" element={<Autenticacao />} />
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/perfil/:userId" element={<PerfilVisitante />} />
    </Routes>
  );
}

export default App;
