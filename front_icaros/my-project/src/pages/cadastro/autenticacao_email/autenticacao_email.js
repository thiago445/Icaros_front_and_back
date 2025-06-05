import React from 'react';
import { useNavigate } from 'react-router-dom';

const Autenticacao = () => {
    const navigate = useNavigate();

    const handleResendEmail = async () => {
        try {
            // Lógica para reenviar e-mail
            const response = await fetch('http://localhost:8081/auth/resend-verification', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('E-mail de verificação reenviado com sucesso!');
            } else {
                throw new Error('Falha ao reenviar e-mail');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao reenviar o e-mail. Por favor, tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row">
            {/* Left Section - Brand/Image */}
            <div className="w-full md:w-1/2 bg-gradient-to-b from-[#ECD182] to-black flex flex-col items-center justify-center p-8 text-white">
                <a href="/" className="mb-8">
                    <img 
                        src="/image/Icaros-branco.png" 
                        alt="Icaros Logo" 
                        className="w-48 h-auto"
                    />
                </a>
                <h1 className="text-2xl md:text-3xl font-bold text-center mt-4">
                    Desperte e voe até o Sol,<br />
                    venha fazer parte.
                </h1>
            </div>

            {/* Right Section - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 border border-[#ECD182]">
                    <h1 className="text-2xl font-bold text-[#ECD182] mb-6 text-center">
                        AUTENTICAÇÃO
                    </h1>
                    
                    <div className="space-y-4">
                        <p className="text-gray-300 text-center">
                            Foi enviado um código para seu e-mail!
                        </p>
                        
                        <p className="text-gray-400 text-sm text-center">
                            Caso ainda não tenha recebido, por favor clique no botão abaixo.
                        </p>
                        
                        <div className="pt-4">
                            <button
                                onClick={handleResendEmail}
                                className="w-full bg-[#ECD182] hover:bg-[#d9b96a] text-black font-bold py-3 px-4 rounded-lg transition duration-200"
                            >
                                Reenviar E-mail
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-[#ECD182] hover:text-[#d9b96a] text-sm"
                        >
                            Voltar para a página inicial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Autenticacao;