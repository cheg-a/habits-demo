import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api'; // Import loginUser
import NeonSpinner from '../components/NeonSpinner'; // Import NeonSpinner

// Helper function (can be moved to a utils file if used elsewhere)
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(username, password);
      if (onLoginSuccess) {
        const needQuestionnaire = !!data.needQuestionnaire;
        const dailyReportData = data.dailyReport;
        const isDefaultPassword = data.isDefaultPassword === true;
        onLoginSuccess(needQuestionnaire, dailyReportData, isDefaultPassword);
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при входе.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-dark p-4 animate-fadeIn">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent-cyan mb-2">Вход в систему</h1>
          <p className="text-gray-400">Добро пожаловать! Пожалуйста, введите ваши данные.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="form-error-message p-3 bg-red-700/30 text-red-400 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="form-label">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input mt-1 ${error && !password ? 'form-input-error' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите ваше имя пользователя"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input mt-1 ${error ? 'form-input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full btn ${isLoading ? 'btn-disabled' : 'btn-primary'} py-3 text-lg flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <NeonSpinner size="w-5 h-5" color="text-white" />
                <span className="ml-2">Вход...</span>
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default LoginPage;