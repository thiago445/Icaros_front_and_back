import { FaGuitar, FaMicrophone, FaHeadphones, FaMusic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen bg-[#29182b] flex items-center justify-center overflow-hidden">
      {/* Ícones decorativos */}
      <FaGuitar className="absolute top-6 right-10 text-white text-5xl opacity-20 rotate-12" />
      <FaHeadphones className="absolute bottom-6 left-10 text-white text-4xl opacity-20" />
      <FaMicrophone className="absolute bottom-6 right-10 text-white text-4xl opacity-20 -rotate-12" />
      <FaMusic className="absolute top-6 left-10 text-white text-2xl opacity-20" />

      {/* Conteúdo central */}
      <div className="text-center text-white px-6 max-w-md ">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Connect with <br /> musicians
        </h1>
        <p className="text-lg mb-6">A social network for sharing your music</p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-600 transition" onClick={() => navigate('/Cadastro')}>
          Sign Up
          
        </button>
        <p className="mt-4 text-sm">
          Already have an account? 
          <span 
            className="underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}