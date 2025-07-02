'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });

    const { token } = response.data;

    localStorage.setItem('token', token);

    router.push('/dashboard');
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login: ' + (error.response?.data?.message || 'Tente novamente'));
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/Logo-ELLP-News2.png"
            alt="Logo ELLP News"
            className="w-70 object-contain "
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl px-12 py-12 font-semibold text-center text-black">
          Acesso Administrativo
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Senha */}
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Lembrar & Esqueceu */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Lembrar de mim
            </label>

            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => alert('Função "Esqueceu a senha?" ainda não implementada')}
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
