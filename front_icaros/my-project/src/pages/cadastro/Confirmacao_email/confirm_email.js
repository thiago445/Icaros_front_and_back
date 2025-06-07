import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailConfirmado = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // troca de página real – vai para o backend (8081)
      window.location.replace('http://localhost:8081/prot/redirect');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* ... JSX igual ... */

  // teste

  // teste

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <img
            src="/image/Icaros-branco.png"
            alt="Logo"
            className="w-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Email Registrado com Sucesso!
          </h1>
        </div>
        <div className="text-gray-600 text-sm space-y-2">
          <p>Bem-vindo! Seu email foi registrado com sucesso.</p>
          <p>Aguarde, você será redirecionado em breve...</p>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Se você não for redirecionado automaticamente,{' '}
            <a href="/prot/redirect" className="text-blue-500 hover:underline">
              clique aqui
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmado;
