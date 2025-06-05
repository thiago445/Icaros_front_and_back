import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiLockLine } from 'react-icons/ri';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [secureEntry, setSecureEntry] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleGoBack = () => {
        navigate(-1);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`http://localhost:8081/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login bem-sucedido:", data);

                const userType = data.userType || "musico";
                const isNewUser = data.newUser || false;

                if (userType === "musico") {
                    navigate(isNewUser ? "/perfilMusico" : "/feed");
                } else if (userType === "am") {
                    navigate(isNewUser ? "/attAm" : "/feed");
                } else if (userType === "produtor") {
                    navigate(isNewUser ? "/attProdutor" : "/feed");
                } else {
                    navigate("/perfilMusico");
                }
            } else {
                window.alert("Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            window.alert("Erro no servidor ao tentar login.");
        }
    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-start pt-10">
            <div className="w-full max-w-2xl px-5">
                {/* Botão Voltar */}
                <button 
                    onClick={handleGoBack}
                    className="h-10 w-10 bg-[#ECD182] rounded-full flex items-center justify-center mb-8 hover:bg-[#f5d78f] transition"
                >
                    <FiArrowLeft className="text-black text-2xl" />
                </button>

                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#FFFFFF] font-sans">Hey,</h1>
                    <h1 className="text-3xl font-bold text-[#FFFFFF] font-sans">welcome</h1>
                    <h1 className="text-3xl font-bold text-[#FFFFFF] font-sans">back</h1>
                </div>

                {/* Formulário */}
                <div className="space-y-4">
                    {/* Campo Email */}
                    <div className="border border-[#ECD182] rounded-full px-5 flex items-center">
                        <FiMail className="text-[#ECD182] text-xl mr-2" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 py-3 px-2 bg-transparent outline-none placeholder-[#FFFFFF]/70 italic text-[#FFFFFF]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Campo Senha */}
                    <div className="border border-[#ECD182] rounded-full px-5 flex items-center">
                        <RiLockLine className="text-[#ECD182] text-xl mr-2" />
                        <input
                            type={secureEntry ? "password" : "text"}
                            placeholder="Enter your password"
                            className="flex-1 py-3 px-2 bg-transparent outline-none placeholder-[#FFFFFF]/70 italic text-[#ECD182]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            onClick={() => setSecureEntry(!secureEntry)}
                            className="ml-2"
                        >
                            {secureEntry ? (
                                <FiEye className="text-[#FFFFFF] text-xl" />
                            ) : (
                                <FiEyeOff className="text-[#FFFFFF] text-xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Esqueceu a senha */}
                <button className="text-right w-full text-[#ECD182]/80 italic my-4 hover:underline hover:text-[#ECD182] transition">
                    Forgot Password?
                </button>

                {/* Botão Login */}
                <button 
                    className="w-full bg-[#ECD182] rounded-full mt-6 hover:bg-[#f5d78f] transition"
                    onClick={handleLogin}
                >
                    <span className="text-black text-xl font-sans py-3 block font-medium">Login</span>
                </button>

                {/* Divisor */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-[#ECD182]/40"></div>
                    <span className="px-4 text-[#ECD182]/80 italic text-sm">or continue with</span>
                    <div className="flex-1 border-t border-[#ECD182]/40"></div>
                </div>

                {/* Botão Google */}
                <button className="w-full border-2 border-[#ECD182] rounded-full flex items-center justify-center py-3 gap-2 hover:bg-[#ECD182]/10 transition">
                    <span className="text-xl font-sans text-[#FFFFFF]">Google</span>
                </button>

                {/* Rodapé */}
                <div className="flex justify-center items-center mt-8 gap-1">
                    <p className="text-[#ECD182]/80 font-sans">Don't have an account?</p>
                    <button 
                        onClick={() => navigate('/Cadastro')}
                        className="text-[#ECD182] italic hover:underline"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
