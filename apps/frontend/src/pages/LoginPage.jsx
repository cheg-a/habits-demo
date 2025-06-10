import React, { useState } from 'react';
import { loginUser } from '../services/api'; // Import loginUser
import '../App.css'; // Убедитесь, что App.css импортирован

const LoginPage = ({ onLoginSuccess }) => {
  // Состояния для хранения введенных данных
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Состояния для отслеживания процесса входа и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setIsLoading(true); // Включаем состояние загрузки
    setError(''); // Сбрасываем предыдущие ошибки

    try {
      // Используем функцию loginUser из api.js
      const data = await loginUser(username, password);

      // Вызываем колбэк успешного входа и передаем данные о необходимости анкеты
      if (onLoginSuccess) {
        // Проверяем наличие объекта user и свойства needQuestionnaire
        const needQuestionnaire = !!data.needQuestionnaire; // Default to false if not present
        
        // Передаем информацию о dailyReport и isDefaultPassword
        onLoginSuccess(
          needQuestionnaire, 
          data.dailyReport, 
          data.isDefaultPassword === true
        );
      }

    } catch (err) {
      // Обрабатываем ошибки (уже обработанные в loginUser, но можно добавить специфичную логику)
      setError(err.message || 'Произошла ошибка при входе.'); // Используем сообщение из ошибки, если есть
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h1 className="login-title">Вход в систему</h1>
          <p className="login-subtitle">Добро пожаловать! Пожалуйста, введите ваши данные.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите ваше имя пользователя"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;