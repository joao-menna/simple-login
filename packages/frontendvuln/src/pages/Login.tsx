import { useState } from 'react';
import { useNavigate } from 'react-router';
import { userService } from '../services/UserService';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      setMessage(username);
      await userService.login(username, password);
      navigate('/my-account');
    } catch (err) {
      setMessage('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="text-gray-500 text-sm mb-1">Welcome back! <span role="img" aria-label="wave">👋</span></div>
          <h2 className="text-2xl font-bold text-gray-900">Login to your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.021-2.021A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-1.657.336-3.234.938-4.675M9.879 9.879A3 3 0 0115 12m-6 0a3 3 0 016 0m-6 0a3 3 0 01.879-2.121" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>
        <div className="flex justify-between items-center mt-3 mb-2">
          <a href="#" className="text-blue-500 text-sm hover:underline">Esqueceu a senha?</a>
        </div>
        <div
          className="mt-2 text-center text-gray-700 text-sm"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
}
